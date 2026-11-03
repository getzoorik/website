import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/azure-vm-series/1";

export const term: GlossaryTerm = {
  slug: "azure-vm-series",
  term: "Azure VM series",
  title: "Azure VM sizes and series",
  meta: "Azure virtual machine sizes come in types, families and series. How to read a size name such as Standard_D4s_v5, and what an Azure SKU is.",
  h1: "Azure VM sizes and series",
  card: "An Azure VM series is a group of Azure virtual machine (VM) sizes with similar hardware and features.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-26",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: "An Azure VM series is a group of Azure virtual machine (VM) sizes with similar hardware and features. Each size, such as Standard_D4s_v5 in the Dsv5 series, sets the virtual CPUs (vCPUs) and memory your Azure VMs get.",
    },
    {
      kind: "p",
      text: "A VM size is Azure’s name for what AWS calls an instance type. Microsoft says the two have similar categories, but their RAM, CPU and storage differ.",
    },
  ],
  sections: [
    {
      id: "azure-vm-types-and-families",
      title: "Azure VM types and families",
      blocks: [
        {
          kind: "p",
          text: "Microsoft sorts sizes by workload type. Each type holds families, and each family holds series. The main types:",
        },
        {
          kind: "ul",
          items: [
            "General purpose (such as B and D): balanced CPU and memory.",
            "Compute optimized (F family): more CPU for each GiB of memory.",
            "Memory optimized (such as E and M): more memory for each vCPU.",
            "Storage optimized (L family): high disk throughput and I/O. Microsoft says a storage optimized VM series is ideal for big data, SQL and NoSQL databases, and data warehousing.",
          ],
        },
        {
          kind: "p",
          text: "Microsoft’s overview of sizes for virtual machines in Azure lists every current series. Each series page has a table of its sizes, with their vCPUs and memory.",
        },
      ],
    },
    {
      id: "the-azure-vm-size-naming-convention",
      title: "How to read a size name",
      blocks: [
        { kind: "p", text: "Read Standard_D4s_v5 left to right:" },
        {
          kind: "ul",
          items: [
            "D is the family.",
            "4 is the vCPU count.",
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
          text: "The memory optimized Standard_E4s_v5 has the same 4\u00a0vCPUs, but 32\u00a0GiB of memory instead of 16.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "what-an-azure-sku-is",
      title: "Azure VM SKUs",
      blocks: [
        {
          kind: "p",
          text: "A SKU is an option a resource comes in. Microsoft’s examples are a VM size and a storage account type. For a VM, the SKU is its size, such as Standard_D4s_v5.",
        },
        {
          kind: "p",
          text: [
            "Not every SKU is offered in every region or zone, or to every subscription. Deploying one that isn’t available fails. The activity log shows ",
            { code: "SkuNotAvailable" },
            ", or ",
            { code: "InvalidTemplateDeployment" },
            " for a template.",
          ],
        },
        {
          kind: "p",
          text: [
            "This command lists the Standard_D sizes in one region. The ",
            { code: "--all" },
            " flag includes sizes your subscription can’t use:",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "az vm list-skus --location centralus --size Standard_D --all --output table",
        },
        {
          kind: "p",
          text: [
            "The Restrictions column shows ",
            { code: "NotAvailableForSubscription" },
            " for those.",
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
            "The series sets how much memory comes with each vCPU. If that doesn’t fit your workload, you pay for CPU or memory that sits idle.",
            "Esv5 has no temporary disk, which Microsoft says reduces its price of entry.",
            "Disks are charged separately from the VM.",
            [
              "On Azure Windows VM sizes, you also pay for Windows Server, unless you bring your own licenses with ",
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
            " estimates what your clusters and disks could save.",
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
  relatedTitle: "Related terms",
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
