import type { JSX } from "react";

import { BrandLogo } from "@/components/brand/brand-mark";
import { TurningMark } from "@/components/brand/turning-mark";
import { ExternalArrow } from "@/components/primitives/external-arrow";
import { NamedText } from "@/components/primitives/named-text";
import { NewTabHint } from "@/components/primitives/new-tab-hint";
import { routes, site } from "@/config/site";
import { loginCopy, loginDemo, loginLegals, loginPanel, loginProducts } from "@/content/login";
import { HeroPhoto } from "@/features/hero/hero-photo";
import heroImage from "@/features/hero/hero-racks-graded.webp";
import { EstimateLink, LoginSwitch } from "@/features/login/login-switch";
import { ProductCard } from "@/features/login/product-card";
import { isOffSite, offSiteProps } from "@/lib/links";
import { FIRST_PAINT_SCRIPT } from "@/lib/product-choice";

/**
 * The whole of `/login`: on the left the product switch and the chosen
 * product's card, `?p=` or Coral; on the right the home hero's ground and
 * photograph.
 *
 * ─── NO NAV, NO SITE FOOTER, AND THAT IS THE POINT ─────────────────────────
 * This is the one page a returning customer opens on purpose. The mock gives it
 * a full-height two-column shell with a lockup that goes home and a thin legal
 * row, and nothing else — no menu to browse, no second call to action pulling
 * against the one thing the page is for.
 *
 * ─── THE LOCKUP IS DRAWN TWICE, AND EXACTLY ONE IS EVER EXPOSED ────────────
 * The column's is navy and the panel's is white, and the breakpoint hides one
 * of them outright — `display:none`, which takes it out of the accessibility
 * tree too. So a screen reader finds one "Zoorik home" link at every width.
 *
 * ─── THE PANEL IS LABELLED, NOT HIDDEN ─────────────────────────────────────
 * It holds a link (the only visible lockup below 900px), so the `<aside>` stays
 * in the accessibility tree as "Zoorik". The photo, the glow and the turning
 * mark carry their own `aria-hidden`; the headline and the line are content.
 *
 * ─── PLAIN ANCHORS, NOT next/link ──────────────────────────────────────────
 * As the header, the footer and the 404 draw them: nothing else here needs the
 * link runtime, so the page ships none of it.
 *
 * A SERVER COMPONENT, WITH ISLANDS. The product is `html[data-ap]`, and the
 * sheet shows the card and places the switch's thumb from it; the switch and
 * the estimate link are the islands that read it (`login-switch.tsx`). The
 * photo's remove-on-error is `HeroPhoto`'s own.
 */
const HOME = "/";

export function LoginScreen(): JSX.Element {
  return (
    <>
      {/* First, so it runs while the HTML parses: the page's product, `?p=` or
          Coral, on <html> before the switch and the cards are painted. */}
      <script dangerouslySetInnerHTML={{ __html: FIRST_PAINT_SCRIPT }} />
      {/* Ahead of the page, as in the mock: fixed, so its place changes nothing
          on screen, and the first Tab stop either way. */}
      <a className="skip" href="#main">
        Skip to content
      </a>
      <div className="login">
        <section className="col">
          <a className="lock navy" href={HOME} aria-label="Zoorik home">
            <BrandLogo />
          </a>
          <main id="main" tabIndex={-1}>
            <h1>{loginCopy.heading}</h1>
            <LoginSwitch />
            {loginProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            <p className="new">
              {loginDemo.map((run) =>
                run.href === routes.assessment ? (
                  <EstimateLink key={run.text} text={run.text} />
                ) : run.href ? (
                  /* The calendar opens in a new tab and says so, to the ear and
                     the eye; the assessment is a page of this site. */
                  <a key={run.text} className="lk" href={run.href} {...offSiteProps(run.href)}>
                    {run.text}
                    <NewTabHint href={run.href} />
                    {isOffSite(run.href) ? <ExternalArrow /> : null}
                  </a>
                ) : (
                  <NamedText key={run.text} text={run.text} name={site.name} />
                ),
              )}
            </p>
          </main>
          <footer className="foot">
            <small>
              <NamedText text={loginCopy.copyright} name={site.name} />
            </small>
            {/* Privacy and Terms, on the right of the row:
                pages of this site, in the same tab. */}
            <span className="foot-legals">
              {loginLegals.map((legal) => (
                <a key={legal.href} className="foot-legal" href={legal.href}>
                  {legal.label}
                </a>
              ))}
            </span>
          </footer>
        </section>
        <aside className="panel" aria-label="Zoorik">
          {/* The rack frame, which removes itself if it fails and leaves
              the ground, the scrim, the mark and the line. */}
          <HeroPhoto
            src={heroImage.src}
            className="photo"
            priority={false}
            width={heroImage.width}
            height={heroImage.height}
          />
          <TurningMark className="art" glowClassName="glow" />
          <a className="lock bone" href={HOME} aria-label="Zoorik home">
            <BrandLogo />
          </a>
          <h2>{loginPanel.heading}</h2>
          <p>
            <NamedText text={loginPanel.body} name={loginProducts.map((p) => p.name)} />
          </p>
        </aside>
      </div>
    </>
  );
}
