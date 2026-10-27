import type { Platform, ProductId } from "@/content/products";

/**
 * The shape both product blocks on the home page share.
 *
 * Coral and Amoeba are one layout mirrored: a copy column and, beside it, the
 * product's film (`home-films.ts`); the caption here is the product pages',
 * which print it under How it works. The copy column reads the same way in
 * both: the product's lockup, a plain headline, one short deck, what it runs
 * on, then the button and the link to the product's page. So the shape is
 * declared once here and each product's words live in its own file
 * (`kubernetes.ts`, `elastic.ts`).
 *
 * 🔴 NO PERIOD ON THE HEADLINE, AND NO ACCENT WORD. Both h2s are set plain;
 * only the page's h1 keeps its period. The block has no pill tag with "by
 * Zoorik", no three points and no hover roll on the button.
 */
export interface ProductSectionContent {
  readonly product: ProductId;
  readonly headline: string;
  readonly body: string;
  readonly runsOn: {
    readonly label: string;
    readonly platforms: readonly Platform[];
  };
  /** Same tab, to this product's assessment. */
  readonly cta: {
    readonly href: string;
    readonly label: string;
  };
  /** The text link after the button, to the product's own page: what the page
   *  is about, by its category alone ("Kubernetes cost optimization"). */
  readonly more: string;
  /**
   * What the How it works figures are (from `savings.ts`),
   * printed under the product page's cards (`how.example`). The home page's film
   * has its own line (`home-films.ts`).
   */
  readonly caption: string;
}
