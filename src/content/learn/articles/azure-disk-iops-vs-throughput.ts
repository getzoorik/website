import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/azure-disk-iops-vs-throughput/1";

export const article: Article = {
  slug: "azure-disk-iops-vs-throughput",
  title: "Azure disk IOPS vs throughput: what limits disks",
  meta: "Azure disk IOPS vs throughput: how disk and VM caps stack, why the smaller one wins, and how to read the IOPS consumed percentage metrics on your VM.",
  h1: "Azure disk IOPS vs throughput: what limits your disks",
  deck: "Every disk has two caps, and so does every VM. How they stack, how to read them, and what to change.",
  card: "IOPS and throughput caps at the disk and the VM, the metrics that show a cap, and what to change.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Azure block storage",
  published: "2026-11-11",
  updated: "2026-11-11",
  author: "ajay",
  short:
    "Azure disk IOPS vs throughput comes down to two separate limits. IOPS (input/output operations per second) counts the reads and writes a disk completes each second, and throughput counts the megabytes per second they move. Azure caps both on every managed disk and again on every VM size, and the smallest of those limits sets your speed. A Standard_D4s_v5 VM allows 6,400\u00a0IOPS and 145\u00a0MB/s of uncached disk traffic outside bursts, however many disks you attach.",
  sections: [
    {
      id: "azure-disk-iops-vs-throughput-what-each",
      title: "Azure disk IOPS vs throughput: what each one counts",
      blocks: [
        {
          kind: "p",
          text: "An I/O operation is one read or write request, and requests come in different sizes. IOPS counts the requests while throughput counts the bytes they carry, and Microsoft’s performance guide ties them together: IOPS multiplied by I/O size equals throughput.",
        },
        {
          kind: "p",
          text: "That’s why the same disk can hit either limit first. A P30 Premium SSD is provisioned for 5,000\u00a0IOPS and 200\u00a0MB/s. In Microsoft’s worked example, 8\u00a0KB requests reach the 5,000\u00a0IOPS at only 40\u00a0MB/s, while requests of 1,024\u00a0KB get to 200\u00a0MB/s at only 200\u00a0IOPS. Small random requests, typical of a transactional database, meet the IOPS cap first. Large sequential reads from a backup meet the throughput cap.",
        },
        {
          kind: "p",
          text: "Request size also changes how Azure counts. On Premium SSD and Standard SSD, a request of up to 256\u00a0KiB counts as one I/O operation, and a larger one counts as several operations of 256\u00a0KiB. So a 1\u00a0MiB write counts as four operations.",
        },
        {
          kind: "p",
          text: "Latency, the time one request takes, is the third measure and the one your application feels. Microsoft’s performance page warns that capping “can lead to negative consequences like increased latency.”",
        },
      ],
    },
    {
      id: "azure-disk-iops-and-throughput-limits-stack",
      title: "Azure disk IOPS and throughput limits stack at two levels",
      blocks: [
        {
          kind: "p",
          text: "Azure disk IOPS limits come from the disk type and, for most types, the disk size:",
        },
        {
          kind: "ul",
          items: [
            "Premium SSD sets both limits by size tier. A P20 (512\u00a0GiB) gets 2,300\u00a0IOPS and 150\u00a0MB/s, and a P30 (1,024\u00a0GiB) gets 5,000\u00a0IOPS and 200\u00a0MB/s, rising to 20,000\u00a0IOPS and 900\u00a0MB/s on a P80.",
            [
              { a: "Standard SSD", href: "/learn/premium-ssd-vs-standard-ssd-azure" },
              " gives up to 500\u00a0IOPS and 100\u00a0MB/s on every size from E1 to E50 (4,096\u00a0GiB), so at base limits a bigger disk below E60 adds only space. Microsoft designs it to reach those limits 99% of the time, against 99.9% for Premium SSD.",
            ],
            "Premium SSD v2 lets you set both, from a free baseline of 3,000\u00a0IOPS and 125\u00a0MB/s up to 80,000\u00a0IOPS and 2,000\u00a0MB/s.",
          ],
        },
        {
          kind: "p",
          text: "Azure VM disk IOPS limits are a second, separate layer. Each VM size has its own IOPS and throughput limit for all its disks together, OS disk included. Microsoft’s design guide says the per-VM and per-disk limits “are different and independent of each other.”",
        },
        {
          kind: "p",
          text: "The smaller limit wins. Take a Standard_D4s_v5 with four P20 data disks:",
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
          text: "On this VM, a database sending 8\u00a0KB requests stops at 6,400\u00a0IOPS while moving roughly 50\u00a0MB/s. A backup reading 1,024\u00a0KB at a time tops out at 145\u00a0MB/s, under 150 requests a second. One P20 alone can move 150\u00a0MB/s, more than the VM allows across all four. Past the third P20, extra disks add space and no usable IOPS.",
        },
        { kind: "diagram", figure: figure1 },
        {
          kind: "p",
          text: "On sizes that support host caching, reads served from the host cache count only against a separate cached limit, so a VM with caching on some disks and off on others can use both limits at once. Premium SSD v2 doesn’t support host caching at all. The D4s_v5 can also burst uncached traffic to 20,000\u00a0IOPS and 1,200\u00a0MB/s for up to 30\u00a0minutes at a time, which covers short peaks, not a steady load.",
        },
      ],
    },
    {
      id: "on-premium-ssd-performance-comes-with-the",
      title: "On Premium SSD, performance comes with the size tier",
      blocks: [
        {
          kind: "p",
          text: "On Premium SSD, the size you provision picks the tier, and the tier sets capacity, IOPS and throughput together. Azure bills the tier. A workload that needs 5,000\u00a0IOPS from one Premium SSD at its baseline tier needs a P30, which is 1,024\u00a0GiB, whether it stores 900\u00a0GiB or 90\u00a0GiB. Microsoft’s design guide says: “Use a disk size that offers IOPS greater than your application requirement.”",
        },
        {
          kind: "p",
          text: [
            "Premium SSDs of 512\u00a0GiB and smaller can burst up to 3,500\u00a0IOPS and 170\u00a0MB/s for up to 30\u00a0minutes. Bursting and performance tiers have ",
            { a: "their own article", href: "/learn/azure-disk-performance-tiers" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "Premium SSD v2 separates the three. You choose capacity from 1\u00a0GiB to 64\u00a0TiB, then set IOPS and throughput apart from it, so a 100\u00a0GiB v2\u00a0disk can carry a P30’s 5,000\u00a0IOPS and 200\u00a0MB/s. It works only as a data disk and, in most regions with availability zones, attaches only to zonal VMs. The ",
            {
              a: "comparison of Premium SSD v2 and Premium SSD",
              href: "/learn/premium-ssd-v2-vs-premium-ssd",
            },
            " covers how each bills.",
          ],
        },
      ],
    },
    {
      id: "how-to-check-disk-iops-in-an",
      title: "How to check disk IOPS in an Azure VM",
      blocks: [
        {
          kind: "p",
          text: "Azure’s metrics compare use with each limit, and the guest’s own counters show request sizes and latency.",
        },
        {
          kind: "h3",
          id: "read-the-azure-disk-iops-consumed-percentage",
          title: "Read the Azure disk IOPS consumed percentage metrics",
        },
        {
          kind: "p",
          text: "Azure Monitor’s storage I/O utilization metrics divide what was used by the limit, on VM series that support premium storage. At the disk level, Azure pairs Data Disk IOPS Consumed Percentage with Data Disk Bandwidth Consumed Percentage, and the OS disk gets the same two. The VM level has VM Uncached IOPS Consumed Percentage, VM Uncached Bandwidth Consumed Percentage and a cached pair, which covers I/O through the host cache. For each, Microsoft says: “If this value reaches 100%, your application is I/O capped” by that limit.",
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
          text: "Splitting matters: in Microsoft’s own example, the data disks averaged about 42% of their IOPS, while the disks on LUN 2 and LUN 3 were each using about 85%.",
        },
        {
          kind: "p",
          text: "From the Azure CLI, this command lists, for each data disk, the peak value in every five-minute window over the last 24\u00a0hours:",
        },
        {
          kind: "code",
          lang: "bash",
          code: 'az monitor metrics list \\\n  --resource <vm-name> \\\n  --resource-group <resource-group> \\\n  --resource-type Microsoft.Compute/virtualMachines \\\n  --metrics "Data Disk IOPS Consumed Percentage" "Data Disk Bandwidth Consumed Percentage" \\\n  --dimension LUN \\\n  --top 64 \\\n  --aggregation Maximum \\\n  --interval 5m \\\n  --offset 24h',
        },
        {
          kind: "p",
          text: [
            "Run it again with “VM Uncached IOPS Consumed Percentage” and “VM Uncached Bandwidth Consumed Percentage”, without ",
            { code: "--dimension" },
            ", for the VM-level view. Most of these metrics arrive once a minute, while the guest’s own counters can report every few seconds. Data Disk Latency (in preview) adds the average time per I/O in milliseconds, for disks on a SCSI controller, not NVMe.",
          ],
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
          kind: "p",
          text: "Add r/s and w/s for IOPS, and rMB/s and wMB/s for throughput. iostat’s MB is a mebibyte while Azure’s is 10^6 bytes, so the D4s_v5’s 145\u00a0MB/s shows as about 138. r_await and w_await give latency in milliseconds, including time spent in the queue. The average request size in KiB is in rareq-sz and wareq-sz, and it shows which cap you’re nearer. Don’t read %util as the disk’s limit: the man page says that for devices serving requests in parallel, such as modern SSDs, it “does not reflect their performance limits.”",
        },
        {
          kind: "p",
          text: "To match a device to the LUN in the portal on a VM with a SCSI controller, list the disks with their HCTL address. The last number is the LUN:",
        },
        { kind: "code", lang: "bash", code: 'lsblk -o NAME,HCTL,SIZE,MOUNTPOINT | grep -i "sd"' },
        {
          kind: "p",
          text: [
            "On an NVMe controller, ",
            { code: "sudo azure-nvme-id" },
            " from the azure-vm-utils package prints each data disk’s LUN. On Windows, the matching PerfMon counters are Disk reads/sec, Disk writes/sec, Disk read bytes/sec and Disk write bytes/sec.",
          ],
        },
      ],
    },
    {
      id: "what-to-change-when-a-disk-or",
      title: "What to change when a disk or the VM is capped",
      blocks: [
        {
          kind: "ul",
          items: [
            "If a disk metric reaches 100% and the VM metrics don’t, the disk is the limit. A larger Premium SSD tier, higher settings on a Premium SSD v2\u00a0disk or more disks striped together all raise it. Microsoft’s example stripes two P30\u00a0disks for 10,000\u00a0IOPS or 400\u00a0MB/s, which helps only while the VM can carry the total.",
            "If a VM metric reaches 100%, a faster disk won’t help. Moving to a Standard_D8s_v5 doubles the D4s_v5’s limits to 12,800\u00a0IOPS and 290\u00a0MB/s. On a size that supports host caching, Microsoft recommends ReadOnly caching on read-heavy disks to get higher read IOPS.",
            "If IOPS is capped while throughput stays low, the requests are small, and the reverse means they’re large.",
            "If neither reaches 100% and latency is still high, look past the disk limits: Microsoft notes that an apparent disk problem is sometimes a network bottleneck.",
            [
              "If both stay far below 100% for weeks, the disk has more IOPS and throughput than its workload uses. On Premium SSD, the tier that supplies them also sets the size you pay for, so check ",
              { a: "used space inside the VM", href: "/learn/azure-vm-disk-usage" },
              " too. Azure can’t make a managed disk smaller in place, as the guide to ",
              { a: "shrinking a managed disk", href: "/learn/shrink-azure-managed-disk" },
              " explains.",
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
            ", works on that last case. It moves a VM’s data disks onto one btrfs pool, sized from the highest use of the last 7\u00a0days so the pool sits inside its target band (80% to 90% full by default) with room for the largest recent 15-minute rise and at least 10\u00a0GiB free. It then rightsizes the pool as the data changes.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Pool disks." },
              " On Azure, the pool is built from Premium SSD v2 where the region and zone offer it, and from Premium SSD otherwise. Each Premium SSD v2 pool disk gets at least 3,000\u00a0IOPS and 125\u00a0MB/s, and more IOPS when the VM’s own load needs it, while a Premium SSD pool disk has the performance of its size tier. On AWS it’s built from gp3\u00a0volumes, each with at least 3,000\u00a0IOPS and 125\u00a0MiB/s, and more when the VM’s measured load needs it. Amoeba sizes that performance for 1.3 times the measured p99, within the instance’s EBS limits.",
            ],
            [
              { b: "After the switch." },
              " A 2-hour soak follows the one switch onto the pool. Any disk error, or p99\u00a0disk latency above 1.2 times its level before the switch, pauses the move.",
            ],
            [
              { b: "Shrinks." },
              " They start only after the move is done and a full 7\u00a0days of data are in, and Amoeba checks hourly after that. It removes one disk at a time, which takes that disk’s IOPS and throughput with it, so it first checks that the disks that stay could serve the VM’s disk load, judged from recent readings, and holds the shrink if they couldn’t. It also never shrinks while the pool is at or above the top of its band or an urgent expand runs.",
            ],
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
      title: "Azure VM disk usage: how to check used vs provisioned space",
      where: "Learn",
      href: "/learn/azure-vm-disk-usage",
    },
    {
      title: "Can you shrink an Azure managed disk?",
      where: "Learn",
      href: "/learn/shrink-azure-managed-disk",
    },
  ],
};
