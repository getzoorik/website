import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/combine-ebs-volumes/1";
import { figure as figure2 } from "@/features/learn/figures/combine-ebs-volumes/2";

export const article: Article = {
  slug: "combine-ebs-volumes",
  title: "Combine EBS volumes with LVM (lvextend), RAID 0 or btrfs",
  meta: "Combine EBS volumes into one with LVM and lvextend, an mdadm RAID 0 array or a btrfs pool: the commands, and what giving a volume back takes.",
  h1: "How to combine EBS volumes",
  deck: "The commands for LVM, RAID 0 and btrfs, and what adding a volume or giving one back takes.",
  card: "LVM, RAID 0 or a btrfs pool across EBS volumes: the commands, and what adding or removing a volume takes.",
  product: "amoeba",
  hub: "Block storage",
  topic: "AWS block storage",
  versus: ["LVM · RAID 0", "btrfs pool"],
  published: "2026-11-01",
  updated: "2026-11-03",
  author: "sujal",
  cover: "/learn-covers/zoorik-learn-combine-ebs-volumes-1200x630.webp",
  coverAlt: "LVM, RAID 0 or a btrfs pool joins EBS volumes under one /data mount",
  short:
    "On Linux, join EBS volumes with LVM, an mdadm RAID 0 array or a btrfs pool. All three add up the volumes’ space, and RAID 0 also adds up their IOPS and throughput. They differ in giving a volume back: LVM needs free extents on the others, RAID 0 a new array, and btrfs one command while mounted.",
  sections: [
    {
      id: "combine-ebs-volumes-into-one",
      title: "Why combine volumes",
      blocks: [
        {
          kind: "p",
          text: "An EBS volume can grow but can’t shrink, and one volume has a size and speed ceiling. Joining several volumes into one filesystem lifts the ceiling, and can let you give a volume back when data falls.",
        },
        {
          kind: "h3",
          id: "you-pay-for-every-provisioned-gb-and",
          title: "A volume can’t shrink",
        },
        {
          kind: "p",
          text: [
            "AWS charges for Amazon Elastic Block Store (EBS) storage “by the amount of GB you provision per month until you release the storage.” ",
            { a: "Elastic Volumes", href: "/learn/ebs-elastic-volumes" },
            ", AWS’s way to change an attached volume, can increase its size but not decrease it.",
          ],
        },
        {
          kind: "p",
          text: [
            "Picture ",
            { code: "/data" },
            " on three 500 GiB gp3 volumes, sized for a peak that has passed. The data is back to 600 GiB, so you pay for 900 GiB of empty space.",
          ],
        },
        {
          kind: "p",
          text: "Two volumes can hold that data, so deleting the third leaves 1,000 GiB to pay for. How you joined the volumes decides whether that takes an unmount, a copy or neither.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: [
            "The ",
            { a: "EBS pricing calculator", href: "/ebs-and-azure-disk-pricing" },
            " shows what that empty space costs. With a single volume, ",
            { a: "shrinking an EBS volume", href: "/learn/shrink-ebs-volume" },
            " takes a copy and a switch.",
          ],
        },
        {
          kind: "h3",
          id: "volumes-and-instances-have-ceilings",
          title: "Volume and instance limits",
        },
        {
          kind: "p",
          text: [
            "A ",
            { a: "gp3", href: "/learn/glossary/ebs-gp3" },
            " volume holds 1 GiB to 64 TiB. Its price includes 3,000 IOPS and 125 MiB/s, and you can provision up to 80,000 IOPS and 2,000 MiB/s.",
          ],
        },
        {
          kind: "p",
          text: [
            "A filesystem that needs more has to span several volumes. For speed alone, a faster ",
            { a: "EBS volume type", href: "/learn/ebs-volume-types" },
            " is the other option.",
          ],
        },
        {
          kind: "p",
          text: "The instance has a ceiling too. AWS says not to build an array that exceeds the available bandwidth of your EC2 instance.",
        },
        {
          kind: "p",
          text: "AWS advises against parity and mirroring on EBS. RAID 5 and RAID 6 give 20 to 30 percent fewer usable IOPS than RAID 0. RAID 1 needs more EC2-to-EBS bandwidth and doesn’t speed up writes.",
        },
        {
          kind: "p",
          text: "EBS already replicates each volume’s data within its Availability Zone. So these layouts join volumes for space and speed, not for a second copy.",
        },
      ],
    },
    {
      id: "lvm-vs-raid-0-vs-btrfs-where",
      title: "LVM vs RAID 0 vs btrfs",
      blocks: [
        {
          kind: "p",
          text: "All three join the volumes inside the instance: AWS says all RAID on EBS “is accomplished at the software level.” LVM and RAID 0 add a layer under the filesystem. Only btrfs joins the volumes inside the filesystem itself.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "table",
          columns: [
            { label: "", width: "14%" },
            { label: "LVM (linear logical volume)", width: "26%" },
            { label: "mdadm RAID 0", width: "31%" },
            { label: "btrfs pool", width: "29%" },
          ],
          rows: [
            [
              "What joins the volumes",
              "A volume group, then a logical volume",
              "A striped md device",
              "The filesystem itself",
            ],
            ["Filesystem on top", "ext4 or XFS", "Your choice (AWS shows ext4)", "btrfs"],
            [
              "Performance",
              "Space adds up, I/O isn’t striped",
              "IOPS and throughput add up, held to the slowest volume and the instance",
              [{ code: "single" }, " data isn’t striped, ", { code: "raid0" }, " data is"],
            ],
            [
              "Copies of your data",
              "One",
              "One, and losing any volume loses the array",
              ["One with ", { code: "single" }, " data, metadata twice with ", { code: "raid1" }],
            ],
            [
              "Add a volume",
              [{ code: "vgextend" }, ", then ", { code: "lvextend --resizefs" }],
              "A reshape through RAID 4, then grow the filesystem",
              [{ code: "btrfs device add" }, ", instant, while mounted"],
            ],
            [
              "Give a volume back",
              [{ code: "pvmove" }, " while in use, if the other volumes have free extents"],
              "Shrink the filesystem, then an irreversible reshape",
              [{ code: "btrfs device remove" }, " while mounted, if the rest has room"],
            ],
            [
              "Shrink the filesystem",
              "ext4 only unmounted, XFS not in any useful way",
              "Same as LVM",
              "Not needed to remove a device",
            ],
          ],
        },
      ],
    },
    {
      id: "lvm-on-aws-ebs-volumes-growing-is",
      title: "LVM on EBS",
      blocks: [
        {
          kind: "p",
          text: "LVM, the Logical Volume Manager, pools physical volumes (PVs) into a volume group (VG). It then carves logical volumes (LVs) out of the group. Here each PV is a whole EBS volume.",
        },
        { kind: "h3", id: "create-the-logical-volume", title: "Create the logical volume" },
        {
          kind: "p",
          text: [
            "The device names below are examples, so check yours with ",
            { code: "lsblk" },
            ". Red Hat warns that formatting a logical volume erases all data on it, so use new, empty volumes.",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "sudo pvcreate /dev/nvme1n1 /dev/nvme2n1\nsudo vgcreate data_vg /dev/nvme1n1 /dev/nvme2n1\nsudo lvcreate --extents 100%FREE --name data_lv data_vg\nsudo mkfs.ext4 -L data /dev/data_vg/data_lv\nsudo mkdir -p /data\nsudo mount LABEL=data /data",
        },
        {
          kind: "h3",
          id: "add-a-volume-to-the-volume-group",
          title: "Add a volume with lvextend",
        },
        {
          kind: "p",
          text: [
            "Make the new volume a PV and add it to the volume group with ",
            { code: "vgextend" },
            ". Then the ",
            { code: "lvextend" },
            " command grows the LV and its filesystem in one step, with no unmount.",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "sudo pvcreate /dev/nvme3n1\nsudo vgextend data_vg /dev/nvme3n1\nsudo lvextend --extents +100%FREE --resizefs data_vg/data_lv",
        },
        {
          kind: "p",
          text: [
            { code: "--extents +100%FREE" },
            " adds all the free space left in the volume group, here the whole new volume. ",
            { code: "--resizefs" },
            " grows the filesystem with the LV. The short form is ",
            { code: "lvextend -l +100%FREE -r data_vg/data_lv" },
            ".",
          ],
        },
        {
          kind: "h3",
          id: "give-a-volume-back-with-pvmove",
          title: "Give a volume back with pvmove",
        },
        {
          kind: "p",
          text: [
            { code: "pvmove" },
            " moves a volume’s extents onto the other PVs. Red Hat says data “can be rearranged on disks while the disks are in use.” Then ",
            { code: "vgreduce" },
            " drops the empty PV from the VG, and ",
            { code: "pvremove" },
            " takes it out of LVM use.",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "sudo pvmove /dev/nvme2n1\nsudo vgreduce data_vg /dev/nvme2n1\nsudo pvremove /dev/nvme2n1",
        },
        {
          kind: "p",
          text: "Then detach and delete the volume in AWS. A deleted volume’s data is gone, so keep a snapshot until you’re sure.",
        },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            { code: "pvmove" },
            " needs free extents on the other PVs, and ",
            { code: "100%FREE" },
            " leaves none. Growing the LV by a smaller ",
            { code: "--size" },
            " keeps some free. Otherwise, shrink the filesystem and the LV first.",
          ],
        },
        {
          kind: "p",
          text: [
            "Red Hat’s shrink procedure unmounts the LV, runs ",
            { code: "e2fsck -f" },
            " and then ",
            { code: "lvreduce --resizefs" },
            ". So ext4 shrinks only while unmounted.",
          ],
        },
        {
          kind: "p",
          text: "XFS can’t shrink in any useful way. Red Hat says “XFS does not support reducing the size of a volume formatted with an XFS file system.” With XFS on LVM you can swap one volume for another, but the LV never gets smaller, and neither does its cost.",
        },
        {
          kind: "p",
          text: [
            { a: "Shrinking XFS", href: "/learn/shrink-xfs-filesystem" },
            ", ",
            { a: "shrinking ext4 with resize2fs", href: "/learn/resize2fs-shrink-ext4" },
            " and ",
            { a: "removing a disk from LVM", href: "/learn/remove-disk-from-lvm" },
            " each have their own page.",
          ],
        },
      ],
    },
    {
      id: "ebs-raid-0-iops-add-up-and",
      title: "RAID 0 on EBS",
      blocks: [
        {
          kind: "p",
          text: "AWS’s RAID 0 steps use mdadm, the Linux software RAID tool. RAID 0 spreads I/O across the volumes in a stripe. In AWS’s words, “If you add a volume, you get the straight addition of throughput and IOPS.”",
        },
        {
          kind: "p",
          text: "A stripe is only as fast as its slowest volume, so AWS says to use volumes with identical size and IOPS. It also warns that “the loss of a single volume in the set results in a complete data loss for the array.”",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "Stripe four gp3 volumes, each with its included 3,000 IOPS and 125 MiB/s. The array gets 4 × 3,000 = 12,000 IOPS and 4 × 125 = 500 MiB/s before you provision any extra, if the instance can carry it.",
        },
        {
          kind: "p",
          text: "AWS designs gp3 for an annual failure rate of 0.1 to 0.2 percent. If failures are independent, the yearly chance of losing that array is at most 1 − 0.998⁴, about 0.8 percent.",
        },
        { kind: "h3", id: "create-the-raid-0-array", title: "Create the array with mdadm" },
        {
          kind: "p",
          text: [
            "These are AWS’s steps for Amazon Linux. Other distributions may keep ",
            { code: "mdadm.conf" },
            " elsewhere. ",
            { code: "mdadm --create" },
            " writes its metadata to each volume and ",
            { code: "mkfs.ext4" },
            " erases the array, so use empty volumes.",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "sudo mdadm --create --verbose /dev/md0 --level=0 --name=data_raid --raid-devices=2 /dev/nvme1n1 /dev/nvme2n1\nsudo mkfs.ext4 -L data_raid /dev/md0\nsudo mdadm --detail --scan | sudo tee -a /etc/mdadm.conf\nsudo dracut -H -f /boot/initramfs-$(uname -r).img $(uname -r)\nsudo mkdir -p /data\nsudo mount LABEL=data_raid /data",
        },
        {
          kind: "p",
          text: [
            "To mount it at boot, edit ",
            { code: "/etc/fstab" },
            " with care. AWS warns that errors in that file “can render a system unbootable.”",
          ],
        },
        {
          kind: "ul",
          items: [
            ["Back up ", { code: "/etc/fstab" }, " first."],
            ["Add the line ", { code: "LABEL=data_raid /data ext4 defaults,nofail 0 2" }, "."],
            ["Test it with ", { code: "sudo mount -a" }, "."],
          ],
        },
        {
          kind: "p",
          text: "Keep the root volume out of the array. AWS advises against booting from one.",
        },
        { kind: "h3", id: "why-a-raid-0-set-stays-fixed", title: "Why the set stays fixed" },
        {
          kind: "p",
          text: "To add a volume later, mdadm converts the array to RAID 4, adds the volume, reshapes, and converts back to RAID 0. Then you grow the filesystem.",
        },
        {
          kind: "p",
          text: "Taking a volume out is riskier. With fewer devices, the mdadm manual warns, data “could get destroyed and this is not reversible.” So the order is strict:",
        },
        {
          kind: "ol",
          items: [
            "Shrink the filesystem.",
            ["Shrink the array with ", { code: "mdadm --grow --array-size" }, "."],
            "Only then reduce the device count.",
          ],
        },
        {
          kind: "p",
          text: "Step 1 needs an unmount for ext4, and XFS can’t do it. So treat a RAID 0 set as fixed. To make it smaller, copy the data to a new array.",
        },
      ],
    },
    {
      id: "a-btrfs-pool-takes-ebs-volumes-in",
      title: "A btrfs pool on EBS",
      blocks: [
        {
          kind: "p",
          text: "btrfs manages its own devices, so one filesystem can span several. Its documentation says “The device management works on a mounted filesystem,” so adding or removing a volume needs no unmount.",
        },
        { kind: "h3", id: "create-the-pool", title: "Create the pool" },
        {
          kind: "p",
          text: [
            { code: "mkfs.btrfs" },
            " stores data and metadata in profiles. On several devices, data defaults to ",
            { code: "single" },
            ", one copy with no striping, since btrfs-progs 5.8. Before that, it was ",
            { code: "raid0" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "Metadata defaults to ",
            { code: "raid1" },
            ", two copies. Name both profiles on the command line, so the result doesn’t depend on the version. Check the device names with ",
            { code: "lsblk" },
            " first: ",
            { code: "mkfs.btrfs" },
            " writes a new filesystem over every device you list.",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "sudo mkfs.btrfs -L data -d single -m raid1 /dev/nvme1n1 /dev/nvme2n1 /dev/nvme3n1\nsudo btrfs device scan\nsudo mkdir -p /data\nsudo mount /dev/nvme1n1 /data",
        },
        {
          kind: "p",
          text: [
            { code: "btrfs device scan" },
            " registers the devices with the kernel, so you can mount the pool by naming any one of them.",
          ],
        },
        {
          kind: "h3",
          id: "add-a-volume-with-btrfs-device-add",
          title: "Add a volume with btrfs device add",
        },
        {
          kind: "p",
          text: [
            "Adding a volume “is instant and does not affect existing data,” the btrfs documentation says. Then ",
            { code: "btrfs device usage" },
            " shows what each device holds.",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "sudo btrfs device add /dev/nvme4n1 /data\nsudo btrfs device usage /data",
        },
        {
          kind: "h3",
          id: "give-a-volume-back-with-btrfs-device",
          title: "Give a volume back with btrfs device remove",
        },
        {
          kind: "p",
          text: "Removing a volume first moves its data onto the rest of the pool. The documentation warns this “can take long as it needs to move all data from the device.”",
        },
        {
          kind: "p",
          text: [
            "So the other volumes need room for that data, and the profiles must still hold. With ",
            { code: "raid1" },
            " metadata, a pool needs at least two devices. Removing one from a two-device pool fails with “unable to go below two devices on raid1.”",
          ],
        },
        { kind: "code", lang: "bash", code: "sudo btrfs device remove /dev/nvme2n1 /data" },
        {
          kind: "p",
          text: [
            "When the command returns, detach and delete the volume in AWS. ",
            { a: "Removing a device from a btrfs pool", href: "/learn/btrfs-device-remove" },
            " walks through the checks, and ",
            { a: "btrfs on multiple disks", href: "/learn/btrfs-multiple-disks" },
            " covers the profiles.",
          ],
        },
      ],
    },
    {
      id: "ebs-volume-pools-share-snapshot-and-cost",
      title: "Snapshots and cost",
      blocks: [
        {
          kind: "p",
          text: [
            "EBS takes a ",
            { a: "snapshot", href: "/learn/glossary/disk-snapshot" },
            " of each volume on its own. AWS warns that restoring a RAID array from snapshots that are out of sync “would degrade the integrity of the array.”",
          ],
        },
        {
          kind: "p",
          text: [
            "Use EBS multi-volume snapshots instead. They’re crash-consistent across the volumes attached to an instance, and you don’t have to stop it. An LVM volume group or a btrfs pool needs the same care. ",
            { a: "What those snapshots cost", href: "/learn/ebs-snapshot-cost" },
            " has its own page.",
          ],
        },
        {
          kind: "p",
          text: [
            "AWS charges for each volume, not for the pool, so a detached volume costs money until you delete it. Elastic Volumes can ",
            { a: "grow a volume while it stays mounted", href: "/learn/increase-ebs-volume-size" },
            ", up to four times in a rolling 24-hour period. Only removing a whole volume makes you pay for fewer GB.",
          ],
        },
        { kind: "h3", id: "which-one-to-choose", title: "Which one to choose" },
        {
          kind: "ul",
          items: [
            [
              { b: "Speed past one gp3 volume." },
              " Above 80,000 IOPS or 2,000 MiB/s, first check ",
              { a: "one io2 Block Express volume", href: "/learn/io2-vs-gp3" },
              ". On a Nitro-based instance, it can be provisioned with up to 256,000 IOPS and reach 4,000 MiB/s. If one volume can’t cover it, stripe with RAID 0 or ",
              { code: "lvcreate --stripes" },
              ", and plan the set as fixed.",
            ],
            [
              { b: "Data that mostly grows." },
              " Use LVM to keep ext4 or XFS. Giving a volume back later needs free extents on the others.",
            ],
            [
              { b: "Data that rises and falls." },
              " Use a btrfs pool, which adds and removes volumes while it stays mounted.",
            ],
          ],
        },
      ],
    },
    {
      id: "how-amoeba-runs-a-btrfs-pool-on",
      title: "How Amoeba runs a btrfs pool",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " optimizes block storage on Azure and AWS. On AWS it builds a btrfs pool of EBS volumes for you, then rightsizes it without any downtime as your data changes.",
          ],
        },
        {
          kind: "h3",
          id: "what-amoeba-does-with-your-volumes",
          title: "What Amoeba does",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "The pool." },
              " It moves an instance’s EBS data volumes onto one btrfs pool of gp3 volumes, sized to your data with room to grow. Each data mount keeps its old path. It never touches the root volume.",
            ],
            [
              { b: "The move." },
              " Amoeba copies your data while your services run. Then it switches each mount to the pool, with a short restart of the services that use it.",
            ],
            [
              { b: "Growing." },
              " It grows the pool before it fills, and sooner when data arrives fast. It enlarges the pool’s volumes or adds new ones while the pool stays mounted.",
            ],
            [
              { b: "Shrinking." },
              " When your data goes down and stays down, it empties one volume with ",
              { code: "btrfs device remove" },
              ", then detaches and deletes it. So you pay for close to what you use.",
            ],
            [
              { b: "The old volumes." },
              " Once the switch is checked, Amoeba snapshots and deletes each old volume. It keeps each snapshot for 7 days, then deletes it too.",
            ],
          ],
        },
        { kind: "h3", id: "what-an-instance-needs", title: "What an instance needs" },
        {
          kind: "p",
          text: "Amoeba works on Windows and Linux instances. On AWS, the instance must be managed by AWS Systems Manager, and be a Nitro type that exposes EBS as NVMe. It also needs a few free attachment slots for the pool.",
        },
        {
          kind: "p",
          text: "On Linux, the instance needs a recent kernel with btrfs. Every service that keeps a data mount open must run under systemd.",
        },
        {
          kind: "p",
          text: [
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
    {
      publisher: "AWS",
      title: "“Amazon EBS and RAID configuration”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/raid-config.html",
    },
    {
      publisher: "AWS",
      title: "“Amazon EBS volume types”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html",
    },
    {
      publisher: "AWS",
      title: "“Modify an Amazon EBS volume using Elastic Volumes operations”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-modify-volume.html",
    },
    { publisher: "AWS", title: "“Amazon EBS pricing”", url: "https://aws.amazon.com/ebs/pricing/" },
    {
      publisher: "Red Hat",
      title: "“Configuring and managing logical volumes”",
      url: "https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html-single/configuring_and_managing_logical_volumes/index",
      note: " (RHEL 9)",
    },
    {
      publisher: "man7.org",
      title: "“mdadm(8)”",
      url: "https://man7.org/linux/man-pages/man8/mdadm.8.html",
    },
    {
      publisher: "btrfs documentation",
      title: "“mkfs.btrfs(8)”",
      url: "https://btrfs.readthedocs.io/en/latest/mkfs.btrfs.html",
    },
    {
      publisher: "btrfs documentation",
      title: "“btrfs-device(8)”",
      url: "https://btrfs.readthedocs.io/en/latest/btrfs-device.html",
    },
    {
      publisher: "man7.org",
      title: "“lvextend(8)”",
      url: "https://man7.org/linux/man-pages/man8/lvextend.8.html",
    },
  ],
  related: [
    {
      title: "How to shrink an EBS volume",
      where: "Learn",
      href: "/learn/shrink-ebs-volume",
    },
    {
      title: "btrfs on multiple disks: single or RAID 1",
      where: "Learn",
      href: "/learn/btrfs-multiple-disks",
    },
    {
      title: "btrfs vs ext4 vs XFS: which can shrink?",
      where: "Learn",
      href: "/learn/btrfs-vs-lvm",
    },
    {
      title: "Remove a disk from LVM in Linux",
      where: "Learn",
      href: "/learn/remove-disk-from-lvm",
    },
    {
      title: "btrfs device remove",
      where: "Learn",
      href: "/learn/btrfs-device-remove",
    },
  ],
  relatedTitle: "More on btrfs, LVM and EBS",
};
