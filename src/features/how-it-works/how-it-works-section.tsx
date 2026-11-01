import type { ReactNode } from "react";

import type { LegendTone, Step } from "@/content/how-it-works";
import { StepMarkFigure } from "@/features/how-it-works/step-marks";
import { Reveal } from "@/components/primitives/reveal";

/**
 * How it works — one product's three cards, three marks, and the figures inside
 * them, as `/coral` and `/amoeba` draw them.
 *
 * ─── A SERVER COMPONENT ────────────────────────────────────────────────────
 * The cards reveal through `Reveal`, which owns the observer and the stagger.
 * `.rise` carries no offset of its own — the 16px lives inside `@keyframes
 * zRise` and nowhere else — so with scripting off, with reduced motion, or with
 * an observer that never fires, a card renders complete and correct rather
 * than 16px low.
 *
 * ─── WHY THE MARKS ARE MARKUP AND THE SENTENCES ARE CONTENT ────────────────
 * The dividing line is not "text vs. elements", it is "what a copy edit may
 * touch". Headings, captions, key labels and figures are copy and live in
 * `src/content/how-it-works.ts`. The marks are drawings — tracks in a bank,
 * three segments of a rule, one empty ring — that mean nothing on their own, so
 * they stay in `step-marks.tsx` beside this file.
 */

/**
 * 🔴 THE DOT CLASSES ARE WRITTEN OUT, NOT BUILT FROM THE TONE.
 * `` `hw-dot d-${tone}` `` would render identically today and would be
 * invisible to every grep, every find-in-files and every dead-CSS pass that
 * ever asks "is `.d-tint` still used?". A `Record` keyed by the union also
 * fails closed: add a tone to `LegendTone` without a class here and the build
 * stops.
 */
const legendDotClass: Record<LegendTone, string> = {
  accent: "hw-dot d-accent",
  tint: "hw-dot d-tint",
  line: "hw-dot d-line",
  good: "hw-dot d-good",
  ring: "hw-dot d-ring",
};

/**
 * A card with no figure, mark or key: a per-cloud page's (`/aks-cost-optimization`,
 * `/azure-managed-disk-cost-optimization`…). It keeps the product's card name, and its note where the card has one,
 * then says one line about that cloud (`p.step-l`, the closing row card's text, in cloud-page.css). The line is drawn
 * as given, so a name in it stays out of translation.
 */
export interface LineStep extends Pick<Step, "ordinal" | "title" | "note"> {
  readonly line: ReactNode;
}

interface StepCardProps {
  /** A product page's card, with its figure, mark and key; or a per-cloud page's, with its one line. */
  readonly step: Step | LineStep;
  /**
   * Position in the row, which becomes `data-i` — ORDER, not an effect. The
   * observer turns it into a delay of `order × --z-step`. It is omitted on the
   * first card exactly as the mock omits it: `data-i="0"` and no attribute at
   * all both mean "no delay", and the mock writes the shorter one.
   */
  readonly order: number;
}

/**
 * Exported for the product pages, which show one product's three cards, and for
 * the per-cloud pages, whose three cards carry one line each (`LineStep`).
 *
 * A step with a note sets its title and the note together in one div beside the
 * numeral, as the mocks draw it (`.step-top > div`); a step without one keeps the
 * bare h3, so the two shapes the mocks print are the two this renders.
 */
export function StepCard({ step, order }: StepCardProps): React.JSX.Element {
  return (
    <Reveal className="stepc" order={order}>
      <div className="step-top">
        <span className="stepn" aria-hidden="true">
          {step.ordinal}
        </span>
        {step.note ? (
          <div>
            <h3>{step.title}</h3>
            <p className="step-note">{step.note}</p>
          </div>
        ) : (
          <h3>{step.title}</h3>
        )}
      </div>
      {"line" in step ? <p className="step-l">{step.line}</p> : <StepFigure step={step} />}
    </Reveal>
  );
}

/** A product page's card under its head: the sentence for a screen reader, the figure and its mark, then the key. */
function StepFigure({ step }: { readonly step: Step }): React.JSX.Element {
  return (
    <>
      <p className="sr-only">{step.description}</p>
      <div className="hw-lead">
        <div className="hw-key">
          <span className="hw-cap">{step.figure.caption}</span>
          <span className="hw-num">
            {step.figure.value}
            <i>{step.figure.unit}</i>
          </span>
          <span className="hw-sub">{step.figure.sub}</span>
        </div>
        <StepMarkFigure mark={step.mark} />
      </div>
      <dl className="hw-leg">
        {step.legend.map((row) => (
          <div className="hw-leg-r" key={row.label}>
            <dt>
              <i aria-hidden="true" className={legendDotClass[row.tone]} />
              {row.label}
            </dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}
