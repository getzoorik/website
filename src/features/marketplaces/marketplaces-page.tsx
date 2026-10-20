import type { ReactNode } from "react";

import { AwsMark, AzureMark } from "@/components/brand/cloud-marks";
import { TurningMark } from "@/components/brand/turning-mark";
import { SiteNav } from "@/components/layout/site-nav";
import { ExternalArrow } from "@/components/primitives/external-arrow";
import { NewTabHint } from "@/components/primitives/new-tab-hint";
import { marketplaces, storesListing, type MarketplaceId } from "@/config/marketplaces";
import { routes } from "@/config/site";
import { marketplacesPage, type MarketplacesLink } from "@/content/marketplaces";
import { productOrder, products } from "@/content/products";
import { FooterSection } from "@/features/footer/footer-section";
import { named } from "@/features/legal/named";
import { ProgramClose, programMailto } from "@/features/programs/program-parts";
import { offSiteProps } from "@/lib/links";

/**
 * `/marketplaces`, where to find Zoorik, on /about's frame with the programs' close:
 *
 *   hero                 the page's name, its deck, and two buttons down the page (the stores, the reviews)
 *   Cloud marketplaces   a navy card for each listing, Coral's then Amoeba's, then the store that does not list Amoeba yet
 *   Reviews              G2's two links; Gartner Peer Insights, coming soon, with no link (band)
 *   Install from         the six registries Zoorik publishes on
 *   Find us on the web   the company's profiles (band)
 *   close                "Want to buy through your marketplace?" and a ready email
 *
 * Only real listings link, every one read from config, and no rating or review count is printed. Drawn on the server,
 * with no island and no motion but the links' hover: the mock has no script. No closing assessment row: the mock ends
 * on the close.
 */

const { hero, buy, reviews, install, web, close } = marketplacesPage;

/** Each store's mark on its card, as the mock's sprite draws it (`i-p-aws`, `i-p-azure`), sized by `.mp-logo svg`. */
const STORE_MARKS: Readonly<Record<MarketplaceId, ReactNode>> = {
  aws: <AwsMark />,
  microsoft: <AzureMark idSuffix="mp" />,
};

/** An off-site link: its words, the arrow, and what a screen reader hears. */
function Out({
  className,
  href,
  children,
}: {
  readonly className: string;
  readonly href: string;
  readonly children: ReactNode;
}): React.JSX.Element {
  return (
    <a className={className} href={href} {...offSiteProps(href)}>
      {children} <ExternalArrow />
      <NewTabHint href={href} />
    </a>
  );
}

/**
 * /about's utility hero (the dark band, its glow and the turning mark) with the page's name, its deck and two buttons
 * down the page, as the mock draws it, with no label over the h1.
 */
function Hero(): React.JSX.Element {
  return (
    <header className="hero doc-hero" id="top">
      <TurningMark />
      <div className="wrap hero-in">
        <h1>{named(hero.title)}</h1>
        <p className="doc-deck">{named(hero.deck)}</p>
        <div className="hero-cta">
          <a className="btn btn-light" href={`#${buy.id}`}>
            {hero.buy}
          </a>
          <a className="btn btn-wire" href={`#${reviews.id}`}>
            {hero.reviews}
          </a>
        </div>
      </div>
    </header>
  );
}

/** A section's head: its h2 and, where it has one, its lede. */
function Head({
  id,
  title,
  lede,
}: {
  readonly id: string;
  readonly title: string;
  readonly lede?: string;
}): React.JSX.Element {
  return (
    <div className="sec-head">
      <h2 id={`${id}-h`}>{title}</h2>
      {lede ? <p>{lede}</p> : null}
    </div>
  );
}

/**
 * Cloud marketplaces: a navy card for each listing (`marketplaces.ts`), Coral's then Amoeba's, the whole card its
 * listing in a new tab, then, while a store does not list Amoeba, the line that says so, with /amoeba and a ready email.
 */
function Buy(): React.JSX.Element {
  const { notYet } = buy;
  return (
    <section className="sec pv-sec" id={buy.id} aria-labelledby={`${buy.id}-h`}>
      <div className="wrap">
        <Head id={buy.id} title={buy.title} lede={buy.lede} />
        <div className="mp-buy">
          {productOrder.flatMap((product) =>
            storesListing(product).map((store) => {
              const href = store.listings[product]!;
              return (
                <a
                  className="mp-store"
                  key={`${product}-${store.id}`}
                  href={href}
                  {...offSiteProps(href)}
                >
                  <span className="mp-logo">{STORE_MARKS[store.id]}</span>
                  <span className="mp-k">{store.name}</span>
                  <b>{named(products[product].name)}</b>
                  <span>{buy.stores[product][store.id]}</span>
                  <span className="mp-go">
                    {buy.go} <ExternalArrow />
                  </span>
                  <NewTabHint href={href} />
                </a>
              );
            }),
          )}
        </div>
        {storesListing("amoeba").length < marketplaces.length ? (
          <p className="mp-note">
            {named(notYet.lead)}
            <a href={routes.amoeba}>{named(notYet.see)}</a>
            {notYet.or}
            <a href={programMailto(notYet.subject)}>{notYet.write}</a>
            {notYet.end}
          </p>
        ) : null}
      </div>
    </section>
  );
}

/**
 * Reviews: G2 (Coral's reviews and Zoorik's seller page, each in a new tab), and Gartner Peer Insights, whose listing
 * is not live: its card says so, dashed, and links nowhere. The seller link's words are one span, so the name kept
 * from translation does not split them into flex items of their own, as the mock sets it.
 */
function Reviews(): React.JSX.Element {
  const { g2, soon } = reviews;
  return (
    <section className="sec sec-band" id={reviews.id} aria-labelledby={`${reviews.id}-h`}>
      <div className="wrap">
        <Head id={reviews.id} title={reviews.title} lede={reviews.lede} />
        <div className="mp-rev">
          <article className="mp-rc">
            <span className="mp-k">{g2.kicker}</span>
            <h3>{named(g2.title)}</h3>
            <p>{named(g2.line)}</p>
            <div className="mp-acts">
              <Out className="pv-go dark" href={g2.read.href}>
                {g2.read.label}
              </Out>
              <Out className="pv-go dark" href={g2.seller.href}>
                <span>{named(g2.seller.label)}</span>
              </Out>
            </div>
          </article>
          <article className="mp-rc is-soon">
            <span className="mp-k">{soon.kicker}</span>
            <h3>{soon.title}</h3>
            <p>{named(soon.line)}</p>
            <span className="mp-chip">{soon.chip}</span>
          </article>
        </div>
      </div>
    </section>
  );
}

/** Install from and Find us on the web: a grid of places, each its name and the arrow, then what is there. */
function Places({
  id,
  title,
  lede,
  links,
  band = false,
}: {
  readonly id: string;
  readonly title: string;
  readonly lede?: string;
  readonly links: readonly MarketplacesLink[];
  readonly band?: boolean;
}): React.JSX.Element {
  return (
    <section className={band ? "sec sec-band" : "sec"} id={id} aria-labelledby={`${id}-h`}>
      <div className="wrap">
        <Head id={id} title={title} lede={lede} />
        <div className="mp-grid">
          {links.map((link) => (
            <a className="mp-i" key={link.name} href={link.href} {...offSiteProps(link.href)}>
              <b>
                {link.name} <ExternalArrow />
              </b>
              <small>{named(link.line)}</small>
              <NewTabHint href={link.href} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MarketplacesPage(): React.JSX.Element {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <SiteNav />
      <main id="main" tabIndex={-1} className="pv-main mp-main">
        <Hero />
        <Buy />
        <Reviews />
        <Places {...install} />
        <Places {...web} band />
        <ProgramClose {...close} />
      </main>
      <FooterSection />
    </>
  );
}
