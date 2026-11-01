import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/how-to-choose-aks-node-sizes/1";
import { figure as figure2 } from "@/features/learn/figures/how-to-choose-aks-node-sizes/2";
import { figure as figure3 } from "@/features/learn/figures/how-to-choose-aks-node-sizes/3";

export const article: Article = {
  slug: "how-to-choose-aks-node-sizes",
  title: "AKS VM sizes: how to choose series and size",
  meta: "How to choose AKS VM sizes: the system node pool rules, the VM series that fits your pods, what the a, p and d letters cost, and the size within a series.",
  h1: "How to choose AKS VM sizes",
  deck: "System pool first, then the VM series, the letters and the size, priced at Azure list prices in East US.",
  card: "Pick AKS node sizes in order: system pool, VM series, letters, then size, with East US list prices.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes cost basics",
  published: "2026-11-01",
  updated: "2026-11-01",
  author: "vineet",
  cover: "/learn-covers/zoorik-learn-how-to-choose-aks-node-sizes-1200x630.webp",
  coverAlt:
    "Choose AKS node sizes: more CPU or more memory leaves room paid for, idle, and the size shaped to the pod requests fits",
  short:
    "To choose AKS VM sizes for your node pools, size the system pool first, then match each user pool’s VM series to its pods’ memory per vCPU. Pick the processor and disk letters next, and the size last: a series usually lists every size at one price per vCPU.",
  sections: [
    {
      id: "how-to-choose-aks-node-sizes",
      title: "How to choose AKS node sizes, one decision at a time",
      blocks: [
        {
          kind: "p",
          text: "Picture a cluster created from the Azure portal’s Production Standard preset. Both its pools run Standard_D8ds_v5\u00a0nodes, and your apps are memory-heavy services. The preset is a sound start, but it knows nothing about your pods.",
        },
        {
          kind: "p",
          text: "A pool may even carry a size nobody chose. Before May 2025, AKS used Standard_DS2_v2 when no size was given. Since then, it picks a default from available capacity and quota.",
        },
        {
          kind: "p",
          text: [
            "Azure AKS node sizes are Azure virtual machine (VM) sizes. So choosing a node size means choosing a VM size for each ",
            { a: "node pool", href: "/learn/glossary/node-pool" },
            ", in this order:",
          ],
        },
        {
          kind: "ol",
          items: [
            "Size the system pool, which runs AKS’s own pods.",
            "Pick each user pool’s VM series to match what its pods request.",
            "Pick the letters and version: processor, local disk and generation.",
            "Pick the size within the series, by fit rather than price.",
            "Check that the region, your quota and the retirement dates allow it.",
          ],
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "what-aks-recommends-for-each-node-pool",
      title: "AKS recommended VM size for each node pool",
      blocks: [
        {
          kind: "p",
          text: "The portal’s cluster presets are the closest thing to an AKS recommended node size. Each one sets a VM size for the system pool and the user pool:",
        },
        {
          kind: "table",
          columns: [
            { label: "Preset", width: "35%" },
            { label: "System pool node size", width: "34%" },
            { label: "User pool node size", width: "31%" },
          ],
          rows: [
            ["Production Standard", "Standard_D8ds_v5", "Standard_D8ds_v5"],
            ["Dev/Test", "Standard_D4ds_v5", "No user pool"],
            ["Production Economy", "Standard_D8ds_v5", "Standard_D8as_v4"],
            ["Production Enterprise", "Standard_D16ds_v5", "Standard_D8ds_v5"],
          ],
        },
        {
          kind: "p",
          text: "Every preset uses the D family, which Microsoft calls general purpose, with a balanced CPU-to-memory ratio. Most of the sizes carry the d letter, for a local temporary disk. Production Economy’s user pool runs an AMD size, the a in Standard_D8as_v4.",
        },
        {
          kind: "h3",
          id: "the-aks-system-node-pools-recommended-size",
          title: "The AKS system node pool’s recommended size",
        },
        {
          kind: "p",
          text: "The system pool hosts critical system pods such as CoreDNS and metrics-server. Microsoft says it shouldn’t run your applications, and sets these rules for it:",
        },
        {
          kind: "ul",
          items: [
            "A VM size of at least 4\u00a0vCPUs and 4\u00a0GB of memory.",
            "No B-series VMs.",
            "At least two nodes, and three recommended for a production cluster with a single system pool.",
          ],
        },
        {
          kind: "p",
          text: [
            "Microsoft recommends at least three nodes of 8\u00a0vCPUs, or two of at least 16. It says this applies especially to large clusters, with several CoreDNS replicas and add-ons. Give the pool the ",
            { code: "CriticalAddonsOnly=true:NoSchedule" },
            " taint, so application pods stay off it.",
          ],
        },
        {
          kind: "p",
          text: "User pools can go smaller. Their AKS minimum node size is 2\u00a0vCPUs and 2\u00a0GB of memory, and smaller sizes might not be usable by default. Everything below applies to user pools.",
        },
      ],
    },
    {
      id: "match-the-vm-series-to-your-pods",
      title: "Which Azure VM series is best for AKS: match your pods’ memory per vCPU",
      blocks: [
        {
          kind: "p",
          text: [
            "The scheduler places pods by their ",
            { a: "requests", href: "/learn/glossary/kubernetes-resource-requests" },
            ", not by what they use. So start from a pool’s requests, not the VM catalogue. Divide its pods’ total memory requests by their total CPU requests, to get GiB per vCPU.",
          ],
        },
        {
          kind: "p",
          text: [
            "Then compare that with each ",
            { a: "VM series", href: "/learn/glossary/azure-vm-series" },
            ". On Azure’s pricing page, the preset’s D8ds_v5 has 8\u00a0vCPUs and 32\u00a0GiB, or 4\u00a0GiB per vCPU. An E8ds_v5 has 8\u00a0vCPUs and 64\u00a0GiB, or 8\u00a0GiB per vCPU.",
          ],
        },
        {
          kind: "p",
          text: "Microsoft calls the E family memory optimized. It calls the F family compute optimized, with a high CPU-to-memory ratio.",
        },
        {
          kind: "p",
          text: "When a series and your pods differ, one resource fills first. The rest of the other sits unrequested, and you still pay for it.",
        },
        { kind: "h3", id: "what-the-wrong-series-costs", title: "What the wrong series costs" },
        {
          kind: "callout",
          label: "Worked example",
          text: "Say the opening’s user pool runs pods that request 24\u00a0vCPU and 192\u00a0GiB in all, 8\u00a0GiB per vCPU. The prices are East US Linux pay-as-you-go list prices from Azure’s pricing page, on 1 November 2026, over a 730-hour month.",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "D series." },
              " Memory sets the count: 192 ÷ 32 = 6 D8ds_v5\u00a0nodes, with 48\u00a0vCPU. At $0.452 an hour each, they cost $1,979.76 a month.",
            ],
            [
              { b: "E series." },
              " 192 ÷ 64 = 3 E8ds_v5\u00a0nodes give exactly 24\u00a0vCPU and 192\u00a0GiB. At $0.576 an hour each, they cost $1,261.44 a month.",
            ],
          ],
        },
        {
          kind: "p",
          text: "The E pool costs $718.32 a month less, about 36%. On the D series, that sum paid for 24\u00a0vCPU that no pod requests.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: [
            "Both totals leave out what AKS keeps back on each node, and your headroom. A real pool needs some room above its requests, as ",
            {
              a: "Kubernetes allocatable vs capacity",
              href: "/learn/kubernetes-allocatable-vs-capacity",
            },
            " explains.",
          ],
        },
        {
          kind: "p",
          text: "For pods that request more CPU than memory, the same check points the other way, toward the F family. Prices change by region and over time, so rerun the sums for yours.",
        },
      ],
    },
    {
      id: "read-the-letters-in-the-size-name",
      title: "Read the letters in the size name",
      blocks: [
        {
          kind: "p",
          text: [
            "Size names follow the ",
            { a: "Azure VM size naming convention", href: "/learn/glossary/azure-vm-series" },
            ": family, vCPU count, feature letters, then version. In Standard_D4as_v5, D is the family and 4 the vCPU count. The a and s are letters, and v5 is the version.",
          ],
        },
        { kind: "p", text: "Three letters change the price at the same vCPUs and memory:" },
        {
          kind: "ul",
          items: [
            [{ b: "a" }, " means an AMD processor."],
            [{ b: "p" }, " means an Arm-based processor, Microsoft Cobalt or Ampere Altra."],
            [{ b: "d" }, " means the size includes a local temporary disk."],
          ],
        },
        {
          kind: "p",
          text: "With no a or p, the series uses Intel x86-64\u00a0CPUs. The s means the size works with any Premium SSD type.",
        },
        {
          kind: "p",
          text: "At 4\u00a0vCPUs and 16\u00a0GiB in East US, the AMD D4as_v5 lists about 10% below the Intel D4s_v5. The Arm D4ps_v5 lists about 20% below it, and the D4ds_v5, with a local disk, about 18% above.",
        },
        { kind: "svg", figure: figure3 },
        { kind: "h3", id: "amd-and-arm-sizes", title: "AMD and Arm sizes" },
        {
          kind: "p",
          text: "An AMD size keeps the x86-64 architecture, so your images run on it without a rebuild.",
        },
        {
          kind: "p",
          text: "Arm takes more care. Microsoft says Arm64 VMs can deliver up to 50% better price-performance than comparable x86-based VMs for scale-out workloads.",
        },
        {
          kind: "p",
          text: [
            "But every image the pool runs, DaemonSets included, needs an Arm64 build. Arm64 sizes also always use Generation 2 on AKS. ",
            { a: "Azure Cobalt", href: "/learn/glossary/azure-cobalt" },
            " covers Microsoft’s own Arm chip.",
          ],
        },
        { kind: "h3", id: "the-d-letter-and-the-os-disk", title: "The d letter and the OS disk" },
        {
          kind: "p",
          text: [
            "Current VM generations have no dedicated cache, only temporary storage. So on them, only a d size can hold an ",
            { a: "ephemeral OS disk", href: "/learn/glossary/ephemeral-os-disk" },
            ", stored on the host. AKS uses one by default where it fits.",
          ],
        },
        {
          kind: "p",
          text: "Microsoft strongly recommends ephemeral OS disks whenever possible, for faster reads, writes, node scaling and upgrades. Without one, each node gets a managed OS disk. By default, a size with 1 to 7\u00a0vCPUs gets a 128\u00a0GiB P10\u00a0disk.",
        },
        {
          kind: "p",
          text: [
            "You can’t change the OS disk size once the pool exists. So weigh the D4ds_v5’s extra $24.82 a month per node against that disk. The ",
            { a: "Azure disk pricing calculator", href: "/ebs-and-azure-disk-pricing" },
            " gives its monthly price.",
          ],
        },
        { kind: "h3", id: "the-version", title: "The version" },
        {
          kind: "p",
          text: "A newer version isn’t always cheaper at list price. D4s_v6 lists at $0.202 an hour in East US, against $0.192 for D4s_v5. Microsoft says later versions typically have better performance and improved features, so weigh both.",
        },
      ],
    },
    {
      id: "choose-the-size-within-the-series-last",
      title: "Choose the size within the series last",
      blocks: [
        {
          kind: "p",
          text: "AKS VM size pricing follows the vCPU count inside a series. In East US, every Dsv5 size from D2s_v5 to D96s_v5 lists at $0.048 per vCPU an hour. Four D4s_v5\u00a0nodes and one D16s_v5 both cost $0.768 an hour.",
        },
        {
          kind: "p",
          text: "So within a series, the size sets how much the pool loses to overhead and how well pods fit, not the price of capacity:",
        },
        {
          kind: "ul",
          items: [
            [
              "Each node keeps back CPU and memory for the kubelet and runs a copy of every ",
              { a: "DaemonSet", href: "/learn/glossary/daemonset" },
              ". Fewer, larger nodes pay that overhead fewer times.",
            ],
            [
              "A large node can run out of ",
              { a: "pod slots", href: "/learn/glossary/max-pods-per-node" },
              " before CPU, and it’s harder to empty.",
            ],
            "A node autoscaler adds a whole node at a time, so large nodes mean large steps.",
            "One failed node takes more of the pool with it.",
          ],
        },
        {
          kind: "p",
          text: [
            {
              a: "Kubernetes node size best practices",
              href: "/learn/kubernetes-node-size-best-practices",
            },
            " works through each of these with AKS’s own reserve figures. It also gives the arithmetic for pods per node.",
          ],
        },
        {
          kind: "p",
          text: [
            "To price a candidate size, the ",
            { a: "EKS and AKS pricing calculator", href: "/eks-and-aks-pricing-calculator" },
            " gives its monthly list price and what Kubernetes keeps on it.",
          ],
        },
        {
          kind: "p",
          text: [
            "You can also hand the size to Azure. ",
            { a: "Node auto-provisioning (NAP)", href: "/learn/aks-node-auto-provisioning" },
            " picks VM sizes for you. Microsoft says it decides the VM configuration “based on pending pod resource requirements”.",
          ],
        },
      ],
    },
    {
      id: "check-the-size-then-measure-and-revisit",
      title: "Check the size, then measure and revisit",
      blocks: [
        {
          kind: "p",
          text: "Before you create the pool, check that the size can run there. For the AKS node size list in your region, use:",
        },
        { kind: "code", lang: "bash", code: "az vm list-skus --location <region> --output table" },
        { kind: "p", text: "A size can still be out of reach:" },
        {
          kind: "ul",
          items: [
            "Regional capacity and your subscription’s quota vary, even in regions that support AKS.",
            "A size in preview needs its preview flag registered.",
            "AKS blocks some sizes by default.",
            "When a size reaches its retirement date, its VMs are deallocated, which breaks the node pool.",
          ],
        },
        { kind: "h3", id: "when-the-size-no-longer-fits", title: "When the size no longer fits" },
        {
          kind: "p",
          text: [
            "A size fits only as well as the requests behind it. Oversized requests make every pool look full, so set them from measured use first. ",
            { a: "Kubernetes pod right sizing", href: "/learn/kubernetes-pod-right-sizing" },
            " shows how.",
          ],
        },
        {
          kind: "p",
          text: [
            "Then check what each pool costs. ",
            { a: "AKS cost analysis", href: "/learn/aks-cost-analysis" },
            " splits a cluster’s cost by namespace and shows its idle charges.",
          ],
        },
        {
          kind: "p",
          text: [
            "If the series or size no longer fits, a new size usually means a new pool. You create it and move the workloads across. ",
            {
              a: "How to change an AKS node pool VM size",
              href: "/learn/change-aks-node-pool-vm-size",
            },
            " gives the steps and the exceptions.",
          ],
        },
      ],
    },
    {
      id: "how-coral-works-with-your-aks-node",
      title: "How Coral works with your AKS node sizes",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " optimizes Kubernetes on AKS and EKS. It works on what decides whether a node size fits: each container’s requests, and the nodes they leave spare.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Requests." },
              " Coral rebalances each container’s CPU and memory requests to what it really uses. That changes the memory per vCPU this guide starts from.",
            ],
            [
              { b: "Spare nodes." },
              " Coral drains spare nodes one at a time, so your Cluster Autoscaler or NAP can remove them.",
            ],
            [
              { b: "Machine size, with NAP." },
              " A rebalance replaces the nodes you choose with cheaper machines that still fit the work. NAP launches them: Coral never creates machines itself.",
            ],
            [
              { b: "Cluster Autoscaler only." },
              " Coral drains spare nodes but never changes their size, so a new size still takes a new pool.",
            ],
          ],
        },
        {
          kind: "p",
          text: "A rebalance never goes past a PodDisruptionBudget. When a node is emptied, a single-copy app that can’t get a new copy first restarts briefly.",
        },
        {
          kind: "p",
          text: [
            "On our own AKS development cluster, a rebalance swapped a 4-CPU Intel worker for a cheaper 4-CPU AMD machine. The worker went from $147.46 a month to $81.03, at Azure list prices. ",
            { a: "The case study", href: "/coral-value-lab" },
            " has the full run, and ",
            { a: "AKS cost optimization", href: "/aks-cost-optimization" },
            " covers Coral on AKS.",
          ],
        },
      ],
    },
  ],
  help: {
    product: "coral",
    text: "Coral rebalances CPU and memory requests on AKS and EKS, works with your HPA, and drains spare nodes so your autoscaler can remove them. We estimate it takes 40–50% off AKS and EKS cost. It is an estimated range, not a promise. The free assessment works out your own figure.",
    links: [
      { label: "Kubernetes optimization with Coral", href: "/coral" },
      { label: "Estimate your saving", href: "/assessment?p=coral" },
    ],
  },
  sources: [
    {
      publisher: "Microsoft Learn",
      title: "“Use system node pools in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/use-system-pools",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Limits for resources, SKUs, and regions in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/quotas-skus-regions",
    },
    {
      publisher: "Microsoft Learn",
      title:
        "“Virtual Machine (VM) sizes, generations, and features for Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/aks-virtual-machine-sizes",
    },
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
      title: "“Concepts - Storage in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/concepts-storage",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Best practices for cost optimization in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/best-practices-cost",
    },
    {
      publisher: "Microsoft Azure",
      title: "“Linux Virtual Machines Pricing”",
      url: "https://azure.microsoft.com/en-us/pricing/details/virtual-machines/linux/",
    },
  ],
  related: [
    {
      title: "Kubernetes node size best practices: large or small nodes",
      where: "Learn",
      href: "/learn/kubernetes-node-size-best-practices",
    },
    {
      title: "How to change an AKS node pool VM size",
      where: "Learn",
      href: "/learn/change-aks-node-pool-vm-size",
    },
    {
      title: "AKS cost analysis: what the add-on shows and what it doesn’t",
      where: "Learn",
      href: "/learn/aks-cost-analysis",
    },
    {
      title: "AKS node auto provisioning (NAP): what it is, how to enable",
      where: "Learn",
      href: "/learn/aks-node-auto-provisioning",
    },
    {
      title: "How to choose EKS instance types",
      where: "Learn",
      href: "/learn/how-to-choose-eks-instance-types",
    },
  ],
};
