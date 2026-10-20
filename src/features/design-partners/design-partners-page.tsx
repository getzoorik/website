import type { ReactNode } from "react";

import { ProductMark } from "@/components/brand/product-marks";
import { SiteNav } from "@/components/layout/site-nav";
import { Arrow } from "@/components/primitives/arrow";
import { contactEmail } from "@/config/site";
import { assessmentProducts } from "@/content/assessment";
import {
  designPartnerPlaces,
  designPartnersPage,
  type DesignPartnerGetIcon,
  type DesignPartnerTeamIcon,
} from "@/content/design-partners";
import { EyeGlyph, PlayGlyph, SendGlyph } from "@/features/assessment/assessment-marks";
import { TickGlyph } from "@/features/brand-assets/brand-assets-glyphs";
import { CheckGlyph } from "@/features/design-partners/design-partner-glyphs";
import { FooterSection } from "@/features/footer/footer-section";
import { named } from "@/features/legal/named";
import {
  ProgramClose,
  ProgramHero,
  programMailto,
  studyFigures,
  Terminal,
  vars,
} from "@/features/programs/program-parts";
import { ProgramsMotion } from "@/features/programs/programs-motion";

/**
 * `/design-partners`, open now, on /about's frame and the programs' panels (`programs.css`, which the mock carries as
 * its own sheet):
 *
 *   hero                         Open now · the first 10 partners, the h1, the line, a ready email and Book a call
 *   The offer                    the navy panel: free on non-production, a diamond for each of the ten places, and the
 *                                one term production has; the diamonds turn in once in view
 *   What you get                 four cards, each with its glyph
 *   How it works                 the navy panel: four steps on one line, each with its picture (an email, the
 *                                assessment's own command, the connect command, a review); it plays once in view
 *   What we ask                  three things, each ticked (band)
 *   Who it is for                four teams, each with its product's mark
 *   Where your results will sit  the case study's −58% and its bill before and after; page one of the example report
 *                                (band)
 *   close                        "Want one of the first 10 places?" and a ready email
 *
 * One offer and one term, and no other figure: the places are `designPartnerPlaces`, the study's figures the
 * study's. No closing assessment row (the mock ends on the close). One island moves the page (`ProgramsMotion`); the
 * diamonds' own fallback without scripting is `SlotsAtRest`.
 */

const { hero, offer, get, journey, ask, who, proof, close } = designPartnersPage;

/** Each card's glyph in What you get, as the mock's sprite draws it. */
const GET_ICONS: Readonly<Record<DesignPartnerGetIcon, ReactNode>> = {
  check: <CheckGlyph className="dp-ic" />,
  play: <PlayGlyph className="dp-ic" />,
  send: <SendGlyph className="dp-ic" />,
  eye: <EyeGlyph className="dp-ic" />,
};

/** Each team's mark in Who it is for: its product's. */
const TEAM_ICONS: Readonly<Record<DesignPartnerTeamIcon, ReactNode>> = {
  coral: <ProductMark product="coral" className="pv-wic" />,
  amoeba: <ProductMark product="amoeba" className="pv-wic" />,
};

/** The bill today as a share of the bill when Coral was connected: the second bar's length, to a tenth. */
const afterShare = `${((studyFigures.after.amount / studyFigures.before.amount) * 100).toFixed(1)}%`;

/**
 * The offer: the navy panel, a diamond for each place numbered 1 to {@link designPartnerPlaces} (a drawing, hidden from
 * assistive tech: the lede says how many), then production's one term and a ready email.
 */
function Offer(): React.JSX.Element {
  return (
    <section className="sec pv-sec" id={offer.id} aria-labelledby={`${offer.id}-h`}>
      <div className="wrap">
        <div className="pv-panel pv-anim dp-offer">
          <div className="pv-phead">
            <p className="pv-eyebrow">{offer.eyebrow}</p>
            <h2 id={`${offer.id}-h`}>{offer.title}</h2>
            <p>{named(offer.lede)}</p>
          </div>
          <div className="dp-slots" aria-hidden="true">
            {Array.from({ length: designPartnerPlaces }, (_, k) => (
              <i style={vars({ "--i": k })} key={k}>
                <b>{k + 1}</b>
              </i>
            ))}
          </div>
          <div className="pv-ofoot">
            <span>{offer.production}</span>
            <a href={programMailto(offer.apply.subject)}>
              {offer.apply.label} <Arrow />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Get(): React.JSX.Element {
  return (
    <section className="sec" id={get.id} aria-labelledby={`${get.id}-h`}>
      <div className="wrap">
        <div className="sec-head">
          <h2 id={`${get.id}-h`}>{get.title}</h2>
        </div>
        <div className="dp-get">
          {get.cards.map((card) => (
            <article className="dp-card" key={card.title}>
              {GET_ICONS[card.icon]}
              <h3>{card.title}</h3>
              <p>{named(card.body)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Step 1: an email to the founders, its body three grey lines, and Send. */
function MailScene(): React.JSX.Element {
  const { mail } = journey;
  return (
    <div className="pv-mail">
      <div className="pv-mrow">
        <b>{mail.to}</b>
        <span>{contactEmail}</span>
      </div>
      <div className="pv-mrow">
        <b>{mail.subject}</b>
        <span>{mail.line}</span>
      </div>
      <div className="pv-mbody">
        <i style={{ width: "90%" }} />
        <i style={{ width: "72%" }} />
        <i style={{ width: "50%" }} />
      </div>
      <span className="pv-send">
        <SendGlyph className="pv-ic" /> {mail.send}
      </span>
    </div>
  );
}

/** Step 2: the assessment's own command (`assessment.ts`). */
function AssessScene(): React.JSX.Element {
  return <Terminal title={journey.terminal} lines={[`$ ${assessmentProducts.coral.run}`]} />;
}

/** Step 3: the command that connects a cluster. */
function ConnectScene(): React.JSX.Element {
  return <Terminal title={journey.terminal} lines={[`$ ${journey.connect}`]} />;
}

/** Step 4: a bill before and after, and a tick: a drawing, hidden from assistive tech (the step's words say it). */
function ReviewScene(): React.JSX.Element {
  return (
    <div className="dp-rev" aria-hidden="true">
      <span className="dp-b1" />
      <span className="dp-b2" />
      <span className="dp-tick">
        <TickGlyph />
      </span>
    </div>
  );
}

const SCENES = [MailScene, AssessScene, ConnectScene, ReviewScene] as const;

/**
 * How it works: the navy panel, its four steps on one line that draws from the first number to the last. The line is
 * an `aria-hidden` item of the list, where the mock sets a `<span>` (a list holds only items), as on /referrals.
 */
function Journey(): React.JSX.Element {
  return (
    <section className="sec pv-sec" id={journey.id} aria-labelledby={`${journey.id}-h`}>
      <div className="wrap">
        <div className="pv-panel pv-anim">
          <div className="pv-phead">
            <p className="pv-eyebrow">{journey.eyebrow}</p>
            <h2 id={`${journey.id}-h`}>{journey.title}</h2>
            <p>{journey.lede}</p>
          </div>
          <ol className="pv-journey dp-j4">
            <li className="pv-line" aria-hidden="true">
              <b />
            </li>
            {journey.steps.map((step, i) => {
              const Scene = SCENES[i]!;
              return (
                <li className="pv-step" style={vars({ "--i": i })} key={step.title}>
                  <span className="pv-n" aria-hidden="true">
                    {i + 1}
                  </span>
                  <div className="pv-scene">
                    <Scene />
                  </div>
                  <h3>{step.title}</h3>
                  <p>{named(step.body)}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Ask(): React.JSX.Element {
  return (
    <section className="sec sec-band" id={ask.id} aria-labelledby={`${ask.id}-h`}>
      <div className="wrap">
        <div className="dp-ask">
          <div className="sec-head">
            <h2 id={`${ask.id}-h`}>{ask.title}</h2>
            <p>{ask.lede}</p>
          </div>
          <ul className="bk-list dp-list">
            {ask.items.map((item) => (
              <li key={item}>
                <span className="bk-ok">
                  <TickGlyph />
                </span>
                <span>{named(item)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Who(): React.JSX.Element {
  return (
    <section className="sec" id={who.id} aria-labelledby={`${who.id}-h`}>
      <div className="wrap">
        <div className="sec-head">
          <h2 id={`${who.id}-h`}>{who.title}</h2>
          <p>{who.lede}</p>
        </div>
        <div className="pv-who dp-who">
          {who.teams.map((team) => (
            <div className="pv-wt" key={team.title}>
              {TEAM_ICONS[team.icon]}
              <span>
                <b>{team.title}</b>
                <small>{named(team.for)}</small>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Where your results will sit: the case study as a navy card (its label, its figure, its bill before and after on one
 * scale, the whole card one link), beside page one of the example report, a link to /assessment.
 */
function Proof(): React.JSX.Element {
  const { study, report } = proof;
  const { href, label, figure, before, after } = studyFigures;
  return (
    <section className="sec sec-band" id={proof.id} aria-labelledby={`${proof.id}-h`}>
      <div className="wrap">
        <div className="sec-head">
          <h2 id={`${proof.id}-h`}>{proof.title}</h2>
          <p>{proof.lede}</p>
        </div>
        <div className="pv-proof">
          <a className="pv-case" href={href}>
            <span className="pv-kick">{named(`${label} · ${study.kicker}`)}</span>
            <span className="pv-big">{figure}</span>
            <span className="pv-bars">
              <span className="pv-b1">
                <i style={{ width: "100%" }} />
                <em>{before.label}</em>
              </span>
              <span className="pv-b2">
                <i style={{ width: afterShare }} />
                <em>{after.label}</em>
              </span>
            </span>
            <span className="pv-cap">{study.cap}</span>
            <span className="pv-go">
              {study.go} <Arrow />
            </span>
          </a>
          <a className="pv-report" href={report.href}>
            <span className="pv-kick dark">{report.kicker}</span>
            <span className="pv-rimg">
              {/* eslint-disable-next-line @next/next/no-img-element -- the sheet owns this box (`.pv-rimg img`), as the mock's. */}
              <img
                src={report.image}
                alt={report.alt}
                loading="lazy"
                width={report.width}
                height={report.height}
              />
            </span>
            <span className="pv-rcap">{report.cap}</span>
            <span className="pv-go dark">
              {report.go} <Arrow />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

/**
 * ─── THE DIAMONDS WITHOUT SCRIPTING ────────────────────────────────────────
 * The sheet starts the offer's diamonds faded and small, which is right while `ProgramsMotion` runs and wrong when it
 * never will. This style draws them at rest then, as reduced motion does; `ProgramsMotion`'s own <noscript> does the
 * same for the journey.
 */
const SLOTS_AT_REST =
  "<style>.dp-main .pv-anim .dp-slots i{opacity:1;transform:rotate(45deg) scale(.72);transition:none}</style>";

function SlotsAtRest(): React.JSX.Element {
  return <noscript dangerouslySetInnerHTML={{ __html: SLOTS_AT_REST }} />;
}

export function DesignPartnersPage(): React.JSX.Element {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <SiteNav />
      <main id="main" tabIndex={-1} className="pv-main dp-main">
        <ProgramHero {...hero} />
        <Offer />
        <Get />
        <Journey />
        <Ask />
        <Who />
        <Proof />
        <ProgramClose {...close} />
        <ProgramsMotion />
        <SlotsAtRest />
      </main>
      <FooterSection />
    </>
  );
}
