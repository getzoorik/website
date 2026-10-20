import { ProductMark } from "@/components/brand/product-marks";
import { Arrow } from "@/components/primitives/arrow";
import { Chips } from "@/components/primitives/chips";
import { NamedText } from "@/components/primitives/named-text";
import { Reveal } from "@/components/primitives/reveal";
import { routes } from "@/config/site";
import type { ProductSectionContent } from "@/content/product-section";
import { products } from "@/content/products";

/**
 * The copy column of a home product block: the product's lockup, the headline,
 * one short deck, what it runs on, then the button and the link to the
 * product's page.
 *
 * Both blocks read this way, so it is one component and each product hands it
 * its own words. A server component: nothing here moves except the reveal, and
 * `Reveal` owns that (order 0, so no `data-i`, as the mock writes it).
 *
 * ─── THE LOCKUP IS ONE NAME, NOT TWO ───────────────────────────────────────
 * A 20px mark and the name in one `p`, `translate="no"` on the whole line: there
 * is nothing in it a translator should touch, and the mark is `aria-hidden`.
 *
 * ─── THE BUTTON STAYS ON THE SITE ──────────────────────────────────────────
 * "Estimate your saving" opens the assessment on this product, same tab, with
 * the plain arrow. Its arrow moves 2px on hover and 3px on keyboard focus (the
 * site system and motion.css). The link after it names what the page is about,
 * "Kubernetes cost optimization with Coral", rather than "Learn more", so the
 * two blocks' links differ by their own words; it ends on the same arrow at
 * 14px.
 */
export function ProductCopy({ content }: { content: ProductSectionContent }): React.JSX.Element {
  const product = products[content.product];

  return (
    <Reveal>
      <p className="lockup" translate="no">
        <ProductMark product={product.id} />
        {product.name}
      </p>
      <h2 className="st-h">{content.headline}</h2>
      <p className="st-body">{content.body}</p>
      <Chips
        id={`${product.id}-runs`}
        label={content.runsOn.label}
        items={content.runsOn.platforms}
      />
      <div className="btns">
        <a className="btn-ink" href={content.cta.href}>
          {content.cta.label} <Arrow />
        </a>
        <a className="alink" href={routes[product.id]}>
          <span>
            <NamedText text={content.more} name={product.name} />
          </span>
          <Arrow />
        </a>
      </div>
    </Reveal>
  );
}
