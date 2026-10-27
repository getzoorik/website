import { ProductMark } from "@/components/brand/product-marks";
import { byDesignDrawingWords as words, type ByDesignDrawing } from "@/content/by-design";
import { products, type ProductId } from "@/content/products";

/**
 * The four drawings, one per card, as `why_visuals.py` draws them: the site's
 * palette, thin strokes, square shapes and no figures, each on one 280×150
 * canvas.
 *
 * Pure structure: every tint, stroke and motion lives in home.css (the `wv-`
 * rules), so each drawing is right in its first painted frame. What moves is an
 * 8s loop (the traffic 2.4s), paused while the band is off screen
 * (`WhyMotion`); under reduced motion, or without scripting, each holds its
 * after state.
 *
 * Each SVG is hidden from a screen reader: the card's figure carries the
 * sentence it shows (`role="img"`, `aria-label`). The ids inside them (the
 * hatch, two clips) are this page's alone, and each drawing is drawn once.
 */

const VIEW_BOX = "0 0 280 150";

/** Reduce cloud cost: a usage curve under a dashed provisioned line; the line drops to just above the
 *  peak, and the hatched room between them goes. */
function UseDrawing(): React.JSX.Element {
  return (
    <svg className="wv-svg" viewBox={VIEW_BOX} aria-hidden="true" focusable="false">
      <defs>
        <pattern
          id="wv-hatch"
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <rect width="1.6" height="6" className="wv-hatch" />
        </pattern>
        <clipPath id="wv-clip1">
          <rect x="8" y="0" width="264" height="134" />
        </clipPath>
      </defs>
      <g clipPath="url(#wv-clip1)">
        <g className="wv-prov">
          <rect x="8" y="26" width="264" height="140" fill="url(#wv-hatch)" />
          <line x1="8" y1="26" x2="272" y2="26" className="wv-dash" />
          <text x="8" y="19" className="wv-t">
            {words.provisioned}
          </text>
        </g>
        <path
          className="wv-use"
          d="M8 134 L8 104 C40 96 60 70 92 74 C124 78 140 100 170 92 C200 84 214 58 240 62 C256 64 266 76 272 80 L272 134 Z"
        />
        <path
          className="wv-use-l"
          d="M8 104 C40 96 60 70 92 74 C124 78 140 100 170 92 C200 84 214 58 240 62 C256 64 266 76 272 80"
        />
      </g>
      <line x1="8" y1="134.5" x2="272" y2="134.5" className="wv-base" />
      <text x="14" y="126" className="wv-t wv-t-a">
        {words.used}
      </text>
    </svg>
  );
}

/** Where a node's pods sit, from its corner, in the order they fill it. */
const POD_SLOTS = [
  [10, 10],
  [30, 10],
  [10, 30],
  [30, 30],
] as const;

/** A node, a square of 52, with its first `pods` pods. */
function Node({ x, pods }: { readonly x: number; readonly pods: number }): React.JSX.Element {
  return (
    <>
      <rect x={x} y="46" width="52" height="52" rx="3" className="wv-node" />
      {POD_SLOTS.slice(0, pods).map(([dx, dy]) => (
        <rect
          key={`${dx}-${dy}`}
          x={x + dx}
          y={46 + dy}
          width="12"
          height="12"
          rx="2"
          className="wv-pod"
        />
      ))}
    </>
  );
}

/** Drains nodes safely, one at a time: four nodes of square pods. One is cordoned; its two pods move to
 *  the neighbour one at a time, then the empty node is removed. */
function DrainDrawing(): React.JSX.Element {
  return (
    <svg className="wv-svg" viewBox={VIEW_BOX} aria-hidden="true" focusable="false">
      <Node x={10} pods={3} />
      <Node x={78} pods={2} />
      <g className="wv-nodeC">
        <rect x="146" y="46" width="52" height="52" rx="3" className="wv-node" />
        <rect x="143.5" y="43.5" width="57" height="57" rx="3" className="wv-cord" />
      </g>
      <Node x={214} pods={3} />
      <rect x="156" y="56" width="12" height="12" rx="2" className="wv-pod wv-c1" />
      <rect x="176" y="56" width="12" height="12" rx="2" className="wv-pod wv-c2" />
      <line x1="8" y1="122.5" x2="272" y2="122.5" className="wv-base" />
    </svg>
  );
}

/** The traffic's ticks: forty, 8 apart, in a repeating run of six heights. */
const TICK_HEIGHTS = [10, 16, 12, 18, 9, 14] as const;
const TICKS = Array.from({ length: 40 }, (_, i) => ({
  x: 8 + i * 8,
  height: TICK_HEIGHTS[i % TICK_HEIGHTS.length]!,
}));

/** No code changes, no downtime: live traffic runs on without a break while the disk under it
 *  resizes to two thirds and back. */
function ResizeDrawing(): React.JSX.Element {
  return (
    <svg className="wv-svg" viewBox={VIEW_BOX} aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="wv-clip3">
          <rect x="8" y="0" width="264" height="60" />
        </clipPath>
      </defs>
      <rect x="8" y="10" width="7" height="7" rx="1.5" className="wv-live" />
      <text x="20" y="17" className="wv-t">
        {words.traffic}
      </text>
      <g clipPath="url(#wv-clip3)">
        <g className="wv-flow">
          {TICKS.map(({ x, height }) => (
            <rect key={x} x={x} y={52 - height} width="2" height={height} className="wv-tick" />
          ))}
        </g>
      </g>
      <line x1="8" y1="52.5" x2="272" y2="52.5" className="wv-base" />
      <text x="8" y="80" className="wv-t">
        {words.disk}
      </text>
      <rect x="8" y="88" width="150" height="30" className="wv-data" />
      <rect x="8.5" y="88.5" width="263" height="29" rx="1" className="wv-cap" />
    </svg>
  );
}

/** A product's mark at 14px, set where the drawing's `<use>` stood in the mock. */
function MarkAt({
  product,
  y,
}: {
  readonly product: ProductId;
  readonly y: number;
}): React.JSX.Element {
  return (
    <svg x="8" y={y} width="14" height="14">
      <ProductMark product={product} />
    </svg>
  );
}

/** HTML's `translate`, which a page translator honours on any element; React's SVG types leave it
 *  out, so it is spread. It keeps the products' names on the switches out of translation. */
const NO_TRANSLATE = { translate: "no" } as const;

/** A checked entry's tick, from its box's corner. */
const check = (y: number) => `M10.6 ${y} l2.6 2.6 l4.6 -5.2`;

/** Full control and visibility: a switch per product (Coral on; Amoeba switches on), then the change
 *  log fills with three checked entries, one at a time. */
function ControlDrawing(): React.JSX.Element {
  return (
    <svg className="wv-svg" viewBox={VIEW_BOX} aria-hidden="true" focusable="false">
      <MarkAt product="coral" y={12} />
      <text x="30" y="23" className="wv-t wv-t-d" {...NO_TRANSLATE}>
        {products.coral.name}
      </text>
      <rect x="242" y="12" width="30" height="14" rx="3" className="wv-track on" />
      <rect x="260" y="14" width="10" height="10" rx="2" className="wv-knob" />
      <MarkAt product="amoeba" y={40} />
      <text x="30" y="51" className="wv-t wv-t-d" {...NO_TRANSLATE}>
        {products.amoeba.name}
      </text>
      <rect x="242" y="40" width="30" height="14" rx="3" className="wv-track wv-sw" />
      <rect x="244" y="42" width="10" height="10" rx="2" className="wv-knob wv-swk" />
      <line x1="8" y1="70.5" x2="272" y2="70.5" className="wv-base" />
      <g className="wv-log wv-l1">
        <rect x="8" y="82" width="12" height="12" rx="2" className="wv-ok" />
        <path d={check(88.2)} className="wv-tickmark" />
        <rect x="28" y="85" width="150" height="6" rx="1" className="wv-row" />
      </g>
      <g className="wv-log wv-l2">
        <rect x="8" y="104" width="12" height="12" rx="2" className="wv-ok" />
        <path d={check(110.2)} className="wv-tickmark" />
        <rect x="28" y="107" width="196" height="6" rx="1" className="wv-row" />
      </g>
      <g className="wv-log wv-l3">
        <rect x="8" y="126" width="12" height="12" rx="2" className="wv-ok" />
        <path d={check(132.2)} className="wv-tickmark" />
        <rect x="28" y="129" width="118" height="6" rx="1" className="wv-row" />
      </g>
    </svg>
  );
}

const drawings: Record<ByDesignDrawing, () => React.JSX.Element> = {
  use: UseDrawing,
  drain: DrainDrawing,
  resize: ResizeDrawing,
  control: ControlDrawing,
};

/** A card's drawing, inside the figure that names it. */
export function ByDesignFigure({
  drawing,
  description,
}: {
  readonly drawing: ByDesignDrawing;
  readonly description: string;
}): React.JSX.Element {
  const Drawing = drawings[drawing];
  return (
    <figure className="wv-fig" role="img" aria-label={description}>
      <Drawing />
    </figure>
  );
}
