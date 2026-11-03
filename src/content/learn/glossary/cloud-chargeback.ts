import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/cloud-chargeback/1";

export const term: GlossaryTerm = {
  slug: "cloud-chargeback",
  term: "Chargeback (cloud / IT chargeback)",
  title: "What is cloud chargeback?",
  meta: "Cloud chargeback charges each team’s budget for its share of the cloud cost. How it differs from showback, and the models to start from.",
  h1: "What is cloud chargeback?",
  card: "Cloud chargeback means charging each team its share of the cloud cost.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-25",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: "Cloud chargeback means charging each team its share of the cloud cost. Your company pays the provider’s invoice, then charges each team’s budget through internal accounting.",
    },
    { kind: "svg", figure: figure1 },
  ],
  sections: [
    {
      id: "an-example-from-aws",
      title: "Chargeback vs showback",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Showback", href: "/learn/glossary/showback" },
            " reports what each team’s cloud use cost. Chargeback goes one step further: the team pays it.",
          ],
        },
        {
          kind: "p",
          text: "In AWS’s example, showback tells the infrastructure engineering team what its AWS usage cost last month. Chargeback deducts that amount from the team’s AWS budget.",
        },
        {
          kind: "p",
          text: "Microsoft suggests starting with showback, then cost allocation, then chargeback.",
        },
      ],
    },
    {
      id: "chargeback-models-in-cloud-computing",
      title: "Chargeback models",
      blocks: [
        {
          kind: "p",
          text: "Every chargeback model rests on cost allocation: assigning each cost to the team or app that used it. AWS describes three starting models:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Account-based." },
              " Each AWS account’s cost goes to the team that owns it. It takes the least effort and needs no tags.",
            ],
            [
              { b: "Team-based." },
              " AWS Cost Categories group each team’s accounts. It takes moderate effort.",
            ],
            [
              { b: "Tag-based." },
              " Costs follow resource tags. It takes the most effort, and a tag counts only from when you activate it for cost allocation.",
            ],
          ],
        },
        {
          kind: "h3",
          id: "a-chargeback-model-for-shared-services",
          title: "Shared costs",
        },
        {
          kind: "p",
          text: "A service that several teams share, such as a Kubernetes cluster, needs an agreed split. Microsoft describes these splits:",
        },
        {
          kind: "ul",
          items: [
            "Evenly across the teams that use it.",
            "In proportion to each team’s total, compute, storage or network cost.",
            "By custom percentages.",
            "By measured use, from utilization data or app telemetry.",
          ],
        },
        {
          kind: "p",
          text: [
            "Some AWS costs can’t be tagged, such as some fees for ",
            { a: "Reserved Instances", href: "/learn/glossary/reserved-instance" },
            " and ",
            { a: "Savings Plans", href: "/learn/glossary/savings-plan" },
            ". AWS says to agree how to treat and measure them.",
          ],
        },
        {
          kind: "p",
          text: "Microsoft says to plan the chargeback model with IT and finance, using an agreed split of shared costs and commitment discounts.",
        },
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
              "Chargeback doesn’t change the provider’s invoice. But a team that pays its share has a reason to ",
              { a: "reduce cloud costs", href: "/cloud-cost-optimization" },
              ".",
            ],
            [
              { a: "Coral", href: "/coral" },
              " rebalances CPU and memory requests on AKS and EKS to match real use, so the same pods fit on fewer nodes.",
            ],
            [
              { a: "Amoeba", href: "/amoeba" },
              " moves a virtual machine’s data disks onto one btrfs pool sized to your data, then rightsizes it autonomously.",
            ],
            [
              "Our library lists ",
              { a: "cloud cost management tools", href: "/cloud-cost-optimization-library" },
              " and what each one does.",
            ],
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Showback",
      line: "The report-only step before chargeback.",
      href: "/learn/glossary/showback",
    },
    {
      title: "Cost allocation tags",
      line: "Labels that split cost by team or app.",
      href: "/learn/glossary/cost-allocation-tags",
    },
    {
      title: "Kubernetes cost allocation",
      line: "Splits a shared cluster’s cost by team.",
      href: "/learn/glossary/kubernetes-cost-allocation",
    },
    { title: "FinOps", line: "The wider practice.", href: "/learn/glossary/finops" },
  ],
  relatedTitle: "Related terms",
  next: {
    title: "Cloud cost optimization",
    href: "/cloud-cost-optimization",
  },
  sources: [
    {
      publisher: "Microsoft Learn",
      title: "“Invoicing and chargeback”",
      url: "https://learn.microsoft.com/en-us/cloud-computing/finops/framework/manage/invoicing-chargeback",
    },
    {
      publisher: "AWS",
      title: "“Cost allocation tags”",
      url: "https://docs.aws.amazon.com/whitepapers/latest/tagging-best-practices/cost-allocation-tags.html",
    },
    {
      publisher: "AWS",
      title: "“Building a cost allocation strategy”",
      url: "https://docs.aws.amazon.com/whitepapers/latest/tagging-best-practices/building-a-cost-allocation-strategy.html",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Allocation”",
      url: "https://learn.microsoft.com/en-us/cloud-computing/finops/framework/understand/allocation",
      note: " (FinOps Framework)",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Allocate Azure costs”",
      url: "https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/allocate-costs",
    },
  ],
};
