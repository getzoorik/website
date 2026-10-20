import type { CSSProperties } from "react";

import type { StepMark } from "@/content/how-it-works";

/**
 * The three marks, and nothing else.
 *
 * Each one is pure structure, correct in its first painted frame — with
 * scripting off, in a background tab, and in a screenshot taken mid-scroll.
 * Nothing below computes a proportion, and nothing below may start to: Coral's
 * lengths, angles and stops live in `how-it-works.css`, and Amoeba's are
 * authored as values in `src/content/how-it-works.ts` and handed to the same
 * rules as-is. The moment a percentage is calculated in TypeScript there are two
 * sources of truth for the same number and only one of them is reviewed as a
 * design.
 *
 * They are rendered inside an `aria-hidden` box. That is safe rather than lossy
 * because the key at the foot of every card names every quantity the mark draws
 * — see `.hw-leg` in the sheet, which exists for exactly that reason.
 */

/** Coral: six nodes. The left bank is the six read, filled to the ceiling; the
 *  right bank is the SAME six with the ceiling intact and nothing in it. */
const NODE_TRACKS = [0, 1, 2, 3, 4, 5] as const;

/** Amoeba: the four data disks on the VM, each part full. */
const DISK_TRACKS = [0, 1, 2, 3] as const;

/** 01 — a COUNT: columns against a visible ceiling. */
function ColumnsMark({ mark }: { mark: Extract<StepMark, { kind: "columns" }> }) {
  if (mark.bank === "disks") {
    return (
      <div className="hw-cols">
        {/* `.b4` is the four-track bank; the fill height is the sheet's. */}
        <div className="hw-bank b4">
          {DISK_TRACKS.map((track) => (
            <span className="hw-col" key={track}>
              <b />
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="hw-cols">
      <div className="hw-bank">
        {NODE_TRACKS.map((track) => (
          <span className="hw-col" key={track}>
            <b />
          </span>
        ))}
      </div>
      <div className="hw-bank">
        {NODE_TRACKS.map((track) => (
          <span className="hw-col" key={track} />
        ))}
      </div>
    </div>
  );
}

/** 02 — a SPLIT of one whole: one flat segmented rule. Three segments; their
 *  shares are the sheet's unless the card brings its own. */
function RuleMark({ mark }: { mark: Extract<StepMark, { kind: "rule" }> }) {
  return (
    <div className="hw-bar" style={mark.split ? { gridTemplateColumns: mark.split } : undefined}>
      <i className="hw-work" />
      <i className="hw-req" />
      <i className="hw-head" />
    </div>
  );
}

/** 03 — a RATIO of money: two arcs of one ring, and the ring is the bill. The
 *  element is empty on purpose; both arcs and the gaps between them are one
 *  conic gradient in the sheet, split at `--keep`. */
function DonutMark({ mark }: { mark: Extract<StepMark, { kind: "donut" }> }) {
  return (
    <div
      className="hw-donut"
      style={mark.keep ? ({ "--keep": mark.keep } as CSSProperties) : undefined}
    />
  );
}

export interface StepMarkFigureProps {
  readonly mark: StepMark;
}

/**
 * The one box every mark sits in: one width, one height, three drawings.
 *
 * 🔴 A `switch` OVER THE UNION'S `kind`, WITH NO DEFAULT. Each branch narrows
 * the mark to its own shape, and a fourth kind added to `StepMark` leaves this
 * function without a return on one path, which does not compile — so a new step
 * can never silently render a card with an empty figure box.
 */
export function StepMarkFigure({ mark }: StepMarkFigureProps): React.JSX.Element {
  return (
    <div className="hw-fig" aria-hidden="true">
      {drawMark(mark)}
    </div>
  );
}

function drawMark(mark: StepMark): React.JSX.Element {
  switch (mark.kind) {
    case "columns":
      return <ColumnsMark mark={mark} />;
    case "rule":
      return <RuleMark mark={mark} />;
    case "donut":
      return <DonutMark mark={mark} />;
  }
}
