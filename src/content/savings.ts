import type { ProductId } from "@/content/products";

/**
 * The savings figures and the words that go with them: the three ranges that
 * may be printed, their qualifier and their caption.
 *
 * 🔴 A FIGURE IS NEVER PRINTED WITHOUT ITS QUALIFIER, never on a share card and
 * never in the same card as a worked example. Each range is said aloud the way
 * it is meant ("40 to 50 percent"), since a screen reader would read the en
 * dash as nothing. Written with an en dash, no spaces.
 */

export type SavingsKey = ProductId | "both";

export interface SavingsFigure {
  /** As printed: "40–50%". */
  readonly range: string;
  /** As said: the figure's accessible name. */
  readonly spoken: string;
  /** The line under the figure. */
  readonly caption: string;
}

export const savingsFigures: Readonly<Record<SavingsKey, SavingsFigure>> = {
  coral: { range: "40–50%", spoken: "40 to 50 percent", caption: "off AKS and EKS cost" },
  amoeba: { range: "50–60%", spoken: "50 to 60 percent", caption: "off block storage cost" },
  both: { range: "20–30%", spoken: "20 to 30 percent", caption: "off your overall cloud cost" },
};

/** The label over the two products' figure: both products, named. */
export const togetherLabel = "Coral and Amoeba together";

/**
 * The fine print beside every set of savings figures: under What we offer's
 * title on home, under the figures on /coral and /amoeba. Kept simple: a line,
 * not an explanation.
 */
export const savingsQualifier = "Estimated ranges, not a promise.";

/**
 * Under the How it works cards on /coral and /amoeba (`how.example`): only what
 * the figures are, since a longer note goes unread.
 */
export const workedExample: Readonly<Record<ProductId, string>> = {
  coral: "Example: Zoorik’s own AKS cluster, not a customer result.",
  amoeba: "Example at Azure list price.",
};
