import { Fragment, type ReactNode } from "react";

import { Arrow } from "@/components/primitives/arrow";
import { ExternalArrow } from "@/components/primitives/external-arrow";
import { NewTabHint } from "@/components/primitives/new-tab-hint";
import { routes } from "@/config/site";
import type { Author } from "@/content/authors";
import {
  articleWords,
  learnTopics,
  type Article,
  type ArticleBlock,
  type ArticleColumn,
  type ArticleItem,
  type ArticleSource,
  type ArticleText,
  type LearnFigure,
} from "@/content/learn/article";
import { learnPillars } from "@/content/learn";
import {
  articleAuthor,
  articleRoute,
  isLiveHref,
  learnArticles,
  titleLink,
} from "@/content/learn/published";
import { products } from "@/content/products";
import { DocRows } from "@/features/doc-rows/doc-rows";
import { DocumentPage } from "@/features/documents/document-page";
import { LinkTile } from "@/features/documents/link-tile";
import { codeBreaks } from "@/features/documents/prose";
import { named } from "@/features/legal/named";
import { ArticleFigure, ArticleStrip } from "@/features/learn/article-figures";
import { ArticleWell } from "@/features/learn/article-well";
import { printedDay } from "@/lib/content-date";
import { isOffSite, offSiteProps } from "@/lib/links";

/**
 * One Learn article: the utility hero, the article frame, then the Related row
 * and the closing row for the article's product.
 *
 * The frame is /security's (`DocRows`, `frame="article"`):
 * each section's name in the left column beside its text, the text open, the
 * names as chips on a phone, and no "On this page" list. Over the sections, the
 * byline ("Published 9 October 2026 · Published by Zoorik", with the author
 * between the two where the article has one), the short answer and the strip
 * where there is one; under them, "How Coral helps" (or Amoeba) and the
 * sources, each a new tab.
 *
 * An essay has no short answer, help box or sources: its opening stands under
 * the byline (`lead`), and it carries pictures, a quote and lines in italics.
 * Each part is drawn only where an article has it.
 *
 * A guide's sections hold paragraphs, parts (h3), lists (a numbered one may
 * start past 1, and an item may hold a paragraph or a code well), tables, code
 * wells (`ArticleWell`, the only other script) and its own diagrams, each drawn
 * from its module as its figure file draws it. The cloud cost pillar's last
 * section lists every other article under its topic, read from the index.
 *
 * A link to another article is drawn only once that article is published: until
 * then its words stand as plain text (`isLiveHref`), and a Related tile shows its
 * own words with no link (`titleLink`).
 *
 * A server component: an article is prerendered whole. Its only script is the
 * chips' (which section is being read, on a phone).
 */

/** How an article's text is set: its slug (for what it lists), and whether its inline code takes the guides' breaks. */
interface Setting {
  readonly slug: string;
  readonly breaks: boolean;
}

/**
 * Inline code: as written, breaking wherever it must (the sheet's `overflow-wrap:anywhere`), or, for an article set
 * with `breakCode`, only after a dot or a slash and never inside a short hyphenated name.
 */
function Code({ code, breaks }: { readonly code: string; readonly breaks: boolean }) {
  return <code>{breaks ? codeBreaks(code) : code}</code>;
}

/** A link's words: plain, or one piece of inline code. */
function LinkWords({
  words,
  breaks,
}: {
  readonly words: string | { readonly code: string };
  readonly breaks: boolean;
}): ReactNode {
  return typeof words === "string" ? named(words) : <Code code={words.code} breaks={breaks} />;
}

/** A run of text: its product names kept out of translation, its links in the prose's own link style, a link to
 *  another site a new tab with its arrow. */
function Text({
  text,
  breaks,
}: {
  readonly text: ArticleText;
  readonly breaks: boolean;
}): ReactNode {
  if (typeof text === "string") return named(text);
  return text.map((piece, index) => {
    if (typeof piece === "string") return <Fragment key={index}>{named(piece)}</Fragment>;
    if ("b" in piece) return <b key={index}>{named(piece.b)}</b>;
    if ("a" in piece) {
      if (isOffSite(piece.href))
        return (
          <a href={piece.href} key={index} {...offSiteProps(piece.href)}>
            <LinkWords words={piece.a} breaks={breaks} />
            <ExternalArrow />
            <NewTabHint href={piece.href} />
          </a>
        );
      return isLiveHref(piece.href) ? (
        <a href={piece.href} key={index}>
          <LinkWords words={piece.a} breaks={breaks} />
        </a>
      ) : (
        <LinkWords words={piece.a} breaks={breaks} key={index} />
      );
    }
    return <Code code={piece.code} breaks={breaks} key={index} />;
  });
}

/** A run of text as plain words: a table cell's label on a phone. */
function plainText(text: ArticleText): string {
  if (typeof text === "string") return text;
  return text
    .map((piece) => {
      if (typeof piece === "string") return piece;
      if ("b" in piece) return piece.b;
      if ("code" in piece) return piece.code;
      return typeof piece.a === "string" ? piece.a : piece.a.code;
    })
    .join("");
}

/**
 * A table that stacks below 640px (the documents' table, `nw-tbl` as the new
 * pages mark theirs): each row a block, every cell but the first labelled with
 * its column. The table roles are in the markup, so it stays a table for a
 * screen reader at every width; each cell's text sits in one `<div>`, so a
 * product name in it does not take a grid cell of its own.
 */
function Table({
  columns,
  rows,
  breaks,
}: {
  readonly columns: readonly ArticleColumn[];
  readonly rows: readonly (readonly ArticleText[])[];
  readonly breaks: boolean;
}): React.JSX.Element {
  return (
    <table className="doc-tbl nw-tbl" role="table">
      <colgroup>
        {columns.map((column, index) => (
          <col key={index} style={{ width: column.width }} />
        ))}
      </colgroup>
      <thead role="rowgroup">
        <tr role="row">
          {columns.map((column, index) => (
            <th scope="col" role="columnheader" key={index}>
              <Text text={column.label} breaks={breaks} />
            </th>
          ))}
        </tr>
      </thead>
      <tbody role="rowgroup">
        {rows.map((cells, row) => (
          <tr role="row" key={row}>
            {cells.map((cell, index) => (
              <td
                role="cell"
                data-label={columns[index] ? plainText(columns[index].label) : undefined}
                key={index}
              >
                <div>
                  <Text text={cell} breaks={breaks} />
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Whether a list item is words alone, with nothing under them. */
const wordsOnly = (item: ArticleItem): item is ArticleText =>
  typeof item === "string" || Array.isArray(item);

/** A list item: its words, then any paragraphs or code wells under them, with no paragraph around the words. */
function Item({ item, set }: { readonly item: ArticleItem; readonly set: Setting }) {
  if (wordsOnly(item))
    return (
      <li>
        <Text text={item} breaks={set.breaks} />
      </li>
    );
  return (
    <li>
      <Text text={item.text} breaks={set.breaks} />
      {item.blocks.map((block, index) => (
        <Block block={block} set={set} key={index} />
      ))}
    </li>
  );
}

/** A diagram as its figure file draws it: its scoped style, then the figure. */
function Diagram({ figure }: { readonly figure: LearnFigure }): React.JSX.Element {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: figure.style }} />
      <figure
        className={figure.className}
        role="img"
        aria-label={figure.label}
        dangerouslySetInnerHTML={{ __html: figure.html }}
      />
    </>
  );
}

/** A heading's anchor: its words in lower case, joined by hyphens. */
const headingId = (heading: string): string =>
  (heading.toLowerCase().match(/[a-z0-9]+/g) ?? []).join("-");

const pillarSlugs = new Set(learnPillars.map((entry) => entry.pillar));

/**
 * Every published article but this one, under the heading of its topic, in the topics' order: a subject's pillar
 * first, then A–Z by h1. A heading with no article is left out.
 */
function EveryArticle({ slug }: { readonly slug: string }): React.JSX.Element {
  const listed = learnArticles.filter((article) => article.slug !== slug);
  return (
    <>
      {learnTopics.map((topic) => {
        const articles = listed
          .filter((article) => article.topic === topic)
          .sort(
            (a, b) =>
              Number(pillarSlugs.has(b.slug)) - Number(pillarSlugs.has(a.slug)) ||
              a.h1.localeCompare(b.h1, "en"),
          );
        if (articles.length === 0) return null;
        return (
          <Fragment key={topic}>
            <h3 id={headingId(topic)}>{topic}</h3>
            <ul>
              {articles.map((article) => (
                <li key={article.slug}>
                  <a href={articleRoute(article)}>{named(article.h1)}</a>
                </li>
              ))}
            </ul>
          </Fragment>
        );
      })}
    </>
  );
}

function Block({
  block,
  set,
}: {
  readonly block: ArticleBlock;
  readonly set: Setting;
}): React.JSX.Element {
  switch (block.kind) {
    case "p":
      return (
        <p>
          <Text text={block.text} breaks={set.breaks} />
        </p>
      );
    case "ul":
      return (
        <ul>
          {block.items.map((item, index) => (
            <Item item={item} set={set} key={index} />
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol start={block.start}>
          {block.items.map((item, index) => (
            <Item item={item} set={set} key={index} />
          ))}
        </ol>
      );
    case "code":
      return <ArticleWell lang={block.lang} code={block.code} />;
    case "diagram":
      return <Diagram figure={block.figure} />;
    case "every":
      return <EveryArticle slug={set.slug} />;
    case "steps":
      return (
        <ol className="doc-steps" role="list">
          {block.items.map((item, index) => (
            <li key={index}>
              <div>
                <p>
                  <Text text={item} breaks={set.breaks} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      );
    case "table":
      return <Table columns={block.columns} rows={block.rows} breaks={set.breaks} />;
    case "formula":
      return (
        <p className="ar-code">
          <code>{codeBreaks(block.code)}</code>
        </p>
      );
    case "h3":
      return <h3 id={block.id}>{named(block.title)}</h3>;
    case "figure":
      return <ArticleFigure figure={block.figure} />;
    case "image":
      return (
        <figure className="ar-img">
          {/* A plain <img>, as the hero's photograph: the files are the post's own, sized and
              encoded once in public/articles, and the sheet owns the box (`.ar-img img`). */}
          {/* eslint-disable-next-line @next/next/no-img-element -- see above */}
          <img
            src={block.src}
            srcSet={block.srcset}
            sizes={block.srcset ? "(max-width: 760px) 100vw, 720px" : undefined}
            alt={block.alt}
            width={block.width}
            height={block.height}
            loading="lazy"
            decoding="async"
          />
          <figcaption>{named(block.caption)}</figcaption>
        </figure>
      );
    case "quote":
      return (
        <blockquote className="doc-call ar-quote">
          <p>
            <Text text={block.text} breaks={set.breaks} />
          </p>
        </blockquote>
      );
    case "note":
      return (
        <p className="ar-note">
          <em>
            <Text text={block.text} breaks={set.breaks} />
          </em>
        </p>
      );
  }
}

/**
 * One source, a new tab. Its title's last word holds the arrow beside it at a
 * line end (`.nw-nb`); an address with no title may part anywhere.
 */
function Source({ source }: { readonly source: ArticleSource }): React.JSX.Element {
  const text = source.title ?? source.url.replace(/^https:\/\//, "").replace(/\/$/, "");
  const space = text.lastIndexOf(" ");
  return (
    <>
      {source.publisher ? `${source.publisher}, ` : null}
      <a href={source.url} {...offSiteProps(source.url)}>
        {space < 0 ? (
          <>
            {text}
            <ExternalArrow />
          </>
        ) : (
          <>
            {text.slice(0, space + 1)}
            <span className="nw-nb">
              {text.slice(space + 1)}
              <ExternalArrow />
            </span>
          </>
        )}
        <NewTabHint href={source.url} />
      </a>
      {source.note ? named(source.note) : null}
    </>
  );
}

/**
 * " · By <name>, <role>": the name a new tab to their LinkedIn profile where they have one, its last word holding the
 * arrow beside it at a line end (`.nw-nb`), as a source's title does.
 */
function Byline({ author }: { readonly author: Author }): React.JSX.Element {
  const space = author.name.lastIndexOf(" ");
  return (
    <>
      {articleWords.author}
      {author.linkedin ? (
        <a href={author.linkedin} {...offSiteProps(author.linkedin)}>
          {author.name.slice(0, space + 1)}
          <span className="nw-nb">
            {author.name.slice(space + 1)}
            <ExternalArrow />
          </span>
          <NewTabHint href={author.linkedin} />
        </a>
      ) : (
        author.name
      )}
      , {named(author.role)}
    </>
  );
}

export function ArticlePage({ article }: { readonly article: Article }): React.JSX.Element {
  const sources = article.sources ?? [];
  const author = articleAuthor(article);
  const set: Setting = { slug: article.slug, breaks: article.breakCode === true };
  /* The closing row leads to the help box's product, else the article's own; an article about both offers both. */
  const product =
    article.help?.product ?? (article.product === "both" ? undefined : article.product);

  return (
    <DocumentPage hero={{ title: named(article.h1), deck: named(article.deck) }} product={product}>
      <DocRows
        frame="article"
        top={
          <>
            <p className="doc-updated">
              {articleWords.published}
              {printedDay(article.published)}
              {author ? <Byline author={author} /> : null}
              {articleWords.by}
              <a href={routes.about}>{named("Zoorik")}</a>
            </p>
            {article.short ? (
              <p className="ar-short">
                <b>{articleWords.short}</b> <Text text={article.short} breaks={set.breaks} />
              </p>
            ) : null}
            {article.strip ? <ArticleStrip steps={article.strip} /> : null}
            {article.lead?.map((block, index) => (
              <Block block={block} set={set} key={index} />
            ))}
          </>
        }
        groups={article.sections.map((section) => ({
          id: section.id,
          title: named(section.title),
          chip: named(section.title),
          body: section.blocks.map((block, index) => <Block block={block} set={set} key={index} />),
        }))}
        foot={
          article.help || sources.length > 0 ? (
            <>
              {article.help ? (
                <aside className="doc-call doc-help">
                  <p className="doc-call-t">
                    {named(`How ${products[article.help.product].name} helps`)}
                  </p>
                  <p>
                    <Text text={article.help.text} breaks={set.breaks} />
                  </p>
                  <p className="doc-help-a">
                    {article.help.links.map((link) => (
                      <a className="alink" href={link.href} key={link.href}>
                        <span>{named(link.label)}</span>
                        <Arrow />
                      </a>
                    ))}
                  </p>
                </aside>
              ) : null}
              {sources.length > 0 ? (
                <p className="ar-src">
                  {articleWords.sources}
                  {sources.map((source, index) => (
                    <Fragment key={source.url}>
                      {index > 0 ? "; " : null}
                      <Source source={source} />
                    </Fragment>
                  ))}
                  .
                </p>
              ) : null}
            </>
          ) : undefined
        }
      />

      <section className="sec ar-rel" id="related" aria-labelledby="related-h">
        <div className="wrap">
          <h2 id="related-h">{articleWords.related}</h2>
          <div className="dt-grid">
            {article.related.map((tile) => {
              const link = titleLink({ text: tile.title, href: tile.href });
              return (
                <LinkTile
                  key={tile.href}
                  href={link.href}
                  title={named(link.text)}
                  line={named(tile.where)}
                />
              );
            })}
          </div>
        </div>
      </section>
    </DocumentPage>
  );
}
