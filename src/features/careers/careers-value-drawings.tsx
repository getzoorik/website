import type { CSSProperties, ReactNode } from "react";

import type { CareerValueId } from "@/content/careers";

/**
 * Our values' six drawings, one per value, as `motion_parts.py` draws them
 * (the option A proposal of 24 Oct 2026): thin strokes in the site's tokens,
 * square shapes and no figures, each on one 200×110 canvas.
 *
 * Pure structure: every tint, stroke and motion lives in careers-values.css
 * (the `il-` rules). Each plays a 6s loop while its value is open and the
 * picker is on screen; under reduced motion, or without scripting, each holds
 * its end state.
 *
 * Each SVG is hidden from a screen reader, as the mock's: the panel says the
 * value in words beside it.
 */

const VIEW_BOX = "0 0 200 110";

/** A line's place in its drawing's sequence (the sheet's `--k`). */
const k = (n: number): CSSProperties => ({ "--k": n }) as CSSProperties;

/** Where each of the page's five lines ends: the open page of Transparency. */
const PAGE_LINE_ENDS = [124, 118, 126, 110, 120] as const;

const SHAPES: Record<CareerValueId, ReactNode> = {
  /* Collaboration: two halves of one page slide together, and it is done. */
  collaboration: (
    <>
      <g className="c-l">
        <rect x="44" y="12" width="56" height="74" rx="2" />
        <path d="M54 30H90M54 42H84M54 54H90M54 66H78" />
      </g>
      <g className="c-r">
        <rect x="100" y="12" width="56" height="74" rx="2" />
        <path d="M110 30H146M110 42H140M110 54H146M110 66H128" />
      </g>
      <g className="ok">
        <circle cx="100" cy="95" r="9" />
        <path d="M95.5 94.5l3 3 6-6" />
      </g>
    </>
  ),
  /* Results for customers: the bill comes down while the server keeps serving. */
  results: (
    <>
      <path className="base" d="M28 92H172" />
      <rect className="r-bar" x="54" y="20" width="36" height="72" rx="1" />
      <path className="r-arr" d="M110 36v30m-8-8l8 8 8-8" />
      <g className="srv">
        <rect x="128" y="40" width="36" height="44" rx="2" />
        <path d="M136 53h20M136 63h20" />
        <circle className="live" cx="157" cy="75" r="3" />
      </g>
    </>
  ),
  /* Efficiency: three steps become one, done once. */
  efficiency: (
    <>
      <rect className="e-b e1" x="30" y="36" width="36" height="36" rx="2" />
      <rect className="e-b e2" x="82" y="36" width="36" height="36" rx="2" />
      <rect className="e-b e3" x="134" y="36" width="36" height="36" rx="2" />
      <path className="e-ok" pathLength={1} d="M91 54l6 6 12-12" />
    </>
  ),
  /* Diversity, inclusion and belonging: four different shapes find their place in one team. */
  diversity: (
    <>
      <rect className="d-team" pathLength={1} x="30" y="28" width="140" height="54" rx="2" />
      <circle className="d-s d1" cx="54" cy="55" r="12" />
      <rect className="d-s d2" x="78" y="43" width="24" height="24" rx="1" />
      <path className="d-s d3" d="M122 43l13 24h-26z" />
      <path className="d-s d4" d="M157 42l12 13-12 13-12-13z" />
    </>
  ),
  /* Iteration: a dot climbs small, safe steps. */
  iteration: (
    <>
      <path className="i-st" d="M24 94H56V78H88V62H120V46H152V30H176" />
      <path className="i-top t1" d="M24 94H56" />
      <path className="i-top t2" d="M56 78H88" />
      <path className="i-top t3" d="M88 62H120" />
      <path className="i-top t4" d="M120 46H152" />
      <path className="i-top t5" d="M152 30H176" />
      <circle className="i-dot" cx="40" cy="86" r="6" />
    </>
  ),
  /* Transparency: the page opens up, line by line. */
  transparency: (
    <>
      <rect className="t-doc" x="62" y="8" width="76" height="94" rx="2" />
      {PAGE_LINE_ENDS.map((end, n) => (
        <path className="t-ln" style={k(n)} d={`M74 ${26 + n * 14}H${end}`} key={end} />
      ))}
      <rect className="t-scan" x="58" y="8" width="84" height="12" />
    </>
  ),
};

/** The drawing of one value. */
export function ValueDrawing({ id }: { readonly id: CareerValueId }): React.JSX.Element {
  return (
    <svg className={`il il-${id}`} viewBox={VIEW_BOX} aria-hidden="true" focusable="false">
      {SHAPES[id]}
    </svg>
  );
}
