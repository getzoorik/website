import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/shrink-azure-managed-disk/1";
import { figure as figure2 } from "@/features/learn/figures/shrink-azure-managed-disk/2";
import { figure as figure3 } from "@/features/learn/figures/shrink-azure-managed-disk/3";

export const article: Article = {
  slug: "shrink-azure-managed-disk",
  title: "Reduce Azure disk size: can a managed disk shrink?",
  meta: "You can’t reduce Azure disk size in place: managed disks only grow. The copy route step by step, the OS disk case, and how Amoeba rightsizes data disks.",
  h1: "Can you shrink an Azure managed disk?",
  deck: "Not in place. How to reduce Azure disk size by copying, what it costs you, and how Amoeba rightsizes data disks.",
  card: "Not in place. The copy route, the OS disk case, and how Amoeba rightsizes data disks into one pool.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Azure block storage",
  published: "2026-10-21",
  updated: "2026-11-01",
  author: "vineet",
  cover: "/learn-covers/zoorik-learn-shrink-azure-managed-disk-1200x630.webp",
  coverAlt:
    "Shrink an Azure managed disk? Shrink in place is crossed out, so copy to a new disk instead",
  short: [
    "No, you can’t shrink an ",
    { a: "Azure managed disk", href: "/learn/glossary/azure-managed-disk" },
    " in place. A managed disk can grow but never get smaller: Microsoft Learn says shrinking an existing disk “isn’t supported and might result in data loss.” To reduce Azure disk size, you copy the data to a new, smaller disk, move the mount and delete the old disk. That works for data disks, but an OS disk needs a new VM.",
  ],
  sections: [
    {
      id: "why-the-space-you-bought-stays-on",
      title: "Why you keep paying for the space you bought",
      blocks: [
        {
          kind: "p",
          text: "Picture a VM with four 512\u00a0GiB data disks, 2,048\u00a0GiB in all, holding 1,000\u00a0GiB. More than half of what you pay for (1,048\u00a0GiB) is empty. Deleting files won’t reduce the cost.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: "You pay for a managed disk’s provisioned size, not for the data it holds. Azure “maps the provisioned size (rounded up) to the nearest offered disk size”. So a 200\u00a0GiB Standard SSD is charged at the 256\u00a0GiB size, which Azure calls E15.",
        },
        {
          kind: "p",
          text: [
            "Premium SSD and Standard SSD come in fixed ",
            { a: "Azure disk sizes", href: "/learn/glossary/azure-disk-sizes" },
            " that double from 4\u00a0GiB to 32,767\u00a0GiB. A 512\u00a0GiB ",
            { a: "Premium SSD", href: "/learn/glossary/azure-premium-ssd" },
            " (size P20) therefore costs the same whether it holds 500\u00a0GiB or 5\u00a0GiB.",
          ],
        },
        {
          kind: "p",
          text: "Premium SSD v2 has no fixed sizes. You pay for the GiB you provision, plus any IOPS and throughput above its included 3,000\u00a0IOPS and 125\u00a0MB/s.",
        },
        {
          kind: "p",
          text: [
            { code: "fstrim" },
            " and the ",
            { code: "discard" },
            " mount option tell Azure which blocks are free. Microsoft notes this saves money on disks charged for the storage they consume, “such as unmanaged standard disks and disk snapshots.” A managed disk isn’t one of them.",
          ],
        },
        {
          kind: "p",
          text: [
            "Azure can ",
            {
              a: "expand a data disk without deallocating the VM",
              href: "/learn/azure-disk-expand-without-downtime",
            },
            ", with exceptions such as taking a Premium SSD past 4\u00a0TiB. But when the data shrinks again, the space and its charge both stay. ",
            { a: "Azure disk cost optimization", href: "/learn/azure-disk-reservations" },
            " covers the rest of what you pay for disks.",
          ],
        },
      ],
    },
    {
      id: "why-a-disk-cant-shrink-in-place",
      title: "Why a disk can’t shrink in place",
      blocks: [
        {
          kind: "p",
          text: "Shrinking a disk in place would destroy whatever sits in its last blocks. A disk is a block device, and its filesystem can place data in any block, including the last ones. A safe shrink must first move that data away from the end, which Azure can’t do from outside your VM.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: [
            "The filesystem has limits of its own, which ",
            { a: "shrinking ext4", href: "/learn/resize2fs-shrink-ext4" },
            " and ",
            { a: "shrinking XFS", href: "/learn/shrink-xfs-filesystem" },
            " cover. Whatever the filesystem, on Azure the route is a copy.",
          ],
        },
      ],
    },
    {
      id: "the-manual-route-copy-to-a-smaller",
      title: "How to reduce Azure disk size",
      blocks: [
        {
          kind: "p",
          text: [
            "On a Linux VM, you shrink an Azure data disk by copying its data to a new, smaller disk in two ",
            { code: "rsync" },
            " passes, stopping the services on that mount only for the second. The steps follow Microsoft Learn’s attach and detach guides, with ",
            { code: "/datadrive" },
            " as the data mount and ",
            { code: "/dev/sdc" },
            " as the new disk. With an NVMe controller, the new disk and its partition are paths such as ",
            { code: "/dev/nvme0n2" },
            " and ",
            { code: "/dev/nvme0n2p1" },
            ".",
          ],
        },
        {
          kind: "h3",
          id: "copy-the-data-to-a-smaller-disk",
          title: "Copy the data to a smaller disk",
        },
        {
          kind: "ol",
          items: [
            [
              { a: "Measure what each mount holds", href: "/learn/azure-vm-disk-usage" },
              " with ",
              { code: "df -Th" },
              ", then choose the new size. On Premium SSD and Standard SSD, pick a step size, since a 1,100\u00a0GiB disk is charged as 2,048\u00a0GiB. ",
              { a: "Premium SSD v2", href: "/learn/premium-ssd-v2-vs-premium-ssd" },
              " has no steps, but it can’t be an OS disk. In most regions with availability zones, it attaches only to zonal VMs.",
            ],
          ],
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "Spread evenly, the example’s 1,000\u00a0GiB puts 1,000 ÷ 4 = 250\u00a0GiB on each 512\u00a0GiB disk. Copying each one to the next step down, 256\u00a0GiB, halves the charged size to 1,024\u00a0GiB but leaves every new disk 98% full. So on Premium SSD and Standard SSD, copy a disk only when its data, plus the room you want, fits in half its charged size. This VM passes only if 6\u00a0GiB of room per disk (256 − 250) is enough.",
        },
        {
          kind: "ol",
          start: 2,
          items: [
            "In the Azure portal, open the VM’s Disks pane and select Create and attach a new disk. Set its Storage type and Size (GiB), then select Save.",
            [
              "Partition, format and mount the new disk at a temporary path. ",
              { code: "parted" },
              " and ",
              { code: "mkfs.xfs" },
              " erase the device you name, so first check with ",
              { code: "lsblk" },
              " that ",
              { code: "/dev/sdc" },
              " is the new, empty disk.",
            ],
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "sudo parted /dev/sdc --script mklabel gpt mkpart xfspart xfs 0% 100%\nsudo partprobe /dev/sdc\nsudo mkfs.xfs /dev/sdc1\nsudo mkdir /mnt/newdisk\nsudo mount /dev/sdc1 /mnt/newdisk",
        },
        {
          kind: "ol",
          start: 4,
          items: [
            [
              "Copy the data while services keep running. Archive mode (",
              { code: "-a" },
              ") leaves out hard links, ACLs and extended attributes, which ",
              { code: "-H" },
              ", ",
              { code: "-A" },
              " and ",
              { code: "-X" },
              " add back. The trailing slash on ",
              { code: "/datadrive/" },
              " copies its contents.",
            ],
          ],
        },
        { kind: "code", lang: "bash", code: "sudo rsync -aHAX /datadrive/ /mnt/newdisk/" },
        {
          kind: "ol",
          start: 5,
          items: [
            [
              "Stop every service that has files open on ",
              { code: "/datadrive" },
              ", which is where your downtime starts.",
            ],
            [
              "Copy what changed since the first pass. Between local paths ",
              { code: "rsync" },
              " copies each changed file whole, so large changed files lengthen the downtime. ",
              { code: "--delete" },
              " removes any file deleted from the old disk in the meantime.",
            ],
          ],
        },
        { kind: "code", lang: "bash", code: "sudo rsync -aHAX --delete /datadrive/ /mnt/newdisk/" },
        {
          kind: "ol",
          start: 7,
          items: [
            [
              "Back up ",
              { code: "/etc/fstab" },
              ", read the new partition’s UUID from ",
              { code: "blkid" },
              ", and point the ",
              { code: "/datadrive" },
              " line at that UUID. Reload systemd, which builds its mounts from that file, then remount ",
              { code: "/datadrive" },
              " from the new line so any mistake shows now.",
            ],
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "sudo cp /etc/fstab /etc/fstab.bak\nsudo blkid\n# In /etc/fstab, the /datadrive line becomes:\n# UUID=<new-uuid>   /datadrive   xfs   defaults,nofail   1   2\nsudo systemctl daemon-reload\nsudo umount /mnt/newdisk\nsudo umount /datadrive\nsudo systemctl start /datadrive",
        },
        {
          kind: "ol",
          start: 8,
          items: [
            "Start the services and check them, which ends the downtime. Later, test a reboot in a quiet window.",
            "Detach the old disk. Microsoft notes that removing a data disk without editing fstab could stop the VM from booting, so detach it only after its line is gone and it’s unmounted.",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "az vm disk detach -g <resource-group> --vm-name <vm-name> -n <old-disk-name>",
        },
        {
          kind: "ol",
          start: 10,
          items: [
            [
              "Delete the old disk once you’re sure. A ",
              { a: "detached disk isn’t deleted", href: "/learn/find-unattached-disks-azure" },
              ", and you still pay for its provisioned size. Snapshot it first if you want a way back (a ",
              { a: "snapshot is charged", href: "/learn/azure-disk-snapshot-cost" },
              " only for the data it holds), then delete it in the portal.",
            ],
          ],
        },
        { kind: "h3", id: "what-the-copy-costs-you", title: "What the copy costs you" },
        {
          kind: "ul",
          items: [
            [{ b: "Downtime." }, " Steps 5 to 8, for every service on that mount."],
            [
              { b: "Risk." },
              " A mistake in ",
              { code: "/etc/fstab" },
              " can stop the VM from booting. Microsoft’s example adds ",
              { code: "nofail" },
              ", which “ensures that the VM starts even if the file system is corrupt or the disk doesn’t exist at boot time.”",
            ],
            [
              { b: "Double cost." },
              " You pay for both disks from step 2 to step 10, the old one until you delete it.",
            ],
            [
              { b: "A new fixed size." },
              " When the data grows you expand again, and when it shrinks you copy again.",
            ],
          ],
        },
        { kind: "svg", figure: figure3 },
        {
          kind: "p",
          text: [
            "EBS volumes can’t shrink in place either: ",
            { a: "how to shrink an EBS volume", href: "/learn/shrink-ebs-volume" },
            " walks through the AWS side.",
          ],
        },
      ],
    },
    {
      id: "can-you-reduce-the-os-disk-size",
      title: "Can you reduce the OS disk size in Azure?",
      blocks: [
        {
          kind: "p",
          text: [
            "Not in place, and not by swapping in a smaller disk. Azure can swap a VM’s OS disk for another managed disk, but Microsoft requires that “the current and replacement OS disks are the same size.” The file copy above doesn’t fit an OS disk, which also holds the partitions the VM boots from (",
            { code: "/boot" },
            " and ",
            { code: "/boot/efi" },
            " in Microsoft’s examples). Even growing an OS disk takes the VM down, because expanding without downtime “is supported only for data disks.”",
          ],
        },
        {
          kind: "p",
          text: "So a smaller OS disk means a new VM, and downtime from when your services stop on the old VM until they start on the new one.",
        },
        {
          kind: "callout",
          label: "Rule of thumb",
          text: "An OS disk that was never expanded is rarely worth a rebuild. Microsoft says the default OS disk on a Linux VM is typically 30\u00a0GB. Premium SSD or Standard SSD charges it at the 32\u00a0GiB step.",
        },
        {
          kind: "ol",
          items: [
            "Create the new VM from the same marketplace image with the default OS disk size, and install your software.",
            "Detach the data disks from the old VM and attach them to the new one.",
            ["Add their ", { code: "/etc/fstab" }, " lines on the new VM."],
            "Start the services, then delete the old VM and its OS disk.",
          ],
        },
      ],
    },
    {
      id: "how-amoeba-rightsizes-data-disks",
      title: "How Amoeba rightsizes the data disks",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " makes the copy once, onto a pool of disks, then rightsizes that pool autonomously while your services keep running. It works on the data disks of running Windows and Linux VMs. It never touches the OS disk.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "The pool." },
              " Amoeba moves the VM’s data disks onto one ",
              { a: "btrfs pool", href: "/learn/btrfs-multiple-disks" },
              " sized to your data, with room to grow. On Azure the pool uses Premium SSD v2 where your VM’s region and zone offer it, and Premium SSD otherwise.",
            ],
            [
              { b: "The move." },
              " The services that use those mounts restart once, at the switch onto the pool.",
            ],
            [
              { b: "The old disks." },
              " Once the switch is checked, Amoeba snapshots each old disk and deletes the disk. It keeps each snapshot for 7 days, then deletes it too.",
            ],
            [
              { b: "Rightsizing." },
              " Amoeba grows the pool before it fills, and sooner when data arrives fast. When your data goes down and stays down, it shrinks the pool one disk at a time. So you pay for close to what you use.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "What you give up: you pay for both sets of disks only while the move runs, and then for the snapshots while they’re kept. Data on ",
            { a: "zone-redundant (ZRS) disks", href: "/learn/azure-disk-lrs-vs-zrs" },
            " moves to a locally redundant pool and loses its zone redundancy.",
          ],
        },
        {
          kind: "p",
          text: [
            {
              a: "Azure managed disk cost optimization",
              href: "/azure-managed-disk-cost-optimization",
            },
            " covers the move and what a VM needs in full.",
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
      publisher: "Microsoft Learn",
      title: "“Expand virtual hard disks on a Linux VM”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/linux/expand-disks",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Select a disk type for Azure IaaS VMs - managed disks”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-types",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Use the portal to attach a data disk to a Linux VM”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/linux/attach-disk-portal",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Detach a data disk from a Linux VM”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/linux/detach-disk",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Swap between OS disks using the Azure CLI”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/linux/os-disk-swap",
    },
    {
      publisher: "AWS",
      title: "“Modify an Amazon EBS volume using Elastic Volumes operations”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-modify-volume.html",
    },
    {
      publisher: "man7.org",
      title: "“systemd.generator(7) - Linux manual page”",
      url: "https://man7.org/linux/man-pages/man7/systemd.generator.7.html",
    },
    {
      publisher: "man7.org",
      title: "“rsync(1) - Linux manual page”",
      url: "https://man7.org/linux/man-pages/man1/rsync.1.html",
    },
  ],
  related: [
    {
      title: "Do my applications need changes?",
      where: "Amoeba FAQ",
      href: "/amoeba-faq#do-my-applications-need-changes",
    },
    {
      title: "Can a shrink lose data?",
      where: "Amoeba FAQ",
      href: "/amoeba-faq#can-a-shrink-lose-data",
    },
    {
      title: "Azure disk cost optimization: stop paying for empty space",
      where: "Learn",
      href: "/learn/azure-disk-reservations",
    },
    {
      title: "How to shrink an EBS volume when AWS only lets it grow",
      where: "Learn",
      href: "/learn/shrink-ebs-volume",
    },
  ],
};
