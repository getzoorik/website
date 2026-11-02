import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/aws-instance-families/1";

export const term: GlossaryTerm = {
  slug: "aws-instance-families",
  term: "AWS instance families",
  title: "EC2 instance types and AWS instance families",
  meta: "AWS instance types set an EC2 instance’s CPU, memory and storage. See what EC2 instance families are, how to read c7gn.xlarge, and how they shape cloud cost.",
  h1: "EC2 instance types and AWS instance families",
  card: "An AWS EC2 instance is a server, usually a virtual machine (VM).",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-26",
  updated: "2026-11-02",
  definition: [
    {
      kind: "p",
      text: "An AWS EC2 instance is a server, usually a virtual machine (VM). Each instance in AWS has an instance type, such as m7i.large, that sets its compute, memory and storage.",
    },
    {
      kind: "p",
      text: [
        "AWS instance families are sets of EC2 instance types that differ only in size. Most families keep the same memory per virtual CPU (vCPU) at every size, except the ",
        { a: "burstable", href: "/learn/glossary/burstable-instance" },
        " T families.",
      ],
    },
  ],
  sections: [
    {
      id: "aws-instance-family-vs-type",
      title: "How to read AWS EC2 instance types, such as c7gn.xlarge",
      blocks: [
        {
          kind: "p",
          text: "AWS names each instance type by its instance family and size. In c7gn.xlarge, the instance family is c7gn, the part before the period:",
        },
        {
          kind: "ul",
          items: [
            "c is the compute optimized series.",
            "7 is the generation.",
            [
              "gn holds the options: g for Arm-based ",
              { a: "Graviton", href: "/learn/glossary/aws-graviton" },
              " processors, n for network and ",
              { a: "EBS-optimized", href: "/learn/glossary/ebs-optimized-instance" },
              ".",
            ],
            "xlarge is the size.",
          ],
        },
        {
          kind: "p",
          text: "The series letter shows the instance class, one of six categories AWS sorts EC2 types into.",
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
      title: "EC2 instance sizing: why the family matters for your cloud cost",
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
          text: "Say each pod requests 0.5\u00a0vCPU and 4\u00a0GiB, and compare two AWS EC2 instance sizes. The illustration ignores what a node keeps for the system.",
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
            "So AWS EC2 sizing for 8\u00a0pods means two m7i.xlarge nodes or one r7i.xlarge. Compare the price per pod before you ",
            {
              a: "change a node group’s instance type",
              href: "/learn/change-eks-node-group-instance-type",
            },
            ".",
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
      title: "“Amazon EC2 instance types”",
      url: "https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-types.html",
    },
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
