import { privacySectionIds } from "@/content/privacy";

/**
 * `/terms` reads `src/content/legal/terms-of-use.md` at build and turns it into
 * the blocks the page draws. The terms are approved text, word for word, so the
 * page is the file, never a retyping of it: a change to the terms is a change to
 * that one file.
 *
 * The markdown subset is the file's own, and the parser throws on anything it
 * does not expect, so a new construct fails the build instead of shipping as
 * raw asterisks.
 *
 * ─── HOW THE MOCK DRAWS IT ────────────────────────────────────────────────────
 *  - The "# Terms of Use" title is the hero's h1, not a line of the column.
 *  - "**Effective date:** … · **Version:** …" is the small date line.
 *  - A line that is bold on its own ("**Your part.**") is a run-in head (.pp-k).
 *  - Two paragraphs are callouts: "**Rebalancing and PodDisruptionBudgets.** …",
 *    titled without its full stop, and "Until the original disks …", untitled.
 *  - "Privacy Policy" links to /privacy, and "section N of the Privacy Policy" /
 *    "Privacy Policy, section N" link, as a whole phrase, to that section there.
 *    A bare "section N" links to this page's section N. "Sections 7, 8, 9, 12
 *    to 16, 18 and 19" is a list of sections, not a place, so it stays text.
 */

/** The h2 ids, §1 to §20. A contract: keep an id when its heading changes. */
export const termsSectionIds = [
  "who-we-are",
  "scope",
  "accepting",
  "account",
  "what-changes",
  "proper-use",
  "your-data",
  "processing-for-you",
  "our-software",
  "fees",
  "availability",
  "stopping",
  "no-promises",
  "liability",
  "claims",
  "confidentiality",
  "changes",
  "law-disputes",
  "general",
  "contact",
] as const;

export type TermsInline =
  | string
  | { readonly b: string }
  | { readonly code: string }
  | { readonly mail: string }
  /** A link inside the site: this page's section, or /privacy and its sections. */
  | { readonly href: string; readonly text: string };

export type TermsBlock =
  | { readonly kind: "p"; readonly text: readonly TermsInline[] }
  | { readonly kind: "label"; readonly text: string }
  | { readonly kind: "ul"; readonly items: readonly (readonly TermsInline[])[] }
  | {
      readonly kind: "callout";
      readonly title?: string;
      readonly text: readonly TermsInline[];
    };

export interface TermsSection {
  readonly id: string;
  readonly number: string;
  readonly title: string;
  readonly blocks: readonly TermsBlock[];
}

export interface Terms {
  /** "Effective 6 October 2026 · Version 1.0" */
  readonly effective: string;
  readonly intro: readonly (readonly TermsInline[])[];
  readonly short: readonly (readonly TermsInline[])[];
  readonly sections: readonly TermsSection[];
}

const privacyAt = (n: string): string => {
  const id = privacySectionIds[Number(n) - 1];
  if (!id) throw new Error(`terms: no Privacy Policy section ${n}`);
  return `/privacy#${id}`;
};

const hereAt = (n: string): string => {
  const id = termsSectionIds[Number(n) - 1];
  if (!id) throw new Error(`terms: no section ${n}`);
  return `#${id}`;
};

/*
 * One pass over a run of text. The alternatives are tried left to right at each
 * position, so the whole-phrase Privacy Policy links win over the bare "section N"
 * and "Privacy Policy" they contain.
 */
const TOKEN =
  /\*\*(.+?)\*\*|`([^`]+)`|(section (\d+) of the Privacy Policy)|(Privacy Policy, section (\d+))|(zoorik\.com\/privacy)|(Privacy Policy)|([a-z]+@zoorik\.com)|(\bsection (\d+)\b)/g;

export function inline(text: string): TermsInline[] {
  const out: TermsInline[] = [];
  let last = 0;
  for (const m of text.matchAll(TOKEN)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1] !== undefined) out.push({ b: m[1] });
    else if (m[2] !== undefined) out.push({ code: m[2] });
    else if (m[3] !== undefined) out.push({ href: privacyAt(m[4]!), text: m[3] });
    else if (m[5] !== undefined) out.push({ href: privacyAt(m[6]!), text: m[5] });
    else if (m[7] !== undefined) out.push({ href: "/privacy", text: m[7] });
    else if (m[8] !== undefined) out.push({ href: "/privacy", text: m[8] });
    else if (m[9] !== undefined) out.push({ mail: m[9] });
    else if (m[10] !== undefined) out.push({ href: hereAt(m[11]!), text: m[10] });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const CALLOUT_TITLED = /^\*\*(Rebalancing and PodDisruptionBudgets)\.\*\* (.+)$/;
const CALLOUT_PLAIN = /^Until the original disks are deleted, /;

function blocks(lines: readonly string[]): TermsBlock[] {
  const out: TermsBlock[] = [];
  let list: TermsInline[][] | null = null;
  const flush = () => {
    if (list) out.push({ kind: "ul", items: list });
    list = null;
  };
  for (const line of lines) {
    if (line.trim() === "") {
      flush();
      continue;
    }
    if (line.startsWith("- ")) {
      (list ??= []).push(inline(line.slice(2)));
      continue;
    }
    flush();
    if (/^#/.test(line) || line.startsWith("|")) throw new Error(`terms: unexpected line: ${line}`);
    const titled = CALLOUT_TITLED.exec(line);
    if (titled) out.push({ kind: "callout", title: titled[1], text: inline(titled[2]!) });
    else if (CALLOUT_PLAIN.test(line)) out.push({ kind: "callout", text: inline(line) });
    else if (/^\*\*[^*]+\*\*$/.test(line)) out.push({ kind: "label", text: line.slice(2, -2) });
    else out.push({ kind: "p", text: inline(line) });
  }
  flush();
  return out;
}

export function parseTerms(markdown: string): Terms {
  if (markdown.includes("[OWNER")) throw new Error("terms: an [OWNER: …] placeholder remains");
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  if (lines[0] !== "# Terms of Use") throw new Error("terms: the file must start with its title");

  const date = /^\*\*Effective date:\*\* (.+) · \*\*Version:\*\* (.+)$/.exec(lines[2] ?? "");
  if (!date) throw new Error("terms: the third line must be the effective date and version");
  const effective = `Effective ${date[1]} · Version ${date[2]}`;

  const heads = lines.flatMap((line, index) => (line.startsWith("## ") ? [index] : []));
  if (lines[heads[0]!] !== "## The short version")
    throw new Error("terms: the short version comes first");

  const intro = lines
    .slice(3, heads[0])
    .filter((line) => line.trim() !== "")
    .map(inline);
  const shortBlocks = blocks(lines.slice(heads[0]! + 1, heads[1]));
  if (shortBlocks.length !== 1 || shortBlocks[0]!.kind !== "ul")
    throw new Error("terms: the short version is one list");

  const sections = heads.slice(1).map((start, index) => {
    const head = /^## (\d+)\. (.+)$/.exec(lines[start]!);
    if (!head) throw new Error(`terms: unexpected heading: ${lines[start]}`);
    const id = termsSectionIds[Number(head[1]) - 1];
    if (!id || Number(head[1]) !== index + 1)
      throw new Error(`terms: section ${head[1]} is out of order`);
    return {
      id,
      number: head[1]!,
      title: head[2]!,
      blocks: blocks(lines.slice(start + 1, heads[index + 2])),
    };
  });
  if (sections.length !== termsSectionIds.length) throw new Error("terms: expected 20 sections");

  return { effective, intro, short: shortBlocks[0].items, sections };
}
