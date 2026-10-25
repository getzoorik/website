import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/ephemeral-os-disk/1";

export const term: GlossaryTerm = {
  slug: "ephemeral-os-disk",
  term: "Ephemeral OS disk",
  title: "What is an ephemeral OS disk?",
  meta: "An ephemeral OS disk keeps a VM’s operating system on local storage. See what it costs on AKS, what you give up, and when a node gets a managed disk instead.",
  h1: "What is an ephemeral OS disk?",
  card: "An Azure ephemeral OS disk is an operating system disk on the local storage of its virtual machine (VM).",
  group: "block-storage",
  product: "coral",
  published: "2026-10-25",
  updated: "2026-10-25",
  definition: [
    {
      kind: "p",
      text: "An Azure ephemeral OS disk is an operating system disk on the local storage of its virtual machine (VM). What you write to it isn’t saved to remote Azure Storage.",
    },
    {
      kind: "p",
      text: "It suits stateless apps, which can lose a VM and carry on. Reads and writes have less delay.",
    },
    {
      kind: "p",
      text: "It must fit in the VM’s cache, temp disk or NVMe disk. Azure Kubernetes Service (AKS) uses one by default when it fits.",
    },
  ],
  sections: [
    {
      id: "an-aks-ephemeral-os-disk-that-doesnt",
      title: "An AKS ephemeral OS disk that doesn’t fit",
      blocks: [
        {
          kind: "p",
          text: "In Microsoft’s AKS example, Standard_E2bds_v5 has 75\u00a0GiB of temporary storage. If you leave the OS disk type unset:",
        },
        {
          kind: "ul",
          items: [
            "A 100\u00a0GiB OS disk doesn’t fit, so AKS uses a managed OS disk.",
            "A 60\u00a0GiB OS disk fits.",
            "Standard_E4bds_v5 has 150\u00a0GiB, so a 100\u00a0GiB OS disk fits there.",
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: [
            "Check the fit before you ",
            { a: "change an AKS node pool VM size", href: "/learn/change-aks-node-pool-vm-size" },
            ".",
          ],
        },
      ],
    },
    {
      id: "what-you-give-up",
      title: "What you give up",
      blocks: [
        {
          kind: "ul",
          items: [
            "A VM resize, a redeploy or a host failure wipes the OS disk.",
            "You can’t stop and deallocate the VM.",
            "No disk snapshots or Azure Backup.",
          ],
        },
      ],
    },
    {
      id: "why-it-matters-for-your-bill",
      title: "Why it matters for your bill",
      blocks: [
        {
          kind: "ul",
          items: [
            "Microsoft says the VM price includes ephemeral OS disks. An SSD base disk, which serves some reads, costs extra.",
            [
              "A managed OS disk is billed on its own. Each node has one. AKS picks a bigger default one on ",
              {
                a: "nodes with more virtual CPUs",
                href: "/learn/kubernetes-node-size-best-practices",
              },
              ".",
            ],
            [
              { a: "Coral", href: "/coral" },
              " drains spare nodes so your autoscaler can remove them. It rebalances CPU and memory requests on AKS and EKS to match real use.",
            ],
            [
              "The ",
              { a: "free assessment", href: "/assessment?p=coral" },
              " works out your own figure.",
            ],
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Azure temporary disk",
      line: "Local storage it often sits on.",
      href: "/learn/glossary/azure-temporary-disk",
    },
    {
      title: "Azure managed disk",
      line: "The persistent kind.",
      href: "/learn/glossary/azure-managed-disk",
    },
    {
      title: "Node pool",
      line: "Where you set the OS disk type and size for its nodes.",
      href: "/learn/glossary/node-pool",
    },
  ],
  next: {
    title: "Kubernetes node size best practices: large or small nodes",
    href: "/learn/kubernetes-node-size-best-practices",
  },
  sources: [
    {
      publisher: "Microsoft Learn",
      title: "“Ephemeral OS disks”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/ephemeral-os-disks",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Concepts - Storage in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/concepts-storage",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Cost Management for Kubernetes”",
      url: "https://learn.microsoft.com/en-us/azure/architecture/aws-professional/eks-to-aks/cost-management",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Overview of Azure Disk Storage”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/managed-disks-overview",
    },
  ],
};
