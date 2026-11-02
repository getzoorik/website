import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/azure-disk-iops-vs-throughput/1";
import { figure as figure2 } from "@/features/learn/figures/azure-disk-iops-vs-throughput/2";
import { figure as figure3 } from "@/features/learn/figures/azure-disk-iops-vs-throughput/3";

export const article: Article = {
  slug: "azure-disk-iops-vs-throughput",
  title: "Azure disk IOPS vs throughput: what limits disks",
  meta: "Azure disk IOPS vs throughput: how disk and VM limits stack, why the smaller one wins, and measuring IOPS on a VM with Azure Monitor and iostat.",
  h1: "Azure disk IOPS vs throughput: what limits your disks",
  deck: "IOPS counts the read and write requests a disk serves each second, and throughput the megabytes they move.",
  card: "IOPS and throughput caps at the disk and the VM, the metrics that show a cap, and what to change.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Azure block storage",
  published: "2026-11-01",
  updated: "2026-11-02",
  author: "ajay",
  cover: "/learn-covers/zoorik-learn-azure-disk-iops-vs-throughput-1200x630.webp",
  coverAlt: "The VM limit and the disk limits both cap I/O, and the smaller limit wins",
  short:
    "Azure caps IOPS and throughput on every managed disk and again on every VM size, and the smaller limit sets your speed.",
  sections: [
    {
      id: "azure-disk-iops-vs-throughput",
      title: "Azure VM IOPS and disk IOPS: the smaller limit sets your speed",
      blocks: [
        {
          kind: "p",
          text: [
            "Take a Standard_D4s_v5 VM with four 512\u00a0GiB P20 ",
            { a: "Premium SSD", href: "/learn/glossary/azure-premium-ssd" },
            " data disks. Each disk has its own pair of limits. Azure VM disk IOPS limits are a second level: each VM size sets a pair for all its disks together, OS disk included.",
          ],
        },
        {
          kind: "p",
          text: "Microsoft’s design guide says the per-VM and per-disk limits “are different and independent of each other.”",
        },
        {
          kind: "table",
          columns: [
            { label: "Limit", width: "62%" },
            { label: "IOPS", width: "16%" },
            { label: "Throughput", width: "22%" },
          ],
          rows: [
            ["One P20 data disk", "2,300", "150\u00a0MB/s"],
            ["Four P20 data disks together", "9,200", "600\u00a0MB/s"],
            ["Standard_D4s_v5, uncached", "6,400", "145\u00a0MB/s"],
          ],
        },
        {
          kind: "p",
          text: "Three P20s already give 6,900\u00a0IOPS, past the VM’s 6,400. So the fourth adds space and no usable IOPS. Throughput runs out sooner: one P20 alone can move more than the VM allows.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: "A database sending 8\u00a0KB requests stops at the VM’s 6,400\u00a0IOPS, moving about 50\u00a0MB/s. A backup reading 1,024\u00a0KB at a time tops out at 145\u00a0MB/s.",
        },
        {
          kind: "p",
          text: [
            { a: "Latency", href: "/learn/glossary/disk-latency" },
            ", the time one request takes, is what your application feels. Microsoft’s performance page warns that capping “can lead to negative consequences like increased latency.”",
          ],
        },
        {
          kind: "callout",
          label: "For engineers",
          text: "On sizes that support host caching, reads served from the host cache count only against a separate cached limit. Premium SSD v2 doesn’t support host caching. The D4s_v5 can also burst uncached traffic to 20,000\u00a0IOPS and 1,200\u00a0MB/s for up to 30\u00a0minutes at a time.",
        },
      ],
    },
    {
      id: "request-size-decides-which-limit-you-reach",
      title: "IOPS vs throughput: request size decides which limit you reach first",
      blocks: [
        {
          kind: "p",
          text: [
            "Requests come in different sizes. Microsoft’s performance guide ties the two measures together: ",
            { a: "IOPS", href: "/learn/glossary/iops" },
            " multiplied by I/O size equals ",
            { a: "throughput", href: "/learn/glossary/disk-throughput" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "Microsoft’s worked example uses a P30 Premium SSD, provisioned for 5,000\u00a0IOPS and 200\u00a0MB/s. With 8\u00a0KB requests, it reaches 5,000\u00a0IOPS at only 40\u00a0MB/s. With 1,024\u00a0KB requests, it gets to 200\u00a0MB/s at only 200\u00a0IOPS.",
        },
        {
          kind: "p",
          text: "Small random requests, typical of a transactional database, meet the IOPS cap first. Large sequential reads from a backup meet the throughput cap.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: "On Premium SSD and Standard SSD, a request of up to 256\u00a0KiB counts as one I/O operation. A larger one counts as several operations of 256\u00a0KiB, so a 1\u00a0MiB write counts as four.",
        },
      ],
    },
    {
      id: "on-premium-ssd-the-iops-you-need",
      title: "On Premium SSD, the IOPS you need sets the size you pay for",
      blocks: [
        {
          kind: "p",
          text: "On Premium SSD, the size you provision picks the tier. The tier sets capacity, IOPS and throughput together. Microsoft’s design guide advises a disk size “that offers IOPS greater than your application requirement.”",
        },
        {
          kind: "h3",
          id: "how-each-disk-type-sets-its-limits",
          title: "Azure disk IOPS and max IOPS by disk type",
        },
        {
          kind: "p",
          text: "Azure disk IOPS limits come from the disk type and, for most types, its size:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Premium SSD" },
              " sets both limits by ",
              { a: "size tier", href: "/learn/glossary/azure-disk-sizes" },
              ". A P30 (1,024\u00a0GiB) gets 5,000\u00a0IOPS and 200\u00a0MB/s, rising to 20,000\u00a0IOPS and 900\u00a0MB/s on a P80.",
            ],
            [
              { b: "Standard SSD" },
              " gives up to 500\u00a0IOPS and 100\u00a0MB/s on every size from E1 to E50 (4,096\u00a0GiB). So at base limits, a bigger disk below E60 adds only space. Microsoft designs ",
              { a: "Standard SSD", href: "/learn/premium-ssd-vs-standard-ssd-azure" },
              " to reach those limits 99% of the time, against 99.9% for Premium SSD.",
            ],
            [
              { b: "Premium SSD v2" },
              " lets you set capacity (1\u00a0GiB to 64\u00a0TiB), IOPS and throughput separately. IOPS and throughput run from a free baseline of 3,000\u00a0IOPS and 125\u00a0MB/s up to 80,000\u00a0IOPS and 2,000\u00a0MB/s.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Premium SSDs of 512\u00a0GiB and smaller can burst up to 3,500\u00a0IOPS and 170\u00a0MB/s for up to 30\u00a0minutes. ",
            { a: "Azure disk performance tiers", href: "/learn/azure-disk-performance-tiers" },
            " covers bursting and tier changes.",
          ],
        },
        {
          kind: "p",
          text: [
            "Premium SSD v2 works only as a data disk. In most regions with availability zones, it attaches only to zonal VMs. ",
            { a: "Premium SSD v2 vs Premium SSD", href: "/learn/premium-ssd-v2-vs-premium-ssd" },
            " covers what each costs.",
          ],
        },
        {
          kind: "h3",
          id: "a-premium-ssd-sized-for-iops-not",
          title: "A Premium SSD sized for IOPS, not for data",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "A workload needs 5,000\u00a0IOPS from one Premium SSD at its baseline tier. That takes a P30 of 1,024\u00a0GiB, whether it stores 900\u00a0GiB or 90\u00a0GiB. At 90\u00a0GiB, 90 ÷ 1,024 ≈ 9% of what you pay for holds data, and 1,024 − 90 = 934\u00a0GiB holds none.",
        },
        {
          kind: "p",
          text: "A 100\u00a0GiB Premium SSD v2\u00a0disk carries the same 5,000\u00a0IOPS and 200\u00a0MB/s. It needs 2,000\u00a0IOPS and 75\u00a0MB/s set above its free baseline.",
        },
        { kind: "svg", figure: figure3 },
        {
          kind: "p",
          text: [
            "To price those 934\u00a0GiB, enter a 1,024\u00a0GiB Premium SSD with 90\u00a0GiB used in the ",
            { a: "Azure disk pricing calculator", href: "/ebs-and-azure-disk-pricing" },
            ".",
          ],
        },
      ],
    },
    {
      id: "how-to-check-disk-iops-in-an",
      title: "Measuring IOPS on an Azure VM",
      blocks: [
        {
          kind: "p",
          text: "Azure Monitor reports most disk metrics once a minute, while counters inside the VM can report every few seconds.",
        },
        {
          kind: "h3",
          id: "read-the-azure-disk-iops-consumed-percentage",
          title: "Read the Azure disk IOPS consumed percentage metrics",
        },
        {
          kind: "p",
          text: "Azure Monitor’s storage I/O utilization metrics divide use by the limit, on VM series that support premium storage. For each, Microsoft says: “If this value reaches 100%, your application is I/O capped” by that limit.",
        },
        { kind: "p", text: "The metrics come in pairs:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Disk level." },
              " Data Disk IOPS Consumed Percentage with Data Disk Bandwidth Consumed Percentage. The OS disk gets the same two.",
            ],
            [
              { b: "VM level." },
              " VM Uncached IOPS Consumed Percentage, VM Uncached Bandwidth Consumed Percentage and a cached pair for I/O through the host cache.",
            ],
          ],
        },
        { kind: "p", text: "In the Azure portal:" },
        {
          kind: "ol",
          items: [
            "Open the VM and select Metrics in the left pane.",
            "Add Data Disk IOPS Consumed Percentage and set the aggregation to Max.",
            "Apply splitting by LUN (logical unit number, the slot a data disk sits in), so each disk gets its own line.",
            "Repeat for Data Disk Bandwidth Consumed Percentage, then add the two VM Uncached metrics without splitting.",
          ],
        },
        {
          kind: "p",
          text: "Splitting matters. In Microsoft’s example, the data disks averaged about 42% of their IOPS, while LUN 2 and LUN 3 each used about 85%.",
        },
        {
          kind: "p",
          text: "From the Azure CLI, this lists each data disk’s peak in every five-minute window over the last 24\u00a0hours:",
        },
        {
          kind: "code",
          lang: "bash",
          code: 'az monitor metrics list \\\n  --resource <vm-name> \\\n  --resource-group <resource-group> \\\n  --resource-type Microsoft.Compute/virtualMachines \\\n  --metrics "Data Disk IOPS Consumed Percentage" "Data Disk Bandwidth Consumed Percentage" \\\n  --dimension LUN \\\n  --top 64 \\\n  --aggregation Maximum \\\n  --interval 5m \\\n  --offset 24h',
        },
        {
          kind: "p",
          text: [
            "For the VM level, drop ",
            { code: "--dimension" },
            " and use the VM Uncached pair.",
          ],
        },
        {
          kind: "p",
          text: "Data Disk Latency (in preview) adds the average time per I/O in milliseconds. It covers disks on a SCSI controller, not NVMe.",
        },
        { kind: "h3", id: "check-from-inside-the-vm", title: "Check from inside the VM" },
        {
          kind: "p",
          text: [
            "On Linux, ",
            { code: "iostat" },
            " from the sysstat package reports each device at the interval you choose:",
          ],
        },
        { kind: "code", lang: "bash", code: "iostat -d -x -m -y 5" },
        {
          kind: "ul",
          items: [
            [{ b: "IOPS." }, " Add r/s and w/s."],
            [
              { b: "Throughput." },
              " Add rMB/s and wMB/s. The iostat MB is a mebibyte, while Azure’s is 10^6 bytes, so the D4s_v5’s 145\u00a0MB/s shows as about 138.",
            ],
            [
              { b: "Latency." },
              " The r_await and w_await columns give it in milliseconds, queue time included.",
            ],
            [
              { b: "Request size." },
              " The average in KiB is in rareq-sz and wareq-sz, and shows which cap you’re nearer.",
            ],
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "Read a cap from the consumed percentage metrics, not from %util. For devices serving requests in parallel, such as modern SSDs, the iostat man page says %util “does not reflect their performance limits.”",
        },
        {
          kind: "p",
          text: "On a SCSI controller, list the disks with their HCTL address to match each one to its LUN in the portal. The last number is the LUN:",
        },
        { kind: "code", lang: "bash", code: 'lsblk -o NAME,HCTL,SIZE,MOUNTPOINT | grep -i "sd"' },
        {
          kind: "p",
          text: [
            "On an NVMe controller, ",
            { code: "sudo azure-nvme-id" },
            " from the azure-vm-utils package prints each data disk’s LUN.",
          ],
        },
        {
          kind: "p",
          text: "On Windows, the matching PerfMon counters are Disk reads/sec and Disk writes/sec for IOPS, and Disk read bytes/sec and Disk write bytes/sec for throughput.",
        },
      ],
    },
    {
      id: "what-to-change-when-a-disk-or",
      title: "What to change when a disk or the VM is capped",
      blocks: [
        { kind: "p", text: "The fix depends on which level reads 100%:" },
        {
          kind: "ul",
          items: [
            [
              { b: "A disk metric at 100%, VM metrics below." },
              " The disk is the limit. A larger Premium SSD tier, higher settings on a Premium SSD v2\u00a0disk or more disks striped together all raise it. Microsoft’s example stripes two P30\u00a0disks for 10,000\u00a0IOPS or 400\u00a0MB/s, which helps only while the VM can carry the total.",
            ],
            [
              { b: "A VM metric at 100%." },
              " A faster disk won’t help. Moving to a Standard_D8s_v5 doubles the D4s_v5’s limits to 12,800\u00a0IOPS and 290\u00a0MB/s. On a size that supports host caching, Microsoft also recommends ReadOnly caching on read-heavy disks for higher read IOPS.",
            ],
            [
              { b: "IOPS capped, throughput low." },
              " The requests are small. The reverse means they’re large.",
            ],
            [
              { b: "Neither at 100%, latency still high." },
              " Look past the disk limits. Microsoft notes that an apparent disk problem is sometimes a network bottleneck.",
            ],
            [
              { b: "Both far below 100% for weeks." },
              " The disk has more IOPS and throughput than its workload uses. On Premium SSD, the tier that supplies them also sets the size you pay for, and Azure can’t ",
              { a: "shrink a managed disk", href: "/learn/shrink-azure-managed-disk" },
              " in place. So check ",
              { a: "used space inside the VM", href: "/learn/azure-vm-disk-usage" },
              ".",
            ],
          ],
        },
      ],
    },
    {
      id: "how-amoeba-handles-disk-load-in-a",
      title: "How Amoeba handles disk load in a pool",
      blocks: [
        {
          kind: "p",
          text: [
            "Amoeba, Zoorik’s ",
            { a: "block storage optimization", href: "/amoeba" },
            ", works on that last case. It moves the data disks of running Windows and Linux VMs onto one btrfs pool sized to your data.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Disk type." },
              " On Azure the pool uses Premium SSD v2 where your VM’s region and zone offer it, and Premium SSD otherwise. On AWS it uses gp3.",
            ],
            [
              { b: "Disk load." },
              " Amoeba picks pool disks that carry the VM’s measured disk load, within the VM size’s own disk limits.",
            ],
            [
              { b: "Rightsizing." },
              " It grows the pool before it fills, and sooner when data arrives fast. When your data goes down and stays down, it shrinks the pool one disk at a time. A shrink goes ahead only if the disks that stay can still carry the VM’s disk load.",
            ],
            [
              { b: "The move." },
              " Amoeba copies your data while your services run. Then it switches each mount to the pool, with a short restart of the services that use it.",
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
    text: "Amoeba moves a VM’s data disks onto one pool sized to your data, then rightsizes it autonomously, without any downtime after the one switch, one disk at a time. We estimate it takes 50–60% off block storage cost. It is an estimated range, not a promise. The free assessment works out your own figure.",
    links: [
      { label: "Block storage optimization with Amoeba", href: "/amoeba" },
      { label: "Estimate your saving", href: "/assessment?p=amoeba" },
    ],
  },
  sources: [
    {
      publisher: "Microsoft Learn",
      title: "“Virtual machine and disk performance”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-performance",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Disk performance metrics”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-metrics",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Azure managed disk types”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-types",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Azure premium storage: Design for high performance”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/premium-storage-performance",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Dsv5 sizes series”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/general-purpose/dsv5-series",
    },
    {
      publisher: "Microsoft Learn",
      title: "“az monitor metrics”",
      url: "https://learn.microsoft.com/en-us/cli/azure/monitor/metrics",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Use the portal to attach a data disk to a Linux VM”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/linux/attach-disk-portal",
    },
    {
      publisher: "man7.org",
      title: "“iostat(1), Linux manual page”",
      url: "https://man7.org/linux/man-pages/man1/iostat.1.html",
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
      title: "Premium SSD vs Standard SSD on Azure: what you pay for",
      where: "Learn",
      href: "/learn/premium-ssd-vs-standard-ssd-azure",
    },
    {
      title: "Azure managed disk types: pricing and how to choose",
      where: "Learn",
      href: "/learn/azure-managed-disk-types",
    },
    {
      title: "Can you shrink an Azure managed disk?",
      where: "Learn",
      href: "/learn/shrink-azure-managed-disk",
    },
  ],
};
