import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/xfs/1";

export const term: GlossaryTerm = {
  slug: "xfs",
  term: "XFS",
  title: "What is XFS? The XFS filesystem in Linux",
  meta: "XFS is a high-performance journaling filesystem, the default in RHEL 9 and the root filesystem on Amazon Linux. How it works, and why it barely shrinks.",
  h1: "What is XFS? The XFS filesystem in Linux",
  card: "XFS is a high-performance journaling filesystem for Linux that began on SGI’s IRIX platform.",
  group: "block-storage",
  product: "amoeba",
  published: "2026-11-02",
  updated: "2026-11-02",
  definition: [
    {
      kind: "p",
      text: "XFS is a high-performance journaling filesystem for Linux that began on SGI’s IRIX platform. It is extent based, and supports large files and large filesystems.",
    },
  ],
  sections: [
    {
      id: "how-xfs-lays-out-a-disk",
      title: "How XFS lays out a disk",
      blocks: [
        {
          kind: "p",
          text: "An XFS filesystem sits on a disk partition or a logical volume. It has up to three parts:",
        },
        {
          kind: "ul",
          items: [
            "The data section holds file data and all the metadata, split into allocation groups (AGs). The number of AGs sets how much file and block allocation runs in parallel.",
            "The log section is the journal. It records changes to metadata while the filesystem runs. After a crash, XFS reads it to finish the operations that were in progress.",
            [
              "The realtime section stores the data of realtime files. With the default ",
              { code: "mkfs.xfs" },
              " options, there’s no realtime section, and the log sits inside the data section.",
            ],
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: "XFS tracks its directories, extents and free space in B-trees, for performance and scale.",
        },
      ],
    },
    {
      id: "xfs-on-red-hat-amazon-linux",
      title: "XFS on Red Hat, Amazon Linux and Azure VMs",
      blocks: [
        {
          kind: "ul",
          items: [
            "On Red Hat Enterprise Linux (RHEL) 9, XFS is the default filesystem. Red Hat supports it up to 1024\u00a0TiB, against 50\u00a0TiB for ext4.",
            "Amazon Linux 2023 (AL2023) and Amazon Linux 2 both use XFS for the root filesystem.",
            [
              "On Azure, Microsoft’s steps for a standard marketplace Red Hat image grow its XFS root with ",
              { code: "xfs_growfs" },
              ".",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Red Hat advises XFS unless you have a specific use case for ext4, such as shrinking while unmounted. ",
            { a: "btrfs vs LVM", href: "/learn/btrfs-vs-lvm" },
            " compares XFS, ext4 and btrfs.",
          ],
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why XFS matters for your cloud cost",
      blocks: [
        {
          kind: "p",
          text: [
            "XFS grows while mounted, but Red Hat says “XFS has no utility to reduce the size of a file system.” ",
            { code: "xfs_growfs" },
            " can only ",
            { a: "trim the last allocation group", href: "/learn/shrink-xfs-filesystem" },
            ", never remove one.",
          ],
        },
        {
          kind: "p",
          text: "The cloud disk under it can’t shrink either. Azure charges a managed disk for its provisioned size and doesn’t support shrinking it. AWS says of Amazon Elastic Block Store (EBS) volumes: “You can’t decrease the volume size.”",
        },
        {
          kind: "p",
          text: "So an XFS data disk keeps costing its full size after the data shrinks. AWS’s answer is a new, smaller volume and a copy with a tool such as rsync.",
        },
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " makes that copy for you, once, XFS data mounts included. It moves the data disks of a virtual machine (VM) onto one btrfs pool sized to your data.",
          ],
        },
        {
          kind: "p",
          text: "It grows the pool before it fills. When your data goes down and stays down, it shrinks the pool one disk at a time.",
        },
        {
          kind: "p",
          text: "It works on Azure managed disks and Amazon EBS volumes, on Windows and Linux VMs. It never touches the OS disk or root volume. On Linux, the kernel must support btrfs.",
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
      line: "Storage that a server uses as a disk.",
      href: "/learn/glossary/block-storage",
    },
    {
      title: "Azure managed disk",
      line: "Block storage on Azure.",
      href: "/learn/glossary/azure-managed-disk",
    },
    { title: "EBS volume", line: "Block storage on AWS.", href: "/learn/glossary/ebs-volume" },
  ],
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
