import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/blended-vs-unblended-cost/1";

export const term: GlossaryTerm = {
  slug: "blended-vs-unblended-cost",
  term: "Blended vs unblended cost (AWS)",
  title: "AWS blended vs unblended cost: what each means",
  meta: "AWS blended vs unblended cost: two ways AWS shows the same usage cost across accounts. Learn unblended, blended and net unblended cost with AWS’s own example.",
  h1: "AWS blended vs unblended cost: what each means",
  card: "Blended vs unblended cost compares two ways AWS shows the same usage cost across an organization’s accounts.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-26",
  updated: "2026-11-01",
  definition: [
    {
      kind: "p",
      text: "Blended vs unblended cost compares two ways AWS shows the same usage cost across an organization’s accounts. Unblended cost shows each account its own charges. Blended cost gives every account one average rate per usage type.",
    },
  ],
  sections: [
    {
      id: "what-is-unblended-cost",
      title: "What is unblended cost?",
      blocks: [
        {
          kind: "p",
          text: [
            "Unblended cost keeps each line item’s own rate. EC2 and RDS hours that a ",
            { a: "Reserved Instance (RI)", href: "/learn/glossary/reserved-instance" },
            " covers show $0. It’s the default in AWS Cost Explorer and AWS Budgets.",
          ],
        },
        {
          kind: "h3",
          id: "blended-net-unblended-and-amortized-cost",
          title: "Blended, net unblended and amortized cost",
        },
        {
          kind: "ul",
          items: [
            "Blended cost: its average rate mixes on-demand, RI and Savings Plans usage.",
            "Net unblended cost: the actual cost after discounts. Its column appears only in months with a discount.",
            [
              { a: "Amortized cost", href: "/learn/glossary/amortized-cost" },
              ": Savings Plans and reservation fees spread evenly across the month.",
            ],
          ],
        },
      ],
    },
    {
      id: "an-example-from-aws",
      title: "An example from AWS",
      blocks: [
        {
          kind: "p",
          text: "The AWS Billing User Guide has two accounts on t2.small in a 720-hour month. Three RIs cover all 2,160\u00a0hours of account 1. Account 2 runs 720 on-demand hours at $0.023 an hour.",
        },
        {
          kind: "ul",
          items: [
            "Unblended: account 1 shows $0.00, account 2 $16.56.",
            "Blended: $16.56 over 2,880\u00a0hours gives $0.00575 an hour. Account 1 shows $12.42, account 2 $4.14.",
          ],
        },
        {
          kind: "p",
          text: "Both views total $16.56. The RI fees are separate line items, outside both.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for your cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            "Blended vs unblended cost in AWS doesn’t change what you pay, only which account each cost shows on.",
            "Blended cost hides which account got the RI discount. On-demand account 2 shows only $4.14.",
            "AWS’s Cloud Financial Management blog says most customers need only unblended cost.",
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
      title: "Amortized cost",
      line: "Commitment fees spread over the month.",
      href: "/learn/glossary/amortized-cost",
    },
    {
      title: "Reserved instance",
      line: "The discount blended cost spreads.",
      href: "/learn/glossary/reserved-instance",
    },
    {
      title: "Savings plan",
      line: "In the blended average too.",
      href: "/learn/glossary/savings-plan",
    },
    {
      title: "Showback",
      line: "Team shares, which change with the view.",
      href: "/learn/glossary/showback",
    },
  ],
  next: {
    title: "Cloud cost optimization: how to reduce cloud costs",
    href: "/cloud-cost-optimization",
  },
  sources: [
    {
      publisher: "AWS",
      title: "“Understanding your AWS Cost Datasets: A Cheat Sheet”",
      url: "https://aws.amazon.com/blogs/aws-cloud-financial-management/understanding-your-aws-cost-datasets-a-cheat-sheet/",
      note: " (AWS Cloud Financial Management blog)",
    },
    {
      publisher: "AWS",
      title: "“Line item details”",
      url: "https://docs.aws.amazon.com/cur/latest/userguide/Lineitem-columns.html",
      note: " (AWS Cost and Usage Reports User Guide)",
    },
    {
      publisher: "AWS",
      title: "“Understanding Consolidated Bills”",
      url: "https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/con-bill-blended-rates.html",
      note: " (AWS Billing User Guide)",
    },
  ],
};
