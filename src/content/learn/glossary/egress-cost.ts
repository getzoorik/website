import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/egress-cost/1";

export const term: GlossaryTerm = {
  slug: "egress-cost",
  term: "Data transfer (egress) cost",
  title: "What is egress cost in the cloud?",
  meta: "Egress cost is what AWS and Azure charge for data that leaves a Region. See what’s free, how cross-AZ traffic is charged and how to keep it small.",
  h1: "What is egress cost in the cloud?",
  card: "Egress cost is the fee a cloud charges for data leaving a Region, to the internet or another Region.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-26",
  updated: "2026-10-26",
  definition: [
    {
      kind: "p",
      text: "Egress cost is the fee a cloud charges for data leaving a Region, to the internet or another Region. Data egress is data going out, such as your users’ downloads. Data coming in from the internet (ingress) is free on Azure and AWS.",
    },
  ],
  sections: [
    {
      id: "egress-cost-in-aws-and-azure",
      title: "Egress cost in AWS and Azure",
      blocks: [
        { kind: "p", text: "AWS calls egress fees data transfer, and Azure calls them bandwidth." },
        {
          kind: "ul",
          items: [
            "On AWS, the rate depends on the service and the source Region.",
            "The egress cost in Azure is charged per GB in tiers, by where the data leaves and how it’s routed.",
            "Both give you 100\u00a0GB a month out to the internet free (October 2026). Prices change.",
            "Between Regions, both charge for data on the way out, not on arrival.",
          ],
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "cross-az-data-transfer-cost-an-example",
      title: "Cross-AZ data transfer cost: an example",
      blocks: [
        {
          kind: "p",
          text: "AWS also charges for data between Availability Zones (AZs), the separate locations in one Region. It charges the sender and the receiver, but some services carry it free.",
        },
        {
          kind: "p",
          text: "Say your Amazon EKS cluster has nodes in three AZs. By default, Kubernetes spreads Service traffic across pods in every zone. So calls between your pods can cross zones, and AWS charges for them.",
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for your cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            "You pay per GB moved, so the cost grows with traffic, not machine size.",
            [
              "A Service’s ",
              { code: "trafficDistribution" },
              " field, generally available since Kubernetes 1.33, can prefer same-zone pods.",
            ],
            "On EKS, the AWS Load Balancer Controller’s ip mode sends traffic straight to pods, skipping a cross-zone hop.",
            [
              { a: "How to reduce cloud costs", href: "/cloud-cost-optimization" },
              " covers the rest of your cloud cost.",
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
      title: "Cloud cost anomaly detection",
      line: "Flags sudden spend spikes, egress included.",
      href: "/learn/glossary/cloud-cost-anomaly-detection",
    },
    {
      title: "Cloud TCO",
      line: "The full cost of ownership, egress included.",
      href: "/learn/glossary/cloud-tco",
    },
    {
      title: "FinOps",
      line: "The practice of managing cloud spend.",
      href: "/learn/glossary/finops",
    },
  ],
  next: { title: "How to reduce cloud costs", href: "/cloud-cost-optimization" },
  sources: [
    {
      publisher: "AWS",
      title: "“Understanding data transfer charges”",
      url: "https://docs.aws.amazon.com/cur/latest/userguide/cur-data-transfers-charges.html",
      note: " (AWS Cost and Usage Reports User Guide)",
    },
    {
      publisher: "AWS",
      title: "“Amazon EC2 On-Demand Pricing”",
      url: "https://aws.amazon.com/ec2/pricing/on-demand/",
    },
    {
      publisher: "Microsoft Azure",
      title: "“Bandwidth pricing”",
      url: "https://azure.microsoft.com/en-us/pricing/details/bandwidth/",
    },
    {
      publisher: "AWS",
      title: "“Cost Optimization - Networking”",
      url: "https://docs.aws.amazon.com/eks/latest/best-practices/cost-opt-networking.html",
      note: " (Amazon EKS Best Practices Guide)",
    },
  ],
};
