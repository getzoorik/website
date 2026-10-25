import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/disk-throughput/1";

export const term: GlossaryTerm = {
  slug: "disk-throughput",
  term: "Disk throughput",
  title: "What is disk throughput?",
  meta: "Disk throughput is how much data a disk reads and writes each second. See how disk size, gp3 and Premium SSD v2 set it, and why it can raise your bill.",
  h1: "What is disk throughput?",
  card: "Disk throughput is the amount of data a disk reads and writes each second.",
  group: "block-storage",
  product: "amoeba",
  published: "2026-10-25",
  updated: "2026-10-25",
  definition: [
    {
      kind: "p",
      text: "Disk throughput is the amount of data a disk reads and writes each second. AWS gives it in mebibytes per second (MiB/s), and Azure in megabytes per second (MB/s). It’s also called storage throughput or disk input/output (I/O) throughput.",
    },
    {
      kind: "p",
      text: [
        "Throughput is the size of each operation times ",
        { a: "input/output operations per second (IOPS)", href: "/learn/glossary/iops" },
        ". Your virtual machine (VM) has its own limit too, and the smaller one wins.",
      ],
    },
  ],
  sections: [
    {
      id: "an-example-from-aws",
      title: "An example from AWS",
      blocks: [
        {
          kind: "p",
          text: "AWS’s example uses a gp2\u00a0volume with burst credits, limited to 3,000\u00a0IOPS and 250\u00a0MiB/s:",
        },
        {
          kind: "ul",
          items: [
            "With 256\u00a0KiB operations, it hits 250\u00a0MiB/s at 1,000\u00a0IOPS.",
            "With 16\u00a0KiB ones, it runs all 3,000\u00a0IOPS at about 47\u00a0MiB/s.",
          ],
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "why-it-matters-for-your-bill",
      title: "Why it matters for your bill",
      blocks: [
        { kind: "p", text: "On some disks, throughput grows with size:" },
        {
          kind: "ul",
          items: [
            "A gp2\u00a0volume of up to 170\u00a0GiB gets 128\u00a0MiB/s at most. It needs 334\u00a0GiB for a steady 250\u00a0MiB/s.",
            "A 128\u00a0GiB Premium SSD (P10) has a base of 100\u00a0MB/s, and a 1,024\u00a0GiB P30 has 200\u00a0MB/s.",
          ],
        },
        {
          kind: "p",
          text: [
            "So you may pay for space you don’t need, just for speed. Check ",
            { a: "both limits", href: "/learn/azure-disk-iops-vs-throughput" },
            " before you buy a bigger disk.",
          ],
        },
        {
          kind: "p",
          text: "A gp3\u00a0volume includes 125\u00a0MiB/s of EBS volume throughput, and Premium SSD v2 includes 125\u00a0MB/s. More costs extra on both.",
        },
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " moves a VM’s data disks onto one pool sized to your data, then rightsizes it autonomously. Each gp3\u00a0volume in the pool gets at least 3,000\u00a0IOPS and 125\u00a0MiB/s, and more when the VM’s measured load needs it.",
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
      title: "Azure managed disks",
      line: "From Standard HDD to Ultra Disk.",
      href: "/learn/glossary/azure-managed-disk",
    },
    { title: "IOPS", line: "The other speed limit.", href: "/learn/glossary/iops" },
    { title: "EBS volume", line: "The AWS disk.", href: "/learn/glossary/ebs-volume" },
    {
      title: "Provisioned IOPS",
      line: "Disk performance you set and pay for, used or not.",
      href: "/learn/glossary/provisioned-iops",
    },
  ],
  next: {
    title: "Azure disk IOPS vs throughput: what limits your disks",
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
