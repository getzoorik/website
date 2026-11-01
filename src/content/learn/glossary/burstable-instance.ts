import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/burstable-instance/1";

export const term: GlossaryTerm = {
  slug: "burstable-instance",
  term: "Burstable instance",
  title: "What is a burstable instance?",
  meta: "A burstable instance is a VM with a baseline CPU and credits to burst above it. See how AWS T and Azure B-series VMs work, and when unlimited mode costs more.",
  h1: "What is a burstable instance?",
  card: "A burstable instance is a virtual machine (VM) with a baseline CPU level.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-26",
  updated: "2026-11-01",
  definition: [
    {
      kind: "p",
      text: "A burstable instance is a virtual machine (VM) with a baseline CPU level. It earns CPU credits below that baseline and spends them to burst above it.",
    },
    {
      kind: "p",
      text: [
        "Kubernetes’ ",
        { a: "Burstable QoS class", href: "/learn/glossary/kubernetes-qos-class" },
        " is different: a pod class with no credits.",
      ],
    },
  ],
  sections: [
    {
      id: "burstable-instances-in-aws-and-azure",
      title: "Burstable instances in AWS and Azure",
      blocks: [
        {
          kind: "ul",
          items: [
            [
              "A burstable instance in AWS is a ",
              { a: "T instance", href: "/learn/glossary/aws-instance-families" },
              ", such as T3, T4g or the newest, T8i.",
            ],
            [
              "A burstable VM in Azure is a ",
              { a: "B-series VM", href: "/learn/glossary/azure-vm-series" },
              ", such as Bsv2.",
            ],
          ],
        },
        { kind: "h3", id: "how-cpu-credits-work", title: "How CPU credits work" },
        {
          kind: "ul",
          items: [
            "A CPU credit in AWS is one virtual CPU (vCPU) at 100% for one minute.",
            "T3 unlimited mode is the default. Dedicated Hosts don’t support it.",
          ],
        },
        {
          kind: "p",
          text: "Out of credits, a B-series VM or an AWS instance in standard mode drops to its baseline. In AWS unlimited mode, it keeps bursting.",
        },
        { kind: "p", text: "T3 baseline by size:" },
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
      id: "a-t3-large-past-its-baseline",
      title: "A t3.large past its baseline",
      blocks: [
        {
          kind: "p",
          text: "AWS’s example runs an unlimited t3.large at a 24-hour average of 40% CPU. Only the 10% above its 30% baseline costs extra, at a flat rate per vCPU-hour.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for your cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            "At AWS’s example prices, a t3.large costs less than a fixed-CPU m5.large below a 42.5% daily average CPU.",
            [
              "Check the baseline when you pick a ",
              { a: "node size", href: "/learn/kubernetes-node-size-best-practices" },
              ".",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "The ",
            { a: "free assessment", href: "/assessment" },
            " works out what your clusters and disks could save.",
          ],
        },
      ],
    },
  ],
  related: [
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
  next: {
    title: "Kubernetes node size best practices: large or small nodes",
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
