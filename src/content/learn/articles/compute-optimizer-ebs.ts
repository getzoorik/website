import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/compute-optimizer-ebs/1";

export const article: Article = {
  slug: "compute-optimizer-ebs",
  title: "AWS Compute Optimizer for EBS: what it recommends",
  meta: "Compute Optimizer EBS recommendations read 14 days of I/O metrics, not used space. See what each finding covers and how Trusted Advisor’s checks compare.",
  h1: "What AWS Compute Optimizer recommends for EBS volumes",
  deck: "Type, size, IOPS and throughput from 14\u00a0days of I/O metrics, how Trusted Advisor differs, and what you apply yourself.",
  card: "What Compute Optimizer recommends for EBS volumes, the metrics behind it, and how Trusted Advisor differs.",
  product: "amoeba",
  hub: "Block storage",
  topic: "AWS block storage",
  published: "2026-11-16",
  updated: "2026-11-16",
  author: "sonu",
  short:
    "AWS Compute Optimizer EBS recommendations give each Amazon Elastic Block Store (EBS) volume a finding, Optimized or Not optimized, and up to three options for its type, size, input/output operations per second (IOPS) and throughput. Built from 14\u00a0days of CloudWatch I/O metrics by default, they judge the I/O a volume served, not the data it holds. Compute Optimizer is free. Its Automation can snapshot and delete long-unattached volumes and upgrade old types, but you apply a new size yourself.",
  sections: [
    {
      id: "what-compute-optimizer-ebs-recommendations-cover",
      title: "What Compute Optimizer EBS recommendations cover",
      blocks: [
        {
          kind: "p",
          text: "Compute Optimizer is an AWS service that reads the specifications and utilization metrics of your resources and recommends changes. For EBS, it covers the General Purpose SSD types gp2 and gp3, the Provisioned IOPS SSD types io1, io2 and io2 Block Express, and the HDD types st1 and sc1. It also recommends moving data off previous-generation magnetic volumes.",
        },
        {
          kind: "p",
          text: "Each volume gets one of two findings. Not optimized means Compute Optimizer has found a volume type, size or IOPS setting that “can provide better performance or cost for your workload.” Optimized means the volume is correctly provisioned for its workload, though Compute Optimizer might still suggest a newer-generation volume type.",
        },
        {
          kind: "p",
          text: "On the Compute Optimizer EBS volumes recommendations page, each volume’s top option sits next to its current type and price. A volume’s details page lists up to three options, each with its monthly price and a performance risk that runs from very low to very high. That risk is the likelihood that the option won’t meet your workload’s requirements, and the higher it is, the more AWS advises you to check the option against your workload before you migrate.",
        },
        {
          kind: "p",
          text: "Recommendations refresh daily and use the last 14\u00a0days of metrics by default, a window AWS calls the lookback period, which you can extend to 32\u00a0days at no charge. A volume needs at least 30 consecutive hours of metrics before it gets a recommendation, and new ones can take up to 24\u00a0hours to appear. Within the lookback period, Compute Optimizer uses the maximum utilization point in each five-minute interval, not the average.",
        },
        {
          kind: "p",
          text: "Each option also carries an estimated monthly saving and a savings opportunity percentage. Without the savings estimation mode preference, both use On-Demand prices. With AWS Cost Optimization Hub enabled, Compute Optimizer uses that data instead, which includes your specific pricing discounts.",
        },
      ],
    },
    {
      id: "what-the-recommendations-are-based-on",
      title: "What the recommendations are based on",
      blocks: [
        {
          kind: "p",
          text: "Compute Optimizer reads six CloudWatch metrics for each volume. Four of them count traffic: VolumeReadOps and VolumeWriteOps for operations, VolumeReadBytes and VolumeWriteBytes for bytes. The other two, VolumeIOPSExceededCheck and VolumeThroughputExceededCheck, report 1 when an application consistently tried to drive more IOPS or throughput than the volume is provisioned for in the last minute. Those two work only on volumes attached to Nitro instances, and not on magnetic volumes.",
        },
        {
          kind: "p",
          text: "None of the six measures how much of the volume your filesystem uses, a figure that only the filesystem inside the instance knows.",
        },
        {
          kind: "p",
          text: "A recommendation tells you whether a volume’s type, size and performance suit the reads and writes it served over the lookback period. It can’t tell you whether your data would fit in a smaller volume. To these metrics, a 1,000\u00a0GiB volume holding 90\u00a0GiB and one holding 900\u00a0GiB look the same if they serve the same traffic.",
        },
        {
          kind: "p",
          text: [
            "The Compute Optimizer guide says the recommendations page “can help you to decide if you should up-size or down-size your volume.” Before you act on a smaller size, measure the used space mount by mount inside the instance, with the steps in ",
            { a: "checking how full each volume is", href: "/learn/check-ebs-volume-usage" },
            ".",
          ],
        },
        { kind: "diagram", figure: figure1 },
      ],
    },
    {
      id: "idle-and-unattached-ebs-volumes",
      title: "Idle and unattached EBS volumes",
      blocks: [
        {
          kind: "p",
          text: "Compute Optimizer also lists idle resources, EBS volumes among them, with two findings of their own. A volume is idle when its read and write operations add up to less than 1 per day over the lookback period, and it isn’t a root volume. A volume is unattached when it wasn’t attached to any EC2 instance over a 32-day lookback, and changing the lookback period doesn’t change those 32\u00a0days.",
        },
        {
          kind: "p",
          text: [
            "For both findings the recommended action is the same. Check whether you need the volume, and if you don’t, create a snapshot of it and consider deleting it. For a volume unattached for at least 32\u00a0days, Compute Optimizer’s Automation feature can do this for you: it takes the snapshot, deletes the volume, and if you roll the action back, restores the data from that snapshot to a new volume with a new volume ID. An idle volume may still be attached to an instance that expects it, so check its mount and whatever uses it before you remove it, and keep the snapshot until you’re sure. The page on ",
            { a: "what EBS snapshots cost", href: "/learn/ebs-snapshot-cost" },
            " covers what that snapshot bills while you wait.",
          ],
        },
      ],
    },
    {
      id: "how-trusted-advisors-ebs-checks-differ",
      title: "How Trusted Advisor’s EBS checks differ",
      blocks: [
        {
          kind: "p",
          text: "AWS Trusted Advisor inspects your account and flags the resources that match its checks. Three of its cost optimization checks cover EBS, each with its own data.",
        },
        {
          kind: "table",
          columns: [
            { label: "Check", width: "21%" },
            { label: "Data it uses", width: "15%" },
            { label: "Flags a volume when", width: "42%" },
            { label: "Recommended action", width: "22%" },
          ],
          rows: [
            [
              "Underutilized Amazon EBS volumes",
              "Trusted Advisor’s own volume check",
              "It’s unattached, or had less than 1\u00a0IOPS per day for the past 7\u00a0days, boot volumes excluded",
              "Consider a snapshot, then deleting the volume",
            ],
            [
              "Amazon EBS over-provisioned volumes (legacy)",
              "Compute Optimizer, once you opt in",
              "It was over-provisioned during the lookback period, judged on all default CloudWatch metrics, IOPS and throughput included",
              "Consider downsizing volumes that have low utilization",
            ],
            [
              "Amazon EBS cost optimization recommendations for volumes",
              "AWS Cost Optimization Hub",
              "A cost savings action has been identified for it",
              "Consider implementing the recommendation",
            ],
          ],
        },
        {
          kind: "p",
          text: "The underutilized check sits closest to Compute Optimizer’s idle finding, with a 7-day window against a 14-day default. Trusted Advisor’s own notes move you on from it. With Compute Optimizer opted in, AWS recommends the over-provisioned check instead, and that check is now marked legacy, with Amazon EBS cost optimization recommendations for volumes named as its replacement. The newest check shows only the top recommended action for each volume, needs you to opt in to both Cost Optimization Hub and Compute Optimizer, and points you to Compute Optimizer for the detail on cost and performance.",
        },
        {
          kind: "p",
          text: "Access is the other difference. Trusted Advisor checks are available with an AWS Business Support+, AWS Enterprise Support or AWS Unified Operations plan. On Basic Support, the console gives you the Service Limits checks and selected Security and Fault tolerance checks, so the three checks above aren’t included.",
        },
      ],
    },
    {
      id: "is-aws-compute-optimizer-free",
      title: "Is AWS Compute Optimizer free?",
      blocks: [
        {
          kind: "p",
          text: "Yes. The pricing page says “There is no additional charge for AWS Compute Optimizer,” and its recommendations from the last 14 or 32\u00a0days of CloudWatch metrics are free. You pay for the AWS resources you run and for CloudWatch monitoring fees.",
        },
        {
          kind: "p",
          text: "The paid option is enhanced infrastructure metrics. It’s billed per resource-hour and extends the analysis to up to three months for EC2 instances, EC2 Auto Scaling groups and Amazon RDS. EBS volumes aren’t on that list. Their recommendations stay on the free 14-day or 32-day lookback. Before any of it, you opt in to Compute Optimizer.",
        },
      ],
    },
    {
      id: "what-compute-optimizer-applies-and-what-you",
      title: "What Compute Optimizer applies, and what you apply yourself",
      blocks: [
        {
          kind: "p",
          text: "Compute Optimizer’s Automation feature, which you opt in to on its own, applies two kinds of EBS action. One snapshots and deletes volumes that have been unattached for at least 32\u00a0days. The other upgrades a volume to a newer-generation type, such as io1 to io2. You can apply each action from the Recommended actions page, or create automation rules that apply matching actions on a recurring schedule, and you can roll an action back from the Automation events page.",
        },
        {
          kind: "p",
          text: "The rest stops at the recommendation. A new size, IOPS or throughput is yours to request: Compute Optimizer’s guidance on performance risk points you to the EBS steps for requesting a volume modification, and each Trusted Advisor action in the table begins with “Consider”.",
        },
        {
          kind: "p",
          text: [
            "A new type, or a change of IOPS or throughput, applies in place. Elastic Volumes, AWS’s name for changing a volume in place, can increase the size, change the type or adjust the performance without detaching the volume or restarting the instance, on an instance that supports it. You can modify one volume up to four times in a rolling 24-hour period, each change after the last has completed. If you ",
            { a: "change gp2 to gp3", href: "/learn/gp2-vs-gp3" },
            " without naming IOPS or throughput, EBS provisions the gp2\u00a0volume’s equivalent performance or the gp3 baseline, whichever is higher. The ",
            { a: "Elastic Volumes page", href: "/learn/ebs-elastic-volumes" },
            " covers the commands and the limits.",
          ],
        },
        {
          kind: "p",
          text: [
            "A larger size applies in place too, and then you extend the filesystem to use the new space, as ",
            { a: "growing an EBS volume", href: "/learn/increase-ebs-volume-size" },
            " shows step by step.",
          ],
        },
        {
          kind: "p",
          text: [
            "A smaller size can’t be applied in place. The Elastic Volumes limits say it plainly: “You can’t decrease the volume size.” AWS’s alternative is to create a smaller volume and migrate the data to it with an application-level tool such as rsync. That copy route, and the service stop it needs, are in ",
            { a: "how to shrink an EBS volume", href: "/learn/shrink-ebs-volume" },
            ".",
          ],
        },
      ],
    },
    {
      id: "how-amoeba-rightsizes-from-used-space",
      title: "How Amoeba rightsizes from used space",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " optimizes Azure managed disks and Amazon EBS, and it starts from the figure Compute Optimizer doesn’t read. Its agent installs on each instance you onboard through AWS Systems Manager Run Command and reports each mount’s size and use every 15\u00a0seconds. Used space sets the size of the pool, and the instance’s measured disk load sets its performance.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "The pool." },
              " Amoeba pools the EBS data volumes of a running EC2 instance onto gp3\u00a0volumes in the instance’s Availability Zone, and never touches the root volume. It sizes the pool from the highest use of the last 7\u00a0days, with room for the largest recent 15-minute rise and at least 10\u00a0GiB free. Each gp3\u00a0volume gets at least 3,000\u00a0IOPS and 125\u00a0MiB/s, and more when the load needs it: Amoeba sizes for 1.3 times the measured p99, within the instance’s EBS limits. Each data mount keeps its path.",
            ],
            [
              { b: "The one switch." },
              " The agent copies each data mount onto the pool with rsync while services run. At the switch on Linux, the systemd services that use the data mounts restart, and the pool is mounted at the same paths. That restart is the service interruption.",
            ],
            [
              { b: "After the switch." },
              " Amoeba holds the pool inside a target band, 80% to 90% full by default, and decides on every 15-second report. As data grows, it grows gp3\u00a0volumes in place, then adds new ones, while the pool stays mounted. Once the move is done and a full 7\u00a0days of data are in, shrinks move one volume’s data onto the others, then detach and delete that volume, which stops its billing. A volume leaves the pool only when it’s empty.",
            ],
            [
              { b: "Your control." },
              " You choose whether shrinks start on their own (“Auto”) or wait for you (“Manual”). Expands run on their own, and a move paused after the switch still allows the urgent expand.",
            ],
          ],
        },
        {
          kind: "p",
          text: "Where Compute Optimizer leaves size changes to you, Amoeba makes them on the pool after the one switch, and keeps making them as the data grows and shrinks. Amoeba works on Windows and Linux instances. On AWS, an instance must be running, managed by Systems Manager, a Nitro type that exposes EBS as NVMe, and attached to at least one EBS data volume. It also needs 3 free attachment slots: 2 for the pool’s first volumes and 1 that Amoeba keeps free for an urgent expand.",
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
      publisher: "AWS Compute Optimizer User Guide",
      title: "“Viewing Amazon EBS volume recommendations”",
      url: "https://docs.aws.amazon.com/compute-optimizer/latest/ug/view-ebs-recommendations.html",
    },
    {
      publisher: "AWS Compute Optimizer User Guide",
      title: "“EBS volume metrics”",
      url: "https://docs.aws.amazon.com/compute-optimizer/latest/ug/ebs-metrics-analyzed.html",
    },
    {
      publisher: "AWS",
      title: "“AWS Compute Optimizer FAQs”",
      url: "https://aws.amazon.com/compute-optimizer/faqs/",
    },
    {
      publisher: "AWS Compute Optimizer User Guide",
      title: "“Viewing idle resource recommendations”",
      url: "https://docs.aws.amazon.com/compute-optimizer/latest/ug/view-idle-recommendations.html",
    },
    {
      publisher: "AWS Support User Guide",
      title: "“Cost optimization”",
      url: "https://docs.aws.amazon.com/awssupport/latest/user/cost-optimization-checks.html",
      note: " (Trusted Advisor checks)",
    },
    {
      publisher: "AWS Support User Guide",
      title: "“AWS Trusted Advisor”",
      url: "https://docs.aws.amazon.com/awssupport/latest/user/trusted-advisor.html",
    },
    {
      publisher: "AWS",
      title: "“AWS Compute Optimizer pricing”",
      url: "https://aws.amazon.com/compute-optimizer/pricing/",
    },
    {
      publisher: "AWS",
      title: "“Modify an Amazon EBS volume using Elastic Volumes operations”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-modify-volume.html",
    },
  ],
  related: [
    {
      title: "How to check EBS volume usage: used space vs paid space",
      where: "Learn",
      href: "/learn/check-ebs-volume-usage",
    },
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
  ],
};
