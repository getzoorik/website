import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/cloud-cost-governance/1";

export const term: GlossaryTerm = {
  slug: "cloud-cost-governance",
  term: "Cloud cost governance",
  title: "What is cloud cost governance?",
  meta: "Cloud cost governance is the set of budgets, tag rules and limits on what teams deploy that keeps cloud spend in bounds. See real rules for Azure and AWS.",
  h1: "What is cloud cost governance?",
  card: "Cloud cost governance is the set of rules that keeps your cloud spend inside agreed limits.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-26",
  updated: "2026-11-01",
  definition: [
    {
      kind: "p",
      text: "Cloud cost governance is the set of rules that keeps your cloud spend inside agreed limits. It covers budgets, tag rules, approvals and limits on what teams can deploy. You define the rules, apply them, then monitor them.",
    },
    { kind: "svg", figure: figure1 },
  ],
  sections: [
    {
      id: "what-is-finops-governance",
      title: "What is FinOps governance?",
      blocks: [
        {
          kind: "p",
          text: [
            "In the ",
            { a: "FinOps", href: "/learn/glossary/finops" },
            " Framework, FinOps governance is called policy and governance. Microsoft’s starter rules for a FinOps governance model include:",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              "Enforce your ",
              { a: "tagging strategy", href: "/learn/glossary/cloud-tagging-strategy" },
              " for cost allocation and ",
              { a: "chargeback", href: "/learn/glossary/cloud-chargeback" },
              ".",
            ],
            [
              "Alert on budgets and on unusual spend (",
              { a: "anomalies", href: "/learn/glossary/cloud-cost-anomaly-detection" },
              ").",
            ],
            "Block or audit new resources in costlier sizes, such as E-series virtual machines (VMs).",
          ],
        },
      ],
    },
    {
      id: "an-example-limit-vm-sizes",
      title: "An example: limit VM sizes",
      blocks: [
        {
          kind: "p",
          text: "Azure Policy has a built-in deny rule named Allowed virtual machine size SKUs. It blocks creating or resizing a VM to a size that isn’t on your list.",
        },
        {
          kind: "p",
          text: "To test it, assign it with enforcement off (DoNotEnforce). It then reports rule breaks but blocks nothing.",
        },
        {
          kind: "p",
          text: "On AWS, AWS Budgets alerts you when spend goes outside your policy. A budget action can also apply an access policy or stop chosen Amazon EC2 or Amazon RDS instances. It runs on its own or after your approval.",
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
            "A deny rule blocks a resource before it exists, so it never adds cost.",
            "A forecast alert warns where spend is heading, not only what you’ve spent.",
            [
              "Rules and alerts set limits. To ",
              { a: "reduce cloud costs", href: "/cloud-cost-optimization" },
              " now, you change what runs.",
            ],
            [
              "Our library lists FinOps tools and other ",
              { a: "cloud cost management tools", href: "/cloud-cost-optimization-library" },
              ", with what each one does.",
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
    { title: "FinOps", line: "The practice these rules guide.", href: "/learn/glossary/finops" },
    { title: "Showback", line: "Shows each team its costs.", href: "/learn/glossary/showback" },
    {
      title: "Cloud chargeback",
      line: "Charges each team its costs.",
      href: "/learn/glossary/cloud-chargeback",
    },
    {
      title: "Cloud tagging strategy",
      line: "The tag rules governance enforces.",
      href: "/learn/glossary/cloud-tagging-strategy",
    },
  ],
  next: {
    title: "Cloud cost optimization: how to reduce cloud costs",
    href: "/cloud-cost-optimization",
  },
  sources: [
    {
      publisher: "Microsoft Learn",
      title: "“Policy and governance”",
      url: "https://learn.microsoft.com/en-us/cloud-computing/finops/framework/manage/governance",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Built-in policy definitions for Azure Virtual Machines”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/policy-reference",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Details of the policy assignment structure”",
      url: "https://learn.microsoft.com/en-us/azure/governance/policy/concepts/assignment-structure",
    },
    {
      publisher: "AWS",
      title: "“COST02-BP05 Implement cost controls”",
      url: "https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/cost_govern_usage_controls.html",
      note: " (Cost Optimization Pillar)",
    },
  ],
};
