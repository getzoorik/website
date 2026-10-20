import type { CSSProperties } from "react";

import type { CareerHabit } from "@/content/careers";

/**
 * The four pictures over How we work's habits, drawn from the mock's numbers.
 * Each plays once when its habit comes into view: the sheet keys every
 * animation off the habit's `.is-in` (careers.css), and under reduced motion,
 * or with scripting off, each is drawn at rest.
 *
 *   team     a grid of seats; four light up and are joined by a line
 *   doc      a page that writes itself, then a tick
 *   async    messages that arrive at different hours, on one line
 *   results  three bars that rise, and the line over them
 */

/** The order a part plays in, read by the sheet as `--k`. */
const k = (n: number): CSSProperties => ({ "--k": n }) as CSSProperties;

const SEATS = [0, 1, 2].flatMap((r) => [0, 1, 2, 3, 4, 5].map((c) => [8 + c * 26, 6 + r * 26]));
const LIT = [
  [15, 13],
  [67, 39],
  [119, 13],
  [145, 65],
] as const;
const LINES = [46, 38, 48, 26];
const MESSAGES = [
  [26, 30],
  [80, 10],
  [132, 26],
] as const;
const BARS = [22, 40, 62];

function Team(): React.JSX.Element {
  return (
    <svg className="cr-vis v-team" viewBox="0 0 160 84" aria-hidden="true">
      {SEATS.map(([x, y]) => (
        <rect className="seat" x={x} y={y} width="14" height="14" rx="3" key={`${x} ${y}`} />
      ))}
      <path className="link" pathLength={1} d="M15 13 L67 39 L119 13 L145 65" />
      {LIT.map(([x, y], n) => (
        <rect
          className="on"
          style={k(n)}
          x={x - 7}
          y={y - 7}
          width="14"
          height="14"
          rx="3"
          key={n}
        />
      ))}
    </svg>
  );
}

function Doc(): React.JSX.Element {
  return (
    <svg className="cr-vis v-doc" viewBox="0 0 160 84" aria-hidden="true">
      <rect className="page" x="44" y="4" width="72" height="76" rx="5" />
      {LINES.map((w, n) => (
        <path
          className="ln"
          style={k(n)}
          pathLength={1}
          d={`M56 ${20 + n * 13} H${56 + w}`}
          key={n}
        />
      ))}
      <path className="ok" pathLength={1} d="M92 64 l5 5 l10 -11" />
    </svg>
  );
}

function Async(): React.JSX.Element {
  return (
    <svg className="cr-vis v-async" viewBox="0 0 160 84" aria-hidden="true">
      <path className="day" d="M6 60 H154" />
      {MESSAGES.map(([x, y], n) => (
        <g className="msg" style={k(n)} key={n}>
          <rect x={x - 20} y={y} width="40" height="18" rx="5" />
          <path d={`M${x} ${y + 18} v${60 - y - 18}`} />
        </g>
      ))}
      {MESSAGES.map(([x]) => (
        <circle className="tick" cx={x} cy="60" r="3" key={x} />
      ))}
    </svg>
  );
}

function Results(): React.JSX.Element {
  return (
    <svg className="cr-vis v-res" viewBox="0 0 160 84" aria-hidden="true">
      <path className="base" d="M20 76 H140" />
      {BARS.map((h, n) => (
        <rect
          className="bar"
          style={{ "--k": n, "--h": h } as CSSProperties}
          x={30 + n * 36}
          y={76 - h}
          width="22"
          height={h}
          rx="3"
          key={n}
        />
      ))}
      <path className="up" pathLength={1} d="M34 50 L76 34 L118 10 M106 10 H118 V22" />
    </svg>
  );
}

const PICTURES: Record<CareerHabit["picture"], () => React.JSX.Element> = {
  team: Team,
  doc: Doc,
  async: Async,
  results: Results,
};

export function HabitPicture({ picture }: { readonly picture: CareerHabit["picture"] }) {
  const Picture = PICTURES[picture];
  return <Picture />;
}
