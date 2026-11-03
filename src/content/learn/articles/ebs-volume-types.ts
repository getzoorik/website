import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/ebs-volume-types/1";
import { figure as figure2 } from "@/features/learn/figures/ebs-volume-types/2";
import { figure as figure3 } from "@/features/learn/figures/ebs-volume-types/3";

export const article: Article = {
  slug: "ebs-volume-types",
  title: "Amazon EBS volume types: how to choose",
  meta: "AWS EBS volume types compared: gp3, gp2, io2, io1, st1 and sc1 by size, IOPS, throughput and price, and three checks that pick one.",
  h1: "Amazon EBS volume types",
  deck: "Limits and list prices for all six types, and three checks that pick one.",
  card: "gp3, gp2, io2, io1, st1 and sc1 by limits and list price, and three checks that pick one.",
  product: "amoeba",
  hub: "Block storage",
  topic: "AWS block storage",
  published: "2026-11-01",
  updated: "2026-11-03",
  author: "rupeshankar",
  cover: "/learn-covers/zoorik-learn-ebs-volume-types-1200x630.webp",
  coverAlt:
    "EBS volume types: gp3, gp2 and io2 by price per GB-month, with gp3 the cheapest SSD type",
  short:
    "Amazon EBS volume types come in two families. The SSD types are gp3, gp2, io2 Block Express and io1. The HDD types, st1 and sc1, cost less per GB. Use gp3 by default, io2 only past gp3’s limits, and st1 or sc1 only for large, sequential I/O.",
  sections: [
    {
      id: "ebs-volume-types",
      title: "The six types",
      blocks: [
        {
          kind: "p",
          text: [
            "An ",
            { a: "Amazon Elastic Block Store (EBS) volume", href: "/learn/glossary/ebs-volume" },
            " is ",
            { a: "block storage", href: "/learn/glossary/block-storage" },
            " that you attach to an EC2 instance. Each volume has one type, and the types differ in performance and price.",
          ],
        },
        {
          kind: "p",
          text: "There are six current types of EBS volumes, in two families:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "SSD, solid-state drive." },
              " For frequent, small reads and writes, where ",
              { a: "input/output operations per second (IOPS)", href: "/learn/glossary/iops" },
              " matter most. General Purpose SSD is ",
              { a: "gp3", href: "/learn/glossary/ebs-gp3" },
              " and gp2. ",
              { a: "Provisioned IOPS", href: "/learn/glossary/provisioned-iops" },
              " SSD is io2 Block Express and io1.",
            ],
            [
              { b: "HDD, hard disk drive." },
              " For large, streaming reads and writes, where ",
              { a: "throughput", href: "/learn/glossary/disk-throughput" },
              " matters most. Throughput Optimized HDD is st1, and Cold HDD is sc1.",
            ],
          ],
        },
        {
          kind: "p",
          text: "US East (N. Virginia) list prices, October 2026:",
        },
        {
          kind: "table",
          columns: [
            { label: "Type", width: "12%" },
            { label: "Use cases", width: "24%" },
            { label: "Size", width: "13%" },
            { label: "Most IOPS", width: "11%" },
            { label: "Most throughput", width: "12%" },
            { label: "Storage, per GB-month", width: "11%" },
            { label: "Also charged", width: "17%" },
          ],
          rows: [
            [
              "gp3",
              "Most workloads: boot volumes, medium-sized databases, interactive apps, dev and test",
              "1 GiB to 64 TiB",
              "80,000",
              "2,000 MiB/s",
              "$0.08",
              "IOPS above 3,000 at $0.005, and MiB/s above 125 at $0.04, each per month",
            ],
            [
              "gp2",
              "Same as gp3, with performance tied to size",
              "1 GiB to 16 TiB",
              "16,000",
              "250 MiB/s",
              "$0.10",
              "Nothing",
            ],
            [
              "io2 Block Express",
              "Steady sub-millisecond latency, or over 80,000 IOPS or 2,000 MiB/s",
              "4 GiB to 64 TiB",
              "256,000",
              "4,000 MiB/s",
              "$0.125",
              "Each IOPS: $0.065 a month up to 32,000, less above",
            ],
            [
              "io1",
              "I/O-intensive databases",
              "4 GiB to 16 TiB",
              "64,000",
              "1,000 MiB/s",
              "$0.125",
              "Each IOPS: $0.065 a month",
            ],
            [
              "st1",
              "Big data, data warehouses, log processing",
              "125 GiB to 16 TiB",
              "500, at 1 MiB per I/O",
              "500 MiB/s",
              "$0.045",
              "Nothing",
            ],
            [
              "sc1",
              "Data read rarely, where storage price matters most",
              "125 GiB to 16 TiB",
              "250, at 1 MiB per I/O",
              "250 MiB/s",
              "$0.015",
              "Nothing",
            ],
          ],
        },
        {
          kind: "p",
          text: "Provisioned IOPS SSD is AWS’s highest-performance type. io2 Block Express is also the only type designed for 99.999% durability. The rest are designed for 99.8% to 99.9%.",
        },
        {
          kind: "p",
          text: [
            "An instance also has its own ",
            { a: "EBS limits", href: "/learn/glossary/ebs-optimized-instance" },
            ", and a volume gets no more than they allow.",
          ],
        },
        {
          kind: "p",
          text: "Magnetic (standard) volumes are the previous generation: 1 GiB to 1 TiB, with 40 to 200 IOPS at most. AWS recommends a current type for more performance, or steadier performance.",
        },
      ],
    },
    {
      id: "ebs-volume-types-pricing-what-each-type",
      title: "Pricing",
      blocks: [
        {
          kind: "p",
          text: "Every type charges for capacity. AWS charges storage “by the amount of GB you provision per month”, until you release it. So a volume costs its full size, however little data it holds.",
        },
        { kind: "p", text: "The types charge in three ways:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Storage only: gp2, st1 and sc1." },
              " “I/O is included in the price of the volumes,” AWS says. Performance comes with the size you choose.",
            ],
            [
              { b: "Storage plus extra performance: gp3." },
              " Each volume includes 3,000 IOPS and 125 MiB/s. You pay only for what you add above those.",
            ],
            [
              { b: "Storage plus every IOPS: io2 and io1." },
              " You pay for each IOPS you provision. On io2, the rate steps down past 32,000 IOPS on a volume, and again past 64,000.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Prices differ by Region and change, so check AWS’s pricing page for yours. The ",
            { a: "EBS pricing calculator", href: "/ebs-and-azure-disk-pricing" },
            " shows a gp3 or gp2 volume’s monthly list price, and what its empty space costs.",
          ],
        },
      ],
    },
    {
      id: "how-to-choose-an-ebs-volume-type",
      title: "How to choose",
      blocks: [
        {
          kind: "p",
          text: "The I/O pattern settles SSD or HDD, so measure it first.",
        },
        { kind: "h3", id: "measure-what-the-volume-does", title: "Measure the volume" },
        {
          kind: "p",
          text: [
            "On a Nitro instance, the Amazon CloudWatch metrics ",
            { code: "VolumeAvgIOPS" },
            " and ",
            { code: "VolumeAvgThroughput" },
            " give each minute’s average IOPS, and its throughput in KiB/s. The volume’s Monitoring tab in the EC2 console also graphs average read and write size, in KiB per operation.",
          ],
        },
        {
          kind: "p",
          text: [
            { code: "VolumeIOPSExceededCheck" },
            " and ",
            { code: "VolumeThroughputExceededCheck" },
            " read 1 when the application keeps asking for more than the volume provides. On gp2, st1 and sc1, ",
            { code: "BurstBalance" },
            " shows the percentage of burst credits left.",
          ],
        },
        {
          kind: "h3",
          id: "three-checks-that-pick-the-type",
          title: "Three checks",
        },
        { kind: "p", text: "Ask these in order, and stop at the first yes:" },
        {
          kind: "ol",
          items: [
            [
              { b: "Does one volume need more than gp3 gives?" },
              " That means over 80,000 IOPS or 2,000 MiB/s, steady sub-millisecond latency, or 99.999% durability. It also covers Multi-Attach, one volume on several instances, which only io1 and io2 support. If so, use io2. ",
              { a: "io2 vs gp3", href: "/learn/io2-vs-gp3" },
              " prices each case.",
            ],
            [
              { b: "Is the I/O large and sequential?" },
              " If so, use st1 or sc1, compared below. Neither can be a boot volume, so this fits only a data volume of 125 GiB or more.",
            ],
            [
              { b: "Everything else gets gp3." },
              " Provision the IOPS and throughput you measured, above the included 3,000 IOPS and 125 MiB/s.",
            ],
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "h3",
          id: "volumes-you-already-have",
          title: "Existing gp2 and io1 volumes",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "gp2 to gp3." },
              " gp3 costs 20% less per GiB and includes 3,000 IOPS and 125 MiB/s at any size. A gp2 volume over 1,000 GiB has more than 3,000 IOPS, at 3 per GiB. One of 334 GiB or more has 250 MiB/s. Set gp3 to match what the volume uses. ",
              { a: "gp2 vs gp3", href: "/learn/gp2-vs-gp3" },
              " has the steps.",
            ],
            [
              { b: "io1 to io2." },
              " Storage costs the same, $0.125 per GB-month, and so does each IOPS up to 32,000. Above that, io2 charges less per IOPS. It also allows 1,000 IOPS per GiB, against io1’s 50.",
            ],
          ],
        },
      ],
    },
    {
      id: "st1-vs-sc1-two-hdd-types-for",
      title: "st1 vs sc1",
      blocks: [
        {
          kind: "p",
          text: "Both HDD types measure performance in throughput and use a burst bucket of credits. Volume size sets the baseline, the rate at which credits build up. It also sets the burst rate, which lasts while credits do.",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "st1" },
              " builds credits at 40 MiB/s per TiB and bursts at 250 MiB/s per TiB, up to 500 MiB/s. At 2 TiB, that’s 80 MiB/s baseline and 500 MiB/s burst.",
            ],
            [
              { b: "sc1" },
              " builds credits at 12 MiB/s per TiB and bursts at 80 MiB/s per TiB, up to 250 MiB/s. At 2 TiB, that’s 24 MiB/s and 160 MiB/s.",
            ],
          ],
        },
        {
          kind: "p",
          text: "A full bucket holds enough credits for one full scan of the volume. AWS advises st1 when scans must finish fast or run several times a day. It advises sc1 when the data is read rarely and 250 MiB/s is enough.",
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "On st1 and sc1, an I/O of 1 MiB or less counts as a full 1 MiB of credit. Sequential I/O is merged into 1 MiB blocks, but small, random I/O drains the bucket fast.",
        },
        {
          kind: "p",
          text: [
            "While a snapshot of an st1 or sc1 volume runs, its performance may drop as far as its baseline. So schedule ",
            { a: "snapshots", href: "/learn/glossary/disk-snapshot" },
            " away from heavy scans.",
          ],
        },
      ],
    },
    {
      id: "what-a-2-tib-log-store-costs",
      title: "Example: a 2 TiB log store",
      blocks: [
        {
          kind: "callout",
          label: "Worked example",
          text: "A 2 TiB (2,048 GiB) log store is scanned in full each night. Here is its monthly cost on four types, at US East list prices for October 2026.",
        },
        {
          kind: "ul",
          items: [
            "sc1: 2,048 × $0.015 = $30.72. A full scan takes about 3.64 hours.",
            "st1: 2,048 × $0.045 = $92.16. A full scan takes about 1.17 hours.",
            "gp3 at st1’s 500 MiB/s: 2,048 × $0.08 = $163.84, plus 375 MiB/s above the included 125 at $0.04 each, or $15. That’s $178.84.",
            "gp2: 2,048 × $0.10 = $204.80, at 250 MiB/s.",
          ],
        },
        {
          kind: "p",
          text: "The scan times are AWS’s, from a full bucket. gp3 and gp2 hold their rate, while st1 and sc1 burst only while credits last.",
        },
        {
          kind: "p",
          text: "So for one scan a night, st1 does the job for about half the price of gp3. An empty 2 TiB st1 bucket refills at the 80 MiB/s baseline in about 7.3 hours (2,097,152 MiB ÷ 80 MiB/s). That’s well before the next night.",
        },
        {
          kind: "p",
          text: "A 500 GiB archive read once a month suits sc1: 500 × $0.015 = $7.50 a month, against $40 on gp3.",
        },
        { kind: "svg", figure: figure2 },
      ],
    },
    {
      id: "the-type-can-change-later-the-size",
      title: "Changing a volume later",
      blocks: [
        {
          kind: "p",
          text: "Elastic Volumes is AWS’s name for changing a volume in place. On an instance that supports it, you can change a volume’s type, IOPS and throughput while it stays in use. The change is free, and the new price applies from its start.",
        },
        {
          kind: "p",
          text: "So the type isn’t final. A volume takes up to four changes in a rolling 24 hours, each after the last completes.",
        },
        {
          kind: "p",
          text: "The new size and performance must fit the target type. A 100 GiB gp3 volume becomes st1 only if it also grows to 125 GiB. A root volume can’t become st1 or sc1 at all.",
        },
        {
          kind: "p",
          text: "Size only grows. AWS says: “You can’t decrease the volume size.” A smaller volume means a new volume and a copy of the data.",
        },
        { kind: "svg", figure: figure3 },
        {
          kind: "p",
          text: "So keep the size tight: what the data needs, with room for near-term growth. Grow it when it fills.",
        },
        {
          kind: "p",
          text: [
            "A size increase usually takes effect within seconds. ",
            { a: "Increasing EBS volume size", href: "/learn/increase-ebs-volume-size" },
            " shows how to grow the filesystem while it stays mounted. ",
            { a: "Shrinking an EBS volume", href: "/learn/shrink-ebs-volume" },
            " takes a copy and a short stop. ",
            { a: "EBS Elastic Volumes", href: "/learn/ebs-elastic-volumes" },
            " covers every change and its limits.",
          ],
        },
      ],
    },
    {
      id: "where-amoeba-fits",
      title: "Where Amoeba fits",
      blocks: [
        {
          kind: "p",
          text: "The type sets what each GiB costs. The size sets how many GiB you pay for, and on EBS it only grows.",
        },
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " optimizes block storage on Azure and AWS. On AWS, it works on that second number: the size.",
          ],
        },
        { kind: "h3", id: "what-amoeba-does-on-aws", title: "What it does on AWS" },
        {
          kind: "ul",
          items: [
            [
              { b: "What it works on." },
              " The data volumes of running EC2 instances, on Windows and Linux. It never touches the root volume, and it leaves Multi-Attach volumes out.",
            ],
            [
              { b: "The pool." },
              " Amoeba moves an instance’s data volumes onto one btrfs pool of gp3 volumes, sized to your data, with room to grow. Each pool volume gets at least gp3’s included performance, and more when the instance’s load needs it.",
            ],
            [
              { b: "The move." },
              " Amoeba copies your data while your services run. Then it switches each mount to the pool, with a short restart of the services that use it. If the switch fails, it puts the original mounts back and tries again.",
            ],
            [
              { b: "Rightsizing." },
              " Amoeba rightsizes the pool without any downtime. It grows the pool before it fills. When your data goes down and stays down, it shrinks the pool one volume at a time. So you pay for close to what you use.",
            ],
            [
              { b: "The old volumes." },
              " Once the switch is checked, Amoeba snapshots each old volume and deletes it. It keeps each snapshot for 7 days, then deletes that too. You pay for both sets of volumes only while the move runs, then for the snapshots while they’re kept.",
            ],
          ],
        },
        { kind: "h3", id: "which-volumes-suit-a-gp3-pool", title: "Which volumes fit" },
        {
          kind: "p",
          text: "Amoeba acts only on the instances you onboard. Its pool is gp3, so it stops at gp3’s limits. Leave out an instance whose volumes need io2 under the first check.",
        },
        {
          kind: "p",
          text: "gp3 also costs more per GB than either HDD type: $0.08, against $0.045 for st1 and $0.015 for sc1. So with st1 or sc1 volumes, run the numbers before you onboard. A pool reduces cost there only when it needs far fewer GiB than the volumes have.",
        },
        {
          kind: "p",
          text: [
            { a: "EBS cost optimization", href: "/ebs-cost-optimization" },
            " lists what each instance needs.",
          ],
        },
      ],
    },
  ],
  help: {
    product: "amoeba",
    text: "Amoeba moves an EC2 instance’s EBS data volumes onto one pool sized to your data, then rightsizes it autonomously, without any downtime, one volume at a time. We estimate it takes 50–60% off block storage cost. It is an estimated range, not a promise. The free assessment works out your own figure.",
    links: [
      { label: "Block storage optimization with Amoeba", href: "/amoeba" },
      { label: "Estimate your saving", href: "/assessment?p=amoeba" },
    ],
  },
  sources: [
    {
      publisher: "AWS",
      title: "“Amazon EBS volume types”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html",
    },
    {
      publisher: "AWS",
      title: "“Amazon EBS General Purpose SSD volumes”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/general-purpose.html",
    },
    {
      publisher: "AWS",
      title: "“Amazon EBS Provisioned IOPS SSD volumes”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/provisioned-iops.html",
    },
    {
      publisher: "AWS",
      title: "“Amazon EBS Throughput Optimized HDD and Cold HDD volumes”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/hdd-vols.html",
    },
    { publisher: "AWS", title: "“Amazon EBS pricing”", url: "https://aws.amazon.com/ebs/pricing/" },
    {
      publisher: "AWS",
      title: "“Modify an Amazon EBS volume using Elastic Volumes operations”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-modify-volume.html",
    },
    {
      publisher: "AWS",
      title: "“Amazon CloudWatch metrics for Amazon EBS”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/using_cloudwatch_ebs.html",
    },
  ],
  related: [
    {
      title: "gp2 vs gp3 on AWS",
      where: "Learn",
      href: "/learn/gp2-vs-gp3",
    },
    {
      title: "io2 vs gp3: when io2 is worth it",
      where: "Learn",
      href: "/learn/io2-vs-gp3",
    },
    {
      title: "EBS Elastic Volumes",
      where: "Learn",
      href: "/learn/ebs-elastic-volumes",
    },
    {
      title: "Increase EBS volume size without downtime",
      where: "Learn",
      href: "/learn/increase-ebs-volume-size",
    },
    {
      title: "How to shrink an EBS volume",
      where: "Learn",
      href: "/learn/shrink-ebs-volume",
    },
  ],
  relatedTitle: "More on EBS volumes",
};
