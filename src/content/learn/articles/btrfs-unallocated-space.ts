import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/btrfs-unallocated-space/1";
import { figure as figure2 } from "@/features/learn/figures/btrfs-unallocated-space/2";
import { figure as figure3 } from "@/features/learn/figures/btrfs-unallocated-space/3";

export const article: Article = {
  slug: "btrfs-unallocated-space",
  title: "btrfs balance and unallocated space",
  meta: "What btrfs unallocated space is, why writes fail with “No space left on device” while df shows room, and how btrfs balance gives it back.",
  h1: "btrfs unallocated vs free space",
  deck: "Why writes fail while df shows room, and how a filtered balance gives the space back.",
  card: "Read btrfs filesystem usage, see why writes fail with room left, and get space back with balance.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Linux filesystems",
  published: "2026-10-28",
  updated: "2026-11-03",
  author: "sourabh",
  cover: "/learn-covers/zoorik-learn-btrfs-unallocated-space-1200x630.webp",
  coverAlt: "Free space covers the unallocated end and the unused room just before it",
  short: [
    "Unallocated space is device space no block group (chunk) holds yet, so it can still become data or metadata. Free space also counts the empty room inside data block groups, which only file data can use. When nothing is unallocated and metadata fills, writes fail with “No space left on device” despite that room. A filtered ",
    { code: "btrfs balance" },
    " packs data block groups and returns whole ones to unallocated.",
  ],
  sections: [
    {
      id: "btrfs-unallocated-space-is-room-no-chunk",
      title: "What unallocated space is",
      blocks: [
        {
          kind: "p",
          text: "btrfs hands out space in two steps. First it allocates a block group: a large range of the device for one type of content. Then it places data or metadata inside it. The docs also call a block group a chunk.",
        },
        { kind: "p", text: "There are three types:" },
        {
          kind: "ul",
          items: [
            [{ b: "Data." }, " File data only. A data block group is typically 1 GiB."],
            [
              { b: "Metadata." },
              " The filesystem’s records, kept in B-trees. A very small file can sit inline here. A metadata block group is typically 256 MiB on a filesystem under 50 GiB, and 1 GiB above.",
            ],
            [
              { b: "System." },
              " These map the physical devices onto the filesystem’s logical space. A system block group is a few megabytes.",
            ],
          ],
        },
        {
          kind: "p",
          text: "Unallocated space is device space no block group holds yet. It belongs to no type, so it can still become data or metadata.",
        },
        {
          kind: "p",
          text: "Space returns to unallocated only when a whole block group is empty. Since kernel 3.18, btrfs removes empty block groups by itself.",
        },
        {
          kind: "p",
          text: "A partly used block group keeps its full size, and its free room takes only its own type. In the balance docs’ example, data block groups total 75.81 GiB with 64.44 GiB used. The 11.37 GiB between them is room only file data can use.",
        },
        {
          kind: "p",
          text: [
            "On a cloud VM, unallocated space still costs money. Azure charges a ",
            { a: "managed disk", href: "/learn/glossary/azure-managed-disk" },
            " for its provisioned size, so you pay for space btrfs never allocated.",
          ],
        },
      ],
    },
    {
      id: "how-to-read-unallocated-vs-free-space",
      title: "Read btrfs filesystem usage",
      blocks: [
        {
          kind: "p",
          text: [
            { code: "btrfs filesystem usage" },
            " shows both kinds of space. Run it as root: only root sees the breakdown by block group type.",
          ],
        },
        { kind: "code", lang: "bash", code: "sudo btrfs filesystem usage /mnt/data" },
        { kind: "p", text: "The docs’ example is one 1.82 TiB device:" },
        {
          kind: "code",
          lang: "text",
          code: "Overall:\n    Device size:                   1.82TiB\n    Device allocated:              1.17TiB\n    Device unallocated:          669.99GiB\n    Device missing:                  0.00B\n    Device slack:                  1.00GiB\n    Used:                          1.14TiB\n    Free (estimated):            692.57GiB      (min: 692.57GiB)\n    Free (statfs, df)            692.57GiB\n    Data ratio:                       1.00\n    Metadata ratio:                   1.00\n    Global reserve:              512.00MiB      (used: 0.00B)\n    Multiple profiles:                  no\n\nData,single: Size:1.15TiB, Used:1.13TiB (98.26%)\n   /dev/sdb        1.15TiB\n\nMetadata,single: Size:12.00GiB, Used:6.45GiB (53.75%)\n   /dev/sdb       12.00GiB\n\nSystem,single: Size:32.00MiB, Used:144.00KiB (0.44%)\n   /dev/sdb       32.00MiB\n\nUnallocated:\n   /dev/sdb      669.99GiB",
        },
        { kind: "p", text: "Two lines answer the question:" },
        {
          kind: "ul",
          items: [
            [{ b: "Device unallocated" }, " is the space no block group holds."],
            [
              { b: "Free (estimated)" },
              " is the space still usable for data: the room inside data block groups plus the unallocated space.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Free (statfs, ",
            { a: "df", href: "/learn/glossary/df-vs-du" },
            ") is what df prints as Avail. It comes from the statfs system call and can differ from the estimate, for example with more than one profile.",
          ],
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "Here Device unallocated is 669.99 GiB and both free lines read 692.57 GiB. The 22.58 GiB difference is roughly the room left inside the data block groups: their 1.15 TiB size minus the 1.13 TiB they use.",
        },
        {
          kind: "p",
          text: "The metadata block groups have 12.00 − 6.45 = 5.55 GiB free. Neither free line counts it, since only metadata can use it.",
        },
        { kind: "svg", figure: figure1 },
        { kind: "p", text: "Two more lines:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Device slack" },
              " is device space the filesystem doesn’t occupy. After you grow a device, the new space shows here until you resize the filesystem.",
            ],
            [
              { b: "Global reserve" },
              " is a slice of metadata kept for emergencies, such as deleting files on a full filesystem. It is usually no more than 512 MiB.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "The Unallocated section lists each device’s share. That matters on several disks, since a new raid1 block group needs unallocated space on two devices. ",
            { a: "btrfs on multiple disks", href: "/learn/btrfs-multiple-disks" },
            " explains the profiles.",
          ],
        },
        {
          kind: "p",
          text: [
            "The older ",
            { code: "btrfs filesystem df" },
            " prints only the per-type lines. ",
            { code: "btrfs filesystem usage" },
            " is meant to replace it.",
          ],
        },
      ],
    },
    {
      id: "why-btrfs-says-no-space-left-on",
      title: "No space left on device",
      blocks: [
        {
          kind: "p",
          text: "This error, ENOSPC, has several causes and no single fix. Two come from how btrfs allocates block groups.",
        },
        {
          kind: "h3",
          id: "when-the-data-block-groups-are-full",
          title: "Data block groups full",
        },
        {
          kind: "p",
          text: [
            "This is the plain case, and df is right. The troubleshooting page fills a 4.0G filesystem with one file, and df then shows 0 available. ",
            { code: "btrfs filesystem df" },
            " shows data at total=1.98GiB, used=1.98GiB. Metadata still has room (total=1.00GiB, used=2.22MiB), but it can’t take file data.",
          ],
        },
        {
          kind: "h3",
          id: "when-metadata-fills-with-nothing-unallocated",
          title: "Metadata full",
        },
        {
          kind: "p",
          text: "Device unallocated reaches zero while the data block groups still have room. Then the metadata block groups fill. With nothing unallocated, btrfs can’t create another one, so writes fail with ENOSPC.",
        },
        {
          kind: "p",
          text: "Before Linux 4.5, df still showed Avail above zero here. Since 4.5 it shows Avail as 0, and the room shows only as the gap between Used and Size.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: "With metadata full, btrfs can’t track new data, or store small inline files, reflinks or extended attributes (xattrs). Deletion still works.",
        },
        {
          kind: "p",
          text: [
            "On a small filesystem, mkfs.btrfs ",
            { code: "--mixed" },
            " keeps data and metadata in the same block groups. Its man page recommends it under 1 GiB and suggests it under 5 GiB. You can set it only when you create the filesystem.",
          ],
        },
        { kind: "h3", id: "how-to-tell-the-cases-apart", title: "Tell the cases apart" },
        {
          kind: "p",
          text: ["Read ", { code: "btrfs filesystem usage" }, " and act on what it shows:"],
        },
        {
          kind: "table",
          columns: [
            { label: "What you see", width: "48%" },
            { label: "What it means", width: "14%" },
            { label: "What to do", width: "38%" },
          ],
          rows: [
            [
              "Device unallocated near zero, and Data Used close to Data Size",
              "Data is full",
              "Delete data or grow the device (steps 2 and 3 below). A data balance has nothing to pack",
            ],
            [
              "Device unallocated near zero, room left in data, and Metadata Used plus Global reserve equal to Metadata Size",
              "Metadata is full",
              "Run a filtered balance (next section)",
            ],
            [
              [{ code: "btrfs balance" }, " itself fails with ENOSPC"],
              "No work space",
              "Make work space (steps below), in order",
            ],
          ],
        },
      ],
    },
    {
      id: "a-filtered-balance-packs-data-block-groups",
      title: "Run a filtered balance",
      blocks: [
        {
          kind: "p",
          text: "Balance relocates block groups. It usually creates a new block group, moves the old one’s contents there, then removes the old one. The usage filter limits it to block groups below a fill level you choose.",
        },
        {
          kind: "code",
          lang: "bash",
          code: "sudo btrfs balance start -dusage=0 /mnt/data\nsudo btrfs balance start -dusage=10 /mnt/data\nsudo btrfs balance status /mnt/data",
        },
        {
          kind: "p",
          text: [
            { code: "-d" },
            " limits balance to data block groups. ",
            { code: "usage=N" },
            " picks those at most N percent used. Write it right after the option, with no space: ",
            { code: "-dusage=10" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "Start small, with ",
            { code: "-dusage=0" },
            " and then ",
            { code: "-dusage=10" },
            ". Lightly used block groups have the least data to move. Raise the value only while Device unallocated stays near zero.",
          ],
        },
        {
          kind: "p",
          text: [
            "The docs’ example starts higher, on data block groups about 85% full on average (64.44 / 75.81). A pass with ",
            { code: "-dusage=50" },
            " relocates 2 block groups, and a pass with ",
            { code: "-dusage=85" },
            " relocates 13. The data total falls to 68.03 GiB, so 75.81 − 68.03 = 7.78 GiB goes back to unallocated.",
          ],
        },
        { kind: "svg", figure: figure3 },
        {
          kind: "p",
          text: "Leave metadata block groups alone unless their used and total figures are far apart. Running out of metadata is the worse problem, so metadata needn’t be packed tight.",
        },
        {
          kind: "p",
          text: "Balance is heavy: the docs call it very IO intensive and possibly quite CPU intensive. Also:",
        },
        {
          kind: "ul",
          items: [
            "It runs only on a mounted filesystem.",
            [{ code: "btrfs balance cancel" }, " stops it."],
            [
              "An interrupted balance resumes at the next mount, unless you mount with ",
              { code: "skip_balance" },
              ".",
            ],
            "Without filters it moves everything, so btrfs-progs warns you and waits a few seconds first.",
          ],
        },
      ],
    },
    {
      id: "what-to-do-when-btrfs-balance-says",
      title: "When balance fails with ENOSPC",
      blocks: [
        {
          kind: "p",
          text: "To relocate a block group, balance needs work space: device space with no block group on it. A fully allocated filesystem has none, so balance can fail while allocated space sits empty.",
        },
        {
          kind: "p",
          text: [
            "Check it with ",
            { code: "btrfs filesystem show" },
            ": size minus used is each device’s work space. In the docs’ example, two devices each read size 53.90GiB used 51.90GiB, so each has 2.00 GiB.",
          ],
        },
        { kind: "code", lang: "bash", code: "sudo btrfs filesystem show /mnt/data" },
        { kind: "h3", id: "four-ways-to-make-work-space", title: "Make work space" },
        { kind: "p", text: "When it’s too little, try these in order:" },
        {
          kind: "ol",
          items: [
            [
              { b: "Clear empty block groups." },
              " Run ",
              { code: "-dusage=0" },
              ". It cleans up unused block groups without needing work space. The docs suggest it when balance returns ENOSPC on a filesystem that isn’t too full. If btrfs already removed them, it finds none.",
            ],
            [
              { b: "Delete what you can." },
              " Then retry ",
              { code: "-dusage=10" },
              ". Deletion works even with metadata full, and it can leave whole block groups empty, which btrfs then frees.",
            ],
            [
              { b: "Grow the device." },
              " On a cloud VM, expand the disk first, as the ",
              { a: "Azure managed disk", href: "/learn/azure-disk-expand-without-downtime" },
              " and ",
              { a: "Amazon EBS", href: "/learn/increase-ebs-volume-size" },
              " guides explain. Grow the partition too, if there is one. Then resize the filesystem on that device by its device ID (devid) from ",
              { code: "btrfs filesystem show" },
              ". Without a devid, the command resizes devid 1.",
            ],
          ],
        },
        { kind: "code", lang: "bash", code: "sudo btrfs filesystem resize <devid>:max /mnt/data" },
        {
          kind: "ol",
          start: 4,
          items: [
            [
              { b: "Add a temporary device." },
              " ",
              { code: "btrfs device add" },
              " is instant and doesn’t touch existing data. The new device brings unallocated space for balance to work in. With raid1, grow or add two devices.",
            ],
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "sudo btrfs device add /dev/<extra-disk> /mnt/data\nsudo btrfs balance start -dusage=10 /mnt/data",
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "Taking the extra device out moves all its data back onto the others, which can take a long time. It fails if the profile needs more devices than would remain, as raid1 does going from two to one.",
        },
        {
          kind: "p",
          text: [
            "Take it out with ",
            { code: "btrfs device remove" },
            ". Detach and delete the cloud disk only once ",
            { code: "btrfs filesystem show" },
            " no longer lists it. ",
            { a: "The guide to removing a device", href: "/learn/btrfs-device-remove" },
            " has the full steps.",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "sudo btrfs device remove /dev/<extra-disk> /mnt/data",
        },
      ],
    },
    {
      id: "how-the-amoeba-pool-keeps-room-free",
      title: "How Amoeba keeps room free",
      blocks: [
        {
          kind: "p",
          text: [
            "Microsoft says ",
            { a: "shrinking a managed disk", href: "/learn/shrink-azure-managed-disk" },
            " “isn’t supported and might result in data loss.” With several disks, you give space back by emptying one disk, taking it out of the filesystem and deleting it.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " does this for you, without any downtime. It works on the data disks of running VMs: Azure managed disks and Amazon EBS volumes, on Windows and Linux VMs. It never touches the OS disk or root volume.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "The pool." },
              " Amoeba moves a VM’s data disks onto one btrfs pool sized to your data, with room to grow. Each data mount becomes a subvolume at its old path.",
            ],
            [
              { b: "Growing." },
              " It grows the pool while it stays mounted, before it fills, and sooner when data arrives fast. It also adds room when too little unallocated space is left for new metadata.",
            ],
            [
              { b: "Shrinking." },
              " When your data goes down and stays down, it shrinks the pool one disk at a time. ",
              { code: "btrfs device remove" },
              " moves that disk’s data onto the others, then Amoeba detaches the empty disk and deletes it. It never takes a disk out while the pool is nearly full or must grow fast.",
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
      publisher: "BTRFS documentation",
      title: "“btrfs-filesystem(8)”",
      url: "https://btrfs.readthedocs.io/en/latest/btrfs-filesystem.html",
    },
    {
      publisher: "BTRFS documentation",
      title: "“btrfs-balance(8)”",
      url: "https://btrfs.readthedocs.io/en/latest/btrfs-balance.html",
    },
    {
      publisher: "BTRFS documentation",
      title: "“Troubleshooting pages”",
      url: "https://btrfs.readthedocs.io/en/latest/trouble-index.html",
    },
    {
      publisher: "BTRFS documentation",
      title: "“mkfs.btrfs(8)”",
      url: "https://btrfs.readthedocs.io/en/latest/mkfs.btrfs.html",
    },
    {
      publisher: "BTRFS documentation",
      title: "“btrfs-device(8)”",
      url: "https://btrfs.readthedocs.io/en/latest/btrfs-device.html",
    },
    {
      publisher: "Linux kernel source tree",
      title: "“btrfs: statfs: report zero available if metadata are exhausted”",
      url: "https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=ca8a51b3a979d57b082b14eda38602b7f52d81d1",
      note: " (merged for 4.5)",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Understand Azure Disk Storage billing”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-understand-billing",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Expand virtual hard disks on a Linux VM”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/linux/expand-disks",
    },
  ],
  related: [
    {
      title: "btrfs on multiple disks: single or RAID 1",
      where: "Learn",
      href: "/learn/btrfs-multiple-disks",
    },
    {
      title: "btrfs device remove",
      where: "Learn",
      href: "/learn/btrfs-device-remove",
    },
    {
      title: "Can you shrink an Azure managed disk?",
      where: "Learn",
      href: "/learn/shrink-azure-managed-disk",
    },
    {
      title: "btrfs vs ext4 vs XFS: which can shrink?",
      where: "Learn",
      href: "/learn/btrfs-vs-lvm",
    },
  ],
  relatedTitle: "More on btrfs and disk space",
};
