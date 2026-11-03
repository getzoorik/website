import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/ebs-optimized-instance/1";

export const term: GlossaryTerm = {
  slug: "ebs-optimized-instance",
  term: "EBS-optimized instance",
  title: "What are Amazon EBS-optimized instances?",
  meta: "An EBS-optimized instance has dedicated bandwidth for Amazon EBS. Which EC2 types include it at no extra cost, and how its limits cap your volumes.",
  h1: "What are Amazon EBS-optimized instances?",
  card: "An EBS-optimized instance is an Amazon EC2 instance with dedicated bandwidth for Amazon Elastic Block Store (EBS).",
  group: "block-storage",
  product: "amoeba",
  published: "2026-10-26",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: "An EBS-optimized instance is an Amazon EC2 instance with dedicated bandwidth for Amazon Elastic Block Store (EBS). Other traffic can’t use that bandwidth.",
    },
  ],
  sections: [
    {
      id: "ebs-optimized-instance-types",
      title: "Instance types",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "EC2 instance types", href: "/learn/glossary/aws-instance-families" },
            " fall into three groups:",
          ],
        },
        {
          kind: "ul",
          items: [
            "Most current generation types are EBS-optimized by default, at no extra cost.",
            "Some previous generation types, such as m3.xlarge, offer it for an extra hourly fee.",
            "Others, such as t2.micro and c3.8xlarge, don’t offer it.",
          ],
        },
      ],
    },
    {
      id: "an-example",
      title: "Instance EBS limits",
      blocks: [
        {
          kind: "p",
          text: [
            "Each instance type has its own EBS limits for bandwidth and for ",
            { a: "input/output operations per second (IOPS)", href: "/learn/glossary/iops" },
            ". With 16\u00a0KiB operations, an m6i.large gets:",
          ],
        },
        {
          kind: "ul",
          items: [
            "3,600\u00a0IOPS at baseline, at all times.",
            "Up to 40,000\u00a0IOPS for 30\u00a0minutes, at least once every 24\u00a0hours.",
          ],
        },
        {
          kind: "p",
          text: "You get the smaller of the instance’s limit and your volumes’ combined limit, whatever the volume type. Say its gp3\u00a0volume is set to 10,000\u00a0IOPS. After those 30\u00a0minutes, it gets 3,600 at most.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            "On previous generation types that offer it, EBS optimization adds an hourly fee.",
            [
              "gp3 includes 3,000\u00a0IOPS and 125\u00a0MiB/s of ",
              { a: "throughput", href: "/learn/glossary/disk-throughput" },
              ". More costs extra.",
            ],
            "Buy IOPS above the instance’s baseline, and you pay for speed it can’t sustain.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " moves a VM’s data disks onto one btrfs pool sized to your data, then rightsizes it autonomously. Each pool volume gets at least gp3’s included performance, and more when the instance’s load needs it, within the instance’s own limits.",
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Provisioned IOPS",
      line: "IOPS you set and pay for.",
      href: "/learn/glossary/provisioned-iops",
    },
    {
      title: "Disk throughput",
      line: "The other EBS limit.",
      href: "/learn/glossary/disk-throughput",
    },
    { title: "gp3 in AWS", line: "The volume in the example.", href: "/learn/glossary/ebs-gp3" },
    { title: "EBS volume", line: "The AWS disk.", href: "/learn/glossary/ebs-volume" },
  ],
  relatedTitle: "Related terms",
  next: {
    title: "io2 vs gp3: when io2 is worth it",
    href: "/learn/io2-vs-gp3",
  },
  sources: [
    {
      publisher: "AWS",
      title: "“Amazon EBS-optimized instance types”",
      url: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-optimized.html",
    },
    {
      publisher: "AWS",
      title: "“Specifications for Amazon EC2 general purpose instances”",
      url: "https://docs.aws.amazon.com/ec2/latest/instancetypes/gp.html",
    },
    {
      publisher: "AWS",
      title: "“EC2 On-Demand Instance Pricing”",
      url: "https://aws.amazon.com/ec2/pricing/on-demand/",
    },
    {
      publisher: "AWS",
      title: "“Amazon EBS General Purpose SSD volumes”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/general-purpose.html",
    },
  ],
};
