import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/kubernetes-headroom/1";

export const term: GlossaryTerm = {
  slug: "kubernetes-headroom",
  term: "Headroom (Kubernetes)",
  title: "What is headroom in Kubernetes?",
  meta: "Kubernetes headroom is spare node capacity you keep free so new pods start without waiting. See how placeholder pods hold it and how to size it against cost.",
  h1: "What is headroom in Kubernetes?",
  card: "Kubernetes headroom is spare node capacity you keep free on purpose.",
  group: "kubernetes",
  product: "coral",
  published: "2026-10-25",
  updated: "2026-10-25",
  definition: [
    {
      kind: "p",
      text: "Kubernetes headroom is spare node capacity you keep free on purpose. New pods start in it at once, not waiting in Pending for a new node. The Kubernetes docs call this node overprovisioning.",
    },
    { kind: "svg", figure: figure1 },
  ],
  sections: [
    {
      id: "how-a-cluster-keeps-headroom",
      title: "How a cluster keeps headroom",
      blocks: [
        {
          kind: "p",
          text: [
            "You hold the space with ",
            { a: "placeholder pods", href: "/learn/cluster-autoscaler-overprovisioning" },
            " that do no work.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              "Their ",
              { a: "requests", href: "/learn/glossary/kubernetes-resource-requests" },
              " set the size: five pods of 0.1\u00a0CPU and 200\u00a0MiB hold 0.5\u00a0CPU and 1,000\u00a0MiB.",
            ],
            "Their priority is negative. So when a real pod can’t fit, Kubernetes removes one first.",
            "The placeholder goes Pending. Your autoscaler then adds a node.",
            "By default, Cluster Autoscaler adds no nodes for pods below priority -10. Use -10 with it, not the Kubernetes docs’ -1000.",
          ],
        },
      ],
    },
    {
      id: "an-example-on-aws",
      title: "An example on AWS",
      blocks: [
        {
          kind: "p",
          text: "The Amazon EKS guide calls headroom for Kubernetes on AWS a trade between speed and cost. In its example, you need a node every 30\u00a0seconds. EC2 takes 30\u00a0seconds to start one.",
        },
        {
          kind: "p",
          text: "So one spare node saves 30\u00a0seconds of wait, for the cost of one extra EC2 instance. Comparing those two times is a simple Kubernetes headroom calculator.",
        },
      ],
    },
    {
      id: "why-it-matters-for-your-bill",
      title: "Why it matters for your bill",
      blocks: [
        {
          kind: "ul",
          items: [
            "Headroom in a Kubernetes cluster is capacity you pay for and keep empty. So your Kubernetes headroom policy is a cost choice.",
            "Requests far above real use add nodes you never planned, since the scheduler places pods by requests.",
            [
              { a: "Coral", href: "/coral" },
              " rebalances CPU and memory requests on AKS and EKS to match real use. Then the same pods fit on fewer nodes, and Coral drains the spare ones so your autoscaler can remove them.",
            ],
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
      line: "They set what a placeholder holds.",
      href: "/learn/glossary/kubernetes-resource-requests",
    },
    {
      title: "Cluster utilization",
      line: "Headroom sits unused.",
      href: "/learn/glossary/kubernetes-cluster-utilization",
    },
    {
      title: "Node pool",
      line: "The nodes your autoscaler grows for a waiting placeholder.",
      href: "/learn/glossary/node-pool",
    },
  ],
  next: {
    title: "Cluster Autoscaler overprovisioning with placeholder pods",
    href: "/learn/cluster-autoscaler-overprovisioning",
  },
  sources: [
    {
      publisher: "Kubernetes",
      title: "“Overprovision Node Capacity For A Cluster”",
      url: "https://kubernetes.io/docs/tasks/administer-cluster/node-overprovisioning/",
    },
    {
      publisher: "Kubernetes Autoscaler",
      title: "“Cluster Autoscaler FAQ”",
      url: "https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md",
    },
    {
      publisher: "Kubernetes",
      title: "“Resource Management for Pods and Containers”",
      url: "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/",
    },
    {
      publisher: "Amazon Web Services",
      title: "“Cluster Autoscaler”",
      url: "https://docs.aws.amazon.com/eks/latest/best-practices/cas.html",
      note: " (Amazon EKS Best Practices Guide)",
    },
  ],
};
