import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/daemonset/1";

export const term: GlossaryTerm = {
  slug: "daemonset",
  term: "DaemonSet",
  title: "What is a DaemonSet in Kubernetes?",
  meta: "A DaemonSet in Kubernetes runs one copy of a pod on each node it targets. See what it’s for, how it differs from a Deployment, and why its requests repeat.",
  h1: "What is a DaemonSet in Kubernetes?",
  card: "A DaemonSet in Kubernetes runs one copy of a pod on each node.",
  group: "kubernetes",
  product: "coral",
  published: "2026-10-25",
  updated: "2026-10-25",
  definition: [
    {
      kind: "p",
      text: "A DaemonSet in Kubernetes runs one copy of a pod on each node. A new node gets its copy. When a node leaves, Kubernetes removes its copy.",
    },
    { kind: "svg", figure: figure1 },
    { kind: "p", text: "Some nodes get no copy:" },
    {
      kind: "ul",
      items: [
        "A node that doesn’t match its node selector or node affinity.",
        "A node with a NoSchedule or NoExecute taint the pod doesn’t tolerate. A taint keeps pods away.",
      ],
    },
    {
      kind: "p",
      text: "The use of a DaemonSet is to run a helper on each node. The docs name three:",
    },
    { kind: "ul", items: ["cluster storage", "log collection", "node monitoring"] },
  ],
  sections: [
    {
      id: "a-kubernetes-daemonset-example",
      title: "A Kubernetes DaemonSet example",
      blocks: [
        {
          kind: "p",
          text: "The docs’ example runs the fluentd-elasticsearch image. Each copy requests 100m of CPU, or 0.1\u00a0CPU, and 200Mi of memory, or 200 mebibytes.",
        },
      ],
    },
    {
      id: "daemonset-vs-deployment",
      title: "DaemonSet vs Deployment",
      blocks: [
        { kind: "p", text: "Both keep pods running." },
        {
          kind: "ul",
          items: [
            "A Deployment runs as many copies as you set, on whatever nodes fit.",
            "A DaemonSet suits a helper that must run on all nodes, or on some.",
          ],
        },
      ],
    },
    {
      id: "why-it-matters-for-your-bill",
      title: "Why it matters for your bill",
      blocks: [
        {
          kind: "p",
          text: "The scheduler counts each pod’s request against its node, so a DaemonSet’s request takes room on every node you pay for. A container with only a limit usually gets that limit as its request.",
        },
        {
          kind: "p",
          text: "Say the docs’ example runs on 10\u00a0nodes. Its requests total 1\u00a0CPU and 2,000Mi, or 0.6\u00a0CPU and 1,200Mi on 6\u00a0nodes.",
        },
        {
          kind: "ul",
          items: [
            [
              { a: "Coral", href: "/coral" },
              " rebalances CPU and memory requests on AKS and EKS to match real use, so the same pods fit on ",
              { a: "fewer nodes", href: "/learn/kubernetes-node-size-best-practices" },
              ".",
            ],
            "It drains spare nodes so your autoscaler can remove them, and it never moves DaemonSet pods.",
            [
              "The ",
              { a: "free assessment", href: "/assessment?p=coral" },
              " works out your own figure.",
            ],
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Resource requests",
      line: "What each copy holds.",
      href: "/learn/glossary/kubernetes-resource-requests",
    },
    {
      title: "Max pods per node",
      line: "Each copy is a pod and uses one of the node’s pod slots.",
      href: "/learn/glossary/max-pods-per-node",
    },
    {
      title: "Node pool",
      line: "Its node selector can pick the pools.",
      href: "/learn/glossary/node-pool",
    },
  ],
  next: {
    title: "Kubernetes node size best practices: large or small nodes",
    href: "/learn/kubernetes-node-size-best-practices",
  },
  sources: [
    {
      publisher: "Kubernetes",
      title: "“DaemonSet”",
      url: "https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/",
    },
    {
      publisher: "Kubernetes",
      title: "“Resource Management for Pods and Containers”",
      url: "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/",
    },
    {
      publisher: "Kubernetes",
      title: "“Taints and Tolerations”",
      url: "https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/",
    },
    {
      publisher: "Kubernetes",
      title: "“Kubelet Configuration (v1beta1)”",
      url: "https://kubernetes.io/docs/reference/config-api/kubelet-config.v1beta1/",
    },
  ],
};
