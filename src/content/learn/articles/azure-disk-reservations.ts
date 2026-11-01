import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/azure-disk-reservations/1";
import { figure as figure2 } from "@/features/learn/figures/azure-disk-reservations/2";

export const article: Article = {
  slug: "azure-disk-reservations",
  title: "Azure disk reservations: are they worth it?",
  meta: "Are Azure disk reservations worth it? Only for Premium SSD, P30 to P80, that you’ll keep at one size for a year. Delete unused disks and size to data first.",
  h1: "Azure disk reservations: reserve last, after you stop paying for empty space",
  deck: "What a managed disk is charged for, why you keep paying for the space you bought, and how to pay for your data instead.",
  card: "What Azure charges for a managed disk, why disks only grow, and how Amoeba sizes a pool to your data.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Azure block storage",
  published: "2026-10-21",
  updated: "2026-11-01",
  author: "sheldon",
  cover: "/learn-covers/zoorik-learn-azure-disk-reservations-1200x630.webp",
  coverAlt: "Azure disk cost optimization: disks charged in full become one pool sized to data",
  short: [
    "An Azure disk reservation covers only Premium SSD from P30 to P80, for a one-year term, and it comes last, once disk sizes are settled. First stop paying for empty space: a ",
    { a: "managed disk", href: "/learn/glossary/azure-managed-disk" },
    " is charged hourly on the size you provision, whatever it holds. Premium SSD v2 also charges for IOPS and throughput above a free baseline. Delete unattached disks, set raised performance back, then size disks to the data. Azure grows a disk in place but never shrinks it, so that last step takes a copy or a pool that resizes.",
  ],
  sections: [
    {
      id: "a-managed-disk-is-charged-for-its-size",
      title: "A managed disk is charged for its size, every hour",
      blocks: [
        {
          kind: "p",
          text: "Picture a VM with four 512\u00a0GiB data disks holding 1,000\u00a0GiB of data. Azure charges for all four in full, every hour.",
        },
        {
          kind: "p",
          text: "A managed disk is charged on its provisioned size, which Azure rounds up to the nearest offered disk size. A 200\u00a0GiB Standard SSD is therefore charged as an E15, the 256\u00a0GiB tier.",
        },
        {
          kind: "p",
          text: "The charge is prorated hourly from the monthly price. Microsoft’s pricing page says you’re charged the same rate for your provisioned disk regardless of how much of the disk space is being used.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "The four disks total 4 × 512 = 2,048\u00a0GiB, and the 1,000\u00a0GiB of data fills 1,000 ÷ 2,048 = 49% of it. That leaves 2,048 − 1,000 = 1,048\u00a0GiB, 51% of what you pay for, holding nothing. Each GiB of data carries 2,048 ÷ 1,000 = 2.05\u00a0GiB of disk you pay for.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: [
            { a: "Azure disk sizes", href: "/learn/glossary/azure-disk-sizes" },
            " are named by type letter and number: P for ",
            { a: "Premium SSD", href: "/learn/glossary/azure-premium-ssd" },
            ", E for Standard SSD, S for ",
            { a: "Standard HDD", href: "/learn/glossary/azure-standard-hdd" },
            ". A 512\u00a0GiB Premium SSD is a P20, charged as one whether it holds 500\u00a0GiB or 5\u00a0GiB. On top of capacity, each type adds its own meters, and snapshots are charged separately.",
          ],
        },
        {
          kind: "table",
          columns: [
            { label: "Disk type", width: "14%" },
            { label: "What you’re charged for", width: "80%" },
            { label: "Reservation discount", width: "10%" },
          ],
          rows: [
            [
              "Premium SSD",
              "Its size tier, P1 to P80 (4\u00a0GiB to 32,767\u00a0GiB), or a higher performance tier you select. On-demand bursting adds an hourly flat fee and burst transactions.",
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
              "Its provisioned capacity (4\u00a0GiB to 64\u00a0TiB), plus the IOPS and throughput you set",
              "None",
            ],
          ],
        },
      ],
    },
    {
      id: "why-disks-grow-in-place-but-never",
      title: "Why disks grow in place but never shrink",
      blocks: [
        {
          kind: "p",
          text: "Every expansion is one-way. A migration, a bulk import or a log spike fills a disk. Someone expands it a tier, say from a P30 (1,024\u00a0GiB) to a P40 (2,048\u00a0GiB).",
        },
        {
          kind: "p",
          text: "The data later goes back down, and the tier and its charge stay where the peak left them.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: [
            "Growing is routine. You can ",
            { a: "expand a managed data disk", href: "/learn/azure-disk-expand-without-downtime" },
            " without deallocating the VM, then grow the partition and the filesystem inside it.",
          ],
        },
        {
          kind: "p",
          text: "On Standard HDD, Standard SSD and Premium SSD, a disk of 4\u00a0TiB or less is the exception. To grow it past 4\u00a0TiB, you must detach it and deallocate the VM first.",
        },
        {
          kind: "p",
          text: "Shrinking is the direction Azure doesn’t offer. Microsoft Learn says shrinking an existing disk “isn’t supported and might result in data loss.”",
        },
      ],
    },
    {
      id: "azure-disk-cost-optimization-one-lever-at",
      title: "The levers, one at a time",
      blocks: [
        {
          kind: "p",
          text: [
            "To ",
            { a: "reduce Azure disk costs", href: "/azure-managed-disk-cost-optimization" },
            ", take the levers in order, and reserve last, once sizes are settled.",
          ],
        },
        { kind: "h3", id: "delete-the-disks-nobody-uses", title: "Delete the disks nobody uses" },
        {
          kind: "p",
          text: [
            "When you delete a VM, its disks stay by default, and Microsoft notes that you continue to pay for unattached disks. An unattached disk has a null ",
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
            "Deleting a disk deletes its data, so snapshot any disk you might need first. An empty disk that was never attached or uploaded to isn’t charged for storage, because Azure hasn’t allocated its storage yet. To search every subscription at once, see ",
            { a: "finding unattached disks in Azure", href: "/learn/find-unattached-disks-azure" },
            ".",
          ],
        },
        { kind: "h3", id: "set-raised-performance-back", title: "Set raised performance back" },
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
              " Some Premium SSD sizes can run at a performance tier above the one their size sets. Microsoft then charges that tier’s price until you change it back.",
            ],
            [
              { b: "On-demand bursting." },
              " Available only on P30 and larger disks, it stays off until you enable it. Once enabled, it adds an hourly burst enablement fee plus transaction costs for bursts above the provisioned target.",
            ],
            [
              { b: "Premium SSD v2 performance." },
              " Raising IOPS above 3,000 or throughput above 125\u00a0MB/s raises the price, and you can change a disk’s performance four times in 24\u00a0hours.",
            ],
          ],
        },
        {
          kind: "h3",
          id: "match-each-disk-type-to-its-workload",
          title: "Match each disk type to its workload",
        },
        {
          kind: "p",
          text: [
            "Azure positions Standard SSD for web servers, lightly used enterprise applications, and development and test environments. It positions ",
            {
              a: "Premium SSD for production workloads",
              href: "/learn/premium-ssd-vs-standard-ssd-azure",
            },
            " that need high performance and low latency.",
          ],
        },
        {
          kind: "p",
          text: "Moving a disk between Premium SSD, Standard SSD and Standard HDD requires a VM restart, so plan it for a maintenance window. You can change a disk’s type twice per day.",
        },
        {
          kind: "p",
          text: [
            "Premium SSD v2 charges for capacity, IOPS and throughput separately. Microsoft describes it as ",
            {
              a: "offering higher performance than Premium SSD",
              href: "/learn/premium-ssd-v2-vs-premium-ssd",
            },
            " “while also generally being less costly.” It can’t be an OS disk or use host caching, and in most regions with availability zones it attaches only to zonal VMs.",
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "Once a disk is on Premium SSD v2, you can’t switch it directly to another type. Moving off it later takes a migration through snapshots.",
        },
        { kind: "h3", id: "keep-snapshots-incremental", title: "Keep snapshots incremental" },
        {
          kind: "p",
          text: [
            {
              a: "Snapshots are charged on the used size",
              href: "/learn/azure-disk-snapshot-cost",
            },
            ": a full snapshot of a 500\u00a0GiB disk holding 50\u00a0GiB is charged for 50\u00a0GiB. Full snapshots can sit on Premium SSD storage. Incremental snapshots always sit on Standard HDD storage and hold only the differences since the last snapshot, which Microsoft calls more cost efficient.",
          ],
        },
        { kind: "h3", id: "size-each-disk-to-its-data", title: "Size each disk to its data" },
        {
          kind: "p",
          text: [
            "Compare each disk’s size with ",
            { a: "what its filesystem uses", href: "/learn/azure-vm-disk-usage" },
            ". Inside a Linux VM, ",
            { code: "df -Th" },
            " shows each mounted filesystem with its type, size and used space. The only route to a smaller disk is a copy and a switch, and the steps are in ",
            {
              a: "Can you shrink an Azure managed disk?",
              href: "/learn/shrink-azure-managed-disk",
            },
            ".",
          ],
        },
        {
          kind: "h3",
          id: "reserve-premium-ssd-that-wont-change-size",
          title: "Azure Premium SSD reservation: P30 to P80, one year, one disk size",
        },
        {
          kind: "p",
          text: "Azure disk reservation pricing is available for one disk type, Premium SSD from P30 (1\u00a0TiB) to P80 (32\u00a0TiB), with a one-year term. The managed disks pricing page lists the one-year reserved price per tier, and the portal shows the discount over pay-as-you-go when you buy.",
        },
        {
          kind: "p",
          text: "A reservation is bought per disk SKU. In Microsoft’s own example, a P40 reservation doesn’t pay for two P30\u00a0disks, even though 2 × 1,024\u00a0GiB adds up to the P40’s 2,048\u00a0GiB.",
        },
        {
          kind: "h3",
          id: "are-azure-disk-reservations-worth-it",
          title: "Are Azure disk reservations worth it?",
        },
        {
          kind: "p",
          text: "The discount applies hourly, and unused reserved capacity doesn’t carry over. A reservation doesn’t renew automatically, though it can be exchanged or refunded within the limits Azure sets.",
        },
        {
          kind: "callout",
          label: "Rule of thumb",
          text: "Reserve only for disks you’ve already sized to their data and expect to keep at that tier for the full one-year term.",
        },
      ],
    },
    {
      id: "how-to-estimate-azure-managed-disk-cost",
      title: "How to estimate Azure managed disk cost",
      blocks: [
        {
          kind: "p",
          text: "The Azure pricing calculator doubles as an Azure disk cost calculator, and lists the product as Managed Disks under Storage. To use it:",
        },
        {
          kind: "ol",
          items: [
            "Price each disk at the tier it’s charged at, not its provisioned size. The 200\u00a0GiB Standard SSD from earlier is an E15.",
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
            "Use your region’s price on the day you plan, because Azure disk pricing differs by region and changes over time.",
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
          text: "To compare Azure managed disk pricing per TB, divide each tier’s monthly price by its size. The tiers double from one to the next: P30 is 1,024\u00a0GiB, P40 is 2,048\u00a0GiB and P50 is 4,096\u00a0GiB. So a disk just past a boundary pays for nearly twice the space it asked for.",
        },
        {
          kind: "p",
          text: "Premium SSD v2 has one capacity rate per GiB. Its cost per TiB is that rate times 1,024, before any performance above the baseline.",
        },
      ],
    },
    {
      id: "how-amoeba-rightsizes-data-disks-to-the",
      title: "How Amoeba rightsizes data disks to the data",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            ", Zoorik’s block storage optimization, keeps block storage sized to your data as the data changes. It works on the data disks of running VMs: Azure managed disks and Amazon EBS volumes, on Windows and Linux VMs. It never touches the OS disk or root volume.",
          ],
        },
        {
          kind: "p",
          text: [
            "Amoeba moves a VM’s data disks onto one pool sized to your data, grows it before it fills, and shrinks it one disk at a time when your data goes down and stays down. ",
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
      title: "Premium SSD v2 vs Premium SSD: which one costs less?",
      where: "Learn",
      href: "/learn/premium-ssd-v2-vs-premium-ssd",
    },
    {
      title: "Azure disk snapshot cost: incremental vs full snapshots",
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
