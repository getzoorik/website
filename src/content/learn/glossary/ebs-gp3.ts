import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/ebs-gp3/1";

export const term: GlossaryTerm = {
  slug: "ebs-gp3",
  term: "gp3 (EBS General Purpose SSD)",
  title: "What is gp3 in AWS?",
  meta: "gp3 is a General Purpose SSD volume type in Amazon EBS. The IOPS and throughput every gp3 volume includes, its limits, and what more costs.",
  h1: "What is gp3 in AWS?",
  card: "gp3 is a General Purpose SSD (solid-state drive) volume type in Amazon Elastic Block Store (EBS).",
  group: "block-storage",
  product: "amoeba",
  published: "2026-10-26",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: [
        "gp3 is a General Purpose SSD (solid-state drive) volume type in ",
        { a: "Amazon Elastic Block Store (EBS)", href: "/learn/glossary/ebs-volume" },
        ". AWS calls it the lowest cost SSD volume in EBS. You set its speed apart from its size.",
      ],
    },
  ],
  sections: [
    {
      id: "what-a-gp3-ebs-volume-includes",
      title: "Included IOPS and throughput",
      blocks: [
        {
          kind: "p",
          text: "A gp3 volume can be 1 GiB to 64 TiB. At any size, the storage price includes:",
        },
        {
          kind: "ul",
          items: [
            [
              "3,000 ",
              { a: "IOPS", href: "/learn/glossary/iops" },
              ", or input/output operations per second.",
            ],
            [
              "125 MiB/s of ",
              { a: "throughput", href: "/learn/glossary/disk-throughput" },
              ", the data moved each second.",
            ],
          ],
        },
        {
          kind: "p",
          text: "gp3 doesn’t burst. A volume holds the speed you set with no time limit.",
        },
        { kind: "h3", id: "gp3-max-iops-and-throughput", title: "Max IOPS and throughput" },
        {
          kind: "ul",
          items: [
            "Up to 80,000 IOPS, at 500 IOPS per GiB. The maximum needs a volume of 160 GiB or more.",
            "Up to 2,000 MiB/s, at 0.25 MiB/s per provisioned IOPS. The maximum needs 8,000 IOPS or more.",
          ],
        },
      ],
    },
    {
      id: "an-example",
      title: "An example",
      blocks: [
        {
          kind: "p",
          text: "A database on a 100 GiB gp3 volume needs 6,000 IOPS.",
        },
        {
          kind: "ul",
          items: [
            "The volume stays at 100 GiB.",
            "3,000 IOPS come with the storage.",
            "The other 3,000 cost extra.",
          ],
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for cloud cost",
      blocks: [
        {
          kind: "p",
          text: [
            "AWS charges gp3 storage per GB you provision each month, used or not. Our ",
            { a: "EBS pricing calculator", href: "/ebs-and-azure-disk-pricing" },
            " gives a volume’s monthly list price.",
          ],
        },
        {
          kind: "ul",
          items: [
            "Extra IOPS and throughput are charged every month you keep them, even in quiet hours.",
            [
              "AWS says gp3 costs up to 20% less per GiB than ",
              { a: "gp2", href: "/learn/gp2-vs-gp3" },
              ".",
            ],
            [
              "To see how much of a volume holds data, ",
              { a: "check EBS volume usage", href: "/learn/check-ebs-volume-usage" },
              ".",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " moves a VM’s data disks onto one btrfs pool sized to your data, then rightsizes it autonomously. On AWS the pool uses gp3, with performance set from measured load.",
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "EBS volume",
      line: "Block storage for EC2 instances.",
      href: "/learn/glossary/ebs-volume",
    },
    { title: "IOPS", line: "Reads and writes per second.", href: "/learn/glossary/iops" },
    {
      title: "Disk throughput",
      line: "Data moved per second.",
      href: "/learn/glossary/disk-throughput",
    },
    {
      title: "Provisioned IOPS",
      line: "IOPS you set and pay for.",
      href: "/learn/glossary/provisioned-iops",
    },
  ],
  relatedTitle: "Related terms",
  next: { title: "gp2 vs gp3 on AWS", href: "/learn/gp2-vs-gp3" },
  sources: [
    {
      publisher: "AWS",
      title: "“Amazon EBS General Purpose SSD volumes”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/general-purpose.html",
    },
    {
      publisher: "AWS",
      title: "“Amazon EBS volume types”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html",
    },
    { publisher: "AWS", title: "“Amazon EBS pricing”", url: "https://aws.amazon.com/ebs/pricing/" },
  ],
};
