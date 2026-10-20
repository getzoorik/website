import { elasticContent } from "@/content/elastic";
import { ProductCopy } from "@/features/products/product-copy";
import { ProductFilm } from "@/features/products/product-film";

/**
 * Product 02 — Amoeba: block storage, and its film.
 *
 * A server component, and the Coral block mirrored: the layout is
 * `.st-grid.mo-grid.flip`, so the film takes the left column, on the page's
 * left edge, while the copy reads on the right; stacked, the sheet moves the
 * film after the copy, so on a phone both blocks read copy, then film.
 *
 * ─── THE CAPTION SAYS WHAT THE FIGURES ARE ─────────────────────────────────
 * "Product preview with example figures." under the screen, as under Coral's.
 * `/amoeba` prints its own line, "Example at Azure list price.", under its How
 * it works cards.
 *
 * `#amoeba` is the address links from outside arrive on; the empty element above
 * it keeps the section's old id, `#elastic`, landing here. See the note in
 * `kubernetes-section.tsx`.
 */
export function ElasticSection(): React.JSX.Element {
  return (
    <>
      <div className="alias" id="elastic" aria-hidden="true" />
      <section className="sec" id="amoeba">
        <div className="wrap">
          <div className="st-grid mo-grid flip">
            <ProductFilm product="amoeba" />
            <ProductCopy content={elasticContent} />
          </div>
        </div>
      </section>
    </>
  );
}
