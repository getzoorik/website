import { KeyFigure } from "@/components/primitives/key-figure";
import { NamedText } from "@/components/primitives/named-text";
import type { ProductId } from "@/content/products";
import { productOrder, products } from "@/content/products";
import { savingsQualifier, togetherLabel } from "@/content/savings";

/** The names the together label carries, each kept out of translation. */
const NAMES = productOrder.map((id) => products[id].name);

/**
 * The range card on the hero's right: the product's savings range, both
 * products' together, then the qualifier.
 *
 * Glass over the hero's photograph (`.pf-hero-figs`). It does not rise: the
 * hero is in view from the first frame, as its words are. No link in it: the
 * hero's "Estimate your saving" sits beside it.
 */
export function ProductRange({ product }: { readonly product: ProductId }): React.JSX.Element {
  return (
    <div className="pp-figs pf-hero-figs">
      <div className="pp-fig">
        <p className="pp-fig-l">
          <span translate="no">{products[product].name}</span>
        </p>
        <KeyFigure figure={product} />
      </div>
      <div className="pp-fig">
        <p className="pp-fig-l">
          <NamedText text={togetherLabel} name={NAMES} />
        </p>
        <KeyFigure figure="both" />
      </div>
      <p className="pp-figs-q">{savingsQualifier}</p>
    </div>
  );
}
