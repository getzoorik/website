import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/btrfs-multiple-disks/1";
import { figure as figure2 } from "@/features/learn/figures/btrfs-multiple-disks/2";

export const article: Article = {
  slug: "btrfs-multiple-disks",
  title: "btrfs on multiple disks: how a btrfs pool works",
  meta: "btrfs on multiple disks: create one filesystem across disks of different sizes, choose single or raid1, add a disk while mounted, grow one and read usage.",
  h1: "btrfs on multiple disks: how a btrfs pool works",
  deck: "One filesystem across several cloud disks: the profiles, adding or growing a disk while mounted, and the usage report.",
  card: "How one btrfs filesystem spans several disks, how to add a disk while it’s mounted, and how to read its usage.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Linux filesystems",
  published: "2026-10-27",
  updated: "2026-11-01",
  author: "sourabh",
  cover: "/learn-covers/zoorik-learn-btrfs-multiple-disks-1200x630.webp",
  coverAlt:
    "btrfs on multiple disks: single uses every disk in full, while raid1 leaves part of the larger disk unused",
  short: [
    "btrfs on multiple disks is one filesystem across several block devices, and ",
    { code: "btrfs device add" },
    " adds one while it’s mounted. The ",
    { code: "single" },
    " profile keeps one copy of each chunk and uses every disk in full, even at different sizes. ",
    { code: "raid1" },
    " keeps two copies on two different disks, so at most half the raw space is usable.",
  ],
  sections: [
    {
      id: "how-btrfs-spans-multiple-disks-one-chunk",
      title: "How btrfs spans multiple disks, one chunk at a time",
      blocks: [
        {
          kind: "p",
          text: [
            "Picture a VM with a btrfs filesystem on one 50\u00a0GiB data disk. You attach a 100\u00a0GiB disk and run ",
            { code: "btrfs device add" },
            ". Then one balance can convert the metadata, the filesystem’s record of its files, to ",
            { code: "raid1" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "Of the 150\u00a0GiB, roughly 144\u00a0GiB is then usable for ",
            { code: "single" },
            " data. Mirror the data with ",
            { code: "raid1" },
            ", and at most 50\u00a0GiB is.",
          ],
        },
        {
          kind: "p",
          text: "On a cloud VM, each btrfs device is usually a whole data disk: an Azure managed disk, or an Amazon Elastic Block Store (EBS) volume. Every device carries the filesystem’s UUID, which is how btrfs groups them. Where udev runs, each one is registered with the kernel as it appears, so naming any one disk mounts the whole set.",
        },
        {
          kind: "p",
          text: "btrfs allocates space in chunks, and each new chunk goes to the disks with the most unallocated space. Traditional RAID works across whole disks of equal size. btrfs applies its RAID rules inside each chunk instead, which is why one btrfs filesystem across multiple disks of different sizes works.",
        },
        {
          kind: "callout",
          label: "For engineers",
          text: [
            "Data chunks are typically 1\u00a0GiB, and metadata chunks 256\u00a0MiB, or 1\u00a0GiB once the filesystem passes 50\u00a0GiB. For each new chunk, the kernel puts disks with room for a full-size chunk first, then ranks by unallocated space, largest first. A ",
            { code: "single" },
            " chunk takes the first disk in that order, and a ",
            { code: "raid1" },
            " chunk the first two.",
          ],
        },
        {
          kind: "p",
          text: [
            "Subvolumes sit on top. Each is a directory tree you can mount on its own with the ",
            { code: "subvol=" },
            " option, and all share one pool of free space. That makes a btrfs storage pool useful on a VM: no mount runs out while free space sits on a disk that belongs to another.",
          ],
        },
      ],
    },
    {
      id: "the-profile-decides-how-much-of-each",
      title: "The profile decides how much of each disk you can use",
      blocks: [
        {
          kind: "p",
          text: "A profile sets how many copies btrfs keeps of each chunk and where it puts them. Data and metadata each get their own profile, written data/metadata: single/raid1 means one copy of your files and two of their metadata.",
        },
        {
          kind: "table",
          columns: [
            { label: "Profile", width: "19%" },
            { label: "Copies", width: "29%" },
            { label: "Usable share, equal disks", width: "15%" },
            { label: "Fewest disks", width: "22%" },
            { label: "Disks it can lose", width: "15%" },
          ],
          rows: [
            [[{ code: "single" }], "1", "100%", "1", "0"],
            [[{ code: "dup" }], "2, on one disk", "50%", "1", "0"],
            [[{ code: "raid0" }], "1, striped", "100%", "1 (kernel 5.15 or later)", "0"],
            [[{ code: "raid1" }], "2, on two disks", "50%", "2", "1"],
            [[{ code: "raid1c3" }], "3, on three disks", "33%", "3", "2"],
            [[{ code: "raid10" }], "2, striped", "50%", "2 (kernel 5.15 or later)", "1"],
          ],
        },
        {
          kind: "p",
          text: [
            "The parity profiles, ",
            { code: "raid5" },
            " and ",
            { code: "raid6" },
            ", are ",
            { a: "left out on purpose", href: "/learn/is-btrfs-stable" },
            ". The mkfs.btrfs manual warns that they have known problems and shouldn’t be used in production.",
          ],
        },
        {
          kind: "callout",
          label: "Worked example",
          text: [
            "In btrfs-device(8)’s example, ",
            { code: "raid1" },
            " metadata takes about 3\u00a0GiB on each disk, so ",
            { code: "single" },
            " data gets (50\u00a0−\u00a03)\u00a0+\u00a0(100\u00a0−\u00a03)\u00a0=\u00a0144\u00a0GiB, roughly. ",
            { code: "raid1" },
            " data needs every chunk on both disks, so it stops at 50\u00a0GiB at most, a third of the 150\u00a0GiB raw. The top 100\u00a0−\u00a050\u00a0=\u00a050\u00a0GiB of the larger disk stays unused.",
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "h3",
          id: "choosing-single-or-raid1-data-on-cloud",
          title: "Choosing single or raid1 data on cloud disks",
        },
        {
          kind: "p",
          text: [
            "An Azure locally redundant (LRS) managed disk is already written three times in one datacenter. AWS replicates each EBS volume within its Availability Zone. ",
            { code: "raid1" },
            " data adds a copy that btrfs controls, and takes two GiB of disk for every GiB of data.",
          ],
        },
        {
          kind: "p",
          text: [
            "Scrub reads all the data and checks its checksums. With ",
            { code: "raid1" },
            ", it can repair a bad block from the other copy. With ",
            { code: "single" },
            ", it finds the damage but has no copy to fix it from.",
          ],
        },
        {
          kind: "p",
          text: [
            "Keep metadata in ",
            { code: "raid1" },
            " either way, since it describes every file. For data, choose:",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: [{ code: "single" }, " data"] },
              " when the provider’s replication and your backups are your protection. You get every disk’s full size, and losing a disk loses the data on it.",
            ],
            [
              { b: [{ code: "raid1" }, " data"] },
              " when you want scrub to repair, or the filesystem to survive losing a whole disk, such as one detached by mistake. It then mounts with the ",
              { code: "degraded" },
              " option until you replace the disk.",
            ],
          ],
        },
      ],
    },
    {
      id: "create-one-btrfs-filesystem-on-several-disks",
      title: "mkfs.btrfs: create one btrfs filesystem on several disks",
      blocks: [
        {
          kind: "p",
          text: [
            "To make btrfs span multiple disks from the start, name every disk in one command. Check each one with ",
            { code: "lsblk" },
            " first, because mkfs.btrfs writes a new, empty filesystem over every device you name:",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "sudo mkfs.btrfs -L data -d single -m raid1 /dev/sdc /dev/sdd /dev/sde\nsudo mount /dev/sdc /data",
        },
        {
          kind: "p",
          text: "mkfs.btrfs picks profiles from the device count when you don’t name them:",
        },
        {
          kind: "ul",
          items: [
            ["On one device, metadata defaults to ", { code: "dup" }, "."],
            [
              "On several, data defaults to ",
              { code: "single" },
              " and metadata to ",
              { code: "raid1" },
              ".",
            ],
            ["Before btrfs-progs 5.8, the multi-device data default was ", { code: "raid0" }, "."],
          ],
        },
        {
          kind: "p",
          text: "The manual recommends naming both profiles. That keeps the result the same across versions.",
        },
      ],
    },
    {
      id: "btrfs-device-add-add-a-disk-to",
      title: "btrfs device add: add a disk to the pool without unmounting",
      blocks: [
        {
          kind: "p",
          text: [
            "You can add a device to the filesystem while it’s mounted. btrfs refuses a disk that already holds a filesystem. The ",
            { code: "-f" },
            " flag overrides that by overwriting whatever is on the disk, so use it only on a disk you’ve confirmed is the new one.",
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            "If the old disks are fully allocated, one new disk can’t take ",
            { code: "raid1" },
            " chunks alone. The metadata conversion in step 4 below can then fail. Add disks while the old ones still have room, or add two.",
          ],
        },
        {
          kind: "ol",
          items: [
            "Attach a new, empty data disk to the VM. An EBS volume has to be in the instance’s Availability Zone.",
            [
              "Find its device name with ",
              { code: "lsblk" },
              ", and check that it’s the empty disk you just attached.",
            ],
            "Add it to the pool, then list, disk by disk, what each profile has allocated there:",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "sudo btrfs device add /dev/sdf /data\nsudo btrfs device usage /data",
        },
        {
          kind: "ol",
          start: 4,
          items: [
            [
              "If the filesystem started on one disk, its metadata is still ",
              { code: "dup" },
              ", both copies on the same disk. Convert it to ",
              { code: "raid1" },
              " with a balance. The copies then sit on different disks, and the system chunks, which map addresses to places on the disks, follow the metadata:",
            ],
          ],
        },
        { kind: "code", lang: "bash", code: "sudo btrfs balance start -mconvert=raid1 /data" },
        {
          kind: "p",
          text: [
            "The manual says the add itself is instant. btrfs registers the disk and moves no existing data. First, where the disk supports it, btrfs discards (TRIMs) the whole disk, unless you pass ",
            { code: "-K" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "With ",
            { code: "single" },
            " data, the new space is usable at once. New chunks go to the disk with the most unallocated space. While that’s the new disk, the next chunks land there.",
          ],
        },
        {
          kind: "p",
          text: "A balance rewrites existing chunks, and the allocator places them as it places new ones, so old data spreads onto the new disk too. It’s a long job, because every chunk it moves is rewritten with its block pointers updated.",
        },
        { kind: "svg", figure: figure2 },
      ],
    },
    {
      id: "grow-one-disk-in-place-instead",
      title: "Grow one disk in place instead",
      blocks: [
        {
          kind: "p",
          text: [
            "Azure can ",
            {
              a: "expand a managed data disk without deallocating the VM",
              href: "/learn/azure-disk-expand-without-downtime",
            },
            ", with a size limit:",
          ],
        },
        {
          kind: "ul",
          items: [
            "A Standard HDD, Standard SSD or Premium SSD disk of 4\u00a0TiB or less can’t grow past 4\u00a0TiB that way. Deallocate the VM and detach the disk first.",
            "Premium SSD v2 and Ultra Disk have no such limit.",
          ],
        },
        {
          kind: "p",
          text: [
            "AWS changes an EBS volume’s size while it’s in use. Grow it ",
            {
              a: "in the EC2 console or with the AWS CLI",
              href: "/learn/increase-ebs-volume-size",
            },
            ", then continue at step 3.",
          ],
        },
        {
          kind: "ol",
          items: [
            "On Azure, grow the disk. Azure rounds the size up to the nearest managed disk size.",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "az disk update --resource-group <resource-group> --name <disk-name> --size-gb 256",
        },
        {
          kind: "ol",
          start: 2,
          items: [
            [
              "Rescan the device, because Linux doesn’t see the new size until you do. Replace ",
              { code: "sdf" },
              " with your disk’s name. Microsoft allows up to 10\u00a0minutes for a Premium SSD v2 or Ultra Disk to show it.",
            ],
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "echo 1 | sudo tee /sys/class/block/sdf/device/rescan",
        },
        { kind: "ol", start: 3, items: ["Find the devid of the disk you grew."] },
        { kind: "code", lang: "bash", code: "sudo btrfs filesystem show /data" },
        {
          kind: "ol",
          start: 4,
          items: [
            [
              "Grow that disk’s share to the whole device with ",
              { code: "resize <devid>:max" },
              ". Here sdf, the pool’s fourth disk, is devid 4. Without a devid, resize acts on devid 1, which may not be the disk you grew.",
            ],
          ],
        },
        { kind: "code", lang: "bash", code: "sudo btrfs filesystem resize 4:max /data" },
        {
          kind: "p",
          text: "resize doesn’t touch partitions. If the disk has one, grow the partition first.",
        },
        {
          kind: "p",
          text: [
            "Growing goes one way. Microsoft says shrinking an existing disk “isn’t supported and might result in data loss.” AWS can’t ",
            { a: "shrink an EBS volume", href: "/learn/shrink-ebs-volume" },
            " either.",
          ],
        },
        {
          kind: "p",
          text: [
            "A btrfs pool gets smaller a whole disk at a time instead. ",
            { a: { code: "btrfs device remove" }, href: "/learn/btrfs-device-remove" },
            " moves that disk’s data onto the others. It fails if the disks left can’t meet the profiles, as ",
            { code: "raid1" },
            " can’t on one disk.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Shrinking one Azure disk", href: "/learn/shrink-azure-managed-disk" },
            " covers a VM without a pool.",
          ],
        },
      ],
    },
    {
      id: "how-to-read-usage-across-a-btrfs",
      title: "How to read usage across a btrfs pool",
      blocks: [
        {
          kind: "p",
          text: [
            "Plain ",
            { a: { code: "df" }, href: "/learn/glossary/df-vs-du" },
            " gives one number for space that btrfs splits by profile. The btrfs(5) glossary says its results aren’t accurate.",
          ],
        },
        {
          kind: "p",
          text: [
            { code: "btrfs filesystem usage" },
            " shows the split. Its manual says it’s meant to replace ",
            { code: "btrfs filesystem df" },
            " in the long run. Run it as root, since a normal user doesn’t get the per-profile detail:",
          ],
        },
        { kind: "code", lang: "bash", code: "sudo btrfs filesystem usage /data" },
        { kind: "p", text: "The Overall section comes first:" },
        {
          kind: "table",
          columns: [
            { label: "Line", width: "21%" },
            { label: "What it counts", width: "79%" },
          ],
          rows: [
            ["Device size", "Raw capacity of every disk the filesystem can use, less the slack"],
            ["Device allocated", "Space given to data, metadata and system chunks, written or not"],
            ["Device unallocated", "Space in no chunk yet, which new chunks and a balance draw on"],
            [
              "Device slack",
              "Disk space the filesystem doesn’t use, such as a grown disk before you resize",
            ],
            ["Used", "Data and metadata actually stored"],
            ["Free (estimated)", "An estimate of the space still usable for data"],
            [
              "Data ratio, Metadata ratio",
              [
                "Raw space per byte stored: 1.0 for ",
                { code: "single" },
                ", 2.0 for ",
                { code: "raid1" },
              ],
            ],
            ["Multiple profiles", "Whether data or metadata uses more than one profile"],
          ],
        },
        {
          kind: "p",
          text: [
            "The Free (estimated) figure can differ from the Avail column of ",
            { code: "df" },
            ", because the two are worked out differently. The min beside it is the smallest the estimate can be when more than one profile is present.",
          ],
        },
        {
          kind: "p",
          text: [
            "Below the Overall section, root sees each profile with its size and how full it is, then the ",
            { a: "unallocated space", href: "/learn/btrfs-unallocated-space" },
            " on each disk.",
          ],
        },
        {
          kind: "p",
          text: "“Multiple profiles: yes” can mean a profile conversion was interrupted. btrfs(5) says to restart the same conversion balance, which carries on until every chunk has the new profile.",
        },
      ],
    },
    {
      id: "how-amoeba-builds-a-btrfs-pool-on",
      title: "How Amoeba builds a btrfs pool on Azure and AWS",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " optimizes block storage. It works on the data disks of running VMs: Azure managed disks and Amazon EBS volumes, on Windows and Linux VMs. It never touches the OS disk or root volume.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "The pool." },
              " Amoeba moves a VM’s data disks onto one btrfs pool, sized to your data, with room to grow. On Azure the pool uses Premium SSD v2 where your VM’s region and zone offer it, and Premium SSD otherwise. On AWS it uses ",
              { a: "gp3", href: "/learn/glossary/ebs-gp3" },
              ".",
            ],
            [
              { b: "The move." },
              " The services that use those mounts restart once, at the switch onto the pool.",
            ],
            [
              { b: "The old disks." },
              " Once the switch is checked, Amoeba snapshots each old disk and deletes the disk. It keeps the snapshot for 7 days, then deletes it too.",
            ],
            [
              { b: "Cost during the move." },
              " You pay for both sets of disks only while the move runs. Then you pay for the snapshots while they’re kept.",
            ],
            [
              { b: "Rightsizing." },
              " Amoeba grows the pool while it stays mounted, before it fills, and sooner when data arrives fast. When your data goes down and stays down, it shrinks the pool one disk at a time. So you pay for close to what you use.",
            ],
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
      publisher: "btrfs documentation",
      title: "“btrfs-device(8)”",
      url: "https://btrfs.readthedocs.io/en/latest/btrfs-device.html",
    },
    {
      publisher: "btrfs documentation",
      title: "“mkfs.btrfs(8)”",
      url: "https://btrfs.readthedocs.io/en/latest/mkfs.btrfs.html",
    },
    {
      publisher: "btrfs documentation",
      title: "“btrfs-filesystem(8)”",
      url: "https://btrfs.readthedocs.io/en/latest/btrfs-filesystem.html",
    },
    {
      publisher: "btrfs documentation",
      title: "“btrfs(5)”",
      url: "https://btrfs.readthedocs.io/en/latest/btrfs-man5.html",
    },
    {
      publisher: "Linux kernel source",
      title: "“fs/btrfs/volumes.c”",
      url: "https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/fs/btrfs/volumes.c",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Expand virtual hard disks on a Linux VM”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/linux/expand-disks",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Redundancy options for managed disks”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-redundancy",
    },
    {
      publisher: "AWS",
      title: "“Features and benefits of Amazon EBS volumes”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/EBSFeatures.html",
    },
  ],
  related: [
    {
      title: "Can you shrink an Azure managed disk?",
      where: "Learn",
      href: "/learn/shrink-azure-managed-disk",
    },
    {
      title: "btrfs device remove: take a disk out of a btrfs pool",
      where: "Learn",
      href: "/learn/btrfs-device-remove",
    },
    {
      title: "btrfs unallocated space vs free space, explained",
      where: "Learn",
      href: "/learn/btrfs-unallocated-space",
    },
    {
      title: "How to combine EBS volumes into one: LVM, RAID 0 or a btrfs pool",
      where: "Learn",
      href: "/learn/combine-ebs-volumes",
    },
    {
      title: "btrfs vs LVM: which one can shrink on a cloud VM?",
      where: "Learn",
      href: "/learn/btrfs-vs-lvm",
    },
  ],
};
