import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/azure-vm-disk-space-alert/1";
import { figure as figure2 } from "@/features/learn/figures/azure-vm-disk-space-alert/2";

export const article: Article = {
  slug: "azure-vm-disk-space-alert",
  title: "Azure VM disk space alert in Azure Monitor",
  meta: "An Azure VM disk space alert needs free-space data from inside the VM. Set one up per mount with a PromQL metric alert or a KQL log search alert.",
  h1: "How to set up an Azure VM disk space alert",
  deck: "Azure’s host metrics can’t see free space, so collect it inside the VM and alert on each mount.",
  card: "Azure has no host metric for free space. Two ways to alert on a nearly full VM disk in Azure Monitor.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Azure block storage",
  published: "2026-11-01",
  updated: "2026-11-03",
  author: "rupeshankar",
  cover: "/learn-covers/zoorik-learn-azure-vm-disk-space-alert-1200x630.webp",
  coverAlt:
    "Azure VM disk space alert: a reading from inside the VM fires the alert, while host metrics can’t see it",
  short: [
    "Azure Monitor’s host metrics never report free space, so an Azure VM disk space alert needs data from inside the VM. Turn on enhanced monitoring, which installs Azure Monitor Agent. Then alert on ",
    { code: "system.filesystem.usage" },
    " with a query-based metric alert (preview), or on ",
    { code: "FreeSpacePercentage" },
    " with a log search alert.",
  ],
  sections: [
    {
      id: "azure-vm-disk-space-alert",
      title: "Host metrics miss free space",
      blocks: [
        {
          kind: "p",
          text: "Azure Monitor collects host metrics for every VM with no setup. For data disks, they report IOPS, throughput, latency, queue depth and burst credits, each per LUN (the disk’s logical unit number). None of them reports free space. The Data Disk Used Burst IO and BPS Credits Percentage metrics sound close, but they count burst credits, not space.",
        },
        {
          kind: "p",
          text: [
            "A ",
            { a: "managed disk", href: "/learn/glossary/azure-managed-disk" },
            " is a block device: Azure sees only blocks read and written. The filesystem that tracks free space runs in your guest operating system, so the reading has to come from an agent there.",
          ],
        },
        {
          kind: "p",
          text: "Virtual machines also have no preconfigured alert rules. The recommended rules Azure can add use host metrics, unless OpenTelemetry metrics are on. Until a rule reads data from inside the guest, nothing warns you as a disk fills.",
        },
      ],
    },
    {
      id: "azure-monitor-agent-collects-free-space-under",
      title: "Where free space comes from",
      blocks: [
        {
          kind: "p",
          text: "Azure Monitor Agent collects guest data on Windows and Linux. A data collection rule (DCR) tells it what to collect, and it samples every 60\u00a0seconds by default. Each path below names the free-space signal differently:",
        },
        {
          kind: "table",
          columns: [
            { label: "Path", width: "15%" },
            { label: "Where the data lands", width: "15%" },
            { label: "Free-space signal", width: "50%" },
            { label: "Alert rule type", width: "20%" },
          ],
          rows: [
            [
              "OpenTelemetry metrics (recommended)",
              "Azure Monitor workspace",
              [
                { code: "system.filesystem.usage" },
                " in bytes, split by ",
                { code: "state" },
                " (free, reserved, used) and ",
                { code: "mountpoint" },
              ],
              "Query-based metric alert in PromQL (preview)",
            ],
            [
              "VM insights, logs-based (classic)",
              ["Log Analytics workspace, ", { code: "InsightsMetrics" }, " table"],
              ["Namespace ", { code: "LogicalDisk" }, ", name ", { code: "FreeSpacePercentage" }],
              "Log search alert in KQL",
            ],
            [
              "A DCR you write",
              ["Log Analytics workspace, ", { code: "Perf" }, " table"],
              [
                "Linux: ",
                { code: "Logical Disk(*)\\% Free Space" },
                " and ",
                { code: "Free Megabytes" },
                ". Windows: ",
                { code: "% Free Space" },
                " and ",
                { code: "Free Megabytes" },
                " in ",
                { code: "LogicalDisk" },
                ", read per volume, not ",
                { code: "_Total" },
              ],
              "Log search alert in KQL",
            ],
          ],
        },
        {
          kind: "p",
          text: "Starting fresh, take the first path. Microsoft recommends it, and its standard set of counters is collected at no cost. Take the second if your team already keeps VM data in a Log Analytics workspace, or would rather avoid a preview alert type.",
        },
        {
          kind: "p",
          text: "The first two paths use the same names on Windows and Linux. A Linux alert and a Windows one differ mainly in their mount names.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "callout",
          label: "Watch out",
          text: "On Linux, VM insights reports a data disk only when it’s formatted XFS, ext2, ext3 or ext4. Run the per-disk query from the log search steps once. A mount with no row there never alerts.",
        },
      ],
    },
    {
      id: "how-to-set-up-an-azure-monitor",
      title: "Set up a metric alert",
      blocks: [
        {
          kind: "p",
          text: "On the metrics path, the rule is a query-based metric alert written in PromQL (the Prometheus Query Language). It’s still in preview in November 2026.",
        },
        {
          kind: "h3",
          id: "turn-on-collection-and-check-the-data",
          title: "Turn on collection",
        },
        {
          kind: "ol",
          items: [
            [
              { b: "Turn on monitoring." },
              " Open the VM in the Azure portal and select Monitor. If enhanced monitoring is off, select Configure. Leave OpenTelemetry metrics selected, choose the Azure Monitor workspace, then select Review + Enable and Enable.",
            ],
            [
              { b: "Wait for the agent." },
              " Within a few minutes, Azure installs Azure Monitor Agent. It also gives the VM a system-assigned managed identity if it has none.",
            ],
            [
              { b: "Check the data." },
              " Run a PromQL query scoped to the Azure Monitor workspace. The query ",
              { code: '{"system.filesystem.usage", state="free"}' },
              " should return one series per mount point.",
            ],
          ],
        },
        { kind: "h3", id: "create-the-metric-alert-rule", title: "Create the metric rule" },
        {
          kind: "ol",
          items: [
            [
              { b: "Scope the rule." },
              " In Monitor, select Alerts, then Create and Alert rule. Scope it to the Azure Monitor workspace, so one rule covers every VM that sends metrics there. To scope it to a VM, resource group or subscription instead, first turn on resource-centric access for the workspace.",
            ],
            [
              { b: "Enter the query." },
              " For the signal, choose Custom PromQL query. This query returns each mount, on each VM, with less than 10% free, and leaves out tmpfs:",
            ],
          ],
        },
        {
          kind: "code",
          lang: "promql",
          code: 'sum by ("Microsoft.resourceid", mountpoint) ({"system.filesystem.usage", state="free", type!="tmpfs"})\n/\nsum by ("Microsoft.resourceid", mountpoint) ({"system.filesystem.usage", type!="tmpfs"})\n< 0.10',
        },
        {
          kind: "ol",
          start: 3,
          items: [
            [
              { b: "Set the timing." },
              " Under the alerting options, Check every sets how often the rule runs. Wait for sets how long the condition must hold before the alert fires, so a brief dip during a large write doesn’t page anyone.",
            ],
            [
              { b: "Add an identity and an action group." },
              " Give the rule a managed identity with the Monitoring Reader role on its scope. A user-assigned identity needs that role beforehand. A system-assigned one gets it automatically if you’re allowed to assign roles. Then add an action group to send an email.",
            ],
          ],
        },
        {
          kind: "callout",
          label: "For engineers",
          text: [
            "The rule’s query and its Wait for setting match a Prometheus alerting rule’s expression and ",
            { code: "for" },
            " clause.",
          ],
        },
        {
          kind: "ul",
          items: [
            "The metric splits each filesystem’s bytes into free, reserved and used. So the division gives the share of each filesystem still free.",
            "The comparison on the last line picks which mounts alert, so the threshold is static.",
            ["Wait for is stored as the rule’s ", { code: "for" }, " property, such as PT5M."],
            [
              "Keep the quotes around metric and label names with dots, such as ",
              { code: '"Microsoft.resourceid"' },
              " and ",
              { code: '"system.filesystem.usage"' },
              ".",
            ],
          ],
        },
      ],
    },
    {
      id: "set-an-azure-vm-alert-on-low",
      title: "Set up a log search alert",
      blocks: [
        {
          kind: "p",
          text: [
            "The logs path builds the same alert in KQL (the Kusto Query Language). It starts on the same Configure page: select the logs-based option and a Log Analytics workspace. VM insights then writes its counters to the ",
            { code: "InsightsMetrics" },
            " table, and you can’t change which ones it collects.",
          ],
        },
        { kind: "h3", id: "create-the-log-search-rule", title: "Create the log search rule" },
        {
          kind: "ol",
          items: [
            [
              { b: "Scope the rule." },
              " In Monitor, select Alerts, then Create and Alert rule. Scope it to the Log Analytics workspace, so one rule covers every machine that reports there.",
            ],
            [
              { b: "Enter the query." },
              " On the Condition tab, choose Custom log search and enter Microsoft’s per-disk query:",
            ],
          ],
        },
        {
          kind: "code",
          lang: "kusto",
          code: 'InsightsMetrics\n| where Origin == "vm.azm.ms"\n| where Namespace == "LogicalDisk" and Name == "FreeSpacePercentage"\n| extend Disk=tostring(todynamic(Tags)["vm.azm.ms/mountId"])\n| summarize LogicalDiskSpacePercentageFreeAverage = avg(Val) by bin(TimeGenerated, 15m), Computer, _ResourceId, Disk',
        },
        {
          kind: "ol",
          start: 3,
          items: [
            [
              { b: "Measure the average." },
              " Under Measurement, set Measure to ",
              { code: "LogicalDiskSpacePercentageFreeAverage" },
              " and Aggregation type to Average. Set Aggregation granularity to 15\u00a0minutes, to match the query’s bin.",
            ],
            [
              { b: "Split by machine and mount." },
              " Under Split by dimensions, leave Resource ID column at Don’t split. Add ",
              { code: "Computer" },
              " and ",
              { code: "Disk" },
              ", and select Include all future values. Each mount on each machine then raises its own alert, including machines added later.",
            ],
            [
              { b: "Set the threshold." },
              " Under Alert logic, choose a static threshold, the operator Less than and the value 10. Set Frequency of evaluation to 15\u00a0minutes to match the bin. It can be anything from one minute to one day.",
            ],
            [
              { b: "Add the action and auto-resolve." },
              " Add an action group on the Actions tab. On the Details tab, set the severity and select Automatically resolve alerts, so the alert closes once space comes back.",
            ],
          ],
        },
        { kind: "h3", id: "what-a-log-search-rule-costs", title: "What the rule costs" },
        {
          kind: "p",
          text: "A rule’s price depends on its type, its dimensions and how often it runs. Each Computer and Disk pair is its own time series, and Microsoft’s docs say each one “triggers its own alert and is charged separately.”",
        },
        {
          kind: "p",
          text: "A 1-minute frequency catches a fast fill sooner than a 15-minute one, so weigh that against the price. Read the Alert rules section of the Azure Monitor pricing page before one rule covers hundreds of VMs.",
        },
      ],
    },
    {
      id: "how-to-pick-a-disk-space-alert",
      title: "Pick a threshold",
      blocks: [
        {
          kind: "p",
          text: "A percentage treats every disk alike. One rule can page far too early on a large disk and too late on a small one.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "A 4\u00a0TiB disk holds 4 × 1,024 = 4,096\u00a0GiB, so 10% free on it is 409.6\u00a0GiB. On a 32\u00a0GiB disk, 10% free is 32 × 0.10 = 3.2\u00a0GiB.",
        },
        {
          kind: "p",
          text: "The same rule pages with 409.6 ÷ 3.2 = 128 times as much room left on the large disk. That’s more than the small disk’s whole 32\u00a0GiB.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: [
            "So pair the percentage with a floor in bytes. On the metrics path, that’s a second rule comparing ",
            { code: '{"system.filesystem.usage", state="free"}' },
            " with your floor, since that metric is already in bytes. On the logs path, it’s a second log search rule on ",
            { code: "Free Megabytes" },
            ", collected by a DCR you write.",
          ],
        },
        {
          kind: "p",
          text: "A fixed threshold also can’t see how fast a disk fills. A mount that took a month to get there and one that took an hour fire at the same level. The evaluation frequency then sets how long a fast fill runs before anyone hears about it.",
        },
        {
          kind: "h3",
          id: "what-to-do-when-the-alert-fires",
          title: "When the alert fires",
        },
        { kind: "p", text: "Find what grew before you add space:" },
        {
          kind: "ul",
          items: [
            [
              { a: "Azure VM disk usage", href: "/learn/azure-vm-disk-usage" },
              " covers the queries and commands that find it.",
            ],
            [
              { a: "df vs du", href: "/learn/glossary/df-vs-du" },
              " explains why two space checks on one mount can disagree.",
            ],
            [
              {
                a: "Expanding an Azure disk without downtime",
                href: "/learn/azure-disk-expand-without-downtime",
              },
              " covers growing the disk, its partition and its filesystem.",
            ],
            [
              "The ",
              { a: "Azure disk pricing calculator", href: "/ebs-and-azure-disk-pricing" },
              " shows what a larger disk costs a month.",
            ],
            [
              {
                a: "Can you shrink an Azure managed disk?",
                href: "/learn/shrink-azure-managed-disk",
              },
              " covers the way back down.",
            ],
          ],
        },
      ],
    },
    {
      id: "when-amoeba-adds-space-on-its-own",
      title: "How Amoeba adds space",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " by Zoorik optimizes block storage on Azure and AWS. It works on the data disks of running Windows and Linux VMs, and never touches the OS disk.",
          ],
        },
        {
          kind: "p",
          text: [
            "Amoeba moves a VM’s data disks onto one ",
            { a: "btrfs pool", href: "/learn/btrfs-multiple-disks" },
            " sized to your data, with room to grow. It copies your data while your services run. Then it switches each mount to the pool, with a short restart of the services that use it.",
          ],
        },
        { kind: "p", text: "After the move, Amoeba rightsizes the pool:" },
        {
          kind: "ul",
          items: [
            "It grows the pool before it fills, and sooner when data arrives fast. That covers the fill rate a fixed threshold can’t see.",
            "It grows the pool’s disks or adds new ones while the pool stays mounted.",
            "When your data goes down and stays down, it shrinks the pool one disk at a time.",
          ],
        },
        {
          kind: "p",
          text: "So you no longer size disks ahead for growth you expect, and you pay for close to what you use.",
        },
        {
          kind: "p",
          text: "Keep your alert as a backstop. Amoeba works on data disks only, so the OS disk still needs one. Amoeba also can’t grow a pool while its agent is disconnected, or after you remove Zoorik’s role.",
        },
        {
          kind: "p",
          text: "On a Linux VM, a logs-path alert can’t see the pool. The pool is btrfs, and VM insights reports data disks only on XFS and ext.",
        },
        {
          kind: "p",
          text: [
            "For Amoeba on Azure in full, see ",
            {
              a: "Azure managed disk cost optimization",
              href: "/azure-managed-disk-cost-optimization",
            },
            ".",
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
      title: "“Monitor virtual machines with Azure Monitor: Alerts”",
      url: "https://learn.microsoft.com/en-us/azure/azure-monitor/vm/monitor-virtual-machine-alerts",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Supported metrics - Microsoft.Compute/virtualMachines”",
      url: "https://learn.microsoft.com/en-us/azure/azure-monitor/reference/supported-metrics/microsoft-compute-virtualmachines-metrics",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Enable enhanced monitoring for an Azure virtual machine”",
      url: "https://learn.microsoft.com/en-us/azure/azure-monitor/vm/tutorial-enable-monitoring",
    },
    {
      publisher: "Microsoft Learn",
      title: "“OpenTelemetry Guest OS Metrics reference”",
      url: "https://learn.microsoft.com/en-us/azure/azure-monitor/vm/metrics-guest-reference",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Analyze the health and status of your virtual machine with Azure Monitor”",
      url: "https://learn.microsoft.com/en-us/azure/azure-monitor/vm/vminsights-performance",
    },
    {
      publisher: "Microsoft Learn",
      title: "“PromQL for system metrics and Guest OS performance counters”",
      url: "https://learn.microsoft.com/en-us/azure/azure-monitor/metrics/prometheus-system-metrics-best-practices",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Create Query-Based Metric Alerts (Preview)”",
      url: "https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-create-query-based-metric-alerts",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Create Azure Monitor log search alert rules”",
      url: "https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-create-log-alert-rule",
    },
  ],
  related: [
    {
      title: "How to check Azure VM disk usage",
      where: "Learn",
      href: "/learn/azure-vm-disk-usage",
    },
    {
      title: "Expand an Azure disk without downtime",
      where: "Learn",
      href: "/learn/azure-disk-expand-without-downtime",
    },
    {
      title: "Can you shrink an Azure managed disk?",
      where: "Learn",
      href: "/learn/shrink-azure-managed-disk",
    },
    {
      title: "btrfs on multiple disks: single or RAID 1",
      where: "Learn",
      href: "/learn/btrfs-multiple-disks",
    },
  ],
};
