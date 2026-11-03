import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/aws-instance-families/1";

export const term: GlossaryTerm = {
  slug: "aws-instance-families",
  term: "AWS instance families",
  title: "EC2 instance types and families",
  meta: "EC2 instance types set an instance’s CPU, memory and storage. How to read a type name such as c7gn.xlarge, and how the family shapes cloud cost.",
  h1: "EC2 instance types and families",
  card: "AWS instance families are sets of EC2 instance types that differ only in size.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-26",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: "AWS instance families are sets of EC2 instance types that differ only in size. EC2 instances are servers in AWS, usually virtual machines (VMs). Each has an instance type, such as m7i.large, that sets its compute, memory and storage.",
    },
    {
      kind: "p",
      text: "AWS sorts current instance types into six categories: general purpose, compute optimized, memory optimized, storage optimized, accelerated computing and high-performance computing.",
    },
  ],
  sections: [
    {
      id: "aws-instance-family-vs-type",
      title: "How to read a type name",
      blocks: [
        {
          kind: "p",
          text: "In c7gn.xlarge, the instance family is c7gn, the part before the period:",
        },
        {
          kind: "ul",
          items: [
            "c is the series: compute optimized.",
            "7 is the generation.",
            [
              "gn are the options: g for Arm-based ",
              { a: "Graviton", href: "/learn/glossary/aws-graviton" },
              " processors, n for network and ",
              { a: "EBS optimized", href: "/learn/glossary/ebs-optimized-instance" },
              ".",
            ],
            "xlarge, after the period, is the size.",
          ],
        },
        {
          kind: "p",
          text: "Other common options are a for AMD processors, i for Intel and d for local instance store volumes.",
        },
      ],
    },
    {
      id: "three-ec2-instance-families-at-one-size",
      title: "One size, three families",
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
        {
          kind: "p",
          text: [
            "In these families, memory per vCPU is the same at every size: 2\u00a0GiB for c7i, 4 for m7i and 8 for r7i. The ",
            { a: "burstable", href: "/learn/glossary/burstable-instance" },
            " T families differ: every T3 size up to t3.large has 2\u00a0vCPUs, with 0.5 to 8\u00a0GiB.",
          ],
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for cloud cost",
      blocks: [
        {
          kind: "p",
          text: [
            "EC2 instance sizing starts with the family. If its memory per vCPU doesn’t match your pods’ ",
            { a: "requests", href: "/learn/glossary/kubernetes-resource-requests" },
            ", one resource fills first and part of the other sits idle.",
          ],
        },
        {
          kind: "p",
          text: "Say each pod requests 0.5\u00a0vCPU and 4\u00a0GiB. Ignore what a node keeps for the system:",
        },
        {
          kind: "ul",
          items: [
            "An m7i.xlarge (4\u00a0vCPUs, 16\u00a0GiB) fills its memory with 4\u00a0pods, so 2\u00a0vCPUs sit idle.",
            "An r7i.xlarge (4\u00a0vCPUs, 32\u00a0GiB) fits 8\u00a0pods exactly.",
          ],
        },
        {
          kind: "p",
          text: [
            "So 8\u00a0pods need two m7i.xlarge nodes or one r7i.xlarge. Compare the price per pod before you ",
            { a: "choose EKS instance types", href: "/learn/how-to-choose-eks-instance-types" },
            " or ",
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
      line: "The T families, which run on CPU credits.",
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
  relatedTitle: "Related terms",
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
