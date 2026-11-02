import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/check-ebs-volume-usage/1";
import { figure as figure2 } from "@/features/learn/figures/check-ebs-volume-usage/2";
import { figure as figure3 } from "@/features/learn/figures/check-ebs-volume-usage/3";

export const article: Article = {
  slug: "check-ebs-volume-usage",
  title: "How to check EBS volume usage: used vs paid space",
  meta: "How to check EBS volume usage: AWS/EBS metrics show I/O, not used space. Use df, lsblk or the agent’s disk_used_percent, then compare with the size you pay for.",
  h1: "How to check EBS volume usage: used space vs paid space",
  deck: "Rank volumes by unused GiB, not percent full, since within one volume type more unused GiB costs more.",
  card: "EBS charges for the size you provision and its metrics measure I/O. Read used space per volume and compare.",
  product: "amoeba",
  hub: "Block storage",
  topic: "AWS block storage",
  published: "2026-10-23",
  updated: "2026-11-02",
  author: "swapnil",
  cover: "/learn-covers/zoorik-learn-check-ebs-volume-usage-1200x630.webp",
  coverAlt:
    "Check EBS volume usage: df -hT shows the used part of a volume and the rest, paid for and not used",
  short: [
    "To check EBS volume usage, read used space inside the instance and compare it with the size you pay for. CloudWatch’s built-in metrics for each ",
    { a: "Amazon Elastic Block Store (EBS) volume", href: "/learn/glossary/ebs-volume" },
    " report I/O, not used space. Run ",
    { a: { code: "df -hT" }, href: "/learn/glossary/df-vs-du" },
    " for used space and ",
    { code: "lsblk -o +SERIAL" },
    " for volume IDs on Nitro instances, or collect the CloudWatch agent’s ",
    { code: "disk_used_percent" },
    ".",
  ],
  sections: [
    {
      id: "ebs-charges-for-the-size-you-provision",
      title: "EBS charges for the size you provision, however little data it holds",
      blocks: [
        {
          kind: "p",
          text: [
            "Picture a 500\u00a0GiB ",
            { a: "gp3", href: "/learn/glossary/ebs-gp3" },
            " volume holding 50\u00a0GiB of data. AWS charges for all 500\u00a0GiB, the same as for a full volume of that size. Our ",
            { a: "EBS pricing calculator", href: "/ebs-and-azure-disk-pricing" },
            " shows a volume’s monthly list price and what its empty space costs.",
          ],
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "At 10% full, 450\u00a0GiB of the 500\u00a0GiB you pay for holds no data. The gp3 example on the Amazon EBS pricing page uses $0.08 per GB-month, and rates vary by Region and change. At that rate the volume costs $40 a month, and $36 of it pays for the empty 450\u00a0GiB.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: [
            "On every EBS volume type, storage “is charged by the amount of GB you provision per month until you release the storage.” A detached volume waits in the ",
            { code: "available" },
            " state, still charged, until you delete it.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Snapshot storage", href: "/learn/ebs-snapshot-cost" },
            " is the exception: it’s based on the space your data takes up in Amazon S3, and EBS “does not save empty blocks.”",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Elastic Volumes", href: "/learn/ebs-elastic-volumes" },
            ", AWS’s name for changing a volume in place, can grow a volume or change its type and performance. But in AWS’s words, “You can’t decrease the volume size.”",
          ],
        },
        {
          kind: "p",
          text: "An increase made for a migration or a log spike stays charged after the data shrinks. So an EBS cost review measures used space against provisioned space, volume by volume.",
        },
      ],
    },
    {
      id: "ebs-volume-utilization-in-cloudwatch-means-i",
      title: "EBS metrics in CloudWatch measure I/O, not used space",
      blocks: [
        {
          kind: "p",
          text: [
            "How to check EBS volume utilization depends on which kind you mean: how busy a volume is (its I/O) or how full it is (its used space). The Monitoring tab on a volume in the EC2 console and the ",
            { code: "AWS/EBS" },
            " namespace in CloudWatch cover only the first.",
          ],
        },
        {
          kind: "p",
          text: "That namespace receives 1-minute metrics at no charge for every attached volume:",
        },
        {
          kind: "ul",
          items: [
            "Bytes and operations read and written.",
            "Queue length and idle time.",
            "Burst balance, on gp2, st1 and sc1.",
            [
              "On Nitro instances, average ",
              { a: "IOPS", href: "/learn/glossary/iops" },
              " (input/output operations per second), ",
              { a: "throughput", href: "/learn/glossary/disk-throughput" },
              " and ",
              { a: "latency", href: "/learn/glossary/disk-latency" },
              ".",
            ],
          ],
        },
        {
          kind: "p",
          text: "None of them reports used or free space, and AWS’s metrics page points you to the operating system for that.",
        },
        {
          kind: "p",
          text: [
            "The two measures don’t track each other. ",
            { code: "VolumeIdleTime" },
            " counts the seconds with no reads or writes. So a volume nearly full of cold data can sit idle, while a mostly empty one stays busy all day.",
          ],
        },
        { kind: "p", text: "Only the mostly empty one is charged for space it doesn’t use." },
      ],
    },
    {
      id: "how-to-check-ebs-volume-usage-on",
      title: "How to check EBS volume usage on Linux and Windows",
      blocks: [
        {
          kind: "h3",
          id: "1-read-each-filesystems-size-and-use",
          title: "1. Read each filesystem’s size and use",
        },
        {
          kind: "p",
          text: [
            "On Linux, ",
            { code: "df -hT" },
            " lists every mounted filesystem with its type, size, used and available space. It’s the command AWS’s docs give for viewing free disk space.",
          ],
        },
        { kind: "code", lang: "bash", code: "df -hT" },
        {
          kind: "p",
          text: [
            "On Windows, AWS’s steps read free space with ",
            { code: "fsutil volume diskfree C:" },
            ", which prints the total and free bytes.",
          ],
        },
        {
          kind: "h3",
          id: "2-match-each-filesystem-to-its-volume",
          title: "2. Match each NVMe device to its EBS volume ID",
        },
        {
          kind: "p",
          text: [
            "On instances built on the Nitro System, EBS volumes appear as NVMe devices, and AWS sets each device’s serial number to its EBS volume ID. So on Linux, ",
            { code: "lsblk -o +SERIAL" },
            " ties each device and its mount point to AWS.",
          ],
        },
        { kind: "code", lang: "bash", code: "lsblk -o +SERIAL" },
        {
          kind: "p",
          text: [
            "The serial drops the hyphen, ",
            { code: "vol01234567890abcdef" },
            " against ",
            { code: "vol-01234567890abcdef" },
            " in ",
            { code: "describe-volumes" },
            ", so add it back before you match. On a partitioned volume, the mount sits on a partition row such as ",
            { code: "nvme0n1p1" },
            ", and the serial on the disk row above it.",
          ],
        },
        {
          kind: "p",
          text: [
            "Key your report on the volume ID, because device names move. AWS notes that an NVMe name such as ",
            { code: "/dev/nvme1n1" },
            " follows the order devices respond at boot, and can change on a later start.",
          ],
        },
        {
          kind: "callout",
          label: "For engineers",
          text: [
            "On Amazon Linux, ",
            { code: "sudo /sbin/ebsnvme-id /dev/nvme1n1" },
            " prints one device’s volume ID, and other distributions get it from ",
            { code: "sudo nvme id-ctrl -V /dev/nvme1n1" },
            " in the nvme-cli package.",
          ],
        },
        {
          kind: "p",
          text: [
            "On Windows, ",
            { code: "ebsnvme-id.exe" },
            ", in ",
            { code: "C:\\ProgramData\\Amazon\\Tools" },
            " on the latest AWS Windows Server AMIs, prints each disk number with its volume ID.",
          ],
        },
        {
          kind: "p",
          text: [
            "Reading ",
            { code: "df" },
            " next to ",
            { code: "lsblk" },
            " shows two cases that ",
            { code: "df" },
            " alone hides:",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "A filesystem smaller than its volume." },
              " ",
              { a: "Growing an EBS volume", href: "/learn/increase-ebs-volume-size" },
              " is two jobs: Elastic Volumes grows the device, then you grow the partition and the filesystem. In AWS’s sample output, ",
              { code: "lsblk" },
              " lists ",
              { code: "nvme1n1" },
              " at 30G, while ",
              { code: "df -hT" },
              " shows the XFS filesystem on it at 8.0G. AWS charges for 30\u00a0GiB, and ",
              { code: "df" },
              " never sees 22 of them.",
            ],
            [
              { b: "A volume that isn’t mounted." },
              " ",
              { code: "df" },
              " reports mounted filesystems only, so an attached volume with no mount point is missing from its output. ",
              { code: "lsblk" },
              " still lists it with an empty mount point, and AWS still charges for its full size.",
            ],
          ],
        },
        { kind: "svg", figure: figure2 },
        { kind: "h3", id: "3-read-the-size-you-pay-for", title: "3. Read the size you pay for" },
        {
          kind: "p",
          text: "This lists the instance’s volumes with their provisioned sizes in GiB:",
        },
        {
          kind: "code",
          lang: "bash",
          code: 'aws ec2 describe-volumes \\\n    --filters "Name=attachment.instance-id,Values=<instance-id>" \\\n    --query "Volumes[*].[VolumeId,Size,VolumeType]" \\\n    --output text',
        },
        {
          kind: "p",
          text: [
            "The ",
            { code: "G" },
            " in ",
            { code: "df -h" },
            " and ",
            { code: "lsblk" },
            " output is the same GiB as the ",
            { code: "Size" },
            " field, which is how AWS’s resize steps compare them. For the bytes that ",
            { code: "fsutil" },
            " prints, divide by 1,073,741,824 (1024³) to get GiB.",
          ],
        },
      ],
    },
    {
      id: "how-to-check-ebs-volume-usage-in",
      title: "How to check EBS volume usage in AWS without signing in to each instance",
      blocks: [
        {
          kind: "p",
          text: "Systems Manager Run Command runs the same commands on every managed node (an instance Systems Manager manages), so you don’t sign in to each one. These are Linux commands, so target a tag on Linux instances:",
        },
        {
          kind: "code",
          lang: "bash",
          code: 'aws ssm send-command \\\n    --document-name "AWS-RunShellScript" \\\n    --targets "Key=tag:<tag-key>,Values=<tag-value>" \\\n    --parameters \'commands=["df -hT","lsblk -o +SERIAL"]\' \\\n    --output-s3-bucket-name "<bucket-name>" \\\n    --comment "EBS usage check"',
        },
        {
          kind: "p",
          text: [
            "Each instance’s output lands in the S3 bucket you name. Unless you set ",
            { code: "--max-concurrency" },
            ", the command runs on up to 50 managed nodes at once. Windows instances use the ",
            { code: "AWS-RunPowerShellScript" },
            " document instead, which can run ",
            { code: "fsutil" },
            " and ",
            { code: "ebsnvme-id.exe" },
            ".",
          ],
        },
      ],
    },
    {
      id: "track-ebs-disk-usage-in-cloudwatch-with",
      title: "Track EBS disk usage in CloudWatch with disk_used_percent",
      blocks: [
        {
          kind: "p",
          text: [
            "Run Command shows where each volume stands today. A trend needs the CloudWatch agent, which reads used space inside the instance and publishes it to CloudWatch in the ",
            { code: "CWAgent" },
            " namespace.",
          ],
        },
        {
          kind: "p",
          text: [
            "On Linux, its ",
            { code: "disk" },
            " section collects ",
            { code: "disk_used" },
            ", ",
            { code: "disk_total" },
            " and ",
            { code: "disk_used_percent" },
            ", among others, for each mounted filesystem, every 60\u00a0seconds by default.",
          ],
        },
        {
          kind: "code",
          lang: "json",
          code: '{\n  "metrics": {\n    "append_dimensions": {\n      "InstanceId": "${aws:InstanceId}"\n    },\n    "metrics_collected": {\n      "disk": {\n        "measurement": ["used", "total", "used_percent"],\n        "resources": ["*"],\n        "append_dimensions": {\n          "VolumeId": "${aws:VolumeId}"\n        }\n      }\n    }\n  }\n}',
        },
        {
          kind: "p",
          text: [
            "Inside ",
            { code: "disk" },
            ", the ",
            { code: "append_dimensions" },
            " block adds the EBS volume ID to each disk metric, so the mount and the provisioned size share a key.",
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            "Keeping the ",
            { code: "VolumeId" },
            " dimension means leaving ",
            { code: "drop_device" },
            " at its default, ",
            { code: "false" },
            ". On Nitro instances, AWS notes, device names change when the instance reboots, which can leave alarms on these metrics in ",
            { code: "INSUFFICIENT DATA" },
            ". Group your reports by volume ID and path, never by device.",
          ],
        },
        {
          kind: "p",
          text: [
            "The agent’s metrics are charged, and each mount adds its own set, so list only the data mount points in ",
            { code: "resources" },
            ". To cover many instances, AWS points to installing and configuring the agent through Systems Manager.",
          ],
        },
      ],
    },
    {
      id: "compare-used-space-with-the-size-you",
      title: "Compare used space with the size you pay for, and rank by unused GiB",
      blocks: [
        {
          kind: "p",
          text: "An EBS usage report needs one row per volume: instance, mount, volume ID, provisioned size, used space, and unused GiB (size minus used space).",
        },
        {
          kind: "p",
          text: [
            { code: "df" },
            " or ",
            { code: "disk_used" },
            " gives used space per mount. The ",
            { code: "SERIAL" },
            " column or the ",
            { code: "VolumeId" },
            " dimension ties the mount to a volume, and ",
            { code: "describe-volumes" },
            " gives that volume’s ",
            { code: "Size" },
            ".",
          ],
        },
        { kind: "svg", figure: figure3 },
        { kind: "p", text: "Four cases need care:" },
        {
          kind: "ul",
          items: [
            [
              { b: "One mount on several volumes," },
              " such as ",
              { a: "an LVM volume group or a RAID 0 set", href: "/learn/combine-ebs-volumes" },
              ", needs the provisioned sizes of all the volumes under it added up before you compare.",
            ],
            [
              { b: "One volume under several mounts," },
              " such as two partitions. Add up their used space.",
            ],
            [
              { b: "A filesystem never grown after its volume was." },
              " ",
              { code: "df" },
              " and ",
              { code: "disk_total" },
              " report the filesystem’s size, so always take the provisioned size from ",
              { code: "describe-volumes" },
              ".",
            ],
            [
              { b: ["Volumes in the ", { code: "available" }, " state."] },
              " They’re attached to nothing, so no instance can measure them and CloudWatch receives no metrics from them. Give each a row with no used space. This command lists them:",
            ],
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "aws ec2 describe-volumes \\\n    --query \"Volumes[?State=='available'].[VolumeId,Size,VolumeType]\" \\\n    --output text",
        },
        {
          kind: "p",
          text: "Of this page’s two volumes, AWS’s 30\u00a0GiB sample is the emptier by percent, yet the 500\u00a0GiB example’s 450 unused GiB rank higher.",
        },
        {
          kind: "p",
          text: "A disk-space alert ranks the fullest volumes first, because they’re the risk. A cost report puts the most unused space first.",
        },
        { kind: "p", text: "Then work down the report:" },
        {
          kind: "ol",
          items: [
            [
              { b: [{ code: "available" }, " volumes first."] },
              " They’re charged in full and nothing reads them. Deleting one deletes its data, so delete it only once nobody needs it.",
            ],
            [
              { b: "A filesystem smaller than its volume." },
              " If the data needs the room, grow the filesystem. If not, the gap is unused space like the rest.",
            ],
            [
              { b: "A data volume that’s mostly unused space." },
              " EBS can’t take that space back in place, so copy the data to a smaller volume. ",
              { a: "Shrinking an EBS volume", href: "/learn/shrink-ebs-volume" },
              " covers that copy and the downtime it needs.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "For the same job on Azure, see ",
            { a: "the Azure VM disk usage guide", href: "/learn/azure-vm-disk-usage" },
            ".",
          ],
        },
      ],
    },
    {
      id: "how-amoeba-measures-and-rightsizes-ebs-volumes",
      title: "How Amoeba measures and rightsizes EBS volumes",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " optimizes block storage: Azure managed disks and Amazon EBS. On each instance you onboard, its agent installs through AWS Systems Manager Run Command and reports each mount’s size and use.",
          ],
        },
        {
          kind: "p",
          text: "It moves a running EC2 instance’s EBS data volumes onto one btrfs pool of gp3\u00a0volumes, sized to your data with room to grow. It never touches the root volume.",
        },
        {
          kind: "p",
          text: "The move copies your data while your services run. Then each mount switches to the pool and keeps its path, with a short restart of the services that use it.",
        },
        {
          kind: "p",
          text: "Then Amoeba rightsizes. It grows the pool before it fills, and shrinks it one volume at a time when your data goes down and stays down.",
        },
        {
          kind: "p",
          text: "Amoeba works on Windows and Linux instances, with these requirements:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "On AWS:" },
              " the instance must be running, managed by Systems Manager with its SSM agent connected, and a Nitro type that exposes EBS as NVMe. It needs at least one EBS data volume and a few free attachment slots for the pool.",
            ],
            [
              { b: "On Linux:" },
              " it needs a recent kernel with btrfs, and every service that keeps a data mount open must run under systemd.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            { a: "EBS cost optimization", href: "/ebs-cost-optimization" },
            " covers what Amoeba does on AWS.",
          ],
        },
      ],
    },
  ],
  help: {
    product: "amoeba",
    text: "Amoeba moves an EC2 instance’s EBS data volumes onto one pool sized to your data, then rightsizes it autonomously, without any downtime after the one switch, one volume at a time. We estimate it takes 50–60% off block storage cost. It is an estimated range, not a promise. The free assessment works out your own figure.",
    links: [
      { label: "Block storage cost optimization with Amoeba", href: "/amoeba" },
      { label: "Estimate your saving", href: "/assessment?p=amoeba" },
    ],
  },
  sources: [
    { publisher: "AWS", title: "“Amazon EBS pricing”", url: "https://aws.amazon.com/ebs/pricing/" },
    {
      publisher: "AWS",
      title: "“Amazon CloudWatch metrics for Amazon EBS”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/using_cloudwatch_ebs.html",
    },
    {
      publisher: "AWS",
      title: "“View information about an Amazon EBS volume”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-describing-volumes.html",
    },
    {
      publisher: "AWS",
      title: "“Modify an Amazon EBS volume using Elastic Volumes operations”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-modify-volume.html",
    },
    {
      publisher: "AWS",
      title: "“Map Amazon EBS volumes to NVMe device names”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/identify-nvme-ebs-device.html",
    },
    {
      publisher: "AWS",
      title: "“Extend the file system after resizing an Amazon EBS volume”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/recognize-expanded-volume-linux.html",
    },
    {
      publisher: "AWS CLI Command Reference",
      title: "“send-command”",
      url: "https://docs.aws.amazon.com/cli/latest/reference/ssm/send-command.html",
    },
    {
      publisher: "AWS",
      title: "“Manually create or edit the CloudWatch agent configuration file”",
      url: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-Configuration-File-Details.html",
    },
  ],
  related: [
    {
      title: "How to shrink an EBS volume when AWS only lets it grow",
      where: "Learn",
      href: "/learn/shrink-ebs-volume",
    },
    {
      title: "Azure VM disk usage: how to check used vs provisioned space",
      where: "Learn",
      href: "/learn/azure-vm-disk-usage",
    },
    {
      title: "What AWS Compute Optimizer recommends for EBS volumes",
      where: "Learn",
      href: "/learn/compute-optimizer-ebs",
    },
    {
      title: "What does the agent send to Zoorik?",
      where: "Amoeba FAQ",
      href: "/amoeba-faq#what-does-the-agent-send-to",
    },
  ],
};
