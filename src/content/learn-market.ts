import { routes } from "@/config/site";
import type { ProductId } from "@/content/products";

/**
 * The market data: every fact the comparison pages print about the tools in the market, and about Coral and Amoeba
 * beside them: the tiles of Cloud cost optimization tools, the two versus pages and the two alternatives pages.
 *
 * ─── WHERE IT COMES FROM ─────────────────────────────────────────────────────────────────────────────────────────
 * Generated from the mocks' data, checked on the day `marketChecked` names: each tool's name, owner, line, how it
 * acts and clouds from its company's own pages. The record of that check holds every claim's source and the reasoning
 * behind it; the pricing rows' sources are read from it (the mocks' data prints the pricing text without them). Carried
 * here is only what the pages print: the check's notes, each tool's status and reasons stay in the data and the
 * record, the clouds are the two a row names (Azure, then AWS; a tile adds Google Cloud where the data names it, in
 * `shownGroups`), and the seven versus pages held back have no rows here. A throwaway script rewrites the three arrays
 * below from the data and the record, and Coral's own lines keep the site's verb.
 *
 * ─── THE ONLY PLACE COMPETITORS ARE NAMED ────────────────────────────────────────────────────────────────────────
 * Names only, no logos, as plain strings in arrays. The code that prints them never spells one, and
 * `src/features/learn/market-names.test.ts` fails if a name turns up anywhere else in src/ but `learn-compare.ts` and
 * the comparison pages' own tests. Whoever re-checks the market changes this file from that check's record and moves
 * `marketChecked` to that day, in the same PR.
 */

/** The day every claim here was checked against its source, as the pages print it. */
export const marketChecked = "19 October 2026";

/** How a tool acts, in the data's words; the chip prints `marketActs`. */
export type MarketActs = "changes infrastructure" | "recommends" | "reports" | "mixed";

/** Each way of acting's chip: its class (`mk-<key>`) and its label. */
export const marketActs: Readonly<
  Record<MarketActs, { readonly key: "acts" | "rec" | "rep" | "mix"; readonly label: string }>
> = {
  "changes infrastructure": { key: "acts", label: "Acts on its own" },
  recommends: { key: "rec", label: "Recommends" },
  reports: { key: "rep", label: "Reports cost" },
  mixed: { key: "mix", label: "Acts and recommends" },
};

/** A market list's column heads (`.mk-headrow`). */
export const marketHead = ["Tool", "What it does", "How it acts", "Clouds"] as const;

/** The clouds a row names, in this order; a tool's other clouds are not printed. */
export type MarketCloud = "Azure" | "AWS";

/** A tool in the market, as its own pages describe it. */
export interface MarketTool {
  readonly name: string;
  /** Its owner, as checked (who bought it, and when, where that happened). */
  readonly company: string;
  /** The kind of tool within its group, the market map's sub-heading. */
  readonly subgroup: string;
  readonly line: string;
  readonly acts: MarketActs;
  readonly clouds: readonly MarketCloud[];
  /** Its own page, where its name links. */
  readonly url: string;
  /** The pages its line, owner and clouds were checked against. */
  readonly sources: readonly string[];
}

/** Coral or Amoeba, first in its group, on navy. */
export interface MarketOurs {
  readonly product: ProductId;
  readonly name: string;
  /** Its maker, where a tool's row prints its owner. */
  readonly company: string;
  readonly line: string;
  readonly acts: MarketActs;
  readonly clouds: readonly MarketCloud[];
  readonly href: string;
}

/** A group of the market: a kind of tool, our product where we have one, and its tools in order. */
export interface MarketGroup {
  readonly id: string;
  readonly label: string;
  readonly ours?: MarketOurs;
  readonly tools: readonly MarketTool[];
}

export const marketGroups: readonly MarketGroup[] = [
  {
    id: "k8s",
    label: "Kubernetes optimization",
    ours: {
      product: "coral",
      name: "Coral by Zoorik",
      company: "Zoorik",
      /* The mocks' data has Coral "right-size" workloads and "rebalance onto" cheaper machines: Coral rebalances, and
         rightsizing is Amoeba's verb, so the verb leads and the move is said plainly. */
      line: "Rebalances workloads, removes machines the cluster no longer needs and moves work onto cheaper ones, on AKS and EKS.",
      acts: "changes infrastructure",
      clouds: ["Azure", "AWS"],
      href: routes.coral,
    },
    tools: [
      {
        name: "Cast AI",
        company: "Cast AI (independent)",
        subgroup: "Autonomous Kubernetes optimization",
        line: "Automates Kubernetes workload rightsizing, node autoscaling, Spot use and bin-packing; also GPU, database and storage options.",
        acts: "changes infrastructure",
        clouds: ["Azure", "AWS"],
        url: "https://cast.ai",
        sources: [
          "https://cast.ai",
          "https://cast.ai/pricing/",
          "https://docs.cast.ai/docs/karpenter-enterprise",
          "https://docs.cast.ai/docs/clm-requirements-and-limitations",
          "https://docs.cast.ai/docs/storage-introduction",
          "https://aws.amazon.com/marketplace/pp/prodview-vtvxyzbzs3huy",
          "https://marketplace.microsoft.com/en-us/product/castaigroupinc1683643265413.castai-saas-k8s-automation",
        ],
      },
      {
        name: "ScaleOps",
        company: "ScaleOps (independent)",
        subgroup: "Autonomous Kubernetes optimization",
        line: "Kubernetes resource management platform, self-hosted by design, that rightsizes pods in real time and manages replicas and nodes.",
        acts: "changes infrastructure",
        clouds: ["Azure", "AWS"],
        url: "https://scaleops.com",
        sources: [
          "https://scaleops.com",
          "https://scaleops.com/product/self-hosted/",
          "https://scaleops.com/compare/",
          "https://aws.amazon.com/marketplace/pp/prodview-t6ctoxyyxp5zs",
          "https://marketplace.microsoft.com/en-us/product/scaleopslabsltd1672654863049.scaleops_offering",
        ],
      },
      {
        name: "PerfectScale by DoiT",
        company: "DoiT (acquired February 2025)",
        subgroup: "Autonomous Kubernetes optimization",
        line: "Kubernetes rightsizing and governance; applies pod sizing automatically and tunes Karpenter settings or recommends node changes.",
        acts: "changes infrastructure",
        clouds: ["Azure", "AWS"],
        url: "https://www.perfectscale.io",
        sources: [
          "https://www.perfectscale.io",
          "https://www.perfectscale.io/pricing",
          "https://perfectscale.io/platform",
          "https://www.perfectscale.io/karpenter-optimization",
          "https://docs.perfectscale.io/enable-automation/introduction-to-automation",
          "https://aws.amazon.com/marketplace/pp/prodview-pdvno3f3xmkek",
        ],
      },
      {
        name: "Kubex",
        company: "Kubex (formerly Densify, renamed January 2026)",
        subgroup: "Autonomous Kubernetes optimization",
        line: "Kubernetes and GPU optimizer that sizes pods at admission, tunes HPAs and recommends node types.",
        acts: "changes infrastructure",
        clouds: ["Azure", "AWS"],
        url: "https://kubex.ai",
        sources: [
          "https://kubex.ai",
          "https://kubex.ai/blog/densify-is-rebranding-to-kubex/",
          "https://kubex.ai/kubex-pricing.md",
          "https://kubex.ai/k8s-native-stack/",
          "https://marketplace.microsoft.com/en-us/product/evenkeelinc1696518960730.kubex-1000",
        ],
      },
      {
        name: "Zesty (Kompass, PV autoscaling, Zesty Disk)",
        company: "Zesty (independent)",
        subgroup: "Autonomous Kubernetes optimization",
        line: "Kubernetes pod rightsizing, replica tuning, fast node scaling and PV autoscaling, plus AWS and Azure commitment optimization.",
        acts: "changes infrastructure",
        clouds: ["Azure", "AWS"],
        url: "https://zesty.co",
        sources: [
          "https://zesty.co",
          "https://zesty.co/lp/kompass-precision/",
          "https://zesty.co/platform/pv-autoscaling/",
          "https://docs.zesty.co/docs/kubernetes-resource-optimization",
          "https://docs.zesty.co/docs/how-zesty-disk-works",
          "https://aws.amazon.com/marketplace/pp/prodview-xqekqy2ylmwyo",
        ],
      },
      {
        name: "Sedai",
        company: "Sedai (independent)",
        subgroup: "Autonomous Kubernetes optimization",
        line: "Optimizes Kubernetes, VMs, serverless and storage while meeting SLOs, in Copilot (one-click approval) or Autopilot mode.",
        acts: "changes infrastructure",
        clouds: ["Azure", "AWS"],
        url: "https://sedai.io",
        sources: ["https://sedai.io", "https://sedai.io/platform/storage"],
      },
      {
        name: "DevZero",
        company: "DevZero (DevInfra Inc; independent)",
        subgroup: "Autonomous Kubernetes optimization",
        line: "Rightsizes CPU, memory and GPU live without restarts and bin-packs pods onto cheaper nodes.",
        acts: "changes infrastructure",
        clouds: ["Azure", "AWS"],
        url: "https://www.devzero.io",
        sources: ["https://www.devzero.io"],
      },
      {
        name: "CloudPilot AI",
        company: "CloudPilot AI (independent)",
        subgroup: "Autonomous Kubernetes optimization",
        line: "Workload autoscaler for requests and JVM heap plus a node autoscaler that picks instances and predicts Spot interruptions.",
        acts: "changes infrastructure",
        clouds: ["Azure", "AWS"],
        url: "https://www.cloudpilot.ai",
        sources: [
          "https://www.cloudpilot.ai",
          "https://marketplace.microsoft.com/en-us/product/cloudpilot-ai.cloudpilot-ai",
        ],
      },
      {
        name: "Wand",
        company: "groundcover (acquired September 2026)",
        subgroup: "Autonomous Kubernetes optimization",
        line: "Autonomous Kubernetes resource optimization that allocates requests from cluster-wide usage patterns; integrates with Karpenter, HPA and KEDA.",
        acts: "changes infrastructure",
        clouds: ["Azure", "AWS"],
        url: "https://wand.cloud",
        sources: ["https://wand.cloud"],
      },
      {
        name: "StormForge by CloudBolt",
        company: "CloudBolt (acquired March 2025)",
        subgroup: "Workload rightsizing",
        line: "Machine-learning rightsizing of container requests and limits, recalculating HPA targets together; leaves nodes to node autoscalers.",
        acts: "changes infrastructure",
        clouds: ["Azure", "AWS"],
        url: "https://www.cloudbolt.io/stormforge/",
        sources: [
          "https://www.cloudbolt.io/stormforge/",
          "https://docs.stormforge.io/docs/get-started/",
          "https://docs.stormforge.io/docs/optimize-live/configure/settings/hpa/",
          "https://aws.amazon.com/marketplace/pp/prodview-ywoktkhczruhk",
        ],
      },
      {
        name: "Spot Ocean",
        company: "Flexera (acquired from NetApp, March 2025)",
        subgroup: "Node autoscaling and Spot",
        line: "Container-driven node autoscaler that bin-packs pods and mixes Spot, reserved and on-demand capacity, with pod rightsizing.",
        acts: "changes infrastructure",
        clouds: ["Azure", "AWS"],
        url: "https://www.flexera.com/more/spot",
        sources: [
          "https://www.flexera.com/more/spot",
          "https://docs.flexera.com/spot/ocean/features/automatic-right-sizing/",
          "https://docs.flexera.com/spot/ocean/features/scaling-kubernetes",
          "https://aws.amazon.com/marketplace/pp/prodview-2f6plif6zeqya",
          "https://marketplace.microsoft.com/en-us/product/flexerasoftware.flexera_spot",
        ],
      },
      {
        name: "Harness Cluster Orchestrator (AI and Cloud Costs)",
        company: "Harness (independent)",
        subgroup: "Node autoscaling and Spot",
        line: "Karpenter-powered node orchestration for Amazon EKS with a Spot, on-demand and committed mix and bin-packing; early access.",
        acts: "mixed",
        clouds: ["AWS"],
        url: "https://www.harness.io/products/cloud-ai-cost-management",
        sources: [
          "https://www.harness.io/products/cloud-ai-cost-management",
          "https://developer.harness.io/cloud-cost-management/cost-optimization/cluster-orchestrator-for-aws-eks-clusters/overview",
        ],
      },
      {
        name: "IBM Turbonomic",
        company: "IBM (acquired 2021)",
        subgroup: "Hybrid resource management",
        line: "Automates policy-driven resource actions, such as Kubernetes pod scaling and VM placement, across hybrid and multicloud environments.",
        acts: "changes infrastructure",
        clouds: ["Azure", "AWS"],
        url: "https://www.ibm.com/products/turbonomic",
        sources: ["https://www.ibm.com/products/turbonomic"],
      },
      {
        name: "Komodor",
        company: "Komodor (independent)",
        subgroup: "Observability and operations platforms",
        line: "Agentic operations platform for production; its Kubernetes Cost module rightsizes workloads and places pods predictively.",
        acts: "changes infrastructure",
        clouds: ["Azure", "AWS"],
        url: "https://komodor.com",
        sources: ["https://komodor.com", "https://komodor.com/solutions/"],
      },
      {
        name: "Datadog Kubernetes Autoscaling",
        company: "Datadog (public company)",
        subgroup: "Observability and operations platforms",
        line: "Workload rightsizing and replica scaling inside Datadog, applied automatically or through GitOps; cluster autoscaling in limited availability.",
        acts: "mixed",
        clouds: ["Azure", "AWS"],
        url: "https://www.datadoghq.com/product/kubernetes-autoscaling/",
        sources: [
          "https://www.datadoghq.com/product/kubernetes-autoscaling/",
          "https://docs.datadoghq.com/containers/autoscaling/",
          "https://docs.datadoghq.com/containers/autoscaling/cluster/",
        ],
      },
      {
        name: "Karpenter",
        company: "open source (kubernetes-sigs; created at AWS)",
        subgroup: "Open source",
        line: "Open-source node autoscaler that launches right-fit nodes for pending pods and consolidates onto fewer or cheaper nodes.",
        acts: "changes infrastructure",
        clouds: ["Azure", "AWS"],
        url: "https://karpenter.sh",
        sources: [
          "https://karpenter.sh",
          "https://github.com/kubernetes-sigs/karpenter",
          "https://github.com/aws/karpenter-provider-aws",
          "https://github.com/Azure/karpenter-provider-azure",
        ],
      },
      {
        name: "Kubernetes Cluster Autoscaler",
        company: "open source (Kubernetes project)",
        subgroup: "Open source",
        line: "Open-source autoscaler that adds nodes to existing node pools for pending pods and removes underused nodes.",
        acts: "changes infrastructure",
        clouds: ["Azure", "AWS"],
        url: "https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler",
        sources: [
          "https://github.com/kubernetes/autoscaler",
          "https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/README.md",
          "https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler/cloudprovider",
          "https://learn.microsoft.com/en-us/azure/aks/cluster-autoscaler-overview",
        ],
      },
      {
        name: "Vertical Pod Autoscaler (VPA)",
        company: "open source (Kubernetes project)",
        subgroup: "Open source",
        line: "Kubernetes add-on that recommends pod CPU and memory requests and can apply them, including in place.",
        acts: "mixed",
        clouds: ["Azure", "AWS"],
        url: "https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler",
        sources: [
          "https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler",
          "https://github.com/kubernetes/autoscaler/blob/master/vertical-pod-autoscaler/docs/features.md",
          "https://kubernetes.io/docs/concepts/workloads/autoscaling/vertical-pod-autoscale/",
        ],
      },
      {
        name: "KEDA",
        company: "open source (CNCF graduated)",
        subgroup: "Open source",
        line: "Event-driven autoscaler that scales Kubernetes workloads based on the number of events to process, including to zero.",
        acts: "changes infrastructure",
        clouds: ["Azure", "AWS"],
        url: "https://keda.sh",
        sources: [
          "https://keda.sh",
          "https://github.com/kedacore/keda",
          "https://learn.microsoft.com/en-us/azure/aks/intro-aks-automatic",
        ],
      },
      {
        name: "Goldilocks",
        company: "Fairwinds (open source)",
        subgroup: "Open source",
        line: "Open-source dashboard that runs VPA in recommendation mode and shows suggested requests and limits per workload.",
        acts: "recommends",
        clouds: ["Azure", "AWS"],
        url: "https://www.fairwinds.com/goldilocks",
        sources: [
          "https://www.fairwinds.com/goldilocks",
          "https://github.com/FairwindsOps/goldilocks",
        ],
      },
      {
        name: "Robusta KRR (Kubernetes Resource Recommender)",
        company: "Robusta (open source)",
        subgroup: "Open source",
        line: "Open-source CLI that reads Prometheus history and recommends pod CPU and memory requests and limits.",
        acts: "mixed",
        clouds: ["Azure", "AWS"],
        url: "https://github.com/robusta-dev/krr",
        sources: [
          "https://github.com/robusta-dev/krr",
          "https://github.com/robusta-dev/krr/tree/main/enforcer",
        ],
      },
      {
        name: "Descheduler",
        company: "open source (kubernetes-sigs)",
        subgroup: "Open source",
        line: "Open-source controller that evicts pods by policy so the scheduler can spread or pack them differently.",
        acts: "changes infrastructure",
        clouds: ["Azure", "AWS"],
        url: "https://github.com/kubernetes-sigs/descheduler",
        sources: ["https://github.com/kubernetes-sigs/descheduler"],
      },
    ],
  },
  {
    id: "storage",
    label: "Block storage optimization",
    ours: {
      product: "amoeba",
      name: "Amoeba by Zoorik",
      company: "Zoorik",
      line: "Rightsizes block storage on Azure managed disks and Amazon EBS, autonomously, without any downtime.",
      acts: "changes infrastructure",
      clouds: ["Azure", "AWS"],
      href: routes.amoeba,
    },
    tools: [
      {
        name: "Lucidity Disk AutoScaler (with Lumen)",
        company: "Lucidity (independent; no acquisition found as of 19 Oct 2026)",
        subgroup: "Disk autoscaling",
        line: "Agent-based autoscaler that grows and shrinks live cloud disks; Lumen finds idle and mis-tiered disks agentlessly.",
        acts: "changes infrastructure",
        clouds: ["Azure", "AWS"],
        url: "https://www.lucidity.cloud/product/autoscaler",
        sources: [
          "https://www.lucidity.cloud",
          "https://www.lucidity.cloud/product/autoscaler",
          "https://www.lucidity.cloud/product/lumen",
          "https://www.lucidity.cloud/newsroom/autoscaler-kubernetes-support/",
          "https://docs.lucidity.cloud/docs/lucidity-autoscaler.md",
          "https://docs.lucidity.cloud/docs/disk-onboarding.md",
          "https://docs.lucidity.cloud/docs/user-guides-azure-os-compatibility-matrix.md",
          "https://docs.lucidity.cloud/docs/user-guides-aws-os-compatibility-matrix.md",
          "https://docs.lucidity.cloud/docs/user-guides-terraform-integration-guide-azure.md",
          "https://aws.amazon.com/marketplace/pp/prodview-whdvld7o4apog",
          "https://marketplace.microsoft.com/en-us/marketplace/apps/lucidity-autoscaler.lucidity-autoscaler",
        ],
      },
      {
        name: "Datafy EBS AutoScaler (and EBS Sensor)",
        company: "Datafy Inc. (independent; no acquisition found as of 19 Oct 2026)",
        subgroup: "Disk autoscaling",
        line: "Grows and shrinks Amazon EBS volumes on EC2 and EKS automatically; free read-only Sensor reports usage.",
        acts: "changes infrastructure",
        clouds: ["AWS"],
        url: "https://datafy.io/datafy-auto-scaler/",
        sources: [
          "https://datafy.io",
          "https://datafy.io/datafy-auto-scaler/",
          "https://datafy.io/faqs/",
          "https://docs.datafy.io/set-up-and-installation/supported-infrastructure.md",
          "https://docs.datafy.io/how-it-works/how-autoscaler-works.md",
          "https://docs.datafy.io/set-up-and-installation/datafy-installation/installation",
          "https://docs.datafy.io/set-up-and-installation/iac-reconciliation.md",
          "https://trust.datafy.io/",
          "https://aws.amazon.com/marketplace/pp/prodview-v4f5dz42gavce",
          "https://aws.amazon.com/marketplace/pp/prodview-zpkaubiu2w52s",
        ],
      },
      {
        name: "Zesty Disk",
        company:
          "Zesty (independent; bought Qubex in Nov 2024, per Zesty's own Kompass launch release)",
        subgroup: "Disk autoscaling",
        line: "Builds an EC2 filesystem from several EBS volumes, adding and removing volumes to grow or shrink capacity.",
        acts: "changes infrastructure",
        clouds: ["AWS"],
        url: "https://docs.zesty.co/docs/zesty-disk",
        sources: [
          "https://docs.zesty.co/docs/zesty-disk.md",
          "https://docs.zesty.co/docs/how-zesty-disk-works.md",
          "https://docs.zesty.co/docs/system-requirements.md",
          "https://docs.zesty.co/docs/install-the-zesty-disk-agent.md",
          "https://docs.zesty.co/docs/zesty-disk-release-notes-cumulative.md",
          "https://docs.zesty.co/docs/how-do-we-manage-zesty-disk-as-code-with-terraform.md",
          "https://aws.amazon.com/marketplace/pp/prodview-vlfhlckav3nnu",
        ],
      },
      {
        name: "Zesty PV autoscaling",
        company: "Zesty (independent)",
        subgroup: "Kubernetes volume autoscaling",
        line: "Extends and shrinks Kubernetes persistent volumes on Amazon EKS automatically, using the EBS CSI driver.",
        acts: "changes infrastructure",
        clouds: ["AWS"],
        url: "https://zesty.co/platform/pv-autoscaling/",
        sources: [
          "https://zesty.co/platform/pv-autoscaling/",
          "https://docs.zesty.co/docs/storage-optimization.md",
          "https://docs.zesty.co/docs/faq-pvs-autoscaling.md",
          "https://docs.zesty.co/docs/deploy-storage-autoscaling.md",
          "https://docs.zesty.co/docs/system-requirements-pvs-autoscaling.md",
        ],
      },
      {
        name: "Sedai (Amazon EBS and Azure Managed Disks optimization)",
        company: "Sedai Inc. (independent)",
        subgroup: "Disk tier and cleanup automation",
        line: "Selects EBS volume types and Azure disk performance tiers from usage data, and flags unattached disks for cleanup.",
        acts: "mixed",
        clouds: ["Azure", "AWS"],
        url: "https://sedai.io/platform/amazon-ebs-optimization",
        sources: [
          "https://sedai.io/platform/amazon-ebs-optimization",
          "https://sedai.io/platform/azure-managed-disks-optimization",
          "https://docs.sedai.io/get-started/platform/optimization/aws/storage",
        ],
      },
      {
        name: "Amazon EBS Elastic Volumes",
        company: "Amazon Web Services",
        subgroup: "AWS",
        line: "Amazon EBS feature that increases a volume's size or changes its type, IOPS and throughput; size cannot decrease.",
        acts: "changes infrastructure",
        clouds: ["AWS"],
        url: "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-modify-volume.html",
        sources: ["https://docs.aws.amazon.com/ebs/latest/userguide/ebs-modify-volume.html"],
      },
      {
        name: "AWS Compute Optimizer (EBS recommendations and automation rules)",
        company: "Amazon Web Services",
        subgroup: "AWS",
        line: "Recommends EBS type, size and performance; automation rules upgrade older volume types and snapshot and delete unattached volumes.",
        acts: "mixed",
        clouds: ["AWS"],
        url: "https://aws.amazon.com/compute-optimizer/",
        sources: [
          "https://docs.aws.amazon.com/compute-optimizer/latest/ug/view-ebs-recommendations.html",
          "https://aws.amazon.com/blogs/aws-cloud-financial-management/introducing-automated-amazon-ebs-volume-optimization-in-aws-compute-optimizer/",
          "https://docs.aws.amazon.com/compute-optimizer/latest/ug/automation-rec.md",
        ],
      },
      {
        name: "Azure managed disks (native options: live expand, performance tiers, Premium SSD v2, Elastic SAN)",
        company: "Microsoft",
        subgroup: "Azure",
        line: "Native options: grow data disks live, change Premium SSD performance tiers, tune Premium SSD v2; no shrink.",
        acts: "changes infrastructure",
        clouds: ["Azure"],
        url: "https://learn.microsoft.com/en-us/azure/virtual-machines/faq-for-disks",
        sources: [
          "https://learn.microsoft.com/en-us/azure/virtual-machines/faq-for-disks",
          "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-change-performance",
          "https://learn.microsoft.com/en-us/azure/aks/use-premium-v2-disks",
          "https://learn.microsoft.com/en-us/azure/storage/elastic-san/elastic-san-introduction",
        ],
      },
      {
        name: "Azure Advisor (disk cost recommendations)",
        company: "Microsoft",
        subgroup: "Azure",
        line: "Disk cost recommendations: review unattached disks, move busy Standard HDDs to capped Standard SSD, consider disk reservations.",
        acts: "recommends",
        clouds: ["Azure"],
        url: "https://learn.microsoft.com/en-us/azure/advisor/advisor-reference-cost-recommendations",
        sources: [
          "https://learn.microsoft.com/en-us/azure/advisor/advisor-reference-cost-recommendations",
        ],
      },
      {
        name: "NetApp Cloud Volumes ONTAP",
        company: "NetApp",
        subgroup: "Storage layer with efficiency features",
        line: "Software-only storage appliance running ONTAP in the cloud; deduplication, compression, thin provisioning and cloning reduce storage costs.",
        acts: "changes infrastructure",
        clouds: ["Azure", "AWS"],
        url: "https://docs.netapp.com/us-en/storage-management-cloud-volumes-ontap/concept-overview-cvo.html",
        sources: [
          "https://docs.netapp.com/us-en/storage-management-cloud-volumes-ontap/concept-overview-cvo.html",
          "https://docs.netapp.com/us-en/storage-management-cloud-volumes-ontap/index.html",
        ],
      },
      {
        name: "pvc-autoresizer",
        company: "open source (TopoLVM project, Apache-2.0)",
        subgroup: "Open source",
        line: "Kubernetes controller that grows PersistentVolumeClaims when free space or inodes run low; grow only.",
        acts: "changes infrastructure",
        clouds: [],
        url: "https://github.com/topolvm/pvc-autoresizer",
        sources: ["https://github.com/topolvm/pvc-autoresizer"],
      },
      {
        name: "Kubernetes VolumeAttributesClass",
        company: "open source (Kubernetes, CNCF)",
        subgroup: "Open source",
        line: "Kubernetes API that changes a live volume's performance class, such as IOPS, throughput or type; not size.",
        acts: "changes infrastructure",
        clouds: ["Azure", "AWS"],
        url: "https://kubernetes.io/docs/concepts/storage/volume-attributes-classes/",
        sources: [
          "https://kubernetes.io/docs/concepts/storage/volume-attributes-classes/",
          "https://kubernetes.io/blog/2025/09/08/kubernetes-v1-34-volume-attributes-class/",
          "https://github.com/kubernetes-sigs/aws-ebs-csi-driver/blob/master/docs/modify-volume.md",
          "https://learn.microsoft.com/en-us/azure/aks/use-premium-v2-disks",
        ],
      },
    ],
  },
  {
    id: "finops",
    label: "FinOps platforms",
    tools: [
      {
        name: "IBM Kubecost",
        company: "IBM (acquisition announced 17 Sept 2024)",
        subgroup: "Visibility",
        line: "Kubernetes cost allocation and showback with rightsizing advice; can automate request sizing and namespace turndown.",
        acts: "mixed",
        clouds: ["Azure", "AWS"],
        url: "https://www.apptio.com/products/kubecost/",
        sources: [
          "https://www.apptio.com/products/kubecost/",
          "https://newsroom.ibm.com/blog-ibm-acquires-kubecost-to-broaden-hybrid-cloud-cost-management-capabilities",
          "https://opencost.io",
        ],
      },
      {
        name: "CloudZero",
        company: "CloudZero (independent)",
        subgroup: "Visibility",
        line: "Allocates cloud, Kubernetes, AI and SaaS spend to products, teams and customers, and gives optimization recommendations.",
        acts: "recommends",
        clouds: ["Azure", "AWS"],
        url: "https://www.cloudzero.com",
        sources: [
          "https://www.cloudzero.com",
          "https://www.cloudzero.com/platform/",
          "https://docs.cloudzero.com/docs/optimize",
        ],
      },
      {
        name: "Vantage",
        company: "Vantage (independent)",
        subgroup: "Visibility",
        line: "Allocates cloud, SaaS, AI and Kubernetes costs; recommends savings and can buy AWS Savings Plans automatically.",
        acts: "mixed",
        clouds: ["Azure", "AWS"],
        url: "https://www.vantage.sh",
        sources: ["https://www.vantage.sh", "https://www.vantage.sh/pricing"],
      },
      {
        name: "Finout",
        company: "Finout (independent)",
        subgroup: "Visibility",
        line: "FinOps platform for cloud, Kubernetes and AI spend; agents propose fixes, with auto-apply opt-in per workflow.",
        acts: "mixed",
        clouds: ["Azure", "AWS"],
        url: "https://www.finout.io",
        sources: ["https://www.finout.io"],
      },
      {
        name: "IBM Cloudability",
        company: "IBM (through Apptio, which IBM acquired in 2023)",
        subgroup: "Visibility",
        line: "Multi-cloud cost allocation, forecasting and rightsizing recommendations; can automate Kubernetes container sizing and orphaned-resource cleanup.",
        acts: "mixed",
        clouds: ["Azure", "AWS"],
        url: "https://www.apptio.com/products/cloudability/",
        sources: [
          "https://www.apptio.com/products/cloudability/",
          "https://www.ibm.com/docs/en/cloudability-commercial/cloudability-premium/saas?topic=premium-advanced-rightsizing",
          "https://newsroom.ibm.com/blog-ibm-acquires-kubecost-to-broaden-hybrid-cloud-cost-management-capabilities",
        ],
      },
      {
        name: "CloudHealth",
        company: "Broadcom (with VMware, which became a Broadcom subsidiary on 22 Nov 2023)",
        subgroup: "Visibility",
        line: "Multi-cloud cost reporting, recommendations and governance policies that can alert or run automated actions.",
        acts: "mixed",
        clouds: ["Azure", "AWS"],
        url: "https://www.broadcom.com/products/software/finops/cloudhealth",
        sources: [
          "https://www.broadcom.com/products/software/finops/cloudhealth",
          "https://community.broadcom.com/blogs/tj-march/2026/08/04/fresh-from-the-labs-july-2026",
          "https://www.sec.gov/Archives/edgar/data/1124610/000119312523282097/d559518d8k.htm",
        ],
      },
      {
        name: "Flexera One",
        company: "Flexera (Thoma Bravo portfolio company, invested 2021)",
        subgroup: "Visibility",
        line: "FinOps portfolio: multi-cloud visibility and cost policies, plus autonomous rightsizing, autoscaling, Spot and commitment discount management.",
        acts: "mixed",
        clouds: ["Azure", "AWS"],
        url: "https://www.flexera.com/products/flexera-one/finops",
        sources: [
          "https://www.flexera.com/products/flexera-one/finops",
          "https://www.flexera.com/products/flexera-one/cloud-cost-optimization",
          "https://www.thomabravo.com/press-releases/flexera-acquires-prosperops-and-chaos-genius-to-expand-its-finops-solution",
          "https://www.thomabravo.com/portfolio/flexera",
          "https://docs.flexera.com/spot/ocean/release-notes",
        ],
      },
      {
        name: "Ternary",
        company: "Ternary, Inc. (independent)",
        subgroup: "Visibility",
        line: "Finance-owned ledger of cloud, AI, SaaS and on-premise spend, with usage and rate optimization recommendations.",
        acts: "recommends",
        clouds: ["Azure", "AWS"],
        url: "https://ternary.app",
        sources: [
          "https://ternary.app",
          "https://docs.ternary.app/docs/microsoft-azure",
          "https://docs.ternary.app/docs/administrator-quick-start",
        ],
      },
      {
        name: "Amnic",
        company: "Amnic (independent)",
        subgroup: "Visibility",
        line: "Read-only, agentless cloud and Kubernetes cost visibility with rightsizing recommendations and AI agents for FinOps tasks.",
        acts: "recommends",
        clouds: ["Azure", "AWS"],
        url: "https://amnic.com",
        sources: [
          "https://amnic.com",
          "https://amnic.com/kubernetes-cost-management",
          "https://amnic.com/blogs/container-cost-management-tools",
        ],
      },
      {
        name: "Cloudchipr",
        company: "Cloudchipr (independent, Y Combinator-backed)",
        subgroup: "Visibility",
        line: "Cost visibility and recommendations with if-then automations for cleanup and scheduling; Kubernetes integration marked coming soon.",
        acts: "mixed",
        clouds: ["Azure", "AWS"],
        url: "https://cloudchipr.com",
        sources: [
          "https://cloudchipr.com",
          "https://cloudchipr.com/automations",
          "https://cloudchipr.com/kubernetes",
        ],
      },
      {
        name: "PointFive OS",
        company: "PointFive (independent)",
        subgroup: "Visibility",
        line: "Finds unused spend across cloud, Kubernetes, data and AI, traces its cause, and applies fixes with customer approval.",
        acts: "mixed",
        clouds: ["Azure", "AWS"],
        url: "https://www.pointfive.co",
        sources: ["https://www.pointfive.co"],
      },
      {
        name: "CoreStack FinOps+",
        company: "CoreStack (independent)",
        subgroup: "Visibility",
        line: "Governance platform whose FinOps module gives cost visibility, recommendations and automated or manual remediation workflows.",
        acts: "mixed",
        clouds: ["Azure", "AWS"],
        url: "https://www.corestack.io/solutions/finops/",
        sources: [
          "https://www.corestack.io",
          "https://www.corestack.io/solutions/finops/",
          "https://yotascale.com",
        ],
      },
      {
        name: "nOps",
        company: "nOps (independent)",
        subgroup: "Commitments and discounts",
        line: "Buys and manages RIs, Savings Plans and CUDs automatically; also offers cost visibility, allocation and AI cost tracking.",
        acts: "mixed",
        clouds: ["Azure", "AWS"],
        url: "https://www.nops.io",
        sources: ["https://www.nops.io"],
      },
      {
        name: "ProsperOps",
        company: "Flexera (acquisition announced 6 Jan 2026; keeps its own brand)",
        subgroup: "Commitments and discounts",
        line: "Autonomous commitment discount management on AWS, Azure and Google Cloud, plus a Scheduler for resource management.",
        acts: "mixed",
        clouds: ["Azure", "AWS"],
        url: "https://www.prosperops.com",
        sources: [
          "https://www.prosperops.com",
          "https://www.thomabravo.com/press-releases/flexera-acquires-prosperops-and-chaos-genius-to-expand-its-finops-solution",
        ],
      },
      {
        name: "Archera",
        company: "Archera (independent)",
        subgroup: "Commitments and discounts",
        line: "Insured cloud commitments: recommends plans, executes the one the customer picks, and covers unused commitment for a premium.",
        acts: "mixed",
        clouds: ["Azure", "AWS"],
        url: "https://www.archera.ai",
        sources: ["https://www.archera.ai"],
      },
      {
        name: "Usage.ai",
        company: "Usage.ai (independent)",
        subgroup: "Commitments and discounts",
        line: "Commitment management that buys automatically (Autopilot) or by approval (Copilot), plus cashback on eligible underused commitments.",
        acts: "mixed",
        clouds: ["Azure", "AWS"],
        url: "https://www.usage.ai",
        sources: ["https://www.usage.ai"],
      },
      {
        name: "Pump",
        company: "Pump (independent)",
        subgroup: "Commitments and discounts",
        line: "Free platform that automates commitment savings and adds spend visibility, rightsizing recommendations and security scanning.",
        acts: "mixed",
        clouds: ["Azure", "AWS"],
        url: "https://www.pump.co",
        sources: ["https://www.pump.co"],
      },
      {
        name: "Hykell",
        company: "Hykell (independent)",
        subgroup: "Commitments and discounts",
        line: "Automates AWS Savings Plans and Reserved Instances, paid from savings; says it also automates gp2-to-gp3 migrations.",
        acts: "mixed",
        clouds: ["AWS"],
        url: "https://hykell.com",
        sources: [
          "https://hykell.com",
          "https://hykell.com/knowledge-base/best-practice-for-ebs-cost-optimization/",
        ],
      },
      {
        name: "CloudKeeper",
        company: "CloudKeeper (independent; hived out of TO THE NEW in 2024)",
        subgroup: "Commitments and discounts",
        line: "Cloud cost partner offering discounts, commitment management, visibility, recommendations, scheduling and managed services.",
        acts: "mixed",
        clouds: ["Azure", "AWS"],
        url: "https://www.cloudkeeper.com",
        sources: [
          "https://www.cloudkeeper.com",
          "https://www.cloudkeeper.com/cloudkeeper-tuner",
          "https://www.cloudkeeper.com/about-us",
        ],
      },
      {
        name: "Xosphere IQ",
        company: "Xosphere (independent)",
        subgroup: "Spot automation",
        line: "Autonomous Spot orchestration on AWS and GCP, Karpenter-integrated Kubernetes scaling, and AI spend optimization.",
        acts: "changes infrastructure",
        clouds: ["AWS"],
        url: "https://www.xosphere.io",
        sources: ["https://www.xosphere.io"],
      },
      {
        name: "OpenCost",
        company: "open source (CNCF incubating; created by Kubecost, now IBM Kubecost)",
        subgroup: "Open source",
        line: "Open-source cost monitor that allocates Kubernetes and cloud costs by namespace, workload and asset.",
        acts: "reports",
        clouds: ["Azure", "AWS"],
        url: "https://www.opencost.io",
        sources: [
          "https://www.opencost.io",
          "https://github.com/opencost/opencost",
          "https://learn.microsoft.com/en-us/azure/aks/cost-analysis",
        ],
      },
      {
        name: "Cloud Custodian",
        company: "open source (CNCF incubating)",
        subgroup: "Open source",
        line: "Open-source YAML rules engine that filters cloud resources and acts on them: stop, retype, tag or delete.",
        acts: "changes infrastructure",
        clouds: ["Azure", "AWS"],
        url: "https://cloudcustodian.io",
        sources: [
          "https://cloudcustodian.io",
          "https://cloudcustodian.io/docs/aws/resources/ebs.html",
          "https://cloudcustodian.io/docs/azure/resources/disk.html",
          "https://github.com/cloud-custodian/cloud-custodian",
        ],
      },
      {
        name: "Infracost",
        company: "Infracost Inc.",
        subgroup: "Open source",
        line: "Shows cost estimates and FinOps policy checks for infrastructure-as-code changes before deployment, in terminals, editors and pull requests.",
        acts: "recommends",
        clouds: ["Azure", "AWS"],
        url: "https://www.infracost.io",
        sources: [
          "https://www.infracost.io",
          "https://www.infracost.io/pricing/",
          "https://github.com/infracost/infracost",
          "https://github.com/infracost/cli",
        ],
      },
    ],
  },
  {
    id: "native",
    label: "Cloud providers’ own tools",
    tools: [
      {
        name: "Azure Advisor",
        company: "Microsoft",
        subgroup: "Azure",
        line: "Free Azure service that analyzes configuration and usage to recommend cost, reliability, security, performance and operational excellence improvements.",
        acts: "recommends",
        clouds: ["Azure"],
        url: "https://azure.microsoft.com/en-us/products/advisor/",
        sources: [
          "https://azure.microsoft.com/en-us/products/advisor/",
          "https://learn.microsoft.com/en-us/azure/advisor/advisor-overview",
          "https://learn.microsoft.com/en-us/azure/advisor/advisor-reference-cost-recommendations",
        ],
      },
      {
        name: "Microsoft Cost Management",
        company: "Microsoft",
        subgroup: "Azure",
        line: "Free suite of FinOps tools to analyze, allocate, budget and alert on Microsoft Cloud costs, including Advisor recommendations.",
        acts: "reports",
        clouds: ["Azure"],
        url: "https://azure.microsoft.com/en-us/products/cost-management/",
        sources: [
          "https://azure.microsoft.com/en-us/products/cost-management/",
          "https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/overview-cost-management",
          "https://azure.microsoft.com/updates?id=crossclouddeprecation",
        ],
      },
      {
        name: "AKS cost analysis",
        company: "Microsoft",
        subgroup: "Azure",
        line: "AKS add-on, built on OpenCost, that shows cluster cost by namespace and Azure asset in Cost Management.",
        acts: "reports",
        clouds: ["Azure"],
        url: "https://learn.microsoft.com/en-us/azure/aks/cost-analysis",
        sources: [
          "https://learn.microsoft.com/en-us/azure/aks/cost-analysis",
          "https://learn.microsoft.com/en-us/azure/advisor/advisor-reference-cost-recommendations",
        ],
      },
      {
        name: "AKS node auto-provisioning (NAP)",
        company: "Microsoft",
        subgroup: "Azure",
        line: "AKS feature, based on Karpenter, that provisions VM sizes for pending pods and removes or replaces underutilized nodes.",
        acts: "changes infrastructure",
        clouds: ["Azure"],
        url: "https://learn.microsoft.com/en-us/azure/aks/node-auto-provisioning",
        sources: [
          "https://learn.microsoft.com/en-us/azure/aks/node-auto-provisioning",
          "https://learn.microsoft.com/en-us/azure/aks/node-auto-provisioning-disruption",
          "https://learn.microsoft.com/en-us/azure/aks/intro-aks-automatic",
          "https://github.com/Azure/karpenter-provider-azure",
        ],
      },
      {
        name: "AWS Compute Optimizer",
        company: "Amazon Web Services",
        subgroup: "AWS",
        line: "AWS service that analyzes utilization to recommend rightsizing and flag idle resources, and can apply some EBS actions.",
        acts: "mixed",
        clouds: ["AWS"],
        url: "https://aws.amazon.com/compute-optimizer/",
        sources: [
          "https://aws.amazon.com/compute-optimizer/",
          "https://docs.aws.amazon.com/compute-optimizer/latest/ug/what-is-compute-optimizer.html",
          "https://docs.aws.amazon.com/compute-optimizer/latest/ug/view-ebs-recommendations.html",
          "https://docs.aws.amazon.com/compute-optimizer/latest/ug/automation-rec.html",
          "https://aws.amazon.com/compute-optimizer/pricing/",
          "https://aws.amazon.com/blogs/aws-cloud-financial-management/introducing-automated-amazon-ebs-volume-optimization-in-aws-compute-optimizer",
        ],
      },
      {
        name: "AWS Cost Explorer",
        company: "Amazon Web Services",
        subgroup: "AWS",
        line: "AWS tool for viewing, analyzing and forecasting cost and usage, with Reserved Instance purchase recommendations.",
        acts: "reports",
        clouds: ["AWS"],
        url: "https://aws.amazon.com/aws-cost-management/aws-cost-explorer/",
        sources: [
          "https://aws.amazon.com/aws-cost-management/aws-cost-explorer/",
          "https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html",
        ],
      },
      {
        name: "AWS Trusted Advisor",
        company: "Amazon Web Services",
        subgroup: "AWS",
        line: "AWS checks across cost, performance, resilience, security, operational excellence and service limits that recommend best-practice fixes.",
        acts: "recommends",
        clouds: ["AWS"],
        url: "https://aws.amazon.com/premiumsupport/technology/trusted-advisor/",
        sources: [
          "https://aws.amazon.com/premiumsupport/technology/trusted-advisor/",
          "https://docs.aws.amazon.com/awssupport/latest/user/trusted-advisor-check-reference.html",
          "https://docs.aws.amazon.com/awssupport/latest/user/cost-optimization-checks.html",
        ],
      },
      {
        name: "AWS Cost Optimization Hub",
        company: "Amazon Web Services",
        subgroup: "AWS",
        line: "AWS Billing and Cost Management feature that consolidates rightsizing, idle, Savings Plans and Reserved Instance recommendations across accounts.",
        acts: "recommends",
        clouds: ["AWS"],
        url: "https://aws.amazon.com/aws-cost-management/cost-optimization-hub/",
        sources: [
          "https://aws.amazon.com/aws-cost-management/cost-optimization-hub/",
          "https://docs.aws.amazon.com/cost-management/latest/userguide/cost-optimization-hub.html",
          "https://aws.amazon.com/about-aws/whats-new/2025/05/cost-optimization-hub-savings-plans-reservations-preferences",
        ],
      },
      {
        name: "Amazon EKS Auto Mode",
        company: "Amazon Web Services",
        subgroup: "AWS",
        line: "EKS option where AWS manages compute autoscaling (Karpenter-based), node upgrades, networking, block storage and load balancing.",
        acts: "changes infrastructure",
        clouds: ["AWS"],
        url: "https://aws.amazon.com/eks/auto-mode/",
        sources: [
          "https://aws.amazon.com/eks/auto-mode/",
          "https://docs.aws.amazon.com/eks/latest/userguide/automode.html",
          "https://docs.aws.amazon.com/eks/latest/userguide/auto-cost-control.html",
          "https://aws.amazon.com/eks/pricing/",
        ],
      },
    ],
  },
];

/** A kind of tool on Cloud cost optimization tools: its chip's and its tiles' `data-k`. */
export type ToolKind = "k8s" | "storage" | "finops" | "cloud";

/** A tool Cloud cost optimization tools shows, by its name in `marketGroups`. */
export interface ShownTool {
  readonly name: string;
  /** Its tile's line: the same facts as its checked line, in fewer words. The full line is the tile's title. */
  readonly short: string;
  /** Its own pages name Google Cloud too, which the tile adds after the two clouds a row names. */
  readonly googleCloud: boolean;
}

/** One kind of tool on Cloud cost optimization tools: its name, the market group its tools are in, and its tiles. */
export interface ShownGroup {
  readonly kind: ToolKind;
  /** On its chip and over its tiles. */
  readonly label: string;
  /** The group of `marketGroups` its tools are read from. */
  readonly group: string;
  /** Coral or Amoeba, first, with its tile's line. */
  readonly ours?: { readonly product: ProductId; readonly short: string };
  readonly tools: readonly ShownTool[];
}

/**
 * The tools Cloud cost optimization tools shows: only those whose job is to reduce the bill, by acting or by
 * recommending. No dashboard that only reports, no general operations platform, no single feature or API, no tool
 * twice. Each is read from `marketGroups` by its name, so its owner, line, how it acts, clouds and page are the ones
 * checked on `marketChecked`.
 */
export const shownGroups: readonly ShownGroup[] = [
  {
    kind: "k8s",
    label: "Kubernetes",
    group: "k8s",
    /* Coral rebalances: the verb leads, as in its full line. */
    ours: { product: "coral", short: "Rebalances workloads onto fewer, cheaper machines." },
    tools: [
      {
        name: "Cast AI",
        short: "Automates rightsizing, node autoscaling, Spot use and bin-packing.",
        googleCloud: true,
      },
      {
        name: "ScaleOps",
        short: "Self-hosted; rightsizes pods in real time and manages replicas and nodes.",
        googleCloud: true,
      },
      {
        name: "PerfectScale by DoiT",
        short: "Applies pod sizing automatically and tunes Karpenter settings.",
        googleCloud: true,
      },
      {
        name: "Kubex",
        short: "Sizes pods at admission, tunes HPAs and recommends node types.",
        googleCloud: true,
      },
      {
        name: "StormForge by CloudBolt",
        short: "Machine-learning rightsizing of container requests and limits.",
        googleCloud: true,
      },
      {
        name: "Spot Ocean",
        short: "Bin-packs pods and mixes Spot, reserved and on-demand capacity.",
        googleCloud: true,
      },
      {
        name: "Karpenter",
        short: "Launches right-fit nodes and consolidates onto fewer or cheaper ones.",
        googleCloud: true,
      },
      {
        name: "Kubernetes Cluster Autoscaler",
        short: "Adds nodes for pending pods and removes underused ones.",
        googleCloud: true,
      },
      {
        name: "Vertical Pod Autoscaler (VPA)",
        short: "Recommends pod CPU and memory requests and can apply them.",
        googleCloud: false,
      },
    ],
  },
  {
    kind: "storage",
    label: "Block storage",
    group: "storage",
    ours: {
      product: "amoeba",
      short: "Rightsizes Azure managed disks and Amazon EBS, without any downtime.",
    },
    tools: [
      {
        name: "Lucidity Disk AutoScaler (with Lumen)",
        short: "Grows and shrinks live cloud disks with an agent.",
        googleCloud: true,
      },
      {
        name: "Datafy EBS AutoScaler (and EBS Sensor)",
        short: "Grows and shrinks Amazon EBS volumes on EC2 and EKS.",
        googleCloud: false,
      },
      {
        name: "Zesty Disk",
        short: "Grows or shrinks an EC2 filesystem by adding and removing EBS volumes.",
        googleCloud: false,
      },
      {
        name: "Sedai (Amazon EBS and Azure Managed Disks optimization)",
        short: "Picks EBS types and Azure disk tiers from usage; flags unattached disks.",
        googleCloud: false,
      },
    ],
  },
  {
    kind: "finops",
    label: "FinOps",
    group: "finops",
    tools: [
      {
        name: "IBM Kubecost",
        short: "Kubernetes cost allocation with rightsizing advice and automation.",
        googleCloud: true,
      },
      {
        name: "Vantage",
        short: "Allocates costs, recommends savings and can buy Savings Plans.",
        googleCloud: true,
      },
      {
        name: "ProsperOps",
        short: "Manages commitment discounts autonomously on AWS, Azure and Google Cloud.",
        googleCloud: true,
      },
      {
        name: "nOps",
        short: "Buys and manages RIs, Savings Plans and CUDs automatically.",
        googleCloud: true,
      },
      {
        name: "Xosphere IQ",
        short: "Autonomous Spot orchestration on AWS and GCP.",
        googleCloud: true,
      },
      {
        name: "Cloud Custodian",
        short: "Open-source rules that stop, retype, tag or delete cloud resources.",
        googleCloud: true,
      },
    ],
  },
  {
    kind: "cloud",
    label: "Cloud providers",
    group: "native",
    tools: [
      {
        name: "Azure Advisor",
        short: "Free Azure service that recommends cost and other improvements.",
        googleCloud: false,
      },
      {
        name: "AKS node auto-provisioning (NAP)",
        short: "Provisions VM sizes for pending pods and removes underused nodes.",
        googleCloud: false,
      },
      {
        name: "AWS Compute Optimizer",
        short: "Recommends rightsizing and flags idle resources.",
        googleCloud: false,
      },
      {
        name: "AWS Cost Optimization Hub",
        short: "Gathers rightsizing, idle and commitment advice across accounts.",
        googleCloud: false,
      },
      {
        name: "Amazon EKS Auto Mode",
        short: "AWS manages compute autoscaling for EKS, on Karpenter.",
        googleCloud: false,
      },
    ],
  },
];

/** A cell's mark: its class (`vx-<key>`), what it draws and the word after it. */
export type MarketMark = "yes" | "no" | "partly" | "unknown";

export const marketMarks: Readonly<
  Record<
    MarketMark,
    { readonly key: "y" | "n" | "p" | "u"; readonly glyph: string; readonly word: string }
  >
> = {
  yes: { key: "y", glyph: "✓", word: "Yes" },
  no: { key: "n", glyph: "–", word: "No" },
  partly: { key: "p", glyph: "◐", word: "Partly" },
  unknown: { key: "u", glyph: "?", word: "Not stated" },
};

/** One side of a row: the mark, what backs it, and the pages that say so (none for our own side). */
export interface VersusCell {
  readonly mark: MarketMark;
  readonly note: string;
  readonly sources: readonly string[];
}

export interface VersusRow {
  readonly label: string;
  readonly ours: VersusCell;
  readonly theirs: VersusCell;
}

/**
 * A live versus page's facts (one per product). `tool` is the market's tool it compares, whose owner, address
 * and clouds the page prints; `name` is what the page calls it. The rows are the page's, in its order (no SOC 2
 * row), the storage page's "Azure managed disks" and "Amazon EBS" rows read from the tool's clouds as the mock reads
 * them; then the published pricing, as printed, with the pages it comes from.
 */
export interface VersusFacts {
  /** Its page, `versusPages` in `learn-compare.ts`. */
  readonly slug: string;
  readonly tool: string;
  readonly name: string;
  /** What it is, in its maker's words (At a glance). */
  readonly line: string;
  readonly rows: readonly VersusRow[];
  readonly pricing: {
    readonly label: string;
    readonly ours: string;
    readonly theirs: string;
    readonly sources: readonly string[];
  };
}

export const versusFacts: readonly VersusFacts[] = [
  {
    slug: "coral-vs-stormforge",
    tool: "StormForge by CloudBolt",
    name: "StormForge",
    line: "Machine-learning rightsizing of container requests and limits, recalculating HPA targets together; leaves nodes to node autoscalers.",
    rows: [
      {
        label: "Sets pod requests automatically",
        ours: {
          mark: "yes",
          note: "sets CPU and memory requests when automatic optimization is on",
          sources: [],
        },
        theirs: {
          mark: "yes",
          note: "'continuously optimizes the CPU and memory requests and limits for each container'",
          sources: ["https://www.cloudbolt.io/stormforge/"],
        },
      },
      {
        label: "Manages replicas (HPA)",
        ours: {
          mark: "yes",
          note: "creates HPAs for eligible Deployments and Argo Rollouts, and takes over HPAs nothing else manages",
          sources: [],
        },
        theirs: {
          mark: "partly",
          note: "Adjusts HPA target utilization (and KEDA CPU/memory triggers); no setting for min/max replicas",
          sources: ["https://docs.stormforge.io/docs/optimize-live/configure/settings/hpa/"],
        },
      },
      {
        label: "Removes and replaces machines",
        ours: {
          mark: "yes",
          note: "empties spare machines so the autoscaler removes them, and rebalances onto cheaper ones",
          sources: [],
        },
        theirs: {
          mark: "no",
          note: "FAQ: it adjusts pod requests and limits, while 'tools like Karpenter optimize the nodes themselves'",
          sources: ["https://www.cloudbolt.io/stormforge/"],
        },
      },
      {
        label: "Works with Karpenter, NAP or Cluster Autoscaler",
        ours: {
          mark: "yes",
          note: "Karpenter, AKS node auto provisioning and Cluster Autoscaler",
          sources: [],
        },
        theirs: {
          mark: "yes",
          note: "Pairs with Karpenter; nodes left to the existing autoscaler",
          sources: ["https://www.cloudbolt.io/stormforge/"],
        },
      },
      {
        label: "Azure Kubernetes Service (AKS)",
        ours: { mark: "yes", note: "Kubernetes 1.30 or later", sources: [] },
        theirs: {
          mark: "yes",
          note: "'any distribution: EKS, AKS, GKE, minikube, kind, and others'",
          sources: ["https://docs.stormforge.io/docs/get-started/"],
        },
      },
      {
        label: "Amazon EKS",
        ours: { mark: "yes", note: "Kubernetes 1.30 or later", sources: [] },
        theirs: {
          mark: "yes",
          note: "Any distribution; also an EKS add-on",
          sources: [
            "https://docs.stormforge.io/docs/get-started/",
            "https://aws.amazon.com/marketplace/pp/prodview-ywoktkhczruhk",
          ],
        },
      },
      {
        label: "Rightsizes block storage",
        ours: {
          mark: "yes",
          note: "through Amoeba: Azure managed disks and Amazon EBS on VMs",
          sources: [],
        },
        theirs: {
          mark: "unknown",
          note: "No disk or PV sizing described on its pages (checked 19 Oct 2026)",
          sources: ["https://www.cloudbolt.io/stormforge/"],
        },
      },
      {
        label: "Resizes without restarting pods",
        ours: {
          mark: "yes",
          note: "in place on Kubernetes 1.33+ nodes; on older nodes pods restart one at a time",
          sources: [],
        },
        theirs: {
          mark: "yes",
          note: "Immediate Rollout resizes in place, with 'a controlled restart only if the kernel can't accommodate the change'",
          sources: ["https://www.cloudbolt.io/stormforge/"],
        },
      },
      {
        label: "Self-hosted or air-gapped option",
        ours: {
          mark: "no",
          note: "the agent runs in your cluster; the control plane is SaaS on Microsoft Azure, Central India",
          sources: [],
        },
        theirs: {
          mark: "no",
          note: "Agent runs in the cluster; a SaaS control plane runs the machine learning analysis",
          sources: ["https://www.cloudbolt.io/stormforge/"],
        },
      },
      {
        label: "Installs with Helm or Terraform",
        ours: {
          mark: "yes",
          note: "zoorikctl, the Helm chart, or Terraform modules for AKS and EKS",
          sources: [],
        },
        theirs: {
          mark: "yes",
          note: "Helm is a prerequisite; EKS add-on with Helm installation options",
          sources: [
            "https://docs.stormforge.io/docs/get-started/",
            "https://aws.amazon.com/marketplace/pp/prodview-ywoktkhczruhk",
          ],
        },
      },
      {
        label: "On AWS Marketplace",
        ours: { mark: "yes", note: "Coral by Zoorik for Amazon EKS", sources: [] },
        theirs: {
          mark: "yes",
          note: "'Optimize Live - Autonomous K8s Workload Rightsizing - Agent Only' (free agent)",
          sources: ["https://aws.amazon.com/marketplace/pp/prodview-ywoktkhczruhk"],
        },
      },
      {
        label: "On Microsoft Marketplace",
        ours: { mark: "yes", note: "Coral on Microsoft Marketplace", sources: [] },
        theirs: {
          mark: "yes",
          note: "'StormForge Optimize' SaaS listing by StormForge",
          sources: [
            "https://marketplace.microsoft.com/en-us/product/stormforgetechnologiesinc1624482470851.optimize_pro",
          ],
        },
      },
      {
        label: "Free tier or trial",
        ours: { mark: "partly", note: "a free cost assessment; the product by demo", sources: [] },
        theirs: {
          mark: "yes",
          note: "Full optimization on 1 cluster for 30 days (the AWS agent listing says 45 days)",
          sources: [
            "https://www.cloudbolt.io/stormforge/",
            "https://aws.amazon.com/marketplace/pp/prodview-ywoktkhczruhk",
          ],
        },
      },
    ],
    pricing: {
      label: "Published pricing",
      ours: "Not published: the price and terms come with your order or marketplace purchase",
      theirs:
        "Not on the product page. CloudBolt's AWS Marketplace post (3 Apr 2025): pay as you go 'Starting at $0.0041 per CPU per hour'; the EKS add-on agent listing is free",
      sources: [
        "https://www.cloudbolt.io/blog/how-to-subscribe-to-stormforge-optimize-live-pay-as-you-go-pricing-on-aws-marketplace/",
      ],
    },
  },
  {
    slug: "amoeba-vs-zesty-disk",
    tool: "Zesty Disk",
    name: "Zesty Disk",
    line: "Kubernetes pod rightsizing, replica and placement optimization, EKS PV autoscaling, Zesty Disk for EBS, and commitment management.",
    rows: [
      {
        label: "Grows and shrinks block storage",
        ours: {
          mark: "yes",
          note: "pools a VM's data disks and grows and shrinks the pool",
          sources: [],
        },
        theirs: {
          mark: "yes",
          note: "PV autoscaling extends and shrinks EKS PVs (existing PVCs must be migrated first); Zesty Disk grows and shrinks EBS filesystems on EC2: Linux (Btrfs or OpenZFS) and Windows Server 2016-2025 (Windows removes only the last-added volume); AWS only",
          sources: [
            "https://docs.zesty.co/docs/system-requirements.md",
            "https://docs.zesty.co/docs/how-zesty-disk-works",
            "https://docs.zesty.co/docs/faq-pvs-autoscaling.md",
          ],
        },
      },
      {
        label: "Azure managed disks",
        ours: { mark: "yes", note: "Azure managed disks on VMs", sources: [] },
        theirs: {
          mark: "no",
          note: "not among the clouds its pages name",
          sources: ["https://docs.zesty.co/docs/zesty-disk"],
        },
      },
      {
        label: "Amazon EBS",
        ours: { mark: "yes", note: "EBS data volumes on EC2", sources: [] },
        theirs: { mark: "yes", note: "", sources: ["https://docs.zesty.co/docs/zesty-disk"] },
      },
      {
        label: "Kubernetes volumes (EKS)",
        ours: { mark: "no", note: "VM data disks, not Kubernetes volumes", sources: [] },
        theirs: {
          mark: "yes",
          note: "EKS 1.28+; PV autoscaling needs the EBS CSI add-on",
          sources: [
            "https://docs.zesty.co/docs/kubernetes-resource-optimization",
            "https://docs.zesty.co/docs/deploy-storage-autoscaling.md",
          ],
        },
      },
      {
        label: "Resizes without downtime",
        ours: {
          mark: "partly",
          note: "the services on the data mounts restart once, at the switch onto the pool; after that the pool grows and shrinks without unmounting",
          sources: [],
        },
        theirs: {
          mark: "yes",
          note: "In-place pod resize on EKS 1.33+; Zesty Disk moves data at runtime without restart (some agent installs on RHEL/Rocky need one instance restart)",
          sources: [
            "https://docs.zesty.co/docs/kubernetes-resource-optimization",
            "https://docs.zesty.co/docs/how-zesty-disk-works",
            "https://docs.zesty.co/docs/install-the-zesty-disk-agent.md",
          ],
        },
      },
      {
        label: "Self-hosted or air-gapped option",
        ours: {
          mark: "no",
          note: "the agent runs on your VM; the control plane is SaaS on Microsoft Azure, Central India",
          sources: [],
        },
        theirs: {
          mark: "unknown",
          note: "AWS listings are SaaS; security page says hosted on Amazon data centers; no self-hosted option mentioned",
          sources: ["https://zesty.co/security-overview/"],
        },
      },
      {
        label: "Installs with Helm or Terraform",
        ours: {
          mark: "no",
          note: "an agent on each VM; on AWS it installs through Systems Manager",
          sources: [],
        },
        theirs: {
          mark: "yes",
          note: "Helm chart for PV autoscaling and the Kubernetes agent; Terraform module onboards AWS accounts and gives Helm values for Kompass; Zesty Disk can be managed with Terraform",
          sources: [
            "https://docs.zesty.co/docs/deploy-storage-autoscaling.md",
            "https://docs.zesty.co/docs/onboard-an-aws-account-with-terraform",
          ],
        },
      },
      {
        label: "On AWS Marketplace",
        ours: { mark: "no", note: "not listed yet", sources: [] },
        theirs: {
          mark: "yes",
          note: "Zesty Platform and Zesty Disk listings",
          sources: [
            "https://aws.amazon.com/marketplace/pp/prodview-xqekqy2ylmwyo",
            "https://aws.amazon.com/marketplace/pp/prodview-vlfhlckav3nnu",
          ],
        },
      },
      {
        label: "On Microsoft Marketplace",
        ours: { mark: "no", note: "not listed yet", sources: [] },
        theirs: {
          mark: "no",
          note: "No publisher starting 'Zesty' in Microsoft's public Marketplace catalog (19 Oct)",
          sources: ["https://marketplace.microsoft.com"],
        },
      },
      {
        label: "Free tier or trial",
        ours: {
          mark: "partly",
          note: "a free disk assessment; the product in early access, by demo",
          sources: [],
        },
        theirs: {
          mark: "unknown",
          note: "Pricing page lists no trial or free tier; offers a free cost efficiency calculator and an ROI projection; AWS listings show no trial",
          sources: ["https://zesty.co/pricing"],
        },
      },
    ],
    pricing: {
      label: "Published pricing",
      ours: "Not published: the price and terms come with your order",
      theirs:
        "Pricing page: 'Usage-based pricing', 'Pricing based on actual usage and realized savings', no figures. PV autoscaling page: 'a base fee plus a fee per storage managed by Zesty', billed on capacity after optimization. AWS Marketplace: Zesty Platform 1-month contract $5,000.00 per month, overage $1.00 per unit. Zesty Disk is a $0.00 12-month contract plus usage: $0.025 per GB up to 300,000 GB, $0.015 up to 1,000,000 GB and $0.01 above.",
      sources: [
        "https://zesty.co/pricing",
        "https://zesty.co/platform/pv-autoscaling/",
        "https://aws.amazon.com/marketplace/pp/prodview-xqekqy2ylmwyo",
        "https://aws.amazon.com/marketplace/pp/prodview-vlfhlckav3nnu",
      ],
    },
  },
];

/** An alternatives page's facts: the market's tools it lists, in its order (each named as the market names it), and
 * its four questions. */
export interface AlternativesFacts {
  readonly product: ProductId;
  readonly tools: readonly string[];
  readonly questions: readonly { readonly q: string; readonly a: string }[];
}

export const alternativesFacts: readonly AlternativesFacts[] = [
  {
    product: "coral",
    tools: [
      "Cast AI",
      "ScaleOps",
      "PerfectScale by DoiT",
      "Kubex",
      "Zesty (Kompass, PV autoscaling, Zesty Disk)",
      "Sedai",
      "DevZero",
      "CloudPilot AI",
      "Wand",
      "StormForge by CloudBolt",
      "Spot Ocean",
      "Harness Cluster Orchestrator (AI and Cloud Costs)",
      "IBM Turbonomic",
      "Komodor",
      "Datadog Kubernetes Autoscaling",
      "Karpenter",
      "Kubernetes Cluster Autoscaler",
      "Vertical Pod Autoscaler (VPA)",
      "KEDA",
      "Goldilocks",
      "Robusta KRR (Kubernetes Resource Recommender)",
      "Descheduler",
    ],
    questions: [
      {
        q: "Does it act, or only recommend?",
        a: "Some tools change requests and machines on their own; others write recommendations someone has to apply.",
      },
      {
        q: "Does it work with your autoscaler?",
        a: "Check that it runs beside Cluster Autoscaler, Karpenter or AKS node auto provisioning, or which one it replaces.",
      },
      {
        q: "Does it run on AKS and EKS?",
        a: "Many tools start on one cloud. If you run both, check both.",
      },
      {
        q: "How does it install, and what leaves your cluster?",
        a: "Helm, Terraform or an agent, and which data goes to the vendor.",
      },
    ],
  },
  {
    product: "amoeba",
    tools: [
      "Lucidity Disk AutoScaler (with Lumen)",
      "Datafy EBS AutoScaler (and EBS Sensor)",
      "Zesty Disk",
      "Zesty PV autoscaling",
      "Sedai (Amazon EBS and Azure Managed Disks optimization)",
      "Amazon EBS Elastic Volumes",
      "AWS Compute Optimizer (EBS recommendations and automation rules)",
      "Azure managed disks (native options: live expand, performance tiers, Premium SSD v2, Elastic SAN)",
      "Azure Advisor (disk cost recommendations)",
      "NetApp Cloud Volumes ONTAP",
      "pvc-autoresizer",
      "Kubernetes VolumeAttributesClass",
    ],
    questions: [
      {
        q: "Does it shrink, or only grow?",
        a: "Many tools only add space. Ask whether it also gives space back, and how.",
      },
      {
        q: "Is there downtime, or a reboot?",
        a: "Some need a reboot to start, or a restart to resize. Ask when, and for how long.",
      },
      {
        q: "Which disks and clouds?",
        a: "Azure managed disks, Amazon EBS, Kubernetes volumes or VM disks: check it covers yours.",
      },
      {
        q: "What runs on your machines?",
        a: "An agent, a filesystem or a storage layer, and what it can see and send.",
      },
    ],
  },
];
