import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/effective-savings-rate/1";

export const term: GlossaryTerm = {
  slug: "effective-savings-rate",
  term: "Effective savings rate (ESR)",
  title: "What is effective savings rate (ESR)?",
  meta: "Effective savings rate (ESR) is the share of list cost your discounts saved. See the three costs behind it, an example, and why unused commitments reduce it.",
  h1: "What is effective savings rate (ESR)?",
  card: "Effective savings rate (ESR) is the percentage of your list cost that discounts saved.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-26",
  updated: "2026-10-26",
  definition: [
    {
      kind: "p",
      text: "Effective savings rate (ESR) is the percentage of your list cost that discounts saved. It counts negotiated discounts from your contract. It also counts commitment discounts, such as reservations and savings plans.",
    },
  ],
  sections: [
    {
      id: "how-esr-is-worked-out",
      title: "How ESR is worked out",
      blocks: [
        {
          kind: "p",
          text: "To work out the effective savings rate, FinOps tools such as Microsoft’s toolkit compare three costs:",
        },
        {
          kind: "ul",
          items: [
            "List cost: what you’d pay with no discounts.",
            "Contracted cost: list cost minus negotiated discounts.",
            "Effective cost: what you pay after all discounts, with commitment purchases spread over their term.",
          ],
        },
        {
          kind: "p",
          text: "ESR is total savings, the gap between list and effective cost, divided by list cost. Leave out commitment purchases, or they skew the result.",
        },
      ],
    },
    {
      id: "an-example",
      title: "An example",
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
      title: "Why it matters for your cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            "ESR shows the effect of all your discounts as one percentage.",
            "Unused commitments still cost you, so they reduce ESR.",
            "Effective cost above list cost gives negative savings, and a negative ESR.",
            [
              "A high ESR doesn’t mean a low cloud cost. Discounts reduce unit prices. Using fewer resources is the other half of ",
              { a: "how to reduce cloud costs", href: "/learn/how-to-reduce-cloud-costs" },
              ".",
            ],
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
    {
      title: "Savings plan coverage vs utilization",
      line: "The share of use covered, and of commitments used.",
      href: "/learn/glossary/savings-plan-coverage-vs-utilization",
    },
    {
      title: "Savings plan",
      line: "A spend commitment that buys cheaper rates.",
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
  next: { title: "How to reduce cloud costs", href: "/learn/how-to-reduce-cloud-costs" },
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
