import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/node-pool/1";

export const term: GlossaryTerm = {
  slug: "node-pool",
  term: "Node pool",
  title: "What is a node pool in Kubernetes?",
  meta: "A node pool is a group of Kubernetes nodes that share one configuration. How AKS node pools and EKS node groups work, and what their nodes cost.",
  h1: "What is a node pool in Kubernetes?",
  card: "A node pool is a group of nodes in a Kubernetes cluster that share one configuration.",
  group: "kubernetes",
  product: "coral",
  published: "2026-10-25",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: "A node pool is a group of nodes in a Kubernetes cluster that share one configuration. Each node is an Azure virtual machine (VM) on AKS, or an EC2 instance on EKS.",
    },
  ],
  sections: [
    {
      id: "node-pool-vs-node-group",
      title: "Node pool vs node group",
      blocks: [
        {
          kind: "p",
          text: "AKS groups nodes into node pools, and EKS groups them into node groups. The idea is the same.",
        },
        { kind: "h3", id: "how-an-aks-node-pool-works", title: "AKS node pools" },
        {
          kind: "ul",
          items: [
            [
              "By default, a pool runs on a Virtual Machine Scale Set, with one VM size. To change the size later, see ",
              {
                a: "how to change an AKS node pool VM size",
                href: "/learn/change-aks-node-pool-vm-size",
              },
              ".",
            ],
            "A Virtual Machines node pool can mix up to five sizes from one VM family.",
          ],
        },
        {
          kind: "h3",
          id: "how-an-eks-managed-node-group-works",
          title: "EKS node groups",
        },
        {
          kind: "p",
          text: "Each EKS node group runs its nodes in an EC2 Auto Scaling group. In a managed node group, EKS creates, updates and removes the instances for you. With self-managed nodes, you maintain them yourself.",
        },
        {
          kind: "ul",
          items: [
            [
              "A managed node group can list several instance types. To switch them later, see ",
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
      title: "System vs user node pools",
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
      title: "Why it matters for cloud cost",
      blocks: [
        {
          kind: "p",
          text: "You pay for nodes, not pools. AKS charges nodes at standard VM prices, and EKS adds no fee for managed node groups.",
        },
        {
          kind: "ul",
          items: [
            [
              "Each node’s price depends on its ",
              { a: "VM size or instance type", href: "/learn/kubernetes-node-size-best-practices" },
              ", and on whether it runs as ",
              { a: "spot", href: "/learn/glossary/spot-instance" },
              ", ",
              { a: "on-demand", href: "/learn/glossary/on-demand-instance" },
              " or under a commitment. The ",
              { a: "EKS and AKS pricing calculator", href: "/eks-and-aks-pricing-calculator" },
              " lists monthly prices for common node sizes.",
            ],
            "A system pool’s two-node minimum costs money even when the cluster is idle.",
            [
              { a: "Coral", href: "/coral" },
              " rebalances CPU and memory requests on AKS and EKS to match real use. It removes the nodes you don’t need, without any downtime.",
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
  relatedTitle: "Related terms",
  next: {
    title: "Kubernetes node size best practices",
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
    {
      publisher: "AWS",
      title: "“Maintain nodes yourself with self-managed nodes”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/worker.html",
    },
    {
      publisher: "AWS",
      title: "“Savings Plans types”",
      url: "https://docs.aws.amazon.com/savingsplans/latest/userguide/plan-types.html",
    },
  ],
};
