import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/premium-ssd-v2-vs-premium-ssd/1";
import { figure as figure2 } from "@/features/learn/figures/premium-ssd-v2-vs-premium-ssd/2";
import { figure as figure3 } from "@/features/learn/figures/premium-ssd-v2-vs-premium-ssd/3";

export const article: Article = {
  slug: "premium-ssd-v2-vs-premium-ssd",
  title: "Premium SSD v2 vs Premium SSD: which costs less",
  meta: "Azure Premium SSD v2 vs Premium SSD: how each one charges, four cases at East US list prices, and when Premium SSD or Ultra Disk fits better.",
  h1: "Premium SSD v2 vs Premium SSD",
  deck: "How each one charges, four priced cases, and when Premium SSD or Ultra Disk is the better disk.",
  card: "How Premium SSD and Premium SSD v2 charge, when v2 costs less, and where Ultra Disk fits.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Azure block storage",
  versus: ["Premium SSD v2", "Premium SSD"],
  published: "2026-11-01",
  updated: "2026-11-03",
  author: "sheldon",
  cover: "/learn-covers/zoorik-learn-premium-ssd-v2-vs-premium-ssd-1200x630.webp",
  coverAlt:
    "Premium SSD v2 vs Premium SSD: Premium SSD’s size tier leaves space paid for, unused, while v2 ends at the data",
  short:
    "Premium SSD v2 usually costs less for the same data, because it charges per GiB instead of per size tier. At East US list prices in October 2026, 512 GiB costs $41.11 a month on v2 and $73.22 on Premium SSD. Premium SSD still fits OS disks, host caching and zone-redundant storage.",
  sections: [
    {
      id: "premium-ssd-charges-a-size-tier-and",
      title: "How each one charges",
      blocks: [
        {
          kind: "p",
          text: "Picture a data disk that needs 600 GiB. Premium SSD charges it as a P30, the 1,024 GiB tier, at $135.17 a month in East US. Premium SSD v2 charges for the 600 GiB alone: $48.18 a month.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: [
            "Each ",
            { a: "Premium SSD", href: "/learn/glossary/azure-premium-ssd" },
            " tier, P1 to P80, is a fixed size from 4 GiB to 32,767 GiB. Azure rounds the provisioned size up to the next ",
            { a: "size tier", href: "/learn/glossary/azure-disk-sizes" },
            " and charges that tier’s price.",
          ],
        },
        {
          kind: "p",
          text: [
            "Each tier also fixes the performance. A P20 (512 GiB) gets 2,300 ",
            { a: "IOPS", href: "/learn/glossary/iops" },
            " (input/output operations per second) and 150 MB/s, whether your workload uses them or not. For more, you move to a larger tier or set a ",
            { a: "higher performance tier", href: "/learn/azure-disk-performance-tiers" },
            ", each at a fixed price.",
          ],
        },
        {
          kind: "p",
          text: [
            "Premium SSD v2 has no tiers. You set capacity from 1 GiB to 64 TiB in 1 GiB steps, then set IOPS and ",
            { a: "throughput", href: "/learn/glossary/disk-throughput" },
            " on their own.",
          ],
        },
        {
          kind: "p",
          text: "Every v2 disk includes 3,000 IOPS and 125 MB/s at no charge. Going above either adds to the price. You can change a v2 disk’s performance four times in 24 hours, and creating the disk counts as one.",
        },
        {
          kind: "callout",
          label: "For engineers",
          text: "Past 6 GiB, v2’s IOPS ceiling grows by 500 per GiB, to a maximum of 80,000. Throughput can reach 0.25 MB/s per provisioned IOPS, up to 2,000 MB/s.",
        },
        {
          kind: "p",
          text: "There is no “Premium SSD v1”. Microsoft lists five managed disk types, and the older one is simply Premium SSD. So Premium SSD v2 vs v1 is this same comparison.",
        },
      ],
    },
    {
      id: "premium-ssd-v2-vs-premium-ssd",
      title: "Pricing compared",
      blocks: [
        {
          kind: "p",
          text: "All prices here are pay-as-you-go list prices for East US with locally redundant storage (LRS), from Microsoft’s Azure Retail Prices API in October 2026.",
        },
        {
          kind: "p",
          text: [
            "Prices differ by region and change over time, so check yours on the managed disks pricing page. The ",
            { a: "Azure disk pricing calculator", href: "/ebs-and-azure-disk-pricing" },
            " prices a Premium SSD from its size and shows what its empty space costs.",
          ],
        },
        {
          kind: "h3",
          id: "what-v2-charges-for-each-meter",
          title: "What v2 charges",
        },
        { kind: "p", text: "Premium SSD v2 charges three meters by the hour:" },
        {
          kind: "ul",
          items: [
            [{ b: "Capacity:" }, " $0.00011 per GiB."],
            [{ b: "IOPS:" }, " $0.000007 per IOPS above 3,000."],
            [{ b: "Throughput:" }, " $0.000055 per MB/s above 125 MB/s."],
          ],
        },
        {
          kind: "p",
          text: "Over a 730-hour month, that’s $0.0803 per GiB, about half a cent per extra IOPS and 4 cents per extra MB/s.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "The 600 GiB v2 disk, set to the P30’s 5,000 IOPS and 200 MB/s, costs $61.41 a month. That’s 55% less than the P30’s $135.17.",
        },
        { kind: "p", text: "The three meters add up like this:" },
        {
          kind: "ul",
          items: [
            [{ b: "Capacity:" }, " 600 × $0.0803 = $48.18."],
            [{ b: "IOPS:" }, " 2,000 extra × $0.000007 × 730 = $10.22."],
            [{ b: "Throughput:" }, " 75 extra MB/s × $0.000055 × 730 = $3.01."],
          ],
        },
        { kind: "p", text: "Three more cases:" },
        {
          kind: "ul",
          items: [
            [
              { b: "One 512 GiB disk:" },
              " a P20 costs $73.22 a month for 2,300 IOPS and 150 MB/s. A 512 GiB v2 disk costs $41.11 at its included 3,000 IOPS and 125 MB/s. Raised to 150 MB/s, it costs $42.12: 42% less, with more IOPS.",
            ],
            [
              { b: "Four 512 GiB data disks:" },
              " four P20s cost $292.88 a month. The same 2,048 GiB on v2 costs $164.45 at the included performance, 44% less.",
            ],
            [
              { b: "The largest tier:" },
              " a full P80 costs $3,604.11 a month for 32,767 GiB, 20,000 IOPS and 900 MB/s. A v2 disk with the same size and performance costs $2,749.18, 24% less.",
            ],
          ],
        },
        {
          kind: "p",
          text: "The gap is widest where Premium SSD rounds up, and narrowest on large disks that use their whole tier.",
        },
        { kind: "svg", figure: figure2 },
        { kind: "h3", id: "why-v2-costs-less-per-gib", title: "Why v2 costs less" },
        {
          kind: "p",
          text: "The v2 rate of $0.0803 per GiB a month is below every full Premium SSD tier. Those cost from $0.110 (P70 and P80) to $0.165 (P4) per GiB. And v2 never rounds up.",
        },
        {
          kind: "p",
          text: "A v2 disk’s free 3,000 IOPS already exceed the baseline of every tier up to P20. You pay for extra IOPS and throughput only while you’ve raised them. Microsoft’s own summary is that Premium SSD v2 offers higher performance than Premium SSD “while also generally being less costly.”",
        },
        {
          kind: "p",
          text: "Growth shows the difference most. A Premium SSD that outgrows 512 GiB jumps from a P20 at $73.22 to a P30 at $135.17. A v2 disk grows by the GiB.",
        },
      ],
    },
    {
      id: "bursting-and-reservations-narrow-the-gap-only",
      title: "Bursting and reservations",
      blocks: [
        {
          kind: "p",
          text: "Both are Premium SSD features that v2 lacks. Neither closes the gap.",
        },
        {
          kind: "p",
          text: "Credit-based bursting is free and best effort. It lets P20 and smaller disks reach 3,500 IOPS and 170 MB/s for up to 30 minutes. A 512 GiB v2 disk held at that level all month costs $45.48, still 38% under the P20.",
        },
        {
          kind: "p",
          text: "On-demand bursting, which you enable on disks larger than 512 GiB, adds a flat enablement fee plus charges for burst transactions.",
        },
        {
          kind: "p",
          text: [
            { a: "Azure disk reservations", href: "/learn/azure-disk-reservations" },
            " give a one-year discount on P30 to P80. Microsoft lists Premium SSD v2 among the disks they don’t cover.",
          ],
        },
        {
          kind: "p",
          text: "The Retail Prices API lists a one-year P30 reservation at $1,541 for the term. That’s about 5% under twelve months at the pay-as-you-go rate. On v2, 1,024 GiB with the P30’s 5,000 IOPS and 200 MB/s costs $1,145.50 a year, with no commitment.",
        },
      ],
    },
    {
      id: "premium-ssd-is-still-the-right-disk",
      title: "When Premium SSD fits",
      blocks: [
        {
          kind: "p",
          text: "Premium SSD rarely wins on list price. What v2 can’t do decides it.",
        },
        {
          kind: "table",
          columns: [
            { label: "What you decide on", width: "19%" },
            { label: "Premium SSD", width: "41%" },
            { label: "Premium SSD v2", width: "40%" },
          ],
          rows: [
            [
              "What you pay for",
              "The size tier the disk rounds up to, P1 to P80 (4 GiB to 32,767 GiB)",
              "Each GiB (1 GiB to 64 TiB), plus IOPS above 3,000 and throughput above 125 MB/s",
            ],
            [
              "Performance",
              "Set by the tier, up to 20,000 IOPS and 900 MB/s",
              "Set by you, up to 80,000 IOPS and 2,000 MB/s",
            ],
            [
              "512 GiB in East US, Oct 2026",
              "$73.22 a month (P20)",
              "$41.11 a month at 3,000 IOPS and 125 MB/s",
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
              "P20 and smaller: free, up to 30 minutes. Larger disks: on-demand, charged",
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
            "A disk used with Azure Compute Gallery can’t be v2 either. ",
            { a: "ZRS", href: "/learn/azure-disk-lrs-vs-zrs" },
            " replicates a disk synchronously across three availability zones.",
          ],
        },
        {
          kind: "p",
          text: "In East US, v2 attaches only to zonal virtual machines (VMs). So a VM deployed there without a zone can’t use it.",
        },
        {
          kind: "p",
          text: "Region support changes, so check yours before you plan. This Azure CLI command, from Microsoft’s deploy guide, lists the regions and zones that offer Premium SSD v2 in your subscription:",
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
      title: "Ultra Disk vs Premium SSD v2",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Ultra Disk", href: "/learn/glossary/azure-ultra-disk" },
            " charges the way v2 does: capacity per GiB, plus the IOPS and throughput you set. Its ceiling is far higher: 400,000 IOPS and 10,000 MB/s per disk, against v2’s 80,000 IOPS and 2,000 MB/s. Sizes run from 4 GiB to 64 TiB. Microsoft aims it at I/O-intensive workloads such as SAP HANA, top-tier databases and transaction-heavy workloads.",
          ],
        },
        {
          kind: "p",
          text: "Every unit costs more. In East US, Ultra Disk lists at these hourly rates:",
        },
        {
          kind: "ul",
          items: [
            [{ b: "Capacity:" }, " $0.000164 per GiB, about 1.5 times v2’s."],
            [{ b: "IOPS:" }, " $0.000068 per IOPS, about 10 times v2’s."],
            [{ b: "Throughput:" }, " $0.000479 per MB/s, about 9 times v2’s."],
          ],
        },
        {
          kind: "p",
          text: "A VM with Ultra Disk compatibility turned on and no Ultra Disk attached also pays a reservation charge of $0.006 per vCPU per hour.",
        },
        {
          kind: "p",
          text: "Ultra Disk shares v2’s main limits: data disks only, no Azure Compute Gallery, LRS only and no disk caching. It doesn’t support availability sets either.",
        },
        {
          kind: "p",
          text: "As on v2, performance changes are capped at four in 24 hours, and a change can take up to an hour to apply. There’s no direct switch from Ultra Disk to v2, so that move also takes a snapshot migration.",
        },
        {
          kind: "callout",
          label: "Rule of thumb",
          text: "Default to v2 for data disks. Choose Ultra Disk only when one disk needs more than v2’s 80,000 IOPS or 2,000 MB/s.",
        },
        { kind: "svg", figure: figure3 },
      ],
    },
    {
      id: "moving-a-data-disk-to-v2-takes",
      title: "Converting to v2",
      blocks: [
        {
          kind: "p",
          text: "Microsoft’s conversion guide says the change needs a restart of the VM, so plan it for a maintenance window. Disk performance is degraded until the conversion completes. Check these first:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Settings:" },
              " the disk can switch directly only to a v2 disk with a 512-byte sector size. Turn off host caching, bursting and double encryption first.",
            ],
            [{ b: "Shared disks:" }, " detach the disk from every VM."],
            [{ b: "Site Recovery:" }, " disable Azure Site Recovery on the disk."],
            [
              { b: "Backup:" },
              " a VM with Azure Backup needs the Enhanced Backup policy. Azure Backup then takes a full snapshot of the new disk, and that snapshot is charged.",
            ],
            [
              { b: "Reservations:" },
              " they don’t cover v2, and unused reserved capacity doesn’t carry over. Count the reservations you hold before you convert.",
            ],
            [
              { b: "The way back:" },
              " there’s no direct switch from v2 to another type. Going back means migrating with snapshots.",
            ],
          ],
        },
      ],
    },
    {
      id: "which-disk-type-amoeba-uses-for-a",
      title: "Where Amoeba fits",
      blocks: [
        {
          kind: "p",
          text: [
            "Disk type sets the rate, and the provisioned size sets how many GiB you pay it on. Azure lets a managed disk grow but never shrink, as ",
            {
              a: "Can you shrink an Azure managed disk?",
              href: "/learn/shrink-azure-managed-disk",
            },
            " explains.",
          ],
        },
        {
          kind: "p",
          text: "Amoeba, Zoorik’s block storage optimization, works on the size. It moves a VM’s data disks onto one btrfs pool sized to your data, with room to grow.",
        },
        {
          kind: "p",
          text: "Then it rightsizes the pool without any downtime. It grows the pool before it fills, and sooner when data arrives fast. When your data goes down and stays down, it shrinks the pool one disk at a time. So you pay for close to what you use.",
        },
        {
          kind: "p",
          text: "On Azure, the pool uses Premium SSD v2 where your VM’s region and zone offer it, and Premium SSD otherwise. Data on Standard SSD, Standard HDD or Ultra Disk moves to one of those two types.",
        },
        {
          kind: "p",
          text: "Pool disks are always locally redundant. Data on ZRS disks loses its zone redundancy in the move.",
        },
        {
          kind: "p",
          text: [
            "The worked example on the ",
            { a: "Amoeba page", href: "/amoeba" },
            " has four 512 GiB Premium SSD data disks, 2,048 GiB in all. They hold 1,000 GiB of data. More than half the space paid for is empty.",
          ],
        },
        {
          kind: "p",
          text: [
            {
              a: "Azure managed disk cost optimization",
              href: "/azure-managed-disk-cost-optimization",
            },
            " covers Amoeba on Azure in full. Amoeba is in early access.",
          ],
        },
      ],
    },
  ],
  help: {
    product: "amoeba",
    text: "Amoeba moves a VM’s data disks onto one pool sized to your data, then rightsizes it autonomously, without any downtime, one disk at a time. We estimate it takes 50–60% off block storage cost. It is an estimated range, not a promise. The free assessment works out your own figure.",
    links: [
      { label: "Block storage optimization with Amoeba", href: "/amoeba" },
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
      title: "Azure disk types",
      where: "Learn",
      href: "/learn/azure-managed-disk-types",
    },
    {
      title: "Azure disk reservations: are they worth it?",
      where: "Learn",
      href: "/learn/azure-disk-reservations",
    },
    {
      title: "Azure Premium SSD vs Standard SSD",
      where: "Learn",
      href: "/learn/premium-ssd-vs-standard-ssd-azure",
    },
    {
      title: "Azure disk IOPS vs throughput",
      where: "Learn",
      href: "/learn/azure-disk-iops-vs-throughput",
    },
    {
      title: "Azure LRS vs ZRS for managed disks",
      where: "Learn",
      href: "/learn/azure-disk-lrs-vs-zrs",
    },
  ],
};
