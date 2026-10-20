import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/azure-disk-cost-optimization/1";

export const article: Article = {
  slug: "azure-disk-cost-optimization",
  title: "Azure disk cost optimization: pay for your data",
  meta: "Azure disk cost optimization starts with the bill: size tiers billed hourly, Premium SSD v2 performance, transactions, snapshots, and why disks only grow.",
  h1: "Azure disk cost optimization: stop paying for empty space",
  deck: "What a managed disk bills for, why the space you bought stays on the bill, and how to pay for your data instead.",
  card: "What Azure bills a managed disk for, why disks only grow, and how Amoeba sizes a pool to your data.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Azure block storage",
  published: "2026-10-21",
  updated: "2026-10-21",
  author: "sheldon",
  short:
    "Azure disk cost optimization starts with the billing rule: a managed disk is billed hourly on the size you provision, rounded up to the nearest size Azure offers, whatever it holds. Premium SSD v2 adds IOPS and throughput above a free baseline. Delete unattached disks, undo raised performance, then size disks to the data. Azure grows a disk in place but never shrinks it, so that last step takes a copy or a pool that resizes.",
  sections: [
    {
      id: "what-an-azure-managed-disk-bills-for",
      title: "What an Azure managed disk bills for",
      blocks: [
        {
          kind: "p",
          text: "Every disk type starts from provisioned capacity. Microsoft Learn states that managed disks are billed according to their provisioned size, and that Azure maps that size, rounded up, to the nearest offered disk size. A 200\u00a0GiB Standard SSD is billed as an E15, the 256\u00a0GiB tier. The charge is prorated hourly from the monthly price, and Microsoft’s pricing page is plain about the rest: you’re charged the same rate for your provisioned disk regardless of how much of the disk space is being used.",
        },
        { kind: "p", text: "On top of capacity, each disk type adds its own meters." },
        {
          kind: "table",
          columns: [
            { label: "Disk type", width: "14%" },
            { label: "What you’re billed for", width: "84%" },
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
              "Its size tier, S4 to S80, plus transactions counted in 16\u00a0KiB units, billed per 10,000 and capped per disk per hour",
              "None",
            ],
            [
              "Premium SSD v2",
              "Every GiB provisioned (1\u00a0GiB to 64\u00a0TiB), plus IOPS above 3,000 and throughput above 125\u00a0MB/s",
              "None",
            ],
            [
              "Ultra Disk",
              "Its provisioned capacity (4\u00a0GiB to 64\u00a0TiB), plus the IOPS and throughput you set",
              "None",
            ],
          ],
        },
        {
          kind: "p",
          text: "Snapshots are a separate line, covered below. What never appears on the disk line is how full the disk is. A 512\u00a0GiB Premium SSD is billed as a P20 whether it holds 500\u00a0GiB or 5\u00a0GiB.",
        },
      ],
    },
    {
      id: "why-disks-grow-in-place-but-never",
      title: "Why disks grow in place but never shrink",
      blocks: [
        {
          kind: "p",
          text: [
            "Growing a disk is routine. You can expand a managed data disk without deallocating the VM, then grow the partition and the filesystem inside it. One limit applies to Standard HDD, Standard SSD and Premium SSD: a disk at 4\u00a0TiB or less must be detached, with the VM deallocated, before it grows past 4\u00a0TiB. The ",
            { a: "expand guide", href: "/learn/azure-disk-expand-without-downtime" },
            " covers the steps.",
          ],
        },
        {
          kind: "p",
          text: "Shrinking is the other direction, and Azure doesn’t offer it. Microsoft Learn says shrinking an existing disk “isn’t supported and might result in data loss.” So every expansion is one-way. A migration, a bulk import or a log spike pushes a disk up a tier, the data later goes back down, and the tier and its charge stay where the peak left them.",
        },
        {
          kind: "p",
          text: [
            "The worked example on the ",
            { a: "Amoeba page", href: "/amoeba" },
            " shows the scale of it: a VM with four 512\u00a0GiB data disks, 2,048\u00a0GiB in all, holding 1,000\u00a0GiB of data. More than half of what is billed is empty.",
          ],
        },
        { kind: "diagram", figure: figure1 },
        {
          kind: "p",
          text: [
            "To see your own gap, compare each disk’s size with what its filesystem uses. Inside a Linux VM, ",
            { code: "df -Th" },
            " shows each mounted filesystem with its type, size and used space, and ",
            { a: "measuring Azure VM disk usage", href: "/learn/azure-vm-disk-usage" },
            " covers the other ways to read it. The only route to a smaller disk is a copy and a switch, and the steps are in ",
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
      id: "azure-disk-cost-optimization-one-lever-at",
      title: "Azure disk cost optimization, one lever at a time",
      blocks: [
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
            "Deleting a disk deletes its data, so take a snapshot of any disk you might need before you delete it. An empty disk that was never attached or uploaded to isn’t charged for storage, because Azure hasn’t allocated its storage yet. To search every subscription at once, see ",
            { a: "finding unattached disks in Azure", href: "/learn/find-unattached-disks-azure" },
            ".",
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
            "Microsoft positions Standard SSD for web servers, lightly used enterprise applications, and development and test environments, and Premium SSD for production workloads that need high performance and low latency. ",
            { a: "Premium SSD vs Standard SSD", href: "/learn/premium-ssd-vs-standard-ssd-azure" },
            " compares the two. Microsoft’s conversion guide says moving a disk between Premium SSD, Standard SSD and Standard HDD requires a restart of the VM, so plan it for a maintenance window. You can change a disk’s type twice per day.",
          ],
        },
        {
          kind: "p",
          text: [
            "Premium SSD v2 bills capacity, IOPS and throughput separately, and Microsoft describes it as offering higher performance than Premium SSD “while also generally being less costly.” It can’t be an OS disk and doesn’t support host caching. In most regions with availability zones it attaches only to zonal VMs, and once a disk is on Premium SSD v2 you can’t switch it directly to another type. For a side-by-side view of the two, read ",
            { a: "Premium SSD v2 vs Premium SSD", href: "/learn/premium-ssd-v2-vs-premium-ssd" },
            ".",
          ],
        },
        {
          kind: "h3",
          id: "pay-only-for-the-performance-you-use",
          title: "Pay only for the performance you use",
        },
        {
          kind: "p",
          text: [
            "Some Premium SSD sizes can run at a performance tier above the one their size sets, and Microsoft bills the disk at that tier until you change it back. On-demand bursting is available only on P30 and larger disks and stays off until you enable it. Once enabled, it adds an hourly burst enablement fee plus transaction costs for bursts above the provisioned target. On Premium SSD v2, raising IOPS above 3,000 or throughput above 125\u00a0MB/s raises the price, and you can adjust its performance four times in 24\u00a0hours. Look for tiers and performance settings raised for a launch or a load test and never set back. Each option and its limits are in ",
            { a: "Azure disk performance tiers", href: "/learn/azure-disk-performance-tiers" },
            ".",
          ],
        },
        { kind: "h3", id: "keep-snapshots-incremental", title: "Keep snapshots incremental" },
        {
          kind: "p",
          text: [
            "Snapshots are billed on the used size of the data, so a full snapshot of a 500\u00a0GiB disk holding 50\u00a0GiB is billed for 50\u00a0GiB. Full snapshots can sit on Premium SSD storage. Incremental snapshots always sit on Standard HDD storage and hold only the differences since the last snapshot, which Microsoft calls more cost efficient. For the snapshot meters line by line, see ",
            { a: "Azure disk snapshot cost", href: "/learn/azure-disk-snapshot-cost" },
            ".",
          ],
        },
        {
          kind: "h3",
          id: "reserve-premium-ssd-that-wont-change-size",
          title: "Reserve Premium SSD that won’t change size",
        },
        {
          kind: "p",
          text: "Azure disk reservation pricing covers one disk type: Premium SSD from P30 (1\u00a0TiB) to P80 (32\u00a0TiB), for a one-year term. Reservations aren’t available for Premium SSD v2, Standard SSD, Standard HDD, Ultra Disk, or Premium SSD below P30. The managed disks pricing page lists the one-year reserved price per tier. The portal shows the discount over pay-as-you-go when you buy.",
        },
        {
          kind: "p",
          text: "A reservation is bought per disk SKU, not per GiB, so a P40 reservation doesn’t pay for two P30\u00a0disks in Microsoft’s own example. The discount applies hourly, unused reserved capacity doesn’t carry over, and the reservation doesn’t renew automatically. That suits a disk whose size is settled. If you later move its data to a smaller disk, a P40 reservation doesn’t cover the P30 that replaces it. Reservations can be exchanged or refunded, within the limits Azure sets.",
        },
      ],
    },
    {
      id: "estimating-azure-managed-disk-cost",
      title: "Estimating Azure managed disk cost",
      blocks: [
        {
          kind: "p",
          text: "Microsoft’s Azure disk cost calculator is the Azure pricing calculator, which lists the product as Managed Disks under Storage. Price each disk at the tier it’s billed at, not its provisioned size: the 200\u00a0GiB Standard SSD from earlier is an E15. For Premium SSD v2, price the provisioned GiB plus any IOPS and throughput above the free baseline.",
        },
        {
          kind: "p",
          text: "To compare Azure managed disk pricing per TB, divide each tier’s monthly price by its size. The tiers double from one to the next (P30 is 1,024\u00a0GiB, P40 is 2,048\u00a0GiB, P50 is 4,096\u00a0GiB), so a disk just past a boundary pays for nearly twice the space it asked for. Premium SSD v2 has one capacity rate per GiB, so its cost per TiB is that rate times 1,024, before any performance above the baseline.",
        },
        {
          kind: "p",
          text: "Azure disk pricing is listed per region on the pricing page and changes over time, so check the figure for yours on the day you plan.",
        },
      ],
    },
    {
      id: "how-amoeba-rightsizes-data-disks-to-the",
      title: "How Amoeba rightsizes data disks to the data",
      blocks: [
        {
          kind: "p",
          text: "One gap remains after those levers: the space a disk provisions beyond what its data uses, which stays because a disk only grows. Amoeba, Zoorik’s block storage optimization for Azure managed disks and Amazon EBS, works on that gap for the data disks of running VMs. It moves each VM’s data disks onto one pool, then rightsizes the pool as the data changes.",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "The pool." },
              " Amoeba installs its agent through Azure Run Command and builds one btrfs pool beside your disks, on Premium SSD v2 where the region and zone offer it and on Premium SSD otherwise. It sizes the pool from the highest use of the last 7\u00a0days, so the pool sits inside its target band with room for the largest recent 15-minute rise and at least 10\u00a0GiB free. Each data mount becomes a subvolume mounted at its old path, so application code needs no changes.",
            ],
            [
              { b: "The switch." },
              " Once ",
              { code: "rsync" },
              " has copied the data, the agent stops the systemd services that hold the data mounts open, checks that the final pass has nothing left to copy, mounts the pool at the same paths and starts the services again. That restart is the service interruption. If the switch fails, the agent puts the original mounts back and Amoeba tries again, so services can restart more than once. A 2-hour soak follows, and a move only goes forward.",
            ],
            [
              { b: "Growing." },
              " Amoeba holds each pool between 80% and 90% full by default. When its lowest use over the last 30\u00a0minutes is above that band, it grows a disk in place or adds one while the pool stays mounted. When free space falls below 5% of the pool or 10\u00a0GiB, whichever is larger, or would reach that floor within 30\u00a0minutes at the last 10\u00a0minutes’ fill rate, it runs an urgent expand.",
            ],
            [
              { b: "Shrinking." },
              " Shrinks start once the move is done and 7 full days of data are in. The agent moves one disk’s data onto the others with ",
              { code: "btrfs device remove" },
              ", and Amoeba detaches and deletes the empty disk, which stops its billing. In “Manual”, each shrink waits for you.",
            ],
            [
              { b: "The source disks." },
              " After the soak, each source disk is detached, snapshotted and deleted once its incremental snapshot is complete. The snapshot is kept for 7\u00a0days.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "What it costs you: during the move you pay for both sets of disks, from the moment the pool’s disks are created until the source disks are deleted after the soak, then for the snapshots for 7\u00a0days. Data on Standard HDD or Standard SSD also moves to Premium SSD v2 or Premium SSD, so check the estimate for those VMs. Pool disks are locally redundant, so data on ",
            { a: "zone-redundant (ZRS) disks", href: "/learn/azure-disk-lrs-vs-zrs" },
            " loses zone redundancy.",
          ],
        },
        {
          kind: "p",
          text: "Amoeba works on the data disks of Windows and Linux VMs. The VM needs 3 free data-disk slots: 2 for the pool and 1 kept free for an urgent expand. On Linux it needs systemd, kernel 5.14 or later and btrfs loaded or loadable, and every process that keeps a data mount open must run as a systemd service. VMs whose OS is in the Red Hat family are not moved.",
        },
        {
          kind: "p",
          text: [
            "Amoeba prices disks from the Azure Retail Prices API for the disk type and region, with a 730-hour month. To see your own figure first, the ",
            { a: "free block storage assessment", href: "/assessment?p=amoeba" },
            " runs in your terminal, writes one PDF and sends nothing to Zoorik. Amoeba is in early access.",
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
    { title: "Block storage cost optimization with Amoeba", where: "Amoeba", href: "/amoeba" },
  ],
};
