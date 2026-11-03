import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/azure-disk-sizes/1";

export const term: GlossaryTerm = {
  slug: "azure-disk-sizes",
  term: "Azure disk sizes (P10, P30, E10, S10 size names)",
  title: "Azure disk sizes",
  meta: "Every Azure managed disk size from P1 to P80, with its GiB, IOPS and MB/s. A P10 is 128 GiB, a P30 is 1 TiB, and you pay for the whole size.",
  h1: "Azure disk sizes",
  card: "Azure disk sizes are the fixed sizes of three types of Azure managed disk: Premium SSD, Standard SSD and Standard HDD.",
  group: "block-storage",
  product: "amoeba",
  published: "2026-10-26",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: [
        "Azure disk sizes are the fixed sizes of three types of Azure ",
        { a: "managed disk", href: "/learn/glossary/azure-managed-disk" },
        ": Premium SSD, Standard SSD and Standard HDD. Each size has a short name, such as P10.",
      ],
    },
    {
      kind: "p",
      text: [
        "The letter gives the ",
        { a: "disk type", href: "/learn/azure-managed-disk-types" },
        " and the number gives the size:",
      ],
    },
    {
      kind: "ul",
      items: [
        "P is Premium SSD (solid-state drive), from P1 to P80.",
        "E is Standard SSD, from E1 to E80.",
        "S is Standard HDD (hard disk drive), from S4 to S80.",
      ],
    },
    {
      kind: "p",
      text: "Sizes run from 4\u00a0GiB (P1, E1) to 32,767\u00a0GiB (P80, E80, S80). A P10 is 128\u00a0GiB, and a P30 is 1,024\u00a0GiB (1\u00a0TiB).",
    },
  ],
  sections: [
    {
      id: "common-azure-managed-disk-sizes",
      title: "Sizes, P1 to P80",
      blocks: [
        { kind: "p", text: "The same number means the same size in every type:" },
        {
          kind: "table",
          columns: [
            { label: "Sizes", width: "38%" },
            { label: "GiB", width: "21%" },
            { label: "Premium SSD base IOPS", width: "21%" },
            { label: "Premium SSD base MB/s", width: "20%" },
          ],
          rows: [
            ["P1, E1", "4", "120", "25"],
            ["P2, E2", "8", "120", "25"],
            ["P3, E3", "16", "120", "25"],
            ["P4, E4, S4", "32", "120", "25"],
            ["P6, E6, S6", "64", "240", "50"],
            ["P10, E10, S10", "128", "500", "100"],
            ["P15, E15, S15", "256", "1,100", "125"],
            ["P20, E20, S20", "512", "2,300", "150"],
            ["P30, E30, S30", "1,024", "5,000", "200"],
            ["P40, E40, S40", "2,048", "7,500", "250"],
            ["P50, E50, S50", "4,096", "7,500", "250"],
            ["P60, E60, S60", "8,192", "16,000", "500"],
            ["P70, E70, S70", "16,384", "18,000", "750"],
            ["P80, E80, S80", "32,767", "20,000", "900"],
          ],
        },
        {
          kind: "p",
          text: "Standard SSD sizes E1 to E50, and Standard HDD sizes S4 to S50, give up to 500\u00a0IOPS.",
        },
        {
          kind: "p",
          text: "A charge named “P10 LRS Disk” is a P10 with locally redundant storage (LRS).",
        },
      ],
    },
    {
      id: "an-example-a-200-gib-disk",
      title: "How sizes are charged",
      blocks: [
        {
          kind: "p",
          text: "Azure charges a P, E or S disk for its whole size, however much data it holds. A disk between two sizes is charged as the next size up.",
        },
        {
          kind: "p",
          text: "Microsoft’s example is a 200\u00a0GiB Standard SSD. Azure charges it as E15, 256\u00a0GiB.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: [
            "Premium SSD v2 and ",
            { a: "Ultra Disk", href: "/learn/glossary/azure-ultra-disk" },
            " have no fixed sizes. They’re charged per GiB, in 1\u00a0GiB steps.",
          ],
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            [
              "You can move a disk to a larger size, but ",
              { a: "not a smaller one", href: "/learn/shrink-azure-managed-disk" },
              ". So you keep paying for the largest size it ever needed.",
            ],
            [
              "Price a Premium SSD or Standard SSD size with our ",
              { a: "Azure disk pricing calculator", href: "/ebs-and-azure-disk-pricing" },
              ".",
            ],
            [
              { a: "Azure disk reservations", href: "/learn/azure-disk-reservations" },
              " discount Premium SSD sizes P30 to P80 for a one-year term.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " moves a VM’s data disks onto one btrfs pool sized to your data, then rightsizes it autonomously. On Azure, the pool uses Premium SSD v2 where your VM’s region and zone offer it, and Premium SSD otherwise.",
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Azure managed disk",
      line: "The disk behind these sizes.",
      href: "/learn/glossary/azure-managed-disk",
    },
    {
      title: "Premium SSD in Azure",
      line: "The P sizes.",
      href: "/learn/glossary/azure-premium-ssd",
    },
    {
      title: "Azure Standard HDD",
      line: "The S sizes.",
      href: "/learn/glossary/azure-standard-hdd",
    },
    {
      title: "Ultra Disk",
      line: "Charged per GiB instead.",
      href: "/learn/glossary/azure-ultra-disk",
    },
  ],
  relatedTitle: "Related terms",
  next: {
    title: "Azure disk reservations: are they worth it?",
    href: "/learn/azure-disk-reservations",
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
      title: "“Scalability and performance targets for VM disks”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-scalability-targets",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Expand virtual hard disks on a Linux VM”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/linux/expand-disks",
    },
  ],
};
