import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/ebs-volume/1";

export const term: GlossaryTerm = {
  slug: "ebs-volume",
  term: "EBS volume",
  title: "What is AWS EBS? Amazon EBS volumes explained",
  meta: "What is EBS in AWS? It’s Amazon Elastic Block Store: block storage for an EC2 instance. See how an EBS volume is charged, and why it can grow but never shrink.",
  h1: "What is AWS EBS? Amazon EBS volumes explained",
  card: "Amazon EBS is block storage for EC2 instances.",
  group: "block-storage",
  product: "amoeba",
  published: "2026-10-25",
  updated: "2026-11-02",
  definition: [
    {
      kind: "p",
      text: [
        "Amazon EBS is ",
        { a: "block storage", href: "/learn/glossary/block-storage" },
        " for EC2 instances. An EBS volume is a block-level storage device you attach to an instance, usually a virtual machine (VM). Once attached, it works like a physical hard drive.",
      ],
    },
    {
      kind: "p",
      text: "An EBS volume can be an EC2 instance’s root volume, the system drive it starts from, or a data volume for a database. It must share its instance’s Availability Zone.",
    },
  ],
  sections: [
    {
      id: "ebs-full-form-and-meaning-in-aws",
      title: "EBS full form and meaning in AWS",
      blocks: [
        {
          kind: "p",
          text: "EBS stands for Amazon Elastic Block Store. Elastic Block Store is the AWS block storage service, and an EBS volume is one drive it provides.",
        },
      ],
    },
    {
      id: "an-example-of-ebs-in-aws",
      title: "An example of an EBS volume in AWS",
      blocks: [
        {
          kind: "p",
          text: "Say your database runs on a 500\u00a0GiB gp3 data volume, a General Purpose SSD (solid-state drive). The database writes 200\u00a0GiB.",
        },
        { kind: "p", text: "AWS charges for all 500\u00a0GiB, not the 200\u00a0GiB written." },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "delete-on-termination",
      title: "Delete on termination: when a volume outlives its instance",
      blocks: [
        {
          kind: "p",
          text: "An EBS volume’s “Delete on termination” setting decides if it’s deleted with its instance.",
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
          text: "A kept volume is still charged until you delete it. You can change the setting at launch, overriding the default in the Amazon Machine Image (AMI), or later on a running instance.",
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why AWS EBS volumes matter for your cloud cost",
      blocks: [
        {
          kind: "p",
          text: [
            "EBS charges for each provisioned GB, every month, until you delete the volume. Our ",
            { a: "EBS pricing calculator", href: "/ebs-and-azure-disk-pricing" },
            " gives a volume’s monthly list price. To see how much of it holds data, ",
            { a: "check EBS volume usage", href: "/learn/check-ebs-volume-usage" },
            " inside the instance.",
          ],
        },
        {
          kind: "ul",
          items: [
            "You can grow a volume in place, then extend its file system.",
            "AWS says “You can’t decrease the volume size.” So you keep paying for an old peak’s size.",
            [
              "To ",
              { a: "shrink an EBS volume", href: "/learn/shrink-ebs-volume" },
              ", you copy the data to a new, smaller one.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " moves a VM’s data disks onto one btrfs pool sized to your data, then rightsizes it autonomously. It works on EBS data volumes on Windows and Linux VMs, never the root volume.",
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
    { title: "IOPS", line: "Input/output operations per second.", href: "/learn/glossary/iops" },
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
  next: {
    title: "How to shrink an EBS volume when AWS only lets it grow",
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
