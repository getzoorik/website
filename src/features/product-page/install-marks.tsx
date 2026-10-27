import type { JSX } from "react";

import { MARK_CORE, MARK_INNER, MARK_OUTER } from "@/components/brand/mark-geometry";

/**
 * The marks of Install your way (owner, 23 Oct 2026: "Can't we use logos …"):
 * each card's channel beside its name, and Apple's beside macOS in zoorikctl's
 * switch (Tux and Windows there are the site's own, `cloud-marks.tsx`).
 *
 * Helm, Terraform and Apple are Simple Icons' single-colour marks
 * (simple-icons@16.35.0, CC0 for the SVG data), the paths inlined verbatim from
 * the proposal's `logos/*.svg`; the marks are their owners' trademarks (Helm:
 * CNCF; Terraform: HashiCorp; Apple: Apple Inc.), used only to name the install
 * channel and the system. Each paints in `currentColor`, and the sheet gives
 * Helm #0F1689 and Terraform #844FBA (product-tour.css).
 *
 * Decorative (`aria-hidden`): the name beside each carries it.
 */

type MarkProps = { readonly className: string };

export function HelmMark({ className }: MarkProps): JSX.Element {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12.337 0c-.475 0-.861 1.016-.861 2.269 0 .527.069 1.011.183 1.396a8.514 8.514 0 0 0-3.961 1.22 5.229 5.229 0 0 0-.595-1.093c-.606-.866-1.34-1.436-1.79-1.43a.381.381 0 0 0-.217.066c-.39.273-.123 1.326.596 2.353.267.381.559.705.84.948a8.683 8.683 0 0 0-1.528 1.716h1.734a7.179 7.179 0 0 1 5.381-2.421 7.18 7.18 0 0 1 5.382 2.42h1.733a8.687 8.687 0 0 0-1.32-1.53c.35-.249.735-.643 1.078-1.133.719-1.027.986-2.08.596-2.353a.382.382 0 0 0-.217-.065c-.45-.007-1.184.563-1.79 1.43a4.897 4.897 0 0 0-.676 1.325 8.52 8.52 0 0 0-3.899-1.42c.12-.39.193-.887.193-1.429 0-1.253-.386-2.269-.862-2.269zM1.624 9.443v5.162h1.358v-1.968h1.64v1.968h1.357V9.443H4.62v1.838H2.98V9.443zm5.912 0v5.162h3.21v-1.108H8.893v-.95h1.64v-1.142h-1.64v-.84h1.853V9.443zm4.698 0v5.162h3.218v-1.362h-1.86v-3.8zm4.706 0v5.162h1.364v-2.643l1.357 1.225 1.35-1.232v2.65h1.365V9.443h-.614l-2.1 1.914-2.109-1.914zm-11.82 7.28a8.688 8.688 0 0 0 1.412 1.548 5.206 5.206 0 0 0-.841.948c-.719 1.027-.985 2.08-.596 2.353.39.273 1.289-.338 2.007-1.364a5.23 5.23 0 0 0 .595-1.092 8.514 8.514 0 0 0 3.961 1.219 5.01 5.01 0 0 0-.183 1.396c0 1.253.386 2.269.861 2.269.476 0 .862-1.016.862-2.269 0-.542-.072-1.04-.193-1.43a8.52 8.52 0 0 0 3.9-1.42c.121.4.352.865.675 1.327.719 1.026 1.617 1.637 2.007 1.364.39-.273.123-1.326-.596-2.353-.343-.49-.727-.885-1.077-1.135a8.69 8.69 0 0 0 1.202-1.36h-1.771a7.174 7.174 0 0 1-5.227 2.252 7.174 7.174 0 0 1-5.226-2.252z" />
    </svg>
  );
}

export function TerraformMark({ className }: MarkProps): JSX.Element {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M1.44 0v7.575l6.561 3.79V3.787zm21.12 4.227l-6.561 3.791v7.574l6.56-3.787zM8.72 4.23v7.575l6.561 3.787V8.018zm0 8.405v7.575L15.28 24v-7.578z" />
    </svg>
  );
}

export function AppleMark({ className }: MarkProps): JSX.Element {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

/** The brand kit's navy, which the mock's `#zmark` symbol paints every part in. */
const KIT_NAVY = "#050B3D";

/**
 * zoorikctl's mark: the Zoorik mark, still, on the kit's whole 512 canvas as
 * the mock's `#zmark` symbol draws it (its squares a hair inside the 22px box).
 * Not `BrandMark`: that one's rings turn, and a card's mark does not.
 *
 * Each part paints the kit's navy itself, as the symbol's own `fill` does, so
 * the sheet's `color` (`.iw-logo.zk`, --brand) never reaches it: the mock's
 * card shows #050B3D, not --brand's #070F52 (measured on its pixels).
 */
export function ZoorikctlMark({ className }: MarkProps): JSX.Element {
  return (
    <svg className={className} viewBox="0 0 512 512" aria-hidden="true">
      {[...MARK_OUTER, ...MARK_INNER].map(([x, y, side, angle, cx, cy]) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width={side}
          height={side}
          fill={KIT_NAVY}
          transform={`rotate(${angle} ${cx} ${cy})`}
        />
      ))}
      <circle cx={MARK_CORE.cx} cy={MARK_CORE.cy} r={MARK_CORE.r} fill={KIT_NAVY} />
    </svg>
  );
}
