import type { MouseEvent } from "react";

import { ProductMark } from "@/components/brand/product-marks";
import { products, type ProductId } from "@/content/products";

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
