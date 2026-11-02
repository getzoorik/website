import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/finops/1";

export const term: GlossaryTerm = {
  slug: "finops",
  term: "FinOps",
  title: "What is FinOps? Cloud FinOps explained",
  meta: "The FinOps meaning is in the name: finance plus DevOps, with teams sharing ownership of cloud cost. See the three FinOps phases, and FinOps on AWS and Azure.",
  h1: "What is FinOps? Cloud FinOps explained",
  card: "FinOps, or cloud FinOps, is a practice where finance, engineering and business teams share ownership of cloud cost.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-25",
  updated: "2026-11-02",
  definition: [
    {
      kind: "p",
      text: "FinOps, or cloud FinOps, is a practice where finance, engineering and business teams share ownership of cloud cost. The FinOps meaning is in its name: finance plus DevOps.",
    },
    {
      kind: "p",
      text: "Microsoft says FinOps means more business value from the cloud. Its goal isn’t to save money.",
    },
  ],
  sections: [
    {
      id: "finops-vs-devops",
      title: "FinOps vs DevOps",
      blocks: [
        {
          kind: "p",
          text: "DevOps combines development and operations, so developers also answer for how their changes run. FinOps adds finance, so engineers weigh cloud cost as well as uptime and performance.",
        },
      ],
    },
    {
      id: "the-finops-framework-inform-optimize-operate",
      title: "The FinOps Framework: inform, optimize, operate",
      blocks: [
        {
          kind: "p",
          text: "The FinOps Foundation’s FinOps Framework splits the work into three phases that repeat:",
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
          title: "An example: idle developer VMs",
        },
        {
          kind: "p",
          text: "Microsoft’s FinOps guidance suggests three steps for developer virtual machines (VMs):",
        },
        {
          kind: "ul",
          items: [
            "Tag each resource with its environment, such as development.",
            "Stop each developer VM off-peak with a script if it wasn’t used in 2\u00a0hours.",
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
          title: "AWS Cloud Financial Management: four pillars",
        },
        {
          kind: "p",
          text: "FinOps is sometimes called cloud financial management. For FinOps in AWS, AWS Cloud Financial Management (CFM) lets finance, product, technology and business teams manage, optimize and plan costs. It has four pillars:",
        },
        {
          kind: "ul",
          items: [
            "See measures where costs come from and holds teams accountable.",
            "Save optimizes costs with pricing and resource recommendations.",
            "Plan sets budgets and forecasts.",
            "Run sets guardrails and governance.",
          ],
        },
        {
          kind: "h3",
          id: "focus-one-format-for-cloud-cost-data",
          title: "FOCUS: one format for cloud cost data",
        },
        {
          kind: "p",
          text: "Microsoft Cost Management offers a dataset in the FinOps Open Cost and Usage Specification (FOCUS). AWS Data Exports offers a FOCUS 1.0 table. So cost data from both clouds fits one schema.",
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why FinOps matters for your cloud cost",
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
              " moves a VM’s data disks onto one pool sized to your data, then rightsizes it autonomously.",
            ],
            ["The ", { a: "free assessment", href: "/assessment" }, " works out your own figure."],
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Rightsizing",
      line: "Sizes a resource to its use.",
      href: "/learn/glossary/rightsizing",
    },
    { title: "Showback", line: "Shows each team its costs.", href: "/learn/glossary/showback" },
    {
      title: "Cloud unit economics",
      line: "The cloud cost of one sale or user.",
      href: "/learn/glossary/cloud-unit-economics",
    },
    {
      title: "Cloud chargeback",
      line: "Charges each team’s budget.",
      href: "/learn/glossary/cloud-chargeback",
    },
  ],
  next: {
    title: "Cloud cost optimization: how to reduce cloud costs",
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
