import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/ebs-volume/1";

export const term: GlossaryTerm = {
  slug: "ebs-volume",
  term: "EBS volume",
  title: "What is AWS EBS (Elastic Block Store)?",
  meta: "AWS EBS (Elastic Block Store) is block storage for EC2 instances. What an EBS volume is, the volume types, how it’s charged, and why it can’t shrink.",
  h1: "What is AWS EBS (Elastic Block Store)?",
  card: "Amazon Elastic Block Store (EBS) is the AWS block storage service for EC2 instances.",
  group: "block-storage",
  product: "amoeba",
  published: "2026-10-25",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: [
        "Amazon Elastic Block Store (EBS) is the AWS ",
        { a: "block storage", href: "/learn/glossary/block-storage" },
        " service for EC2 instances. An EBS volume is one of its drives. You attach it to an instance, a virtual machine (VM) in AWS, and use it like a physical hard drive.",
      ],
    },
    {
      kind: "p",
      text: "A volume can be the instance’s root volume, the system drive it starts from, or a data volume, such as a database’s storage. It must be in the instance’s Availability Zone, and it can outlive the instance.",
    },
  ],
  sections: [
    {
      id: "ebs-volume-types",
      title: "EBS volume types",
      blocks: [
        {
          kind: "p",
          text: "Volume types come in two groups: SSD-backed for transactional work, and HDD-backed for throughput-heavy work.",
        },
        {
          kind: "ul",
          items: [
            [
              "General Purpose SSD (solid-state drive): ",
              { a: "gp3", href: "/learn/glossary/ebs-gp3" },
              " and gp2.",
            ],
            "Provisioned IOPS SSD: io2 and io1.",
            "Throughput Optimized HDD (hard disk drive): st1.",
            "Cold HDD: sc1.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Amazon EBS volume types", href: "/learn/ebs-volume-types" },
            " compares their speed and price.",
          ],
        },
      ],
    },
    {
      id: "an-example-of-ebs-in-aws",
      title: "How EBS is charged",
      blocks: [
        {
          kind: "p",
          text: [
            "AWS charges each volume for the GB you provision, every month, until you delete it. The data you write doesn’t change the price. Our ",
            { a: "EBS pricing calculator", href: "/ebs-and-azure-disk-pricing" },
            " gives a volume’s monthly list price.",
          ],
        },
        {
          kind: "p",
          text: "Say a database runs on a 500\u00a0GiB gp3 data volume and writes 200\u00a0GiB. AWS charges for all 500\u00a0GiB.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: [
            { a: "Snapshots", href: "/learn/glossary/disk-snapshot" },
            ", point-in-time backups of a volume, are different: they’re charged by the data they hold.",
          ],
        },
      ],
    },
    {
      id: "delete-on-termination",
      title: "Delete on termination",
      blocks: [
        {
          kind: "p",
          text: "Each volume’s “Delete on termination” setting decides if it’s deleted with its instance. The defaults:",
        },
        {
          kind: "table",
          columns: [
            { label: "Volume", width: "24%" },
            { label: "Attached", width: "40%" },
            { label: "Default on termination", width: "36%" },
          ],
          rows: [
            ["Root volume", "At launch", "Deleted"],
            ["Root volume", "After launch", "Kept"],
            ["Data volume", "At launch, from the console", "Kept"],
            ["Data volume", "At launch, from the CLI", "Deleted"],
            ["Data volume", "After launch", "Kept"],
          ],
        },
        {
          kind: "p",
          text: "A kept volume is still charged until you delete it. You can change the setting at launch, overriding the Amazon Machine Image (AMI) default, or later on a running instance.",
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
            "You can grow a volume in place, then extend its file system.",
            "AWS says “You can’t decrease the volume size.” So you keep paying for an old peak’s size.",
            [
              "To ",
              { a: "shrink an EBS volume", href: "/learn/shrink-ebs-volume" },
              ", you copy its data to a new, smaller one.",
            ],
            [
              "To see how much of a volume holds data, ",
              { a: "check EBS volume usage", href: "/learn/check-ebs-volume-usage" },
              " inside the instance.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " moves a VM’s data disks onto one btrfs pool sized to your data, then rightsizes it autonomously. It works on EBS data volumes on Windows and Linux VMs, never the root volume. See ",
            { a: "EBS cost optimization", href: "/ebs-cost-optimization" },
            ".",
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Block storage",
      line: "The storage type it belongs to.",
      href: "/learn/glossary/block-storage",
    },
    {
      title: "Instance store",
      line: "Temporary storage on the instance’s host.",
      href: "/learn/glossary/instance-store",
    },
    {
      title: "Thin provisioning",
      line: "Space taken only as you write data.",
      href: "/learn/glossary/thin-provisioning",
    },
    {
      title: "Azure managed disk",
      line: "Azure’s matching drive.",
      href: "/learn/glossary/azure-managed-disk",
    },
  ],
  relatedTitle: "Related terms",
  next: {
    title: "How to shrink an EBS volume",
    href: "/learn/shrink-ebs-volume",
  },
  sources: [
    {
      publisher: "AWS",
      title: "“What is Amazon Elastic Block Store?”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/what-is-ebs.html",
    },
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
