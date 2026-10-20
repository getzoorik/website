"use client";

import type { ReactNode } from "react";

import type { ProductId } from "@/content/products";
import { useAssessment } from "@/features/assessment/assessment-provider";
import { PRODUCTS } from "@/features/assessment/first-paint";

/**
 * Something that follows the product: a line, a link, a button.
 *
 * Once the page has arrived it is just the one for the current product. Before that (the server's HTML and the
 * render that hydrates it) it is one copy per product, each wrapped in a `span` tagged for the first-paint attribute
 * to pick from (`first-paint.ts`).
 */
export function ByChoice({
  render,
}: {
  readonly render: (product: ProductId) => ReactNode;
}): React.JSX.Element {
  const { product, arrived } = useAssessment();
  if (arrived) return <>{render(product)}</>;
  return (
    <>
      {PRODUCTS.map((item) => (
        <span key={item} data-if-p={item}>
          {render(item)}
        </span>
      ))}
    </>
  );
}
