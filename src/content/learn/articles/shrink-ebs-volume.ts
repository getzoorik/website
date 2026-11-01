import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/shrink-ebs-volume/1";
import { figure as figure2 } from "@/features/learn/figures/shrink-ebs-volume/2";
import { figure as figure3 } from "@/features/learn/figures/shrink-ebs-volume/3";

export const article: Article = {
  slug: "shrink-ebs-volume",
  title: "How to shrink an EBS volume when it only grows",
  meta: "You can’t shrink an EBS volume in place. How to copy your data to a smaller gp3 volume with rsync, what the switch costs you, and where Amoeba fits.",
  h1: "How to shrink an EBS volume when AWS only lets it grow",
  deck: "An EBS volume’s size only grows. The copy route that works, the downtime it needs, and what changes on gp2.",
  card: "EBS volumes only grow. The copy route to a smaller volume, its downtime, and where Amoeba fits.",
  product: "amoeba",
  hub: "Block storage",
  topic: "AWS block storage",
  published: "2026-11-01",
  updated: "2026-11-01",
  author: "vineet",
  cover: "/learn-covers/zoorik-learn-shrink-ebs-volume-1200x630.webp",
  coverAlt:
    "Shrink an EBS volume: rsync the data to a smaller volume and delete the old one, since until then you pay for both",
  short:
    "You can’t shrink an Amazon Elastic Block Store (EBS) volume in place, so you keep paying for its old size. To reduce EBS volume size, copy the data to a smaller volume with rsync, move the mount and delete the old one.",
  sections: [
    {
      id: "why-you-keep-paying-for-the-size",
      title: "Why you keep paying for the size you provisioned",
      blocks: [
        {
          kind: "p",
          text: "Picture a 1,000\u00a0GiB data volume of gp2, the older General Purpose SSD type, that now holds 90\u00a0GiB. You pay for all 1,000\u00a0GiB, 910 of them empty, while a 100\u00a0GiB volume would hold the data with 10\u00a0GiB to spare.",
        },
        {
          kind: "p",
          text: [
            "An ",
            { a: "EBS volume", href: "/learn/glossary/ebs-volume" },
            " is charged for capacity, not data. Volume storage “is charged by the amount of GB you provision per month until you release the storage,” says the pricing page. The ",
            { a: "EBS pricing calculator", href: "/ebs-and-azure-disk-pricing" },
            " shows what a volume’s empty space costs a month at list price.",
          ],
        },
        {
          kind: "p",
          text: "Volumes grow for ordinary reasons, such as a bulk import. Elastic Volumes, AWS’s name for changing a volume in place, can increase its size, change its type or adjust its performance. You then extend the filesystem to use the new space.",
        },
        {
          kind: "p",
          text: "When the data shrinks again, the provisioned size stays. Detaching the volume doesn’t stop the charge either. AWS keeps charging for a detached volume’s storage, beyond the Free Tier, until you delete it.",
        },
        {
          kind: "p",
          text: [
            "Before you plan a shrink, ",
            { a: "measure how full each volume really is", href: "/learn/check-ebs-volume-usage" },
            " from inside the instance.",
          ],
        },
      ],
    },
    {
      id: "can-you-reduce-ebs-volume-size-in",
      title: "Can you reduce EBS volume size in place?",
      blocks: [
        {
          kind: "p",
          text: "No. An attached EBS volume reaches the instance as a block device. The filesystem on it can place data in any block, including the last ones.",
        },
        {
          kind: "p",
          text: "Removing the end of the device, such as everything past 100\u00a0GiB on the example volume, removes part of the filesystem. Only the operating system on the instance can move data away from the end first.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: "“You must increase the volume size. You can’t decrease the volume size,” says the Elastic Volumes limitations list. The same page names the way out: create a smaller volume and migrate the data with an application-level tool such as rsync.",
        },
        { kind: "p", text: "Two shortcuts look promising and don’t get you there:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Restoring from a snapshot." },
              " A volume restored from a snapshot can’t be smaller than the snapshot. The create-volume command accepts only “a volume size that is equal to or larger than the snapshot size.”",
            ],
            [
              { b: "Shrinking the filesystem first." },
              " It doesn’t change what you pay, because the volume under it keeps its provisioned size. Whether a filesystem can shrink at all has its own pages, for ",
              { a: "XFS", href: "/learn/shrink-xfs-filesystem" },
              " and for ",
              { a: "ext4 with resize2fs", href: "/learn/resize2fs-shrink-ext4" },
              ".",
            ],
          ],
        },
      ],
    },
    {
      id: "shrink-ebs-volume",
      title: "How to shrink an EBS volume: copy to a smaller one",
      blocks: [
        {
          kind: "p",
          text: [
            "Use this route for a data volume on a Linux instance, mounted at ",
            { code: "/data" },
            " in the example.",
          ],
        },
        { kind: "h3", id: "prepare-the-new-volume", title: "Prepare the new volume" },
        {
          kind: "ol",
          items: [
            [
              "Take a snapshot of the old volume, as AWS recommends before you unmount a volume, to guard against data loss. You pay for ",
              { a: "snapshot storage", href: "/learn/ebs-snapshot-cost" },
              " by the space your data uses, not by the volume’s size.",
            ],
            "Choose the new size: the data you measured, plus the headroom you want for growth.",
            {
              text: [
                "Create an empty gp3\u00a0volume in the instance’s Availability Zone, since a volume attaches only to instances in its own zone. The AWS Command Line Interface (CLI) creates gp2 when you leave out ",
                { code: "--volume-type" },
                ", so name the type.",
              ],
              blocks: [
                {
                  kind: "code",
                  lang: "bash",
                  code: "aws ec2 create-volume \\\n    --volume-type gp3 \\\n    --size <new-size-GiB> \\\n    --availability-zone <instance-availability-zone>",
                },
                {
                  kind: "p",
                  text: [
                    "If the old volume is encrypted, add ",
                    { code: "--encrypted" },
                    ". Add ",
                    { code: "--kms-key-id <key-id>" },
                    " too if it uses a customer managed key in AWS Key Management Service (KMS). The CLI accepts a key only with ",
                    { code: "--encrypted" },
                    ".",
                  ],
                },
              ],
            },
            [
              "Attach the new volume to the instance. On the instance, ",
              { code: "lsblk" },
              " shows it with the size you chose and no mount point. On Nitro System instances it appears as an NVMe device such as ",
              { code: "nvme2n1" },
              ", whose name can differ from the one you gave when attaching.",
            ],
            {
              text: [
                "Create a filesystem on the new device and mount it at a temporary path. The ",
                { code: "mkfs" },
                " command erases whatever is on the device you name. Check the name against ",
                { code: "lsblk" },
                " before you run it.",
              ],
              blocks: [
                {
                  kind: "code",
                  lang: "bash",
                  code: "sudo mkfs -t xfs /dev/<new-device>\nsudo mkdir /mnt/new\nsudo mount /dev/<new-device> /mnt/new",
                },
              ],
            },
          ],
        },
        { kind: "h3", id: "copy-then-switch", title: "Copy, then switch" },
        {
          kind: "ol",
          start: 6,
          items: [
            {
              text: [
                "Copy the data while the application runs. In the command, ",
                { code: "-a" },
                " is archive mode. Adding ",
                { code: "-H" },
                ", ",
                { code: "-A" },
                " and ",
                { code: "-X" },
                " keeps hard links, access control lists (ACLs) and extended attributes, which archive mode leaves out.",
              ],
              blocks: [
                { kind: "code", lang: "bash", code: "sudo rsync -aHAX /data/ /mnt/new/" },
                {
                  kind: "p",
                  text: [
                    "The trailing slash on ",
                    { code: "/data/" },
                    " copies the directory’s contents rather than the directory itself.",
                  ],
                },
              ],
            },
            [
              "Stop every service that writes to ",
              { code: "/data" },
              ", which is where the downtime starts.",
            ],
            {
              text: [
                "Run rsync again with ",
                { code: "--delete" },
                ", which removes files from ",
                { code: "/mnt/new" },
                " that were deleted from ",
                { code: "/data" },
                " after the first pass. Because it deletes on the receiving side, a swapped source and destination would delete from the old volume. The rsync manual suggests a trial run with ",
                { code: "--dry-run" },
                " first, and ",
                { code: "-v" },
                " makes that run show what it would do.",
              ],
              blocks: [
                {
                  kind: "code",
                  lang: "bash",
                  code: "sudo rsync -aHAXv --delete --dry-run /data/ /mnt/new/\nsudo rsync -aHAX --delete /data/ /mnt/new/",
                },
              ],
            },
            {
              text: [
                "Move the mount. Unmount both, back up ",
                { code: "/etc/fstab" },
                ", find the new filesystem’s universally unique identifier, or UUID, with ",
                { code: "blkid" },
                ", and point the ",
                { code: "/data" },
                " line at it. Keep ",
                { code: "nofail" },
                ", which lets the instance boot even if the volume fails to mount.",
              ],
              blocks: [
                {
                  kind: "code",
                  lang: "bash",
                  code: "sudo umount /mnt/new\nsudo umount /data\nsudo cp /etc/fstab /etc/fstab.orig\nsudo blkid\n# the /data line in /etc/fstab becomes:\n# UUID=<new-uuid>  /data  xfs  defaults,nofail  0  2\nsudo mount -a",
                },
                {
                  kind: "p",
                  text: [
                    "An error in ",
                    { code: "/etc/fstab" },
                    " can leave the instance unable to boot, so test with ",
                    { code: "mount -a" },
                    " before any reboot.",
                  ],
                },
              ],
            },
            "Start the services again and check that they read and write on the new volume, which ends the downtime.",
          ],
        },
        { kind: "h3", id: "remove-the-old-volume", title: "Remove the old volume" },
        {
          kind: "ol",
          start: 11,
          items: [
            {
              text: "When you trust the new volume, detach the old one. Step 9 already unmounted it, which AWS requires before a detach.",
              blocks: [
                {
                  kind: "code",
                  lang: "bash",
                  code: "aws ec2 detach-volume --volume-id <old-volume-id>",
                },
              ],
            },
            {
              text: [
                "Delete the old volume. AWS can’t delete a volume while it’s attached, so check that its state reads ",
                { code: "available" },
                " first. AWS says a deleted volume’s data is gone. Keep the snapshot until you’re sure.",
              ],
              blocks: [
                {
                  kind: "code",
                  lang: "bash",
                  code: "aws ec2 describe-volumes --volume-id <old-volume-id> --query 'Volumes[*].State' --output text\naws ec2 delete-volume --volume-id <old-volume-id>",
                },
                {
                  kind: "p",
                  text: "If a Recycle Bin retention rule matches the volume, AWS keeps it in the Recycle Bin instead of deleting it at once.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "what-the-copy-costs-you",
      title: "What the copy costs you",
      blocks: [
        { kind: "p", text: "You pay for the copy in four ways:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Downtime." },
              " Every service on that mount is down from step 7 to step 10. The rsync quick check skips files whose size and modification time match. So the final pass copies only new and changed files, but it still checks every file.",
            ],
            [
              { b: "Paying for both." },
              " You pay for both volumes from step 3, where you create the new one, to step 12, where you delete the old one.",
            ],
            [
              { b: "A new fixed size." },
              " When the data grows, you grow the volume again. When it shrinks, you copy it all again.",
            ],
            [
              { b: "More downtime for a root volume." },
              " AWS requires you to stop the instance before you detach its root volume. So the whole instance is down, not one mount.",
            ],
          ],
        },
        { kind: "svg", figure: figure2 },
      ],
    },
    {
      id: "on-gp2-a-smaller-volume-is-a",
      title: "On gp2, a smaller volume is a slower one",
      blocks: [
        {
          kind: "p",
          text: "Watch performance if the old volume is gp2, because gp2 performance follows size. Its baseline is 3 input/output operations per second (IOPS) per GiB, with a minimum of 100. A 1,000\u00a0GiB volume gets 3,000\u00a0IOPS, while a 100\u00a0GiB one gets 300 and bursts to 3,000 only while its I/O credits last.",
        },
        {
          kind: "p",
          text: "Throughput on gp2 scales too, from 128\u00a0MiB/s at 170\u00a0GiB and below to 250\u00a0MiB/s at 334\u00a0GiB and above.",
        },
        {
          kind: "p",
          text: [
            "By contrast, gp3 includes 3,000\u00a0IOPS and 125\u00a0MiB/s at any size. IOPS or throughput above those levels costs extra. AWS also prices gp3 20 percent below gp2 per GiB, as the ",
            { a: "gp2 and gp3 comparison", href: "/learn/gp2-vs-gp3" },
            " explains.",
          ],
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "The example’s 90\u00a0GiB moves from 1,000\u00a0GiB of gp2 to 100\u00a0GiB of gp3. At gp3’s 20 percent smaller price per GiB, storage then costs 100 × 0.8 ÷ 1,000 = 8% of what it did.",
        },
        {
          kind: "p",
          text: "The gp3\u00a0volume keeps the 3,000\u00a0IOPS baseline, where gp2 at that size would get 3 × 100 = 300. Its throughput goes from gp2’s 250\u00a0MiB/s to the 125\u00a0MiB/s that gp3 includes.",
        },
        { kind: "svg", figure: figure3 },
        {
          kind: "callout",
          label: "Rule of thumb",
          text: [
            "A gp2\u00a0volume larger than 1,000\u00a0GiB has a baseline above 3,000 ",
            { a: "IOPS", href: "/learn/glossary/iops" },
            ". If the workload needs that, set ",
            { code: "--iops" },
            " to match on the new gp3\u00a0volume, and add ",
            { code: "--throughput 250" },
            " if it used gp2’s 250\u00a0MiB/s.",
          ],
        },
      ],
    },
    {
      id: "can-you-resize-an-ebs-volume-with",
      title: "Can you resize an EBS volume without any downtime?",
      blocks: [
        {
          kind: "p",
          text: "In one direction. Increasing the size with Elastic Volumes needs no detach and no restart on a supported instance. A size increase takes effect when the modification reaches the optimizing state, which AWS says usually takes a few seconds.",
        },
        {
          kind: "p",
          text: [
            "You can modify a volume up to four times in a rolling 24-hour period, each one after the last has completed. The steps for ",
            {
              a: "growing a volume while it stays mounted",
              href: "/learn/increase-ebs-volume-size",
            },
            " have their own page. So does ",
            { a: "what else Elastic Volumes can change", href: "/learn/ebs-elastic-volumes" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "A shrink always needs the copy, and its downtime from step 7 to step 10.",
        },
      ],
    },
    {
      id: "how-amoeba-rightsizes-ebs-data-volumes",
      title: "How Amoeba rightsizes EBS data volumes",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " optimizes block storage on Azure and AWS. On AWS it makes the copy above once, onto a pool of volumes, then rightsizes that pool autonomously. Amoeba works on the data volumes of running Windows and Linux instances, and never touches the root volume.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "The pool." },
              " Amoeba moves the instance’s EBS data volumes onto one ",
              { a: "btrfs pool", href: "/learn/combine-ebs-volumes" },
              " sized to your data, with room to grow. On AWS the pool uses ",
              { a: "gp3", href: "/learn/glossary/ebs-gp3" },
              " volumes in the instance’s Availability Zone.",
            ],
            [
              { b: "The move." },
              " The services that use those mounts restart once, at the switch onto the pool.",
            ],
            [
              { b: "The old volumes." },
              " Once the switch is checked, Amoeba snapshots each old volume and deletes the volume. Amoeba keeps each snapshot for 7 days, then deletes it too.",
            ],
            [
              { b: "Rightsizing." },
              " Amoeba grows the pool before it fills, and sooner when data arrives fast. When your data goes down and stays down, it shrinks the pool one volume at a time. So you pay for close to what you use.",
            ],
          ],
        },
        {
          kind: "p",
          text: "You pay for both sets of volumes only while the move runs, and then for the snapshots while they’re kept.",
        },
        { kind: "h3", id: "what-the-instance-needs", title: "What the instance needs" },
        {
          kind: "p",
          text: "On AWS, the instance must be managed by AWS Systems Manager, with the SSM agent connected. It must be a Nitro type that exposes EBS as NVMe, with a few free attachment slots for the pool. On Linux, it needs a recent kernel with btrfs, and every service that keeps a data mount open must run under systemd.",
        },
        {
          kind: "p",
          text: [
            { a: "What Amoeba needs on AWS", href: "/amoeba-faq#what-does-amoeba-need-on-aws" },
            " also covers the AWS role Amoeba uses and what that role can do. ",
            { a: "EBS cost optimization", href: "/ebs-cost-optimization" },
            " shows Amoeba on AWS end to end. On Azure, the same job is in ",
            { a: "shrinking an Azure managed disk", href: "/learn/shrink-azure-managed-disk" },
            ".",
          ],
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
      title: "“Modify an Amazon EBS volume using Elastic Volumes operations”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-modify-volume.html",
    },
    { publisher: "AWS", title: "“Amazon EBS pricing”", url: "https://aws.amazon.com/ebs/pricing/" },
    {
      publisher: "AWS CLI Command Reference",
      title: "“create-volume”",
      url: "https://docs.aws.amazon.com/cli/latest/reference/ec2/create-volume.html",
    },
    {
      publisher: "AWS",
      title: "“Make an Amazon EBS volume available for use”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-using-volumes.html",
    },
    {
      publisher: "AWS",
      title: "“Detach an Amazon EBS volume from an Amazon EC2 instance”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-detaching-volume.html",
    },
    {
      publisher: "AWS",
      title: "“Delete an Amazon EBS volume”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-deleting-volume.html",
    },
    {
      publisher: "AWS",
      title: "“Amazon EBS General Purpose SSD volumes”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/general-purpose.html",
    },
    {
      publisher: "man7.org",
      title: "“rsync(1)”",
      url: "https://man7.org/linux/man-pages/man1/rsync.1.html",
    },
  ],
  related: [
    {
      title: "Can you shrink an Azure managed disk?",
      where: "Learn",
      href: "/learn/shrink-azure-managed-disk",
    },
    {
      title: "How to increase EBS volume size without downtime on Linux",
      where: "Learn",
      href: "/learn/increase-ebs-volume-size",
    },
    {
      title: "How to check EBS volume usage: used space vs paid space",
      where: "Learn",
      href: "/learn/check-ebs-volume-usage",
    },
    {
      title: "How to combine EBS volumes into one: LVM, RAID 0 or a btrfs pool",
      where: "Learn",
      href: "/learn/combine-ebs-volumes",
    },
    {
      title: "EBS volume types compared: how to choose one",
      where: "Learn",
      href: "/learn/ebs-volume-types",
    },
  ],
};
