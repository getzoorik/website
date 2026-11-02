import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/aws-edp/1";

export const term: GlossaryTerm = {
  slug: "aws-edp",
  term: "AWS EDP (Enterprise Discount Program)",
  title: "What is AWS EDP (Enterprise Discount Program)?",
  meta: "AWS EDP meaning: the AWS Enterprise Discount Program gives a discount for a commitment to AWS. How the EDP discount shows in your cost data, and PPA vs EDP.",
  h1: "What is AWS EDP (Enterprise Discount Program)?",
  card: "AWS EDP, the AWS Enterprise Discount Program, gives you a discount for a commitment to AWS.",
  group: "finops-pricing",
  product: "both",
  published: "2026-11-02",
  updated: "2026-11-02",
  definition: [
    {
      kind: "p",
      text: "AWS EDP, the AWS Enterprise Discount Program, gives you a discount for a commitment to AWS. Eligible purchases count toward the commitment, and the discount shows in your AWS cost data.",
    },
  ],
  sections: [
    {
      id: "how-the-aws-edp-discount-shows-in-your-cost-data",
      title: "How the AWS EDP discount shows in your cost data",
      blocks: [
        {
          kind: "p",
          text: "The AWS Cost and Usage Report (CUR) lists discounts as their own line items, named by discount. AWS’s example queries in its CloudWatch cost guide call the EDP one EdpDiscount.",
        },
        {
          kind: "p",
          text: [
            "Unblended cost is the cost of your usage before discounts. ",
            { a: "Net unblended cost", href: "/learn/glossary/blended-vs-unblended-cost" },
            " is the actual after-discount cost you pay. Its CUR column appears only in months with a discount.",
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: [
            "In AWS Cost Explorer, choose net unblended or ",
            { a: "net amortized costs", href: "/learn/glossary/amortized-cost" },
            " under Advanced options to see costs after discounts.",
          ],
        },
      ],
    },
    {
      id: "aws-ppa-vs-edp",
      title: "AWS PPA vs EDP",
      blocks: [
        {
          kind: "p",
          text: "PPA is short for AWS Private Pricing Agreement. AWS names the two side by side as commitments. For example, AWS Security Hub’s Extended plan purchases are eligible toward a PPA or EDP commitment.",
        },
      ],
    },
    {
      id: "aws-edp-and-aws-marketplace-purchases",
      title: "AWS EDP and AWS Marketplace purchases",
      blocks: [
        {
          kind: "p",
          text: "AWS Marketplace is AWS’s catalog of third-party software, data and services. Its charges come with your other AWS charges.",
        },
        {
          kind: "p",
          text: "A Marketplace purchase can draw down your EDP or PPA commitment if the product is eligible. AWS’s Marketplace FAQ says products deployed on AWS typically qualify. Eligibility is set for each product separately.",
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why AWS EDP matters for your cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            "AWS Pricing Calculator’s before discount rates are AWS’s public On-Demand prices, with no discounts or commitments. So they don’t show your EDP discount.",
            "The EDP discount applies to the usage you run. It reduces the rate you pay, not how much you run.",
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Azure MACC",
      line: "A commitment to a set amount of Azure.",
      href: "/learn/glossary/azure-macc",
    },
    {
      title: "Savings plan",
      line: "A commitment to a set hourly compute amount.",
      href: "/learn/glossary/savings-plan",
    },
    {
      title: "Blended vs unblended cost",
      line: "Two ways AWS shows the same usage cost.",
      href: "/learn/glossary/blended-vs-unblended-cost",
    },
    {
      title: "Amortized cost",
      line: "Its net form includes discounts.",
      href: "/learn/glossary/amortized-cost",
    },
  ],
  relatedTitle: "Terms related to AWS EDP",
  next: {
    title: "AWS cost optimization: how to reduce AWS costs",
    href: "/aws-cost-optimization",
  },
  sources: [
    {
      publisher: "AWS",
      title: "“Line item details”",
      url: "https://docs.aws.amazon.com/cur/latest/userguide/Lineitem-columns.html",
      note: " (AWS Data Exports User Guide)",
    },
    {
      publisher: "AWS",
      title: "“Analyzing, optimizing, and reducing CloudWatch costs”",
      url: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_billing.html",
      note: " (Amazon CloudWatch User Guide)",
    },
    {
      publisher: "AWS",
      title: "“Choosing advanced options”",
      url: "https://docs.aws.amazon.com/cost-management/latest/userguide/ce-advanced.html",
      note: " (AWS Cost Management User Guide)",
    },
    {
      publisher: "AWS",
      title: "“AWS Security Hub pricing”",
      url: "https://aws.amazon.com/security-hub/pricing/",
    },
    {
      publisher: "AWS",
      title: "“What is AWS Marketplace?”",
      url: "https://docs.aws.amazon.com/marketplace/latest/buyerguide/what-is-marketplace.html",
      note: " (AWS Marketplace Buyer Guide)",
    },
    {
      publisher: "AWS",
      title: "“Frequently Asked Questions”",
      url: "https://docs.aws.amazon.com/marketplace/latest/buyerguide/multi-product-solutions-buyer-faq.html",
      note: " (AWS Marketplace Buyer Guide, Multi-Product Solutions)",
    },
    {
      publisher: "AWS",
      title: "“Understanding rates, discounts, and purchase commitments”",
      url: "https://docs.aws.amazon.com/cost-management/latest/userguide/pc-rates-discounts.html",
      note: " (AWS Cost Management User Guide)",
    },
  ],
};
