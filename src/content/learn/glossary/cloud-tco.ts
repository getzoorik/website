import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/cloud-tco/1";

export const term: GlossaryTerm = {
  slug: "cloud-tco",
  term: "Cloud TCO (total cost of ownership)",
  title: "What is cloud TCO (total cost of ownership)?",
  meta: "Cloud TCO is the full cost of a workload over several years, not only the monthly charges. See what it counts and how to compare the cloud with on premises.",
  h1: "What is cloud TCO (total cost of ownership)?",
  card: "Cloud TCO (total cost of ownership) is the full cost of a workload in the cloud over several years.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-26",
  updated: "2026-10-26",
  definition: [
    {
      kind: "p",
      text: "Cloud TCO (total cost of ownership) is the full cost of a workload in the cloud over several years. It counts more than your monthly cloud charges. You use it to compare the cloud with on premises.",
    },
  ],
  sections: [
    {
      id: "tco-meaning-in-cloud-computing",
      title: "TCO meaning in cloud computing",
      blocks: [
        {
          kind: "p",
          text: "Microsoft calls TCO a financial estimate of an IT project’s impact over its whole life. Its Azure Migrate tool compares Azure and on-premises costs in seven groups:",
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
      ],
    },
    {
      id: "total-cost-of-ownership-cloud-vs-on",
      title: "Total cost of ownership: cloud vs on premises",
      blocks: [
        {
          kind: "p",
          text: "On premises, you buy servers up front. Azure Migrate spreads their cost over a 4-year life. In the cloud, you pay monthly instead.",
        },
        { kind: "p", text: "A fair comparison also counts:" },
        {
          kind: "ul",
          items: [
            "Migration, which AWS lists beside on-premises and new AWS costs.",
            "Paying for both while you move. Azure Migrate’s docs show 20% moved by year 1, 50% by year 2 and all by year 3. You set the pace.",
            "Staff time for operations and management, which AWS says to count.",
            [
              "Leaving later, which can mean ",
              { a: "egress", href: "/learn/glossary/egress-cost" },
              " fees. AWS waives data transfer out to the internet for eligible customers who move all their data off AWS, once AWS Support approves.",
            ],
          ],
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
            "Comparing only prices leaves out power, staff time and the move.",
            [
              "After the move, ",
              { a: "using less", href: "/cloud-cost-optimization" },
              " reduces the cloud part of your TCO.",
            ],
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
    {
      title: "FinOps",
      line: "Teams sharing ownership of cloud spend.",
      href: "/learn/glossary/finops",
    },
  ],
  next: { title: "How to reduce cloud costs", href: "/cloud-cost-optimization" },
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
  ],
};
