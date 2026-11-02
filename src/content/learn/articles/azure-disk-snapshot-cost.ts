import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/azure-disk-snapshot-cost/1";
import { figure as figure2 } from "@/features/learn/figures/azure-disk-snapshot-cost/2";

export const article: Article = {
  slug: "azure-disk-snapshot-cost",
  title: "Azure snapshot pricing: incremental vs full cost",
  meta: "Azure snapshot cost: a full snapshot is charged for all its data, an incremental one only for changes. The Azure snapshot price per GB, and how to estimate it.",
  h1: "Azure snapshot pricing and cost: incremental vs full snapshots",
  deck: "You pay a per-GB monthly rate for the data each snapshot holds, apart from the disk’s own charge.",
  card: "What full and incremental snapshots cost, with October 2026 rates and a way to check what each one holds.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Azure block storage",
  published: "2026-10-28",
  updated: "2026-11-02",
  author: "pulkit",
  cover: "/learn-covers/zoorik-learn-azure-disk-snapshot-cost-1200x630.webp",
  coverAlt:
    "A full snapshot copies all the disk’s data each time, an incremental one stores only the changes",
  short: [
    "Each full ",
    { a: "snapshot", href: "/learn/glossary/disk-snapshot" },
    " holds all the disk’s used data, but an incremental chain holds it once, then only the changes. Incremental snapshots always sit on ",
    { a: "Standard HDD", href: "/learn/glossary/azure-standard-hdd" },
    ": $0.05 per GB per month in East US, October 2026.",
  ],
  sections: [
    {
      id: "azure-disk-snapshot-cost-follows-the-data",
      title: "Azure disk snapshot cost follows the data a snapshot holds",
      blocks: [
        {
          kind: "p",
          text: "Take Microsoft’s own example: a full snapshot of a 500\u00a0GiB disk with 50\u00a0GiB in use. It’s charged for the 50\u00a0GiB of data it holds, a tenth of the disk’s provisioned size.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: [
            "On your invoice, Standard storage snapshots appear under Standard HDD managed disks, as LRS snapshots or ZRS snapshots. They appear there even when the source was a Premium SSD v2 or an Ultra Disk. LRS and ZRS mean ",
            {
              a: "locally redundant and zone-redundant storage",
              href: "/learn/azure-disk-lrs-vs-zrs",
            },
            ", and a Standard snapshot costs the same in either.",
          ],
        },
        {
          kind: "p",
          text: [
            "To see how much of each disk holds files, ",
            { a: "Azure VM disk usage", href: "/learn/azure-vm-disk-usage" },
            " reads the used space inside the VM.",
          ],
        },
        {
          kind: "p",
          text: "Azure’s used size is the data written to the disk that Azure still holds. So a file you delete inside a Linux VM can still count.",
        },
        {
          kind: "p",
          text: "Azure learns deleted pages are no longer valid only when the VM sends TRIM (UNMAP) for them. Microsoft says TRIM can save money on storage charged by consumed space, “such as unmanaged standard disks and disk snapshots.”",
        },
        {
          kind: "p",
          text: [
            "To send TRIM, mount the filesystem with the ",
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
      id: "azure-incremental-snapshot-vs-full-you-pay",
      title: "Azure incremental snapshot vs full: you pay for all the data in every full copy",
      blocks: [
        {
          kind: "p",
          text: "A full snapshot is a complete, read-only copy of the disk’s data at one point in time. So if you keep seven, you pay for that data seven times.",
        },
        {
          kind: "p",
          text: "An incremental snapshot stores only what changed since the previous snapshot of the same disk. The first in a chain is a full copy, and any of them restores the whole disk as it was then.",
        },
        {
          kind: "p",
          text: "Incremental snapshots always use Standard HDD storage, whatever the source disk type. They use ZRS in regions that offer it, and LRS where ZRS isn’t available.",
        },
        {
          kind: "p",
          text: "Full snapshots can sit on Standard HDD or Premium SSD storage. Microsoft recommends standard storage, because premium snapshots cost more.",
        },
        {
          kind: "h3",
          id: "seven-daily-snapshots-full-vs-incremental",
          title: "Seven daily snapshots, full vs incremental",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "A disk holds 200\u00a0GB of data, and about 5\u00a0GB of it changes each day. You take one snapshot a day and keep the last seven.",
        },
        {
          kind: "ul",
          items: [
            "Seven full snapshots hold 7 × 200 = 1,400\u00a0GB. At the East US Standard rate in October 2026, $0.05 per GB per month, that’s $70.00 a month.",
            "Seven incremental ones hold one full copy plus six days of changes, 200 + 6 × 5 = 230\u00a0GB, so $11.50 a month.",
            "The incremental chain holds 1,170\u00a0GB less, which is $58.50 a month.",
          ],
        },
        {
          kind: "p",
          text: "The same seven full snapshots on Premium SSD storage, at $0.132 per GB, cost 1,400 × $0.132 = $184.80 a month.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: [
            "The Azure CLI takes a full snapshot on ",
            { code: "Standard_LRS" },
            " unless you pass another ",
            { code: "--sku" },
            ". For an incremental one, add ",
            { code: "--incremental true" },
            ":",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "az snapshot create --resource-group <resource-group> \\\n  --name <snapshot-name> --source <disk-id> \\\n  --incremental true",
        },
        { kind: "h3", id: "extra-rules-and-limits", title: "Extra rules and limits" },
        {
          kind: "callout",
          label: "For engineers",
          text: "A new incremental snapshot of Premium SSD v2 or Ultra Disk can’t be used until its background copy finishes. Enabling instant access when you create it removes that wait.",
        },
        { kind: "p", text: "Instant access adds two charges:" },
        {
          kind: "ul",
          items: [
            "Storage for the extra space the snapshot consumes, per GiB per hour.",
            "A one-time fee for each disk you restore, based on its provisioned size.",
          ],
        },
        {
          kind: "p",
          text: "In East US in October 2026, the Retail Prices API lists that fee at $0.40 per provisioned TB for both disk types. Instant access storage isn’t charged through January 2027.",
        },
        { kind: "p", text: "Incremental snapshots have limits:" },
        {
          kind: "ul",
          items: [
            "You can keep up to 500 per disk at any one time.",
            "You can create up to seven per disk every five minutes.",
            "They can’t move to another subscription or resource group, though you can copy them to another resource group or region.",
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "Changing a disk’s type or size can start a new chain, called a new family. Its first snapshot is a full copy, so you pay for the whole used size again.",
        },
      ],
    },
    {
      id: "azure-snapshot-pricing-and-how-to-estimate",
      title: "Azure snapshot pricing, and how to estimate your cost",
      blocks: [
        {
          kind: "p",
          text: "Snapshots fall into three price cases, shown here as East US list prices from Microsoft’s pricing page in October 2026:",
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
          text: "West Europe and Central India also list the Standard rate at $0.05, and West Europe lists Premium storage for full snapshots at $0.145. Prices differ by region and change over time, so check yours.",
        },
        {
          kind: "ol",
          items: [
            [
              { b: "Find your region’s rate." },
              " Microsoft’s Azure Retail Prices API returns list prices without signing in:",
            ],
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "curl -s -G \"https://prices.azure.com/api/retail/prices\" \\\n  --data-urlencode \"\\$filter=productName eq 'Standard HDD Managed Disks' and meterName eq 'LRS Snapshots' and armRegionName eq '<region>'\"",
        },
        {
          kind: "ol",
          start: 2,
          items: [
            [
              { b: "Work out the data your snapshots hold." },
              " For incremental snapshots, use the steady-state formula from Microsoft’s Azure Backup documentation: data size + (days of snapshots kept − 1) × daily change. It comes from the Enhanced policy, which keeps one full copy and then incremental snapshots. For full snapshots, it’s snapshots kept × data size.",
            ],
            [{ b: "Multiply by the price per GB" }, " to get the monthly charge."],
          ],
        },
        {
          kind: "p",
          text: "Microsoft’s own example is a 100\u00a0GB VM with a 2% daily change rate and snapshots kept for 5\u00a0days. It’s charged as 108\u00a0GB, since 100 + (5 − 1) × 2 = 108.",
        },
      ],
    },
    {
      id: "you-pay-for-a-snapshot-until-you",
      title: "You pay for a snapshot until you delete it, even after its disk is gone",
      blocks: [
        {
          kind: "p",
          text: "A snapshot exists apart from its source disk. So deleting the disk leaves its snapshots in place, such as one taken before a migration or a risky change.",
        },
        {
          kind: "ol",
          items: [
            [
              { b: "List what exists." },
              " The table shows when each snapshot was created, what it came from and what it’s stored on:",
            ],
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: 'az snapshot list --resource-group <resource-group> \\\n  --query "[].{name:name, incremental:incremental, sku:sku.name, created:timeCreated, source:creationData.sourceResourceId}" \\\n  --output table',
        },
        {
          kind: "ol",
          start: 2,
          items: [
            [
              { b: "Question the leftovers." },
              " A snapshot whose source disk no longer exists, or one older than any restore you’d still run, is the one to question. A row with ",
              { code: "incremental" },
              " false and ",
              { code: "Premium_LRS" },
              " is a full snapshot on the more expensive storage.",
            ],
            [
              { b: "Check, then delete." },
              " Deleting a snapshot removes that restore point, so check first that no runbook, image build or recovery plan still depends on it:",
            ],
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "az snapshot delete --resource-group <resource-group> --name <snapshot-name>",
        },
        {
          kind: "p",
          text: [
            "Unattached disks are the same kind of leftover. ",
            {
              a: "How to find unattached disks in Azure",
              href: "/learn/find-unattached-disks-azure",
            },
            " covers those.",
          ],
        },
        {
          kind: "p",
          text: "Azure Backup keeps snapshots for its Instant Restore feature, and you pay for them beside your disks. The Standard policy keeps 2\u00a0days of them by default, and you can set 1 to 5. The Enhanced policy keeps 7\u00a0days by default, and you can set 1 to 30.",
        },
        {
          kind: "p",
          text: "Instant Restore can’t be turned off, and Microsoft warns that deleting these snapshots by hand can cause problems with backup consistency. To pay for fewer, shorten the snapshot retention in the backup policy.",
        },
      ],
    },
    {
      id: "how-to-check-an-incremental-snapshots-size",
      title: "How to check an incremental snapshot’s size",
      blocks: [
        {
          kind: "p",
          text: "Microsoft’s documented way to see a snapshot’s used size is the Azure usage report. A day’s line shows a share of the size, not the size itself, so read it in two steps:",
        },
        {
          kind: "ol",
          items: [
            [
              { b: "Find the meter." },
              " In the usage file, find the LRS snapshots or ZRS snapshots meter under Standard HDD managed disks. Then narrow it to the snapshot you’re checking.",
            ],
            [
              { b: "Turn the day’s quantity back into a size." },
              " Microsoft’s example is a snapshot with 10\u00a0GiB of used data. The daily usage report shows it as 10\u00a0GiB ÷ 31\u00a0days = 0.3226. So that day’s quantity times 31 gives back the 10\u00a0GiB.",
            ],
          ],
        },
        {
          kind: "p",
          text: "If the figure is larger than you expected, two things can explain it:",
        },
        {
          kind: "ul",
          items: [
            "Pages the VM deleted without sending TRIM still count.",
            "The first snapshot of a new family is a full copy, not a set of changes.",
          ],
        },
        {
          kind: "p",
          text: "Within one family, you can retrieve the changes between two incremental snapshots of the same disk, but not across families.",
        },
        {
          kind: "p",
          text: "An empty incremental snapshot is 0\u00a0MiB. For now, Microsoft notes one exception: on disks with a 4096-byte logical sector size, an empty one shows 6\u00a0MiB.",
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
            " optimizes block storage. It moves the data disks of running Windows and Linux VMs, on Azure and AWS, onto one btrfs pool sized to your data.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "The old disks." },
              " Once the switch to the pool is checked, Amoeba takes a safety snapshot of each old disk. It deletes the disk once its snapshot is complete.",
            ],
            [
              { b: "On Azure," },
              " each safety snapshot is incremental, so it uses Standard HDD storage. On AWS it’s an EBS snapshot, which ",
              { a: "the EBS snapshot guide", href: "/learn/ebs-snapshot-cost" },
              " prices.",
            ],
            [
              { b: "Cleanup." },
              " Amoeba keeps each snapshot for a few days, then deletes it. It deletes only the snapshots it created.",
            ],
          ],
        },
        {
          kind: "p",
          text: "Your cloud provider charges you directly for these snapshots. You pay for both sets of disks only while the move runs, then for the snapshots while they’re kept.",
        },
        {
          kind: "p",
          text: "A disk that a shrink removes gets no snapshot. Amoeba first moves its data onto the pool’s other disks, then deletes the empty disk.",
        },
        {
          kind: "p",
          text: [
            "If you stop Amoeba, any safety snapshot not yet deleted stays in your account. ",
            {
              a: "Why a managed disk can’t shrink in place",
              href: "/learn/shrink-azure-managed-disk",
            },
            " explains why the old disks are replaced.",
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
      title: "Azure disk reservations: are they worth it?",
      where: "Learn",
      href: "/learn/azure-disk-reservations",
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
      title: "What Amoeba creates in your Azure subscription",
      where: "Amoeba product guide",
      href: "/amoeba-guide#in-your-azure-subscription",
    },
  ],
};
