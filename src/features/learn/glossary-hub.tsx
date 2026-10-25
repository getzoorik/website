import { routes } from "@/config/site";
import { glossaryHubGroups, glossaryPage, termRoute } from "@/content/learn/glossary";
import { LinkTile } from "@/features/documents/link-tile";
import { named } from "@/features/legal/named";
import { LearnFrame } from "@/features/learn/learn-parts";

/**
 * `/learn/glossary`, in the Learn hub's own parts:
 *
 *   hero      the link back to /learn over the h1, and its line
 *   groups    Kubernetes, Block storage, FinOps and pricing: each a section head with its count, then one tile per
 *             term, A–Z by the term's name, its h1 over its definition's first sentence (the hub's More from Zoorik
 *             tiles, `LinkTile`), two up from 981px (`lr-2`, learn.css)
 *
 * Then the site's closing assessment row, as on every Learn page but /learn. Every tile is a term of the glossary
 * index (`@/content/learn/glossary`), so a new term file is a new tile with no change here. A server component with
 * no script.
 */
export function GlossaryHub(): React.JSX.Element {
  const { hero, count } = glossaryPage;
  return (
    <LearnFrame
      hero={{
        kicker: <a href={routes.learn}>{hero.kicker}</a>,
        title: hero.title,
        deck: hero.deck,
      }}
    >
      {glossaryHubGroups.map((group) => (
        <section
          className="sec lr-sec"
          id={group.id}
          aria-labelledby={`${group.id}-h`}
          key={group.id}
        >
          <div className="wrap">
            <div className="sec-hrow">
              <h2 id={`${group.id}-h`}>{group.title}</h2>
              <p>
                {group.terms.length} {group.terms.length === 1 ? count.one : count.many}
              </p>
            </div>
            <div className="dt-grid lr-2">
              {group.terms.map((term) => (
                <LinkTile
                  key={term.slug}
                  href={termRoute(term)}
                  title={named(term.h1)}
                  line={named(term.card)}
                />
              ))}
            </div>
          </div>
        </section>
      ))}
    </LearnFrame>
  );
}
