import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/io2-vs-gp3/1";
import { figure as figure2 } from "@/features/learn/figures/io2-vs-gp3/2";
import { figure as figure3 } from "@/features/learn/figures/io2-vs-gp3/3";

export const article: Article = {
  slug: "io2-vs-gp3",
  title: "io2 vs gp3: when io2 Block Express is worth it",
  meta: "io2 vs gp3 on AWS: what io2 Block Express adds (256,000 IOPS, sub-millisecond latency, Multi-Attach, 99.999% durability), what it costs, and when it pays.",
  h1: "io2 vs gp3: when io2 is worth it",
  deck: "What io2 Block Express adds over gp3, what each costs, and how to try io2 and switch back.",
  card: "What io2 adds over gp3, what each costs, and four checks that tell you which to use.",
  product: "amoeba",
  hub: "Block storage",
  topic: "AWS block storage",
  versus: ["io2", "gp3"],
  published: "2026-11-01",
  updated: "2026-11-03",
  author: "swapna",
  cover: "/learn-covers/zoorik-learn-io2-vs-gp3-1200x630.webp",
  coverAlt:
    "io2 vs gp3: as IOPS rise, the io2 price climbs far above gp3, and gp3 stops at its ceiling",
  short:
    "Keep gp3 unless a volume needs something gp3 can\u2019t give: more than 80,000\u00a0IOPS or 2,000\u00a0MiB/s, steady sub-millisecond latency, Multi-Attach, or 99.999% durability. io2 costs 56% more per GB and charges for every IOPS (input/output operations per second), while gp3 includes 3,000. At US East list prices, a 1,000\u00a0GiB volume at 16,000\u00a0IOPS and 500\u00a0MiB/s costs $160 a month on gp3 and $1,165 on io2.",
  sections: [
    {
      id: "io2-vs-gp3",
      title: "io2 vs gp3 at a glance",
      blocks: [
        {
          kind: "p",
          text: [
            "Both are solid-state drive (SSD) volume types in Amazon Elastic Block Store (EBS). Both let you set ",
            { a: "IOPS", href: "/learn/glossary/iops" },
            " apart from size.",
          ],
        },
        {
          kind: "p",
          text: [
            "General Purpose SSD, or ",
            { a: "gp3", href: "/learn/glossary/ebs-gp3" },
            ", includes 3,000\u00a0IOPS and 125\u00a0MiB/s on every volume. You pay for more of either, up to 80,000\u00a0IOPS and 2,000\u00a0MiB/s. On 26 September 2025, AWS raised those limits from 16,000\u00a0IOPS and 1,000\u00a0MiB/s, and gp3\u2019s largest size from 16\u00a0TiB to 64\u00a0TiB.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Provisioned IOPS", href: "/learn/glossary/provisioned-iops" },
            " SSD, or io2, includes no IOPS. You provision every IOPS, and throughput rises with them at 0.256\u00a0MiB/s per IOPS, up to 4,000\u00a0MiB/s.",
          ],
        },
        { kind: "h3", id: "what-is-io2-block-express", title: "What is io2 Block Express?" },
        {
          kind: "p",
          text: "io2 Block Express is the current io2. AWS says that as of 30 April 2025, all new and previously created io2\u00a0volumes are Block Express. They run on a newer EBS storage architecture, built for instances on the Nitro System.",
        },
        {
          kind: "table",
          columns: [
            { label: "What differs", width: "29%" },
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
              "$0.065 per IOPS-month up to 32,000, $0.0455 to 64,000, $0.03185 above",
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
      id: "io2-vs-gp3-performance-more-per-volume",
      title: "Performance and durability",
      blocks: [
        {
          kind: "p",
          text: "Only io2 goes past gp3’s 80,000\u00a0IOPS or 2,000\u00a0MiB/s on one volume. It reaches 256,000\u00a0IOPS and 4,000\u00a0MiB/s.",
        },
        {
          kind: "p",
          text: "Past 32,000\u00a0IOPS, either type needs an instance built on the Nitro System. Other instances reach 32,000\u00a0IOPS at most.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: [
            "The instance caps each volume too. AWS’s I/O guidance assumes an instance “that can provide sufficient bandwidth”. Check the instance’s ",
            { a: "EBS limits", href: "/learn/glossary/ebs-optimized-instance" },
            " before you buy IOPS it can’t use.",
          ],
        },
        {
          kind: "p",
          text: "Size caps IOPS on small volumes. gp3 allows 500\u00a0IOPS per GiB, so its 80,000\u00a0IOPS need at least 160\u00a0GiB. io2 allows 1,000 per GiB and reaches 256,000\u00a0IOPS at 256\u00a0GiB. On a 20\u00a0GiB volume, gp3 tops out at 10,000\u00a0IOPS and io2 at 20,000.",
        },
        { kind: "h3", id: "io2-vs-gp3-latency", title: "Latency" },
        {
          kind: "p",
          text: [
            "AWS describes gp3 ",
            { a: "latency", href: "/learn/glossary/disk-latency" },
            " as single-digit millisecond, and recommends io2 for latency-sensitive workloads.",
          ],
        },
        {
          kind: "p",
          text: "On Nitro instances, AWS designs io2 for an average under 500 microseconds for 16\u00a0KiB I/O. On io2, I/Os slower than 800 microseconds happen over 10 times less often than on General Purpose volumes.",
        },
        {
          kind: "p",
          text: "AWS designs gp3 to deliver its provisioned performance 99% of the time, and io2 99.9%.",
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "Rule out under-provisioning first. AWS notes that consistently driving more IOPS than a volume has “can cause increased I/O latency”. VolumeIOPSExceededCheck and VolumeThroughputExceededCheck return 1 when the workload asks for more than the volume is provisioned for. VolumeAvgReadLatency and VolumeAvgWriteLatency show today’s latency. Raising gp3\u00a0IOPS costs far less than moving to io2.",
        },
        {
          kind: "h3",
          id: "aws-ebs-durability-io2-is-designed-for",
          title: "Durability",
        },
        {
          kind: "p",
          text: "AWS designs io2 for 99.999% durability, an annual failure rate of 0.001% at most. That’s one failure per 100,000 volumes a year. gp3 and io1 are designed for 99.8% to 99.9%: at most two failures per 1,000.",
        },
        {
          kind: "p",
          text: [
            "Restoring a ",
            { a: "snapshot", href: "/learn/glossary/disk-snapshot" },
            " after a failure loses every write since it was taken. So io2 earns its price on a volume whose recent writes you can’t rebuild.",
          ],
        },
      ],
    },
    {
      id: "multi-attach-needs-provisioned-iops-and-99",
      title: "EBS Multi-Attach",
      blocks: [
        {
          kind: "p",
          text: "Multi-Attach attaches one io1 or io2 volume to up to 16 Nitro instances in the same Availability Zone. Each instance gets full read and write access. gp3 doesn’t support it.",
        },
        {
          kind: "p",
          text: "It costs nothing beyond the volume’s normal charges. But AWS warns that standard file systems such as XFS and ext4 aren’t designed for several instances at once. It points you to a clustered file system.",
        },
        {
          kind: "callout",
          label: "For engineers",
          text: "Your application must also order its writes. io1 and io2 support NVMe reservations, a form of I/O fencing that controls write access to a shared volume.",
        },
        {
          kind: "p",
          text: "A Multi-Attach volume can’t be a boot volume. Windows instances support Multi-Attach on io2 only.",
        },
      ],
    },
    {
      id: "io2-vs-gp3-cost-io2-never-costs",
      title: "io2 vs gp3 cost",
      blocks: [
        {
          kind: "p",
          text: "Prices here are AWS’s October 2026 list prices for US East (N. Virginia). They differ by Region and change over time. The pricing page writes MB/s where the volume docs write MiB/s, for the same setting.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "A 1,000\u00a0GiB database volume needs 16,000\u00a0IOPS and 500\u00a0MiB/s. On gp3 it costs $160 a month:",
        },
        {
          kind: "ul",
          items: [
            "Storage: 1,000 × $0.08 = $80.",
            "The 13,000\u00a0IOPS above the included 3,000: 13,000 × $0.005 = $65.",
            "The 375\u00a0MB/s above the included 125: 375 × $0.040 = $15.",
          ],
        },
        { kind: "p", text: "On io2 the same volume costs $1,165 a month, about 7 times as much:" },
        {
          kind: "ul",
          items: [
            "Storage: 1,000 × $0.125 = $125.",
            "All 16,000\u00a0IOPS, since io2 includes none: 16,000 × $0.065 = $1,040.",
            "Throughput: no charge.",
          ],
        },
        {
          kind: "p",
          text: "io2’s IOPS rate drops to $0.0455 from 32,001 to 64,000, and to $0.03185 above that. AWS applies the tiers per volume, so ten volumes at 10,000\u00a0IOPS each all pay the first-tier rate.",
        },
        {
          kind: "h3",
          id: "four-cases-from-3-000-to-256",
          title: "Cost at four IOPS levels",
        },
        {
          kind: "p",
          text: "Each case below is the same 1,000\u00a0GiB volume, priced per month. In the three that gp3 can serve, io2 costs at least four times as much:",
        },
        {
          kind: "ul",
          items: [
            "3,000\u00a0IOPS: gp3 $80, io2 $320.",
            "16,000\u00a0IOPS: gp3 $160 with 500\u00a0MiB/s, io2 $1,165.",
            "80,000\u00a0IOPS, gp3’s ceiling: gp3 $540 with 2,000\u00a0MiB/s, io2 about $4,171.",
            "256,000\u00a0IOPS: only io2 can serve it, for about $9,776.",
          ],
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: "In proportion, the gap is smallest on large volumes that need little performance, close to io2’s 56% more per GB. It’s widest on small volumes near 3,000\u00a0IOPS: 100\u00a0GiB at 3,000\u00a0IOPS costs $8.00 on gp3 and $207.50 on io2.",
        },
      ],
    },
    {
      id: "io1-vs-io2-vs-gp3-io2-replaces",
      title: "io1 vs io2",
      blocks: [
        {
          kind: "p",
          text: "io1 is the other Provisioned IOPS type. Its list prices match io2 for storage and the first 32,000\u00a0IOPS. Above that, io1 keeps charging $0.065 per IOPS up to its 64,000 maximum, while io2’s rate drops.",
        },
        {
          kind: "p",
          text: "io1 also allows only 50\u00a0IOPS per GiB, so 10,000\u00a0IOPS needs a 200\u00a0GiB io1\u00a0volume. The same IOPS fit on 10\u00a0GiB of io2 or 20\u00a0GiB of gp3. And io1’s durability is gp3’s 99.8% to 99.9%.",
        },
        {
          kind: "p",
          text: [
            "AWS recommends io2 over io1: better performance, consistency and durability, for less. ",
            { a: "EBS volume types", href: "/learn/ebs-volume-types" },
            " compares every EBS type.",
          ],
        },
        { kind: "p", text: "Of the three types:" },
        {
          kind: "ul",
          items: [
            "Use gp3 by default.",
            "Use io2 when a volume passes one of the four checks below.",
            "Keep io1 only for volumes you haven’t moved yet.",
          ],
        },
        {
          kind: "p",
          text: "The AWS Command Line Interface (CLI) command modify-volume changes io1 to io2 in place. For a Multi-Attach volume, a change between io1 and io2 is the only type change AWS allows, and it works while the volume is attached.",
        },
      ],
    },
    {
      id: "how-to-choose-between-io2-and-gp3",
      title: "How to choose and switch",
      blocks: [
        { kind: "h3", id: "four-checks-for-io2", title: "Four checks for io2" },
        { kind: "p", text: "Move a volume from gp3 to io2 only when one of these holds:" },
        {
          kind: "ol",
          items: [
            [
              { b: "Shared writes." },
              " Several instances must write to one volume. That needs Multi-Attach, so io2.",
            ],
            [
              { b: "Past gp3’s ceiling." },
              " One volume needs more than 80,000\u00a0IOPS or 2,000\u00a0MiB/s, on a Nitro instance whose EBS limits allow it.",
            ],
            [
              { b: "Latency." },
              " The exceeded checks read 0, so gp3 is correctly provisioned. Yet VolumeAvgReadLatency or VolumeAvgWriteLatency stays above the workload’s latency budget.",
            ],
            [
              { b: "Durability." },
              " Losing the writes made since your last snapshot would cost more than io2’s premium.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "If none holds, keep gp3 at the IOPS and throughput you measured. If you’re still on gp2, ",
            { a: "moving to gp3", href: "/learn/gp2-vs-gp3" },
            " comes first. AWS prices gp3 20% below gp2 per GiB.",
          ],
        },
        {
          kind: "h3",
          id: "try-io2-and-go-back-if-it",
          title: "Try io2 and go back",
        },
        {
          kind: "p",
          text: [
            "On a current-generation instance, modify-volume may change the type without stopping the instance or detaching the volume. So you can try io2 and switch back. ",
            { a: "Elastic Volumes", href: "/learn/ebs-elastic-volumes" },
            " covers what else you can change.",
          ],
        },
        {
          kind: "ol",
          items: [
            [
              "Change the type to io2 and set the IOPS. Without ",
              { code: "--iops" },
              ", AWS sets 3,000.",
            ],
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "aws ec2 modify-volume --volume-id <volume-id> --volume-type io2 --iops <iops>",
        },
        {
          kind: "ol",
          start: 2,
          items: [
            "If io2 doesn’t help under the real workload, change back to gp3 and set the throughput too. Without it, the volume gets 125\u00a0MiB/s. gp3 takes 3,000 to 80,000\u00a0IOPS, and no more than 500 per GiB above 3,000.",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "aws ec2 modify-volume --volume-id <volume-id> --volume-type gp3 --iops <iops> --throughput <mib-per-second>",
        },
        {
          kind: "p",
          text: "You can change a volume up to four times in a rolling 24-hour period, and each change must complete before the next starts. A trial and a return use two.",
        },
        { kind: "svg", figure: figure3 },
      ],
    },
    {
      id: "where-amoeba-fits",
      title: "Where Amoeba fits",
      blocks: [
        {
          kind: "p",
          text: "On gp3 at its included performance, a data volume costs only the GB you provisioned. modify-volume can’t make a volume smaller, so space you once needed stays charged after the data shrinks.",
        },
        {
          kind: "p",
          text: [
            "The ",
            { a: "EBS pricing calculator", href: "/ebs-and-azure-disk-pricing" },
            " shows what that empty space costs. ",
            { a: "How to shrink an EBS volume", href: "/learn/shrink-ebs-volume" },
            " gives the copy route to a smaller one.",
          ],
        },
        {
          kind: "h3",
          id: "what-amoeba-does-on-aws",
          title: "What Amoeba does",
        },
        {
          kind: "p",
          text: [
            "On AWS, ",
            { a: "Amoeba", href: "/amoeba" },
            " moves a running instance’s EBS data volumes onto one btrfs pool of gp3\u00a0volumes. It never touches the root volume, and it leaves Multi-Attach volumes out. ",
            { a: "EBS cost optimization", href: "/ebs-cost-optimization" },
            " covers Amoeba on AWS in full.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Rightsizing." },
              " The pool is sized to your data, with room to grow. Amoeba grows it before it fills, and shrinks it one volume at a time when your data goes down and stays down.",
            ],
            [
              { b: "The move." },
              " Amoeba copies your data while your services run. Then it switches each mount to the pool, with a short restart of the services that use it.",
            ],
            [
              { b: "The old volumes." },
              " Once the switch is checked, Amoeba snapshots each old volume, deletes the volume, and keeps the snapshot for 7 days before deleting it too. You pay for both sets of volumes only while the move runs, then for the snapshots while they’re kept.",
            ],
          ],
        },
        {
          kind: "p",
          text: "The pool is gp3, so data moved off io2 gives up what io2 adds. Leave out any instance whose io2\u00a0volumes pass checks 2 to 4 above.",
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
      title: "How to shrink an EBS volume",
      where: "Learn",
      href: "/learn/shrink-ebs-volume",
    },
    {
      title: "gp2 vs gp3 on AWS",
      where: "Learn",
      href: "/learn/gp2-vs-gp3",
    },
    {
      title: "Amazon EBS volume types",
      where: "Learn",
      href: "/learn/ebs-volume-types",
    },
    {
      title: "AWS Compute Optimizer for EBS",
      where: "Learn",
      href: "/learn/compute-optimizer-ebs",
    },
  ],
  relatedTitle: "More on EBS volume types",
};
