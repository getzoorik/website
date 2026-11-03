import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/azure-managed-disk/1";

export const term: GlossaryTerm = {
  slug: "azure-managed-disk",
  term: "Azure managed disk",
  title: "What is an Azure managed disk?",
  meta: "An Azure managed disk is block storage for an Azure VM, from Azure Disk Storage. Its types and roles, how it’s charged, and why it can’t shrink.",
  h1: "What is an Azure managed disk?",
  card: "An Azure managed disk is a block storage volume that Azure manages for a virtual machine (VM).",
  group: "block-storage",
  product: "amoeba",
  published: "2026-10-25",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: [
        "An Azure managed disk is a ",
        { a: "block storage", href: "/learn/glossary/block-storage" },
        " volume that Azure manages for a virtual machine (VM). Azure Disk Storage is the service behind it. It works like a physical disk in a server, but virtual: you pick the type and size, and Azure handles the rest.",
      ],
    },
    {
      kind: "p",
      text: [
        "There are ",
        { a: "five disk types", href: "/learn/azure-managed-disk-types" },
        ": Ultra Disk, Premium SSD v2, Premium SSD, Standard SSD and Standard HDD.",
      ],
    },
  ],
  sections: [
    {
      id: "os-disk-vs-data-disk-in-an",
      title: "Disk roles",
      blocks: [
        { kind: "p", text: "A disk on an Azure VM has one of three roles:" },
        {
          kind: "ul",
          items: [
            "The OS disk holds the operating system and the boot volume. Every VM has one.",
            "A data disk holds your apps and data. The VM’s size sets how many you can attach.",
            "The temporary disk gives most VMs short-term storage. It isn’t a managed disk.",
          ],
        },
      ],
    },
    {
      id: "how-a-managed-disk-is-charged",
      title: "How it’s charged",
      blocks: [
        {
          kind: "p",
          text: [
            "Azure charges a managed disk for the size you provision, not the data on it. Premium SSD, Standard SSD and Standard HDD round that size up to the next ",
            { a: "Azure disk size", href: "/learn/glossary/azure-disk-sizes" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "Say you attach a 1\u00a0TiB Premium SSD data disk. Azure gives it the P30 tier by default. Your data fills 200\u00a0GiB, but you pay for all 1\u00a0TiB.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "azure-disk-vs-azure-files",
      title: "Azure Disk vs Azure Files",
      blocks: [
        {
          kind: "p",
          text: "An Azure disk attaches to a VM and holds data that isn’t needed outside that VM. Azure Files is a managed file share that machines mount over SMB or NFS.",
        },
        {
          kind: "p",
          text: "Use Azure Files when many VMs need the same files, such as shared tools or configuration files. Use a disk for one VM’s own data.",
        },
      ],
    },
    {
      id: "managed-vs-unmanaged-disks-in-azure",
      title: "Managed vs unmanaged disks",
      blocks: [
        {
          kind: "p",
          text: "An unmanaged disk was a virtual hard disk (VHD) file kept in a storage account you managed yourself. With managed disks, Azure manages the storage accounts for you. Managed disks also give you:",
        },
        {
          kind: "ul",
          items: [
            "99.999% availability by design, with three copies of your data.",
            "Up to 50,000\u00a0disks of each type per region in one subscription.",
          ],
        },
        {
          kind: "p",
          text: "Microsoft fully retired unmanaged disks on 31 March 2026. VMs that still use them can’t start, so Microsoft says to migrate them to managed disks.",
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for cloud cost",
      blocks: [
        {
          kind: "p",
          text: "You can grow a data disk while the VM runs, within some limits. But Microsoft says shrinking an existing disk “isn’t supported and might result in data loss.” So you keep paying for the size of an old peak.",
        },
        {
          kind: "p",
          text: [
            "To reduce that cost, see ",
            { a: "how to shrink an Azure managed disk", href: "/learn/shrink-azure-managed-disk" },
            " and ",
            {
              a: "Azure managed disk cost optimization",
              href: "/azure-managed-disk-cost-optimization",
            },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " moves a VM’s data disks onto one btrfs pool sized to your data, then rightsizes it autonomously. It works on Windows and Linux VMs, never on the OS disk.",
          ],
        },
        {
          kind: "p",
          text: [
            "The ",
            { a: "free assessment", href: "/assessment?p=amoeba" },
            " estimates your own saving.",
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Block storage",
      line: "The storage type of a managed disk.",
      href: "/learn/glossary/block-storage",
    },
    {
      title: "Azure temporary disk",
      line: "Short-term storage that comes with most VMs.",
      href: "/learn/glossary/azure-temporary-disk",
    },
    { title: "EBS volume", line: "The AWS match.", href: "/learn/glossary/ebs-volume" },
    {
      title: "Ephemeral OS disk",
      line: "An OS disk on the VM’s local storage.",
      href: "/learn/glossary/ephemeral-os-disk",
    },
  ],
  relatedTitle: "Related terms",
  next: {
    title: "Azure disk reservations: are they worth it?",
    href: "/learn/azure-disk-reservations",
  },
  sources: [
    {
      publisher: "Microsoft Learn",
      title: "“Overview of Azure Disk Storage”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/managed-disks-overview",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Understand Azure Disk Storage billing”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-understand-billing",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Expand Virtual Hard Disks on a Linux VM”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/linux/expand-disks",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Unmanaged disks have been retired”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/unmanaged-disks-deprecation",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Select a disk type for Azure IaaS VMs”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-types",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Introduction to Azure Storage”",
      url: "https://learn.microsoft.com/en-us/azure/storage/common/storage-introduction",
    },
  ],
};
