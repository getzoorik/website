import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/kubernetes-cpu-throttling/1";

export const term: GlossaryTerm = {
  slug: "kubernetes-cpu-throttling",
  term: "CPU throttling (Kubernetes)",
  title: "What is CPU throttling in Kubernetes?",
  meta: "CPU throttling in Kubernetes slows a container that reaches its CPU limit. See what causes it, a real example, and how quick fixes can add nodes you pay for.",
  h1: "What is CPU throttling in Kubernetes?",
  card: "CPU throttling in Kubernetes is when the Linux kernel holds back a container that hits its CPU limit.",
  group: "kubernetes",
  product: "coral",
  published: "2026-10-25",
  updated: "2026-11-01",
  definition: [
    {
      kind: "p",
      text: "CPU throttling in Kubernetes is when the Linux kernel holds back a container that hits its CPU limit. It keeps running, only slower.",
    },
    {
      kind: "p",
      text: "On Linux, a CPU limit becomes a quota of CPU time per period, 100 milliseconds by default. Once it’s spent, the container waits for the next period.",
    },
    { kind: "svg", figure: figure1 },
  ],
  sections: [
    {
      id: "what-causes-cpu-throttling-in-kubernetes",
      title: "What causes CPU throttling in Kubernetes",
      blocks: [
        {
          kind: "ul",
          items: [
            [
              "A ",
              { a: "CPU limit", href: "/learn/glossary/kubernetes-resource-limits" },
              " below the app’s peak use.",
            ],
            "Busy threads on several CPUs sharing one quota.",
            "A LimitRange default for containers with no limit.",
          ],
        },
      ],
    },
    {
      id: "how-to-check-for-cpu-throttling",
      title: "How to check for CPU throttling",
      blocks: [
        {
          kind: "p",
          text: "The Kubernetes docs run a pod with a 0.5\u00a0CPU request and a 1\u00a0CPU limit. Its app tries to use 2\u00a0CPUs.",
        },
        {
          kind: "p",
          text: [
            { code: "kubectl top pod" },
            " shows 974m, or 0.974\u00a0CPU, just under the limit. The docs say the container’s CPU use is being throttled.",
          ],
        },
        {
          kind: "p",
          text: [
            "So ",
            { code: "kubectl top" },
            " can’t show throttling by itself. Two Prometheus counters show it for each container:",
          ],
        },
        {
          kind: "ul",
          items: [
            [{ code: "container_cpu_cfs_periods_total" }, ": the periods that have passed."],
            [
              { code: "container_cpu_cfs_throttled_periods_total" },
              ": the periods in which the container was throttled.",
            ],
          ],
        },
        {
          kind: "p",
          text: "Divide the second by the first over the same window. Microsoft’s AKS docs give the share of throttled periods as:",
        },
        {
          kind: "p",
          text: [
            {
              code: "rate(container_cpu_cfs_throttled_periods_total[5m]) / rate(container_cpu_cfs_periods_total[5m]) * 100",
            },
          ],
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for your cloud cost",
      blocks: [
        {
          kind: "p",
          text: [
            "The scheduler places pods by ",
            { a: "requests", href: "/learn/glossary/kubernetes-resource-requests" },
            ". Raising a limit to stop Kubernetes CPU throttling can add nodes if the request rises too.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " rebalances CPU and memory requests on AKS and EKS to ",
            { a: "match real use", href: "/learn/kubernetes-pod-right-sizing" },
            ", so the same pods fit on fewer nodes. It never reduces a limit on regular pods.",
          ],
        },
        {
          kind: "p",
          text: [
            "The ",
            { a: "free assessment", href: "/assessment?p=coral" },
            " works out your own figure.",
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Resource limits",
      line: "Where throttling starts.",
      href: "/learn/glossary/kubernetes-resource-limits",
    },
    {
      title: "Resource requests",
      line: "How pods are placed.",
      href: "/learn/glossary/kubernetes-resource-requests",
    },
    {
      title: "Kubernetes cluster utilization",
      line: "How full nodes are.",
      href: "/learn/glossary/kubernetes-cluster-utilization",
    },
  ],
  next: { title: "Kubernetes pod right sizing", href: "/learn/kubernetes-pod-right-sizing" },
  sources: [
    {
      publisher: "Kubernetes",
      title: "“Resource Management for Pods and Containers”",
      url: "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/",
    },
    {
      publisher: "Kubernetes",
      title: "“Assign CPU Resources to Containers and Pods”",
      url: "https://kubernetes.io/docs/tasks/configure-pod-container/assign-cpu-resource/",
    },
    {
      publisher: "Kubernetes",
      title: "“Kubelet Configuration (v1beta1)”",
      url: "https://kubernetes.io/docs/reference/config-api/kubelet-config.v1beta1/",
    },
    {
      publisher: "The Linux Kernel documentation",
      title: "“CFS Bandwidth Control”",
      url: "https://www.kernel.org/doc/html/latest/scheduler/sched-bwc.html",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Troubleshoot CPU pressure in AKS clusters using PSI metrics”",
      url: "https://learn.microsoft.com/en-us/troubleshoot/azure/azure-kubernetes/availability-performance/troubleshoot-node-cpu-pressure-psi",
    },
  ],
};
