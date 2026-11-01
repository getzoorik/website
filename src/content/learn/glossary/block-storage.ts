import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/block-storage/1";

export const term: GlossaryTerm = {
  slug: "block-storage",
  term: "Block storage",
  title: "What is block storage?",
  meta: "Block storage, or block-level storage, is the disk you attach to a cloud VM. See how Azure and AWS charge for it by size, and block storage vs object storage.",
  h1: "What is block storage?",
  card: "Block storage, or block-level storage, is storage that a server uses as a disk.",
  group: "block-storage",
  product: "amoeba",
  published: "2026-10-25",
  updated: "2026-11-01",
  definition: [
    {
      kind: "p",
      text: "Block storage, or block-level storage, is storage that a server uses as a disk. You pick its size and attach it to a cloud virtual machine (VM). It works like a local hard drive.",
    },
  ],
  sections: [
    {
      id: "block-storage-in-aws-and-azure",
      title: "Cloud block storage on AWS and Azure",
      blocks: [
        {
          kind: "p",
          text: "Block storage in cloud computing is a disk you rent: Amazon Elastic Block Store (EBS) volumes on AWS, managed disks on Azure.",
        },
        { kind: "p", text: "Each Azure VM has these disks:" },
        {
          kind: "ul",
          items: [
            "One operating system disk (OS disk), which the VM starts from.",
            "Data disks you add, for your apps and data.",
            [
              "On most VMs, a ",
              { a: "temporary disk", href: "/learn/glossary/azure-temporary-disk" },
              ", which isn’t a managed disk and can lose data.",
            ],
          ],
        },
      ],
    },
    {
      id: "block-storage-vs-object-storage",
      title: "Block storage vs object storage",
      blocks: [
        {
          kind: "p",
          text: "Object storage, such as Amazon S3, stores each file and its metadata as an object in a bucket. Apps fetch an object by its key, its unique name in the bucket, through a web API.",
        },
        {
          kind: "p",
          text: "Costs differ too. A disk charges for the size you provision, full or not. Amazon S3 charges only for what you actually use.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why block storage matters for your cloud cost",
      blocks: [
        {
          kind: "p",
          text: "Microsoft’s pricing example is a 1\u00a0TiB Standard SSD (solid-state drive) holding 120\u00a0GiB of data. You pay for all 1\u00a0TiB.",
        },
        {
          kind: "ul",
          items: [
            [
              "Sizing a disk to its data, called ",
              { a: "rightsizing", href: "/learn/glossary/rightsizing" },
              ", can reduce that cost.",
            ],
            [
              { a: "Amoeba", href: "/amoeba" },
              " moves a VM’s data disks onto one pool sized to your data, then rightsizes it autonomously. It never touches the OS disk or root volume.",
            ],
            "It works on Azure managed disks and Amazon EBS volumes, on Windows and Linux VMs.",
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
    { title: "EBS volume", line: "Block storage on AWS.", href: "/learn/glossary/ebs-volume" },
    {
      title: "Azure managed disk",
      line: "Block storage on Azure.",
      href: "/learn/glossary/azure-managed-disk",
    },
    {
      title: "IOPS",
      line: "Input/output operations per second, a disk’s rate of reads and writes.",
      href: "/learn/glossary/iops",
    },
    {
      title: "Disk throughput",
      line: "Data moved per second.",
      href: "/learn/glossary/disk-throughput",
    },
  ],
  next: { title: "Azure disk cost optimization", href: "/learn/azure-disk-reservations" },
  sources: [
    {
      publisher: "Amazon Web Services",
      title: "“What is Amazon Elastic Block Store?”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/what-is-ebs.html",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Overview of Azure Disk Storage”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/managed-disks-overview",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Understand Azure Disk Storage billing”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-understand-billing",
    },
    {
      publisher: "Amazon Web Services",
      title: "“What is Amazon S3?”",
      url: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html",
    },
  ],
};
