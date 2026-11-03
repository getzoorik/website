import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/aws-edp/1";

export const term: GlossaryTerm = {
  slug: "aws-edp",
  term: "AWS EDP (Enterprise Discount Program)",
  title: "What is AWS EDP?",
  meta: "AWS EDP, the Enterprise Discount Program, is a discount for a commitment to spend on AWS. Where it shows in your cost data, and what counts toward it.",
  h1: "What is AWS EDP?",
  card: "AWS EDP, the AWS Enterprise Discount Program, is a discount for a commitment to spend on AWS.",
  group: "finops-pricing",
  product: "both",
  published: "2026-11-02",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: "AWS EDP, the AWS Enterprise Discount Program, is a discount for a commitment to spend on AWS. Eligible purchases count toward the commitment, and the discount shows as its own line items in your cost data.",
    },
  ],
  sections: [
    {
      id: "how-the-aws-edp-discount-shows-in-your-cost-data",
      title: "In your cost data",
      blocks: [
        {
          kind: "p",
          text: [
            "The AWS Cost and Usage Report (CUR) lists each discount as its own line item. In AWS’s example queries, the EDP one is ",
            { code: "EdpDiscount" },
            ".",
          ],
        },
        {
          kind: "ul",
          items: [
            [{ b: "Unblended cost" }, " is the cost of your usage before discounts."],
            [
              {
                b: [{ a: "Net unblended cost", href: "/learn/glossary/blended-vs-unblended-cost" }],
              },
              " is the after-discount cost you pay. Its CUR column appears only in months with a discount.",
            ],
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: [
            "In AWS Cost Explorer, group unblended costs by Charge type to see each discount on its own line. To see costs after discounts, choose net unblended or ",
            { a: "net amortized costs", href: "/learn/glossary/amortized-cost" },
            " under Advanced options.",
          ],
        },
      ],
    },
    {
      id: "aws-ppa-vs-edp",
      title: "EDP and PPA",
      blocks: [
        {
          kind: "p",
          text: "PPA is the AWS Private Pricing Agreement. AWS names the two together as committed spend (EDP/PPA). For example, AWS Security Hub’s Extended plan purchases can count toward either one.",
        },
      ],
    },
    {
      id: "aws-edp-and-aws-marketplace-purchases",
      title: "AWS Marketplace purchases",
      blocks: [
        {
          kind: "p",
          text: "AWS Marketplace is AWS’s catalog of third-party software, data and services. Its charges come with your other AWS charges.",
        },
        {
          kind: "p",
          text: "A Marketplace purchase can draw down an EDP or PPA commitment if the product is eligible. Eligibility is determined for each product separately. For multi-product solutions, AWS says products deployed on AWS typically qualify.",
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
            "The discount reduces the rate you pay, not how much you run.",
            "AWS Pricing Calculator’s before discount rates are public On-Demand prices, so they leave out your EDP discount. Its after discount rates include your organization’s pricing discounts.",
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Azure MACC",
      line: "Azure’s commitment to spend a set amount.",
      href: "/learn/glossary/azure-macc",
    },
    {
      title: "Savings plan",
      line: "A commitment to a fixed hourly compute spend.",
      href: "/learn/glossary/savings-plan",
    },
    {
      title: "Blended vs unblended cost",
      line: "Two ways AWS shows the same usage cost.",
      href: "/learn/glossary/blended-vs-unblended-cost",
    },
    {
      title: "Amortized cost",
      line: "Commitment fees spread over the days they cover.",
      href: "/learn/glossary/amortized-cost",
    },
  ],
  relatedTitle: "Related terms",
  next: {
    title: "AWS cost optimization",
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
