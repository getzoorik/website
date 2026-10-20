import { Fragment } from "react";

import { Arrow } from "@/components/primitives/arrow";
import {
  learnComparisons,
  learnFixes,
  learnGuides,
  learnPage,
  learnProof,
  learnStart,
  learnSubjects,
  type LearnCard,
  type LearnSubject,
} from "@/content/learn";
import { named } from "@/features/legal/named";
import { CardBody } from "@/features/learn/learn-cards";
import {
  FindableCard,
  FindableSection,
  FixPicker,
  LearnFilters,
  LearnSearch,
  NothingMatches,
  SubjectChips,
  type Findable,
} from "@/features/learn/learn-filters";
import { MoreFromZoorik } from "@/features/learn/learn-more";
import {
  LearnFrame,
  LearnSection,
  LearnSectionBody,
  sectionClass,
} from "@/features/learn/learn-parts";
import { WatchAndRead } from "@/features/learn/learn-watch";

/**
 * `/learn`: the hero and its search; Start here, one guide per subject, with the subject chips; Find the right
 * fix; Compare, the native tools' comparisons; Guides; Watch and read, the two product films and the Medium panel
 * (`WatchAndRead`); More from Zoorik, one card each for /news, Cloud cost optimization tools and /community
 * (`MoreFromZoorik`); the case study; then the site's closing row. Learn teaches only: the tools in the market and
 * Coral and Amoeba against them are Cloud cost optimization tools', so the hub names no tool of the market. Only published articles are shown (`learn.ts`), each read
 * from the Learn index.
 *
 * Drawn on the server. The search, the chips and Find the right fix share one state (`LearnFilters`); nothing else has
 * script, as in the mock. The search and the subject narrow Start here, Compare and Guides, and leave the sections with
 * nothing findable alone (Find the right fix narrows its own questions), as the mock's script does. The mock has no
 * motion of its own but hover: the cards' lift and the films' zoom, which reduced motion stills (learn.css).
 */

const tag = (subject: LearnSubject): string =>
  learnSubjects.find((entry) => entry.id === subject)!.label;

/** A card's words for the search, as the mock's `data-s`: its title, its line and its subject, in lower case. */
const findable = (card: LearnCard): Findable => ({
  subject: card.subject,
  search: `${card.title} ${card.line} ${tag(card.subject)}`.toLowerCase(),
});

export function LearnHub(): React.JSX.Element {
  const { hero, search, subjects, start, fix, compare, guides, proof } = learnPage;
  const startItems = learnStart.map(findable);
  const compareItems = learnComparisons.map(findable);
  const guideItems = learnGuides.map(findable);

  return (
    <LearnFilters
      items={[...startItems, ...compareItems, ...guideItems]}
      fixes={learnFixes.map((entry) => entry.subject)}
    >
      <LearnFrame
        hero={{
          title: named(hero.title),
          after: <LearnSearch label={search.label} placeholder={search.placeholder} />,
        }}
      >
        <FindableSection id={start.id} className={sectionClass()} items={startItems} keep>
          <div className="wrap">
            <div className="lv-head lv-subj">
              <div>
                <h2 id={`${start.id}-h`}>{start.title}</h2>
                <p>{start.lede}</p>
              </div>
              <SubjectChips label={subjects.label} all={subjects.all} subjects={learnSubjects} />
            </div>
            <div className="lv-grid3">
              {learnStart.map((card, index) => (
                <FindableCard href={card.href} item={startItems[index]!} key={card.href}>
                  <CardBody
                    subject={card.subject}
                    tag={tag(card.subject)}
                    k={index}
                    vs={compare.vs}
                    title={card.title}
                    line={card.line}
                    foot={<span className="lv-date">{card.date}</span>}
                  />
                </FindableCard>
              ))}
            </div>
            <NothingMatches text={start.empty} reset={start.reset} />
          </div>
        </FindableSection>

        <LearnSection id={fix.id} title={fix.title} lede={named(fix.lede)} band>
          <div className="fx" data-s="fix">
            <FixPicker
              label={fix.question}
              questions={learnFixes.map(({ subject, question }) => ({ subject, question }))}
              panels={learnFixes.map((entry) => (
                <Fragment key={entry.question}>
                  <p className="fx-k">{fix.helps}</p>
                  <h3>{entry.helps}</h3>
                  <p className="fx-k">{fix.tools}</p>
                  <div className="fx-tools">
                    {entry.tools.map((tool) => (
                      <span key={tool}>{tool}</span>
                    ))}
                  </div>
                  <p className="fx-k">{named(fix.fits)}</p>
                  <p className="fx-z">{named(entry.fits)}</p>
                  {/* One span around the label: `named()` splits it at a product's name, and in this flex link each
                      part would be its own item, with the gap between them. An article not yet published is named
                      without a link or an arrow. */}
                  {entry.read.href ? (
                    <a className="fx-read" href={entry.read.href}>
                      <span>{named(`${fix.read}${entry.read.title}`)}</span> <Arrow />
                    </a>
                  ) : (
                    <p className="fx-read">
                      <span>{named(`${fix.read}${entry.read.title}`)}</span>
                    </p>
                  )}
                </Fragment>
              ))}
            />
          </div>
        </LearnSection>

        <FindableSection id={compare.id} className={sectionClass(true)} items={compareItems}>
          <LearnSectionBody id={compare.id} title={compare.title} lede={compare.lede}>
            <div className="lv-grid3">
              {learnComparisons.map((card, index) => (
                <FindableCard href={card.href} item={compareItems[index]!} key={card.href}>
                  <CardBody
                    subject={card.subject}
                    tag={tag(card.subject)}
                    k={1 + index}
                    versus={card.versus}
                    vs={compare.vs}
                    title={card.title}
                    line={card.line}
                    foot={<span className="lv-date">{card.date}</span>}
                  />
                </FindableCard>
              ))}
            </div>
          </LearnSectionBody>
        </FindableSection>

        <FindableSection id={guides.id} className={sectionClass()} items={guideItems}>
          <LearnSectionBody id={guides.id} title={guides.title} lede={guides.lede}>
            <div className="lv-grid3">
              {learnGuides.map((card, index) => (
                <FindableCard href={card.href} item={guideItems[index]!} key={card.href}>
                  <CardBody
                    subject={card.subject}
                    tag={tag(card.subject)}
                    k={2 + index}
                    vs={compare.vs}
                    title={card.title}
                    line={card.line}
                    foot={<span className="lv-date">{card.date}</span>}
                  />
                </FindableCard>
              ))}
            </div>
          </LearnSectionBody>
        </FindableSection>

        <WatchAndRead />

        <MoreFromZoorik />

        <LearnSection id={proof.id} title={proof.title} lede={proof.lede} band>
          <a className="lv-proof" href={learnProof.href}>
            <span className="lv-pk">{named(learnProof.kicker)}</span>
            <span className="lv-pbig">{learnProof.figure}</span>
            <span className="lv-pt">
              <b>{learnProof.title}</b>
              <small>{named(learnProof.line)}</small>
            </span>
            <span className="fx-read light">
              {learnProof.read} <Arrow />
            </span>
          </a>
        </LearnSection>
      </LearnFrame>
    </LearnFilters>
  );
}
