import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/shrink-xfs-filesystem/1";
import { figure as figure2 } from "@/features/learn/figures/shrink-xfs-filesystem/2";

export const article: Article = {
  slug: "shrink-xfs-filesystem",
  title: "Shrink an XFS filesystem: what works instead",
  meta: "Can you shrink an XFS filesystem? Since Linux 5.13, only free space at the end of the last allocation group. The copy that works instead, with or without LVM.",
  h1: "Can you shrink an XFS filesystem?",
  deck: "Barely. What xfs_growfs can take back since Linux 5.13, and the copy that gives you a smaller disk.",
  card: "XFS grows while mounted but barely shrinks. What xfs_growfs -D can do, and the copy that works instead.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Linux filesystems",
  published: "2026-10-27",
  updated: "2026-10-27",
  author: "ravi",
  cover: "/learn-covers/zoorik-learn-shrink-xfs-filesystem-1200x630.webp",
  short: [
    "You can’t shrink an XFS filesystem in any useful way: Red Hat says “XFS has no utility to reduce the size of a file system.” Since Linux 5.13, ",
    { code: "xfs_growfs" },
    " can only give back free space at the end of the last allocation group. To make XFS smaller, copy the data to a new, smaller filesystem and move the mount.",
  ],
  sections: [
    {
      id: "why-xfs-cannot-be-reduced",
      title: "Why XFS cannot be reduced",
      blocks: [
        {
          kind: "p",
          text: [
            "Picture an XFS data mount on a cloud VM, with the layout from the ",
            { code: "xfs_info" },
            " man page. It holds 182.3\u00a0GiB, split into eight allocation groups (AGs). A cleanup has emptied most of it, and you want that space back, along with its charge.",
          ],
        },
        {
          kind: "p",
          text: "In place, you can take back at most the end of the last AG, under 22.8\u00a0GiB, and only if nothing is stored there. The cloud disk keeps its size, and its charge, either way.",
        },
        {
          kind: "p",
          text: [
            "Each AG is a slice of the device that keeps its own free-space and inode records. Growing fits this design well. ",
            { code: "xfs_growfs" },
            " adds space at the end, the man page notes that “the filesystem must be mounted to be grown,” and the existing contents are undisturbed.",
          ],
        },
        {
          kind: "p",
          text: "Shrinking is the hard direction. Giving back more than part of the last AG means removing whole AGs, and moving the files and inodes in them first. The kernel’s shrink code doesn’t move them.",
        },
        {
          kind: "p",
          text: [
            "For Red Hat, whose RHEL uses XFS as its default filesystem, XFS filesystem shrinking is unsupported. Its filesystem comparison sets XFS against ext4, which “supports both extending and reducing the size of a file system.” Even ext4 shrinks only while unmounted, as ",
            { a: "shrinking ext4 with resize2fs", href: "/learn/resize2fs-shrink-ext4" },
            " explains.",
          ],
        },
      ],
    },
    {
      id: "a-smaller-filesystem-doesnt-make-a-smaller",
      title: "A smaller filesystem doesn’t make a smaller disk",
      blocks: [
        {
          kind: "p",
          text: "On a cloud VM, even a shrink that works leaves the cost where it was. The disk under your XFS filesystem keeps its provisioned size whatever the filesystem does. That size is what you pay for.",
        },
        {
          kind: "p",
          text: [
            "You’d still have to shrink the partition and then the disk, and neither Azure nor AWS shrinks a disk. AWS lists it among the Elastic Volumes limits: “You can’t decrease the volume size.” Azure is the same: ",
            {
              a: "a managed disk can grow but not shrink",
              href: "/learn/shrink-azure-managed-disk",
            },
            ".",
          ],
        },
        {
          kind: "p",
          text: "The size you pay for goes down only when the data moves to a smaller disk and the old one is deleted. AWS suggests the same for EBS, naming rsync as one tool for the copy.",
        },
      ],
    },
    {
      id: "how-to-shrink-an-xfs-filesystem-copy",
      title: "How to shrink an XFS filesystem: copy it to a smaller one",
      blocks: [
        {
          kind: "p",
          text: "To reduce XFS filesystem size on Linux, you create a new, smaller filesystem, copy the data across and move the mount. Two tools can do the copy:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "rsync, in two passes." },
              " The first pass runs while the application works. The second, with the services stopped, copies only what changed, so the stop stays short.",
            ],
            [
              { b: "XFS’s own tools, in one pass." },
              " ",
              { code: "xfsdump" },
              " “backs up files and their attributes,” and its man page shows a pipe straight into ",
              { code: "xfsrestore" },
              ". It reads the mounted filesystem as it goes, so the services stay stopped for the whole copy.",
            ],
          ],
        },
        {
          kind: "p",
          text: "Pick rsync when a short stop matters more, and the pipe when the data is small enough that a full stop is acceptable.",
        },
        {
          kind: "ol",
          items: [
            [
              "Measure what the mount holds with ",
              { code: "df -Th" },
              ", and choose a size with room for growth.",
            ],
            [
              "Create and attach a smaller disk, with the exact steps in the ",
              { a: "Azure guide", href: "/learn/shrink-azure-managed-disk" },
              ".",
            ],
            [
              { code: "mkfs.xfs" },
              " erases the device you name, so check the new disk’s name with ",
              { code: "lsblk" },
              " first. Then make an XFS filesystem on it with ",
              { code: "mkfs.xfs" },
              " and mount it at a temporary path such as ",
              { code: "/mnt/new" },
              ".",
            ],
            {
              text: "With rsync, run the first pass now, while the application works. With xfsdump, skip this step.",
              blocks: [
                { kind: "code", lang: "bash", code: "sudo rsync -aHAX /data/ /mnt/new/" },
                {
                  kind: "p",
                  text: [
                    "Archive mode (",
                    { code: "-a" },
                    ") leaves out hard links, ACLs and extended attributes. ",
                    { code: "-H" },
                    ", ",
                    { code: "-A" },
                    " and ",
                    { code: "-X" },
                    " add them back, as in the Azure guide’s first pass. The trailing slash on ",
                    { code: "/data/" },
                    " copies its contents.",
                  ],
                },
              ],
            },
            "Stop every service that writes to the mount: the downtime starts here.",
            {
              text: "Run the final copy. With rsync, that’s the second pass. With xfsdump, it’s the whole pipe.",
              blocks: [
                { kind: "code", lang: "bash", code: "sudo rsync -aHAX --delete /data/ /mnt/new/" },
                {
                  kind: "p",
                  text: [
                    { code: "--delete" },
                    " removes files from ",
                    { code: "/mnt/new" },
                    " that are gone from ",
                    { code: "/data" },
                    ", as in the Azure guide’s final pass. With xfsdump, run this pipe instead:",
                  ],
                },
                {
                  kind: "code",
                  lang: "bash",
                  code: "sudo xfsdump -J - /data | sudo xfsrestore -J - /mnt/new",
                },
                {
                  kind: "p",
                  text: [
                    { code: "-J" },
                    " stops xfsdump updating its dump inventory, which a one-off copy doesn’t need. The man page’s example passes it to ",
                    { code: "xfsrestore" },
                    " too.",
                  ],
                },
              ],
            },
            [
              "With the services still stopped, unmount the old filesystem and ",
              { code: "/mnt/new" },
              ".",
            ],
            [
              "Point the ",
              { code: "/etc/fstab" },
              " line for the mount at the new filesystem’s UUID, and mount it at the old path.",
            ],
            "Start the services and check them: the downtime ends here.",
            "Snapshot the old disk, because deleting it can’t be undone.",
            "Detach and delete the old disk: its charge stops here.",
          ],
        },
        {
          kind: "p",
          text: "The services on that mount are down from step 5 to step 9. You pay for both disks from step 2, when the new one is created, until step 11 deletes the old one. You also pay for the step-10\u00a0snapshot until you delete it.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "xfs-shrink-on-lvm-copy-to-a",
      title: "XFS shrink on LVM: copy to a new logical volume",
      blocks: [
        {
          kind: "p",
          text: "LVM doesn’t change any of this. Red Hat’s LVM guide states that “XFS does not support reducing the size of a volume formatted with an XFS file system.”",
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "Never reduce a logical volume (LV) below the size of the XFS filesystem on it. A shorter LV takes away space that XFS still counts as its own. Red Hat’s section on shrinking an LV warns: “Data stored in the reduced area is lost.”",
        },
        { kind: "p", text: "The copy works the same way on LVM:" },
        {
          kind: "ol",
          items: [
            "Create a new, smaller LV, either from free extents in the volume group or on a disk you add.",
            "Copy the data into it and move the mount, as in steps 3 to 9 above.",
            [
              "Removing the old LV takes its filesystem with it, so check the copy first. Then unmount the old LV and run ",
              { code: "lvremove" },
              ".",
            ],
            [
              "To take a disk out of the volume group, empty it with ",
              { code: "pvmove" },
              ", which needs free extents on the other disks. The steps are in ",
              { a: "taking a disk out of LVM", href: "/learn/remove-disk-from-lvm" },
              ".",
            ],
            "Detach and delete the emptied disk, as in steps 10 and 11 above. Its charge stops only then.",
          ],
        },
        {
          kind: "p",
          text: [
            "For data whose size goes both ways, ",
            { a: "comparing btrfs with LVM", href: "/learn/btrfs-vs-lvm" },
            " shows the two stacks side by side.",
          ],
        },
      ],
    },
    {
      id: "what-an-xfs-growfs-shrink-can-give",
      title: "What an xfs_growfs shrink can give back since Linux 5.13",
      blocks: [
        {
          kind: "p",
          text: [
            "One narrow shrink does exist, in place, since Linux 5.13. The March 2021 kernel patch “xfs: support shrinking unused space in the last AG” calls it “the first step of shrinking.” You ask for it with ",
            { code: "xfs_growfs -D" },
            " and a size smaller than today’s.",
          ],
        },
        {
          kind: "p",
          text: "The man page states the limit: “Only shrinking the last AG without removing it is implemented.” So a shrink never removes an AG, and a filesystem with only one AG can’t shrink at all.",
        },
        {
          kind: "p",
          text: "Only unused space comes back. Nothing is moved out of the way. If anything is stored in the blocks you ask it to drop, the shrink fails and the filesystem keeps its size.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: [
            "The ",
            { code: "xfs_info" },
            " man page’s example reads ",
            { code: "agcount=8, agsize=5974144 blks" },
            " with a block size of 4,096 bytes. That makes 8 × 5,974,144 = 47,793,152 blocks, the ",
            { code: "blocks=" },
            " value ",
            { code: "xfs_info" },
            " prints. At 4,096 bytes a block, that is 182.3\u00a0GiB, or 22.8\u00a0GiB per AG.",
          ],
        },
        {
          kind: "p",
          text: "The last AG, AG7 (they count from AG0), starts at block 7 × 5,974,144 = 41,819,008, which is 159.5\u00a0GiB from the start. Any new size at or below 41,819,008 blocks would remove AG7, and the kernel refuses it.",
        },
        {
          kind: "p",
          text: "So a shrink can give back less than one AG: under 22.8\u00a0GiB of 182.3\u00a0GiB, or less than an eighth. Even that works only when the tail is empty.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: "This shrink leaves the cloud disk and its cost as they were. If you still want the filesystem smaller, it takes three steps:",
        },
        {
          kind: "ol",
          items: [
            [
              "Read the geometry. ",
              { code: "xfs_info" },
              " prints it, and so does ",
              { code: "xfs_growfs -n" },
              ", without changing anything.",
            ],
          ],
        },
        { kind: "code", lang: "bash", code: "xfs_info /data\nsudo xfs_growfs -n /data" },
        {
          kind: "ol",
          start: 2,
          items: [
            "The shrink runs on the mounted filesystem and the kernel flags it as experimental, so take a backup or a snapshot of the disk first.",
            [
              "Run the shrink with the new size in filesystem blocks, the ",
              { code: "bsize" },
              " unit that ",
              { code: "xfs_info" },
              " reports. At 4,096 bytes a block, each GiB you give back is 1,073,741,824 ÷ 4,096 = 262,144 blocks. In the example, the new size must stay above 41,819,008 blocks.",
            ],
          ],
        },
        { kind: "code", lang: "bash", code: "sudo xfs_growfs -D <new-size-in-blocks> /data" },
        {
          kind: "callout",
          label: "For engineers",
          text: [
            "The 5.13 patch rejected any shrink that would remove an AG, with the comment “shrinking the entire AGs hasn’t yet completed.” In the mainline kernel source (",
            { code: "fs/xfs/xfs_fsops.c" },
            ") in October 2026, that comment and that check are still there. A shrink still logs a warning that marks the feature as experimental.",
          ],
        },
      ],
    },
    {
      id: "how-amoeba-handles-an-xfs-data-mount",
      title: "How Amoeba handles an XFS data mount",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " optimizes block storage on Azure managed disks and Amazon EBS, and it makes the copy once.",
          ],
        },
        {
          kind: "p",
          text: "Before the copy, it checks the VM’s running kernel, not the OS name. The kernel needs btrfs, built in or as a module Amoeba can load. Where it has none, the XFS mount stays where it is, and the manual copy above is the route.",
        },
        {
          kind: "p",
          text: "Amoeba moves any mounted, block-backed data filesystem, XFS and ext4 included, and stacks on LVM, mdraid or LUKS. Every disk under the mount must be a cloud data disk.",
        },
        {
          kind: "p",
          text: "Amoeba sizes the btrfs pool, one per VM, so the highest use of the last 7\u00a0days sits at 80% full or less. It also leaves room under 95% for the largest recent 15-minute rise and for 7 more days of growth. No pool is smaller than 125\u00a0GiB.",
        },
        {
          kind: "p",
          text: "The agent copies each data mount onto the pool with rsync while services run. Each mount becomes a subvolume at the same path as before.",
        },
        {
          kind: "p",
          text: "At the switch, the agent stops the systemd services that hold those mounts, without killing any process, and starts them again on the pool. That restart is the service interruption.",
        },
        {
          kind: "p",
          text: "If the switch fails, the agent restores the original mounts and Amoeba tries again. So services can restart more than once.",
        },
        {
          kind: "p",
          text: "Once Amoeba has checked the pool after the switch, it detaches each source disk, snapshots it and deletes it. You pay for both sets of disks until then. After that, you pay for each safety snapshot for 7\u00a0days, and then Amoeba deletes it.",
        },
        {
          kind: "p",
          text: "Shrinks can start only once the move is done and 7 full days of data are in. A shrink takes one disk at a time.",
        },
        {
          kind: "p",
          text: [
            "The agent moves that disk’s data onto the others with ",
            { a: { code: "btrfs device remove" }, href: "/learn/btrfs-device-remove" },
            ". Then Amoeba detaches the empty disk and deletes it, with no snapshot.",
          ],
        },
        {
          kind: "p",
          text: "Amoeba works on Windows and Linux VMs. On Linux, it needs systemd, kernel 5.14 or later, and btrfs loaded or loadable. Every process that keeps a data mount open must run as a systemd service.",
        },
        {
          kind: "p",
          text: "The VM also needs free data-disk slots, with 1 kept free for an urgent expand. A gp3 or Premium SSD v2 pool starts with at least 2\u00a0disks, so it needs at least 3 free slots. A Premium SSD pool can start as one disk, and then 2 are enough.",
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
      title: "“xfs_growfs(8) - Linux manual page”",
      url: "https://man7.org/linux/man-pages/man8/xfs_growfs.8.html",
    },
    {
      publisher: "man7.org",
      title: "“xfs_info(8) - Linux manual page”",
      url: "https://man7.org/linux/man-pages/man8/xfs_info.8.html",
    },
    {
      publisher: "man7.org",
      title: "“xfsdump(8) - Linux manual page”",
      url: "https://man7.org/linux/man-pages/man8/xfsdump.8.html",
    },
    {
      publisher: "kernel.org",
      title: "“xfs: support shrinking unused space in the last AG”",
      url: "https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=fb2fc172018599a6564aab4ac0dce79bf94bd6bc",
      note: " (commit fb2fc172)",
    },
    {
      publisher: "Red Hat",
      title: "“Managing file systems”",
      url: "https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html-single/managing_file_systems/index",
      note: " (RHEL 9)",
    },
    {
      publisher: "Red Hat",
      title: "“Configuring and managing logical volumes”",
      url: "https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html-single/configuring_and_managing_logical_volumes/index",
      note: " (RHEL 9)",
    },
    {
      publisher: "kernel.org",
      title: "“fs/xfs/xfs_fsops.c”",
      url: "https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/fs/xfs/xfs_fsops.c",
      note: " (mainline source, compared with tags v5.12 and v5.13)",
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
      title: "Shrink ext4 with resize2fs: why it must be unmounted",
      where: "Learn",
      href: "/learn/resize2fs-shrink-ext4",
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
  ],
};
