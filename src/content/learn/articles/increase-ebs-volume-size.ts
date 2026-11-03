import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/increase-ebs-volume-size/1";
import { figure as figure2 } from "@/features/learn/figures/increase-ebs-volume-size/2";
import { figure as figure3 } from "@/features/learn/figures/increase-ebs-volume-size/3";

export const article: Article = {
  slug: "increase-ebs-volume-size",
  title: "Increase EBS volume size without downtime",
  meta: "Increase EBS volume size without downtime on Linux: modify the volume, then grow its partition (growpart) and filesystem (xfs_growfs or resize2fs).",
  h1: "Increase EBS volume size without downtime",
  deck: "Steps for Linux. A volume can’t shrink back, so you keep paying for the larger size.",
  card: "Grow a mounted EBS volume, its partition and its filesystem on Linux, within AWS’s limits.",
  product: "amoeba",
  hub: "Block storage",
  topic: "AWS block storage",
  published: "2026-11-01",
  updated: "2026-11-03",
  author: "swapna",
  cover: "/learn-covers/zoorik-learn-increase-ebs-volume-size-1200x630.webp",
  coverAlt:
    "Grow an EBS volume: the EBS volume, its partition and its filesystem each grow while mounted",
  short:
    "Request the new size with Elastic Volumes. Once the modification reaches optimizing, usually within seconds, grow the partition with growpart and the filesystem with xfs_growfs or resize2fs. The volume stays mounted throughout. This works on any current-generation EC2 instance, but the volume can never shrink again.",
  sections: [
    {
      id: "increase-ebs-volume-size-without-downtime",
      title: "Requirements and limits",
      blocks: [
        {
          kind: "p",
          text: [
            "Elastic Volumes is AWS’s name for changing an ",
            { a: "Amazon Elastic Block Store (EBS) volume", href: "/learn/glossary/ebs-volume" },
            " in place: its size, type or performance. On a supported instance, AWS says this works “without detaching the volume or restarting the instance.” Root volumes grow this way too.",
          ],
        },
        {
          kind: "p",
          text: [
            "Take a 500 GiB data volume at ",
            { code: "/data" },
            ", too small for tomorrow’s import. You can grow it to 1,000 GiB while the application keeps writing.",
          ],
        },
        {
          kind: "p",
          text: "Growing is two jobs. EBS grows the block device. You then grow the partition and filesystem inside the instance, which keep their old size until you do.",
        },
        { kind: "svg", figure: figure1 },
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
              "The same steps. AWS says m3.large, m3.xlarge and m3.2xlarge might not support every change",
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
              "Up to 2 TiB (2,048 GiB)",
              "Linux AMIs need a GUID partition table (GPT) and GRUB 2 to boot from 2 TiB or more. Data volumes have no boot limit, but no volume can outgrow its partitioning scheme and filesystem",
            ],
          ],
        },
        { kind: "p", text: "Four rules apply to every modification:" },
        {
          kind: "ul",
          items: [
            [{ b: "Up only." }, " You can’t decrease a volume’s size."],
            [
              { b: "No cancel." },
              " A submitted request can’t be cancelled, so check the number before you confirm.",
            ],
            [
              { b: "One at a time." },
              " Each modification must reach ",
              { code: "completed" },
              " before the next can start, and a volume takes at most four in a rolling 24 hours.",
            ],
            [
              { b: "Charged at once." },
              " You pay for the new size from the moment the modification starts.",
            ],
          ],
        },
      ],
    },
    {
      id: "how-to-modify-ebs-volume-size",
      title: "Modify the volume",
      blocks: [
        { kind: "h3", id: "1-find-the-volume-id", title: "1. Find the volume ID" },
        {
          kind: "p",
          text: [
            "Work from the volume ID, because device names can change. On Nitro instances, EBS volumes appear as NVMe devices named ",
            { code: "/dev/nvme<x>n1" },
            ", and the numbers can change between starts. Xen instances use names such as ",
            { code: "/dev/xvdf" },
            ".",
          ],
        },
        { kind: "p", text: "An NVMe EBS volume carries its volume ID as its serial number:" },
        { kind: "code", lang: "bash", code: "df -hT\nsudo lsblk -o +SERIAL" },
        {
          kind: "p",
          text: [
            { code: "df -hT" },
            " shows which device holds the mount that’s filling up, and its filesystem type. ",
            { code: "lsblk -o +SERIAL" },
            " shows the volume ID beside each device.",
          ],
        },
        { kind: "h3", id: "2-take-a-snapshot", title: "2. Take a snapshot" },
        {
          kind: "p",
          text: [
            "AWS calls a ",
            { a: "snapshot", href: "/learn/glossary/disk-snapshot" },
            " a best practice before you modify a volume that holds valuable data, in case you need to roll back.",
          ],
        },
        { kind: "h3", id: "3-request-the-new-size", title: "3. Request the new size" },
        {
          kind: "p",
          text: "In the EC2 console, open Volumes, select the volume and choose Actions, Modify volume. Enter the new value under Size, choose Modify, and confirm. With the AWS CLI, give the size in GiB:",
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
          title: "4. Wait for optimizing",
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
            ", usually within a few seconds. From then on, AWS says, you can extend the filesystem.",
          ],
        },
        {
          kind: "p",
          text: [
            "Don’t wait for ",
            { code: "completed" },
            ". AWS says a modification can take a few minutes to a few hours, and up to six hours for a 1 TiB volume.",
          ],
        },
        { kind: "svg", figure: figure2 },
        { kind: "p", text: "Check the state with:" },
        {
          kind: "code",
          lang: "bash",
          code: "aws ec2 describe-volumes-modifications \\\n    --volume-ids <volume-id>",
        },
        {
          kind: "p",
          text: "During optimizing, performance stays at least at the old configuration’s level. To avoid polling, Amazon EventBridge can notify you of modification events.",
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
      id: "how-to-extend-an-ebs-volume-in",
      title: "Grow the partition and filesystem",
      blocks: [
        {
          kind: "p",
          text: [
            "Run ",
            { code: "lsblk" },
            " and compare the sizes. In AWS’s Nitro example, the root volume ",
            { code: "nvme0n1" },
            " holds two partitions, ",
            { code: "nvme0n1p1" },
            " and ",
            { code: "nvme0n1p128" },
            ". A 30 GiB data volume, ",
            { code: "nvme1n1" },
            ", is mounted at ",
            { code: "/data" },
            " with no partition.",
          ],
        },
        {
          kind: "h3",
          id: "5-grow-the-partition-if-there-is",
          title: "5. Grow the partition",
        },
        {
          kind: "p",
          text: [
            "Skip this step for a volume with no partition. Where the partition is smaller than the volume, grow it with ",
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
            " reports. For ",
            { a: "XFS", href: "/learn/glossary/xfs" },
            ", ",
            { code: "xfs_growfs" },
            " takes the mount point.",
          ],
        },
        {
          kind: "p",
          text: [
            "For ext4, ",
            { code: "resize2fs" },
            " takes the device name ",
            { code: "df -hT" },
            " shows. That’s ",
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
            " keeps reading and writing. You’re done when ",
            { code: "df -hT" },
            " shows the filesystem as large as the volume.",
          ],
        },
        {
          kind: "p",
          text: "If the volume holds Logical Volume Manager (LVM) logical volumes, AWS says you must extend the logical volume with LVM instead.",
        },
        { kind: "h3", id: "when-a-layer-doesnt-grow", title: "If df shows the old size" },
        { kind: "p", text: "Each message points to the layer that didn’t grow:" },
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
      title: "Auto expand EBS volumes",
      blocks: [
        {
          kind: "p",
          text: "EBS has no built-in auto expand. It can’t see how full your filesystem is: an AWS Storage Blog post on automating the job notes that only the operating system knows.",
        },
        {
          kind: "p",
          text: "So auto expand is a pipeline you build around Elastic Volumes. In the post’s design, a monitor on the instance alerts at 80% of capacity. AWS services then add 20% to the volume, and a script on the instance grows the partition and filesystem.",
        },
        {
          kind: "p",
          text: [
            "For the usage reading, the post suggests the Amazon CloudWatch agent. The guide to ",
            { a: "checking EBS volume usage", href: "/learn/check-ebs-volume-usage" },
            " shows how to collect it.",
          ],
        },
        {
          kind: "callout",
          label: "For engineers",
          text: "Amazon API Gateway passes the alert to an AWS Lambda function. That function starts an AWS Step Functions state machine, which runs these steps:",
        },
        {
          kind: "ol",
          items: [
            "Checks that the instance is eligible.",
            "Maps the mount point to its volume ID, with a script run through AWS Systems Manager.",
            "Takes a snapshot, if you chose one.",
            "Has a Lambda function make the modification.",
            "Runs the grow script through Systems Manager.",
          ],
        },
        {
          kind: "p",
          text: "A volume that fills fast can grow up to four times in 24 hours.",
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "Every increase is permanent, and they compound.",
        },
        {
          kind: "p",
          text: "Say each adds 20% of the size at the time. A 500 GiB volume that triggers four times in one day ends at about 1,037 GiB (500 × 1.2⁴), more than double.",
        },
        {
          kind: "p",
          text: "The post itself warns that leaving the root cause alone can add storage cost as volumes keep expanding. Give the automation a size ceiling where it stops and pages a person.",
        },
      ],
    },
    {
      id: "why-you-keep-paying-for-the-bigger",
      title: "Cost of a bigger volume",
      blocks: [
        {
          kind: "p",
          text: "EBS charges for capacity, not data. AWS’s pricing page says volume storage is charged by the GB you provision per month, until you release it.",
        },
        {
          kind: "p",
          text: "Back to the opening example. You grow the volume to 1,000 GiB for the import. A week later, the staging files are deleted and 450 GiB of data remains.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: [
            "The volume is now 450 ÷ 1,000 = 45% full, with 550 GiB empty. The data would fit in the old 500 GiB. AWS’s ",
            { a: "gp3", href: "/learn/glossary/ebs-gp3" },
            " pricing example uses a Region that charges $0.08 per GB-month (November 2026).",
          ],
        },
        {
          kind: "p",
          text: "For a gp3 volume in that Region, storage went from 500 × $0.08 = $40 to 1,000 × $0.08 = $80 a month. Of that, 550 × $0.08 = $44 pays for empty space.",
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
            ":",
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
        { kind: "p", text: "Two habits keep the size close to your data:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Grow when the volume fills, not months ahead." },
              " The new space is usable within seconds, and four modifications a day allow small steps.",
            ],
            [
              { b: "Change performance, not size, when you need speed." },
              " Elastic Volumes can raise ",
              { a: "IOPS", href: "/learn/glossary/iops" },
              " on gp3, io1 and io2 volumes, and throughput on gp3, within each type’s limits. ",
              { a: "EBS Elastic Volumes", href: "/learn/ebs-elastic-volumes" },
              " covers type and performance changes.",
            ],
          ],
        },
      ],
    },
    {
      id: "how-amoeba-expands-a-pool-as-it",
      title: "Where Amoeba fits",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " rightsizes block storage on Azure and AWS without any downtime. Growing a volume by hand fixes it at its largest size. Amoeba’s pool follows your data both ways.",
          ],
        },
        {
          kind: "h3",
          id: "what-amoeba-does-with-your-volumes",
          title: "What Amoeba does",
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
              " Amoeba copies your data while your services run. Then it switches each mount to the pool, with a short restart of the services that use it. If a switch fails, it puts the original mounts back and tries again.",
            ],
            [
              { b: "Growing." },
              " It grows the pool before it fills, and sooner when data arrives fast. It enlarges the pool’s volumes or adds new ones while the pool stays mounted, with no growpart or filesystem step on your side.",
            ],
            [
              { b: "Shrinking." },
              " When your data goes down and stays down, it shrinks the pool one volume at a time. So you pay for close to what you use.",
            ],
            [
              { b: "The old volumes." },
              " Once the switch is checked, Amoeba snapshots each old volume and deletes it. It keeps each snapshot for 7 days, then deletes that too.",
            ],
            [
              { b: "Cost during the move." },
              " You pay for both sets of volumes only while the move runs, then for the snapshots while they’re kept.",
            ],
          ],
        },
        {
          kind: "h3",
          id: "what-an-instance-needs",
          title: "What an instance needs",
        },
        { kind: "p", text: "Amoeba works on Windows and Linux instances." },
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
            "For onboarding and the full AWS setup, see ",
            { a: "EBS cost optimization", href: "/ebs-cost-optimization" },
            ".",
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
      title: "How to shrink an EBS volume",
      where: "Learn",
      href: "/learn/shrink-ebs-volume",
    },
    {
      title: "EBS Elastic Volumes",
      where: "Learn",
      href: "/learn/ebs-elastic-volumes",
    },
    {
      title: "How to check EBS volume usage",
      where: "Learn",
      href: "/learn/check-ebs-volume-usage",
    },
    {
      title: "Amazon EBS volume types",
      where: "Learn",
      href: "/learn/ebs-volume-types",
    },
    {
      title: "Expand an Azure disk without downtime",
      where: "Learn",
      href: "/learn/azure-disk-expand-without-downtime",
    },
  ],
  relatedTitle: "More on resizing volumes",
};
