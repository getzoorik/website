import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/azure-disk-lrs-vs-zrs/1";
import { figure as figure2 } from "@/features/learn/figures/azure-disk-lrs-vs-zrs/2";
import { figure as figure3 } from "@/features/learn/figures/azure-disk-lrs-vs-zrs/3";

export const article: Article = {
  slug: "azure-disk-lrs-vs-zrs",
  title: "Azure LRS vs ZRS disks: cost and zone outages",
  meta: "Azure LRS keeps a managed disk’s three copies in one datacenter; ZRS spreads them over three zones. What each costs, what an outage does, which to pick.",
  h1: "Azure LRS vs ZRS for managed disks",
  deck: "ZRS keeps a disk’s data available through a zone outage, at 1.5 times the LRS list price in most regions.",
  card: "Where each keeps its copies, what a zone outage does, the price gap, and how to convert.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Azure block storage",
  versus: ["LRS", "ZRS"],
  published: "2026-11-01",
  updated: "2026-11-03",
  author: "harsh",
  cover: "/learn-covers/zoorik-learn-azure-disk-lrs-vs-zrs-1200x630.webp",
  coverAlt:
    "Azure disk LRS vs ZRS: LRS keeps the copies in one datacenter, ZRS spreads them across zones at a higher price",
  short: [
    "Locally redundant storage (LRS) is the default for an Azure ",
    { a: "managed disk", href: "/learn/glossary/azure-managed-disk" },
    ": three copies in one datacenter. Zone-redundant storage (ZRS) writes the copies across three availability zones, so the data stays available through a zone outage, with slower writes. Pay for ZRS only where nothing else, such as the application’s own replication, keeps that data available.",
  ],
  sections: [
    {
      id: "where-lrs-and-zrs-keep-your-three",
      title: "Where the copies live",
      blocks: [
        {
          kind: "p",
          text: "A zone is a physically separate group of datacenters in a region, with its own power, cooling and networking. Both options keep three copies of a disk. They differ in where the copies sit.",
        },
        {
          kind: "h3",
          id: "lrs-three-copies-in-one-datacenter",
          title: "LRS in Azure",
        },
        {
          kind: "p",
          text: "LRS is the default and costs the least. It writes all three copies synchronously inside one datacenter. Microsoft states at least 99.999999999% (11 nines) of durability a year.",
        },
        {
          kind: "p",
          text: "LRS protects against drive and server rack failures. It doesn’t cover a disaster such as a fire or flood inside that datacenter.",
        },
        {
          kind: "p",
          text: "An LRS disk is zonal or regional, at the same price. A zonal disk is pinned to one zone and attaches only to VMs in that zone. A regional (nonzonal) disk has no zone set, and Azure may place it in any zone.",
        },
        {
          kind: "p",
          text: "Managed disks offer only LRS and ZRS. The geo-redundant options of storage accounts, GRS and GZRS, don’t apply to them.",
        },
        {
          kind: "h3",
          id: "zrs-copies-in-three-zones",
          title: "ZRS in Azure",
        },
        {
          kind: "p",
          text: "ZRS replicates the disk synchronously across three zones. Microsoft states at least 12 nines of durability a year.",
        },
        {
          kind: "p",
          text: "A write completes only once the data is stored in more than one zone, which adds write latency. Microsoft gives no latency figure and advises benchmarking your workload on both.",
        },
        {
          kind: "p",
          text: [
            "Apart from write latency, Microsoft says ZRS disks “are identical to disks using LRS”, with the same scale targets. A ",
            { a: "Premium SSD", href: "/learn/glossary/azure-premium-ssd" },
            " P20 gets the same IOPS and throughput on either.",
          ],
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "in-a-zone-outage-lrs-waits-and",
      title: "In a zone outage",
      blocks: [
        {
          kind: "p",
          text: "A zonal LRS disk keeps all three copies in its own zone. If that zone goes down, the disk is unavailable until the zone recovers. The data isn’t lost, and the disk comes back with the zone.",
        },
        {
          kind: "p",
          text: "With a single VM, detecting the outage and moving traffic to another VM are your job. Microsoft doesn’t notify you when a zone goes down, but Resource Health and Service Health alerts can.",
        },
        { kind: "p", text: "With ZRS, the result depends on what the outage reaches:" },
        {
          kind: "ul",
          items: [
            [
              { b: "The VM stays healthy." },
              " Azure redirects disk operations to the healthy zones, and the VM keeps running.",
            ],
            [
              { b: "The VM fails." },
              " The data stays available, but the VM doesn’t move. Force detach the disk, which works on data disks only, and attach it to a VM in a healthy zone.",
            ],
            [
              { b: "The disk is shared." },
              " When the primary VM’s zone fails, a shared ZRS disk is already available to a secondary VM in another zone. Microsoft expects no data loss and no downtime.",
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
          text: "You still need a second VM, or a plan to create one, to serve the data.",
        },
        { kind: "svg", figure: figure2 },
      ],
    },
    {
      id: "azure-lrs-vs-zrs-pricing-1-5",
      title: "LRS vs ZRS pricing",
      blocks: [
        {
          kind: "p",
          text: "Microsoft says ZRS costs more than LRS, by an amount that varies by region and disk type. The Azure Retail Prices API, Microsoft’s public list of prices, shows the gap.",
        },
        {
          kind: "p",
          text: "In October 2026, 40 of the 42 regions that list a Premium SSD P20 on ZRS price it at 1.5 times the LRS disk. Only Japan West and New Zealand North differ. Standard SSD E20 matches in 39 of 41. Every other tier, P1 to P80 and E1 to E80, shows 1.5 in all but one to four regions.",
        },
        {
          kind: "h3",
          id: "most-regions-list-zrs-at-1-5",
          title: "Example: four P20 disks",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "A VM in East US has four 512 GiB Premium SSD (P20) data disks. At pay-as-you-go list prices, a P20 costs $73.22 a month on LRS and $109.81 on ZRS: $109.81 ÷ $73.22 = 1.50.",
        },
        {
          kind: "p",
          text: "Four disks cost 4 × $73.22 = $292.88 a month on LRS, and 4 × $109.81 = $439.24 on ZRS. ZRS adds $439.24 − $292.88 = $146.36 a month, or 12 × $146.36 = $1,756.32 a year.",
        },
        { kind: "p", text: "A single 1,024 GiB P30 goes from $135.17 to $202.73 a month." },
        {
          kind: "p",
          text: [
            "Prices change by region and over time, so check the managed disks pricing page. Our ",
            { a: "Azure disk pricing calculator", href: "/ebs-and-azure-disk-pricing" },
            " gives a Premium SSD or Standard SSD disk’s LRS list price.",
          ],
        },
        { kind: "svg", figure: figure3 },
        {
          kind: "h3",
          id: "reservations-shared-disks-and-snapshots",
          title: "Reservations, shared disks, snapshots",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Reservations." },
              " The Retail Prices API lists one-year reservations for Premium SSD P30 to P80 on LRS, and none for ZRS.",
            ],
            [
              { b: "Shared disks." },
              " Each extra mount of a shared Premium SSD has a monthly charge, the same on LRS and ZRS.",
            ],
            [
              { b: "Snapshots." },
              " ",
              { a: "Incremental snapshots", href: "/learn/azure-disk-snapshot-cost" },
              " sit on Standard HDD storage. LRS and ZRS snapshots cost the same there: $0.05 per GB a month in East US, on the data they hold.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Disk type and performance are separate choices: see ",
            {
              a: "Premium SSD vs Standard SSD on Azure",
              href: "/learn/premium-ssd-vs-standard-ssd-azure",
            },
            " and ",
            { a: "performance tiers", href: "/learn/azure-disk-performance-tiers" },
            ".",
          ],
        },
      ],
    },
    {
      id: "which-azure-managed-disks-can-use-zrs",
      title: "Which disks support ZRS",
      blocks: [
        {
          kind: "p",
          text: [
            "Only Premium SSD (SKU ",
            { code: "Premium_ZRS" },
            ") and Standard SSD (",
            { code: "StandardSSD_ZRS" },
            ") offer ZRS. Premium SSD v2, Ultra Disk and Standard HDD are LRS only.",
          ],
        },
        {
          kind: "p",
          text: [
            "So moving from ",
            {
              a: "Premium SSD to Premium SSD v2",
              href: "/learn/premium-ssd-v2-vs-premium-ssd",
            },
            " gives up ZRS. For LRS-only disks, Microsoft’s route to zone resilience is several VMs in different zones, each with its own zonal disks.",
          ],
        },
        {
          kind: "p",
          text: "ZRS needs a region with availability zones, and Microsoft says every such region offers it. In October 2026, the Retail Prices API lists a P20 disk on LRS in 66 regions and on ZRS in 42.",
        },
        {
          kind: "p",
          text: [
            "To check your disks, list them with their SKU: a ",
            { code: "_ZRS" },
            " suffix means zone-redundant. For an LRS disk, ",
            { code: "az disk show" },
            " shows whether it is zonal or regional. No value in ",
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
            " explains when a built-in Kubernetes class creates a ZRS disk.",
          ],
        },
      ],
    },
    {
      id: "how-to-convert-a-disk-from-lrs",
      title: "Convert LRS to ZRS",
      blocks: [
        {
          kind: "p",
          text: [
            "The route depends on whether the disk is regional or zonal, as ",
            { code: "az disk show" },
            " reports.",
          ],
        },
        {
          kind: "h3",
          id: "a-regional-disk-changes-type-in-place",
          title: "Regional disk: change in place",
        },
        {
          kind: "p",
          text: "The VM must be deallocated, which stops its services until you start it again. Microsoft calls the change itself instantaneous. A disk’s type can change twice a day.",
        },
        {
          kind: "ol",
          items: ["Deallocate the VM."],
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
            "The same steps work in reverse, with ",
            { code: "Premium_LRS" },
            " or ",
            { code: "StandardSSD_LRS" },
            ". A ZRS disk’s zone setting can’t change, though. Moving its data to a zonal disk takes a new disk created from a snapshot.",
          ],
        },
        {
          kind: "h3",
          id: "a-zonal-disk-is-copied-through-a",
          title: "Zonal disk: copy via snapshot",
        },
        {
          kind: "p",
          text: "A zonal LRS disk can’t change to ZRS in place. Microsoft’s LRS to ZRS guide has you copy it instead:",
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
          text: "You keep paying for the old disks until you delete them.",
        },
      ],
    },
    {
      id: "azure-disk-lrs-vs-zrs",
      title: "Which to choose",
      blocks: [
        {
          kind: "table",
          columns: [
            { label: "What differs", width: "30%" },
            { label: "LRS", width: "30%" },
            { label: "ZRS", width: "40%" },
          ],
          rows: [
            ["Where the three copies live", "One datacenter", "Three availability zones"],
            ["Durability Microsoft states", "At least 11 nines a year", "At least 12 nines a year"],
            [
              "In a zone outage",
              "A zonal disk is unavailable until the zone recovers",
              "The data stays available; a data disk can move to a VM in a healthy zone",
            ],
            ["Writes", "Less latency", "More latency"],
            ["IOPS and throughput", "Set by the disk’s tier", "The same as LRS for that tier"],
            ["Disk types", "All five", "Premium SSD and Standard SSD"],
            ["Regions", "Every managed disk region", "Regions with availability zones"],
            ["512 GiB Premium SSD (P20), East US, Oct 2026", "$73.22 a month", "$109.81 a month"],
            ["512 GiB Standard SSD (E20), East US, Oct 2026", "$38.40 a month", "$57.60 a month"],
            ["One-year disk reservations", "P30 to P80", "None listed"],
          ],
        },
        {
          kind: "p",
          text: "Microsoft recommends ZRS for the best reliability. It calls ZRS appropriate when the application can’t replicate synchronously across zones, or must meet a zero recovery point objective (RPO): no lost writes.",
        },
        { kind: "h3", id: "which-disks-go-on-which", title: "Which disks go where" },
        {
          kind: "ul",
          items: [
            [
              { b: "ZRS for a single VM" },
              " whose data must stay available through a zone outage, when nothing in the application copies it to another zone.",
            ],
            [
              { b: "ZRS for a shared disk" },
              " behind a cluster spread over zones, such as a SQL Server failover cluster instance or SAP ASCS/SCS.",
            ],
            [
              { b: "LRS when the application replicates across zones," },
              " as SQL Server Always On does. Microsoft calls VMs with zonal LRS disks in each zone the most common high-availability setup for web servers, application tiers and database clusters.",
            ],
            [
              { b: "LRS when the data can be rebuilt or restored," },
              " such as caches, scratch space, build output or a dev and test VM.",
            ],
            [
              { b: "LRS with snapshots" },
              " when losing the writes since the last snapshot is acceptable. Microsoft lists frequent ZRS snapshots as one way to protect an LRS disk. Incremental snapshots use ZRS automatically where the region offers it, and after the first, each holds only the changes since the last.",
            ],
            [
              { b: "LRS with Azure Site Recovery" },
              " for cross-zone disaster recovery, which doesn’t give a zero RPO.",
            ],
          ],
        },
        {
          kind: "callout",
          label: "Rule of thumb",
          text: "In most regions an LRS disk costs two-thirds of the same disk on ZRS. Keep ZRS for the two ZRS cases above, and put the rest on LRS.",
        },
        {
          kind: "p",
          text: [
            "Provisioned size is the other lever on a disk’s price: see ",
            {
              a: "Azure managed disk cost optimization",
              href: "/azure-managed-disk-cost-optimization",
            },
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
            " rightsizes block storage on Azure and AWS, and every pool it builds is locally redundant. Data on ZRS disks moves to an LRS pool. It keeps the drive and rack protection of LRS and loses zone redundancy.",
          ],
        },
        {
          kind: "p",
          text: "On Azure, the pool uses Premium SSD v2 where the VM’s region and zone offer it, and Premium SSD otherwise.",
        },
        {
          kind: "p",
          text: "A move only goes forward. Once the switch is checked, Amoeba snapshots each old disk, deletes the disk, and keeps the snapshot for 7 days before deleting it too.",
        },
        {
          kind: "p",
          text: "Amoeba acts only on the VMs you onboard. Onboard those whose data can live in one zone, such as data the application replicates across zones, or data you can rebuild. Leave a VM off if its ZRS disks are what carries it through a zone outage.",
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
      title: "“Data redundancy - Azure Storage”",
      url: "https://learn.microsoft.com/en-us/azure/storage/common/storage-redundancy",
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
      title: "Azure disk types",
      where: "Learn",
      href: "/learn/azure-managed-disk-types",
    },
    {
      title: "Premium SSD v2 vs Premium SSD",
      where: "Learn",
      href: "/learn/premium-ssd-v2-vs-premium-ssd",
    },
    {
      title: "Kubernetes storage classes on AKS",
      where: "Learn",
      href: "/learn/aks-storage-classes",
    },
    {
      title: "Azure disk reservations: are they worth it?",
      where: "Learn",
      href: "/learn/azure-disk-reservations",
    },
    {
      title: "Azure Premium SSD vs Standard SSD",
      where: "Learn",
      href: "/learn/premium-ssd-vs-standard-ssd-azure",
    },
  ],
  relatedTitle: "More on Azure managed disks",
};
