import { NewTabHint } from "@/components/primitives/new-tab-hint";
import { researchPage, type ResearchGroup, type ResearchPaper } from "@/content/research";
import { ArrowOutGlyph, DocGlyph } from "@/features/documents/document-glyphs";
import { named } from "@/features/legal/named";
import { LearnFrame } from "@/features/learn/learn-parts";
import { offSiteProps } from "@/lib/links";

/**
 * `/cloud-cost-optimization-research-papers`, on /community's frame (Learn's):
 *
 *   hero          the page's name and its deck
 *   papers        one group per subject, drawn as the Docs hub draws a group (its name, its line, the hairline), its
 *                 papers on /community's Read more tiles, two by two: the paper's name as an h3, then who wrote it
 *                 and where, then our note; only the name is the link, and it opens the publisher's page in a new tab
 *   note          after the groups, in the community page's small type: whose papers they are, and whose notes
 *   closing row   the site's assessment row, for both products, as every Learn page ends
 *
 * A server component with no script of its own.
 */

/* A paper's tile keeps the Read more tile's classes (`article.dt > div.dt-a`: the icon, the words, the arrow out), so it
   looks as it did. Only the paper's name is the link, so the link's words are the title alone, not the title, byline
   and note run together. */
function Paper({ paper }: { readonly paper: ResearchPaper }): React.JSX.Element {
  return (
    <article className="dt">
      <div className="dt-a">
        <DocGlyph className="dt-ic" />
        <div>
          <h3 className="dt-t">
            <a href={paper.href} {...offSiteProps(paper.href)}>
              {named(paper.title)}
              <NewTabHint href={paper.href} />
            </a>
          </h3>
          <p className="dt-l">{named(paper.by)}</p>
          <p className="dt-l">{named(paper.note)}</p>
        </div>
        <ArrowOutGlyph className="dt-go" />
      </div>
    </article>
  );
}

function Group({ group }: { readonly group: ResearchGroup }): React.JSX.Element {
  return (
    <section className="res-group" id={group.id} aria-labelledby={`${group.id}-h`}>
      <div className="res-head">
        <h2 id={`${group.id}-h`}>{named(group.name)}</h2>
        <p>{named(group.line)}</p>
      </div>
      <div className="dt-grid dt-2x2">
        {group.papers.map((paper) => (
          <Paper paper={paper} key={paper.href} />
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
