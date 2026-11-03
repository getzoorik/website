import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/reserved-instance/1";

export const term: GlossaryTerm = {
  slug: "reserved-instance",
  term: "Reserved instance (AWS RIs, Azure reservations)",
  title: "Reserved instances in AWS and Azure",
  meta: "Reserved instances in AWS and Azure trade a one- or three-year commitment for a discount. How RIs and reservations work, their pricing and what to reserve.",
  h1: "Reserved instances in AWS and Azure",
  card: "A reserved instance is a one-year or three-year commitment to a virtual machine (VM) setup, in return for a discount.",
  group: "finops-pricing",
  product: "coral",
  published: "2026-10-25",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: "A reserved instance is a one-year or three-year commitment to a virtual machine (VM) setup, in return for a discount. It’s a price discount, not a machine: AWS calls it a Reserved Instance (RI), and Azure calls it a reservation.",
    },
  ],
  sections: [
    {
      id: "how-reserved-instances-work-in-aws-and",
      title: "AWS Reserved Instances",
      blocks: [
        { kind: "h3", id: "aws-reserved-instances-ris", title: "How RIs work" },
        {
          kind: "ul",
          items: [
            "An RI applies to running Amazon EC2 instances that match its attributes, such as instance type, Region, tenancy and platform.",
            "You can’t cancel an RI, but you might be able to modify, exchange or sell it.",
            "An RI doesn’t renew by itself. When it expires, the instance runs at on-demand rates.",
            [
              "AWS recommends ",
              { a: "Savings Plans", href: "/learn/glossary/savings-plan" },
              " over RIs.",
            ],
          ],
        },
        { kind: "h3", id: "aws-reserved-instance-pricing", title: "Reserved instance pricing" },
        {
          kind: "p",
          text: "An RI’s price depends on the instance’s attributes, the term, the payment option and the offering class. A three-year term gives a bigger discount than one year.",
        },
        {
          kind: "ul",
          items: [
            "Payment is All Upfront, Partial Upfront or No Upfront. You pay for every hour of the term, used or not.",
            "Standard RIs: up to 72% off on-demand prices (November 2026). You can modify them, not exchange them.",
            "Convertible RIs: up to 66% off. You can exchange them for other Convertible RIs.",
          ],
        },
        {
          kind: "h3",
          id: "selling-ris-on-the-reserved-instance-marketplace",
          title: "Selling RIs",
        },
        {
          kind: "p",
          text: "You can sell a Standard RI you no longer need on the Reserved Instance Marketplace.",
        },
        {
          kind: "ul",
          items: [
            "It must have been active for at least 30 days, with at least a month of its term left.",
            "You can’t sell an RI bought with a volume discount.",
            "AWS charges a 12% fee on the upfront price.",
          ],
        },
      ],
    },
    {
      id: "azure-reservations",
      title: "Azure reservations",
      blocks: [
        {
          kind: "p",
          text: "For VMs, the Azure reserved instance is a Reserved Virtual Machine Instance. It covers compute only, not software such as Windows, and not networking or storage.",
        },
        {
          kind: "ul",
          items: [
            "An hour with no matching VM is lost.",
            "You can refund reservations up to USD 50,000 in a rolling 12 months.",
            "Microsoft quotes up to 72% off pay-as-you-go prices (November 2026).",
          ],
        },
      ],
    },
    {
      id: "reserved-instance-meaning-in-kubernetes",
      title: "Reservations for Kubernetes nodes",
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
      title: "Reservations and cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            "Reservations apply hour by hour, so Microsoft says to buy for your consistent base usage.",
            "Reserve more, and you pay for hours no VM uses.",
            [
              { a: "Coral", href: "/coral" },
              " rebalances CPU and memory requests on AKS and EKS to match real use, without any downtime, and removes the nodes you don’t need.",
            ],
            [
              "Reserve only the nodes you still need after you ",
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
  relatedTitle: "Related terms",
  next: {
    title: "Cloud cost optimization",
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
