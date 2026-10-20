/**
 * The small glyphs /careers draws: the tick beside each
 * behaviour, the back arrow on a value's panel, and the two marks that say how
 * a hiring step happens. Decoration only: each is `aria-hidden`, and the words
 * beside it carry the meaning. The forward arrow is the site's `Arrow`.
 */

const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

/** The tick in a behaviour's wash circle. */
export function TickGlyph(): React.JSX.Element {
  return (
    <svg viewBox="0 0 16 16" strokeWidth={2.4} {...STROKE}>
      <path d="M3 8.4l3.2 3.2L13 4.8" />
    </svg>
  );
}

/** The previous value's button. */
export function BackGlyph(): React.JSX.Element {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2.2} {...STROKE}>
      <path d="M19 12H5M11 19l-7-7 7-7" />
    </svg>
  );
}

/** A step held on a video call. */
export function VideoGlyph(): React.JSX.Element {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} {...STROKE}>
      <rect x="3" y="6" width="13" height="12" rx="2" />
      <path d="M16 10.5l5-3v9l-5-3" />
    </svg>
  );
}

/** A step done in writing. */
export function WriteGlyph(): React.JSX.Element {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} {...STROKE}>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v4h4M10 12h5M10 16h5" />
    </svg>
  );
}
