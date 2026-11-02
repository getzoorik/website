import { comparePath, glossaryPath, learnPath, routes } from "@/config/site";
import { assessmentHref } from "@/content/assess";
import type { ProductId } from "@/content/products";
import {
  h3,
  p,
  ul,
  type ProseBlock,
  type ProseQuestion,
  type ProseSection,
  type ProseTile,
} from "@/content/prose-blocks";

/**
 * The comparison pages and their hub: Cloud cost optimization tools at /cloud-cost-optimization-library, the versus
 * pages under /cloud-cost-optimization-library/<slug> and each product's alternatives pages. Competitors are named on these pages only
 * (/learn and every other page are name-free): names only, no logos, every claim with its source and the day it was
 * checked. Code identifiers stay name-free, so a versus page is a `slug`, never a key or a file named after a company.
 */

/**
 * The day the versus pages' content last changed, for the sitemap's `lastmod` only. Whoever changes them moves this to
 * that day in the same PR; never the build's date. 2 Nov 2026: the plan sheet's pass (one line under the h1, the
 * section names, and each repeat taken out).
 */
export const learnCompareLastUpdated = "2 November 2026";

/**
 * The day the two alternatives pages' content last changed, for the sitemap's `lastmod` only, as above. 1 Nov 2026:
 * their titles, h1s, descriptions, decks and section names, and the Amoeba page's line. 2 Nov 2026: their
 * descriptions, decks and the four questions' answers, Coral's question and Amoeba's Azure Elastic SAN.
 */
export const alternativesLastUpdated = "2 November 2026";

/**
 * The day Cloud cost optimization tools' content last changed, for the sitemap's `lastmod` only, as above. 1 Nov
 * 2026: Part 4's title, h1, description and deck, and the calculators' tile names; then its title and h1 again, and
 * its tools' section and group names. 2 Nov 2026: its description and deck, no third cloud named, and its questions.
 */
export const cloudCostToolsLastUpdated = "2 November 2026";

/** A question on Cloud cost optimization tools, whose answer may hold a list. */
export interface LibraryQuestion {
  readonly question: string;
  readonly blocks: readonly ProseBlock[];
}

/** Cloud cost optimization tools' questions, after the calculators: each a search of the page's, answered from the
 *  tiles' facts or its own source. */
const libraryQuestions: readonly LibraryQuestion[] = [
  {
    question: "What are the best cloud cost optimization tools?",
    blocks: [
      p(
        "Cloud cost optimizers work on different parts of your cloud cost, so the best cloud cost management tools match where yours sits:",
      ),
      ul(
        "Kubernetes clusters: Coral, Cast AI and Karpenter change pod requests or nodes, so fewer or cheaper machines run.",
        "VM block storage: Amoeba, Lucidity and Zesty Disk grow and shrink block storage as the data changes.",
        "VMs, databases and other resources: AWS Compute Optimizer and Azure Advisor recommend rightsizing and flag idle resources.",
      ),
    ],
  },
  {
    question: "What is Kubecost?",
    blocks: [
      p(
        `Kubecost, now IBM Kubecost, is Kubernetes cost software. It allocates cluster cost with showback, gives rightsizing advice, and can automate request sizing and namespace turndown. For Kubernetes tools that change requests and nodes on their own, see [Kubernetes cost optimization tools compared](${routes.compareCoralAlternatives}).`,
      ),
    ],
  },
  {
    question: "What is CloudBolt?",
    blocks: [
      /* cloudbolt.io, read 2 Nov 2026. */
      p(
        "CloudBolt sells CloudBolt CMP, for hybrid-cloud governance and provisioning, and a platform for cloud resellers. It also owns StormForge, for Kubernetes rightsizing, bought in March 2025.",
      ),
    ],
  },
  {
    question: "What is AWS Cost Optimization Hub?",
    blocks: [
      /* docs.aws.amazon.com/cost-management/latest/userguide/cost-optimization-hub.html */
      p(
        "Cost Optimization Hub is an AWS cost management feature. It gathers rightsizing, idle, Savings Plans and Reserved Instance recommendations across your AWS accounts and Regions. Its savings estimates count your Reserved Instances and Savings Plans, and its rightsizing and idle recommendations come from AWS Compute Optimizer.",
      ),
    ],
  },
  {
    question: "Are AWS and Azure’s own cost management tools free?",
    blocks: [
      /* azure.microsoft.com/pricing/details/cost-management and /products/advisor; AWS's Cost Explorer guide and
         Compute Optimizer pricing page. */
      ul(
        "Azure Advisor and Microsoft Cost Management: free for Azure, though some Advisor fixes cost money once applied.",
        "AWS Cost Explorer: free in the console, with a charge for each paginated API request.",
        "AWS Compute Optimizer: no additional charge, but enhanced infrastructure metrics are paid.",
      ),
    ],
  },
];

/**
 * Cloud cost optimization tools: every string it prints, verbatim. Its tiles are `shownGroups` in `learn-market.ts`,
 * each read from the market data, its comparison tiles the live versus pages and the alternatives pages below, and the
 * day the facts were checked is `marketChecked`, which the note prints.
 */
export const cloudCostToolsPage = {
  /** The page's `<title>`, as is, and its description. */
  meta: {
    title: "Cloud cost management tools and FinOps tools",
    description:
      "Choose a cloud cost manager for Azure and AWS: Kubernetes, block storage and FinOps tools from Kubecost to Azure Advisor, what each does and how it acts.",
  },
  /** The h1 and its one line (2 Nov 2026: one line under the h1, never a paragraph). */
  hero: {
    title: "Cloud cost management tools and FinOps tools",
    deck: "Only cloud cost tools that reduce what you pay on Azure or AWS, whether they act or recommend.",
  },
  /** The tiles, by kind, under the two rows of chips. */
  tools: {
    id: "tools",
    title: "Cloud cost optimization tools for Azure and AWS",
    /** The chips' names for a screen reader, and their first chips. */
    kinds: { label: "Kind of tool", all: "All" },
    clouds: { label: "Cloud", all: "All clouds" },
    /** When the chips leave no tile: the line, then the button that clears them. */
    none: { line: "No tool matches. ", reset: "Clear the filters" },
    /** The note under the tiles, around the address. */
    note: (checked: string) => ({
      before: `Checked on each company’s own pages, ${checked}. Names are their owners’ trademarks. Something changed? Write to `,
      after: ".",
    }),
  },
  /** Coral and Amoeba compared: the live versus pages, then the alternatives pages, as tiles. */
  ours: {
    id: "ours",
    title: "Compare Coral and Amoeba",
  },
  /** The two calculators, after Compare Coral and Amoeba, in its tiles' style: each tile is the calculator's own. */
  calculators: {
    id: "calculators",
    title: "Free calculators",
  },
  /** After the calculators. */
  questions: {
    id: "questions",
    title: "Questions about these tools",
    rows: libraryQuestions,
  },
} as const;

/** A source of a versus page's prose: who publishes it, its title as the page prints it (in its quotes), its page. */
export interface VersusSource {
  readonly publisher: string;
  readonly title: string;
  readonly url: `https://${string}`;
}

/** A Read more tile: a page's own, or another versus page's, titled with its h1 and its library tile line. */
export type VersusTile = ProseTile | { readonly versus: string };

export interface VersusPage {
  /** Its address under Cloud cost optimization tools (`comparePath`). */
  readonly slug: string;
  readonly product: ProductId;
  /** The page's `<title>` (through the site's "%s | Zoorik" template) and description; the title is its h1 and the
   *  description its deck, unless it has its own (`deck`). */
  readonly meta: { readonly title: string; readonly description: string };
  /** Its deck under the h1, where it is not the description (1 Nov 2026: the description carries the searches). */
  readonly deck?: string;
  /** Its own names for At a glance, Side by side, Sources and Read more, where they are not the shared ones. */
  readonly titles?: {
    readonly glance?: string;
    readonly table?: string;
    readonly sources?: string;
    readonly readMore?: string;
  };
  /** Its tile's line on Cloud cost optimization tools' Compare Coral and Amoeba. */
  readonly line: string;
  /**
   * The day its facts were checked, which its kicker and its fine print print, where it is not the market's
   * (`marketChecked`, in `learn-market.ts`): a page checked on its own day.
   */
  readonly checked?: string;
  /** The day its content last changed, for the sitemap's `lastmod` only, where it is not `learnCompareLastUpdated`. */
  readonly lastUpdated?: string;
  /**
   * Its own share card, `public/og/pages/<slug>.png`, whose words are its title. Without one, the page shares its
   * product's comparison card with the alternatives page (`social.ts`).
   */
  readonly card?: true;
  /*
   * The optional parts (the 1 Nov 2026 pages; their drafts' open item X1), each drawn only where it is set, so a page
   * without them prints exactly as before: the short answer, the first paragraph before At a glance (2 Nov 2026); the
   * sections after the table, in the Learn frame; the questions; the sources of the prose; and Read more.
   */
  readonly short?: string;
  readonly sections?: readonly ProseSection[];
  readonly questions?: { readonly title: string; readonly rows: readonly ProseQuestion[] };
  readonly sources?: readonly VersusSource[];
  readonly readMore?: readonly VersusTile[];
}

/** What the 1 Nov 2026 versus pages print around their optional parts. */
export const versusFrameCopy = {
  sources: { id: "sources", title: "Sources" },
  /** Named for the product the page compares: "Coral docs and guides". */
  readMore: (product: string) => `${product} docs and guides`,
} as const;

/** The day the two 1 Nov 2026 versus pages were checked and written. */
const NOV_1 = "1 November 2026";
/** The plan sheet's pass of 2 Nov 2026, the day those two last changed. */
const NOV_2 = "2 November 2026";

/** The library's tile line, its last tile on both new pages' Read more. */
const libraryTile = {
  title: "Cloud cost optimization tools",
  href: routes.cloudCostTools,
  line: "The tools that reduce cloud cost on Azure and AWS, and how each one acts",
} as const;

const kubernetesTile = {
  title: "Kubernetes cost optimization",
  href: routes.kubernetesCostOptimization,
  line: "Rebalance requests to real use, then let spare nodes go",
} as const;

/**
 * The versus pages that are live, each against a tool that is not a direct competitor: one per product (19 Oct 2026),
 * then, since 1 Nov 2026, two more for Coral against the clouds' own tools (Azure Advisor, AWS Compute Optimizer), word
 * for word from their checked drafts (docs/website-seo/new-pages-2026-11-01/<slug>/page.md, every claim in its
 * ledger.md) and their mocks (ux-design/website/compare-<slug>.html). In this order on Cloud cost optimization tools'
 * two-by-two tiles, the first two keep their row. The other seven are held until the first 10 clients: not built, not
 * shown, not linked.
 */
export const versusPages: readonly VersusPage[] = [
  {
    slug: "coral-vs-stormforge",
    product: "coral",
    meta: {
      title: "StormForge vs Coral",
      description:
        "StormForge and Coral both reduce Kubernetes cost. See how each works with HPA and Karpenter, and its pricing, side by side, from each company’s own pages.",
    },
    deck: "Both set pod requests on AKS and EKS, but only Coral empties spare nodes for your autoscaler to remove.",
    titles: {
      glance: "StormForge and Coral at a glance",
      table: "StormForge vs Coral, feature by feature",
    },
    line: "What each one does for Kubernetes cost on Azure and AWS, side by side.",
    questions: {
      title: "Questions about StormForge and Coral",
      rows: [
        {
          question: "What is StormForge?",
          /* cloudbolt.io, read 2 Nov 2026. */
          answer:
            "StormForge is CloudBolt's Kubernetes rightsizing product, bought in March 2025. CloudBolt also sells CloudBolt CMP, for hybrid-cloud governance and provisioning, and a platform for cloud resellers.",
        },
        {
          question: "How much does StormForge cost?",
          answer: `Its product page gives no price. CloudBolt's AWS Marketplace post (3 Apr 2025) gives a pay-as-you-go price: "Starting at $0.0041 per CPU per hour". The EKS add-on agent listing is free.`,
        },
        {
          question: "Does StormForge manage nodes?",
          answer: `No. Its FAQ says it adjusts pod requests and limits, while "tools like Karpenter optimize the nodes themselves".`,
        },
      ],
    },
  },
  {
    slug: "amoeba-vs-zesty-disk",
    product: "amoeba",
    meta: {
      title: "Amoeba vs Zesty Disk",
      description:
        "Amoeba vs Zesty Disk: both reduce block storage cost. What each one does, its clouds and its pricing, side by side, from each company’s own pages.",
    },
    deck: "Both grow and shrink block storage on running VMs, but only Amoeba works on Azure managed disks.",
    line: "What each one does for block storage cost on Azure and AWS, side by side.",
  },

  {
    slug: "coral-vs-azure-advisor",
    product: "coral",
    meta: {
      title: "Azure Advisor vs Coral",
      description:
        "Microsoft’s free Azure Advisor gives cost recommendations across Azure, and you apply each fix. Coral acts inside your AKS and EKS clusters. Side by side.",
    },
    deck: "Microsoft’s free tool covers many Azure services, while Coral works only inside AKS and EKS clusters.",
    titles: {
      glance: "Coral and Azure Advisor at a glance",
      table: "Coral vs Azure Advisor, feature by feature",
      sources: "Sources on Azure Advisor and AKS",
      readMore: "More on AKS cost and Azure Advisor",
    },
    line: "What each one does for AKS cost on Azure, side by side.",
    checked: NOV_1,
    lastUpdated: NOV_2,
    card: true,
    short:
      "Use both. Advisor's AKS advice leaves each change to you. Coral empties spare nodes and, once switched on, rebalances pod requests to real use.",
    sections: [
      {
        id: "which-to-use",
        title: "Which one to use",
        blocks: [
          p(
            "Start with Azure Advisor, which needs nothing installed. Then add a tool where Advisor can only point at the fix.",
          ),
          ul(
            "Use Advisor across Azure: idle VMs, unattached disks, reservations and savings plans.",
            "Use Coral where your cost sits in AKS or EKS clusters. Coral rebalances CPU and memory requests beside your Horizontal Pod Autoscaler (HPA).",
            `Use Amoeba where VM data disks are bigger than the data on them, on Azure or AWS: Advisor's cost list never makes a disk in use smaller. See [Azure managed disk cost optimization](${routes.azureManagedDiskCostOptimization}).`,
          ),
          p(
            `On AWS, Coral covers EKS the same way: see [EKS cost optimization](${routes.eksCostOptimization}). For the rest of your Azure cost, read our guide to [Azure cost optimization](${routes.azureCostOptimization}).`,
          ),
        ],
      },
      {
        id: "aks-recommendations",
        title: "What Azure Advisor recommends for AKS",
        blocks: [
          p(
            `Kubernetes places each pod by its [requests](${glossaryPath("kubernetes-resource-requests")}), not by what it uses. The scheduler keeps the sum of requests on a node below the node's capacity. So a node can be full while its CPU sits close to idle.`,
          ),
          p(
            "The Cluster Autoscaler on AKS counts requests too, when it works out how busy a node is. So you reduce requests first. Then the autoscaler has spare nodes to remove.",
          ),
          p("Advisor's cost list has five recommendations for AKS:"),
          ul(
            `Run the [Vertical Pod Autoscaler (VPA)](${glossaryPath("vertical-pod-autoscaler")}) in recommendation mode, for request and limit values.`,
            "Tune the cluster autoscaler profile, so unneeded nodes go sooner.",
            `Turn on [AKS cost analysis](${learnPath("aks-cost-analysis")}), to split cluster cost by Kubernetes constructs or Azure assets.`,
            "Use Spot nodes for work that can handle interruptions.",
            "Move to Prometheus-based Container Insights, to reduce monitoring cost.",
          ),
          p(
            "The first two go after requests and spare nodes, and both leave the work with you. Run that way, the VPA calculates values but changes no pod. So someone sets them, workload by workload.",
          ),
          p(
            `Microsoft also doesn't recommend the VPA beside an HPA that scales on CPU or memory. [HPA vs VPA](${learnPath("vpa-vs-hpa")}) explains why the two clash.`,
          ),
          p(
            `Our [Kubernetes cost optimization guide](${routes.kubernetesCostOptimization}) walks through both steps by hand, and [AKS cost optimization](${routes.aksCostOptimization}) shows what Coral sets up on AKS.`,
          ),
        ],
      },
    ],
    questions: {
      title: "Questions about Coral and Azure Advisor",
      rows: [
        {
          question: "What is Azure Advisor?",
          answer:
            "Azure Advisor is Microsoft's digital cloud assistant for following Azure best practices. Its dashboard in the Azure portal lists personalized recommendations for all your subscriptions. Reader access is enough to see them.",
        },
        {
          question: "Is Azure Advisor free?",
          answer:
            "Yes. Microsoft says Advisor is available at no additional cost. Some fixes cost money once you apply them, such as turning on VM backup.",
        },
        {
          question: "Are Advisor's saving figures exact?",
          answer: `Not always. Advisor prices VM and scale set savings at retail rates, before your discounts, so Microsoft says they might be higher than possible. Coral's figures use list prices too, and our [EKS and AKS pricing calculator](${routes.eksAndAksPricingCalculator}) shows a node's list price.`,
        },
        {
          question: "How do you see what Coral would save on your AKS cluster?",
          answer: `Run the [free assessment](${assessmentHref("coral")}). It's read-only, runs in Azure Cloud Shell or your terminal, and writes one PDF with your estimated saving at list price. Nothing is sent to Zoorik.`,
        },
      ],
    },
    sources: [
      {
        publisher: "Microsoft Learn",
        title: "“Introduction to Azure Advisor”",
        url: "https://learn.microsoft.com/en-us/azure/advisor/advisor-overview",
      },
      {
        publisher: "Microsoft Learn",
        title: "“Cost recommendations - Azure Advisor”",
        url: "https://learn.microsoft.com/en-us/azure/advisor/advisor-reference-cost-recommendations",
      },
      {
        publisher: "Microsoft Learn",
        title:
          "“Optimize virtual machine (VM) or virtual machine scale set (VMSS) spend by resizing or shutting down underutilized instances”",
        url: "https://learn.microsoft.com/en-us/azure/advisor/advisor-cost-recommendations",
      },
      {
        publisher: "Microsoft Azure",
        title: "“Azure Advisor”",
        url: "https://azure.microsoft.com/en-us/products/advisor/",
      },
      {
        publisher: "Microsoft Learn",
        title: "“Vertical Pod Autoscaling in Azure Kubernetes Service (AKS)”",
        url: "https://learn.microsoft.com/en-us/azure/aks/vertical-pod-autoscaler",
      },
      {
        publisher: "Microsoft Learn",
        title: "“Cluster autoscaling in Azure Kubernetes Service (AKS) overview”",
        url: "https://learn.microsoft.com/en-us/azure/aks/cluster-autoscaler-overview",
      },
      {
        publisher: "Kubernetes",
        title: "“Resource Management for Pods and Containers”",
        url: "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/",
      },
    ],
    readMore: [
      {
        title: "AKS cost optimization",
        href: routes.aksCostOptimization,
        line: "What Coral does on AKS, and what connect sets up",
      },
      kubernetesTile,
      {
        title: "AKS cost analysis",
        href: learnPath("aks-cost-analysis"),
        line: "What the add-on shows, and what it leaves out",
      },
      libraryTile,
      { versus: "coral-vs-aws-compute-optimizer" },
    ],
  },
  {
    slug: "coral-vs-aws-compute-optimizer",
    product: "coral",
    meta: {
      title: "AWS Compute Optimizer vs Coral for EKS",
      description:
        "AWS Compute Optimizer is free and gives EKS node groups idle recommendations, not rightsizing. Coral rebalances pods and removes spare nodes. Side by side.",
    },
    deck: "Compute Optimizer reads instance metrics, while Coral works from the pod requests that decide your EKS node count.",
    titles: {
      glance: "Coral and AWS Compute Optimizer at a glance",
      table: "Coral vs Compute Optimizer, feature by feature",
      sources: "Sources on AWS Compute Optimizer and EKS",
      readMore: "More on EKS cost and Compute Optimizer",
    },
    line: "What each one does for EKS nodes and EC2 instances, side by side.",
    checked: NOV_1,
    lastUpdated: NOV_2,
    card: true,
    short:
      "Use both. Compute Optimizer covers the AWS resources outside your clusters. Coral works inside EKS: it empties spare nodes and, once switched on, rebalances pod requests to real use.",
    sections: [
      {
        id: "compute-optimizer-eks",
        title: "AWS Compute Optimizer and EKS node groups",
        blocks: [
          p(
            `Amazon EKS runs each managed node group as an EC2 Auto Scaling group. AWS Compute Optimizer makes rightsizing recommendations for Auto Scaling groups, but not for groups that run Amazon EKS workloads. It also makes no EC2 rightsizing recommendations for [Spot Instances](${glossaryPath("spot-instance")}).`,
          ),
          p(
            "What an EKS node group can get is an idle recommendation. A group is idle only if each instance stayed within 5% peak CPU and 5 MB of network a day, over 14 days. Then Compute Optimizer suggests scaling the group down to one instance, or deleting it.",
          ),
          h3("Why a node can look idle and still be full", "requests-not-use"),
          p(
            `Kubernetes places each pod by its [CPU and memory requests](${glossaryPath("kubernetes-resource-requests")}), not by what it uses. The scheduler refuses a pod when the requests don't fit, even if the node's real use is very low.`,
          ),
          p(
            "So a node can show little CPU use and still have no room for another pod. A type sized to the instance's use can then be too small for the requests its pods carry.",
          ),
          p(
            `The saving starts with the requests. Size them to real use, and fewer EC2 instances can carry the same work. [Kubernetes pod right sizing](${learnPath("kubernetes-pod-right-sizing")}) shows how, and [Kubernetes cost optimization](${routes.kubernetesCostOptimization}) takes you from requests to nodes.`,
          ),
        ],
      },
      {
        id: "use-both",
        title: "How to use Coral and Compute Optimizer together",
        blocks: [
          ul(
            "Outside your clusters, use Compute Optimizer for standalone EC2 instances and your other AWS resources.",
            `Inside EKS, use Coral. [EKS cost optimization](${routes.eksCostOptimization}) shows what connect sets up in your AWS account.`,
            `To move a node group to a cheaper type yourself, create a new group, then drain the old nodes. [How to change an EKS node group instance type](${learnPath("change-eks-node-group-instance-type")}) has the steps. Our [EKS pricing calculator](${routes.eksAndAksPricingCalculator}) shows what a node costs a month.`,
            `For EBS data volumes on your VMs, Compute Optimizer recommends volume configurations. Amoeba moves a VM's data volumes onto one btrfs pool sized to your data, then rightsizes it. See [EBS cost optimization](${routes.ebsCostOptimization}), and [what Compute Optimizer recommends for EBS volumes](${learnPath("compute-optimizer-ebs")}).`,
          ),
          p(
            `For the rest of your AWS cost, see [AWS cost optimization](${routes.awsCostOptimization}).`,
          ),
        ],
      },
    ],
    questions: {
      title: "Questions about Coral and AWS Compute Optimizer",
      rows: [
        {
          question: "What is AWS Compute Optimizer?",
          answer:
            "AWS Compute Optimizer is an AWS service you opt in to. It reads 14 days of CloudWatch metrics from resources such as EC2 instances, Auto Scaling groups, EBS volumes, Lambda functions and RDS databases. Then it recommends rightsizing and flags idle resources.",
        },
        {
          question: "Is AWS Compute Optimizer free?",
          answer:
            "Yes. AWS makes no additional charge for it: you pay for your AWS resources and CloudWatch monitoring. Enhanced infrastructure metrics, with up to three months of history, cost $0.0003360215 per resource per hour, about $0.25 for a full 31-day month.",
        },
        {
          question: "Does Coral change EKS managed node groups?",
          answer:
            "Coral empties spare nodes. The Cluster Autoscaler terminates them, or Coral does where nothing else scales the group and you allow node removal. Coral may also reduce a group's minimum size if that alone keeps an emptied node, but never adds machines to the group.",
        },
        {
          question: "Can Coral move EKS nodes to cheaper instance types?",
          answer:
            "Yes, with Karpenter. A rebalance moves work from the nodes you choose onto cheaper EC2 instances that Karpenter launches. With only the Cluster Autoscaler, Coral removes nodes and keeps each group's instance types.",
        },
        {
          question: "How do you see what Coral would save on your EKS cluster?",
          answer: `Run the [free assessment](${assessmentHref("coral")}). It's read-only, runs in AWS CloudShell or your terminal, and writes one PDF with your estimated saving at list price. Nothing is sent to Zoorik.`,
        },
      ],
    },
    sources: [
      {
        publisher: "AWS Compute Optimizer User Guide",
        title: "“What is AWS Compute Optimizer?”",
        url: "https://docs.aws.amazon.com/compute-optimizer/latest/ug/what-is-compute-optimizer.html",
      },
      {
        publisher: "AWS Compute Optimizer User Guide",
        title: "“AWS resources supported by Compute Optimizer”",
        url: "https://docs.aws.amazon.com/compute-optimizer/latest/ug/supported-resources.html",
      },
      {
        publisher: "AWS Compute Optimizer User Guide",
        title: "“Viewing idle resource recommendations”",
        url: "https://docs.aws.amazon.com/compute-optimizer/latest/ug/view-idle-recommendations.html",
      },
      {
        publisher: "AWS Compute Optimizer User Guide",
        title: "“EC2 instance metrics”",
        url: "https://docs.aws.amazon.com/compute-optimizer/latest/ug/ec2-metrics-analyzed.html",
      },
      {
        publisher: "AWS",
        title: "“AWS Compute Optimizer FAQs”",
        url: "https://aws.amazon.com/compute-optimizer/faqs/",
      },
      {
        publisher: "AWS",
        title: "“AWS Compute Optimizer Pricing”",
        url: "https://aws.amazon.com/compute-optimizer/pricing/",
      },
      {
        publisher: "Amazon EKS User Guide",
        title: "“Simplify node lifecycle with managed node groups”",
        url: "https://docs.aws.amazon.com/eks/latest/userguide/managed-node-groups.html",
      },
      {
        publisher: "Kubernetes",
        title: "“Resource Management for Pods and Containers”",
        url: "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/",
      },
    ],
    readMore: [
      {
        title: "EKS cost optimization",
        href: routes.eksCostOptimization,
        line: "What Coral does on EKS, and what connect sets up",
      },
      kubernetesTile,
      {
        title: "What AWS Compute Optimizer recommends for EBS volumes",
        href: learnPath("compute-optimizer-ebs"),
        line: "The EBS side of Compute Optimizer",
      },
      {
        title: "How to choose EKS instance types",
        href: learnPath("how-to-choose-eks-instance-types"),
        line: "Match the instance family to your pods' requests first",
      },
      libraryTile,
      { versus: "coral-vs-azure-advisor" },
    ],
  },
];

export const versusRoute = (page: VersusPage): `/${string}` => `${comparePath}/${page.slug}`;

export interface AlternativesPage {
  readonly route: string;
  readonly product: ProductId;
  /** Its h1, and its tile's title on Cloud cost optimization tools. */
  readonly h1: string;
  /** The `<title>`'s own words (before " | Zoorik") and the description, which is its deck unless it has its own. */
  readonly meta: { readonly title: string; readonly description: string };
  /** Its deck under the h1, where it is not the description (1 Nov 2026: the description carries the searches). */
  readonly deck?: string;
  /** Its own names for How to choose and The options, where they are not `alternativesCopy`'s. */
  readonly titles?: { readonly choose?: string; readonly options?: string };
  /** Its tile's line on Cloud cost optimization tools' Compare Coral and Amoeba. */
  readonly line: string;
  /** The sections after The options, in the Learn frame (2 Nov 2026), each drawn only where it is set. */
  readonly sections?: readonly ProseSection[];
  /** Its questions, after The options (2 Nov 2026). */
  readonly questions?: { readonly title: string; readonly rows: readonly ProseQuestion[] };
}

/** Each product's alternatives page. */
export const alternativesPages: readonly AlternativesPage[] = [
  {
    route: routes.compareCoralAlternatives,
    product: "coral",
    h1: "Kubernetes cost optimization tools compared",
    meta: {
      title: "Kubernetes cost optimization tools compared",
      description:
        "Kubernetes cost optimization software compared: Coral, Cast AI and its competitors, Goldilocks and Karpenter. What each does on AKS and EKS, from its own pages.",
    },
    deck: "Open-source autoscalers and commercial platforms for AKS and EKS, and whether each one acts or only recommends.",
    titles: {
      choose: "How to choose a Kubernetes cost tool for AKS and EKS",
      options: "Cast AI competitors and other Kubernetes cost tools",
    },
    line: "Every way to reduce Kubernetes cost on AKS and EKS, and how each one acts.",
    questions: {
      title: "Questions about these tools",
      rows: [
        {
          question: "What is Cast AI?",
          answer:
            "Cast AI is an independent Kubernetes optimization vendor. Its site, cast.ai, says it automates workload rightsizing, node autoscaling, Spot use and bin-packing. It acts on its own, on AKS and EKS.",
        },
      ],
    },
  },
  {
    route: routes.compareAmoebaAlternatives,
    product: "amoeba",
    h1: "Azure disk and EBS cost tools compared",
    meta: {
      title: "Azure disk and EBS cost tools compared",
      description:
        "Azure disk and EBS cost tools compared, from Zesty Disk to NetApp Cloud Volumes ONTAP (CVO): what each does, whether it acts or recommends, and where it runs.",
    },
    deck: "Disk autoscalers, cloud features and storage layers for Azure managed disks and Amazon EBS, and which ones shrink.",
    titles: { choose: "How to choose a disk autoscaler" },
    line: "Every way to rightsize Azure managed disks and Amazon EBS, and how each one acts.",
    sections: [
      {
        id: "elastic-san",
        title: "Azure Elastic SAN",
        blocks: [
          p(
            "[Microsoft says](https://learn.microsoft.com/en-us/azure/storage/elastic-san/elastic-san-introduction) consolidating storage onto Elastic SAN can be more cost effective with many IO-intensive workloads and top-tier databases. You can also add capacity without adding performance.",
          ),
        ],
      },
    ],
  },
];

/** What a versus page prints around its facts. */
export const versusCopy = {
  /** Over the h1. */
  kicker: (checked: string) => `Compare · checked ${checked}`,
  glance: {
    id: "glance",
    title: "At a glance",
    /** Our side's link to its product page. */
    see: (product: string) => `See ${product}`,
  },
  table: {
    id: "side-by-side",
    title: "Side by side",
    caption: (ours: string, theirs: string) => `${ours} and ${theirs}, side by side`,
  },
  /** A claim's link to the page it comes from; numbered where a claim has more than one ("source 1", "source 2"). */
  source: "source",
  /** The fine print under the table, around the address. */
  fine: (theirs: string, checked: string) => ({
    before: `${theirs} is a trademark of its owner. Everything said here about ${theirs} comes from its own public pages, each linked, checked ${checked}. “Not stated” means its pages do not say. Something changed? Write to `,
    after: " and we will correct it.",
  }),
} as const;

/** What an alternatives page prints around its facts. */
export const alternativesCopy = {
  kicker: (checked: string) => `Alternatives · checked ${checked}`,
  choose: {
    id: "choose",
    title: "How to choose",
  },
  options: {
    id: "options",
    title: "The options",
  },
  /** A listed tool's link to its live versus page. */
  compare: (product: string) => `Compare with ${product}`,
  /** The note under the list, around the address. */
  note: (checked: string) => ({
    before: `Names, owners and descriptions come from each company’s own pages, checked ${checked}. Names are their owners’ trademarks. Something changed? Write to `,
    after: ".",
  }),
} as const;
