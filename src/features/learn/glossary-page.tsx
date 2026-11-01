import { routes } from "@/config/site";
import { articleWords } from "@/content/learn/article";
import { glossaryPage } from "@/content/learn/glossary";
import { glossaryWords, type GlossaryTerm } from "@/content/learn/glossary-term";
import { isLiveHref } from "@/content/learn/published";
import { DocRows } from "@/features/doc-rows/doc-rows";
import { DocumentPage } from "@/features/documents/document-page";
import { LinkTile } from "@/features/documents/link-tile";
import { named } from "@/features/legal/named";
import { Block, RelatedRow, Sources, Text, type Setting } from "@/features/learn/article-page";
import { printedDay } from "@/lib/content-date";

/**
 * One glossary term, in a Learn article's design: the utility hero with the trail back to Learn and the glossary over
 * the h1 and no deck, the article frame, then the Related terms and the closing row for the term's product.
 *
 * The frame is the articles' (`DocRows`, `frame="article"`): each section's name in the left column beside its text,
 * the names as chips on a phone. Over the sections, the Updated line ("Updated 25 October 2026 · Published by
 * Zoorik") and the definition, where an article has its short answer, with the list, command or figure the draft
 * sets beside it; under them, the article to read next and the sources, each a new tab. The sections, the figure, the
 * sources and the Related row are drawn by the article's own parts (`Block`, `Sources`, `RelatedRow`), so a term
 * reads as an article does.
 *
 * No help box (the product sentence is in "Why it matters for your cloud cost"), no author and no cover. Related terms are
 * the article's Related tiles, each a term's words and the line the draft gives it. A link to an article or a term that
 * is not published stands as plain text (`isLiveHref`); Read next uses the draft's words, linked once its article is
 * published.
 *
 * The trail's links carry `gl-kl`, which names no rule but keeps them out of the site system's `.hero p a:not([class])`
 * and `main p a:not([class])`, so they keep the kicker's quiet colour (article.css).
 *
 * A server component: a term is prerendered whole. Its only scripts are the chips' and, where a term has a command,
 * its code well's (`ArticleWell`).
 */
export function GlossaryPage({ term }: { readonly term: GlossaryTerm }): React.JSX.Element {
  const set: Setting = { slug: term.slug, breaks: false };
  const next = isLiveHref(term.next.href) ? term.next.href : null;

  return (
    <DocumentPage
      hero={{
        title: named(term.h1),
        kicker: (
          <>
            <a className="gl-kl" href={routes.learn}>
              {glossaryPage.hero.kicker}
            </a>
            <span aria-hidden="true"> / </span>
            <a className="gl-kl" href={routes.learnGlossary}>
              {glossaryPage.crumb}
            </a>
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
              {articleWords.by}
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
              {next ? <a href={next}>{named(term.next.title)}</a> : named(term.next.title)}
            </p>
            {term.sources.length > 0 ? <Sources sources={term.sources} /> : null}
          </>
        }
      />

      <RelatedRow title={glossaryWords.related}>
        {term.related.map((tile) => (
          <LinkTile
            key={tile.title}
            href={isLiveHref(tile.href) ? tile.href : null}
            title={named(tile.title)}
            line={named(tile.line)}
          />
        ))}
      </RelatedRow>
    </DocumentPage>
  );
}
