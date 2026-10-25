import { Fragment } from "react";

import { routes } from "@/config/site";
import { glossaryPage } from "@/content/learn/glossary";
import { glossaryWords, type GlossaryTerm } from "@/content/learn/glossary-term";
import { isLiveHref, titleLink } from "@/content/learn/published";
import { DocRows } from "@/features/doc-rows/doc-rows";
import { DocumentPage } from "@/features/documents/document-page";
import { LinkTile } from "@/features/documents/link-tile";
import { named } from "@/features/legal/named";
import { Block, Source, Text, type Setting } from "@/features/learn/article-page";
import { printedDay } from "@/lib/content-date";

/**
 * One glossary term, in a Learn article's design: the utility hero with the trail back to Learn and the glossary over
 * the h1 and no deck, the article frame, then the Related terms and the closing row for the term's product.
 *
 * The frame is the articles' (`DocRows`, `frame="article"`): each section's name in the left column beside its text,
 * the names as chips on a phone. Over the sections, the Updated line ("Updated 25 October 2026 · Published by
 * Zoorik") and the definition, where an article has its short answer, with the list, command or figure the draft
 * sets beside it; under them, the article to read next and the sources, each a new tab. The sections, the figure and
 * the sources are drawn by the article's own parts (`Block`, `Source`), so a term reads as an article does.
 *
 * No help box (the product sentence is in "Why it matters for your bill"), no author and no cover. Related terms are
 * the article's Related tiles, each a term's words and the line the draft gives it. A link to an article or a term that
 * is not published stands as plain text (`isLiveHref`); Read next names a published article by its h1 (`titleLink`).
 *
 * A server component: a term is prerendered whole. Its only script is the chips'.
 */
export function GlossaryPage({ term }: { readonly term: GlossaryTerm }): React.JSX.Element {
  const set: Setting = { slug: term.slug, breaks: false };
  const next = titleLink({ text: term.next.title, href: term.next.href });

  return (
    <DocumentPage
      hero={{
        title: named(term.h1),
        kicker: (
          <>
            <a href={routes.learn}>{glossaryPage.hero.kicker}</a>
            <span aria-hidden="true"> / </span>
            <a href={routes.learnGlossary}>{glossaryPage.crumb}</a>
          </>
        ),
        className: "gl-hero",
      }}
      product={term.product === "both" ? undefined : term.product}
    >
      <DocRows
        frame="article"
        top={
          <>
            <p className="doc-updated">
              {glossaryWords.updated}
              {printedDay(term.updated)}
              {glossaryWords.by}
              <a href={routes.about}>{named("Zoorik")}</a>
            </p>
            {term.definition.map((block, index) =>
              index === 0 && block.kind === "p" ? (
                <p className="ar-short" key={index}>
                  <Text text={block.text} breaks={set.breaks} />
                </p>
              ) : (
                <Block block={block} set={set} key={index} />
              ),
            )}
          </>
        }
        groups={term.sections.map((section) => ({
          id: section.id,
          title: named(section.title),
          chip: named(section.title),
          body: section.blocks.map((block, index) => <Block block={block} set={set} key={index} />),
        }))}
        foot={
          <>
            <p className="gl-next">
              <b>{glossaryWords.next}</b>{" "}
              {next.href ? <a href={next.href}>{named(next.text)}</a> : named(next.text)}
            </p>
            {term.sources.length > 0 ? (
              <p className="ar-src">
                {glossaryWords.sources}
                {term.sources.map((source, index) => (
                  <Fragment key={source.url}>
                    {index > 0 ? "; " : null}
                    <Source source={source} />
                  </Fragment>
                ))}
                .
              </p>
            ) : null}
          </>
        }
      />

      <section className="sec ar-rel" id="related" aria-labelledby="related-h">
        <div className="wrap">
          <h2 id="related-h">{glossaryWords.related}</h2>
          <div className="dt-grid">
            {term.related.map((tile) => (
              <LinkTile
                key={tile.href}
                href={isLiveHref(tile.href) ? tile.href : null}
                title={named(tile.title)}
                line={named(tile.line)}
              />
            ))}
          </div>
        </div>
      </section>
    </DocumentPage>
  );
}
