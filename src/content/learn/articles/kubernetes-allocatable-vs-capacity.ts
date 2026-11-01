import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/kubernetes-allocatable-vs-capacity/1";
import { figure as figure2 } from "@/features/learn/figures/kubernetes-allocatable-vs-capacity/2";
import { figure as figure3 } from "@/features/learn/figures/kubernetes-allocatable-vs-capacity/3";

export const article: Article = {
  slug: "kubernetes-allocatable-vs-capacity",
  title: "Kubernetes allocatable vs capacity on AKS and EKS",
  meta: "Kubernetes allocatable vs capacity: what kube-reserved and eviction thresholds take from a node, AKS and EKS reserve rules, and how requests fill the rest.",
  h1: "Kubernetes allocatable vs capacity: what pods can use",
  deck: "Capacity is everything the node reports. Allocatable is what’s left for pods after its reserves, and requests fill it.",
  card: "Why a node offers pods less than its size, the reserve rules on AKS and EKS, and how requests fill the rest.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes cost basics",
  versus: ["Allocatable", "Capacity"],
  published: "2026-10-24",
  updated: "2026-11-01",
  author: "sonia",
  cover: "/learn-covers/zoorik-learn-kubernetes-allocatable-vs-capacity-1200x630.webp",
  coverAlt:
    "Allocatable vs capacity: a node’s capacity minus what is reserved is the allocatable room for pods",
  short:
    "Kubernetes allocatable vs capacity is the gap between what a node has and what pods can claim. Capacity covers the node’s total CPU, memory, ephemeral storage and pod count. Allocatable is capacity minus what the node reserves for the kubelet, the container runtime and the OS. For memory and storage, the hard eviction threshold comes off too. The scheduler fills allocatable with pod requests, not pod use, so a node can be full while its CPU sits mostly idle.",
  sections: [
    {
      id: "allocatable-vs-capacity",
      title: "Pods get less than the node has",
      blocks: [
        {
          kind: "p",
          text: "Picture a pod that requests 8\u00a0GiB of memory, headed for an 8\u00a0GiB EKS node. It never fits there. The node reports a memory capacity of 7,748\u00a0MiB, not 8,192. Once the reserves and the hard eviction threshold come off, pods can request 7,074\u00a0MiB, the node’s allocatable. That’s 86% of the 8,192\u00a0MiB you pay for, and the EKS worked example below shows the arithmetic.",
        },
        {
          kind: "p",
          text: [
            "Every node has two gaps. You can change little of the first, capacity minus allocatable, which the machine, the platform and max pods set. ",
            { a: "Max pods", href: "/learn/glossary/max-pods-per-node" },
            " is the most pods a node may run. Your manifests set the second gap, between what pods request and what they use.",
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
              "The part of capacity that normal pods can use",
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
              "The machine as the node reports it (7,748\u00a0MiB of memory on the 8\u00a0GiB instance above), and max pods for the pod count",
              "Capacity minus kube-reserved, system-reserved and the hard eviction threshold",
            ],
            [
              "What counts against it",
              "Nothing is scheduled against capacity",
              "Pod requests: the scheduler, the Cluster Autoscaler and Karpenter all count them here",
            ],
            [
              "Use it for",
              "Pricing: you pay for the whole machine",
              "Fitting pods, and counting how many nodes a pool needs",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "The ",
            { a: "EKS and AKS pricing calculator", href: "/eks-and-aks-pricing-calculator" },
            " shows a node’s monthly list price and how much of it your pods can use.",
          ],
        },
      ],
    },
    {
      id: "node-allocatable",
      title: "Kubernetes node allocatable is capacity minus two reserves and an eviction threshold",
      blocks: [
        {
          kind: "p",
          text: "A node runs more than your pods. The kubelet, the container runtime, OS daemons and the kernel all need CPU and memory, and without a reservation they compete with pods for it. Kubernetes calls the fix Node Allocatable. The kubelet sets resources aside for those processes, and the scheduler fits pods only into what’s left.",
        },
        {
          kind: "p",
          text: "Node Allocatable covers CPU, memory and ephemeral storage. Three amounts come off capacity:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Kube-reserved" },
              " is for Kubernetes daemons such as the kubelet and the container runtime, not for system daemons that run as pods. Its size typically depends on how many pods the node can run.",
            ],
            [
              { b: "System-reserved" },
              " covers OS daemons like sshd and udev, plus kernel memory, which Kubernetes doesn’t count against pods.",
            ],
            [
              { b: "The hard eviction threshold" },
              " is the free memory or ephemeral storage below which the kubelet starts evicting pods, so CPU has no threshold.",
            ],
          ],
        },
        {
          kind: "p",
          text: "The Kubernetes docs give one example, a node with 16\u00a0CPUs, 32Gi of memory and 100Gi of storage. Memory and storage are in binary units (1Gi is 1,024Mi), and CPU is in cores or millicores (m, a thousandth of a core).",
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
          text: "Memory and CPU behave differently at the limit. By default, the kubelet evicts pods once their combined memory use passes allocatable, 28.5Gi in the example. CPU never triggers an eviction. Allocatable CPU still holds when the node is busy: if every process on it runs flat out, the pods together get no more than 14.5\u00a0CPUs.",
        },
        {
          kind: "callout",
          label: "For engineers",
          text: [
            "The three amounts are the kubelet configuration fields ",
            { code: "kubeReserved" },
            ", ",
            { code: "systemReserved" },
            " and ",
            { code: "evictionHard" },
            ". The kubelet’s default ",
            { code: "evictionHard" },
            " is ",
            { code: "memory.available" },
            " 100Mi, ",
            { code: "nodefs.available" },
            " 10%, ",
            { code: "nodefs.inodesFree" },
            " 5% and ",
            { code: "imagefs.available" },
            " 15%. Enforcing system-reserved holds the OS daemons’ cgroup to that reserve. That can leave critical system services CPU-starved, OOM-killed or unable to fork, so the docs recommend it only after exhaustive profiling.",
          ],
        },
      ],
    },
    {
      id: "allocatable-on-aks-and-eks",
      title: "Allocatable on AKS and EKS depends on the machine and max pods",
      blocks: [
        {
          kind: "p",
          text: "On a managed cluster you rarely set these values yourself: AKS and the EKS-optimized Amazon Linux AMI set them for you.",
        },
        { kind: "h3", id: "aks", title: "AKS" },
        {
          kind: "p",
          text: [
            "AKS reserves CPU on a sliding scale. A bigger node gives a smaller share of its CPU to kube-reserved, one of the trade-offs in ",
            {
              a: "Kubernetes node size best practices",
              href: "/learn/kubernetes-node-size-best-practices",
            },
            ". Microsoft adds that extra features can reserve more.",
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
            "From AKS 1.29, reserved memory is two amounts added together: the hard eviction threshold, ",
            { code: "memory.available<100Mi" },
            ", and kube-reserved. Kube-reserved is whichever is less: 20\u00a0MB per max pod plus 50\u00a0MB, or 25% of the node’s memory.",
          ],
        },
        {
          kind: "p",
          text: "That ties allocatable memory to max pods. The default max pods varies by network plugin: Azure CNI Overlay defaults to 250, Azure CNI Pod subnet and kubenet to 110, and legacy Azure CNI to 30.",
        },
        {
          kind: "p",
          text: "Microsoft’s formula starts from the VM’s full memory and uses decimal GB, with the 100Mi threshold as 0.1\u00a0GB. The node OS also reserves some CPU and memory on top, Microsoft notes.",
        },
        {
          kind: "p",
          text: "By the formula, a 16\u00a0GB node keeps about 15.25\u00a0GB for pods at 30 max pods and 13.65\u00a0GB at 110. At 250 the 25% cap applies, and pods keep 11.9\u00a0GB, 74% of the node.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: "To change kube-reserved or the eviction thresholds, Microsoft points to a preview: the custom node configuration settings.",
        },
        {
          kind: "p",
          text: [
            "Max pods is the setting you do choose, up to 250, when you create the cluster or add a ",
            { a: "node pool", href: "/learn/glossary/node-pool" },
            ". To change it later, Microsoft says to add a new pool and migrate your pods. Fewer pod slots per node leave more memory for pods, but a pool of many small pods may then need more nodes.",
          ],
        },
        { kind: "h3", id: "eks", title: "EKS" },
        {
          kind: "p",
          text: "On EKS-optimized Amazon Linux AMI nodes, the AMI’s bootstrap sets kube-reserved from the instance type. AWS documents the rule in its guide to AWS Batch on EKS. CPU is graduated: 6% of the first core, 1% of the second, 0.5% each of the third and fourth, and 0.25% of every core after that. Memory is 11\u00a0MiB per max pod plus 255\u00a0MiB, and the hard eviction threshold comes off on top, 100\u00a0MiB in AWS’s example.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "AWS’s example is the opening’s instance, with 2\u00a0vCPUs and 29 max pods. The CPU reserve is 6% of the first core plus 1% of the second, 60m + 10m = 70m, so pods get 2,000m − 70m = 1,930m. The memory reserve is 11 × 29 + 255 = 574\u00a0MiB. Subtract that and the 100\u00a0MiB hard eviction threshold, and pods get 7,748 − 574 − 100 = 7,074\u00a0MiB. An 8\u00a0GiB request is 8,192\u00a0MiB, so it misses by 1,118\u00a0MiB. Capacity already starts 444\u00a0MiB short (8,192 − 7,748), and the reserve and threshold take the other 674\u00a0MiB (574 + 100).",
        },
        {
          kind: "p",
          text: [
            "If ",
            { a: "Karpenter", href: "/learn/what-is-karpenter" },
            " launches your nodes, it calculates the system and kube reserves on the fly. It has its own graduated kube-reserved defaults, and uses the reserves both to configure the node and to make scheduling decisions for your pods. You can override them with ",
            { code: "kubeReserved" },
            " and ",
            { code: "systemReserved" },
            " under ",
            { code: "spec.kubelet" },
            " in the EC2NodeClass. For Bottlerocket, custom AMIs and ",
            { a: "EKS Auto Mode", href: "/learn/glossary/eks-auto-mode" },
            " nodes, read the figures from the node instead of assuming the Amazon Linux formula.",
          ],
        },
      ],
    },
    {
      id: "check-allocatable-vs-capacity",
      title: "How to check Kubernetes allocatable vs capacity on a node",
      blocks: [
        {
          kind: "p",
          text: [
            { code: "kubectl describe node" },
            " prints the Capacity and Allocatable blocks, then totals the CPU and memory its pods request and limit under “Allocated resources”. Capacity minus allocatable is the node’s two reserves plus its hard eviction threshold.",
          ],
        },
        { kind: "code", lang: "bash", code: "kubectl describe node <node-name>" },
        {
          kind: "p",
          text: "The Kubernetes docs’ own example, trimmed, is a 2-CPU node that reserves 200m of its CPU (2,000m − 1,800m) and none of its 110\u00a0pod slots. Memory shows in Ki, kibibytes.",
        },
        {
          kind: "code",
          lang: "text",
          code: "Capacity:\n cpu:                               2\n memory:                            7679792Ki\n pods:                              110\nAllocatable:\n cpu:                               1800m\n memory:                            7474992Ki\n pods:                              110\n[ ... lines removed for clarity ...]\nNon-terminated Pods:        (5 in total)\n[ ... lines removed for clarity ...]\nAllocated resources:\n  (Total limits may be over 100 percent, i.e., overcommitted.)\n  CPU Requests    CPU Limits    Memory Requests    Memory Limits\n  ------------    ----------    ---------------    -------------\n  680m (34%)      400m (20%)    920Mi (11%)        1070Mi (13%)",
        },
        {
          kind: "p",
          text: [
            "For use instead of requests, ",
            { code: "kubectl top node" },
            " reads the Metrics API, so it works only where the cluster serves that API. By default it shows each node’s use against allocatable, and ",
            { code: "--show-capacity" },
            " switches it to capacity.",
          ],
        },
        { kind: "code", lang: "bash", code: "kubectl top node --show-capacity" },
      ],
    },
    {
      id: "requests-fill-allocatable",
      title: "A node fills up by requests, not by use",
      blocks: [
        {
          kind: "p",
          text: "The Kubernetes docs say the scheduler refuses a node when a pod’s requests don’t fit, even when actual CPU and memory use on it is very low. It checks requests alone: for each resource, a pod fits on a node only if its requests plus the requests already there stay within allocatable.",
        },
        {
          kind: "p",
          text: [
            "The node in that output shows the arithmetic. Its five kube-system pods request 680m of its 1,800m allocatable CPU, which leaves 1,120m (1,800m − 680m). A new pod that requests more than that won’t fit there, however quiet the node is. System pods take their requests out of allocatable like any other pod, and a ",
            { a: "DaemonSet", href: "/learn/glossary/daemonset" },
            " does so on every node it runs on.",
          ],
        },
        { kind: "svg", figure: figure3 },
        {
          kind: "p",
          text: [
            "Requests drive the Cluster Autoscaler too. It considers removing a node only when its pods’ CPU requests and memory requests are each under 50% of its allocatable. DaemonSet pods count toward that by default. The 50% comes from ",
            { code: "--scale-down-utilization-threshold" },
            ", 0.5 by default, and ",
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
      title: "Size pods against allocatable, then rebalance requests",
      blocks: [
        {
          kind: "p",
          text: [
            "When requests sit far above use, idle nodes count as full, new pods get new machines, and the autoscaler keeps the ones you have. Smaller requests reduce your cloud cost only when a node goes. ",
            { a: "Kubernetes overprovisioning", href: "/learn/kubernetes-overprovisioning" },
            " shows how to measure the gap.",
          ],
        },
        {
          kind: "ol",
          items: [
            [
              { b: "Size your largest pod" },
              " against allocatable minus DaemonSet requests, never against the machine size.",
            ],
            [
              { b: "On AKS, choose max pods" },
              " for the density you need. On a 16\u00a0GB node, 30 max pods leave pods 3.35\u00a0GB more memory than 250 do (15.25 − 11.9\u00a0GB).",
            ],
            [{ b: "Leave the reserves themselves alone" }, " unless you have profiled your nodes."],
            [
              { b: "Put the effort into rebalancing requests." },
              " ",
              { a: "Kubernetes pod right sizing", href: "/learn/kubernetes-pod-right-sizing" },
              " shows how to set them from measured use.",
            ],
          ],
        },
      ],
    },
    {
      id: "coral-rebalancing",
      title: "How Coral rebalances requests inside allocatable",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " optimizes Kubernetes on AKS and EKS clusters running Kubernetes 1.30 or later, and it works on the second gap: the requests inside each node’s allocatable.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Rebalancing." },
              " On the default balanced policy, Coral sets each container’s CPU request to the 80th percentile of the last 3\u00a0days plus 10%. Its memory request is 10% above the highest use in the last 8\u00a0days. Running pods are resized in place on 1.33+ nodes where possible, or restarted one at a time within their ",
              { a: "PodDisruptionBudgets", href: "/learn/glossary/pod-disruption-budget" },
              ".",
            ],
            [
              { b: "HPA-aware sizing." },
              " For a workload with a CPU-utilization Horizontal Pod Autoscaler (HPA), Coral picks the CPU request by replaying past load through that HPA’s own settings.",
            ],
            [
              { b: "Unclaimed capacity." },
              " The Node list shows every node’s monthly price, the capacity no pod has claimed, and the nodes Coral can’t empty, each with its reason and fix (see ",
              { a: "nodes held", href: "/coral-guide#nodes-held" },
              ").",
            ],
            [
              { b: "Spare nodes." },
              " Node optimization is on from install. It works out from pod requests how many nodes each pool needs, keeps at least one per pool, and leaves to Karpenter, or AKS node auto-provisioning (NAP), the pools they already consolidate. Coral first checks on the live cluster that every pod on a node fits on another Ready node. Then it cordons and drains one node at a time, and hands the empty node to your Cluster Autoscaler, NAP or Karpenter. In a fixed-size pool that nothing else manages, Coral removes the machine itself. A pod gets a short restart if its replacement can’t start first.",
            ],
            [
              { b: "Opt-in." },
              " No pod is resized until you switch on “Automatically optimize” for a policy or a workload.",
            ],
          ],
        },
        {
          kind: "p",
          text: "On our own AKS development cluster of 3 machines and 10\u00a0CPUs, Coral found that the apps would fit on fewer machines. It removed one 4-CPU worker on 6 October, which reduced the cluster’s machine cost from $368.65 to $221.19 a month. Apps that ran a single copy restarted once on another machine.",
        },
        {
          kind: "p",
          text: [
            "On 12 October it swapped the remaining worker for a cheaper machine of the same size. Eight days after we connected it, ",
            { a: "the cluster’s machines cost", href: "/coral-value-lab" },
            " $154.76 a month, 58% less.",
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
      title: "Kubernetes overprovisioning: what it is and how to measure it",
      where: "Learn",
      href: "/learn/kubernetes-overprovisioning",
    },
    {
      title: "Cluster Autoscaler not scaling down: what keeps nodes running",
      where: "Learn",
      href: "/learn/cluster-autoscaler-not-scaling-down",
    },
    {
      title: "Kubernetes node size best practices: large or small nodes",
      where: "Learn",
      href: "/learn/kubernetes-node-size-best-practices",
    },
    {
      title: "How sizes are worked out",
      where: "Coral product guide",
      href: "/coral-guide#how-sizes-are-worked-out",
    },
    {
      title: "How We Reduced AKS Cluster Costs by 58%",
      where: "Case study",
      href: "/coral-value-lab",
    },
  ],
};
