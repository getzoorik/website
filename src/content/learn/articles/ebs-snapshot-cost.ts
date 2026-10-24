import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/ebs-snapshot-cost/1";

export const article: Article = {
  slug: "ebs-snapshot-cost",
  title: "EBS snapshot cost: pricing and how to reduce it",
  meta: "EBS snapshot cost explained: what the standard and archive tiers bill, why deleting a snapshot may not help, and how to find the old ones still billing.",
  h1: "EBS snapshot cost: what you pay for and how to reduce it",
  deck: "What a snapshot bills for, when the archive tier pays off, and how to find the snapshots nobody will restore.",
  card: "How incremental EBS snapshots bill, and how to find the old ones nobody will restore.",
  product: "amoeba",
  hub: "Block storage",
  topic: "AWS block storage",
  published: "2026-11-04",
  updated: "2026-11-04",
  author: "pulkit",
  short:
    "EBS snapshot cost depends on the data a snapshot stores, billed per GB-month, not the size of its volume. A volume’s first snapshot stores every block written to it, and each later one stores only the blocks that changed since the one before. In US East (N. Virginia) in October 2026, standard snapshot storage lists at $0.05 per GB-month and the archive tier at $0.0125. A snapshot bills until you delete it, even after its volume is gone.",
  sections: [
    {
      id: "how-ebs-snapshot-cost-is-worked-out",
      title: "How EBS snapshot cost is worked out",
      blocks: [
        {
          kind: "p",
          text: "An Amazon Elastic Block Store (EBS) volume is billed on the size you provision, “until you release the storage.” A snapshot bills for what it holds. AWS bases snapshot storage on the space your data consumes in Amazon Simple Storage Service (Amazon S3), and because “Amazon EBS does not save empty blocks,” a snapshot is often much smaller than its volume.",
        },
        {
          kind: "p",
          text: "The first snapshot of a volume is a full copy of the data written to it. Every later snapshot of the same volume is incremental: it saves only the blocks that changed since the previous snapshot and refers back to the earlier ones for the rest. In AWS’s own example, Snap A stores a volume’s 10\u00a0GiB, 4\u00a0GiB of it then changes, and Snap B stores only those 4\u00a0GiB, so you pay for 14\u00a0GiB in all. You still need only the newest snapshot to create the whole volume again.",
        },
        {
          kind: "p",
          text: "The snapshot charges, at list price in US East (N. Virginia) in October 2026:",
        },
        {
          kind: "table",
          columns: [
            { label: "Charge", width: "38%" },
            { label: "Price", width: "62%" },
          ],
          rows: [
            ["Standard tier storage", "$0.05 per GB-month"],
            ["Archive tier storage", "$0.0125 per GB-month, with a 90-day minimum"],
            ["Restoring a snapshot from the archive tier", "$0.03 per GB, once per restore"],
            [
              "Fast snapshot restore (FSR)",
              "$0.75 per Data Services Unit-hour (DSU-hour), for each snapshot in each Availability Zone",
            ],
          ],
        },
        {
          kind: "p",
          text: "Prices differ by Region and change over time. Check the Amazon EBS pricing page for your Region before you plan around them.",
        },
      ],
    },
    {
      id: "ebs-snapshot-pricing-beyond-storage",
      title: "EBS snapshot pricing beyond storage",
      blocks: [
        { kind: "p", text: "Two charges sit beside storage, and the first can easily outgrow it." },
        {
          kind: "p",
          text: "Fast snapshot restore makes a volume created from a snapshot fully initialized at creation, so it delivers its provisioned performance at once. You enable it per snapshot and per Availability Zone, and each pair bills for every minute it’s enabled, with a one-hour minimum. AWS’s own example puts one snapshot in one zone for 30\u00a0days at $540 (720\u00a0hours at $0.75), and two snapshots in three zones at $3,240. The pricing page is plain that you “continue to incur charges until you disable FSR on a snapshot.” FSR also stays enabled on a snapshot when you delete or disable the Amazon Data Lifecycle Manager policy that turned it on, so you switch it off yourself.",
        },
        {
          kind: "p",
          text: "Copies are the other charge. A snapshot copied to another Region bills the data transferred across Regions, and then bills standard snapshot storage in the destination Region as well. A copy kept for disaster recovery bills the same data in two Regions.",
        },
      ],
    },
    {
      id: "why-deleting-an-ebs-snapshot-may-not",
      title: "Why deleting an EBS snapshot may not reduce the bill",
      blocks: [
        {
          kind: "p",
          text: "When you delete a snapshot, AWS removes only the data that no other snapshot references, and blocks that a later snapshot still uses are kept, with their cost moved to that later snapshot. In AWS’s example, deleting Snap A takes the bill from 14\u00a0GiB to 10\u00a0GiB, not to 4\u00a0GiB: Snap A’s 4\u00a0GiB of unique data goes, and the 6\u00a0GiB that Snap B still references stays.",
        },
        { kind: "diagram", figure: figure1 },
        {
          kind: "p",
          text: "Three things follow from that rule. Deleting an old snapshot reduces the bill only by the blocks no other snapshot holds, which can be far less than it seems. Data you delete inside the volume doesn’t leave the old snapshots either, because AWS treats it as unique data of the earlier snapshots until every snapshot that references it is deleted. And deleting a volume has no effect on the snapshots made from it, so they keep billing after the volume is gone.",
        },
        {
          kind: "p",
          text: "That last rule also works in your favour. A detached gp3\u00a0volume you keep only in case you need its data bills its full provisioned size, at $0.08 per GB-month in US East (N. Virginia) in October 2026. Snapshot it, and once you’re sure you won’t need the volume itself, delete the volume: the snapshot goes on at $0.05 per GB-month for the written blocks alone.",
        },
      ],
    },
    {
      id: "ebs-snapshot-archive-pricing-when-archiving-pays",
      title: "EBS snapshot archive pricing: when archiving pays off",
      blocks: [
        {
          kind: "p",
          text: "The archive tier stores a snapshot at $0.0125 per GB-month, a quarter of the standard rate, but it changes what you store. Archiving turns an incremental snapshot into a full snapshot of every block written to the volume when it was taken. You pay for at least 90\u00a0days. Delete or permanently restore it sooner and you’re billed for the days left. Restoring takes up to 72\u00a0hours, depending on the snapshot’s size, and you can’t create a volume from an archived snapshot until it’s back in the standard tier.",
        },
        {
          kind: "p",
          text: "The archive tier fits the only snapshot of a volume, such as the one you keep when a project ends. A lone snapshot is already full, so archiving doesn’t make it any bigger. At October 2026 list prices in US East (N. Virginia), a 200\u00a0GB snapshot costs $10.00 a month in the standard tier and $2.50 in the archive tier, or $120 against $30 over a year. If you ever restore it, add a one-time $6 for the 200\u00a0GB, and the standard rate for the restored copy while it stays in the standard tier.",
        },
        {
          kind: "p",
          text: "It fits a chain of daily snapshots badly. AWS warns that archiving daily incremental snapshots of a single volume “can lead to higher costs” than leaving them in the standard tier. The blocks that later snapshots reference stay in the standard tier, now billed to the next snapshot, and you pay for the new full copy in the archive tier on top. AWS recommends archiving monthly, quarterly or yearly snapshots instead.",
        },
        {
          kind: "p",
          text: [
            "To see what a snapshot would bill in the archive tier, read its ",
            { code: "FullSnapshotSizeInBytes" },
            " from ",
            { code: "describe-snapshots" },
            ". That figure is the full size, not the incremental size, so it doesn’t tell you what the snapshot costs you in the standard tier today.",
          ],
        },
      ],
    },
    {
      id: "set-an-ebs-snapshot-lifecycle-policy",
      title: "Set an EBS snapshot lifecycle policy",
      blocks: [
        {
          kind: "p",
          text: "Amazon Data Lifecycle Manager creates, keeps and deletes snapshots on a schedule, so retention stops depending on someone remembering. A policy picks its volumes or instances by tag and holds up to 4 schedules. Without archiving, each schedule keeps its snapshots by count, from 1 to 1,000, or by age, from 1\u00a0day to 100 years, and when a schedule reaches its limit, the oldest snapshot is permanently deleted.",
        },
        {
          kind: "p",
          text: "A lifecycle policy is the part of EBS snapshot cost optimization that keeps working after you’ve cleaned up once. Retention is its main setting. Seven daily snapshots of a volume hold its data roughly once plus six days of changes, while 30 hold it once plus 29\u00a0days’ worth. A schedule can also archive, if its snapshots are at least 28\u00a0days apart and it keeps archived ones for at least 90\u00a0days. Only one schedule in a policy can archive, and only in a policy that targets volumes.",
        },
        {
          kind: "p",
          text: "Watch for these cases, where snapshots outlive the policy’s retention:",
        },
        {
          kind: "ul",
          items: [
            "Removing the target tag from a volume means the policy no longer manages that volume’s existing snapshots, so they stay until you delete them.",
            "Deleting a volume under a count-based schedule does the same.",
            "Under an age-based schedule, the policy keeps deleting a deleted volume’s snapshots on time, up to but not including the last one.",
            "A snapshot you lock or archive yourself, and that’s still locked or archived when its retention ends, is left alone.",
            "Under an age-based schedule, snapshots that expire while the policy is in the error state are kept indefinitely, so you delete them yourself.",
          ],
        },
      ],
    },
    {
      id: "how-to-find-and-delete-old-ebs",
      title: "How to find and delete old EBS snapshots",
      blocks: [
        {
          kind: "p",
          text: "To reduce EBS snapshot costs by deleting snapshots, start with the ones whose volume no longer exists. These two commands read the Region your AWS Command Line Interface (CLI) is set to, so run them in each Region you use. The first lists the snapshots you own that started before a date, with the volume each one came from:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "aws ec2 describe-snapshots --owner-ids self \\\n    --query \"Snapshots[?(StartTime<='<yyyy-mm-dd>')].[SnapshotId,VolumeId,StartTime,Description]\" \\\n    --output text",
        },
        { kind: "p", text: "The second lists the volumes that still exist:" },
        {
          kind: "code",
          lang: "bash",
          code: 'aws ec2 describe-volumes --query "Volumes[*].VolumeId" --output text',
        },
        {
          kind: "p",
          text: "A snapshot whose volume ID isn’t in the second list usually came from a volume that has been deleted. Copies are the exception: a snapshot made by a copy carries an arbitrary volume ID, which AWS says you shouldn’t use for any purpose, so a copy can show up here even when its source volume still exists.",
        },
        {
          kind: "p",
          text: [
            "Some snapshots can’t be deleted as they are. You can’t delete the root snapshot of a registered Amazon Machine Image (AMI), and deregistering an AMI doesn’t delete its snapshots by default, so they keep billing. AMI root snapshots carry a description of the form ",
            { code: "Created by CreateImage(<instance-id>) for <ami-id>" },
            ". Snapshots that AWS Backup manages are different again: you delete them as recovery points in AWS Backup, not through EC2.",
          ],
        },
        {
          kind: "p",
          text: "Deregistration is permanent: EC2 deletes the AMI, and nothing can launch from it afterwards. To deregister one you no longer need and delete its snapshots in the same step:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "aws ec2 deregister-image --image-id <ami-id> --delete-associated-snapshots",
        },
        { kind: "p", text: "A snapshot that another AMI also uses is kept." },
        {
          kind: "p",
          text: "Deleting a snapshot removes that restore point, so check first that no recovery plan or image build depends on it. Then:",
        },
        { kind: "code", lang: "bash", code: "aws ec2 delete-snapshot --snapshot-id <snapshot-id>" },
        {
          kind: "p",
          text: "If a Recycle Bin retention rule matches the snapshot, AWS keeps it in the Recycle Bin instead of deleting it at once, and it bills there at the same rate as any snapshot. Check your retention rules before you count on the saving.",
        },
      ],
    },
    {
      id: "how-amoeba-uses-ebs-snapshots",
      title: "How Amoeba uses EBS snapshots",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " optimizes block storage on Azure managed disks and Amazon EBS. On AWS it moves an EC2 instance’s data volumes onto one pool of gp3\u00a0volumes, and its snapshots come at the end of that move. After the 2-hour soak that follows the switch onto the pool, Amoeba detaches each source volume (one the data moved off), takes one EBS snapshot of it, waits until the snapshot is complete, and then deletes the volume. Amoeba keeps each snapshot for 7\u00a0days after its source volume is deleted, then deletes it. The snapshots sit in your account, and AWS bills them to you under the same rules as every snapshot above: for those 7\u00a0days you pay for the blocks each one stores, not the source volume’s provisioned size.",
          ],
        },
        {
          kind: "p",
          text: [
            "A volume that a later shrink releases is handled differently. Amoeba first moves its data onto the pool’s other volumes, then detaches and deletes it with no snapshot. Amoeba deletes only snapshots tagged with its own move’s ID, so the snapshots your own policies take are left alone. If one of your lifecycle policies targeted a source volume, the deleted-volume rules above apply to that policy’s snapshots of it. What Amoeba creates in your AWS account is listed in ",
            { a: "its guide", href: "/amoeba/guide#in-your-aws-account" },
            ", and the reason source volumes are replaced at all is in ",
            { a: "how to shrink an EBS volume", href: "/learn/shrink-ebs-volume" },
            ".",
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
      title: "“Delete an Amazon EBS snapshot”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-deleting-snapshot.html",
    },
    {
      publisher: "AWS",
      title: "“Considerations and limitations for archiving Amazon EBS snapshots”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/snapshot-archive-considerations.html",
    },
    {
      publisher: "AWS",
      title: "“Create Amazon Data Lifecycle Manager custom policy for EBS snapshots”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/snapshot-ami-policy.html",
    },
    {
      publisher: "AWS",
      title: "“Amazon EBS fast snapshot restore”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-fast-snapshot-restore.html",
    },
    {
      publisher: "AWS",
      title: "“Deregister an Amazon EC2 AMI”",
      url: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/deregister-ami.html",
    },
    {
      publisher: "AWS CLI Command Reference",
      title: "“describe-snapshots”",
      url: "https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-snapshots.html",
    },
    {
      publisher: "AWS",
      title: "“Recover deleted EBS volumes, EBS snapshots, and EBS-backed AMIs with Recycle Bin”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/recycle-bin.html",
    },
  ],
  related: [
    {
      title: "How to shrink an EBS volume when AWS only lets it grow",
      where: "Learn",
      href: "/learn/shrink-ebs-volume",
    },
    {
      title: "Azure disk snapshot cost: incremental vs full snapshots",
      where: "Learn",
      href: "/learn/azure-disk-snapshot-cost",
    },
    {
      title: "In your AWS account",
      where: "Amoeba product guide",
      href: "/amoeba/guide#in-your-aws-account",
    },
  ],
};
