import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/azure-temporary-disk/1";

export const term: GlossaryTerm = {
  slug: "azure-temporary-disk",
  term: "Azure temporary disk",
  title: "What is the Azure temp drive?",
  meta: "The Azure temp drive is the temporary disk most Azure VMs come with, drive D on Windows. When its data is lost, how big it is, and what it costs.",
  h1: "What is the Azure temp drive?",
  card: "The Azure temp drive, or temporary disk, is short-term storage that comes with most Azure virtual machines (VMs).",
  group: "block-storage",
  product: "amoeba",
  published: "2026-10-25",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: [
        "The Azure temp drive, or temporary disk, is short-term storage that comes with most Azure virtual machines (VMs). It isn’t a ",
        { a: "managed disk", href: "/learn/glossary/azure-managed-disk" },
        ". Microsoft says it should hold only data such as page files, swap files or SQL Server tempdb files.",
      ],
    },
    {
      kind: "p",
      text: [
        "On Windows it’s drive D by default. On Linux it’s usually ",
        { code: "/dev/disk/azure/resource" },
        ".",
      ],
    },
  ],
  sections: [
    {
      id: "when-its-data-can-be-lost",
      title: "When data can be lost",
      blocks: [
        { kind: "p", text: "Data on the temp drive might be lost when:" },
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
      title: "Temp drive size",
      blocks: [
        {
          kind: "p",
          text: "The VM size you pick sets the temp drive’s size. In the Ddsv5 series:",
        },
        {
          kind: "ul",
          items: [
            "Standard_D2ds_v5 comes with a 75 GiB temp drive.",
            "Standard_D96ds_v5 comes with 3,600 GiB.",
          ],
        },
        { kind: "p", text: "Some VM sizes have no temp drive at all." },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            "The VM price includes the temp drive. It has no separate charge.",
            "Data you need to keep belongs on managed data disks. Azure charges those by the size you provision, not the data you write.",
            [
              "To see how much of each disk holds data, ",
              { a: "check used vs provisioned space", href: "/learn/azure-vm-disk-usage" },
              ".",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " moves a VM’s data disks onto one btrfs pool sized to your data, then rightsizes it autonomously. It works on managed data disks only, never the OS disk or the temp drive.",
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Azure managed disk",
      line: "The persistent disk, charged by its provisioned size.",
      href: "/learn/glossary/azure-managed-disk",
    },
    {
      title: "Ephemeral OS disk",
      line: "An OS disk that isn’t persistent either.",
      href: "/learn/glossary/ephemeral-os-disk",
    },
    {
      title: "Instance store",
      line: "The AWS version: temporary storage on the host.",
      href: "/learn/glossary/instance-store",
    },
    {
      title: "Block storage",
      line: "Storage you attach to a VM as a disk.",
      href: "/learn/glossary/block-storage",
    },
  ],
  relatedTitle: "Related terms",
  next: {
    title: "How to check Azure VM disk usage",
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
