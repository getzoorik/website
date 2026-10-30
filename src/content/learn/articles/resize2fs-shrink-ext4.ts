import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/resize2fs-shrink-ext4/1";

export const article: Article = {
  slug: "resize2fs-shrink-ext4",
  title: "resize2fs shrink ext4: why it must be unmounted",
  meta: "resize2fs shrinks ext4 only while it’s unmounted. Run e2fsck -f, find the minimum with resize2fs -P, then shrink the filesystem before the LV or partition.",
  h1: "Shrink ext4 with resize2fs: why it must be unmounted",
  deck: "ext4 grows while mounted and shrinks only unmounted. The safe order, and why the disk bill stays the same.",
  card: "Why resize2fs won’t shrink a mounted ext4, and the safe steps when you can stop the service.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Linux filesystems",
  published: "2026-11-16",
  updated: "2026-11-16",
  author: "ravi",
  short: [
    "To shrink ext4 with resize2fs, unmount the filesystem first. resize2fs grows a mounted ext4 filesystem but shrinks only an unmounted one, and on a mounted one it stops with ",
    { code: "On-line shrinking not supported" },
    ". Run ",
    { code: "e2fsck -f" },
    ", check the minimum with ",
    { code: "resize2fs -P" },
    ", shrink the filesystem, then shrink the logical volume or partition under it. On a cloud disk, that alone doesn’t reduce the bill.",
  ],
  sections: [
    {
      id: "why-ext4-shrinks-only-while-unmounted",
      title: "Why ext4 shrinks only while unmounted",
      blocks: [
        {
          kind: "p",
          text: "The resize2fs man page states the rule in its first paragraph, before any option is described. resize2fs can “enlarge or shrink an unmounted file system”, and when the filesystem is mounted it “can be used to expand the size of the mounted file system.” A mounted grow adds block groups after the current end of the filesystem, in space no file uses yet.",
        },
        {
          kind: "p",
          text: "Shrinking is the other direction. Files can sit in any block, including the last ones, so before the end of the filesystem can go, resize2fs has to move every block and inode in that area into the part that stays and rewrite the metadata that points at them. The man page’s debug flags name the two jobs: block relocations and inode relocations. That is work resize2fs does only when no application can write to the same blocks at the same time.",
        },
        {
          kind: "p",
          text: "The e2fsprogs source shows exactly where a mounted shrink ends. resize2fs notices the mount, prints that on-line resizing is required, and exits as soon as the new size is smaller than the current one:",
        },
        {
          kind: "code",
          lang: "",
          code: "Filesystem at /dev/<device> is mounted on /data; on-line resizing required\nresize2fs: On-line shrinking not supported",
        },
        {
          kind: "p",
          text: [
            "So the error isn’t about a missing flag: ",
            { code: "-f" },
            " overrides “some safety checks”, and this refusal isn’t one of them. Shrinking ext4 needs the filesystem unmounted, which means stopping everything that uses it.",
          ],
        },
      ],
    },
    {
      id: "check-the-filesystem-and-find-its-minimum",
      title: "Check the filesystem and find its minimum size",
      blocks: [
        {
          kind: "p",
          text: [
            "On an unmounted filesystem, resize2fs wants evidence that the filesystem is consistent before it moves anything. It reads the superblock and stops with ",
            { code: "Please run 'e2fsck -f /dev/<device>' first." },
            " when the filesystem has recorded errors, wasn’t cleanly unmounted, has orphan inodes or a journal waiting for recovery, or has been mounted since its last full check. That last condition holds for nearly any data disk in daily use. Run ",
            { code: "e2fsck -f" },
            " every time.",
          ],
        },
        {
          kind: "p",
          text: [
            "To size the job, ",
            { code: "resize2fs -P" },
            " prints ",
            { code: "Estimated minimum size of the filesystem:" },
            " followed by a count of filesystem blocks. With ",
            { code: "-P" },
            ", resize2fs opens the device read-only and exits once it has printed the estimate, so it works on a mounted filesystem too and you can run it to plan the stop. Multiply that count by the ",
            { code: "Block size" },
            " that ",
            { code: "tune2fs -l" },
            " shows in its superblock listing: with 4,096-byte blocks, an estimate of 26,214,400 blocks is 100\u00a0GiB.",
          ],
        },
        {
          kind: "p",
          text: [
            "Ask for less than that and resize2fs refuses with ",
            { code: "New size smaller than minimum (<blocks>)" },
            ". That message is the guard doing its job. ",
            { code: "-f" },
            " would push past it, and nothing good comes from forcing a filesystem below the space its own data needs. The figure is also only an estimate: the man page’s known-bugs section says it “may be incorrect, especially for file systems with 1k and 2k blocksizes.”",
          ],
        },
        {
          kind: "p",
          text: [
            "Pick a target well above the minimum. A filesystem shrunk to its minimum has next to no free space, so writes soon fail for lack of space. ",
            { code: "-M" },
            " shrinks straight to the minimum, which suits a filesystem you’re about to image and set aside, not a data mount that keeps receiving writes. One feature blocks a shrink outright: resize2fs refuses to shrink a filesystem with the ",
            { code: "stable_inodes" },
            " feature flag.",
          ],
        },
      ],
    },
    {
      id: "how-to-shrink-an-ext4-filesystem-with",
      title: "How to shrink an ext4 filesystem with resize2fs",
      blocks: [
        {
          kind: "p",
          text: [
            "These steps stop every service on the mount and rewrite the filesystem’s layout, so take a snapshot of the disk first. resize2fs can write an undo file with ",
            { code: "-z" },
            ", but the man page warns that it “cannot be used to recover from a power or system crash.” Replace ",
            { code: "/data" },
            ", ",
            { code: "<device>" },
            " and ",
            { code: "<service>" },
            " with your own.",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "df -Th /data\nsudo tune2fs -l /dev/<device> | grep 'Block size'\nsudo resize2fs -P /dev/<device>\nsudo systemctl stop <service>\nsudo umount /data\nsudo e2fsck -f /dev/<device>\nsudo resize2fs -p /dev/<device> <new-size>G\nsudo mount /data\ndf -Th /data",
        },
        {
          kind: "p",
          text: [
            { code: "df -Th" },
            " shows the device behind the mount and its filesystem type. Stop each service that uses ",
            { code: "/data" },
            " before ",
            { code: "umount" },
            ". The size argument takes ",
            { code: "K" },
            ", ",
            { code: "M" },
            ", ",
            { code: "G" },
            " or ",
            { code: "T" },
            " as power-of-two units, or ",
            { code: "s" },
            " for 512-byte sectors. With no suffix, it’s a count of filesystem blocks, the same unit ",
            { code: "-P" },
            " prints. ",
            { code: "-p" },
            " shows a progress bar for each phase.",
          ],
        },
        {
          kind: "p",
          text: [
            "If the resize stops partway, resize2fs tells you to run ",
            { code: "e2fsck -fy" },
            " on the device “after the aborted resize operation.” Do that before you mount it again.",
          ],
        },
      ],
    },
    {
      id: "resize2fs-shrink-with-lvm-or-a-partition",
      title: "resize2fs shrink with LVM or a partition",
      blocks: [
        {
          kind: "p",
          text: "Order matters more than any flag. Shrink the filesystem first and the container under it second, never below the filesystem’s new size. resize2fs’s man page gives that order for a partition, and warns against making the partition “smaller than the new size of the ext2 file system.” ext4 follows the same rule.",
        },
        { kind: "diagram", figure: figure1 },
        {
          kind: "p",
          text: [
            "For a resize2fs shrink on LVM (Logical Volume Manager), let ",
            { code: "lvreduce" },
            " drive both layers. Red Hat’s procedure unmounts the logical volume (LV), runs ",
            { code: "e2fsck -f" },
            ", then runs ",
            { code: "lvreduce" },
            " with ",
            { code: "--resizefs" },
            ", which resizes “the LV and the file system” in one command. Its warning comes first: “Data stored in the reduced area is lost. Always back up the data and resize the file system before proceeding.” The same order, with your volume group and LV names:",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "sudo umount /data\nsudo e2fsck -f /dev/<vg-name>/<lv-name>\nsudo lvreduce --size <new-size>G --resizefs <vg-name>/<lv-name>\nsudo mount /data",
        },
        {
          kind: "p",
          text: "The freed extents go back to the volume group, ready for another LV. They don’t leave the disk. For a partition, shrinking it after the filesystem works the same way, and on a cloud data disk it gains you nothing, because the disk under the partition stays the size you provisioned.",
        },
      ],
    },
    {
      id: "can-you-shrink-ext4-online",
      title: "Can you shrink ext4 online?",
      blocks: [
        {
          kind: "p",
          text: "No. resize2fs refuses before any change is made, and no option turns the refusal off. Two routes keep a service running for most of the job instead.",
        },
        {
          kind: "p",
          text: [
            "The first is a copy. Create a smaller filesystem on a new disk and copy the data with rsync while the application runs. Then stop the services for a final copy of what changed, and mount the new filesystem at the old path. The stop covers only that final copy and the remount. ",
            { a: "Shrinking an Azure managed disk", href: "/learn/shrink-azure-managed-disk" },
            " and ",
            {
              a: "shrinking an Amazon Elastic Block Store (EBS) volume",
              href: "/learn/shrink-ebs-volume",
            },
            " walk through it.",
          ],
        },
        {
          kind: "p",
          text: [
            "The second is a Linux filesystem that shrinks while mounted, and btrfs is one. Its man page describes ",
            { code: "btrfs filesystem resize" },
            " as able to “Resize a mounted filesystem identified by path”, and a size with a ",
            { code: "-" },
            " prefix makes it smaller. A btrfs filesystem across several disks can also take one disk out while it stays mounted. Its device documentation says device management “works on a mounted filesystem”, and ",
            { code: "btrfs device remove" },
            " moves all data off the disk before it leaves. ",
            { a: "Taking a disk out of a btrfs pool", href: "/learn/btrfs-device-remove" },
            " covers the steps. XFS has its own limits, set out in ",
            { a: "can you shrink an XFS filesystem?", href: "/learn/shrink-xfs-filesystem" },
            ". Moving an ext4 mount onto btrfs is itself a copy, so it suits data whose size moves both ways, where the alternative is an unmount every time it shrinks.",
          ],
        },
      ],
    },
    {
      id: "why-a-smaller-filesystem-doesnt-reduce-the",
      title: "Why a smaller filesystem doesn’t reduce the disk bill",
      blocks: [
        {
          kind: "p",
          text: "On a cloud VM, the bill follows the disk, not the filesystem. Azure bills managed disks on what you provision: Microsoft’s billing examples put it as “billed for the provisioned capacity of the disk”, and a 1\u00a0TiB Premium SSD has the P30 tier by default. Amazon EBS bills each volume as configured, size included: after a change, “You are charged for the new volume configuration.” Shrinking ext4 from 500\u00a0GiB to 150\u00a0GiB on a 512\u00a0GiB disk leaves 512\u00a0GiB on the bill.",
        },
        {
          kind: "p",
          text: "Neither cloud shrinks the disk itself. Microsoft Learn says “Shrinking an existing disk isn’t supported and might result in data loss”, and the EBS guide says “You can’t decrease the volume size”, pointing to a smaller volume and a copy with rsync instead. So paying for fewer GiB means one of three things:",
        },
        {
          kind: "ol",
          items: [
            "Copy the data to a smaller disk, then delete the old one. One stop at the switch.",
            [
              "With LVM across several disks, shrink the filesystem and LV until a whole disk’s worth of extents is free, move that disk’s data with ",
              { code: "pvmove" },
              ", remove it from the volume group with ",
              { code: "vgreduce" },
              ", then detach and delete the disk. With ext4 that still needs the unmount above, and ",
              { a: "removing a disk from LVM", href: "/learn/remove-disk-from-lvm" },
              " has the steps.",
            ],
            [
              "Keep the data on btrfs across several disks and take a disk out while it stays mounted, as ",
              { a: "the btrfs and LVM comparison", href: "/learn/btrfs-vs-lvm" },
              " shows.",
            ],
          ],
        },
        {
          kind: "p",
          text: "When the data only grows, the first route once is enough. For data that grows and shrinks, the ext4 stop comes back with every shrink, and that is the case the third route is for.",
        },
      ],
    },
    {
      id: "how-amoeba-avoids-the-offline-shrink",
      title: "How Amoeba avoids the offline shrink",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " optimizes block storage on Azure managed disks and Amazon EBS. It takes the copy route once, then the btrfs route from there. It builds one pool beside your disks, a single btrfs filesystem across two or more data disks, sized from the highest use of the last 7\u00a0days so it sits inside its target band with room for the largest recent 15-minute rise and at least 10\u00a0GiB free. The agent copies each data mount onto it inside the VM with rsync while services run. Each mount keeps its path.",
          ],
        },
        {
          kind: "p",
          text: [
            "The switch is the stop. At the switch, the agent stops the systemd services that hold the data mounts open, checks that the final rsync pass has nothing left to copy, mounts the pool’s subvolumes at the same paths and starts the services again. If the switch fails, the agent restores the original mounts and restarts the services, and Amoeba tries the switch again, so services can restart more than once. A 2-hour soak follows. More detail is in the guide’s section on ",
            { a: "what happens at the switch", href: "/amoeba/guide#at-the-switch" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "After that, a shrink needs no unmount. Once the move is done and a full 7\u00a0days of data have been collected, Amoeba takes out one disk at a time. The agent moves that disk’s data onto the others with ",
            { code: "btrfs device remove" },
            ", and Amoeba detaches the empty disk and deletes it, with no snapshot, so its billing stops. Amoeba never takes a disk out while the pool is at or above the top edge of its target band (90% with the default band of 80% to 90% full), or while an urgent expand runs.",
          ],
        },
        {
          kind: "p",
          text: "Amoeba works on Windows and Linux VMs. On Linux, it needs systemd, kernel 5.14 or later, and btrfs loaded or loadable. Every process that keeps a data mount open must run as a systemd service, so the agent can stop it and start it again at the switch. VMs whose OS is in the Red Hat family are not moved. The VM also needs 3 free data-disk slots: 2 for the pool and 1 kept free for an urgent expand.",
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
      publisher: "man7.org",
      title: "“resize2fs(8)”",
      url: "https://man7.org/linux/man-pages/man8/resize2fs.8.html",
    },
    {
      publisher: "kernel.org",
      title: "“e2fsprogs source tree”",
      url: "https://git.kernel.org/pub/scm/fs/ext2/e2fsprogs.git/tree/",
      note: " (resize/main.c, resize/online.c, lib/e2p/ls.c)",
    },
    {
      publisher: "Red Hat",
      title: "“Configuring and managing logical volumes”",
      url: "https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html-single/configuring_and_managing_logical_volumes/index",
      note: " (RHEL 9), “Shrinking logical volumes” and “Removing physical volumes from a volume group”",
    },
    {
      publisher: "BTRFS documentation",
      title: "“btrfs-filesystem(8)”",
      url: "https://btrfs.readthedocs.io/en/latest/btrfs-filesystem.html",
    },
    {
      publisher: "BTRFS documentation",
      title: "“btrfs-device(8)”",
      url: "https://btrfs.readthedocs.io/en/latest/btrfs-device.html",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Expand virtual hard disks on a Linux VM”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/linux/expand-disks",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Understand Azure Disk Storage billing”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-understand-billing",
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
      title: "Can you shrink an XFS filesystem?",
      where: "Learn",
      href: "/learn/shrink-xfs-filesystem",
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
  ],
};
