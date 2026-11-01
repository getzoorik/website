/**
 * The blocks of open prose the 1 Nov 2026 pages print in the Learn frame: the two Topic pages (`topic-pages.ts`) and
 * the sections the two newer versus pages add after their table (`learn-compare.ts`). Each text is its draft's small
 * markup, drawn by `richText`: `code`, [text](href), **bold**, straight quotes curled, the names kept out of
 * translation, a figure kept with its unit. A link to a Learn article or a glossary term that is not published yet is
 * drawn as its words (`ProseBlocks`), so a page never links a 404.
 */

/** A table: its head, the widths its colgroup sets, then its rows, one text a cell. */
export interface ProseTable {
  readonly head: readonly string[];
  readonly widths: readonly string[];
  readonly rows: readonly (readonly string[])[];
}

/** A link out of the site, in a box of its own (Microsoft Cost Management's, on /azure-cost-optimization). */
export interface ProseLinkBox {
  readonly title: string;
  readonly links: readonly { readonly label: string; readonly href: string }[];
}

export type ProseBlock =
  | { readonly kind: "p"; readonly text: string }
  | { readonly kind: "ul"; readonly items: readonly string[] }
  | { readonly kind: "ol"; readonly items: readonly string[] }
  /** A heading inside a section; its id only where the draft gives one. */
  | { readonly kind: "h3"; readonly text: string; readonly id?: string }
  | ({ readonly kind: "table" } & ProseTable)
  | ({ readonly kind: "links" } & ProseLinkBox);

/** A section of the frame: its name beside its text from 981px, its chip on a phone. */
export interface ProseSection {
  readonly id: string;
  readonly title: string;
  readonly blocks: readonly ProseBlock[];
}

/** One question, closed, with its answer. */
export interface ProseQuestion {
  readonly question: string;
  readonly answer: string;
}

/** A Read more tile: its title, where it leads and its one line. */
export interface ProseTile {
  readonly title: string;
  readonly href: string;
  readonly line: string;
}

/* The drafts' blocks, written as the drafts write them. */
export const p = (text: string): ProseBlock => ({ kind: "p", text });
export const ul = (...items: string[]): ProseBlock => ({ kind: "ul", items });
export const ol = (...items: string[]): ProseBlock => ({ kind: "ol", items });
export const h3 = (text: string, id?: string): ProseBlock =>
  id ? { kind: "h3", text, id } : { kind: "h3", text };
