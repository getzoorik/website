import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/increase-ebs-volume-size/1";
import { figure as figure2 } from "@/features/learn/figures/increase-ebs-volume-size/2";
import { figure as figure3 } from "@/features/learn/figures/increase-ebs-volume-size/3";

export const article: Article = {
  slug: "increase-ebs-volume-size",
  title: "Increase EBS volume size without downtime on Linux",
  meta: "Increase EBS volume size without downtime: modify-volume, then growpart and xfs_growfs or resize2fs while it stays mounted, and why you keep paying for it.",
  h1: "How to increase EBS volume size without downtime on Linux",
  deck: "Grow the volume with Elastic Volumes, then its partition and filesystem, while the instance keeps running.",
  card: "Grow an attached EBS volume and its filesystem on Linux, the limits on changes, and why the new size stays.",
  product: "amoeba",
  hub: "Block storage",
  topic: "AWS block storage",
  published: "2026-11-01",
  updated: "2026-11-01",
  author: "swapna",
  cover: "/learn-covers/zoorik-learn-increase-ebs-volume-size-1200x630.webp",
  coverAlt:
    "Grow an EBS volume: the EBS volume, its partition and its filesystem each grow while mounted",
  short:
    "You can increase EBS volume size without downtime on any current-generation EC2 instance, but you can’t shrink the volume again. Raise the size with Elastic Volumes, wait for the optimizing state, then grow the partition (growpart) and filesystem (xfs_growfs or resize2fs) while mounted.",
  sections: [
    {
      id: "increase-ebs-volume-size-without-downtime",
      title: "When you can increase EBS volume size without downtime",
      blocks: [
        {
          kind: "p",
          text: [
            "Picture a 500\u00a0GiB data volume at ",
            { code: "/data" },
            " on a running EC2 instance, too small for an import due tomorrow. You can grow it to 1,000\u00a0GiB while the application keeps writing. You then pay for 1,000\u00a0GiB from that day on.",
          ],
        },
        {
          kind: "p",
          text: [
            "Elastic Volumes is AWS’s name for changing an ",
            { a: "Amazon Elastic Block Store (EBS) volume", href: "/learn/glossary/ebs-volume" },
            " in place. On an instance that supports it, a volume can grow, change type or change its performance. AWS says this works “without detaching the volume or restarting the instance,” and root volumes grow this way too.",
          ],
        },
        {
          kind: "p",
          text: "Growing a volume is two jobs. EBS grows the block device, and you extend the partition and filesystem inside the instance, which keep their old size until you do.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: "Whether it works without a stop depends on your instance type and volume:",
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
        { kind: "p", text: "Every modification follows four rules:" },
        {
          kind: "ul",
          items: [
            [{ b: "Up only." }, " AWS doesn’t let you decrease a volume’s size."],
            [
              { b: "No cancel." },
              " A submitted request can’t be cancelled, so check the number before you confirm.",
            ],
            [
              { b: "One at a time." },
              " Each modification must reach ",
              { code: "completed" },
              " before the next can start, and a volume takes at most four in a rolling 24-hour period. If it fills again before the first one completes, you can’t grow it a second time. So add enough the first time.",
            ],
            [
              { b: "Charged at once." },
              " You pay for the new size as soon as the modification starts.",
            ],
          ],
        },
      ],
    },
    {
      id: "how-to-modify-ebs-volume-size",
      title: "How to modify EBS volume size",
      blocks: [
        { kind: "h3", id: "1-find-the-volume-id", title: "1. Find the volume ID" },
        {
          kind: "p",
          text: [
            "To increase EBS volume size on an EC2 instance, work from the volume’s ID. On instances built on the Nitro System, EBS volumes appear as NVMe devices named ",
            { code: "/dev/nvme<x>n1" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "Those numbers follow the order the devices answered at boot, which can change between starts. The ID is stable, and an NVMe EBS volume carries it as its serial number. Xen instances use names such as ",
            { code: "/dev/xvdf" },
            ".",
          ],
        },
        { kind: "code", lang: "bash", code: "df -hT\nsudo lsblk -o +SERIAL" },
        {
          kind: "p",
          text: [
            { code: "df -hT" },
            " shows which device holds the mount that’s filling up, and its filesystem type. Then ",
            { code: "lsblk -o +SERIAL" },
            " puts the volume ID next to that device.",
          ],
        },
        { kind: "h3", id: "2-take-a-snapshot", title: "2. Take a snapshot" },
        {
          kind: "p",
          text: [
            "AWS calls a ",
            { a: "snapshot", href: "/learn/glossary/disk-snapshot" },
            " a best practice for any volume that holds valuable data, in case you need to roll back.",
          ],
        },
        { kind: "h3", id: "3-request-the-new-size", title: "3. Request the new size" },
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
        {
          kind: "h3",
          id: "4-wait-for-the-optimizing-state",
          title: "4. Wait for the optimizing state",
        },
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
            ", which usually takes a few seconds, and from then on, AWS says, you can extend the filesystem.",
          ],
        },
        {
          kind: "p",
          text: [
            "Don’t wait for ",
            { code: "completed" },
            ". The whole modification can take from a few minutes to a few hours, and AWS says a 1\u00a0TiB volume can take up to six.",
          ],
        },
        { kind: "svg", figure: figure2 },
        { kind: "p", text: "Check where it stands with:" },
        {
          kind: "code",
          lang: "bash",
          code: "aws ec2 describe-volumes-modifications \\\n    --volume-ids <volume-id>",
        },
        {
          kind: "p",
          text: "While the volume is optimizing, its performance doesn’t drop below the old configuration’s. If you’d rather not poll, Amazon EventBridge can notify you of modification events.",
        },
        {
          kind: "p",
          text: [
            "Rarely, a transient AWS fault ends a modification in a ",
            { code: "failed" },
            " state. AWS says that isn’t a sign of trouble with the volume. Retry it.",
          ],
        },
      ],
    },
    {
      id: "how-to-extend-an-ebs-volume-in",
      title: "How to extend an EBS volume in Linux",
      blocks: [
        {
          kind: "p",
          text: [
            "With the larger device in place, run ",
            { code: "lsblk" },
            " and compare the sizes. In AWS’s example on a Nitro instance, the root volume ",
            { code: "nvme0n1" },
            " holds two partitions, ",
            { code: "nvme0n1p1" },
            " and ",
            { code: "nvme0n1p128" },
            ". Beside it, a 30\u00a0GiB data volume, ",
            { code: "nvme1n1" },
            ", is mounted at ",
            { code: "/data" },
            " with no partition at all.",
          ],
        },
        {
          kind: "h3",
          id: "5-grow-the-partition-if-there-is",
          title: "5. Grow the partition, if there is one",
        },
        {
          kind: "p",
          text: [
            "A data volume formatted as a whole device skips this step. Where the partition is smaller than the volume, grow it with ",
            { code: "growpart" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "Give it the device and the partition number, with a space between them. For ",
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
            " should show the partition at the volume’s size.",
          ],
        },
        { kind: "h3", id: "6-grow-the-filesystem", title: "6. Grow the filesystem" },
        {
          kind: "p",
          text: [
            "Use the command for the filesystem type ",
            { code: "df -hT" },
            " reports. For XFS, ",
            { code: "xfs_growfs" },
            " takes the mount point.",
          ],
        },
        {
          kind: "p",
          text: [
            "For ext4, ",
            { code: "resize2fs" },
            " takes the device name that ",
            { code: "df -hT" },
            " shows for it. That’s ",
            { code: "/dev/nvme1n1" },
            " for a filesystem on the whole volume, or ",
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
            " keeps reading and writing throughout. You’re done when ",
            { code: "df -hT" },
            " shows the filesystem as large as the volume.",
          ],
        },
        {
          kind: "p",
          text: "If the volume holds Logical Volume Manager (LVM) logical volumes, the last step differs, and AWS says you must extend the logical volume with LVM.",
        },
        { kind: "h3", id: "when-a-layer-doesnt-grow", title: "When a layer doesn’t grow" },
        { kind: "p", text: "Three messages tell you which layer didn’t move:" },
        {
          kind: "table",
          columns: [
            { label: "Message", width: "32%" },
            { label: "From", width: "16%" },
            { label: "Means", width: "26%" },
            { label: "Then", width: "26%" },
          ],
          rows: [
            [
              [{ code: "No space left on device" }],
              ["growpart, as it makes a directory under ", { code: "/tmp" }],
              "Not enough free space for its temporary files",
              "Free some space and run it again",
            ],
            [
              [{ code: "NOCHANGE: partition 1 is size <n>. it cannot be grown" }],
              "growpart",
              "The partition already fills the volume",
              "Check that the modification succeeded",
            ],
            [
              [
                { code: "data size unchanged, skipping" },
                " or ",
                { code: "The filesystem is already <n> blocks long" },
              ],
              "xfs_growfs or resize2fs",
              "The filesystem already fills what’s under it",
              "Check the modification, then check that you grew the partition",
            ],
          ],
        },
      ],
    },
    {
      id: "can-you-auto-expand-ebs-volumes",
      title: "Can you auto expand EBS volumes?",
      blocks: [
        {
          kind: "p",
          text: "Not out of the box. EBS has no reading of how full your filesystem is. An AWS Storage Blog post on automating the job notes that this figure comes only from the operating system.",
        },
        {
          kind: "p",
          text: "So any auto expand is a pipeline you build around Elastic Volumes. In that post’s design, a monitor on the instance alerts at 80% of capacity. AWS services then add 20% to the volume, and a local script grows the partition with growpart and extends the filesystem.",
        },
        {
          kind: "p",
          text: [
            "For the usage reading, the post names the Amazon CloudWatch agent as AWS’s option. The guide to ",
            { a: "checking EBS volume usage", href: "/learn/check-ebs-volume-usage" },
            " shows how to collect it.",
          ],
        },
        {
          kind: "callout",
          label: "For engineers",
          text: "Amazon API Gateway passes the alert to an AWS Lambda function. That function starts an AWS Step Functions state machine, which does four things:",
        },
        {
          kind: "ol",
          items: [
            "It checks that the instance is eligible.",
            "It maps the mount point to its volume ID, with a script run through AWS Systems Manager.",
            "It takes a snapshot, if you chose one.",
            "It has a Lambda function make the modification.",
          ],
        },
        { kind: "p", text: "Systems Manager then runs the grow script." },
        {
          kind: "p",
          text: "The post dates from 2019, when a volume could be modified once every six hours. Today’s limit of four in a rolling 24\u00a0hours lets a volume that fills fast grow several times a day.",
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "Every one of those grows is permanent, and they compound.",
        },
        {
          kind: "p",
          text: "Say each adds 20% of the size at the time. A 500\u00a0GiB volume that triggers four times in one day then ends that day at about 1,037\u00a0GiB (500 × 1.2⁴), more than double.",
        },
        {
          kind: "p",
          text: "The post itself warns that leaving the root cause alone can add storage cost as volumes keep expanding. Give the automation a size ceiling where it stops and pages a person.",
        },
      ],
    },
    {
      id: "why-you-keep-paying-for-the-bigger",
      title: "Why you keep paying for the bigger size",
      blocks: [
        {
          kind: "p",
          text: "EBS charges for capacity, not data. AWS’s pricing page says volume storage is charged by the GB you provision per month, until you release the storage. With the one-way rule on size, every time you expand an EBS volume, you set a new floor for its cost.",
        },
        {
          kind: "p",
          text: "Back to the volume from the opening. You grow it to 1,000\u00a0GiB to land the import. A week later, the staging files are deleted and 450\u00a0GiB of data remains.",
        },
        { kind: "p", text: "You keep paying for 1,000\u00a0GiB every month." },
        {
          kind: "callout",
          label: "Worked example",
          text: [
            "The volume is now 450 ÷ 1,000 = 45% full, leaving 550\u00a0GiB empty, and the data would fit in the old 500\u00a0GiB. The EBS pricing page’s ",
            { a: "gp3", href: "/learn/glossary/ebs-gp3" },
            " example uses a Region that charges $0.08 per GB-month (October 2026).",
          ],
        },
        {
          kind: "p",
          text: "Say it’s a gp3\u00a0volume in that Region. Its storage went from 500 × $0.08 = $40 to 1,000 × $0.08 = $80 a month. Of that, 550 × $0.08 = $44 pays for empty space.",
        },
        {
          kind: "p",
          text: [
            "Rates vary by Region and change. The ",
            { a: "EBS pricing calculator", href: "/ebs-and-azure-disk-pricing" },
            " shows what a volume costs a month at list price, and what its empty space costs.",
          ],
        },
        { kind: "svg", figure: figure3 },
        {
          kind: "p",
          text: [
            "Getting the space back means ",
            { a: "shrinking the volume by hand", href: "/learn/shrink-ebs-volume" },
            ", in three steps:",
          ],
        },
        {
          kind: "ol",
          items: [
            "Create a smaller volume.",
            "Copy the data with a tool such as rsync.",
            "Switch the mount, with its services stopped.",
          ],
        },
        { kind: "p", text: "Two habits keep growth from setting your cost:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Grow when the volume fills, not months ahead." },
              " The new space is usable within seconds, and four modifications a day leave room for smaller steps.",
            ],
            [
              { b: "Change the performance when you need speed." },
              " Elastic Volumes can change ",
              { a: "IOPS", href: "/learn/glossary/iops" },
              " on gp3, io1 and io2\u00a0volumes, and throughput on gp3, without adding a GiB. The new figures must stay within the volume type’s limits. ",
              { a: "EBS Elastic Volumes", href: "/learn/ebs-elastic-volumes" },
              " covers type and performance changes in full.",
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
            " optimizes block storage on Azure and AWS. The steps above leave one volume at a fixed size. Amoeba keeps an instance’s data in one pool instead, and rightsizes that pool as your data changes.",
          ],
        },
        {
          kind: "h3",
          id: "what-amoeba-does-with-your-volumes",
          title: "What Amoeba does with your volumes",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "What it works on." },
              " The data volumes of running EC2 instances, and the managed data disks of Azure VMs. It never touches the root volume or OS disk.",
            ],
            [
              { b: "The pool." },
              " It moves an instance’s EBS data volumes onto one btrfs pool sized to your data, with room to grow. On AWS the pool uses gp3.",
            ],
            [
              { b: "The move." },
              " Amoeba copies your data while your services run. Then it switches each mount to the pool, with a short restart of the services that use it. If the switch fails, it puts the original mounts back and tries again.",
            ],
            [
              { b: "Growing." },
              " It grows the pool before it fills, and sooner when data arrives fast. It enlarges the pool’s volumes or adds new ones while the pool stays mounted, with no growpart or filesystem step on your side.",
            ],
            [
              { b: "Shrinking." },
              " When your data goes down and stays down, it shrinks the pool one volume at a time. So your cost stays close to what you use.",
            ],
            [
              { b: "The old volumes." },
              " Once the switch is checked, Amoeba snapshots each old volume and deletes it. It keeps the snapshot for a few days, then deletes that too.",
            ],
            [
              { b: "Cost during the move." },
              " You pay for both sets of volumes only while the move runs, and then for the snapshots while they’re kept.",
            ],
          ],
        },
        { kind: "h3", id: "what-an-instance-needs", title: "What an instance needs" },
        {
          kind: "p",
          text: "Amoeba works on Windows and Linux instances. Each instance needs a few things:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "On AWS:" },
              " the instance must be running and managed by AWS Systems Manager, with its SSM agent connected. It must be a Nitro type that exposes EBS as NVMe. It needs at least one EBS data volume and a few free attachment slots for the pool.",
            ],
            [
              { b: "On Linux:" },
              " a recent kernel with btrfs. Every service that keeps a data mount open must run under systemd.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "The page on ",
            { a: "EBS cost optimization", href: "/ebs-cost-optimization" },
            " covers Amoeba on AWS in full, from onboarding to what each instance needs.",
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
      title: "EBS volume types: pricing and how to choose",
      where: "Learn",
      href: "/learn/ebs-volume-types",
    },
    {
      title: "How to expand an Azure disk without downtime",
      where: "Learn",
      href: "/learn/azure-disk-expand-without-downtime",
    },
  ],
};
