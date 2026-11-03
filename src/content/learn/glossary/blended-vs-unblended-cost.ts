import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/blended-vs-unblended-cost/1";

export const term: GlossaryTerm = {
  slug: "blended-vs-unblended-cost",
  term: "Blended vs unblended cost (AWS)",
  title: "Blended vs unblended cost in AWS",
  meta: "Blended vs unblended cost in AWS: unblended shows each account its own rates, blended gives all accounts one average rate. With AWS’s worked example.",
  h1: "Blended vs unblended cost in AWS",
  card: "Blended and unblended cost are two ways AWS shows the same usage cost across the accounts in an organization.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-26",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: "Blended and unblended cost are two ways AWS shows the same usage cost across the accounts in an organization. Unblended cost shows each account the rates its own usage got. Blended cost gives every account one average rate for each usage type.",
    },
  ],
  sections: [
    {
      id: "what-is-unblended-cost",
      title: "Unblended cost",
      blocks: [
        {
          kind: "p",
          text: [
            "Unblended cost is each line item’s usage times its own rate. EC2 and RDS hours that a ",
            { a: "Reserved Instance (RI)", href: "/learn/glossary/reserved-instance" },
            " covers have a rate of $0. It’s the default view in AWS Cost Explorer and AWS Budgets.",
          ],
        },
        {
          kind: "h3",
          id: "blended-net-unblended-and-amortized-cost",
          title: "Blended and other cost views",
        },
        {
          kind: "ul",
          items: [
            "Blended cost: usage times the average rate, which mixes on-demand, RI and Savings Plans usage.",
            "Net unblended cost: the actual cost after discounts. Its column appears only in months when your account has a discount.",
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
      title: "Example",
      blocks: [
        {
          kind: "p",
          text: "In AWS’s example, two accounts run t2.small instances in a 720-hour month. Three RIs cover all 2,160\u00a0hours of account 1. Account 2 runs 720 on-demand hours at $0.023 an hour.",
        },
        {
          kind: "ul",
          items: [
            "Unblended: account 1 shows $0.00 and account 2 shows $16.56.",
            "Blended: $16.56 over 2,880\u00a0hours is $0.00575 an hour. Account 1 shows $12.42 and account 2 shows $4.14.",
          ],
        },
        {
          kind: "p",
          text: "Both views total $16.56. The RIs’ own fees are separate line items, outside both totals.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Which view to use",
      blocks: [
        {
          kind: "ul",
          items: [
            "The views don’t change what you pay, only which account each cost shows on.",
            "Blended cost hides which account got the RI discount. In the example, on-demand account 2 shows only $4.14.",
            "AWS’s Cloud Financial Management blog says unblended cost is all most customers need. For Savings Plans or reservations it points to amortized cost, and it generally steers away from blended cost.",
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
      line: "Also part of the blended average.",
      href: "/learn/glossary/savings-plan",
    },
    {
      title: "Showback",
      line: "Team shares, which change with the view.",
      href: "/learn/glossary/showback",
    },
  ],
  relatedTitle: "Related terms",
  next: { title: "Cloud cost optimization", href: "/cloud-cost-optimization" },
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
