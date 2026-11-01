import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/change-aks-node-pool-vm-size/1";
import { figure as figure2 } from "@/features/learn/figures/change-aks-node-pool-vm-size/2";

export const article: Article = {
  slug: "change-aks-node-pool-vm-size",
  title: "How to change an AKS node pool VM size",
  meta: "Change an AKS node pool VM size with az aks nodepool add, then cordon, drain and delete the old pool. The same steps change the AKS system node pool VM size.",
  h1: "How to change an AKS node pool VM size",
  deck: "Outside a preview, a Scale Set node pool keeps its VM size. How to move to a new size, one node at a time.",
  card: "New pool, cordon, drain, delete: the route to a new AKS VM size, with the system pool rules and the preview.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes cost basics",
  published: "2026-11-01",
  updated: "2026-11-01",
  author: "iqbal",
  cover: "/learn-covers/zoorik-learn-change-aks-node-pool-vm-size-1200x630.webp",
  coverAlt:
    "Change AKS node VM size: drain the old pool, and its pods move to a new pool at the new VM size",
  short:
    "To change an AKS node pool VM size, add a pool at the new size, then cordon, drain and delete the old one. Outside a preview, Azure Kubernetes Service (AKS) can’t resize a Virtual Machine Scale Sets (VMSS) pool in place.",
  sections: [
    {
      id: "why-an-aks-node-pool-keeps-its",
      title: "Why an AKS node pool keeps its VM size",
      blocks: [
        {
          kind: "p",
          text: [
            "Picture ",
            { code: "nodepool1" },
            ", three ",
            { code: "Standard_DS2_v2" },
            " nodes that you want on ",
            { code: "Standard_D4s_v3" },
            ". You add ",
            { code: "nodepool2" },
            " at the new size and move the pods across, one node at a time. You delete ",
            { code: "nodepool1" },
            " once it’s empty, and until then you pay for both pools.",
          ],
        },
        {
          kind: "p",
          text: [
            "AKS ",
            { a: "node pools", href: "/learn/glossary/node-pool" },
            " default to VMSS, which AKS manages for you. Microsoft’s resize guide says resizing AKS instances directly “isn’t supported” for these pools. It also quotes the AKS support policy: changes made outside the AKS API “won’t persist through an upgrade, scale, update, or reboot.”",
          ],
        },
        {
          kind: "p",
          text: [
            "Resizing a node’s VM yourself in the ",
            { code: "MC_" },
            " resource group isn’t a way around it.",
          ],
        },
        {
          kind: "p",
          text: [
            "The ",
            { a: "maximum pods per node", href: "/learn/glossary/max-pods-per-node" },
            " and the OS disk type are fixed at creation too. Microsoft says you change the first by replacing the pool. For the second, the Azure CLI reference says it “may not be changed for this pool after creation.”",
          ],
        },
        { kind: "p", text: "Three cases change the size without a new pool:" },
        {
          kind: "ul",
          items: [
            "With node auto provisioning (NAP), you change what NAP may launch.",
            "A Virtual Machines node pool can hold several VM sizes, which Microsoft says you can update “using a single Azure CLI command”.",
            "A VMSS pool can be resized in place, in preview, within limits.",
          ],
        },
        { kind: "p", text: "Otherwise, Microsoft recommends a new pool, cordon, drain, delete." },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "check-four-things-before-you-choose-from",
      title: "Check four things before you choose from the AKS VM sizes",
      blocks: [
        { kind: "h3", id: "read-the-size-name", title: "Read the size name" },
        {
          kind: "p",
          text: [
            "Most ",
            { a: "Azure VM size names", href: "/learn/glossary/azure-vm-series" },
            " read family, vCPU count, feature letters, then version. So ",
            { code: "Standard_D4ads_v6" },
            " is the D family, 4\u00a0vCPUs and version 6.",
          ],
        },
        {
          kind: "p",
          text: [
            "Its letters mean an AMD processor (",
            { code: "a" },
            "), a local temporary disk (",
            { code: "d" },
            ") and compatibility with any Premium SSD type (",
            { code: "s" },
            "). A ",
            { code: "p" },
            " among the letters means an Arm-based processor.",
          ],
        },
        { kind: "h3", id: "what-can-stop-the-new-pool", title: "What can stop the new pool" },
        { kind: "p", text: "Each of these four can keep the new pool or its pods from running:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Check availability and quota." },
              " ",
              { code: "az vm list-skus --location <region> --output table" },
              " lists the sizes in a region. Microsoft gives three reasons a size can be missing: quota limits, a preview size whose flag isn’t registered, and sizes AKS blocks by default.",
            ],
            [
              { b: "Check the minimums." },
              " On user node pools, sizes with fewer than 2\u00a0vCPUs and 2\u00a0GB of memory might not be usable by default. System pools need more.",
            ],
            [
              { b: "Match the architecture." },
              " A ",
              { code: "p" },
              " size runs Arm64, and Arm64 sizes always use Generation 2 on AKS. Check that every container image the pool will run, DaemonSets included, has an Arm64 build.",
            ],
            [
              { b: "Find pinned pods." },
              " The kubelet sets the ",
              { code: "node.kubernetes.io/instance-type" },
              " label to the VM size. A pod whose nodeSelector or node affinity names the old size can’t schedule on the new nodes, so it stays Pending. The Kubernetes docs advise scheduling “based on properties rather than on instance types”, such as requiring a GPU.",
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
            "In the opening case, step 2 adds 3 ",
            { code: "Standard_D4s_v3" },
            " nodes, each with 4\u00a0vCPUs by its name. Both pools run while you move, so ",
            { code: "nodepool2" },
            " needs 3 × 4 = 12\u00a0vCPUs of quota beyond what ",
            { code: "nodepool1" },
            " uses.",
          ],
        },
        {
          kind: "p",
          text: [
            "The ",
            { a: "EKS and AKS pricing calculator", href: "/eks-and-aks-pricing-calculator" },
            " prices an AKS node pool at Azure list prices, so you can compare the sizes it lists. ",
            { a: "Allocatable vs capacity", href: "/learn/kubernetes-allocatable-vs-capacity" },
            " explains how the reserves AKS keeps on each node set what your pods can claim. ",
            { a: "Node size best practices", href: "/learn/kubernetes-node-size-best-practices" },
            " weighs a few large nodes against many small ones.",
          ],
        },
        {
          kind: "p",
          text: "When a VM size reaches its retirement date, Microsoft says the VM is deallocated, which breaks the node pool. Check every pool’s size:",
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
      title: "How to change an AKS node pool VM size, step by step",
      blocks: [
        {
          kind: "p",
          text: "The steps to change an Azure AKS node pool VM size are the same for user and system pools. New nodes come first, then the pods, then the old pool.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "h3",
          id: "prepare-the-new-pool",
          title: "Prepare the new pool with az aks nodepool add",
        },
        {
          kind: "ol",
          items: [
            "Read the old pool’s settings. A new pool starts from the command’s defaults, which are 3\u00a0nodes in User mode, not from the pool it replaces.",
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
              "Add a pool at the new size. Carry over what the old pool had: ",
              { code: "--zones" },
              ", ",
              { code: "--labels" },
              ", ",
              { code: "--node-taints" },
              ", ",
              { code: "--max-pods" },
              ", and ",
              { code: "--enable-cluster-autoscaler" },
              " with ",
              { code: "--min-count" },
              " and ",
              { code: "--max-count" },
              " if it scaled.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "If you leave ",
            { code: "--node-osdisk-type" },
            " unset, it defaults to ",
            { a: "Ephemeral", href: "/learn/glossary/ephemeral-os-disk" },
            " when the new VM size and OS disk size allow it. Set it if the old pool’s OS disk type must stay. Name a Linux pool with 1 to 12 lowercase letters and digits, starting with a letter.",
          ],
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
              "Check your PodDisruptionBudgets (PDBs). Every PDB needs at least 1 under ALLOWED DISRUPTIONS, or the drain stops at its pods. ",
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
            "Drain the old nodes one at a time. A drain evicts every pod on the node except DaemonSet and mirror pods. Single-replica apps are down until the new pod is ready.",
          ],
        },
        {
          kind: "p",
          text: [
            "Microsoft notes that ",
            { code: "--delete-emptydir-data" },
            " is required to evict the AKS-created coredns and metrics-server pods. The flag also deletes the data in any emptyDir volume on the node. Check first that none holds data you need.",
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
            "If a drain reports that an eviction “would violate the pod’s disruption budget”, give it time. AKS’s own PDBs, such as ",
            { code: "coredns-pdb" },
            ", have a ",
            { code: "MinAvailable" },
            " of 1. So the second coredns pod goes once the first is running again.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Cordon vs drain", href: "/learn/cordon-vs-drain" },
            " and ",
            {
              a: "draining without downtime",
              href: "/learn/kubernetes-drain-node-without-downtime",
            },
            " go further.",
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            "A pod that no controller manages stops the drain. With ",
            { code: "--force" },
            ", the drain deletes it without recreating it anywhere, so move such pods yourself first.",
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
            "Delete the old pool. A delete doesn’t cordon or drain the nodes, Microsoft notes. It deletes their VMs and anything still running on them, so run it only once step 6 shows the old nodes empty.",
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
      title: "How to change the AKS system node pool VM size",
      blocks: [
        {
          kind: "p",
          text: "Every AKS cluster needs at least one node pool in System mode. It hosts critical system pods like CoreDNS and metrics-server. You can delete a system pool only while another one exists.",
        },
        {
          kind: "p",
          text: [
            "To change the AKS system node pool VM size, add the new pool with ",
            { code: "--mode System" },
            " in step 2. Microsoft’s system pool page sets these rules for it:",
          ],
        },
        {
          kind: "ul",
          items: [
            "The VM size has at least 4\u00a0vCPUs and 4\u00a0GB of memory.",
            [
              { a: "B-series VMs", href: "/learn/glossary/burstable-instance" },
              " aren’t supported.",
            ],
            "The pool supports at least 30\u00a0pods and runs Linux.",
            "A production cluster with a single system pool needs at least 2\u00a0nodes, and Microsoft recommends 3.",
          ],
        },
        {
          kind: "p",
          text: [
            "Which size to pick within these rules: ",
            {
              a: "how to choose the AKS system node pool size",
              href: "/learn/how-to-choose-aks-node-sizes",
            },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "Adding a system pool, or switching a pool’s mode, “doesn’t automatically move system pods”. They stay put until your drain evicts them. AKS labels system pool nodes ",
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
          text: "If the old system pool also ran your apps, add a user pool for them before you drain. The taint keeps them off the new one.",
        },
      ],
    },
    {
      id: "two-other-ways-to-change-aks-node",
      title: "Two other ways to change AKS node size",
      blocks: [
        { kind: "h3", id: "the-in-place-resize-preview", title: "The in-place resize (preview)" },
        {
          kind: "p",
          text: [
            { code: "az aks nodepool update --node-vm-size <new-vm-size>" },
            " resizes an existing VMSS pool in one command. AKS runs it as a rolling upgrade. It surges new nodes at the target size, cordons and drains the old ones, then deletes them.",
          ],
        },
        {
          kind: "p",
          text: [
            "You need AKS API version ",
            { code: "2026-01-02-preview" },
            " or later and the latest ",
            { code: "aks-preview" },
            " Azure CLI extension. The CLI reference adds that you must register a preview feature too. Microsoft says AKS previews aren’t “meant for production use.”",
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
              ") defaults to 1\u00a0node, and Microsoft recommends 33% for production pools.",
            ],
            [
              "A pool set to ",
              { code: "--max-surge 0" },
              " gets a ",
              { code: "400 Bad Request" },
              " instead of a resize.",
            ],
            "The node drain timeout defaults to 30\u00a0minutes.",
          ],
        },
        {
          kind: "p",
          text: "PDBs that don’t let at least one replica go at a time can block the resize during the drain.",
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
          text: "It also rejects one that comes with a Kubernetes version upgrade or a node count change.",
        },
        { kind: "h3", id: "node-auto-provisioning-nap", title: "Node auto provisioning (NAP)" },
        {
          kind: "p",
          text: [
            "NAP runs Karpenter for you. Instead of one VM size per pool, a Karpenter NodePool’s requirements list what NAP may launch, such as ",
            { code: "node.kubernetes.io/instance-type In [Standard_D2s_v3]" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "If a running node no longer matches the changed requirements, NAP marks it drifted and replaces it. Widening the list drifts nothing, because the existing nodes still fit.",
        },
        {
          kind: "p",
          text: [
            "Replacements are paced by the NodePool’s disruption budget, 10% of its nodes when you set none, and by your PDBs. NAP’s consolidation also removes empty or underutilized nodes, and replaces nodes with cheaper variants on its own. ",
            { a: "The NAP guide", href: "/learn/aks-node-auto-provisioning" },
            " covers turning it on and the networking it needs.",
          ],
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
      ],
    },
    {
      id: "how-coral-moves-aks-nodes-onto-cheaper",
      title: "How Coral moves AKS nodes onto cheaper machines",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " optimizes Kubernetes on AKS and EKS. It rebalances each container’s CPU and memory requests to real use, so the same autoscaler can run fewer or smaller nodes.",
          ],
        },
        {
          kind: "h3",
          id: "what-coral-does-with-node-sizes",
          title: "What Coral does with node sizes",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "With NAP:" },
              " Coral rebalances the nodes you choose onto cheaper machines that still fit the work. You compare current and rebalanced cost in a plan before you start. Coral creates fixed-size NodePools, NAP launches the new machines, and the old nodes are drained and removed one by one. The new pools stay after the run.",
            ],
            [
              { b: "With only the Cluster Autoscaler:" },
              " Coral empties spare nodes one at a time but never changes their size. The autoscaler deletes them, so a new VM size still takes the route above.",
            ],
            [
              { b: "With no node autoscaler:" },
              " connecting Coral sets up NAP, with your approval. NAP needs Azure CNI rather than kubenet.",
            ],
          ],
        },
        {
          kind: "p",
          text: "A rebalance needs Node optimization on and the permission to remove nodes, which connect asks to set up.",
        },
        {
          kind: "p",
          text: "A rebalance never goes past a PDB, and a node that can’t be emptied in time is kept. Where it can, Coral starts a new copy of a Deployment or Argo Rollout pod on another node first. The new copy must be Ready and serving, with no restarts, before the old pod goes.",
        },
        {
          kind: "p",
          text: [
            "Other pods are evicted within their PDB, and single-copy ones restart. ",
            {
              a: "HPA vs VPA vs Cluster Autoscaler",
              href: "/learn/kubernetes-autoscaling",
            },
            " shows where request sizing sits beside the autoscalers. ",
            { a: "AKS cost optimization", href: "/aks-cost-optimization" },
            " covers the rest of Coral on AKS.",
          ],
        },
        { kind: "h3", id: "what-one-rebalance-showed", title: "What one rebalance showed" },
        {
          kind: "p",
          text: "On our own development cluster, one rebalance swapped a 4-CPU Intel worker for a cheaper 4-CPU AMD machine of the same size. Coral chose it from Azure’s prices, and Azure built it in under 2\u00a0minutes. The run took 8\u00a0minutes 36\u00a0seconds and reduced the cluster’s machine cost by $66.43 a month.",
        },
        {
          kind: "p",
          text: [
            "The 6 apps that run two copies had 0\u00a0seconds down. Each single-copy app restarted once, for 5 to 82\u00a0seconds. ",
            { a: "How we reduced AKS cluster costs by 58%", href: "/coral-value-lab" },
            " has the full run.",
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
      title: "How to drain a Kubernetes node without downtime",
      where: "Learn",
      href: "/learn/kubernetes-drain-node-without-downtime",
    },
    {
      title: "How to change an EKS node group instance type",
      where: "Learn",
      href: "/learn/change-eks-node-group-instance-type",
    },
    {
      title: "AKS node auto provisioning (NAP): what it is, how to enable",
      where: "Learn",
      href: "/learn/aks-node-auto-provisioning",
    },
  ],
};
