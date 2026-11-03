import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/thin-provisioning/1";

export const term: GlossaryTerm = {
  slug: "thin-provisioning",
  term: "Thin provisioning",
  title: "Thick vs thin provisioning",
  meta: "Thick vs thin provisioning: thin takes space as you write data, thick sets the full size aside. How they differ, and how cloud disks are charged.",
  h1: "Thick vs thin provisioning",
  card: "Thin provisioning creates a volume that takes up space only as you write data.",
  group: "block-storage",
  product: "amoeba",
  published: "2026-10-25",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: "Thin provisioning creates a volume that takes up space only as you write data. Thick provisioning sets the volume’s full size aside when you create it.",
    },
    {
      kind: "p",
      text: "You set a thin volume’s full size too. Its share of the storage pool starts small and grows with your data.",
    },
  ],
  sections: [
    {
      id: "thin-provisioning-vs-thick-provisioning",
      title: "How they differ",
      blocks: [
        {
          kind: "table",
          columns: [
            { label: "", width: "30%" },
            { label: "Thick", width: "35%" },
            { label: "Thin", width: "35%" },
          ],
          rows: [
            ["Space set aside", "The full size, at once", "Only what the data needs"],
            ["Unused space", "Held for this volume", "Free for other volumes"],
            ["Total size can exceed the pool", "No", "Yes"],
            [
              "Microsoft recommends it",
              "To limit what a volume takes from the pool",
              "If you don’t know how much space a volume needs",
            ],
          ],
        },
        {
          kind: "p",
          text: "A thick disk keeps working when the pool is full, because its space is reserved. Azure Local calls thick provisioning “fixed”, and can convert fixed volumes to thin.",
        },
      ],
    },
    {
      id: "a-10-gb-virtual-disk",
      title: "A 10 GB example",
      blocks: [
        {
          kind: "p",
          text: "Microsoft’s example is a 10 GB virtual disk. Thick provisioned, all 10 GB is set aside at once, and other virtual machines (VMs) can’t share it. A thin provisioned disk takes only what its data needs, then grows.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for cloud cost",
      blocks: [
        {
          kind: "p",
          text: "You pay for a cloud disk as if it were thick: by its full size, not your data.",
        },
        {
          kind: "ul",
          items: [
            "Azure charges a managed disk for its full size once it’s first used.",
            "Amazon EBS charges each GB you provision, every month.",
          ],
        },
        {
          kind: "p",
          text: "In Microsoft’s pricing example, a 1 TiB Standard SSD holds 120 GiB of data. You still pay for 1 TiB.",
        },
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " moves a VM’s data disks onto one btrfs pool sized to your data, then ",
            { a: "rightsizes", href: "/learn/glossary/rightsizing" },
            " it autonomously. So you pay for close to what you use.",
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Block storage",
      line: "Disks you attach to VMs.",
      href: "/learn/glossary/block-storage",
    },
    {
      title: "Azure managed disk",
      line: "The Azure cloud disk, charged by its size.",
      href: "/learn/glossary/azure-managed-disk",
    },
    {
      title: "EBS volume",
      line: "The AWS cloud disk, charged by its size.",
      href: "/learn/glossary/ebs-volume",
    },
    {
      title: "df vs du",
      line: "Two ways to check how full a disk is.",
      href: "/learn/glossary/df-vs-du",
    },
  ],
  relatedTitle: "Related terms",
  next: { title: "How to check EBS volume usage", href: "/learn/check-ebs-volume-usage" },
  sources: [
    {
      publisher: "Microsoft Learn",
      title: "“Storage thin provisioning in Azure Local, version 23H2”",
      url: "https://learn.microsoft.com/en-us/azure/azure-local/manage/manage-thin-provisioning-23h2",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Microsoft Azure VMware Solution FAQ”",
      url: "https://learn.microsoft.com/en-us/azure/azure-vmware/faq",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Understand Azure Disk Storage billing”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-understand-billing",
    },
    { publisher: "AWS", title: "“Amazon EBS pricing”", url: "https://aws.amazon.com/ebs/pricing/" },
  ],
};
