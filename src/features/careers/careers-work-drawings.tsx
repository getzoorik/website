import type { CSSProperties } from "react";

import type { CareerHabit } from "@/content/careers";
import { GITHUB_PATH } from "@/features/careers/careers-marks";

/**
 * How we work's four drawings, as the mock draws them (`motion_parts.py`, `WORK_ART`), each on one 200×110
 * canvas and named by the mock's class (`il-w-<drawing>`):
 *
 *   globe    three clocks in three time zones, their minute hands turning, a message travelling between them
 *   doc      a page that writes itself, line by line, from Confluence and GitHub, then a tick
 *   clock    messages landing at different hours on one day while the day moves on
 *   target   a GitHub branch leaves the main line, takes two commits and is merged
 *
 * Pure structure: every stroke, tint and loop lives in careers-work.css (the `.cq-wk .il-w-*` rules), so each
 * drawing is right in its first painted frame. What moves is a 6s loop, paused while its card is off screen
 * (`CareersWorkMotion`); under reduced motion, or without scripting, each holds its end state.
 *
 * Each SVG is hidden from a screen reader: the card carries the habit's sentence (`role="img"`, `aria-label`).
 *
 * ─── THE TWO MARKS ─────────────────────────────────────────────────────────
 * Confluence's mark is inlined here; GitHub's is the hero's (`GITHUB_PATH`, careers-marks.tsx). Source:
 * single-colour marks from Simple Icons (simple-icons@16.35.0, CC0 for the SVG data,
 * https://github.com/simple-icons/simple-icons), downloaded 24 Oct 2026 with the owner's yes
 * (ux-design/_proposals/2026-10-24-careers/logos/). Trademarks: each mark is its owner's trademark (Confluence:
 * Atlassian; GitHub: GitHub, Inc.). They are used only to name a tool we build with or write in.
 * The sheet draws them as outlines in the drawings' own line, as the mock renders them (careers-work.css says
 * why); the hero's ring draws GitHub's filled.
 */

const VIEW_BOX = "0 0 200 110";

const MARKS = {
  confluence:
    "M.87 18.257c-.248.382-.53.875-.763 1.245a.764.764 0 0 0 .255 1.04l4.965 3.054a.764.764 0 0 0 1.058-.26c.199-.332.454-.763.733-1.221 1.967-3.247 3.945-2.853 7.508-1.146l4.957 2.337a.764.764 0 0 0 1.028-.382l2.364-5.346a.764.764 0 0 0-.382-1 599.851 599.851 0 0 1-4.965-2.361C10.911 10.97 5.224 11.185.87 18.257zM23.131 5.743c.249-.405.531-.875.764-1.25a.764.764 0 0 0-.256-1.034L18.675.404a.764.764 0 0 0-1.058.26c-.195.335-.451.763-.734 1.225-1.966 3.246-3.945 2.85-7.508 1.146L4.437.694a.764.764 0 0 0-1.027.382L1.046 6.422a.764.764 0 0 0 .382 1c1.039.49 3.105 1.467 4.965 2.361 6.698 3.246 12.392 3.029 16.738-4.04z",
  github: GITHUB_PATH,
} as const;

/** The order a part plays in, read by the sheet as `--k`. */
const k = (n: number): CSSProperties => ({ "--k": n }) as CSSProperties;

/** A tool's mark on its 30×30 tile, its 24-unit path scaled to 20. */
function Tile({
  mark,
  x,
  y,
}: {
  readonly mark: keyof typeof MARKS;
  readonly x: number;
  readonly y: number;
}): React.JSX.Element {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect className="w-tile" width="30" height="30" rx="3" />
      <g transform="translate(5 5) scale(.8333)">
        <path d={MARKS[mark]} />
      </g>
    </g>
  );
}

/** Each clock's centre and the hour its hour hand shows, in degrees. */
const CLOCKS = [
  [44, 38, 0],
  [100, 78, 150],
  [156, 38, 270],
] as const;

/** Remote first: three clocks joined in one team; their minute hands turn and two messages cross. */
function Globe(): React.JSX.Element {
  return (
    <svg className="il il-w-globe" viewBox={VIEW_BOX} aria-hidden="true">
      <path className="w-net" d="M44 38L100 78L156 38Z" />
      {CLOCKS.map(([x, y, hour]) => (
        <g className="w-clk" key={x}>
          <circle cx={x} cy={y} r="17" />
          <path
            className="w-h"
            style={{ "--hr": `${hour}deg`, transformOrigin: `${x}px ${y}px` } as CSSProperties}
            d={`M${x} ${y}V${y - 9}`}
          />
          <path
            className="w-m"
            style={{ transformOrigin: `${x}px ${y}px` }}
            d={`M${x} ${y}V${y - 13}`}
          />
        </g>
      ))}
      <circle className="w-pkt p1" cx="44" cy="38" r="3" />
      <circle className="w-pkt p2" cx="100" cy="78" r="3" />
    </svg>
  );
}

/** The page's four lines, by their length. */
const LINES = [40, 32, 40, 24] as const;

/** Written down: a page between Confluence and GitHub writes itself, then a tick. */
function Doc(): React.JSX.Element {
  return (
    <svg className="il il-w-doc" viewBox={VIEW_BOX} aria-hidden="true">
      <path className="w-link" d="M48 35H70M130 35H152" />
      <Tile mark="confluence" x={18} y={20} />
      <Tile mark="github" x={152} y={20} />
      <rect className="w-page" x="70" y="8" width="60" height="94" rx="2" />
      {LINES.map((width, n) => (
        <path
          className="w-ln"
          style={k(n)}
          pathLength={1}
          d={`M80 ${26 + n * 13}H${80 + width}`}
          key={n}
        />
      ))}
      <path className="w-ok" pathLength={1} d="M104 86l5 5 10-11" />
    </svg>
  );
}

/** The day's three hours, on its line. */
const HOURS = [40, 100, 160] as const;
/** Each message's hour and the top of its note. */
const MESSAGES = [
  [40, 48],
  [100, 22],
  [160, 40],
] as const;

/** Asynchronous by default: three messages land at different hours while the day moves on. */
function Clock(): React.JSX.Element {
  return (
    <svg className="il il-w-clock" viewBox={VIEW_BOX} aria-hidden="true">
      <path className="as-day" d="M16 86H184" />
      {HOURS.map((x) => (
        <circle className="as-t" cx={x} cy="86" r="3" key={x} />
      ))}
      {MESSAGES.map(([x, y], n) => (
        <g className="as-m" style={k(n)} key={x}>
          <rect x={x - 22} y={y} width="44" height="20" rx="2" />
          <path d={`M${x} ${y + 20}V83`} />
        </g>
      ))}
      <path className="as-now" d="M16 80V92" />
    </svg>
  );
}

/** Results, not hours: a GitHub branch takes two commits and is merged back. */
function Target(): React.JSX.Element {
  return (
    <svg className="il il-w-target" viewBox={VIEW_BOX} aria-hidden="true">
      <path className="mg-main" d="M16 78H184" />
      <Tile mark="github" x={154} y={6} />
      <path
        className="mg-br"
        pathLength={1}
        d="M36 78C52 78 52 46 68 46H122C138 46 138 78 154 78"
      />
      <circle className="mg-c c1" cx="84" cy="46" r="4" />
      <circle className="mg-c c2" cx="104" cy="46" r="4" />
      <g className="mg-ok">
        <circle cx="154" cy="78" r="8" />
        <path d="M150 78l3 3 6-6" />
      </g>
    </svg>
  );
}

const DRAWINGS: Record<CareerHabit["drawing"], () => React.JSX.Element> = {
  globe: Globe,
  doc: Doc,
  clock: Clock,
  target: Target,
};

export function WorkDrawing({
  drawing,
}: {
  readonly drawing: CareerHabit["drawing"];
}): React.JSX.Element {
  const Drawing = DRAWINGS[drawing];
  return <Drawing />;
}
