import type { JSX } from "react";

import { AwsMark, AzureMark } from "@/components/brand/cloud-marks";
import { ExternalArrow } from "@/components/primitives/external-arrow";
import { NewTabHint } from "@/components/primitives/new-tab-hint";
import { marketplaceListing, marketplaces, type MarketplaceId } from "@/config/marketplaces";
import { offSiteProps } from "@/lib/links";

/**
 * The two stores as buttons, each its mark, its name and the new-tab arrow
 * (text links read as links and logos alone don't, so both together).
 *
 * The footer draws them under the badge with the lead-in "Available in"
 * (`foot-mb`); /about draws them under its own "Available on" heading, with no
 * lead-in, 48px tall (`ab-mb`). They name no product, so each opens Zoorik's
 * own page in that store, which lists both products (`marketplaces.ts`).
 *
 * The marks are the ones the site already draws in "Built for Azure and AWS":
 * the AWS smile, the Azure "A". `idSuffix` keeps each copy's Azure gradient ids
 * apart, as the mock does, on a page that draws the buttons twice.
 */
export function MarketplaceButtons({
  className,
  idSuffix,
  label,
}: {
  readonly className: string;
  readonly idSuffix: string;
  /** A lead-in ("Available in") where no heading says it. */
  readonly label?: string;
}): JSX.Element {
  return (
    <div className={`mkt-btns ${className}`}>
      {label ? <span className="mkt-on">{label}</span> : null}
      {marketplaces.map((marketplace) => {
        const href = marketplaceListing(marketplace);
        return (
          <a className="mkt-b" key={marketplace.id} href={href} {...offSiteProps(href)}>
            <StoreMark store={marketplace.id} idSuffix={idSuffix} />
            <span>{marketplace.name}</span>
            <NewTabHint href={href} />
            <ExternalArrow />
          </a>
        );
      })}
    </div>
  );
}

function StoreMark({
  store,
  idSuffix,
}: {
  readonly store: MarketplaceId;
  readonly idSuffix: string;
}): JSX.Element {
  return store === "aws" ? (
    <AwsMark crop="badge" className="mkt-mk mkt-aws" />
  ) : (
    <AzureMark idSuffix={`mkt-${idSuffix}`} className="mkt-mk mkt-az" />
  );
}
