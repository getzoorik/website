import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/resize2fs-shrink-ext4/1";
import { figure as figure2 } from "@/features/learn/figures/resize2fs-shrink-ext4/2";

export const article: Article = {
  slug: "resize2fs-shrink-ext4",
  title: "resize2fs shrink ext4: why it must be unmounted",
  meta: "resize2fs shrinks ext4 only while it’s unmounted. Run e2fsck -f, find the minimum with resize2fs -P, shrink the filesystem, then the LV or partition.",
  h1: "Shrink ext4 with resize2fs",
  deck: "ext4 grows while mounted, but a shrink needs it unmounted, so the services that use it stop.",
  card: "Why resize2fs won’t shrink a mounted ext4, and the safe steps when you can stop the service.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Linux filesystems",
  published: "2026-11-01",
  updated: "2026-11-03",
  author: "ravi",
  cover: "/learn-covers/zoorik-learn-resize2fs-shrink-ext4-1200x630.webp",
  coverAlt:
    "Shrink ext4 with resize2fs: with /data unmounted, the blocks move first so the end can go",
  short: [
    "resize2fs shrinks an ext4 filesystem only while it’s unmounted. Run ",
    { code: "e2fsck -f" },
    ", check the minimum with ",
    { code: "resize2fs -P" },
    ", then shrink the filesystem before the logical volume (LV) or partition under it. On a cloud disk, a smaller filesystem doesn’t reduce what you pay.",
  ],
  sections: [
    {
      id: "why-resize2fs-wont-shrink-a-mounted-ext4",
      title: "“On-line shrinking not supported”",
      blocks: [
        {
          kind: "p",
          text: [
            "Take ",
            { code: "/data" },
            " on a cloud VM: a 500 GiB ext4 filesystem on a 500 GiB LV, on a 512 GiB data disk. After a cleanup, about 100 GiB of data is left.",
          ],
        },
        {
          kind: "p",
          text: "Ask resize2fs for 150 GiB while the application runs, and it refuses:",
        },
        {
          kind: "code",
          lang: "",
          code: "Filesystem at /dev/<device> is mounted on /data; on-line resizing required\nresize2fs: On-line shrinking not supported",
        },
        {
          kind: "p",
          text: "The first line means resize2fs found the mount. The second ends the run, because the new size is smaller than the current one.",
        },
        {
          kind: "p",
          text: "The resize2fs man page sets the rule. It can “enlarge or shrink an unmounted file system”. On a mounted one, it can only expand.",
        },
        {
          kind: "p",
          text: "A grow adds block groups after the end of the filesystem, where no file sits yet. A shrink must first move every block and inode out of the end, into the part that stays.",
        },
        {
          kind: "p",
          text: "It also rewrites the metadata that points at them. That’s only safe when no application can write to those blocks.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: [
            "No flag gets past this. The ",
            { code: "-f" },
            " flag overrides “some safety checks”, and this refusal isn’t one of them.",
          ],
        },
        {
          kind: "p",
          text: [
            "Growing is the easy direction. With no size given, ",
            { code: "resize2fs /dev/<device>" },
            " grows the filesystem to fill its device, mounted or not. ",
            {
              a: "Expanding an Azure disk",
              href: "/learn/azure-disk-expand-without-downtime",
            },
            " and ",
            { a: "increasing an EBS volume", href: "/learn/increase-ebs-volume-size" },
            " cover the grow end to end.",
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
      title: "Check and size the shrink",
      blocks: [
        {
          kind: "h3",
          id: "why-resize2fs-asks-for-e2fsck-f",
          title: "Why e2fsck -f comes first",
        },
        {
          kind: "p",
          text: [
            "resize2fs reads the superblock before it moves anything. On an unmounted filesystem, it stops with ",
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
            "The last one is true of almost any data disk in use, so run ",
            { code: "e2fsck -f" },
            " every time.",
          ],
        },
        {
          kind: "h3",
          id: "find-the-minimum-with-resize2fs-p",
          title: "Find the minimum",
        },
        {
          kind: "p",
          text: [
            { code: "resize2fs -P" },
            " prints ",
            { code: "Estimated minimum size of the filesystem:" },
            " and a count of filesystem blocks. Multiply it by the ",
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
            ", resize2fs opens the device read-only and exits after the estimate. So you can run it on the mounted filesystem to plan the stop.",
          ],
        },
        {
          kind: "p",
          text: [
            "Ask for less and resize2fs refuses with ",
            { code: "New size smaller than minimum (<blocks>)" },
            ". The ",
            { code: "-f" },
            " flag skips that check. Don’t use it here: the data has to fit in what’s left.",
          ],
        },
        {
          kind: "p",
          text: "The estimate can also be off. The man page’s known bugs say it “may be incorrect, especially for file systems with 1k and 2k blocksizes”.",
        },
        {
          kind: "h3",
          id: "pick-a-target-well-above-the-minimum",
          title: "Pick the target",
        },
        {
          kind: "p",
          text: [
            "A filesystem at its minimum has almost no free space, so writes soon fail. ",
            { code: "-M" },
            " shrinks straight to the minimum. That suits a filesystem you’ll image and archive, not a data mount that keeps taking writes.",
          ],
        },
        {
          kind: "p",
          text: [
            "resize2fs also refuses any shrink of a filesystem with the ",
            { code: "stable_inodes" },
            " feature flag.",
          ],
        },
        {
          kind: "callout",
          label: "Worked example",
          text: [
            "For the ",
            { code: "/data" },
            " example, ",
            { code: "tune2fs -l" },
            " shows a ",
            { code: "Block size" },
            " of 4,096, and ",
            { code: "resize2fs -P" },
            " prints 26,214,400.",
          ],
        },
        {
          kind: "ul",
          items: [
            "A GiB holds 1,073,741,824 ÷ 4,096 = 262,144 such blocks.",
            "So the estimate is 26,214,400 ÷ 262,144 = 100 GiB.",
            "The 150 GiB target is 150 × 262,144 = 39,321,600 blocks, 50 GiB above the estimate.",
            ["In the shrink step, that’s ", { code: "150G" }, "."],
          ],
        },
      ],
    },
    {
      id: "resize2fs-shrink-ext4",
      title: "resize2fs shrink, step by step",
      blocks: [
        {
          kind: "p",
          text: [
            "These steps rewrite the filesystem’s layout. Replace ",
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
              ", but the man page warns it “cannot be used to recover from a power or system crash”.",
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
              text: "Run the full check.",
              blocks: [{ kind: "code", lang: "bash", code: "sudo e2fsck -f /dev/<device>" }],
            },
            {
              text: [
                "Shrink the filesystem. The size takes ",
                { code: "K" },
                ", ",
                { code: "M" },
                ", ",
                { code: "G" },
                " or ",
                { code: "T" },
                " in powers of two, or ",
                { code: "s" },
                " for 512-byte sectors. With no suffix, it counts filesystem blocks, the unit ",
                { code: "-P" },
                " prints. ",
                { code: "-p" },
                " shows a progress bar for each phase.",
              ],
              blocks: [
                { kind: "code", lang: "bash", code: "sudo resize2fs -p /dev/<device> <new-size>G" },
                {
                  kind: "p",
                  text: [
                    "If the resize stops partway, resize2fs asks you to run ",
                    { code: "e2fsck -fy" },
                    " “after the aborted resize operation”. Do that before you mount it again.",
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
      title: "On LVM or a partition",
      blocks: [
        {
          kind: "p",
          text: "Shrink the filesystem first, then the LV or partition under it. The resize2fs man page gives that order for a partition, and an LV follows the same order.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "callout",
          label: "Watch out",
          text: "An LV or partition smaller than its filesystem loses data. The man page warns against a partition “smaller than the new size of the ext2 file system”.",
        },
        {
          kind: "p",
          text: "Red Hat’s LVM guide agrees: “Data stored in the reduced area is lost.” It says to “Always back up the data and resize the file system before proceeding”.",
        },
        {
          kind: "p",
          text: [
            "On LVM, let ",
            { code: "lvreduce" },
            " do both layers. Red Hat’s procedure unmounts the LV and runs ",
            { code: "e2fsck -f" },
            ". Then ",
            { code: "lvreduce --resizefs" },
            " resizes “the LV and the file system” in one command.",
          ],
        },
        { kind: "p", text: "With your volume group and LV names:" },
        {
          kind: "code",
          lang: "bash",
          code: "sudo umount /data\nsudo e2fsck -f /dev/<vg-name>/<lv-name>\nsudo lvreduce --size <new-size>G --resizefs <vg-name>/<lv-name>\nsudo mount /data",
        },
        {
          kind: "p",
          text: "The freed extents go back to the volume group for another LV. They don’t leave the disk.",
        },
      ],
    },
    {
      id: "can-you-shrink-ext4-while-its-mounted",
      title: "Ways around the unmount",
      blocks: [
        {
          kind: "p",
          text: "ext4 can’t shrink while mounted. Two routes keep the service running for most of the job.",
        },
        {
          kind: "p",
          text: [
            "The first is a copy. Copy the data with rsync to a smaller filesystem on a new disk while the application runs. Then stop the services for a final pass, and mount the new filesystem at the old path. ",
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
            "The second is a filesystem that shrinks while mounted, such as btrfs. Its man page says ",
            { code: "btrfs filesystem resize" },
            " can “Resize a mounted filesystem identified by path”. A ",
            { code: "-" },
            " before the size makes it smaller.",
          ],
        },
        {
          kind: "p",
          text: [
            "A btrfs pool across several disks can also give up a whole disk while mounted. The btrfs documentation says device management “works on a mounted filesystem”, and ",
            { code: "btrfs device remove" },
            " moves all the data off a disk before it leaves. ",
            { a: "Taking a disk out of a btrfs pool", href: "/learn/btrfs-device-remove" },
            " has the steps.",
          ],
        },
        {
          kind: "p",
          text: [
            "Moving an ext4 mount onto btrfs takes one copy. XFS has its own limits, covered in ",
            { a: "shrinking an XFS filesystem", href: "/learn/shrink-xfs-filesystem" },
            ".",
          ],
        },
      ],
    },
    {
      id: "a-smaller-filesystem-doesnt-reduce-the-disk",
      title: "Cloud disk cost",
      blocks: [
        {
          kind: "p",
          text: [
            "On a cloud VM, you pay for the disk, not the filesystem. Azure charges a managed disk by its provisioned size: a 1 TiB ",
            { a: "Premium SSD", href: "/learn/glossary/azure-premium-ssd" },
            " has the P30 tier by default.",
          ],
        },
        {
          kind: "p",
          text: [
            "AWS charges each ",
            { a: "EBS volume", href: "/learn/glossary/ebs-volume" },
            " for its configuration, size included. So shrinking ext4 from 500 GiB to 150 GiB on a 512 GiB disk still leaves you paying for 512 GiB.",
          ],
        },
        {
          kind: "p",
          text: [
            "The ",
            { a: "EBS and Azure disk pricing", href: "/ebs-and-azure-disk-pricing" },
            " calculator shows what a disk and its empty space cost a month at list price.",
          ],
        },
        {
          kind: "p",
          text: "Neither cloud shrinks a disk in place. Microsoft says “Shrinking an existing disk isn’t supported and might result in data loss”. AWS says “You can’t decrease the volume size”, and points to a smaller volume and a copy with rsync.",
        },
        { kind: "p", text: "So paying for fewer GiB takes one of three routes:" },
        {
          kind: "ol",
          items: [
            [
              { b: "Copy to a smaller disk." },
              " One stop at the switch, then you delete the old disk.",
            ],
            [
              { b: "Empty a disk under LVM." },
              " With LVM across several disks, shrink the filesystem and LV until a whole disk’s worth of extents is free. Move that disk’s data with ",
              { code: "pvmove" },
              ", remove it from the volume group with ",
              { code: "vgreduce" },
              ", then detach and delete it. With ext4, this still needs the unmount. ",
              { a: "Removing a disk from LVM", href: "/learn/remove-disk-from-lvm" },
              " has the steps.",
            ],
            [
              { b: "Take a disk out of btrfs." },
              " Keep the data in a btrfs pool across several disks, and remove one disk while it stays mounted. ",
              { a: "btrfs vs LVM", href: "/learn/btrfs-vs-lvm" },
              " compares the two.",
            ],
          ],
        },
        {
          kind: "p",
          text: "If the data only grows, one copy is enough. If it grows and shrinks, each ext4 shrink brings the stop back, and the btrfs route avoids it.",
        },
      ],
    },
    {
      id: "how-amoeba-avoids-the-offline-shrink",
      title: "Where Amoeba fits",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " rightsizes ",
            { a: "block storage", href: "/learn/glossary/block-storage" },
            " on Azure and AWS without any downtime. It works on the data disks of running Windows and Linux VMs: Azure managed disks and Amazon EBS volumes. It never touches the OS disk.",
          ],
        },
        { kind: "p", text: "It takes the copy route once, then the btrfs route from there." },
        {
          kind: "ul",
          items: [
            [
              { b: "The move." },
              " Amoeba copies your data while your services run. Then it switches each mount to one btrfs pool, with a short restart of the services that use it. Each mount keeps its path. If the switch fails, Amoeba puts the original mounts back and tries again.",
            ],
            [
              { b: "The old disks." },
              " Once the switch is checked, Amoeba snapshots each old disk and deletes the disk. It keeps each snapshot for 7 days, then deletes it too.",
            ],
            [
              { b: "Rightsizing." },
              " Amoeba grows the pool before it fills, and sooner when data arrives fast. When your data goes down and stays down, it shrinks the pool one disk at a time, without any downtime.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "You pay for both sets of disks only while the move runs, then for the snapshots while they’re kept. After that, you pay for close to what you use. The guide explains ",
            { a: "what happens at the switch", href: "/amoeba-guide#at-the-switch" },
            ".",
          ],
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
    text: "Amoeba moves a VM’s data disks onto one pool sized to your data, then rightsizes it autonomously, without any downtime, one disk at a time. We estimate it takes 50–60% off block storage cost. It is an estimated range, not a promise. The free assessment works out your own figure.",
    links: [
      { label: "Block storage optimization with Amoeba", href: "/amoeba" },
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
      note: " (resize/main.c, resize/online.c, lib/e2p/ls.c, lib/e2p/parse_num.c)",
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
      title: "Remove a disk from LVM in Linux",
      where: "Learn",
      href: "/learn/remove-disk-from-lvm",
    },
    {
      title: "Can you shrink an XFS filesystem?",
      where: "Learn",
      href: "/learn/shrink-xfs-filesystem",
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
  ],
  relatedTitle: "More on shrinking filesystems and disks",
};
