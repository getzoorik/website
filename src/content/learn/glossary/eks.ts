import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/eks/1";

export const term: GlossaryTerm = {
  slug: "eks",
  term: "EKS (Amazon Elastic Kubernetes Service)",
  title: "What is AWS EKS?",
  meta: "What is EKS in AWS? Amazon EKS is AWS’s managed Kubernetes service. What AWS runs for you, your node options, and what drives its cost.",
  h1: "What is AWS EKS?",
  card: "Amazon Elastic Kubernetes Service (Amazon EKS) is AWS’s managed Kubernetes service.",
  group: "kubernetes",
  product: "coral",
  published: "2026-11-02",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: "Amazon Elastic Kubernetes Service (Amazon EKS) is AWS’s managed Kubernetes service. AWS runs each cluster’s control plane, and your apps run on worker nodes, such as Amazon EC2 instances.",
    },
  ],
  sections: [
    {
      id: "eks-vs-kubernetes",
      title: "EKS vs Kubernetes",
      blocks: [
        {
          kind: "p",
          text: "Kubernetes runs containerized apps on a cluster of machines, called nodes, under a control plane. EKS runs Kubernetes on AWS and is certified Kubernetes-conformant, so Kubernetes apps deploy without refactoring and community tools work.",
        },
        { kind: "p", text: "What EKS adds on AWS:" },
        {
          kind: "ul",
          items: [
            "Access control through both AWS Identity and Access Management (IAM) and Kubernetes.",
            "The full range of EC2 instance types, including AWS Graviton.",
            "Storage on Amazon EBS, Amazon EFS, Amazon FSx and Amazon S3, through Container Storage Interface (CSI) drivers.",
            "Monitoring with Amazon CloudWatch and Prometheus.",
          ],
        },
      ],
    },
    {
      id: "what-an-eks-cluster-is-made-of",
      title: "Inside an EKS cluster",
      blocks: [
        {
          kind: "p",
          text: "Each cluster gets its own control plane, shared with no other cluster or AWS account. It runs at least two API server instances and three etcd instances across three Availability Zones.",
        },
        {
          kind: "p",
          text: "The API server serves the Kubernetes API, and etcd stores the cluster’s data. If a control plane instance falters, EKS replaces it, in another Availability Zone if needed.",
        },
        {
          kind: "p",
          text: "The nodes sit outside the control plane, which manages them. EC2 nodes run in your own AWS account.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "ways-to-run-eks-nodes",
      title: "Node options",
      blocks: [
        { kind: "p", text: "AWS lists six node types:" },
        {
          kind: "ul",
          items: [
            [
              { a: "EKS Auto Mode", href: "/learn/glossary/eks-auto-mode" },
              ": AWS manages the nodes too, for a fee on top of the EC2 price.",
            ],
            [
              { a: "Managed node groups", href: "/learn/glossary/node-pool" },
              ": AWS patches, updates and scales your EC2 nodes, at no extra charge.",
            ],
            "Self-managed nodes: you run, scale and maintain your own EC2 instances.",
            [
              { a: "Karpenter", href: "/learn/what-is-karpenter" },
              ": a cluster autoscaler that launches compute to fit your workloads as load changes.",
            ],
            "AWS Fargate: serverless compute for pods, with no instances to manage.",
            "EKS Hybrid Nodes: your own on-premises and edge machines as nodes.",
          ],
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for cost",
      blocks: [
        {
          kind: "p",
          text: "EKS charges an hourly fee per cluster, set by its Kubernetes version. The fee is higher once that version leaves standard support for extended support.",
        },
        {
          kind: "p",
          text: "Nodes are charged separately: EC2 for instance capacity, EBS for volumes and Amazon VPC for public IPv4 addresses. A node costs the same however little its pods use. Savings Plans cover compute in EKS clusters.",
        },
        {
          kind: "p",
          text: [
            { a: "AKS vs EKS cost", href: "/learn/aks-vs-eks-cost" },
            " compares the fees, and the ",
            { a: "EKS and AKS pricing calculator", href: "/eks-and-aks-pricing-calculator" },
            " gives a node’s monthly list price.",
          ],
        },
        {
          kind: "p",
          text: [
            "The scheduler places pods by their ",
            { a: "resource requests", href: "/learn/glossary/kubernetes-resource-requests" },
            ", not their real use. Requests above real use keep extra nodes running, and you pay for each one.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " rebalances CPU and memory requests on EKS to match real use, so the same pods fit on fewer nodes. It removes the nodes you don’t need.",
          ],
        },
      ],
    },
  ],
  related: [
    { title: "AKS", line: "The Azure counterpart.", href: "/learn/glossary/aks" },
    {
      title: "EKS Auto Mode",
      line: "AWS manages the nodes, for a fee.",
      href: "/learn/glossary/eks-auto-mode",
    },
    {
      title: "Node pool",
      line: "Includes EKS managed node groups.",
      href: "/learn/glossary/node-pool",
    },
    {
      title: "Resource requests",
      line: "What the scheduler counts.",
      href: "/learn/glossary/kubernetes-resource-requests",
    },
  ],
  relatedTitle: "Related terms",
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
