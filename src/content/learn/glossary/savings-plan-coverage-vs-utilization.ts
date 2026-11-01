import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/savings-plan-coverage-vs-utilization/1";

export const term: GlossaryTerm = {
  slug: "savings-plan-coverage-vs-utilization",
  term: "Savings plan coverage vs utilization (reservation coverage and utilization)",
  title: "What is savings plan coverage vs utilization?",
  meta: "Savings plan coverage vs utilization: coverage is how much usage your commitments cover, utilization how much of a commitment you use. See AWS’s examples.",
  h1: "What is savings plan coverage vs utilization?",
  card: "Savings plan coverage vs utilization compares two measures of a commitment discount, such as a savings plan.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-26",
  updated: "2026-11-01",
  definition: [
    {
      kind: "p",
      text: [
        "Savings plan coverage vs utilization compares two measures of a commitment discount, such as a ",
        { a: "savings plan", href: "/learn/glossary/savings-plan" },
        ". Utilization is the share of your commitment that you use. Coverage is how much eligible usage your commitments cover.",
      ],
    },
    {
      kind: "p",
      text: [
        "A commitment discount is a reduced rate for committing to a level of usage or spend over a set period. Uncovered usage pays the ",
        { a: "on-demand rate", href: "/learn/glossary/on-demand-instance" },
        ".",
      ],
    },
  ],
  sections: [
    {
      id: "aws-savings-plan-coverage-vs-utilization-two",
      title: "AWS savings plan coverage vs utilization: two examples",
      blocks: [
        { kind: "p", text: "Both are AWS’s examples:" },
        {
          kind: "ul",
          items: [
            "Utilization: you commit to $10 an hour and use $9.80 of it in one hour. That’s 98%.",
            "Coverage: Savings Plans cover 9 of your 10 identical instances, each $1.00 an hour on-demand. That’s $9 of $10, or 90%.",
          ],
        },
        { kind: "svg", figure: figure1 },
        { kind: "h3", id: "ri-utilization-and-coverage", title: "RI utilization and coverage" },
        {
          kind: "p",
          text: [
            "Utilization is about the plan. Coverage is about your usage. The same two measures apply to a ",
            { a: "reserved instance (RI)", href: "/learn/glossary/reserved-instance" },
            ", so RI coverage vs utilization works the same way.",
          ],
        },
      ],
    },
    {
      id: "savings-plan-utilization-vs-coverage-in-azure",
      title: "Savings plan utilization vs coverage in Azure",
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
      title: "Savings plan",
      line: "An hourly spend commitment.",
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
