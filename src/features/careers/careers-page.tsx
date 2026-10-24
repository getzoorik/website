import { ProductMark } from "@/components/brand/product-marks";
import { SiteNav } from "@/components/layout/site-nav";
import { Arrow } from "@/components/primitives/arrow";
import { NewTabHint } from "@/components/primitives/new-tab-hint";
import { contactEmail } from "@/config/site";
import { careers, teamMailto } from "@/content/careers";
import { socialProfiles } from "@/content/footer";
import { products } from "@/content/products";
import { CareersHire } from "@/features/careers/careers-hire";
import { ToolMark } from "@/features/careers/careers-marks";
import { CareersMotion } from "@/features/careers/careers-motion";
import { CareersOrbit } from "@/features/careers/careers-orbit";
import { CareersValues } from "@/features/careers/careers-values";
import { CareersWork } from "@/features/careers/careers-work";
import { FooterSection } from "@/features/footer/footer-section";
import { named } from "@/features/legal/named";
import { offSiteProps } from "@/lib/links";

/**
 * `/careers`, option A of the 24 Oct proposal (owner, 25 Oct 2026: "built
 * exactly this"), in the language the home, Coral and Amoeba pages carry:
 *
 *   hero              a quiet navy band: "Careers", Work at Zoorik, the line,
 *                     Introduce yourself and the quiet "No open roles right
 *                     now", the Zoorik mark with our tools turning round it
 *                     (`CareersOrbit`)
 *   What you will build   each product's 5-second film in its 4px frame, no card
 *                     outline; the product's mark and name, the home page's
 *                     title for it, its stack as marks with names, its page
 *   Our values        the picker (`CareersValues`), on the band
 *   How we work       four drawings (`CareersWork`)
 *   How we hire       six steps under one hairline, on the band (`CareersHire`)
 *   Want to build with us?   the close: a flat navy card, no art; Introduce
 *                     yourself and Follow us on LinkedIn, the address, and
 *                     the teams we hire for as white pills, each a ready email
 *
 * No open roles, no caps labels, no assessment row: the mock ends on the
 * close. The bands are flat --surface-2 (`.cq-band`), and the sheet's blocks
 * pointy: --r-card on the films and the close, pills only for the stack and
 * the teams.
 *
 * Each section after What you will build is its own component and returns its
 * whole `<section>`. One island moves this file's parts (`CareersMotion`: the
 * films, the rings); the values, the drawings and the hiring steps move by
 * their own.
 */

/** The footer's own profile: one address for LinkedIn on the whole site. */
const linkedIn = socialProfiles.find(
  (profile) => profile.platform === careers.join.follow.platform,
)!.href;

function Hero(): React.JSX.Element {
  const { hero } = careers;
  return (
    <header className="hero cq-hero" id="top">
      <div className="wrap hero-in cq-hin">
        <div className="cq-hcopy">
          <p className="cq-eye">{hero.eyebrow}</p>
          <h1>{named(hero.title)}</h1>
          <p className="hero-sub">{named(hero.deck)}</p>
          <div className="hero-cta">
            <a className="btn btn-light" href={hero.introduce.href}>
              {hero.introduce.label} <Arrow />
            </a>
          </div>
          <p className="cq-quiet">
            {/* One text node with its space, as the mock's: the line and the link sit as one line of type. */}
            {`${hero.quiet} `}
            <a href={linkedIn} {...offSiteProps(linkedIn)}>
              {hero.follow.label}
              <NewTabHint href={linkedIn} />
            </a>
          </p>
        </div>
        <CareersOrbit />
      </div>
    </header>
  );
}

function Build(): React.JSX.Element {
  const { build } = careers;
  return (
    <section className="sec" id={build.id} aria-labelledby={`${build.id}-h`}>
      <div className="wrap">
        <div className="sec-head">
          <h2 id={`${build.id}-h`}>{build.title}</h2>
          <p>{build.lede}</p>
        </div>
        <div className="cq-prods">
          {build.products.map((item) => {
            const { name, category } = products[item.product];
            return (
              <article className="cq-prod" key={item.product}>
                <div className="cq-vid">
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
                <p className="cq-plabel">
                  <ProductMark product={item.product} />
                  <span>{named(name)}</span>
                </p>
                <h3>{category}</h3>
                <ul className="cq-stack" aria-label={build.stackLabel}>
                  {item.stack.map((tool) => (
                    <li key={tool.name}>
                      {"mark" in tool ? (
                        <ToolMark mark={tool.mark} idSuffix={`cq-${item.product}`} />
                      ) : null}
                      <span>{tool.name}</span>
                    </li>
                  ))}
                </ul>
                <a className="alink" href={item.href}>
                  {build.see} {named(name)} <Arrow />
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Join(): React.JSX.Element {
  const { join } = careers;
  return (
    <section className="sec cq-join-s" id={join.id} aria-labelledby={`${join.id}-h`}>
      <div className="wrap">
        <div className="cq-join">
          <div className="cq-jc">
            <h2 id={`${join.id}-h`}>{join.title}</h2>
            <p>{join.body}</p>
            <div className="cq-jb">
              <a className="btn btn-light" href={join.introduce.href}>
                {join.introduce.label}
              </a>
              <a className="btn btn-wire" href={linkedIn} {...offSiteProps(linkedIn)}>
                {join.follow.label}
                <NewTabHint href={linkedIn} />
              </a>
            </div>
            <p className="cq-mail">
              {join.writeTo}
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
            </p>
          </div>
          <div className="cq-jt">
            {join.teams.map((team) => (
              <div className="cq-jg" key={team.name}>
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
        </div>
      </div>
    </section>
  );
}

export function CareersPage(): React.JSX.Element {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <SiteNav />
      <main id="main" tabIndex={-1} className="cq-main">
        <Hero />
        <Build />
        <CareersValues />
        <CareersWork />
        <CareersHire />
        <Join />
        <CareersMotion />
      </main>
      <FooterSection />
    </>
  );
}
