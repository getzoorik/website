import { comparePath, glossaryPath, learnPath, routes } from "@/config/site";
import { assessContent, assessmentHref } from "@/content/assess";
import type { ProductId } from "@/content/products";
import {
  h3,
  ol,
  p,
  ul,
  type ProseQuestion,
  type ProseSection,
  type ProseTile,
} from "@/content/prose-blocks";

/**
 * The two Topic pages: `/azure-cost-optimization` and `/aws-cost-optimization` (D229; owner, 1 Nov 2026: "Work as a
 * best technical content writer and complete this for our website and raise a Final PR"). Every string they print, word
 * for word from the checked drafts (docs/website-seo/new-pages-2026-11-01/<its address>/page.md, each claim traced in
 * its ledger.md) and their mocks (ux-design/website/<its address>.html, four_pages_mock.py).
 *
 * 🔴 NO PRICE IN A CURRENCY, NO ZOORIK SAVING FIGURE, NO PRODUCT INTERNALS. Every number is the clouds' own, from the
 * draft's ledger. Coral and Amoeba are said at product level only.
 *
 * The cross-links the mocks add on the drafts' own words (the drafts' open items X3 and A8): the Azure page's "Azure
 * Advisor" and the AWS page's "AWS Compute Optimizer" link their versus pages in the library, and the Azure page's
 * free-assessment line opens with its link, as the AWS page's does (A11).
 *
 * The text is the drafts' small markup (`prose-blocks.ts`), drawn by `richText`, a Read more tile's title and line too.
 */

/** A product's card in "Where Coral and Amoeba fit": its mark and name, its paragraphs, then its link on this cloud. */
export interface TopicCard {
  readonly product: ProductId;
  readonly title: string;
  readonly paragraphs: readonly string[];
  readonly link: { readonly label: string; readonly href: string };
}

export interface TopicPage {
  readonly path: `/${string}`;
  /**
   * The day the page's content last changed, for the sitemap's `lastmod` only: the page prints no date. Whoever
   * changes a page moves its date in the same PR; never the build's date.
   */
  readonly lastUpdated: string;
  readonly meta: {
    /** Goes through the layout's "%s | Zoorik" template; the card repeats it in full. */
    readonly title: string;
    readonly description: string;
  };
  readonly hero: {
    /** The cloud, over the h1 in the cloud pages' eyebrow. */
    readonly eyebrow: string;
    readonly title: string;
    /** The short answer, as the hero's line. */
    readonly line: string;
    /** One button, same tab, to the assessment with no product preset: the page names both. */
    readonly cta: { readonly label: string; readonly href: string };
  };
  /** The sections in the Learn frame, before the band. */
  readonly sections: readonly ProseSection[];
  /** "Where Coral and Amoeba fit" (`#coral-and-amoeba`, the page's one band). */
  readonly products: {
    readonly title: string;
    readonly lead: string;
    readonly cards: readonly [TopicCard, TopicCard];
    /** The lines under the cards, the free assessment's last. */
    readonly notes: readonly string[];
  };
  /** The questions (`#questions`), in the frame again after the band. */
  readonly questions: { readonly title: string; readonly rows: readonly ProseQuestion[] };
  /** Read more (`#read-more`): six tiles. */
  readonly readMore: { readonly title: string; readonly tiles: readonly ProseTile[] };
}

/** Built and checked 1 Nov 2026. */
const BUILT = "1 November 2026";

/** The hero's button: the closing row's own words, to the assessment with no product preset. */
const estimate = {
  label: assessContent.assessment.cta.label,
  href: assessmentHref(),
};

const term = (slug: string): string => glossaryPath(slug);
const article = (slug: string): string => learnPath(slug);
const versus = (slug: string): string => `${comparePath}/${slug}`;

/** The two tables' widths, as the mocks' colgroups set them. */
const LINE_TABLE = ["19%", "27%", "27%", "27%"];

export const azureCostOptimizationPage: TopicPage = {
  path: routes.azureCostOptimization,
  lastUpdated: BUILT,
  meta: {
    title: "Azure cost optimization: how to reduce Azure costs",
    description:
      "Azure cost optimization, line by line: how to reduce Azure costs on VMs, managed disks, AKS and data transfer, and where Microsoft Cost Management fits.",
  },
  hero: {
    eyebrow: "Azure",
    title: "Azure cost optimization: how to reduce Azure costs",
    line: "Azure cost optimization means paying only for the capacity your work uses. To reduce Azure costs, deallocate idle VMs, resize oversized ones and delete disks nothing uses. Then fit AKS requests and data disks to real use, and buy reservations or savings plans last, sized to what's left.",
    cta: estimate,
  },
  sections: [
    {
      id: "azure-cost-management",
      title: "Azure cost management: start in Microsoft Cost Management",
      blocks: [
        p(
          `If you searched for Azure cost management, you may want Microsoft's own tool. Microsoft Cost Management is a suite of [FinOps](${term("finops")}) tools to analyze, monitor and optimize your Microsoft Cloud costs. In the Azure portal, it's on every subscription, resource group and management group.`,
        ),
        {
          kind: "links",
          title: "Microsoft Cost Management",
          links: [
            {
              label: "Open Cost Management in the Azure portal",
              href: "https://portal.azure.com/#view/Microsoft_Azure_CostManagement/Menu",
            },
            {
              label: "Read Microsoft's overview",
              href: "https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/overview-cost-management",
            },
          ],
        },
        p("What you can do there:"),
        ul(
          "explore your costs in Cost analysis;",
          "set budgets that alert you when cost passes an amount or a forecast;",
          `get anomaly alerts when a subscription's daily usage [spikes or dips](${term("cloud-cost-anomaly-detection")});`,
          "export cost details to your storage account on a schedule;",
          "read Azure Advisor's cost recommendations.",
        ),
        p(
          `Tag your resources first. Resource tags are the only way to add your own context, such as an app, environment or owner, to cost details. [Cost allocation tags](${term("cost-allocation-tags")}) explains how to set them.`,
        ),
        p(
          "This page isn't Microsoft's tool, and it doesn't replace it. It's a guide to the fixes that reduce what those reports show.",
        ),
      ],
    },
    {
      id: "azure-cost-optimization-by-line",
      title: "Azure cost optimization, one cost line at a time",
      blocks: [
        p(
          "Azure cost optimization works one cost line at a time. Each line has its own driver and its own first fix.",
        ),
        {
          kind: "table",
          head: ["Cost line", "What you pay for", "First fix", "Who helps"],
          widths: LINE_TABLE,
          rows: [
            [
              "[Virtual machines](#azure-vm-cost)",
              "The time a VM stays allocated, busy or idle.",
              "Deallocate idle VMs and resize oversized ones.",
              "Azure Advisor flags them.",
            ],
            [
              "[Managed disks](#azure-disk-cost)",
              "The size you provision, whatever data it holds.",
              "Delete disks no VM uses, then size the rest to their data.",
              "Advisor flags unattached disks. Amoeba rightsizes data disks.",
            ],
            [
              "[AKS](#aks-cost)",
              "The node VMs, which grow with what your pods request.",
              "Fit requests to real use, then let spare nodes go.",
              "AKS cost analysis shows it. Coral rebalances the cluster.",
            ],
            [
              "[Data transfer](#azure-data-transfer-cost)",
              "Data that leaves a region.",
              "Keep services that talk to each other in one region.",
              "Your network design.",
            ],
            [
              "[Reservations and savings plans](#reservations-and-savings-plans)",
              "A one- or three-year commitment.",
              "Buy last, sized to what the fixes leave.",
              "Advisor recommends a size.",
            ],
          ],
        },
      ],
    },
    {
      id: "azure-vm-cost",
      title: "Virtual machines: deallocate idle ones, resize the rest",
      blocks: [
        p(
          "A VM's compute charge follows its power state, not how busy it is. Azure charges a running VM for instance usage. It also charges a VM that's Stopped (allocated), the state a shutdown from inside the guest OS leaves.",
        ),
        p(
          "Only a deallocated VM has released its hardware and stopped the instance charge. Its disks and networking still cost. In the Azure CLI, `az vm stop` keeps the compute resources, and `az vm deallocate` releases them.",
        ),
        p(
          `For VMs that run all day with little load, start with [Azure Advisor](${versus("coral-vs-azure-advisor")}). Microsoft calls its cost recommendations the first stop for existing resources. On its Cost tab, Advisor flags VMs and scale sets with low usage, and recommends [rightsizing](${term("rightsizing")}) or shutting them down.`,
        ),
        p("Then check how you pay for the VMs you keep:"),
        ul(
          `[Spot VMs](${term("spot-instance")}) use spare Azure capacity at up to 90% off pay-as-you-go prices. Azure evicts them when it needs the capacity back, so keep them for dev, test and batch work.`,
          `[Azure Hybrid Benefit](${term("azure-hybrid-benefit")}) lets you use Windows Server and SQL Server licenses you already own, or Red Hat and SUSE Linux subscriptions, on Azure.`,
          "[Reservations and savings plans](#reservations-and-savings-plans) come last, once your VM sizes have settled.",
        ),
      ],
    },
    {
      id: "azure-disk-cost",
      title: "Managed disks: you pay for the size, not the data",
      blocks: [
        p(
          `An [Azure managed disk](${term("azure-managed-disk")}) is charged for what you provision, not for the data on it. How depends on the disk type:`,
        ),
        ul(
          "Premium SSD, Standard SSD and Standard HDD are charged by a performance tier, which the size you pick sets by default. Grow a Standard SSD or Standard HDD into the next tier, and you pay for that tier.",
          "Premium SSD v2 and Ultra Disk are charged per GiB, plus the performance you provision.",
          "Every Premium SSD v2 includes 3,000 IOPS and 125 MB/s free of charge.",
        ),
        p(
          `A managed disk can grow, but it can't shrink. Shrinking an existing disk "isn't supported and might result in data loss," Microsoft Learn says. So space bought for a peak stays paid for after the data has gone.`,
        ),
        p("Start with these checks:"),
        ol(
          `Find disks no VM uses. Advisor lists disks that aren't attached to a VM, and Microsoft advises a snapshot first, because deleting a disk is irreversible. [How to find unattached disks in Azure](${article("find-unattached-disks-azure")}) shows the queries.`,
          `Compare used with provisioned space on each data disk. [Azure VM disk usage](${article("azure-vm-disk-usage")}) shows how.`,
          `Check the type. [Premium SSD v2 vs Premium SSD](${article("premium-ssd-v2-vs-premium-ssd")}) compares the two Premium SSD types.`,
        ),
        p(
          `[Azure disk cost optimization](${article("azure-disk-cost-optimization")}) walks through every step, and the [Azure disk pricing calculator](${routes.ebsAndAzureDiskPricing}) prices one disk at list price. [How to reduce Azure disk size](${article("shrink-azure-managed-disk")}) covers the copy to a smaller disk.`,
        ),
      ],
    },
    {
      id: "aks-cost",
      title: "AKS: requests decide how many nodes you pay for",
      blocks: [
        p(
          `An AKS cluster's nodes are Azure VMs, grouped in [node pools](${term("node-pool")}). You pay for them as compute, so the number and size of the nodes drive the cost.`,
        ),
        p(
          "That number follows what your pods request. The Cluster Autoscaler adds nodes when pods can't be scheduled for lack of resources, and removes nodes with no running pods. AKS node auto provisioning (NAP) picks VM sizes from what pending pods request.",
        ),
        p(
          `So a [request](${term("kubernetes-resource-requests")}) set well above real use holds capacity that nothing uses. Microsoft's AKS guidance says requests higher than actual usage can lead to overprovisioned workloads.`,
        ),
        p("The fix, in order:"),
        ol(
          `Bring each container's requests close to what it uses. The Vertical Pod Autoscaler can recommend values from past usage. [Kubernetes pod right sizing](${article("kubernetes-pod-right-sizing")}) shows how.`,
          `Let the spare nodes go. Once pods fit on fewer nodes, the autoscaler can remove the empty ones. [Cluster Autoscaler not scaling down](${article("cluster-autoscaler-not-scaling-down")}) covers what keeps a node in place.`,
          "Stop dev and test clusters when they don't need to run. Cluster stop shuts down every node pool, and the cluster keeps its state for when you start it again.",
          "Run work that can take an interruption on Spot node pools.",
        ),
        p(
          `To see where the money goes inside a cluster, turn on the AKS cost analysis add-on. It splits cluster cost by Kubernetes constructs, beside Azure's compute, network and storage categories. [AKS cost analysis](${article("aks-cost-analysis")}) explains what it shows.`,
        ),
        p(
          `[Kubernetes cost optimization on AKS and EKS](${routes.kubernetesCostOptimization}) is the full guide. The [EKS and AKS pricing calculator](${routes.eksAndAksPricingCalculator}) prices a node pool.`,
        ),
      ],
    },
    {
      id: "azure-data-transfer-cost",
      title: "Data transfer: keep traffic inside one region",
      blocks: [
        p(
          "Azure prices data transfer as bandwidth: data moving in and out of its data centers, and between them. Its bandwidth pricing page sets these rules:",
        ),
        ul(
          "Data coming in is free.",
          "Data between Azure services in the same region isn't charged.",
          "Data out to the internet is free for the first 100 GB a month, then charged per GB, in tiers.",
          "Data between two regions is charged on the way out, and free on the way in.",
        ),
        p(
          "Bandwidth pricing leaves out the Content Delivery Network, ExpressRoute and peering, which have their own prices.",
        ),
        p(
          "Internet egress has two prices. One routes it over Microsoft's premium global network, and the other over a transit ISP network, through routing preference. The transit ISP route is priced less on every paid tier.",
        ),
        p(
          `So keep services that talk to each other in one region, and watch what leaves it. Microsoft's AKS guidance gives the same warning: a cheaper region for compute can bring latency and data transfer costs. [Egress cost](${term("egress-cost")}) explains the terms.`,
        ),
      ],
    },
    {
      id: "reservations-and-savings-plans",
      title: "Reservations and savings plans: commit last",
      blocks: [
        p("Azure offers two ways to commit, each for one or three years."),
        {
          kind: "table",
          head: ["", "Azure reservation", "Azure savings plan for compute"],
          widths: ["24%", "38%", "38%"],
          rows: [
            [
              "What you commit to",
              "A specific resource, size and region",
              "A fixed hourly spend, across eligible services and regions",
            ],
            [
              "Discount",
              "Up to 72% against pay-as-you-go prices",
              "Up to 65% against pay-as-you-go prices",
            ],
            [
              "Best for",
              "Stable, predictable usage",
              "Usage that changes, or spreads across services and regions",
            ],
          ],
        },
        p(
          "Each hour, a savings plan's discount covers eligible usage up to the commitment, and anything beyond is charged at pay-as-you-go rates. Commitment an hour doesn't use expires. It doesn't roll over.",
        ),
        p(
          "Savings plans can't be canceled or refunded, and the one for compute doesn't cover software, networking or storage. When a reservation expires, its resources keep running, but at on-demand rates.",
        ),
        p(
          "So commit after the fixes above, not before. Azure Advisor bases its savings plan recommendation on your eligible on-demand usage. Bought first, a plan is sized to usage you're about to remove.",
        ),
        p(
          `The glossary covers [reserved instances](${term("reserved-instance")}) and [savings plans](${term("savings-plan")}) in more depth.`,
        ),
      ],
    },
  ],
  products: {
    title: "Where Coral and Amoeba fit",
    lead: "Deallocating, deleting and committing are changes you make now and then. Requests and disks drift as usage moves, so Zoorik builds a product for each.",
    cards: [
      {
        product: "coral",
        title: "Coral, for AKS",
        paragraphs: [
          `[Coral](${routes.coral}) rebalances AKS clusters. It sizes each container's CPU and memory requests to what it really uses. Coral also empties spare nodes one at a time, so the Cluster Autoscaler or NAP can remove them.`,
          `Coral works with the Horizontal Pod Autoscaler, KEDA, NAP and the Cluster Autoscaler, and needs no application code changes. Node optimization is on from install. Pod sizing waits until you switch on "Automatically optimize".`,
        ],
        link: { label: "AKS cost optimization with Coral", href: routes.aksCostOptimization },
      },
      {
        product: "amoeba",
        title: "Amoeba, for managed disks",
        paragraphs: [
          `[Amoeba](${routes.amoeba}) rightsizes the data disks of Windows and Linux VMs, and never touches the OS disk. It moves a VM's data disks onto one btrfs pool sized to your data, with room to grow. On Azure, the pool uses Premium SSD v2 where your VM's region and zone offer it, and Premium SSD otherwise.`,
          "The services that use the data mounts restart at the switch onto the pool. After that, Amoeba rightsizes the pool without any downtime.",
          "It grows the pool before it fills, and shrinks it one disk at a time when your data goes down and stays down. So you pay for close to what you use.",
        ],
        link: {
          label: "Azure managed disk cost optimization with Amoeba",
          href: routes.azureManagedDiskCostOptimization,
        },
      },
    ],
    notes: [
      "Both products are in early access. Neither product resizes VMs outside AKS, buys commitments or changes your network.",
      "Both price their savings at list price, without your discounts. So check their figures against your own rates before you size a commitment.",
      `[The free assessment](${routes.assessment}) estimates what you could save on Kubernetes (AKS and EKS) or block storage on Azure and AWS. It's read-only, runs in Cloud Shell or your terminal, and writes one PDF. It sends nothing to Zoorik.`,
    ],
  },
  questions: {
    title: "Questions about Azure cost optimization",
    rows: [
      {
        question: "What is Azure cost management?",
        answer:
          "It's tracking and controlling what you spend on Azure. Microsoft's own tool for it is Microsoft Cost Management, a suite of FinOps tools in the Azure portal. Zoorik isn't that tool: this page covers the fixes that reduce what it shows.",
      },
      {
        question: "Where do you start to reduce Azure costs?",
        answer:
          "Start with what nothing uses, such as VMs that are stopped but still allocated, and disks no VM is attached to. Then act on Azure Advisor's resize advice, and fit AKS requests to real use. Buy reservations or savings plans last.",
      },
      {
        question: "Reservation or savings plan: which should you buy?",
        answer:
          "Choose a reservation for stable usage on one resource, size and region, where it gives the deeper discount. Choose a savings plan for usage that changes, or spreads across services and regions. A savings plan can't be canceled or refunded, so size it to what your fixes leave.",
      },
      {
        question: "Is data transfer free inside Azure?",
        answer:
          "Data coming in is free, and so is data between Azure services in the same region. Data out to the internet is free for the first 100 GB a month, then charged per GB. Data between regions is charged where it leaves.",
      },
      {
        question: "Does Zoorik replace Microsoft Cost Management or Azure Advisor?",
        answer:
          "No. Cost Management and Advisor show your spend and recommend changes across Azure. Coral and Amoeba make the changes on two lines of it: AKS requests and nodes, and the data disks of your VMs.",
      },
    ],
  },
  readMore: {
    title: "Read more",
    tiles: [
      {
        title: "Cloud cost optimization",
        href: routes.cloudCostOptimization,
        line: "The order that reduces Azure and AWS cost",
      },
      {
        title: "AWS cost optimization",
        href: routes.awsCostOptimization,
        line: "The same walk-through for AWS",
      },
      {
        title: "AKS cost optimization",
        href: routes.aksCostOptimization,
        line: "What Coral does on AKS",
      },
      {
        title: "Azure managed disk cost optimization",
        href: routes.azureManagedDiskCostOptimization,
        line: "What Amoeba does on Azure",
      },
      {
        title: "Azure disk cost optimization",
        href: article("azure-disk-cost-optimization"),
        line: "What a managed disk is charged for, and how to pay for your data",
      },
      {
        title: "Cloud cost management tools",
        href: routes.cloudCostTools,
        line: "Microsoft's, AWS's and third-party tools, side by side",
      },
    ],
  },
};

export const awsCostOptimizationPage: TopicPage = {
  path: routes.awsCostOptimization,
  lastUpdated: BUILT,
  meta: {
    title: "AWS cost optimization: how to reduce AWS costs",
    description:
      "AWS cost optimization, line by line: how to reduce AWS costs on EC2, EBS, EKS, S3 and data transfer, and when to buy Savings Plans.",
  },
  hero: {
    eyebrow: "AWS",
    title: "AWS cost optimization: how to reduce AWS costs",
    line: "AWS cost optimization means paying only for the capacity your work uses. To reduce AWS costs, stop idle instances, rightsize the rest and delete what nothing uses. Then fit EKS requests, EBS volumes and S3 storage classes to real use, and buy Savings Plans last, sized to what's left.",
    cta: estimate,
  },
  sections: [
    {
      id: "see-where-aws-cost-goes",
      title: "See where your AWS cost goes",
      blocks: [
        p(
          "Start with tags. A tag is a key and a value on a resource, such as `team` and `payments`. Tag resources by cost center, application or owner, and you can track each one's AWS cost across services.",
        ),
        p(
          "A tag counts in cost reports only once you activate it as a cost allocation tag. That goes for the tags AWS generates and for your own. Activated tags can take up to 24 hours to appear.",
        ),
        p(
          "**Watch out.** Only an organization's management account, or a standalone account, can open the cost allocation tags manager where tags are activated.",
        ),
        p(
          "Then filter AWS Cost Explorer by tag and sort by size. The cost allocation report lists untagged resources too, so the gaps are easy to find. Each large line points to a section below:",
        ),
        ul(
          "EC2: idle instances and rightsizing.",
          "EBS: volumes larger than their data.",
          "EKS: pod requests and the nodes they hold.",
          "S3 and data transfer: storage classes and traffic paths.",
        ),
        p(`[Cost allocation tags](${term("cost-allocation-tags")}) explains how they work.`),
      ],
    },
    {
      id: "aws-cost-optimization-by-line",
      title: "AWS cost optimization, one cost line at a time",
      blocks: [
        p(
          "Work down the lines in this order. Each fix shrinks what the next one has to cover, so commitments come last.",
        ),
        {
          kind: "table",
          head: ["Cost line", "What you pay for", "First fix", "Who helps"],
          widths: LINE_TABLE,
          rows: [
            [
              "[EC2 instances](#ec2-cost)",
              "Running time: at least one minute per start, then by the second.",
              "Stop idle instances, then rightsize the rest.",
              "AWS Compute Optimizer flags them.",
            ],
            [
              "[EBS volumes](#ebs-cost)",
              "Each volume's size, type and performance, even while its instance is stopped.",
              "Move gp2 to gp3, then bring volumes back to their data.",
              "Compute Optimizer covers volumes. Amoeba rightsizes data volumes.",
            ],
            [
              "[EKS](#eks-cost)",
              "In most clusters, mainly the EC2 instances the nodes run on.",
              "Fit pod requests to real use, then let spare nodes go.",
              "Karpenter or the Cluster Autoscaler removes nodes. Coral rebalances the cluster.",
            ],
            [
              "[Amazon S3](#s3-cost)",
              "Storage by class, plus retrieval fees in the infrequent-access and Glacier classes.",
              "Match each bucket's class to how its data is read.",
              "S3 Intelligent-Tiering moves objects for you.",
            ],
            [
              "[Data transfer](#aws-data-transfer-cost)",
              "Data out to the internet, and across Availability Zones and Regions.",
              "Keep traffic close, and reach S3 through a gateway endpoint.",
              "Your network design.",
            ],
            [
              "[Savings Plans and Spot](#savings-plans-and-spot)",
              "On-Demand rates, unless you commit or use Spot.",
              "Buy last, sized to what the fixes leave.",
              "Cost Explorer recommends a commitment.",
            ],
          ],
        },
      ],
    },
    {
      id: "ec2-cost",
      title: "EC2: stop idle instances, rightsize the rest",
      blocks: [
        h3("Stop or delete what nothing uses"),
        p(
          "A stopped EC2 instance isn't charged for usage or data transfer. Its EBS volumes are still charged, and so is any Elastic IP address associated with it. Each start then costs at least one minute of usage, and after that you pay by the second.",
        ),
        p(
          "**Worked example.** A development instance that's needed 10 hours a day, Monday to Friday, runs 10 × 5 = 50 of the week's 168 hours. Stopped for the other 118 (168 − 50), it carries no usage charge for about 70% of the week (118 ÷ 168).",
        ),
        p(
          "Stopping an instance erases any data on its instance store volumes, so copy what you need first. Its EBS volumes and their data stay.",
        ),
        h3("Rightsize with AWS Compute Optimizer"),
        p(
          `[Rightsizing](${term("rightsizing")}) matches each instance's type and size to what it really uses. [AWS Compute Optimizer](${versus("coral-vs-aws-compute-optimizer")}) does the analysis once you opt in. For an EC2 instance, it reads the specifications and 14 days of Amazon CloudWatch metrics:`,
        ),
        ul(
          "vCPUs, memory and storage;",
          "CPU use;",
          "network in and out;",
          "disk reads and writes.",
        ),
        p(
          "It then reports whether each resource is optimal, with its top 3 recommendations and graphs of projected use. It also identifies idle resources, so you can stop or delete them.",
        ),
        p(
          "**Rule of thumb.** 14 days can miss a monthly peak, such as month-end batch jobs. Enhanced infrastructure metrics, a paid feature, extends the look-back to 93 days.",
        ),
        p(
          `Compute Optimizer covers Auto Scaling groups and EBS volumes too. [AWS instance families](${term("aws-instance-families")}) explains how to read a type name such as c7gn.xlarge.`,
        ),
      ],
    },
    {
      id: "ebs-cost",
      title: "EBS: you pay for the size, not the data",
      blocks: [
        p(
          "You pay for an EBS volume's configuration: its size, type and performance. The data inside doesn't change that, so a half-empty volume costs as much as a full one.",
        ),
        p(
          "Amazon EBS Elastic Volumes changes a volume in three ways. On an instance that supports it, the volume stays attached and the instance keeps running:",
        ),
        ul("increase its size;", "change its type;", "adjust its performance."),
        p(
          "The change itself is free. You're charged for the new configuration from the moment it starts.",
        ),
        p(
          "A gp2 volume can move to gp3 this way. If you don't set IOPS or throughput, EBS keeps the gp2 volume's performance or the gp3 baseline, whichever is higher.",
        ),
        p(
          "Elastic Volumes can't make a volume smaller. To shrink one, you create a smaller volume and copy the data across, with rsync on Linux or robocopy on Windows.",
        ),
        p("Next steps:"),
        ul(
          `[How to check EBS volume usage](${article("check-ebs-volume-usage")}) lines up used space with the size you pay for.`,
          `[gp2 vs gp3](${article("gp2-vs-gp3")}) compares their price and performance, and the switch.`,
          `[How to shrink an EBS volume](${article("shrink-ebs-volume")}) walks through the copy.`,
          `The [EBS pricing calculator](${routes.ebsAndAzureDiskPricing}) shows what a volume and its empty space cost.`,
        ),
      ],
    },
    {
      id: "eks-cost",
      title: "EKS: requests decide how many nodes you pay for",
      blocks: [
        p(
          "On Amazon EKS, nodes are usually most of the cost. AWS's EKS best practices guide says that in most clusters, the bulk of cost comes from the EC2 instances that run your containers.",
        ),
        p(
          "Pod requests set the CPU and memory each container asks for. The guide says requests should match real use. When they're too high, the capacity sits unused, and that's a large factor in total cluster cost.",
        ),
        p("The guide ranks the fixes for cluster compute in this order:"),
        ol(
          "Right-size workloads.",
          "Reduce unused capacity.",
          "Optimize capacity types, such as Spot, and accelerators, such as GPUs.",
        ),
        p(
          `Smaller requests leave room on some nodes. With autoscaling set up, Karpenter or the Cluster Autoscaler can then remove them. Restrictive [Pod Disruption Budgets](${term("pod-disruption-budget")}) can stop both from scaling down, so check yours first.`,
        ),
        p(
          `[Kubernetes cost optimization on AKS and EKS](${routes.kubernetesCostOptimization}) walks through both steps. The [EKS pricing calculator](${routes.eksAndAksPricingCalculator}) shows what a node costs a month, and [how to choose EKS instance types](${article("how-to-choose-eks-instance-types")}) helps you pick the next ones.`,
        ),
      ],
    },
    {
      id: "s3-cost",
      title: "S3: match the storage class to how data is read",
      blocks: [
        p(
          "New objects go to S3 Standard unless you choose another storage class. Choosing the class that fits each use case reduces what you pay to store the data.",
        ),
        h3("When you don't know the access pattern"),
        p("S3 Intelligent-Tiering moves objects between tiers by how they're read:"),
        ul(
          "after 30 days without access, to the Infrequent Access tier;",
          "after 90 days without access, to the Archive Instant Access tier;",
          "between tiers again when the access pattern changes.",
        ),
        p(
          "It has no retrieval fees, only a small monthly fee per object for monitoring. Objects under 128 KB aren't monitored, and always stay in the Frequent Access tier.",
        ),
        h3("When you know the data is cold"),
        p(
          "A lifecycle configuration can move objects from S3 Standard to S3 Standard-IA. Standard-IA suits objects over 128 KB that you keep for at least 30 days:",
        ),
        ul(
          "an object under 128 KB is charged as 128 KB;",
          "an object deleted before 30 days is charged for 30;",
          "reading data back pays a per-GB retrieval fee.",
        ),
        p(
          "S3 Glacier Instant Retrieval and Flexible Retrieval have a 90-day minimum storage duration, and Glacier Deep Archive 180 days.",
        ),
      ],
    },
    {
      id: "aws-data-transfer-cost",
      title: "Data transfer: keep traffic close and off NAT gateways",
      blocks: [
        p(
          "AWS charges for data transfer by direction and distance. Its data transfer overview sets out the rules:",
        ),
        ul(
          "Data coming into AWS from the internet isn't charged.",
          "Data going out to the internet is charged per service, at rates set by the Region it leaves.",
          "Data transfer within the same Availability Zone is free.",
          "Traffic that crosses an Availability Zone or Region boundary typically pays a charge.",
        ),
        p(
          "Two parts of a network change what you pay. A NAT gateway adds a data processing charge for every GB that passes through it. A gateway VPC endpoint reaches S3 and DynamoDB in the same Region without data transfer charges.",
        ),
        p(
          "So send S3 and DynamoDB traffic through gateway endpoints, not a NAT gateway. Keep chatty services in one Availability Zone where your availability design allows. Copy data across Regions only when you need to.",
        ),
        p(
          `[Egress cost](${term("egress-cost")}) explains the charge for data that leaves the cloud.`,
        ),
      ],
    },
    {
      id: "savings-plans-and-spot",
      title: "Savings Plans and Spot: commit last",
      blocks: [
        p(
          `A [Savings Plan](${term("savings-plan")}) commits you to a set amount of compute use per hour, for one or three years. In return, AWS says you can save up to 72% on compute. Two kinds cover EC2:`,
        ),
        ul(
          "Compute Savings Plans apply regardless of instance family, size, OS, tenancy or Region, and to Fargate and Lambda too. AWS's EKS guide puts them at up to 66% off EC2.",
          "EC2 Instance Savings Plans go up to 72%, but commit you to one instance family in one Region.",
        ),
        p(
          "Commit after the other fixes. AWS Cost Explorer shows a recommended commitment and your past usage, so wait until that usage comes from after your last change.",
        ),
        p(
          `[Spot Instances](${term("spot-instance")}) run on spare EC2 capacity at discounts of up to 90%. AWS can reclaim them with a 2-minute notice, so keep them for work that can stop.`,
        ),
        p("**Rule of thumb.** AWS's EKS guide splits capacity three ways:"),
        ul(
          "a Savings Plan for everything under your minimum capacity;",
          "Spot for capacity that won't affect your app's availability;",
          `[On-Demand](${term("on-demand-instance")}) for the rest.`,
        ),
      ],
    },
  ],
  products: {
    title: "Where Coral and Amoeba fit",
    lead: "Stopping, deleting and committing are changes you make now and then. EKS requests and EBS volumes drift as usage moves, so Zoorik builds a product for each.",
    cards: [
      {
        product: "coral",
        title: "Coral, for EKS",
        paragraphs: [
          `[Coral](${routes.coral}) rebalances Amazon EKS clusters. It sizes pod requests to real use, so fewer EC2 instances can carry the same work. It also empties spare instances one at a time.`,
          "Karpenter or the Cluster Autoscaler still adds instances when demand grows, and terminates the ones Coral empties. Coral never creates machines itself. With Karpenter, a rebalance can also move work onto cheaper EC2 instances.",
          `Node optimization starts when you connect a cluster. Pod sizing waits until you switch on "Automatically optimize".`,
        ],
        link: { label: "EKS cost optimization with Coral", href: routes.eksCostOptimization },
      },
      {
        product: "amoeba",
        title: "Amoeba, for EBS",
        paragraphs: [
          `[Amoeba](${routes.amoeba}) rightsizes the EBS data volumes of Windows and Linux EC2 instances, and never touches the root volume. It moves an instance's data volumes onto one btrfs pool sized to your data, with room to grow. On AWS, the pool uses gp3.`,
          "The services that use the data mounts restart at the switch onto the pool. After that, Amoeba rightsizes the pool without any downtime.",
          "It grows the pool before it fills, and shrinks it one volume at a time when your data goes down and stays down. So you pay for close to what you use.",
        ],
        link: { label: "EBS cost optimization with Amoeba", href: routes.ebsCostOptimization },
      },
    ],
    notes: [
      "Both products are in early access. Neither changes instance types outside EKS, S3 storage classes, your network or your commitments.",
      "Their savings figures leave out your discounts and Savings Plans. So check them against your own rates before you size a commitment.",
      `[The free assessment](${routes.assessment}) estimates what you could save on Kubernetes (AKS and EKS) or block storage on Azure and AWS. It's read-only, runs in Cloud Shell or your terminal, and writes one PDF. It sends nothing to Zoorik.`,
    ],
  },
  questions: {
    title: "Questions about AWS cost optimization",
    rows: [
      {
        question: "Where do you start to reduce AWS costs?",
        answer:
          "Start with cost allocation tags and the largest line in Cost Explorer. Then stop or delete what nothing uses, act on Compute Optimizer's rightsizing, and fit EKS requests and EBS volumes to real use. Buy Savings Plans last.",
      },
      {
        question: "Does a stopped EC2 instance still cost money?",
        answer:
          "Yes, for what it keeps. Usage and data transfer stop being charged, but its EBS volumes and any associated Elastic IP addresses are still charged.",
      },
      {
        question: "Can an EBS volume shrink?",
        answer:
          "Not in place. Elastic Volumes can grow a volume or change its type, but can't make it smaller. You copy the data to a smaller volume, or, for a data volume, let Amoeba move it onto a pool sized to your data.",
      },
      {
        question: "Savings Plan or Spot: which should you use?",
        answer:
          "A Savings Plan suits steady usage you'll keep for one or three years. Spot suits work that can stop, since AWS can reclaim it with a 2-minute notice. AWS's EKS guide uses both, with On-Demand for the rest.",
      },
      {
        question: "Does Zoorik replace Cost Explorer or AWS Compute Optimizer?",
        answer:
          "No. Cost Explorer shows your spend, and Compute Optimizer recommends sizes for you to apply. Coral and Amoeba make the changes themselves, on EKS requests and nodes and on EBS data volumes.",
      },
    ],
  },
  readMore: {
    title: "Read more",
    tiles: [
      {
        title: "Cloud cost optimization",
        href: routes.cloudCostOptimization,
        line: "The order that reduces Azure and AWS cost",
      },
      {
        title: "Azure cost optimization",
        href: routes.azureCostOptimization,
        line: "The same walk-through for Azure",
      },
      {
        title: "EKS cost optimization",
        href: routes.eksCostOptimization,
        line: "What Coral does on EKS",
      },
      {
        title: "EBS cost optimization",
        href: routes.ebsCostOptimization,
        line: "What Amoeba does on AWS",
      },
      {
        title: "What AWS Compute Optimizer recommends for EBS volumes",
        href: article("compute-optimizer-ebs"),
        line: "Type, size, IOPS and throughput, and what you apply yourself",
      },
      {
        title: "Cloud cost management tools",
        href: routes.cloudCostTools,
        line: "AWS's, Microsoft's and third-party tools, side by side",
      },
    ],
  },
};

/** Both, in the sitemap's order: Azure first, as the cloud pages put it. */
export const topicPages: readonly TopicPage[] = [
  azureCostOptimizationPage,
  awsCostOptimizationPage,
];
