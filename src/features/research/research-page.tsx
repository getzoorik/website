import { researchPage, type ResearchGroup } from "@/content/research";
import { LinkTile } from "@/features/documents/link-tile";
import { named } from "@/features/legal/named";
import { LearnFrame } from "@/features/learn/learn-parts";

/**
 * `/research-cloud-cost-optimization`, on /community's frame (Learn's):
 *
 *   hero          the page's name and its deck
 *   papers        one group per subject, drawn as the Docs hub draws a group (its name, its line, the hairline), its
 *                 papers as /community's Read more tiles, two by two: the paper's name, who wrote it and where, then
 *                 our note; each opens the publisher's page in a new tab
 *   note          after the groups, in the community page's small type: whose papers they are, and whose notes
 *   closing row   the site's assessment row, for both products, as every Learn page ends
 *
 * A server component with no script of its own.
 */

function Group({ group }: { readonly group: ResearchGroup }): React.JSX.Element {
  return (
    <section className="res-group" id={group.id} aria-labelledby={`${group.id}-h`}>
      <div className="res-head">
        <h2 id={`${group.id}-h`}>{named(group.name)}</h2>
        <p>{named(group.line)}</p>
      </div>
      <div className="dt-grid dt-2x2">
        {group.papers.map((paper) => (
          <LinkTile
            key={paper.href}
            href={paper.href}
            title={named(paper.title)}
            line={named(paper.by)}
            more={named(paper.note)}
          />
        ))}
      </div>
    </section>
  );
}

export function ResearchPage(): React.JSX.Element {
  const { hero, groups, note } = researchPage;
  return (
    <LearnFrame hero={{ title: named(hero.title), deck: named(hero.deck) }}>
      <section className="sec" id="papers" aria-label={researchPage.label}>
        <div className="wrap">
          {groups.map((group) => (
            <Group group={group} key={group.id} />
          ))}
          <p className="cm-note">{named(note)}</p>
        </div>
      </section>
    </LearnFrame>
  );
}
