import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/savings-plan/1";

export const term: GlossaryTerm = {
  slug: "savings-plan",
  term: "Savings plan (AWS Savings Plans, Azure savings plan for compute)",
  title: "What is a savings plan (AWS and Azure)?",
  meta: "An AWS savings plan trades a one- or three-year hourly commitment for cheaper compute. See how it works and compares to Azure’s plan and reserved instances.",
  h1: "What is a savings plan (AWS and Azure)?",
  card: "An AWS Savings Plan is a commitment to spend a set dollar amount per hour on compute, for one or three years.",
  group: "finops-pricing",
  product: "coral",
  published: "2026-10-25",
  updated: "2026-11-01",
  definition: [
    {
      kind: "p",
      text: [
        "An AWS Savings Plan is a commitment to spend a set dollar amount per hour on compute, for one or three years. Usage it covers costs less than the ",
        { a: "on-demand rate", href: "/learn/glossary/on-demand-instance" },
        ". The Azure savings plan for compute works the same way.",
      ],
    },
  ],
  sections: [
    {
      id: "an-example-from-aws",
      title: "An example from AWS",
      blocks: [
        {
          kind: "p",
          text: "AWS’s example uses made-up rates. Four r5.4xlarge instances run for an hour, each $1.00 on-demand or $0.70 on a Compute Savings Plan.",
        },
        {
          kind: "p",
          text: "A $2.00-an-hour plan covers about 2.9 of them. The other 1.1 are charged on-demand, for $1.14.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "savings-plan-vs-reserved-instance",
      title: "Savings plan vs reserved instance",
      blocks: [
        {
          kind: "ul",
          items: [
            "An AWS Compute Savings Plan takes up to 66% off on-demand, for any instance family, size or region.",
            "An EC2 Instance Savings Plan takes up to 72% off, for one family in one region.",
          ],
        },
        {
          kind: "p",
          text: "These are AWS’s October 2026 figures, and prices change. Reserved Instances reach the same top discounts, but tie you to instance setups, not a dollar amount. Azure Reservations also need a set family, size and region.",
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for your cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            "You pay the full commitment every hour, used or not, and can’t change it later.",
            [
              "Spare nodes raise what you’d commit to, so ",
              { a: "reduce cloud costs", href: "/cloud-cost-optimization" },
              " first.",
            ],
            "On EKS, a plan covers your EC2\u00a0nodes, but not EKS’s own charges.",
            "On AKS, it covers the virtual machines behind your nodes, if Microsoft lists their series as eligible.",
            [
              { a: "Coral", href: "/coral" },
              " rebalances CPU and memory requests on AKS and EKS to match real use, and drains spare nodes so your autoscaler can remove them.",
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
      title: "On-demand instance",
      line: "The full rate.",
      href: "/learn/glossary/on-demand-instance",
    },
    {
      title: "Rightsizing",
      line: "Matching resources to real use.",
      href: "/learn/glossary/rightsizing",
    },
    {
      title: "Spot instance",
      line: "Spare capacity at its own price, which AWS Savings Plans don’t cover.",
      href: "/learn/glossary/spot-instance",
    },
    {
      title: "Reserved instance",
      line: "A commitment to one instance setup.",
      href: "/learn/glossary/reserved-instance",
    },
  ],
  next: {
    title: "Cloud cost optimization: how to reduce cloud costs",
    href: "/cloud-cost-optimization",
  },
  sources: [
    {
      publisher: "AWS",
      title: "“Savings Plans types”",
      url: "https://docs.aws.amazon.com/savingsplans/latest/userguide/plan-types.html",
    },
    {
      publisher: "AWS",
      title: "“Compute Savings Plans and Reserved Instances”",
      url: "https://docs.aws.amazon.com/savingsplans/latest/userguide/sp-ris.html",
    },
    {
      publisher: "AWS",
      title: "“Understanding how Savings Plans apply to your usage”",
      url: "https://docs.aws.amazon.com/savingsplans/latest/userguide/sp-applying.html",
    },
    {
      publisher: "Microsoft Azure",
      title: "“Azure Savings Plans”",
      url: "https://azure.microsoft.com/en-us/pricing/offers/savings-plans/",
    },
  ],
};
