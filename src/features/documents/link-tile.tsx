import type { ReactNode } from "react";

import { ArrowGlyph, DocGlyph } from "@/features/documents/document-glyphs";

/**
 * A doc tile that is one link to a page (`article.dt > a.dt-a`, the site
 * system's `.dt*` rules): an icon,
 * a title and the line under it, and the forward arrow. /about draws two, one
 * per product with the product's mark; an article's Related row draws three
 * with the document glyph, each line saying where the page lives ("Coral FAQ",
 * "Learn").
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
  /** The tile's icon, classed `dt-ic`; the document glyph when none is given. */
  readonly icon?: ReactNode;
}

export function LinkTile({ href, title, line, icon }: LinkTileProps): React.JSX.Element {
  const inside = (
    <>
      {icon ?? <DocGlyph className="dt-ic" />}
      <span>
        <span className="dt-t">{title}</span>
        <span className="dt-l">{line}</span>
      </span>
    </>
  );
  return (
    <article className="dt">
      {href === null ? (
        <div className="dt-a">{inside}</div>
      ) : (
        <a className="dt-a" href={href}>
          {inside}
          <ArrowGlyph className="dt-go" weight={2.2} />
        </a>
      )}
    </article>
  );
}
