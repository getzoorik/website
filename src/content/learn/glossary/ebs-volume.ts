import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/ebs-volume/1";

export const term: GlossaryTerm = {
  slug: "ebs-volume",
  term: "EBS volume",
  title: "What is an EBS volume?",
  meta: "An EBS volume is block storage you attach to an EC2 instance. See how AWS bills it by provisioned size, and why it can grow in place but never shrink.",
  h1: "What is an EBS volume?",
  card: "An EBS volume is a block-level storage device you attach to an EC2 instance, a virtual machine (VM) in AWS.",
  group: "block-storage",
  product: "amoeba",
  published: "2026-10-25",
  updated: "2026-10-25",
  definition: [
    {
      kind: "p",
      text: [
        "An EBS volume is a ",
        { a: "block-level storage", href: "/learn/glossary/block-storage" },
        " device you attach to an EC2 instance, a virtual machine (VM) in AWS. Once attached, the volume works like a physical hard drive. EBS stands for Amazon Elastic Block Store.",
      ],
    },
    {
      kind: "p",
      text: "An EBS volume in AWS can be the system drive, or hold data such as a database. Two rules apply:",
    },
    {
      kind: "ul",
      items: [
        "It must share its instance’s Availability Zone.",
        "Its “Delete on termination” setting decides if it’s deleted or kept when the instance is terminated.",
      ],
    },
  ],
  sections: [
    {
      id: "an-example-of-ebs-in-aws",
      title: "An example of EBS in AWS",
      blocks: [
        {
          kind: "p",
          text: "Say your database runs on a 500\u00a0GiB data volume of type gp3, a General Purpose SSD (solid-state drive). The database writes 200\u00a0GiB.",
        },
        {
          kind: "p",
          text: "AWS bills all 500\u00a0GiB. With EBS, you pay for what you provision, not what you write.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "why-it-matters-for-your-bill",
      title: "Why it matters for your bill",
      blocks: [
        {
          kind: "ul",
          items: [
            "EBS bills each GB you provision, every month, until you delete the volume.",
            "A volume kept after its instance ends still bills.",
            "You can grow a volume in place, then extend its file system.",
            "AWS says “You can’t decrease the volume size.” So a volume sized for an old peak keeps billing at that size.",
            [
              "To ",
              { a: "shrink an EBS volume", href: "/learn/shrink-ebs-volume" },
              ", you copy the data to a new, smaller one with a tool such as rsync or robocopy.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " moves a VM’s data disks onto one pool sized to your data, then rightsizes it autonomously. It works on EBS data volumes on Windows and Linux VMs, never the root volume.",
          ],
        },
        {
          kind: "p",
          text: [
            "The ",
            { a: "free assessment", href: "/assessment?p=amoeba" },
            " works out your own figure.",
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Block storage",
      line: "The wider type an EBS volume belongs to.",
      href: "/learn/glossary/block-storage",
    },
    { title: "IOPS", line: "Input/output operations per second.", href: "/learn/glossary/iops" },
    {
      title: "Thin provisioning",
      line: "Storage that takes space only as you write, not up front.",
      href: "/learn/glossary/thin-provisioning",
    },
    {
      title: "Azure managed disk",
      line: "Azure’s matching drive.",
      href: "/learn/glossary/azure-managed-disk",
    },
  ],
  next: {
    title: "How to shrink an EBS volume when AWS only lets it grow",
    href: "/learn/shrink-ebs-volume",
  },
  sources: [
    {
      publisher: "AWS",
      title: "“Amazon EBS volumes”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volumes.html",
    },
    { publisher: "AWS", title: "“Amazon EBS pricing”", url: "https://aws.amazon.com/ebs/pricing/" },
    {
      publisher: "AWS",
      title: "“Modify an Amazon EBS volume using Elastic Volumes operations”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-modify-volume.html",
    },
    {
      publisher: "AWS",
      title: "“Preserve data when an instance is terminated”",
      url: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/preserving-volumes-on-termination.html",
    },
  ],
};
