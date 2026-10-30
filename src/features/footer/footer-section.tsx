import { Fragment, type JSX } from "react";
import { BrandLogo } from "@/components/brand/brand-mark";
import { AwsMark, AzureMark } from "@/components/brand/cloud-marks";
import { HomeAwareLink } from "@/components/layout/home-aware-link";
import { ExternalArrow } from "@/components/primitives/external-arrow";
import { InstallButtons } from "@/components/primitives/install-buttons";
import { MarketplaceButtons } from "@/components/primitives/marketplace-buttons";
import { NamedText } from "@/components/primitives/named-text";
import { NewTabHint } from "@/components/primitives/new-tab-hint";

import { site } from "@/config/site";
import { pageTitles } from "@/config/structured-data";
import {
  builtFor,
  footerBrand,
  footerColumns,
  footerCompany,
  footerCopyright,
  footerInstall,
  footerMarketplaces,
  footerSocialLinks,
  type FooterColumn,
  type FooterLink,
} from "@/content/footer";
import { products } from "@/content/products";
import { AskButtons } from "@/features/footer/ask-buttons";
import { SocialMark } from "@/features/footer/footer-marks";
import { NEW_TAB_HINT, isOffSite, offSiteProps } from "@/lib/links";

/**
 * The site footer: the brand column (the wordmark, what Zoorik does and one
 * line per product, the "Built for Azure and AWS" badge, "Available in" and the
 * two marketplaces as buttons, Install from, "Ask about Zoorik on" (page-aware,
 * `AskButtons`), then the social tiles); then Products, Resources and Company,
 * a `stacked` list drawn under the list before it, in its column; then the bar: the legal name and city at its left end, the copyright line at
 * its right.
 *
 * The column titles are paragraphs (`p.foot-h`), not headings, as the mock
 * draws them: the page's outline is its own sections.
 *
 * A SERVER COMPONENT. Nothing here holds state or reads the DOM — every link
 * is an anchor and every mark is static SVG, so there is no reason to ship this
 * to the browser. The one leaf that knows which page it is on is
 * `HomeAwareLink`: at home the wordmark goes back to the top, anywhere else it
 * is "Zoorik home". The pathname is known at build, so every page prerenders.
 *
 * ─── WHAT IT NO LONGER HAS ─────────────────────────────────────────────────
 * The turning helm behind the copy (a canvas with its own animation loop), the
 * three Built for tags and the two technology chips, the "Talk to us" column,
 * "How it works" and "Contact", and ". All rights reserved." All of them were
 * cut from the design; the canvas and its figure are deleted with them.
 *
 * ─── PLAIN ANCHORS, NO cn() ────────────────────────────────────────────────
 * This ships on every page, so it follows the rule for such components: `<a>`,
 * never `next/link`, and literal class names.
 */
export function FooterSection(): JSX.Element {
  return (
    <footer className="site-foot">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <HomeAwareLink className="brand" home="#top" away="/" awayLabel={`${site.name} home`}>
              <BrandLogo />
              <span className="sr-only" translate="no">
                {site.name}
              </span>
            </HomeAwareLink>
            <p>
              <span translate="no">{site.name}</span>
              {footerBrand.lead}
              {footerBrand.lines.map((line) => (
                <Fragment key={line.product}>
                  {" "}
                  <span translate="no">{products[line.product].name}</span>
                  {line.rest}
                </Fragment>
              ))}
            </p>

            {/* One claim, one paragraph. A `<p>` inside
                `.foot-brand`, so it takes the brand line's 14px rather than the
                hero badges' 12.5px: built as the mock renders it. Its Azure
                gradients get their own ids, as the mock's do, so a
                page that also draws the hero badge has no duplicate id. */}
            <p className="az-badge foot-badge">
              <AzureMark idSuffix="footer" className="az-mark" />{" "}
              <AwsMark crop="badge" className="az-mark az-aws" /> {builtFor.common.label}{" "}
              <b>{builtFor.common.platforms}</b>
            </p>

            <MarketplaceButtons className="foot-mb" idSuffix="footer" label={footerMarketplaces} />
            <InstallButtons className="foot-ib" label={footerInstall} />
            <AskButtons titles={pageTitles} />

            <div className="foot-social">
              {footerSocialLinks.map((social) => (
                <a
                  className="soc"
                  key={social.platform}
                  href={social.href}
                  /* Off-site, so a new tab; `noopener` so the new context
                     cannot reach back through `window.opener`. The tile has
                     no text, so the warning goes in its name. */
                  {...offSiteProps(social.href)}
                  aria-label={isOffSite(social.href) ? social.label + NEW_TAB_HINT : social.label}
                >
                  <SocialMark platform={social.platform} />
                </a>
              ))}
            </div>
          </div>

          {inColumns(footerColumns).map((lists) => (
            <div className="foot-col" key={lists[0]!.heading}>
              {lists.map((list) => (
                <Fragment key={list.heading}>
                  <p className="foot-h">{list.heading}</p>
                  {list.links.map((link) => (
                    <FooterColumnLink key={link.label} link={link} />
                  ))}
                </Fragment>
              ))}
            </div>
          ))}
        </div>

        <div className="foot-bar">
          <p className="foot-co">
            <span translate="no">{site.name}</span>
            {footerCompany.rest}
          </p>
          <small>
            {footerCopyright} <span translate="no">{site.name}</span>
          </small>
        </div>
      </div>
    </footer>
  );
}

/** The lists in their columns: a `stacked` list joins the column before it. */
function inColumns(lists: readonly FooterColumn[]): readonly (readonly FooterColumn[])[] {
  const columns: FooterColumn[][] = [];
  for (const list of lists) {
    const last = columns.at(-1);
    if (list.stacked && last) last.push(list);
    else columns.push([list]);
  }
  return columns;
}

/**
 * One column link. A page of this site or the `mailto:` is a bare anchor; the
 * calendar, the one link that leaves, opens a new tab and says so twice: the
 * hidden phrase inside the label's span, and the 12px arrow after it. A label
 * that opens on a product's name ("Coral guide") is one span, the name in it
 * kept out of translation, as the mock writes it.
 */
function FooterColumnLink({ link }: { link: FooterLink }): JSX.Element {
  if (isOffSite(link.href)) {
    return (
      <a href={link.href} {...offSiteProps(link.href)}>
        <span>
          {link.label}
          <NewTabHint href={link.href} />
        </span>
        <ExternalArrow />
      </a>
    );
  }
  if (link.named) {
    return (
      <a href={link.href}>
        <span>
          <NamedText text={link.label} name={products[link.named].name} />
        </span>
      </a>
    );
  }
  return (
    <a href={link.href} translate={link.product ? "no" : undefined}>
      {link.product ? link.label : <NamedText text={link.label} name={site.name} />}
    </a>
  );
}
