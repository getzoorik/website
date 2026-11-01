import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/ebs-snapshot-cost/1";
import { figure as figure2 } from "@/features/learn/figures/ebs-snapshot-cost/2";
import { figure as figure3 } from "@/features/learn/figures/ebs-snapshot-cost/3";

export const article: Article = {
  slug: "ebs-snapshot-cost",
  title: "AWS snapshot pricing: reduce EBS snapshot cost",
  meta: "AWS snapshot pricing explained: what EBS snapshots cost in the standard and archive tiers, why deleting one may not help, and Data Lifecycle Manager policies.",
  h1: "AWS snapshot pricing: what EBS snapshots cost and how to reduce it",
  deck: "What a snapshot is charged for, when the archive tier pays off, and how to find the snapshots nobody will restore.",
  card: "How incremental EBS snapshots are charged, and how to find the old ones nobody will restore.",
  product: "amoeba",
  hub: "Block storage",
  topic: "AWS block storage",
  published: "2026-11-01",
  updated: "2026-11-01",
  author: "pulkit",
  cover: "/learn-covers/zoorik-learn-ebs-snapshot-cost-1200x630.webp",
  coverAlt:
    "EBS snapshot cost: the first snapshot stores all the volume’s data, and later ones store only changes",
  short:
    "AWS snapshot pricing for EBS follows the data each snapshot stores, not its volume’s size, and you pay for that data until you delete the snapshot. At October 2026 list prices in US East (N. Virginia), standard snapshot storage is $0.05 per GB-month and the archive tier $0.0125.",
  sections: [
    {
      id: "ebs-snapshot-cost",
      title: "EBS snapshot cost follows the blocks each snapshot stores",
      blocks: [
        {
          kind: "p",
          text: [
            "Take AWS’s own example. An ",
            { a: "Amazon Elastic Block Store (EBS) volume", href: "/learn/glossary/ebs-volume" },
            " holds 10\u00a0GiB of data. Its first ",
            { a: "snapshot", href: "/learn/glossary/disk-snapshot" },
            ", Snap A, is a full copy of all 10\u00a0GiB.",
          ],
        },
        {
          kind: "p",
          text: "Then 4\u00a0GiB of that data changes. The next snapshot, Snap B, saves only those 4\u00a0GiB and refers back to Snap A for the other 6\u00a0GiB.",
        },
        {
          kind: "p",
          text: "You pay for 14\u00a0GiB in all, and you still need only the newest snapshot to create the whole volume again.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: "Snap B is incremental, like every later snapshot of the same volume. A snapshot is charged for what it holds, while the volume is charged on the size you provision, “until you release the storage.”",
        },
        {
          kind: "p",
          text: "AWS bases snapshot storage on the space your data consumes in Amazon Simple Storage Service (Amazon S3). Because “Amazon EBS does not save empty blocks,” a snapshot is often much smaller than its volume.",
        },
        {
          kind: "p",
          text: "EBS snapshot pricing, at list price in US East (N. Virginia) in October 2026:",
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
      id: "fast-snapshot-restore-and-copies-add-to",
      title: "Fast snapshot restore and copies add to EBS snapshot pricing",
      blocks: [
        { kind: "p", text: "Two charges sit beside storage, and the first can easily outgrow it." },
        {
          kind: "p",
          text: "Fast snapshot restore (FSR) makes a volume created from a snapshot fully initialized at creation, so it delivers its provisioned performance at once.",
        },
        {
          kind: "p",
          text: "You enable FSR per snapshot and per Availability Zone. Each pair is charged for every minute it’s enabled, with a one-hour minimum.",
        },
        {
          kind: "p",
          text: "AWS’s own example puts one snapshot in one zone for 30\u00a0days at $540 (720\u00a0hours at $0.75). Two snapshots in three zones make six pairs, which AWS puts at 6 × $540 = $3,240.",
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "FSR is charged until you disable it, even after the Amazon Data Lifecycle Manager policy that enabled it is deleted or disabled. The pricing page says you “continue to incur charges until you disable FSR on a snapshot.”",
        },
        {
          kind: "p",
          text: "Copies are the other charge. A snapshot copied to another Region is charged for the data transferred across Regions. Then you also pay standard snapshot storage for the copy in the destination Region.",
        },
        {
          kind: "p",
          text: "A copy kept for disaster recovery means you pay for the same data in two Regions.",
        },
      ],
    },
    {
      id: "deleting-an-ebs-snapshot-reduces-cost-only",
      title: "Deleting an EBS snapshot reduces cost only by its unique data",
      blocks: [
        {
          kind: "p",
          text: "Deleting an old snapshot can reduce cost by far less than it seems. AWS removes only the data that no other snapshot references. Blocks that a later snapshot still uses are kept, and their cost moves to that later snapshot.",
        },
        {
          kind: "p",
          text: "Back to AWS’s example: deleting Snap A takes the total from 14\u00a0GiB to 10\u00a0GiB, not to 4\u00a0GiB. Snap A’s 4\u00a0GiB of unique data goes, while the 6\u00a0GiB that Snap B still references stays.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: "Two more rules follow. Data you delete inside the volume doesn’t leave the old snapshots. AWS treats it as unique data of the earlier snapshots until every snapshot that references it is deleted.",
        },
        {
          kind: "p",
          text: "Deleting a volume also has no effect on the snapshots made from it. You go on paying for them after the volume is gone.",
        },
        {
          kind: "p",
          text: [
            "That last rule also works in your favour. A detached ",
            { a: "gp3", href: "/learn/glossary/ebs-gp3" },
            " volume you keep only in case you need its data is charged on its full provisioned size.",
          ],
        },
        {
          kind: "p",
          text: [
            "In US East (N. Virginia) in October 2026, gp3 lists at $0.08 per GB-month. Our ",
            { a: "EBS pricing calculator", href: "/ebs-and-azure-disk-pricing" },
            " shows what such a volume costs a month, and what its empty space costs.",
          ],
        },
        {
          kind: "p",
          text: "Snapshot the volume first, then delete it once you’re sure you won’t need the volume itself. The snapshot goes on at $0.05 per GB-month, for the written blocks alone.",
        },
      ],
    },
    {
      id: "ebs-snapshot-archive-pricing-a-quarter-of",
      title: "EBS snapshot archive pricing: a quarter of the rate for a full copy",
      blocks: [
        {
          kind: "p",
          text: "The archive tier stores a snapshot at $0.0125 per GB-month, a quarter of the standard rate. But it changes what you store. Archiving turns an incremental snapshot into a full snapshot of every block written to the volume when it was taken.",
        },
        {
          kind: "h3",
          id: "archive-tier-terms-a-90-day-minimum",
          title: "Archive tier terms: a 90-day minimum and slow restores",
        },
        {
          kind: "p",
          text: "The terms are strict. You pay for at least 90\u00a0days. If you delete or permanently restore the snapshot sooner, you’re charged for the days left.",
        },
        {
          kind: "p",
          text: "Restoring takes up to 72\u00a0hours, depending on the snapshot’s size. And you can’t create a volume from an archived snapshot until it’s back in the standard tier.",
        },
        { kind: "h3", id: "when-archiving-pays-off", title: "When archiving pays off" },
        {
          kind: "p",
          text: "The archive tier fits the only snapshot of a volume, such as the one you keep when a project ends. A lone snapshot is already full, so archiving doesn’t make it any bigger.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "Take a lone 200\u00a0GB snapshot at the October 2026 US East list prices above. In the standard tier, it costs 200 × $0.05 = $10.00 a month, or $120 a year.",
        },
        {
          kind: "p",
          text: "Archived, it costs 200 × $0.0125 = $2.50 a month, or $30 a year. That’s $90 a year less.",
        },
        {
          kind: "p",
          text: "If you ever restore it, add a one-time 200 × $0.03 = $6. Then add the standard rate for the restored copy, for as long as it stays in the standard tier.",
        },
        { kind: "svg", figure: figure3 },
        { kind: "h3", id: "when-archiving-costs-more", title: "When archiving costs more" },
        {
          kind: "p",
          text: "The archive tier fits a chain of daily snapshots badly. AWS warns that archiving daily incremental snapshots of a single volume “can lead to higher costs” than leaving them in the standard tier.",
        },
        {
          kind: "p",
          text: "The blocks that later snapshots reference stay in the standard tier, now charged to the next snapshot. You pay for the new full copy in the archive tier on top. AWS recommends archiving monthly, quarterly or yearly snapshots instead.",
        },
        {
          kind: "callout",
          label: "For engineers",
          text: [
            "To see what a snapshot would cost in the archive tier, read its ",
            { code: "FullSnapshotSizeInBytes" },
            " from ",
            { code: "describe-snapshots" },
            ". That’s the full size, not the incremental one, so it doesn’t show what the snapshot costs you in the standard tier today.",
          ],
        },
      ],
    },
    {
      id: "set-an-ebs-snapshot-lifecycle-policy-and",
      title: "Set an EBS snapshot lifecycle policy with Amazon Data Lifecycle Manager",
      blocks: [
        {
          kind: "p",
          text: "A lifecycle policy is the part of EBS snapshot cost optimization that keeps working after you’ve cleaned up once. Amazon Data Lifecycle Manager creates, keeps and deletes snapshots on a schedule, so retention stops depending on someone remembering.",
        },
        {
          kind: "p",
          text: "Each policy picks its volumes or instances by tag. A policy holds up to 4 schedules.",
        },
        {
          kind: "h3",
          id: "retention-and-archiving-in-a-policy",
          title: "Retention and archiving in a policy",
        },
        {
          kind: "p",
          text: "Retention is the main setting. Without archiving, each schedule keeps its snapshots by count, from 1 to 1,000, or by age, from 1\u00a0day to 100 years. When a schedule reaches its limit, the oldest snapshot is permanently deleted.",
        },
        {
          kind: "p",
          text: "Seven daily snapshots of a volume hold its data roughly once, plus six days of changes. Keep 30 and they hold it once, plus 29\u00a0days’ worth.",
        },
        {
          kind: "p",
          text: "A schedule can also archive. Its snapshots must be at least 28\u00a0days apart, and it must keep archived ones for at least 90\u00a0days. Only one schedule in a policy can archive, and only in a policy that targets volumes.",
        },
        {
          kind: "h3",
          id: "what-a-lifecycle-policy-leaves-behind",
          title: "What a lifecycle policy leaves behind",
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
      title: "How to find and delete old EBS snapshots",
      blocks: [
        {
          kind: "p",
          text: "To reduce EBS snapshot costs by deleting snapshots, start with the ones whose volume no longer exists. Run the two list commands in every Region you use. They read only the Region your AWS Command Line Interface is set to.",
        },
        {
          kind: "h3",
          id: "1-list-your-snapshots-from-before-a",
          title: "1. List your snapshots from before a date",
        },
        {
          kind: "p",
          text: "This lists the snapshots you own that started before a date, with the volume each one came from:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "aws ec2 describe-snapshots --owner-ids self \\\n    --query \"Snapshots[?(StartTime<='<yyyy-mm-dd>')].[SnapshotId,VolumeId,StartTime,Description]\" \\\n    --output text",
        },
        {
          kind: "h3",
          id: "2-list-the-volumes-that-still-exist",
          title: "2. List the volumes that still exist",
        },
        {
          kind: "code",
          lang: "bash",
          code: 'aws ec2 describe-volumes --query "Volumes[*].VolumeId" --output text',
        },
        {
          kind: "h3",
          id: "3-pick-out-the-snapshots-whose-volume",
          title: "3. Pick out the snapshots whose volume is gone",
        },
        {
          kind: "p",
          text: "A snapshot whose volume ID isn’t in the list from step 2 usually came from a volume that has been deleted.",
        },
        {
          kind: "p",
          text: "Copies are the exception. A snapshot made by a copy carries an arbitrary volume ID, which AWS says you shouldn’t use for any purpose. So a copy can show up here even when its source volume still exists.",
        },
        {
          kind: "h3",
          id: "4-handle-ami-and-aws-backup-snapshots",
          title: "4. Handle AMI and AWS Backup snapshots separately",
        },
        {
          kind: "p",
          text: "Some snapshots can’t be deleted as they are. You can’t delete the root snapshot of a registered Amazon Machine Image (AMI). And deregistering an AMI doesn’t delete its snapshots by default, so you go on paying for them.",
        },
        {
          kind: "p",
          text: [
            "AMI root snapshots carry a description of the form ",
            { code: "Created by CreateImage(<instance-id>) for <ami-id>" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "Snapshots that AWS Backup manages are different again. You delete them as recovery points in AWS Backup, not through EC2.",
        },
        {
          kind: "p",
          text: "Deregistration is permanent. EC2 deletes the AMI, and nothing can launch from it afterwards. To deregister one you no longer need and delete its snapshots in the same step:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "aws ec2 deregister-image --image-id <ami-id> --delete-associated-snapshots",
        },
        { kind: "p", text: "A snapshot that another AMI also uses is kept." },
        { kind: "h3", id: "5-delete-the-rest", title: "5. Delete the rest" },
        {
          kind: "p",
          text: "Deleting a snapshot removes that restore point, so check first that no recovery plan or image build depends on it. Then:",
        },
        { kind: "code", lang: "bash", code: "aws ec2 delete-snapshot --snapshot-id <snapshot-id>" },
        {
          kind: "p",
          text: "If a Recycle Bin retention rule matches the snapshot, AWS keeps it in the Recycle Bin instead of deleting it at once. It’s charged there at the same rate as any snapshot. Check your retention rules before you count on the saving.",
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
            " optimizes block storage on Azure managed disks and Amazon EBS. On AWS it moves an EC2 instance’s data volumes onto one btrfs pool sized to your data, built from gp3\u00a0volumes.",
          ],
        },
        {
          kind: "p",
          text: "Its snapshots come at the end of that move. Once the switch onto the pool is checked, Amoeba snapshots each old volume and deletes the volume. It deletes a volume only after that volume’s snapshot is complete.",
        },
        {
          kind: "p",
          text: "Amoeba keeps each snapshot for a few days, then deletes it too. It deletes only the snapshots it took, so the snapshots your own policies take are left alone.",
        },
        {
          kind: "p",
          text: "You pay for both sets of volumes only while the move runs. Then you pay for the snapshots while they’re kept. AWS charges them like every snapshot above: for the blocks each one stores, not the old volume’s size.",
        },
        {
          kind: "p",
          text: "A volume that a later shrink releases is handled differently. Amoeba first moves its data onto the pool’s other volumes. Then it deletes the empty volume, with no snapshot.",
        },
        {
          kind: "p",
          text: "If one of your lifecycle policies targeted an old volume, the deleted-volume rules above apply to that policy’s snapshots of it.",
        },
        {
          kind: "p",
          text: [
            "What Amoeba creates in your AWS account is listed in the ",
            { a: "Amoeba guide", href: "/amoeba-guide#in-your-aws-account" },
            ". ",
            { a: "How to shrink an EBS volume", href: "/learn/shrink-ebs-volume" },
            " explains why the old volumes are replaced at all. ",
            { a: "EBS cost optimization", href: "/ebs-cost-optimization" },
            " shows Amoeba on AWS end to end.",
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
      title: "EBS volume types: pricing and how to choose",
      where: "Learn",
      href: "/learn/ebs-volume-types",
    },
    {
      title: "How to check EBS volume usage: used space vs paid space",
      where: "Learn",
      href: "/learn/check-ebs-volume-usage",
    },
  ],
};
