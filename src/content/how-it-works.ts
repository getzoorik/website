import type { ProductId } from "@/content/products";

/**
 * How it works — the words on the cards, three for each product.
 *
 * Every string here is the mock's, verbatim. That matters more in this section
 * than anywhere else on the page, because the copy is not description: the
 * figures are worked examples (Coral's from our own cluster; Amoeba's the
 * one-pager's, at Azure list price), and the marks beside them are drawn to
 * those exact proportions.
 *
 *   Coral   6 nodes, 77 workloads, 22 CPU held, 15.53 requested, 3.09 of real
 *           work, $608.76 a month becoming $194.88, which is 67.99% removed.
 *   Amoeba  four 512 GiB disks holding 1,000 GiB, moved onto one 1,208 GiB pool
 *           (data + 20% + 8 GiB), and $292.88 a month becoming $97.00, which is
 *           66.88% removed.
 *
 * Edit a number here and the picture beside it becomes a lie — so a change to
 * any figure below is a change to the mark's proportion on the same card.
 *
 * 🔴 `description` IS NOT DEAD COPY. The mock removed the prose lede from the
 * face of each card and kept the sentence in `.sr-only`,
 * so a screen reader still gets the claim the picture makes. It renders; it is
 * simply not painted.
 */

/**
 * Which dot the key row prints beside its label, named for the quantity rather
 * than the colour: the mark's own ink (`accent`), the lighter step of it that
 * the bar uses for the middle share (`tint`), the neutral that stands for what
 * is not used (`line`), the green that marks spend leaving (`good`), and the
 * outline that encloses no quantity at all (`ring`).
 */
export type LegendTone = "accent" | "tint" | "line" | "good" | "ring";

/**
 * The mark a card carries. Three claims, three shapes: a COUNT is columns, a
 * SPLIT is one segmented rule, a RATIO of money is a donut.
 *
 * Coral's three are drawn to the proportions the sheet already holds, so they
 * carry no values of their own. Amoeba's use the same three shapes with its own
 * figures, and those are authored here, beside the copy they must agree with:
 *
 *   `columns`  which bank: Coral's two banks of six nodes, or Amoeba's one bank
 *              of four disks, each filled to 48.83% (1,000 of 2,048 GiB);
 *   `rule`     the three segments' shares, as grid tracks;
 *   `donut`    the share of the bill that is kept, which the sheet reads as
 *              `--keep` so both products draw one donut.
 */
export type StepMark =
  | { readonly kind: "columns"; readonly bank: "nodes" | "disks" }
  | { readonly kind: "rule"; readonly split?: string }
  | { readonly kind: "donut"; readonly keep?: string };

/** One row of the key at the foot of a card: dot, label left, figure right.
 *  It is also the text equivalent for the `aria-hidden` graphic above it. */
export interface LegendRow {
  readonly label: string;
  readonly value: string;
  readonly tone: LegendTone;
}

/** The one large light figure that leads the card, and its two captions. */
export interface StepKeyFigure {
  /** Above the figure — what the number is of. */
  readonly caption: string;
  /** The number itself, set at 400 weight and tabular. */
  readonly value: string;
  /** The unit, rendered inside the figure at 0.4em and muted. */
  readonly unit: string;
  /** Below the figure — the quantity it is measured against. */
  readonly sub: string;
}

export interface Step {
  /** The sequence index as it is printed: "01", not 1. `aria-hidden`, because
   *  the ordered reading of the cards comes from their order in the DOM. */
  readonly ordinal: string;
  /** No period: the mocks set every card title as a label. */
  readonly title: string;
  /** One muted line under the title, where a step has a catch the reader must
   *  see before the figure (Amoeba's 02: "Services restart at the switch"). */
  readonly note?: string;
  /** The card's original prose lede, now screen-reader-only. */
  readonly description: string;
  readonly mark: StepMark;
  readonly figure: StepKeyFigure;
  /**
   * ONE row: the figure the step is about (one figure per step).
   * The key used to name every quantity the mark draws; the mocks cut it to the
   * one that is the step's point, and the `description` sentence still gives a
   * screen reader the rest. A one-tuple, so a second row cannot creep back in
   * through a content edit.
   */
  readonly legend: readonly [LegendRow];
}

const amoebaSteps: readonly Step[] = [
  {
    ordinal: "01",
    title: "Onboard a Windows or Linux VM",
    description:
      "You choose the VM and Amoeba installs its agent on it. The worked example has four 512 GiB data disks, 2,048 GiB provisioned, holding 1,000 GiB of data.",
    mark: { kind: "columns", bank: "disks" },
    figure: {
      caption: "Data disks on the VM",
      value: "4",
      unit: "disks",
      /* The figure keeps its unit: a no-break space, as the mock writes it. */
      sub: "2,048 GiB provisioned",
    },
    legend: [{ label: "Data stored", value: "1,000 GiB", tone: "accent" }],
  },
  {
    ordinal: "02",
    title: "Move onto one pool",
    note: "Services restart at the switch",
    description:
      "The data mounts move onto one elastic pool sized to the data plus 20 percent, and the systemd services using those mounts are restarted. 1,000 GiB of data on a 1,208 GiB pool releases 840 GiB.",
    mark: { kind: "rule", split: "48.83fr 10.16fr 41.02fr" },
    figure: {
      caption: "Moved onto one pool",
      value: "1,208",
      unit: "GiB",
      sub: "data + 20% + 8 GiB",
    },
    legend: [{ label: "Released", value: "840 GiB", tone: "line" }],
  },
  {
    ordinal: "03",
    title: "Resize online",
    description:
      "The pool expands and shrinks online, without unmounting. At Azure list price in East US the worked example goes from $292.88 a month to $97.00, 66.88 percent less.",
    mark: { kind: "donut", keep: "33.12%" },
    figure: {
      caption: "Bill at list price",
      value: "$97.00",
      unit: "/mo",
      sub: "down from $292.88 /mo",
    },
    legend: [{ label: "Removed", value: "66.88%", tone: "good" }],
  },
];

const coralSteps: readonly Step[] = [
  {
    ordinal: "01",
    title: "Connect a cluster",
    description:
      "Connect the cluster with one command. Coral reads six nodes and seventy-seven workloads, with no code changes.",
    mark: { kind: "columns", bank: "nodes" },
    figure: {
      caption: "Read from the cluster",
      value: "6",
      unit: "nodes",
      sub: "77 workloads across them",
    },
    legend: [{ label: "Code changes", value: "none", tone: "ring" }],
  },
  {
    ordinal: "02",
    title: "See the waste",
    description:
      "Every node, workload and volume, priced. The gap between what you hold and what runs: 22 CPU held, and 3.09 CPU carrying the real work.",
    mark: { kind: "rule" },
    figure: {
      caption: "Carrying the real work",
      value: "3.09",
      unit: "CPU",
      sub: "of 22 CPU held",
    },
    legend: [{ label: "Requested", value: "15.53 CPU", tone: "tint" }],
  },
  {
    ordinal: "03",
    title: "Optimize",
    description:
      "Capacity moves to match demand and keeps moving. In this cluster $608.76 a month on 22 CPU becomes $194.88 on 16.",
    mark: { kind: "donut" },
    figure: {
      caption: "Bill at the optimum",
      value: "$194.88",
      unit: "/mo",
      sub: "down from $608.76 /mo",
    },
    legend: [{ label: "Removed", value: "67.99%", tone: "good" }],
  },
];

/** One set of three cards per product. Amoeba is the tab that opens selected. */
export const howItWorksSteps: Readonly<Record<ProductId, readonly Step[]>> = {
  amoeba: amoebaSteps,
  coral: coralSteps,
};
