import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/karpenter-vs-cluster-autoscaler/1";
import { figure as figure2 } from "@/features/learn/figures/karpenter-vs-cluster-autoscaler/2";

export const article: Article = {
  slug: "karpenter-vs-cluster-autoscaler",
  title: "Karpenter vs Cluster Autoscaler on AWS and Azure",
  meta: "How Karpenter and the Cluster Autoscaler add and remove nodes, which autoscaler to run on AWS (EKS) or Azure (AKS), and whether to run both.",
  h1: "Karpenter vs Cluster Autoscaler",
  deck: "How each node autoscaler removes nodes, which to run on AWS or Azure, and whether to run both.",
  card: "How the Cluster Autoscaler and Karpenter remove nodes, and which to run on EKS or AKS.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes autoscaling",
  versus: ["Karpenter", "Cluster Autoscaler"],
  published: "2026-11-01",
  updated: "2026-11-03",
  author: "sushant",
  cover: "/learn-covers/zoorik-learn-karpenter-vs-cluster-autoscaler-1200x630.webp",
  coverAlt:
    "Karpenter vs Cluster Autoscaler: Karpenter swaps in a cheaper node, the Cluster Autoscaler keeps the same size",
  short:
    "The Cluster Autoscaler grows and shrinks node groups you set up in advance. It removes a node when its pods request under 50% of its CPU and memory. Karpenter launches individual machines to fit pending pods, and can swap a node for a cheaper one. On AWS, Karpenter suits spiky or varied workloads, and on Azure, node auto provisioning (NAP) runs it for you. Both count pod requests, not real use.",
  sections: [
    {
      id: "karpenter-vs-cluster-autoscaler",
      title: "Key differences",
      blocks: [
        {
          kind: "p",
          text: [
            "The Cluster Autoscaler adds and removes nodes in node groups set up in advance, which usually map to cloud groups of virtual machines (VMs). ",
            { a: "Karpenter", href: "/learn/what-is-karpenter" },
            " works with individual VMs. The Kubernetes docs say both should feel alike to a cluster user.",
          ],
        },
        {
          kind: "p",
          text: [
            "Kubernetes SIG Autoscaling sponsors both, and both run on Amazon Elastic Kubernetes Service (EKS) and Azure Kubernetes Service (AKS). AWS builds EKS Auto Mode on Karpenter, and Azure builds node auto provisioning (NAP) on it. Both sit below the pod autoscalers, which the guide to ",
            { a: "Kubernetes autoscaling", href: "/learn/kubernetes-autoscaling" },
            " compares.",
          ],
        },
        {
          kind: "table",
          columns: [
            { label: "What differs", width: "14%" },
            { label: "Cluster Autoscaler", width: "40%" },
            { label: "Karpenter", width: "46%" },
          ],
          rows: [
            [
              "What it changes",
              "The node count of groups you set up in advance: Auto Scaling groups on EKS, node pools on AKS",
              "Individual machines, within the rules of a NodePool you write",
            ],
            [
              "Machine types",
              "Fixed per group: every machine in a group is the same size",
              "Chosen per batch of pending pods from the types the NodePool allows. On AWS it passes up to 60 instance types to EC2 Fleet",
            ],
            [
              "Adding nodes",
              "When a pod is unschedulable. It checks every 10\u00a0seconds and picks a group with an expander (upstream default: the group left with the least idle CPU)",
              "When a pod is unschedulable. It batches pending pods and packs them by the CPU, memory and GPUs they request",
            ],
            [
              "Removing nodes",
              "When CPU and memory requests are both under 50% of allocatable, every pod can move, and the node has been unneeded for 10\u00a0minutes",
              [
                "When its pods fit on other nodes (delete), or on those plus one cheaper node (replace). No wait by default (",
                { code: "consolidateAfter: 0s" },
                ")",
              ],
            ],
            ["Cheaper machine swap", "No", "Yes, the replace action"],
            [
              "Pace of removal",
              "One non-empty node at a time. Empty nodes up to 10 at once",
              "A disruption budget per NodePool: 10% of its nodes by default",
            ],
            [
              "Node lifecycle",
              "Node count only",
              [
                "Also replaces nodes that drift from their NodePool, drains nodes past ",
                { code: "expireAfter" },
                " (720h by default), and repairs unhealthy nodes (alpha, off by default)",
              ],
            ],
            [
              "Kubernetes versions",
              "More tightly coupled, per AWS’s best practices",
              "Less tightly coupled. A compatibility matrix lists the supported versions per release",
            ],
            [
              "On EKS",
              "You run it against Auto Scaling groups",
              "You install and run it, or use EKS Auto Mode, which builds on it",
            ],
            ["On AKS", "Built in: you switch it on per node pool", "NAP runs it for you"],
          ],
        },
      ],
    },
    {
      id: "which-autoscaler-to-choose-on-eks-and",
      title: "Which to choose",
      blocks: [
        {
          kind: "h3",
          id: "eks-karpenter-vs-cluster-autoscaler",
          title: "AWS autoscalers on EKS",
        },
        { kind: "p", text: "AWS documents three ways to scale EKS nodes:" },
        {
          kind: "ul",
          items: [
            [{ b: "EKS Auto Mode," }, " which AWS says “builds upon Karpenter.”"],
            [
              { b: "Karpenter" },
              " itself, open-source software you install and manage. AWS gives technical support when it runs unmodified at a compatible version, but no Service Level Agreement (SLA).",
            ],
            [{ b: "The Cluster Autoscaler," }, " which works through Auto Scaling groups."],
          ],
        },
        {
          kind: "callout",
          label: "Rule of thumb",
          text: "AWS’s best practices say Karpenter suits clusters “with workloads that encounter periods of high, spiky demand or have diverse compute requirements”. Managed node groups and Auto Scaling groups suit workloads “that tend to be more static and consistent”.",
        },
        {
          kind: "p",
          text: "The same guide says to consider other autoscalers if you need a feature Karpenter lacks.",
        },
        {
          kind: "p",
          text: "Karpenter also handles Spot capacity. With an Amazon Simple Queue Service (SQS) interruption queue, it starts a new node when a Spot instance gets its 2-minute interruption notice. Pods can then move before the instance is reclaimed.",
        },
        {
          kind: "h3",
          id: "karpenter-vs-aks-autoscaler-nap-or-the",
          title: "Azure autoscalers on AKS",
        },
        {
          kind: "p",
          text: [
            "On AKS, the cluster autoscaler is built in. You switch it on per node pool and tune it with ",
            { code: "az aks update --cluster-autoscaler-profile" },
            ". Microsoft lists the same defaults as upstream: a 0.5 utilization threshold, a 10-minute unneeded time and a 10-second scan interval.",
          ],
        },
        {
          kind: "p",
          text: "NAP is Microsoft’s managed Karpenter. You write NodePool and AKSNodeClass resources, and NAP picks VM sizes from pending pods’ requests.",
        },
        {
          kind: "p",
          text: [
            "Microsoft’s comparison sets the cluster autoscaler’s “Preexisting node pools with single VM size per pool” against NAP’s “Dynamic provisioning of mixed VM sizes”. It adds that the cluster autoscaler “is maintained, with minimal feature enhancements”. ",
            { a: "AKS node auto provisioning", href: "/learn/aks-node-auto-provisioning" },
            " covers enabling it.",
          ],
        },
      ],
    },
    {
      id: "two-underused-nodes-what-each-autoscaler-leaves",
      title: "A worked example",
      blocks: [
        {
          kind: "p",
          text: "Take a node group of two on-demand nodes, minimum size 1. Each has 8\u00a0CPU allocatable, the share of its capacity offered to pods. Pods request 1.5\u00a0CPU per node, and memory and DaemonSet requests are small.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "Each node starts at 1.5 ÷ 8, about 19% of its CPU requested. Both sit under the Cluster Autoscaler’s 50% threshold, and either node’s pods fit on the other.",
        },
        {
          kind: "p",
          text: "Once one node has been unneeded for 10\u00a0minutes, the Cluster Autoscaler evicts its pods onto the other. The survivor holds 1.5 + 1.5 = 3\u00a0CPU of requests, 37.5% of 8. It stays, because its pods have nowhere else to go.",
        },
        {
          kind: "p",
          text: "Karpenter, on its default policy, can delete one node the same way. It can then replace the survivor with one cheaper node that still fits its pods, such as 4\u00a0CPU, if the NodePool allows that type. Its default budget, 10% of 2 nodes rounded up to 1, lets it disrupt one node at a time.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: [
            "The ",
            { a: "EKS and AKS pricing calculator", href: "/eks-and-aks-pricing-calculator" },
            " prices an 8-CPU and a 4-CPU node per month, so you can see what the swap is worth.",
          ],
        },
        {
          kind: "p",
          text: "Both autoscalers counted requests. The Kubernetes docs say consolidation “only considers Pod resource requests and not real resource usage when making decisions”.",
        },
        {
          kind: "p",
          text: [
            "If those pods use 0.3\u00a0CPU per node, neither autoscaler sees the gap. Requests set from measured use change the result, as ",
            { a: "Kubernetes pod right sizing", href: "/learn/kubernetes-pod-right-sizing" },
            " and ",
            { a: "the requests Karpenter can’t fix", href: "/learn/karpenter-cost-optimization" },
            " explain.",
          ],
        },
      ],
    },
    {
      id: "the-cluster-autoscaler-removes-whole-nodes-and",
      title: "Cluster Autoscaler scale-down",
      blocks: [
        {
          kind: "p",
          text: "Every 10\u00a0seconds, when no scale-up is needed, the Cluster Autoscaler looks for unneeded nodes. A node is unneeded only when all three hold:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Requests under half." },
              " Its pods’ CPU requests and memory requests each add up to under 50% of its allocatable. The flag is ",
              { code: "--scale-down-utilization-threshold" },
              ", 0.5 by default.",
            ],
            [
              { b: "Pods that can move." },
              " Every pod apart from DaemonSet and mirror pods can move to another node.",
            ],
            [{ b: "No opt-out." }, " The node doesn’t carry the scale-down-disabled annotation."],
          ],
        },
        {
          kind: "p",
          text: "A node unneeded for 10\u00a0minutes is removed. The autoscaler taints it so pods aren’t scheduled back, and evicts its pods through the eviction API, which respects PodDisruptionBudgets (PDBs).",
        },
        {
          kind: "p",
          text: "Non-empty nodes go one at a time, and empty ones up to 10 at once. Scale-down stops at the node group’s minimum size, and waits 10\u00a0minutes after any scale-up.",
        },
        {
          kind: "p",
          text: [
            "It never resizes a node. Its FAQ assumes that inside a group “all machines have identical capacity”, so oversized nodes can only go whole. Moving to smaller machines is a change you make yourself, usually a new group and a drain. The steps are covered for ",
            { a: "EKS node groups", href: "/learn/change-eks-node-group-instance-type" },
            " and ",
            { a: "AKS node pools", href: "/learn/change-aks-node-pool-vm-size" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            {
              a: "Cluster Autoscaler not scaling down",
              href: "/learn/cluster-autoscaler-not-scaling-down",
            },
            " lists the reasons an expected removal doesn’t happen.",
          ],
        },
      ],
    },
    {
      id: "karpenter-deletes-or-replaces-nodes-with-no",
      title: "Karpenter consolidation",
      blocks: [
        {
          kind: "p",
          text: "Karpenter calls node removal disruption. Consolidation is its disruption method aimed at cost, with two actions:",
        },
        {
          kind: "ul",
          items: [
            [{ b: "Delete," }, " when all of a node’s pods fit on free capacity of other nodes."],
            [{ b: "Replace," }, " when they fit on that free capacity plus one cheaper node."],
          ],
        },
        { kind: "p", text: "Karpenter looks for candidates in this order:" },
        {
          kind: "ol",
          items: [
            "Empty nodes, deleted in parallel.",
            "Two or more nodes at once.",
            "Each node on its own.",
          ],
        },
        {
          kind: "h3",
          id: "which-nodes-count-and-how-fast-they",
          title: "Policy and pace",
        },
        {
          kind: "p",
          text: [
            { code: "consolidationPolicy" },
            " decides which nodes count. Microsoft’s migration guide maps the Cluster Autoscaler’s utilization threshold to it.",
          ],
        },
        {
          kind: "p",
          text: [
            "The default, ",
            { code: "WhenEmptyOrUnderutilized" },
            ", considers any node that can be removed or replaced to reduce cost. ",
            { code: "WhenEmpty" },
            " considers only nodes left with pods that have no disruption cost, such as DaemonSet pods. ",
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
            " is how long a node must go without pods arriving or leaving before it becomes a candidate, ",
            { code: "0s" },
            " by default. A disruption budget caps how many of a NodePool’s nodes go at once: ",
            { code: "nodes: 10%" },
            ", rounded up, when you set none.",
          ],
        },
        {
          kind: "p",
          text: [
            "Each removal taints the node ",
            { code: "karpenter.sh/disrupted:NoSchedule" },
            " and starts any replacement. Once that’s ready, Karpenter drains the node through the eviction API, which respects PDBs.",
          ],
        },
        { kind: "h3", id: "drift-and-expiry", title: "Drift and expiry" },
        {
          kind: "p",
          text: "In the Kubernetes docs’ words, Karpenter “handles all aspects of node lifecycle, not just autoscaling”. It replaces nodes that drift from a changed NodePool or node class.",
        },
        {
          kind: "p",
          text: [
            "It also drains nodes older than ",
            { code: "expireAfter" },
            ", 720\u00a0hours (30\u00a0days) by default. Disruption budgets don’t hold expiry back.",
          ],
        },
      ],
    },
    {
      id: "can-karpenter-and-cluster-autoscaler-work-together",
      title: "Running both at once",
      blocks: [
        {
          kind: "p",
          text: "Karpenter’s FAQ says it “can work alongside Cluster Autoscaler”, and its NodePools are designed to sit beside static capacity such as EKS managed node groups. The catch is that both react to a pod “the Kubernetes scheduler has marked as unschedulable.” So each workload must land on only one autoscaler’s nodes.",
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "Microsoft warns that the AKS cluster autoscaler and NAP both “react to pending pod pressure, and can lead to double provisioning of nodes”. Its fix is a taint on each side, and a toleration that sends each workload to one of them.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: [
            "Running both on AKS needs the ",
            { code: "AllowClusterAutoscalerAndNAP" },
            " feature flag. Microsoft treats the pairing as a migration step, and warns that keeping it indefinitely can make scaling unpredictable.",
          ],
        },
        {
          kind: "h3",
          id: "how-to-migrate-from-cluster-autoscaler-to",
          title: "Migrating to Karpenter on EKS",
        },
        {
          kind: "p",
          text: "Karpenter’s migration guide ends the overlap once Karpenter is running:",
        },
        {
          kind: "ol",
          items: [
            [
              { b: "Stop the Cluster Autoscaler." },
              " Scaling it to zero replicas stops all of its scaling, so do it only after Karpenter works.",
            ],
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl scale deploy/cluster-autoscaler -n kube-system --replicas=0",
        },
        {
          kind: "ol",
          start: 2,
          items: [
            [
              { b: "Shrink the old node group" },
              " to a fixed size for Karpenter and critical add-ons such as CoreDNS: 2 instances for one group across Availability Zones. The shrink drains the extra nodes. Without PDBs, the guide warns, workloads will be unavailable.",
            ],
            [
              { b: "Keep that group." },
              " AWS’s best practices say to run Karpenter’s controller on a node group or EKS Fargate, never on a node Karpenter manages.",
            ],
          ],
        },
      ],
    },
    {
      id: "how-coral-works-with-either-autoscaler",
      title: "Coral with either autoscaler",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " runs beside whichever node autoscaler you have. It never adds nodes for demand, so scale-up stays with Karpenter, NAP or the Cluster Autoscaler.",
          ],
        },
        {
          kind: "p",
          text: "Coral rebalances CPU and memory requests to real use without any downtime, so the same autoscaler can run fewer or smaller nodes. What it does with the nodes depends on the autoscaler:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "With the Cluster Autoscaler:" },
              " Coral checks on the live cluster that every pod on a spare node fits on another node. It drains one node at a time and hands each empty node to the Cluster Autoscaler, whose own timers decide when it goes. It never changes a node’s size.",
            ],
            [
              { b: "With Karpenter or NAP:" },
              " Coral leaves the pools they consolidate to them. It can also rebalance the nodes you choose onto cheaper machines. After you compare current and rebalanced cost, it adds fixed-size NodePools. Your autoscaler launches the new machines, and the old nodes are drained and removed one by one.",
            ],
            [
              { b: "With no node autoscaler:" },
              " connecting the cluster sets up NAP on AKS (which needs Azure CNI) or Karpenter on EKS, with your approval.",
            ],
          ],
        },
        {
          kind: "p",
          text: "Coral moves each pod by warm handover, by live migration where both nodes support it, or by eviction within its PDB.",
        },
        {
          kind: "p",
          text: [
            "Each pairing has its own page: ",
            { a: "Cluster Autoscaler", href: "/coral-works-with-cluster-autoscaler" },
            ", ",
            { a: "Karpenter", href: "/coral-works-with-karpenter" },
            " and ",
            { a: "NAP", href: "/coral-works-with-aks-node-auto-provisioning" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "On ",
            { a: "our own AKS development cluster", href: "/coral-value-lab" },
            ", node optimization removed a spare 4-CPU worker, $147.46 a month. Rebalancing then swapped the other worker for a cheaper one of the same size, $66.43 a month less.",
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
    {
      publisher: "Microsoft Learn",
      title:
        "“Understand Networking Configurations for Node Auto-Provisioning (NAP) in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/node-auto-provisioning-networking",
    },
  ],
  related: [
    {
      title: "What is Karpenter in Kubernetes?",
      where: "Learn",
      href: "/learn/what-is-karpenter",
    },
    {
      title: "Karpenter consolidation",
      where: "Learn",
      href: "/learn/karpenter-consolidation",
    },
    {
      title: "Cluster Autoscaler not scaling down",
      where: "Learn",
      href: "/learn/cluster-autoscaler-not-scaling-down",
    },
    {
      title: "AKS node auto provisioning (NAP)",
      where: "Learn",
      href: "/learn/aks-node-auto-provisioning",
    },
    {
      title: "Kubernetes autoscaling",
      where: "Learn",
      href: "/learn/kubernetes-autoscaling",
    },
  ],
  relatedTitle: "More on node autoscalers",
};
