import type { ReactNode } from "react";

import { ProductMark } from "@/components/brand/product-marks";
import { SiteNav } from "@/components/layout/site-nav";
import { Arrow } from "@/components/primitives/arrow";
import { contactEmail } from "@/config/site";
import { assessmentProducts } from "@/content/assessment";
import { referralsPage, type ReferralTeamIcon } from "@/content/referrals";
import { EyeGlyph, SendGlyph, ShieldGlyph } from "@/features/assessment/assessment-marks";
import { FooterSection } from "@/features/footer/footer-section";
import { named } from "@/features/legal/named";
import { GiftGlyph } from "@/features/programs/program-glyphs";
import {
  ProgramClose,
  ProgramHero,
  studyFigures,
  Terminal,
  vars,
} from "@/features/programs/program-parts";
import { ProgramsMotion } from "@/features/programs/programs-motion";

/**
 * `/referrals`, on /about's frame:
 *
 *   hero                       Coming soon, Referral program, the line, a ready email and "How it will work" (#how)
 *   How it will work           the navy panel: three steps on one line, each with its picture (an email, the
 *                              assessment's own command, the terms to come); it plays once in view
 *   Who you could introduce    six teams, each with its mark and its product (band)
 *   What they'll see           the case study's −58% and its bill before and after; page one of the example report
 *   close                      "Want to hear when it opens?" and a ready email
 *
 * No terms, no reward amount, no figure of our own making: the program has none yet. No closing assessment row (the
 * mock ends on the close). One island moves the page (`ProgramsMotion`).
 */

const { hero, journey, who, proof, close } = referralsPage;

/** Each team's glyph: a product's mark, or a line glyph for the roles both products serve. */
const TEAM_ICONS: Readonly<Record<ReferralTeamIcon, ReactNode>> = {
  coral: <ProductMark product="coral" className="pv-wic" />,
  amoeba: <ProductMark product="amoeba" className="pv-wic" />,
  eye: <EyeGlyph className="pv-wic" />,
  shield: <ShieldGlyph className="pv-wic" />,
};

/** The bill today as a share of the bill when Coral was connected: the second bar's length. */
const afterShare = `${((studyFigures.after.amount / studyFigures.before.amount) * 100).toFixed(1)}%`;

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
        <i style={{ width: "92%" }} />
        <i style={{ width: "78%" }} />
        <i style={{ width: "56%" }} />
      </div>
      <span className="pv-send">
        <SendGlyph className="pv-ic" /> {mail.send}
      </span>
    </div>
  );
}

/**
 * Step 2: the assessment's own command (`assessment.ts`), what it prints while it reads, and the report it writes,
 * by the name /assessment gives it.
 */
function RunScene(): React.JSX.Element {
  const { run } = journey;
  const coral = assessmentProducts.coral;
  return (
    <Terminal
      title={run.title}
      lines={[`$ ${coral.run}`, run.reading, `${run.writing}${coral.demo.file}`]}
    />
  );
}

/** Step 3: a gift, and where the terms will be. No reward is named: the program has no terms yet. */
function ThanksScene(): React.JSX.Element {
  return (
    <div className="pv-thanks">
      <span className="pv-gift" aria-hidden="true">
        <GiftGlyph />
      </span>
      <span className="pv-tchip">{journey.terms}</span>
    </div>
  );
}

const SCENES = [MailScene, RunScene, ThanksScene] as const;

/**
 * How it will work: the navy panel, its three steps on one line that draws from the first number to the last. The
 * line is an `aria-hidden` item of the list, where the mock sets a `<span>` (a list holds only items); the sheet
 * places it the same.
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
          <ol className="pv-journey">
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
                  <p>{step.body}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Who(): React.JSX.Element {
  return (
    <section className="sec sec-band" id={who.id} aria-labelledby={`${who.id}-h`}>
      <div className="wrap">
        <div className="sec-head">
          <h2 id={`${who.id}-h`}>{who.title}</h2>
          <p>{who.lede}</p>
        </div>
        <div className="pv-who">
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
 * What they'll see: the case study as a navy card (its figure, its bill before and after on one scale, the whole card
 * one link), beside page one of the example report, a link to /assessment.
 */
function Proof(): React.JSX.Element {
  const { study, report } = proof;
  const { href, label, figure, before, after } = studyFigures;
  return (
    <section className="sec" id={proof.id} aria-labelledby={`${proof.id}-h`}>
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

export function ReferralsPage(): React.JSX.Element {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <SiteNav />
      <main id="main" tabIndex={-1} className="pv-main">
        <ProgramHero {...hero} />
        <Journey />
        <Who />
        <Proof />
        <ProgramClose {...close} />
        <ProgramsMotion />
      </main>
      <FooterSection />
    </>
  );
}
