import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/iops/1";

export const term: GlossaryTerm = {
  slug: "iops",
  term: "IOPS",
  title: "What is IOPS?",
  meta: "IOPS is how many reads and writes a disk handles each second. See how AWS and Azure count it, and why some disks tie that speed limit to their size.",
  h1: "What is IOPS?",
  card: "IOPS, short for input/output operations per second, is how many reads and writes a disk handles each second.",
  group: "block-storage",
  product: "amoeba",
  published: "2026-10-25",
  updated: "2026-10-26",
  definition: [
    {
      kind: "p",
      text: "IOPS, short for input/output operations per second, is how many reads and writes a disk handles each second. The IOPS meaning in storage is a rate of operations, not bytes. Every cloud disk has a limit.",
    },
    { kind: "p", text: "Go over it, and the disk makes each operation wait longer." },
  ],
  sections: [
    {
      id: "iops-in-aws-and-azure",
      title: "IOPS in AWS and Azure",
      blocks: [
        {
          kind: "p",
          text: "Amazon EBS counts up to 256\u00a0KiB as one operation on SSD volumes. For example:",
        },
        {
          kind: "ul",
          items: [
            "One 1,024\u00a0KiB operation counts as 4.",
            "Eight 32\u00a0KiB operations side by side on the disk merge into one, so they count as 1.",
            "Eight random 32\u00a0KiB operations count as 8.",
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: [
            "Azure Premium SSD also counts up to 256\u00a0KiB as one operation. Each Azure virtual machine (VM) has its own ",
            { a: "IOPS limit", href: "/learn/azure-disk-iops-vs-throughput" },
            ", which can hold a disk below the disk’s own limit.",
          ],
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for your cloud cost",
      blocks: [
        { kind: "p", text: "On some disks, the IOPS limit grows with size:" },
        {
          kind: "ul",
          items: [
            "gp2 gets a baseline of 3\u00a0IOPS per GiB, from 100 to 16,000.",
            "Premium SSD P10, at 128\u00a0GiB, gets 500 base IOPS, and P30, at 1,024\u00a0GiB, gets 5,000.",
          ],
        },
        {
          kind: "p",
          text: "Say your app needs 5,000\u00a0IOPS. It holds 100\u00a0GiB, but on one Premium SSD disk you’d pay for 1,024\u00a0GiB.",
        },
        {
          kind: "p",
          text: [
            "On gp3 and Premium SSD v2, you set ",
            { a: "provisioned IOPS", href: "/learn/glossary/provisioned-iops" },
            " apart from size.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " moves a VM’s data disks onto one pool sized to your data, then rightsizes it autonomously. It works on Azure managed disks and Amazon EBS volumes, on Windows and Linux VMs.",
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
      title: "Provisioned IOPS",
      line: "IOPS you set and pay for, apart from size.",
      href: "/learn/glossary/provisioned-iops",
    },
    {
      title: "Disk throughput",
      line: "The other speed limit.",
      href: "/learn/glossary/disk-throughput",
    },
    {
      title: "EBS volume",
      line: "The AWS disk, in volume types such as gp2 and gp3.",
      href: "/learn/glossary/ebs-volume",
    },
    {
      title: "Azure managed disks",
      line: "Azure’s disks.",
      href: "/learn/glossary/azure-managed-disk",
    },
  ],
  next: {
    title: "Azure disk IOPS vs throughput: what limits your disks",
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
