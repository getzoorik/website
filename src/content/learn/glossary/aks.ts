import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/aks/1";

export const term: GlossaryTerm = {
  slug: "aks",
  term: "AKS (Azure Kubernetes Service)",
  title: "What is AKS (Azure Kubernetes Service)?",
  meta: "Azure AKS is Microsoft’s managed Kubernetes service. What an AKS cluster is made of, Automatic vs Standard, and what you pay for.",
  h1: "What is AKS (Azure Kubernetes Service)?",
  card: "Azure Kubernetes Service (AKS) is Microsoft’s managed Kubernetes service in Azure.",
  group: "kubernetes",
  product: "coral",
  published: "2026-11-02",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: "Azure Kubernetes Service (AKS) is Microsoft’s managed Kubernetes service in Azure. Azure runs the control plane, and your apps run on nodes, which are Azure virtual machines (VMs).",
    },
  ],
  sections: [
    {
      id: "aks-vs-kubernetes",
      title: "AKS vs Kubernetes",
      blocks: [
        {
          kind: "p",
          text: "Kubernetes is the open-source system that runs containerized apps across a cluster of machines. AKS is Kubernetes on Azure, certified by the Cloud Native Computing Foundation (CNCF).",
        },
        { kind: "p", text: "AKS also connects your cluster to Azure:" },
        {
          kind: "ul",
          items: [
            "Microsoft Entra ID for Kubernetes access, from your existing users and groups.",
            "Azure Policy for compliance guardrails.",
            "Azure Disks and Azure Files for storage, through their Container Storage Interface (CSI) drivers.",
            "Container Insights, in Azure Monitor, for cluster health and performance.",
          ],
        },
      ],
    },
    {
      id: "what-an-aks-cluster-is-made-of",
      title: "Inside an AKS cluster",
      blocks: [
        {
          kind: "p",
          text: [
            "Every AKS cluster has at least one node. Each node runs the ",
            { a: "kubelet", href: "/learn/glossary/kubelet" },
            ", a container runtime and kube-proxy. Clusters on Azure CNI powered by Cilium run Cilium instead of kube-proxy.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              "Nodes are grouped into ",
              { a: "node pools", href: "/learn/glossary/node-pool" },
              ". By default, a node pool manages its VMs with Virtual Machine Scale Sets.",
            ],
            "A system node pool hosts critical system pods, such as CoreDNS. User node pools host your apps.",
            "AKS puts the cluster’s VMs, scale sets and storage in a second resource group, the node resource group.",
          ],
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "aks-automatic-vs-aks-standard",
      title: "AKS Automatic vs Standard",
      blocks: [
        {
          kind: "p",
          text: "AKS has two cluster modes. Automatic is fully managed, with production-ready defaults. Standard gives you full control of cluster configuration and node pools.",
        },
        {
          kind: "table",
          columns: [
            { label: "", width: "26%" },
            { label: "AKS Automatic", width: "40%" },
            { label: "AKS Standard", width: "34%" },
          ],
          rows: [
            [
              "Nodes",
              [
                "Azure creates, scales and upgrades them with ",
                { a: "node auto-provisioning", href: "/learn/aks-node-auto-provisioning" },
              ],
              "You create and manage node pools",
            ],
            [
              "Scaling",
              [
                { a: "HPA", href: "/learn/glossary/horizontal-pod-autoscaler" },
                ", KEDA and ",
                { a: "VPA", href: "/learn/glossary/vertical-pod-autoscaler" },
                " come set up, and nodes are created on demand",
              ],
              "Manual by default, with the cluster autoscaler and KEDA optional",
            ],
            [
              "Upgrades",
              "Automatic, on the stable channel",
              "Manual by default, with an automatic upgrade channel optional",
            ],
            ["Security and monitoring", "On by default", "Opt-in, feature by feature"],
          ],
        },
        {
          kind: "p",
          text: "Microsoft recommends Automatic for most new workloads. Standard fits when you need Windows node pools, custom networking, or VM sizes not yet in Automatic.",
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for cloud cost",
      blocks: [
        {
          kind: "p",
          text: "Nodes are charged as standard Azure VMs, by VM type and how long they run, and Azure reservations apply. A node costs the same however little its pods use.",
        },
        { kind: "p", text: "Cluster management has three pricing tiers:" },
        {
          kind: "ul",
          items: [
            "Free: no cluster management charge, and no financially backed uptime service level agreement (SLA).",
            "Standard: a paid tier, with an uptime SLA and up to 5,000\u00a0nodes.",
            "Premium: Standard’s uptime SLA, plus Long Term Support (LTS) for Kubernetes versions.",
          ],
        },
        {
          kind: "p",
          text: [
            "AKS Automatic has its own control plane fee, and includes the Standard tier at no extra charge. ",
            { a: "AKS vs EKS cost", href: "/learn/aks-vs-eks-cost" },
            " lists each fee, and the ",
            { a: "EKS and AKS pricing calculator", href: "/eks-and-aks-pricing-calculator" },
            " gives one node’s monthly list price.",
          ],
        },
        {
          kind: "p",
          text: [
            "The scheduler places pods on nodes by their ",
            { a: "requests", href: "/learn/glossary/kubernetes-resource-requests" },
            ", not their real use. Requests set above real use keep more nodes running, and you pay for each one.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " rebalances CPU and memory requests on AKS to match real use, so the same pods fit on fewer nodes. It removes the nodes you don’t need.",
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "EKS",
      line: "The AWS counterpart.",
      href: "/learn/glossary/eks",
    },
    {
      title: "Node pool",
      line: "How AKS groups its VMs.",
      href: "/learn/glossary/node-pool",
    },
    {
      title: "Resource requests",
      line: "What the scheduler counts.",
      href: "/learn/glossary/kubernetes-resource-requests",
    },
    {
      title: "Kubernetes cluster utilization",
      line: "Requests against real use.",
      href: "/learn/glossary/kubernetes-cluster-utilization",
    },
  ],
  relatedTitle: "Related terms",
  next: {
    title: "How to choose AKS VM sizes",
    href: "/learn/how-to-choose-aks-node-sizes",
  },
  sources: [
    {
      publisher: "Microsoft Learn",
      title: "“What is Azure Kubernetes Service (AKS)?”",
      url: "https://learn.microsoft.com/en-us/azure/aks/what-is-aks",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Azure Kubernetes Service (AKS) Core Concepts”",
      url: "https://learn.microsoft.com/en-us/azure/aks/core-aks-concepts",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Introduction to Azure Kubernetes Service (AKS) Automatic”",
      url: "https://learn.microsoft.com/en-us/azure/aks/intro-aks-automatic",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Azure Kubernetes Service (AKS) Free, Standard, and Premium Pricing Tiers”",
      url: "https://learn.microsoft.com/en-us/azure/aks/free-standard-pricing-tiers",
    },
    {
      publisher: "Microsoft Azure",
      title: "“Azure Kubernetes Service (AKS) pricing”",
      url: "https://azure.microsoft.com/en-us/pricing/details/kubernetes-service/",
    },
    {
      publisher: "Kubernetes",
      title: "“Cluster Architecture”",
      url: "https://kubernetes.io/docs/concepts/architecture/",
    },
    {
      publisher: "Kubernetes",
      title: "“Resource Management for Pods and Containers”",
      url: "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/",
    },
  ],
};
