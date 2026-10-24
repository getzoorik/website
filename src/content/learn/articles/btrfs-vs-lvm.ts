import type { Article } from "@/content/learn/article";

export const article: Article = {
  slug: "btrfs-vs-lvm",
  title: "btrfs vs LVM: which one can shrink on a cloud VM?",
  meta: "btrfs vs LVM on a cloud VM: both grow while mounted. What decides whether you can take a disk back out and stop paying for it, with ext4, XFS or btrfs.",
  h1: "btrfs vs LVM: which one can shrink on a cloud VM?",
  deck: "Both grow while mounted. What decides whether a disk can leave again, and why the filesystem matters more than LVM.",
  card: "LVM grows while mounted, but ext4 and XFS decide the shrink. btrfs takes a disk out while it stays mounted.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Linux filesystems",
  versus: ["btrfs", "LVM"],
  published: "2026-11-19",
  updated: "2026-11-19",
  author: "sourabh",
  short:
    "In btrfs vs LVM, both grow while mounted, and both can empty a disk while mounted: LVM with pvmove, btrfs with btrfs device remove. They differ in where the room for that disk’s data comes from. LVM needs free extents in the volume group, and making them means shrinking a filesystem first: ext4 only while unmounted, XFS not in any useful way. btrfs is the volume manager and the filesystem in one, so its own free space is the room.",
  sections: [
    {
      id: "btrfs-vs-lvm-at-a-glance",
      title: "btrfs vs LVM at a glance",
      blocks: [
        {
          kind: "p",
          text: "The Logical Volume Manager (LVM) pools block devices in layers. Each disk becomes a physical volume (PV), PVs join a volume group (VG), and you carve logical volumes (LVs) out of the VG. An LV is a block device, so it still needs a filesystem such as ext4 or XFS on top. btrfs does both jobs in one: a btrfs filesystem “can be created on top of single or multiple block devices”, and its device management “works on a mounted filesystem.”",
        },
        {
          kind: "p",
          text: "On a cloud VM, the layer that sets the bill is the disk. Azure bills managed disks “according to their provisioned size”, and its own example adds that this holds “regardless of the amount of data written to the disk.” Neither cloud shrinks a disk in place. Microsoft Learn says shrinking an existing disk “isn’t supported and might result in data loss”, and the Amazon Elastic Block Store (EBS) guide says “You can’t decrease the volume size.” So on a running VM, paying for fewer GiB means emptying a whole disk, taking it out of the stack, then detaching and deleting it. Every row below is about that job.",
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
      id: "btrfs-vs-lvm-with-ext4-or-xfs",
      title: "btrfs vs LVM with ext4 or XFS: what decides a shrink",
      blocks: [
        {
          kind: "p",
          text: [
            "LVM is good at moving data between disks. Red Hat’s guide says “you can move data while your system is active using the pvmove command”, and that data “can be rearranged on disks while the disks are in use.” Emptying a PV while its filesystem stays mounted is routine. These commands take a disk out of LVM, so run them only on the disk you mean to delete, and check in the ",
            { code: "pvs" },
            " output that the disk’s PFree equals its PSize before ",
            { code: "vgreduce" },
            ":",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "sudo pvs\nsudo pvmove /dev/<old-disk>\nsudo pvs\nsudo vgreduce <vg-name> /dev/<old-disk>\nsudo pvremove /dev/<old-disk>",
        },
        {
          kind: "p",
          text: [
            "The catch is where pvmove puts that disk’s data. It needs free extents on the other PVs, and Red Hat’s procedure adds a new PV first “If there are not enough free extents on the other physical volumes in the existing volume group.” LVM sees extents, not files. If you once ran ",
            { code: "lvextend" },
            " to give an LV the whole VG, every extent belongs to that LV, even when the filesystem inside it is mostly empty. Free space in the filesystem isn’t free space in the VG.",
          ],
        },
        {
          kind: "p",
          text: "So making room means shrinking the LV, and an LV can only shrink after its filesystem does. Red Hat warns that “you must ensure that the file system on that logical volume is not using the space in the logical volume that is being reduced.” That hands the decision to the filesystem, and ext4 and XFS answer differently.",
        },
        { kind: "h3", id: "lvm-with-ext4", title: "LVM with ext4" },
        {
          kind: "p",
          text: [
            "The resize2fs man page says it can “enlarge or shrink an unmounted file system”, and that on a mounted one it can only expand. Red Hat’s shrink procedure follows from that: unmount the LV, run ",
            { code: "e2fsck -f" },
            ", run ",
            { code: "lvreduce --size <new-size> --resizefs" },
            ", then mount it again. Every service on that mount stops for the check and the resize. The steps and the minimum size are in ",
            { a: "shrinking ext4 with resize2fs", href: "/learn/resize2fs-shrink-ext4" },
            ".",
          ],
        },
        { kind: "h3", id: "lvm-with-xfs", title: "LVM with XFS" },
        {
          kind: "p",
          text: [
            "Red Hat states that “XFS does not support reducing the size of a volume formatted with an XFS file system.” With XFS on the LV, no LVM command can free those extents without losing data. The route is a copy onto a new, smaller filesystem, with a stop while you switch over, which ",
            { a: "shrinking an XFS filesystem", href: "/learn/shrink-xfs-filesystem" },
            " covers.",
          ],
        },
        {
          kind: "p",
          text: [
            "That makes LVM with ext4 or XFS a stack that grows while mounted but gives extents back only through an unmount or a copy. You can keep pvmove possible by leaving free extents in the VG and growing each LV with ",
            { code: "lvextend --resizefs" },
            " only as its data needs. That helps until the data shrinks, because the LV doesn’t shrink with it. ",
            { a: "Removing a disk from LVM", href: "/learn/remove-disk-from-lvm" },
            " walks through both cases.",
          ],
        },
      ],
    },
    {
      id: "how-btrfs-takes-a-disk-out-while",
      title: "How btrfs takes a disk out while mounted",
      blocks: [
        {
          kind: "p",
          text: "btrfs has no second layer to keep in step. Adding a device “is instant and does not affect existing data.” Removing one moves its data onto the other devices, and the docs warn that “The operation can take long as it needs to move all data from the device.” Check the space first. The removal moves every block off the device you name, so name only the disk you mean to delete:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "sudo btrfs filesystem usage <mount-point>\nsudo btrfs device remove /dev/<old-disk> <mount-point>\nsudo btrfs filesystem show <mount-point>",
        },
        {
          kind: "p",
          text: [
            "Two rules decide whether it works. The data has to fit on the devices that stay, with ",
            { a: "unallocated space", href: "/learn/btrfs-unallocated-space" },
            " to spare. And “Device removal must satisfy the profile constraints, otherwise the command fails.” A profile is btrfs’s allocation policy for data and metadata, such as single or RAID1. The docs’ own example is a RAID1 filesystem that can’t drop to one device, with the error “unable to go below two devices on raid1”, until it’s converted to another profile. ",
            { a: "btrfs on multiple disks", href: "/learn/btrfs-multiple-disks" },
            " covers the profiles, and ",
            { a: "btrfs device remove", href: "/learn/btrfs-device-remove" },
            " covers the removal step by step.",
          ],
        },
        {
          kind: "p",
          text: [
            "When ",
            { code: "btrfs filesystem show" },
            " no longer lists the device, detach the cloud disk and delete it. Deleting is permanent, so confirm the disk’s name and resource ID first. Billing ends with the delete: Azure prorates a disk hourly and bills it until it’s gone, whatever it holds.",
          ],
        },
        {
          kind: "p",
          text: "One case gives btrfs no advantage. A single-disk btrfs filesystem can shrink while mounted, but the docs say “The resize command does not manipulate the size of underlying partition”, and the cloud disk under it can’t shrink at all. The bill moves only when a whole disk leaves, so the layout that pays is one btrfs filesystem across several smaller disks.",
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
            ", when “the freed up logical extents are returned to the volume group.” A btrfs subvolume is “a part of filesystem with its own independent file/directory hierarchy and inode number namespace.” The btrfs docs draw the line themselves: an LVM logical volume is block-level, while btrfs subvolumes are file extent-based. A subvolume looks like a directory, and it can be mounted on its own with the ",
            { code: "subvol" },
            " or ",
            { code: "subvolid" },
            " option. Subvolumes share the single storage pool of the whole filesystem, and capacity limits come from quota groups if you want them. That matters on a VM with several data mounts. They all draw on one pool of free space, not one per LV.",
          ],
        },
      ],
    },
    {
      id: "lvm-vs-btrfs-snapshots-and-lvm-thin",
      title: "LVM vs btrfs snapshots, and LVM thin",
      blocks: [
        {
          kind: "p",
          text: "LVM has two kinds of snapshot. A thick snapshot “requires you to allocate some amount of storage space upfront”, and “If a snapshot reaches 100% of its allocated space, it will become invalid.” A thin snapshot is made from a thin LV, needs nothing set aside, and shares the same data blocks as its origin until the origin changes. A btrfs snapshot is “a subvolume like any other, with given initial content”, and it starts out sharing all of its data blocks with the original through copy-on-write.",
        },
        {
          kind: "p",
          text: "On LVM thin vs btrfs, thin provisioning comes close to what btrfs does with subvolumes. It “enables the creation of logical volumes that are larger than the available physical storage”, and “A thin pool allocates space on-demand to its LVs.” What it doesn’t change is the cloud disk. The thin pool sits on PVs, the PVs sit on managed disks or EBS volumes, and those are billed at their provisioned size. Taking a disk out from under a thin pool is still a pvmove that needs free extents. And in a thin pool and in btrfs alike, a snapshot goes on referencing the blocks it shares with its origin, so deleting files that were there when you took it doesn’t give their space back while the snapshot exists.",
        },
      ],
    },
    {
      id: "btrfs-or-lvm-which-to-choose-on",
      title: "btrfs or LVM: which to choose on a cloud VM",
      blocks: [
        {
          kind: "p",
          text: "For a data mount whose size moves both ways, use btrfs across several disks. Of the stacks here, it’s the one that can hand a disk back with nothing unmounted, however large the data once grew. LVM with ext4 suits data that only grows, or a mount where a planned stop for a shrink is acceptable. LVM with XFS is one-way. Size it for growth, and plan a copy if the data ever shrinks a lot.",
        },
        {
          kind: "p",
          text: [
            "Two checks before you pick btrfs. Your distribution has to ship btrfs in its kernel and the btrfs-progs tools, and the profile you plan to use has to be one you trust, which ",
            { a: "how stable btrfs is", href: "/learn/is-btrfs-stable" },
            " goes through. Moving an existing ext4 or XFS mount onto a new btrfs filesystem is a copy with a short stop at the switch, the same route as ",
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
            " optimizes block storage on Azure managed disks and Amazon EBS, and it sits on the btrfs side of this comparison. Its pool is one btrfs filesystem per VM, across two or more data disks. Each data mount becomes a subvolume on it, mounted at the same path as before, so applications read and write where they did. The mounts it moves can be ext4, XFS or another block-backed filesystem, on LVM or not, as long as every disk under them is a cloud data disk.",
          ],
        },
        {
          kind: "p",
          text: "Getting there takes one copy. The agent copies each data mount onto the pool inside the VM while services run, and at the switch the systemd services that use those mounts stop and start again. After that, the pool follows the data without unmounting:",
        },
        {
          kind: "ul",
          items: [
            "When data grows, Amoeba grows the pool’s disks in place or adds a disk, and the space goes in at once while the pool stays mounted.",
            [
              "When data shrinks, Amoeba takes out one disk at a time. The agent moves its data onto the others with ",
              { code: "btrfs device remove" },
              ", then Amoeba detaches the empty disk and deletes it, with no snapshot, and its billing stops.",
            ],
            "Amoeba never detaches and deletes a disk while the pool is at or above the top edge of its target band, 80% to 90% full by default, or while an urgent expand runs.",
          ],
        },
        {
          kind: "p",
          text: "On Linux, Amoeba needs systemd, kernel 5.14 or later, and btrfs loaded or loadable. Every process that keeps a data mount open has to run as a systemd service, so the agent can stop it and start it again at the switch. VMs whose OS is in the Red Hat family are not moved. The VM also needs 3 free data-disk slots: 2 for the pool and 1 kept free for an urgent expand.",
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
      title: "Which Linux distributions does Amoeba support?",
      where: "Amoeba FAQ",
      href: "/amoeba/faq#which-linux-distributions-does-amoeba-support",
    },
  ],
};
