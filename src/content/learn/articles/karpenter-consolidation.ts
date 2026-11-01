import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/karpenter-consolidation/1";
import { figure as figure2 } from "@/features/learn/figures/karpenter-consolidation/2";
import { figure as figure3 } from "@/features/learn/figures/karpenter-consolidation/3";

export const article: Article = {
  slug: "karpenter-consolidation",
  title: "Karpenter consolidation: policies, budgets, limits",
  meta: "Karpenter consolidation in v1.15: the three consolidationPolicy values, consolidateAfter and disruption budgets, plus what to check when a node won’t go.",
  h1: "Karpenter consolidation: policies, budgets and limits",
  deck: "How Karpenter picks the nodes it removes, how to set the pace, and what keeps a node in place.",
  card: "The three consolidation policies, consolidateAfter and budgets, plus what stops Karpenter scaling down.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes autoscaling",
  published: "2026-11-01",
  updated: "2026-11-01",
  author: "swati",
  cover: "/learn-covers/zoorik-learn-karpenter-consolidation-1200x630.webp",
  coverAlt: "Karpenter consolidation: when pods fit elsewhere, they move and the node is deleted",
  short: [
    "Karpenter consolidation removes a node when its pods’ requests, not their use, fit on other nodes, or replaces it with one cheaper node. Each NodePool controls it with ",
    { code: "consolidationPolicy" },
    " (default ",
    { code: "WhenEmptyOrUnderutilized" },
    "), ",
    { code: "consolidateAfter" },
    " (default ",
    { code: "0s" },
    ") and disruption budgets (default 10% of nodes at a time).",
  ],
  sections: [
    {
      id: "karpenter-consolidation",
      title: "How Karpenter consolidation decides which nodes go",
      blocks: [
        {
          kind: "p",
          text: "Picture a NodePool of three nodes, each with 4\u00a0CPU allocatable for pods. Each node’s pods request 3\u00a0CPU and use about 0.6\u00a0CPU. The whole pool uses 1.8 of its 12\u00a0CPU, yet consolidation can’t delete any of the three nodes.",
        },
        {
          kind: "p",
          text: "Consolidation decides with a scheduling simulation, and the simulation works in requests. Karpenter’s troubleshooting guide says it “bin-packs pods based on the resource requests”.",
        },
        {
          kind: "p",
          text: "The Kubernetes scheduler places a pod only where the requests on a node, plus the new pod’s, fit its capacity. That holds however little CPU and memory the node is really using.",
        },
        {
          kind: "p",
          text: "To delete one of the three nodes, Karpenter needs room for its 3\u00a0CPU of requests. The other two have only 1\u00a0CPU free each.",
        },
        {
          kind: "p",
          text: "So “underutilized” in Karpenter’s terms doesn’t mean idle CPU. It means the node’s pods, counted by their requests, fit somewhere else.",
        },
        { kind: "h3", id: "deletion-and-replacement", title: "Deletion and replacement" },
        {
          kind: "p",
          text: "Consolidation looks for two kinds of action. A deletion removes a node whose pods can all run on free capacity of other nodes. A replacement removes a node and moves its pods onto a mix of free capacity elsewhere and a single new node that costs less.",
        },
        { kind: "p", text: "It tries these in a fixed order:" },
        {
          kind: "ol",
          items: [
            "Empty nodes go first, deleted in parallel.",
            "Multi-node consolidation comes next. It removes two or more nodes, possibly launching one cheaper replacement for all of them.",
            "Single-node consolidation then checks each node on its own.",
          ],
        },
        {
          kind: "h3",
          id: "the-steps-of-one-consolidation-action",
          title: "The steps of one consolidation action",
        },
        {
          kind: "callout",
          label: "For engineers",
          text: "Karpenter’s disruption controller runs one automated method at a time. Node Repair goes first when it’s enabled (an alpha feature gate, off by default), then Drift, then consolidation.",
        },
        {
          kind: "p",
          text: "When several nodes qualify for consolidation, Karpenter picks the one that disrupts least. It prefers a node:",
        },
        {
          kind: "ul",
          items: [
            "with fewer pods",
            "that will expire soon",
            "whose pods have less priority",
            [
              "with a smaller total ",
              { code: "karpenter.sh/disruption-cost" },
              ", an annotation new in v1.15",
            ],
          ],
        },
        { kind: "p", text: "Each action follows the same steps:" },
        {
          kind: "ol",
          items: [
            "Karpenter checks the NodePool’s disruption budget.",
            "It runs a scheduling simulation with the node’s pods.",
            [
              "It adds the ",
              { code: "karpenter.sh/disrupted:NoSchedule" },
              " taint and starts any replacement.",
            ],
            "Once the replacement is ready, it deletes the old node.",
            "The Termination Controller drains the old node through the Kubernetes Eviction API, which respects PodDisruptionBudgets (PDBs).",
          ],
        },
        {
          kind: "p",
          text: "If a replacement fails to initialize, Karpenter removes the taint and begins again from the first method.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "which-karpenter-consolidation-policy-to-choose",
      title: "Which Karpenter consolidation policy to choose",
      blocks: [
        {
          kind: "p",
          text: [
            "Each NodePool’s ",
            { code: "spec.disruption.consolidationPolicy" },
            " decides which nodes Karpenter considers. As of Karpenter v1.15, the current release (10 October 2026), the ",
            { code: "karpenter.sh/v1" },
            " API accepts three values:",
          ],
        },
        {
          kind: "table",
          columns: [
            { label: "Policy", width: "14%" },
            { label: "Nodes Karpenter considers", width: "55%" },
            { label: "Pick it when", width: "31%" },
          ],
          rows: [
            [
              [{ code: "WhenEmpty" }],
              "Only empty nodes: those running nothing but pods with no disruption cost, such as DaemonSet pods",
              "Running pods must never move for cost",
            ],
            [
              [{ code: "Balanced" }],
              "The same nodes as the default, but it acts only when the saving outweighs the pod disruption",
              "You want most of the saving without marginal moves",
            ],
            [
              [{ code: "WhenEmptyOrUnderutilized" }, " (default)"],
              "Any node that can be removed or replaced to reduce cost",
              "You want the most capacity back and accept the pod moves",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Because ",
            { code: "consolidationPolicy: WhenEmptyOrUnderutilized" },
            " is the default, a NodePool with no disruption block already consolidates underused nodes.",
          ],
        },
        {
          kind: "h3",
          id: "how-the-balanced-policy-scores-a-move",
          title: "How the Balanced policy scores a move",
        },
        {
          kind: "p",
          text: [
            { code: "Balanced" },
            " is newer, added in v1.14. Each action gets a score that weighs the saving against the disruption it causes. Karpenter measures the saving as a percentage of the NodePool’s cost, and the disruption as a share of the pool’s total pod disruption.",
          ],
        },
        {
          kind: "p",
          text: [
            "By default every pod weighs the same. So the score comes down to the saving against the number of pods evicted. Approved actions emit a ",
            { code: "ConsolidationApproved" },
            " event that carries the score.",
          ],
        },
        {
          kind: "h3",
          id: "policy-support-in-eks-auto-mode-and",
          title: "Policy support in EKS Auto Mode and NAP",
        },
        {
          kind: "p",
          text: [
            "Where Karpenter is managed for you, support differs. ",
            { a: "Amazon EKS Auto Mode", href: "/learn/glossary/eks-auto-mode" },
            " NodePools accept all three values.",
          ],
        },
        {
          kind: "p",
          text: [
            "Microsoft’s page on node auto provisioning (NAP), which runs Karpenter inside Azure Kubernetes Service (AKS), lists only ",
            { code: "WhenEmpty" },
            " and ",
            { code: "WhenEmptyOrUnderutilized" },
            ". So don’t assume ",
            { code: "Balanced" },
            " works there. If you’re setting NAP up, ",
            { a: "enabling NAP on AKS", href: "/learn/aks-node-auto-provisioning" },
            " walks through it.",
          ],
        },
        {
          kind: "h3",
          id: "how-karpenters-consolidateafter-works",
          title: "How Karpenter’s consolidateAfter works",
        },
        {
          kind: "p",
          text: [
            { code: "consolidateAfter" },
            " is how long a node must stay stable before it becomes a candidate. Karpenter resets that timer whenever a pod is added to or removed from the node. So a node with pods coming and going may never reach it.",
          ],
        },
        {
          kind: "p",
          text: [
            "The field takes a duration such as ",
            { code: "30s" },
            ", ",
            { code: "5m" },
            " or ",
            { code: "1h" },
            ", or ",
            { code: "Never" },
            ", which switches consolidation off for the whole NodePool. Its default is ",
            { code: "0s" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "From v1.0 to v1.14 the API required the field whenever you wrote a disruption block. From v1.15, it fills in ",
            { code: "0s" },
            " when you leave it out.",
          ],
        },
        {
          kind: "p",
          text: [
            "A longer wait, such as ",
            { code: "10m" },
            ", gives a workload that scales up and down often time to settle before its nodes are judged:",
          ],
        },
        {
          kind: "code",
          lang: "yaml",
          code: "spec:\n  disruption:\n    consolidationPolicy: WhenEmptyOrUnderutilized\n    consolidateAfter: 10m",
        },
      ],
    },
    {
      id: "how-a-karpenter-disruption-budget-sets-the",
      title: "How a Karpenter disruption budget sets the pace",
      blocks: [
        {
          kind: "p",
          text: [
            "A disruption budget caps how many of a NodePool’s nodes can be disrupted at once. With no ",
            { code: "spec.disruption.budgets" },
            " set, Karpenter uses one budget of ",
            { code: "nodes: 10%" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "Budgets govern voluntary disruption only, meaning drift, emptiness, consolidation and node repair. They don’t prevent Karpenter from terminating a node that has expired.",
        },
        {
          kind: "p",
          text: [
            "A percentage rounds up, and nodes already deleting or NotReady count against it. The Karpenter docs give the formula as ",
            {
              code: "allowed_disruptions = roundup(total * percentage) - total_deleting - total_notready",
            },
            ".",
          ],
        },
        {
          kind: "p",
          text: "On a 3-node NodePool the default allows one node at a time, since 3 × 10% = 0.3 rounds up to 1. On 19\u00a0nodes, a 20% budget allows 4, since 19 × 20% = 3.8.",
        },
        {
          kind: "p",
          text: [
            "A plain number such as ",
            { code: 'nodes: "5"' },
            " is a fixed ceiling. With several budgets active, the most restrictive one wins.",
          ],
        },
        {
          kind: "h3",
          id: "budgets-by-reason-and-time-window",
          title: "Budgets by reason and time window",
        },
        { kind: "p", text: "Budgets can also target reasons and time windows:" },
        {
          kind: "ul",
          items: [
            [
              { code: "reasons" },
              " takes ",
              { code: "Empty" },
              ", ",
              { code: "Underutilized" },
              ", ",
              { code: "Drifted" },
              " and, from v1.15, ",
              { code: "Unhealthy" },
              ". A budget with no reasons covers all of them.",
            ],
            [{ code: "schedule" }, " uses cron syntax and always runs in UTC."],
            [
              { code: "duration" },
              " (minutes and hours, such as ",
              { code: "8h" },
              ") must be set with ",
              { code: "schedule" },
              ".",
            ],
          ],
        },
        {
          kind: "p",
          text: "This NodePool lets any reason disrupt up to 10% of its nodes at a time. It allows no consolidation of underused nodes from 09:00 to 17:00 UTC on weekdays:",
        },
        {
          kind: "code",
          lang: "yaml",
          code: 'spec:\n  disruption:\n    consolidationPolicy: WhenEmptyOrUnderutilized\n    consolidateAfter: 5m\n    budgets:\n    - nodes: "10%"\n    - nodes: "0"\n      schedule: "0 9 * * mon-fri"\n      duration: 8h\n      reasons:\n      - "Underutilized"',
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: [
            "To stop all voluntary disruption in a NodePool, give it a single budget of ",
            { code: 'nodes: "0"' },
            ".",
          ],
        },
      ],
    },
    {
      id: "limits-and-expiry-sit-beside-consolidation",
      title: "Limits and expireAfter sit beside consolidation",
      blocks: [
        {
          kind: "p",
          text: [
            { code: "spec.limits" },
            " caps the CPU, memory or node count a NodePool may provision. Once a limit is exceeded, Karpenter launches no more nodes from that pool until some terminate. A limit never removes a node, so it isn’t a consolidation control.",
          ],
        },
        {
          kind: "p",
          text: [
            "Expiry is a separate, forceful method. ",
            { code: "spec.template.spec.expireAfter" },
            " defaults to ",
            { code: "720h" },
            " (30\u00a0days), and EKS Auto Mode sets 336\u00a0hours by default. A node that reaches its expiry starts draining whatever its disruption budget says.",
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            "A pod marked ",
            { code: "karpenter.sh/do-not-disrupt" },
            " can hold an expiring node half-drained indefinitely. So the Karpenter docs advise setting ",
            { code: "terminationGracePeriod" },
            " alongside ",
            { code: "expireAfter" },
            " if you use that annotation.",
          ],
        },
        {
          kind: "p",
          text: [
            "Static NodePools aren’t consolidated at all. They set ",
            { code: "spec.replicas" },
            " to keep a fixed node count, an alpha feature behind the ",
            { code: "StaticCapacity" },
            " feature gate.",
          ],
        },
      ],
    },
    {
      id: "when-karpenter-is-not-scaling-down-a",
      title: "When Karpenter is not scaling down a node",
      blocks: [
        {
          kind: "p",
          text: [
            "Start with the node’s events. While consolidation is on, Karpenter periodically records ",
            { code: "Unconsolidatable" },
            " events on nodes it can’t consolidate, with the reason in the message:",
          ],
        },
        { kind: "code", lang: "bash", code: "kubectl describe node <node-name>" },
        {
          kind: "code",
          lang: "",
          code: "Events:\n  Type     Reason             Age                From       Message\n  Normal   Unconsolidatable   66s                karpenter  pdb default/inflate-pdb prevents pod evictions\n  Normal   Unconsolidatable   33s (x3 over 30m)  karpenter  can't replace with a lower-priced node",
        },
        {
          kind: "h3",
          id: "nine-causes-in-the-order-worth-checking",
          title: "Nine causes, in the order worth checking",
        },
        {
          kind: "ol",
          items: [
            [
              { b: "The node isn’t initialized." },
              " Karpenter only considers nodes that carry the ",
              { code: "karpenter.sh/initialized" },
              " label.",
            ],
            [
              { b: "No budget allows a disruption right now." },
              " That can be a ",
              { code: 'nodes: "0"' },
              " budget or an active schedule window. It can also be an allowance already used by nodes that are deleting or NotReady.",
            ],
            [
              { b: "A PDB allows no eviction." },
              " Every ",
              { a: "PDB", href: "/learn/pod-disruption-budget-best-practices" },
              " matching every pod on the node must allow one. So a single PDB with ",
              { code: "maxUnavailable: 0" },
              " keeps the whole node.",
            ],
            [
              { b: ["A pod or the node carries ", { code: "karpenter.sh/do-not-disrupt" }, "."] },
              " The value ",
              { code: '"true"' },
              " protects for good. A duration such as ",
              { code: '"30m"' },
              " protects for that long after the pod starts. For both markers, see ",
              {
                a: "the safe-to-evict and do-not-disrupt annotations",
                href: "/learn/safe-to-evict-do-not-disrupt",
              },
              ".",
            ],
            [
              { b: "The simulation finds no place for a pod." },
              " Affinity, anti-affinity or ",
              { a: "topology spread", href: "/learn/topology-spread-constraints" },
              " rules leave it no other node, and preferred rules count too. Karpenter tries to satisfy preferences when it launches nodes. Consolidation follows them as well, so it doesn’t remove nodes right after launching them. Setting the controller’s ",
              { code: "PREFERENCE_POLICY" },
              " to ",
              { code: "Ignore" },
              " makes Karpenter’s scheduler skip preferences, at the price of ignoring them at launch too.",
            ],
            [
              { b: "The timer never runs out." },
              " Pods churn faster than ",
              { code: "consolidateAfter" },
              ", so it keeps resetting, or it’s set to ",
              { code: "Never" },
              ".",
            ],
            [
              { b: "The policy rules the node out." },
              " It’s ",
              { code: "WhenEmpty" },
              " and the node still runs workload pods, or ",
              { code: "Balanced" },
              " scored the move as not worth it.",
            ],
            [
              { b: "The node is spot." },
              " Consolidation can delete ",
              { a: "spot", href: "/learn/glossary/spot-instance" },
              " nodes by default. Replacing one with a cheaper spot node needs the alpha ",
              { code: "SpotToSpotConsolidation" },
              " feature gate, which is off by default. A one-for-one spot swap also needs at least 15 cheaper instance types to choose from.",
            ],
            [
              { b: "The requests fill the nodes." },
              " When each node’s requests leave too little free room for another node’s pods, there is nothing to delete. No single cheaper node fits the pods either.",
            ],
          ],
        },
      ],
    },
    {
      id: "requests-decide-how-many-nodes-consolidation-can",
      title: "Requests decide how many nodes consolidation can remove",
      blocks: [
        {
          kind: "p",
          text: [
            "Policies, timers and budgets decide how fast and how carefully nodes go. The ",
            { a: "requests", href: "/learn/glossary/kubernetes-resource-requests" },
            " decide how many can go.",
          ],
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "In the first section’s NodePool, the pods request 3 × 3 = 9 of the 12\u00a0CPU and use 3 × 0.6 = 1.8. Each node has only 4 − 3 = 1\u00a0CPU free.",
        },
        {
          kind: "p",
          text: "Bring the requests near use, say 0.8\u00a0CPU per node’s worth of pods. All the pods then request 3 × 0.8 = 2.4\u00a0CPU, which fits on one node with 4 − 2.4 = 1.6\u00a0CPU to spare.",
        },
        {
          kind: "p",
          text: "Under the default policy, Karpenter can now remove two nodes. They go one at a time, because the default 10% budget allows one node on a 3-node NodePool.",
        },
        { kind: "svg", figure: figure3 },
        {
          kind: "p",
          text: "The opposite mistake has a price too. A request set below what a pod really needs lets Karpenter pack too many pods onto one node, where they compete for CPU. A pod using more memory than it requested is likely to be evicted when the node runs short of memory.",
        },
        {
          kind: "p",
          text: [
            { a: "Kubernetes pod right sizing", href: "/learn/kubernetes-pod-right-sizing" },
            " covers setting requests from measured use. ",
            { a: "Karpenter cost optimization", href: "/learn/karpenter-cost-optimization" },
            " covers the requests Karpenter’s own settings can’t fix.",
          ],
        },
      ],
    },
    {
      id: "where-coral-fits",
      title: "Where Coral fits",
      blocks: [
        {
          kind: "p",
          text: "Karpenter chooses and removes machines from pod requests, and it doesn’t change the requests. Coral rebalances them to measured use, plus headroom. For a workload with a CPU-based Horizontal Pod Autoscaler (HPA), it picks the CPU request by replaying past load through the HPA’s own settings.",
        },
        {
          kind: "p",
          text: "The same Karpenter can then run fewer or smaller nodes. Request changes start only when you switch on “Automatically optimize” for a policy or a workload. Pods are resized in place on Kubernetes 1.33 and later nodes, and on older nodes they restart one at a time within their PDBs.",
        },
        {
          kind: "p",
          text: [
            "Coral leaves the pools Karpenter consolidates to Karpenter and never changes your Karpenter settings, as ",
            { a: "Coral works with Karpenter", href: "/coral-works-with-karpenter" },
            " explains. If an EKS cluster has no autoscaler, connecting Coral can set up Karpenter, with your approval.",
          ],
        },
        {
          kind: "p",
          text: [
            "When you run a rebalance, Coral creates fixed-size NodePools named ",
            { code: "zoorik-rb-…" },
            ". Your Karpenter launches the new machines, and the old nodes are drained one by one.",
          ],
        },
        {
          kind: "p",
          text: [
            "A pod annotated ",
            { code: 'karpenter.sh/do-not-disrupt: "true"' },
            " is never moved, and its node is kept. The same annotation on a node keeps that node.",
          ],
        },
        {
          kind: "p",
          text: [
            "For the product, see ",
            { a: "Kubernetes optimization with Coral", href: "/coral" },
            ". For the order of rebalancing and node removal, see the ",
            { a: "Kubernetes cost optimization guide", href: "/kubernetes-cost-optimization" },
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
      { label: "Kubernetes optimization with Coral", href: "/coral" },
      { label: "Estimate your saving", href: "/assessment?p=coral" },
    ],
  },
  sources: [
    {
      publisher: "Karpenter",
      title: "“Disruption”",
      url: "https://karpenter.sh/docs/concepts/disruption/",
    },
    {
      publisher: "Karpenter",
      title: "“NodePools”",
      url: "https://karpenter.sh/docs/concepts/nodepools/",
    },
    {
      publisher: "Karpenter",
      title: "“Troubleshooting”",
      url: "https://karpenter.sh/docs/troubleshooting/",
    },
    {
      publisher: "Karpenter",
      title: "“Settings”",
      url: "https://karpenter.sh/docs/reference/settings/",
    },
    {
      publisher: "Karpenter (kubernetes-sigs/karpenter on GitHub)",
      title: "“Releases”",
      url: "https://github.com/kubernetes-sigs/karpenter/releases",
      note: " (v1.14.0 and v1.15.0 notes)",
    },
    {
      publisher: "Kubernetes",
      title: "“Resource Management for Pods and Containers”",
      url: "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/",
    },
    {
      publisher: "AWS",
      title: "“Create a Node Pool for EKS Auto Mode”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/create-node-pool.html",
    },
    {
      publisher: "Microsoft Learn",
      title:
        "“Configure disruption policies for node auto-provisioning (NAP) nodes in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/node-auto-provisioning-disruption",
    },
  ],
  related: [
    {
      title: "What is Karpenter? How it picks and removes nodes",
      where: "Learn",
      href: "/learn/what-is-karpenter",
    },
    {
      title: "Karpenter cost optimization: the requests it can’t fix",
      where: "Learn",
      href: "/learn/karpenter-cost-optimization",
    },
    {
      title: "Pod disruption budget best practices for AKS and EKS",
      where: "Learn",
      href: "/learn/pod-disruption-budget-best-practices",
    },
    {
      title: "Why Coral holds a node, and each fix",
      where: "Coral product guide",
      href: "/coral-guide#nodes-held",
    },
    {
      title: "Do I need Coral with Karpenter or NAP?",
      where: "Coral FAQ",
      href: "/coral-faq#do-i-need-coral-with-karpenter",
    },
  ],
};
