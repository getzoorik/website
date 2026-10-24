import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/azure-vm-disk-space-alert/1";

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
  published: "2026-11-14",
  updated: "2026-11-14",
  author: "rupeshankar",
  short: [
    "An Azure VM disk space alert needs data from inside the VM, because Azure’s host metrics for a virtual machine report disk IOPS, throughput and latency but never free space. Turn on enhanced monitoring so Azure Monitor Agent collects filesystem usage from the guest operating system, then alert on it: a query-based metric alert on ",
    { code: "system.filesystem.usage" },
    " (in preview), or a log search alert on VM insights’ ",
    { code: "FreeSpacePercentage" },
    ".",
  ],
  sections: [
    {
      id: "why-azure-cant-see-free-space-from",
      title: "Why Azure can’t see free space from outside the VM",
      blocks: [
        {
          kind: "p",
          text: [
            "Azure Monitor collects host metrics for every VM without any setup, and the disk metrics among them describe traffic: Data Disk IOPS Consumed Percentage, Data Disk Latency, Data Disk Queue Depth, and bytes and operations per second, each split by LUN (the disk’s logical unit number). Two names sound closer than they are. Data Disk Used Burst IO Credits Percentage and Data Disk Used Burst BPS Credits Percentage count burst credits, not space. Nothing in Microsoft’s metric list for ",
            { code: "Microsoft.Compute/virtualMachines" },
            " reports how full a filesystem is.",
          ],
        },
        {
          kind: "p",
          text: "The reason is where that number lives. A managed disk is a block device. Azure sees blocks being read and written, while the filesystem that decides which blocks hold data runs in your guest operating system. Free space is a filesystem fact, so it has to be read from inside the VM.",
        },
        {
          kind: "p",
          text: "Microsoft’s guide to VM alerts says virtual machines have no preconfigured alert rules, so you create your own from data that Azure Monitor Agent collects. The recommended rules Azure can add when you turn on monitoring use host metrics unless OpenTelemetry metrics are on, and host metrics can’t see free space. Azure VM disk space monitoring starts with an agent in the guest.",
        },
      ],
    },
    {
      id: "which-agent-and-which-counter-to-use",
      title: "Which agent and which counter to use",
      blocks: [
        {
          kind: "p",
          text: "Azure Monitor Agent collects the data on Windows and Linux, and it’s the only agent this guide uses. Its instructions come from a data collection rule (DCR), and by default it samples performance counters every 60\u00a0seconds.",
        },
        {
          kind: "p",
          text: "The free-space signal has a different name depending on where the agent sends it, which is why answers disagree about the counter:",
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
                ", ",
                { code: "Logical Disk(*)\\Free Megabytes" },
                ". Windows: ",
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
          text: "Starting fresh, take the first path: Microsoft recommends it, and its standard set of counters is collected at no cost. Take the second when your team already keeps VM data in a Log Analytics workspace, or when you’d rather not depend on a preview alert type. Both paths use the same names on Windows and Linux, so an Azure Linux VM disk space alert and a Windows one differ mainly in their mount names. The logs path has one Linux limit: VM insights reports a data disk only when it’s formatted XFS or ext2, ext3 or ext4.",
        },
        { kind: "diagram", figure: figure1 },
      ],
    },
    {
      id: "how-to-set-up-an-azure-monitor",
      title: "How to set up an Azure Monitor VM disk space alert on metrics",
      blocks: [
        {
          kind: "p",
          text: "An Azure Monitor VM disk space alert on the metrics path takes three steps: turn on collection, check the data, then write the rule.",
        },
        {
          kind: "ol",
          items: [
            "Open the VM in the Azure portal and select Monitor. If enhanced monitoring isn’t on yet, select Configure. Leave OpenTelemetry metrics selected, keep or choose the Azure Monitor workspace, then select Review + Enable and Enable. Within a few minutes Azure installs Azure Monitor Agent and gives the VM a system-assigned managed identity if it has none.",
            [
              "Check the data with a PromQL query scoped to the Azure Monitor workspace. ",
              { code: '{"system.filesystem.usage", state="free"}' },
              " should return a series for each mount point.",
            ],
            "In Monitor, select Alerts, then Create and Alert rule. Scope the rule to the Azure Monitor workspace, so one rule covers every VM that sends metrics there. A rule scoped to a VM, resource group or subscription also works, but only after the workspace has resource-centric access turned on. For the signal, choose Custom PromQL query and enter this query. It returns each mount, on each VM, that has less than 10% free, and it leaves out tmpfs:",
          ],
        },
        {
          kind: "code",
          lang: "promql",
          code: 'sum by ("Microsoft.resourceid", mountpoint) ({"system.filesystem.usage", state="free", type!="tmpfs"})\n/\nsum by ("Microsoft.resourceid", mountpoint) ({"system.filesystem.usage", type!="tmpfs"})\n< 0.10',
        },
        {
          kind: "p",
          text: [
            "The metric breaks each filesystem’s bytes down by state (free, reserved and used), so the division gives the share of each filesystem that’s still free. The comparison on the last line is the threshold: a query-based rule’s query works like the expression of a Prometheus alerting rule, so the query itself decides which mounts alert, and the condition stays a static threshold. Keep the quotes around names that contain dots, such as ",
            { code: '"Microsoft.resourceid"' },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "Under the alerting options, Check every sets how often the rule runs. Wait for sets how long the condition must hold before the alert fires (the rule’s ",
            { code: "for" },
            " property, such as PT5M), so a brief dip during a large write doesn’t page anyone. Give the rule a user-assigned managed identity, created beforehand with the Monitoring Reader role on the rule’s scope. Add an action group to send the email. Query-based metric alerts are in preview in October 2026.",
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
            "The logs path builds the same Azure Monitor disk space alert from KQL instead of PromQL. To start it, select the logs-based option and a Log Analytics workspace on the same Configure page, and VM insights writes its counters to the ",
            { code: "InsightsMetrics" },
            " table. You can’t change which ones it collects.",
          ],
        },
        {
          kind: "ol",
          items: [
            "In Monitor, select Alerts, then Create and Alert rule. Set the scope to the Log Analytics workspace, so one rule covers every machine that reports to it.",
            "On the Condition tab, choose Custom log search and use Microsoft’s per-disk query:",
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
              "Under Measurement, set Measure to ",
              { code: "LogicalDiskSpacePercentageFreeAverage" },
              ", Aggregation type to Average and Aggregation granularity to 15\u00a0minutes, to match the query’s bin.",
            ],
            [
              "Under Split by dimensions, leave Resource ID column at Don’t split, add ",
              { code: "Computer" },
              " and ",
              { code: "Disk" },
              ", and select Include all future values. Each mount on each machine then raises its own alert, including machines added later.",
            ],
            "Under Alert logic, use a static threshold, an operator of less than, and a value of 10. Set Frequency of evaluation to 15\u00a0minutes to match the query’s bin. It can be anything from one minute to one day.",
            "Add an action group on the Actions tab. On the Details tab, set the severity and select Automatically resolve alerts, so the alert closes once space comes back.",
          ],
        },
        {
          kind: "p",
          text: "The rule’s price depends on its type, its dimensions and how often it runs. Each Computer and Disk pair is its own time series, and Microsoft’s docs say each one “triggers its own alert and is charged separately.” A 1-minute frequency sees a fast fill sooner than a 15-minute one, so weigh that against the price. Read the Alert rules section of the Azure Monitor pricing page before one rule spreads across hundreds of VMs.",
        },
      ],
    },
    {
      id: "how-to-pick-a-threshold-for-an",
      title: "How to pick a threshold for an Azure VM disk space alert",
      blocks: [
        {
          kind: "p",
          text: [
            "A percentage treats every disk alike. Ten percent free is about 410\u00a0GiB on a 4\u00a0TiB disk and 3.2\u00a0GiB on a 32\u00a0GiB one, so one rule can page far too early on the large disk and too late on the small one. Pair the percentage with a floor in bytes. On the metrics path that’s a second rule whose query compares ",
            { code: '{"system.filesystem.usage", state="free"}' },
            ", which is already in bytes, with your floor. On the logs path it’s a second log search rule on ",
            { code: "Free Megabytes" },
            ", collected by a DCR you write.",
          ],
        },
        {
          kind: "p",
          text: "A fixed threshold also can’t tell how fast a disk is filling. The rule fires at the same level whether the mount took a month or an hour to get there, and the evaluation frequency sets how long a fast fill runs before anyone hears about it.",
        },
        {
          kind: "p",
          text: [
            "When the alert fires, find what grew before you add space. ",
            { a: "Checking Azure VM disk usage", href: "/learn/azure-vm-disk-usage" },
            " covers the queries and commands for that. ",
            {
              a: "Expanding an Azure disk without downtime",
              href: "/learn/azure-disk-expand-without-downtime",
            },
            " covers growing the disk, its partition and its filesystem, and ",
            {
              a: "Can you shrink an Azure managed disk?",
              href: "/learn/shrink-azure-managed-disk",
            },
            " covers the way back down.",
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
            " by Zoorik changes the job for data disks. It moves a VM’s data mounts onto one pool, a single ",
            {
              a: "btrfs filesystem across two or more managed disks",
              href: "/learn/btrfs-multiple-disks",
            },
            ". Amoeba sizes the pool from the highest use of the last 7\u00a0days, so the pool sits inside its target band with room for the largest recent 15-minute rise and at least 10\u00a0GiB free. From then on it rightsizes the pool: it grows as the data grows, and disks come out as the data shrinks. The agent reports each mount’s size and use every 15\u00a0seconds, Amoeba decides on every report, and it expands a pool:",
          ],
        },
        {
          kind: "ul",
          items: [
            "When the lowest use over the last 30\u00a0minutes is above the top edge of the pool’s target band, which is 80% to 90% full by default.",
            "At once, when free space falls below the safety floor: 5% of the pool or 10\u00a0GiB, whichever is larger.",
            "At once, when the pool would reach that floor within 30\u00a0minutes at the fill rate of the last 10\u00a0minutes.",
          ],
        },
        {
          kind: "p",
          text: "Together they cover the floor in GiB and the fill rate that a fixed percentage misses. A normal expand brings the pool back to the middle of its band. An urgent one adds about one hour of fill, at least 10% of the pool, and twice that if the pool needed another expand within the last hour. On Azure, a normal expand grows the pool’s disks first and an urgent one adds a disk first, while the pool stays mounted. Expands run on their own, whether shrinks are set to “Auto” or “Manual”. Because the pool grows as the data grows, the disks no longer need to be sized ahead for growth you expect.",
        },
        {
          kind: "p",
          text: "Keep your alert as a backstop. Amoeba works on data disks only, so the OS disk still needs one. On a Linux VM, a logs-path backstop can’t see the pool, because the pool is btrfs and VM insights reports data disks only on XFS and ext. A pool can’t expand while its agent is disconnected or after you remove Zoorik’s role, and while a move is paused after the switch, only the urgent safety expand runs. Amoeba works on Windows and Linux VMs. On Linux, it needs systemd, kernel 5.14 or later, and btrfs loaded or loadable. Every process that keeps a data mount open must run as a systemd service, because the agent stops those services at the switch onto the pool and starts them again. The VM also needs 3 free data-disk slots: 2 for the pool and 1 kept free for an urgent expand. VMs in the Red Hat family are not moved.",
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
