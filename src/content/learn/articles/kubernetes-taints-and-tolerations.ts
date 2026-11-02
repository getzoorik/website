import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/kubernetes-taints-and-tolerations/1";

export const article: Article = {
  slug: "kubernetes-taints-and-tolerations",
  title: "Kubernetes taints and tolerations explained",
  meta: "Kubernetes taints and tolerations keep pods off nodes: what NoSchedule, PreferNoSchedule and NoExecute do, kubectl taint, and taints on AKS and EKS pools.",
  h1: "Kubernetes taints and tolerations: how a node keeps pods off",
  deck: "A toleration lets a pod onto a tainted node without sending it there, so dedicated pools need node affinity too.",
  card: "What taints and tolerations do, the three effects, the built-in taints, and pool taints on AKS and EKS.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Node lifecycle and scheduling",
  published: "2026-11-02",
  updated: "2026-11-02",
  author: "zoorik",
  cover: "/learn-covers/zoorik-learn-kubernetes-taints-and-tolerations-1200x630.webp",
  coverAlt:
    "Kubernetes taints and tolerations: a tainted node keeps out a pod with no toleration and lets in one that tolerates the taint",
  sections: [
    {
      id: "what-a-taint-and-a-toleration-do",
      title: "What a taint and a toleration do in Kubernetes",
      blocks: [
        {
          kind: "p",
          text: "A taint is a mark on a node that repels pods. A toleration on a pod lets that pod past a matching taint. The Kubernetes docs give three uses for the pair:",
        },
        {
          kind: "ul",
          items: [
            "Dedicated nodes, kept for one team or one app.",
            "Nodes with special hardware, such as GPUs, kept for the pods that need it.",
            "Eviction timing, set per pod, for when a node has problems.",
          ],
        },
        {
          kind: "p",
          text: [
            "To dedicate nodes, the docs’ example taints them ",
            { code: "dedicated=groupName:NoSchedule" },
            " and gives one group’s pods the toleration. Those pods may still run on any other node too. So it also labels the same nodes ",
            { code: "dedicated=groupName" },
            " and gives the pods required ",
            { a: "node affinity", href: "/learn/pod-affinity-vs-node-affinity" },
            " for that label.",
          ],
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "the-three-taint-effects-noschedule-prefernoschedule-and",
      title: "The three taint effects: NoSchedule, PreferNoSchedule and NoExecute",
      blocks: [
        {
          kind: "p",
          text: "A taint’s effect decides what happens to pods that don’t tolerate it:",
        },
        {
          kind: "ul",
          items: [
            [
              { code: "NoSchedule" },
              ": no new pod lands without a matching toleration. Pods already running stay.",
            ],
            [
              { code: "PreferNoSchedule" },
              ": the control plane tries to keep those pods off the node, but the docs say “it is not guaranteed.”",
            ],
            [
              { code: "NoExecute" },
              ": running pods without a matching toleration are evicted immediately, and new ones don’t land.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Under ",
            { code: "NoExecute" },
            ", a pod that tolerates the taint with no ",
            { code: "tolerationSeconds" },
            " stays bound for good. With ",
            { code: "tolerationSeconds: 3600" },
            ", it stays an hour after the taint is added, then it’s evicted. If the taint is removed first, the pod stays.",
          ],
        },
        {
          kind: "p",
          text: [
            "A node can carry several taints, and a pod several tolerations. Kubernetes ignores each taint the pod tolerates. Any ",
            { code: "NoSchedule" },
            " taint left keeps the pod off, and any ",
            { code: "NoExecute" },
            " taint left also evicts it if it’s already running there.",
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            "AWS advises ",
            { code: "NoSchedule" },
            " unless you intend to evict running workloads. A ",
            { code: "NoExecute" },
            " taint isn’t a faster drain either, as ",
            { a: "cordon vs drain", href: "/learn/cordon-vs-drain#noexecute-taints-and-pdbs" },
            " explains.",
          ],
        },
        {
          kind: "h3",
          id: "add-and-remove-a-taint-with-kubectl",
          title: "Add and remove a taint with kubectl taint",
        },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl taint nodes <node-name> dedicated=<group>:NoSchedule\nkubectl taint nodes <node-name> dedicated=<group>:NoSchedule-",
        },
        {
          kind: "p",
          text: [
            "The first command adds the taint, and the second, ending in ",
            { code: "NoSchedule-" },
            ", removes it. ",
            { code: "kubectl describe node <node-name>" },
            " lists a node’s taints.",
          ],
        },
        {
          kind: "p",
          text: [
            { code: "kubectl taint" },
            " changes only the nodes you name. Nodes that a pool adds later come up with the pool’s own taints.",
          ],
        },
      ],
    },
    {
      id: "how-kubernetes-tolerations-match-a-taint",
      title: "How Kubernetes tolerations match a taint",
      blocks: [
        {
          kind: "p",
          text: [
            "Tolerations go in the pod spec. Either one below lets a pod onto a node tainted ",
            { code: "dedicated=batch:NoSchedule" },
            ". The first names the value with ",
            { code: "Equal" },
            ":",
          ],
        },
        {
          kind: "code",
          lang: "yaml",
          code: 'tolerations:\n- key: "dedicated"\n  operator: "Equal"\n  value: "batch"\n  effect: "NoSchedule"',
        },
        {
          kind: "p",
          text: ["The second uses ", { code: "Exists" }, " and leaves the value out:"],
        },
        {
          kind: "code",
          lang: "yaml",
          code: 'tolerations:\n- key: "dedicated"\n  operator: "Exists"\n  effect: "NoSchedule"',
        },
        { kind: "p", text: "The rules for a match:" },
        {
          kind: "ul",
          items: [
            "The key and the effect must both be the same as the taint’s.",
            [{ code: "Equal" }, ", the default operator, also needs the same value."],
            [{ code: "Exists" }, " matches any value, so the toleration sets none."],
            [
              "An empty key with ",
              { code: "Exists" },
              " matches every key, though the effect must still match. An empty effect matches every effect for that key.",
            ],
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            "A toleration with ",
            { code: "operator: Exists" },
            " and no key or effect tolerates every taint. That includes ",
            { code: "node.kubernetes.io/unschedulable" },
            ", so the pod can still land on a cordoned node.",
          ],
        },
      ],
    },
    {
      id: "built-in-taints-kubernetes-adds-to-nodes",
      title: "Built-in taints Kubernetes adds to nodes",
      blocks: [
        {
          kind: "p",
          text: "The node controller taints a node when certain conditions are true. The scheduler checks those taints, not the node conditions, when it places a pod.",
        },
        {
          kind: "table",
          columns: [
            { label: "Taint", width: "46%" },
            { label: "Effect", width: "18%" },
            { label: "Added when", width: "36%" },
          ],
          rows: [
            [
              [{ code: "node.kubernetes.io/not-ready" }],
              [{ code: "NoExecute" }],
              "The node isn’t ready: its Ready condition is False",
            ],
            [
              [{ code: "node.kubernetes.io/unreachable" }],
              [{ code: "NoExecute" }],
              "The node controller can’t reach the node: Ready is Unknown",
            ],
            [
              [{ code: "node.kubernetes.io/memory-pressure" }],
              [{ code: "NoSchedule" }],
              "The node is short of memory",
            ],
            [
              [{ code: "node.kubernetes.io/disk-pressure" }],
              [{ code: "NoSchedule" }],
              "The node is short of disk space or inodes",
            ],
            [
              [{ code: "node.kubernetes.io/pid-pressure" }],
              [{ code: "NoSchedule" }],
              "The node is short of process IDs",
            ],
            [
              [{ code: "node.kubernetes.io/network-unavailable" }],
              [{ code: "NoSchedule" }],
              "The node’s network is unavailable, for example before its cloud routes are set up",
            ],
            [
              [{ code: "node.kubernetes.io/unschedulable" }],
              [{ code: "NoSchedule" }],
              "The node is unschedulable, for example after a cordon",
            ],
            [
              [{ code: "node.cloudprovider.kubernetes.io/uninitialized" }],
              [{ code: "NoSchedule" }],
              "The kubelet started with an external cloud provider, until the cloud-controller-manager initializes the node",
            ],
            [
              [{ code: "node.kubernetes.io/out-of-service" }],
              [{ code: "NoExecute" }],
              "You add it, for a non-graceful node shutdown",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Kubernetes adds tolerations for ",
            { code: "not-ready" },
            " and ",
            { code: "unreachable" },
            " to every pod, with ",
            { code: "tolerationSeconds: 300" },
            ", unless you or a controller set them. So pods stay bound to a node for 5\u00a0minutes after one of these problems is detected.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "DaemonSet", href: "/learn/glossary/daemonset" },
            " pods tolerate ",
            { code: "not-ready" },
            " and ",
            { code: "unreachable" },
            " with no ",
            { code: "tolerationSeconds" },
            ", so those problems never evict them. They also tolerate the memory, disk and PID pressure taints and ",
            { code: "unschedulable" },
            ". That’s how node agents land on cordoned nodes and stay on failing ones.",
          ],
        },
        {
          kind: "p",
          text: [
            "The control plane also gives every pod outside the BestEffort ",
            { a: "quality of service (QoS) class", href: "/learn/glossary/kubernetes-qos-class" },
            " a toleration for ",
            { code: "memory-pressure" },
            ". So only new BestEffort pods are kept off a node short of memory.",
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            { code: "node.kubernetes.io/out-of-service" },
            " is for a non-graceful node shutdown. Pods without a matching toleration are force-deleted, and their volumes detach immediately.",
          ],
        },
      ],
    },
    {
      id: "taints-and-tolerations-on-aks-and-eks",
      title: "Taints and tolerations on AKS and EKS node pools",
      blocks: [
        {
          kind: "p",
          text: [
            "Set a node pool’s taints where the pool is defined, not with kubectl. That’s the ",
            { a: "Azure Kubernetes Service (AKS)", href: "/learn/glossary/aks" },
            " or ",
            { a: "Amazon Elastic Kubernetes Service (EKS)", href: "/learn/glossary/eks" },
            " API, or a ",
            { a: "Karpenter", href: "/learn/what-is-karpenter" },
            " NodePool. New nodes then come up with them.",
          ],
        },
        {
          kind: "h3",
          id: "aks-node-pool-taints-and-the-system",
          title: "AKS: node pool taints, and the system and Spot pools",
        },
        {
          kind: "p",
          text: [
            "Microsoft’s example below taints a node pool with ",
            { code: "sku=gpu:NoSchedule" },
            ". The same command with ",
            { code: '--node-taints ""' },
            " removes the pool’s taints.",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: 'az aks nodepool update \\\n  --resource-group <resource-group> \\\n  --cluster-name <cluster-name> \\\n  --name <node-pool> \\\n  --node-taints "sku=gpu:NoSchedule"',
        },
        {
          kind: "p",
          text: "Taints set through the AKS node pool API can’t be changed through the Kubernetes API, or the other way round. AKS doesn’t allow changes to its system taints.",
        },
        {
          kind: "p",
          text: [
            "For a dedicated system node pool, Microsoft recommends the ",
            { code: "CriticalAddonsOnly=true:NoSchedule" },
            " taint. It keeps application pods off the nodes that run critical system pods.",
          ],
        },
        {
          kind: "p",
          text: [
            "A Spot node pool gets the ",
            { code: "kubernetes.azure.com/scalesetpriority=spot:NoSchedule" },
            " taint and a matching label. Pods need the toleration and node affinity to run there, as in Microsoft’s example:",
          ],
        },
        {
          kind: "code",
          lang: "yaml",
          code: '# in the pod spec\ntolerations:\n- key: "kubernetes.azure.com/scalesetpriority"\n  operator: "Equal"\n  value: "spot"\n  effect: "NoSchedule"\naffinity:\n  nodeAffinity:\n    requiredDuringSchedulingIgnoredDuringExecution:\n      nodeSelectorTerms:\n      - matchExpressions:\n        - key: "kubernetes.azure.com/scalesetpriority"\n          operator: In\n          values:\n          - "spot"',
        },
        {
          kind: "h3",
          id: "eks-managed-node-groups-and-karpenter-nodepools",
          title: "EKS managed node groups and Karpenter NodePools",
        },
        {
          kind: "p",
          text: [
            "The EKS API spells the effects ",
            { code: "NO_SCHEDULE" },
            ", ",
            { code: "PREFER_NO_SCHEDULE" },
            " and ",
            { code: "NO_EXECUTE" },
            ", and a managed node group holds up to 50\u00a0taints. To add or change one on an existing group:",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "aws eks update-nodegroup-config \\\n  --cluster-name <cluster-name> \\\n  --nodegroup-name <node-group> \\\n  --taints 'addOrUpdateTaints=[{key=<key>,value=<value>,effect=NO_SCHEDULE}]'",
        },
        {
          kind: "p",
          text: [
            { code: "removeTaints" },
            " in place of ",
            { code: "addOrUpdateTaints" },
            " takes a taint off. Either way, the running nodes get the change without being replaced. A taint removed from a node by hand isn’t added back, even though the node group still lists it.",
          ],
        },
        {
          kind: "p",
          text: [
            "A Karpenter NodePool puts the taints in its ",
            { code: "spec.template.spec.taints" },
            " on every node it launches. Karpenter won’t use that NodePool for a pod that doesn’t tolerate them.",
          ],
        },
        {
          kind: "p",
          text: [
            "Karpenter treats ",
            { code: "startupTaints" },
            " as temporary. It provisions nodes for pods that don’t tolerate them, and another system, such as a DaemonSet, must clear them before pods run there.",
          ],
        },
        {
          kind: "p",
          text: [
            "Changing a NodePool’s taints counts as drift, so ",
            { a: "EKS Auto Mode", href: "/learn/glossary/eks-auto-mode" },
            " and Karpenter drain and replace its nodes. Change a taint on one node with ",
            { code: "kubectl taint" },
            ", and they put the NodePool’s version back.",
          ],
        },
        {
          kind: "p",
          text: "A taint on GPU nodes also repels a device-plugin DaemonSet you install yourself. Give it the toleration too. Otherwise the node reports no allocatable GPUs, and GPU pods stay Pending.",
        },
      ],
    },
    {
      id: "how-coral-checks-taints-before-it-drains",
      title: "How Coral checks taints before it drains a node",
      blocks: [
        {
          kind: "p",
          text: [
            "Before ",
            { a: "Coral", href: "/coral" },
            " drains a spare node, it simulates the scheduler on the live cluster. Every pod there must fit on another node, with its affinity, taints, spread, ports and zones.",
          ],
        },
        {
          kind: "p",
          text: [
            "It also respects ",
            { a: "PodDisruptionBudgets (PDBs)", href: "/learn/glossary/pod-disruption-budget" },
            " and ",
            { a: "do-not-disrupt", href: "/learn/safe-to-evict-do-not-disrupt" },
            ". A node holding a pod that fits nowhere else isn’t drained. ",
            { a: "The Coral FAQ", href: "/coral-faq#how-do-you-make-sure-node" },
            " explains how it avoids scheduling failures.",
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
      title: "“Taints and Tolerations”",
      url: "https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/",
    },
    {
      publisher: "Kubernetes",
      title: "“Well-Known Labels, Annotations and Taints”",
      url: "https://kubernetes.io/docs/reference/labels-annotations-taints/",
    },
    {
      publisher: "Kubernetes",
      title: "“Assigning Pods to Nodes”",
      url: "https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Use node taints in an Azure Kubernetes Service (AKS) cluster”",
      url: "https://learn.microsoft.com/en-us/azure/aks/use-node-taints",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Add an Azure Spot node pool to an Azure Kubernetes Service (AKS) cluster”",
      url: "https://learn.microsoft.com/en-us/azure/aks/spot-node-pool",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Use System Node Pools in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/use-system-pools",
    },
    {
      publisher: "AWS",
      title: "“Prevent Pods from being scheduled on accelerated nodes”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/node-taints-managed-node-groups.html",
    },
    {
      publisher: "Karpenter",
      title: "“NodePools”",
      url: "https://karpenter.sh/docs/concepts/nodepools/",
    },
  ],
  related: [
    {
      title: "kubectl cordon vs drain in Kubernetes: what each does to a node",
      where: "Learn",
      href: "/learn/cordon-vs-drain",
    },
    {
      title: "Kubernetes node affinity vs pod affinity: what each rule decides",
      where: "Learn",
      href: "/learn/pod-affinity-vs-node-affinity",
    },
    {
      title: "Kubernetes topologySpreadConstraints: maxSkew, zones and scale-down",
      where: "Learn",
      href: "/learn/topology-spread-constraints",
    },
    {
      title: "What is Karpenter? How the Kubernetes node autoscaler picks and removes nodes",
      where: "Learn",
      href: "/learn/what-is-karpenter",
    },
  ],
};
