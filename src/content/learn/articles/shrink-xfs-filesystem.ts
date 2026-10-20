import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/shrink-xfs-filesystem/1";

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
  short: [
    "You can’t shrink an XFS filesystem in any useful way. XFS grows while mounted, but Red Hat’s documentation says “XFS has no utility to reduce the size of a file system.” Since Linux 5.13, ",
    { code: "xfs_growfs" },
    " can give back free space at the end of the last allocation group, as an experimental feature that never removes a group. To make XFS smaller, copy the data to a new, smaller filesystem and move the mount.",
  ],
  sections: [
    {
      id: "why-xfs-cannot-be-reduced",
      title: "Why XFS cannot be reduced",
      blocks: [
        {
          kind: "p",
          text: [
            "XFS lays out its space in allocation groups (AGs), slices of the device that each keep their own free-space and inode records. ",
            { code: "xfs_info" },
            " shows the layout. The example in its man page reads ",
            { code: "agcount=8, agsize=5974144 blks" },
            " with a block size of 4,096 bytes: eight AGs of about 22.8\u00a0GiB each, 182.3\u00a0GiB in all.",
          ],
        },
        {
          kind: "p",
          text: [
            "Growing fits this design well. ",
            { code: "xfs_growfs" },
            " adds space at the end, the man page notes that “the filesystem must be mounted to be grown,” and the existing contents are undisturbed. Shrinking is the hard direction. Giving back more than part of the last AG means removing whole AGs, and the files and inodes stored in them would have to move somewhere else first. The kernel’s shrink code doesn’t move them.",
          ],
        },
        {
          kind: "p",
          text: [
            "So Red Hat, whose RHEL uses XFS as its default filesystem, documents XFS filesystem shrinking as unsupported. Its section on resizing a partition notes that “XFS does not support shrinking,” and its filesystem comparison sets XFS against ext4, which “supports both extending and reducing the size of a file system.” Even ext4 shrinks only while unmounted, which ",
            { a: "shrinking ext4 with resize2fs", href: "/learn/resize2fs-shrink-ext4" },
            " explains.",
          ],
        },
      ],
    },
    {
      id: "what-xfs-growfs-shrink-does-since-linux",
      title: "What xfs_growfs shrink does since Linux 5.13",
      blocks: [
        {
          kind: "p",
          text: [
            "One narrow shrink does exist. A kernel patch from March 2021, “xfs: support shrinking unused space in the last AG,” shipped in Linux 5.13. Its message calls it “the first step of shrinking.” You ask for it with ",
            { code: "xfs_growfs -D" },
            " and a size smaller than today’s, given in filesystem blocks.",
          ],
        },
        {
          kind: "p",
          text: "The man page states the limits: “Only shrinking the last AG without removing it is implemented.” A filesystem with one AG can’t shrink, and no shrink may leave it with only one. It also gives back only unused space: nothing is moved out of the way, so if anything is stored in the blocks you ask it to drop, the shrink fails and the filesystem keeps its size.",
        },
        { kind: "diagram", figure: figure1 },
        {
          kind: "p",
          text: "In the man page’s example, the most a shrink could ever give back is less than one AG, so under 22.8\u00a0GiB of 182.3\u00a0GiB, and only when that tail is empty. Any new size at or below 41,819,008 blocks (7 × 5,974,144) would remove AG7, and the kernel refuses it. The patch rejected any shrink that would remove an AG, with the comment “shrinking the entire AGs hasn’t yet completed.” In the mainline kernel source in October 2026 that comment and that check are still there, and a shrink still logs a warning that marks the feature as experimental.",
        },
        {
          kind: "p",
          text: [
            "To see what you’d be working with, read the geometry first, which ",
            { code: "xfs_growfs -n" },
            " prints without changing anything:",
          ],
        },
        { kind: "code", lang: "bash", code: "xfs_info /data\nsudo xfs_growfs -n /data" },
        {
          kind: "p",
          text: [
            "The shrink itself runs on the mounted filesystem, and the kernel flags it as experimental, so take a backup or a snapshot of the disk before you try it. Give the new size in filesystem blocks, the ",
            { code: "bsize" },
            " unit that ",
            { code: "xfs_info" },
            " reports, and expect the call to fail if the blocks you drop aren’t free:",
          ],
        },
        { kind: "code", lang: "bash", code: "sudo xfs_growfs -D <new-size-in-blocks> /data" },
      ],
    },
    {
      id: "why-a-smaller-filesystem-doesnt-make-a",
      title: "Why a smaller filesystem doesn’t make a smaller disk",
      blocks: [
        {
          kind: "p",
          text: [
            "On a cloud VM, even a shrink that works leaves the bill where it was. The disk under your XFS filesystem keeps its provisioned size whatever the filesystem does, and that size is what you pay for. You’d still have to shrink the partition and then the disk, and neither cloud shrinks a disk. AWS lists it among the Elastic Volumes limits: “You can’t decrease the volume size.” Azure is the same: ",
            {
              a: "a managed disk can grow but not shrink",
              href: "/learn/shrink-azure-managed-disk",
            },
            ".",
          ],
        },
        {
          kind: "p",
          text: "So the size you pay for goes down only when the data moves to a smaller disk and the old one is deleted, which is AWS’s own suggestion for EBS: create a smaller volume and migrate the data with a tool such as rsync. With XFS that copy is the only route, on a cloud disk or anywhere else.",
        },
      ],
    },
    {
      id: "how-to-shrink-an-xfs-filesystem-copy",
      title: "How to shrink an XFS filesystem: copy it to a smaller one",
      blocks: [
        {
          kind: "p",
          text: "To reduce XFS filesystem size on Linux, you create a new, smaller filesystem, copy the data across and move the mount, and the services that write to that mount stop for part of the job. In outline:",
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
              " or the ",
              { a: "EBS walkthrough", href: "/learn/shrink-ebs-volume" },
              ".",
            ],
            [
              "Make an XFS filesystem on it with ",
              { code: "mkfs.xfs" },
              " and mount it at a temporary path such as ",
              { code: "/mnt/new" },
              ". ",
              { code: "mkfs.xfs" },
              " erases the device you name, so check the name with ",
              { code: "lsblk" },
              " before you run it.",
            ],
            "Pick one of the two copy tools described after this list. With rsync, run the first pass now, while the application works.",
            "Stop every service that writes to the mount, which is where the downtime starts. Then copy: rsync’s second pass, or the whole xfsdump pipe.",
            [
              "With the services still stopped, unmount the old filesystem and ",
              { code: "/mnt/new" },
              ", point the ",
              { code: "/etc/fstab" },
              " line for the mount at the new filesystem’s UUID, mount it at the old path, start the services and check them.",
            ],
            "Deleting the old disk can’t be undone, so snapshot it first. Then detach and delete it, which is when its charge stops.",
          ],
        },
        {
          kind: "p",
          text: "For steps 4 and 5 you have two tools. rsync in two passes keeps the stop short: the first pass runs while the application works, and the second, with the services stopped, copies only what changed. The linked articles give the flags that keep hard links, ACLs and extended attributes.",
        },
        {
          kind: "p",
          text: [
            "XFS’s own tools copy in one pass. ",
            { code: "xfsdump" },
            " “backs up files and their attributes,” and its man page shows a pipe straight into ",
            { code: "xfsrestore" },
            ". It reads the mounted filesystem as it goes, so stop the services before it starts and keep them stopped until it ends:",
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
            " stops xfsdump updating its dump inventory, which a one-off copy doesn’t need, and the man page’s example passes it to ",
            { code: "xfsrestore" },
            " too. Pick rsync when a short stop matters more, and the pipe when the data is small enough that a full stop is acceptable.",
          ],
        },
      ],
    },
    {
      id: "xfs-shrink-on-lvm",
      title: "XFS shrink on LVM",
      blocks: [
        {
          kind: "p",
          text: "LVM doesn’t change any of this. Red Hat’s LVM guide states that “XFS does not support reducing the size of a volume formatted with an XFS file system,” and its section on shrinking a logical volume (LV) carries a warning: “Data stored in the reduced area is lost. Always back up the data and resize the file system before proceeding.” With XFS on the LV, the filesystem can’t shrink first beyond the free tail of its last AG, so reducing the LV further loses whatever XFS kept in the reduced area.",
        },
        {
          kind: "p",
          text: [
            "The copy works the same way on LVM. Create a new, smaller LV, either from free extents in the volume group or on a disk you add, copy the data into it and move the mount. Removing the old LV takes its filesystem with it, so do it only after you’ve checked the copy: unmount it and run ",
            { code: "lvremove" },
            ". Free extents on the other disks are what ",
            { code: "pvmove" },
            " needs to empty a disk before you take it out of the volume group, the steps in ",
            { a: "taking a disk out of LVM", href: "/learn/remove-disk-from-lvm" },
            ". ",
            { a: "Comparing btrfs with LVM", href: "/learn/btrfs-vs-lvm" },
            " shows the two stacks side by side for data whose size goes both ways.",
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
            " optimizes block storage on Azure managed disks and Amazon EBS, and it makes this copy once. It moves any mounted, block-backed data filesystem, XFS and ext4 included, and stacks on LVM, mdraid or LUKS too, as long as every disk under the mount is a cloud data disk.",
          ],
        },
        {
          kind: "p",
          text: "The pool is one btrfs filesystem per VM. Amoeba sizes it from the highest use of the last 7\u00a0days, so it sits inside its target band, 80% to 90% full by default, with room for the largest recent 15-minute rise and at least 10\u00a0GiB free. Inside the VM, the agent copies each data mount onto it with rsync while services run, and each mount becomes a subvolume at the same path as before. At the switch, the agent stops the systemd services that hold those mounts, without killing any process, and starts them again on the pool. That restart is the service interruption. If the switch fails, the agent restores the original mounts and Amoeba tries again, so services can restart more than once. A 2-hour soak follows. You pay for both sets of disks until the source disks are deleted after it, and then for their safety snapshots for 7\u00a0days.",
        },
        {
          kind: "p",
          text: [
            "After the move, the pool follows the data. Shrinks can start only once the move is done and 7 full days of data are in. A shrink takes one disk at a time: the agent moves that disk’s data onto the others with ",
            { a: { code: "btrfs device remove" }, href: "/learn/btrfs-device-remove" },
            ", and Amoeba detaches the empty disk and deletes it, with no snapshot.",
          ],
        },
        {
          kind: "p",
          text: "On Linux, Amoeba needs systemd, kernel 5.14 or later, and btrfs loaded or loadable. Every process that keeps a data mount open must run as a systemd service. The VM also needs 3 free data-disk slots: 2 for the pool and 1 kept free for an urgent expand. VMs whose OS is in the Red Hat family are not moved. XFS is the default filesystem in RHEL, so an XFS mount on a RHEL VM stays where it is. For those, the copy above is the route.",
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
    {
      title: "Which Linux distributions does Amoeba support?",
      where: "Amoeba FAQ",
      href: "/amoeba/faq#which-linux-distributions-does-amoeba-support",
    },
  ],
};
