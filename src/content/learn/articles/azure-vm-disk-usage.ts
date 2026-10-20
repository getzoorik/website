import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/azure-vm-disk-usage/1";

export const article: Article = {
  slug: "azure-vm-disk-usage",
  title: "Azure VM disk usage: check used vs provisioned",
  meta: "Azure VM disk usage lives inside the guest, not in Azure disk metrics. Read used space with df, Run Command or Azure Monitor and match it to what you pay.",
  h1: "Azure VM disk usage: how to check used vs provisioned space",
  deck: "Azure bills the size you provision, but its disk metrics can’t see inside it. How to read used space and compare.",
  card: "Azure bills provisioned size, but its disk metrics can’t see used space. Check it in the VM and at scale.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Azure block storage",
  published: "2026-10-25",
  updated: "2026-10-25",
  author: "shubankar",
  short: [
    "Azure VM disk usage is two numbers: the provisioned size you pay for and the space your files use. A disk’s portal page and the bill show only the first, and Azure’s platform disk metrics report neither. Used space is known only to the filesystem inside the VM, so read it there, with ",
    { code: "df -Th" },
    " in a shell or through Run Command, or collect it with Azure Monitor Agent’s guest metrics. Compare the two, disk by disk.",
  ],
  sections: [
    {
      id: "why-azure-shows-provisioned-size-not-used",
      title: "Why Azure shows provisioned size, not used space",
      blocks: [
        {
          kind: "p",
          text: "A managed disk is billed on what you provision. Microsoft’s billing guide shows a 512\u00a0GiB Premium SSD billed for its provisioned capacity, which appears on the bill as a P20\u00a0disk. A 1\u00a0TiB Standard SSD is billed at the E30 tier, and growing it to 3\u00a0TiB moves it to E50. Premium SSD v2 is billed per GiB you provision. None of those meters depends on how full the disk is: a P20 is billed as a P20 whether it’s 5% full or 95% full.",
        },
        {
          kind: "p",
          text: "Azure’s monitoring follows the same line. The disk metrics Microsoft documents for VMs cover I/O, throughput, queue depth and latency, plus bursting credits and the share of a disk’s provisioned IOPS and bandwidth you consume. None of them reports used or free space. From outside the VM, a disk is a block device of a fixed size. Which of its blocks hold live files is the filesystem’s business.",
        },
        {
          kind: "p",
          text: [
            "For managed disks, ",
            { a: "snapshots", href: "/learn/azure-disk-snapshot-cost" },
            " are where the bill follows your data rather than the size you chose. Microsoft bills them on the used size, so a full snapshot of a 500\u00a0GiB disk with 50\u00a0GiB in use is billed for 50\u00a0GiB, while the disk itself stays billed for its provisioned size. Freeing blocks with TRIM doesn’t reduce the disk’s own bill. Microsoft describes TRIM as saving money on storage billed by consumption, such as unmanaged standard disks and disk snapshots.",
          ],
        },
      ],
    },
    {
      id: "how-to-check-disk-usage-in-an",
      title: "How to check disk usage in an Azure VM",
      blocks: [
        {
          kind: "p",
          text: "Used space lives in the guest operating system, so the check starts there. It has two halves: read each filesystem’s size and use, then tie each filesystem to the Azure disk behind it, because that disk’s size is the one on the bill.",
        },
        { kind: "h3", id: "on-linux", title: "On Linux" },
        {
          kind: "p",
          text: [
            { code: "df" },
            " lists every mounted filesystem with its type, size, used and available space. Microsoft’s own disk guide starts with the same command:",
          ],
        },
        { kind: "code", lang: "bash", code: "df -Th" },
        {
          kind: "p",
          text: [
            "In the sample output on Microsoft Learn, ",
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
          kind: "p",
          text: [
            "The filesystem can also be smaller than the disk. ",
            { a: "Expanding a disk in Azure", href: "/learn/azure-disk-expand-without-downtime" },
            " is half the job: Microsoft’s guide has you expand the managed disk first, then the partition and the filesystem inside Linux. A disk grown without the second step bills for space ",
            { code: "df" },
            " never counts. Take the provisioned size from Azure, not from ",
            { code: "df" },
            ".",
          ],
        },
        {
          kind: "h3",
          id: "match-each-mount-to-the-disk-you",
          title: "Match each mount to the disk you pay for",
        },
        {
          kind: "p",
          text: [
            { code: "df" },
            " names devices, and Azure identifies each attached data disk by its LUN, the logical unit number a disk gets when it’s attached. With a SCSI disk controller, each LUN has a link in ",
            { code: "/dev/disk/azure/scsi1" },
            ":",
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
            ". That puts ",
            { code: "/opt/db/data" },
            " on the disk at LUN 1. On a VM that exposes its disks through an NVMe controller, the ",
            { code: "azure-nvme-id" },
            " tool from the azure-vm-utils package prints each data disk with its LUN, in lines such as ",
            { code: "/dev/nvme0n2: type=data, lun=0" },
            ".",
          ],
        },
        { kind: "diagram", figure: figure1 },
        {
          kind: "p",
          text: "Then read the Azure side. This lists the VM’s data disks, each with its LUN and the managed disk attached there:",
        },
        {
          kind: "code",
          lang: "bash",
          code: 'az vm show -g <resource-group> -n <vm-name> --query "storageProfile.dataDisks"',
        },
        {
          kind: "p",
          text: "And this gives each managed disk’s provisioned size, the size the bill uses:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "az disk list -g <resource-group> \\\n  --query '[*].{Name:name,size:diskSizeGB,Tier:sku.tier}' --output table",
        },
        {
          kind: "p",
          text: "The VM’s Disks page in the portal shows the same LUN, name and size for each disk.",
        },
        { kind: "h3", id: "on-windows", title: "On Windows" },
        {
          kind: "p",
          text: [
            "On Windows you read each volume’s size and free space in the guest, then match the disk to Azure by LUN. Comparing sizes can work, Microsoft notes, but not when several attached disks are the same size. In Disk Management, open a disk’s Properties and read the LUN from the Location field on the General tab. If the disks sit in a Storage Spaces pool, Server Manager lists each one’s LUN under Physical Disks instead. Match it to the same ",
            { code: "az vm show" },
            " and ",
            { code: "az disk list" },
            " output.",
          ],
        },
      ],
    },
    {
      id: "check-azure-vm-disk-space-without-ssh",
      title: "Check Azure VM disk space without SSH or RDP",
      blocks: [
        {
          kind: "p",
          text: "For one VM, or a VM with no SSH or RDP port open, Run Command runs a script inside the guest through the VM agent and returns the output. Microsoft calls it one of the only ways to troubleshoot a VM in that state. It’s also the shortest way to check current usage on an Azure VM disk from your own terminal:",
        },
        {
          kind: "code",
          lang: "bash",
          code: 'az vm run-command invoke -g <resource-group> -n <vm-name> \\\n  --command-id RunShellScript --scripts "df -Th"',
        },
        {
          kind: "p",
          text: [
            "Know its limits before you loop it over a fleet. Output is limited to the last 4,096 bytes, a run takes about 20\u00a0seconds at minimum, one script runs at a time, and the VM needs outbound access on port 443 to send the result back. Running a command needs a role that allows it, such as Virtual Machine Contributor or higher. Scripts run as an elevated user on Linux, so keep them to read-only commands like ",
            { code: "df" },
            ".",
          ],
        },
      ],
    },
    {
      id: "azure-disk-usage-metrics-in-azure-monitor",
      title: "Azure disk usage metrics in Azure Monitor",
      blocks: [
        {
          kind: "p",
          text: "A one-off reading says where a disk stands today. For a trend across many VMs, collect guest metrics with Azure Monitor Agent. These are read inside the VM, unlike the host-level disk metrics above, and the agent samples them every 60\u00a0seconds by default.",
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
          code: '# Used space per mount, in GiB\nsum by ("Microsoft.resourceid", mountpoint) ({"system.filesystem.usage", state="used"}) / (1024 * 1024 * 1024)\n\n# Share of each filesystem that is used\nsum by ("Microsoft.resourceid", mountpoint) ({"system.filesystem.usage", state="used"})\n  /\nsum by ("Microsoft.resourceid", mountpoint) ({"system.filesystem.usage"})',
        },
        {
          kind: "p",
          text: [
            "Metric names and labels that contain dots go in quotes inside the braces, the UTF-8 syntax Prometheus 3.0 introduced, and grouping by ",
            { code: '"Microsoft.resourceid"' },
            " makes each row name its VM.",
          ],
        },
        {
          kind: "p",
          text: [
            "If you collect classic performance counters into a Log Analytics workspace instead, the Linux counter is ",
            { code: "Logical Disk(*)\\% Free Space" },
            ", where ",
            { code: "(*)" },
            " gives each mount its own row. Windows’s default list has ",
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
            " filters match Microsoft’s own free-space sample, which skips the ",
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
          text: [
            "An Azure disk utilization report needs one row per data disk: the VM, the mount, the LUN, the provisioned size and the used space. Each source above holds one piece of that row. Azure Monitor gives used space per mount, the LUN links on each VM tie mounts to LUNs, ",
            { code: "az vm show" },
            " ties each LUN to its managed disk, and ",
            { code: "az disk list" },
            " gives that disk’s provisioned size.",
          ],
        },
        {
          kind: "p",
          text: "Two cases need care. When one mount sits on more than one disk, an LVM volume group or a striped set for example, add up the provisioned sizes of every disk behind it before you compare. And a filesystem that was never grown after its disk was expanded reads smaller than the disk, so the provisioned column always comes from Azure.",
        },
        {
          kind: "p",
          text: [
            "Sort the report with the emptiest disks first, as the Perf query above does. An alert ranks the fullest disks first, because they’re the risk, while a cost report ranks the emptiest first, because each of those is billed for space that holds nothing. The alert has ",
            { a: "its own guide", href: "/learn/azure-vm-disk-space-alert" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "Azure can’t take the empty space back in place. Microsoft’s expand guide says shrinking an existing disk “isn’t supported and might result in data loss.” What to do with the gap is covered in ",
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
            " each mount’s path, filesystem type, used and total size, and the devices, LUNs and cloud disk IDs behind it. That’s the mount-to-disk join from the report, kept current. The console shows used and provisioned space on every disk, 30\u00a0days of both on each VM’s Dashboard, and what the disks cost at Azure’s list price. Until the agent reports, used space reads “Available once the agent reports” rather than a guess.",
          ],
        },
        {
          kind: "p",
          text: "Then Amoeba rightsizes. It moves the VM’s data mounts onto one btrfs pool, and each mount keeps its path. Amoeba sizes the pool from the highest use of the last 7\u00a0days, so the pool sits inside its target band with room for the largest recent 15-minute rise and at least 10\u00a0GiB free. The systemd services that use those mounts restart at the switch onto the pool. After that the pool expands as the data grows and shrinks one disk at a time as it falls, without unmounting. On Linux, Amoeba needs systemd, kernel 5.14 or later, and btrfs loaded or loadable. The VM needs 3 free data-disk slots: 2 for the pool and 1 kept free for an urgent expand. VMs in the Red Hat family are not moved.",
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
