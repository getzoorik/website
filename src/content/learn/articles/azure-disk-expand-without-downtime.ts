import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/azure-disk-expand-without-downtime/1";
import { figure as figure2 } from "@/features/learn/figures/azure-disk-expand-without-downtime/2";

export const article: Article = {
  slug: "azure-disk-expand-without-downtime",
  title: "Resize or expand an Azure VM disk without downtime",
  meta: "Resize an Azure VM disk without any downtime: the limits, az disk update, how to rescan the disk in Linux, growpart and xfs_growfs, and why the new size stays.",
  h1: "How to resize or expand an Azure VM disk without any downtime",
  deck: "Resize most Azure VM data disks without any downtime: grow the managed disk, rescan it in Linux, then grow the partition and filesystem while the VM keeps running.",
  card: "Grow a managed data disk while the VM runs: the limits, the rescan, growpart, and why the size stays.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Azure block storage",
  published: "2026-11-01",
  updated: "2026-11-01",
  author: "vineet",
  cover: "/learn-covers/zoorik-learn-azure-disk-expand-without-downtime-1200x630.webp",
  coverAlt:
    "Expand an Azure disk: the data disk grows while the VM keeps running, but the OS disk does not",
  short:
    "You can expand most Azure managed data disks without downtime: resize in Azure, rescan the device, then grow the partition and filesystem. OS disks, shared disks and Standard HDD, Standard SSD or Premium SSD crossing 4\u00a0TiB need downtime, and you keep paying for the new size.",
  sections: [
    {
      id: "azure-disk-expand-without-downtime",
      title: "Azure disk expand without downtime: what qualifies",
      blocks: [
        {
          kind: "p",
          text: [
            "Picture a 512\u00a0GiB ",
            { a: "Premium SSD", href: "/learn/glossary/azure-premium-ssd" },
            " data disk at ",
            { code: "/datadrive" },
            ", nearly full, on a VM whose application keeps writing. You can make it 1,024\u00a0GiB without stopping either one. When the data shrinks again, you still pay for 1,024\u00a0GiB.",
          ],
        },
        {
          kind: "p",
          text: "The work happens at four layers: the managed disk, the device Linux sees, the partition and the filesystem. Each keeps its old size until its own step runs.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: "Microsoft calls expanding a disk without deallocating the VM “Expand without downtime”. The disk’s host cache setting doesn’t affect it. Whether you can expand a disk in Azure without downtime depends on its type and size, the VM size and your tool.",
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
          text: "Microsoft’s troubleshooting guide says which VM sizes support the feature. They include sizes with Premium Storage capability, ephemeral OS disk support or Hyper-V Generation 2.",
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
          text: "The troubleshooting guide has a PowerShell script that lists the qualifying sizes in a region. For a data disk on any other size, the guide’s fallback keeps the VM running but not the disk:",
        },
        {
          kind: "ol",
          items: [
            "Stop what uses the disk.",
            [
              "Unmount it and remove its ",
              { code: "/etc/fstab" },
              " line, per Microsoft’s detach guide.",
            ],
            "Detach the disk, resize it, then reattach and remount it.",
          ],
        },
      ],
    },
    {
      id: "how-to-increase-disk-size-in-azure",
      title: "How to increase disk size in Azure",
      blocks: [
        {
          kind: "callout",
          label: "Watch out",
          text: "Microsoft says to back up the data first, and to check the filesystem’s health and that the partition table can hold the new size. On a master boot record (MBR) disk, space past 2\u00a0TiB is charged but out of reach without a GUID Partition Table (GPT).",
        },
        { kind: "h3", id: "find-the-disk", title: "Find the disk" },
        {
          kind: "p",
          text: "On a Linux VM with several data disks, first match the mount that’s filling up to its device. Then match the device to its Azure logical unit number (LUN):",
        },
        { kind: "code", lang: "bash", code: "df -Th\nsudo ls -alF /dev/disk/azure/scsi1/" },
        {
          kind: "p",
          text: [
            "In Microsoft’s example, ",
            { code: "/dev/sdd1" },
            " holds a 98% full ",
            { code: "/opt/db/data" },
            ". The ",
            { code: "lun1 -> ../../../sdd" },
            " line shows it’s the disk at LUN 1 in the portal.",
          ],
        },
        {
          kind: "p",
          text: [
            "NVMe controllers name disks differently. There a data disk shows up as a path such as ",
            { code: "/dev/nvme0n2" },
            ". The command ",
            { code: "sudo azure-nvme-id" },
            ", from the azure-vm-utils package, prints its LUN.",
          ],
        },
        { kind: "h3", id: "resize-the-managed-disk", title: "Resize the managed disk" },
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
            "The new size has to be larger than the current one. On Premium SSD, Standard SSD and Standard HDD, the price follows the disk’s ",
            { a: "size tier", href: "/learn/glossary/azure-disk-sizes" },
            ". Azure maps the provisioned size, rounded up, to the nearest offered size.",
          ],
        },
        {
          kind: "p",
          text: [
            "Premium SSD v2 is different. It grows in 1\u00a0GiB increments and charges for each GiB you provision. Our ",
            { a: "Azure disk pricing calculator", href: "/ebs-and-azure-disk-pricing" },
            " shows what a managed disk costs a month at list price.",
          ],
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "The opening’s 512\u00a0GiB Premium SSD is a P20. Ask for 600\u00a0GiB and Azure moves it to a P30, which is charged as 1,024\u00a0GiB.",
        },
        {
          kind: "p",
          text: "You gain 600 − 512 = 88\u00a0GiB of space, but the size you pay for doubles. Setting 1,024\u00a0GiB costs the same and gives you 1,024 − 600 = 424\u00a0GiB more. That’s why the opening goes straight to 1,024\u00a0GiB.",
        },
        { kind: "svg", figure: figure2 },
      ],
    },
    {
      id: "resize-the-disk-without-a-reboot-rescan",
      title: "Rescan the disk in Linux so it shows the new size, without a reboot",
      blocks: [
        {
          kind: "p",
          text: "Linux keeps reporting the old size until the device is rescanned. That normally happens only at boot, but you can trigger the rescan yourself.",
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
            "Microsoft’s rescan example is for an ",
            { code: "sd" },
            " (SCSI) device, and the expand guide gives no NVMe rescan command.",
          ],
        },
        {
          kind: "p",
          text: "On Ultra Disks and Premium SSD v2, Microsoft says to allow up to 10\u00a0minutes for the new size to show. A rescan made sooner may need repeating. If repeated rescans don’t show it, Microsoft’s fallback is a VM restart, which is downtime.",
        },
      ],
    },
    {
      id: "how-to-expand-a-data-disk-on",
      title: "How to expand a data disk on a Linux VM: partition, then filesystem",
      blocks: [
        { kind: "p", text: [{ code: "/datadrive" }, " stays mounted through every step below."] },
        {
          kind: "ol",
          items: [
            [
              "Grow the partition. ",
              { code: "growpart" },
              " expands the partition you name into the free contiguous space after it. With the gdisk package, it also handles GPT disks, which older versions of fdisk didn’t support. On Red Hat images, it comes in the ",
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
              "Grow the filesystem. Use the tool that matches the Type column of ",
              { code: "df -Th" },
              ". An XFS filesystem must be mounted to be grown, so ",
              { code: "xfs_growfs" },
              " takes its mount point. For ext4, ",
              { code: "resize2fs" },
              " takes the device and grows the filesystem while it’s mounted. Linux kernels have supported that for ext3 and ext4 since the 2.6 series.",
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
            ", which resizes its filesystem in the same step. Microsoft’s example adds 10\u00a0GB with ",
            { code: "lvresize -r -L +10G /dev/mapper/rootvg-rootlv" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "Nothing was unmounted and no service stopped. These steps resize an Azure disk without downtime for any data disk in the table’s first, third or fourth row. The VM size must support it too.",
        },
      ],
    },
    {
      id: "can-you-expand-the-os-disk-without",
      title: "Can you expand the OS disk without downtime?",
      blocks: [
        {
          kind: "p",
          text: "Not by Microsoft’s expand guide, which says expanding without downtime “is supported only for data disks.”",
        },
        {
          kind: "p",
          text: "The troubleshooting guide mentions OS disk live resize on supported VM sizes and storage types. For the requirements, it points back to the expand guide.",
        },
        {
          kind: "p",
          text: "Plan this expand as a maintenance window. The whole VM is down from step 2 to step 4.",
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
          kind: "p",
          text: "The OS disk tops out at 4,095\u00a0GiB. Many operating systems partition it with MBR by default, which caps the usable space at 2\u00a0TiB. For more, Microsoft’s advice is to attach data disks, which you can also expand while the VM runs.",
        },
      ],
    },
    {
      id: "why-you-keep-paying-for-the-new",
      title: "Why you keep paying for the new size",
      blocks: [
        {
          kind: "p",
          text: [
            "A ",
            { a: "managed disk", href: "/learn/glossary/azure-managed-disk" },
            " is charged on its provisioned size, prorated hourly, however much data you’ve written to it. And the size only goes one way. Microsoft’s expand guide says shrinking an existing disk “isn’t supported and might result in data loss.”",
          ],
        },
        {
          kind: "p",
          text: "So an expand for a one-off peak, such as a bulk import or a migration, keeps costing you after the data goes. Three habits reduce what growth costs:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Grow in whole tiers." },
              " On Premium SSD, Standard SSD and Standard HDD, set the full size of the tier you’ll pay for. Premium SSD v2 charges per GiB, so add only what you need.",
            ],
            [
              { b: "Change the performance tier for IOPS." },
              " If a Premium SSD needs IOPS rather than space, raise its tier: a P20’s gives 2,300\u00a0IOPS and a P30’s 5,000. You pay the higher tier’s rate while it’s set. Unlike a larger size, the tier can step back down to the baseline later. Microsoft allows one downgrade per 12\u00a0hours, and most tier changes run without any downtime. ",
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
            "Getting the space back means a copy onto a smaller disk. The services on that mount stop for the switch, as ",
            { a: "shrinking an Azure managed disk", href: "/learn/shrink-azure-managed-disk" },
            " walks through. ",
            { a: "Measure used against provisioned space", href: "/learn/azure-vm-disk-usage" },
            " before you decide.",
          ],
        },
        {
          kind: "p",
          text: [
            "For the other ways to reduce what managed disks cost, see ",
            { a: "Azure disk cost optimization", href: "/learn/azure-disk-reservations" },
            ".",
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
            " optimizes block storage on Azure and AWS. The steps above leave one disk at a fixed size, and you run them again each time it fills. Amoeba keeps a VM’s data in one pool instead, and rightsizes that pool as your data changes.",
          ],
        },
        {
          kind: "p",
          text: "It grows the pool before it fills, and sooner when data arrives fast. It grows the pool’s disks or adds new ones while the pool stays mounted. You run no rescan, growpart or filesystem step.",
        },
        {
          kind: "p",
          text: "The one move onto the pool restarts the services that use the VM’s data mounts. After that, the pool grows while they run.",
        },
        {
          kind: "p",
          text: [
            "The page on ",
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
