import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/azure-disk-expand-without-downtime/1";

export const article: Article = {
  slug: "azure-disk-expand-without-downtime",
  title: "Azure disk expand without downtime, step by step",
  meta: "Azure disk expand without downtime works for most data disks. The limits, az disk update, the rescan, growpart and xfs_growfs, and why the new size stays.",
  h1: "How to expand an Azure disk without downtime",
  deck: "Grow the managed disk, rescan it, then grow the partition and filesystem while the VM keeps running.",
  card: "Grow a managed data disk while the VM runs: the limits, the rescan, growpart, and why the size stays.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Azure block storage",
  published: "2026-11-06",
  updated: "2026-11-06",
  author: "vineet",
  short: [
    "You can expand most Azure managed data disks without downtime. Raise the disk’s size in the portal or with ",
    { code: "az disk update" },
    " while the VM runs, rescan the device in Linux, then grow the partition and filesystem while it stays mounted. OS disks, shared disks, and Standard HDD, Standard SSD or Premium SSD disks crossing 4\u00a0TiB need the VM deallocated, the disk detached, or both. The new size stays on the bill, because a managed disk can’t shrink.",
  ],
  sections: [
    {
      id: "azure-disk-expand-without-downtime-what-qualifies",
      title: "Azure disk expand without downtime: what qualifies",
      blocks: [
        {
          kind: "p",
          text: "Microsoft calls the feature “Expand without downtime”: you can expand a managed disk without deallocating the VM, whatever its host cache setting. Whether you can expand a disk in Azure without downtime depends on the disk’s type and size, the VM size and the tool you use.",
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
              "A VM size that supports it, and the latest Azure CLI, Azure PowerShell, the portal, or an ARM template with API version 2021-04-01 or newer",
            ],
            [
              "The same disk types, growing from 4\u00a0TiB or less to more than 4\u00a0TiB",
              "No",
              "Deallocate the VM and detach the disk first",
            ],
            ["The same disk types, already larger than 4\u00a0TiB", "Yes", "As the first row"],
            [
              "Premium SSD v2 or Ultra Disk, any size",
              "Yes, including disks on NVMe controllers",
              "No expand while a background copy of data is running on the disk",
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
          text: [
            "The VM size matters too. Microsoft’s troubleshooting guide says sizes that support expanding a disk while the VM runs include those with Premium Storage capability, ephemeral OS disk support or Hyper-V Generation 2. If yours doesn’t, Azure refuses the change with ",
            { code: "LiveDiskPropertyChangeOfVMOfSizeNotSupported" },
            ", and a shared disk returns ",
            { code: "LiveResizeSharedDiskNotAllowed" },
            ". The guide carries a PowerShell script that lists the qualifying sizes in a region. For a data disk on a size that doesn’t qualify, its fallback keeps the VM running but not the disk: stop what uses it, then, as Microsoft’s detach guide says, unmount it and remove its ",
            { code: "/etc/fstab" },
            " line. Then detach, resize, reattach and remount it.",
          ],
        },
      ],
    },
    {
      id: "how-to-increase-disk-size-in-azure",
      title: "How to increase disk size in Azure",
      blocks: [
        {
          kind: "p",
          text: "Microsoft’s warning comes first: check that the filesystem is healthy and that the partition table can hold the new size, and back up the data before you expand. A disk partitioned with a master boot record (MBR) can use only 2\u00a0TiB, so a disk you plan to grow past that needs a GUID Partition Table (GPT).",
        },
        { kind: "h3", id: "find-the-disk", title: "Find the disk" },
        {
          kind: "p",
          text: "On a Linux VM with several data disks, match the mount that’s filling up to its device, then the device to its Azure logical unit number (LUN):",
        },
        { kind: "code", lang: "bash", code: "df -Th\nsudo ls -alF /dev/disk/azure/scsi1/" },
        {
          kind: "p",
          text: [
            "In Microsoft’s example, ",
            { code: "/dev/sdd1" },
            " holds a 98% full ",
            { code: "/opt/db/data" },
            ", and the ",
            { code: "lun1 -> ../../../sdd" },
            " line shows it’s the disk at LUN 1 in the portal. NVMe controllers name disks differently. There a data disk shows up as a path such as ",
            { code: "/dev/nvme0n2" },
            ", and ",
            { code: "sudo azure-nvme-id" },
            " from the azure-vm-utils package prints its LUN.",
          ],
        },
        { kind: "h3", id: "resize-the-managed-disk", title: "Resize the managed disk" },
        {
          kind: "p",
          text: "In the portal, open the VM, select Disks, select the disk, then Size + performance. Pick the larger size and select Resize. With the Azure CLI, one command does it:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "az disk update \\\n    --resource-group <resource-group> \\\n    --name <disk-name> \\\n    --size-gb <new-size-gb>",
        },
        {
          kind: "p",
          text: "The new size has to be larger than the current one. On Premium SSD, Standard SSD and Standard HDD, the bill follows the disk’s size tier: Azure maps the provisioned size, rounded up, to the nearest offered size. A 512\u00a0GiB Premium SSD is a P20, and asking for 600\u00a0GiB moves it to a P30, which bills as 1,024\u00a0GiB. Premium SSD v2 grows in 1\u00a0GiB increments and bills each GiB you provision.",
        },
      ],
    },
    {
      id: "resize-the-disk-without-a-reboot-rescan",
      title: "Resize the disk without a reboot: rescan the device",
      blocks: [
        {
          kind: "p",
          text: [
            "Linux keeps reporting the old size until the device is rescanned, which normally happens only at boot. You can trigger it yourself, with no reboot. The commands below use ",
            { code: "/dev/sdc" },
            ", the LUN 0\u00a0disk in Microsoft’s example. Replace it with the device you found above:",
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
            "Look for the new size on the first line of the second ",
            { code: "fdisk" },
            " output, while the partition inside still shows its old size. Microsoft’s rescan example is for an ",
            { code: "sd" },
            " (SCSI) device, and the expand guide gives no NVMe rescan command. On Ultra Disks and Premium SSD v2, Microsoft says to allow up to 10\u00a0minutes for the new size to show, so a rescan made sooner may need repeating. If repeated rescans still don’t show it, Microsoft’s other fallback is a VM restart, and that restart is downtime.",
          ],
        },
        { kind: "diagram", figure: figure1 },
      ],
    },
    {
      id: "how-to-expand-a-data-disk-on",
      title: "How to expand a data disk on a Linux VM",
      blocks: [
        {
          kind: "p",
          text: [
            "With the larger device visible, grow the partition, then the filesystem. ",
            { code: "growpart" },
            " expands the partition you name into the free contiguous space after it. With the gdisk package it also handles GPT disks, which older versions of fdisk didn’t support. On Red Hat family images it comes in ",
            { code: "cloud-utils-growpart" },
            ", which is preinstalled on most marketplace images.",
          ],
        },
        { kind: "code", lang: "bash", code: "sudo growpart /dev/sdc 1" },
        {
          kind: "p",
          text: [
            "Then grow the filesystem, which stays mounted the whole time. An XFS filesystem must be mounted to be grown, so you give ",
            { code: "xfs_growfs" },
            " its mount point. For ext4, ",
            { code: "resize2fs" },
            " takes the device and grows the filesystem while it’s mounted, which Linux kernels have supported for ext3 and ext4 since the 2.6 series. Run the one that matches the Type column of ",
            { code: "df -Th" },
            ".",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "sudo xfs_growfs /datadrive    # XFS\nsudo resize2fs /dev/sdc1      # ext4\ndf -Th /datadrive",
        },
        {
          kind: "p",
          text: [
            "If the partition holds a Logical Volume Manager (LVM) physical volume, run ",
            { code: "sudo pvresize /dev/sdc1" },
            " after ",
            { code: "growpart" },
            ", then grow the logical volume with ",
            { code: "lvresize -r" },
            ", which resizes its filesystem in the same step. Microsoft’s example adds 10\u00a0GB with ",
            { code: "lvresize -r -L +10G /dev/mapper/rootvg-rootlv" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            { code: "df -Th" },
            " should now show the larger size. Nothing was unmounted and no service stopped, so the steps above resize an Azure disk without downtime for any data disk in the first, third or fourth row of the table, on a VM size that supports it.",
          ],
        },
      ],
    },
    {
      id: "can-you-expand-the-os-disk-without",
      title: "Can you expand the OS disk without downtime?",
      blocks: [
        {
          kind: "p",
          text: "Not by Microsoft’s expand guide, which says expanding without downtime “is supported only for data disks.” Microsoft’s troubleshooting guide does mention OS disk live resize on supported VM sizes and storage types, but it points back to that same list of requirements. Plan an OS disk expand as a maintenance window.",
        },
        {
          kind: "p",
          text: [
            "The sequence is ",
            { code: "az vm deallocate" },
            ", ",
            { code: "az disk update" },
            ", then ",
            { code: "az vm start" },
            ". ",
            { code: "az vm stop" },
            " won’t do, because it doesn’t release the compute resources. Everything on the VM is down until it starts again. On Ubuntu 16.x and newer, cloud-init grows the root partition and filesystem into the new space at the next boot. On SUSE and Red Hat images, you run ",
            { code: "growpart" },
            " and then ",
            { code: "xfs_growfs" },
            " or ",
            { code: "resize2fs" },
            " once the VM is up again, or ",
            { code: "pvresize" },
            " and ",
            { code: "lvresize -r" },
            " where the root sits on LVM. Microsoft recommends a full VM backup, or at least an OS disk snapshot, before you start.",
          ],
        },
        {
          kind: "p",
          text: "An OS disk tops out at 4,095\u00a0GiB, and many operating systems partition it with MBR by default, which caps the usable space at 2\u00a0TiB. Microsoft’s advice for more is to attach data disks, which you can also expand while the VM runs.",
        },
      ],
    },
    {
      id: "why-the-new-size-stays-on-the",
      title: "Why the new size stays on the bill",
      blocks: [
        {
          kind: "p",
          text: "A managed disk is billed on its provisioned size, prorated hourly, however much data you’ve written to it. Microsoft’s own example is an E10 Standard SSD deleted after 20\u00a0hours: you pay for 20\u00a0hours of an E10, whatever it held. And the size only goes one way. Microsoft’s expand guide says shrinking an existing disk “isn’t supported and might result in data loss.”",
        },
        {
          kind: "p",
          text: "So an expand for a one-off peak, such as a bulk import or a migration, stays on the bill after the data goes. Three habits keep the cost of growth in check:",
        },
        {
          kind: "ul",
          items: [
            "Grow in whole tiers on Premium SSD, Standard SSD and Standard HDD. A P20 grown to 600\u00a0GiB already bills as a P30’s 1,024\u00a0GiB, so setting 1,024\u00a0GiB costs the same and gives you the space. On Premium SSD v2, which bills per GiB, add only what you need.",
            [
              "If you’re growing a Premium SSD for IOPS rather than space, change its performance tier instead. A P20’s tier gives 2,300\u00a0IOPS and a P30’s 5,000. The higher tier bills at its own rate while it’s set, but unlike a larger size it can step back down to the baseline later (one downgrade per 12\u00a0hours at most), and most tier changes need no downtime. ",
              { a: "Azure disk performance tiers", href: "/learn/azure-disk-performance-tiers" },
              " covers the rules.",
            ],
            [
              "Grow when the disk fills, not in advance. Because a data disk expands while the VM runs, a ",
              { a: "disk space alert", href: "/learn/azure-vm-disk-space-alert" },
              " plus this procedure lets you buy less headroom up front.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Getting the space back later means a copy onto a smaller disk, with the services on that mount stopped for the switch, which is the route that ",
            { a: "shrinking an Azure managed disk", href: "/learn/shrink-azure-managed-disk" },
            " walks through. ",
            { a: "Azure VM disk usage", href: "/learn/azure-vm-disk-usage" },
            " shows how to measure the gap between used and provisioned space before you decide.",
          ],
        },
      ],
    },
    {
      id: "how-amoeba-expands-a-pool-as-it",
      title: "How Amoeba expands a pool as it fills",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " takes the expand off your list for the data disks of the VMs you onboard, and gives space back when the data shrinks. It never touches the OS disk.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "The one switch." },
              " Amoeba moves the VM’s data mounts onto one btrfs pool of managed disks, Premium SSD v2 where the region and zone offer it and Premium SSD otherwise. Amoeba sizes the pool from the highest use of the last 7\u00a0days, so the pool sits inside its target band with room for the largest recent 15-minute rise and at least 10\u00a0GiB free. Each mount keeps its path. At the switch, the agent stops the systemd services that use those mounts and starts them again on the pool, and that restart is the interruption. A failed switch attempt restores the original mounts and is retried, so services can restart more than once.",
            ],
            [
              { b: "When it expands." },
              " Amoeba holds each pool 80% to 90% full by default and decides on every 15-second report from the agent. It expands when the lowest use over the last 30\u00a0minutes is above the top of that band. It expands urgently when free space falls below the safety floor, 5% of the pool or 10\u00a0GiB, whichever is larger, or when the pool would reach that floor within 30\u00a0minutes at the last 10\u00a0minutes’ fill rate.",
            ],
            [
              { b: "How it expands." },
              " A normal expand brings the pool back to the middle of its band and grows the pool’s disks first. An urgent one adds about one hour of fill, at least 10% of the pool, and twice that if the pool needed another expand within the last hour. It adds a disk first, then grows. Either way the pool stays mounted, and expands run on their own.",
            ],
            [
              { b: "When data shrinks." },
              " Shrinks start once the move is done and 7 full days of data are collected, then Amoeba checks hourly. It removes one disk at a time: the agent moves that disk’s data onto the others with ",
              { code: "btrfs device remove" },
              ", then Amoeba detaches the empty disk and deletes it, which stops its billing. It never deletes a disk while the pool is at or above the top of its band or while an urgent expand runs, and in “Manual” each shrink waits for you.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Amoeba works on Windows and Linux VMs. On Linux, it needs systemd, kernel 5.14 or later, and btrfs loaded or loadable. Every process that keeps a data mount open must run as a systemd service. VMs in the Red Hat family aren’t moved. The VM needs 3 free data-disk slots: 2 for the pool and 1 kept free for an urgent expand. If a move pauses after the switch, an urgent safety expand can still run. Pool disks are locally redundant (LRS), so data that sat on ",
            { a: "zone-redundant (ZRS) disks", href: "/learn/azure-disk-lrs-vs-zrs" },
            " loses its zone redundancy. And during the move you pay for both sets of disks, from the moment the pool’s disks are created until the source disks are deleted after the 2-hour soak, then for each source disk’s safety snapshot for 7\u00a0days.",
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
      title: "Azure VM disk space alert: how to set one up in Azure Monitor",
      where: "Learn",
      href: "/learn/azure-vm-disk-space-alert",
    },
    {
      title: "Azure VM disk usage: how to check used vs provisioned space",
      where: "Learn",
      href: "/learn/azure-vm-disk-usage",
    },
    {
      title: "Azure disk performance tiers: more IOPS without more space",
      where: "Learn",
      href: "/learn/azure-disk-performance-tiers",
    },
    {
      title: "How to increase EBS volume size without downtime on Linux",
      where: "Learn",
      href: "/learn/increase-ebs-volume-size",
    },
  ],
};
