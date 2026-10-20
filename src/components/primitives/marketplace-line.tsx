import { Fragment, type JSX } from "react";

import { ExternalArrow } from "@/components/primitives/external-arrow";
import { NewTabHint } from "@/components/primitives/new-tab-hint";
import { marketplaceListing, marketplaceWords, storesListing } from "@/config/marketplaces";
import { products, type ProductId } from "@/content/products";
import { offSiteProps } from "@/lib/links";

/**
 * "Available in AWS Marketplace and Microsoft Marketplace", each store's name a
 * link to the listing.
 *
 * One quiet line under the button in the marketing heroes (`hero-mkt`, with the
 * bag). Both stores leave the site, so each link opens a new tab and says so
 * twice, as the mock draws it: the hidden phrase after the name, then the arrow.
 * The footer draws the stores as buttons instead (`MarketplaceButtons`).
 *
 * The home hero passes `named`: the line names the product it is about, "Coral
 * is available in …", and opens Coral's listings.
 * A product's own hero passes `product`: its links open that product's
 * listings, and each says whose they are to a screen reader ("Coral in AWS
 * Marketplace"), so the page never has two links of the same name going to
 * different listings.
 *
 * 🔴 A PRODUCT LISTED IN NO STORE DRAWS NO LINE. Only the stores that list the
 * product are named, and Amoeba is in neither yet, so /amoeba's hero has no
 * line at all, and no Coral fallback. It appears the day Amoeba's listings
 * go into `marketplaces.ts`.
 *
 * One departure from the mock: the hidden "Coral" in
 * "Coral in AWS Marketplace" is kept out of translation, as everywhere the name
 * is printed.
 */
export function MarketplaceLine({
  className,
  product,
  icon = false,
  named = false,
}: {
  readonly className: "hero-mkt";
  readonly product?: ProductId;
  /** The bag in front. */
  readonly icon?: boolean;
  /** "<product> is available in": the line names its product (Coral's when none is given). */
  readonly named?: boolean;
}): JSX.Element | null {
  const listed = product ?? "coral";
  const stores = storesListing(listed);
  if (stores.length === 0) return null;
  /* A product's own line names it inside each link, for a screen reader; a line
     that names its product in the lead does not repeat it. */
  const whose = product && !named ? product : null;

  return (
    <p className={className}>
      {icon ? <BagIcon /> : null}
      <span>
        {named ? (
          <>
            <span translate="no">{products[listed].name}</span>
            {marketplaceWords.namedLead}
          </>
        ) : (
          marketplaceWords.lead
        )}{" "}
        {stores.map((marketplace, index) => {
          const href = marketplaceListing(marketplace, listed);
          return (
            <Fragment key={marketplace.id}>
              {index > 0 ? marketplaceWords.join : null}
              <a href={href} {...offSiteProps(href)}>
                {whose ? (
                  /* The name stays out of translation, as everywhere it is printed. */
                  <span className="sr-only">
                    <span translate="no">{products[whose].name}</span> in{" "}
                  </span>
                ) : null}
                {marketplace.name}
                <NewTabHint href={href} />
                <ExternalArrow />
              </a>
            </Fragment>
          );
        })}
      </span>
    </p>
  );
}

/** A shopping bag in the site's own line style: no store's mark. */
function BagIcon(): JSX.Element {
  return (
    <svg
      className="mkt-ic"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5.5 8h13l-1 12.2a1 1 0 0 1-1 .8h-9a1 1 0 0 1-1-.8z" />
      <path d="M9 10.5V6.8a3 3 0 0 1 6 0v3.7" />
    </svg>
  );
}
