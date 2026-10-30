import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/azure-disk-performance-tiers/1";

export const article: Article = {
  slug: "azure-disk-performance-tiers",
  title: "Azure disk performance tiers and bursting",
  meta: "Azure disk performance tiers give a Premium SSD more IOPS without more space. How to change one, what it costs in East US, and when bursting is cheaper.",
  h1: "Azure disk performance tiers: more IOPS without more space",
  deck: "Raise a Premium SSD’s IOPS for a busy week, set it back after, and see when bursting is the cheaper way.",
  card: "Performance tiers and bursting add IOPS to a Premium SSD. What each costs, and which to use for a busy period.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Azure block storage",
  published: "2026-11-08",
  updated: "2026-11-08",
  author: "sheldon",
  short:
    "Azure disk performance tiers give a Premium SSD managed disk the IOPS (input/output operations per second) and throughput of a bigger size without adding space. A 512\u00a0GiB P20 can run at P30’s 5,000\u00a0IOPS for a busy week, then go back. You pay the higher tier’s price while it’s set, and you can step down only once every 12\u00a0hours. For peaks of up to 30\u00a0minutes, credit-based bursting on P20 and smaller costs nothing extra.",
  sections: [
    {
      id: "what-azure-disk-performance-tiers-are",
      title: "What Azure disk performance tiers are",
      blocks: [
        {
          kind: "p",
          text: "Premium SSD is sized and priced in tiers, P1 (4\u00a0GiB) to P80 (32,767\u00a0GiB), and each tier has its own IOPS and throughput limits. A disk is billed at the smallest tier that holds its size, and that tier becomes its baseline performance tier: a 128\u00a0GiB disk gets P10, with 500\u00a0IOPS and 100\u00a0MB/s. Raising the tier changes the limits and leaves the size alone. Microsoft’s own example sets a 128\u00a0GiB P10 to P50, which gives it 7,500\u00a0IOPS and 250\u00a0MB/s while it stays 128\u00a0GiB, and returns it to P10 when the load drops.",
        },
        {
          kind: "p",
          text: [
            "Azure managed disk performance tiers apply to Premium SSD only. Standard SSD and Standard HDD have size tiers too, but Microsoft supports changing the performance tier only on Premium SSD. Premium SSD v2 and Ultra Disk don’t use performance tiers, because you set their IOPS and throughput directly. ",
            { a: "Premium SSD v2 vs Premium SSD", href: "/learn/premium-ssd-v2-vs-premium-ssd" },
            " compares that model with tiers.",
          ],
        },
        {
          kind: "p",
          text: "Each size moves up only to the tiers Microsoft lists for it, and P1 to P6 (4 to 64\u00a0GiB) can also reach P50.",
        },
        {
          kind: "table",
          columns: [
            { label: "Disk size", width: "17%" },
            { label: "Baseline tier", width: "17%" },
            { label: "Baseline IOPS, MB/s", width: "28%" },
            { label: "Highest tier", width: "17%" },
            { label: "Highest tier’s IOPS, MB/s", width: "21%" },
          ],
          rows: [
            ["128\u00a0GiB", "P10", "500, 100", "P50", "7,500, 250"],
            ["256\u00a0GiB", "P15", "1,100, 125", "P50", "7,500, 250"],
            ["512\u00a0GiB", "P20", "2,300, 150", "P50", "7,500, 250"],
            ["1\u00a0TiB", "P30", "5,000, 200", "P50", "7,500, 250"],
            ["2\u00a0TiB", "P40", "7,500, 250", "P50", "7,500, 250"],
            ["4\u00a0TiB", "P50", "7,500, 250", "None", ""],
            ["8\u00a0TiB", "P60", "16,000, 500", "P80", "20,000, 900"],
            ["16\u00a0TiB", "P70", "18,000, 750", "P80", "20,000, 900"],
            ["32\u00a0TiB", "P80", "20,000, 900", "None", ""],
          ],
        },
        {
          kind: "p",
          text: "Read the table before you pick a tier, because every disk of 4\u00a0TiB or less tops out at P50. Microsoft’s per-disk limits give P50 the same base 7,500\u00a0IOPS and 250\u00a0MB/s as P40. They also list higher expanded limits from P30 up, but only for disks with the performance plus option enabled, so on any other disk below 4\u00a0TiB a tier change can’t take you past P40’s numbers. P60 to P80 are open only to disks larger than 4,096\u00a0GiB.",
        },
      ],
    },
    {
      id: "how-to-change-a-disks-performance-tier",
      title: "How to change a disk’s performance tier",
      blocks: [
        {
          kind: "p",
          text: "You can change an Azure disk’s performance tier while the disk is attached to a running VM, with no deallocation and no detach. With the Azure CLI, one command sets it and one confirms it:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "az disk update -n <disk-name> -g <resource-group> --set tier=P30\naz disk show -n <disk-name> -g <resource-group> --query tier -o tsv",
        },
        {
          kind: "p",
          text: [
            "To set it back, run the same update with the baseline tier. PowerShell does the same with ",
            { code: "New-AzDiskUpdateConfig -Tier" },
            " and ",
            { code: "Update-AzDisk" },
            ", and the portal does it on the disk’s Size + performance page.",
          ],
        },
        { kind: "p", text: "Microsoft’s rules for tier changes:" },
        {
          kind: "ul",
          items: [
            "A disk’s tier can be downgraded only once every 12\u00a0hours.",
            "You can’t set a tier below the disk’s baseline.",
            "A shared disk’s tier can’t change while it’s attached to running VMs, so stop all of them first.",
            "Terraform shuts a running VM down and tries to restart it when it changes the tier. The CLI, PowerShell and the portal avoid that.",
            "Disks created before June 2020 show no tier until you update them with their baseline tier.",
          ],
        },
      ],
    },
    {
      id: "azure-disk-performance-tier-pricing",
      title: "Azure disk performance tier pricing",
      blocks: [
        {
          kind: "p",
          text: "While a disk runs at a higher tier, Azure bills it at that tier’s rate, and at the baseline rate again once you set it back. Billing is by the hour from the monthly price. So the Azure disk performance tier cost is the gap between the two tiers’ monthly prices, for the hours you hold the higher one.",
        },
        {
          kind: "p",
          text: "At East US pay-as-you-go list prices for locally redundant (LRS) disks in October 2026, a P20 costs $73.22 a month, a P30 $135.17, a P40 $259.05 and a P50 $495.57. Prices differ by region and change, so check the managed disks pricing page for yours.",
        },
        {
          kind: "p",
          text: [
            "Take a 512\u00a0GiB P20 that needs 5,000\u00a0IOPS for one busy week: held at P30 for those hours, it costs about $14 more than the week at P20. Growing it to 1,024\u00a0GiB gives the same IOPS for the same $135.17 a month. What separates the two is the week after. A raised tier steps back to P20, while a grown disk stays at 1,024\u00a0GiB, because Microsoft says shrinking an existing disk “isn’t supported and might result in data loss.” ",
            { a: "Shrinking an Azure managed disk", href: "/learn/shrink-azure-managed-disk" },
            " covers what works instead.",
          ],
        },
        { kind: "diagram", figure: figure1 },
        {
          kind: "p",
          text: "For a permanent need the comparison flips, because a raised tier then pays the bigger disk’s price without its space. Grow the disk if you’ll use the space. If you won’t, price Premium SSD v2, which bills capacity, IOPS and throughput separately.",
        },
        {
          kind: "p",
          text: "One trap sits in the price list. On a disk of 2\u00a0TiB or less without performance plus, pick P40 over P50: both give 7,500\u00a0IOPS and 250\u00a0MB/s, and in East US P50 costs $236.52 a month more.",
        },
      ],
    },
    {
      id: "azure-disk-bursting-credit-based-and-on",
      title: "Azure disk bursting: credit-based and on-demand",
      blocks: [
        {
          kind: "p",
          text: "Bursting lets a disk go above its tier’s limits for a while, with no tier change. Premium SSD and Standard SSD support it. Of the two models below, Standard SSD gets only the first.",
        },
        { kind: "h3", id: "credit-based-bursting", title: "Credit-based bursting" },
        {
          kind: "p",
          text: "Azure turns this model on by default, at no extra charge, for Premium SSD of 512\u00a0GiB or less (P20 and below) and for Standard SSD through E30 (1,024\u00a0GiB). Each disk has a credit bucket that starts full, fills while the disk runs below its target and empties while it runs above. A full bucket lasts up to 30\u00a0minutes at the maximum burst rate, in one go or spread through the day, and an empty one refills in less than a day. Microsoft calls it best effort, not guaranteed.",
        },
        {
          kind: "p",
          text: "Every Premium SSD from P1 to P20 bursts to 3,500\u00a0IOPS and 170\u00a0MB/s, a large step for a P4 with 120\u00a0IOPS. Credits build at the disk’s own unused rate. An idle P20 earns 2,300\u00a0IOPS of credit each second, an idle P1 just 120. Standard SSD bursts less: 600\u00a0IOPS and 150\u00a0MB/s up to E20, and 1,000\u00a0IOPS and 250\u00a0MB/s on E30.",
        },
        { kind: "h3", id: "on-demand-bursting", title: "On-demand bursting" },
        {
          kind: "p",
          text: "Azure disk on-demand bursting is for Premium SSD disks larger than 512\u00a0GiB, and you enable it yourself. The disk can then burst to 30,000\u00a0IOPS and 1,000\u00a0MB/s whenever the workload asks, for as long as it asks. For a 1\u00a0TiB P30, that’s six times its 5,000 provisioned IOPS.",
        },
        {
          kind: "p",
          text: "It’s billed in two parts. A flat enablement fee runs from the moment you enable it until you disable it, whether the disk is attached or not. On top of that, every uncached read or write above the provisioned IOPS or throughput target counts as a burst transaction, and those are billed in units of 10,000. Azure converts throughput over the target into transactions at 256\u00a0KB each. When both run over, it bills the larger count. In East US in October 2026, the pricing page lists the fee at $24.576 a month. Burst transactions cost $0.005 per 10,000.",
        },
        {
          kind: "p",
          text: "Enabling it on an existing disk means downtime for that disk, because it has to be detached or its VM stopped first. Once on, it can be disabled only after 12\u00a0hours, and a tier change doesn’t turn it off.",
        },
        {
          kind: "code",
          lang: "bash",
          code: "az disk update --name <disk-name> --resource-group <resource-group> --enable-bursting true",
        },
        {
          kind: "p",
          text: [
            "To disable it later, run the same command with ",
            { code: "--enable-bursting false" },
            ".",
          ],
        },
      ],
    },
    {
      id: "tier-change-or-burst-for-a-busy",
      title: "Tier change or burst for a busy period",
      blocks: [
        {
          kind: "table",
          columns: [
            { label: "", width: "14%" },
            { label: "Credit-based bursting", width: "29%" },
            { label: "On-demand bursting", width: "27%" },
            { label: "Higher performance tier", width: "30%" },
          ],
          rows: [
            [
              "Disks",
              "Premium SSD up to 512\u00a0GiB, Standard SSD up to 1,024\u00a0GiB",
              "Premium SSD over 512\u00a0GiB",
              "Premium SSD, any size, up to the tiers its size allows",
            ],
            [
              "Peak",
              "3,500\u00a0IOPS and 170\u00a0MB/s on Premium SSD",
              "30,000\u00a0IOPS and 1,000\u00a0MB/s",
              "The tier’s limits, at most 20,000\u00a0IOPS and 900\u00a0MB/s",
            ],
            [
              "How long",
              "Up to 30\u00a0minutes from a full bucket, best effort",
              "No time limit",
              "Until you set it back",
            ],
            [
              "Extra cost",
              "None",
              "Enablement fee plus burst transactions",
              "The tier’s price, by the hour",
            ],
            [
              "Turning it on",
              "On by default",
              "Disk detached or VM stopped",
              "One command, VM running",
            ],
            [
              "Going back",
              "Nothing to do",
              "Disable 12\u00a0hours after enabling",
              "One downgrade every 12\u00a0hours",
            ],
          ],
        },
        {
          kind: "p",
          text: "The break-even between bursting and a tier change is worth working out for each disk. Say a 1\u00a0TiB P30 needs P40’s 7,500\u00a0IOPS at busy times. On-demand bursting bills the extra 2,500\u00a0IOPS as 900 units of 10,000 transactions an hour, which is $4.50 at East US rates. P40 for the whole month adds $123.88. Count the $24.576 fee as well, and about 22\u00a0hours of that burst in a month costs as much as the month at P40, on IOPS alone. Microsoft’s guidance points the same way: a workload that often runs above its target is better served by a higher tier.",
        },
        { kind: "p", text: "To choose for your own disk, take these in order:" },
        {
          kind: "ol",
          items: [
            [
              "Find the limit. When the disk metric Data Disk IOPS Consumed Percentage or Data Disk Bandwidth Consumed Percentage reaches 100%, the disk is the limit. When VM Uncached IOPS Consumed Percentage does, the VM is, and a higher disk tier won’t lift it. ",
              { a: "Azure disk IOPS vs throughput", href: "/learn/azure-disk-iops-vs-throughput" },
              " covers both caps.",
            ],
            "Leave peaks of up to 30\u00a0minutes that need no more than 3,500\u00a0IOPS and 170\u00a0MB/s on a P20 or smaller to credit-based bursting. Data Disk Used Burst IO Credits Percentage, reported every 5\u00a0minutes, shows how much of the bucket they use.",
            "Use on-demand bursting for unpredictable peaks on a disk over 512\u00a0GiB, while they add up to fewer hours a month than your break-even.",
            "For a busy period you can see coming, raise the tier at the start and set it back at the end.",
            "For a need that won’t go away, grow the disk if you’ll use the space, or price a type that bills performance apart from capacity.",
          ],
        },
      ],
    },
    {
      id: "how-amoeba-handles-disk-performance",
      title: "How Amoeba handles disk performance",
      blocks: [
        {
          kind: "p",
          text: [
            "Because Premium SSD ties performance to size, a disk grown for IOPS carries space its data doesn’t use, and the bill counts that space. ",
            { a: "Amoeba", href: "/amoeba" },
            " rightsizes block storage from the data side. It moves a VM’s data disks onto one btrfs pool, sized from the highest use of the last 7\u00a0days so the pool sits inside its target band with room for the largest recent 15-minute rise and at least 10\u00a0GiB free. After the move, it expands the pool as the data grows and shrinks it one disk at a time.",
          ],
        },
        {
          kind: "p",
          text: "On Azure, the pool is built from Premium SSD v2 where the region and zone offer it, and from Premium SSD otherwise. Each Premium SSD v2 pool disk gets at least 3,000\u00a0IOPS and 125\u00a0MB/s, and more IOPS when the VM’s own load needs it. A Premium SSD pool disk has the performance of its size tier.",
        },
        {
          kind: "p",
          text: "The agent reports each mount’s size and use every 15\u00a0seconds, and Amoeba decides on expands at every report. Shrinks start only after the move is done and a full 7\u00a0days of data have been collected, and Amoeba checks for one hourly after that. It never detaches and deletes a disk while the pool is at or above the top edge of its target band. By default that band runs from 80% to 90% full. Before a shrink, Amoeba also checks that the disks that stay could serve the VM’s disk load, judged from recent readings, and holds the shrink if they couldn’t. During the 2-hour soak after the switch, p99\u00a0disk latency above 1.2 times its level before the switch pauses the move.",
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
      title: "“Performance tiers for Azure Premium SSD managed disks”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-change-performance",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Change the performance of Azure managed disks”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-performance-tiers",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Managed disk bursting”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disk-bursting",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Enable on-demand disk bursting”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-enable-bursting",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Scalability and performance targets for VM disks”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-scalability-targets",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Disk metrics”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-metrics",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Expand virtual hard disks on a Linux VM”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/linux/expand-disks",
    },
    {
      publisher: "Microsoft Azure",
      title: "“Managed Disks pricing”",
      url: "https://azure.microsoft.com/en-us/pricing/details/managed-disks/",
    },
  ],
  related: [
    {
      title: "Premium SSD v2 vs Premium SSD: which one costs less?",
      where: "Learn",
      href: "/learn/premium-ssd-v2-vs-premium-ssd",
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
