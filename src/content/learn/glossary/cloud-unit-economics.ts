import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/cloud-unit-economics/1";

export const term: GlossaryTerm = {
  slug: "cloud-unit-economics",
  term: "Cloud unit economics",
  title: "What is cloud unit economics?",
  meta: "Cloud unit economics divides your cloud cost by a business unit, like a sale or a user. See how FinOps tracks this cloud KPI as you grow, with an AWS example.",
  h1: "What is cloud unit economics?",
  card: "Cloud unit economics means working out the cloud cost of one business unit, such as one sale or one user.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-25",
  updated: "2026-11-02",
  definition: [
    {
      kind: "p",
      text: "Cloud unit economics means working out the cloud cost of one business unit, such as one sale or one user. You divide cloud cost by the number of units. That ties your cloud cost to business value.",
    },
    {
      kind: "p",
      text: "AWS calls this ratio a unit metric, and for a rideshare firm the unit could be trips taken.",
    },
  ],
  sections: [
    {
      id: "cloud-unit-economics-in-finops",
      title: "Cloud unit economics in FinOps",
      blocks: [
        { kind: "p", text: "Microsoft’s FinOps guide works out unit cost in four steps:" },
        {
          kind: "ol",
          items: [
            "Decide what one unit is.",
            "Map units to the cloud services behind them.",
            "Split shared costs by each unit’s use.",
            "Share out unmapped use by known usage percentages, or treat it as overhead.",
          ],
        },
        {
          kind: "p",
          text: "AWS says units must be business metrics, not technical ones, such as web pages served or customer reports produced. It suggests fewer than five per workload.",
        },
      ],
    },
    {
      id: "unit-cost-and-other-finops-kpis",
      title: "Unit cost and other FinOps KPIs",
      blocks: [
        {
          kind: "p",
          text: "Microsoft advises building unit costs into business key performance indicators (KPIs). AWS says agreeing on unit cost metrics gives technology and business teams a common language about efficiency.",
        },
        { kind: "p", text: "Microsoft names other FinOps KPIs too:" },
        {
          kind: "ul",
          items: [
            [
              {
                a: "Commitment utilization",
                href: "/learn/glossary/savings-plan-coverage-vs-utilization",
              },
              ": the share of your commitments you use.",
            ],
            "Shared cost allocation: the percentage of shared costs left unallocated.",
            "Tagging compliance: how well your resources follow your tagging strategy.",
          ],
        },
      ],
    },
    {
      id: "an-example-from-aws",
      title: "An AWS example: usage grows faster than cost",
      blocks: [
        {
          kind: "p",
          text: "AWS’s Well-Architected guide gives a sample target: usage grows 20%, while costs grow less than 5%. Your cloud cost goes up, but each unit costs less.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why unit economics matter for your cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            "Cloud cost is the top of the ratio, so reducing it makes each unit cheaper if units hold steady.",
            [
              { a: "Coral", href: "/coral" },
              " rebalances CPU and memory requests on AKS and EKS to match real use, so the same pods fit on fewer nodes.",
            ],
            [
              { a: "Amoeba", href: "/amoeba" },
              " moves a virtual machine’s data disks onto one btrfs pool sized to your data, then rightsizes it autonomously.",
            ],
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Kubernetes cost allocation",
      line: "Splits a shared cluster’s cost by team and app.",
      href: "/learn/glossary/kubernetes-cost-allocation",
    },
    {
      title: "FinOps",
      line: "The practice unit economics is part of.",
      href: "/learn/glossary/finops",
    },
    {
      title: "Cloud chargeback",
      line: "Charges each team its share, which the team then pays from its own budget.",
      href: "/learn/glossary/cloud-chargeback",
    },
    {
      title: "Showback",
      line: "Shows each team its cost, with no charge.",
      href: "/learn/glossary/showback",
    },
  ],
  relatedTitle: "Cloud cost terms related to unit economics",
  next: {
    title: "Kubernetes cost estimation: what a cluster costs",
    href: "/learn/kubernetes-cost-estimation",
  },
  sources: [
    {
      publisher: "Microsoft Learn",
      title: "“Unit economics”",
      url: "https://learn.microsoft.com/en-us/cloud-computing/finops/framework/quantify/unit-economics",
    },
    {
      publisher: "AWS",
      title: "“What is a unit metric?”",
      url: "https://aws.amazon.com/blogs/aws-cloud-financial-management/what-is-a-unit-metric/",
    },
    {
      publisher: "AWS",
      title: "“COST02-BP02 Implement goals and targets”",
      url: "https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/cost_govern_usage_goal_target.html",
    },
    {
      publisher: "AWS",
      title: "“COST03-BP04 Establish organization metrics”",
      url: "https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/cost_monitor_usage_define_kpi.html",
    },
    {
      publisher: "AWS",
      title: "“Building a cost allocation strategy”",
      url: "https://docs.aws.amazon.com/whitepapers/latest/tagging-best-practices/building-a-cost-allocation-strategy.html",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Allocation”",
      url: "https://learn.microsoft.com/en-us/cloud-computing/finops/framework/understand/allocation",
    },
    {
      publisher: "Microsoft Learn",
      title: "“FinOps toolkit Rate optimization report”",
      url: "https://learn.microsoft.com/en-us/cloud-computing/finops/toolkit/power-bi/rate-optimization",
    },
  ],
};
