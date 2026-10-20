import { ProductMark } from "@/components/brand/product-marks";
import { Arrow } from "@/components/primitives/arrow";
import { MarketplaceLine } from "@/components/primitives/marketplace-line";
import { routes } from "@/config/site";
import { heroContent } from "@/content/hero";
import { products } from "@/content/products";
import { heroPhoto } from "@/features/hero/hero-image";
import { HeroPhoto } from "@/features/hero/hero-photo";

/**
 * Hero — the headline, the pitch, one call to action and the two products by
 * name, over a graded photograph of a rack aisle.
 *
 * A server component. The one thing that needs the browser, the photo's failure
 * handler, is an island of its own, so the copy is server-rendered and the
 * section holds no state.
 *
 * The product lockups stand on the left accent rule: a mark, the name, and the
 * product's one line. Each goes to that product's own page, not to its section
 * below: the sections are one scroll away, and the lockup is the way into the
 * product.
 *
 * Between the button and the lockups, the one quiet marketplace line: "Coral
 * is available in …", naming Coral because the listings are Coral's.
 *
 * The h1 opens on the name (`heroContent.name`): a small line of its own above
 * the tagline, `translate="no"`
 * as the product names are. The space after the span is the mock's: the
 * heading's text reads "Zoorik Reduce cloud cost, autonomously.", not
 * "ZoorikReduce", wherever it is read as text.
 *
 * 🔴 NO TURNING MARK HERE, AND THE WORDS IN BONE. The home hero alone drops
 * `TurningMark`; the product pages, the docs, /assessment and the legal pages
 * keep theirs. The ground, the photograph, its scrims and the left-aligned
 * column stay as they are, and the words,
 * the button, the marketplace line and the lockups take the brand's bone
 * (#FAF7F3), the button bone on navy ink. `hero-home` is what scopes that: the
 * other heroes share `.hero`, `.hero-sub`, `.btn-light` and the rest, and the
 * site system's `.hero-home` rules reach none of them.
 *
 * `id="top"` is the wordmarks' anchor, not decoration.
 */
export function HeroSection(): React.JSX.Element {
  return (
    <header className="hero hero-home" id="top">
      <HeroPhoto {...heroPhoto} />
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
        <MarketplaceLine className="hero-mkt" icon named />
        <div className="hero-prods">
          {heroContent.lockups.map((id) => {
            const product = products[id];
            return (
              <a className="hp" href={routes[id]} key={id}>
                <ProductMark product={id} className="hp-mk" />
                <span>
                  <b translate="no">{product.name}</b>
                  <span>{product.descriptor}</span>
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </header>
  );
}
