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
/**
 * A product's comparison pages, its alternatives page then its versus pages: they share one card, except a versus page
 * with its own (`card`, below).
 */
const comparisonsOf = (product: ProductId): `/${string}`[] => [
  ...alternativesPages
    .filter((page) => page.product === product)
    .map((page) => page.route as `/${string}`),
  ...versusPages.filter((page) => page.product === product && !page.card).map(versusRoute),
];

/** A versus page with its own card, `public/og/pages/<slug>.png`, whose words are its title. */
const versusCard = (slug: string): { file: string; words: string; paths: `/${string}`[] } => {
  const page = versusPages.find((entry) => entry.slug === slug && entry.card);
  if (!page) throw new Error(`No live versus page "${slug}" has its own card.`);
  return { file: page.slug, words: page.meta.title, paths: [versusRoute(page)] };
};

const CARDS: readonly {
  readonly file: string;
  readonly words: string;
  readonly paths: readonly `/${string}`[];
}[] = [
  {
    file: "coral-kubernetes-optimization",
    words: "Kubernetes optimization for AKS and EKS",
    paths: ["/coral"],
  },
  { file: "amoeba", words: "Block storage cost optimization on Azure and AWS", paths: ["/amoeba"] },
  /* Each product on each cloud, then the six pages on what Coral works with (31 Oct 2026). */
  {
    file: "aks-cost-optimization",
    words: "AKS cost optimization with Coral",
    paths: [routes.aksCostOptimization],
  },
  {
    file: "eks-cost-optimization",
    words: "EKS cost optimization with Coral",
    paths: [routes.eksCostOptimization],
  },
  {
    file: "azure-managed-disk-cost-optimization",
    words: "Azure managed disk cost optimization with Amoeba",
    paths: [routes.azureManagedDiskCostOptimization],
  },
  {
    file: "ebs-cost-optimization",
    words: "EBS cost optimization with Amoeba",
    paths: [routes.ebsCostOptimization],
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
  /* The two Topic pages (1 Nov 2026). */
  {
    file: "azure-cost-optimization",
    words: "Azure cost optimization: how to reduce Azure costs",
    paths: [routes.azureCostOptimization],
  },
  {
    file: "aws-cost-optimization",
    words: "AWS cost optimization: how to reduce AWS costs",
    paths: [routes.awsCostOptimization],
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
  {
    file: "kubernetes-and-block-storage-cost-guides",
    words: "Kubernetes and block storage cost guides",
    paths: ["/learn"],
  },
  {
    file: "cloud-cost-optimization-and-finops-tools",
    words: "Cloud cost optimization tools and FinOps tools",
    paths: [routes.cloudCostTools],
  },
  {
    file: "kubernetes-cost-tools",
    words: "Kubernetes cost tools compared",
    paths: comparisonsOf("coral"),
  },
  /* Coral's two versus pages against the clouds' own tools (1 Nov 2026), each with its own card. */
  versusCard("coral-vs-azure-advisor"),
  versusCard("coral-vs-aws-compute-optimizer"),
  {
    file: "block-storage-tools",
    words: "Block storage tools compared",
    paths: comparisonsOf("amoeba"),
  },
  {
    file: "value-lab-at-list-prices",
    words: "What Coral and Amoeba reduced, every figure at list prices",
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
    file: "eks-pricing-and-aks-pricing-calculator",
    words: "EKS pricing and AKS pricing calculator for nodes",
    paths: [routes.eksAndAksPricingCalculator],
  },
  {
    file: "amazon-ebs-pricing-and-azure-disk-cost-calculator",
    words: "Amazon EBS pricing and Azure disk cost calculator",
    paths: [routes.ebsAndAzureDiskPricing],
  },
  { file: "pricing", words: "How Coral and Amoeba are priced", paths: [routes.pricing] },
  { file: "contact", words: "Contact Zoorik", paths: [routes.contact] },
  { file: "trust", words: "Security overview, DPA and sub-processors", paths: [routes.trust] },
  { file: "login", words: "Sign in", paths: ["/login"] },
  {
    file: "learn-azure-disk-reservations",
    words: "Azure disk reservations: are they worth it?",
    paths: ["/learn/azure-disk-reservations"],
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
    file: "learn-find-unattached-disks-in-azure",
    words: "Find unattached disks in Azure and clean them up",
    paths: ["/learn/find-unattached-disks-azure"],
  },
  {
    file: "cloud-cost-optimization",
    words: "Cloud cost optimization: how to reduce cloud costs",
    paths: [routes.cloudCostOptimization],
  },
  {
    file: "learn-kubernetes-autoscaling-hpa-and-cluster-autoscaler",
    words: "Kubernetes autoscaling: HPA and Cluster Autoscaler",
    paths: ["/learn/kubernetes-autoscaling"],
  },
  {
    file: "learn-kubernetes-cost-estimation",
    words: "Kubernetes cost estimation for AKS and EKS",
    paths: ["/learn/kubernetes-cost-estimation"],
  },
  {
    file: "learn-kubernetes-pod-right-sizing-step-by-step",
    words: "Kubernetes pod right sizing, step by step",
    paths: ["/learn/kubernetes-pod-right-sizing"],
  },
  {
    file: "learn-poor-architecture-cloud-costs",
    words: "How poor architecture increases your cloud costs",
    paths: ["/learn/poor-architecture-cloud-bill"],
  },
  {
    file: "kubernetes-cost-optimization",
    words: "Kubernetes cost optimization: requests, then nodes",
    paths: [routes.kubernetesCostOptimization],
  },
  {
    file: "learn-shrink-an-azure-managed-disk",
    words: "Shrink an Azure managed disk: copy to a smaller one",
    paths: ["/learn/shrink-azure-managed-disk"],
  },
  {
    file: "learn-hpa-vs-vpa-in-kubernetes",
    words: "HPA vs VPA in Kubernetes: when to use which",
    paths: ["/learn/vpa-vs-hpa"],
  },
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
    file: "learn-keda-vs-karpenter-when-to-use-each",
    words: "KEDA vs Karpenter: when to use each or both",
    paths: ["/learn/keda-vs-karpenter"],
  },
  {
    file: "learn-kubernetes-allocatable-vs-capacity",
    words: "Kubernetes allocatable vs capacity on AKS and EKS",
    paths: ["/learn/kubernetes-allocatable-vs-capacity"],
  },
  {
    file: "learn-namespace-limits-limitrange-vs-resourcequota",
    words: "Namespace limits: LimitRange vs ResourceQuota",
    paths: ["/learn/limitrange-vs-resourcequota"],
  },
  {
    file: "learn-karpenter-do-not-disrupt-vs-safe-to-evict",
    words: "Karpenter do-not-disrupt vs safe-to-evict",
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
  /* The articles and guides of the 1 Nov 2026 release, each by its title. */
  {
    file: "learn-aks-cost-analysis",
    words: "AKS cost analysis: what the add-on shows",
    paths: ["/learn/aks-cost-analysis"],
  },
  {
    file: "learn-aks-node-auto-provisioning",
    words: "AKS node auto provisioning (NAP): how to enable it",
    paths: ["/learn/aks-node-auto-provisioning"],
  },
  {
    file: "learn-aks-storage-classes",
    words: "AKS storage classes: which Azure disk each creates",
    paths: ["/learn/aks-storage-classes"],
  },
  {
    file: "learn-aks-vs-eks-control-plane-fees",
    words: "AKS vs EKS: control plane fees and extended support",
    paths: ["/learn/aks-vs-eks-cost"],
  },
  {
    file: "learn-azure-disk-expand-without-downtime",
    words: "Azure disk expand without downtime, step by step",
    paths: ["/learn/azure-disk-expand-without-downtime"],
  },
  {
    file: "learn-azure-disk-iops-vs-throughput",
    words: "Azure disk IOPS vs throughput: what limits disks",
    paths: ["/learn/azure-disk-iops-vs-throughput"],
  },
  {
    file: "learn-azure-lrs-vs-zrs-disks",
    words: "Azure LRS vs ZRS disks: what zone redundancy costs",
    paths: ["/learn/azure-disk-lrs-vs-zrs"],
  },
  {
    file: "learn-azure-disk-performance-tiers",
    words: "Azure disk performance tiers and bursting",
    paths: ["/learn/azure-disk-performance-tiers"],
  },
  {
    file: "learn-azure-managed-disk-types",
    words: "Azure disk types: pricing and how to choose",
    paths: ["/learn/azure-managed-disk-types"],
  },
  {
    file: "learn-azure-vm-disk-space-alert",
    words: "Azure VM disk space alert in Azure Monitor",
    paths: ["/learn/azure-vm-disk-space-alert"],
  },
  {
    file: "learn-btrfs-device-remove",
    words: "btrfs device remove: take a disk out of a pool",
    paths: ["/learn/btrfs-device-remove"],
  },
  {
    file: "learn-btrfs-vs-ext4-vs-xfs",
    words: "btrfs vs ext4 vs XFS: which one can shrink?",
    paths: ["/learn/btrfs-vs-lvm"],
  },
  {
    file: "learn-change-aks-node-pool-vm-size",
    words: "How to change an AKS node pool VM size",
    paths: ["/learn/change-aks-node-pool-vm-size"],
  },
  {
    file: "learn-cluster-autoscaler-overprovisioning",
    words: "Cluster Autoscaler overprovisioning with pause pods",
    paths: ["/learn/cluster-autoscaler-overprovisioning"],
  },
  {
    file: "learn-combine-ebs-volumes",
    words: "Combine EBS volumes into one: LVM, RAID 0 or btrfs",
    paths: ["/learn/combine-ebs-volumes"],
  },
  {
    file: "learn-compute-optimizer-ebs",
    words: "AWS Compute Optimizer for EBS: what it recommends",
    paths: ["/learn/compute-optimizer-ebs"],
  },
  {
    file: "learn-cordon-vs-drain",
    words: "Cordon vs drain in Kubernetes: what each does",
    paths: ["/learn/cordon-vs-drain"],
  },
  {
    file: "learn-ebs-elastic-volumes",
    words: "EBS Elastic Volumes: what you can and can’t change",
    paths: ["/learn/ebs-elastic-volumes"],
  },
  {
    file: "learn-ebs-snapshot-cost",
    words: "EBS snapshot cost: pricing and how to reduce it",
    paths: ["/learn/ebs-snapshot-cost"],
  },
  {
    file: "learn-ebs-volume-types",
    words: "EBS volume types: pricing and how to choose",
    paths: ["/learn/ebs-volume-types"],
  },
  {
    file: "learn-gp2-vs-gp3",
    words: "gp2 vs gp3: pricing, performance and migration",
    paths: ["/learn/gp2-vs-gp3"],
  },
  {
    file: "learn-how-to-choose-aks-node-sizes",
    words: "How to choose AKS node sizes: VM series and price",
    paths: ["/learn/how-to-choose-aks-node-sizes"],
  },
  {
    file: "learn-how-to-choose-eks-instance-types",
    words: "EKS instance types: how to choose family and size",
    paths: ["/learn/how-to-choose-eks-instance-types"],
  },
  {
    file: "learn-inplacepodverticalscaling",
    words: "InPlacePodVerticalScaling: in-place pod resize",
    paths: ["/learn/in-place-pod-resize"],
  },
  {
    file: "learn-increase-ebs-volume-size",
    words: "Increase EBS volume size without downtime on Linux",
    paths: ["/learn/increase-ebs-volume-size"],
  },
  {
    file: "learn-io2-vs-gp3-io2-block-express",
    words: "io2 vs gp3: when io2 Block Express is worth it",
    paths: ["/learn/io2-vs-gp3"],
  },
  {
    file: "learn-is-btrfs-stable",
    words: "Is btrfs stable in 2026? Feature by feature",
    paths: ["/learn/is-btrfs-stable"],
  },
  {
    file: "learn-karpenter-consolidation",
    words: "Karpenter consolidation: policies, budgets, limits",
    paths: ["/learn/karpenter-consolidation"],
  },
  {
    file: "learn-karpenter-cost-optimization",
    words: "Karpenter cost optimization: the request gap",
    paths: ["/learn/karpenter-cost-optimization"],
  },
  {
    file: "learn-karpenter-vs-cluster-autoscaler",
    words: "Karpenter vs Cluster Autoscaler on EKS and AKS",
    paths: ["/learn/karpenter-vs-cluster-autoscaler"],
  },
  {
    file: "learn-keda-vs-hpa-vs-vpa",
    words: "KEDA vs HPA vs VPA: where event-driven scaling fits",
    paths: ["/learn/keda-vs-hpa-vs-vpa"],
  },
  {
    file: "learn-kubernetes-bin-packing",
    words: "Kubernetes bin packing: same pods, fewer nodes",
    paths: ["/learn/kubernetes-bin-packing"],
  },
  {
    file: "learn-kubernetes-descheduler",
    words: "Kubernetes descheduler: what it moves and when",
    paths: ["/learn/kubernetes-descheduler"],
  },
  {
    file: "learn-kubectl-drain-node-without-any-downtime",
    words: "kubectl drain node without any downtime",
    paths: ["/learn/kubernetes-drain-node-without-downtime"],
  },
  {
    file: "learn-kubernetes-node-size-best-practices",
    words: "Kubernetes node size best practices on AKS and EKS",
    paths: ["/learn/kubernetes-node-size-best-practices"],
  },
  {
    file: "learn-kubernetes-overprovisioning",
    words: "Kubernetes overprovisioning: how to measure it",
    paths: ["/learn/kubernetes-overprovisioning"],
  },
  {
    file: "learn-exit-code-137-oomkilled-in-kubernetes",
    words: "Exit code 137 (OOMKilled) in Kubernetes: how to fix",
    paths: ["/learn/oomkilled-exit-code-137"],
  },
  {
    file: "learn-kubernetes-node-affinity-vs-pod-affinity",
    words: "Kubernetes node affinity vs pod affinity",
    paths: ["/learn/pod-affinity-vs-node-affinity"],
  },
  {
    file: "learn-pod-disruption-budget-best-practices",
    words: "Pod disruption budget best practices: AKS and EKS",
    paths: ["/learn/pod-disruption-budget-best-practices"],
  },
  {
    file: "learn-premium-ssd-v2-vs-premium-ssd",
    words: "Premium SSD v2 vs Premium SSD: which costs less",
    paths: ["/learn/premium-ssd-v2-vs-premium-ssd"],
  },
  {
    file: "learn-azure-premium-ssd-vs-standard-ssd",
    words: "Azure Premium SSD vs Standard SSD: what you pay for",
    paths: ["/learn/premium-ssd-vs-standard-ssd-azure"],
  },
  {
    file: "learn-remove-disk-from-lvm",
    words: "Remove a disk from LVM without losing data",
    paths: ["/learn/remove-disk-from-lvm"],
  },
  {
    file: "learn-expand-a-pvc-in-kubernetes",
    words: "Expand a PVC in Kubernetes, and why it can’t shrink",
    paths: ["/learn/resize-pvc-kubernetes"],
  },
  {
    file: "learn-resize2fs-shrink-ext4",
    words: "resize2fs shrink ext4: why it must be unmounted",
    paths: ["/learn/resize2fs-shrink-ext4"],
  },
  {
    file: "learn-how-to-shrink-an-aws-ebs-volume",
    words: "How to shrink an AWS EBS volume when it only grows",
    paths: ["/learn/shrink-ebs-volume"],
  },
  {
    file: "learn-kubernetes-topologyspreadconstraints-and-maxskew",
    words: "Kubernetes topologySpreadConstraints and maxSkew",
    paths: ["/learn/topology-spread-constraints"],
  },
  {
    file: "learn-what-is-karpenter-the-kubernetes-node-autoscaler",
    words: "What is Karpenter? The Kubernetes node autoscaler",
    paths: ["/learn/what-is-karpenter"],
  },
  {
    file: "learn-what-is-keda-kubernetes-event-driven-autoscaling",
    words: "What is KEDA? Kubernetes event-driven autoscaling",
    paths: ["/learn/what-is-keda"],
  },
  /* The articles of the 2 Nov 2026 release, each by its title. */
  {
    file: "learn-aws-nat-gateway-pricing",
    words: "AWS NAT gateway pricing and how to reduce it",
    paths: ["/learn/aws-nat-gateway-pricing"],
  },
  {
    file: "learn-exit-code-143",
    words: "Exit code 143 in Kubernetes: SIGTERM explained",
    paths: ["/learn/exit-code-143"],
  },
  {
    file: "learn-kubernetes-architecture",
    words: "Kubernetes architecture: control plane and nodes",
    paths: ["/learn/kubernetes-architecture"],
  },
  {
    file: "learn-kubernetes-ephemeral-storage",
    words: "Kubernetes ephemeral storage: limits and eviction",
    paths: ["/learn/kubernetes-ephemeral-storage"],
  },
  {
    file: "learn-kubernetes-explained-simply",
    words: "What is Kubernetes? Kubernetes explained simply",
    paths: ["/learn/kubernetes-explained-simply"],
  },
  {
    file: "learn-kubernetes-persistent-volume",
    words: "Kubernetes persistent volume and PVC explained",
    paths: ["/learn/kubernetes-persistent-volume"],
  },
  {
    file: "learn-kubernetes-taints-and-tolerations",
    words: "Kubernetes taints and tolerations explained",
    paths: ["/learn/kubernetes-taints-and-tolerations"],
  },
  {
    file: "learn-statefulset-vs-deployment",
    words: "StatefulSet vs Deployment in Kubernetes",
    paths: ["/learn/statefulset-vs-deployment"],
  },
  /* The glossary's hub, then each term by its h1. */
  {
    file: "cloud-computing-terms-cloud-cost-glossary",
    words: "Cloud computing terms: a cloud cost glossary",
    paths: ["/learn/glossary"],
  },
  {
    file: "glossary-aks",
    words: "What is AKS (Azure Kubernetes Service)?",
    paths: ["/learn/glossary/aks"],
  },
  {
    file: "glossary-amortized-cost",
    words: "What is amortized cost in Azure and AWS?",
    paths: ["/learn/glossary/amortized-cost"],
  },
  {
    file: "glossary-aws-edp",
    words: "What is AWS EDP (Enterprise Discount Program)?",
    paths: ["/learn/glossary/aws-edp"],
  },
  {
    file: "glossary-aws-graviton",
    words: "What is AWS Graviton? Graviton instances explained",
    paths: ["/learn/glossary/aws-graviton"],
  },
  {
    file: "glossary-aws-instance-families-ec2-instance-types",
    words: "EC2 instance types and AWS instance families",
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
    file: "glossary-azure-hybrid-benefit-ahb",
    words: "What is Azure Hybrid Benefit (AHB)?",
    paths: ["/learn/glossary/azure-hybrid-benefit"],
  },
  {
    file: "glossary-azure-macc",
    words: "What is Azure MACC?",
    paths: ["/learn/glossary/azure-macc"],
  },
  {
    file: "glossary-azure-managed-disk-azure-disk",
    words: "Azure disk: what is an Azure managed disk?",
    paths: ["/learn/glossary/azure-managed-disk"],
  },
  {
    file: "glossary-azure-premium-ssd-premium-storage",
    words: "Azure Premium SSD: what is Azure premium storage?",
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
    file: "glossary-azure-ultra-disk-explained",
    words: "What is Azure Ultra Disk?",
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
    file: "glossary-btrfs",
    words: "What is btrfs? The btrfs filesystem in Linux",
    paths: ["/learn/glossary/btrfs"],
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
    file: "glossary-cloud-tco-total-cost-of-ownership",
    words: "What is cloud total cost of ownership (TCO)?",
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
    file: "glossary-daemonset-kubernetes",
    words: "What is a Kubernetes DaemonSet?",
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
    file: "glossary-disk-throughput-disk-io-speed",
    words: "What is disk throughput? Disk I/O speed explained",
    paths: ["/learn/glossary/disk-throughput"],
  },
  {
    file: "glossary-ebs-gp3-volumes-explained",
    words: "What is gp3 in AWS? EBS gp3 volumes explained",
    paths: ["/learn/glossary/ebs-gp3"],
  },
  {
    file: "glossary-ebs-optimized-instance-amazon",
    words: "What are Amazon EBS-optimized instances?",
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
    file: "glossary-egress-cost-data-egress-explained",
    words: "What is data egress? Egress cost and fees explained",
    paths: ["/learn/glossary/egress-cost"],
  },
  {
    file: "glossary-eks",
    words: "What is AWS EKS? Amazon Elastic Kubernetes Service",
    paths: ["/learn/glossary/eks"],
  },
  {
    file: "glossary-eks-auto-mode-amazon-eks",
    words: "What is Amazon EKS Auto Mode?",
    paths: ["/learn/glossary/eks-auto-mode"],
  },
  {
    file: "glossary-ephemeral-os-disk-ephemeral-disk",
    words: "What is an ephemeral disk? Azure ephemeral OS disks",
    paths: ["/learn/glossary/ephemeral-os-disk"],
  },
  {
    file: "glossary-finops-cloud-finops-explained",
    words: "What is FinOps? Cloud FinOps explained",
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
    file: "glossary-instance-store-ec2-instance-storage",
    words: "What is AWS instance store (EC2 instance storage)?",
    paths: ["/learn/glossary/instance-store"],
  },
  {
    file: "glossary-iops-full-form-and-meaning",
    words: "What is IOPS? Full form and meaning in storage",
    paths: ["/learn/glossary/iops"],
  },
  {
    file: "glossary-kubelet",
    words: "What is the kubelet in Kubernetes?",
    paths: ["/learn/glossary/kubelet"],
  },
  {
    file: "glossary-kubernetes-cluster-utilization-meaning",
    words: "What does Kubernetes cluster utilization mean?",
    paths: ["/learn/glossary/kubernetes-cluster-utilization"],
  },
  {
    file: "glossary-kubernetes-cost-allocation-meaning",
    words: "What does Kubernetes cost allocation mean?",
    paths: ["/learn/glossary/kubernetes-cost-allocation"],
  },
  {
    file: "glossary-kubernetes-cpu-throttling-explained",
    words: "What is Kubernetes CPU throttling?",
    paths: ["/learn/glossary/kubernetes-cpu-throttling"],
  },
  {
    file: "glossary-kubernetes-headroom",
    words: "What is headroom in Kubernetes?",
    paths: ["/learn/glossary/kubernetes-headroom"],
  },
  {
    file: "glossary-kubernetes-qos-class-explained",
    words: "What is a Kubernetes QoS class?",
    paths: ["/learn/glossary/kubernetes-qos-class"],
  },
  {
    file: "glossary-kubernetes-resource-limits",
    words: "What are resource limits in Kubernetes?",
    paths: ["/learn/glossary/kubernetes-resource-limits"],
  },
  {
    file: "glossary-kubernetes-resource-requests-explained",
    words: "What are Kubernetes resource requests?",
    paths: ["/learn/glossary/kubernetes-resource-requests"],
  },
  {
    file: "glossary-max-pods-per-node-eks-and-aks",
    words: "Max pods per node in Kubernetes on EKS and AKS",
    paths: ["/learn/glossary/max-pods-per-node"],
  },
  {
    file: "glossary-metrics-server",
    words: "What is Metrics Server in Kubernetes?",
    paths: ["/learn/glossary/metrics-server"],
  },
  {
    file: "glossary-node-pool",
    words: "What is a node pool in Kubernetes?",
    paths: ["/learn/glossary/node-pool"],
  },
  {
    file: "glossary-on-demand-instance-aws-and-azure",
    words: "What is an on-demand instance on AWS and Azure?",
    paths: ["/learn/glossary/on-demand-instance"],
  },
  {
    file: "glossary-pod-disruption-budget-pdb",
    words: "Pod disruption budget (PDB) in Kubernetes",
    paths: ["/learn/glossary/pod-disruption-budget"],
  },
  {
    file: "glossary-provisioned-iops-piops",
    words: "What is provisioned IOPS (PIOPS) on AWS and Azure?",
    paths: ["/learn/glossary/provisioned-iops"],
  },
  {
    file: "glossary-reserved-instance",
    words: "What is a reserved instance?",
    paths: ["/learn/glossary/reserved-instance"],
  },
  {
    file: "glossary-rightsizing-right-sizing",
    words: "What is right sizing (rightsizing) in cloud?",
    paths: ["/learn/glossary/rightsizing"],
  },
  {
    file: "glossary-savings-plan",
    words: "What is a savings plan (AWS and Azure)?",
    paths: ["/learn/glossary/savings-plan"],
  },
  {
    file: "glossary-savings-plan-coverage-vs-utilization-ri",
    words: "RI utilization vs coverage for commitment discounts",
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
    file: "glossary-vcpu",
    words: "What is a vCPU? vCPU vs core in AWS and Azure",
    paths: ["/learn/glossary/vcpu"],
  },
  {
    file: "glossary-vertical-pod-autoscaler",
    words: "What is VPA (Vertical Pod Autoscaler)?",
    paths: ["/learn/glossary/vertical-pod-autoscaler"],
  },
  {
    file: "glossary-xfs",
    words: "What is XFS? The XFS filesystem in Linux",
    paths: ["/learn/glossary/xfs"],
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
