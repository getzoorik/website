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
  updated: "2026-10-26",
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
  ],
  sections: [
    {
      id: "common-azure-managed-disk-sizes",
      title: "Common Azure managed disk sizes",
      blocks: [
        { kind: "p", text: "The same number means the same size in each type:" },
        {
          kind: "ul",
          items: [
            "P10, E10 and S10 are 128\u00a0GiB.",
            "P20, E20 and S20 are 512\u00a0GiB.",
            "P30, E30 and S30 are 1,024\u00a0GiB.",
          ],
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
              "Premium SSD v2 and ",
              { a: "Ultra Disk", href: "/learn/glossary/azure-ultra-disk" },
              " charge per GiB, in 1\u00a0GiB steps.",
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
  ],
};
