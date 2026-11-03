import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/btrfs/1";

export const term: GlossaryTerm = {
  slug: "btrfs",
  term: "btrfs",
  title: "What is btrfs?",
  meta: "btrfs is a copy-on-write Linux filesystem. Its main features, how its compression works, and how it adds or removes disks while mounted.",
  h1: "What is btrfs?",
  card: "btrfs is a copy-on-write (COW) filesystem in the Linux kernel.",
  group: "block-storage",
  product: "amoeba",
  published: "2026-11-02",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: "btrfs is a copy-on-write (COW) filesystem in the Linux kernel. Instead of overwriting data in place, it writes each change to free space on the disk.",
    },
  ],
  sections: [
    {
      id: "the-main-btrfs-features",
      title: "Main features",
      blocks: [
        {
          kind: "ul",
          items: [
            [
              { b: "Subvolumes" },
              " are separate file trees inside one filesystem. You can mount each one on its own, and they all share its free space.",
            ],
            [
              { b: "Snapshots" },
              " are copy-on-write copies of a subvolume. A snapshot shares all unchanged data with its source. ",
              { a: "btrfs vs ext4 vs XFS", href: "/learn/btrfs-vs-lvm" },
              " also compares btrfs snapshots with LVM snapshots.",
            ],
            [
              { b: "Checksums" },
              " cover data and metadata. A scrub reads everything back and checks it while the filesystem stays mounted. ",
              { a: "Is btrfs stable?", href: "/learn/is-btrfs-stable" },
              " covers scrub and RAID.",
            ],
            [
              { b: "Reflinks" },
              " are copies that share their source’s data until one of them changes. btrfs also supports deduplication, and send and receive for incremental backups.",
            ],
          ],
        },
        {
          kind: "p",
          text: "Not every Linux distribution ships btrfs. Red Hat removed it in Red Hat Enterprise Linux (RHEL) 8.",
        },
      ],
    },
    {
      id: "how-btrfs-compression-works",
      title: "Compression",
      blocks: [
        {
          kind: "p",
          text: "btrfs compresses files transparently, so apps read and write them as usual. It offers three algorithms: ZLIB, LZO and ZSTD. This mount turns it on for the whole filesystem:",
        },
        { kind: "code", lang: "bash", code: "mount -o compress=zstd /dev/sdx /mnt" },
        {
          kind: "p",
          text: [
            "ZLIB and ZSTD default to level 3. A plain ",
            { code: "compress" },
            " means ZLIB. LZO has one level.",
          ],
        },
        {
          kind: "p",
          text: [
            "Only data written after you turn it on is compressed. To compress an existing file, run ",
            { code: "btrfs filesystem defrag -czstd <file>" },
            ". To compress one file’s future writes, run ",
            { code: "btrfs property set <file> compression zstd" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "If the first part of a file doesn’t get smaller, btrfs marks the whole file NOCOMPRESS and stops compressing it. The docs advise against ",
            { code: "compress-force" },
            ", which always tries.",
          ],
        },
        {
          kind: "p",
          text: [
            "Compression needs copy-on-write and data checksums, so ",
            { code: "nodatacow" },
            " and ",
            { code: "nodatasum" },
            " turn it off.",
          ],
        },
      ],
    },
    {
      id: "how-btrfs-grows-and-shrinks-while-mounted",
      title: "Adding and removing disks",
      blocks: [
        {
          kind: "p",
          text: "One btrfs filesystem can span several disks, with a choice of RAID profiles. It grows and shrinks while it stays mounted.",
        },
        {
          kind: "ul",
          items: [
            [
              { code: "btrfs device add" },
              " adds a disk. It’s instant and leaves the existing data where it is.",
            ],
            [
              { a: { code: "btrfs device remove" }, href: "/learn/btrfs-device-remove" },
              " moves all data off the disk first, so it can take a long time. It fails if the profile can’t allow it, such as RAID1 going from two disks to one.",
            ],
          ],
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
          text: "Azure charges a managed disk for its provisioned size, not the data on it, and doesn’t support shrinking one. AWS says of Amazon Elastic Block Store (EBS) volumes: “You can’t decrease the volume size.”",
        },
        {
          kind: "p",
          text: "So a smaller filesystem alone doesn’t give you a smaller disk. With btrfs across several disks, you can empty one while it stays mounted, then detach and delete it. Its charge stops.",
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
          text: "It works on Azure managed disks and Amazon EBS volumes, on Windows and Linux VMs. It never touches the OS disk or root volume. On Linux, the VM needs a recent kernel with btrfs.",
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
  relatedTitle: "Related terms",
  next: {
    title: "btrfs on multiple disks: single or RAID 1",
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
