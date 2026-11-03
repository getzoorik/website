import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/ebs-snapshot-cost/1";
import { figure as figure2 } from "@/features/learn/figures/ebs-snapshot-cost/2";
import { figure as figure3 } from "@/features/learn/figures/ebs-snapshot-cost/3";

export const article: Article = {
  slug: "ebs-snapshot-cost",
  title: "AWS snapshot pricing: what EBS snapshots cost",
  meta: "AWS snapshot pricing for EBS: standard and archive tier rates, why deleting a snapshot may not reduce cost, and Amazon Data Lifecycle Manager policies.",
  h1: "AWS snapshot pricing",
  deck: "What EBS snapshots cost, why deleting one can save less than you expect, and when archiving pays off.",
  card: "How EBS snapshots are charged, when archiving pays off, and which old ones to delete.",
  product: "amoeba",
  hub: "Block storage",
  topic: "AWS block storage",
  published: "2026-11-01",
  updated: "2026-11-03",
  author: "pulkit",
  cover: "/learn-covers/zoorik-learn-ebs-snapshot-cost-1200x630.webp",
  coverAlt: "The first snapshot stores all the volume’s data, and later ones store only changes",
  short:
    "AWS snapshot pricing for EBS follows the data each snapshot stores, not its volume’s size, and you pay until you delete it. In US East (N. Virginia), standard snapshot storage lists at $0.05 per GB-month and the archive tier at $0.0125. Deleting a snapshot saves only the data no other snapshot uses.",
  sections: [
    {
      id: "ebs-snapshot-cost",
      title: "How snapshots are charged",
      blocks: [
        {
          kind: "p",
          text: [
            "Take AWS’s own example. Snap A, the first ",
            { a: "snapshot", href: "/learn/glossary/disk-snapshot" },
            " of an ",
            { a: "Amazon Elastic Block Store (EBS) volume", href: "/learn/glossary/ebs-volume" },
            ", copies all 10\u00a0GiB of its data. After 4\u00a0GiB changes, Snap B saves only those 4\u00a0GiB and refers back to Snap A for the other 6\u00a0GiB.",
          ],
        },
        {
          kind: "p",
          text: "You pay for 14\u00a0GiB in all, and the newest snapshot alone can still create the whole volume again.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: "Every later snapshot of a volume is incremental, like Snap B. AWS bases snapshot storage on the space your data takes in Amazon S3, and “Amazon EBS does not save empty blocks.” So a snapshot is often much smaller than its volume, which is charged on its full provisioned size.",
        },
        {
          kind: "p",
          text: "EBS snapshot prices, at list price in US East (N. Virginia) in October 2026:",
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
          text: "Prices differ by Region and change over time, so check the Amazon EBS pricing page for yours.",
        },
      ],
    },
    {
      id: "fast-snapshot-restore-and-copies-add-to",
      title: "Fast snapshot restore and copies",
      blocks: [
        {
          kind: "p",
          text: "Fast snapshot restore (FSR) makes a volume created from a snapshot fully initialized at creation, so it delivers all its provisioned performance at once.",
        },
        {
          kind: "p",
          text: "You enable FSR per snapshot and per Availability Zone. Each pair is charged for every minute it’s enabled, with a one-hour minimum.",
        },
        {
          kind: "p",
          text: "In AWS’s own example, one snapshot in one zone for 30\u00a0days costs $540 (720\u00a0hours at $0.75). Two snapshots in three zones make six pairs: 6 × $540 = $3,240.",
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "FSR is charged until you disable it. A snapshot keeps FSR even after you delete or disable the Amazon Data Lifecycle Manager policy that enabled it.",
        },
        {
          kind: "p",
          text: "A snapshot copied to another Region is charged for the data transferred, then for standard snapshot storage there. So a copy kept for disaster recovery means paying for the same data in two Regions.",
        },
      ],
    },
    {
      id: "deleting-an-ebs-snapshot-reduces-cost-only",
      title: "Why deleting saves less",
      blocks: [
        {
          kind: "p",
          text: "When you delete a snapshot, AWS removes only the data that no other snapshot references. Blocks that a later snapshot still uses are kept, and their cost moves to that snapshot.",
        },
        {
          kind: "p",
          text: "In AWS’s example, deleting Snap A takes the total from 14\u00a0GiB to 10\u00a0GiB, not to 4\u00a0GiB. Its 4\u00a0GiB of unique data goes, while the 6\u00a0GiB that Snap B still references stays.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: "Data you delete inside a volume doesn’t leave the old snapshots. AWS counts it as unique data of the earlier snapshots until every snapshot that references it is deleted.",
        },
        {
          kind: "p",
          text: "Deleting a volume has no effect on its snapshots, so you go on paying for them after the volume is gone.",
        },
        {
          kind: "p",
          text: [
            "Replacing a volume with a snapshot can reduce cost. A detached ",
            { a: "gp3", href: "/learn/glossary/ebs-gp3" },
            " volume you keep only for its data is charged on its provisioned size, at $0.08 per GB-month in US East (N. Virginia). Our ",
            { a: "EBS pricing calculator", href: "/ebs-and-azure-disk-pricing" },
            " shows what such a volume costs a month.",
          ],
        },
        {
          kind: "p",
          text: "Snapshot that volume, then delete it once you’re sure you won’t need it. The snapshot costs $0.05 per GB-month, for the written blocks alone.",
        },
      ],
    },
    {
      id: "ebs-snapshot-archive-pricing-a-quarter-of",
      title: "Archive tier pricing",
      blocks: [
        {
          kind: "p",
          text: "The archive tier costs $0.0125 per GB-month, a quarter of the standard rate. But archiving turns an incremental snapshot into a full one: every block written to the volume when it was taken.",
        },
        {
          kind: "h3",
          id: "archive-tier-terms-a-90-day-minimum",
          title: "90-day minimum, slow restores",
        },
        {
          kind: "p",
          text: "You pay for at least 90\u00a0days. If you delete or permanently restore the snapshot sooner, you’re charged for the days left.",
        },
        {
          kind: "p",
          text: "A restore takes up to 72\u00a0hours, depending on the snapshot’s size. You can’t create a volume from an archived snapshot until it’s back in the standard tier.",
        },
        { kind: "h3", id: "when-archiving-pays-off", title: "When archiving pays off" },
        {
          kind: "p",
          text: "The archive tier fits a volume’s only snapshot, such as the one you keep when a project ends. A lone snapshot is already full, so archiving doesn’t make it bigger.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "A lone 200\u00a0GB snapshot at the prices above costs 200 × $0.05 = $10.00 a month in the standard tier, or $120 a year.",
        },
        {
          kind: "p",
          text: "Archived, it costs 200 × $0.0125 = $2.50 a month, or $30 a year: $90 a year less.",
        },
        {
          kind: "p",
          text: "A restore adds a one-time 200 × $0.03 = $6. The restored copy then costs the standard rate while it stays in the standard tier. A temporary restore also keeps the archived copy, which is still charged.",
        },
        { kind: "svg", figure: figure3 },
        { kind: "h3", id: "when-archiving-costs-more", title: "When archiving costs more" },
        {
          kind: "p",
          text: "AWS warns that archiving daily incremental snapshots of a single volume “can lead to higher costs” than leaving them in the standard tier.",
        },
        {
          kind: "p",
          text: "The blocks that later snapshots reference stay in the standard tier, and you pay for a full archive copy on top. AWS recommends archiving monthly, quarterly or yearly snapshots instead.",
        },
        {
          kind: "callout",
          label: "For engineers",
          text: [
            "A snapshot’s ",
            { code: "FullSnapshotSizeInBytes" },
            ", from ",
            { code: "describe-snapshots" },
            ", gives its size in the archive tier. That’s the full size, so it doesn’t show what the snapshot costs you in the standard tier today.",
          ],
        },
      ],
    },
    {
      id: "set-an-ebs-snapshot-lifecycle-policy-and",
      title: "Amazon Data Lifecycle Manager",
      blocks: [
        {
          kind: "p",
          text: "Amazon Data Lifecycle Manager creates, keeps and deletes EBS snapshots on a schedule, so retention doesn’t depend on someone remembering. Each policy picks its volumes or instances by tag and holds up to 4 schedules.",
        },
        {
          kind: "h3",
          id: "retention-and-archiving-in-a-policy",
          title: "Retention and archiving",
        },
        {
          kind: "p",
          text: "Without archiving, a schedule keeps its snapshots by count, from 1 to 1,000, or by age, from 1\u00a0day to 100 years. At the limit, the oldest snapshot is permanently deleted.",
        },
        {
          kind: "p",
          text: "Seven daily snapshots of a volume hold its data roughly once, plus six days of changes. Keep 30 and they hold it once, plus 29\u00a0days’ worth.",
        },
        {
          kind: "p",
          text: "An archiving schedule needs its snapshots at least 28\u00a0days apart and must keep archived ones for at least 90\u00a0days. Only one schedule in a policy can archive, and only in a policy that targets volumes.",
        },
        {
          kind: "h3",
          id: "what-a-lifecycle-policy-leaves-behind",
          title: "What a policy leaves behind",
        },
        { kind: "p", text: "In these cases, snapshots outlive the policy’s retention:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Target tag removed." },
              " The policy no longer manages that volume’s existing snapshots. They stay until you delete them.",
            ],
            [{ b: "Volume deleted, count-based schedule." }, " Its existing snapshots stay too."],
            [
              { b: "Volume deleted, age-based schedule." },
              " The policy goes on deleting its snapshots on time, up to but not including the last one.",
            ],
            [
              { b: "Locked or archived by you." },
              " The policy leaves such a snapshot alone if it’s still in that state when its retention ends.",
            ],
            [
              { b: "Policy in the error state." },
              " Under an age-based schedule, snapshots that expire meanwhile are kept indefinitely. You delete them yourself.",
            ],
          ],
        },
      ],
    },
    {
      id: "how-to-find-and-delete-old-ebs",
      title: "Find and delete old snapshots",
      blocks: [
        {
          kind: "p",
          text: "Start with the snapshots whose volume no longer exists. Run both list commands in every Region you use, since the AWS Command Line Interface reads only the Region it’s set to.",
        },
        {
          kind: "h3",
          id: "1-list-your-snapshots-from-before-a",
          title: "1. List old snapshots",
        },
        {
          kind: "p",
          text: "This lists the snapshots you own from before a date, with the volume each one came from:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "aws ec2 describe-snapshots --owner-ids self \\\n    --query \"Snapshots[?(StartTime<='<yyyy-mm-dd>')].[SnapshotId,VolumeId,StartTime,Description]\" \\\n    --output text",
        },
        {
          kind: "h3",
          id: "2-list-the-volumes-that-still-exist",
          title: "2. List current volumes",
        },
        {
          kind: "code",
          lang: "bash",
          code: 'aws ec2 describe-volumes --query "Volumes[*].VolumeId" --output text',
        },
        {
          kind: "h3",
          id: "3-pick-out-the-snapshots-whose-volume",
          title: "3. Find snapshots of deleted volumes",
        },
        {
          kind: "p",
          text: "A snapshot whose volume ID isn’t in step 2’s list usually came from a deleted volume.",
        },
        {
          kind: "p",
          text: "Copies are the exception. A copied snapshot carries an arbitrary volume ID, which AWS says you shouldn’t use for any purpose. So it can show up here even when its source volume still exists.",
        },
        {
          kind: "h3",
          id: "4-handle-ami-and-aws-backup-snapshots",
          title: "4. Handle AMI and AWS Backup snapshots",
        },
        {
          kind: "p",
          text: "You can’t delete the root snapshot of a registered Amazon Machine Image (AMI). Deregistering an AMI keeps its snapshots by default, and you go on paying for them.",
        },
        {
          kind: "p",
          text: [
            "AMI root snapshots carry the description ",
            { code: "Created by CreateImage(<instance-id>) for <ami-id>" },
            ", so you can spot them in step 1’s list.",
          ],
        },
        {
          kind: "p",
          text: "Snapshots that AWS Backup manages are deleted as recovery points in AWS Backup, not through EC2.",
        },
        {
          kind: "p",
          text: "Deregistration is permanent, and nothing can launch from the AMI afterwards. This removes an AMI you no longer need and its snapshots, keeping any snapshot that another AMI uses:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "aws ec2 deregister-image --image-id <ami-id> --delete-associated-snapshots",
        },
        { kind: "h3", id: "5-delete-the-rest", title: "5. Delete the rest" },
        {
          kind: "p",
          text: "Deleting a snapshot removes that restore point, so first check that no recovery plan or image build needs it. Then:",
        },
        { kind: "code", lang: "bash", code: "aws ec2 delete-snapshot --snapshot-id <snapshot-id>" },
        {
          kind: "p",
          text: "If a Recycle Bin retention rule matches the snapshot, AWS keeps it there, charged at the same rate as any snapshot. Check your retention rules before you count the saving.",
        },
      ],
    },
    {
      id: "how-amoeba-uses-ebs-snapshots",
      title: "How Amoeba uses snapshots",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " rightsizes block storage on Azure and AWS without any downtime. On AWS, it moves an EC2 instance’s data volumes onto one btrfs pool of gp3\u00a0volumes, sized to your data.",
          ],
        },
        {
          kind: "p",
          text: "Once the switch onto the pool is checked, Amoeba snapshots each old volume. It deletes a volume only after its snapshot is complete, and keeps the snapshot for 7\u00a0days before deleting it too.",
        },
        {
          kind: "p",
          text: "Amoeba deletes only the snapshots it took, never the ones your own policies take. If one of your lifecycle policies targeted an old volume, the deleted-volume rules above apply to its snapshots.",
        },
        {
          kind: "p",
          text: "You pay for both sets of volumes only while the move runs, then for the snapshots while they’re kept. AWS charges them like any snapshot, by the blocks each one stores.",
        },
        {
          kind: "p",
          text: "A volume that a later shrink releases gets no snapshot. Amoeba moves its data onto the pool’s other volumes, then deletes the empty volume.",
        },
        {
          kind: "p",
          text: [
            "The ",
            { a: "Amoeba guide", href: "/amoeba-guide#in-your-aws-account" },
            " lists what Amoeba creates in your AWS account. ",
            { a: "How to shrink an EBS volume", href: "/learn/shrink-ebs-volume" },
            " explains why the old volumes are replaced, and ",
            { a: "EBS cost optimization", href: "/ebs-cost-optimization" },
            " shows Amoeba on AWS end to end.",
          ],
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
      title: "How to shrink an EBS volume",
      where: "Learn",
      href: "/learn/shrink-ebs-volume",
    },
    {
      title: "Azure snapshot pricing: incremental vs full",
      where: "Learn",
      href: "/learn/azure-disk-snapshot-cost",
    },
    {
      title: "Amazon EBS volume types",
      where: "Learn",
      href: "/learn/ebs-volume-types",
    },
    {
      title: "How to check EBS volume usage",
      where: "Learn",
      href: "/learn/check-ebs-volume-usage",
    },
  ],
  relatedTitle: "More on snapshot and volume cost",
};
