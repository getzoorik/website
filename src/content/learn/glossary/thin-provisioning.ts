import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/thin-provisioning/1";

export const term: GlossaryTerm = {
  slug: "thin-provisioning",
  term: "Thin provisioning",
  title: "Thin provisioning vs thick provisioning",
  meta: "Thin provisioning means a volume takes space only as you write data. See how it differs from thick provisioning, and how Azure and AWS charge by disk size.",
  h1: "Thin provisioning vs thick provisioning",
  card: "Thin provisioning in storage creates a volume that takes up space only as you write data.",
  group: "block-storage",
  product: "amoeba",
  published: "2026-10-25",
  updated: "2026-11-01",
  definition: [
    {
      kind: "p",
      text: "Thin provisioning in storage creates a volume that takes up space only as you write data. You still set its full size when you create it. Its share of the storage pool starts small and grows with your data.",
    },
  ],
  sections: [
    {
      id: "thin-provisioning-vs-thick-provisioning",
      title: "Thin provisioning vs thick provisioning",
      blocks: [
        {
          kind: "ul",
          items: [
            "Thick provisioning reserves the full size up front. A thick disk still works when the pool is full.",
            "Thin provisioning takes space only as needed, and thin volumes can add up to more than the pool holds.",
          ],
        },
      ],
    },
    {
      id: "a-10-gb-virtual-disk",
      title: "A 10\u00a0GB virtual disk",
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
      title: "Why it matters for your cloud cost",
      blocks: [
        {
          kind: "p",
          text: "Azure managed disks and Amazon EBS volumes charge for the size you provision, not the data you write. So an empty GiB costs the same as a full one.",
        },
        {
          kind: "ul",
          items: [
            "In Microsoft’s pricing example, a 1\u00a0TiB Standard SSD holds 120\u00a0GiB. You still pay for 1\u00a0TiB.",
            "Azure charges for a managed disk’s full size from first use.",
            "Amazon EBS charges per provisioned GB each month.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " moves a VM’s data disks onto one pool sized to your data, then rightsizes it autonomously. The ",
            { a: "free assessment", href: "/assessment?p=amoeba" },
            " works out your own figure.",
          ],
        },
        {
          kind: "p",
          text: [
            "Sizing disks to their data is ",
            { a: "rightsizing", href: "/learn/glossary/rightsizing" },
            ".",
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
  next: { title: "Azure disk cost optimization", href: "/learn/azure-disk-cost-optimization" },
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
