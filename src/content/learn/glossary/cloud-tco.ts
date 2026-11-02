import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/cloud-tco/1";

export const term: GlossaryTerm = {
  slug: "cloud-tco",
  term: "Cloud TCO (total cost of ownership)",
  title: "What is cloud total cost of ownership (TCO)?",
  meta: "Cloud TCO, or TCO in cloud computing, is a workload’s full cost over several years. See what total cost of ownership counts, and cloud vs on-premises TCO.",
  h1: "What is cloud total cost of ownership (TCO)?",
  card: "Cloud total cost of ownership (TCO) is the full cost of a workload in the cloud over several years.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-26",
  updated: "2026-11-02",
  definition: [
    {
      kind: "p",
      text: "Cloud total cost of ownership (TCO) is the full cost of a workload in the cloud over several years. It counts more than your monthly cloud charges. You use it to compare the cloud with on premises.",
    },
  ],
  sections: [
    {
      id: "tco-meaning-in-cloud-computing",
      title: "TCO meaning in cloud computing",
      blocks: [
        {
          kind: "p",
          text: "Microsoft defines TCO as a financial estimate of the economic impact of an IT project over its whole life cycle.",
        },
        {
          kind: "p",
          text: "For cloud computing TCO, Microsoft’s Azure Migrate tool totals a yearly cost in seven groups, on premises and in Azure:",
        },
        {
          kind: "ul",
          items: [
            "compute (servers or VMs, and their licenses)",
            "storage",
            "network",
            "security",
            "facilities (datacenter lease and power, on premises only)",
            "labor (IT admin time)",
            "management (monitoring, patching and backup)",
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "h3",
          id: "how-azure-migrate-works-out-azure-tco",
          title: "How Azure Migrate works out Azure TCO",
        },
        {
          kind: "p",
          text: "Azure Migrate spreads the cost of on-premises server and storage hardware over a 4-year life.",
        },
      ],
    },
    {
      id: "total-cost-of-ownership-cloud-vs-on",
      title: "Total cost of ownership: cloud vs on premises",
      blocks: [
        {
          kind: "p",
          text: "On premises, you buy servers up front. In the cloud, you pay monthly instead.",
        },
        { kind: "h3", id: "the-economics-of-the-cloud", title: "The economics of the cloud" },
        {
          kind: "p",
          text: "In cloud computing economics, AWS lists six advantages. The first is trading fixed expense for variable expense: you pay only for what you consume.",
        },
        {
          kind: "p",
          text: "Two more shape cloud economics: economies of scale from usage pooled across many customers, and no need to guess capacity. You scale up and down as needed.",
        },
        {
          kind: "h3",
          id: "cloud-cost-models",
          title: "Cloud cost models: on-demand, reserved, savings plans and spot",
        },
        {
          kind: "ul",
          items: [
            "EC2 On-Demand Instances, paid by the second for the instances you launch.",
            "Savings Plans, a set amount of usage in USD per hour, committed for 1 or 3 years.",
            "Reserved Instances, one instance configuration, committed for 1 or 3 years.",
            "Spot Instances, unused EC2 capacity that can be interrupted.",
          ],
        },
        {
          kind: "h3",
          id: "cloud-migration-cost-and-other-costs",
          title: "Cloud migration cost and other costs to count",
        },
        { kind: "p", text: "A fair comparison also counts:" },
        {
          kind: "ul",
          items: [
            "Migration, which AWS lists beside on-premises and new AWS costs.",
            "Paying for both while you move. Azure Migrate’s docs show 20% moved by year 1, 50% by year 2 and all by year 3. You set the pace.",
            "Staff time for operations and management, which AWS says to factor into TCO.",
            [
              "Leaving later, which can mean ",
              { a: "egress", href: "/learn/glossary/egress-cost" },
              " fees. AWS waives data transfer out to the internet for eligible customers moving all their data off AWS, once AWS Support approves.",
            ],
          ],
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why TCO matters for your cloud cost",
      blocks: [
        {
          kind: "p",
          text: [
            "Comparing only prices leaves out power, staff time and the move. After the move, ",
            { a: "cloud cost optimization", href: "/cloud-cost-optimization" },
            " reduces the cloud part of your TCO.",
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Cloud unit economics",
      line: "The cost of one sale or one user.",
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
  relatedTitle: "Cloud cost terms related to TCO",
  next: {
    title: "Cloud cost optimization: how to reduce cloud costs",
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
