import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/btrfs-unallocated-space/1";

export const article: Article = {
  slug: "btrfs-unallocated-space",
  title: "btrfs unallocated space vs free space, explained",
  meta: "btrfs unallocated space is raw space no chunk holds yet. How it differs from free space, why ENOSPC hits while df shows room, and how balance gives it back.",
  h1: "btrfs unallocated space vs free space, explained",
  deck: "Why btrfs can run out of space while df shows room, and how balance turns allocated space back into unallocated.",
  card: "Unallocated vs free space in btrfs: read filesystem usage, explain ENOSPC with room left, and fix it.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Linux filesystems",
  published: "2026-10-28",
  updated: "2026-10-28",
  author: "sourabh",
  short: [
    "btrfs unallocated space is raw device space that btrfs hasn’t yet handed to any chunk. Free space adds the room left inside chunks already allocated to data. Data chunks can’t hold metadata, so once unallocated space reaches zero and the metadata chunks fill, writes can fail with “No space left on device” while data chunks still have room. A filtered ",
    { code: "btrfs balance" },
    " packs data chunks and returns whole chunks to unallocated.",
  ],
  sections: [
    {
      id: "what-btrfs-unallocated-space-is",
      title: "What btrfs unallocated space is",
      blocks: [
        {
          kind: "p",
          text: "btrfs hands out a device’s raw space in two stages. First the chunk allocator claims a large range, a chunk, for one type of content, and only then does the filesystem place file data or metadata inside it. The docs sometimes use block group for the same unit. Chunks are allocated as they’re needed, which the troubleshooting page calls dynamic chunk allocation.",
        },
        {
          kind: "p",
          text: "There are three types. Data block groups store file data and nothing else. Metadata block groups store the filesystem’s internal metadata in B-trees, and a file small enough to fit the inline limit can sit there too. System block groups, a few megabytes in size, map the physical devices onto the filesystem’s logical space. A data block group is typically 1\u00a0GiB, while a metadata block group is typically 256\u00a0MiB on a filesystem under 50\u00a0GiB and 1\u00a0GiB above that.",
        },
        {
          kind: "p",
          text: "Unallocated space is whatever no block group has claimed yet. It belongs to no type, so it can still become data or metadata. Space goes back to unallocated only when a whole block group is empty, and since kernel 3.18 btrfs deletes an empty block group by itself. A partly used block group keeps its full size, and its free part can take only more of the same type. In the balance documentation’s example, data block groups total 75.81\u00a0GiB with 64.44\u00a0GiB used: about 11\u00a0GiB of room that metadata can’t touch.",
        },
      ],
    },
    {
      id: "how-to-read-btrfs-filesystem-usage",
      title: "How to read btrfs filesystem usage",
      blocks: [
        {
          kind: "p",
          text: [
            { code: "btrfs filesystem usage" },
            " shows both kinds of space in one report. Run it as root, since a regular user sees only the summary.",
          ],
        },
        { kind: "code", lang: "bash", code: "sudo btrfs filesystem usage /mnt/data" },
        {
          kind: "p",
          text: "The btrfs documentation’s own example is a single 1.82\u00a0TiB device:",
        },
        {
          kind: "code",
          lang: "text",
          code: "Overall:\n    Device size:                   1.82TiB\n    Device allocated:              1.17TiB\n    Device unallocated:          669.99GiB\n    Device missing:                  0.00B\n    Device slack:                  1.00GiB\n    Used:                          1.14TiB\n    Free (estimated):            692.57GiB      (min: 692.57GiB)\n    Free (statfs, df)            692.57GiB\n    Data ratio:                       1.00\n    Metadata ratio:                   1.00\n    Global reserve:              512.00MiB      (used: 0.00B)\n    Multiple profiles:                  no\n\nData,single: Size:1.15TiB, Used:1.13TiB (98.26%)\n   /dev/sdb        1.15TiB\n\nMetadata,single: Size:12.00GiB, Used:6.45GiB (53.75%)\n   /dev/sdb       12.00GiB\n\nSystem,single: Size:32.00MiB, Used:144.00KiB (0.44%)\n   /dev/sdb       32.00MiB\n\nUnallocated:\n   /dev/sdb      669.99GiB",
        },
        {
          kind: "p",
          text: "The btrfs unallocated vs free question comes down to two lines. Device unallocated is the space no block group has claimed, 669.99\u00a0GiB here. Free (estimated) is the space still usable for data, and it counts the room inside data block groups as well as the unallocated space. The 22.58\u00a0GiB difference is roughly the gap between the data block groups’ 1.15\u00a0TiB size and the 1.13\u00a0TiB they use.",
        },
        {
          kind: "p",
          text: "Free (statfs, df) is what df prints as Avail. It’s worked out another way and may not match the estimate, for example with more than one profile. Neither figure counts the 5.55\u00a0GiB left inside the metadata block groups, 12.00\u00a0GiB in size with 6.45\u00a0GiB used, since that space is kept for metadata.",
        },
        { kind: "diagram", figure: figure1 },
        {
          kind: "p",
          text: "Device slack is device space the filesystem doesn’t occupy, so when you grow the device under btrfs, the new space shows there until you resize the filesystem. Global reserve is a slice of metadata kept for emergencies such as deleting files on a full filesystem, usually no more than 512\u00a0MiB.",
        },
        {
          kind: "p",
          text: [
            "The ",
            { code: "btrfs filesystem usage" },
            " Unallocated section breaks the figure down per device. Across several disks that matters, because raid1 keeps its two copies on two different devices, so a new raid1 block group needs unallocated space on two of them. ",
            { a: "The guide to btrfs on multiple disks", href: "/learn/btrfs-multiple-disks" },
            " explains the profiles. The older ",
            { code: "btrfs filesystem df" },
            " prints only the per-type lines, and its man page says ",
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
          text: "The “No space left on device” error (ENOSPC) has several causes and no single fix, the troubleshooting page says. Two come from chunk allocation.",
        },
        {
          kind: "p",
          text: [
            "Sometimes data runs out. The troubleshooting page fills a 4.0G filesystem with one file, after which df reports 0 available. ",
            { code: "btrfs filesystem df" },
            " shows data at total=1.98GiB, used=1.98GiB, while metadata has total=1.00GiB with 2.22MiB used. The metadata chunks have room that can’t hold that file’s data, so df is right to call the filesystem full.",
          ],
        },
        {
          kind: "p",
          text: "The other case is the one behind df showing room. Device unallocated reaches zero while the data block groups still have free space, so df’s Avail stays above zero. Then the metadata block groups fill, and with nothing unallocated btrfs can’t create another one, so writes fail with ENOSPC. Since Linux 4.5, df then reports Avail as 0, though Used stays below Size. According to the troubleshooting page, a filesystem whose metadata is exhausted can’t track new data extents, inline files, reflinks or xattrs. Deletion still works.",
        },
        {
          kind: "p",
          text: [
            "To tell them apart, read three lines of ",
            { code: "btrfs filesystem usage" },
            " together:",
          ],
        },
        {
          kind: "ul",
          items: [
            "Device unallocated near zero: nothing left to allocate.",
            "Data Used close to Data Size: the data block groups are full.",
            "Metadata Used plus the global reserve equal to Metadata Size: metadata is exhausted, by the man page’s test GlobalReserve/total + Metadata/used = Metadata/total.",
          ],
        },
        {
          kind: "p",
          text: [
            "The split between types is why mkfs.btrfs offers ",
            { code: "--mixed" },
            ", which keeps data and metadata in the same block groups. Its man page warns that separate block groups reserve space one type can’t use “and can lead to ENOSPC state.” It recommends mixed mode under 1\u00a0GiB, softly under 5\u00a0GiB, and it can only be set when you create the filesystem.",
          ],
        },
      ],
    },
    {
      id: "how-balance-gives-chunks-back-to-unallocated",
      title: "How balance gives chunks back to unallocated space",
      blocks: [
        {
          kind: "p",
          text: "Balance relocates block groups. It usually creates a new block group, moves the old one’s contents there and then removes the old one. With the usage filter it touches only block groups below a fill level you choose, which is how you pack half-empty data block groups and hand whole chunks back to unallocated.",
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
            " limits balance to data block groups, and ",
            { code: "usage=N" },
            " picks those at most N percent used, written straight after the option with no space, as in ",
            { code: "-dusage=10" },
            ". Start small: lightly used block groups have the least data to move. Raise the value only while unallocated space is still short.",
          ],
        },
        {
          kind: "p",
          text: [
            "The balance documentation shows the effect on the example from earlier, 75.81\u00a0GiB of data block groups holding 64.44\u00a0GiB. ",
            { code: "-dusage=50" },
            " relocates 2 of 97 chunks and brings the total to 74.03\u00a0GiB. A second run with ",
            { code: "-dusage=85" },
            " relocates 13 of 95 chunks and takes it to 68.03\u00a0GiB, freeing about 6\u00a0GiB for new data or metadata block groups.",
          ],
        },
        {
          kind: "p",
          text: "Leave metadata block groups alone unless their used and total figures are far apart. Running out of metadata is the more severe problem, the same page says, so metadata needn’t be packed tightly.",
        },
        {
          kind: "p",
          text: [
            "Balance is expensive: the docs call it very IO intensive and possibly quite CPU intensive. It runs only on a mounted filesystem, ",
            { code: "btrfs balance cancel" },
            " stops it, and an interrupted balance resumes at the next mount unless you mount with ",
            { code: "skip_balance" },
            ". Without filters it moves everything, so btrfs-progs warns you and waits a few seconds first.",
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
          text: "Balance has an ENOSPC of its own, which the docs say isn’t the same as free space running out. To relocate a block group, balance first needs work space: device space with no block group on it. A fully allocated filesystem has none, so balance can fail while much of the allocated space sits empty.",
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
        { kind: "p", text: "When it’s too little, work through these in order:" },
        {
          kind: "ol",
          items: [
            [
              "Run ",
              { code: "-dusage=0" },
              " first. It cleans up completely unused block groups without needing work space, and the docs suggest it when balance returns ENOSPC on a filesystem that isn’t too full.",
            ],
            [
              "Delete what you can, then retry ",
              { code: "-dusage=10" },
              ". Deletion works even with metadata exhausted, and removing data can leave whole block groups empty, which btrfs then frees on its own.",
            ],
            [
              "Grow the device. On a cloud VM, expand the disk first, as the ",
              { a: "Azure managed disk", href: "/learn/azure-disk-expand-without-downtime" },
              " and ",
              { a: "Amazon EBS", href: "/learn/increase-ebs-volume-size" },
              " guides explain, and grow the partition if there is one. Then resize the filesystem on that device by its devid from ",
              { code: "btrfs filesystem show" },
              ", since the command resizes devid 1 when you leave it out.",
            ],
            [
              "Add a device for the length of the balance. ",
              { code: "btrfs device add" },
              " is instant and doesn’t touch existing data, and the new device brings unallocated space, so balance gets its work space. With raid1, grow or add two devices.",
            ],
          ],
        },
        { kind: "code", lang: "bash", code: "sudo btrfs filesystem resize <devid>:max /mnt/data" },
        {
          kind: "code",
          lang: "bash",
          code: "sudo btrfs device add /dev/<extra-disk> /mnt/data\nsudo btrfs balance start -dusage=10 /mnt/data",
        },
        {
          kind: "p",
          text: [
            "Taking the extra device out again moves all of its data back onto the others. That can take long, and it fails if the profile needs more devices than would remain, as raid1 does going from two devices to one. Detach and delete the cloud disk only once ",
            { code: "btrfs filesystem show" },
            " no longer lists it, and ",
            { a: "the guide to removing a device", href: "/learn/btrfs-device-remove" },
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
            "On a cloud VM, unallocated space still costs money. Azure bills a managed disk for its provisioned capacity, so space btrfs never allocated is billed too. Nor can the disk shrink to fit: Microsoft says shrinking an existing disk “isn’t supported and might result in data loss,” as ",
            { a: "the managed disk shrink guide", href: "/learn/shrink-azure-managed-disk" },
            " explains. Across several disks, you give space back by emptying one disk, taking it out of the filesystem and deleting it.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            ", Zoorik’s block storage optimization for Azure and AWS, builds this layout: one btrfs pool per VM, started on at least 2 data disks of equal size, each data mount a subvolume at its old path. Amoeba sizes the pool from the highest use of the last 7\u00a0days, so it sits inside its target band with room for the largest recent 15-minute rise and at least 10\u00a0GiB free. These rules keep it short of full:",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "The band." },
              " Amoeba holds each pool inside a target band, 80% to 90% full by default.",
            ],
            [
              { b: "The floor." },
              " When free space falls below 5% of the pool or 10\u00a0GiB, whichever is larger, or the last 10\u00a0minutes’ fill rate would reach that within 30\u00a0minutes, Amoeba expands at once.",
            ],
            [
              { b: "The drain." },
              " A shrink takes one disk at a time. The agent moves its data onto the others with ",
              { code: "btrfs device remove" },
              ", and Amoeba detaches and deletes the empty disk, with no snapshot.",
            ],
            [
              { b: "The stops." },
              " Amoeba never detaches and deletes a disk while the pool is at or above the band’s top edge, or while an urgent expand runs.",
            ],
          ],
        },
        {
          kind: "p",
          text: "Shrinks start only after the move is done and a full 7\u00a0days of data have been collected.",
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
