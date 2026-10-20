import {
  MARK_CORE,
  MARK_INNER,
  MARK_OUTER,
  type MarkSquare,
} from "@/components/brand/mark-geometry";

/**
 * The turning Zoorik mark (brand 2.0):
 * half of the mark at a hero's right edge, translucent, a soft bone glow behind
 * it, one turn every 48 seconds.
 *
 * One source for every surface that draws it: every hero but the home page's
 * (the two product pages, the docs hub, the guides, the FAQs, /assessment,
 * /privacy and /terms; the home hero has none) and the /login panel; and, as
 * its art alone (`TurningMarkArt`), /careers's dark close. Two siblings, in the
 * mock's order: the glow `div`, then the art `svg`. A hero renders them as its
 * first two children, ahead of the photo, so they sit over the photo (z −2) and
 * its scrim (z −1) and under the copy (`.hero > .wrap`, z 1).
 *
 * ─── THE ART IS THE MOCK'S, STRING FOR STRING ──────────────────────────────
 * The mock's art: the 2.0 mark in bone #FAF7F3, its ten outer squares at .26,
 * its five inner squares at .42 and its core, r 104, at .14, each element
 * carrying its own opacity and fill as the mock writes them. The geometry is
 * the logo's own (`mark-geometry.ts`).
 *
 * ─── EVERYTHING ELSE IS THE SHEET'S ────────────────────────────────────────
 * Size, place, glow and turn live in the site system (`.hero .zk-art`,
 * `.hero .zk-glow`, `@keyframes zkTurn`): 702 / 810px in a 1440×900 hero, 560 /
 * 660px in a utility hero, 240 / 320px at 700px and below. The sign-in panel
 * sizes its own (`.login .panel .art`, `.glow`) and paints a stronger glow,
 * which is why both classes are props: `zk-art` / `zk-glow` in a hero (the
 * default), `art` / `glow` on /login.
 *
 * 🔴 IT IS CENTRED WITH NEGATIVE MARGINS, NEVER A TRANSLATE. The turn is the
 * `rotate` property, and `rotate` composes after `transform`: a translate there
 * would make the mark orbit its corner instead of spinning in place.
 *
 * 🔴 THE TURN EXISTS ONLY UNDER `prefers-reduced-motion: no-preference`. The
 * animation is declared inside that query and nowhere else, so a reader who asks
 * for stillness gets no animation at all, not one stopped by an override. No
 * script is involved: this is a server component, and the mark is decoration
 * (`aria-hidden`, `focusable="false"`, `pointer-events:none` in the sheet).
 */

/** The bone the art paints in, and each part's opacity (the mock's art). */
const BONE = "#FAF7F3";

function ring(squares: readonly MarkSquare[], opacity: string): React.JSX.Element[] {
  return squares.map(([x, y, side, angle, cx, cy]) => (
    <rect
      key={`${x} ${y}`}
      opacity={opacity}
      x={x}
      y={y}
      width={side}
      height={side}
      fill={BONE}
      transform={`rotate(${angle} ${cx} ${cy})`}
    />
  ));
}

export interface TurningMarkProps {
  /** The art's class: `zk-art` in a hero (the default), `art` on the /login panel. */
  readonly className?: string;
  /** The glow's class: `zk-glow` in a hero (the default), `glow` on the /login panel. */
  readonly glowClassName?: string;
}

/**
 * The mark's art alone, with no glow: the hero's `svg`, and on /careers the
 * mark that turns in the dark closing card (`cr-jart`).
 */
export function TurningMarkArt({ className }: { readonly className: string }): React.JSX.Element {
  return (
    <svg className={className} aria-hidden="true" focusable="false" viewBox="0 0 512 512">
      {ring(MARK_OUTER, ".26")}
      {ring(MARK_INNER, ".42")}
      <circle cx={MARK_CORE.cx} cy={MARK_CORE.cy} r={MARK_CORE.r} fill={BONE} opacity=".14" />
    </svg>
  );
}

export function TurningMark({
  className = "zk-art",
  glowClassName = "zk-glow",
}: TurningMarkProps = {}): React.JSX.Element {
  return (
    <>
      <div className={glowClassName} aria-hidden="true" />
      <TurningMarkArt className={className} />
    </>
  );
}
