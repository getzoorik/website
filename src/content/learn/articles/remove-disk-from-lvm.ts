import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/remove-disk-from-lvm/1";
import { figure as figure2 } from "@/features/learn/figures/remove-disk-from-lvm/2";

export const article: Article = {
  slug: "remove-disk-from-lvm",
  title: "Remove a disk from LVM without losing data",
  meta: "Remove a disk from LVM without losing data: pvmove, vgreduce and pvremove while mounted, lvreduce when the LV fills the VG, and the cloud delete.",
  h1: "How to remove a disk from LVM without losing data",
  deck: "Move its extents with pvmove, take it out of the volume group, then detach and delete the cloud disk.",
  card: "pvmove, vgreduce and pvremove while mounted, the case where the other disks are full, and the cloud delete.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Linux filesystems",
  published: "2026-11-01",
  updated: "2026-11-01",
  author: "sujal",
  cover: "/learn-covers/zoorik-learn-remove-disk-from-lvm-1200x630.webp",
  coverAlt:
    "Remove a disk from LVM: pvmove moves its data within the volume group, then the emptied disk leaves",
  short: [
    "To remove a disk from LVM without losing data, empty it with ",
    { code: "pvmove" },
    ", then run ",
    { code: "vgreduce" },
    " and ",
    { code: "pvremove" },
    ", all while the filesystem stays mounted. The other disks need room for its extents, and you pay for the cloud disk until you detach and delete it.",
  ],
  sections: [
    {
      id: "lvm-empties-the-disk-before-the-cloud",
      title: "LVM empties the disk before the cloud deletes it",
      blocks: [
        {
          kind: "p",
          text: "Picture a VM whose data mount sits on an LVM volume. The volume spans three 512\u00a0GiB data disks, A, B and C, with 120\u00a0GiB of it on disk C.",
        },
        {
          kind: "p",
          text: "You want disk C gone while the application runs. You pay for disk C until you delete it.",
        },
        {
          kind: "h3",
          id: "how-lvm-works-physical-volumes-volume-groups",
          title: "How LVM works: physical volumes, volume groups and extents",
        },
        { kind: "p", text: "The Logical Volume Manager (LVM) builds storage in three layers:" },
        {
          kind: "ul",
          items: [
            "Each disk becomes a physical volume (PV).",
            "PVs join a volume group (VG).",
            "You carve logical volumes (LVs) out of the VG, then put a filesystem such as ext4 or XFS on each LV.",
          ],
        },
        {
          kind: "p",
          text: "LVM hands out space in extents. Red Hat calls them “the smallest units of space that you can allocate in LVM.”",
        },
        {
          kind: "p",
          text: "Extents are all the same size, 4\u00a0MiB each by default. An LV is a list of extents that can sit on any PV in the group.",
        },
        {
          kind: "p",
          text: "Removing disk C means moving its 120\u00a0GiB of extents into free extents on disks A and B. The mount stays in use the whole time. Then LVM lets go of the disk at each layer.",
        },
        {
          kind: "p",
          text: "Red Hat’s guide treats the move as routine: “Data can be rearranged on disks while the disks are in use.” Its example is to “empty a hot-swappable disk before removing it.”",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: [
            "Azure won’t ",
            { a: "shrink a disk in place", href: "/learn/shrink-azure-managed-disk" },
            ". Microsoft says shrinking an existing disk “isn’t supported and might result in data loss.”",
          ],
        },
        {
          kind: "p",
          text: [
            "AWS won’t shrink an EBS volume in place either, as ",
            { a: "shrinking an EBS volume", href: "/learn/shrink-ebs-volume" },
            " explains. So the unit you can stop paying for is a whole disk, and LVM’s job here is to empty one.",
          ],
        },
      ],
    },
    {
      id: "check-that-the-other-disks-have-room",
      title: "Check with pvs that the other disks have room first",
      blocks: [
        { kind: "p", text: "Two commands show whether the move fits:" },
        { kind: "code", lang: "bash", code: "sudo pvs\nsudo lvs -a -o +devices" },
        {
          kind: "p",
          text: [
            "In the ",
            { code: "pvs" },
            " output, PSize is each PV’s size. PFree is, in Red Hat’s words, “Free space remaining on the physical volume.”",
          ],
        },
        {
          kind: "p",
          text: "For the disk you’re removing, PSize minus PFree is what has to move. Add up the PFree of the PVs that stay. If that sum is at least as large, the move fits.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: [
            "Say ",
            { code: "pvs" },
            " lists disk C with a PSize of about 512\u00a0GiB and a PFree of 392\u00a0GiB. So 512 − 392 = 120\u00a0GiB of extents has to move.",
          ],
        },
        {
          kind: "p",
          text: "Disks A and B need at least 120\u00a0GiB of PFree between them. If they have less, a new 128\u00a0GiB disk can take those extents. That leaves about 128 − 120 = 8\u00a0GiB to spare.",
        },
        {
          kind: "p",
          text: "A striped LV is stricter. Free space on a PV that already holds another stripe of that LV may not count. The normal allocation policy avoids “placing parallel stripes on the same PV.”",
        },
        {
          kind: "p",
          text: [
            { code: "lvs -a -o +devices" },
            " lists the devices each LV sits on, so you know which LVs are about to move.",
          ],
        },
        {
          kind: "p",
          text: "Free space inside a filesystem doesn’t count here. LVM sees extents, not files.",
        },
        {
          kind: "p",
          text: [
            "Say you once ran ",
            { code: "lvextend" },
            " to give an LV the whole VG. Then every extent belongs to that LV, even when its filesystem is mostly empty. PFree reads zero on every disk, so the LV has to shrink first.",
          ],
        },
      ],
    },
    {
      id: "remove-disk-from-lvm",
      title: "How to remove a disk from LVM: pvmove, vgreduce, pvremove",
      blocks: [
        {
          kind: "p",
          text: [
            "Run these on the disk you mean to delete. Check its device name against ",
            { code: "lsblk" },
            " first, since a wrong name moves the wrong data.",
          ],
        },
        {
          kind: "p",
          text: "On an Azure VM with SCSI data disks, this command maps each LUN in the portal to its Linux device:",
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
              " The ",
              { code: "vgreduce" },
              " command is for empty PVs only. Confirm in ",
              { code: "pvs" },
              " that the old disk’s PFree now equals its PSize, which means nothing on it is allocated.",
            ],
          ],
        },
        { kind: "code", lang: "bash", code: "sudo pvs" },
        {
          kind: "ol",
          start: 3,
          items: [
            [
              { b: "Remove the physical volume from the volume group" },
              " with ",
              { code: "vgreduce" },
              ". Red Hat says it “shrinks a volume group’s capacity by removing one or more empty physical volumes.”",
            ],
          ],
        },
        { kind: "code", lang: "bash", code: "sudo vgreduce <vg-name> /dev/<old-disk>" },
        {
          kind: "ol",
          start: 4,
          items: [[{ b: "Release the device from LVM use" }, " with ", { code: "pvremove" }, "."]],
        },
        { kind: "code", lang: "bash", code: "sudo pvremove /dev/<old-disk>" },
        {
          kind: "p",
          text: [
            "The move takes longer the more data is allocated on the old disk. You can stop it with ",
            { code: "pvmove --abort" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            { code: "pvmove" },
            " is built to survive interruption, such as a VM restart halfway through. The man page’s advice after a restart: “run pvmove again without any PV arguments to restart any operations that were in progress from the last checkpoint.”",
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
          title: "When the disk is already unused",
        },
        {
          kind: "p",
          text: [
            "A PV that joined the VG but never got any extents skips the move. To have LVM remove unused disks, run ",
            { code: "vgreduce" },
            " and then ",
            { code: "pvremove" },
            " on each one.",
          ],
        },
        {
          kind: "p",
          text: [
            "Check ",
            { code: "pvs" },
            " first. An empty PV can be one you added on purpose for an expand that hasn’t happened yet.",
          ],
        },
      ],
    },
    {
      id: "no-room-on-the-other-disks-pvmove",
      title: "No room on the other disks: pvmove to a smaller disk",
      blocks: [
        {
          kind: "p",
          text: "When “there are not enough free extents on the other physical volumes,” Red Hat’s procedure creates a new PV. It adds the PV to the VG, then moves the data onto it by name.",
        },
        {
          kind: "p",
          text: "That is also how you swap a large disk for a smaller one. Only allocated extents have to fit. In the worked example, a new 128\u00a0GiB disk takes disk C’s 120\u00a0GiB of extents, so the 512\u00a0GiB disk C can go.",
        },
        {
          kind: "p",
          text: "While both disks are attached, you pay for both. That’s the price of doing it without stopping the application.",
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
      title: "How to reduce LVM size with lvreduce when the LV fills the VG",
      blocks: [
        {
          kind: "p",
          text: [
            { code: "lvreduce" },
            " on its own never reduces what you pay. The extents it frees go back to the VG and stay on the same disks you’re paying for.",
          ],
        },
        {
          kind: "p",
          text: [
            "Here, though, every extent on the old disk is in use, and no smaller disk can take them. So the LV has to give extents back before ",
            { code: "pvmove" },
            " can run.",
          ],
        },
        {
          kind: "p",
          text: "Take the same three disks, with one LV given all 3 × 512 = 1,536\u00a0GiB. Its filesystem holds 300\u00a0GiB. To let disk C go, the LV must shrink under 2 × 512 = 1,024\u00a0GiB to fit on disks A and B.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "callout",
          label: "Watch out",
          text: "“Data stored in the reduced area is lost. Always back up the data and resize the file system before proceeding,” Red Hat warns.",
        },
        {
          kind: "p",
          text: "The filesystem on the LV must not be using the space you take away. So it shrinks first, and what that takes depends on the filesystem.",
        },
        { kind: "h3", id: "ext4-shrink-it-unmounted", title: "ext4: shrink it unmounted" },
        {
          kind: "p",
          text: "The resize2fs man page says it can “enlarge or shrink an unmounted file system.” A mounted one can only grow.",
        },
        {
          kind: "p",
          text: "So in Red Hat’s procedure, every service using the mount stops for the check and the resize. Plan a window:",
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
            " resizes the filesystem together with the LV, so you don’t run resize2fs by hand. The last line mounts it again.",
          ],
        },
        {
          kind: "p",
          text: "Pick a new size that fits on the disks you keep. Then run the pvmove steps above while the mount is back in use.",
        },
        {
          kind: "p",
          text: [
            { a: "Shrinking ext4 with resize2fs", href: "/learn/resize2fs-shrink-ext4" },
            " covers the minimum size and the check in detail.",
          ],
        },
        { kind: "h3", id: "xfs-no-supported-shrink", title: "XFS: no supported shrink" },
        {
          kind: "p",
          text: "Red Hat states that “XFS does not support reducing the size of a volume formatted with an XFS file system.”",
        },
        {
          kind: "p",
          text: [
            "The dependable route is a new, smaller filesystem and a copy, with a stop while you switch over. ",
            { a: "Shrinking an XFS filesystem", href: "/learn/shrink-xfs-filesystem" },
            " walks through it.",
          ],
        },
      ],
    },
    {
      id: "detach-and-delete-the-cloud-disk-to",
      title: "Detach and delete the cloud disk to stop paying for it",
      blocks: [
        {
          kind: "p",
          text: "A detached Azure disk “is not automatically deleted,” Microsoft warns. On Premium storage, “you will continue to incur storage charges for the disk.”",
        },
        {
          kind: "p",
          text: "AWS says the same of a detached EBS volume: “You must delete a volume to avoid incurring further charges.” The charges end with the delete, not the detach.",
        },
        {
          kind: "p",
          text: [
            "Our ",
            { a: "EBS and Azure disk pricing", href: "/ebs-and-azure-disk-pricing" },
            " calculator shows what that disk costs a month at list price.",
          ],
        },
        { kind: "h3", id: "before-you-detach", title: "Before you detach" },
        {
          kind: "p",
          text: [
            "After ",
            { code: "pvremove" },
            ", the old disk holds no data LVM uses. Both clouds ask you to unmount a disk before you detach it. Microsoft also asks you to remove its ",
            { code: "/etc/fstab" },
            " references.",
          ],
        },
        {
          kind: "p",
          text: "An emptied PV has neither. Nothing mounts the disk itself. The fstab line for the data mount names the LV or the filesystem’s UUID, and those stay where they were.",
        },
        {
          kind: "p",
          text: "Detaching is safe on its own, since the disk still exists and can be reattached. Deleting is permanent. So confirm the disk name or volume ID against the device you emptied before you run the delete.",
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
          text: "A volume must be detached before you can delete it. AWS is blunt about the result: “After deletion, its data is gone.”",
        },
        {
          kind: "p",
          text: [
            "You can store a snapshot first if you want a way back. Run the delete once the volume’s state reads ",
            { code: "available" },
            ". The delete guide checks that with ",
            { code: "describe-volumes" },
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
            ", AWS offers Force Detach as a last resort. It’s meant for a failed instance or a volume you mean to delete. AWS warns that the instance “doesn’t get an opportunity to flush file system caches or file system metadata.”",
          ],
        },
        { kind: "p", text: "Try a plain detach first." },
        {
          kind: "p",
          text: "Check your Recycle Bin retention rules too. A volume that matches one is kept there “instead of being immediately deleted.”",
        },
      ],
    },
    {
      id: "how-amoeba-does-the-same-job-with",
      title: "How Amoeba does the same job with a btrfs pool",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " optimizes block storage on the data disks of running VMs. That means Azure managed disks and Amazon EBS volumes, on Windows and Linux VMs. It never touches the OS disk or root volume.",
          ],
        },
        {
          kind: "p",
          text: [
            "Amoeba moves a VM’s data disks onto one btrfs pool sized to your data, with room to grow. The pool is ",
            {
              a: "one btrfs filesystem across several data disks",
              href: "/learn/btrfs-multiple-disks",
            },
            ", so the volume manager and the filesystem are one layer.",
          ],
        },
        {
          kind: "p",
          text: "Each data mount becomes a subvolume mounted at its old path. A data mount on LVM can move onto the pool too, as long as every disk under it is a cloud data disk.",
        },
        {
          kind: "p",
          text: "Amoeba copies your data while your services run. Then it switches each mount to the pool, with a short restart of the services that use it.",
        },
        {
          kind: "p",
          text: "When your data goes down and stays down, Amoeba shrinks the pool one disk at a time. No filesystem shrink comes first:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Drain." },
              " Amoeba moves the leaving disk’s data onto the other disks with ",
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
            "It never takes a disk out while the pool is nearly full, or while it’s growing the pool. The pool stays mounted while it shrinks. The FAQ answers ",
            { a: "whether a shrink can lose data", href: "/amoeba-faq#can-a-shrink-lose-data" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "On Linux, the VM needs a recent kernel with btrfs. Every service that keeps a data mount open must run under systemd. The VM also needs a few free disk slots for the pool.",
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
      title: "btrfs vs LVM: which one can shrink on a cloud VM?",
      where: "Learn",
      href: "/learn/btrfs-vs-lvm",
    },
    {
      title: "btrfs device remove: take a disk out of a btrfs pool",
      where: "Learn",
      href: "/learn/btrfs-device-remove",
    },
    {
      title: "Shrink ext4 with resize2fs: why it must be unmounted",
      where: "Learn",
      href: "/learn/resize2fs-shrink-ext4",
    },
    {
      title: "How to shrink an EBS volume when AWS only lets it grow",
      where: "Learn",
      href: "/learn/shrink-ebs-volume",
    },
    {
      title: "Can you shrink an Azure managed disk?",
      where: "Learn",
      href: "/learn/shrink-azure-managed-disk",
    },
  ],
};
