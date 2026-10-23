import { Arrow } from "@/components/primitives/arrow";
import { heroContent } from "@/content/hero";
import { HeroFilm } from "@/features/hero-film/hero-film";
import { HeroMarketplaces } from "@/features/hero/hero-marketplaces";

/**
 * Hero — the name, the headline, the pitch, one call to action and the line
 * that says where to buy, over the Gargantua film, one screen tall.
 *
 * A server component. The film is an island of its own (`HeroFilm`): it picks
 * its file in the browser and plays it, or keeps its still under reduced
 * motion. Everything over it is server-rendered.
 *
 * ─── ONLY FIVE THINGS, IN THIS ORDER (owner, 23 Oct 2026) ───────────────────
 * "Zoorik", small, above the h1; the h1; the line under it; one button,
 * Estimate your saving; and "Coral and Amoeba are available in AWS Marketplace
 * and Microsoft Marketplace" with the stores' marks. The product lockups that
 * stood under the line are gone: the bar and the two sections below carry the
 * products.
 *
 * The h1 opens on the name (`heroContent.name`): a small line of its own above
 * the tagline, `translate="no"` as the product names are. The space after the
 * span is the mock's: the heading's text reads "Zoorik Reduce cloud cost,
 * autonomously.", not "ZoorikReduce", wherever it is read as text.
 *
 * 🔴 NO TURNING MARK HERE, AND THE WORDS IN BONE. The home hero alone drops
 * `TurningMark`. The film fills the hero under a scrim in its own sky, #080014
 * (hero.css), the words left-aligned in bone (#FAF7F3), the button bone on navy
 * ink. `hero-home` is what scopes that: the other heroes share `.hero`,
 * `.hero-sub`, `.btn-light` and the rest, and no `.hero-home` rule reaches them.
 *
 * `id="top"` is the wordmarks' anchor, not decoration.
 */
export function HeroSection(): React.JSX.Element {
  return (
    <header className="hero hero-home" id="top">
      <HeroFilm film="gargantua" />
      <div className="wrap hero-in">
        <h1>
          <span className="hero-name" translate="no">
            {heroContent.name}
          </span>{" "}
          {heroContent.headline}
        </h1>
        <p className="hero-sub">{heroContent.sub}</p>
        <div className="hero-cta">
          {/* The mock's markup, a space before the arrow included: inside the
              inline-flex button it collapses, so the 10px gap is the only room. */}
          <a className="btn btn-light" href={heroContent.cta.href}>
            {heroContent.cta.label} <Arrow />
          </a>
        </div>
        <HeroMarketplaces />
      </div>
    </header>
  );
}
