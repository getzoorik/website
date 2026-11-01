import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/compute-optimizer-ebs/1";
import { figure as figure2 } from "@/features/learn/figures/compute-optimizer-ebs/2";
import { figure as figure3 } from "@/features/learn/figures/compute-optimizer-ebs/3";

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
  published: "2026-11-01",
  updated: "2026-11-01",
  author: "sonu",
  cover: "/learn-covers/zoorik-learn-compute-optimizer-ebs-1200x630.webp",
  coverAlt:
    "Compute Optimizer for EBS: it reads I/O to suggest type, size and IOPS, but used space is not seen",
  short:
    "AWS Compute Optimizer EBS recommendations give each EBS volume a finding and up to three options for its type, size, IOPS and throughput. They read 14\u00a0days of CloudWatch I/O metrics by default, which show the I/O a volume served but not the data it holds.",
  sections: [
    {
      id: "compute-optimizer-ebs",
      title: "Compute Optimizer EBS recommendations give a finding and up to three options",
      blocks: [
        {
          kind: "p",
          text: "Picture a 1,000\u00a0GiB data volume that holds 90\u00a0GiB. Compute Optimizer judges the volume on the reads and writes it served. So nothing in its recommendation shows that the volume is mostly empty.",
        },
        {
          kind: "p",
          text: [
            "Compute Optimizer is an AWS service that reads the specifications and utilization metrics of your resources, then recommends changes. For Amazon Elastic Block Store (EBS), it recommends a volume type, size, ",
            { a: "input/output operations per second (IOPS)", href: "/learn/glossary/iops" },
            " and ",
            { a: "throughput", href: "/learn/glossary/disk-throughput" },
            ". It covers these volume types:",
          ],
        },
        {
          kind: "ul",
          items: [
            "the General Purpose SSD types gp2 and gp3;",
            "the Provisioned IOPS SSD types io1, io2 and io2 Block Express;",
            "the HDD types st1 and sc1.",
          ],
        },
        {
          kind: "p",
          text: "It also recommends moving data off previous-generation magnetic volumes.",
        },
        {
          kind: "h3",
          id: "what-each-recommendation-gives-you",
          title: "What each recommendation gives you",
        },
        { kind: "p", text: "Each recommendation has four parts:" },
        {
          kind: "ul",
          items: [
            [
              { b: "A finding." },
              " Not optimized means Compute Optimizer has found a volume type, size or IOPS setting that “can provide better performance or cost” for your workload. Optimized means the volume is correctly provisioned for its workload. Even then, Compute Optimizer might suggest a newer-generation volume type.",
            ],
            [
              { b: "Up to three options." },
              " The Compute Optimizer EBS volumes recommendations page shows each volume’s top option next to its current type and price. The volume’s details page lists every option with its monthly price.",
            ],
            [
              { b: "A performance risk for each option." },
              " It runs from very low to very high, and it’s the likelihood that the option won’t meet your workload’s requirements. The higher the risk, the more AWS advises you to check the option against your workload before you migrate.",
            ],
            [
              { b: "An estimated monthly saving for each option." },
              " It comes with a savings opportunity percentage. Without the savings estimation mode preference, both use On-Demand prices. With AWS Cost Optimization Hub enabled, Compute Optimizer uses Cost Optimization Hub data instead, which includes your specific pricing discounts.",
            ],
          ],
        },
      ],
    },
    {
      id: "the-recommendations-read-i-o-metrics-so",
      title: "The recommendations read I/O metrics, so they can’t see used space",
      blocks: [
        {
          kind: "p",
          text: "Recommendations refresh daily. By default they use the last 14\u00a0days of metrics, a window AWS calls the lookback period. You can extend it to 32\u00a0days at no charge.",
        },
        {
          kind: "p",
          text: "Over that window, Compute Optimizer reads six CloudWatch metrics for each volume, in three pairs:",
        },
        {
          kind: "ul",
          items: [
            "VolumeReadOps and VolumeWriteOps count read and write operations.",
            "VolumeReadBytes and VolumeWriteBytes count the bytes read and written.",
            "VolumeIOPSExceededCheck and VolumeThroughputExceededCheck report 1 when, in the last minute, an application consistently tried to exceed the volume’s provisioned IOPS or throughput.",
          ],
        },
        {
          kind: "p",
          text: "None of the six measures how much of the volume your filesystem uses. Only the filesystem inside the instance knows that figure. So a recommendation can’t tell you whether your data would fit in a smaller volume.",
        },
        {
          kind: "callout",
          label: "For engineers",
          text: "A volume needs at least 30 consecutive hours of metrics before it gets a recommendation. A new recommendation can take up to 24\u00a0hours to be generated.",
        },
        {
          kind: "p",
          text: "Within the lookback period, Compute Optimizer uses the maximum utilization point in each five-minute interval, not the average. The two exceeded checks work only on volumes attached to Nitro instances. They don’t work on magnetic volumes.",
        },
      ],
    },
    {
      id: "two-volumes-that-look-the-same-to",
      title: "Two volumes that look the same to Compute Optimizer",
      blocks: [
        {
          kind: "callout",
          label: "Worked example",
          text: "Set the 1,000\u00a0GiB volume holding 90\u00a0GiB beside a second 1,000\u00a0GiB volume holding 900\u00a0GiB. Both serve the same reads and writes.",
        },
        {
          kind: "p",
          text: "The first is 90 ÷ 1,000 = 9% full, with 1,000 − 90 = 910\u00a0GiB empty. The second is 90% full, with 100\u00a0GiB empty.",
        },
        {
          kind: "p",
          text: "To the six metrics, the two volumes look the same. Nothing Compute Optimizer reads shows the first volume’s 910 − 100 = 810\u00a0GiB of extra empty space. Nor does it show that a smaller size for the second must still hold 900\u00a0GiB.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: "The Compute Optimizer guide says its recommendations page “can help you to decide if you should up-size or down-size your volume.”",
        },
        {
          kind: "p",
          text: [
            "For a smaller size, that decision needs a figure the page doesn’t show: your used space. Measure it inside the instance, mount by mount, with the steps in ",
            { a: "how to check EBS volume usage", href: "/learn/check-ebs-volume-usage" },
            ". The ",
            { a: "EBS pricing calculator", href: "/ebs-and-azure-disk-pricing" },
            " shows what the empty space costs a month at list price.",
          ],
        },
      ],
    },
    {
      id: "idle-and-unattached-volumes-get-findings-of",
      title: "Idle and unattached volumes get findings of their own",
      blocks: [
        {
          kind: "p",
          text: "Compute Optimizer also lists idle resources, EBS volumes among them. A volume can get one of two findings:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Idle." },
              " Its read and write operations add up to less than 1 per day over the lookback period, and it isn’t a root volume.",
            ],
            [
              { b: "Unattached." },
              " It wasn’t attached to any EC2 instance over a 32-day lookback. Changing the lookback period doesn’t change those 32\u00a0days.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "For both, the recommended action is the same. Check whether you need the volume. If you don’t, create a ",
            { a: "snapshot", href: "/learn/glossary/disk-snapshot" },
            " of it and consider deleting it.",
          ],
        },
        {
          kind: "p",
          text: "Compute Optimizer’s Automation feature can do this for a volume unattached for at least 32\u00a0days. It takes the snapshot, then deletes the volume. If you roll the action back, it restores the data from that snapshot to a new volume with a new volume ID.",
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "An idle volume may still be attached to an instance that expects it. Check its mount and whatever uses it before you remove it, and keep the snapshot until you’re sure.",
        },
        {
          kind: "p",
          text: [
            { a: "EBS snapshot cost", href: "/learn/ebs-snapshot-cost" },
            " explains what you pay for that snapshot while you wait.",
          ],
        },
      ],
    },
    {
      id: "how-trusted-advisors-ebs-checks-differ-from",
      title: "How Trusted Advisor’s EBS checks differ from Compute Optimizer",
      blocks: [
        {
          kind: "p",
          text: "AWS Trusted Advisor inspects your account and flags the resources that match its checks. Three of its cost optimization checks cover EBS.",
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
          text: "The underutilized check is the closest to Compute Optimizer’s idle finding. It looks back 7\u00a0days, against Compute Optimizer’s 14-day default.",
        },
        {
          kind: "p",
          text: "With Compute Optimizer opted in, AWS recommends the over-provisioned check instead. That check is now marked legacy. AWS names Amazon EBS cost optimization recommendations for volumes as its replacement.",
        },
        {
          kind: "p",
          text: "The newest check shows only the top recommended action for each volume. To use it, you opt in to both Cost Optimization Hub and Compute Optimizer. For the detail on cost and performance, it points you back to Compute Optimizer.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: "Access is the other difference. Trusted Advisor checks are available with an AWS Business Support+, AWS Enterprise Support or AWS Unified Operations plan. On Basic Support, the console gives you the Service Limits checks and selected Security and Fault tolerance checks.",
        },
        { kind: "p", text: "So on Basic Support, the three EBS checks above aren’t included." },
      ],
    },
    {
      id: "is-aws-compute-optimizer-free",
      title: "Is AWS Compute Optimizer free?",
      blocks: [
        {
          kind: "p",
          text: "Yes. “There is no additional charge for AWS Compute Optimizer,” says its pricing page. Its recommendations from the last 14 or 32\u00a0days of CloudWatch metrics are free.",
        },
        {
          kind: "p",
          text: "You opt in first. You still pay for the AWS resources you run, and for CloudWatch monitoring fees.",
        },
        {
          kind: "p",
          text: "Enhanced infrastructure metrics is the paid option, charged per resource-hour. It extends the analysis to up to three months for EC2 instances, EC2 Auto Scaling groups and Amazon RDS. EBS volumes aren’t on that list, so their recommendations stay on the free 14-day or 32-day lookback.",
        },
      ],
    },
    {
      id: "compute-optimizer-applies-two-ebs-actions-and",
      title: "Compute Optimizer applies two EBS actions, and you apply the rest",
      blocks: [
        {
          kind: "p",
          text: "Compute Optimizer’s Automation feature applies two kinds of EBS action. You opt in to it on its own.",
        },
        {
          kind: "ul",
          items: [
            "One snapshots and deletes volumes unattached for at least 32\u00a0days.",
            "The other upgrades a volume to a newer-generation type, such as io1 to io2.",
          ],
        },
        {
          kind: "p",
          text: "You can apply each action from the Recommended actions page. You can also create automation rules that apply matching actions on a recurring schedule. To undo one, roll it back from the Automation events page.",
        },
        {
          kind: "p",
          text: "The rest stops at the recommendation. A new size, IOPS or throughput is yours to request. Compute Optimizer’s guidance on performance risk points you to the EBS steps for requesting a volume modification.",
        },
        {
          kind: "p",
          text: "Each Trusted Advisor action in the table also begins with “Consider.”",
        },
        { kind: "svg", figure: figure3 },
        { kind: "h3", id: "new-type-iops-or-throughput", title: "New type, IOPS or throughput" },
        {
          kind: "p",
          text: "These apply in place, through Elastic Volumes, AWS’s name for changing a volume in place. On an instance that supports it, Elastic Volumes can increase the size, change the type or adjust the performance. It does this without detaching the volume or restarting the instance.",
        },
        {
          kind: "p",
          text: "You can modify one volume up to four times in a rolling 24-hour period. Each change needs the previous one to have completed.",
        },
        {
          kind: "p",
          text: [
            "Say you ",
            { a: "change gp2 to gp3", href: "/learn/gp2-vs-gp3" },
            " without naming IOPS or throughput. EBS then provisions the gp2\u00a0volume’s equivalent performance or the ",
            { a: "gp3", href: "/learn/glossary/ebs-gp3" },
            " baseline, whichever is higher. ",
            { a: "EBS Elastic Volumes", href: "/learn/ebs-elastic-volumes" },
            " covers the commands and the limits.",
          ],
        },
        { kind: "h3", id: "larger-size", title: "Larger size" },
        {
          kind: "p",
          text: [
            "This applies in place too. Then you extend the filesystem so it can use the new space. ",
            { a: "How to increase EBS volume size", href: "/learn/increase-ebs-volume-size" },
            " shows each step.",
          ],
        },
        { kind: "h3", id: "smaller-size", title: "Smaller size" },
        {
          kind: "p",
          text: "A smaller size can’t be applied in place. “You can’t decrease the volume size,” say the Elastic Volumes limits.",
        },
        {
          kind: "p",
          text: [
            "AWS’s alternative is to create a smaller volume and migrate the data to it with an application-level tool such as rsync. That copy route, and the service stop it needs, are in ",
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
            " optimizes block storage on Azure and AWS. It starts from used space, the figure Compute Optimizer doesn’t read. Where Compute Optimizer leaves size changes to you, Amoeba makes them as your data grows and shrinks.",
          ],
        },
        { kind: "h3", id: "what-amoeba-does-on-aws", title: "What Amoeba does on AWS" },
        {
          kind: "p",
          text: [
            "Amoeba moves a running instance’s EBS data volumes onto one btrfs pool of gp3\u00a0volumes. It never touches the root volume. ",
            { a: "EBS cost optimization", href: "/ebs-cost-optimization" },
            " shows Amoeba on AWS end to end.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Rightsizing." },
              " The pool is sized to your data, with room to grow. Amoeba grows it before it fills, and sooner when data arrives fast. When your data goes down and stays down, it shrinks the pool one volume at a time.",
            ],
            [
              { b: "The move." },
              " Amoeba copies your data while your services run. Then it switches each mount to the pool, with a short restart of the services that use it. If the switch fails, it puts the original mounts back and tries again.",
            ],
            [
              { b: "The old volumes." },
              " Once the switch is checked, Amoeba snapshots each old volume and deletes it. It keeps each snapshot for a few days, then deletes it too. You pay for both sets of volumes only while the move runs, then for the snapshots while they’re kept.",
            ],
            [
              { b: "Your control." },
              " You choose whether shrinks start on their own or wait for you. Growing the pool always runs on its own.",
            ],
          ],
        },
        {
          kind: "p",
          text: "So you pay for close to what you use. After the one switch, Amoeba grows and shrinks the pool without any downtime.",
        },
        { kind: "h3", id: "what-an-instance-needs", title: "What an instance needs" },
        {
          kind: "p",
          text: "Amoeba works on Windows and Linux VMs. On AWS, an instance must be running, managed by AWS Systems Manager and a Nitro type, with at least one EBS data volume. It also needs a few free attachment slots for the pool.",
        },
        {
          kind: "p",
          text: "On Linux, the instance needs a recent kernel with btrfs. Every service that keeps a data mount open must run under systemd.",
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
    {
      title: "EBS volume types: pricing and how to choose",
      where: "Learn",
      href: "/learn/ebs-volume-types",
    },
  ],
};
