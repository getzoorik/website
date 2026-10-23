import { Fragment } from "react";

import { AwsMark, AzureMark } from "@/components/brand/cloud-marks";
import { NewTabHint } from "@/components/primitives/new-tab-hint";
import { marketplaces, marketplaceWords, type MarketplaceId } from "@/config/marketplaces";
import { productOrder, products } from "@/content/products";
import { offSiteProps } from "@/lib/links";

/** Each store's cloud, drawn before its name: the marks the "Runs on" chips draw. */
const storeMark: Record<MarketplaceId, () => React.JSX.Element> = {
  aws: () => <AwsMark className="aws" />,
  microsoft: () => <AzureMark idSuffix="hero-mkt" />,
};

/**
 * The home hero's one quiet line: "Coral and Amoeba are available in AWS
 * Marketplace and Microsoft Marketplace", each store's name a link to every
 * Zoorik product it lists (`catalogue`).
 *
 * The mock's `hx-mkt` (23 Oct 2026, "marks over words"): each store opens on
 * its cloud's mark where the old line had a bag in front, and the line takes no
 * arrow after the names. Each link still opens a new tab and says so to a
 * screen reader. The product names are kept out of translation.
 */
export function HeroMarketplaces(): React.JSX.Element {
  return (
    <p className="hx-mkt">
      {productOrder.map((id, index) => (
        <Fragment key={id}>
          {index > 0 ? marketplaceWords.join : null}
          <span translate="no">{products[id].name}</span>
        </Fragment>
      ))}
      {/* One text node with its space, as the mock's, so the line ends where the mock's does. */}
      {`${marketplaceWords.namedLead} `}
      {marketplaces.map((marketplace, index) => {
        const Mark = storeMark[marketplace.id];
        return (
          <Fragment key={marketplace.id}>
            {index > 0 ? marketplaceWords.join : null}
            <a href={marketplace.catalogue} {...offSiteProps(marketplace.catalogue)}>
              <Mark />
              {marketplace.name}
              <NewTabHint href={marketplace.catalogue} />
            </a>
          </Fragment>
        );
      })}
    </p>
  );
}
