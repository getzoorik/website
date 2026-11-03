import { routes } from "@/config/site";
import type { DocumentId } from "@/content/documents";
import { platformLabel, products, type ProductId } from "@/content/products";

/**
 * Case studies: the hub (`/value-lab`) and the two studies (`/coral-value-lab`, `/amoeba-value-lab`). Every figure
 * is the run's own; the words were rewritten plain on 2 Nov 2026. The Coral study is the published PDF on the web:
 * its six numbered sections, its figures, its drawings in the site's figure style, and the PDF itself to download.
 *
 * 🔴 NOTHING THAT NAMES THE CLUSTER. The study names no cluster, node, pool or
 * resource, no ID, version, machine-type code, region or app; apps stay
 * generic ("Backend service A"), as in the PDF. Every figure is as the run
 * recorded it, at Azure pay-as-you-go list prices, 730 hours a month.
 *
 * Each study is a line in the footer's Resources column, after Research
 * papers ("Coral Value Lab", "Amoeba Value Lab"); the hub has none, and
 * /learn's More from Zoorik and the sitemap lead to it. The header has none.
 *
 * Product names are written plainly; the pages keep each one out of
 * translation (`named()`) wherever the mocks mark it, and leave it alone where
 * they do not (the section names, the chips, the step titles, the machines'
 * summary line). The minus signs (U+2212), the arrows, the curly apostrophes
 * and the no-break space between a figure and its unit ("10 minutes") are
 * the mocks' own.
 */

/** A run of text: one string, or pieces where a piece may be bold. */
export type CaseStudyText = string | readonly (string | { readonly b: string })[];

/** The study's six sections, numbered as the PDF numbers them; their ids are the page's addresses. */
export type CaseStudySectionId =
  | "the-starting-point"
  | "connecting-coral"
  | "what-coral-did"
  | "how-the-apps-came-through"
  | "how-the-apps-stayed-safe"
  | "the-result";

/** The PDF's own marks: one stroke icon each for the features, the steps, the safety cards and the download. */
export type CaseStudyIcon = "node" | "wl" | "rb" | "safe" | "doc";

/** One machine card: its badge, its name, what it is for, its CPU as squares and its monthly price. */
export interface CaseStudyMachine {
  readonly badge: string;
  readonly name: string;
  readonly kind?: string;
  readonly cpu: number;
  readonly price: string;
  /** The card's tone: kept, the old worker, removed, or the new one. */
  readonly tone: "keep" | "old" | "gone" | "new";
  readonly note?: string;
}

/** One column of the cost steps: a bar on the connected bill's scale. */
export interface CaseStudyCostStep {
  readonly kind: "start" | "drop" | "end";
  /** Where the bar starts, in dollars a month: 0 for a bar that stands on the axis. */
  readonly from: number;
  readonly amount: number;
  readonly label: string;
  readonly name: string;
  readonly date: string;
}

/** One resource in "what the apps reserve": before and now, on one bar scale. */
export interface CaseStudyReserve {
  readonly name: string;
  readonly less: string;
  readonly before: { readonly value: number; readonly label: string };
  readonly now: { readonly value: number; readonly label: string };
}

/** One step of "What Coral did": its mark, its title and date, its text, its picture and what it saved. */
export interface CaseStudyStep {
  readonly id: string;
  readonly icon: CaseStudyIcon;
  readonly title: string;
  readonly date: string;
  readonly text: CaseStudyText;
  readonly pill: string;
}

const SYSTEM = "$73.73";
const WORKER = "$147.46";

/**
 * The day the /value-lab hub's content last changed (its h1, deck, cards and Want to be next?, 2 Nov 2026), for the
 * sitemap's `lastmod` only: the page does not print it. Whoever changes the hub's content
 * moves this to that day in the same PR; never the build's date.
 */
export const caseStudiesHubLastUpdated = "3 November 2026";

/**
 * The day each study's content last changed, for the sitemap's `lastmod` only: each page prints the day its result
 * was published (`band.date`), which a later edit does not move. Whoever changes a study's content moves its day here
 * in the same PR; never the build's date.
 */
export const caseStudyLastUpdated = "3 November 2026";
export const amoebaStudyLastUpdated = "3 November 2026";

export const caseStudy = {
  route: routes.caseStudyCoralDevCluster,
  meta: {
    title: "How we reduced our AKS machine cost by 58%",
    description:
      "AKS cost reduction case study: eight days after we connected Coral, our development cluster’s machines cost $154.76 a month instead of $368.65.",
  },
  hero: {
    kicker: "Value Lab · Coral on Azure Kubernetes Service · October 2026",
    /** The h1, its second half on a line of its own in the good green. */
    title: "How we reduced our own AKS cluster’s",
    titleGreen: "machine cost by 58%",
    deck: [
      "Eight days after we connected Coral to our development cluster, its machines cost ",
      { b: "$154.76 a month instead of $368.65" },
      ".",
    ] satisfies CaseStudyText,
    /** The download block's one row. */
    download: "Download the PDF",
  },
  /** The PDF, offered in the hero and at the end (`documents.ts`). */
  document: "coral-case-study" as DocumentId,
  /** The result, under the hero: the date and who publishes it, the four figures in one line, what Coral is. */
  band: {
    label: "The result",
    date: "12 October 2026",
    by: " · Published by ",
    publisher: { text: "Zoorik", href: routes.about },
    stats: [
      { value: "−58%", label: "machine cost", good: true },
      { value: "$213.89", label: "saved a month, about $2,567 a year", good: true },
      { value: "10 → 6", label: "CPU, on 2 machines instead of 3", good: false },
      { value: "8 days", label: "after connecting Coral", good: false },
    ],
    about: [
      { b: "Coral" },
      " is Zoorik’s Kubernetes cost optimization for AKS and EKS. It rebalances CPU and memory requests to real use, removes machines a cluster no longer needs, and moves apps onto cheaper machines.",
    ] satisfies CaseStudyText,
  },
  /** The section names, in the left column and the chips: plain text. Their ids stay the page's addresses. */
  sections: [
    { id: "the-starting-point", title: "Starting point" },
    { id: "connecting-coral", title: "Connecting Coral" },
    { id: "what-coral-did", title: "What Coral did" },
    { id: "how-the-apps-came-through", title: "Effect on the apps" },
    { id: "how-the-apps-stayed-safe", title: "Safeguards" },
    { id: "the-result", title: "Result" },
  ] satisfies readonly { id: CaseStudySectionId; title: string }[],
  start: {
    text: "Our development cluster runs Coral’s API, our consoles and our deployment tooling. It had three machines: the system machine AKS requires, and two workers for the apps. It was sized for safety, not for what the apps used.",
    machines: [
      {
        badge: "Stays",
        name: "System machine",
        kind: "Azure requires it",
        cpu: 2,
        price: SYSTEM,
        tone: "keep",
        note: "2 CPU",
      },
      {
        badge: "Worker",
        name: "Worker",
        kind: "for the apps",
        cpu: 4,
        price: WORKER,
        tone: "old",
        note: "4 CPU",
      },
      {
        badge: "Worker",
        name: "Worker",
        kind: "for the apps",
        cpu: 4,
        price: WORKER,
        tone: "old",
        note: "4 CPU",
      },
    ] satisfies readonly CaseStudyMachine[] as readonly CaseStudyMachine[],
    /** The line under the machines, its two halves at either end. */
    when: "On 4 October 2026, when Coral was connected",
    total: "3 machines · 10 CPU · $368.65 a month",
  },
  connect: {
    text: [
      "One ",
      { b: "zoorikctl" },
      " command installed Coral’s agent in the cluster. Two days later we let Coral remove machines, in this cluster only.",
    ] satisfies CaseStudyText,
    features: [
      {
        icon: "wl",
        title: "Workload optimization",
        text: "Sets each app’s CPU and memory requests to what it uses, and raises them when an app needs more.",
      },
      {
        icon: "node",
        title: "Node optimization",
        text: "Finds a machine the apps no longer need, moves the apps off it and removes it.",
      },
      {
        icon: "rb",
        title: "Rebalancing",
        text: "Swaps machines for a cheaper set that still fits every app, new machine first.",
      },
    ] satisfies readonly { icon: CaseStudyIcon; title: string; text: string }[],
  },
  /** "What Coral did": three steps, each its head, its text, its picture and a pill. */
  did: {
    node: {
      id: "node-optimization",
      icon: "node",
      title: "Node optimization: one worker removed",
      date: "6 Oct",
      text: [
        "Coral found that the apps fit on fewer machines. It moved them off one 4-CPU worker and removed it, ",
        { b: "on its own, in under 10 minutes" },
        ". Apps that run a single copy restarted once on another machine.",
      ],
      pill: "−$147.46 a month",
    } satisfies CaseStudyStep,
    nodeMachines: [
      { badge: "Stays", name: "System machine", cpu: 2, price: SYSTEM, tone: "keep" },
      { badge: "Stays", name: "Worker", cpu: 4, price: WORKER, tone: "old" },
      {
        badge: "Removed",
        name: "Worker",
        cpu: 4,
        price: WORKER,
        tone: "gone",
        note: "−$147.46 a month",
      },
    ] satisfies readonly CaseStudyMachine[] as readonly CaseStudyMachine[],
    workload: {
      id: "workload-optimization",
      icon: "wl",
      title: "Workload optimization: apps resized",
      date: "from 8 Oct",
      text: [
        "We switched workload optimization to automatic. By 12 October Coral had resized ",
        { b: "14 of the cluster’s apps" },
        ". Most reserved more than they used. One needed more memory, and Coral gave it more.",
      ],
      pill: "Less reserved, more room per machine",
    } satisfies CaseStudyStep,
    reserve: {
      alt: "What the apps reserve: CPU 0.78 cores before and 0.43 cores now, 45% less; memory 6.4 GiB before and 5.4 GiB now, 16% less.",
      before: "Before",
      now: "Now",
      resources: [
        {
          name: "CPU the apps reserve",
          less: "45% less",
          before: { value: 0.78, label: "0.78 cores" },
          now: { value: 0.43, label: "0.43 cores" },
        },
        {
          name: "Memory the apps reserve",
          less: "16% less",
          before: { value: 6.4, label: "6.4 GiB" },
          now: { value: 5.4, label: "5.4 GiB" },
        },
      ] satisfies readonly CaseStudyReserve[] as readonly CaseStudyReserve[],
    },
    rebalance: {
      id: "rebalancing",
      icon: "rb",
      title: "Rebalancing: a cheaper worker",
      date: "12 Oct",
      text: [
        "With one click, Coral swapped the remaining worker for a ",
        { b: "cheaper machine of the same size" },
        ", chosen from Azure’s prices. Azure built the new machine in under 2 minutes. Coral moved the apps one copy at a time, then removed the old machine: ",
        { b: "8 minutes 36 seconds" },
        " from start to finish.",
      ],
      pill: "−$66.43 a month",
    } satisfies CaseStudyStep,
    swap: {
      before: {
        badge: "Before",
        name: "Worker",
        kind: "4 CPU, Intel",
        cpu: 4,
        price: WORKER,
        tone: "old",
      } satisfies CaseStudyMachine as CaseStudyMachine,
      after: {
        badge: "After",
        name: "New worker",
        kind: "4 CPU, AMD, same size",
        cpu: 4,
        price: "$81.03",
        tone: "new",
      } satisfies CaseStudyMachine as CaseStudyMachine,
    },
  },
  through: {
    text: "During the rebalance on 12 October, we timed each app from the moment its old copy stopped to the moment its new copy was ready.",
    caption: "Single-copy apps: each restarted once",
    unit: "seconds until back up",
    /** Each single-copy app's seconds until it was back up, longest first. The bars run to 78% at the longest. */
    apps: [
      { name: "Backend service A", seconds: 82 },
      { name: "Backend service B", seconds: 78 },
      { name: "Deployment tool, part 1", seconds: 54 },
      { name: "Deployment tool, part 2", seconds: 30 },
      { name: "Deployment tool, part 3", seconds: 29 },
      { name: "Deployment tool, part 4", seconds: 18 },
      { name: "Deployment tool, part 5", seconds: 18 },
      { name: "Cache A", seconds: 17 },
      { name: "Cache B", seconds: 16 },
      { name: "Cache C", seconds: 16 },
      { name: "Certificate sync", seconds: 5 },
    ],
    twoCopies: [
      { b: "0 seconds" },
      " for the 6 apps that run two copies, including Coral’s API and both our consoles. One copy kept running while the other moved.",
    ] satisfies CaseStudyText,
    /* Why the single-copy apps restarted on this cluster that day: none qualified for a warm handover (Argo CD sets
       their replica counts; the rest are StatefulSets or use Recreate). Never say it as a general rule. */
    means: [
      { b: "Why they restarted:" },
      " none of these apps could take Coral’s warm handover, which starts a new copy on another machine before the old one stops. Our GitOps tool owns their copy counts, or they are StatefulSets or use the Recreate strategy. They also restarted once when the spare worker was removed on 6 October; those times were not measured.",
    ] satisfies CaseStudyText,
  },
  safe: [
    {
      title: "New machine first",
      text: "In the rebalance, the old worker went only after the new one was ready and the apps had moved.",
    },
    {
      title: "One copy at a time",
      text: "Coral moved one copy of each app at a time, so apps with two copies always kept one running.",
    },
    {
      title: "Disruption budgets",
      text: "Coral never moves an app past its PodDisruptionBudget, and keeps any machine it cannot empty safely.",
    },
  ],
  result: {
    costs: {
      caption: "What the cluster’s machines cost each month",
      unit: "Azure list prices",
      alt: "What the cluster’s machines cost each month: $368.65 when Coral was connected on 4 Oct; minus $147.46 from node optimization on 6 Oct; minus $66.43 from rebalancing on 12 Oct; $154.76 today, 12 Oct.",
      /** The scale's top: the bill when Coral was connected. */
      top: 368.65,
      steps: [
        {
          kind: "start",
          from: 0,
          amount: 368.65,
          label: "$368.65",
          name: "Connected",
          date: "4 Oct",
        },
        {
          kind: "drop",
          from: 221.19,
          amount: 147.46,
          label: "−$147.46",
          name: "Node optimization",
          date: "6 Oct",
        },
        {
          kind: "drop",
          from: 154.76,
          amount: 66.43,
          label: "−$66.43",
          name: "Rebalancing",
          date: "12 Oct",
        },
        { kind: "end", from: 0, amount: 154.76, label: "$154.76", name: "Today", date: "12 Oct" },
      ] satisfies readonly CaseStudyCostStep[] as readonly CaseStudyCostStep[],
    },
    table: {
      caption: "Before and after",
      /** The rows' column, named for a screen reader only. */
      measure: "Measure",
      columns: ["4 Oct", "12 Oct", "Difference"],
      rows: [
        ["Machines", "3", "2", "1 fewer"],
        ["CPU", "10", "6", "4 fewer"],
        ["Per month", "$368.65", "$154.76", "$213.89 less"],
        ["Per year", "$4,423.80", "$1,857.12", "$2,566.68 less"],
      ],
    },
    share: {
      caption: "Share of the machine cost removed",
      alt: "58% less",
      value: "58%",
      word: "less",
      /** The ring's green arc: what was removed of the connected bill. */
      removed: 213.89,
      of: 368.65,
      line: "$213.89 of $368.65 a month",
    },
  },
  /** The card at the end of The result: the PDF, the whole card one link. The page, like the
      PDF, has no "What's next". */
  end: {
    title: "How we reduced our own AKS cluster’s machine cost by 58%",
    kind: "Value Lab · PDF · ",
    go: "Download",
  },
  fine: "Zoorik’s own development cluster on Azure Kubernetes Service, 4 to 12 October 2026. Costs are Azure pay-as-you-go list prices for its machines, at 730 hours a month. App figures cover the cluster’s own apps. Results depend on each cluster’s apps and machines.",
} as const;

/* ─── The second study: Amoeba on our own Azure lab VMs ───────────────────── */

/**
 * One disk card, the Coral study's machine card drawn in GiB: its badge, its name, what it is, its disks as runs of
 * squares (one square per 8 GiB, a run per disk), its size where the price goes, and a note.
 */
export interface CaseStudyDiskCard {
  readonly badge: string;
  readonly name: string;
  readonly kind?: string;
  /** Each disk's size in GiB, one run of squares each; none draws no squares (the pool the folders moved to). */
  readonly disks: readonly number[];
  /** The size, in the price's place ("96 GiB"); none draws none. */
  readonly size?: string;
  readonly tone: "keep" | "old" | "gone" | "new";
  readonly note?: string;
}

/** One cell of a study's table: its words, and the good green or the muted grey. */
export interface CaseStudyCell {
  readonly text: string;
  readonly tone?: "good" | "muted";
}

/** One stage of "What the test app felt": its name, the time 99 in 100 writes took, and the slowest, in ms. */
export interface CaseStudyStage {
  readonly name: string;
  readonly p99: number;
  readonly slowest: number;
}

/** The Amoeba study's six sections, numbered as the Coral study's are; their ids are the page's addresses. */
export type AmoebaStudySectionId =
  | "the-starting-point"
  | "connecting-amoeba"
  | "what-amoeba-did"
  | "how-the-apps-and-data-came-through"
  | "how-they-stayed-safe"
  | "the-result";

/** One square of a disk run stands for this many GiB (the draft's F1). */
export const GIB_PER_SQUARE = 8;

/**
 * `/amoeba-value-lab`: Amoeba on two of our own lab VMs on Azure, 19 October 2026. Every figure is the run's own, as
 * traced in the study's draft and its ledger; the words were rewritten plain on 2 Nov 2026.
 *
 * 🔴 NOTHING THAT NAMES A VM. The study names no VM, disk, resource, ID, subscription, region, size code, version or
 * time of day: the VMs are "Lab VM A" and "Lab VM B", the folders "folders". No PDF, and no link to any internal
 * document. Money is Amoeba's own figure at Azure list prices.
 */
export const amoebaStudy = {
  route: routes.caseStudyAmoebaLabVms,
  meta: {
    title: "How Amoeba rightsized our btrfs pool by 25%",
    description:
      "Amoeba case study: on our own Azure lab VM, a btrfs pool went from 96 GiB to 72 GiB while it stayed mounted, with 0 app errors.",
  },
  hero: {
    kicker: "Value Lab · Amoeba on Azure VMs · October 2026",
    /** The h1, its second half on a line of its own in the good green. */
    title: "How Amoeba rightsized our own lab VM’s",
    titleGreen: "btrfs pool by 25%",
    deck: [
      "On an Azure lab VM, Amoeba shrank the pool from ",
      { b: "96 GiB to 72 GiB" },
      " while it stayed mounted. Our test app logged 0 errors.",
    ] satisfies CaseStudyText,
  },
  /** The result, under the hero: the date and who publishes it, the four figures in one line, what Amoeba is. */
  band: {
    label: "The result",
    date: "19 October 2026",
    by: " · Published by ",
    publisher: { text: "Zoorik", href: routes.about },
    stats: [
      { value: "−25%", label: "pool size on Lab VM A", good: true },
      { value: "96 → 72 GiB", label: "holding the same 60.07 GiB of data", good: false },
      { value: "0", label: "lost mounts or test app errors", good: true },
      { value: "8 min 14 s", label: "from our click to the smaller pool", good: false },
    ],
    about: [
      { b: "Amoeba" },
      " is Zoorik’s block storage optimization for Windows and Linux VMs on Azure and AWS. It moves a VM’s data disks onto one btrfs pool sized to the data, with room to grow. Then it rightsizes the pool as the data changes, without any downtime.",
    ] satisfies CaseStudyText,
  },
  sections: [
    { id: "the-starting-point", title: "Starting point" },
    { id: "connecting-amoeba", title: "Connecting Amoeba" },
    { id: "what-amoeba-did", title: "What Amoeba did" },
    { id: "how-the-apps-and-data-came-through", title: "Effect on the apps and data" },
    { id: "how-they-stayed-safe", title: "Safeguards" },
    { id: "the-result", title: "Result" },
  ] satisfies readonly { id: AmoebaStudySectionId; title: string }[],
  start: {
    text: "This study follows two of our own lab VMs on Azure on 19 October 2026. On each, a test app of ours keeps writing to the data folders.",
    label:
      "Lab VM A: a btrfs pool of 64 and 32 GiB disks, 96 GiB, holding 60.07 GiB, on Manual. Lab VM B: new, two 32 GiB disks, about 10 GiB of data on each.",
    vms: [
      {
        badge: "Manual",
        name: "Lab VM A",
        kind: "Data on a btrfs pool",
        disks: [64, 32],
        size: "96 GiB",
        tone: "keep",
        note: "60.07 GiB of data",
      },
      {
        badge: "New",
        name: "Lab VM B",
        kind: "Two disks, not yet onboarded",
        disks: [32, 32],
        size: "64 GiB",
        tone: "old",
        note: "About 10 GiB of data on each disk",
      },
    ] satisfies readonly CaseStudyDiskCard[] as readonly CaseStudyDiskCard[],
    /** The line under the VMs, its two halves at either end. */
    when: "On 19 October 2026, as each VM’s step began",
    total: "2 lab VMs on Azure · 1 on a btrfs pool, 1 new",
  },
  connect: {
    text: [
      "One click in the Amoeba console onboarded the new Lab VM B. Amoeba installed its agent on the VM by itself, and the agent was running in under a minute and a half. Amoeba then watched the VM’s data and started the move on its own.",
      "Lab VM A was onboarded before 19 October.",
    ],
    features: [
      {
        icon: "rb",
        title: "Move onto a pool",
        text: "Copies a VM’s data onto one btrfs pool while its apps run, then switches each folder to the pool.",
      },
      {
        icon: "node",
        title: "Shrink, one disk at a time",
        text: "When the data goes down, moves it off one disk, then removes that disk. The pool stays mounted.",
      },
      {
        icon: "wl",
        title: "Auto or Manual",
        text: "Per VM, shrinks start on their own or wait for your click.",
      },
    ] satisfies readonly { icon: CaseStudyIcon; title: string; text: string }[],
  },
  /** "What Amoeba did": two steps, each its head, its text, its picture and a pill. */
  did: {
    move: {
      id: "move-onto-a-pool",
      icon: "rb",
      title: "Move onto a pool",
      date: "19 Oct",
      text: [
        "On Lab VM B, Amoeba built a btrfs pool beside the two source disks. It copied both folders while our test app kept writing, then copied what had changed and switched both folders to the pool. ",
        { b: "No write failed" },
        " at the switch, and writing never paused for more than 1.5 seconds. Amoeba then took a safety snapshot of each source disk and deleted the disk.",
      ],
      pill: "2 folders moved · 0 failed writes at the switch",
    } satisfies CaseStudyStep,
    swap: {
      label:
        "Lab VM B: both folders moved from two 32 GiB source disks onto a btrfs pool; each source disk was snapshotted, then deleted.",
      before: {
        badge: "Before",
        name: "Source disks",
        kind: "2 × 32 GiB, both folders",
        disks: [32, 32],
        tone: "old",
      } satisfies CaseStudyDiskCard as CaseStudyDiskCard,
      after: {
        badge: "After",
        name: "btrfs pool",
        kind: "both folders",
        disks: [],
        tone: "new",
        note: "Source disks: a safety snapshot each, then deleted",
      } satisfies CaseStudyDiskCard as CaseStudyDiskCard,
    },
    shrink: {
      id: "shrink-on-a-click",
      icon: "node",
      title: "Shrink on our click",
      date: "19 Oct",
      text: [
        "Lab VM A is set to Manual, so its shrinks wait for us. First, Amoeba packed the pool’s data more tightly, freeing 5.00 GiB inside the pool at no extra cost. Then it planned a shrink and waited for our click. It added an 8 GiB disk, moved 16.06 GiB off the 32 GiB disk in 2 minutes 55 seconds, then removed and deleted that disk. ",
        { b: "8 minutes 14 seconds" },
        " from our click to done.",
      ],
      pill: "−24 GiB of disk",
    } satisfies CaseStudyStep,
    /** The shrink's disks: each card is named by its badge, the disk's size in the price's place. */
    shrinkDisks: {
      label:
        "Lab VM A: the 64 GiB disk stays. The 32 GiB disk is removed after 16.06 GiB moved off it. An 8 GiB disk is added. 96 GiB becomes 72 GiB.",
      disks: [
        { badge: "Stays", name: "Disk", disks: [64], size: "64 GiB", tone: "keep" },
        {
          badge: "Removed",
          name: "Disk",
          disks: [32],
          size: "32 GiB",
          tone: "gone",
          note: "16.06 GiB moved off",
        },
        { badge: "Added", name: "Disk", disks: [8], size: "8 GiB", tone: "new" },
      ] satisfies readonly CaseStudyDiskCard[] as readonly CaseStudyDiskCard[],
    },
  },
  through: {
    text: "The move is the big step for an app: its folders switch from the source disks to the pool. On Lab VM B, our test app wrote to both folders every second. A write counted only once it was saved to disk.",
    felt: {
      caption: "Write times on Lab VM B",
      unit: "milliseconds: 99 in 100 writes, and the slowest",
      alt: "Write times on Lab VM B, in milliseconds, for 99 in 100 writes and for the slowest write: Before the move, 18 and 198; Copying folder 1, 26 and 270; Copying folder 2, with our 1.5 GiB burst, 28 and 2,420; Last copy and switch, 20 and 68.",
      /** Each stage's bar is the time 99 in 100 writes took, the longest at 78% of the row; the slowest write after it. */
      stages: [
        { name: "Before the move", p99: 18, slowest: 198 },
        { name: "Copying folder 1", p99: 26, slowest: 270 },
        { name: "Copying folder 2, with our 1.5 GiB burst", p99: 28, slowest: 2420 },
        { name: "Last copy and switch", p99: 20, slowest: 68 },
      ] satisfies readonly CaseStudyStage[] as readonly CaseStudyStage[],
      up: "At the switch: 0 failed writes, no pause over 1.5 seconds and 0 lost mounts.",
    },
    checked: {
      caption: "What we checked",
      /** The rows' column, named for a screen reader only. */
      measure: "Check",
      columns: ["Lab VM A", "Lab VM B, through the move"],
      rows: [
        {
          name: "Test app",
          cells: [
            { text: "0 errors", tone: "good" },
            { text: "No write failed", tone: "good" },
          ],
        },
        {
          name: "Folders mounted",
          cells: [
            {
              text: "5,677 of 5,677 checks before the shrink, and 118 of 118 during it",
              tone: "good",
            },
            { text: "Every check", tone: "good" },
          ],
        },
        {
          name: "Checksums matched",
          cells: [
            { text: "not checked", tone: "muted" },
            { text: "Every test file, before and after the switch", tone: "good" },
          ],
        },
      ] satisfies readonly { name: string; cells: readonly CaseStudyCell[] }[],
    },
    means: [
      { b: "What this means:" },
      " through the move, 99 in 100 writes took 28 ms or less. The slowest, 2,420 ms, came during our own 1.5 GiB burst. In every other stage, no write took over 270 ms. A service that keeps its data open, like a database, gets a short restart at the switch. Our test app was not restarted. Lab VM A’s test app records no timings, so its speed during the shrink was not measured.",
    ] satisfies CaseStudyText,
  },
  safe: [
    {
      title: "Snapshot first",
      text: "After the move, Amoeba took a safety snapshot of each source disk before deleting it.",
    },
    {
      title: "Data off first",
      text: "The 32 GiB disk left the pool only after its 16.06 GiB of data moved to the other disks. The folders stayed mounted.",
    },
    {
      title: "Manual waits for you",
      text: "On Manual, Amoeba planned Lab VM A’s shrink, then waited for our click before it changed any disk.",
    },
  ],
  result: {
    pool: {
      caption: "Lab VM A’s btrfs pool",
      unit: "GiB",
      alt: "Lab VM A’s btrfs pool: 96 GiB before; minus 24 GiB from the shrink on 19 Oct; 72 GiB after.",
      /** The scale's top: the pool before the shrink. */
      top: 96,
      steps: [
        { kind: "start", from: 0, amount: 96, label: "96 GiB", name: "Before", date: "19 Oct" },
        {
          kind: "drop",
          from: 72,
          amount: 24,
          label: "−24 GiB",
          name: "The shrink",
          date: "19 Oct",
        },
        { kind: "end", from: 0, amount: 72, label: "72 GiB", name: "After", date: "19 Oct" },
      ] satisfies readonly CaseStudyCostStep[] as readonly CaseStudyCostStep[],
    },
    table: {
      caption: "Before and after",
      columns: ["Lab VM", "Before", "After", "Difference", "Each month"],
      rows: [
        {
          name: "Lab VM A, Manual",
          cells: [
            { text: "96 GiB" },
            { text: "72 GiB" },
            { text: "24 GiB less", tone: "good" },
            { text: "$3.60 less", tone: "good" },
          ],
        },
      ] satisfies readonly { name: string; cells: readonly CaseStudyCell[] }[],
      /** Under the table: where the money figure comes from. */
      cap: "Each month: Amoeba’s own figure, at Azure list prices.",
    },
    share: {
      caption: "Share of Lab VM A’s pool removed",
      alt: "25% less",
      value: "25%",
      word: "less",
      /** The ring's green arc: what the shrink removed of the pool before it. */
      removed: 24,
      of: 96,
      line: "24 of 96 GiB, holding the same 60.07 GiB of data",
    },
  },
  fine: "Zoorik’s own lab VMs on Azure, on 19 October 2026. The figures show Amoeba as it ran that day. Each VM ran Linux and a test app of ours, not a customer’s workload. In the lab, Amoeba read a shorter history of each VM’s data than it does for a customer. So its timing differed, and it sized each pool more tightly. A pool’s size is the total of its disks. Results depend on each VM’s data.",
} as const;

/** One figure on a study card's cover: the value its bar is drawn to, and how it is printed. */
export interface CaseStudyCoverFigure {
  readonly value: number;
  readonly label: string;
}

/**
 * One study: what the hub and /learn's "On a real cluster" card read about it.
 * Every figure is the study's own, read from its content above, never typed
 * twice.
 */
export interface CaseStudyCard {
  /** Its product. */
  readonly product: ProductId;
  readonly href: string;
  /** Its PDF, the site's one entry for it (`documents.ts`); a study without one offers none. */
  readonly document?: DocumentId;
  /** Product, cloud and month, in the mock's code face. */
  readonly kicker: string;
  readonly title: string;
  readonly line: string;
  readonly tags: readonly string[];
  /** The cover: the big figure, the bill before and after (one bar each, on the bill before's scale), the caption. */
  readonly figure: string;
  readonly before: CaseStudyCoverFigure;
  readonly after: CaseStudyCoverFigure;
  readonly cap: string;
}

const coralCosts = caseStudy.result.costs;
const coralConnected = coralCosts.steps[0]!;
const coralToday = coralCosts.steps[coralCosts.steps.length - 1]!;
/** The month the study was published, from its date ("12 October 2026" → "October 2026"). */
const coralMonth = caseStudy.band.date.replace(/^\d+ /, "");
/** What the study is, the first part of its own kicker: "Value Lab". */
const coralLabel = caseStudy.hero.kicker.split(" · ")[0]!;

/** The yearly figure as the hub prints it, to the dollar: $213.89 a month is "$2,567". */
const perYear = (monthly: number): string => `$${Math.round(monthly * 12).toLocaleString("en-US")}`;

/** A study's day as the hub's "As of" prints it: "12 October 2026" → "12 Oct 2026". */
const shortDay = (day: string): string => day.replace(/ (\w{3})\w* /, " $1 ");

/**
 * Value Lab, the hub: what the studies saved so far, the two studies' cards, "Want to be next?" under them, then the
 * closing row. Every figure is the studies' own, read from their content above, never typed twice. The hub draws no
 * client studies until the first one exists; a new study is one more entry in `studies`.
 */
const studies = [
  {
    product: "coral",
    href: caseStudy.route,
    document: caseStudy.document,
    /* "Value Lab · Coral on AKS · October 2026". */
    kicker: [coralLabel, `${products.coral.name} on ${platformLabel.aks}`, coralMonth].join(" · "),
    title: caseStudy.end.title,
    /* "eight days" is the study's own "8 days" (`band.stats[3]`), in words as its prose says it. */
    line: `Our own development cluster: ${coralToday.label} a month instead of ${coralConnected.label}, eight days after we connected Coral.`,
    /* The three features the study shows Coral using, by their own titles. */
    tags: caseStudy.connect.features.map((feature) => feature.title),
    figure: caseStudy.band.stats[0].value,
    before: { value: coralConnected.amount, label: coralConnected.label },
    after: { value: coralToday.amount, label: coralToday.label },
    cap: "machine cost a month, before and after",
  },
] satisfies readonly CaseStudyCard[] as readonly CaseStudyCard[];

/** What every study saved each month, at list prices: each bill before less each bill after. */
const savedMonthly = studies.reduce(
  (sum, study) => sum + study.before.value - study.after.value,
  0,
);

/** A study's card on the hub's band: its flag, the mark, its name and line, its two bars on one scale, its link. */
export interface ValueLabCard {
  readonly flag: string;
  readonly title: string;
  readonly line: string;
  readonly before: CaseStudyCoverFigure & { readonly name: string };
  readonly after: CaseStudyCoverFigure & { readonly name: string };
  /** Under the bars: what they measure ("a month", "btrfs pool"). */
  readonly per: string;
  readonly href: string;
  /** Its way in, by the study's own name: "Read the Coral Value Lab study". */
  readonly read: string;
}

const amoebaPool = amoebaStudy.result.pool;
const amoebaBefore = amoebaPool.steps[0]!;
const amoebaAfter = amoebaPool.steps[amoebaPool.steps.length - 1]!;

export const caseStudiesHub = {
  route: routes.valueLab,
  /** The `<title>`'s own words, before " | Zoorik", and the description. */
  meta: {
    title: "Value Lab",
    description:
      "Coral and Amoeba case studies from our own AKS cluster and Azure lab VMs: what each reduced, with every figure at list prices.",
  },
  hero: {
    title: "Value Lab",
    deck: "Coral and Amoeba case studies from our own AKS cluster and Azure lab VMs, every figure at list prices.",
  },
  /** Beside the hero's words: what the studies saved so far, as of the newest study's day. */
  total: {
    label: "Saved so far",
    /* The newest study's day: "12 October 2026", printed "As of 12 Oct 2026". */
    asOf: caseStudy.band.date,
    asOfLabel: `As of ${shortDay(caseStudy.band.date)}`,
    amount: savedMonthly,
    unit: "a month",
    line: `About ${perYear(savedMonthly)} a year, from the ${products.coral.name} study at Azure list prices.`,
  },
  studies,
  /** The band, named for a screen reader: the studies' cards and "Want to be next?". */
  label: "Value Lab studies",
  /**
   * The studies' cards, side by side on the band, each flagged by what it optimizes: our own cluster, its machine cost
   * before and with Coral on one scale; then our own lab VM, its btrfs pool before and with Amoeba. "Want to be next?"
   * takes its own row under the pair. Only the Coral study counts towards "Saved so far", as the mock draws it.
   */
  cards: [
    {
      flag: "Kubernetes",
      title: "Our own AKS cluster",
      /* "58%" is the study's own "−58%" (`band.stats[0]`); "eight days" its "8 days" (`band.stats[3]`), in words. */
      line: `Coral reduced its machine cost by ${caseStudy.band.stats[0].value.replace("−", "")} in eight days.`,
      before: { ...studies[0]!.before, name: "Before" },
      after: { ...studies[0]!.after, name: "With Coral" },
      per: "a month",
      href: caseStudy.route,
      read: `Read the ${products.coral.name} Value Lab study`,
    },
    {
      flag: "Block storage",
      title: "Our own Azure lab VM",
      /* "25%" is the study's own "−25%" (`band.stats[0]`); "stayed mounted" its "0 lost mounts" (`band.stats[2]`). */
      line: `Amoeba rightsized its btrfs pool by ${amoebaStudy.band.stats[0].value.replace("−", "")} while it stayed mounted.`,
      before: { value: amoebaBefore.amount, label: amoebaBefore.label, name: "Before" },
      after: { value: amoebaAfter.amount, label: amoebaAfter.label, name: "With Amoeba" },
      per: "btrfs pool",
      href: amoebaStudy.route,
      read: `Read the ${products.amoeba.name} Value Lab study`,
    },
  ] satisfies readonly ValueLabCard[] as readonly ValueLabCard[],
  /**
   * The navy card under the pair: how to become the next study, the design partner program. The closing row under
   * it already offers the free assessment, so this card does not repeat it.
   */
  next: {
    title: "Want to be next?",
    body: "Design partners run Coral and Amoeba free on non-production clusters and disks. If you agree, your results become a case study.",
    go: "Become a design partner",
    href: routes.designPartners,
  },
} as const;
