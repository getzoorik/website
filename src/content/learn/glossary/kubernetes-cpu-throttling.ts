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
  updated: "2026-10-26",
  definition: [
    {
      kind: "p",
      text: "CPU throttling in Kubernetes is when the Linux kernel holds back a container that hits its CPU limit. It keeps running, only slower.",
    },
    {
      kind: "p",
      text: "On Linux nodes, the kubelet, the node’s agent, turns a CPU limit into a quota of CPU time per period. A period is 100 milliseconds by default. Once the container uses up its quota, it waits for the next period.",
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
              " below what the app needs at peak.",
            ],
            "Busy threads on several CPUs, which share one quota and spend it early.",
            "A default limit from a LimitRange, for containers that set none.",
          ],
        },
      ],
    },
    {
      id: "an-example-from-the-kubernetes-docs",
      title: "An example from the Kubernetes docs",
      blocks: [
        {
          kind: "p",
          text: "The docs run a pod with a 0.5\u00a0CPU request and a 1\u00a0CPU limit. Its app tries to use 2\u00a0CPUs.",
        },
        {
          kind: "p",
          text: [
            { code: "kubectl top pod" },
            " shows 974m, or 0.974\u00a0CPU, just under the limit. The docs say the container’s CPU use is being throttled.",
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
          text: "Kubernetes CPU throttling slows your app, and three quick fixes can add nodes:",
        },
        {
          kind: "ul",
          items: [
            "Raise the request with the limit.",
            "Raise a limit that has no request, since Kubernetes uses it as the request.",
            "Remove the limit and set a larger request.",
          ],
        },
        {
          kind: "p",
          text: [
            "The scheduler places pods by their ",
            { a: "requests", href: "/learn/glossary/kubernetes-resource-requests" },
            ", so bigger requests mean fewer pods per node and more nodes to pay for.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " rebalances CPU and memory requests on AKS and EKS to ",
            { a: "match real use", href: "/learn/kubernetes-pod-right-sizing" },
            ", so the same pods fit on fewer nodes. On regular pods, it never reduces a CPU or memory limit.",
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
      line: "The scheduler places pods by them, so they decide how many fit.",
      href: "/learn/glossary/kubernetes-resource-requests",
    },
    {
      title: "Kubernetes cluster utilization",
      line: "How much node capacity pods request or use.",
      href: "/learn/glossary/kubernetes-cluster-utilization",
    },
  ],
  next: { title: "Kubernetes pod rebalancing", href: "/learn/kubernetes-pod-right-sizing" },
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
  ],
};
