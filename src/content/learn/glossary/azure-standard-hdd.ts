import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/azure-standard-hdd/1";

export const term: GlossaryTerm = {
  slug: "azure-standard-hdd",
  term: "Azure Standard HDD (with the OS disk retirement)",
  title: "What is Azure Standard HDD?",
  meta: "Azure Standard HDD is the hard disk type of Azure managed disk. Its limits, how it’s charged, and what the 2028 OS disk retirement changes.",
  h1: "What is Azure Standard HDD?",
  card: "Azure Standard HDD is the hard disk drive (HDD) type of Azure managed disk.",
  group: "block-storage",
  product: "both",
  published: "2026-10-26",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: [
        "Azure Standard HDD is the hard disk drive (HDD) type of ",
        { a: "Azure managed disk", href: "/learn/glossary/azure-managed-disk" },
        ". It suits backups and rarely used data, not OS disks or databases that need low ",
        { a: "disk latency", href: "/learn/glossary/disk-latency" },
        ".",
      ],
    },
    { kind: "p", text: "Microsoft’s figures:" },
    {
      kind: "ul",
      items: [
        "Latency: writes under 10\u00a0ms and reads under 20\u00a0ms, for most operations.",
        [
          "Speed: up to 2,000 ",
          { a: "IOPS", href: "/learn/glossary/iops" },
          " and 500\u00a0MB/s, or 3,000\u00a0IOPS with performance plus turned on.",
        ],
        "Size: up to 32,767\u00a0GiB.",
        "Redundancy: locally redundant storage (LRS) only, three copies in one data center.",
      ],
    },
  ],
  sections: [
    {
      id: "azure-standard-hdd-os-disk-retirement",
      title: "OS disk retirement in 2028",
      blocks: [
        {
          kind: "p",
          text: "On 8 September 2028, Azure stops supporting Standard HDD as an OS disk. It then converts each one to a Standard SSD of equivalent size. Microsoft warns of possible service disruption if you haven’t converted first.",
        },
        {
          kind: "p",
          text: "Only OS disks are affected. Standard HDD data disks, snapshots and OS disks that Azure Site Recovery creates stay supported.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: "To find affected disks across subscriptions, filter the Azure portal’s disk list by storage type Standard HDD LRS and OS type Linux and Windows. For one subscription, the Azure CLI gives the same list:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "az disk list \\\n  --query \"[?sku.name=='Standard_LRS' && osType!=null]\" \\\n  --output table",
        },
        { kind: "p", text: "Then convert each one to Standard SSD or Premium SSD." },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for cloud cost",
      blocks: [
        { kind: "p", text: "Two things set its price:" },
        {
          kind: "ul",
          items: [
            [
              "The ",
              { a: "size tier", href: "/learn/glossary/azure-disk-sizes" },
              " its size rounds up to, however little data it holds.",
            ],
            "Transactions, counted in operations of up to 16\u00a0KiB and charged per 10,000, with an hourly cap per disk.",
          ],
        },
        {
          kind: "p",
          text: [
            "After conversion, an OS disk is charged as ",
            { a: "Standard SSD", href: "/learn/premium-ssd-vs-standard-ssd-azure" },
            ". Microsoft says Standard SSD generally comes closest to Standard HDD on price for performance.",
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Azure managed disk",
      line: "The disk family it belongs to.",
      href: "/learn/glossary/azure-managed-disk",
    },
    {
      title: "Azure disk sizes",
      line: "The tiers behind its price.",
      href: "/learn/glossary/azure-disk-sizes",
    },
    {
      title: "Disk latency",
      line: "The time one read or write takes.",
      href: "/learn/glossary/disk-latency",
    },
    {
      title: "Disk snapshot",
      line: "A disk copy Azure can keep on Standard HDD.",
      href: "/learn/glossary/disk-snapshot",
    },
  ],
  relatedTitle: "Related terms",
  next: {
    title: "Azure Premium SSD vs Standard SSD",
    href: "/learn/premium-ssd-vs-standard-ssd-azure",
  },
  sources: [
    {
      publisher: "Microsoft Learn",
      title: "“Migrate Standard HDD OS disks by September 08, 2028”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-hdd-os-retirement",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Select a disk type for Azure IaaS VMs”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-types",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Understand Azure Disk Storage billing”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-understand-billing",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Redundancy options for Azure managed disks”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-redundancy",
    },
  ],
};
