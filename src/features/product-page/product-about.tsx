import { Chips } from "@/components/primitives/chips";
import { NamedText } from "@/components/primitives/named-text";
import { Reveal } from "@/components/primitives/reveal";
import type { ProductPageContent } from "@/content/product-page";
import { products } from "@/content/products";
import { Text } from "@/features/learn/article-page";
import { OfferingDrawing } from "@/features/product-page/offering-drawing";
import { OfferingTour } from "@/features/product-page/offering-tour";

/**
 * What is <product>? (`#about-coral`, `#about-amoeba`), with What <product>
 * does on its right.
 *
 * Left, the heading asks the question and the lead paragraph says what the
 * product is. The other two (who it is for, what you see with it) sit behind a
 * quiet "More about <product>" (`details.pp-more`): folded, but in the page, for
 * search and for a screen reader (owner, 23 Oct 2026). Each paragraph is set as
 * an article's text (`Text`), its product names kept out of translation and its
 * links in the prose's own style: /coral links its subject's pillar and the
 * autoscalers it works with, /amoeba the btrfs pool (owner, 1 Nov 2026).
 *
 * Right (`div.pf-does#what`), the twin heading on the same line, the offering
 * rows and the Runs on chips. Each row is its 88×52 drawing (`OfferingDrawing`),
 * its title and its line, and keeps its id, so a link to it lands here; the
 * row's `scroll-margin-top` (104px, the site system's `.flist li[id]`) parks it
 * under the bar. The rows take turns while the column is in view
 * (`OfferingTour`, the one client part), and the row being read plays its
 * drawing; every row's line is always drawn, so nothing moves when the row
 * being read changes.
 *
 * Two columns from 1100px, the rows spread over the text's height so both
 * columns end together; stacked below, the rows after the text. The two columns
 * rise in turn, and nothing else moves.
 */
export function ProductAbout({ content }: { content: ProductPageContent }): React.JSX.Element {
  const { about, offerings, product, what } = content;
  const headingId = `about-${product}-h`;
  const name = products[product].name;
  const [lead, ...more] = about.paragraphs;

  return (
    <section className="sec" id={`about-${product}`} aria-labelledby={headingId}>
      <div className="wrap pp-def pf-def">
        <Reveal className="pp-def-t">
          <h2 id={headingId}>
            <NamedText text={about.title} name={name} />
          </h2>
          <div className="pp-prose">
            <p>
              <Text text={lead} breaks={false} />
            </p>
            {more.length > 0 ? (
              <details className="pp-more">
                <summary>
                  <span>
                    <NamedText text={about.more} name={name} />
                  </span>
                </summary>
                {more.map((paragraph, index) => (
                  <p key={index}>
                    <Text text={paragraph} breaks={false} />
                  </p>
                ))}
              </details>
            ) : null}
          </div>
        </Reveal>
        <Reveal className="pf-does" order={1} id="what">
          <h2 id="what-h">
            <NamedText text={what.heading} name={name} />
          </h2>
          <OfferingTour>
            {offerings.map((offering) => (
              <li id={offering.id} className="has-i" key={offering.id}>
                <span className="flist-i mv" aria-hidden="true">
                  <OfferingDrawing drawing={offering.drawing} />
                </span>
                <div>
                  <h3>{offering.label}</h3>
                  <span className="tour-line">{offering.line}</span>
                </div>
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
