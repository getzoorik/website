import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/combine-ebs-volumes/1";
import { figure as figure2 } from "@/features/learn/figures/combine-ebs-volumes/2";

export const article: Article = {
  slug: "combine-ebs-volumes",
  title: "AWS EBS RAID 0, LVM or btrfs: combine EBS volumes",
  meta: "AWS EBS RAID 0, LVM or a btrfs pool: how to combine EBS volumes into one, the commands for each, and what each takes to add a volume or give one back.",
  h1: "How to combine EBS volumes: AWS EBS RAID 0, LVM or a btrfs pool",
  deck: "Three ways to put several EBS volumes under one mount, and what each asks of you when the set of volumes changes.",
  card: "LVM, RAID 0 or a btrfs pool across EBS volumes: the commands, and what adding or removing a volume takes.",
  product: "amoeba",
  hub: "Block storage",
  topic: "AWS block storage",
  versus: ["LVM · RAID 0", "btrfs pool"],
  published: "2026-11-01",
  updated: "2026-11-01",
  author: "sujal",
  cover: "/learn-covers/zoorik-learn-combine-ebs-volumes-1200x630.webp",
  coverAlt:
    "Combine EBS volumes into one: LVM, RAID 0 or a btrfs pool joins EBS volumes under one /data mount",
  short:
    "To combine EBS volumes into one on Linux, you join them in the operating system with LVM, an EBS RAID 0 array built with mdadm, or a btrfs pool. They differ in speed, and most of all in what it takes to add a volume or give one back.",
  sections: [
    {
      id: "combine-ebs-volumes-into-one",
      title: "Why combine EBS volumes into one: a volume never shrinks and has a ceiling",
      blocks: [
        {
          kind: "p",
          text: [
            "Picture ",
            { code: "/data" },
            " on three 500\u00a0GiB gp3\u00a0volumes, sized for a seasonal peak that has passed. The data is back to 600\u00a0GiB. You still pay for all 1,500\u00a0GiB, and 900\u00a0GiB of it is empty.",
          ],
        },
        {
          kind: "p",
          text: "Two volumes can hold that data. So you can empty the third, delete it and pay for 1,000\u00a0GiB, with 400\u00a0GiB still free.",
        },
        {
          kind: "p",
          text: "Whether that takes an unmount, a copy or neither depends on how you joined them.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "h3",
          id: "you-pay-for-every-provisioned-gb-and",
          title: "You pay for every provisioned GB, and a volume can’t shrink",
        },
        {
          kind: "p",
          text: "AWS charges Amazon Elastic Block Store (EBS) volume storage “by the amount of GB you provision per month until you release the storage.”",
        },
        {
          kind: "p",
          text: [
            "The ",
            { a: "EBS pricing calculator", href: "/ebs-and-azure-disk-pricing" },
            " shows what a volume costs a month, and what its empty space costs.",
          ],
        },
        {
          kind: "p",
          text: "Elastic Volumes, AWS’s way to change an attached volume, can increase a volume’s size but not decrease it. In AWS’s words, “You can’t decrease the volume size.”",
        },
        {
          kind: "p",
          text: [
            "That’s why ",
            { a: "shrinking an EBS volume", href: "/learn/shrink-ebs-volume" },
            " takes a copy and a switch.",
          ],
        },
        {
          kind: "h3",
          id: "volumes-and-instances-have-ceilings",
          title: "Volumes and instances have ceilings",
        },
        {
          kind: "p",
          text: [
            "A ",
            { a: "gp3", href: "/learn/glossary/ebs-gp3" },
            " volume runs from 1\u00a0GiB to 64\u00a0TiB. Its price includes 3,000\u00a0IOPS and 125\u00a0MiB/s, and you can provision up to 80,000\u00a0IOPS and 2,000\u00a0MiB/s.",
          ],
        },
        {
          kind: "p",
          text: [
            "A filesystem that needs more has to span several volumes. For speed alone, the other way is a faster ",
            { a: "EBS volume type", href: "/learn/ebs-volume-types" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "The instance has a ceiling too. AWS says not to build an array that exceeds the available bandwidth of your EC2 instance.",
        },
        {
          kind: "p",
          text: "AWS also advises against parity and mirroring. RAID 5 and RAID 6 give 20 to 30 percent fewer usable IOPS than RAID 0. RAID 1 needs more EC2-to-EBS bandwidth without improving writes.",
        },
        {
          kind: "p",
          text: "EBS already replicates each volume’s data within its Availability Zone. So these layouts join volumes for space and speed, not for a second copy.",
        },
      ],
    },
    {
      id: "lvm-vs-raid-0-vs-btrfs-where",
      title: "LVM vs RAID 0 vs btrfs: where the volumes are joined decides what a change takes",
      blocks: [
        {
          kind: "p",
          text: "All three join the volumes inside the instance. AWS says all RAID on EBS “is accomplished at the software level.”",
        },
        { kind: "p", text: "Only btrfs joins them inside the filesystem itself." },
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
      title: "LVM on AWS EBS volumes: growing is easy, giving a volume back needs free extents",
      blocks: [
        {
          kind: "p",
          text: "LVM, the Logical Volume Manager, pools physical volumes (PVs) into a volume group (VG). It then carves logical volumes (LVs) out of the group. Here each PV is a whole EBS volume.",
        },
        {
          kind: "p",
          text: "A linear LV, in Red Hat’s words, lets you “merge multiple physical storage units into one virtual storage space.”",
        },
        { kind: "h3", id: "create-the-logical-volume", title: "Create the logical volume" },
        {
          kind: "p",
          text: [
            "The device names below are examples, so check yours with ",
            { code: "lsblk" },
            ". Red Hat warns that formatting a logical volume erases all data on it. So use new, empty volumes.",
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
          title: "Add a new EBS volume to an existing LVM volume group",
        },
        {
          kind: "p",
          text: "To add a volume, make it a PV and add it to the VG. Then grow the LV and its filesystem in one command. Red Hat’s procedure for this has no unmount step.",
        },
        {
          kind: "code",
          lang: "bash",
          code: "sudo pvcreate /dev/nvme3n1\nsudo vgextend data_vg /dev/nvme3n1\nsudo lvextend --size +<added-size> --resizefs data_vg/data_lv",
        },
        {
          kind: "h3",
          id: "give-a-volume-back-with-pvmove",
          title: "Give a volume back with pvmove",
        },
        {
          kind: "p",
          text: [
            "To give a volume back, ",
            { code: "pvmove" },
            " moves its extents onto the other PVs. Red Hat says data “can be rearranged on disks while the disks are in use.”",
          ],
        },
        {
          kind: "p",
          text: [
            "Next, ",
            { code: "vgreduce" },
            " drops the empty PV from the VG, and ",
            { code: "pvremove" },
            " takes the device out of LVM use. Then you detach and delete the volume in AWS. A deleted volume’s data is gone, so keep a snapshot until you’re sure.",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "sudo pvmove /dev/nvme2n1\nsudo vgreduce data_vg /dev/nvme2n1\nsudo pvremove /dev/nvme2n1",
        },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            { code: "pvmove" },
            " needs free extents on the other PVs, but the LV above, created with ",
            { code: "--extents 100%FREE" },
            ", leaves none. You then have to shrink the filesystem and the LV first.",
          ],
        },
        {
          kind: "p",
          text: [
            "Red Hat’s procedure unmounts the LV, runs ",
            { code: "e2fsck -f" },
            " and then ",
            { code: "lvreduce --resizefs" },
            ". So ext4 shrinks only while unmounted.",
          ],
        },
        {
          kind: "p",
          text: "XFS can’t shrink in any useful way. Red Hat says “XFS does not support reducing the size of a volume formatted with an XFS file system.”",
        },
        {
          kind: "p",
          text: "With XFS on LVM you can swap a volume for another, but the LV never gets smaller. Neither does your cloud cost.",
        },
        {
          kind: "p",
          text: [
            { a: "Shrinking XFS", href: "/learn/shrink-xfs-filesystem" },
            " and ",
            { a: "shrinking ext4 with resize2fs", href: "/learn/resize2fs-shrink-ext4" },
            " have their own pages. So does ",
            { a: "removing a disk from LVM", href: "/learn/remove-disk-from-lvm" },
            ".",
          ],
        },
      ],
    },
    {
      id: "ebs-raid-0-iops-add-up-and",
      title: "EBS RAID 0: IOPS add up, and the set stays fixed",
      blocks: [
        {
          kind: "p",
          text: "AWS’s own RAID 0 steps use mdadm, the Linux software RAID tool. RAID 0 spreads I/O across the volumes in a stripe. In AWS’s words, “If you add a volume, you get the straight addition of throughput and IOPS.”",
        },
        {
          kind: "p",
          text: "A stripe performs only as well as its worst volume. So AWS says to use volumes with identical size and IOPS. It also warns that “the loss of a single volume in the set results in a complete data loss for the array.”",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "Stripe four gp3\u00a0volumes, each with its included 3,000\u00a0IOPS and 125\u00a0MiB/s. The array gets 4 × 3,000 = 12,000\u00a0IOPS and 4 × 125 = 500\u00a0MiB/s before you provision any extra, if the instance can carry it.",
        },
        {
          kind: "p",
          text: "AWS designs gp3 for an annual failure rate no higher than 0.2 percent. If failures are independent, the yearly chance of losing the array is at most 1 − 0.998⁴. That’s about 0.8 percent.",
        },
        { kind: "h3", id: "create-the-raid-0-array", title: "Create the RAID 0 array with mdadm" },
        {
          kind: "p",
          text: [
            "These are AWS’s steps for Amazon Linux. Other distributions may keep ",
            { code: "mdadm.conf" },
            " elsewhere.",
          ],
        },
        {
          kind: "p",
          text: [
            { code: "mdadm --create" },
            " writes its metadata to each volume, and ",
            { code: "mkfs.ext4" },
            " erases the array. So use empty volumes.",
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
        { kind: "h3", id: "why-a-raid-0-set-stays-fixed", title: "Why a RAID 0 set stays fixed" },
        { kind: "p", text: "When you add a volume later, mdadm takes four steps:" },
        {
          kind: "ol",
          items: [
            "It converts the array to RAID 4.",
            "It adds the new volume.",
            "It runs a reshape.",
            "It converts the array back to RAID 0.",
          ],
        },
        { kind: "p", text: "Then you grow the filesystem." },
        {
          kind: "p",
          text: "The mdadm manual warns that fewer devices also means a smaller array. Data in it “could get destroyed and this is not reversible.”",
        },
        { kind: "p", text: "So taking a volume out follows a strict order:" },
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
          text: "Step 1 is an unmounted shrink for ext4, and XFS can’t do it. Treat a RAID 0 set as fixed. When it has to get smaller, copy the data to a new array.",
        },
      ],
    },
    {
      id: "a-btrfs-pool-takes-ebs-volumes-in",
      title: "A btrfs pool takes EBS volumes in and out while mounted",
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
            ": one copy, with no striping. That default dates from btrfs-progs 5.8, and data used ",
            { code: "raid0" },
            " before it.",
          ],
        },
        {
          kind: "p",
          text: [
            "Metadata defaults to ",
            { code: "raid1" },
            ", two copies. Name both profiles on the command line, so the result doesn’t depend on the btrfs-progs version.",
          ],
        },
        {
          kind: "p",
          text: [
            "Check the device names with ",
            { code: "lsblk" },
            " first. ",
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
            " registers the devices with the kernel. You can then mount the pool by naming any one of them.",
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
            "Adding a volume “is instant and does not affect existing data,” in the btrfs documentation’s words. Then ",
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
            " metadata, a pool needs at least two devices. Taking one out of a two-device pool fails with “unable to go below two devices on raid1.”",
          ],
        },
        { kind: "code", lang: "bash", code: "sudo btrfs device remove /dev/nvme2n1 /data" },
        {
          kind: "p",
          text: [
            "Once the command returns, the volume is ready to detach and delete in AWS. ",
            { a: "Removing a device from a btrfs pool", href: "/learn/btrfs-device-remove" },
            " walks through the checks. For the profiles, see ",
            { a: "btrfs on multiple disks", href: "/learn/btrfs-multiple-disks" },
            ".",
          ],
        },
      ],
    },
    {
      id: "ebs-volume-pools-share-snapshot-and-cost",
      title: "EBS volume pools share snapshot and cost rules, so choose by what will change",
      blocks: [
        {
          kind: "p",
          text: [
            "EBS takes a ",
            { a: "snapshot", href: "/learn/glossary/disk-snapshot" },
            " of each volume independently. AWS says restoring a RAID array from snapshots that are out of sync “would degrade the integrity of the array.”",
          ],
        },
        {
          kind: "p",
          text: "AWS’s answer is EBS multi-volume snapshots. They’re crash-consistent across the volumes attached to an instance, and taken without stopping it. An LVM volume group or a btrfs pool needs the same care.",
        },
        {
          kind: "p",
          text: [
            { a: "What those snapshots cost", href: "/learn/ebs-snapshot-cost" },
            " has its own page.",
          ],
        },
        {
          kind: "p",
          text: "AWS charges for each volume, not for the pool. So a detached volume still costs money until you delete it.",
        },
        {
          kind: "p",
          text: [
            "Elastic Volumes can modify a volume up to four times in a rolling 24-hour period. One use is to ",
            { a: "grow it while it stays mounted", href: "/learn/increase-ebs-volume-size" },
            ". Taking a whole volume out is the only way to pay for fewer GB.",
          ],
        },
        { kind: "p", text: "Choose by what you expect to change:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Speed past one gp3\u00a0volume." },
              " If one filesystem needs more than 80,000\u00a0IOPS or 2,000\u00a0MiB/s, first see if ",
              { a: "one io2 Block Express volume", href: "/learn/io2-vs-gp3" },
              " covers it. On a Nitro-based instance, one can be provisioned with up to 256,000\u00a0IOPS and reach 4,000\u00a0MiB/s. If it can’t, use AWS EBS striping: RAID 0, or an LVM striped volume made with ",
              { code: "lvcreate --stripes" },
              ". Then plan the volume set as fixed.",
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
      title: "How Amoeba runs a btrfs pool on EBS",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " optimizes block storage on Azure and AWS. On AWS it builds a btrfs pool like the one above for you, then rightsizes the pool as your data changes.",
          ],
        },
        {
          kind: "h3",
          id: "what-amoeba-does-with-your-volumes",
          title: "What Amoeba does with your volumes",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "The pool." },
              " It moves an instance’s EBS data volumes onto one btrfs pool of gp3\u00a0volumes, sized to your data with room to grow. Each data mount keeps its old path. It never touches the root volume.",
            ],
            [
              { b: "The move." },
              " The services that use those mounts restart once, at the switch onto the pool.",
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
              " Once the switch is checked, Amoeba snapshots and deletes each old volume. It deletes each snapshot 7 days later.",
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
    text: "Amoeba moves an EC2 instance’s EBS data volumes onto one pool sized to your data, then rightsizes it autonomously, without any downtime after the one switch, one volume at a time. We estimate it takes 50–60% off block storage cost. It is an estimated range, not a promise. The free assessment works out your own figure.",
    links: [
      { label: "Block storage cost optimization with Amoeba", href: "/amoeba" },
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
  ],
  related: [
    {
      title: "How to shrink an EBS volume when AWS only lets it grow",
      where: "Learn",
      href: "/learn/shrink-ebs-volume",
    },
    {
      title: "btrfs on multiple disks: how a btrfs pool works",
      where: "Learn",
      href: "/learn/btrfs-multiple-disks",
    },
    {
      title: "btrfs vs LVM: which one can shrink on a cloud VM?",
      where: "Learn",
      href: "/learn/btrfs-vs-lvm",
    },
    {
      title: "How to remove a disk from LVM without losing data",
      where: "Learn",
      href: "/learn/remove-disk-from-lvm",
    },
    {
      title: "btrfs device remove: take a disk out of a btrfs pool",
      where: "Learn",
      href: "/learn/btrfs-device-remove",
    },
  ],
};
