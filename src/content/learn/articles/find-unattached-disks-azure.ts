import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/find-unattached-disks-azure/1";
import { figure as figure2 } from "@/features/learn/figures/find-unattached-disks-azure/2";

export const article: Article = {
  slug: "find-unattached-disks-azure",
  title: "Find and delete unattached disks in Azure",
  meta: "Find unattached disks in Azure across every subscription with one Resource Graph query, price them, then snapshot and delete the ones nobody needs.",
  h1: "How to find unattached disks in Azure",
  deck: "One query covers every subscription you can access, from the portal, the Azure CLI or PowerShell.",
  card: "One Resource Graph query for every subscription, what each disk costs, and a snapshot-then-delete routine.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Azure block storage",
  published: "2026-10-21",
  updated: "2026-11-03",
  author: "sonu",
  cover: "/learn-covers/zoorik-learn-find-unattached-disks-azure-1200x630.webp",
  coverAlt:
    "Unattached Azure disks: attached disks sit under their VMs, and an unattached disk has no VM but is still charged",
  short: [
    "Query Azure Resource Graph for managed disks whose disk state is ",
    { code: "Unattached" },
    ". Each one is still charged for its provisioned size, unless it’s empty and was never used. Price them, check with their owners, take an ",
    { a: "incremental snapshot", href: "/learn/glossary/disk-snapshot" },
    ", then delete what nobody needs.",
  ],
  sections: [
    {
      id: "why-an-unattached-disk-stays-on-the",
      title: "Why unattached disks cost money",
      blocks: [
        {
          kind: "p",
          text: "Picture a VM someone deleted last quarter. Its 1\u00a0TiB Premium SSD data disk wasn’t set to delete with it, so the disk still sits in its resource group. Nothing reads it.",
        },
        {
          kind: "p",
          text: [
            "A 1\u00a0TiB ",
            { a: "Premium SSD", href: "/learn/glossary/azure-premium-ssd" },
            " is a P30 by default, one of the fixed ",
            { a: "Azure disk sizes", href: "/learn/glossary/azure-disk-sizes" },
            ". It’s charged at the P30 tier, with or without a VM, until someone deletes it.",
          ],
        },
        {
          kind: "p",
          text: "When you delete a VM, Azure keeps its disks by default, to guard against losing data to a mistaken delete. Microsoft adds that “you will continue to pay for unattached disks.”",
        },
        { kind: "p", text: "Unattached disks usually come from one of three places:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Deleted VMs." },
              " A deleted VM leaves its disks, NICs and public IPs behind unless their delete option is Delete. VMs created with the Azure CLI or PowerShell detach their OS disk on delete by default.",
            ],
            [
              { b: "Disks detached by hand." },
              " A disk detached after a migration, or left over after you ",
              { a: "shrink a managed disk", href: "/learn/shrink-azure-managed-disk" },
              " by copying, stays until someone deletes it.",
            ],
            [
              { b: "Kubernetes volumes." },
              " A volume with the ",
              { a: "Retain reclaim policy", href: "/learn/aks-storage-classes" },
              " leaves its disk behind after its PersistentVolume is deleted.",
            ],
          ],
        },
        {
          kind: "p",
          text: "One kind costs nothing: an empty disk that was never used. Azure allocates its storage only on first use, such as its first attach or upload.",
        },
      ],
    },
    {
      id: "what-azure-disk-state-unattached-means-and",
      title: "Disk states you pay for",
      blocks: [
        {
          kind: "p",
          text: [
            "Every managed disk has a ",
            { code: "diskState" },
            " property. Attached, Reserved, Frozen and Unattached disks are all charged for their provisioned size, except the empty, never-used kind.",
          ],
        },
        {
          kind: "table",
          columns: [
            { label: "diskState", width: "14%" },
            { label: "What it means (Azure Compute API)", width: "86%" },
          ],
          rows: [
            ["Attached", "The disk is currently attached to a running VM."],
            ["Reserved", "The disk is attached to a stopped-deallocated VM."],
            ["Frozen", "The disk is attached to a VM which is in hibernated state."],
            ["Unattached", "The disk is not being used and can be attached to a VM."],
            ["ActiveSAS", "The disk currently has an Active SAS Uri associated with it."],
            [
              "ActiveSASFrozen",
              "The disk is attached to a VM in hibernated state and has an active SAS URI associated with it.",
            ],
            [
              "ReadyToUpload",
              "A disk is ready to be created by upload by requesting a write token.",
            ],
            [
              "ActiveUpload",
              "A disk is created for upload and a write token has been issued for uploading to it.",
            ],
          ],
        },
        {
          kind: "p",
          text: "A Reserved disk belongs to a deallocated VM, so it never shows in an unattached list. Review any VM left deallocated for months.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "how-to-find-unattached-disks-in-azure",
      title: "One query for every subscription",
      blocks: [
        {
          kind: "p",
          text: [
            "Resource Graph reads across subscriptions, so one query replaces a loop of ",
            { code: "az disk list" },
            " calls. Save it as ",
            { code: "unattached-disks.kql" },
            ":",
          ],
        },
        {
          kind: "code",
          lang: "kusto",
          code: "Resources\n| where type =~ 'microsoft.compute/disks'\n| where tostring(properties.diskState) =~ 'Unattached'\n| project id, name, subscriptionId, resourceGroup, location,\n    diskState = tostring(properties.diskState),\n    diskType = tostring(sku.name),\n    tier = tostring(properties.tier),\n    sizeGiB = toint(properties.diskSizeGB),\n    osType = tostring(properties.osType),\n    createOption = tostring(properties.creationData.createOption),\n    unattachedSince = todatetime(properties.LastOwnershipUpdateTime),\n    created = todatetime(properties.timeCreated),\n    tags\n| order by sizeGiB desc",
        },
        {
          kind: "callout",
          label: "For engineers",
          text: [
            { code: "unattachedSince" },
            " reads ",
            { code: "LastOwnershipUpdateTime" },
            ": when the disk was last attached or detached, or its VM deallocated or started. It stays blank on a new disk until its state first changes, so read a blank as unknown, not recent.",
          ],
        },
        {
          kind: "p",
          text: [
            "A row with ",
            { code: "createOption" },
            " set to ",
            { code: "Empty" },
            " and a blank date may never have been attached, so it may cost nothing. Confirm it in Cost analysis before you count it as free.",
          ],
        },
        {
          kind: "p",
          text: [
            "To keep only disks detached more than 30\u00a0days ago, add ",
            { code: "| where unattachedSince < ago(30d)" },
            " as the last line. That filter drops the blank-date rows, so review those separately.",
          ],
        },
        {
          kind: "p",
          text: [
            "The query leaves out disks in ",
            { code: "ActiveSAS" },
            ", ",
            { code: "ReadyToUpload" },
            " or ",
            { code: "ActiveUpload" },
            ", which have an open export link or a pending upload.",
          ],
        },
        {
          kind: "p",
          text: [
            { code: "managedBy" },
            " holds the ID of the VM a disk is attached to. To list every disk with an empty ",
            { code: "managedBy" },
            ", swap the second ",
            { code: "where" },
            " line for ",
            { code: "| where isempty(managedBy)" },
            ". Then check each row’s ",
            { code: "diskState" },
            " before you act on it.",
          ],
        },
        { kind: "h3", id: "in-the-azure-portal", title: "In the Azure portal" },
        {
          kind: "p",
          text: "Open Resource Graph Explorer, paste the query and run it. Azure Advisor’s Cost tab also lists these disks. Its preview recommendation reads: “Review disks that aren’t attached to a VM and evaluate if you still need the disks.”",
        },
        {
          kind: "h3",
          id: "find-unattached-disks-with-the-azure-cli",
          title: "With the Azure CLI",
        },
        {
          kind: "p",
          text: [
            { code: "az graph query" },
            " comes from the resource-graph extension, which installs on first use, or with ",
            { code: "az extension add --name resource-graph" },
            ". Without ",
            { code: "--subscriptions" },
            ", it queries every subscription you can access. ",
            { code: "--first" },
            " takes 1 to 1,000 rows per call:",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: 'az graph query -q "$(cat unattached-disks.kql)" --first 1000',
        },
        {
          kind: "p",
          text: [
            "The disks come back in the ",
            { code: "data" },
            " array of the JSON. For a quick read, add ",
            { code: "--query data --output table" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "Don’t use ",
            { code: "--output table" },
            " alone: table output skips nested objects, so the disk rows don’t appear. It also hides the ",
            { code: "id" },
            " column, so take disk IDs from the JSON.",
          ],
        },
        {
          kind: "p",
          text: [
            "For one subscription, ",
            { code: "az disk list" },
            " can test ",
            { code: "managedBy" },
            " instead:",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "az disk list --query '[?managedBy==`null`].[id]' -o tsv",
        },
        {
          kind: "h3",
          id: "find-unattached-disks-with-powershell",
          title: "With PowerShell",
        },
        {
          kind: "p",
          text: [
            { code: "Search-AzGraph" },
            ", from the Az.ResourceGraph module, runs the query across every subscription you can access in the current tenant when you add ",
            { code: "-UseTenantScope" },
            ". Its ",
            { code: "-First" },
            " takes 1 to 1,000:",
          ],
        },
        {
          kind: "code",
          lang: "powershell",
          code: "Search-AzGraph -Query (Get-Content -Path ./unattached-disks.kql -Raw) `\n  -UseTenantScope -First 1000",
        },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            "A list of exactly 100 or 1,000\u00a0disks may be only the first page. ",
            { code: "Search-AzGraph" },
            " returns at most 100 rows unless you set ",
            { code: "-First" },
            ". For the next page, pass the skip token: ",
            { code: "--skip-token" },
            " in the CLI, or ",
            { code: "-SkipToken $result.SkipToken" },
            " in PowerShell, with the first page saved in ",
            { code: "$result" },
            ". Keep the ",
            { code: "id" },
            " column in the query, or no skip token comes back.",
          ],
        },
      ],
    },
    {
      id: "what-unattached-disks-cost-in-azure",
      title: "What unattached disks cost",
      blocks: [
        {
          kind: "p",
          text: "For what you were charged, open Cost analysis in Microsoft Cost Management. Filter to the managed disk resource type, group by resource, and match the rows to the query’s disk IDs.",
        },
        {
          kind: "p",
          text: "For a forward estimate at list price, group the same disks by type, tier, size, provisioned performance and region:",
        },
        {
          kind: "code",
          lang: "kusto",
          code: "Resources\n| where type =~ 'microsoft.compute/disks'\n| where tostring(properties.diskState) =~ 'Unattached'\n| summarize disks = count() by\n    diskType = tostring(sku.name),\n    tier = tostring(properties.tier),\n    sizeGiB = toint(properties.diskSizeGB),\n    iops = toint(properties.diskIOPSReadWrite),\n    mbps = toint(properties.diskMBpsReadWrite),\n    location\n| order by disks desc",
        },
        {
          kind: "p",
          text: "Multiply each row’s count by that tier’s monthly price in that region, from the managed disks pricing page. Prices vary by region and change, so check them on the day.",
        },
        {
          kind: "ul",
          items: [
            [{ b: "Premium SSD." }, " Charged at its performance tier."],
            [
              { b: "Standard SSD and Standard HDD." },
              " Charged at the tier their provisioned size falls in. In Microsoft’s example, a Standard SSD grown from 1\u00a0TiB to 3\u00a0TiB is charged at E50.",
            ],
            [
              { b: "Ultra Disk and Premium SSD v2." },
              " No tiers: they’re charged per GiB, so price them from ",
              { code: "sizeGiB" },
              " plus the ",
              { code: "iops" },
              " and ",
              { code: "mbps" },
              " columns. An Ultra Disk’s price rises with its provisioned IOPS and throughput. A Premium SSD v2 is charged for IOPS above 3,000 and throughput above 125\u00a0MB/s.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "For one disk’s monthly list price, use the ",
            { a: "Azure disk pricing calculator", href: "/ebs-and-azure-disk-pricing" },
            ".",
          ],
        },
        {
          kind: "callout",
          label: "Worked example",
          text: [
            "Microsoft’s Premium SSD v2 example is 512\u00a0GiB set to 40,000\u00a0IOPS and 200\u00a0MB/s. Detached, it’s still charged for 512\u00a0GiB, 37,000\u00a0IOPS (40,000 less the free 3,000) and 75\u00a0MB/s (200 less the free 125). The cost query shows its ",
            { code: "iops" },
            " as 40000 and its ",
            { code: "mbps" },
            " as 200, so subtract the free amounts before pricing.",
          ],
        },
      ],
    },
    {
      id: "four-checks-before-you-delete-anything",
      title: "Four checks before you delete",
      blocks: [
        {
          kind: "p",
          text: "An unattached disk can still hold someone’s data. Check four things first.",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Kubernetes volumes." },
              " A disk behind a PersistentVolume detaches whenever no pod uses it. If the volume is ",
              { code: "Bound" },
              ", a claim still owns the disk, so leave it. If it’s ",
              { code: "Released" },
              ", its claim was deleted and the disk is yours to review. This lists each volume’s disk, claim and phase:",
            ],
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl get pv -o custom-columns=\\\nNAME:.metadata.name,DISK:.spec.csi.volumeHandle,\\\nCLAIM:.spec.claimRef.name,PHASE:.status.phase",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Site Recovery replicas." },
              " Advisor’s recommendation “excludes unattached replica disks associated with Azure Site Recovery,” so leave the disks your recovery setup created.",
            ],
            [
              { b: "OS disks." },
              " A row with an ",
              { code: "osType" },
              " is an operating system disk, such as a deleted VM’s. If anyone might rebuild that VM, keep the disk until its owner decides.",
            ],
            [
              { b: "The owner’s call." },
              " Read the resource group and the tags, and ask the owner. Tag each disk you keep with the command below, then add ",
              { code: "| where isempty(tostring(tags.keep))" },
              " to the query so the next run skips it.",
            ],
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "az disk update --name <disk-name> --resource-group <resource-group> \\\n  --set tags.keep=true",
        },
        { kind: "svg", figure: figure2 },
      ],
    },
    {
      id: "snapshot-then-delete-an-unattached-disk-in",
      title: "Snapshot, then delete",
      blocks: [
        {
          kind: "p",
          text: "Advisor’s recommendation gives the routine: “Create a snapshot before deletion and confirm the data is no longer needed.” Make the snapshot incremental.",
        },
        {
          kind: "p",
          text: [
            "An incremental snapshot is stored on Standard HDD whatever the disk type, and charged for its used size only. It’s a resource of its own, so it stays after you delete the disk. As the ",
            { a: "Azure disk snapshot cost guide", href: "/learn/azure-disk-snapshot-cost" },
            " explains, the first one is a full copy, so you pay for all the data the disk holds.",
          ],
        },
        { kind: "ol", items: ["Take the snapshot, in the same subscription as the disk."] },
        {
          kind: "code",
          lang: "bash",
          code: "az snapshot create -g <resource-group> -n <snapshot-name> \\\n  --source <disk-id> --incremental true",
        },
        {
          kind: "ol",
          start: 2,
          items: [
            [
              "For Premium SSD v2 or Ultra Disk, wait for the background copy. Unless you enabled instant access when you took it, the snapshot can’t create a disk until ",
              { code: "completionPercent" },
              " reads 100. Snapshots of other disk types always report 100.",
            ],
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: 'az snapshot show -g <resource-group> -n <snapshot-name> \\\n  --query "[completionPercent]" -o tsv',
        },
        {
          kind: "ol",
          start: 3,
          items: [
            [
              "Delete the disk. In Advisor’s words, “Deleting a disk is irreversible.” The ",
              { code: "--yes" },
              " flag skips the confirmation prompt, so check the ID twice.",
            ],
          ],
        },
        { kind: "code", lang: "bash", code: "az disk delete --ids <disk-id> --yes" },
        {
          kind: "ol",
          start: 4,
          items: [
            "Tag the snapshot with a review date, and delete it once the owner confirms nobody needs the data.",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "az snapshot update -g <resource-group> -n <snapshot-name> \\\n  --set tags.reviewOn=<yyyy-mm-dd>",
        },
        {
          kind: "p",
          text: [
            "In PowerShell, the same steps are ",
            { code: "New-AzSnapshotConfig -Incremental" },
            " with ",
            { code: "New-AzSnapshot" },
            ", then ",
            { code: "Remove-AzDisk -Force" },
            ", which deletes without asking.",
          ],
        },
        {
          kind: "h3",
          id: "stop-new-orphans",
          title: "Stop new orphaned disks",
        },
        {
          kind: "p",
          text: [
            "Pass ",
            { code: "--os-disk-delete-option Delete" },
            " and ",
            { code: "--data-disk-delete-option Delete" },
            " to ",
            { code: "az vm create" },
            ". Deleting the VM later then deletes its disks and their data with it.",
          ],
        },
        {
          kind: "p",
          text: "For an existing VM, this PowerShell sets the option in place. It is Microsoft’s example from its delete guide, without the network interface line:",
        },
        {
          kind: "code",
          lang: "powershell",
          code: "$vmConfig = Get-AzVM -ResourceGroupName \"<resource-group>\" -Name \"<vm-name>\"\n$vmConfig.StorageProfile.OsDisk.DeleteOption = 'Delete'\n$vmConfig.StorageProfile.DataDisks | ForEach-Object { $_.DeleteOption = 'Delete' }\n$vmConfig | Update-AzVM",
        },
        {
          kind: "p",
          text: "Shared disks are the exception: their delete option can only be Detach or blank. Check them by hand after you delete the VMs that share them.",
        },
      ],
    },
    {
      id: "how-amoeba-handles-the-disks-it-frees",
      title: "Where Amoeba fits",
      blocks: [
        {
          kind: "p",
          text: [
            "A disk-state query can’t see the other space you pay for and don’t use: attached data disks provisioned past the data they hold. ",
            { a: "Amoeba", href: "/amoeba" },
            " works on that part.",
          ],
        },
        {
          kind: "p",
          text: "Amoeba moves a VM’s data disks onto one btrfs pool sized to your data, then rightsizes the pool without any downtime. It grows the pool before it fills. When your data goes down and stays down, it shrinks the pool one disk at a time.",
        },
        { kind: "p", text: "Amoeba doesn’t leave the disks it frees behind as unattached disks:" },
        {
          kind: "ul",
          items: [
            [
              { b: "A disk a shrink empties." },
              " Amoeba moves its data onto the other pool disks, then detaches and deletes the empty disk, with no snapshot.",
            ],
            [
              { b: "The original disks." },
              " Once the switch to the pool is checked, Amoeba detaches each original disk, snapshots it and deletes the disk. It keeps each snapshot for 7\u00a0days, then deletes it too, and only ever deletes its own.",
            ],
            [
              { b: "Every other disk." },
              " Amoeba works only on the data disks of running VMs, never the OS disk. Apart from its own original disks during cleanup, the disks your query found stay yours to review.",
            ],
          ],
        },
        {
          kind: "p",
          text: "Run the query while a move finishes, and an original disk can show as Unattached between its detach and its deletion. You pay for both sets of disks only while the move runs, then for the snapshots while they’re kept.",
        },
        {
          kind: "p",
          text: [
            {
              a: "Azure managed disk cost optimization",
              href: "/azure-managed-disk-cost-optimization",
            },
            " covers the move and what a VM needs.",
          ],
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
      title: "“Azure CLI - Find and delete unattached managed and unmanaged disks”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/linux/find-unattached-disks",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Disks - Get - REST API (Azure Compute)”",
      url: "https://learn.microsoft.com/en-us/rest/api/compute/disks/get",
    },
    {
      publisher: "Microsoft Learn",
      title: "“az graph”",
      url: "https://learn.microsoft.com/en-us/cli/azure/graph",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Output formats for Azure CLI commands”",
      url: "https://learn.microsoft.com/en-us/cli/azure/format-output-azure-cli",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Search-AzGraph (Az.ResourceGraph)”",
      url: "https://learn.microsoft.com/en-us/powershell/module/az.resourcegraph/search-azgraph",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Understand Azure Disk Storage billing”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-understand-billing",
    },
    {
      publisher: "Kubernetes",
      title: "“Persistent Volumes”",
      url: "https://kubernetes.io/docs/concepts/storage/persistent-volumes/",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Create an incremental snapshot”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-incremental-snapshots",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Delete a VM and attached resources”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/delete",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Cost recommendations - Azure Advisor”",
      url: "https://learn.microsoft.com/en-us/azure/advisor/advisor-reference-cost-recommendations",
    },
  ],
  related: [
    {
      title: "Azure disk reservations: are they worth it?",
      where: "Learn",
      href: "/learn/azure-disk-reservations",
    },
    {
      title: "Azure snapshot pricing: incremental vs full",
      where: "Learn",
      href: "/learn/azure-disk-snapshot-cost",
    },
    {
      title: "Can you shrink an Azure managed disk?",
      where: "Learn",
      href: "/learn/shrink-azure-managed-disk",
    },
    {
      title: "Azure Premium SSD vs Standard SSD",
      where: "Learn",
      href: "/learn/premium-ssd-vs-standard-ssd-azure",
    },
  ],
  relatedTitle: "More on Azure disk cost",
};
