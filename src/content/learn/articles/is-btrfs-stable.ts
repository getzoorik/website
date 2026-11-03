import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/is-btrfs-stable/1";
import { figure as figure2 } from "@/features/learn/figures/is-btrfs-stable/2";

export const article: Article = {
  slug: "is-btrfs-stable",
  title: "Is btrfs stable? btrfs RAID1, RAID5 and RAID6",
  meta: "Is btrfs stable? What the official status table rates OK, which btrfs RAID profiles are safe, why RAID5 and RAID6 aren’t, and how to check a pool.",
  h1: "Is btrfs stable?",
  deck: "The official status table, feature by feature, and which btrfs RAID profiles are safe.",
  card: "Which btrfs features and RAID profiles are rated OK, and why RAID5 and RAID6 are not.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Linux filesystems",
  published: "2026-11-01",
  updated: "2026-11-03",
  author: "sourabh",
  cover: "/learn-covers/zoorik-learn-is-btrfs-stable-1200x630.webp",
  coverAlt: "Is btrfs stable? Snapshots and RAID1 yes, quotas mostly, RAID5/6 no",
  short:
    "Yes, for its core features. The official status table, for Linux kernel 7.3, rates snapshots, checksums, scrub, resize and the single, DUP and RAID1 profiles OK. Quotas are mostly OK. btrfs RAID5 and RAID6 are rated unstable and are not for production.",
  sections: [
    {
      id: "is-btrfs-stable",
      title: "Feature status",
      blocks: [
        {
          kind: "p",
          text: [
            "The ",
            { a: "btrfs", href: "/learn/glossary/btrfs" },
            " documentation rates each feature on a status page. These are the main stability ratings:",
          ],
        },
        {
          kind: "table",
          columns: [
            { label: "Feature", width: "40%" },
            { label: "Stability", width: "18%" },
            { label: "Note", width: "42%" },
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
          ],
        },
        {
          kind: "p",
          text: "The RAID profiles have a table of their own, below. Three mostly OK ratings matter in practice:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Device replace." },
              " It and ",
              { a: "device delete", href: "/learn/btrfs-device-remove" },
              " “insist on being able to read or reconstruct all data”. A read that fails with an I/O error aborts them. Remove or replace the damaged data, then try again.",
            ],
            [
              { b: "Quotas." },
              " btrfs calls them qgroups. With many snapshots, they slow down balance. If you don’t use quotas, this rating doesn’t apply.",
            ],
            [
              { b: "Defragmentation." },
              " It rewrites data, so extents shared by snapshots or reflinked copies become separate copies and take more space.",
            ],
          ],
        },
      ],
    },
    {
      id: "how-to-read-the-btrfs-status-page",
      title: "Reading the ratings",
      blocks: [
        {
          kind: "ul",
          items: [
            [{ b: "OK" }, " means a feature “should be safe to use, no known major deficiencies”."],
            [
              { b: "Mostly OK" },
              " means “safe for general use, there are some known problems that do not affect majority of users”.",
            ],
            [
              { b: "Unstable" },
              " means testing only: known severe problems, or core parts not yet implemented.",
            ],
          ],
        },
        {
          kind: "p",
          text: "Each feature also gets a performance rating. Stability rates how complete a feature is and which use cases it covers. Performance rates how much it could still improve.",
        },
        {
          kind: "p",
          text: "The ratings hold for one kernel: the latest released Linux kernel, 7.3 in November 2026. Check which kernel your distribution ships before you rely on one.",
        },
        {
          kind: "p",
          text: [
            "Features still in development sit behind the ",
            { code: "CONFIG_BTRFS_EXPERIMENTAL" },
            " kernel build option. The page lists them in a separate table.",
          ],
        },
        {
          kind: "h3",
          id: "the-old-btrfs-wiki-is-out-of",
          title: "The outdated wiki",
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "Search results still lead to btrfs.wiki.kernel.org. It now redirects to an archive marked “OBSOLETE CONTENT”, whose status table rates features for kernel 6.0. Use btrfs.readthedocs.io instead.",
        },
      ],
    },
    {
      id: "is-btrfs-raid-1-stable",
      title: "btrfs RAID profiles",
      blocks: [
        {
          kind: "p",
          text: "btrfs does RAID itself, across the devices of one filesystem. A profile sets how many copies it keeps of each chunk of data or metadata, and where. Data and metadata can use different profiles.",
        },
        {
          kind: "table",
          columns: [
            { label: "Profile", width: "20%" },
            { label: "Copies", width: "28%" },
            { label: "Usable space", width: "30%" },
            { label: "Stability", width: "22%" },
          ],
          rows: [
            ["single", "1", "100%", "OK"],
            ["DUP", "2, on one device", "50%", "OK"],
            ["RAID0", "1, striped", "100%", "OK"],
            ["RAID1", "2", "50%", "OK"],
            ["RAID1C3", "3", "33%", "OK"],
            ["RAID1C4", "4", "25%", "OK"],
            ["RAID10", "2, striped", "50%", "OK"],
            ["RAID5", "1, plus 1 parity", "All but one device", "unstable"],
            ["RAID6", "1, plus 2 parity", "All but two devices", "unstable"],
          ],
        },
        { kind: "h3", id: "btrfs-raid1", title: "btrfs RAID1" },
        {
          kind: "p",
          text: "btrfs RAID1 is stable. RAID1, RAID1C3, RAID1C4 and RAID10 are all rated OK: safe to use, with no known major deficiencies.",
        },
        {
          kind: "p",
          text: [
            "Their performance is rated mostly OK, because reads aren’t yet spread evenly across the copies. A read balancing feature is in development behind ",
            { code: "CONFIG_BTRFS_EXPERIMENTAL" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "RAID1, RAID1C3 and RAID1C4 keep each copy on a different device, so they need at least two, three and four devices.",
        },
        {
          kind: "p",
          text: "The copies make auto-repair possible. When a block’s checksum doesn’t match, btrfs repairs it from a correct copy on another device. A scrub does the same for every block it reads.",
        },
        { kind: "p", text: "Two limits come with RAID1:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Two devices stay two." },
              " ",
              { code: "btrfs device remove" },
              " won’t take a two-device RAID1 filesystem down to one, because removal “must satisfy the profile constraints”. Convert the profiles with ",
              { code: "btrfs balance" },
              " first.",
            ],
            [
              { b: "Each chunk needs room on two devices." },
              " Every RAID1 chunk needs unallocated space on two devices at once. ",
              { a: "btrfs on multiple disks", href: "/learn/btrfs-multiple-disks" },
              " works through what that takes.",
            ],
          ],
        },
      ],
    },
    {
      id: "why-raid5-and-raid6-stay-unstable",
      title: "Why RAID5 and RAID6 are unstable",
      blocks: [
        {
          kind: "p",
          text: "RAID5 and RAID6, together called RAID56, add parity as traditional RAID does. RAID5 stripes data across the devices with one device’s worth of parity, so it survives one failed device. RAID6 doubles the parity and survives two.",
        },
        {
          kind: "p",
          text: "The btrfs(5) manual page says they have “implementation and design deficiencies that make it unreliable for some corner cases”. The feature “should not be used in production, only for evaluation or testing”.",
        },
        { kind: "h3", id: "the-write-hole", title: "The write hole" },
        {
          kind: "p",
          text: "An unclean shutdown, such as a power loss mid-write, can leave a stripe part old and part new. btrfs doesn’t record which blocks are which.",
        },
        {
          kind: "p",
          text: "Picture a RAID5 stripe on three devices: two data blocks and their parity. New data reached device 1 before the power went, but the new parity never reached device 3.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "callout",
          label: "For engineers",
          text: "RAID56 has no write journal. A full read-modify-write that always writes whole stripes would close the hole, but the manual says it performed too badly to use.",
        },
        { kind: "p", text: "The manual lists three more limits:" },
        {
          kind: "ul",
          items: [
            "Power failure safety for RAID56 metadata “is not 100%”.",
            "Space reporting is inaccurate when RAID56 shares a filesystem with other profiles.",
            "A scrub of the whole filesystem runs on all devices at once and degrades performance. Scrub each device separately instead.",
          ],
        },
        {
          kind: "p",
          text: "To survive two failed devices without RAID6, mkfs.btrfs(8) suggests RAID1C3. It takes more space, but it is reliable.",
        },
        {
          kind: "p",
          text: [
            "If you still run RAID5 or RAID6 for data, keep metadata off them, as the manual asks. Use ",
            { code: "raid1" },
            " metadata with RAID5 data, and ",
            { code: "raid1c3" },
            " with RAID6 data. Each gives metadata the same protection against losing one or two devices.",
          ],
        },
      ],
    },
    {
      id: "is-btrfs-production-ready-on-a-cloud",
      title: "btrfs on cloud disks",
      blocks: [
        {
          kind: "p",
          text: "With the OK profiles, btrfs is ready for production data on a cloud VM. Start the profile choice from what the cloud already does.",
        },
        {
          kind: "p",
          text: [
            "Azure locally redundant storage (LRS) ",
            { a: "managed disks", href: "/learn/glossary/azure-managed-disk" },
            " write “three copies in a single data center”. An ",
            { a: "Amazon EBS volume", href: "/learn/glossary/ebs-volume" },
            " “is automatically replicated within its Availability Zone”. So btrfs can keep ",
            { code: "single" },
            " data and leave the copies to the cloud.",
          ],
        },
        {
          kind: "p",
          text: "The trade-off is repair. btrfs still checksums data and metadata by default, so it detects a bad block. With one copy of the data, it has nothing to repair it from.",
        },
        {
          kind: "p",
          text: [
            "Metadata is different. Its default profile is RAID1 on more than one device, and DUP on one. So metadata keeps a second copy to repair from, even when data is ",
            { code: "single" },
            ".",
          ],
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "callout",
          label: "Rule of thumb",
          text: "To have btrfs repair bad data blocks, not only detect them, give data a second copy: DUP on one device, or RAID1 across two. Either way, data takes twice the space.",
        },
      ],
    },
    {
      id: "is-btrfs-good-for-a-data-volume",
      title: "Check a pool for errors",
      blocks: [
        {
          kind: "ol",
          items: [
            [
              { b: "Check the error counters." },
              " ",
              { code: "btrfs device stats" },
              " prints five persistent error counters for each device. With ",
              { code: "-c" },
              ", it adds 64 to the exit status when any counter isn’t zero, so a cron job or monitoring check can alert on it.",
            ],
          ],
        },
        { kind: "code", lang: "bash", code: "sudo btrfs device stats -c /data" },
        {
          kind: "ol",
          start: 2,
          items: [
            [
              { b: "Scrub at least once a month." },
              " The manual recommends that interval. ",
              { code: "btrfs scrub" },
              " reads all data and metadata and verifies the checksums. On an idle filesystem it uses about 80% of a device’s bandwidth, so run it in a quiet hour.",
            ],
          ],
        },
        { kind: "code", lang: "bash", code: "sudo btrfs scrub start /data" },
        {
          kind: "ol",
          start: 3,
          items: [
            [
              { b: "Read the scrub’s error summary." },
              " ",
              { code: "btrfs scrub status" },
              " counts Corrected errors, “bad blocks that were repaired from another copy”. Uncorrectable errors had no good copy to repair from.",
            ],
          ],
        },
        { kind: "code", lang: "bash", code: "sudo btrfs scrub status /data" },
        {
          kind: "p",
          text: [
            "Files with the NOCOW attribute (",
            { code: "chattr +C" },
            ") have no data checksums, so scrub can’t verify their data. systemd sets that attribute on its journals by default.",
          ],
        },
        {
          kind: "h3",
          id: "btrfs-check-repair-is-a-last-resort",
          title: "Repair is a last resort",
        },
        {
          kind: "p",
          text: [
            { code: "btrfs check" },
            " verifies a filesystem’s structure, and its manual recommends unmounting first. By default it doesn’t modify the device, and ",
            { code: "--readonly" },
            " makes that explicit:",
          ],
        },
        { kind: "code", lang: "bash", code: "sudo btrfs check --readonly /dev/<device>" },
        {
          kind: "p",
          text: [
            "Its manual says not to use ",
            { code: "--repair" },
            " “unless you are advised to do so by a developer or an experienced user”.",
          ],
        },
      ],
    },
    {
      id: "how-amoeba-handles-btrfs-in-its-pool",
      title: "Where Amoeba fits",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " rightsizes block storage on Azure and AWS without any downtime. It works on the data disks of running Windows and Linux VMs: Azure managed disks and Amazon EBS volumes. It never touches the OS disk or root volume.",
          ],
        },
        {
          kind: "p",
          text: "Amoeba moves a VM’s data disks onto one btrfs pool, sized to your data with room to grow. Each data mount becomes a subvolume at the same path as before.",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "The move." },
              " Amoeba copies your data while your services run. Then it switches each mount to the pool, with a short restart of the services that use it. If the switch fails, it puts the original mounts back and tries again.",
            ],
            [
              { b: "The check." },
              " After the switch, Amoeba reads the pool’s btrfs error counters. Any device error pauses the move.",
            ],
            [
              { b: "The old disks." },
              " Once the switch is checked, Amoeba snapshots each old disk and deletes it. It keeps each snapshot for 7 days, then deletes that too.",
            ],
            [
              { b: "Growing." },
              " Amoeba grows the pool before it fills, and sooner when data arrives fast.",
            ],
            [
              { b: "Shrinking." },
              " When your data goes down and stays down, Amoeba shrinks the pool one disk at a time. It moves that disk’s data onto the others with ",
              { code: "btrfs device remove" },
              ", then deletes the empty disk. It never takes a disk out while the pool is nearly full, or while an urgent grow runs.",
            ],
            [
              { b: "What the VM needs." },
              " A few free disk slots for the pool. On Linux, a recent kernel with btrfs, and systemd running every service that keeps a data mount open.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "So you pay for close to what you use. Space goes back a whole disk at a time, because a cloud disk ",
            { a: "can’t shrink in place", href: "/learn/shrink-azure-managed-disk" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "The FAQ answers ",
            { a: "whether a shrink can lose data", href: "/amoeba-faq#can-a-shrink-lose-data" },
            ". ",
            {
              a: "Azure managed disk cost optimization",
              href: "/azure-managed-disk-cost-optimization",
            },
            " and ",
            { a: "EBS cost optimization", href: "/ebs-cost-optimization" },
            " cover each cloud.",
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
      title: "“Status”",
      url: "https://btrfs.readthedocs.io/en/latest/Status.html",
    },
    {
      publisher: "BTRFS documentation",
      title: "“btrfs(5)”",
      url: "https://btrfs.readthedocs.io/en/latest/btrfs-man5.html",
      note: ", RAID56 status and recommended practices, and the glossary",
    },
    {
      publisher: "BTRFS documentation",
      title: "“mkfs.btrfs(8)”",
      url: "https://btrfs.readthedocs.io/en/latest/mkfs.btrfs.html",
      note: ", profiles",
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
      publisher: "systemd",
      title: "“journal-nocow.conf”",
      url: "https://github.com/systemd/systemd/blob/main/tmpfiles.d/journal-nocow.conf",
    },
    {
      publisher: "btrfs Wiki (archived)",
      title: "“Status”",
      url: "https://archive.kernel.org/oldwiki/btrfs.wiki.kernel.org/index.php/Status.html",
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
      title: "btrfs vs ext4 vs XFS: which can shrink?",
      where: "Learn",
      href: "/learn/btrfs-vs-lvm",
    },
    {
      title: "Can you shrink an Azure managed disk?",
      where: "Learn",
      href: "/learn/shrink-azure-managed-disk",
    },
    {
      title: "btrfs unallocated vs free space",
      where: "Learn",
      href: "/learn/btrfs-unallocated-space",
    },
  ],
  relatedTitle: "More on btrfs",
};
