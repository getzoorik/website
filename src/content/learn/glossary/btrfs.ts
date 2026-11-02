import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/btrfs/1";

export const term: GlossaryTerm = {
  slug: "btrfs",
  term: "btrfs",
  title: "What is btrfs? The btrfs filesystem in Linux",
  meta: "The btrfs file system in Linux writes changes as new copies, checksums data, compresses files and spans disks you can add or remove while it stays mounted.",
  h1: "What is btrfs? The btrfs filesystem in Linux",
  card: "btrfs is a copy-on-write (COW) filesystem for Linux, part of the Linux kernel.",
  group: "block-storage",
  product: "amoeba",
  published: "2026-11-02",
  updated: "2026-11-02",
  definition: [
    {
      kind: "p",
      text: "btrfs is a copy-on-write (COW) filesystem for Linux, part of the Linux kernel. Instead of overwriting data in place, it writes each change to an unused place on the disk.",
    },
    {
      kind: "p",
      text: "Not every Linux distribution ships it. Red Hat removed btrfs in Red Hat Enterprise Linux (RHEL) 8.",
    },
  ],
  sections: [
    {
      id: "the-main-btrfs-features",
      title: "The main btrfs features",
      blocks: [
        {
          kind: "ul",
          items: [
            "Subvolumes are separate trees of files inside one btrfs filesystem. You can mount each one as if it were its own filesystem, and all of them share its free space.",
            [
              "A snapshot is a copy-on-write copy of a subvolume. The two share all their unchanged data, so keeping a filesystem’s history is cheap. ",
              { a: "btrfs vs LVM", href: "/learn/btrfs-vs-lvm" },
              " compares them with LVM snapshots.",
            ],
            [
              "btrfs keeps checksums on data and metadata. A scrub reads it all back and verifies the checksums while the filesystem stays mounted. ",
              { a: "Is btrfs stable in 2026?", href: "/learn/is-btrfs-stable" },
              " covers scrub and RAID.",
            ],
            "A reflink copy shares the same data as its source until one of them changes. btrfs also supports deduplication, and send and receive for incremental backups.",
          ],
        },
      ],
    },
    {
      id: "how-btrfs-compression-works",
      title: "How btrfs compression works",
      blocks: [
        {
          kind: "p",
          text: "btrfs supports transparent file compression, so apps read and write files as usual. It offers three algorithms: ZLIB, LZO and ZSTD.",
        },
        {
          kind: "p",
          text: "The docs’ example turns it on for the whole filesystem, subvolume mounts included:",
        },
        { kind: "code", lang: "bash", code: "mount -o compress=zstd /dev/sdx /mnt" },
        {
          kind: "p",
          text: [
            "With no level given, ZLIB and ZSTD both use level 3. A plain ",
            { code: "compress" },
            " with no algorithm means ZLIB. LZO has only one level.",
          ],
        },
        {
          kind: "p",
          text: [
            "Compression applies only to data written after you turn it on. To compress an existing file, rewrite it with ",
            { code: "btrfs filesystem defrag -czstd <file>" },
            ". To compress one file’s future writes, run ",
            { code: "btrfs property set <file> compression zstd" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "Quick checks skip data that won’t compress well. If the first part of a file doesn’t get smaller, btrfs marks the whole file NOCOMPRESS and stops compressing it. The docs advise against ",
            { code: "compress-force" },
            ", which tries every block anyway.",
          ],
        },
        {
          kind: "p",
          text: [
            "Compression needs copy-on-write and data checksums, so the ",
            { code: "nodatacow" },
            " and ",
            { code: "nodatasum" },
            " options turn it off.",
          ],
        },
      ],
    },
    {
      id: "how-btrfs-grows-and-shrinks-while-mounted",
      title: "How btrfs grows and shrinks while mounted",
      blocks: [
        {
          kind: "p",
          text: "One btrfs filesystem can span several disks, with a choice of RAID profiles. It can also grow or shrink in place while it stays mounted.",
        },
        {
          kind: "ul",
          items: [
            [
              { code: "btrfs device add" },
              " adds a disk to the mounted filesystem. It’s instant, and doesn’t affect the data already there.",
            ],
            [
              { a: { code: "btrfs device remove" }, href: "/learn/btrfs-device-remove" },
              " moves all the data off the disk first, so it can take a long time. It fails where the profile can’t allow it, such as RAID1 going from two disks to one.",
            ],
          ],
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why btrfs matters for your cloud cost",
      blocks: [
        {
          kind: "p",
          text: "Azure charges a managed disk for its provisioned size, however full it is, and doesn’t support shrinking one. AWS says of Amazon Elastic Block Store (EBS) volumes: “You can’t decrease the volume size.”",
        },
        {
          kind: "p",
          text: "So a smaller filesystem alone doesn’t make a smaller disk. With btrfs across several disks, you can empty one while it stays mounted. Then you detach and delete it, and its charge stops.",
        },
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " moves the data disks of a virtual machine (VM) onto one btrfs pool sized to your data. It grows the pool before it fills. When your data goes down and stays down, it shrinks the pool one disk at a time.",
          ],
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
      title: "XFS",
      line: "A Linux filesystem that grows while mounted but barely shrinks.",
      href: "/learn/glossary/xfs",
    },
    {
      title: "Block storage",
      line: "The disks a btrfs filesystem sits on.",
      href: "/learn/glossary/block-storage",
    },
    {
      title: "Thin provisioning",
      line: "Space taken only as you write data.",
      href: "/learn/glossary/thin-provisioning",
    },
    {
      title: "Rightsizing",
      line: "Sizing a resource to its measured use.",
      href: "/learn/glossary/rightsizing",
    },
  ],
  next: {
    title: "btrfs on multiple disks: how a btrfs pool works",
    href: "/learn/btrfs-multiple-disks",
  },
  sources: [
    {
      publisher: "The Linux Kernel documentation",
      title: "“BTRFS”",
      url: "https://docs.kernel.org/filesystems/btrfs.html",
    },
    {
      publisher: "BTRFS documentation",
      title: "“Compression”",
      url: "https://btrfs.readthedocs.io/en/latest/Compression.html",
    },
    {
      publisher: "BTRFS documentation",
      title: "“btrfs(5)”",
      url: "https://btrfs.readthedocs.io/en/latest/btrfs-man5.html",
    },
    {
      publisher: "man7.org",
      title: "“btrfs-device(8): Linux manual page”",
      url: "https://man7.org/linux/man-pages/man8/btrfs-device.8.html",
    },
    {
      publisher: "Red Hat",
      title: "“Considerations in adopting RHEL 8: File systems and storage”",
      url: "https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/8/html/considerations_in_adopting_rhel_8/file-systems-and-storage_considerations-in-adopting-rhel-8",
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
