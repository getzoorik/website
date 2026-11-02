import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/azure-vm-series/1";

export const term: GlossaryTerm = {
  slug: "azure-vm-series",
  term: "Azure VM series",
  title: "What is an Azure VM series?",
  meta: "An Azure virtual machine series is a group of Azure VM sizes. See the Azure VM types and families, how to read Standard_D4s_v5 and the memory per vCPU.",
  h1: "What is an Azure VM series?",
  card: "An Azure VM series is a group of virtual machine (VM) sizes with similar hardware and features.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-26",
  updated: "2026-11-02",
  definition: [
    {
      kind: "p",
      text: "An Azure VM series is a group of virtual machine (VM) sizes with similar hardware and features. Each size sets the virtual CPUs (vCPUs) and memory your Azure VMs get. Standard_D4s_v5 is one size in the Dsv5 series.",
    },
    {
      kind: "p",
      text: "Azure instance types go by another name: what AWS calls an instance type, Azure calls a VM size. Microsoft says AWS instance types and Azure VM sizes have similar categories, but their RAM, CPU and storage differ.",
    },
  ],
  sections: [
    {
      id: "azure-vm-types-and-families",
      title: "Azure VM types and families",
      blocks: [
        {
          kind: "p",
          text: "Azure VM families sit one level above a series. Microsoft groups them into types, including:",
        },
        {
          kind: "ul",
          items: [
            "General purpose (such as B and D): balanced CPU and memory.",
            "Compute optimized (F family): more CPU for each GiB.",
            "Memory optimized (such as E and M): more memory for each vCPU.",
            "Storage optimized (L family): high disk throughput and I/O. Microsoft says a storage optimized VM series is ideal for big data, SQL and NoSQL databases, and data warehousing.",
          ],
        },
        {
          kind: "p",
          text: "Microsoft’s overview of sizes for virtual machines in Azure is the full Azure VM size list. Each series page has a size chart: a table of vCPUs and memory.",
        },
      ],
    },
    {
      id: "the-azure-vm-size-naming-convention",
      title: "How to read Azure VM sizes",
      blocks: [
        { kind: "p", text: "Read Standard_D4s_v5 left to right:" },
        {
          kind: "ul",
          items: [
            "D is the family.",
            "4 is its vCPU count.",
            "s means it can use any Premium SSD type.",
            "v5 is the series version.",
          ],
        },
        {
          kind: "p",
          text: [
            "Other lowercase letters add features. An “a” means AMD, a “p” means Arm, and a “d” adds a local ",
            { a: "temporary disk", href: "/learn/glossary/azure-temporary-disk" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "No CPU letter usually means Intel x86-64, as on Dsv5. The HB series runs on AMD EPYC without one.",
        },
        {
          kind: "p",
          text: "The memory optimized Standard_E4s_v5 has the same 4\u00a0vCPUs but 32\u00a0GiB of memory, not 16.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "what-an-azure-sku-is",
      title: "What an Azure SKU is",
      blocks: [
        {
          kind: "p",
          text: "SKUs in Azure are the options a resource comes in. Microsoft’s examples are a VM size and a storage account type. For a VM, the SKU is its size, such as Standard_D4s_v5.",
        },
        {
          kind: "p",
          text: [
            "Not all Azure VM SKUs are offered in every region or zone, or to every subscription. Deploying a VM with a SKU that isn’t available there fails. The Azure portal’s activity log shows the error code ",
            { code: "SkuNotAvailable" },
            ", or ",
            { code: "InvalidTemplateDeployment" },
            " when you deploy from a template.",
          ],
        },
        {
          kind: "p",
          text: [
            "To get the Azure VM SKU list for a region, run ",
            { code: "az vm list-skus" },
            " with ",
            { code: "--location" },
            " and ",
            { code: "--all" },
            ". The list shows each VM size and any restrictions, including sizes your subscription can’t use.",
          ],
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why Azure VM sizing matters for your cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            "Your VM series in Azure sets the memory you get with each vCPU.",
            "If it doesn’t fit your workload, CPU or memory sits idle.",
            "Esv5 has no temp disk, which Microsoft says reduces its entry price.",
            "Disks are charged separately from VMs.",
            [
              "On Azure Windows VM sizes, the pay-as-you-go rate also includes the Windows Server license, unless you use ",
              { a: "Azure Hybrid Benefit", href: "/learn/glossary/azure-hybrid-benefit" },
              ".",
            ],
            [
              "Check real use before you ",
              { a: "change a node pool’s VM size", href: "/learn/change-aks-node-pool-vm-size" },
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
      title: "AWS instance families",
      line: "The same idea on AWS.",
      href: "/learn/glossary/aws-instance-families",
    },
    {
      title: "Burstable instance",
      line: "Azure’s B-series is one.",
      href: "/learn/glossary/burstable-instance",
    },
    {
      title: "Azure Cobalt",
      line: "One Arm CPU behind a “p”.",
      href: "/learn/glossary/azure-cobalt",
    },
    { title: "Node pool", line: "Where you pick a VM size.", href: "/learn/glossary/node-pool" },
  ],
  relatedTitle: "Terms related to Azure VM series",
  next: {
    title: "How to change an AKS node pool VM size",
    href: "/learn/change-aks-node-pool-vm-size",
  },
  sources: [
    {
      publisher: "Microsoft Learn",
      title: "“Virtual machine sizes overview”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/overview",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Azure VM sizes naming conventions”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/vm-naming-conventions",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Dsv5 size series”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/general-purpose/dsv5-series",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Esv5 size series”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/memory-optimized/esv5-series",
    },
    {
      publisher: "Microsoft Learn",
      title: "“SKU not available errors”",
      url: "https://learn.microsoft.com/en-us/azure/azure-resource-manager/troubleshooting/error-sku-not-available",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Compare AWS and Azure compute services”",
      url: "https://learn.microsoft.com/en-us/azure/architecture/aws-professional/compute",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Explore Azure Hybrid Benefit for Windows VMs”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/windows/hybrid-use-benefit-licensing",
    },
  ],
};
