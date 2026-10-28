import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/azure-vm-disk-usage/1";
import { figure as figure2 } from "@/features/learn/figures/azure-vm-disk-usage/2";

export const article: Article = {
  slug: "azure-vm-disk-usage",
  title: "Azure VM disk usage: check used vs provisioned",
  meta: "Azure VM disk usage lives inside the guest, not in Azure disk metrics. Read used space with df, Run Command or Azure Monitor and match it to what you pay for.",
  h1: "Azure VM disk usage: how to check used vs provisioned space",
  deck: "Azure bills the size you provision, but its disk metrics can’t see inside it. How to read used space and compare.",
  card: "Azure bills provisioned size, but its disk metrics can’t see used space. Check it in the VM and at scale.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Azure block storage",
  published: "2026-10-23",
  updated: "2026-10-23",
  author: "shubankar",
  cover: "/learn-covers/zoorik-learn-azure-vm-disk-usage-1200x630.webp",
  short: [
    "Azure VM disk usage is two numbers: the provisioned size you pay for and the space your files use. A disk’s portal page and its bill show only the first, and Azure’s platform disk metrics report neither. Used space is known only to the filesystem inside the VM, so read it there, with ",
    { code: "df -Th" },
    " in a shell or through Run Command, or collect it with Azure Monitor Agent’s guest metrics. Compare the two, disk by disk.",
  ],
  sections: [
    {
      id: "azure-bills-the-provisioned-size-and-its",
      title: "Azure bills the provisioned size, and its disk metrics don’t show used space",
      blocks: [
        {
          kind: "p",
          text: "Picture a 500\u00a0GiB managed disk with 50\u00a0GiB of it in use, the example Microsoft’s billing guide uses for snapshots. The portal lists 500\u00a0GiB, and the disk’s own line on the bill is set by that size.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "On that disk, 50 ÷ 500 = 10% of the provisioned size is in use, and the other 500 − 50 = 450\u00a0GiB, 90%, holds no data. That’s 500 ÷ 50 = 10\u00a0GiB provisioned per GiB of data.",
        },
        { kind: "p", text: "Microsoft’s billing guide gives three cases:" },
        {
          kind: "ul",
          items: [
            "A 512\u00a0GiB Premium SSD appears on the bill as a P20\u00a0disk.",
            "A 1\u00a0TiB Standard SSD is billed at the E30 tier, and growing it to 3\u00a0TiB moves it to E50.",
            "Premium SSD v2 is billed per GiB you provision.",
          ],
        },
        {
          kind: "p",
          text: "None of those meters depends on how full the disk is: a P20 is billed as a P20 whether it’s 5% full or 95% full.",
        },
        {
          kind: "p",
          text: "Azure’s disk metrics for VMs cover I/O, throughput, queue depth and latency, plus bursting credits and the share of a disk’s provisioned IOPS and bandwidth you consume. Used and free space aren’t among them. From outside the VM, a disk is a block device of a fixed size, and only the filesystem tracks which of its blocks hold live files.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "how-to-check-disk-usage-in-an",
      title: "How to check disk usage in an Azure VM",
      blocks: [
        {
          kind: "p",
          text: "The check has two halves: read each filesystem’s size and use inside the guest, then tie each filesystem to the Azure disk behind it, whose size is the one on the bill.",
        },
        {
          kind: "h3",
          id: "on-linux-read-each-filesystem-with-df",
          title: "On Linux: read each filesystem with df",
        },
        {
          kind: "p",
          text: [
            { code: "df" },
            " lists every mounted filesystem with its type, size, used and available space. Microsoft’s expand guide starts with the same command:",
          ],
        },
        { kind: "code", lang: "bash", code: "df -Th" },
        {
          kind: "p",
          text: [
            "In Microsoft’s sample output, ",
            { code: "/opt/db/data" },
            " on ",
            { code: "/dev/sdd1" },
            " is a 32G ext4 filesystem with 30G used, and ",
            { code: "/opt/db/log" },
            " on ",
            { code: "/dev/sde1" },
            " is 32G with 49M used. One is close to full, while the other is billed for space that holds almost nothing.",
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            { code: "df" },
            " measures the filesystem, and the filesystem can be smaller than the disk. ",
            { a: "Expanding a disk in Azure", href: "/learn/azure-disk-expand-without-downtime" },
            " is half the job: Microsoft’s guide has you expand the managed disk first, then the partition and the filesystem inside Linux. A disk grown without the second step bills for space ",
            { code: "df" },
            " never counts, so always take the provisioned size from Azure.",
          ],
        },
        {
          kind: "h3",
          id: "on-linux-match-each-mount-to-the",
          title: "On Linux: match each mount to the disk you pay for",
        },
        {
          kind: "p",
          text: [
            { code: "df" },
            " names devices, and Azure identifies each attached data disk by its LUN, the logical unit number a disk gets when it’s attached. Three steps tie a mount to the disk behind it.",
          ],
        },
        {
          kind: "ol",
          items: [
            [
              { b: "Find the LUN behind each device." },
              " With a SCSI disk controller, each LUN has a link in ",
              { code: "/dev/disk/azure/scsi1" },
              ":",
            ],
          ],
        },
        { kind: "code", lang: "bash", code: "sudo ls -alF /dev/disk/azure/scsi1/" },
        {
          kind: "p",
          text: [
            "Microsoft’s example links ",
            { code: "lun1" },
            " to ",
            { code: "sdd" },
            " and ",
            { code: "lun2" },
            " to ",
            { code: "sde" },
            ". The devices ",
            { code: "df" },
            " named, ",
            { code: "sdd1" },
            " and ",
            { code: "sde1" },
            ", are partition 1 on each disk, with links of their own (",
            { code: "lun1-part1" },
            ", ",
            { code: "lun2-part1" },
            "). That puts ",
            { code: "/opt/db/data" },
            " on the disk at LUN 1 and ",
            { code: "/opt/db/log" },
            " on LUN 2. On a VM that exposes its disks through an NVMe controller, the ",
            { code: "azure-nvme-id" },
            " tool from the azure-vm-utils package prints each data disk with its LUN, in lines such as ",
            { code: "/dev/nvme0n2: type=data, lun=0" },
            ".",
          ],
        },
        {
          kind: "ol",
          start: 2,
          items: [
            [
              { b: "List the VM’s data disks in Azure." },
              " Each comes with its LUN and the managed disk attached there:",
            ],
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: 'az vm show -g <resource-group> -n <vm-name> --query "storageProfile.dataDisks"',
        },
        {
          kind: "ol",
          start: 3,
          items: [
            [
              { b: "Read each managed disk’s provisioned size." },
              " That’s the size the bill uses:",
            ],
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "az disk list -g <resource-group> \\\n  --query '[*].{Name:name,size:diskSizeGB,Tier:sku.tier}' --output table",
        },
        {
          kind: "p",
          text: "That command lists every disk in the resource group, so pick out the names from step 2. The VM’s Disks page in the portal shows the same LUN, name and size for each disk, and on the sample VM the LUN is what joins each mount to a disk on the bill:",
        },
        { kind: "svg", figure: figure2 },
        { kind: "h3", id: "on-windows", title: "On Windows" },
        {
          kind: "p",
          text: [
            "The Run Command example below runs a Linux shell script. On Windows, collect each drive’s use with Azure Monitor Agent instead: its ",
            { code: "system.filesystem.usage" },
            " counter, below, covers Windows and Linux VMs alike.",
          ],
        },
        {
          kind: "p",
          text: "Matching a disk to Azure goes by LUN: comparing sizes can work, Microsoft notes, but not when several attached disks are the same size. In Disk Management, a disk’s Properties show the LUN in the Location field on the General tab. If the disks sit in a Storage Spaces pool, Server Manager lists each one’s LUN under Physical Disks instead. Then match it to Azure with steps 2 and 3 above.",
        },
      ],
    },
    {
      id: "check-azure-vm-disk-space-without-ssh",
      title: "Check Azure VM disk space without SSH or RDP",
      blocks: [
        {
          kind: "p",
          text: "For one VM, or a VM whose SSH and RDP ports are both closed, Run Command runs a script inside the guest through the VM agent and returns the output. Microsoft calls it one of the only ways to troubleshoot a VM in that state. It’s also the shortest way to check current usage on an Azure VM disk from your own terminal:",
        },
        {
          kind: "code",
          lang: "bash",
          code: 'az vm run-command invoke -g <resource-group> -n <vm-name> \\\n  --command-id RunShellScript --scripts "df -Th"',
        },
        { kind: "p", text: "Know its limits before you loop it over a fleet:" },
        {
          kind: "ul",
          items: [
            "Output is limited to the last 4,096 bytes.",
            "Running a command needs a role that allows it, such as Virtual Machine Contributor or higher.",
            "A run takes about 20\u00a0seconds at minimum.",
            "The VM needs outbound access on port 443 to send the result back.",
            "One script runs at a time.",
          ],
        },
        {
          kind: "p",
          text: [
            "Scripts run as an elevated user on Linux, so keep them to read-only commands like ",
            { code: "df" },
            ".",
          ],
        },
      ],
    },
    {
      id: "collect-azure-disk-usage-metrics-with-azure",
      title: "Collect Azure disk usage metrics with Azure Monitor Agent",
      blocks: [
        {
          kind: "p",
          text: "For a trend across many VMs, collect guest metrics through Azure Monitor Agent, which reads them inside the VM, unlike the host-level disk metrics above. The agent samples them every 60\u00a0seconds by default.",
        },
        {
          kind: "p",
          text: [
            "With OpenTelemetry metrics, which Microsoft recommends for new deployments, the counter to collect is ",
            { code: "system.filesystem.usage" },
            ": bytes per filesystem, with ",
            { code: "mountpoint" },
            " and ",
            { code: "state" },
            " labels, where ",
            { code: "state" },
            " is ",
            { code: "used" },
            ", ",
            { code: "free" },
            " or ",
            { code: "reserved" },
            ". The agent sends it to an Azure Monitor workspace that you query in PromQL:",
          ],
        },
        {
          kind: "code",
          lang: "promql",
          code: '# Used space per mount, in GiB\nsum by ("Microsoft.resourceid", mountpoint) ({"system.filesystem.usage", state="used"})\n  / (1024 * 1024 * 1024)\n\n# Share of each filesystem that is used\nsum by ("Microsoft.resourceid", mountpoint) ({"system.filesystem.usage", state="used"})\n  /\nsum by ("Microsoft.resourceid", mountpoint) ({"system.filesystem.usage"})',
        },
        {
          kind: "callout",
          label: "For engineers",
          text: [
            "Metric names and labels that contain dots go in quotes inside the braces, the UTF-8 syntax Prometheus 3.0 introduced. Grouping by ",
            { code: '"Microsoft.resourceid"' },
            " makes each row name its VM, and dividing by 1024 three times turns bytes into GiB. The share query’s denominator includes reserved space. For the sample’s ",
            { code: "/opt/db/data" },
            " it gives 30 ÷ 32 ≈ 94%, a little below the 98% that ",
            { code: "df" },
            " prints.",
          ],
        },
        {
          kind: "p",
          text: [
            "If you collect classic performance counters into a Log Analytics workspace instead, the Linux counter is ",
            { code: "Logical Disk(*)\\% Free Space" },
            ", where the asterisk gives each mount its own row. Windows’s default list has ",
            { code: "\\LogicalDisk(_Total)\\% Free Space" },
            ", one figure for all drives together, so collect the counter per drive in your data collection rule if you want a row for each. The readings land in the Perf table:",
          ],
        },
        {
          kind: "code",
          lang: "kusto",
          code: 'Perf\n| where TimeGenerated > ago(1d)\n| where ObjectName in ("Logical Disk", "LogicalDisk") and CounterName == "% Free Space"\n| where InstanceName != "_Total" and InstanceName != "HarddiskVolume1"\n| summarize arg_max(TimeGenerated, CounterValue) by Computer, InstanceName\n| order by CounterValue desc',
        },
        {
          kind: "p",
          text: [
            "The two ",
            { code: "InstanceName" },
            " filters match Microsoft’s free-space sample, which skips the ",
            { code: "_Total" },
            " row and ",
            { code: "HarddiskVolume1" },
            ".",
          ],
        },
      ],
    },
    {
      id: "build-an-azure-vm-disk-usage-report",
      title: "Build an Azure VM disk usage report",
      blocks: [
        {
          kind: "p",
          text: "An Azure disk utilization report needs one row per mount: the VM, the mount, every LUN and disk behind it, their provisioned sizes added up, and the used space. Each source above holds one piece of that row:",
        },
        {
          kind: "ul",
          items: [
            "Used GiB per mount: the first PromQL query above, since the Perf query gives only % free.",
            ["Mount to device: ", { code: "df" }, " on each VM."],
            [
              "Device to LUN: the LUN links in each VM, or ",
              { code: "azure-nvme-id" },
              " where the disks sit on an NVMe controller.",
            ],
            ["LUN to managed disk: ", { code: "az vm show" }, "."],
            ["Provisioned size: ", { code: "az disk list" }, ", for each managed disk."],
          ],
        },
        {
          kind: "p",
          text: "The device and LUN reads happen inside each VM, so a fleet report takes one SSH session or Run Command per VM, and the Run Command limits above apply. Then read each row in order:",
        },
        {
          kind: "ol",
          items: [
            "Is the filesystem smaller than its disk? Then part of the disk is paid for but can’t hold data until you finish the expand (the Watch out above).",
            "Does the mount sit on more than one disk, such as an LVM volume group or a striped set? Add up the provisioned sizes of every disk behind it.",
            [
              "Is it nearly full? That’s the risk, so ",
              { a: "an alert", href: "/learn/azure-vm-disk-space-alert" },
              " ranks the fullest disks first.",
            ],
            "Is it mostly empty? Most of what you pay for it holds no data, so a cost report, like the Perf query above, ranks the emptiest first.",
          ],
        },
        {
          kind: "p",
          text: "Azure can’t take the empty space back in place. Microsoft’s expand guide says shrinking an existing disk “isn’t supported and might result in data loss.” Freeing blocks with TRIM doesn’t reduce the disk’s own bill either: Microsoft describes TRIM as saving money on storage billed by consumption, such as unmanaged standard disks and disk snapshots.",
        },
        {
          kind: "p",
          text: [
            { a: "Snapshots", href: "/learn/azure-disk-snapshot-cost" },
            " are the one managed-disk charge billed on used size: a full snapshot of the 500\u00a0GiB disk above is billed for 50\u00a0GiB, while the disk stays billed for its provisioned size. What to do with the gap is covered in ",
            { a: "the guide to shrinking a disk", href: "/learn/shrink-azure-managed-disk" },
            " and in ",
            { a: "the disk cost guide", href: "/learn/azure-disk-cost-optimization" },
            ". On AWS the measuring job has the same shape, and ",
            { a: "the EBS guide", href: "/learn/check-ebs-volume-usage" },
            " walks through it.",
          ],
        },
      ],
    },
    {
      id: "how-amoeba-tracks-used-and-provisioned-space",
      title: "How Amoeba tracks used and provisioned space",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " by Zoorik does this measuring on every VM you onboard, then acts on it. Its agent installs through Azure Run Command, the channel used above, and ",
            { a: "every 15\u00a0seconds reports", href: "/amoeba/guide#what-leaves-the-vm" },
            " each mount’s path, filesystem type, used and total size, and the devices, LUNs and cloud disk IDs behind it. That’s the mount-to-disk join from the report, kept current.",
          ],
        },
        {
          kind: "p",
          text: "The console shows used and provisioned space on every disk, 30\u00a0days of both on each VM’s Dashboard, and what the disks cost at Azure’s list price. Before the agent’s first report, used space reads “Available once the agent reports” rather than a guess.",
        },
        {
          kind: "p",
          text: "Then Amoeba rightsizes. It moves the VM’s data mounts onto one btrfs pool, and each mount keeps its path. Amoeba sizes the pool from the highest use of the last 7\u00a0days, so the pool sits inside its target band with room for the largest recent 15-minute rise and at least 10\u00a0GiB free. It copies the data while services run, and the systemd services that use those mounts restart at the switch onto the pool. After that the pool expands as the data grows and shrinks one disk at a time as it falls, without unmounting.",
        },
        {
          kind: "p",
          text: "Amoeba works on Windows and Linux VMs. On Linux, it needs systemd, kernel 5.14 or later, and btrfs loaded or loadable, and every process that keeps a data mount open must run as a systemd service. The VM needs 3 free data-disk slots: 2 for the pool and 1 kept free for an urgent expand. VMs in the Red Hat family are not moved.",
        },
        {
          kind: "p",
          text: [
            "To see the gap on your own VMs first, the ",
            { a: "free assessment", href: "/assessment?p=amoeba" },
            " runs in your terminal or Cloud Shell and covers the data disks of Linux Azure VMs. It runs a command inside your VMs only after you say yes, and sends nothing to Zoorik. What you get is one PDF with each VM’s estimated saving at list price.",
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
      title: "“Disk performance metrics”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-metrics",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Expand virtual hard disks on a Linux VM”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/linux/expand-disks",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Use the portal to attach a data disk to a Linux VM”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/linux/attach-disk-portal",
    },
    {
      publisher: "Microsoft Learn",
      title: "“How to map Azure Disks to Windows VM guest disks”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/windows/azure-to-guest-disk-mapping",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Run scripts in your Linux VM by using action Run Commands”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/linux/run-command",
    },
    {
      publisher: "Microsoft Learn",
      title: "“OpenTelemetry Guest OS Metrics reference”",
      url: "https://learn.microsoft.com/en-us/azure/azure-monitor/vm/metrics-guest-reference",
    },
    {
      publisher: "Microsoft Learn",
      title: "“PromQL for system metrics and Guest OS performance counters”",
      url: "https://learn.microsoft.com/en-us/azure/azure-monitor/metrics/prometheus-system-metrics-best-practices",
    },
  ],
  related: [
    {
      title: "How to check EBS volume usage: used space vs paid space",
      where: "Learn",
      href: "/learn/check-ebs-volume-usage",
    },
    {
      title: "Azure VM disk space alert: how to set one up in Azure Monitor",
      where: "Learn",
      href: "/learn/azure-vm-disk-space-alert",
    },
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
      title: "Azure disk snapshot cost: incremental vs full snapshots",
      where: "Learn",
      href: "/learn/azure-disk-snapshot-cost",
    },
  ],
};
