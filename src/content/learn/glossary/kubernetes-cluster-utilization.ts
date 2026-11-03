import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/kubernetes-cluster-utilization/1";

export const term: GlossaryTerm = {
  slug: "kubernetes-cluster-utilization",
  term: "Kubernetes cluster utilization",
  title: "What is Kubernetes cluster utilization?",
  meta: "Kubernetes cluster utilization is the share of node CPU and memory that pods request or use. How to measure it, and what the unused part costs.",
  h1: "What is Kubernetes cluster utilization?",
  card: "Kubernetes cluster utilization is the share of your nodes’ CPU and memory that pods request or use.",
  group: "kubernetes",
  product: "coral",
  published: "2026-10-25",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: "Kubernetes cluster utilization is the share of your nodes’ CPU and memory that pods request or use. The rest is capacity you pay for and don’t use.",
    },
  ],
  sections: [
    {
      id: "requests-or-use",
      title: "How to measure it",
      blocks: [
        {
          kind: "ul",
          items: [
            [
              "By requests: the sum of pod requests, divided by the nodes’ ",
              { a: "allocatable", href: "/learn/kubernetes-allocatable-vs-capacity" },
              ", the room they have for pods.",
            ],
            [
              "By use: the CPU and memory in use, divided by the same amount. ",
              { a: "Metrics Server", href: "/learn/glossary/metrics-server" },
              " collects it.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            { code: "kubectl top node" },
            " shows each node’s CPU and memory in use, against its allocatable. Add ",
            { code: "--show-capacity" },
            " to use its total capacity instead.",
          ],
        },
        { kind: "h3", id: "requests-vs-use", title: "Requests vs use" },
        {
          kind: "p",
          text: "The scheduler places pods by requests. A node whose requests fill it takes no new pods, even when real use is low.",
        },
        {
          kind: "p",
          text: "Pods can also use more than they request. A container that sets only a limit gets that limit as its request, unless a default request applies.",
        },
      ],
    },
    {
      id: "ten-nodes-at-60",
      title: "Ten nodes at 60%",
      blocks: [
        {
          kind: "p",
          text: "The Amazon EKS guide gives this example: 10 nodes, each at 60% utilization. So 40% of the capacity you run isn’t used.",
        },
        {
          kind: "p",
          text: "With same-size nodes, that’s 4 nodes’ worth, yet no node is empty.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            "You pay for each node whole, used or not. AKS cost analysis calls the unused part “idle charges”.",
            [
              "Requests set too high leave unused capacity, “a large factor in total cluster costs”, says the EKS guide. That’s ",
              { a: "overprovisioning", href: "/learn/kubernetes-overprovisioning" },
              ".",
            ],
            [
              { a: "Coral", href: "/coral" },
              " rebalances CPU and memory requests on AKS and EKS to match real use. The same pods then fit on fewer nodes, and Coral removes the spare ones, without any downtime.",
            ],
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Resource requests",
      line: "What the scheduler counts.",
      href: "/learn/glossary/kubernetes-resource-requests",
    },
    {
      title: "Max pods per node",
      line: "A node can run out of pod slots before CPU.",
      href: "/learn/glossary/max-pods-per-node",
    },
    {
      title: "Headroom",
      line: "Spare capacity kept on purpose.",
      href: "/learn/glossary/kubernetes-headroom",
    },
    {
      title: "Vertical Pod Autoscaler (VPA)",
      line: "Recommends requests from real use, and can apply them.",
      href: "/learn/glossary/vertical-pod-autoscaler",
    },
  ],
  relatedTitle: "Related terms",
  next: {
    title: "Kubernetes overprovisioning",
    href: "/learn/kubernetes-overprovisioning",
  },
  sources: [
    {
      publisher: "Kubernetes",
      title: "“Resource Management for Pods and Containers”",
      url: "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/",
    },
    {
      publisher: "Kubernetes",
      title: "“Resource metrics pipeline”",
      url: "https://kubernetes.io/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/",
    },
    {
      publisher: "Kubernetes",
      title: "“kubectl top node”",
      url: "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_top/kubectl_top_node/",
    },
    {
      publisher: "Amazon Web Services",
      title: "“Compute and Autoscaling”",
      url: "https://docs.aws.amazon.com/eks/latest/best-practices/cost-opt-compute.html",
      note: " (Amazon EKS Best Practices Guide)",
    },
    {
      publisher: "Microsoft",
      title: "“Azure Kubernetes Service (AKS) cost analysis”",
      url: "https://learn.microsoft.com/en-us/azure/aks/cost-analysis",
    },
  ],
};
