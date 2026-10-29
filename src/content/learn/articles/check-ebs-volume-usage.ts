import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/check-ebs-volume-usage/1";
import { figure as figure2 } from "@/features/learn/figures/check-ebs-volume-usage/2";
import { figure as figure3 } from "@/features/learn/figures/check-ebs-volume-usage/3";

export const article: Article = {
  slug: "check-ebs-volume-usage",
  title: "How to check EBS volume usage: used vs paid space",
  meta: "Check EBS volume usage from inside the instance with df, lsblk or the CloudWatch agent’s disk_used_percent, then match used space to the size you pay for.",
  h1: "How to check EBS volume usage: used space vs paid space",
  deck: "AWS bills the size you provision, and its EBS metrics measure I/O. How to read the used space and line the two up.",
  card: "EBS bills the size you provision and its metrics measure I/O. Read used space per volume and compare.",
  product: "amoeba",
  hub: "Block storage",
  topic: "AWS block storage",
  published: "2026-10-23",
  updated: "2026-10-23",
  author: "swapnil",
  cover: "/learn-covers/zoorik-learn-check-ebs-volume-usage-1200x630.webp",
  short: [
    "To check EBS volume usage, read it inside the instance. AWS bills each Amazon Elastic Block Store (EBS) volume for the space you provision, and CloudWatch’s built-in EBS metrics report I/O, not how full the filesystem is. Run ",
    { code: "df -hT" },
    " for used space per mount and ",
    { code: "lsblk -o +SERIAL" },
    " to tie each mount to its volume ID on Nitro instances, or collect ",
    { code: "disk_used_percent" },
    " with the CloudWatch agent. Then compare each volume’s used space with the provisioned size you pay for.",
  ],
  sections: [
    {
      id: "ebs-bills-the-size-you-provision-however",
      title: "EBS bills the size you provision, however little data it holds",
      blocks: [
        {
          kind: "p",
          text: "Picture a 500\u00a0GiB gp3\u00a0volume holding 50\u00a0GiB of data: AWS bills it for all 500\u00a0GiB, the same as a full volume of that size.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "The volume is 50 ÷ 500 = 10% full, so the other 500 − 50 = 450\u00a0GiB, 90% of the billed size, holds no data. The gp3 example on the EBS pricing page uses a rate of $0.08 per GB-month. At that rate the volume costs 500 × $0.08 = $40 a month, and 450 × $0.08 = $36 of that pays for space that holds nothing. Rates vary by Region and change.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: [
            "The pricing page’s rule covers every EBS volume type. Volume storage “is charged by the amount of GB you provision per month until you release the storage.” Detaching a volume doesn’t release it. A detached volume waits in the ",
            { code: "available" },
            " state, still billed, until you delete it. ",
            { a: "Snapshot storage", href: "/learn/ebs-snapshot-cost" },
            " is the exception. It’s based on the space your data takes up in Amazon S3, and EBS “does not save empty blocks.”",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Elastic Volumes", href: "/learn/ebs-elastic-volumes" },
            ", AWS’s name for changing a volume in place, can make a volume larger, change its type or adjust its performance, but it can’t shrink one. In AWS’s words, “You can’t decrease the volume size.” An increase made for a migration or a log spike stays on the bill after the data shrinks again, so an EBS cost review starts by measuring used space against provisioned space, one volume at a time.",
          ],
        },
      ],
    },
    {
      id: "ebs-volume-utilization-in-cloudwatch-means-i",
      title: "EBS volume utilization in CloudWatch means I/O",
      blocks: [
        {
          kind: "p",
          text: [
            "How to check EBS volume utilization depends on which kind you mean: how busy a volume is (its I/O) or how full it is (its used space). The Monitoring tab on a volume in the EC2 console and the ",
            { code: "AWS/EBS" },
            " namespace in CloudWatch cover only the first. That namespace receives 1-minute metrics at no charge for every attached volume: bytes and operations read and written, queue length, idle time, burst balance on gp2, st1 and sc1, and on Nitro instances average IOPS (input/output operations per second), throughput and latency. None of them reports used or free space, and AWS’s metrics page points you to the operating system for that.",
          ],
        },
        {
          kind: "p",
          text: [
            "The two measures don’t track each other. ",
            { code: "VolumeIdleTime" },
            " counts the seconds in a period with no reads or writes, so a volume can sit idle while it’s nearly full of cold data, or stay busy all day on a filesystem that’s mostly empty. Only the mostly empty one is billed for space it doesn’t use.",
          ],
        },
      ],
    },
    {
      id: "how-to-check-ebs-volume-usage-on",
      title: "How to check EBS volume usage on Linux and Windows",
      blocks: [
        {
          kind: "p",
          text: "Used space is known only to the filesystem, so the check starts on the instance and ends with the size AWS bills.",
        },
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
          title: "2. Match each filesystem to its volume ID",
        },
        {
          kind: "p",
          text: [
            "On Linux, ",
            { code: "lsblk" },
            " lists the block devices as a tree, with each one’s size and mount point, and its ",
            { code: "SERIAL" },
            " column is the link to AWS. On instances built on the Nitro System, EBS volumes appear as NVMe devices, and AWS sets each device’s serial number to its EBS volume ID.",
          ],
        },
        { kind: "code", lang: "bash", code: "lsblk -o +SERIAL" },
        {
          kind: "p",
          text: [
            "The serial drops the hyphen. AWS’s ",
            { code: "nvme id-ctrl" },
            " example shows it as ",
            { code: "vol01234567890abcdef" },
            ", while ",
            { code: "describe-volumes" },
            " prints IDs in the form ",
            { code: "vol-01234567890abcdef" },
            ", so add the hyphen back before you match. On a partitioned volume the mount sits on a partition row such as ",
            { code: "nvme0n1p1" },
            ", and the serial on the disk row above it.",
          ],
        },
        {
          kind: "p",
          text: [
            "Key your report on that volume ID, because device names move. AWS notes that an NVMe name such as ",
            { code: "/dev/nvme1n1" },
            " follows the order devices respond at boot, can change on a later start, and can differ from the name you gave at attach time.",
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
            " also shows two cases that ",
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
              " is two jobs: Elastic Volumes grows the device, then you grow the partition and the filesystem. AWS’s sample output for extending a filesystem shows the gap. ",
              { code: "lsblk" },
              " lists ",
              { code: "nvme1n1" },
              " at 30G, mounted on ",
              { code: "/data" },
              ", while ",
              { code: "df -hT" },
              " shows the XFS filesystem on it at 8.0G with 33M used. The bill counts 30\u00a0GiB, and ",
              { code: "df" },
              " never sees 22 of them.",
            ],
            [
              { b: "A volume that isn’t mounted." },
              " ",
              { code: "df" },
              " reports mounted filesystems only, so an attached volume with no mount point is missing from its output. ",
              { code: "lsblk" },
              " still lists it with an empty mount point, and AWS still bills its full size.",
            ],
          ],
        },
        { kind: "svg", figure: figure2 },
        { kind: "h3", id: "3-read-the-size-aws-bills", title: "3. Read the size AWS bills" },
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
          text: "Systems Manager Run Command runs the same commands on every instance Systems Manager manages (AWS calls them managed nodes), so you don’t sign in to each one. These are Linux commands, so target a tag on Linux instances:",
        },
        {
          kind: "code",
          lang: "bash",
          code: 'aws ssm send-command \\\n    --document-name "AWS-RunShellScript" \\\n    --targets "Key=tag:<tag-key>,Values=<tag-value>" \\\n    --parameters \'commands=["df -hT","lsblk -o +SERIAL"]\' \\\n    --output-s3-bucket-name "<bucket-name>" \\\n    --comment "EBS usage check"',
        },
        {
          kind: "p",
          text: [
            "Each instance’s output is stored in the S3 bucket you name. Unless you set ",
            { code: "--max-concurrency" },
            ", the command runs on up to 50 managed nodes at the same time. For Windows instances, the send-command reference uses the ",
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
            "Run Command tells you where each volume stands today. A trend needs the CloudWatch agent. It reads used space inside the instance and publishes it to CloudWatch in the ",
            { code: "CWAgent" },
            " namespace, and on Linux its ",
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
            " block adds the EBS volume ID to each disk metric, so the mount and the bill share a key.",
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
            "The metrics the agent collects are charged, and each mount adds its own set, so on an instance with many mounts, list only the data mount points in ",
            { code: "resources" },
            ". To cover many instances, AWS’s page on viewing free disk space points to installing and configuring the agent through Systems Manager.",
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
          text: [
            "A usage report for EBS needs one row per volume: the instance, the mount, the volume ID, the provisioned size, the used space and the unused GiB, which is size minus used space. ",
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
          text: "Sort the report by unused GiB, largest first, not by percent full. Of the two volumes on this page, AWS’s 30\u00a0GiB sample is the emptier by percent, with all but 33\u00a0MiB unused, yet the 500\u00a0GiB example’s 450 unused GiB rank higher. A disk-space alert ranks the fullest volumes first, because they’re the risk. A cost report puts the most unused space first, because within one volume type that’s the order of what the empty space costs.",
        },
        { kind: "p", text: "Then work down the report:" },
        {
          kind: "ul",
          items: [
            [
              { b: [{ code: "available" }, " volumes first."] },
              " They’re billed in full and nothing reads them, but deleting one deletes its data, so confirm nobody needs it first.",
            ],
            [
              { b: "A filesystem smaller than its volume." },
              " If the data needs the room, grow the filesystem. If not, the gap is unused space like the rest.",
            ],
            [
              { b: "A data volume that’s mostly unused space." },
              " EBS can’t take that space back in place, so it takes a copy to a smaller volume, and ",
              { a: "shrinking an EBS volume", href: "/learn/shrink-ebs-volume" },
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
            " by Zoorik optimizes Azure managed disks and Amazon EBS, and keeps the measurement above current on each instance you onboard. Its agent installs through AWS Systems Manager Run Command and reports each mount’s size and use every 15\u00a0seconds, and Amoeba prices the volumes from the AWS Price List API.",
          ],
        },
        {
          kind: "p",
          text: "Then Amoeba rightsizes. It moves the data on a running EC2 instance’s EBS data volumes onto one btrfs pool, built from gp3\u00a0volumes in the instance’s Availability Zone, and never touches the root volume. Pool size comes from the highest use of the last 7\u00a0days, so the pool sits inside its target band, 80% to 90% full by default, with room for the largest recent 15-minute rise and at least 10\u00a0GiB free.",
        },
        {
          kind: "p",
          text: "Each mount keeps its path. On Linux, the systemd services that use those mounts restart at the switch onto the pool. After that, expands go in while the pool stays mounted, and shrinks remove one volume at a time.",
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
              " the instance must be running, managed by Systems Manager with its SSM agent connected, and a Nitro type that exposes EBS as NVMe. It needs at least one EBS data volume and 3 free attachment slots: 2 for the pool and 1 kept free for an urgent expand.",
            ],
            [
              { b: "On Linux:" },
              " it needs systemd, kernel 5.14 or later and btrfs loaded or loadable, and every process that keeps a data mount open must run as a systemd service. Instances whose OS is in the Red Hat family aren’t moved.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "The free block storage assessment covers Amazon EBS. For the data volumes of Linux EC2 instances, ",
            { a: "it estimates your own figure", href: "/assessment?p=amoeba" },
            ", proposes a gp3 pool, and writes one PDF without sending anything to Zoorik. Inside an instance, it runs a command only after you say yes, through Systems Manager.",
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
