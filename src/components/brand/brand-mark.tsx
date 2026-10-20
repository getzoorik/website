import {
  LOCKUP,
  MARK_CORE,
  MARK_INNER,
  MARK_OUTER,
  MARK_VIEWBOX,
  WORDMARK,
  type MarkSquare,
} from "@/components/brand/mark-geometry";

/**
 * The Zoorik logo, brand 2.0: the lockup beside the bar's links, in the footer
 * and on /login (`BrandLogo`), and the mark alone on the free assessment's card
 * in What we offer (`BrandMark`). Both are drawn from the brand kit's parts; the
 * numbers live in `mark-geometry.ts`.
 *
 * ─── ONE COLOUR, AND THE GROUND SETS IT ────────────────────────────────────
 * Every square, the core and the word paint in `currentColor`:
 * navy #050B3D on light grounds, bone #FAF7F3 over the dark hero
 * (`.nav:not(.solid) .brand-logo`), white on the navy card. The sheets set the
 * colour; the drawing never names one.
 *
 * ─── THE RINGS TURN OPPOSITE WAYS; THE CORE AND THE WORD STAY STILL ────────
 * The sheet moves the mark's two rings (nav.css, only under
 * `prefers-reduced-motion: no-preference`): the outer ring
 * `zl-o` turns one way and the inner ring `zl-i` the other, one turn in 49s.
 * They turn about the canvas centre (256, 256), not their own boxes: the five
 * lone squares make the outer ring's box uneven, and any other origin drifts.
 * The group round them, `zl-t`, is the kit's drawing and stays still.
 *
 * Both are decoration (`aria-hidden`, `focusable="false"`): the link that holds
 * the lockup carries its name.
 */

function ring(squares: readonly MarkSquare[]): React.JSX.Element[] {
  return squares.map(([x, y, side, angle, cx, cy]) => (
    <rect
      key={`${x}-${y}`}
      x={x}
      y={y}
      width={side}
      height={side}
      fill="currentColor"
      transform={`rotate(${angle} ${cx} ${cy})`}
    />
  ));
}

/** The mark's groups: `zl-t`, and inside it the two turning rings round the core. */
function MarkGroups(): React.JSX.Element {
  return (
    <g className="zl-t">
      <g className="zl-o">{ring(MARK_OUTER)}</g>
      <g className="zl-i">{ring(MARK_INNER)}</g>
      <circle cx={MARK_CORE.cx} cy={MARK_CORE.cy} r={MARK_CORE.r} fill="currentColor" />
    </g>
  );
}

/**
 * The lockup: the mark, then "zoorik" in outlines. `.brand-logo` sizes it
 * (nav.css: 47.3 × 189.8 at the widest bar, the box's ratio 4.0088); the mark's
 * own `svg` lets its squares overflow the square it is placed in, as they do in
 * the kit.
 */
export function BrandLogo(): React.JSX.Element {
  const { mark } = LOCKUP;
  return (
    <svg className="brand-logo" viewBox={LOCKUP.viewBox} aria-hidden="true" focusable="false">
      <svg
        x={mark.x}
        y={mark.y}
        width={mark.width}
        height={mark.height}
        viewBox={mark.viewBox}
        overflow="visible"
      >
        <MarkGroups />
      </svg>
      <g fill="currentColor">
        {WORDMARK.map(([transform, d]) => (
          <path key={transform} transform={transform} d={d} />
        ))}
      </g>
    </svg>
  );
}

/** The mark alone, in the box the lockup gives it: its slot sizes it (`.ofx-free-i .zl-mark`). */
export function BrandMark(): React.JSX.Element {
  return (
    <svg
      className="zl-mark"
      viewBox={MARK_VIEWBOX}
      overflow="visible"
      aria-hidden="true"
      focusable="false"
    >
      <MarkGroups />
    </svg>
  );
}
