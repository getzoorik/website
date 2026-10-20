import type { ProductId } from "@/content/products";

/**
 * The two cloud marketplaces Zoorik is listed in, and each product's listing in
 * them.
 *
 * 🔴 THE STORES' OWN WORDS. "AWS Marketplace" and "Microsoft Marketplace" in
 * full, "in" for both, text only: no store logo, whose licence is the store's,
 * and no trademark line.
 *
 * 🔴 AMOEBA IS IN MICROSOFT MARKETPLACE ONLY. Its AWS entry is `null` until a
 * listing exists there, so each Amoeba line names the stores that list it and
 * no Coral fallback. Buttons that name no product (the footer, /about) open
 * Zoorik's own page in each store, where both products are listed; the
 * structured data claims only the listings that exist. Put each URL here when
 * it is live; nothing else changes.
 */

export type MarketplaceId = "aws" | "microsoft";

export interface Marketplace {
  readonly id: MarketplaceId;
  readonly name: string;
  /** Coral's is always there; Amoeba's is `null` in a store that does not list it yet. */
  readonly listings: { readonly coral: string; readonly amoeba: string | null };
  /** Zoorik's own page in the store, which lists every product it sells there. */
  readonly profile: string;
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
    profile: "https://aws.amazon.com/marketplace/seller-profile?id=seller-mtaavozrqchlk",
  },
  {
    id: "microsoft",
    name: "Microsoft Marketplace",
    listings: {
      coral: "https://marketplace.microsoft.com/en-us/product/zoorik.coral",
      amoeba: "https://marketplace.microsoft.com/en-us/product/zoorik.amoeba",
    },
    profile:
      "https://marketplace.microsoft.com/en-us/partners/04f64eb0-8878-4f14-9578-bc5d104737e7/overview",
  },
];

/** Zoorik's own page in each store, which its structured data lists among its profiles. */
export const storeProfiles: readonly string[] = marketplaces.map(
  (marketplace) => marketplace.profile,
);

/** The line's own words: "Available in" one store "and" the other; a line that
 *  names its product reads "<name> is available in" (the home hero). */
export const marketplaceWords = {
  lead: "Available in",
  namedLead: " is available in",
  join: " and ",
} as const;

/** The stores that list a product, in the line's order: Microsoft Marketplace alone for Amoeba. */
export function storesListing(product: ProductId): readonly Marketplace[] {
  return marketplaces.filter((marketplace) => marketplace.listings[product] !== null);
}

/** Where a link to one store goes: the product's listing, or Zoorik's page there when it names no product. */
export function marketplaceListing(marketplace: Marketplace, product?: ProductId): string {
  return (product && marketplace.listings[product]) ?? marketplace.profile;
}

/** The listings a product really has, for its structured data's `sameAs`. */
export function liveListings(product: ProductId): readonly string[] {
  return marketplaces
    .map((marketplace) => marketplace.listings[product])
    .filter((listing): listing is string => listing !== null);
}
