import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/karpenter-vs-cluster-autoscaler/1";

export const article: Article = {
  slug: "karpenter-vs-cluster-autoscaler",
  title: "Karpenter vs Cluster Autoscaler on EKS and AKS",
  meta: "Karpenter vs Cluster Autoscaler: how each adds and removes nodes on EKS and AKS, whether the two can share a cluster, and which fits your workloads.",
  h1: "Karpenter vs Cluster Autoscaler: how each removes nodes",
  deck: "One grows preset node groups, the other picks a machine per batch of pods. How each scales down, and when to run both.",
  card: "How the Cluster Autoscaler and Karpenter add and remove nodes on EKS and AKS, and whether to run both at once.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes autoscaling",
  versus: ["Karpenter", "Cluster Autoscaler"],
  published: "2026-11-03",
  updated: "2026-11-03",
  author: "sushant",
  short:
    "The difference in Karpenter vs Cluster Autoscaler is what each can change when it scales: the Cluster Autoscaler only grows and shrinks node groups you set up in advance, and never changes a node’s size. Karpenter picks a machine type for each batch of pending pods, and later deletes a node or swaps it for a cheaper one. Both count pod requests, not real use. They can share a cluster when taints keep each workload on one autoscaler’s nodes.",
  sections: [
    {
      id: "karpenter-vs-cluster-autoscaler-at-a-glance",
      title: "Karpenter vs Cluster Autoscaler at a glance",
      blocks: [
        {
          kind: "p",
          text: "Both are node autoscalers sponsored by Kubernetes SIG Autoscaling, so Karpenter vs Kubernetes Cluster Autoscaler is a choice between two Kubernetes projects. The Cluster Autoscaler’s cloud integrations are part of the Kubernetes project, while Karpenter is a library that cloud providers such as AWS and Azure build their autoscalers on. To a cluster user, the Kubernetes docs say, they should feel alike: both add nodes for pods that can’t be scheduled, and both consolidate nodes that are “no longer optimally utilized.” What differs is the unit each one works with. The Cluster Autoscaler “adds or removes Nodes to pre-configured Node groups”, which usually map to a cloud group of virtual machines (VMs), while Karpenter works with individual VMs and doesn’t rely on those groups.",
        },
        {
          kind: "p",
          text: [
            "Both sit one layer below the pod autoscalers, which ",
            {
              a: "HPA vs VPA vs Cluster Autoscaler",
              href: "/learn/hpa-vs-vpa-vs-cluster-autoscaler",
            },
            " compares, and both run on Amazon Elastic Kubernetes Service (EKS) and Azure Kubernetes Service (AKS).",
          ],
        },
        {
          kind: "table",
          columns: [
            { label: "What you decide on", width: "14%" },
            { label: "Cluster Autoscaler", width: "40%" },
            { label: "Karpenter", width: "46%" },
          ],
          rows: [
            [
              "What it changes",
              "The node count of node groups you set up in advance: Auto Scaling groups on EKS, node pools on AKS",
              "Individual machines, within the rules of a NodePool you write",
            ],
            [
              "Machine types",
              "Set in advance per group. Its FAQ assumes every machine in a group has identical capacity and labels",
              "Chosen per batch of pending pods from the types the NodePool allows. On AWS it passes up to 60 instance types to EC2 Fleet",
            ],
            [
              "When it adds a node",
              "A pod is unschedulable. It checks every 10\u00a0seconds and picks which group to grow with an expander (upstream default: the group left with the least idle CPU)",
              "A pod is unschedulable. It batches pending pods and bin-packs them by the CPU, memory and GPUs they request",
            ],
            [
              "When it removes a node",
              "CPU and memory requests both under 50% of allocatable, every pod can move, and the node has been unneeded for 10\u00a0minutes",
              [
                "Its pods fit on other nodes (delete), or on those plus one cheaper node (replace). No wait by default (",
                { code: "consolidateAfter: 0s" },
                ")",
              ],
            ],
            ["Swaps a node for a cheaper one", "No", "Yes, the replace action"],
            [
              "Pace of removal",
              "One non-empty node at a time. Empty nodes up to 10 at once",
              "A NodePool disruption budget: 10% of the pool’s nodes by default",
            ],
            [
              "Node lifecycle",
              "Node autoscaling only",
              [
                "Also replaces nodes that drift from their NodePool or fail health checks (node auto repair, alpha, when enabled), and drains nodes past ",
                { code: "expireAfter" },
                " (720h by default)",
              ],
            ],
            [
              "Kubernetes version",
              "More tightly coupled to Kubernetes versions, per AWS’s best practices",
              "Not as tightly coupled. A compatibility matrix lists the supported Kubernetes versions per release",
            ],
            [
              "On EKS",
              "You run it against Auto Scaling groups",
              "You install and run it, or use EKS Auto Mode, which builds on it",
            ],
            [
              "On AKS",
              "Built in: you switch it on per node pool",
              "Node auto-provisioning (NAP), which runs Karpenter for you",
            ],
          ],
        },
      ],
    },
    {
      id: "how-the-cluster-autoscaler-removes-nodes",
      title: "How the Cluster Autoscaler removes nodes",
      blocks: [
        {
          kind: "p",
          text: [
            "Every 10\u00a0seconds, when no scale-up is needed, the Cluster Autoscaler checks which nodes are unneeded. Three conditions must all hold. The CPU requests and the memory requests of the node’s pods must each add up to less than 50% of its allocatable, the share of its capacity offered to pods (",
            { code: "--scale-down-utilization-threshold" },
            ", 0.5 by default). Every pod apart from DaemonSet and mirror pods must be able to move to another node. And the node must not carry the scale-down-disabled annotation.",
          ],
        },
        {
          kind: "p",
          text: "A node that stays unneeded for 10\u00a0minutes is terminated. To empty it, the autoscaler evicts its pods through the eviction API, which honours PodDisruptionBudgets (PDBs), and taints the node so they aren’t scheduled there again. Non-empty nodes go one at a time, and empty ones in bulk, up to 10 at once. Scale-down also stops at the node group’s minimum size, and after any scale-up the autoscaler waits 10\u00a0minutes before it looks at scale-down again.",
        },
        {
          kind: "p",
          text: [
            "What it never does is change a node’s size. Its FAQ assumes that inside a node group “all machines have identical capacity.” So when nodes are too big for their pods, it can only take whole nodes away. Moving to smaller machines is a change you make to the groups yourself, usually a new group and a drain, covered for ",
            { a: "EKS node groups", href: "/learn/change-eks-node-group-instance-type" },
            " and ",
            { a: "AKS node pools", href: "/learn/change-aks-node-pool-vm-size" },
            ". If a node stays that you expected to go, ",
            {
              a: "Cluster Autoscaler not scaling down",
              href: "/learn/cluster-autoscaler-not-scaling-down",
            },
            " lists the reasons.",
          ],
        },
      ],
    },
    {
      id: "how-karpenter-removes-nodes",
      title: "How Karpenter removes nodes",
      blocks: [
        {
          kind: "p",
          text: "Karpenter calls node removal disruption, and consolidation is the method aimed at cost. A node can be deleted when all its pods can run on free capacity of other nodes, or replaced when they fit on that free capacity plus a single cheaper node. Karpenter looks in a set order: empty nodes first, deleted in parallel, then two or more nodes at once, then each node on its own.",
        },
        {
          kind: "p",
          text: [
            "There’s no utilization threshold to tune. Microsoft’s migration guide maps the Cluster Autoscaler’s threshold to ",
            { code: "consolidationPolicy" },
            ", which decides which nodes count. The default, ",
            { code: "WhenEmptyOrUnderutilized" },
            ", considers any node that can be removed or replaced to reduce cost, and ",
            { code: "WhenEmpty" },
            " waits until only pods with no disruption cost, such as DaemonSet pods, are left. ",
            { a: "Karpenter consolidation", href: "/learn/karpenter-consolidation" },
            " covers the third value, ",
            { code: "Balanced" },
            ", and the other settings.",
          ],
        },
        {
          kind: "p",
          text: [
            "Two fields set the pace. ",
            { code: "consolidateAfter" },
            ", ",
            { code: "0s" },
            " by default, is how long a node must go without pods arriving or leaving before it becomes a candidate. A disruption budget caps how many of a NodePool’s nodes can be disrupted at once, and when you set none, Karpenter uses ",
            { code: "nodes: 10%" },
            ", rounded up. Each removal taints the node ",
            { code: "karpenter.sh/disrupted:NoSchedule" },
            " and starts any replacement. Once that’s ready, Karpenter drains the node through the eviction API, which respects PDBs.",
          ],
        },
        {
          kind: "p",
          text: [
            "Consolidation is only part of the job. In the Kubernetes docs’ words, Karpenter “handles all aspects of node lifecycle, not just autoscaling”: it replaces nodes that drift from a changed NodePool or node class, and drains nodes older than ",
            { code: "expireAfter" },
            ", 720\u00a0hours (30\u00a0days) by default. Disruption budgets don’t hold expiry back.",
          ],
        },
      ],
    },
    {
      id: "the-same-cluster-under-each-autoscaler",
      title: "The same cluster under each autoscaler",
      blocks: [
        {
          kind: "p",
          text: "Take a group of two on-demand nodes, minimum size 1, with 8\u00a0CPU allocatable each, whose pods request 1.5\u00a0CPU per node. With memory and DaemonSet requests small, each node sits at 19%, under the 50% threshold.",
        },
        {
          kind: "p",
          text: "The Cluster Autoscaler finds that either node’s pods fit on the other. Once one node has been unneeded for 10\u00a0minutes, it evicts that node’s pods, and they move across. The survivor’s requests now total 3\u00a0CPU, 37.5%, still under the threshold, but its pods have nowhere else to go. So it stays. You keep one 8-CPU machine for 3\u00a0CPU of requests.",
        },
        {
          kind: "p",
          text: "Karpenter, on the default policy, goes further. It can delete one node, because its pods fit on the other, then replace the survivor with one cheaper node that still fits its pods and DaemonSets, such as a 4-CPU machine, if the NodePool allows that type. Its default budget lets it disrupt one of the two nodes at a time.",
        },
        { kind: "diagram", figure: figure1 },
        {
          kind: "p",
          text: [
            "Both did that arithmetic on requests. Consolidation, the Kubernetes docs say, “only considers Pod resource requests and not real resource usage when making decisions.” If those pods use 0.3\u00a0CPU per node, neither autoscaler sees the gap, and you keep paying for room no process uses. Requests set from measured use change the result, as ",
            { a: "Kubernetes pod right sizing", href: "/learn/kubernetes-pod-right-sizing" },
            " and ",
            { a: "the requests Karpenter can’t fix", href: "/learn/karpenter-cost-optimization" },
            " explain.",
          ],
        },
      ],
    },
    {
      id: "can-karpenter-and-cluster-autoscaler-work-together",
      title: "Can Karpenter and Cluster Autoscaler work together?",
      blocks: [
        {
          kind: "p",
          text: "Yes, if each workload can land on only one autoscaler’s nodes. Karpenter’s FAQ says it “can work alongside Cluster Autoscaler”, and its NodePools are designed to sit beside static capacity such as EKS managed node groups. The catch is that both react to the same signal, a pod “the Kubernetes scheduler has marked as unschedulable.”",
        },
        {
          kind: "p",
          text: [
            "Microsoft spells out what follows on AKS: running its cluster autoscaler beside NAP needs the ",
            { code: "AllowClusterAutoscalerAndNAP" },
            " feature flag, and the migration guide warns that both scalers “react to pending pod pressure, and can lead to double provisioning of nodes.” Its fix is mutually exclusive scheduling, with a taint on each side and a toleration that sends each workload to one of them. Microsoft treats the pairing as a migration step, and warns that keeping it indefinitely can make scaling unpredictable.",
          ],
        },
        {
          kind: "p",
          text: "On EKS, Karpenter’s migration guide ends the overlap once Karpenter is running. Scaling the Cluster Autoscaler to zero replicas stops all of its scaling, so do it only after Karpenter works:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl scale deploy/cluster-autoscaler -n kube-system --replicas=0",
        },
        {
          kind: "p",
          text: "The guide then shrinks the old node group to a fixed size for Karpenter and critical add-ons such as CoreDNS: 2 instances for one group spread across Availability Zones. That shrink drains the extra nodes, and without PDBs, the guide warns, workloads will be unavailable. Keep that group: AWS’s best practices say to run Karpenter’s controller on a node group or EKS Fargate, never on a node Karpenter manages.",
        },
      ],
    },
    {
      id: "choosing-on-eks-and-aks",
      title: "Choosing on EKS and AKS",
      blocks: [
        {
          kind: "h3",
          id: "eks-karpenter-vs-cluster-autoscaler",
          title: "EKS Karpenter vs Cluster Autoscaler",
        },
        {
          kind: "p",
          text: "On EKS, AWS documents three routes. EKS Auto Mode creates a node when a pod can’t fit, consolidates workloads and deletes nodes, and AWS says it “builds upon Karpenter.” Karpenter itself is open-source software you install and manage, with AWS technical support when it runs unmodified at a compatible version, and no AWS Service Level Agreement. The Cluster Autoscaler works through Auto Scaling groups.",
        },
        {
          kind: "p",
          text: "For the AWS EKS Cluster Autoscaler vs Karpenter decision, AWS’s best practices guide gives a rule of thumb. Karpenter suits clusters “with workloads that encounter periods of high, spiky demand or have diverse compute requirements,” while managed node groups and Auto Scaling groups suit workloads “that tend to be more static and consistent.” The guide also says to consider other autoscalers if you need a feature Karpenter lacks. If you run Spot capacity, Karpenter can mix Spot and on-demand capacity, and with an Amazon Simple Queue Service (SQS) interruption queue it starts a new node when a Spot instance gets its 2-minute interruption notice, so pods can move before the instance is reclaimed.",
        },
        {
          kind: "h3",
          id: "karpenter-vs-aks-autoscaler-nap-or-the",
          title: "Karpenter vs AKS autoscaler: NAP or the cluster autoscaler",
        },
        {
          kind: "p",
          text: [
            "On AKS, the cluster autoscaler is built in. You switch it on per node pool and tune it through the cluster’s autoscaler profile with ",
            { code: "az aks update --cluster-autoscaler-profile" },
            ", and Microsoft lists the same defaults as upstream: a 0.5 threshold, a 10-minute unneeded time and a 10-second scan interval.",
          ],
        },
        {
          kind: "p",
          text: [
            "Microsoft’s managed Karpenter on AKS is node auto-provisioning (NAP), which deploys and manages it for you. You write NodePool and AKSNodeClass resources instead of configuring AKS node pools through the CLI, and NAP chooses VM sizes from pending pods’ requests. Microsoft’s comparison sets the cluster autoscaler’s “Preexisting node pools with single VM size per pool” against NAP’s “Dynamic provisioning of mixed VM sizes,” and says the cluster autoscaler “is maintained, with minimal feature enhancements.” ",
            { a: "AKS node auto provisioning", href: "/learn/aks-node-auto-provisioning" },
            " covers enabling it.",
          ],
        },
      ],
    },
    {
      id: "how-coral-works-with-either-autoscaler",
      title: "How Coral works with either autoscaler",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " optimizes Kubernetes on AKS and EKS beside whichever node autoscaler you run. It never adds nodes for demand, so scale-up stays with Karpenter, NAP or the Cluster Autoscaler. Coral rebalances CPU and memory requests to measured use, so the same autoscaler can run fewer or smaller nodes. What it does with the nodes depends on the autoscaler:",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "With the Cluster Autoscaler:" },
              " Coral checks on the live cluster that every pod on a node fits on another Ready node, then cordons and drains one node at a time. After “Wait before removing empty nodes” (5\u00a0minutes by default), it hands the empty node to your Cluster Autoscaler, whose own timers decide when it goes. Coral empties nodes but never changes their size.",
            ],
            [
              { b: "With Karpenter or NAP:" },
              " Coral leaves the pools they already consolidate to them, and can also rebalance the nodes you choose onto cheaper machines that still fit the work. After you compare current and rebalanced cost, Coral creates fixed-size NodePools named zoorik-rb-…, your Karpenter or NAP launches the new machines, and the old nodes are drained and removed one by one.",
            ],
            [
              { b: "With no node autoscaler:" },
              " connecting the cluster sets up NAP on AKS (which needs Azure CNI) or Karpenter on EKS, with your approval.",
            ],
          ],
        },
        {
          kind: "p",
          text: "When a node is removed, a pod whose replacement can’t start first gets a short restart.",
        },
        {
          kind: "p",
          text: [
            "On our own AKS development cluster, node optimization removed a spare 4-CPU worker, $147.46 a month, and rebalancing swapped the remaining worker for a cheaper machine of the same size, $66.43 a month less, as ",
            {
              a: "How we reduced our own cluster’s machine bill by 58%",
              href: "/case-studies/coral-dev-cluster",
            },
            " shows.",
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
      title: "“Node Autoscaling”",
      url: "https://kubernetes.io/docs/concepts/cluster-administration/node-autoscaling/",
    },
    {
      publisher: "Kubernetes autoscaler",
      title: "“Cluster Autoscaler FAQ”",
      url: "https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md",
    },
    {
      publisher: "Karpenter",
      title: "“Disruption”",
      url: "https://karpenter.sh/docs/concepts/disruption/",
    },
    { publisher: "Karpenter", title: "“FAQs”", url: "https://karpenter.sh/docs/faq/" },
    {
      publisher: "Karpenter",
      title: "“Migrating from Cluster Autoscaler”",
      url: "https://karpenter.sh/docs/getting-started/migrating-from-cas/",
    },
    {
      publisher: "AWS",
      title: "“Scale cluster compute with Karpenter and Cluster Autoscaler”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/autoscaling.html",
    },
    {
      publisher: "Amazon EKS Best Practices Guide",
      title: "“Karpenter”",
      url: "https://docs.aws.amazon.com/eks/latest/best-practices/karpenter.html",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Migrate from cluster autoscaler to node auto-provisioning”",
      url: "https://learn.microsoft.com/en-us/azure/aks/migrate-from-autoscaler-to-node-auto-provisioning",
    },
  ],
  related: [
    {
      title: "What is Karpenter? How it picks and removes nodes",
      where: "Learn",
      href: "/learn/what-is-karpenter",
    },
    {
      title: "Karpenter consolidation: policies, budgets and limits",
      where: "Learn",
      href: "/learn/karpenter-consolidation",
    },
    {
      title: "Cluster Autoscaler not scaling down: what keeps nodes running",
      where: "Learn",
      href: "/learn/cluster-autoscaler-not-scaling-down",
    },
    {
      title: "AKS node auto provisioning (NAP): what it is, how to enable",
      where: "Learn",
      href: "/learn/aks-node-auto-provisioning",
    },
    {
      title: "How does Coral interact with Cluster Autoscaler or Karpenter decisions?",
      where: "Coral FAQ",
      href: "/coral/faq#how-does-coral-interact-with-cluster",
    },
  ],
};
