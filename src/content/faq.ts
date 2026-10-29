import type { DocumentId } from "@/content/documents";

/**
 * The shape of an FAQ page's content, shared by `/coral-faq` and `/amoeba-faq`
 * (one template draws both). `Id` is the page's own list of question ids.
 *
 * 🔴 CLIENT ANSWERS ONLY. A question has its h3 and its short answer and
 * nothing else: there is no field for a technical answer, and
 * `src/app/internal-docs.test.ts` fails if one comes back.
 *
 * No answer points at another question by its number: the five that did
 * restate the point, so there is no "(question N)" segment.
 */

/**
 * A run of text: plain, bold, inline code, a link to another page of the site,
 * or a fact still to come.
 *
 * `{ ph }` is a placeholder: its text describes the missing fact, and the page
 * prints "To come: " in front of it, muted. Filling it is replacing the segment
 * with plain or bold text; nothing else changes.
 */
export type FaqInline =
  | string
  | { readonly b: string }
  | { readonly code: string }
  | { readonly href: string; readonly text: string }
  | { readonly ph: string };

/** A line of text: one plain string, or a run of segments. */
export type FaqText = string | readonly FaqInline[];

export interface FaqQuestion<Id extends string> {
  readonly id: Id;
  /** The h3: the short FAQ's wording. */
  readonly question: string;
  /** The short answer, as bullets, shown when the question is opened. */
  readonly short: readonly FaqText[];
}

export interface FaqSection<Id extends string> {
  readonly id: string;
  /** The h2, and the group's chip on a phone. */
  readonly title: string;
  /** A card of the PDF's, as a callout above the group's questions. */
  readonly callout?: { readonly title: string; readonly text: FaqText };
  readonly questions: readonly FaqQuestion<Id>[];
}

/** The one download line after the last group, when the FAQ has a PDF. */
export interface FaqDownload {
  readonly label: string;
  readonly document: DocumentId;
}
