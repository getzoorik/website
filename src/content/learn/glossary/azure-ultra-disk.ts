import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/azure-ultra-disk/1";

export const term: GlossaryTerm = {
  slug: "azure-ultra-disk",
  term: "Ultra Disk (Azure)",
  title: "What is Azure Ultra Disk?",
  meta: "Azure Ultra Disk is the fastest Azure managed disk. Its limits, what it can’t do, and how its three meters and the vCPU reservation fee add up.",
  h1: "What is Azure Ultra Disk?",
  card: "Azure Ultra Disk is the highest-performing type of Azure managed disk.",
  group: "block-storage",
  product: "both",
  published: "2026-10-26",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: [
        "Azure Ultra Disk is the highest-performing type of ",
        { a: "Azure managed disk", href: "/learn/glossary/azure-managed-disk" },
        ". You set its size, input/output operations per second (",
        { a: "IOPS", href: "/learn/glossary/iops" },
        ") and ",
        { a: "throughput", href: "/learn/glossary/disk-throughput" },
        " separately, and pay for each.",
      ],
    },
    { kind: "svg", figure: figure1 },
    { kind: "p", text: "Microsoft’s limits for one disk:" },
    {
      kind: "ul",
      items: [
        "Size: 4\u00a0GiB to 64\u00a0TiB, in 1\u00a0GiB steps.",
        "IOPS: up to 1,000 per GiB, and 400,000 per disk.",
        "Throughput: up to 0.25\u00a0MB/s per IOPS you set, and 10,000\u00a0MB/s per disk.",
      ],
    },
  ],
  sections: [
    {
      id: "a-database-that-needs-speed-more-than",
      title: "Example: a small, busy database",
      blocks: [
        {
          kind: "p",
          text: [
            "Say a database holds 200\u00a0GiB but needs 150,000\u00a0IOPS. A 200\u00a0GiB Ultra Disk can reach 200,000\u00a0IOPS, if the VM’s own limit allows it. One ",
            { a: "Premium SSD v2", href: "/learn/premium-ssd-v2-vs-premium-ssd" },
            " tops out at 80,000, and the largest Premium SSD at 20,000 base IOPS.",
          ],
        },
      ],
    },
    {
      id: "azure-ultra-disk-limitations",
      title: "Limitations",
      blocks: [
        {
          kind: "ul",
          items: [
            "It works only as a data disk, never as the OS disk.",
            "It can only be created as an empty disk.",
            "It’s locally redundant storage (LRS) only, with no zone-redundant storage (ZRS).",
            "It doesn’t support availability sets or disk caching.",
            "Only some regions and VM series support it.",
          ],
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for cloud cost",
      blocks: [
        {
          kind: "p",
          text: "An Ultra Disk is charged by the hour for the size, IOPS and throughput you set, not for the data or I/O you use.",
        },
        {
          kind: "ul",
          items: [
            "You can change its IOPS and throughput up to four times in 24\u00a0hours, without detaching the disk. Each change can take up to an hour.",
            "A VM with Ultra Disk compatibility on, but no Ultra Disk attached, pays a reservation fee per virtual CPU (vCPU).",
            [
              "Azure ",
              { a: "disk reservations", href: "/learn/azure-disk-reservations" },
              " cover Premium SSD P30 to P80, not Ultra Disk.",
            ],
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Provisioned IOPS",
      line: "IOPS you set and pay for.",
      href: "/learn/glossary/provisioned-iops",
    },
    { title: "IOPS", line: "Reads and writes each second.", href: "/learn/glossary/iops" },
    {
      title: "Disk throughput",
      line: "The other speed limit.",
      href: "/learn/glossary/disk-throughput",
    },
    {
      title: "Premium SSD in Azure",
      line: "The OS disk to pair it with.",
      href: "/learn/glossary/azure-premium-ssd",
    },
  ],
  relatedTitle: "Related terms",
  next: {
    title: "Premium SSD v2 vs Premium SSD",
    href: "/learn/premium-ssd-v2-vs-premium-ssd",
  },
  sources: [
    {
      publisher: "Microsoft Learn",
      title: "“Select a disk type for Azure IaaS VMs”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-types",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Understand Azure Disk Storage billing”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-understand-billing",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Configure Ultra Disks for Azure virtual machines”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-enable-ultra-ssd",
    },
    {
      publisher: "Microsoft Azure",
      title: "“Managed Disks pricing”",
      url: "https://azure.microsoft.com/en-us/pricing/details/managed-disks/",
    },
  ],
};
