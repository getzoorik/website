/**
 * `/eks-and-aks-pricing-calculator` and `/ebs-and-azure-disk-pricing`: every string the two pages print. Rewritten in
 * the zero-noise pass of 2 Nov 2026; every figure and claim is still the one the pages were built with. Both sit at
 * the root, linked from Cloud cost optimization tools' Free calculators.
 *
 * The figures the calculators work out are not here: they come from `@/content/cloud-prices` through
 * `@/lib/cloud-cost-calc`, so a page can never print a price its data does not hold. The text is the drafts' small
 * markup, drawn by `RichText`: `code`, **bold**, [text](href).
 */

/** One block of a section's text. */
export type CalculatorBlock =
  | { readonly kind: "p"; readonly text: string }
  | { readonly kind: "ul"; readonly items: readonly string[] }
  | { readonly kind: "h3"; readonly text: string };

/** A section under the calculator: its text, or (Related reading) its links. */
export interface CalculatorSection {
  /**
   * The section's address where its title no longer gives it (`sectionSlug`): a renamed section keeps the id it had,
   * as an anchor is an address. "sources" is the section that carries the reference tables' fold.
   */
  readonly id?: string;
  readonly title: string;
  readonly blocks?: readonly CalculatorBlock[];
  readonly related?: readonly { readonly text: string; readonly href: string }[];
}

export interface CalculatorCopy {
  /** The page's `<title>` (through the site's "%s | Zoorik" template) and its description. */
  readonly meta: { readonly title: string; readonly description: string };
  readonly hero: { readonly title: string; readonly deck: string };
  /** The calculator section's h2, for the outline only; "Calculator" where a page sets none. */
  readonly heading?: string;
  /** The paragraph over the calculator. */
  readonly intro: readonly string[];
  /**
   * Worked example, How it works, Sources and Related reading, with each page's own sections where its plan puts
   * them: the node page's cluster fees first, the disk page's IOPS before Sources.
   */
  readonly frame: readonly CalculatorSection[];
  /** The line over the closing row. */
  readonly close: string;
  /** The tile on Cloud cost optimization tools. */
  readonly tile: { readonly title: string; readonly line: string; readonly href: string };
  /** The price sources and their day: the line under the calculator. */
  readonly sourceFirst: string;
  /** The input messages, in the drafts' order. */
  readonly messages: readonly string[];
}

/**
 * The day the calculators' content last changed, for the sitemap's `lastmod`. Whoever changes either page, or
 * refreshes its prices, moves it. 2 Nov 2026: the zero-noise rewrite (titles, h1s, the line under each h1, every
 * section's name and text); the prices are still those retrieved 30 October 2026.
 */
export const calculatorsLastUpdated = "3 November 2026";

export const nodeCalculator = {
  meta: {
    title: "EKS and AKS pricing calculator",
    description:
      "EKS and AKS pricing at list price: each node's monthly cost, each cloud's cluster fee, and how much of a node your pods can use.",
  },
  hero: {
    title: "EKS and AKS pricing calculator",
    deck: "What an EKS or AKS node costs a month at list price, and how much of it your pods can use.",
  },
  intro: [
    "Pods can't use a whole node. Kubernetes keeps some CPU and memory on each node for itself.",
  ],
  frame: [
    /* The cluster fees, from AWS's Amazon EKS pricing page. */
    {
      id: "how-much-does-eks-cost",
      title: "EKS pricing",
      blocks: [
        {
          kind: "p",
          text: "EKS pricing has two parts: an hourly fee for each cluster, and the Amazon EC2 costs of its worker nodes and their EBS volumes.",
        },
        {
          kind: "p",
          text: "The cluster fee is $0.10 an hour on standard support, or $73 a month at 730 hours. On extended support it's $0.60 an hour, or $438 a month.",
        },
        { kind: "p", text: "The calculator above prices the nodes, not the cluster fee." },
      ],
    },
    /* From Microsoft Learn's AKS pricing tiers and Azure's AKS pricing page (Standard $0.10, Premium $0.60 a cluster
       hour). */
    {
      id: "how-azure-kubernetes-service-pricing-works",
      title: "AKS pricing",
      blocks: [
        {
          kind: "ul",
          items: [
            "**Free:** no cluster fee and no financially backed SLA. Microsoft recommends it for clusters with fewer than 10 nodes.",
            "**Standard:** $0.10 an hour, or $73 a month, with an uptime SLA.",
            "**Premium:** $0.60 an hour, or $438 a month, with an uptime SLA and Long Term Support.",
          ],
        },
        {
          kind: "p",
          text: "On every tier you also pay for each node VM by the hour. The calculator prices those VMs, without AKS Automatic's extra charges.",
        },
      ],
    },
    {
      title: "Worked example",
      blocks: [
        { kind: "h3", text: "AKS: three Standard_D4s_v5 nodes" },
        { kind: "p", text: "In East US, with AKS's default of 250 max pods per node:" },
        {
          kind: "ul",
          items: [
            "**Cost:** $0.192 an hour × 730 hours × 3 nodes = **$420.48 a month**, or $140.16 per node.",
            "**CPU:** Kubernetes keeps 0.14 vCPU per node, so pods can use 3.86 of 4 vCPUs (96.5%).",
            "**Memory:** Kubernetes keeps 4.1 GiB per node, so pods can use 11.9 of 16 GiB (74.4%).",
            "**All 3 nodes:** pods can use 11.58 of 12 vCPUs and 35.7 of 48 GiB.",
          ],
        },
        { kind: "h3", text: "EKS: three m6i.xlarge nodes" },
        { kind: "p", text: "In US East (N. Virginia), in an EKS managed node group:" },
        {
          kind: "ul",
          items: [
            "**Cost:** $0.192 an hour × 730 hours × 3 nodes = **$420.48 a month**, or $140.16 per node.",
            "**CPU:** Kubernetes keeps 0.08 vCPU per node, so pods can use 3.92 of 4 vCPUs (98%).",
            "**Memory:** the instance type supports 58 pods, so Kubernetes keeps 0.97 GiB per node. Max pods is also 58, under the managed node group's cap of 110.",
          ],
        },
      ],
    },
    {
      id: "how-the-calculator-works",
      title: "How it works",
      blocks: [
        { kind: "h3", text: "Monthly cost" },
        { kind: "p", text: "Monthly cost = hourly list price × 730 hours × nodes." },
        {
          kind: "ul",
          items: [
            "The price is the Linux pay-as-you-go VM price on Azure and the Linux on-demand EC2 price on AWS, in USD.",
            "It's the list price, before any discount, reservation, savings plan or negotiated rate.",
            "It covers the VM only: not its OS disk, network traffic or anything else in the cluster.",
          ],
        },
        { kind: "h3", text: "AKS reserves" },
        { kind: "p", text: "From Microsoft's node resource reservations for AKS 1.29 and later:" },
        {
          kind: "ul",
          items: [
            "**CPU:** a fixed reserve for each core count. A 4-core node keeps 140 millicores, or 0.14 vCPU.",
            "**Memory:** the smaller of 20 MB per max pod plus 50 MB, or 25% of the node's memory.",
            "**Eviction threshold:** 100 Mi kept free, so pods are evicted before the node runs out.",
          ],
        },
        {
          kind: "p",
          text: "The node's OS reserves some CPU and memory on top, and some AKS features reserve more CPU. So treat the result as the most your pods can use.",
        },
        { kind: "h3", text: "EKS reserves" },
        { kind: "p", text: "From the EKS-optimized Amazon Linux AMI, as AWS documents it:" },
        {
          kind: "ul",
          items: [
            "**CPU:** 6% of the first core, 1% of the second, 0.5% of the third and fourth, and 0.25% of each core after that.",
            "**Max pods:** network interfaces × (IP addresses per interface − 1) + 2. A managed node group caps it at 110 on nodes with fewer than 30 vCPUs.",
            "**Memory:** 11 MiB per pod the instance type supports, plus 255 MiB, plus a 100 MiB eviction threshold. AWS counts the instance type's pods here, even when max pods is set below that.",
          ],
        },
        { kind: "h3", text: "What's left for pods" },
        {
          kind: "p",
          text: "Your pods' requests fill what's left, DaemonSets included. Kubernetes places a pod only where its requests fit, even when the node's actual use is low.",
        },
      ],
    },
    {
      id: "sources",
      title: "Sources",
      blocks: [
        {
          kind: "ul",
          items: [
            "Prices: the [Azure Retail Prices API](https://prices.azure.com/api/retail/prices) and the [AWS Price List for Amazon EC2](https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/current/region_index.json), retrieved 30 October 2026.",
            "Cluster fees: AWS's [Amazon EKS pricing](https://aws.amazon.com/eks/pricing/), Microsoft Learn's [AKS pricing tiers](https://learn.microsoft.com/en-us/azure/aks/free-standard-pricing-tiers) and Azure's [AKS pricing](https://azure.microsoft.com/en-us/pricing/details/kubernetes-service/), checked 2 November 2026.",
            "Sizes: Microsoft Learn's VM size pages and the AWS Price List, checked 30 October 2026.",
            "AKS reserves: Microsoft Learn's [node resource reservations in AKS](https://learn.microsoft.com/en-us/azure/aks/node-resource-reservations) and [maximum pods per node](https://learn.microsoft.com/en-us/azure/aks/concepts-network-ip-address-planning#maximum-pods-per-node), checked 30 October 2026.",
            "EKS reserves: AWS's [node CPU and memory reservations](https://docs.aws.amazon.com/batch/latest/userguide/memory-cpu-batch-eks.html) and [how maxPods is determined](https://docs.aws.amazon.com/eks/latest/userguide/choosing-instance-type.html), checked 30 October 2026.",
            "Scheduling: the Kubernetes docs on [scheduling by requests](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/), checked 30 October 2026.",
          ],
        },
        { kind: "p", text: "Prices change. Check your cloud's price list before you buy." },
      ],
    },
    {
      title: "Related reading",
      related: [
        { text: "Allocatable vs capacity", href: "/learn/kubernetes-allocatable-vs-capacity" },
        { text: "AKS vs EKS cost", href: "/learn/aks-vs-eks-cost" },
        { text: "Kubernetes cost estimation", href: "/learn/kubernetes-cost-estimation" },
        { text: "Kubernetes cost optimization", href: "/kubernetes-cost-optimization" },
      ],
    },
  ],
  /* "without any downtime" is the products' positioning. */
  close:
    "Coral rebalances requests and removes spare nodes on AKS and EKS to reduce your cloud cost, without any downtime.",
  tile: {
    title: "EKS and AKS pricing calculator",
    line: "A node's monthly list price on AKS or EKS, and how much of it your pods can use.",
    href: "/eks-and-aks-pricing-calculator",
  },
  sourceFirst:
    "Prices from the [Azure Retail Prices API](https://prices.azure.com/api/retail/prices) and the [AWS Price List for Amazon EC2](https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/current/region_index.json), retrieved 30 October 2026.",
  maxPodsHelp:
    "250 is the default with Azure CNI Overlay, AKS's default network. Kubenet and Azure CNI Pod subnet default to 110, legacy Azure CNI to 30.",
  eksNote:
    "**Memory pods can use: not shown.** AWS works this out from the memory the node reports, which is less than the instance's memory. In AWS's example, an 8 GB instance reports 7,748 MiB. AWS doesn't publish that figure for each instance type. From what the node reports, Kubernetes keeps 0.97 GiB for itself.",
  messages: [
    "Enter a whole number of nodes, 1 or more.",
    "AKS allows 10 to 250 pods per node.",
    "AKS needs room for at least 30 pods in a node pool. Raise max pods or add nodes.",
  ],
} as const satisfies CalculatorCopy & {
  /** Under Max pods per node (AKS): the networks' defaults. */
  readonly maxPodsHelp: string;
  /** In place of the pod memory on EKS; its `eksNoteFigure` follows the chosen size. */
  readonly eksNote: string;
};

export const diskCalculator = {
  meta: {
    title: "Amazon EBS and Azure disk pricing calculator",
    description:
      "Amazon EBS pricing and Azure disk pricing at list price: what a volume or managed disk costs a month, and what its empty space costs.",
  },
  hero: {
    title: "EBS and Azure disk pricing calculator",
    deck: "What an EBS volume or Azure managed disk costs a month at list price, and what its empty space costs.",
  },
  intro: [
    "Amazon EBS pricing and Azure disk pricing follow a disk's full size, however little data it holds. Empty space costs as much as used space.",
  ],
  frame: [
    {
      title: "Worked example",
      blocks: [
        { kind: "h3", text: "Azure: a 200 GiB Standard SSD" },
        { kind: "p", text: "In East US, with 50 GiB used:" },
        {
          kind: "ul",
          items: [
            "**Priced as:** E15, a 256 GiB tier, at $19.20 a month.",
            "**Empty space:** 200 − 50 = 150 GiB, or 75% of the disk.",
            "**Empty space cost:** $19.20 × 150 ÷ 256 = **$11.25 a month**.",
            "**Tier space above the disk:** 256 − 200 = 56 GiB, or $4.20 a month.",
          ],
        },
        { kind: "h3", text: "AWS: a 200 GiB gp3 volume" },
        { kind: "p", text: "In US East (N. Virginia), with 50 GiB used:" },
        {
          kind: "ul",
          items: [
            "**Monthly cost:** $0.08 per GB-month × 200 = $16.00.",
            "**Empty space:** 150 GiB, or 75% of the volume.",
            "**Empty space cost:** $0.08 × 150 = **$12.00 a month**.",
          ],
        },
      ],
    },
    {
      id: "how-the-calculator-works",
      title: "How it works",
      blocks: [
        {
          kind: "p",
          text: "Prices are list prices in USD, before any discount, reservation or negotiated rate. On Azure they're pay-as-you-go with locally redundant storage (LRS). On AWS they're on-demand.",
        },
        {
          kind: "p",
          text: "The figure is storage only. Transactions, bursting and snapshots aren't in it.",
        },
        { kind: "h3", text: "Azure: priced by tier" },
        {
          kind: "p",
          text: "Azure Disk Storage pricing rounds a managed disk's size up to the nearest tier. The disk costs that tier's monthly price, whatever data it holds.",
        },
        { kind: "h3", text: "AWS: priced per GB" },
        {
          kind: "p",
          text: "EBS volume pricing is per GB you provision, per month. AWS's EBS pricing page defines a GB as 1024³ bytes, so the calculator treats it as a GiB.",
        },
        {
          kind: "p",
          text: "For gp3, the calculator counts only the 3,000 IOPS (input/output operations per second) and 125 MiB/s included in the price.",
        },
        { kind: "h3", text: "Empty space" },
        {
          kind: "ul",
          items: [
            "**Empty space** = disk size − used space, never below 0.",
            "**Share** = empty space ÷ disk size.",
            "**Cost on Azure** = the tier's monthly price × empty GiB ÷ the tier's GiB.",
            "**Cost on AWS** = price per GB-month × empty GiB.",
          ],
        },
        {
          kind: "p",
          text: "On Azure the tier can be larger than the disk. The calculator shows that extra space on its own line.",
        },
        { kind: "h3", text: "Why empty space stays" },
        {
          kind: "p",
          text: "Azure managed disks and EBS volumes can grow, but neither can shrink in place. Microsoft's guides to expanding a disk on [Linux](https://learn.microsoft.com/en-us/azure/virtual-machines/linux/expand-disks) and [Windows](https://learn.microsoft.com/en-us/azure/virtual-machines/windows/expand-disks) VMs say shrinking isn't supported. AWS's guide to [modifying an EBS volume](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-modify-volume.html) says you can't decrease its size.",
        },
        {
          kind: "p",
          text: "So a disk that grows keeps its larger cost, even after its data shrinks.",
        },
      ],
    },
    /* Each type's IOPS, from Microsoft Learn's Azure managed disk types and AWS's General Purpose SSD volumes; the
       calculator's IOPS row shows the chosen disk's. */
    {
      id: "disk-iops-calculator-the-iops-each-size",
      title: "Disk IOPS",
      blocks: [
        {
          kind: "ul",
          items: [
            "**Azure Premium SSD:** fixed by tier, from 120 IOPS on P1 to P4, through 500 on P10 and 5,000 on P30, to 20,000 on P80.",
            "**Azure Standard SSD:** up to 500 IOPS on E1 to E50, then up to 2,000 on E60, 4,000 on E70 and 6,000 on E80.",
            "**gp3:** 3,000 IOPS at any size, included in the price. You can buy more, up to 500 IOPS per GiB and 80,000 in all.",
            "**gp2:** 3 IOPS per GiB, from 100 to 16,000. A volume under 1 TiB can burst to 3,000.",
          ],
        },
        {
          kind: "p",
          text: "So a 200 GiB disk gets 1,100 IOPS on Premium SSD (P15), up to 500 on Standard SSD, 600 on gp2 and 3,000 on gp3.",
        },
      ],
    },
    {
      id: "sources",
      title: "Sources",
      blocks: [
        {
          kind: "ul",
          items: [
            "Azure prices: the [Azure Retail Prices API](https://prices.azure.com/api/retail/prices), retrieved 30 October 2026.",
            "EBS prices: the [AWS Price List for Amazon EC2](https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/current/region_index.json), which carries EBS, retrieved 30 October 2026.",
            "Azure tier sizes, tier IOPS and the round-up rule: Microsoft Learn's [Azure managed disk types](https://learn.microsoft.com/en-us/azure/virtual-machines/disks-types), checked 2 November 2026.",
            "EBS terms: [Amazon EBS pricing](https://aws.amazon.com/ebs/pricing/), checked 30 October 2026.",
            "EBS IOPS: AWS's [General Purpose SSD volumes](https://docs.aws.amazon.com/ebs/latest/userguide/general-purpose.html), checked 2 November 2026.",
          ],
        },
        { kind: "p", text: "Prices change. Check your cloud's price list before you buy." },
      ],
    },
    {
      title: "Related reading",
      related: [
        { text: "Azure disk reservations", href: "/learn/azure-disk-reservations" },
        { text: "Shrink an Azure managed disk", href: "/learn/shrink-azure-managed-disk" },
        { text: "Check EBS volume usage", href: "/learn/check-ebs-volume-usage" },
        { text: "Azure disk sizes", href: "/learn/glossary/azure-disk-sizes" },
        { text: "EBS gp3 volumes", href: "/learn/glossary/ebs-gp3" },
      ],
    },
  ],
  /* "without any downtime" is the products' positioning. */
  close:
    "Amoeba rightsizes block storage on Azure and AWS, for Windows and Linux VMs, without any downtime. You pay for close to the space your data uses.",
  tile: {
    title: "EBS and Azure disk pricing calculator",
    line: "What an Azure managed disk or an EBS volume costs a month, and what its empty space costs.",
    href: "/ebs-and-azure-disk-pricing",
  },
  sourceFirst:
    "Prices from the [Azure Retail Prices API](https://prices.azure.com/api/retail/prices) and the [AWS Price List for Amazon EC2](https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/current/region_index.json), which carries EBS, retrieved 30 October 2026.",
  help: {
    azure: "Azure prices the disk at the smallest tier that holds this size.",
    aws: "AWS prices every GB you provision.",
    used: "The space your files use, as the VM reports it. Check it [on an Azure VM](/learn/azure-vm-disk-usage) or [on an EBS volume](/learn/check-ebs-volume-usage).",
  },
  overLine: "Used space is more than the disk size, so empty space shows as 0. Check both figures.",
  messages: [
    "Enter the disk size as a whole number of GiB.",
    "Enter a size from 1 to 32,767 GiB.",
    "A gp3 volume can be 1 GiB to 64 TiB (65,536 GiB).",
    "A gp2 volume can be 1 GiB to 16 TiB (16,384 GiB).",
    "Enter the used space in GiB, 0 or more.",
  ],
} as const satisfies CalculatorCopy & {
  /** Under Disk size, by cloud, and under Used space. */
  readonly help: { readonly azure: string; readonly aws: string; readonly used: string };
  /** Under Used space when it is more than the disk size. */
  readonly overLine: string;
};

/** The figure in the EKS note that follows the chosen size: what Kubernetes keeps, in the note's own words. */
export const eksNoteFigure = "0.97 GiB";

/** The size kinds' names, as the size list groups them and the reference tables name them. */
export const sizeKindNames = {
  general: "General purpose",
  compute: "Compute optimized",
  memory: "Memory optimized",
} as const;

/**
 * The node calculator's controls and result, in the order the page draws them. Each region's and size's own name
 * comes from the data; "Across all 3 nodes" counts the nodes entered.
 */
export const nodeCalculatorUi = {
  cloud: { label: "Cloud", azure: "Azure (AKS)", aws: "AWS (EKS)" },
  region: "Region",
  size: "VM size",
  nodes: { label: "Nodes", unit: "nodes", start: "3" },
  more: "More settings",
  maxPods: { label: "Max pods per node", unit: "pods", start: "250" },
  total: { label: "Monthly cost for all nodes", after: " a month" },
  perNodeCost: "Monthly cost per node",
  listPrice: "List price",
  perNode: "What pods can use, per node",
  cpu: "CPU pods can use",
  memory: "Memory pods can use",
  keeps: "Kubernetes keeps",
  pods: "Max pods used",
  /** "Across all nodes", then "Across all 3 nodes" once a count is entered, grouped as every figure is ("5,000"). */
  across: (nodes: number): string =>
    `Across all ${nodes.toLocaleString("en-US")} ${nodes === 1 ? "node" : "nodes"}`,
  vcpus: "vCPUs",
  memoryTotal: "Memory",
  notShown: "Not shown (see the note)",
  /** The reference tables' fold. */
  tables: "List prices and reserves",
  /** The h3 over each cloud's tables in the fold: its node prices, then what pods can use. */
  tableHeadings: {
    azure: "Azure VM pricing for AKS",
    aws: "AWS EC2 pricing for EKS",
  },
} as const;

/** The disk calculator's controls and result, in the order the page draws them. */
export const diskCalculatorUi = {
  cloud: { label: "Cloud", azure: "Azure", aws: "AWS" },
  region: "Region",
  type: {
    label: "Disk type",
    azure: { "premium-ssd": "Premium SSD", "standard-ssd": "Standard SSD" },
    aws: { gp3: "gp3", gp2: "gp2" },
  },
  size: { label: "Disk size", unit: "GiB", start: "200" },
  used: { label: "Used space", unit: "GiB", start: "50" },
  cost: "Monthly cost of the disk",
  emptyCost: "Monthly cost of the empty space",
  aMonth: " a month",
  pricedAs: "Priced as",
  priceUsed: "Price used",
  empty: "Empty space",
  up: "Tier space above the disk’s size",
  /** The disk's IOPS: the tier's on Azure (Standard SSD's "up to"), gp2's baseline, gp3's included 3,000. */
  iops: { label: "IOPS", upTo: "Up to ", included: ", included in the price" },
  /** The reference tables' fold. */
  tables: "List prices",
  /** The h3 over each price table in the fold. */
  tableHeadings: {
    "premium-ssd": "Azure Premium SSD pricing",
    "standard-ssd": "Azure Standard SSD pricing",
    ebs: "Amazon EBS pricing",
  },
} as const;
