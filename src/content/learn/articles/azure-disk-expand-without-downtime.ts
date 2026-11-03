import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/azure-disk-expand-without-downtime/1";
import { figure as figure2 } from "@/features/learn/figures/azure-disk-expand-without-downtime/2";

export const article: Article = {
  slug: "azure-disk-expand-without-downtime",
  title: "Expand an Azure VM disk without downtime",
  meta: "Resize an Azure data disk while the VM runs: which disks qualify, az disk update, the Linux rescan, growpart, xfs_growfs and the OS disk limits.",
  h1: "Expand an Azure disk without downtime",
  deck: "The Azure and Linux steps for a data disk, the cases that need downtime, and why the cost stays.",
  card: "Grow a data disk while the VM runs: what qualifies, the rescan, growpart, and why the cost stays.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Azure block storage",
  published: "2026-11-01",
  updated: "2026-11-03",
  author: "vineet",
  cover: "/learn-covers/zoorik-learn-azure-disk-expand-without-downtime-1200x630.webp",
  coverAlt: "The data disk grows while the VM keeps running, but the OS disk does not",
  short:
    "Resize the managed disk in Azure, rescan the device in Linux, then grow the partition and the filesystem. Most data disks can do this while the VM runs. Three cases need downtime: an OS disk, a shared disk, and a Standard HDD, Standard SSD or Premium SSD disk that crosses 4\u00a0TiB.",
  sections: [
    {
      id: "azure-disk-expand-without-downtime",
      title: "What qualifies",
      blocks: [
        {
          kind: "p",
          text: [
            "Picture a 512\u00a0GiB ",
            { a: "Premium SSD", href: "/learn/glossary/azure-premium-ssd" },
            " data disk at ",
            { code: "/datadrive" },
            ", nearly full, on a VM whose application keeps writing. You can make it 1,024\u00a0GiB without stopping either one.",
          ],
        },
        {
          kind: "p",
          text: "The work happens at four layers: the managed disk, the device Linux sees, the partition and the filesystem. Each keeps its old size until its own step runs.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: "Microsoft calls expanding a disk without deallocating the VM “Expand without downtime”. The disk’s host cache setting doesn’t affect it. Whether a disk qualifies depends on its type, its size, the VM size and your tool.",
        },
        {
          kind: "table",
          columns: [
            { label: "Disk or situation", width: "40%" },
            { label: "Expand while the VM runs?", width: "14%" },
            { label: "What it takes", width: "46%" },
          ],
          rows: [
            [
              "Data disk on Standard HDD, Standard SSD or Premium SSD, ending at 4\u00a0TiB or less",
              "Yes",
              "A supported VM size, and the latest Azure CLI or Azure PowerShell, the portal, or an ARM template at API version 2021-04-01 or newer",
            ],
            [
              "The same disk types, growing from 4\u00a0TiB or less to more than 4\u00a0TiB",
              "No",
              "Deallocate the VM and detach the disk first",
            ],
            ["The same disk types, already larger than 4\u00a0TiB", "Yes", "As the first row"],
            [
              "Premium SSD v2 or Ultra Disk, any size",
              "Yes, on NVMe controllers too",
              "No expand while a background copy of data runs on the disk",
            ],
            [
              "Shared disk (maxShares above 1)",
              "No",
              "Detach it from every VM, or deallocate every VM it’s attached to",
            ],
            ["OS disk", "No", "Deallocate the VM"],
          ],
        },
        {
          kind: "p",
          text: "Some older (classic) VM sizes don’t support expanding without downtime. Microsoft’s PowerShell script lists the sizes in a region that do: those with Premium Storage, ephemeral OS disk support or Hyper-V Generation 2.",
        },
        {
          kind: "callout",
          label: "For engineers",
          text: [
            "On a VM size that doesn’t qualify, Azure refuses the change with ",
            { code: "LiveDiskPropertyChangeOfVMOfSizeNotSupported" },
            ". A shared disk returns ",
            { code: "LiveResizeSharedDiskNotAllowed" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "For a data disk on such a VM size, Microsoft’s fallback keeps the VM running but not the disk:",
        },
        {
          kind: "ol",
          items: [
            "Stop what uses the disk.",
            [
              "Unmount it and remove its ",
              { code: "/etc/fstab" },
              " line, as Microsoft’s detach guide shows.",
            ],
            "Detach the disk, resize it, then reattach and remount it.",
          ],
        },
      ],
    },
    {
      id: "how-to-increase-disk-size-in-azure",
      title: "Resize the disk in Azure",
      blocks: [
        {
          kind: "callout",
          label: "Watch out",
          text: "Microsoft says to back up the data first, and to check the filesystem’s health and that the partition table can hold the new size. On a master boot record (MBR) disk, space past 2\u00a0TiB is charged but out of reach without a GUID Partition Table (GPT).",
        },
        { kind: "h3", id: "find-the-disk", title: "Find the disk" },
        {
          kind: "p",
          text: "On a Linux VM with several data disks, match the mount that’s filling up to its device. Then match the device to its Azure logical unit number (LUN):",
        },
        { kind: "code", lang: "bash", code: "df -Th\nsudo ls -alF /dev/disk/azure/scsi1/" },
        {
          kind: "p",
          text: [
            "In Microsoft’s example, ",
            { code: "/dev/sdd1" },
            " holds ",
            { code: "/opt/db/data" },
            " at 98% full. The ",
            { code: "lun1 -> ../../../sdd" },
            " line shows it’s the disk at LUN 1 in the portal. On VMs with NVMe disks, the azure-vm-utils package links each data disk by LUN under ",
            { code: "/dev/disk/azure/data/by-lun/" },
            ".",
          ],
        },
        { kind: "h3", id: "resize-the-managed-disk", title: "Set the new size" },
        {
          kind: "p",
          text: "In the portal, open the VM and select Disks. Select the disk, then Size + performance, pick the larger size and select Resize. With the Azure CLI, it’s one command:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "az disk update \\\n    --resource-group <resource-group> \\\n    --name <disk-name> \\\n    --size-gb <new-size-gb>",
        },
        {
          kind: "p",
          text: [
            "The new size must be larger than the current one. On Premium SSD, Standard SSD and Standard HDD, you pay for a ",
            { a: "size tier", href: "/learn/glossary/azure-disk-sizes" },
            ". The size you set is rounded up to the nearest offered size.",
          ],
        },
        {
          kind: "p",
          text: [
            "Premium SSD v2 grows in 1\u00a0GiB steps and charges for each GiB you set. Our ",
            { a: "Azure disk pricing calculator", href: "/ebs-and-azure-disk-pricing" },
            " shows what a managed disk costs a month at list price.",
          ],
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "The 512\u00a0GiB Premium SSD above is a P20. Ask for 600\u00a0GiB and Azure moves it to a P30, charged as 1,024\u00a0GiB, for 600 − 512 = 88\u00a0GiB more space. Setting 1,024\u00a0GiB costs the same and gives you 1,024 − 600 = 424\u00a0GiB more.",
        },
        { kind: "svg", figure: figure2 },
      ],
    },
    {
      id: "resize-the-disk-without-a-reboot-rescan",
      title: "Rescan the device in Linux",
      blocks: [
        {
          kind: "p",
          text: "Linux reports the old size until the device is rescanned. That normally happens only at boot, but you can trigger the rescan yourself.",
        },
        {
          kind: "p",
          text: [
            "The commands below use ",
            { code: "/dev/sdc" },
            ", the LUN 0\u00a0disk in Microsoft’s example. Use your own device:",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "sudo fdisk -l /dev/sdc\necho 1 | sudo tee /sys/class/block/sdc/device/rescan\nsudo fdisk -l /dev/sdc",
        },
        {
          kind: "p",
          text: [
            "The first line of the second ",
            { code: "fdisk" },
            " output should show the new size. The partition inside still shows its old size.",
          ],
        },
        {
          kind: "p",
          text: [
            "This rescan is for ",
            { code: "sd" },
            " (SCSI) devices. Microsoft’s expand guide gives no rescan command for NVMe devices.",
          ],
        },
        {
          kind: "p",
          text: "On Ultra Disks and Premium SSD v2, allow up to 10\u00a0minutes for the new size to show. A rescan made sooner may need repeating. If repeated rescans don’t show it, Microsoft’s fallback is a VM restart, which is downtime.",
        },
      ],
    },
    {
      id: "how-to-expand-a-data-disk-on",
      title: "Grow the partition and filesystem",
      blocks: [
        { kind: "p", text: [{ code: "/datadrive" }, " stays mounted through every step below."] },
        {
          kind: "ol",
          items: [
            [
              "Grow the partition. ",
              { code: "growpart" },
              " expands the partition you name into the free space after it. With the gdisk package, it also handles GPT disks, which older versions of fdisk didn’t support. On Red Hat images, it comes in the ",
              { code: "cloud-utils-growpart" },
              " package, preinstalled on most marketplace images.",
            ],
          ],
        },
        { kind: "code", lang: "bash", code: "sudo growpart /dev/sdc 1" },
        {
          kind: "ol",
          start: 2,
          items: [
            [
              "Grow the filesystem with the tool for the Type column of ",
              { code: "df -Th" },
              ". XFS must be mounted to grow, so ",
              { code: "xfs_growfs" },
              " takes the mount point. For ext4, ",
              { a: { code: "resize2fs" }, href: "/learn/resize2fs-shrink-ext4" },
              " takes the device and grows the filesystem while it’s mounted.",
            ],
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "sudo xfs_growfs /datadrive    # XFS\nsudo resize2fs /dev/sdc1      # ext4",
        },
        { kind: "ol", start: 3, items: ["Check that the filesystem now shows the larger size."] },
        { kind: "code", lang: "bash", code: "df -Th /datadrive" },
        {
          kind: "p",
          text: [
            "If the partition holds a Logical Volume Manager (LVM) physical volume, run ",
            { code: "sudo pvresize /dev/sdc1" },
            " after ",
            { code: "growpart" },
            ". Then grow the logical volume with ",
            { code: "lvresize -r" },
            ", which resizes its filesystem in the same step.",
          ],
        },
        {
          kind: "p",
          text: "On a Windows VM, extend the volume instead, with Disk Management or DiskPart, as Microsoft’s Windows guide shows.",
        },
      ],
    },
    {
      id: "can-you-expand-the-os-disk-without",
      title: "OS disks need downtime",
      blocks: [
        {
          kind: "p",
          text: "Microsoft’s expand guides support expanding without downtime “only for data disks.” An OS disk needs the VM deallocated, so plan it as a maintenance window. The VM is down from step 2 to step 4.",
        },
        {
          kind: "ol",
          items: [
            "Take a full VM backup, or at least an OS disk snapshot, as Microsoft recommends.",
            [
              "Deallocate the VM with ",
              { code: "az vm deallocate" },
              ". Stopping it with ",
              { code: "az vm stop" },
              " won’t do, because that doesn’t release the compute resources.",
            ],
            ["Resize the OS disk with ", { code: "az disk update" }, "."],
            ["Start the VM with ", { code: "az vm start" }, "."],
            [
              "Grow the root partition and filesystem. On Ubuntu 16.x and newer, cloud-init grows them into the new space at boot. On SUSE and Red Hat images, run ",
              { code: "growpart" },
              ", then ",
              { code: "xfs_growfs" },
              " or ",
              { code: "resize2fs" },
              ". Where the root sits on LVM, follow ",
              { code: "growpart" },
              " with ",
              { code: "pvresize" },
              " and ",
              { code: "lvresize -r" },
              ".",
            ],
          ],
        },
        {
          kind: "h3",
          id: "azure-vm-os-disk-size-at-most",
          title: "OS disk size limit",
        },
        {
          kind: "p",
          text: "An OS disk holds at most 4,095\u00a0GiB. Many operating systems partition it with MBR by default, which caps the usable space at 2\u00a0TiB.",
        },
        {
          kind: "p",
          text: "For more than 2\u00a0TiB, Microsoft advises data disks, which you can also expand while the VM runs. If the data must sit on the OS disk, convert it to GPT.",
        },
      ],
    },
    {
      id: "why-you-keep-paying-for-the-new",
      title: "Why the cost stays",
      blocks: [
        {
          kind: "p",
          text: [
            "A ",
            { a: "managed disk", href: "/learn/glossary/azure-managed-disk" },
            " is charged on its provisioned size, prorated hourly, however much data it holds. Microsoft says shrinking a disk “isn’t supported and might result in data loss.” So an expand for a one-off peak, such as a bulk import or a migration, keeps costing you after the data goes.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Grow in whole tiers." },
              " On Premium SSD, Standard SSD and Standard HDD, set the full size of the tier you’ll pay for. Premium SSD v2 charges per GiB, so add only what you need.",
            ],
            [
              { b: "Raise the performance tier for IOPS." },
              " If a Premium SSD needs IOPS rather than space, raise its tier: a P20 gives 2,300\u00a0IOPS and a P30 5,000. You pay the higher tier’s rate while it’s set. Unlike a larger size, the tier can go back down to its baseline, once every 12\u00a0hours, and most tier changes need no downtime. ",
              { a: "Azure disk performance tiers", href: "/learn/azure-disk-performance-tiers" },
              " covers the rules.",
            ],
            [
              { b: "Grow when the disk fills." },
              " A data disk expands while the VM runs. So a ",
              { a: "disk space alert", href: "/learn/azure-vm-disk-space-alert" },
              " plus this procedure lets you buy less headroom up front.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Getting the space back means copying onto a smaller disk, and the services on that mount stop for the switch. ",
            { a: "Shrinking an Azure managed disk", href: "/learn/shrink-azure-managed-disk" },
            " walks through it.",
          ],
        },
      ],
    },
    {
      id: "how-amoeba-expands-a-pool-as-it",
      title: "Where Amoeba fits",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " rightsizes block storage on Azure and AWS, for Windows and Linux VMs. It moves a VM’s data disks onto one btrfs pool sized to your data, with room to grow.",
          ],
        },
        {
          kind: "p",
          text: "It grows the pool before it fills, and sooner when data arrives fast, while the pool stays mounted. You run no rescan, growpart or filesystem step.",
        },
        {
          kind: "p",
          text: "When your data goes down and stays down, Amoeba shrinks the pool one disk at a time. So you pay for close to what you use.",
        },
        {
          kind: "p",
          text: [
            "Amoeba rightsizes the pool without any downtime. The one move onto the pool gives the services that use the VM’s data mounts a short restart. ",
            {
              a: "Azure managed disk cost optimization",
              href: "/azure-managed-disk-cost-optimization",
            },
            " covers Amoeba on Azure in full.",
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
      title: "“Expand Virtual Hard Disks on a Linux VM”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/linux/expand-disks",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Expand Virtual Hard Disks Attached to a Windows VM in Azure”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/windows/expand-disks",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Troubleshoot Azure VM disk resize errors”",
      url: "https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-machines/windows/troubleshoot-disk-resize-errors",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Select a disk type for Azure IaaS VMs - managed disks”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-types",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Performance tiers for Azure Premium SSD managed disks”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-change-performance",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Detach a data disk from a Linux VM - Azure”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/linux/detach-disk",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Introduction to Azure virtual machine utilities (azure-vm-utils)”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/linux/azure-virtual-machine-utilities",
    },
    {
      publisher: "man7.org",
      title: "“resize2fs(8) - Linux manual page”",
      url: "https://man7.org/linux/man-pages/man8/resize2fs.8.html",
    },
    {
      publisher: "man7.org",
      title: "“xfs_growfs(8) - Linux manual page”",
      url: "https://man7.org/linux/man-pages/man8/xfs_growfs.8.html",
    },
  ],
  related: [
    {
      title: "Can you shrink an Azure managed disk?",
      where: "Learn",
      href: "/learn/shrink-azure-managed-disk",
    },
    {
      title: "How to set up an Azure VM disk space alert",
      where: "Learn",
      href: "/learn/azure-vm-disk-space-alert",
    },
    {
      title: "How to check Azure VM disk usage",
      where: "Learn",
      href: "/learn/azure-vm-disk-usage",
    },
    {
      title: "Azure disk performance tiers",
      where: "Learn",
      href: "/learn/azure-disk-performance-tiers",
    },
    {
      title: "Increase EBS volume size without downtime",
      where: "Learn",
      href: "/learn/increase-ebs-volume-size",
    },
  ],
};
