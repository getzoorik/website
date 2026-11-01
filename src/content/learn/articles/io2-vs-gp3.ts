import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/io2-vs-gp3/1";
import { figure as figure2 } from "@/features/learn/figures/io2-vs-gp3/2";
import { figure as figure3 } from "@/features/learn/figures/io2-vs-gp3/3";

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
  published: "2026-11-01",
  updated: "2026-11-01",
  author: "swapna",
  cover: "/learn-covers/zoorik-learn-io2-vs-gp3-1200x630.webp",
  coverAlt:
    "io2 vs gp3: with more IOPS the io2 price climbs far above the gp3 price, and gp3 drops out at the top",
  short:
    "In io2 vs gp3, gp3 is the default, and io2 costs more per GB and charges for every IOPS (input/output operations per second). Pay for io2 only when a volume needs more than gp3’s 80,000\u00a0IOPS, steady sub-millisecond latency, Multi-Attach or 99.999% durability.",
  sections: [
    {
      id: "io2-vs-gp3",
      title: "io2 vs gp3: four things io2 adds, at a higher price",
      blocks: [
        {
          kind: "p",
          text: "Picture a 1,000\u00a0GiB database volume that needs 16,000\u00a0IOPS and 500\u00a0MiB/s. At US East list prices, it costs $160 a month on gp3 and $1,165 on io2. Pay the difference only for a capability gp3 lacks.",
        },
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
            ", comes with 3,000\u00a0IOPS and 125\u00a0MiB/s on every volume. You buy more of either, up to its limits.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Provisioned IOPS", href: "/learn/glossary/provisioned-iops" },
            " SSD, or io2, includes no IOPS in its price. You provision every IOPS, and throughput rises with them at 0.256\u00a0MiB/s per IOPS, up to 4,000\u00a0MiB/s.",
          ],
        },
        {
          kind: "p",
          text: "On 26 September 2025, AWS raised gp3’s limits and kept its pricing model:",
        },
        {
          kind: "ul",
          items: [
            "Size went from 16\u00a0TiB to 64\u00a0TiB.",
            "IOPS went from 16,000 to 80,000.",
            "Throughput went from 1,000\u00a0MiB/s to 2,000\u00a0MiB/s.",
          ],
        },
        {
          kind: "p",
          text: "The io2 Block Express vs gp3 question is the same comparison. AWS says that as of 30 April 2025, every io2\u00a0volume, new or previously created, is io2 Block Express.",
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
      id: "io2-vs-gp3-performance-more-per-volume",
      title: "io2 vs gp3 performance: more per volume, and steadier latency",
      blocks: [
        {
          kind: "p",
          text: "If one volume must go past gp3’s 80,000\u00a0IOPS or 2,000\u00a0MiB/s, io2 is the type that does. It goes up to 256,000\u00a0IOPS and 4,000\u00a0MiB/s.",
        },
        {
          kind: "p",
          text: "Past 32,000\u00a0IOPS, either type needs an instance built on the Nitro System. Other instance types reach 32,000\u00a0IOPS at most.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: [
            "Each volume is also capped by its instance. AWS’s I/O guidance assumes an instance “that can provide sufficient bandwidth”. So check the instance’s ",
            { a: "EBS limits", href: "/learn/glossary/ebs-optimized-instance" },
            " before you buy IOPS it can’t use.",
          ],
        },
        {
          kind: "p",
          text: "Size caps IOPS on small volumes. A gp3\u00a0volume allows 500\u00a0IOPS per GiB, so its 80,000\u00a0IOPS need at least 160\u00a0GiB. An io2\u00a0volume allows 1,000 per GiB and reaches 256,000\u00a0IOPS at 256\u00a0GiB.",
        },
        {
          kind: "p",
          text: "On a 20\u00a0GiB volume, gp3 tops out at 10,000\u00a0IOPS and io2 at 20,000.",
        },
        { kind: "h3", id: "io2-vs-gp3-latency", title: "io2 vs gp3 latency" },
        {
          kind: "p",
          text: [
            "AWS describes gp3 ",
            { a: "latency", href: "/learn/glossary/disk-latency" },
            " as single-digit millisecond. The gp3 page itself recommends io2 for latency-sensitive workloads.",
          ],
        },
        {
          kind: "p",
          text: "For io2 on Nitro instances, AWS gives an average under 500 microseconds for 16\u00a0KiB I/O. It also says I/Os slower than 800 microseconds happen over 10 times less often on io2 than on General Purpose volumes.",
        },
        {
          kind: "p",
          text: "AWS designs gp3 to deliver its provisioned performance 99% of the time, and io2 99.9%.",
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "Rule out the cheaper cause first. AWS notes that consistently driving more IOPS than a volume has “can cause increased I/O latency”.",
        },
        {
          kind: "p",
          text: "AWS advises checking that the application isn’t asking for more IOPS or throughput than the volume is provisioned for. The VolumeIOPSExceededCheck and VolumeThroughputExceededCheck metrics return 1 when that happens.",
        },
        {
          kind: "p",
          text: "VolumeAvgReadLatency and VolumeAvgWriteLatency show the latency you get today. Raising gp3\u00a0IOPS costs far less than moving to io2.",
        },
      ],
    },
    {
      id: "multi-attach-needs-provisioned-iops-and-99",
      title: "EBS Multi-Attach needs Provisioned IOPS, and 99.999% durability needs io2",
      blocks: [
        {
          kind: "p",
          text: "Multi-Attach lets you attach one Provisioned IOPS volume, io1 or io2, to up to 16 Nitro instances. They must be in the same Availability Zone, and each gets full read and write access. The gp3 type doesn’t support it.",
        },
        {
          kind: "p",
          text: "Multi-Attach costs nothing beyond the volume’s normal charges. Still, AWS warns that standard file systems such as XFS and ext4 aren’t designed to be used by several instances at once. It points you to a clustered file system.",
        },
        {
          kind: "callout",
          label: "For engineers",
          text: "Your application must also order its writes. Both io1 and io2 support NVMe reservations, a set of I/O fencing protocols that control write access to a shared volume.",
        },
        {
          kind: "p",
          text: "A Multi-Attach volume can’t be a boot volume. Windows instances support Multi-Attach on io2 only.",
        },
        {
          kind: "p",
          text: "AWS designs io2 for 99.999% durability, an annual failure rate of no more than 0.001%. That’s one volume failure per 100,000 running volumes a year. The gp3 and io1 types are designed for 99.8% to 99.9%, at most two failures per 1,000.",
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
      id: "io2-vs-gp3-cost-io2-never-costs",
      title: "io2 vs gp3 cost: io2 never costs less for a volume gp3 can serve",
      blocks: [
        {
          kind: "p",
          text: "Prices here are the Amazon EBS pricing page’s October 2026 list prices for US East (N. Virginia). They differ by Region and change over time.",
        },
        {
          kind: "p",
          text: "The pricing page writes MB/s where the volume docs write MiB/s, for the same setting.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "Take the opening’s volume. On gp3 it costs $160 a month:",
        },
        {
          kind: "ul",
          items: [
            "Storage is 1,000 × $0.08 = $80.",
            "The 13,000\u00a0IOPS above the included 3,000 add 13,000 × $0.005 = $65.",
            "The 375\u00a0MB/s above the included 125 add 375 × $0.040 = $15.",
          ],
        },
        { kind: "p", text: "On io2 the same volume costs $1,165 a month, about 7 times as much:" },
        {
          kind: "ul",
          items: [
            "Storage is 1,000 × $0.125 = $125.",
            "All 16,000\u00a0IOPS are charged, since io2 includes none: 16,000 × $0.065 = $1,040.",
            "Throughput, up to 4,000\u00a0MiB/s, has no charge.",
          ],
        },
        {
          kind: "p",
          text: "The io2\u00a0IOPS rate drops to $0.046 from 32,001 to 64,000, and to $0.032 above that. AWS applies those tiers per volume. So ten volumes at 10,000\u00a0IOPS each pay the first-tier rate.",
        },
        {
          kind: "h3",
          id: "four-cases-from-3-000-to-256",
          title: "Four cases, from 3,000 to 256,000\u00a0IOPS",
        },
        {
          kind: "p",
          text: "Here’s the monthly gp3 vs io2 cost of the opening’s volume in four cases. In each one gp3 can serve, io2 costs at least four times as much:",
        },
        {
          kind: "ul",
          items: [
            "3,000\u00a0IOPS: gp3 $80, io2 $320.",
            "16,000\u00a0IOPS: gp3 $160 with 500\u00a0MiB/s, io2 $1,165.",
            "80,000\u00a0IOPS, gp3’s ceiling: gp3 $540 with its throughput at 2,000\u00a0MiB/s, and io2 about $4,189.",
            "256,000\u00a0IOPS: only io2 can serve it, for about $9,821.",
          ],
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: "In proportion, the gap is smallest on very large volumes with little performance. There it comes close to the 56% more per GB that io2’s storage costs.",
        },
        {
          kind: "p",
          text: "Small volumes that need about 3,000\u00a0IOPS see the widest gap. A 100\u00a0GiB volume at 3,000\u00a0IOPS costs $8.00 on gp3 and $207.50 on io2.",
        },
      ],
    },
    {
      id: "io1-vs-io2-vs-gp3-io2-replaces",
      title: "Migrate io1 to io2: the same price or less, changed in place",
      blocks: [
        {
          kind: "p",
          text: "io1 is the other Provisioned IOPS type. Its list prices match io2 for storage and the first 32,000\u00a0IOPS. Past 32,000, io1 charges $0.065 for every IOPS up to its 64,000 maximum, while io2 drops to its second and third tiers.",
        },
        {
          kind: "p",
          text: "io1 also allows only 50\u00a0IOPS per GiB, so 10,000\u00a0IOPS needs a 200\u00a0GiB io1\u00a0volume. The same IOPS fit on 10\u00a0GiB of io2 or 20\u00a0GiB of gp3.",
        },
        {
          kind: "p",
          text: "io1’s durability is gp3’s 99.8% to 99.9%. AWS’s Multi-Attach guide recommends io2 over io1 for performance, consistency and durability, at less cost.",
        },
        {
          kind: "p",
          text: [
            "To ",
            { a: "compare io1 vs io2 with every other EBS type", href: "/learn/ebs-volume-types" },
            ", see EBS volume types.",
          ],
        },
        { kind: "p", text: "So, of the three types:" },
        {
          kind: "ul",
          items: [
            "Use gp3 by default.",
            "Use io2 when you need Provisioned IOPS.",
            "Keep io1 only for volumes you haven’t moved yet.",
          ],
        },
        {
          kind: "p",
          text: "The AWS Command Line Interface (CLI) command modify-volume can change io1 to io2 in place. For a Multi-Attach volume, a change between io1 and io2 is the only type change AWS allows. It works even while the volume is attached.",
        },
      ],
    },
    {
      id: "how-to-choose-between-io2-and-gp3",
      title: "How to choose between io2 and gp3, and how to switch",
      blocks: [
        { kind: "h3", id: "four-checks-for-io2", title: "Four checks for io2" },
        { kind: "p", text: "Move a volume from gp3 to io2 only when one of these holds:" },
        {
          kind: "ol",
          items: [
            [
              { b: "Shared writes." },
              " Several instances must write to one volume, which needs Multi-Attach, so io2.",
            ],
            [
              { b: "Past gp3’s ceiling." },
              " One volume needs more than 80,000\u00a0IOPS or 2,000\u00a0MiB/s, on a Nitro instance whose EBS limits allow it.",
            ],
            [
              { b: "Latency." },
              " The exceeded checks read 0, so gp3 is correctly provisioned. Yet VolumeAvgReadLatency or VolumeAvgWriteLatency stays too high for the workload’s latency budget.",
            ],
            [
              { b: "Durability." },
              " Losing the writes made since your last snapshot would cost you more than io2’s premium.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "If none of them holds, keep gp3 at the IOPS and throughput you measured. If you’re still on gp2, ",
            { a: "moving to gp3", href: "/learn/gp2-vs-gp3" },
            " comes first. AWS prices gp3 20% below gp2 per GB.",
          ],
        },
        {
          kind: "h3",
          id: "try-io2-and-go-back-if-it",
          title: "Try io2, and go back if it doesn’t help",
        },
        {
          kind: "p",
          text: [
            "On a current-generation instance, modify-volume may apply the type change without stopping the instance or detaching the volume. So you can try io2 and come back. ",
            { a: "Elastic Volumes", href: "/learn/ebs-elastic-volumes" },
            " covers what else a modification can change.",
          ],
        },
        {
          kind: "ol",
          items: [
            [
              "Change the type to io2 and name the IOPS: if you leave out ",
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
            "If io2 doesn’t help under the real workload, change back to gp3 and set the throughput. A volume that changes to gp3 from io1 or io2 gets 125\u00a0MiB/s unless you name a value. Its IOPS must fit gp3’s range of 3,000 to 80,000. Above the included 3,000, they can’t exceed 500 per GiB.",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "aws ec2 modify-volume --volume-id <volume-id> --volume-type gp3 --iops <iops> --throughput <mib-per-second>",
        },
        {
          kind: "p",
          text: "You can modify a volume up to four times in a rolling 24-hour period. Each change must complete before the next one starts, so a trial and a return take two.",
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
          text: "Once a data volume sits on gp3 at its included performance, you pay only for the GB you provisioned. The modify-volume command needs a target size “greater than or equal to the existing size of the volume”. So space you once needed is still charged after the data shrinks.",
        },
        {
          kind: "p",
          text: [
            "The ",
            { a: "EBS pricing calculator", href: "/ebs-and-azure-disk-pricing" },
            " shows what that empty space costs. The copy route to a smaller volume is in ",
            { a: "how to shrink an EBS volume", href: "/learn/shrink-ebs-volume" },
            ".",
          ],
        },
        { kind: "h3", id: "what-amoeba-does-on-aws", title: "What Amoeba does on AWS" },
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " optimizes block storage on Azure and AWS. On AWS, its ",
            { a: "EBS cost optimization", href: "/ebs-cost-optimization" },
            " moves a running instance’s EBS data volumes onto one btrfs pool of gp3\u00a0volumes. It never touches the root volume, and it leaves Multi-Attach volumes out.",
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
              " The services that use those mounts restart once, at the switch onto the pool.",
            ],
            [
              { b: "The old volumes." },
              " Once the switch is checked, Amoeba snapshots and deletes each old volume, then deletes the snapshots 7 days later. You pay for both sets of volumes only while the move runs, then for the snapshots while they’re kept.",
            ],
          ],
        },
        {
          kind: "p",
          text: "On AWS the pool is always gp3, so each pool volume stops at 80,000\u00a0IOPS. Data that moves off io2 also gives up its 99.999% durability, sub-millisecond latency and 99.9% consistency. So leave out any instance on io2 for checks 2 to 4 above.",
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
      title: "EBS volume types compared: how to choose one",
      where: "Learn",
      href: "/learn/ebs-volume-types",
    },
    {
      title: "What AWS Compute Optimizer recommends for EBS volumes",
      where: "Learn",
      href: "/learn/compute-optimizer-ebs",
    },
  ],
};
