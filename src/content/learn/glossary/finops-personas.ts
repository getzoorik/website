import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/finops-personas/1";

export const term: GlossaryTerm = {
  slug: "finops-personas",
  term: "FinOps personas",
  title: "What are FinOps personas?",
  meta: "FinOps personas are the roles that share cloud cost work. The core and allied personas, what each one does, and who owns usage and who owns rates.",
  h1: "What are FinOps personas?",
  card: "FinOps personas are the roles that take part in FinOps, the shared work of managing cloud cost.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-26",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: [
        "FinOps personas are the roles that take part in ",
        { a: "FinOps", href: "/learn/glossary/finops" },
        ", the shared work of managing cloud cost. The FinOps Foundation defines them in its FinOps Framework.",
      ],
    },
    {
      kind: "p",
      text: "A persona is a group of people, not one person. In a small company, one person may cover several personas.",
    },
  ],
  sections: [
    {
      id: "core-and-allied-personas",
      title: "Core and allied personas",
      blocks: [
        {
          kind: "p",
          text: "The FinOps Foundation names 6 core personas, always involved in FinOps:",
        },
        {
          kind: "ul",
          items: [
            "FinOps practitioners connect business, engineering and finance, and build the FinOps culture.",
            "Engineering designs, builds, runs and optimizes the infrastructure for cost, performance and reliability.",
            "Finance budgets, forecasts and allocates technology cost.",
            "Product sets requirements and ranks work by business value.",
            "Procurement buys technology and manages vendors and contracts.",
            "Leadership sets objectives and drives a culture of accountability.",
          ],
        },
        {
          kind: "p",
          text: "Its 5 allied personas work beside FinOps: sustainability, IT asset management (ITAM), IT financial management (ITFM), IT service management (ITSM) and security teams.",
        },
        {
          kind: "p",
          text: "Microsoft calls personas stakeholders. It lists 7 core stakeholders, with business owners and product owners listed separately.",
        },
      ],
    },
    {
      id: "who-owns-which-lever",
      title: "Who owns usage and rates",
      blocks: [
        { kind: "p", text: "Your cloud cost moves with what you use and the rate you pay." },
        { kind: "svg", figure: figure1 },
        {
          kind: "ul",
          items: [
            "Engineering teams own usage, such as node counts and disk sizes. Microsoft’s FinOps principles say each team owns its technology usage.",
            "A central team owns rates. Microsoft suggests one dedicated team or person buys commitment discounts.",
            "AWS says finance should advise on spending for commitment discounts, such as Reserved Instances and Savings Plans.",
          ],
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
            "Engineers can weigh cost only when they see it. Microsoft asks for clear usage and cost data, given quickly to the right people.",
            [
              "A discount reduces the rate, not the usage. Usage changes are the other way to ",
              { a: "reduce your cloud cost", href: "/cloud-cost-optimization" },
              ".",
            ],
            "Usage and rate interact. If engineers reduce usage below a commitment, part of it goes unused. Microsoft warns this can lose money, though rarely.",
          ],
        },
      ],
    },
  ],
  related: [
    { title: "FinOps", line: "The practice these personas share.", href: "/learn/glossary/finops" },
    {
      title: "FinOps maturity model",
      line: "How a FinOps practice grows.",
      href: "/learn/glossary/finops-maturity-model",
    },
    {
      title: "Rightsizing",
      line: "A usage lever engineers hold.",
      href: "/learn/glossary/rightsizing",
    },
    {
      title: "Savings plan",
      line: "A commitment discount on the rate.",
      href: "/learn/glossary/savings-plan",
    },
  ],
  relatedTitle: "Related terms",
  next: { title: "Cloud cost optimization", href: "/cloud-cost-optimization" },
  sources: [
    {
      publisher: "FinOps Foundation",
      title: "“FinOps Personas”",
      url: "https://www.finops.org/framework/personas/",
    },
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
