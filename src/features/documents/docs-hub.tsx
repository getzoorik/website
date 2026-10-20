import { ProductMark } from "@/components/brand/product-marks";
import { Arrow } from "@/components/primitives/arrow";
import { docsHub, type DocsHubGroup } from "@/content/documents";
import { products } from "@/content/products";
import { DocTileGrid } from "@/features/documents/doc-tile";

/**
 * `/docs`, the Docs hub's body: one `section#docs` holding a group per
 * product with a released document, Coral first, then one line to the articles
 * at `/learn` (`.res-more`).
 *
 * A group (`section.res-group#<product>`, labelled by its h2) opens on its head:
 * the product's mark, its name as the h2 (never translated), its one line, and
 * "Product page" at the right. Under it, the product's doc tiles, each with its
 * PDF row; from 981px the three tiles share two grid rows, so the PDF rows sit
 * on one line (the subgrid rules in documents.css).
 *
 * `#coral` and `#amoeba` are addresses: the header's Docs menu, the drawer and
 * a product page's "All docs" link to them, and the site's in-page script lands
 * a group under the bar and drops the hash. While Amoeba has nothing released
 * there is no `#amoeba`, and nothing links to it (`navMenus` in
 * `src/config/site.ts`).
 *
 * A server component with no script of its own: the facts are read from the
 * files when the page is prerendered.
 */

function HubGroup({ group }: { readonly group: DocsHubGroup }): React.JSX.Element {
  const headingId = `${group.product}-h`;
  return (
    <section className="res-group" id={group.product} aria-labelledby={headingId}>
      <div className="res-head">
        <ProductMark product={group.product} className="res-mk" />
        <h2 id={headingId} translate="no">
          {products[group.product].name}
        </h2>
        <p>{group.line}</p>
        <a className="alink" href={group.pageLink.href}>
          {group.pageLink.label}
          <Arrow />
        </a>
      </div>
      <DocTileGrid tiles={group.tiles} withPdf />
    </section>
  );
}

/** The code brackets the Docs menu's Open source row draws, in the accent, in the marks' slot. */
function CodeMark(): React.JSX.Element {
  return (
    <svg
      className="res-mk op-mk"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8.5 7.5 4 12l4.5 4.5M15.5 7.5 20 12l-4.5 4.5M13.4 5.5l-2.8 13" />
    </svg>
  );
}

/** The third group: what is open source, and how to contribute. No product, so no page link. */
function OpenSourceGroup(): React.JSX.Element {
  const group = docsHub.openSource;
  return (
    <section className="res-group" id={group.id} aria-labelledby={`${group.id}-h`}>
      <div className="res-head">
        <CodeMark />
        <h2 id={`${group.id}-h`}>{group.title}</h2>
        <p>{group.line}</p>
      </div>
      <DocTileGrid tiles={group.tiles} withPdf />
    </section>
  );
}

export function DocsHub(): React.JSX.Element {
  return (
    <section className="sec" id="docs">
      <div className="wrap">
        {docsHub.groups.map((group) => (
          <HubGroup group={group} key={group.product} />
        ))}
        <OpenSourceGroup />
        <p className="res-more">
          <a className="alink" href={docsHub.more.href}>
            {docsHub.more.label}
            <Arrow />
          </a>
        </p>
      </div>
    </section>
  );
}
