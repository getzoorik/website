import { products, type ProductId } from "@/content/products";

/**
 * The product a page with a [Coral | Amoeba] switch is on (`/assessment` and `/login`), from `?p=`: Coral by default.
 * Both pages are prerendered once and read the address in the browser.
 *
 * 🔴 ONLY THE TABLE'S OWN KEYS. The query string is the one thing on these pages a stranger can write, and it picks a
 * product. `in`, or a bare `table[value]`, would accept `?p=constructor` off the prototype. Matching is exact and
 * case-sensitive: `?p=Amoeba` is not Amoeba.
 */
export const isProduct = (value: string | null | undefined): value is ProductId =>
  typeof value === "string" && Object.prototype.hasOwnProperty.call(products, value);

/** The product the address asks for: `?p=amoeba`, else Coral. A repeated key counts by its first value. */
export const productFromQuery = (search: string): ProductId => {
  const p = new URLSearchParams(search).get("p");
  return isProduct(p) ? p : "coral";
};

/** The address for a product: `p` set, any other parameter kept, and `c` (the assessment's old cloud tabs) dropped. */
export function addressFor(
  product: ProductId,
  pathname: string,
  search: string,
  hash: string,
): string {
  const query = new URLSearchParams(search);
  query.set("p", product);
  query.delete("c");
  return `${pathname}?${query.toString()}${hash}`;
}

/**
 * Inline and first in the page, so it runs while the HTML parses: `html[data-ap]` is the product before the first
 * paint, and the sheet shows that product's parts with no flash. The layout's `<html>` carries
 * `suppressHydrationWarning` for it. With scripting off it is never set, and the sheet shows Coral.
 */
export const FIRST_PAINT_SCRIPT =
  '(function(){var p=new URLSearchParams(location.search).get("p");' +
  'document.documentElement.setAttribute("data-ap",p==="amoeba"?"amoeba":"coral")})();';
