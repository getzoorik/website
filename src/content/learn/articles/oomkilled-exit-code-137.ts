import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/oomkilled-exit-code-137/1";
import { figure as figure2 } from "@/features/learn/figures/oomkilled-exit-code-137/2";

export const article: Article = {
  slug: "oomkilled-exit-code-137",
  title: "Exit code 137 (OOMKilled) in Kubernetes: how to fix",
  meta: "Exit code 137 means a container got SIGKILL. Confirm OOMKilled with kubectl, tell it from eviction and probe kills, then fix the memory or the leak.",
  h1: "Exit code 137 (OOMKilled) in Kubernetes",
  deck: "The code proves only a SIGKILL. The pod’s Reason field shows whether memory caused it.",
  card: "Confirm an OOM kill, tell it from eviction and probe kills, then fix the memory or the leak.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes cost basics",
  published: "2026-11-01",
  updated: "2026-11-03",
  author: "prashant",
  cover: "/learn-covers/zoorik-learn-oomkilled-exit-code-137-1200x630.webp",
  coverAlt: "Memory climbs to the memory limit, then SIGKILL stops the container with exit 137",
  short: [
    "Exit code 137 means the container got SIGKILL (128 + 9). In Kubernetes, ",
    { code: "Reason: OOMKilled" },
    " means the kernel’s out-of-memory (OOM) killer sent it: the container passed its memory limit, or the node ran out. Check with ",
    { code: "kubectl describe pod" },
    ". Then raise the memory limit, or find the leak if memory keeps climbing.",
  ],
  sections: [
    {
      id: "oomkilled-exit-code-137",
      title: "Confirm OOMKilled with kubectl",
      blocks: [
        { kind: "p", text: "List the pods:" },
        { kind: "code", lang: "bash", code: "kubectl get pods -n <namespace>" },
        { kind: "p", text: "Then read the container’s last run:" },
        { kind: "code", lang: "bash", code: "kubectl describe pod <pod-name> -n <namespace>" },
        {
          kind: "p",
          text: "An OOM-killed container shows this record. The example is from the Kubernetes documentation, trimmed:",
        },
        {
          kind: "code",
          lang: "text",
          code: "    Limits:\n      cpu:          100m\n      memory:       50Mi\n    State:          Running\n    Last State:     Terminated\n      Reason:       OOMKilled\n      Exit Code:    137\n    Ready:          False\n    Restart Count:  5",
        },
        {
          kind: "ul",
          items: [
            [
              { code: "Last State" },
              " is the run that ended. ",
              { code: "State" },
              " is the current run.",
            ],
            [
              { code: "Reason: OOMKilled" },
              " with ",
              { code: "Exit Code: 137" },
              " confirms the kernel’s OOM killer ended it.",
            ],
            [{ code: "Limits" }, " shows the container’s memory limit: 50Mi here."],
            "In a pod with several containers, check which one has the record. A sidecar can be the one running out.",
          ],
        },
        {
          kind: "p",
          text: "Two more commands: the killed run’s log, and the namespace’s events in time order.",
        },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl logs <pod-name> -n <namespace> --previous\nkubectl get events -n <namespace> --sort-by=.lastTimestamp",
        },
        {
          kind: "h3",
          id: "crashloopbackoff-why-an-oomkilled-pod-keeps-restarting",
          title: "CrashLoopBackOff after OOM kills",
        },
        {
          kind: "p",
          text: "After a kill, the kubelet restarts the container under the pod’s restartPolicy. The first restart is immediate. Then it waits 10 seconds, 20, 40 and so on, up to 5 minutes by default.",
        },
        {
          kind: "p",
          text: "The STATUS column can read OOMKilled just after a kill, then CrashLoopBackOff while the kubelet waits. A container that runs for 10 minutes without trouble resets the back-off.",
        },
        {
          kind: "p",
          text: "Each restart runs at the same memory limit, so the kill tends to repeat. To fix a pod in CrashLoopBackOff from OOM kills, give it more memory or fix the leak. The Kubernetes checklist for CrashLoopBackOff also says to check resource limits.",
        },
      ],
    },
    {
      id: "what-is-oomkilled-in-kubernetes",
      title: "What is OOMKilled?",
      blocks: [
        {
          kind: "p",
          text: "OOMKilled means the kernel stopped the container for using too much memory. On Linux nodes, the container runtime writes each container’s limits into kernel cgroups. When the container tries to allocate past its memory limit, the kernel’s OOM subsystem steps in.",
        },
        {
          kind: "p",
          text: "The kill is SIGKILL (signal 9). A process can’t catch, block or ignore it, so the app gets no chance to clean up or log why it stopped.",
        },
        {
          kind: "p",
          text: "Kubernetes calls memory limits “enforced reactively”. The kernel acts only when it detects memory pressure, so a container over its limit may not be killed at once.",
        },
        {
          kind: "p",
          text: [
            "The kill is scoped to one container, not the whole pod. On cgroup v2 nodes, the kubelet sets ",
            { code: "memory.oom.group" },
            " on each container’s cgroup, so one OOM event kills every process in that container.",
          ],
        },
        {
          kind: "callout",
          label: "For engineers",
          text: [
            "On cgroup v1 nodes, or with the kubelet setting ",
            { code: "singleProcessOOMKill: true" },
            ", the kernel may kill one process at a time. That can leave a multi-process container partly working. From Kubernetes 1.35, the kubelet doesn’t start on a cgroup v1 node by default.",
          ],
        },
      ],
    },
    {
      id: "kubernetes-exit-code-137-has-more-than",
      title: "Other causes of exit code 137",
      blocks: [
        {
          kind: "p",
          text: "Any SIGKILL gives 137, so the code alone doesn’t prove an OOM kill. The Reason field tells the causes apart.",
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
              "Reason: OOMKilled, Exit Code: 137",
              "The kernel: the container went past its memory limit, or the node ran out of memory",
              "Memory use against the limit, and the node’s memory",
            ],
            [
              "Reason: Error, Exit Code: 137",
              "Another SIGKILL, such as a failed liveness probe or a shutdown that ran past its grace period",
              "The pod’s events, its probes and how long the app takes to stop",
            ],
            [
              "Pod status Failed, reason Evicted",
              "The kubelet: the node ran short of memory",
              "The node’s memory, and the pod’s use against its request",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "When a pod is deleted, the kubelet has the runtime send SIGTERM to each container’s main process. After ",
            { code: "terminationGracePeriodSeconds" },
            ", 30 seconds by default, any process still running gets KILL.",
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "An app that ignores SIGTERM, or needs longer than its grace period to stop, gets SIGKILL on every rollout. More memory changes nothing.",
        },
      ],
    },
    {
      id: "docker-exit-code-137-and-the-other",
      title: "Docker exit code 137",
      blocks: [
        {
          kind: "p",
          text: "The number comes from Linux. In the bash shell, a command ended by signal n returns 128 + n. SIGKILL is signal 9, so 137 means SIGKILL: 128 + 9 = 137. Tools print it as exit code 137, exit status 137 or return code 137.",
        },
        {
          kind: "p",
          text: [
            "A Docker container that exits with code 137 got SIGKILL. ",
            { code: "docker ps -a" },
            ", which also lists stopped containers, shows it as ",
            { code: "Exited (137)" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "In Kubernetes, ",
            { code: "kubectl exec" },
            " prints ",
            { code: "command terminated with exit code 137" },
            " when the command it ran inside the container got SIGKILL.",
          ],
        },
        {
          kind: "p",
          text: [
            "SIGTERM is signal 15, so a process it ends returns ",
            { a: "exit code 143", href: "/learn/exit-code-143" },
            ".",
          ],
        },
      ],
    },
    {
      id: "why-a-container-can-be-killed-below",
      title: "Killed below the memory limit",
      blocks: [
        {
          kind: "p",
          text: "A container can also be stopped under its own limit when the node runs out of memory around it.",
        },
        {
          kind: "p",
          text: [
            "The scheduler places a pod by its ",
            { a: "request", href: "/learn/glossary/kubernetes-resource-requests" },
            ", and the kubelet reserves at least that much for the container. The ",
            { a: "limit", href: "/learn/glossary/kubernetes-resource-limits" },
            " is the kill point. A container that uses more than its request, on a node short of memory, is likely to see its pod evicted.",
          ],
        },
        {
          kind: "h3",
          id: "when-the-kubelet-evicts-the-pod",
          title: "Eviction by the kubelet",
        },
        {
          kind: "p",
          text: [
            "Eviction stops the whole pod. The kubelet acts when the node’s available memory falls below ",
            {
              a: "its hard eviction threshold",
              href: "/learn/kubernetes-allocatable-vs-capacity",
            },
            ": ",
            { code: "memory.available<100Mi" },
            " on Linux nodes by default.",
          ],
        },
        {
          kind: "p",
          text: [
            "It sets the chosen pods to Failed and stops them. It ignores ",
            {
              a: "PodDisruptionBudgets (PDBs)",
              href: "/learn/pod-disruption-budget-best-practices",
            },
            ", and under a hard threshold it gives no grace period. If a Deployment or StatefulSet manages the pod, the control plane creates a replacement.",
          ],
        },
        { kind: "p", text: "The kubelet ranks pods for eviction by three tests, in order:" },
        {
          kind: "ul",
          items: [
            "whether their use exceeds their requests",
            "their Priority",
            "how far their use is over their requests",
          ],
        },
        {
          kind: "h3",
          id: "when-the-kernels-oom-killer-picks-a",
          title: "The kernel’s OOM killer",
        },
        {
          kind: "p",
          text: "The kubelet checks memory at an interval, so a fast spike can beat it. Then the kernel’s OOM killer picks a container itself.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: [
            "Each container’s OOM score is its share of the node’s memory, plus an adjustment the kubelet sets from its ",
            { a: "Quality of Service (QoS) class", href: "/learn/glossary/kubernetes-qos-class" },
            ". The highest score is killed first.",
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
          text: "So containers in low-QoS pods that use far more memory than they request go first.",
        },
      ],
    },
    {
      id: "how-to-fix-oomkilled-in-kubernetes",
      title: "How to fix OOMKilled",
      blocks: [
        { kind: "p", text: "Read the Reason field first, then the memory curve." },
        { kind: "svg", figure: figure2 },
        { kind: "h3", id: "find-the-cause", title: "Find the cause" },
        {
          kind: "ol",
          items: [
            [
              { b: "Confirm the reason." },
              " Memory is the fix only for OOMKilled. For ",
              { code: "Reason: Error" },
              " with 137, check the probes and how long the app takes to stop.",
            ],
            {
              text: [
                { b: "Read memory use over the hours before the kill." },
                " High but steady means the workload needs that much, or its requests and limits are wrong. A climb that doesn’t fall back to a baseline after load drops usually means a leak. On a cgroup v2 node, read current use in bytes:",
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
          title: "Resize, or fix the leak",
        },
        {
          kind: "ol",
          start: 3,
          items: [
            {
              text: [
                { b: "If the use is expected, give the container more memory." },
                " Raise the limit, and the request with it. ",
                { a: "Size it from the peak", href: "/learn/kubernetes-pod-right-sizing" },
                " of a window that includes the busiest day, not from an average. Put the same values in your manifest or Git, or the next deploy brings back the old ones. For a single-container Deployment:",
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
              " A bigger limit only moves the kill later. Raise it as a stopgap while the app team finds the leak.",
            ],
            [
              { b: "Make the pods that should go last Guaranteed." },
              " Set CPU and memory requests equal to their limits in every container. The kubelet never evicts a Guaranteed pod because of another pod’s use.",
            ],
            [
              { b: "Count everything the limit covers." },
              " The kubelet counts a memory-backed emptyDir volume as container memory, so files written there count toward the limit. For a Java or .NET app, Microsoft also advises checking for the latest runtime version.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Requests set from real use are also the first step of ",
            { a: "Kubernetes cost optimization", href: "/kubernetes-cost-optimization" },
            ".",
          ],
        },
      ],
    },
    {
      id: "oomkilled-on-aks-and-eks-where-the",
      title: "Memory history on AKS and EKS",
      blocks: [
        {
          kind: "p",
          text: "The kubectl steps are the same on both clouds. The memory history lives in each cloud’s monitoring.",
        },
        {
          kind: "h3",
          id: "aks-container-insights-in-the-azure-portal",
          title: "AKS: Container insights",
        },
        {
          kind: "p",
          text: "On Azure Kubernetes Service (AKS), Container insights in the Azure portal shows the memory history:",
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
          text: "Read the memory values, not the percentages. A pod’s percentage is of its memory request, not of the node.",
        },
        {
          kind: "p",
          text: "For an OOM-killed AKS system pod in kube-system, Microsoft gives these fixes:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "metrics-server." },
              " When it’s OOM-killed for lack of resources, configure the Metrics Server VPA to give it more.",
            ],
            [
              { b: "CoreDNS." },
              " When traffic spikes get it OOM-killed, customize CoreDNS scaling.",
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
          title: "EKS: Container Insights",
        },
        {
          kind: "p",
          text: "On Amazon Elastic Kubernetes Service (EKS), OOM killed containers show up in Amazon CloudWatch once Container Insights with enhanced observability is collecting. Two of its metrics help:",
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
              " is a pod’s memory use as a share of its limit. It’s missing when any container in the pod has no memory limit.",
            ],
          ],
        },
      ],
    },
    {
      id: "how-coral-sets-memory-and-responds-to",
      title: "How Coral handles OOM kills",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " rebalances each container’s CPU and memory requests from observed use, on AKS and EKS. Until you switch on “Automatically optimize” for a policy or a workload, it only recommends.",
          ],
        },
        {
          kind: "p",
          text: [
            "Its ",
            { a: "memory rules", href: "/coral-faq#what-happens-if-an-optimized-pod" },
            ":",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Size." },
              " Coral sets memory from the peak of recent use, plus a margin. It uses a peak, not a percentile, because running out of memory kills the container.",
            ],
            [
              { b: "Limits." },
              " On the built-in policies, Coral never reduces a memory limit on regular pods. When it changes a memory request, it keeps your limit or raises it, so the limit never sits below the request. A container with no memory limit keeps none.",
            ],
            [
              { b: "Custom policies." },
              " A custom policy can keep, remove or set limits its own way. Where a policy keeps a pod Guaranteed, its limit stays equal to its request.",
            ],
            [
              { b: "After a kill." },
              " With automation on, Coral raises that container’s memory request straight away. The limit rises with it, so the new size isn’t killed at the old limit. With automation off, Coral records the kill and changes nothing.",
            ],
            [
              { b: "Rollout." },
              " Crash-looping pods, and pods not Ready after a recent kill, are recreated at the new size. Other pods are resized in place or restarted within their PDBs.",
            ],
            [
              { b: "Cap and fade." },
              " Raises stop at a cap. If repeated kills look like a memory leak, Coral stops raising and holds memory at the cap for a set time. The extra margin fades after the last kill, and a Job keeps it through its next clean runs.",
            ],
            [
              { b: "Your app." },
              " Coral changes only CPU and memory, never app settings such as JVM heap or Redis maxmemory. A leak stays a fix in the app.",
            ],
          ],
        },
        {
          kind: "h3",
          id: "what-coral-did-on-our-own-cluster",
          title: "On our own cluster",
        },
        {
          kind: "p",
          text: [
            "By 12 October 2026, Coral had rebalanced the requests of 14 apps on our own AKS development cluster, and given one of them more memory. The memory the apps reserve went from 6.4 to 5.4 GiB, 16% less. ",
            { a: "The Coral Value Lab study", href: "/coral-value-lab" },
            " has the full run.",
          ],
        },
      ],
    },
  ],
  help: {
    product: "coral",
    text: "Coral rebalances CPU and memory requests on AKS and EKS, works with your HPA, and removes the nodes you don’t need. We estimate it takes 40–50% off AKS and EKS cost. It is an estimated range, not a promise. The free assessment works out your own figure.",
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
      publisher: "Linux man-pages",
      title: "“bash(1)”",
      url: "https://man7.org/linux/man-pages/man1/bash.1.html",
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
    {
      publisher: "AWS",
      title: "“Docker diagnostics in Amazon ECS”",
      url: "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/docker-diags.html",
    },
    {
      publisher: "Kubernetes source",
      title: "“client-go/tools/remotecommand/v4.go”",
      url: "https://github.com/kubernetes/kubernetes/blob/master/staging/src/k8s.io/client-go/tools/remotecommand/v4.go",
    },
  ],
  related: [
    {
      title: "Kubernetes requests vs limits",
      where: "Learn",
      href: "/learn/kubernetes-pod-right-sizing",
    },
    {
      title: "Exit code 143 in Kubernetes",
      where: "Learn",
      href: "/learn/exit-code-143",
    },
    {
      title: "In-place pod resize in Kubernetes",
      where: "Learn",
      href: "/learn/in-place-pod-resize",
    },
    {
      title: "Kubernetes allocatable vs capacity",
      where: "Learn",
      href: "/learn/kubernetes-allocatable-vs-capacity",
    },
    {
      title: "What if a pod gets OOM-killed?",
      where: "Coral FAQ",
      href: "/coral-faq#what-happens-if-an-optimized-pod",
    },
  ],
  relatedTitle: "More on memory limits and OOM kills",
};
