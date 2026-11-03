import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/on-demand-instance/1";

export const term: GlossaryTerm = {
  slug: "on-demand-instance",
  term: "On-demand instance (on-demand pricing)",
  title: "What is an on-demand instance?",
  meta: "An on-demand instance is a cloud VM you pay for while it runs, with no commitment. How EC2 on-demand pricing and Azure pay-as-you-go work.",
  h1: "What is an on-demand instance?",
  card: "An on-demand instance is a cloud virtual machine (VM) you pay for by how long it runs, with no commitment.",
  group: "finops-pricing",
  product: "coral",
  published: "2026-10-25",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: "An on-demand instance is a cloud virtual machine (VM) you pay for by how long it runs, with no commitment. AWS calls these On-Demand Instances, and Azure calls this pricing pay-as-you-go.",
    },
  ],
  sections: [
    {
      id: "what-is-an-instance-in-cloud-computing",
      title: "Instances in cloud computing",
      blocks: [
        {
          kind: "p",
          text: "In cloud computing, an instance is a virtual server you rent. AWS calls a cloud instance an EC2 instance, and Azure calls it a virtual machine.",
        },
        {
          kind: "p",
          text: [
            "Its ",
            { a: "instance type", href: "/learn/glossary/aws-instance-families" },
            " on AWS, or ",
            { a: "VM size", href: "/learn/glossary/azure-vm-series" },
            " on Azure, sets its CPU, memory, storage and network. Its pricing model, such as on-demand, sets how you pay.",
          ],
        },
      ],
    },
    {
      id: "on-demand-instance-pricing",
      title: "On-demand pricing",
      blocks: [
        {
          kind: "p",
          text: [
            "The ",
            { a: "EKS and AKS pricing calculator", href: "/eks-and-aks-pricing-calculator" },
            " lists monthly on-demand prices for common node sizes on both clouds.",
          ],
        },
        { kind: "h3", id: "aws-on-demand-instances", title: "EC2 on-demand pricing" },
        {
          kind: "p",
          text: "AWS charges Linux and Windows instances per second, with a 60-second minimum and no upfront payment. SUSE Linux Enterprise Server is charged in full hours.",
        },
        { kind: "h3", id: "azure-pay-as-you-go-vms", title: "Azure pay-as-you-go" },
        {
          kind: "p",
          text: "Azure charges for each full minute a VM runs. In Azure’s example, 6\u00a0minutes and 45\u00a0seconds counts as 6\u00a0minutes.",
        },
        {
          kind: "p",
          text: "You still pay for the cores of a “Stopped” VM. Only “Stopped (deallocated)” ends that charge.",
        },
      ],
    },
    {
      id: "on-demand-instances-vs-reserved",
      title: "On-demand vs reserved",
      blocks: [
        {
          kind: "ul",
          items: [
            "AWS Reserved Instances and Azure Reservations trade a one-year or three-year commitment for a discount.",
            "You pay for the commitment even when it’s unused.",
            "Usage outside the commitment, and usage after an AWS Reserved Instance expires, pays the on-demand rate.",
          ],
        },
        {
          kind: "p",
          text: "In October 2026, Azure quoted up to 72% off pay-as-you-go prices for reservations. AWS quoted the same top figure for Savings Plans.",
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
            [
              "Each node in an AKS node pool or EKS node group is a VM. Unless spot or a commitment covers it, you pay the on-demand rate for its ",
              { a: "size", href: "/learn/kubernetes-node-size-best-practices" },
              ".",
            ],
            "A spare node costs you until it’s removed.",
            [
              { a: "Coral", href: "/coral" },
              " rebalances CPU and memory requests to match real use, so the same pods fit on fewer nodes. It removes the nodes you don’t need, without any downtime.",
            ],
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Reserved instance",
      line: "A one-year or three-year commitment to one VM setup.",
      href: "/learn/glossary/reserved-instance",
    },
    {
      title: "Savings plan",
      line: "A commitment to a fixed hourly compute spend.",
      href: "/learn/glossary/savings-plan",
    },
    {
      title: "Spot instance",
      line: "Spare capacity at a discount, which the cloud can take back.",
      href: "/learn/glossary/spot-instance",
    },
    {
      title: "Node pool",
      line: "Nodes that share settings, such as VM size.",
      href: "/learn/glossary/node-pool",
    },
  ],
  relatedTitle: "Related terms",
  next: {
    title: "Kubernetes node size best practices",
    href: "/learn/kubernetes-node-size-best-practices",
  },
  sources: [
    {
      publisher: "AWS",
      title: "“Amazon EC2 On-Demand Pricing”",
      url: "https://aws.amazon.com/ec2/pricing/on-demand/",
    },
    {
      publisher: "AWS",
      title: "“Reserved Instances for Amazon EC2 overview”",
      url: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-reserved-instances.html",
    },
    {
      publisher: "Microsoft Learn",
      title: "“What are Azure Reservations?”",
      url: "https://learn.microsoft.com/en-us/azure/cost-management-billing/reservations/save-compute-costs-reservations",
    },
    {
      publisher: "Microsoft Azure",
      title: "“Linux Virtual Machines Pricing”",
      url: "https://azure.microsoft.com/en-us/pricing/details/virtual-machines/linux/",
    },
    {
      publisher: "AWS",
      title: "“What is Amazon EC2?”",
      url: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html",
    },
    {
      publisher: "AWS",
      title: "“Savings Plans types”",
      url: "https://docs.aws.amazon.com/savingsplans/latest/userguide/plan-types.html",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Overview of virtual machines in Azure”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/overview",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Azure Kubernetes Service (AKS) Core Concepts”",
      url: "https://learn.microsoft.com/en-us/azure/aks/core-aks-concepts",
    },
  ],
};
