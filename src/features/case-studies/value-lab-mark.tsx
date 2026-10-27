import {
  MARK_CORE,
  MARK_INNER,
  MARK_OUTER,
  type MarkSquare,
} from "@/components/brand/mark-geometry";

/**
 * The Zoorik mark on Value Lab's featured study: the brand mark, still, every square and the core in `--zm-sq`
 * (navy, set by `.vl-own`). The site's `BrandMark` turns its rings; this one does not move.
 */
function squares(ring: readonly MarkSquare[]): React.JSX.Element[] {
  return ring.map(([x, y, side, angle, cx, cy]) => (
    <rect
      key={`${x}-${y}`}
      x={x}
      y={y}
      width={side}
      height={side}
      fill="var(--zm-sq,#050B3D)"
      transform={`rotate(${angle} ${cx} ${cy})`}
    />
  ));
}

export function ValueLabMark({ className }: { readonly className: string }): React.JSX.Element {
  return (
    <svg className={className} viewBox="0 0 512 512" aria-hidden="true">
      {squares(MARK_OUTER)}
      {squares(MARK_INNER)}
      <circle cx={MARK_CORE.cx} cy={MARK_CORE.cy} r={MARK_CORE.r} fill="var(--zm-sq,#050B3D)" />
    </svg>
  );
}
