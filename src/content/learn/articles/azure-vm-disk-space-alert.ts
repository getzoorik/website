import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/azure-vm-disk-space-alert/1";
import { figure as figure2 } from "@/features/learn/figures/azure-vm-disk-space-alert/2";

export const article: Article = {
  slug: "azure-vm-disk-space-alert",
  title: "Azure VM disk space alert in Azure Monitor",
  meta: "An Azure VM disk space alert needs data from inside the guest, since host metrics have no free-space metric. Two ways to collect it and alert per mount.",
  h1: "Azure VM disk space alert: how to set one up in Azure Monitor",
  deck: "Host metrics can’t see free space. Collect it from the guest, then alert on each mount with a metric or log rule.",
  card: "Why Azure has no free-space metric for a VM, and two ways to alert on low disk space in Azure Monitor.",
  product: "amoeba",
  hub: "Block storage",
  topic: "Azure block storage",
  published: "2026-11-01",
  updated: "2026-11-01",
  author: "rupeshankar",
  cover: "/learn-covers/zoorik-learn-azure-vm-disk-space-alert-1200x630.webp",
  coverAlt:
    "Azure VM disk space alert: a reading from inside the VM fires the alert, while host metrics can’t see it",
  short: [
    "An Azure VM disk space alert needs data that Azure Monitor Agent collects inside the VM, because host metrics never report free space. Turn on enhanced monitoring, then alert on ",
    { code: "system.filesystem.usage" },
    " in a query-based metric alert (preview) or ",
    { code: "FreeSpacePercentage" },
    " in a log search alert.",
  ],
  sections: [
    {
      id: "azure-vm-disk-space-alert",
      title: "Azure VM disk space alert: host metrics can’t see free space",
      blocks: [
        {
          kind: "p",
          text: [
            "Picture a 32\u00a0GiB data disk mounted at ",
            { code: "/data" },
            " on a VM. Azure Monitor collects host metrics for every VM without setup, but none of them says how much of those 32\u00a0GiB is still free.",
          ],
        },
        {
          kind: "p",
          text: [
            "Microsoft’s guide to VM alerts adds that virtual machines have no preconfigured alert rules. The recommended rules Azure can add when you turn on monitoring use host metrics, unless OpenTelemetry metrics are on. Until an alert rule reads data collected inside the guest, nothing warns you as ",
            { code: "/data" },
            " fills.",
          ],
        },
        {
          kind: "p",
          text: "The host metrics for disks report IOPS, throughput and latency, but never free space. The disk metrics include these, each split by LUN (the disk’s logical unit number):",
        },
        {
          kind: "ul",
          items: [
            "Data Disk IOPS Consumed Percentage",
            "Data Disk Latency",
            "Data Disk Queue Depth",
            "bytes and operations per second",
          ],
        },
        {
          kind: "p",
          text: [
            "Data Disk Used Burst IO Credits Percentage and Data Disk Used Burst BPS Credits Percentage sound closer than they are. Both count burst credits, not space. Nothing in Microsoft’s metric list for ",
            { code: "Microsoft.Compute/virtualMachines" },
            " reports how full a filesystem is.",
          ],
        },
        {
          kind: "p",
          text: [
            "A ",
            { a: "managed disk", href: "/learn/glossary/azure-managed-disk" },
            " is a block device, and Azure sees blocks being read and written. The filesystem that decides which blocks hold data runs in your guest operating system. Free space is a filesystem fact, so Azure VM disk space monitoring starts with an agent in the guest.",
          ],
        },
      ],
    },
    {
      id: "azure-monitor-agent-collects-free-space-under",
      title: "Azure Monitor Agent collects free space, under a different name per path",
      blocks: [
        {
          kind: "p",
          text: "Azure Monitor Agent collects the data on Windows and Linux, and it’s the only agent this guide uses. It takes its instructions from a data collection rule (DCR). By default it samples performance counters every 60\u00a0seconds.",
        },
        {
          kind: "p",
          text: "Each path names the free-space signal differently, which is why answers disagree about the counter:",
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
              "OpenTelemetry metrics, Microsoft’s recommended experience",
              "Azure Monitor workspace",
              [
                { code: "system.filesystem.usage" },
                " in bytes, with ",
                { code: "state" },
                " free, reserved or used, per ",
                { code: "mountpoint" },
              ],
              "Query-based metric alert in PromQL, the Prometheus Query Language (preview)",
            ],
            [
              "VM insights, logs-based (classic)",
              ["Log Analytics workspace, ", { code: "InsightsMetrics" }, " table"],
              ["Namespace ", { code: "LogicalDisk" }, ", name ", { code: "FreeSpacePercentage" }],
              "Log search alert in KQL, the Kusto Query Language",
            ],
            [
              "A DCR you write",
              ["Log Analytics workspace, ", { code: "Perf" }, " table"],
              [
                "Linux: ",
                { code: "Logical Disk(*)\\% Free Space" },
                ", and ",
                { code: "Free Megabytes" },
                " from the same object. Windows: ",
                { code: "% Free Space" },
                " and ",
                { code: "Free Megabytes" },
                " in the ",
                { code: "LogicalDisk" },
                " object, read per volume instance, since ",
                { code: "_Total" },
                " covers all volumes together",
              ],
              "Log search alert in KQL",
            ],
          ],
        },
        {
          kind: "p",
          text: "Starting fresh, take the first path. Microsoft recommends it, and its standard set of counters is collected at no cost.",
        },
        {
          kind: "p",
          text: "Take the second path when your team already keeps VM data in a Log Analytics workspace. It also fits when you’d rather not depend on a preview alert type.",
        },
        {
          kind: "p",
          text: "Both paths use the same names on Windows and Linux. So an Azure Linux VM disk space alert and a Windows one differ mainly in their mount names.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "callout",
          label: "Watch out",
          text: "On Linux, VM insights reports a data disk only when it’s formatted XFS or ext2, ext3 or ext4. Run the logs path’s per-disk query once, since a mount with no row there never alerts as it fills.",
        },
      ],
    },
    {
      id: "how-to-set-up-an-azure-monitor",
      title: "How to set up an Azure Monitor VM disk space alert on metrics",
      blocks: [
        {
          kind: "p",
          text: "On the metrics path, the agent sends each mount’s usage in bytes to an Azure Monitor workspace. The rule is a query-based metric alert, in preview in October 2026.",
        },
        {
          kind: "h3",
          id: "turn-on-collection-and-check-the-data",
          title: "Turn on collection and check the data",
        },
        {
          kind: "ol",
          items: [
            [
              { b: "Turn on collection." },
              " Open the VM in the Azure portal and select Monitor. If enhanced monitoring isn’t on yet, select Configure. Leave OpenTelemetry metrics selected, keep or choose the Azure Monitor workspace, then select Review + Enable and Enable.",
            ],
            [
              { b: "Wait for the agent." },
              " Within a few minutes, Azure installs Azure Monitor Agent. It also gives the VM a system-assigned managed identity if it has none.",
            ],
            [
              { b: "Check the data." },
              " Run a PromQL query scoped to the Azure Monitor workspace. The query ",
              { code: '{"system.filesystem.usage", state="free"}' },
              " should return a series for each mount point.",
            ],
          ],
        },
        { kind: "h3", id: "create-the-metric-alert-rule", title: "Create the metric alert rule" },
        {
          kind: "ol",
          items: [
            [
              { b: "Scope the rule." },
              " In Monitor, select Alerts, then Create and Alert rule. Scope it to the Azure Monitor workspace, so one rule covers every VM that sends metrics there. A rule scoped to a VM, resource group or subscription also works, but only after the workspace has resource-centric access turned on.",
            ],
            [
              { b: "Enter the query." },
              " For the signal, choose Custom PromQL query and enter this query. It returns each mount, on each VM, that has less than 10% free, and it leaves out tmpfs:",
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
              " Under the alerting options, Check every sets how often the rule runs. Wait for sets how long the condition must hold before the alert fires. That way, a brief dip during a large write doesn’t page anyone.",
            ],
            [
              { b: "Add an identity and an action group." },
              " Give the rule a user-assigned managed identity, created beforehand with the Monitoring Reader role on the rule’s scope. Add an action group to send the email.",
            ],
          ],
        },
        {
          kind: "callout",
          label: "For engineers",
          text: "A query-based rule’s query works like the expression of a Prometheus alerting rule.",
        },
        {
          kind: "ul",
          items: [
            "The metric splits each filesystem’s bytes by state: free, reserved and used. So the query’s division gives the share of each filesystem that’s still free.",
            "The comparison on the query’s last line decides which mounts alert, so the condition stays a static threshold.",
            ["The Wait for setting is the rule’s ", { code: "for" }, " property, such as PT5M."],
            [
              "Keep the quotes around metric and label names that contain dots, such as ",
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
      title: "Set an Azure VM alert on low disk space with a log search rule",
      blocks: [
        {
          kind: "p",
          text: [
            "The logs path builds the same Azure Monitor disk space alert from KQL instead of PromQL. Setup starts on the same Configure page: select the logs-based option and a Log Analytics workspace. VM insights then writes its counters to the ",
            { code: "InsightsMetrics" },
            " table, and you can’t change which ones it collects.",
          ],
        },
        { kind: "h3", id: "create-the-log-search-rule", title: "Create the log search rule" },
        {
          kind: "ol",
          items: [
            [
              { b: "Create the rule." },
              " In Monitor, select Alerts, then Create and Alert rule. Set the scope to the Log Analytics workspace, so one rule covers every machine that reports to it.",
            ],
            [
              { b: "Enter the query." },
              " On the Condition tab, choose Custom log search and use Microsoft’s per-disk query:",
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
              " Under Alert logic, use a static threshold, an operator of less than, and a value of 10. Set Frequency of evaluation to 15\u00a0minutes to match the query’s bin. It can be anything from one minute to one day.",
            ],
            [
              { b: "Add the action and auto-resolve." },
              " Add an action group on the Actions tab. On the Details tab, set the severity and select Automatically resolve alerts. The alert then closes once space comes back.",
            ],
          ],
        },
        { kind: "h3", id: "what-a-log-search-rule-costs", title: "What a log search rule costs" },
        {
          kind: "p",
          text: "The rule’s price depends on its type, its dimensions and how often it runs. Each Computer and Disk pair is its own time series. Microsoft’s docs say each one “triggers its own alert and is charged separately.”",
        },
        {
          kind: "p",
          text: "A 1-minute frequency sees a fast fill sooner than a 15-minute one, so weigh that against the price. Read the Alert rules section of the Azure Monitor pricing page before one rule spreads across hundreds of VMs.",
        },
      ],
    },
    {
      id: "how-to-pick-a-disk-space-alert",
      title: "How to pick a disk space alert threshold",
      blocks: [
        {
          kind: "p",
          text: "A percentage treats every disk alike, so one rule can page far too early on a large disk and too late on a small one.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "A 4\u00a0TiB disk holds 4 × 1,024 = 4,096\u00a0GiB, so 10% free on it is 409.6\u00a0GiB. On the opening’s 32\u00a0GiB disk, 10% free is 32 × 0.10 = 3.2\u00a0GiB.",
        },
        {
          kind: "p",
          text: "The same rule pages with 409.6 ÷ 3.2 = 128 times as much room left on the large disk. That’s more than the small disk’s whole 32\u00a0GiB.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: [
            "Pair the percentage with a floor in bytes. On the metrics path, that’s a second rule comparing ",
            { code: '{"system.filesystem.usage", state="free"}' },
            " with your floor, since that metric is already in bytes. On the logs path, it’s a second log search rule on ",
            { code: "Free Megabytes" },
            ", collected by a DCR you write.",
          ],
        },
        {
          kind: "p",
          text: "A fixed threshold also can’t tell how fast a disk is filling. Whether the mount took a month or an hour to get there, the rule fires at the same level. Evaluation frequency then sets how long a fast fill runs before anyone hears about it.",
        },
        {
          kind: "h3",
          id: "what-to-do-when-the-alert-fires",
          title: "What to do when the alert fires",
        },
        { kind: "p", text: "Find what grew before you add space. Each step has its own page:" },
        {
          kind: "ul",
          items: [
            [
              { a: "Checking Azure VM disk usage", href: "/learn/azure-vm-disk-usage" },
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
              " shows what a larger disk would cost a month.",
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
      title: "When Amoeba adds space on its own",
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
          text: "So the disks no longer need to be sized ahead for growth you expect, and you pay for close to what you use.",
        },
        {
          kind: "p",
          text: "Keep your alert as a backstop. Amoeba works on data disks only, so the OS disk still needs one.",
        },
        {
          kind: "p",
          text: "On a Linux VM, a logs-path backstop can’t see the pool. The pool is btrfs, and VM insights reports data disks only on XFS and ext. Amoeba also can’t grow a pool while its agent is disconnected, or after you remove Zoorik’s role.",
        },
        {
          kind: "p",
          text: "On Linux, the VM needs a recent kernel with btrfs. Every service that keeps a data mount open must run under systemd. The VM also needs a few free disk slots for the pool.",
        },
        {
          kind: "p",
          text: [
            "The page on ",
            {
              a: "Azure managed disk cost optimization",
              href: "/azure-managed-disk-cost-optimization",
            },
            " covers Amoeba on Azure in full.",
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
      title: "Azure VM disk usage: how to check used vs provisioned space",
      where: "Learn",
      href: "/learn/azure-vm-disk-usage",
    },
    {
      title: "How to expand an Azure disk without downtime",
      where: "Learn",
      href: "/learn/azure-disk-expand-without-downtime",
    },
    {
      title: "Can you shrink an Azure managed disk?",
      where: "Learn",
      href: "/learn/shrink-azure-managed-disk",
    },
    {
      title: "btrfs on multiple disks: how a btrfs pool works",
      where: "Learn",
      href: "/learn/btrfs-multiple-disks",
    },
  ],
};
