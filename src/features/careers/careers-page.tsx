import type { CSSProperties, ReactNode } from "react";

import { TurningMarkArt } from "@/components/brand/turning-mark";
import { SiteNav } from "@/components/layout/site-nav";
import { Arrow } from "@/components/primitives/arrow";
import { NewTabHint } from "@/components/primitives/new-tab-hint";
import { contactEmail } from "@/config/site";
import { careers, teamMailto } from "@/content/careers";
import { socialProfiles } from "@/content/footer";
import { products } from "@/content/products";
import { VideoGlyph, WriteGlyph } from "@/features/careers/careers-glyphs";
import { CareersMotion } from "@/features/careers/careers-motion";
import { HabitPicture } from "@/features/careers/careers-pictures";
import { CareersValues } from "@/features/careers/careers-values";
import { FooterSection } from "@/features/footer/footer-section";
import { named } from "@/features/legal/named";
import { offSiteProps } from "@/lib/links";

/**
 * `/careers`, built on /about's frame:
 *
 *   hero              Work at Zoorik, Introduce yourself, and the six CREDIT
 *                     letters as the figure, each a link to its value
 *   What you will build   each product's 5-second film, its line and its stack
 *   Our values        the picker (`CareersValues`), on the band, and no lede
 *   How we work       four habits, each with its picture, and no lede
 *   How we hire       six steps on a line (band)
 *   Want to build with us?   the dark close: no open roles, "Introduce yourself"
 *                     and "Follow us on LinkedIn", the teams we
 *                     hire for, each a ready email, and the turning mark
 *
 * Minimal: no caps label over the hero, the close or a value, one line per
 * habit and step, and no values-interview card under the steps.
 *
 * No open roles, no assessment row (the mock ends on the close), and the
 * hero draws the glow but not the turning mark: the letters are its figure.
 * One island moves the page (`CareersMotion`); the picker is the other.
 */

const d = (n: number): CSSProperties => ({ "--d": n }) as CSSProperties;

function Section({
  id,
  title,
  lede,
  band,
  children,
}: {
  readonly id: string;
  readonly title: string;
  /** The line under the heading; Our values and How we work have none, as the mock draws them. */
  readonly lede?: string;
  readonly band?: boolean;
  readonly children: ReactNode;
}): React.JSX.Element {
  return (
    <section className={band ? "sec sec-band" : "sec"} id={id} aria-labelledby={`${id}-h`}>
      <div className="wrap">
        <div className="sec-head rv">
          <h2 id={`${id}-h`}>{title}</h2>
          {lede === undefined ? null : <p>{lede}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

function Hero(): React.JSX.Element {
  const { hero, values } = careers;
  return (
    <header className="hero doc-hero" id="top">
      {/* The glow alone: the six letters stand where the turning mark would. */}
      <div className="zk-glow" aria-hidden="true" />
      <div className="wrap hero-in cr-hero">
        <div className="cr-hcopy">
          <h1>{named(hero.title)}</h1>
          <p className="doc-deck">{named(hero.deck)}</p>
          <div className="hero-cta">
            <a className="btn btn-light" href={hero.introduce.href}>
              {hero.introduce.label}
            </a>
            <a className="cr-hl" href={hero.values.href}>
              {hero.values.label} <Arrow />
            </a>
          </div>
        </div>
        <nav className="cr-hgrid" aria-label={hero.tilesLabel}>
          {values.list.map((value, i) => (
            /* Named by its label: below 641px the sheet hides the label and the letter is
               aria-hidden, which would leave the link with no name (the mock's own markup). */
            <a
              className="cr-ht"
              href={`#${values.id}`}
              data-go={value.id}
              aria-label={hero.tiles[i]}
              style={{ "--i": i } as CSSProperties}
              key={value.id}
            >
              <b aria-hidden="true">{value.letter}</b>
              <small>{hero.tiles[i]}</small>
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Build(): React.JSX.Element {
  const { build } = careers;
  return (
    <Section id={build.id} title={build.title} lede={build.lede}>
      <div className="cr-prods">
        {build.products.map((item, n) => {
          const name = <span translate="no">{products[item.product].name}</span>;
          return (
            <article className="cr-prod rv" style={d(n)} key={item.product}>
              <div className="cr-vid">
                {/* Muted and inline, so the island may start it; looped, as the mock's; no bytes
                    until it is in view (`preload="none"`, as the home page's films). */}
                <video
                  muted
                  playsInline
                  loop
                  preload="none"
                  poster={item.poster}
                  src={item.src}
                  aria-label={item.label}
                />
              </div>
              <div className="cr-pc">
                <h3>{name}</h3>
                <p>{item.line}</p>
                <ul className="cr-stack" aria-label={build.stackLabel}>
                  {item.stack.map((tool) => (
                    <li key={tool}>{tool}</li>
                  ))}
                </ul>
                <a className="alink" href={item.href}>
                  See {name} <Arrow />
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </Section>
  );
}

function Work(): React.JSX.Element {
  const { work } = careers;
  return (
    <Section id={work.id} title={work.title}>
      <div className="cr-work">
        {work.habits.map((habit, n) => (
          <article className="cr-wk rv" style={d(n)} key={habit.title}>
            <HabitPicture picture={habit.picture} />
            <h3>{habit.title}</h3>
            <p>{habit.body}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}

function Hire(): React.JSX.Element {
  const { hire } = careers;
  return (
    <Section id={hire.id} title={hire.title} lede={hire.lede} band>
      <div className="cr-line" aria-hidden="true">
        <i />
      </div>
      <ol className="cr-steps">
        {hire.steps.map((step, n) => (
          <li className={"values" in step ? "rv is-v" : "rv"} style={d(n)} key={step.title}>
            <span className="cr-n" aria-hidden="true">
              {n + 1}
            </span>
            <p className="cr-mode">
              {step.mode === "In writing" ? <WriteGlyph /> : <VideoGlyph />}
              {step.mode}
            </p>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

function Join(): React.JSX.Element {
  const { join } = careers;
  /* The footer's own profile: one address for LinkedIn on the whole site. */
  const follow = socialProfiles.find((profile) => profile.platform === join.follow.platform)!.href;
  return (
    <section className="sec cr-join-s" id={join.id} aria-labelledby={`${join.id}-h`}>
      <div className="wrap">
        <div className="cr-join rv">
          <div className="cr-jc">
            <h2 id={`${join.id}-h`}>{join.title}</h2>
            <p>{join.body}</p>
            <div className="cr-jb">
              <a className="btn btn-light" href={join.introduce.href}>
                {join.introduce.label}
              </a>
              <a className="btn btn-wire" href={follow} {...offSiteProps(follow)}>
                {join.follow.label}
                <NewTabHint href={follow} />
              </a>
              <span>
                {join.writeTo}
                <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
              </span>
            </div>
          </div>
          <div className="cr-jt">
            {join.teams.map((team) => (
              <div className="cr-jg" key={team.name}>
                <p>{team.name}</p>
                <ul>
                  {team.roles.map((role) => (
                    <li key={role}>
                      <a href={teamMailto(role)}>{role}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <TurningMarkArt className="cr-jart" />
        </div>
      </div>
    </section>
  );
}

export function CareersPage(): React.JSX.Element {
  const { values } = careers;
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <SiteNav />
      <main id="main" tabIndex={-1} className="cr-main">
        <Hero />
        <Build />
        <Section id={values.id} title={values.title} band>
          <CareersValues />
        </Section>
        <Work />
        <Hire />
        <Join />
        <CareersMotion />
      </main>
      <FooterSection />
    </>
  );
}
