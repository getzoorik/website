import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/ebs-elastic-volumes/1";
import { figure as figure2 } from "@/features/learn/figures/ebs-elastic-volumes/2";
import { figure as figure3 } from "@/features/learn/figures/ebs-elastic-volumes/3";

export const article: Article = {
  slug: "ebs-elastic-volumes",
  title: "EBS Elastic Volumes: what you can and can’t change",
  meta: "EBS Elastic Volumes change an attached volume’s size, type, IOPS and throughput. The optimizing state, the four-a-day limit and the change they can’t make.",
  h1: "EBS Elastic Volumes: what you can change, and what you can’t",
  deck: "Size, type, IOPS and throughput change while the volume stays in use. Size is the one that only goes up.",
  card: "What an EBS modification can change, the optimizing state, the four-a-day limit and why size only grows.",
  product: "amoeba",
  hub: "Block storage",
  topic: "AWS block storage",
  published: "2026-11-01",
  updated: "2026-11-01",
  author: "vineet",
  cover: "/learn-covers/zoorik-learn-ebs-elastic-volumes-1200x630.webp",
  coverAlt: "EBS Elastic Volumes: change a volume’s size, type and IOPS, but size can only grow",
  short:
    "EBS Elastic Volumes is AWS’s name for changing an Amazon Elastic Block Store (EBS) volume in use: its size, type, IOPS and throughput. On a current-generation instance, nothing is detached or restarted, size only grows, and a volume takes up to four changes in a rolling 24\u00a0hours.",
  sections: [
    {
      id: "ebs-elastic-volumes",
      title: "What EBS Elastic Volumes can change on a volume in use",
      blocks: [
        {
          kind: "p",
          text: [
            "Picture a 500\u00a0GiB gp2 ",
            { a: "EBS volume", href: "/learn/glossary/ebs-volume" },
            " under a database. The database needs more than the 1,500 ",
            { a: "input/output operations per second (IOPS)", href: "/learn/glossary/iops" },
            " that gp2 gives a volume that size.",
          ],
        },
        {
          kind: "p",
          text: [
            "One modification, made while the database runs, can turn it into ",
            { a: "gp3", href: "/learn/glossary/ebs-gp3" },
            ", with 3,000\u00a0IOPS included at any size. The volume keeps the same 250\u00a0MiB/s of ",
            { a: "throughput", href: "/learn/glossary/disk-throughput" },
            ".",
          ],
        },
        { kind: "p", text: "If the data later shrinks, the volume stays at 500\u00a0GiB." },
        { kind: "p", text: "Each change has its own range:" },
        {
          kind: "table",
          columns: [
            { label: "Change", width: "14%" },
            { label: "Which way", width: "17%" },
            { label: "Volume types and range", width: "45%" },
            { label: "When it takes effect", width: "24%" },
          ],
          rows: [
            [
              "Size",
              "Up only",
              "gp2 and io1 up to 16,384\u00a0GiB; gp3 and io2 up to 65,536\u00a0GiB; st1 and sc1 from 125 to 16,384\u00a0GiB",
              ["At ", { code: "optimizing" }, ", usually within seconds"],
            ],
            [
              "Volume type",
              "From one type to another, within the target type’s limits",
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
          text: "The gp2 type has no IOPS or throughput setting. It gets 3\u00a0IOPS per GiB, from a minimum of 100 up to 16,000, so more IOPS takes more GiB or a different type.",
        },
        {
          kind: "p",
          text: "A gp3\u00a0volume raises IOPS and throughput without adding a GiB, within two ratios. It allows up to 500\u00a0IOPS per GiB, and up to 0.25\u00a0MiB/s of throughput per provisioned IOPS. The 256,000\u00a0IOPS ceiling of io2 needs an instance built on the Nitro System.",
        },
        {
          kind: "p",
          text: "On a previous-generation instance type that doesn’t support Elastic Volumes, or when a modification returns an error, AWS gives a fallback. Detach a data volume, modify it and attach it again, or stop the instance to modify its root volume.",
        },
      ],
    },
    {
      id: "how-to-modify-an-ebs-volume-type",
      title: "How to modify an EBS volume type without downtime",
      blocks: [
        {
          kind: "p",
          text: "You can change an EBS volume type without downtime on a current-generation instance. With the AWS Command Line Interface (CLI), it takes three steps.",
        },
        {
          kind: "h3",
          id: "1-check-that-the-volume-fits-the",
          title: "1. Check that the volume fits the target type",
        },
        {
          kind: "ul",
          items: [
            "Over 16,384\u00a0GiB, a volume can’t become gp2, io1, st1 or sc1.",
            "A volume with Multi-Attach enabled, which lets several instances share it, can only move between io1 and io2. It can make that move while attached.",
            "st1 and sc1 need at least 125\u00a0GiB, and neither can take a root volume, even a detached one.",
          ],
        },
        {
          kind: "h3",
          id: "2-submit-the-change-naming-every-value",
          title: "2. Submit the change, naming every value",
        },
        {
          kind: "p",
          text: "To modify an EBS volume, pass only what you want to change. The rest keeps its current value, unless a type change sets a default.",
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "A submitted modification can’t be cancelled, so check the command first. When you move a volume to gp3, name both IOPS and throughput.",
        },
        {
          kind: "p",
          text: "The EBS User Guide says a gp2\u00a0volume moved to gp3 without them gets the higher of its gp2-equivalent performance and the gp3 baseline. So the guide’s own 500\u00a0GiB example keeps 250\u00a0MiB/s.",
        },
        {
          kind: "p",
          text: "AWS’s CLI reference instead gives a flat default of 3,000\u00a0IOPS and 125\u00a0MiB/s. For the volume from the opening, name both:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "aws ec2 modify-volume \\\n    --volume-id <volume-id> \\\n    --volume-type gp3 \\\n    --iops 3000 \\\n    --throughput 250",
        },
        { kind: "h3", id: "3-confirm-that-it-started", title: "3. Confirm that it started" },
        {
          kind: "p",
          text: [
            "The response should show a ",
            { code: "ModificationState" },
            " of ",
            { code: "modifying" },
            ", the first of three states. Then come ",
            { code: "optimizing" },
            " and ",
            { code: "completed" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "To choose a type, see ",
            { a: "EBS volume types", href: "/learn/ebs-volume-types" },
            ". Two pages compare the common moves: ",
            { a: "gp2 vs gp3", href: "/learn/gp2-vs-gp3" },
            " and ",
            { a: "io2 vs gp3", href: "/learn/io2-vs-gp3" },
            ".",
          ],
        },
      ],
    },
    {
      id: "what-the-ebs-volume-optimizing-state-means",
      title: "What the EBS volume optimizing state means",
      blocks: [
        {
          kind: "p",
          text: [
            "A size increase takes effect once the modification reaches ",
            { code: "optimizing" },
            ", which AWS says usually takes a few seconds. So you can ",
            { a: "grow the partition and filesystem", href: "/learn/increase-ebs-volume-size" },
            " without waiting for completed.",
          ],
        },
        {
          kind: "p",
          text: "Performance takes longer. While a volume is optimizing, its performance sits between the old and the new configuration. It never drops below the old one, or below the new one when you’re reducing IOPS.",
        },
        {
          kind: "p",
          text: "AWS gives a few minutes to a few hours for performance changes. Its figure for a fully used 1\u00a0TiB volume is about 6\u00a0hours. That time doesn’t always scale with size in a straight line.",
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
            " percentage. If you’d rather not poll, an Amazon EventBridge rule can notify you of modification events.",
          ],
        },
        {
          kind: "h3",
          id: "when-a-modification-is-slow-or-fails",
          title: "When a modification is slow or fails",
        },
        {
          kind: "p",
          text: [
            "A volume that isn’t fully initialized is one known cause of a long optimizing state. A volume created from a ",
            { a: "snapshot", href: "/learn/glossary/disk-snapshot" },
            " or another volume reaches full performance only after its data blocks are written to it. An empty volume skips that step.",
          ],
        },
        {
          kind: "p",
          text: "AWS says modifications take longer on such a volume. A new performance configuration can then take more than 24\u00a0hours. So let a restored volume finish initializing before you modify it.",
        },
        {
          kind: "p",
          text: "When you create a volume from a snapshot, you can also pay for a Provisioned Rate for Volume Initialization. Set from 100 to 300\u00a0MiB/s, it makes initialization end at a predictable time. Volume copies don’t support it.",
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
      title: "Is there still a 6-hour wait between EBS volume modifications?",
      blocks: [
        {
          kind: "p",
          text: "No. Search suggestions and older guides still pair EBS volume modification with 6\u00a0hours. That comes from an old rule of six hours between changes.",
        },
        {
          kind: "p",
          text: "On 15 January 2026, AWS announced up to four Elastic Volumes modifications per volume in a rolling 24-hour window. It applies in every commercial Region, GovCloud (US) and China, with nothing to turn on.",
        },
        { kind: "h3", id: "the-two-rules-now", title: "The two rules now" },
        {
          kind: "ul",
          items: [
            [
              { b: "One at a time." },
              " A new modification starts only after the last one on that volume has reached completed.",
            ],
            [
              { b: "Four a day." },
              " A volume, which must be ",
              { code: "in-use" },
              " or ",
              { code: "available" },
              ", takes at most four in a rolling 24\u00a0hours. Over the limit, the error message says when the next one can start.",
            ],
          ],
        },
        {
          kind: "p",
          text: "The other 6\u00a0hours is still in the docs, as a duration rather than a wait. A 1\u00a0TiB volume can typically take up to six hours to modify. The next change waits for completed, so a slow change blocks it that long, whatever the daily limit allows.",
        },
        {
          kind: "p",
          text: [
            "Where you can, put size, type, IOPS and throughput changes in one ",
            { code: "modify-volume" },
            " call.",
          ],
        },
        {
          kind: "h3",
          id: "four-a-day-as-a-performance-schedule",
          title: "Four a day as a performance schedule",
        },
        {
          kind: "p",
          text: "Four a day is enough to schedule performance around a workload. AWS’s July 2026 storage blog describes a customer on 250\u00a0GiB gp3\u00a0volumes. Each weekday, the customer changed IOPS and throughput on this schedule, in UTC:",
        },
        {
          kind: "ul",
          items: [
            "At 11:00 pm, it raised them for a nightly batch.",
            "At 3:00 am, it went back to the 3,000\u00a0IOPS and 125\u00a0MiB/s baseline.",
            "At 5:30 am, it set them high again for the morning peak.",
            "At 11:00 am, it returned to baseline.",
          ],
        },
        {
          kind: "p",
          text: "Each change must complete before the next is due. So time your own modifications before you rely on a schedule.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "That schedule spends all four modifications within 12\u00a0hours. The gaps between them are 4, 2.5 and 5.5\u00a0hours.",
        },
        {
          kind: "p",
          text: "So the 3:00 am change must reach completed within 2.5\u00a0hours. Now say it took 6\u00a0hours, the time AWS gives for a fully used 1\u00a0TiB volume. The 5:30 am raise couldn’t start until 9:00 am.",
        },
        { kind: "svg", figure: figure2 },
      ],
    },
    {
      id: "elastic-volumes-pricing-what-a-change-costs",
      title: "Elastic Volumes pricing: what a change costs",
      blocks: [
        {
          kind: "p",
          text: "There’s no separate EBS Elastic Volumes pricing. In AWS’s words, “There is no charge to modify the configuration of a volume.”",
        },
        {
          kind: "p",
          text: "What changes is the volume’s own price. You pay for the new configuration from the moment the modification starts, not when it completes.",
        },
        {
          kind: "p",
          text: [
            "Storage is charged by the GB you provision per month, until you release it. On top of that, gp3 costs extra only for IOPS and throughput above its included 3,000\u00a0IOPS and 125\u00a0MiB/s. On io1 and io2, you pay for the ",
            { a: "provisioned IOPS", href: "/learn/glossary/provisioned-iops" },
            ", and io2’s IOPS rates are tiered.",
          ],
        },
        {
          kind: "p",
          text: "For gp3, provisioned storage, IOPS and throughput are charged per second, with a 60-second minimum. So IOPS you raise for a batch window, then reduce, cost that window at the higher rate, not a month.",
        },
        {
          kind: "p",
          text: "Size works the other way. A GiB you add stays in the volume’s monthly cost. The changes that reduce a volume’s cost are a cheaper type and less provisioned IOPS or throughput.",
        },
        {
          kind: "p",
          text: [
            "For example, gp3 costs 20 percent less per GiB than gp2. Our ",
            { a: "EBS pricing calculator", href: "/ebs-and-azure-disk-pricing" },
            " shows what a volume costs a month at list price, and what its empty space costs.",
          ],
        },
        { kind: "p", text: "When a volume needs to change:" },
        {
          kind: "ul",
          items: [
            [
              { b: "It’s filling up." },
              " Increase the size by enough to last until this modification completes and the next can start.",
            ],
            [
              { b: "It’s too slow." },
              " Raise IOPS on gp3, io1 or io2, and throughput on gp3 only. Or move gp2 to gp3, rather than adding GiB for the IOPS that come with them.",
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
      title: "Why Elastic Volumes can’t make a volume smaller",
      blocks: [
        {
          kind: "p",
          text: "AWS’s guide is plain: “You can’t decrease the volume size.” An attached EBS volume is a block device.",
        },
        {
          kind: "p",
          text: "The filesystem on it can keep data in any block, including the last ones. Removing the end of the device would remove part of the filesystem. Only the operating system inside the instance can move that data away first.",
        },
        { kind: "svg", figure: figure3 },
        {
          kind: "p",
          text: "The way to a smaller size is the one AWS names. Create a smaller volume, then migrate the data with an application-level tool such as rsync.",
        },
        {
          kind: "p",
          text: [
            "That means paying for two volumes while you copy. It also means stopping the services on the mount for the switch, as ",
            { a: "shrinking an EBS volume", href: "/learn/shrink-ebs-volume" },
            " explains. Until you do, every size increase is a new floor for what the volume costs.",
          ],
        },
      ],
    },
    {
      id: "how-amoeba-works-with-volumes-that-only",
      title: "How Amoeba works with volumes that only grow",
      blocks: [
        {
          kind: "p",
          text: [
            "Because EBS volumes only grow, ",
            { a: "Amoeba", href: "/amoeba" },
            ", which optimizes block storage on Azure and AWS, changes how many volumes hold the data instead.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "The pool." },
              " Amoeba moves an instance’s EBS data volumes onto one btrfs pool of gp3\u00a0volumes, sized to your data with room to grow. Each data mount keeps its path, and the root volume is never touched.",
            ],
            [
              { b: "The move." },
              " Amoeba copies your data while your services run. Then it switches each mount to the pool, with a short restart of the services that use it. If the switch fails, it puts the original mounts back and tries again.",
            ],
            [
              { b: "Growing." },
              " It grows the pool before it fills, and sooner when data arrives fast. It enlarges the pool’s gp3\u00a0volumes, or adds new ones, while the pool stays mounted.",
            ],
            [
              { b: "Shrinking." },
              " When your data goes down and stays down, it shrinks the pool one volume at a time. So you pay for close to what you use.",
            ],
            [
              { b: "The old volumes." },
              " Once the switch is checked, Amoeba snapshots and deletes each old volume. It deletes each snapshot a few days later.",
            ],
          ],
        },
        {
          kind: "p",
          text: "You pay for both sets of volumes only while the move runs, and then for the snapshots while they’re kept.",
        },
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
    text: "Amoeba moves a VM’s data disks onto one pool sized to your data, then rightsizes it autonomously, without any downtime after the one switch, one disk at a time. We estimate it takes 50–60% off block storage cost. It is an estimated range, not a promise. The free assessment works out your own figure.",
    links: [
      { label: "Block storage cost optimization with Amoeba", href: "/amoeba" },
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
      title: "How to increase EBS volume size without downtime on Linux",
      where: "Learn",
      href: "/learn/increase-ebs-volume-size",
    },
    {
      title: "How to shrink an EBS volume when AWS only lets it grow",
      where: "Learn",
      href: "/learn/shrink-ebs-volume",
    },
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
      title: "EBS volume types: pricing and how to choose",
      where: "Learn",
      href: "/learn/ebs-volume-types",
    },
  ],
};
