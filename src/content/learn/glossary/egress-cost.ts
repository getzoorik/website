import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/egress-cost/1";

export const term: GlossaryTerm = {
  slug: "egress-cost",
  term: "Egress cost (data transfer, bandwidth)",
  title: "What is data egress? Egress cost and fees explained",
  meta: "Data egress is data leaving a cloud Region, and egress cost is its fee. Learn the egress and ingress meaning, and how AWS and Azure egress fees work.",
  h1: "What is data egress? Egress cost and fees explained",
  card: "Data egress is data leaving a cloud Region, such as your users’ downloads.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-26",
  updated: "2026-11-02",
  definition: [
    {
      kind: "p",
      text: "Data egress is data leaving a cloud Region, such as your users’ downloads. Egress cost is the per-GB fee for it, also called egress fees or egress charges.",
    },
  ],
  sections: [
    {
      id: "egress-vs-ingress-whats-the-difference",
      title: "Egress vs ingress: what’s the difference?",
      blocks: [
        {
          kind: "p",
          text: "Data ingress is data coming into a cloud Region, such as uploads. Egress and ingress are the two directions of cloud data transfer.",
        },
        {
          kind: "p",
          text: "Ingress from the internet is free on Azure and AWS. Both give you 100\u00a0GB a month out to the internet free (October 2026). Prices change.",
        },
      ],
    },
    {
      id: "egress-cost-in-aws-and-azure",
      title: "How AWS data transfer costs compare with Azure",
      blocks: [
        { kind: "p", text: "AWS calls egress fees data transfer, and Azure calls them bandwidth." },
        {
          kind: "ul",
          items: [
            "AWS charges for data transfer by service and by source Region, so the AWS data transfer fee for a GB varies.",
            "Azure egress cost is charged per GB, in tiers, by where data leaves and how it’s routed.",
            "Azure egress charges apply when you copy data from Azure to an on-premises server over the internet, at the usual per-GB rates.",
            "Between Regions, both charge for data on the way out, not on arrival.",
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "h3",
          id: "cross-az-data-transfer-cost-an-example",
          title: "AWS data transfer charges between Availability Zones: an example",
        },
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
      title: "Why egress cost matters",
      blocks: [
        {
          kind: "ul",
          items: [
            "You pay per GB moved, so the cost grows with traffic, not machine size.",
            "To estimate AWS egress charges before you build, use the free AWS Pricing Calculator. It works out your AWS egress cost from the AWS Price List.",
            [
              "A Service’s ",
              { code: "trafficDistribution" },
              " field, generally available since Kubernetes 1.33, can prefer same-zone pods.",
            ],
            "On EKS, the AWS Load Balancer Controller’s ip mode sends traffic straight to pods, skipping a cross-zone hop.",
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Cloud cost anomaly detection",
      line: "Flags sudden cost spikes, egress included.",
      href: "/learn/glossary/cloud-cost-anomaly-detection",
    },
    {
      title: "Cloud TCO",
      line: "The full cost of ownership, egress included.",
      href: "/learn/glossary/cloud-tco",
    },
    {
      title: "FinOps",
      line: "The practice of managing cloud cost.",
      href: "/learn/glossary/finops",
    },
  ],
  relatedTitle: "Terms related to egress cost",
  next: {
    title: "Cloud cost optimization: how to reduce cloud costs",
    href: "/cloud-cost-optimization",
  },
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
    {
      publisher: "AWS",
      title: "“What is AWS Pricing Calculator?”",
      url: "https://docs.aws.amazon.com/pricing-calculator/latest/userguide/what-is-pricing-calculator.html",
    },
  ],
};
