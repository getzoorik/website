import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/disk-latency/1";

export const term: GlossaryTerm = {
  slug: "disk-latency",
  term: "Disk latency",
  title: "What is disk latency?",
  meta: "Disk latency is how long one read or write takes. See the latency Azure designs each disk type for, how AWS reports EBS latency, and what a high one can mean.",
  h1: "What is disk latency?",
  card: "Disk latency is how long one read or write takes to finish.",
  group: "block-storage",
  product: "amoeba",
  published: "2026-10-26",
  updated: "2026-10-27",
  definition: [
    {
      kind: "p",
      text: "Disk latency is how long one read or write takes to finish. The clock runs from sending the request until the disk confirms it’s done. You’ll usually see it in milliseconds (ms).",
    },
    { kind: "svg", figure: figure1 },
    {
      kind: "p",
      text: [
        "It’s also called storage latency or input/output (I/O) latency. ",
        { a: "I/O operations per second (IOPS)", href: "/learn/glossary/iops" },
        " counts the operations, and latency is the time each one takes.",
      ],
    },
  ],
  sections: [
    {
      id: "azure-disk-latency-and-ebs-latency",
      title: "Azure disk latency and EBS latency",
      blocks: [
        { kind: "p", text: "Each Azure disk type has a design target:" },
        {
          kind: "ul",
          items: [
            [
              { a: "Standard HDD", href: "/learn/glossary/azure-standard-hdd" },
              ": writes under 10\u00a0ms and reads under 20\u00a0ms, for most operations.",
            ],
            [
              "Standard SSD and ",
              { a: "Premium SSD", href: "/learn/glossary/azure-premium-ssd" },
              ": single-digit milliseconds.",
            ],
            [
              "Premium SSD v2 and ",
              { a: "Ultra Disk", href: "/learn/glossary/azure-ultra-disk" },
              ": under 1\u00a0ms.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "On AWS, CloudWatch reports average EBS latency per minute for volumes on Nitro-based instances, as ",
            { code: "VolumeAvgReadLatency" },
            " and ",
            { code: "VolumeAvgWriteLatency" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "There’s no single acceptable disk latency. Transaction-heavy apps, such as databases, are sensitive to it. Apps that stream large files care less.",
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for your cloud cost",
      blocks: [
        {
          kind: "p",
          text: [
            "Disk types differ in latency and price. But high latency can also mean a disk or VM is at its limit. Check ",
            { a: "both limits", href: "/learn/azure-disk-iops-vs-throughput" },
            " before you change type:",
          ],
        },
        {
          kind: "ul",
          items: [
            "Ask a disk for more IOPS or throughput than it allows, and latency can rise.",
            "The VM has its own limits too.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " moves a VM’s data disks onto one btrfs pool sized to your data, with room to grow. Then it rightsizes the pool, so you pay for close to what you use.",
          ],
        },
        {
          kind: "p",
          text: "Amoeba copies your data while your services run. If disk latency rises too high during the copy, Amoeba slows the copy.",
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
    { title: "IOPS", line: "Operations a disk handles each second.", href: "/learn/glossary/iops" },
    {
      title: "Disk throughput",
      line: "Bytes a disk moves each second.",
      href: "/learn/glossary/disk-throughput",
    },
    {
      title: "Provisioned IOPS",
      line: "IOPS you set apart from size.",
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
      title: "“Amazon EBS I/O characteristics and monitoring”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-io-characteristics.html",
    },
    {
      publisher: "AWS",
      title: "“Amazon CloudWatch metrics for Amazon EBS”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/using_cloudwatch_ebs.html",
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
