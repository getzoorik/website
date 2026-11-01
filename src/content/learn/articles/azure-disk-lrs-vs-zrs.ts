import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/azure-disk-lrs-vs-zrs/1";
import { figure as figure2 } from "@/features/learn/figures/azure-disk-lrs-vs-zrs/2";
import { figure as figure3 } from "@/features/learn/figures/azure-disk-lrs-vs-zrs/3";

export const article: Article = {
  slug: "azure-disk-lrs-vs-zrs",
  title: "Azure disk LRS vs ZRS: what zone redundancy costs",
  meta: "Azure disk LRS vs ZRS: where each keeps your data, what a zone outage does, why ZRS costs 1.5 times LRS in most regions, and when LRS is the better buy.",
  h1: "Azure disk LRS vs ZRS: what zone redundancy costs",
  deck: "Where each keeps your three copies, what a zone outage does to them, and what ZRS adds to the cost.",
  card: "LRS and ZRS managed disks side by side: copies, zone outages, list prices, converting, and when LRS is enough.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Azure block storage",
  versus: ["LRS", "ZRS"],
  published: "2026-11-01",
  updated: "2026-11-01",
  author: "harsh",
  cover: "/learn-covers/zoorik-learn-azure-disk-lrs-vs-zrs-1200x630.webp",
  coverAlt:
    "Azure disk LRS vs ZRS: LRS keeps the copies in one datacenter, ZRS spreads them across zones at a higher price",
  short:
    "Azure disk LRS vs ZRS decides where a managed disk’s three copies live: one datacenter for locally redundant storage, three availability zones for zone-redundant storage. ZRS keeps data available through a zone outage but adds write latency, and lists at 1.5 times LRS in most regions (October 2026).",
  sections: [
    {
      id: "where-lrs-and-zrs-keep-your-three",
      title: "Where LRS and ZRS keep your three copies",
      blocks: [
        {
          kind: "p",
          text: "Picture a VM in zone 1 of East US with four 512\u00a0GiB Premium SSD data disks. At October 2026 list prices, ZRS adds $146.36 a month to them.",
        },
        {
          kind: "p",
          text: "In return, if zone 1 goes down, ZRS data stays available from the other two zones. Zonal LRS disks in zone 1 are unavailable until it recovers.",
        },
        {
          kind: "p",
          text: [
            "Every ",
            { a: "managed disk", href: "/learn/glossary/azure-managed-disk" },
            " keeps three copies of its data. The redundancy option decides where: one datacenter, or three availability zones. A zone is a physically separate group of datacenters inside a region.",
          ],
        },
        {
          kind: "h3",
          id: "lrs-three-copies-in-one-datacenter",
          title: "What LRS is in Azure: three copies in one datacenter",
        },
        {
          kind: "p",
          text: "LRS is the default. It writes all three copies synchronously inside a single datacenter. Microsoft states at least 99.999999999% (11 nines) of durability over a year for it.",
        },
        {
          kind: "p",
          text: "LRS protects against drive and server rack failures. In Microsoft’s words, it “doesn’t account for disasters such as fire or flooding within a datacenter.”",
        },
        {
          kind: "p",
          text: "An LRS disk comes in two forms, charged at the same rate. A zonal LRS disk is pinned to one zone and attaches only to VMs in that zone. A regional (nonzonal) disk is created without a zone, and Azure may place it in any zone.",
        },
        {
          kind: "h3",
          id: "zrs-copies-in-three-zones",
          title: "What ZRS is in Azure: copies in three zones",
        },
        {
          kind: "p",
          text: "ZRS replicates the disk synchronously across three zones. Each zone has its own power, cooling and networking. Microsoft states at least 12 nines for it.",
        },
        {
          kind: "p",
          text: "A write completes only after the data is stored in multiple zones, which adds write latency. Microsoft gives no latency figure and advises benchmarking your workload on both.",
        },
        {
          kind: "p",
          text: [
            "Otherwise, Microsoft says ZRS disks “are identical to disks using LRS”. They have the same scale targets, so a ",
            { a: "Premium SSD", href: "/learn/glossary/azure-premium-ssd" },
            " P20 gets the same IOPS and throughput either way.",
          ],
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "in-a-zone-outage-lrs-waits-and",
      title: "In a zone outage, LRS waits and ZRS keeps the data",
      blocks: [
        {
          kind: "p",
          text: "When the outage hits a zonal LRS disk’s zone, all three copies are inside it. Microsoft says a single zonal LRS disk is unavailable until the zone recovers. The data isn’t lost, and it can be recovered once the zone is back.",
        },
        {
          kind: "p",
          text: "With a single VM, spotting the outage is your job. So is moving traffic to another VM, if any. Microsoft doesn’t notify you when a zone goes down, though Azure Resource Health and Service Health alerts can.",
        },
        { kind: "p", text: "With ZRS, the outcome depends on what the outage reaches:" },
        {
          kind: "ul",
          items: [
            [
              { b: "The VM stays healthy." },
              " Only the disk’s storage in one zone is affected. Azure redirects disk operations to the healthy zones, and the VM keeps running.",
            ],
            [
              { b: "The VM fails." },
              " ZRS keeps the data available but doesn’t move the VM. You force detach the disk, which works on data disks only, and attach it to a VM in a healthy zone.",
            ],
            [
              { b: "The disk is shared." },
              " Take a shared ZRS disk attached to a primary VM and a secondary VM in different zones. When the primary’s zone fails, the disk is already available to the secondary. For that disk, Microsoft expects the failover to run without any data loss or downtime.",
            ],
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "Microsoft’s REST API reference still marks force detach as preview, calls it a last resort and warns that some writes might not have been flushed. Run it only on a VM that has failed:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "az vm disk detach --resource-group <resource-group> --vm-name <failed-vm-name> --name <disk-name> --force-detach",
        },
        {
          kind: "p",
          text: "When the VM fails, ZRS protects the data. You still need a second VM, or a plan to create one, to keep serving it.",
        },
        { kind: "svg", figure: figure2 },
      ],
    },
    {
      id: "azure-lrs-vs-zrs-pricing-1-5",
      title: "Azure LRS vs ZRS pricing: 1.5 times in most regions",
      blocks: [
        {
          kind: "p",
          text: "Microsoft’s reliability guide says ZRS “incurs a higher cost than LRS”, by an amount that varies by region and disk type. The Azure Retail Prices API, Microsoft’s unauthenticated source of list prices, shows how much.",
        },
        {
          kind: "h3",
          id: "most-regions-list-zrs-at-1-5",
          title: "Most regions list ZRS at 1.5 times LRS",
        },
        {
          kind: "p",
          text: "In October 2026, 42 regions list a P20 ZRS disk. Of those, 40 price it at 1.5 times the P20 LRS disk. Only Japan West and New Zealand North differ.",
        },
        {
          kind: "p",
          text: "Standard SSD’s E20 shows the same 1.5 in 39 of 41 regions. Every other tier from P1 to P80 and E1 to E80 does the same, with one to four exceptions each.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "Here is Premium SSD LRS vs ZRS for the opening’s VM, at East US pay-as-you-go list prices. A 512\u00a0GiB P20 costs $73.22 a month on LRS and $109.81 on ZRS: $109.81 ÷ $73.22 = 1.50.",
        },
        {
          kind: "p",
          text: "Four disks cost 4 × $73.22 = $292.88 a month on LRS. On ZRS they cost 4 × $109.81 = $439.24. Converting all four adds $439.24 − $292.88 = $146.36 a month, or 12 × $146.36 = $1,756.32 a year.",
        },
        { kind: "p", text: "A single 1,024\u00a0GiB P30 goes from $135.17 to $202.73." },
        {
          kind: "p",
          text: [
            "Prices change by region and over time, so check the managed disks pricing page. Our ",
            { a: "Azure disk pricing calculator", href: "/ebs-and-azure-disk-pricing" },
            " gives a Premium SSD or Standard SSD disk’s LRS list price, and ZRS is 1.5 times that in most regions.",
          ],
        },
        { kind: "svg", figure: figure3 },
        {
          kind: "h3",
          id: "reservations-shared-disks-and-snapshots",
          title: "Reservations, shared disks and snapshots",
        },
        { kind: "p", text: "Three smaller items round out the ZRS vs LRS cost:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Reservations." },
              " The Retail Prices API lists one-year disk reservations for Premium SSD P30 to P80 on LRS. It lists none for any ZRS SKU.",
            ],
            [
              { b: "Shared disks." },
              " Each extra mount of a shared Premium SSD has a monthly charge. The pricing page says shared disk pricing is the same for LRS and ZRS.",
            ],
            [
              { b: "Snapshots." },
              " ",
              { a: "Incremental snapshots", href: "/learn/azure-disk-snapshot-cost" },
              " always sit on Standard HDD storage. There, LRS and ZRS snapshots cost the same: $0.05 per GB a month in East US, charged on the data they hold.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Disk type is a separate choice, covered in ",
            {
              a: "Premium SSD vs Standard SSD on Azure",
              href: "/learn/premium-ssd-vs-standard-ssd-azure",
            },
            ". So is raising IOPS with ",
            { a: "performance tiers", href: "/learn/azure-disk-performance-tiers" },
            ".",
          ],
        },
      ],
    },
    {
      id: "which-azure-managed-disks-can-use-zrs",
      title: "Which Azure managed disks can use ZRS",
      blocks: [
        {
          kind: "p",
          text: [
            "Azure managed disk ZRS support covers two of the five disk types. A Premium SSD ZRS disk uses the SKU ",
            { code: "Premium_ZRS" },
            ", and a Standard SSD one uses ",
            { code: "StandardSSD_ZRS" },
            ". Premium SSD v2, Ultra Disk and Standard HDD are LRS only.",
          ],
        },
        {
          kind: "p",
          text: [
            "So if you’re weighing ",
            {
              a: "Premium SSD v2 against Premium SSD",
              href: "/learn/premium-ssd-v2-vs-premium-ssd",
            },
            ", the move gives up ZRS. For the LRS-only types, Microsoft’s route to zone resilience is several VMs in different zones, each with its own zonal LRS disks.",
          ],
        },
        {
          kind: "p",
          text: "A ZRS managed disk needs a region with availability zones, and Microsoft says every such region offers one. LRS reaches further, since regions without zones offer it too. In October 2026, the Retail Prices API lists a P20\u00a0disk on LRS in 66 regions and on ZRS in 42.",
        },
        {
          kind: "p",
          text: [
            "To see which of your disks are ZRS, list them with their SKU. A ",
            { code: "_ZRS" },
            " suffix means zone-redundant.",
          ],
        },
        {
          kind: "p",
          text: [
            "For an LRS disk, ",
            { code: "az disk show" },
            " tells you which form it is. No value in ",
            { code: "zones" },
            " means a regional disk, and a zone number means a zonal one.",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: 'az disk list --resource-group <resource-group> --query "[].{Name:name, Sku:sku.name}" --output table\naz disk show --name <disk-name> --resource-group <resource-group> --query "{Sku:sku.name, Zones:zones}"',
        },
        {
          kind: "p",
          text: [
            { a: "The AKS storage class guide", href: "/learn/aks-storage-classes" },
            " explains when a built-in Kubernetes class creates a ZRS disk instead of LRS.",
          ],
        },
      ],
    },
    {
      id: "how-to-convert-a-disk-from-lrs",
      title: "How to convert a disk from LRS to ZRS",
      blocks: [
        {
          kind: "p",
          text: [
            "The route depends on the disk’s form, regional or zonal, as ",
            { code: "az disk show" },
            " reports.",
          ],
        },
        {
          kind: "h3",
          id: "a-regional-disk-changes-type-in-place",
          title: "A regional disk changes type in place",
        },
        {
          kind: "p",
          text: "Changing the type needs the VM deallocated. Microsoft calls the change itself instantaneous. A disk’s type can change twice a day.",
        },
        {
          kind: "ol",
          items: ["Deallocate the VM. That stops its services until you start it again."],
        },
        {
          kind: "code",
          lang: "bash",
          code: "az vm deallocate --resource-group <resource-group> --name <vm-name>",
        },
        {
          kind: "ol",
          start: 2,
          items: [
            ["Change the disk’s SKU. For a Standard SSD, use ", { code: "StandardSSD_ZRS" }, "."],
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "az disk update --resource-group <resource-group> --name <disk-name> --sku Premium_ZRS",
        },
        { kind: "ol", start: 3, items: ["Start the VM."] },
        {
          kind: "code",
          lang: "bash",
          code: "az vm start --resource-group <resource-group> --name <vm-name>",
        },
        {
          kind: "p",
          text: [
            "Microsoft’s disk type conversion guide says the same steps work in reverse, with ",
            { code: "Premium_LRS" },
            " or ",
            { code: "StandardSSD_LRS" },
            ". A ZRS disk’s zone configuration can’t change, though. Moving its data onto a zonal disk means a new disk created from a snapshot.",
          ],
        },
        {
          kind: "h3",
          id: "a-zonal-disk-is-copied-through-a",
          title: "A zonal disk is copied through a snapshot",
        },
        {
          kind: "p",
          text: "A zonal LRS disk can’t be converted to ZRS directly. Microsoft’s LRS to ZRS guide has you copy it:",
        },
        {
          kind: "ol",
          items: [
            "Snapshot the disk. A snapshot of a stopped VM is the cleanest copy, and stopping it is downtime.",
            "Create a new ZRS disk from the snapshot.",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "az disk create --resource-group <resource-group> --name <new-disk-name> --sku Premium_ZRS --size-gb <size-gb> --source <snapshot-id>",
        },
        { kind: "ol", start: 3, items: ["Create a new VM with the new disks."] },
        {
          kind: "p",
          text: "You pay for the old disks, next to the new ones, until you delete them.",
        },
      ],
    },
    {
      id: "azure-disk-lrs-vs-zrs",
      title: "Azure disk LRS vs ZRS: when ZRS is worth paying for",
      blocks: [
        {
          kind: "table",
          columns: [
            { label: "What you decide on", width: "30%" },
            { label: "LRS", width: "30%" },
            { label: "ZRS", width: "40%" },
          ],
          rows: [
            [
              "Where the three copies live",
              "One datacenter",
              "Three availability zones, written synchronously",
            ],
            ["Durability Microsoft states", "At least 11 nines a year", "At least 12 nines a year"],
            [
              "In a zone outage",
              "A zonal LRS disk is unavailable until the zone recovers",
              "The data stays available; a data disk can be force detached and attached to a VM in a healthy zone",
            ],
            ["Writes", "Less latency", "More latency"],
            ["IOPS and throughput", "Set by the disk’s tier", "The same as LRS for that tier"],
            ["Disk types", "All five", "Premium SSD and Standard SSD"],
            [
              "Regions",
              "Wherever managed disks run (LRS is the default)",
              "Regions with availability zones",
            ],
            [
              "512\u00a0GiB Premium SSD (P20), East US, Oct 2026",
              "$73.22 a month",
              "$109.81 a month",
            ],
            [
              "512\u00a0GiB Standard SSD (E20), East US, Oct 2026",
              "$38.40 a month",
              "$57.60 a month",
            ],
            ["One-year disk reservations", "P30 to P80", "None listed"],
          ],
        },
        {
          kind: "p",
          text: "Microsoft recommends ZRS for the best reliability. Whether that’s worth 1.5 times the price depends on what else protects the data.",
        },
        {
          kind: "p",
          text: "Microsoft says ZRS disks are appropriate in two cases. One is a workload that can’t write synchronously to two zones at the application level. The other is an application that must meet a zero recovery point objective (RPO), the amount of recent data you can afford to lose.",
        },
        { kind: "h3", id: "which-disks-go-on-which", title: "Which disks go on which" },
        {
          kind: "ul",
          items: [
            [
              { b: "ZRS for a single VM" },
              " whose data must stay available through a zone outage, with no lost writes. Choose it when nothing in the application copies the data to another zone.",
            ],
            [
              { b: "ZRS for a shared disk" },
              " behind a cluster spread over zones, such as a SQL Server failover cluster instance or SAP ASCS/SCS.",
            ],
            [
              { b: "LRS when the application already replicates across zones." },
              " SQL Server Always On is Microsoft’s example. Microsoft calls VMs with zonal LRS disks in each zone the most common high-availability setup for web servers, application tiers and database clusters.",
            ],
            [
              { b: "LRS when the data can be rebuilt or restored," },
              " such as caches, scratch space, build output or a dev and test VM.",
            ],
            [
              { b: "LRS with snapshots" },
              " when losing the writes since your last snapshot is acceptable. Microsoft lists frequent ZRS snapshots as one way to protect an LRS disk. Incremental snapshots use ZRS automatically where the region offers it. Each one after the first holds only the changes since the last.",
            ],
            [
              { b: "LRS with Azure Site Recovery" },
              " for cross-zone disaster recovery. Microsoft notes it doesn’t give a zero RPO.",
            ],
          ],
        },
        {
          kind: "callout",
          label: "Rule of thumb",
          text: "In most regions an LRS disk costs two-thirds of the same disk on ZRS. So keep ZRS for the two ZRS cases, and put the rest on LRS.",
        },
        {
          kind: "p",
          text: [
            "The provisioned size is the other lever on a disk’s price, covered in ",
            { a: "Azure disk cost optimization", href: "/learn/azure-disk-reservations" },
            ".",
          ],
        },
      ],
    },
    {
      id: "amoeba-pools-are-locally-redundant",
      title: "Amoeba pools are locally redundant",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " optimizes block storage on Azure and AWS, and every pool it builds is locally redundant. Data on ZRS disks moves to an LRS pool. It loses zone redundancy and keeps the drive and rack protection of LRS.",
          ],
        },
        {
          kind: "p",
          text: "Amoeba moves a VM’s data disks onto one btrfs pool sized to your data, with room to grow. It grows the pool before it fills. When your data goes down and stays down, it shrinks the pool one disk at a time.",
        },
        {
          kind: "p",
          text: "On Azure, the pool uses Premium SSD v2 where your VM’s region and zone offer it, and Premium SSD otherwise.",
        },
        {
          kind: "p",
          text: "A move only goes forward. Once the switch is checked, Amoeba snapshots and deletes each old disk. It keeps the snapshots for 7 days, then deletes them too.",
        },
        {
          kind: "p",
          text: "So onboard only VMs whose data can live in one zone. That includes data the application already replicates across zones, and data you can rebuild. Leave a VM off if its ZRS disks are what carries it through a zone outage.",
        },
        {
          kind: "p",
          text: [
            "Amoeba acts only on the VMs you onboard, so you can ",
            { a: "start with one VM", href: "/amoeba-faq#can-i-start-with-one-vm" },
            ". Amoeba is in early access.",
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
      title: "“Redundancy options for Azure managed disks”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-redundancy",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Reliability in Azure Disk Storage”",
      url: "https://learn.microsoft.com/en-us/azure/reliability/reliability-storage-disk",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Convert a disk from LRS to ZRS”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-migrate-lrs-zrs",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Convert managed disks storage between different disk types”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-convert-types",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Create an incremental snapshot”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-incremental-snapshots",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Virtual Machines - Attach Detach Data Disks - REST API (Azure Compute)”",
      url: "https://learn.microsoft.com/en-us/rest/api/compute/virtual-machines/attach-detach-data-disks",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Azure Retail Prices REST API overview”",
      url: "https://learn.microsoft.com/en-us/rest/api/cost-management/retail-prices/azure-retail-prices",
    },
    {
      publisher: "Microsoft Azure",
      title: "“Pricing - Managed Disks”",
      url: "https://azure.microsoft.com/en-us/pricing/details/managed-disks/",
    },
  ],
  related: [
    {
      title: "Azure managed disk types: pricing and how to choose",
      where: "Learn",
      href: "/learn/azure-managed-disk-types",
    },
    {
      title: "Premium SSD v2 vs Premium SSD: which one costs less?",
      where: "Learn",
      href: "/learn/premium-ssd-v2-vs-premium-ssd",
    },
    {
      title: "AKS storage classes: which Azure disk each one creates",
      where: "Learn",
      href: "/learn/aks-storage-classes",
    },
    {
      title: "Azure disk cost optimization: stop paying for empty space",
      where: "Learn",
      href: "/learn/azure-disk-reservations",
    },
    {
      title: "Premium SSD vs Standard SSD on Azure: what you pay for",
      where: "Learn",
      href: "/learn/premium-ssd-vs-standard-ssd-azure",
    },
  ],
};
