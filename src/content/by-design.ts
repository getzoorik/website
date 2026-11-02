import type { ArticleText } from "@/content/learn/article";

/**
 * By design — "Autonomous optimization, without the risk", the home page's one
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

/**
 * The band's heading, in plain words (2 Nov 2026, the SEO sheet): it no longer carries the search "autonomous cloud
 * cost optimization", so it no longer links the cloud cost pillar either.
 */
export const byDesignHeader: { readonly title: ArticleText } = {
  title: "Autonomous optimization, without the risk",
};

export const byDesignCards: readonly ByDesignCard[] = [
  {
    id: "cost",
    title: "Pay for what your workloads use",
    drawing: "use",
    description: "Capacity follows what is used, not what was provisioned for the peak.",
  },
  {
    id: "safe",
    title: "Drains nodes safely, one at a time",
    drawing: "drain",
    description: "A disk leaves the pool only when it is empty.",
  },
  {
    id: "reliable",
    title: "Without any downtime or code changes",
    drawing: "resize",
    description: "No code changes, and the resize runs beside live traffic.",
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
