import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/azure-premium-ssd/1";

export const term: GlossaryTerm = {
  slug: "azure-premium-ssd",
  term: "Premium SSD (Azure)",
  title: "What is Premium SSD in Azure?",
  meta: "Premium SSD in Azure, or Azure premium storage, is a fast managed disk for production VMs. See what Premium SSD LRS means and why you pay its whole size tier.",
  h1: "What is Premium SSD in Azure?",
  card: "Premium SSD in Azure, also called Azure premium storage, is a solid-state drive (SSD) type of Azure managed disk.",
  group: "block-storage",
  product: "amoeba",
  published: "2026-10-26",
  updated: "2026-11-01",
  definition: [
    {
      kind: "p",
      text: [
        "Premium SSD in Azure, also called Azure premium storage, is a solid-state drive (SSD) type of ",
        { a: "Azure managed disk", href: "/learn/glossary/azure-managed-disk" },
        ". It’s for production apps needing high performance and low ",
        { a: "latency", href: "/learn/glossary/disk-latency" },
        ".",
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
          text: "LRS means locally redundant storage: three copies in one data center. It guards against rack and drive failures, not zone failures.",
        },
        {
          kind: "p",
          text: "Premium SSD also comes as ZRS, zone-redundant storage. It copies your data across three availability zones in the region. Writes have a little more latency than on LRS.",
        },
      ],
    },
    {
      id: "a-disk-held-back-by-its-vm",
      title: "A disk held back by its VM",
      blocks: [
        {
          kind: "p",
          text: [
            "Input/output operations per second (",
            { a: "IOPS", href: "/learn/glossary/iops" },
            ") and throughput depend on disk size.",
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
          text: "In Microsoft’s example, a DS1 virtual machine (VM) caps its 1\u00a0TiB disk at 3,200\u00a0IOPS.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why Premium SSD matters for your cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            [
              "You pay for the ",
              { a: "size tier", href: "/learn/glossary/azure-disk-sizes" },
              " the disk rounds up to, however little data it holds.",
            ],
            [
              { a: "Premium SSD v2", href: "/learn/premium-ssd-v2-vs-premium-ssd" },
              " is charged per GiB, plus IOPS above 3,000 and throughput above 125\u00a0MB/s.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Our ",
            { a: "Azure disk pricing calculator", href: "/ebs-and-azure-disk-pricing" },
            " gives a Premium SSD’s monthly list price. ",
            { a: "Azure disk reservations", href: "/learn/azure-disk-reservations" },
            " shows ways to reduce it.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " moves a VM’s data disks onto one pool sized to your data. On Azure, it uses Premium SSD v2 where offered, and Premium SSD otherwise.",
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
      line: "The tiers you pay for.",
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
    {
      publisher: "Microsoft Learn",
      title: "“Scalability and performance targets for VM disks”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-scalability-targets",
    },
  ],
};
