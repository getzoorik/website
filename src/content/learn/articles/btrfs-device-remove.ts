import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/btrfs-device-remove/1";

export const article: Article = {
  slug: "btrfs-device-remove",
  title: "btrfs device remove: take a disk out of a pool",
  meta: "btrfs device remove, step by step: check the other disks have room, get past raid1, follow progress, learn why it’s slow, then delete the cloud disk.",
  h1: "btrfs device remove: take a disk out of a btrfs pool",
  deck: "Check the room and the profile, run the removal, follow it, then delete the cloud disk so its billing stops.",
  card: "Take a disk out of a mounted btrfs pool: the checks, the progress, why it’s slow, and the cloud step after.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Linux filesystems",
  published: "2026-11-20",
  updated: "2026-11-20",
  author: "sourabh",
  short: [
    { code: "btrfs device remove" },
    " takes one disk out of a mounted btrfs filesystem by moving every chunk on it onto the rest of the pool, then wiping its btrfs signature. Removal works only if the other disks have room for that data and the profile still holds with one disk fewer, so a two-disk ",
    { code: "raid1" },
    " pool needs converting first. Moving hundreds of GiB can take an hour or more, and the cloud disk bills until you detach and delete it.",
  ],
  sections: [
    {
      id: "what-btrfs-device-remove-does",
      title: "What btrfs device remove does",
      blocks: [
        {
          kind: "p",
          text: [
            "btrfs stores data and metadata in chunks, also called block groups, and a pool spreads them across its disks, as ",
            { a: "btrfs on multiple disks", href: "/learn/btrfs-multiple-disks" },
            " explains. Removing a disk means emptying it of chunks while the filesystem stays mounted and in use.",
          ],
        },
        {
          kind: "p",
          text: [
            "The kernel’s removal code works in a fixed order. It takes the disk off the list the allocator picks from, so no new chunk lands there. It sets the disk’s size inside the filesystem to zero. Then it walks the disk’s chunks from the end backwards and relocates each one onto the other disks. Once the last chunk has gone, it deletes the disk’s entry from the filesystem, and btrfs-progs notes that the btrfs signature is removed from the device. ",
            { code: "btrfs device delete" },
            " is an older name for the same command.",
          ],
        },
        {
          kind: "p",
          text: "Afterwards the filesystem is smaller by that disk, but the disk itself still exists, attached to the VM, and the cloud provider bills it as before.",
        },
      ],
    },
    {
      id: "before-you-remove-a-disk-from-the",
      title: "Before you remove a disk from the pool: room, profile and errors",
      blocks: [
        { kind: "p", text: "Three readings tell you whether the removal can finish:" },
        {
          kind: "code",
          lang: "bash",
          code: "sudo btrfs filesystem show /data\nsudo btrfs device usage /data\nsudo btrfs device stats -c /data",
        },
        {
          kind: "p",
          text: [
            { code: "btrfs filesystem show" },
            " lists each disk with its devid, size and used space. ",
            { code: "btrfs device usage" },
            " breaks that down per disk: what each profile has allocated there, and what is still Unallocated. Run ",
            { code: "device usage" },
            " as root, because a normal user doesn’t get the per-disk detail.",
          ],
        },
        { kind: "h3", id: "room-on-the-disks-that-stay", title: "Room on the disks that stay" },
        {
          kind: "p",
          text: [
            "Everything on the disk you remove needs a place on the disks that stay: their unallocated space, plus any room left inside chunks they already hold. Count unallocated space alone and you keep a margin. Say three 256\u00a0GiB disks hold ",
            { code: "single" },
            " data in nearly full chunks. The one you want gone has 180\u00a0GiB allocated, and the other two have 40\u00a0GiB and 60\u00a0GiB unallocated. That’s about 100\u00a0GiB of room for 180\u00a0GiB, and the removal will stop partway. The kernel doesn’t check this before it starts. It relocates chunk after chunk, retries the ones that hit “No space left on device” once, then stops with that error, leaving the disk in the filesystem and the chunks that already moved where they went. Leave margin too: btrfs needs unallocated space to create new chunks and to relocate old ones, as ",
            { a: "btrfs unallocated space vs free space", href: "/learn/btrfs-unallocated-space" },
            " explains.",
          ],
        },
        {
          kind: "h3",
          id: "how-to-remove-a-device-from-btrfs",
          title: "How to remove a device from btrfs raid 1",
        },
        {
          kind: "p",
          text: [
            "The man page is plain: “Device removal must satisfy the profile constraints, otherwise the command fails and cannot be enforced.” Each profile has a minimum disk count in the kernel’s table: two for ",
            { code: "raid1" },
            ", three for ",
            { code: "raid1c3" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            { code: "raid1" },
            " keeps two copies of each chunk on two different disks. Removing one of three or more disks works when the disks that stay have room for the copies that move, with the two copies of each chunk still on two different disks. When two disks will be left, each of them ends up holding one copy of everything.",
          ],
        },
        {
          kind: "p",
          text: [
            "From two disks to one, ",
            { code: "raid1" },
            " can’t hold, and btrfs refuses with “unable to go below two devices on raid1.” The documentation’s fix is to convert first, then remove:",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "sudo btrfs balance start -mconvert=dup -dconvert=single /data\nsudo btrfs device remove /dev/sda /data",
        },
        {
          kind: "p",
          text: [
            { code: "dup" },
            " stores both metadata copies on the one disk. That conversion runs without the force option. Converting metadata to ",
            { code: "single" },
            " instead is refused, and the kernel log reads “balance: reduces metadata redundancy, use --force if you want this”. This gives up redundancy: after the conversion, your data has one copy, and losing that disk loses the data. Like any balance, it needs unallocated space to work in.",
          ],
        },
        { kind: "h3", id: "disk-errors-and-etc-fstab", title: "Disk errors and /etc/fstab" },
        {
          kind: "p",
          text: [
            { code: "btrfs device stats -c" },
            " prints each disk’s error counters and exits with 64 instead of 0 if any of them isn’t zero. If the disk you’re removing is the one failing, the documentation warns against converting to a less redundant profile to get it out, because the rewritten chunks can land on the failing disk again. It says to use ",
            { code: "btrfs replace" },
            " instead.",
          ],
        },
        {
          kind: "p",
          text: [
            "Check /etc/fstab too. The man page notes that you can remove the device the filesystem was mounted from, and the mount table then shows another device name. /etc/fstab doesn’t follow, so an entry that names the removed disk’s device path can fail at the next boot. A ",
            { code: "UUID=" },
            " entry names the filesystem, not one disk, and keeps working.",
          ],
        },
      ],
    },
    {
      id: "how-to-run-btrfs-device-remove",
      title: "How to run btrfs device remove",
      blocks: [
        {
          kind: "p",
          text: [
            "Name the disk by its path or by its devid from ",
            { code: "btrfs filesystem show" },
            ", then the mount point:",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "sudo btrfs device remove /dev/sde /data\nsudo btrfs device remove 3 /data",
        },
        {
          kind: "p",
          text: "The command runs in the foreground until the last chunk has moved, and the kernel stops the work if that process gets a fatal signal such as Ctrl-C. On a remote VM, start it inside tmux or screen, so a dropped SSH session doesn’t end it partway.",
        },
        {
          kind: "p",
          text: [
            "You can name several disks at once. btrfs-progs then removes them one by one, and the disks still waiting can take new writes meanwhile. It prints a warning and counts down 10\u00a0seconds before it starts, which ",
            { code: "--force" },
            " skips, though that option doesn’t override the profile rule. To remove disk after disk without surprises, run one removal, check the result, then start the next.",
          ],
        },
      ],
    },
    {
      id: "how-to-follow-btrfs-device-remove-progress",
      title: "How to follow btrfs device remove progress",
      blocks: [
        {
          kind: "p",
          text: [
            "With one disk named, the command prints nothing until it finishes, and ",
            { code: "btrfs device remove" },
            " has no status subcommand. Progress is visible in three places.",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "sudo watch -n 60 btrfs filesystem show /data\nsudo journalctl -k -f | grep 'relocating block group'\ncat /sys/fs/btrfs/<filesystem-uuid>/exclusive_operation",
        },
        {
          kind: "p",
          text: [
            "Because the kernel set the disk’s size to zero at the start, ",
            { code: "btrfs filesystem show" },
            " lists it with size 0.00B, and its used figure falls as each chunk leaves. That falling number is your progress bar. The kernel also logs one “relocating block group” line per chunk it moves. While the removal runs, the sysfs file reads ",
            { code: "device remove" },
            ", and its path takes the filesystem UUID that ",
            { code: "btrfs filesystem show" },
            " prints.",
          ],
        },
        {
          kind: "p",
          text: [
            "To stop a removal, run ",
            { code: "sudo btrfs device remove cancel /data" },
            ", which needs kernel 5.14 and btrfs-progs 5.13 or later. The disk gets its old size back and stays in the filesystem. Chunks already moved aren’t moved back, so running the removal again later has less left to do.",
          ],
        },
      ],
    },
    {
      id: "why-btrfs-device-remove-is-very-slow",
      title: "Why btrfs device remove is very slow",
      blocks: [
        {
          kind: "p",
          text: "Removal is relocation, the same work a balance does. Three things set its pace.",
        },
        {
          kind: "p",
          text: "Every chunk on the disk moves, data and metadata, one block group at a time. For data, each move copies the extents and then updates every block pointer that refers to them, two separate stages in the kernel’s relocation code. The btrfs-device man page warns that removal “can take long as it needs to move all data from the device.” Of a balance, which moves chunks the same way, it says the work “can take a while, because all metadata have to be moved and all block pointers updated,” and names disk seeking as “the key factor affecting performance.”",
        },
        {
          kind: "p",
          text: "Each cloud disk has its own throughput ceiling, set by its type and size, or by what you provision. For scale: if the leaving disk reads at 125\u00a0MiB/s, just reading 500\u00a0GiB off it takes 4,096\u00a0seconds, about 68\u00a0minutes, before any pointer updates, and the writes land on disks with ceilings of their own.",
        },
        {
          kind: "p",
          text: "Your application keeps using the same disks. Every read and write it makes competes with the relocation for the same IOPS and throughput, so a removal during the busy hours runs slower and slows the application too.",
        },
        { kind: "diagram", figure: figure1 },
      ],
    },
    {
      id: "detach-and-delete-the-cloud-disk-to",
      title: "Detach and delete the cloud disk to stop billing",
      blocks: [
        {
          kind: "p",
          text: "Billing follows the Azure or AWS resource, not the filesystem. Microsoft’s warning reads: “If you detach a disk it is not automatically deleted.” AWS says you are “still charged for volume storage” after a detach and “must delete a volume to avoid incurring further charges.”",
        },
        {
          kind: "p",
          text: [
            "First confirm the removal finished: ",
            { code: "btrfs filesystem show /data" },
            " no longer lists the disk. Then match the Linux device to its managed disk or EBS volume. On an Azure VM whose data disks attach over SCSI, the Azure Linux agent’s udev rules link each data disk’s LUN under /dev/disk/azure/scsi1/, and ",
            { code: "az vm show" },
            " lists every data disk with its ",
            { code: "lun" },
            " and ",
            { code: "name" },
            ". On a Nitro-based EC2 instance, ",
            { code: "lsblk -o +SERIAL" },
            " shows the EBS volume ID as the serial number, written without the hyphen after ",
            { code: "vol" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "Deleting is permanent, so take a snapshot first if you’re not sure the disk you’re about to delete is the one you emptied.",
        },
        {
          kind: "code",
          lang: "bash",
          code: "az vm disk detach --resource-group <resource-group> --vm-name <vm-name> --name <disk-name>\naz disk delete --resource-group <resource-group> --name <disk-name>",
        },
        {
          kind: "code",
          lang: "bash",
          code: "aws ec2 detach-volume --volume-id <volume-id>\naws ec2 describe-volumes --volume-id <volume-id> --query 'Volumes[*].State' --output text\naws ec2 delete-volume --volume-id <volume-id>",
        },
        {
          kind: "p",
          text: [
            "AWS won’t delete an attached volume, so wait for ",
            { code: "available" },
            " first. If the volume matches a Recycle Bin retention rule, AWS keeps it there instead of deleting it at once. To make one large disk smaller instead, see ",
            { a: "shrinking an Azure managed disk", href: "/learn/shrink-azure-managed-disk" },
            " and ",
            { a: "shrinking an EBS volume", href: "/learn/shrink-ebs-volume" },
            ".",
          ],
        },
      ],
    },
    {
      id: "how-amoeba-removes-a-disk-from-its",
      title: "How Amoeba removes a disk from its pool",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " optimizes block storage on Azure managed disks and Amazon EBS. On a VM it moves the data disks onto one btrfs pool, then rightsizes the pool as the data grows and shrinks. A shrink is this procedure, automated, one disk at a time:",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Drain." },
              " The agent moves the disk’s data onto the other disks with ",
              { code: "btrfs device remove" },
              ".",
            ],
            [
              { b: "Delete." },
              " Amoeba detaches the empty disk and deletes it, with no snapshot, which stops its billing.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Shrinks start only after the move onto the pool is done and a full 7\u00a0days of data have been collected, and Amoeba checks hourly after that. It never removes a disk while the pool is at or above the top edge of its target band, 90% full by default, or while an urgent expand runs. With the shrink setting on Auto, shrinks start by themselves. On Manual, they wait for you. The FAQ answers ",
            { a: "whether a shrink can lose data", href: "/amoeba/faq#can-a-shrink-lose-data" },
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
      publisher:
        "btrfs-progs source, the “btrfs-device(8)” man page (Documentation/btrfs-device.rst and the chapter it includes)",
      title: "“cmds/device.c”",
      url: "https://git.kernel.org/pub/scm/linux/kernel/git/kdave/btrfs-progs.git/tree/",
      note: ", “cmds/filesystem.c” and “CHANGES”",
    },
    {
      publisher: "Linux kernel source",
      title: "“fs/btrfs”",
      url: "https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/fs/btrfs",
      note: " (volumes.c, relocation.c, ioctl.c, sysfs.c)",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Detach a data disk from a Linux VM”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/linux/detach-disk",
    },
    {
      publisher: "Microsoft Learn",
      title: "“az disk”",
      url: "https://learn.microsoft.com/en-us/cli/azure/disk",
      note: " (Azure CLI reference)",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Troubleshoot Linux VM device name changes in Azure”",
      url: "https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-machines/linux/troubleshoot-device-names-problems",
    },
    {
      publisher: "AWS",
      title: "“Map Amazon EBS volumes to NVMe device names”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/identify-nvme-ebs-device.html",
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
      title: "btrfs on multiple disks: how a btrfs pool works",
      where: "Learn",
      href: "/learn/btrfs-multiple-disks",
    },
    {
      title: "btrfs unallocated space vs free space, explained",
      where: "Learn",
      href: "/learn/btrfs-unallocated-space",
    },
    {
      title: "btrfs vs LVM: which one can shrink on a cloud VM?",
      where: "Learn",
      href: "/learn/btrfs-vs-lvm",
    },
    {
      title: "Can a shrink lose data?",
      where: "Amoeba FAQ",
      href: "/amoeba/faq#can-a-shrink-lose-data",
    },
  ],
};
