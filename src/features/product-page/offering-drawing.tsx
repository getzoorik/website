import type { JSX } from "react";

import type { OfferingDrawing as OfferingDrawingKey } from "@/content/product-page";

/**
 * The offerings' drawings under What <product> does, one per row in its 88×52
 * slot, verbatim from the mock (`product_sections.py`, owner, 23 Oct 2026: "more
 * clear visuals and without any noise"). The home page's language: thin
 * strokes, squares, the accent, and no figures.
 *
 * Each is drawn in its "before" state; the row being read plays it to its
 * "after" in the tour's 4.8 s (product-tour.css, keyed on the row's
 * `aria-selected`), and under reduced motion every drawing holds its "after".
 * The classes are the mock's: the sheet draws them (`.mv-*`).
 *
 *   cost      Coral's Monitoring: the cost line drawn across, its last point lit;
 *   requests  Recommendations: requests over use, the recommended lines come down;
 *   fit       Workload optimization: a pod's request outline shrinks onto its use;
 *   drain     Node optimization: the last node's pod moves over, the node goes;
 *   disks     Amoeba's Monitoring: used space filling three disks;
 *   saving    Savings insights: the cost, and its unused tail turned saved;
 *   pool      Block storage optimization: a pool of four disks loses one.
 *
 * Decorative: the slot that holds it is `aria-hidden`, and the row's title and
 * line say what it shows.
 */
const DRAWINGS: Record<OfferingDrawingKey, JSX.Element> = {
  cost: (
    <>
      <line x1="4" y1="44.5" x2="84" y2="44.5" className="mv-base" />
      <polyline className="mv-line" points="4,36 14,31 24,34 34,25 44,28 54,19 64,23 74,14 84,17" />
      <rect className="mv-dot" x="80" y="13" width="7" height="7" rx="1.5" />
    </>
  ),
  requests: (
    <>
      <line x1="4" y1="44.5" x2="84" y2="44.5" className="mv-base" />
      <rect className="mv-req" x="12" y="8" width="24" height="36" />
      <rect className="mv-use" x="12" y="26" width="24" height="18" />
      <rect className="mv-req" x="52" y="14" width="24" height="30" />
      <rect className="mv-use" x="52" y="31" width="24" height="13" />
      <g className="mv-rec">
        <line x1="8" y1="8.5" x2="40" y2="8.5" className="mv-dash" />
        <line x1="48" y1="14.5" x2="80" y2="14.5" className="mv-dash" />
      </g>
    </>
  ),
  fit: (
    <>
      <line x1="4" y1="44.5" x2="84" y2="44.5" className="mv-base" />
      <rect className="mv-use" x="30" y="24" width="28" height="20" />
      <rect className="mv-pod-o" x="20.5" y="6.5" width="47" height="38" rx="1" />
    </>
  ),
  drain: (
    <>
      <line x1="4" y1="44.5" x2="84" y2="44.5" className="mv-base" />
      <rect className="mv-node" x="6" y="16" width="22" height="22" rx="2" />
      <rect className="mv-pod" x="10" y="20" width="6" height="6" rx="1" />
      <rect className="mv-pod" x="18" y="20" width="6" height="6" rx="1" />
      <rect className="mv-pod" x="10" y="28" width="6" height="6" rx="1" />
      <rect className="mv-node" x="33" y="16" width="22" height="22" rx="2" />
      <rect className="mv-pod" x="37" y="20" width="6" height="6" rx="1" />
      <g className="mv-gone">
        <rect className="mv-node" x="60" y="16" width="22" height="22" rx="2" />
      </g>
      <rect className="mv-pod mv-mover" x="64" y="20" width="6" height="6" rx="1" />
    </>
  ),
  disks: (
    <>
      <rect className="mv-disk" x="4.5" y="8.5" width="79" height="9" rx="1" />
      <rect className="mv-fill f1" x="5" y="9" width="40" height="8" />
      <rect className="mv-disk" x="4.5" y="21.5" width="79" height="9" rx="1" />
      <rect className="mv-fill f2" x="5" y="22" width="22" height="8" />
      <rect className="mv-disk" x="4.5" y="34.5" width="79" height="9" rx="1" />
      <rect className="mv-fill f3" x="5" y="35" width="56" height="8" />
    </>
  ),
  saving: (
    <>
      <line x1="4" y1="44.5" x2="84" y2="44.5" className="mv-base" />
      <rect className="mv-use" x="4" y="18" width="46" height="14" />
      <rect className="mv-req mv-tail" x="51" y="18" width="33" height="14" />
      <rect className="mv-ok mv-save" x="51" y="18" width="33" height="14" />
    </>
  ),
  pool: (
    <>
      <line x1="4" y1="44.5" x2="84" y2="44.5" className="mv-base" />
      <rect className="mv-fill" x="6" y="18" width="40" height="18" />
      <rect className="mv-disk" x="5.5" y="17.5" width="18" height="19" rx="1" />
      <rect className="mv-disk" x="25.5" y="17.5" width="18" height="19" rx="1" />
      <rect className="mv-disk" x="45.5" y="17.5" width="18" height="19" rx="1" />
      <g className="mv-gone">
        <rect className="mv-disk" x="65.5" y="17.5" width="18" height="19" rx="1" />
      </g>
    </>
  ),
};

export function OfferingDrawing({
  drawing,
}: {
  readonly drawing: OfferingDrawingKey;
}): JSX.Element {
  return (
    <svg className="mv-svg" viewBox="0 0 88 52" focusable="false">
      {DRAWINGS[drawing]}
    </svg>
  );
}
