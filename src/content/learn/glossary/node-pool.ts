import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/node-pool/1";

export const term: GlossaryTerm = {
  slug: "node-pool",
  term: "Node pool",
  title: "What is a node pool in Kubernetes?",
  meta: "A node pool in Kubernetes is a group of nodes with one configuration. See how AKS node pools and EKS node groups differ, and how each sets what nodes cost.",
  h1: "What is a node pool in Kubernetes?",
  card: "A node pool in Kubernetes is a group of nodes that share one configuration.",
  group: "kubernetes",
  product: "coral",
  published: "2026-10-25",
  updated: "2026-11-01",
  definition: [
    {
      kind: "p",
      text: "A node pool in Kubernetes is a group of nodes that share one configuration. Each node is an Azure virtual machine (VM) on AKS, or an EC2 instance on EKS.",
    },
  ],
  sections: [
    {
      id: "node-pool-vs-node-group",
      title: "AKS node pool vs EKS managed node group",
      blocks: [
        {
          kind: "ul",
          items: [
            "An AKS node pool runs on a Virtual Machine Scale Set by default, with one VM size.",
            "An AKS Virtual Machines node pool can mix up to five sizes from one family.",
            [
              "EKS’s closest match, the managed node group, runs on an EC2 Auto Scaling group and can list several instance types. To switch them later, see ",
              {
                a: "how to change an EKS node group instance type",
                href: "/learn/change-eks-node-group-instance-type",
              },
              ".",
            ],
            "Its nodes are all on-demand or all spot.",
          ],
        },
      ],
    },
    {
      id: "aks-system-node-pool-vs-user-node",
      title: "AKS system node pool vs user node pool",
      blocks: [
        {
          kind: "p",
          text: "Every AKS cluster needs a system node pool for critical pods such as CoreDNS.",
        },
        {
          kind: "ul",
          items: [
            "System nodes run Linux, with at least 4 virtual CPUs and 4\u00a0GB of memory.",
            "Each system pool needs at least two nodes. Microsoft recommends three.",
            "User pools run your apps on Linux or Windows, and can scale to zero.",
          ],
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for your cloud cost",
      blocks: [
        {
          kind: "p",
          text: "You pay for nodes, not pools. AKS charges standard VM prices, and EKS adds no fee for managed node groups.",
        },
        {
          kind: "ul",
          items: [
            [
              "Each node’s price depends on its ",
              { a: "VM size or instance type", href: "/learn/kubernetes-node-size-best-practices" },
              ", and whether it’s ",
              { a: "spot", href: "/learn/glossary/spot-instance" },
              " or ",
              { a: "on-demand", href: "/learn/glossary/on-demand-instance" },
              ". The ",
              { a: "EKS and AKS pricing calculator", href: "/eks-and-aks-pricing-calculator" },
              " gives one node’s monthly list price.",
            ],
            [
              { a: "Coral", href: "/coral" },
              " rebalances CPU and memory requests on AKS and EKS to match real use. It drains spare nodes so your autoscaler can remove them.",
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
      title: "Max pods per node",
      line: "Set per pool on AKS.",
      href: "/learn/glossary/max-pods-per-node",
    },
    {
      title: "Spot instance",
      line: "On AKS, user pools only.",
      href: "/learn/glossary/spot-instance",
    },
    {
      title: "EKS Auto Mode",
      line: "AWS runs the nodes, for a fee.",
      href: "/learn/glossary/eks-auto-mode",
    },
  ],
  next: {
    title: "Kubernetes node size best practices: large or small nodes",
    href: "/learn/kubernetes-node-size-best-practices",
  },
  sources: [
    {
      publisher: "Microsoft Learn",
      title: "“Azure Kubernetes Service (AKS) Core Concepts”",
      url: "https://learn.microsoft.com/en-us/azure/aks/core-aks-concepts",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Use System Node Pools in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/use-system-pools",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Use Virtual Machines Node Pools in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/virtual-machines-node-pools",
    },
    {
      publisher: "AWS",
      title: "“Simplify node lifecycle with managed node groups”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/managed-node-groups.html",
    },
  ],
};
