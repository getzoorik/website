import { routes } from "@/config/site";
import { diskCalculator, nodeCalculator } from "@/content/calculators";
import { caseStudiesHub, caseStudy } from "@/content/case-studies";
import { communityPage } from "@/content/community";
import type { Article } from "@/content/learn/article";
import { glossaryPage } from "@/content/learn/glossary";
import { articleAuthor, articleRoute, findArticle, learnArticles } from "@/content/learn/published";
import { newsPage } from "@/content/news";
import { productFilms } from "@/content/product-films";
import type { ProductId } from "@/content/products";
import { shortDay } from "@/lib/content-date";

/**
 * `/learn`, the hub: every string it prints, verbatim from the approved mock. The
 * page's name and its line; on the band, Start here (the three subjects' guides) beside Find the right fix (three
 * causes of high cloud cost, each to its guide); All articles, in the order the site publishes by; Watch and read; More
 * from Zoorik. Always the three subjects, Cloud cost, Kubernetes and Block storage.
 *
 * ─── ONLY WHAT IS PUBLISHED ─────────────────────────────────────────────────
 * Every row and tile is an article of the Learn index (`@/content/learn/published`), read from the article's own file,
 * so the hub and the article never disagree. An article the band names that is not published is left out of the band,
 * and a new article file is a new tile with no change here. An article on the band is not repeated in All articles.
 *
 * ─── THE ORDER ──────────────────────────────────────────────────────────────
 * All articles follows the priority list (`learnPriority`): rank 1 first. An article the list does not rank
 * follows, A–Z by slug.
 */

/** The three subjects, in the hub's order: the chips, the tiles' eyebrows and each tile's `data-p`. */
export type LearnSubject = "cloud" | "k8s" | "storage";

export const learnSubjects: readonly { readonly id: LearnSubject; readonly label: string }[] = [
  { id: "cloud", label: "Cloud cost" },
  { id: "k8s", label: "Kubernetes" },
  { id: "storage", label: "Block storage" },
];

export const learnPage = {
  path: routes.learn,
  meta: {
    /** The `<title>`'s own words, before " | Zoorik". The h1 is "Zoorik Learn"; the header's Docs menu names the
     *  hub "Zoorik Learn" and the footer "Learn". */
    title: "Cloud cost optimization guides",
    description:
      "Cloud cost optimization guides and comparisons for Kubernetes and block storage on Azure and AWS, from where the money goes to the right fix.",
  },
  hero: {
    title: "Zoorik Learn",
    deck: "Cloud cost optimization guides for Kubernetes and block storage, and for your whole cloud cost, on Azure and AWS.",
  },
  /**
   * The day the hub's own content last changed, for the sitemap; it is not printed. A new article moves the hub's
   * sitemap day on its own (`sitemap.ts`), so this moves only when the hub itself changes.
   */
  updated: "Updated 1 November 2026",
  /** The band's name for a screen reader: the two cards have no section heading of their own. */
  band: "Start here, and find the right fix",
  start: { title: "Start here", line: "Three guides that cover your whole cloud cost." },
  fix: {
    title: "Find the right fix",
    line: "Three causes of high cloud cost, and the fix for each.",
  },
  articles: {
    id: "articles",
    title: "All articles",
    /** After the count, beside the head: "6 more". */
    more: "more",
    subjects: { label: "Subject", all: "All" },
    /** The button under the first tiles, around the count: "Show all 60 articles". */
    showAll: { before: "Show all ", after: " articles" },
    /** The tiles shown before Show all. */
    shown: 12,
  },
  watch: {
    id: "watch",
    title: "Watch and read",
    /** After a film's length, and before the post's day. */
    film: "on YouTube",
    medium: "On Medium",
  },
  more: { id: "more", title: "More from Zoorik" },
} as const;

/** Each subject's pillar, the guide Start here lists, in the hub's order. */
export const learnPillars: readonly { readonly subject: LearnSubject; readonly pillar: string }[] =
  [
    { subject: "cloud", pillar: "how-to-reduce-cloud-costs" },
    { subject: "k8s", pillar: "reduce-kubernetes-cost" },
    { subject: "storage", pillar: "azure-disk-reservations" },
  ];

/**
 * Find the right fix: what is costing the reader, and the guide that fixes it. The row reads the problem as its
 * lead-in, then the guide's short name, the words it is searched by (owner, 1 Nov 2026): "Machines sit half empty:
 * Cluster Autoscaler not scaling down".
 */
export const learnFixes: readonly {
  readonly problem: string;
  readonly words: string;
  readonly slug: string;
}[] = [
  {
    problem: "Machines sit half empty",
    words: "Cluster Autoscaler not scaling down",
    slug: "cluster-autoscaler-not-scaling-down",
  },
  {
    problem: "Disks are bigger than their data",
    words: "reduce Azure disk size",
    slug: "shrink-azure-managed-disk",
  },
  {
    problem: "You can’t see where the money goes",
    words: "Kubernetes cost estimation",
    slug: "kubernetes-cost-estimation",
  },
];

/** The order the site publishes by, rank 1 first. */
export const learnPriority: readonly string[] = [
  "how-to-reduce-cloud-costs",
  "reduce-kubernetes-cost",
  "azure-disk-reservations",
  "shrink-azure-managed-disk",
  "kubernetes-cost-estimation",
  "kubernetes-pod-right-sizing",
  "cluster-autoscaler-not-scaling-down",
  "change-eks-node-group-instance-type",
  "find-unattached-disks-azure",
  "azure-vm-disk-usage",
  "check-ebs-volume-usage",
  "kubernetes-autoscaling",
  "keda-vs-karpenter",
  "kubernetes-allocatable-vs-capacity",
  "limitrange-vs-resourcequota",
  "safe-to-evict-do-not-disrupt",
  "btrfs-multiple-disks",
  "btrfs-unallocated-space",
  "shrink-xfs-filesystem",
  "azure-disk-snapshot-cost",
  "kubernetes-drain-node-without-downtime",
  "azure-vm-disk-space-alert",
  "increase-ebs-volume-size",
  "btrfs-device-remove",
  "pod-affinity-vs-node-affinity",
  "aks-cost-analysis",
  "aks-vs-eks-cost",
  "shrink-ebs-volume",
  "cluster-autoscaler-overprovisioning",
  "pod-disruption-budget-best-practices",
  "change-aks-node-pool-vm-size",
  "oomkilled-exit-code-137",
  "resize-pvc-kubernetes",
  "azure-disk-expand-without-downtime",
  "resize2fs-shrink-ext4",
  "remove-disk-from-lvm",
  "vpa-vs-hpa",
  "keda-vs-hpa-vs-vpa",
  "premium-ssd-v2-vs-premium-ssd",
  "cordon-vs-drain",
  "premium-ssd-vs-standard-ssd-azure",
  "combine-ebs-volumes",
  "io2-vs-gp3",
  "btrfs-vs-lvm",
  "kubernetes-overprovisioning",
  "karpenter-consolidation",
  "what-is-karpenter",
  "what-is-keda",
  "kubernetes-bin-packing",
  "kubernetes-descheduler",
  "kubernetes-node-size-best-practices",
  "in-place-pod-resize",
  "aks-storage-classes",
  "azure-disk-iops-vs-throughput",
  "azure-disk-performance-tiers",
  "compute-optimizer-ebs",
  "karpenter-cost-optimization",
  "ebs-snapshot-cost",
  "karpenter-vs-cluster-autoscaler",
  "azure-disk-lrs-vs-zrs",
  "gp2-vs-gp3",
  "aks-node-auto-provisioning",
  "topology-spread-constraints",
  "ebs-elastic-volumes",
  "is-btrfs-stable",
];

/**
 * The heading a row or a tile shows: the article's short name; an article not listed shows its h1
 * before the colon. The full h1 is the link's hover title.
 */
const learnNames: Readonly<Record<string, string>> = {
  "how-to-reduce-cloud-costs": "Cloud cost optimization: how to reduce cloud costs",
  "reduce-kubernetes-cost": "Kubernetes cost optimization",
  "azure-disk-reservations": "Azure disk reservations",
  "shrink-azure-managed-disk": "Reduce Azure disk size: can a managed disk shrink?",
  "kubernetes-cost-estimation": "Kubernetes cost estimation",
  "kubernetes-pod-right-sizing": "Kubernetes pod right sizing",
  "cluster-autoscaler-not-scaling-down": "Cluster Autoscaler not scaling down",
  "change-eks-node-group-instance-type": "Change an EKS node group instance type",
  "find-unattached-disks-azure": "Find unattached disks in Azure",
  "azure-vm-disk-usage": "Azure VM disk usage: used vs provisioned",
  "check-ebs-volume-usage": "Check EBS volume usage: used vs paid",
  "kubernetes-autoscaling": "HPA vs VPA vs Cluster Autoscaler",
  "keda-vs-karpenter": "KEDA vs Karpenter",
  "kubernetes-allocatable-vs-capacity": "Kubernetes allocatable vs capacity",
  "limitrange-vs-resourcequota": "LimitRange vs ResourceQuota",
  "safe-to-evict-do-not-disrupt": "Safe-to-evict and do-not-disrupt",
  "btrfs-multiple-disks": "btrfs on multiple disks (btrfs pool)",
  "btrfs-unallocated-space": "btrfs unallocated vs free space",
  "shrink-xfs-filesystem": "Shrink an XFS filesystem",
  "azure-disk-snapshot-cost": "Azure disk snapshot cost",
  "kubernetes-drain-node-without-downtime": "Drain a node without downtime",
  "azure-vm-disk-space-alert": "Azure VM disk space alert",
  "increase-ebs-volume-size": "Increase EBS volume size without downtime",
  "btrfs-device-remove": "btrfs device remove",
  "pod-affinity-vs-node-affinity": "Pod affinity vs node affinity",
  "aks-cost-analysis": "AKS cost analysis",
  "aks-vs-eks-cost": "AKS vs EKS cost",
  "shrink-ebs-volume": "Shrink an EBS volume",
  "cluster-autoscaler-overprovisioning": "Cluster Autoscaler overprovisioning",
  "pod-disruption-budget-best-practices": "Pod disruption budget best practices",
  "change-aks-node-pool-vm-size": "Change an AKS node pool VM size",
  "oomkilled-exit-code-137": "OOMKilled exit code 137",
  "resize-pvc-kubernetes": "Resize a PVC",
  "azure-disk-expand-without-downtime": "Azure disk expand without downtime",
  "resize2fs-shrink-ext4": "resize2fs shrink ext4",
  "remove-disk-from-lvm": "Remove a disk from LVM",
  "vpa-vs-hpa": "VPA vs HPA",
  "keda-vs-hpa-vs-vpa": "KEDA vs HPA",
  "premium-ssd-v2-vs-premium-ssd": "Premium SSD v2 vs Premium SSD",
  "cordon-vs-drain": "Cordon vs drain",
  "premium-ssd-vs-standard-ssd-azure": "Premium SSD vs Standard SSD",
  "combine-ebs-volumes": "Combine EBS volumes",
  "io2-vs-gp3": "io2 vs gp3",
  "btrfs-vs-lvm": "btrfs vs LVM",
  "kubernetes-overprovisioning": "Kubernetes overprovisioning",
  "karpenter-consolidation": "Karpenter consolidation",
  "what-is-karpenter": "What is Karpenter?",
  "what-is-keda": "What is KEDA?",
  "kubernetes-bin-packing": "Kubernetes bin packing",
  "kubernetes-descheduler": "Kubernetes descheduler",
  "kubernetes-node-size-best-practices": "Node size best practices",
  "in-place-pod-resize": "In-place pod resize",
  "aks-storage-classes": "AKS storage classes",
  "azure-disk-iops-vs-throughput": "Azure disk IOPS vs throughput",
  "azure-disk-performance-tiers": "Azure disk performance tiers",
  "compute-optimizer-ebs": "AWS Compute Optimizer for EBS",
  "karpenter-cost-optimization": "Karpenter cost optimization",
  "ebs-snapshot-cost": "EBS snapshot cost",
  "karpenter-vs-cluster-autoscaler": "Karpenter vs Cluster Autoscaler",
  "azure-disk-lrs-vs-zrs": "Azure disk LRS vs ZRS",
  "gp2-vs-gp3": "gp2 vs gp3",
  "aks-node-auto-provisioning": "AKS node auto provisioning (NAP)",
  "topology-spread-constraints": "Topology spread constraints",
  "ebs-elastic-volumes": "EBS Elastic Volumes",
  "is-btrfs-stable": "Is btrfs stable?",
  "poor-architecture-cloud-bill": "How poor architecture increases your cloud costs",
};

/** A row of the band: where it goes, the words it shows and the article's h1, its hover title. */
export interface LearnRow {
  readonly href: string;
  readonly name: string;
  readonly title: string;
}

/** A tile of All articles: an article as its cover shows it. */
export interface LearnTile extends LearnRow {
  readonly subject: LearnSubject;
  /** Its published day as the tile prints it, "21 Oct", with its author where it has one: "21 Oct · By Udit Sharma". */
  readonly meta: string;
  /** Its drawn cover, whose art the tile shows on its right. */
  readonly cover: `/learn-covers/${string}.webp`;
}

/** The subject an article is filed under, by its hub group's name. */
const subjectOf = (article: Article): LearnSubject =>
  learnSubjects.find((subject) => subject.label === article.hub)!.id;

const nameOf = (article: Article): string =>
  learnNames[article.slug] ?? article.h1.split(":")[0]!.trim();

const rowOf = (article: Article): LearnRow => ({
  href: articleRoute(article),
  name: nameOf(article),
  title: article.h1,
});

const tileOf = (article: Article): LearnTile => {
  const author = articleAuthor(article);
  return {
    ...rowOf(article),
    subject: subjectOf(article),
    meta: `${shortDay(article.published)}${author ? ` · By ${author.name}` : ""}`,
    cover: `/learn-covers/zoorik-learn-${article.slug}-1200x630.webp`,
  };
};

const published = (slugs: readonly string[]): readonly Article[] =>
  slugs.flatMap((slug) => {
    const article = findArticle(slug);
    return article ? [article] : [];
  });

/** Start here: each subject's pillar, once published. */
export const learnStart: readonly LearnRow[] = published(
  learnPillars.map((entry) => entry.pillar),
).map(rowOf);

/** Find the right fix: each cause and its guide's short name, with the guide's address and h1, once it is published. */
export const learnFixRows: readonly LearnRow[] = learnFixes.flatMap((fix) => {
  const article = findArticle(fix.slug);
  return article ? [{ ...rowOf(article), name: `${fix.problem}: ${fix.words}` }] : [];
});

const onBand = new Set([
  ...learnPillars.map((entry) => entry.pillar),
  ...learnFixes.map((fix) => fix.slug),
]);

const rank = (slug: string): number => {
  const at = learnPriority.indexOf(slug);
  return at < 0 ? learnPriority.length : at;
};

/** All articles: every published article not on the band, by the priority list, then A–Z by slug. */
export const learnTiles: readonly LearnTile[] = learnArticles
  .filter((article) => !onBand.has(article.slug))
  .sort((a, b) => rank(a.slug) - rank(b.slug) || a.slug.localeCompare(b.slug, "en"))
  .map(tileOf);

/** Watch and read: each product's film on YouTube (a film not on YouTube yet is left out), then the Medium post. */
export const learnFilms = (["coral", "amoeba"] as const satisfies readonly ProductId[]).flatMap(
  (product) => {
    const film = productFilms[product];
    return film.url
      ? [{ product, href: film.url, title: film.title, length: film.length, poster: film.poster }]
      : [];
  },
);

/** The one live Medium post, in its own title and on its day. Its address is the one Medium serves. */
export const learnMedium = {
  date: "12 Oct 2026",
  title: "Why your Kubernetes cluster pays for capacity it doesn’t use",
  url: "https://medium.com/zoorik/why-your-kubernetes-cluster-pays-for-capacity-it-doesnt-use-66863320dca3",
} as const;

/** A calculator's tile line, its apostrophes curled as the hub's lines are. */
const curled = (line: string): string => line.replaceAll("'", "’");

/**
 * More from Zoorik: Value Lab, Cloud cost optimization tools, the two calculators, Community, News and the glossary,
 * each its name and one line. Value Lab's figure is the study's own (`caseStudy.band`), and the pages' names are their
 * own h1s, but for the calculators: each is named by the words it is searched by (owner, 1 Nov 2026), Coral's first,
 * and keeps the line its tile has on the tools page.
 */
export const learnMore: readonly {
  readonly href: string;
  readonly title: string;
  readonly line: string;
}[] = [
  {
    href: routes.valueLab,
    title: caseStudiesHub.hero.title,
    line: `${caseStudy.band.stats[0].value} on our own AKS cluster’s monthly machine cost.`,
  },
  {
    href: routes.cloudCostTools,
    title: "Cloud cost optimization tools",
    line: "The tools that reduce cloud cost, and how each works.",
  },
  {
    href: routes.eksAndAksPricingCalculator,
    title: "EKS and AKS pricing calculator",
    line: curled(nodeCalculator.tile.line),
  },
  {
    href: routes.ebsAndAzureDiskPricing,
    title: "EBS and Azure disk pricing",
    line: curled(diskCalculator.tile.line),
  },
  {
    href: routes.community,
    title: communityPage.hero.title,
    line: "r/zoorik and the FinOps and cloud cost communities on Kubernetes, Azure and AWS.",
  },
  {
    href: routes.news,
    title: newsPage.hero.title,
    line: "What we ship, and what changed this week.",
  },
  {
    href: routes.learnGlossary,
    title: glossaryPage.hero.title,
    line: glossaryPage.line,
  },
];
