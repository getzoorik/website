import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/effective-savings-rate/1";

export const term: GlossaryTerm = {
  slug: "effective-savings-rate",
  term: "Effective savings rate (ESR)",
  title: "What is effective savings rate (ESR)?",
  meta: "Effective savings rate (ESR) is the share of your list cost that discounts saved. The formula, a worked example, and what pulls ESR down.",
  h1: "What is effective savings rate (ESR)?",
  card: "Effective savings rate (ESR) is the percentage of your list cost that discounts saved.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-26",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: "Effective savings rate (ESR) is the percentage of your list cost that discounts saved. It counts negotiated discounts from your contract and commitment discounts, such as reservations and savings plans.",
    },
  ],
  sections: [
    {
      id: "how-esr-is-worked-out",
      title: "How to calculate ESR",
      blocks: [
        { kind: "p", text: "Microsoft’s FinOps toolkit compares three costs:" },
        {
          kind: "ul",
          items: [
            "List cost: what you’d pay at list prices, with no discounts.",
            "Contracted cost: list cost minus negotiated discounts.",
            "Effective cost: what you pay after all discounts, with commitment purchases spread over their term.",
          ],
        },
        {
          kind: "p",
          text: "ESR = (list cost − effective cost) ÷ list cost. Leave out the commitment purchases themselves: they have a list cost but no effective cost, which skews the result.",
        },
      ],
    },
    {
      id: "an-example",
      title: "Example",
      blocks: [
        {
          kind: "p",
          text: "Say a month’s list cost is $1,000. Negotiated discounts save $100, so the contracted cost is $900. Commitment discounts save $200 more, so the effective cost is $700.",
        },
        { kind: "p", text: "That’s $300 saved on $1,000 of list cost, an ESR of 30%." },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            "Unused commitments still cost money and save nothing, so they reduce ESR.",
            "If effective cost is above list cost, savings and ESR are negative. Microsoft’s toolkit shows them as negative, not zero.",
            [
              "A high ESR doesn’t mean a low cloud cost. Discounts reduce prices, and using fewer resources is the other half of ",
              { a: "reducing cloud costs", href: "/cloud-cost-optimization" },
              ".",
            ],
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Savings plan coverage vs utilization",
      line: "The share of use covered, and of commitments used.",
      href: "/learn/glossary/savings-plan-coverage-vs-utilization",
    },
    {
      title: "Savings plan",
      line: "An hourly cost commitment that buys cheaper rates.",
      href: "/learn/glossary/savings-plan",
    },
    {
      title: "Reserved instance",
      line: "A usage commitment for a chosen instance type and region.",
      href: "/learn/glossary/reserved-instance",
    },
    {
      title: "Amortized cost",
      line: "Spreads purchases over their term, as effective cost does.",
      href: "/learn/glossary/amortized-cost",
    },
  ],
  relatedTitle: "Related terms",
  next: { title: "Cloud cost optimization", href: "/cloud-cost-optimization" },
  sources: [
    {
      publisher: "Microsoft Learn",
      title: "“Common terms”",
      url: "https://learn.microsoft.com/en-us/cloud-computing/finops/toolkit/help/terms",
      note: " (FinOps toolkit)",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Understanding savings calculations in FinOps toolkit”",
      url: "https://learn.microsoft.com/en-us/cloud-computing/finops/toolkit/hubs/savings-calculations",
    },
    {
      publisher: "Microsoft Learn",
      title: "“FinOps toolkit Rate optimization report”",
      url: "https://learn.microsoft.com/en-us/cloud-computing/finops/toolkit/power-bi/rate-optimization",
    },
  ],
};
