import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/azure-managed-disk/1";

export const term: GlossaryTerm = {
  slug: "azure-managed-disk",
  term: "Azure managed disk",
  title: "What is an Azure managed disk?",
  meta: "An Azure managed disk is block storage for your VM, sold as Azure Disk Storage. See how it’s charged by provisioned size, and why it can grow but not shrink.",
  h1: "What is an Azure managed disk?",
  card: "An Azure managed disk is a block storage volume that Azure manages for your virtual machine (VM), sold as Azure Disk Storage.",
  group: "block-storage",
  product: "amoeba",
  published: "2026-10-25",
  updated: "2026-11-01",
  definition: [
    {
      kind: "p",
      text: [
        "An Azure managed disk is a ",
        { a: "block storage", href: "/learn/glossary/block-storage" },
        " volume that Azure manages for your virtual machine (VM), sold as Azure Disk Storage. A managed disk in Azure is like a physical disk in a server, but virtual. “Managed” means you pick the ",
        { a: "disk type", href: "/learn/azure-managed-disk-types" },
        " and size, and Azure handles the rest.",
      ],
    },
  ],
  sections: [
    {
      id: "os-disk-vs-data-disk-in-an",
      title: "OS disk vs data disk in an Azure VM",
      blocks: [
        { kind: "p", text: "A managed disk in an Azure VM has one of two roles:" },
        {
          kind: "ul",
          items: [
            "The OS disk holds the operating system.",
            "A data disk holds your apps and data.",
          ],
        },
        {
          kind: "h3",
          id: "an-example-a-1-tib-data-disk",
          title: "An example: a 1\u00a0TiB data disk",
        },
        {
          kind: "p",
          text: "Say you attach a 1\u00a0TiB Premium SSD (solid-state drive) data disk. By default, Azure gives it the P30 tier. Your data fills only 200\u00a0GiB.",
        },
        {
          kind: "p",
          text: "Azure charges for the size you provision: all 1\u00a0TiB, not the 200\u00a0GiB you use.",
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
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why Azure managed disks matter for your cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            "You can grow a data disk while the VM runs, within some limits.",
            "Microsoft says shrinking an existing disk “isn’t supported and might result in data loss.”",
            "So you keep paying for an old peak’s size.",
          ],
        },
        {
          kind: "p",
          text: [
            "To reduce that cost, see ",
            { a: "how to reduce Azure disk size", href: "/learn/shrink-azure-managed-disk" },
            " and ",
            {
              a: "Azure managed disk cost optimization",
              href: "/azure-managed-disk-cost-optimization",
            },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " moves a VM’s data disks onto one pool sized to your data, then rightsizes it autonomously. It works on Windows and Linux VMs, never on the OS disk.",
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
      line: "The storage type of a managed disk.",
      href: "/learn/glossary/block-storage",
    },
    {
      title: "Azure temporary disk",
      line: "Short-term VM storage that isn’t a managed disk.",
      href: "/learn/glossary/azure-temporary-disk",
    },
    { title: "EBS volume", line: "The AWS match.", href: "/learn/glossary/ebs-volume" },
    {
      title: "Ephemeral OS disk",
      line: "An OS disk on the VM’s local storage.",
      href: "/learn/glossary/ephemeral-os-disk",
    },
  ],
  next: { title: "Azure disk cost optimization", href: "/learn/azure-disk-reservations" },
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
