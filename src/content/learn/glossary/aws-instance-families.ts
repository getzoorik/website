import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/aws-instance-families/1";

export const term: GlossaryTerm = {
  slug: "aws-instance-families",
  term: "AWS instance families",
  title: "What are AWS instance families?",
  meta: "AWS instance families, or EC2 instance families, are sets of instance types that differ only in size. How to read c7gn.xlarge, and how a family shapes cost.",
  h1: "What are AWS instance families?",
  card: "AWS instance families are sets of EC2 instance types that differ only in size.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-26",
  updated: "2026-11-01",
  definition: [
    {
      kind: "p",
      text: [
        "AWS instance families are sets of EC2 instance types that differ only in size. An EC2 instance is an AWS server, usually a virtual machine (VM). Most families keep the same memory per virtual CPU (vCPU) at every size, except the ",
        { a: "burstable", href: "/learn/glossary/burstable-instance" },
        " T families.",
      ],
    },
  ],
  sections: [
    {
      id: "aws-instance-family-vs-type",
      title: "AWS instance family vs EC2 instance type",
      blocks: [
        {
          kind: "p",
          text: "The instance type is the full name, such as c7gn.xlarge. An instance family in AWS is the part before the period. AWS’s example has four parts:",
        },
        {
          kind: "ul",
          items: [
            "c is the compute optimized series.",
            "7 is the generation.",
            [
              "gn holds the options: g for Arm-based Graviton processors, n for network and ",
              { a: "EBS-optimized", href: "/learn/glossary/ebs-optimized-instance" },
              ".",
            ],
            "xlarge is the size.",
          ],
        },
      ],
    },
    {
      id: "three-ec2-instance-families-at-one-size",
      title: "Compute optimized vs memory optimized: three EC2 instance families at one size",
      blocks: [
        { kind: "p", text: "At the large size, each has 2\u00a0vCPUs but different memory:" },
        {
          kind: "ul",
          items: [
            "c7i.large, compute optimized: 4\u00a0GiB",
            "m7i.large, general purpose: 8\u00a0GiB",
            "r7i.large, memory optimized: 16\u00a0GiB",
          ],
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for your cloud cost",
      blocks: [
        {
          kind: "p",
          text: [
            "If a family doesn’t match your pods’ ",
            { a: "requests", href: "/learn/glossary/kubernetes-resource-requests" },
            ", one resource runs out first. Part of the other sits idle on every node.",
          ],
        },
        {
          kind: "p",
          text: "Say each pod requests 0.5\u00a0vCPU and 4\u00a0GiB. This illustration ignores what a node keeps for the system.",
        },
        {
          kind: "ul",
          items: [
            "An m7i.xlarge has 4\u00a0vCPUs and 16\u00a0GiB. Memory fills after 4\u00a0pods, so 2\u00a0vCPUs sit idle.",
            "An r7i.xlarge has 4\u00a0vCPUs and 32\u00a0GiB. It fits 8\u00a0pods exactly.",
          ],
        },
        {
          kind: "p",
          text: [
            "So 8\u00a0pods need two m7i.xlarge nodes or one r7i.xlarge. Compare the price per pod before you ",
            {
              a: "change a node group’s instance type",
              href: "/learn/change-eks-node-group-instance-type",
            },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "The ",
            { a: "free assessment", href: "/assessment" },
            " works out what your clusters and disks could save.",
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Azure VM series",
      line: "Azure’s version of the same idea.",
      href: "/learn/glossary/azure-vm-series",
    },
    {
      title: "Burstable instance",
      line: "The T series, with burstable performance.",
      href: "/learn/glossary/burstable-instance",
    },
    {
      title: "Instance store",
      line: "Local disks that a d in the options adds.",
      href: "/learn/glossary/instance-store",
    },
    {
      title: "Node pool",
      line: "Where you set your nodes’ instance types.",
      href: "/learn/glossary/node-pool",
    },
  ],
  next: {
    title: "How to change an EKS node group instance type",
    href: "/learn/change-eks-node-group-instance-type",
  },
  sources: [
    {
      publisher: "Amazon Web Services",
      title: "“Amazon EC2 instance type naming conventions”",
      url: "https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-type-names.html",
    },
    {
      publisher: "Amazon Web Services",
      title: "“Specifications for Amazon EC2 general purpose instances”",
      url: "https://docs.aws.amazon.com/ec2/latest/instancetypes/gp.html",
    },
    {
      publisher: "Amazon Web Services",
      title: "“Specifications for Amazon EC2 compute optimized instances”",
      url: "https://docs.aws.amazon.com/ec2/latest/instancetypes/co.html",
    },
    {
      publisher: "Amazon Web Services",
      title: "“Specifications for Amazon EC2 memory optimized instances”",
      url: "https://docs.aws.amazon.com/ec2/latest/instancetypes/mo.html",
    },
  ],
};
