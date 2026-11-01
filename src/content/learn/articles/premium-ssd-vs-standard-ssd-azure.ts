import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/premium-ssd-vs-standard-ssd-azure/1";
import { figure as figure2 } from "@/features/learn/figures/premium-ssd-vs-standard-ssd-azure/2";

export const article: Article = {
  slug: "premium-ssd-vs-standard-ssd-azure",
  title: "Premium SSD vs Standard SSD on Azure: cost and IOPS",
  meta: "Premium SSD vs Standard SSD on Azure, tier by tier: IOPS, throughput, East US prices, when Standard SSD transactions cost more, and what a switch gives up.",
  h1: "Premium SSD vs Standard SSD on Azure: what you pay for",
  deck: "Both charge by size tier. What the higher price buys, when transactions close the gap, and what a switch gives up.",
  card: "Premium SSD and Standard SSD tier by tier: IOPS, East US prices, transaction charges and what a switch gives up.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Azure block storage",
  versus: ["Premium SSD", "Standard SSD"],
  published: "2026-11-01",
  updated: "2026-11-01",
  author: "udit",
  cover: "/learn-covers/zoorik-learn-premium-ssd-vs-standard-ssd-azure-1200x630.webp",
  coverAlt: "Premium SSD vs Standard SSD: Standard SSD for light I/O, Premium SSD for a busy disk",
  short:
    "Premium SSD vs Standard SSD on Azure trades price for IOPS (input/output operations per second), and Standard SSD, which adds transaction charges, suits light I/O. A 512\u00a0GiB Premium SSD costs $73.22 a month for 2,300\u00a0IOPS, a Standard SSD $38.40 for up to 500 (East US, October 2026).",
  sections: [
    {
      id: "premium-ssd-vs-standard-ssd-azure",
      title: "Premium SSD vs Standard SSD pricing on Azure: both charge for the whole tier",
      blocks: [
        {
          kind: "p",
          text: "Picture a 512\u00a0GiB data disk behind a web server, holding 100\u00a0GiB. As a P20 or an E20, you pay for all 512\u00a0GiB.",
        },
        {
          kind: "p",
          text: "The E20’s tier costs $34.82 a month less. But its transaction charges overtake that gap once the disk averages more than about 66 transactions a second.",
        },
        {
          kind: "h3",
          id: "both-types-charge-by-size-tier",
          title: "Both types charge by size tier",
        },
        {
          kind: "p",
          text: [
            { a: "Premium SSD", href: "/learn/glossary/azure-premium-ssd" },
            " runs from P1 to P80, and Standard SSD from E1 to E80. Each ",
            { a: "size tier", href: "/learn/glossary/azure-disk-sizes" },
            " is a fixed size between 4\u00a0GiB and 32,767\u00a0GiB.",
          ],
        },
        {
          kind: "p",
          text: "Azure rounds the size you provision up to the next tier and charges for that tier, prorated by the hour. So a 200\u00a0GiB Standard SSD is charged as an E15, the 256\u00a0GiB tier. Microsoft’s pricing page adds that the rate is the same however much of the disk you use.",
        },
        {
          kind: "h3",
          id: "standard-ssd-also-charges-per-transaction",
          title: "Standard SSD also charges per transaction",
        },
        {
          kind: "p",
          text: "Microsoft’s guide to disk charges is direct about Premium SSD: “Unless you enable on-demand bursting, there are no transaction costs for Premium SSD.”",
        },
        {
          kind: "p",
          text: "Standard SSD charges for transactions, and any operation counts: reads, writes and deletes. Each I/O of up to 256\u00a0KiB counts once, and a larger one counts as several.",
        },
        {
          kind: "p",
          text: "In East US the rate is $0.002 per 10,000 transactions on locally redundant storage (LRS). Each tier caps the paid transactions per hour. Anything above the cap in that hour costs nothing.",
        },
        { kind: "h3", id: "east-us-prices-tier-by-tier", title: "East US prices, tier by tier" },
        {
          kind: "p",
          text: "The table gives East US pay-as-you-go prices for Premium SSD LRS vs Standard SSD LRS, the SKUs Premium_LRS and StandardSSD_LRS. Prices are from Microsoft’s managed disks pricing page in October 2026. Performance is what Microsoft publishes for each tier.",
        },
        {
          kind: "table",
          columns: [
            { label: "Size", width: "14%" },
            { label: "Premium SSD", width: "36%" },
            { label: "Standard SSD", width: "40%" },
            { label: "Standard SSD transactions, at most", width: "10%" },
          ],
          rows: [
            [
              "128\u00a0GiB",
              "P10: 500\u00a0IOPS, 100\u00a0MB/s, $19.71",
              "E10: up to 500\u00a0IOPS, 100\u00a0MB/s, $9.60",
              "$21.49 a month",
            ],
            [
              "256\u00a0GiB",
              "P15: 1,100\u00a0IOPS, 125\u00a0MB/s, $38.01",
              "E15: up to 500\u00a0IOPS, 100\u00a0MB/s, $19.20",
              "$40.00 a month",
            ],
            [
              "512\u00a0GiB",
              "P20: 2,300\u00a0IOPS, 150\u00a0MB/s, $73.22",
              "E20: up to 500\u00a0IOPS, 100\u00a0MB/s, $38.40",
              "$73.29 a month",
            ],
            [
              "1,024\u00a0GiB",
              "P30: 5,000\u00a0IOPS, 200\u00a0MB/s, $135.17",
              "E30: up to 500\u00a0IOPS, 100\u00a0MB/s, $76.80",
              "$121.06 a month",
            ],
            [
              "2,048\u00a0GiB",
              "P40: 7,500\u00a0IOPS, 250\u00a0MB/s, $259.05",
              "E40: up to 500\u00a0IOPS, 100\u00a0MB/s, $153.60",
              "$130.38 a month",
            ],
          ],
        },
        {
          kind: "p",
          text: "At these sizes Standard SSD lists at 49% to 59% of the Premium SSD price, before transactions. The last column is a disk at its hourly cap for every hour of a 730-hour month.",
        },
        {
          kind: "p",
          text: [
            "Zone-redundant storage (ZRS) costs more. A P20 ZRS lists at $109.81 and an E20 ZRS at $57.60, 1.5 times their LRS prices. ",
            { a: "Azure disk LRS vs ZRS", href: "/learn/azure-disk-lrs-vs-zrs" },
            " covers the difference.",
          ],
        },
        {
          kind: "p",
          text: [
            "Prices differ by region and change over time, so check yours on the managed disks pricing page. The ",
            { a: "Azure disk pricing calculator", href: "/ebs-and-azure-disk-pricing" },
            " shows what a disk costs a month at list price.",
          ],
        },
      ],
    },
    {
      id: "azure-standard-ssd-vs-premium-ssd-performance",
      title: "Azure Standard SSD vs Premium SSD performance: the IOPS gap grows with size",
      blocks: [
        {
          kind: "p",
          text: [
            "Premium SSD buys provisioned performance. Microsoft guarantees a Premium SSD’s capacity, ",
            { a: "IOPS", href: "/learn/glossary/iops" },
            " and throughput once it’s provisioned. It designs the disk to deliver single-digit millisecond latency and those targets 99.9% of the time.",
          ],
        },
        {
          kind: "p",
          text: "Standard SSD also targets single-digit milliseconds. But its IOPS and throughput are ceilings, met 99% of the time. Microsoft says actual figures can vary with traffic patterns.",
        },
        {
          kind: "p",
          text: "The IOPS gap opens with size: at 128\u00a0GiB the two match on paper, but above it Premium SSD climbs with size.",
        },
        {
          kind: "p",
          text: "Every Standard SSD from E1 to E50 (up to 4,096\u00a0GiB) stays at up to 500\u00a0IOPS and 100\u00a0MB/s. A P30 gives ten times the IOPS of an E30 of the same size.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "h3",
          id: "small-disks-bursts-and-performance-tiers",
          title: "Small disks, bursts and performance tiers",
        },
        {
          kind: "callout",
          label: "For engineers",
          text: "Below 128\u00a0GiB, Standard SSD has the higher ceiling. P1 to P4 provision 120\u00a0IOPS and a P6 240, against up to 500 on E1 to E6.",
        },
        {
          kind: "p",
          text: "Standard SSD’s base IOPS pass 500 only at E60, the 8,192\u00a0GiB tier, with up to 2,000. Performance plus, where enabled, takes an E30 to up to 1,500.",
        },
        {
          kind: "p",
          text: "Both types can burst for short peaks, for up to 30\u00a0minutes. Premium SSD P20 and smaller can burst to 3,500\u00a0IOPS and 170\u00a0MB/s. Standard SSD bursts to 600\u00a0IOPS and 150\u00a0MB/s on E20 and smaller, and to 1,000\u00a0IOPS and 250\u00a0MB/s on an E30.",
        },
        {
          kind: "p",
          text: "From P30 up, Premium SSD bursts only with on-demand bursting. You enable it and pay for it, with an hourly fee plus burst transactions.",
        },
        {
          kind: "p",
          text: [
            "Some Premium SSD sizes can select a higher performance tier without growing, and you pay for that tier until you change it back. A Standard SSD’s tier is set by its size. ",
            { a: "Azure disk performance tiers", href: "/learn/azure-disk-performance-tiers" },
            " covers when that’s worth it.",
          ],
        },
        { kind: "h3", id: "limits-outside-the-disk", title: "Limits outside the disk" },
        {
          kind: "p",
          text: [
            "A Premium SSD needs a VM size that supports Premium storage, while Standard SSD is available on all Azure VMs. The VM size also has its own IOPS and throughput caps, which ",
            { a: "Azure disk IOPS vs throughput", href: "/learn/azure-disk-iops-vs-throughput" },
            " explains.",
          ],
        },
        {
          kind: "p",
          text: [
            "A third option drops the tiers. Premium SSD v2 charges for each GiB, plus IOPS above 3,000 and throughput above 125\u00a0MB/s. ",
            { a: "Premium SSD v2 vs Premium SSD", href: "/learn/premium-ssd-v2-vs-premium-ssd" },
            " works through its prices.",
          ],
        },
      ],
    },
    {
      id: "a-busy-standard-ssd-costs-more-than",
      title: "A busy Standard SSD costs more than a Premium SSD of the same size",
      blocks: [
        {
          kind: "callout",
          label: "Worked example",
          text: "On the 512\u00a0GiB disk, the P20 costs $73.22 − $38.40 = $34.82 a month more than the E20. Over a 730-hour month, that’s $34.82 ÷ 730 = about $0.048 an hour.",
        },
        {
          kind: "p",
          text: "At $0.002 per 10,000 transactions, that pays for about 238,000 transactions an hour. That’s around 66 a second (238,000 ÷ 3,600). Average more than that over the month, and the E20 costs more than the P20.",
        },
        {
          kind: "p",
          text: "The E20 also gives less than a quarter of the P20’s IOPS. At its cap of 502,000 paid transactions an hour, the E20’s transactions come to $73.29 a month. So it costs $38.40 + $73.29 = $111.69, which is $38.47 more than the P20.",
        },
        { kind: "svg", figure: figure2 },
        { kind: "h3", id: "the-break-even-at-other-sizes", title: "The break-even at other sizes" },
        {
          kind: "p",
          text: "An E10 costs more than a P10 above about 69,000 transactions an hour (19 a second). An E30 costs more than a P30 above about 400,000 an hour (111 a second).",
        },
        {
          kind: "p",
          text: "At every size in the table above, a Standard SSD at its cap costs more than the Premium SSD of the same size.",
        },
        {
          kind: "h3",
          id: "how-to-count-a-disks-transactions",
          title: "How to count a disk’s transactions",
        },
        {
          kind: "p",
          text: "In your Azure charges, Standard SSD transactions appear on a Disk Operations meter beside the disk’s tier meter.",
        },
        {
          kind: "p",
          text: "For a disk that’s still Premium SSD, use the VM’s metrics in the Azure portal. Data Disk Read Operations/Sec and Data Disk Write Operations/Sec, split by LUN, show how busy each data disk is.",
        },
        {
          kind: "p",
          text: "Treat that as an estimate. The read metric includes reads served from host cache when read-only or read/write caching is on. And an I/O over 256\u00a0KiB counts as several transactions.",
        },
      ],
    },
    {
      id: "azure-standard-hdd-vs-standard-ssd-vs",
      title: "P20 vs E20: choose Premium SSD or Standard SSD by the I/O you measure",
      blocks: [
        {
          kind: "p",
          text: "Microsoft’s high availability guide says which VMs get the highest single-VM uptime service level agreement (SLA). Their OS disk is Premium SSD, and their data disks are all Premium SSD, Premium SSD v2 or Ultra Disk.",
        },
        {
          kind: "table",
          columns: [
            { label: "What you decide on", width: "24%" },
            { label: "Premium SSD", width: "40%" },
            { label: "Standard SSD", width: "36%" },
          ],
          rows: [
            ["What you pay for", "Size tier, P1 to P80", "Size tier, E1 to E80, plus transactions"],
            ["512\u00a0GiB in East US, Oct 2026", "$73.22 (P20)", "$38.40 (E20) plus transactions"],
            [
              "Performance at 512\u00a0GiB",
              "2,300\u00a0IOPS and 150\u00a0MB/s, provisioned",
              "Up to 500\u00a0IOPS and 100\u00a0MB/s",
            ],
            ["Largest disk", "20,000\u00a0IOPS, 900\u00a0MB/s", "6,000\u00a0IOPS, 750\u00a0MB/s"],
            [
              "Latency target",
              "Single-digit ms, 99.9% of the time",
              "Single-digit ms, 99% of the time",
            ],
            ["Bursting", "Credit-based to P20, on-demand from P30", "Credit-based to E30"],
            ["Higher performance tier", "At some sizes, charged at that tier", "No, set by size"],
            ["VM sizes", "Sizes that support Premium storage", "All"],
            [
              "Highest single-VM uptime SLA",
              "Yes, with a Premium SSD OS disk and premium data disks",
              "No",
            ],
            ["Redundancy", "LRS or ZRS", "LRS or ZRS"],
            ["Reservations", "One year, P30 to P80", "None"],
            [
              "Microsoft’s suggested use",
              "Production workloads that need high performance and low latency",
              "Web servers, lightly used enterprise applications, dev and test",
            ],
          ],
        },
        { kind: "p", text: "Pick by the I/O you’ve measured on the disk:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Standard SSD:" },
              " a disk within 500\u00a0IOPS and 100\u00a0MB/s and well under its transaction break-even, such as a web server or test VM.",
            ],
            [
              { b: "Premium SSD:" },
              " production workloads, and any single VM that needs the top SLA. It also suits a disk of 4\u00a0TiB or less that needs more than 500\u00a0IOPS for longer than a burst. On a Standard SSD from E30 up, performance plus can lift that limit.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Standard HDD", href: "/learn/glossary/azure-standard-hdd" },
            " is the third type charged by size tier and suits backups and large sequential files; ",
            { a: "Azure disk types", href: "/learn/azure-managed-disk-types" },
            " compares all five.",
          ],
        },
      ],
    },
    {
      id: "how-to-convert-a-premium-disk-to",
      title: "Premium_LRS vs StandardSSD_LRS: what a switch gives up",
      blocks: [
        {
          kind: "p",
          text: "Going from Premium to Standard needs no VM resize. Coming back needs a VM size that supports Premium storage.",
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "Check what the disk gives up first. A P30 drops from 5,000 provisioned IOPS to up to 500 and gains a transaction meter.",
        },
        {
          kind: "p",
          text: [
            "The size doesn’t change, so a half-empty P30 becomes a half-empty E30. ",
            { a: "Disk reservations", href: "/learn/azure-disk-cost-optimization" },
            " exist only for Premium SSD SKUs from P30 to P80. Each is bought for one SKU in one region, so a reservation won’t cover the converted disk.",
          ],
        },
        {
          kind: "p",
          text: [
            "The switch itself is one SKU change that needs a VM restart, and you can make it twice a day; ",
            {
              a: "how to change a disk type in Azure",
              href: "/learn/azure-managed-disk-types#how-to-change-a-disk-type-in",
            },
            " covers it.",
          ],
        },
      ],
    },
    {
      id: "amoeba-rightsizes-a-pool-on-premium-ssd",
      title: "Amoeba rightsizes a pool on Premium SSD v2 or Premium SSD",
      blocks: [
        {
          kind: "p",
          text: [
            "Disk type sets the price of each tier, and the tier sets how much space you pay for. Azure can grow a managed disk but not shrink it, as ",
            {
              a: "Can you shrink an Azure managed disk?",
              href: "/learn/shrink-azure-managed-disk",
            },
            " explains.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " optimizes block storage on Azure and AWS by working on the size. It moves a VM’s data disks onto one btrfs pool sized to your data, with room to grow. It works on running Windows and Linux VMs, and never touches the OS disk.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "The move." },
              " Amoeba copies your data while your services run. Then it switches each mount to the pool, with a short restart of the services that use it.",
            ],
            [
              { b: "Rightsizing." },
              " It grows the pool before it fills, and sooner when data arrives fast. When your data goes down and stays down, it shrinks the pool one disk at a time.",
            ],
          ],
        },
        { kind: "h3", id: "the-pools-disk-type", title: "The pool’s disk type" },
        {
          kind: "p",
          text: "The pool uses Premium SSD v2 where your VM’s region and zone offer it, and Premium SSD otherwise. Its disks are always locally redundant, so data on a ZRS disk loses its zone redundancy.",
        },
        {
          kind: "p",
          text: "Neither pool type carries Standard SSD’s per-transaction meter. Data on Standard SSD or Standard HDD moves to one of those two types, at a higher rate per GiB in East US. So the saving there comes from the smaller size.",
        },
        {
          kind: "p",
          text: [
            "On Azure, Amoeba prices disks from the Azure Retail Prices API. The ",
            { a: "free block storage assessment", href: "/assessment?p=amoeba" },
            " writes one PDF and sends nothing to Zoorik. Amoeba is in early access.",
          ],
        },
        {
          kind: "p",
          text: [
            {
              a: "Azure managed disk cost optimization",
              href: "/azure-managed-disk-cost-optimization",
            },
            " covers Amoeba on Azure in full.",
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
      title: "“Select a disk type for Azure IaaS VMs - managed disks”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-types",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Understand Azure Disk Storage billing”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-understand-billing",
    },
    {
      publisher: "Microsoft Azure",
      title: "“Managed Disks pricing”",
      url: "https://azure.microsoft.com/en-us/pricing/details/managed-disks/",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Convert managed disks storage between different disk types”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-convert-types",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Best practices for high availability with Azure VMs and managed disks”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-high-availability",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Disk metrics”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-metrics",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Supported metrics - Microsoft.Compute/virtualMachines”",
      url: "https://learn.microsoft.com/en-us/azure/azure-monitor/reference/supported-metrics/microsoft-compute-virtualmachines-metrics",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Frequently asked questions about Azure managed disks”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/faq-for-disks",
    },
  ],
  related: [
    {
      title: "Premium SSD v2 vs Premium SSD: which one costs less?",
      where: "Learn",
      href: "/learn/premium-ssd-v2-vs-premium-ssd",
    },
    {
      title: "Azure disk performance tiers: more IOPS without more space",
      where: "Learn",
      href: "/learn/azure-disk-performance-tiers",
    },
    {
      title: "Azure disk cost optimization: stop paying for empty space",
      where: "Learn",
      href: "/learn/azure-disk-cost-optimization",
    },
    {
      title: "Azure disk IOPS vs throughput: what limits your disks",
      where: "Learn",
      href: "/learn/azure-disk-iops-vs-throughput",
    },
    {
      title: "Azure managed disk types: pricing and how to choose",
      where: "Learn",
      href: "/learn/azure-managed-disk-types",
    },
  ],
};
