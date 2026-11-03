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
 * The two Topic pages: `/azure-cost-optimization` and `/aws-cost-optimization`. Every string they print.
 *
 * Rewritten 2 Nov 2026 to the zero-noise standard: a short h1 with one short line under it, short section
 * names, the answer first, and every useful fact kept. Each page targets its own searches from rows 1 to 500 of the
 * SEO sheet: "azure cost" and "aws cost optimization" lead.
 *
 * 🔴 NO PRICE IN A CURRENCY, NO ZOORIK SAVING FIGURE, NO PRODUCT INTERNALS. Every number is the clouds' own, from
 * their docs. Coral and Amoeba are said at product level only.
 *
 * Each cloud's own tool links its versus page in the library, once: "Azure Advisor" on the Azure page and "AWS Compute
 * Optimizer" on the AWS page. The free-assessment line under the product cards opens with its link on both.
 *
 * The text is the small markup of `prose-blocks.ts`, drawn by `richText`, a Read more tile's title and line too.
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

/** Built 1 Nov 2026; rewritten 2 Nov 2026. */
const UPDATED = "3 November 2026";

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
  lastUpdated: UPDATED,
  meta: {
    title: "Azure cost optimization",
    description:
      "What drives Microsoft Azure cost, line by line: VMs, managed disks, AKS, data transfer and commitments, and how to reduce each one.",
  },
  hero: {
    eyebrow: "Azure",
    title: "Azure cost optimization",
    line: "Fit VMs, disks and AKS to real use first, then commit to what's left.",
    cta: estimate,
  },
  sections: [
    {
      id: "azure-cost-management",
      title: "Azure cost management",
      blocks: [
        p(
          `Microsoft Cost Management is Microsoft's built-in suite of [FinOps](${term("finops")}) tools to analyze, monitor and optimize Microsoft Cloud costs. It's on every subscription, resource group and management group in the Azure portal.`,
        ),
        {
          kind: "links",
          title: "Microsoft Cost Management",
          links: [
            {
              label: "Open in the Azure portal",
              href: "https://portal.azure.com/#view/Microsoft_Azure_CostManagement/Menu",
            },
            {
              label: "Read Microsoft's overview",
              href: "https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/overview-cost-management",
            },
          ],
        },
        p("Use it to:"),
        ul(
          "explore costs in Cost analysis;",
          "set budgets that alert you when cost passes an amount or a forecast;",
          `get anomaly alerts when a subscription's daily usage [spikes or dips](${term("cloud-cost-anomaly-detection")});`,
          "export cost details to your storage account on a schedule;",
          "read Azure Advisor's cost recommendations.",
        ),
        p(
          `Tag resources first. Tags are the only way to add your own context, such as app, environment or owner, to cost details. [Cost allocation tags](${term("cost-allocation-tags")}) explains how to set them.`,
        ),
      ],
    },
    {
      id: "azure-cost-optimization-by-line",
      title: "What drives the cost of Azure",
      blocks: [
        p("Each cost line has its own driver and its own first fix."),
        {
          kind: "table",
          head: ["Cost line", "What you pay for", "First fix", "Who helps"],
          widths: LINE_TABLE,
          rows: [
            [
              "[Virtual machines](#azure-vm-cost)",
              "Time allocated, busy or idle.",
              "Deallocate idle VMs and resize oversized ones.",
              "Azure Advisor flags them.",
            ],
            [
              "[Managed disks](#azure-disk-cost)",
              "The size you provision, whatever data it holds.",
              "Delete unattached disks, then fit the rest to their data.",
              "Advisor flags unattached disks. Amoeba rightsizes data disks.",
            ],
            [
              "[AKS](#aks-cost)",
              "Node VMs, which grow with what pods request.",
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
      title: "Virtual machines",
      blocks: [
        p(
          `For VMs that run all day with little load, start with [Azure Advisor](${versus("coral-vs-azure-advisor")}). Its Cost tab flags low-usage VMs and scale sets, and recommends [rightsizing](${term("rightsizing")}) or shutting them down.`,
        ),
        p("Then check how you pay for the VMs you keep:"),
        ul(
          `[Spot VMs](${term("spot-instance")}) use spare Azure capacity at up to 90% off pay-as-you-go prices. Azure evicts them when it needs the capacity back, so keep them for dev, test and batch work.`,
          `[Azure Hybrid Benefit](${term("azure-hybrid-benefit")}) lets you use Windows Server and SQL Server licenses you already own, or Red Hat and SUSE Linux subscriptions, on Azure.`,
        ),
        h3("Stopped vs deallocated"),
        p(
          "A VM's compute charge follows its power state, not its load. Azure charges a running VM, and also a Stopped (allocated) one: the state a shutdown from inside the guest OS leaves.",
        ),
        p(
          "Only a deallocated VM has released its hardware and stopped the compute charge. Its disks and networking still cost. In the Azure CLI, `az vm stop` keeps the compute resources, and `az vm deallocate` releases them.",
        ),
      ],
    },
    {
      id: "azure-disk-cost",
      title: "Managed disks",
      blocks: [
        p(
          `An [Azure managed disk](${term("azure-managed-disk")}) is charged for what you provision, not for the data on it. How depends on its type:`,
        ),
        ul(
          "Premium SSD, Standard SSD and Standard HDD are charged by performance tier, which the size sets by default. Grow a Standard SSD or Standard HDD into the next tier, and you pay for that tier.",
          "Premium SSD v2 and Ultra Disk are charged per GiB, plus the performance you provision. Every Premium SSD v2 includes 3,000 IOPS and 125 MB/s free.",
        ),
        p(
          `A managed disk can grow, but it can't shrink. Microsoft Learn says shrinking an existing disk "isn't supported and might result in data loss." So space bought for a peak stays paid for after the data is gone.`,
        ),
        p("Start with these checks:"),
        ol(
          `Find disks no VM uses. Advisor lists unattached disks. Take a snapshot before you delete one, because deletion is irreversible. [How to find unattached disks in Azure](${article("find-unattached-disks-azure")}) shows the queries.`,
          `Compare used with provisioned space on each data disk. [Azure VM disk usage](${article("azure-vm-disk-usage")}) shows how.`,
          `Check the type. [Premium SSD v2 vs Premium SSD](${article("premium-ssd-v2-vs-premium-ssd")}) compares the two.`,
        ),
        p(
          `[How to reduce Azure disk size](${article("shrink-azure-managed-disk")}) covers the copy to a smaller disk. The [Azure disk pricing calculator](${routes.ebsAndAzureDiskPricing}) prices a disk at list price.`,
        ),
      ],
    },
    {
      id: "aks-cost",
      title: "AKS clusters",
      blocks: [
        p(
          `An AKS cluster's nodes are Azure VMs, grouped in [node pools](${term("node-pool")}). You pay for them as compute, so their number and size drive the cost.`,
        ),
        p(
          "That number follows what your pods request. The Cluster Autoscaler adds nodes when pods can't be scheduled for lack of resources, and removes nodes with no running pods. AKS node auto provisioning (NAP) picks VM sizes from what pending pods request.",
        ),
        p(
          `So a [request](${term("kubernetes-resource-requests")}) set well above real use holds capacity that nothing uses. Microsoft's AKS guidance says such requests can lead to overprovisioned workloads.`,
        ),
        p("The fix, in order:"),
        ol(
          `Bring each container's requests close to what it uses. The Vertical Pod Autoscaler can recommend values from past usage. [Kubernetes pod right sizing](${article("kubernetes-pod-right-sizing")}) shows how.`,
          `Let spare nodes go. Once pods fit on fewer nodes, the autoscaler can remove the empty ones. [Cluster Autoscaler not scaling down](${article("cluster-autoscaler-not-scaling-down")}) covers what keeps a node in place.`,
          "Stop dev and test clusters when they don't need to run. Cluster stop shuts down every node pool, and the cluster keeps its state for the next start.",
          "Run work that can take an interruption on Spot node pools.",
        ),
        p(
          `To see cost inside a cluster, turn on the AKS cost analysis add-on. It splits cluster cost by Kubernetes constructs, beside Azure's compute, network and storage categories. [AKS cost analysis](${article("aks-cost-analysis")}) explains what it shows.`,
        ),
        p(
          `[Kubernetes cost optimization](${routes.kubernetesCostOptimization}) is the full guide. The [EKS and AKS pricing calculator](${routes.eksAndAksPricingCalculator}) prices a node pool.`,
        ),
      ],
    },
    {
      id: "azure-data-transfer-cost",
      title: "Data transfer",
      blocks: [
        p("Azure prices data transfer as bandwidth. Its bandwidth pricing sets these rules:"),
        ul(
          "Data coming in is free.",
          "Data between Azure services in the same region isn't charged.",
          "Data out to the internet is free for the first 100 GB a month, then charged per GB, in tiers.",
          "Data between two regions is charged on the way out, and free on the way in.",
        ),
        p("Content Delivery Network, ExpressRoute and peering traffic have their own prices."),
        p(
          "Internet egress has two prices, chosen through routing preference: over Microsoft's premium global network, or over a transit ISP network. The ISP route is priced less on every paid tier.",
        ),
        p(
          `So keep services that talk to each other in one region, and watch what leaves it. Microsoft's AKS guidance warns that a cheaper region for compute can bring latency and data transfer costs. [Egress cost](${term("egress-cost")}) explains the terms.`,
        ),
      ],
    },
    {
      id: "reservations-and-savings-plans",
      title: "Reservations and savings plans",
      blocks: [
        p("Azure offers two ways to commit, each for one or three years."),
        h3("Reservation or savings plan?"),
        {
          kind: "table",
          head: ["", "Azure reservation", "Azure savings plan for compute"],
          widths: ["24%", "38%", "38%"],
          rows: [
            [
              "What you commit to",
              "A specific resource, size and region",
              "A fixed amount per hour, across eligible services and regions",
            ],
            [
              "Discount",
              "Up to 72% off pay-as-you-go prices",
              "Up to 65% off pay-as-you-go prices",
            ],
            [
              "Best for",
              "Stable, predictable usage",
              "Usage that changes, or spreads across services and regions",
            ],
          ],
        },
        p(
          "Each hour, a savings plan's discount covers eligible usage up to the commitment. Usage beyond it is charged at pay-as-you-go rates. Commitment an hour doesn't use expires, and doesn't roll over.",
        ),
        p(
          "Savings plans can't be canceled or refunded, and the compute plan doesn't cover software, networking or storage. When a reservation expires, its resources keep running at pay-as-you-go rates.",
        ),
        p(
          "So commit after the fixes above. Azure Advisor bases its savings plan recommendation on your eligible on-demand usage. Bought first, a plan is sized to usage you're about to remove.",
        ),
        p(
          `The glossary covers [reserved instances](${term("reserved-instance")}) and [savings plans](${term("savings-plan")}) in more depth.`,
        ),
      ],
    },
  ],
  products: {
    title: "Where Coral and Amoeba fit",
    lead: "Most fixes above are changes you make now and then. AKS requests and VM data disks drift as usage moves, so Coral and Amoeba keep fitting them to real use.",
    cards: [
      {
        product: "coral",
        title: "Coral, for AKS",
        paragraphs: [
          `[Coral](${routes.coral}) rebalances AKS clusters. It sizes each container's CPU and memory requests to real use, and removes the nodes you don't need, one at a time.`,
          `It works with the Horizontal Pod Autoscaler, KEDA, NAP and the Cluster Autoscaler, and needs no application code changes. Node optimization starts when you connect a cluster. Pod sizing waits until you switch on "Automatically optimize".`,
        ],
        link: { label: "Coral on AKS", href: routes.aksCostOptimization },
      },
      {
        product: "amoeba",
        title: "Amoeba, for managed disks",
        paragraphs: [
          `[Amoeba](${routes.amoeba}) rightsizes the data disks of Windows and Linux VMs, and never touches the OS disk. It moves a VM's data disks onto one btrfs pool sized to your data, with room to grow. On Azure, the pool uses Premium SSD v2 where your VM's region and zone offer it, and Premium SSD otherwise.`,
          "Amoeba rightsizes the pool without any downtime. The services that use the data mounts restart briefly at the switch onto the pool.",
          "It grows the pool before it fills, and shrinks it one disk at a time when your data goes down and stays down. So you pay for close to what you use.",
        ],
        link: { label: "Amoeba on Azure", href: routes.azureManagedDiskCostOptimization },
      },
    ],
    notes: [
      "Both products are in early access. Neither resizes VMs outside AKS, buys commitments or changes your network.",
      "Both price savings at list price, without your discounts. Check their figures against your own rates before you size a commitment.",
      `[The free assessment](${routes.assessment}) estimates your saving on Kubernetes (AKS and EKS) and block storage on Azure and AWS. It's read-only and sends nothing to Zoorik.`,
    ],
  },
  questions: {
    title: "Questions",
    rows: [
      {
        question: "What is Azure cost management?",
        answer:
          "Tracking and controlling what Azure charges you over time, by subscription, team and app. Microsoft Cost Management is Microsoft's built-in tool for it.",
      },
      {
        question: "Does Zoorik replace Microsoft Cost Management or Azure Advisor?",
        answer:
          "No. Cost Management and Advisor show your costs and recommend changes across Azure. Coral and Amoeba make the changes themselves on two lines: AKS requests and nodes, and VM data disks.",
      },
    ],
  },
  readMore: {
    title: "Read more",
    tiles: [
      {
        title: "Cloud cost optimization",
        href: routes.cloudCostOptimization,
        line: "The order of fixes on Azure and AWS",
      },
      {
        title: "AWS cost optimization",
        href: routes.awsCostOptimization,
        line: "The same guide for AWS",
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
        title: "Azure disk reservations",
        href: article("azure-disk-reservations"),
        line: "When reserving a disk is worth it",
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
  lastUpdated: UPDATED,
  meta: {
    title: "AWS cost optimization",
    description:
      "AWS cost optimization, line by line: how to reduce EC2, EBS, EKS, S3 and data transfer costs, then size Savings Plans to what's left.",
  },
  hero: {
    eyebrow: "AWS",
    title: "AWS cost optimization",
    line: "Fit each cost line to real use, then buy Savings Plans for what's left.",
    cta: estimate,
  },
  sections: [
    {
      id: "see-where-aws-cost-goes",
      title: "AWS cost management",
      blocks: [
        p(
          `To manage AWS costs, start with [cost allocation tags](${term("cost-allocation-tags")}). A tag is a key and a value on a resource, such as \`team\` and \`payments\`. Tag by cost center, application or owner to track each one's cost across services.`,
        ),
        p(
          "A tag counts in cost reports only once you activate it, whether AWS or you created it. It can take up to 24 hours to appear. Only an organization's management account, or a standalone account, can activate tags.",
        ),
        p(
          "Then filter AWS Cost Explorer by tag and sort by cost. The cost allocation report also lists untagged resources. Between reviews, AWS Budgets alerts you when cost or usage passes an amount you set, or is forecast to pass it.",
        ),
      ],
    },
    {
      id: "aws-cost-optimization-by-line",
      title: "Cost lines, in order",
      blocks: [
        p(
          "Cost optimization on AWS works one cost line at a time, in this order. Each fix shrinks what the next one has to cover, so commitments come last.",
        ),
        {
          kind: "table",
          head: ["Cost line", "What you pay for", "First fix", "Who helps"],
          widths: LINE_TABLE,
          rows: [
            [
              "[EC2 instances](#ec2-cost)",
              "Running time, busy or idle.",
              "Stop idle instances, then rightsize the rest.",
              "AWS Compute Optimizer flags them.",
            ],
            [
              "[EBS volumes](#ebs-cost)",
              "Size, type and performance, even while the instance is stopped.",
              "Move gp2 to gp3, then fit volumes to their data.",
              "Compute Optimizer covers volumes. Amoeba rightsizes data volumes.",
            ],
            [
              "[EKS](#eks-cost)",
              "Mostly the EC2 instances your nodes run on.",
              "Fit pod requests to real use, then let spare nodes go.",
              "Coral rebalances the cluster and removes the nodes you don't need.",
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
      title: "EC2 instances",
      blocks: [
        h3("Stop or terminate"),
        p(
          "A stopped EC2 instance can start again. Terminating is permanent, and deletes every EBS volume set to delete on termination. By default, that includes the root volume attached at launch.",
        ),
        p(
          `Stopping erases any data on [instance store](${term("instance-store")}) volumes, so copy what you need first. EBS volumes and their data stay.`,
        ),
        h3("Schedule dev and test"),
        p(
          "A development instance needed 10 hours a day, Monday to Friday, runs 50 of the week's 168 hours. Stopped on a schedule for the other 118, it has no usage charge for about 70% of the week. Its EBS volumes are still charged.",
        ),
        h3("Rightsize with Compute Optimizer"),
        p(
          `[Rightsizing](${term("rightsizing")}) matches each instance's type and size to what it really uses. [AWS Compute Optimizer](${versus("coral-vs-aws-compute-optimizer")}), AWS's own cost optimizer, does the analysis once you opt in.`,
        ),
        p(
          "For an EC2 instance, it reads the vCPUs, memory and storage, plus 14 days of Amazon CloudWatch metrics for CPU, network and disk use.",
        ),
        p(
          "It reports whether each instance is optimal, with up to three recommendations and graphs of projected use. It also flags idle resources, so you can stop or delete them.",
        ),
        p(
          "A 14-day look-back can miss a monthly peak, such as month-end batch jobs. Enhanced infrastructure metrics, a paid feature, extends it to 93 days.",
        ),
        p(
          `Compute Optimizer covers Auto Scaling groups and EBS volumes too. [AWS instance families](${term("aws-instance-families")}) explains how to read a type name such as c7gn.xlarge.`,
        ),
      ],
    },
    {
      id: "ebs-cost",
      title: "EBS volumes",
      blocks: [
        p(
          `You pay for each [EBS volume](${term("ebs-volume")}) by its size, type and performance, not its data. A half-empty volume costs as much as a full one.`,
        ),
        p(
          "Amazon EBS Elastic Volumes can increase a volume's size, change its type or adjust its performance. On an instance that supports it, the volume stays attached and the instance keeps running.",
        ),
        p(
          "The change itself is free. You're charged for the new configuration from the moment it starts.",
        ),
        p(
          "A gp2 volume can move to gp3 this way. If you don't set IOPS or throughput, EBS keeps the gp2 volume's performance or the gp3 baseline, whichever is higher.",
        ),
        p(
          "Elastic Volumes can't make a volume smaller. To shrink one, create a smaller volume and copy the data across, with rsync on Linux or robocopy on Windows.",
        ),
        p("Next steps:"),
        ul(
          `[How to check EBS volume usage](${article("check-ebs-volume-usage")}): used space against the size you pay for.`,
          `[gp2 vs gp3](${article("gp2-vs-gp3")}): price, performance and the switch.`,
          `[How to shrink an EBS volume](${article("shrink-ebs-volume")}): the copy, step by step.`,
          `[EBS pricing calculator](${routes.ebsAndAzureDiskPricing}): what a volume and its empty space cost.`,
        ),
      ],
    },
    {
      id: "eks-cost",
      title: "EKS clusters",
      blocks: [
        p(
          "AWS's EKS best practices guide says that in most clusters, the bulk of the cost is the EC2 instances your nodes run on.",
        ),
        p(
          `Pod [requests](${term("kubernetes-resource-requests")}) set the CPU and memory each container asks for. The guide says they should match real use. Set too high, they leave capacity unused, a large factor in cluster cost.`,
        ),
        p("The guide ranks the fixes for cluster compute in this order:"),
        ol(
          "Right-size workloads.",
          "Reduce unused capacity.",
          "Optimize capacity types, such as Spot, and accelerators, such as GPUs.",
        ),
        p(
          `Smaller requests free room on some nodes, and Karpenter or the Cluster Autoscaler can then remove them. Restrictive [Pod Disruption Budgets](${term("pod-disruption-budget")}) can stop both from scaling down, so check yours first.`,
        ),
        p(
          `[Kubernetes cost optimization](${routes.kubernetesCostOptimization}) covers both steps. The [EKS pricing calculator](${routes.eksAndAksPricingCalculator}) shows what a node costs a month, and [how to choose EKS instance types](${article("how-to-choose-eks-instance-types")}) helps you pick the next ones.`,
        ),
      ],
    },
    {
      id: "s3-cost",
      title: "S3 tiering",
      blocks: [
        p(
          "New objects go to S3 Standard unless you choose another storage class. A class that fits how the data is read reduces what you pay to store it.",
        ),
        h3("S3 Intelligent-Tiering"),
        p(
          "For data with unknown or changing access patterns, Amazon S3 Intelligent-Tiering moves each object between tiers for you:",
        ),
        ul(
          "to Infrequent Access after 30 days without access;",
          "to Archive Instant Access after 90 days without access;",
          "back to Frequent Access when it's accessed again.",
        ),
        p(
          "It has no retrieval fees, only a small monthly monitoring fee per object. Objects under 128 KB aren't monitored, and always stay in Frequent Access.",
        ),
        h3("Known cold data"),
        p(
          "A lifecycle rule can move objects from S3 Standard to S3 Standard-IA. Standard-IA suits objects over 128 KB that you keep for at least 30 days:",
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
      title: "Data transfer",
      blocks: [
        p("AWS charges for data transfer by direction and distance:"),
        ul(
          "Data coming into AWS from the internet isn't charged.",
          "Data going out to the internet is charged per service, at rates set by the Region it leaves.",
          "Data transfer within the same Availability Zone is free.",
          "Traffic that crosses an Availability Zone or Region boundary is usually charged.",
        ),
        p(
          `A [NAT gateway](${article("aws-nat-gateway-pricing")}) adds a data processing charge for every GB through it. A gateway VPC endpoint reaches S3 and DynamoDB in the same Region with no data transfer charge.`,
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
      title: "Savings Plans and Spot",
      blocks: [
        p(
          `A [Savings Plan](${term("savings-plan")}) commits you to a set amount of compute use per hour, for one or three years. Two kinds cover EC2:`,
        ),
        ul(
          "Compute Savings Plans: up to 66% off, whatever the instance family, size, OS, tenancy or Region, and on Fargate and Lambda too.",
          "EC2 Instance Savings Plans: up to 72% off, for one instance family in one Region.",
        ),
        p(
          "Buy after the other fixes. Cost Explorer recommends a commitment from your past usage, so wait until that usage comes from after your last change.",
        ),
        p(
          `[Spot Instances](${term("spot-instance")}) run on spare EC2 capacity at up to 90% off. AWS can reclaim them with a 2-minute notice, so keep them for work that can stop.`,
        ),
        p("AWS's EKS guide splits capacity three ways:"),
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
    lead: "Most fixes above are changes you make now and then. EKS requests and EBS data volumes drift as usage moves, so Coral and Amoeba keep fitting them to real use.",
    cards: [
      {
        product: "coral",
        title: "Coral, for EKS",
        paragraphs: [
          `[Coral](${routes.coral}) rebalances Amazon EKS clusters. It sizes pod requests to real use, so fewer EC2 instances can carry the same work. It also empties spare instances one at a time.`,
          "Karpenter or the Cluster Autoscaler still adds instances as demand grows, and removes the ones Coral empties. In a node group the Cluster Autoscaler doesn't manage, Coral removes them itself, and it never creates machines.",
          `With Karpenter, a rebalance can also move work onto cheaper EC2 instances. Node optimization starts when you connect a cluster. Pod sizing waits until you switch on "Automatically optimize".`,
        ],
        link: { label: "Coral on EKS", href: routes.eksCostOptimization },
      },
      {
        product: "amoeba",
        title: "Amoeba, for EBS",
        paragraphs: [
          `[Amoeba](${routes.amoeba}) rightsizes the EBS data volumes of Windows and Linux EC2 instances, and never touches the root volume. It moves an instance's data volumes onto one btrfs pool sized to your data, with room to grow. On AWS, the pool uses gp3.`,
          "Amoeba rightsizes the pool without any downtime. The services that use the data mounts restart briefly at the switch onto the pool.",
          "It grows the pool before it fills, and shrinks it one volume at a time when your data goes down and stays down. So you pay for close to what you use.",
        ],
        link: { label: "Amoeba on AWS", href: routes.ebsCostOptimization },
      },
    ],
    notes: [
      "Both products are in early access. Neither changes instance types outside EKS, S3 storage classes, your network or your commitments.",
      "Both price savings at list price, without your discounts or Savings Plans. Check their figures against your own rates before you size a commitment.",
      `[The free assessment](${routes.assessment}) estimates your saving on Kubernetes (AKS and EKS) and block storage on Azure and AWS. It's read-only and sends nothing to Zoorik.`,
    ],
  },
  questions: {
    title: "Questions",
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
          "Not in place. You copy the data to a smaller volume, or let Amoeba move a data volume onto a pool sized to your data.",
      },
      {
        question: "Savings Plan or Spot?",
        answer:
          "A Savings Plan suits steady usage you'll keep for one or three years. Spot suits work that can stop.",
      },
      {
        question: "Does Zoorik replace Cost Explorer or AWS Compute Optimizer?",
        answer:
          "No. Cost Explorer shows your costs, and Compute Optimizer recommends sizes for you to apply. Coral and Amoeba make the changes themselves, on EKS requests and nodes and on EBS data volumes.",
      },
    ],
  },
  readMore: {
    title: "Read more",
    tiles: [
      {
        title: "Cloud cost optimization",
        href: routes.cloudCostOptimization,
        line: "The order of fixes on Azure and AWS",
      },
      {
        title: "Azure cost optimization",
        href: routes.azureCostOptimization,
        line: "The same guide for Azure",
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
        title: "AWS Compute Optimizer for EBS",
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
