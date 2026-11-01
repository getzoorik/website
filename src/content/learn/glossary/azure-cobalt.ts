import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/azure-cobalt/1";

export const term: GlossaryTerm = {
  slug: "azure-cobalt",
  term: "Azure Cobalt (Arm-based Azure VMs)",
  title: "What is Microsoft Azure Cobalt?",
  meta: "Azure Cobalt is Microsoft’s own Arm CPU behind the Cobalt 100 VMs, Dpsv6, Dplsv6 and Epsv6. How these Azure Arm VMs compare to Graviton, and what AKS needs.",
  h1: "What is Microsoft Azure Cobalt?",
  card: "Azure Cobalt is Microsoft’s own Arm-based processor for Azure virtual machines (VMs).",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-26",
  updated: "2026-11-01",
  definition: [
    {
      kind: "p",
      text: "Azure Cobalt is Microsoft’s own Arm-based processor for Azure virtual machines (VMs). Its first-generation chip, Cobalt 100, is the first 64-bit Arm (Arm64) CPU that Microsoft designed itself, based on Arm’s Neoverse N2. It runs at 3.4 GHz, and each virtual CPU (vCPU) gets a whole physical core.",
    },
  ],
  sections: [
    {
      id: "the-azure-cobalt-100-vm-series",
      title: "The Azure Cobalt 100 VM series",
      blocks: [
        { kind: "p", text: "The series differ by memory for each vCPU:" },
        {
          kind: "ul",
          items: [
            "2\u00a0GiB: Dplsv6 and Dpldsv6, general purpose.",
            "4\u00a0GiB: Dpsv6 and Dpdsv6, also general purpose.",
            "8\u00a0GiB: Epsv6 and Epdsv6, memory optimized.",
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: "They run Linux systems such as Ubuntu and Azure Linux, and Windows 11 Client. Windows Server isn’t on Microsoft’s list.",
        },
      ],
    },
    {
      id: "azure-cobalt-vs-aws-graviton",
      title: "Azure Cobalt vs AWS Graviton",
      blocks: [
        {
          kind: "ul",
          items: [
            [
              "Cobalt VMs and ",
              { a: "Graviton", href: "/learn/glossary/aws-instance-families" },
              " instances both run on Arm64.",
            ],
            [
              "On both clouds, every image on an Arm node needs an Arm build, ",
              { a: "DaemonSets", href: "/learn/glossary/daemonset" },
              " included.",
            ],
            "Azure’s earlier Arm VMs, such as Dpsv5, use Ampere Altra chips, not Cobalt.",
          ],
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why Azure Cobalt matters for your cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            "Microsoft says Arm64 VMs can give up to 50% better price-performance than similar x86 VMs for scale-out work (October 2026).",
            "AWS’s own figure for Graviton is up to 40% (October 2026). Neither figure compares Cobalt with Graviton.",
            "Check where Cobalt VMs are offered, and Azure Arm VM pricing there. Prices change.",
            "AKS Windows node pools can’t use Arm64 VMs.",
            [
              "You can’t switch an existing AKS node pool to an Arm64 VM. Plan a new pool instead, as for a ",
              { a: "node pool VM size change", href: "/learn/change-aks-node-pool-vm-size" },
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
      title: "Azure VM series",
      line: "How Azure names sizes such as Dpsv6.",
      href: "/learn/glossary/azure-vm-series",
    },
    {
      title: "AWS instance families",
      line: "Where Graviton fits on AWS.",
      href: "/learn/glossary/aws-instance-families",
    },
    {
      title: "DaemonSet",
      line: "Its image needs an Arm build too.",
      href: "/learn/glossary/daemonset",
    },
    {
      title: "Node pool",
      line: "On AKS, an Arm VM needs a new pool.",
      href: "/learn/glossary/node-pool",
    },
  ],
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
