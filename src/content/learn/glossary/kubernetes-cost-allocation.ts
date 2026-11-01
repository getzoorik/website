import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/kubernetes-cost-allocation/1";

export const term: GlossaryTerm = {
  slug: "kubernetes-cost-allocation",
  term: "Kubernetes cost allocation",
  title: "What is Kubernetes cost allocation?",
  meta: "Kubernetes cost allocation splits a shared cluster’s cost across pods and teams. See how AWS charges each pod for the larger of its request and its use.",
  h1: "What is Kubernetes cost allocation?",
  card: "Kubernetes cost allocation splits a shared cluster’s cost across its pods, then adds up pod costs by namespace, label or team.",
  group: "finops-pricing",
  product: "coral",
  published: "2026-10-25",
  updated: "2026-11-01",
  definition: [
    {
      kind: "p",
      text: [
        "Kubernetes cost allocation splits a shared cluster’s cost across its pods, then adds up pod costs by namespace, label or team. A pod’s share follows its ",
        { a: "requests", href: "/learn/glossary/kubernetes-resource-requests" },
        ", or the larger of its requests and its use.",
      ],
    },
  ],
  sections: [
    {
      id: "how-aws-eks-split-cost-allocation-data",
      title: "How AWS EKS split cost allocation data works",
      blocks: [
        {
          kind: "p",
          text: "Split cost allocation data is an opt-in feature for Amazon Elastic Kubernetes Service (EKS). It adds each pod’s cost to your AWS Cost and Usage Report. Its Kubernetes label support for cost allocation turns up to 50 labels per pod into cost allocation tags, which you then activate.",
        },
        {
          kind: "p",
          text: "In AWS’s example, four pods share a 16\u00a0GB m5.xlarge node. Each is charged for the larger of its memory request and use:",
        },
        {
          kind: "ul",
          items: [
            "Pod1: requests 4\u00a0GB, uses 3\u00a0GB, charged for 4\u00a0GB",
            "Pod2: requests 4\u00a0GB, uses 6\u00a0GB, charged for 6\u00a0GB",
            "Pod3 and Pod4: request and use 2\u00a0GB each",
            "Idle: 2\u00a0GB that no pod requests or uses",
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: [
            "AWS splits idle cost among the pods by share size. Azure Kubernetes Service (AKS) cost allocation comes from its ",
            { a: "cost analysis add-on", href: "/learn/aks-cost-analysis" },
            ", which shows idle cost separately.",
          ],
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for your cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            "Unused requests are charged too. That shows which teams hold spare capacity.",
            "Allocation splits the cost but doesn’t reduce it.",
            [
              { a: "Coral", href: "/coral" },
              " rebalances CPU and memory requests on AKS and EKS to match real use, so the same pods fit on fewer nodes.",
            ],
            [
              "Our library lists FinOps tools and other ",
              { a: "cloud cost optimization tools", href: "/cloud-cost-optimization-library" },
              ", with what each one does.",
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
      title: "Showback",
      line: "Teams see their share but aren’t charged.",
      href: "/learn/glossary/showback",
    },
    {
      title: "Cloud chargeback",
      line: "Teams pay their share.",
      href: "/learn/glossary/cloud-chargeback",
    },
    {
      title: "Kubernetes resource requests",
      line: "What a container asks for.",
      href: "/learn/glossary/kubernetes-resource-requests",
    },
    {
      title: "Kubernetes cluster utilization",
      line: "How full your nodes are.",
      href: "/learn/glossary/kubernetes-cluster-utilization",
    },
  ],
  next: {
    title: "AKS cost analysis: what the add-on shows and what it doesn’t",
    href: "/learn/aks-cost-analysis",
  },
  sources: [
    {
      publisher: "AWS",
      title: "“Example of split cost allocation data”",
      url: "https://docs.aws.amazon.com/cur/latest/userguide/example-split-cost-allocation-data.html",
    },
    {
      publisher: "AWS",
      title: "“Understanding split cost allocation data”",
      url: "https://docs.aws.amazon.com/cur/latest/userguide/split-cost-allocation-data.html",
    },
    {
      publisher: "AWS",
      title: "“Using Kubernetes labels for cost allocation in EKS”",
      url: "https://docs.aws.amazon.com/cur/latest/userguide/split-cost-allocation-data-kubernetes-labels.html",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Azure Kubernetes Service (AKS) cost analysis”",
      url: "https://learn.microsoft.com/en-us/azure/aks/cost-analysis",
    },
  ],
};
