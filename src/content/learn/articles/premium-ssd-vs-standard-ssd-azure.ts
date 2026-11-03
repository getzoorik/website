import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/premium-ssd-vs-standard-ssd-azure/1";

export const article: Article = {
  slug: "premium-ssd-vs-standard-ssd-azure",
  title: "Azure Premium SSD vs Standard SSD",
  meta: "Azure Premium SSD vs Standard SSD: East US prices by size, IOPS, transaction charges, when Standard SSD costs more, and which to choose.",
  h1: "Azure Premium SSD vs Standard SSD",
  deck: "Standard SSD costs about half as much per size, until a busy disk’s transaction charges catch up.",
  card: "Prices, IOPS and transaction charges side by side, and the point where a busy Standard SSD costs more.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Azure block storage",
  versus: ["Premium SSD", "Standard SSD"],
  published: "2026-11-01",
  updated: "2026-11-03",
  author: "udit",
  cover: "/learn-covers/zoorik-learn-premium-ssd-vs-standard-ssd-azure-1200x630.webp",
  coverAlt: "Premium SSD vs Standard SSD: Standard SSD for light I/O, Premium SSD for a busy disk",
  short:
    "Premium SSD charges a fixed monthly price per size and gives provisioned IOPS (input/output operations per second) that grow with size. Standard SSD costs about half as much, adds a charge per transaction, and gives up to 500\u00a0IOPS on every size up to 4\u00a0TiB. A 512\u00a0GiB disk costs $73.22 a month as Premium SSD and $38.40 plus transactions as Standard SSD (East US, October 2026). Above about 66 transactions a second on average, that disk costs more as Standard SSD.",
  sections: [
    {
      id: "azure-standard-hdd-vs-standard-ssd-vs",
      title: "Which to choose",
      blocks: [
        {
          kind: "table",
          columns: [
            { label: "Feature", width: "24%" },
            { label: "Premium SSD", width: "40%" },
            { label: "Standard SSD", width: "36%" },
          ],
          rows: [
            ["Price", "Size tier, P1 to P80", "Size tier, E1 to E80, plus transactions"],
            [
              "512\u00a0GiB, East US",
              "$73.22 a month (P20)",
              "$38.40 a month (E20), plus transactions",
            ],
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
        { kind: "p", text: "Choose by the I/O you measure on the disk:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Standard SSD:" },
              " a disk that stays within 500\u00a0IOPS and 100\u00a0MB/s and well under its break-even, such as a web server or test VM. On a 512\u00a0GiB disk, the break-even is about 66 transactions a second.",
            ],
            [
              { b: "Premium SSD:" },
              " production workloads, and any single VM that needs the top SLA. It also suits a disk of 4\u00a0TiB or less that needs more than 500\u00a0IOPS for longer than a burst. On Standard SSD from E30 up, performance plus can lift that limit.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Premium SSD v2", href: "/learn/premium-ssd-v2-vs-premium-ssd" },
            " has no tiers: it charges per GiB, plus IOPS above 3,000 and throughput above 125\u00a0MB/s. ",
            { a: "Standard HDD", href: "/learn/glossary/azure-standard-hdd" },
            " also charges by size tier, and suits backups and large sequential files. ",
            { a: "Azure disk types", href: "/learn/azure-managed-disk-types" },
            " compares all five.",
          ],
        },
      ],
    },
    {
      id: "premium-ssd-vs-standard-ssd-azure",
      title: "Pricing",
      blocks: [
        {
          kind: "p",
          text: "Both types charge for the whole size tier, however much of it you use. A 512\u00a0GiB data disk holding 100\u00a0GiB costs the full 512\u00a0GiB as a P20 or an E20.",
        },
        {
          kind: "h3",
          id: "both-types-charge-by-size-tier",
          title: "Size tiers",
        },
        {
          kind: "p",
          text: [
            { a: "Premium SSD", href: "/learn/glossary/azure-premium-ssd" },
            " runs from P1 to P80, and Standard SSD from E1 to E80. Each ",
            { a: "size tier", href: "/learn/glossary/azure-disk-sizes" },
            " is a fixed size from 4\u00a0GiB to 32,767\u00a0GiB.",
          ],
        },
        {
          kind: "p",
          text: "Azure rounds the size you choose up to the next tier and charges for that tier, prorated by the hour. A 200\u00a0GiB Standard SSD is charged as an E15, the 256\u00a0GiB tier.",
        },
        {
          kind: "h3",
          id: "standard-ssd-also-charges-per-transaction",
          title: "Transaction charges",
        },
        {
          kind: "p",
          text: "Premium SSD has no transaction charges unless you turn on on-demand bursting. Standard SSD charges for every operation: reads, writes and deletes. Each I/O of up to 256\u00a0KiB counts as one transaction, and a larger one counts as several.",
        },
        {
          kind: "p",
          text: "In East US, Standard SSD transactions on locally redundant storage (LRS) cost $0.002 per 10,000. Each tier caps the paid transactions in an hour, and the rest of that hour’s transactions are free.",
        },
        { kind: "h3", id: "east-us-prices-tier-by-tier", title: "East US prices" },
        {
          kind: "p",
          text: "Monthly pay-as-you-go prices for Premium_LRS and StandardSSD_LRS, October 2026, with the performance Microsoft publishes for each tier.",
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
              "$42.98 a month",
            ],
            [
              "256\u00a0GiB",
              "P15: 1,100\u00a0IOPS, 125\u00a0MB/s, $38.01",
              "E15: up to 500\u00a0IOPS, 100\u00a0MB/s, $19.20",
              "$80.01 a month",
            ],
            [
              "512\u00a0GiB",
              "P20: 2,300\u00a0IOPS, 150\u00a0MB/s, $73.22",
              "E20: up to 500\u00a0IOPS, 100\u00a0MB/s, $38.40",
              "$146.58 a month",
            ],
            [
              "1,024\u00a0GiB",
              "P30: 5,000\u00a0IOPS, 200\u00a0MB/s, $135.17",
              "E30: up to 500\u00a0IOPS, 100\u00a0MB/s, $76.80",
              "$242.13 a month",
            ],
            [
              "2,048\u00a0GiB",
              "P40: 7,500\u00a0IOPS, 250\u00a0MB/s, $259.05",
              "E40: up to 500\u00a0IOPS, 100\u00a0MB/s, $153.60",
              "$260.76 a month",
            ],
          ],
        },
        {
          kind: "p",
          text: "At these sizes, Standard SSD costs 49% to 59% of the Premium SSD price before transactions. The last column is a disk at its hourly cap for every hour of a 730-hour month.",
        },
        {
          kind: "p",
          text: [
            "Zone-redundant storage (ZRS) costs about 1.5 times LRS: $109.81 for a P20 and $57.60 for an E20. ",
            { a: "Azure disk LRS vs ZRS", href: "/learn/azure-disk-lrs-vs-zrs" },
            " covers the difference.",
          ],
        },
        {
          kind: "p",
          text: [
            "Prices vary by region and change over time. The ",
            { a: "Azure disk pricing calculator", href: "/ebs-and-azure-disk-pricing" },
            " shows a disk’s list price a month.",
          ],
        },
      ],
    },
    {
      id: "a-busy-standard-ssd-costs-more-than",
      title: "When Standard SSD costs more",
      blocks: [
        {
          kind: "callout",
          label: "Worked example",
          text: "On the 512\u00a0GiB disk, the P20 costs $73.22 − $38.40 = $34.82 a month more than the E20. Over a 730-hour month, that’s about $0.048 an hour.",
        },
        {
          kind: "p",
          text: "At $0.002 per 10,000 transactions, $0.048 pays for about 238,000 transactions an hour, or 66 a second. Average more than that over the month, and the E20 costs more than the P20.",
        },
        {
          kind: "p",
          text: "At its cap of 1,004,000 paid transactions an hour, the E20’s transactions come to $146.58 a month. The E20 then costs $184.98, $111.76 more than the P20, and gives less than a quarter of the P20’s IOPS.",
        },
        { kind: "h3", id: "the-break-even-at-other-sizes", title: "Other sizes" },
        {
          kind: "p",
          text: "An E10 costs more than a P10 above about 69,000 transactions an hour (19 a second). An E30 costs more than a P30 above about 400,000 an hour (111 a second). At every size in the table, a Standard SSD at its cap costs more than the Premium SSD.",
        },
        {
          kind: "h3",
          id: "how-to-count-a-disks-transactions",
          title: "Count a disk’s transactions",
        },
        {
          kind: "p",
          text: "In your Azure charges, a Standard SSD’s transactions appear on a Disk Operations meter beside its tier. Before switching a Premium SSD, check the VM’s metrics in the Azure portal. Data Disk Read Operations/Sec and Data Disk Write Operations/Sec, split by LUN, show each data disk’s I/O.",
        },
        {
          kind: "p",
          text: "Treat that as an estimate. With read-only or read/write host caching on, the read metric includes reads served from the cache. An I/O over 256\u00a0KiB also counts as several transactions.",
        },
      ],
    },
    {
      id: "azure-standard-ssd-vs-premium-ssd-performance",
      title: "Performance",
      blocks: [
        {
          kind: "p",
          text: [
            "Microsoft guarantees a Premium SSD’s capacity, ",
            { a: "IOPS", href: "/learn/glossary/iops" },
            " and throughput once it’s provisioned. It targets single-digit millisecond latency and those figures 99.9% of the time.",
          ],
        },
        {
          kind: "p",
          text: "Standard SSD also targets single-digit milliseconds. But its IOPS and throughput are ceilings, met 99% of the time, and can vary with traffic patterns.",
        },
        {
          kind: "p",
          text: "Every Standard SSD from E1 to E50 (up to 4,096\u00a0GiB) gets up to 500\u00a0IOPS and 100\u00a0MB/s. So a P30 gives ten times the IOPS of an E30 of the same size.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "h3",
          id: "small-disks-bursts-and-performance-tiers",
          title: "Small disks and bursts",
        },
        {
          kind: "callout",
          label: "For engineers",
          text: "Below 128\u00a0GiB, Standard SSD has the higher ceiling. P1 to P4 provision 120\u00a0IOPS and a P6 240, against up to 500 on E1 to E6.",
        },
        {
          kind: "p",
          text: "Standard SSD’s base IOPS pass 500 only from E60, the 8,192\u00a0GiB tier, with up to 2,000. With performance plus enabled, an E30 reaches up to 1,500.",
        },
        {
          kind: "p",
          text: "Both types can burst for up to 30\u00a0minutes. Premium SSD P20 and smaller burst to 3,500\u00a0IOPS and 170\u00a0MB/s. Standard SSD bursts to 600\u00a0IOPS and 150\u00a0MB/s on E20 and smaller, and 1,000\u00a0IOPS and 250\u00a0MB/s on an E30.",
        },
        {
          kind: "p",
          text: "From P30 up, Premium SSD bursts only with on-demand bursting. You turn it on and pay for it: an hourly fee plus burst transactions.",
        },
        { kind: "h3", id: "performance-tiers", title: "Performance tiers" },
        {
          kind: "p",
          text: [
            "Some Premium SSD sizes can take a ",
            { a: "higher performance tier", href: "/learn/azure-disk-performance-tiers" },
            " without growing, charged at that tier until you change it back. A Standard SSD’s tier is set by its size.",
          ],
        },
        { kind: "h3", id: "limits-outside-the-disk", title: "VM limits" },
        {
          kind: "p",
          text: [
            "Premium SSD needs a VM size that supports Premium storage. Standard SSD works on all Azure VMs. Each VM size also caps IOPS and throughput, as ",
            { a: "Azure disk IOPS vs throughput", href: "/learn/azure-disk-iops-vs-throughput" },
            " explains.",
          ],
        },
      ],
    },
    {
      id: "how-to-convert-a-premium-disk-to",
      title: "Switching to Standard SSD",
      blocks: [
        {
          kind: "p",
          text: "Going from Premium SSD to Standard SSD needs no VM resize. Going back needs a VM size that supports Premium storage.",
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "A P30 drops from 5,000 provisioned IOPS to up to 500 and gains a transaction charge.",
        },
        {
          kind: "p",
          text: [
            "The size stays the same, so a half-empty P30 becomes a half-empty E30. ",
            { a: "Disk reservations", href: "/learn/azure-disk-reservations" },
            " exist only for Premium SSD from P30 to P80. Each covers one SKU in one region, so it won’t cover the converted disk.",
          ],
        },
        {
          kind: "p",
          text: [
            "The change needs a VM restart, and a disk’s type can change only twice a day. ",
            {
              a: "How to change a disk type",
              href: "/learn/azure-managed-disk-types#how-to-change-a-disk-type-in",
            },
            " shows the steps.",
          ],
        },
      ],
    },
    {
      id: "amoeba-rightsizes-a-pool-on-premium-ssd",
      title: "Where Amoeba fits",
      blocks: [
        {
          kind: "p",
          text: [
            "A type switch keeps the size, and Azure can grow a managed disk but ",
            { a: "can’t shrink it", href: "/learn/shrink-azure-managed-disk" },
            ". ",
            { a: "Amoeba", href: "/amoeba" },
            " rightsizes block storage on Azure and AWS. It moves a VM’s data disks onto one btrfs pool sized to your data, with room to grow. It works on running Windows and Linux VMs and never touches the OS disk.",
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
              " It grows the pool before it fills, and sooner when data arrives fast. When your data goes down and stays down, it shrinks the pool one disk at a time. Both happen without any downtime.",
            ],
          ],
        },
        { kind: "h3", id: "the-pools-disk-type", title: "The pool’s disk type" },
        {
          kind: "p",
          text: "The pool uses Premium SSD v2 where your VM’s region and zone offer it, and Premium SSD otherwise. Its disks are locally redundant, so data on a ZRS disk loses its zone redundancy.",
        },
        {
          kind: "p",
          text: "Neither type has Standard SSD’s transaction charge. Both cost more per GiB than Standard SSD or Standard HDD in East US. So data moved off a Standard disk saves through the smaller size, not a cheaper rate.",
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
    text: "Amoeba moves a VM’s data disks onto one pool sized to your data, then rightsizes it autonomously, without any downtime, one disk at a time. We estimate it takes 50–60% off block storage cost. It is an estimated range, not a promise. The free assessment works out your own figure.",
    links: [
      { label: "Block storage optimization with Amoeba", href: "/amoeba" },
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
      title: "Premium SSD v2 vs Premium SSD",
      where: "Learn",
      href: "/learn/premium-ssd-v2-vs-premium-ssd",
    },
    {
      title: "Azure disk performance tiers",
      where: "Learn",
      href: "/learn/azure-disk-performance-tiers",
    },
    {
      title: "Azure disk reservations: are they worth it?",
      where: "Learn",
      href: "/learn/azure-disk-reservations",
    },
    {
      title: "Azure disk IOPS vs throughput",
      where: "Learn",
      href: "/learn/azure-disk-iops-vs-throughput",
    },
    {
      title: "Azure disk types",
      where: "Learn",
      href: "/learn/azure-managed-disk-types",
    },
  ],
  relatedTitle: "More on Azure disk types",
};
