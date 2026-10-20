import { Chips } from "@/components/primitives/chips";
import { NamedText } from "@/components/primitives/named-text";
import { Reveal } from "@/components/primitives/reveal";
import { site } from "@/config/site";
import type { ProductPageContent } from "@/content/product-page";
import { productOrder, products } from "@/content/products";
import { OfferingIcon } from "@/features/product-page/offering-icon";
import { OfferingTour } from "@/features/product-page/offering-tour";

/** Every name running text can carry, each kept out of translation. */
const NAMES = [site.name, ...productOrder.map((id) => products[id].name)];

/**
 * What is <product>? (`#about-coral`, `#about-amoeba`), with What <product>
 * does on its right.
 *
 * Left, the heading asks the question and three paragraphs say what the product
 * is, who it is for and what you see with it. Right (`div.pf-does#what`), the
 * twin heading on the same line, the offering rows and the Runs on chips. Each
 * row is its icon tile, its title and its line, and keeps its id, so the hero's
 * tag for it lands here; the row's `scroll-margin-top` (104px, the site
 * system's `.flist li[id]`) parks it under the bar. The rows take turns while
 * the column is in view (`OfferingTour`, the one client part); every row's line
 * is always drawn, so nothing moves when the row being read changes.
 *
 * Two columns from 1100px, the rows spread over the text's height so both
 * columns end together; stacked below, the rows after the text. The two columns
 * rise in turn, and nothing else moves.
 */
export function ProductAbout({ content }: { content: ProductPageContent }): React.JSX.Element {
  const { about, offerings, product, what } = content;
  const headingId = `about-${product}-h`;
  const name = products[product].name;

  return (
    <section className="sec" id={`about-${product}`} aria-labelledby={headingId}>
      <div className="wrap pp-def pf-def">
        <Reveal className="pp-def-t">
          <h2 id={headingId}>
            <NamedText text={about.title} name={name} />
          </h2>
          <div className="pp-prose">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph}>
                <NamedText text={paragraph} name={NAMES} />
              </p>
            ))}
          </div>
        </Reveal>
        <Reveal className="pf-does" order={1} id="what">
          <h2 id="what-h">
            <NamedText text={what.heading} name={name} />
          </h2>
          <OfferingTour>
            {offerings.map((offering) => (
              <li id={offering.id} className="has-i" key={offering.id}>
                <span className="flist-i" aria-hidden="true">
                  <OfferingIcon icon={offering.icon} />
                </span>
                <div>
                  <h3>{offering.label}</h3>
                  <span className="tour-line">{offering.line}</span>
                </div>
                <span className="tour-prog" aria-hidden="true">
                  <i />
                </span>
              </li>
            ))}
          </OfferingTour>
          <Chips
            id={`${product}-what-runs`}
            label={what.runsOn.label}
            items={what.runsOn.platforms}
          />
        </Reveal>
      </div>
    </section>
  );
}
