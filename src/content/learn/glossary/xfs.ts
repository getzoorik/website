import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/xfs/1";

export const term: GlossaryTerm = {
  slug: "xfs",
  term: "XFS",
  title: "What is the XFS filesystem?",
  meta: "XFS is a journaling filesystem for Linux and the default in RHEL. How the XFS filesystem is laid out, where you meet it, and why it grows but can’t shrink.",
  h1: "What is the XFS filesystem?",
  card: "XFS is a high-performance journaling filesystem for Linux.",
  group: "block-storage",
  product: "amoeba",
  published: "2026-11-02",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: "XFS is a high-performance journaling filesystem for Linux. It began on SGI’s IRIX and supports large files and large filesystems. It can grow while mounted but not shrink.",
    },
  ],
  sections: [
    {
      id: "how-xfs-lays-out-a-disk",
      title: "XFS layout",
      blocks: [
        {
          kind: "p",
          text: "An XFS filesystem sits on a disk partition or a logical volume. It has up to three sections:",
        },
        {
          kind: "ul",
          items: [
            "Data: file data and all the metadata, split into allocation groups (AGs). More AGs allow more file and block allocation in parallel.",
            "Log: the journal of metadata changes. After a crash, XFS reads it at mount to finish the operations that were in progress.",
            [
              "Realtime: the data of realtime files. With the default ",
              { code: "mkfs.xfs" },
              " options there is none, and the log sits inside the data section.",
            ],
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: "XFS tracks directories, extents and free space in B-trees, which keeps it fast at scale.",
        },
      ],
    },
    {
      id: "xfs-on-red-hat-amazon-linux",
      title: "Where XFS is used",
      blocks: [
        {
          kind: "ul",
          items: [
            "Red Hat Enterprise Linux (RHEL) 9: the default filesystem, supported up to 1024 TiB, against 50 TiB for ext4.",
            "Amazon Linux 2023 and Amazon Linux 2: used for the root filesystem.",
            [
              "Azure: Microsoft’s steps for a standard marketplace Red Hat image grow its XFS root with ",
              { code: "xfs_growfs" },
              ".",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Red Hat advises XFS unless you have a specific use case for ext4, such as shrinking while unmounted. ",
            { a: "btrfs vs ext4 vs XFS", href: "/learn/btrfs-vs-lvm" },
            " compares the three.",
          ],
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for cost",
      blocks: [
        {
          kind: "p",
          text: [
            "XFS grows while mounted, but Red Hat says “XFS has no utility to reduce the size of a file system.” ",
            { code: "xfs_growfs" },
            " can only ",
            {
              a: "trim free space from the last allocation group",
              href: "/learn/shrink-xfs-filesystem",
            },
            ", never remove a group.",
          ],
        },
        {
          kind: "p",
          text: "The cloud disk under it can’t shrink either. Azure charges a managed disk for its provisioned size and doesn’t support shrinking it. AWS says of Amazon Elastic Block Store (EBS) volumes: “You can’t decrease the volume size.”",
        },
        {
          kind: "p",
          text: "So an XFS data disk keeps costing its full size after its data shrinks. AWS’s answer is a new, smaller volume and a copy with a tool such as rsync.",
        },
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " does that for you, without any downtime. It moves the data disks of a virtual machine (VM), XFS mounts included, onto one btrfs pool sized to your data.",
          ],
        },
        {
          kind: "p",
          text: "It grows the pool before it fills, and shrinks it one disk at a time when your data goes down and stays down. It works on Azure managed disks and Amazon EBS volumes, and never touches the OS disk or root volume. On Linux, the VM’s kernel must support btrfs.",
        },
      ],
    },
  ],
  related: [
    {
      title: "btrfs",
      line: "A Linux filesystem that adds and removes disks while mounted.",
      href: "/learn/glossary/btrfs",
    },
    {
      title: "Block storage",
      line: "Storage a server uses as a disk.",
      href: "/learn/glossary/block-storage",
    },
    {
      title: "Azure managed disk",
      line: "Block storage on Azure.",
      href: "/learn/glossary/azure-managed-disk",
    },
    { title: "EBS volume", line: "Block storage on AWS.", href: "/learn/glossary/ebs-volume" },
  ],
  relatedTitle: "Related terms",
  next: {
    title: "Can you shrink an XFS filesystem?",
    href: "/learn/shrink-xfs-filesystem",
  },
  sources: [
    {
      publisher: "The Linux Kernel documentation",
      title: "“The SGI XFS Filesystem”",
      url: "https://docs.kernel.org/admin-guide/xfs.html",
    },
    {
      publisher: "man7.org",
      title: "“xfs(5) - Linux manual page”",
      url: "https://man7.org/linux/man-pages/man5/xfs.5.html",
    },
    {
      publisher: "man7.org",
      title: "“xfs_growfs(8) - Linux manual page”",
      url: "https://man7.org/linux/man-pages/man8/xfs_growfs.8.html",
    },
    {
      publisher: "Red Hat",
      title: "“Managing file systems”",
      url: "https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html-single/managing_file_systems/index",
      note: " (RHEL 9)",
    },
    {
      publisher: "AWS",
      title: "“gp3 as default Amazon EBS volume type”",
      url: "https://docs.aws.amazon.com/linux/al2023/ug/continuing-al2-filesystem.html",
      note: " (Amazon Linux 2023 User Guide)",
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
    {
      publisher: "AWS",
      title: "“Modify an Amazon EBS volume using Elastic Volumes operations”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-modify-volume.html",
    },
  ],
};
