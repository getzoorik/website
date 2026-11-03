import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/showback/1";

export const term: GlossaryTerm = {
  slug: "showback",
  term: "Showback",
  title: "What is showback in FinOps?",
  meta: "Showback reports each team’s share of the cloud cost, with no charge. Three ways to split it, showback on Kubernetes, and how chargeback differs.",
  h1: "What is showback in FinOps?",
  card: "Showback is a report that splits your cloud cost by team, application or cost center.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-25",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: "Showback is a report that splits your cloud cost by team, application or cost center. Each team sees what its use cost, but nothing is charged to its budget.",
    },
  ],
  sections: [
    {
      id: "an-example-from-aws",
      title: "Showback models",
      blocks: [
        {
          kind: "p",
          text: "AWS describes three common ways to split the cost, from least to most effort:",
        },
        {
          kind: "ul",
          items: [
            [{ b: "By account." }, " Each AWS account’s cost goes to the team that owns it."],
            [{ b: "By team." }, " AWS Cost Categories group each team’s accounts."],
            [
              { b: "By tag." },
              " A tag on each resource names its team. A tag counts only from when you activate it for cost allocation.",
            ],
          ],
        },
        {
          kind: "h3",
          id: "kubernetes-showback-needs-cost-allocation",
          title: "Showback on Kubernetes",
        },
        {
          kind: "p",
          text: [
            "A tag can’t split one shared node’s cost between many teams’ pods. That takes ",
            { a: "Kubernetes cost allocation", href: "/learn/glossary/kubernetes-cost-allocation" },
            ", which splits it by each workload’s CPU and memory.",
          ],
        },
        {
          kind: "p",
          text: [
            "On EKS, AWS split cost allocation data does this. On AKS, see ",
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
          text: [
            "Showback only reports each team’s share. ",
            { a: "Chargeback", href: "/learn/glossary/cloud-chargeback" },
            " takes that share out of the team’s budget, through internal accounting.",
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: "Microsoft suggests starting with showback, then cost allocation, then chargeback.",
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
            "Showback makes each team aware of its cost. The report alone doesn’t reduce it.",
            [
              { a: "Coral", href: "/coral" },
              " rebalances CPU and memory requests on AKS and EKS to match real use, so the same pods fit on fewer nodes.",
            ],
            [
              { a: "Amoeba", href: "/amoeba" },
              " moves a virtual machine’s data disks onto one btrfs pool sized to your data, then rightsizes it.",
            ],
            [
              "Our library lists ",
              { a: "FinOps tools", href: "/cloud-cost-optimization-library" },
              " and what each one does.",
            ],
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Cloud chargeback",
      line: "Each team pays its share.",
      href: "/learn/glossary/cloud-chargeback",
    },
    {
      title: "Cost allocation tags",
      line: "Labels that split cost by team or app.",
      href: "/learn/glossary/cost-allocation-tags",
    },
    {
      title: "Kubernetes cost allocation",
      line: "Splits a shared cluster’s cost by workload.",
      href: "/learn/glossary/kubernetes-cost-allocation",
    },
    { title: "FinOps", line: "The wider practice.", href: "/learn/glossary/finops" },
  ],
  relatedTitle: "Related terms",
  next: {
    title: "AKS cost analysis",
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
