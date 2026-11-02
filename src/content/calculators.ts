/**
 * `/eks-and-aks-pricing-calculator` and `/ebs-and-azure-disk-pricing`: every string the two pages print, word for word
 * from the checked drafts (docs/website-seo/new-pages-2026-10-30/calculators/node.md and disk.md, every figure and
 * claim traced in that folder's ledger.md) and the mocks (eks-and-aks-pricing-calculator.html,
 * ebs-and-azure-disk-pricing.html). The owner placed them "At the root" (30 Oct 2026), linked from Cloud cost
 * optimization tools' Free calculators.
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
   * Worked example, How the calculator works, Sources and Related reading, with each page's own sections where its plan
   * puts them: the node page's cluster fees first, the disk page's IOPS before Sources.
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
 * refreshes its prices, moves it. 2 Nov 2026: the SEO plan sheet's pass (titles, h1s, the one line under each h1, the
 * EKS and AKS cluster fees, disk IOPS, and the sources as lists); the prices are still those retrieved 30 October 2026.
 */
export const calculatorsLastUpdated = "2 November 2026";

export const nodeCalculator = {
  meta: {
    title: "EKS pricing and AKS pricing calculator for nodes",
    description:
      "AWS EKS pricing and AKS pricing for nodes: price an EKS or AKS node pool at AWS and Azure list prices, and see how much of each node your pods can use.",
  },
  hero: {
    title: "EKS pricing calculator: what an EKS or AKS node costs a month",
    deck: "List prices for 12 AKS and 12 EKS node sizes, and how much of each node your pods can use.",
  },
  /* Named for the search "aks pricing calculator" (owner, 1 Nov 2026). */
  heading: "EKS and AKS pricing calculator",
  intro: [
    "Your pods can't use all of a node: Kubernetes keeps some CPU and memory on every node for itself.",
  ],
  frame: [
    /* The cluster fees (the SEO plan sheet, 2 Nov 2026), from AWS's Amazon EKS pricing page. */
    {
      title: "How much does EKS cost?",
      blocks: [
        {
          kind: "p",
          text: "A Kubernetes cluster's price on EKS has two parts. One is an hourly fee for the cluster. The other is the Amazon EC2 costs of its worker nodes, plus their EBS volumes.",
        },
        {
          kind: "p",
          text: "The cluster fee is $0.10 an hour on standard support, or $73 a month at 730 hours. On extended support, the Amazon EKS price is $0.60 an hour, or $438.",
        },
        { kind: "p", text: "This calculator prices the nodes, on EKS and on AKS." },
      ],
    },
    /* From Microsoft Learn's AKS pricing tiers and Azure's AKS pricing page (Standard $0.10, Premium $0.60 a cluster
       hour). */
    {
      title: "How Azure Kubernetes Service pricing works",
      blocks: [
        {
          kind: "ul",
          items: [
            "**Free:** no cluster management fee. Microsoft recommends it for clusters with fewer than 10 nodes, and it has no financially backed SLA.",
            "**Standard:** $0.10 an hour, or $73 a month, with an uptime SLA.",
            "**Premium:** $0.60 an hour, or $438 a month, plus Long Term Support.",
          ],
        },
        {
          kind: "p",
          text: "On every tier, you also pay for each node VM for every hour it runs. This calculator works that out, but leaves out AKS Automatic's own extra charges.",
        },
      ],
    },
    {
      title: "Worked example",
      blocks: [
        { kind: "h3", text: "Azure AKS cost: three Standard_D4s_v5 nodes in East US" },
        { kind: "p", text: "With AKS's default of 250 max pods per node:" },
        {
          kind: "ul",
          items: [
            "**Cost:** $0.192 an hour × 730 hours × 3 nodes = **$420.48 a month**, or $140.16 per node.",
            "**CPU:** Kubernetes keeps 0.14 vCPU of each node. Pods can use 3.86 of 4 vCPUs (96.5%).",
            "**Memory:** Kubernetes keeps 4.1 GiB of each node. Pods can use 11.9 of 16 GiB (74.4%).",
            "**All 3 nodes:** pods can use 11.58 of 12 vCPUs and 35.7 of 48 GiB.",
          ],
        },
        { kind: "h3", text: "AWS EKS cost: three m6i.xlarge nodes in US East (N. Virginia)" },
        { kind: "p", text: "In an EKS managed node group:" },
        {
          kind: "ul",
          items: [
            "**EC2 pricing:** $0.192 an hour × 730 hours × 3 nodes = **$420.48 a month**, or $140.16 per node.",
            "**CPU:** Kubernetes keeps 0.08 vCPU of each node. Pods can use 3.92 of 4 vCPUs (98%).",
            "**Memory:** the instance type supports 58 pods, so Kubernetes keeps 0.97 GiB of each node. Max pods is also 58, below the managed node group's cap of 110.",
          ],
        },
      ],
    },
    {
      title: "How the calculator works",
      blocks: [
        { kind: "h3", text: "Monthly cost" },
        {
          kind: "p",
          text: "Monthly cost = the hourly list price × 730 hours × the number of nodes.",
        },
        {
          kind: "ul",
          items: [
            "The price is the Linux pay-as-you-go VM price on Azure, and the Linux on-demand EC2 price on AWS, in USD.",
            "It's the list price, before any discount, reservation, savings plan or negotiated rate.",
            "It covers the VM alone, not its OS disk, network traffic or anything else in the cluster.",
          ],
        },
        { kind: "h3", text: "What pods can use on AKS" },
        {
          kind: "p",
          text: "This follows Microsoft's node resource reservations for AKS 1.29 and later:",
        },
        {
          kind: "ul",
          items: [
            "**CPU:** Microsoft gives a fixed reserve for each core count. A 4-core node keeps 140 millicores, or 0.14 vCPU.",
            "**Memory:** AKS keeps the smaller of two amounts: 20 MB per max pod plus 50 MB, or 25% of the node's memory.",
            "**Eviction threshold:** AKS also keeps 100 Mi free, so pods are evicted before the node runs out.",
          ],
        },
        {
          kind: "p",
          text: "Microsoft notes that the node's OS reserves some CPU and memory on top, and some AKS features reserve more CPU. So treat the result as the most your pods can use.",
        },
        { kind: "h3", text: "What pods can use on EKS" },
        {
          kind: "p",
          text: "This follows the EKS-optimized Amazon Linux AMI, as AWS documents it:",
        },
        {
          kind: "ul",
          items: [
            "**CPU:** 6% of the first core, 1% of the second, 0.5% of the third and fourth, and 0.25% of each core after that.",
            "**Max pods:** network interfaces × (IP addresses per interface − 1) + 2. An EKS managed node group caps it at 110 on nodes with fewer than 30 vCPUs.",
            "**Memory:** 11 MiB for each pod the instance type supports, plus 255 MiB, and a 100 MiB eviction threshold on top. AWS counts the pods the instance type supports here, even when a managed node group sets max pods below that.",
          ],
        },
        { kind: "h3", text: "What's left for your pods" },
        {
          kind: "p",
          text: "Your pods' requests fill what's left, DaemonSets included. Kubernetes places a pod only where its requests fit, even when the node's actual use is very low.",
        },
      ],
    },
    {
      id: "sources",
      title: "Node price tables and sources",
      blocks: [
        {
          kind: "ul",
          items: [
            "Azure VM prices from the [Azure Retail Prices API](https://prices.azure.com/api/retail/prices), and AWS instance pricing from the [AWS Price List for Amazon EC2](https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/current/region_index.json), retrieved 30 October 2026.",
            "Cluster fees from AWS's [Amazon EKS pricing](https://aws.amazon.com/eks/pricing/), and from Microsoft Learn's [AKS pricing tiers](https://learn.microsoft.com/en-us/azure/aks/free-standard-pricing-tiers) and Azure's [AKS pricing](https://azure.microsoft.com/en-us/pricing/details/kubernetes-service/), checked 2 November 2026.",
            "Sizes from Microsoft Learn's VM size pages and the AWS Price List. AKS reserves from Microsoft Learn's [node resource reservations in AKS](https://learn.microsoft.com/en-us/azure/aks/node-resource-reservations) and [maximum pods per node](https://learn.microsoft.com/en-us/azure/aks/concepts-network-ip-address-planning#maximum-pods-per-node). EKS reserves from AWS's [node CPU and memory reservations](https://docs.aws.amazon.com/batch/latest/userguide/memory-cpu-batch-eks.html) and [how maxPods is determined](https://docs.aws.amazon.com/eks/latest/userguide/choosing-instance-type.html). Scheduling from the Kubernetes docs on [scheduling by requests](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/). All checked 30 October 2026.",
          ],
        },
        { kind: "p", text: "Prices change; check your cloud's price list before you buy." },
      ],
    },
    {
      id: "related-reading",
      title: "Related reading on Kubernetes node cost",
      related: [
        {
          text: "Kubernetes allocatable vs capacity: what pods can use",
          href: "/learn/kubernetes-allocatable-vs-capacity",
        },
        {
          text: "Kubernetes pricing and cost estimation: count the nodes, then price them",
          href: "/learn/kubernetes-cost-estimation",
        },
        {
          text: "Kubernetes cost optimization: rebalance requests, then remove spare nodes",
          href: "/kubernetes-cost-optimization",
        },
      ],
    },
  ],
  /* "without any downtime" stays until the owner confirms the plan dropping it (2 Nov 2026). */
  close:
    "Coral rebalances AKS and EKS clusters to reduce your cloud cost, autonomously, without any downtime. Your own cluster's saving is one free assessment away.",
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
    title: "Amazon EBS pricing and Azure disk cost calculator",
    description:
      "EBS volume pricing and Azure disk pricing in one calculator: what an EBS volume or a managed disk costs a month at list price, and what its empty space costs.",
  },
  hero: {
    title: "Amazon EBS pricing and Azure disk pricing: what a disk costs a month",
    deck: "Enter a disk's size and the space its files use to see what its empty space costs.",
  },
  /* Named for the search "ebs pricing calculator" (the SEO plan sheet, 2 Nov 2026). */
  heading: "EBS and Azure disk pricing calculator",
  intro: [
    "On AWS and Azure, block storage pricing follows a disk's full size, however little data it holds. So empty space costs the same as space your data uses.",
  ],
  frame: [
    {
      title: "Worked example",
      blocks: [
        { kind: "h3", text: "Azure disk cost: a 200 GiB Standard SSD" },
        { kind: "p", text: "In East US, with 50 GiB used:" },
        {
          kind: "ul",
          items: [
            "**Priced as:** E15, a 256 GiB tier, so the Azure disk price is $19.20 a month.",
            "**Empty space:** 200 − 50 = 150 GiB, or 75% of the disk.",
            "**Cost of the empty space:** $19.20 × 150 ÷ 256 = **$11.25 a month**.",
            "**Tier space above the disk:** 256 − 200 = 56 GiB, or $4.20 a month.",
          ],
        },
        { kind: "h3", text: "EBS storage cost: a 200 GiB gp3 volume" },
        {
          kind: "p",
          text: "In US East (N. Virginia), with 50 GiB used, the EBS calculator gives:",
        },
        {
          kind: "ul",
          items: [
            "**Monthly cost:** $0.08 per GB-month × 200 = $16.00.",
            "**Empty space:** 150 GiB, or 75% of the volume.",
            "**Cost of the empty space:** $0.08 × 150 = **$12.00 a month**.",
          ],
        },
      ],
    },
    {
      title: "How the calculator works",
      blocks: [
        {
          kind: "p",
          text: "Disk pricing here is the list price in USD, before any discount, reservation or negotiated rate. On Azure it's pay-as-you-go, with locally redundant storage (LRS). On AWS it's on-demand.",
        },
        {
          kind: "p",
          text: "It counts storage alone: transactions, bursting and snapshots aren't in the figure.",
        },
        { kind: "h3", text: "Azure managed disk pricing: rounded up to a size tier" },
        {
          kind: "p",
          text: "Azure disk pricing rounds a managed disk's size up to the nearest tier. The disk then costs that tier's monthly price, whatever data it holds.",
        },
        { kind: "h3", text: "EBS pricing on AWS: per GB you provision" },
        {
          kind: "p",
          text: "AWS EBS volume pricing is per GB you provision, per month. On AWS's EBS pricing page a GB is 1024³ bytes, so this calculator treats it as a GiB.",
        },
        {
          kind: "p",
          text: "For EBS costing, the calculator assumes a gp3 volume uses only its included 3,000 IOPS (input/output operations per second) and 125 MiB/s.",
        },
        { kind: "h3", text: "Empty space and what it costs" },
        {
          kind: "ul",
          items: [
            "**Empty space** = the disk size − the used space, and never below 0.",
            "**Its share** = the empty space ÷ the disk size.",
            "**On Azure,** the empty space costs the tier's monthly price × the empty GiB ÷ the tier's GiB.",
            "**On AWS,** it costs the price per GB-month × the empty GiB.",
          ],
        },
        {
          kind: "p",
          text: "On Azure the tier can be larger than the disk. That extra space gets its own line, apart from the empty space.",
        },
        { kind: "h3", text: "Why empty space stays" },
        {
          kind: "p",
          text: "An Azure managed disk and an EBS volume can grow, but neither can be made smaller in place. Microsoft's guides to expanding a disk on [Linux](https://learn.microsoft.com/en-us/azure/virtual-machines/linux/expand-disks) and [Windows](https://learn.microsoft.com/en-us/azure/virtual-machines/windows/expand-disks) VMs say shrinking an existing disk isn't supported. AWS's guide to [modifying an EBS volume](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-modify-volume.html) says you can't decrease its size.",
        },
        {
          kind: "p",
          text: "So an Azure disk or EBS volume that grows keeps its larger storage cost, even after its data shrinks.",
        },
      ],
    },
    /* Each size's IOPS (the SEO plan sheet, 2 Nov 2026), from Microsoft Learn's Azure managed disk types and AWS's
       General Purpose SSD volumes; the calculator's IOPS row shows the chosen disk's. */
    {
      title: "Disk IOPS calculator: the IOPS each size gives",
      blocks: [
        {
          kind: "ul",
          items: [
            "**Azure Premium SSD:** fixed by tier, from 120 IOPS on P1 to P4, through 500 on P10 and 5,000 on P30, to 20,000 on P80.",
            "**Azure Standard SSD:** up to 500 IOPS on E1 to E50, then up to 2,000 on E60, 4,000 on E70 and 6,000 on E80.",
            "**gp3:** 3,000 IOPS at any size, included in the price. You can pay for more, at up to 500 IOPS per GiB and 80,000 in all.",
            "**gp2:** 3 IOPS per GiB, at least 100 and at most 16,000. A volume under 1 TiB can burst to 3,000.",
          ],
        },
        {
          kind: "p",
          text: "For a 200 GiB disk, a Premium SSD gets P15's 1,100 IOPS and a Standard SSD up to 500. A gp2 volume gets 600 (3 × 200), and gp3 gets 3,000.",
        },
      ],
    },
    {
      id: "sources",
      title: "Where the disk prices come from",
      blocks: [
        {
          kind: "ul",
          items: [
            "Azure storage pricing for managed disks from the [Azure Retail Prices API](https://prices.azure.com/api/retail/prices), retrieved 30 October 2026.",
            "AWS storage pricing for EBS volumes from the [AWS Price List for Amazon EC2](https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/current/region_index.json), which carries EBS, retrieved 30 October 2026.",
            "Tier sizes, tier IOPS and the round-up rule from Microsoft Learn's [Azure managed disk types](https://learn.microsoft.com/en-us/azure/virtual-machines/disks-types), checked 2 November 2026.",
            "EBS terms from [Amazon EBS pricing](https://aws.amazon.com/ebs/pricing/), checked 30 October 2026, and IOPS from AWS's [General Purpose SSD volumes](https://docs.aws.amazon.com/ebs/latest/userguide/general-purpose.html), checked 2 November 2026.",
          ],
        },
        { kind: "p", text: "Prices change; check your cloud's price list before you buy." },
      ],
    },
    {
      title: "Related reading",
      related: [
        {
          text: "Azure disk reservations: are they worth it?",
          href: "/learn/azure-disk-reservations",
        },
        { text: "Can you shrink an Azure managed disk?", href: "/learn/shrink-azure-managed-disk" },
        {
          text: "How to check EBS volume usage: used space vs paid space",
          href: "/learn/check-ebs-volume-usage",
        },
        {
          text: "What are Azure disk sizes (P10, P30, E10)?",
          href: "/learn/glossary/azure-disk-sizes",
        },
        { text: "What is gp3 in AWS? EBS gp3 volumes explained", href: "/learn/glossary/ebs-gp3" },
      ],
    },
  ],
  close:
    "Amoeba rightsizes block storage on Azure and AWS, for Windows and Linux VMs, to reduce your cloud cost, autonomously, without any downtime after the one switch. Your own saving is one free assessment away.",
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
    used: "The space your files take, as the VM shows it. How to check it: [on an Azure VM](/learn/azure-vm-disk-usage) or [on an EBS volume](/learn/check-ebs-volume-usage).",
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
  /** The h3 over each cloud's price table in the fold, named for its search (owner, 1 Nov 2026; the plan sheet, 2 Nov). */
  tableHeadings: {
    azure: "Azure virtual machine pricing for AKS nodes, per month",
    aws: "AWS EC2 pricing for EKS nodes, per month",
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
  /** The h3 over each price table in the fold, named for its search (owner, 1 Nov 2026). */
  tableHeadings: {
    "premium-ssd": "Azure Premium SSD pricing by tier",
    "standard-ssd": "Azure Standard SSD pricing by tier",
    ebs: "Amazon EBS pricing: gp3 and gp2 per GB-month",
  },
} as const;
