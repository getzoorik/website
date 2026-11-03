import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/karpenter-consolidation/1";
import { figure as figure2 } from "@/features/learn/figures/karpenter-consolidation/2";
import { figure as figure3 } from "@/features/learn/figures/karpenter-consolidation/3";

export const article: Article = {
  slug: "karpenter-consolidation",
  title: "Karpenter consolidation: policies, budgets, limits",
  meta: "How Karpenter consolidation picks the nodes it removes, what each consolidationPolicy and disruption budget does, and why a node won’t scale down.",
  h1: "Karpenter consolidation",
  deck: "How Karpenter chooses which nodes to remove, how to pace it, and why a node stays.",
  card: "The three consolidation policies, consolidateAfter and budgets, and why a node won’t go.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes autoscaling",
  published: "2026-11-01",
  updated: "2026-11-03",
  author: "swati",
  cover: "/learn-covers/zoorik-learn-karpenter-consolidation-1200x630.webp",
  coverAlt: "Karpenter consolidation: when pods fit elsewhere, they move and the node is deleted",
  short: [
    "Karpenter consolidation deletes a node when its pods fit on other nodes, or replaces it with a cheaper one. It counts pod requests, not real use. Each NodePool controls it with ",
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
      title: "How consolidation works",
      blocks: [
        {
          kind: "p",
          text: "Consolidation decides with a scheduling simulation. Like the Kubernetes scheduler, Karpenter “bin-packs pods based on the resource requests”, as its troubleshooting guide puts it. What a node really uses doesn’t count.",
        },
        {
          kind: "p",
          text: "Take a NodePool of three nodes, each with 4 CPU allocatable. Each node’s pods request 3 CPU but use about 0.6 CPU. The pool uses 1.8 of its 12 CPU, yet no node can go.",
        },
        {
          kind: "p",
          text: "Deleting a node needs room for its 3 CPU of requests, and the other two have only 1 CPU free each. So “underutilized” doesn’t mean idle. It means a node’s pods, counted by their requests, fit somewhere else.",
        },
        { kind: "h3", id: "deletion-and-replacement", title: "Deletion and replacement" },
        {
          kind: "p",
          text: "A deletion removes a node whose pods all fit on free capacity of other nodes. A replacement removes a node and runs its pods on free capacity plus one new, cheaper node.",
        },
        { kind: "p", text: "Consolidation tries three kinds, in this order:" },
        {
          kind: "ol",
          items: [
            "Empty nodes, deleted in parallel.",
            "Multi-node: two or more nodes at once, possibly with one cheaper replacement for all of them.",
            "Single-node: each node on its own, possibly with one cheaper replacement.",
          ],
        },
        {
          kind: "callout",
          label: "For engineers",
          text: "Karpenter’s disruption controller runs one automated method at a time: Node Repair first when it’s enabled (an alpha feature gate, off by default), then Drift, then consolidation.",
        },
        {
          kind: "h3",
          id: "the-steps-of-one-consolidation-action",
          title: "Steps of one action",
        },
        {
          kind: "p",
          text: "When several nodes qualify, Karpenter picks the one whose removal disrupts least. It prefers nodes with:",
        },
        {
          kind: "ul",
          items: [
            "fewer pods",
            "an expiry coming soon",
            "lower-priority pods",
            [
              "a smaller total ",
              { code: "karpenter.sh/disruption-cost" },
              ", a pod annotation new in v1.15",
            ],
          ],
        },
        { kind: "p", text: "Each action then runs the same steps:" },
        {
          kind: "ol",
          items: [
            "Karpenter checks the NodePool’s disruption budget.",
            "It simulates scheduling the node’s pods elsewhere.",
            [
              "It adds the ",
              { code: "karpenter.sh/disrupted:NoSchedule" },
              " taint and starts any replacement.",
            ],
            "Once any replacement is ready, it deletes the old node.",
            "The Termination Controller drains it through the Kubernetes Eviction API, which respects PodDisruptionBudgets (PDBs).",
          ],
        },
        {
          kind: "p",
          text: "If a replacement fails to initialize, Karpenter removes the taint and starts again from the first method.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "which-karpenter-consolidation-policy-to-choose",
      title: "Consolidation policies",
      blocks: [
        {
          kind: "p",
          text: [
            "Each NodePool’s ",
            { code: "spec.disruption.consolidationPolicy" },
            " sets which nodes Karpenter considers. In Karpenter v1.15, the ",
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
              "Running pods must never move to reduce cost",
            ],
            [
              [{ code: "Balanced" }],
              "The same nodes as the default, but only for moves whose saving outweighs the disruption",
              "You want most of the saving with fewer pod moves",
            ],
            [
              [{ code: "WhenEmptyOrUnderutilized" }, " (default)"],
              "Any node that can be removed or replaced to reduce cost",
              "You want the most capacity back and accept pod moves",
            ],
          ],
        },
        {
          kind: "p",
          text: "A NodePool with no disruption block gets the default, so it already consolidates underused nodes.",
        },
        {
          kind: "h3",
          id: "how-the-balanced-policy-scores-a-move",
          title: "How Balanced scores a move",
        },
        {
          kind: "p",
          text: [
            { code: "Balanced" },
            " arrived in v1.14. It scores each action by the share of the NodePool’s cost it saves against the share of the pool’s pod disruption it causes.",
          ],
        },
        {
          kind: "p",
          text: [
            "By default every pod weighs the same, so the score compares the saving with the number of pods evicted. Approved actions emit a ",
            { code: "ConsolidationApproved" },
            " event with the score and the saving and disruption percentages.",
          ],
        },
        {
          kind: "h3",
          id: "policy-support-in-eks-auto-mode-and",
          title: "EKS Auto Mode and NAP",
        },
        {
          kind: "p",
          text: [
            { a: "Amazon EKS Auto Mode", href: "/learn/glossary/eks-auto-mode" },
            " NodePools accept all three values.",
          ],
        },
        {
          kind: "p",
          text: [
            "Microsoft’s docs for node auto provisioning (NAP), which runs Karpenter in Azure Kubernetes Service (AKS), list only ",
            { code: "WhenEmpty" },
            " and ",
            { code: "WhenEmptyOrUnderutilized" },
            ". So don’t count on ",
            { code: "Balanced" },
            " there. ",
            { a: "AKS node auto provisioning", href: "/learn/aks-node-auto-provisioning" },
            " covers setting NAP up.",
          ],
        },
        {
          kind: "h3",
          id: "how-karpenters-consolidateafter-works",
          title: "The consolidateAfter timer",
        },
        {
          kind: "p",
          text: [
            { code: "consolidateAfter" },
            " is how long a node must go with no pod added or removed before it becomes a candidate. Each pod change resets the timer, so a node with constant pod churn may never qualify.",
          ],
        },
        {
          kind: "p",
          text: [
            "It takes a duration such as ",
            { code: "30s" },
            ", ",
            { code: "5m" },
            " or ",
            { code: "1h" },
            ". ",
            { code: "Never" },
            " switches consolidation off for the NodePool. The field is optional and defaults to ",
            { code: "0s" },
            ".",
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
      title: "Disruption budgets",
      blocks: [
        {
          kind: "p",
          text: [
            "A disruption budget caps how many of a NodePool’s nodes Karpenter can disrupt at once. With no ",
            { code: "spec.disruption.budgets" },
            ", it uses one budget of ",
            { code: "nodes: 10%" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "Budgets cover voluntary disruption only: drift, emptiness, consolidation and node repair. They don’t stop Karpenter terminating an expired node.",
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
          text: "On a 3-node NodePool, the default allows one node at a time, since 3 × 10% = 0.3 rounds up to 1. On 19 nodes, a 20% budget allows 4, since 19 × 20% = 3.8.",
        },
        {
          kind: "p",
          text: [
            "A plain number such as ",
            { code: 'nodes: "5"' },
            " is a fixed cap. With several budgets active, the most restrictive one wins.",
          ],
        },
        {
          kind: "h3",
          id: "budgets-by-reason-and-time-window",
          title: "Reasons and schedules",
        },
        {
          kind: "ul",
          items: [
            [
              { code: "reasons" },
              " limits a budget to ",
              { code: "Empty" },
              ", ",
              { code: "Underutilized" },
              ", ",
              { code: "Drifted" },
              " or, from v1.15, ",
              { code: "Unhealthy" },
              ". A budget with no reasons covers all of them.",
            ],
            [{ code: "schedule" }, " takes cron syntax and always runs in UTC."],
            [
              { code: "duration" },
              " takes minutes and hours, such as ",
              { code: "30m" },
              " or ",
              { code: "8h" },
              ", and must be set with ",
              { code: "schedule" },
              ".",
            ],
          ],
        },
        {
          kind: "p",
          text: "This NodePool lets any reason disrupt up to 10% of its nodes at a time. From 09:00 to 17:00 UTC on weekdays, it allows no consolidation of underused nodes:",
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
            "To stop all voluntary disruption in a NodePool, give it one budget of ",
            { code: 'nodes: "0"' },
            ".",
          ],
        },
      ],
    },
    {
      id: "limits-and-expiry-sit-beside-consolidation",
      title: "Expiry and limits",
      blocks: [
        {
          kind: "p",
          text: [
            "Expiry is a separate, forceful method. ",
            { code: "spec.template.spec.expireAfter" },
            " defaults to ",
            { code: "720h" },
            " (30 days), or 336 hours on EKS Auto Mode. An expired node drains whatever its disruption budget says.",
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            "A pod marked ",
            { code: "karpenter.sh/do-not-disrupt" },
            " can hold an expiring node half-drained indefinitely. If you use that annotation, the Karpenter docs advise setting ",
            { code: "terminationGracePeriod" },
            " with ",
            { code: "expireAfter" },
            ". EKS Auto Mode applies a 24-hour grace period by default.",
          ],
        },
        {
          kind: "p",
          text: [
            { code: "spec.limits" },
            " caps the CPU, memory or node count a NodePool may provision. Once a limit is exceeded, Karpenter launches no more nodes from that pool until some terminate. A limit never removes a node, so it doesn’t control consolidation.",
          ],
        },
        {
          kind: "p",
          text: [
            "Static NodePools, which set ",
            { code: "spec.replicas" },
            " to keep a fixed node count, aren’t consolidated. They’re an alpha feature behind the ",
            { code: "StaticCapacity" },
            " feature gate.",
          ],
        },
      ],
    },
    {
      id: "when-karpenter-is-not-scaling-down-a",
      title: "Karpenter not scaling down",
      blocks: [
        {
          kind: "p",
          text: [
            "Start with the node’s events. With consolidation on, Karpenter periodically records ",
            { code: "Unconsolidatable" },
            " events on each node it can’t consolidate, with the reason:",
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
          title: "Nine causes to check, in order",
        },
        {
          kind: "ol",
          items: [
            [
              { b: "The node isn’t initialized." },
              " Karpenter considers only nodes with the ",
              { code: "karpenter.sh/initialized" },
              " label.",
            ],
            [
              { b: "No budget allows a disruption now." },
              " A ",
              { code: 'nodes: "0"' },
              " budget or an active schedule window blocks it. Or deleting and NotReady nodes have used up the allowance.",
            ],
            [
              { b: "A PDB allows no eviction." },
              " Every ",
              { a: "PDB", href: "/learn/pod-disruption-budget-best-practices" },
              " covering a pod on the node must allow one. A single PDB with ",
              { code: "maxUnavailable: 0" },
              " keeps the whole node.",
            ],
            [
              { b: ["A pod or the node carries ", { code: "karpenter.sh/do-not-disrupt" }, "."] },
              " The value ",
              { code: '"true"' },
              " protects for good. A duration such as ",
              { code: '"30m"' },
              " protects for that long after the pod starts. See ",
              {
                a: "do-not-disrupt vs safe-to-evict",
                href: "/learn/safe-to-evict-do-not-disrupt",
              },
              ".",
            ],
            [
              { b: "No other node fits a pod." },
              " Affinity, anti-affinity or ",
              { a: "topology spread", href: "/learn/topology-spread-constraints" },
              " rules leave it nowhere to go. Preferred rules count too. Karpenter tries to meet them at launch, and consolidation keeps to them so it doesn’t remove nodes it just launched. Setting the controller’s ",
              { code: "PREFERENCE_POLICY" },
              " to ",
              { code: "Ignore" },
              " makes Karpenter’s scheduler ignore preferences, at launch as well.",
            ],
            [
              { b: "The timer never runs out." },
              " Pods change faster than ",
              { code: "consolidateAfter" },
              ", so it keeps resetting, or it’s set to ",
              { code: "Never" },
              ".",
            ],
            [
              { b: "The policy rules the node out." },
              " It’s ",
              { code: "WhenEmpty" },
              " and the node runs workload pods, or ",
              { code: "Balanced" },
              " scored the move as not worth it.",
            ],
            [
              { b: "The node is spot." },
              " Consolidation can delete ",
              { a: "spot", href: "/learn/glossary/spot-instance" },
              " nodes by default. Replacing one with a cheaper spot node needs the alpha ",
              { code: "SpotToSpotConsolidation" },
              " feature gate, off by default. A one-for-one spot swap also needs at least 15 instance types to choose from.",
            ],
            [
              { b: "Requests fill the nodes." },
              " No node has room for another node’s pods, and no single cheaper node fits them either.",
            ],
          ],
        },
      ],
    },
    {
      id: "requests-decide-how-many-nodes-consolidation-can",
      title: "Set requests near use",
      blocks: [
        {
          kind: "callout",
          label: "Worked example",
          text: [
            "Take the first section’s NodePool and bring the ",
            { a: "requests", href: "/learn/glossary/kubernetes-resource-requests" },
            " near use: 0.8 CPU per node’s worth of pods. All the pods then request 3 × 0.8 = 2.4 CPU. That fits on one node, with 4 − 2.4 = 1.6 CPU to spare.",
          ],
        },
        {
          kind: "p",
          text: "Under the default policy, Karpenter can now remove two nodes. They go one at a time, because the default 10% budget allows one node on a 3-node NodePool.",
        },
        { kind: "svg", figure: figure3 },
        {
          kind: "p",
          text: "Requests set too low cause the opposite problem. Karpenter packs too many pods onto one node, where they compete for CPU. A pod using more memory than it requested is likely to be evicted when the node runs short of memory.",
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
          text: "Karpenter picks and removes machines by pod requests, but it doesn’t change the requests. Coral rebalances them to measured use, plus headroom. For a workload with a CPU-based Horizontal Pod Autoscaler (HPA), it picks the CPU request by replaying past load through the HPA’s own settings.",
        },
        {
          kind: "p",
          text: "The same Karpenter can then run fewer or smaller nodes. Request changes start only when you switch on “Automatically optimize” for a policy or a workload. Pods resize in place on Kubernetes 1.33 and later nodes. On older nodes they restart one at a time, within their PDBs.",
        },
        {
          kind: "p",
          text: [
            "Coral leaves the pools Karpenter consolidates to Karpenter and never changes your Karpenter settings, as ",
            { a: "Coral works with Karpenter", href: "/coral-works-with-karpenter" },
            " explains. On an EKS cluster with no autoscaler, connecting Coral can set up Karpenter, with your approval.",
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
            "The ",
            { a: "Kubernetes cost optimization guide", href: "/kubernetes-cost-optimization" },
            " gives the order of rebalancing and node removal.",
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
      publisher: "Karpenter",
      title: "“Disruption”",
      url: "https://karpenter.sh/docs/concepts/disruption/",
    },
    {
      publisher: "Karpenter",
      title: "“Disruption”",
      url: "https://karpenter.sh/v1.14/concepts/disruption/",
      note: " (v1.14)",
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
      title: "What is Karpenter in Kubernetes?",
      where: "Learn",
      href: "/learn/what-is-karpenter",
    },
    {
      title: "Karpenter cost optimization",
      where: "Learn",
      href: "/learn/karpenter-cost-optimization",
    },
    {
      title: "Pod disruption budget best practices",
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
  relatedTitle: "More on Karpenter and draining nodes",
};
