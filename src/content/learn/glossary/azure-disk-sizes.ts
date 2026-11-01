import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/azure-disk-sizes/1";

export const term: GlossaryTerm = {
  slug: "azure-disk-sizes",
  term: "Azure disk sizes (P10, P30, E10, S10 size names)",
  title: "What are Azure disk sizes (P10, P30, E10)?",
  meta: "Azure disk sizes have names like P10, P30 and E10. See what each letter and number means, and why you pay for the whole size, not the data you store.",
  h1: "What are Azure disk sizes (P10, P30, E10)?",
  card: "Azure disk sizes are the fixed sizes Azure offers for three types of managed disk, the disks that Azure virtual machines (VMs) use.",
  group: "block-storage",
  product: "amoeba",
  published: "2026-10-26",
  updated: "2026-11-01",
  definition: [
    {
      kind: "p",
      text: [
        "Azure disk sizes are the fixed sizes Azure offers for three types of ",
        { a: "managed disk", href: "/learn/glossary/azure-managed-disk" },
        ", the disks that Azure virtual machines (VMs) use. Each size has a short name, such as P10, E10 or S10.",
      ],
    },
    { kind: "p", text: "The letter gives the disk type, and the number gives the size:" },
    {
      kind: "ul",
      items: [
        "P is Premium SSD (solid-state drive), from P1 to P80.",
        "E is Standard SSD, from E1 to E80.",
        "S is Standard HDD (hard disk drive), from S4 to S80.",
      ],
    },
    { kind: "p", text: "They run from 4\u00a0GiB (P1, E1) to 32,767\u00a0GiB (P80, E80, S80)." },
  ],
  sections: [
    {
      id: "common-azure-managed-disk-sizes",
      title: "Azure managed disk sizes, P1 to P80",
      blocks: [
        { kind: "p", text: "The same number means the same size in each type:" },
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
          text: "So the Azure P10\u00a0disk size is 128\u00a0GiB, and an Azure P30\u00a0disk is 1\u00a0TiB. A charge named “P10 LRS Disk” means a P10 with locally redundant storage (LRS).",
        },
      ],
    },
    {
      id: "an-example-a-200-gib-disk",
      title: "An example: a 200\u00a0GiB disk",
      blocks: [
        {
          kind: "p",
          text: "Microsoft’s own example is a 200\u00a0GiB Standard SSD. Azure charges it as the next size up, E15 at 256\u00a0GiB. You pay for 256\u00a0GiB, not 200.",
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
            "P, E and S disks charge for the whole size, however much data they hold.",
            [
              "Price a Premium SSD or Standard SSD size with our ",
              { a: "Azure disk pricing calculator", href: "/ebs-and-azure-disk-pricing" },
              ".",
            ],
            [
              "Premium SSD v2 and ",
              { a: "Ultra Disk", href: "/learn/glossary/azure-ultra-disk" },
              " charge per GiB, in 1\u00a0GiB steps.",
            ],
            [
              "You can move a disk to a larger size, but ",
              { a: "not a smaller one", href: "/learn/shrink-azure-managed-disk" },
              ".",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Azure disk cost optimization", href: "/learn/azure-disk-cost-optimization" },
            " shows ways to reduce this cost.",
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
  next: { title: "Azure disk cost optimization", href: "/learn/azure-disk-cost-optimization" },
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
