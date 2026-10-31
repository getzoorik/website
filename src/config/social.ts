import type { Metadata } from "next";

import { routes, site } from "@/config/site";
import { alternativesPages, versusPages, versusRoute } from "@/content/learn-compare";
import type { ProductId } from "@/content/products";

/** The X account the footer links to (x.com/getzoorik), named as every page's card site and creator. */
export const xHandle = "@getzoorik";

/**
 * The brand kit's card, brand 2.0: the logo and the tagline "Reduce cloud cost, autonomously.",
 * with no marketplace line. Stored as an 8-bit palette PNG like every page card, 174 KB instead
 * of the kit's 1.2 MB, the picture unchanged. Platforms cache cards by URL, so a re-encoded or
 * new picture gets a new file name.
 */
export const socialImage = {
  url: "/og/zoorik-reduce-cloud-cost-autonomously-1200x630.png",
  width: 1200,
  height: 630,
  type: "image/png",
  alt: "Zoorik. Reduce cloud cost, autonomously.",
} as const;

/** A share card: a 1200 × 630 PNG in `public/og/`, and the words it shows. */
export interface ShareImage {
  readonly url: `/og/${string}.png`;
  readonly width: 1200;
  readonly height: 630;
  readonly type: "image/png";
  readonly alt: string;
}

/** A card from its picture and its words. */
export const shareImage = (url: ShareImage["url"], alt: string): ShareImage => ({
  url,
  width: 1200,
  height: 630,
  type: "image/png",
  alt,
});

/**
 * Every page's own card, by its address: the brand card above with the page's own words where the tagline sits,
 * drawn by the brand kit from these same words and stored as a palette PNG in `public/og/pages/`. Platforms cache a
 * card by its URL, so a redrawn card gets a new file name. Each `alt` reads the card: its name, then its words. The
 * home page has none of its own: it shows the brand card.
 */
/** A product's comparison pages, its alternatives page then its versus page: they share one card. */
const comparisonsOf = (product: ProductId): `/${string}`[] => [
  ...alternativesPages
    .filter((page) => page.product === product)
    .map((page) => page.route as `/${string}`),
  ...versusPages.filter((page) => page.product === product).map(versusRoute),
];

const CARDS: readonly {
  readonly file: string;
  readonly words: string;
  readonly paths: readonly `/${string}`[];
}[] = [
  { file: "coral", words: "Kubernetes cost optimization on AKS and EKS", paths: ["/coral"] },
  { file: "amoeba", words: "Block storage cost optimization on Azure and AWS", paths: ["/amoeba"] },
  /* Each product on each cloud, then the six pages on what Coral works with (31 Oct 2026). */
  { file: "coral-for-aks", words: "AKS cost optimization with Coral", paths: [routes.coralForAks] },
  { file: "coral-for-eks", words: "EKS cost optimization with Coral", paths: [routes.coralForEks] },
  {
    file: "amoeba-for-azure",
    words: "Azure managed disk cost optimization with Amoeba",
    paths: [routes.amoebaForAzure],
  },
  {
    file: "amoeba-for-aws",
    words: "EBS cost optimization with Amoeba",
    paths: [routes.amoebaForAws],
  },
  {
    file: "coral-works-with-cluster-autoscaler",
    words: "Coral works with Cluster Autoscaler",
    paths: [routes.coralWorksWithClusterAutoscaler],
  },
  {
    file: "coral-works-with-karpenter",
    words: "Coral works with Karpenter",
    paths: [routes.coralWorksWithKarpenter],
  },
  {
    file: "coral-works-with-aks-node-auto-provisioning",
    words: "Coral works with AKS node auto provisioning",
    paths: [routes.coralWorksWithNodeAutoProvisioning],
  },
  {
    file: "coral-works-with-keda",
    words: "Coral works with KEDA",
    paths: [routes.coralWorksWithKeda],
  },
  {
    file: "coral-works-with-helm",
    words: "Coral works with Helm",
    paths: [routes.coralWorksWithHelm],
  },
  {
    file: "coral-works-with-terraform",
    words: "Coral works with Terraform",
    paths: [routes.coralWorksWithTerraform],
  },
  { file: "assessment", words: "Free cloud cost assessment", paths: ["/assessment"] },
  { file: "docs", words: "Product guides, FAQs and one-pagers", paths: ["/docs"] },
  { file: "coral-guide", words: "Coral product guide", paths: [routes.coralGuide] },
  { file: "coral-faq", words: "Coral FAQ", paths: [routes.coralFaq] },
  { file: "amoeba-guide", words: "Amoeba product guide", paths: [routes.amoebaGuide] },
  { file: "amoeba-faq", words: "Amoeba FAQ", paths: [routes.amoebaFaq] },
  {
    file: "docs-install-coral-with-helm",
    words: "Install Coral with Helm",
    paths: ["/docs/install-coral-with-helm"],
  },
  {
    file: "docs-install-coral-with-terraform",
    words: "Install Coral with Terraform + Helm",
    paths: ["/docs/install-coral-with-terraform"],
  },
  {
    file: "docs-contributing",
    words: "Contributing to our open source",
    paths: ["/docs/contributing"],
  },
  {
    file: "coral-troubleshooting",
    words: "Coral troubleshooting",
    paths: [routes.coralTroubleshooting],
  },
  {
    file: "amoeba-troubleshooting",
    words: "Amoeba troubleshooting",
    paths: [routes.amoebaTroubleshooting],
  },
  { file: "open-source", words: "Open source", paths: ["/open-source"] },
  { file: "learn", words: "Cloud cost optimization guides", paths: ["/learn"] },
  {
    file: "cloud-cost-optimization-tools",
    words: "Cloud cost optimization tools",
    paths: [routes.cloudCostTools],
  },
  {
    file: "kubernetes-cost-tools",
    words: "Kubernetes cost tools compared",
    paths: comparisonsOf("coral"),
  },
  {
    file: "block-storage-tools",
    words: "Block storage tools compared",
    paths: comparisonsOf("amoeba"),
  },
  {
    file: "value-lab",
    words: "What Coral and Amoeba reduced on real cloud bills",
    paths: ["/value-lab"],
  },
  {
    file: "value-lab-coral-dev-cluster",
    words: "How we reduced our own cluster’s machine bill by 58%",
    paths: [routes.caseStudyCoralDevCluster],
  },
  {
    file: "value-lab-amoeba-lab-vms",
    words: "How Amoeba rightsized our own lab VM’s btrfs pool by 25%",
    paths: [routes.caseStudyAmoebaLabVms],
  },
  { file: "events", words: "Cloud cost, FinOps and Kubernetes events", paths: ["/events"] },
  { file: "news", words: "Cloud cost, Kubernetes and FinOps updates", paths: ["/news"] },
  { file: "community", words: "FinOps and cloud cost communities", paths: ["/community"] },
  {
    file: "research-cloud-cost-optimization",
    words: "Cloud cost optimization research",
    paths: [routes.research],
  },
  { file: "about", words: "Who builds Coral and Amoeba", paths: ["/about"] },
  { file: "careers", words: "Work with us, remotely", paths: ["/careers"] },
  { file: "brand-assets", words: "The Zoorik logo, colours and words", paths: ["/brand-assets"] },
  { file: "referrals", words: "Referral program", paths: ["/referrals"] },
  { file: "partners", words: "Partner program", paths: ["/partners"] },
  { file: "design-partners", words: "Design partner program", paths: ["/design-partners"] },
  { file: "marketplaces", words: "Marketplaces, reviews and installs", paths: ["/marketplaces"] },
  { file: "privacy", words: "Privacy policy", paths: ["/privacy"] },
  { file: "terms", words: "Terms of use", paths: ["/terms"] },
  { file: "security", words: "Security and data handling", paths: ["/security"] },
  {
    file: "node-cost-calculator",
    words: "Kubernetes node cost calculator",
    paths: [routes.nodeCostCalculator],
  },
  {
    file: "disk-cost-calculator",
    words: "Disk cost calculator: Azure disks and Amazon EBS",
    paths: [routes.diskCostCalculator],
  },
  { file: "pricing", words: "How Coral and Amoeba are priced", paths: [routes.pricing] },
  { file: "contact", words: "Contact Zoorik", paths: [routes.contact] },
  { file: "trust", words: "Security overview, DPA and sub-processors", paths: [routes.trust] },
  { file: "login", words: "Sign in", paths: ["/login"] },
  {
    file: "learn-azure-disk-cost-optimization",
    words: "Azure disk cost optimization",
    paths: ["/learn/azure-disk-cost-optimization"],
  },
  {
    file: "learn-change-eks-node-group-instance-type",
    words: "How to change an EKS node group instance type",
    paths: ["/learn/change-eks-node-group-instance-type"],
  },
  {
    file: "learn-cluster-autoscaler-not-scaling-down",
    words: "Cluster Autoscaler not scaling down on AKS and EKS",
    paths: ["/learn/cluster-autoscaler-not-scaling-down"],
  },
  {
    file: "learn-find-unattached-disks-azure",
    words: "How to find unattached disks in Azure and clean up",
    paths: ["/learn/find-unattached-disks-azure"],
  },
  {
    file: "learn-how-to-reduce-cloud-costs",
    words: "How to reduce cloud costs: what moves the bill",
    paths: ["/learn/how-to-reduce-cloud-costs"],
  },
  {
    file: "learn-hpa-vs-vpa-vs-cluster-autoscaler",
    words: "HPA vs VPA vs Cluster Autoscaler, plus Karpenter",
    paths: ["/learn/hpa-vs-vpa-vs-cluster-autoscaler"],
  },
  {
    file: "learn-kubernetes-cost-estimation",
    words: "Kubernetes cost estimation for AKS and EKS",
    paths: ["/learn/kubernetes-cost-estimation"],
  },
  {
    file: "learn-kubernetes-pod-right-sizing",
    words: "Kubernetes pod rebalancing",
    paths: ["/learn/kubernetes-pod-right-sizing"],
  },
  {
    file: "learn-poor-architecture-cloud-bill",
    words: "How poor architecture increases your cloud bill",
    paths: ["/learn/poor-architecture-cloud-bill"],
  },
  {
    file: "learn-reduce-kubernetes-cost",
    words: "How to reduce Kubernetes cost: requests, then nodes",
    paths: ["/learn/reduce-kubernetes-cost"],
  },
  {
    file: "learn-shrink-azure-managed-disk",
    words: "Can a managed disk shrink?",
    paths: ["/learn/shrink-azure-managed-disk"],
  },
  { file: "learn-vpa-vs-hpa", words: "VPA vs HPA", paths: ["/learn/vpa-vs-hpa"] },
  {
    file: "learn-azure-vm-disk-usage",
    words: "Azure VM disk usage: check used vs provisioned",
    paths: ["/learn/azure-vm-disk-usage"],
  },
  {
    file: "learn-check-ebs-volume-usage",
    words: "How to check EBS volume usage: used vs paid space",
    paths: ["/learn/check-ebs-volume-usage"],
  },
  {
    file: "learn-keda-vs-karpenter",
    words: "KEDA vs Karpenter: pods, nodes and pod requests",
    paths: ["/learn/keda-vs-karpenter"],
  },
  {
    file: "learn-kubernetes-allocatable-vs-capacity",
    words: "Kubernetes allocatable vs capacity on AKS and EKS",
    paths: ["/learn/kubernetes-allocatable-vs-capacity"],
  },
  {
    file: "learn-limitrange-vs-resourcequota",
    words: "LimitRange vs ResourceQuota: what caps requests",
    paths: ["/learn/limitrange-vs-resourcequota"],
  },
  {
    file: "learn-safe-to-evict-do-not-disrupt",
    words: "Safe-to-evict and do-not-disrupt annotations",
    paths: ["/learn/safe-to-evict-do-not-disrupt"],
  },
  {
    file: "learn-shrink-xfs-filesystem",
    words: "Shrink an XFS filesystem: what works instead",
    paths: ["/learn/shrink-xfs-filesystem"],
  },
  {
    file: "learn-btrfs-multiple-disks",
    words: "btrfs on multiple disks: how a btrfs pool works",
    paths: ["/learn/btrfs-multiple-disks"],
  },
  {
    file: "learn-btrfs-unallocated-space",
    words: "btrfs unallocated space vs free space, explained",
    paths: ["/learn/btrfs-unallocated-space"],
  },
  {
    file: "learn-azure-disk-snapshot-cost",
    words: "Azure disk snapshot cost: incremental vs full",
    paths: ["/learn/azure-disk-snapshot-cost"],
  },
  /* The glossary's hub, then each term by its h1. */
  {
    file: "glossary",
    words: "Cloud cost glossary",
    paths: ["/learn/glossary"],
  },
  {
    file: "glossary-amortized-cost",
    words: "What is amortized cost in Azure and AWS?",
    paths: ["/learn/glossary/amortized-cost"],
  },
  {
    file: "glossary-aws-instance-families",
    words: "What are AWS instance families?",
    paths: ["/learn/glossary/aws-instance-families"],
  },
  {
    file: "glossary-azure-cobalt",
    words: "What is Azure Cobalt?",
    paths: ["/learn/glossary/azure-cobalt"],
  },
  {
    file: "glossary-azure-disk-sizes",
    words: "What are Azure disk sizes (P10, P30, E10)?",
    paths: ["/learn/glossary/azure-disk-sizes"],
  },
  {
    file: "glossary-azure-hybrid-benefit",
    words: "What is Azure Hybrid Benefit?",
    paths: ["/learn/glossary/azure-hybrid-benefit"],
  },
  {
    file: "glossary-azure-macc",
    words: "What is Azure MACC?",
    paths: ["/learn/glossary/azure-macc"],
  },
  {
    file: "glossary-azure-managed-disk",
    words: "What is an Azure managed disk?",
    paths: ["/learn/glossary/azure-managed-disk"],
  },
  {
    file: "glossary-azure-premium-ssd",
    words: "What is Premium SSD in Azure?",
    paths: ["/learn/glossary/azure-premium-ssd"],
  },
  {
    file: "glossary-azure-standard-hdd",
    words: "What is Azure Standard HDD?",
    paths: ["/learn/glossary/azure-standard-hdd"],
  },
  {
    file: "glossary-azure-temporary-disk",
    words: "What is the Azure temporary disk?",
    paths: ["/learn/glossary/azure-temporary-disk"],
  },
  {
    file: "glossary-azure-ultra-disk",
    words: "What is Ultra Disk in Azure?",
    paths: ["/learn/glossary/azure-ultra-disk"],
  },
  {
    file: "glossary-azure-vm-series",
    words: "What is an Azure VM series?",
    paths: ["/learn/glossary/azure-vm-series"],
  },
  {
    file: "glossary-blended-vs-unblended-cost",
    words: "Blended vs unblended cost: meaning and cost impact",
    paths: ["/learn/glossary/blended-vs-unblended-cost"],
  },
  {
    file: "glossary-block-storage",
    words: "What is block storage?",
    paths: ["/learn/glossary/block-storage"],
  },
  {
    file: "glossary-burstable-instance",
    words: "What is a burstable instance?",
    paths: ["/learn/glossary/burstable-instance"],
  },
  {
    file: "glossary-cloud-chargeback",
    words: "What is chargeback in cloud computing?",
    paths: ["/learn/glossary/cloud-chargeback"],
  },
  {
    file: "glossary-cloud-cost-anomaly-detection",
    words: "What is cloud cost anomaly detection?",
    paths: ["/learn/glossary/cloud-cost-anomaly-detection"],
  },
  {
    file: "glossary-cloud-cost-governance",
    words: "What is cloud cost governance?",
    paths: ["/learn/glossary/cloud-cost-governance"],
  },
  {
    file: "glossary-cloud-tagging-strategy",
    words: "What is a cloud tagging strategy?",
    paths: ["/learn/glossary/cloud-tagging-strategy"],
  },
  {
    file: "glossary-cloud-tco",
    words: "What is cloud TCO (total cost of ownership)?",
    paths: ["/learn/glossary/cloud-tco"],
  },
  {
    file: "glossary-cloud-unit-economics",
    words: "What is cloud unit economics?",
    paths: ["/learn/glossary/cloud-unit-economics"],
  },
  {
    file: "glossary-cost-allocation-tags",
    words: "What are cost allocation tags?",
    paths: ["/learn/glossary/cost-allocation-tags"],
  },
  {
    file: "glossary-daemonset",
    words: "What is a DaemonSet in Kubernetes?",
    paths: ["/learn/glossary/daemonset"],
  },
  {
    file: "glossary-df-vs-du",
    words: "df vs du: meaning and cost impact",
    paths: ["/learn/glossary/df-vs-du"],
  },
  {
    file: "glossary-disk-latency",
    words: "What is disk latency?",
    paths: ["/learn/glossary/disk-latency"],
  },
  {
    file: "glossary-disk-snapshot",
    words: "What is a disk snapshot in Azure and AWS?",
    paths: ["/learn/glossary/disk-snapshot"],
  },
  {
    file: "glossary-disk-throughput",
    words: "What is disk throughput?",
    paths: ["/learn/glossary/disk-throughput"],
  },
  {
    file: "glossary-ebs-gp3",
    words: "What is gp3 in AWS?",
    paths: ["/learn/glossary/ebs-gp3"],
  },
  {
    file: "glossary-ebs-optimized-instance",
    words: "What is an EBS-optimized instance?",
    paths: ["/learn/glossary/ebs-optimized-instance"],
  },
  {
    file: "glossary-ebs-volume",
    words: "What is an EBS volume?",
    paths: ["/learn/glossary/ebs-volume"],
  },
  {
    file: "glossary-effective-savings-rate",
    words: "What is effective savings rate (ESR)?",
    paths: ["/learn/glossary/effective-savings-rate"],
  },
  {
    file: "glossary-egress-cost",
    words: "What is egress cost in the cloud?",
    paths: ["/learn/glossary/egress-cost"],
  },
  {
    file: "glossary-eks-auto-mode",
    words: "What is EKS Auto Mode?",
    paths: ["/learn/glossary/eks-auto-mode"],
  },
  {
    file: "glossary-ephemeral-os-disk",
    words: "What is an ephemeral OS disk?",
    paths: ["/learn/glossary/ephemeral-os-disk"],
  },
  {
    file: "glossary-finops",
    words: "What is FinOps?",
    paths: ["/learn/glossary/finops"],
  },
  {
    file: "glossary-finops-maturity-model",
    words: "What is the FinOps maturity model?",
    paths: ["/learn/glossary/finops-maturity-model"],
  },
  {
    file: "glossary-finops-personas",
    words: "What are FinOps personas?",
    paths: ["/learn/glossary/finops-personas"],
  },
  {
    file: "glossary-horizontal-pod-autoscaler",
    words: "What is HPA (Horizontal Pod Autoscaler)?",
    paths: ["/learn/glossary/horizontal-pod-autoscaler"],
  },
  {
    file: "glossary-instance-store",
    words: "What is instance store in AWS?",
    paths: ["/learn/glossary/instance-store"],
  },
  {
    file: "glossary-iops",
    words: "What is IOPS?",
    paths: ["/learn/glossary/iops"],
  },
  {
    file: "glossary-kubernetes-cluster-utilization",
    words: "What is Kubernetes cluster utilization?",
    paths: ["/learn/glossary/kubernetes-cluster-utilization"],
  },
  {
    file: "glossary-kubernetes-cost-allocation",
    words: "What is Kubernetes cost allocation?",
    paths: ["/learn/glossary/kubernetes-cost-allocation"],
  },
  {
    file: "glossary-kubernetes-cpu-throttling",
    words: "What is CPU throttling in Kubernetes?",
    paths: ["/learn/glossary/kubernetes-cpu-throttling"],
  },
  {
    file: "glossary-kubernetes-headroom",
    words: "What is headroom in Kubernetes?",
    paths: ["/learn/glossary/kubernetes-headroom"],
  },
  {
    file: "glossary-kubernetes-qos-class",
    words: "What is a QoS class in Kubernetes?",
    paths: ["/learn/glossary/kubernetes-qos-class"],
  },
  {
    file: "glossary-kubernetes-resource-limits",
    words: "What are resource limits in Kubernetes?",
    paths: ["/learn/glossary/kubernetes-resource-limits"],
  },
  {
    file: "glossary-kubernetes-resource-requests",
    words: "What are resource requests in Kubernetes?",
    paths: ["/learn/glossary/kubernetes-resource-requests"],
  },
  {
    file: "glossary-max-pods-per-node",
    words: "Max pods per node: meaning and cost impact",
    paths: ["/learn/glossary/max-pods-per-node"],
  },
  {
    file: "glossary-node-pool",
    words: "What is a node pool in Kubernetes?",
    paths: ["/learn/glossary/node-pool"],
  },
  {
    file: "glossary-on-demand-instance",
    words: "What is an on-demand instance?",
    paths: ["/learn/glossary/on-demand-instance"],
  },
  {
    file: "glossary-pod-disruption-budget",
    words: "What is a Pod Disruption Budget (PDB)?",
    paths: ["/learn/glossary/pod-disruption-budget"],
  },
  {
    file: "glossary-provisioned-iops",
    words: "What is provisioned IOPS?",
    paths: ["/learn/glossary/provisioned-iops"],
  },
  {
    file: "glossary-reserved-instance",
    words: "What is a reserved instance?",
    paths: ["/learn/glossary/reserved-instance"],
  },
  {
    file: "glossary-rightsizing",
    words: "What is rightsizing in cloud?",
    paths: ["/learn/glossary/rightsizing"],
  },
  {
    file: "glossary-savings-plan",
    words: "What is a savings plan (AWS and Azure)?",
    paths: ["/learn/glossary/savings-plan"],
  },
  {
    file: "glossary-savings-plan-coverage-vs-utilization",
    words: "What is savings plan coverage vs utilization?",
    paths: ["/learn/glossary/savings-plan-coverage-vs-utilization"],
  },
  {
    file: "glossary-showback",
    words: "What is showback in FinOps?",
    paths: ["/learn/glossary/showback"],
  },
  {
    file: "glossary-spot-instance",
    words: "What is a spot instance?",
    paths: ["/learn/glossary/spot-instance"],
  },
  {
    file: "glossary-thin-provisioning",
    words: "What is thin provisioning?",
    paths: ["/learn/glossary/thin-provisioning"],
  },
  {
    file: "glossary-vertical-pod-autoscaler",
    words: "What is VPA (Vertical Pod Autoscaler)?",
    paths: ["/learn/glossary/vertical-pod-autoscaler"],
  },
];

const sentence = (words: string): string => (/[.?!]$/.test(words) ? words : `${words}.`);

export const pageCards: Readonly<Record<string, ShareImage>> = Object.fromEntries(
  CARDS.flatMap(({ file, words, paths }) =>
    paths.map((path) => [path, shareImage(`/og/pages/${file}.png`, `Zoorik. ${sentence(words)}`)]),
  ),
);

/** A page's card: its own; else, for a glossary term, the glossary's; for a Learn article, the /learn card; else the
 *  brand card. */
export const cardFor = (path: string): ShareImage =>
  pageCards[path] ??
  (path.startsWith("/learn/glossary/") ? pageCards["/learn/glossary"] : undefined) ??
  (path.startsWith("/learn/") ? pageCards["/learn"] : undefined) ??
  socialImage;

type OpenGraph = NonNullable<Metadata["openGraph"]>;

/** No title, description or url here: each page sets its own. */
export const baseOpenGraph = {
  type: "website",
  siteName: site.name,
  locale: "en_US",
  images: [socialImage],
} satisfies OpenGraph;

/** No separate X image: Next copies openGraph.images into the twitter:* tags. */
export const baseTwitter = {
  card: "summary_large_image",
  site: xHandle,
  creator: xHandle,
} satisfies NonNullable<Metadata["twitter"]>;

/** Metadata merges shallowly: a page's openGraph replaces the layout's. Always go through this. */
export function pageOpenGraph(
  path: `/${string}`,
  copy: { readonly title: string; readonly description: string },
  image?: ShareImage,
): OpenGraph {
  return {
    ...baseOpenGraph,
    images: [image ?? cardFor(path)],
    url: path,
    ...copy,
  };
}
