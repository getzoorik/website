import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/btrfs-vs-lvm/1";
import { figure as figure2 } from "@/features/learn/figures/btrfs-vs-lvm/2";

export const article: Article = {
  slug: "btrfs-vs-lvm",
  title: "btrfs vs ext4 vs XFS: which can shrink?",
  meta: "btrfs vs ext4 vs XFS on LVM: which can shrink or take a cloud disk out while mounted, how snapshots differ and where ZFS fits.",
  h1: "btrfs vs ext4 vs XFS: which can shrink?",
  deck: "Compared on a cloud VM with ext4 and XFS on LVM, where you reduce cost only by removing a whole disk.",
  card: "ext4 shrinks only unmounted, and XFS can’t shrink. btrfs takes a disk out while mounted.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Linux filesystems",
  versus: ["btrfs", "LVM"],
  published: "2026-11-01",
  updated: "2026-11-03",
  author: "sourabh",
  cover: "/learn-covers/zoorik-learn-btrfs-vs-lvm-1200x630.webp",
  coverAlt: "btrfs vs LVM: btrfs frees a disk directly, while LVM must shrink the filesystem first",
  short:
    "btrfs can shrink, and take a whole disk out, while mounted. ext4 shrinks only while unmounted. XFS can’t shrink. On LVM, taking a disk out needs free extents, so an LV that fills the volume group must shrink its filesystem first.",
  sections: [
    {
      id: "at-a-glance",
      title: "At a glance",
      blocks: [
        {
          kind: "p",
          text: "The Logical Volume Manager (LVM) pools disks in three layers, with a filesystem on top:",
        },
        {
          kind: "ul",
          items: [
            "Each disk becomes a physical volume (PV).",
            "PVs join a volume group (VG).",
            [
              "You carve logical volumes (LVs) out of the VG, and put ext4 or ",
              { a: "XFS", href: "/learn/glossary/xfs" },
              " on each.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            { a: "btrfs", href: "/learn/glossary/btrfs" },
            " does both jobs in one layer. It “can be created on top of single or multiple block devices”, and its device management “works on a mounted filesystem”.",
          ],
        },
        {
          kind: "table",
          columns: [
            { label: "", width: "18%" },
            { label: "ext4 on LVM", width: "27%" },
            { label: "XFS on LVM", width: "27%" },
            { label: "btrfs", width: "28%" },
          ],
          rows: [
            ["Shrink the filesystem", "Only while unmounted", "Not supported", "While mounted"],
            [
              "Take a disk out",
              [
                { code: "pvmove" },
                ", ",
                { code: "vgreduce" },
                ", ",
                { code: "pvremove" },
                ", while mounted",
              ],
              [
                { code: "pvmove" },
                ", ",
                { code: "vgreduce" },
                ", ",
                { code: "pvremove" },
                ", while mounted",
              ],
              [{ code: "btrfs device remove" }, ", while mounted"],
            ],
            [
              "Room for that disk’s data",
              "Free extents on the other PVs. To make more, shrink ext4 unmounted",
              "Free extents on the other PVs. XFS can’t shrink to make more",
              "Free space on the other devices, within the profile’s rules",
            ],
            [
              "Use a disk you made larger",
              [{ code: "pvresize" }, ", then ", { code: "lvextend --resizefs" }, ", while mounted"],
              [{ code: "pvresize" }, ", then ", { code: "lvextend --resizefs" }, ", while mounted"],
              [{ code: "btrfs filesystem resize <devid>:max" }, ", while mounted"],
            ],
            [
              "Add a disk",
              [
                { code: "pvcreate" },
                ", ",
                { code: "vgextend" },
                ", then ",
                { code: "lvextend --resizefs" },
              ],
              [
                { code: "pvcreate" },
                ", ",
                { code: "vgextend" },
                ", then ",
                { code: "lvextend --resizefs" },
              ],
              [{ code: "btrfs device add" }, ", while mounted"],
            ],
            [
              "Space between mounts",
              "LVs, each a fixed size",
              "LVs, each a fixed size",
              "Subvolumes that share the free space",
            ],
            [
              "Snapshots",
              "LVM thick (space set aside) or thin (from a thin pool)",
              "LVM thick (space set aside) or thin (from a thin pool)",
              "A subvolume that shares blocks with its source",
            ],
            [
              "Checksums",
              ["Metadata, with ", { code: "metadata_csum" }, " on"],
              "Metadata, with CRCs on",
              "Data and metadata",
            ],
          ],
        },
      ],
    },
    {
      id: "on-a-cloud-vm-you-pay-for",
      title: "Cloud disks can’t shrink",
      blocks: [
        {
          kind: "p",
          text: "Take an Azure VM whose data mount spans four 512\u00a0GiB managed disks: 2,048\u00a0GiB in all, holding 1,000\u00a0GiB. You pay for all 2,048\u00a0GiB.",
        },
        {
          kind: "p",
          text: [
            "Azure charges for managed disks “according to their provisioned size”, whatever they hold. The ",
            { a: "Azure disk pricing calculator", href: "/ebs-and-azure-disk-pricing" },
            " shows what the empty space costs.",
          ],
        },
        {
          kind: "p",
          text: "Neither cloud shrinks a disk. Microsoft Learn says shrinking an existing disk “isn’t supported and might result in data loss”. The Amazon Elastic Block Store (EBS) guide says “You can’t decrease the volume size”.",
        },
        { kind: "p", text: "So on a running VM, you reduce cost in three steps:" },
        {
          kind: "ol",
          items: [
            "Empty a whole disk.",
            "Take it out of the filesystem stack.",
            "Detach and delete it.",
          ],
        },
        {
          kind: "p",
          text: "The stack decides whether the first two steps can run while mounted.",
        },
      ],
    },
    {
      id: "btrfs-vs-lvm",
      title: "XFS vs ext4 on LVM",
      blocks: [
        {
          kind: "p",
          text: [
            "On LVM, ext4 and XFS take a disk out the same way. Red Hat’s guide says ",
            { code: "pvmove" },
            " can move data “while your system is active”. Then ",
            { code: "vgreduce" },
            " and ",
            { code: "pvremove" },
            " take it out of LVM.",
          ],
        },
        {
          kind: "p",
          text: [
            "Run these only on the disk you mean to delete. Before ",
            { code: "vgreduce" },
            ", check in ",
            { code: "pvs" },
            " that the disk’s PFree equals its PSize:",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "sudo pvs\nsudo pvmove /dev/<old-disk>\nsudo pvs\nsudo vgreduce <vg-name> /dev/<old-disk>\nsudo pvremove /dev/<old-disk>",
        },
        {
          kind: "p",
          text: "The catch: pvmove needs free extents on the other PVs for all of that disk’s data. When there aren’t enough, Red Hat’s procedure adds a new PV first.",
        },
        {
          kind: "p",
          text: [
            "LVM sees extents, not files. An LV you once grew with ",
            { code: "lvextend" },
            " to fill the VG holds every extent, even when its filesystem is mostly empty.",
          ],
        },
        {
          kind: "callout",
          label: "Worked example",
          text: [
            "Take disk 4 out of the four 512\u00a0GiB disks, and the three left hold 1,536\u00a0GiB. On btrfs with ",
            { code: "single" },
            " data (one copy), the 1,000\u00a0GiB fits with about 536\u00a0GiB spare, so you pay for 1,536\u00a0GiB, not 2,048. On LVM, one LV holds every extent, so pvmove finds 0\u00a0GiB free until the filesystem and the LV shrink.",
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: "To make room, the filesystem has to shrink first, then the LV. Red Hat warns that the filesystem must not be “using the space in the logical volume that is being reduced”. This is where ext4 and XFS differ.",
        },
        {
          kind: "p",
          text: [
            "To keep pvmove possible, leave free extents in the VG, and grow each LV with ",
            { code: "lvextend --resizefs" },
            " only as its data needs. ",
            { a: "Removing a disk from LVM", href: "/learn/remove-disk-from-lvm" },
            " covers both cases.",
          ],
        },
        {
          kind: "h3",
          id: "lvm-with-ext4-shrink-only-while-unmounted",
          title: "ext4 shrinks only unmounted",
        },
        {
          kind: "p",
          text: "The resize2fs man page says it can “enlarge or shrink an unmounted file system”. A mounted one can only grow.",
        },
        { kind: "p", text: "Red Hat’s shrink procedure has four steps:" },
        {
          kind: "ol",
          items: [
            "Unmount the LV.",
            ["Run ", { code: "e2fsck -f" }, "."],
            ["Run ", { code: "lvreduce --size <new-size> --resizefs" }, "."],
            "Mount it again.",
          ],
        },
        {
          kind: "p",
          text: [
            "Every service on that mount stops for the check and the resize. ",
            { a: "Shrinking ext4 with resize2fs", href: "/learn/resize2fs-shrink-ext4" },
            " has the steps and the minimum size.",
          ],
        },
        {
          kind: "h3",
          id: "lvm-with-xfs-only-a-copy-gives",
          title: "XFS can’t shrink",
        },
        {
          kind: "p",
          text: "Red Hat states that “XFS does not support reducing the size of a volume formatted with an XFS file system”. So the LV under it can’t give extents back without losing data.",
        },
        {
          kind: "p",
          text: [
            "The only route is a copy onto a new, smaller filesystem, with a stop at the switch. ",
            { a: "Shrinking an XFS filesystem", href: "/learn/shrink-xfs-filesystem" },
            " covers it.",
          ],
        },
      ],
    },
    {
      id: "btrfs-takes-a-disk-out-while-it",
      title: "Removing a disk in btrfs",
      blocks: [
        {
          kind: "p",
          text: "btrfs has no second layer to keep in step. Adding a device “is instant and does not affect existing data”. Removing one moves its data onto the other devices.",
        },
        {
          kind: "p",
          text: "The docs warn that a removal “can take long as it needs to move all data from the device”. It works only when two rules hold:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Space." },
              " The data must fit on the devices that stay, with ",
              { a: "unallocated space", href: "/learn/btrfs-unallocated-space" },
              " to spare.",
            ],
            [
              { b: "Profile." },
              " The docs say “Device removal must satisfy the profile constraints, otherwise the command fails”. A profile is how btrfs lays out data and metadata, such as single or RAID1. A two-device RAID1 filesystem can’t drop to one device until it’s converted to another profile. ",
              { a: "btrfs on multiple disks", href: "/learn/btrfs-multiple-disks" },
              " covers the profiles.",
            ],
          ],
        },
        {
          kind: "p",
          text: "Check the space first, and name only the disk you mean to delete:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "sudo btrfs filesystem usage <mount-point>\nsudo btrfs device remove /dev/<old-disk> <mount-point>\nsudo btrfs filesystem show <mount-point>",
        },
        {
          kind: "p",
          text: [
            "Check that ",
            { code: "btrfs filesystem show" },
            " no longer lists the device. Deleting a cloud disk is permanent, so confirm its name and resource ID before you detach and delete it.",
          ],
        },
        {
          kind: "p",
          text: [
            "Azure prorates disk charges hourly, so the charge ends when you delete the disk. ",
            { a: "btrfs device remove", href: "/learn/btrfs-device-remove" },
            " has the full steps.",
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "btrfs can shrink a single-disk filesystem while mounted, but the cloud disk under it still can’t shrink. Only btrfs across several smaller disks reduces what you pay.",
        },
        {
          kind: "h3",
          id: "btrfs-subvolumes-vs-lvm-logical-volumes",
          title: "Subvolumes vs logical volumes",
        },
        {
          kind: "p",
          text: [
            "LVM splits a VG into LVs, each a fixed size. Space one LV holds goes to another only after ",
            { code: "lvreduce" },
            " returns its extents to the VG.",
          ],
        },
        {
          kind: "p",
          text: "btrfs subvolumes share the whole filesystem’s free space instead. So a VM’s data mounts draw on one pool of free space, not one per LV.",
        },
        {
          kind: "callout",
          label: "For engineers",
          text: "A subvolume is “a part of filesystem with its own independent file/directory hierarchy and inode number namespace”. The docs contrast it with an LVM logical volume: LVM is block-level, while btrfs subvolumes are file extent-based.",
        },
        {
          kind: "p",
          text: [
            "A subvolume looks like a directory and mounts on its own with the ",
            { code: "subvol" },
            " or ",
            { code: "subvolid" },
            " option. Quota groups give it a capacity limit if you want one.",
          ],
        },
      ],
    },
    {
      id: "lvm-vs-btrfs-snapshots-and-why-lvm",
      title: "btrfs snapshots vs LVM",
      blocks: [
        { kind: "p", text: "LVM has two kinds of snapshot, and btrfs has one:" },
        {
          kind: "ul",
          items: [
            [
              { b: "LVM thick snapshot." },
              " It “requires you to allocate some amount of storage space upfront”. Red Hat warns: “If a snapshot reaches 100% of its allocated space, it will become invalid”.",
            ],
            [
              { b: "LVM thin snapshot." },
              " Made from a thin LV, it needs no space set aside. It shares data blocks with its origin until the origin changes.",
            ],
            [
              { b: "btrfs snapshot." },
              " It’s “a subvolume like any other, with given initial content”. It starts out sharing all its data blocks with the source, through copy-on-write.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "To take a btrfs snapshot, name the source subvolume and the new snapshot’s path. ",
            { code: "-r" },
            " makes it read-only:",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "sudo btrfs subvolume snapshot -r <mount-point>/<subvolume> <mount-point>/<snapshot>",
        },
        {
          kind: "p",
          text: "A snapshot isn’t recursive: a subvolume nested inside the source shows up in it empty.",
        },
        {
          kind: "p",
          text: [
            "LVM ",
            { a: "thin provisioning", href: "/learn/glossary/thin-provisioning" },
            " comes closest to btrfs subvolumes. “A thin pool allocates space on-demand to its LVs”, which can be “larger than the available physical space”.",
          ],
        },
        {
          kind: "p",
          text: "But the thin pool still sits on PVs, on managed disks or EBS volumes charged at their provisioned size. Taking a disk out from under it is still a pvmove that needs free extents.",
        },
        {
          kind: "p",
          text: "In a thin pool and in btrfs alike, a snapshot keeps the blocks it shares with its origin. Deleting files that were there when you took it frees no space while the snapshot exists.",
        },
      ],
    },
    {
      id: "zfs-vs-btrfs-and-lvm-can-a",
      title: "ZFS vs btrfs",
      blocks: [
        {
          kind: "p",
          text: "ZFS, like btrfs, is one layer. A ZFS storage pool is “a logical collection of devices that provide space for datasets”. LVM vs ZFS is the same split as LVM vs btrfs: an LVM logical volume still needs a filesystem on top.",
        },
        {
          kind: "p",
          text: [
            "A ZFS pool can shrink. ",
            { code: "zpool remove" },
            " takes out a mirrored or non-redundant top-level virtual device (vdev). It copies the vdev’s data onto the other devices in the background, and the pool’s total space goes down.",
          ],
        },
        {
          kind: "p",
          text: [
            "No top-level vdev can be removed if the pool has a raidz top-level vdev, or top-level vdevs with different sector sizes. A removal also leaves a mapping table that uses memory. ",
            { code: "btrfs device remove" },
            " has the two rules above instead: space and profile.",
          ],
        },
      ],
    },
    {
      id: "btrfs-or-lvm-which-to-choose-on",
      title: "Which to choose",
      blocks: [
        {
          kind: "p",
          text: "Of btrfs, ext4 and XFS, only btrfs across several disks gives a disk back with nothing unmounted, however large the data once grew.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "ul",
          items: [
            [{ b: "Data that grows and shrinks." }, " Use btrfs across several disks."],
            [
              { b: "Data that only grows, or a mount that can take a planned stop." },
              " ext4 on LVM suits it.",
            ],
            [
              { b: "XFS on LVM." },
              " It only grows. Size it for growth, and plan a copy if the data ever shrinks a lot.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Before you pick btrfs, check that your distribution’s kernel includes it and that the btrfs-progs tools are installed. Then check that you trust the profile you plan to use. ",
            { a: "How stable btrfs is", href: "/learn/is-btrfs-stable" },
            " covers that.",
          ],
        },
        {
          kind: "p",
          text: [
            "Moving an ext4 or XFS mount onto btrfs is a copy, with a short stop at the switch. It’s the same route as ",
            { a: "moving to a smaller Azure disk", href: "/learn/shrink-azure-managed-disk" },
            ".",
          ],
        },
      ],
    },
    {
      id: "how-amoeba-uses-a-btrfs-pool",
      title: "How Amoeba uses btrfs",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " is block storage optimization for Azure and AWS, on the btrfs side of this comparison. It works on the data disks of running Windows and Linux VMs, never the OS disk.",
          ],
        },
        {
          kind: "p",
          text: "It moves a VM’s data disks onto one btrfs pool sized to your data, with room to grow. Each data mount becomes a subvolume on the pool, mounted at its old path.",
        },
        {
          kind: "p",
          text: "The mounts can be ext4, XFS or another block-backed filesystem, on LVM or not. Every disk under them must be a cloud data disk.",
        },
        {
          kind: "p",
          text: "Amoeba copies the data while your services run. Then it switches each mount to the pool, with a short restart of the services that use it.",
        },
        {
          kind: "h3",
          id: "growing-and-shrinking-the-pool",
          title: "Growing and shrinking the pool",
        },
        {
          kind: "p",
          text: "Amoeba rightsizes the pool without any downtime, while it stays mounted:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Data grows." },
              " Amoeba grows the pool before it fills, and sooner when data arrives fast.",
            ],
            [
              { b: "Data shrinks." },
              " When your data goes down and stays down, Amoeba shrinks the pool one disk at a time. It moves that disk’s data onto the others with ",
              { code: "btrfs device remove" },
              ", then detaches the empty disk and deletes it.",
            ],
            [{ b: "The limit." }, " Amoeba never detaches a disk while the pool is nearly full."],
          ],
        },
        {
          kind: "p",
          text: [
            {
              a: "Azure managed disk cost optimization",
              href: "/azure-managed-disk-cost-optimization",
            },
            " and ",
            { a: "EBS cost optimization", href: "/ebs-cost-optimization" },
            " cover each cloud.",
          ],
        },
      ],
    },
  ],
  help: {
    product: "amoeba",
    text: "Amoeba moves a VM’s data disks onto one pool sized to your data, then rightsizes it autonomously, without any downtime, one disk at a time. We estimate it takes 50–60% off block storage cost. It is an estimated range, not a promise. The free assessment works out your own figure.",
    links: [
      { label: "Block storage optimization with Amoeba", href: "/amoeba" },
      { label: "Estimate your saving", href: "/assessment?p=amoeba" },
    ],
  },
  sources: [
    {
      publisher: "BTRFS documentation",
      title: "“Introduction”",
      url: "https://btrfs.readthedocs.io/en/latest/Introduction.html",
    },
    {
      publisher: "BTRFS documentation",
      title: "“btrfs-device(8)”",
      url: "https://btrfs.readthedocs.io/en/latest/btrfs-device.html",
    },
    {
      publisher: "BTRFS documentation",
      title: "“btrfs-filesystem(8)”",
      url: "https://btrfs.readthedocs.io/en/latest/btrfs-filesystem.html",
    },
    {
      publisher: "BTRFS documentation",
      title: "“btrfs-subvolume(8)”",
      url: "https://btrfs.readthedocs.io/en/latest/btrfs-subvolume.html",
    },
    {
      publisher: "BTRFS documentation",
      title: "“Subvolumes”",
      url: "https://btrfs.readthedocs.io/en/latest/Subvolumes.html",
    },
    {
      publisher: "Red Hat",
      title: "“Configuring and managing logical volumes”",
      url: "https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html-single/configuring_and_managing_logical_volumes/index",
      note: " (RHEL 9)",
    },
    {
      publisher: "man7.org",
      title: "“resize2fs(8)”",
      url: "https://man7.org/linux/man-pages/man8/resize2fs.8.html",
    },
    {
      publisher: "Linux kernel documentation",
      title: "“Checksums”",
      url: "https://docs.kernel.org/filesystems/ext4/checksums.html",
      note: " (ext4)",
    },
    {
      publisher: "Linux kernel documentation",
      title: "“XFS Self Describing Metadata”",
      url: "https://docs.kernel.org/filesystems/xfs/xfs-self-describing-metadata.html",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Expand virtual hard disks on a Linux VM”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/linux/expand-disks",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Select a disk type for Azure IaaS VMs”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-types",
    },
    {
      publisher: "AWS",
      title: "“Modify an Amazon EBS volume using Elastic Volumes operations”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-modify-volume.html",
    },
    {
      publisher: "Ubuntu manpages",
      title: "“zfsconcepts(7)”",
      url: "https://manpages.ubuntu.com/manpages/noble/man7/zfsconcepts.7.html",
      note: " (Ubuntu 24.04 LTS)",
    },
    {
      publisher: "Ubuntu manpages",
      title: "“zpool-remove(8)”",
      url: "https://manpages.ubuntu.com/manpages/noble/man8/zpool-remove.8.html",
      note: " (Ubuntu 24.04 LTS)",
    },
  ],
  related: [
    {
      title: "Can you shrink an Azure managed disk?",
      where: "Learn",
      href: "/learn/shrink-azure-managed-disk",
    },
    {
      title: "Remove a disk from LVM in Linux",
      where: "Learn",
      href: "/learn/remove-disk-from-lvm",
    },
    {
      title: "btrfs device remove",
      where: "Learn",
      href: "/learn/btrfs-device-remove",
    },
    {
      title: "How to shrink an EBS volume",
      where: "Learn",
      href: "/learn/shrink-ebs-volume",
    },
    {
      title: "btrfs on multiple disks: single or RAID 1",
      where: "Learn",
      href: "/learn/btrfs-multiple-disks",
    },
  ],
  relatedTitle: "More on LVM and btrfs",
};
