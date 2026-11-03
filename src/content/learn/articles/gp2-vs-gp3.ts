import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/gp2-vs-gp3/1";
import { figure as figure2 } from "@/features/learn/figures/gp2-vs-gp3/2";
import { figure as figure3 } from "@/features/learn/figures/gp2-vs-gp3/3";

export const article: Article = {
  slug: "gp2-vs-gp3",
  title: "gp2 vs gp3: pricing, performance and migration",
  meta: "gp2 vs gp3 on AWS: gp3 costs 20% less per GB and doesn’t tie IOPS or throughput to size. How to switch a volume to gp3 while it stays in use.",
  h1: "gp2 vs gp3 on AWS",
  deck: "Pricing, performance and the switch, with AWS’s list prices and the CLI steps.",
  card: "gp3 costs 20% less per GB and doesn’t tie IOPS to size. How to switch a volume in place.",
  product: "amoeba",
  hub: "Block storage",
  topic: "AWS block storage",
  versus: ["gp2", "gp3"],
  published: "2026-11-01",
  updated: "2026-11-03",
  author: "rupeshankar",
  cover: "/learn-covers/zoorik-learn-gp2-vs-gp3-1200x630.webp",
  coverAlt: "gp2 IOPS follow volume size, while with gp3 you set IOPS yourself",
  short: [
    "gp2 ties IOPS (input/output operations per second) and throughput to volume size. gp3 includes 3,000\u00a0IOPS and 125\u00a0MiB/s at any size, lets you add more without growing the volume, and costs 20% less per GB. At the same performance, AWS says gp3 always costs less. On an instance that supports Elastic Volumes, ",
    { code: "modify-volume" },
    " switches a volume to gp3 while it stays in use.",
  ],
  sections: [
    {
      id: "gp2-vs-gp3",
      title: "gp2 vs gp3 compared",
      blocks: [
        {
          kind: "p",
          text: [
            "Take a 100\u00a0GiB gp2\u00a0volume. Its baseline is 300 ",
            { a: "IOPS", href: "/learn/glossary/iops" },
            ". With a full balance of I/O credits, it can burst to 3,000\u00a0IOPS for 2,000\u00a0seconds, about 33\u00a0minutes. Then it drops back.",
          ],
        },
        {
          kind: "p",
          text: [
            "On ",
            { a: "gp3", href: "/learn/glossary/ebs-gp3" },
            ", the same volume holds 3,000\u00a0IOPS all day. It costs $8.00 a month instead of $10.00, at the list prices below.",
          ],
        },
        {
          kind: "p",
          text: [
            "Both are General Purpose SSD types in Amazon Elastic Block Store (EBS). AWS gives both the same single-digit millisecond ",
            { a: "latency", href: "/learn/glossary/disk-latency" },
            " and 99.8 to 99.9 percent durability.",
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
              "$0.08 per GB-month, plus $0.005 per IOPS-month above 3,000 and $0.04 per MiB/s-month above 125",
            ],
            [
              "Baseline IOPS",
              "3 per GiB: 100 up to 33.33\u00a0GiB, 3,000 at 1,000\u00a0GiB, 16,000 from 5,334\u00a0GiB",
              "3,000 at any size",
            ],
            [
              "Burst",
              "To 3,000\u00a0IOPS below 1\u00a0TiB, while I/O credits last",
              "None: performance is sustained",
            ],
            ["Most IOPS", "16,000", "80,000, at up to 500\u00a0IOPS per GiB"],
            [
              "Throughput",
              "128\u00a0MiB/s up to 170\u00a0GiB, bursts to 250\u00a0MiB/s above 170\u00a0GiB, 250\u00a0MiB/s from 334\u00a0GiB",
              "125\u00a0MiB/s included, up to 2,000\u00a0MiB/s at 0.25\u00a0MiB/s per IOPS",
            ],
            ["Size", "1\u00a0GiB to 16\u00a0TiB", "1\u00a0GiB to 64\u00a0TiB"],
            [
              "More performance",
              "Only by growing the volume",
              "Set IOPS and throughput on their own",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Prices differ by Region and change, so check the ",
            { a: "EBS pricing page", href: "https://aws.amazon.com/ebs/pricing/" },
            " for yours. It counts a GB as 1024³ bytes, the same as a GiB. ",
            { a: "EBS volume types", href: "/learn/ebs-volume-types" },
            " compares the other types.",
          ],
        },
      ],
    },
    {
      id: "gp2-vs-gp3-performance-gp3-sustains-what",
      title: "Performance",
      blocks: [
        {
          kind: "p",
          text: [
            "Under 1,000\u00a0GiB, a gp2\u00a0volume reaches 3,000\u00a0IOPS only in bursts paid for with I/O credits. The ",
            { code: "BurstBalance" },
            " metric in Amazon CloudWatch shows the percentage of credits left.",
          ],
        },
        {
          kind: "p",
          text: "A gp3\u00a0volume doesn’t burst. AWS says gp3\u00a0volumes “can indefinitely sustain their full provisioned IOPS and throughput performance”.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "callout",
          label: "For engineers",
          text: "A gp2\u00a0volume starts with 5.4 million I/O credits, the most it can hold. It earns 3 credits per GiB per second while its I/O stays at or below baseline. A 100\u00a0GiB volume refills an empty balance in 18,000\u00a0seconds, or 5\u00a0hours.",
        },
        {
          kind: "p",
          text: "On gp3, IOPS and throughput are separate settings, each with a ratio. At 500\u00a0IOPS per GiB, 80,000\u00a0IOPS needs a volume of 160\u00a0GiB or more. At 0.25\u00a0MiB/s per IOPS, 2,000\u00a0MiB/s needs at least 8,000\u00a0IOPS.",
        },
        {
          kind: "p",
          text: "Elastic Volumes, AWS’s way to change a volume in place, can change either setting later without touching the size.",
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "A gp2\u00a0volume of 334\u00a0GiB or more delivers 250\u00a0MiB/s, twice what gp3 includes. One above 1,000\u00a0GiB has a baseline above 3,000\u00a0IOPS. At gp3’s baseline, such a volume gets less, so set its throughput or IOPS in the switch if its workload uses them.",
        },
        {
          kind: "p",
          text: [
            "The instance has ",
            { a: "EBS limits", href: "/learn/glossary/ebs-optimized-instance" },
            " of its own, which no volume setting lifts. On Nitro instances other than bare metal, ",
            { code: "InstanceEBSIOPSExceededCheck" },
            " and ",
            { code: "InstanceEBSThroughputExceededCheck" },
            " in CloudWatch report when an application tries to go past them.",
          ],
        },
        {
          kind: "p",
          text: [
            "For latency-sensitive workloads, AWS recommends io2 Block Express. ",
            { a: "io2 vs gp3", href: "/learn/io2-vs-gp3" },
            " compares the two.",
          ],
        },
      ],
    },
    {
      id: "gp2-vs-gp3-pricing-gp3-costs-less",
      title: "Pricing",
      blocks: [
        {
          kind: "p",
          text: "A gp2\u00a0volume has one price, per GB-month, with its IOPS and throughput included. A gp3\u00a0volume costs 20% less per GB. Above its included 3,000\u00a0IOPS and 125\u00a0MiB/s, you pay for the IOPS and throughput you provision.",
        },
        {
          kind: "p",
          text: "AWS’s Prescriptive Guidance says gp3\u00a0volumes “are always cheaper than gp2\u00a0volumes if they’re configured at the same performance levels”. Its examples, at the table’s rates:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "100\u00a0GiB:" },
              " $10.00 a month on gp2. On gp3, $8.00, or $8.12 with throughput set to gp2’s 128\u00a0MiB/s.",
            ],
            [{ b: "1,000\u00a0GiB:" }, " $100 on gp2. On gp3, $80, or $85 with 250\u00a0MiB/s."],
          ],
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "AWS’s third case is a 6,000\u00a0GiB gp2\u00a0volume at 16,000\u00a0IOPS and 250\u00a0MiB/s. On gp2 it costs 6,000 × $0.10 = $600 a month.",
        },
        {
          kind: "p",
          text: "On gp3, the same performance costs $550 a month, which is $50, or 8%, less:",
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
          text: "So in AWS’s examples, the gp2 to gp3 saving runs from 8%, with performance matched in full, to 20% at the gp3 baseline.",
        },
        {
          kind: "p",
          text: "Match only what a volume uses. A 1,000\u00a0GiB volume that never passes 125\u00a0MiB/s has no reason to pay $5 a month for 250. AWS’s General Purpose SSD page links a calculator for the saving on your own gp2\u00a0volumes.",
        },
      ],
    },
    {
      id: "a-gp2-to-gp3-migration-in-five",
      title: "Migrate gp2 to gp3",
      blocks: [
        {
          kind: "p",
          text: "The migration changes the type of the volume you already have. The size stays the same, so there’s nothing to grow inside the instance afterwards.",
        },
        {
          kind: "p",
          text: "New volumes can still arrive as gp2. The EC2 console picks gp3 when you create a volume, or an AMI from a snapshot. In other cases, AWS says “gp2 is the default selection”, so check your launch templates and scripts too.",
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
              text: "Check what each volume uses. One under 1,000\u00a0GiB never goes above its 3,000\u00a0IOPS burst ceiling, so the gp3 baseline covers its IOPS.",
              blocks: [
                {
                  kind: "p",
                  text: [
                    "On a Nitro instance, the CloudWatch metrics ",
                    { code: "VolumeAvgIOPS" },
                    " and ",
                    { code: "VolumeAvgThroughput" },
                    " report each minute’s average IOPS and throughput, the second in KiB/s. For a larger volume, compare its peak IOPS with 3,000. A volume whose throughput peaks above 128,000\u00a0KiB/s, which is 125\u00a0MiB/s, needs more than the gp3 baseline.",
                  ],
                },
              ],
            },
            [
              "Take a ",
              { a: "snapshot", href: "/learn/glossary/disk-snapshot" },
              " if the volume holds data you care about, so you have a copy to restore from.",
            ],
            {
              text: "Change the type and set both performance values. A modification can’t be cancelled once it’s submitted, so check the volume ID and the values first.",
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
                  text: "If you leave both out, the EBS user guide says EBS matches the gp2\u00a0volume’s performance or the gp3 baseline, whichever is higher. The AWS CLI reference gives 3,000\u00a0IOPS and 125\u00a0MiB/s as the defaults instead. Set both, and the result is the same either way.",
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
      title: "Downtime and timing",
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
            ". While it’s optimizing, AWS says performance sits between the old and new settings. It stays at or above gp2’s, unless you’re reducing IOPS.",
          ],
        },
        {
          kind: "p",
          text: "A performance change takes a few minutes to a few hours. AWS says a fully used 1\u00a0TiB volume typically takes about 6\u00a0hours. One that isn’t fully initialized can take more than 24\u00a0hours.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: [
            "A volume takes one modification at a time, and up to four in a rolling 24-hour period. To tune IOPS after the switch, wait for ",
            { code: "completed" },
            " first.",
          ],
        },
        {
          kind: "p",
          text: "On a previous-generation instance type, or after an error from the modify call, AWS gives a fallback. Detach a non-root volume, modify it and attach it again. For a root volume, stop the instance first.",
        },
        {
          kind: "p",
          text: [
            "A volume attached before 3 November 2016 at 23:40 UTC needs Elastic Volumes support initialized first. ",
            { a: "EBS Elastic Volumes", href: "/learn/ebs-elastic-volumes" },
            " covers the other changes you can make.",
          ],
        },
      ],
    },
    {
      id: "switching-to-gp3-keeps-every-gib-you",
      title: "Empty space still costs",
      blocks: [
        {
          kind: "p",
          text: "AWS charges for “the amount of GB you provision per month until you release the storage”. Elastic Volumes can grow a volume, but “You can’t decrease the volume size.”",
        },
        {
          kind: "p",
          text: "Take a 1,000\u00a0GiB gp2\u00a0volume that holds 300\u00a0GiB of data. After the switch, it costs $80 a month at the gp3 baseline instead of $100. Yet 700\u00a0GiB of it still holds nothing.",
        },
        {
          kind: "p",
          text: "At $0.08 per GB-month, that empty space costs $56 a month. That’s more than the $20 the switch saved.",
        },
        { kind: "svg", figure: figure3 },
        {
          kind: "p",
          text: "Reducing it takes a copy. AWS’s route is to create a smaller volume and move the data with an application-level tool such as rsync. Create the new volume as gp3, and one copy changes both type and size.",
        },
        {
          kind: "p",
          text: [
            { a: "How to shrink an EBS volume", href: "/learn/shrink-ebs-volume" },
            " has the steps, including the short stop the move needs. ",
            { a: "Checking EBS volume usage", href: "/learn/check-ebs-volume-usage" },
            " shows how to measure used space first, and the ",
            { a: "EBS pricing calculator", href: "/ebs-and-azure-disk-pricing" },
            " prices the empty space.",
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
            { a: "Amoeba", href: "/amoeba" },
            " optimizes block storage on Azure and AWS. The switch to gp3 changes what each GiB costs. ",
            { a: "EBS cost optimization", href: "/ebs-cost-optimization" },
            " with Amoeba changes how many GiB you pay for.",
          ],
        },
        { kind: "h3", id: "what-amoeba-does-on-aws", title: "What Amoeba does" },
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
              " Amoeba rightsizes the pool without any downtime. It grows the pool before it fills. When your data goes down and stays down, it shrinks the pool one volume at a time. So you pay for close to what you use.",
            ],
            [
              { b: "The old volumes." },
              " Once the switch is checked, Amoeba snapshots each old volume, deletes it, and keeps the snapshot for 7\u00a0days before deleting it too. You pay for both sets only while the move runs, then for the snapshots.",
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
    text: "Amoeba moves an EC2 instance’s EBS data volumes onto one pool sized to your data, then rightsizes it autonomously, without any downtime, one volume at a time. We estimate it takes 50–60% off block storage cost. It is an estimated range, not a promise. The free assessment works out your own figure.",
    links: [
      { label: "Block storage optimization with Amoeba", href: "/amoeba" },
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
      title: "Amazon EBS volume types",
      where: "Learn",
      href: "/learn/ebs-volume-types",
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
      title: "How to shrink an EBS volume",
      where: "Learn",
      href: "/learn/shrink-ebs-volume",
    },
    {
      title: "AWS Compute Optimizer for EBS",
      where: "Learn",
      href: "/learn/compute-optimizer-ebs",
    },
  ],
  relatedTitle: "More on EBS volumes",
};
