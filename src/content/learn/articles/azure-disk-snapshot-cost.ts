import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/azure-disk-snapshot-cost/1";

export const article: Article = {
  slug: "azure-disk-snapshot-cost",
  title: "Azure disk snapshot cost: incremental vs full",
  meta: "Azure disk snapshot cost explained: full snapshots bill all used data each time, incremental ones bill the changes. October 2026 rates and a size check.",
  h1: "Azure disk snapshot cost: incremental vs full snapshots",
  deck: "What a managed disk snapshot bills for, why incremental ones cost less, and how to find the ones still billing.",
  card: "How full and incremental snapshots are billed, with October 2026 rates and a way to check what each one holds.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Azure block storage",
  published: "2026-11-04",
  updated: "2026-11-04",
  author: "pulkit",
  short:
    "Azure disk snapshot cost is the snapshot’s used size multiplied by a per-GB monthly rate, billed separately from the disk. A full snapshot bills all the data on the disk each time you take one. An incremental snapshot bills that data once, then only the changes, and always sits on Standard HDD storage. In East US in October 2026, Standard storage snapshots list at $0.05 per GB per month. Every snapshot bills until you delete it.",
  sections: [
    {
      id: "how-azure-disk-snapshot-cost-is-worked",
      title: "How Azure disk snapshot cost is worked out",
      blocks: [
        {
          kind: "p",
          text: [
            "A managed disk is billed on the size you provision, but a snapshot of it is billed on the data it holds. Microsoft’s own example is a full snapshot of a 500\u00a0GiB disk with 50\u00a0GiB in use, which is billed for 50\u00a0GiB. The charge is separate from the disk’s. Snapshots on Standard storage appear on your bill under the tier Standard HDD managed disks, as the meter LRS snapshots or ZRS snapshots, even when the source was a Premium SSD v2 or an Ultra Disk. LRS and ZRS mean ",
            {
              a: "locally redundant and zone-redundant storage",
              href: "/learn/azure-disk-lrs-vs-zrs",
            },
            ", and on Standard storage a snapshot costs the same in either.",
          ],
        },
        {
          kind: "p",
          text: [
            "Used size means data written to the disk that Azure still holds. When you delete a file inside a Linux VM, the filesystem marks the space free, but Azure only learns those pages are no longer valid when the VM sends TRIM (UNMAP) for them. Microsoft says TRIM can save money on storage billed by consumed space, “such as unmanaged standard disks and disk snapshots.” You can mount the filesystem with the ",
            { code: "discard" },
            " option, or run ",
            { code: "fstrim" },
            " on a schedule, which Microsoft suggests where ",
            { code: "discard" },
            " costs performance:",
          ],
        },
        { kind: "code", lang: "bash", code: "sudo fstrim <mount-path>" },
      ],
    },
    {
      id: "azure-incremental-snapshot-vs-full-snapshot",
      title: "Azure incremental snapshot vs full snapshot",
      blocks: [
        {
          kind: "p",
          text: "A full snapshot is a complete, read-only copy of the disk’s data at one point in time, so every one you keep bills the disk’s whole used size. An incremental snapshot stores only what changed since the previous snapshot of the same disk. The first in a chain is a full copy. Restoring from any of them still gives you the whole disk as it was when that snapshot was taken.",
        },
        {
          kind: "p",
          text: [
            "They also live on different storage. Incremental snapshots always use Standard HDD storage, whatever the source disk type, and use ZRS automatically in regions that offer it, falling back to LRS where ZRS isn’t available. Full snapshots can sit on Standard HDD or Premium SSD storage. The Azure CLI creates full snapshots on ",
            { code: "Standard_LRS" },
            " unless you pass another ",
            { code: "--sku" },
            ", and Microsoft recommends standard storage for snapshots because premium snapshots cost more. To take an incremental one, add ",
            { code: "--incremental true" },
            ":",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "az snapshot create --resource-group <resource-group> --name <snapshot-name> --source <disk-id> --incremental true",
        },
        {
          kind: "p",
          text: "Here is what the difference does to a bill. A disk holds 200\u00a0GB of data, about 5\u00a0GB of it changes each day, and you take one snapshot a day and keep the last seven.",
        },
        {
          kind: "ul",
          items: [
            "Seven full snapshots hold 7 × 200 = 1,400\u00a0GB.",
            "Seven incremental snapshots hold 200 + 6 × 5 = 230\u00a0GB.",
          ],
        },
        {
          kind: "p",
          text: "At the East US Standard rate in October 2026, $0.05 per GB per month, that’s $70.00 a month against $11.50. Put the full snapshots on Premium SSD storage at $0.132 and the same seven cost $184.80.",
        },
        { kind: "diagram", figure: figure1 },
        {
          kind: "p",
          text: "Incremental snapshots have limits. You can keep up to 500 per disk at any one time and create up to seven per disk every five minutes. They can’t move to another subscription or resource group, though you can copy them to another resource group or region. A chain can also restart. Changing a disk’s type or size can give its snapshots a new family, and the first snapshot in a new family is a full copy of the disk, so the first snapshot after a resize can bill the whole used size again.",
        },
        {
          kind: "p",
          text: "Incremental snapshots of Premium SSD v2 and Ultra Disk carry extra rules. A new one can’t be used until its background copy finishes, unless you enable instant access when you create it. Instant access adds a storage charge for the extra space the snapshot consumes, billed per GiB per hour, and a one-time fee for each disk you restore, based on the disk’s provisioned size. In East US in October 2026 the Retail Prices API lists that fee at $0.40 per provisioned TB for both disk types, and Microsoft isn’t charging for the instant access storage through January 2027.",
        },
      ],
    },
    {
      id: "azure-snapshot-pricing-and-how-to-estimate",
      title: "Azure snapshot pricing, and how to estimate yours",
      blocks: [
        {
          kind: "p",
          text: "Snapshots fall into three price cases. These are East US list prices from Microsoft’s pricing page in October 2026:",
        },
        {
          kind: "table",
          columns: [
            { label: "Snapshot", width: "65%" },
            { label: "Stored on", width: "23%" },
            { label: "Price per GB per month", width: "12%" },
          ],
          rows: [
            [
              ["Full, ", { code: "Standard_LRS" }, " or ", { code: "Standard_ZRS" }],
              "Standard HDD",
              "$0.05",
            ],
            [["Full, ", { code: "Premium_LRS" }], "Premium SSD", "$0.132"],
            ["Incremental, any source disk, LRS or ZRS", "Standard HDD", "$0.05"],
          ],
        },
        {
          kind: "p",
          text: "In West Europe and Central India the Standard rate is also $0.05, and Premium storage for full snapshots lists at $0.145 in West Europe. Azure managed disk snapshot pricing differs by region and changes over time, so check yours. Microsoft’s Azure Retail Prices API returns list prices without signing in:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "curl -s -G \"https://prices.azure.com/api/retail/prices\" \\\n  --data-urlencode \"\\$filter=productName eq 'Standard HDD Managed Disks' and meterName eq 'LRS Snapshots' and armRegionName eq '<region>'\"",
        },
        {
          kind: "p",
          text: "You don’t need an Azure snapshot cost calculator for the estimate itself, because Microsoft’s Azure Backup documentation gives a steady-state formula for its Enhanced policy, which keeps one full copy and then incremental snapshots: (data size + (days of snapshots kept − 1) × daily change) × price per GB. Its example is a 100\u00a0GB VM with a 2% daily change rate and 5\u00a0days of snapshots, billed as 108\u00a0GB. For full snapshots, the formula is snapshots kept × data size × price per GB.",
        },
      ],
    },
    {
      id: "snapshots-bill-until-you-delete-them",
      title: "Snapshots bill until you delete them",
      blocks: [
        {
          kind: "p",
          text: "A snapshot exists independently of its source disk. Deleting the disk leaves its snapshots in place, and a snapshot taken before a migration or a risky change bills every month until someone removes it. List what exists, how old it is, what it came from and what it’s stored on:",
        },
        {
          kind: "code",
          lang: "bash",
          code: 'az snapshot list --resource-group <resource-group> \\\n  --query "[].{name:name, incremental:incremental, sku:sku.name, created:timeCreated, source:creationData.sourceResourceId}" \\\n  --output table',
        },
        {
          kind: "p",
          text: [
            "A snapshot whose source disk no longer exists, or one older than any restore you’d still run, is the one to question. A row with ",
            { code: "incremental" },
            " false and ",
            { code: "Premium_LRS" },
            " is a full snapshot on the more expensive storage. Unattached disks are the same kind of leftover, with ",
            { a: "their own clean-up guide", href: "/learn/find-unattached-disks-azure" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "Deleting a snapshot removes that restore point, so check first that no runbook, image build or recovery plan still depends on it:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "az snapshot delete --resource-group <resource-group> --name <snapshot-name>",
        },
        {
          kind: "p",
          text: "Azure Backup keeps snapshots too. They serve its Instant Restore feature, and you pay for their storage beside your disks. By default it keeps 2\u00a0days of snapshots with the Standard policy and 7\u00a0days with the Enhanced policy, and you can set 1 to 5\u00a0days and 1 to 30\u00a0days. Instant Restore can’t be turned off. Don’t delete these snapshots by hand, since Microsoft warns that manual deletion can cause problems with backup consistency. To pay for fewer of them, shorten the snapshot retention in the backup policy.",
        },
      ],
    },
    {
      id: "how-to-check-an-incremental-snapshots-size",
      title: "How to check an incremental snapshot’s size",
      blocks: [
        {
          kind: "p",
          text: "Microsoft’s documented way to see a snapshot’s used size is the Azure usage report. A day’s line shows a share of the size, not the size itself. Microsoft’s example is a snapshot with 10\u00a0GiB of used data, which the daily usage report shows as 10\u00a0GiB ÷ 31\u00a0days = 0.3226, so that day’s quantity times 31 gives back the 10\u00a0GiB. In the usage file, look for the LRS snapshots or ZRS snapshots meter under Standard HDD managed disks, then narrow it to the snapshot you’re checking.",
        },
        {
          kind: "p",
          text: "If the figure is larger than you expected, two things can explain it. Pages the VM deleted without sending TRIM still count. And the first snapshot after a new family starts is a full copy, not a set of changes. Within one family you can retrieve the changes between two incremental snapshots of the same disk, but not across families.",
        },
        {
          kind: "p",
          text: "An empty incremental snapshot, taken when nothing changed, is 0\u00a0MiB. Microsoft notes one exception for now: empty snapshots of disks with a 4096-byte logical sector size show 6\u00a0MiB.",
        },
      ],
    },
    {
      id: "how-amoeba-uses-snapshots-when-it-moves",
      title: "How Amoeba uses snapshots when it moves a VM",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " is Zoorik’s block storage optimization for Azure managed disks and Amazon EBS. It moves a VM’s data disks onto one pool sized to the data, and its safety snapshots come at the end of that move. After the 2-hour soak that follows the switch onto the pool, Amoeba detaches each source disk, takes one incremental snapshot of it, waits until the snapshot is complete, and then deletes the disk. It keeps each snapshot for 7\u00a0days after its source disk is deleted, then deletes it, and it deletes only snapshots tagged with its own move’s ID. On AWS the safety snapshot is an EBS snapshot, which ",
            { a: "the EBS snapshot guide", href: "/learn/ebs-snapshot-cost" },
            " prices.",
          ],
        },
        {
          kind: "p",
          text: [
            "On Azure, those safety snapshots follow the rules above. Each is incremental, so it uses Standard HDD storage, and your cloud provider bills you directly for it, as it does for the disks Amoeba creates. During the move you pay for both sets of disks, from the moment the pool’s disks are created until the source disks are deleted after the soak, and then for the snapshots for 7\u00a0days. A disk that a shrink removes is handled differently: the agent first moves its data onto the pool’s other disks, and Amoeba then detaches the empty disk and deletes it, with no snapshot. If you stop Amoeba, any safety snapshot not yet deleted stays in your account. For why the source disks are replaced at all, see ",
            {
              a: "why a managed disk can’t shrink in place",
              href: "/learn/shrink-azure-managed-disk",
            },
            ".",
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
      title: "“Understand Azure Disk Storage billing”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-understand-billing",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Create an incremental snapshot”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-incremental-snapshots",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Create a snapshot of an Azure managed disk”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/snapshot-copy-managed-disk",
    },
    {
      publisher: "Microsoft Azure",
      title: "“Managed Disks pricing”",
      url: "https://azure.microsoft.com/en-us/pricing/details/managed-disks/",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Azure Retail Prices REST API overview”",
      url: "https://learn.microsoft.com/en-us/rest/api/cost-management/retail-prices/azure-retail-prices",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Azure Instant Restore Capability”",
      url: "https://learn.microsoft.com/en-us/azure/backup/backup-instant-restore-capability",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Use the portal to attach a data disk to a Linux VM”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/linux/attach-disk-portal",
      note: " (TRIM/UNMAP section)",
    },
    {
      publisher: "Microsoft Learn",
      title: "“az snapshot”",
      url: "https://learn.microsoft.com/en-us/cli/azure/snapshot",
    },
  ],
  related: [
    {
      title: "Can you shrink an Azure managed disk?",
      where: "Learn",
      href: "/learn/shrink-azure-managed-disk",
    },
    {
      title: "Azure disk cost optimization: stop paying for empty space",
      where: "Learn",
      href: "/learn/azure-disk-cost-optimization",
    },
    {
      title: "EBS snapshot cost: what you pay for and how to reduce it",
      where: "Learn",
      href: "/learn/ebs-snapshot-cost",
    },
    {
      title: "How to find unattached disks in Azure and stop paying for them",
      where: "Learn",
      href: "/learn/find-unattached-disks-azure",
    },
    {
      title: "In your Azure subscription",
      where: "Amoeba product guide",
      href: "/amoeba/guide#in-your-azure-subscription",
    },
  ],
};
