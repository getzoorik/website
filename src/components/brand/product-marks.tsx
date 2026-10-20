import type { JSX } from "react";

import { KubernetesMark } from "@/components/brand/cloud-marks";
import type { ProductId } from "@/content/products";

/**
 * The two product marks, drawn wherever the page names a product: the nav, the
 * hero lockups, each home block's lockup, the login cards and the assessment's
 * first step.
 *
 * Like the cloud marks, each takes the class its surface gives it, because the
 * mock sizes one drawing many ways (`.nav-prod svg`, `.hp-mk`, `.lockup svg`,
 * `.as-mk`). Both are `aria-hidden`: the name is always set in text beside
 * them.
 */

export interface ProductMarkProps {
  readonly className?: string;
}

/**
 * Amoeba: the blue blob, with a white hub and a dark spindle.
 *
 * It replaces the orange and black disk platter everywhere that mark stood.
 */
export function AmoebaMark({ className }: ProductMarkProps): JSX.Element {
  return (
    <svg className={className} viewBox="8 7 87 87" aria-hidden="true">
      <path
        fill="#3B5BF5"
        d="M50.00 9.00C58.13 8.88 67.58 18.42 74.75 25.25C81.92 32.08 93.24 41.99 93.00 50.00C92.76 58.01 80.50 66.33 73.33 73.33C66.17 80.33 58.25 91.53 50.00 92.00C41.75 92.47 30.50 83.16 23.84 76.16C17.17 69.16 9.65 58.37 10.00 50.00C10.35 41.63 19.29 32.79 25.96 25.96C32.63 19.13 41.87 9.12 50.00 9.00Z"
      />
      <circle cx="50" cy="50" r="15" fill="#FFFFFF" />
      <circle cx="50" cy="50" r="6" fill="#0F1222" />
    </svg>
  );
}

/**
 * Coral.
 *
 * 🔴 A PLACEHOLDER, ON PURPOSE. Coral has no mark of its own yet, so the
 * Kubernetes helm stands in. It is a component of its own,
 * rather than `KubernetesMark` used directly, so that the day Coral gets its
 * mark there is one drawing to replace and every surface follows.
 */
export function CoralMark({ className }: ProductMarkProps): JSX.Element {
  return <KubernetesMark className={className} />;
}

/**
 * The marks, keyed by product. A Record rather than a switch, so a third
 * `ProductId` is a compile error here instead of a name set beside no mark.
 */
const marks: Record<ProductId, (props: ProductMarkProps) => JSX.Element> = {
  amoeba: AmoebaMark,
  coral: CoralMark,
};

export function ProductMark({
  product,
  className,
}: ProductMarkProps & { readonly product: ProductId }): JSX.Element {
  const Mark = marks[product];
  return <Mark className={className} />;
}
