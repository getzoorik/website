import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/remove-disk-from-lvm/1";

export const article: Article = {
  slug: "remove-disk-from-lvm",
  title: "Remove a disk from LVM without losing data",
  meta: "Remove a disk from LVM without losing data: pvmove, vgreduce and pvremove while mounted, what to do when other disks are full, and deleting the cloud disk.",
  h1: "How to remove a disk from LVM without losing data",
  deck: "Move its extents with pvmove, take it out of the volume group, then detach and delete the cloud disk.",
  card: "pvmove, vgreduce and pvremove while mounted, the case where the other disks are full, and the cloud delete.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Linux filesystems",
  published: "2026-11-18",
  updated: "2026-11-18",
  author: "sujal",
  short: [
    "To remove a disk from LVM without losing data, move its data onto the other disks with ",
    { code: "pvmove" },
    ", take it out of the volume group with ",
    { code: "vgreduce" },
    ", and release it from LVM with ",
    { code: "pvremove" },
    ". All three run while the filesystem stays mounted. On a cloud VM you then detach and delete the disk, because a detached disk is still billed. The catch is room: the other disks need enough free extents to take the data.",
  ],
  sections: [
    {
      id: "what-removing-a-disk-from-lvm-involves",
      title: "What removing a disk from LVM involves",
      blocks: [
        {
          kind: "p",
          text: "The Logical Volume Manager, LVM, builds storage in three layers. Each disk becomes a physical volume (PV), PVs join a volume group (VG), and you carve logical volumes (LVs) out of the VG, then put a filesystem such as ext4 or XFS on each LV. LVM hands out space in extents, which Red Hat calls “the smallest units of space that you can allocate in LVM” (4\u00a0MiB each by default, all the same size), and an LV is a list of extents that can sit on any PV in the group.",
        },
        {
          kind: "p",
          text: "Removing a disk means emptying its PV, then letting go of it at each layer. Red Hat’s guide describes the move as routine: “Data can be rearranged on disks while the disks are in use,” and its example is to “empty a hot-swappable disk before removing it.” Your application keeps reading and writing the mount while the extents move underneath it.",
        },
        {
          kind: "p",
          text: [
            "On Azure or AWS, the step that matters for the bill comes after LVM. Microsoft warns that a detached disk “is not automatically deleted,” and that on Premium storage “you will continue to incur storage charges for the disk.” AWS says the same of a detached EBS volume: “You must delete a volume to avoid incurring further charges.” Azure won’t ",
            { a: "shrink a disk in place", href: "/learn/shrink-azure-managed-disk" },
            " either. Microsoft says shrinking an existing disk “isn’t supported and might result in data loss,” and ",
            { a: "shrinking an EBS volume", href: "/learn/shrink-ebs-volume" },
            " covers the AWS side. So the unit you can stop paying for is a whole disk, and LVM’s job here is to empty one.",
          ],
        },
      ],
    },
    {
      id: "check-that-the-other-disks-have-room",
      title: "Check that the other disks have room",
      blocks: [
        {
          kind: "p",
          text: [
            { code: "pvmove" },
            " copies every allocated extent on the disk you’re removing into free extents on the other PVs. Before you start, compare the two numbers:",
          ],
        },
        { kind: "code", lang: "bash", code: "sudo pvs\nsudo lvs -a -o +devices" },
        {
          kind: "p",
          text: [
            "In the ",
            { code: "pvs" },
            " output, PSize is each PV’s size and PFree is, in Red Hat’s words, “Free space remaining on the physical volume.” For the disk you’re removing, PSize minus PFree is what has to move. Add up the PFree of the PVs that stay. If that sum is at least as large, the move fits. A striped LV is stricter, because the normal allocation policy avoids “placing parallel stripes on the same PV,” so free space on a PV that already holds another stripe of that LV may not count. ",
            { code: "lvs -a -o +devices" },
            " lists the devices each LV sits on, so you know which LVs are about to move.",
          ],
        },
        {
          kind: "p",
          text: [
            "Free space inside a filesystem doesn’t count here. LVM sees extents, not files. If you once ran ",
            { code: "lvextend" },
            " to give an LV the whole VG, every extent belongs to that LV even when the filesystem on it is mostly empty, and PFree reads zero on every disk. That case needs the LV shrunk first, which the section on reducing LVM size below covers step by step.",
          ],
        },
      ],
    },
    {
      id: "how-to-remove-a-disk-from-lvm",
      title: "How to remove a disk from LVM: pvmove, vgreduce, pvremove",
      blocks: [
        {
          kind: "p",
          text: [
            "These commands take one disk out of LVM. Run them on the disk you mean to delete, and check the device name against ",
            { code: "lsblk" },
            " first, since a wrong name moves the wrong data. On an Azure VM with SCSI data disks, ",
            { code: "sudo ls -alF /dev/disk/azure/scsi1/" },
            " maps each LUN in the portal to its Linux device.",
          ],
        },
        {
          kind: "ol",
          items: [
            "Move the extents. With no destination named, the VG’s normal allocation rules pick free extents on the other PVs.",
            [
              "Check that ",
              { code: "pvs" },
              " now shows the old disk’s PFree equal to its PSize, which means nothing on it is allocated.",
            ],
            [
              "Remove the physical volume from the volume group with ",
              { code: "vgreduce" },
              ", which Red Hat says “shrinks a volume group’s capacity by removing one or more empty physical volumes.”",
            ],
            ["Release the device from LVM use with ", { code: "pvremove" }, "."],
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "sudo pvmove /dev/<old-disk>\nsudo pvs\nsudo vgreduce <vg-name> /dev/<old-disk>\nsudo pvremove /dev/<old-disk>",
        },
        {
          kind: "p",
          text: [
            { code: "pvmove" },
            " is built to survive interruption. It copies each segment through a temporary mirror, and when a segment is in sync it switches the LV to the new location and writes a checkpoint into the VG metadata. If the VM restarts halfway, the man page says to “run pvmove again without any PV arguments to restart any operations that were in progress from the last checkpoint.” You can also stop it with ",
            { code: "pvmove --abort" },
            ". The copy reads every allocated extent on the old disk and writes it elsewhere, so its run time grows with the data allocated there. To move one LV at a time, name it with ",
            { code: "-n" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            { code: "vgreduce" },
            " is for empty PVs only, which is why step 2 checks PFree before it. Both clouds ask you to unmount a disk before you detach it, and Microsoft also asks you to remove its ",
            { code: "/etc/fstab" },
            " references. An emptied PV has neither: nothing mounts the disk itself, and the fstab line for the data mount names the LV or the filesystem’s UUID, which stay where they were.",
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
            " on each one. Check ",
            { code: "pvs" },
            " first, since an empty PV can be one you added on purpose for an expand that hasn’t happened yet.",
          ],
        },
      ],
    },
    {
      id: "pvmove-to-a-smaller-disk",
      title: "pvmove to a smaller disk",
      blocks: [
        {
          kind: "p",
          text: "When the other PVs are full, add room before you move. Red Hat’s procedure for the case where “there are not enough free extents on the other physical volumes” creates a new PV, adds it to the VG and moves the data onto it by name. That is also how you swap a large disk for a smaller one.",
        },
        {
          kind: "p",
          text: "Only allocated extents have to fit. If a 512\u00a0GiB disk has 120\u00a0GiB of extents in use, a 128\u00a0GiB disk can take them. Attach the new disk, then:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "sudo pvcreate /dev/<new-disk>\nsudo vgextend <vg-name> /dev/<new-disk>\nsudo pvmove /dev/<old-disk> /dev/<new-disk>\nsudo vgreduce <vg-name> /dev/<old-disk>\nsudo pvremove /dev/<old-disk>",
        },
        {
          kind: "p",
          text: [
            "Leave some margin, and read the new disk’s PFree in ",
            { code: "pvs" },
            " after ",
            { code: "vgextend" },
            " to confirm it’s larger than the old disk’s used extents. While both disks are attached you pay for both, which is the price of doing it without a stop.",
          ],
        },
      ],
    },
    {
      id: "how-to-reduce-lvm-size-in-linux",
      title: "How to reduce LVM size in Linux when the other disks are full",
      blocks: [
        {
          kind: "p",
          text: "If the LV fills the VG, every extent on the old disk is in use and no smaller disk can take them, so the LV has to give extents back first. Red Hat puts the risk plainly: “Data stored in the reduced area is lost.” The filesystem on the LV must not be using the space you take away, so it shrinks first, and what that takes depends on the filesystem.",
        },
        { kind: "diagram", figure: figure1 },
        { kind: "h3", id: "ext4-shrink-it-unmounted", title: "ext4: shrink it unmounted" },
        {
          kind: "p",
          text: "The resize2fs man page says it can “enlarge or shrink an unmounted file system”, and that a mounted one can only grow. Red Hat’s procedure follows from that. Every service using the mount stops for the check and the resize, so plan a window:",
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
            " resizes the filesystem together with the LV, so you don’t run resize2fs by hand, and the last line mounts the filesystem again. Pick a new size that fits on the disks you keep, then run the pvmove steps above while the mount is back in use. Red Hat adds a warning worth taking: “Always back up the data and resize the file system before proceeding.” ",
            { a: "Shrinking ext4 with resize2fs", href: "/learn/resize2fs-shrink-ext4" },
            " covers the minimum size and the check in detail.",
          ],
        },
        { kind: "h3", id: "xfs-no-supported-shrink", title: "XFS: no supported shrink" },
        {
          kind: "p",
          text: [
            "Red Hat states that “XFS does not support reducing the size of a volume formatted with an XFS file system.” The dependable route is a new, smaller filesystem, a copy, and a stop while you switch over. ",
            { a: "Shrinking an XFS filesystem", href: "/learn/shrink-xfs-filesystem" },
            " walks through it.",
          ],
        },
        {
          kind: "p",
          text: [
            "So ",
            { code: "lvreduce" },
            " on its own never reduces the bill: the extents it frees go back to the VG and stay on the same disks you’re paying for. Only a whole disk that leaves the VG and is deleted in the cloud moves it.",
          ],
        },
      ],
    },
    {
      id: "detach-and-delete-the-cloud-disk",
      title: "Detach and delete the cloud disk",
      blocks: [
        {
          kind: "p",
          text: [
            "After ",
            { code: "pvremove" },
            ", the old disk holds no data LVM uses, and nothing mounts it. Detaching is safe on its own, since the disk still exists and can be reattached. Deleting is permanent, so confirm the disk name or volume ID against the device you emptied before you run the second command.",
          ],
        },
        { kind: "p", text: "On Azure:" },
        {
          kind: "code",
          lang: "bash",
          code: "az vm disk detach -g <resource-group> --vm-name <vm-name> -n <disk-name>\naz disk delete --resource-group <resource-group> --name <disk-name>",
        },
        {
          kind: "p",
          text: [
            "On AWS, a volume must be detached before you can delete it, and AWS is blunt about the result: “After deletion, its data is gone.” You can store a snapshot first if you want a way back. Run the delete once the volume’s state reads ",
            { code: "available" },
            ", which the delete guide checks with ",
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
            ", AWS offers Force Detach as a last resort, for a failed instance or a volume you mean to delete, and warns that the instance “doesn’t get an opportunity to flush file system caches or file system metadata.” Try a plain detach first.",
          ],
        },
        {
          kind: "p",
          text: "Billing ends with the delete, not the detach. On AWS, a volume that matches a Recycle Bin retention rule is kept there “instead of being immediately deleted,” so check your rules if you have any.",
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
            " optimizes block storage on Azure managed disks and Amazon EBS. Its pool is ",
            {
              a: "one btrfs filesystem across several data disks",
              href: "/learn/btrfs-multiple-disks",
            },
            ", so the volume manager and the filesystem are one layer. Each data mount becomes a subvolume on the pool, mounted at the same path as before. A data mount that sits on LVM can move onto the pool too, as long as every disk under it is a cloud data disk.",
          ],
        },
        {
          kind: "p",
          text: "No filesystem shrink comes first. The pool’s own free space is the room a removed disk’s data moves into. Amoeba shrinks one disk at a time:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Drain." },
              " The agent moves the disk’s data onto the other disks with ",
              { a: { code: "btrfs device remove" }, href: "/learn/btrfs-device-remove" },
              ".",
            ],
            [
              { b: "Delete." },
              " Amoeba detaches the empty disk and deletes it, with no snapshot, so its billing stops. It never does this while the pool is at or above the top edge of its target band, which runs from 80% to 90% full by default, or while an urgent expand runs.",
            ],
          ],
        },
        {
          kind: "p",
          text: "The pool stays mounted while it shrinks. Shrinks start only after the move onto the pool is done and a full 7\u00a0days of data have been collected. Getting onto the pool takes a copy while services run, then one switch that restarts the systemd services holding the data mounts. The VM needs 3 free data-disk slots: 2 for the pool and 1 kept free for an urgent expand. On Linux, Amoeba needs systemd, kernel 5.14 or later, and btrfs loaded or loadable. VMs whose OS is in the Red Hat family are not moved.",
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
      title: "How to shrink an EBS volume when AWS only lets it grow",
      where: "Learn",
      href: "/learn/shrink-ebs-volume",
    },
    {
      title: "Can a shrink lose data?",
      where: "Amoeba FAQ",
      href: "/amoeba/faq#can-a-shrink-lose-data",
    },
  ],
};
