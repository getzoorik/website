import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/kubernetes-allocatable-vs-capacity/1";
import { figure as figure2 } from "@/features/learn/figures/kubernetes-allocatable-vs-capacity/2";

export const article: Article = {
  slug: "kubernetes-allocatable-vs-capacity",
  title: "Kubernetes allocatable vs capacity on AKS and EKS",
  meta: "Kubernetes allocatable vs capacity: what kube-reserved and eviction thresholds take from a node, AKS and EKS reserve rules, and how requests fill the rest.",
  h1: "Kubernetes allocatable vs capacity: what pods can use",
  deck: "Capacity is the whole node. Allocatable is what’s left for pods after the node’s reserves, and requests fill it.",
  card: "Why a node offers pods less than its size, the reserve rules on AKS and EKS, and how requests fill the rest.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes cost basics",
  versus: ["Allocatable", "Capacity"],
  published: "2026-10-26",
  updated: "2026-10-26",
  author: "sonia",
  short:
    "Kubernetes allocatable vs capacity is the gap between what a node has and what pods may claim. Capacity covers the node’s total CPU, memory, ephemeral storage and pod count. Allocatable is capacity minus what the node reserves for the kubelet, the container runtime and the OS, and, for memory and storage, the hard eviction threshold. The scheduler fills allocatable with pod requests, not pod use, so a node can be full while its CPU sits mostly idle.",
  sections: [
    {
      id: "kubernetes-allocatable-vs-capacity-at-a-glance",
      title: "Kubernetes allocatable vs capacity at a glance",
      blocks: [
        {
          kind: "p",
          text: [
            "Every node reports two sets of figures in its status. The capacity block is the total of each resource the node has, and the allocatable block shows the part of it that normal pods can use. Both list CPU, memory, ephemeral storage and the maximum number of pods. ",
            { code: "kubectl describe node" },
            " prints both.",
          ],
        },
        {
          kind: "p",
          text: "They differ because a node runs more than your pods. The kubelet, the container runtime, OS daemons and the kernel all need CPU and memory, and without a reservation they compete with pods for it. Kubernetes calls the fix Node Allocatable: the kubelet sets resources aside for those processes (kube-reserved for Kubernetes daemons, system-reserved for the OS), and the scheduler never books past what’s left.",
        },
        {
          kind: "table",
          columns: [
            { label: "What you decide on", width: "14%" },
            { label: "Capacity", width: "41%" },
            { label: "Allocatable", width: "45%" },
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
              "The machine size, and the max pods setting for the pod count",
              "Capacity minus kube-reserved, system-reserved and the hard eviction threshold",
            ],
            [
              "What counts against it",
              "Nothing is scheduled against capacity",
              "Pod requests: the scheduler, the Cluster Autoscaler and Karpenter all count them here",
            ],
            [
              ["What ", { code: "kubectl top node" }, " shows"],
              ["Use as a share of capacity, with ", { code: "--show-capacity" }],
              "Use as a share of allocatable, the default",
            ],
            [
              "Use it for",
              "Pricing: you pay for the whole machine",
              "Fitting pods, and counting how many nodes a pool needs",
            ],
          ],
        },
      ],
    },
    {
      id: "how-kubernetes-node-allocatable-is-worked-out",
      title: "How Kubernetes node allocatable is worked out",
      blocks: [
        {
          kind: "p",
          text: "Three amounts come off capacity, and each is a kubelet configuration field. Node Allocatable applies to CPU, memory and ephemeral storage, the Kubernetes allocatable resources a reserve can take from.",
        },
        {
          kind: "ul",
          items: [
            [
              { code: "kubeReserved" },
              " is for Kubernetes daemons such as the kubelet and the container runtime, not for system daemons that run as pods. The Kubernetes docs say it is usually a function of pod density.",
            ],
            [
              { code: "systemReserved" },
              " is for OS daemons such as sshd and udev, and for kernel memory, which Kubernetes doesn’t count against pods.",
            ],
            [
              { code: "evictionHard" },
              " holds the hard eviction thresholds. The docs say evictions are supported for memory and ephemeral storage only, so this comes off those two and never off CPU. The Kubernetes docs give the kubelet’s default ",
              { code: "evictionHard" },
              " as ",
              { code: "memory.available" },
              " 100Mi, ",
              { code: "nodefs.available" },
              " 10%, ",
              { code: "nodefs.inodesFree" },
              " 5% and ",
              { code: "imagefs.available" },
              " 15%.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "The Kubernetes docs work one example through. A node with 16\u00a0CPUs, 32Gi of memory and 100Gi of storage reserves 1\u00a0CPU, 2Gi and 1Gi of storage for Kubernetes daemons, and 500m, 1Gi and 1Gi for the system. Its hard eviction thresholds are 500Mi of memory and 10% of storage. Allocatable comes to 14.5\u00a0CPUs, 28.5Gi of memory and 88Gi of storage. The pod count isn’t reduced: in the docs’ ",
            { code: "kubectl describe" },
            " output, a node with a capacity of 110\u00a0pods has 110 allocatable.",
          ],
        },
        { kind: "diagram", figure: figure1 },
        {
          kind: "p",
          text: "The two main resources behave differently at the limit. Kubernetes allocatable memory is enforced by eviction: by default the kubelet evicts pods once their combined memory use passes allocatable, 28.5Gi in the example. Kubernetes allocatable CPU isn’t enforced by eviction, because CPU never triggers one. It holds when the node is busy: if every process on that node runs flat out, the pods together still get no more than 14.5\u00a0CPUs.",
        },
      ],
    },
    {
      id: "allocatable-on-aks-and-eks",
      title: "Allocatable on AKS and EKS",
      blocks: [
        {
          kind: "p",
          text: "On a managed cluster you rarely write these values yourself. AKS and the EKS-optimized Amazon Linux AMI work them out from the machine and its max pods.",
        },
        { kind: "h3", id: "aks", title: "AKS" },
        {
          kind: "p",
          text: "AKS reserves CPU on a sliding scale, in millicores (m, a thousandth of a core): 60m on a 1-core node, 100m on 2\u00a0cores, 140m on 4, 180m on 8, 260m on 16, 420m on 32 and 740m on 64. Microsoft adds that extra features can reserve more.",
        },
        {
          kind: "p",
          text: [
            "From AKS 1.29, reserved memory is two amounts added together: the hard eviction threshold, ",
            { code: "memory.available<100Mi" },
            ", and kube-reserved, which is 20\u00a0MB per max pod plus 50\u00a0MB or 25% of the node’s memory, whichever is less.",
          ],
        },
        {
          kind: "p",
          text: "That ties allocatable memory to max pods. The default max pods depends on the network plugin. Azure CNI Overlay defaults to 250, Azure CNI Pod subnet and kubenet to 110, and legacy Azure CNI to 30. By Microsoft’s formula, a 16\u00a0GB node keeps about 15.25\u00a0GB for pods at 30 max pods and 13.65\u00a0GB at 110. At 250 the 25% cap applies, and pods keep 11.9\u00a0GB.",
        },
        { kind: "diagram", figure: figure2 },
        {
          kind: "p",
          text: [
            "Microsoft says “you can’t change resource reservations on a node”. The one exception it documents is a preview: custom node configuration can set kubeReserved and the hard eviction threshold on Linux node pools once you register the ",
            { code: "AKSNodeCustomizationPreview" },
            " feature flag. Max pods is the setting you do choose, at cluster creation or when you add a node pool, up to 250. Setting fewer pod slots per node frees memory for pods, but a pool of many small pods may then need more nodes.",
          ],
        },
        { kind: "h3", id: "eks", title: "EKS" },
        {
          kind: "p",
          text: "On nodes built from the EKS-optimized Amazon Linux AMI, the AMI’s bootstrap sets kube-reserved from the instance type, and AWS documents the rule in its guide to AWS Batch on EKS. CPU is graduated: 6% of the first core, 1% of the second, 0.5% each of the third and fourth, and 0.25% of every core after that. Memory is 11\u00a0MiB per max pod plus 255\u00a0MiB. The hard eviction threshold comes off on top, 100\u00a0MiB in AWS’s example.",
        },
        {
          kind: "p",
          text: "AWS’s worked example is a 2-vCPU instance with 8\u00a0GiB of memory, which the node sees as 7,748\u00a0MiB, and 29 max pods. The reserves come to 70m of CPU and 574\u00a0MiB of memory, the eviction threshold takes another 100\u00a0MiB, and pods get 1,930m and 7,074\u00a0MiB. So a pod that requests 8\u00a0GiB never fits on an 8\u00a0GiB instance.",
        },
        {
          kind: "p",
          text: [
            { a: "Karpenter", href: "/learn/what-is-karpenter" },
            " does its own arithmetic. If it launches your nodes, it works out the system and kube reserves on the fly, with its own graduated kubeReserved defaults, and uses them both to configure the node and to make scheduling decisions for your pods. You can override them with ",
            { code: "kubeReserved" },
            " and ",
            { code: "systemReserved" },
            " under ",
            { code: "spec.kubelet" },
            " in the EC2NodeClass. For Bottlerocket, custom AMIs and EKS Auto Mode nodes, read the figures from the node rather than assuming the Amazon Linux formula.",
          ],
        },
      ],
    },
    {
      id: "how-to-check-a-nodes-capacity-and",
      title: "How to check a node’s capacity and allocatable",
      blocks: [
        {
          kind: "p",
          text: [
            "For a real node, ",
            { code: "kubectl describe node" },
            " shows Kubernetes node allocatable vs capacity side by side: the Capacity and Allocatable blocks, then under “Allocated resources” the CPU and memory its pods request and limit. Capacity minus allocatable is the node’s total reserve.",
          ],
        },
        { kind: "code", lang: "bash", code: "kubectl describe node <node-name>" },
        {
          kind: "p",
          text: [
            "For use rather than requests, ",
            { code: "kubectl top node" },
            " reads the Metrics API, so it works only where the cluster serves that API. It shows each node’s use against allocatable by default, and ",
            { code: "--show-capacity" },
            " switches it to capacity.",
          ],
        },
        { kind: "code", lang: "bash", code: "kubectl top node --show-capacity" },
      ],
    },
    {
      id: "why-a-node-fills-up-by-requests",
      title: "Why a node fills up by requests, not by use",
      blocks: [
        {
          kind: "p",
          text: "The scheduler works with requests alone. For each resource, a pod fits on a node only if its requests plus the requests already there stay within allocatable. Real use doesn’t enter the check, and the Kubernetes docs say the scheduler turns a node down even when actual CPU and memory use on it is very low.",
        },
        {
          kind: "p",
          text: [
            "The docs’ ",
            { code: "kubectl describe" },
            " example shows the arithmetic. A node with a capacity of 2\u00a0CPUs has 1,800m allocatable, and its five kube-system pods request 680m between them. A new pod that requests more than 1.12\u00a0CPUs won’t fit there, however quiet the node is. System pods take their requests out of allocatable like any other pod, and a DaemonSet does so on every node it runs on.",
          ],
        },
        {
          kind: "p",
          text: [
            "Node autoscalers count the same way. The Cluster Autoscaler considers removing a node only when its pods’ CPU requests and memory requests are each under 50% of its allocatable, DaemonSet pods included by default. That 0.5 is the default ",
            { code: "--scale-down-utilization-threshold" },
            ", and ",
            {
              a: "Cluster Autoscaler not scaling down",
              href: "/learn/cluster-autoscaler-not-scaling-down",
            },
            " covers the other conditions. Karpenter also counts its reserves when it makes scheduling decisions for your pods.",
          ],
        },
        {
          kind: "p",
          text: [
            "So every node carries two gaps. The first, capacity minus allocatable, is set by the machine, the platform and max pods, and you can change little of it. The second, between requests and real use, is set by your manifests. When requests sit far above use, idle nodes count as full, new pods get new machines, and the autoscaler keeps the ones you have. ",
            { a: "Kubernetes overprovisioning", href: "/learn/kubernetes-overprovisioning" },
            " covers what that costs and how to measure it.",
          ],
        },
        { kind: "p", text: "What to do with the two gaps, in order:" },
        {
          kind: "ol",
          items: [
            "Size your largest pod against allocatable minus DaemonSet requests, never against the machine size.",
            "On AKS, set max pods to the density you need. At 250, a 16\u00a0GB node gives a quarter of its memory to kube-reserved.",
            "Leave the reserves themselves alone unless you have profiled your nodes. Without them, the Kubernetes docs warn, pods and system daemons compete for resources and starve the node. Take extra care before enforcing systemReserved with a cgroup: the docs recommend it only after exhaustive profiling, because it can leave critical system services CPU-starved, OOM-killed or unable to fork.",
            [
              "Put the effort into requests. That’s the gap your manifests control, and ",
              { a: "Kubernetes pod right sizing", href: "/learn/kubernetes-pod-right-sizing" },
              " covers setting them from measured use.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Node size also moves the first gap. On AKS, 140m is 3.5% of a 4-core node and 260m is 1.6% of a 16-core one, one of the trade-offs ",
            {
              a: "Kubernetes node size best practices",
              href: "/learn/kubernetes-node-size-best-practices",
            },
            " covers.",
          ],
        },
      ],
    },
    {
      id: "how-coral-rebalances-requests-inside-allocatable",
      title: "How Coral rebalances requests inside allocatable",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral optimizes Kubernetes", href: "/coral" },
            " on AKS and EKS clusters running Kubernetes 1.30 or later. It works on the second gap, the requests inside each node’s allocatable.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Requests." },
              " On the default balanced policy, Coral rebalances each container’s CPU request to the 80th percentile of the last 3\u00a0days plus 10%, and sets memory from the highest use in the last 8\u00a0days plus 10%. With a CPU-based HPA, it picks the CPU request by replaying past load through that HPA’s own settings. Nothing is resized until you switch on “Automatically optimize” for a policy or a workload. Running pods are resized in place on 1.33+ nodes, and otherwise restarted one at a time within their PodDisruptionBudgets.",
            ],
            [
              { b: "Unclaimed capacity." },
              " The Node list shows every node’s monthly price, the capacity no pod has claimed, and the nodes Coral can’t empty, each with its reason and fix (see ",
              { a: "nodes held", href: "/coral/guide#nodes-held" },
              ").",
            ],
            [
              { b: "Spare nodes." },
              " Node optimization is on from install. It uses pod requests to work out how many nodes each pool needs, and every pool keeps at least one. Before it moves anything, the agent checks on the live cluster that every pod on the node fits on another Ready node. Then it cordons and drains one node at a time and hands the empty node to your Cluster Autoscaler, NAP or Karpenter. Pools that Karpenter or NAP already consolidate are left to them. When a node is removed, a pod whose replacement can’t start first gets a short restart.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "On our own AKS development cluster, which ran 3 machines with 10\u00a0CPUs in all, Coral worked out that the apps would fit on fewer machines and removed one 4-CPU worker on 6 October, $147.46 a month less. Apps that ran a single copy restarted once on another machine. The full run is in ",
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
      href: "/coral/guide#how-sizes-are-worked-out",
    },
    {
      title: "How we reduced our own cluster’s machine bill by 58%",
      where: "Case study",
      href: "/case-studies/coral-dev-cluster",
    },
  ],
};
