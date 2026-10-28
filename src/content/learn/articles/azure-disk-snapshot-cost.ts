import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/azure-disk-snapshot-cost/1";
import { figure as figure2 } from "@/features/learn/figures/azure-disk-snapshot-cost/2";

export const article: Article = {
  slug: "azure-disk-snapshot-cost",
  title: "Azure disk snapshot cost: incremental vs full",
  meta: "Azure disk snapshot cost explained: full snapshots charge for all used data each time, incremental ones for the changes. October 2026 rates and a size check.",
  h1: "Azure disk snapshot cost: incremental vs full snapshots",
  deck: "What you pay for in a managed disk snapshot, why incremental ones cost less, and how to find the ones you still pay for.",
  card: "What full and incremental snapshots cost, with October 2026 rates and a way to check what each one holds.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Azure block storage",
  published: "2026-10-28",
  updated: "2026-10-28",
  author: "pulkit",
  short:
    "Azure disk snapshot cost is the snapshot’s used size multiplied by a per-GB monthly rate, charged separately from the disk. Each full snapshot charges for all the data on the disk. An incremental snapshot charges for that data once, then only the changes, and always sits on Standard HDD storage. In East US in October 2026, Standard storage snapshots list at $0.05 per GB per month. You pay for every snapshot until you delete it.",
  sections: [
    {
      id: "azure-disk-snapshot-cost-follows-the-data",
      title: "Azure disk snapshot cost follows the data a snapshot holds",
      blocks: [
        {
          kind: "p",
          text: "Take Microsoft’s own example: a full snapshot of a 500\u00a0GiB disk with 50\u00a0GiB in use. The disk is charged on the size you provisioned.",
        },
        {
          kind: "p",
          text: "The snapshot charges only for the 50\u00a0GiB of data it holds, a tenth of the disk’s size. That charge is separate from the disk’s, and comes on top of it.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: [
            "On your invoice, Standard storage snapshots appear under the tier Standard HDD managed disks, as the meter LRS snapshots or ZRS snapshots. They appear there even when the source was a Premium SSD v2 or an Ultra Disk. LRS and ZRS mean ",
            {
              a: "locally redundant and zone-redundant storage",
              href: "/learn/azure-disk-lrs-vs-zrs",
            },
            ", and a snapshot on Standard storage costs the same in either.",
          ],
        },
        {
          kind: "p",
          text: "Used size means data written to the disk that Azure still holds. A file you delete inside a Linux VM can still be part of it.",
        },
        {
          kind: "p",
          text: "The filesystem marks the space free, but Azure only learns those pages are no longer valid when the VM sends TRIM (UNMAP) for them. Microsoft says TRIM can save money on storage charged by consumed space, “such as unmanaged standard disks and disk snapshots.”",
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
          text: "Keep seven full snapshots of a disk and you pay for its data seven times. A full snapshot is a complete, read-only copy of the disk’s data at one point in time. So for every one you keep, you pay for the disk’s whole used size.",
        },
        {
          kind: "p",
          text: "An incremental snapshot stores only what changed since the previous snapshot of the same disk. The first in a chain is a full copy. Restoring from any of them still gives you the whole disk as it was when that snapshot was taken.",
        },
        {
          kind: "p",
          text: "The two also live on different storage. Incremental snapshots always use Standard HDD storage, whatever the source disk type. They use ZRS automatically in regions that offer it, and LRS where ZRS isn’t available.",
        },
        {
          kind: "p",
          text: "Full snapshots can sit on Standard HDD or Premium SSD storage. Microsoft recommends standard storage for snapshots, because premium snapshots cost more.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "A disk holds 200\u00a0GB of data, and about 5\u00a0GB of it changes each day. You take one snapshot a day and keep the last seven.",
        },
        {
          kind: "ul",
          items: [
            "Seven full snapshots hold 7 × 200 = 1,400\u00a0GB. At the East US Standard rate in October 2026, $0.05 per GB per month, that’s 1,400 × $0.05 = $70.00 a month.",
            "Seven incremental ones hold the first full copy plus six days of changes, 200 + 6 × 5 = 230\u00a0GB. That’s 230 × $0.05 = $11.50 a month.",
            "The incremental chain holds 1,400 − 230 = 1,170\u00a0GB less, which is $58.50 a month.",
          ],
        },
        {
          kind: "p",
          text: "Put the full snapshots on Premium SSD storage at $0.132, and the same seven cost 1,400 × $0.132 = $184.80 a month.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: [
            "The Azure CLI creates a full snapshot on ",
            { code: "Standard_LRS" },
            " unless you pass another ",
            { code: "--sku" },
            ". To take an incremental one, add ",
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
          kind: "callout",
          label: "For engineers",
          text: "Incremental snapshots of Premium SSD v2 and Ultra Disk carry extra rules. A new one can’t be used until its background copy finishes, unless you enable instant access when you create it.",
        },
        { kind: "p", text: "Instant access adds two charges:" },
        {
          kind: "ul",
          items: [
            "Storage for the extra space the snapshot consumes, charged per GiB per hour.",
            "A one-time fee for each disk you restore, based on the disk’s provisioned size.",
          ],
        },
        {
          kind: "p",
          text: "In East US in October 2026, the Retail Prices API lists that fee at $0.40 per provisioned TB for both disk types. Microsoft isn’t charging for the instant access storage through January 2027.",
        },
        {
          kind: "p",
          text: "Incremental snapshots have limits. You can keep up to 500 per disk at any one time and create up to seven per disk every five minutes. They can’t move to another subscription or resource group, though you can copy them to another resource group or region.",
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "A chain can restart. Changing a disk’s type or size can give its snapshots a new family. The first snapshot in a new family is a full copy of the disk. So after a resize, the next snapshot can charge for the whole used size again.",
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
          text: "In West Europe and Central India the Standard rate is also $0.05, and West Europe lists Premium storage for full snapshots at $0.145. Azure managed disk snapshot pricing differs by region and changes over time, so check yours.",
        },
        {
          kind: "p",
          text: "You don’t need an Azure snapshot cost calculator for the estimate itself. Three steps do it:",
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
          text: "Microsoft’s own example is a 100\u00a0GB VM with a 2% daily change rate and snapshots kept for 5\u00a0days. It’s charged as 108\u00a0GB: 2% of 100\u00a0GB is 2\u00a0GB a day, and 100 + (5 − 1) × 2 = 108.",
        },
        {
          kind: "p",
          text: "The same formula gives the worked example’s 230\u00a0GB, since 200 + (7 − 1) × 5 = 230.",
        },
      ],
    },
    {
      id: "you-pay-for-a-snapshot-until-you",
      title: "You pay for a snapshot until you delete it",
      blocks: [
        {
          kind: "p",
          text: "A snapshot taken before a migration or a risky change costs money every month until someone removes it, even after its disk is gone. A snapshot exists apart from its source disk, so deleting the disk leaves its snapshots in place. To find the ones you still pay for:",
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
            "Unattached disks are the same kind of leftover, with ",
            { a: "their own clean-up guide", href: "/learn/find-unattached-disks-azure" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "Azure Backup keeps snapshots too. They serve its Instant Restore feature, and you pay for their storage beside your disks.",
        },
        {
          kind: "p",
          text: "By default it keeps 2\u00a0days of snapshots with the Standard policy, and 7\u00a0days with the Enhanced policy. You can set 1 to 5\u00a0days and 1 to 30\u00a0days respectively.",
        },
        {
          kind: "p",
          text: "Instant Restore can’t be turned off. Don’t delete these snapshots by hand, since Microsoft warns that manual deletion can cause problems with backup consistency. To pay for fewer of them, shorten the snapshot retention in the backup policy.",
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
            "The first snapshot after a new family starts is a full copy, not a set of changes.",
          ],
        },
        {
          kind: "p",
          text: "Within one family, you can retrieve the changes between two incremental snapshots of the same disk, but not across families.",
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
            " optimizes block storage. It works on the data disks of running VMs: Azure managed disks and Amazon EBS volumes, on Windows and Linux VMs. It moves a VM’s data disks onto one btrfs pool, sized to your data, with room to grow.",
          ],
        },
        { kind: "p", text: "Its safety snapshots come at the end of that move:" },
        {
          kind: "ul",
          items: [
            [
              { b: "The old disks." },
              " Once the switch to the pool is checked, Amoeba snapshots each old disk. It deletes the disk only after its snapshot is complete.",
            ],
            [
              { b: "On Azure," },
              " each safety snapshot is incremental, so it uses Standard HDD storage, as described above. On AWS it’s an EBS snapshot, which ",
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
          text: "Your cloud provider charges you directly for these snapshots, as it does for the disks Amoeba creates. You pay for both sets of disks only while the move runs, and then for the snapshots while they’re kept.",
        },
        {
          kind: "p",
          text: "A disk that a shrink removes is handled differently. Amoeba first moves its data onto the pool’s other disks, then deletes the empty disk, with no snapshot.",
        },
        {
          kind: "p",
          text: [
            "If you stop Amoeba, any safety snapshot not yet deleted stays in your account. For why the old disks are replaced at all, see ",
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
