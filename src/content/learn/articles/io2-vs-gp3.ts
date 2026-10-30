import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/io2-vs-gp3/1";

export const article: Article = {
  slug: "io2-vs-gp3",
  title: "io2 vs gp3: when Provisioned IOPS is worth it",
  meta: "io2 vs gp3 on AWS list prices, IOPS and latency limits, Multi-Attach and durability, with four checks for when io2 is worth paying for over gp3.",
  h1: "io2 vs gp3: when Provisioned IOPS is worth the price",
  deck: "gp3 now reaches 80,000\u00a0IOPS. What io2 adds beyond that, what it costs per GB and per IOPS, and how to choose.",
  card: "What io2 adds over gp3, what each costs per GB and per IOPS, and the checks that tell you which to use.",
  product: "amoeba",
  hub: "Block storage",
  topic: "AWS block storage",
  versus: ["io2", "gp3"],
  published: "2026-11-09",
  updated: "2026-11-09",
  author: "swapna",
  short:
    "In io2 vs gp3, gp3 is the default and io2 is the exception you pay for. Since September 2025 one gp3\u00a0volume reaches 80,000 input/output operations per second (IOPS) and 2,000\u00a0MiB/s, at $0.08 per GB-month with 3,000\u00a0IOPS and 125\u00a0MiB/s included (US East (N. Virginia), October 2026). io2 costs $0.125 per GB-month plus every IOPS you provision. It’s worth that for more than 80,000\u00a0IOPS, steady sub-millisecond latency, Multi-Attach, or 99.999% durability.",
  sections: [
    {
      id: "what-io2-adds-over-gp3",
      title: "What io2 adds over gp3",
      blocks: [
        {
          kind: "p",
          text: "Both are solid-state drive (SSD) volume types in Amazon Elastic Block Store (EBS), and both let you set IOPS apart from size. gp3, General Purpose SSD, comes with 3,000\u00a0IOPS and 125\u00a0MiB/s on every volume, and you buy more of either up to its limits. io2, Provisioned IOPS SSD, includes nothing: you provision every IOPS, and throughput rises with them at 0.256\u00a0MiB/s per IOPS, up to 4,000\u00a0MiB/s.",
        },
        {
          kind: "p",
          text: "AWS raised gp3’s limits on 26 September 2025, from 16\u00a0TiB, 16,000\u00a0IOPS and 1,000\u00a0MiB/s to 64\u00a0TiB, 80,000\u00a0IOPS and 2,000\u00a0MiB/s, and kept its pricing model.",
        },
        {
          kind: "p",
          text: "The io2 Block Express vs gp3 question is the same comparison: AWS says that as of 30 April 2025, every io2\u00a0volume, new or previously created, is io2 Block Express.",
        },
        {
          kind: "table",
          columns: [
            { label: "What you decide on", width: "29%" },
            { label: "gp3", width: "23%" },
            { label: "io2 Block Express", width: "26%" },
            { label: "io1", width: "22%" },
          ],
          rows: [
            [
              "Size",
              "1\u00a0GiB to 64\u00a0TiB",
              "4\u00a0GiB to 64\u00a0TiB",
              "4\u00a0GiB to 16\u00a0TiB",
            ],
            [
              "Most IOPS per volume",
              "80,000 (on Nitro instances)",
              "256,000 (on Nitro instances)",
              "64,000 (on Nitro instances)",
            ],
            ["Most IOPS per GiB", "500", "1,000", "50"],
            ["Most throughput", "2,000\u00a0MiB/s", "4,000\u00a0MiB/s", "1,000\u00a0MiB/s"],
            ["Included in the price", "3,000\u00a0IOPS and 125\u00a0MiB/s", "No IOPS", "No IOPS"],
            [
              "Latency, as AWS states it",
              "Single-digit millisecond",
              "Average under 500 microseconds for 16\u00a0KiB I/O, on Nitro instances",
              "Depends on the IOPS you provision and your workload",
            ],
            [
              "Provisioned performance delivered",
              "99% of the time",
              "99.9% of the time",
              "99.9% of the time",
            ],
            [
              "Durability (annual failure rate)",
              "99.8% to 99.9% (0.1% to 0.2%)",
              "99.999% (0.001%)",
              "99.8% to 99.9% (0.1% to 0.2%)",
            ],
            ["Multi-Attach and NVMe reservations", "Not supported", "Supported", "Supported"],
            [
              "Storage, US East (N. Virginia), Oct 2026",
              "$0.08 per GB-month",
              "$0.125 per GB-month",
              "$0.125 per GB-month",
            ],
            [
              "IOPS, same Region and date",
              "$0.005 per IOPS-month above 3,000",
              "$0.065 per IOPS-month up to 32,000, $0.046 to 64,000, $0.032 above",
              "$0.065 per IOPS-month",
            ],
            [
              "Throughput, same Region and date",
              "$0.040 per MB/s-month above 125",
              "No separate charge",
              "No separate charge",
            ],
          ],
        },
      ],
    },
    {
      id: "io2-vs-gp3-performance-and-latency",
      title: "io2 vs gp3 performance and latency",
      blocks: [
        {
          kind: "p",
          text: "If one volume must go past gp3’s 80,000\u00a0IOPS or 2,000\u00a0MiB/s, io2 is the EBS type that does, up to 256,000\u00a0IOPS and 4,000\u00a0MiB/s. Past 32,000\u00a0IOPS, either type needs an instance built on the Nitro System, because other instance types reach 32,000\u00a0IOPS at most. Every volume is also capped by the instance it’s attached to: AWS’s I/O guidance assumes an instance “that can provide sufficient bandwidth”, so check the instance’s EBS limits before you buy volume IOPS it can’t use.",
        },
        {
          kind: "p",
          text: "The IOPS-to-size ratio matters on small volumes. gp3 allows 500\u00a0IOPS per GiB, so its 80,000\u00a0IOPS need at least 160\u00a0GiB, while io2 allows 1,000 per GiB and reaches 256,000\u00a0IOPS at 256\u00a0GiB. On a 20\u00a0GiB volume, gp3 tops out at 10,000\u00a0IOPS and io2 at 20,000.",
        },
        {
          kind: "p",
          text: "On io2 vs gp3 latency, AWS describes gp3 as single-digit millisecond. For io2 on Nitro instances it gives an average under 500 microseconds for 16\u00a0KiB I/O, and says I/Os slower than 800 microseconds happen over 10 times less often on io2 than on General Purpose volumes. The gp3 page itself recommends io2 for latency-sensitive workloads. Consistency differs as well: AWS designs gp3 to deliver its provisioned performance 99% of the time, and io2 99.9%.",
        },
        {
          kind: "p",
          text: "Rule out the cheaper cause first. AWS notes that consistently driving more IOPS than a volume has “can cause increased I/O latency”, and advises checking that the application isn’t asking for more IOPS or throughput than the volume is provisioned for. The VolumeIOPSExceededCheck and VolumeThroughputExceededCheck metrics return 1 when that happens, and VolumeAvgReadLatency and VolumeAvgWriteLatency show the latency you get today. Raising gp3\u00a0IOPS costs far less than moving to io2.",
        },
      ],
    },
    {
      id: "multi-attach-and-durability",
      title: "Multi-Attach and durability",
      blocks: [
        {
          kind: "p",
          text: "Multi-Attach lets you attach one Provisioned IOPS volume, io1 or io2, to up to 16 Nitro instances in the same Availability Zone, each with full read and write access. gp3 doesn’t support it. It costs nothing beyond the volume’s normal charges. AWS warns that standard file systems such as XFS and ext4 aren’t designed to be used by several instances at once, and points you to a clustered file system. Your application must also order its writes. io1 and io2 support NVMe reservations, a set of I/O fencing protocols that control write access to a shared volume. A Multi-Attach volume can’t be a boot volume, and Windows instances support Multi-Attach on io2 only.",
        },
        {
          kind: "p",
          text: "AWS designs io2 for 99.999% durability, an annual failure rate of no more than 0.001%, which it puts at one volume failure per 100,000 running volumes a year. gp3 and io1 are designed for 99.8% to 99.9%, at most two failures per 1,000. Snapshots are point-in-time copies: restoring one after a failure loses every write made since it was taken, so io2 earns its price on a volume whose recent writes you can’t rebuild.",
        },
      ],
    },
    {
      id: "io2-vs-gp3-cost-worked-through",
      title: "io2 vs gp3 cost, worked through",
      blocks: [
        {
          kind: "p",
          text: "Every price here is a list price for US East (N. Virginia) on the Amazon EBS pricing page in October 2026. Prices differ by Region and change over time. The pricing page writes throughput in MB/s, where the volume docs write MiB/s for the same setting.",
        },
        {
          kind: "p",
          text: "gp3 bills $0.08 per GB-month. The first 3,000\u00a0IOPS and 125\u00a0MB/s are included, and above them you pay $0.005 per IOPS-month and $0.040 per MB/s-month. io2 bills $0.125 per GB-month, about 56% more per GB, with no included performance. Each provisioned IOPS costs $0.065 a month up to 32,000, $0.046 from 32,001 to 64,000 and $0.032 above 64,000. AWS applies those tiers per volume, so ten volumes at 10,000\u00a0IOPS each all pay the first-tier rate. io2 has no throughput charge.",
        },
        { kind: "p", text: "The gp3 vs io2 cost of one 1,000\u00a0GiB volume, by the month:" },
        {
          kind: "ul",
          items: [
            "At 3,000\u00a0IOPS, gp3 costs $80.00 and io2 $320.00, four times as much.",
            "At 16,000\u00a0IOPS, gp3 costs $160.00 with its throughput raised to 500\u00a0MiB/s, and io2 costs $1,165.00 with up to 4,000\u00a0MiB/s.",
            "At gp3’s ceiling of 80,000\u00a0IOPS and 2,000\u00a0MiB/s, gp3 costs $540.00, and io2 about $4,189.",
            "At 256,000\u00a0IOPS, only io2 can serve it, for about $9,821.",
          ],
        },
        { kind: "diagram", figure: figure1 },
        {
          kind: "p",
          text: "At these rates io2 never costs less than gp3 for a volume gp3 can serve, because its storage rate is higher and it bills every IOPS where gp3 includes the first 3,000. In proportion, the gap is smallest on very large volumes with little performance, where it comes close to the 56% per-GB difference. It’s widest on small volumes that need about 3,000\u00a0IOPS: a 100\u00a0GiB volume at 3,000\u00a0IOPS costs $8.00 on gp3 and $207.50 on io2. So the case for io2 rests on the capabilities above, not on price.",
        },
      ],
    },
    {
      id: "io1-vs-io2-vs-gp3",
      title: "io1 vs io2 vs gp3",
      blocks: [
        {
          kind: "p",
          text: "io1 is the other Provisioned IOPS type, and its list prices match io2 for storage and for the first 32,000\u00a0IOPS: $0.125 per GB-month and $0.065 per IOPS-month. Past 32,000, io1 charges $0.065 for every IOPS up to its 64,000 maximum, while io2 drops to its second and third tiers.",
        },
        {
          kind: "p",
          text: "io1 also gives you less per dollar. It stops at 16\u00a0TiB, 64,000\u00a0IOPS and 1,000\u00a0MiB/s, and allows 50\u00a0IOPS per GiB, so 10,000\u00a0IOPS needs a 200\u00a0GiB io1\u00a0volume against 10\u00a0GiB on io2 and 20\u00a0GiB on gp3. Its durability is gp3’s 99.8% to 99.9%. AWS’s Multi-Attach guide recommends io2 over io1 for performance, consistency and durability, at less cost.",
        },
        {
          kind: "p",
          text: "So the io1 vs io2 vs gp3 answer is gp3 by default, io2 when you need Provisioned IOPS, and io1 only for volumes you haven’t moved yet. The AWS Command Line Interface (CLI) command modify-volume can change io1 to io2 in place. For a Multi-Attach volume, a change between io1 and io2 is the only type change AWS allows, and it works even while the volume is attached.",
        },
      ],
    },
    {
      id: "how-to-choose-between-io2-and-gp3",
      title: "How to choose between io2 and gp3, and how to switch",
      blocks: [
        {
          kind: "p",
          text: "Start from gp3 and move a volume to io2 only when one of these holds:",
        },
        {
          kind: "ol",
          items: [
            "Several instances must write to the same volume. That needs Multi-Attach, so io2.",
            "One volume needs more than 80,000\u00a0IOPS or 2,000\u00a0MiB/s, on a Nitro instance whose EBS limits allow it.",
            "The application’s latency budget is tighter than a correctly provisioned gp3\u00a0volume gives. The exceeded checks read 0, and VolumeAvgReadLatency or VolumeAvgWriteLatency is still too high for the workload.",
            "Losing the writes made since your last snapshot would cost you more than io2’s premium.",
          ],
        },
        {
          kind: "p",
          text: [
            "If none of them holds, gp3 at the IOPS and throughput you measured is the volume to keep. If you’re still on gp2, ",
            { a: "moving to gp3", href: "/learn/gp2-vs-gp3" },
            " comes first, since AWS prices gp3 20% below gp2 per GiB.",
          ],
        },
        {
          kind: "p",
          text: [
            "On a current-generation instance, modify-volume may apply the type change without stopping the instance or detaching the volume, so you can try io2 under a real workload and return to gp3 if it doesn’t help. Name the IOPS, because when you change the type to io2 and leave out ",
            { code: "--iops" },
            ", AWS sets 3,000.",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "aws ec2 modify-volume --volume-id <volume-id> --volume-type io2 --iops <iops>",
        },
        {
          kind: "p",
          text: "To go back to gp3, set the throughput as well. A volume that changes to gp3 from io1 or io2 gets 125\u00a0MiB/s unless you name a value, and its IOPS must fit gp3’s range of 3,000 to 80,000, and above the included 3,000 at no more than 500 per GiB.",
        },
        {
          kind: "code",
          lang: "bash",
          code: "aws ec2 modify-volume --volume-id <volume-id> --volume-type gp3 --iops <iops> --throughput <mib-per-second>",
        },
        {
          kind: "p",
          text: [
            "You can modify a volume up to four times in a rolling 24-hour period, and each change must complete before the next one starts. What else a modification can change has its own page, on ",
            { a: "Elastic Volumes", href: "/learn/ebs-elastic-volumes" },
            ".",
          ],
        },
      ],
    },
    {
      id: "where-amoeba-fits",
      title: "Where Amoeba fits",
      blocks: [
        {
          kind: "p",
          text: [
            "Once a data volume sits on gp3 at its included performance, its bill is the GB you provisioned. modify-volume needs a target size “greater than or equal to the existing size of the volume”, so space you once needed stays on the bill after the data shrinks. The copy route is in ",
            { a: "how to shrink an EBS volume", href: "/learn/shrink-ebs-volume" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " optimizes block storage on Azure and AWS. On AWS it moves a running EC2 instance’s EBS data volumes, never the root volume, onto one gp3 pool in the same Availability Zone. It sizes the pool from the last 7\u00a0days’ highest use, to sit 80% to 90% full by default, and rightsizes it as data grows and shrinks. Each pool volume gets at least 3,000\u00a0IOPS and 125\u00a0MiB/s, more if the measured load needs it. Multi-Attach volumes are never counted.",
          ],
        },
        {
          kind: "p",
          text: "Because the pool is always gp3, data on an io2\u00a0volume moves to gp3 and gives up io2’s 99.999% durability, its sub-millisecond latency and its 99.9% consistency, and each pool volume stops at 80,000\u00a0IOPS. So leave off any instance that is on io2 for reasons 2 to 4 above. The services that hold the data mounts restart at the one switch, and again each time a failed switch is retried. You pay for both sets of volumes until Amoeba snapshots and deletes the source volumes after a 2-hour soak, and then for those snapshots for 7\u00a0days.",
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
      title: "“Amazon EBS volume types”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html",
    },
    {
      publisher: "AWS",
      title: "“Amazon EBS General Purpose SSD volumes”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/general-purpose.html",
    },
    {
      publisher: "AWS",
      title: "“Amazon EBS Provisioned IOPS SSD volumes”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/provisioned-iops.html",
    },
    { publisher: "AWS", title: "“Amazon EBS pricing”", url: "https://aws.amazon.com/ebs/pricing/" },
    {
      publisher: "AWS What’s New",
      title:
        "“Amazon EBS increases the maximum size and provisioned performance of General Purpose (gp3) volumes”",
      url: "https://aws.amazon.com/about-aws/whats-new/2025/09/amazon-ebs-size-provisioned-performance-gp3-volumes/",
    },
    {
      publisher: "AWS",
      title: "“Attach an EBS volume to multiple EC2 instances using Multi-Attach”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volumes-multi.html",
    },
    {
      publisher: "AWS",
      title: "“Amazon EBS I/O characteristics and monitoring”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-io-characteristics.html",
    },
    {
      publisher: "AWS CLI Command Reference",
      title: "“modify-volume”",
      url: "https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-volume.html",
    },
  ],
  related: [
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
      title: "What AWS Compute Optimizer recommends for EBS volumes",
      where: "Learn",
      href: "/learn/compute-optimizer-ebs",
    },
    {
      title: "Amoeba: Azure disk and Amazon EBS cost optimization",
      where: "Amoeba",
      href: "/amoeba",
    },
  ],
};
