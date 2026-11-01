import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/kubernetes-pod-right-sizing/1";
import { figure as figure2 } from "@/features/learn/figures/kubernetes-pod-right-sizing/2";
import { figure as figure3 } from "@/features/learn/figures/kubernetes-pod-right-sizing/3";

export const article: Article = {
  slug: "kubernetes-pod-right-sizing",
  title: "Kubernetes pod right sizing: requests vs limits",
  meta: "Kubernetes pod right sizing, step by step: requests vs limits, setting CPU and memory requests from real use, keeping requests and limits safe and rolling back.",
  h1: "Kubernetes pod right sizing: set requests from real use",
  deck: "How to read what each container really uses, set its requests from that, and change them without OOM kills.",
  card: "Read real CPU and memory use, set requests from it, and keep limits, throttling and rollbacks in check.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes cost basics",
  published: "2026-10-21",
  updated: "2026-11-01",
  author: "shreya",
  cover: "/learn-covers/zoorik-learn-kubernetes-pod-right-sizing-1200x630.webp",
  coverAlt:
    "Kubernetes pod right sizing: the old request moves down to a new request just above real use, day by day",
  short: [
    "Kubernetes pod right sizing means setting each container’s ",
    { a: "CPU and memory requests", href: "/learn/glossary/kubernetes-resource-requests" },
    " from its real use. The scheduler and the Cluster Autoscaler count requests, not use, so requests decide how many nodes you pay for. Set CPU at a high percentile and memory at the peak, both plus headroom, and don’t reduce limits until you know why they were set.",
  ],
  sections: [
    {
      id: "why-requests-not-use-set-what-you",
      title: "Why requests, not use, set what you pay for",
      blocks: [
        {
          kind: "p",
          text: "Picture a Deployment of 20\u00a0replicas, each requesting 1\u00a0CPU and using 150m (0.15\u00a0CPU). Together they use 3\u00a0CPU but request 20\u00a0CPU of node capacity, and you pay for the nodes that provide it.",
        },
        {
          kind: "p",
          text: "A container can declare a request and a limit for CPU and memory. Of the two, only the request decides where its pod can run. The scheduler places a pod on a node only while the requests there sum to less than the node’s capacity, and refuses it even when real use there is very low.",
        },
        {
          kind: "p",
          text: [
            "The Cluster Autoscaler counts requests too. It ",
            {
              a: "considers a node for removal",
              href: "/learn/cluster-autoscaler-not-scaling-down",
            },
            " only when its pods’ CPU requests and memory requests each sum to under 50% of the node’s ",
            { a: "allocatable capacity", href: "/learn/kubernetes-allocatable-vs-capacity" },
            ", the default ",
            { code: "--scale-down-utilization-threshold" },
            ". Actual use doesn’t enter that check. When requests sit far above use across a whole cluster, that’s ",
            { a: "Kubernetes overprovisioning", href: "/learn/kubernetes-overprovisioning" },
            ", and right sizing Kubernetes pods brings it back down.",
          ],
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "If 150m is each replica’s 7-day 95th percentile (P95), and the Deployment has no Horizontal Pod Autoscaler (HPA), the example rule in step 1 below, P95 plus 10%, gives a request of 150m × 1.1 = 165m. The 20\u00a0replicas then request 20 × 165m = 3.3\u00a0CPU instead of 20. That leaves 16.7\u00a0CPU of node capacity free for other pods, and you pay less once that free capacity lets a node go.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "kubernetes-requests-vs-limits-what-each-one",
      title: "Kubernetes requests vs limits: what each one controls",
      blocks: [
        {
          kind: "p",
          text: "Requests and limits do different jobs, and CPU and memory behave differently once a container goes past them:",
        },
        {
          kind: "table",
          columns: [
            { label: "Setting", width: "14%" },
            { label: "What Kubernetes uses it for", width: "40%" },
            { label: "When the container goes above it", width: "46%" },
          ],
          rows: [
            [
              "CPU request",
              "Scheduling, and a weight when containers compete for CPU",
              "It can use idle CPU on the node",
            ],
            [
              "CPU limit",
              "A hard ceiling the kernel enforces",
              "It is throttled. Runtimes don’t kill containers for CPU use",
            ],
            [
              "Memory request",
              "Scheduling. On cgroup v2\u00a0nodes the runtime may also use it as a hint to set memory.min and memory.low",
              "Allowed while the node has memory free. If the node runs short, the pod is likely to be evicted",
            ],
            [
              "Memory limit",
              "A memory ceiling the kernel enforces",
              "The kernel may kill the container for running out of memory (an OOM kill) once it detects memory pressure",
            ],
          ],
        },
        {
          kind: "p",
          text: "CPU is shared out in time, so running past a CPU request is free while the node has idle CPU. Memory can’t be shared out that way. The documentation calls memory limits “enforced reactively”: a container may run past its limit for a while, and then it may be killed.",
        },
        {
          kind: "p",
          text: "Write units in one consistent form: millicpu for CPU below one core (100m is 0.1\u00a0CPU, and 1m is the finest precision Kubernetes accepts) and binary suffixes such as Mi and Gi for memory. Case matters: a memory request of 400m is 0.4 bytes, and 400Mi is 400 mebibytes.",
        },
        {
          kind: "callout",
          label: "For engineers",
          text: "A limit enters placement in one case: if a container sets a limit and no request, and nothing applies a default request at admission, Kubernetes copies the limit into the request.",
        },
      ],
    },
    {
      id: "how-to-read-real-cpu-and-memory",
      title: "How to read real CPU and memory use",
      blocks: [
        {
          kind: "p",
          text: [
            { code: "kubectl top pod" },
            " shows only the current reading that Metrics Server serves to the ",
            { a: "HPA", href: "/learn/glossary/horizontal-pod-autoscaler" },
            " and the ",
            { a: "Vertical Pod Autoscaler (VPA)", href: "/learn/glossary/vertical-pod-autoscaler" },
            ". Sizing needs history that includes last Monday’s peak, from a monitoring system such as Prometheus, scraping cAdvisor, the container-metrics daemon built into the kubelet.",
          ],
        },
        {
          kind: "p",
          text: [
            "Two series carry what you need. ",
            { code: "container_cpu_usage_seconds_total" },
            " counts CPU seconds, so its rate is cores in use. ",
            { code: "container_memory_working_set_bytes" },
            " is the working set, an estimate of the memory in use that can’t be freed under pressure, and it typically includes some file cache too. On Azure Kubernetes Service (AKS), the Azure Monitor metrics add-on scrapes the cAdvisor target by default and keeps both, plus the throttling counters used below.",
          ],
        },
        {
          kind: "p",
          text: "These return the highest CPU percentile and memory peak among one Deployment’s pods:",
        },
        {
          kind: "code",
          lang: "promql",
          code: 'max(\n  quantile_over_time(0.95,\n    rate(container_cpu_usage_seconds_total{\n      namespace="<namespace>",\n      pod=~"<deployment>-[a-z0-9]+-[a-z0-9]{5}",\n      container="<container>"\n    }[5m])[7d:5m]\n  )\n)\n\nmax(\n  max_over_time(container_memory_working_set_bytes{\n    namespace="<namespace>",\n    pod=~"<deployment>-[a-z0-9]+-[a-z0-9]{5}",\n    container="<container>"\n  }[7d])\n)',
        },
        {
          kind: "p",
          text: "Choose the window from the workload’s cycle: a week or more for a service that’s busy on weekdays, several runs for a batch job. A startup burst pulls a CPU percentile up with every restart, so look at it separately before you decide whether the request should cover it.",
        },
        {
          kind: "p",
          text: [
            "The VPA can manage these recommendations too: the ",
            { a: "comparison of the VPA and the HPA", href: "/learn/vpa-vs-hpa" },
            " covers running it beside an HPA.",
          ],
        },
      ],
    },
    {
      id: "kubernetes-pod-right-sizing-step-by-step",
      title: "Kubernetes pod right sizing, step by step",
      blocks: [
        {
          kind: "ol",
          items: [
            [
              { b: "Set the CPU request" },
              " from a high percentile plus headroom, for example the 7-day P95 plus 10%. A CPU request below the peak won’t get a container killed: it borrows idle CPU at busy moments, and under contention the kernel still weights its share of CPU time by its request.",
            ],
            [
              { b: "Set the memory request" },
              " from the peak of a window that includes the workload’s busiest day, plus headroom. A pod whose container is above its memory request is likely to be evicted when the node runs short of memory, so a percentile isn’t enough here.",
            ],
            [
              { b: "Don’t reduce limits" },
              " on the first pass. If a memory peak already sits close to the memory limit, that container is one spike from an OOM kill, so raise the limit before anything else.",
            ],
            [
              {
                b: [
                  "Check ",
                  {
                    a: "what caps requests in the namespace",
                    href: "/learn/limitrange-vs-resourcequota",
                  },
                ],
              },
              ", its LimitRange and ResourceQuota, against the new request and the unchanged limit.",
            ],
            [
              { b: "Check the HPA" },
              ", if the workload has one. It measures CPU utilization as a percentage of the request, so the same load reads higher against a smaller one. If any container in the pod has no CPU request at all, the HPA can’t compute CPU utilization and takes no action on that metric.",
            ],
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "A smaller request can buy an extra pod. Take four replicas using 300m each against a 750m request: they read 40%, and with a 50% target the HPA holds them at four. At a 500m request the same pods read 60%, and the HPA asks for ceil(4 × 60 / 50) = 5\u00a0replicas. CPU requested still falls, from 4 × 750m = 3\u00a0CPU to 5 × 500m = 2.5\u00a0CPU, but the fifth pod adds its memory request. To keep four pods, raise the target in proportion, to 50% × 750 / 500 = 75%.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "ol",
          start: 6,
          items: [
            [
              { b: "Apply through the Pod template" },
              ", in your manifest or Git, and let the controller replace the pods. ",
              { a: "In-place resize", href: "/learn/in-place-pod-resize" },
              " has been stable since Kubernetes 1.35, so a running container’s requests can also change through the pod’s ",
              { code: "/resize" },
              " subresource without recreating the pod. For the Worked example, ",
              { code: "resources" },
              " becomes:",
            ],
          ],
        },
        {
          kind: "code",
          lang: "yaml",
          code: "resources:\n  requests:\n    cpu: 165m\n    memory: <peak plus headroom>\n  limits:\n    cpu: <unchanged>\n    memory: <unchanged>",
        },
      ],
    },
    {
      id: "cpu-throttling-a-container-can-hit-its",
      title: "CPU throttling: a container can hit its CPU limit while averaging well under it",
      blocks: [
        {
          kind: "p",
          text: [
            {
              a: "CPU throttling in Kubernetes",
              href: "/learn/glossary/kubernetes-cpu-throttling",
            },
            " is when the Linux kernel holds back a container that hits its CPU limit. On Linux the kernel enforces a ",
            { a: "CPU limit", href: "/learn/glossary/kubernetes-resource-limits" },
            " as a quota of CPU time per period, and the default period is 100\u00a0ms.",
          ],
        },
        {
          kind: "p",
          text: "A 500m limit therefore allows 50\u00a0ms of CPU time in each 100\u00a0ms, and once that quota is spent, the container’s threads are throttled until the next period refills it.",
        },
        {
          kind: "p",
          text: "Multi-threaded services feel this first, because every thread draws on the same quota. Four busy threads on four cores spend the whole 50\u00a0ms quota in 12.5\u00a0ms of wall-clock time, then wait 87.5\u00a0ms. A 5-minute CPU rate averages those bursts away. If one period in ten is busy like this, the rate reads 50\u00a0ms per second, or 50m, a tenth of the limit, though every busy period was throttled for 87.5\u00a0ms.",
        },
        { kind: "svg", figure: figure3 },
        {
          kind: "p",
          text: [
            "The kernel counts elapsed and throttled periods for each container, and cAdvisor exposes them as ",
            { code: "container_cpu_cfs_periods_total" },
            " and ",
            { code: "container_cpu_cfs_throttled_periods_total" },
            ". Their ratio is the share of periods in which the container hit its limit, the number to watch after any change to a CPU limit:",
          ],
        },
        {
          kind: "code",
          lang: "promql",
          code: 'rate(container_cpu_cfs_throttled_periods_total{\n  namespace="<namespace>", container="<container>"\n}[5m])\n/\nrate(container_cpu_cfs_periods_total{\n  namespace="<namespace>", container="<container>"\n}[5m])',
        },
        {
          kind: "p",
          text: "When a throttled service is also slow, look at its limit first. A bigger request reserves more of a node but leaves the ceiling where it was. A higher CPU limit, or none, lets the container take idle CPU when it bursts, at the price of CPU its neighbours might want. For pod right sizing itself, change requests and leave CPU limits for a separate change.",
        },
      ],
    },
    {
      id: "rollback-rules-that-come-before-any-saving",
      title: "Rollback rules that come before any saving",
      blocks: [
        {
          kind: "ul",
          items: [
            [
              { b: "Change one workload at a time." },
              " Sizing a whole namespace in one change hides which workload caused the trouble.",
            ],
            [
              { b: "Decide what will make you revert" },
              " before the change: a restart with reason OOMKilled, failing probes or slower responses at busy times, or the HPA’s replica count jumping.",
            ],
            [
              { b: "Make each change its own commit" },
              " in Git, so a rollback is a revert and an ordinary rollout.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Afterwards, ",
            { code: "kubectl describe pod <pod>" },
            " shows a container that ran out of memory with Last State Terminated, Reason OOMKilled and a growing Restart Count (",
            { a: "what to do after an OOM kill", href: "/learn/oomkilled-exit-code-137" },
            "). Watch a full cycle of the workload, a week for most services, before you change it again.",
          ],
        },
      ],
    },
    {
      id: "how-coral-rebalances-requests-from-observed-use",
      title: "How Coral rebalances requests from observed use",
      blocks: [
        {
          kind: "p",
          text: [
            "Coral is Zoorik’s ",
            {
              a: "Kubernetes optimization for AKS and Amazon Elastic Kubernetes Service (EKS)",
              href: "/coral",
            },
            ", and it rebalances each container’s CPU and memory requests from observed use, on a policy you choose.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "The sizes." },
              " Coral sets CPU from a high percentile of recent use and memory from the recent peak, each plus headroom.",
            ],
            [
              { b: "The HPA keeps scaling." },
              " The HPA decides how many pods run, and Coral decides how big each pod is. For a workload with a CPU-based HPA, Coral picks the request by replaying past load through that HPA’s own settings, and a smaller request wins only if its saving beats the cost of unserved load and extra scaling.",
            ],
            [
              { b: "Regular pods’ limits stay or rise." },
              " On the built-in policies, Coral never reduces the CPU or memory limit of a regular (",
              { a: "non-Guaranteed", href: "/learn/glossary/kubernetes-qos-class" },
              ") pod, so startup can still burst above the request into free CPU on the node. When Coral changes a memory request, it keeps your limit or raises it, so the limit is never below the request. A custom policy can set limits its own way.",
            ],
            [
              { b: "How a change lands." },
              " Coral only recommends until you switch on “Automatically optimize” for a policy or a workload. Your manifest is never changed. Coral sets new requests as pods start, resizes running pods in place on 1.33+ nodes, or else restarts them one at a time within their ",
              { a: "PodDisruptionBudgets", href: "/learn/glossary/pod-disruption-budget" },
              ". Early reductions are made in small steps while data builds up. Every change respects your minimums, LimitRanges and quotas.",
            ],
            [
              { b: "Going back." },
              " Failing probes and CPU pressure make Coral raise requests back up, and a replacement pod that isn’t Ready in time goes back to its original size, except in StatefulSets. After an OOM kill, with automation on, Coral raises that container’s memory request straight away, and the memory limit rises with it. With automation off, new pods start at your manifest’s size, and running pods keep theirs until they restart.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "On our own AKS development cluster, Coral had rebalanced the requests of 14 apps by 12 October 2026. CPU reserved by the cluster’s own apps went from 0.78 to 0.43\u00a0cores, 45% less, and memory from 6.4 to 5.4\u00a0GiB, 16% less. ",
            { a: "How we reduced AKS cluster costs by 58%", href: "/coral-value-lab" },
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
      title: "“Resize CPU and Memory Resources assigned to Containers”",
      url: "https://kubernetes.io/docs/tasks/configure-pod-container/resize-container-resources/",
    },
    {
      publisher: "Kubernetes",
      title: "“Resource metrics pipeline”",
      url: "https://kubernetes.io/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/",
    },
    {
      publisher: "Kubernetes",
      title: "“Horizontal Pod Autoscaling”",
      url: "https://kubernetes.io/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/",
    },
    {
      publisher: "Kubernetes autoscaler",
      title: "“Cluster Autoscaler FAQ”",
      url: "https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md",
    },
    {
      publisher: "The Linux Kernel documentation",
      title: "“CFS Bandwidth Control”",
      url: "https://docs.kernel.org/scheduler/sched-bwc.html",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Default Prometheus metrics configuration in Azure Monitor”",
      url: "https://learn.microsoft.com/en-us/azure/azure-monitor/containers/prometheus-metrics-scrape-default",
    },
    {
      publisher: "Kubernetes perf-tests",
      title: "“clusterloader2/testing/load/modules”",
      url: "https://github.com/kubernetes/perf-tests/tree/master/clusterloader2/testing/load/modules",
      note: " (the ContainerCPU, ContainerMemory and ResourceSize queries in measurements.yaml, and the KubeletMemory and KubeletCPU queries in kubelet-measurements.yaml)",
    },
  ],
  related: [
    {
      title: "Kubernetes cost optimization: rebalance requests, then remove spare nodes",
      where: "Learn",
      href: "/kubernetes-cost-optimization",
    },
    {
      title: "Kubernetes overprovisioning: what it is and how to measure it",
      where: "Learn",
      href: "/learn/kubernetes-overprovisioning",
    },
    {
      title: "In-place pod resize: change CPU and memory without a restart",
      where: "Learn",
      href: "/learn/in-place-pod-resize",
    },
    {
      title: "OOMKilled exit code 137: why Kubernetes kills a container",
      where: "Learn",
      href: "/learn/oomkilled-exit-code-137",
    },
    {
      title: "How sizes are worked out",
      where: "Coral product guide",
      href: "/coral-guide#how-sizes-are-worked-out",
    },
  ],
};
