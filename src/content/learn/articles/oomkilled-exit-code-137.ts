import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/oomkilled-exit-code-137/1";
import { figure as figure2 } from "@/features/learn/figures/oomkilled-exit-code-137/2";

export const article: Article = {
  slug: "oomkilled-exit-code-137",
  title: "OOMKilled exit code 137 in Kubernetes: how to fix",
  meta: "OOMKilled exit code 137 means the OOM killer stopped your container with SIGKILL. Confirm it with kubectl, tell it from pod eviction, and fix it on AKS and EKS.",
  h1: "OOMKilled exit code 137: why Kubernetes kills a container",
  deck: "What 137 means, how to tell an OOM kill from the other kills, and how to size memory so it stops.",
  card: "Read the Reason field, tell an OOM kill from eviction and probe kills, then fix the memory or the leak.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes cost basics",
  published: "2026-11-01",
  updated: "2026-11-01",
  author: "prashant",
  cover: "/learn-covers/zoorik-learn-oomkilled-exit-code-137-1200x630.webp",
  coverAlt:
    "OOMKilled, exit code 137: memory climbs to the memory limit, then SIGKILL stops the container with exit 137",
  short: [
    "OOMKilled exit code 137 means the kernel’s out-of-memory (OOM) killer sent SIGKILL because a container passed its memory limit or the node ran out. The code alone only proves SIGKILL, so confirm OOMKilled with ",
    { code: "kubectl describe pod" },
    ", then raise the limit or, if memory keeps climbing, find the leak.",
  ],
  sections: [
    {
      id: "oomkilled-exit-code-137",
      title: "How to confirm OOMKilled exit code 137 with kubectl",
      blocks: [
        {
          kind: "p",
          text: "Picture a pod whose container has restarted five times. Nothing in its log says why.",
        },
        {
          kind: "p",
          text: "After each kill, the kubelet restarts the container under the pod’s restartPolicy. It waits 10\u00a0seconds by default, then 20, then 40, up to a cap of 5\u00a0minutes.",
        },
        {
          kind: "p",
          text: "A container that keeps getting killed shows CrashLoopBackOff. One that runs for 10\u00a0minutes without trouble resets that back-off.",
        },
        { kind: "p", text: "Start with the pod list:" },
        { kind: "code", lang: "bash", code: "kubectl get pods -n <namespace>" },
        {
          kind: "p",
          text: "The STATUS column can read OOMKilled just after a kill, then CrashLoopBackOff while the kubelet waits. So read the record of the last run:",
        },
        { kind: "code", lang: "bash", code: "kubectl describe pod <pod-name> -n <namespace>" },
        {
          kind: "p",
          text: "Every OOMKilled Kubernetes container leaves the same record under its name. Here is the Kubernetes documentation’s example, trimmed:",
        },
        {
          kind: "code",
          lang: "text",
          code: "    Limits:\n      cpu:          100m\n      memory:       50Mi\n    State:          Running\n    Last State:     Terminated\n      Reason:       OOMKilled\n      Exit Code:    137\n    Ready:          False\n    Restart Count:  5",
        },
        { kind: "p", text: "Read it from the top:" },
        {
          kind: "ul",
          items: [
            "State is the current run, and Last State records the run that ended.",
            [
              { code: "Reason: OOMKilled" },
              " with ",
              { code: "Exit Code: 137" },
              " confirms that the kernel’s OOM killer ended it.",
            ],
            "Limits shows the container’s limit, 50Mi here.",
            "In a pod with several containers, check which one carries the record. A sidecar can be the one running out.",
          ],
        },
        {
          kind: "p",
          text: "Two more commands help: the killed run’s log, and the namespace’s events in time order.",
        },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl logs <pod-name> -n <namespace> --previous\nkubectl get events -n <namespace> --sort-by=.lastTimestamp",
        },
      ],
    },
    {
      id: "what-is-oomkilled-in-kubernetes",
      title: "What is OOMKilled in Kubernetes?",
      blocks: [
        {
          kind: "p",
          text: "An OOM kill gives the application no chance to clean up or to log why it stopped. The kill is SIGKILL (signal 9), which a process can’t catch, block or ignore. Exit code 137 means a container received it.",
        },
        {
          kind: "p",
          text: "A memory limit is a ceiling the kernel enforces. On Linux nodes, the container runtime writes each container’s limits into kernel cgroups. When a container tries to allocate beyond its limit, the OOM subsystem steps in.",
        },
        {
          kind: "p",
          text: "The Kubernetes documentation calls memory limits “enforced reactively”. The kernel acts when it detects memory pressure, so a container that goes over its limit may not be killed at once.",
        },
        {
          kind: "p",
          text: [
            "OOM kills are scoped to one container, not the whole pod. On nodes that use cgroup v2, the kubelet sets ",
            { code: "memory.oom.group" },
            " on each container’s cgroup. One OOM event then kills every process in that container together.",
          ],
        },
        {
          kind: "callout",
          label: "For engineers",
          text: [
            "On cgroup v1\u00a0nodes, or with the kubelet setting ",
            { code: "singleProcessOOMKill: true" },
            ", the kernel may kill a single process instead. If that is the container’s main process (PID 1), the container ends, and otherwise it can keep running without it.",
          ],
        },
        {
          kind: "p",
          text: "Kubernetes 1.35 and later don’t start the kubelet on a cgroup v1\u00a0node by default. So with default settings, expect the whole container to go.",
        },
      ],
    },
    {
      id: "kubernetes-exit-code-137-has-more-than",
      title: "Kubernetes exit code 137 has more than one cause",
      blocks: [
        {
          kind: "p",
          text: "Microsoft’s guide to memory saturation on AKS states the rule: “Exit code 137 indicates that a container received a SIGKILL signal, but this code can have more than one cause.”",
        },
        { kind: "p", text: "The Reason field tells the causes apart." },
        {
          kind: "table",
          columns: [
            { label: "What the pod shows", width: "24%" },
            { label: "What sent the kill", width: "44%" },
            { label: "Look next at", width: "32%" },
          ],
          rows: [
            [
              "Last State: Terminated, Reason: OOMKilled, Exit Code: 137",
              "The kernel, because the container went past its memory limit or the node ran out of memory first",
              "The container’s memory use against its limit, and the node’s memory",
            ],
            [
              "Last State: Terminated, Reason: Error, Exit Code: 137",
              "Another SIGKILL, for example after a failed liveness probe, or when the app outlasted its grace period on a deletion",
              "The pod’s events, its probes, and how long the app takes to stop",
            ],
            [
              "Pod status Failed, reason Evicted",
              "The kubelet, because the node ran short of memory",
              "The node’s memory, and the pod’s use against its request",
            ],
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "An app that ignores SIGTERM, or needs longer than its grace period to stop, gets SIGKILL on every rollout. More memory changes nothing.",
        },
        {
          kind: "p",
          text: [
            "When a pod is deleted, the kubelet asks the runtime to send SIGTERM to the main process of each container. It then waits, 30\u00a0seconds by default (",
            { code: "terminationGracePeriodSeconds" },
            "). Once that time is up, the KILL signal goes to any processes still running.",
          ],
        },
      ],
    },
    {
      id: "why-a-container-can-be-killed-below",
      title: "Why a container can be killed below its memory limit",
      blocks: [
        {
          kind: "p",
          text: "A container can also be killed under its own limit when the node fills up around it.",
        },
        {
          kind: "p",
          text: [
            "The ",
            { a: "request", href: "/learn/glossary/kubernetes-resource-requests" },
            " is mainly used to schedule the pod. The kubelet reserves at least that much for the container, while the ",
            { a: "limit", href: "/learn/glossary/kubernetes-resource-limits" },
            " is the kill point. A container that uses more than its request, on a node that runs short of memory, is likely to see its pod evicted.",
          ],
        },
        {
          kind: "h3",
          id: "when-the-kubelet-evicts-the-pod",
          title: "Pod evicted: when the kubelet acts on node memory pressure",
        },
        {
          kind: "p",
          text: [
            "Eviction works on the whole pod. The kubelet watches the node’s available memory and acts when it falls below ",
            {
              a: "its hard eviction threshold",
              href: "/learn/kubernetes-allocatable-vs-capacity",
            },
            ". Its built-in default is ",
            { code: "memory.available<100Mi" },
            " on Linux nodes, and its configuration can set another.",
          ],
        },
        {
          kind: "p",
          text: [
            "Below the threshold, the kubelet sets chosen pods to Failed and terminates them. Here it doesn’t respect ",
            {
              a: "PodDisruptionBudgets (PDBs)",
              href: "/learn/pod-disruption-budget-best-practices",
            },
            ", and under a hard threshold it gives no grace period. If a Deployment or StatefulSet manages the pod, a replacement is created.",
          ],
        },
        { kind: "p", text: "The kubelet ranks pods for eviction by three tests, in this order:" },
        {
          kind: "ul",
          items: [
            "whether their use exceeds their requests",
            "their Priority",
            "how far over their requests they are",
          ],
        },
        {
          kind: "h3",
          id: "when-the-kernels-oom-killer-picks-a",
          title: "When the kernel’s OOM killer picks a container",
        },
        {
          kind: "p",
          text: "A fast spike can beat the kubelet. It polls memory statistics at an interval, so it can miss the pressure. Then the kernel’s OOM killer picks a container itself.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: [
            "Each container gets an OOM score from its share of the node’s memory, plus an adjustment per ",
            { a: "Quality of Service (QoS) class", href: "/learn/glossary/kubernetes-qos-class" },
            ". The kubelet sets that adjustment, and the OOM killer ends the highest score first.",
          ],
        },
        {
          kind: "table",
          columns: [
            { label: "QoS class", width: "14%" },
            { label: "When a pod gets it", width: "65%" },
            { label: "oom_score_adj", width: "21%" },
          ],
          rows: [
            [
              "Guaranteed",
              "Every container sets CPU and memory requests and limits, each request equal to its limit",
              "-997",
            ],
            [
              "Burstable",
              "Anything between the other two",
              "Between 2 and 999, smaller for a larger memory request",
            ],
            ["BestEffort", "No container sets a CPU or memory request or limit", "1000"],
          ],
        },
        {
          kind: "p",
          text: "The Kubernetes documentation sums up the effect: containers in low-QoS pods that use a lot of memory compared with their requests go first.",
        },
      ],
    },
    {
      id: "how-to-fix-oomkilled-in-kubernetes",
      title: "How to fix OOMKilled in Kubernetes",
      blocks: [
        { kind: "p", text: "The Reason field, then the memory curve, decides the fix." },
        { kind: "svg", figure: figure2 },
        { kind: "h3", id: "find-the-cause", title: "Find the cause" },
        {
          kind: "ol",
          items: [
            [
              { b: "Confirm the reason." },
              " Memory is the fix only when it reads OOMKilled. For ",
              { code: "Reason: Error" },
              " with 137, look at the probe, or at a shutdown that runs past its grace period.",
            ],
            {
              text: [
                { b: "Read memory use over the hours before the kill." },
                " Microsoft’s guide separates two shapes. Memory that stays high but steady means the workload needs that much, or its requests and limits are wrong. Memory that climbs and doesn’t return to a baseline after load falls typically means a leak, or something accumulating. On a cgroup v2\u00a0node, read the current figure in bytes:",
              ],
              blocks: [
                {
                  kind: "code",
                  lang: "bash",
                  code: "kubectl exec -it <pod-name> -n <namespace> -- cat /sys/fs/cgroup/memory.current",
                },
              ],
            },
          ],
        },
        {
          kind: "h3",
          id: "change-the-size-or-fix-the-leak",
          title: "Change the size, or fix the leak",
        },
        {
          kind: "ol",
          start: 3,
          items: [
            {
              text: [
                { b: "If the use is expected, give the container more memory." },
                " Raise the limit, and the request with it. The Kubernetes documentation puts it in that order: rule out a memory leak, then set a higher memory limit (and possibly request). ",
                { a: "Size it from the peak", href: "/learn/kubernetes-pod-right-sizing" },
                " of a window that includes the workload’s busiest day, not from an average. Then put the same values in your manifest or Git, or the next deploy brings the old ones back. For a single-container Deployment:",
              ],
              blocks: [
                {
                  kind: "code",
                  lang: "bash",
                  code: "kubectl set resources deployment <deployment-name> -n <namespace> --limits=memory=<limit>Mi --requests=memory=<request>Mi",
                },
              ],
            },
            [
              { b: "If memory keeps climbing, treat it as a leak." },
              " A bigger limit only moves the kill later. Microsoft suggests raising the limit as a stopgap while the application team looks for the leak.",
            ],
            [
              { b: "Make the workloads that should go last Guaranteed." },
              " Set CPU and memory requests equal to their limits in every container. The kubelet never evicts a Guaranteed pod because of another pod’s use. Its containers also get an oom_score_adj of -997.",
            ],
            [
              { b: "Count everything the limit covers." },
              " A memory-backed emptyDir volume is tmpfs, and the kubelet tracks it as container memory use, so files written there can count toward the limit. For a Java or .NET app, Microsoft also asks you to check that it runs the latest runtime version.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Requests sized from real use are also the first step of ",
            { a: "Kubernetes cost optimization", href: "/kubernetes-cost-optimization" },
            ", before any change to nodes.",
          ],
        },
      ],
    },
    {
      id: "oomkilled-on-aks-and-eks-where-the",
      title: "OOMKilled on AKS and EKS: where the memory history lives",
      blocks: [
        {
          kind: "p",
          text: "The kubectl steps are the same on both clouds. The memory history lives in each cloud’s monitoring.",
        },
        {
          kind: "h3",
          id: "aks-container-insights-in-the-azure-portal",
          title: "AKS: Container insights in the Azure portal",
        },
        {
          kind: "p",
          text: "On Azure Kubernetes Service (AKS), Container insights in the Azure portal shows that history:",
        },
        {
          kind: "ol",
          items: [
            "Open the cluster, then Monitoring, Insights and the Nodes tab.",
            "Pick the metric Memory working set (computed from Allocatable).",
            "Set the sample to Max.",
          ],
        },
        {
          kind: "p",
          text: "Read the memory figures, not the percentages. A pod’s percentage is based on its memory request, not on the node.",
        },
        {
          kind: "p",
          text: "For an OOMKilled AKS system pod in kube-system, Microsoft gives specific fixes:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "metrics-server." },
              " When it’s OOMKilled for lack of resources, configure the Metrics Server VPA to give it more.",
            ],
            [
              { b: "CoreDNS." },
              " When traffic spikes get it OOMKilled, customize CoreDNS scaling.",
            ],
            [
              { b: "Other system pods." },
              " Keep memory-heavy user workloads off the ",
              { a: "system node pool", href: "/learn/glossary/node-pool" },
              ", and give that pool at least three nodes.",
            ],
          ],
        },
        {
          kind: "h3",
          id: "eks-container-insights-in-amazon-cloudwatch",
          title: "EKS: Container Insights in Amazon CloudWatch",
        },
        {
          kind: "p",
          text: "On Amazon Elastic Kubernetes Service (EKS), OOM killed containers leave a trail in Amazon CloudWatch. It appears once Container Insights with enhanced observability is collecting. Two of its metrics help:",
        },
        {
          kind: "ul",
          items: [
            [
              { code: "pod_container_status_terminated_reason_oom_killed" },
              " appears only when a pod is terminated for exceeding its memory limit.",
            ],
            [
              { code: "pod_memory_utilization_over_pod_limit" },
              " gives a pod’s memory use as a share of its limit. It’s missing for any pod in which a container doesn’t set a memory limit.",
            ],
          ],
        },
      ],
    },
    {
      id: "how-coral-sets-memory-and-responds-to",
      title: "How Coral sets memory and responds to OOM kills",
      blocks: [
        {
          kind: "p",
          text: [
            "Coral is Zoorik’s ",
            { a: "Kubernetes optimization for AKS and EKS", href: "/coral" },
            ", and it rebalances each container’s CPU and memory requests from observed use. Until you switch on “Automatically optimize” for a policy or a workload, it only recommends.",
          ],
        },
        {
          kind: "p",
          text: [
            "Its ",
            { a: "memory rules", href: "/coral-faq#what-happens-if-an-optimized-pod" },
            " work like this:",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "The size." },
              " Coral sets memory from the peak of recent use, plus a margin. It uses a peak, not a percentile, because running out of memory kills the container.",
            ],
            [
              { b: "The limit." },
              " On the built-in policies, Coral never reduces a memory limit on regular pods. When it changes a memory request, it keeps your limit or raises it, so the limit is never below the request. A container with no memory limit keeps none.",
            ],
            [
              { b: "Policy choices." },
              " A custom policy can keep, remove or set limits its own way. Where a policy keeps a pod Guaranteed, its limit stays equal to its request.",
            ],
            [
              { b: "After a kill." },
              " With automation on, Coral raises that container’s memory request straight away. The limit rises with it, so the new size isn’t killed at the old limit. With automation off, Coral records the kill and changes nothing.",
            ],
            [
              { b: "How the new size lands." },
              " Crash-looping pods, and pods not Ready after a recent kill, are recreated at the new size. Other pods are resized in place or restarted within their PDBs.",
            ],
            [
              { b: "Cap and fade." },
              " Raises stop at a cap. If repeated kills look like a memory leak, Coral stops raising and holds memory at the cap for a set time. The extra margin fades after the last kill, and a Job keeps it through its next clean runs.",
            ],
            [
              { b: "What stays yours." },
              " Coral changes a container’s CPU and memory, never application settings such as JVM heap or Redis maxmemory. A leak stays a fix in the application.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "On the console’s ",
            { a: "Dashboard", href: "/coral-guide#the-console-the-pages" },
            ", the cluster’s OOM kills show alongside its nodes and pods.",
          ],
        },
        {
          kind: "h3",
          id: "what-coral-did-on-our-own-cluster",
          title: "What Coral did on our own cluster",
        },
        {
          kind: "p",
          text: "We run Coral on our own AKS development cluster. By 12 October 2026 it had rebalanced the requests of 14 of the cluster’s apps. Most were reserving more than they used.",
        },
        {
          kind: "p",
          text: [
            "One app needed more memory, and Coral gave it more. The memory the apps reserve went from 6.4 to 5.4\u00a0GiB, 16% less. ",
            { a: "Our case study", href: "/coral-value-lab" },
            " has the full run.",
          ],
        },
      ],
    },
  ],
  help: {
    product: "coral",
    text: "Coral rebalances CPU and memory requests on AKS and EKS, works with your HPA, and drains spare nodes so your autoscaler can remove them. We estimate it takes 40–50% off AKS and EKS cost. It is an estimated range, not a promise. The free assessment works out your own figure.",
    links: [
      { label: "Kubernetes optimization with Coral", href: "/coral" },
      { label: "Estimate your saving", href: "/assessment?p=coral" },
    ],
  },
  sources: [
    {
      publisher: "Kubernetes",
      title: "“Resource Management for Pods and Containers”",
      url: "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/",
    },
    {
      publisher: "Kubernetes",
      title: "“Node-pressure Eviction”",
      url: "https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/",
    },
    {
      publisher: "Kubernetes",
      title: "“Pod Lifecycle”",
      url: "https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/",
    },
    {
      publisher: "Kubernetes Blog",
      title: "“The Shift to cgroup v2 in Kubernetes: What You Need to Know”",
      url: "https://kubernetes.io/blog/2026/10/06/kubernetes-cgroups-v2-shift/",
      note: " (6 October 2026)",
    },
    {
      publisher: "Linux man-pages",
      title: "“signal(7)”",
      url: "https://man7.org/linux/man-pages/man7/signal.7.html",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Troubleshoot memory saturation in AKS clusters”",
      url: "https://learn.microsoft.com/en-us/troubleshoot/azure/azure-kubernetes/availability-performance/identify-memory-saturation-aks",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Troubleshoot OOMKilled errors in AKS clusters”",
      url: "https://learn.microsoft.com/en-us/troubleshoot/azure/azure-kubernetes/availability-performance/troubleshoot-oomkilled-aks-clusters",
    },
    {
      publisher: "AWS",
      title: "“Amazon EKS and Kubernetes Container Insights with enhanced observability metrics”",
      url: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics-enhanced-EKS.html",
    },
  ],
  related: [
    {
      title: "Kubernetes pod right sizing: set requests from real use",
      where: "Learn",
      href: "/learn/kubernetes-pod-right-sizing",
    },
    {
      title: "In-place pod resize: change CPU and memory without a restart",
      where: "Learn",
      href: "/learn/in-place-pod-resize",
    },
    {
      title: "Kubernetes allocatable vs capacity: what pods can use",
      where: "Learn",
      href: "/learn/kubernetes-allocatable-vs-capacity",
    },
    {
      title: "What happens if an optimized pod starts getting OOM-killed?",
      where: "Coral FAQ",
      href: "/coral-faq#what-happens-if-an-optimized-pod",
    },
  ],
};
