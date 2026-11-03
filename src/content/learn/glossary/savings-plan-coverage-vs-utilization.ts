import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/savings-plan-coverage-vs-utilization/1";

export const term: GlossaryTerm = {
  slug: "savings-plan-coverage-vs-utilization",
  term: "Savings plan coverage vs utilization (reservation coverage and utilization)",
  title: "Savings plan coverage vs utilization",
  meta: "Utilization is how much of a commitment you use. Coverage is how much of your usage it covers. AWS’s examples, the RI reports, and how Azure tracks both.",
  h1: "Savings plan coverage vs utilization",
  card: "Utilization is the share of a commitment discount you use, and coverage is the share of your eligible usage it covers.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-26",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: "Utilization is the share of a commitment discount you use, and coverage is the share of your eligible usage it covers. Low utilization means you committed too much. Low coverage means you could commit more.",
    },
    {
      kind: "p",
      text: [
        "A commitment discount is a reduced rate in return for committing to usage or spend for a set period. ",
        { a: "Savings plans", href: "/learn/glossary/savings-plan" },
        " and ",
        { a: "reserved instances (RIs)", href: "/learn/glossary/reserved-instance" },
        " are the common ones. Usage they don’t cover pays the ",
        { a: "on-demand rate", href: "/learn/glossary/on-demand-instance" },
        ".",
      ],
    },
  ],
  sections: [
    {
      id: "aws-savings-plan-coverage-vs-utilization-two",
      title: "In AWS",
      blocks: [
        {
          kind: "ul",
          items: [
            "Utilization: you commit $10 an hour to a Savings Plan. Usage at Savings Plans rates totals $9.80 in an hour, so utilization is 98%.",
            "Coverage: you run 10 identical instances at $1.00 an hour on-demand. Savings Plans cover 9, so coverage is $9 of $10, or 90%.",
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "h3",
          id: "ri-utilization-and-coverage",
          title: "Reserved instances",
        },
        {
          kind: "p",
          text: "AWS Cost Explorer has a report for each. RI utilization is the share of purchased RI hours that matching instances use. RI coverage is the share of your instance hours that reservations cover. You can set a target for each, and AWS Budgets can alert you when you fall below it.",
        },
      ],
    },
    {
      id: "savings-plan-utilization-vs-coverage-in-azure",
      title: "In Azure",
      blocks: [
        {
          kind: "ul",
          items: [
            "Each reservation and savings plan shows its utilization on its page in the Azure portal.",
            "Reservation utilization alerts tell you when utilization drops below a level you set.",
            [
              "The Rate optimization report in Microsoft’s FinOps toolkit covers utilization and coverage. It measures utilization as covered usage cost divided by the ",
              { a: "amortized", href: "/learn/glossary/amortized-cost" },
              " commitment cost.",
            ],
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
            "Unused commitment is still paid for. The FinOps toolkit splits commitment cost into used and unused.",
            [
              "Utilization falls when usage drops below the commitment, for example after you remove spare nodes. So reduce usage with ",
              { a: "cloud cost optimization", href: "/cloud-cost-optimization" },
              " first, then commit to what’s left.",
            ],
            "Microsoft advises starting small, with high-confidence commitments.",
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Savings plan",
      line: "A commitment to spend an amount an hour.",
      href: "/learn/glossary/savings-plan",
    },
    {
      title: "Reserved instance",
      line: "A commitment to one VM setup.",
      href: "/learn/glossary/reserved-instance",
    },
    {
      title: "Rightsizing",
      line: "Sizing resources to real use before you commit.",
      href: "/learn/glossary/rightsizing",
    },
    {
      title: "Effective savings rate",
      line: "Savings as a share of list cost.",
      href: "/learn/glossary/effective-savings-rate",
    },
  ],
  relatedTitle: "Related terms",
  next: {
    title: "Cloud cost optimization",
    href: "/cloud-cost-optimization",
  },
  sources: [
    {
      publisher: "AWS",
      title: "“Using the Savings Plans utilization report”",
      url: "https://docs.aws.amazon.com/savingsplans/latest/userguide/ce-sp-usingPR.html",
      note: " (Savings Plans User Guide)",
    },
    {
      publisher: "AWS",
      title: "“Understanding coverage metrics and calculations”",
      url: "https://docs.aws.amazon.com/savingsplans/latest/userguide/ce-sp-cr-metrics.html",
      note: " (Savings Plans User Guide)",
    },
    {
      publisher: "AWS",
      title: "“Using the default Cost Explorer reports”",
      url: "https://docs.aws.amazon.com/cost-management/latest/userguide/ce-default-reports.html",
      note: " (AWS Cost Management User Guide)",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Rate optimization”",
      url: "https://learn.microsoft.com/en-us/cloud-computing/finops/framework/optimize/rates",
    },
    {
      publisher: "Microsoft Learn",
      title: "“FinOps toolkit Rate optimization report”",
      url: "https://learn.microsoft.com/en-us/cloud-computing/finops/toolkit/power-bi/rate-optimization",
    },
  ],
};
