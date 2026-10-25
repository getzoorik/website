import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/azure-managed-disk/1";

export const term: GlossaryTerm = {
  slug: "azure-managed-disk",
  term: "Azure managed disk",
  title: "What is an Azure managed disk?",
  meta: "An Azure managed disk is block storage that Azure manages for your VM. See how it’s billed by provisioned size, and why you can grow it but not shrink it.",
  h1: "What is an Azure managed disk?",
  card: "An Azure managed disk is a block storage volume that Azure manages for your virtual machine (VM).",
  group: "block-storage",
  product: "amoeba",
  published: "2026-10-25",
  updated: "2026-10-25",
  definition: [
    {
      kind: "p",
      text: [
        "An Azure managed disk is a ",
        { a: "block storage", href: "/learn/glossary/block-storage" },
        " volume that Azure manages for your virtual machine (VM). A managed disk in Azure works like a physical disk in a server, but it’s virtual. “Managed” means you pick the type and size, and Azure handles the rest.",
      ],
    },
    { kind: "p", text: "A managed disk in an Azure VM has one of two roles:" },
    {
      kind: "ul",
      items: ["The OS disk holds the operating system.", "A data disk holds your apps and data."],
    },
  ],
  sections: [
    {
      id: "an-example-a-1-tib-data-disk",
      title: "An example: a 1\u00a0TiB data disk",
      blocks: [
        {
          kind: "p",
          text: "Say you attach a 1\u00a0TiB Premium SSD (solid-state drive) data disk. By default, Azure gives it the P30 tier. Your data fills only 200\u00a0GiB.",
        },
        {
          kind: "p",
          text: "Azure bills the provisioned size, the size you set, so you pay for all 1\u00a0TiB, not the 200\u00a0GiB you use.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "benefits-of-azure-managed-disks",
      title: "Benefits of Azure managed disks",
      blocks: [
        {
          kind: "ul",
          items: [
            "They’re designed for 99.999% availability, with three copies of your data.",
            "One subscription can hold up to 50,000\u00a0disks of each type per region.",
          ],
        },
      ],
    },
    {
      id: "why-it-matters-for-your-bill",
      title: "Why it matters for your bill",
      blocks: [
        {
          kind: "ul",
          items: [
            "You can grow a data disk while the VM keeps running, within some limits.",
            "Microsoft says shrinking an existing disk “isn’t supported and might result in data loss.”",
            "So a disk sized for an old peak keeps billing at that size.",
          ],
        },
        {
          kind: "p",
          text: [
            "For ways to reduce that cost, see ",
            { a: "Azure disk cost optimization", href: "/learn/azure-disk-cost-optimization" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " moves a VM’s data disks onto one pool sized to your data, then rightsizes it autonomously. It never touches the OS disk. It works on Azure managed disks and Amazon EBS volumes, on Windows and Linux VMs.",
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
      title: "Block storage",
      line: "The storage type a managed disk gives you.",
      href: "/learn/glossary/block-storage",
    },
    {
      title: "Azure temporary disk",
      line: "Short-term VM storage that isn’t a managed disk.",
      href: "/learn/glossary/azure-temporary-disk",
    },
    { title: "EBS volume", line: "The AWS match.", href: "/learn/glossary/ebs-volume" },
  ],
  next: { title: "Azure disk cost optimization", href: "/learn/azure-disk-cost-optimization" },
  sources: [
    {
      publisher: "Microsoft Learn",
      title: "“Overview of Azure Disk Storage”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/managed-disks-overview",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Understand Azure Disk Storage billing”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-understand-billing",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Expand Virtual Hard Disks on a Linux VM”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/linux/expand-disks",
    },
  ],
};
