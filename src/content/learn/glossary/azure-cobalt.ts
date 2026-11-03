import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/azure-cobalt/1";

export const term: GlossaryTerm = {
  slug: "azure-cobalt",
  term: "Azure Cobalt (Arm-based Azure VMs)",
  title: "Azure Cobalt: Microsoft’s Arm chip",
  meta: "Azure Cobalt is the Arm-based CPU chip Microsoft designs for Azure VMs. Its VM series, how it compares with AWS Graviton, and what AKS needs.",
  h1: "Azure Cobalt: Microsoft’s Arm chip",
  card: "Azure Cobalt is the Arm-based CPU chip that Microsoft designs for Azure virtual machines (VMs).",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-26",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: "Azure Cobalt is the Arm-based CPU chip that Microsoft designs for Azure virtual machines (VMs). Cobalt 100, the first generation, is Microsoft’s first 64-bit Arm (Arm64) CPU.",
    },
  ],
  sections: [
    {
      id: "the-azure-cobalt-100-vm-series",
      title: "Cobalt VM series",
      blocks: [
        {
          kind: "p",
          text: "Cobalt 100 is based on Arm’s Neoverse N2 and runs at 3.4\u00a0GHz. Each virtual CPU (vCPU) gets a whole physical core. Its VM series differ by memory per vCPU:",
        },
        {
          kind: "ul",
          items: [
            "2\u00a0GiB: Dplsv6 and Dpldsv6, general purpose.",
            "4\u00a0GiB: Dpsv6 and Dpdsv6, general purpose.",
            "8\u00a0GiB: Epsv6 and Epdsv6, memory optimized.",
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: "These VMs run Linux, such as Ubuntu, Red Hat Enterprise Linux and Azure Linux, and Windows 11 Client. Windows Server isn’t on Microsoft’s list.",
        },
        {
          kind: "p",
          text: "The next chip, Cobalt 200, is built on Arm’s Neoverse V3 and is in preview. Its VM series include Dpsv7 and Epsv7.",
        },
      ],
    },
    {
      id: "azure-cobalt-vs-aws-graviton",
      title: "Cobalt vs AWS Graviton",
      blocks: [
        {
          kind: "ul",
          items: [
            [
              "Cobalt VMs and ",
              { a: "AWS Graviton", href: "/learn/glossary/aws-graviton" },
              " instances both run on Arm64.",
            ],
            [
              "On both clouds, each container image on an Arm node needs an Arm64 build, ",
              { a: "DaemonSets", href: "/learn/glossary/daemonset" },
              " included.",
            ],
            "Not every Azure Arm VM uses Cobalt. Earlier series, such as Dpsv5, run on Ampere Altra.",
          ],
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            "Microsoft says Arm64 VMs can give up to 50% better price-performance than comparable x86 VMs for scale-out work.",
            "AWS says up to 40% for Graviton. Neither figure compares Cobalt with Graviton.",
            "Check Cobalt VM availability and Arm VM prices in your region. Prices change.",
            "AKS can’t run Windows node pools on Arm64 VMs.",
            [
              "An existing AKS node pool can’t switch to an Arm64 VM. Add a new pool instead, as for a ",
              { a: "node pool VM size change", href: "/learn/change-aks-node-pool-vm-size" },
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
      line: "Amazon’s Arm processors for EC2.",
      href: "/learn/glossary/aws-graviton",
    },
    {
      title: "Azure VM series",
      line: "How Azure names sizes such as Dpsv6.",
      href: "/learn/glossary/azure-vm-series",
    },
    {
      title: "Node pool",
      line: "On AKS, an Arm VM needs a new pool.",
      href: "/learn/glossary/node-pool",
    },
    {
      title: "DaemonSet",
      line: "Its image needs an Arm build too.",
      href: "/learn/glossary/daemonset",
    },
  ],
  relatedTitle: "Related terms",
  next: {
    title: "How to change an AKS node pool VM size",
    href: "/learn/change-aks-node-pool-vm-size",
  },
  sources: [
    {
      publisher: "Microsoft Learn",
      title: "“Azure Cobalt processor-based Virtual Machines”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/cobalt-overview",
    },
    {
      publisher: "Microsoft Azure",
      title:
        "“New Azure Cobalt 200 VMs deliver 50% performance improvement, fully optimized for modern agentic AI workloads”",
      url: "https://azure.microsoft.com/en-us/blog/new-azure-cobalt-200-vms-deliver-50-performance-improvement-fully-optimized-for-modern-agentic-ai-workloads/",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Dpsv5 size series”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/general-purpose/dpsv5-series",
    },
    {
      publisher: "Microsoft Learn",
      title:
        "“Use Arm64 Virtual Machines in Azure Kubernetes Service (AKS) for cost effectiveness”",
      url: "https://learn.microsoft.com/en-us/azure/aks/use-arm64-vms",
    },
    {
      publisher: "Amazon Web Services",
      title: "“Graviton instance migration”",
      url: "https://docs.aws.amazon.com/prescriptive-guidance/latest/eks-cost-optimization/3-migration-to-graviton.html",
      note: " (AWS Prescriptive Guidance)",
    },
  ],
};
