import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/azure-hybrid-benefit/1";

export const term: GlossaryTerm = {
  slug: "azure-hybrid-benefit",
  term: "Azure Hybrid Benefit",
  title: "What is Azure Hybrid Benefit?",
  meta: "Azure Hybrid Benefit (AHB) lets you bring Windows Server, SQL Server, RHEL and SLES licenses you own to Azure. Who qualifies, and the rules.",
  h1: "What is Azure Hybrid Benefit?",
  card: "Azure Hybrid Benefit (AHB) is an Azure benefit that lets you use software licenses you already own on Azure.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-26",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: "Azure Hybrid Benefit (AHB) is an Azure benefit that lets you use software licenses you already own on Azure. It covers Windows Server and SQL Server licenses, and Red Hat Enterprise Linux (RHEL) and SUSE Linux Enterprise Server (SLES) subscriptions. Windows Server and SQL Server licenses qualify only with active Software Assurance or a qualifying subscription.",
    },
  ],
  sections: [
    {
      id: "an-example-on-a-linux-vm",
      title: "Example: a RHEL VM",
      blocks: [
        {
          kind: "p",
          text: "A RHEL VM from a pay-as-you-go image has two fees: infrastructure and software. Bring your own RHEL subscription and turn on Azure Hybrid Benefit. Azure then charges only the infrastructure fee, and you don’t redeploy the VM.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "windows-server-linux-and-aks",
      title: "Windows Server, Linux and AKS",
      blocks: [
        {
          kind: "ul",
          items: [
            [
              { b: "Windows Server:" },
              " you need at least 8 core licenses per VM, even on a 4-core VM. Turning it on doesn’t restart the VM.",
            ],
            [
              { b: "Linux:" },
              " a pay-as-you-go VM converts only if Red Hat or SUSE published its image. For RHEL, your Azure account must be in Red Hat Cloud Access.",
            ],
            [
              { b: "AKS:" },
              " you turn it on per cluster, for its Windows nodes. The Windows Server rules apply.",
            ],
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
            "Without it, a pay-as-you-go VM’s rate includes the software: the Windows Server cost, or the RHEL or SLES fee.",
            [
              "You can combine it with ",
              { a: "reservations", href: "/learn/glossary/reserved-instance" },
              ".",
            ],
            "While you migrate, you can use Windows Server and SQL Server licenses on-premises and in Azure for 180\u00a0days.",
            "When your Software Assurance or subscription ends, renew it, turn the benefit off or remove the workloads.",
            [
              "On AKS, it reduces the Windows nodes’ part of ",
              { a: "the cluster cost", href: "/learn/aks-vs-eks-cost" },
              ".",
            ],
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "On-demand instance",
      line: "The pay-as-you-go rate it reduces.",
      href: "/learn/glossary/on-demand-instance",
    },
    {
      title: "Reserved instance",
      line: "A compute discount you can combine with it.",
      href: "/learn/glossary/reserved-instance",
    },
    {
      title: "Node pool",
      line: "Where AKS runs its Windows nodes.",
      href: "/learn/glossary/node-pool",
    },
    {
      title: "Total cost of ownership",
      line: "Licenses are part of what a VM costs.",
      href: "/learn/glossary/cloud-tco",
    },
  ],
  relatedTitle: "Related terms",
  next: { title: "AKS vs EKS cost", href: "/learn/aks-vs-eks-cost" },
  sources: [
    {
      publisher: "Microsoft Learn",
      title: "“Explore Azure Hybrid Benefit for Windows VMs”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/windows/hybrid-use-benefit-licensing",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Explore Azure Hybrid Benefit for Linux VMs”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/linux/azure-hybrid-benefit-linux",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Use Azure Hybrid Benefit (Azure Kubernetes Service)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/azure-hybrid-benefit",
    },
    {
      publisher: "Microsoft Azure",
      title: "“Azure Hybrid Benefit Pricing”",
      url: "https://azure.microsoft.com/en-us/pricing/hybrid-benefit/",
    },
  ],
};
