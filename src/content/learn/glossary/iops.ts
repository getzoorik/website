import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/iops/1";

export const term: GlossaryTerm = {
  slug: "iops",
  term: "IOPS",
  title: "What is IOPS? Full form and meaning",
  meta: "IOPS full form: input/output operations per second, the reads and writes a disk handles each second. How AWS and Azure count IOPS, and how to calculate it.",
  h1: "What is IOPS? Full form and meaning",
  card: "IOPS stands for input/output operations per second.",
  group: "block-storage",
  product: "amoeba",
  published: "2026-10-25",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: "IOPS stands for input/output operations per second. It counts the reads and writes a disk handles each second, not the bytes they move.",
    },
    {
      kind: "p",
      text: "Every cloud disk has an IOPS limit. Push past it, and each operation waits longer.",
    },
  ],
  sections: [
    {
      id: "iops-in-aws-and-azure",
      title: "IOPS in AWS and Azure",
      blocks: [
        { kind: "h3", id: "what-is-iops-in-aws", title: "IOPS in AWS" },
        {
          kind: "p",
          text: "Amazon EBS counts an operation of up to 256\u00a0KiB as one on SSD volumes, and up to 1,024\u00a0KiB on HDD volumes. SSD volumes handle small or random I/O far better than HDD volumes, which do best with large, sequential I/O. On SSD volumes:",
        },
        {
          kind: "ul",
          items: [
            "One 1,024\u00a0KiB operation counts as 4.",
            "Eight sequential 32\u00a0KiB operations merge into one, so they count as 1.",
            "Eight random 32\u00a0KiB operations count as 8.",
          ],
        },
        { kind: "svg", figure: figure1 },
        { kind: "h3", id: "what-is-iops-in-azure", title: "IOPS in Azure" },
        {
          kind: "p",
          text: "Azure Premium SSD and Standard SSD also count an operation of up to 256\u00a0KiB as one. A larger operation counts as several 256\u00a0KiB ones.",
        },
        {
          kind: "p",
          text: [
            "Each Azure virtual machine (VM) size has its own ",
            { a: "IOPS limit", href: "/learn/azure-disk-iops-vs-throughput" },
            " too. In Microsoft’s example, a DS1 VM holds a P30 disk, rated at 5,000\u00a0IOPS, to 3,200\u00a0IOPS.",
          ],
        },
      ],
    },
    {
      id: "how-to-calculate-the-iops-you-need",
      title: "How to calculate IOPS",
      blocks: [
        {
          kind: "p",
          text: "IOPS is throughput divided by I/O size. In Microsoft’s example, a P30 disk at 5,000\u00a0IOPS with 8\u00a0KB operations moves 40\u00a0MB/s. With 1,024\u00a0KB operations, it reaches its 200\u00a0MB/s limit at 200\u00a0IOPS.",
        },
        {
          kind: "p",
          text: [
            "To see the IOPS an EBS volume really uses, check its CloudWatch metric ",
            { code: "VolumeAvgIOPS" },
            ". It gives the average for each minute.",
          ],
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for cloud cost",
      blocks: [
        { kind: "p", text: "On some disks, the IOPS limit grows with size:" },
        {
          kind: "ul",
          items: [
            "gp2 gets 3\u00a0IOPS per GiB, from 100 to 16,000.",
            "Premium SSD P10, at 128\u00a0GiB, gets 500 base IOPS, and P30, at 1,024\u00a0GiB, gets 5,000.",
          ],
        },
        {
          kind: "p",
          text: "Say your app needs 5,000\u00a0IOPS but holds 100\u00a0GiB. On one Premium SSD disk, you’d pay for 1,024\u00a0GiB.",
        },
        {
          kind: "p",
          text: [
            "gp3 and Premium SSD v2 include 3,000\u00a0IOPS at any size, and you can set more as ",
            { a: "provisioned IOPS", href: "/learn/glossary/provisioned-iops" },
            ". The ",
            { a: "EBS and Azure disk pricing calculator", href: "/ebs-and-azure-disk-pricing" },
            " shows each disk’s IOPS and monthly list price.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " moves a VM’s data disks onto one pool sized to your data, and sets the pool’s IOPS from the VM’s measured load. It then rightsizes the pool autonomously, without any downtime, on Azure and AWS, for Windows and Linux VMs.",
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Provisioned IOPS",
      line: "IOPS you set and pay for, apart from size.",
      href: "/learn/glossary/provisioned-iops",
    },
    {
      title: "Disk throughput",
      line: "The other speed limit: bytes per second.",
      href: "/learn/glossary/disk-throughput",
    },
    {
      title: "EBS volume",
      line: "The AWS disk, in volume types such as gp2 and gp3.",
      href: "/learn/glossary/ebs-volume",
    },
    {
      title: "Azure managed disks",
      line: "Azure’s block storage for VMs.",
      href: "/learn/glossary/azure-managed-disk",
    },
  ],
  relatedTitle: "Related terms",
  next: {
    title: "Azure disk IOPS vs throughput",
    href: "/learn/azure-disk-iops-vs-throughput",
  },
  sources: [
    {
      publisher: "AWS",
      title: "“Amazon EBS I/O characteristics and monitoring”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-io-characteristics.html",
    },
    {
      publisher: "AWS",
      title: "“Amazon EBS General Purpose SSD volumes”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/general-purpose.html",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Azure premium storage: Design for high performance”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/premium-storage-performance",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Select a disk type for Azure IaaS VMs”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-types",
    },
  ],
};
