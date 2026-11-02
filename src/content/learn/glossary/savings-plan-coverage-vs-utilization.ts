import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/savings-plan-coverage-vs-utilization/1";

export const term: GlossaryTerm = {
  slug: "savings-plan-coverage-vs-utilization",
  term: "Savings plan coverage vs utilization (reservation coverage and utilization)",
  title: "RI utilization vs coverage for commitment discounts",
  meta: "RI utilization is the share of a commitment you use; coverage is how much eligible usage commitments cover. See AWS’s two examples and how Azure tracks both.",
  h1: "RI utilization vs coverage for commitment discounts",
  card: "Utilization and coverage measure a commitment discount, such as a reserved instance (RI) or savings plan.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-26",
  updated: "2026-11-02",
  definition: [
    {
      kind: "p",
      text: [
        "Utilization and coverage measure a commitment discount, such as a ",
        { a: "reserved instance (RI)", href: "/learn/glossary/reserved-instance" },
        " or ",
        { a: "savings plan", href: "/learn/glossary/savings-plan" },
        ". Utilization is the share of the commitment you use. Coverage is the share of eligible usage the commitment covers.",
      ],
    },
    {
      kind: "p",
      text: [
        "A commitment discount is a reduced rate for committing to a usage level, or an amount an hour, for a set period. Uncovered usage pays the ",
        { a: "on-demand rate", href: "/learn/glossary/on-demand-instance" },
        ".",
      ],
    },
  ],
  sections: [
    {
      id: "aws-savings-plan-coverage-vs-utilization-two",
      title: "Coverage vs utilization in AWS: two examples",
      blocks: [
        {
          kind: "ul",
          items: [
            "Utilization: you commit $10 an hour to a Savings Plan and use $9.80 of it in one hour, so utilization is 98%.",
            "Coverage: Savings Plans cover 9 of your 10 identical instances, each $1.00 an hour on-demand, so coverage is $9 of $10, or 90%.",
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "h3",
          id: "ri-utilization-and-coverage",
          title: "Coverage and utilization for reserved instances",
        },
        {
          kind: "p",
          text: "AWS Cost Explorer has a report for each. RI utilization is the share of purchased RI hours that matching instances use. RI coverage is the share of your instance hours that reservations cover.",
        },
      ],
    },
    {
      id: "savings-plan-utilization-vs-coverage-in-azure",
      title: "Utilization vs coverage in Azure",
      blocks: [
        {
          kind: "p",
          text: "Microsoft’s FinOps toolkit tracks both for reservations and savings plans. Utilization finds under-used commitments. Coverage finds chances to commit more.",
        },
        {
          kind: "ul",
          items: [
            "Azure savings plan utilization shows on each plan’s page in the portal.",
            "Microsoft suggests alerts when reservation utilization in Azure drops below a set level.",
          ],
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why coverage and utilization matter for your cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            "Unused commitment is still a charge. The FinOps toolkit splits commitment cost into used and unused.",
            "Utilization falls when eligible usage drops below the hourly commitment, for example after you remove spare nodes.",
            [
              "So reduce usage with ",
              { a: "cloud cost optimization", href: "/cloud-cost-optimization" },
              ", then commit to what’s left.",
            ],
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Savings plan",
      line: "A commitment to an amount an hour.",
      href: "/learn/glossary/savings-plan",
    },
    {
      title: "Reserved instance",
      line: "A commitment to one instance setup.",
      href: "/learn/glossary/reserved-instance",
    },
    {
      title: "Rightsizing",
      line: "Sizing resources to real use first.",
      href: "/learn/glossary/rightsizing",
    },
    {
      title: "Effective savings rate",
      line: "Savings as a share of list cost.",
      href: "/learn/glossary/effective-savings-rate",
    },
  ],
  next: {
    title: "Cloud cost optimization: how to reduce cloud costs",
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
