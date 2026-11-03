import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/azure-disk-reservations/1";
import { figure as figure2 } from "@/features/learn/figures/azure-disk-reservations/2";

export const article: Article = {
  slug: "azure-disk-reservations",
  title: "Azure disk reservations: are they worth it?",
  meta: "Azure disk reservations cover only Premium SSD, P30 to P80, for one year. How the discount works, when it pays off, and what to fix before you buy.",
  h1: "Azure disk reservations: are they worth it?",
  deck: "What a reservation covers, how its discount works, and what to fix before you buy one.",
  card: "What Azure disk reservations cover, when they pay off, and why to size disks first.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Azure block storage",
  published: "2026-10-21",
  updated: "2026-11-03",
  author: "sheldon",
  cover: "/learn-covers/zoorik-learn-azure-disk-reservations-1200x630.webp",
  coverAlt: "Azure disk reservations: disks charged in full become one pool sized to data",
  short: [
    "Only for Premium SSD disks from P30 to P80 that will stay at one size for the full one-year term. A reservation discounts one disk SKU in one region, hour by hour, and unused hours are lost. So reserve last: delete unattached disks, reset raised performance and size each ",
    { a: "managed disk", href: "/learn/glossary/azure-managed-disk" },
    " to its data first. Azure grows a disk but never shrinks it.",
  ],
  sections: [
    {
      id: "reserve-premium-ssd-that-wont-change-size",
      title: "What a reservation covers",
      blocks: [
        {
          kind: "p",
          text: "An Azure disk reservation is one year of Premium SSD capacity bought in advance, at a discount. Microsoft offers it only for Premium SSD from P30 (1\u00a0TiB) to P80 (32\u00a0TiB), in all production regions.",
        },
        {
          kind: "p",
          text: [
            { a: "Azure disk sizes", href: "/learn/glossary/azure-disk-sizes" },
            " are named by type letter and number: P for ",
            { a: "Premium SSD", href: "/learn/glossary/azure-premium-ssd" },
            ", E for Standard SSD, S for ",
            { a: "Standard HDD", href: "/learn/glossary/azure-standard-hdd" },
            ". A P30 is a 1,024\u00a0GiB Premium SSD, charged as one whether it holds 1,000\u00a0GiB or 5\u00a0GiB.",
          ],
        },
        {
          kind: "table",
          columns: [
            { label: "Disk type", width: "18%" },
            { label: "What you’re charged for", width: "60%" },
            { label: "Reservation", width: "22%" },
          ],
          rows: [
            [
              "Premium SSD",
              "Its size tier, P1 to P80 (4\u00a0GiB to 32,767\u00a0GiB), or a higher performance tier you select. On-demand bursting adds an enablement fee and burst transactions",
              "P30 to P80, one-year term",
            ],
            [
              "Standard SSD",
              "Its size tier, E1 to E80, plus transactions counted in 256\u00a0KiB units, capped per disk per hour",
              "None",
            ],
            [
              "Standard HDD",
              "Its size tier, S4 to S80, plus transactions counted in 16\u00a0KiB units, charged per 10,000 and capped per disk per hour",
              "None",
            ],
            [
              "Premium SSD v2",
              "Every GiB provisioned (1\u00a0GiB to 64\u00a0TiB), plus IOPS above 3,000 and throughput above 125\u00a0MB/s",
              "None",
            ],
            [
              [{ a: "Ultra Disk", href: "/learn/glossary/azure-ultra-disk" }],
              "Every GiB provisioned (4\u00a0GiB to 64\u00a0TiB), plus the IOPS and throughput you set",
              "None",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "No reservation covers ",
            { a: "snapshots", href: "/learn/azure-disk-snapshot-cost" },
            ", which are charged on their used size.",
          ],
        },
        {
          kind: "callout",
          label: "Note",
          text: "A disk reservation isn’t the Ultra Disk reservation fee. That fee is a per-vCPU charge on a VM with Ultra Disk capability enabled and no Ultra Disk attached.",
        },
      ],
    },
    {
      id: "how-the-discount-works",
      title: "How the discount works",
      blocks: [
        {
          kind: "p",
          text: "You buy a reservation per disk SKU, in one region: for example, five P30\u00a0disks in Central US. The quantity is the number of disks. You pay up front or monthly, and buying takes the Owner or Reservation Purchaser role on the subscription.",
        },
        {
          kind: "p",
          text: "The discount applies automatically to matching disks in the reservation’s scope: one resource group, one subscription, a management group, or shared across your subscriptions. You can change the scope later.",
        },
        {
          kind: "p",
          text: "The discount applies hourly, and unused reserved capacity doesn’t carry over. It counts disks, not GiB. In Microsoft’s example, a P40 reservation doesn’t pay for two P30\u00a0disks, though 2 × 1,024\u00a0GiB equals the P40’s 2,048\u00a0GiB.",
        },
        {
          kind: "p",
          text: "The term starts at purchase and doesn’t renew automatically. Azure emails you 30 days before it ends, and then the disks go back to pay-as-you-go rates. You can exchange or refund a reservation within limits Azure sets.",
        },
        {
          kind: "h3",
          id: "are-azure-disk-reservations-worth-it",
          title: "When it’s worth it",
        },
        {
          kind: "p",
          text: "A reservation pays when a matching disk stays at the reserved SKU for the whole year. If the disk moves to another tier, changes type or is deleted, the reserved hours can go unused.",
        },
        {
          kind: "p",
          text: "To compare, the managed disks pricing page lists each tier’s one-year reserved price beside its pay-as-you-go price. The portal also shows the discount when you buy.",
        },
        {
          kind: "p",
          text: [
            "Microsoft advises tracking usage in disk SKUs, not capacity, and planning disk and ",
            { a: "VM reservations", href: "/learn/glossary/reserved-instance" },
            " together.",
          ],
        },
        {
          kind: "callout",
          label: "Rule of thumb",
          text: "Reserve only disks you’ve already sized to their data and expect to keep at that SKU for the full year.",
        },
      ],
    },
    {
      id: "a-managed-disk-is-charged-for-its-size",
      title: "Why size comes first",
      blocks: [
        {
          kind: "p",
          text: "A managed disk is charged on its provisioned size, rounded up to the nearest offered size, whatever it holds. A 200\u00a0GiB Standard SSD is charged as an E15, the 256\u00a0GiB tier. The charge is prorated hourly from the monthly price.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "A VM has four 512\u00a0GiB data disks holding 1,000\u00a0GiB of data. You pay for 4 × 512 = 2,048\u00a0GiB. That leaves 2,048 − 1,000 = 1,048\u00a0GiB, 51% of what you pay for, holding nothing.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: "A reservation discounts the size you pay for, empty space included. It doesn’t remove the empty space.",
        },
        { kind: "h3", id: "why-disks-grow-in-place-but-never", title: "Disks only grow" },
        {
          kind: "p",
          text: "A bulk import or a log spike fills a disk. Someone expands it a tier, say from a P30 (1,024\u00a0GiB) to a P40 (2,048\u00a0GiB). When the data falls back, the tier and its charge stay where the peak left them.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: [
            "You can usually ",
            { a: "expand a managed data disk", href: "/learn/azure-disk-expand-without-downtime" },
            " without deallocating the VM. Shrinking is another matter: Microsoft Learn says shrinking an existing disk “isn’t supported and might result in data loss.”",
          ],
        },
        {
          kind: "p",
          text: "So a P40 reserved after that spike discounts a tier the data no longer needs, for a whole year.",
        },
      ],
    },
    {
      id: "azure-disk-cost-optimization-one-lever-at",
      title: "Checks before you buy",
      blocks: [
        {
          kind: "p",
          text: "Each step reduces disk cost on its own, and settles the sizes a reservation would lock in. Take them in order.",
        },
        { kind: "h3", id: "delete-the-disks-nobody-uses", title: "Delete unattached disks" },
        {
          kind: "p",
          text: [
            "Deleting a VM leaves its disks by default, and Microsoft notes that you keep paying for unattached disks. An unattached disk has a null ",
            { code: "managedBy" },
            " property. This lists their IDs in the current subscription:",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "az disk list --query '[?managedBy==`null`].[id]' -o tsv",
        },
        {
          kind: "p",
          text: [
            "Deleting a disk deletes its data, so snapshot any disk you might need first. An empty disk never attached or uploaded to isn’t charged for storage. To search every subscription, see ",
            { a: "finding unattached disks in Azure", href: "/learn/find-unattached-disks-azure" },
            ".",
          ],
        },
        { kind: "h3", id: "set-raised-performance-back", title: "Reset raised performance" },
        {
          kind: "p",
          text: [
            "Look for ",
            { a: "performance settings", href: "/learn/azure-disk-performance-tiers" },
            " raised for a launch or a load test and left there:",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Performance tiers." },
              " Some Premium SSD sizes can run at a higher performance tier than their size sets. Azure charges that tier’s price until you change it back.",
            ],
            [
              { b: "On-demand bursting." },
              " Available only on P30 and larger, and off until you enable it. Once on, it adds an enablement fee plus charges for burst transactions.",
            ],
            [
              { b: "Premium SSD v2 performance." },
              " IOPS above 3,000 or throughput above 125\u00a0MB/s raise the price. You can change a disk’s performance four times in 24\u00a0hours.",
            ],
          ],
        },
        {
          kind: "h3",
          id: "match-each-disk-type-to-its-workload",
          title: "Pick the right type",
        },
        {
          kind: "p",
          text: [
            "Microsoft positions Standard SSD for web servers, lightly used enterprise applications, and development and test. It positions ",
            {
              a: "Premium SSD for production workloads",
              href: "/learn/premium-ssd-vs-standard-ssd-azure",
            },
            " that need high performance and low latency.",
          ],
        },
        {
          kind: "p",
          text: "Changing between Premium SSD, Standard SSD and Standard HDD needs a VM restart, so plan it for a maintenance window. A disk’s type can change twice a day.",
        },
        {
          kind: "p",
          text: [
            { a: "Premium SSD v2", href: "/learn/premium-ssd-v2-vs-premium-ssd" },
            " has no reservation. But Microsoft says it offers higher performance than Premium SSD “while also generally being less costly.” It can’t be an OS disk or use host caching. In most regions with availability zones, it attaches only to zonal VMs.",
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "You can’t switch a Premium SSD v2 directly to another type. Moving off it takes a migration through snapshots.",
        },
        { kind: "h3", id: "size-each-disk-to-its-data", title: "Size each disk to its data" },
        {
          kind: "p",
          text: [
            "Compare each disk’s size with ",
            { a: "what its filesystem uses", href: "/learn/azure-vm-disk-usage" },
            ". Inside a Linux VM, ",
            { code: "df -Th" },
            " shows each mounted filesystem with its type, size and used space. The only route to a smaller disk is a copy and a switch: see ",
            {
              a: "Can you shrink an Azure managed disk?",
              href: "/learn/shrink-azure-managed-disk",
            },
            ".",
          ],
        },
      ],
    },
    {
      id: "how-to-estimate-azure-managed-disk-cost",
      title: "Estimate disk cost",
      blocks: [
        {
          kind: "p",
          text: "The Azure pricing calculator lists disks as Managed Disks, under Storage. To price a disk:",
        },
        {
          kind: "ol",
          items: [
            "Use the tier it’s charged at, not its provisioned size. The 200\u00a0GiB Standard SSD above is an E15.",
            {
              text: "Add each meter beyond capacity:",
              blocks: [
                {
                  kind: "ul",
                  items: [
                    "Transactions on Standard SSD and Standard HDD.",
                    "IOPS and throughput on Ultra Disk, and above the free baseline on Premium SSD v2.",
                    "On-demand bursting, where enabled.",
                    "Snapshots, at their used size.",
                  ],
                },
              ],
            },
            "Use your region’s current price. Azure disk prices differ by region and change over time.",
          ],
        },
        {
          kind: "p",
          text: [
            "Our ",
            { a: "Azure disk pricing calculator", href: "/ebs-and-azure-disk-pricing" },
            " shows one disk’s monthly list price and what its empty space costs.",
          ],
        },
        {
          kind: "p",
          text: "Tiers double in size: P30 is 1,024\u00a0GiB, P40 2,048\u00a0GiB and P50 4,096\u00a0GiB. So a disk just past a boundary pays for nearly twice the space it needs.",
        },
      ],
    },
    {
      id: "how-amoeba-rightsizes-data-disks-to-the",
      title: "Where Amoeba fits",
      blocks: [
        {
          kind: "p",
          text: [
            "A reservation discounts a fixed disk size. ",
            { a: "Amoeba", href: "/amoeba" },
            " keeps block storage sized to your data as the data changes.",
          ],
        },
        {
          kind: "p",
          text: "It works on the data disks of running VMs: Azure managed disks and Amazon EBS volumes, on Windows and Linux VMs. It never touches the OS disk or root volume.",
        },
        {
          kind: "p",
          text: "Amoeba moves a VM’s data disks onto one pool sized to your data. It grows the pool before it fills, and shrinks it one disk at a time when your data goes down and stays down. On Azure the pool uses Premium SSD v2 where the VM’s region and zone offer it, and Premium SSD otherwise.",
        },
        {
          kind: "p",
          text: [
            "After the move, it snapshots and deletes the old disks, so don’t reserve disks you plan to move. ",
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
      title: "“Optimize costs for Azure Disk Storage with reservations”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-reserved-capacity",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Understand Azure Disk Storage billing”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-understand-billing",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Select a disk type for Azure IaaS VMs - managed disks”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-types",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Expand Virtual Hard Disks on a Linux VM”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/linux/expand-disks",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Azure CLI - Find and delete unattached managed and unmanaged disks”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/linux/find-unattached-disks",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Convert managed disks storage between different disk types”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-convert-types",
    },
    {
      publisher: "Microsoft Azure",
      title: "“Pricing - Managed Disks”",
      url: "https://azure.microsoft.com/en-us/pricing/details/managed-disks/",
    },
    {
      publisher: "Microsoft Azure",
      title: "“Pricing Calculator”",
      url: "https://azure.microsoft.com/en-us/pricing/calculator/",
    },
  ],
  related: [
    {
      title: "Can you shrink an Azure managed disk?",
      where: "Learn",
      href: "/learn/shrink-azure-managed-disk",
    },
    {
      title: "Premium SSD v2 vs Premium SSD",
      where: "Learn",
      href: "/learn/premium-ssd-v2-vs-premium-ssd",
    },
    {
      title: "Azure snapshot pricing: incremental vs full",
      where: "Learn",
      href: "/learn/azure-disk-snapshot-cost",
    },
    {
      title: "Azure managed disk cost optimization",
      where: "Amoeba",
      href: "/azure-managed-disk-cost-optimization",
    },
  ],
};
