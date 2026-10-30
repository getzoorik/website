import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/change-aks-node-pool-vm-size/1";

export const article: Article = {
  slug: "change-aks-node-pool-vm-size",
  title: "How to change an AKS node pool VM size",
  meta: "To change an AKS node pool VM size, add a pool at the new size, then cordon, drain and delete the old one. Plus the in-place preview and system pool rules.",
  h1: "How to change an AKS node pool VM size",
  deck: "Outside a preview, a Scale Set node pool keeps its VM size. How to move to a new size, one node at a time.",
  card: "New pool, cordon, drain, delete: the route to a new AKS VM size, with the system pool rules and the preview.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes cost basics",
  published: "2026-11-19",
  updated: "2026-11-19",
  author: "iqbal",
  short:
    "You can’t change the VM size of an existing Azure Kubernetes Service (AKS) node pool that runs on Virtual Machine Scale Sets (VMSS), except through a preview. To change an AKS node pool VM size, add a pool at the new size, cordon and drain the old nodes within their PodDisruptionBudgets (PDBs), then delete the old pool. A system node pool takes the same route, as long as the cluster keeps a system pool throughout.",
  sections: [
    {
      id: "why-an-aks-node-pool-keeps-its",
      title: "Why an AKS node pool keeps its VM size",
      blocks: [
        {
          kind: "p",
          text: [
            "AKS node pools default to a Virtual Machine Scale Set, and AKS manages the scale set for you. Microsoft’s resize guide says resizing AKS instances directly “isn’t supported” for these pools. The AKS support policy it quotes adds that changes made outside the AKS API “won’t persist through an upgrade, scale, update, or reboot.” Resizing a node’s VM in the ",
            { code: "MC_" },
            " resource group isn’t a way around it.",
          ],
        },
        {
          kind: "p",
          text: "The VM size isn’t the only setting fixed at creation. Microsoft gives the maximum pods per node as one you change by replacing the pool, and the Azure CLI reference says the OS disk type “may not be changed for this pool after creation.”",
        },
        {
          kind: "p",
          text: "Two cases differ. A Virtual Machines node pool can hold several VM sizes, which Microsoft says you can update “using a single Azure CLI command”, and a VMSS pool can now be resized in place, in preview. Otherwise, Microsoft recommends a new pool, cordon, drain, delete.",
        },
      ],
    },
    {
      id: "choose-the-new-size-from-the-aks",
      title: "Choose the new size from the AKS VM sizes you can use",
      blocks: [
        {
          kind: "p",
          text: [
            "Most Azure VM size names read family, vCPU count, feature letters, then version, so in ",
            { code: "Standard_D4ads_v6" },
            ", ",
            { code: "D" },
            " is the family and ",
            { code: "4" },
            " is the number of vCPUs. The letters say ",
            { code: "a" },
            " for an AMD processor, ",
            { code: "d" },
            " for a local temporary disk and ",
            { code: "s" },
            " for compatibility with any Premium SSD type, and ",
            { code: "v6" },
            " is the version. A ",
            { code: "p" },
            " among the letters means an Arm-based processor.",
          ],
        },
        {
          kind: "p",
          text: "Then check four things, since any one can stop the new pool, or the pods you move onto it, from running:",
        },
        {
          kind: "ul",
          items: [
            [
              "Availability and quota. ",
              { code: "az vm list-skus --location <region> --output table" },
              " lists the sizes in a region. Microsoft gives three reasons a size can be missing: quota limits, a preview size whose flag you haven’t registered, and sizes AKS blocks by default. Both pools run while you move, so the new one needs its own vCPU quota.",
            ],
            "Minimums. On user node pools, sizes with fewer than 2\u00a0vCPUs and 2\u00a0GB of memory might not be usable by default. System pools need more.",
            [
              "Architecture. A ",
              { code: "p" },
              " size runs Arm64, and Arm64 sizes always use Generation 2 on AKS. Check that every container image the pool will run, DaemonSets included, has an Arm64 build.",
            ],
            [
              "Pinned pods. The kubelet sets the ",
              { code: "node.kubernetes.io/instance-type" },
              " label to the VM size, so a pod whose nodeSelector or node affinity names the old size can’t schedule on the new nodes and stays Pending. The Kubernetes docs advise scheduling “based on properties rather than on instance types”, such as requiring a GPU.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "The reserves AKS keeps on each node set how much of it your pods can claim, as ",
            { a: "allocatable vs capacity", href: "/learn/kubernetes-allocatable-vs-capacity" },
            " explains, and ",
            { a: "node size best practices", href: "/learn/kubernetes-node-size-best-practices" },
            " weighs a few large nodes against many small ones.",
          ],
        },
        {
          kind: "p",
          text: "If a retirement forces the change, check every pool. When a VM size reaches its retirement date, Microsoft says the VM is deallocated, which breaks the node pool. To list each pool’s size:",
        },
        {
          kind: "code",
          lang: "bash",
          code: 'az aks nodepool list \\\n  --resource-group <resource-group> \\\n  --cluster-name <cluster-name> \\\n  --query "[].{Name:name, VMSize:vmSize}" \\\n  --output table',
        },
      ],
    },
    {
      id: "how-to-change-an-aks-node-pool",
      title: "How to change an AKS node pool VM size, step by step",
      blocks: [
        {
          kind: "p",
          text: "The order is new capacity, then the pods, then the old capacity, because Microsoft notes that deleting a node pool doesn’t cordon or drain its nodes. Whether the pool runs apps or system pods, the steps to change an Azure AKS node pool VM size are the same.",
        },
        { kind: "diagram", figure: figure1 },
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
              " if it scaled. If you leave ",
              { code: "--node-osdisk-type" },
              " unset, it defaults to Ephemeral when the new VM size and OS disk size allow it, so set it if the old pool’s OS disk type must stay. Name a Linux pool with 1 to 12 lowercase letters and digits, starting with a letter.",
            ],
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "az aks nodepool add \\\n  --resource-group <resource-group> \\\n  --cluster-name <cluster-name> \\\n  --name <new-pool> \\\n  --node-vm-size <new-vm-size> \\\n  --node-count 3 \\\n  --zones 1 2 3",
        },
        {
          kind: "ol",
          start: 3,
          items: [
            [
              "Check your budgets. Every PDB needs at least 1 under ALLOWED DISRUPTIONS, or the drain stops at its pods. ",
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
            [
              "Drain the old nodes one at a time. A drain evicts every pod on the node except DaemonSet and mirror pods, and ",
              { code: "--delete-emptydir-data" },
              " deletes the data in any emptyDir volume there, so check first that none holds data you need. Microsoft notes the flag is required to evict the AKS-created coredns and metrics-server pods. Single-replica apps are down until the new pod is ready. A pod that no controller manages stops the drain, and ",
              { code: "--force" },
              " deletes it without recreating it anywhere, so move such pods yourself first.",
            ],
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
            " of 1, so the second coredns pod goes once the first is running again. ",
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
          kind: "ol",
          start: 6,
          items: ["Confirm that every pod but the DaemonSet pods now runs on the new pool."],
        },
        { kind: "code", lang: "bash", code: "kubectl get pods -o wide -A" },
        {
          kind: "ol",
          start: 7,
          items: [
            "Delete the old pool. This deletes its VMs and anything still running on them, so run it only once step 6 shows the old nodes empty.",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "az aks nodepool delete \\\n  --resource-group <resource-group> \\\n  --cluster-name <cluster-name> \\\n  --name <old-pool>",
        },
        { kind: "p", text: "You pay for both pools from step 2 until step 7 finishes." },
      ],
    },
    {
      id: "changing-the-aks-system-node-pool-vm",
      title: "Changing the AKS system node pool VM size",
      blocks: [
        {
          kind: "p",
          text: [
            "Every AKS cluster needs at least one node pool in System mode, which hosts critical system pods like CoreDNS and metrics-server. To change the AKS system node pool VM size, add the new pool with ",
            { code: "--mode System" },
            " in step 2. You can delete a system pool only while another one exists.",
          ],
        },
        {
          kind: "p",
          text: "The size rules are stricter. Microsoft’s system pool page asks for a VM size with at least 4\u00a0vCPUs and 4\u00a0GB of memory, and B-series VMs aren’t supported. The pool must support at least 30\u00a0pods and run Linux. A production cluster with a single system pool needs at least 2\u00a0nodes, and Microsoft recommends 3.",
        },
        {
          kind: "p",
          text: [
            "Adding a system pool, or switching a pool’s mode, “doesn’t automatically move system pods.” They stay where they are until your drain evicts them. AKS labels system pool nodes ",
            { code: "kubernetes.azure.com/mode: system" },
            " and prefers them when it places system pods again. To keep your apps off the new pool, give it the ",
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
          text: "If the old system pool also ran your apps, add a user pool for them before you drain, because the taint keeps them off the new one.",
        },
      ],
    },
    {
      id: "other-ways-to-change-aks-node-size",
      title: "Other ways to change AKS node size",
      blocks: [
        { kind: "h3", id: "the-in-place-resize-preview", title: "The in-place resize (preview)" },
        {
          kind: "p",
          text: [
            { code: "az aks nodepool update --node-vm-size <new-vm-size>" },
            " resizes an existing VMSS pool in one command. AKS runs it as a rolling upgrade: it surges new nodes at the target size, cordons and drains the old ones, then deletes them. It needs AKS API version ",
            { code: "2026-01-02-preview" },
            " or later and the latest ",
            { code: "aks-preview" },
            " Azure CLI extension, and the CLI reference adds that it needs a preview feature registration. Microsoft says AKS previews like this one aren’t “meant for production use.”",
          ],
        },
        {
          kind: "p",
          text: [
            "The resize reuses the upgrade engine, so the pool’s upgrade settings apply. Max surge (",
            { code: "--max-surge" },
            ") defaults to 1\u00a0node and Microsoft recommends 33% for production pools, while a pool set to ",
            { code: "--max-surge 0" },
            " gets a ",
            { code: "400 Bad Request" },
            " instead of a resize. The node drain timeout defaults to 30\u00a0minutes, and if your PDBs don’t let at least one replica go at a time, the resize can be blocked during the drain.",
          ],
        },
        {
          kind: "p",
          text: "AKS rejects an in-place resize that changes the disk controller type, the CPU architecture, confidential computing support or the hypervisor generation, or that comes with a Kubernetes version upgrade or a node count change. Those moves take the new-pool route.",
        },
        { kind: "h3", id: "node-auto-provisioning-nap", title: "Node auto-provisioning (NAP)" },
        {
          kind: "p",
          text: [
            "NAP runs Karpenter for you, and instead of one VM size per pool, a Karpenter NodePool’s requirements list what NAP may launch, such as ",
            { code: "node.kubernetes.io/instance-type In [Standard_D2s_v3]" },
            ". Change the requirements so that a running node no longer matches, and NAP marks it drifted and replaces it. Widening the list drifts nothing, because the existing nodes still fit.",
          ],
        },
        {
          kind: "p",
          text: [
            "Replacements are paced by the NodePool’s disruption budget, 10% of its nodes when you set none, and by your PDBs. A pod annotated ",
            { code: 'karpenter.sh/do-not-disrupt: "true"' },
            " holds its node back from drift. A NodePool ",
            { code: "terminationGracePeriod" },
            " bypasses PDBs and that annotation. NAP’s consolidation also removes empty or underutilized nodes and replaces nodes with cheaper variants on its own. ",
            { a: "The NAP guide", href: "/learn/aks-node-auto-provisioning" },
            " covers turning it on and the networking it needs.",
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
            " optimizes Kubernetes on AKS and EKS. It rebalances each container’s CPU and memory requests to real use, so the same autoscaler can run fewer or smaller nodes. What it does with node sizes depends on your node autoscaler:",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "With NAP:" },
              " Coral rebalances the nodes you choose onto cheaper machines that still fit the work. You compare current and rebalanced cost in a plan before you start. It expires after 1\u00a0hour. Coral creates fixed-size NodePools named zoorik-rb-…, NAP launches the new machines, and the old nodes are drained and removed one by one. The new pools stay after the run.",
            ],
            [
              { b: "With only the Cluster Autoscaler:" },
              " Coral removes nodes but never changes their size. It empties spare nodes one at a time and the autoscaler deletes them, so a new VM size still takes the route above.",
            ],
            [
              { b: "With no node autoscaler:" },
              " connecting Coral sets up NAP, with your approval. NAP needs Azure CNI rather than kubenet.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "A rebalance needs Node optimization on and the permission to remove nodes. Every AKS connect asks to set up that permission, a managed identity with the role “Zoorik Node Removal v1” on that cluster only, and to turn on the OIDC issuer if it’s off, which can’t be turned off again. A rebalance never goes past a PDB. Where it can, Coral hands a Deployment or Argo Rollout pod over warm: a new copy must be Ready and serving on another node for 5\u00a0minutes with no restarts before the old pod goes. Other pods are evicted within their PDB, and single-copy ones restart. A node that can’t be emptied within 45\u00a0minutes is kept. ",
            {
              a: "HPA vs VPA vs Cluster Autoscaler",
              href: "/learn/hpa-vs-vpa-vs-cluster-autoscaler",
            },
            " shows where request sizing sits beside the autoscalers.",
          ],
        },
        {
          kind: "p",
          text: [
            "On our own development cluster, one rebalance swapped a 4-CPU Intel worker for a cheaper 4-CPU AMD machine of the same size, chosen from Azure’s prices. Azure built the new machine in under 2\u00a0minutes. The run took 8\u00a0minutes 36\u00a0seconds from start to finish and reduced the machine bill by $66.43 a month. The 6 apps that run two copies had 0\u00a0seconds down, and each single-copy app restarted once, for 5 to 82\u00a0seconds. ",
            {
              a: "How we reduced our own cluster’s machine bill by 58%",
              href: "/case-studies/coral-dev-cluster",
            },
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
      { label: "Kubernetes cost optimization with Coral", href: "/coral" },
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
    {
      title:
        "After node and workload optimization move us from larger machines to smaller ones, how do we get back to bigger machines in a sudden surge?",
      where: "Coral FAQ",
      href: "/coral/faq#after-node-and-workload-optimization-move",
    },
  ],
};
