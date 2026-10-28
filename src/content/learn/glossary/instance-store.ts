import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/instance-store/1";

export const term: GlossaryTerm = {
  slug: "instance-store",
  term: "Instance store (AWS EC2)",
  title: "What is instance store in AWS?",
  meta: "Instance store in AWS is temporary block storage on the EC2 host, at no extra charge. See when its data is lost, how it compares with EBS, and what it costs.",
  h1: "What is instance store in AWS?",
  card: "Instance store in AWS is temporary block storage for an EC2 instance, a server in AWS.",
  group: "block-storage",
  product: "both",
  published: "2026-10-26",
  updated: "2026-10-26",
  definition: [
    {
      kind: "p",
      text: [
        "Instance store in AWS is temporary ",
        { a: "block storage", href: "/learn/glossary/block-storage" },
        " for an EC2 instance, a server in AWS. Its disks are physically attached to the instance’s host computer. You see it as one or more instance store volumes.",
      ],
    },
    {
      kind: "p",
      text: [
        "AWS says it suits data that changes often, such as caches and scratch data. Not every ",
        { a: "instance type", href: "/learn/glossary/aws-instance-families" },
        " has it.",
      ],
    },
    {
      kind: "p",
      text: "A reboot keeps the data. It’s lost when the instance stops, hibernates or terminates, or when AWS retires or recovers it. If a disk fails, its data is lost.",
    },
    { kind: "svg", figure: figure1 },
  ],
  sections: [
    {
      id: "an-example-a-cache-on-instance-store",
      title: "An example: a cache on instance store",
      blocks: [
        {
          kind: "p",
          text: "Say a web server keeps its cache on an EC2 instance store volume. After a reboot, the cache is still there. After an overnight stop, it starts with a blank volume.",
        },
      ],
    },
    {
      id: "instance-store-vs-ebs",
      title: "Instance store vs EBS",
      blocks: [
        {
          kind: "ul",
          items: [
            [
              "An instance store volume exists only for the life of its instance. An ",
              { a: "Amazon Elastic Block Store (EBS) volume", href: "/learn/glossary/ebs-volume" },
              " persists on its own.",
            ],
            "You get instance store only at launch. You can’t detach it and attach it to another instance.",
          ],
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for your cloud cost",
      blocks: [
        {
          kind: "p",
          text: "There’s no extra charge in AWS instance store pricing. The volumes are part of the instance’s usage cost. Data you need to keep belongs on storage such as EBS or Amazon S3, which cost extra.",
        },
        {
          kind: "ul",
          items: [
            "EBS storage is charged per provisioned GB each month, empty or not, until you delete the volume.",
            [
              "A change of instance type loses instance store data, so plan for it before you ",
              {
                a: "switch a node group’s type",
                href: "/learn/change-eks-node-group-instance-type",
              },
              ".",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "The ",
            { a: "free assessment", href: "/assessment?p=amoeba" },
            " works out what your disks could save.",
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "EBS volume",
      line: "Storage that outlives its instance.",
      href: "/learn/glossary/ebs-volume",
    },
    {
      title: "Azure temporary disk",
      line: "Azure’s short-term VM storage.",
      href: "/learn/glossary/azure-temporary-disk",
    },
    {
      title: "Ephemeral OS disk",
      line: "A temporary Azure OS disk.",
      href: "/learn/glossary/ephemeral-os-disk",
    },
    {
      title: "Block storage",
      line: "What instance store and EBS both are.",
      href: "/learn/glossary/block-storage",
    },
  ],
  next: {
    title: "How to change an EKS node group instance type",
    href: "/learn/change-eks-node-group-instance-type",
  },
  sources: [
    {
      publisher: "AWS",
      title: "“Instance store temporary block storage for EC2 instances”",
      url: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/InstanceStorage.html",
    },
    {
      publisher: "AWS",
      title: "“Data persistence for Amazon EC2 instance store volumes”",
      url: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-store-lifetime.html",
    },
    {
      publisher: "AWS",
      title: "“Amazon EBS volumes”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volumes.html",
    },
    { publisher: "AWS", title: "“Amazon EBS pricing”", url: "https://aws.amazon.com/ebs/pricing/" },
  ],
};
