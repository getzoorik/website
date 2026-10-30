import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/premium-ssd-v2-vs-premium-ssd/1";

export const article: Article = {
  slug: "premium-ssd-v2-vs-premium-ssd",
  title: "Premium SSD v2 vs Premium SSD: which costs less",
  meta: "Premium SSD v2 vs Premium SSD: size tiers against per-GiB billing, worked East US list prices, when v2 costs less, when Premium SSD fits, and Ultra Disk.",
  h1: "Premium SSD v2 vs Premium SSD: which one costs less?",
  deck: "Fixed size tiers against capacity, IOPS and throughput billed apart, worked through at East US list prices.",
  card: "How Premium SSD and Premium SSD v2 bill, when v2 costs less for the same data, and where Ultra Disk fits.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Azure block storage",
  versus: ["Premium SSD v2", "Premium SSD"],
  published: "2026-11-07",
  updated: "2026-11-07",
  author: "sheldon",
  short:
    "In the Premium SSD v2 vs Premium SSD choice, v2 usually costs less for the same data. Premium SSD bills a size tier: a 600\u00a0GiB disk pays for a 1,024\u00a0GiB P30, while v2 bills each GiB and includes 3,000\u00a0IOPS (input/output operations per second) and 125\u00a0MB/s. At East US list prices in October 2026, 512\u00a0GiB costs $73.22 a month on Premium SSD, $41.11 on v2. Premium SSD still covers OS disks, host caching and zone redundancy.",
  sections: [
    {
      id: "how-premium-ssd-and-premium-ssd-v2",
      title: "How Premium SSD and Premium SSD v2 bill",
      blocks: [
        {
          kind: "p",
          text: "Microsoft’s docs list five managed disk types, and “Premium SSD v1” isn’t one of them. The older type is simply Premium SSD, so Azure Premium SSD v2 vs v1 is this same comparison.",
        },
        {
          kind: "p",
          text: [
            "Premium SSD is billed by size tier. Each tier, P1 to P80, is a fixed size from 4\u00a0GiB to 32,767\u00a0GiB with fixed performance to match. A P20 (512\u00a0GiB) gets 2,300\u00a0IOPS and 150\u00a0MB/s whether your workload uses them or not. Azure rounds the size you provision up to the nearest tier and bills that tier, so a 600\u00a0GiB Premium SSD is billed as a P30, the 1,024\u00a0GiB tier. A ",
            { a: "higher performance tier", href: "/learn/azure-disk-performance-tiers" },
            " raises the disk’s baseline IOPS and throughput, at that tier’s fixed price.",
          ],
        },
        {
          kind: "p",
          text: "Premium SSD v2 has no tiers. You choose capacity from 1\u00a0GiB to 64\u00a0TiB in 1\u00a0GiB steps, then set IOPS and throughput on their own. Every disk includes 3,000\u00a0IOPS and 125\u00a0MB/s free of charge. Going above either raises the price. Past 6\u00a0GiB, the IOPS ceiling grows by 500 per GiB to a maximum of 80,000, while throughput can be set as high as 0.25\u00a0MB/s per provisioned IOPS, to a maximum of 2,000\u00a0MB/s. You can change a disk’s performance four times in 24\u00a0hours, and creating it counts as one of the four.",
        },
        { kind: "diagram", figure: figure1 },
        {
          kind: "p",
          text: "Two price features exist on the Premium SSD side only. Disk reservations give a one-year discount on P30 to P80, and Microsoft lists Premium SSD v2 among the disks they don’t cover. Bursting is the other. P20 and smaller disks can burst to 3,500\u00a0IOPS and 170\u00a0MB/s for up to 30\u00a0minutes, and only on-demand bursting, which you enable yourself on disks larger than 512\u00a0GiB, adds a flat enablement fee plus burst transaction charges. Premium SSD v2 doesn’t burst, and Microsoft’s conversion guide has you turn bursting off before a disk moves to v2.",
        },
      ],
    },
    {
      id: "premium-ssd-v2-vs-premium-ssd-pricing",
      title: "Premium SSD v2 vs Premium SSD pricing, worked through",
      blocks: [
        {
          kind: "p",
          text: "Every Azure Premium SSD vs Premium SSD v2 pricing figure below is a pay-as-you-go list price for East US with locally redundant storage (LRS), from Microsoft’s Azure Retail Prices API in October 2026. Prices differ by region and change over time, so check yours on the managed disks pricing page.",
        },
        {
          kind: "p",
          text: "In East US, Premium SSD v2 costs $0.00011 per GiB per hour, $0.000007 per IOPS per hour above 3,000, and $0.000055 per MB/s per hour above 125\u00a0MB/s. Over a 730-hour month, that’s $0.0803 per GiB, about half a cent per extra IOPS and about 4 cents for each extra MB/s. Per GiB, a full Premium SSD tier costs between $0.110 (P70 and P80) and $0.165 (P4) a month.",
        },
        { kind: "p", text: "Four cases show how those rates play out:" },
        {
          kind: "ul",
          items: [
            "A single 512\u00a0GiB P20 costs $73.22 a month for 2,300\u00a0IOPS and 150\u00a0MB/s. A 512\u00a0GiB v2\u00a0disk costs $41.11 at its included 3,000\u00a0IOPS and 125\u00a0MB/s, or $42.12 with throughput raised to 150\u00a0MB/s, which is 42% less for more IOPS.",
            "Four 512\u00a0GiB P20 data disks cost $292.88 a month, and the same 2,048\u00a0GiB on v2 costs $164.45 at the included performance, 44% less.",
            "A disk that needs 600\u00a0GiB is billed as a P30 on Premium SSD: $135.17 a month. On v2, 600\u00a0GiB costs $48.18. Add the P30’s 5,000\u00a0IOPS and 200\u00a0MB/s and it’s $61.41, still 55% less.",
            "A full P80, the largest tier, costs $3,604.11 a month for 32,767\u00a0GiB, 20,000\u00a0IOPS and 900\u00a0MB/s. The same size and performance on v2 costs $2,749.18, 24% less.",
          ],
        },
        {
          kind: "p",
          text: "The gap is widest where Premium SSD rounds up and narrowest on big disks that use their whole tier. Bursts don’t change that: holding a P20’s burst level of 3,500\u00a0IOPS and 170\u00a0MB/s all month on a 512\u00a0GiB v2\u00a0disk costs $45.48, still 38% under the P20.",
        },
        {
          kind: "p",
          text: "Reservations narrow it a little. The Retail Prices API lists a one-year P30 reservation in East US at $1,541 for the term, about 5% under twelve months at the pay-as-you-go rate, while 1,024\u00a0GiB of v2 with the P30’s 5,000\u00a0IOPS and 200\u00a0MB/s comes to $1,145.50 a year with no commitment. Unused reserved capacity doesn’t carry over, so count the reservations you hold before you convert.",
        },
      ],
    },
    {
      id: "when-premium-ssd-v2-costs-less-for",
      title: "When Premium SSD v2 costs less for the same data",
      blocks: [
        {
          kind: "p",
          text: "Microsoft’s own summary is that Premium SSD v2 offers higher performance than Premium SSD “while also generally being less costly.” Its capacity rate sits below every full Premium SSD tier and never rounds up, while the free 3,000\u00a0IOPS already exceed the baseline of every tier up to P20. On v2 you pay for extra IOPS and throughput only while you’ve raised them.",
        },
        {
          kind: "p",
          text: "Growth shows the difference most. A Premium SSD that outgrows 512\u00a0GiB jumps from a P20 at $73.22 to a P30 at $135.17. A v2\u00a0disk grows by the GiB.",
        },
        {
          kind: "p",
          text: "Moving an existing data disk to v2 is a disk type change, and a one-way one:",
        },
        {
          kind: "ul",
          items: [
            "Microsoft’s conversion guide says to schedule it in a maintenance window, “because conversion requires a restart of the virtual machine (VM)”. Disk performance is degraded until the conversion completes.",
            "The disk can switch directly only to a v2\u00a0disk with a 512 sector size, and host caching, bursting and double encryption must be off first.",
            "A shared disk must be detached from every VM, Azure Site Recovery must be disabled on the disk, and a VM with Azure Backup needs the Enhanced Backup policy. Azure Backup then takes a full snapshot of the new disk, which is billed.",
            "There’s no direct switch from v2 to another type, so going back means migrating with snapshots.",
          ],
        },
      ],
    },
    {
      id: "when-premium-ssd-is-still-the-right",
      title: "When Premium SSD is still the right disk",
      blocks: [
        {
          kind: "p",
          text: "In the Premium SSD vs SSD v2 decision, the list price rarely points to Premium SSD. The limits of v2 decide it.",
        },
        {
          kind: "table",
          columns: [
            { label: "What you decide on", width: "20%" },
            { label: "Premium SSD", width: "41%" },
            { label: "Premium SSD v2", width: "39%" },
          ],
          rows: [
            [
              "What the bill counts",
              "The size tier the disk rounds up to, P1 to P80 (4\u00a0GiB to 32,767\u00a0GiB)",
              "Each GiB (1\u00a0GiB to 64\u00a0TiB), plus IOPS above 3,000 and throughput above 125\u00a0MB/s",
            ],
            [
              "Performance",
              "Set by the tier, up to 20,000\u00a0IOPS and 900\u00a0MB/s",
              "Set by you, up to 80,000\u00a0IOPS and 2,000\u00a0MB/s",
            ],
            [
              "512\u00a0GiB in East US, Oct 2026",
              "$73.22 a month (P20)",
              "$41.11 a month at 3,000\u00a0IOPS and 125\u00a0MB/s",
            ],
            ["OS disk", "Yes", "No, data disks only"],
            ["Host caching", "Yes", "Not supported"],
            ["Zone-redundant storage (ZRS)", "Available", "Not supported"],
            [
              "Which VMs it attaches to",
              "VM sizes that support Premium storage",
              "VM sizes that support Premium storage, and only zonal VMs in most regions with availability zones",
            ],
            [
              "Bursting",
              "P20 and smaller burst for up to 30\u00a0minutes, larger disks with on-demand bursting",
              "None",
            ],
            ["Reservations", "One year, P30 to P80", "Not available"],
            [
              "Changing type later",
              "Switch directly to Standard SSD, Standard HDD or Premium SSD v2",
              "Migrate with snapshots",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "An OS disk can’t be v2, and neither can a disk used with Azure Compute Gallery. A workload tuned around host caching loses it. ",
            { a: "ZRS", href: "/learn/azure-disk-lrs-vs-zrs" },
            ", which replicates a disk synchronously across three availability zones, has no v2 option. And in most regions with availability zones, v2 attaches only to zonal VMs, so a VM deployed without a zone can’t take it there. East US is one of those regions: it’s on the zonal list and not the nonzonal one.",
          ],
        },
        {
          kind: "p",
          text: "Region coverage changes, so check yours before you plan. This Azure CLI command from Microsoft’s deploy guide lists the regions and zones that offer Premium SSD v2 in your subscription:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "az vm list-skus --resource-type disks --query \"[?name=='PremiumV2_LRS'].{Region:locationInfo[0].location, Zones:locationInfo[0].zones}\"",
        },
      ],
    },
    {
      id: "azure-ultra-disk-vs-premium-ssd-v2",
      title: "Azure Ultra Disk vs Premium SSD v2",
      blocks: [
        {
          kind: "p",
          text: "Ultra Disk bills the way v2 does: capacity per GiB, plus the IOPS and throughput you set. Its ceiling is far higher, up to 400,000\u00a0IOPS and 10,000\u00a0MB/s per disk against v2’s 80,000\u00a0IOPS and 2,000\u00a0MB/s, at sizes from 4\u00a0GiB to 64\u00a0TiB. Microsoft aims it at I/O-intensive workloads such as SAP HANA, top-tier databases and transaction-heavy workloads.",
        },
        {
          kind: "p",
          text: "Every unit costs more. In East US, Ultra Disk lists at $0.000164 per GiB per hour, about 1.5 times v2’s capacity rate, and $0.000068 per IOPS and $0.000479 per MB/s per hour, about 10 times v2’s IOPS rate and 9 times its throughput rate. A VM with Ultra Disk compatibility turned on and no Ultra Disk attached also pays a reservation charge per vCPU, $0.006 per vCPU per hour in East US.",
        },
        {
          kind: "p",
          text: "Ultra Disk shares v2’s main limits: data disks only, LRS only and no disk caching. It also doesn’t support availability sets. Performance changes are capped at four in 24\u00a0hours, as on v2. A change can take up to an hour to apply. There’s no direct switch from Ultra Disk to v2 either, so that move also takes a snapshot migration.",
        },
        {
          kind: "p",
          text: "Choose Ultra Disk when one disk needs more than v2’s 80,000\u00a0IOPS or 2,000\u00a0MB/s. Below that ceiling, v2 bills the same three meters at a fraction of Ultra Disk’s rates, with the first 3,000\u00a0IOPS and 125\u00a0MB/s free.",
        },
      ],
    },
    {
      id: "which-disk-type-amoeba-uses-for-a",
      title: "Which disk type Amoeba uses for a pool",
      blocks: [
        {
          kind: "p",
          text: [
            "Disk type sets the rate, and the provisioned size sets how many GiB you pay it on. Azure lets a managed disk grow but never shrink, as ",
            {
              a: "Can you shrink an Azure managed disk?",
              href: "/learn/shrink-azure-managed-disk",
            },
            " explains. Amoeba, Zoorik’s block storage optimization for Azure managed disks and Amazon EBS, works on the size. It moves a VM’s data disks onto one pool sized to the data, holds it 80% to 90% full by default, and rightsizes it as the data grows and shrinks.",
          ],
        },
        {
          kind: "p",
          text: "Each VM gets one pool. The pool is Premium SSD v2 where the VM’s region and zone offer it, and Premium SSD otherwise, whatever type the data sits on today. So data on Standard SSD, Standard HDD or Ultra Disk moves to one of those two types as well. The pool starts with at least 2\u00a0disks of equal size. Pool disks are always locally redundant, so data on ZRS disks loses its zone redundancy in the move. Amoeba sizes the pool from the highest use of the last 7\u00a0days, inside its target band, with room for the largest recent 15-minute rise and at least 10\u00a0GiB free.",
        },
        {
          kind: "p",
          text: [
            "The worked example on the ",
            { a: "Amoeba page", href: "/amoeba" },
            " shows the size side: a VM with four 512\u00a0GiB Premium SSD data disks, 2,048\u00a0GiB in all, holding 1,000\u00a0GiB of data. More than half of what is billed is empty.",
          ],
        },
        {
          kind: "p",
          text: [
            "On Azure, Amoeba prices disks from the Azure Retail Prices API for the disk type and region, with a 730-hour month, the same source as the figures in this article. The ",
            { a: "free block storage assessment", href: "/assessment?p=amoeba" },
            " writes one PDF and sends nothing to Zoorik. For the other levers on a disk bill, see ",
            { a: "Azure disk cost optimization", href: "/learn/azure-disk-cost-optimization" },
            ". Amoeba is in early access.",
          ],
        },
      ],
    },
  ],
  help: {
    product: "amoeba",
    text: "Amoeba moves a VM’s data disks onto one pool sized to your data, then rightsizes it autonomously, without any downtime after the one switch, one disk at a time. We estimate it takes 50–60% off block storage cost. It is an estimated range, not a promise. The free assessment works out your own figure.",
    links: [
      { label: "Block storage cost optimization with Amoeba", href: "/amoeba" },
      { label: "Estimate your saving", href: "/assessment?p=amoeba" },
    ],
  },
  sources: [
    {
      publisher: "Microsoft Learn",
      title: "“Select a disk type for Azure IaaS VMs”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-types",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Managed disk bursting”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disk-bursting",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Deploy a Premium SSD v2 managed disk”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-deploy-premium-v2",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Convert managed disks storage between different disk types”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-convert-types",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Redundancy options for Azure managed disks”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-redundancy",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Optimize costs for Azure Disk Storage with reservations”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-reserved-capacity",
    },
    {
      publisher: "Microsoft Azure",
      title: "“Pricing - Managed Disks”",
      url: "https://azure.microsoft.com/en-us/pricing/details/managed-disks/",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Azure Retail Prices REST API overview”",
      url: "https://learn.microsoft.com/en-us/rest/api/cost-management/retail-prices/azure-retail-prices",
    },
  ],
  related: [
    {
      title: "Azure disk cost optimization: stop paying for empty space",
      where: "Learn",
      href: "/learn/azure-disk-cost-optimization",
    },
    {
      title: "Premium SSD vs Standard SSD on Azure: what you pay for",
      where: "Learn",
      href: "/learn/premium-ssd-vs-standard-ssd-azure",
    },
    {
      title: "Azure disk IOPS vs throughput: what limits your disks",
      where: "Learn",
      href: "/learn/azure-disk-iops-vs-throughput",
    },
    {
      title: "Azure disk LRS vs ZRS: what zone redundancy costs",
      where: "Learn",
      href: "/learn/azure-disk-lrs-vs-zrs",
    },
    {
      title: "Can you shrink an Azure managed disk?",
      where: "Learn",
      href: "/learn/shrink-azure-managed-disk",
    },
  ],
};
