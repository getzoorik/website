import { Arrow } from "@/components/primitives/arrow";
import { NamedText } from "@/components/primitives/named-text";
import { documents } from "@/content/documents";
import { productOrder, products } from "@/content/products";
import type { ProductPageContent, ReadMoreTile } from "@/content/product-page";
import { documentFacts } from "@/features/documents/document-facts";
import { ArrowGlyph, DocGlyph, DownloadGlyph } from "@/features/documents/document-glyphs";
import { formatSize, pageCount } from "@/lib/pdf-facts";

/**
 * Read more (`#read-coral`, `#read-amoeba`): the product's documents as doc
 * tiles, after How it works and before the closing row.
 *
 * A heading row (the product's docs and guides, "Coral docs and guides", and "All
 * docs" into this product's group on the hub), then six tiles, two by two from 981px (`.dt-2x2`): the guide and the
 * FAQ are pages and end on an arrow; the one-pager is a download and ends on
 * the download glyph; the fourth is the product's /learn article, and the last
 * two are its clouds' pages (owner, 1 Nov 2026). A product's
 * name in a title is kept out of translation. Nothing here rises: the row is
 * reference, not a reveal.
 * ─── THE ONE-PAGER'S LINE IS MEASURED, NEVER TYPED ─────────────────────────
 * "1 page · 83 KB" and the tile's name, "Download the Coral one-pager, PDF,
 * 1 page, 83 KB, A4", are read at build from the file the site serves
 * (`documentFacts`), the same facts the Docs hub prints, so the two can never
 * disagree. 🔴 The mocks' "77 KB" and "85 KB" are literals typed from older
 * files: copying them would print a size no file has.
 *
 * Only what is published is drawn: a product with no tile gets no row at all
 * (see `amoeba-page.ts`).
 *
 * The per-cloud pages (`/aks-cost-optimization`, `/ebs-cost-optimization`…) draw the same row
 * from their own tiles, so it takes only the product and the row. A product's
 * name in a page tile's line is kept out of translation too ("The volume type
 * Amoeba’s pool uses on AWS").
 */

/** Every name a tile's title can carry. */
const NAMES = productOrder.map((id) => products[id].name);

/** Inside each figure, so "1 page" and "83 KB" never break across a line. */
const NBSP = " ";

function Tile({ tile }: { readonly tile: ReadMoreTile }): React.JSX.Element {
  if (tile.kind === "page") {
    return (
      <article className="dt">
        <a className="dt-a" href={tile.href}>
          <DocGlyph className="dt-ic" />
          <span>
            <span className="dt-t">
              <NamedText text={tile.title} name={NAMES} />
            </span>{" "}
            <span className="dt-l">
              <NamedText text={tile.line} name={NAMES} />
            </span>
          </span>
          <ArrowGlyph className="dt-go" weight={2.2} />
        </a>
      </article>
    );
  }

  const file = documents[tile.document];
  const facts = documentFacts(tile.document);
  return (
    <article className="dt">
      {/* Same tab: `download` saves the file and leaves the reader on the page. */}
      <a
        className="dt-a"
        href={file.pdf}
        download
        aria-label={`Download ${file.spokenName}, ${facts.spoken}`}
      >
        <DocGlyph className="dt-ic" />
        <span>
          <span className="dt-t">{tile.title}</span>{" "}
          <span className="dt-l">
            {pageCount(facts.pages, NBSP)} · {formatSize(facts.bytes, NBSP)}
          </span>
        </span>
        <DownloadGlyph className="dt-go is-down" />
      </a>
    </article>
  );
}

export function ReadMore({
  content,
}: {
  content: Pick<ProductPageContent, "product" | "readMore">;
}): React.JSX.Element | null {
  const { readMore, product } = content;
  if (readMore.tiles.length === 0) return null;
  const headingId = `read-${product}-h`;

  return (
    <section className="sec" id={`read-${product}`} aria-labelledby={headingId}>
      <div className="wrap">
        <div className="sec-hrow">
          <h2 id={headingId}>
            <NamedText text={readMore.title} name={NAMES} />
          </h2>
          <a className="alink" href={readMore.allDocs.href}>
            {readMore.allDocs.label}
            <Arrow />
          </a>
        </div>
        <div className="dt-grid dt-2x2">
          {readMore.tiles.map((tile) => (
            <Tile tile={tile} key={tile.title} />
          ))}
        </div>
      </div>
    </section>
  );
}
