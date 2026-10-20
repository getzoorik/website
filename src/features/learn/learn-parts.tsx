import type { ReactNode } from "react";

import { TurningMark } from "@/components/brand/turning-mark";
import { SiteNav } from "@/components/layout/site-nav";
import { AssessSection } from "@/features/assess/assess-section";
import { FooterSection } from "@/features/footer/footer-section";

/**
 * What Learn's pages share: the frame, the utility hero with its small line over the h1, a section with its head,
 * and the new-tab arrow the mock draws without the site's `.ext` class. Server components.
 */

/**
 * The mock's up-right arrow after a link that leaves the site, with no class, so the sheet's own rules size
 * it (`.mk-n a svg`, `.vx-src svg`, `.vp-out svg`) and the site's `.ext` margin does not move it. `aria-hidden`: the
 * link's hidden "(opens in a new tab)" says it for the ear.
 */
export function OutGlyph(): React.JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export interface LearnHeroProps {
  /** The small line over the h1 (`.vp-kick`) on a comparison page: what the page is and the day its facts were
   *  checked. The hub has none. */
  readonly kicker?: string;
  readonly title: ReactNode;
  readonly deck: ReactNode;
  /** What follows the deck: the hub's search. */
  readonly after?: ReactNode;
}

/**
 * Learn's utility hero: the dark band, its glow and the turning mark, then the
 * kicker where there is one, the h1, the deck and what follows it. `lv-hero` carries the mock's page-wide
 * `.doc-hero .hero-in` rule (learn.css).
 */
export function LearnHero({ kicker, title, deck, after }: LearnHeroProps): React.JSX.Element {
  return (
    <header className="hero doc-hero lv-hero" id="top">
      <TurningMark />
      <div className="wrap hero-in">
        {kicker ? <p className="vp-kick">{kicker}</p> : null}
        <h1>{title}</h1>
        <p className="doc-deck">{deck}</p>
        {after}
      </div>
    </header>
  );
}

/**
 * A Learn page: the skip link, the nav, one `<main>` holding the hero, the page's sections and
 * the site's closing assessment row, then the footer. The row names both products and opens the assessment for either,
 * as the mocks draw it, and nothing in it rises (`reveal={false}`).
 */
export function LearnFrame({
  hero,
  children,
}: {
  readonly hero: LearnHeroProps;
  readonly children: ReactNode;
}): React.JSX.Element {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <SiteNav />
      <main id="main" tabIndex={-1}>
        <LearnHero {...hero} />
        {children}
        <AssessSection reveal={false} />
      </main>
      <FooterSection />
    </>
  );
}

export interface LearnSectionProps {
  readonly id: string;
  readonly title: ReactNode;
  readonly lede: ReactNode;
  readonly band?: boolean;
  readonly children: ReactNode;
}

/** A section's classes: `band` lays it on the tinted band. */
export const sectionClass = (band = false): string => (band ? "sec lv-sec sec-band" : "sec lv-sec");

/** What a section holds (inside its `<section>`): the head row, its h2 and lede, then its body. */
export function LearnSectionBody({
  id,
  title,
  lede,
  children,
}: Omit<LearnSectionProps, "band">): React.JSX.Element {
  return (
    <div className="wrap">
      <div className="lv-head">
        <h2 id={`${id}-h`}>{title}</h2>
        <p>{lede}</p>
      </div>
      {children}
    </div>
  );
}

/**
 * A section of a Learn page: its h2 and lede in one head row, then its body; `band` lays it
 * on the tinted band.
 */
export function LearnSection({ band = false, ...body }: LearnSectionProps): React.JSX.Element {
  return (
    <section className={sectionClass(band)} id={body.id} aria-labelledby={`${body.id}-h`}>
      <LearnSectionBody {...body} />
    </section>
  );
}
