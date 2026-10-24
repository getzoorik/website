import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/btrfs-multiple-disks/1";

export const article: Article = {
  slug: "btrfs-multiple-disks",
  title: "btrfs on multiple disks: how a btrfs pool works",
  meta: "btrfs on multiple disks: how the single and raid1 profiles use disks of different sizes, how btrfs device add grows a mounted pool, and how to read its usage.",
  h1: "btrfs on multiple disks: how a btrfs pool works",
  deck: "One filesystem across several cloud disks: the profiles, adding or growing a disk while mounted, and the usage report.",
  card: "How one btrfs filesystem spans several disks, how to add a disk while it’s mounted, and how to read its usage.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Linux filesystems",
  published: "2026-10-27",
  updated: "2026-10-27",
  author: "sourabh",
  short: [
    "btrfs on multiple disks is one filesystem spread across several block devices, and ",
    { code: "btrfs device add" },
    " adds another disk while it stays mounted. btrfs hands out space in chunks, and a profile sets the number of copies of each. ",
    { code: "single" },
    " keeps one copy and uses every disk at its full size, even when the sizes differ. ",
    { code: "raid1" },
    " puts two copies on two different disks, so at most half the raw space is usable.",
  ],
  sections: [
    {
      id: "how-btrfs-spans-multiple-disks",
      title: "How btrfs spans multiple disks",
      blocks: [
        {
          kind: "p",
          text: "A btrfs filesystem can sit on one block device or several, and you can add, remove or replace devices later. On a cloud VM each device is usually a whole data disk: an Azure managed disk, or an Amazon Elastic Block Store (EBS) volume. Every device carries the filesystem’s UUID, which is how btrfs groups them. On a system with udev, each one is registered with the kernel as it appears, so you can mount the whole set by naming any one disk.",
        },
        {
          kind: "p",
          text: [
            "btrfs doesn’t give each disk a fixed slice of your files. It allocates space in chunks, typically 1\u00a0GiB for data, and 256\u00a0MiB or 1\u00a0GiB for metadata, depending on whether the filesystem is under or over 50\u00a0GiB. For each new chunk, the kernel ranks the disks: those with room for a full-size chunk come first, ordered by unallocated space, largest first. A ",
            { code: "single" },
            " chunk goes on the top disk, a ",
            { code: "raid1" },
            " chunk on the top two. Traditional RAID works across whole disks of equal size. btrfs applies its RAID rules inside each block group, its unit of allocation, which is why one btrfs filesystem across multiple disks of different sizes works.",
          ],
        },
        {
          kind: "p",
          text: [
            "Subvolumes sit on top. Each is a directory tree you can mount like a filesystem of its own, with the ",
            { code: "subvol=" },
            " option, and all of them share the same pool of free space. That shared space is what makes a btrfs storage pool useful on a VM: no mount runs out while free space sits on a disk that belongs to another.",
          ],
        },
      ],
    },
    {
      id: "data-and-metadata-profiles-single-raid1-and",
      title: "Data and metadata profiles: single, raid1 and the rest",
      blocks: [
        {
          kind: "p",
          text: "A profile sets how many copies btrfs keeps of each chunk and where it puts them. Data and metadata each get one, written data/metadata, so single/raid1 means one copy of your files and two of the filesystem’s own trees.",
        },
        {
          kind: "table",
          columns: [
            { label: "Profile", width: "16%" },
            { label: "Copies", width: "37%" },
            { label: "Usable share of raw space", width: "14%" },
            { label: "Fewest disks", width: "19%" },
            { label: "Disks it can lose", width: "14%" },
          ],
          rows: [
            [[{ code: "single" }], "1", "100%", "1", "0"],
            [[{ code: "dup" }], "2, on one disk", "50%", "1", "0"],
            [
              [{ code: "raid0" }],
              "1, striped across disks",
              "100%",
              "1 (kernel 5.15 or later)",
              "0",
            ],
            [[{ code: "raid1" }], "2, on two different disks", "50%", "2", "1"],
            [[{ code: "raid1c3" }], "3, on three different disks", "33%", "3", "2"],
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
          kind: "p",
          text: [
            "Disk sizes count differently under each profile. The btrfs documentation works through two disks of 50\u00a0GiB and 100\u00a0GiB. With data and metadata both in ",
            { code: "raid1" },
            ", every chunk needs a copy on each disk, so usable space stops at 50\u00a0GiB at most and the top 50\u00a0GiB of the larger disk stays unused. Put data in ",
            { code: "single" },
            " and keep metadata in ",
            { code: "raid1" },
            ", and usable space comes to roughly 144\u00a0GiB, once metadata has taken about 3\u00a0GiB on each disk.",
          ],
        },
        { kind: "diagram", figure: figure1 },
        {
          kind: "p",
          text: [
            "If you don’t name the profiles, mkfs.btrfs picks them from the device count. On several devices, data defaults to ",
            { code: "single" },
            " (since btrfs-progs 5.8, and ",
            { code: "raid0" },
            " before that) and metadata to ",
            { code: "raid1" },
            ". On one device, metadata defaults to ",
            { code: "dup" },
            ". The manual recommends choosing specific profiles, which also keeps the result the same across versions. To make btrfs span multiple disks from the start, list them all. mkfs.btrfs writes a new, empty filesystem over every device you name, so check each one with ",
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
            "An Azure locally redundant (LRS) managed disk is already written three times within one datacenter, and AWS replicates each EBS volume within its Availability Zone. ",
            { code: "raid1" },
            " data adds a copy that btrfs itself controls. Scrub, which reads everything and verifies its checksums, can then repair a bad block, where with ",
            { code: "single" },
            " it finds the damage and has no copy to fix it from. With ",
            { code: "raid1" },
            " metadata too, the filesystem survives losing a whole disk, such as one detached by mistake, and mounts with the ",
            { code: "degraded" },
            " option until you replace it. That costs a second GiB of disk for every GiB of data. If the provider’s replication and your backups are your protection, ",
            { code: "single" },
            " data gives you the full size of every disk you attach. Keep metadata in ",
            { code: "raid1" },
            " either way, since it holds the trees that describe every file.",
          ],
        },
      ],
    },
    {
      id: "btrfs-device-add-add-a-disk-to",
      title: "btrfs device add: add a disk to the pool without unmounting",
      blocks: [
        { kind: "p", text: "Adding a device to the filesystem works while it’s mounted:" },
        {
          kind: "ol",
          items: [
            "Attach a new, empty data disk to the VM. An EBS volume has to be in the instance’s Availability Zone.",
            [
              "Find its device name with ",
              { code: "lsblk" },
              ", and check that it’s the empty disk you just attached.",
            ],
            "Add it to the pool and look at the result.",
          ],
        },
        {
          kind: "p",
          text: [
            "btrfs refuses a disk that already holds a filesystem. The ",
            { code: "-f" },
            " flag overrides that and overwrites whatever is on the disk, so use it only on a disk you’ve confirmed is the new one.",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "sudo btrfs device add /dev/sdf /data\nsudo btrfs device usage /data",
        },
        {
          kind: "p",
          text: [
            "The manual says the add is instant. btrfs registers the disk in the filesystem’s structures and moves no existing data, after first discarding (TRIM) the whole disk where the disk supports it, unless you pass ",
            { code: "-K" },
            ". With ",
            { code: "single" },
            " data the new space is usable at once. New chunks go to the top-ranked disk, so while the new disk has the most room, the next ones land there.",
          ],
        },
        {
          kind: "p",
          text: "A balance rewrites existing chunks, and the allocator places them as it places new ones, so old data spreads onto the new disk too. That is a long job: every chunk it moves is rewritten with its block pointers updated, and the balance needs unallocated space to work in.",
        },
        {
          kind: "p",
          text: [
            { code: "raid1" },
            " needs more planning, because each ",
            { code: "raid1" },
            " chunk takes space on two disks at once. Once the old disks have no unallocated space left, one new disk can’t take ",
            { code: "raid1" },
            " chunks by itself, so add disks while the old ones still have room, or add two.",
          ],
        },
        {
          kind: "p",
          text: [
            "A filesystem you created on one disk keeps its ",
            { code: "dup" },
            " metadata after you add a second. Convert it so the two copies sit on different disks, and the system chunks follow the metadata to ",
            { code: "raid1" },
            ":",
          ],
        },
        { kind: "code", lang: "bash", code: "sudo btrfs balance start -mconvert=raid1 /data" },
      ],
    },
    {
      id: "grow-one-disk-in-place-instead",
      title: "Grow one disk in place instead",
      blocks: [
        {
          kind: "p",
          text: [
            "The other way to add space is to make one disk bigger. Azure can ",
            {
              a: "expand a managed data disk without deallocating the VM",
              href: "/learn/azure-disk-expand-without-downtime",
            },
            ", with a size limit: a Standard HDD, Standard SSD or Premium SSD disk of 4\u00a0TiB or less needs the VM deallocated and the disk detached to grow past 4\u00a0TiB. That limit doesn’t apply to Premium SSD v2 or Ultra Disk. AWS changes an EBS volume’s size while it’s in use, as in ",
            { a: "increasing an EBS volume", href: "/learn/increase-ebs-volume-size" },
            ".",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "az disk update --resource-group <resource-group> --name <disk-name> --size-gb 256\necho 1 | sudo tee /sys/class/block/sdf/device/rescan\nsudo btrfs filesystem show /data\nsudo btrfs filesystem resize 4:max /data",
        },
        {
          kind: "p",
          text: [
            "Azure rounds the size up to the nearest managed disk size, and Linux doesn’t see it until the device is rescanned. Replace ",
            { code: "sdf" },
            " with your disk’s name. Microsoft allows up to 10\u00a0minutes for a Premium SSD v2 or Ultra Disk to show its new size. ",
            { code: "btrfs filesystem show" },
            " lists each disk’s devid, and ",
            { code: "resize <devid>:max" },
            " grows that disk’s share to the whole device. Without a devid, resize acts on devid 1, which may not be the disk you grew. Until you run it, the extra space shows as Device slack. If the disk carries a partition, grow the partition first, since resize doesn’t touch partitions.",
          ],
        },
        {
          kind: "p",
          text: [
            "Growing goes one way. Microsoft says shrinking an existing disk “isn’t supported and might result in data loss,” and ",
            { a: "shrinking an EBS volume", href: "/learn/shrink-ebs-volume" },
            " covers AWS. A btrfs pool gets smaller a whole disk at a time instead. ",
            { code: "btrfs device remove" },
            " moves that disk’s data onto the others, and fails if the disks left can’t meet the profiles, as ",
            { code: "raid1" },
            " can’t on one disk. ",
            { a: "btrfs device remove", href: "/learn/btrfs-device-remove" },
            " walks through the checks, and the guide to ",
            { a: "shrinking one Azure disk", href: "/learn/shrink-azure-managed-disk" },
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
            { code: "df" },
            " gives one number for space that btrfs splits by profile, and the btrfs(5) glossary says it doesn’t give accurate results. ",
            { code: "btrfs filesystem usage" },
            " shows the split, and its manual says it’s meant to replace ",
            { code: "btrfs filesystem df" },
            " in the long run. Run it as root, because a normal user doesn’t get the per-profile detail:",
          ],
        },
        { kind: "code", lang: "bash", code: "sudo btrfs filesystem usage /data" },
        { kind: "p", text: "The Overall section comes first:" },
        {
          kind: "table",
          columns: [
            { label: "Line", width: "16%" },
            { label: "What it counts", width: "84%" },
          ],
          rows: [
            [
              "Device size",
              "Raw capacity of all the disks that the filesystem can use, without the slack",
            ],
            [
              "Device allocated",
              "Space already given to data, metadata and system chunks, including space reserved in them but not yet written",
            ],
            [
              "Device unallocated",
              "Space in no chunk yet, which new chunks, a balance or a profile change draw on",
            ],
            [
              "Device slack",
              "Disk space the filesystem doesn’t use, such as a grown disk before you resize",
            ],
            ["Used", "Data and metadata actually stored"],
            [
              "Free (estimated)",
              "An approximate figure for the space still usable for data. The min beside it is the smallest the estimate can be when more than one profile is present",
            ],
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
            "Below it, root sees each profile with its size and how full it is, then the unallocated space on each disk. ",
            { code: "btrfs device usage /data" },
            " lists, disk by disk, what each profile has allocated there.",
          ],
        },
        {
          kind: "p",
          text: [
            "“Multiple profiles: yes” can mean a profile conversion was interrupted, and the btrfs(5) manual’s answer is to restart the same conversion balance, which carries on until every block group has the new profile. Free (estimated) can also differ from the Avail column of ",
            { code: "df" },
            ", because the two are worked out differently, for example when two profiles are present. ",
            { a: "btrfs unallocated space vs free space", href: "/learn/btrfs-unallocated-space" },
            " explains how the three kinds of space relate.",
          ],
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
            " optimizes block storage on Azure managed disks and Amazon EBS, and the pool it builds is this kind of filesystem. It moves a VM’s data mounts onto one btrfs pool, then rightsizes the pool as the data grows and shrinks.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "The pool." },
              " One btrfs filesystem per VM, starting with at least 2\u00a0disks of equal size: gp3\u00a0volumes in the instance’s Availability Zone on AWS, and Premium SSD v2 on Azure where the region and zone offer it, Premium SSD otherwise. Amoeba sizes it from the highest use of the last 7\u00a0days, to sit inside its target band, 80% to 90% full by default, with at least 10\u00a0GiB free. Each data mount becomes a subvolume at its old path.",
            ],
            [
              { b: "The switch." },
              " The agent copies each data mount onto the pool with rsync while services run. At the switch it stops the systemd services that hold those mounts, checks that a final rsync pass has nothing left to copy, mounts the subvolumes and starts the services again. That restart is the service interruption. If the switch fails, the agent restores the original mounts and Amoeba tries again, so services can restart more than once.",
            ],
            [
              { b: "Adding space." },
              " Amoeba expands while the pool stays mounted: when its lowest use over the last 30\u00a0minutes is above the band’s top edge, or when free space falls below 5% of the pool or 10\u00a0GiB, whichever is larger, or would fall below that within 30\u00a0minutes at the last 10\u00a0minutes’ fill rate. On AWS it grows gp3\u00a0volumes in place first, then adds new ones. On Azure a normal expand grows disks first, and an urgent one adds a disk first.",
            ],
            [
              { b: "Giving space back." },
              " One disk at a time, the agent moves that disk’s data onto the others with ",
              { code: "btrfs device remove" },
              ". Amoeba then detaches and deletes the empty disk, which stops its billing. It never does this while the pool is at or above the band’s top edge, or during an urgent expand.",
            ],
          ],
        },
        {
          kind: "p",
          text: "Amoeba works on Windows and Linux VMs. On Linux, it needs systemd, kernel 5.14 or later, and btrfs loaded or loadable. The VM needs 3 free data-disk slots: 2 for the pool and 1 kept free for an urgent expand. VMs in the Red Hat family are not moved.",
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
      title: "Can you shrink an Azure managed disk?",
      where: "Learn",
      href: "/learn/shrink-azure-managed-disk",
    },
    {
      title: "btrfs vs LVM: which one can shrink on a cloud VM?",
      where: "Learn",
      href: "/learn/btrfs-vs-lvm",
    },
  ],
};
