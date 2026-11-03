import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/azure-vm-disk-usage/1";
import { figure as figure2 } from "@/features/learn/figures/azure-vm-disk-usage/2";

export const article: Article = {
  slug: "azure-vm-disk-usage",
  title: "Azure VM disk usage: check used vs provisioned",
  meta: "Check Azure VM disk usage with df, Run Command or Azure Monitor Agent, then match each mount to the provisioned size you pay for.",
  h1: "How to check Azure VM disk usage",
  deck: "Read used space inside the VM, then match each mount to the Azure disk whose provisioned size you pay for.",
  card: "You pay for provisioned size, but Azure’s disk metrics don’t show used space. Check it in the VM and at scale.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Azure block storage",
  published: "2026-10-23",
  updated: "2026-11-03",
  author: "shubankar",
  cover: "/learn-covers/zoorik-learn-azure-vm-disk-usage-1200x630.webp",
  coverAlt: "Azure VM disk usage: df -Th shows the used space against each disk’s provisioned size",
  short: [
    "Azure charges a managed disk’s capacity by its provisioned size, but its disk metrics don’t show used space. Only the filesystem inside the VM knows it. Read it with ",
    { a: { code: "df -Th" }, href: "/learn/glossary/df-vs-du" },
    ", Run Command or Azure Monitor Agent. Then match each mount to its disk by LUN and compare the two.",
  ],
  sections: [
    {
      id: "azure-charges-for-the-provisioned-size-and",
      title: "Provisioned vs used space",
      blocks: [
        {
          kind: "p",
          text: "Azure charges a managed disk’s capacity by its provisioned size, not by the data on it. Microsoft’s guide to disk charges gives three cases:",
        },
        {
          kind: "ul",
          items: [
            [
              "A 512 GiB ",
              { a: "Premium SSD", href: "/learn/glossary/azure-premium-ssd" },
              " is charged as a P20, one of the fixed ",
              { a: "Azure disk sizes", href: "/learn/glossary/azure-disk-sizes" },
              ".",
            ],
            "A 1 TiB Standard SSD is charged at the E30 tier. Grown to 3 TiB, it moves to E50.",
            "Premium SSD v2 capacity is charged per GiB you provision.",
          ],
        },
        {
          kind: "p",
          text: "None of these depends on how full the disk is. A P20 is charged as a P20 at 5% full or 95% full.",
        },
        {
          kind: "p",
          text: "The same guide’s snapshot example is a 500 GiB disk with 50 GiB in use. The portal shows 500 GiB, and the disk’s charge is set by that size.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "50 ÷ 500 = 10% of the disk is in use. The other 450 GiB, 90%, holds no data. That’s 10 GiB provisioned for each GiB of data.",
        },
        {
          kind: "p",
          text: "Azure’s disk metrics cover I/O, throughput, queue depth, latency, bursting, and the share of provisioned IOPS and bandwidth in use. None shows used or free space. From outside the VM, a disk is a block device of fixed size. Only the filesystem inside the VM knows which blocks hold files.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "how-to-check-disk-usage-in-an",
      title: "Check inside the VM",
      blocks: [
        {
          kind: "h3",
          id: "on-linux-read-each-filesystem-with-df",
          title: "Linux: used space with df",
        },
        {
          kind: "p",
          text: [
            { code: "df -Th" },
            " lists each mounted filesystem with its type, size, used and available space. Microsoft’s expand guide starts with it:",
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
            " is a 32G ext4 filesystem with 30G used. ",
            { code: "/opt/db/log" },
            " on ",
            { code: "/dev/sde1" },
            " is 32G with 49M used. The first is nearly full. The second is almost empty, but you pay for the whole disk.",
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            { code: "df" },
            " measures the filesystem, which can be smaller than the disk. ",
            { a: "Expanding a disk in Azure", href: "/learn/azure-disk-expand-without-downtime" },
            " takes two steps: grow the managed disk, then the partition and filesystem inside Linux. Skip the second, and you pay for space ",
            { code: "df" },
            " never shows. So always take the provisioned size from Azure.",
          ],
        },
        {
          kind: "h3",
          id: "on-linux-match-each-mount-to-the",
          title: "Linux: match mounts to disks",
        },
        {
          kind: "p",
          text: [
            { code: "df" },
            " names devices, while Azure identifies each data disk by its LUN (logical unit number), set when the disk is attached. Three steps join a mount to its disk.",
          ],
        },
        {
          kind: "ol",
          items: [
            [
              { b: "Find the LUN behind each device." },
              " On a SCSI controller, each LUN has a link in ",
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
            ". The partitions ",
            { code: "df" },
            " named, ",
            { code: "sdd1" },
            " and ",
            { code: "sde1" },
            ", have links too (",
            { code: "lun1-part1" },
            ", ",
            { code: "lun2-part1" },
            "). So ",
            { code: "/opt/db/data" },
            " is on LUN 1 and ",
            { code: "/opt/db/log" },
            " on LUN 2.",
          ],
        },
        {
          kind: "p",
          text: [
            "On an NVMe controller, ",
            { code: "azure-nvme-id" },
            " from the azure-vm-utils package lists each data disk with its LUN, in lines like ",
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
              " Each shows its LUN and the managed disk attached there:",
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
          items: [[{ b: "Read each disk’s provisioned size." }, " That’s the size you pay for:"]],
        },
        {
          kind: "code",
          lang: "bash",
          code: "az disk list -g <resource-group> \\\n  --query '[*].{Name:name,size:diskSizeGB,Tier:sku.tier}' --output table",
        },
        {
          kind: "p",
          text: "This lists every disk in the resource group, so pick the names from step 2. The VM’s Disks page in the portal shows the same LUN, name and size. On the sample VM, the LUN joins each mount to its disk:",
        },
        { kind: "svg", figure: figure2 },
        { kind: "h3", id: "on-windows", title: "Windows" },
        {
          kind: "p",
          text: "Match by LUN here too. Comparing sizes can work, Microsoft notes, but not when several attached disks are the same size.",
        },
        {
          kind: "p",
          text: "In Disk Management, open a disk’s Properties: the LUN is in the Location field on the General tab. For disks in a Storage Spaces pool, Server Manager lists each LUN under Physical Disks. Then match it to Azure with steps 2 and 3 above.",
        },
        {
          kind: "p",
          text: [
            "For used space per drive, collect ",
            { code: "system.filesystem.usage" },
            " with Azure Monitor Agent, below. It covers Windows and Linux VMs alike.",
          ],
        },
      ],
    },
    {
      id: "check-azure-vm-disk-space-without-ssh",
      title: "Check without SSH or RDP",
      blocks: [
        {
          kind: "p",
          text: [
            "Run Command runs a script inside the VM through the VM agent and returns its output. It works even when SSH and RDP are closed, and it runs ",
            { code: "df" },
            " on one Linux VM straight from your terminal:",
          ],
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
            "A run takes at least about 20 seconds.",
            "One script runs at a time.",
            "The VM needs outbound access on port 443 to return the result.",
            "You need a role such as Virtual Machine Contributor or higher.",
            ["Scripts run as an elevated user, so keep them read-only, like ", { code: "df" }, "."],
          ],
        },
      ],
    },
    {
      id: "collect-azure-disk-usage-metrics-with-azure",
      title: "Track usage with Azure Monitor",
      blocks: [
        {
          kind: "p",
          text: "For a trend across many VMs, collect guest metrics with Azure Monitor Agent. Unlike the disk metrics above, it reads them inside the VM and samples every 60 seconds by default.",
        },
        {
          kind: "p",
          text: [
            "With OpenTelemetry metrics, which Microsoft recommends for new deployments, collect ",
            { code: "system.filesystem.usage" },
            ". It counts bytes per filesystem, with ",
            { code: "mountpoint" },
            " and ",
            { code: "state" },
            " labels. The ",
            { code: "state" },
            " is ",
            { code: "used" },
            ", ",
            { code: "free" },
            " or ",
            { code: "reserved" },
            ". The agent sends it to an Azure Monitor workspace, which you query in PromQL:",
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
            "Names with dots go in quotes, the UTF-8 syntax of Prometheus 3.0. Grouping by ",
            { code: '"Microsoft.resourceid"' },
            " makes each row name its VM, and dividing by 1024 three times turns bytes into GiB. The share counts reserved space in the total, so on the sample’s ",
            { code: "/opt/db/data" },
            " it reads 30 ÷ 32 ≈ 94%, below ",
            { code: "df" },
            "’s 98%.",
          ],
        },
        {
          kind: "p",
          text: [
            "With classic performance counters in a Log Analytics workspace, the Linux counter is ",
            { code: "Logical Disk(*)\\% Free Space" },
            ", one row per mount. The Windows default is ",
            { code: "\\LogicalDisk(_Total)\\% Free Space" },
            ", one figure for all drives, so collect it per drive in your data collection rule. Readings land in the Perf table:",
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
            "The ",
            { code: "InstanceName" },
            " filters follow Microsoft’s free-space sample, which skips ",
            { code: "_Total" },
            " and ",
            { code: "HarddiskVolume1" },
            ".",
          ],
        },
      ],
    },
    {
      id: "build-an-azure-vm-disk-usage-report",
      title: "Build a usage report",
      blocks: [
        {
          kind: "p",
          text: "A usage report needs one row per mount. Each row holds the VM, the mount, each LUN and disk behind it, their total provisioned size and the used space. Each source above fills a part:",
        },
        {
          kind: "ul",
          items: [
            "Used GiB per mount: the first PromQL query. The Perf query gives only % free.",
            ["Mount to device: ", { code: "df" }, " on each VM."],
            ["Device to LUN: the LUN links, or ", { code: "azure-nvme-id" }, " on NVMe."],
            ["LUN to managed disk: ", { code: "az vm show" }, "."],
            ["Provisioned size: ", { code: "az disk list" }, "."],
          ],
        },
        {
          kind: "p",
          text: "Device and LUN reads happen inside each VM, so a fleet report takes one SSH session or Run Command per VM, within the limits above. Then check each row:",
        },
        {
          kind: "ol",
          items: [
            "Is the filesystem smaller than its disk? Part of the disk is paid for but can’t hold data until you finish the expand.",
            "Does the mount span several disks, such as an LVM volume group or a striped set? Add up their provisioned sizes.",
            [
              "Is it nearly full? That’s a risk, so ",
              { a: "an alert", href: "/learn/azure-vm-disk-space-alert" },
              " ranks the fullest first.",
            ],
            "Is it mostly empty? You pay for space that holds no data, so a cost report, like the Perf query, ranks the emptiest first.",
          ],
        },
        {
          kind: "p",
          text: "Azure can’t take empty space back in place. Microsoft’s expand guide says shrinking an existing disk “isn’t supported and might result in data loss.”",
        },
        {
          kind: "p",
          text: "TRIM doesn’t reduce a managed disk’s charge either. Microsoft says it saves money on storage charged by what it consumes, such as unmanaged standard disks and disk snapshots.",
        },
        {
          kind: "p",
          text: [
            { a: "Snapshots", href: "/learn/azure-disk-snapshot-cost" },
            " are charged by used size. A full snapshot of the 500 GiB disk above is charged for 50 GiB, while the disk stays charged at its provisioned size.",
          ],
        },
        {
          kind: "p",
          text: [
            "To close the gap between used and provisioned space, see ",
            { a: "how to shrink an Azure managed disk", href: "/learn/shrink-azure-managed-disk" },
            ", then ",
            { a: "Azure disk reservations", href: "/learn/azure-disk-reservations" },
            ". On AWS, see ",
            { a: "how to check EBS volume usage", href: "/learn/check-ebs-volume-usage" },
            ".",
          ],
        },
      ],
    },
    {
      id: "how-amoeba-tracks-used-and-provisioned-space",
      title: "How Amoeba closes the gap",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " runs this check on every VM you onboard, then acts on it. Its agent installs through Azure Run Command. It then ",
            { a: "keeps reporting", href: "/amoeba-guide#what-leaves-the-vm" },
            " each mount’s path, filesystem type, used and total size, and the LUNs and disks behind it.",
          ],
        },
        {
          kind: "p",
          text: "Amoeba moves the VM’s data disks onto one btrfs pool sized to your data, with room to grow. It copies while your services run, and each mount keeps its path. At the switch, the services that use each mount get a short restart.",
        },
        {
          kind: "p",
          text: "Amoeba rightsizes the pool without any downtime. It grows the pool before it fills. When your data goes down and stays down, it shrinks the pool one disk at a time.",
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
      title: "How to check EBS volume usage",
      where: "Learn",
      href: "/learn/check-ebs-volume-usage",
    },
    {
      title: "How to set up an Azure VM disk space alert",
      where: "Learn",
      href: "/learn/azure-vm-disk-space-alert",
    },
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
      title: "Azure snapshot pricing: incremental vs full",
      where: "Learn",
      href: "/learn/azure-disk-snapshot-cost",
    },
  ],
};
