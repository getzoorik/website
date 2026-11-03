import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/kubernetes-resource-limits/1";

export const term: GlossaryTerm = {
  slug: "kubernetes-resource-limits",
  term: "Resource limits (pod limits)",
  title: "What are Kubernetes resource limits?",
  meta: "Kubernetes resource limits cap a container’s CPU and memory. How CPU limits throttle, how memory limits can lead to OOM kills, and when limits add nodes.",
  h1: "What are Kubernetes resource limits?",
  card: "A Kubernetes resource limit is the most CPU or memory a container may use.",
  group: "kubernetes",
  product: "coral",
  published: "2026-10-25",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: "A Kubernetes resource limit is the most CPU or memory a container may use. Kubernetes applies it, and the node’s kernel enforces it.",
    },
  ],
  sections: [
    {
      id: "kubernetes-resource-limits-cpu-and-memory",
      title: "CPU and memory limits",
      blocks: [
        {
          kind: "ul",
          items: [
            [
              "A container at its CPU limit is slowed, not killed. This is ",
              { a: "CPU throttling", href: "/learn/glossary/kubernetes-cpu-throttling" },
              ".",
            ],
            "A container over its memory limit may be stopped by an out of memory (OOM) kill. The kernel acts when it detects memory pressure, so the kill may come later.",
            "With no limit and no namespace default, a container can use all the free CPU or memory on its node.",
            [
              "Set a limit but no ",
              { a: "request", href: "/learn/glossary/kubernetes-resource-requests" },
              ", and Kubernetes uses the limit as the request, unless a default request applies.",
            ],
          ],
        },
      ],
    },
    {
      id: "an-example-from-the-kubernetes-docs",
      title: "Example",
      blocks: [
        {
          kind: "p",
          text: "The Kubernetes docs’ frontend pod has two containers. Each sets these requests and limits:",
        },
        {
          kind: "code",
          lang: "yaml",
          code: 'resources:\n  requests:\n    memory: "64Mi"\n    cpu: "250m"\n  limits:\n    memory: "128Mi"\n    cpu: "500m"',
        },
        {
          kind: "p",
          text: "250m is 250 millicpu, a quarter of one CPU. The pod’s limit is the sum of its containers’ limits: 1\u00a0CPU and 256\u00a0MiB.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for cloud cost",
      blocks: [
        {
          kind: "p",
          text: "The scheduler places pods by their requests, not their limits. Limits still affect cost:",
        },
        {
          kind: "ul",
          items: [
            "A limit set without a request becomes the request, so the scheduler counts the full limit.",
            "Tight limits throttle the app or cause OOM kills, so teams raise them. If the limit is also the request, fewer pods fit on each node.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " rebalances CPU and memory requests on AKS and EKS to match real use, so the same pods fit on fewer nodes. Its built-in policies never reduce a regular pod’s limits.",
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "CPU throttling",
      line: "What a tight CPU limit does.",
      href: "/learn/glossary/kubernetes-cpu-throttling",
    },
    {
      title: "Resource requests",
      line: "What the scheduler places pods by.",
      href: "/learn/glossary/kubernetes-resource-requests",
    },
    {
      title: "QoS class",
      line: "The class a pod’s requests and limits give it.",
      href: "/learn/glossary/kubernetes-qos-class",
    },
    {
      title: "Cluster utilization",
      line: "How much node capacity your pods request or use.",
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
      title: "“Assign Memory Resources to Containers and Pods”",
      url: "https://kubernetes.io/docs/tasks/configure-pod-container/assign-memory-resource/",
    },
  ],
};
