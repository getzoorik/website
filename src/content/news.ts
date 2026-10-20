import { substackPublication } from "@/config/entity";
import { routes } from "@/config/site";
import { socialProfiles } from "@/content/footer";

/**
 * `/news`, Zoorik News: every string the page prints, verbatim from the approved mock. The Radar part is refreshed
 * weekly by the radar run, so a refresh is a small PR to this file alone: the week's items and `newsLastUpdated`.
 *
 * Two parts, in the page's order: From Zoorik, our own announcements, newest first (`newsFromZoorik`); then Zoorik
 * Radar, the week's changes in three streams, Cloud, Kubernetes and open source, and FinOps (`newsRadar`), each item in
 * our words with its date and its source. /learn shows one link card here, with each stream's first headline, read
 * from `newsRadar` (`learn.ts`).
 */

/**
 * The day /news's content last changed (the week of the latest Radar), for the sitemap's `lastmod` only. A refresh moves
 * it in the same PR; never the build's date.
 */
export const newsLastUpdated = "19 October 2026";

/* The month names the page's dates print: "17 October 2026" for an announcement, "18 October" for a Radar item. */
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

/** A profile of the footer's social row, by its platform. */
const profile = (platform: (typeof socialProfiles)[number]["platform"]): string =>
  socialProfiles.find((entry) => entry.platform === platform)!.href;

export const newsPage = {
  /** The page's `<title>` and share title as is: "Zoorik News: …" names the company already, so no " · Zoorik". */
  meta: {
    title: "Zoorik News: cloud cost, Kubernetes and FinOps updates",
    description:
      "What Zoorik ships, and Zoorik Radar: what changed this week in cloud cost, Kubernetes and FinOps, each item with its source.",
  },
  /** The page's name (its h1) and the deck under it. */
  hero: {
    title: "Zoorik News",
    deck: "What we ship, and what changed this week in cloud cost, Kubernetes and FinOps.",
  },
  /** The links under the deck, to From Zoorik and each Radar stream: their name for a screen reader. */
  jump: "On this page",
  zoorik: {
    id: "zoorik",
    title: "From Zoorik",
    lede: "What we shipped, newest first.",
  },
  radar: {
    id: "radar",
    /** The line over the Radar's head, with the week in words ("19 October 2026"). */
    eyebrow: (week: string) => `Zoorik Radar · week of ${week}`,
    title: "What changed in cloud cost, Kubernetes and FinOps",
    /** The Radar's lede ends on the window it read, its first letter raised: "5 to 19 October 2026." */
    lede: (window: string) =>
      `Read every week from AWS, Azure, the Kubernetes projects and the FinOps Foundation, and written in our words, each with its source. ${window.charAt(0).toUpperCase()}${window.slice(1)}.`,
  },
  /**
   * The closing row, for readers who want the newsletter: a link to the Medium publication, not an embedded form, so
   * the page loads no third-party script; Substack beside it; then where else we post. Every link opens in a new tab.
   */
  newsletter: {
    eyebrow: "Newsletter",
    title: "Get Zoorik News by email",
    lede: "Subscribe to our Medium publication: what we ship, and each week’s Zoorik Radar, in your inbox.",
    subscribe: { label: "Subscribe on Medium", href: profile("medium") },
    alt: { label: "Or on Substack", href: substackPublication },
    follow: "Or follow us",
    links: [
      { label: "LinkedIn", href: profile("linkedin") },
      { label: "X", href: profile("x") },
      { label: "r/zoorik", href: profile("reddit") },
    ],
  },
  months,
} as const;

/** One announcement of From Zoorik: what we shipped, and the page of this site that tells it. */
export interface NewsAnnouncement {
  /** The day it shipped, ISO ("2026-10-17"); the page prints "17 October 2026". */
  readonly date: string;
  /** What it is about: a product, the assessment, the Validation Lab. */
  readonly tag: string;
  readonly title: string;
  readonly line: string;
  /** A page of this site. */
  readonly href: string;
  /** The link's words. */
  readonly cta: string;
}

/** One item of a Radar stream. */
export interface RadarItem {
  /** The day of the change, ISO ("2026-10-18"); the page prints "18 October". */
  readonly date: string;
  readonly title: string;
  /** In our words, as the page prints it: the radar's summary, at most its first two sentences. */
  readonly summary: string;
  /** Who published it, as the page names them. */
  readonly source: string;
  /** The source's own page, which the title links to, in a new tab. */
  readonly url: `https://${string}`;
}

/** A Radar stream: its anchor (`#radar-<id>`), its name, what it follows, and its items, newest first. */
export interface RadarStream {
  readonly id: "cloud" | "oss" | "finops";
  readonly label: string;
  readonly lede: string;
  readonly items: readonly RadarItem[];
}

/** The week's Radar: its week (ISO, the Monday it was read), the window it covers in words, and its three streams. */
export interface NewsRadar {
  readonly week: string;
  readonly window: string;
  readonly streams: readonly [RadarStream, RadarStream, RadarStream];
}

/*
 * ─── GENERATED: THE WEEK'S RADAR AND OUR ANNOUNCEMENTS ──────────────────────
 * Written from the radar run's data for the week by a throwaway script: every field verbatim, each Radar summary cut
 * to at most its first two sentences, and each announcement's mock page as the route it stands for. A refresh
 * regenerates these two and moves `newsLastUpdated` to the new week, in one small PR.
 */

export const newsRadar: NewsRadar = {
  week: "2026-10-19",
  window: "5 to 19 October 2026",
  streams: [
    {
      id: "cloud",
      label: "Cloud",
      lede: "AWS and Azure prices and features: AKS, EKS, Azure disks and Amazon EBS.",
      items: [
        {
          date: "2026-10-18",
          title: "EKS clusters cost six times more per hour in extended support",
          summary:
            "A cluster costs $0.10 per hour in standard support and $0.60 per hour once its Kubernetes version moves to extended support, which AWS turns on by default.",
          source: "AWS: Amazon EKS pricing",
          url: "https://aws.amazon.com/eks/pricing/",
        },
        {
          date: "2026-10-14",
          title: "StandardV2 NAT Gateway is now generally available for AKS-managed egress",
          summary:
            "AKS now creates a zone-redundant StandardV2 NAT gateway by default for new clusters that use the managedNATGateway outbound type on API version 2026-06-01 or later, and Azure Updates listed it as generally available on 8 Oct.",
          source: "AKS Engineering Blog",
          url: "https://blog.aks.azure.com/2026/10/14/standardv2-nat-gateway-aks-managed-egress",
        },
        {
          date: "2026-10-14",
          title: "EKS-optimized AL2023 AMI v20261012 fixes kernel panic that rebooted nodes",
          summary:
            "AMI release v20261012 ships a kernel that fixes a panic during memory reclaim, which made nodes on releases v20260930 and v20261003 reboot unexpectedly.",
          source: "GitHub: awslabs/amazon-eks-ami releases",
          url: "https://github.com/awslabs/amazon-eks-ami/releases/tag/v20261012",
        },
        {
          date: "2026-10-12",
          title: "Amazon EBS CSI driver v1.67.0 rejects StorageClasses with invalid topology",
          summary:
            "The changelog flags an urgent upgrade note: StorageClass topologies without an Availability Zone or AZ ID, which earlier versions accepted, are now rejected when volumes are created or cloned.",
          source: "GitHub: kubernetes-sigs/aws-ebs-csi-driver releases",
          url: "https://github.com/kubernetes-sigs/aws-ebs-csi-driver/releases/tag/v1.67.0",
        },
      ],
    },
    {
      id: "oss",
      label: "Kubernetes and open source",
      lede: "Releases from Kubernetes, Karpenter, the autoscalers and the disk drivers.",
      items: [
        {
          date: "2026-10-16",
          title:
            "Azure Karpenter provider fixes a price lookup bug that made AKS consolidation keep swapping same-size nodes",
          summary:
            "An AKS Node Auto Provisioning user in koreacentral found that the provider sometimes priced Standard_D2as_v5 from the Cloud Services row ($0.198/h) instead of the Linux VM row ($0.106/h); the Azure Retail Prices API lists both rows.",
          source: "GitHub: Azure/karpenter-provider-azure (merged PR, fixes issue #1997)",
          url: "https://github.com/Azure/karpenter-provider-azure/pull/2002",
        },
        {
          date: "2026-10-15",
          title:
            "Karpenter now uses each EC2 instance type's EBS attachment limit when packing pods with PVCs",
          summary:
            "Karpenter core v1.15.0 lets a cloud provider declare per-driver volume limits for instance types that are not launched yet, so the scheduler stops packing too many PVC pods onto one simulated node.",
          source: "GitHub: aws/karpenter-provider-aws (merged PR)",
          url: "https://github.com/aws/karpenter-provider-aws/pull/9740",
        },
        {
          date: "2026-10-13",
          title: "Karpenter merges VPA-aware consolidation behind an alpha gate",
          summary:
            "With the PredictionEnabled gate on, Karpenter's consolidation and drift simulations use the requests a VPA will give a pod after it moves, not its current requests, and they also predict DaemonSet overhead on new replacement nodes.",
          source: "GitHub: kubernetes-sigs/karpenter (merged PR)",
          url: "https://github.com/kubernetes-sigs/karpenter/pull/3235",
        },
        {
          date: "2026-10-13",
          title:
            "Azure Disk CSI driver v1.34.8 fixes Premium SSD to Premium SSD v2 migration tracking on AKS",
          summary:
            "This patch fixes how the Azure Disk CSI driver follows a disk SKU migration, such as Premium SSD to Premium SSD v2.",
          source: "GitHub: kubernetes-sigs/azuredisk-csi-driver releases",
          url: "https://github.com/kubernetes-sigs/azuredisk-csi-driver/releases/tag/v1.34.8",
        },
        {
          date: "2026-10-10",
          title:
            "Karpenter v1.15.0 puts node repair under disruption budgets and defaults consolidateAfter to 0s",
          summary: "Karpenter 1.15.0 makes node auto repair (still alpha) a voluntary disruption.",
          source: "GitHub releases: kubernetes-sigs/karpenter",
          url: "https://github.com/kubernetes-sigs/karpenter/releases/tag/v1.15.0",
        },
      ],
    },
    {
      id: "finops",
      label: "FinOps",
      lede: "The FinOps Foundation, the FOCUS billing format and how teams run cloud cost.",
      items: [
        {
          date: "2026-10-18",
          title: "AWS cost team: AI speeds FinOps, but EBS automation still needs sign-off",
          summary:
            "AWS's cost team says AI produces cost findings faster, but people with business context still have to decide what to do with them. It lists six habits, including fewer alerts, named owners and human sign-off on automated actions.",
          source: "AWS Cloud Financial Management Blog",
          url: "https://aws.amazon.com/blogs/aws-cloud-financial-management/strengthening-finops-culture-in-the-age-of-ai/",
        },
        {
          date: "2026-10-12",
          title: "GPUs on Kubernetes leave teams to build their own cost attribution",
          summary:
            "A practitioner column says GPUs on Kubernetes lack the per-pod usage data that CPU and memory get for free.",
          source: "The New Stack",
          url: "https://thenewstack.io/gpus-on-kubernetes/",
        },
        {
          date: "2026-10-08",
          title: "FOCUS 1.5 scope frozen, consistency review runs to 29 October",
          summary:
            "Member approval for the FOCUS 1.5 working draft closed on 8 October. The draft is now in a consistency review until 29 October, and ratification is planned for 3 December 2026.",
          source: "FinOps Foundation (FOCUS)",
          url: "https://focus.finops.org/focus-1-5-release-scope/",
        },
        {
          date: "2026-10-08",
          title: "FOCUS SKU Price dataset proposed to ship as a 'preview' in 1.5",
          summary:
            "Maintainers have proposed shipping the new SKU Price dataset in 1.5 as a preview. The dataset is a standard price sheet for comparing provider prices, including for SKUs a customer has not used yet.",
          source: "FOCUS specification (GitHub)",
          url: "https://github.com/FinOps-Open-Cost-and-Usage-Spec/FOCUS_Spec/pull/2752",
        },
        {
          date: "2026-10-06",
          title:
            "FinOps Foundation: AI budgets miss idle infrastructure, storage and hidden tooling",
          summary:
            "The Foundation warns that AI budgets built on token prices miss much of the real spend. The missed items include supporting tools, idle and pre-production infrastructure, observability data growth and forced migrations.",
          source: "FinOps Foundation",
          url: "https://www.finops.org/insights/ai-spend-budget-busters/",
        },
      ],
    },
  ],
};

export const newsFromZoorik: readonly NewsAnnouncement[] = [
  {
    date: "2026-10-17",
    tag: "Assessment",
    title: "Zoorik assessment 1.3: one free PDF report for Coral and Amoeba",
    line: "One command, npx -y zoorik assess coral or amoeba, now writes a single PDF with your estimated saving at list price.",
    href: routes.assessment,
    cta: "Run the free assessment",
  },
  {
    date: "2026-10-16",
    tag: "Coral",
    title: "Install Coral with Helm or Terraform",
    line: "Coral’s agent now installs from a public Helm chart, and AKS and EKS modules are on the Terraform Registry, beside zoorikctl.",
    href: routes.openSource,
    cta: "See the install options",
  },
  {
    date: "2026-10-12",
    tag: "Validation Lab",
    title: "How we reduced our own cluster’s machine bill by 58%",
    line: "Eight days after we connected Coral to our own AKS development cluster, it cost $154.76 a month instead of $368.65.",
    href: routes.caseStudyCoralDevCluster,
    cta: "Read the case study",
  },
];
