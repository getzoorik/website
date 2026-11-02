import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/aws-graviton/1";

export const term: GlossaryTerm = {
  slug: "aws-graviton",
  term: "AWS Graviton",
  title: "What is AWS Graviton? Graviton instances explained",
  meta: "AWS Graviton is the Arm processor family AWS builds for EC2, now in its fifth generation. How to tell AWS Graviton instances by name, and what EKS needs.",
  h1: "What is AWS Graviton? Graviton instances explained",
  card: "AWS Graviton is a family of Arm-based processors that Amazon builds for Amazon Web Services (AWS).",
  group: "finops-pricing",
  product: "coral",
  published: "2026-11-02",
  updated: "2026-11-02",
  definition: [
    {
      kind: "p",
      text: "AWS Graviton is a family of Arm-based processors that Amazon builds for Amazon Web Services (AWS). Graviton instances are the Amazon Elastic Compute Cloud (EC2) instance types that run on them.",
    },
  ],
  sections: [
    {
      id: "aws-graviton-processors",
      title: "AWS Graviton processors, from Graviton to Graviton5",
      blocks: [
        {
          kind: "p",
          text: "Every Graviton processor is a 64-bit Arm (arm64) chip. Graviton5, the fifth generation, has been generally available on EC2 since June 2026.",
        },
      ],
    },
    {
      id: "graviton-on-ec2-and-eks",
      title: "Graviton on EC2 and EKS",
      blocks: [
        {
          kind: "p",
          text: "In an EC2 instance type name, a g after the generation number means AWS Graviton, as in m7g.large or c7gn.xlarge. On the general purpose Graviton types, Linux is the only operating system AWS lists.",
        },
        {
          kind: "p",
          text: [
            "Amazon Elastic Kubernetes Service (EKS) offers Arm versions of its EKS-optimized Amazon Machine Images (AMIs), built on Amazon Linux. Apps on Arm nodes must be compiled for Arm. Each ",
            { a: "DaemonSet", href: "/learn/glossary/daemonset" },
            " must also be able to run on every architecture in your cluster.",
          ],
        },
        {
          kind: "p",
          text: [
            "One cluster can run Arm and x86 node groups side by side. In that case, AWS suggests multi-architecture images, plus node selectors so each pod lands where its image runs. A selector can use ",
            { code: "kubernetes.io/arch" },
            ", the label that names each node’s architecture, such as arm64 or amd64.",
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: [
            "A managed node group can’t change its instance type in place, so moving to Graviton usually means a new node group. See ",
            {
              a: "how to change an EKS node group instance type",
              href: "/learn/change-eks-node-group-instance-type",
            },
            ".",
          ],
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why AWS Graviton matters for your cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            "AWS says Graviton instances deliver up to 40% better price-performance than equivalent x86 instances (November 2026). That figure is price-performance, not price.",
            "Compare On-Demand prices for sizes with the same virtual CPUs (vCPUs) and memory, such as m7g.large and Intel-based m7i.large, in your Region. Prices change.",
            [
              { a: "Coral", href: "/coral" },
              " rebalances CPU and memory requests on AKS and EKS to match real use. It drains spare nodes so your autoscaler can remove them.",
            ],
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "vCPU",
      line: "On Graviton, one vCPU is one core.",
      href: "/learn/glossary/vcpu",
    },
    {
      title: "Azure Cobalt",
      line: "Microsoft’s own Arm CPU for Azure VMs.",
      href: "/learn/glossary/azure-cobalt",
    },
    {
      title: "AWS instance families",
      line: "How to read names like m7g.large.",
      href: "/learn/glossary/aws-instance-families",
    },
    {
      title: "DaemonSet",
      line: "Its image needs an Arm build too.",
      href: "/learn/glossary/daemonset",
    },
  ],
  relatedTitle: "Terms related to AWS Graviton",
  next: {
    title: "How to choose EKS instance types",
    href: "/learn/how-to-choose-eks-instance-types",
  },
  sources: [
    {
      publisher: "Amazon Web Services",
      title:
        "“Now available: Amazon EC2 M9g and M9gd instances powered by new AWS Graviton5 processors”",
      url: "https://aws.amazon.com/blogs/aws/now-available-amazon-ec2-m9g-and-m9gd-instances-powered-by-new-aws-graviton5-processors/",
      note: " (AWS News Blog)",
    },
    {
      publisher: "Amazon Web Services",
      title: "“Graviton instances”",
      url: "https://docs.aws.amazon.com/whitepapers/latest/financial-services-grid-computing/graviton-instances.html",
      note: " (AWS whitepaper)",
    },
    {
      publisher: "Amazon Web Services",
      title: "“Specifications for Amazon EC2 general purpose instances”",
      url: "https://docs.aws.amazon.com/ec2/latest/instancetypes/gp.html",
    },
    {
      publisher: "Amazon Web Services",
      title: "“Amazon EC2 instance type naming conventions”",
      url: "https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-type-names.html",
    },
    {
      publisher: "Amazon Web Services",
      title: "“Create nodes with optimized Amazon Linux AMIs”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/eks-optimized-ami.html",
      note: " (Amazon EKS User Guide)",
    },
    {
      publisher: "Kubernetes",
      title: "“Well-Known Labels, Annotations and Taints”",
      url: "https://kubernetes.io/docs/reference/labels-annotations-taints/",
    },
    {
      publisher: "Amazon Web Services",
      title: "“Graviton instance migration”",
      url: "https://docs.aws.amazon.com/prescriptive-guidance/latest/eks-cost-optimization/3-migration-to-graviton.html",
      note: " (AWS Prescriptive Guidance)",
    },
    {
      publisher: "Amazon Web Services",
      title: "“Amazon EC2 On-Demand Pricing”",
      url: "https://aws.amazon.com/ec2/pricing/on-demand/",
    },
  ],
};
