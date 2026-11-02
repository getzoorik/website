import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/amortized-cost/1";

export const term: GlossaryTerm = {
  slug: "amortized-cost",
  term: "Amortized cost (cloud cost view)",
  title: "What is amortized cost in Azure and AWS?",
  meta: "Amortized cost meaning: Azure amortized cost spreads each reservation or savings plan over its term. See amortized vs actual cost, and AWS net amortized cost.",
  h1: "What is amortized cost in Azure and AWS?",
  card: "Amortized cost spreads each commitment fee, such as a reservation’s upfront or monthly fee, over the period it covers.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-26",
  updated: "2026-11-02",
  definition: [
    {
      kind: "p",
      text: "Amortized cost spreads each commitment fee, such as a reservation’s upfront or monthly fee, over the period it covers. Each fee shows as a daily rate, not on the day you pay.",
    },
    {
      kind: "p",
      text: [
        "In Azure, it’s a Microsoft Cost Management view that spreads only ",
        { a: "reservation", href: "/learn/glossary/reserved-instance" },
        " and ",
        { a: "savings plan", href: "/learn/glossary/savings-plan" },
        " purchases, not Azure Marketplace ones. Actual cost, the default view, shows each purchase when it’s charged.",
      ],
    },
  ],
  sections: [
    {
      id: "amortized-cost-vs-actual-cost-an-example",
      title: "Amortized cost vs actual cost: an example",
      blocks: [
        {
          kind: "p",
          text: "Microsoft’s example is a $365 one-year reservation bought on January 1.",
        },
        {
          kind: "ul",
          items: [
            "Actual cost: one $365 charge on January 1.",
            "Amortized cost: $1.00 a day until December 31.",
            "Two virtual machines share it: two $0.50 charges each day.",
            "Only one uses it: the other $0.50 shows as UnusedReservation.",
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: "So the amortized view charges each day’s share to the resources that used it. Only this view shows the unused part, as UnusedReservation or UnusedSavingsPlan.",
        },
      ],
    },
    {
      id: "what-is-amortized-cost-in-aws",
      title: "What is amortized cost in AWS? Unblended vs net amortized cost",
      blocks: [
        {
          kind: "p",
          text: "Amortized cost vs unblended cost in AWS Cost Explorer comes down to when commitment fees show.",
        },
        {
          kind: "ul",
          items: [
            "Unblended cost: each cost when you’re charged, so reservation fees show as a spike.",
            "Amortized cost: unblended cost, with upfront and monthly fees spread as a daily rate.",
            "Net amortized cost: amortized cost after discounts, such as Reserved Instance volume discounts.",
          ],
        },
        { kind: "p", text: "To see a reservation’s unused part, group by purchase option." },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why amortized cost matters",
      blocks: [
        {
          kind: "ul",
          items: [
            "Neither view changes what you pay, only when and where each cost shows.",
            "A purchase month usually looks smaller in amortized cost, and later months look bigger.",
            "With purchase spikes flattened, other cost changes are easier to spot.",
            "An unused line is commitment you paid for but didn’t use.",
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Reserved instance",
      line: "The commitment being spread.",
      href: "/learn/glossary/reserved-instance",
    },
    { title: "Savings plan", line: "Spread the same way.", href: "/learn/glossary/savings-plan" },
    {
      title: "Blended vs unblended cost",
      line: "The other AWS views.",
      href: "/learn/glossary/blended-vs-unblended-cost",
    },
    {
      title: "Savings plan coverage vs utilization",
      line: "How much of a commitment gets used.",
      href: "/learn/glossary/savings-plan-coverage-vs-utilization",
    },
  ],
  next: {
    title: "Cloud cost optimization: how to reduce cloud costs",
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
