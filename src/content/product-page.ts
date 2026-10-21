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
 * about a product (what it runs on, its How it works cards and the line under
 * them, its one-pager's file) is not copied here: each page file points at that
 * content, so the two surfaces cannot drift apart.
 *
 * ─── THE ORDER ─────────────────────────────────────────────────────────────
 * Hero (the product's badges, its name for search, its offerings as tags, its
 * button, and the savings figures on its right) → What is <product>?, beside
 * What <product> does → the film band, once the film is on YouTube → How it
 * works (the page's one band) → Read more → the closing row (the noise cut, the
 * details left to each product's guide and FAQ).
 */

/** The offering icons, verbatim from the mock; the hero tag and its row draw the same one. */
export type OfferingIcon = "monitor" | "reco" | "workload" | "node" | "savings" | "storage";

/**
 * One offering: a tag in the hero and a row under "What <product> does".
 *
 * 🔴 ONE RECORD FOR BOTH, ON PURPOSE. The tag is a link to `#id` and the row is
 * the element with that id, so built from one record a tag can never point at a
 * row that is not there, or name it differently. The row is its title and one
 * line under it (the same lines as the GitHub org page).
 */
export interface Offering {
  /** The row's id, and the tag's `#id`. */
  readonly id: string;
  /** The tag's label and the row's h3. */
  readonly label: string;
  readonly icon: OfferingIcon;
  /** The row's line, under its title. */
  readonly line: string;
}

/** A partner autoscaler's logo, drawn beside its name in /coral's hero row. */
export type AutoscalerLogo = "karpenter" | "keda";

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
    /** The second badge, after the common "Built for Azure and AWS": "Supported on" + the product's platforms. */
    readonly supportedOn: { readonly label: string; readonly platforms: string };
    /** "Compatible with your native" + the autoscalers, two with their logos:
     *  Coral's row. Amoeba has none. */
    readonly compatibleWith?: {
      readonly label: string;
      readonly items: readonly { readonly name: string; readonly logo?: AutoscalerLogo }[];
    };
    /** One button, same tab, to this product's assessment. */
    readonly cta: { readonly label: string; readonly href: string };
  };
  /** What is <product>? (`#about-<product>`): three paragraphs, and beside them
   *  What <product> does. The savings figures are on the hero's right. */
  readonly about: {
    readonly title: string;
    readonly paragraphs: readonly string[];
  };
  /** In the hero's order: the tags run left to right as the rows run down. */
  readonly offerings: readonly Offering[];
  readonly what: {
    /** "What <product> does": the hero tags' list name. */
    readonly title: string;
    /** The h2 over the rows, as the tour mock prints it: the title and a "?"
     *  (the mock appends it; not a typo to fix here). */
    readonly heading: string;
    /** The "Runs on" chips under the rows, as on the home page's blocks. */
    readonly runsOn: { readonly label: string; readonly platforms: readonly Platform[] };
  };
  /** The product's 2-minute film: the band after What is <product>?, and the
   *  hero's second button, both drawn only once the film is on YouTube. */
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
