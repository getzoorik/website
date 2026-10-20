import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/shrink-azure-managed-disk/1";
import { figure as figure2 } from "@/features/learn/figures/shrink-azure-managed-disk/2";

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
  published: "2026-10-22",
  updated: "2026-10-22",
  author: "vineet",
  shareCard: {
    url: "/og/zoorik-learn-shrink-azure-managed-disk-1200x630.png",
    alt: "Zoorik. Can you shrink an Azure managed disk?",
  },
  short:
    "No, you can’t shrink an Azure managed disk in place. A managed disk can grow but never get smaller: Microsoft Learn says shrinking an existing disk “isn’t supported and might result in data loss.” To reduce Azure disk size, you copy the data to a new, smaller disk, move the mount and delete the old disk. That works for data disks. An OS disk needs a new VM, and Amazon Elastic Block Store (EBS) volumes follow the same rule.",
  sections: [
    {
      id: "why-the-space-you-bought-stays-on",
      title: "Why the space you bought stays on the bill",
      blocks: [
        {
          kind: "p",
          text: "A managed disk is billed on the size you provision, not on the data it holds. Azure “maps the provisioned size (rounded up) to the nearest offered disk size”, so a 200\u00a0GiB Standard SSD is billed as an E15, which is 256\u00a0GiB. Premium SSD and Standard SSD come in sizes that double from 4\u00a0GiB up to 32,767\u00a0GiB. A 512\u00a0GiB Premium SSD (a P20) therefore costs the same whether it holds 500\u00a0GiB or 5\u00a0GiB. Premium SSD v2 has no fixed sizes: it’s billed for the GiB you provision, plus any IOPS and throughput above its included 3,000\u00a0IOPS and 125\u00a0MB/s.",
        },
        {
          kind: "p",
          text: [
            "Deleting files doesn’t change that. ",
            { code: "fstrim" },
            " and the ",
            { code: "discard" },
            " mount option tell Azure which blocks are free, but Microsoft notes this saves money on disks billed for the storage they consume, “such as unmanaged standard disks and disk snapshots.” A managed disk isn’t one of them.",
          ],
        },
        {
          kind: "p",
          text: [
            "Disks grow for good reasons: a migration, a bulk import, a log spike, a busy season. Growing is easy, because Azure can ",
            {
              a: "expand a data disk without deallocating the VM",
              href: "/learn/azure-disk-expand-without-downtime",
            },
            " within limits such as crossing 4\u00a0TiB on Premium SSD. When the data shrinks again, the space and its charge both stay.",
          ],
        },
        {
          kind: "p",
          text: [
            "The worked example on the Amoeba page shows the effect: a VM with four 512\u00a0GiB data disks, 2,048\u00a0GiB in all, holding 1,000\u00a0GiB of data. More than half of what is billed is empty. ",
            { a: "Azure VM disk usage", href: "/learn/azure-vm-disk-usage" },
            " shows how to measure the same gap on your own VMs, and ",
            { a: "Azure disk cost optimization", href: "/learn/azure-disk-cost-optimization" },
            " covers the rest of the disk bill.",
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
          text: "A disk is a block device, and the filesystem on it can place data in any block, including the last ones. Truncating the device would destroy whatever sits in those blocks. A safe shrink needs the filesystem to move its data away from the end first, and Azure can’t do that from outside your VM. So Azure will resize a disk larger, but never resize a disk smaller.",
        },
        { kind: "diagram", figure: figure1 },
        {
          kind: "p",
          text: [
            "The filesystem has limits of its own. XFS, the filesystem in Microsoft’s data disk example, has only a partial shrink: the ",
            { code: "xfs_growfs" },
            " man page notes that “only shrinking the last AG without removing it is implemented”, where an AG is an allocation group. Whatever the filesystem, the answer to how to shrink an Azure disk is a copy. ",
            { a: "Shrinking ext4", href: "/learn/resize2fs-shrink-ext4" },
            " and ",
            { a: "shrinking XFS", href: "/learn/shrink-xfs-filesystem" },
            " have their own articles.",
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
            "To reduce the size of an Azure managed disk that holds data, you copy the data to a new, smaller disk in two ",
            { code: "rsync" },
            " passes, and stop the services on that mount only for the second. The steps follow Microsoft Learn’s attach and detach guides for a Linux VM, with ",
            { code: "/datadrive" },
            " as the data mount and ",
            { code: "/dev/sdc" },
            " as the new disk. On a VM with an NVMe controller, the new disk is a path such as ",
            { code: "/dev/nvme0n2" },
            ", with its partition at ",
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
              "Measure what each mount holds with ",
              { code: "df -Th" },
              ", then choose the new size. On Premium SSD and Standard SSD, pick a size at one of the steps, since a 1,100\u00a0GiB disk is billed as 2,048\u00a0GiB. Premium SSD v2 bills exactly the GiB you set, but it can’t be an OS disk, and in most regions with availability zones it attaches only to zonal VMs (",
              { a: "Premium SSD v2 vs Premium SSD", href: "/learn/premium-ssd-v2-vs-premium-ssd" },
              " compares the two).",
            ],
            "In the Azure portal, open the VM’s Disks pane, select Create and attach a new disk, set its Storage type and Size (GiB), then select Save.",
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
              "Copy the data while the application keeps running. Archive mode (",
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
              "Stop every service that writes to ",
              { code: "/datadrive" },
              ", which is where your downtime starts.",
            ],
            [
              "Copy what changed since the first pass, with ",
              { code: "--delete" },
              " removing any file that was deleted from the old disk in the meantime.",
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
              " line at that UUID. Then move the mount.",
            ],
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "sudo cp /etc/fstab /etc/fstab.bak\nsudo blkid\n# In /etc/fstab, the /datadrive line becomes:\n# UUID=<new-uuid>   /datadrive   xfs   defaults,nofail   1   2\nsudo umount /mnt/newdisk\nsudo umount /datadrive\nsudo mount /dev/sdc1 /datadrive",
        },
        {
          kind: "ol",
          start: 8,
          items: [
            [
              "Start the services and check them, which ends the downtime. Later, test a reboot in a quiet window to prove the new ",
              { code: "/etc/fstab" },
              " line.",
            ],
            [
              "Retire the old disk. Microsoft notes that removing a data disk without editing fstab could stop the VM from booting, so detach it only after its line is gone and it’s unmounted. A ",
              { a: "detached disk isn’t deleted", href: "/learn/find-unattached-disks-azure" },
              " and still bills for its provisioned size. Snapshot it first if you want a way back (a ",
              { a: "snapshot is billed", href: "/learn/azure-disk-snapshot-cost" },
              " only for the data it holds), then delete the disk in the portal once you’re sure.",
            ],
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "az vm disk detach -g <resource-group> --vm-name <vm-name> -n <old-disk-name>",
        },
        { kind: "h3", id: "what-the-copy-costs-you", title: "What the copy costs you" },
        {
          kind: "ul",
          items: [
            "Downtime from step 5 to step 8, for every service on that mount.",
            [
              "Risk: a mistake in ",
              { code: "/etc/fstab" },
              " can stop the VM from booting. Microsoft’s example adds ",
              { code: "nofail" },
              ", which “ensures that the VM starts even if the file system is corrupt or the disk doesn’t exist at boot time.”",
            ],
            "Both disks on the bill while you work, and the old one until you delete it.",
            "A new fixed size: when the data grows you expand again, and when it shrinks you copy again.",
          ],
        },
        { kind: "diagram", figure: figure2 },
      ],
    },
    {
      id: "can-you-reduce-the-os-disk-size",
      title: "Can you reduce the OS disk size in Azure?",
      blocks: [
        {
          kind: "p",
          text: [
            "Not in place, and not by swapping in a smaller disk. Azure can swap a VM’s OS disk for another managed disk, but Microsoft lists as a requirement that “the current and replacement OS disks are the same size.” The file copy above doesn’t fit an OS disk, which also holds the partitions the VM boots from (",
            { code: "/boot" },
            " and ",
            { code: "/boot/efi" },
            " in Microsoft’s examples). Even growing an OS disk takes the VM down, because expanding without downtime “is supported only for data disks.”",
          ],
        },
        {
          kind: "p",
          text: [
            "So a smaller OS disk means a new VM. Create it from the same marketplace image with the default OS disk size, install your software, then detach the data disks from the old VM, attach them to the new one and add their ",
            { code: "/etc/fstab" },
            " lines there. Your services are down from the moment they stop on the old VM until they start on the new one.",
          ],
        },
        {
          kind: "p",
          text: "Check the gain first. Microsoft says the default OS disk on a Linux VM is typically 30\u00a0GB, which Premium SSD or Standard SSD bills at the 32\u00a0GiB step. An OS disk that was never expanded is rarely worth a rebuild. Amoeba works on data disks only and leaves the OS disk as it is.",
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
            " makes the copy once, onto a pool of disks, then rightsizes that pool autonomously, without any downtime after the one switch. It works on the data disks of running VMs.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "The pool." },
              " Amoeba installs its agent through Azure Run Command and builds one btrfs pool beside your disks, on Premium SSD v2 where the region and zone offer it and on Premium SSD otherwise. It sizes the pool from the highest use of the last 7\u00a0days, so the pool sits inside its target band with room for the largest recent 15-minute rise and at least 10\u00a0GiB free. Each data mount becomes a subvolume mounted at its old path.",
            ],
            [
              { b: "The copy." },
              " The agent copies each data mount onto the pool with ",
              { code: "rsync" },
              " while your services keep running.",
            ],
            [
              { b: "The switch." },
              " The agent stops the systemd services that hold the data mounts open, checks that the final ",
              { code: "rsync" },
              " pass has nothing left to copy, and mounts the pool at the same paths. Then it starts the services again, and that restart is the service interruption. If the switch fails, the agent restores the original mounts and Amoeba tries again, so services can restart more than once, as the guide explains ",
              { a: "at the switch", href: "/amoeba/guide#at-the-switch" },
              ".",
            ],
            [
              { b: "The soak." },
              " For 2\u00a0hours, any disk error, or p99\u00a0disk latency above 1.2 times its level before the switch, pauses the move. A move only goes forward. After the soak, Amoeba detaches each source disk, takes an incremental snapshot of it, and deletes the disk once its snapshot is complete, keeping that snapshot for 7\u00a0days.",
            ],
            [
              { b: "After the move." },
              " Amoeba holds the pool 80% to 90% full by default. When data grows, it grows a disk in place or adds one while the pool stays mounted. Shrinks start once the move is done and 7 full days of data are in. Then, one disk at a time, the agent moves that disk’s data onto the others with ",
              { code: "btrfs device remove" },
              ", and Amoeba detaches and deletes the empty disk, which stops its billing. In “Manual” each shrink waits for you.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "What you give up: you pay for both sets of disks from the moment the pool’s disks are created until the source disks are deleted after the soak, then for the snapshots for 7\u00a0days. Data on ",
            { a: "zone-redundant (ZRS) disks", href: "/learn/azure-disk-lrs-vs-zrs" },
            " moves to a locally redundant pool and loses its zone redundancy. Amoeba works on Windows and Linux VMs. On Linux, it needs systemd, kernel 5.14 or later and btrfs loaded or loadable. The VM needs 3 free data-disk slots: 2 for the pool and 1 kept free for an urgent expand. Every process that keeps a data mount open must run as a systemd service. VMs in the Red Hat family are not moved.",
          ],
        },
      ],
    },
    {
      id: "what-about-amazon-ebs",
      title: "What about Amazon EBS?",
      blocks: [
        {
          kind: "p",
          text: [
            "The same rule holds on AWS. Elastic Volumes let you increase an EBS volume’s size, change its type or adjust its performance, without detaching it if the instance supports Elastic Volumes. AWS lists the limit plainly: “You can’t decrease the volume size.” Its suggested route is the copy above: create a smaller volume and migrate the data to it with an application-level tool such as ",
            { code: "rsync" },
            ". ",
            { a: "How to shrink an EBS volume", href: "/learn/shrink-ebs-volume" },
            " walks through the AWS side.",
          ],
        },
        {
          kind: "p",
          text: "Amoeba does the same job on AWS: it pools the EBS data volumes of running EC2 instances onto gp3\u00a0volumes in the instance’s Availability Zone and never touches the root volume. It installs its agent through AWS Systems Manager Run Command, on Nitro instances that Systems Manager manages. After the soak, it takes an EBS snapshot of each source volume before deleting it.",
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
      title: "“xfs_growfs(8) - Linux manual page”",
      url: "https://man7.org/linux/man-pages/man8/xfs_growfs.8.html",
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
      href: "/amoeba/faq#do-my-applications-need-changes",
    },
    {
      title: "Can a shrink lose data?",
      where: "Amoeba FAQ",
      href: "/amoeba/faq#can-a-shrink-lose-data",
    },
    {
      title: "Azure disk cost optimization: stop paying for empty space",
      where: "Learn",
      href: "/learn/azure-disk-cost-optimization",
    },
    {
      title: "How to shrink an EBS volume when AWS only lets it grow",
      where: "Learn",
      href: "/learn/shrink-ebs-volume",
    },
  ],
};
