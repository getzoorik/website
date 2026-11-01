"use client";

import { useState } from "react";

import type { LearnSubject, LearnTile } from "@/content/learn";
import { ArrowGlyph } from "@/features/documents/document-glyphs";
import { named } from "@/features/legal/named";

/**
 * /learn's All articles: the head and its count, the subject chips, the cover tiles and Show all. A tile is its
 * article's cover drawn in the page: the subject small at the top left, the short heading, the day and the author,
 * and on the right the cover's own drawing, cut from the cover file. The chips pick a subject; the first tiles show
 * until Show all, which then stays pressed whatever the chips pick. Nothing is stored.
 *
 * Its words come from the hub as props, so the Learn index stays on the server.
 */

export interface LearnListWords {
  readonly id: string;
  readonly title: string;
  readonly more: string;
  readonly subjects: { readonly label: string; readonly all: string };
  readonly showAll: { readonly before: string; readonly after: string };
  readonly shown: number;
}

export function LearnArticleList({
  tiles,
  subjects,
  words,
}: {
  readonly tiles: readonly LearnTile[];
  readonly subjects: readonly { readonly id: LearnSubject; readonly label: string }[];
  readonly words: LearnListWords;
}): React.JSX.Element {
  const [subject, setSubject] = useState<LearnSubject | null>(null);
  const [all, setAll] = useState(false);
  const label = (id: LearnSubject): string => subjects.find((entry) => entry.id === id)!.label;

  /* The subject's tiles, and of them the first ones until Show all is pressed. */
  const picked = tiles.filter((tile) => subject === null || tile.subject === subject);
  const shown = new Set((all ? picked : picked.slice(0, words.shown)).map((tile) => tile.href));

  return (
    <section className="sec lr-sec" id={words.id} aria-labelledby={`${words.id}-h`}>
      <div className="wrap">
        <div className="sec-hrow">
          <h2 id={`${words.id}-h`}>{words.title}</h2>
          <p>
            {tiles.length} {words.more}
          </p>
        </div>
        <div className="lr-chips" role="group" aria-label={words.subjects.label}>
          <button type="button" aria-pressed={subject === null} onClick={() => setSubject(null)}>
            {words.subjects.all}
          </button>
          {subjects.map((entry) => (
            <button
              type="button"
              aria-pressed={subject === entry.id}
              onClick={() => setSubject(entry.id)}
              key={entry.id}
            >
              {entry.label}
            </button>
          ))}
        </div>
        <div className="dt-grid lr-grid">
          {tiles.map((tile) => (
            <article
              className="dt lr-t lr-cv"
              data-p={tile.subject}
              hidden={!shown.has(tile.href)}
              key={tile.href}
            >
              <a className="dt-a" href={tile.href} title={tile.title}>
                <span className="lr-cvt">
                  <span className="lr-eb">{label(tile.subject)}</span>{" "}
                  <span>
                    <span className="dt-t">{named(tile.name)}</span>{" "}
                    <span className="lr-m">{tile.meta}</span>
                  </span>
                </span>
                <span
                  className="lr-art"
                  style={{ backgroundImage: `url(${tile.cover})` }}
                  aria-hidden="true"
                />
                <ArrowGlyph className="dt-go" weight={2.2} />
              </a>
            </article>
          ))}
        </div>
        <div className="lr-more" hidden={all || picked.length <= words.shown}>
          <button type="button" onClick={() => setAll(true)}>
            {words.showAll.before}
            {tiles.length}
            {words.showAll.after}
          </button>
        </div>
      </div>
    </section>
  );
}
