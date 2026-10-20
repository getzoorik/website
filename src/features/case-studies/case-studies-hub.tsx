import { Arrow } from "@/components/primitives/arrow";
import { Reveal } from "@/components/primitives/reveal";
import { caseStudiesHub } from "@/content/case-studies";
import { DocumentPage } from "@/features/documents/document-page";
import { named } from "@/features/legal/named";
import { isoDay } from "@/lib/content-date";

import { SavedSoFar } from "./saved-so-far";
import { ValueLabMark } from "./value-lab-mark";

/**
 * `/value-lab`, Value Lab by Zoorik: the case studies' hub.
 *
 *   hero          the page's name and its line, and beside them what the studies saved so far, as of the newest
 *                 study's day, its dot pulsing and its figure counting up once (`SavedSoFar`)
 *   studies       on the band, the closing row's pair: the featured study on the white card (the mark, its bill before
 *                 and with Coral as two bars on one scale, "Read the case study"), and "Want to be next?" on the navy
 *                 one (the free assessment)
 *   closing row   for Coral
 *
 * No client study is listed until the first one exists. The pair rises as it arrives, as on /community; the dot's
 * pulse and the count stop under reduced motion.
 */

const { hero, total, featured, next } = caseStudiesHub;

/** "Saved so far", beside the hero's words in the files' place (`.dl`). */
function Total(): React.JSX.Element {
  return (
    <div className="dl vl-total">
      <p className="vl-tk">
        <span className="vl-sig" aria-hidden="true" />
        {total.label}
        <time dateTime={isoDay(total.asOf)}>{total.asOfLabel}</time>
      </p>
      <p className="vl-tn">
        <SavedSoFar value={total.amount} /> {total.unit}
      </p>
      <p className="vl-tl">{total.line}</p>
    </div>
  );
}

/** The featured study's two bars, on the bill before's scale: the second's height is the bill after's share of it. */
function Bars(): React.JSX.Element {
  const { before, after } = featured;
  return (
    <div className="vl-bars" aria-hidden="true">
      <span className="vl-col">
        <b>{before.label}</b>
        <i style={{ "--h": 1 } as React.CSSProperties} />
        <small>{before.name}</small>
      </span>
      <span className="vl-col">
        <b>{after.label}</b>
        <i
          className="g"
          style={{ "--h": (after.value / before.value).toFixed(3) } as React.CSSProperties}
        />
        <small>{named(after.name)}</small>
      </span>
      <small className="vl-per">{featured.per}</small>
    </div>
  );
}

/** The navy card's mark: a dashed square with a plus, the place a next study takes. */
function NextMark(): React.JSX.Element {
  return (
    <svg
      className="vl-own"
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="36" height="36" rx="9" strokeDasharray="5 4" />
      <path d="M20 13v14M13 20h14" />
    </svg>
  );
}

function Studies(): React.JSX.Element {
  return (
    <section className="sec sec-band" id="studies" aria-label={caseStudiesHub.label}>
      <div className="wrap">
        <div className="as-grid">
          <Reveal className="as-card as-mini vl-fc" order={0}>
            <span className="vl-flag">{featured.flag}</span>
            <ValueLabMark className="vl-own" />
            <h2 className="as-h">{featured.title}</h2>
            <p>{named(featured.line)}</p>
            <Bars />
            <a className="btn-ink" href={featured.href}>
              {caseStudiesHub.card.read} <Arrow />
            </a>
          </Reveal>
          <Reveal className="as-cal" order={1}>
            <NextMark />
            <h2 className="as-h">{next.title}</h2>
            <p>{next.body}</p>
            <a className="cta-go" href={next.href}>
              <span>{next.go}</span>
              <Arrow />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function CaseStudiesHub(): React.JSX.Element {
  return (
    <DocumentPage
      hero={{ title: named(hero.title), deck: named(hero.deck), aside: <Total /> }}
      product="coral"
    >
      <Studies />
    </DocumentPage>
  );
}
