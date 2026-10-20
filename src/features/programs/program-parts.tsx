import type { CSSProperties } from "react";

import { TurningMark } from "@/components/brand/turning-mark";
import { NewTabHint } from "@/components/primitives/new-tab-hint";
import { contactEmail } from "@/config/site";
import { caseStudy } from "@/content/case-studies";
import { MailGlyph } from "@/features/assessment/assessment-marks";
import { named } from "@/features/legal/named";
import { offSiteProps } from "@/lib/links";

/**
 * What /referrals and /partners share, and /design-partners with them: the utility hero with its label, the terminal
 * each page draws a command in, and the navy close with its ready email. Server components; the one island is
 * `ProgramsMotion`.
 */

/** Custom properties, which React's style type does not know, as the mock writes them inline. */
export const vars = (values: Readonly<Record<`--${string}`, string | number>>): CSSProperties =>
  values as CSSProperties;

/** A ready email to the founders, its subject naming the program (`Referral%20program`, as the mock encodes it). */
export const programMailto = (subject: string): string =>
  `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}`;

/** A ready email's button: its label and its mail's subject. */
interface Write {
  readonly label: string;
  readonly subject: string;
}

export interface ProgramHeroProps {
  readonly soon: string;
  readonly title: string;
  readonly deck: string;
  /** The light button: a ready email. */
  readonly write: Write;
  /** The wire button: a section further down, or (on /design-partners) the calendar, in a new tab. */
  readonly more: { readonly label: string; readonly href: string };
}

/**
 * /about's utility hero (the dark band, its glow and the turning mark), with the program's label over the h1 ("Coming
 * soon", or /design-partners's "Open now") and two buttons under the line: a ready email and a link down the page, or
 * off the site. An off-site link opens a new tab and says so to a screen reader, with no arrow, as the mock draws it
 * (the bar's Book a demo is the same).
 */
export function ProgramHero({
  soon,
  title,
  deck,
  write,
  more,
}: ProgramHeroProps): React.JSX.Element {
  return (
    <header className="hero doc-hero" id="top">
      <TurningMark />
      <div className="wrap hero-in">
        <p className="pg-soon">{soon}</p>
        <h1>{title}</h1>
        <p className="doc-deck">{named(deck)}</p>
        <div className="hero-cta">
          <a className="btn btn-light" href={programMailto(write.subject)}>
            {write.label}
          </a>
          <a className="btn btn-wire" href={more.href} {...offSiteProps(more.href)}>
            {more.label}
            <NewTabHint href={more.href} />
          </a>
        </div>
      </div>
    </header>
  );
}

/**
 * A terminal window: three dots and its title, then its lines, a line that starts "$ " set as the command (white, its
 * "$" green).
 */
export function Terminal({
  title,
  lines,
}: {
  readonly title: string;
  readonly lines: readonly string[];
}): React.JSX.Element {
  return (
    <div className="pv-term">
      <div className="pv-bar">
        <i />
        <i />
        <i />
        <span>{title}</span>
      </div>
      <pre>
        {lines.map((line, n) => (
          <span className={line.startsWith("$") ? "pv-ln pv-cmd" : "pv-ln"} key={n}>
            {line}
          </span>
        ))}
      </pre>
    </div>
  );
}

/**
 * The navy close: the question, its line (the terms will be on this page; on /design-partners, how to apply, its
 * product names kept from translation), and "Write to us", a ready email to the founders. No id and no heading anchor,
 * as the mock draws it.
 */
export function ProgramClose({
  title,
  line,
  write,
}: {
  readonly title: string;
  readonly line: string;
  readonly write: Write;
}): React.JSX.Element {
  return (
    <section className="sec">
      <div className="wrap">
        <div className="pv-close">
          <div>
            <h2>{title}</h2>
            <p>{named(line)}</p>
          </div>
          <a className="pv-cta" href={programMailto(write.subject)}>
            <MailGlyph /> {write.label}
          </a>
        </div>
      </div>
    </section>
  );
}

const studyCosts = caseStudy.result.costs;

/**
 * The case study's figures, as both pages print them: what the study is (the first part of its own kicker, so the label
 * follows the study: ours reads "Value Lab", and a client's study will read "Customer"), its headline figure
 * (−58%), and the machine bill when Coral was connected and today, each with its label. Read from the study, never
 * typed twice.
 */
export const studyFigures = {
  href: caseStudy.route,
  label: caseStudy.hero.kicker.split(" · ")[0]!,
  figure: caseStudy.band.stats[0].value,
  before: studyCosts.steps[0],
  after: studyCosts.steps[studyCosts.steps.length - 1]!,
} as const;
