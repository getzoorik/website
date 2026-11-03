import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/btrfs-device-remove/1";
import { figure as figure2 } from "@/features/learn/figures/btrfs-device-remove/2";
import { figure as figure3 } from "@/features/learn/figures/btrfs-device-remove/3";

export const article: Article = {
  slug: "btrfs-device-remove",
  title: "btrfs device remove: take a disk out of a pool",
  meta: "How to remove a disk from a mounted btrfs pool: check room and the raid1 limit, run btrfs device remove, watch progress, then delete the cloud disk.",
  h1: "btrfs device remove",
  deck: "Take a disk out of a mounted btrfs pool, then delete the cloud disk so its charges stop.",
  card: "Take a disk out of a mounted btrfs pool: the checks, progress, why it’s slow, and deleting the cloud disk.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Linux filesystems",
  published: "2026-11-01",
  updated: "2026-11-03",
  author: "sourabh",
  cover: "/learn-covers/zoorik-learn-btrfs-device-remove-1200x630.webp",
  coverAlt: "btrfs device remove: data moves off the leaving disk onto the disks that stay",
  short: [
    { code: "btrfs device remove" },
    " moves a disk’s data onto the other disks of a mounted btrfs pool, then takes the disk out. The other disks need room for that data, and the profile must still work with one disk fewer, so convert two-disk ",
    { code: "raid1" },
    " first. Moving hundreds of GiB can take an hour or more. Then delete the cloud disk, or you keep paying for it.",
  ],
  sections: [
    {
      id: "btrfs-device-remove",
      title: "What the command does",
      blocks: [
        {
          kind: "p",
          text: [
            { code: "btrfs device remove" },
            " takes a disk out of a btrfs filesystem while it stays mounted and in use. When it returns, the filesystem is smaller by that disk. The disk itself is still attached to the VM, and the cloud provider still charges for it.",
          ],
        },
        {
          kind: "p",
          text: "The examples here use one pool: three 256 GiB data disks, which btrfs numbers devid 1 to 3. devid 3 is the one to remove.",
        },
        {
          kind: "p",
          text: [
            "btrfs stores data and metadata in chunks, also called block groups, spread across the pool’s disks (see ",
            { a: "btrfs on multiple disks", href: "/learn/btrfs-multiple-disks" },
            "). Removing a disk means emptying it of chunks. The kernel does that in a fixed order:",
          ],
        },
        {
          kind: "ol",
          items: [
            "It takes the disk off the allocator’s list, so no new chunk lands there.",
            "It sets the disk’s size inside the filesystem to zero.",
            "It relocates the disk’s chunks onto the other disks, from the end of the disk backwards.",
            "Once the last chunk has gone, it deletes the disk’s entry from the filesystem. The btrfs signature is removed from the device too.",
          ],
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "before-you-remove-a-disk-from-the",
      title: "Before you remove a disk",
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
            " adds, for each disk, what each profile has allocated there and what is still unallocated. Run it as root: a normal user doesn’t get the per-disk detail.",
          ],
        },
        {
          kind: "h3",
          id: "the-disks-that-stay-need-room-for",
          title: "Room on the other disks",
        },
        {
          kind: "p",
          text: "Everything on the leaving disk needs a place on the disks that stay: their unallocated space, plus free room inside chunks they already hold. Count unallocated space alone, and you keep a margin.",
        },
        {
          kind: "p",
          text: "The kernel doesn’t check for room before it starts. It relocates chunk after chunk, and chunks that hit “No space left on device” get one more pass. If one fails again, the removal stops with that error.",
        },
        {
          kind: "p",
          text: "The disk then stays in the filesystem, and the chunks that already moved stay where they went.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: [
            "devid 3 has 180 GiB allocated. All three disks hold ",
            { code: "single" },
            " data in nearly full chunks, and devid 1 and devid 2 have 40 GiB and 60 GiB unallocated. That’s 40 + 60 = 100 GiB of room for 180 GiB of chunks. The removal stops about 180 − 100 = 80 GiB short.",
          ],
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: [
            "Leave a margin too: btrfs needs ",
            { a: "unallocated space", href: "/learn/btrfs-unallocated-space" },
            " to create new chunks and to relocate old ones.",
          ],
        },
        {
          kind: "h3",
          id: "how-to-remove-a-device-from-btrfs",
          title: "Profiles and raid1",
        },
        {
          kind: "p",
          text: [
            "The disks left must still satisfy the profile, or the command fails. Each profile has a minimum disk count in the kernel: two for ",
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
            " keeps two copies of each chunk, on two different disks. From three or more disks, removing one works if the disks that stay have room for the copies that move. Down to two disks, each one holds a copy of everything.",
          ],
        },
        {
          kind: "p",
          text: [
            "From two disks to one, ",
            { code: "raid1" },
            " can’t hold, and btrfs refuses: “unable to go below two devices on raid1”.",
          ],
        },
        {
          kind: "p",
          text: "The documented fix is to convert first, then remove. Converting gives up redundancy: your data then has one copy, and losing that disk loses it. Like any balance, the conversion needs unallocated space.",
        },
        {
          kind: "code",
          lang: "bash",
          code: "sudo btrfs balance start -mconvert=dup -dconvert=single /data\nsudo btrfs device remove /dev/sda /data",
        },
        {
          kind: "callout",
          label: "For engineers",
          text: [
            { code: "dup" },
            " keeps both metadata copies on the one disk, so this conversion runs without ",
            { code: "--force" },
            ". Converting metadata to ",
            { code: "single" },
            " is refused, and the kernel log reads “balance: reduces metadata redundancy, use --force if you want this”.",
          ],
        },
        {
          kind: "h3",
          id: "check-disk-errors-and-etc-fstab",
          title: "Disk errors and /etc/fstab",
        },
        {
          kind: "p",
          text: [
            { code: "btrfs device stats -c" },
            " prints each disk’s error counters. It exits with 64 instead of 0 if any of them isn’t zero.",
          ],
        },
        {
          kind: "p",
          text: [
            "If the leaving disk is the failing one, the documentation says to use ",
            { code: "btrfs replace" },
            " instead. It warns against converting to a less redundant profile to get a failing disk out: rewritten chunks can land on that disk again.",
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            "You can remove the disk the filesystem was mounted from, and the mount table then shows another device. /etc/fstab doesn’t follow, so an entry that names the removed disk’s path can fail at the next boot. A ",
            { code: "UUID=" },
            " entry names the filesystem, not one disk, and keeps working.",
          ],
        },
      ],
    },
    {
      id: "how-to-run-btrfs-device-remove-one",
      title: "Run the removal",
      blocks: [
        {
          kind: "p",
          text: "The command runs in the foreground until the last chunk has moved. A fatal signal to that process, such as Ctrl-C, stops the work.",
        },
        {
          kind: "ol",
          items: [
            "On a remote VM, start tmux or screen first, so a dropped SSH session doesn’t stop the removal partway.",
            [
              "Name the disk by its path or by its devid from ",
              { code: "btrfs filesystem show" },
              ", then the mount point. Either line works. ",
              { code: "btrfs device delete" },
              " is an older name for the same command.",
            ],
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "sudo btrfs device remove /dev/sde /data\nsudo btrfs device remove 3 /data",
        },
        {
          kind: "ol",
          start: 3,
          items: [
            [
              "When the command returns, check that ",
              { code: "btrfs filesystem show /data" },
              " no longer lists the disk. Only then start the next removal.",
            ],
          ],
        },
        {
          kind: "p",
          text: "You can name several disks in one command. btrfs-progs removes them one by one, and the disks still waiting keep taking writes.",
        },
        {
          kind: "p",
          text: [
            "With several disks named, btrfs-progs first prints a warning and counts down 10 seconds. ",
            { code: "--force" },
            " skips the countdown, but doesn’t override the profile rule.",
          ],
        },
      ],
    },
    {
      id: "how-to-follow-btrfs-device-remove-progress",
      title: "Follow the progress",
      blocks: [
        {
          kind: "p",
          text: "With one disk named, the command prints nothing until it finishes, and it has no status subcommand. Progress shows in three places:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "sudo watch -n 60 btrfs filesystem show /data\nsudo journalctl -k -f | grep 'relocating block group'\ncat /sys/fs/btrfs/<filesystem-uuid>/exclusive_operation",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "The leaving disk’s used space." },
              " The kernel set the disk’s size to zero, so ",
              { code: "btrfs filesystem show" },
              " lists it with size 0.00B. Its used figure falls as each chunk leaves: that is your progress bar.",
            ],
            [
              { b: "The kernel log." },
              " One “relocating block group” line for each chunk the kernel moves.",
            ],
            [
              { b: "The sysfs file." },
              " ",
              { code: "exclusive_operation" },
              " reads ",
              { code: "device remove" },
              " while the removal runs. Its path takes the filesystem UUID that ",
              { code: "btrfs filesystem show" },
              " prints.",
            ],
          ],
        },
        {
          kind: "h3",
          id: "cancel-a-removal",
          title: "Cancel a removal",
        },
        {
          kind: "p",
          text: [
            "Run ",
            { code: "sudo btrfs device remove cancel /data" },
            ". It needs kernel 5.14 and btrfs-progs 5.13 or later. The disk gets its old size back and stays in the filesystem.",
          ],
        },
        {
          kind: "p",
          text: "Chunks already moved aren’t moved back, so a later run has less to do.",
        },
      ],
    },
    {
      id: "why-btrfs-device-remove-is-very-slow",
      title: "Why it’s slow",
      blocks: [
        {
          kind: "p",
          text: "Removal is relocation, the same work a balance does, and it has to move all the data off the disk. Three things set the pace:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Every chunk moves," },
              " data and metadata, one block group at a time. For data, the kernel copies the extents, then updates every block pointer to them, in two separate stages.",
            ],
            [
              { b: "Each cloud disk has a throughput ceiling," },
              " set by its type and size, or by what you provision.",
            ],
            [
              { b: "Your application shares the disks." },
              " Its reads and writes compete with the relocation for IOPS and throughput. A removal in busy hours runs slower, and slows the application too.",
            ],
          ],
        },
        {
          kind: "p",
          text: "For scale: just reading 500 GiB at 125 MiB/s takes 500 × 1,024 MiB ÷ 125 MiB/s = 4,096 seconds, about 68 minutes. Pointer updates come on top, and the writes land on disks with ceilings of their own. The documentation names disk seeking as “the key factor affecting performance.”",
        },
      ],
    },
    {
      id: "detach-and-delete-the-cloud-disk-to",
      title: "Delete the cloud disk",
      blocks: [
        {
          kind: "p",
          text: "Charges follow the Azure or AWS resource, not the filesystem. Microsoft warns: “If you detach a disk it is not automatically deleted.” AWS says you “must delete a volume to avoid incurring further charges.”",
        },
        { kind: "svg", figure: figure3 },
        {
          kind: "ol",
          items: [
            [
              { b: "Confirm the removal finished." },
              " ",
              { code: "btrfs filesystem show /data" },
              " no longer lists the disk.",
            ],
            [
              { b: "Match the Linux device to its cloud disk." },
              " On an Azure VM with SCSI data disks, the Azure Linux agent’s udev rules link each disk’s LUN under /dev/disk/azure/scsi1/. ",
              { code: "az vm show" },
              " lists each data disk’s ",
              { code: "lun" },
              " and ",
              { code: "name" },
              ". On a Nitro-based EC2 instance, ",
              { code: "lsblk -o +SERIAL" },
              " shows the EBS volume ID as the serial number, without the hyphen after ",
              { code: "vol" },
              ".",
            ],
            [
              { b: "Snapshot first if in doubt." },
              " Deleting is permanent. Take a snapshot if you’re not sure this is the disk you emptied.",
            ],
            [{ b: "Detach the disk, then delete it." }, " On Azure:"],
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "az vm disk detach --resource-group <resource-group> --vm-name <vm-name> --name <disk-name>\naz disk delete --resource-group <resource-group> --name <disk-name>",
        },
        {
          kind: "p",
          text: [
            "On AWS, wait until the volume’s state reads ",
            { code: "available" },
            ", because AWS won’t delete an attached volume:",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "aws ec2 detach-volume --volume-id <volume-id>\naws ec2 describe-volumes --volume-id <volume-id> --query 'Volumes[*].State' --output text\naws ec2 delete-volume --volume-id <volume-id>",
        },
        {
          kind: "p",
          text: "A volume that matches a Recycle Bin retention rule goes to the Recycle Bin instead of being deleted at once.",
        },
        {
          kind: "p",
          text: [
            "To make one large disk smaller instead, see ",
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
      title: "How Amoeba does it",
      blocks: [
        {
          kind: "p",
          text: [
            "When your data goes down and stays down, ",
            { a: "Amoeba", href: "/amoeba" },
            " shrinks a VM’s btrfs pool one disk at a time, without any downtime. Each shrink is this procedure, automated.",
          ],
        },
        {
          kind: "p",
          text: [
            "Amoeba moves the leaving disk’s data onto the other disks with ",
            { code: "btrfs device remove" },
            ". Then it detaches the empty disk and deletes it, with no snapshot, so its charges stop.",
          ],
        },
        {
          kind: "p",
          text: "Before a shrink, Amoeba checks that the disks that stay have room for the data and can carry the VM’s disk load. It never takes a disk out while the pool is nearly full, or while it’s growing the pool.",
        },
        {
          kind: "p",
          text: [
            "Shrinks start on their own with the shrink setting on Auto, and wait for you on Manual. The FAQ answers ",
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
      title: "btrfs on multiple disks: single or RAID 1",
      where: "Learn",
      href: "/learn/btrfs-multiple-disks",
    },
    {
      title: "btrfs unallocated vs free space",
      where: "Learn",
      href: "/learn/btrfs-unallocated-space",
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
      title: "Can you shrink an Azure managed disk?",
      where: "Learn",
      href: "/learn/shrink-azure-managed-disk",
    },
  ],
};
