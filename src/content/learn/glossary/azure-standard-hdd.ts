import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/azure-standard-hdd/1";

export const term: GlossaryTerm = {
  slug: "azure-standard-hdd",
  term: "Azure Standard HDD (with the OS disk retirement)",
  title: "What is Azure Standard HDD?",
  meta: "Azure Standard HDD is the hard disk type of Azure managed disk. See its limits, how it’s charged, and what the 8 Sept 2028 OS disk retirement changes for you.",
  h1: "What is Azure Standard HDD?",
  card: "Azure Standard HDD is the hard disk drive (HDD) type of Azure managed disk.",
  group: "block-storage",
  product: "both",
  published: "2026-10-26",
  updated: "2026-10-26",
  definition: [
    {
      kind: "p",
      text: [
        "Azure Standard HDD is the hard disk drive (HDD) type of ",
        { a: "Azure managed disk", href: "/learn/glossary/azure-managed-disk" },
        ". It suits backup and other data you rarely use. It’s a poor fit for OS disks and databases that need low ",
        { a: "disk latency", href: "/learn/glossary/disk-latency" },
        ".",
      ],
    },
    { kind: "p", text: "Microsoft’s figures:" },
    {
      kind: "ul",
      items: [
        "It’s designed for writes under 10\u00a0ms and reads under 20\u00a0ms, for most operations.",
        [
          "Its largest sizes reach 2,000 input/output operations per second (",
          { a: "IOPS", href: "/learn/glossary/iops" },
          "), or 3,000 with performance plus turned on.",
        ],
        "It’s locally redundant storage (LRS) only: three copies in one data center.",
      ],
    },
  ],
  sections: [
    {
      id: "azure-standard-hdd-os-disk-retirement",
      title: "Azure Standard HDD OS disk retirement",
      blocks: [
        {
          kind: "p",
          text: "On 8 September 2028, Azure stops supporting Standard HDD as an OS disk. It then converts each one automatically to a Standard SSD of equivalent size. Microsoft warns that workloads may see a service disruption if you don’t migrate first.",
        },
        {
          kind: "p",
          text: "The Azure Standard HDD retirement covers OS disks only. Data disks, snapshots and Azure Site Recovery’s OS disks aren’t part of it.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: "To find yours, filter the portal’s disk list by storage type Standard HDD LRS and OS type Linux and Windows. Then convert each to Standard SSD or Premium SSD.",
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for your cloud cost",
      blocks: [
        { kind: "p", text: "Two things set the price:" },
        {
          kind: "ul",
          items: [
            [
              "the ",
              { a: "size tier", href: "/learn/glossary/azure-disk-sizes" },
              " its size rounds up to, however little data it holds",
            ],
            "transactions: each read or write of up to 16\u00a0KiB counts as one",
          ],
        },
        {
          kind: "p",
          text: [
            "After conversion, an OS disk is charged as ",
            { a: "Standard SSD", href: "/learn/premium-ssd-vs-standard-ssd-azure" },
            ". Microsoft says it generally comes closest to Standard HDD on price for performance.",
          ],
        },
        {
          kind: "p",
          text: [
            "The ",
            { a: "free assessment", href: "/assessment?p=amoeba" },
            " works out what your disks could save.",
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Azure managed disk",
      line: "Its disk family.",
      href: "/learn/glossary/azure-managed-disk",
    },
    {
      title: "Azure disk sizes",
      line: "The tiers behind its price.",
      href: "/learn/glossary/azure-disk-sizes",
    },
    {
      title: "Disk latency",
      line: "The time per read or write.",
      href: "/learn/glossary/disk-latency",
    },
    {
      title: "Disk snapshot",
      line: "A disk copy, which Azure can store on Standard HDD.",
      href: "/learn/glossary/disk-snapshot",
    },
  ],
  next: {
    title: "Premium SSD vs Standard SSD on Azure: what you pay for",
    href: "/learn/premium-ssd-vs-standard-ssd-azure",
  },
  sources: [
    {
      publisher: "Microsoft Learn",
      title: "“Migrate Standard HDD OS disks by September 08, 2028”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-hdd-os-retirement",
    },
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
  ],
};
