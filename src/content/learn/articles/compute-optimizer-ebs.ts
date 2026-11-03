import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/compute-optimizer-ebs/1";
import { figure as figure2 } from "@/features/learn/figures/compute-optimizer-ebs/2";
import { figure as figure3 } from "@/features/learn/figures/compute-optimizer-ebs/3";

export const article: Article = {
  slug: "compute-optimizer-ebs",
  title: "AWS Compute Optimizer for EBS: what it recommends",
  meta: "AWS Compute Optimizer EBS recommendations read I/O metrics, not used space. See what each finding means, how Trusted Advisor compares and what you apply.",
  h1: "AWS Compute Optimizer for EBS",
  deck: "What its findings mean, the metrics behind them, how Trusted Advisor compares and what you apply yourself.",
  card: "What its EBS findings mean, the metrics behind them, and how Trusted Advisor differs.",
  product: "amoeba",
  hub: "Block storage",
  topic: "AWS block storage",
  published: "2026-11-01",
  updated: "2026-11-03",
  author: "sonu",
  cover: "/learn-covers/zoorik-learn-compute-optimizer-ebs-1200x630.webp",
  coverAlt:
    "Compute Optimizer for EBS: it reads I/O to suggest type, size and IOPS, but used space is not seen",
  short:
    "Compute Optimizer gives each EBS volume a finding and up to three options for its type, size, IOPS and throughput. By default it reads 14 days of CloudWatch I/O metrics. Those show the I/O a volume served, not how much data it holds. The recommendations are free, and most changes are yours to apply.",
  sections: [
    {
      id: "compute-optimizer-ebs",
      title: "What it recommends",
      blocks: [
        {
          kind: "p",
          text: [
            "Compute Optimizer is an AWS service that reads your resources’ specifications and utilization metrics, then recommends changes. For Amazon Elastic Block Store (EBS) volumes, it recommends a type, size, ",
            { a: "input/output operations per second (IOPS)", href: "/learn/glossary/iops" },
            " and ",
            { a: "throughput", href: "/learn/glossary/disk-throughput" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "It covers General Purpose SSD (gp2, gp3), Provisioned IOPS SSD (io1, io2, io2 Block Express) and HDD (st1, sc1) volumes. For magnetic volumes, it recommends a move to a current-generation type.",
        },
        {
          kind: "h3",
          id: "what-each-recommendation-gives-you",
          title: "What a recommendation shows",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "A finding." },
              " Not optimized means Compute Optimizer found a type, size or IOPS setting that “can provide better performance or cost”. Optimized means the volume is correctly provisioned for its workload. It may still suggest a newer-generation type.",
            ],
            [
              { b: "Up to three options." },
              " The recommendations page shows each volume’s top option beside its current type and hourly price. The volume’s details page lists every option with its monthly price.",
            ],
            [
              { b: "A performance risk for each option." },
              " It runs from very low to very high: the likelihood that the option won’t meet your workload’s needs. The higher it is, the more you should check the option before you migrate.",
            ],
            [
              { b: "An estimated monthly saving for each option." },
              " It comes with a savings percentage. Both use On-Demand prices unless the savings estimation mode preference is on. With Cost Optimization Hub enabled, they include your own pricing discounts.",
            ],
          ],
        },
      ],
    },
    {
      id: "the-recommendations-read-i-o-metrics-so",
      title: "I/O metrics, not used space",
      blocks: [
        {
          kind: "p",
          text: "Recommendations refresh daily. By default they read the last 14 days of metrics, a window AWS calls the lookback period. You can extend it to 32 days at no charge.",
        },
        { kind: "p", text: "For each volume, Compute Optimizer reads six CloudWatch metrics:" },
        {
          kind: "ul",
          items: [
            [
              { code: "VolumeReadOps" },
              " and ",
              { code: "VolumeWriteOps" },
              ": read and write operations.",
            ],
            [
              { code: "VolumeReadBytes" },
              " and ",
              { code: "VolumeWriteBytes" },
              ": bytes read and written.",
            ],
            [
              { code: "VolumeIOPSExceededCheck" },
              " and ",
              { code: "VolumeThroughputExceededCheck" },
              ": 1 when an application consistently tried to exceed the provisioned IOPS or throughput in the last minute.",
            ],
          ],
        },
        {
          kind: "p",
          text: "None of the six measures how much of the volume your filesystem uses. Only the filesystem inside the instance knows that. So a recommendation can’t tell you whether your data fits a smaller volume.",
        },
        {
          kind: "callout",
          label: "For engineers",
          text: "A volume needs at least 30 consecutive hours of metrics before it gets a recommendation, and one can take up to 24 hours to appear. Compute Optimizer uses the highest point in each five-minute interval, not the average. The two exceeded checks work only on Nitro instances, and not on magnetic volumes.",
        },
      ],
    },
    {
      id: "two-volumes-that-look-the-same-to",
      title: "Check used space first",
      blocks: [
        {
          kind: "callout",
          label: "Worked example",
          text: "Take two 1,000 GiB volumes that serve the same reads and writes. One holds 90 GiB of data. The other holds 900 GiB.",
        },
        {
          kind: "p",
          text: "The first is 90 ÷ 1,000 = 9% full, with 910 GiB empty. The second is 90% full, with 100 GiB empty.",
        },
        {
          kind: "p",
          text: "To the six metrics, the two look the same. Nothing shows the first volume’s 910 − 100 = 810 GiB of extra empty space. Nor does anything show that a smaller size for the second must still hold 900 GiB.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: "AWS says the recommendations page “can help you to decide if you should up-size or down-size your volume.” For a smaller size, that decision needs a figure the page doesn’t show: your used space.",
        },
        {
          kind: "p",
          text: [
            "Measure it inside the instance, mount by mount, with ",
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
      title: "Idle and unattached volumes",
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
              " Its reads and writes add up to less than 1 a day over the lookback period, and it isn’t a root volume.",
            ],
            [
              { b: "Unattached." },
              " It wasn’t attached to any EC2 instance in the last 32 days. Changing the lookback period doesn’t change those 32 days.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "For both, AWS recommends the same action. Check whether you need the volume. If you don’t, take a ",
            { a: "snapshot", href: "/learn/glossary/disk-snapshot" },
            " and consider deleting it. Compute Optimizer’s Automation feature can take both steps for a volume unattached for at least 32 days.",
          ],
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
      title: "Trusted Advisor’s EBS checks",
      blocks: [
        {
          kind: "p",
          text: "AWS Trusted Advisor flags resources that match its checks. Three of its cost optimization checks cover EBS.",
        },
        {
          kind: "table",
          columns: [
            { label: "Check", width: "21%" },
            { label: "Data from", width: "15%" },
            { label: "Flags a volume when", width: "42%" },
            { label: "Recommended action", width: "22%" },
          ],
          rows: [
            [
              "Underutilized Amazon EBS volumes",
              "Trusted Advisor’s own check",
              "It’s unattached, or had less than 1 IOPS a day for the past 7 days. Boot volumes are excluded.",
              "Consider snapshotting and deleting it",
            ],
            [
              "Amazon EBS over-provisioned volumes (legacy)",
              "Compute Optimizer, once you opt in",
              "It was over-provisioned in the lookback period, judged on all default CloudWatch metrics, IOPS and throughput included",
              "Consider downsizing it if its use is low",
            ],
            [
              "Amazon EBS cost optimization recommendations for volumes",
              "Cost Optimization Hub",
              "Cost Optimization Hub found a cost savings action for it",
              "Consider applying the recommendation",
            ],
          ],
        },
        {
          kind: "p",
          text: "The underutilized check is closest to Compute Optimizer’s idle finding. It looks back 7 days, against Compute Optimizer’s 14-day default.",
        },
        {
          kind: "p",
          text: "Once you opt in to Compute Optimizer, the over-provisioned check gets Compute Optimizer’s EBS data, and AWS recommends it instead. That check is now legacy. AWS names the cost optimization recommendations check as its replacement.",
        },
        {
          kind: "p",
          text: "That new check shows only the top recommended action for each volume. It needs you to opt in to both Cost Optimization Hub and Compute Optimizer. For the cost and performance detail, it points you back to Compute Optimizer.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: "The support plan matters too. Trusted Advisor checks come with AWS Business Support+, Enterprise Support or Unified Operations. Basic Support gives only the Service Limits checks and selected Security and Fault tolerance checks, so none of these three.",
        },
      ],
    },
    {
      id: "is-aws-compute-optimizer-free",
      title: "What it costs",
      blocks: [
        {
          kind: "p",
          text: "Nothing extra. “There is no additional charge for AWS Compute Optimizer,” says its pricing page. You opt in first, then pay only for the resources you run and for CloudWatch monitoring.",
        },
        {
          kind: "p",
          text: "The paid option is enhanced infrastructure metrics, charged per resource-hour. It extends the lookback to up to three months for EC2 instances, EC2 Auto Scaling groups and Amazon RDS. EBS volumes aren’t on that list, so they stay on the free 14-day or 32-day lookback.",
        },
      ],
    },
    {
      id: "compute-optimizer-applies-two-ebs-actions-and",
      title: "Who applies each change",
      blocks: [
        {
          kind: "p",
          text: "Compute Optimizer’s Automation feature, which you opt in to on its own, applies two EBS actions:",
        },
        {
          kind: "ul",
          items: [
            "Snapshot and delete a volume unattached for at least 32 days. A rollback restores the data from that snapshot to a new volume, with a new volume ID.",
            "Upgrade a volume to a newer-generation type, such as io1 to io2. A rollback changes the type back.",
          ],
        },
        {
          kind: "p",
          text: "You apply an action from the Recommended actions page, or set automation rules that apply matching actions on a schedule. You roll one back from the Automation events page.",
        },
        {
          kind: "p",
          text: "Every other change stops at the recommendation. A new size, IOPS or throughput is yours to request. Compute Optimizer points you to the EBS steps for requesting a volume modification.",
        },
        { kind: "svg", figure: figure3 },
        { kind: "h3", id: "new-type-iops-or-throughput", title: "New type, IOPS or throughput" },
        {
          kind: "p",
          text: "Elastic Volumes, AWS’s way of modifying a volume, applies these in place. On an instance that supports it, nothing is detached or restarted. A volume takes up to four changes in a rolling 24-hour period, each after the last one completes.",
        },
        {
          kind: "p",
          text: [
            "Say you ",
            { a: "change gp2 to gp3", href: "/learn/gp2-vs-gp3" },
            " without naming IOPS or throughput. EBS then gives the volume the gp2 volume’s performance or the ",
            { a: "gp3", href: "/learn/glossary/ebs-gp3" },
            " baseline, whichever is higher. ",
            { a: "EBS Elastic Volumes", href: "/learn/ebs-elastic-volumes" },
            " covers the commands and limits.",
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
          text: "This can’t be applied in place. “You can’t decrease the volume size,” say the Elastic Volumes limits.",
        },
        {
          kind: "p",
          text: [
            "AWS’s alternative is to create a smaller volume and copy the data with a tool such as rsync on Linux or robocopy on Windows. ",
            { a: "How to shrink an EBS volume", href: "/learn/shrink-ebs-volume" },
            " covers that copy and the service stop it needs.",
          ],
        },
      ],
    },
    {
      id: "how-amoeba-rightsizes-from-used-space",
      title: "Where Amoeba fits",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " rightsizes block storage on Azure and AWS without any downtime. It starts from used space, the figure Compute Optimizer doesn’t read. It makes the size changes Compute Optimizer leaves to you, up and down.",
          ],
        },
        { kind: "h3", id: "what-amoeba-does-on-aws", title: "What Amoeba does" },
        {
          kind: "ul",
          items: [
            [
              { b: "The pool." },
              " Amoeba moves an instance’s EBS data volumes onto one btrfs pool of gp3 volumes, sized to your data with room to grow. The root volume is never touched.",
            ],
            [
              { b: "The move." },
              " Amoeba copies your data while your services run. Then it switches each mount to the pool, with a short restart of the services that use it. If the switch fails, it puts the original mounts back and tries again.",
            ],
            [
              { b: "Growing." },
              " It grows the pool on its own before it fills, and sooner when data arrives fast.",
            ],
            [
              { b: "Shrinking." },
              " When your data goes down and stays down, it shrinks the pool one volume at a time. You choose whether shrinks start on their own or wait for you.",
            ],
            [
              { b: "The old volumes." },
              " Once the switch is checked, Amoeba snapshots and deletes each old volume. It keeps each snapshot for 7 days, then deletes it too.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "You pay for both sets of volumes only while the move runs, then for the snapshots while they’re kept. After that, you pay for close to what you use. ",
            { a: "EBS cost optimization", href: "/ebs-cost-optimization" },
            " shows Amoeba on AWS end to end.",
          ],
        },
        { kind: "h3", id: "what-an-instance-needs", title: "What an instance needs" },
        {
          kind: "p",
          text: "Amoeba works on Windows and Linux VMs. On AWS, the instance must be running, managed by AWS Systems Manager and a Nitro type. It needs at least one EBS data volume and a few free attachment slots for the pool.",
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
    text: "Amoeba moves an EC2 instance’s EBS data volumes onto one pool sized to your data, then rightsizes it autonomously, without any downtime, one volume at a time. We estimate it takes 50–60% off block storage cost. It is an estimated range, not a promise. The free assessment works out your own figure.",
    links: [
      { label: "Block storage optimization with Amoeba", href: "/amoeba" },
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
      publisher: "AWS Compute Optimizer User Guide",
      title: "“Rightsizing recommendation preferences”",
      url: "https://docs.aws.amazon.com/compute-optimizer/latest/ug/rightsizing-preferences.html",
      note: " (lookback period)",
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
      title: "“Opt in AWS Compute Optimizer for Trusted Advisor checks”",
      url: "https://docs.aws.amazon.com/awssupport/latest/user/compute-optimizer-with-trusted-advisor.html",
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
      title: "How to check EBS volume usage",
      where: "Learn",
      href: "/learn/check-ebs-volume-usage",
    },
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
      title: "Amazon EBS volume types",
      where: "Learn",
      href: "/learn/ebs-volume-types",
    },
  ],
};
