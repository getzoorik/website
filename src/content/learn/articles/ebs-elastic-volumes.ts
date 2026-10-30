import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/ebs-elastic-volumes/1";

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
  published: "2026-11-10",
  updated: "2026-11-10",
  author: "vineet",
  short:
    "EBS Elastic Volumes is AWS’s name for changing an Amazon Elastic Block Store (EBS) volume while it stays attached. On a current-generation instance you can increase its size, change its type, and raise or reduce input/output operations per second (IOPS) and throughput, without detaching the volume or restarting the instance. Each change passes from modifying to optimizing to completed, and a volume takes up to four changes in a rolling 24\u00a0hours. Elastic Volumes can’t make a volume smaller.",
  sections: [
    {
      id: "what-ebs-elastic-volumes-can-change",
      title: "What EBS Elastic Volumes can change",
      blocks: [
        {
          kind: "p",
          text: "AWS’s guide puts it in one line: with Elastic Volumes you can “increase the volume size, change the volume type, or adjust the performance” of an EBS volume. On current-generation instance types, nothing is detached or restarted. On a previous-generation type that doesn’t support Elastic Volumes, or when a modification returns an error, AWS’s fallback is to detach a data volume, modify it and attach it again, or to stop the instance to modify its root volume.",
        },
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
          kind: "p",
          text: "gp2 has no IOPS or throughput setting at all: its baseline is 3\u00a0IOPS per GiB, from a minimum of 100 up to 16,000, so on gp2 the only way Elastic Volumes gives you more IOPS is more GiB or a different type. A gp3\u00a0volume includes 3,000\u00a0IOPS and 125\u00a0MiB/s at any size and raises either one without adding a GiB, within two ratios: up to 500\u00a0IOPS per GiB, and up to 0.25\u00a0MiB/s of throughput per provisioned IOPS. io2’s 256,000\u00a0IOPS ceiling needs an instance built on the Nitro System.",
        },
      ],
    },
    {
      id: "how-to-modify-an-ebs-volume-type",
      title: "How to modify an EBS volume type without downtime",
      blocks: [
        {
          kind: "p",
          text: "You can change an EBS volume type without downtime on a current-generation instance. To modify an EBS volume from the AWS Command Line Interface (CLI), pass only what you want to change, since the rest keeps its current value unless a type change sets a default. The example moves gp2 to gp3, which AWS prices 20 percent below gp2 per GiB:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "aws ec2 modify-volume \\\n    --volume-id <volume-id> \\\n    --volume-type gp3 \\\n    --iops 3000 \\\n    --throughput 250",
        },
        {
          kind: "p",
          text: [
            "Name both performance values when you move to gp3. The EBS User Guide says a gp2\u00a0volume changed to gp3 without them gets the higher of its gp2-equivalent performance and the gp3 baseline, so its 500\u00a0GiB example at 250\u00a0MiB/s keeps 250\u00a0MiB/s on gp3. The CLI reference gives a flat default of 3,000\u00a0IOPS and 125\u00a0MiB/s instead. A submitted modification can’t be cancelled, so check the command first, then look for a ",
            { code: "ModificationState" },
            " of ",
            { code: "modifying" },
            " in the response.",
          ],
        },
        { kind: "p", text: "A type change must also fit the target type:" },
        {
          kind: "ul",
          items: [
            "Over 16,384\u00a0GiB, a volume can’t become gp2, io1, st1 or sc1.",
            "st1 and sc1 need at least 125\u00a0GiB.",
            "A root volume can’t become st1 or sc1, even when it’s detached.",
            "A volume with Multi-Attach enabled, which lets several instances share it, can only move between io1 and io2, including while it’s attached.",
          ],
        },
        {
          kind: "p",
          text: [
            "Two pages go further: ",
            { a: "comparing io2 and gp3", href: "/learn/io2-vs-gp3" },
            ", and ",
            { a: "moving from gp2 to gp3", href: "/learn/gp2-vs-gp3" },
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
            "Follow a modification through ",
            { code: "modifying" },
            ", ",
            { code: "optimizing" },
            " and ",
            { code: "completed" },
            " with:",
          ],
        },
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
            " percentage.",
          ],
        },
        { kind: "diagram", figure: figure1 },
        {
          kind: "p",
          text: [
            "A size increase takes effect as soon as the modification reaches ",
            { code: "optimizing" },
            ", which AWS says usually takes a few seconds, so you can grow the partition and filesystem without waiting for completed. The steps are in ",
            { a: "growing a volume and its filesystem", href: "/learn/increase-ebs-volume-size" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "Performance takes longer. While a volume is optimizing, its performance sits between the old and the new configuration, never below the old one, or below the new one when you’re reducing IOPS. AWS says performance changes take from a few minutes to a few hours, and puts a fully used 1\u00a0TiB volume at about 6\u00a0hours, though the time doesn’t always scale with size in a straight line.",
        },
        {
          kind: "p",
          text: "Initialization is one known cause of a long optimizing state. When you create a volume from a snapshot or from another volume, its data blocks must be written to it before it reaches full performance, which an empty volume skips. AWS says modifications take longer on a volume that isn’t fully initialized, and a new performance configuration can then take more than 24\u00a0hours. So let a restored volume finish initializing before you modify it. When you create a volume from a snapshot, you can also set a paid Provisioned Rate for Volume Initialization of 100 to 300\u00a0MiB/s, so initialization ends at a predictable time. Volume copies don’t support it.",
        },
        {
          kind: "p",
          text: [
            "Rarely, a transient AWS fault ends a modification as ",
            { code: "failed" },
            ", which AWS says isn’t a sign of trouble with the volume: you retry it. An Amazon EventBridge rule can notify you of modification events if you’d rather not poll.",
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
          text: "No. Search suggestions and older guides still pair EBS volume modification with 6\u00a0hours, from a rule that made you wait six hours between changes. On 15 January 2026, AWS announced up to four Elastic Volumes modifications per volume in a rolling 24-hour window, in every commercial Region, GovCloud (US) and China, with nothing to turn on. Its July 2026 storage blog puts it plainly: you no longer wait six hours between modifications.",
        },
        {
          kind: "p",
          text: [
            "Two rules apply now. A new modification starts only after the last one on that volume has reached completed, and a volume, which must be ",
            { code: "in-use" },
            " or ",
            { code: "available" },
            ", takes at most four in a rolling 24\u00a0hours. Go over the limit and the error message tells you when you can make the next one.",
          ],
        },
        {
          kind: "p",
          text: [
            "The other 6\u00a0hours is still in the docs, as a duration rather than a wait. AWS says a 1\u00a0TiB volume can typically take up to six hours to modify, and because the next change waits for completed, a six-hour modification blocks the next one for six hours, whatever the daily limit allows. Where you can, put size, type, IOPS and throughput changes in one ",
            { code: "modify-volume" },
            " call.",
          ],
        },
        {
          kind: "p",
          text: "Four a day is enough to schedule performance around a workload. The storage blog describes a customer on 250\u00a0GiB gp3\u00a0volumes that, on weekdays, raised IOPS and throughput at 11:00 pm UTC for a nightly batch, went back to the 3,000\u00a0IOPS and 125\u00a0MiB/s baseline at 3:00 am, raised them again at 5:30 am for the morning peak and returned to baseline at 11:00 am. It works only if each change completes before the next one is due, so time your own modifications before you rely on a schedule.",
        },
      ],
    },
    {
      id: "elastic-volumes-pricing-what-a-change-costs",
      title: "Elastic Volumes pricing: what a change costs",
      blocks: [
        {
          kind: "p",
          text: "There’s no separate EBS Elastic Volumes pricing. AWS says “There is no charge to modify the configuration of a volume,” and the volume’s own bill moves to the new configuration when the modification starts, not when it completes. Storage is charged by the GB you provision per month until you release it, and every gp3\u00a0volume includes 3,000\u00a0IOPS and 125\u00a0MiB/s, charging extra only for IOPS and throughput you provision above that. io1 and io2 charge for their provisioned IOPS, and io2’s IOPS rates are tiered.",
        },
        {
          kind: "p",
          text: "For gp3, provisioned storage, IOPS and throughput are billed in per-second increments with a 60-second minimum. So IOPS you raise for a batch window and reduce afterwards cost you that window at the higher rate, not a month. A GiB you add is billed from the start of its modification and no modification can remove it, so the changes that reduce a volume’s bill are a cheaper type, such as gp2 to gp3, and less provisioned IOPS or throughput.",
        },
        { kind: "p", text: "So when a volume needs to change:" },
        {
          kind: "ul",
          items: [
            "It’s filling up. Increase the size by enough to last until this modification completes and the next can start.",
            "It’s too slow. Raise IOPS on gp3, io1 or io2 (throughput on gp3 only), or move gp2 to gp3 rather than adding GiB for the IOPS that come with them.",
            "It’s much bigger than the data. No modification helps.",
          ],
        },
      ],
    },
    {
      id: "the-one-change-elastic-volumes-cant-make",
      title: "The one change Elastic Volumes can’t make",
      blocks: [
        {
          kind: "p",
          text: "AWS’s guide is plain on size: “You must increase the volume size. You can’t decrease the volume size.” An attached EBS volume is a block device, and the filesystem on it can keep data in any block, including the last ones. Removing the end of the device would remove part of the filesystem, and only the operating system inside the instance can move that data away first.",
        },
        {
          kind: "p",
          text: [
            "The way to a smaller size is the one AWS names: create a smaller volume and migrate the data with an application-level tool such as rsync. That means paying for two volumes while you copy, then stopping the services on the mount for the switch. You’ll find the route in ",
            { a: "shrinking an EBS volume", href: "/learn/shrink-ebs-volume" },
            ", and until you take it, every size increase is a new floor for the volume’s bill.",
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
            { a: "Amoeba", href: "/amoeba" },
            " optimizes Azure managed disks and Amazon EBS. Since no modification can make a volume smaller, Amoeba changes how many volumes hold the data instead.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "The pool." },
              " Amoeba moves a running EC2 instance’s EBS data volumes, never the root volume, onto one btrfs pool of at least 2 gp3\u00a0volumes in the same Availability Zone. Each data mount keeps its path. Amoeba sizes the pool from the highest use of the last 7\u00a0days, to sit 80% to 90% full by default.",
            ],
            [
              { b: "The one switch." },
              " After an rsync copy, the agent stops the systemd services holding the data mounts, mounts the pool at the old paths and restarts them. That restart is the interruption. If a switch fails, the original mounts come back and Amoeba retries, so services can restart more than once. After a 2-hour soak, Amoeba snapshots each source volume and deletes it.",
            ],
            [
              { b: "When data grows." },
              " Amoeba first grows the pool’s gp3\u00a0volumes in place, with one ModifyVolume call that changes size and performance together, then adds gp3\u00a0volumes while a free slot remains beyond the one it keeps for an urgent expand. It skips a volume whose last change is still optimizing, or that has had 4 changes in 24\u00a0hours.",
            ],
            [
              { b: "When data shrinks." },
              " Once the move is done and a full 7\u00a0days of data are in, Amoeba removes pool volumes one at a time: it moves a volume’s data onto the others, then detaches and deletes it. In “Manual”, each shrink waits for you.",
            ],
          ],
        },
        {
          kind: "p",
          text: "On AWS, Amoeba works on Windows and Linux instances. The instance must be managed by AWS Systems Manager with its SSM agent connected, be a Nitro type that exposes EBS as NVMe, and have at least one EBS data volume and 3 free attachment slots. On Linux, it needs systemd, kernel 5.14 or later and btrfs loaded or loadable, and every process that keeps a data mount open must run as a systemd service. Instances whose OS is in the Red Hat family aren’t moved. You pay for both sets of volumes until the source volumes are deleted after the soak, then for their snapshots for 7\u00a0days.",
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
  ],
};
