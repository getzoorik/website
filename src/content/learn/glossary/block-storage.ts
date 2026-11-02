import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/block-storage/1";

export const term: GlossaryTerm = {
  slug: "block-storage",
  term: "Block storage",
  title: "What is block storage?",
  meta: "Block storage, also called block-level or block data storage, is the disk a cloud VM uses. See how AWS and Azure charge for it, and block vs object storage.",
  h1: "What is block storage?",
  card: "Block storage, also called block-level or block-based storage, is storage a server uses as a disk.",
  group: "block-storage",
  product: "amoeba",
  published: "2026-10-25",
  updated: "2026-11-02",
  definition: [
    {
      kind: "p",
      text: "Block storage, also called block-level or block-based storage, is storage a server uses as a disk. In the cloud, you size it and attach it to a virtual machine (VM).",
    },
  ],
  sections: [
    {
      id: "block-storage-in-aws-and-azure",
      title: "Cloud block storage on AWS and Azure",
      blocks: [
        {
          kind: "p",
          text: "Block storage in cloud computing is a disk you rent from your cloud’s block storage service and attach to a VM.",
        },
        {
          kind: "p",
          text: "On AWS, that’s Amazon Elastic Block Store (EBS), whose volumes are block-level storage for EC2 instances. On Azure, it’s managed disks.",
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
          text: "Object storage, such as Amazon S3 or Azure Blob Storage, keeps each file and its metadata as an object. Apps fetch it through a web API by its unique key.",
        },
        {
          kind: "p",
          text: "Cost shows the difference between block storage and object storage. An EBS volume or Azure disk is charged for its provisioned size, and Amazon S3 only for what you use.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "block-vs-file-vs-object-storage",
      title: "Block vs file vs object storage",
      blocks: [
        {
          kind: "p",
          text: "In block vs file storage, sharing sets the two apart. File storage is a shared file system that many machines mount at once, such as Amazon Elastic File System (EFS) or Azure Files. A block storage volume usually serves one VM.",
        },
        {
          kind: "p",
          text: "Block storage isn’t a file system on its own. AWS says new volumes are raw block devices, and you must create a file system on them before you can mount and use them.",
        },
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
              " moves a VM’s data disks onto one btrfs pool sized to your data, then rightsizes it autonomously. It never touches the OS disk or root volume.",
            ],
            "It works on Azure managed disks and Amazon EBS volumes, on Windows and Linux VMs.",
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
  next: { title: "Azure disk reservations", href: "/learn/azure-disk-reservations" },
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
    {
      publisher: "Amazon Web Services",
      title: "“Amazon EBS volumes”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volumes.html",
    },
    {
      publisher: "Amazon Web Services",
      title: "“What is Amazon Elastic File System?”",
      url: "https://docs.aws.amazon.com/efs/latest/ug/whatisefs.html",
    },
    {
      publisher: "Amazon Web Services",
      title: "“Make an Amazon EBS volume available for use”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-using-volumes.html",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Introduction to Azure Storage”",
      url: "https://learn.microsoft.com/en-us/azure/storage/common/storage-introduction",
    },
  ],
};
