import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/azure-temporary-disk/1";

export const term: GlossaryTerm = {
  slug: "azure-temporary-disk",
  term: "Azure temporary disk",
  title: "What is temporary storage in an Azure VM?",
  meta: "Temporary storage in an Azure VM is the Azure temporary disk, or temp disk. See what it holds, when its data can be lost, and why it adds no disk charge.",
  h1: "What is temporary storage in an Azure VM?",
  card: "The Azure temporary disk, or Azure temp disk, is the temporary storage that comes with most Azure virtual machines (VMs).",
  group: "block-storage",
  product: "amoeba",
  published: "2026-10-25",
  updated: "2026-11-01",
  definition: [
    {
      kind: "p",
      text: [
        "The Azure temporary disk, or Azure temp disk, is the temporary storage that comes with most Azure virtual machines (VMs). Microsoft says it isn’t a ",
        { a: "managed disk", href: "/learn/glossary/azure-managed-disk" },
        " and should hold only data such as page files, swap files or SQL Server tempdb files.",
      ],
    },
  ],
  sections: [
    {
      id: "when-its-data-can-be-lost",
      title: "When data on the Azure temp disk can be lost",
      blocks: [
        { kind: "p", text: "Data on the temporary disk in an Azure VM might be lost when:" },
        {
          kind: "ul",
          items: ["Azure runs a maintenance event", "You redeploy the VM", "You stop the VM"],
        },
        { kind: "p", text: "A successful standard restart keeps the data." },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "an-example-azure-vm-temporary-disk-size",
      title: "An example: Azure VM temporary disk size",
      blocks: [
        {
          kind: "p",
          text: "The temporary disk’s size depends on the VM size you pick, as the Ddsv5 series shows:",
        },
        {
          kind: "ul",
          items: [
            "Standard_D2ds_v5 comes with a 75\u00a0GiB temporary disk.",
            "Standard_D96ds_v5 comes with 3,600\u00a0GiB.",
          ],
        },
        {
          kind: "p",
          text: "Some VM sizes have no temporary disk at all. Windows shows it as drive D by default, and on Linux it’s usually /dev/disk/azure/resource.",
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for your cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            "The VM price covers the temporary disk, so it has no separate charge.",
            "Data you need to keep belongs on managed data disks.",
            "You pay for those by the size you provision, not what you write. Empty space on them still costs money.",
            [
              "Check each disk’s ",
              { a: "used vs provisioned space", href: "/learn/azure-vm-disk-usage" },
              ".",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " moves a VM’s data disks onto one pool sized to your data, then rightsizes it autonomously. It works on data disks only and never touches the OS disk or the Azure temporary disk.",
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
      line: "The disk charged by the size you provision.",
      href: "/learn/glossary/azure-managed-disk",
    },
    {
      title: "Ephemeral OS disk",
      line: "An OS disk that isn’t persistent either.",
      href: "/learn/glossary/ephemeral-os-disk",
    },
    {
      title: "Block storage",
      line: "The kind of storage a managed disk is, like a physical disk but virtual.",
      href: "/learn/glossary/block-storage",
    },
    {
      title: "Thin provisioning",
      line: "Space taken as you write.",
      href: "/learn/glossary/thin-provisioning",
    },
  ],
  next: {
    title: "Azure VM disk usage: check used vs provisioned",
    href: "/learn/azure-vm-disk-usage",
  },
  sources: [
    {
      publisher: "Microsoft Learn",
      title: "“Overview of Azure Disk Storage”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/managed-disks-overview",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Ddsv5 size series”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/general-purpose/ddsv5-series",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Understand Azure Disk Storage billing”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-understand-billing",
    },
    {
      publisher: "Microsoft Azure",
      title: "“Linux Virtual Machines Pricing”",
      url: "https://azure.microsoft.com/en-us/pricing/details/virtual-machines/linux/",
    },
  ],
};
