import type { Article } from "@/content/learn/article";

export const article: Article = {
  slug: "oomkilled-exit-code-137",
  title: "OOMKilled exit code 137 in Kubernetes: how to fix",
  meta: "OOMKilled exit code 137 means the OOM killer stopped your container with SIGKILL. Confirm it with kubectl, tell it from eviction, and fix it on AKS and EKS.",
  h1: "OOMKilled exit code 137: why Kubernetes kills a container",
  deck: "What 137 means, how to tell an OOM kill from the other kills, and how to size memory so it stops.",
  card: "Read the Reason field, tell an OOM kill from eviction and probe kills, then fix the memory or the leak.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes cost basics",
  published: "2026-11-22",
  updated: "2026-11-22",
  author: "prashant",
  short: [
    "OOMKilled exit code 137 means the Linux kernel’s out-of-memory (OOM) killer stopped your container with SIGKILL, because the container went past its memory limit or the node ran out of memory first. The code alone only says a SIGKILL arrived, so check that ",
    { code: "kubectl describe pod" },
    " shows Reason: OOMKilled under Last State. Then raise the limit if the use is expected, or find the leak if memory keeps climbing.",
  ],
  sections: [
    {
      id: "what-is-oomkilled-in-kubernetes",
      title: "What is OOMKilled in Kubernetes?",
      blocks: [
        {
          kind: "p",
          text: "A memory limit is a ceiling the kernel enforces. On Linux nodes, the container runtime writes each container’s limits into kernel cgroups, and when a container tries to allocate beyond its limit, the kernel’s OOM subsystem steps in. The Kubernetes documentation calls memory limits “enforced reactively”: the kernel acts when it detects memory pressure, so a container that goes over its limit may not be killed at once.",
        },
        {
          kind: "p",
          text: "The kill is SIGKILL (signal 9), and exit code 137 means a container received it. A process can’t catch, block or ignore SIGKILL, so the application gets no chance to clean up or to log why it stopped.",
        },
        {
          kind: "p",
          text: [
            "An OOM kill is scoped to one container, not the whole pod. On nodes that use cgroup v2, the kubelet sets ",
            { code: "memory.oom.group" },
            " on each container’s cgroup, so one OOM event kills every process in that container together. On cgroup v1\u00a0nodes, or with the kubelet setting ",
            { code: "singleProcessOOMKill: true" },
            ", the kernel may kill a single process instead. If that process is the container’s main process (PID 1), the container ends. If not, the container can keep running without it. Kubernetes 1.35 and later don’t start the kubelet on a cgroup v1\u00a0node by default, so with default settings expect the whole container to go.",
          ],
        },
        {
          kind: "p",
          text: "The kubelet then restarts the container under the pod’s restartPolicy. By default it waits 10\u00a0seconds, then 20, then 40, up to a cap of 5\u00a0minutes, and a container that runs for 10\u00a0minutes without trouble resets that back-off. One that keeps getting killed shows CrashLoopBackOff.",
        },
      ],
    },
    {
      id: "how-to-confirm-oomkilled-exit-code-137",
      title: "How to confirm OOMKilled exit code 137 with kubectl",
      blocks: [
        { kind: "p", text: "Start with the pod list:" },
        { kind: "code", lang: "bash", code: "kubectl get pods -n <namespace>" },
        {
          kind: "p",
          text: "The STATUS column can read OOMKilled just after a kill, then CrashLoopBackOff while the kubelet waits to restart the container. The OOMKilled status won’t last, so read the record of the last run:",
        },
        { kind: "code", lang: "bash", code: "kubectl describe pod <pod-name> -n <namespace>" },
        {
          kind: "p",
          text: "Every OOMKilled Kubernetes container leaves the same record under its name. The Kubernetes documentation’s example, trimmed:",
        },
        {
          kind: "code",
          lang: "text",
          code: "    Limits:\n      cpu:          100m\n      memory:       50Mi\n    State:          Running\n    Last State:     Terminated\n      Reason:       OOMKilled\n      Exit Code:    137\n    Ready:          False\n    Restart Count:  5",
        },
        {
          kind: "p",
          text: "State is the current run, and Last State records the one that ended. Reason: OOMKilled with Exit Code: 137 confirms that the kernel’s OOM killer ended it. Limits shows the container’s limit, 50Mi here. In a pod with several containers, check which one carries the record: a sidecar can be the one running out.",
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
      id: "kubernetes-exit-code-137-without-oomkilled",
      title: "Kubernetes exit code 137 without OOMKilled",
      blocks: [
        {
          kind: "p",
          text: "Microsoft’s guide to memory saturation on AKS states the rule: “Exit code 137 indicates that a container received a SIGKILL signal, but this code can have more than one cause.” The Reason field tells the causes apart.",
        },
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
          kind: "p",
          text: [
            "When a pod is deleted, the kubelet asks the runtime to send SIGTERM to the main process of each container, then waits, 30\u00a0seconds by default (",
            { code: "terminationGracePeriodSeconds" },
            "). Once that time is up, the KILL signal goes to any processes still running. An app that ignores SIGTERM, or needs longer than that to stop, gets SIGKILL on every rollout, and more memory changes nothing.",
          ],
        },
        {
          kind: "p",
          text: [
            "Eviction works on the whole pod. The kubelet watches the node’s available memory, and when it falls below ",
            { a: "a threshold", href: "/learn/kubernetes-allocatable-vs-capacity" },
            " (the kubelet’s built-in default is ",
            { code: "memory.available<100Mi" },
            " on Linux nodes, and its configuration can set another), it sets chosen pods to Failed and terminates them. It doesn’t respect ",
            {
              a: "PodDisruptionBudgets (PDBs)",
              href: "/learn/pod-disruption-budget-best-practices",
            },
            " here, and under a hard threshold it gives no grace period at all. If a Deployment or StatefulSet manages the pod, a replacement is created.",
          ],
        },
      ],
    },
    {
      id: "when-the-node-runs-out-of-memory",
      title: "When the node runs out of memory first",
      blocks: [
        {
          kind: "p",
          text: "A container can also be killed under its own limit when the node fills up around it. The request is mainly used to schedule the pod, and the kubelet reserves at least that much for the container, while the limit is the kill point. A container that uses more than its request, on a node that runs short of memory, is likely to see its pod evicted.",
        },
        {
          kind: "p",
          text: "The kubelet ranks pods for eviction by whether their use exceeds their requests, then by Priority, then by how far over their requests they are. A fast spike can beat it: the kubelet polls memory statistics at an interval and can miss the pressure, and then the kernel’s OOM killer picks a container itself. Each container’s score is its share of the node’s memory, plus an adjustment the kubelet sets per Quality of Service (QoS) class:",
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
          text: "The highest score is killed first. The Kubernetes documentation sums up the effect: containers in low-QoS pods that use a lot of memory compared with their requests go first.",
        },
      ],
    },
    {
      id: "how-to-fix-oomkilled-in-kubernetes",
      title: "How to fix OOMKilled in Kubernetes",
      blocks: [
        {
          kind: "ol",
          items: [
            "Confirm the reason, because memory is the fix only when it reads OOMKilled. For Reason: Error with 137, look at the probe, or at a shutdown that runs past its grace period.",
            {
              text: "Read the memory curve over the hours before the kill. Microsoft’s guide separates two shapes. Memory that stays high but steady means the workload needs that much, or its requests and limits are wrong. Memory that climbs and doesn’t return to a baseline after load falls typically means a leak, or something accumulating. To read the current figure from inside the container on a cgroup v2\u00a0node, in bytes:",
              blocks: [
                {
                  kind: "code",
                  lang: "bash",
                  code: "kubectl exec -it <pod-name> -n <namespace> -- cat /sys/fs/cgroup/memory.current",
                },
              ],
            },
            {
              text: [
                "If the use is expected, give the container more memory: a higher limit, and a higher request with it. The Kubernetes documentation puts it in that order: rule out a memory leak, then set a higher memory limit (and possibly request). Size it from the peak of a window that includes the workload’s busiest day, not from an average (",
                { a: "how to read real memory use", href: "/learn/kubernetes-pod-right-sizing" },
                "). Then put the same values in your manifest or Git, or the next deploy brings the old ones back. For a single-container Deployment:",
              ],
              blocks: [
                {
                  kind: "code",
                  lang: "bash",
                  code: "kubectl set resources deployment <deployment-name> -n <namespace> --limits=memory=<limit>Mi --requests=memory=<request>Mi",
                },
              ],
            },
            "If memory keeps climbing, a bigger limit only moves the kill later. Microsoft suggests raising the limit as a stopgap while the application team looks for the leak.",
            "For a workload that should be the last to go, set CPU and memory requests equal to their limits in every container. The pod becomes Guaranteed: the kubelet never evicts it because of another pod’s use, and its containers get an oom_score_adj of -997.",
            "Count everything the limit covers. A memory-backed emptyDir volume is tmpfs, and the kubelet tracks it as container memory use, so files written there can count toward the limit. For a Java or .NET app, Microsoft also asks you to check that it runs the latest runtime version.",
          ],
        },
      ],
    },
    {
      id: "oomkilled-on-aks-and-eks",
      title: "OOMKilled on AKS and EKS",
      blocks: [
        {
          kind: "p",
          text: "The kubectl steps are the same on both clouds. The memory history lives in each cloud’s monitoring.",
        },
        {
          kind: "p",
          text: "On Azure Kubernetes Service (AKS), Container insights in the Azure portal shows it. Open the cluster, then Monitoring, Insights and the Nodes tab, pick the metric Memory working set (computed from Allocatable), and set the sample to Max. Read the memory figures, not the percentages: a pod’s percentage is based on its memory request, not on the node.",
        },
        {
          kind: "p",
          text: "For an OOMKilled AKS system pod in kube-system, Microsoft gives specific fixes. When metrics-server is OOMKilled for lack of resources, configure the Metrics Server VPA to give it more. When traffic spikes get CoreDNS OOMKilled, customize CoreDNS scaling. For everything else there, keep memory-heavy user workloads off the system node pool, and give that pool at least three nodes.",
        },
        {
          kind: "p",
          text: [
            "On Amazon Elastic Kubernetes Service (EKS), Container Insights with enhanced observability in Amazon CloudWatch has a metric for this event, ",
            { code: "pod_container_status_terminated_reason_oom_killed" },
            ". It appears only when a pod is terminated for exceeding its memory limit. Beside it, ",
            { code: "pod_memory_utilization_over_pod_limit" },
            " gives a pod’s memory use as a share of its limit, though it’s missing for any pod in which a container doesn’t set a memory limit. So on EKS, OOM killed containers leave a CloudWatch trail once Container Insights is collecting.",
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
            ". It rebalances each container’s CPU and memory requests from observed use, and it only recommends until you switch on “Automatically optimize” for a policy or a workload. Its ",
            { a: "memory rules", href: "/coral/faq#what-happens-if-an-optimized-pod" },
            " work like this:",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "The size." },
              " On the balanced policy, the default for Deployments, DaemonSets and Argo Rollouts, memory is set from the highest use of the last 8\u00a0days plus 10%, with a larger margin on the stability and burstable policies. It’s a peak rather than a percentile, because running out of memory kills the container.",
            ],
            [
              { b: "The limit." },
              " On the built-in policies, Coral never reduces a memory limit on regular pods. When it changes a memory request, the limit becomes the largest of your own limit, 1.5 times the new request and 128\u00a0MiB, so it is never below the request. A container that has no memory limit keeps none. A custom policy can keep, remove or set limits its own way. On the resiliency policy, the default for StatefulSets, a Guaranteed pod keeps its limit equal to its request.",
            ],
            [
              { b: "After a kill." },
              " With automation on, Coral raises that container’s memory request straight away by 20% of its base size per kill, or 100\u00a0MiB if that is more. The limit rises with it under the rule above, so the new size isn’t killed at the old limit. Crash-looping pods, and pods not Ready after an OOM kill in the last 10\u00a0minutes, are recreated with the raised request; other pods are resized in place or restarted within their PDBs. The extra margin fades over 24\u00a0hours after the last kill (a Job keeps it for 2 clean runs, up to 30\u00a0days). Raises stop at 2.5× the base size. If three or more kills in 24\u00a0hours look like a memory leak, Coral stops raising and holds memory at 2.5 times the size before the raises began, for 24\u00a0hours. With automation off, Coral records the kill and changes nothing.",
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
            "The console’s Dashboard shows the cluster’s OOM kills alongside its nodes and pods (",
            { a: "the console pages", href: "/coral/guide#the-console-the-pages" },
            ").",
          ],
        },
        {
          kind: "p",
          text: [
            "We run Coral on our own AKS development cluster, and by 12 October 2026 it had rebalanced the requests of 14 of the cluster’s apps. Most were reserving more than they used. One needed more memory, and Coral gave it more. The memory the apps reserve went from 6.4 to 5.4\u00a0GiB, 16% less, and ",
            {
              a: "How we reduced our own cluster’s machine bill by 58%",
              href: "/case-studies/coral-dev-cluster",
            },
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
      { label: "Kubernetes cost optimization with Coral", href: "/coral" },
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
      title: "What happens if an optimized pod starts getting OOM-killed?",
      where: "Coral FAQ",
      href: "/coral/faq#what-happens-if-an-optimized-pod",
    },
  ],
};
