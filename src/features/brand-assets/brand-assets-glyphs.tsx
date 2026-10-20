import type { JSX } from "react";

import { MARK_CORE, MARK_INNER, MARK_OUTER } from "@/components/brand/mark-geometry";

/**
 * /brand-assets's glyphs, drawn as the mock draws them: the download arrow, the copy squares, the tick of a rule
 * kept and of a copy done, and the cross of a Don't. Each is `aria-hidden`: a name is always set in text beside it.
 * Size and colour come from the surface's rule (`.bk-dl svg`, `.bk-copy svg`, `.bk-ok svg`, `.bk-no svg`,
 * `.hero-cta .btn svg`).
 */

export interface GlyphProps {
  readonly className?: string;
}

const line = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** An arrow into a tray: a download. */
export function DownloadGlyph(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" {...line} strokeWidth={2.2} aria-hidden="true">
      <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
    </svg>
  );
}

/** Two squares, one over the other: copy. */
export function CopyGlyph({ className }: GlyphProps): JSX.Element {
  return (
    <svg className={className} viewBox="0 0 24 24" {...line} strokeWidth={2} aria-hidden="true">
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}

/** A tick: a size rule kept, and a copy done. */
export function TickGlyph({ className }: GlyphProps): JSX.Element {
  return (
    <svg className={className} viewBox="0 0 16 16" {...line} strokeWidth={2.4} aria-hidden="true">
      <path d="M3 8.4l3.2 3.2L13 4.8" />
    </svg>
  );
}

/** A cross: a Don't. Round caps and no join, as the mock draws it. */
export function CrossGlyph(): JSX.Element {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  );
}

/** The navy of every brand file, and the blue the recoloured mark's core is wrongly given. */
const NAVY = "#050B3D";
const WRONG_CORE = "#3B5BF5";

/**
 * "Don't recolour any part of it": the navy mark with its core turned blue. The kit file's own frame
 * (`zoorik-mark-navy-transparent.svg`: the 1024 canvas and the group that fits the mark's ink into it), round the
 * mark's geometry (`mark-geometry.ts`), so the picture is the file with one colour changed.
 */
export function RecolouredMark(): JSX.Element {
  const square = ([x, y, side, angle, cx, cy]: readonly string[]) => (
    <rect
      key={`${x} ${y}`}
      x={x}
      y={y}
      width={side}
      height={side}
      fill={NAVY}
      transform={`rotate(${angle} ${cx} ${cy})`}
    />
  );
  return (
    <svg viewBox="0 0 1024 1024" aria-hidden="true">
      <g transform="translate(11.805 11.805) scale(2.086769) translate(-16.3015 -16.3015)">
        {MARK_OUTER.map(square)}
        {MARK_INNER.map(square)}
        <circle cx={MARK_CORE.cx} cy={MARK_CORE.cy} r={MARK_CORE.r} fill={WRONG_CORE} />
      </g>
    </svg>
  );
}
