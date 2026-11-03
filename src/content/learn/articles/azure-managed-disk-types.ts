import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/azure-managed-disk-types/1";
import { figure as figure2 } from "@/features/learn/figures/azure-managed-disk-types/2";
import { figure as figure3 } from "@/features/learn/figures/azure-managed-disk-types/3";

export const article: Article = {
  slug: "azure-managed-disk-types",
  title: "Azure disk types: pricing and how to choose",
  meta: "The five Azure disk types compared: their limits, how each charges, one disk priced on all five, and which to pick.",
  h1: "Azure disk types",
  deck: "Three types charge a size tier, and two charge for the capacity and performance you set.",
  card: "The five Azure disk types side by side: limits, prices and which to pick for each disk.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Azure block storage",
  published: "2026-11-01",
  updated: "2026-11-03",
  author: "sheldon",
  cover: "/learn-covers/zoorik-learn-azure-managed-disk-types-1200x630.webp",
  coverAlt:
    "Five Azure disk types by cost a month: the two cheapest crossed out, Premium SSD v2 ticked, then Premium SSD and Ultra Disk",
  short: [
    "The five Azure disk types, all ",
    { a: "managed disks", href: "/learn/glossary/azure-managed-disk" },
    ", are Ultra Disk, Premium SSD v2, Premium SSD, Standard SSD and Standard HDD. Start most data disks on Premium SSD v2, which Microsoft says can give the best price performance for most general-purpose workloads. Premium SSD is the fastest OS disk type. Use Ultra Disk only when one disk needs more than v2 can give.",
  ],
  sections: [
    {
      id: "azure-disk-types",
      title: "The five types compared",
      blocks: [
        {
          kind: "table",
          columns: [
            { label: "Feature", width: "14%" },
            { label: "Ultra Disk", width: "16%" },
            { label: "Premium SSD v2", width: "18%" },
            { label: "Premium SSD", width: "14%" },
            { label: "Standard SSD", width: "16%" },
            { label: "Standard HDD", width: "22%" },
          ],
          rows: [
            [
              "What you pay for",
              "Capacity, plus every IOPS and MB/s you set",
              "Each GiB, plus IOPS above 3,000 and MB/s above 125",
              "The size tier, P1 to P80",
              "The size tier, E1 to E80, plus transactions",
              "The size tier, S4 to S80, plus transactions",
            ],
            [
              "Largest disk",
              "64\u00a0TiB",
              "64\u00a0TiB",
              "32,767\u00a0GiB",
              "32,767\u00a0GiB",
              "32,767\u00a0GiB",
            ],
            [
              "Highest IOPS",
              "400,000",
              "80,000",
              "20,000",
              "6,000",
              "2,000, or 3,000 with performance plus",
            ],
            [
              "Highest throughput",
              "10,000\u00a0MB/s",
              "2,000\u00a0MB/s",
              "900\u00a0MB/s",
              "750\u00a0MB/s",
              "500\u00a0MB/s",
            ],
            ["OS disk", "No", "No", "Yes", "Yes", "Yes, until 8 September 2028"],
            ["Zone-redundant storage (ZRS)", "No", "No", "Yes", "Yes", "No"],
            [
              "Microsoft’s suggested use",
              "SAP HANA, top-tier databases and transaction-heavy workloads",
              "Production workloads that need low latency, high IOPS and high throughput",
              "Production workloads that need high performance and low latency",
              "Web servers, lightly used enterprise applications, dev and test",
              "Backup and noncritical, infrequently accessed workloads",
            ],
          ],
        },
        {
          kind: "p",
          text: "Latency follows the same order. Ultra Disk and Premium SSD v2 aim for under a millisecond, and Premium SSD and Standard SSD for single-digit milliseconds. Standard HDD aims for writes under 10\u00a0ms and reads under 20\u00a0ms, for most I/O.",
        },
        {
          kind: "p",
          text: "Some limits come before price. Premium SSD v2 and Ultra Disk work only as data disks, and neither is offered in every region. In most regions with availability zones, v2 attaches only to VMs deployed in a zone.",
        },
        {
          kind: "p",
          text: "Premium SSD needs a VM size that supports Premium storage. Standard SSD and Standard HDD work on every Azure VM.",
        },
      ],
    },
    {
      id: "how-azure-disk-types-pricing-works",
      title: "How each type charges",
      blocks: [
        {
          kind: "h3",
          id: "three-types-charge-a-size-tier",
          title: "Size tiers",
        },
        {
          kind: "p",
          text: [
            { a: "Premium SSD", href: "/learn/glossary/azure-premium-ssd" },
            ", Standard SSD and ",
            { a: "Standard HDD", href: "/learn/glossary/azure-standard-hdd" },
            " come in fixed ",
            { a: "size tiers", href: "/learn/glossary/azure-disk-sizes" },
            ", such as P30, E30 and S30 for 1,024\u00a0GiB. Azure rounds the size you provision up to the next tier. It charges that tier by the hour, however much data the disk holds.",
          ],
        },
        {
          kind: "p",
          text: "In Microsoft’s own example, a 200\u00a0GiB Standard SSD is charged as an E15, the 256\u00a0GiB tier.",
        },
        {
          kind: "p",
          text: [
            "The tier also sets the speed. A P30 gets 5,000 ",
            { a: "IOPS", href: "/learn/glossary/iops" },
            " (input/output operations per second) and 200\u00a0MB/s of ",
            { a: "throughput", href: "/learn/glossary/disk-throughput" },
            ". Every Standard SSD from E1 to E50 gets up to 500\u00a0IOPS.",
          ],
        },
        {
          kind: "p",
          text: "Standard SSD and Standard HDD also charge per transaction. On 1 November 2026, East US lists $0.002 per 10,000 transactions for Standard SSD on locally redundant storage (LRS), and $0.0005 for Standard HDD. Each caps the transactions it charges in an hour.",
        },
        {
          kind: "p",
          text: "Standard SSD counts each I/O of up to 256\u00a0KiB once. Standard HDD counts in 16\u00a0KiB units, so a large I/O counts several times.",
        },
        {
          kind: "h3",
          id: "premium-ssd-v2-and-ultra-disk-charge",
          title: "Premium SSD v2 and Ultra Disk",
        },
        {
          kind: "p",
          text: "A Premium SSD v2\u00a0disk has no tiers. You set its capacity in 1\u00a0GiB steps, up to 64\u00a0TiB, then set IOPS and throughput on their own. Every v2\u00a0disk includes 3,000\u00a0IOPS and 125\u00a0MB/s at no extra charge.",
        },
        {
          kind: "p",
          text: "At the same East US list prices, v2 charges three meters by the hour:",
        },
        {
          kind: "ul",
          items: [
            "Capacity, at $0.00011 per GiB, which is $0.0803 per GiB over a 730-hour month.",
            "Each IOPS above 3,000, at $0.000007.",
            "Each MB/s above 125, at $0.000055.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Ultra Disk", href: "/learn/glossary/azure-ultra-disk" },
            " charges for capacity, IOPS and throughput too, with nothing included. In East US it lists at $0.000164 per GiB, $0.000068 per IOPS and $0.000479 per MB/s, each by the hour.",
          ],
        },
        {
          kind: "p",
          text: "A VM with Ultra Disk compatibility turned on but no Ultra Disk attached also pays $0.006 per vCPU per hour. On v2 and Ultra Disk, you can change a disk’s performance four times in 24\u00a0hours.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "what-one-disk-costs-on-each-of",
      title: "One disk, five prices",
      blocks: [
        { kind: "h3", id: "a-1-024-gib-database-disk", title: "A 1,024\u00a0GiB database disk" },
        {
          kind: "callout",
          label: "Worked example",
          text: "Take a 1,024\u00a0GiB data disk under a production database that needs 5,000\u00a0IOPS and 200\u00a0MB/s. The prices are East US pay-as-you-go list prices for LRS on 1 November 2026, from Microsoft’s Azure Retail Prices API, over a 730-hour month.",
        },
        {
          kind: "table",
          columns: [
            { label: "Disk type", width: "15%" },
            { label: "Set up as", width: "27%" },
            { label: "Cost a month", width: "18%" },
            { label: "Gives 5,000\u00a0IOPS and 200\u00a0MB/s?", width: "40%" },
          ],
          rows: [
            [
              "Standard HDD",
              "S30, 1,024\u00a0GiB",
              "$40.96, plus transactions",
              "No: up to 500\u00a0IOPS and 60\u00a0MB/s, or 1,500 and 150 with performance plus",
            ],
            [
              "Standard SSD",
              "E30, 1,024\u00a0GiB",
              "$76.80, plus transactions",
              "No: up to 500\u00a0IOPS and 100\u00a0MB/s, or 1,500 and 150 with performance plus",
            ],
            ["Premium SSD v2", "1,024\u00a0GiB, 5,000\u00a0IOPS, 200\u00a0MB/s", "$95.46", "Yes"],
            ["Premium SSD", "P30, 1,024\u00a0GiB", "$135.17", "Yes"],
            ["Ultra Disk", "1,024\u00a0GiB, 5,000\u00a0IOPS, 200\u00a0MB/s", "$440.73", "Yes"],
          ],
        },
        {
          kind: "p",
          text: "Of the three types that reach 5,000\u00a0IOPS, v2 costs least. Its $95.46 adds up from three meters:",
        },
        {
          kind: "ul",
          items: [
            [{ b: "Capacity:" }, " 1,024 × $0.0803 = $82.23."],
            [{ b: "IOPS:" }, " 2,000 above the included 3,000, × $0.000007 × 730 = $10.22."],
            [
              { b: "Throughput:" },
              " 75\u00a0MB/s above the included 125, × $0.000055 × 730 = $3.01.",
            ],
          ],
        },
        {
          kind: "p",
          text: "That’s $39.71 a month less than the P30, or 29%, for the same performance.",
        },
        {
          kind: "p",
          text: "Ultra Disk charges for every IOPS you set. Its 5,000\u00a0IOPS alone cost 5,000 × $0.000068 × 730 = $248.20 a month, more than the whole P30.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "h3",
          id: "a-128-gib-disk-with-light-i",
          title: "A 128\u00a0GiB disk with light I/O",
        },
        {
          kind: "p",
          text: "On a small, quiet disk, v2 and Standard SSD sit close. A 128\u00a0GiB v2\u00a0disk costs 128 × $0.0803 = $10.28 a month, with 3,000\u00a0IOPS included. A 128\u00a0GiB Standard SSD, an E10, costs $9.60 plus transactions, for up to 500\u00a0IOPS.",
        },
        {
          kind: "p",
          text: "A P10 of the same size costs $19.71 for 500\u00a0IOPS: nearly twice the v2 price, for a sixth of its included IOPS.",
        },
        {
          kind: "p",
          text: [
            "Prices differ by region and change over time, so check yours on the managed disks pricing page. The ",
            { a: "Azure disk pricing calculator", href: "/ebs-and-azure-disk-pricing" },
            " shows what a Premium SSD or Standard SSD disk costs a month at list price.",
          ],
        },
      ],
    },
    {
      id: "which-azure-disk-type-to-choose-for",
      title: "How to choose",
      blocks: [
        {
          kind: "p",
          text: "A VM boots from its OS disk and keeps application data on data disks. Choose the type for each disk by its job.",
        },
        { kind: "h3", id: "the-azure-os-disk-type", title: "OS disk" },
        {
          kind: "p",
          text: "An OS disk can be Premium SSD, Standard SSD or Standard HDD. Microsoft says Standard HDD doesn’t suit OS disks, and retires its use as one on 8 September 2028.",
        },
        {
          kind: "p",
          text: "Use Premium SSD for the OS disk when uptime matters. A single VM gets Microsoft’s highest uptime service level agreement (SLA) only on premium disks. That needs a Premium SSD OS disk, and data disks on Premium SSD, v2 or Ultra Disk. Standard SSD suits a lightly used VM, such as one for dev and test.",
        },
        {
          kind: "h3",
          id: "azure-data-disk-types-in-order",
          title: "Data disks",
        },
        {
          kind: "p",
          text: "All five types work as data disks. Go down this list for each disk, and take the first type that fits:",
        },
        {
          kind: "ol",
          items: [
            [
              { b: "Ultra Disk" },
              " when one disk needs more than 80,000\u00a0IOPS or 2,000\u00a0MB/s, the most v2 gives.",
            ],
            [
              { b: "Standard HDD" },
              " for backups, rarely read data and latency-tolerant workloads with large, sequential I/O.",
            ],
            [
              { b: "Standard SSD" },
              " for light I/O, such as web servers and dev and test disks within 500\u00a0IOPS and 100\u00a0MB/s. Busy disks pay more in transactions, and ",
              {
                a: "Premium SSD vs Standard SSD on Azure",
                href: "/learn/premium-ssd-vs-standard-ssd-azure",
              },
              " works out the break-even.",
            ],
            [
              { b: "Premium SSD" },
              " where v2 can’t go. That means a disk that needs host caching or ZRS, or one used with Azure Compute Gallery. It also means a VM whose region or zone doesn’t offer v2. ",
              { a: "Premium SSD v2 vs Premium SSD", href: "/learn/premium-ssd-v2-vs-premium-ssd" },
              " covers each limit.",
            ],
            [
              { b: "Premium SSD v2" },
              " for every other data disk. In the worked example, it costs least of the types that meet the need.",
            ],
          ],
        },
        { kind: "svg", figure: figure3 },
      ],
    },
    {
      id: "settings-that-sit-on-top-of-the",
      title: "Redundancy, tiers and bursting",
      blocks: [
        {
          kind: "ul",
          items: [
            [
              { b: "Redundancy." },
              " Every type offers LRS, which keeps three copies of the data in one datacenter. Only Premium SSD and Standard SSD also offer ZRS, which spreads the copies across three availability zones. In East US a P20 lists at $109.81 a month on ZRS, 1.5 times its LRS price of $73.22. ",
              { a: "Azure LRS vs ZRS", href: "/learn/azure-disk-lrs-vs-zrs" },
              " covers when that’s worth it.",
            ],
            [
              { b: "Performance tiers." },
              " A Premium SSD can run at a higher tier’s IOPS and throughput without growing. Most tier changes need no downtime. You pay the higher tier’s price while the disk runs at it, as ",
              { a: "Azure disk performance tiers", href: "/learn/azure-disk-performance-tiers" },
              " explains.",
            ],
            [
              { b: "Bursting." },
              " Premium SSD up to 512\u00a0GiB and Standard SSD up to 1,024\u00a0GiB burst on credits, at no extra cost and on a best-effort basis. A larger Premium SSD can use on-demand bursting, which you turn on and pay for.",
            ],
          ],
        },
      ],
    },
    {
      id: "how-to-change-a-disk-type-in",
      title: "Change a disk type",
      blocks: [
        {
          kind: "p",
          text: "You can switch a disk between Premium SSD, Standard SSD and Standard HDD directly. Microsoft calls the conversion instantaneous, but it needs a VM restart, so plan a maintenance window. You can change a disk’s type twice a day.",
        },
        {
          kind: "p",
          text: "A move to Premium SSD also needs a VM size that supports Premium storage.",
        },
        {
          kind: "code",
          lang: "bash",
          code: "az vm deallocate --resource-group <resource-group> --name <vm-name>\naz disk update --sku Premium_LRS --name <disk-name> --resource-group <resource-group>\naz vm start --resource-group <resource-group> --name <vm-name>",
        },
        {
          kind: "p",
          text: "A data disk can move to Premium SSD v2 the same way. For that move:",
        },
        {
          kind: "ul",
          items: [
            [{ b: "Settings." }, " Turn off host caching and bursting on the disk first."],
            [
              { b: "Backups." },
              " A VM with Azure Backup needs the Enhanced Backup policy first. Azure Backup then takes a full snapshot of the new disk, and that snapshot is charged.",
            ],
            [{ b: "Performance." }, " The disk runs degraded until the conversion completes."],
            [
              { b: "Batches." },
              " For many disks, Microsoft suggests converting 50 to 100 at a time per subscription per region.",
            ],
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "There’s no direct switch out of Premium SSD v2, and in most cases none into or out of Ultra Disk. Each of those moves means creating a new disk from a snapshot.",
        },
      ],
    },
    {
      id: "where-amoeba-fits",
      title: "Where Amoeba fits",
      blocks: [
        {
          kind: "p",
          text: [
            "The disk type sets the price per GiB, and the provisioned size sets how many GiB you pay for. Azure lets a managed disk ",
            { a: "grow but not shrink", href: "/learn/shrink-azure-managed-disk" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " rightsizes block storage on Azure and AWS without any downtime. It moves a VM’s data disks onto one btrfs pool sized to your data, with room to grow. It works on running Windows and Linux VMs and never touches the OS disk.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Disk type." },
              " On Azure the pool uses Premium SSD v2 where your VM’s region and zone offer it, and Premium SSD otherwise. Pool disks are locally redundant, so data on ZRS disks loses its zone redundancy.",
            ],
            [
              { b: "Rightsizing." },
              " It grows the pool before it fills, and sooner when data arrives fast. When your data goes down and stays down, it shrinks the pool one disk at a time.",
            ],
            [
              { b: "The move." },
              " Amoeba copies your data while your services run. Then it switches each mount to the pool, with a short restart of the services that use it. If the switch fails, it puts the original mounts back and tries again.",
            ],
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
      title: "“Select a disk type for Azure IaaS VMs - managed disks”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-types",
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
    {
      publisher: "Microsoft Learn",
      title: "“Best practices for high availability with Azure VMs and managed disks”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-high-availability",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Redundancy options for Azure managed disks”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-redundancy",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Performance tiers for Azure Premium SSD managed disks”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-change-performance",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Managed disk bursting”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disk-bursting",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Convert managed disks storage between different disk types”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-convert-types",
    },
  ],
  related: [
    {
      title: "Premium SSD v2 vs Premium SSD",
      where: "Learn",
      href: "/learn/premium-ssd-v2-vs-premium-ssd",
    },
    {
      title: "Azure Premium SSD vs Standard SSD",
      where: "Learn",
      href: "/learn/premium-ssd-vs-standard-ssd-azure",
    },
    {
      title: "Azure disk performance tiers",
      where: "Learn",
      href: "/learn/azure-disk-performance-tiers",
    },
    {
      title: "Azure LRS vs ZRS for managed disks",
      where: "Learn",
      href: "/learn/azure-disk-lrs-vs-zrs",
    },
    {
      title: "Azure disk reservations: are they worth it?",
      where: "Learn",
      href: "/learn/azure-disk-reservations",
    },
  ],
  relatedTitle: "More on Azure managed disks",
};
