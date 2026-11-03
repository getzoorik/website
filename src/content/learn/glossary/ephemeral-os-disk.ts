import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/ephemeral-os-disk/1";

export const term: GlossaryTerm = {
  slug: "ephemeral-os-disk",
  term: "Ephemeral OS disk",
  title: "What is an ephemeral OS disk?",
  meta: "An Azure ephemeral OS disk keeps a VM’s operating system on local storage. When AKS uses one, what you give up, and what it costs.",
  h1: "What is an ephemeral OS disk?",
  card: "An Azure ephemeral OS disk is an operating system disk kept on the virtual machine’s (VM’s) local storage, not in Azure Storage.",
  group: "block-storage",
  product: "coral",
  published: "2026-10-25",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: "An Azure ephemeral OS disk is an operating system disk kept on the virtual machine’s (VM’s) local storage, not in Azure Storage. It suits stateless apps, with faster reimages and lower read and write latency, but its data can be lost.",
    },
  ],
  sections: [
    {
      id: "an-aks-ephemeral-os-disk-that-doesnt",
      title: "When AKS uses one",
      blocks: [
        {
          kind: "p",
          text: "Azure Kubernetes Service (AKS) picks an ephemeral OS disk by default when the VM size supports one and the disk fits. Otherwise it uses a managed OS disk.",
        },
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
            "Ask for Ephemeral when the disk doesn’t fit, and AKS returns a validation error. So check the fit before you ",
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
        {
          kind: "h3",
          id: "how-to-enable-an-ephemeral-os-disk",
          title: "Enable it on AKS",
        },
        {
          kind: "p",
          text: "Set the OS disk type when you create a node pool. You can’t change it later.",
        },
        {
          kind: "code",
          lang: "bash",
          code: "az aks nodepool add \\\n  --resource-group <rg> \\\n  --cluster-name <cluster> \\\n  --name <pool> \\\n  --node-vm-size <size> \\\n  --node-osdisk-type Ephemeral",
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
            "A managed OS disk is charged on top of each node’s VM price. An ephemeral one is included in it.",
            "AKS gives larger nodes a larger default managed OS disk. It starts at a 128\u00a0GiB P10 up to 7 virtual CPUs (vCPUs) and reaches a 1,024\u00a0GiB P30 at 64 vCPUs or more.",
            "An ephemeral OS disk also keeps a base disk in managed disks. Choose Standard SSD or Premium SSD for it, and you pay for that disk.",
            [
              { a: "Coral", href: "/coral" },
              " rebalances workloads onto fewer nodes, so you pay for fewer VMs and fewer OS disks.",
            ],
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Azure temporary disk",
      line: "The local disk it often lives on.",
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
  relatedTitle: "Related terms",
  next: {
    title: "Kubernetes node size best practices",
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
