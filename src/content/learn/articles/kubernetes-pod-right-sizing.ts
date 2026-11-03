import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/kubernetes-pod-right-sizing/1";
import { figure as figure2 } from "@/features/learn/figures/kubernetes-pod-right-sizing/2";
import { figure as figure3 } from "@/features/learn/figures/kubernetes-pod-right-sizing/3";

export const article: Article = {
  slug: "kubernetes-pod-right-sizing",
  title: "Kubernetes requests vs limits: right-size pods",
  meta: "Kubernetes requests vs limits: what each one controls, how to set requests from real CPU and memory use, and how to spot CPU throttling.",
  h1: "Kubernetes requests vs limits",
  deck: "The scheduler and the Cluster Autoscaler count requests, not use, so requests decide how many nodes you pay for.",
  card: "What requests and limits control, and how to set requests from real CPU and memory use.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes cost basics",
  published: "2026-10-21",
  updated: "2026-11-03",
  author: "shreya",
  cover: "/learn-covers/zoorik-learn-kubernetes-pod-right-sizing-1200x630.webp",
  coverAlt:
    "Kubernetes pod right sizing: the old request moves down, day by day, to a new request just above real use",
  short: [
    "A ",
    { a: "request", href: "/learn/glossary/kubernetes-resource-requests" },
    " is what the scheduler reserves for a container. A ",
    { a: "limit", href: "/learn/glossary/kubernetes-resource-limits" },
    " is the ceiling the kernel enforces. Set requests from real use: CPU at a high percentile and memory at the peak, both plus headroom. Don’t reduce limits until you know why they were set.",
  ],
  sections: [
    {
      id: "kubernetes-requests-vs-limits-what-each-one",
      title: "Requests vs limits",
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
              "Scheduling. On cgroup v2 nodes, the runtime may also use it as a hint to set memory.min and memory.low",
              "Allowed while the node has memory free. If the node runs short, the pod is likely to be evicted",
            ],
            [
              "Memory limit",
              "A memory ceiling the kernel enforces",
              "The kernel may kill the container (an OOM kill) once it detects memory pressure",
            ],
          ],
        },
        {
          kind: "p",
          text: "Only the request decides where a pod can run. Going past a CPU request costs nothing while the node has idle CPU. Memory limits are “enforced reactively”, in the documentation’s words: a container may pass its limit for a while, then be killed.",
        },
        {
          kind: "p",
          text: "Write CPU below one core in millicpu: 100m is 0.1 CPU, and 1m is the finest Kubernetes accepts. Write memory with binary suffixes such as Mi and Gi. Case matters: a memory request of 400m is 0.4 bytes, and 400Mi is 400 mebibytes.",
        },
        {
          kind: "callout",
          label: "For engineers",
          text: "If a container sets a limit but no request, and nothing applies a default at admission, Kubernetes copies the limit into the request.",
        },
      ],
    },
    {
      id: "why-requests-not-use-set-what-you",
      title: "Why requests drive cost",
      blocks: [
        {
          kind: "p",
          text: "Picture a Deployment of 20 replicas, each requesting 1 CPU and using 150m (0.15 CPU). Together they use 3 CPU but reserve 20 CPU of node capacity, and you pay for the nodes that provide it.",
        },
        {
          kind: "p",
          text: "The scheduler places a pod on a node only while the requests there stay below the node’s capacity. It refuses the pod even when real use on that node is very low.",
        },
        {
          kind: "p",
          text: [
            "The Cluster Autoscaler counts requests too. It ",
            {
              a: "considers a node for removal",
              href: "/learn/cluster-autoscaler-not-scaling-down",
            },
            " only when its pods’ CPU and memory requests each sum to under 50% of ",
            { a: "allocatable capacity", href: "/learn/kubernetes-allocatable-vs-capacity" },
            ". That 50% is the default ",
            { code: "--scale-down-utilization-threshold" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "When requests sit far above use across a cluster, that is ",
            { a: "Kubernetes overprovisioning", href: "/learn/kubernetes-overprovisioning" },
            ". Right-sizing pods brings it back down.",
          ],
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "Say 150m is each replica’s 7-day 95th percentile (P95), and the Deployment has no Horizontal Pod Autoscaler (HPA). The step 1 rule below, P95 plus 10%, gives 150m × 1.1 = 165m. The 20 replicas then request 3.3 CPU instead of 20. The 16.7 CPU this frees reduces cost once it lets a node go.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "how-to-read-real-cpu-and-memory",
      title: "Read real use",
      blocks: [
        {
          kind: "p",
          text: [
            { code: "kubectl top pod" },
            " shows only the current reading, which Metrics Server serves to the ",
            { a: "HPA", href: "/learn/glossary/horizontal-pod-autoscaler" },
            " and the ",
            { a: "Vertical Pod Autoscaler (VPA)", href: "/learn/glossary/vertical-pod-autoscaler" },
            ". Sizing needs history that includes last Monday’s peak. Get it from a monitoring system such as Prometheus, scraping cAdvisor, the container-metrics daemon built into the kubelet.",
          ],
        },
        {
          kind: "p",
          text: [
            "Two series carry what you need. The rate of ",
            { code: "container_cpu_usage_seconds_total" },
            " is cores in use. ",
            { code: "container_memory_working_set_bytes" },
            " is the working set: an estimate of the memory in use that can’t be freed under pressure.",
          ],
        },
        {
          kind: "p",
          text: "On Azure Kubernetes Service (AKS), the Azure Monitor metrics add-on scrapes cAdvisor by default and keeps both series, plus the throttling counters used below.",
        },
        {
          kind: "p",
          text: "These queries return the highest CPU percentile and the memory peak across one Deployment’s pods:",
        },
        {
          kind: "code",
          lang: "promql",
          code: 'max(\n  quantile_over_time(0.95,\n    rate(container_cpu_usage_seconds_total{\n      namespace="<namespace>",\n      pod=~"<deployment>-[a-z0-9]+-[a-z0-9]{5}",\n      container="<container>"\n    }[5m])[7d:5m]\n  )\n)\n\nmax(\n  max_over_time(container_memory_working_set_bytes{\n    namespace="<namespace>",\n    pod=~"<deployment>-[a-z0-9]+-[a-z0-9]{5}",\n    container="<container>"\n  }[7d])\n)',
        },
        {
          kind: "p",
          text: "Match the window to the workload’s cycle: a week or more for a service that’s busy on weekdays, several runs for a batch job. A startup burst lifts a CPU percentile with every restart, so look at it separately.",
        },
        {
          kind: "p",
          text: [
            "The VPA can make these recommendations too. ",
            { a: "HPA vs VPA", href: "/learn/vpa-vs-hpa" },
            " covers running it beside an HPA.",
          ],
        },
      ],
    },
    {
      id: "kubernetes-pod-right-sizing-step-by-step",
      title: "Pod right sizing, step by step",
      blocks: [
        {
          kind: "ol",
          items: [
            [
              { b: "Set the CPU request" },
              " from a high percentile plus headroom, such as the 7-day P95 plus 10%. A CPU request below the peak can’t get a container killed: it borrows idle CPU at busy moments.",
            ],
            [
              { b: "Set the memory request" },
              " from the peak of a window that includes the busiest day, plus headroom. A pod whose container uses more than its memory request is likely to be evicted when the node runs short of memory.",
            ],
            [
              { b: "Don’t reduce limits" },
              " on the first pass. If a memory peak already sits close to the memory limit, raise the limit first: that container is one spike from an OOM kill.",
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
              ", if the workload has one. It measures CPU use as a share of the request, so the same load reads higher against a smaller request. If any container in the pod has no CPU request, the HPA can’t act on CPU.",
            ],
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "A smaller request can add a pod. Four replicas using 300m each read 40% of a 750m request, but 60% of a 500m one. At a 50% target, the HPA then asks for 5 replicas. At a 75% target, it keeps four.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "ol",
          start: 6,
          items: [
            [
              { b: "Apply through the Pod template" },
              ", in your manifest or Git, and let the controller replace the pods. Or use ",
              { a: "in-place resize", href: "/learn/in-place-pod-resize" },
              ", stable since Kubernetes 1.35, through the pod’s ",
              { code: "/resize" },
              " subresource. For the worked example, ",
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
      title: "CPU throttling",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "CPU throttling", href: "/learn/glossary/kubernetes-cpu-throttling" },
            " is the Linux kernel holding back a container that hits its CPU limit. The kernel enforces the limit as a quota of CPU time per period, and the default period is 100 ms.",
          ],
        },
        {
          kind: "p",
          text: "A 500m limit allows 50 ms of CPU time in each 100 ms. Once that quota is spent, the container’s threads wait for the next period.",
        },
        {
          kind: "p",
          text: "Multi-threaded services hit this first, because every thread draws on the same quota. Four busy threads on four cores spend the whole 50 ms quota in 12.5 ms of wall-clock time, then wait 87.5 ms.",
        },
        {
          kind: "p",
          text: "A 5-minute CPU rate averages those bursts away. If one period in ten is busy like this, the rate reads 50m, a tenth of the limit, though every busy period was throttled.",
        },
        { kind: "svg", figure: figure3 },
        {
          kind: "p",
          text: [
            "The kernel counts elapsed and throttled periods for each container. cAdvisor exposes them as ",
            { code: "container_cpu_cfs_periods_total" },
            " and ",
            { code: "container_cpu_cfs_throttled_periods_total" },
            ". Their ratio is the share of periods in which the container hit its limit. Watch it after any change to a CPU limit:",
          ],
        },
        {
          kind: "code",
          lang: "promql",
          code: 'rate(container_cpu_cfs_throttled_periods_total{\n  namespace="<namespace>", container="<container>"\n}[5m])\n/\nrate(container_cpu_cfs_periods_total{\n  namespace="<namespace>", container="<container>"\n}[5m])',
        },
        {
          kind: "p",
          text: "When a throttled service is also slow, look at its limit first. A bigger request reserves more of a node but leaves the ceiling where it was.",
        },
        {
          kind: "p",
          text: "A higher CPU limit, or none, lets the container use idle CPU when it bursts, at the cost of CPU its neighbours might want. When you right-size, change requests, and leave CPU limits for a separate change.",
        },
      ],
    },
    {
      id: "rollback-rules-that-come-before-any-saving",
      title: "Rollback rules",
      blocks: [
        { kind: "p", text: "Set these before you change anything:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Change one workload at a time." },
              " Sizing a whole namespace at once hides which workload caused the trouble.",
            ],
            [
              { b: "Decide what makes you revert" },
              " before the change: OOMKilled restarts, failing probes, slower responses at busy times, or a jump in HPA replicas.",
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
            " shows an OOM kill as Reason OOMKilled, with a rising Restart Count (",
            { a: "what to do after an OOM kill", href: "/learn/oomkilled-exit-code-137" },
            "). Watch a full cycle of the workload, a week for most services, before you change it again.",
          ],
        },
      ],
    },
    {
      id: "how-coral-rebalances-requests-from-observed-use",
      title: "Where Coral fits",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " is Zoorik’s Kubernetes cost optimization for AKS and Amazon Elastic Kubernetes Service (EKS). It rebalances each container’s CPU and memory requests from real use, on a policy you choose, without any downtime.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Sizing." },
              " CPU comes from a high percentile of recent use and memory from the recent peak, each plus headroom.",
            ],
            [
              { b: "The HPA keeps scaling." },
              " The HPA decides how many pods run, and Coral decides how big each pod is. For a CPU-based HPA, Coral replays past load through that HPA’s own settings before it picks the request. A smaller request wins only if its saving beats the cost of unserved load and extra scaling.",
            ],
            [
              { b: "Limits stay or rise." },
              " On the built-in policies, Coral never reduces the CPU or memory limit of a regular (",
              { a: "non-Guaranteed", href: "/learn/glossary/kubernetes-qos-class" },
              ") pod, and never leaves a limit below its request. A custom policy can set limits its own way.",
            ],
            [
              { b: "How a change lands." },
              " Coral only recommends until you switch on “Automatically optimize” for a policy or a workload. Your manifest never changes. Coral sets new requests as pods start. It resizes running pods in place on 1.33+ nodes, or else restarts them one at a time within their ",
              { a: "PodDisruptionBudgets", href: "/learn/glossary/pod-disruption-budget" },
              ".",
            ],
            [
              { b: "Guardrails." },
              " Early reductions come in small steps while data builds up. Every change stays within your minimums, LimitRanges and quotas.",
            ],
            [
              { b: "Going back up." },
              " A usage surge or an OOM kill raises the request within minutes.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "On our own AKS development cluster, Coral had rebalanced the requests of 14 apps by 12 October 2026. The CPU they reserve fell 45%, from 0.78 to 0.43 cores, and memory 16%, from 6.4 to 5.4 GiB. ",
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
      note: " (the ContainerCPU and ContainerMemory queries in measurements.yaml)",
    },
  ],
  related: [
    {
      title: "Kubernetes cost optimization",
      where: "Learn",
      href: "/kubernetes-cost-optimization",
    },
    {
      title: "Kubernetes overprovisioning",
      where: "Learn",
      href: "/learn/kubernetes-overprovisioning",
    },
    {
      title: "In-place pod resize in Kubernetes",
      where: "Learn",
      href: "/learn/in-place-pod-resize",
    },
    {
      title: "Exit code 137 (OOMKilled) in Kubernetes",
      where: "Learn",
      href: "/learn/oomkilled-exit-code-137",
    },
    {
      title: "How Coral sizes pods",
      where: "Coral product guide",
      href: "/coral-guide#how-sizes-are-worked-out",
    },
  ],
  relatedTitle: "More on requests and limits",
};
