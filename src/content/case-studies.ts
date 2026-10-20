import { routes } from "@/config/site";
import type { DocumentId } from "@/content/documents";
import { platformLabel, products, type ProductId } from "@/content/products";

/**
 * Case studies: the hub (`/case-studies`) and the first study
 * (`/case-studies/coral-dev-cluster`), every string and figure verbatim from
 * the mocks. The study is the published PDF on the web: its six numbered
 * sections, its copy and figures word for word, its drawings in the site's
 * figure style, and the PDF itself to download.
 *
 * 🔴 NOTHING THAT NAMES THE CLUSTER. The study names no cluster, node, pool or
 * resource, no ID, version, machine-type code, region or app; apps stay
 * generic ("Backend service A"), as in the PDF. Every figure is as the run
 * recorded it, at Azure pay-as-you-go list prices, 730 hours a month.
 *
 * Its place on the site is one line under Learn in the footer's Resources
 * column; the header has none.
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
 * The day the /case-studies hub's content last changed (the library of study cards and the study's title saying "reduced"), for the sitemap's
 * `lastmod` only: the page does not print it. Whoever changes the hub's content
 * moves this to that day in the same PR; never the build's date.
 */
export const caseStudiesHubLastUpdated = "19 October 2026";

export const caseStudy = {
  route: routes.caseStudyCoralDevCluster,
  meta: {
    title: "Case study: how we reduced our own cluster’s machine bill by 58%",
    description:
      "Before we ask anyone to trust Coral with their cluster, we run it on ours. Eight days after we connected it, our AKS development cluster cost $154.76 a month instead of $368.65.",
  },
  hero: {
    kicker: "Validation Lab · Coral on Azure Kubernetes Service · October 2026",
    /** The h1, its second half on a line of its own in the good green. */
    title: "How we reduced our own cluster’s",
    titleGreen: "machine bill by 58%",
    deck: [
      "Before we ask anyone to trust Coral with their cluster, we run it on ours. In October 2026 we connected Coral to the Kubernetes cluster that runs Zoorik’s own development platform on Azure. Eight days later the cluster cost ",
      { b: "$154.76 a month instead of $368.65" },
      ", and every app was still running.",
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
      { value: "−58%", label: "machine bill", good: true },
      { value: "$213.89", label: "saved every month, about $2,567 a year", good: true },
      { value: "10 → 6", label: "CPU, on 2 machines instead of 3", good: false },
      { value: "8 days", label: "from connecting Coral to the result", good: false },
    ],
    about: [
      { b: "Coral" },
      " is Zoorik’s Kubernetes cost optimization for AKS and EKS. It right-sizes apps, removes machines a cluster no longer needs, and rebalances onto cheaper machines, all within each app’s safety limits.",
    ] satisfies CaseStudyText,
  },
  /** The section names, as the mock prints them in the left column and the chips: plain text. */
  sections: [
    { id: "the-starting-point", title: "The starting point" },
    { id: "connecting-coral", title: "Connecting Coral" },
    { id: "what-coral-did", title: "What Coral did" },
    { id: "how-the-apps-came-through", title: "How the apps came through" },
    { id: "how-the-apps-stayed-safe", title: "How the apps stayed safe" },
    { id: "the-result", title: "The result" },
  ] satisfies readonly { id: CaseStudySectionId; title: string }[],
  start: {
    text: "Our development cluster runs Coral’s own API, our consoles and our deployment tooling. It is a typical small team cluster: a system machine that Azure requires, and two worker machines for the apps. Like most clusters, it was sized for safety, not for what the apps actually used.",
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
      " command installed Coral’s agent in the cluster. Two days later we gave Coral permission to remove machines, in this cluster only. From then on Coral worked on its own, and we watched.",
    ] satisfies CaseStudyText,
    features: [
      {
        icon: "wl",
        title: "Workload optimization",
        text: "Sets each app’s CPU and memory to what it really uses, and raises it when an app needs more.",
      },
      {
        icon: "node",
        title: "Node optimization",
        text: "Spots a machine the apps no longer need, moves the apps off it and removes it.",
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
      title: "Node optimization: a spare worker removed",
      date: "6 Oct",
      text: [
        "Coral worked out that the apps would fit on fewer machines. It moved them to the remaining machines and removed one 4-CPU worker, ",
        { b: "on its own, in under 10 minutes" },
        ". Nobody switched anything on. Apps that run a single copy restarted once on another machine, and every app was running again afterwards.",
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
      title: "Workload optimization: apps sized to what they use",
      date: "from 8 Oct",
      text: [
        "We switched workload optimization to automatic. By 12 October Coral had right-sized ",
        { b: "14 of the cluster’s apps" },
        ". Most were reserving more than they used; one app needed more memory, and Coral gave it more.",
      ],
      pill: "Less reserved, more room on every machine",
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
      title: "Rebalancing: one click, a cheaper machine",
      date: "12 Oct",
      text: [
        "With one click, Coral swapped the remaining worker for a ",
        { b: "cheaper machine of the same size" },
        ", chosen from Azure’s prices. Azure built the new machine in under 2 minutes; Coral moved the apps one copy at a time and then removed the old machine. ",
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
    text: "Moving an app to another machine means stopping it in one place and starting it in another. Here is what that meant for our apps during the rebalance on 12 October, measured from the moment the old copy stopped to the moment the new one was ready.",
    caption: "Apps that run a single copy: each restarted once",
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
      " for the 6 apps that run two copies, including Coral’s API and both of our consoles: one copy was always running while the other moved.",
    ] satisfies CaseStudyText,
    means: [
      { b: "What this means:" },
      " an app that runs a single copy is down for a short time whenever it moves, with Coral or without it. Here that was 5 to 82 seconds. Apps that must never pause should run two copies, and Coral keeps one of them running. When the spare worker was removed on 6 October, single-copy apps also restarted once; those times were not measured.",
    ] satisfies CaseStudyText,
  },
  safe: [
    {
      title: "New machine first",
      text: "Nothing was removed until its replacement was ready and its apps had moved.",
    },
    {
      title: "One copy at a time",
      text: "Every move kept within each app’s own limits, so apps that run two copies always kept one running.",
    },
    {
      title: "Checks before every move",
      text: "Where a faster move could have put an app at risk, Coral chose the safe one.",
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
      caption: "Share of the machine bill removed",
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
    title: "How we reduced our own cluster’s machine bill by 58%",
    kind: "Case study · PDF · ",
    go: "Download",
  },
  fine: "Zoorik’s own development cluster on Azure Kubernetes Service, 4 to 12 October 2026. Costs are Azure pay-as-you-go list prices for the cluster’s machines at 730 hours a month. App figures cover the cluster’s own apps. Results depend on each cluster’s apps and machines.",
} as const;

/** One figure on a study card's cover: the value its bar is drawn to, and how it is printed. */
export interface CaseStudyCoverFigure {
  readonly value: number;
  readonly label: string;
}

/**
 * One study on the hub: one card in the library.
 * Every figure is the study's own, read from its content above, never typed
 * twice.
 */
export interface CaseStudyCard {
  /** Its product: the filter's chip, once the studies cover two products. */
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
/** What the study is, the first part of its own kicker: "Validation Lab". */
const coralLabel = caseStudy.hero.kicker.split(" · ")[0]!;

/**
 * The hub: the library, one card per study in `studies`, then "Your cluster
 * next" (the free assessment), "How we write them" and the closing cards. The
 * product filter is drawn only once the studies cover two products (show only
 * what applies: no chip that finds nothing). A new study is one more entry in
 * `studies`.
 */
export const caseStudiesHub = {
  route: routes.caseStudies,
  meta: {
    title: "Case studies",
    description: "What Coral does on real clusters, with the figures.",
  },
  hero: {
    title: "Case studies",
    deck: "What Coral does on real clusters, with the figures. We start with our own.",
  },
  /** The library's section, named for a screen reader only. */
  label: "Case studies",
  studies: [
    {
      product: "coral",
      href: caseStudy.route,
      document: caseStudy.document,
      /* "Validation Lab · Coral on AKS · October 2026". */
      kicker: [coralLabel, `${products.coral.name} on ${platformLabel.aks}`, coralMonth].join(
        " · ",
      ),
      title: caseStudy.end.title,
      /* "eight days" is the study's own "8 days" (`band.stats[3]`), in words as its prose says it. */
      line: `Our own development cluster: ${coralToday.label} a month instead of ${coralConnected.label}, eight days after we connected Coral.`,
      /* The three features the study shows Coral using, by their own titles. */
      tags: caseStudy.connect.features.map((feature) => feature.title),
      figure: caseStudy.band.stats[0].value,
      before: { value: coralConnected.amount, label: coralConnected.label },
      after: { value: coralToday.amount, label: coralToday.label },
      cap: "machine bill a month, before and after",
    },
  ] satisfies readonly CaseStudyCard[] as readonly CaseStudyCard[],
  /** The product filter, and its live count of the cards it shows. */
  filter: {
    label: "Filter case studies",
    all: "All",
    one: "case study",
    many: "case studies",
  },
  /** Each card's two ways in: the study, and its PDF. */
  card: { read: "Read the case study", pdf: "PDF" },
  /** The card after the studies: the free assessment. */
  next: {
    title: "Your cluster next",
    body: "Run the free assessment to see your own number: one command, one PDF with your estimated saving at list price.",
    go: "Run the free assessment",
    href: routes.assessment,
  },
  trust: {
    id: "how-we-write-them",
    title: "How we write them",
    items: [
      {
        title: "On a real cluster",
        text: "Measured on a cluster that runs real work, from the day Coral was connected.",
      },
      {
        title: "At list prices",
        text: "Every figure at the cloud’s pay-as-you-go list prices, 730 hours a month.",
      },
      {
        title: "Nothing named",
        text: "No cluster, machine or app is named. Apps stay generic, as in the PDF.",
      },
    ],
  },
} as const;
