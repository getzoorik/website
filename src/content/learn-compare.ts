import { comparePath, glossaryPath, learnPath, routes } from "@/config/site";
import { assessmentHref } from "@/content/assess";
import type { ProductId } from "@/content/products";
import {
  h3,
  p,
  ul,
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
 * that day in the same PR; never the build's date.
 */
export const learnCompareLastUpdated = "1 November 2026";

/**
 * The day the two alternatives pages' content last changed, for the sitemap's `lastmod` only, as above. 1 Nov 2026:
 * their titles, h1s, descriptions, decks and section names, and the Amoeba page's line.
 */
export const alternativesLastUpdated = "1 November 2026";

/**
 * The day Cloud cost optimization tools' content last changed, for the sitemap's `lastmod` only, as above. 1 Nov
 * 2026: Part 4's title, h1, description and deck, and the calculators' tile names; then its title and h1 again, and
 * its tools' section and group names.
 */
export const cloudCostToolsLastUpdated = "1 November 2026";

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
      "Cloud cost management tools for Azure and AWS: the cloud cost optimization tools and FinOps tools that reduce what you pay, and how each one acts.",
  },
  /** The h1 and, as the page has no intro, the deck is its first paragraph (Part 4, 1 Nov 2026). */
  hero: {
    title: "Cloud cost management tools and FinOps tools",
    deck: "These cloud cost management tools reduce what you pay on Azure and AWS. Each tile says what the tool does, how it acts and which clouds it supports. Filter them by cloud, or by kind: block storage, Kubernetes, FinOps tools or the cloud providers’ own.",
  },
  /** The tiles, by kind, under the two rows of chips. */
  tools: {
    id: "tools",
    title: "Cloud cost optimization tools for Azure and AWS",
    /** The chips' names for a screen reader, and their first chips. */
    kinds: { label: "Kind of tool", all: "All" },
    clouds: { label: "Cloud", all: "All clouds" },
    /** After a tile's two clouds, where its pages name Google Cloud too. */
    googleCloud: "+ Google Cloud",
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
   * without them prints exactly as before: the short answer under the deck; the sections after the table, in the Learn
   * frame; the questions; the sources of the prose; and Read more.
   */
  readonly short?: string;
  readonly sections?: readonly ProseSection[];
  readonly questions?: { readonly title: string; readonly rows: readonly ProseQuestion[] };
  readonly sources?: readonly VersusSource[];
  readonly readMore?: readonly VersusTile[];
}

/** What the 1 Nov 2026 versus pages print around their optional parts. */
export const versusFrameCopy = {
  /** Before the short answer, in bold. */
  short: "Short answer.",
  sources: { id: "sources", title: "Sources" },
  /** Named for the product the page compares: "Coral docs and guides". */
  readMore: (product: string) => `${product} docs and guides`,
} as const;

/** The day the two 1 Nov 2026 versus pages were checked and written. */
const NOV_1 = "1 November 2026";

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
    deck: "StormForge and Coral both reduce the cost of Kubernetes. Here is what each one does, side by side, from each company’s own pages.",
    line: "What each one does for Kubernetes cost on Azure and AWS, side by side.",
    questions: {
      title: "Questions about StormForge and Coral",
      rows: [
        {
          question: "What is StormForge?",
          answer:
            "StormForge, by CloudBolt, uses machine learning to rightsize container requests and limits, and recalculates HPA targets along with them. It leaves nodes to node autoscalers.",
        },
        {
          question: "How much does StormForge cost?",
          answer: `Its product page gives no price. CloudBolt's AWS Marketplace post (3 Apr 2025) gives a pay-as-you-go price: "Starting at $0.0041 per CPU per hour". The EKS add-on agent listing is free. Coral is priced per vCPU it manages, bought on AWS or Microsoft Marketplace.`,
        },
        {
          question: "Does StormForge manage nodes?",
          answer: `No. Its FAQ says it adjusts pod requests and limits, while "tools like Karpenter optimize the nodes themselves". Coral empties spare machines so the autoscaler removes them, and rebalances work onto cheaper ones.`,
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
    deck: "Both reduce the cost of block storage. Here is what each one does, side by side, from each company’s own pages.",
    line: "What each one does for block storage cost on Azure and AWS, side by side.",
  },

  {
    slug: "coral-vs-azure-advisor",
    product: "coral",
    meta: {
      title: "Azure Advisor vs Coral",
      description:
        "Azure Advisor recommends cost fixes across Azure, for free. Coral acts inside your AKS and EKS clusters. Here is what each one does, side by side.",
    },
    line: "What each one does for AKS cost on Azure, side by side.",
    checked: NOV_1,
    lastUpdated: NOV_1,
    card: true,
    short:
      "You apply each Advisor fix yourself. Coral works only in AKS or EKS clusters, where it empties spare nodes and, once switched on, rebalances pod requests to real use.",
    sections: [
      {
        id: "which-to-use",
        title: "Which one to use",
        blocks: [
          p(
            "Use both, starting with Azure Advisor, which is free and needs nothing installed. It shows recommendations for all your subscriptions. Then add a tool where Advisor can only point at the fix.",
          ),
          ul(
            "Use Advisor across Azure: idle VMs, unattached disks, reservations and savings plans.",
            "Use Coral where your cost sits in AKS or EKS clusters. Coral rebalances CPU and memory requests, works with your Horizontal Pod Autoscaler (HPA), and drains spare nodes so your autoscaler can remove them.",
            `Use Amoeba where VM data disks are bigger than the data on them, on Azure or AWS: Advisor's cost list never makes a disk in use smaller. See [Azure managed disk cost optimization](${routes.azureManagedDiskCostOptimization}).`,
          ),
          p(
            `Advisor stops at Azure. On AWS, Coral covers EKS the same way: see [EKS cost optimization](${routes.eksCostOptimization}). For the rest of your Azure cost, read our guide to [Azure cost optimization](${routes.azureCostOptimization}).`,
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
            "Coral does that work, and keeps doing it. It sizes requests to real use and works with your HPA. Coral also empties spare nodes, so the Cluster Autoscaler or NAP removes them.",
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
            "Azure Advisor is Microsoft's free Azure service that analyzes configuration and usage to recommend cost, reliability, security, performance and operational excellence improvements.",
        },
        {
          question: "Is Azure Advisor free?",
          answer:
            "Yes. Microsoft says Advisor is available at no additional cost. Some fixes cost money once you apply them, such as turning on VM backup.",
        },
        {
          question: "Does Azure Advisor rightsize AKS pods?",
          answer:
            "No. For AKS, it recommends the Vertical Pod Autoscaler in recommendation mode. That mode calculates request and limit values, but changes no pod.",
        },
        {
          question: "Does Coral replace Azure Advisor?",
          answer:
            "No. Advisor covers many Azure services, plus reservations and savings plans, while Coral covers only AKS and EKS clusters. Keep using Advisor, and let Coral act inside your clusters.",
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
        "AWS Compute Optimizer gives EKS node groups idle recommendations, not rightsizing. Coral rebalances pod requests and removes spare nodes. Side by side.",
    },
    line: "What each one does for EKS nodes and EC2 instances, side by side.",
    checked: NOV_1,
    lastUpdated: NOV_1,
    card: true,
    short:
      "Kubernetes places pods by their requests, which instance metrics don't show. Coral empties spare EKS nodes for your autoscaler to remove and, once switched on, rebalances pod requests to real use.",
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
            "So a node can show little CPU use and still have no room for another pod. Compute Optimizer reads the instance, not the requests. A type sized to the instance's use can be too small for the requests its pods carry.",
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
          p("The two read different things, so you can run both. Here is where each one fits:"),
          ul(
            "Outside your clusters, use Compute Optimizer. It covers standalone EC2 instances, Lambda functions, RDS databases and more. You opt in, and it reads 14 days of CloudWatch metrics.",
            `Inside EKS, use Coral. It rebalances pod requests to real use, and empties spare nodes for Karpenter or the Cluster Autoscaler to remove. [EKS cost optimization](${routes.eksCostOptimization}) shows what connect sets up in your AWS account.`,
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
            "AWS Compute Optimizer is an AWS service that analyzes your AWS resources' configuration and utilization metrics to provide rightsizing recommendations and identify idle resources.",
        },
        {
          question: "Is AWS Compute Optimizer free?",
          answer:
            "Yes. AWS makes no additional charge for it: you pay for your AWS resources and CloudWatch monitoring. Enhanced infrastructure metrics, with up to three months of history, cost $0.0003360215 per resource per hour, about $0.25 for a full 31-day month.",
        },
        {
          question: "Does AWS Compute Optimizer support EKS?",
          answer: `Partly. For the Auto Scaling groups behind EKS node groups, it makes idle recommendations but no rightsizing ones. AWS lists "Amazon ECS or Amazon EKS workloads" among the groups it doesn't rightsize.`,
        },
        {
          question: "Can Coral and AWS Compute Optimizer run together?",
          answer:
            "Yes. Compute Optimizer reads CloudWatch metrics and recommends changes to AWS resources. Coral works inside your AKS and EKS clusters, on pod requests and nodes.",
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
        "Kubernetes cost optimization tools compared: Coral, Cast AI and its competitors, Goldilocks and Karpenter. What each does on AKS and EKS, from its own pages.",
    },
    deck: "Weighing Coral against other Kubernetes cost optimization tools on AKS and EKS? Here is each option, what it does and how it acts, from each company’s own pages.",
    titles: {
      choose: "How to choose a Kubernetes cost tool for AKS and EKS",
      options: "Cast AI competitors and other Kubernetes cost tools",
    },
    line: "Every way to reduce Kubernetes cost on AKS and EKS, and how each one acts.",
  },
  {
    route: routes.compareAmoebaAlternatives,
    product: "amoeba",
    h1: "Azure disk and EBS cost tools compared",
    meta: {
      title: "Azure disk and EBS cost tools compared",
      description:
        "Azure disk and EBS cost optimization tools, compared: what each does, whether it acts or recommends, and where it runs.",
    },
    deck: "Tools that reduce Azure managed disk and Amazon EBS cost, compared: what each does, whether it acts or recommends, and where it runs.",
    titles: { choose: "How to choose a disk autoscaler" },
    line: "Every way to rightsize Azure managed disks and Amazon EBS, and how each one acts.",
  },
];

/** What a versus page prints around its facts. */
export const versusCopy = {
  /** Over the h1. */
  kicker: (checked: string) => `Compare · checked ${checked}`,
  glance: {
    id: "glance",
    title: "At a glance",
    lede: "What each one is, in its maker’s words.",
    /** Our side's link to its product page. */
    see: (product: string) => `See ${product}`,
  },
  table: {
    id: "side-by-side",
    title: "Side by side",
    lede: "From the product pages and docs of each.",
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
    lede: "Four questions to ask before you pick a tool.",
  },
  options: {
    id: "options",
    title: "The options",
    lede: "The tools you are likely to meet, what each does, and how it acts.",
  },
  /** A listed tool's link to its live versus page. */
  compare: (product: string) => `Compare with ${product}`,
  /** The note under the list, around the address. */
  note: (checked: string) => ({
    before: `Names, owners and descriptions come from each company’s own pages, checked ${checked}. Names are their owners’ trademarks. Something changed? Write to `,
    after: ".",
  }),
} as const;
