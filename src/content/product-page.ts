import type { DocumentId } from "@/content/documents";
import type { Step } from "@/content/how-it-works";
import type { ProductFilm } from "@/content/product-films";
import type { Platform, ProductId } from "@/content/products";

/**
 * The shape both product pages share: `/coral` and `/amoeba`.
 *
 * One template, two contents. The page reads the same way for both products, so
 * its words are data and each product's live in its own file (`coral-page.ts`,
 * `amoeba-page.ts`), verbatim from the mocks. What another page already says
 * about a product (what it runs on, the home page's line for it, its How it
 * works cards and the line under them, its one-pager's file) is not copied
 * here: each page file points at that content, so the two surfaces cannot drift
 * apart.
 *
 * ─── THE ORDER ─────────────────────────────────────────────────────────────
 * Hero (one screen over the data grid film: the product's mark and name, its
 * name for search, the home page's line for it, one button and the stores that
 * list it) → What is <product>?, beside What <product> does → the film band,
 * once the film is on YouTube → How it works (the page's one band) → Read more
 * → the closing row (the noise cut, the details left to each product's guide
 * and FAQ).
 */

/** The words the template itself prints around a product's name. */
export const productPageWords = {
  /** "Coral is available in AWS Marketplace and Microsoft Marketplace": after the name. */
  available: " is available in",
} as const;

/**
 * Each offering's 88×52 drawing under What <product> does, verbatim from the
 * mock (`product_sections.py`): Coral's cost line, requests against use, a pod
 * fitted to its use and a node emptied and removed; Amoeba's used space per
 * disk, the cost with its saved part, and a pool losing a disk.
 */
export type OfferingDrawing = "cost" | "requests" | "fit" | "drain" | "disks" | "saving" | "pool";

/**
 * One offering: a row under "What <product> does", its drawing, its title and
 * one line under it (the same lines as the GitHub org page). The row's id is
 * an address: a link to `/coral#node-optimization` lands on it and holds it.
 */
export interface Offering {
  /** The row's id. */
  readonly id: string;
  /** The row's h3, and the app's feature in the structured data. */
  readonly label: string;
  readonly drawing: OfferingDrawing;
  /** The row's line, under its title. */
  readonly line: string;
}

/**
 * A tile in the Read more row: a page (the guide, the FAQ) with an arrow, or a
 * download (the one-pager) that prints its file's facts, measured at build,
 * where a page prints its line.
 */
export type ReadMoreTile =
  | {
      readonly kind: "page";
      /** A product's name in it is kept out of translation. */
      readonly title: string;
      readonly line: string;
      readonly href: string;
    }
  | {
      readonly kind: "download";
      readonly title: string;
      /** The published file; its path, its facts and its spoken name come from `documents.ts`. */
      readonly document: DocumentId;
    };

export interface ProductPageContent {
  readonly product: ProductId;
  readonly meta: {
    /** Goes through the layout's "%s | Zoorik" template; the card repeats it in full. */
    readonly title: string;
    /** The meta description, and the card's. */
    readonly description: string;
    /** The app's description in the structured data, left as the mocks have
     *  it. */
    readonly appDescription: string;
  };
  readonly hero: {
    /** The h1: the product's search term, and nothing else. */
    readonly title: string;
    /** The line under it: the home page's own line for the product, read from
     *  its section (`kubernetes.ts`, `elastic.ts`), never copied. */
    readonly line: string;
    /** One button, same tab, to this product's assessment. */
    readonly cta: { readonly label: string; readonly href: string };
  };
  /** What is <product>? (`#about-<product>`): the lead paragraph, then the
   *  others behind "More about <product>"; beside them What <product> does. */
  readonly about: {
    readonly title: string;
    /** The first is the lead; the rest stay in the page, folded. */
    readonly paragraphs: readonly [string, ...string[]];
    /** The opener's words: "More about Coral". */
    readonly more: string;
  };
  /** The rows under What <product> does, top to bottom. */
  readonly offerings: readonly Offering[];
  readonly what: {
    /** The h2 over the rows, as the tour mock prints it: the title and a "?"
     *  (the mock appends it; not a typo to fix here). */
    readonly heading: string;
    /** The "Runs on" chips under the rows, as on the home page's blocks. */
    readonly runsOn: { readonly label: string; readonly platforms: readonly Platform[] };
  };
  /** The product's 2-minute film: the band after What is <product>?, drawn
   *  only once the film is on YouTube. */
  readonly film: ProductFilm;
  readonly how: {
    readonly title: string;
    readonly steps: readonly Step[];
    /** Under the cards: what their figures are (`workedExample`, savings.ts). */
    readonly example: string;
  };
  readonly readMore: {
    readonly title: string;
    readonly allDocs: { readonly label: string; readonly href: string };
    /** Only what is published. Empty, and the page draws no Read more row at all. */
    readonly tiles: readonly ReadMoreTile[];
  };
}
