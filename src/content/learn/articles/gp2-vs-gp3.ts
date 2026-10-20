import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/gp2-vs-gp3/1";

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
  published: "2026-10-31",
  updated: "2026-10-31",
  author: "rupeshankar",
  short: [
    "gp2 vs gp3 is a choice between performance that follows size and performance you set. gp2 gives 3\u00a0IOPS (input/output operations per second) per GiB, so 100\u00a0GiB gets 300\u00a0IOPS. gp3 includes 3,000\u00a0IOPS and 125\u00a0MiB/s at any size, sells more of each, and costs 20% less per GB: $0.08 against $0.10 per GB-month in US East (N. Virginia), October 2026. On a supported instance, ",
    { code: "modify-volume" },
    " switches a volume while it stays in use.",
  ],
  sections: [
    {
      id: "gp2-vs-gp3-at-a-glance",
      title: "gp2 vs gp3 at a glance",
      blocks: [
        {
          kind: "p",
          text: "Both are General Purpose SSD types in Amazon Elastic Block Store (EBS), and AWS documents the same single-digit millisecond latency and the same 99.8 to 99.9 percent durability for each. gp2 ties IOPS and throughput to the size you provision. gp3, released in December 2020, includes a fixed baseline at every size and lets you provision more IOPS and throughput on their own.",
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
            "Prices differ by Region and change over time, so check the ",
            { a: "EBS pricing page", href: "https://aws.amazon.com/ebs/pricing/" },
            " for yours. That page counts a GB as 1024³ bytes, which is a GiB.",
          ],
        },
        {
          kind: "p",
          text: "New volumes can still arrive as gp2. The EC2 console selects gp3 when you create a volume or an AMI from a snapshot, and AWS says that “in other cases, gp2 is the default selection.” Check what your launch templates and scripts ask for before you migrate what they already made.",
        },
      ],
    },
    {
      id: "gp2-vs-gp3-performance",
      title: "gp2 vs gp3 performance",
      blocks: [
        {
          kind: "p",
          text: [
            "On gp2, baseline IOPS is 3 per GiB, with a floor of 100\u00a0IOPS and a ceiling of 16,000, and volumes under 1\u00a0TiB can burst to 3,000\u00a0IOPS by spending I/O credits. A volume starts with 5.4 million credits, the most it can hold. While its I/O stays at or below baseline, it earns them back at 3 credits per GiB per second. AWS’s own example is a 100\u00a0GiB volume: a 300\u00a0IOPS baseline, 2,000\u00a0seconds at 3,000\u00a0IOPS from a full balance, then 18,000\u00a0seconds (5\u00a0hours) to refill. The ",
            { code: "BurstBalance" },
            " metric in Amazon CloudWatch shows the percentage of credits left.",
          ],
        },
        {
          kind: "p",
          text: "gp2 throughput follows size too. A volume of 170\u00a0GiB or less delivers up to 128\u00a0MiB/s. Between 170 and 334\u00a0GiB it can burst to 250\u00a0MiB/s, and from 334\u00a0GiB it delivers 250\u00a0MiB/s.",
        },
        {
          kind: "p",
          text: "gp3 doesn’t burst. AWS says gp3\u00a0volumes “can indefinitely sustain their full provisioned IOPS and throughput performance.” The same 100\u00a0GiB volume on gp3 can run at 3,000\u00a0IOPS all day, ten times its gp2 baseline.",
        },
        { kind: "diagram", figure: figure1 },
        {
          kind: "h3",
          id: "how-gp3-iops-and-throughput-are-set",
          title: "How gp3\u00a0IOPS and throughput are set",
        },
        {
          kind: "p",
          text: "gp3\u00a0IOPS and throughput are two separate settings. IOPS starts at the included 3,000 and goes up to 80,000, at no more than 500\u00a0IOPS per GiB, so the maximum needs a volume of 160\u00a0GiB or more. Throughput starts at 125\u00a0MiB/s and goes up to 2,000\u00a0MiB/s, at no more than 0.25\u00a0MiB/s per provisioned IOPS, so 2,000\u00a0MiB/s needs at least 8,000\u00a0IOPS. Elastic Volumes, AWS’s name for changing a volume in place, can change either setting later without touching the size.",
        },
        {
          kind: "p",
          text: "On larger volumes, gp3’s included baseline is smaller than what gp2 gives. A gp2\u00a0volume of 334\u00a0GiB or more delivers 250\u00a0MiB/s, against the 125\u00a0MiB/s gp3 includes, and one above 1,000\u00a0GiB has a baseline above 3,000\u00a0IOPS. Such a volume needs its throughput or IOPS raised when it moves, if its workload uses them.",
        },
        {
          kind: "p",
          text: [
            "The instance has limits of its own. On Nitro instances other than bare metal, the CloudWatch metrics ",
            { code: "InstanceEBSIOPSExceededCheck" },
            " and ",
            { code: "InstanceEBSThroughputExceededCheck" },
            " report when an application tries to go past the instance’s EBS limits, which no volume setting changes. For latency-sensitive workloads, AWS recommends io2 Block Express, which ",
            { a: "io2 vs gp3", href: "/learn/io2-vs-gp3" },
            " compares.",
          ],
        },
      ],
    },
    {
      id: "gp2-vs-gp3-pricing-what-the-20",
      title: "gp2 vs gp3 pricing: what the 20% covers",
      blocks: [
        {
          kind: "p",
          text: "gp2 has one price, per GB-month, with its IOPS and throughput included. gp3 has three: storage at 20% less per GB, plus IOPS above 3,000 and throughput above 125\u00a0MiB/s when you provision them. AWS’s Prescriptive Guidance says gp3\u00a0volumes “are always cheaper than gp2\u00a0volumes if they’re configured at the same performance levels.”",
        },
        {
          kind: "p",
          text: "The same guidance works three cases through at the prices in the table:",
        },
        {
          kind: "ul",
          items: [
            "A 100\u00a0GiB gp2\u00a0volume costs $10.00 a month, against $8.00 on gp3, or $8.12 with throughput set to gp2’s 128\u00a0MiB/s.",
            "At 1,000\u00a0GiB it’s $100 on gp2 and $80 on gp3, or $85 with 250\u00a0MiB/s.",
            "A 6,000\u00a0GiB gp2\u00a0volume with 16,000\u00a0IOPS costs $600, and matching those IOPS and its 250\u00a0MiB/s on gp3 costs $550.",
          ],
        },
        {
          kind: "p",
          text: "In AWS’s examples, gp2 to gp3 cost savings run from 20% at the gp3 baseline to 8% for the 6,000\u00a0GiB volume with its performance matched in full. AWS publishes a calculator for the saving on your own gp2\u00a0volumes, linked from its General Purpose SSD page.",
        },
        {
          kind: "p",
          text: "What you use decides which end of that range you land on. If a 1,000\u00a0GiB volume never drives more than 125\u00a0MiB/s, there’s no reason to pay $5 a month for 250. If a 6,000\u00a0GiB volume peaks at 5,000\u00a0IOPS, provisioning 16,000 on gp3 pays for headroom it never touches.",
        },
      ],
    },
    {
      id: "a-gp2-to-gp3-migration-step-by",
      title: "A gp2 to gp3 migration, step by step",
      blocks: [
        {
          kind: "p",
          text: "A gp2 to gp3 migration changes the type of the volume you already have. The size stays the same, so there’s nothing to grow inside the instance afterwards.",
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
            [
              "Check what each volume uses. A gp2\u00a0volume under 1,000\u00a0GiB never goes above 3,000\u00a0IOPS, because that’s its burst ceiling, so the gp3 baseline covers its IOPS. On a Nitro instance, the CloudWatch metrics ",
              { code: "VolumeAvgIOPS" },
              " and ",
              { code: "VolumeAvgThroughput" },
              " report each minute’s average IOPS and throughput, the second in KiB/s. Compare a larger volume’s peak IOPS with 3,000, and read throughput peaks above 128,000\u00a0KiB/s, which is 125\u00a0MiB/s, as a sign the volume needs more than the gp3 baseline.",
            ],
            "Take a snapshot if the volume holds data you care about, so you can roll back.",
            {
              text: [
                "Change the type and name both performance values. You can’t cancel a modification once it’s submitted, so check the volume ID and the values before you run it. This example suits a gp2\u00a0volume of 334 to 1,000\u00a0GiB and keeps its 250\u00a0MiB/s. Above 1,000\u00a0GiB, set ",
                { code: "--iops" },
                " to at least the measured peak.",
              ],
              blocks: [
                {
                  kind: "code",
                  lang: "bash",
                  code: "aws ec2 modify-volume \\\n    --volume-id <volume-id> \\\n    --volume-type gp3 \\\n    --iops 3000 \\\n    --throughput 250",
                },
                {
                  kind: "p",
                  text: "The EBS user guide says that if you leave IOPS and throughput out, EBS provisions the gp2\u00a0volume’s equivalent or the gp3 baseline, whichever is higher. The AWS CLI reference lists 3,000\u00a0IOPS and 125\u00a0MiB/s as the defaults. Naming both values means the result doesn’t depend on which of the two applies.",
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
      id: "gp2-to-gp3-migration-downtime-and-timing",
      title: "gp2 to gp3 migration downtime and timing",
      blocks: [
        {
          kind: "p",
          text: "On an instance that supports Elastic Volumes, AWS says the change runs “without detaching the volume or restarting the instance.”",
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
            ". While it’s optimizing, AWS says performance sits between the source and target configurations and, unless you’re reducing IOPS, “will be no less than the source volume performance.” AWS says a performance change takes from a few minutes to a few hours, and that a fully used 1\u00a0TiB volume typically takes about 6\u00a0hours. A volume that isn’t fully initialized can take more than 24\u00a0hours.",
          ],
        },
        {
          kind: "p",
          text: [
            "Modifying a volume costs nothing, and the gp3 price applies from the moment the modification starts. Each volume takes one modification at a time, up to four in a rolling 24-hour period, so if you plan to tune IOPS straight after the switch, wait for ",
            { code: "completed" },
            " first.",
          ],
        },
        {
          kind: "p",
          text: [
            "On a previous-generation instance type that doesn’t support Elastic Volumes, or after an error from the modify call, AWS’s fallback is to detach a non-root volume, modify it and attach it again, or to stop the instance for a root volume. A volume attached before 3 November 2016 at 23:40 UTC needs Elastic Volumes support initialized first. For other type and size changes, see the ",
            { a: "Elastic Volumes guide", href: "/learn/ebs-elastic-volumes" },
            ".",
          ],
        },
      ],
    },
    {
      id: "what-switching-to-gp3-leaves-the-same",
      title: "What switching to gp3 leaves the same",
      blocks: [
        {
          kind: "p",
          text: "Switching to gp3 changes the price of each GiB, not the number of GiB. AWS bills volume storage by “the amount of GB you provision per month until you release the storage,” and Elastic Volumes can’t make a volume smaller: “You can’t decrease the volume size.”",
        },
        {
          kind: "p",
          text: "Take a 1,000\u00a0GiB gp2\u00a0volume that holds 300\u00a0GiB of data. After the switch it costs $80 a month at the gp3 baseline instead of $100, and 700\u00a0GiB of it still holds nothing. At $0.08 per GB-month that empty space costs $56 a month, more than the $20 the switch saved.",
        },
        {
          kind: "p",
          text: [
            "Reducing that takes a copy. AWS’s route is to create a smaller volume and move the data with an application-level tool such as rsync. The steps, and the short stop that moving onto the new volume needs, are in ",
            { a: "how to shrink an EBS volume", href: "/learn/shrink-ebs-volume" },
            ", and ",
            { a: "checking EBS volume usage", href: "/learn/check-ebs-volume-usage" },
            " shows how to measure the used space first. If a volume is mostly empty, create the new one as gp3, and the copy changes the type and the size in one move.",
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
            " optimizes Azure managed disks and Amazon EBS, and on AWS it handles the size half of the bill. It moves the EBS data volumes of a running EC2 instance, never the root volume, onto one btrfs pool of gp3\u00a0volumes in the instance’s Availability Zone. Each data mount keeps its path. Amoeba sizes the pool from the highest use of the last 7\u00a0days, so it sits inside its target band, 80% to 90% full by default, with at least 10\u00a0GiB free. Each gp3\u00a0volume gets at least the included 3,000\u00a0IOPS and 125\u00a0MiB/s, and more when the instance’s measured load needs it.",
          ],
        },
        {
          kind: "p",
          text: "Amoeba then rightsizes the pool as the data grows and shrinks. It grows gp3\u00a0volumes in place or adds new ones while the pool stays mounted, and it removes volumes one at a time when the data shrinks, so the GiB you pay for follow the data rather than the largest size a volume once reached.",
        },
        {
          kind: "p",
          text: "The interruption comes at the switch onto the pool. On Linux, the systemd services that use the data mounts stop and start again there. Amoeba works on Windows and Linux instances. On AWS, an instance must be running, managed by AWS Systems Manager, a Nitro type and attached to at least one EBS data volume, with 3 attachment slots free: 2 for the pool and 1 kept for urgent growth. On Linux, it also needs systemd, kernel 5.14 or later and btrfs loaded or loadable, and an instance whose OS is in the Red Hat family isn’t moved.",
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
      title: "io2 vs gp3: when Provisioned IOPS is worth the price",
      where: "Learn",
      href: "/learn/io2-vs-gp3",
    },
    {
      title: "What AWS Compute Optimizer recommends for EBS volumes",
      where: "Learn",
      href: "/learn/compute-optimizer-ebs",
    },
    {
      title: "How is the saving worked out?",
      where: "Amoeba FAQ",
      href: "/amoeba/faq#how-is-the-saving-worked-out",
    },
  ],
};
