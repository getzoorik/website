/**
 * By design — "Cloud cost optimization, without the risk", the home page's one
 * band: four promises, each a drawing with its title as the caption.
 *
 * The band says what both products have in common, so a promise only belongs
 * here if it is true of BOTH: "No maintenance window" is Coral's alone, because
 * Amoeba restarts the services on a VM at the switch onto its pool, and it is
 * not printed here.
 *
 * 🔴 THE SENTENCES LEFT THE SCREEN, NOT THE PAGE (owner, 23 Oct 2026: "It should
 * not heavy on texts + it should use proper visuals + motions"). Each card's
 * sentence is its drawing's description for a screen reader (`role="img"`,
 * `aria-label`), word for word; on screen the card is the drawing and its title.
 *
 * 🔴 NO PERIODS ON THE HEADING OR THE CARD TITLES, AND NO FIGURE IN A DRAWING.
 * The drawings are shapes, not charts: a shape may be illustrative, a number may
 * not. Their few words name a line or a lane (`byDesignDrawingWords`).
 */

/** Which drawing a card carries. The section holds one for each, so a card
 *  cannot be added here without the compiler asking what it draws. */
export type ByDesignDrawing = "use" | "drain" | "resize" | "control";

export interface ByDesignCard {
  readonly id: string;
  readonly title: string;
  readonly drawing: ByDesignDrawing;
  /** The sentence the drawing shows, as its name for a screen reader. */
  readonly description: string;
}

export const byDesignHeader = {
  title: "Cloud cost optimization, without the risk",
} as const;

export const byDesignCards: readonly ByDesignCard[] = [
  {
    id: "cost",
    title: "Reduce cloud cost",
    drawing: "use",
    description: "Pay for what your workloads use, not what was provisioned for the peak.",
  },
  {
    id: "safe",
    title: "Drains nodes safely, one at a time",
    drawing: "drain",
    description: "Nodes drain one at a time. A disk leaves the pool only when it is empty.",
  },
  {
    id: "reliable",
    title: "No code changes, no downtime",
    drawing: "resize",
    description: "No code changes. Resizes happen while you keep serving.",
  },
  {
    id: "visibility",
    title: "Full control and visibility",
    drawing: "control",
    description: "You decide what each product manages, and see every change it makes.",
  },
];

/**
 * The words inside the drawings, each a label on a line or a lane. The last
 * drawing names the two products by their own names (`products.ts`).
 */
export const byDesignDrawingWords = {
  provisioned: "Provisioned",
  used: "Used",
  traffic: "Live traffic",
  disk: "Disk",
} as const;
