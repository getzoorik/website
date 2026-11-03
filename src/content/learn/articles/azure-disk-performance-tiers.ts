import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/azure-disk-performance-tiers/1";
import { figure as figure2 } from "@/features/learn/figures/azure-disk-performance-tiers/2";

export const article: Article = {
  slug: "azure-disk-performance-tiers",
  title: "Azure disk performance tiers and bursting",
  meta: "Azure disk performance tiers give a Premium SSD more IOPS without more space. How to change a tier, what it costs, and when bursting costs less.",
  h1: "Azure disk performance tiers",
  deck: "Raise a Premium SSD’s IOPS for a busy period without growing it, and see when bursting costs less.",
  card: "Performance tiers and bursting give a Premium SSD more IOPS. What each costs, and when to use which.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Azure block storage",
  published: "2026-11-01",
  updated: "2026-11-03",
  author: "sheldon",
  cover: "/learn-covers/zoorik-learn-azure-disk-performance-tiers-1200x630.webp",
  coverAlt: "Azure disk performance tiers: the same size disk moves from P20 to P30 for more I/O",
  short:
    "An Azure disk performance tier gives a Premium SSD the IOPS (input/output operations per second) and throughput of a bigger size, without adding space. You change it with the VM running and pay the higher tier’s rate only for the hours you hold it. For short peaks you may need no change: disks of P20 and smaller burst for up to 30\u00a0minutes at no charge.",
  sections: [
    {
      id: "azure-disk-performance-tiers",
      title: "How performance tiers work",
      blocks: [
        {
          kind: "p",
          text: "Take a 512\u00a0GiB Premium SSD data disk under a database. As a P20, it gets 2,300\u00a0IOPS. For one busy week, the database needs 5,000.",
        },
        {
          kind: "p",
          text: "You could grow the disk to 1,024\u00a0GiB, a P30, and pay for that size from then on. Or you could raise its performance tier to P30 for the week, then set it back.",
        },
        {
          kind: "h3",
          id: "every-premium-ssd-starts-at-the-tier",
          title: "The baseline tier",
        },
        {
          kind: "p",
          text: [
            { a: "Premium SSD", href: "/learn/glossary/azure-premium-ssd" },
            " comes in ",
            { a: "size tiers", href: "/learn/glossary/azure-disk-sizes" },
            " from P1 (4\u00a0GiB) to P80 (32,767\u00a0GiB). Each tier has its own ",
            { a: "IOPS", href: "/learn/glossary/iops" },
            " and ",
            { a: "throughput", href: "/learn/glossary/disk-throughput" },
            " limits.",
          ],
        },
        {
          kind: "p",
          text: "A disk’s baseline tier is the smallest tier that holds its size, and Azure charges the disk at that tier. A 128\u00a0GiB disk is a P10, with 500\u00a0IOPS and 100\u00a0MB/s. Raising the performance tier changes these limits, not the size.",
        },
        {
          kind: "p",
          text: [
            "Only Premium SSD has performance tiers. Standard SSD and Standard HDD have size tiers only. On Premium SSD v2 and Ultra Disk, ",
            {
              a: "you set IOPS and throughput directly",
              href: "/learn/premium-ssd-v2-vs-premium-ssd",
            },
            ".",
          ],
        },
        { kind: "h3", id: "how-far-each-disk-size-can-go", title: "How far each size can go" },
        {
          kind: "p",
          text: "Each size can move up only to the tiers Microsoft lists for it. Sizes from P1 to P6 (4 to 64\u00a0GiB) can also reach P50. P60 to P80 are open only to disks larger than 4,096\u00a0GiB.",
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
          text: "Every disk of 4\u00a0TiB or less tops out at P50, and P50 has the same base limits as P40. So without performance plus, a tier change can’t take these disks past 7,500\u00a0IOPS and 250\u00a0MB/s. Microsoft’s higher, expanded limits, from P30 up, need performance plus enabled.",
        },
      ],
    },
    {
      id: "how-to-change-a-disks-performance-tier",
      title: "How to change the tier",
      blocks: [
        {
          kind: "p",
          text: "You can change the tier while the disk is attached to a running VM, with no deallocation and no detach. With the Azure CLI, for the 512\u00a0GiB P20 above:",
        },
        {
          kind: "ol",
          items: [
            {
              text: "Raise the tier to P30.",
              blocks: [
                {
                  kind: "code",
                  lang: "bash",
                  code: "az disk update -n <disk-name> -g <resource-group> --set tier=P30",
                },
              ],
            },
            {
              text: "Check that the disk now reports P30.",
              blocks: [
                {
                  kind: "code",
                  lang: "bash",
                  code: "az disk show -n <disk-name> -g <resource-group> --query tier -o tsv",
                },
              ],
            },
            [
              "When the busy week ends, run the same update with the baseline tier, ",
              { code: "tier=P20" },
              ".",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "In PowerShell, use ",
            { code: "New-AzDiskUpdateConfig -Tier" },
            " with ",
            { code: "Update-AzDisk" },
            ". In the portal, use the disk’s Size + performance page.",
          ],
        },
        { kind: "p", text: "Microsoft’s rules for tier changes:" },
        {
          kind: "ul",
          items: [
            [{ b: "Stepping down." }, " A disk’s tier can go down only once every 12\u00a0hours."],
            [{ b: "The floor." }, " No tier can be set below the disk’s baseline."],
            [
              { b: "Shared disks." },
              " Stop every VM a shared disk is attached to before you change its tier.",
            ],
            [
              { b: "Terraform." },
              " It shuts a running VM down to change the tier, then tries to restart it. The CLI, PowerShell and the portal don’t.",
            ],
            [
              { b: "Older disks." },
              " Disks created before June 2020 show no tier until you update them with their baseline tier.",
            ],
          ],
        },
      ],
    },
    {
      id: "azure-disk-performance-tier-pricing-the-higher",
      title: "Performance tier pricing",
      blocks: [
        {
          kind: "p",
          text: "While a disk runs at a higher tier, Azure charges that tier’s rate. When you set it back, the baseline rate applies again.",
        },
        {
          kind: "p",
          text: "Charges are pro-rated by the hour from the monthly price, on a 730-hour month. So a tier change costs the gap between the two tiers’ monthly prices, only for the hours you hold it.",
        },
        {
          kind: "p",
          text: "East US pay-as-you-go list prices for locally redundant storage (LRS), October 2026:",
        },
        {
          kind: "ul",
          items: [
            "P20: $73.22 a month",
            "P30: $135.17 a month",
            "P40: $259.05 a month",
            "P50: $495.57 a month",
          ],
        },
        {
          kind: "p",
          text: [
            "Prices vary by region and change over time, so check the managed disks pricing page for yours. The ",
            { a: "Azure disk pricing calculator", href: "/ebs-and-azure-disk-pricing" },
            " shows a disk’s monthly list price.",
          ],
        },
        {
          kind: "h3",
          id: "a-busy-week-at-p30-or-a",
          title: "Tier change or bigger disk",
        },
        {
          kind: "p",
          text: "For the 512\u00a0GiB P20, P30 costs $135.17 − $73.22 = $61.95 a month more. The busy week is 168\u00a0hours, so it adds $61.95 × 168 ÷ 730, about $14.",
        },
        {
          kind: "p",
          text: [
            "Growing the disk to 1,024\u00a0GiB gives the same IOPS, but you pay the extra $61.95 every month after the week. A grown disk ",
            { a: "stays at 1,024\u00a0GiB", href: "/learn/shrink-azure-managed-disk" },
            ", because Microsoft says shrinking an existing disk “isn’t supported and might result in data loss.”",
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: "For a need that lasts, the sums flip: a raised tier costs the bigger disk’s price without its space. Grow the disk if you’ll use the space. If you won’t, price Premium SSD v2, which charges for capacity, IOPS and throughput separately.",
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "Without performance plus, P50 gives a disk of 2\u00a0TiB or less the same 7,500\u00a0IOPS and 250\u00a0MB/s as P40. It costs $236.52 a month more in East US, so stop at P40.",
        },
      ],
    },
    {
      id: "azure-disk-bursting-covers-short-peaks-without",
      title: "Azure disk bursting",
      blocks: [
        {
          kind: "p",
          text: "Bursting lets a disk run above its tier’s limits for a while. Premium SSD supports both models below. Standard SSD supports only credit-based bursting.",
        },
        {
          kind: "h3",
          id: "credit-based-bursting-free-for-up-to",
          title: "Credit-based bursting",
        },
        {
          kind: "p",
          text: "It’s on by default and free. It covers Premium SSD of 512\u00a0GiB or less (P20 and below) and Standard SSD up to 1,024\u00a0GiB (E30).",
        },
        {
          kind: "p",
          text: "Each disk has a credit bucket that starts full. It fills while the disk runs below its target and drains while it runs above. Credits build at the disk’s own unused rate: an idle P20 earns 2,300\u00a0IOPS of credit a second, an idle P1 only 120.",
        },
        {
          kind: "p",
          text: "A full bucket lasts up to 30\u00a0minutes at the maximum burst rate, in one go or spread through the day. An empty one refills in less than a day. Microsoft calls it best effort, not guaranteed.",
        },
        {
          kind: "p",
          text: "Every Premium SSD from P1 to P20 bursts to 3,500\u00a0IOPS and 170\u00a0MB/s. That’s a big step for a P4, which has 120\u00a0IOPS. Standard SSD bursts less: 600\u00a0IOPS and 150\u00a0MB/s up to E20, and 1,000\u00a0IOPS and 250\u00a0MB/s on E30.",
        },
        {
          kind: "h3",
          id: "on-demand-bursting-no-time-limit-charged",
          title: "On-demand bursting",
        },
        {
          kind: "p",
          text: "On-demand bursting is for Premium SSD larger than 512\u00a0GiB, and you enable it yourself. The disk can then burst to 30,000\u00a0IOPS and 1,000\u00a0MB/s, as often and as long as the workload needs. On a 1\u00a0TiB P30, that’s six times its 5,000 provisioned IOPS.",
        },
        {
          kind: "p",
          text: "It’s charged in two parts. A flat enablement fee runs from when you enable it until you disable it, whether the disk is attached or not. Burst transactions above the provisioned target come on top. In East US in October 2026, the fee is $24.576 a month, and burst transactions cost $0.005 per 10,000.",
        },
        {
          kind: "p",
          text: "You can enable it only while the disk is detached or its VM is stopped, so plan for that downtime. You can disable it 12\u00a0hours after enabling it, and a tier change doesn’t turn it off.",
        },
        {
          kind: "code",
          lang: "bash",
          code: "az disk update --name <disk-name> --resource-group <resource-group> --enable-bursting true",
        },
        {
          kind: "p",
          text: [
            "To disable it, run the same command with ",
            { code: "--enable-bursting false" },
            ".",
          ],
        },
        {
          kind: "callout",
          label: "For engineers",
          text: "Every uncached read or write above the provisioned IOPS or throughput target counts as a burst transaction. Azure converts throughput above the target into transactions of 256\u00a0KB each. When both run over, it charges the larger count.",
        },
      ],
    },
    {
      id: "tier-change-or-burst-which-costs-less",
      title: "Tier change or burst",
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
              "Every Premium SSD size, up to the tiers it allows",
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
          kind: "callout",
          label: "Worked example",
          text: "A 1\u00a0TiB P30 needs P40’s 7,500\u00a0IOPS at busy times: 2,500\u00a0IOPS above its own 5,000.",
        },
        {
          kind: "ol",
          items: [
            [
              { b: "The burst." },
              " On-demand bursting counts 2,500 × 3,600\u00a0seconds = 9,000,000 burst transactions an hour. That’s 900 units of 10,000, so each hour costs 900 × $0.005 = $4.50 in East US.",
            ],
            [{ b: "The tier." }, " P40 for the whole month adds $259.05 − $135.17 = $123.88."],
            [
              { b: "The break-even." },
              " Take away the $24.576 fee: $123.88 − $24.576 = $99.30. That pays for $99.30 ÷ $4.50 = about 22\u00a0hours of burst a month.",
            ],
          ],
        },
        { kind: "p", text: "Past about 22\u00a0hours a month, P40 costs less, on IOPS alone." },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: "Microsoft says the same: if a workload often runs above its target, bursting isn’t cost-effective, and a higher tier serves it better.",
        },
        {
          kind: "h3",
          id: "how-to-choose-for-your-own-disk",
          title: "How to choose",
        },
        { kind: "p", text: "Take these in order:" },
        {
          kind: "ol",
          items: [
            [
              { b: "Find the limit." },
              " If Data Disk IOPS Consumed Percentage or Data Disk Bandwidth Consumed Percentage reaches 100%, the disk is the limit. If VM Uncached IOPS Consumed Percentage or VM Uncached Bandwidth Consumed Percentage does, ",
              { a: "the VM is the limit", href: "/learn/azure-disk-iops-vs-throughput" },
              ", and no disk tier will lift it.",
            ],
            [
              { b: "Leave short peaks to credits." },
              " On P20 and smaller, peaks of up to 30\u00a0minutes within the burst limits need no change. Data Disk Used Burst IO Credits Percentage, reported every 5\u00a0minutes, shows how much of the bucket they use.",
            ],
            [
              { b: "Burst on demand for unpredictable peaks." },
              " On a disk over 512\u00a0GiB, this fits while the peaks add up to fewer hours a month than your break-even.",
            ],
            [
              { b: "Raise the tier for a busy period you can see coming." },
              " Raise it at the start and set it back at the end.",
            ],
            [
              { b: "Grow the disk for a need that won’t go away." },
              " If you won’t use the space, price Premium SSD v2 instead.",
            ],
          ],
        },
      ],
    },
    {
      id: "how-amoeba-sizes-block-storage-to-your",
      title: "Where Amoeba fits",
      blocks: [
        {
          kind: "p",
          text: "Premium SSD ties performance to size. So a disk grown for IOPS carries space its data doesn’t use, and you pay for that space every month.",
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
              { b: "The move." },
              " Amoeba copies your data while your services run. Then it switches each mount to the pool, with a short restart of the services that use it.",
            ],
            [
              { b: "Rightsizing." },
              " It grows the pool before it fills, and sooner when data arrives fast. When your data goes down and stays down, it shrinks the pool one disk at a time. So you pay for close to what you use.",
            ],
            [
              { b: "Disk type." },
              " On Azure the pool uses Premium SSD v2 where your VM’s region and zone offer it, and Premium SSD otherwise.",
            ],
            [
              { b: "Performance." },
              " Amoeba picks pool disks that carry the VM’s measured disk load. A shrink goes ahead only if the disks that stay can still carry it.",
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
      title: "Azure disk IOPS vs throughput",
      where: "Learn",
      href: "/learn/azure-disk-iops-vs-throughput",
    },
    {
      title: "Can you shrink an Azure managed disk?",
      where: "Learn",
      href: "/learn/shrink-azure-managed-disk",
    },
    {
      title: "Azure disk types",
      where: "Learn",
      href: "/learn/azure-managed-disk-types",
    },
  ],
};
