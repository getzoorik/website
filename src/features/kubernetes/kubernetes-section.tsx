import { kubernetesContent } from "@/content/kubernetes";
import { ProductCopy } from "@/features/products/product-copy";
import { ProductFilm } from "@/features/products/product-film";

/**
 * Product 01 — Coral: Kubernetes, and its film.
 *
 * A server component. The copy is `ProductCopy` and the screen beside it is
 * `ProductFilm`, both shared with the Amoeba block; this file owns only what is
 * Coral's — the order of the two columns and the id.
 *
 * ─── THE GRID IS TWO DIRECT CHILDREN, IN THIS ORDER ────────────────────────
 * `.st-grid.mo-grid` expects copy, then the film, in the film's wider grid
 * (home-films.css). The Amoeba block below mirrors it with `.flip`, and the order
 * there is reversed in its markup, not here.
 *
 * ─── `#coral` IS A CONTRACT, AND `#kubernetes` STILL LANDS ─────────────────
 * Links from outside arrive on `#coral`, so the id is fixed markup rather than
 * content. The empty element above the section carries the section's old id,
 * with the same scroll margin (`.alias` in nav.css), so an old link scrolls to
 * the right place even with scripting off. It is `aria-hidden` because it says
 * nothing; `InPageLinks` moves focus to the section itself.
 */
export function KubernetesSection(): React.JSX.Element {
  return (
    <>
      <div className="alias" id="kubernetes" aria-hidden="true" />
      <section className="sec" id="coral">
        <div className="wrap">
          <div className="st-grid mo-grid">
            <ProductCopy content={kubernetesContent} />
            <ProductFilm product="coral" />
          </div>
        </div>
      </section>
    </>
  );
}
