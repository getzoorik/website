import { Fragment, type ReactNode } from "react";

import { Arrow } from "@/components/primitives/arrow";
import { ExternalArrow } from "@/components/primitives/external-arrow";
import { NewTabHint } from "@/components/primitives/new-tab-hint";
import { isLiveHref } from "@/content/learn/published";
import type { ProseBlock, ProseTile } from "@/content/prose-blocks";
import { LinkTile } from "@/features/documents/link-tile";
import { DocTable } from "@/features/documents/prose";
import { richText } from "@/features/documents/rich-text";
import { named } from "@/features/legal/named";
import { isOffSite, offSiteProps } from "@/lib/links";

/**
 * The open prose of the 1 Nov 2026 pages (`prose-blocks.ts`), drawn in the Learn frame's column (`.doc-prose`) as the
 * mocks draw it: a paragraph, a bulleted or a numbered list, a heading, a docs table that stacks on a phone (`nw-tbl`),
 * and a box of links out of the site (the help box's `.doc-call.doc-help`). Then Read more, the doc tiles that close
 * the page before its closing row. Server components.
 *
 * A link to a Learn article or a glossary term that is not published yet is drawn as its words, so no page links a
 * 404; once the article is published, the same text links it.
 */

const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

/** A draft's line, each link to a Learn page that is not published yet left as its words. */
export const liveLinks = (text: string): string =>
  text.replace(LINK, (link, words: string, href: string) => (isLiveHref(href) ? link : words));

/** A line of prose: the draft's markup, its live links only. */
export const proseText = (text: string): ReactNode => richText(liveLinks(text));

function Block({ block }: { readonly block: ProseBlock }): React.JSX.Element {
  switch (block.kind) {
    case "p":
      return <p>{proseText(block.text)}</p>;
    case "ul":
      return (
        <ul>
          {block.items.map((item) => (
            <li key={item}>{proseText(item)}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol>
          {block.items.map((item) => (
            <li key={item}>{proseText(item)}</li>
          ))}
        </ol>
      );
    case "h3":
      return <h3 id={block.id}>{proseText(block.text)}</h3>;
    case "table":
      return (
        <DocTable
          className="nw-tbl"
          columns={block.head.map((label, index) => ({ label, width: block.widths[index] }))}
          rows={block.rows.map((cells) => cells.map((cell) => proseText(cell)))}
        />
      );
    case "links":
      return (
        <aside className="doc-call doc-help">
          <p className="doc-call-t">{richText(block.title)}</p>
          <p className="doc-help-a">
            {block.links.map((link, index) => (
              <Fragment key={link.href}>
                {index > 0 ? " " : null}
                <a className="alink" href={link.href} {...offSiteProps(link.href)}>
                  <span>{richText(link.label)}</span>
                  {isOffSite(link.href) ? <ExternalArrow /> : <Arrow />}
                  <NewTabHint href={link.href} />
                </a>
              </Fragment>
            ))}
          </p>
        </aside>
      );
  }
}

export function ProseBlocks({
  blocks,
}: {
  readonly blocks: readonly ProseBlock[];
}): React.JSX.Element {
  return (
    <>
      {blocks.map((block, index) => (
        <Block block={block} key={index} />
      ))}
    </>
  );
}

/**
 * Read more (`#read-more`): the heading row, then the doc tiles, each a title and one line. A tile whose page is not
 * published yet is its words with no link (`LinkTile` with no address).
 */
export function ReadMoreRow({
  title,
  tiles,
}: {
  readonly title: string;
  readonly tiles: readonly ProseTile[];
}): React.JSX.Element {
  return (
    <section className="sec" id="read-more" aria-labelledby="read-more-h">
      <div className="wrap">
        <div className="sec-hrow">
          <h2 id="read-more-h">{named(title)}</h2>
        </div>
        <div className="dt-grid">
          {tiles.map((tile) => (
            <LinkTile
              key={tile.href}
              href={isLiveHref(tile.href) ? tile.href : null}
              title={richText(tile.title)}
              line={richText(tile.line)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
