import { NewTabHint } from "@/components/primitives/new-tab-hint";
import { Reveal } from "@/components/primitives/reveal";
import {
  learnFilms,
  learnFixRows,
  learnMedium,
  learnMore,
  learnPage,
  learnStart,
  learnSubjects,
  learnTiles,
  type LearnRow,
} from "@/content/learn";
import { ArrowGlyph, ArrowOutGlyph, DocGlyph } from "@/features/documents/document-glyphs";
import { LinkTile } from "@/features/documents/link-tile";
import { named } from "@/features/legal/named";
import { LearnArticleList } from "@/features/learn/learn-list";
import { LearnFrame } from "@/features/learn/learn-parts";
import { CheckGlyph } from "@/features/programs/program-glyphs";
import { offSiteProps } from "@/lib/links";

/**
 * `/learn`, as the approved redesign draws it:
 *
 *   hero            the page's name and its line
 *   band            Start here (the three subjects' guides) on the white card, beside Find the right fix (three causes
 *                   of a high bill, each to its guide) on the navy one, as #assess's pair; each a list of rows
 *   All articles    every other published article as a cover tile, in the order the site publishes by, with the
 *                   subject chips and Show all (`LearnArticleList`, the page's only script)
 *   Watch and read  the two product films and the Medium post, each a tile that opens it in a new tab
 *   More from       Value Lab, Cloud cost optimization tools, Community and News
 *
 * No closing row: the redesign ends on More from Zoorik. The pair rises as it arrives; nothing else moves but hover.
 */

/** A row of the band: its words, the article's h1 as its hover title, and the arrow. */
function Rows({
  rows,
  dark = false,
}: {
  readonly rows: readonly LearnRow[];
  readonly dark?: boolean;
}) {
  return (
    <ul className={dark ? "lr-list lr-dark" : "lr-list"}>
      {rows.map((row) => (
        <li key={row.href}>
          <a className="lr-l" href={row.href} title={row.title}>
            <span>{named(row.name)}</span>
            <ArrowGlyph className="dt-go" weight={2.2} />
          </a>
        </li>
      ))}
    </ul>
  );
}

function Band(): React.JSX.Element {
  const { band, start, fix } = learnPage;
  return (
    <section className="sec sec-band lr-pair" aria-label={band}>
      <div className="wrap">
        <div className="as-grid">
          <Reveal className="as-card as-mini lr-c" order={0}>
            <DocGlyph className="lr-own lr-own-l" />
            <h2 className="as-h">{start.title}</h2>
            <p>{start.line}</p>
            <Rows rows={learnStart} />
          </Reveal>
          <Reveal className="as-cal lr-c" order={1}>
            <CheckGlyph className="lr-own" />
            <h2 className="as-h">{fix.title}</h2>
            <p>{fix.line}</p>
            <Rows rows={learnFixRows} dark />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** The Medium mark, the post's thumbnail on its navy ground. */
function MediumMark(): React.JSX.Element {
  return (
    <svg viewBox="0 0 24 24">
      <ellipse cx="6.8" cy="12" rx="6.8" ry="6.9" />
      <ellipse cx="17.4" cy="12" rx="3.4" ry="6.5" />
      <ellipse cx="22.4" cy="12" rx="1.2" ry="5.8" />
    </svg>
  );
}

function Watch(): React.JSX.Element {
  const { watch } = learnPage;
  return (
    <section className="sec lr-sec" id={watch.id} aria-labelledby={`${watch.id}-h`}>
      <div className="wrap">
        <div className="sec-hrow">
          <h2 id={`${watch.id}-h`}>{watch.title}</h2>
        </div>
        <div className="dt-grid">
          {learnFilms.map((film) => (
            <article className="dt lr-t" key={film.product}>
              <a className="dt-a" href={film.href} {...offSiteProps(film.href)}>
                <span className="lr-th lr-film">
                  {/* A plain <img>, as Watch and read's posters were: the thumbnail is a file in public/films, and
                      the sheet owns the box (`.lr-th img`). */}
                  {/* eslint-disable-next-line @next/next/no-img-element -- see above */}
                  <img
                    src={film.poster}
                    alt=""
                    width={1920}
                    height={1080}
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <span>
                  <span className="dt-t">{named(film.title)}</span>
                  <span className="lr-m">
                    {film.length} · {watch.film}
                  </span>
                </span>
                <ArrowOutGlyph className="dt-go" />
                <NewTabHint href={film.href} />
              </a>
            </article>
          ))}
          <article className="dt lr-t">
            <a className="dt-a" href={learnMedium.url} {...offSiteProps(learnMedium.url)}>
              <span className="lr-th lr-md" aria-hidden="true">
                <MediumMark />
              </span>
              <span>
                <span className="dt-t">{learnMedium.title}</span>
                <span className="lr-m">
                  {watch.medium} · {learnMedium.date}
                </span>
              </span>
              <ArrowOutGlyph className="dt-go" />
              <NewTabHint href={learnMedium.url} />
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}

function More(): React.JSX.Element {
  const { more } = learnPage;
  return (
    <section className="sec lr-sec" id={more.id} aria-labelledby={`${more.id}-h`}>
      <div className="wrap">
        <div className="sec-hrow">
          <h2 id={`${more.id}-h`}>{named(more.title)}</h2>
        </div>
        <div className="dt-grid lr-4">
          {learnMore.map((tile) => (
            <LinkTile key={tile.href} href={tile.href} title={named(tile.title)} line={tile.line} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function LearnHub(): React.JSX.Element {
  const { hero } = learnPage;
  return (
    <LearnFrame hero={{ title: named(hero.title), deck: hero.deck }} closing={false}>
      <Band />
      <LearnArticleList tiles={learnTiles} subjects={learnSubjects} words={learnPage.articles} />
      <Watch />
      <More />
    </LearnFrame>
  );
}
