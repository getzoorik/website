import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/finops/1";

export const term: GlossaryTerm = {
  slug: "finops",
  term: "FinOps",
  title: "What is FinOps?",
  meta: "FinOps is how finance, engineering and business teams share ownership of cloud spend. Learn its three phases, a Microsoft example and how it works in Azure.",
  h1: "What is FinOps?",
  card: "FinOps is a practice where finance, engineering and business teams share ownership of cloud spend.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-25",
  updated: "2026-10-26",
  definition: [
    {
      kind: "p",
      text: "FinOps is a practice where finance, engineering and business teams share ownership of cloud spend. The FinOps meaning is in its name: finance plus DevOps. Microsoft says its goal isn’t to save money, but to get more business value from the cloud.",
    },
    {
      kind: "p",
      text: "In simple terms, each team owns its cloud cost. The FinOps Framework, from the FinOps Foundation, splits the work into three phases that repeat:",
    },
    {
      kind: "ul",
      items: [
        "Inform shows each team what it spends.",
        "Optimize makes cloud use more efficient, for example by stopping idle resources.",
        "Operate tracks goals and sets rules.",
      ],
    },
    { kind: "svg", figure: figure1 },
  ],
  sections: [
    {
      id: "an-example-idle-developer-machines",
      title: "An example: idle developer machines",
      blocks: [
        {
          kind: "p",
          text: "Microsoft’s FinOps guidance suggests three steps for developer virtual machines (VMs):",
        },
        {
          kind: "ul",
          items: [
            "Tag each resource with its environment, such as development.",
            "Stop each developer VM off-peak with a script if it wasn’t used in 2\u00a0hours.",
            "Expect storage charges to continue while it’s stopped.",
          ],
        },
      ],
    },
    {
      id: "finops-in-azure-and-aws",
      title: "FinOps in Azure and AWS",
      blocks: [
        {
          kind: "p",
          text: "Microsoft bases its Azure FinOps guidance largely on the FinOps Framework. To track spend, it points you to Microsoft Cost Management. AWS has a similar framework, Cloud Financial Management, with four pillars: see, save, plan and run.",
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
            [
              "Reports alone don’t ",
              { a: "reduce cloud costs", href: "/learn/how-to-reduce-cloud-costs" },
              ". Your cloud cost goes down when you change what runs, or the rate you pay for it.",
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
      line: "The cloud cost of one sale or one user.",
      href: "/learn/glossary/cloud-unit-economics",
    },
    {
      title: "Cloud chargeback",
      line: "Charges each team’s budget.",
      href: "/learn/glossary/cloud-chargeback",
    },
  ],
  next: { title: "How to reduce cloud costs", href: "/learn/how-to-reduce-cloud-costs" },
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
  ],
};
