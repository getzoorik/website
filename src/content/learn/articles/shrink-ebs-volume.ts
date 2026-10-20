import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/shrink-ebs-volume/1";

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
  published: "2026-10-30",
  updated: "2026-10-30",
  author: "vineet",
  short:
    "You can’t shrink an Amazon Elastic Block Store (EBS) volume in place. Elastic Volumes can make a volume larger, change its type or adjust its performance, but AWS’s own limits say “You can’t decrease the volume size.” To reduce EBS volume size, you create a smaller volume, copy the data across with rsync, move the mount over and delete the old volume. Until you delete it, AWS bills the old size.",
  sections: [
    {
      id: "why-the-size-you-provisioned-stays-on",
      title: "Why the size you provisioned stays on the bill",
      blocks: [
        {
          kind: "p",
          text: "EBS charges for capacity rather than data, and the pricing page says volume storage “is charged by the amount of GB you provision per month until you release the storage.” A 1,000\u00a0GiB volume costs the same whether it holds 900\u00a0GiB or 90\u00a0GiB.",
        },
        {
          kind: "p",
          text: "Volumes grow for ordinary reasons: a bulk import, a log spike, a migration that needed room for a second copy. Elastic Volumes, AWS’s name for changing a volume in place, can increase the size of an attached volume, and on an instance that supports them you don’t detach the volume or restart the instance. You then extend the filesystem to use the new space.",
        },
        {
          kind: "p",
          text: "When the data shrinks again, the provisioned size stays. Detaching the volume doesn’t stop the charge either, because AWS keeps charging for a detached volume’s storage, beyond the Free Tier, until you delete it.",
        },
        {
          kind: "p",
          text: [
            "Before you plan a shrink, measure how full each volume really is from inside the instance, with the steps in ",
            { a: "checking used space on EBS", href: "/learn/check-ebs-volume-usage" },
            ".",
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
          text: "No. An attached EBS volume reaches the instance as a block device, and the filesystem you put on it can place data in any block, including the last ones. Removing the end of the device removes part of the filesystem. Only the operating system running on the instance can move that data away from the end first.",
        },
        {
          kind: "p",
          text: "The Elastic Volumes limitations list is plain about it: “You must increase the volume size. You can’t decrease the volume size.” The same page names the way out, which is to create a smaller volume and migrate the data with an application-level tool such as rsync.",
        },
        {
          kind: "p",
          text: [
            "Two shortcuts look promising and don’t get you there. A volume restored from a snapshot can’t go below the snapshot’s size, because create-volume accepts only “a volume size that is equal to or larger than the snapshot size.” And shrinking the filesystem first doesn’t change what you pay, because the volume under it keeps its provisioned size. Whether a filesystem can shrink at all is its own question, covered on separate pages for ",
            { a: "XFS", href: "/learn/shrink-xfs-filesystem" },
            " and for ",
            { a: "ext4 with resize2fs", href: "/learn/resize2fs-shrink-ext4" },
            ".",
          ],
        },
      ],
    },
    {
      id: "how-to-shrink-an-ebs-volume-copy",
      title: "How to shrink an EBS volume: copy to a smaller one",
      blocks: [
        {
          kind: "p",
          text: [
            "Use this route for a data volume on a Linux instance. In the example the volume is mounted at ",
            { code: "/data" },
            ", and your application keeps running on it through the first copy to a new gp3\u00a0volume.",
          ],
        },
        {
          kind: "p",
          text: [
            "Take a snapshot of the old volume before you start, as AWS recommends before you unmount a volume, to guard against data loss. ",
            { a: "Snapshot storage is billed", href: "/learn/ebs-snapshot-cost" },
            " on the space your data consumes, not on the volume’s size.",
          ],
        },
        { kind: "h3", id: "prepare-the-new-volume", title: "Prepare the new volume" },
        {
          kind: "ol",
          items: [
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
                    ", plus ",
                    { code: "--kms-key-id <key-id>" },
                    " if it uses a customer managed key in AWS Key Management Service (KMS). The CLI accepts a key only with ",
                    { code: "--encrypted" },
                    ".",
                  ],
                },
              ],
            },
            [
              "Attach the new volume to the instance. On the instance, ",
              { code: "lsblk" },
              " lists the disks: the added disk has the size you chose and no mount point. On instances built on the Nitro System it appears as an NVMe device such as ",
              { code: "nvme2n1" },
              ", which can differ from the device name you gave when attaching.",
            ],
            {
              text: [
                "Create a filesystem on the new device and mount it at a temporary path. ",
                { code: "mkfs" },
                " erases whatever is on the device you name, so check the name against ",
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
          start: 5,
          items: [
            {
              text: [
                "Copy the data while the application runs. ",
                { code: "-a" },
                " is archive mode, and ",
                { code: "-H" },
                ", ",
                { code: "-A" },
                " and ",
                { code: "-X" },
                " keep hard links, access control lists (ACLs) and extended attributes, which archive mode leaves out. The trailing slash on ",
                { code: "/data/" },
                " copies the directory’s contents rather than the directory itself.",
              ],
              blocks: [{ kind: "code", lang: "bash", code: "sudo rsync -aHAX /data/ /mnt/new/" }],
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
                " after the first pass. It deletes on the receiving side, so a swapped source and destination would delete from the old volume. The rsync manual suggests a trial run with ",
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
                ", find the new filesystem’s universally unique identifier (UUID) with ",
                { code: "blkid" },
                ", and point the ",
                { code: "/data" },
                " line at it. Keep ",
                { code: "nofail" },
                ", which lets the instance boot even if the volume fails to mount. An error in ",
                { code: "/etc/fstab" },
                " can leave the instance unable to boot, so test with ",
                { code: "mount -a" },
                " before any reboot.",
              ],
              blocks: [
                {
                  kind: "code",
                  lang: "bash",
                  code: "sudo umount /mnt/new\nsudo umount /data\nsudo cp /etc/fstab /etc/fstab.orig\nsudo blkid\n# the /data line in /etc/fstab becomes:\n# UUID=<new-uuid>  /data  xfs  defaults,nofail  0  2\nsudo mount -a",
                },
              ],
            },
            "Start the services again and check that they read and write on the new volume, which ends the downtime.",
          ],
        },
        { kind: "h3", id: "remove-the-old-volume", title: "Remove the old volume" },
        {
          kind: "ol",
          start: 10,
          items: [
            {
              text: [
                "When you trust the new volume, detach the old one and delete it. Step 8 already unmounted it, which AWS requires before a detach. AWS can’t delete a volume while it’s attached, so check that its state reads ",
                { code: "available" },
                " before the delete. AWS says that after deletion the volume’s data is gone, so keep the snapshot until you’re sure.",
              ],
              blocks: [
                {
                  kind: "code",
                  lang: "bash",
                  code: "aws ec2 detach-volume --volume-id <old-volume-id>\naws ec2 describe-volumes --volume-id <old-volume-id> --query 'Volumes[*].State' --output text\naws ec2 delete-volume --volume-id <old-volume-id>",
                },
                {
                  kind: "p",
                  text: "If a Recycle Bin retention rule matches the volume, AWS keeps it in the Recycle Bin instead of deleting it at once.",
                },
              ],
            },
          ],
        },
        { kind: "diagram", figure: figure1 },
      ],
    },
    {
      id: "what-the-copy-costs-you",
      title: "What the copy costs you",
      blocks: [
        { kind: "p", text: "The copy route costs you in four ways:" },
        {
          kind: "ul",
          items: [
            "Downtime from step 6 to step 9, for every service on that mount. rsync’s quick check skips files whose size and modification time match, so the final pass copies only new and changed files, but it still checks every file.",
            "Both volumes on the bill from the moment you create the new one until you delete the old one.",
            "A new fixed size. When the data grows you grow the volume again, and when it shrinks you copy it all again.",
            "More downtime for a root volume. AWS requires you to stop the instance before you detach its root volume, so the whole instance is down, not one mount.",
          ],
        },
        {
          kind: "p",
          text: "Watch performance if the old volume is gp2, because gp2 performance follows size. Its baseline is 3 input/output operations per second (IOPS) per GiB, with a minimum of 100. A 1,000\u00a0GiB gp2\u00a0volume has a 3,000\u00a0IOPS baseline, while a 100\u00a0GiB one has 300 and bursts to 3,000 only while its I/O credits last. gp2 throughput scales too, from 128\u00a0MiB/s at 170\u00a0GiB and below to 250\u00a0MiB/s at 334\u00a0GiB and above.",
        },
        {
          kind: "p",
          text: [
            "gp3 includes 3,000\u00a0IOPS and 125\u00a0MiB/s at any size, so even a small gp3\u00a0volume matches the IOPS baseline of a 1,000\u00a0GiB gp2\u00a0volume. A gp2\u00a0volume larger than 1,000\u00a0GiB has a higher baseline, so if your workload needs it, set ",
            { code: "--iops" },
            " to match when you create the gp3\u00a0volume, and add ",
            { code: "--throughput 250" },
            " if it used gp2’s 250\u00a0MiB/s. AWS also prices gp3 20 percent below gp2 per GiB, which the page ",
            { a: "comparing gp2 and gp3", href: "/learn/gp2-vs-gp3" },
            " covers on its own.",
          ],
        },
      ],
    },
    {
      id: "can-you-resize-an-ebs-volume-with",
      title: "Can you resize an EBS volume with no downtime?",
      blocks: [
        {
          kind: "p",
          text: [
            "In one direction. Increasing the size with Elastic Volumes needs no detach and no restart on a supported instance, and the new size takes effect when the modification reaches the optimizing state, which AWS says usually takes a few seconds. You can modify a volume up to four times in a rolling 24-hour period, each one after the last has completed. The steps for ",
            {
              a: "growing a volume while it stays mounted",
              href: "/learn/increase-ebs-volume-size",
            },
            " have their own page, as does ",
            { a: "what else Elastic Volumes can change", href: "/learn/ebs-elastic-volumes" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "Shrinking has no in-place operation, so it always comes back to a copy and a switch, and the services on that mount stop while the last pass and the remount run.",
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
            " optimizes Azure managed disks and Amazon EBS. On AWS it makes the copy above once inside the instance, then rightsizes the result so the pool stays inside a target band, 80% to 90% full by default.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "The pool." },
              " Amoeba pools the data volumes of a running EC2 instance onto gp3\u00a0volumes in the instance’s Availability Zone, and never touches the root volume. The pool is ",
              { a: "one btrfs filesystem", href: "/learn/combine-ebs-volumes" },
              " that starts on at least 2\u00a0volumes of equal size, sized from the highest use of the last 7\u00a0days with room for the largest recent 15-minute rise and at least 10\u00a0GiB free. Each data mount becomes a subvolume at its old path.",
            ],
            [
              { b: "The copy." },
              " The agent installs through AWS Systems Manager Run Command and copies each mounted filesystem on the data volumes onto the pool with rsync while services run.",
            ],
            [
              { b: "The switch." },
              " The agent stops the systemd services that hold the data mounts open, without killing any process, checks that the final rsync pass has nothing left to copy, and mounts the pool’s subvolumes at the same paths. Then it starts the services again. That stop and start is the service interruption. If the switch fails, the agent restores the original mounts and Amoeba tries again, so services can restart more than once.",
            ],
            [
              { b: "The soak." },
              " It lasts 2\u00a0hours, and a disk error or p99\u00a0disk latency above 1.2 times its level before the switch pauses the move. A move only goes forward. After the soak, Amoeba detaches each source volume, takes an EBS snapshot of it and deletes the volume once the snapshot completes. It deletes each snapshot 7\u00a0days after its volume is deleted.",
            ],
            [
              { b: "After the move." },
              " As data grows, Amoeba grows gp3\u00a0volumes in place, then adds new ones, with the pool mounted. Shrinks can start once a full 7\u00a0days of data are in: the agent moves one volume’s data onto the others with ",
              { code: "btrfs device remove" },
              ", and Amoeba detaches and deletes the empty volume.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "AWS bills you for both sets of volumes until the source volumes are deleted, and then for the snapshots for 7\u00a0days. Shrinks start by themselves in “Auto” and wait for you in “Manual”. Amoeba works on Windows and Linux VMs. On AWS, the instance must be managed by Systems Manager with its SSM agent connected, be a Nitro type that exposes EBS as NVMe, and have 3 free attachment slots. On Linux it needs systemd, kernel 5.14 or later and btrfs loaded or loadable, and every process that keeps a data mount open must run as a systemd service. ",
            {
              a: "The FAQ lists the Linux requirements",
              href: "/amoeba/faq#which-linux-distributions-does-amoeba-support",
            },
            ". On Azure, the same job is in ",
            { a: "shrinking a managed disk", href: "/learn/shrink-azure-managed-disk" },
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
      title: "Amoeba: Azure disk and Amazon EBS cost optimization",
      where: "Amoeba",
      href: "/amoeba",
    },
    {
      title: "How to increase EBS volume size without downtime on Linux",
      where: "Learn",
      href: "/learn/increase-ebs-volume-size",
    },
    {
      title: "How to combine EBS volumes into one: LVM, RAID 0 or a btrfs pool",
      where: "Learn",
      href: "/learn/combine-ebs-volumes",
    },
  ],
};
