import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/finops-personas/1";

export const term: GlossaryTerm = {
  slug: "finops-personas",
  term: "FinOps personas",
  title: "What are FinOps personas?",
  meta: "FinOps personas are the roles that share cloud cost work. See Microsoft’s 7 core and 5 allied personas, what each does, and who owns usage and rates.",
  h1: "What are FinOps personas?",
  card: "FinOps personas are the roles that take part in FinOps, the shared work of managing cloud cost.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-26",
  updated: "2026-10-26",
  definition: [
    {
      kind: "p",
      text: [
        "FinOps personas are the roles that take part in ",
        { a: "FinOps", href: "/learn/glossary/finops" },
        ", the shared work of managing cloud cost. Each one has its own FinOps roles and responsibilities.",
      ],
    },
    {
      kind: "p",
      text: "They come from the FinOps Foundation’s FinOps Framework. Microsoft’s guidance builds on it and calls them stakeholders.",
    },
  ],
  sections: [
    {
      id: "core-and-allied-personas",
      title: "Core and allied personas",
      blocks: [
        { kind: "p", text: "Microsoft lists 7 FinOps core personas:" },
        {
          kind: "ul",
          items: [
            "Procurement buys resources and negotiates contracts.",
            "Finance budgets, forecasts and reports on cloud cost.",
            "Leadership gets the most business value from the cloud.",
            "Business owners drive strategy and budgets.",
            "Product owners rank product work by user needs and business value.",
            "Engineering teams deliver high-quality, cost-effective services.",
            "FinOps practitioners teach, standardize and promote FinOps practices.",
          ],
        },
        {
          kind: "p",
          text: "Microsoft also names 5 FinOps allied personas: the sustainability, IT financial management, IT service management, IT asset management and security teams.",
        },
      ],
    },
    {
      id: "who-owns-which-lever",
      title: "Who owns which lever",
      blocks: [
        {
          kind: "p",
          text: "Your cloud cost moves with what you use and the rate you pay. Microsoft’s principles spread usage decisions across teams and keep rate negotiations central.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "ul",
          items: [
            "Engineering teams own usage: node counts, disk sizes and idle resources.",
            "A central team owns rates. Microsoft suggests one team or person buys commitments.",
            "AWS says finance should advise on commitment discounts.",
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
            "Engineers can weigh cost only when they see it. Microsoft asks for clear cost data, fast.",
            [
              "A discount reduces only the rate. Usage changes ",
              { a: "reduce your cloud cost", href: "/cloud-cost-optimization" },
              " by running less.",
            ],
            "If engineers reduce usage below a commitment, it goes under-used. Microsoft warns that this can lose money, though rarely.",
            [
              "The ",
              { a: "free assessment", href: "/assessment" },
              " works out what your clusters and disks could save.",
            ],
          ],
        },
      ],
    },
  ],
  related: [
    { title: "FinOps", line: "The practice these personas share.", href: "/learn/glossary/finops" },
    {
      title: "FinOps maturity model",
      line: "How a practice grows over time.",
      href: "/learn/glossary/finops-maturity-model",
    },
    {
      title: "Rightsizing",
      line: "A usage lever in engineers’ hands.",
      href: "/learn/glossary/rightsizing",
    },
    {
      title: "Savings plan",
      line: "A commitment discount on the rate.",
      href: "/learn/glossary/savings-plan",
    },
  ],
  next: { title: "How to reduce cloud costs", href: "/cloud-cost-optimization" },
  sources: [
    {
      publisher: "Microsoft Learn",
      title: "“FinOps Framework overview”",
      url: "https://learn.microsoft.com/en-us/cloud-computing/finops/framework/finops-framework",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Rate optimization”",
      url: "https://learn.microsoft.com/en-us/cloud-computing/finops/framework/optimize/rates",
    },
    {
      publisher: "AWS",
      title: "“COST01-BP02 Establish a partnership between finance and technology”",
      url: "https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/cost_cloud_financial_management_partnership.html",
      note: " (Cost Optimization Pillar)",
    },
  ],
};
