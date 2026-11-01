import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/is-btrfs-stable/1";
import { figure as figure2 } from "@/features/learn/figures/is-btrfs-stable/2";

export const article: Article = {
  slug: "is-btrfs-stable",
  title: "Is btrfs stable in 2026? RAID1, RAID5 and RAID6",
  meta: "Is btrfs stable in 2026? What the status table marks OK and unstable, whether btrfs RAID1 is stable, why RAID5/6 isn’t, and how to scrub and watch a pool.",
  h1: "Is btrfs stable in 2026?",
  deck: "The official status table, read feature by feature, and what to check before you trust btrfs with data.",
  card: "What the btrfs status table marks OK, mostly OK and unstable, and why RAID5/6 is the one to avoid.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Linux filesystems",
  published: "2026-11-01",
  updated: "2026-11-01",
  author: "sourabh",
  cover: "/learn-covers/zoorik-learn-is-btrfs-stable-1200x630.webp",
  coverAlt: "Is btrfs stable? Snapshots and RAID1 yes, quotas mostly, RAID5/6 no",
  short:
    "btrfs is stable for its core features, and the profile you pick decides most of the rest. The official status table for Linux kernel 7.3 rates snapshots, checksums, scrub, resize and the single, DUP and RAID1 profiles OK. RAID5 and RAID6 are rated unstable, not for production, and a few features, quotas among them, are mostly OK.",
  sections: [
    {
      id: "is-btrfs-stable",
      title: "Is btrfs stable? What the status table marks OK and mostly OK",
      blocks: [
        {
          kind: "p",
          text: "Picture a cloud VM whose data mounts sit on one btrfs filesystem across two disks. Each mount is a subvolume. You take a snapshot before a risky change, and you grow the filesystem when a disk grows.",
        },
        {
          kind: "p",
          text: [
            "A scrub checks every block once a month. The data uses the ",
            { code: "single" },
            " profile and the metadata ",
            { code: "raid1" },
            ". A profile is the setting for how many copies btrfs keeps of each chunk of data or metadata, and where.",
          ],
        },
        {
          kind: "p",
          text: "Look each feature up on btrfs’s status page, and every one is rated OK. That covers subvolumes, snapshots, resize, scrub and checksums, plus both profiles in use.",
        },
        {
          kind: "p",
          text: "Only one later step carries a caveat: taking a disk out. The page files it under device replace, rated mostly OK: the removal stops if a read fails.",
        },
        {
          kind: "p",
          text: "Switching the data to RAID5 or RAID6 would change the answer, since those are the only profiles the page marks unstable. Here is how it rates the features a data volume relies on.",
        },
        {
          kind: "table",
          columns: [
            { label: "Feature", width: "42%" },
            { label: "Stability", width: "15%" },
            { label: "The page’s note, in short", width: "43%" },
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
            ["Profiles single, DUP, RAID0", "OK", ""],
            ["Profiles RAID1, RAID1C3, RAID1C4, RAID10", "OK", "Performance mostly OK, see below"],
            ["Device replace", "mostly OK", "Aborts if a read fails"],
            ["Defragmentation", "mostly OK", "Shared extents get unshared"],
            ["Quotas, qgroups", "mostly OK", "Many snapshots slow down balance"],
            ["Zoned mode", "mostly OK", "Not yet feature complete"],
            ["RAID56 (RAID5, RAID6)", "unstable", "See below"],
          ],
        },
        { kind: "p", text: "Three mostly OK notes deserve a closer read:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Device replace." },
              " It and ",
              { a: "device delete", href: "/learn/btrfs-device-remove" },
              " “insist on being able to read or reconstruct all data”, says the page. A read that fails with an IO error aborts the operation. Remove or replace the damaged data, then try again. So data btrfs can’t read or rebuild from another copy stops a replace or a removal until you deal with it.",
            ],
            [
              { b: "Quotas." },
              " btrfs calls them qgroups. The note says qgroups with many snapshots slow down balance. That matters only on a filesystem that uses quotas, so if yours doesn’t, this row doesn’t apply.",
            ],
            [
              { b: "Defragmentation." },
              " It rewrites data. Extents that snapshots or reflinked copies shared become separate copies and take more space.",
            ],
          ],
        },
      ],
    },
    {
      id: "how-to-read-the-btrfs-status-page",
      title: "How to read the btrfs status page",
      blocks: [
        {
          kind: "p",
          text: "One page of the btrfs documentation covers btrfs stability. Each feature on it gets a stability rating, a performance rating and a short note. The ratings are tied to one kernel.",
        },
        {
          kind: "p",
          text: "In October 2026 the page names “the latest released linux kernel: 7.3”. Check which kernel your distribution ships before you lean on a rating.",
        },
        { kind: "p", text: "The legend defines three ratings:" },
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
              " means testing only, with known severe problems or core parts not yet implemented.",
            ],
          ],
        },
        {
          kind: "p",
          text: "Two columns are easy to mix up. Stability is about how complete the implementation is and which use cases it covers. Performance rates how far it could still be improved before it hits its inherent limits.",
        },
        {
          kind: "p",
          text: "A feature can score OK on stability and mostly OK on performance. RAID1 is one of those.",
        },
        {
          kind: "p",
          text: [
            "Features still in development sit behind a separate kernel build option, ",
            { code: "CONFIG_BTRFS_EXPERIMENTAL" },
            ". The status page lists them in a table of their own at the end, which the table above leaves out.",
          ],
        },
        {
          kind: "h3",
          id: "the-old-btrfs-wiki-is-out-of",
          title: "The old btrfs wiki is out of date",
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "Search results still lead to an older page, the btrfs wiki at btrfs.wiki.kernel.org. It now redirects to an archive marked “OBSOLETE CONTENT”.",
        },
        {
          kind: "p",
          text: "The archive says it “has been archived and the content is no longer updated”. Its status table is based on kernel 6.0, so a rating read there can be out of date. For a current answer, use btrfs.readthedocs.io.",
        },
      ],
    },
    {
      id: "is-btrfs-raid-1-stable",
      title: "Is btrfs RAID 1 stable?",
      blocks: [
        {
          kind: "p",
          text: "Yes. RAID1 is rated OK for stability, as are RAID1C3, RAID1C4 and RAID10. So each is safe to use, with no known major deficiencies.",
        },
        {
          kind: "p",
          text: "Each is rated mostly OK for performance, and the note gives the reason: “reading from mirrors in parallel can be optimized further”.",
        },
        {
          kind: "p",
          text: [
            "That note is only about reads, which aren’t spread across the copies as evenly as they could be. A read balancing feature is in development behind ",
            { code: "CONFIG_BTRFS_EXPERIMENTAL" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "RAID1 keeps two complete copies, RAID1C3 three and RAID1C4 four. Each copy sits on a different device, so they need at least two, three and four devices.",
        },
        {
          kind: "p",
          text: "That redundancy is what makes auto-repair possible. When btrfs reads a block whose checksum doesn’t match, it can repair it from a correct copy on another device. A scrub does the same for every block it reads.",
        },
        { kind: "p", text: "Two limits come with RAID1:" },
        {
          kind: "ul",
          items: [
            [
              { b: "A two-device filesystem stays at two." },
              " RAID1 needs two devices. So ",
              { code: "btrfs device remove" },
              " refuses to take a two-device RAID1 filesystem down to one. Removal “must satisfy the profile constraints, otherwise the command fails”, as its manual puts it.",
            ],
            [
              { b: "Each chunk needs room in two places." },
              " Every RAID1 chunk needs unallocated space on two devices at once. The article on ",
              { a: "btrfs on multiple disks", href: "/learn/btrfs-multiple-disks" },
              " works through that.",
            ],
          ],
        },
      ],
    },
    {
      id: "why-raid5-and-raid6-stay-unstable",
      title: "Why btrfs RAID5 and RAID6 stay unstable",
      blocks: [
        {
          kind: "p",
          text: "The RAID56 profiles add parity, the same way traditional RAID5/6 does. RAID5 stripes one copy of the data across the devices, with one device’s worth of parity. That’s enough to recover from one failed device.",
        },
        { kind: "p", text: "RAID6 doubles the parity, so it recovers from two failed devices." },
        {
          kind: "p",
          text: "btrfs(5), the filesystem’s manual page, says they have “implementation and design deficiencies that make it unreliable for some corner cases”. It adds that the feature “should not be used in production, only for evaluation or testing”.",
        },
        { kind: "h3", id: "the-write-hole", title: "The write hole" },
        {
          kind: "p",
          text: "One problem the manual lists is the write hole. An unclean shutdown, such as a power loss mid-write, can leave a stripe part old, part new. Some blocks and the parity are from old writes, and some from new ones. btrfs doesn’t record which is which.",
        },
        {
          kind: "p",
          text: "Picture a RAID5 stripe on three devices: two data blocks and their parity. New data reached one device before the power went, but the new parity didn’t.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "callout",
          label: "For engineers",
          text: "RAID56 has no write journal. The manual says the fix, a full read-modify-write that always writes a full stripe, performed too badly to use.",
        },
        { kind: "p", text: "The manual notes three more limits of RAID56:" },
        {
          kind: "ul",
          items: [
            "Power failure safety for RAID56 metadata “is not 100%”.",
            "Space reporting is inaccurate when RAID56 shares a filesystem with other profiles.",
            "A scrub started on the whole filesystem degrades performance.",
          ],
        },
        {
          kind: "p",
          text: [
            "If you do run RAID5 or RAID6 for data, keep metadata off them, as the manual asks. Use ",
            { code: "raid1" },
            " metadata with RAID5 data, and ",
            { code: "raid1c3" },
            " metadata with RAID6 data. Those give metadata the same protection against the loss of one or two devices.",
          ],
        },
      ],
    },
    {
      id: "is-btrfs-production-ready-on-a-cloud",
      title: "Is btrfs production ready on a cloud VM?",
      blocks: [
        {
          kind: "p",
          text: "With the OK profiles, yes. On cloud block storage, the profile choice starts from what the cloud already does.",
        },
        {
          kind: "p",
          text: [
            "Azure locally redundant storage (LRS) ",
            { a: "managed disks", href: "/learn/glossary/azure-managed-disk" },
            " already write “three copies in a single data center”. An ",
            { a: "Amazon EBS volume", href: "/learn/glossary/ebs-volume" },
            " “is automatically replicated within its Availability Zone”. On such disks you can keep ",
            { code: "single" },
            " data and let the cloud hold the copies.",
          ],
        },
        {
          kind: "p",
          text: "The trade-off is repair. btrfs still checksums data and metadata by default, and it will detect a bad block. But with one copy of the data, there is nothing to repair it from.",
        },
        {
          kind: "p",
          text: [
            "Metadata is a different case. btrfs(5) says RAID1 is the default metadata profile on more than one device. So by default, metadata keeps a second copy to repair from, even when data is ",
            { code: "single" },
            ".",
          ],
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "callout",
          label: "Rule of thumb",
          text: "Give data a spare copy when you want btrfs to repair bad data blocks, not only detect them. Auto-repair needs a profile such as DUP or RAID1.",
        },
        {
          kind: "p",
          text: "DUP keeps two copies of every block on the same device, and RAID1 keeps them on two different devices. Either way, the same data takes twice the space.",
        },
      ],
    },
    {
      id: "is-btrfs-good-for-a-data-volume",
      title: "Is btrfs good for a data volume? Yes, with scrub and device stats",
      blocks: [
        { kind: "p", text: "Three commands cover most of the watching." },
        {
          kind: "ol",
          items: [
            [
              { b: "Check the error counters." },
              " ",
              { code: "btrfs device stats" },
              " prints five persistent error counters for each device. They count write, read and flush IO errors, checksum or header corruption, and generation errors. With ",
              { code: "-c" },
              ", it adds 64 to the exit status when any counter isn’t zero. A cron job or a monitoring check can alert on that.",
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
              " reads all data and metadata and verifies the checksums. It uses about 80% of a device’s bandwidth on an idle filesystem, so schedule it for a quiet hour.",
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
              " shows a running scrub, or the last finished one. Its summary counts Corrected errors, “bad blocks that were repaired from another copy”. It also counts Uncorrectable errors, “errors detected at read time but not possible to repair from other copy”.",
            ],
          ],
        },
        { kind: "code", lang: "bash", code: "sudo btrfs scrub status /data" },
        {
          kind: "p",
          text: [
            "Some files sit outside these checks. Setting the NOCOW attribute (",
            { code: "chattr +C" },
            ") on a file turns off its data checksums, so scrub can’t verify what’s in it. By default, systemd sets that attribute on its journals.",
          ],
        },
        {
          kind: "p",
          text: [
            "When something does go wrong, treat ",
            { code: "btrfs check --repair" },
            " as a last resort. Its manual says not to use it “unless you are advised to do so by a developer or an experienced user”.",
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
            " optimizes block storage on Azure managed disks and Amazon EBS volumes. It works on the data disks of running Windows and Linux VMs, and never touches the OS disk or root volume.",
          ],
        },
        {
          kind: "p",
          text: "It moves a VM’s data disks onto one btrfs pool, sized to your data, with room to grow. Each data mount becomes a subvolume at the same path as before.",
        },
        { kind: "h3", id: "where-btrfs-comes-in", title: "Where btrfs comes in" },
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
              " Once the switch is checked, Amoeba snapshots each old disk and deletes the disk. It keeps the snapshot for a few days, then deletes it too.",
            ],
            [
              { b: "Growing." },
              " Amoeba grows the pool before it fills, and sooner when data arrives fast.",
            ],
            [
              { b: "Shrinking." },
              " When your data goes down and stays down, it shrinks the pool one disk at a time. It moves that disk’s data onto the others with ",
              { code: "btrfs device remove" },
              ". Then it deletes the empty disk. It never takes a disk out while the pool is nearly full, or while an urgent grow runs.",
            ],
            [
              { b: "On Linux." },
              " The VM needs a recent kernel with btrfs. Every service that keeps a data mount open must run under systemd.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "So you pay for close to what you use. Space goes back a whole disk at a time, because a cloud disk can’t shrink in place. The article on how to ",
            { a: "reduce Azure disk size", href: "/learn/shrink-azure-managed-disk" },
            " explains why.",
          ],
        },
        {
          kind: "p",
          text: [
            "The FAQ answers ",
            { a: "whether a shrink can lose data", href: "/amoeba-faq#can-a-shrink-lose-data" },
            ". Amoeba’s pages on ",
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
      title: "btrfs unallocated space vs free space, explained",
      where: "Learn",
      href: "/learn/btrfs-unallocated-space",
    },
  ],
};
