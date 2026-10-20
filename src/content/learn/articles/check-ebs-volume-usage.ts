import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/check-ebs-volume-usage/1";

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
  published: "2026-10-26",
  updated: "2026-10-26",
  author: "swapnil",
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
      id: "why-ebs-bills-the-size-not-the",
      title: "Why EBS bills the size, not the data",
      blocks: [
        {
          kind: "p",
          text: [
            "The EBS pricing page puts it in one line: volume storage for every EBS volume type “is charged by the amount of GB you provision per month until you release the storage.” A 500\u00a0GiB gp3\u00a0volume holding 50\u00a0GiB is billed for 500. Detaching it doesn’t release the storage: a detached volume waits in the ",
            { code: "available" },
            " state until you delete it.",
          ],
        },
        {
          kind: "p",
          text: [
            "Snapshots are the exception. ",
            { a: "Snapshot storage", href: "/learn/ebs-snapshot-cost" },
            " is based on the space your data takes up in Amazon S3, and EBS “does not save empty blocks.” The volume gets no such treatment.",
          ],
        },
        {
          kind: "p",
          text: [
            "Space on a volume only goes one way. ",
            { a: "Elastic Volumes", href: "/learn/ebs-elastic-volumes" },
            ", AWS’s name for changing a volume in place, can make it larger, change its type or adjust its performance, but its limits are plain: “You must increase the volume size. You can’t decrease the volume size.” An increase made for a migration or a log spike stays on the bill after the data shrinks again, so an EBS cost review starts by measuring used space against provisioned space, one volume at a time.",
          ],
        },
      ],
    },
    {
      id: "ebs-volume-utilization-i-o-or-capacity",
      title: "EBS volume utilization: I/O or capacity",
      blocks: [
        {
          kind: "p",
          text: [
            "How to check EBS volume utilization depends on which kind you mean, because the utilization AWS measures for EBS is I/O. The ",
            { code: "AWS/EBS" },
            " namespace in CloudWatch receives 1-minute metrics at no charge for every attached volume: bytes and operations read and written, queue length, idle time, burst balance on gp2, st1 and sc1, and on Nitro instances average IOPS (input/output operations per second), throughput and latency. None of them reports used or free space, and AWS’s metrics page points you to the operating system for that. The Monitoring tab on a volume in the EC2 console graphs the same I/O metrics.",
          ],
        },
        {
          kind: "p",
          text: [
            "The two measures don’t track each other. ",
            { code: "VolumeIdleTime" },
            " counts the seconds in a period with no reads or writes, so a volume can sit idle while it’s nearly full of cold data, or stay busy all day on a filesystem that’s mostly empty. Only the second one is billed for space it doesn’t use.",
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
          text: "Used space is known only to the filesystem, so the check runs on the instance. It has two halves: read each filesystem’s size and use, then tie each one to the EBS volume behind it, because that volume’s size is the one on the bill.",
        },
        { kind: "h3", id: "on-linux", title: "On Linux" },
        { kind: "code", lang: "bash", code: "df -hT\nlsblk -o +SERIAL" },
        {
          kind: "p",
          text: [
            { code: "df -hT" },
            " lists every mounted filesystem with its type, size, used and available space. It’s the command AWS gives for viewing free disk space on a Linux instance. ",
            { code: "lsblk" },
            " lists the block devices as a tree, with each one’s size and mount point, and its ",
            { code: "SERIAL" },
            " column is the link to AWS. On instances built on the Nitro System, EBS volumes appear as NVMe devices, and AWS sets each device’s serial number to its EBS volume ID. In AWS’s ",
            { code: "nvme id-ctrl" },
            " example the serial reads ",
            { code: "vol01234567890abcdef" },
            ", the volume ID without its hyphen.",
          ],
        },
        {
          kind: "p",
          text: [
            "Don’t key a report on device names. AWS notes that an NVMe name such as ",
            { code: "/dev/nvme1n1" },
            " follows the order devices respond at boot, can change on a later start, and can differ from the name you gave at attach time. On Amazon Linux, ",
            { code: "sudo /sbin/ebsnvme-id /dev/nvme1n1" },
            " prints a device’s volume ID, and other distributions get it from ",
            { code: "sudo nvme id-ctrl -V /dev/nvme1n1" },
            " in the nvme-cli package.",
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
              "A filesystem smaller than its volume. ",
              { a: "Growing an EBS volume", href: "/learn/increase-ebs-volume-size" },
              " is two jobs: Elastic Volumes grows the device, then you grow the partition and the filesystem. The sample output on AWS’s page for extending a filesystem shows the gap. ",
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
              "A volume that isn’t mounted. ",
              { code: "df" },
              " reports mounted filesystems only, so an attached volume with no mount point is missing from its output. ",
              { code: "lsblk" },
              " still lists it with an empty mount point, and AWS still bills its full size.",
            ],
          ],
        },
        { kind: "diagram", figure: figure1 },
        { kind: "h3", id: "on-windows", title: "On Windows" },
        {
          kind: "p",
          text: [
            "AWS’s Windows steps read free space with ",
            { code: "fsutil volume diskfree C:" },
            ", which prints the total and free bytes. ",
            { code: "ebsnvme-id.exe" },
            ", in ",
            { code: "C:\\ProgramData\\Amazon\\Tools" },
            " on the latest AWS Windows Server AMIs, prints each disk number with its volume ID.",
          ],
        },
        { kind: "h3", id: "the-size-aws-bills", title: "The size AWS bills" },
        {
          kind: "p",
          text: "Then read the AWS side. This lists the instance’s volumes with their provisioned sizes in GiB:",
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
          text: "Systems Manager Run Command runs the same two commands on managed nodes, the instances Systems Manager manages, so you don’t sign in to each one. Target a tag to cover a group of instances:",
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
            ", the command runs on up to 50 managed nodes at the same time.",
          ],
        },
      ],
    },
    {
      id: "ebs-disk-usage-in-cloudwatch-with-disk",
      title: "EBS disk usage in CloudWatch with disk_used_percent",
      blocks: [
        {
          kind: "p",
          text: [
            "Run Command tells you where each volume stands today, and a trend needs the CloudWatch agent. The agent reads used space inside the instance and publishes it to CloudWatch in the ",
            { code: "CWAgent" },
            " namespace: on Linux, its ",
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
            " block adds the EBS volume ID to each disk metric, so the mount and the bill share a key. Keeping it means leaving ",
            { code: "drop_device" },
            " at its default of ",
            { code: "false" },
            ", which has a price on Nitro instances: AWS notes that device names there change when the instance reboots, which can leave alarms on these metrics in ",
            { code: "INSUFFICIENT DATA" },
            ". Group your reports by volume ID and path, not by device.",
          ],
        },
        {
          kind: "p",
          text: [
            "The metrics the agent collects are charged, and each mounted filesystem adds its own set, so on an instance with many mounts, list only the data mount points in ",
            { code: "resources" },
            ". To cover many instances, AWS’s page on viewing free disk space points to installing and configuring the agent through Systems Manager.",
          ],
        },
      ],
    },
    {
      id: "compare-used-space-with-what-you-pay",
      title: "Compare used space with what you pay for",
      blocks: [
        {
          kind: "p",
          text: [
            "A usage report for EBS needs one row per volume: the instance, the mount, the volume ID, the provisioned size and the used space. ",
            { code: "df" },
            " or ",
            { code: "disk_used" },
            " gives used space per mount, the ",
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
        { kind: "p", text: "Three cases need care:" },
        {
          kind: "ul",
          items: [
            [
              "One mount on several volumes, such as ",
              { a: "an LVM volume group or a RAID 0 set", href: "/learn/combine-ebs-volumes" },
              ". Add up the provisioned sizes of all the volumes under it before you compare.",
            ],
            [
              "A filesystem never grown after its volume was. ",
              { code: "df" },
              " reports the filesystem’s size, not the volume’s, so always take the provisioned size from ",
              { code: "describe-volumes" },
              ", not from ",
              { code: "df" },
              " or ",
              { code: "disk_total" },
              ".",
            ],
            [
              "Volumes in the ",
              { code: "available" },
              " state. They’re attached to nothing, so no instance can measure them and CloudWatch receives no metrics from them, yet AWS bills their full size. The Volumes page in the EC2 console shows each volume’s state, and you can filter the list on it.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Sort the finished report with the emptiest volumes first. A disk-space alert ranks the fullest first, because they’re the risk, while a cost report ranks the emptiest first, because each is billed for space that holds nothing. EBS can’t take that space back in place. The copy to a smaller volume, and the downtime it needs, is in ",
            { a: "shrinking an EBS volume", href: "/learn/shrink-ebs-volume" },
            ". On Azure the job has the same shape, and ",
            { a: "the Azure VM disk usage guide", href: "/learn/azure-vm-disk-usage" },
            " walks through it.",
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
          text: "Then Amoeba rightsizes. It pools the EBS data volumes of a running EC2 instance onto gp3\u00a0volumes in the instance’s Availability Zone, and never touches the root volume. It sizes the pool from the highest use of the last 7\u00a0days, so the pool sits inside its target band, 80% to 90% full by default, with room for the largest recent 15-minute rise and at least 10\u00a0GiB free. So the gap your report measured, used space against provisioned size, is the gap Amoeba rightsizes. Each mount keeps its path. On Linux, the systemd services that use those mounts restart at the switch onto the pool. After that, expands go in while the pool stays mounted, and shrinks remove one volume at a time.",
        },
        {
          kind: "p",
          text: "Amoeba works on Windows and Linux instances. On AWS, the instance must be running, managed by Systems Manager with its SSM agent connected, and a Nitro type that exposes EBS as NVMe, with at least one EBS data volume and 3 free attachment slots: 2 for the pool and 1 kept free for an urgent expand. On Linux, it needs systemd, kernel 5.14 or later and btrfs loaded or loadable, and every process that keeps a data mount open must run as a systemd service. Instances whose OS is in the Red Hat family aren’t moved.",
        },
        {
          kind: "p",
          text: [
            "The free block storage assessment covers Amazon EBS. ",
            { a: "It estimates your own figure", href: "/assessment?p=amoeba" },
            " for the data volumes of Linux EC2 instances, proposes a gp3 pool, and writes one PDF without sending anything to Zoorik. It runs a command inside an instance only after you say yes, through Systems Manager.",
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
      href: "/amoeba/faq#what-does-the-agent-send-to",
    },
  ],
};
