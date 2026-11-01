import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/finops/1";

export const term: GlossaryTerm = {
  slug: "finops",
  term: "FinOps",
  title: "What is FinOps? Cloud FinOps explained",
  meta: "FinOps means finance, engineering and business teams sharing ownership of cloud cost. Learn the three phases of cloud FinOps and how it works on Azure and AWS.",
  h1: "What is FinOps? Cloud FinOps explained",
  card: "FinOps, or cloud FinOps, is a practice where finance, engineering and business teams share ownership of cloud cost.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-25",
  updated: "2026-11-01",
  definition: [
    {
      kind: "p",
      text: "FinOps, or cloud FinOps, is a practice where finance, engineering and business teams share ownership of cloud cost. The FinOps meaning is in its name: finance plus DevOps. Microsoft says its goal isn’t to save money, but to get more business value from the cloud.",
    },
    { kind: "p", text: "In simple terms, each team owns its cloud cost." },
  ],
  sections: [
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
      title: "Cloud FinOps in Azure and AWS",
      blocks: [
        {
          kind: "p",
          text: "Microsoft bases its Azure FinOps guidance largely on the FinOps Framework. For tracking cloud cost, it points to Microsoft Cost Management. AWS has a similar framework, Cloud Financial Management, with four pillars: see, save, plan and run.",
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
              { a: "reduce cloud costs", href: "/cloud-cost-optimization" },
              ". Cost falls when you change what runs, or the rate you pay.",
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
  ],
};
