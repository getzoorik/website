import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/on-demand-instance/1";

export const term: GlossaryTerm = {
  slug: "on-demand-instance",
  term: "On-demand instance (on-demand pricing)",
  title: "What is an on-demand instance?",
  meta: "An on-demand instance is a cloud VM charged by how long it runs, with no commitment. See how AWS and Azure charge and how it compares to reserved pricing.",
  h1: "What is an on-demand instance?",
  card: "An on-demand instance is a cloud virtual machine (VM) you pay for by how long it runs, with no commitment.",
  group: "finops-pricing",
  product: "coral",
  published: "2026-10-25",
  updated: "2026-11-01",
  definition: [
    {
      kind: "p",
      text: "An on-demand instance is a cloud virtual machine (VM) you pay for by how long it runs, with no commitment. Azure calls this pay-as-you-go pricing.",
    },
  ],
  sections: [
    {
      id: "on-demand-instance-pricing",
      title: "On-demand instance pricing",
      blocks: [
        { kind: "h3", id: "aws-on-demand-instances", title: "AWS on-demand instances" },
        {
          kind: "p",
          text: "AWS charges per second for Linux and Windows instances, with a 60-second minimum. SUSE Linux Enterprise Server is charged in full hours.",
        },
        { kind: "h3", id: "azure-pay-as-you-go-vms", title: "Azure pay-as-you-go VMs" },
        {
          kind: "p",
          text: "Azure charges per full minute a VM runs, so in Azure’s example 6\u00a0minutes and 45\u00a0seconds counts as 6\u00a0minutes.",
        },
        {
          kind: "p",
          text: "On Azure, you still pay for the cores of a “Stopped” VM. Only “Stopped (deallocated)” ends that charge.",
        },
      ],
    },
    {
      id: "on-demand-instances-vs-reserved",
      title: "On-demand vs reserved instances",
      blocks: [
        {
          kind: "ul",
          items: [
            "AWS Reserved Instances and Azure Reservations trade a one-year or three-year commitment for a discount.",
            "You pay for it even when it’s unused.",
            "You pay the on-demand rate for usage outside the commitment, and after an AWS Reserved Instance expires.",
          ],
        },
        {
          kind: "p",
          text: "In October 2026, Azure says reservations can reduce costs by up to 72% from pay-as-you-go prices. AWS quotes the same top figure for Savings Plans. Prices change.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for your cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            [
              "Each node in an AKS node pool or EKS node group is a VM, charged at the on-demand rate for its ",
              { a: "size", href: "/learn/kubernetes-node-size-best-practices" },
              ".",
            ],
            "A commitment or spot price can replace that rate.",
            "A spare node costs you until it’s removed.",
            [
              { a: "Coral", href: "/coral" },
              " drains spare nodes so your autoscaler can remove them.",
            ],
            "It rebalances CPU and memory requests to match real use, so the same pods fit on fewer nodes.",
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
      title: "Reserved instance",
      line: "A one-year or three-year commitment to one VM setup.",
      href: "/learn/glossary/reserved-instance",
    },
    {
      title: "Savings plan",
      line: "A commitment to an hourly spend.",
      href: "/learn/glossary/savings-plan",
    },
    {
      title: "Spot instance",
      line: "A VM on spare capacity, at a discount, that the cloud can take back.",
      href: "/learn/glossary/spot-instance",
    },
    {
      title: "Node pool",
      line: "Nodes that share settings, such as VM size.",
      href: "/learn/glossary/node-pool",
    },
  ],
  next: {
    title: "Kubernetes node size best practices: large or small nodes",
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
  ],
};
