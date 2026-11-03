import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/cloud-cost-governance/1";

export const term: GlossaryTerm = {
  slug: "cloud-cost-governance",
  term: "Cloud cost governance",
  title: "What is cloud cost governance?",
  meta: "Cloud cost governance is the cost part of cloud governance: budgets, alerts, tag rules and limits on what teams deploy. Azure and AWS examples.",
  h1: "What is cloud cost governance?",
  card: "Cloud cost governance is the part of cloud governance that keeps your cloud cost inside agreed limits.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-26",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: "Cloud cost governance is the part of cloud governance that keeps your cloud cost inside agreed limits. It covers budgets, budget alerts, tag rules and limits on what teams can deploy.",
    },
    {
      kind: "p",
      text: "It runs as a loop: define the rules, apply them, then monitor them.",
    },
    { kind: "svg", figure: figure1 },
  ],
  sections: [
    {
      id: "cloud-governance-in-cloud-computing",
      title: "Cloud governance",
      blocks: [
        {
          kind: "p",
          text: "Cloud governance in cloud computing is how an organization controls its use of cloud services, with policies, procedures and tools. Microsoft’s Cloud Adoption Framework says it covers domains such as security, regulatory compliance, operations, cost management, data management, resource provisioning and AI. Cloud cost governance is the cost management domain.",
        },
      ],
    },
    {
      id: "what-is-finops-governance",
      title: "FinOps governance",
      blocks: [
        {
          kind: "p",
          text: [
            "The ",
            { a: "FinOps", href: "/learn/glossary/finops" },
            " Framework calls this capability policy and governance. Microsoft’s starter rules include:",
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
              "Alert on budgets and on unusual cost (",
              { a: "anomalies", href: "/learn/glossary/cloud-cost-anomaly-detection" },
              ").",
            ],
            "Block or audit new resources in costlier sizes, such as E-series virtual machines (VMs).",
          ],
        },
        {
          kind: "p",
          text: "Microsoft advises starting with audit rules and widening coverage slowly.",
        },
      ],
    },
    {
      id: "an-example-limit-vm-sizes",
      title: "Azure and AWS examples",
      blocks: [
        { kind: "h3", id: "limit-vm-sizes-with-azure-policy", title: "Limit VM sizes on Azure" },
        {
          kind: "p",
          text: [
            "Azure Policy’s built-in rule “Allowed virtual machine size SKUs” denies creating or resizing a VM to a size that isn’t on your list. To test it, assign it with enforcement mode ",
            { code: "DoNotEnforce" },
            ". It then reports rule breaks but blocks nothing.",
          ],
        },
        {
          kind: "h3",
          id: "aws-budget-alerts-and-budget-actions",
          title: "Budget alerts on AWS",
        },
        {
          kind: "p",
          text: "For AWS budgeting, AWS Budgets alerts you by email or an Amazon SNS topic when actual or forecasted cost passes your threshold. Its data updates up to three times a day.",
        },
        {
          kind: "p",
          text: "A budget action can also apply an IAM policy or a service control policy, or stop chosen Amazon EC2 or Amazon RDS instances. It runs on its own or after your approval.",
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
            "A deny rule blocks a resource before it exists, so it never adds cost.",
            "Alerts can lag: cost can pass a threshold before AWS Budgets tells you.",
            [
              "Rules and alerts set limits, but they don’t reduce what already runs. To ",
              { a: "reduce cloud costs", href: "/cloud-cost-optimization" },
              ", change what runs.",
            ],
            [
              "Our library of ",
              { a: "cloud cost management tools", href: "/cloud-cost-optimization-library" },
              " says what each tool does.",
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
  relatedTitle: "Related terms",
  next: {
    title: "Cloud cost optimization",
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
      publisher: "Microsoft Learn",
      title: "“Build a cloud governance team”",
      url: "https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/govern/build-cloud-governance-team",
      note: " (Cloud Adoption Framework)",
    },
    {
      publisher: "AWS",
      title: "“COST02-BP05 Implement cost controls”",
      url: "https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/cost_govern_usage_controls.html",
      note: " (Cost Optimization Pillar)",
    },
    {
      publisher: "AWS",
      title: "“Managing your costs with AWS Budgets”",
      url: "https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html",
    },
  ],
};
