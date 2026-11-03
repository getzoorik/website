import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/kubernetes-cost-allocation/1";

export const term: GlossaryTerm = {
  slug: "kubernetes-cost-allocation",
  term: "Kubernetes cost allocation",
  title: "What is Kubernetes cost allocation?",
  meta: "Kubernetes cost allocation splits a shared cluster’s cost by pod, namespace and team. How it works on EKS with split cost allocation data, and on AKS.",
  h1: "What is Kubernetes cost allocation?",
  card: "Kubernetes cost allocation splits a shared cluster’s cost across the pods that run on it.",
  group: "finops-pricing",
  product: "coral",
  published: "2026-10-25",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: [
        "Kubernetes cost allocation splits a shared cluster’s cost across the pods that run on it. Pod costs then add up by namespace, label or team. A pod’s share follows its CPU and memory ",
        { a: "requests", href: "/learn/glossary/kubernetes-resource-requests" },
        ", or the larger of its requests and its use.",
      ],
    },
  ],
  sections: [
    {
      id: "how-aws-eks-split-cost-allocation-data",
      title: "On EKS",
      blocks: [
        {
          kind: "p",
          text: [
            "AWS calls it split cost allocation data. You opt in under Cost Management preferences. It splits each EC2 instance’s ",
            { a: "amortized cost", href: "/learn/glossary/amortized-cost" },
            " across its pods, and adds each pod’s cost to the Cost and Usage Report (CUR).",
          ],
        },
        {
          kind: "ul",
          items: [
            "It shows in CUR and CUR 2.0 only, not in Cost Explorer. Data can take up to 24 hours to appear.",
            "Allocation can use requests only, or the higher of requests and actual use, read from Amazon Managed Service for Prometheus.",
            "On GPU and other accelerated instances, it splits accelerator cost too, by requests only.",
            "Costs are tagged by cluster, namespace, node and workload, and by up to 50 pod labels once you activate them.",
          ],
        },
        {
          kind: "p",
          text: "In AWS’s example, four pods share one m5.xlarge node with 16 GB of memory. Each pod is charged for the larger of its memory request and its use:",
        },
        {
          kind: "ul",
          items: [
            "Pod1: requests 4 GB, uses 3 GB, charged for 4 GB.",
            "Pod2: requests 4 GB, uses 6 GB, charged for 6 GB.",
            "Pod3 and Pod4: request and use 2 GB each.",
            "Idle: the 2 GB no pod requests or uses. Its cost is split among the pods by the size of their shares.",
          ],
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "how-idle-cost-is-allocated-on-eks-and-aks",
      title: "On AKS",
      blocks: [
        {
          kind: "p",
          text: [
            "On AKS, the ",
            { a: "cost analysis add-on", href: "/learn/aks-cost-analysis" },
            " shows cluster costs by namespace and by asset in Microsoft Cost Management. It’s built on OpenCost. It needs the Standard or Premium tier, and an Enterprise Agreement or Microsoft Customer Agreement.",
          ],
        },
        {
          kind: "p",
          text: "Unlike AWS, it keeps idle cost separate, beside the other shared charges:",
        },
        {
          kind: "ul",
          items: [
            "Idle: capacity no workload uses.",
            "System: capacity AKS reserves on each node for the kubelet and container runtime.",
            "Service: charges such as the Uptime SLA and Microsoft Defender for Containers.",
            "Unallocated: cost it can’t assign to a namespace.",
          ],
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
            "Allocation shows who uses what. It doesn’t reduce the cost.",
            "A pod pays for its requests even when it uses less. That shows which teams hold spare capacity.",
            "Idle cost is node capacity no pod requests or uses. A large idle cost points to nodes you could remove.",
            [
              { a: "Coral", href: "/coral" },
              " rebalances CPU and memory requests on AKS and EKS to match real use, so the same pods fit on fewer nodes.",
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
      title: "Cost allocation tags",
      line: "Labels that split cost reports by team or app.",
      href: "/learn/glossary/cost-allocation-tags",
    },
    {
      title: "Kubernetes resource requests",
      line: "What a container asks for.",
      href: "/learn/glossary/kubernetes-resource-requests",
    },
  ],
  relatedTitle: "Related terms",
  next: {
    title: "AKS cost analysis",
    href: "/learn/aks-cost-analysis",
  },
  sources: [
    {
      publisher: "AWS",
      title: "“Understanding split cost allocation data”",
      url: "https://docs.aws.amazon.com/cur/latest/userguide/split-cost-allocation-data.html",
    },
    {
      publisher: "AWS",
      title: "“Enabling split cost allocation data”",
      url: "https://docs.aws.amazon.com/cur/latest/userguide/enabling-split-cost-allocation-data.html",
    },
    {
      publisher: "AWS",
      title: "“Example of split cost allocation data”",
      url: "https://docs.aws.amazon.com/cur/latest/userguide/example-split-cost-allocation-data.html",
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
