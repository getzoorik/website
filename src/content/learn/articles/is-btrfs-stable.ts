import type { Article } from "@/content/learn/article";

export const article: Article = {
  slug: "is-btrfs-stable",
  title: "Is btrfs stable in 2026? Feature by feature",
  meta: "Is btrfs stable in 2026? What the official status table marks OK, mostly OK and unstable, why RAID5/6 stays out of production, and how to watch a pool.",
  h1: "Is btrfs stable in 2026?",
  deck: "The official status table, read feature by feature, and what to check before you trust btrfs with data.",
  card: "What the btrfs status table marks OK, mostly OK and unstable, and why RAID5/6 is the one to avoid.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Linux filesystems",
  published: "2026-11-21",
  updated: "2026-11-21",
  author: "sourabh",
  short:
    "btrfs is stable for its core features, and the answer to “is btrfs stable” depends mostly on the profile you pick. btrfs’s own status table, based on Linux kernel 7.3, marks subvolumes, snapshots, compression, checksums, scrub, balance, resize and the single, DUP, RAID0, RAID1, RAID1C3, RAID1C4 and RAID10 profiles as OK. RAID5 and RAID6 are the exceptions, marked unstable and not for production, and a few features are marked mostly OK, quotas among them.",
  sections: [
    {
      id: "how-to-read-the-btrfs-status-page",
      title: "How to read the btrfs status page",
      blocks: [
        {
          kind: "p",
          text: "The btrfs documentation keeps one page for btrfs stability: a table of features, each with a stability rating, a performance rating and a short note. Each rating is tied to one kernel, and in October 2026 the page names “the latest released linux kernel: 7.3”. Check which kernel your distribution ships before you lean on a rating.",
        },
        {
          kind: "p",
          text: "The legend defines three ratings. OK means a feature “should be safe to use, no known major deficiencies”. Mostly OK means “safe for general use, there are some known problems that do not affect majority of users”. Unstable means testing only, with known severe problems or core parts not yet implemented.",
        },
        {
          kind: "p",
          text: "Two columns are easy to mix up. Stability is about how complete the implementation is and which use cases it covers. Performance is about how far it could still be improved before it hits its inherent limits. A feature can be OK for stability and mostly OK for performance, and RAID1 is one of those.",
        },
        {
          kind: "p",
          text: [
            "Features still in development sit behind a separate kernel build option, ",
            { code: "CONFIG_BTRFS_EXPERIMENTAL" },
            ". The status page lists them in their own table at the end, and the table in this article leaves them out.",
          ],
        },
        {
          kind: "p",
          text: "Search results still lead to an older page: the btrfs wiki at btrfs.wiki.kernel.org. It now redirects to an archive marked “OBSOLETE CONTENT”, which says it “has been archived and the content is no longer updated.” Its status table is based on kernel 6.0. For a current answer, use btrfs.readthedocs.io.",
        },
      ],
    },
    {
      id: "is-btrfs-stable-what-the-status-table",
      title: "Is btrfs stable? What the status table marks OK and mostly OK",
      blocks: [
        {
          kind: "p",
          text: "Here are the features that matter for a data volume, as the status page rates them.",
        },
        {
          kind: "table",
          columns: [
            { label: "Feature", width: "38%" },
            { label: "Stability", width: "16%" },
            { label: "The page’s note, in short", width: "46%" },
          ],
          rows: [
            ["Subvolumes, snapshots", "OK", ""],
            ["Compression", "OK", ""],
            ["Checksumming algorithms", "OK", ""],
            ["Scrub", "OK", ""],
            ["Auto-repair", "OK", "Repairs from a correct spare copy, if one exists"],
            ["Balance", "OK", "Can be slow with quotas and many snapshots"],
            ["Filesystem resize", "OK", "Shrink and grow"],
            ["Send, receive", "OK", ""],
            ["Device replace", "mostly OK", "Aborts if a read fails"],
            ["Defragmentation", "mostly OK", "Shared extents get unshared"],
            ["Quotas, qgroups", "mostly OK", "Many snapshots slow down balance"],
            ["Zoned mode", "mostly OK", "Not yet feature complete"],
            ["RAID56 (RAID5, RAID6)", "unstable", "See below"],
          ],
        },
        { kind: "p", text: "Three of the mostly OK notes deserve a closer read." },
        {
          kind: "p",
          text: [
            "Device replace and ",
            { a: "device delete", href: "/learn/btrfs-device-remove" },
            " “insist on being able to read or reconstruct all data.” A read that fails with an IO error aborts the operation, and you must remove or replace the damaged data before you try again. So data that btrfs can neither read nor rebuild from another copy stops a replace or a removal until you deal with it.",
          ],
        },
        {
          kind: "p",
          text: "Quotas are called qgroups in btrfs. The note says qgroups with many snapshots slow down balance, so it matters only on a filesystem that uses quotas. If yours doesn’t, this row doesn’t apply to you.",
        },
        {
          kind: "p",
          text: "Defragmentation rewrites data, so extents that snapshots or reflinked copies shared become separate copies and take more space.",
        },
      ],
    },
    {
      id: "is-btrfs-raid-1-stable",
      title: "Is btrfs RAID 1 stable?",
      blocks: [
        {
          kind: "p",
          text: [
            "Yes. RAID1 is rated OK for stability, as are RAID1C3, RAID1C4 and RAID10. Each is rated mostly OK for performance, and the note gives the reason: “reading from mirrors in parallel can be optimized further.” The OK rating means the profile is safe to use with no known major deficiencies; the performance note is only about reads, which aren’t spread across the copies as evenly as they could be. A read balancing feature is in development behind ",
            { code: "CONFIG_BTRFS_EXPERIMENTAL" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "A btrfs profile sets how many copies btrfs keeps of each chunk of data or metadata, and where. RAID1 keeps two complete copies, RAID1C3 three and RAID1C4 four, each copy on a different device, so they need at least two, three and four devices. The redundancy is what makes auto-repair possible. When btrfs reads a block whose checksum doesn’t match, it can repair it from a correct copy on another device, and a scrub does the same for every block it reads.",
        },
        {
          kind: "p",
          text: [
            "Two limits come with RAID1. Because it needs two devices, ",
            { code: "btrfs device remove" },
            " refuses to take a two-device RAID1 filesystem down to one: removal “must satisfy the profile constraints, otherwise the command fails”. And each RAID1 chunk needs unallocated space on two devices at once, which ",
            { a: "btrfs on multiple disks", href: "/learn/btrfs-multiple-disks" },
            " works through.",
          ],
        },
      ],
    },
    {
      id: "why-raid5-and-raid6-stay-unstable",
      title: "Why RAID5 and RAID6 stay unstable",
      blocks: [
        {
          kind: "p",
          text: "The RAID56 profiles add parity, like traditional RAID5 and RAID6. btrfs(5), the filesystem’s manual page, says they have “implementation and design deficiencies that make it unreliable for some corner cases” and that the feature “should not be used in production, only for evaluation or testing.”",
        },
        {
          kind: "p",
          text: "One problem the manual lists is the write hole. An unclean shutdown can leave a stripe where some blocks and the parity are from old writes and some from new ones, and btrfs doesn’t record which is which. There is no write journal, and the manual says the full read-modify-write that would close the hole performed too badly to use. The manual also notes that power failure safety for RAID56 metadata “is not 100%”, that space reporting is inaccurate when RAID56 shares a filesystem with other profiles, and that a scrub started on the whole filesystem degrades performance.",
        },
        {
          kind: "p",
          text: "If you do run RAID5 or RAID6 for data, the manual says not to use them for metadata: use raid1 in place of raid5, and raid1c3 in place of raid6. They give the same protection against the loss of one or two devices.",
        },
      ],
    },
    {
      id: "is-btrfs-production-ready-on-a-cloud",
      title: "Is btrfs production ready on a cloud VM?",
      blocks: [
        {
          kind: "p",
          text: [
            "With the OK profiles, yes, and on cloud block storage the profile choice starts from what the cloud already does. Azure locally redundant (LRS) managed disks already write “three copies in a single data center”, and an Amazon EBS volume “is automatically replicated within its Availability Zone.” On such disks you can keep ",
            { code: "single" },
            " data and let the cloud hold the copies. The trade-off is repair. btrfs still checksums data and metadata by default and will detect a bad block, but with one copy of the data there is nothing to repair it from. Auto-repair needs a profile with a spare copy, such as DUP or RAID1. Metadata is a different case: btrfs(5) says RAID1 is the default metadata profile on more than one device, so by default metadata keeps a second copy to repair from even when data is ",
            { code: "single" },
            ".",
          ],
        },
      ],
    },
    {
      id: "is-btrfs-good-for-a-data-volume",
      title: "Is btrfs good for a data volume? How to watch one",
      blocks: [
        {
          kind: "p",
          text: "btrfs is good for a data volume when you watch it, and three checks cover most of it:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "sudo btrfs device stats -c /data\nsudo btrfs scrub start /data\nsudo btrfs scrub status /data",
        },
        {
          kind: "p",
          text: [
            { code: "btrfs device stats" },
            " prints five persistent error counters per device: write, read and flush IO errors, checksum or header corruption, and generation errors. With ",
            { code: "-c" },
            ", it adds 64 to the exit status when any counter isn’t zero, so a cron job or a monitoring check can alert on it. ",
            { code: "btrfs scrub" },
            " reads all data and metadata and verifies the checksums. The manual recommends running it at least once a month, and it uses about 80% of a device’s bandwidth on an idle filesystem, so schedule it for a quiet hour.",
          ],
        },
        {
          kind: "p",
          text: [
            "Two more points from the docs. Setting the NOCOW attribute (",
            { code: "chattr +C" },
            ") on a file turns off its data checksums, so scrub can’t verify its contents, and systemd sets that attribute on its journals by default. And ",
            { code: "btrfs check --repair" },
            " is a last resort: its manual says not to use it “unless you are advised to do so by a developer or an experienced user.”",
          ],
        },
      ],
    },
    {
      id: "how-amoeba-handles-btrfs-in-its-pool",
      title: "How Amoeba handles btrfs in its pool",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " optimizes block storage on Azure managed disks and Amazon EBS. A VM’s data mounts move onto a pool that is one btrfs filesystem across two or more disks, with each data mount as a subvolume at the same path as before. From then on Amoeba rightsizes the pool. When data grows, it adds a disk or grows one in place. When data shrinks, space goes back a whole disk at a time, because a cloud disk itself can’t shrink, as ",
            { a: "the shrink article", href: "/learn/shrink-azure-managed-disk" },
            " explains.",
          ],
        },
        { kind: "p", text: "Its guardrails around the pool:" },
        {
          kind: "ul",
          items: [
            [
              { b: "On Linux." },
              " The VM needs systemd, kernel 5.14 or later, and btrfs loaded or loadable. VMs whose OS is in the Red Hat family are not moved onto a pool.",
            ],
            [
              { b: "The switch." },
              " If the switch fails, the agent restores the original mounts and restarts the services, and Amoeba tries again. If the outcome can’t be known within about 15\u00a0minutes, the move pauses until someone clicks Resume.",
            ],
            [
              { b: "The soak." },
              " For 2\u00a0hours after the switch, any disk error, or p99\u00a0disk latency above 1.2 times its level before the switch, pauses the move.",
            ],
            [
              { b: "The source disks." },
              " After the soak, Amoeba snapshots each source disk before it deletes it, and keeps that snapshot for 7\u00a0days.",
            ],
            [
              { b: "Shrinks." },
              " A shrink takes one disk at a time. The agent moves that disk’s data onto the others with ",
              { code: "btrfs device remove" },
              ". Amoeba then detaches the empty disk and deletes it, but never while the pool is at or above the top edge of its target band, or while an urgent expand runs.",
            ],
            [
              { b: "Disk errors." },
              " The agent reports the pool’s btrfs error counters every 15\u00a0seconds, and a pool that reports disk errors is never shrunk.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "The FAQ answers ",
            { a: "whether a shrink can lose data", href: "/amoeba/faq#can-a-shrink-lose-data" },
            ".",
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
      title: "“Status”",
      url: "https://btrfs.readthedocs.io/en/latest/Status.html",
    },
    {
      publisher: "BTRFS documentation",
      title: "“btrfs(5)”",
      url: "https://btrfs.readthedocs.io/en/latest/btrfs-man5.html",
      note: ", checksum algorithms, RAID56 status and recommended practices, and the glossary",
    },
    {
      publisher: "BTRFS documentation",
      title: "“btrfs-device(8)”",
      url: "https://btrfs.readthedocs.io/en/latest/btrfs-device.html",
    },
    {
      publisher: "BTRFS documentation",
      title: "“btrfs-scrub(8)”",
      url: "https://btrfs.readthedocs.io/en/latest/btrfs-scrub.html",
    },
    {
      publisher: "BTRFS documentation",
      title: "“btrfs-check(8)”",
      url: "https://btrfs.readthedocs.io/en/latest/btrfs-check.html",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Redundancy options for Azure managed disks”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-redundancy",
    },
    {
      publisher: "AWS",
      title: "“Features and benefits of Amazon EBS volumes”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/EBSFeatures.html",
    },
    {
      publisher: "btrfs Wiki (archived)",
      title: "“Status”",
      url: "https://archive.kernel.org/oldwiki/btrfs.wiki.kernel.org/index.php/Status.html",
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
      title: "btrfs vs LVM: which one can shrink on a cloud VM?",
      where: "Learn",
      href: "/learn/btrfs-vs-lvm",
    },
    {
      title: "Can you shrink an Azure managed disk?",
      where: "Learn",
      href: "/learn/shrink-azure-managed-disk",
    },
    {
      title: "Which Linux distributions does Amoeba support?",
      where: "Amoeba FAQ",
      href: "/amoeba/faq#which-linux-distributions-does-amoeba-support",
    },
  ],
};
