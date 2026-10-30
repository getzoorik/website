import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/kubernetes-node-size-best-practices/1";

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
  published: "2026-11-08",
  updated: "2026-11-08",
  author: "soumya",
  short:
    "Kubernetes node size best practices come down to one trade-off: larger nodes spread each node’s fixed overhead across more pods, while smaller nodes cost less to leave idle, are easier to empty and take less with them when one fails. The fixed overhead is the node’s reserved CPU and memory, a copy of every DaemonSet, and its load on the API server. AWS advises the largest nodes your workloads can fully use that still meet your availability goals.",
  sections: [
    {
      id: "what-every-node-costs-before-your-pods",
      title: "What every node costs before your pods arrive",
      blocks: [
        {
          kind: "p",
          text: [
            "Every node keeps part of itself for Kubernetes. It holds back CPU and memory for the kubelet and other system components, and pods can claim only what’s left, the node’s ",
            { a: "allocatable", href: "/learn/kubernetes-allocatable-vs-capacity" },
            ". For Kubernetes node sizing, what matters is how that reserve scales with the machine.",
          ],
        },
        {
          kind: "p",
          text: "On AKS, the CPU reserve grows much more slowly than the node: Microsoft’s table gives 140\u00a0millicores (written 140m, each a thousandth of a core) on a 4-core node, 260m on 16\u00a0cores and 740m on 64, which is 3.5%, 1.6% and 1.2% of each node. Four 4-core nodes reserve 560m between them, while one 16-core node reserves 260m for the same 16\u00a0cores.",
        },
        { kind: "diagram", figure: figure1 },
        {
          kind: "p",
          text: "Memory works differently on AKS 1.29 and later. The kube-reserved memory mostly follows max pods, not node size: 20\u00a0MB per max pod plus 50\u00a0MB, or 25% of the node’s memory, whichever is less. At the Azure CNI Overlay default of 250 max pods, the formula gives 5,050\u00a0MB. A 16\u00a0GB node hits the 25% cap and gives up 4\u00a0GB, while a 64\u00a0GB node gives up the same 5,050\u00a0MB, about 8% of it. Max pods is set per pool at creation, and raising it takes a new pool, so plan that reserve for the pool’s life.",
        },
        {
          kind: "p",
          text: "DaemonSets are the second fixed cost. A DaemonSet runs one copy of its pod on every node, or on a chosen set, so ten small nodes carry ten copies of each agent and two large ones carry two. The EKS user guide says “fewer, larger instances are better, especially if you have a lot of Daemonsets”, since each instance also adds calls to the API server. AWS’s scalability guidance recommends slightly larger nodes, 4xlarge to 12xlarge, because they give a smaller share of each node to DaemonSets and system reserves. It stops below the very large sizes with non-uniform memory access, or NUMA, whose performance cost most applications needn’t take, since Kubernetes scales out.",
        },
      ],
    },
    {
      id: "where-large-nodes-cost-you",
      title: "Where large nodes cost you",
      blocks: [
        { kind: "p", text: "Large nodes win on overhead and lose on granularity." },
        {
          kind: "p",
          text: "Pod slots can run out before CPU does. AKS defaults to 250 max pods on Azure CNI Overlay and 110 on Azure CNI Pod subnet and kubenet, and 250 is its ceiling. On EKS, a managed node group without a custom AMI caps max pods at 110 below 30\u00a0vCPUs and 250 above, and EKS Auto Mode holds every node to 110 or fewer. A 64-core AKS node at 110 max pods has at most 63.26\u00a0cores allocatable, so its pods must average about 575m of CPU each to fill it. Pods that request 100m each take every slot and leave most of the machine idle. AWS also notes that each instance type caps the EBS volumes it can attach, so a node full of pods with their own volumes can reach that cap first.",
        },
        {
          kind: "p",
          text: "Node autoscalers buy capacity a whole node at a time. One pending pod that requests 500m, in a node group of 64-core machines, brings up 64 more cores, and you pay for all of them until work arrives to fill them. With the Cluster Autoscaler the step is fixed by the group, because “Inside a node group, all machines have identical capacity”, and its expander chooses only among the groups you’ve defined.",
        },
        {
          kind: "p",
          text: [
            "A large node is harder to empty. The Cluster Autoscaler removes a node only when its pods’ CPU and memory requests are each under 50% of its allocatable (the default utilization threshold, which you can change) and every pod on it, other than DaemonSet and static pods, can move. One pod with a PodDisruptionBudget (PDB) that allows no disruption, no controller, or the ",
            { code: 'cluster-autoscaler.kubernetes.io/safe-to-evict: "false"' },
            " annotation keeps the whole machine, as does local storage such as emptyDir or hostPath while ",
            { code: "skip-nodes-with-local-storage" },
            " is true, the upstream default. Every extra pod on the node is one more chance of that, and each blocker is covered in ",
            {
              a: "Cluster Autoscaler not scaling down",
              href: "/learn/cluster-autoscaler-not-scaling-down",
            },
            ".",
          ],
        },
        {
          kind: "p",
          text: "One failure takes more with it. In AWS’s example of a cluster of three very large instances, “1 instance outage could impact 1/3 of the cluster”. Spread the same capacity over nine nodes and one outage takes a ninth.",
        },
      ],
    },
    {
      id: "how-to-choose-kubernetes-node-sizes",
      title: "How to choose Kubernetes node sizes",
      blocks: [
        {
          kind: "p",
          text: "A Kubernetes node size calculator is five lines of arithmetic. Do it per pool, with your own requests, because the scheduler places pods by their requests, not by what they use:",
        },
        {
          kind: "ol",
          items: [
            [
              "Find the room for your pods on a candidate size: its ",
              { a: "allocatable", href: "/learn/kubernetes-allocatable-vs-capacity" },
              " CPU and memory, minus the requests of every DaemonSet pod that runs on it.",
            ],
            "Check that your largest pod fits in that room. If it barely fits, every copy of it needs a node to itself.",
            "Work out pods per node as the smallest of three numbers: CPU room divided by the average pod CPU request, memory room divided by the average pod memory request, and max pods minus the DaemonSet pods.",
            "Divide the number of pods in the pool by the pods per node from step 3 and round up. That’s the node count this size implies.",
            "If the count comes out at one or two, try a smaller size. For a production cluster with a single system node pool, Microsoft recommends at least three nodes in it, for fault tolerance and availability zones, and a pool spread across three zones needs three anyway.",
          ],
        },
        {
          kind: "p",
          text: "Then choose the machine family. Match its CPU-to-memory ratio to your pods’ requests, or one resource fills first and strands the other. On Azure, the D-series is general purpose with a balanced ratio, the F-series is compute optimized with more CPU per GB, and the E-series is memory optimized.",
        },
        {
          kind: "p",
          text: "Split pools by churn, and keep sizes similar inside each one. AWS suggests 4xlarge instances for small batch work that comes and goes quickly, and the 12xlarge family for a low-churn service such as Kafka at 8\u00a0vCPU. The Cluster Autoscaler needs similarly sized node groups to scale them consistently.",
        },
      ],
    },
    {
      id: "kubernetes-node-size-best-practices-from-aks",
      title: "Kubernetes node size best practices from AKS and EKS",
      blocks: [
        {
          kind: "p",
          text: "There’s no single Kubernetes recommended node size, but both clouds publish a starting point. On AKS, a system node pool needs a VM of at least 4\u00a0vCPUs and 4\u00a0GB of memory, and B-series burstable VMs aren’t supported there. The recommended minimum is higher: three system nodes of 8\u00a0vCPUs, or two of at least 16, especially for large clusters with several CoreDNS replicas and add-ons. Microsoft also says system pools shouldn’t run your applications, so Kubernetes worker node sizing happens in your user pools.",
        },
        {
          kind: "p",
          text: "On EKS, AWS recommends 4xlarge to 12xlarge and advises against burstable T-series instances where performance must be consistent. Its rule for any size is the one in the short answer.",
        },
      ],
    },
    {
      id: "let-karpenter-or-nap-pick-the-size",
      title: "Let Karpenter or NAP pick the size",
      blocks: [
        {
          kind: "p",
          text: [
            "A fixed node group makes size a decision you revisit by hand, usually with a new pool and a drain, as the guides to ",
            { a: "changing an AKS node pool VM size", href: "/learn/change-aks-node-pool-vm-size" },
            " and ",
            {
              a: "changing an EKS node group instance type",
              href: "/learn/change-eks-node-group-instance-type",
            },
            " show.",
          ],
        },
        {
          kind: "p",
          text: [
            "Karpenter on EKS and ",
            { a: "node auto-provisioning (NAP)", href: "/learn/aks-node-auto-provisioning" },
            " on AKS, which uses Karpenter’s NodePool API, turn size into a range. By default Karpenter uses a broad set of compatible instance types and, AWS says, picks one at provisioning time “based on pending workload requirements, availability, and cost”. NAP’s default NodePool allows the D family and sets the ",
            { code: "WhenEmptyOrUnderutilized" },
            " consolidation policy, so underused nodes can be replaced later. ",
            { a: "Karpenter consolidation", href: "/learn/karpenter-consolidation" },
            " covers the policies.",
          ],
        },
        {
          kind: "p",
          text: [
            "Bound the range rather than pin one size. On AKS, NAP’s ",
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
            " labels do the same job. Don’t narrow Karpenter to one type: each AWS Region has a limited number of instances of each type, and a cluster that scales past them gets an error that none are available.",
          ],
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
            " on AKS and EKS, and it never creates machines itself. It works on what decides whether a node size fits: the requests, and the nodes they leave spare.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Requests." },
              " Coral rebalances each container’s CPU and memory requests to what it really uses, so the same autoscaler can run fewer or smaller nodes. Pod sizing starts when you switch on “Automatically optimize” for a policy or a workload.",
            ],
            [
              { b: "Spare nodes." },
              " Node optimization is on from install. It works out from pod requests how many nodes each pool needs, and every pool keeps at least one. The agent checks on the live cluster that every pod on a node fits on another Ready node, then drains one node at a time for your Cluster Autoscaler, NAP or Karpenter to remove. Pools that Karpenter or NAP already consolidate are left to them.",
            ],
            [
              { b: "Machine size." },
              " With Karpenter or NAP, rebalancing replaces the nodes you choose with cheaper machines that still fit the work. Coral creates fixed-size NodePools named zoorik-rb-…, your Karpenter or NAP launches the new machines, and the old nodes are drained and removed one by one. A rebalance never goes past a PDB. Where Coral starts a new copy first, that copy must be Ready and serving for 5\u00a0minutes with no restarts before the old one goes, and a node that can’t be emptied within 45\u00a0minutes is kept.",
            ],
            [
              { b: "Cluster Autoscaler only." },
              " Coral drains spare nodes for it to remove but never changes their size.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "When a node is emptied, an app that runs a single copy and can’t get a new copy first, such as a StatefulSet, gets a short restart. On our own AKS development cluster, node optimization removed one of two 4-CPU workers on 6 October. On 12 October a rebalance swapped the remaining worker for a cheaper machine with the same 4\u00a0CPUs, AMD at $81.03 a month in place of Intel at $147.46, in 8\u00a0minutes 36\u00a0seconds. Apps that run a single copy were back in 5 to 82\u00a0seconds. The machine bill went from $368.65 to $154.76 a month at Azure list prices, and the full run is in ",
            {
              a: "How we reduced our own cluster’s machine bill by 58%",
              href: "/case-studies/coral-dev-cluster",
            },
            ".",
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
      title: "How to change an AKS node pool VM size",
      where: "Learn",
      href: "/learn/change-aks-node-pool-vm-size",
    },
    {
      title: "How we reduced our own cluster’s machine bill by 58%",
      where: "Case study",
      href: "/case-studies/coral-dev-cluster",
    },
  ],
};
