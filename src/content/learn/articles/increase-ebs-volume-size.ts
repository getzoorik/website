import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/increase-ebs-volume-size/1";

export const article: Article = {
  slug: "increase-ebs-volume-size",
  title: "Increase EBS volume size without downtime on Linux",
  meta: "Increase EBS volume size without downtime: modify-volume, then growpart and xfs_growfs or resize2fs while it stays mounted, and why the new size stays billed.",
  h1: "How to increase EBS volume size without downtime on Linux",
  deck: "Grow the volume with Elastic Volumes, then its partition and filesystem, while the instance keeps running.",
  card: "Grow an attached EBS volume and its filesystem on Linux, the limits on changes, and why the new size stays.",
  product: "amoeba",
  hub: "Block storage",
  topic: "AWS block storage",
  published: "2026-11-05",
  updated: "2026-11-05",
  author: "swapna",
  short: [
    "You can increase EBS volume size without downtime on any current-generation EC2 instance. Raise the size with Elastic Volumes, in the EC2 console or with ",
    { code: "aws ec2 modify-volume" },
    ", wait a few seconds for the modification to reach the optimizing state, then grow the partition with growpart and the filesystem with xfs_growfs or resize2fs while it stays mounted. Nothing is detached or restarted. The larger size then stays on your bill, because an EBS volume can’t be made smaller.",
  ],
  sections: [
    {
      id: "when-you-can-increase-ebs-volume-size",
      title: "When you can increase EBS volume size without downtime",
      blocks: [
        {
          kind: "p",
          text: "Elastic Volumes is AWS’s name for changing an Amazon Elastic Block Store (EBS) volume in place. On an instance that supports it, you can increase a volume’s size, change its type or adjust its performance “without detaching the volume or restarting the instance,” and your application keeps running while the change takes effect. Root volumes grow this way too, not only data volumes.",
        },
        {
          kind: "p",
          text: "Growing a volume is two jobs. EBS grows the block device, and you extend the partition and filesystem inside the instance, which keep their old size until you do.",
        },
        {
          kind: "table",
          columns: [
            { label: "Situation", width: "29%" },
            { label: "Without downtime?", width: "14%" },
            { label: "What it takes", width: "57%" },
          ],
          rows: [
            [
              "Any current-generation instance type",
              "Yes",
              "Elastic Volumes, then grow the partition and filesystem",
            ],
            [
              "Previous-generation C1, C3, C4, G2, I2, M1, M3, M4, R3 or R4",
              "Yes",
              "The same steps. AWS notes that m3.large, m3.xlarge and m3.2xlarge might not support every modification feature",
            ],
            [
              "Any other previous-generation type, or a modification that returns an error",
              "No",
              "Data volume: detach it, modify it, attach it again. Root volume: stop the instance, modify the volume, start the instance",
            ],
            [
              "Volume attached before 3 November 2016, 23:40 UTC",
              "Not the first time",
              "Detach and attach the volume, or stop and start the instance, once, to initialize Elastic Volumes support",
            ],
            [
              "Root volume on an AMI with MBR partitioning",
              "Up to 2\u00a0TiB (2,048\u00a0GiB)",
              "Linux AMIs need a GUID partition table (GPT) and GRUB 2 to boot from a volume of 2\u00a0TiB or more. Data volumes don’t have this boot limit, but no volume can grow past what its partitioning scheme and filesystem support",
            ],
          ],
        },
        { kind: "p", text: "Four rules apply to every modification:" },
        {
          kind: "ul",
          items: [
            "The size only goes up: AWS doesn’t let you decrease a volume’s size.",
            "A request can’t be cancelled once you submit it, so check the number before you confirm.",
            [
              "One modification runs at a time. Each must reach ",
              { code: "completed" },
              " before the next can start, and a volume takes at most four in a rolling 24-hour period.",
            ],
            "You’re charged for the new size from the moment the modification starts.",
          ],
        },
        {
          kind: "p",
          text: "A size increase is usable within seconds, but the whole modification can take from a few minutes to a few hours, and AWS says a 1\u00a0TiB volume can take up to six. If the volume fills again before then, you can’t grow it a second time, so add enough the first time.",
        },
      ],
    },
    {
      id: "how-to-modify-ebs-volume-size",
      title: "How to modify EBS volume size",
      blocks: [
        {
          kind: "p",
          text: [
            "To increase EBS volume size on an EC2 instance, start with the volume’s ID. On instances built on the Nitro System, EBS volumes appear as NVMe devices named ",
            { code: "/dev/nvme<x>n1" },
            ", numbered in the order they answered at boot, which can change from one start to the next. The ID is stable, and an NVMe EBS volume carries it as its serial number. Xen instances use names such as ",
            { code: "/dev/xvdf" },
            ".",
          ],
        },
        { kind: "code", lang: "bash", code: "df -hT\nsudo lsblk -o +SERIAL" },
        {
          kind: "p",
          text: [
            { code: "df -hT" },
            " shows which device holds the mount that’s filling up, and its filesystem type. ",
            { code: "lsblk -o +SERIAL" },
            " puts the volume ID next to that device.",
          ],
        },
        {
          kind: "p",
          text: "Take a snapshot of the volume first, which AWS calls a best practice for any volume that holds valuable data, in case you need to roll back.",
        },
        { kind: "h3", id: "request-the-new-size", title: "Request the new size" },
        {
          kind: "p",
          text: "In the EC2 console, open Volumes, select the volume and choose Actions, Modify volume. Enter the new value under Size, choose Modify, and confirm. With the AWS Command Line Interface (CLI), one command does it, with the size in GiB:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "aws ec2 modify-volume \\\n    --volume-id <volume-id> \\\n    --size <new-size-GiB>",
        },
        {
          kind: "p",
          text: [
            "The response shows ",
            { code: "OriginalSize" },
            ", ",
            { code: "TargetSize" },
            " and a ",
            { code: "ModificationState" },
            " of ",
            { code: "modifying" },
            ".",
          ],
        },
        { kind: "h3", id: "wait-for-the-optimizing-state", title: "Wait for the optimizing state" },
        {
          kind: "p",
          text: [
            "A modification moves through three states: ",
            { code: "modifying" },
            ", ",
            { code: "optimizing" },
            " and ",
            { code: "completed" },
            ". The size increase takes effect at ",
            { code: "optimizing" },
            ", which usually takes a few seconds, and AWS says you can extend the filesystem from that point. Check where it stands with:",
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
            "While the volume is optimizing, its performance doesn’t drop below the old configuration’s. Rarely, a transient AWS fault ends a modification in a ",
            { code: "failed" },
            " state, which AWS says isn’t a sign of trouble with the volume, so you retry the modification. If you’d rather not poll, Amazon EventBridge can notify you of modification events.",
          ],
        },
      ],
    },
    {
      id: "how-to-extend-an-ebs-volume-in",
      title: "How to extend an EBS volume in Linux",
      blocks: [
        { kind: "diagram", figure: figure1 },
        {
          kind: "p",
          text: [
            "With the larger device in place, grow the partition if there is one, then the filesystem. Start with ",
            { code: "lsblk" },
            " and compare the sizes. In AWS’s example on a Nitro instance, the root volume ",
            { code: "nvme0n1" },
            " holds the partitions ",
            { code: "nvme0n1p1" },
            " and ",
            { code: "nvme0n1p128" },
            ", while a 30\u00a0GiB data volume, ",
            { code: "nvme1n1" },
            ", is mounted at ",
            { code: "/data" },
            " with no partition at all. A data volume formatted as a whole device skips the next step.",
          ],
        },
        {
          kind: "p",
          text: [
            "Where the partition is smaller than the volume, grow it with ",
            { code: "growpart" },
            ", giving the device and the partition number with a space between them. For ",
            { code: "nvme0n1p1" },
            ", that number is ",
            { code: "1" },
            ":",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "sudo lsblk\nsudo growpart /dev/nvme0n1 1\nsudo lsblk",
        },
        {
          kind: "p",
          text: [
            "The second ",
            { code: "lsblk" },
            " should show the partition at the volume’s size. Then grow the filesystem with the command for the type ",
            { code: "df -hT" },
            " reports. XFS takes the mount point. Ext4 takes the device name ",
            { code: "df -hT" },
            " shows for it, such as ",
            { code: "/dev/nvme1n1" },
            " for a filesystem on the whole volume or ",
            { code: "/dev/nvme0n1p1" },
            " for one on a partition:",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "sudo xfs_growfs -d /data         # XFS\nsudo resize2fs /dev/nvme1n1      # ext4\ndf -hT",
        },
        {
          kind: "p",
          text: [
            "Both commands grow the filesystem while it’s mounted, so the application on ",
            { code: "/data" },
            " keeps reading and writing throughout. When ",
            { code: "df -hT" },
            " shows the filesystem at the volume’s size, you’re done.",
          ],
        },
        { kind: "p", text: "Three messages tell you which layer didn’t move:" },
        {
          kind: "ul",
          items: [
            [
              { code: "No space left on device" },
              " from growpart, as it makes a directory under ",
              { code: "/tmp" },
              ", means there isn’t enough free space for its temporary files. Free some space and run it again.",
            ],
            [
              { code: "NOCHANGE: partition 1 is size <n>. it cannot be grown" },
              " means the partition already fills the volume. Check that the modification succeeded.",
            ],
            [
              { code: "data size unchanged, skipping" },
              " from xfs_growfs, or ",
              { code: "The filesystem is already <n> blocks long" },
              " from resize2fs, means the filesystem already fills what’s under it. Check the modification, then check that you grew the partition.",
            ],
          ],
        },
        {
          kind: "p",
          text: "If the volume holds Logical Volume Manager (LVM) logical volumes, the last step differs: AWS says you must extend the logical volume with LVM.",
        },
      ],
    },
    {
      id: "can-you-auto-expand-ebs-volumes",
      title: "Can you auto expand EBS volumes?",
      blocks: [
        {
          kind: "p",
          text: "Not out of the box. EBS has no reading of how full your filesystem is: an AWS Storage Blog post on automating the job notes that the figure comes only from the operating system. So any auto expand is a pipeline you build around Elastic Volumes.",
        },
        {
          kind: "p",
          text: [
            "In that post’s design, a monitor on the instance raises an alert when a volume reaches 80% of capacity, and Amazon API Gateway passes it to an AWS Lambda function that starts an AWS Step Functions state machine. Its steps check that the instance is eligible, map the mount point to its volume ID with a script run through AWS Systems Manager, take an optional snapshot and have a Lambda function add 20% to the volume. Systems Manager then runs a script on the instance that grows the partition with growpart and extends the filesystem. For the usage reading, the post names the Amazon CloudWatch agent as AWS’s option, and ",
            { a: "the guide to volume usage", href: "/learn/check-ebs-volume-usage" },
            " shows how to collect it.",
          ],
        },
        {
          kind: "p",
          text: "The post dates from 2019, when a volume could be modified once every six hours. Today’s limit is four modifications in a rolling 24\u00a0hours, so a volume that fills fast can grow several times a day. Every one of those grows is permanent, and the post itself warns that leaving the root cause alone can add storage cost as volumes keep expanding. Give the automation a size ceiling where it stops and pages a person.",
        },
      ],
    },
    {
      id: "why-the-bigger-size-stays-on-your",
      title: "Why the bigger size stays on your bill",
      blocks: [
        {
          kind: "p",
          text: "EBS bills for capacity, not data. AWS’s pricing page says volume storage is charged by the GB you provision per month until you release the storage. Put that next to the one-way rule on size and the charge that starts with each modification, and every time you expand an EBS volume you set a new floor for its bill.",
        },
        {
          kind: "p",
          text: [
            "Say you grow a 500\u00a0GiB data volume to 1,000\u00a0GiB to land a large import, and a week later the staging files are deleted and 450\u00a0GiB of data remains. You keep paying for 1,000\u00a0GiB every month. Getting the space back means ",
            { a: "shrinking the volume by hand", href: "/learn/shrink-ebs-volume" },
            ": creating a smaller volume, copying the data across with a tool such as rsync and moving the mount over, with the services on that mount stopped for the switch.",
          ],
        },
        { kind: "p", text: "Two habits keep growth from setting the bill:" },
        {
          kind: "ul",
          items: [
            "Grow when the volume fills, not months ahead. The new space is usable within seconds, and four modifications a day leave room for smaller steps.",
            [
              "If you’re growing for speed rather than space, change the performance instead. Elastic Volumes can change IOPS on gp3, io1 and io2\u00a0volumes, and throughput on gp3, without adding a GiB as long as the new figures stay within the volume type’s limits. The guide to ",
              { a: "type and performance changes", href: "/learn/ebs-elastic-volumes" },
              " covers those.",
            ],
          ],
        },
      ],
    },
    {
      id: "how-amoeba-expands-a-pool-as-it",
      title: "How Amoeba expands a pool as it fills",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " optimizes block storage on Azure and AWS: Azure managed disks and Amazon EBS volumes. Where the steps above leave one volume at a fixed size, Amoeba keeps an instance’s data in a pool that grows as it fills and gives volumes back as it empties.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "The one switch." },
              " Amoeba pools the EBS data volumes of a running EC2 instance onto gp3\u00a0volumes in the instance’s Availability Zone, and never touches the root volume. It sizes the pool from the highest use of the last 7\u00a0days, with room for the largest recent 15-minute rise and at least 10\u00a0GiB free. Each data mount keeps its path. At the switch onto the pool, the systemd services that use those mounts restart. That restart is the interruption, repeated only if a failed switch is retried.",
            ],
            [
              { b: "When it expands." },
              " Amoeba holds each pool 80% to 90% full by default and decides on every 15-second agent report. It expands when the lowest use over the last 30\u00a0minutes is above the top of that band. It expands urgently when free space falls below the safety floor, 5% of the pool or 10\u00a0GiB, whichever is larger, or when the last 10\u00a0minutes’ fill rate would reach that floor within 30\u00a0minutes.",
            ],
            [
              { b: "How it expands." },
              " The pool stays mounted, and there’s no growpart or filesystem step for you to run. Amoeba first grows existing gp3\u00a0volumes in place, with one ModifyVolume call that changes size and performance together, then adds gp3\u00a0volumes while a free slot remains beyond the one it keeps for an urgent expand. It skips a volume whose last change is still optimizing, or that has had 4 changes in 24\u00a0hours. Expands run in “Auto” and in “Manual”, and a move paused after the switch still allows the urgent expand.",
            ],
            [
              { b: "When data shrinks." },
              " Shrinks start once the move is done and a full 7\u00a0days of data are in. One volume at a time, the agent moves its data onto the others with ",
              { code: "btrfs device remove" },
              ", and Amoeba detaches and deletes the empty volume, which ends its billing. In “Manual” each shrink waits for you.",
            ],
          ],
        },
        {
          kind: "p",
          text: "On AWS, the instance must be running, managed by AWS Systems Manager with its SSM agent connected, and a Nitro type that exposes EBS as NVMe, with at least one EBS data volume and 3 free attachment slots, two for the pool’s first volumes and one kept for an urgent expand. Amoeba works on Windows and Linux instances. On Linux, the instance needs systemd, kernel 5.14 or later and btrfs loaded or loadable, and every process that keeps a data mount open must run as a systemd service. Instances whose OS is in the Red Hat family aren’t moved. During the move you pay for both sets of volumes until the sources are deleted after the 2-hour soak, and then for their safety snapshots for 7\u00a0days.",
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
      title: "“Requirements for Amazon EBS volume modifications”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/modify-volume-requirements.html",
    },
    {
      publisher: "AWS",
      title: "“Request Amazon EBS volume modifications”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/requesting-ebs-volume-modifications.html",
    },
    {
      publisher: "AWS",
      title: "“Monitor the progress of Amazon EBS volume modifications”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/monitoring-volume-modifications.html",
    },
    {
      publisher: "AWS",
      title: "“Extend the file system after resizing an Amazon EBS volume”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/recognize-expanded-volume-linux.html",
    },
    {
      publisher: "AWS",
      title: "“Map Amazon EBS volumes to NVMe device names”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/identify-nvme-ebs-device.html",
    },
    {
      publisher: "AWS Storage Blog",
      title:
        "“Automating Amazon EBS volume resizing with AWS Step Functions and AWS Systems Manager”",
      url: "https://aws.amazon.com/blogs/storage/automating-amazon-ebs-volume-resizing-with-aws-step-functions-and-aws-systems-manager/",
    },
    { publisher: "AWS", title: "“Amazon EBS pricing”", url: "https://aws.amazon.com/ebs/pricing/" },
  ],
  related: [
    {
      title: "How to shrink an EBS volume when AWS only lets it grow",
      where: "Learn",
      href: "/learn/shrink-ebs-volume",
    },
    {
      title: "EBS Elastic Volumes: what you can change, and what you can’t",
      where: "Learn",
      href: "/learn/ebs-elastic-volumes",
    },
    {
      title: "How to check EBS volume usage: used space vs paid space",
      where: "Learn",
      href: "/learn/check-ebs-volume-usage",
    },
    {
      title: "How to combine EBS volumes into one: LVM, RAID 0 or a btrfs pool",
      where: "Learn",
      href: "/learn/combine-ebs-volumes",
    },
    {
      title: "How to expand an Azure disk without downtime",
      where: "Learn",
      href: "/learn/azure-disk-expand-without-downtime",
    },
  ],
};
