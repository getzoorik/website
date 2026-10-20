import type { CSSProperties } from "react";

import { byDesignDrawingCopy, type ByDesignDrawing } from "@/content/by-design";

/**
 * The four drawings, one per card.
 *
 * Each drawing is pure structure: every length, tint and timing lives in the
 * site system (`.pl-bars`, `.pl-nodes`, `.pl-up`, `.pl-log`), so all four are
 * correct in their first painted frame. What moves, moves once, after the card
 * has risen: the bars grow, the draining square pulses twice, the switch
 * slides; Reliable stands still. Reduced motion removes all of it.
 *
 * They are rendered inside an `aria-hidden` box and say nothing in words. That
 * is safe rather than lossy: the line under each drawing states what the
 * picture shows.
 */

/** Cut cost: a grey bar at full width, an accent bar under it at 58%. */
function BarsDrawing(): React.JSX.Element {
  return (
    <div className="pl-bars">
      <i className="b0" />
      <i className="b1" />
    </div>
  );
}

/** Safe by design: five squares. Two are in use, one is draining, two are empty. */
function NodesDrawing(): React.JSX.Element {
  return (
    <div className="pl-nodes">
      <i className="on" />
      <i className="on" />
      <i className="drain">
        <b />
      </i>
      <i />
      <i />
    </div>
  );
}

/** How many ticks the uptime strip draws, and which one (1-based) is the
 *  resize, in the accent (`.pl-strip b:nth-child(12)` in the site system). */
const STRIP_TICKS = 18;

/** Reliable: a live dot, then an uptime strip with no gap in it, one tick of
 *  which is the resize. */
function ServingDrawing(): React.JSX.Element {
  return (
    <div className="pl-up">
      <i className="dot" />
      <span className="pl-strip">
        {Array.from({ length: STRIP_TICKS }, (_, i) => (
          <b key={i} />
        ))}
      </span>
    </div>
  );
}

/** The small green tick of the log, at the mock's 2.2 stroke. */
function LogTick(): React.JSX.Element {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3.5 8.3l2.9 2.9 6.1-6.4" />
    </svg>
  );
}

/** The three lines' lengths, as the mock writes them inline. Shapes, not data. */
const LOG_LINES: readonly CSSProperties[] = [{ width: "46%" }, { width: "72%" }, { width: "58%" }];

/** Full visibility: a switch that is on, then two logged lines. */
function ControlDrawing(): React.JSX.Element {
  return (
    <div className="pl-log">
      <span>
        <i className="tog">
          <b />
        </i>
        <s style={LOG_LINES[0]} />
      </span>
      <span>
        <LogTick />
        <s style={LOG_LINES[1]} />
      </span>
      <span>
        <LogTick />
        <s style={LOG_LINES[2]} />
      </span>
    </div>
  );
}

/**
 * Never creates machines (`/coral`'s By design row only): three squares in use
 * and one dashed outline where a fourth was. Coral only removes; the autoscaler
 * adds. The dashed square is `.pp-only i.gone` in `product-page.css`. It goes
 * with that row.
 */
function RemovesDrawing(): React.JSX.Element {
  return (
    <>
      <div className="pl-nodes pp-only">
        <i className="on" />
        <i className="on" />
        <i className="on" />
        <i className="gone" />
      </div>
      <span className="pl-cap">{byDesignDrawingCopy.removes.caption}</span>
    </>
  );
}

/**
 * 🔴 A `Record`, not a switch with a default. Every member of `ByDesignDrawing`
 * has to appear here or this file does not compile, so a card added to the
 * content can never silently render an empty figure.
 */
const drawings: Record<ByDesignDrawing, () => React.JSX.Element> = {
  bars: BarsDrawing,
  nodes: NodesDrawing,
  serving: ServingDrawing,
  control: ControlDrawing,
  removes: RemovesDrawing,
};

/** The drawing between a card's title and its line. */
export function ByDesignFigure({ drawing }: { drawing: ByDesignDrawing }): React.JSX.Element {
  const Drawing = drawings[drawing];
  return (
    <div className="pl-fig" aria-hidden="true">
      <Drawing />
    </div>
  );
}
