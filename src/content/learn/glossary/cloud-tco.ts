import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/cloud-tco/1";

export const term: GlossaryTerm = {
  slug: "cloud-tco",
  term: "Cloud TCO (total cost of ownership)",
  title: "What is TCO (total cost of ownership)?",
  meta: "TCO means total cost of ownership: the full cost of an IT system over its life. What cloud TCO counts, and how cloud and on-premises TCO compare.",
  h1: "What is TCO (total cost of ownership)?",
  card: "TCO, short for total cost of ownership, is the full cost of an IT system over its whole life, not just its price.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-26",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: "TCO, short for total cost of ownership, is the full cost of an IT system over its whole life, not just its price. Cloud TCO is that cost for a workload in the cloud over several years, set against running it on premises.",
    },
  ],
  sections: [
    {
      id: "tco-meaning-in-cloud-computing",
      title: "What TCO counts",
      blocks: [
        {
          kind: "p",
          text: "Microsoft defines TCO as a financial estimate of the economic impact of an IT project over its whole life cycle. Its Azure Migrate tool works out a yearly cost in seven groups, on premises and in Azure:",
        },
        {
          kind: "ul",
          items: [
            "Compute: servers or VMs, and their licenses",
            "Storage",
            "Network",
            "Security",
            "Facilities: datacenter lease and power, on premises only",
            "Labor: IT admin time",
            "Management: monitoring, patching and backup",
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: "On premises, Azure Migrate spreads the cost of server and storage hardware over a 4-year life.",
        },
      ],
    },
    {
      id: "total-cost-of-ownership-cloud-vs-on",
      title: "Cloud vs on-premises TCO",
      blocks: [
        {
          kind: "p",
          text: "On premises, you buy servers up front. In the cloud, you pay as you use.",
        },
        { kind: "h3", id: "the-economics-of-the-cloud", title: "Cloud economics" },
        {
          kind: "p",
          text: "AWS lists six advantages of cloud computing. Three of them shape TCO:",
        },
        {
          kind: "ul",
          items: [
            "Trade fixed expense for variable expense: pay only for what you consume.",
            "Economies of scale: usage pooled across many customers reduces pay-as-you-go prices.",
            "Stop guessing capacity: scale up and down as needed.",
          ],
        },
        { kind: "h3", id: "cloud-cost-models", title: "Pricing models" },
        { kind: "p", text: "On AWS, EC2 offers several ways to pay, including:" },
        {
          kind: "ul",
          items: [
            [
              { a: "On-Demand Instances", href: "/learn/glossary/on-demand-instance" },
              ": paid by the second for the instances you launch.",
            ],
            [
              { a: "Savings Plans", href: "/learn/glossary/savings-plan" },
              ": a set amount of usage, in USD per hour, for 1 or 3 years.",
            ],
            [
              { a: "Reserved Instances", href: "/learn/glossary/reserved-instance" },
              ": one instance configuration, such as type and Region, for 1 or 3 years.",
            ],
            [
              { a: "Spot Instances", href: "/learn/glossary/spot-instance" },
              ": unused EC2 capacity that can be interrupted.",
            ],
          ],
        },
        {
          kind: "h3",
          id: "cloud-migration-cost-and-other-costs",
          title: "Other costs to count",
        },
        {
          kind: "ul",
          items: [
            "The migration itself, which AWS counts beside on-premises and new AWS costs.",
            "Paying for both while you move. Azure Migrate assumes 20% moved by year 1, 50% by year 2 and all by year 3, unless you set your own pace.",
            "Staff time for operations and management, which AWS says to factor into TCO.",
            [
              "Leaving later, which can mean ",
              { a: "egress", href: "/learn/glossary/egress-cost" },
              " fees. AWS offers free data transfer out to the internet to eligible customers moving all their data off AWS, on request to AWS Support.",
            ],
          ],
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for cost",
      blocks: [
        {
          kind: "p",
          text: [
            "Comparing only prices leaves out power, staff time and the move. Once you run in the cloud, ",
            { a: "cloud cost optimization", href: "/cloud-cost-optimization" },
            " reduces the cloud part of your TCO.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " rebalances AKS and EKS clusters onto fewer nodes, and ",
            { a: "Amoeba", href: "/amoeba" },
            " rightsizes block storage on Azure and AWS.",
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Cloud unit economics",
      line: "The cloud cost of one sale or one user.",
      href: "/learn/glossary/cloud-unit-economics",
    },
    {
      title: "Egress cost",
      line: "The fee for data leaving a cloud Region.",
      href: "/learn/glossary/egress-cost",
    },
    {
      title: "Azure Hybrid Benefit",
      line: "A license saving Azure Migrate counts.",
      href: "/learn/glossary/azure-hybrid-benefit",
    },
    { title: "FinOps", line: "Shared ownership of cloud cost.", href: "/learn/glossary/finops" },
  ],
  relatedTitle: "Related terms",
  next: {
    title: "Cloud cost optimization",
    href: "/cloud-cost-optimization",
  },
  sources: [
    {
      publisher: "Microsoft Learn",
      title: "“Business case in Azure Migrate”",
      url: "https://learn.microsoft.com/en-us/azure/migrate/concepts-business-case-calculation",
    },
    {
      publisher: "AWS",
      title: "“Detailed business case”",
      url: "https://docs.aws.amazon.com/prescriptive-guidance/latest/strategy-migration/detailed-business-case.html",
      note: " (AWS Prescriptive Guidance)",
    },
    {
      publisher: "AWS",
      title: "“COST05-BP03 Perform a thorough analysis of each component”",
      url: "https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/cost_select_service_thorough_analysis.html",
      note: " (Cost Optimization Pillar)",
    },
    {
      publisher: "AWS",
      title: "“Free data transfer out to internet when moving out of AWS”",
      url: "https://aws.amazon.com/blogs/aws/free-data-transfer-out-to-internet-when-moving-out-of-aws/",
      note: " (AWS News Blog)",
    },
    {
      publisher: "AWS",
      title: "“Six advantages of cloud computing”",
      url: "https://docs.aws.amazon.com/whitepapers/latest/aws-overview/six-advantages-of-cloud-computing.html",
    },
    {
      publisher: "AWS",
      title: "“Amazon EC2 billing and purchasing options”",
      url: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-purchasing-options.html",
    },
  ],
};
