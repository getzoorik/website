import { deflateSync } from "node:zlib";

import { describe, expect, it } from "vitest";

import { formatSize, pageCount, paperName, pdfFacts, readPdfShape } from "./pdf-facts";

/**
 * The reader is tested on PDFs built here, byte by byte, so each structure it
 * claims to read is one it has been shown: a flat tree, a nested tree with an
 * inherited MediaBox, an incremental update, and a PDF 1.5 object stream.
 */

const A4 = "[0 0 594.95996 841.91998]";

/** A classic PDF from object bodies (1-based numbers), with a real xref table. */
function classic(bodies: readonly string[], trailer: string, version = "1.4"): Uint8Array {
  let out = `%PDF-${version}\n%âãÏÓ\n`;
  const offsets: number[] = [];
  bodies.forEach((body, i) => {
    offsets.push(out.length);
    out += `${i + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xref = out.length;
  out += `xref\n0 ${bodies.length + 1}\n0000000000 65535 f \n`;
  for (const at of offsets) out += `${String(at).padStart(10, "0")} 00000 n \n`;
  out += `trailer\n${trailer}\nstartxref\n${xref}\n%%EOF\n`;
  return Buffer.from(out, "latin1");
}

const page = (parent: number, extra = "") =>
  `<</Type /Page /Parent ${parent} 0 R${extra} /Contents 99 0 R>>`;

describe("readPdfShape", () => {
  it("reads a flat page tree: the count and page 1's MediaBox", () => {
    const pdf = classic(
      [
        "<</Type /Catalog /Pages 2 0 R>>",
        "<</Type /Pages /Kids [3 0 R 4 0 R] /Count 2>>",
        page(2, ` /MediaBox ${A4}`),
        page(2, " /MediaBox [0 0 612 792]"),
      ],
      "<</Size 5 /Root 1 0 R>>",
    );
    expect(readPdfShape(pdf)).toEqual({ pages: 2, width: 594.95996, height: 841.91998 });
  });

  it("walks a nested tree to page 1 and takes the MediaBox it inherits", () => {
    /* Chrome's own shape: the root counts every page, the branches count theirs. */
    const pdf = classic(
      [
        "<</Type /Catalog /Pages 2 0 R>>",
        `<</Type /Pages /Kids [3 0 R 4 0 R] /Count 11 /MediaBox ${A4}>>`,
        "<</Type /Pages /Parent 2 0 R /Kids [5 0 R] /Count 8>>",
        "<</Type /Pages /Parent 2 0 R /Kids [] /Count 3>>",
        page(3),
      ],
      "<</Size 6 /Root 1 0 R>>",
    );
    expect(readPdfShape(pdf)).toMatchObject({ pages: 11, width: 594.95996 });
  });

  it("follows an indirect MediaBox", () => {
    const pdf = classic(
      [
        "<</Type /Catalog /Pages 2 0 R>>",
        "<</Type /Pages /Kids [3 0 R] /Count 1>>",
        page(2, " /MediaBox 4 0 R"),
        "[0 0 612 792]",
      ],
      "<</Size 5 /Root 1 0 R>>",
    );
    expect(readPdfShape(pdf)).toEqual({ pages: 1, width: 612, height: 792 });
  });

  it("reads an incremental update: the newer trailer and the newer objects win", () => {
    const base = Buffer.from(
      classic(
        [
          "<</Type /Catalog /Pages 2 0 R>>",
          "<</Type /Pages /Kids [3 0 R] /Count 1>>",
          page(2, " /MediaBox [0 0 612 792]"),
        ],
        "<</Size 4 /Root 1 0 R>>",
      ),
    ).toString("latin1");
    const update =
      `4 0 obj\n<</Type /Catalog /Pages 5 0 R>>\nendobj\n` +
      `5 0 obj\n<</Type /Pages /Kids [3 0 R 6 0 R] /Count 2>>\nendobj\n` +
      `3 0 obj\n${page(5, ` /MediaBox ${A4}`)}\nendobj\n` +
      `trailer\n<</Size 7 /Root 4 0 R /Prev 9>>\n%%EOF\n`;
    expect(readPdfShape(Buffer.from(base + update, "latin1"))).toMatchObject({
      pages: 2,
      width: 594.95996,
    });
  });

  it("reads objects packed in a compressed object stream (PDF 1.5)", () => {
    const packed = ["<</Type /Catalog /Pages 2 0 R>>", "<</Type /Pages /Kids [3 0 R] /Count 4>>"];
    let header = "";
    let body = "";
    packed.forEach((obj, i) => {
      header += `${i + 1} ${body.length} `;
      body += `${obj}\n`;
    });
    const data = deflateSync(Buffer.from(header + body, "latin1"));
    const stream = Buffer.concat([
      Buffer.from(
        `%PDF-1.5\n9 0 obj\n<</Type /ObjStm /N 2 /First ${header.length} /Filter /FlateDecode /Length ${data.length}>>\nstream\n`,
        "latin1",
      ),
      data,
      Buffer.from(
        `\nendstream\nendobj\n3 0 obj\n${page(2, ` /MediaBox ${A4}`)}\nendobj\n` +
          `10 0 obj\n<</Type /XRef /Root 1 0 R /Size 11>>\nstream\nendstream\nendobj\n%%EOF\n`,
        "latin1",
      ),
    ]);
    expect(readPdfShape(stream)).toMatchObject({ pages: 4, height: 841.91998 });
  });

  it("throws, with a reason, instead of guessing", () => {
    expect(() => readPdfShape(Buffer.from("<html></html>"))).toThrow(/not a PDF/);
    expect(() => readPdfShape(classic(["<<>>"], "<</Size 2>>"))).toThrow(/no \/Root/);
    expect(() =>
      readPdfShape(
        classic(
          ["<</Type /Catalog /Pages 2 0 R>>", "<</Type /Pages /Kids [3 0 R] /Count 1>>", page(2)],
          "<</Size 4 /Root 1 0 R>>",
        ),
      ),
    ).toThrow(/no MediaBox/);
  });
});

describe("the printed facts", () => {
  it("name the paper either way up, and know A4 as Chrome writes it", () => {
    expect(paperName(594.95996, 841.91998)).toBe("A4");
    expect(paperName(595, 842)).toBe("A4");
    expect(paperName(842, 595)).toBe("A4");
    expect(paperName(612, 792)).toBe("US Letter");
    expect(() => paperName(500, 500)).toThrow(/unknown paper/);
  });

  it("print decimal megabytes to one decimal, and whole kilobytes under 0.1 MB", () => {
    expect(formatSize(320_958)).toBe("0.3 MB");
    expect(formatSize(145_235)).toBe("0.1 MB");
    expect(formatSize(204_898)).toBe("0.2 MB");
    expect(formatSize(1_049_000)).toBe("1.0 MB");
    expect(formatSize(100_000)).toBe("0.1 MB");
    expect(formatSize(99_999)).toBe("100 KB");
    expect(formatSize(76_790)).toBe("77 KB");
    expect(formatSize(300)).toBe("1 KB");
    expect(() => formatSize(0)).toThrow();
  });

  it("count one page, and many pages", () => {
    expect(pageCount(1)).toBe("1 page");
    expect(pageCount(11)).toBe("11 pages");
  });

  it("join into the download line, its plain twin, the short line pages print and the spoken form", () => {
    const pdf = classic(
      [
        "<</Type /Catalog /Pages 2 0 R>>",
        `<</Type /Pages /Kids [3 0 R] /Count 1 /MediaBox ${A4}>>`,
        page(2),
      ],
      "<</Size 4 /Root 1 0 R>>",
    );
    const facts = pdfFacts(pdf);
    expect(facts.line).toBe("PDF · 1 page · 1 KB · A4");
    expect(facts.plain).toBe("PDF · 1 page · 1 KB · A4");
    /* The figures keep their unit on the same line; the dot between them may break. */
    expect(facts.short).toBe("1\u00a0page · 1\u00a0KB");
    expect(facts.spoken).toBe("PDF, 1 page, 1 KB, A4");
  });
});
