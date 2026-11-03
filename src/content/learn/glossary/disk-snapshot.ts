import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/disk-snapshot/1";

export const term: GlossaryTerm = {
  slug: "disk-snapshot",
  term: "Disk snapshot (Azure managed disk and EBS)",
  title: "What is a snapshot in AWS and Azure?",
  meta: "A disk snapshot in AWS is an EBS snapshot: a point-in-time copy of one volume. How EBS and Azure disk snapshots work, and what they cost.",
  h1: "What is a snapshot in AWS and Azure?",
  card: "A disk snapshot in AWS is an Amazon EBS snapshot: a point-in-time copy of one volume.",
  group: "block-storage",
  product: "amoeba",
  published: "2026-10-26",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: "A disk snapshot in AWS is an Amazon EBS snapshot: a point-in-time copy of one volume. An Azure disk snapshot does the same for one managed disk. You keep a snapshot as a backup, or create a new disk from it.",
    },
  ],
  sections: [
    {
      id: "azure-snapshots-and-ebs-snapshots",
      title: "How snapshots work",
      blocks: [
        { kind: "h3", id: "ebs-snapshots", title: "EBS snapshots" },
        {
          kind: "ul",
          items: [
            "The first snapshot of a volume is full: it copies every block written to the volume.",
            "Later ones are incremental: they copy only new and changed blocks.",
            "AWS stores them in Amazon S3. You can restore one to a new volume in any Availability Zone of its Region.",
          ],
        },
        { kind: "h3", id: "azure-disk-snapshots", title: "Azure disk snapshots" },
        {
          kind: "ul",
          items: [
            "A snapshot is a read-only copy of one managed disk, OS or data. It’s crash-consistent: it holds what a sudden crash would leave on the disk.",
            "A full snapshot copies the whole disk. An incremental one copies only the changes since the last snapshot, after a first full copy.",
            "Incremental snapshots always use Standard HDD storage. Full ones can use Premium SSD, which costs more.",
          ],
        },
      ],
    },
    {
      id: "snapshots-of-an-azure-vm",
      title: "Azure VM snapshots",
      blocks: [
        {
          kind: "p",
          text: "A snapshot copies one disk, not a whole virtual machine (VM). A VM with an OS disk and two data disks takes three snapshots.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: "Azure doesn’t coordinate snapshots across disks, so they don’t suit striped disks.",
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            "Azure charges for a snapshot’s used size. A snapshot of a 64\u00a0GiB disk holding 10\u00a0GiB is charged for 10\u00a0GiB.",
            "AWS charges for the data a snapshot stores. A first snapshot of a 200\u00a0GiB volume holding 50\u00a0GiB is charged for 50\u00a0GiB.",
            "Deleting an EBS snapshot may not reduce the cost, because other snapshots can still use its data.",
            "A forgotten snapshot is charged until you delete it.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Azure snapshot pricing", href: "/learn/azure-disk-snapshot-cost" },
            " compares incremental and full snapshots.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " moves a VM’s data disks onto one btrfs pool sized to your data, then rightsizes it autonomously. Once the switch to the pool is checked, it snapshots each old disk, then deletes the disk. It keeps each snapshot for 7\u00a0days, and you pay for it until then.",
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
      line: "Where Azure suggests keeping most snapshots.",
      href: "/learn/glossary/azure-standard-hdd",
    },
  ],
  relatedTitle: "Related terms",
  next: { title: "AWS snapshot pricing", href: "/learn/ebs-snapshot-cost" },
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
      publisher: "Microsoft Learn",
      title: "“Create an incremental snapshot”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-incremental-snapshots",
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
