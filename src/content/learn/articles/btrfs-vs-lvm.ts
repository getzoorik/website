import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/btrfs-vs-lvm/1";
import { figure as figure2 } from "@/features/learn/figures/btrfs-vs-lvm/2";

export const article: Article = {
  slug: "btrfs-vs-lvm",
  title: "btrfs vs LVM with ext4 or XFS: which can shrink?",
  meta: "btrfs vs LVM on a cloud VM: both grow while mounted. What decides whether you can take a disk back out and stop paying for it, with ext4, XFS or btrfs.",
  h1: "btrfs vs LVM: which one can shrink on a cloud VM?",
  deck: "Both grow while mounted. What decides whether a disk can leave again, and why the filesystem matters more than LVM.",
  card: "LVM grows while mounted, but ext4 and XFS decide the shrink. btrfs takes a disk out while it stays mounted.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Linux filesystems",
  versus: ["btrfs", "LVM"],
  published: "2026-11-01",
  updated: "2026-11-01",
  author: "sourabh",
  cover: "/learn-covers/zoorik-learn-btrfs-vs-lvm-1200x630.webp",
  coverAlt: "btrfs vs LVM: btrfs frees a disk directly, while LVM must shrink the filesystem first",
  short:
    "In btrfs vs LVM, both can empty a disk while mounted, but only btrfs uses its own free space as room for that disk’s data. LVM’s pvmove needs free extents, and making them means shrinking the filesystem first: ext4 only while unmounted, XFS not in any useful way.",
  sections: [
    {
      id: "on-a-cloud-vm-you-pay-for",
      title: "On a cloud VM, you pay for fewer GiB only when a disk leaves",
      blocks: [
        {
          kind: "p",
          text: "Picture an Azure VM whose data mount spans four 512\u00a0GiB managed disks, 2,048\u00a0GiB in all, holding 1,000\u00a0GiB. You pay for all 2,048\u00a0GiB.",
        },
        {
          kind: "p",
          text: "btrfs can empty one disk and let it go while mounted. LVM, with all four disks in one logical volume, can’t until the filesystem and the logical volume shrink.",
        },
        {
          kind: "p",
          text: [
            "Azure charges for managed disks “according to their provisioned size”. Its example adds “regardless of the amount of data written to the disk”. The ",
            { a: "Azure disk pricing calculator", href: "/ebs-and-azure-disk-pricing" },
            " shows what that empty space costs.",
          ],
        },
        {
          kind: "p",
          text: "Neither cloud shrinks a disk in place. Microsoft Learn says shrinking an existing disk “isn’t supported and might result in data loss”. The Amazon Elastic Block Store (EBS) guide says “You can’t decrease the volume size”.",
        },
        { kind: "p", text: "So on a running VM, paying for fewer GiB takes three steps:" },
        {
          kind: "ol",
          items: ["Empty a whole disk.", "Take it out of the stack.", "Detach and delete it."],
        },
        { kind: "p", text: "The Logical Volume Manager (LVM) pools block devices in layers:" },
        {
          kind: "ul",
          items: [
            "Each disk becomes a physical volume (PV).",
            "PVs join a volume group (VG).",
            "You carve logical volumes (LVs) out of the VG.",
          ],
        },
        {
          kind: "p",
          text: "An LV is a block device, so it still needs a filesystem such as ext4 or XFS on top.",
        },
        {
          kind: "p",
          text: "A btrfs filesystem does both jobs in one. It “can be created on top of single or multiple block devices”. Its device management “works on a mounted filesystem”.",
        },
        {
          kind: "table",
          columns: [
            { label: "What you decide on", width: "16%" },
            { label: "LVM with ext4 or XFS", width: "42%" },
            { label: "btrfs", width: "42%" },
          ],
          rows: [
            [
              "Layers",
              "PVs, a VG and LVs, then a filesystem on each LV",
              "One filesystem across one or more devices",
            ],
            [
              "Use a cloud disk you made larger",
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
              [{ code: "btrfs device add" }, ", while mounted"],
            ],
            [
              "Empty a disk and take it out",
              [
                { code: "pvmove" },
                ", ",
                { code: "vgreduce" },
                ", ",
                { code: "pvremove" },
                ", while the disks are in use",
              ],
              [{ code: "btrfs device remove" }, ", while mounted"],
            ],
            [
              "Where the disk’s data goes",
              "Free extents on the other PVs",
              "Free space on the other devices, within the profile’s rules",
            ],
            [
              "Making that room",
              "Shrink an LV and its filesystem first: ext4 only unmounted, XFS can’t",
              "Nothing extra, unused space in the filesystem is the room",
            ],
            [
              "Splitting space between mounts",
              "LVs, each with its own fixed size",
              "Subvolumes, which share the filesystem’s free space",
            ],
            [
              "Snapshots",
              "Thick: space set aside up front. Thin: from a thin pool, no size",
              "A subvolume that starts out sharing its data blocks with the source",
            ],
          ],
        },
      ],
    },
    {
      id: "btrfs-vs-lvm",
      title: "btrfs vs ext4 and XFS on LVM: the filesystem decides the shrink",
      blocks: [
        {
          kind: "p",
          text: "Red Hat’s guide says “you can move data while your system is active using the pvmove command”. So emptying a PV while its filesystem stays mounted is routine.",
        },
        {
          kind: "p",
          text: [
            "These commands take a disk out of LVM, so run them only on the disk you mean to delete. Before ",
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
          text: "The catch: pvmove needs free extents on the other PVs for that disk’s data. Red Hat’s procedure adds a new PV first “If there are not enough free extents on the other physical volumes in the existing volume group”.",
        },
        {
          kind: "p",
          text: [
            "LVM sees extents, not files. Say you once ran ",
            { code: "lvextend" },
            " to give an LV the whole VG. Then every extent belongs to that LV, even when the filesystem inside it is mostly empty.",
          ],
        },
        { kind: "p", text: "Free space in the filesystem isn’t free space in the VG." },
        {
          kind: "callout",
          label: "Worked example",
          text: "Take the four 512\u00a0GiB disks and empty disk 4, which leaves three that hold 3 × 512 = 1,536\u00a0GiB.",
        },
        {
          kind: "p",
          text: [
            "On btrfs with ",
            { code: "single" },
            " data (one copy), the roughly 2,048 − 1,000 = 1,048\u00a0GiB free is the room. The 1,000\u00a0GiB fits on three disks with roughly 1,536 − 1,000 = 536\u00a0GiB to spare. With disk 4 deleted, you pay for 1,536\u00a0GiB of data disks instead of 2,048.",
          ],
        },
        {
          kind: "p",
          text: "On LVM, one LV holds every extent in the VG. So pvmove finds 0\u00a0GiB free until the filesystem and the LV shrink.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: "So making room means shrinking the LV, and an LV can only shrink after its filesystem does. Red Hat warns that the filesystem must not be “using the space in the logical volume that is being reduced”.",
        },
        {
          kind: "p",
          text: [
            "To keep pvmove possible, leave free extents in the VG and grow each LV with ",
            { code: "lvextend --resizefs" },
            " only as its data needs. That helps until the data shrinks, because the LV doesn’t shrink with it. ",
            { a: "Removing a disk from LVM", href: "/learn/remove-disk-from-lvm" },
            " walks through both cases.",
          ],
        },
        {
          kind: "h3",
          id: "lvm-with-ext4-shrink-only-while-unmounted",
          title: "LVM with ext4: shrink only while unmounted",
        },
        {
          kind: "p",
          text: "The resize2fs man page says it can “enlarge or shrink an unmounted file system”. On a mounted one, it can only expand.",
        },
        { kind: "p", text: "Red Hat’s shrink procedure follows from that:" },
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
            "Every service on that mount stops for the check and the resize. The steps and the minimum size are in ",
            { a: "shrinking ext4 with resize2fs", href: "/learn/resize2fs-shrink-ext4" },
            ".",
          ],
        },
        {
          kind: "h3",
          id: "lvm-with-xfs-only-a-copy-gives",
          title: "LVM with XFS: only a copy gives the space back",
        },
        {
          kind: "p",
          text: "Red Hat states that “XFS does not support reducing the size of a volume formatted with an XFS file system”. With XFS on the LV, no LVM command can free those extents without losing data.",
        },
        {
          kind: "p",
          text: [
            "The route is a copy onto a new, smaller filesystem, with a stop while you switch over. ",
            { a: "Shrinking an XFS filesystem", href: "/learn/shrink-xfs-filesystem" },
            " covers it.",
          ],
        },
      ],
    },
    {
      id: "btrfs-takes-a-disk-out-while-it",
      title: "btrfs takes a disk out while it stays mounted",
      blocks: [
        {
          kind: "p",
          text: "A btrfs filesystem has no second layer to keep in step. Adding a device “is instant and does not affect existing data”. Removing one moves its data onto the others.",
        },
        {
          kind: "p",
          text: "The docs warn “The operation can take long as it needs to move all data from the device”. Two rules decide whether a removal works:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Space." },
              " The data has to fit on the devices that stay, with ",
              { a: "unallocated space", href: "/learn/btrfs-unallocated-space" },
              " to spare.",
            ],
            [
              { b: "Profile." },
              " The docs say “Device removal must satisfy the profile constraints, otherwise the command fails”. A profile is btrfs’s allocation policy for data and metadata, such as single or RAID1. In the docs’ example, a RAID1 filesystem can’t drop to one device until it’s converted to another profile. The error reads “unable to go below two devices on raid1”. For the profiles, see ",
              { a: "btrfs on multiple disks", href: "/learn/btrfs-multiple-disks" },
              ".",
            ],
          ],
        },
        {
          kind: "p",
          text: "The removal moves every block off the device you name. So check the space first, and name only the disk you mean to delete:",
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
            " no longer lists the device. Deleting is permanent, so first confirm the cloud disk’s name and resource ID, then detach and delete it.",
          ],
        },
        {
          kind: "p",
          text: [
            "Charges end with the delete, because Azure prorates a disk hourly, whatever it holds. The full steps are in ",
            { a: "btrfs device remove", href: "/learn/btrfs-device-remove" },
            ".",
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "A btrfs filesystem on a single disk can shrink while mounted, but that doesn’t reduce what you pay.",
        },
        {
          kind: "p",
          text: "The docs say “The resize command does not manipulate the size of underlying partition”. Under it, the cloud disk can’t shrink at all. One btrfs filesystem across several smaller disks is the layout that pays.",
        },
        {
          kind: "h3",
          id: "btrfs-subvolumes-vs-lvm-logical-volumes",
          title: "btrfs subvolumes vs LVM logical volumes",
        },
        {
          kind: "p",
          text: [
            "LVM splits a VG into LVs, each a block device with its own size. Space one LV holds is free for another only after ",
            { code: "lvreduce" },
            ", when “the freed up logical extents are returned to the volume group”.",
          ],
        },
        {
          kind: "p",
          text: "btrfs subvolumes share the single storage pool of the whole filesystem instead. On a VM with several data mounts, they all draw on one pool of free space, not one per LV.",
        },
        {
          kind: "callout",
          label: "For engineers",
          text: "A btrfs subvolume is “a part of filesystem with its own independent file/directory hierarchy and inode number namespace”. The docs contrast the two: an LVM logical volume is block-level, while btrfs subvolumes are file extent-based.",
        },
        {
          kind: "p",
          text: [
            "A subvolume looks like a directory and mounts on its own with the ",
            { code: "subvol" },
            " or ",
            { code: "subvolid" },
            " option. Capacity limits come from quota groups if you want them.",
          ],
        },
      ],
    },
    {
      id: "lvm-vs-btrfs-snapshots-and-why-lvm",
      title: "LVM vs btrfs snapshots, and why LVM thin still needs free extents",
      blocks: [
        { kind: "p", text: "LVM has two kinds of snapshot, and btrfs has one:" },
        {
          kind: "ul",
          items: [
            [
              { b: "LVM thick snapshot." },
              " It “requires you to allocate some amount of storage space upfront”. Red Hat also warns “If a snapshot reaches 100% of its allocated space, it will become invalid”.",
            ],
            [
              { b: "LVM thin snapshot." },
              " Made from a thin LV, it needs nothing set aside and shares the same data blocks as its origin until the origin changes.",
            ],
            [
              { b: "btrfs snapshot." },
              " It’s “a subvolume like any other, with given initial content”. It starts out sharing all its data blocks with the original through copy-on-write.",
            ],
          ],
        },
        {
          kind: "p",
          text: "On LVM thin vs btrfs, thin provisioning comes close to what btrfs does with subvolumes. Its LVs can be “larger than the available physical storage”, and “A thin pool allocates space on-demand to its LVs”.",
        },
        {
          kind: "p",
          text: "What it doesn’t change is the cloud disk. The thin pool sits on PVs on managed disks or EBS volumes, charged at their provisioned size. Taking a disk out from under it is still a pvmove that needs free extents.",
        },
        {
          kind: "p",
          text: "In a thin pool and in btrfs alike, a snapshot goes on referencing the blocks it shares with its origin. So deleting files that were there when you took it doesn’t give their space back while the snapshot exists.",
        },
      ],
    },
    {
      id: "btrfs-or-lvm-which-to-choose-on",
      title: "btrfs or LVM: which to choose on a cloud VM",
      blocks: [
        {
          kind: "p",
          text: "Of the stacks here, only btrfs across several disks hands a disk back with nothing unmounted, however large the data once grew.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "ul",
          items: [
            [{ b: "Data whose size moves both ways." }, " Pick btrfs over several disks."],
            [
              { b: "Data that only grows, or a mount that can take a planned stop." },
              " LVM with ext4 suits it.",
            ],
            [
              { b: "LVM with XFS." },
              " It’s one-way. Size it for growth, and plan a copy if the data ever shrinks a lot.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Before you pick btrfs, check that your distribution ships it in its kernel, with the btrfs-progs tools. You must also trust the profile you plan to use, which ",
            { a: "how stable btrfs is", href: "/learn/is-btrfs-stable" },
            " goes through.",
          ],
        },
        {
          kind: "p",
          text: [
            "Moving an existing ext4 or XFS mount onto a new btrfs filesystem is a copy with a short stop at the switch. It’s the same route as ",
            { a: "moving to a smaller Azure disk", href: "/learn/shrink-azure-managed-disk" },
            ".",
          ],
        },
      ],
    },
    {
      id: "how-amoeba-uses-a-btrfs-pool",
      title: "How Amoeba uses a btrfs pool",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " optimizes block storage on Azure and AWS, on the btrfs side of this comparison. It works on the data disks of running Windows and Linux VMs, and never touches the OS disk.",
          ],
        },
        {
          kind: "p",
          text: "Amoeba moves a VM’s data disks onto one btrfs pool sized to your data, with room to grow. Each data mount becomes a subvolume on the pool, mounted at its old path. So applications read and write where they did.",
        },
        {
          kind: "p",
          text: "The mounts it moves can be ext4, XFS or another block-backed filesystem, on LVM or not. Every disk under them must be a cloud data disk.",
        },
        {
          kind: "p",
          text: "Getting there takes one copy, which Amoeba makes while your services run. Then it switches each mount to the pool, with a short restart of the services that use it.",
        },
        {
          kind: "h3",
          id: "growing-and-shrinking-the-pool",
          title: "Growing and shrinking the pool",
        },
        { kind: "p", text: "After the move, the pool changes size while it stays mounted:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Data grows." },
              " Amoeba grows the pool before it fills, and sooner when data arrives fast. It grows the pool’s disks or adds new ones, and the space goes in at once.",
            ],
            [
              { b: "Data shrinks." },
              " When your data goes down and stays down, Amoeba shrinks the pool one disk at a time. It moves that disk’s data onto the others with ",
              { code: "btrfs device remove" },
              ". Then it detaches the empty disk and deletes it, with no snapshot, so its charges stop.",
            ],
            [
              { b: "The limit." },
              " Amoeba never detaches a disk while the pool is nearly full, or while it’s growing the pool.",
            ],
          ],
        },
        {
          kind: "p",
          text: "On Linux, the VM needs a recent kernel with btrfs. Every service that keeps a data mount open must run under systemd, so Amoeba can stop it and start it again at the switch. The VM also needs a few free disk slots for the pool.",
        },
        {
          kind: "p",
          text: [
            "The pages on ",
            {
              a: "Azure managed disk cost optimization",
              href: "/azure-managed-disk-cost-optimization",
            },
            " and ",
            { a: "EBS cost optimization", href: "/ebs-cost-optimization" },
            " cover each cloud in full.",
          ],
        },
      ],
    },
  ],
  help: {
    product: "amoeba",
    text: "Amoeba moves a VM’s data disks onto one pool sized to your data, then rightsizes it autonomously, without any downtime after the one switch, one disk at a time. We estimate it takes 50–60% off block storage cost. It is an estimated range, not a promise. The free assessment works out your own figure.",
    links: [
      { label: "Block storage cost optimization with Amoeba", href: "/amoeba" },
      { label: "Estimate your saving", href: "/assessment?p=amoeba" },
    ],
  },
  sources: [
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
  ],
  related: [
    {
      title: "Can you shrink an Azure managed disk?",
      where: "Learn",
      href: "/learn/shrink-azure-managed-disk",
    },
    {
      title: "How to remove a disk from LVM without losing data",
      where: "Learn",
      href: "/learn/remove-disk-from-lvm",
    },
    {
      title: "btrfs device remove: take a disk out of a btrfs pool",
      where: "Learn",
      href: "/learn/btrfs-device-remove",
    },
    {
      title: "How to shrink an EBS volume when AWS only lets it grow",
      where: "Learn",
      href: "/learn/shrink-ebs-volume",
    },
    {
      title: "btrfs on multiple disks: how a btrfs pool works",
      where: "Learn",
      href: "/learn/btrfs-multiple-disks",
    },
  ],
};
