import type { CSSProperties } from "react";

import { MARK_CORE, MARK_INNER, MARK_OUTER } from "@/components/brand/mark-geometry";
import { careers, type CareersTool } from "@/content/careers";
import { ToolMark } from "@/features/careers/careers-marks";

/**
 * The hero's figure: the Zoorik mark, still, with the tools we build with
 * turning round it on three rings (owner, 24 Oct 2026: "proper motions and
 * graphics and logos"; 25 Oct: "shows other tech stacks we are using like
 * python, FE techstacks etc"), sixteen marks in all:
 *
 *   inner ring    where it runs: Kubernetes, Azure, AWS and Linux; one turn
 *                 in 70s
 *   middle ring   what it is written in and on: Go, Python, TypeScript,
 *                 PostgreSQL and Docker; one turn in 100s, the other way
 *   outer ring    how it is built, shipped and served: React, Next.js, Helm,
 *                 Terraform, Argo CD, GitHub and Cloudflare; one turn in 140s,
 *                 the inner ring's way
 *
 * Each mark sits on a bone tile that turns against its ring, so every mark
 * stays upright. The sheet turns the rings (careers.css), only while the hero
 * is on screen (`.is-on`, from `CareersMotion`) and not under the pointer;
 * under reduced motion, or with scripting off, they stand still where the mock
 * places them.
 *
 * One image for the ear (`role="img"` and the label naming every tool); the
 * tiles carry the tool's name as a tooltip, as the mock's do.
 *
 * The mark is the brand kit's, drawn from `mark-geometry.ts` on its whole 512
 * canvas as the mock's `#zmark` symbol is, and still: not `BrandMark`, whose
 * rings turn.
 */

/** Where each ring's first tile stands, in degrees clockwise from the top; the rest follow evenly. */
const OUTER_FROM = 8;
const MIDDLE_FROM = 20;
const INNER_FROM = 45;

function Ring({
  className,
  tools,
  from,
}: {
  readonly className: string;
  readonly tools: readonly Required<CareersTool>[];
  readonly from: number;
}): React.JSX.Element {
  const step = 360 / tools.length;
  return (
    <div className={`cq-ring ${className}`}>
      {tools.map((tool, i) => (
        <span
          className="cq-o"
          style={{ "--a": `${from + i * step}deg` } as CSSProperties}
          title={tool.name}
          key={tool.name}
        >
          <span className="cq-ol">
            <ToolMark mark={tool.mark} idSuffix="cq-orbit" />
          </span>
        </span>
      ))}
    </div>
  );
}

/** The mark, still: fifteen squares round the core, in the bone the sheet gives it (`.cq-core svg`). */
function StillMark(): React.JSX.Element {
  return (
    <svg viewBox="0 0 512 512" aria-hidden="true" focusable="false">
      {[...MARK_OUTER, ...MARK_INNER].map(([x, y, side, angle, cx, cy]) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width={side}
          height={side}
          transform={`rotate(${angle} ${cx} ${cy})`}
        />
      ))}
      <circle cx={MARK_CORE.cx} cy={MARK_CORE.cy} r={MARK_CORE.r} />
    </svg>
  );
}

export function CareersOrbit(): React.JSX.Element {
  const { rings, orbitLabel } = careers.hero;
  return (
    <div className="cq-orbit" role="img" aria-label={orbitLabel}>
      <Ring className="cq-r3" tools={rings.outer} from={OUTER_FROM} />
      <Ring className="cq-r2" tools={rings.middle} from={MIDDLE_FROM} />
      <Ring className="cq-r1" tools={rings.inner} from={INNER_FROM} />
      <div className="cq-core">
        <StillMark />
      </div>
    </div>
  );
}
