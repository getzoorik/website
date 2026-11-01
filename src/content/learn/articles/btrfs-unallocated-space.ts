import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/btrfs-unallocated-space/1";
import { figure as figure2 } from "@/features/learn/figures/btrfs-unallocated-space/2";
import { figure as figure3 } from "@/features/learn/figures/btrfs-unallocated-space/3";

export const article: Article = {
  slug: "btrfs-unallocated-space",
  title: "btrfs balance: unallocated vs free space explained",
  meta: "btrfs unallocated space is room no chunk holds yet. How it differs from free space, why writes fail while df shows room, and how btrfs balance gives it back.",
  h1: "btrfs balance and unallocated space vs free space, explained",
  deck: "Why btrfs can run out of space while df shows room, and how btrfs balance turns allocated space back into unallocated.",
  card: "Unallocated vs free space in btrfs: read filesystem usage, explain ENOSPC with room left, and fix it.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Linux filesystems",
  published: "2026-10-28",
  updated: "2026-11-01",
  author: "sourabh",
  cover: "/learn-covers/zoorik-learn-btrfs-unallocated-space-1200x630.webp",
  coverAlt:
    "btrfs unallocated space: free covers the unallocated end and the unused room just before it",
  short: [
    "btrfs unallocated space is raw device space no chunk holds yet, and free space also counts the room inside data chunks. Data chunks can’t hold metadata, so once nothing is unallocated and metadata fills, writes can fail with “No space left on device” despite that room. A filtered ",
    { code: "btrfs balance" },
    " packs data chunks and returns whole chunks to unallocated.",
  ],
  sections: [
    {
      id: "btrfs-unallocated-space-is-room-no-chunk",
      title: "btrfs unallocated space is room no chunk has claimed yet",
      blocks: [
        {
          kind: "p",
          text: "Picture a btrfs data disk that refuses writes for lack of space while gigabytes still sit free inside it. That free room has been set aside for file data, and the write needs room for metadata.",
        },
        {
          kind: "p",
          text: "btrfs hands out a device’s raw space in two stages. First the chunk allocator claims a large range, called a chunk, for one type of content. Only then does the filesystem place file data or metadata inside it.",
        },
        {
          kind: "p",
          text: "The docs also call a chunk a block group, and this guide says block group from here on. Allocation is dynamic: btrfs creates a block group only when it’s needed.",
        },
        { kind: "p", text: "There are three types:" },
        {
          kind: "ul",
          items: [
            [{ b: "Data." }, " File data only, typically 1\u00a0GiB per block group."],
            [
              { b: "Metadata." },
              " The filesystem’s internal records, kept in search trees (B-trees), where a very small file can also sit inline. Metadata block groups are typically 256\u00a0MiB on a filesystem under 50\u00a0GiB and 1\u00a0GiB above that.",
            ],
            [
              { b: "System." },
              " Block groups a few megabytes in size that map the physical devices onto the filesystem’s logical space.",
            ],
          ],
        },
        {
          kind: "p",
          text: "Unallocated space is whatever no block group has claimed yet. It belongs to no type, so it can still become data or metadata.",
        },
        {
          kind: "p",
          text: "Space goes back to unallocated only when a whole block group is empty. Since kernel 3.18, btrfs deletes an empty block group by itself.",
        },
        {
          kind: "p",
          text: "A partly used block group keeps its full size, and its free part can take only more of the same type. In the balance documentation’s example, data block groups total 75.81\u00a0GiB, with 64.44\u00a0GiB used. So 75.81 − 64.44 = 11.37\u00a0GiB inside them is room that only file data can use.",
        },
        {
          kind: "p",
          text: [
            "On a cloud VM, unallocated space still costs money. Azure charges for a ",
            { a: "managed disk", href: "/learn/glossary/azure-managed-disk" },
            "’s provisioned capacity, so you pay for space btrfs never allocated too.",
          ],
        },
      ],
    },
    {
      id: "how-to-read-unallocated-vs-free-space",
      title: "How to read unallocated vs free space in btrfs filesystem usage",
      blocks: [
        {
          kind: "p",
          text: [
            { code: "btrfs filesystem usage" },
            " shows both kinds of space in one report. Only root sees its breakdown by block group type, so run it with sudo.",
          ],
        },
        { kind: "code", lang: "bash", code: "sudo btrfs filesystem usage /mnt/data" },
        { kind: "p", text: "The btrfs documentation’s example is a single 1.82\u00a0TiB device:" },
        {
          kind: "code",
          lang: "text",
          code: "Overall:\n    Device size:                   1.82TiB\n    Device allocated:              1.17TiB\n    Device unallocated:          669.99GiB\n    Device missing:                  0.00B\n    Device slack:                  1.00GiB\n    Used:                          1.14TiB\n    Free (estimated):            692.57GiB      (min: 692.57GiB)\n    Free (statfs, df)            692.57GiB\n    Data ratio:                       1.00\n    Metadata ratio:                   1.00\n    Global reserve:              512.00MiB      (used: 0.00B)\n    Multiple profiles:                  no\n\nData,single: Size:1.15TiB, Used:1.13TiB (98.26%)\n   /dev/sdb        1.15TiB\n\nMetadata,single: Size:12.00GiB, Used:6.45GiB (53.75%)\n   /dev/sdb       12.00GiB\n\nSystem,single: Size:32.00MiB, Used:144.00KiB (0.44%)\n   /dev/sdb       32.00MiB\n\nUnallocated:\n   /dev/sdb      669.99GiB",
        },
        { kind: "p", text: "Two lines in that report answer the question:" },
        {
          kind: "ul",
          items: [
            [{ b: "Device unallocated" }, " is the space no block group has claimed."],
            [
              { b: "Free (estimated)" },
              " counts what’s still usable for data: the room inside data block groups plus the unallocated space.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Free (statfs, ",
            { a: "df", href: "/learn/glossary/df-vs-du" },
            ") is what df prints as Avail. It comes from the statfs system call and may not match the estimate, for example with more than one profile.",
          ],
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "Here Device unallocated reads 669.99\u00a0GiB and both free lines read 692.57\u00a0GiB. That 692.57 − 669.99 = 22.58\u00a0GiB difference is roughly what’s left inside the data block groups. It’s the gap between their 1.15\u00a0TiB size and the 1.13\u00a0TiB they use.",
        },
        {
          kind: "p",
          text: "The metadata block groups keep 12.00 − 6.45 = 5.55\u00a0GiB free, and neither free figure counts it. That space is kept for metadata.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: "Device slack is device space the filesystem doesn’t occupy. When you grow the device under btrfs, the new space shows there until you resize the filesystem.",
        },
        {
          kind: "p",
          text: "Global reserve is a slice of metadata kept for emergencies such as deleting files on a full filesystem, usually no more than 512\u00a0MiB.",
        },
        {
          kind: "p",
          text: [
            "The ",
            { code: "btrfs filesystem usage" },
            " Unallocated section breaks the figure down per device. That matters across several disks, because raid1 keeps its two copies on two different devices. So a new raid1 block group needs unallocated space on two of them.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "The guide to btrfs on multiple disks", href: "/learn/btrfs-multiple-disks" },
            " explains the profiles. The older ",
            { code: "btrfs filesystem df" },
            " prints only the per-type lines, and ",
            { code: "btrfs filesystem usage" },
            " is meant to replace it.",
          ],
        },
      ],
    },
    {
      id: "why-btrfs-says-no-space-left-on",
      title: "Why btrfs says no space left on device while df shows room",
      blocks: [
        {
          kind: "p",
          text: "The “No space left on device” error (ENOSPC) has several causes and no single fix. Two come from how block groups are allocated, and the first is the plain case, where df is right.",
        },
        {
          kind: "h3",
          id: "when-the-data-block-groups-are-full",
          title: "When the data block groups are full",
        },
        {
          kind: "p",
          text: [
            "Fill a 4.0G filesystem with one file, as the troubleshooting page does, and df then reports 0 available. ",
            { code: "btrfs filesystem df" },
            " shows data at total=1.98GiB, used=1.98GiB, while metadata has total=1.00GiB with 2.22MiB used. Metadata still has room, but none of it can take file data.",
          ],
        },
        {
          kind: "h3",
          id: "when-metadata-fills-with-nothing-unallocated",
          title: "When metadata fills with nothing unallocated",
        },
        {
          kind: "p",
          text: "This is the case behind df showing room. Device unallocated reaches zero while the data block groups still have free space. Then the metadata block groups fill, and with nothing unallocated, btrfs can’t create another one, so writes fail with ENOSPC.",
        },
        {
          kind: "p",
          text: "Before Linux 4.5, df kept showing Avail above zero here. Since 4.5 it reports Avail as 0, and the room shows only as Used below Size.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: "Once metadata runs out, btrfs can’t record where new data sits, or store small inline files, reflinked copies or extended attributes (xattrs). Deletion still works.",
        },
        {
          kind: "p",
          text: [
            "The split between types is why mkfs.btrfs offers ",
            { code: "--mixed" },
            ", which keeps data and metadata in the same block groups. Its man page warns that separate block groups reserve space one type can’t use “and can lead to ENOSPC state.”",
          ],
        },
        {
          kind: "p",
          text: "It recommends mixed mode under 1\u00a0GiB and suggests it, more loosely, under 5\u00a0GiB. You can set it only when you create the filesystem.",
        },
        { kind: "h3", id: "how-to-tell-the-cases-apart", title: "How to tell the cases apart" },
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
              "The data block groups are full",
              "Delete data or grow the device (steps 2 and 3 of the balance ENOSPC section below). A data balance finds nothing to pack",
            ],
            [
              "Device unallocated near zero, room left in data, and Metadata Used plus Global reserve equal to Metadata Size (the man page’s test: GlobalReserve/total + Metadata/used = Metadata/total)",
              "Metadata is exhausted",
              "Run the filtered balance in the next section",
            ],
            [
              [{ code: "btrfs balance" }, " itself fails with ENOSPC"],
              "Balance has no work space",
              "Work through the steps in the balance ENOSPC section below, in order",
            ],
          ],
        },
      ],
    },
    {
      id: "a-filtered-balance-packs-data-block-groups",
      title:
        "A filtered balance with -dusage packs data block groups and returns their space to unallocated",
      blocks: [
        {
          kind: "p",
          text: "Balance relocates block groups. It usually creates a new block group, moves the old one’s contents there and then removes the old one. With the usage filter it touches only block groups below a fill level you choose.",
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
            " picks those at most N percent used. Write it straight after the option with no space, as in ",
            { code: "-dusage=10" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "Start small, at ",
            { code: "-dusage=0" },
            " and then ",
            { code: "-dusage=10" },
            ", since lightly used block groups have the least data to move. Raise the value only while Device unallocated stays near zero.",
          ],
        },
        {
          kind: "p",
          text: [
            "The documentation’s example starts higher, on data block groups about 85% full on average (64.44 / 75.81 = 0.85). A pass with ",
            { code: "-dusage=50" },
            " relocates 2 block groups and brings the data total from 75.81\u00a0GiB to 74.03\u00a0GiB.",
          ],
        },
        {
          kind: "p",
          text: [
            "Raising the filter to ",
            { code: "-dusage=85" },
            " relocates 13 block groups and takes it to 68.03\u00a0GiB. That frees about 6\u00a0GiB for new data or metadata block groups.",
          ],
        },
        {
          kind: "p",
          text: "Data used barely moves, to 64.43\u00a0GiB. Across both passes, 75.81 − 68.03 = 7.78\u00a0GiB goes back to unallocated.",
        },
        { kind: "svg", figure: figure3 },
        {
          kind: "p",
          text: "Leave metadata block groups alone unless their used and total figures are far apart. Running out of metadata is the more severe problem, so metadata needn’t be packed tightly.",
        },
        {
          kind: "p",
          text: "Balance is expensive: the docs call it very IO intensive and possibly quite CPU intensive. Also:",
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
      title: "What to do when btrfs balance says no space left on device",
      blocks: [
        {
          kind: "p",
          text: "Balance has an ENOSPC of its own, and it isn’t the same as free space running out. To relocate a block group, balance first needs work space: device space with no block group on it.",
        },
        {
          kind: "p",
          text: "A fully allocated filesystem has none. Balance can then fail while much of the allocated space sits empty.",
        },
        {
          kind: "p",
          text: [
            "Check the work space with ",
            { code: "btrfs filesystem show" },
            ", where size minus used for each device is its free work space. In the documentation’s example, two devices each read size 53.90GiB used 51.90GiB, leaving 2.00\u00a0GiB of work space on each.",
          ],
        },
        { kind: "code", lang: "bash", code: "sudo btrfs filesystem show /mnt/data" },
        { kind: "h3", id: "four-ways-to-make-work-space", title: "Four ways to make work space" },
        { kind: "p", text: "When it’s too little, work through these in order:" },
        {
          kind: "ol",
          items: [
            [
              { b: "Clear empty block groups." },
              " Run ",
              { code: "-dusage=0" },
              ", which cleans up completely unused block groups without needing work space. The docs suggest it when balance returns ENOSPC on a filesystem that isn’t too full. If btrfs has already removed them itself, the pass finds none.",
            ],
            [
              { b: "Delete what you can." },
              " Then retry ",
              { code: "-dusage=10" },
              ". Deletion works even with metadata exhausted, and removing data can leave whole block groups empty, which btrfs then frees on its own.",
            ],
            [
              { b: "Grow the device." },
              " On a cloud VM, expand the disk first, as the ",
              { a: "Azure managed disk", href: "/learn/azure-disk-expand-without-downtime" },
              " and ",
              { a: "Amazon EBS", href: "/learn/increase-ebs-volume-size" },
              " guides explain. Grow the partition too, if there is one. Then resize the filesystem on that device by its device ID (devid) from ",
              { code: "btrfs filesystem show" },
              ", since without it the command resizes devid 1.",
            ],
          ],
        },
        { kind: "code", lang: "bash", code: "sudo btrfs filesystem resize <devid>:max /mnt/data" },
        {
          kind: "ol",
          start: 4,
          items: [
            [
              { b: "Add a device for the length of the balance." },
              " ",
              { code: "btrfs device add" },
              " is instant and doesn’t touch existing data. The new device brings unallocated space, so balance gets its work space. With raid1, grow or add two devices.",
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
          text: "Taking the extra device out again moves all of its data back onto the others. That can take a long time. It fails if the profile needs more devices than would remain, as raid1 does going from two devices to one.",
        },
        {
          kind: "p",
          text: [
            "Detach and delete the cloud disk only once ",
            { code: "btrfs filesystem show" },
            " no longer lists it. ",
            { a: "The guide to removing a device", href: "/learn/btrfs-device-remove" },
            " has the whole procedure.",
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
      title: "How the Amoeba pool keeps room free",
      blocks: [
        {
          kind: "p",
          text: [
            "A managed disk can’t shrink to fit its data. Microsoft says shrinking an existing disk “isn’t supported and might result in data loss,” as the guide on ",
            { a: "how to reduce Azure disk size", href: "/learn/shrink-azure-managed-disk" },
            " explains. Across several disks, you give space back by emptying one disk, taking it out of the filesystem and deleting it.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " optimizes block storage. It works on the data disks of running VMs: Azure managed disks and Amazon EBS volumes, on Windows and Linux VMs. It never touches the OS disk or root volume.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "The pool." },
              " Amoeba moves a VM’s data disks onto one btrfs pool, sized to your data, with room to grow. Each data mount becomes a subvolume at its old path.",
            ],
            [
              { b: "Growing." },
              " Amoeba grows the pool while it stays mounted, before it fills, and sooner when data arrives fast. It also watches unallocated space. When too little is left for new metadata, it adds room to the pool.",
            ],
            [
              { b: "Shrinking." },
              " When your data goes down and stays down, Amoeba shrinks the pool one disk at a time. It moves that disk’s data onto the others with ",
              { code: "btrfs device remove" },
              ", then detaches the empty disk and deletes it. So you pay for close to what you use.",
            ],
            [
              { b: "Safe shrinks." },
              " Amoeba never takes a disk out while the pool is nearly full, or while it’s growing the pool.",
            ],
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
      title: "btrfs on multiple disks: how a btrfs pool works",
      where: "Learn",
      href: "/learn/btrfs-multiple-disks",
    },
    {
      title: "btrfs device remove: take a disk out of a btrfs pool",
      where: "Learn",
      href: "/learn/btrfs-device-remove",
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
