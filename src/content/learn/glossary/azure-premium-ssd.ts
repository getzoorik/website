import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/azure-premium-ssd/1";

export const term: GlossaryTerm = {
  slug: "azure-premium-ssd",
  term: "Premium SSD (Azure)",
  title: "What is Azure Premium SSD?",
  meta: "Azure Premium SSD, or premium storage, is the managed disk type for production VMs. Its sizes and limits, LRS vs ZRS, and what you pay for.",
  h1: "What is Azure Premium SSD?",
  card: "Azure Premium SSD is a solid-state drive (SSD) type of Azure managed disk for production apps that need high performance and low latency.",
  group: "block-storage",
  product: "amoeba",
  published: "2026-10-26",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: [
        "Azure Premium SSD is a solid-state drive (SSD) type of ",
        { a: "Azure managed disk", href: "/learn/glossary/azure-managed-disk" },
        " for production apps that need high performance and low ",
        { a: "latency", href: "/learn/glossary/disk-latency" },
        ". Microsoft also calls it premium storage, and only virtual machine (VM) sizes that support premium storage can use it.",
      ],
    },
  ],
  sections: [
    {
      id: "what-is-premium-ssd-lrs",
      title: "LRS vs ZRS",
      blocks: [
        { kind: "p", text: "Premium SSD comes with one of two redundancy options:" },
        {
          kind: "ul",
          items: [
            "Locally redundant storage (LRS) keeps three copies in one data center. It protects against rack and drive failures, not a zone failure.",
            "Zone-redundant storage (ZRS) copies your data across three availability zones in the region. Writes take a little longer than on LRS.",
          ],
        },
      ],
    },
    {
      id: "a-disk-held-back-by-its-vm",
      title: "Sizes and performance",
      blocks: [
        {
          kind: "p",
          text: [
            "A Premium SSD’s input/output operations per second (",
            { a: "IOPS", href: "/learn/glossary/iops" },
            ") and throughput rise with its size:",
          ],
        },
        {
          kind: "table",
          columns: [
            { label: "Limit", width: "28%" },
            { label: "Premium SSD", width: "72%" },
          ],
          rows: [
            ["Sizes", "P1 (4\u00a0GiB) to P80 (32,767\u00a0GiB)"],
            ["Base IOPS per disk", "120 to 20,000"],
            ["Base throughput per disk", "25 to 900\u00a0MB/s"],
            [
              "Bursting",
              "P1 to P20 burst to 3,500\u00a0IOPS for up to 30\u00a0minutes. P30 and larger burst only with on-demand bursting",
            ],
            ["Redundancy", "LRS or ZRS"],
          ],
        },
        {
          kind: "p",
          text: [
            "Each size’s figures are in ",
            { a: "Azure disk sizes", href: "/learn/glossary/azure-disk-sizes" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "The VM has its own limits, and the lower one wins. In Microsoft’s example, a DS1 VM caps its 1\u00a0TiB Premium SSD at 3,200\u00a0IOPS.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            "You pay for the size tier the disk rounds up to, however little data it holds.",
            "Bursting on P20 and smaller disks is free. On-demand bursting, for P30 and larger, adds an hourly fee, plus a charge for I/O above the disk’s target.",
            [
              { a: "Premium SSD v2", href: "/learn/premium-ssd-v2-vs-premium-ssd" },
              " is charged per GiB, plus IOPS above 3,000 and throughput above 125\u00a0MB/s.",
            ],
            [
              "A one-year reservation gives a discount on P30 and larger disks. See ",
              { a: "Azure disk reservations", href: "/learn/azure-disk-reservations" },
              ".",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Our ",
            { a: "Azure disk pricing calculator", href: "/ebs-and-azure-disk-pricing" },
            " gives a Premium SSD’s monthly list price.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " moves a VM’s data disks onto one btrfs pool sized to your data, then rightsizes it. On Azure, the pool is Premium SSD v2 where offered, and Premium SSD otherwise.",
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Azure disk sizes",
      line: "The tiers you pay for.",
      href: "/learn/glossary/azure-disk-sizes",
    },
    {
      title: "Azure managed disk",
      line: "The disk family it belongs to.",
      href: "/learn/glossary/azure-managed-disk",
    },
    { title: "IOPS", line: "Reads and writes per second.", href: "/learn/glossary/iops" },
  ],
  relatedTitle: "Related terms",
  next: {
    title: "Azure Premium SSD vs Standard SSD",
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
    {
      publisher: "Microsoft Learn",
      title: "“Scalability and performance targets for VM disks”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-scalability-targets",
    },
  ],
};
