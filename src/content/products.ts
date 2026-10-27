/**
 * The two products, as the site names them.
 *
 * ─── ONE PLACE, BECAUSE THE WORDING IS A RULE ──────────────────────────────
 * Each product has a name and one exact descriptor, and the same two appear in
 * the header's Docs menu, the Docs hub, on `/login` and on `/assessment`:
 *
 *   Coral is "Kubernetes cost optimization on AKS and EKS".
 *   Amoeba is "Block storage cost optimization on Azure and AWS".
 *
 * The site says "optimization" for both, as "cost optimization", the phrase
 * the site is found by; only the legal pages keep "rebalances" and
 * "rightsizes", word for word. Kept in each
 * section's own content file they would be copies of a sentence that may not
 * drift by a word, so they are here and every surface reads them.
 */

export type ProductId = "amoeba" | "coral";

export interface Product {
  readonly id: ProductId;
  readonly name: string;
  /** The one line under the name. Exact: a paraphrase is a different claim.
   *  Its cloud pair is tied with no-break spaces, so a narrow menu or tile never
   *  ends a line on "AKS" or "Azure". */
  readonly descriptor: string;
  /** What the product is, as a search names it: the descriptor without its
   *  platforms. The structured data's sub-category and the site's `knowsAbout`. */
  readonly category: string;
  /** What the product works on, in a word or two: the product switch's line under each name. */
  readonly kind: string;
  /** The product's section on the home page. */
  readonly anchor: string;
}

export const products: Readonly<Record<ProductId, Product>> = {
  amoeba: {
    id: "amoeba",
    name: "Amoeba",
    descriptor: "Block storage cost optimization on Azure\u00a0and\u00a0AWS",
    category: "Block storage cost optimization",
    kind: "Block storage",
    anchor: "#amoeba",
  },
  coral: {
    id: "coral",
    name: "Coral",
    descriptor: "Kubernetes cost optimization on AKS\u00a0and\u00a0EKS",
    category: "Kubernetes cost optimization",
    kind: "Kubernetes",
    anchor: "#coral",
  },
};

/** Coral leads everywhere the two are listed. */
export const productOrder: readonly ProductId[] = ["coral", "amoeba"];

/** The line that follows a product's name in its section tag. */
export const productTagSuffix = "by Zoorik";

/**
 * What a product runs on, and the mark each chip carries.
 *
 * A platform is a claim, so the list is closed: a chip cannot be added by typing
 * a new label into a content file without also saying which mark it draws.
 */
export type Platform = "azure" | "aws" | "aks" | "eks" | "windows" | "linux";

export const platformLabel: Readonly<Record<Platform, string>> = {
  azure: "Azure",
  aws: "AWS",
  aks: "AKS",
  eks: "EKS",
  windows: "Windows",
  linux: "Linux",
};
