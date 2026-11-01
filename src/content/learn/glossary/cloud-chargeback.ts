import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/cloud-chargeback/1";

export const term: GlossaryTerm = {
  slug: "cloud-chargeback",
  term: "Chargeback (cloud / IT chargeback)",
  title: "What is cloud chargeback? Chargeback models",
  meta: "Cloud chargeback charges each team’s budget for its share of the cloud cost. See three common AWS chargeback models and how to plan one with finance.",
  h1: "What is cloud chargeback? Chargeback models",
  card: "Cloud chargeback, or chargeback in cloud computing, means charging each team its share of the cloud cost.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-25",
  updated: "2026-11-01",
  definition: [
    {
      kind: "p",
      text: "Cloud chargeback, or chargeback in cloud computing, means charging each team its share of the cloud cost. Your company pays the provider’s invoice, then charges each team through internal accounting.",
    },
    { kind: "svg", figure: figure1 },
  ],
  sections: [
    {
      id: "an-example-from-aws",
      title: "An AWS chargeback example",
      blocks: [
        {
          kind: "p",
          text: [
            "A ",
            { a: "showback", href: "/learn/glossary/showback" },
            " report tells the infrastructure engineering team what it spent on AWS last month. Cloud chargeback takes that amount out of the team’s AWS budget.",
          ],
        },
      ],
    },
    {
      id: "chargeback-models-in-cloud-computing",
      title: "Chargeback models in cloud computing",
      blocks: [
        {
          kind: "p",
          text: "Each cloud chargeback model rests on cost allocation: assigning each cost to the team or app that used it. AWS describes three starting models.",
        },
        {
          kind: "ul",
          items: [
            "An account-based model follows each AWS account, takes the least effort and needs no tags.",
            "A team-based model groups each team’s accounts with AWS Cost Categories.",
            "A tag-based model takes the most effort. Tags count only once activated for cost allocation.",
          ],
        },
        {
          kind: "p",
          text: [
            "On AWS, some costs can’t be tagged, such as some fees for ",
            { a: "Reserved Instances", href: "/learn/glossary/reserved-instance" },
            " and ",
            { a: "Savings Plans", href: "/learn/glossary/savings-plan" },
            ". Microsoft says to plan your IT chargeback model with IT and finance, based on an agreed split of shared costs and commitment discounts.",
          ],
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
            [
              "Cloud cost chargeback doesn’t change the provider’s invoice. But a team paying its share has a reason to ",
              { a: "reduce cloud costs", href: "/cloud-cost-optimization" },
              ".",
            ],
            [
              { a: "Coral", href: "/coral" },
              " rebalances CPU and memory requests on AKS and EKS to match real use, so the same pods fit on fewer nodes.",
            ],
            [
              { a: "Amoeba", href: "/amoeba" },
              " moves a virtual machine’s data disks onto one pool sized to your data, then rightsizes it autonomously.",
            ],
            [
              "Our library lists FinOps tools and other ",
              { a: "cloud cost management tools", href: "/cloud-cost-optimization-library" },
              ", with what each one does.",
            ],
            ["The ", { a: "free assessment", href: "/assessment" }, " works out your own figure."],
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
      title: "Kubernetes cost allocation",
      line: "Splits a shared cluster’s cost by team.",
      href: "/learn/glossary/kubernetes-cost-allocation",
    },
    { title: "FinOps", line: "The wider practice.", href: "/learn/glossary/finops" },
    {
      title: "Cloud unit economics",
      line: "Cloud cost per unit of business value.",
      href: "/learn/glossary/cloud-unit-economics",
    },
  ],
  next: {
    title: "Cloud cost optimization: how to reduce cloud costs",
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
  ],
};
