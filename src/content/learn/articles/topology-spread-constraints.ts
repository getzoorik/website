import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/topology-spread-constraints/1";
import { figure as figure2 } from "@/features/learn/figures/topology-spread-constraints/2";
import { figure as figure3 } from "@/features/learn/figures/topology-spread-constraints/3";

export const article: Article = {
  slug: "topology-spread-constraints",
  title: "Topology spread constraints: maxSkew and scale-down",
  meta: "Topology spread constraints set how unevenly pods may sit across zones and nodes. How maxSkew and whenUnsatisfiable work, and when a rule holds a node.",
  h1: "Topology spread constraints: maxSkew, zones and scale-down",
  deck: "What maxSkew, whenUnsatisfiable and minDomains do, how spread differs from anti-affinity, and when a rule holds a node.",
  card: "How maxSkew and whenUnsatisfiable spread pods across zones and nodes, and when a spread rule keeps a node.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Node lifecycle and scheduling",
  published: "2026-11-01",
  updated: "2026-11-01",
  author: "harsh",
  cover: "/learn-covers/zoorik-learn-topology-spread-constraints-1200x630.webp",
  coverAlt:
    "Topology spread constraints: pods spread over zone A, B and C, and the next pod goes to zone C, which has the fewest",
  short: [
    "Topology spread constraints tell the kube-scheduler how unevenly pods may sit across zones or nodes, with ",
    { code: "maxSkew" },
    " as the largest allowed gap between domains. If no node fits within it, ",
    { code: "DoNotSchedule" },
    " leaves the pod Pending and can block scale-down, while ",
    { code: "ScheduleAnyway" },
    " places it and only prefers the better spread.",
  ],
  sections: [
    {
      id: "topology-spread-constraints",
      title: "How topology spread constraints decide where a pod goes",
      blocks: [
        {
          kind: "p",
          text: [
            "In the Kubernetes docs’ example, zone A holds 2 matching pods and zone B holds 1, under a ",
            { code: "maxSkew" },
            " of 1 and ",
            { code: "DoNotSchedule" },
            ". A new pod in zone A would make the counts 3 and 1, a skew of 2. So the pod can only go to zone B.",
          ],
        },
        {
          kind: "p",
          text: "If zone B has no room, the pod stays Pending, however much room zone A has. A drain runs the same count for every evicted pod, so a spread rule can also keep a node, and its cost, in your cluster.",
        },
        {
          kind: "p",
          text: [
            "Pod topology spread constraints live in the pod’s ",
            { code: "spec.topologySpreadConstraints" },
            ", which for a Deployment means its pod template. Each entry names a node label as its ",
            { code: "topologyKey" },
            ". Nodes that share a value of that label form one domain: each zone for ",
            { code: "topology.kubernetes.io/zone" },
            ", each node for ",
            { code: "kubernetes.io/hostname" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "Nodes without the label are skipped, both in the count and as places to run the pod.",
        },
        {
          kind: "h3",
          id: "maxskew-and-the-global-minimum",
          title: "maxSkew and the global minimum",
        },
        {
          kind: "p",
          text: [
            "With ",
            { code: "DoNotSchedule" },
            ", the scheduler checks each candidate node. It adds the new pod to that node’s domain count, then subtracts the global minimum: the lowest count in any eligible domain. A node whose result is above ",
            { code: "maxSkew" },
            " is filtered out.",
          ],
        },
        {
          kind: "p",
          text: "In the docs’ example that minimum is 1, in zone B. Zone A gives 2 (2 + 1 − 1), above the limit. Zone B gives 1 (1 + 1 − 1), which is allowed.",
        },
        { kind: "svg", figure: figure1 },
        { kind: "p", text: ["With a ", { code: "maxSkew" }, " of 2, either zone works."] },
        {
          kind: "h3",
          id: "whenunsatisfiable-donotschedule-or-scheduleanyway",
          title: "whenUnsatisfiable: DoNotSchedule or ScheduleAnyway",
        },
        {
          kind: "p",
          text: [
            { code: "DoNotSchedule" },
            " is a hard rule. If no node keeps the skew within ",
            { code: "maxSkew" },
            ", the pod stays Pending. Its FailedScheduling event gives the reason “node(s) didn’t match pod topology spread constraints”.",
          ],
        },
        {
          kind: "p",
          text: [
            { code: "ScheduleAnyway" },
            " is a preference. Kube-scheduler still places the pod, and gives priority to nodes that reduce the skew. The EKS best practices guide advises the hard setting only if it’s better for pods not to run than to break the spread.",
          ],
        },
        {
          kind: "h3",
          id: "the-fields-and-a-deployment-that-uses",
          title: "The fields, and a Deployment that uses them",
        },
        {
          kind: "table",
          columns: [
            { label: "Field", width: "14%" },
            { label: "What it does", width: "86%" },
          ],
          rows: [
            [
              [{ code: "maxSkew" }],
              "How far a domain’s count of matching pods may run ahead of the lowest count. Must be greater than 0.",
            ],
            [[{ code: "topologyKey" }], "The node label that defines a domain."],
            [
              [{ code: "whenUnsatisfiable" }],
              [
                { code: "DoNotSchedule" },
                " makes the rule a filter, so the pod waits. ",
                { code: "ScheduleAnyway" },
                " makes it a score, so the pod lands.",
              ],
            ],
            [
              [{ code: "labelSelector" }],
              "Which pods are counted. Only pods in the incoming pod’s own namespace count.",
            ],
            [
              [{ code: "minDomains" }],
              [
                "How many domains to expect. With fewer, the lowest count is taken as 0. ",
                { code: "DoNotSchedule" },
                " only, and no feature gate needed from Kubernetes 1.30.",
              ],
            ],
            [
              [{ code: "matchLabelKeys" }],
              "Label keys whose values are copied from the incoming pod into the selector. Beta, on by default since 1.27.",
            ],
            [
              [{ code: "nodeAffinityPolicy" }],
              [
                { code: "Honor" },
                ", the default, counts only nodes that match the pod’s node affinity or nodeSelector. Stable since 1.33.",
              ],
            ],
            [
              [{ code: "nodeTaintsPolicy" }],
              [
                { code: "Ignore" },
                ", the default, counts every node. ",
                { code: "Honor" },
                " leaves out nodes with taints the pod doesn’t tolerate. Stable since 1.33.",
              ],
            ],
          ],
        },
        {
          kind: "p",
          text: "Entries combine with a logical AND, so a node must satisfy every one. Below, a Deployment keeps the zone counts of its 6\u00a0replicas within 1 of each other as pods are placed. Its second entry prefers to spread them across nodes.",
        },
        {
          kind: "code",
          lang: "yaml",
          code: "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: web\nspec:\n  replicas: 6\n  selector:\n    matchLabels:\n      app: web\n  template:\n    metadata:\n      labels:\n        app: web\n    spec:\n      topologySpreadConstraints:\n      - maxSkew: 1\n        topologyKey: topology.kubernetes.io/zone\n        whenUnsatisfiable: DoNotSchedule\n        labelSelector:\n          matchLabels:\n            app: web\n        matchLabelKeys:\n        - pod-template-hash\n        nodeTaintsPolicy: Honor\n      - maxSkew: 1\n        topologyKey: kubernetes.io/hostname\n        whenUnsatisfiable: ScheduleAnyway\n        labelSelector:\n          matchLabels:\n            app: web\n      containers:\n      - name: web\n        image: <image>",
        },
        {
          kind: "p",
          text: "Both selectors match the pod’s own labels on purpose. A pod outside its own selector doesn’t count itself. Such “ghost pods” can pile up in one domain, the docs warn.",
        },
        {
          kind: "p",
          text: [
            { code: "pod-template-hash" },
            " is the label the Deployment controller adds per revision, so each revision spreads on its own during a rollout.",
          ],
        },
      ],
    },
    {
      id: "pods-get-a-soft-spread-even-without",
      title: "Pods get a soft spread even without a rule",
      blocks: [
        {
          kind: "p",
          text: [
            "With no cluster defaults set, kube-scheduler acts as if each pod without its own constraints had two soft ones. They are maxSkew 3 on ",
            { code: "kubernetes.io/hostname" },
            " and maxSkew 5 on ",
            { code: "topology.kubernetes.io/zone" },
            ", both ",
            { code: "ScheduleAnyway" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "These built-in defaults have been stable since Kubernetes 1.24. They apply only to pods that belong to a Service, ReplicaSet, StatefulSet or ReplicationController. A scheduler profile can replace them through the PodTopologySpread plugin’s arguments.",
        },
        {
          kind: "h3",
          id: "topology-spread-constraints-on-aks",
          title: "Topology spread constraints on AKS",
        },
        {
          kind: "p",
          text: [
            "AKS tightens the zone default. Microsoft’s zone resiliency guidance says that from Kubernetes 1.33, the AKS default scheduler uses maxSkew 1 for ",
            { code: "topology.kubernetes.io/zone" },
            ". The rule is still ",
            { code: "ScheduleAnyway" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "Set your own constraints in the pod spec where a workload needs more.",
        },
        {
          kind: "p",
          text: "A strict zone rule can leave pods Pending even after a scale-up, the same page explains. The Cluster Autoscaler “isn’t zone-aware”. Virtual Machine Scale Sets pick the zone for a new node in a pool that spans zones.",
        },
        {
          kind: "p",
          text: [
            "So a scale-up can add a node in a zone that still breaks a ",
            { code: "DoNotSchedule" },
            " rule. Microsoft’s answer is one node pool per zone, with ",
            { code: "--balance-similar-node-groups" },
            " set to true.",
          ],
        },
        {
          kind: "p",
          text: "That flag balances the pools only at scale-up, the Cluster Autoscaler FAQ notes. Scale-down ignores their relative sizes.",
        },
      ],
    },
    {
      id: "topology-spread-constraints-vs-anti-affinity-spread",
      title: "Topology spread constraints vs anti-affinity: spread allows a bounded gap",
      blocks: [
        {
          kind: "p",
          text: "Pod anti-affinity also keeps replicas apart, but it only asks whether a domain already holds a matching pod. The Kubernetes docs state the limit: a required rule allows only a single pod in each topology domain. A preferred rule gives up the ability to enforce it.",
        },
        {
          kind: "p",
          text: [
            "A spread constraint sets a bounded gap instead. A zone or node can hold several replicas, as long as none runs more than ",
            { code: "maxSkew" },
            " ahead of the lowest.",
          ],
        },
        {
          kind: "p",
          text: "The difference shows when nodes go. Take 3\u00a0replicas on a 3-node pool.",
        },
        {
          kind: "p",
          text: [
            "With required anti-affinity on ",
            { code: "kubernetes.io/hostname" },
            ", each replica needs a node to itself. So the pool can’t go below 3\u00a0nodes, however little the replicas request.",
          ],
        },
        {
          kind: "p",
          text: [
            "Use a hostname spread instead, with a ",
            { code: "maxSkew" },
            " of 1, ",
            { code: "DoNotSchedule" },
            " and ",
            { code: "nodeTaintsPolicy" },
            " set to ",
            { code: "Honor" },
            ". When the third node is drained, its replica can join one of the other two. Counts of 2 and 1 are within the limit.",
          ],
        },
        {
          kind: "p",
          text: [
            "Without ",
            { code: "Honor" },
            ", the draining node still counts with 0\u00a0pods, as the scale-down section below explains. Both rules spread replicas when there’s room. Only the spread constraint lets this pool go from 3\u00a0nodes to 2.",
          ],
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "callout",
          label: "Rule of thumb",
          text: "With more replicas than domains, prefer a spread constraint to required anti-affinity. Keep required anti-affinity for cases where two replicas in one domain would be unsafe.",
        },
        {
          kind: "p",
          text: [
            { a: "Pod affinity vs node affinity", href: "/learn/pod-affinity-vs-node-affinity" },
            " covers the affinity rules themselves.",
          ],
        },
      ],
    },
    {
      id: "a-hard-spread-rule-can-keep-a",
      title: "A hard spread rule can keep a node from scaling down",
      blocks: [
        {
          kind: "p",
          text: "The Cluster Autoscaler simulates kube-scheduler behavior, its FAQ says. In the FAQ’s words, “if there’s no other node where a given pod can schedule, the pod’s node won’t be scaled down.”",
        },
        {
          kind: "p",
          text: [
            "Spread is part of that decision. A ",
            { code: "DoNotSchedule" },
            " rule narrows where each evicted pod may go. The node stays when that narrow set is full.",
          ],
        },
        {
          kind: "h3",
          id: "when-the-only-allowed-zone-is-full",
          title: "When the only allowed zone is full",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "Take the 6-replica Deployment above, spread 2, 2 and 2 across zones A, B and C. Zone C has two nodes, and node c2 holds one replica and little else.",
        },
        {
          kind: "p",
          text: [
            "With that replica evicted, the counts are 2, 2 and 1, so the global minimum is 1, in zone C. Zone A or B would give 2 (2 + 1 − 1), above a ",
            { code: "maxSkew" },
            " of 1. Only zone C passes, with 1 (1 + 1 − 1).",
          ],
        },
        {
          kind: "p",
          text: "So free room in zones A and B doesn’t help. If c1, the other node in zone C, has no room for the pod’s requests, c2 stays.",
        },
        { kind: "svg", figure: figure3 },
        {
          kind: "p",
          text: [
            "With an even spread and a ",
            { code: "maxSkew" },
            " of 1, every evicted pod must go back to its own zone. So draining a node needs spare room in that zone. With a ",
            { code: "maxSkew" },
            " of 2, the other zones pass too, at the price of a less even spread.",
          ],
        },
        { kind: "h3", id: "taints-on-a-draining-node", title: "Taints on a draining node" },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            "Under the default ",
            { code: "nodeTaintsPolicy" },
            ", a hostname rule can leave an evicted pod Pending until its old node is deleted. A node being drained carries a taint:",
          ],
        },
        {
          kind: "ul",
          items: [
            "Cordoning puts an unschedulable taint on the node.",
            "The Cluster Autoscaler taints the nodes it removes.",
            ["Karpenter adds ", { code: "karpenter.sh/disrupted:NoSchedule" }, "."],
          ],
        },
        {
          kind: "p",
          text: "The default ignores taints in the count. The draining node then stays in the skew with zero matching pods, and can pull the global minimum to 0. Kubernetes issue 106127 reports this during node upgrades.",
        },
        {
          kind: "p",
          text: [
            "Setting ",
            { code: "nodeTaintsPolicy" },
            " to ",
            { code: "Honor" },
            " leaves untolerated tainted nodes out of the count.",
          ],
        },
        {
          kind: "h3",
          id: "when-a-zone-loses-its-last-node",
          title: "When a zone loses its last node",
        },
        {
          kind: "p",
          text: "The scheduler learns domains only from nodes that exist. Once the last node in zone C goes, zone C no longer counts as a domain. Its replicas then fit the rule in zones A and B, and the workload ends up in two zones with no error.",
        },
        {
          kind: "p",
          text: [
            "If that isn’t acceptable, set ",
            { code: "minDomains" },
            " to 3. With fewer than 3 eligible zones, the global minimum is taken as 0, so the evicted pods wait for a node in a third zone.",
          ],
        },
        {
          kind: "p",
          text: "An autoscaler that simulates the scheduler then keeps the last zone-C node. The EKS guide suggests the same field for zones that have no nodes yet.",
        },
        { kind: "h3", id: "when-a-deployment-scales-down", title: "When a Deployment scales down" },
        {
          kind: "p",
          text: [
            "The docs warn there’s no guarantee the constraints stay satisfied when pods are removed. They point to the ",
            { a: "Descheduler", href: "/learn/kubernetes-descheduler" },
            " to rebalance the spread.",
          ],
        },
        {
          kind: "p",
          text: [
            {
              a: "Cluster Autoscaler not scaling down",
              href: "/learn/cluster-autoscaler-not-scaling-down",
            },
            " lists the other reasons a node stays. ",
            { a: "Kubernetes bin packing", href: "/learn/kubernetes-bin-packing" },
            " covers how requests decide how many nodes the pods fill.",
          ],
        },
      ],
    },
    {
      id: "topology-spread-constraints-with-karpenter-a-soft",
      title: "Topology spread constraints with Karpenter: a soft rule can still hold a node",
      blocks: [
        {
          kind: "p",
          text: [
            "Karpenter reads spread constraints when it launches nodes. Its docs list three supported ",
            { code: "topologyKey" },
            " values:",
          ],
        },
        {
          kind: "ul",
          items: [
            [{ code: "topology.kubernetes.io/zone" }],
            [{ code: "kubernetes.io/hostname" }],
            [{ code: "karpenter.sh/capacity-type" }],
          ],
        },
        {
          kind: "p",
          text: "NodePools don’t balance zones by themselves, so zone balance comes from zonal constraints on your pods. The EKS data plane guide says EKS Auto Mode and Karpenter both launch nodes in the right Availability Zones to meet them.",
        },
        {
          kind: "p",
          text: [
            "On AKS, ",
            { a: "node auto-provisioning (NAP)", href: "/learn/aks-node-auto-provisioning" },
            " runs Karpenter too.",
          ],
        },
        {
          kind: "p",
          text: [
            "Kube-scheduler only prefers a ",
            { code: "ScheduleAnyway" },
            " spread. Karpenter treats preferences, spread among them, as requirements in most circumstances. It relaxes them one at a time, only when they can’t be met.",
          ],
        },
        {
          kind: "p",
          text: "Its docs warn that a preferred spread can create more nodes than you expect. They also say consolidation “may not disrupt nodes in order to avoid violating preferences, even if kube-scheduler can fit the host pods elsewhere.”",
        },
        {
          kind: "p",
          text: [
            { a: "Karpenter consolidation", href: "/learn/karpenter-consolidation" },
            " covers the rest of that decision.",
          ],
        },
      ],
    },
    {
      id: "spread-settings-that-still-let-nodes-go",
      title: "Spread settings that still let nodes go",
      blocks: [
        {
          kind: "p",
          text: [
            "Spread rules help decide which nodes can be removed, so they are part of ",
            { a: "Kubernetes cost optimization", href: "/kubernetes-cost-optimization" },
            ".",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              "Make zone spread hard only where an uneven spread is worse than a Pending pod, as the EKS guide advises. Keep node-level spread on ",
              { code: "ScheduleAnyway" },
              ".",
            ],
            [
              "Leave spare room in each zone under a hard zone rule, or use a ",
              { code: "maxSkew" },
              " of 2 so an evicted pod can change zones.",
            ],
            [
              "Set ",
              { code: "nodeTaintsPolicy" },
              " to ",
              { code: "Honor" },
              " on Kubernetes 1.33 or later, so a draining node doesn’t hold the global minimum at 0.",
            ],
            [
              "Set ",
              { code: "minDomains" },
              " to your zone count only when running in fewer zones isn’t acceptable. Accept that a node per zone then stays for that workload.",
            ],
            [
              "Match each ",
              { code: "labelSelector" },
              " to the pod template’s labels. For Deployments, add ",
              { code: "pod-template-hash" },
              " to ",
              { code: "matchLabelKeys" },
              ".",
            ],
          ],
        },
      ],
    },
    {
      id: "how-coral-checks-spread-before-it-drains",
      title: "How Coral checks spread before it drains a node",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " optimizes Kubernetes on AKS and EKS. It rebalances CPU and memory requests, and it drains spare nodes so your autoscaler can remove them. Spread rules sit inside that drain decision.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "The check." },
              " Before draining, Coral simulates the scheduler on the live cluster. Every pod it has to move must fit elsewhere, with its affinity, taints, spread, ports and zones. If one pod has nowhere to go, the node isn’t drained.",
            ],
            [
              { b: "The drain." },
              " Coral respects PodDisruptionBudgets and do-not-disrupt. In consolidation it also respects your autoscaler’s minimum pool size, and every pool keeps at least one node. Nodes drain one at a time, and a drain that can’t finish in time puts the node back into service.",
            ],
            [
              { b: "The warning." },
              " The Optimization constraints page lists workload setups that make optimization risky, topology spread among them, with the fix for each. It’s advisory only. Setting the ",
              { code: "coral.zoorik.com/ignore-optimization-constraints" },
              " annotation to ",
              { code: '"true"' },
              " on a pod template hides a workload from that page only.",
            ],
          ],
        },
        {
          kind: "p",
          text: "Where requests sit above real use, rebalancing them leaves more room on each node. Room in the right zone is what a hard spread rule needs before a node can go.",
        },
        {
          kind: "p",
          text: [
            "A floor set by ",
            { code: "minDomains" },
            " or required anti-affinity comes from the rule itself, so it stays until you change the rule. For the detail, see the ",
            { a: "Coral FAQ", href: "/coral-faq#how-do-you-make-sure-node" },
            " and the guide’s ",
            { a: "consolidation", href: "/coral-guide#consolidation" },
            " section.",
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
      title: "“Pod Topology Spread Constraints”",
      url: "https://kubernetes.io/docs/concepts/scheduling-eviction/topology-spread-constraints/",
    },
    {
      publisher: "Kubernetes",
      title: "“scheduler/framework/plugins/podtopologyspread”",
      url: "https://github.com/kubernetes/kubernetes/tree/master/pkg/scheduler/framework/plugins/podtopologyspread",
      note: " (scheduler source: filtering.go, common.go, plugin.go)",
    },
    {
      publisher: "Kubernetes, issue 106127",
      title: "“Take taints/tolerations into consideration when calculating PodTopologySpread skew”",
      url: "https://github.com/kubernetes/kubernetes/issues/106127",
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
      publisher: "Karpenter",
      title: "“Disruption”",
      url: "https://karpenter.sh/docs/concepts/disruption/",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Zone resiliency recommendations for Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/reliability-zone-resiliency-recommendations",
    },
    {
      publisher: "AWS",
      title: "“EKS Data Plane”",
      url: "https://docs.aws.amazon.com/eks/latest/best-practices/data-plane.html",
      note: " (EKS best practices guide)",
    },
  ],
  related: [
    {
      title: "Pod affinity vs node affinity: what each rule decides",
      where: "Learn",
      href: "/learn/pod-affinity-vs-node-affinity",
    },
    {
      title: "Cluster Autoscaler not scaling down: what keeps nodes running",
      where: "Learn",
      href: "/learn/cluster-autoscaler-not-scaling-down",
    },
    {
      title: "Karpenter consolidation: policies, budgets and limits",
      where: "Learn",
      href: "/learn/karpenter-consolidation",
    },
    {
      title: "Kubernetes bin packing: fewer nodes for the same pods",
      where: "Learn",
      href: "/learn/kubernetes-bin-packing",
    },
    {
      title: "Kubernetes descheduler: what it moves and when to use it",
      where: "Learn",
      href: "/learn/kubernetes-descheduler",
    },
  ],
};
