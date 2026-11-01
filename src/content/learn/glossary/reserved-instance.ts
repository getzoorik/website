import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/reserved-instance/1";

export const term: GlossaryTerm = {
  slug: "reserved-instance",
  term: "Reserved instance (AWS RIs, Azure reservations)",
  title: "What is a reserved instance?",
  meta: "A reserved instance trades a one- or three-year VM commitment for a discount. See what AWS RIs and Azure Reservations cost, and why to shrink before you buy.",
  h1: "What is a reserved instance?",
  card: "A reserved instance is a one-year or three-year commitment to a virtual machine (VM) setup, in return for a discount.",
  group: "finops-pricing",
  product: "coral",
  published: "2026-10-25",
  updated: "2026-11-01",
  definition: [
    {
      kind: "p",
      text: "A reserved instance is a one-year or three-year commitment to a virtual machine (VM) setup, in return for a discount. AWS calls it a Reserved Instance (RI), and Azure calls it a reservation. It’s a price discount, not a machine.",
    },
  ],
  sections: [
    {
      id: "how-reserved-instances-work-in-aws-and",
      title: "How reserved instances work in AWS and Azure",
      blocks: [
        { kind: "p", text: "On AWS:" },
        {
          kind: "ul",
          items: [
            "An RI covers only instances with matching attributes, such as instance type and region.",
            "You pay for the whole term, used or not.",
            "You can’t cancel an RI, but you might be able to modify, exchange or sell it.",
            [
              "AWS recommends ",
              { a: "Savings Plans", href: "/learn/glossary/savings-plan" },
              " over RIs.",
            ],
          ],
        },
        { kind: "p", text: "With Azure Reservations:" },
        {
          kind: "ul",
          items: [
            "You can refund up to USD 50,000 in a rolling 12\u00a0months.",
            "Hours with no matching VM are lost.",
          ],
        },
        {
          kind: "p",
          text: "In October 2026, both clouds quote up to 72% off on-demand prices. Prices change.",
        },
      ],
    },
    {
      id: "reserved-instance-meaning-in-kubernetes",
      title: "Reserved instance meaning in Kubernetes",
      blocks: [
        { kind: "p", text: "A reservation covers the VMs under your AKS or EKS nodes, not pods." },
        {
          kind: "p",
          text: "Say you reserve 3 VMs for a node pool of 3. Later it shrinks to 2. With no other matching VM, you still pay for the third.",
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
            "Reservations apply hour by hour, so Microsoft says to buy for your steady base usage.",
            "Reserve more, and you pay for hours no VM uses.",
            [
              { a: "Coral", href: "/coral" },
              " rebalances CPU and memory requests on AKS and EKS to match real use. It drains spare nodes so your autoscaler can remove them.",
            ],
            [
              "Reserve only for the nodes you still need after you ",
              { a: "reduce cloud costs", href: "/cloud-cost-optimization" },
              ".",
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
      title: "Spot instance",
      line: "Spare capacity that reservations don’t cover.",
      href: "/learn/glossary/spot-instance",
    },
    {
      title: "Savings plan",
      line: "An hourly spend commitment.",
      href: "/learn/glossary/savings-plan",
    },
    {
      title: "On-demand instance",
      line: "A VM charged by how long it runs, with no commitment.",
      href: "/learn/glossary/on-demand-instance",
    },
    { title: "Node pool", line: "Nodes that share one setup.", href: "/learn/glossary/node-pool" },
  ],
  next: {
    title: "Cloud cost optimization: how to reduce cloud costs",
    href: "/cloud-cost-optimization",
  },
  sources: [
    {
      publisher: "AWS",
      title: "“Reserved Instances for Amazon EC2 overview”",
      url: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-reserved-instances.html",
    },
    {
      publisher: "AWS",
      title: "“Amazon EC2 Reserved Instances”",
      url: "https://aws.amazon.com/ec2/pricing/reserved-instances/",
    },
    {
      publisher: "Microsoft Learn",
      title: "“What are Azure Reservations?”",
      url: "https://learn.microsoft.com/en-us/azure/cost-management-billing/reservations/save-compute-costs-reservations",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Understand Azure Reserved VM Instances discount”",
      url: "https://learn.microsoft.com/en-us/azure/cost-management-billing/manage/understand-vm-reservation-charges",
    },
  ],
};
