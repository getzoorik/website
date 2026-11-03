import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/change-aks-node-pool-vm-size/1";
import { figure as figure2 } from "@/features/learn/figures/change-aks-node-pool-vm-size/2";

export const article: Article = {
  slug: "change-aks-node-pool-vm-size",
  title: "How to change an AKS node pool VM size",
  meta: "Change an AKS node pool VM size: add a pool at the new size, then cordon, drain and delete the old one. The commands, system pool rules and the preview.",
  h1: "How to change an AKS node pool VM size",
  deck: "Both pools run until the old one is empty, so you need quota for both and pay for both.",
  card: "Add a pool at the new size, then cordon, drain and delete the old one.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes cost basics",
  published: "2026-11-01",
  updated: "2026-11-03",
  author: "iqbal",
  cover: "/learn-covers/zoorik-learn-change-aks-node-pool-vm-size-1200x630.webp",
  coverAlt:
    "Change AKS node VM size: drain the old pool, and its pods move to a new pool at the new VM size",
  short:
    "To change an AKS node pool VM size, add a pool at the new size, then cordon, drain and delete the old one. Azure Kubernetes Service (AKS) can’t resize a Virtual Machine Scale Sets (VMSS) pool in place, except in a preview. Virtual Machines node pools and node auto provisioning (NAP) change sizes without a new pool.",
  sections: [
    {
      id: "why-an-aks-node-pool-keeps-its",
      title: "Why the size is fixed",
      blocks: [
        {
          kind: "p",
          text: [
            "AKS ",
            { a: "node pools", href: "/learn/glossary/node-pool" },
            " default to VMSS, which AKS manages for you. Microsoft says resizing their instances directly “isn’t supported”. Changes made outside the AKS API “won’t persist through an upgrade, scale, update, or reboot.” That includes resizing a node’s VM yourself in the ",
            { code: "MC_" },
            " resource group.",
          ],
        },
        {
          kind: "p",
          text: [
            "The ",
            { a: "maximum pods per node", href: "/learn/glossary/max-pods-per-node" },
            " and the OS disk type are also set when a pool is created. To change either, you replace the pool.",
          ],
        },
        {
          kind: "p",
          text: [
            "Say ",
            { code: "nodepool1" },
            " runs three ",
            { code: "Standard_DS2_v2" },
            " nodes and you want ",
            { code: "Standard_D4s_v3" },
            ". You add ",
            { code: "nodepool2" },
            " at the new size, move the pods one node at a time, then delete ",
            { code: "nodepool1" },
            ".",
          ],
        },
        { kind: "p", text: "Three cases change the size without a new pool:" },
        {
          kind: "ul",
          items: [
            "With node auto provisioning (NAP), you change which sizes NAP may launch.",
            "A Virtual Machines node pool can hold several VM sizes, which Microsoft says you update “using a single Azure CLI command”.",
            "A VMSS pool can be resized in place, in preview, within limits.",
          ],
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "check-four-things-before-you-choose-from",
      title: "Checks before you switch",
      blocks: [
        { kind: "h3", id: "read-the-size-name", title: "Read the size name" },
        {
          kind: "p",
          text: [
            "Most ",
            { a: "Azure VM size names", href: "/learn/glossary/azure-vm-series" },
            " read family, vCPU count, feature letters, then version. So ",
            { code: "Standard_D4ads_v6" },
            " is the D family, 4 vCPUs, version 6.",
          ],
        },
        {
          kind: "p",
          text: [
            "Its letters mean an AMD processor (",
            { code: "a" },
            "), a local temporary disk (",
            { code: "d" },
            ") and support for any Premium SSD type (",
            { code: "s" },
            "). A ",
            { code: "p" },
            " means an Arm-based processor.",
          ],
        },
        { kind: "h3", id: "what-can-stop-the-new-pool", title: "What can stop the new pool" },
        { kind: "p", text: "Each of these can keep the new pool, or its pods, from running:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Availability and quota." },
              " ",
              { code: "az vm list-skus --location <region> --output table" },
              " lists the sizes in a region. Microsoft gives three reasons a size can be missing: quota limits, a preview size whose flag isn’t registered, and sizes AKS blocks by default.",
            ],
            [
              { b: "Minimum size." },
              " On user node pools, sizes under 2 vCPUs and 2 GB of memory might not be usable by default. System pools need more.",
            ],
            [
              { b: "Architecture." },
              " A ",
              { code: "p" },
              " size runs Arm64, and Arm64 sizes always use Generation 2 on AKS. Every image the pool runs, DaemonSets included, needs an Arm64 build.",
            ],
            [
              { b: "Pinned pods." },
              " The kubelet sets the ",
              { code: "node.kubernetes.io/instance-type" },
              " label to the VM size. A pod whose nodeSelector or node affinity names the old size stays Pending on the new nodes. Kubernetes advises scheduling “based on properties rather than on instance types”, such as requiring a GPU.",
            ],
          ],
        },
        {
          kind: "h3",
          id: "quota-cost-and-retiring-sizes",
          title: "Quota, cost and retiring sizes",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: [
            "In the example, ",
            { code: "nodepool2" },
            " adds 3 ",
            { code: "Standard_D4s_v3" },
            " nodes of 4 vCPUs each. So it needs 3 × 4 = 12 vCPUs of quota beyond what ",
            { code: "nodepool1" },
            " uses.",
          ],
        },
        {
          kind: "p",
          text: [
            "The ",
            { a: "EKS and AKS pricing calculator", href: "/eks-and-aks-pricing-calculator" },
            " prices an AKS node pool at Azure list prices. ",
            { a: "Allocatable vs capacity", href: "/learn/kubernetes-allocatable-vs-capacity" },
            " and ",
            { a: "node size best practices", href: "/learn/kubernetes-node-size-best-practices" },
            " help you pick a size.",
          ],
        },
        {
          kind: "p",
          text: "When a VM size reaches its retirement date, Microsoft says the VM is deallocated, which breaks the node pool. To check each pool’s size:",
        },
        {
          kind: "code",
          lang: "bash",
          code: 'az aks nodepool list \\\n  --resource-group <resource-group> \\\n  --cluster-name <cluster-name> \\\n  --query "[].{Name:name, VMSize:vmSize}" \\\n  --output table',
        },
      ],
    },
    {
      id: "aks-change-node-pool-vm-size",
      title: "Replace the node pool",
      blocks: [
        {
          kind: "p",
          text: "The steps are the same for user and system pools. A system pool also follows the rules in the next section.",
        },
        { kind: "svg", figure: figure2 },
        { kind: "h3", id: "prepare-the-new-pool", title: "Add the new pool" },
        {
          kind: "ol",
          items: [
            "Read the old pool’s settings. A new pool starts from the command’s defaults, 3 nodes in User mode, not from the pool it replaces.",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "az aks nodepool show \\\n  --resource-group <resource-group> \\\n  --cluster-name <cluster-name> \\\n  --name <old-pool>",
        },
        {
          kind: "ol",
          start: 2,
          items: [
            [
              "Add a pool at the new size. Carry over the old pool’s ",
              { code: "--zones" },
              ", ",
              { code: "--labels" },
              ", ",
              { code: "--node-taints" },
              " and ",
              { code: "--max-pods" },
              ". If it scaled, add ",
              { code: "--enable-cluster-autoscaler" },
              " with ",
              { code: "--min-count" },
              " and ",
              { code: "--max-count" },
              ".",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Left unset, ",
            { code: "--node-osdisk-type" },
            " defaults to ",
            { a: "Ephemeral", href: "/learn/glossary/ephemeral-os-disk" },
            " when the new VM size and OS disk size allow it. Set it if the old pool’s OS disk type must stay.",
          ],
        },
        {
          kind: "p",
          text: "A Linux pool’s name is 1 to 12 lowercase letters and digits, starting with a letter.",
        },
        {
          kind: "code",
          lang: "bash",
          code: "az aks nodepool add \\\n  --resource-group <resource-group> \\\n  --cluster-name <cluster-name> \\\n  --name <new-pool> \\\n  --node-vm-size <new-vm-size> \\\n  --node-count 3 \\\n  --zones 1 2 3",
        },
        { kind: "h3", id: "move-the-pods", title: "Move the pods" },
        {
          kind: "ol",
          start: 3,
          items: [
            [
              "Check your PodDisruptionBudgets (PDBs). Each needs at least 1 under ALLOWED DISRUPTIONS, or the drain stops at its pods. ",
              { a: "PDB best practices", href: "/learn/pod-disruption-budget-best-practices" },
              " covers how to set them.",
            ],
          ],
        },
        { kind: "code", lang: "bash", code: "kubectl get pdb -A" },
        {
          kind: "ol",
          start: 4,
          items: [
            [
              "Cordon the old nodes, so no new pods land on them. AKS node names carry the pool’s name, as in ",
              { code: "aks-nodepool1-12345678-vmss000000" },
              ".",
            ],
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl get nodes\nkubectl cordon <old-node-1> <old-node-2> <old-node-3>",
        },
        {
          kind: "ol",
          start: 5,
          items: [
            "Drain the old nodes one at a time. A drain evicts every pod except DaemonSet and mirror pods. A single-replica app is down until its new pod is ready.",
          ],
        },
        {
          kind: "p",
          text: [
            "Microsoft says ",
            { code: "--delete-emptydir-data" },
            " is required to evict the AKS-created coredns and metrics-server pods. It also deletes the data in every emptyDir volume on the node, so check that none holds data you need.",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl drain <old-node-1> --ignore-daemonsets --delete-emptydir-data",
        },
        {
          kind: "p",
          text: [
            "If the drain reports that an eviction “would violate the pod’s disruption budget”, wait. AKS’s own PDBs, such as ",
            { code: "coredns-pdb" },
            ", have a ",
            { code: "MinAvailable" },
            " of 1. The second coredns pod goes once the first is running again.",
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            "A pod that no controller manages stops the drain. ",
            { code: "--force" },
            " deletes it, and nothing recreates it, so move such pods yourself first.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Cordon vs drain", href: "/learn/cordon-vs-drain" },
            " explains both commands in full.",
          ],
        },
        {
          kind: "ol",
          start: 6,
          items: ["Confirm that every pod but the DaemonSet pods now runs on the new pool."],
        },
        { kind: "code", lang: "bash", code: "kubectl get pods -o wide -A" },
        { kind: "h3", id: "delete-the-old-pool", title: "Delete the old pool" },
        {
          kind: "ol",
          start: 7,
          items: [
            "Delete the old pool. Microsoft notes that a delete doesn’t cordon or drain. It removes the VMs and whatever still runs on them, so run it only once step 6 shows the old nodes empty.",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "az aks nodepool delete \\\n  --resource-group <resource-group> \\\n  --cluster-name <cluster-name> \\\n  --name <old-pool>",
        },
      ],
    },
    {
      id: "the-aks-system-node-pool-vm-size",
      title: "System node pools",
      blocks: [
        {
          kind: "p",
          text: "Every AKS cluster needs at least one node pool in System mode, for critical system pods like CoreDNS and metrics-server. You can delete a system pool only while another one exists.",
        },
        {
          kind: "p",
          text: [
            "To change a system pool’s VM size, add the new pool with ",
            { code: "--mode System" },
            " in step 2. Microsoft sets these rules for a system pool:",
          ],
        },
        {
          kind: "ul",
          items: [
            "A VM size with at least 4 vCPUs and 4 GB of memory.",
            [
              { a: "B-series VMs", href: "/learn/glossary/burstable-instance" },
              " aren’t supported.",
            ],
            "Linux only, with room for at least 30 pods.",
            "For production, at least 2 nodes, and Microsoft recommends 3.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "How to choose AKS VM sizes", href: "/learn/how-to-choose-aks-node-sizes" },
            " covers which size to pick within these rules.",
          ],
        },
        {
          kind: "p",
          text: [
            "Adding a system pool “doesn’t automatically move system pods”. They stay until your drain evicts them. AKS labels system pool nodes ",
            { code: "kubernetes.azure.com/mode: system" },
            " and prefers them for system pods.",
          ],
        },
        {
          kind: "p",
          text: [
            "To keep your apps off the new pool, give it the ",
            { code: "CriticalAddonsOnly=true:NoSchedule" },
            " taint:",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "az aks nodepool add \\\n  --resource-group <resource-group> \\\n  --cluster-name <cluster-name> \\\n  --name <new-system-pool> \\\n  --node-vm-size <new-vm-size> \\\n  --node-count 3 \\\n  --node-taints CriticalAddonsOnly=true:NoSchedule \\\n  --mode System",
        },
        {
          kind: "p",
          text: "If the old system pool also ran your apps, add a user pool for them before you drain.",
        },
      ],
    },
    {
      id: "two-other-ways-to-change-aks-node",
      title: "In-place resize and NAP",
      blocks: [
        { kind: "h3", id: "the-in-place-resize-preview", title: "In-place resize (preview)" },
        {
          kind: "p",
          text: [
            { code: "az aks nodepool update --node-vm-size <new-vm-size>" },
            " resizes an existing VMSS pool in one command. AKS runs it as a rolling upgrade: it adds nodes at the new size, cordons and drains the old ones, then deletes them.",
          ],
        },
        {
          kind: "p",
          text: [
            "It needs AKS API version ",
            { code: "2026-01-02-preview" },
            " or later, the latest ",
            { code: "aks-preview" },
            " Azure CLI extension and a registered preview feature. Microsoft says AKS previews aren’t “meant for production use.”",
          ],
        },
        {
          kind: "p",
          text: "The resize reuses the upgrade engine, so the pool’s upgrade settings apply:",
        },
        {
          kind: "ul",
          items: [
            [
              "Max surge (",
              { code: "--max-surge" },
              ") defaults to 1 node. Microsoft recommends 33% for production pools.",
            ],
            [
              "A pool set to ",
              { code: "--max-surge 0" },
              " gets a ",
              { code: "400 Bad Request" },
              " instead of a resize.",
            ],
            "The node drain timeout defaults to 30 minutes.",
          ],
        },
        {
          kind: "p",
          text: "Your PDBs must let at least one replica go at a time, or they can block the drain.",
        },
        { kind: "p", text: "AKS rejects an in-place resize that changes any of these:" },
        {
          kind: "ul",
          items: [
            "Disk controller type",
            "CPU architecture",
            "Confidential computing support",
            "Hypervisor generation",
          ],
        },
        {
          kind: "p",
          text: "It also rejects a resize combined with a Kubernetes version upgrade or a node count change.",
        },
        { kind: "h3", id: "node-auto-provisioning-nap", title: "Node auto provisioning (NAP)" },
        {
          kind: "p",
          text: [
            "NAP runs Karpenter for you. Instead of one VM size per pool, a Karpenter NodePool’s requirements list the sizes NAP may launch, such as ",
            { code: "node.kubernetes.io/instance-type In [Standard_D2s_v3]" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "Narrow that list, and NAP marks each node that no longer fits as drifted and replaces it. Widening the list drifts nothing, because the existing nodes still fit.",
        },
        {
          kind: "p",
          text: "Replacements are paced by the NodePool’s disruption budget, 10% of its nodes when none is set, and by your PDBs. NAP’s consolidation also removes empty or underused nodes, and replaces nodes with cheaper ones.",
        },
        {
          kind: "callout",
          label: "For engineers",
          text: [
            "A pod with the annotation ",
            { code: "karpenter.sh/do-not-disrupt" },
            " set to ",
            { code: '"true"' },
            " holds its node back from drift. A NodePool ",
            { code: "terminationGracePeriod" },
            " bypasses PDBs and that annotation.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "The NAP guide", href: "/learn/aks-node-auto-provisioning" },
            " covers turning it on and the networking it needs.",
          ],
        },
      ],
    },
    {
      id: "how-coral-moves-aks-nodes-onto-cheaper",
      title: "How Coral rebalances AKS nodes",
      blocks: [
        {
          kind: "p",
          text: [
            "Neither NAP nor the Cluster Autoscaler changes pod requests. ",
            { a: "Coral", href: "/coral" },
            " rebalances CPU and memory requests to real use on AKS and EKS, without any downtime. The same autoscaler can then run fewer or smaller nodes. What Coral does with your nodes depends on your autoscaler:",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "With NAP:" },
              " you compare current and rebalanced cost in a plan before you start. Coral creates fixed-size NodePools, NAP launches the new machines, and the old nodes are drained and removed one by one. The new pools stay after the run.",
            ],
            [
              { b: "With only the Cluster Autoscaler:" },
              " Coral empties spare nodes one at a time without changing their size, and the autoscaler deletes them. To change a pool’s VM size, use the steps above.",
            ],
            [
              { b: "With no node autoscaler:" },
              " connecting Coral sets up NAP, with your approval. NAP needs Azure CNI, not kubenet.",
            ],
          ],
        },
        {
          kind: "p",
          text: "A rebalance needs Node optimization on and the permission to remove nodes, which connecting Coral asks to set up. It never goes past a PDB, and a node that can’t be emptied in time is kept.",
        },
        {
          kind: "p",
          text: "Coral moves each pod by warm handover, by live migration where both nodes support it, or by eviction within its PDB. In a warm handover, a new copy of a Deployment or Argo Rollout pod starts on another node first. The old pod goes only once the copy is Ready and serving, with no restarts.",
        },
        {
          kind: "p",
          text: [
            { a: "AKS cost optimization", href: "/aks-cost-optimization" },
            " covers the rest of Coral on AKS. ",
            { a: "Kubernetes autoscaling", href: "/learn/kubernetes-autoscaling" },
            " shows where request sizing sits beside the autoscalers.",
          ],
        },
        { kind: "h3", id: "what-one-rebalance-showed", title: "What one rebalance showed" },
        {
          kind: "p",
          text: "On our own development cluster, one rebalance replaced a 4-CPU Intel worker with a cheaper 4-CPU AMD machine, chosen from Azure’s prices. The run took 8 minutes 36 seconds and reduced the cluster’s machine cost by $66.43 a month.",
        },
        {
          kind: "p",
          text: [
            "The 6 apps that run two copies had 0 seconds of downtime. ",
            { a: "The case study", href: "/coral-value-lab" },
            " times every app in the run.",
          ],
        },
      ],
    },
  ],
  help: {
    product: "coral",
    text: "Coral rebalances CPU and memory requests on AKS and EKS, works with your HPA, and removes the nodes you don’t need, without any downtime. We estimate 40–50% off AKS and EKS cost, a range rather than a promise. The free assessment works out your own figure.",
    links: [
      { label: "Kubernetes optimization with Coral", href: "/coral" },
      { label: "Estimate your saving", href: "/assessment?p=coral" },
    ],
  },
  sources: [
    {
      publisher: "Microsoft Learn",
      title: "“Resize node pools in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/resize-node-pool",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Use system node pools in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/use-system-pools",
    },
    {
      publisher: "Microsoft Learn",
      title: "“az aks nodepool”",
      url: "https://learn.microsoft.com/en-us/cli/azure/aks/nodepool",
      note: " (Azure CLI reference)",
    },
    {
      publisher: "Microsoft Learn",
      title:
        "“Virtual Machine (VM) sizes, generations, and features for Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/aks-virtual-machine-sizes",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Azure VM sizes naming conventions”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/vm-naming-conventions",
    },
    {
      publisher: "Microsoft Learn",
      title:
        "“Configure disruption policies for node auto-provisioning (NAP) nodes in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/node-auto-provisioning-disruption",
    },
    {
      publisher: "Kubernetes",
      title: "“kubectl drain”",
      url: "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_drain/",
    },
    {
      publisher: "Kubernetes",
      title: "“Well-Known Labels, Annotations and Taints”",
      url: "https://kubernetes.io/docs/reference/labels-annotations-taints/",
    },
  ],
  related: [
    {
      title: "How to choose AKS VM sizes",
      where: "Learn",
      href: "/learn/how-to-choose-aks-node-sizes",
    },
    {
      title: "kubectl drain without any downtime",
      where: "Learn",
      href: "/learn/kubernetes-drain-node-without-downtime",
    },
    {
      title: "How to change an EKS node group instance type",
      where: "Learn",
      href: "/learn/change-eks-node-group-instance-type",
    },
    {
      title: "AKS node auto provisioning (NAP)",
      where: "Learn",
      href: "/learn/aks-node-auto-provisioning",
    },
  ],
  relatedTitle: "More on AKS node pools",
};
