import { routes } from "@/config/site";
import { savingsQualifier, togetherLabel, type SavingsKey } from "@/content/savings";

/**
 * What we offer (`#offers`, the home page after the case study band), as the
 * mock draws it.
 *
 * On the left, under the title and the qualifier, the free assessment as a
 * flat navy card with its way in. On the right, a row for each range, on one
 * line: its mark, its name, its tags, a thin band and its figure. Each band is
 * a share of the cost its caption names, on one 0 to 100% width.
 *
 * 🔴 THE CAPTIONS ARE TAGS ON SCREEN, AND WORDS TO A SCREEN READER (owner, 23
 * Oct 2026: "instead of this we can use tags"). The "Off the cost it optimizes"
 * row and its 0–100% ticks are gone; each row's caption ("off AKS and EKS
 * cost") is read out as before, and on screen the row shows what it is a share
 * of as tags: the clouds' marks with their own names (`tags`).
 *
 * 🔴 THE RANGES ARE NOT HERE. A row names its `SavingsKey`, and the section
 * reads the range, its spoken form, its caption and the band's two ends from
 * `savingsFigures`, so the offers cannot say a different number than /coral
 * and /amoeba. Only the words this section alone prints live in this file.
 */

/** A tag: a cloud's mark (or none) and the word beside it. */
export interface OfferTag {
  readonly cloud?: "azure" | "aws";
  readonly text: string;
}

export interface OfferRow {
  readonly figure: SavingsKey;
  /** The row's name; a product's name in it is kept out of translation. */
  readonly title: string;
  /**
   * What the range is a share of, as the product sections' own tags: Coral's
   * clusters (the mark names the cloud), Amoeba's block storage mirrored, and
   * one word for the whole bill. Drawn only; the caption says it in words.
   */
  readonly tags: readonly OfferTag[];
}

export const offersContent: {
  readonly title: string;
  /** The fine print under the title. */
  readonly note: string;
  /** The flat navy card: its label, a word where a range would be, a line, the link. */
  readonly free: {
    readonly label: string;
    /** As printed, set as large as the ranges. */
    readonly word: string;
    readonly line: string;
    readonly cta: { readonly label: string; readonly href: string };
  };
  readonly rows: readonly OfferRow[];
  /**
   * Under the section, one row of text links to the free tools (owner, 1 Nov 2026): the two calculators, Coral's
   * first as everywhere on the site, then the tools library, each named as the footer names it.
   */
  readonly tools: readonly { readonly label: string; readonly href: string }[];
} = {
  title: "Cloud cost assessment",
  note: savingsQualifier,
  free: {
    label: "Free assessment",
    word: "Free",
    line: "Your estimated saving at list price, from one line in your cloud console.",
    cta: { label: "Estimate your saving", href: routes.assessment },
  },
  rows: [
    {
      figure: "coral",
      title: "Coral",
      tags: [
        { cloud: "azure", text: "AKS" },
        { cloud: "aws", text: "EKS" },
      ],
    },
    {
      figure: "amoeba",
      title: "Amoeba",
      tags: [
        { cloud: "azure", text: "Managed Disks" },
        { cloud: "aws", text: "EBS" },
      ],
    },
    { figure: "both", title: togetherLabel, tags: [{ text: "Overall cloud bill" }] },
  ],
  tools: [
    { label: "EKS and AKS pricing calculator", href: routes.eksAndAksPricingCalculator },
    { label: "EBS and Azure disk pricing", href: routes.ebsAndAzureDiskPricing },
    { label: "Cloud cost optimization tools", href: routes.cloudCostTools },
  ],
};
