import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/btrfs-multiple-disks/1";
import { figure as figure2 } from "@/features/learn/figures/btrfs-multiple-disks/2";

export const article: Article = {
  slug: "btrfs-multiple-disks",
  title: "btrfs RAID 1 or single on multiple disks",
  meta: "btrfs RAID 1 or single on multiple disks: usable space, the mkfs.btrfs command, adding or growing a disk while mounted, and reading usage.",
  h1: "btrfs on multiple disks: single or RAID 1",
  deck: "Disks can differ in size. Add or grow one while the filesystem stays mounted.",
  card: "One btrfs filesystem across several disks: single or RAID 1, adding a disk while mounted, and reading usage.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Linux filesystems",
  published: "2026-10-27",
  updated: "2026-11-03",
  author: "sourabh",
  cover: "/learn-covers/zoorik-learn-btrfs-multiple-disks-1200x630.webp",
  coverAlt:
    "btrfs on multiple disks: single uses every disk in full, while raid1 leaves part of the larger disk unused",
  short: [
    "One btrfs filesystem can span several disks. The data profile decides how much space you get. ",
    { code: "single" },
    " keeps one copy of your data and uses every disk in full. ",
    { code: "raid1" },
    " keeps two copies on two different disks, so it survives losing one disk but gives at most half the raw space.",
  ],
  sections: [
    {
      id: "how-btrfs-spans-multiple-disks-one-chunk",
      title: "How btrfs spans disks",
      blocks: [
        {
          kind: "p",
          text: [
            "On a cloud VM, each ",
            { a: "btrfs", href: "/learn/glossary/btrfs" },
            " device is usually a whole data disk: an Azure managed disk or an Amazon Elastic Block Store (EBS) volume. Each disk must be registered with the kernel, which udev normally does as the disk appears. Then mounting any one disk mounts the whole filesystem.",
          ],
        },
        {
          kind: "p",
          text: "btrfs allocates space in chunks, and each new chunk goes to the disks with the most unallocated space. It applies its profile to each chunk, not to whole disks, so disks of different sizes work together.",
        },
        {
          kind: "callout",
          label: "For engineers",
          text: [
            "Data chunks are typically 1\u00a0GiB. Metadata chunks are 256\u00a0MiB, or 1\u00a0GiB once the disks total more than 50\u00a0GiB. For each new chunk, the kernel ranks disks with room for a full-size chunk first, then by unallocated space, largest first. A ",
            { code: "single" },
            " chunk takes the first disk, and a ",
            { code: "raid1" },
            " chunk the first two.",
          ],
        },
        {
          kind: "p",
          text: [
            "Subvolumes sit on top. Each is a directory tree you can mount on its own with the ",
            { code: "subvol=" },
            " option, and all of them share the filesystem’s free space. So no mount runs out while another still has room.",
          ],
        },
      ],
    },
    {
      id: "the-profile-decides-how-much-of-each",
      title: "Profiles and usable space",
      blocks: [
        {
          kind: "p",
          text: "A profile sets how many copies of each chunk btrfs keeps, and where. Data and metadata each get their own, written data/metadata. single/raid1 means one copy of your files and two of their metadata, btrfs’s record of them.",
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
            { code: "raid1" },
            " keeps exactly two copies, however many disks you add. ",
            { code: "raid1c3" },
            " keeps three. The parity profiles, ",
            { code: "raid5" },
            " and ",
            { code: "raid6" },
            ", are ",
            { a: "left out on purpose", href: "/learn/is-btrfs-stable" },
            ": the mkfs.btrfs manual says they have known problems and shouldn’t be used in production.",
          ],
        },
        {
          kind: "callout",
          label: "Worked example",
          text: [
            "In the btrfs-device(8) example, one filesystem spans a 50\u00a0GiB disk and a 100\u00a0GiB disk. ",
            { code: "raid1" },
            " metadata takes about 3\u00a0GiB on each, so ",
            { code: "single" },
            " data gets roughly (50\u00a0−\u00a03)\u00a0+\u00a0(100\u00a0−\u00a03)\u00a0=\u00a0144\u00a0GiB. ",
            { code: "raid1" },
            " data needs every chunk on both disks, so it gets at most 50\u00a0GiB, a third of the 150\u00a0GiB raw. The top 50\u00a0GiB of the larger disk stays unused.",
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "h3",
          id: "choosing-single-or-raid1-data-on-cloud",
          title: "RAID 1 or single on cloud disks",
        },
        {
          kind: "p",
          text: [
            "An Azure locally redundant (LRS) managed disk is already written three times in one datacenter. AWS replicates each EBS volume within its Availability Zone. ",
            { code: "raid1" },
            " data adds a copy that btrfs controls, at two GiB of disk for every GiB of data.",
          ],
        },
        {
          kind: "p",
          text: [
            "Scrub reads all data and metadata and checks their checksums. With ",
            { code: "raid1" },
            ", it repairs a bad block from the good copy. With ",
            { code: "single" },
            ", it finds the damage but can’t fix it.",
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
              " when the provider’s replication and your backups are your protection. You get every disk’s full size, but losing a disk loses the data on it.",
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
      title: "mkfs.btrfs on several disks",
      blocks: [
        {
          kind: "p",
          text: [
            "Name every disk in one command. mkfs.btrfs writes a new, empty filesystem over every device you name, so check each one with ",
            { code: "lsblk" },
            " first:",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "sudo mkfs.btrfs -L data -d single -m raid1 /dev/sdc /dev/sdd /dev/sde\nsudo mount /dev/sdc /data",
        },
        {
          kind: "p",
          text: [
            "For btrfs RAID 1 data, use ",
            { code: "-d raid1" },
            " instead. Without ",
            { code: "-d" },
            " and ",
            { code: "-m" },
            ", mkfs.btrfs picks profiles from the device count:",
          ],
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
          text: "The manual recommends always setting both, to avoid unexpected results.",
        },
      ],
    },
    {
      id: "btrfs-device-add-add-a-disk-to",
      title: "Add a disk while mounted",
      blocks: [
        {
          kind: "p",
          text: [
            { code: "btrfs device add" },
            " works while the filesystem is mounted. It refuses a disk that already holds a filesystem. The ",
            { code: "-f" },
            " flag overrides that by overwriting the disk, so use it only on a disk you’ve confirmed is the new one.",
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            "If the old disks are fully allocated, one new disk can’t take ",
            { code: "raid1" },
            " chunks alone, and the conversion in step 4 can fail. Add disks while the old ones still have room, or add two.",
          ],
        },
        {
          kind: "ol",
          items: [
            "Attach a new, empty data disk to the VM. An EBS volume must be in the instance’s Availability Zone.",
            [
              "Find its device name with ",
              { code: "lsblk" },
              ", and check that it’s the empty disk you just attached.",
            ],
            "Add it, then list what each profile has allocated on each disk:",
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
              ", both copies on that disk. Convert it to ",
              { code: "raid1" },
              " so the copies sit on different disks. The system chunks, which map addresses to places on the disks, convert with it:",
            ],
          ],
        },
        { kind: "code", lang: "bash", code: "sudo btrfs balance start -mconvert=raid1 /data" },
        {
          kind: "p",
          text: [
            "To mirror the data too, add ",
            { code: "-dconvert=raid1" },
            " to the same command.",
          ],
        },
        {
          kind: "p",
          text: [
            "The add itself is instant: btrfs registers the disk and moves no existing data. It first discards (TRIMs) the whole disk where the disk supports it, unless you pass ",
            { code: "-K" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "With ",
            { code: "single" },
            " data, the new space is usable at once, and new chunks land on the new disk while it has the most unallocated space. A balance places rewritten chunks the same way, so old data spreads onto it too. It’s a long job, because every chunk it moves is rewritten and its block pointers updated.",
          ],
        },
        { kind: "svg", figure: figure2 },
      ],
    },
    {
      id: "grow-one-disk-in-place-instead",
      title: "Grow a disk instead",
      blocks: [
        {
          kind: "p",
          text: [
            "Azure can ",
            {
              a: "expand a managed data disk without deallocating the VM",
              href: "/learn/azure-disk-expand-without-downtime",
            },
            ", with one limit:",
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
            ", then go to step 3.",
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
              " with your disk’s name. On Premium SSD v2 and Ultra Disk, Microsoft allows up to 10\u00a0minutes for the new size to show.",
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
              ". Here sdf, the pool’s fourth disk, is devid 4. Without a devid, resize acts on devid 1, which may be another disk.",
            ],
          ],
        },
        { kind: "code", lang: "bash", code: "sudo btrfs filesystem resize 4:max /data" },
        {
          kind: "p",
          text: "resize doesn’t change partitions. If the disk has one, grow the partition first.",
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
            "A btrfs pool shrinks a whole disk at a time instead. ",
            { a: { code: "btrfs device remove" }, href: "/learn/btrfs-device-remove" },
            " moves that disk’s data onto the others. It fails if the disks left can’t meet the profiles, as ",
            { code: "raid1" },
            " can’t on one disk. For a VM without a pool, see ",
            { a: "shrinking an Azure managed disk", href: "/learn/shrink-azure-managed-disk" },
            ".",
          ],
        },
      ],
    },
    {
      id: "how-to-read-usage-across-a-btrfs",
      title: "Read usage across disks",
      blocks: [
        {
          kind: "p",
          text: [
            "Plain ",
            { a: { code: "df" }, href: "/learn/glossary/df-vs-du" },
            " gives one number for space that btrfs splits by profile, and btrfs(5) says it isn’t accurate. ",
            { code: "btrfs filesystem usage" },
            " shows the split, and is set to replace ",
            { code: "btrfs filesystem df" },
            ". Run it as root, since a normal user gets less detail:",
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
            ["Free (statfs, df)", "The free space df reports, which can differ from the estimate"],
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
            "The min beside Free (estimated) is the least it can be when more than one profile is present. Below Overall, root sees each profile’s size and use, then the ",
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
      title: "Where Amoeba fits",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " rightsizes block storage on Azure and AWS without any downtime. It works on the data disks of running VMs: Azure managed disks and Amazon EBS volumes, on Windows and Linux VMs. It never touches the OS disk or root volume.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "The pool." },
              " Amoeba moves a VM’s data disks onto one btrfs pool, sized to your data with room to grow. On Azure the pool uses Premium SSD v2 where your VM’s region and zone offer it, and Premium SSD otherwise. On AWS it uses ",
              { a: "gp3", href: "/learn/glossary/ebs-gp3" },
              ".",
            ],
            [
              { b: "The move." },
              " Amoeba copies your data while your services run. Then it switches each mount to the pool, with a short restart of the services that use it. If the switch fails, it puts the original mounts back and tries again.",
            ],
            [
              { b: "The old disks." },
              " Once the switch is checked, Amoeba snapshots each old disk and deletes it. It keeps each snapshot for 7\u00a0days, then deletes that too.",
            ],
            [
              { b: "Cost during the move." },
              " You pay for both sets of disks only while the move runs, then for the snapshots while they’re kept.",
            ],
            [
              { b: "Rightsizing." },
              " Amoeba grows the pool while it stays mounted, before it fills, and sooner when data arrives fast. When your data goes down and stays down, it shrinks the pool one disk at a time. So you pay for close to what you use.",
            ],
            [
              { b: "What the VM needs." },
              " A few free disk slots for the pool. On Linux, a recent kernel with btrfs, and systemd running every service that keeps a data mount open.",
            ],
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
      title: "“btrfs-balance(8)”",
      url: "https://btrfs.readthedocs.io/en/latest/btrfs-balance.html",
    },
    {
      publisher: "btrfs documentation",
      title: "“btrfs-scrub(8)”",
      url: "https://btrfs.readthedocs.io/en/latest/btrfs-scrub.html",
    },
    {
      publisher: "btrfs documentation",
      title: "“btrfs-subvolume(8)”",
      url: "https://btrfs.readthedocs.io/en/latest/btrfs-subvolume.html",
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
      publisher: "Linux kernel source",
      title: "“fs/btrfs/space-info.c”",
      url: "https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/fs/btrfs/space-info.c",
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
      title: "btrfs device remove",
      where: "Learn",
      href: "/learn/btrfs-device-remove",
    },
    {
      title: "btrfs unallocated vs free space",
      where: "Learn",
      href: "/learn/btrfs-unallocated-space",
    },
    {
      title: "How to combine EBS volumes",
      where: "Learn",
      href: "/learn/combine-ebs-volumes",
    },
    {
      title: "btrfs vs ext4 vs XFS: which can shrink?",
      where: "Learn",
      href: "/learn/btrfs-vs-lvm",
    },
  ],
  relatedTitle: "More on btrfs pools and cloud disks",
};
