import { inflateSync } from "node:zlib";

/**
 * The facts a download line prints about a PDF: its page count, its size and
 * its paper. Read from the file itself, never typed, so the line stays true
 * when the file is rebuilt.
 *
 * ─── A SMALL READER, NOT A PDF LIBRARY ─────────────────────────────────────
 * Two facts need the file's structure: the page count (the page tree's root
 * `/Count`) and page 1's `/MediaBox`. This reads exactly that much. It follows
 * `/Root` to the catalog, the catalog's `/Pages` to the page tree, and the first
 * `/Kids` entry down to page 1, picking up an inherited `/MediaBox` on the way.
 * Objects may sit at the top level or, in PDF 1.5 files, inside a compressed
 * object stream; both are read. A later definition of an object number replaces
 * an earlier one, which is how an incremental update reads.
 *
 * 🔴 IT THROWS RATHER THAN GUESSES. A file it cannot read, or a paper size it
 * does not know, stops the build with the reason. A download line with a wrong
 * or invented figure is worse than a red build.
 *
 * Node only (it inflates object streams with `node:zlib`). It runs at build,
 * when the pages that print these facts are prerendered.
 */

export interface PdfShape {
  /** The page tree's own count. */
  readonly pages: number;
  /** Page 1's MediaBox, in points, as drawn (before any /Rotate). */
  readonly width: number;
  readonly height: number;
}

const REF = String.raw`(\d+)\s+\d+\s+R`;

/** Bytes as a string, one char per byte (ISO-8859-1, exactly; TextDecoder's
 *  "latin1" is windows-1252 and would remap 0x80-0x9F). */
const latin1 = (bytes: Uint8Array) =>
  Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString("latin1");

/** Every object body by number, the last definition winning. */
function readObjects(bytes: Uint8Array): Map<number, string> {
  const text = latin1(bytes);
  const objects = new Map<number, string>();
  const streams: string[] = [];

  const head = /(\d+)\s+\d+\s+obj\b/g;
  for (let match = head.exec(text); match; match = head.exec(text)) {
    const start = match.index + match[0].length;
    const end = text.indexOf("endobj", start);
    if (end < 0) break;
    const body = text.slice(start, end);
    objects.set(Number(match[1]), body);
    if (/\/Type\s*\/ObjStm\b/.test(body)) streams.push(body);
    head.lastIndex = end;
  }

  /* Object streams: "N First" pairs, then the objects themselves. An object
     already defined at the top level keeps that definition. */
  for (const body of streams) {
    const n = Number(/\/N\s+(\d+)/.exec(body)?.[1]);
    const first = Number(/\/First\s+(\d+)/.exec(body)?.[1]);
    const data = streamData(body);
    if (!data || !Number.isFinite(n) || !Number.isFinite(first)) continue;
    const content = latin1(data);
    const pairs = content.slice(0, first).trim().split(/\s+/).map(Number);
    for (let i = 0; i < n; i += 1) {
      const number = pairs[2 * i];
      const offset = pairs[2 * i + 1];
      const next = i + 1 < n ? pairs[2 * i + 3] : content.length - first;
      if (number === undefined || offset === undefined || next === undefined) break;
      if (!objects.has(number)) {
        objects.set(number, content.slice(first + offset, first + next));
      }
    }
  }

  return objects;
}

/** A stream object's bytes, inflated when the stream is Flate-encoded. */
function streamData(body: string): Uint8Array | null {
  const at = /stream\r?\n/.exec(body);
  if (!at) return null;
  const start = at.index + at[0].length;
  const end = body.lastIndexOf("endstream");
  if (end < start) return null;
  const raw = Buffer.from(body.slice(start, end), "latin1");
  const filter = /\/Filter\s*\/(\w+)/.exec(body)?.[1];
  if (!filter) return raw;
  if (filter !== "FlateDecode") return null;
  try {
    return inflateSync(raw);
  } catch {
    return null;
  }
}

/** The dictionary part of an object, without its stream. */
const dictOf = (body: string) => body.split(/\bstream\r?\n/)[0] ?? body;

function numbersOf(array: string): number[] {
  return array.trim().split(/\s+/).filter(Boolean).map(Number);
}

/** Reads the page count and page 1's size, or throws with the reason. */
export function readPdfShape(bytes: Uint8Array): PdfShape {
  const text = latin1(bytes);
  if (!text.startsWith("%PDF-")) throw new Error("not a PDF: no %PDF- header");

  const objects = readObjects(bytes);
  const get = (number: number, what: string): string => {
    const body = objects.get(number);
    if (body === undefined) throw new Error(`PDF: ${what} (object ${number}) is missing`);
    return dictOf(body);
  };

  /* The last /Root wins: an incremental update appends a newer trailer. */
  const roots = [...text.matchAll(new RegExp(String.raw`/Root\s+${REF}`, "g"))];
  const root = roots.at(-1)?.[1];
  if (!root) throw new Error("PDF: no /Root in the trailer");
  const catalog = get(Number(root), "the catalog");

  const pagesRef = new RegExp(String.raw`/Pages\s+${REF}`).exec(catalog)?.[1];
  if (!pagesRef) throw new Error("PDF: the catalog names no /Pages");
  const tree = get(Number(pagesRef), "the page tree");

  const pages = Number(/\/Count\s+(\d+)/.exec(tree)?.[1]);
  if (!Number.isInteger(pages) || pages < 1) throw new Error("PDF: the page tree has no /Count");

  /* Down the first branch to page 1, carrying an inherited MediaBox. */
  const mediaBoxOf = (dict: string): number[] | null => {
    const direct = /\/MediaBox\s*\[([^\]]*)\]/.exec(dict)?.[1];
    if (direct !== undefined) return numbersOf(direct);
    const ref = new RegExp(String.raw`/MediaBox\s+${REF}`).exec(dict)?.[1];
    if (ref === undefined) return null;
    const array = /\[([^\]]*)\]/.exec(get(Number(ref), "a MediaBox"))?.[1];
    return array === undefined ? null : numbersOf(array);
  };

  let node = tree;
  let box = mediaBoxOf(node);
  for (let depth = 0; /\/Type\s*\/Pages\b/.test(node); depth += 1) {
    if (depth > 64) throw new Error("PDF: the page tree is too deep");
    const kid = new RegExp(String.raw`/Kids\s*\[\s*${REF}`).exec(node)?.[1];
    if (!kid) throw new Error("PDF: a page tree node has no /Kids");
    node = get(Number(kid), "a page");
    box = mediaBoxOf(node) ?? box;
  }

  if (!box || box.length !== 4 || box.some((v) => !Number.isFinite(v))) {
    throw new Error("PDF: page 1 has no MediaBox");
  }
  const [x0, y0, x1, y1] = box as [number, number, number, number];
  return { pages, width: Math.abs(x1 - x0), height: Math.abs(y1 - y0) };
}

/** Paper sizes in points (portrait). A4 is 595 × 842. */
const PAPERS: readonly { readonly name: string; readonly w: number; readonly h: number }[] = [
  { name: "A4", w: 595.28, h: 841.89 },
  { name: "US Letter", w: 612, h: 792 },
  { name: "US Legal", w: 612, h: 1008 },
  { name: "A3", w: 841.89, h: 1190.55 },
  { name: "A5", w: 419.53, h: 595.28 },
];

/** How far a printed size may sit from the standard: Chrome writes A4 as 594.96 × 841.92. */
const TOLERANCE_PT = 2;

/** The paper's name, either way up; throws for a size it does not know. */
export function paperName(width: number, height: number): string {
  const short = Math.min(width, height);
  const long = Math.max(width, height);
  const paper = PAPERS.find(
    (p) => Math.abs(p.w - short) <= TOLERANCE_PT && Math.abs(p.h - long) <= TOLERANCE_PT,
  );
  if (!paper) throw new Error(`PDF: unknown paper size ${width} × ${height} pt`);
  return paper.name;
}

/**
 * The size as the line prints it: decimal megabytes to one decimal ("0.3 MB"),
 * or whole kilobytes under 0.1 MB ("77 KB"). Decimal, as file managers on macOS
 * and the browser's download list count.
 */
export function formatSize(bytes: number, space = " "): string {
  if (!Number.isFinite(bytes) || bytes <= 0) throw new Error(`not a file size: ${bytes}`);
  if (bytes < 100_000) return `${Math.max(1, Math.round(bytes / 1000))}${space}KB`;
  return `${(bytes / 1_000_000).toFixed(1)}${space}MB`;
}

export const pageCount = (pages: number, space = " ") =>
  `${pages}${space}${pages === 1 ? "page" : "pages"}`;

/** Everything a download line, a facts line or an accessible name needs. */
export interface DocumentFacts {
  readonly pages: number;
  readonly bytes: number;
  readonly paper: string;
  /** As printed: "PDF · 11 pages · 0.3 MB · A4", with a no-break space inside each figure. */
  readonly line: string;
  /** The same with ordinary spaces, for an accessible name. */
  readonly plain: string;
  /**
   * What the pages print beside a PDF link or on a download tile:
   * "11 pages · 0.3 MB". A no-break space between each number and its unit, so
   * a figure never parts from its unit at a line end; a plain " · " between the
   * two.
   */
  readonly short: string;
  /**
   * The facts inside a download's accessible name:
   * "PDF, 11 pages, 0.3 MB, A4", as in "Download the Coral FAQ, PDF, 5 pages,
   * 0.1 MB, A4". Ordinary spaces, commas between: a screen reader pauses there.
   */
  readonly spoken: string;
}

const NBSP = " ";

export function pdfFacts(bytes: Uint8Array): DocumentFacts {
  const shape = readPdfShape(bytes);
  const paper = paperName(shape.width, shape.height);
  const size = bytes.byteLength;
  const parts = (space: string) => [pageCount(shape.pages, space), formatSize(size, space), paper];
  return {
    pages: shape.pages,
    bytes: size,
    paper,
    line: ["PDF", ...parts(NBSP)].join(" · "),
    plain: ["PDF", ...parts(" ")].join(" · "),
    /* No format and no paper: the mocks print neither; the accessible name carries both. */
    short: [pageCount(shape.pages, NBSP), formatSize(size, NBSP)].join(" · "),
    spoken: ["PDF", ...parts(" ")].join(", "),
  };
}
