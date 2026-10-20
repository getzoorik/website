import { Fragment, type ReactNode } from "react";

import { Arrow } from "@/components/primitives/arrow";
import { ExternalArrow } from "@/components/primitives/external-arrow";
import { NewTabHint } from "@/components/primitives/new-tab-hint";
import {
  articleByline,
  articleWords,
  articles,
  type Article,
  type ArticleBlock,
  type ArticleColumn,
  type ArticleId,
  type ArticleSource,
  type ArticleText,
} from "@/content/learn-articles";
import { DocRows } from "@/features/doc-rows/doc-rows";
import { DocumentPage } from "@/features/documents/document-page";
import { LinkTile } from "@/features/documents/link-tile";
import { codeBreaks } from "@/features/documents/prose";
import { named } from "@/features/legal/named";
import { ArticleFigure, ArticleStrip } from "@/features/learn/article-figures";
import { offSiteProps } from "@/lib/links";

/**
 * One Learn article: the utility hero, the article frame, then the Related row
 * and the closing row for the article's product.
 *
 * The frame is /security's (`DocRows`, `frame="article"`):
 * each section's name in the left column beside its text, the text open, the
 * names as chips on a phone, and no "On this page" list. Over the sections, the
 * Updated line with "Published by Zoorik", the short answer and the strip (the
 * VPA article); under them, "How Coral helps" (or Amoeba) and the sources,
 * each a new tab.
 *
 * An essay (the fourth article) has no short answer, help box or
 * sources: its byline names its author too ("By Vineet, infrastructure
 * engineer", a new tab to their profile), its opening stands under the byline
 * (`lead`), and it carries pictures, a quote and lines in italics. Each part is
 * drawn only where an article has it, so the first three render as before.
 *
 * A server component: an article is prerendered whole. Its only script is the
 * chips' (which section is being read, on a phone).
 */

/** A run of text: its product names kept out of translation, its code broken where it may part,
 *  its links (to pages of this site) in the prose's own link style. */
function Text({ text }: { readonly text: ArticleText }): ReactNode {
  if (typeof text === "string") return named(text);
  return text.map((piece, index) => {
    if (typeof piece === "string") return <Fragment key={index}>{named(piece)}</Fragment>;
    if ("b" in piece) return <b key={index}>{named(piece.b)}</b>;
    if ("a" in piece)
      return (
        <a href={piece.href} key={index}>
          {named(piece.a)}
        </a>
      );
    return <code key={index}>{codeBreaks(piece.code)}</code>;
  });
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
}: {
  readonly columns: readonly ArticleColumn[];
  readonly rows: readonly (readonly string[])[];
}): React.JSX.Element {
  return (
    <table className="doc-tbl nw-tbl" role="table">
      <colgroup>
        {columns.map((column) => (
          <col key={column.label} style={{ width: column.width }} />
        ))}
      </colgroup>
      <thead role="rowgroup">
        <tr role="row">
          {columns.map((column) => (
            <th scope="col" role="columnheader" key={column.label}>
              {named(column.label)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody role="rowgroup">
        {rows.map((cells, row) => (
          <tr role="row" key={row}>
            {cells.map((cell, index) => (
              <td role="cell" data-label={columns[index]?.label} key={index}>
                <div>{named(cell)}</div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Block({ block }: { readonly block: ArticleBlock }): React.JSX.Element {
  switch (block.kind) {
    case "p":
      return (
        <p>
          <Text text={block.text} />
        </p>
      );
    case "ul":
      return (
        <ul>
          {block.items.map((item, index) => (
            <li key={index}>
              <Text text={item} />
            </li>
          ))}
        </ul>
      );
    case "steps":
      return (
        <ol className="doc-steps" role="list">
          {block.items.map((item, index) => (
            <li key={index}>
              <div>
                <p>
                  <Text text={item} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      );
    case "table":
      return <Table columns={block.columns} rows={block.rows} />;
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
            <Text text={block.text} />
          </p>
        </blockquote>
      );
    case "note":
      return (
        <p className="ar-note">
          <em>
            <Text text={block.text} />
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
    </>
  );
}

/** "By Vineet, infrastructure engineer": the name a new tab to their profile, the role in the line's own case. */
function Author({
  author,
}: {
  readonly author: NonNullable<Article["author"]>;
}): React.JSX.Element {
  return (
    <>
      {articleByline.author}
      <a href={author.url} {...offSiteProps(author.url)}>
        {author.name}
        <ExternalArrow />
        <NewTabHint href={author.url} />
      </a>
      {`, ${author.role.charAt(0).toLowerCase()}${author.role.slice(1)}`}
    </>
  );
}

export function ArticlePage({ id }: { readonly id: ArticleId }): React.JSX.Element {
  const article = articles[id];
  const sources = article.sources ?? [];

  return (
    <DocumentPage
      hero={{ title: named(article.hero.title), deck: named(article.hero.deck) }}
      product={article.product}
    >
      <DocRows
        frame="article"
        top={
          <>
            <p className="doc-updated">
              {article.updated}
              {article.author ? <Author author={article.author} /> : null}
              {articleByline.by}
              <a href={articleByline.publisher.href}>{articleByline.publisher.text}</a>
            </p>
            {article.short ? (
              <p className="ar-short">
                <b>{articleWords.short}</b> {named(article.short)}
              </p>
            ) : null}
            {article.strip ? <ArticleStrip steps={article.strip} /> : null}
            {article.lead?.map((block, index) => (
              <Block block={block} key={index} />
            ))}
          </>
        }
        groups={article.sections.map((section) => ({
          id: section.id,
          title: named(section.title),
          chip: named(section.title),
          body: section.blocks.map((block, index) => <Block block={block} key={index} />),
        }))}
        foot={
          article.help || sources.length > 0 ? (
            <>
              {article.help ? (
                <aside className="doc-call doc-help">
                  <p className="doc-call-t">{article.help.title}</p>
                  <p>{named(article.help.text)}</p>
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
            {article.related.map((tile) => (
              <LinkTile
                key={tile.href}
                href={tile.href}
                title={named(tile.title)}
                line={named(tile.where)}
              />
            ))}
          </div>
        </div>
      </section>
    </DocumentPage>
  );
}
