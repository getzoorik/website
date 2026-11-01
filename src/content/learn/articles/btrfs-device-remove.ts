import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/btrfs-device-remove/1";
import { figure as figure2 } from "@/features/learn/figures/btrfs-device-remove/2";
import { figure as figure3 } from "@/features/learn/figures/btrfs-device-remove/3";

export const article: Article = {
  slug: "btrfs-device-remove",
  title: "btrfs device remove: take a disk out of a pool",
  meta: "btrfs device remove, step by step: check the other disks have room, get past raid1, follow progress, learn why it’s slow, then delete the cloud disk.",
  h1: "btrfs device remove: take a disk out of a btrfs pool",
  deck: "Check the room and the profile, run the removal, follow it, then delete the cloud disk so its charges stop.",
  card: "Take a disk out of a mounted btrfs pool: the checks, the progress, why it’s slow, and the cloud step after.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Linux filesystems",
  published: "2026-11-01",
  updated: "2026-11-01",
  author: "sourabh",
  cover: "/learn-covers/zoorik-learn-btrfs-device-remove-1200x630.webp",
  coverAlt: "btrfs device remove: data moves off the leaving disk onto the disks that stay",
  short: [
    { code: "btrfs device remove" },
    " empties a disk in a mounted btrfs pool onto the other disks, then takes it out. They need room for its data, and the profile must hold with one disk fewer, so convert two-disk ",
    { code: "raid1" },
    " first. Moving hundreds of GiB can take an hour or more, and the cloud disk is charged until it’s deleted.",
  ],
  sections: [
    {
      id: "btrfs-device-remove",
      title: "btrfs device remove empties a disk, but the cloud disk stays",
      blocks: [
        {
          kind: "p",
          text: "Picture a VM whose data sits on a btrfs pool. The pool has three 256\u00a0GiB data disks, which btrfs numbers devid 1 to 3. Say you want devid 3 gone.",
        },
        {
          kind: "p",
          text: [
            { code: "btrfs device remove" },
            " can take it out while the filesystem stays mounted and in use. When the command returns, the filesystem is smaller by that disk. But the disk itself still exists, attached to the VM, and the cloud provider charges for it as before.",
          ],
        },
        {
          kind: "p",
          text: [
            "btrfs stores data and metadata in chunks, also called block groups. A pool spreads them across its disks, as ",
            { a: "btrfs on multiple disks", href: "/learn/btrfs-multiple-disks" },
            " explains. Removing a disk means emptying it of chunks, and the kernel’s removal code does that in a fixed order:",
          ],
        },
        {
          kind: "ol",
          items: [
            "It takes the disk off the list the allocator picks from, so no new chunk lands there.",
            "It sets the disk’s size inside the filesystem to zero.",
            "It walks the disk’s chunks from the end backwards and relocates each one onto the other disks.",
            "Once the last chunk has gone, it deletes the disk’s entry from the filesystem. As btrfs-progs notes, the btrfs signature is removed from the device too.",
          ],
        },
        { kind: "svg", figure: figure1 },
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
            " lists each disk with its devid, size and used space. The ",
            { code: "btrfs device usage" },
            " command goes further: for each disk, it shows what each profile has allocated there, and what is still Unallocated. Run ",
            { code: "device usage" },
            " as root, because a normal user doesn’t get the per-disk detail.",
          ],
        },
        {
          kind: "h3",
          id: "the-disks-that-stay-need-room-for",
          title: "The disks that stay need room for all of it",
        },
        {
          kind: "p",
          text: "Everything on the disk you remove needs a place on the disks that stay. That place is their unallocated space, plus any room left inside chunks they already hold. Count unallocated space alone and you keep a margin.",
        },
        {
          kind: "p",
          text: "The kernel doesn’t check this before the removal starts. It relocates chunk after chunk, and a chunk that hits “No space left on device” gets one retry. Then it stops with that error.",
        },
        {
          kind: "p",
          text: "When it stops, the disk stays in the filesystem. The chunks that already moved stay where they went.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: [
            "devid 3, the one you want gone, has 180\u00a0GiB allocated. The three disks hold ",
            { code: "single" },
            " data in nearly full chunks, and devid 1 and devid 2 have 40\u00a0GiB and 60\u00a0GiB unallocated. That’s about 40 + 60 = 100\u00a0GiB of room for 180\u00a0GiB, roughly 180 − 100 = 80\u00a0GiB short, so the removal will stop partway.",
          ],
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: [
            "Leave margin too: btrfs needs unallocated space to create new chunks and to relocate old ones, as ",
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
          text: "The man page is plain: “Device removal must satisfy the profile constraints, otherwise the command fails and cannot be enforced.”",
        },
        {
          kind: "p",
          text: [
            "Each profile has a minimum disk count in the kernel’s table: two for ",
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
            " keeps two copies of each chunk on two different disks. Removing one of three or more disks works when the disks that stay have room for the copies that move. The two copies of each chunk must still sit on two different disks.",
          ],
        },
        {
          kind: "p",
          text: [
            "When two disks will be left, each of them ends up holding one copy of everything. From two disks to one, ",
            { code: "raid1" },
            " can’t hold. btrfs refuses with “unable to go below two devices on raid1.”",
          ],
        },
        {
          kind: "p",
          text: "The documentation’s fix is to convert first, then remove. Converting gives up redundancy: afterwards your data has one copy, and losing that disk loses the data. Like any balance, it needs unallocated space to work in.",
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
            " stores both metadata copies on the one disk. The conversion to ",
            { code: "dup" },
            " runs without the force option. Converting metadata to ",
            { code: "single" },
            " instead is refused, and the kernel log reads “balance: reduces metadata redundancy, use --force if you want this”.",
          ],
        },
        {
          kind: "h3",
          id: "check-disk-errors-and-etc-fstab",
          title: "Check disk errors and /etc/fstab",
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
            "If the disk you’re removing is the one failing, the documentation says to use ",
            { code: "btrfs replace" },
            " instead. It warns against converting to a less redundant profile to get the disk out. Rewritten chunks can land on the failing disk again.",
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "Per the man page, you can remove the device the filesystem was mounted from, and the mount table then shows another device name. Your /etc/fstab doesn’t follow, so an entry that names the removed disk’s device path can fail at the next boot.",
        },
        {
          kind: "p",
          text: [
            "A ",
            { code: "UUID=" },
            " entry names the filesystem, not one disk, and keeps working.",
          ],
        },
      ],
    },
    {
      id: "how-to-run-btrfs-device-remove-one",
      title: "How to run btrfs device remove, one disk at a time",
      blocks: [
        {
          kind: "p",
          text: "The command runs in the foreground until the last chunk has moved. If that process gets a fatal signal such as Ctrl-C, the kernel stops the work.",
        },
        {
          kind: "ol",
          items: [
            "On a remote VM, start a tmux or screen session first, so a dropped SSH session doesn’t end the removal partway.",
            [
              "Name the disk by its path or by its devid from ",
              { code: "btrfs filesystem show" },
              ", then the mount point. Either line works, and ",
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
              "When the command returns, check the result: ",
              { code: "btrfs filesystem show /data" },
              " no longer lists the disk. Only then start the next removal.",
            ],
          ],
        },
        {
          kind: "p",
          text: "You can name several disks at once. Then btrfs-progs removes them one by one, and the disks still waiting can take new writes meanwhile.",
        },
        {
          kind: "p",
          text: [
            "With several disks named, btrfs-progs first prints a warning and counts down 10\u00a0seconds. Adding ",
            { code: "--force" },
            " skips the countdown, though it doesn’t override the profile rule.",
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
          text: "With one disk named, the command prints nothing until it finishes. It has no status subcommand. Progress shows in three places:",
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
              { b: "The leaving disk’s used figure." },
              " The kernel set the disk’s size to zero at the start, so ",
              { code: "btrfs filesystem show" },
              " lists it with size 0.00B. Its used figure falls as each chunk leaves. That falling number is your progress bar.",
            ],
            [
              { b: "The kernel log." },
              " It gets one “relocating block group” line for every chunk the kernel moves.",
            ],
            [
              { b: "The sysfs file." },
              " While the removal runs, ",
              { code: "exclusive_operation" },
              " reads ",
              { code: "device remove" },
              ". Its path takes the filesystem UUID that ",
              { code: "btrfs filesystem show" },
              " prints.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "To stop a removal, run ",
            { code: "sudo btrfs device remove cancel /data" },
            ", which needs kernel 5.14 and btrfs-progs 5.13 or later. The disk gets its old size back and stays in the filesystem.",
          ],
        },
        {
          kind: "p",
          text: "Chunks already moved aren’t moved back. So running the removal again later has less left to do.",
        },
      ],
    },
    {
      id: "why-btrfs-device-remove-is-very-slow",
      title: "Why btrfs device remove is very slow: every chunk moves",
      blocks: [
        {
          kind: "p",
          text: "Removal is relocation, the same work a balance does. The btrfs-device man page warns that removal “can take long as it needs to move all data from the device.”",
        },
        { kind: "p", text: "Three things set its pace:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Every chunk on the disk moves," },
              " data and metadata, one block group at a time. For data, each move copies the extents, then updates every block pointer that refers to them. These are two separate stages in the kernel’s relocation code.",
            ],
            [
              { b: "Each cloud disk has its own throughput ceiling," },
              " set by its type and size, or by what you provision.",
            ],
            [
              { b: "Your application keeps using the same disks." },
              " Every read and write it makes competes with the relocation for the same IOPS and throughput. So a removal during the busy hours runs slower, and slows the application too.",
            ],
          ],
        },
        {
          kind: "p",
          text: "For scale, say the leaving disk reads at 125\u00a0MiB/s. Just reading 500\u00a0GiB off it takes 500 × 1,024\u00a0MiB ÷ 125\u00a0MiB/s = 4,096\u00a0seconds, about 68\u00a0minutes. That’s before any pointer updates, and the writes land on disks with ceilings of their own.",
        },
        {
          kind: "p",
          text: "A balance moves chunks the same way. The man page says that work “can take a while, because all metadata have to be moved and all block pointers updated.”",
        },
        {
          kind: "p",
          text: "The same page names disk seeking as “the key factor affecting performance.”",
        },
      ],
    },
    {
      id: "detach-and-delete-the-cloud-disk-to",
      title: "Detach and delete the cloud disk to stop paying for it",
      blocks: [
        {
          kind: "p",
          text: "Charges follow the Azure or AWS resource, not the filesystem. Microsoft’s warning reads: “If you detach a disk it is not automatically deleted.”",
        },
        {
          kind: "p",
          text: "AWS says you are “still charged for volume storage” after a detach. It adds that you “must delete a volume to avoid incurring further charges.”",
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
              { b: "Match the Linux device to its managed disk or EBS volume." },
              " On an Azure VM whose data disks attach over SCSI, the Azure Linux agent’s udev rules link each data disk’s LUN under /dev/disk/azure/scsi1/. The ",
              { code: "az vm show" },
              " command lists every data disk with its ",
              { code: "lun" },
              " and ",
              { code: "name" },
              ". On a Nitro-based EC2 instance, ",
              { code: "lsblk -o +SERIAL" },
              " shows the EBS volume ID as the serial number. It’s written without the hyphen after ",
              { code: "vol" },
              ".",
            ],
            [
              { b: "Snapshot first if in doubt." },
              " Deleting is permanent, so take a snapshot if you’re not sure the disk you’re about to delete is the one you emptied.",
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
            "On AWS, wait for the volume’s state to read ",
            { code: "available" },
            " before you delete it, because AWS won’t delete an attached volume:",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "aws ec2 detach-volume --volume-id <volume-id>\naws ec2 describe-volumes --volume-id <volume-id> --query 'Volumes[*].State' --output text\naws ec2 delete-volume --volume-id <volume-id>",
        },
        {
          kind: "p",
          text: "If the volume matches a Recycle Bin retention rule, AWS keeps it there instead of deleting it at once.",
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
      title: "How Amoeba removes a disk from its pool",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " optimizes block storage. It works on the data disks of running VMs: Azure managed disks and Amazon EBS volumes, on Windows and Linux VMs.",
          ],
        },
        {
          kind: "p",
          text: "It moves a VM’s data disks onto one btrfs pool, sized to your data, with room to grow. When your data goes down and stays down, Amoeba shrinks the pool one disk at a time. Each shrink is this procedure, automated.",
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
      title: "How to remove a disk from LVM without losing data",
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
