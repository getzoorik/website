import type { ProductId } from "@/content/products";

/**
 * The two cloud marketplaces Zoorik is listed in, and each product's listing in
 * them.
 *
 * 🔴 THE STORES' OWN WORDS. "AWS Marketplace" and "Microsoft Marketplace" in
 * full, "in" for both, text only: no store logo, whose licence is the store's,
 * and no trademark line.
 *
 * 🔴 AMOEBA IS NOT LISTED YET. It will be in both stores.
 * Until a listing exists its entry is `null`, and a product listed in no store
 * draws no line: /amoeba's hero has none, and no Coral fallback. A line or button that names no product (the home
 * hero, the footer) opens Coral's, and the structured data claims only the
 * listings that exist. Put each URL here when it is live; nothing else changes.
 */

export type MarketplaceId = "aws" | "microsoft";

export interface Marketplace {
  readonly id: MarketplaceId;
  readonly name: string;
  /** Coral's is always there: it is the listing every link falls back to. */
  readonly listings: { readonly coral: string; readonly amoeba: string | null };
}

/** AWS first, as the mock's line reads. */
export const marketplaces: readonly Marketplace[] = [
  {
    id: "aws",
    name: "AWS Marketplace",
    listings: {
      coral: "https://aws.amazon.com/marketplace/pp/prodview-kx44lqme4vwys",
      amoeba: null,
    },
  },
  {
    id: "microsoft",
    name: "Microsoft Marketplace",
    listings: {
      coral: "https://marketplace.microsoft.com/en-us/product/zoorik.coral",
      amoeba: null,
    },
  },
];

/** Zoorik's own page in AWS Marketplace, which its structured data lists among
 *  its profiles. */
export const awsSellerProfile =
  "https://aws.amazon.com/marketplace/seller-profile?id=seller-mtaavozrqchlk";

/** The line's own words: "Available in" one store "and" the other; a line that
 *  names its product reads "<name> is available in" (the home hero). */
export const marketplaceWords = {
  lead: "Available in",
  namedLead: " is available in",
  join: " and ",
} as const;

/** The stores that list a product, in the line's order: none for Amoeba yet. */
export function storesListing(product: ProductId): readonly Marketplace[] {
  return marketplaces.filter((marketplace) => marketplace.listings[product] !== null);
}

/** Where a link to one store goes: the product's listing, or Coral's when it names no product. */
export function marketplaceListing(marketplace: Marketplace, product?: ProductId): string {
  return (product && marketplace.listings[product]) ?? marketplace.listings.coral;
}

/** The listings a product really has, for its structured data's `sameAs`. */
export function liveListings(product: ProductId): readonly string[] {
  return marketplaces
    .map((marketplace) => marketplace.listings[product])
    .filter((listing): listing is string => listing !== null);
}
