import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/kubernetes-resource-requests/1";

export const term: GlossaryTerm = {
  slug: "kubernetes-resource-requests",
  term: "Resource requests (pod requests)",
  title: "What are resource requests in Kubernetes?",
  meta: "A resource request in Kubernetes is the CPU or memory a container asks for. See how requests, not real use, decide how many nodes you run and pay for.",
  h1: "What are resource requests in Kubernetes?",
  card: "A resource request in Kubernetes is how much CPU, memory or another resource a container asks for.",
  group: "kubernetes",
  product: "coral",
  published: "2026-10-25",
  updated: "2026-11-01",
  definition: [
    {
      kind: "p",
      text: "A resource request in Kubernetes is how much CPU, memory or another resource a container asks for. The scheduler uses it to pick a node. Then the kubelet, the node’s agent, reserves at least that much.",
    },
    {
      kind: "p",
      text: "A pod goes on a node only if its requests fit in the room left for pods. Low real use doesn’t change that.",
    },
    { kind: "svg", figure: figure1 },
  ],
  sections: [
    {
      id: "cpu-and-memory-requests",
      title: "CPU and memory requests",
      blocks: [
        {
          kind: "ul",
          items: [
            "A CPU request in Kubernetes is measured in CPU units. 1\u00a0CPU is one physical or virtual core, and 100m is 0.1\u00a0CPU.",
            "Memory is in bytes. 64Mi is 64 mebibytes.",
            [
              "Set only a ",
              { a: "limit", href: "/learn/glossary/kubernetes-resource-limits" },
              ", and Kubernetes copies it as the request, unless a default request applies.",
            ],
            "Since Kubernetes v1.34 (beta), a whole pod can also have requests.",
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
          text: "A pod has two containers that each request 0.25\u00a0CPU and 64\u00a0MiB. The pod’s request is their sum: 0.5\u00a0CPU and 128\u00a0MiB.",
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for your cloud cost",
      blocks: [
        {
          kind: "p",
          text: "The Cluster Autoscaler, which adds and removes nodes, works from Kubernetes resource requests.",
        },
        {
          kind: "ul",
          items: [
            "It adds a node when pods can’t fit.",
            "By default, it removes a node only when its pods request under 50% of the node’s CPU and memory for pods.",
          ],
        },
        { kind: "p", text: "So your cloud cost follows requests." },
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " rebalances CPU and memory requests on AKS and EKS to match real use, so the same pods fit on fewer nodes. Then it drains the spare nodes, so your autoscaler can remove them. The ",
            { a: "free assessment", href: "/assessment?p=coral" },
            " works out your own figure.",
          ],
        },
        {
          kind: "p",
          text: [
            "For requests vs limits, and how to set each one, read ",
            { a: "Kubernetes pod right sizing", href: "/learn/kubernetes-pod-right-sizing" },
            ".",
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Resource limits",
      line: "The cap on use.",
      href: "/learn/glossary/kubernetes-resource-limits",
    },
    {
      title: "Cluster utilization",
      line: "The share of your nodes’ CPU and memory that pods request or use.",
      href: "/learn/glossary/kubernetes-cluster-utilization",
    },
    {
      title: "Vertical Pod Autoscaler",
      line: "Sets requests from real use.",
      href: "/learn/glossary/vertical-pod-autoscaler",
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
      publisher: "Kubernetes Cluster Autoscaler on GitHub",
      title: "“Frequently Asked Questions”",
      url: "https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md",
    },
  ],
};
