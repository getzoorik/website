import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/cloud-cost-anomaly-detection/1";

export const term: GlossaryTerm = {
  slug: "cloud-cost-anomaly-detection",
  term: "Cloud cost anomaly detection",
  title: "AWS cost anomaly detection, and how Azure compares",
  meta: "Cloud cost anomaly detection learns your normal cloud cost and flags sudden jumps. See how AWS anomaly detection and Azure find them, and what both miss.",
  h1: "AWS cost anomaly detection, and how Azure compares",
  card: "Cloud cost anomaly detection is an automated check that learns your normal cloud cost and flags sudden changes.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-26",
  updated: "2026-11-02",
  definition: [
    {
      kind: "p",
      text: "Cloud cost anomaly detection is an automated check that learns your normal cloud cost and flags sudden changes. An anomaly is a spike or drop your past cost doesn’t predict.",
    },
    {
      kind: "p",
      text: "AWS Cost Anomaly Detection is AWS’s own service for it, and Microsoft Cost Management runs the same kind of check for Azure.",
    },
  ],
  sections: [
    {
      id: "what-is-a-cost-anomaly-in-aws",
      title: "What is a cost anomaly in AWS and Azure?",
      blocks: [
        {
          kind: "ul",
          items: [
            "AWS uses machine learning to mark cost as unusual, allowing for weekly or monthly patterns and natural growth.",
            "AWS checks about three times a day; detection can take up to 24\u00a0hours.",
            "AWS needs 10\u00a0days of history for a newly used service.",
            "Azure checks each subscription 36\u00a0hours after the day ends (UTC). It compares the day’s total with a forecast from the last 60\u00a0days.",
          ],
        },
      ],
    },
    {
      id: "an-example-a-costlier-gateway",
      title: "An example: a costlier gateway",
      blocks: [
        {
          kind: "p",
          text: "In Microsoft’s 2021 example, a resource group cost about $4.56 a day.",
        },
        {
          kind: "p",
          text: "On 30 June, a VpnGw1 charge on its virtual private network gateway stopped. A costlier VpnGw3 charge started. Daily cost rose to $20.68 that day and $30.22 from 1 July.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why anomaly detection matters for your cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            "An email alert flags a sudden jump within days. If it wasn’t planned, you catch it early.",
            "Detection misses steady overprovisioning, such as a virtual machine oversized from day one. That cost is part of the normal it learns.",
            [
              { a: "Cloud cost optimization", href: "/cloud-cost-optimization" },
              " finds it by comparing what you run with its use.",
            ],
            [
              "Our library lists FinOps tools and other ",
              { a: "cloud cost optimization tools", href: "/cloud-cost-optimization-library" },
              ", with what each one does.",
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
      line: "Fixes the steady extra size alerts miss.",
      href: "/learn/glossary/rightsizing",
    },
  ],
  next: {
    title: "Cloud cost optimization: how to reduce cloud costs",
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
