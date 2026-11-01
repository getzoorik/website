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
  updated: "2026-11-01",
  definition: [
    {
      kind: "p",
      text: "An Azure ephemeral OS disk is an operating system disk on the local storage of its virtual machine (VM). It isn’t saved to Azure Storage.",
    },
    { kind: "p", text: "It suits stateless apps. Reads and writes are faster." },
    { kind: "p", text: "Azure Kubernetes Service (AKS) uses one by default when it fits." },
  ],
  sections: [
    {
      id: "an-aks-ephemeral-os-disk-that-doesnt",
      title: "An AKS ephemeral OS disk that doesn’t fit",
      blocks: [
        {
          kind: "p",
          text: "In Microsoft’s example, Standard_E2bds_v5 has 75\u00a0GiB of temporary storage. With the OS disk type unset:",
        },
        {
          kind: "ul",
          items: [
            "A 100\u00a0GiB OS disk doesn’t fit, so AKS uses a managed one.",
            "A 60\u00a0GiB one fits.",
            "Standard_E4bds_v5 has 150\u00a0GiB, so 100\u00a0GiB fits.",
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
      title: "Ephemeral vs managed OS disk",
      blocks: [
        {
          kind: "table",
          columns: [
            { label: "", width: "34%" },
            { label: "Ephemeral OS disk", width: "36%" },
            { label: "Managed OS disk", width: "30%" },
          ],
          rows: [
            [
              "Where the OS disk lives",
              "The VM’s cache, temp or NVMe disk",
              "Remote Azure Storage",
            ],
            ["Stop and deallocate", "Not supported", "Supported"],
            ["Resize the VM or redeploy", "OS disk wiped and reprovisioned", "Data kept"],
            ["Host healing", "OS disk wiped", "Data kept"],
            ["Resize the OS disk", "At creation only", "At creation, or after stop-deallocate"],
            ["Snapshots and Azure Backup", "Not supported", "Supported"],
            ["Charge", "In the VM price", "Charged separately"],
          ],
        },
        {
          kind: "p",
          text: "An ephemeral OS disk can be at most 2,040\u00a0GiB, or the local disk’s size if that is smaller.",
        },
        { kind: "p", text: "On AKS, set it when you create a node pool:" },
        {
          kind: "code",
          lang: "bash",
          code: "az aks nodepool add --resource-group <rg> --cluster-name <cluster> --name <pool> --node-vm-size <size> --node-osdisk-type Ephemeral",
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
            "An SSD base disk, which serves some reads, costs extra.",
            [
              "AKS gives ",
              {
                a: "nodes with more virtual CPUs",
                href: "/learn/kubernetes-node-size-best-practices",
              },
              " a bigger default managed OS disk.",
            ],
            [
              { a: "Coral", href: "/coral" },
              " drains spare nodes so your autoscaler can remove them.",
            ],
            [
              "The ",
              { a: "free assessment", href: "/assessment?p=coral" },
              " works out your figure.",
            ],
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Azure temporary disk",
      line: "Where it often sits.",
      href: "/learn/glossary/azure-temporary-disk",
    },
    {
      title: "Azure managed disk",
      line: "The persistent kind.",
      href: "/learn/glossary/azure-managed-disk",
    },
    {
      title: "Node pool",
      line: "Where you set the OS disk type.",
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
    {
      publisher: "Microsoft Learn",
      title: "“az aks nodepool”",
      url: "https://learn.microsoft.com/en-us/cli/azure/aks/nodepool",
    },
  ],
};
