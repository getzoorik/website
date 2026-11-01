import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/resize2fs-shrink-ext4/1";
import { figure as figure2 } from "@/features/learn/figures/resize2fs-shrink-ext4/2";

export const article: Article = {
  slug: "resize2fs-shrink-ext4",
  title: "resize2fs shrink ext4: why it must be unmounted",
  meta: "resize2fs shrinks ext4 only while it’s unmounted. Run e2fsck -f, find the minimum with resize2fs -P, then shrink the filesystem before the LV or partition.",
  h1: "Shrink ext4 with resize2fs: why it must be unmounted",
  deck: "ext4 grows while mounted and shrinks only unmounted. The safe order, and why the disk cost stays the same.",
  card: "Why resize2fs won’t shrink a mounted ext4, and the safe steps when you can stop the service.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Linux filesystems",
  published: "2026-11-01",
  updated: "2026-11-01",
  author: "ravi",
  cover: "/learn-covers/zoorik-learn-resize2fs-shrink-ext4-1200x630.webp",
  coverAlt:
    "Shrink ext4 with resize2fs: with /data unmounted, the blocks move first so the end can go",
  short: [
    "resize2fs shrinks an ext4 filesystem only while it’s unmounted, so stop its services and unmount it first. Run ",
    { code: "e2fsck -f" },
    ", check the minimum with ",
    { code: "resize2fs -P" },
    ", then shrink the filesystem before the logical volume or partition under it. On a cloud disk, a smaller filesystem doesn’t reduce what you pay.",
  ],
  sections: [
    {
      id: "why-resize2fs-wont-shrink-a-mounted-ext4",
      title: "Why resize2fs won’t shrink a mounted ext4",
      blocks: [
        {
          kind: "p",
          text: [
            "Picture ",
            { code: "/data" },
            " on a cloud VM. It’s a 500\u00a0GiB ext4 filesystem that fills a logical volume, or LV, on a 512\u00a0GiB data disk. After a cleanup, about 100\u00a0GiB of data is left.",
          ],
        },
        {
          kind: "p",
          text: "Ask resize2fs for 150\u00a0GiB while the application runs, and it refuses:",
        },
        {
          kind: "code",
          lang: "",
          code: "Filesystem at /dev/<device> is mounted on /data; on-line resizing required\nresize2fs: On-line shrinking not supported",
        },
        {
          kind: "p",
          text: "resize2fs notices the mount and prints the first line. It exits with the second as soon as the new size is smaller than the current one.",
        },
        {
          kind: "p",
          text: [
            "Getting to 150\u00a0GiB means stopping every service on ",
            { code: "/data" },
            " for the whole shrink. Afterwards, you still pay for all 512\u00a0GiB.",
          ],
        },
        {
          kind: "p",
          text: "The resize2fs man page states the rule in its first paragraph. resize2fs can “enlarge or shrink an unmounted file system”. On a mounted one, it “can be used to expand the size of the mounted file system”.",
        },
        {
          kind: "p",
          text: "A mounted grow adds block groups after the current end of the filesystem. No file uses that space yet.",
        },
        {
          kind: "p",
          text: "Shrinking is the other direction. Files can sit in any block, including the last ones. Before the end can go, resize2fs must move every block and inode there into the part that stays.",
        },
        {
          kind: "p",
          text: "It also rewrites the metadata that points at them. resize2fs does that only when no application can write to those blocks.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: [
            "No flag gets past this refusal. The ",
            { code: "-f" },
            " flag overrides “some safety checks”, and this refusal isn’t one of them.",
          ],
        },
        {
          kind: "callout",
          label: "For engineers",
          text: [
            "The man page’s debug flags name the two jobs a shrink adds: block relocations and inode relocations. Both error lines come from ",
            { code: "resize/online.c" },
            " in the e2fsprogs source.",
          ],
        },
      ],
    },
    {
      id: "run-e2fsck-f-then-size-the-shrink",
      title: "Run e2fsck -f, then size the shrink with resize2fs -P",
      blocks: [
        {
          kind: "h3",
          id: "why-resize2fs-asks-for-e2fsck-f",
          title: "Why resize2fs asks for e2fsck -f",
        },
        {
          kind: "p",
          text: [
            "Before it moves anything, resize2fs wants evidence that the filesystem is consistent. It reads the superblock, and stops with ",
            { code: "Please run 'e2fsck -f /dev/<device>' first." },
            " when the filesystem:",
          ],
        },
        {
          kind: "ul",
          items: [
            "has recorded errors",
            "wasn’t cleanly unmounted",
            "has orphan inodes or a journal waiting for recovery",
            "has been mounted since its last full check",
          ],
        },
        {
          kind: "p",
          text: [
            "That last condition holds for nearly any data disk in daily use. Run ",
            { code: "e2fsck -f" },
            " every time.",
          ],
        },
        {
          kind: "h3",
          id: "find-the-minimum-with-resize2fs-p",
          title: "Find the minimum with resize2fs -P",
        },
        {
          kind: "p",
          text: [
            { code: "resize2fs -P" },
            " prints ",
            { code: "Estimated minimum size of the filesystem:" },
            " and a count of filesystem blocks. Multiply the count by the ",
            { code: "Block size" },
            " that ",
            { code: "tune2fs -l" },
            " shows.",
          ],
        },
        {
          kind: "p",
          text: [
            "With ",
            { code: "-P" },
            ", resize2fs opens the device read-only. It exits once it has printed the estimate. So it works on a mounted filesystem too, and you can run it to plan the stop.",
          ],
        },
        {
          kind: "p",
          text: [
            "Ask for less than the estimate and resize2fs refuses with ",
            { code: "New size smaller than minimum (<blocks>)" },
            ". The ",
            { code: "-f" },
            " flag would push past it. Nothing good comes from forcing a filesystem below the space its own data needs.",
          ],
        },
        {
          kind: "p",
          text: "The figure is also only an estimate. The man page’s known-bugs section says it “may be incorrect, especially for file systems with 1k and 2k blocksizes”.",
        },
        {
          kind: "h3",
          id: "pick-a-target-well-above-the-minimum",
          title: "Pick a target well above the minimum",
        },
        {
          kind: "p",
          text: [
            "A filesystem shrunk to its minimum has next to no free space, so writes soon fail. The ",
            { code: "-M" },
            " option shrinks straight to the minimum. That suits a filesystem you’re about to image and set aside, not a data mount that keeps receiving writes.",
          ],
        },
        {
          kind: "p",
          text: [
            "One feature blocks a shrink outright. resize2fs refuses to shrink a filesystem with the ",
            { code: "stable_inodes" },
            " feature flag.",
          ],
        },
        {
          kind: "callout",
          label: "Worked example",
          text: [
            "For the opening case’s ",
            { code: "/data" },
            ", ",
            { code: "tune2fs -l" },
            " shows a ",
            { code: "Block size" },
            " of 4,096. ",
            { code: "resize2fs -P" },
            " prints 26,214,400.",
          ],
        },
        {
          kind: "ul",
          items: [
            "A GiB holds 1,073,741,824 ÷ 4,096 = 262,144 such blocks.",
            "So the estimate is 26,214,400 ÷ 262,144 = 100\u00a0GiB.",
            "The 150\u00a0GiB target is 150 × 262,144 = 39,321,600 blocks, 50\u00a0GiB above the estimate.",
            ["In the shrink step, that’s ", { code: "150G" }, "."],
          ],
        },
      ],
    },
    {
      id: "resize2fs-shrink-ext4",
      title: "How to shrink an ext4 filesystem with resize2fs",
      blocks: [
        {
          kind: "p",
          text: [
            "These steps stop every service on the mount and rewrite the filesystem’s layout. Replace ",
            { code: "/data" },
            ", ",
            { code: "<device>" },
            " and ",
            { code: "<service>" },
            " with your own.",
          ],
        },
        {
          kind: "ol",
          items: [
            [
              "Take a ",
              { a: "snapshot", href: "/learn/glossary/disk-snapshot" },
              " of the disk first. resize2fs can write an undo file with ",
              { code: "-z" },
              ". But the man page warns that the undo file “cannot be used to recover from a power or system crash”.",
            ],
            {
              text: "Find the device behind the mount and its filesystem type.",
              blocks: [{ kind: "code", lang: "bash", code: "df -Th /data" }],
            },
            {
              text: "Read the block size and the minimum, and choose the new size.",
              blocks: [
                {
                  kind: "code",
                  lang: "bash",
                  code: "sudo tune2fs -l /dev/<device> | grep 'Block size'\nsudo resize2fs -P /dev/<device>",
                },
              ],
            },
            {
              text: [
                "Stop each service that uses ",
                { code: "/data" },
                ". The downtime starts here.",
              ],
              blocks: [{ kind: "code", lang: "bash", code: "sudo systemctl stop <service>" }],
            },
            {
              text: "Unmount the filesystem so nothing can write to it.",
              blocks: [{ kind: "code", lang: "bash", code: "sudo umount /data" }],
            },
            {
              text: "Run the full check that resize2fs asks for.",
              blocks: [{ kind: "code", lang: "bash", code: "sudo e2fsck -f /dev/<device>" }],
            },
            {
              text: [
                "Shrink the filesystem to the new size. The size argument takes ",
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
                " prints. The ",
                { code: "-p" },
                " option shows a progress bar for each phase.",
              ],
              blocks: [
                { kind: "code", lang: "bash", code: "sudo resize2fs -p /dev/<device> <new-size>G" },
                {
                  kind: "p",
                  text: [
                    "If the resize stops partway, resize2fs says to run ",
                    { code: "e2fsck -fy" },
                    " on the device “after the aborted resize operation”. Do that before you mount it again.",
                  ],
                },
              ],
            },
            {
              text: "Mount it, check the new size, and start the services again.",
              blocks: [
                {
                  kind: "code",
                  lang: "bash",
                  code: "sudo mount /data\ndf -Th /data\nsudo systemctl start <service>",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "resize2fs-shrink-with-lvm-or-a-partition",
      title: "resize2fs shrink with LVM or a partition: the filesystem first",
      blocks: [
        {
          kind: "p",
          text: "Shrink the filesystem first, and the LV or partition under it second. Never take the LV or partition below the filesystem’s new size. The resize2fs man page gives that order for a partition, and an LV takes the same order.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "callout",
          label: "Watch out",
          text: "An LV or partition made smaller than its filesystem loses data. The resize2fs man page warns against a partition “smaller than the new size of the ext2 file system”.",
        },
        {
          kind: "p",
          text: "Red Hat’s logical volume guide agrees. “Data stored in the reduced area is lost,” it warns. Its advice is to “Always back up the data and resize the file system before proceeding”.",
        },
        {
          kind: "p",
          text: [
            "For a resize2fs shrink on LVM (Logical Volume Manager), let ",
            { code: "lvreduce" },
            " drive both layers. Red Hat’s procedure unmounts the LV and runs ",
            { code: "e2fsck -f" },
            ". Then it runs ",
            { code: "lvreduce" },
            " with ",
            { code: "--resizefs" },
            ", which resizes “the LV and the file system” in one command.",
          ],
        },
        { kind: "p", text: "The same order, with your volume group and LV names:" },
        {
          kind: "code",
          lang: "bash",
          code: "sudo umount /data\nsudo e2fsck -f /dev/<vg-name>/<lv-name>\nsudo lvreduce --size <new-size>G --resizefs <vg-name>/<lv-name>\nsudo mount /data",
        },
        {
          kind: "p",
          text: "The freed extents go back to the volume group, ready for another LV. They don’t leave the disk. A smaller partition gains you nothing on a cloud data disk either, because the disk under it stays the size you provisioned.",
        },
      ],
    },
    {
      id: "can-you-shrink-ext4-while-its-mounted",
      title: "Can you shrink ext4 while it’s mounted?",
      blocks: [
        {
          kind: "p",
          text: "No. resize2fs refuses before any change is made, and no option turns the refusal off. Two routes keep a service running for most of the job instead.",
        },
        {
          kind: "p",
          text: "The first is a copy. Use rsync to copy the data to a smaller filesystem on a new disk while the application runs. Then stop the services for a final pass over what changed, and mount the new filesystem at the old path.",
        },
        {
          kind: "p",
          text: [
            "The stop covers only that final pass and the remount. ",
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
            " as able to “Resize a mounted filesystem identified by path”. A size with a ",
            { code: "-" },
            " prefix makes it smaller.",
          ],
        },
        {
          kind: "p",
          text: [
            "A btrfs pool across several disks can also take one disk out while it stays mounted. The btrfs device documentation says device management “works on a mounted filesystem”. The ",
            { code: "btrfs device remove" },
            " command moves all the data off a disk before the disk leaves.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Taking a disk out of a btrfs pool", href: "/learn/btrfs-device-remove" },
            " covers the steps. Moving an ext4 mount onto btrfs takes one copy. An XFS mount has its own limits, set out in ",
            { a: "can you shrink an XFS filesystem?", href: "/learn/shrink-xfs-filesystem" },
          ],
        },
      ],
    },
    {
      id: "a-smaller-filesystem-doesnt-reduce-the-disk",
      title: "A smaller filesystem doesn’t reduce the disk cost",
      blocks: [
        {
          kind: "p",
          text: [
            "On a cloud VM, you pay for the disk, not the filesystem. Azure charges a managed disk for the capacity you provision. A 1\u00a0TiB ",
            { a: "Premium SSD", href: "/learn/glossary/azure-premium-ssd" },
            ", for example, has the P30 tier by default.",
          ],
        },
        {
          kind: "p",
          text: [
            "AWS charges each ",
            { a: "EBS volume", href: "/learn/glossary/ebs-volume" },
            " as configured, size included. After a change, AWS says “You are charged for the new volume configuration”. Shrinking ext4 from 500\u00a0GiB to 150\u00a0GiB on a 512\u00a0GiB disk still leaves you paying for 512\u00a0GiB.",
          ],
        },
        {
          kind: "p",
          text: [
            "The ",
            { a: "EBS and Azure disk pricing", href: "/ebs-and-azure-disk-pricing" },
            " calculator shows what a disk costs a month at list price, and what its empty space costs.",
          ],
        },
        {
          kind: "p",
          text: "Neither cloud shrinks the disk itself. Microsoft Learn says “Shrinking an existing disk isn’t supported and might result in data loss”. The EBS guide says “You can’t decrease the volume size”, and points to a smaller volume and a copy with rsync instead.",
        },
        { kind: "p", text: "So paying for fewer GiB means one of three routes:" },
        {
          kind: "ol",
          items: [
            [
              { b: "Copy to a smaller disk." },
              " It takes one stop at the switch, and then you delete the old one.",
            ],
            [
              { b: "Empty a disk under LVM." },
              " With LVM across several disks, shrink the filesystem and LV until a whole disk’s worth of extents is free. Move that disk’s data with ",
              { code: "pvmove" },
              ", remove it from the volume group with ",
              { code: "vgreduce" },
              ", then detach and delete the disk. With ext4 that still needs the unmount above, and ",
              { a: "removing a disk from LVM", href: "/learn/remove-disk-from-lvm" },
              " has the steps.",
            ],
            [
              { b: "Take a disk out of btrfs." },
              " Keep the data in a btrfs pool across several disks. Remove one disk while the filesystem stays mounted, as ",
              { a: "the btrfs and LVM comparison", href: "/learn/btrfs-vs-lvm" },
              " shows.",
            ],
          ],
        },
        {
          kind: "p",
          text: "When the data only grows, the first route once is enough. When it grows and shrinks, each ext4 shrink brings the stop back, and the third route avoids that.",
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
            " optimizes ",
            { a: "block storage", href: "/learn/glossary/block-storage" },
            " on Azure and AWS. It works on Azure managed disks and Amazon EBS volumes, the data disks of running Windows and Linux VMs. It never touches the OS disk.",
          ],
        },
        { kind: "p", text: "Amoeba takes the copy route once, then the btrfs route from there." },
        {
          kind: "ul",
          items: [
            [
              { b: "The move." },
              " Amoeba moves a VM’s data disks onto one btrfs pool, sized to your data, with room to grow. It copies your data while your services run.",
            ],
            [
              { b: "The switch." },
              " Then it switches each mount to the pool, with a short restart of the services that use it. Each mount keeps its path. If the switch fails, Amoeba puts the original mounts back and tries again.",
            ],
            [
              { b: "The old disks." },
              " Once the switch is checked, Amoeba snapshots each old disk and deletes the disk. It keeps each snapshot for a few days, then deletes it too.",
            ],
            [
              { b: "Rightsizing." },
              " Amoeba grows the pool before it fills, and sooner when data arrives fast. When your data goes down and stays down, it shrinks the pool one disk at a time, without any downtime. So you pay for close to what you use.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "The guide explains ",
            { a: "what happens at the switch", href: "/amoeba-guide#at-the-switch" },
            ". You pay for both sets of disks only while the move runs, and then for the snapshots while they’re kept.",
          ],
        },
        {
          kind: "p",
          text: "On Linux, the VM needs a recent kernel with btrfs. Every service that keeps a data mount open must run under systemd. The VM also needs a few free disk slots for the pool.",
        },
        {
          kind: "p",
          text: [
            { a: "EBS cost optimization", href: "/ebs-cost-optimization" },
            " and ",
            {
              a: "Azure managed disk cost optimization",
              href: "/azure-managed-disk-cost-optimization",
            },
            " show Amoeba on each cloud.",
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
