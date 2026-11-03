import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/pod-affinity-vs-node-affinity/1";
import { figure as figure2 } from "@/features/learn/figures/pod-affinity-vs-node-affinity/2";
import { figure as figure3 } from "@/features/learn/figures/pod-affinity-vs-node-affinity/3";

export const article: Article = {
  slug: "pod-affinity-vs-node-affinity",
  title: "Kubernetes node affinity vs pod affinity",
  meta: "Kubernetes node affinity picks nodes by label. Pod affinity and anti-affinity read the pods already running. Hard vs soft rules, YAML and scale-down.",
  h1: "Kubernetes node affinity vs pod affinity",
  deck: "Each rule is a hard filter or a soft score, and hard rules can keep a node running.",
  card: "Node affinity reads node labels, pod affinity reads other pods. Hard and soft rules, and the nodes they hold.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Node lifecycle and scheduling",
  versus: ["Pod affinity", "Node affinity"],
  published: "2026-11-01",
  updated: "2026-11-03",
  author: "harsh",
  cover: "/learn-covers/zoorik-learn-pod-affinity-vs-node-affinity-1200x630.webp",
  coverAlt:
    "Pod affinity vs node affinity: pod affinity reads running pods, node affinity reads node labels",
  short:
    "Node affinity picks nodes by their own labels, such as a zone or a node pool. Pod affinity and pod anti-affinity read the pods already running in a topology domain, and place a pod near them or away from them.",
  sections: [
    {
      id: "the-difference-between-pod-affinity-and-node",
      title: "What each rule reads",
      blocks: [
        {
          kind: "p",
          text: "Take a web Deployment with 3 replicas that must stay in one Azure Kubernetes Service (AKS) node pool, with no two replicas on one node.",
        },
        {
          kind: "p",
          text: "Staying in the pool is node affinity: the rule reads the node’s own label. Keeping replicas apart is pod anti-affinity: the rule reads the pods already on each node. Made required, that second rule needs 3 nodes, whatever the replicas request.",
        },
        {
          kind: "p",
          text: [
            "Node affinity in Kubernetes sits in ",
            { code: ".spec.affinity.nodeAffinity" },
            " and reads node labels: a zone (",
            { code: "topology.kubernetes.io/zone" },
            "), a node pool label your cloud adds, or your own.",
          ],
        },
        {
          kind: "p",
          text: [
            "Inter-pod affinity sits in ",
            { code: ".spec.affinity.podAffinity" },
            " and ",
            { code: ".spec.affinity.podAntiAffinity" },
            ". It reads the labels of pods already running in a topology domain.",
          ],
        },
        {
          kind: "p",
          text: [
            { code: "topologyKey" },
            " sets the domain by naming a node label. With ",
            { code: "kubernetes.io/hostname" },
            ", each node is a domain. With ",
            { code: "topology.kubernetes.io/zone" },
            ", each zone is.",
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "h3",
          id: "required-rules-filter-nodes-preferred-rules-score",
          title: "Required vs preferred",
        },
        {
          kind: "p",
          text: "The scheduler places a pod in two passes. It filters out every node where the pod can’t run, then scores the rest and picks the highest.",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Required." },
              " A ",
              { code: "requiredDuringSchedulingIgnoredDuringExecution" },
              " rule is a filter. A node that breaks it is never a candidate.",
            ],
            [
              { b: "Preferred." },
              " A ",
              { code: "preferredDuringSchedulingIgnoredDuringExecution" },
              " rule carries a weight from 1 to 100. Each node that meets it gets the weight added to its score. For anti-affinity, the weight is subtracted from each node whose domain runs a matching pod. If no node meets the rule, the pod still lands on one that passes the filter.",
            ],
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            "No affinity rule moves a running pod. IgnoredDuringExecution means a rule is checked only when a pod is placed: on a rollout, a scale-up or a ",
            { a: "node drain", href: "/learn/kubernetes-drain-node-without-downtime" },
            ". The Karpenter docs note that Kubernetes never implemented any other variant.",
          ],
        },
      ],
    },
    {
      id: "node-affinity-vs-node-selector-exact-labels",
      title: "Node affinity",
      blocks: [
        {
          kind: "p",
          text: [
            "Use ",
            { code: "nodeSelector" },
            " when one exact label match says everything. It’s a map of labels, and Kubernetes schedules the pod only onto nodes that carry every one of them.",
          ],
        },
        { kind: "p", text: "Use node affinity when you need more:" },
        {
          kind: "ul",
          items: [
            [
              "operators: ",
              { code: "In" },
              ", ",
              { code: "NotIn" },
              ", ",
              { code: "Exists" },
              ", ",
              { code: "DoesNotExist" },
              ", ",
              { code: "Gt" },
              " and ",
              { code: "Lt" },
            ],
            [
              "OR across the terms in ",
              { code: "nodeSelectorTerms" },
              ", with AND inside one term",
            ],
            "preferred rules, which only change the score",
          ],
        },
        {
          kind: "p",
          text: "If a pod sets both nodeSelector and node affinity, a node has to satisfy both.",
        },
        {
          kind: "h3",
          id: "kubernetes-node-affinity-example-one-pool-one",
          title: "Node affinity example",
        },
        { kind: "p", text: "List your nodes’ labels first:" },
        { kind: "code", lang: "bash", code: "kubectl get nodes --show-labels" },
        {
          kind: "p",
          text: [
            "This ",
            { code: "nodeAffinity" },
            " keeps a pod in one AKS node pool and prefers one zone inside it:",
          ],
        },
        {
          kind: "code",
          lang: "yaml",
          code: "spec:\n  affinity:\n    nodeAffinity:\n      requiredDuringSchedulingIgnoredDuringExecution:\n        nodeSelectorTerms:\n        - matchExpressions:\n          - key: kubernetes.azure.com/agentpool\n            operator: In\n            values:\n            - <pool-name>\n      preferredDuringSchedulingIgnoredDuringExecution:\n      - weight: 50\n        preference:\n          matchExpressions:\n          - key: topology.kubernetes.io/zone\n            operator: In\n            values:\n            - <zone>",
        },
        {
          kind: "p",
          text: "The scheduler drops every node outside the pool, then adds 50 to the score of each remaining node in that zone.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: [
            { code: "kubernetes.azure.com/agentpool" },
            " is an AKS reserved label that holds the node pool’s name. On Amazon Elastic Kubernetes Service (EKS), managed node groups carry labels prefixed ",
            { code: "eks.amazonaws.com" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "One of them is ",
            { code: "eks.amazonaws.com/capacityType" },
            ", set to ",
            { code: "ON_DEMAND" },
            " or ",
            { code: "SPOT" },
            ". AWS suggests it for keeping stateful or fault-intolerant apps on On-Demand nodes, and fault-tolerant ones on Spot.",
          ],
        },
        { kind: "h3", id: "node-anti-affinity-and-taints", title: "Node anti-affinity and taints" },
        {
          kind: "p",
          text: [
            { code: "NotIn" },
            " and ",
            { code: "DoesNotExist" },
            " give you node anti-affinity: they keep a pod off nodes with a given label. ",
            { a: "Taints", href: "/learn/kubernetes-taints-and-tolerations" },
            " work from the node’s side: a tainted node repels pods that don’t tolerate the taint.",
          ],
        },
        {
          kind: "p",
          text: "A toleration lets a pod onto a tainted node but doesn’t send it there. So dedicating a pool to one workload takes both: the taint keeps other pods out, and node affinity keeps that workload in.",
        },
      ],
    },
    {
      id: "pod-affinity-and-anti-affinity-place-a",
      title: "Pod affinity and anti-affinity",
      blocks: [
        {
          kind: "p",
          text: [
            "Pod affinity pairs a label selector over pods with a ",
            { code: "topologyKey" },
            ". In the Kubernetes docs’ example, each web replica requires a node (",
            { code: "topologyKey: kubernetes.io/hostname" },
            ") that already runs a cache pod labelled ",
            { code: "app=store" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "Pod anti-affinity flips the test: the pod avoids domains that already run matching pods. Its common job is spreading a Deployment’s replicas, so one node failure can’t take them all.",
        },
        {
          kind: "p",
          text: "This preferred rule spreads replicas across nodes when it can, and lets two share a node when it must:",
        },
        {
          kind: "code",
          lang: "yaml",
          code: "# in the Deployment's pod template (spec.template.spec)\naffinity:\n  podAntiAffinity:\n    preferredDuringSchedulingIgnoredDuringExecution:\n    - weight: 100\n      podAffinityTerm:\n        labelSelector:\n          matchExpressions:\n          - key: app\n            operator: In\n            values:\n            - web\n        topologyKey: kubernetes.io/hostname",
        },
        {
          kind: "callout",
          label: "For engineers",
          text: [
            "The selector looks only in the pod’s own namespace unless you set ",
            { code: "namespaces" },
            " or ",
            { code: "namespaceSelector" },
            " (stable since Kubernetes 1.24). An empty ",
            { code: "namespaceSelector: {}" },
            " matches every namespace.",
          ],
        },
        {
          kind: "p",
          text: [
            { code: "matchLabelKeys" },
            ", stable since Kubernetes 1.33, adds the incoming pod’s own label values to the selector. With ",
            { code: "pod-template-hash" },
            ", it counts only pods from the same Deployment revision, so a rolling update doesn’t break the rule.",
          ],
        },
        {
          kind: "p",
          text: [
            "Only ",
            { code: "In" },
            ", ",
            { code: "NotIn" },
            ", ",
            { code: "Exists" },
            " and ",
            { code: "DoesNotExist" },
            " work here. ",
            { code: "Gt" },
            " and ",
            { code: "Lt" },
            " are for node affinity only, and ",
            { code: "topologyKey" },
            " can’t be empty. Pod anti-affinity also needs every node to carry the ",
            { code: "topologyKey" },
            " label.",
          ],
        },
        {
          kind: "p",
          text: "Inter-pod rules cost scheduling time. The Kubernetes docs say they “require substantial amounts of processing” and don’t recommend them in clusters larger than several hundred nodes. The Cluster Autoscaler FAQ adds that its latency targets hold only if no pod uses pod affinity or anti-affinity.",
        },
        {
          kind: "h3",
          id: "pod-anti-affinity-vs-node-affinity",
          title: "Pod anti-affinity vs node affinity",
        },
        {
          kind: "p",
          text: [
            "Node affinity asks what the node is. Pod anti-affinity asks what already runs there. “Not on Spot nodes” is node affinity with ",
            { code: "NotIn" },
            ". “Not beside another replica” is pod anti-affinity.",
          ],
        },
        {
          kind: "p",
          text: "When “what runs there” really means a kind of node, label those nodes and use node affinity. It stays true as pods come and go.",
        },
      ],
    },
    {
      id: "pod-affinity-vs-node-affinity",
      title: "Comparison table",
      blocks: [
        {
          kind: "table",
          columns: [
            { label: "", width: "14%" },
            { label: "nodeSelector", width: "14%" },
            { label: "Node affinity", width: "20%" },
            { label: "Pod affinity", width: "29%" },
            { label: "Pod anti-affinity", width: "23%" },
          ],
          rows: [
            [
              "Matches",
              "Node labels",
              "Node labels",
              "Labels of pods already in the domain",
              "Labels of pods already in the domain",
            ],
            [
              "Field",
              [{ code: "spec.nodeSelector" }],
              [{ code: "spec.affinity.nodeAffinity" }],
              [{ code: "spec.affinity.podAffinity" }],
              [{ code: "spec.affinity.podAntiAffinity" }],
            ],
            [
              "Judged per",
              "Node",
              "Node",
              ["Domain named by ", { code: "topologyKey" }, " (node, zone)"],
              ["Domain named by ", { code: "topologyKey" }, " (node, zone)"],
            ],
            [
              "Hard rule",
              "Always hard",
              [{ code: "required…" }],
              [{ code: "required…" }],
              [{ code: "required…" }],
            ],
            [
              "Soft rule",
              "None",
              [{ code: "preferred…" }, ", weight 1 to 100 added"],
              [{ code: "preferred…" }, ", weight 1 to 100 added"],
              [{ code: "preferred…" }, ", weight 1 to 100 subtracted"],
            ],
            [
              "Operators",
              "Exact match on every label",
              "In, NotIn, Exists, DoesNotExist, Gt, Lt",
              "In, NotIn, Exists, DoesNotExist",
              "In, NotIn, Exists, DoesNotExist",
            ],
            [
              "Large clusters",
              "No warning in the docs",
              "No warning in the docs",
              "Not recommended past several hundred nodes",
              "Not recommended past several hundred nodes",
            ],
            [
              "Typical use",
              "One fixed label",
              "Pool, zone, capacity type, hardware",
              "Keep chatty services together",
              "Spread replicas",
            ],
            [
              "How it can hold a node",
              "Pods can move only to labelled nodes",
              "Same, for required terms",
              "Pods can move only to where their partner runs",
              "Required hostname rule needs one node per replica",
            ],
          ],
        },
      ],
    },
    {
      id: "a-required-rule-can-keep-a-node",
      title: "Rules that block scale-down",
      blocks: [
        {
          kind: "p",
          text: "Draining a node evicts its pods. Their controllers create replacements, and the scheduler places each one under the same rules as before. A replacement with nowhere to go stays Pending.",
        },
        {
          kind: "p",
          text: "The Cluster Autoscaler checks for that before it removes a node. Its FAQ says it simulates the kube-scheduler: “if there’s no other node where a given pod can schedule, the pod’s node won’t be scaled down.”",
        },
        {
          kind: "h3",
          id: "required-anti-affinity-holds-one-node-per",
          title: "One node per replica",
        },
        {
          kind: "p",
          text: [
            "Required anti-affinity on ",
            { code: "kubernetes.io/hostname" },
            " is the plain case: a Deployment with 3 replicas runs one per node. Suppose they can run only in a 3-node pool. Every node in it could be close to idle, and still none could go.",
          ],
        },
        {
          kind: "p",
          text: "The FAQ names this pattern: pods that fit one per node on some subset of nodes “will always block CA from scaling down their nodes”.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "Try removing node-3 from that pool: its replica would need a node that runs no other replica. But node-1 and node-2 each run one, so 0 of the 2 nodes left pass the filter.",
        },
        {
          kind: "p",
          text: "The replacement would stay Pending, so the Cluster Autoscaler keeps node-3, and the same check keeps node-1 and node-2. The floor is the replica count: 4 replicas would need 4 nodes.",
        },
        { kind: "svg", figure: figure3 },
        {
          kind: "p",
          text: "The Kubernetes docs’ web-and-cache example locks the same way. Both tiers allow only one of their pods per node, and each web pod also needs a cache pod on its node. On the example’s three nodes, no pod of either tier can move.",
        },
        {
          kind: "h3",
          id: "other-required-rules-narrow-where-a-pod",
          title: "Other required rules",
        },
        {
          kind: "p",
          text: "These don’t pin a pod to one node, but each one narrows where it can go:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "One pool." },
              " Required node affinity to one pool means the pod can move only inside that pool. If the pool’s other nodes are full, its node stays.",
            ],
            [
              { b: "One per zone." },
              " Required anti-affinity on ",
              { code: "topology.kubernetes.io/zone" },
              " allows one matching pod per zone. So a fourth replica in a three-zone cluster stays Pending.",
            ],
            [
              { b: "Volumes." },
              " Topology-aware provisioners set node affinity on the PersistentVolumes they create. That ties the pods using a volume to nodes in its zone.",
            ],
          ],
        },
        {
          kind: "h3",
          id: "preferred-rules-depend-on-the-autoscaler",
          title: "Preferred rules and autoscalers",
        },
        {
          kind: "p",
          text: "The Cluster Autoscaler respects nodeSelector and required node affinity when it picks a node group to grow, if the groups are labelled to match. Preferred rules play no part in that choice.",
        },
        {
          kind: "p",
          text: "Karpenter starts by treating preferred affinities as required, and relaxes them one at a time only when they can’t be met. It also uses them to judge whether a pod can shift to another node. Its docs warn that preferred affinities “can result in more nodes being created than expected”.",
        },
      ],
    },
    {
      id: "choosing-the-rule-preferred-by-default-required",
      title: "Which rule to use",
      blocks: [
        {
          kind: "ul",
          items: [
            "If the pod needs something only some nodes have, such as a zone, a pool, a GPU or On-Demand capacity, use required node affinity. For one exact label, nodeSelector is enough.",
            "If the pod runs better on some nodes but fine on any, use preferred node affinity.",
            "If other pods must stay off a pool, taint the pool and give the toleration to the pods that belong there. Then add node affinity to those pods.",
            "If two services talk a lot, use preferred pod affinity on hostname or zone. Make it required only if the app can’t work across zones.",
            [
              "If replicas should sit apart, use preferred pod anti-affinity on hostname or a ",
              { a: "topology spread constraint", href: "/learn/topology-spread-constraints" },
              ". That page compares the two.",
            ],
            "If two replicas on one node would be unsafe, use required hostname anti-affinity. ZooKeeper, a quorum store, is the docs’ high-availability example. Count one node per replica, plus a spare so a drain has somewhere to put the evicted one.",
          ],
        },
        {
          kind: "p",
          text: [
            "Within the room these rules leave, requests decide how many nodes the pods fill. ",
            { a: "Kubernetes bin packing", href: "/learn/kubernetes-bin-packing" },
            " covers that half, and the ",
            { a: "Kubernetes cost optimization guide", href: "/kubernetes-cost-optimization" },
            " takes requests first, then nodes.",
          ],
        },
        {
          kind: "p",
          text: [
            {
              a: "Cluster Autoscaler not scaling down",
              href: "/learn/cluster-autoscaler-not-scaling-down",
            },
            " lists the other reasons a node stays.",
          ],
        },
      ],
    },
    {
      id: "how-coral-checks-affinity-before-it-drains",
      title: "How Coral handles affinity",
      blocks: [
        {
          kind: "p",
          text: [
            "When ",
            { a: "Coral", href: "/coral" },
            " consolidates nodes, its drain follows the same scheduling rules:",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "The check." },
              " Before it drains a node, Coral simulates the scheduler on the live cluster. Every pod must fit elsewhere, with its affinity, taints, spread, ports and zones. If one can’t, the node stays.",
            ],
            [
              { b: "The limits." },
              " It respects PodDisruptionBudgets and do-not-disrupt. Where only a pool’s minimum keeps an emptied node, Coral can reduce that minimum, with permission, and puts it back later. Every pool keeps at least one node.",
            ],
            [
              { b: "The drain." },
              " It cordons and drains one node at a time. If a drain can’t finish, the node goes back into service.",
            ],
          ],
        },
        {
          kind: "p",
          text: "Rebalancing requests to real use leaves more room on the nodes that stay, so more nodes can go. A required one-per-node rule still keeps its nodes: that floor comes from the rule, not from requests.",
        },
        {
          kind: "p",
          text: [
            "The ",
            { a: "Coral FAQ", href: "/coral-faq#how-do-you-make-sure-node" },
            " and the guide’s ",
            { a: "consolidation", href: "/coral-guide#consolidation" },
            " section have the detail.",
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
      title: "“Assigning Pods to Nodes”",
      url: "https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/",
    },
    {
      publisher: "Kubernetes",
      title: "“Taints and Tolerations”",
      url: "https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/",
    },
    {
      publisher: "Kubernetes",
      title: "“Pod”",
      url: "https://kubernetes.io/docs/reference/kubernetes-api/workload-resources/pod-v1/",
      note: " (API reference: NodeAffinity, WeightedPodAffinityTerm)",
    },
    {
      publisher: "Kubernetes",
      title: "“Well-Known Labels, Annotations and Taints”",
      url: "https://kubernetes.io/docs/reference/labels-annotations-taints/",
    },
    {
      publisher: "Kubernetes autoscaler",
      title: "“Cluster Autoscaler FAQ”",
      url: "https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md",
    },
    {
      publisher: "Karpenter",
      title: "“Scheduling”",
      url: "https://karpenter.sh/docs/concepts/scheduling/",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Use labels in an Azure Kubernetes Service (AKS) cluster”",
      url: "https://learn.microsoft.com/en-us/azure/aks/use-labels",
    },
    {
      publisher: "AWS",
      title: "“Simplify node lifecycle with managed node groups”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/managed-node-groups.html",
    },
  ],
  related: [
    {
      title: "Kubernetes topologySpreadConstraints",
      where: "Learn",
      href: "/learn/topology-spread-constraints",
    },
    {
      title: "Kubernetes taints and tolerations",
      where: "Learn",
      href: "/learn/kubernetes-taints-and-tolerations",
    },
    {
      title: "Cluster Autoscaler not scaling down",
      where: "Learn",
      href: "/learn/cluster-autoscaler-not-scaling-down",
    },
    {
      title: "How does Coral avoid scheduling failures?",
      where: "Coral FAQ",
      href: "/coral-faq#how-do-you-make-sure-node",
    },
  ],
};
