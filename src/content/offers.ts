import { routes } from "@/config/site";
import { savingsQualifier, togetherLabel, type SavingsKey } from "@/content/savings";

/**
 * What we offer (`#offers`, the home page after the case study band), as the
 * mock draws it.
 *
 * On the left, under the title and the qualifier, the free assessment as a
 * navy card with its way in. On the right, one 0 to 100% scale with a row for
 * each range: its mark, its name and caption, its band, its figure. Each band
 * is a share of the cost its caption names, which the axis says once ("Off
 * the cost it optimizes"), so no row needs a scale of its own.
 *
 * 🔴 THE RANGES ARE NOT HERE. A row names its `SavingsKey`, and the section
 * reads the range, its spoken form, its caption and the band's two ends from
 * `savingsFigures`, so the offers cannot say a different number than /coral
 * and /amoeba. Only the words this section alone prints live in this file.
 */
export interface OfferRow {
  readonly figure: SavingsKey;
  /** The row's name; a product's name in it is kept out of translation. */
  readonly title: string;
}

export const offersContent: {
  readonly title: string;
  /** The fine print under the title. */
  readonly note: string;
  /** The navy card: its label, a word where a range would be, a line, the link. */
  readonly free: {
    readonly label: string;
    /** As printed, set as large as the ranges. */
    readonly word: string;
    readonly line: string;
    readonly cta: { readonly label: string; readonly href: string };
  };
  /** The scale's axis: what every band is a share of, and its ticks in percent. */
  readonly axis: { readonly label: string; readonly ticks: readonly number[] };
  readonly rows: readonly OfferRow[];
} = {
  title: "What we offer",
  note: savingsQualifier,
  free: {
    label: "Free assessment",
    word: "Free",
    line: "Your estimated saving at list price, from one line in your cloud console.",
    cta: { label: "Estimate your saving", href: routes.assessment },
  },
  axis: { label: "Off the cost it optimizes", ticks: [0, 25, 50, 75, 100] },
  rows: [
    { figure: "coral", title: "Coral" },
    { figure: "amoeba", title: "Amoeba" },
    { figure: "both", title: togetherLabel },
  ],
};
