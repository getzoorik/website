import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/block-storage/1";

export const term: GlossaryTerm = {
  slug: "block-storage",
  term: "Block storage",
  title: "What is block storage?",
  meta: "Block storage is storage a server uses as a disk, such as Amazon EBS and Azure managed disks. Block vs object vs file storage, and how it’s charged.",
  h1: "What is block storage?",
  card: "Block storage, also called block-level or block data storage, is storage a server uses as a disk.",
  group: "block-storage",
  product: "amoeba",
  published: "2026-10-25",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: "Block storage, also called block-level or block data storage, is storage a server uses as a disk. It splits data into blocks of equal size and finds each block by its own identifier.",
    },
  ],
  sections: [
    {
      id: "block-storage-in-aws-and-azure",
      title: "Cloud block storage",
      blocks: [
        {
          kind: "p",
          text: "In the cloud, block storage is a disk you rent, size and attach to a virtual machine (VM).",
        },
        {
          kind: "p",
          text: "On AWS, it’s an Amazon Elastic Block Store (EBS) volume, which an EC2 instance uses like a hard drive. On Azure, it’s a managed disk.",
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
      title: "Block vs object storage",
      blocks: [
        {
          kind: "p",
          text: "Object storage, such as Amazon S3 or Azure Blob Storage, keeps each file and its metadata as an object. Apps fetch it over HTTP by its unique key.",
        },
        {
          kind: "p",
          text: "Amazon S3 charges only for the storage you use. An EBS volume or Azure disk is charged for its provisioned size.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "block-vs-file-vs-object-storage",
      title: "Block vs file storage",
      blocks: [
        {
          kind: "p",
          text: "File storage is a shared file system that many machines mount over the network, such as Amazon Elastic File System (EFS) or Azure Files. A block volume usually serves one VM.",
        },
        {
          kind: "p",
          text: "Block storage isn’t a file system on its own. A new EBS volume is a raw block device, so you create a file system on it before you mount it.",
        },
        {
          kind: "table",
          columns: [
            { label: "Type", width: "16%" },
            { label: "Keeps data as", width: "24%" },
            { label: "Used through", width: "32%" },
            { label: "Examples", width: "28%" },
          ],
          rows: [
            [
              "Block",
              "Blocks of equal size",
              "A file system on the VM it’s attached to",
              "Amazon EBS, Azure managed disks",
            ],
            [
              "File",
              "Files in folders",
              "A network share many machines mount",
              "Amazon EFS, Azure Files",
            ],
            [
              "Object",
              "Objects with metadata",
              "An HTTP API, by key",
              "Amazon S3, Azure Blob Storage",
            ],
          ],
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Block storage and cloud cost",
      blocks: [
        {
          kind: "p",
          text: "You pay for a disk’s provisioned size, not the data on it. Microsoft’s example is a 1 TiB Standard SSD (solid-state drive) holding 120 GiB of data. You pay for all 1 TiB.",
        },
        {
          kind: "ul",
          items: [
            [
              "Sizing a disk to its data, called ",
              { a: "rightsizing", href: "/learn/glossary/rightsizing" },
              ", reduces that cost.",
            ],
            [
              { a: "Amoeba", href: "/amoeba" },
              " moves a VM’s data disks onto one btrfs pool sized to your data, then rightsizes it without any downtime. It never touches the OS disk or root volume.",
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
      line: "A disk’s reads and writes per second.",
      href: "/learn/glossary/iops",
    },
    {
      title: "Disk throughput",
      line: "Data moved per second.",
      href: "/learn/glossary/disk-throughput",
    },
  ],
  relatedTitle: "Related terms",
  next: { title: "EBS and Azure disk pricing calculator", href: "/ebs-and-azure-disk-pricing" },
  sources: [
    {
      publisher: "Amazon Web Services",
      title: "“What is block storage?”",
      url: "https://aws.amazon.com/what-is/block-storage/",
    },
    {
      publisher: "Amazon Web Services",
      title: "“What is Amazon Elastic Block Store?”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/what-is-ebs.html",
    },
    {
      publisher: "Amazon Web Services",
      title: "“Amazon EBS volumes”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volumes.html",
    },
    {
      publisher: "Amazon Web Services",
      title: "“Make an Amazon EBS volume available for use”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-using-volumes.html",
    },
    {
      publisher: "Amazon Web Services",
      title: "“What is Amazon S3?”",
      url: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html",
    },
    {
      publisher: "Amazon Web Services",
      title: "“What is Amazon Elastic File System?”",
      url: "https://docs.aws.amazon.com/efs/latest/ug/whatisefs.html",
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
      publisher: "Microsoft Learn",
      title: "“Introduction to Azure Storage”",
      url: "https://learn.microsoft.com/en-us/azure/storage/common/storage-introduction",
    },
  ],
};
