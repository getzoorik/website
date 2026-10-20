import type { MouseEvent } from "react";

import { ProductMark } from "@/components/brand/product-marks";
import { products, type ProductId } from "@/content/products";

/** Coral first, as every mock lists the two. */
const ORDER: readonly ProductId[] = ["coral", "amoeba"];

export interface ProductSwitchProps {
  /** The product this page is on: its item reads `aria-current="page"`. */
  readonly current: ProductId;
  /** The same page for each product: `/assessment?p=amoeba`. */
  readonly href: (product: ProductId) => string;
  /**
   * Switch in place instead of following the link (/assessment). Only an
   * unmodified click is taken: Meta, Ctrl and Shift open the link as usual, and
   * a middle click fires no `click` at all. The current item's click is taken
   * too, so the page never reloads.
   */
  readonly onSelect?: (product: ProductId) => void;
  /** Extra attributes for the `nav` (/assessment's first paint marks it `data-boot`). */
  readonly attrs?: object;
}

/**
 * The [Coral · Kubernetes | Amoeba · Block storage] switch in a utility hero: two real links to the same page for
 * each product, so it works without script and with a modified click. Each item is the product's mark, its name
 * (`translate="no"`) and what it works on, smaller. A `nav` labelled "Product". Its look is `.as-switch.ax-switch`
 * in documents.css; on a phone it is two equal halves with the category under the name.
 *
 * No hooks and no directive: on a server page it is plain links, and inside a client tree (/assessment) it takes
 * `onSelect`.
 */
export function ProductSwitch({
  current,
  href,
  onSelect,
  attrs,
}: ProductSwitchProps): React.JSX.Element {
  const take = onSelect
    ? (product: ProductId) => (event: MouseEvent<HTMLAnchorElement>) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey) return;
        event.preventDefault();
        onSelect(product);
      }
    : undefined;

  return (
    <nav className="as-switch ax-switch" aria-label="Product" {...attrs}>
      {ORDER.map((product) => (
        <SwitchItem
          key={product}
          product={product}
          href={href(product)}
          current={product === current}
          onClick={take?.(product)}
        />
      ))}
    </nav>
  );
}

/** One item: the mark, the name kept out of translation, and the category under it on a phone. The space between the
 *  two is not laid out (the item is a flex or grid box); it keeps the name read as "Coral Kubernetes". */
export function SwitchItem({
  product,
  href,
  current,
  onClick,
}: {
  readonly product: ProductId;
  readonly href: string;
  readonly current: boolean;
  readonly onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}): React.JSX.Element {
  return (
    <a href={href} aria-current={current ? "page" : undefined} onClick={onClick}>
      <ProductMark product={product} />
      <span translate="no">{products[product].name}</span> <small>{products[product].kind}</small>
    </a>
  );
}
