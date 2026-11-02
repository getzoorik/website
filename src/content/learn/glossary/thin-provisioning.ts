import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/thin-provisioning/1";

export const term: GlossaryTerm = {
  slug: "thin-provisioning",
  term: "Thin provisioning",
  title: "Thick vs thin provisioning in storage",
  meta: "Thin provision a volume and it takes space only as you write data. Thick provision it and the full size is set aside. See why cloud disks cost their full size.",
  h1: "Thick vs thin provisioning in storage",
  card: "Thin provisioning in storage creates a volume that takes up space only as you write data.",
  group: "block-storage",
  product: "amoeba",
  published: "2026-10-25",
  updated: "2026-11-02",
  definition: [
    {
      kind: "p",
      text: "Thin provisioning in storage creates a volume that takes up space only as you write data. You still set its full size when you create it. Its share of the storage pool starts small and grows with your data.",
    },
  ],
  sections: [
    {
      id: "thin-provisioning-vs-thick-provisioning",
      title: "Thin provisioning vs thick provisioning: up front or as you write",
      blocks: [
        {
          kind: "ul",
          items: [
            "Thick provisioning reserves the full size up front. A thick disk still works when the pool is full.",
            "Thin provisioning takes space only as needed, and thin volumes can add up to more than the pool holds.",
          ],
        },
        {
          kind: "p",
          text: "When choosing thick or thin provisioning, Microsoft recommends thin if you don’t know how much space a volume needs. To limit what a volume takes from the pool, it recommends thick, which Azure Local calls “fixed”.",
        },
      ],
    },
    {
      id: "a-10-gb-virtual-disk",
      title: "A 10\u00a0GB virtual disk, thick or thin provisioned",
      blocks: [
        {
          kind: "p",
          text: "In Microsoft’s example, you create a 10\u00a0GB virtual disk. With thick provisioning, all 10\u00a0GB is set aside at once, and other virtual machines (VMs) can’t share it.",
        },
        { kind: "p", text: "A thin provisioned disk takes only what it needs, then grows." },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why thin provisioning matters for your cloud cost",
      blocks: [
        {
          kind: "p",
          text: "Provisioning storage sets your cloud cost. Azure charges a managed disk’s full size from first use, and Amazon EBS charges each provisioned GB every month. So an empty GiB costs as much as a full one.",
        },
        {
          kind: "p",
          text: "In Microsoft’s pricing example, a 1\u00a0TiB Standard SSD holds 120\u00a0GiB. You still pay for 1\u00a0TiB.",
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
    { title: "EBS volume", line: "The AWS version.", href: "/learn/glossary/ebs-volume" },
    {
      title: "df vs du",
      line: "Two ways to check how full a disk is.",
      href: "/learn/glossary/df-vs-du",
    },
  ],
  relatedTitle: "Terms related to thin provisioning",
  next: { title: "Azure disk reservations", href: "/learn/azure-disk-reservations" },
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
