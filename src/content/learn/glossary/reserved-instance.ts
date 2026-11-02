import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/reserved-instance/1";

export const term: GlossaryTerm = {
  slug: "reserved-instance",
  term: "Reserved instance (AWS RIs, Azure reservations)",
  title: "What are reserved instances in AWS and Azure?",
  meta: "AWS reserved instances (RIs) and Azure reservations trade a 1- or 3-year VM commitment for a discount. See how each works, how it’s priced and what to reserve.",
  h1: "What are reserved instances in AWS and Azure?",
  card: "A reserved instance is a one-year or three-year commitment to a virtual machine (VM) setup, in return for a discount.",
  group: "finops-pricing",
  product: "coral",
  published: "2026-10-25",
  updated: "2026-11-02",
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
        { kind: "h3", id: "aws-reserved-instances-ris", title: "AWS Reserved Instances (RIs)" },
        {
          kind: "ul",
          items: [
            "An RI covers only instances with matching attributes, such as instance type and region.",
            "You can’t cancel an RI, but you might be able to modify, exchange or sell it.",
            [
              "AWS recommends ",
              { a: "Savings Plans", href: "/learn/glossary/savings-plan" },
              " over RIs.",
            ],
          ],
        },
        { kind: "h3", id: "aws-reserved-instance-pricing", title: "AWS reserved instance pricing" },
        {
          kind: "p",
          text: "Amazon EC2 Reserved Instance pricing depends on the instance’s attributes, the term, the payment option and the RI type. A three-year term gives a bigger discount than one year.",
        },
        { kind: "p", text: "You pay for the whole term, used or not." },
        {
          kind: "p",
          text: "In October 2026, AWS quotes up to 72% off on-demand prices for Standard RIs, and up to 66% for Convertible RIs. AWS reserved instance prices change.",
        },
        {
          kind: "h3",
          id: "selling-ris-on-the-reserved-instance-marketplace",
          title: "Selling RIs on the Reserved Instance Marketplace",
        },
        {
          kind: "ul",
          items: [
            "A Standard RI must have been active for at least 30\u00a0days, with at least a month of its term left.",
            "You can’t sell an RI bought with a volume discount.",
            "AWS charges a 12% fee on the upfront price.",
          ],
        },
        { kind: "h3", id: "azure-reservations", title: "Azure Reservations" },
        {
          kind: "p",
          text: "Azure reservations cover many services. For VMs, the Azure reserved instance is a Reserved Virtual Machine Instance, or Reserved VM Instance. It covers only compute, not software, Windows, networking or storage.",
        },
        {
          kind: "ul",
          items: [
            "You can refund up to USD 50,000 in a rolling 12\u00a0months.",
            "Hours with no matching VM are lost.",
          ],
        },
        {
          kind: "p",
          text: "In October 2026, Microsoft quotes up to 72% off pay-as-you-go prices for reservations. Prices change.",
        },
      ],
    },
    {
      id: "reserved-instance-meaning-in-kubernetes",
      title: "Reserved instances for Kubernetes nodes on AKS and EKS",
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
      title: "Why reserved instances matter for your cloud cost",
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
      line: "A commitment to an amount an hour.",
      href: "/learn/glossary/savings-plan",
    },
    {
      title: "On-demand instance",
      line: "A VM charged by how long it runs, with no commitment.",
      href: "/learn/glossary/on-demand-instance",
    },
    { title: "Node pool", line: "Nodes that share one setup.", href: "/learn/glossary/node-pool" },
  ],
  relatedTitle: "Terms related to reserved instances",
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
      publisher: "AWS",
      title: "“Sell Reserved Instances for Amazon EC2 in the Reserved Instance Marketplace”",
      url: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ri-market-general.html",
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
