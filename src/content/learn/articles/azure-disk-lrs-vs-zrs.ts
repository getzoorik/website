import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/azure-disk-lrs-vs-zrs/1";

export const article: Article = {
  slug: "azure-disk-lrs-vs-zrs",
  title: "Azure disk LRS vs ZRS: what zone redundancy costs",
  meta: "Azure disk LRS vs ZRS: where each keeps your data, what a zone outage does, why ZRS costs 1.5 times LRS in most regions, and when LRS is the better buy.",
  h1: "Azure disk LRS vs ZRS: what zone redundancy costs",
  deck: "Where each keeps your three copies, what a zone outage does to them, and what ZRS adds to the bill.",
  card: "LRS and ZRS managed disks side by side: copies, zone outages, list prices, converting, and when LRS is enough.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Azure block storage",
  versus: ["LRS", "ZRS"],
  published: "2026-11-13",
  updated: "2026-11-13",
  author: "harsh",
  short:
    "Azure disk LRS vs ZRS is a choice about where a managed disk’s three copies live. Locally redundant storage (LRS) keeps them in one datacenter. Zone-redundant storage (ZRS) writes them synchronously across three availability zones, so the data stays available through a zone outage. ZRS exists only on Premium SSD and Standard SSD, adds write latency, and in October 2026 lists at 1.5 times the LRS price in most regions.",
  sections: [
    {
      id: "what-lrs-and-zrs-do-with-your",
      title: "What LRS and ZRS do with your data",
      blocks: [
        {
          kind: "p",
          text: "Every Azure managed disk keeps three copies of its data. The redundancy option decides where they go.",
        },
        {
          kind: "p",
          text: "LRS is the default, and it writes all three copies synchronously inside a single datacenter. Microsoft states at least 99.999999999% (11 nines) of durability over a year for it. It protects against drive and server rack failures, but in Microsoft’s words it “doesn’t account for disasters such as fire or flooding within a datacenter.”",
        },
        {
          kind: "p",
          text: "An LRS disk comes in two forms. A zonal LRS disk is pinned to one availability zone, a physically separate group of datacenters inside a region, and it attaches only to VMs in that zone. A regional (nonzonal) disk is one created without a zone, and Azure may place it in any zone in the region. Both bill at the same rate.",
        },
        {
          kind: "p",
          text: "ZRS replicates the disk synchronously across three availability zones, each with its own power, cooling and networking. A write completes only after the data is stored in multiple zones, which is where the extra write latency comes from. For ZRS, Microsoft states at least 12 nines. Apart from that latency, it says ZRS disks “are identical to disks using LRS” and have the same scale targets, so a Premium SSD P20 gets the same IOPS and throughput either way. Microsoft gives no latency figure and advises you to benchmark your own workload on both.",
        },
        { kind: "diagram", figure: figure1 },
      ],
    },
    {
      id: "what-a-zone-outage-does-to-each",
      title: "What a zone outage does to each",
      blocks: [
        {
          kind: "p",
          text: "When the outage hits a zonal LRS disk’s zone, all three copies are inside it, and Microsoft says a single zonal LRS disk is unavailable until the zone recovers. The data isn’t lost. The disk keeps it, and it can be recovered once the zone is back. With a single VM, spotting the outage and moving traffic to another VM, if you have one, is your job: Microsoft doesn’t notify you when a zone goes down, though Azure Resource Health and Service Health alerts can.",
        },
        {
          kind: "p",
          text: "With ZRS, the outcome depends on what the outage reaches. If the VM stays healthy and only the disk’s storage in one zone is affected, Azure redirects disk operations to the healthy zones and the VM keeps running. If the VM itself goes down, ZRS keeps the data available but doesn’t move the VM. You force detach the disk from the failed VM, which works on data disks only, and attach it to a VM in a healthy zone. Microsoft’s REST API reference still marks force detach as preview, calls it a last resort, and warns that some writes might not have been flushed, so run it only on a VM that has failed:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "az vm disk detach --resource-group <resource-group> --vm-name <failed-vm-name> --name <disk-name> --force-detach",
        },
        {
          kind: "p",
          text: "A shared ZRS disk avoids that step. Attached to a primary VM and a secondary VM in different zones, it’s already available to the secondary when the primary’s zone fails, and Microsoft expects no data loss and no downtime for that disk. Either way, ZRS protects the data, and you still need a second VM, or a plan to create one, to keep serving it.",
        },
      ],
    },
    {
      id: "azure-lrs-vs-zrs-pricing",
      title: "Azure LRS vs ZRS pricing",
      blocks: [
        {
          kind: "p",
          text: "Microsoft’s reliability guide says ZRS “incurs a higher cost than LRS”, by an amount that varies by region and disk type. The Azure Retail Prices API, Microsoft’s unauthenticated source of list prices, shows the size of it. In October 2026, 40 of the 42 regions that list a P20 ZRS disk price it at 1.5 times the P20 LRS disk, and only Japan West and New Zealand North differ. Standard SSD’s E20 shows the same 1.5 in 39 of 41 regions. Every other tier from P1 to P80 and E1 to E80 does the same, with one to four exceptions each.",
        },
        {
          kind: "p",
          text: "That makes Premium SSD LRS vs ZRS easy to price for a whole VM. At East US pay-as-you-go list prices, a VM with four 512\u00a0GiB Premium SSD data disks pays $292.88 a month on LRS and $439.24 on ZRS, so converting all four adds $146.36 a month, or $1,756.32 a year. A single 1,024\u00a0GiB P30 goes from $135.17 to $202.73. Prices change by region and over time, so check yours on the managed disks pricing page.",
        },
        { kind: "p", text: "Three smaller items round out the ZRS vs LRS cost:" },
        {
          kind: "ul",
          items: [
            "The Retail Prices API lists one-year disk reservations for Premium SSD P30 to P80 on LRS, and none for any ZRS SKU.",
            "Each extra mount of a shared Premium SSD has a monthly charge, and the pricing page says shared disk pricing is the same for LRS and ZRS.",
            [
              { a: "Incremental snapshots", href: "/learn/azure-disk-snapshot-cost" },
              " always sit on Standard HDD storage, where LRS and ZRS snapshots cost the same, $0.05 per GB a month in East US, billed on the data they hold.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Performance doesn’t offset the price. A ZRS disk gets the same IOPS and throughput as the LRS disk of the same tier, so the extra you pay buys zone redundancy, not speed. Choosing between Premium SSD and Standard SSD is a separate decision, covered in ",
            {
              a: "Premium SSD vs Standard SSD on Azure",
              href: "/learn/premium-ssd-vs-standard-ssd-azure",
            },
            ", and so is raising IOPS with ",
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
            ". Premium SSD v2, Ultra Disk and Standard HDD are LRS only, so if you’re weighing ",
            {
              a: "Premium SSD v2 against Premium SSD",
              href: "/learn/premium-ssd-v2-vs-premium-ssd",
            },
            ", the move gives up ZRS. For the LRS-only types, Microsoft’s route to zone resilience is several VMs in different zones, each with its own zonal LRS disks.",
          ],
        },
        {
          kind: "p",
          text: "A ZRS managed disk needs a region with availability zones, and Microsoft says every such region offers one. LRS reaches further, since regions without zones offer it too: in October 2026 the Retail Prices API lists a P20\u00a0disk on LRS in 66 regions and on ZRS in 42.",
        },
        {
          kind: "p",
          text: [
            "To see which of your disks are ZRS, list them with their SKU. A ",
            { code: "_ZRS" },
            " suffix means zone-redundant. For an LRS disk, ",
            { code: "az disk show" },
            " tells you which form it is: no value in ",
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
            "For Kubernetes volumes, ",
            { a: "the AKS storage class guide", href: "/learn/aks-storage-classes" },
            " explains when a built-in class creates a ZRS disk instead of LRS.",
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
          text: "The route depends on whether the disk is regional or zonal. A regional disk changes type in place once its VM is deallocated, and deallocating stops the VM, so its services are down until it starts again. Microsoft describes the change as instantaneous. A disk’s type can change twice a day.",
        },
        {
          kind: "code",
          lang: "bash",
          code: "az vm deallocate --resource-group <resource-group> --name <vm-name>\naz disk update --resource-group <resource-group> --name <disk-name> --sku Premium_ZRS\naz vm start --resource-group <resource-group> --name <vm-name>",
        },
        {
          kind: "p",
          text: [
            "Use ",
            { code: "StandardSSD_ZRS" },
            " for a Standard SSD. Microsoft’s disk type conversion guide says the same steps work in reverse with ",
            { code: "Premium_LRS" },
            " or ",
            { code: "StandardSSD_LRS" },
            ". A ZRS disk’s zone configuration can’t change, though, so moving its data onto a zonal disk means a new disk created from a snapshot.",
          ],
        },
        {
          kind: "p",
          text: "A zonal LRS disk can’t be converted to ZRS directly. Microsoft’s LRS to ZRS guide has you snapshot it, create a new ZRS disk from the snapshot, then create a new VM with the new disks. A snapshot of a stopped VM is the cleanest copy, and stopping it is downtime.",
        },
        {
          kind: "code",
          lang: "bash",
          code: "az disk create --resource-group <resource-group> --name <new-disk-name> --sku Premium_ZRS --size-gb <size-gb> --source <snapshot-id>",
        },
        { kind: "p", text: "The old disks stay on your bill until you delete them." },
      ],
    },
    {
      id: "azure-disk-lrs-vs-zrs-when-zrs",
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
              "A zonal LRS disk might be unavailable until the zone recovers",
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
          text: "Microsoft recommends ZRS for the best reliability. Whether that’s worth 1.5 times the price depends on what else protects the data, and Microsoft’s own test is short: ZRS disks are appropriate when your workload can’t write synchronously to two zones at the application level, or must meet a zero recovery point objective (RPO), the amount of recent data you can afford to lose. Put as a decision:",
        },
        {
          kind: "ul",
          items: [
            "Choose ZRS for a single VM whose data must stay available through a zone outage, with no lost writes, when nothing in the application copies it to another zone. Choose it too for a shared disk behind a cluster spread over zones, such as a SQL Server failover cluster instance or SAP ASCS/SCS.",
            "Choose LRS when the application already replicates across zones. SQL Server Always On is Microsoft’s example, and Microsoft calls VMs with zonal LRS disks in each zone the most common way to achieve high availability for web servers, application tiers and database clusters.",
            "Choose LRS when the data can be rebuilt or restored, such as caches, scratch space, build output or a dev and test VM.",
            "Choose LRS with snapshots when losing the writes since your last snapshot is acceptable. Microsoft lists frequent ZRS snapshots as one way to protect an LRS disk, and incremental snapshots use ZRS automatically where the region offers it, each one after the first holding only the changes since the last. Cross-zone disaster recovery with Azure Site Recovery is another route, though Microsoft notes it doesn’t give a zero RPO.",
          ],
        },
        {
          kind: "p",
          text: [
            "In most regions an LRS disk costs two-thirds of the same disk on ZRS, so keep ZRS for the first case and put the rest on LRS. The provisioned size is the other lever on a disk’s price, covered in ",
            { a: "Azure disk cost optimization", href: "/learn/azure-disk-cost-optimization" },
            ".",
          ],
        },
      ],
    },
    {
      id: "zrs-disks-and-amoeba",
      title: "ZRS disks and Amoeba",
      blocks: [
        {
          kind: "p",
          text: "Amoeba optimizes block storage on Azure and AWS. For each VM you onboard, it moves the data disks onto one btrfs pool, sized from the highest use of the last 7\u00a0days so the pool sits inside its target band with room for the largest recent 15-minute rise and at least 10\u00a0GiB free. It then rightsizes the pool as the data grows and shrinks. On Azure, the pool is built from Premium SSD v2 where the region and zone offer it, and from Premium SSD otherwise, both on LRS.",
        },
        {
          kind: "p",
          text: [
            "It doesn’t keep zone redundancy. Every ",
            { a: "Amoeba pool", href: "/amoeba" },
            " is built from locally redundant disks, so data on zone-redundant (ZRS) disks moves to a locally redundant pool and loses zone redundancy. After the move, the VM’s data sits on LRS disks, with the drive and rack protection LRS gives inside one datacenter. A move only goes forward: after the 2-hour soak, Amoeba snapshots and deletes each source disk, and keeps each snapshot for 7\u00a0days.",
          ],
        },
        {
          kind: "p",
          text: [
            "So onboard only VMs whose data can live in one zone, such as data the application already replicates across zones or data you can rebuild. Leave a VM off if its ZRS disks are what carries it through a zone outage. Amoeba acts only on the VMs you onboard and leaves every other VM alone, so you can ",
            { a: "start with one VM", href: "/amoeba/faq#can-i-start-with-one-vm" },
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
      href: "/learn/azure-disk-cost-optimization",
    },
    {
      title: "Premium SSD vs Standard SSD on Azure: what you pay for",
      where: "Learn",
      href: "/learn/premium-ssd-vs-standard-ssd-azure",
    },
  ],
};
