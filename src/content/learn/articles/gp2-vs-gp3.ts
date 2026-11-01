import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/gp2-vs-gp3/1";
import { figure as figure2 } from "@/features/learn/figures/gp2-vs-gp3/2";
import { figure as figure3 } from "@/features/learn/figures/gp2-vs-gp3/3";

export const article: Article = {
  slug: "gp2-vs-gp3",
  title: "gp2 vs gp3: pricing, performance and migration",
  meta: "gp2 vs gp3 on Amazon EBS: why gp3 costs 20% less per GB, how it sets IOPS and throughput apart from size, and how to switch a volume while it stays in use.",
  h1: "gp2 vs gp3: pricing, performance and how to migrate",
  deck: "What gp3 changes about performance and price, and how to switch a gp2\u00a0volume while it stays in use.",
  card: "gp3 costs 20% less per GB and sets IOPS apart from size. How to switch a gp2 volume in place.",
  product: "amoeba",
  hub: "Block storage",
  topic: "AWS block storage",
  versus: ["gp2", "gp3"],
  published: "2026-11-01",
  updated: "2026-11-01",
  author: "rupeshankar",
  cover: "/learn-covers/zoorik-learn-gp2-vs-gp3-1200x630.webp",
  coverAlt: "gp2 vs gp3: gp2 IOPS follow volume size, while with gp3 you set IOPS yourself",
  short: [
    "gp2 vs gp3 is a choice between performance that follows size and performance you set. The gp3 type includes 3,000\u00a0IOPS (input/output operations per second) and 125\u00a0MiB/s at any size, and costs 20% less per GB. On a supported instance, ",
    { code: "modify-volume" },
    " switches a volume to gp3 while it stays in use.",
  ],
  sections: [
    {
      id: "gp2-vs-gp3",
      title: "gp2 vs gp3: gp2 ties performance to size, and gp3 lets you set it",
      blocks: [
        {
          kind: "p",
          text: [
            "Picture a busy 100\u00a0GiB gp2\u00a0volume with a baseline of 300 ",
            { a: "IOPS", href: "/learn/glossary/iops" },
            ". A full balance of I/O credits lets it burst to 3,000\u00a0IOPS for 2,000\u00a0seconds, about 33\u00a0minutes. Then it falls back to its baseline.",
          ],
        },
        {
          kind: "p",
          text: [
            "On ",
            { a: "gp3", href: "/learn/glossary/ebs-gp3" },
            ", the same volume holds 3,000\u00a0IOPS all day, ten times its gp2 baseline. It costs $8.00 a month instead of $10.00, at the list prices in the table below.",
          ],
        },
        {
          kind: "p",
          text: [
            "Both are General Purpose SSD types in Amazon Elastic Block Store (EBS). AWS released gp3 in December 2020, and documents the same single-digit millisecond ",
            { a: "latency", href: "/learn/glossary/disk-latency" },
            " and 99.8 to 99.9 percent durability for both.",
          ],
        },
        {
          kind: "table",
          columns: [
            { label: "", width: "17%" },
            { label: "gp2", width: "40%" },
            { label: "gp3", width: "43%" },
          ],
          rows: [
            [
              "Price, US East (N. Virginia), October 2026",
              "$0.10 per GB-month, performance included",
              "$0.08 per GB-month, plus $0.005 per IOPS-month above 3,000 and $0.040 per MB/s-month above 125",
            ],
            [
              "Baseline IOPS",
              "3 per GiB: 100 at 33.33\u00a0GiB and below, 3,000 at 1,000\u00a0GiB, 16,000 from 5,334\u00a0GiB",
              "3,000 at any size",
            ],
            [
              "Burst",
              "To 3,000\u00a0IOPS below 1\u00a0TiB, while I/O credits last",
              "None: provisioned performance is sustained",
            ],
            ["Most IOPS per volume", "16,000", "80,000, at up to 500\u00a0IOPS per GiB"],
            [
              "Throughput",
              "128\u00a0MiB/s at 170\u00a0GiB and below, 250\u00a0MiB/s from 334\u00a0GiB",
              "125\u00a0MiB/s included, up to 2,000\u00a0MiB/s at 0.25\u00a0MiB/s per IOPS",
            ],
            ["Size", "1\u00a0GiB to 16\u00a0TiB", "1\u00a0GiB to 64\u00a0TiB"],
            [
              "Performance without more GiB",
              "Not possible: performance follows size",
              "Set IOPS and throughput on their own",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Prices differ by Region and change, so check the ",
            { a: "EBS pricing page", href: "https://aws.amazon.com/ebs/pricing/" },
            " for yours. That page counts a GB as 1024³ bytes, which is a GiB. For the other types, see ",
            { a: "EBS volume types", href: "/learn/ebs-volume-types" },
            ".",
          ],
        },
      ],
    },
    {
      id: "gp2-vs-gp3-performance-gp3-sustains-what",
      title: "gp2 vs gp3 performance: gp3 sustains what gp2 bursts to",
      blocks: [
        {
          kind: "p",
          text: [
            "Under 1,000\u00a0GiB, a gp2\u00a0volume reaches 3,000\u00a0IOPS only in bursts paid for with I/O credits. Its baseline is 3\u00a0IOPS per GiB, with a floor of 100 and a ceiling of 16,000. The ",
            { code: "BurstBalance" },
            " metric in Amazon CloudWatch shows the percentage of credits left.",
          ],
        },
        { kind: "p", text: "Throughput follows size too:" },
        {
          kind: "ul",
          items: [
            [{ b: "170\u00a0GiB or less:" }, " up to 128\u00a0MiB/s."],
            [{ b: "Over 170 and under 334\u00a0GiB:" }, " bursts of up to 250\u00a0MiB/s."],
            [{ b: "334\u00a0GiB or more:" }, " 250\u00a0MiB/s."],
          ],
        },
        {
          kind: "p",
          text: "The gp3 type doesn’t burst. AWS says gp3\u00a0volumes “can indefinitely sustain their full provisioned IOPS and throughput performance”. A gp2 baseline needs 1,000\u00a0GiB to reach the 3,000\u00a0IOPS that gp3 includes at any size.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "callout",
          label: "For engineers",
          text: "A gp2\u00a0volume starts with 5.4 million I/O credits, the most it can hold. It earns them back at 3 credits per GiB per second while its I/O stays at or below baseline.",
        },
        {
          kind: "p",
          text: "In AWS’s 100\u00a0GiB example, a full refill takes 18,000\u00a0seconds (5\u00a0hours).",
        },
        {
          kind: "p",
          text: [
            { a: "gp3\u00a0IOPS and throughput", href: "/learn/glossary/ebs-gp3" },
            " are two separate settings:",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "IOPS:" },
              " 3,000 included, up to 80,000, at no more than 500\u00a0IOPS per GiB. So the maximum needs 160\u00a0GiB or more.",
            ],
            [
              { b: "Throughput:" },
              " 125\u00a0MiB/s included, up to 2,000\u00a0MiB/s, at no more than 0.25\u00a0MiB/s per provisioned IOPS. So 2,000\u00a0MiB/s needs at least 8,000\u00a0IOPS.",
            ],
          ],
        },
        {
          kind: "p",
          text: "Elastic Volumes, AWS’s name for changing a volume in place, can change either setting later without touching the size.",
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "A gp2\u00a0volume of 334\u00a0GiB or more delivers 250\u00a0MiB/s, twice the 125\u00a0MiB/s gp3 includes. One above 1,000\u00a0GiB has a baseline above 3,000\u00a0IOPS.",
        },
        {
          kind: "p",
          text: "Left at gp3’s baseline, such a volume gets less than it had. Raise its throughput or IOPS in the switch if its workload uses them.",
        },
        {
          kind: "p",
          text: [
            "The instance has ",
            { a: "EBS limits", href: "/learn/glossary/ebs-optimized-instance" },
            " of its own, which no volume setting changes. On Nitro instances other than bare metal, two CloudWatch metrics report when an application tries to go past them: ",
            { code: "InstanceEBSIOPSExceededCheck" },
            " and ",
            { code: "InstanceEBSThroughputExceededCheck" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "For latency-sensitive workloads, AWS recommends io2 Block Express, which ",
            { a: "io2 vs gp3", href: "/learn/io2-vs-gp3" },
            " compares.",
          ],
        },
      ],
    },
    {
      id: "gp2-vs-gp3-pricing-gp3-costs-less",
      title: "gp2 vs gp3 pricing: gp3 costs less even with performance matched",
      blocks: [
        {
          kind: "p",
          text: "A gp2\u00a0volume has one price, per GB-month, with its IOPS and throughput included. A gp3\u00a0volume has three, the last two only when you provision them:",
        },
        {
          kind: "ul",
          items: [
            "Storage, at 20% less per GB.",
            "IOPS above 3,000.",
            "Throughput above 125\u00a0MiB/s.",
          ],
        },
        {
          kind: "p",
          text: "AWS’s Prescriptive Guidance says gp3\u00a0volumes “are always cheaper than gp2\u00a0volumes if they’re configured at the same performance levels”.",
        },
        { kind: "p", text: "The same guidance prices three cases at the table’s rates:" },
        {
          kind: "ul",
          items: [
            [
              { b: "100\u00a0GiB:" },
              " $10.00 a month on gp2, against $8.00 on gp3, or $8.12 with throughput set to gp2’s 128\u00a0MiB/s.",
            ],
            [
              { b: "1,000\u00a0GiB:" },
              " $100 on gp2, against $80 on gp3, rising to $85 with 250\u00a0MiB/s.",
            ],
          ],
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "The third case is a 6,000\u00a0GiB gp2\u00a0volume at 16,000\u00a0IOPS and 250\u00a0MiB/s. On gp2 it costs 6,000 × $0.10 = $600 a month.",
        },
        {
          kind: "p",
          text: "On gp3 the same performance costs $550 a month, which is $50, or 8%, less:",
        },
        {
          kind: "ul",
          items: [
            "Storage is 6,000 × $0.08 = $480.",
            "The 13,000\u00a0IOPS above 3,000 add 13,000 × $0.005 = $65.",
            "The 125\u00a0MiB/s above 125 add 125 × $0.04 = $5.",
          ],
        },
        {
          kind: "p",
          text: "In AWS’s examples, gp2 to gp3 cost savings run from that 8%, with performance matched in full, to 20% at the gp3 baseline. Where you land depends on what you use.",
        },
        {
          kind: "p",
          text: "A 1,000\u00a0GiB volume that never drives more than 125\u00a0MiB/s has no reason to pay $5 a month for 250. AWS’s General Purpose SSD page links a calculator for the saving on your own gp2\u00a0volumes.",
        },
      ],
    },
    {
      id: "a-gp2-to-gp3-migration-in-five",
      title: "A gp2 to gp3 migration in five steps",
      blocks: [
        {
          kind: "p",
          text: "A gp2 to gp3 migration changes the type of the volume you already have. It keeps the size, so there’s nothing to grow inside the instance afterwards.",
        },
        {
          kind: "p",
          text: "New volumes can still arrive as gp2. The EC2 console selects gp3 when you create a volume or an AMI from a snapshot. In other cases, AWS says “gp2 is the default selection”, so check your launch templates and scripts before you migrate what they made.",
        },
        {
          kind: "ol",
          items: [
            {
              text: "List the gp2\u00a0volumes in a Region.",
              blocks: [
                {
                  kind: "code",
                  lang: "bash",
                  code: 'aws ec2 describe-volumes \\\n    --filters Name=volume-type,Values=gp2 \\\n    --query "Volumes[*].{ID:VolumeId,Size:Size,Iops:Iops,State:State}"',
                },
              ],
            },
            {
              text: "Check what each volume uses. A gp2\u00a0volume under 1,000\u00a0GiB never goes above its 3,000\u00a0IOPS burst ceiling, so the gp3 baseline covers its IOPS.",
              blocks: [
                {
                  kind: "p",
                  text: [
                    "On a Nitro instance, the CloudWatch metrics ",
                    { code: "VolumeAvgIOPS" },
                    " and ",
                    { code: "VolumeAvgThroughput" },
                    " report each minute’s average IOPS and throughput, the second in KiB/s. Compare a larger volume’s peak IOPS with 3,000. A throughput peak above 128,000\u00a0KiB/s, which is 125\u00a0MiB/s, is a sign the volume needs more than the gp3 baseline.",
                  ],
                },
              ],
            },
            [
              "Take a ",
              { a: "snapshot", href: "/learn/glossary/disk-snapshot" },
              " if the volume holds data you care about, so you can roll back.",
            ],
            {
              text: "Change the type and name both performance values. You can’t cancel a modification once it’s submitted, so check the volume ID and the values first.",
              blocks: [
                {
                  kind: "p",
                  text: [
                    "This example suits a gp2\u00a0volume of 334 to 1,000\u00a0GiB and keeps its 250\u00a0MiB/s. Above 1,000\u00a0GiB, set ",
                    { code: "--iops" },
                    " to at least the measured peak.",
                  ],
                },
                {
                  kind: "code",
                  lang: "bash",
                  code: "aws ec2 modify-volume \\\n    --volume-id <volume-id> \\\n    --volume-type gp3 \\\n    --iops 3000 \\\n    --throughput 250",
                },
                {
                  kind: "p",
                  text: "Leave IOPS and throughput out, and the EBS user guide says EBS provisions the gp2\u00a0volume’s equivalent or the gp3 baseline, whichever is higher. The AWS CLI reference lists 3,000\u00a0IOPS and 125\u00a0MiB/s as the defaults instead. Name both, and the result doesn’t depend on which applies.",
                },
              ],
            },
            {
              text: ["Watch the modification until it reports ", { code: "completed" }, "."],
              blocks: [
                {
                  kind: "code",
                  lang: "bash",
                  code: "aws ec2 describe-volumes-modifications --volume-ids <volume-id>",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "gp2-to-gp3-migration-downtime-the-volume",
      title: "gp2 to gp3 migration downtime: the volume stays in use",
      blocks: [
        {
          kind: "p",
          text: "On an instance that supports Elastic Volumes, the change runs “without detaching the volume or restarting the instance”, AWS says. Modifying a volume costs nothing, and the gp3 price applies as soon as the modification starts.",
        },
        {
          kind: "p",
          text: [
            "The modification moves through three states: ",
            { code: "modifying" },
            ", ",
            { code: "optimizing" },
            " and ",
            { code: "completed" },
            ". While it’s optimizing, AWS says performance sits between the source and target configurations. Unless you’re reducing IOPS, it “will be no less than the source volume performance”.",
          ],
        },
        {
          kind: "p",
          text: "AWS gives a few minutes to a few hours for a performance change, and typically about 6\u00a0hours for a fully used 1\u00a0TiB volume. A volume that isn’t fully initialized can take more than 24\u00a0hours.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: [
            "Each volume takes one modification at a time, up to four in a rolling 24-hour period. To tune IOPS straight after the switch, wait for ",
            { code: "completed" },
            " first.",
          ],
        },
        {
          kind: "p",
          text: "AWS has a fallback for a previous-generation instance type that doesn’t support Elastic Volumes, or after an error from the modify call. Detach a non-root volume, modify it and attach it again. For a root volume, stop the instance.",
        },
        {
          kind: "p",
          text: [
            "A volume attached before 3 November 2016 at 23:40 UTC needs Elastic Volumes support initialized first. For other type and size changes, see ",
            { a: "EBS Elastic Volumes", href: "/learn/ebs-elastic-volumes" },
            ".",
          ],
        },
      ],
    },
    {
      id: "switching-to-gp3-keeps-every-gib-you",
      title: "Switching to gp3 keeps every GiB you provision",
      blocks: [
        {
          kind: "p",
          text: "AWS charges for volume storage by “the amount of GB you provision per month until you release the storage”. Elastic Volumes can’t make a volume smaller, either: “You can’t decrease the volume size.”",
        },
        {
          kind: "p",
          text: "Take a 1,000\u00a0GiB gp2\u00a0volume that holds 300\u00a0GiB of data. After the switch it costs $80 a month at the gp3 baseline instead of $100. Yet 700\u00a0GiB of it still holds nothing.",
        },
        {
          kind: "p",
          text: "At $0.08 per GB-month, that empty space costs $56 a month. That’s more than the $20 the switch saved.",
        },
        { kind: "svg", figure: figure3 },
        {
          kind: "p",
          text: "Reducing that takes a copy. AWS’s route is to create a smaller volume and move the data with an application-level tool such as rsync.",
        },
        {
          kind: "p",
          text: [
            { a: "How to shrink an EBS volume", href: "/learn/shrink-ebs-volume" },
            " has the steps, including the short stop the move needs. ",
            { a: "Checking EBS volume usage", href: "/learn/check-ebs-volume-usage" },
            " shows how to measure the used space first.",
          ],
        },
        {
          kind: "p",
          text: [
            "If a volume is mostly empty, create the new one as gp3, and the copy changes type and size in one move. The ",
            { a: "EBS pricing calculator", href: "/ebs-and-azure-disk-pricing" },
            " prices a volume’s empty space on gp2 or gp3.",
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
          text: [
            "Switching to gp3 reduces the price of each GiB. ",
            { a: "Amoeba", href: "/amoeba" },
            " optimizes block storage on Azure and AWS. On AWS, its ",
            { a: "EBS cost optimization", href: "/ebs-cost-optimization" },
            " works on the number of GiB you pay for.",
          ],
        },
        { kind: "h3", id: "what-amoeba-does-on-aws", title: "What Amoeba does on AWS" },
        {
          kind: "ul",
          items: [
            [
              { b: "The pool." },
              " Amoeba moves a running instance’s EBS data volumes onto one btrfs pool of gp3\u00a0volumes, sized to your data with room to grow. Each mount keeps its path, and the root volume is never touched.",
            ],
            [
              { b: "Performance." },
              " Each pool volume gets at least gp3’s included performance, and more when the instance’s load needs it.",
            ],
            [
              { b: "The move." },
              " Amoeba copies your data while your services run. Then it switches each mount to the pool, with a short restart of the services that use it. If the switch fails, it puts the original mounts back and tries again.",
            ],
            [
              { b: "Rightsizing." },
              " Amoeba grows the pool before it fills. When your data goes down and stays down, it shrinks the pool one volume at a time. So the GiB you pay for follow your data.",
            ],
            [
              { b: "The old volumes." },
              " Once the switch is checked, Amoeba snapshots and deletes each old volume, then deletes the snapshots a few days later. You pay for both sets only while the move runs, then for the snapshots.",
            ],
          ],
        },
        { kind: "h3", id: "what-an-instance-needs", title: "What an instance needs" },
        {
          kind: "p",
          text: "Amoeba works on Windows and Linux instances. On AWS, an instance must be running, managed by AWS Systems Manager and a Nitro type. It needs an EBS data volume and a few free attachment slots for the pool.",
        },
        {
          kind: "p",
          text: "On Linux, it needs a recent kernel with btrfs, and every service that keeps a data mount open must run under systemd.",
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
      title: "“Amazon EBS General Purpose SSD volumes”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/general-purpose.html",
    },
    { publisher: "AWS", title: "“Amazon EBS pricing”", url: "https://aws.amazon.com/ebs/pricing/" },
    {
      publisher: "AWS Prescriptive Guidance",
      title: "“Migrate Amazon EBS volumes from gp2 to gp3”",
      url: "https://docs.aws.amazon.com/prescriptive-guidance/latest/optimize-costs-microsoft-workloads/ebs-migrate-gp2-gp3.html",
    },
    {
      publisher: "AWS",
      title: "“Modify an Amazon EBS volume using Elastic Volumes operations”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-modify-volume.html",
    },
    {
      publisher: "AWS",
      title: "“Monitor the progress of Amazon EBS volume modifications”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/monitoring-volume-modifications.html",
    },
    {
      publisher: "AWS CLI Command Reference",
      title: "“modify-volume”",
      url: "https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-volume.html",
    },
    {
      publisher: "AWS CLI Command Reference",
      title: "“describe-volumes”",
      url: "https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-volumes.html",
    },
    {
      publisher: "AWS",
      title: "“Amazon CloudWatch metrics for Amazon EBS”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/using_cloudwatch_ebs.html",
    },
  ],
  related: [
    {
      title: "EBS volume types: pricing and how to choose",
      where: "Learn",
      href: "/learn/ebs-volume-types",
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
      title: "How to shrink an EBS volume when AWS only lets it grow",
      where: "Learn",
      href: "/learn/shrink-ebs-volume",
    },
    {
      title: "What AWS Compute Optimizer recommends for EBS volumes",
      where: "Learn",
      href: "/learn/compute-optimizer-ebs",
    },
  ],
};
