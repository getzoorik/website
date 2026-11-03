import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/ebs-elastic-volumes/1";
import { figure as figure2 } from "@/features/learn/figures/ebs-elastic-volumes/2";
import { figure as figure3 } from "@/features/learn/figures/ebs-elastic-volumes/3";

export const article: Article = {
  slug: "ebs-elastic-volumes",
  title: "EBS Elastic Volumes: modify size, type and IOPS",
  meta: "EBS Elastic Volumes change a volume’s size, type, IOPS and throughput while it’s in use. The modify-volume steps, timing, the four-a-day limit and cost.",
  h1: "EBS Elastic Volumes",
  deck: "Steps with the AWS CLI, how long a change takes, and what it costs.",
  card: "What modify-volume can change, how long it takes, the four-a-day limit and why size only grows.",
  product: "amoeba",
  hub: "Block storage",
  topic: "AWS block storage",
  published: "2026-11-01",
  updated: "2026-11-03",
  author: "vineet",
  cover: "/learn-covers/zoorik-learn-ebs-elastic-volumes-1200x630.webp",
  coverAlt: "EBS Elastic Volumes: change a volume’s size, type and IOPS, but size can only grow",
  short:
    "Elastic Volumes is the AWS feature for changing an Amazon Elastic Block Store (EBS) volume in use: its size, type, IOPS and throughput. On an instance that supports it, nothing is detached or restarted. Size only grows. A volume takes one change at a time, and at most four in a rolling 24\u00a0hours.",
  sections: [
    {
      id: "ebs-elastic-volumes",
      title: "What you can change",
      blocks: [
        {
          kind: "p",
          text: [
            "One modification can change any of four settings on an ",
            { a: "EBS volume", href: "/learn/glossary/ebs-volume" },
            ". Each new value must fit the limits of the volume’s type, or of the new type when the type changes.",
          ],
        },
        {
          kind: "table",
          columns: [
            { label: "Setting", width: "14%" },
            { label: "Direction", width: "17%" },
            { label: "Range", width: "45%" },
            { label: "Takes effect", width: "24%" },
          ],
          rows: [
            [
              "Size",
              "Up only",
              "gp2 and io1 up to 16,384\u00a0GiB; gp3 and io2 up to 65,536\u00a0GiB; st1 and sc1 from 125 to 16,384\u00a0GiB",
              ["At ", { code: "optimizing" }, ", usually in seconds"],
            ],
            [
              "Volume type",
              "To another type",
              "Multi-Attach volumes: io1 to io2 and back only",
              ["Full performance at ", { code: "completed" }],
            ],
            [
              "IOPS",
              "Up or down",
              "gp3 3,000 to 80,000; io1 100 to 64,000; io2 100 to 256,000",
              ["Full performance at ", { code: "completed" }, ", minutes to hours"],
            ],
            [
              "Throughput",
              "Up or down",
              "gp3 only, 125 to 2,000\u00a0MiB/s",
              ["Full performance at ", { code: "completed" }, ", minutes to hours"],
            ],
          ],
        },
        {
          kind: "callout",
          label: "For engineers",
          text: [
            "gp2 has no IOPS or throughput setting. It gets 3\u00a0",
            { a: "IOPS", href: "/learn/glossary/iops" },
            " per GiB, from 100 up to 16,000, so more IOPS means more GiB or another type.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "gp3", href: "/learn/glossary/ebs-gp3" },
            " sets IOPS and ",
            { a: "throughput", href: "/learn/glossary/disk-throughput" },
            " separately from size, within two ratios: up to 500\u00a0IOPS per GiB, and 0.25\u00a0MiB/s per provisioned IOPS. io2’s 256,000\u00a0IOPS need an instance built on the Nitro System.",
          ],
        },
        {
          kind: "p",
          text: "On a previous-generation instance, or when a modification returns an error, AWS’s fallback takes the volume out of use. Detach a data volume, modify it and attach it again. For a root volume, stop the instance first.",
        },
      ],
    },
    {
      id: "how-to-modify-an-ebs-volume-type",
      title: "Modify a volume",
      blocks: [
        {
          kind: "p",
          text: "On an instance that supports Elastic Volumes, the volume stays attached and in use throughout. These steps use the AWS CLI.",
        },
        {
          kind: "h3",
          id: "1-check-that-the-volume-fits-the",
          title: "1. Check the target type",
        },
        {
          kind: "ul",
          items: [
            "Over 16,384\u00a0GiB, a volume can’t become gp2, io1, st1 or sc1.",
            "A Multi-Attach volume, which several instances can share, can only move between io1 and io2. It can do so while attached.",
            "st1 and sc1 need at least 125\u00a0GiB, and can’t hold a root volume, even a detached one.",
          ],
        },
        {
          kind: "p",
          text: [
            "To choose a type, see ",
            { a: "EBS volume types", href: "/learn/ebs-volume-types" },
            ". For the common moves, see ",
            { a: "gp2 vs gp3", href: "/learn/gp2-vs-gp3" },
            " and ",
            { a: "io2 vs gp3", href: "/learn/io2-vs-gp3" },
            ".",
          ],
        },
        {
          kind: "h3",
          id: "2-submit-the-change-naming-every-value",
          title: "2. Run modify-volume",
        },
        {
          kind: "p",
          text: "Pass only what you want to change. Everything else keeps its current value, unless a type change sets a default.",
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "You can’t cancel a modification once it’s submitted, so check the command first. When you move a volume to gp3, name both IOPS and throughput.",
        },
        {
          kind: "p",
          text: "The two AWS references disagree on the default. The EBS User Guide says a gp2\u00a0volume moved to gp3 gets the higher of its gp2 performance and the gp3 baseline. The CLI reference gives a flat 3,000\u00a0IOPS and 125\u00a0MiB/s.",
        },
        {
          kind: "p",
          text: "Take a 500\u00a0GiB gp2\u00a0volume with 1,500 baseline IOPS and 250\u00a0MiB/s. As gp3, it gets 3,000\u00a0IOPS included. To keep 250\u00a0MiB/s under either default, name both:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "aws ec2 modify-volume \\\n    --volume-id <volume-id> \\\n    --volume-type gp3 \\\n    --iops 3000 \\\n    --throughput 250",
        },
        { kind: "h3", id: "3-confirm-that-it-started", title: "3. Confirm it started" },
        {
          kind: "p",
          text: [
            "The response should show a ",
            { code: "ModificationState" },
            " of ",
            { code: "modifying" },
            ". Then come ",
            { code: "optimizing" },
            " and ",
            { code: "completed" },
            ".",
          ],
        },
      ],
    },
    {
      id: "what-the-ebs-volume-optimizing-state-means",
      title: "The optimizing state",
      blocks: [
        {
          kind: "p",
          text: [
            "A size increase takes effect once the modification reaches ",
            { code: "optimizing" },
            ", usually within seconds. You can then ",
            { a: "grow the partition and filesystem", href: "/learn/increase-ebs-volume-size" },
            " without waiting for completed.",
          ],
        },
        {
          kind: "p",
          text: "Performance takes longer. While optimizing, it sits between the old and the new setting. It never drops below the old one, or below the new one when you reduce IOPS.",
        },
        {
          kind: "p",
          text: "AWS gives a few minutes to a few hours for a performance change, and about 6\u00a0hours for a fully used 1\u00a0TiB volume. The time doesn’t always grow with size in a straight line.",
        },
        { kind: "svg", figure: figure1 },
        { kind: "p", text: "To follow a modification, run:" },
        {
          kind: "code",
          lang: "bash",
          code: "aws ec2 describe-volumes-modifications \\\n    --volume-ids <volume-id>",
        },
        {
          kind: "p",
          text: [
            "The response shows the ",
            { code: "ModificationState" },
            " and a ",
            { code: "Progress" },
            " percentage. Rather than poll, you can have an Amazon EventBridge rule notify you of modification events.",
          ],
        },
        {
          kind: "h3",
          id: "when-a-modification-is-slow-or-fails",
          title: "Slow or failed changes",
        },
        {
          kind: "p",
          text: [
            "A volume created from a ",
            { a: "snapshot", href: "/learn/glossary/disk-snapshot" },
            " or another volume isn’t fully initialized until all its blocks are written. Until then, it modifies more slowly, and a new performance setting can take more than 24\u00a0hours. Let it finish initializing before you modify it.",
          ],
        },
        {
          kind: "p",
          text: "For a volume from a snapshot, you can pay for a Provisioned Rate for Volume Initialization, from 100 to 300\u00a0MiB/s. It makes initialization end at a predictable time.",
        },
        {
          kind: "p",
          text: [
            "Rarely, a transient AWS fault ends a modification as ",
            { code: "failed" },
            ". AWS says this isn’t a sign of trouble with the volume, so retry it.",
          ],
        },
      ],
    },
    {
      id: "is-there-still-a-6-hour-wait",
      title: "How often you can modify",
      blocks: [
        {
          kind: "p",
          text: "Up to four times in a rolling 24\u00a0hours, one change at a time. AWS used to require a 6-hour wait between changes, and older guides still give that rule.",
        },
        {
          kind: "p",
          text: "AWS replaced the wait with the four-a-day limit on 15 January 2026. It applies in every commercial Region, GovCloud (US) and China, with nothing to turn on.",
        },
        { kind: "h3", id: "the-two-rules-now", title: "The two rules" },
        {
          kind: "ul",
          items: [
            [
              { b: "One at a time." },
              " A new modification starts only after the last one on that volume has reached completed.",
            ],
            [
              { b: "Four a day." },
              " A volume takes at most four in a rolling 24\u00a0hours, and only while it is ",
              { code: "in-use" },
              " or ",
              { code: "available" },
              ". Past the limit, the error says when the next one can start.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Six hours still matters, as a duration. A change can take that long, and the next one waits for completed, whatever the daily limit allows. So where you can, put size, type, IOPS and throughput in one ",
            { code: "modify-volume" },
            " call.",
          ],
        },
        {
          kind: "h3",
          id: "four-a-day-as-a-performance-schedule",
          title: "A daily performance schedule",
        },
        {
          kind: "p",
          text: "AWS’s Storage Blog describes a customer changing IOPS and throughput on 250\u00a0GiB gp3\u00a0volumes each weekday, in UTC:",
        },
        {
          kind: "ul",
          items: [
            "11:00 pm: raise IOPS and throughput for the nightly batch.",
            "3:00 am: back to the 3,000\u00a0IOPS and 125\u00a0MiB/s baseline.",
            "5:30 am: raise them for the morning peak.",
            "11:00 am: back to baseline.",
          ],
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "The schedule uses all four modifications within 12\u00a0hours, with gaps of 4, 2.5 and 5.5\u00a0hours. The 3:00 am change must reach completed within 2.5\u00a0hours. If it took 6\u00a0hours, the 5:30 am raise couldn’t start until 9:00 am.",
        },
        { kind: "svg", figure: figure2 },
        { kind: "p", text: "Time your own modifications before you rely on a schedule." },
      ],
    },
    {
      id: "elastic-volumes-pricing-what-a-change-costs",
      title: "What a change costs",
      blocks: [
        {
          kind: "p",
          text: "AWS doesn’t charge for the modification itself. You pay for the new configuration from the moment the modification starts, not when it completes.",
        },
        {
          kind: "p",
          text: [
            "Storage is charged per GB you provision each month. gp3 charges extra only for IOPS above 3,000 and throughput above 125\u00a0MiB/s. io1 and io2 charge for all ",
            { a: "provisioned IOPS", href: "/learn/glossary/provisioned-iops" },
            ", and io2’s IOPS rates are tiered.",
          ],
        },
        {
          kind: "p",
          text: "gp3 storage, IOPS and throughput are charged per second, with a 60-second minimum. IOPS you raise for a batch window cost that window at the higher rate, not a month.",
        },
        {
          kind: "p",
          text: "Size works the other way. A GiB you add stays in the monthly cost, because no modification takes it back. Only a cheaper type, or less IOPS or throughput, reduces a volume’s cost.",
        },
        {
          kind: "p",
          text: [
            "gp3, for example, costs 20 percent less per GiB than gp2. The ",
            { a: "EBS pricing calculator", href: "/ebs-and-azure-disk-pricing" },
            " shows a volume’s monthly cost at list price, and what its empty space costs.",
          ],
        },
        { kind: "h3", id: "which-change-to-make", title: "Which change to make" },
        {
          kind: "ul",
          items: [
            [
              { b: "It’s filling up." },
              " Add enough size to last until this change completes and the next can start.",
            ],
            [
              { b: "It’s too slow." },
              " Raise IOPS on gp3, io1 or io2, or throughput on gp3. Or move gp2 to gp3, rather than add GiB just for IOPS.",
            ],
            [
              { b: "It’s much bigger than the data." },
              " No modification helps. ",
              { a: "Check its EBS volume usage", href: "/learn/check-ebs-volume-usage" },
              " to see by how much.",
            ],
          ],
        },
      ],
    },
    {
      id: "why-elastic-volumes-cant-make-a-volume",
      title: "Why size can’t shrink",
      blocks: [
        {
          kind: "p",
          text: "AWS’s guide is plain: “You can’t decrease the volume size.” An attached EBS volume is a block device, and its filesystem can keep data in any block, the last ones included.",
        },
        {
          kind: "p",
          text: "Removing the end of the device would remove part of the filesystem. Only the operating system inside the instance can move that data away first.",
        },
        { kind: "svg", figure: figure3 },
        {
          kind: "p",
          text: "AWS’s way to a smaller size is a new, smaller volume. Copy the data to it with an application-level tool, such as rsync on Linux or robocopy on Windows.",
        },
        {
          kind: "p",
          text: [
            "You pay for both volumes while you copy, and you stop the services on the mount for the switch. ",
            { a: "Shrinking an EBS volume", href: "/learn/shrink-ebs-volume" },
            " gives the steps. Until you do, each size increase is a new floor for the volume’s cost, however much the data shrinks.",
          ],
        },
      ],
    },
    {
      id: "how-amoeba-works-with-volumes-that-only",
      title: "Where Amoeba fits",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " optimizes block storage on Azure and AWS. A single EBS volume only grows, so Amoeba puts the data on a pool of volumes it can grow and shrink. It rightsizes that pool without any downtime as your data changes.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "The pool." },
              " Amoeba moves an instance’s EBS data volumes onto one btrfs pool of gp3\u00a0volumes, sized to your data with room to grow. Each data mount keeps its path. The root volume is never touched.",
            ],
            [
              { b: "The move." },
              " Amoeba copies your data while your services run. Then it switches each mount to the pool, with a short restart of the services that use it. If the switch fails, it puts the original mounts back and tries again.",
            ],
            [
              { b: "Growing." },
              " It grows the pool before it fills, and sooner when data arrives fast. It enlarges the pool’s volumes or adds new ones while the pool stays mounted.",
            ],
            [
              { b: "Shrinking." },
              " When your data goes down and stays down, it shrinks the pool one volume at a time. So you pay for close to what you use.",
            ],
            [
              { b: "The old volumes." },
              " Once the switch is checked, Amoeba snapshots and deletes each old volume. It keeps each snapshot for 7\u00a0days, then deletes it too.",
            ],
          ],
        },
        {
          kind: "p",
          text: "You pay for both sets of volumes only while the move runs, and then for the snapshots while they’re kept.",
        },
        { kind: "h3", id: "what-an-instance-needs", title: "What an instance needs" },
        {
          kind: "p",
          text: "Amoeba works on Windows and Linux instances. On AWS, the instance must be managed by AWS Systems Manager, and be a Nitro type that exposes EBS as NVMe. It also needs a few free attachment slots for the pool.",
        },
        {
          kind: "p",
          text: [
            "On Linux, the instance needs a recent kernel with btrfs. Every service that keeps a data mount open must run under systemd. ",
            { a: "EBS cost optimization", href: "/ebs-cost-optimization" },
            " shows Amoeba on AWS end to end.",
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
      publisher: "AWS",
      title: "“Amazon EBS General Purpose SSD volumes”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/general-purpose.html",
    },
    {
      publisher: "AWS",
      title: "“Initialize Amazon EBS volumes”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/initalize-volume.html",
    },
    {
      publisher: "AWS What’s New",
      title: "“Amazon EBS now supports up to four Elastic Volumes modifications in 24 hours”",
      url: "https://aws.amazon.com/about-aws/whats-new/2026/01/amazon-ebs-up-to-four-volume-modifications/",
      note: " (15 January 2026)",
    },
    {
      publisher: "AWS Storage Blog",
      title: "“Optimize Amazon EBS volumes to get the right performance at the right time”",
      url: "https://aws.amazon.com/blogs/storage/optimize-amazon-ebs-volume-performance-the-right-amount-at-the-right-time/",
      note: " (20 July 2026)",
    },
    { publisher: "AWS", title: "“Amazon EBS pricing”", url: "https://aws.amazon.com/ebs/pricing/" },
  ],
  related: [
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
      title: "Amazon EBS volume types",
      where: "Learn",
      href: "/learn/ebs-volume-types",
    },
  ],
  relatedTitle: "More on EBS volumes",
};
