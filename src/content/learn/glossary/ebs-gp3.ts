import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/ebs-gp3/1";

export const term: GlossaryTerm = {
  slug: "ebs-gp3",
  term: "gp3 (EBS General Purpose SSD)",
  title: "What is gp3 in AWS?",
  meta: "gp3 in AWS is a General Purpose SSD type of EBS volume. See the IOPS and throughput every volume includes at any size, and how AWS charges for more.",
  h1: "What is gp3 in AWS?",
  card: "gp3 in AWS is a General Purpose SSD (solid-state drive) volume type in Amazon Elastic Block Store (EBS).",
  group: "block-storage",
  product: "amoeba",
  published: "2026-10-26",
  updated: "2026-11-01",
  definition: [
    {
      kind: "p",
      text: "gp3 in AWS is a General Purpose SSD (solid-state drive) volume type in Amazon Elastic Block Store (EBS). AWS calls it the lowest cost SSD volume in EBS. You set its speed apart from its size.",
    },
  ],
  sections: [
    {
      id: "what-a-gp3-ebs-volume-includes",
      title: "gp3 IOPS and throughput: what every volume includes",
      blocks: [
        {
          kind: "p",
          text: "Sizes run from 1\u00a0GiB to 64\u00a0TiB. At any size, the storage price includes:",
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
              "125\u00a0MiB/s of ",
              { a: "throughput", href: "/learn/glossary/disk-throughput" },
              ", the data moved each second.",
            ],
          ],
        },
        {
          kind: "p",
          text: "You can pay for up to 80,000\u00a0IOPS and 2,000\u00a0MiB/s. Past 3,000\u00a0IOPS, a volume needs 1\u00a0GiB per 500\u00a0IOPS.",
        },
        {
          kind: "p",
          text: "A gp3\u00a0volume doesn’t burst. It can hold the speed you set with no time limit.",
        },
      ],
    },
    {
      id: "an-example",
      title: "An example",
      blocks: [
        {
          kind: "p",
          text: "Say a database on a 100\u00a0GiB gp3\u00a0volume in AWS needs 6,000\u00a0IOPS.",
        },
        {
          kind: "ul",
          items: [
            "The volume stays at 100\u00a0GiB.",
            "3,000\u00a0IOPS come with the storage.",
            "The other 3,000 cost extra.",
          ],
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for your cloud cost",
      blocks: [
        {
          kind: "p",
          text: [
            "gp3 storage in AWS is priced per GB you provision each month, used or not. Our ",
            { a: "EBS pricing calculator", href: "/ebs-and-azure-disk-pricing" },
            " gives a volume’s monthly list price. To see how much of a gp3\u00a0volume holds data, ",
            { a: "check EBS volume usage", href: "/learn/check-ebs-volume-usage" },
            ".",
          ],
        },
        {
          kind: "ul",
          items: [
            "Extra IOPS and throughput are charged until you release them, even in quiet hours.",
            [
              "In October 2026, AWS says gp3 costs up to 20% less per GiB than ",
              { a: "gp2", href: "/learn/gp2-vs-gp3" },
              ". Prices change.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " moves a VM’s data disks onto one pool sized to your data, then rightsizes it autonomously. On AWS, the pool uses gp3, with IOPS and throughput set from the VM’s measured load.",
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
    { title: "EBS volume", line: "The AWS disk.", href: "/learn/glossary/ebs-volume" },
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
  next: { title: "gp2 vs gp3: pricing, performance and how to migrate", href: "/learn/gp2-vs-gp3" },
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
