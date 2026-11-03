import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/cost-allocation-tags/1";

export const term: GlossaryTerm = {
  slug: "cost-allocation-tags",
  term: "Cost allocation tags",
  title: "What are cost allocation tags?",
  meta: "AWS cost allocation tags split cloud cost by team, app or environment once you activate them. How tags reach cost reports on AWS, EKS and Azure.",
  h1: "What are cost allocation tags?",
  card: "Cost allocation tags are labels on cloud resources that let cost reports split your cloud cost by team, app or environment.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-26",
  updated: "2026-11-03",
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
      title: "On AWS, Azure and EKS",
      blocks: [
        {
          kind: "h3",
          id: "user-defined-and-aws-generated-cost-allocation",
          title: "AWS",
        },
        {
          kind: "p",
          text: [
            "AWS cost allocation tags are user-defined tags you create, or AWS-generated tags such as ",
            { code: "aws:createdBy" },
            ". Each one shows in Cost Explorer only after you activate it in the Billing and Cost Management console. Tags can take up to 24\u00a0hours to appear in that console.",
          ],
        },
        {
          kind: "p",
          text: "In AWS Organizations, only the management account can activate tags. Costs from before activation carry no tag. The management account can backfill tags for up to 12\u00a0months, but only where the tag was on the resource then.",
        },
        { kind: "h3", id: "azure-cost-allocation-tags", title: "Azure" },
        {
          kind: "p",
          text: "Microsoft Cost Management reads the tags on each usage record. A tag reaches usage data only while it is on the resource. Resources don’t inherit resource group or subscription tags.",
        },
        {
          kind: "p",
          text: "Tag inheritance, a Cost Management setting, copies subscription and resource group tags into usage records, not onto your resources. It works on Enterprise Agreement and Microsoft Customer Agreement accounts, and on Microsoft Partner Agreement accounts with Azure plan subscriptions. It applies to the current month’s usage.",
        },
        { kind: "h3", id: "eks-cost-allocation-tags", title: "EKS" },
        {
          kind: "p",
          text: [
            "On Amazon Elastic Kubernetes Service (EKS), AWS adds ",
            { code: "aws:eks:cluster-name" },
            " to each EC2 instance in a cluster. Once activated, it splits instance cost by cluster, but not control plane cost.",
          ],
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
      title: "Why it matters for cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            [
              "Tags show who owns your node, virtual machine (VM) and disk cost. They don’t ",
              { a: "reduce cloud cost", href: "/cloud-cost-optimization" },
              " on their own.",
            ],
            [
              { a: "Coral", href: "/coral" },
              " rebalances CPU and memory requests on AKS and EKS to match real use, and removes the nodes you don’t need.",
            ],
            [
              { a: "Amoeba", href: "/amoeba" },
              " moves a VM’s data disks onto one pool sized to your data, then rightsizes it.",
            ],
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Cloud tagging strategy",
      line: "Which tags to require.",
      href: "/learn/glossary/cloud-tagging-strategy",
    },
    {
      title: "Kubernetes cost allocation",
      line: "Splits a shared cluster’s cost by pod.",
      href: "/learn/glossary/kubernetes-cost-allocation",
    },
    {
      title: "Showback",
      line: "Reports each team’s share, with no charge.",
      href: "/learn/glossary/showback",
    },
    {
      title: "Cloud chargeback",
      line: "Each team pays its share.",
      href: "/learn/glossary/cloud-chargeback",
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
      title: "“Organizing and tracking costs using AWS cost allocation tags”",
      url: "https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/cost-alloc-tags.html",
    },
    {
      publisher: "AWS",
      title: "“Backfill cost allocation tags”",
      url: "https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/cost-allocation-backfill.html",
    },
    {
      publisher: "AWS",
      title: "“Building a cost allocation strategy”",
      url: "https://docs.aws.amazon.com/whitepapers/latest/tagging-best-practices/building-a-cost-allocation-strategy.html",
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
    {
      publisher: "Microsoft Learn",
      title: "“Allocation”",
      url: "https://learn.microsoft.com/en-us/cloud-computing/finops/framework/understand/allocation",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Use tags to organize your Azure resources and management hierarchy”",
      url: "https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/tag-resources",
    },
  ],
};
