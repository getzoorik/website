import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/savings-plan/1";

export const term: GlossaryTerm = {
  slug: "savings-plan",
  term: "Savings plan (AWS Savings Plans, Azure savings plan for compute)",
  title: "What is a savings plan in AWS and Azure?",
  meta: "A savings plan trades a 1- or 3-year hourly commitment for discounted compute. AWS and Azure plans, an example, and savings plans vs reserved instances.",
  h1: "What is a savings plan in AWS and Azure?",
  card: "A savings plan commits you to a fixed hourly spend on compute for one or three years, in exchange for discounted rates.",
  group: "finops-pricing",
  product: "coral",
  published: "2026-10-25",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: "A savings plan commits you to a fixed hourly spend on compute for one or three years, in exchange for discounted rates. AWS sells Savings Plans, and Azure sells the savings plan for compute.",
    },
    {
      kind: "ul",
      items: [
        [
          "Usage up to the commitment gets the discounted rate. Usage above it is charged at the ",
          { a: "on-demand rate", href: "/learn/glossary/on-demand-instance" },
          ".",
        ],
        "You pay the full commitment every hour, used or not. Unused commitment doesn’t carry over to the next hour.",
        "You can’t change or cancel a plan after you buy it.",
      ],
    },
  ],
  sections: [
    {
      id: "aws-savings-plans",
      title: "AWS Savings Plans",
      blocks: [
        {
          kind: "p",
          text: "AWS sells four types. Database and SageMaker AI Savings Plans cover only those services. The two for EC2 are:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Compute Savings Plans" },
              " take up to 66% off on-demand rates. They apply to any EC2 instance family, size, Region, OS or tenancy, and to Fargate and Lambda.",
            ],
            [
              { b: "EC2 Instance Savings Plans" },
              " take up to 72% off, for one instance family in one Region, at any size, OS or tenancy.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "On EKS, both EC2 plans cover your nodes, but not EKS’s own charges, such as the ",
            { a: "EKS Auto Mode", href: "/learn/glossary/eks-auto-mode" },
            " fee. No Savings Plan covers Spot usage.",
          ],
        },
      ],
    },
    {
      id: "an-example-from-aws",
      title: "An AWS example",
      blocks: [
        {
          kind: "p",
          text: "AWS’s example uses made-up rates. Four r5.4xlarge instances run for an hour, each $1.00 on-demand or $0.70 on a Compute Savings Plan.",
        },
        {
          kind: "p",
          text: "A $2.00-an-hour plan covers about 2.9 of those instance-hours. The other 1.1 are charged on-demand, $1.14 in all.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "azure-savings-plan",
      title: "Azure savings plan",
      blocks: [
        {
          kind: "p",
          text: "The Azure savings plan for compute works the same way, for up to 65% off pay-as-you-go prices. It covers Azure Virtual Machines, App Service, Container Instances and other compute services. On AKS, it covers the VMs behind your nodes, if their series is eligible.",
        },
      ],
    },
    {
      id: "savings-plan-vs-reserved-instance",
      title: "Savings plans vs reserved instances",
      blocks: [
        {
          kind: "ul",
          items: [
            [
              { b: "A savings plan" },
              " commits you to a dollar amount an hour. A Compute Savings Plan follows your usage across instance families and Regions.",
            ],
            [
              "A ",
              { a: "reserved instance", href: "/learn/glossary/reserved-instance" },
              " commits you to an instance setup. On AWS, Standard RIs also reach up to 72% off, and Convertible RIs up to 66%.",
            ],
          ],
        },
        {
          kind: "p",
          text: "On Azure, a reservation is tied to one VM family, size and region. Microsoft says it gives deeper discounts than a savings plan, but suits steady use.",
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for cloud cost",
      blocks: [
        {
          kind: "p",
          text: "A savings plan reduces the price of what you run, not how much you run. Remove spare capacity first, or you commit to paying for idle nodes for the whole term.",
        },
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " rebalances CPU and memory requests on AKS and EKS to match real use, and removes the nodes you don’t need. The ",
            { a: "free assessment", href: "/assessment?p=coral" },
            " estimates your own saving.",
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Reserved instance",
      line: "A commitment to one instance setup.",
      href: "/learn/glossary/reserved-instance",
    },
    {
      title: "Coverage vs utilization",
      line: "How much of a commitment you use.",
      href: "/learn/glossary/savings-plan-coverage-vs-utilization",
    },
    {
      title: "Spot instance",
      line: "Spare capacity no Savings Plan covers.",
      href: "/learn/glossary/spot-instance",
    },
    {
      title: "Rightsizing",
      line: "Matching resources to real use.",
      href: "/learn/glossary/rightsizing",
    },
  ],
  relatedTitle: "Related terms",
  next: {
    title: "Cloud cost optimization",
    href: "/cloud-cost-optimization",
  },
  sources: [
    {
      publisher: "AWS",
      title: "“Savings Plans types”",
      url: "https://docs.aws.amazon.com/savingsplans/latest/userguide/plan-types.html",
    },
    {
      publisher: "AWS",
      title: "“Compute Savings Plans and Reserved Instances”",
      url: "https://docs.aws.amazon.com/savingsplans/latest/userguide/sp-ris.html",
    },
    {
      publisher: "AWS",
      title: "“Understanding how Savings Plans apply to your usage”",
      url: "https://docs.aws.amazon.com/savingsplans/latest/userguide/sp-applying.html",
    },
    { publisher: "AWS", title: "“Amazon EKS pricing”", url: "https://aws.amazon.com/eks/pricing/" },
    {
      publisher: "Microsoft Azure",
      title: "“Azure Savings Plans”",
      url: "https://azure.microsoft.com/en-us/pricing/offers/savings-plans/",
    },
    {
      publisher: "Microsoft Learn",
      title: "“What are savings plans?”",
      url: "https://learn.microsoft.com/en-us/azure/cost-management-billing/savings-plan/savings-plan-overview",
    },
  ],
};
