import { NamedText } from "@/components/primitives/named-text";
import { documents, pdfToCome, type DocTileEntry, type TilePdf } from "@/content/documents";
import { documentFacts } from "@/features/documents/document-facts";
import { ArrowGlyph, DocGlyph, DownloadGlyph } from "@/features/documents/document-glyphs";

/**
 * The doc tile (`article.dt`, the site system's `.dt*` rules): one document as
 * the Docs hub and the "Read more" row list it, from one entry in
 * `src/content/documents.ts`, as the mock draws it, element for element.
 *
 * Three shapes, one look:
 *  - a page (`a.dt-a`): the document glyph, the title and its line, and a
 *    forward arrow;
 *  - a download (`a.dt-a[download]`, the row's one-pager): the same, its line the
 *    computed facts ("1 page · 83 KB") and its end mark the download glyph
 *    (`.dt-go.is-down`), which drops 2px on hover where the arrow moves right;
 *  - a head (`div.dt-h`, the hub's one-pager): no page to open, so no link and
 *    no end mark; the PDF row under it is the download.
 *
 * On the hub every tile has a PDF row (`.dt-pdf`) pinned to its foot: the PDF
 * link with its short facts, or "PDF to come" when there is no file yet.
 *
 * Every figure is read from the file at build (`documentFacts`); every glyph is
 * `aria-hidden`, and every download's accessible name carries the whole of its
 * facts: "Download the Coral FAQ, PDF, 5 pages, 0.1 MB, A4".
 */

/** The title and its line: what every shape says. */
function TileText({
  title,
  line,
  named,
}: {
  readonly title: string;
  readonly line: string;
  readonly named?: string | readonly string[];
}) {
  return (
    <span>
      <span className="dt-t">{title}</span>{" "}
      <span className="dt-l">{named ? <NamedText text={line} name={named} /> : line}</span>
    </span>
  );
}

/** The hub's PDF row under a tile. */
function TilePdfRow({ pdf }: { readonly pdf: TilePdf }): React.JSX.Element {
  if (!pdf.document) {
    return (
      <div className="dt-pdf">
        <span className="dt-none">{pdfToCome}</span>
      </div>
    );
  }
  const document = documents[pdf.document];
  const facts = documentFacts(pdf.document);
  return (
    <div className="dt-pdf">
      <a
        href={document.pdf}
        download
        aria-label={`Download ${document.spokenName}, ${facts.spoken}`}
      >
        <DownloadGlyph />
        <span>{pdf.label}</span>
        <small>{facts.short}</small>
      </a>
    </div>
  );
}

export interface DocTileProps {
  readonly entry: DocTileEntry;
  /**
   * On the hub: a PDF row under the tile, and a PDF-only document is a head.
   * Off (the Read more row): no PDF rows, and a PDF-only document is a download.
   */
  readonly withPdf: boolean;
}

export function DocTile({ entry, withPdf }: DocTileProps): React.JSX.Element {
  let head: React.JSX.Element;
  if (entry.href) {
    head = (
      <a className="dt-a" href={entry.href}>
        <DocGlyph className="dt-ic" />
        <TileText title={entry.title} line={entry.line} named={entry.named} />
        <ArrowGlyph className="dt-go" weight={2.2} />
      </a>
    );
  } else if (withPdf || !entry.pdf?.document) {
    head = (
      <div className="dt-h">
        <DocGlyph className="dt-ic" />
        <TileText title={entry.title} line={entry.line} />
      </div>
    );
  } else {
    const document = documents[entry.pdf.document];
    const facts = documentFacts(entry.pdf.document);
    head = (
      <a
        className="dt-a"
        href={document.pdf}
        download
        aria-label={`Download ${document.spokenName}, ${facts.spoken}`}
      >
        <DocGlyph className="dt-ic" />
        <TileText title={entry.title} line={facts.short} />
        <DownloadGlyph className="dt-go is-down" />
      </a>
    );
  }

  return (
    <article className="dt">
      {head}
      {withPdf && entry.pdf ? <TilePdfRow pdf={entry.pdf} /> : null}
    </article>
  );
}

/** A row of tiles: one column, three from 981px. */
export function DocTileGrid({
  tiles,
  withPdf,
}: {
  readonly tiles: readonly DocTileEntry[];
  readonly withPdf: boolean;
}): React.JSX.Element {
  return (
    <div className="dt-grid">
      {tiles.map((entry) => (
        <DocTile entry={entry} withPdf={withPdf} key={entry.title} />
      ))}
    </div>
  );
}
