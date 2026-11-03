import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/provisioned-iops/1";

export const term: GlossaryTerm = {
  slug: "provisioned-iops",
  term: "Provisioned IOPS",
  title: "What is provisioned IOPS (PIOPS)?",
  meta: "Provisioned IOPS (PIOPS) is disk performance you set and pay for, used or not. How it works on AWS io1, io2 and gp3, and on Azure disks.",
  h1: "What is provisioned IOPS (PIOPS)?",
  card: "Provisioned IOPS (PIOPS) is disk performance you set and pay for, counted in input/output operations per second (IOPS).",
  group: "block-storage",
  product: "amoeba",
  published: "2026-10-25",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: "Provisioned IOPS (PIOPS) is disk performance you set and pay for, counted in input/output operations per second (IOPS). That’s the reads and writes a disk can do each second. You pay for the number you set, whether your app uses it or not.",
    },
  ],
  sections: [
    {
      id: "provisioned-iops-in-aws-and-azure",
      title: "PIOPS on AWS and Azure",
      blocks: [
        { kind: "h3", id: "provisioned-iops-on-aws", title: "On AWS" },
        {
          kind: "ul",
          items: [
            "io1 and io2 Block Express are the Provisioned IOPS SSD volume types. You pay for every IOPS you set.",
            "io1 takes up to 64,000\u00a0IOPS, at most 50 per GiB.",
            "io2 Block Express takes up to 256,000\u00a0IOPS, at most 1,000 per GiB.",
            [
              { a: "gp3", href: "/learn/glossary/ebs-gp3" },
              " includes 3,000\u00a0IOPS with the storage. You can set up to 80,000 and pay for the rest.",
            ],
          ],
        },
        { kind: "svg", figure: figure1 },
        { kind: "h3", id: "provisioned-iops-on-azure", title: "On Azure" },
        {
          kind: "ul",
          items: [
            "Premium SSD v2 and Ultra Disk charge for size, IOPS and throughput separately.",
            "Premium SSD v2 includes 3,000\u00a0IOPS free, and you can set up to 80,000.",
            [
              { a: "Ultra Disk", href: "/learn/glossary/azure-ultra-disk" },
              " goes up to 400,000\u00a0IOPS.",
            ],
            "Premium SSD ties IOPS to size: a 4\u00a0TiB P50 disk gets 7,500 base IOPS.",
          ],
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
            "Set IOPS for your busiest hour, and you pay that level in quiet hours too.",
            "Your virtual machine (VM) has its own IOPS limit. IOPS you set above it are charged but never reached.",
            "You can change IOPS on a running disk on AWS, Premium SSD v2 and Ultra Disk. Azure allows four changes per disk in 24\u00a0hours.",
            [
              "For disk size, ",
              { a: "Amoeba", href: "/amoeba" },
              " moves a VM’s data disks onto one btrfs pool sized to your data, then rightsizes it autonomously, without any downtime.",
            ],
          ],
        },
      ],
    },
  ],
  related: [
    { title: "IOPS", line: "The unit itself, on any disk.", href: "/learn/glossary/iops" },
    {
      title: "EBS gp3",
      line: "Includes 3,000 IOPS at any size.",
      href: "/learn/glossary/ebs-gp3",
    },
    {
      title: "Azure Ultra Disk",
      line: "Size, IOPS and throughput, each set separately.",
      href: "/learn/glossary/azure-ultra-disk",
    },
    {
      title: "Disk throughput",
      line: "The other speed limit: bytes per second.",
      href: "/learn/glossary/disk-throughput",
    },
  ],
  relatedTitle: "Related terms",
  next: {
    title: "io2 vs gp3: when io2 is worth it",
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
