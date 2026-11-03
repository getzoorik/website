import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/kubernetes-headroom/1";

export const term: GlossaryTerm = {
  slug: "kubernetes-headroom",
  term: "Headroom (Kubernetes)",
  title: "What is headroom in Kubernetes?",
  meta: "Kubernetes headroom is spare node capacity kept free so new pods start at once. How placeholder pods hold it, and how much to keep.",
  h1: "What is headroom in Kubernetes?",
  card: "Kubernetes headroom is spare node capacity you keep free on purpose.",
  group: "kubernetes",
  product: "coral",
  published: "2026-10-25",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: "Kubernetes headroom is spare node capacity you keep free on purpose. New pods start in it at once, instead of waiting in Pending for a new node. The Kubernetes docs call it node overprovisioning.",
    },
    { kind: "svg", figure: figure1 },
  ],
  sections: [
    {
      id: "how-a-cluster-keeps-headroom",
      title: "Placeholder pods",
      blocks: [
        {
          kind: "p",
          text: [
            "You hold the space with ",
            { a: "placeholder pods", href: "/learn/cluster-autoscaler-overprovisioning" },
            " that do no work:",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              "Their ",
              { a: "requests", href: "/learn/glossary/kubernetes-resource-requests" },
              " set the size. Five pods of 0.1\u00a0CPU and 200\u00a0MiB hold 0.5\u00a0CPU and 1,000\u00a0MiB.",
            ],
            "They run at a negative priority. When a real pod can’t fit, Kubernetes evicts a placeholder first and the real pod takes its space.",
            "The placeholder goes Pending, and your autoscaler adds a node for it.",
            "By default, Cluster Autoscaler adds no nodes for pods below priority -10. So use -10 with it, not the -1000 in the Kubernetes docs’ example.",
          ],
        },
      ],
    },
    {
      id: "an-example-on-aws",
      title: "How much to keep",
      blocks: [
        {
          kind: "p",
          text: "Headroom trades cost for speed. The Amazon EKS guide sizes it from how often you need a new node and how long one takes to start.",
        },
        {
          kind: "p",
          text: "In its example, you need a node every 30\u00a0seconds and EC2 takes 30\u00a0seconds to start one. One spare node saves that 30\u00a0seconds of wait, for the cost of one extra EC2 instance.",
        },
        {
          kind: "p",
          text: "To let the scheduler pick the best zone, the guide suggests one spare node per availability zone.",
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            "Headroom is capacity you pay for and keep empty. How much you keep is a cost choice.",
            [
              { a: "Requests far above real use", href: "/learn/kubernetes-overprovisioning" },
              " leave space empty that new pods can’t use. Since the scheduler places pods by requests, they add nodes you never planned.",
            ],
            [
              { a: "Coral", href: "/coral" },
              " rebalances CPU and memory requests on AKS and EKS to match real use, so the same pods fit on fewer nodes. It removes the nodes you no longer need.",
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
      line: "How much of your nodes’ capacity pods request or use.",
      href: "/learn/glossary/kubernetes-cluster-utilization",
    },
    {
      title: "Node pool",
      line: "The nodes your autoscaler adds to.",
      href: "/learn/glossary/node-pool",
    },
  ],
  relatedTitle: "Related terms",
  next: {
    title: "Cluster Autoscaler overprovisioning",
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
