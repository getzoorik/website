import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/showback/1";

export const term: GlossaryTerm = {
  slug: "showback",
  term: "Showback",
  title: "What is showback in FinOps?",
  meta: "Showback reports each team’s share of the cloud cost without charging it. See three common ways to split the cost between teams, and how chargeback differs.",
  h1: "What is showback in FinOps?",
  card: "Showback is a report that splits your cloud cost by team, application or cost center.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-25",
  updated: "2026-10-26",
  definition: [
    {
      kind: "p",
      text: "Showback is a report that splits your cloud cost by team, application or cost center. The showback meaning is in the name: each team’s cost is shown back to it, with no charge.",
    },
  ],
  sections: [
    {
      id: "an-example-from-aws",
      title: "An example from AWS",
      blocks: [
        {
          kind: "p",
          text: "In AWS’s example, the infrastructure engineering team learns its share of last month’s spend. A showback model is how you split the cost, and AWS describes three common ones, from least to most effort:",
        },
        {
          kind: "ul",
          items: [
            "By account: one line per AWS account.",
            "By team or business unit: each team’s accounts are grouped together.",
            "By tag: a label on each resource names its team, and a tag counts only after you activate it for cost allocation.",
          ],
        },
        {
          kind: "p",
          text: [
            "One node in a shared Kubernetes cluster runs many teams’ pods, so a tag on it can’t split the cost. That takes ",
            { a: "Kubernetes cost allocation", href: "/learn/glossary/kubernetes-cost-allocation" },
            ". On Azure Kubernetes Service (AKS), see ",
            { a: "AKS cost analysis", href: "/learn/aks-cost-analysis" },
            ".",
          ],
        },
      ],
    },
    {
      id: "showback-vs-chargeback",
      title: "Showback vs chargeback",
      blocks: [
        {
          kind: "p",
          text: "Showback only reports each team’s share. Chargeback takes that share out of the team’s budget, through internal accounting.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: "Microsoft suggests most organizations start with showback and add chargeback last, after cost allocation.",
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
            "A report alone doesn’t reduce your node and disk cost.",
            [
              { a: "Coral", href: "/coral" },
              " rebalances CPU and memory requests on AKS and Amazon Elastic Kubernetes Service (EKS) to match real use. With requests that match use, the same pods fit on fewer nodes.",
            ],
            [
              { a: "Amoeba", href: "/amoeba" },
              " moves a virtual machine’s data disks onto one pool sized to your data, then rightsizes it autonomously.",
            ],
            ["The ", { a: "free assessment", href: "/assessment" }, " works out your own figure."],
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Cloud chargeback",
      line: "Where each team pays.",
      href: "/learn/glossary/cloud-chargeback",
    },
    {
      title: "Cloud unit economics",
      line: "The cost of one customer or order.",
      href: "/learn/glossary/cloud-unit-economics",
    },
    { title: "FinOps", line: "The wider practice.", href: "/learn/glossary/finops" },
    {
      title: "Kubernetes cost allocation",
      line: "Splits a shared cluster’s cost by workload.",
      href: "/learn/glossary/kubernetes-cost-allocation",
    },
  ],
  next: {
    title: "AKS cost analysis: what the add-on shows and what it doesn’t",
    href: "/learn/aks-cost-analysis",
  },
  sources: [
    {
      publisher: "AWS",
      title: "“Cost allocation tags”",
      url: "https://docs.aws.amazon.com/whitepapers/latest/tagging-best-practices/cost-allocation-tags.html",
    },
    {
      publisher: "AWS",
      title: "“Building a cost allocation strategy”",
      url: "https://docs.aws.amazon.com/whitepapers/latest/tagging-best-practices/building-a-cost-allocation-strategy.html",
    },
    {
      publisher: "AWS",
      title: "“COST06-BP04 Consider using shared resources”",
      url: "https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/cost_type_size_number_resources_shared.html",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Invoicing and chargeback”",
      url: "https://learn.microsoft.com/en-us/cloud-computing/finops/framework/manage/invoicing-chargeback",
    },
  ],
};
