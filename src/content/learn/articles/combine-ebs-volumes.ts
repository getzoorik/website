import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/combine-ebs-volumes/1";

export const article: Article = {
  slug: "combine-ebs-volumes",
  title: "Combine EBS volumes into one: LVM, RAID 0 or btrfs",
  meta: "Combine EBS volumes into one with LVM, RAID 0 or a btrfs pool: the commands for each, and what each asks of you when you add a volume or want one back.",
  h1: "How to combine EBS volumes into one: LVM, RAID 0 or a btrfs pool",
  deck: "Three ways to put several EBS volumes under one mount, and what each asks of you when the set of volumes changes.",
  card: "LVM, RAID 0 or a btrfs pool across EBS volumes: the commands, and what adding or removing a volume takes.",
  product: "amoeba",
  hub: "Block storage",
  topic: "AWS block storage",
  versus: ["LVM · RAID 0", "btrfs pool"],
  published: "2026-11-12",
  updated: "2026-11-12",
  author: "sujal",
  short:
    "To combine EBS volumes into one, you join them inside the instance’s operating system, since AWS says all RAID on Amazon Elastic Block Store (EBS) “is accomplished at the software level.” On Linux there are three common ways: LVM joins them in a logical volume, mdadm RAID 0 stripes them so their IOPS and throughput add up, and btrfs builds one filesystem across them. They differ most when you later add a volume or want one back.",
  sections: [
    {
      id: "why-combine-ebs-volumes-into-one-mount",
      title: "Why combine EBS volumes into one mount",
      blocks: [
        {
          kind: "p",
          text: "A single EBS volume has a ceiling. A gp3\u00a0volume runs from 1\u00a0GiB to 64\u00a0TiB, includes 125\u00a0MiB/s and 3,000\u00a0IOPS in its price, and can be provisioned up to 80,000\u00a0IOPS and 2,000\u00a0MiB/s. A filesystem that needs more than that has to span several volumes or, for speed alone, use a faster volume type.",
        },
        {
          kind: "p",
          text: [
            "The other reason is the bill. EBS charges volume storage “by the amount of GB you provision per month until you release the storage,” and Elastic Volumes, AWS’s way to change an attached volume, can increase its size but not decrease it: “You can’t decrease the volume size.” A volume grown for a peak stays billed at the peak, which is why ",
            { a: "shrinking an EBS volume", href: "/learn/shrink-ebs-volume" },
            " takes a copy and a switch. With several smaller volumes under one mount, you can instead empty one and delete it when the data shrinks, if the layout lets you.",
          ],
        },
        {
          kind: "p",
          text: "The instance sets a second ceiling: AWS says not to build an array that exceeds the available bandwidth of your EC2 instance. AWS also advises against parity and mirroring on EBS. RAID 5 and RAID 6 give 20 to 30 percent fewer usable IOPS than RAID 0, and RAID 1 needs more EC2-to-EBS bandwidth without improving writes. EBS already replicates each volume’s data within its Availability Zone, so the layouts below join volumes for space and speed, not for a second copy.",
        },
      ],
    },
    {
      id: "lvm-raid-0-and-a-btrfs-pool",
      title: "LVM, RAID 0 and a btrfs pool compared",
      blocks: [
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
        { kind: "diagram", figure: figure1 },
        { kind: "p", text: "Choose by what you expect to change:" },
        {
          kind: "ul",
          items: [
            [
              "If one filesystem needs more than a gp3\u00a0volume’s 80,000\u00a0IOPS or 2,000\u00a0MiB/s, first check whether ",
              { a: "one io2 Block Express volume", href: "/learn/io2-vs-gp3" },
              " covers it, since on a Nitro-based instance one can be provisioned with up to 256,000\u00a0IOPS and reach 4,000\u00a0MiB/s. If it doesn’t, use AWS EBS striping (RAID 0, or an LVM striped volume made with ",
              { code: "lvcreate --stripes" },
              ") and plan the volume set as fixed.",
            ],
            "If the data mostly grows and you want to keep ext4 or XFS, use LVM. Giving a volume back later needs free space on the others.",
            "If you expect to add and remove volumes as the data rises and falls, use a btrfs pool. Both operations run while it stays mounted.",
          ],
        },
      ],
    },
    {
      id: "lvm-on-aws-ebs-volumes",
      title: "LVM on AWS EBS volumes",
      blocks: [
        {
          kind: "p",
          text: [
            "LVM, the Logical Volume Manager, pools physical volumes, or PVs, into a volume group, or VG, and carves logical volumes, or LVs, out of it. Here each PV is a whole EBS volume. A linear LV, in Red Hat’s words, lets you “merge multiple physical storage units into one virtual storage space.” The device names below are examples, so check yours with ",
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
          kind: "p",
          text: "To add a volume, make it a PV, add it to the VG, and grow the LV and its filesystem in one command. Red Hat’s procedure for this has no unmount step.",
        },
        {
          kind: "code",
          lang: "bash",
          code: "sudo pvcreate /dev/nvme3n1\nsudo vgextend data_vg /dev/nvme3n1\nsudo lvextend --size +<added-size> --resizefs data_vg/data_lv",
        },
        {
          kind: "p",
          text: [
            "To give a volume back, ",
            { code: "pvmove" },
            " moves its extents onto the other PVs, and Red Hat says data “can be rearranged on disks while the disks are in use.” ",
            { code: "vgreduce" },
            " then drops the empty PV from the VG, and ",
            { code: "pvremove" },
            " takes the device out of LVM use. After that you detach and delete the volume in AWS. A deleted volume’s data is gone, so keep a snapshot until you’re sure.",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "sudo pvmove /dev/nvme2n1\nsudo vgreduce data_vg /dev/nvme2n1\nsudo pvremove /dev/nvme2n1",
        },
        {
          kind: "p",
          text: [
            "The catch is free space. ",
            { code: "pvmove" },
            " needs free extents on the other PVs, and an LV created with ",
            { code: "--extents 100%FREE" },
            " leaves none. You then have to shrink the filesystem and the LV first. Red Hat’s procedure unmounts the LV, runs ",
            { code: "e2fsck -f" },
            " and then ",
            { code: "lvreduce --resizefs" },
            ", so ext4 shrinks only while unmounted. XFS can’t shrink in any useful way: “XFS does not support reducing the size of a volume formatted with an XFS file system.” With XFS on LVM you can swap a volume for another, but the LV never gets smaller, and neither does the bill. The pages on ",
            { a: "removing a disk from LVM", href: "/learn/remove-disk-from-lvm" },
            ", ",
            { a: "shrinking XFS", href: "/learn/shrink-xfs-filesystem" },
            " and ",
            { a: "shrinking ext4 with resize2fs", href: "/learn/resize2fs-shrink-ext4" },
            " go further.",
          ],
        },
      ],
    },
    {
      id: "ebs-raid-0-striping-volumes-with-mdadm",
      title: "EBS RAID 0: striping volumes with mdadm",
      blocks: [
        {
          kind: "p",
          text: "AWS’s own RAID 0 steps use mdadm, the Linux software RAID tool. RAID 0 spreads I/O across the volumes in a stripe, and AWS says “If you add a volume, you get the straight addition of throughput and IOPS.” Each gp3\u00a0volume brings its included baseline of 3,000\u00a0IOPS with 125\u00a0MiB/s, so four gp3\u00a0volumes stripe to 12,000\u00a0IOPS and 500\u00a0MiB/s before you provision any extra, if the instance can carry it.",
        },
        {
          kind: "p",
          text: "A stripe performs only as well as its worst volume, so AWS says to use volumes with identical size and IOPS. And “the loss of a single volume in the set results in a complete data loss for the array.” AWS designs gp3 for an annual failure rate no higher than 0.2 percent. Treating failures as independent, a four-volume array has at most about a 0.8 percent yearly chance (1 − 0.998⁴) of losing everything.",
        },
        {
          kind: "p",
          text: [
            "These are AWS’s steps for Amazon Linux, and other distributions may keep ",
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
            "To mount it at boot, back up ",
            { code: "/etc/fstab" },
            ", add ",
            { code: "LABEL=data_raid /data ext4 defaults,nofail 0 2" },
            " and test with ",
            { code: "sudo mount -a" },
            ", because AWS warns that errors in ",
            { code: "/etc/fstab" },
            " “can render a system unbootable.” Keep the root volume out of the array, since AWS advises against booting from one.",
          ],
        },
        {
          kind: "p",
          text: [
            "To add a volume to the array later, mdadm converts the array to RAID 4, adds the disk, runs a reshape and converts it back, and you then grow the filesystem. To take one out, the mdadm manual warns that fewer devices also means a smaller array, and data in it “could get destroyed and this is not reversible.” So you shrink the filesystem, then the array with ",
            { code: "mdadm --grow --array-size" },
            ", and only then the device count. That’s an unmounted shrink for ext4, and XFS can’t do it. Treat a RAID 0 set as fixed, and copy the data to a new array when it has to get smaller.",
          ],
        },
      ],
    },
    {
      id: "a-btrfs-pool-across-ebs-volumes",
      title: "A btrfs pool across EBS volumes",
      blocks: [
        {
          kind: "p",
          text: "btrfs manages its own devices, so one filesystem can span several. Its documentation says “The device management works on a mounted filesystem,” so adding or removing a volume needs no unmount.",
        },
        {
          kind: "p",
          text: [
            { code: "mkfs.btrfs" },
            " stores data and metadata in profiles. On several devices, data defaults to ",
            { code: "single" },
            ", one copy with no striping (since btrfs-progs 5.8, and ",
            { code: "raid0" },
            " before it), and metadata defaults to ",
            { code: "raid1" },
            ", two copies. Name both on the command line so the result doesn’t depend on the btrfs-progs version. ",
            { code: "mkfs.btrfs" },
            " writes a new filesystem over every device you list. Check the names with ",
            { code: "lsblk" },
            " first.",
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
            " registers the devices with the kernel, so you can mount the pool by naming any one of them. Adding a volume “is instant and does not affect existing data.” ",
            { code: "btrfs device usage" },
            " then shows what each device holds.",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "sudo btrfs device add /dev/nvme4n1 /data\nsudo btrfs device usage /data",
        },
        {
          kind: "p",
          text: "Removing a volume first moves its data onto the rest of the pool, which “can take long as it needs to move all data from the device.”",
        },
        { kind: "code", lang: "bash", code: "sudo btrfs device remove /dev/nvme2n1 /data" },
        {
          kind: "p",
          text: [
            "Removal needs room on the other volumes for that data, and the profiles must still hold. With ",
            { code: "raid1" },
            " metadata a pool needs at least two devices, so taking one out of a two-device pool fails with “unable to go below two devices on raid1.” Once the command returns, the volume is ready to detach and delete in AWS. ",
            { a: "Removing a device from a btrfs pool", href: "/learn/btrfs-device-remove" },
            " walks through the checks, and ",
            { a: "btrfs on multiple disks", href: "/learn/btrfs-multiple-disks" },
            " explains the profiles.",
          ],
        },
      ],
    },
    {
      id: "snapshots-and-billing-for-ebs-volume-pools",
      title: "Snapshots and billing for EBS volume pools",
      blocks: [
        {
          kind: "p",
          text: [
            "EBS snapshots each volume independently, and AWS says restoring a RAID array from snapshots that are out of sync “would degrade the integrity of the array.” Its answer is EBS multi-volume snapshots, crash-consistent across the volumes attached to an instance, without stopping it. An LVM volume group or a btrfs pool needs the same care. ",
            { a: "What those snapshots cost", href: "/learn/ebs-snapshot-cost" },
            " has its own page.",
          ],
        },
        {
          kind: "p",
          text: [
            "Billing follows each volume, not the pool, so a detached volume still costs money until you delete it. Elastic Volumes can modify a volume, for instance to ",
            { a: "grow it while it stays mounted", href: "/learn/increase-ebs-volume-size" },
            ", up to four times in a rolling 24-hour period, but can’t shrink it. Taking a whole volume out is the only way to pay for fewer GB.",
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
            " optimizes block storage on Azure managed disks and Amazon EBS. On AWS it builds the third layout for you, pooling the EBS data volumes of a running EC2 instance onto gp3\u00a0volumes in the instance’s Availability Zone, and never touches the root volume. The pool is one btrfs filesystem that starts on at least 2\u00a0volumes of equal size, with each data mount a subvolume at its old path.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Sizing." },
              " Amoeba sizes the pool from the highest use of the last 7\u00a0days, with room for the largest recent 15-minute rise and at least 10\u00a0GiB free. It then holds the pool inside a target band, 80% to 90% full by default.",
            ],
            [
              { b: "The switch." },
              " The agent copies each data mount onto the pool with rsync while services run. It then stops the systemd services that hold the mounts, mounts the pool’s subvolumes at the old paths and starts the services again. That stop and start is the service interruption, and a retried switch can repeat it.",
            ],
            [
              { b: "Growing." },
              " When the pool’s lowest use over the last 30\u00a0minutes is above its band, or free space falls below the safety floor of 5% of the pool or 10\u00a0GiB, whichever is larger, or would reach it within 30\u00a0minutes, Amoeba grows gp3\u00a0volumes in place, then adds new ones, while the pool stays mounted.",
            ],
            [
              { b: "Shrinking." },
              " Once the move is done and a full 7\u00a0days of data are in, the agent moves one volume’s data onto the others with ",
              { code: "btrfs device remove" },
              ", and Amoeba detaches and deletes the empty volume, which stops its billing. It never does this while the pool is at or above the band’s top edge.",
            ],
          ],
        },
        {
          kind: "p",
          text: "Amoeba works on Windows and Linux instances. The instance needs management by AWS Systems Manager, a Nitro type that exposes EBS as NVMe, and 3 free attachment slots. On Linux it needs systemd, kernel 5.14 or later and btrfs loaded or loadable, and every process that keeps a data mount open has to run as a systemd service. Instances whose OS is in the Red Hat family aren’t moved.",
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
