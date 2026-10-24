import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/premium-ssd-vs-standard-ssd-azure/1";

export const article: Article = {
  slug: "premium-ssd-vs-standard-ssd-azure",
  title: "Premium SSD vs Standard SSD on Azure: cost and IOPS",
  meta: "Premium SSD vs Standard SSD on Azure, tier by tier: IOPS, throughput, East US prices, when Standard SSD transactions cost more, and how to switch a disk.",
  h1: "Premium SSD vs Standard SSD on Azure: what you pay for",
  deck: "Both bill by size tier. What the higher price buys, when transactions close the gap, and how to switch a disk.",
  card: "Premium SSD and Standard SSD tier by tier: IOPS, East US prices, transaction charges and how to convert.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Azure block storage",
  versus: ["Premium SSD", "Standard SSD"],
  published: "2026-11-02",
  updated: "2026-11-02",
  author: "udit",
  short:
    "Premium SSD vs Standard SSD on Azure is a choice about performance, since both bill by size tier whatever the disk holds. At October 2026 East US list prices, a 512\u00a0GiB Premium SSD (P20) costs $73.22 a month for 2,300 provisioned IOPS (input/output operations per second). A Standard SSD (E20) costs $38.40 for up to 500\u00a0IOPS. Its transaction charges can exceed that gap on a busy disk, so Standard SSD suits light I/O.",
  sections: [
    {
      id: "premium-ssd-vs-standard-ssd-pricing-on",
      title: "Premium SSD vs Standard SSD pricing on Azure",
      blocks: [
        {
          kind: "p",
          text: "Both types are billed by size tier. Premium SSD runs from P1 to P80 and Standard SSD from E1 to E80, each tier a fixed size between 4\u00a0GiB and 32,767\u00a0GiB. Azure rounds the size you provision up to the next tier and bills that tier, prorated by the hour, so a 200\u00a0GiB Standard SSD is billed as an E15, the 256\u00a0GiB tier. Microsoft’s pricing page adds that you pay the same rate for a provisioned disk however much of it you use.",
        },
        {
          kind: "p",
          text: "The second meter is where the types part ways. Microsoft’s billing guide is direct about Premium SSD: “Unless you enable on-demand bursting, there are no transaction costs for Premium SSD.” Standard SSD bills transactions, and any operation counts: reads, writes and deletes. Each I/O of up to 256\u00a0KiB counts once, and a larger one counts as several. In East US the rate is $0.002 per 10,000 transactions on locally redundant storage (LRS), and each tier caps the paid transactions per hour, so anything above the cap in that hour costs nothing.",
        },
        {
          kind: "p",
          text: "These are East US pay-as-you-go prices for LRS disks, from Microsoft’s managed disks pricing page in October 2026, with Microsoft’s published tier performance:",
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
          text: [
            "The last column is a disk at its hourly cap for every hour of a 730-hour month. Every figure here is Premium SSD LRS vs Standard SSD LRS, the SKUs Premium_LRS and StandardSSD_LRS. Zone-redundant storage (ZRS) costs more: a P20 ZRS lists at $109.81 and an E20 ZRS at $57.60, 1.5 times their LRS prices, as ",
            { a: "Azure disk LRS vs ZRS", href: "/learn/azure-disk-lrs-vs-zrs" },
            " covers. Prices differ by region and change over time, so check yours on the managed disks pricing page.",
          ],
        },
        {
          kind: "p",
          text: "The capacity rule is the same on both types. A 512\u00a0GiB disk holding 100\u00a0GiB pays for the whole P20 or E20. Convert a half-empty Premium SSD to Standard SSD and, at the sizes in the table, you pay 49% to 59% of the Premium SSD price, before transactions, for the same empty half.",
        },
      ],
    },
    {
      id: "azure-standard-ssd-vs-premium-ssd-performance",
      title: "Azure Standard SSD vs Premium SSD performance, tier by tier",
      blocks: [
        {
          kind: "p",
          text: "Premium SSD buys provisioned performance. Microsoft guarantees a Premium SSD’s capacity, IOPS and throughput once it’s provisioned, and designs it to deliver single-digit millisecond latency and those targets 99.9% of the time. Standard SSD also targets single-digit milliseconds, but its IOPS and throughput are ceilings, met 99% of the time, and Microsoft says actual figures can vary with traffic patterns.",
        },
        {
          kind: "p",
          text: "The Azure Standard SSD vs Premium SSD IOPS gap opens with size. At 128\u00a0GiB the two match on paper. Below that, Standard SSD has the higher ceiling: P1 to P4 provision 120\u00a0IOPS and a P6 240, against up to 500 on E1 to E6, though those small Premium SSDs can burst to 3,500. Above it, Premium SSD climbs with size, while every Standard SSD from E1 to E50 (up to 4,096\u00a0GiB) stays at up to 500\u00a0IOPS and 100\u00a0MB/s. A P30 gives ten times the IOPS of an E30 of the same size. Standard SSD’s base IOPS pass 500 only at E60, the 8,192\u00a0GiB tier, with up to 2,000, unless the disk has performance plus enabled, which takes an E30 to up to 1,500. The largest disks reach 20,000\u00a0IOPS and 900\u00a0MB/s on Premium SSD, and 6,000\u00a0IOPS and 750\u00a0MB/s on Standard SSD.",
        },
        {
          kind: "p",
          text: [
            "Both types can burst for short peaks. Premium SSD P20 and smaller can burst to 3,500\u00a0IOPS and 170\u00a0MB/s, and Standard SSD E20 and smaller to 600\u00a0IOPS and 150\u00a0MB/s (an E30 to 1,000\u00a0IOPS and 250\u00a0MB/s), for up to 30\u00a0minutes. From P30 up, Premium SSD bursts only with on-demand bursting, which you enable and pay for with an hourly fee plus burst transactions. Some Premium SSD sizes can select a higher performance tier without growing, billed at that tier until you change it back, while a Standard SSD’s tier is set by its size. ",
            { a: "Azure disk performance tiers", href: "/learn/azure-disk-performance-tiers" },
            " covers when that’s worth it.",
          ],
        },
        {
          kind: "p",
          text: [
            "Two limits sit outside the disk. A Premium SSD needs a VM size that supports Premium storage, while Standard SSD is available on all Azure VMs. And the VM size has its own IOPS and throughput caps, which ",
            { a: "Azure disk IOPS vs throughput", href: "/learn/azure-disk-iops-vs-throughput" },
            " explains.",
          ],
        },
        {
          kind: "p",
          text: [
            "A third option drops the tiers. Premium SSD v2 bills each GiB and includes 3,000\u00a0IOPS and 125\u00a0MB/s, and ",
            { a: "Premium SSD v2 vs Premium SSD", href: "/learn/premium-ssd-v2-vs-premium-ssd" },
            " works through its prices.",
          ],
        },
      ],
    },
    {
      id: "when-standard-ssd-transactions-cost-more-than",
      title: "When Standard SSD transactions cost more than Premium SSD",
      blocks: [
        {
          kind: "p",
          text: "The transaction meter decides the busy case. On a 512\u00a0GiB disk the P20 costs $34.82 a month more than the E20. At $0.002 per 10,000, that difference pays for about 238,000 transactions an hour over a 730-hour month, around 66 a second. Bill more than that on an E20, averaged over the month, and it costs more than a P20. It does so with less than a quarter of the P20’s IOPS. At its cap of 502,000 paid transactions an hour, an E20 costs $111.69 a month, $38.47 more than the P20.",
        },
        { kind: "diagram", figure: figure1 },
        {
          kind: "p",
          text: "The break-even moves with size: about 69,000 transactions an hour (19 a second) for an E10 against a P10, and about 400,000 an hour (111 a second) for an E30 against a P30. At every size in the table above, a Standard SSD at its cap costs more than the Premium SSD of the same size.",
        },
        {
          kind: "p",
          text: "You can read the figure from two places. On your Azure bill, Standard SSD transactions appear on a Disk Operations meter beside the disk’s tier meter, so last month’s charge is already there. For a disk that’s still Premium SSD, the VM’s Data Disk Read Operations/Sec and Data Disk Write Operations/Sec metrics in the Azure portal, split by LUN, show how busy each data disk is. Treat that as an estimate, because the read metric includes reads served from host cache when read-only or read/write caching is on, and an I/O larger than 256\u00a0KiB bills as several transactions.",
        },
      ],
    },
    {
      id: "azure-standard-hdd-vs-standard-ssd-vs",
      title: "Azure Standard HDD vs Standard SSD vs Premium SSD",
      blocks: [
        {
          kind: "p",
          text: "Standard HDD is the third type billed by size tier. Its tiers, S4 to S80, start at 32\u00a0GiB and give up to 500\u00a0IOPS and 60\u00a0MB/s through S50. An S20 (512\u00a0GiB) lists at $21.76 a month in East US. Microsoft designs Standard HDD for write latency under 10\u00a0ms and read latency under 20\u00a0ms for most operations, and says it doesn’t suit OS disks or transactional databases. It bills transactions too, counted in 16\u00a0KiB units and capped per disk per hour. On September 8, 2028, Microsoft retires the use of Standard HDD as an OS disk.",
        },
        {
          kind: "table",
          columns: [
            { label: "What you decide on", width: "18%" },
            { label: "Premium SSD", width: "33%" },
            { label: "Standard SSD", width: "23%" },
            { label: "Standard HDD", width: "26%" },
          ],
          rows: [
            [
              "What the bill counts",
              "Size tier, P1 to P80",
              "Size tier, E1 to E80, plus transactions",
              "Size tier, S4 to S80, plus transactions",
            ],
            [
              "512\u00a0GiB in East US, Oct 2026",
              "$73.22 (P20)",
              "$38.40 (E20) plus transactions",
              "$21.76 (S20) plus transactions",
            ],
            [
              "Performance at 512\u00a0GiB",
              "2,300\u00a0IOPS and 150\u00a0MB/s, provisioned",
              "Up to 500\u00a0IOPS and 100\u00a0MB/s",
              "Up to 500\u00a0IOPS and 60\u00a0MB/s",
            ],
            [
              "Largest disk",
              "20,000\u00a0IOPS, 900\u00a0MB/s",
              "6,000\u00a0IOPS, 750\u00a0MB/s",
              "2,000\u00a0IOPS (3,000 with performance plus), 500\u00a0MB/s",
            ],
            [
              "Latency target",
              "Single-digit ms, 99.9% of the time",
              "Single-digit ms, 99% of the time",
              "Under 10\u00a0ms writes, under 20\u00a0ms reads, for most operations",
            ],
            [
              "Bursting",
              "Credit-based to P20, on-demand from P30",
              "Credit-based to E30",
              "None listed",
            ],
            [
              "Higher performance tier",
              "At some sizes, billed at that tier",
              "No, set by size",
              "No, set by size",
            ],
            ["VM sizes", "Sizes that support Premium storage", "All", "All"],
            [
              "Highest single-VM uptime SLA",
              "Yes, with a Premium SSD OS disk and premium data disks",
              "No",
              "No",
            ],
            ["Redundancy", "LRS or ZRS", "LRS or ZRS", "LRS only"],
            ["Reservations", "One year, P30 to P80", "None", "None"],
            [
              "Microsoft’s suggested use",
              "Production workloads that need high performance and low latency",
              "Web servers, lightly used enterprise applications, dev and test",
              "Backup and noncritical, infrequently accessed workloads",
            ],
          ],
        },
        {
          kind: "p",
          text: "Microsoft’s high availability guide says the highest single-VM uptime service level agreement (SLA) goes to VMs whose OS disk is Premium SSD and whose data disks are all Premium SSD, Premium SSD v2 or Ultra Disk.",
        },
        {
          kind: "p",
          text: "Pick by the I/O you’ve measured on the disk. Standard SSD fits a disk that stays within 500\u00a0IOPS and 100\u00a0MB/s and bills well under its break-even, such as a web server or a test VM. Premium SSD fits production workloads, any disk of 4\u00a0TiB or less that needs more than 500\u00a0IOPS for longer than a burst (performance plus can lift that limit from E30 up), and any single VM that needs the top SLA. Standard HDD fits backups and large sequential files.",
        },
      ],
    },
    {
      id: "how-to-convert-a-premium-disk-to",
      title: "How to convert a Premium disk to Standard SSD",
      blocks: [
        {
          kind: "p",
          text: "Switching between Premium SSD, Standard SSD and Standard HDD is an update to the disk’s SKU, and the conversion itself is instantaneous. Microsoft’s conversion guide says it requires a restart of the VM, so schedule it in a maintenance window. You can change a disk’s type twice per day. Going from Premium to Standard needs no VM resize, and coming back needs a VM size that supports Premium storage.",
        },
        {
          kind: "p",
          text: "Deallocating stops the VM, so every service on it is down until the VM starts again. Microsoft also says the VM’s temporary disk isn’t persisted in Azure Storage, so keep nothing there that you need. These Azure CLI commands from Microsoft’s guide convert one data disk:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "vmId=$(az disk show --name <disk-name> --resource-group <resource-group> --query managedBy --output tsv)\naz vm deallocate --ids $vmId\naz disk update --sku StandardSSD_LRS --name <disk-name> --resource-group <resource-group>\naz vm start --ids $vmId",
        },
        {
          kind: "p",
          text: [
            "Use StandardSSD_ZRS to keep a zone-redundant disk zone-redundant. Before you run it, check what the disk gives up. A P30 drops from 5,000 provisioned IOPS to up to 500, and it gains a transaction meter. ",
            { a: "Disk reservations", href: "/learn/azure-disk-cost-optimization" },
            " exist only for Premium SSD SKUs from P30 to P80, each bought for one SKU in one region, so a reservation won’t cover the converted disk. The size doesn’t change either, so a half-empty P30 becomes a half-empty E30.",
          ],
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
            "Disk type sets the price of each tier. The tier sets how much space you pay for, and Azure can grow a managed disk but not shrink it, as ",
            {
              a: "Can you shrink an Azure managed disk?",
              href: "/learn/shrink-azure-managed-disk",
            },
            " explains. ",
            { a: "Amoeba", href: "/amoeba" },
            ", Zoorik’s block storage optimization for Azure managed disks and Amazon EBS, works on the size. It moves a VM’s data disks onto one pool sized to the data, aims to hold it 80% to 90% full by default, and rightsizes it as the data grows and shrinks.",
          ],
        },
        {
          kind: "p",
          text: "Each VM gets one pool, which starts with at least 2\u00a0disks of equal size. Amoeba sizes it from the highest use of the last 7\u00a0days, so it sits inside its target band with room for the largest recent 15-minute rise and at least 10\u00a0GiB free. The pool is Premium SSD v2 where the VM’s region and zone offer it, and Premium SSD otherwise. Its disks are always locally redundant, so data on a ZRS disk loses its zone redundancy. Neither pool type carries Standard SSD’s per-transaction meter: Premium SSD v2 bills capacity, IOPS above 3,000 and throughput above 125\u00a0MB/s, and Premium SSD bills transactions only with on-demand bursting. Data on Standard SSD or Standard HDD moves to one of those two types, at a higher rate per GiB in East US, so the capacity saving there comes from the smaller size.",
        },
        {
          kind: "p",
          text: [
            "On Azure, Amoeba prices disks from the Azure Retail Prices API with a 730-hour month. The ",
            { a: "free block storage assessment", href: "/assessment?p=amoeba" },
            " writes one PDF and sends nothing to Zoorik. Amoeba is in early access.",
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
      title: "Can you shrink an Azure managed disk?",
      where: "Learn",
      href: "/learn/shrink-azure-managed-disk",
    },
  ],
};
