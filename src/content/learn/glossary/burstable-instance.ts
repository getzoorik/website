import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/burstable-instance/1";

export const term: GlossaryTerm = {
  slug: "burstable-instance",
  term: "Burstable instance",
  title: "What is a burstable instance?",
  meta: "A burstable instance is a VM with a baseline CPU and credits to burst above it. See how AWS T and Azure B-series VMs work, and when unlimited mode costs more.",
  h1: "What is a burstable instance?",
  card: "A burstable instance is a cloud virtual machine (VM) with a baseline CPU level.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-26",
  updated: "2026-10-26",
  definition: [
    {
      kind: "p",
      text: "A burstable instance is a cloud virtual machine (VM) with a baseline CPU level. It earns CPU credits while it runs below that baseline, then spends them to burst above it.",
    },
    {
      kind: "p",
      text: [
        "Kubernetes’ ",
        { a: "Burstable QoS class", href: "/learn/glossary/kubernetes-qos-class" },
        " is a different thing: a pod class with no credits.",
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
              ", such as T3 or T4g.",
            ],
            [
              "A burstable VM in Azure is a ",
              { a: "B-series VM", href: "/learn/glossary/azure-vm-series" },
              ", such as Bsv2.",
            ],
            "CPU credits in AWS measure virtual CPU (vCPU) time. One credit is one vCPU at 100% for one minute.",
            "T3 unlimited mode is the default. A T3 on a Dedicated Host can’t use it.",
          ],
        },
        {
          kind: "p",
          text: "Out of credits, an Azure B-series VM or an AWS instance in standard mode falls back to its baseline. In AWS unlimited mode, the instance keeps bursting.",
        },
      ],
    },
    {
      id: "a-t3-large-past-its-baseline",
      title: "A t3.large past its baseline",
      blocks: [
        {
          kind: "p",
          text: "A t3.large has 2\u00a0vCPUs and a baseline of 30% per vCPU. AWS’s example sets it to unlimited and runs it at a 24-hour average of 40% CPU. The hourly price covers the first 30%, and the extra 10% is charged at a flat rate per vCPU-hour.",
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
            "A steady load above the baseline runs slower, or costs extra in unlimited mode.",
            "At AWS’s example prices, a t3.large costs less than a same-size fixed-CPU m5.large, up to a 42.5% daily average CPU. Above that, it costs more.",
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
      line: "Another purchase option AWS offers for T instances.",
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
  ],
};
