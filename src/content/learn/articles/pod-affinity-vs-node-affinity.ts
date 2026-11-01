import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/pod-affinity-vs-node-affinity/1";
import { figure as figure2 } from "@/features/learn/figures/pod-affinity-vs-node-affinity/2";
import { figure as figure3 } from "@/features/learn/figures/pod-affinity-vs-node-affinity/3";

export const article: Article = {
  slug: "pod-affinity-vs-node-affinity",
  title: "Pod affinity vs node affinity: what each decides",
  meta: "Pod affinity vs node affinity: node affinity reads node labels, pod affinity and anti-affinity read running pods. Hard vs soft rules, and how they hold nodes.",
  h1: "Pod affinity vs node affinity: what each rule decides",
  deck: "What each rule matches, when it’s hard or soft, and how a strict rule keeps a node, and its cost, in the cluster.",
  card: "Node affinity reads node labels, pod affinity reads other pods. Hard and soft rules, and the nodes they hold.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Node lifecycle and scheduling",
  versus: ["Pod affinity", "Node affinity"],
  published: "2026-11-01",
  updated: "2026-11-01",
  author: "harsh",
  cover: "/learn-covers/zoorik-learn-pod-affinity-vs-node-affinity-1200x630.webp",
  coverAlt:
    "Pod affinity vs node affinity: pod affinity reads running pods, node affinity reads node labels",
  short:
    "Pod affinity vs node affinity comes down to what each rule reads: the node’s own labels, or the pods running in a topology domain. Node affinity picks nodes by label, and pod affinity and anti-affinity place a pod near other pods or away from them.",
  sections: [
    {
      id: "the-difference-between-pod-affinity-and-node",
      title: "The difference between pod affinity and node affinity is what the rule reads",
      blocks: [
        {
          kind: "p",
          text: "Picture a web Deployment with 3\u00a0replicas that must stay in one node pool on Azure Kubernetes Service (AKS). No two replicas may share a node.",
        },
        {
          kind: "p",
          text: "Staying in the pool depends only on the node’s own label, so it’s node affinity. Keeping replicas apart depends on which pods already run on each node, so it’s pod anti-affinity. Make that rule required, and the pool needs 3\u00a0nodes whatever the replicas request.",
        },
        {
          kind: "p",
          text: [
            "Node affinity sits in ",
            { code: ".spec.affinity.nodeAffinity" },
            " and reads the node’s own labels. Those can be ",
            { code: "topology.kubernetes.io/zone" },
            ", a node pool label your cloud adds, or one you add yourself.",
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
            "The domain is set by ",
            { code: "topologyKey" },
            ", which names a node label: with ",
            { code: "kubernetes.io/hostname" },
            " each node is its own domain. With ",
            { code: "topology.kubernetes.io/zone" },
            ", each zone is one domain.",
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "h3",
          id: "required-rules-filter-nodes-preferred-rules-score",
          title: "Required rules filter nodes, preferred rules score them",
        },
        {
          kind: "p",
          text: "Scheduling a pod takes two passes. First the scheduler filters out every node where the pod can’t run. Then it scores the nodes that are left and picks the highest.",
        },
        { kind: "p", text: "Each kind of affinity comes in two strengths, one for each pass:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Required." },
              " A ",
              { code: "requiredDuringSchedulingIgnoredDuringExecution" },
              " rule is a hard filter. A node that breaks it is never a candidate.",
            ],
            [
              { b: "Preferred." },
              " A ",
              { code: "preferredDuringSchedulingIgnoredDuringExecution" },
              " rule carries a weight from 1 to 100, which is added to the score of every node that meets it. For anti-affinity, the weight is subtracted from every node whose domain already runs a matching pod. When no node meets a preferred rule, the pod still lands on one that passes the filters.",
            ],
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "No affinity rule moves a running pod. Change a node’s labels, and its pods stay where they are.",
        },
        {
          kind: "p",
          text: [
            "Rules are checked only when a pod is scheduled, which is what IgnoredDuringExecution in each name means. The Karpenter docs note that Kubernetes never implemented any other variant. A rule applies again, in full, only when a pod is placed: on a rollout, a scale-up or a ",
            { a: "node drain", href: "/learn/kubernetes-drain-node-without-downtime" },
            ".",
          ],
        },
      ],
    },
    {
      id: "node-affinity-vs-node-selector-exact-labels",
      title: "Node affinity vs node selector: exact labels, or operators and preferences",
      blocks: [
        {
          kind: "p",
          text: [
            "Use nodeSelector when one exact label match says everything. Use node affinity when you need an OR, a ",
            { code: "NotIn" },
            ", a numeric comparison or a preference.",
          ],
        },
        {
          kind: "p",
          text: [
            { code: "nodeSelector" },
            " is the simplest constraint: a map of labels. Kubernetes schedules the pod only onto nodes that carry every one of them.",
          ],
        },
        { kind: "p", text: "Node affinity covers the same ground and adds three things:" },
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
              "OR logic: terms in ",
              { code: "nodeSelectorTerms" },
              " are ORed, and the expressions inside one term are ANDed",
            ],
            "preferred rules, which only shift the score",
          ],
        },
        {
          kind: "p",
          text: "If a pod sets both nodeSelector and node affinity, a node has to satisfy both.",
        },
        {
          kind: "h3",
          id: "kubernetes-node-affinity-example-one-pool-one",
          title: "Kubernetes node affinity example: one pool, one preferred zone",
        },
        { kind: "p", text: "List your nodes’ labels first:" },
        { kind: "code", lang: "bash", code: "kubectl get nodes --show-labels" },
        {
          kind: "p",
          text: "This node affinity keeps a pod in one AKS node pool and prefers one zone inside it:",
        },
        {
          kind: "code",
          lang: "yaml",
          code: "spec:\n  affinity:\n    nodeAffinity:\n      requiredDuringSchedulingIgnoredDuringExecution:\n        nodeSelectorTerms:\n        - matchExpressions:\n          - key: kubernetes.azure.com/agentpool\n            operator: In\n            values:\n            - <pool-name>\n      preferredDuringSchedulingIgnoredDuringExecution:\n      - weight: 50\n        preference:\n          matchExpressions:\n          - key: topology.kubernetes.io/zone\n            operator: In\n            values:\n            - <zone>",
        },
        {
          kind: "p",
          text: "So the scheduler drops every node outside the pool, then adds 50 to the score of each remaining node in that zone.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: [
            { code: "kubernetes.azure.com/agentpool" },
            " is an AKS reserved label that holds the node pool’s name. On Amazon Elastic Kubernetes Service (EKS), managed node groups carry labels prefixed ",
            { code: "eks.amazonaws.com" },
            ". Among them is ",
            { code: "eks.amazonaws.com/capacityType" },
            ", with the value ",
            { code: "ON_DEMAND" },
            " or ",
            { code: "SPOT" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "The EKS docs suggest that label for keeping stateful or fault-intolerant apps on On-Demand nodes. Fault-tolerant ones can go on Spot.",
        },
        { kind: "h3", id: "node-anti-affinity-and-taints", title: "Node anti-affinity and taints" },
        {
          kind: "p",
          text: [
            { code: "NotIn" },
            " and ",
            { code: "DoesNotExist" },
            " give you node anti-affinity, which keeps a pod off nodes with a given label. ",
            { a: "Taints", href: "/learn/cordon-vs-drain" },
            " work from the node’s side.",
          ],
        },
        {
          kind: "p",
          text: "The docs call node affinity a property of pods that attracts them to nodes. Taints are “the opposite”: a tainted node repels pods that don’t tolerate the taint.",
        },
        {
          kind: "p",
          text: "A toleration lets a pod onto a tainted node but doesn’t send it there. So dedicating a pool to one workload takes both halves. The taint keeps other pods out, and node affinity keeps that workload in.",
        },
      ],
    },
    {
      id: "pod-affinity-and-anti-affinity-place-a",
      title: "Pod affinity and pod anti-affinity place a pod next to, or away from, other pods",
      blocks: [
        {
          kind: "p",
          text: [
            "Kubernetes pod affinity pairs a label selector over pods with a topologyKey. In the docs’ own example, each web replica requires a node (",
            { code: "topologyKey: kubernetes.io/hostname" },
            ") that already runs a cache pod labelled ",
            { code: "app=store" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "Pod anti-affinity flips the test, so the pod avoids domains that already run matching pods. Its common job is spreading a Deployment’s replicas so that one node failure can’t take them all.",
        },
        {
          kind: "p",
          text: "A preferred anti-affinity rule on hostname asks the scheduler to spread replicas when it can. It lets two share a node when it must:",
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
            " can’t be empty.",
          ],
        },
        {
          kind: "p",
          text: "Inter-pod rules cost scheduling time. The docs say they “require substantial amounts of processing” and don’t recommend them in clusters larger than several hundred nodes.",
        },
        {
          kind: "p",
          text: "The Cluster Autoscaler FAQ adds that its latency targets hold only if no pod uses pod affinity or anti-affinity. Anti-affinity also needs every node to carry the topologyKey label.",
        },
        {
          kind: "h3",
          id: "pod-anti-affinity-vs-node-affinity",
          title: "Pod anti-affinity vs node affinity",
        },
        {
          kind: "p",
          text: [
            "Node affinity asks what the node is, and pod anti-affinity asks what already runs there. “Not on Spot nodes” is node affinity with ",
            { code: "NotIn" },
            ". “Not on a node that already runs another replica” is pod anti-affinity.",
          ],
        },
        {
          kind: "p",
          text: "Sometimes “what runs there” really means “nodes of one kind”. Then label those nodes and use node affinity, which stays true as pods come and go.",
        },
      ],
    },
    {
      id: "pod-affinity-vs-node-affinity",
      title: "Pod affinity vs node affinity: node labels per node, or pods per domain",
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
      title: "A required rule can keep a node, and its cost, in the cluster",
      blocks: [
        {
          kind: "p",
          text: "Draining a node evicts its pods. Their controllers create replacements, and the scheduler places each one under the same rules as before. So a replacement with nowhere to go stays Pending.",
        },
        {
          kind: "p",
          text: "The Cluster Autoscaler checks for that before it removes a node. Its FAQ says it simulates the kube-scheduler: “if there’s no other node where a given pod can schedule, the pod’s node won’t be scaled down.”",
        },
        {
          kind: "h3",
          id: "required-anti-affinity-holds-one-node-per",
          title: "Required anti-affinity holds one node per replica",
        },
        {
          kind: "p",
          text: [
            "Required anti-affinity on ",
            { code: "kubernetes.io/hostname" },
            " is the plain case: a Deployment with 3\u00a0replicas runs one per node, so it needs 3\u00a0nodes. That holds whatever those replicas request.",
          ],
        },
        {
          kind: "p",
          text: "Suppose they can run only in a 3-node pool. Every node in it could be close to idle, and still none could go.",
        },
        {
          kind: "p",
          text: "The FAQ names this pattern. Pods that fit one per node on some subset of nodes “will always block CA from scaling down their nodes”.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "Try removing node-3 from that pool: its replica would need a node that runs no other replica. But node-1 and node-2 each run one, so 0 of the 2\u00a0nodes left pass the filter.",
        },
        {
          kind: "p",
          text: "The replacement would stay Pending, so the Cluster Autoscaler keeps node-3, and the same check keeps node-1 and node-2. The floor is the replica count, so 4\u00a0replicas would need 4\u00a0nodes.",
        },
        { kind: "svg", figure: figure3 },
        {
          kind: "p",
          text: "The docs’ web-and-cache example locks the same way. Both Deployments carry required hostname anti-affinity, and the web tier also requires a cache pod on its node. So in the docs’ three-node cluster, each node ends up with one pair that can’t move.",
        },
        {
          kind: "h3",
          id: "other-required-rules-narrow-where-a-pod",
          title: "Other required rules narrow where a pod can go",
        },
        { kind: "p", text: "These don’t pin a pod to one node, but each one narrows its choices:" },
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
              " A volume can carry node affinity too. Topology-aware provisioners set it on the PersistentVolumes they create. That ties the pods using that volume to nodes in its zone.",
            ],
          ],
        },
        {
          kind: "h3",
          id: "preferred-rules-depend-on-the-autoscaler",
          title: "Preferred rules depend on the autoscaler",
        },
        {
          kind: "p",
          text: "The Cluster Autoscaler respects nodeSelector and required node affinity when it picks a node group to grow. That works if the groups are labelled to match. Preferred rules play no part in that choice.",
        },
        {
          kind: "p",
          text: "When Karpenter builds a pod’s requirements, it starts by treating preferred affinities as required. It relaxes them one at a time, only when they can’t be met.",
        },
        {
          kind: "p",
          text: "Karpenter also uses them to judge whether a pod can shift to another node. Its docs warn that preferred affinities “can result in more nodes being created than expected”.",
        },
      ],
    },
    {
      id: "choosing-the-rule-preferred-by-default-required",
      title: "Choosing the rule: preferred by default, required only where the app needs it",
      blocks: [
        {
          kind: "p",
          text: "Default to preferred, and make a rule required only where breaking it breaks the app.",
        },
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
            { a: "How bin packing works", href: "/learn/kubernetes-bin-packing" },
            " covers that half. The ",
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
      title: "How Coral checks affinity before it drains a node",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " optimizes Kubernetes on AKS and EKS. It rebalances CPU and memory requests and drains spare nodes so your autoscaler can remove them. When it consolidates nodes, its drain follows the same scheduling rules:",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "The check." },
              " Before it drains a spare node, Coral simulates the scheduler on the live cluster. Every pod on the node must fit elsewhere, with its affinity, taints, spread, ports and zones. If one pod has nowhere to go, the node isn’t drained.",
            ],
            [
              { b: "The limits." },
              " It respects PodDisruptionBudgets and do-not-disrupt. By default, Coral may reduce a pool’s minimum when that minimum alone keeps a node it has emptied, and disconnect puts the old minimum back. Every pool keeps at least one node.",
            ],
            [
              { b: "The drain." },
              " It cordons and drains one node at a time. If a drain can’t finish, the node goes back into service.",
            ],
          ],
        },
        {
          kind: "p",
          text: "Where requests sit above real use, rebalancing them leaves more room on the nodes that stay. So more pods fit elsewhere, and more nodes can go. A required one-per-node rule still keeps its nodes, because that floor comes from the rule and not from requests.",
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
    text: "Coral rebalances CPU and memory requests on AKS and EKS, works with your HPA, and drains spare nodes so your autoscaler can remove them. We estimate it takes 40–50% off AKS and EKS cost. It is an estimated range, not a promise. The free assessment works out your own figure.",
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
      title: "Topology spread constraints: maxSkew, zones and scale-down",
      where: "Learn",
      href: "/learn/topology-spread-constraints",
    },
    {
      title: "Cluster Autoscaler not scaling down: what keeps nodes running",
      where: "Learn",
      href: "/learn/cluster-autoscaler-not-scaling-down",
    },
    {
      title: "Kubernetes bin packing: fewer nodes for the same pods",
      where: "Learn",
      href: "/learn/kubernetes-bin-packing",
    },
    {
      title: "How do you make sure node consolidation doesn’t cause scheduling failures later?",
      where: "Coral FAQ",
      href: "/coral-faq#how-do-you-make-sure-node",
    },
  ],
};
