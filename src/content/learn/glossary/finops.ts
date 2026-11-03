import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/finops/1";

export const term: GlossaryTerm = {
  slug: "finops",
  term: "FinOps",
  title: "What is FinOps?",
  meta: "FinOps is how finance, engineering and business teams share ownership of cloud cost. What FinOps means, its three phases, and FinOps on AWS and Azure.",
  h1: "What is FinOps?",
  card: "FinOps, or cloud FinOps, is a practice where finance, engineering and business teams share ownership of cloud cost.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-25",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: "FinOps, or cloud FinOps, is a practice where finance, engineering and business teams share ownership of cloud cost. The name means finance plus DevOps. It’s also called cloud financial management.",
    },
    {
      kind: "p",
      text: "Its goal isn’t to save money. Microsoft says it’s to get the most business value from the cloud.",
    },
  ],
  sections: [
    {
      id: "finops-vs-devops",
      title: "FinOps vs DevOps",
      blocks: [
        {
          kind: "p",
          text: "DevOps joins development and operations, so developers also answer for how their changes run. FinOps adds finance: engineers weigh cloud cost as well as uptime and performance.",
        },
      ],
    },
    {
      id: "the-finops-framework-inform-optimize-operate",
      title: "The FinOps Framework",
      blocks: [
        {
          kind: "p",
          text: "The FinOps Foundation, a non-profit at the Linux Foundation, publishes the FinOps Framework. It splits the work into three phases that repeat:",
        },
        {
          kind: "ul",
          items: [
            "Inform shows each team its cloud cost.",
            "Optimize makes cloud use more efficient.",
            "Operate tracks goals and sets rules.",
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "h3",
          id: "an-example-idle-developer-vms",
          title: "Example: idle developer VMs",
        },
        {
          kind: "p",
          text: "Microsoft’s FinOps guidance suggests three steps for developer virtual machines (VMs):",
        },
        {
          kind: "ul",
          items: [
            "Tag each resource with its environment, such as development.",
            "Stop a developer VM off-peak with a script if it wasn’t used in 2\u00a0hours.",
            "Expect storage charges while it’s stopped.",
          ],
        },
      ],
    },
    {
      id: "cloud-finops-in-azure-and-aws",
      title: "FinOps on AWS and Azure",
      blocks: [
        {
          kind: "p",
          text: "Microsoft bases its Azure FinOps guidance largely on the FinOps Framework. For tracking cloud cost, it points to Microsoft Cost Management.",
        },
        {
          kind: "h3",
          id: "aws-cloud-financial-management-four-pillars",
          title: "AWS Cloud Financial Management",
        },
        {
          kind: "p",
          text: "AWS frames this work as Cloud Financial Management (CFM). It lets finance, product, technology and business teams manage, optimize and plan costs. It has four pillars:",
        },
        {
          kind: "ul",
          items: [
            "See: measure where costs come from and hold teams accountable.",
            "Save: optimize costs with pricing and resource recommendations.",
            "Plan: set budgets and forecasts.",
            "Run: set guardrails and governance.",
          ],
        },
        {
          kind: "h3",
          id: "focus-one-format-for-cloud-cost-data",
          title: "FOCUS: one cost data format",
        },
        {
          kind: "p",
          text: "Microsoft Cost Management and AWS Data Exports both offer cost data in the FinOps Open Cost and Usage Specification (FOCUS). So data from both clouds fits one schema.",
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
            [
              "Reports alone don’t ",
              { a: "reduce cloud costs", href: "/cloud-cost-optimization" },
              ". Changing what runs, or the rate you pay, does.",
            ],
            [
              "Our library lists ",
              { a: "FinOps tools", href: "/cloud-cost-optimization-library" },
              " that make or recommend those changes.",
            ],
            [
              { a: "Coral", href: "/coral" },
              " rebalances CPU and memory ",
              { a: "requests", href: "/learn/glossary/kubernetes-resource-requests" },
              " on AKS and EKS to match real use, so the same pods fit on fewer nodes.",
            ],
            [
              { a: "Amoeba", href: "/amoeba" },
              " moves a VM’s data disks onto one btrfs pool sized to your data, then rightsizes it autonomously.",
            ],
            ["The ", { a: "free assessment", href: "/assessment" }, " estimates your own saving."],
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "FinOps personas",
      line: "The roles that take part.",
      href: "/learn/glossary/finops-personas",
    },
    {
      title: "FinOps maturity model",
      line: "How far each capability has come.",
      href: "/learn/glossary/finops-maturity-model",
    },
    { title: "Showback", line: "Shows each team its costs.", href: "/learn/glossary/showback" },
    {
      title: "Cloud unit economics",
      line: "The cloud cost of one sale or user.",
      href: "/learn/glossary/cloud-unit-economics",
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
      title: "“What is FinOps?”",
      url: "https://learn.microsoft.com/en-us/cloud-computing/finops/overview",
    },
    {
      publisher: "Microsoft Learn",
      title: "“FinOps Framework overview”",
      url: "https://learn.microsoft.com/en-us/cloud-computing/finops/framework/finops-framework",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Workload optimization”",
      url: "https://learn.microsoft.com/en-us/cloud-computing/finops/framework/optimize/workloads",
    },
    {
      publisher: "AWS",
      title: "“Practice Cloud Financial Management”",
      url: "https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/practice-cloud-financial-management.html",
    },
    {
      publisher: "Microsoft Learn",
      title: "“What is DevOps?”",
      url: "https://learn.microsoft.com/en-us/devops/what-is-devops",
    },
    {
      publisher: "Microsoft Learn",
      title: "“What is FOCUS?”",
      url: "https://learn.microsoft.com/en-us/cloud-computing/finops/focus/what-is-focus",
    },
    {
      publisher: "AWS",
      title: "“FOCUS 1.0 with AWS columns”",
      url: "https://docs.aws.amazon.com/cur/latest/userguide/table-dictionary-focus-1-0-aws.html",
    },
  ],
};
