import type { ProductId } from "@/content/products";

/**
 * The first painted frame, before React hydrates.
 *
 * The route is prerendered once, on Coral. `?p=amoeba` is read in the browser, so on a slow device there is a stretch
 * between the first paint and hydration in which the HTML still says Coral. To close it without reading the address
 * on the server:
 *
 *   1. `FIRST_PAINT_SCRIPT`, inline and first in the page, sets `html[data-ap]` (the product), with the same exact
 *      match as the provider. The layout's `<html>` carries `suppressHydrationWarning` for it.
 *   2. Until hydration, each line that depends on the product is rendered once per product, every copy tagged
 *      `data-if-p`, and the sheet hides the copy the attribute rules out (assessment.css, "first paint"). The switch
 *      follows the same attribute through `[data-boot]` on its `nav`.
 *   3. The render after hydration reads the address itself and draws one copy of each line, in the same commit:
 *      nothing visibly changes.
 *   4. From then on `html[data-ap]` follows the page's product (`AssessmentProvider`), so the header can mark the
 *      product's row in its Assessment menu.
 *
 * With scripting off, the attribute is never set and the sheet shows Coral: a complete page.
 */
export { FIRST_PAINT_SCRIPT } from "@/lib/product-choice";

export const PRODUCTS: readonly ProductId[] = ["coral", "amoeba"];

/** `data-boot` while the first-paint attribute still decides; nothing after. */
export const bootAttr = (arrived: boolean): { "data-boot"?: "" } =>
  arrived ? {} : { "data-boot": "" };
