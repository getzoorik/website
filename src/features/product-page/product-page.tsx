import { SiteNav } from "@/components/layout/site-nav";
import { Reveal } from "@/components/primitives/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import type { ProductPageContent } from "@/content/product-page";
import { products } from "@/content/products";
import { AssessSection } from "@/features/assess/assess-section";
import { FooterSection } from "@/features/footer/footer-section";
import { StepCard } from "@/features/how-it-works/how-it-works-section";
import { NamedText } from "@/components/primitives/named-text";
import { site } from "@/config/site";
import { FilmBand } from "@/features/product-page/film-band";
import { ProductAbout } from "@/features/product-page/product-about";
import { productPageStructuredData } from "@/features/product-page/product-page-meta";
import { ProductHero } from "@/features/product-page/product-hero";
import { InstallYourWay } from "@/features/product-page/install-your-way";
import { ReadMore } from "@/features/product-page/read-more";

/**
 * A product page: `/coral` and `/amoeba` are this template with two contents.
 *
 * ─── THE ORDER ─────────────────────────────────────────────────────────────
 * Hero (one screen over the data grid film, so the bar reads bone over it, as
 * on home) → What is <product>?, beside What <product> does → the film band,
 * once the film is on YouTube → How it works, the page's one band → Install
 * your way (Coral) → Read more → the closing row. Two white sections in a row
 * share one gap: the site system's `.sec + .sec` rule takes the top padding off
 * the second, so they sit one rhythm apart, not two.
 *
 * ─── REUSED, NOT COPIED ────────────────────────────────────────────────────
 * The bar, the hero's film, the step cards, the doc tile's glyphs, the closing
 * row and the footer are the site's own components. Only the layout around
 * them, the hero's words, the offering rows and their drawings, the film band
 * and the install cards are this page's. Where the 23 Oct pass restyles a
 * shared part on these pages alone (the cards without outlines, the closing
 * row's navy card), product-tour.css scopes it to the page's hero.
 *
 * ─── STATIC ────────────────────────────────────────────────────────────────
 * A server component with no request data, so each page is prerendered at
 * build. The few islands (the bar, the reveals, the rows taking turns) hydrate
 * on top.
 */

/** How it works (`#how`, the band): the h2, this product's three cards, then the
 *  line that says what their figures are (`.how-ex`). */
function ProductHow({ content }: { content: ProductPageContent }): React.JSX.Element {
  return (
    <section className="sec sec-band" id="how">
      <div className="wrap">
        <Reveal className="sec-head">
          <h2>
            <NamedText text={content.how.title} name={products[content.product].name} />
          </h2>
        </Reveal>
        <div className="steps">
          {content.how.steps.map((step, index) => (
            <StepCard step={step} order={index} key={step.ordinal} />
          ))}
        </div>
        <p className="how-ex">
          <NamedText text={content.how.example} name={site.name} />
        </p>
      </div>
    </section>
  );
}

export function ProductPage({ content }: { content: ProductPageContent }): React.JSX.Element {
  return (
    <>
      <JsonLd data={productPageStructuredData(content)} />
      <a className="skip" href="#main">
        Skip to content
      </a>
      <SiteNav />
      <main id="main" tabIndex={-1}>
        <ProductHero content={content} />
        <ProductAbout content={content} />
        <FilmBand product={content.product} film={content.film} />
        <ProductHow content={content} />
        {/* Coral's install channels; Amoeba is neither open source nor on Helm. */}
        {content.product === "coral" ? <InstallYourWay /> : null}
        <ReadMore content={content} />
        <AssessSection product={content.product} />
      </main>
      <FooterSection />
    </>
  );
}
