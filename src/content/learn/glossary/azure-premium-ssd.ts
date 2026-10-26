import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/azure-premium-ssd/1";

export const term: GlossaryTerm = {
  slug: "azure-premium-ssd",
  term: "Premium SSD (Azure)",
  title: "What is Premium SSD in Azure?",
  meta: "Premium SSD in Azure is a fast managed disk for production VMs. See what Premium SSD LRS means, how its IOPS work and why you pay for its whole size tier.",
  h1: "What is Premium SSD in Azure?",
  card: "Premium SSD in Azure is a solid-state drive (SSD) type of Azure managed disk.",
  group: "block-storage",
  product: "amoeba",
  published: "2026-10-26",
  updated: "2026-10-26",
  definition: [
    {
      kind: "p",
      text: [
        "Premium SSD in Azure is a solid-state drive (SSD) type of ",
        { a: "Azure managed disk", href: "/learn/glossary/azure-managed-disk" },
        ". It’s for production apps that need high performance and low ",
        { a: "latency", href: "/learn/glossary/disk-latency" },
        ".",
      ],
    },
    { kind: "p", text: "From Microsoft’s docs:" },
    {
      kind: "ul",
      items: [
        "It’s designed for single-digit millisecond latency, 99.9% of the time.",
        "It can be the operating system (OS) disk or a data disk.",
        "It needs a virtual machine (VM) size that supports premium storage.",
      ],
    },
  ],
  sections: [
    {
      id: "what-is-premium-ssd-lrs",
      title: "What is Premium SSD LRS?",
      blocks: [
        {
          kind: "p",
          text: "LRS means locally redundant storage. Azure writes your data three times in one data center. It guards against server rack and drive failures, not an availability zone failure.",
        },
      ],
    },
    {
      id: "a-disk-held-back-by-its-vm",
      title: "A disk held back by its VM",
      blocks: [
        {
          kind: "p",
          text: "Base input/output operations per second (IOPS) depend on disk size. Azure Premium SSD IOPS run from 120 to 20,000. The VM has a limit too.",
        },
        { kind: "p", text: "Microsoft’s example app needs 4,000\u00a0IOPS:" },
        {
          kind: "ul",
          items: [
            "Its 1\u00a0TiB Premium SSD can deliver 5,000.",
            "But its DS1 VM is limited to 3,200.",
            "So the app gets 3,200 and runs slower.",
          ],
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for your cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            [
              "You pay for the ",
              { a: "size tier", href: "/learn/glossary/azure-disk-sizes" },
              " the disk rounds up to, however little data it holds.",
            ],
            "On-demand bursting adds an hourly fee and burst transaction costs. Without it, transactions are free.",
            [
              { a: "Premium SSD v2", href: "/learn/premium-ssd-v2-vs-premium-ssd" },
              " is charged per GiB instead, plus IOPS above 3,000 and throughput above 125\u00a0MB/s.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "For web servers, development and testing, Microsoft suggests ",
            { a: "Standard SSD", href: "/learn/premium-ssd-vs-standard-ssd-azure" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " moves a VM’s data disks onto one pool sized to your data, then rightsizes it autonomously. On Azure, it uses Premium SSD v2 where the region and zone offer it, and Premium SSD otherwise.",
          ],
        },
        {
          kind: "p",
          text: [
            "The ",
            { a: "free assessment", href: "/assessment?p=amoeba" },
            " works out your own figure.",
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Azure disk sizes",
      line: "The size tiers you pay for.",
      href: "/learn/glossary/azure-disk-sizes",
    },
    {
      title: "Azure managed disk",
      line: "Its disk family.",
      href: "/learn/glossary/azure-managed-disk",
    },
    { title: "IOPS", line: "Reads and writes per second.", href: "/learn/glossary/iops" },
  ],
  next: {
    title: "Premium SSD vs Standard SSD on Azure: what you pay for",
    href: "/learn/premium-ssd-vs-standard-ssd-azure",
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
      title: "“Redundancy options for Azure managed disks”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-redundancy",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Azure premium storage: Design for high performance”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/premium-storage-performance",
    },
  ],
};
