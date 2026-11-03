import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/egress-cost/1";

export const term: GlossaryTerm = {
  slug: "egress-cost",
  term: "Egress cost (data transfer, bandwidth)",
  title: "Egress vs ingress: meaning and cost",
  meta: "Egress is data leaving a network and ingress is data entering it. What each means in the cloud, and how AWS and Azure charge for data transfer.",
  h1: "Egress vs ingress: meaning and cost",
  card: "Egress is data leaving a network, such as your users’ downloads, and ingress is data entering it, such as uploads.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-26",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: "Egress is data leaving a network, such as your users’ downloads, and ingress is data entering it, such as uploads. Egress cost is the per-GB fee a cloud provider charges for egress, also called egress fees or data transfer charges.",
    },
  ],
  sections: [
    {
      id: "egress-vs-ingress-whats-the-difference",
      title: "What is charged",
      blocks: [
        {
          kind: "p",
          text: "Ingress from the internet is free on AWS and Azure. Egress is charged per GB:",
        },
        {
          kind: "ul",
          items: [
            "Out to the internet: both give you the first 100\u00a0GB a month free (November 2026).",
            "Between Regions: charged where the data leaves, free where it arrives.",
            "Between Availability Zones (AZs) in one AWS Region: charged both out and in, though some services carry it free.",
          ],
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "egress-cost-in-aws-and-azure",
      title: "AWS and Azure egress fees",
      blocks: [
        {
          kind: "ul",
          items: [
            "AWS calls egress data transfer. AWS data transfer costs depend on the service and the source Region.",
            "Azure calls it bandwidth. It charges per GB in monthly tiers, by source region and by route: Microsoft’s network or a transit internet provider’s.",
            "Leave AWS or Azure for another cloud or your own data center, and both credit back the egress charges on request.",
          ],
        },
        {
          kind: "h3",
          id: "cross-az-data-transfer-cost-an-example",
          title: "Cross-zone traffic on EKS",
        },
        {
          kind: "p",
          text: "Say your Amazon EKS cluster has nodes in three AZs. By default, kube-proxy spreads Service traffic across pods in every zone. So calls between your pods can cross zones, and AWS charges for that traffic.",
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
            "You pay per GB moved, so egress cost grows with traffic, not machine size.",
            "The free AWS Pricing Calculator estimates AWS data transfer charges before you build.",
            [
              "A Service’s ",
              { code: "trafficDistribution" },
              " field, generally available since Kubernetes 1.33, can prefer pods in the same zone.",
            ],
            "On EKS, the AWS Load Balancer Controller’s ip mode sends traffic straight to pods, skipping a cross-zone hop.",
            "A NAT gateway in each AZ keeps internet-bound traffic inside its own zone, though each gateway adds its own charge.",
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
  relatedTitle: "Related terms",
  next: {
    title: "AWS NAT gateway pricing",
    href: "/learn/aws-nat-gateway-pricing",
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
      publisher: "AWS",
      title: "“Free data transfer out to internet when moving out of AWS”",
      url: "https://aws.amazon.com/blogs/aws/free-data-transfer-out-to-internet-when-moving-out-of-aws/",
      note: " (AWS News Blog)",
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
