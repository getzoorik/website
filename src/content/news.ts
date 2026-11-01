import { substackPublication } from "@/config/entity";
import { routes } from "@/config/site";
import { socialProfiles } from "@/content/footer";
import { nvidiaInceptionLegal } from "@/content/memberships";

/**
 * `/news`, Zoorik News: every string the page prints, verbatim from the approved mock. The Radar part is refreshed
 * weekly by the radar run, so a refresh is a small PR to this file alone: the week's items and `newsLastUpdated`.
 *
 * The page's parts, in its order: the latest of our announcements beside the newsletter, on the band; the rest of
 * From Zoorik, our own announcements, newest first (`newsFromZoorik`); then Zoorik Radar, the week's changes in three
 * streams, Cloud, Kubernetes and open source, and FinOps (`newsRadar`), each item a title in our words, its day and
 * its source. /learn shows one link card here, with the first stream's first headline, read from `newsRadar`
 * (`learn.ts`).
 */

/**
 * The day /news's content last changed (the week of the latest Radar), for the sitemap's `lastmod` only. A refresh moves
 * it in the same PR; never the build's date.
 */
export const newsLastUpdated = "19 October 2026";

/* The month names the page's dates print: "17 October 2026" on the latest announcement, "16 Oct" on a tile. */
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
  /** The `<title>`'s own words, before " | Zoorik", and the share title's. */
  meta: {
    title: "News",
    description:
      "What Zoorik ships, and Zoorik Radar: what changed this week in cloud cost, Kubernetes and FinOps, each item with its source.",
  },
  /** The page's name (its h1) and the deck under it. */
  hero: {
    title: "Zoorik News",
    deck: "What we ship, and what changed this week in cloud cost, Kubernetes and FinOps.",
  },
  /**
   * The band under the hero: the newest announcement on the white card, flagged "Latest", and the newsletter on the
   * dark one. The newsletter is a link to the Medium publication, not an embedded form, so the page loads no
   * third-party script; Substack under it. Both open in a new tab.
   */
  latest: {
    id: "latest",
    /** The band's name for a screen reader: it has no heading of its own. */
    label: "The latest from Zoorik, and the newsletter",
    flag: "Latest",
    newsletter: {
      title: "Get Zoorik News by email",
      line: "Our newsletter on Medium: what we ship, and each week’s Zoorik Radar, in your inbox.",
      subscribe: { label: "Subscribe on Medium", href: profile("medium") },
      alt: { before: "Or on ", label: "Substack", href: substackPublication },
    },
  },
  /** The rest of our announcements, after the latest. */
  zoorik: {
    id: "zoorik",
    title: "From Zoorik",
  },
  radar: {
    id: "radar",
    title: "Zoorik Radar",
    /** The line beside the h2, with the week in words ("19 October 2026"). */
    week: (week: string) => `Week of ${week}`,
    /** The stream chips: their name for a screen reader, and the first chip, which shows every stream. */
    chips: { label: "Stream", all: "All" },
    /** The line under the streams ends on the window it read, its first letter raised: "5 to 19 October 2026." */
    note: (window: string) =>
      `Read every week from AWS, Azure, the Kubernetes projects and the FinOps Foundation, in our words, each linked to its source. ${window.charAt(0).toUpperCase()}${window.slice(1)}.`,
  },
  months,
} as const;

/** One announcement of From Zoorik: what we shipped, and the page of this site that tells it. */
export interface NewsAnnouncement {
  /** The day it shipped, ISO ("2026-10-17"); the page prints "17 October 2026" on the latest, "17 Oct" on a tile. */
  readonly date: string;
  /** What it is about: a product, the assessment, the Value Lab. A product's tag draws the product's mark. */
  readonly tag: string;
  readonly title: string;
  readonly line: string;
  /** A page of this site. */
  readonly href: string;
  /** The link's words, on the latest announcement's button. */
  readonly cta: string;
  /** The trademark line another company asks for where its name appears, printed small at the page's foot. */
  readonly legal?: string;
}

/** One item of a Radar stream. */
export interface RadarItem {
  /** The day of the change, ISO ("2026-10-18"); the page prints "18 Oct". */
  readonly date: string;
  /** In our words. */
  readonly title: string;
  /** Who published it, as the page names them. Its words and the address pick the tile's logo. */
  readonly source: string;
  /** The source's own page, which the tile links to, in a new tab. */
  readonly url: `https://${string}`;
}

/** A Radar stream: its id (the chip's and the group's `data-st`), its name, and its items, newest first. */
export interface RadarStream {
  readonly id: "cloud" | "oss" | "finops";
  readonly label: string;
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
 * Written from the radar run's data for the week by a throwaway script: every field the page prints, verbatim, and
 * each announcement's mock page as the route it stands for. A refresh
 * regenerates these two and moves `newsLastUpdated` to the new week, in one small PR.
 */

export const newsRadar: NewsRadar = {
  week: "2026-10-19",
  window: "5 to 19 October 2026",
  streams: [
    {
      id: "cloud",
      label: "Cloud",
      items: [
        {
          date: "2026-10-18",
          title: "EKS clusters cost six times more per hour in extended support",
          source: "AWS: Amazon EKS pricing",
          url: "https://aws.amazon.com/eks/pricing/",
        },
        {
          date: "2026-10-14",
          title: "StandardV2 NAT Gateway is now generally available for AKS-managed egress",
          source: "AKS Engineering Blog",
          url: "https://blog.aks.azure.com/2026/10/14/standardv2-nat-gateway-aks-managed-egress",
        },
        {
          date: "2026-10-14",
          title: "EKS-optimized AL2023 AMI v20261012 fixes kernel panic that rebooted nodes",
          source: "GitHub: awslabs/amazon-eks-ami releases",
          url: "https://github.com/awslabs/amazon-eks-ami/releases/tag/v20261012",
        },
        {
          date: "2026-10-12",
          title: "Amazon EBS CSI driver v1.67.0 rejects StorageClasses with invalid topology",
          source: "GitHub: kubernetes-sigs/aws-ebs-csi-driver releases",
          url: "https://github.com/kubernetes-sigs/aws-ebs-csi-driver/releases/tag/v1.67.0",
        },
      ],
    },
    {
      id: "oss",
      label: "Kubernetes and open source",
      items: [
        {
          date: "2026-10-16",
          title:
            "Azure Karpenter provider fixes a price lookup bug that made AKS consolidation keep swapping same-size nodes",
          source: "GitHub: Azure/karpenter-provider-azure (merged PR, fixes issue #1997)",
          url: "https://github.com/Azure/karpenter-provider-azure/pull/2002",
        },
        {
          date: "2026-10-15",
          title:
            "Karpenter now uses each EC2 instance type's EBS attachment limit when packing pods with PVCs",
          source: "GitHub: aws/karpenter-provider-aws (merged PR)",
          url: "https://github.com/aws/karpenter-provider-aws/pull/9740",
        },
        {
          date: "2026-10-13",
          title: "Karpenter merges VPA-aware consolidation behind an alpha gate",
          source: "GitHub: kubernetes-sigs/karpenter (merged PR)",
          url: "https://github.com/kubernetes-sigs/karpenter/pull/3235",
        },
        {
          date: "2026-10-13",
          title:
            "Azure Disk CSI driver v1.34.8 fixes Premium SSD to Premium SSD v2 migration tracking on AKS",
          source: "GitHub: kubernetes-sigs/azuredisk-csi-driver releases",
          url: "https://github.com/kubernetes-sigs/azuredisk-csi-driver/releases/tag/v1.34.8",
        },
        {
          date: "2026-10-10",
          title:
            "Karpenter v1.15.0 puts node repair under disruption budgets and defaults consolidateAfter to 0s",
          source: "GitHub releases: kubernetes-sigs/karpenter",
          url: "https://github.com/kubernetes-sigs/karpenter/releases/tag/v1.15.0",
        },
      ],
    },
    {
      id: "finops",
      label: "FinOps",
      items: [
        {
          date: "2026-10-18",
          title: "AWS cost team: AI speeds FinOps, but EBS automation still needs sign-off",
          source: "AWS Cloud Financial Management Blog",
          url: "https://aws.amazon.com/blogs/aws-cloud-financial-management/strengthening-finops-culture-in-the-age-of-ai/",
        },
        {
          date: "2026-10-12",
          title: "GPUs on Kubernetes leave teams to build their own cost attribution",
          source: "The New Stack",
          url: "https://thenewstack.io/gpus-on-kubernetes/",
        },
        {
          date: "2026-10-08",
          title: "FOCUS 1.5 scope frozen, consistency review runs to 29 October",
          source: "FinOps Foundation (FOCUS)",
          url: "https://focus.finops.org/focus-1-5-release-scope/",
        },
        {
          date: "2026-10-08",
          title: "FOCUS SKU Price dataset proposed to ship as a 'preview' in 1.5",
          source: "FOCUS specification (GitHub)",
          url: "https://github.com/FinOps-Open-Cost-and-Usage-Spec/FOCUS_Spec/pull/2752",
        },
        {
          date: "2026-10-06",
          title:
            "FinOps Foundation: AI budgets miss idle infrastructure, storage and hidden tooling",
          source: "FinOps Foundation",
          url: "https://www.finops.org/insights/ai-spend-budget-busters/",
        },
      ],
    },
  ],
};

export const newsFromZoorik: readonly NewsAnnouncement[] = [
  {
    date: "2026-10-27",
    tag: "Company",
    title: "Zoorik joins the NVIDIA Inception Program",
    line: "Zoorik is now a member of the NVIDIA Inception program, NVIDIA’s program for startups.",
    href: `${routes.about}#programs`,
    cta: "About Zoorik",
    legal: nvidiaInceptionLegal,
  },
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
    tag: "Value Lab",
    title: "How we reduced AKS cluster costs by 58%",
    line: "Eight days after we connected Coral to our own AKS development cluster, it cost $154.76 a month instead of $368.65.",
    href: routes.caseStudyCoralDevCluster,
    cta: "Read the case study",
  },
];
