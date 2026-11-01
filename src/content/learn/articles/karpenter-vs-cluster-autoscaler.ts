import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/karpenter-vs-cluster-autoscaler/1";
import { figure as figure2 } from "@/features/learn/figures/karpenter-vs-cluster-autoscaler/2";

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
  published: "2026-11-01",
  updated: "2026-11-01",
  author: "sushant",
  cover: "/learn-covers/zoorik-learn-karpenter-vs-cluster-autoscaler-1200x630.webp",
  coverAlt:
    "Karpenter vs Cluster Autoscaler: Karpenter swaps in a cheaper node, the Cluster Autoscaler keeps the same size",
  short:
    "In Karpenter vs Cluster Autoscaler, the Cluster Autoscaler only grows or shrinks preset node groups, while Karpenter picks machines and swaps nodes for cheaper ones. Both count pod requests, not real use, and can share a cluster if taints keep each workload on one autoscaler’s nodes.",
  sections: [
    {
      id: "two-underused-nodes-what-each-autoscaler-leaves",
      title: "Two underused nodes: what each autoscaler leaves you",
      blocks: [
        {
          kind: "p",
          text: "Picture a node group of two on-demand nodes, minimum size 1. Each has 8\u00a0CPU allocatable, the share of its capacity offered to pods. Their pods request 1.5\u00a0CPU per node, and memory and DaemonSet requests are small.",
        },
        {
          kind: "p",
          text: "The Cluster Autoscaler ends with one 8-CPU machine holding 3\u00a0CPU of requests. Karpenter can end with one cheaper machine, such as 4\u00a0CPU. Its NodePool, the rules you write for what it may launch, must allow that type.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "Each node starts at 1.5 ÷ 8, about 19% of its CPU requested. Both sit under the Cluster Autoscaler’s 50% threshold, and either node’s pods fit on the other.",
        },
        {
          kind: "p",
          text: "Once one node has been unneeded for 10\u00a0minutes, the Cluster Autoscaler evicts its pods onto the other node. The survivor then holds 1.5 + 1.5 = 3\u00a0CPU of requests, and 3 ÷ 8 = 37.5%.",
        },
        {
          kind: "p",
          text: "That’s still under the threshold, but its pods have nowhere else to go. It stays.",
        },
        {
          kind: "p",
          text: "Karpenter, on its default policy, can delete one node for the same reason. Then it can replace the survivor with one cheaper node that still fits its pods and DaemonSets. Its default budget, 2 × 10% = 0.2\u00a0nodes rounded up to 1, lets it disrupt one node at a time.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: [
            "To see what that swap is worth, the ",
            { a: "EKS and AKS pricing calculator", href: "/eks-and-aks-pricing-calculator" },
            " prices an 8-CPU and a 4-CPU node per month.",
          ],
        },
        {
          kind: "p",
          text: "In the worked example, both autoscalers counted requests. The Kubernetes docs say consolidation “only considers Pod resource requests and not real resource usage when making decisions”.",
        },
        {
          kind: "p",
          text: [
            "If those pods use 0.3\u00a0CPU per node, neither autoscaler sees the gap. You keep paying for room no process uses. Requests set from measured use change the result, as ",
            { a: "Kubernetes pod right sizing", href: "/learn/kubernetes-pod-right-sizing" },
            " and ",
            { a: "the requests Karpenter can’t fix", href: "/learn/karpenter-cost-optimization" },
            " explain.",
          ],
        },
      ],
    },
    {
      id: "karpenter-vs-cluster-autoscaler",
      title: "Karpenter vs Cluster Autoscaler: node groups or individual machines",
      blocks: [
        {
          kind: "p",
          text: [
            "The Cluster Autoscaler “adds or removes Nodes to pre-configured Node groups”. These usually map to a cloud group of virtual machines (VMs). ",
            { a: "Karpenter", href: "/learn/what-is-karpenter" },
            " works with individual VMs and doesn’t rely on those groups.",
          ],
        },
        {
          kind: "p",
          text: "To a cluster user, the Kubernetes docs say, the two should feel alike. Each adds nodes for pods that can’t be scheduled. Each also consolidates nodes that are “no longer optimally utilized.”",
        },
        {
          kind: "p",
          text: "Kubernetes SIG Autoscaling sponsors both node autoscalers. So Karpenter vs Kubernetes Cluster Autoscaler is a choice between two Kubernetes projects.",
        },
        {
          kind: "p",
          text: "The Cluster Autoscaler’s cloud integrations are part of the Kubernetes project. Karpenter is a library that cloud providers such as AWS and Azure build their autoscalers on.",
        },
        {
          kind: "p",
          text: [
            "The two sit one layer below the pod autoscalers, which ",
            {
              a: "HPA vs VPA vs Cluster Autoscaler",
              href: "/learn/hpa-vs-vpa-vs-cluster-autoscaler",
            },
            " compares. Both run on Amazon Elastic Kubernetes Service (EKS) and Azure Kubernetes Service (AKS).",
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
              "Node auto provisioning (NAP), which runs Karpenter for you",
            ],
          ],
        },
      ],
    },
    {
      id: "the-cluster-autoscaler-removes-whole-nodes-and",
      title: "The Cluster Autoscaler removes whole nodes and never resizes them",
      blocks: [
        {
          kind: "p",
          text: "The Cluster Autoscaler’s FAQ assumes that inside a node group “all machines have identical capacity”. So when nodes are too big for their pods, it can only remove whole ones.",
        },
        {
          kind: "p",
          text: [
            "Moving to smaller machines is a change you make yourself, usually a new group and a drain. It’s covered for ",
            { a: "EKS node groups", href: "/learn/change-eks-node-group-instance-type" },
            " and ",
            { a: "AKS node pools", href: "/learn/change-aks-node-pool-vm-size" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "Every 10\u00a0seconds, when no scale-up is needed, it checks for unneeded nodes. A node counts as unneeded only when all three hold:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Requests under half." },
              " The CPU requests and the memory requests of the node’s pods each add up to less than 50% of its allocatable. The flag is ",
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
          text: "A node that stays unneeded for 10\u00a0minutes is terminated. To empty it, the autoscaler evicts its pods through the eviction API, which honours PodDisruptionBudgets (PDBs). It also taints the node so the pods aren’t scheduled back onto it.",
        },
        {
          kind: "p",
          text: "Non-empty nodes go one at a time, and empty ones in bulk, up to 10 at once. Scale-down also stops at the node group’s minimum size. After any scale-up, the autoscaler waits 10\u00a0minutes before it looks at scale-down again.",
        },
        {
          kind: "p",
          text: [
            "If a node stays that you expected to go, ",
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
      id: "karpenter-deletes-or-replaces-nodes-with-no",
      title: "Karpenter deletes or replaces nodes, with no threshold to tune",
      blocks: [
        {
          kind: "p",
          text: "Karpenter calls node removal disruption, and consolidation is the method aimed at cost. It has two actions:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Delete," },
              " when all of a node’s pods can run on free capacity of other nodes.",
            ],
            [{ b: "Replace," }, " when they fit on that free capacity plus a single cheaper node."],
          ],
        },
        { kind: "p", text: "Karpenter looks for candidates in a set order:" },
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
          title: "Which nodes count, and how fast they go",
        },
        {
          kind: "p",
          text: [
            "Microsoft’s migration guide maps the Cluster Autoscaler’s utilization threshold to ",
            { code: "consolidationPolicy" },
            ". That field decides which nodes count.",
          ],
        },
        {
          kind: "p",
          text: [
            "The default, ",
            { code: "WhenEmptyOrUnderutilized" },
            ", considers any node that can be removed or replaced to reduce cost. ",
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
            "Two fields set the pace. The first, ",
            { code: "consolidateAfter" },
            ", is how long a node must go without pods arriving or leaving before it becomes a candidate. Its default is ",
            { code: "0s" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "The second, a disruption budget, caps how many of a NodePool’s nodes can be disrupted at once. When you set none, Karpenter uses ",
            { code: "nodes: 10%" },
            ", rounded up.",
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
            ", which defaults to 720\u00a0hours (30\u00a0days). Disruption budgets don’t hold expiry back.",
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
          text: "Yes, if each workload can land on only one autoscaler’s nodes. Karpenter’s FAQ says it “can work alongside Cluster Autoscaler”. Its NodePools are designed to sit beside static capacity such as EKS managed node groups.",
        },
        {
          kind: "p",
          text: "The catch is that the two share one trigger: a pod “the Kubernetes scheduler has marked as unschedulable.”",
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "Microsoft warns that the AKS cluster autoscaler and node auto provisioning (NAP) both “react to pending pod pressure, and can lead to double provisioning of nodes”. Its migration guide’s fix is mutually exclusive scheduling, with a taint on each side and a toleration that sends each workload to one of them.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: [
            "Running both on AKS also needs the ",
            { code: "AllowClusterAutoscalerAndNAP" },
            " feature flag. Microsoft treats the pairing as a migration step. It warns that keeping it indefinitely can make scaling unpredictable.",
          ],
        },
        {
          kind: "h3",
          id: "how-to-migrate-from-cluster-autoscaler-to",
          title: "How to migrate from Cluster Autoscaler to Karpenter on EKS",
        },
        {
          kind: "p",
          text: "On EKS, Karpenter’s migration guide ends the overlap once Karpenter is running:",
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
              " to a fixed size for Karpenter and critical add-ons such as CoreDNS: 2 instances for one group spread across Availability Zones. That shrink drains the extra nodes. Without PDBs, the guide warns, workloads will be unavailable.",
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
      id: "which-autoscaler-to-choose-on-eks-and",
      title: "Which autoscaler to choose on EKS and AKS",
      blocks: [
        {
          kind: "h3",
          id: "eks-karpenter-vs-cluster-autoscaler",
          title: "EKS Karpenter vs Cluster Autoscaler",
        },
        { kind: "p", text: "On EKS, AWS documents three routes:" },
        {
          kind: "ul",
          items: [
            [
              { b: "EKS Auto Mode" },
              " creates a node when a pod can’t fit, consolidates workloads and deletes nodes. AWS says it “builds upon Karpenter.”",
            ],
            [
              { b: "Karpenter" },
              " itself is open-source software you install and manage. It gets AWS technical support when it runs unmodified at a compatible version, and has no AWS Service Level Agreement.",
            ],
            [
              {
                b: [
                  "The ",
                  { a: "Cluster Autoscaler", href: "/coral-works-with-cluster-autoscaler" },
                ],
              },
              " works through Auto Scaling groups.",
            ],
          ],
        },
        {
          kind: "callout",
          label: "Rule of thumb",
          text: "For the AWS EKS Cluster Autoscaler vs Karpenter decision, follow AWS’s best practices guide. It says Karpenter suits clusters “with workloads that encounter periods of high, spiky demand or have diverse compute requirements”.",
        },
        {
          kind: "p",
          text: "The same guide says managed node groups and Auto Scaling groups suit workloads “that tend to be more static and consistent”. It also says to consider other autoscalers if you need a feature Karpenter lacks.",
        },
        {
          kind: "p",
          text: "Karpenter can also mix Spot and on-demand capacity. With an Amazon Simple Queue Service (SQS) interruption queue, it starts a new node when a Spot instance gets its 2-minute interruption notice. Pods can then move before the instance is reclaimed.",
        },
        {
          kind: "h3",
          id: "karpenter-vs-aks-autoscaler-nap-or-the",
          title: "Karpenter vs AKS autoscaler: NAP or the cluster autoscaler",
        },
        {
          kind: "p",
          text: [
            "On AKS, the cluster autoscaler is built in. You switch it on per node pool. You tune it through the cluster’s autoscaler profile with ",
            { code: "az aks update --cluster-autoscaler-profile" },
            ".",
          ],
        },
        { kind: "p", text: "Microsoft lists the same defaults as upstream:" },
        {
          kind: "ul",
          items: [
            "A 0.5 utilization threshold.",
            "A 10-minute unneeded time.",
            "A 10-second scan interval.",
          ],
        },
        {
          kind: "p",
          text: "NAP is Microsoft’s managed Karpenter on AKS: it deploys and manages Karpenter for you. You write NodePool and AKSNodeClass resources instead of configuring AKS node pools through the CLI. NAP chooses VM sizes from pending pods’ requests.",
        },
        {
          kind: "p",
          text: [
            "Microsoft’s comparison sets the cluster autoscaler’s “Preexisting node pools with single VM size per pool” against NAP’s “Dynamic provisioning of mixed VM sizes”. It also says the cluster autoscaler “is maintained, with minimal feature enhancements”. ",
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
            " optimizes Kubernetes on AKS and EKS beside whichever node autoscaler you run. It never adds nodes for demand, so scale-up stays with Karpenter, NAP or the Cluster Autoscaler.",
          ],
        },
        {
          kind: "p",
          text: "By rebalancing CPU and memory requests to measured use, Coral lets the same autoscaler run fewer or smaller nodes. What it does with the nodes depends on the autoscaler:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "With the Cluster Autoscaler:" },
              " Coral checks on the live cluster that every pod on a node fits on another Ready node. Then it cordons and drains one node at a time. It hands each empty node to your Cluster Autoscaler, whose own timers decide when it goes. Coral empties nodes but never changes their size.",
            ],
            [
              { b: "With Karpenter or NAP:" },
              " Coral leaves the pools they already consolidate to them. It can also rebalance the nodes you choose onto cheaper machines that still fit the work. After you compare current and rebalanced cost, Coral creates fixed-size NodePools. Your autoscaler then launches the new machines, and the old nodes are drained and removed one by one.",
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
            {
              a: "Coral works with Cluster Autoscaler",
              href: "/coral-works-with-cluster-autoscaler",
            },
            " and ",
            { a: "Coral works with Karpenter", href: "/coral-works-with-karpenter" },
            " cover each pairing.",
          ],
        },
        {
          kind: "p",
          text: [
            "On ",
            { a: "our own AKS development cluster", href: "/coral-value-lab" },
            ", node optimization removed a spare 4-CPU worker, $147.46 a month. Rebalancing then swapped the remaining worker for a cheaper machine of the same size, $66.43 a month less.",
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
      title: "Kubernetes autoscaling: HPA and Cluster Autoscaler",
      where: "Learn",
      href: "/learn/hpa-vs-vpa-vs-cluster-autoscaler",
    },
  ],
};
