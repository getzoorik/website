import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/amortized-cost/1";

export const term: GlossaryTerm = {
  slug: "amortized-cost",
  term: "Amortized cost (cloud cost view)",
  title: "What is amortized cost?",
  meta: "Amortized cost spreads reservation and savings plan fees over the days they cover. How it differs from actual cost in Azure and unblended cost in AWS.",
  h1: "What is amortized cost?",
  card: "In cloud cost reports, amortized cost spreads a reservation or savings plan fee over the days it covers.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-26",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: [
        "In cloud cost reports, amortized cost spreads a ",
        { a: "reservation", href: "/learn/glossary/reserved-instance" },
        " or ",
        { a: "savings plan", href: "/learn/glossary/savings-plan" },
        " fee over the days it covers. You see a daily rate instead of one charge on the day you pay.",
      ],
    },
    {
      kind: "p",
      text: [
        "By default, both clouds show each charge on the day it’s made. Azure calls this actual cost, and AWS calls it ",
        { a: "unblended cost", href: "/learn/glossary/blended-vs-unblended-cost" },
        ". AWS describes unblended cost as a cash basis and amortized cost as an accrual basis.",
      ],
    },
  ],
  sections: [
    {
      id: "amortized-cost-vs-actual-cost-an-example",
      title: "Amortized vs actual cost",
      blocks: [
        {
          kind: "p",
          text: "Microsoft’s example is a $365 one-year reservation bought on January 1:",
        },
        {
          kind: "ul",
          items: [
            "Actual cost: one $365 charge on January 1.",
            "Amortized cost: $1.00 a day from January 1 to December 31.",
            "Two virtual machines (VMs) share it: two $0.50 charges each day.",
            "Only one VM uses it: $0.50 for that VM and $0.50 as UnusedReservation.",
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: "An upfront payment is spread over the whole term. A monthly payment is spread over the days of its month.",
        },
        {
          kind: "p",
          text: "In Azure, amortization covers only reservation and savings plan purchases, not Azure Marketplace ones. Unused commitment shows only in amortized cost, as UnusedReservation or UnusedSavingsPlan.",
        },
      ],
    },
    {
      id: "what-is-amortized-cost-in-aws",
      title: "Amortized cost in AWS",
      blocks: [
        {
          kind: "p",
          text: "These three AWS Cost Explorer views differ in when commitment fees show:",
        },
        {
          kind: "ul",
          items: [
            "Unblended cost: each charge on the day it’s made, so reservation fees show as a spike.",
            "Amortized cost: unblended cost, with upfront and monthly reservation fees spread as an effective daily rate.",
            "Net amortized cost: amortized cost after discounts, such as Reserved Instance volume discounts.",
          ],
        },
        {
          kind: "p",
          text: "To see how much of a reservation went unused, group by purchase option.",
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
            "Neither view changes what you pay, only when and where each cost shows.",
            "Use actual cost to check your invoice. Use amortized cost to spot changes, with purchase spikes flattened.",
            "After an upfront purchase, that month looks smaller in amortized cost, and the months after it look bigger.",
            [
              "Amortized cost assigns each day’s share to the resources that used it, which suits ",
              { a: "chargeback", href: "/learn/glossary/cloud-chargeback" },
              ".",
            ],
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Reserved instance",
      line: "A commitment amortized cost spreads.",
      href: "/learn/glossary/reserved-instance",
    },
    { title: "Savings plan", line: "Spread the same way.", href: "/learn/glossary/savings-plan" },
    {
      title: "Blended vs unblended cost",
      line: "The other AWS cost views.",
      href: "/learn/glossary/blended-vs-unblended-cost",
    },
    {
      title: "Savings plan coverage vs utilization",
      line: "How much of a commitment gets used.",
      href: "/learn/glossary/savings-plan-coverage-vs-utilization",
    },
  ],
  relatedTitle: "Related terms",
  next: {
    title: "Cloud cost optimization",
    href: "/cloud-cost-optimization",
  },
  sources: [
    {
      publisher: "Microsoft Learn",
      title: "“Customize views in Cost Analysis”",
      url: "https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/customize-cost-analysis-views",
    },
    {
      publisher: "Microsoft Learn",
      title: "“View savings plan cost and usage”",
      url: "https://learn.microsoft.com/en-us/azure/cost-management-billing/savings-plan/utilization-cost-reports",
    },
    {
      publisher: "AWS",
      title: "“Choosing advanced options”",
      url: "https://docs.aws.amazon.com/cost-management/latest/userguide/ce-advanced.html",
      note: " (AWS Cost Management User Guide)",
    },
    {
      publisher: "AWS",
      title: "“Understanding your AWS Cost Datasets: A Cheat Sheet”",
      url: "https://aws.amazon.com/blogs/aws-cloud-financial-management/understanding-your-aws-cost-datasets-a-cheat-sheet/",
      note: " (AWS Cloud Financial Management blog)",
    },
  ],
};
