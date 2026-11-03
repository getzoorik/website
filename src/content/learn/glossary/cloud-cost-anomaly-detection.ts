import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/cloud-cost-anomaly-detection/1";

export const term: GlossaryTerm = {
  slug: "cloud-cost-anomaly-detection",
  term: "Cloud cost anomaly detection",
  title: "Cost anomaly detection on AWS and Azure",
  meta: "Cost anomaly detection learns your normal cloud cost and flags sudden changes. How AWS Cost Anomaly Detection and Azure find them, and what they miss.",
  h1: "Cost anomaly detection on AWS and Azure",
  card: "Cloud cost anomaly detection is an automated check that learns your normal cloud cost and flags sudden changes.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-26",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: "Cloud cost anomaly detection is an automated check that learns your normal cloud cost and flags sudden changes. An anomaly is a spike or drop your past cost doesn’t predict.",
    },
    {
      kind: "p",
      text: "On AWS, the service is AWS Cost Anomaly Detection. On Azure, Microsoft Cost Management runs the check for each subscription.",
    },
  ],
  sections: [
    {
      id: "what-is-a-cost-anomaly-in-aws",
      title: "AWS and Azure compared",
      blocks: [
        {
          kind: "table",
          columns: [
            { label: "", width: "22%" },
            { label: "AWS", width: "39%" },
            { label: "Azure", width: "39%" },
          ],
          rows: [
            [
              "How it judges",
              "Machine learning that allows for weekly or monthly patterns and natural growth",
              "Compares each day’s total with its forecast for that day",
            ],
            [
              "When it runs",
              "About three times a day. Detection can take up to 24\u00a0hours.",
              "Once a day, 36\u00a0hours after the day ends (UTC)",
            ],
            [
              "History",
              "Needs 10\u00a0days for a newly used service",
              "Learns from the last 60\u00a0days",
            ],
            [
              "Scope",
              "All services, or chosen accounts, cost allocation tags or cost categories",
              "One subscription",
            ],
            ["Alerts", "Email or an Amazon SNS topic", "Email, sent once when it’s found"],
          ],
        },
      ],
    },
    {
      id: "an-example-a-costlier-gateway",
      title: "Example: a costlier gateway",
      blocks: [
        {
          kind: "p",
          text: "In Microsoft’s 2021 example, a resource group cost about $4.56 a day. On 30 June, its VPN gateway’s VpnGw1 charge stopped and a costlier VpnGw3 charge started.",
        },
        {
          kind: "p",
          text: "Daily cost rose to $20.68 that day and $30.22 from 1 July. A change in the middle of a day shows in full only the next day.",
        },
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
            "An alert flags a sudden jump within days. If it wasn’t planned, you catch it early.",
            "Detection misses steady extra cost, such as a virtual machine oversized from day one. That cost is part of the normal it learns.",
            [
              { a: "Cloud cost optimization", href: "/cloud-cost-optimization" },
              " finds it by comparing what you run with what it uses. ",
              { a: "Coral", href: "/coral" },
              " rebalances Kubernetes requests to match real use, and ",
              { a: "Amoeba", href: "/amoeba" },
              " rightsizes block storage.",
            ],
            [
              "Our library lists ",
              { a: "cloud cost optimization tools", href: "/cloud-cost-optimization-library" },
              " and what each one does.",
            ],
          ],
        },
      ],
    },
  ],
  related: [
    { title: "FinOps", line: "Shared ownership of cloud cost.", href: "/learn/glossary/finops" },
    {
      title: "Showback",
      line: "Reports each team’s share of the cost.",
      href: "/learn/glossary/showback",
    },
    {
      title: "Cloud cost governance",
      line: "Rules, including alerts on unusual cost.",
      href: "/learn/glossary/cloud-cost-governance",
    },
    {
      title: "Rightsizing",
      line: "Fixes the steady extra cost alerts miss.",
      href: "/learn/glossary/rightsizing",
    },
  ],
  relatedTitle: "Related terms",
  next: {
    title: "Cloud cost optimization",
    href: "/cloud-cost-optimization",
  },
  sources: [
    {
      publisher: "Amazon Web Services",
      title: "“Detecting unusual spend with AWS Cost Anomaly Detection”",
      url: "https://docs.aws.amazon.com/cost-management/latest/userguide/manage-ad.html",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Identify anomalies and unexpected changes in cost”",
      url: "https://learn.microsoft.com/en-us/azure/cost-management-billing/understand/analyze-unexpected-charges",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Anomaly management”",
      url: "https://learn.microsoft.com/en-us/cloud-computing/finops/framework/understand/anomalies",
    },
  ],
};
