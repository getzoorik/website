import type { DocumentId } from "@/content/documents";

/**
 * The shape of a product guide's content, shared by `/coral/guide` and
 * `/amoeba/guide` (one template draws both). `Id` is the guide's own list of
 * anchors, so a cross-reference can only name a group or a row on its own page.
 *
 * ─── LAID OUT LIKE THE FAQ ─────────────────────────────────────────────────
 * Each section is a group: its name beside its rows, its lede and any callout
 * open over them. Every subsection is a numbered row that opens in place, and
 * what came before a section's first subsection is its first row, under a
 * name of its own ("The four steps", "What you need"). Nothing was removed.
 *
 * ─── PLAIN DATA, ONE SMALL MARKUP ──────────────────────────────────────────
 * The text is data, not JSX: a run of text is a string, or a list of pieces
 * where a piece may be inline code, bold, a line under a table cell's name, a
 * line break, a fact still to come, a link to a group or row of this page, or
 * a link to another page. `src/features/doc-rows/guide-rows.tsx` draws it.
 */

/** One piece of a run of text. */
export type GuideInline<Id extends string> =
  | string
  | { readonly code: string }
  | { readonly b: string }
  /** A table cell's second line: a line break, then the muted `.sub` text. */
  | { readonly sub: string }
  /** A line break inside a table cell: two actions in one cell, one per line. */
  | { readonly br: true }
  /**
   * A fact the sources do not give yet: the page prints "To come: " and this
   * description, muted. Filling one is replacing the piece with plain text.
   */
  | { readonly ph: string }
  /** A cross-reference: it reads as the target's name, never "section 8". */
  | { readonly ref: Id; readonly text: string }
  /** A link to another page of the site. */
  | { readonly href: string; readonly text: string };

/** A run of text: one string, or pieces. */
export type GuideText<Id extends string> = string | readonly GuideInline<Id>[];

export interface GuideColumn {
  readonly label: string;
  /** The column's width in the mock. */
  readonly width: string;
}

/** One system under the install's OS switch. */
export interface GuideOsOption {
  readonly os: "mac" | "linux" | "windows";
  /** The button's label, and the system the copy button names. */
  readonly name: string;
  readonly prompt: "$ " | "PS> ";
  /** The command's lines, without prompts: what Copy copies. */
  readonly lines: readonly string[];
}

export interface GuideCallout<Id extends string> {
  readonly kind: "callout";
  readonly title: string;
  readonly body: readonly GuideBlock<Id>[];
}

export type GuideBlock<Id extends string> =
  | { readonly kind: "p"; readonly text: GuideText<Id> }
  | { readonly kind: "ul"; readonly items: readonly GuideText<Id>[] }
  | { readonly kind: "ol"; readonly items: readonly GuideText<Id>[] }
  /** A group subhead between continuation tables: `h3.doc-sub`, with no id. */
  | { readonly kind: "subhead"; readonly title: string }
  | {
      readonly kind: "steps";
      readonly steps: readonly {
        readonly title: string;
        readonly body: readonly GuideBlock<Id>[];
      }[];
    }
  | GuideCallout<Id>
  | {
      readonly kind: "table";
      readonly columns: readonly GuideColumn[];
      readonly rows: readonly (readonly GuideText<Id>[])[];
      readonly continuation?: true;
    }
  /**
   * A command well with no copy button: connect and disconnect (one line each),
   * the YAML example, and a line that is still a placeholder (it wraps).
   */
  | {
      readonly kind: "well";
      /** The command's lines, without prompts. */
      readonly lines: readonly GuideText<Id>[];
      readonly prompt?: "$ ";
      readonly yaml?: true;
      /** The line under the well. */
      readonly note?: string;
    }
  /** The install: one well under the [macOS | Linux | Windows] switch, with its copy button. */
  | { readonly kind: "os"; readonly options: readonly GuideOsOption[] };

/** One row: a subsection, opening in place onto its text. */
export interface GuideRow<Id extends string> {
  readonly id: Id;
  readonly title: string;
  readonly body: readonly GuideBlock<Id>[];
}

/** One group: a section of the guide. */
export interface GuideSection<Id extends string> {
  readonly id: Id;
  readonly title: string;
  /** The muted line over the rows. */
  readonly lede: GuideText<Id>;
  /** Callouts that stay open over the rows. */
  readonly callouts?: readonly GuideCallout<Id>[];
  readonly rows: readonly GuideRow<Id>[];
  /** "Related:" and up to two links after the rows. */
  readonly related?: readonly { readonly text: string; readonly href: string }[];
}

export interface GuideContent<Id extends string> {
  readonly meta: { readonly title: string; readonly description: string };
  readonly hero: {
    readonly title: string;
    readonly deck: string;
    /** The download block's rows; none while the guide has no PDF. */
    readonly downloads: readonly { readonly label: string; readonly document: DocumentId }[];
  };
  /** "Updated 9 October 2026": the column's first line. */
  readonly updated: string;
  /** The summary list over the groups: each term, then its paragraphs. */
  readonly summary: readonly { readonly term: string; readonly text: readonly GuideText<Id>[] }[];
  readonly sections: readonly GuideSection<Id>[];
}
