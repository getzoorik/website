import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/cost-allocation-tags/1";

export const term: GlossaryTerm = {
  slug: "cost-allocation-tags",
  term: "Cost allocation tags",
  title: "What are cost allocation tags in AWS and Azure?",
  meta: "Cost allocation tags label cloud resources so reports can split cloud cost by team or app. See how AWS cost allocation tags, Azure tags and EKS tags work.",
  h1: "What are cost allocation tags in AWS and Azure?",
  card: "Cost allocation tags are labels on cloud resources that let cost reports split your cloud cost by team, app or environment.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-26",
  updated: "2026-11-01",
  definition: [
    {
      kind: "p",
      text: "Cost allocation tags are labels on cloud resources that let cost reports split your cloud cost by team, app or environment. Each tag is a key and a value.",
    },
    {
      kind: "p",
      text: [
        "Which tags each resource must carry is your ",
        { a: "cloud tagging strategy", href: "/learn/glossary/cloud-tagging-strategy" },
        ".",
      ],
    },
  ],
  sections: [
    {
      id: "cost-allocation-tags-on-aws-azure-and",
      title: "Cost allocation tags on AWS, Azure and EKS",
      blocks: [
        {
          kind: "h3",
          id: "user-defined-and-aws-generated-cost-allocation",
          title: "User-defined and AWS-generated cost allocation tags",
        },
        {
          kind: "p",
          text: "AWS cost allocation tags are user-defined tags you create, or AWS-generated tags such as aws:createdBy. Each one shows in Cost Explorer only after you activate it in the Billing and Cost Management console. In AWS Organizations, only the management account can activate tags.",
        },
        { kind: "h3", id: "azure-cost-allocation-tags", title: "Azure cost allocation tags" },
        {
          kind: "p",
          text: "For Azure cost allocation tags, Microsoft Cost Management reads the tags on each usage record. Resource group and subscription tags reach them only with tag inheritance on.",
        },
        { kind: "h3", id: "eks-cost-allocation-tags", title: "EKS cost allocation tags" },
        {
          kind: "p",
          text: "On Amazon Elastic Kubernetes Service (EKS), AWS adds aws:eks:cluster-name to each EC2 instance (virtual machine) in a cluster. Once active, this EKS cost allocation tag splits instance cost by cluster, not control plane cost.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: [
            "A tag on a shared Azure Kubernetes Service (AKS) or EKS node can’t split its cost between pods. ",
            { a: "Kubernetes cost allocation", href: "/learn/glossary/kubernetes-cost-allocation" },
            " can.",
          ],
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why cost allocation tags matter for your cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            [
              "The purpose of cost allocation tags is to show who owns your node, virtual machine (VM) and disk spend. Tags alone don’t ",
              { a: "reduce cloud costs", href: "/cloud-cost-optimization" },
              ".",
            ],
            [
              { a: "Coral", href: "/coral" },
              " rebalances CPU and memory requests on AKS and EKS to match real use. It drains spare nodes so your autoscaler can remove them.",
            ],
            [
              { a: "Amoeba", href: "/amoeba" },
              " moves a VM’s data disks onto one pool sized to your data, then rightsizes it.",
            ],
            ["The ", { a: "free assessment", href: "/assessment" }, " works out your own figure."],
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Kubernetes cost allocation",
      line: "Splits a shared cluster by pod.",
      href: "/learn/glossary/kubernetes-cost-allocation",
    },
    {
      title: "Cloud tagging strategy",
      line: "Which tags to require.",
      href: "/learn/glossary/cloud-tagging-strategy",
    },
    {
      title: "Showback",
      line: "Reports a team’s share with no charge.",
      href: "/learn/glossary/showback",
    },
    {
      title: "Cloud chargeback",
      line: "The team pays its share.",
      href: "/learn/glossary/cloud-chargeback",
    },
  ],
  next: {
    title: "Cloud cost optimization: how to reduce cloud costs",
    href: "/cloud-cost-optimization",
  },
  sources: [
    {
      publisher: "AWS",
      title: "“Organizing and tracking costs using AWS cost allocation tags”",
      url: "https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/cost-alloc-tags.html",
    },
    {
      publisher: "AWS",
      title: "“Organize Amazon EKS resources with tags”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/eks-using-tags.html",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Understand Cost Management data”",
      url: "https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/understand-cost-mgt-data",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Group and allocate costs using tag inheritance”",
      url: "https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/enable-tag-inheritance",
    },
  ],
};
