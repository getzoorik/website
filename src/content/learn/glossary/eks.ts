import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/eks/1";

export const term: GlossaryTerm = {
  slug: "eks",
  term: "EKS (Amazon Elastic Kubernetes Service)",
  title: "What is AWS EKS? Amazon Elastic Kubernetes Service",
  meta: "EKS in AWS is Amazon’s managed Kubernetes service. See what an EKS cluster is made of, the ways to run its nodes, and what drives its cost.",
  h1: "What is AWS EKS? Amazon Elastic Kubernetes Service",
  card: "Amazon Elastic Kubernetes Service (Amazon EKS) is AWS’s managed Kubernetes service.",
  group: "kubernetes",
  product: "coral",
  published: "2026-11-02",
  updated: "2026-11-02",
  definition: [
    {
      kind: "p",
      text: "Amazon Elastic Kubernetes Service (Amazon EKS) is AWS’s managed Kubernetes service. AWS runs each cluster’s control plane, and your apps run on Amazon EC2 instances or on AWS Fargate.",
    },
  ],
  sections: [
    {
      id: "eks-vs-kubernetes",
      title: "EKS vs Kubernetes",
      blocks: [
        {
          kind: "p",
          text: "Kubernetes is the system that runs containerized apps across a cluster of machines. EKS runs Kubernetes on AWS, certified as conformant. So Kubernetes apps deploy without refactoring, and community tools and plugins work.",
        },
        { kind: "p", text: "What EKS adds on AWS:" },
        {
          kind: "ul",
          items: [
            "Access through both AWS Identity and Access Management (IAM) and Kubernetes.",
            "The full range of EC2 instance types, including AWS Graviton.",
            "Amazon EBS volumes, Amazon EFS and Amazon FSx for your apps’ data, through Container Storage Interface (CSI) drivers.",
            "Monitoring with Amazon CloudWatch.",
          ],
        },
      ],
    },
    {
      id: "what-an-eks-cluster-is-made-of",
      title: "What an EKS cluster is made of",
      blocks: [
        {
          kind: "p",
          text: "Each EKS cluster has its own control plane, shared with no other cluster or AWS account. It runs at least two API server instances and three etcd instances across three Availability Zones. The API server exposes the Kubernetes API, and etcd stores all the cluster’s data.",
        },
        {
          kind: "p",
          text: "If a control plane instance falters, EKS replaces it, in another Availability Zone if needed. Your worker machines, called nodes, sit outside the control plane, which manages them. EC2 nodes run in your own AWS account.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "ways-to-run-eks-nodes",
      title: "Ways to run EKS nodes",
      blocks: [
        { kind: "p", text: "AWS names six main node types:" },
        {
          kind: "ul",
          items: [
            [
              "In ",
              { a: "EKS Auto Mode", href: "/learn/glossary/eks-auto-mode" },
              ", AWS runs your nodes too, for a fee on top of the EC2 price.",
            ],
            [
              "A ",
              { a: "managed node group", href: "/learn/glossary/node-pool" },
              " automates your EC2 nodes’ setup and updates, at no extra charge.",
            ],
            "With self-managed nodes, you run, scale and maintain your own EC2 instances.",
            [
              { a: "Karpenter", href: "/learn/what-is-karpenter" },
              ", a cluster autoscaler, launches compute that fits your workloads as load changes.",
            ],
            "AWS Fargate runs your pods with no instances for you to manage.",
            "EKS Hybrid Nodes use your own on-premises and edge machines as nodes.",
          ],
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why EKS matters for your cloud cost",
      blocks: [
        {
          kind: "p",
          text: "EKS charges an hourly fee per cluster, set by its Kubernetes version. The fee is higher while that version is in extended support.",
        },
        {
          kind: "p",
          text: "Your nodes are charged separately, for EC2 instance capacity, EBS volumes and public IPv4 addresses. So a node costs the same however little its pods use. You can use Savings Plans for compute in EKS clusters.",
        },
        {
          kind: "p",
          text: [
            { a: "AKS vs EKS cost", href: "/learn/aks-vs-eks-cost" },
            " gives each fee at list price, and the ",
            { a: "EKS and AKS pricing calculator", href: "/eks-and-aks-pricing-calculator" },
            " gives a node’s monthly list price.",
          ],
        },
        {
          kind: "p",
          text: [
            "The scheduler places pods by their ",
            { a: "resource requests", href: "/learn/glossary/kubernetes-resource-requests" },
            ", not their real use. Requests set above real use keep more nodes running, and you pay for each one.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " rebalances CPU and memory requests on EKS to match real use, so the same pods fit on fewer nodes. It drains spare nodes so your autoscaler can remove them.",
          ],
        },
      ],
    },
  ],
  related: [
    { title: "AKS", line: "The Azure counterpart.", href: "/learn/glossary/aks" },
    {
      title: "EKS Auto Mode",
      line: "AWS runs the nodes, for a fee.",
      href: "/learn/glossary/eks-auto-mode",
    },
    { title: "Node pool", line: "Covers managed node groups.", href: "/learn/glossary/node-pool" },
    {
      title: "Resource requests",
      line: "What the scheduler counts.",
      href: "/learn/glossary/kubernetes-resource-requests",
    },
  ],
  relatedTitle: "Terms related to EKS",
  next: {
    title: "How to choose EKS instance types",
    href: "/learn/how-to-choose-eks-instance-types",
  },
  sources: [
    {
      publisher: "AWS",
      title: "“What is Amazon EKS?”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html",
    },
    {
      publisher: "AWS",
      title: "“Amazon EKS architecture”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/eks-architecture.html",
    },
    {
      publisher: "AWS",
      title: "“Simplify node lifecycle with managed node groups”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/managed-node-groups.html",
    },
    {
      publisher: "AWS",
      title: "“Automate cluster infrastructure with EKS Auto Mode”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/automode.html",
    },
    { publisher: "AWS", title: "“Amazon EKS pricing”", url: "https://aws.amazon.com/eks/pricing/" },
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
