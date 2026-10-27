import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/cloud-chargeback/1";

export const term: GlossaryTerm = {
  slug: "cloud-chargeback",
  term: "Chargeback (cloud / IT chargeback)",
  title: "What is chargeback in cloud computing?",
  meta: "Chargeback in cloud computing charges each team’s budget for its share of the cloud cost. See three common AWS models and how to plan one with finance.",
  h1: "What is chargeback in cloud computing?",
  card: "Chargeback in cloud computing means charging each internal team for its share of the cloud cost.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-25",
  updated: "2026-10-26",
  definition: [
    {
      kind: "p",
      text: "Chargeback in cloud computing means charging each internal team for its share of the cloud cost. Your company pays the provider’s invoice, then charges each team through its own accounting system.",
    },
    { kind: "svg", figure: figure1 },
  ],
  sections: [
    {
      id: "an-example-from-aws",
      title: "An example from AWS",
      blocks: [
        {
          kind: "p",
          text: [
            "A ",
            { a: "showback", href: "/learn/glossary/showback" },
            " report says the infrastructure engineering team was responsible for $X of AWS spend last month. Cloud chargeback takes that $X out of the team’s AWS budget.",
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
          text: "Each cloud chargeback model rests on cost allocation: assigning each cost to the team or app that used it. AWS describes three common starting models.",
        },
        {
          kind: "ul",
          items: [
            "An account-based model follows each AWS account, takes the least effort and needs no tags.",
            "A team-based model groups each team’s accounts with AWS Cost Categories.",
            "A tag-based model takes the most effort, and tags count only after you activate them for cost allocation.",
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
              "Cloud cost chargeback doesn’t change the provider’s invoice. But a team that pays its own share has a reason to ",
              { a: "reduce it", href: "/learn/how-to-reduce-cloud-costs" },
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
      line: "Splitting a shared cluster’s cost across teams.",
      href: "/learn/glossary/kubernetes-cost-allocation",
    },
    { title: "FinOps", line: "The wider practice.", href: "/learn/glossary/finops" },
    {
      title: "Cloud unit economics",
      line: "Cloud cost per unit of business value.",
      href: "/learn/glossary/cloud-unit-economics",
    },
  ],
  next: { title: "How to reduce cloud costs", href: "/learn/how-to-reduce-cloud-costs" },
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
