import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/azure-hybrid-benefit/1";

export const term: GlossaryTerm = {
  slug: "azure-hybrid-benefit",
  term: "Azure Hybrid Benefit",
  title: "What is Azure Hybrid Benefit?",
  meta: "Azure Hybrid Benefit lets you use Windows Server, SQL Server, RHEL and SLES licenses you own on Azure. See who qualifies, what it removes and how AKS uses it.",
  h1: "What is Azure Hybrid Benefit?",
  card: "Azure Hybrid Benefit is an Azure offer that lets you use licenses you own on Azure.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-26",
  updated: "2026-10-26",
  definition: [
    {
      kind: "p",
      text: "Azure Hybrid Benefit is an Azure offer that lets you use licenses you own on Azure. It covers Windows Server and SQL Server licenses with active Software Assurance or a qualifying subscription license. Red Hat Enterprise Linux (RHEL) and SUSE Linux Enterprise Server (SLES) subscriptions count too.",
    },
  ],
  sections: [
    {
      id: "an-example-on-a-linux-vm",
      title: "An example on a Linux VM",
      blocks: [
        {
          kind: "p",
          text: "Say you run a RHEL VM from a pay-as-you-go image. Its cost has two parts: an infrastructure fee and a software fee.",
        },
        {
          kind: "p",
          text: "You bring your own RHEL subscription and turn on Azure Hybrid Benefit. You don’t redeploy the VM, and Azure now charges only the infrastructure fee.",
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
            "Azure Hybrid Benefit for Windows Server needs at least 8\u00a0core licenses per VM, even on a 4-core VM.",
            "Turning it on for a Windows VM doesn’t restart it.",
            "Azure Hybrid Benefit for Linux converts a pay-as-you-go VM only if Red Hat or SUSE published its image.",
            "For RHEL, your Azure account must be in Red Hat Cloud Access.",
            "Azure Hybrid Benefit for AKS is turned on per cluster, for its Windows nodes.",
          ],
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for your cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            "Without it, a pay-as-you-go VM’s rate includes the software: the RHEL or SLES fee, or the Windows Server cost.",
            "While you migrate, you can use Windows Server and SQL Server licenses on-premises and in Azure for 180\u00a0days.",
            "When your Software Assurance or subscription ends, renew or turn the benefit off.",
            [
              "On AKS, it reduces the Windows nodes’ part of ",
              { a: "the cluster cost", href: "/learn/aks-vs-eks-cost" },
              ".",
            ],
            [
              "The ",
              { a: "free assessment", href: "/assessment" },
              " works out what your clusters and disks could save.",
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
  ],
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
