import type { ArticleBlock, ArticleSection, ArticleSource } from "@/content/learn/article";
import type { ProductId } from "@/content/products";

/**
 * A glossary term, as one file under `glossary/` writes it: one `GlossaryTerm` per file, named by its slug. The index
 * (`glossary.generated.ts`, written by `scripts/gen-learn-index.mjs`) lists every file, and everything per term reads
 * it: the page at /learn/glossary/<slug>, its metadata and share card, its structured data, the sitemap and the
 * glossary's hub. A term is published when its file is in the index.
 *
 * A term's page is a Learn article's page cut short: the definition where an article has its short answer, then two
 * to four sections in the article's blocks and its one drawn figure, the Related terms as the article's Related tiles,
 * the article to read next, and the sources. No help box, author or cover.
 *
 * ─── PLAIN DATA, THE ARTICLES' MARKUP ──────────────────────────────────────
 * Its text is written as an article's is (`ArticleText`): a string, or pieces where a piece is bold, inline code or a
 * link, with the curly quotes, the dashes and the no-break space between a figure and its unit written in.
 */

/** The glossary's three groups, in the hub's order: Kubernetes, Block storage, FinOps and pricing. */
export type GlossaryGroupId = "kubernetes" | "block-storage" | "finops-pricing";

export const glossaryGroups: readonly { readonly id: GlossaryGroupId; readonly title: string }[] = [
  { id: "kubernetes", title: "Kubernetes" },
  { id: "block-storage", title: "Block storage" },
  { id: "finops-pricing", title: "FinOps and pricing" },
];

/** A Related terms tile: the term's words, the line under them, and its page. */
export interface GlossaryRelated {
  readonly title: string;
  readonly line: string;
  readonly href: `/learn/glossary/${string}`;
}

export interface GlossaryTerm {
  /** The file's name and the page's address: /learn/glossary/<slug>. */
  readonly slug: string;
  /**
   * The term as the glossary's plan names it, its other names in brackets: "Spot instance (AWS Spot Instances, Azure
   * Spot VMs)". The hub files it A–Z by its words before the brackets, and the structured data names it by them.
   */
  readonly term: string;
  /** The `<title>`, through the site's template, and the share card's words. */
  readonly title: string;
  /** The meta description. */
  readonly meta: string;
  readonly h1: string;
  /** The line under the h1 on the hub: the definition's first sentence, in plain words. */
  readonly card: string;
  /** The hub group it is filed under. */
  readonly group: GlossaryGroupId;
  /** The product its page names, or both. */
  readonly product: ProductId | "both";
  /** The day it was published, as an ISO day. */
  readonly published: string;
  /** The day it last changed, as an ISO day: the page's Updated line, the sitemap. */
  readonly updated: string;
  /** What stands before the first heading: the definition first, then any list, command or figure with it. */
  readonly definition: readonly ArticleBlock[];
  /** The sections, "Why it matters for your cloud cost" among them; Related terms is `related`. */
  readonly sections: readonly ArticleSection[];
  readonly related: readonly GlossaryRelated[];
  /** "Read next": the Learn article the term leads to, at its address, by the words the draft gives it. */
  readonly next: { readonly title: string; readonly href: `/${string}` };
  readonly sources: readonly ArticleSource[];
}

/** The fixed words of a term's page; " · Published by " and "Sources: " are the articles' (`articleWords`). */
export const glossaryWords = {
  updated: "Updated ",
  next: "Read next:",
  related: "Related terms",
} as const;
