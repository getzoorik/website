import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/find-unattached-disks-azure/1";

export const article: Article = {
  slug: "find-unattached-disks-azure",
  title: "How to find unattached disks in Azure and clean up",
  meta: "How to find unattached disks in Azure with one Resource Graph query across all subscriptions, price each disk, then snapshot and delete what you don’t need.",
  h1: "How to find unattached disks in Azure and stop paying for them",
  deck: "One Resource Graph query covers every subscription. Price each disk, check its owner, and snapshot it before deleting.",
  card: "One Resource Graph query for every subscription, what each disk costs, and a snapshot-then-delete routine.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Azure block storage",
  published: "2026-10-23",
  updated: "2026-10-23",
  author: "sonu",
  short: [
    "To find unattached disks in Azure, query Azure Resource Graph for managed disks whose disk state is ",
    { code: "Unattached" },
    ". One query reads every subscription you have access to, from the portal, the Azure CLI or PowerShell. Almost all of those disks still bill for their provisioned size, so price them, check who owns them, take an incremental snapshot of any you might need, and delete the rest, since a deleted disk can’t be recovered.",
  ],
  sections: [
    {
      id: "why-an-unattached-disk-stays-on-the",
      title: "Why an unattached disk stays on the bill",
      blocks: [
        {
          kind: "p",
          text: "When you delete a VM, Azure keeps its disks by default. Microsoft says this guards against losing data to a mistaken delete, and adds that after a VM is deleted, “you will continue to pay for unattached disks.”",
        },
        {
          kind: "p",
          text: "A managed disk is billed on what you provisioned, not on what it holds. A 1\u00a0TiB Premium SSD is a P30 by default and bills at the P30 tier with or without a VM.",
        },
        { kind: "p", text: "Azure orphaned disks usually come from one of three places:" },
        {
          kind: "ul",
          items: [
            "A deleted VM leaves its disks, NICs and public IPs behind unless their delete option was set to Delete. A VM created with the Azure CLI or PowerShell detaches its OS disk on delete by default.",
            [
              "A disk detached by hand after a migration, or after the copy route for ",
              { a: "shrinking a managed disk", href: "/learn/shrink-azure-managed-disk" },
              ", stays in its resource group until someone deletes it.",
            ],
            [
              "A Kubernetes volume with the ",
              { a: "Retain reclaim policy", href: "/learn/aks-storage-classes" },
              " leaves its disk behind after its PersistentVolume is deleted.",
            ],
          ],
        },
        {
          kind: "p",
          text: "One kind costs nothing: Microsoft’s billing guide says an empty disk that hasn’t been used incurs no storage charges, since Azure allocates its storage only when the disk is first used, such as on its first attach or upload.",
        },
      ],
    },
    {
      id: "what-the-disk-state-tells-you",
      title: "What the disk state tells you",
      blocks: [
        {
          kind: "p",
          text: [
            "Every managed disk carries a ",
            { code: "diskState" },
            " property that Azure maintains. Azure disk state Unattached means, in the API’s words, “The disk is not being used and can be attached to a VM.” Its neighbours matter too, since several of them bill.",
          ],
        },
        {
          kind: "table",
          columns: [
            { label: "diskState", width: "17%" },
            { label: "What it means (Azure Compute API)", width: "83%" },
          ],
          rows: [
            ["Attached", "The disk is currently attached to a running VM."],
            ["Reserved", "The disk is attached to a stopped-deallocated VM."],
            ["Frozen", "The disk is attached to a VM which is in hibernated state."],
            ["Unattached", "The disk is not being used and can be attached to a VM."],
            ["ActiveSAS", "The disk currently has an Active SAS Uri associated with it."],
            [
              "ReadyToUpload, ActiveUpload",
              "The disk was created for upload and is waiting for, or receiving, its data.",
            ],
          ],
        },
        {
          kind: "p",
          text: "Reserved disks won’t appear in an unattached list, yet they’re still billed by provisioned size or tier like any other disk. A VM left deallocated for months is worth its own review.",
        },
        {
          kind: "p",
          text: [
            "Two more properties help. ",
            { code: "managedBy" },
            " holds the ID of the VM that has the disk attached and is empty when no VM does, which is the test Microsoft’s own scripts use. ",
            { code: "LastOwnershipUpdateTime" },
            " records when the disk was last attached or detached, or when its VM was deallocated or started. For an unattached disk, that’s the moment it was detached. It stays blank on a new disk until its state first changes, so read a blank as unknown rather than recent.",
          ],
        },
        { kind: "diagram", figure: figure1 },
      ],
    },
    {
      id: "how-to-find-unattached-disks-in-azure",
      title: "How to find unattached disks in Azure across every subscription",
      blocks: [
        {
          kind: "p",
          text: [
            "Resource Graph queries the resources Azure Resource Manager manages, across subscriptions, so one query replaces a loop of ",
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
          kind: "p",
          text: [
            "A value in ",
            { code: "osType" },
            " marks a disk that holds an operating system, such as the OS disk of a deleted VM. A row with ",
            { code: "createOption" },
            " set to ",
            { code: "Empty" },
            " and no ",
            { code: "unattachedSince" },
            " may never have been attached, which would make it the unused kind that isn’t billed, so confirm that in Cost analysis before you count it as free. To keep only disks detached more than 30\u00a0days ago, add ",
            { code: "| where unattachedSince < ago(30d)" },
            " as the last line. Rows with a blank date drop out of that filter, so review them separately.",
          ],
        },
        {
          kind: "p",
          text: [
            "Disks with an open export link read ",
            { code: "ActiveSAS" },
            ", and disks waiting for an upload read ",
            { code: "ReadyToUpload" },
            " or ",
            { code: "ActiveUpload" },
            ", so the query leaves both out. To list every disk with an empty ",
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
            " array of the JSON it prints. Past 1,000\u00a0disks, pass the skip token from that JSON to ",
            { code: "--skip-token" },
            " for the next page. For a quick read, add ",
            { code: "--query data --output table" },
            ". With ",
            { code: "--output table" },
            " alone the disk rows don’t appear, because table output skips nested objects. The table also hides the ",
            { code: "id" },
            " column, so take disk IDs from the JSON. Microsoft’s per-subscription script tests ",
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
            " is in the Az.ResourceGraph module. Add ",
            { code: "-UseTenantScope" },
            " to run the query across all available subscriptions in the current tenant. Its ",
            { code: "-First" },
            " accepts 1 to 1,000 and defaults to 100.",
          ],
        },
        {
          kind: "code",
          lang: "powershell",
          code: "Search-AzGraph -Query (Get-Content -Path ./unattached-disks.kql -Raw) -UseTenantScope -First 1000",
        },
        {
          kind: "p",
          text: [
            "Keep ",
            { code: "id" },
            " in the projection, since the response carries a ",
            { code: "SkipToken" },
            " for the next page only when the results include it.",
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
          text: "For what you were actually charged, open Cost analysis in Microsoft Cost Management, filter to the managed disk resource type and group by resource. Match those rows against the IDs from the query.",
        },
        {
          kind: "p",
          text: "For a forward estimate at list price, group the same disks by type, tier, size and region:",
        },
        {
          kind: "code",
          lang: "kusto",
          code: "Resources\n| where type =~ 'microsoft.compute/disks'\n| where tostring(properties.diskState) =~ 'Unattached'\n| summarize disks = count() by diskType = tostring(sku.name), tier = tostring(properties.tier),\n    sizeGiB = toint(properties.diskSizeGB), location\n| order by disks desc",
        },
        {
          kind: "p",
          text: [
            "Multiply each row’s count by that tier’s monthly price in that region on the managed disks pricing page. Premium SSD bills at its performance tier. Standard SSD and Standard HDD bill at the tier their provisioned size falls in: Microsoft’s example is a Standard SSD grown from 1\u00a0TiB to 3\u00a0TiB, which bills at E50. Ultra Disk and Premium SSD v2 have no tiers and bill per GiB, so price those from ",
            { code: "sizeGiB" },
            ", plus the performance you provisioned. An Ultra Disk’s price rises with its provisioned IOPS and throughput, and a Premium SSD v2 bills for IOPS above 3,000 and throughput above 125\u00a0MB/s. Prices differ by region and change, so check them on the day.",
          ],
        },
      ],
    },
    {
      id: "check-these-before-you-delete-anything",
      title: "Check these before you delete anything",
      blocks: [
        {
          kind: "p",
          text: "An unattached disk can still hold someone’s data, so put each row of the list through four checks first.",
        },
        {
          kind: "ul",
          items: [
            [
              "A disk behind a Kubernetes PersistentVolume detaches when no pod uses it. List each volume’s disk and claim with ",
              {
                code: "kubectl get pv -o custom-columns=NAME:.metadata.name,DISK:.spec.csi.volumeHandle,CLAIM:.spec.claimRef.name,PHASE:.status.phase",
              },
              ". A disk behind a ",
              { code: "Bound" },
              " volume still belongs to a claim, so leave it. A ",
              { code: "Released" },
              " volume means its claim was deleted, and the disk is yours to review.",
            ],
            "Advisor’s own recommendation “excludes unattached replica disks associated with Azure Site Recovery,” so leave any disk your recovery setup created alone.",
            [
              "A row with an ",
              { code: "osType" },
              " is a full operating system disk, so if anyone might rebuild that VM, keep it or snapshot it first.",
            ],
            [
              "Read the resource group and the tags, and ask the owner. To mark a disk you keep, run ",
              {
                code: "az disk update --name <disk-name> --resource-group <resource-group> --set tags.keep=true",
              },
              ", then add ",
              { code: "| where isempty(tostring(tags.keep))" },
              " to the query so the next run skips it.",
            ],
          ],
        },
      ],
    },
    {
      id: "snapshot-then-delete-an-unattached-disk-in",
      title: "Snapshot, then delete an unattached disk in Azure",
      blocks: [
        {
          kind: "p",
          text: [
            "Advisor’s recommendation spells out the routine: “Create a snapshot before deletion and confirm the data is no longer needed.” Make it incremental. An incremental snapshot sits on Standard HDD storage whatever the disk type, bills for used size only, and is a resource of its own that stays when you delete the disk. Because the first one of a disk is a full copy, expect it to bill for everything the disk holds, as the ",
            { a: "snapshot cost guide", href: "/learn/azure-disk-snapshot-cost" },
            " explains.",
          ],
        },
        { kind: "ol", items: ["Take the snapshot, in the same subscription as the disk."] },
        {
          kind: "code",
          lang: "bash",
          code: "az snapshot create -g <resource-group> -n <snapshot-name> --source <disk-id> --incremental true",
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
          code: "az snapshot show -g <resource-group> -n <snapshot-name> --query [completionPercent] -o tsv",
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
            "Give the snapshot an end date, and delete it once the owner confirms nobody needs the data.",
          ],
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
        {
          kind: "p",
          text: [
            "To stop new orphans, pass ",
            { code: "--os-disk-delete-option Delete" },
            " and ",
            { code: "--data-disk-delete-option Delete" },
            " to ",
            { code: "az vm create" },
            ", so that deleting the VM later deletes its disks, and the data on them, along with it. For an existing VM, Microsoft’s PowerShell example, shown here without its network interface line, sets the option in place:",
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
            "Unattached disks are one part of the space you pay for and don’t use. The other part is attached: data disks on running VMs, provisioned past the data they hold, which a query of disk states can’t show. ",
            { a: "Amoeba", href: "/amoeba" },
            " works on that part. It moves a VM’s data disks onto one btrfs pool. Amoeba sizes the pool from the highest use of the last 7\u00a0days, so the pool sits inside its target band with room for the largest recent 15-minute rise and at least 10\u00a0GiB free. It then grows the pool as the data grows and removes disks when the data shrinks. On Linux, the systemd services that use the data mounts restart at the switch onto the pool, and again only if Amoeba retries a failed switch.",
          ],
        },
        { kind: "p", text: "Amoeba doesn’t leave the disks it frees behind as unattached disks:" },
        {
          kind: "ul",
          items: [
            [
              { b: "A disk a shrink empties." },
              " The agent moves its data onto the other pool disks with ",
              { code: "btrfs device remove" },
              ". Amoeba then detaches the empty disk and deletes it, with no snapshot, since its data has already moved. Its billing stops.",
            ],
            [
              { b: "The source disks." },
              " After the 2-hour soak, Amoeba detaches each source disk, takes an incremental snapshot of it, waits until the snapshot is complete and then deletes the disk. It keeps the snapshot for 7\u00a0days after the disk is deleted, then deletes it, and it deletes only snapshots tagged with its own move’s ID.",
            ],
            [
              { b: "Every other disk." },
              " Amoeba works only on the data disks of running VMs, never on the OS disk. Apart from its own source disks during cleanup, the disks your query found stay yours to review.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "If you run the query while a move finishes, a source disk can show as Unattached between its detach and its deletion. The trade-off is the move itself: you pay for both sets of disks from the moment the pool’s disks are created until the source disks are deleted after the soak. Amoeba works on Windows and Linux VMs. On Linux, it needs systemd, kernel 5.14 or later, and btrfs loaded or loadable. The VM needs 3 free data-disk slots: 2 for the pool and 1 kept free for an urgent expand. VMs in the Red Hat family are not moved. The rest of the disk bill is in ",
            { a: "the guide to Azure disk costs", href: "/learn/azure-disk-cost-optimization" },
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
