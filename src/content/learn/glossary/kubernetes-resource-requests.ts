import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/kubernetes-resource-requests/1";

export const term: GlossaryTerm = {
  slug: "kubernetes-resource-requests",
  term: "Resource requests (pod requests)",
  title: "What are Kubernetes resource requests?",
  meta: "A Kubernetes resource request is the CPU or memory a container asks for. Its units, how the scheduler uses it, and why your cloud cost follows requests.",
  h1: "What are Kubernetes resource requests?",
  card: "A Kubernetes resource request is how much CPU, memory or another resource a container asks for.",
  group: "kubernetes",
  product: "coral",
  published: "2026-10-25",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: "A Kubernetes resource request is how much CPU, memory or another resource a container asks for. The scheduler uses it to pick a node, and the kubelet reserves at least that much for the container.",
    },
    {
      kind: "p",
      text: "A pod fits on a node only if its requests fit in the room left for pods. Low real use on the node doesn’t change that.",
    },
    { kind: "svg", figure: figure1 },
  ],
  sections: [
    {
      id: "cpu-and-memory-requests",
      title: "Units",
      blocks: [
        {
          kind: "ul",
          items: [
            "CPU is in CPU units. 1\u00a0CPU is one physical or virtual core, and 100m (100 millicpu) is 0.1\u00a0CPU.",
            "Memory is in bytes. 64Mi is 64 mebibytes, and 64M is 64 megabytes.",
            "Mind the case: 400m of memory is 0.4 bytes, not 400\u00a0MiB.",
          ],
        },
      ],
    },
    {
      id: "an-example-from-the-kubernetes-docs",
      title: "Pod requests",
      blocks: [
        {
          kind: "p",
          text: "A pod’s request is the sum of its containers’ requests. In the Kubernetes docs’ example, two containers each request 0.25\u00a0CPU and 64\u00a0MiB, so the pod requests 0.5\u00a0CPU and 128\u00a0MiB.",
        },
        {
          kind: "ul",
          items: [
            [
              "A container with a ",
              { a: "limit", href: "/learn/glossary/kubernetes-resource-limits" },
              " but no request gets the limit as its request, unless a default request applies.",
            ],
            "You can also set requests for a whole pod. This has been beta, and on by default, since Kubernetes v1.34.",
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
          text: "Your cloud cost follows requests, because the Cluster Autoscaler, which adds and removes nodes, works from them:",
        },
        {
          kind: "ul",
          items: [
            "It adds a node when pods can’t fit.",
            "By default, it removes a node only when the pods on it request under 50% of the CPU and memory it offers pods.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " rebalances CPU and memory requests on AKS and EKS to match real use, so the same pods fit on fewer nodes. Then it removes the nodes you don’t need.",
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Resource limits",
      line: "The most a container may use.",
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
  relatedTitle: "Related terms",
  next: { title: "Kubernetes requests vs limits", href: "/learn/kubernetes-pod-right-sizing" },
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
