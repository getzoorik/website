import type { ReactNode } from "react";

import { NewTabHint } from "@/components/primitives/new-tab-hint";
import { ArrowGlyph, ArrowOutGlyph, DocGlyph } from "@/features/documents/document-glyphs";
import { isOffSite, offSiteProps } from "@/lib/links";

/**
 * A doc tile that is one link to a page (`article.dt > a.dt-a`, the site
 * system's `.dt*` rules): an icon,
 * a title and the line under it, and the forward arrow. /about draws two, one
 * per product with the product's mark; an article's Related row draws three
 * with the document glyph, each line saying where the page lives ("Coral FAQ",
 * "Learn").
 *
 * A tile to another site (/community's communities, the research papers) opens it in a new tab, with
 * the arrow out and the hidden "(opens in a new tab)" after it. A research paper's tile has a second line under the
 * first: who wrote it and where, then our note (`more`).
 *
 * The documents' own tiles, with their PDFs and downloads, are `DocTile`; this
 * is the plain page link, whose title and line may name a product, so they are
 * nodes (`named()`) rather than strings.
 */
export interface LinkTileProps {
  /** Where it leads; null draws the same tile as words alone, with no link and no arrow. */
  readonly href: string | null;
  readonly title: ReactNode;
  readonly line: ReactNode;
  /** A second line under it, in its own `dt-l` (a research paper's note). */
  readonly more?: ReactNode;
  /** The tile's icon, classed `dt-ic`; the document glyph when none is given. */
  readonly icon?: ReactNode;
}

export function LinkTile({ href, title, line, more, icon }: LinkTileProps): React.JSX.Element {
  const inside = (
    <>
      {icon ?? <DocGlyph className="dt-ic" />}
      <span>
        <span className="dt-t">{title}</span>
        <span className="dt-l">{line}</span>
        {more ? <span className="dt-l">{more}</span> : null}
      </span>
    </>
  );
  return (
    <article className="dt">
      {href === null ? (
        <div className="dt-a">{inside}</div>
      ) : (
        <a className="dt-a" href={href} {...offSiteProps(href)}>
          {inside}
          {isOffSite(href) ? (
            <ArrowOutGlyph className="dt-go" />
          ) : (
            <ArrowGlyph className="dt-go" weight={2.2} />
          )}
          <NewTabHint href={href} />
        </a>
      )}
    </article>
  );
}
