import { Fragment } from "react";

import { contactEmail } from "@/config/site";
import { learnProductSubject, learnSubjects, type LearnSubject } from "@/content/learn";
import {
  alternativesPages,
  compareHubPage,
  versusPages,
  versusRoute,
} from "@/content/learn-compare";
import { marketChecked, marketGroups, type MarketGroup } from "@/content/learn-market";
import { products } from "@/content/products";
import { named } from "@/features/legal/named";
import { CardBody } from "@/features/learn/learn-cards";
import { LearnFrame, LearnSection } from "@/features/learn/learn-parts";
import { MarketHead, OursRow, ToolRow } from "@/features/learn/market-rows";
import { MarketTabs } from "@/features/learn/market-tabs";
import { versusFactsOf } from "@/features/learn/versus-page";

/**
 * `/compare`, the comparison hub: the hero, then Tools in the market, the market map's four tabs of named tools with
 * Coral and Amoeba first in their groups and the note with the day they were checked, then Compare Coral and Amoeba
 * on the band, the two live versus pages and the two alternatives pages as cards, then the site's closing row.
 *
 * Every name, line and figure is read from `learn-market.ts` and `learn-compare.ts`, so the hub and the pages under it
 * never disagree; nothing here spells a competitor. Drawn on the server; the map's tabs are the one client island
 * (`MarketTabs`). The mock has no motion but the cards' hover, which reduced motion stills
 * (learn.css). The mock's `data-p`/`data-s` hooks feed /learn's filter script, which this page has nothing for.
 */

const tag = (subject: LearnSubject): string =>
  learnSubjects.find((entry) => entry.id === subject)!.label;

/** A group's panel: its line, the column heads, then its rows, each subgroup's heading before its first tool. */
function MarketPanel({ group }: { readonly group: MarketGroup }): React.JSX.Element {
  return (
    <>
      <p className="mk-lede">{group.lede}</p>
      <MarketHead />
      <ol className="mk-list">
        {group.ours ? <OursRow ours={group.ours} /> : null}
        {group.tools.map((tool, index) => (
          <Fragment key={tool.name}>
            {tool.subgroup !== group.tools[index - 1]?.subgroup ? (
              <li className="mk-sub">{tool.subgroup}</li>
            ) : null}
            <ToolRow tool={tool} />
          </Fragment>
        ))}
      </ol>
    </>
  );
}

export function CompareHub(): React.JSX.Element {
  const { hero, tools, ours } = compareHubPage;
  const note = tools.note(marketChecked);
  const checked = <span className="lv-date">{ours.checked(marketChecked)}</span>;

  return (
    <LearnFrame hero={{ title: hero.title, deck: hero.deck(marketChecked) }}>
      <LearnSection id={tools.id} title={tools.title} lede={named(tools.lede)}>
        <div className="mk" data-s="market">
          <MarketTabs
            label={tools.tabs}
            tabs={marketGroups.map((group) => ({
              label: group.label,
              count: tools.count(group.tools.length),
            }))}
            panels={marketGroups.map((group) => (
              <MarketPanel group={group} key={group.id} />
            ))}
          />
          <p className="mk-note">
            {note.before}
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
            {note.after}
          </p>
        </div>
      </LearnSection>

      <LearnSection id={ours.id} title={named(ours.title)} lede={ours.lede} band>
        <div className="lv-grid3">
          {versusPages.map((page) => {
            const subject = learnProductSubject[page.product];
            const versus = [products[page.product].name, versusFactsOf(page.slug).name] as const;
            return (
              <a className="lv-card" href={versusRoute(page)} key={page.slug}>
                <CardBody
                  subject={subject}
                  tag={tag(subject)}
                  k={0}
                  versus={versus}
                  vs={ours.vs}
                  title={page.meta.title}
                  line={page.line}
                  foot={checked}
                />
              </a>
            );
          })}
          {alternativesPages.map((page, index) => {
            const subject = learnProductSubject[page.product];
            return (
              <a className="lv-card" href={page.route} key={page.route}>
                {/* The mock draws each motif for its card's place counted from 5, as /learn did. */}
                <CardBody
                  subject={subject}
                  tag={tag(subject)}
                  k={5 + index}
                  vs={ours.vs}
                  title={page.meta.title}
                  line={page.line}
                  foot={checked}
                />
              </a>
            );
          })}
        </div>
      </LearnSection>
    </LearnFrame>
  );
}
