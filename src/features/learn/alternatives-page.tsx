import { Arrow } from "@/components/primitives/arrow";
import { contactEmail } from "@/config/site";
import {
  alternativesCopy,
  alternativesPages,
  versusPages,
  versusRoute,
  type AlternativesPage as AlternativesEntry,
} from "@/content/learn-compare";
import { alternativesFacts, marketChecked } from "@/content/learn-market";
import { products } from "@/content/products";
import { named } from "@/features/legal/named";
import { LearnFrame, LearnSection } from "@/features/learn/learn-parts";
import { MarketHead, marketOurs, marketTool, OursRow, ToolRow } from "@/features/learn/market-rows";
import { versusFactsOf } from "@/features/learn/versus-page";

/**
 * An alternatives page (`/cloud-cost-optimization-library/coral-alternatives` and `…/amoeba-alternatives`): the hero, then How to
 * choose (four questions), then The options: our product first on navy, then each tool in the page's order with its
 * owner, line, how it acts and clouds, a tool with a live versus page linking to it, and the note with the day it was
 * checked; then the closing row. Every fact is `learn-market.ts`'s. A server component with no script.
 */

/** The alternatives page at a route; a route that has none fails the build. */
export function alternativesPageAt(route: string): AlternativesEntry {
  const page = alternativesPages.find((entry) => entry.route === route);
  if (!page) throw new Error(`No alternatives page at ${route}.`);
  return page;
}

export function AlternativesPage({
  page,
}: {
  readonly page: AlternativesEntry;
}): React.JSX.Element {
  const facts = alternativesFacts.find((entry) => entry.product === page.product);
  if (!facts) throw new Error(`The market data has no alternatives for ${page.product}.`);
  const product = products[page.product].name;
  /* The product's live versus pages, by the tool each compares. */
  const versus = new Map(
    versusPages
      .filter((entry) => entry.product === page.product)
      .map((entry) => [versusFactsOf(entry.slug).tool, entry]),
  );
  const { choose, options } = alternativesCopy;
  const note = alternativesCopy.note(marketChecked);

  return (
    <LearnFrame
      hero={{
        kicker: alternativesCopy.kicker(marketChecked),
        title: named(page.h1),
        deck: named(page.deck ?? page.meta.description),
      }}
    >
      <LearnSection id={choose.id} title={page.titles?.choose ?? choose.title} lede={choose.lede}>
        <div className="ap-q">
          {facts.questions.map((question, index) => (
            <article key={question.q}>
              <span className="ap-n">{index + 1}</span>
              <h3>{question.q}</h3>
              <p>{question.a}</p>
            </article>
          ))}
        </div>
      </LearnSection>
      <LearnSection
        id={options.id}
        title={page.titles?.options ?? options.title}
        lede={options.lede}
        band
      >
        <MarketHead />
        <ol className="mk-list">
          <OursRow ours={marketOurs(page.product)} />
          {facts.tools.map((name) => {
            const compared = versus.get(name);
            return (
              <ToolRow
                tool={marketTool(name)}
                key={name}
                after={
                  compared ? (
                    /* One span around the label, so `named()`'s parts stay one item of this flex link. */
                    <a className="ap-vs" href={versusRoute(compared)}>
                      <span>{named(alternativesCopy.compare(product))}</span> <Arrow />
                    </a>
                  ) : null
                }
              />
            );
          })}
        </ol>
        <p className="mk-note">
          {note.before}
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          {note.after}
        </p>
      </LearnSection>
    </LearnFrame>
  );
}
