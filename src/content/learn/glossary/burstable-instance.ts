import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/burstable-instance/1";

export const term: GlossaryTerm = {
  slug: "burstable-instance",
  term: "Burstable instance",
  title: "What is a burstable instance?",
  meta: "Burstable instances earn CPU credits below a baseline and spend them to burst. How AWS T3, T4g and Azure B-series VMs work, and what they cost.",
  h1: "What is a burstable instance?",
  card: "A burstable instance is a virtual machine (VM) with a baseline CPU level.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-26",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: "A burstable instance is a virtual machine (VM) with a baseline CPU level. It earns CPU credits while it runs below the baseline and spends them to burst above it.",
    },
    {
      kind: "p",
      text: [
        "Kubernetes’ ",
        { a: "Burstable QoS class", href: "/learn/glossary/kubernetes-qos-class" },
        " is unrelated: a pod class, with no credits.",
      ],
    },
  ],
  sections: [
    {
      id: "burstable-instances-in-aws-and-azure",
      title: "On AWS and Azure",
      blocks: [
        {
          kind: "ul",
          items: [
            [
              "AWS ",
              { a: "T instances", href: "/learn/glossary/aws-instance-families" },
              ": T8i, T4g, T3a, T3 and the previous-generation T2.",
            ],
            [
              "Azure ",
              { a: "B-series VMs", href: "/learn/glossary/azure-vm-series" },
              ": Bsv2 on Intel, Basv2 on AMD and Bpsv2 on Arm.",
            ],
          ],
        },
        { kind: "h3", id: "how-cpu-credits-work", title: "How CPU credits work" },
        {
          kind: "ul",
          items: [
            "On AWS, one CPU credit is one virtual CPU (vCPU) at 100% for one minute.",
            "Out of credits, a B-series VM or an AWS instance in standard mode drops back to its baseline.",
            "In AWS unlimited mode, an instance keeps bursting. A 24-hour average above the baseline costs extra.",
            "Unlimited is the default for T3, T3a, T4g and T8i. T3 on a Dedicated Host runs only in standard mode.",
          ],
        },
        { kind: "p", text: "T3 baselines by size, the same for T3a and T4g:" },
        {
          kind: "table",
          columns: [
            { label: "Size", width: "32%" },
            { label: "vCPUs", width: "23%" },
            { label: "Credits earned per hour", width: "23%" },
            { label: "Baseline per vCPU", width: "22%" },
          ],
          rows: [
            ["t3.nano", "2", "6", "5%"],
            ["t3.micro", "2", "12", "10%"],
            ["t3.small", "2", "24", "20%"],
            ["t3.medium", "2", "24", "20%"],
            ["t3.large", "2", "36", "30%"],
            ["t3.xlarge", "4", "96", "40%"],
            ["t3.2xlarge", "8", "192", "40%"],
          ],
        },
        {
          kind: "p",
          text: "Watch the balance with CPUCreditBalance in Amazon CloudWatch, or CPU Credits Remaining for an Azure B-series VM.",
        },
      ],
    },
    {
      id: "aws-t2-vs-t3-vs-t3a-instances",
      title: "T2, T3, T3a and T4g",
      blocks: [
        {
          kind: "ul",
          items: [
            [
              "T4g runs on Arm-based ",
              { a: "AWS Graviton2", href: "/learn/glossary/aws-graviton" },
              " processors. AWS lists it at 20% less than T3.",
            ],
            "T3a runs on AMD EPYC processors instead of T3’s Intel Xeon. AWS lists it at 10% less than T3.",
            "A stopped T2 loses its earned credits. A stopped T3, T3a or T4g keeps them for seven days.",
            "t2.nano, t2.micro and t2.small have 1\u00a0vCPU. Every T3, T3a and T4g size has at least 2.",
          ],
        },
      ],
    },
    {
      id: "a-t3-large-past-its-baseline",
      title: "A t3.large past its baseline",
      blocks: [
        {
          kind: "p",
          text: "In AWS’s example, an unlimited t3.large averages 40% CPU over 24 hours. The hourly price covers its 30% baseline. Only the extra 10% costs more, at a flat rate per vCPU-hour.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            "At AWS’s example prices, an unlimited t3.large costs less than a fixed-CPU m5.large below a 42.5% daily average CPU.",
            "Bursting at 100% all the time, a T3 costs about 1.5 times an M5 of the same size.",
            [
              "So check the baseline against your real use before you pick a burstable ",
              { a: "node size", href: "/learn/kubernetes-node-size-best-practices" },
              ".",
            ],
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "AWS Graviton",
      line: "The Arm processors behind T4g.",
      href: "/learn/glossary/aws-graviton",
    },
    {
      title: "On-demand instance",
      line: "One way to buy T instances.",
      href: "/learn/glossary/on-demand-instance",
    },
    {
      title: "Spot instance",
      line: "Also offered for T instances.",
      href: "/learn/glossary/spot-instance",
    },
    {
      title: "Kubernetes QoS class",
      line: "Its Burstable class only shares the name.",
      href: "/learn/glossary/kubernetes-qos-class",
    },
  ],
  relatedTitle: "Related terms",
  next: {
    title: "Kubernetes node size best practices",
    href: "/learn/kubernetes-node-size-best-practices",
  },
  sources: [
    {
      publisher: "Amazon Web Services",
      title: "“Burstable performance instances”",
      url: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/burstable-performance-instances.html",
      note: " (Amazon EC2 User Guide)",
    },
    {
      publisher: "Amazon Web Services",
      title: "“Key concepts for burstable performance instances”",
      url: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/burstable-credits-baseline-concepts.html",
    },
    {
      publisher: "Amazon Web Services",
      title: "“Unlimited mode concepts for burstable instances”",
      url: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/burstable-performance-instances-unlimited-mode-concepts.html",
    },
    {
      publisher: "Microsoft Learn",
      title: "“B family VM size series”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/general-purpose/b-family",
    },
    {
      publisher: "Microsoft Learn",
      title: "“B Series CPU Credit Model”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/b-series-cpu-credit-model",
    },
  ],
};
