import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/provisioned-iops/1";

export const term: GlossaryTerm = {
  slug: "provisioned-iops",
  term: "Provisioned IOPS",
  title: "What is provisioned IOPS?",
  meta: "Provisioned IOPS is the disk performance you set and pay for, used or not. See how AWS and Azure bill it, with AWS’s own gp3 example in plain numbers.",
  h1: "What is provisioned IOPS?",
  card: "Provisioned IOPS is the disk performance you set and pay for, counted in input/output operations per second (IOPS).",
  group: "block-storage",
  product: "amoeba",
  published: "2026-10-25",
  updated: "2026-10-25",
  definition: [
    {
      kind: "p",
      text: "Provisioned IOPS is the disk performance you set and pay for, counted in input/output operations per second (IOPS). That’s the reads and writes a disk can do each second. You pay for that number, whether your app uses it or not.",
    },
  ],
  sections: [
    {
      id: "provisioned-iops-in-aws-and-azure",
      title: "Provisioned IOPS in AWS and Azure",
      blocks: [
        {
          kind: "ul",
          items: [
            "On AWS, io1 and io2 Block Express are the Provisioned IOPS SSD types. You pay for every IOPS you set.",
            "gp3 has EBS provisioned IOPS too: 3,000 come with the storage, and you pay for the rest.",
            "On Azure, Premium SSD v2 and Ultra Disk charge for size, IOPS and throughput separately.",
            "Premium SSD v2 gives 3,000\u00a0IOPS free.",
            "Premium SSD ties IOPS to size: a 4\u00a0TiB P50\u00a0disk gets 7,500 base IOPS.",
          ],
        },
      ],
    },
    {
      id: "an-example-from-aws",
      title: "An example from AWS",
      blocks: [
        {
          kind: "p",
          text: "AWS’s pricing page uses a 2,000\u00a0GB gp3\u00a0volume set to 10,000\u00a0IOPS.",
        },
        {
          kind: "ul",
          items: ["3,000\u00a0IOPS come free.", "The other 7,000 are billed as extra."],
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
            "Set IOPS for your busiest hour, and you pay that level in quiet hours too.",
            "Your virtual machine (VM) caps IOPS too. IOPS above its limit are billed but never reached.",
            "You can change IOPS on a running disk on AWS, Premium SSD v2 and Ultra Disk. Azure allows four changes per disk in 24\u00a0hours.",
            [
              "Before you choose io2, read ",
              { a: "when more IOPS are worth the price", href: "/learn/io2-vs-gp3" },
              ".",
            ],
            [
              "For disk size, ",
              { a: "Amoeba", href: "/amoeba" },
              " moves a VM’s data disks onto one pool sized to your data, then rightsizes it autonomously.",
            ],
            [
              "The ",
              { a: "free assessment", href: "/assessment?p=amoeba" },
              " works out your own figure.",
            ],
          ],
        },
      ],
    },
  ],
  related: [
    { title: "IOPS", line: "The unit itself, on any disk.", href: "/learn/glossary/iops" },
    {
      title: "Azure managed disks",
      line: "Azure’s five disk types, Standard HDD to Ultra Disk.",
      href: "/learn/glossary/azure-managed-disk",
    },
    { title: "EBS volume", line: "The AWS disk.", href: "/learn/glossary/ebs-volume" },
    {
      title: "Disk throughput",
      line: "The other speed limit, in data moved per second.",
      href: "/learn/glossary/disk-throughput",
    },
  ],
  next: {
    title: "io2 vs gp3: when Provisioned IOPS is worth the price",
    href: "/learn/io2-vs-gp3",
  },
  sources: [
    {
      publisher: "AWS",
      title: "“Amazon EBS Provisioned IOPS SSD volumes”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/provisioned-iops.html",
    },
    {
      publisher: "AWS",
      title: "“Amazon EBS General Purpose SSD volumes”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/general-purpose.html",
    },
    { publisher: "AWS", title: "“Amazon EBS pricing”", url: "https://aws.amazon.com/ebs/pricing/" },
    {
      publisher: "Microsoft Learn",
      title: "“Select a disk type for Azure IaaS VMs”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-types",
    },
  ],
};
