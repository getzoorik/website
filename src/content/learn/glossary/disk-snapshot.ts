import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/disk-snapshot/1";

export const term: GlossaryTerm = {
  slug: "disk-snapshot",
  term: "Disk snapshot (Azure managed disk and EBS)",
  title: "What is a disk snapshot in Azure and AWS?",
  meta: "A disk snapshot in Azure or AWS is a point-in-time copy of one disk. See how Azure and EBS snapshots work, what one covers in a VM, and how each is charged.",
  h1: "What is a disk snapshot in Azure and AWS?",
  card: "A disk snapshot in Azure or AWS is a point-in-time copy of one disk.",
  group: "block-storage",
  product: "amoeba",
  published: "2026-10-26",
  updated: "2026-10-27",
  definition: [
    {
      kind: "p",
      text: "A disk snapshot in Azure or AWS is a point-in-time copy of one disk. You can keep it as a backup, or create a new disk from it.",
    },
  ],
  sections: [
    {
      id: "azure-snapshots-and-ebs-snapshots",
      title: "Azure snapshots and EBS snapshots",
      blocks: [
        {
          kind: "ul",
          items: [
            "A snapshot in Azure is a read-only copy of a single managed disk, OS or data.",
            "The first EBS snapshot in AWS saves every block written to the volume. Later ones save only new or changed blocks.",
            "AWS stores them in Amazon S3. Each can become a new volume in any Availability Zone of its Region.",
          ],
        },
      ],
    },
    {
      id: "snapshots-of-an-azure-vm",
      title: "Snapshots of an Azure VM",
      blocks: [
        {
          kind: "p",
          text: "A snapshot copies one disk, not a whole virtual machine (VM). Say a VM has an OS disk and two data disks. That takes three snapshots.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: "Azure doesn’t coordinate them, so they don’t suit striped disks. Each is crash-consistent: it holds what a crash would leave on the disk.",
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
            "Azure charges for a snapshot’s used size. A snapshot of a 64\u00a0GiB disk holding 10\u00a0GiB is charged for 10\u00a0GiB.",
            [
              "AWS charges for the data an ",
              { a: "EBS snapshot", href: "/learn/ebs-snapshot-cost" },
              " stores.",
            ],
            "A forgotten snapshot is charged until it’s deleted.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " moves a VM’s data disks onto one btrfs pool sized to your data, then rightsizes it autonomously.",
          ],
        },
        {
          kind: "p",
          text: [
            "Once the switch to the pool is checked, Amoeba snapshots each old disk and deletes the disk. On Azure it’s an ",
            { a: "incremental snapshot", href: "/learn/azure-disk-snapshot-cost" },
            ", and on AWS an EBS snapshot. Amoeba keeps each snapshot for a few days, then deletes it too.",
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
      title: "Azure managed disks",
      line: "The Azure disks a snapshot copies.",
      href: "/learn/glossary/azure-managed-disk",
    },
    {
      title: "EBS volume",
      line: "The AWS disk behind an EBS snapshot.",
      href: "/learn/glossary/ebs-volume",
    },
    {
      title: "Azure Standard HDD",
      line: "The storage type Azure suggests for most snapshots.",
      href: "/learn/glossary/azure-standard-hdd",
    },
  ],
  next: {
    title: "Azure disk snapshot cost: incremental vs full snapshots",
    href: "/learn/azure-disk-snapshot-cost",
  },
  sources: [
    {
      publisher: "Microsoft Learn",
      title: "“Overview of Azure Disk Storage”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/managed-disks-overview",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Create a snapshot of an Azure managed disk”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/snapshot-copy-managed-disk",
    },
    {
      publisher: "AWS",
      title: "“Amazon EBS snapshots”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-snapshots.html",
    },
    {
      publisher: "AWS",
      title: "“How Amazon EBS snapshots work”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/how_snapshots_work.html",
    },
  ],
};
