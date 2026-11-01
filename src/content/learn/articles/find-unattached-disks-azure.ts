import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/find-unattached-disks-azure/1";
import { figure as figure2 } from "@/features/learn/figures/find-unattached-disks-azure/2";

export const article: Article = {
  slug: "find-unattached-disks-azure",
  title: "How to find unattached disks in Azure and clean up",
  meta: "How to find unattached disks in Azure with one Resource Graph query across your subscriptions, price each disk, then snapshot and delete what you don’t need.",
  h1: "How to find unattached disks in Azure and stop paying for them",
  deck: "One Resource Graph query finds them across your subscriptions. Price them, check the owner, then snapshot and delete.",
  card: "One Resource Graph query for every subscription, what each disk costs, and a snapshot-then-delete routine.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Azure block storage",
  published: "2026-10-21",
  updated: "2026-11-01",
  author: "sonu",
  cover: "/learn-covers/zoorik-learn-find-unattached-disks-azure-1200x630.webp",
  coverAlt:
    "Unattached Azure disks: attached disks sit under their VMs, and an unattached disk has no VM but is still charged",
  short: [
    "To find unattached disks in Azure, query Azure Resource Graph for managed disks whose disk state is ",
    { code: "Unattached" },
    ". One query reads every subscription you can access, from the portal, the Azure CLI or PowerShell. Almost all those disks are still charged for their provisioned size, so price them, check owners, take an ",
    { a: "incremental snapshot", href: "/learn/glossary/disk-snapshot" },
    ", then delete what nobody needs.",
  ],
  sections: [
    {
      id: "why-an-unattached-disk-stays-on-the",
      title: "Why an unattached disk keeps costing you",
      blocks: [
        {
          kind: "p",
          text: "Picture a VM someone deleted last quarter. Its 1\u00a0TiB Premium SSD data disk wasn’t set to delete with it, so the disk still sits in its resource group. Nothing reads it now.",
        },
        {
          kind: "p",
          text: [
            "At that size a ",
            { a: "Premium SSD", href: "/learn/glossary/azure-premium-ssd" },
            " is a P30 by default, one of the fixed ",
            { a: "Azure disk sizes", href: "/learn/glossary/azure-disk-sizes" },
            ". It is charged at the P30 tier, with or without a VM, until someone deletes it.",
          ],
        },
        {
          kind: "p",
          text: "When you delete a VM, Azure keeps its disks by default. Microsoft says this guards against losing data to a mistaken delete, and adds that after a VM is deleted, “you will continue to pay for unattached disks.”",
        },
        { kind: "p", text: "Azure orphaned disks usually come from one of three places:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Deleted VMs." },
              " A deleted VM leaves its disks, NICs and public IPs behind unless their delete option was set to Delete. A VM created with the Azure CLI or PowerShell detaches its OS disk on delete by default.",
            ],
            [
              { b: "Disks detached by hand." },
              " A disk detached after a migration, or after the copy route for ",
              { a: "shrinking a managed disk", href: "/learn/shrink-azure-managed-disk" },
              ", stays in its resource group until someone deletes it.",
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
          text: "One kind costs nothing. Microsoft’s guide to disk charges says an empty disk that hasn’t been used incurs no storage charges. Its storage is allocated only on first use, such as its first attach or upload.",
        },
      ],
    },
    {
      id: "what-azure-disk-state-unattached-means-and",
      title: "What Azure disk state Unattached means, and which states you still pay for",
      blocks: [
        {
          kind: "p",
          text: [
            "Every managed disk carries a ",
            { code: "diskState" },
            " property, and the table gives each value in the API’s words. Attached, Reserved, Frozen and Unattached disks are all charged for what was provisioned, apart from the empty, never-used kind above.",
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
          text: "Reserved disks won’t appear in an unattached list, yet they’re charged like any other disk. A VM left deallocated for months is worth its own review.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "how-to-find-unattached-disks-in-azure",
      title: "How to find unattached disks in Azure across every subscription",
      blocks: [
        {
          kind: "p",
          text: [
            "Resource Graph reads across subscriptions, so one query replaces a loop of ",
            { code: "az disk list" },
            " calls. Save this as ",
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
            ", which records when the disk was last attached or detached, or when its VM was deallocated or started. On a new disk it stays blank until the state first changes, so read a blank as unknown rather than recent. A row with ",
            { code: "createOption" },
            " set to ",
            { code: "Empty" },
            " and a blank date may never have been attached. That would make it the kind that costs nothing, so confirm it in Cost analysis before you count it as free. To keep only disks detached more than 30\u00a0days ago, add ",
            { code: "| where unattachedSince < ago(30d)" },
            " as the last line, and review the blank-date rows separately, since that filter drops them.",
          ],
        },
        {
          kind: "p",
          text: [
            "The query leaves out disks with an open export link or a pending upload, since those read ",
            { code: "ActiveSAS" },
            ", ",
            { code: "ReadyToUpload" },
            " or ",
            { code: "ActiveUpload" },
            ". ",
            { code: "managedBy" },
            " holds the attached VM’s ID and is empty without one. To list every disk with an empty ",
            { code: "managedBy" },
            ", whatever its state, swap the second ",
            { code: "where" },
            " line for ",
            { code: "| where isempty(managedBy)" },
            " and read the ",
            { code: "diskState" },
            " column before you act on a row.",
          ],
        },
        { kind: "h3", id: "in-the-azure-portal", title: "In the Azure portal" },
        {
          kind: "p",
          text: "Open Resource Graph Explorer, paste the query and run it. Azure Advisor’s Cost tab also carries a preview recommendation, “Review disks that aren’t attached to a VM and evaluate if you still need the disks.”",
        },
        {
          kind: "h3",
          id: "find-unattached-disks-with-the-azure-cli",
          title: "Find unattached disks with the Azure CLI",
        },
        {
          kind: "p",
          text: [
            { code: "az graph query" },
            " comes from the resource-graph extension, which installs on first use (or with ",
            { code: "az extension add --name resource-graph" },
            "). With no ",
            { code: "--subscriptions" },
            " argument it queries every subscription you can access, and ",
            { code: "--first" },
            " accepts 1 to 1,000 rows per call:",
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
            " array of the JSON it prints, and paging past 1,000 is in the Watch out below. For a quick read, add ",
            { code: "--query data --output table" },
            ". With ",
            { code: "--output table" },
            " alone the disk rows don’t appear, because table output skips nested objects. The table also hides the ",
            { code: "id" },
            " column, so take disk IDs from the JSON. For one subscription, ",
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
          title: "Find unattached disks with PowerShell",
        },
        {
          kind: "p",
          text: [
            { code: "Search-AzGraph" },
            ", from the Az.ResourceGraph module, runs the query across all available subscriptions in the current tenant when you add ",
            { code: "-UseTenantScope" },
            ". Its ",
            { code: "-First" },
            " accepts 1 to 1,000.",
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
            "A list that stops at exactly 100 or 1,000\u00a0disks may be only the first page. ",
            { code: "Search-AzGraph" },
            " returns at most 100 rows unless you set ",
            { code: "-First" },
            ". For the next page, the CLI takes the JSON’s skip token in ",
            { code: "--skip-token" },
            ". In PowerShell, save the result and pass ",
            { code: "-SkipToken $result.SkipToken" },
            ", which comes back only when the results keep ",
            { code: "id" },
            ", as this query does.",
          ],
        },
      ],
    },
    {
      id: "what-unattached-disks-cost-in-azure",
      title: "What unattached disks cost in Azure",
      blocks: [
        {
          kind: "p",
          text: "For what you were charged, open Cost analysis in Microsoft Cost Management, filter to the managed disk resource type and group by resource. Match those rows against the IDs from the query.",
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
          text: "Multiply each row’s count by that tier’s monthly price in that region on the managed disks pricing page. Prices differ by region and change, so check them on the day.",
        },
        {
          kind: "p",
          text: [
            "For one disk’s monthly list price, use our ",
            { a: "Azure disk pricing calculator", href: "/ebs-and-azure-disk-pricing" },
            ".",
          ],
        },
        {
          kind: "ul",
          items: [
            [{ b: "Premium SSD." }, " It’s charged at its performance tier."],
            [
              { b: "Standard SSD and Standard HDD." },
              " They’re charged at the tier their provisioned size falls in. In Microsoft’s guide to disk charges, a Standard SSD grown from 1\u00a0TiB to 3\u00a0TiB is charged at E50.",
            ],
            [
              { b: "Ultra Disk and Premium SSD v2." },
              " They have no tiers and are charged per GiB, so price those from ",
              { code: "sizeGiB" },
              ", plus the performance in the ",
              { code: "iops" },
              " and ",
              { code: "mbps" },
              " columns. An Ultra Disk’s price rises with its provisioned IOPS and throughput. A Premium SSD v2 is charged for IOPS above 3,000 and throughput above 125\u00a0MB/s.",
            ],
          ],
        },
        {
          kind: "callout",
          label: "Worked example",
          text: [
            "The same guide’s Premium SSD v2 example is 512\u00a0GiB set to 40,000\u00a0IOPS and 200\u00a0MB/s. It’s charged for 512\u00a0GiB, for 37,000\u00a0IOPS (40,000 minus the free 3,000) and for 75\u00a0MB/s (200 less the free 125). Detached, it’s charged on the same three meters. In the cost query its ",
            { code: "iops" },
            " reads 40000 and its ",
            { code: "mbps" },
            " 200, so subtract the free baselines before you price them.",
          ],
        },
      ],
    },
    {
      id: "four-checks-before-you-delete-anything",
      title: "Four checks before you delete anything",
      blocks: [
        {
          kind: "p",
          text: "An unattached disk can still hold someone’s data. Put each row through four checks first, and let a disk reach the snapshot and the delete only after all four.",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Kubernetes volumes." },
              " If you run Kubernetes, a disk behind a PersistentVolume detaches when no pod uses it. A disk behind a ",
              { code: "Bound" },
              " volume still belongs to a claim, so leave it, while a ",
              { code: "Released" },
              " volume means its claim was deleted and the disk is yours to review. This lists each volume’s disk, claim and phase:",
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
              " Advisor’s own recommendation “excludes unattached replica disks associated with Azure Site Recovery,” so leave any disk your recovery setup created alone.",
            ],
            [
              { b: "OS disks." },
              " A row with an ",
              { code: "osType" },
              " is a full operating system disk, such as the OS disk of a deleted VM, so if anyone might rebuild that VM, keep it until its owner decides.",
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
      title: "Snapshot, then delete an unattached disk in Azure",
      blocks: [
        {
          kind: "p",
          text: "Advisor’s recommendation spells out the routine: “Create a snapshot before deletion and confirm the data is no longer needed.” Make it incremental.",
        },
        {
          kind: "p",
          text: [
            "An incremental snapshot sits on Standard HDD storage whatever the disk type, and you pay for its used size only. It’s a resource of its own that stays when you delete the disk. As the ",
            { a: "Azure disk snapshot cost guide", href: "/learn/azure-disk-snapshot-cost" },
            " explains, the first incremental snapshot is a full copy, so you pay for everything the disk holds.",
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
              "For Premium SSD v2 or Ultra Disk, wait for the background copy. Unless you enabled instant access when you created it, the snapshot can’t be used to create a disk until ",
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
              "Delete the disk. This step can’t be undone: in Advisor’s words, “Deleting a disk is irreversible.” The ",
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
            "Tag the snapshot with the date to review it, and delete it once the owner confirms nobody needs the data.",
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
            "In PowerShell the same steps are ",
            { code: "New-AzSnapshotConfig -Incremental" },
            " with ",
            { code: "New-AzSnapshot" },
            ", then ",
            { code: "Remove-AzDisk -Force" },
            ", which deletes without asking.",
          ],
        },
        { kind: "h3", id: "stop-new-orphans", title: "Stop new orphans" },
        {
          kind: "p",
          text: [
            "Pass ",
            { code: "--os-disk-delete-option Delete" },
            " and ",
            { code: "--data-disk-delete-option Delete" },
            " to ",
            { code: "az vm create" },
            ", so that deleting the VM later deletes its disks and their data with it. For an existing VM, the delete guide’s PowerShell example, shown here without its network interface line, sets the option in place:",
          ],
        },
        {
          kind: "code",
          lang: "powershell",
          code: "$vmConfig = Get-AzVM -ResourceGroupName \"<resource-group>\" -Name \"<vm-name>\"\n$vmConfig.StorageProfile.OsDisk.DeleteOption = 'Delete'\n$vmConfig.StorageProfile.DataDisks | ForEach-Object { $_.DeleteOption = 'Delete' }\n$vmConfig | Update-AzVM",
        },
        {
          kind: "p",
          text: "Shared disks are the exception, since their delete option can only be Detach or blank, so check them by hand after you delete the VMs that share them.",
        },
      ],
    },
    {
      id: "how-amoeba-handles-the-disks-it-frees",
      title: "How Amoeba handles the disks it frees",
      blocks: [
        {
          kind: "p",
          text: [
            "A query of disk states can’t show the rest of the space you pay for and don’t use. It sits on attached data disks of running VMs, provisioned past the data they hold. ",
            { a: "Amoeba", href: "/amoeba" },
            " works on that part.",
          ],
        },
        {
          kind: "p",
          text: "Amoeba moves a VM’s data disks onto one btrfs pool sized to your data. The pool then grows as the data grows, and Amoeba removes disks when the data shrinks. On Linux, the services that use the data mounts restart at the switch onto the pool, and again only if Amoeba retries a failed switch.",
        },
        { kind: "p", text: "Amoeba doesn’t leave the disks it frees behind as unattached disks:" },
        {
          kind: "ul",
          items: [
            [
              { b: "A disk a shrink empties." },
              " Amoeba first moves its data onto the other pool disks, then detaches and deletes the empty disk, with no snapshot.",
            ],
            [
              { b: "The source disks." },
              " After the switch is checked, Amoeba detaches each source disk, takes an incremental snapshot and deletes the disk when the snapshot completes. It deletes the snapshot a few days later, and only ever deletes its own.",
            ],
            [
              { b: "Every other disk." },
              " Amoeba works only on the data disks of running VMs, never the OS disk. Apart from its own source disks during cleanup, the disks your query found stay yours to review.",
            ],
          ],
        },
        {
          kind: "p",
          text: "If you run the query while a move finishes, a source disk can show as Unattached between its detach and its deletion. You pay for both sets of disks only while the move runs, and then for the snapshots while they’re kept.",
        },
        {
          kind: "p",
          text: "Amoeba works on Windows and Linux VMs. On Linux, the VM needs a recent kernel with btrfs, and services that keep a data mount open must run under systemd. The VM needs a few free disk slots for the pool.",
        },
        {
          kind: "p",
          text: [
            "For the rest of your disk cost, see ",
            { a: "Azure disk cost optimization", href: "/learn/azure-disk-cost-optimization" },
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
      title: "“Search-AzGraph (Az.ResourceGraph)”",
      url: "https://learn.microsoft.com/en-us/powershell/module/az.resourcegraph/search-azgraph",
    },
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
      title: "Azure disk cost optimization: stop paying for empty space",
      where: "Learn",
      href: "/learn/azure-disk-cost-optimization",
    },
    {
      title: "Azure disk snapshot cost: incremental vs full snapshots",
      where: "Learn",
      href: "/learn/azure-disk-snapshot-cost",
    },
    {
      title: "Can you shrink an Azure managed disk?",
      where: "Learn",
      href: "/learn/shrink-azure-managed-disk",
    },
    {
      title: "Premium SSD vs Standard SSD on Azure: what you pay for",
      where: "Learn",
      href: "/learn/premium-ssd-vs-standard-ssd-azure",
    },
  ],
};
