import { Fragment, type JSX } from "react";

import { AwsMark, AzureMark } from "@/components/brand/cloud-marks";
import { ProductMark } from "@/components/brand/product-marks";
import { Arrow } from "@/components/primitives/arrow";
import { NamedText } from "@/components/primitives/named-text";
import { NewTabHint } from "@/components/primitives/new-tab-hint";
import {
  marketplaceListing,
  marketplaceWords,
  storesListing,
  type MarketplaceId,
} from "@/config/marketplaces";
import { productPageWords, type ProductPageContent } from "@/content/product-page";
import { products, type ProductId } from "@/content/products";
import { HeroFilm } from "@/features/hero-film/hero-film";
import { offSiteProps } from "@/lib/links";

/**
 * A product page's hero, as the home page's (owner, 23 Oct 2026: "the same with
 * … this motion video … that minimalism"): one screen over the data grid film,
 * under a scrim in the film's own ground (#000817), so the bar reads bone over
 * it until it scrolls past.
 *
 * Only these, in order (`.pp-min`): the product's mark and name, small; the h1,
 * the product's search term; the home page's own line for the product; one
 * button, Estimate your saving, same tab, to this product's assessment; and one
 * quiet line, "Coral is available in AWS Marketplace and Microsoft
 * Marketplace". Gone: the badges, the offering tags, the "Watch the 2-minute
 * film" button (the film band is right below), the "Compatible with" row, the
 * ranges card, the turning mark and its glow.
 *
 * The film is the film lane's `HeroFilm`, the hero's first child: its own
 * script picks the poster and the film for this screen and browser as the page
 * is parsed, both from media.zoorik.com, and the poster alone under reduced
 * motion. Where its frame sits is this page's sheet (product-tour.css).
 */

/** Each store's cloud, drawn before its name: the marks the "Runs on" chips draw. */
const storeMark: Record<MarketplaceId, () => JSX.Element> = {
  aws: () => <AwsMark className="aws" />,
  microsoft: () => <AzureMark idSuffix="pp-mkt" />,
};

/**
 * "Coral is available in AWS Marketplace and Microsoft Marketplace" (`hx-mkt`,
 * "marks over words"): each store's name after its cloud's mark, a link to this
 * product's own listing there. Each opens a new tab and says so to a screen
 * reader; the line takes no arrow, as the mock draws it. The lead names the
 * product, so no link repeats it.
 *
 * 🔴 A PRODUCT LISTED IN NO STORE DRAWS NO LINE, and a line names only the
 * stores that list it (`storesListing`), with no Coral fallback.
 */
function ProductMarketplaces({ product }: { readonly product: ProductId }): JSX.Element | null {
  const stores = storesListing(product);
  if (stores.length === 0) return null;
  return (
    <p className="hx-mkt">
      <span translate="no">{products[product].name}</span>
      {/* One text node, its space and all, as the mock writes it. */}
      {`${productPageWords.available} `}
      {stores.map((marketplace, index) => {
        const Mark = storeMark[marketplace.id];
        const href = marketplaceListing(marketplace, product);
        return (
          <Fragment key={marketplace.id}>
            {index > 0 ? marketplaceWords.join : null}
            <a href={href} {...offSiteProps(href)}>
              <Mark />
              {marketplace.name}
              <NewTabHint href={href} />
            </a>
          </Fragment>
        );
      })}
    </p>
  );
}

export function ProductHero({ content }: { content: ProductPageContent }): JSX.Element {
  const { hero, product } = content;
  const name = products[product].name;

  return (
    <header className="hero pp-hero pp-min" id="top">
      <HeroFilm film="datagrid" />
      <div className="wrap hero-in">
        <p className="pp-eye" translate="no">
          <ProductMark product={product} />
          <span>{name}</span>
        </p>
        <h1>{hero.title}</h1>
        <p className="hero-sub">
          <NamedText text={hero.line} name={name} />
        </p>
        <div className="hero-cta">
          <a className="btn btn-light" href={hero.cta.href}>
            {hero.cta.label} <Arrow />
          </a>
        </div>
        <ProductMarketplaces product={product} />
      </div>
    </header>
  );
}
