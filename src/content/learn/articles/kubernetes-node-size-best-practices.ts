import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/kubernetes-node-size-best-practices/1";
import { figure as figure2 } from "@/features/learn/figures/kubernetes-node-size-best-practices/2";

export const article: Article = {
  slug: "kubernetes-node-size-best-practices",
  title: "Kubernetes node size best practices on AKS and EKS",
  meta: "Kubernetes node size best practices: what large and small nodes cost on AKS and EKS, the pod and reserve limits behind them, and how to size each pool.",
  h1: "Kubernetes node size best practices: large or small nodes",
  deck: "Big nodes spread each node’s fixed overhead. Small nodes are cheaper to leave idle and easier to empty.",
  card: "Large or small nodes: the reserves, pod limits and autoscaler rules that decide the right size per pool.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes cost basics",
  published: "2026-11-01",
  updated: "2026-11-01",
  author: "soumya",
  cover: "/learn-covers/zoorik-learn-kubernetes-node-size-best-practices-1200x630.webp",
  coverAlt:
    "Kubernetes node size: small nodes or a large node, with resources reserved on every node",
  short:
    "Kubernetes node size best practices come down to one trade-off: larger nodes spread fixed overhead, while smaller ones leave less idle and empty more easily. AWS advises the largest nodes your workloads can fully use that still meet your availability goals.",
  sections: [
    {
      id: "fewer-larger-nodes-pay-the-per-node",
      title: "Fewer, larger nodes pay the per-node overhead fewer times",
      blocks: [
        { kind: "p", text: "Every node carries a fixed overhead, whatever it runs:" },
        {
          kind: "ul",
          items: [
            "its reserved CPU and memory",
            ["a copy of every ", { a: "DaemonSet", href: "/learn/glossary/daemonset" }],
            "its load on the API server",
          ],
        },
        {
          kind: "p",
          text: "Picture an AKS pool of 16\u00a0cores and 64\u00a0GB. Built from four 4-core, 16\u00a0GB nodes, it reserves more than twice the CPU and three times the memory of one 16-core, 64\u00a0GB node. It also runs four copies of every DaemonSet instead of one.",
        },
        {
          kind: "h3",
          id: "how-the-reserve-scales-with-node-size",
          title: "How the reserve scales with node size",
        },
        {
          kind: "p",
          text: [
            "The reserve is the CPU and memory kept back for the kubelet and other system components. Pods can claim only what’s left, the node’s ",
            { a: "allocatable", href: "/learn/kubernetes-allocatable-vs-capacity" },
            ". You pay for the reserve, and no pod can request it.",
          ],
        },
        {
          kind: "p",
          text: "For Kubernetes node sizing, what matters is how that reserve scales with the machine. On AKS, the CPU reserve grows much more slowly than the node. Microsoft’s table gives 140\u00a0millicores (written 140m, each a thousandth of a core) on a 4-core node, 260m on 16\u00a0cores and 740m on 64.",
        },
        { kind: "p", text: "That’s 3.5%, 1.6% and 1.2% of each node." },
        {
          kind: "p",
          text: [
            "Memory works differently on AKS 1.29 and later. Kube-reserved memory mostly follows ",
            { a: "max pods", href: "/learn/glossary/max-pods-per-node" },
            ", not node size. Microsoft’s formula is 20\u00a0MB per max pod plus 50\u00a0MB, or 25% of the node’s memory, whichever is less.",
          ],
        },
        {
          kind: "p",
          text: "At the Azure CNI Overlay default of 250 max pods, the formula gives 5,050\u00a0MB. Max pods is set per pool at creation, and raising it takes a new pool. So plan that reserve for the pool’s life.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "At 250 max pods, each small node reserves 140m of CPU and hits the 25% memory cap at 4\u00a0GB. Four of them reserve 4 × 140m = 560m and 4 × 4\u00a0GB = 16\u00a0GB, a quarter of their memory.",
        },
        {
          kind: "p",
          text: "One large node in their place reserves 260m and 5,050\u00a0MB, about 8% of its memory.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "h3",
          id: "every-node-runs-its-own-daemonset-pods",
          title: "Every node runs its own DaemonSet pods",
        },
        {
          kind: "p",
          text: "A DaemonSet runs one copy of its pod on every node, or on a chosen set. The EKS user guide says “fewer, larger instances are better, especially if you have a lot of Daemonsets”. Each instance also adds calls to the API server.",
        },
      ],
    },
    {
      id: "large-nodes-are-harder-to-fill-and",
      title: "Large nodes are harder to fill and to empty, and costlier to lose",
      blocks: [
        {
          kind: "h3",
          id: "pod-slots-can-run-out-before-cpu",
          title: "Pod slots can run out before CPU does",
        },
        {
          kind: "p",
          text: "Take a 64-core AKS node at 110 max pods. It has at most 63.26\u00a0cores allocatable, 64\u00a0cores less the 740m reserve. To fill it, its pods must average about 575m of CPU each.",
        },
        {
          kind: "p",
          text: "Pods that request 100m each take all 110 slots with 11\u00a0cores requested (110 × 100m). That leaves 52.26\u00a0cores, most of the machine, unrequested.",
        },
        { kind: "svg", figure: figure2 },
        { kind: "p", text: "Max pods depends on the cloud and its settings:" },
        {
          kind: "ul",
          items: [
            "AKS defaults to 250 max pods on Azure CNI Overlay and 110 on Azure CNI Pod subnet and kubenet. Its ceiling is 250.",
            "On EKS, a managed node group without a custom AMI caps max pods at 110 below 30\u00a0vCPUs and 250 above.",
            [
              { a: "EKS Auto Mode", href: "/learn/glossary/eks-auto-mode" },
              " holds every node to 110 or fewer.",
            ],
          ],
        },
        {
          kind: "p",
          text: "AWS also notes that each instance type caps the EBS volumes it can attach. A node full of pods with their own volumes can reach that cap first.",
        },
        {
          kind: "h3",
          id: "node-autoscalers-buy-capacity-a-whole-node",
          title: "Node autoscalers buy capacity a whole node at a time",
        },
        {
          kind: "p",
          text: "One pending pod that requests 500m, in a node group of 64-core machines, brings up 64 more cores. You pay for all of them until work arrives to fill them.",
        },
        {
          kind: "p",
          text: "With the Cluster Autoscaler, the group fixes that step, because “Inside a node group, all machines have identical capacity”. Its expander chooses only among the groups you’ve defined.",
        },
        {
          kind: "h3",
          id: "a-large-node-is-harder-to-empty",
          title: "A large node is harder to empty",
        },
        { kind: "p", text: "The Cluster Autoscaler removes a node only when both of these hold:" },
        {
          kind: "ul",
          items: [
            "its pods’ CPU and memory requests are each under 50% of its allocatable, the default utilization threshold, which you can change",
            "every pod on it, other than DaemonSet and static pods, can move",
          ],
        },
        {
          kind: "p",
          text: [
            "One pod that can’t move keeps the whole machine, and every extra pod is one more chance of that. Each blocker is covered in ",
            {
              a: "Cluster Autoscaler not scaling down",
              href: "/learn/cluster-autoscaler-not-scaling-down",
            },
            ".",
          ],
        },
        {
          kind: "callout",
          label: "For engineers",
          text: [
            "A pod can’t move when it has no controller, a ",
            { a: "PodDisruptionBudget", href: "/learn/glossary/pod-disruption-budget" },
            " (PDB) that allows no disruption, or a ",
            { code: "cluster-autoscaler.kubernetes.io/safe-to-evict" },
            " annotation of ",
            { code: '"false"' },
            ". Local storage such as emptyDir or hostPath also keeps the machine while ",
            { code: "skip-nodes-with-local-storage" },
            " is true, the upstream default.",
          ],
        },
        {
          kind: "h3",
          id: "one-failure-takes-more-with-it",
          title: "One failure takes more with it",
        },
        {
          kind: "p",
          text: "In AWS’s example of a cluster of three very large instances, “1 instance outage could impact 1/3 of the cluster”. Spread the same capacity over nine nodes and one outage takes a ninth.",
        },
      ],
    },
    {
      id: "kubernetes-node-size-best-practices",
      title: "Kubernetes node size best practices: what AKS and EKS recommend",
      blocks: [
        {
          kind: "p",
          text: "There’s no single Kubernetes recommended node size, but both clouds publish a starting point.",
        },
        {
          kind: "p",
          text: [
            "On AKS, a system node pool needs a VM of at least 4\u00a0vCPUs and 4\u00a0GB of memory. ",
            { a: "B-series burstable VMs", href: "/learn/glossary/burstable-instance" },
            " aren’t supported there.",
          ],
        },
        {
          kind: "p",
          text: "The recommended minimum is higher: three system nodes of 8\u00a0vCPUs, or two of at least 16. That applies especially to large clusters with several CoreDNS replicas and add-ons.",
        },
        {
          kind: "p",
          text: "Microsoft also says system pools shouldn’t run your applications. So Kubernetes worker node sizing happens in your user pools.",
        },
        {
          kind: "p",
          text: "On EKS, AWS’s scalability guidance recommends slightly larger nodes, 4xlarge to 12xlarge, so less of each node goes to DaemonSets and system reserves.",
        },
        {
          kind: "p",
          text: "The guidance stops below the very large sizes with non-uniform memory access (NUMA). Most applications needn’t pay their performance cost, since Kubernetes scales out. AWS also advises against burstable T-series instances where performance must be consistent.",
        },
      ],
    },
    {
      id: "how-to-choose-kubernetes-node-sizes-for",
      title: "How to choose Kubernetes node sizes for each pool",
      blocks: [
        {
          kind: "p",
          text: [
            "A Kubernetes node size calculator is five lines of arithmetic. Do it per pool, with your own requests. The scheduler places pods by their ",
            { a: "requests", href: "/learn/glossary/kubernetes-resource-requests" },
            ", not by what they use.",
          ],
        },
        {
          kind: "ol",
          items: [
            [
              { b: "Find the room for your pods" },
              " on a candidate size. That’s its ",
              { a: "allocatable", href: "/learn/kubernetes-allocatable-vs-capacity" },
              " CPU and memory, minus the requests of every DaemonSet pod on it.",
            ],
            [
              { b: "Check that your largest pod fits" },
              " in that room. If it barely fits, every copy of it needs a node to itself.",
            ],
            {
              text: [{ b: "Work out pods per node." }, " It’s the smallest of three numbers:"],
              blocks: [
                {
                  kind: "ul",
                  items: [
                    "CPU room divided by the average pod CPU request",
                    "memory room divided by the average pod memory request",
                    "max pods minus the DaemonSet pods",
                  ],
                },
              ],
            },
            [
              { b: "Divide the pool’s pods by pods per node" },
              " and round up. That’s the node count this size implies.",
            ],
            [
              { b: "If the count is one or two, try a smaller size." },
              " For a production cluster with a single system node pool, Microsoft recommends at least three nodes in it. The reasons are fault tolerance and availability zones. A pool spread across three zones needs three nodes anyway.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "For a candidate node’s monthly cost at list price, and what Kubernetes keeps on it, see the ",
            { a: "EKS and AKS pricing calculator", href: "/eks-and-aks-pricing-calculator" },
            ".",
          ],
        },
        {
          kind: "h3",
          id: "pick-a-machine-family-that-fits-your",
          title: "Pick a machine family that fits your requests",
        },
        {
          kind: "p",
          text: [
            "Match the machine family’s CPU-to-memory ratio to your pods’ requests, or one resource fills first and strands the other. On Azure, the ",
            { a: "VM series", href: "/learn/glossary/azure-vm-series" },
            " differ in that ratio:",
          ],
        },
        {
          kind: "ul",
          items: [
            "the D-series is general purpose, with a balanced ratio",
            "the F-series is compute optimized, with more CPU per GB",
            "the E-series is memory optimized",
          ],
        },
        {
          kind: "h3",
          id: "separate-pools-for-batch-and-steady-work",
          title: "Separate pools for batch and steady work",
        },
        {
          kind: "p",
          text: "Split pools by churn, and keep sizes similar inside each one. The Cluster Autoscaler needs similarly sized node groups to scale them consistently.",
        },
        {
          kind: "p",
          text: "AWS suggests 4xlarge instances for small batch work that comes and goes quickly. For a low-churn service such as Kafka at 8\u00a0vCPU, it suggests the 12xlarge family.",
        },
      ],
    },
    {
      id: "let-karpenter-or-nap-pick-the-size",
      title: "Let Karpenter or NAP pick the size from a range",
      blocks: [
        {
          kind: "p",
          text: [
            "A fixed node group makes size a decision you revisit by hand, usually with a new pool and a drain. The guides to ",
            { a: "changing an AKS node pool VM size", href: "/learn/change-aks-node-pool-vm-size" },
            " and ",
            {
              a: "changing an EKS node group instance type",
              href: "/learn/change-eks-node-group-instance-type",
            },
            " show the steps.",
          ],
        },
        {
          kind: "p",
          text: [
            "Karpenter on EKS and ",
            { a: "node auto provisioning (NAP)", href: "/learn/aks-node-auto-provisioning" },
            " on AKS turn size into a range. NAP uses Karpenter’s NodePool API.",
          ],
        },
        {
          kind: "p",
          text: "By default, Karpenter uses a broad set of compatible instance types. AWS says it picks one at provisioning time “based on pending workload requirements, availability, and cost”.",
        },
        {
          kind: "p",
          text: [
            "NAP’s default NodePool allows the D family and sets the ",
            { code: "WhenEmptyOrUnderutilized" },
            " consolidation policy. With it, underused nodes can be replaced later. ",
            { a: "Karpenter consolidation", href: "/learn/karpenter-consolidation" },
            " covers the policies.",
          ],
        },
        {
          kind: "h3",
          id: "set-the-range-with-nodepool-requirements",
          title: "Set the range with NodePool requirements",
        },
        {
          kind: "p",
          text: [
            "On AKS, bound the range rather than pin one size. NAP’s ",
            { code: "karpenter.azure.com/sku-cpu" },
            " selector limits the CPU counts it may launch:",
          ],
        },
        {
          kind: "code",
          lang: "yaml",
          code: 'requirements:\n- key: karpenter.azure.com/sku-family\n  operator: In\n  values:\n  - D\n- key: karpenter.azure.com/sku-cpu\n  operator: In\n  values:\n  - "4"\n  - "8"\n  - "16"',
        },
        {
          kind: "p",
          text: [
            "On EKS, Karpenter’s ",
            { code: "karpenter.k8s.aws/instance-category" },
            " and ",
            { code: "karpenter.k8s.aws/instance-size" },
            " labels do the same job.",
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "Don’t narrow Karpenter to one instance type, because each AWS Region has a limited number of instances of each type. A cluster that scales past them gets an error that none are available.",
        },
        {
          kind: "p",
          text: [
            "A range helps only when requests are right. Karpenter and NAP launch machines to fit pending pods’ requests, so inflated requests buy machines for load that never comes. That’s ",
            { a: "Kubernetes overprovisioning", href: "/learn/kubernetes-overprovisioning" },
            ", and the fix is ",
            { a: "setting requests from measured use", href: "/learn/kubernetes-pod-right-sizing" },
            ".",
          ],
        },
      ],
    },
    {
      id: "how-coral-works-with-your-node-sizes",
      title: "How Coral works with your node sizes",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral optimizes Kubernetes", href: "/coral" },
            " on AKS and EKS, and never creates machines itself. Instead, it works on what decides whether a node size fits: the requests, and the nodes they leave spare.",
          ],
        },
        { kind: "h3", id: "what-coral-changes", title: "What Coral changes" },
        {
          kind: "ul",
          items: [
            [
              { b: "Requests." },
              " Coral rebalances each container’s CPU and memory requests to what it really uses. The same autoscaler can then run fewer or smaller nodes. Pod sizing starts when you switch on “Automatically optimize” for a policy or a workload.",
            ],
            [
              { b: "Spare nodes." },
              " Node optimization is on from install and works out from pod requests how many nodes each pool needs. Coral drains spare nodes one at a time for your Cluster Autoscaler, NAP or Karpenter to remove. Pools that Karpenter or NAP already consolidate are left to them.",
            ],
            [
              { b: "Machine size." },
              " With Karpenter or NAP, a rebalance replaces the nodes you choose with cheaper machines that still fit the work. Your Karpenter or NAP launches them, and the old nodes are drained and removed one by one. A rebalance never goes past a PDB. Where Coral starts a new copy first, the old copy goes only once the new one is Ready and serving. A node that can’t be emptied is kept.",
            ],
            [
              { b: "Cluster Autoscaler only." },
              " Coral drains spare nodes for it to remove but never changes their size.",
            ],
          ],
        },
        {
          kind: "p",
          text: "When a node is emptied, a single-copy app that can’t get a new copy first gets a short restart. StatefulSets are one example.",
        },
        { kind: "h3", id: "what-one-real-cluster-showed", title: "What one real cluster showed" },
        {
          kind: "p",
          text: "On our own AKS development cluster, node optimization removed one of two 4-CPU workers on 6 October. On 12 October, a rebalance swapped the remaining worker for a cheaper machine with the same 4\u00a0CPUs. That was AMD at $81.03 a month in place of Intel at $147.46.",
        },
        {
          kind: "p",
          text: [
            "Apps that run a single copy were back in 5 to 82\u00a0seconds. By then, the cluster’s machines cost $154.76 a month instead of $368.65, at Azure list prices. ",
            { a: "The Coral Value Lab study", href: "/coral-value-lab" },
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
      publisher: "AWS",
      title: "“Kubernetes Data Plane”",
      url: "https://docs.aws.amazon.com/eks/latest/best-practices/scale-data-plane.html",
      note: " (Amazon EKS Best Practices Guide)",
    },
    {
      publisher: "AWS",
      title: "“Node and Workload Efficiency”",
      url: "https://docs.aws.amazon.com/eks/latest/best-practices/node_and_workload_efficiency.html",
      note: " (Amazon EKS Best Practices Guide)",
    },
    {
      publisher: "AWS",
      title: "“Choose an optimal Amazon EC2 node instance type”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/choosing-instance-type.html",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Node resource reservations in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/node-resource-reservations",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Concepts - IP address planning in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/concepts-network-ip-address-planning",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Use system node pools in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/use-system-pools",
    },
    {
      publisher: "Microsoft Learn",
      title:
        "“Configure node pools for node auto-provisioning (NAP) in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/node-auto-provisioning-node-pools",
    },
    {
      publisher: "Kubernetes Cluster Autoscaler",
      title: "“Frequently Asked Questions”",
      url: "https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md",
    },
  ],
  related: [
    {
      title: "Kubernetes allocatable vs capacity: what pods can use",
      where: "Learn",
      href: "/learn/kubernetes-allocatable-vs-capacity",
    },
    {
      title: "Kubernetes bin packing: fewer nodes for the same pods",
      where: "Learn",
      href: "/learn/kubernetes-bin-packing",
    },
    {
      title: "How to choose AKS VM sizes",
      where: "Learn",
      href: "/learn/how-to-choose-aks-node-sizes",
    },
    {
      title: "How to choose EKS instance types",
      where: "Learn",
      href: "/learn/how-to-choose-eks-instance-types",
    },
    {
      title: "How to change an AKS node pool VM size",
      where: "Learn",
      href: "/learn/change-aks-node-pool-vm-size",
    },
  ],
};
