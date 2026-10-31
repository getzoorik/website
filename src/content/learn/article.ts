import type { AuthorKey } from "@/content/authors";
import type { ProductId } from "@/content/products";

/**
 * A Learn article, as one file under `articles/` writes it: one `Article` per file, named by its slug. The index
 * (`articles.generated.ts`, written by `scripts/gen-learn-index.mjs`) lists every file, and everything per article
 * reads it: the page at its address (`articleRoute`: /learn/<slug>, or its own `route`), its metadata and share card,
 * its structured data, the sitemap and the hub. An article is published when its file is in the index.
 *
 * ─── PLAIN DATA, ONE SMALL MARKUP ──────────────────────────────────────────
 * A run of text is a string, or a list of pieces where a piece is bold, inline code or a link. Product names are
 * written plainly; the page keeps each one out of translation. The curly quotes, the dashes and the no-break space
 * between a figure and its unit ("3 days") are written into the text.
 *
 * ─── THE ANCHOR IDS ARE ADDRESSES ──────────────────────────────────────────
 * An article keeps its hash, so each section's id and each h3 id is a shared address: keep an id when its heading
 * changes.
 */

/** A link on words already in the text: its words may be one piece of inline code. */
export interface ArticleLink {
  readonly a: string | { readonly code: string };
  readonly href: string;
}

/**
 * One piece of a run of text: plain, bold, inline code, or a link on words already in it. Bold may hold a link or
 * code among its words. A link to another site opens in a new tab.
 */
export type ArticleInline =
  | string
  | { readonly b: string | readonly (string | { readonly code: string } | ArticleLink)[] }
  | { readonly code: string }
  | ArticleLink;

/** A run of text: one string, or pieces. */
export type ArticleText = string | readonly ArticleInline[];

/** The diagrams drawn as components in `src/features/learn/article-figures.tsx`. */
export type ArticleFigureId = "vpa-hpa-pair" | "hpa-example" | "requests" | "clash" | "order";

export interface ArticleColumn {
  /** The header; each cell is labelled with its plain words on a phone. */
  readonly label: ArticleText;
  /** The column's share of the table. */
  readonly width: string;
}

/**
 * A diagram drawn for one article: `src/features/learn/figures/<slug>/<n>.ts`, written from its figure file. The page
 * draws it as the file does: its style, scoped to its own class, then the figure.
 */
export interface LearnFigure {
  /** `ln-d fg-<slug>-<n>`: the figure kit's card and the class its style is scoped to. */
  readonly className: string;
  /** What the picture shows, in one sentence after "Diagram.". */
  readonly label: string;
  readonly style: string;
  /** The markup inside the `<figure>`. */
  readonly html: string;
}

/**
 * A drawn figure: `src/features/learn/figures/<slug>/<n>.ts`, written from its drawing. The SVG names
 * itself for a screen reader (its own `role="img"`, title and description) and is drawn as written, under its caption.
 */
export interface LearnSvgFigure {
  /** The `<svg>` element, whole. */
  readonly markup: string;
  readonly caption: ArticleText;
}

/** The labels a callout opens with, each its own kind of aside. */
export type ArticleCalloutLabel =
  "Worked example" | "Rule of thumb" | "Watch out" | "For engineers" | "Note";

/** A list item: its words, and the paragraphs or code under them. */
export type ArticleItem =
  ArticleText | { readonly text: ArticleText; readonly blocks: readonly ArticleBlock[] };

export type ArticleBlock =
  | { readonly kind: "p"; readonly text: ArticleText }
  | { readonly kind: "ul"; readonly items: readonly ArticleItem[] }
  /** A numbered list, counting from `start` where it carries on from an earlier one. */
  | { readonly kind: "ol"; readonly start?: number; readonly items: readonly ArticleItem[] }
  /** Numbered steps, in the guide's accent numerals. */
  | { readonly kind: "steps"; readonly items: readonly ArticleText[] }
  | {
      readonly kind: "table";
      readonly columns: readonly ArticleColumn[];
      /** One run of text per cell, in column order. */
      readonly rows: readonly (readonly ArticleText[])[];
    }
  /** A formula on its own line, set as code. */
  | { readonly kind: "formula"; readonly code: string }
  /** A part of a section, with an id of its own. */
  | { readonly kind: "h3"; readonly id: string; readonly title: string }
  | { readonly kind: "figure"; readonly figure: ArticleFigureId }
  /** A diagram of the article's own (`LearnFigure`). */
  | { readonly kind: "diagram"; readonly figure: LearnFigure }
  /** A drawn figure of the article's own (`LearnSvgFigure`). */
  | { readonly kind: "svg"; readonly figure: LearnSvgFigure }
  /** A paragraph set apart under its label: a worked example, a rule of thumb, a pitfall or a note for engineers. */
  | { readonly kind: "callout"; readonly label: ArticleCalloutLabel; readonly text: ArticleText }
  /**
   * A code well, in the language its fence names. A shell well prints "$ " where each command starts; a YAML or JSON
   * well scrolls sideways rather than wrap; an output well ("text", or none) has no Copy button.
   */
  | { readonly kind: "code"; readonly lang: string; readonly code: string }
  /** Every other published article, under the heading of its `topic`: the cloud cost pillar's last section. */
  | { readonly kind: "every" }
  /** A picture carried as a file in `public/articles/`, with its caption. `srcset` offers smaller copies by width. */
  | {
      readonly kind: "image";
      readonly src: string;
      readonly srcset?: string;
      readonly alt: string;
      readonly caption: string;
      readonly width: number;
      readonly height: number;
    }
  /** A question set apart. */
  | { readonly kind: "quote"; readonly text: ArticleText }
  /** A line in italics: fine print, or the author's closing line. */
  | { readonly kind: "note"; readonly text: ArticleText };

export interface ArticleSection {
  readonly id: string;
  readonly title: string;
  readonly blocks: readonly ArticleBlock[];
}

/** A step of the strip under the short answer, its icon by name. */
export interface ArticleStripStep {
  readonly icon: "pod-v" | "pods" | "check";
  readonly text: string;
}

/**
 * A source: its publisher and its title when the article names them (an article that names neither prints the
 * address), and the words after the link, where there are any.
 */
export interface ArticleSource {
  readonly publisher?: string;
  readonly title?: string;
  readonly url: `https://${string}`;
  readonly note?: string;
}

/**
 * A Related tile: its words, where its page lives ("Learn", "Coral FAQ") and the address. A tile to another article
 * shows that article's h1 once it is published, and its own words, unlinked, until then.
 */
export interface ArticleRelated {
  readonly title: string;
  readonly where: string;
  readonly href: string;
}

/** "How Coral helps": the product it names, one paragraph and its links. */
export interface ArticleHelp {
  readonly product: ProductId;
  readonly text: ArticleText;
  readonly links: readonly { readonly label: string; readonly href: string }[];
}

/** The hub's three subjects, as an article's `hub` names its own. */
export type LearnHubGroup = "Cloud cost" | "Kubernetes" | "Block storage";

/** The headings the cloud cost pillar lists every article under, in its order. */
export const learnTopics = [
  "Cloud cost",
  "Kubernetes cost basics",
  "Kubernetes autoscaling",
  "Node lifecycle and scheduling",
  "Kubernetes storage",
  "Azure block storage",
  "AWS block storage",
  "Linux filesystems",
] as const;

export type LearnTopic = (typeof learnTopics)[number];

export interface Article {
  /** The file's name, and the page's address, /learn/<slug>, where it has no `route`. */
  readonly slug: string;
  /** Its address when it is not /learn/<slug>: a page at the site's root, at the address of its search (D230). */
  readonly route?: `/${string}`;
  /** The `<title>`, through the site's template, and the share card's title. */
  readonly title: string;
  /** The meta description. */
  readonly meta: string;
  readonly h1: string;
  /** The line under the h1. */
  readonly deck: string;
  /** The line under the title on the hub's card. */
  readonly card: string;
  /** The product the article is about, or both. */
  readonly product: ProductId | "both";
  /** The hub subject it is filed under. */
  readonly hub: LearnHubGroup;
  /** The heading it sits under in the pillar's list of every article. */
  readonly topic: LearnTopic;
  /** A comparison's two sides, drawn on its hub card's cover. */
  readonly versus?: readonly [string, string];
  /** The day it was published, as an ISO day: the byline, the hub card and the structured data. */
  readonly published: string;
  /**
   * The day it last changed, as an ISO day: the byline where it differs from `published`, the sitemap and the
   * structured data.
   */
  readonly updated: string;
  /** Who wrote it: an author's key in `authors.ts`, or "zoorik" when it is published under the company alone. */
  readonly author: AuthorKey | "zoorik";
  /** Its drawn cover (1200 × 630 WebP in `public/learn-covers/`), under the byline. */
  readonly cover?: `/learn-covers/${string}.webp`;
  /** The cover's alt text, where the draft gives one (`cover_alt`); without it the cover is read as decoration. */
  readonly coverAlt?: string;
  /** The answer after "Short answer.", first in the column. An essay has none. */
  readonly short?: ArticleText;
  readonly strip?: readonly ArticleStripStep[];
  /** An essay's opening before its first heading, under the byline in place of the short answer. */
  readonly lead?: readonly ArticleBlock[];
  readonly sections: readonly ArticleSection[];
  /** "How Coral helps", or Amoeba. An essay has none. */
  readonly help?: ArticleHelp;
  /**
   * Its inline code breaks only after a dot or a slash, and never inside a short hyphenated name, as the guides set
   * it. Without it, inline code is set as written and breaks wherever it must.
   */
  readonly breakCode?: true;
  /** An article that cites none has no Sources line. */
  readonly sources?: readonly ArticleSource[];
  readonly related: readonly ArticleRelated[];
}

/** The fixed words of an article page. */
export const articleWords = {
  published: "Published ",
  /** After the published day, only where the article changed since: " · Updated <day>". */
  updated: " · Updated ",
  author: " · By ",
  by: " · Published by ",
  short: "Short answer.",
  sources: "Sources: ",
  related: "Related",
} as const;
