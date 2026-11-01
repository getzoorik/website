import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/ebs-volume-types/1";
import { figure as figure2 } from "@/features/learn/figures/ebs-volume-types/2";
import { figure as figure3 } from "@/features/learn/figures/ebs-volume-types/3";

export const article: Article = {
  slug: "ebs-volume-types",
  title: "EBS volume types: pricing and how to choose",
  meta: "EBS volume types compared: gp3, gp2, io2, io1, st1 and sc1, what each one charges for at US East list prices, and the checks, in order, that pick one.",
  h1: "EBS volume types: pricing and how to choose",
  deck: "Six current types in two families, what each one charges for, and the checks that pick one for your data.",
  card: "gp3, gp2, io2, io1, st1 and sc1 side by side on limits and list price, with the checks that pick one.",
  product: "amoeba",
  hub: "Block storage",
  topic: "AWS block storage",
  published: "2026-11-01",
  updated: "2026-11-01",
  author: "rupeshankar",
  cover: "/learn-covers/zoorik-learn-ebs-volume-types-1200x630.webp",
  coverAlt:
    "EBS volume types: gp3, gp2 and io2 by price per GB-month, with gp3 the cheapest and ticked",
  short:
    "Amazon EBS volume types come in two families, SSD (gp3, gp2, io2 and io1) and HDD (st1 and sc1). Use gp3 by default, with 3,000\u00a0IOPS included, io2 only past gp3’s limits, and st1 or sc1 only for large, sequential data.",
  sections: [
    {
      id: "ebs-volume-types",
      title: "EBS volume types compared: size, IOPS, throughput and price",
      blocks: [
        {
          kind: "p",
          text: "Picture one new EC2 instance with three data volumes. A 200\u00a0GiB database makes small, random reads and writes all day. A 2\u00a0TiB log store is scanned in full each night, and a 500\u00a0GiB archive is read once a month.",
        },
        {
          kind: "p",
          text: "Each suits a different EBS volume type, and the wrong one costs more or runs slower.",
        },
        {
          kind: "p",
          text: [
            "An ",
            { a: "Amazon Elastic Block Store (EBS) volume", href: "/learn/glossary/ebs-volume" },
            " is ",
            { a: "block storage", href: "/learn/glossary/block-storage" },
            " that you attach to an EC2 instance. AWS EBS volume types differ in performance and price, and you choose one for each volume.",
          ],
        },
        {
          kind: "p",
          text: "The current generation has six types of EBS volumes, in two families:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "SSD, solid-state drive." },
              " For transactional work with frequent, small reads and writes, where ",
              { a: "input/output operations per second (IOPS)", href: "/learn/glossary/iops" },
              " matter most. General Purpose SSD is ",
              { a: "gp3", href: "/learn/glossary/ebs-gp3" },
              " and gp2, and ",
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
          text: "This EBS volume types comparison puts AWS’s limits beside the list prices for US East (N. Virginia), October 2026:",
        },
        {
          kind: "table",
          columns: [
            { label: "Type", width: "14%" },
            { label: "Use cases AWS lists", width: "37%" },
            { label: "Size", width: "14%" },
            { label: "Most IOPS", width: "14%" },
            { label: "Most throughput", width: "14%" },
            { label: "Storage, per GB-month", width: "14%" },
            { label: "Charged on top", width: "10%" },
          ],
          rows: [
            [
              "gp3",
              "Most workloads: boot volumes, medium-sized databases, interactive apps, dev and test",
              "1\u00a0GiB to 64\u00a0TiB",
              "80,000",
              "2,000\u00a0MiB/s",
              "$0.08",
              "IOPS above 3,000 at $0.005, and MB/s above 125 at $0.040, each per month",
            ],
            [
              "gp2",
              "The same as gp3, with performance set by size",
              "1\u00a0GiB to 16\u00a0TiB",
              "16,000",
              "250\u00a0MiB/s",
              "$0.10",
              "Nothing: I/O is included",
            ],
            [
              "io2 Block Express",
              "Steady sub-millisecond latency, or more than 80,000\u00a0IOPS or 2,000\u00a0MiB/s",
              "4\u00a0GiB to 64\u00a0TiB",
              "256,000",
              "4,000\u00a0MiB/s",
              "$0.125",
              "Every IOPS, from $0.065 per IOPS-month, with smaller rates past 32,000 and 64,000",
            ],
            [
              "io1",
              "I/O-intensive databases",
              "4\u00a0GiB to 16\u00a0TiB",
              "64,000",
              "1,000\u00a0MiB/s",
              "$0.125",
              "Every IOPS, at $0.065 per IOPS-month",
            ],
            [
              "st1",
              "Big data, data warehouses, log processing",
              "125\u00a0GiB to 16\u00a0TiB",
              "500, at 1\u00a0MiB per I/O",
              "500\u00a0MiB/s",
              "$0.045",
              "Nothing: I/O is included",
            ],
            [
              "sc1",
              "Data read infrequently, where storage cost matters most",
              "125\u00a0GiB to 16\u00a0TiB",
              "250, at 1\u00a0MiB per I/O",
              "250\u00a0MiB/s",
              "$0.015",
              "Nothing: I/O is included",
            ],
          ],
        },
        {
          kind: "p",
          text: "AWS calls Provisioned IOPS SSD its highest-performance volumes, and io2 Block Express is the faster of the two. It’s also the only type designed for 99.999% durability, against 99.8% to 99.9% for the rest.",
        },
        {
          kind: "p",
          text: [
            "Each instance has its own ",
            { a: "EBS limits", href: "/learn/glossary/ebs-optimized-instance" },
            ", and a volume gets no more than they allow.",
          ],
        },
        {
          kind: "p",
          text: "Magnetic (standard) volumes are the previous generation, from 1\u00a0GiB to 1\u00a0TiB, with a maximum of 40 to 200\u00a0IOPS. AWS recommends a current type when you need more performance, or steadier performance.",
        },
      ],
    },
    {
      id: "ebs-volume-types-pricing-what-each-type",
      title: "EBS volume types pricing: what each type charges for",
      blocks: [
        {
          kind: "p",
          text: "Every type charges for capacity. AWS charges volume storage “by the amount of GB you provision per month”, until you release it. So a volume costs its full size, however little data it holds.",
        },
        { kind: "p", text: "Beyond storage, the types charge in three ways:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Storage only: gp2, st1 and sc1." },
              " “I/O is included in the price of the volumes,” AWS says. The performance comes with the size you choose.",
            ],
            [
              { b: "Storage plus extra performance: gp3." },
              " Each volume includes 3,000\u00a0IOPS and 125\u00a0MiB/s. You pay only for the IOPS and throughput you add above those.",
            ],
            [
              { b: "Storage plus every IOPS: io2 and io1." },
              " You pay for each IOPS you provision. On io2, the rate per IOPS steps down past 32,000 on a volume, and again past 64,000.",
            ],
          ],
        },
        {
          kind: "p",
          text: "Per GB, the six prices span more than eight to one, from $0.015 to $0.125. Of the HDD types, sc1 costs a third of st1. Among the SSDs, gp3 costs 20% less than gp2, and io2 and io1 cost 56% more than gp3.",
        },
        {
          kind: "p",
          text: [
            "Prices differ by Region and change, so check AWS’s pricing page for yours. The ",
            { a: "EBS pricing calculator", href: "/ebs-and-azure-disk-pricing" },
            " shows what a gp3 or gp2\u00a0volume costs a month at list price, and what its empty space costs.",
          ],
        },
      ],
    },
    {
      id: "how-to-choose-an-ebs-volume-type",
      title: "How to choose an EBS volume type, in order",
      blocks: [
        {
          kind: "p",
          text: "On EBS, the I/O pattern settles SSD vs HDD. Three checks, asked in order, then pick one type.",
        },
        { kind: "h3", id: "measure-what-the-volume-does", title: "Measure what the volume does" },
        {
          kind: "p",
          text: [
            "On a Nitro instance, the Amazon CloudWatch metrics ",
            { code: "VolumeAvgIOPS" },
            " and ",
            { code: "VolumeAvgThroughput" },
            " give each minute’s average IOPS, and its throughput in KiB/s.",
          ],
        },
        {
          kind: "p",
          text: [
            { code: "VolumeIOPSExceededCheck" },
            " and ",
            { code: "VolumeThroughputExceededCheck" },
            " read 1 when the application keeps asking for more than the volume has. On gp2, st1 and sc1, ",
            { code: "BurstBalance" },
            " shows the share of credits left.",
          ],
        },
        {
          kind: "h3",
          id: "three-checks-that-pick-the-type",
          title: "Three checks that pick the type",
        },
        { kind: "p", text: "Ask these in order, and stop at the first yes:" },
        {
          kind: "ol",
          items: [
            [
              { b: "Does one volume need more than gp3 can give?" },
              " That means more than 80,000\u00a0IOPS or 2,000\u00a0MiB/s, steady sub-millisecond latency, or 99.999% durability. It also covers Multi-Attach, one volume attached to several instances, which only io1 and io2 support. If so, use io2. ",
              { a: "io2 vs gp3", href: "/learn/io2-vs-gp3" },
              " prices each case.",
            ],
            [
              { b: "Is the I/O large and sequential?" },
              " HDD fits only a data volume of 125\u00a0GiB or more, since st1 and sc1 can’t boot. AWS points small, random I/O to SSD instead. If so, use st1 or sc1, as the next section explains.",
            ],
            [
              { b: "Everything else gets gp3." },
              " Provision the IOPS and throughput you measured, above the included 3,000 and 125\u00a0MiB/s.",
            ],
          ],
        },
        { kind: "svg", figure: figure1 },
        { kind: "h3", id: "volumes-you-already-have", title: "Volumes you already have" },
        { kind: "p", text: "Two types are worth moving away from:" },
        {
          kind: "ul",
          items: [
            [
              { b: "gp2 to gp3." },
              " gp3 costs 20% less per GiB and includes 3,000\u00a0IOPS at any size. A gp2\u00a0volume of 334\u00a0GiB or more has 250\u00a0MiB/s, though, so set gp3’s throughput to match. ",
              { a: "gp2 vs gp3", href: "/learn/gp2-vs-gp3" },
              " has the steps.",
            ],
            [
              { b: "io1 to io2." },
              " Both cost $0.125 per GB-month, and $0.065 per IOPS-month up to 32,000. Yet io2 allows 1,000\u00a0IOPS per GiB, against io1’s 50, and it’s designed for 99.999% durability.",
            ],
          ],
        },
      ],
    },
    {
      id: "st1-vs-sc1-two-hdd-types-for",
      title: "st1 vs sc1: two HDD types for large, sequential data",
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
              " builds credits at 40\u00a0MiB/s per TiB and bursts at 250\u00a0MiB/s per TiB, up to 500\u00a0MiB/s. At 2\u00a0TiB, that’s 80\u00a0MiB/s baseline and 500\u00a0MiB/s burst.",
            ],
            [
              { b: "sc1" },
              " builds credits at 12\u00a0MiB/s per TiB and bursts at 80\u00a0MiB/s per TiB, up to 250\u00a0MiB/s. At 2\u00a0TiB, that’s 24\u00a0MiB/s and 160\u00a0MiB/s.",
            ],
          ],
        },
        {
          kind: "p",
          text: "A full bucket holds enough credits for one full scan of the volume. AWS’s advice is to use st1 when scans must finish fast or run several times a day. Use sc1 when the data is read rarely and 250\u00a0MiB/s is enough.",
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "On st1 and sc1, each I/O of 1\u00a0MiB or less spends a full 1\u00a0MiB of credit. Only sequential I/Os merge into 1\u00a0MiB blocks, so small, random I/O drains the bucket fast.",
        },
        {
          kind: "p",
          text: [
            "While a snapshot of an st1 or sc1\u00a0volume runs, its performance may drop as far as its baseline. So schedule ",
            { a: "snapshots", href: "/learn/glossary/disk-snapshot" },
            " away from the nightly scan.",
          ],
        },
      ],
    },
    {
      id: "what-a-2-tib-log-store-costs",
      title: "What a 2\u00a0TiB log store costs on each type",
      blocks: [
        {
          kind: "callout",
          label: "Worked example",
          text: "Take the 2\u00a0TiB (2,048\u00a0GiB) log store from the opening, at US East list prices for October 2026. On sc1 it costs 2,048 × $0.015 = $30.72 a month, and on st1 2,048 × $0.045 = $92.16.",
        },
        {
          kind: "p",
          text: "From a full bucket, AWS’s scan-time table puts a full 2\u00a0TiB scan at about 3.64\u00a0hours on sc1 and 1.17\u00a0hours on st1. Matching st1’s 500\u00a0MiB/s on gp3 costs more, since gp3 includes only 125\u00a0MiB/s:",
        },
        {
          kind: "ul",
          items: [
            "Storage is 2,048 × $0.08 = $163.84.",
            "The 375\u00a0MB/s above 125 add 375 × $0.040 = $15.",
            "That’s $178.84 a month, sustained rather than burst.",
          ],
        },
        {
          kind: "p",
          text: "On gp2, the same volume costs 2,048 × $0.10 = $204.80, at 250\u00a0MiB/s. So for one scan a night, st1 does the job for about half the price of gp3.",
        },
        {
          kind: "p",
          text: "At 80\u00a0MiB/s, an empty st1 bucket of that size refills in about 7.3\u00a0hours (2,097,152\u00a0MiB ÷ 80\u00a0MiB/s), well before the next night. The monthly archive suits sc1: 500 × $0.015 = $7.50 a month, against $40 on gp3.",
        },
        { kind: "svg", figure: figure2 },
      ],
    },
    {
      id: "the-type-can-change-later-the-size",
      title: "The type can change later, the size only grows",
      blocks: [
        {
          kind: "p",
          text: "Elastic Volumes is AWS’s name for changing a volume in place. On an instance that supports it, you can change a volume’s type, IOPS and throughput while it stays in use. The change itself costs nothing, and the new price applies from its start.",
        },
        {
          kind: "p",
          text: "So the type isn’t a final choice. Each volume takes up to four changes in a rolling 24\u00a0hours, each after the last has completed.",
        },
        {
          kind: "p",
          text: "The new size and performance must fit the target type. A 100\u00a0GiB gp3\u00a0volume becomes st1 only if it also grows to 125\u00a0GiB. A root volume of type io1, io2, gp2, gp3 or standard can’t become st1 or sc1 at all.",
        },
        {
          kind: "p",
          text: "Size is the one setting that only grows. AWS says: “You can’t decrease the volume size.” A smaller volume means a new volume and a copy of the data.",
        },
        { kind: "svg", figure: figure3 },
        {
          kind: "p",
          text: "So keep the size tight. Give a volume what its data needs, with room for near-term growth, and grow it when it fills.",
        },
        {
          kind: "p",
          text: [
            "A size increase usually takes effect within seconds, and ",
            { a: "increasing EBS volume size", href: "/learn/increase-ebs-volume-size" },
            " shows how to grow the filesystem while it stays mounted. ",
            { a: "Shrinking an EBS volume", href: "/learn/shrink-ebs-volume" },
            " takes the copy and a short stop. ",
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
            " optimizes block storage on Azure and AWS, and on AWS it targets that second number.",
          ],
        },
        { kind: "h3", id: "what-amoeba-does-on-aws", title: "What Amoeba does on AWS" },
        {
          kind: "ul",
          items: [
            [
              { b: "What it works on." },
              " The data volumes of running EC2 instances, on Windows and Linux. It never touches the root volume, and it leaves Multi-Attach volumes out.",
            ],
            [
              { b: "The pool." },
              " Amoeba moves an instance’s EBS data volumes onto one btrfs pool of gp3\u00a0volumes, sized to your data, with room to grow. Each pool volume gets at least gp3’s included performance, and more when the instance’s load needs it.",
            ],
            [
              { b: "The move." },
              " Amoeba copies your data while your services run. Then it switches each mount to the pool, with a short restart of the services that use it.",
            ],
            [
              { b: "Rightsizing." },
              " It grows the pool before it fills. When your data goes down and stays down, it shrinks the pool one volume at a time.",
            ],
            [
              { b: "The old volumes." },
              " Once the switch is checked, Amoeba snapshots and deletes each old volume, then deletes the snapshots a few days later. You pay for both sets of volumes only while the move runs, then for the snapshots while they’re kept.",
            ],
          ],
        },
        { kind: "h3", id: "which-volumes-suit-a-gp3-pool", title: "Which volumes suit a gp3 pool" },
        {
          kind: "p",
          text: "Amoeba acts only on the instances you onboard. Because the pool is gp3, it stops at gp3’s limits, so leave out an instance whose volumes need io2 under the first check above.",
        },
        {
          kind: "p",
          text: "Per GiB, gp3 also costs more than either HDD type. At list price, sc1 costs 19% of gp3 and st1 56% ($0.015 and $0.045 against $0.08).",
        },
        {
          kind: "p",
          text: "So run the numbers before you onboard an instance with st1 or sc1\u00a0volumes. A pool reduces cost there only when it needs far fewer GiB than the volumes have.",
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
    text: "Amoeba moves a VM’s data disks onto one pool sized to your data, then rightsizes it autonomously, without any downtime after the one switch, one disk at a time. We estimate it takes 50–60% off block storage cost. It is an estimated range, not a promise. The free assessment works out your own figure.",
    links: [
      { label: "Block storage cost optimization with Amoeba", href: "/amoeba" },
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
      title: "gp2 vs gp3: pricing, performance and how to migrate",
      where: "Learn",
      href: "/learn/gp2-vs-gp3",
    },
    {
      title: "io2 vs gp3: when Provisioned IOPS is worth the price",
      where: "Learn",
      href: "/learn/io2-vs-gp3",
    },
    {
      title: "EBS Elastic Volumes: what you can change, and what you can’t",
      where: "Learn",
      href: "/learn/ebs-elastic-volumes",
    },
    {
      title: "How to increase EBS volume size without downtime on Linux",
      where: "Learn",
      href: "/learn/increase-ebs-volume-size",
    },
    {
      title: "How to shrink an EBS volume when AWS only lets it grow",
      where: "Learn",
      href: "/learn/shrink-ebs-volume",
    },
  ],
};
