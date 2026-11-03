import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/shrink-azure-managed-disk/1";
import { figure as figure2 } from "@/features/learn/figures/shrink-azure-managed-disk/2";
import { figure as figure3 } from "@/features/learn/figures/shrink-azure-managed-disk/3";

export const article: Article = {
  slug: "shrink-azure-managed-disk",
  title: "Shrink an Azure managed disk",
  meta: "Azure can’t shrink a managed disk in place. How to copy a data disk to a smaller one on Linux, what an OS disk needs, and what each route costs.",
  h1: "Can you shrink an Azure managed disk?",
  deck: "Deleting files doesn’t reduce the cost: Azure charges a managed disk for its size, not its data.",
  card: "Not in place. Copy a data disk to a smaller one, or rebuild the VM for an OS disk.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Azure block storage",
  published: "2026-10-21",
  updated: "2026-11-03",
  author: "vineet",
  cover: "/learn-covers/zoorik-learn-shrink-azure-managed-disk-1200x630.webp",
  coverAlt:
    "Shrink an Azure managed disk? Shrink in place is crossed out, so copy to a new disk instead",
  short: [
    "No, you can’t shrink an ",
    { a: "Azure managed disk", href: "/learn/glossary/azure-managed-disk" },
    " in place. Microsoft says shrinking an existing disk “isn’t supported and might result in data loss.” For a data disk, copy the data to a new, smaller disk, move the mount and delete the old disk. An OS disk needs a new VM.",
  ],
  sections: [
    {
      id: "why-the-space-you-bought-stays-on",
      title: "How Azure charges a disk",
      blocks: [
        {
          kind: "p",
          text: "Azure charges a managed disk for its provisioned size. It “maps the provisioned size (rounded up) to the nearest offered disk size”. So a 200 GiB Standard SSD is charged as the 256 GiB size, E15.",
        },
        {
          kind: "p",
          text: [
            "Premium SSD and Standard SSD ",
            { a: "sizes are fixed", href: "/learn/glossary/azure-disk-sizes" },
            ", doubling from 4 GiB to 32,767 GiB. A 512 GiB ",
            { a: "Premium SSD", href: "/learn/glossary/azure-premium-ssd" },
            " (P20) costs the same whether it holds 500 GiB or 5 GiB.",
          ],
        },
        {
          kind: "p",
          text: "Premium SSD v2 has no fixed sizes. You pay for the GiB you provision, plus any IOPS and throughput above its free 3,000 IOPS and 125 MB/s.",
        },
        {
          kind: "p",
          text: "Say a VM has four 512 GiB data disks, 2,048 GiB in all, holding 1,000 GiB. More than half of what you pay for, 1,048 GiB, is empty.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: [
            { code: "fstrim" },
            " and the ",
            { code: "discard" },
            " mount option tell Azure which blocks are free. Microsoft says this saves money on disks charged for the storage they consume, “such as unmanaged standard disks and disk snapshots.” A managed disk is charged for its size, so it isn’t one of them.",
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
            ", with exceptions such as taking a Premium SSD past 4 TiB. When the data shrinks again, the size and its charge stay.",
          ],
        },
      ],
    },
    {
      id: "why-a-disk-cant-shrink-in-place",
      title: "Why it can’t shrink in place",
      blocks: [
        {
          kind: "p",
          text: "A disk is a block device, and its filesystem can place data in any block, including the last ones. Removing the end of the disk would destroy that data. A safe shrink must first move the data away from the end. Azure can’t do that from outside your VM.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: [
            "The filesystem has limits of its own, covered in ",
            { a: "shrinking ext4", href: "/learn/resize2fs-shrink-ext4" },
            " and ",
            { a: "shrinking XFS", href: "/learn/shrink-xfs-filesystem" },
            ". Whatever the filesystem, on Azure the route is a copy.",
          ],
        },
      ],
    },
    {
      id: "the-manual-route-copy-to-a-smaller",
      title: "Copy to a smaller disk",
      blocks: [
        {
          kind: "p",
          text: [
            "On a Linux VM, copy the data to a new, smaller disk in two ",
            { code: "rsync" },
            " passes, and stop services only for the second. The steps follow Microsoft’s attach and detach guides.",
          ],
        },
        {
          kind: "p",
          text: [
            "The examples use ",
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
          title: "Steps on a Linux VM",
        },
        {
          kind: "ol",
          items: [
            [
              { a: "Measure what each mount holds", href: "/learn/azure-vm-disk-usage" },
              " with ",
              { code: "df -Th" },
              ", then choose the new size. On Premium SSD and Standard SSD, pick one of the fixed sizes: a 1,100 GiB disk is charged as 2,048 GiB. ",
              { a: "Premium SSD v2", href: "/learn/premium-ssd-v2-vs-premium-ssd" },
              " has no fixed sizes, but in most regions with availability zones it attaches only to zonal VMs.",
            ],
          ],
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "Spread evenly, the example’s 1,000 GiB is 250 GiB on each 512 GiB disk. The next size down, 256 GiB, halves the charged size to 1,024 GiB but leaves each new disk 98% full. So on Premium SSD and Standard SSD, copy a disk only when its data, plus room to grow, fits in half its charged size.",
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
              "Copy the data while services run. Archive mode (",
              { code: "-a" },
              ") leaves out hard links, ACLs and extended attributes, so add ",
              { code: "-H" },
              ", ",
              { code: "-A" },
              " and ",
              { code: "-X" },
              ". The trailing slash on ",
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
              ". Your downtime starts here.",
            ],
            [
              "Copy what changed since the first pass. Between local paths, ",
              { code: "rsync" },
              " copies each changed file whole, so large changed files lengthen the downtime. ",
              { code: "--delete" },
              " removes files deleted from the old disk in the meantime.",
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
              ", read the new partition’s UUID with ",
              { code: "blkid" },
              ", and point the ",
              { code: "/datadrive" },
              " line at it. Reload systemd, which builds its mounts from that file. Then remount ",
              { code: "/datadrive" },
              " from the new line, so any mistake shows now.",
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
            "Start the services and check them. Your downtime ends here. Later, test a reboot in a quiet window.",
            "Detach the old disk. Microsoft warns that removing a data disk without editing fstab could stop the VM from booting. Step 7 already removed its line and unmounted it.",
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
              ", and you still pay for its size. For a way back, snapshot it first: a ",
              { a: "snapshot is charged", href: "/learn/azure-disk-snapshot-cost" },
              " only for the data it holds. Then delete the disk in the portal.",
            ],
          ],
        },
        { kind: "h3", id: "what-the-copy-costs-you", title: "What the copy costs" },
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
            [{ b: "Double cost." }, " You pay for both disks from step 2 to step 10."],
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
            "EBS volumes can’t shrink in place either. ",
            { a: "How to shrink an EBS volume", href: "/learn/shrink-ebs-volume" },
            " covers the AWS side.",
          ],
        },
      ],
    },
    {
      id: "can-you-reduce-the-os-disk-size",
      title: "Shrinking an OS disk",
      blocks: [
        {
          kind: "p",
          text: "You can’t swap in a smaller OS disk. Azure can swap a VM’s OS disk for another managed disk, but only when “the current and replacement OS disks are the same size.”",
        },
        {
          kind: "p",
          text: [
            "The copy above doesn’t work for an OS disk, which also holds the partitions the VM boots from (",
            { code: "/boot" },
            " and ",
            { code: "/boot/efi" },
            " in Microsoft’s examples). Even growing an OS disk takes the VM down: expanding without downtime “is supported only for data disks.”",
          ],
        },
        {
          kind: "p",
          text: "So a smaller OS disk means a new VM. Your services are down from when they stop on the old VM until they start on the new one.",
        },
        {
          kind: "callout",
          label: "Rule of thumb",
          text: "An OS disk that was never expanded is rarely worth a rebuild. Microsoft says the default Linux OS disk is typically 30 GB, which Premium SSD or Standard SSD charges as the 32 GiB size.",
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
      title: "How Amoeba rightsizes data disks",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " makes this copy for you, once, on the data disks of running Windows and Linux VMs. Then it rightsizes them without any downtime. It never touches the OS disk.",
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
              " Amoeba copies your data while your services run. Then it switches each mount to the pool, with a short restart of the services that use it. If the switch fails, it puts the original mounts back and tries again.",
            ],
            [
              { b: "The old disks." },
              " Once the switch is checked, Amoeba snapshots each old disk and deletes the disk. It keeps the snapshot for 7 days, then deletes it too.",
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
            "The trade-offs: you pay for both sets of disks only while the move runs, then for the snapshots while they’re kept. Data on ",
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
            " covers the move and what a VM needs.",
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
      title: "Azure disk reservations: are they worth it?",
      where: "Learn",
      href: "/learn/azure-disk-reservations",
    },
    {
      title: "How to shrink an EBS volume",
      where: "Learn",
      href: "/learn/shrink-ebs-volume",
    },
  ],
  relatedTitle: "More on resizing Azure disks",
};
