import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/amortized-cost/1";

export const term: GlossaryTerm = {
  slug: "amortized-cost",
  term: "Amortized cost (cloud cost view)",
  title: "What is amortized cost in Azure and AWS?",
  meta: "Azure amortized cost spreads a reservation or savings plan purchase over its term. Amortized vs actual cost, Microsoft’s $365 example, AWS net amortized cost.",
  h1: "What is amortized cost in Azure and AWS?",
  card: "Amortized cost in Azure is a Microsoft Cost Management view that spreads each reservation or savings plan purchase over its term.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-26",
  updated: "2026-11-01",
  definition: [
    {
      kind: "p",
      text: [
        "Amortized cost in Azure is a Microsoft Cost Management view that spreads each ",
        { a: "reservation", href: "/learn/glossary/reserved-instance" },
        " or ",
        { a: "savings plan", href: "/learn/glossary/savings-plan" },
        " purchase over its term. Actual cost, the default view, shows it on the day you’re charged. Azure Marketplace purchases aren’t spread.",
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
          text: "That’s the amortized cost meaning in Azure: a daily share, charged to the resources that used it. Only this view shows the unused part, as UnusedReservation or UnusedSavingsPlan.",
        },
      ],
    },
    {
      id: "what-is-amortized-cost-in-aws",
      title: "What is amortized cost in AWS? Unblended vs net amortized cost",
      blocks: [
        { kind: "p", text: "In AWS Cost Explorer, unblended vs amortized cost looks like this:" },
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
      title: "Why it matters for your cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            "Neither view changes what you pay, only when and where each cost shows.",
            "A purchase month usually looks smaller in amortized cost, and later months look bigger.",
            "With purchase spikes flattened, other cost changes are easier to spot.",
            "An unused line is commitment you paid for but didn’t use.",
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
