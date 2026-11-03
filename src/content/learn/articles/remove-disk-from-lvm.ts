import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/remove-disk-from-lvm/1";
import { figure as figure2 } from "@/features/learn/figures/remove-disk-from-lvm/2";

export const article: Article = {
  slug: "remove-disk-from-lvm",
  title: "Remove a disk from LVM in Linux",
  meta: "Remove a disk from LVM in Linux without losing data: pvmove, vgreduce and pvremove while mounted, then delete the cloud disk on Azure or AWS.",
  h1: "Remove a disk from LVM in Linux",
  deck: "Azure and AWS can’t shrink a disk in place, so you reduce block storage cost one whole disk at a time.",
  card: "Move a disk’s data off with pvmove while mounted, then vgreduce, pvremove and the cloud delete.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Linux filesystems",
  published: "2026-11-01",
  updated: "2026-11-03",
  author: "sujal",
  cover: "/learn-covers/zoorik-learn-remove-disk-from-lvm-1200x630.webp",
  coverAlt:
    "Remove a disk from LVM: pvmove moves the leaving disk’s data within the volume group, then the emptied disk leaves",
  short: [
    "Run ",
    { code: "pvmove" },
    " to move the disk’s data onto the other disks in its LVM volume group, then ",
    { code: "vgreduce" },
    " and ",
    { code: "pvremove" },
    ". The filesystem stays mounted throughout. The other disks need enough free space, and you pay for the cloud disk until you delete it.",
  ],
  sections: [
    {
      id: "lvm-empties-the-disk-before-the-cloud",
      title: "What is LVM?",
      blocks: [
        {
          kind: "p",
          text: "LVM stands for Logical Volume Manager: a layer between a Linux server’s disks and its filesystems. Red Hat says it lets you resize and move storage “without stopping applications or unmounting file systems.”",
        },
        { kind: "p", text: "It works in three layers:" },
        {
          kind: "ul",
          items: [
            "A physical volume (PV) is a disk, or a partition, set aside for LVM.",
            "A volume group (VG) pools PVs into one store of space.",
            "A logical volume (LV) is carved out of a VG. It is the device you format with a filesystem, such as ext4 or XFS, and mount.",
          ],
        },
        {
          kind: "p",
          text: "LVM hands out space in extents, which Red Hat calls “the smallest units of space that you can allocate in LVM.” All extents are one size, 4\u00a0MiB by default.",
        },
        {
          kind: "p",
          text: "An LV’s extents can sit on any PV in its VG, and they can move while the LV is in use. Red Hat’s own example is to “empty a hot-swappable disk before removing it.”",
        },
        {
          kind: "p",
          text: [
            "On a cloud VM, removing a whole disk is how you pay for less block storage. Microsoft says shrinking an existing disk “isn’t supported and might result in data loss.” AWS says of EBS: “You can’t decrease the volume size.” See ",
            { a: "shrinking an Azure managed disk", href: "/learn/shrink-azure-managed-disk" },
            " and ",
            { a: "shrinking an EBS volume", href: "/learn/shrink-ebs-volume" },
            ".",
          ],
        },
      ],
    },
    {
      id: "check-that-the-other-disks-have-room",
      title: "Check free space first",
      blocks: [
        {
          kind: "p",
          text: "Take a VM whose data mount sits on LVM across three 512\u00a0GiB data disks: A, B and C. Disk C holds 120\u00a0GiB, and you want it gone while the application runs.",
        },
        { kind: "p", text: "Two commands show whether its data fits on the other disks:" },
        { kind: "code", lang: "bash", code: "sudo pvs\nsudo lvs -a -o +devices" },
        {
          kind: "p",
          text: [
            "In the ",
            { code: "pvs" },
            " output, PSize is each PV’s size and PFree is the free space left on it. A disk’s PSize minus its PFree is what has to move. It fits if the other PVs’ PFree adds up to at least that.",
          ],
        },
        {
          kind: "p",
          text: [
            { code: "lvs -a -o +devices" },
            " lists the devices each LV sits on, so you see which LVs will move.",
          ],
        },
        {
          kind: "callout",
          label: "Worked example",
          text: [
            "Say ",
            { code: "pvs" },
            " lists disk C with a PSize of about 512\u00a0GiB and a PFree of 392\u00a0GiB. Then 512 − 392 = 120\u00a0GiB has to move, so disks A and B need at least 120\u00a0GiB of PFree between them.",
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: "A striped LV is stricter. Red Hat says LVM’s normal allocation policy avoids “placing parallel stripes on the same physical volume.” So free space on a PV that already holds one of its stripes may not count.",
        },
        {
          kind: "p",
          text: [
            "Free space inside a filesystem doesn’t count, since LVM sees extents, not files. If ",
            { a: { code: "lvextend" }, href: "/learn/combine-ebs-volumes" },
            " once gave one LV the whole VG, PFree reads zero on every disk, and the LV must shrink first.",
          ],
        },
      ],
    },
    {
      id: "remove-disk-from-lvm",
      title: "Remove the disk",
      blocks: [
        {
          kind: "p",
          text: [
            "Check the old disk’s device name with ",
            { code: "lsblk" },
            " first: a wrong name moves the wrong data. On an Azure VM with SCSI data disks, this command maps each LUN in the portal to its Linux device:",
          ],
        },
        { kind: "code", lang: "bash", code: "sudo ls -alF /dev/disk/azure/scsi1/" },
        {
          kind: "ol",
          items: [
            [
              { b: "Move the extents." },
              " With no destination named, the VG’s normal allocation rules pick free extents on the other PVs.",
            ],
          ],
        },
        { kind: "code", lang: "bash", code: "sudo pvmove /dev/<old-disk>" },
        {
          kind: "ol",
          start: 2,
          items: [
            [
              { b: "Check that the disk is empty." },
              " In ",
              { code: "pvs" },
              ", its PFree must now equal its PSize. ",
              { code: "vgreduce" },
              " takes empty PVs only.",
            ],
          ],
        },
        { kind: "code", lang: "bash", code: "sudo pvs" },
        {
          kind: "ol",
          start: 3,
          items: [
            [
              { b: "Remove it from the volume group." },
              " Red Hat says ",
              { code: "vgreduce" },
              " “shrinks a volume group’s capacity by removing one or more empty physical volumes.”",
            ],
          ],
        },
        { kind: "code", lang: "bash", code: "sudo vgreduce <vg-name> /dev/<old-disk>" },
        {
          kind: "ol",
          start: 4,
          items: [[{ b: "Release it from LVM" }, " with ", { code: "pvremove" }, "."]],
        },
        { kind: "code", lang: "bash", code: "sudo pvremove /dev/<old-disk>" },
        {
          kind: "p",
          text: [
            { code: "pvmove --abort" },
            " stops the move. If the VM restarts mid-move, run ",
            { code: "pvmove" },
            " again with no PV arguments to resume from the last checkpoint.",
          ],
        },
        {
          kind: "callout",
          label: "For engineers",
          text: [
            { code: "pvmove" },
            " copies each segment through a temporary mirror. When a segment is in sync, it switches the LV to the new location and writes a checkpoint into the VG metadata. To move one LV at a time, name it with ",
            { code: "-n" },
            ".",
          ],
        },
        {
          kind: "h3",
          id: "when-the-disk-is-already-unused",
          title: "If the disk is empty",
        },
        {
          kind: "p",
          text: [
            "A PV that never got any extents needs no move: run ",
            { code: "vgreduce" },
            ", then ",
            { code: "pvremove" },
            ". Check ",
            { code: "pvs" },
            " first, though. An empty PV may be one someone added for a planned expand.",
          ],
        },
      ],
    },
    {
      id: "no-room-on-the-other-disks-pvmove",
      title: "Move to a smaller disk",
      blocks: [
        {
          kind: "p",
          text: "When the other PVs lack free extents, Red Hat’s procedure adds a new PV to the VG and moves the data onto it by name. Only the allocated extents have to fit, so the new disk can be smaller.",
        },
        {
          kind: "p",
          text: "In the example, a new 128\u00a0GiB disk can take disk C’s 120\u00a0GiB, with about 8\u00a0GiB to spare. You pay for both disks until the old one is deleted.",
        },
        {
          kind: "ol",
          items: [[{ b: "Attach the new disk," }, " then make it a PV and add it to the VG."]],
        },
        {
          kind: "code",
          lang: "bash",
          code: "sudo pvcreate /dev/<new-disk>\nsudo vgextend <vg-name> /dev/<new-disk>",
        },
        {
          kind: "ol",
          start: 2,
          items: [
            [
              { b: "Check its PFree" },
              " in ",
              { code: "pvs" },
              ". It must be larger than the old disk’s used extents, with some margin.",
            ],
            [{ b: "Move the extents onto it by name." }],
          ],
        },
        { kind: "code", lang: "bash", code: "sudo pvmove /dev/<old-disk> /dev/<new-disk>" },
        { kind: "ol", start: 4, items: [[{ b: "Take the old disk out" }, " of the VG and LVM."]] },
        {
          kind: "code",
          lang: "bash",
          code: "sudo vgreduce <vg-name> /dev/<old-disk>\nsudo pvremove /dev/<old-disk>",
        },
      ],
    },
    {
      id: "how-to-reduce-lvm-size-in-linux",
      title: "When the LV fills the VG",
      blocks: [
        {
          kind: "p",
          text: [
            "With one LV across the whole VG, ",
            { code: "pvmove" },
            " can only go to a new disk as large as the old one. That saves nothing.",
          ],
        },
        {
          kind: "p",
          text: "So the LV must give extents back first. Say one LV holds all 3 × 512 = 1,536\u00a0GiB, with 300\u00a0GiB of files. To let disk C go, it must shrink under 2 × 512 = 1,024\u00a0GiB.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: [
            { code: "lvreduce" },
            " alone doesn’t reduce what you pay. Red Hat says the extents it frees “are returned to the volume group,” so they stay on the same disks. It only makes room for ",
            { code: "pvmove" },
            ".",
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "“Data stored in the reduced area is lost. Always back up the data and resize the file system before proceeding,” Red Hat warns.",
        },
        {
          kind: "p",
          text: "The filesystem has to shrink with the LV, and not every filesystem can.",
        },
        { kind: "h3", id: "ext4-shrink-it-unmounted", title: "ext4: shrink it unmounted" },
        {
          kind: "p",
          text: "The resize2fs man page says it can “enlarge or shrink an unmounted file system,” but a mounted one can only grow. Pick a new size that fits on the disks you keep. Then stop every service that uses the mount, and run:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "sudo umount /<mount-point>\nsudo e2fsck -f /dev/<vg-name>/<lv-name>\nsudo lvreduce --size <new-size> --resizefs <vg-name>/<lv-name>\nsudo mount /<mount-point>",
        },
        {
          kind: "p",
          text: [
            { code: "--resizefs" },
            " shrinks the filesystem with the LV, so you don’t run resize2fs yourself. With the mount back in use, run the pvmove steps above. ",
            { a: "Shrinking ext4 with resize2fs", href: "/learn/resize2fs-shrink-ext4" },
            " covers the minimum size and the check.",
          ],
        },
        { kind: "h3", id: "xfs-no-supported-shrink", title: "XFS: no supported shrink" },
        {
          kind: "p",
          text: [
            "Red Hat says “XFS does not support reducing the size of a volume formatted with an XFS file system.” The way out is a new, smaller filesystem and a copy, with a stop to switch over. ",
            { a: "Shrinking an XFS filesystem", href: "/learn/shrink-xfs-filesystem" },
            " walks through it.",
          ],
        },
      ],
    },
    {
      id: "detach-and-delete-the-cloud-disk-to",
      title: "Delete the cloud disk",
      blocks: [
        {
          kind: "p",
          text: "Microsoft warns that a detached Azure disk “is not automatically deleted.” On Premium storage, “you will continue to incur storage charges for the disk.”",
        },
        {
          kind: "p",
          text: [
            "AWS says the same of a detached EBS volume: “You must delete a volume to avoid incurring further charges.” The ",
            { a: "EBS and Azure disk pricing", href: "/ebs-and-azure-disk-pricing" },
            " calculator shows what the disk costs a month at list price.",
          ],
        },
        { kind: "h3", id: "before-you-detach", title: "Before you detach" },
        {
          kind: "p",
          text: [
            "Both clouds ask you to unmount a disk before you detach it, and Microsoft asks you to remove its ",
            { code: "/etc/fstab" },
            " references. After ",
            { code: "pvremove" },
            ", the disk has neither. Nothing mounts the disk itself, and the data mount’s fstab line names the LV or its filesystem UUID.",
          ],
        },
        {
          kind: "p",
          text: "Detaching can be undone, since the disk still exists. Deleting can’t, so first match the disk name or volume ID to the device you emptied.",
        },
        { kind: "h3", id: "on-azure", title: "On Azure" },
        {
          kind: "code",
          lang: "bash",
          code: "az vm disk detach -g <resource-group> --vm-name <vm-name> -n <disk-name>\naz disk delete --resource-group <resource-group> --name <disk-name>",
        },
        { kind: "h3", id: "on-aws", title: "On AWS" },
        {
          kind: "p",
          text: [
            "A volume must be detached before you delete it. AWS warns that “after deletion, its data is gone,” so take a snapshot first if you want a way back. Delete once ",
            { code: "describe-volumes" },
            " reads ",
            { code: "available" },
            ":",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "aws ec2 detach-volume --volume-id <volume-id>\naws ec2 describe-volumes --volume-id <volume-id> --query 'Volumes[*].State' --output text\naws ec2 delete-volume --volume-id <volume-id>",
        },
        {
          kind: "p",
          text: [
            "If the volume stays in ",
            { code: "detaching" },
            ", AWS allows Force Detach for a volume you mean to delete. Try a plain detach first: with Force Detach, the instance “doesn’t get an opportunity to flush file system caches or file system metadata.”",
          ],
        },
        {
          kind: "p",
          text: "If a Recycle Bin retention rule matches the volume, AWS keeps it there “instead of being immediately deleted.”",
        },
      ],
    },
    {
      id: "how-amoeba-does-the-same-job-with",
      title: "How Amoeba removes a disk",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " rightsizes block storage on the data disks of running VMs: Azure managed disks and Amazon EBS volumes, on Windows and Linux VMs. It never touches the OS disk or root volume.",
          ],
        },
        {
          kind: "p",
          text: [
            "It moves a VM’s data disks onto one btrfs pool sized to your data, with room to grow. The pool is ",
            {
              a: "one btrfs filesystem across several data disks",
              href: "/learn/btrfs-multiple-disks",
            },
            ", so the volume manager and the filesystem are one layer.",
          ],
        },
        {
          kind: "p",
          text: "Each data mount becomes a subvolume at its old path. A mount on LVM can move too, as long as every disk under it is a cloud data disk.",
        },
        {
          kind: "p",
          text: "Amoeba copies your data while your services run. Then it switches each mount to the pool, with a short restart of the services that use it.",
        },
        {
          kind: "p",
          text: "When your data goes down and stays down, Amoeba shrinks the pool one disk at a time, with no filesystem shrink first:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Drain." },
              " It moves the leaving disk’s data onto the other disks with ",
              { a: { code: "btrfs device remove" }, href: "/learn/btrfs-device-remove" },
              ".",
            ],
            [
              { b: "Delete." },
              " It detaches the empty disk and deletes it, with no snapshot, so you stop paying for it.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "It never removes a disk while the pool is nearly full or growing. The pool stays mounted, so a shrink runs without any downtime. The FAQ answers ",
            { a: "whether a shrink can lose data", href: "/amoeba-faq#can-a-shrink-lose-data" },
            ".",
          ],
        },
      ],
    },
  ],
  help: {
    product: "amoeba",
    text: "Amoeba moves a VM’s data disks onto one pool sized to your data, then rightsizes it autonomously, without any downtime, one disk at a time. We estimate it takes 50–60% off block storage cost. It is an estimated range, not a promise. The free assessment works out your own figure.",
    links: [
      { label: "Block storage optimization with Amoeba", href: "/amoeba" },
      { label: "Estimate your saving", href: "/assessment?p=amoeba" },
    ],
  },
  sources: [
    {
      publisher: "Red Hat",
      title: "“Configuring and managing logical volumes”",
      url: "https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html-single/configuring_and_managing_logical_volumes/index",
      note: " (RHEL 9)",
    },
    {
      publisher: "man7.org",
      title: "“pvmove(8)”",
      url: "https://man7.org/linux/man-pages/man8/pvmove.8.html",
    },
    {
      publisher: "man7.org",
      title: "“resize2fs(8)”",
      url: "https://man7.org/linux/man-pages/man8/resize2fs.8.html",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Add a data disk to Linux VM using the Azure CLI”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/linux/add-disk",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Detach a data disk from a Linux VM”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/linux/detach-disk",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Expand virtual hard disks on a Linux VM”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/linux/expand-disks",
    },
    {
      publisher: "Microsoft Learn",
      title: "“az disk”",
      url: "https://learn.microsoft.com/en-us/cli/azure/disk?view=azure-cli-latest",
      note: " (Azure CLI reference)",
    },
    {
      publisher: "AWS",
      title: "“Modify an Amazon EBS volume using Elastic Volumes operations”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-modify-volume.html",
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
  ],
  related: [
    {
      title: "btrfs vs ext4 vs XFS: which can shrink?",
      where: "Learn",
      href: "/learn/btrfs-vs-lvm",
    },
    {
      title: "btrfs device remove",
      where: "Learn",
      href: "/learn/btrfs-device-remove",
    },
    {
      title: "Shrink ext4 with resize2fs",
      where: "Learn",
      href: "/learn/resize2fs-shrink-ext4",
    },
    {
      title: "How to shrink an EBS volume",
      where: "Learn",
      href: "/learn/shrink-ebs-volume",
    },
    {
      title: "Can you shrink an Azure managed disk?",
      where: "Learn",
      href: "/learn/shrink-azure-managed-disk",
    },
  ],
  relatedTitle: "More on shrinking disks",
};
