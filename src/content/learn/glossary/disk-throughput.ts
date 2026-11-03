import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/disk-throughput/1";

export const term: GlossaryTerm = {
  slug: "disk-throughput",
  term: "Disk throughput",
  title: "What is disk throughput (I/O speed)?",
  meta: "Disk throughput is a disk’s I/O speed in bytes: the data it reads and writes each second. How it relates to IOPS, and how it shapes disk cost.",
  h1: "What is disk throughput (I/O speed)?",
  card: "Disk throughput is the amount of data a disk reads and writes each second.",
  group: "block-storage",
  product: "amoeba",
  published: "2026-10-25",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: "Disk throughput is the amount of data a disk reads and writes each second. It’s the disk’s input/output (I/O) speed in bytes. AWS gives it in mebibytes per second (MiB/s), Azure in megabytes per second (MB/s).",
    },
    {
      kind: "p",
      text: [
        "Throughput is ",
        { a: "IOPS", href: "/learn/glossary/iops" },
        ", the I/O operations per second, times the size of each operation. Your virtual machine (VM) has a throughput limit too, and the smaller limit applies. ",
        { a: "Latency", href: "/learn/glossary/disk-latency" },
        ", the time each operation takes, is the third measure of disk speed.",
      ],
    },
  ],
  sections: [
    {
      id: "an-example-from-aws",
      title: "An AWS example",
      blocks: [
        {
          kind: "p",
          text: "AWS’s example is a gp2\u00a0volume with burst credits, limited to 3,000\u00a0IOPS and 250\u00a0MiB/s:",
        },
        {
          kind: "ul",
          items: [
            "With 256\u00a0KiB operations, it reaches 250\u00a0MiB/s at 1,000\u00a0IOPS.",
            "With 16\u00a0KiB operations, it runs all 3,000\u00a0IOPS at about 47\u00a0MiB/s.",
          ],
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for cloud cost",
      blocks: [
        { kind: "p", text: "On some disks, throughput grows with size:" },
        {
          kind: "ul",
          items: [
            "A gp2\u00a0volume of 170\u00a0GiB or less gets 128\u00a0MiB/s at most. It needs 334\u00a0GiB for a steady 250\u00a0MiB/s.",
            "A 128\u00a0GiB Premium SSD (P10) gets 100\u00a0MB/s, and a 1,024\u00a0GiB P30 gets 200\u00a0MB/s.",
          ],
        },
        {
          kind: "p",
          text: "So you can pay for space you don’t need, just to get speed.",
        },
        {
          kind: "p",
          text: "gp3 and Premium SSD v2 let you set throughput independently of size. gp3 includes 125\u00a0MiB/s and Premium SSD v2 125\u00a0MB/s, and more costs extra.",
        },
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " moves a VM’s data disks onto one btrfs pool sized to your data, then rightsizes it autonomously. It gives the pool the IOPS and throughput the VM’s measured load needs.",
          ],
        },
      ],
    },
  ],
  related: [
    { title: "IOPS", line: "The other speed limit.", href: "/learn/glossary/iops" },
    {
      title: "Disk latency",
      line: "How long each operation takes.",
      href: "/learn/glossary/disk-latency",
    },
    {
      title: "Provisioned IOPS",
      line: "Disk performance you set and pay for, used or not.",
      href: "/learn/glossary/provisioned-iops",
    },
    {
      title: "Azure managed disks",
      line: "From Standard HDD to Ultra Disk.",
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
      title: "“Amazon EBS General Purpose SSD volumes”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/general-purpose.html",
    },
    {
      publisher: "AWS",
      title: "“Amazon EBS I/O characteristics and monitoring”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-io-characteristics.html",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Select a disk type for Azure IaaS VMs”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-types",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Azure premium storage: Design for high performance”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/premium-storage-performance",
    },
  ],
};
