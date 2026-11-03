import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/kubernetes-cpu-throttling/1";

export const term: GlossaryTerm = {
  slug: "kubernetes-cpu-throttling",
  term: "CPU throttling (Kubernetes)",
  title: "What is CPU throttling in Kubernetes?",
  meta: "CPU throttling in Kubernetes is when the kernel pauses a container at its CPU limit. The causes, how to measure it, and how to fix it.",
  h1: "What is CPU throttling in Kubernetes?",
  card: "CPU throttling in Kubernetes is when the Linux kernel pauses a container that reaches its CPU limit.",
  group: "kubernetes",
  product: "coral",
  published: "2026-10-25",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: "CPU throttling in Kubernetes is when the Linux kernel pauses a container that reaches its CPU limit. The container keeps running, only slower.",
    },
    {
      kind: "p",
      text: "On Linux, a CPU limit becomes a quota of CPU time per period, 100 milliseconds by default. Once the quota is used up, the container waits for the next period.",
    },
    { kind: "svg", figure: figure1 },
  ],
  sections: [
    {
      id: "what-causes-cpu-throttling-in-kubernetes",
      title: "Causes",
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
            "A LimitRange default limit, given to containers that set none.",
          ],
        },
      ],
    },
    {
      id: "how-to-check-for-cpu-throttling",
      title: "How to check for it",
      blocks: [
        {
          kind: "p",
          text: [
            "In the Kubernetes docs’ example, a pod has a 0.5\u00a0CPU request and a 1\u00a0CPU limit, and its app tries to use 2\u00a0CPUs. ",
            { code: "kubectl top pod" },
            " shows 974m (0.974 CPU), just under the limit, while the container is throttled. So ",
            { code: "kubectl top" },
            " can’t show throttling by itself.",
          ],
        },
        {
          kind: "h3",
          id: "prometheus-metrics-for-cpu-throttling",
          title: "Prometheus metrics",
        },
        { kind: "p", text: "Two Prometheus counters show throttling for each container:" },
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
          text: "Microsoft’s AKS docs give the share of throttled periods, as a percentage:",
        },
        {
          kind: "code",
          lang: "promql",
          code: "rate(container_cpu_cfs_throttled_periods_total[5m]) / rate(container_cpu_cfs_periods_total[5m]) * 100",
        },
      ],
    },
    {
      id: "how-to-fix-cpu-throttling",
      title: "How to fix it",
      blocks: [
        {
          kind: "ul",
          items: [
            "Raise the CPU limit to cover the app’s peak.",
            "Or remove it, as Microsoft’s AKS guidance suggests. Containers then share a node’s CPU in proportion to their requests.",
          ],
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for cloud cost",
      blocks: [
        {
          kind: "p",
          text: [
            "The scheduler places pods by their ",
            { a: "requests", href: "/learn/glossary/kubernetes-resource-requests" },
            ", not their limits. Raising a limit alone adds no nodes. Raising the request with it can.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " rebalances CPU and memory requests on AKS and EKS to ",
            { a: "match real use", href: "/learn/kubernetes-pod-right-sizing" },
            ", so the same pods fit on fewer nodes. Its built-in policies never reduce a regular pod’s CPU limit.",
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
      title: "QoS class",
      line: "The class a pod’s requests and limits give it.",
      href: "/learn/glossary/kubernetes-qos-class",
    },
    {
      title: "Kubernetes cluster utilization",
      line: "How full nodes are.",
      href: "/learn/glossary/kubernetes-cluster-utilization",
    },
  ],
  relatedTitle: "Related terms",
  next: { title: "Kubernetes requests vs limits", href: "/learn/kubernetes-pod-right-sizing" },
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
