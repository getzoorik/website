import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/kubernetes-node-size-best-practices/1";
import { figure as figure2 } from "@/features/learn/figures/kubernetes-node-size-best-practices/2";

export const article: Article = {
  slug: "kubernetes-node-size-best-practices",
  title: "Kubernetes node size best practices",
  meta: "Kubernetes node size best practices for AKS and EKS: what large and small nodes cost, the reserve and pod limits, and how to size pools.",
  h1: "Kubernetes node size best practices",
  deck: "Large or small nodes on AKS and EKS: what each costs, and how to size every pool.",
  card: "Large or small nodes: the reserves, pod limits and autoscaler rules that set each pool’s size.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes cost basics",
  published: "2026-11-01",
  updated: "2026-11-03",
  author: "soumya",
  cover: "/learn-covers/zoorik-learn-kubernetes-node-size-best-practices-1200x630.webp",
  coverAlt: "Small nodes or one large node, with resources reserved on every node",
  short:
    "Use the largest nodes your pods can fill that still meet your availability goals, as AWS advises. Larger nodes pay the per-node overhead fewer times. Smaller nodes leave less idle, are easier to empty and lose less in a failure. Size each pool from its own pod requests.",
  sections: [
    {
      id: "fewer-larger-nodes-pay-the-per-node",
      title: "Per-node overhead",
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
          text: "Take an AKS pool of 16\u00a0cores and 64\u00a0GB. Four 4-core, 16\u00a0GB nodes reserve over twice the CPU and three times the memory of one 16-core, 64\u00a0GB node. They also run four copies of every DaemonSet instead of one.",
        },
        {
          kind: "h3",
          id: "how-the-reserve-scales-with-node-size",
          title: "How the reserve scales",
        },
        {
          kind: "p",
          text: [
            "The reserve is the CPU and memory kept back for the kubelet and other system components. Pods can request only what’s left, the node’s ",
            { a: "allocatable", href: "/learn/kubernetes-allocatable-vs-capacity" },
            ". You pay for the reserve, but no pod can request it.",
          ],
        },
        {
          kind: "p",
          text: "On AKS, the CPU reserve grows much more slowly than the node. Microsoft’s table gives 140\u00a0millicores (140m, thousandths of a core) on a 4-core node, 260m on 16\u00a0cores and 740m on 64. That’s 3.5%, 1.6% and 1.2% of each node.",
        },
        {
          kind: "p",
          text: [
            "On AKS 1.29 and later, the memory reserve follows ",
            { a: "max pods", href: "/learn/glossary/max-pods-per-node" },
            " more than node size. It’s 20\u00a0MB per max pod plus 50\u00a0MB, or 25% of the node’s memory, whichever is less.",
          ],
        },
        {
          kind: "p",
          text: "At the Azure CNI Overlay default of 250 max pods, that’s 5,050\u00a0MB. Max pods is set when a pool is created, and raising it takes a new pool. So plan that reserve for the pool’s life.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "At 250 max pods, each 4-core node reserves 140m of CPU and hits the 25% memory cap at 4\u00a0GB. Four of them reserve 560m and 16\u00a0GB, a quarter of their memory. One 16-core node in their place reserves 260m and 5,050\u00a0MB, about 8% of its memory.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "h3",
          id: "every-node-runs-its-own-daemonset-pods",
          title: "DaemonSet copies",
        },
        {
          kind: "p",
          text: "A DaemonSet runs one copy of its pod on every node, or on a chosen set. The EKS user guide says “fewer, larger instances are better, especially if you have a lot of Daemonsets”. Each instance also adds API server calls.",
        },
      ],
    },
    {
      id: "large-nodes-are-harder-to-fill-and",
      title: "Downsides of large nodes",
      blocks: [
        {
          kind: "h3",
          id: "pod-slots-can-run-out-before-cpu",
          title: "Pod slot limits",
        },
        {
          kind: "p",
          text: "Take a 64-core AKS node at 110 max pods. Its 740m reserve leaves at most 63.26\u00a0cores allocatable. To fill it, its pods must average about 575m of CPU each.",
        },
        {
          kind: "p",
          text: "Pods that request 100m each fill all 110 slots with 11\u00a0cores requested (110 × 100m). The other 52.26\u00a0cores, most of the machine, stay unrequested.",
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
          text: "Each instance type also caps the EBS volumes it can attach. A node full of pods with their own volumes can reach that cap first.",
        },
        {
          kind: "h3",
          id: "node-autoscalers-buy-capacity-a-whole-node",
          title: "Whole-node scale-ups",
        },
        {
          kind: "p",
          text: "One pending pod that requests 500m, in a group of 64-core machines, brings up 64 more cores. You pay for all of them until work arrives to fill them.",
        },
        {
          kind: "p",
          text: "The Cluster Autoscaler can’t add a smaller machine to that group, because “Inside a node group, all machines have identical capacity”. Its expander picks only among the groups you’ve defined.",
        },
        {
          kind: "h3",
          id: "a-large-node-is-harder-to-empty",
          title: "Harder to empty",
        },
        { kind: "p", text: "The Cluster Autoscaler removes a node only when both of these hold:" },
        {
          kind: "ul",
          items: [
            "its pods’ CPU and memory requests are each under 50% of its allocatable, the default threshold, which you can change",
            "every pod on it, other than DaemonSet and static pods, can move",
          ],
        },
        {
          kind: "p",
          text: [
            "One pod that can’t move keeps the whole machine, and a large node holds more pods that might not. ",
            {
              a: "Cluster Autoscaler not scaling down",
              href: "/learn/cluster-autoscaler-not-scaling-down",
            },
            " covers each blocker.",
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
          title: "Bigger failures",
        },
        {
          kind: "p",
          text: "AWS’s example is a cluster of three very large instances, where “1 instance outage could impact 1/3 of the cluster”. Spread the same capacity over nine nodes and one outage takes a ninth.",
        },
      ],
    },
    {
      id: "kubernetes-node-size-best-practices",
      title: "What AKS and EKS recommend",
      blocks: [
        {
          kind: "p",
          text: "Neither cloud names one right node size, but both publish a starting point.",
        },
        {
          kind: "p",
          text: [
            "On AKS, a system node pool needs VMs of at least 4\u00a0vCPUs and 4\u00a0GB of memory. ",
            { a: "B-series burstable VMs", href: "/learn/glossary/burstable-instance" },
            " aren’t supported there.",
          ],
        },
        {
          kind: "p",
          text: "Microsoft recommends more: three system nodes of 8\u00a0vCPUs, or two of at least 16, especially for large clusters with several CoreDNS replicas and add-ons. System pools shouldn’t run your applications, so your own sizing happens in user pools.",
        },
        {
          kind: "p",
          text: "On EKS, AWS recommends slightly larger nodes, 4xlarge to 12xlarge, so DaemonSets and system reserves take less of each node.",
        },
        {
          kind: "p",
          text: "That range stops below the very large sizes with non-uniform memory access (NUMA). Kubernetes scales out, so most applications needn’t pay their performance cost. AWS also advises against burstable T-series instances where performance must be consistent.",
        },
      ],
    },
    {
      id: "how-to-choose-kubernetes-node-sizes-for",
      title: "How to size each pool",
      blocks: [
        {
          kind: "p",
          text: [
            "Size each pool from its own pods, because the scheduler places pods by their ",
            { a: "requests", href: "/learn/glossary/kubernetes-resource-requests" },
            ", not by what they use. Five steps:",
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
              " and round up. That’s the node count at this size.",
            ],
            [
              { b: "If the count is one or two, try a smaller size." },
              " For fault tolerance and availability zones, Microsoft recommends at least three nodes in a production system pool. A pool spread across three zones needs three nodes anyway.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "The ",
            { a: "EKS and AKS pricing calculator", href: "/eks-and-aks-pricing-calculator" },
            " gives a candidate node’s monthly list price and what Kubernetes keeps on it.",
          ],
        },
        {
          kind: "h3",
          id: "pick-a-machine-family-that-fits-your",
          title: "Match the machine family",
        },
        {
          kind: "p",
          text: [
            "Pick the family whose CPU-to-memory ratio matches your pods’ requests. Otherwise one resource fills first and strands the other. On Azure, the ",
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
          title: "Split pools by churn",
        },
        {
          kind: "p",
          text: "Put work with very different churn in separate pools, and keep sizes similar inside each one. The Cluster Autoscaler needs similarly sized node groups to scale them consistently.",
        },
        {
          kind: "p",
          text: "AWS suggests the 4xlarge family for small batch work that comes and goes quickly. For a low-churn service such as Kafka at 8\u00a0vCPU, it suggests the 12xlarge family.",
        },
      ],
    },
    {
      id: "let-karpenter-or-nap-pick-the-size",
      title: "Let Karpenter or NAP choose",
      blocks: [
        {
          kind: "p",
          text: [
            "In a fixed node group, size is a choice you revisit by hand, usually with a new pool and a drain. The guides to ",
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
            " on AKS make size a range instead. NAP uses Karpenter’s NodePool API.",
          ],
        },
        {
          kind: "p",
          text: "By default, Karpenter uses a broad set of compatible instance types. AWS says it picks one at provisioning time “based on pending workload requirements, availability, and cost”.",
        },
        {
          kind: "p",
          text: [
            "NAP’s default NodePool allows only the D family and sets ",
            { code: "consolidateAfter" },
            " to ",
            { code: "0s" },
            ". ",
            { a: "Karpenter consolidation", href: "/learn/karpenter-consolidation" },
            " explains when underused nodes are replaced.",
          ],
        },
        {
          kind: "h3",
          id: "set-the-range-with-nodepool-requirements",
          title: "Set the range",
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
          text: "Don’t narrow Karpenter to one instance type. Each AWS Region has a limited number of instances of each type. A cluster that scales past them gets an error that none are available.",
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
      title: "Where Coral fits",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " rebalances requests and nodes on AKS and EKS without any downtime, and never launches machines itself. It works on what decides whether a node size fits: the requests, and the nodes they leave spare.",
          ],
        },
        { kind: "h3", id: "what-coral-changes", title: "What Coral changes" },
        {
          kind: "ul",
          items: [
            [
              { b: "Requests." },
              " Coral rebalances each container’s CPU and memory requests to real use, so the same autoscaler can run fewer or smaller nodes. This starts when you switch on “Automatically optimize” for a policy or a workload.",
            ],
            [
              { b: "Spare nodes." },
              " Node optimization is on from install. It works out from pod requests how many nodes each pool needs, and drains and removes the rest one at a time. Pools that Karpenter or NAP already consolidate are left to them.",
            ],
            [
              { b: "Machine size." },
              " With Karpenter or NAP, a rebalance swaps the nodes you choose for cheaper machines that your autoscaler launches. It never goes past a PDB, and a node that can’t be emptied is kept.",
            ],
            [
              { b: "Cluster Autoscaler only." },
              " Coral removes spare nodes but never changes their size.",
            ],
          ],
        },
        {
          kind: "p",
          text: "Coral moves each pod the first way that works: warm handover, live migration, then eviction within its PDB. In a warm handover, a replacement is Ready on another node before the old pod goes.",
        },
        { kind: "h3", id: "what-one-real-cluster-showed", title: "One real cluster" },
        {
          kind: "p",
          text: "On our own AKS development cluster, node optimization removed one of two 4-CPU workers on 6 October. On 12 October, a rebalance swapped the other for a cheaper machine of the same size. That was AMD at $81.03 a month in place of Intel at $147.46.",
        },
        {
          kind: "p",
          text: [
            "The cluster’s machines then cost $154.76 a month instead of $368.65, at Azure list prices. ",
            { a: "The Coral Value Lab study", href: "/coral-value-lab" },
            " has the full run.",
          ],
        },
      ],
    },
  ],
  help: {
    product: "coral",
    text: "Coral rebalances CPU and memory requests on AKS and EKS, works with your HPA, and removes the nodes you don’t need. We estimate it takes 40–50% off AKS and EKS cost. It is an estimated range, not a promise. The free assessment works out your own figure.",
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
      title: "Kubernetes allocatable vs capacity",
      where: "Learn",
      href: "/learn/kubernetes-allocatable-vs-capacity",
    },
    {
      title: "Kubernetes bin packing",
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
  relatedTitle: "More on node sizes",
};
