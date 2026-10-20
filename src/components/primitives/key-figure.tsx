import type { JSX } from "react";

import { savingsFigures, type SavingsKey } from "@/content/savings";

/**
 * One savings figure: the range, said aloud as it is meant, and its caption
 * under it. The product pages' figure aside draws it; the home page's offers
 * draw their own, set large over a bar (the motion pass).
 *
 * The figure is `role="img"` with the spoken range as its name, so "40–50%" is
 * heard as "40 to 50 percent" rather than as two numbers and a dash. A server
 * component: nothing here counts or moves.
 */
export function KeyFigure({ figure }: { readonly figure: SavingsKey }): JSX.Element {
  const { range, spoken, caption } = savingsFigures[figure];
  return (
    <p className="kf">
      <span className="kf-n" role="img" aria-label={spoken}>
        {range}
      </span>
      <span className="kf-c">{caption}</span>
    </p>
  );
}
