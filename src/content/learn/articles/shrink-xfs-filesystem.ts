import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/shrink-xfs-filesystem/1";
import { figure as figure2 } from "@/features/learn/figures/shrink-xfs-filesystem/2";

export const article: Article = {
  slug: "shrink-xfs-filesystem",
  title: "Shrink an XFS filesystem: what works instead",
  meta: "XFS can’t shrink in any useful way. To make an XFS filesystem smaller, copy the data to a new, smaller one, with or without LVM.",
  h1: "Can you shrink an XFS filesystem?",
  deck: "An in-place shrink frees little, and never shrinks the cloud disk you pay for.",
  card: "XFS grows while mounted but barely shrinks. What xfs_growfs -D can do, and the copy that works instead.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Linux filesystems",
  published: "2026-10-27",
  updated: "2026-11-03",
  author: "ravi",
  cover: "/learn-covers/zoorik-learn-shrink-xfs-filesystem-1200x630.webp",
  coverAlt: "XFS allocation groups, where only the free tail of the last group can go",
  short: [
    "Not in any useful way. Red Hat says “XFS has no utility to reduce the size of a file system.” Since Linux 5.13, ",
    { code: "xfs_growfs" },
    " can give back only free space at the end of the last allocation group. To make an ",
    { a: "XFS", href: "/learn/glossary/xfs" },
    " filesystem smaller, copy the data to a new, smaller one and move the mount.",
  ],
  sections: [
    {
      id: "why-xfs-cannot-be-reduced",
      title: "Why XFS can’t shrink",
      blocks: [
        {
          kind: "p",
          text: "XFS splits its device into allocation groups (AGs). Each AG is a slice of the device with its own free-space and inode records.",
        },
        {
          kind: "p",
          text: [
            { code: "xfs_growfs" },
            " grows a filesystem by adding space at the end, and leaves existing data in place. Its man page says “the filesystem must be mounted to be grown.”",
          ],
        },
        {
          kind: "p",
          text: "Shrinking is the hard direction. Giving back more than the free end of the last AG means removing whole AGs, and first moving their files and inodes out. The kernel’s shrink code doesn’t do that.",
        },
        {
          kind: "p",
          text: [
            "Red Hat, whose RHEL uses XFS as its default filesystem, doesn’t support shrinking it. Its comparison sets XFS against ext4, which “supports both extending and reducing the size of a file system.” Even ext4 ",
            {
              a: "shrinks only while unmounted, with resize2fs",
              href: "/learn/resize2fs-shrink-ext4",
            },
            ".",
          ],
        },
      ],
    },
    {
      id: "a-smaller-filesystem-doesnt-make-a-smaller",
      title: "The cloud disk won’t shrink",
      blocks: [
        {
          kind: "p",
          text: "On a cloud VM, you pay for the disk’s provisioned size, whatever the filesystem on it does. To pay less, you’d have to shrink the partition and then the disk.",
        },
        {
          kind: "p",
          text: [
            "Neither cloud shrinks a disk. AWS says “You can’t decrease the volume size.” On Azure, ",
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
      title: "Copy to a smaller filesystem",
      blocks: [
        {
          kind: "p",
          text: "Two tools make the copy:",
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
              " “backs up files and their attributes,” and its man page shows it piped straight into ",
              { code: "xfsrestore" },
              ". The services stay stopped for the whole copy.",
            ],
          ],
        },
        {
          kind: "p",
          text: "Pick rsync to keep the stop short. Pick the pipe when the data is small enough to keep the services stopped for the whole copy.",
        },
        { kind: "h3", id: "the-copy-step-by-step", title: "Step by step" },
        {
          kind: "ol",
          items: [
            [
              "Measure what the mount holds with ",
              { a: { code: "df -Th" }, href: "/learn/glossary/df-vs-du" },
              ", and choose a size with room for growth.",
            ],
            [
              "Create and attach a smaller disk. The guides to ",
              {
                a: "shrink an Azure managed disk",
                href: "/learn/shrink-azure-managed-disk",
              },
              " and ",
              { a: "shrink an EBS volume", href: "/learn/shrink-ebs-volume" },
              " give the cloud steps.",
            ],
            [
              "Check the new disk’s name with ",
              { code: "lsblk" },
              ", so ",
              { code: "mkfs.xfs" },
              " writes to the right device. Then make an XFS filesystem on it and mount it at a temporary path, such as ",
              { code: "/mnt/new" },
              ".",
            ],
            "With rsync, run the first pass now, while the application works. With xfsdump, skip this step.",
          ],
        },
        { kind: "code", lang: "bash", code: "sudo rsync -aHAX /data/ /mnt/new/" },
        {
          kind: "p",
          text: [
            "Archive mode (",
            { code: "-a" },
            ") leaves out hard links, ACLs and extended attributes, so ",
            { code: "-H" },
            ", ",
            { code: "-A" },
            " and ",
            { code: "-X" },
            " add them. The trailing slash on ",
            { code: "/data/" },
            " copies the folder’s contents, not the folder.",
          ],
        },
        {
          kind: "ol",
          start: 5,
          items: [
            "Stop every service that writes to the mount. The downtime starts here.",
            "Run the final copy: the second rsync pass, or the whole xfsdump pipe.",
          ],
        },
        { kind: "code", lang: "bash", code: "sudo rsync -aHAX --delete /data/ /mnt/new/" },
        {
          kind: "p",
          text: [
            { code: "--delete" },
            " removes files from ",
            { code: "/mnt/new" },
            " that are gone from ",
            { code: "/data" },
            ". With xfsdump, run this pipe instead:",
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
        {
          kind: "ol",
          start: 7,
          items: [
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
            "Start the services and check them. The downtime ends here.",
            "Snapshot the old disk, because deleting it can’t be undone.",
            "Detach and delete the old disk. Its charge stops here.",
          ],
        },
        {
          kind: "p",
          text: "The services on that mount are down from step 5 to step 9. You pay for both disks from step 2 to step 11, and for the snapshot until you delete it.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "xfs-shrink-on-lvm-copy-to-a",
      title: "XFS on LVM",
      blocks: [
        {
          kind: "p",
          text: "LVM doesn’t change the answer. Red Hat’s LVM guide says “XFS does not support reducing the size of a volume formatted with an XFS file system.” So copy to a new logical volume (LV) instead.",
        },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            "Never run ",
            { code: "lvreduce" },
            " to take an LV below the size of the XFS filesystem on it. Red Hat warns: “Data stored in the reduced area is lost.”",
          ],
        },
        {
          kind: "ol",
          items: [
            "Create a new, smaller LV from free extents in the volume group or on a disk you add.",
            "Copy the data into it and move the mount, as in steps 3 to 9 above.",
            [
              "Check the copy, because removing the old LV takes its filesystem with it. Then unmount the old LV and run ",
              { code: "lvremove" },
              ".",
            ],
            [
              "To ",
              { a: "take a disk out of the volume group", href: "/learn/remove-disk-from-lvm" },
              ", empty it with ",
              { code: "pvmove" },
              ", which needs free extents on the other disks.",
            ],
            "Detach and delete the emptied disk, as in steps 10 and 11 above. Its charge stops only then.",
          ],
        },
      ],
    },
    {
      id: "what-an-xfs-growfs-shrink-can-give",
      title: "What xfs_growfs -D gives back",
      blocks: [
        {
          kind: "p",
          text: [
            "Since Linux 5.13, one narrow in-place shrink exists. The March 2021 kernel patch calls it “the first step of shrinking.” You run it with ",
            { code: "xfs_growfs -D" },
            " and a size smaller than today’s.",
          ],
        },
        {
          kind: "p",
          text: "The man page states the limit: “Only shrinking the last AG without removing it is implemented.” It adds that a filesystem with only one AG can’t be shrunk.",
        },
        {
          kind: "p",
          text: "Only unused space comes back, and nothing is moved out of the way. If anything sits in the blocks you ask it to drop, the shrink fails.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: [
            "The ",
            { code: "xfs_info" },
            " man page’s example reads ",
            { code: "agcount=8, agsize=5974144 blks" },
            " with a block size of 4,096 bytes. That makes 8\u00a0×\u00a05,974,144\u00a0=\u00a047,793,152 blocks, or 182.3\u00a0GiB, and 22.8\u00a0GiB per AG.",
          ],
        },
        {
          kind: "p",
          text: "The last AG, AG7 (they count from AG0), starts at block 7\u00a0×\u00a05,974,144\u00a0=\u00a041,819,008. Any new size at or below 41,819,008 blocks would remove AG7, and the kernel refuses it.",
        },
        {
          kind: "p",
          text: "So a shrink can give back under 22.8\u00a0GiB of 182.3\u00a0GiB, and only when that tail is empty.",
        },
        { kind: "svg", figure: figure2 },
        { kind: "h3", id: "run-the-shrink", title: "Run the shrink" },
        {
          kind: "p",
          text: "If you still want the filesystem smaller, it takes three steps:",
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
            "Take a backup or a snapshot of the disk first. The shrink runs on the mounted filesystem, and the kernel flags it as experimental.",
            [
              "Run the shrink with the new size in filesystem blocks, the ",
              { code: "bsize" },
              " unit that ",
              { code: "xfs_info" },
              " reports. At 4,096 bytes a block, each GiB you give back is 1,073,741,824\u00a0÷\u00a04,096\u00a0=\u00a0262,144 blocks. In the example, the new size must stay above 41,819,008 blocks.",
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
            ") in November 2026, that comment and that check are still there. A shrink still logs a warning that marks the feature as experimental.",
          ],
        },
      ],
    },
    {
      id: "how-amoeba-handles-an-xfs-data-mount",
      title: "How Amoeba handles XFS",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " rightsizes block storage on Azure managed disks and Amazon EBS without any downtime. It makes this copy for you, once, on the data disks of running Windows and Linux VMs. It never touches the OS disk or root volume.",
          ],
        },
        {
          kind: "p",
          text: "An XFS data mount moves like any other, including one on LVM, when every disk under it is a cloud data disk.",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "The pool." },
              " Amoeba moves a VM’s data disks onto one ",
              { a: "btrfs pool", href: "/learn/btrfs-multiple-disks" },
              ", sized to your data, with room to grow. On Azure the pool uses Premium SSD v2 where your VM’s region and zone offer it, and Premium SSD otherwise. On AWS it uses gp3.",
            ],
            [
              { b: "The move." },
              " Amoeba copies your data while your services run. Then it switches each mount to the pool, with a short restart of the services that use it. If the switch fails, it puts the original mounts back and tries again.",
            ],
            [
              { b: "The old disks." },
              " Once the switch is checked, Amoeba snapshots each old disk, deletes the disk, and keeps the snapshot for 7\u00a0days before deleting it too.",
            ],
            [
              { b: "Cost during the move." },
              " You pay for both sets of disks only while the move runs, then for the snapshots while they’re kept.",
            ],
            [
              { b: "Rightsizing." },
              " Amoeba grows the pool before it fills, and sooner when data arrives fast. When your data goes down and stays down, it shrinks the pool one disk at a time, with ",
              { a: { code: "btrfs device remove" }, href: "/learn/btrfs-device-remove" },
              ". So you pay for close to what you use.",
            ],
          ],
        },
        { kind: "h3", id: "what-the-vm-needs", title: "What the VM needs" },
        { kind: "p", text: "On Linux, the VM needs:" },
        {
          kind: "ul",
          items: [
            "a recent kernel with btrfs, judged on the running kernel, not the OS name",
            "systemd running every service that keeps a data mount open",
            "a few free disk slots for the pool",
          ],
        },
        {
          kind: "p",
          text: "If the kernel has no btrfs, the move pauses and the XFS mount stays where it is. The manual copy above is then the route.",
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
      publisher: "man7.org",
      title: "“rsync(1) - Linux manual page”",
      url: "https://man7.org/linux/man-pages/man1/rsync.1.html",
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
      title: "Shrink ext4 with resize2fs",
      where: "Learn",
      href: "/learn/resize2fs-shrink-ext4",
    },
    {
      title: "Remove a disk from LVM in Linux",
      where: "Learn",
      href: "/learn/remove-disk-from-lvm",
    },
    {
      title: "btrfs device remove",
      where: "Learn",
      href: "/learn/btrfs-device-remove",
    },
    {
      title: "btrfs on multiple disks: single or RAID 1",
      where: "Learn",
      href: "/learn/btrfs-multiple-disks",
    },
  ],
  relatedTitle: "More on shrinking filesystems and disks",
};
