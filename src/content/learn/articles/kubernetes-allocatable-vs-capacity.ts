import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/kubernetes-allocatable-vs-capacity/1";
import { figure as figure2 } from "@/features/learn/figures/kubernetes-allocatable-vs-capacity/2";
import { figure as figure3 } from "@/features/learn/figures/kubernetes-allocatable-vs-capacity/3";

export const article: Article = {
  slug: "kubernetes-allocatable-vs-capacity",
  title: "Kubernetes allocatable vs capacity",
  meta: "Kubernetes allocatable vs capacity: what the kubelet, OS and eviction threshold take from a node. See the AKS and EKS reserves and how to check them.",
  h1: "Kubernetes allocatable vs capacity",
  deck: "In AWS’s example, pods get 7,074\u00a0MiB of an 8\u00a0GiB EKS node: 86% of the memory you pay for.",
  card: "Why pods get less than the node’s size, what AKS and EKS reserve, and how requests fill the rest.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes cost basics",
  versus: ["Allocatable", "Capacity"],
  published: "2026-10-24",
  updated: "2026-11-03",
  author: "sonia",
  cover: "/learn-covers/zoorik-learn-kubernetes-allocatable-vs-capacity-1200x630.webp",
  coverAlt:
    "Allocatable vs capacity: a node’s capacity, minus what is reserved, is the allocatable room for pods",
  short:
    "Capacity is everything a node has: CPU, memory, ephemeral storage and pod slots. Allocatable is capacity minus the reserves for the kubelet, the container runtime and the OS, and the hard eviction threshold. The scheduler fills allocatable with pod requests, not use, so a node can be full while its CPU sits mostly idle.",
  sections: [
    {
      id: "allocatable-vs-capacity",
      title: "The difference",
      blocks: [
        {
          kind: "p",
          text: [
            "Two gaps sit between the machine you pay for and what your pods use. The first, capacity minus allocatable, is set by the machine, the platform and ",
            { a: "max pods", href: "/learn/glossary/max-pods-per-node" },
            ", the most pods a node may run. The second, requests minus use, is set by your manifests.",
          ],
        },
        {
          kind: "table",
          columns: [
            { label: "Question", width: "14%" },
            { label: "Capacity", width: "45%" },
            { label: "Allocatable", width: "41%" },
          ],
          rows: [
            [
              "What it counts",
              "Everything the node has: CPU, memory, ephemeral storage, pods",
              "The part of capacity that pods can request",
            ],
            [
              "Where you read it",
              [
                { code: ".status.capacity" },
                ", the Capacity block of ",
                { code: "kubectl describe node" },
              ],
              [{ code: ".status.allocatable" }, ", the Allocatable block"],
            ],
            [
              "What sets it",
              "The machine, as the node reports it, and max pods for the pod count",
              "Capacity minus kube-reserved, system-reserved and the hard eviction threshold",
            ],
            [
              "What counts against it",
              "Nothing is scheduled against capacity",
              "Pod requests, for the scheduler and the Cluster Autoscaler",
            ],
            [
              "Use it for",
              "Pricing: you pay for the whole machine",
              "Fitting pods, and counting the nodes a pool needs",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "The ",
            { a: "EKS and AKS pricing calculator", href: "/eks-and-aks-pricing-calculator" },
            " shows each node’s list price and how much of it pods can use.",
          ],
        },
      ],
    },
    {
      id: "node-allocatable",
      title: "What comes off capacity",
      blocks: [
        {
          kind: "p",
          text: "A node runs more than your pods. The kubelet, the container runtime, OS daemons and the kernel all need CPU and memory. Node Allocatable keeps resources back for them, and the scheduler treats the rest as the node’s room for pods.",
        },
        {
          kind: "p",
          text: "Three amounts come off capacity, for CPU, memory and ephemeral storage:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Kube-reserved" },
              " covers Kubernetes daemons such as the kubelet and the container runtime, but not system daemons that run as pods. It usually grows with the number of pods a node runs.",
            ],
            [
              { b: "System-reserved" },
              " covers OS daemons such as sshd and udev, and kernel memory, which Kubernetes doesn’t count against pods.",
            ],
            [
              { b: "The hard eviction threshold" },
              " is the free memory or ephemeral storage below which the kubelet evicts pods. CPU has none: evictions cover memory and ephemeral storage only.",
            ],
          ],
        },
        {
          kind: "p",
          text: "The Kubernetes docs’ example node has 16\u00a0CPUs, 32Gi of memory and 100Gi of storage. Gi and Mi are binary units (1Gi is 1,024Mi), and m is a millicore, a thousandth of a CPU.",
        },
        {
          kind: "table",
          columns: [
            { label: "Example node", width: "44%" },
            { label: "CPU", width: "19%" },
            { label: "Memory", width: "19%" },
            { label: "Ephemeral storage", width: "18%" },
          ],
          rows: [
            ["Capacity", "16\u00a0CPUs", "32Gi", "100Gi"],
            ["Kube-reserved", "1\u00a0CPU", "2Gi", "1Gi"],
            ["System-reserved", "500m", "1Gi", "1Gi"],
            ["Hard eviction threshold", "none", "500Mi", "10%, so 10Gi"],
            ["Allocatable", "14.5\u00a0CPUs", "28.5Gi", "88Gi"],
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: "By default, the kubelet evicts pods once their combined memory use passes allocatable, 28.5Gi here. CPU never causes an eviction. But when every process on the node runs flat out, pods together get no more than 14.5\u00a0CPUs.",
        },
        {
          kind: "callout",
          label: "For engineers",
          text: [
            "The three amounts are the kubelet settings ",
            { code: "kubeReserved" },
            ", ",
            { code: "systemReserved" },
            " and ",
            { code: "evictionHard" },
            ". The default ",
            { code: "evictionHard" },
            " is ",
            { code: "memory.available" },
            " 100Mi, ",
            { code: "nodefs.available" },
            " 10%, ",
            { code: "nodefs.inodesFree" },
            " 5% and ",
            { code: "imagefs.available" },
            " 15%. Enforcing system-reserved caps the OS daemons’ cgroup at that reserve. That can leave critical system services CPU-starved, OOM-killed or unable to fork, so the docs advise it only after exhaustive profiling.",
          ],
        },
      ],
    },
    {
      id: "allocatable-on-aks-and-eks",
      title: "AKS and EKS reserves",
      blocks: [
        {
          kind: "p",
          text: "Managed clusters set these values for you, from the machine and its max pods.",
        },
        { kind: "h3", id: "aks", title: "What AKS reserves" },
        {
          kind: "p",
          text: [
            "AKS reserves CPU on a sliding scale: the bigger the node, the smaller the share. Microsoft notes that some features reserve more. The scale is one input to ",
            {
              a: "choosing a node size",
              href: "/learn/kubernetes-node-size-best-practices",
            },
            ".",
          ],
        },
        {
          kind: "table",
          columns: [
            { label: "CPU cores on the node", width: "33%" },
            { label: "Kube-reserved CPU", width: "33%" },
            { label: "Share of the node’s CPU", width: "34%" },
          ],
          rows: [
            ["1", "60m", "6%"],
            ["2", "100m", "5%"],
            ["4", "140m", "3.5%"],
            ["8", "180m", "2.25%"],
            ["16", "260m", "1.6%"],
            ["32", "420m", "1.3%"],
            ["64", "740m", "1.2%"],
          ],
        },
        {
          kind: "p",
          text: [
            "From AKS 1.29, reserved memory is kube-reserved plus the hard eviction threshold, ",
            { code: "memory.available<100Mi" },
            ". Kube-reserved is the lesser of 20\u00a0MB per max pod plus 50\u00a0MB, or 25% of the node’s memory.",
          ],
        },
        {
          kind: "p",
          text: "So allocatable memory falls as max pods rises. The default max pods depends on the network plugin. Azure CNI Overlay defaults to 250, Azure CNI Pod subnet and kubenet to 110, and legacy Azure CNI to 30.",
        },
        {
          kind: "p",
          text: "Microsoft works the formula in decimal GB from the VM’s memory, with the 100Mi threshold as 0.1\u00a0GB. The node OS also reserves some CPU and memory on top. To change kube-reserved or the eviction thresholds, Microsoft points to its preview custom node configuration settings.",
        },
        {
          kind: "p",
          text: "By the formula, a 16\u00a0GB node leaves pods 15.25\u00a0GB at 30 max pods and 13.65\u00a0GB at 110. At 250, the 25% cap applies and pods keep 11.9\u00a0GB, 74% of the node.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: "Max pods is set when you create a cluster or add a node pool, up to 250. To change it, add a new pool and move your pods. Fewer pod slots leave pods more memory, but many small pods may then need more nodes.",
        },
        { kind: "h3", id: "eks", title: "What EKS reserves" },
        {
          kind: "p",
          text: "On EKS-optimized Amazon Linux nodes, the AMI’s bootstrap sets kube-reserved from the instance type. CPU is 6% of the first core, 1% of the second, 0.5% each of the third and fourth, and 0.25% of every core after. Memory is 11\u00a0MiB per max pod plus 255\u00a0MiB. The hard eviction threshold comes off on top.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "AWS’s example node has 2\u00a0vCPUs, 8\u00a0GiB of memory and 29 max pods. The CPU reserve is 60m + 10m = 70m, so pods get 1,930m of 2,000m. The memory reserve is 11 × 29 + 255 = 574\u00a0MiB. With the 100\u00a0MiB eviction threshold, pods get 7,748 − 574 − 100 = 7,074\u00a0MiB. So a pod that requests 8\u00a0GiB (8,192\u00a0MiB) never fits: it is 1,118\u00a0MiB short. The node reports 444\u00a0MiB less than 8\u00a0GiB, and the reserve and threshold take 674\u00a0MiB.",
        },
        {
          kind: "p",
          text: [
            "If ",
            { a: "Karpenter", href: "/learn/what-is-karpenter" },
            " launches your nodes, it sets the system and kube reserves itself, with its own graduated defaults. You can override them with ",
            { code: "kubeReserved" },
            " and ",
            { code: "systemReserved" },
            " under ",
            { code: "spec.kubelet" },
            " in the EC2NodeClass. On Bottlerocket, custom AMIs or ",
            { a: "EKS Auto Mode", href: "/learn/glossary/eks-auto-mode" },
            ", read the figures from the node rather than assume this formula.",
          ],
        },
      ],
    },
    {
      id: "check-allocatable-vs-capacity",
      title: "Check a node",
      blocks: [
        {
          kind: "p",
          text: [
            { code: "kubectl describe node" },
            " prints the Capacity and Allocatable blocks. Under “Allocated resources”, it totals the CPU and memory that the node’s pods request and limit.",
          ],
        },
        { kind: "code", lang: "bash", code: "kubectl describe node <node-name>" },
        {
          kind: "p",
          text: "The Kubernetes docs’ example, trimmed, is a 2-CPU node. It reserves 200m of CPU (2,000m − 1,800m) and none of its 110\u00a0pod slots. Memory is in Ki, kibibytes.",
        },
        {
          kind: "code",
          lang: "text",
          code: "Capacity:\n cpu:                               2\n memory:                            7679792Ki\n pods:                              110\nAllocatable:\n cpu:                               1800m\n memory:                            7474992Ki\n pods:                              110\n[ ... lines removed for clarity ...]\nNon-terminated Pods:        (5 in total)\n[ ... lines removed for clarity ...]\nAllocated resources:\n  (Total limits may be over 100 percent, i.e., overcommitted.)\n  CPU Requests    CPU Limits    Memory Requests    Memory Limits\n  ------------    ----------    ---------------    -------------\n  680m (34%)      400m (20%)    920Mi (11%)        1070Mi (13%)",
        },
        {
          kind: "p",
          text: [
            "To see use instead of requests, run ",
            { code: "kubectl top node" },
            ". It needs ",
            { a: "Metrics Server", href: "/learn/glossary/metrics-server" },
            " running in the cluster. It shows use against allocatable by default, or against capacity with ",
            { code: "--show-capacity" },
            ".",
          ],
        },
        { kind: "code", lang: "bash", code: "kubectl top node --show-capacity" },
      ],
    },
    {
      id: "requests-fill-allocatable",
      title: "Requests, not use",
      blocks: [
        {
          kind: "p",
          text: "For each resource, the scheduler places a pod only if its requests, plus those already on the node, fit within allocatable. Use doesn’t enter the check, so a quiet node can still refuse a pod.",
        },
        {
          kind: "p",
          text: [
            "In the output above, five kube-system pods request 680m of the 1,800m allocatable CPU. A pod that requests more than 1,120m of CPU, or 6.23Gi of memory, won’t fit there. A ",
            { a: "DaemonSet", href: "/learn/glossary/daemonset" },
            "’s pods take their requests out of allocatable on every node they run on.",
          ],
        },
        { kind: "svg", figure: figure3 },
        {
          kind: "p",
          text: [
            "The Cluster Autoscaler counts requests too. It considers removing a node only when its pods’ CPU and memory requests are each under 50% of allocatable, DaemonSet pods included by default. The 50% is ",
            { code: "--scale-down-utilization-threshold" },
            ", 0.5 by default. ",
            {
              a: "Cluster Autoscaler not scaling down",
              href: "/learn/cluster-autoscaler-not-scaling-down",
            },
            " covers the other conditions.",
          ],
        },
      ],
    },
    {
      id: "size-pods-against-allocatable",
      title: "Size pods to allocatable",
      blocks: [
        {
          kind: "p",
          text: [
            "When requests sit far above use, idle nodes count as full. New pods then get new machines, and the autoscaler keeps the ones you have. Smaller requests reduce cost only when a node goes. ",
            { a: "Measure the gap", href: "/learn/kubernetes-overprovisioning" },
            " before you change them.",
          ],
        },
        {
          kind: "ol",
          items: [
            [
              { b: "Size your largest pod" },
              " against allocatable minus DaemonSet requests, not against the machine size.",
            ],
            [{ b: "On AKS, choose max pods" }, " for the density you need."],
            [{ b: "Leave the reserves alone" }, " unless you have profiled your nodes."],
            [
              { b: "Set requests from measured use." },
              " ",
              { a: "Right-sizing pods", href: "/learn/kubernetes-pod-right-sizing" },
              " shows how.",
            ],
          ],
        },
      ],
    },
    {
      id: "coral-rebalancing",
      title: "Where Coral fits",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " rebalances pod requests and removes spare nodes on AKS and EKS, without any downtime. It works on the second gap: the requests inside each node’s allocatable. It needs Kubernetes 1.30 or later.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Requests." },
              " Coral sets each container’s CPU and memory requests from measured use, plus headroom. On 1.33+ nodes it resizes running pods in place where it can. Otherwise it restarts them one at a time, within their ",
              { a: "PodDisruptionBudgets", href: "/learn/glossary/pod-disruption-budget" },
              ".",
            ],
            [
              { b: "HPA-aware sizing." },
              " For a workload with a CPU-utilization Horizontal Pod Autoscaler (HPA), Coral picks the CPU request by replaying past load through that HPA’s settings.",
            ],
            [
              { b: "Unclaimed capacity." },
              " The Node list shows each node’s monthly price and the capacity no pod has claimed. It also lists the nodes Coral can’t empty, each with its reason and fix (see ",
              { a: "nodes held", href: "/coral-guide#nodes-held" },
              ").",
            ],
            [
              { b: "Spare nodes." },
              " Node optimization is on from install. It checks that every pod on a node fits on another Ready node, then drains and removes one node at a time. Each pod moves by warm handover or live migration where it can.",
            ],
            [
              { b: "Opt-in sizing." },
              " No pod is resized until you switch on “Automatically optimize” for a policy or a workload.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "On our own AKS development cluster of 3 machines, Coral removed one 4-CPU worker on 6 October. That ",
            { a: "reduced the cluster’s machine cost", href: "/coral-value-lab" },
            " from $368.65 to $221.19 a month, at Azure list prices.",
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
      publisher: "Kubernetes",
      title: "“Reserve Compute Resources for System Daemons”",
      url: "https://kubernetes.io/docs/tasks/administer-cluster/reserve-compute-resources/",
    },
    {
      publisher: "Kubernetes",
      title: "“Resource Management for Pods and Containers”",
      url: "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/",
    },
    {
      publisher: "Kubernetes",
      title: "“kubectl top”",
      url: "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_top/",
    },
    {
      publisher: "Kubernetes",
      title: "“kubectl top node”",
      url: "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_top/kubectl_top_node/",
    },
    {
      publisher: "Kubernetes Cluster Autoscaler",
      title: "“Frequently Asked Questions”",
      url: "https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Node resource reservations in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/node-resource-reservations",
    },
    {
      publisher: "Microsoft Learn",
      title: "“IP address planning in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/concepts-network-ip-address-planning",
    },
    {
      publisher: "AWS",
      title: "“Memory and vCPU considerations for AWS Batch on Amazon EKS”",
      url: "https://docs.aws.amazon.com/batch/latest/userguide/memory-cpu-batch-eks.html",
    },
    {
      publisher: "Karpenter",
      title: "“NodeClasses”",
      url: "https://karpenter.sh/docs/concepts/nodeclasses/",
    },
  ],
  related: [
    {
      title: "Kubernetes overprovisioning",
      where: "Learn",
      href: "/learn/kubernetes-overprovisioning",
    },
    {
      title: "Cluster Autoscaler not scaling down",
      where: "Learn",
      href: "/learn/cluster-autoscaler-not-scaling-down",
    },
    {
      title: "Kubernetes node size best practices",
      where: "Learn",
      href: "/learn/kubernetes-node-size-best-practices",
    },
    {
      title: "How Coral works out pod sizes",
      where: "Coral product guide",
      href: "/coral-guide#how-sizes-are-worked-out",
    },
    {
      title: "How we reduced our own AKS cluster’s machine cost by 58%",
      where: "Coral Value Lab",
      href: "/coral-value-lab",
    },
  ],
  relatedTitle: "More on allocatable and requests",
};
