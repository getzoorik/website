/**
 * By design — the brand's four promises, in the home page's one band.
 *
 * Every string is the mock's, verbatim. The band says what both products have
 * in common, so a sentence only belongs here if it is true of BOTH: "No
 * maintenance window" is Coral's alone, because Amoeba restarts the services on
 * a VM at the switch onto its pool, and it is not printed here.
 *
 * 🔴 NO PERIODS ON THE HEADING OR THE CARD TITLES, AND NO EYEBROW OR LEDE. The
 * mock sets the h2 and the four h3s plain; only the card lines are sentences.
 *
 * 🔴 NO CARD CARRIES A NUMBER, AND NO DRAWING CARRIES A WORD. Each card has one
 * small drawing and one sentence. The drawings are shapes, not charts: the
 * second bar is 58% wide because that is what the mock draws, not because
 * anything was measured at 58%.
 */

/** Which drawing a card carries. The section holds a renderer for each, so a
 *  card cannot be added here without the compiler asking what it draws.
 *  `removes` is Coral's own ("Never creates machines.", on `/coral` only), and
 *  goes when that page drops its By design row. */
export type ByDesignDrawing = "bars" | "nodes" | "serving" | "control" | "removes";

export interface ByDesignCard {
  readonly id: string;
  readonly title: string;
  readonly drawing: ByDesignDrawing;
  readonly caption: string;
}

export const byDesignHeader = {
  title: "Cloud cost optimization, without the risk",
} as const;

export const byDesignCards: readonly ByDesignCard[] = [
  {
    id: "cost",
    title: "Reduce cloud cost",
    drawing: "bars",
    caption: "Pay for what your workloads use, not what was provisioned for the peak.",
  },
  {
    id: "safe",
    title: "Drains nodes safely, one at a time",
    drawing: "nodes",
    caption: "Nodes drain one at a time. A disk leaves the pool only when it is empty.",
  },
  {
    id: "reliable",
    title: "No code changes, no downtime",
    drawing: "serving",
    caption: "No code changes. Resizes happen while you keep serving.",
  },
  {
    id: "visibility",
    title: "Full control and visibility",
    drawing: "control",
    caption: "You decide what each product manages, and see every change it makes.",
  },
];

/**
 * The one drawing that still carries a word: `/coral`'s "Never creates
 * machines." card, until that page drops its By design row. The four home
 * drawings carry none.
 */
export const byDesignDrawingCopy = {
  removes: { caption: "Only removes" },
} as const;
