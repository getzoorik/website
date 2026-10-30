import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/topology-spread-constraints/1";

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
  published: "2026-11-20",
  updated: "2026-11-20",
  author: "harsh",
  short: [
    "Topology spread constraints tell the kube-scheduler how unevenly a group of pods may sit across topology domains, such as zones or nodes. ",
    { code: "maxSkew" },
    " is how far any domain’s count of matching pods may run ahead of the lowest count, and ",
    { code: "whenUnsatisfiable" },
    " decides what happens when no node keeps within it: ",
    { code: "DoNotSchedule" },
    " leaves the pod Pending, while ",
    { code: "ScheduleAnyway" },
    " places it and only prefers the better spread. A hard rule can also keep a node from being removed.",
  ],
  sections: [
    {
      id: "how-topology-spread-constraints-work",
      title: "How topology spread constraints work",
      blocks: [
        {
          kind: "p",
          text: [
            "Pod topology spread constraints live in the pod’s ",
            { code: "spec.topologySpreadConstraints" },
            ", which for a Deployment means its pod template. Each entry names a node label as its ",
            { code: "topologyKey" },
            ", and nodes that share a value of that label form one domain: each zone for ",
            { code: "topology.kubernetes.io/zone" },
            ", each node for ",
            { code: "kubernetes.io/hostname" },
            ". Nodes without the label are skipped, both in the count and as places to run the pod.",
          ],
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
          text: "The entries are combined with a logical AND, so a node has to satisfy every one of them.",
        },
        {
          kind: "p",
          text: "This Deployment keeps the zone counts of its 6\u00a0replicas within 1 of each other as pods are placed, and prefers to spread them across nodes:",
        },
        {
          kind: "code",
          lang: "yaml",
          code: "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: web\nspec:\n  replicas: 6\n  selector:\n    matchLabels:\n      app: web\n  template:\n    metadata:\n      labels:\n        app: web\n    spec:\n      topologySpreadConstraints:\n      - maxSkew: 1\n        topologyKey: topology.kubernetes.io/zone\n        whenUnsatisfiable: DoNotSchedule\n        labelSelector:\n          matchLabels:\n            app: web\n        matchLabelKeys:\n        - pod-template-hash\n        nodeTaintsPolicy: Honor\n      - maxSkew: 1\n        topologyKey: kubernetes.io/hostname\n        whenUnsatisfiable: ScheduleAnyway\n        labelSelector:\n          matchLabels:\n            app: web\n      containers:\n      - name: web\n        image: <image>",
        },
        {
          kind: "p",
          text: [
            "The selector matches the pod’s own labels on purpose. A pod outside its own selector doesn’t count itself, and the docs warn that such “ghost pods” can pile up in one domain. ",
            { code: "pod-template-hash" },
            " is the label the Deployment controller adds per revision, so each revision spreads on its own during a rollout.",
          ],
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
            ", the scheduler takes each candidate node, adds the new pod to its domain’s count, and subtracts the global minimum: the lowest count in any eligible domain. A node whose result is above ",
            { code: "maxSkew" },
            " is filtered out. In the docs’ example, zone A holds 2 matching pods and zone B holds 1. Placing a new pod in zone A would make the counts 3 and 1, a skew of 2, so with ",
            { code: "maxSkew: 1" },
            " the pod can only go to zone B. With ",
            { code: "maxSkew: 2" },
            ", either zone works.",
          ],
        },
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
            ", the pod stays Pending, and its FailedScheduling event gives the reason “node(s) didn’t match pod topology spread constraints”. ",
            { code: "ScheduleAnyway" },
            " is a preference. The scheduler still schedules the pod, and it gives priority to nodes that reduce the skew. The EKS best practices guide says to use the hard setting only if it’s better for pods not to run than to break the spread.",
          ],
        },
      ],
    },
    {
      id: "the-spread-you-get-without-writing-a",
      title: "The spread you get without writing a rule",
      blocks: [
        {
          kind: "p",
          text: [
            "A pod with no constraints of its own still gets spread. With no cluster defaults set, kube-scheduler acts as if every such pod had two soft constraints: maxSkew 3 on ",
            { code: "kubernetes.io/hostname" },
            " and maxSkew 5 on ",
            { code: "topology.kubernetes.io/zone" },
            ", both ",
            { code: "ScheduleAnyway" },
            ". These built-in defaults are stable since Kubernetes 1.24, and they apply only to pods that belong to a Service, ReplicaSet, StatefulSet or ReplicationController. A scheduler profile can replace them through the PodTopologySpread plugin’s arguments.",
          ],
        },
        {
          kind: "h3",
          id: "topology-spread-constraints-on-aks",
          title: "Topology spread constraints on AKS",
        },
        {
          kind: "p",
          text: [
            "AKS tightens the zone default. Microsoft’s zone resiliency guidance says that from Kubernetes 1.33 the default scheduler in AKS uses maxSkew 1 for ",
            { code: "topology.kubernetes.io/zone" },
            ", still with ",
            { code: "ScheduleAnyway" },
            ". Set your own constraints in the pod spec where a workload needs more.",
          ],
        },
        {
          kind: "p",
          text: [
            "Strict zone rules need care with the Cluster Autoscaler, the same page explains. The autoscaler “isn’t zone-aware”, and in a node pool that spans zones, Virtual Machine Scale Sets pick the zone for a new node. A scale-up can then add a node in a zone that still breaks a ",
            { code: "DoNotSchedule" },
            " rule, and the pods stay Pending. Microsoft’s answer is one node pool per zone, with ",
            { code: "--balance-similar-node-groups" },
            " set to true. That flag balances the pools only at scale-up, the Cluster Autoscaler FAQ notes, and scale-down ignores their relative sizes.",
          ],
        },
      ],
    },
    {
      id: "topology-spread-constraints-vs-anti-affinity",
      title: "Topology spread constraints vs anti-affinity",
      blocks: [
        {
          kind: "p",
          text: [
            "Pod anti-affinity also keeps replicas apart, but it only asks whether a domain already holds a matching pod. The Kubernetes docs put the limit plainly: a required anti-affinity rule allows only a single pod in each topology domain, and a preferred one gives up the ability to enforce the rule. A spread constraint sets a bounded gap instead, so a zone or node can hold several replicas as long as none runs more than ",
            { code: "maxSkew" },
            " ahead of the lowest.",
          ],
        },
        {
          kind: "p",
          text: [
            "The difference shows when nodes go. Take 3\u00a0replicas on a 3-node pool. With required anti-affinity on ",
            { code: "kubernetes.io/hostname" },
            ", each replica needs a node to itself, so the pool can’t go below 3\u00a0nodes, however little the replicas request. With a hostname spread of maxSkew 1, ",
            { code: "DoNotSchedule" },
            " and ",
            { code: "nodeTaintsPolicy: Honor" },
            ", the third node’s replica can join one of the other two when its node is drained, because counts of 2 and 1 are within the limit. Without ",
            { code: "Honor" },
            ", the draining node still counts with 0\u00a0pods, as the scale-down section below explains. Both rules spread replicas when there’s room, but only the spread constraint lets the pool shrink. Keep required anti-affinity for cases where two replicas in one domain would be unsafe. The ",
            { a: "pod affinity article", href: "/learn/pod-affinity-vs-node-affinity" },
            " covers the affinity rules themselves.",
          ],
        },
      ],
    },
    {
      id: "how-a-spread-rule-can-keep-a",
      title: "How a spread rule can keep a node from scaling down",
      blocks: [
        {
          kind: "p",
          text: [
            "An autoscaler scales a node down only when every pod it has to move can run elsewhere. The Cluster Autoscaler FAQ says it simulates kube-scheduler behavior, and “if there’s no other node where a given pod can schedule, the pod’s node won’t be scaled down.” Spread is part of that decision, so a ",
            { code: "DoNotSchedule" },
            " rule narrows where each evicted pod may go, and the node stays when that narrow set is full.",
          ],
        },
        {
          kind: "p",
          text: "Take the 6-replica Deployment above, spread 2, 2 and 2 across zones A, B and C. Zone C has two nodes, and node c2 holds one replica and little else. With that replica evicted, the counts are 2, 2 and 1, so zone C is the global minimum and the only zone the pod may join. Free room in zones A and B doesn’t help. If c1, the other node in zone C, has no room for the pod’s requests, c2 stays.",
        },
        { kind: "diagram", figure: figure1 },
        {
          kind: "p",
          text: [
            "The general rule follows from the arithmetic. With an even spread and ",
            { code: "maxSkew: 1" },
            ", every evicted pod has to go back to its own zone, so draining a node needs spare room in that same zone. With ",
            { code: "maxSkew: 2" },
            ", an evicted pod can also use another zone, at the price of a less even spread.",
          ],
        },
        { kind: "p", text: "Three more situations decide what a drain does:" },
        {
          kind: "ul",
          items: [
            [
              "The node is being drained. Cordoning puts an unschedulable taint on the node, the Cluster Autoscaler taints the nodes it removes, and Karpenter adds ",
              { code: "karpenter.sh/disrupted:NoSchedule" },
              ". Under the default ",
              { code: "nodeTaintsPolicy" },
              ", taints are ignored in the count. The draining node stays in the skew with zero matching pods, which for a hostname rule can pull the global minimum to 0 and leave the evicted pod Pending until the node is deleted. Kubernetes issue 106127 reports this during node upgrades. ",
              { code: "nodeTaintsPolicy: Honor" },
              " leaves untolerated tainted nodes out of the count.",
            ],
            [
              "It’s the last node in its zone. The scheduler learns domains only from nodes that exist, so once the last node in zone C goes, zone C drops out of the count and its replicas fit the rule in zones A and B. The workload ends up in two zones with no error. If that isn’t acceptable, set ",
              { code: "minDomains: 3" },
              ". With fewer than 3 eligible zones the global minimum is taken as 0, so the evicted pods wait for a node in a third zone, and an autoscaler that simulates the scheduler keeps the last zone-C node. The EKS guide suggests the same field for zones that have no nodes yet.",
            ],
            [
              "Replicas are removed. When a Deployment scales down, the docs warn there’s no guarantee the constraints stay satisfied, and they point to the ",
              { a: "Descheduler", href: "/learn/kubernetes-descheduler" },
              " to rebalance the spread.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            {
              a: "Cluster Autoscaler not scaling down",
              href: "/learn/cluster-autoscaler-not-scaling-down",
            },
            " lists the other reasons a node stays, and ",
            { a: "bin packing", href: "/learn/kubernetes-bin-packing" },
            " covers how requests decide how many nodes the pods fill.",
          ],
        },
      ],
    },
    {
      id: "topology-spread-constraints-with-karpenter",
      title: "Topology spread constraints with Karpenter",
      blocks: [
        {
          kind: "p",
          text: [
            "Karpenter reads spread constraints when it launches nodes, and its docs list three supported ",
            { code: "topologyKey" },
            " values: ",
            { code: "topology.kubernetes.io/zone" },
            ", ",
            { code: "kubernetes.io/hostname" },
            " and ",
            { code: "karpenter.sh/capacity-type" },
            ". NodePools don’t balance zones by themselves. Zonal constraints on your pods are how you get zone balance, and the EKS data plane guide says EKS Auto Mode and Karpenter both launch nodes in the right Availability Zones to meet them. On AKS, ",
            { a: "node auto-provisioning (NAP)", href: "/learn/aks-node-auto-provisioning" },
            " runs Karpenter too.",
          ],
        },
        {
          kind: "p",
          text: [
            "The difference from kube-scheduler is how Karpenter treats ",
            { code: "ScheduleAnyway" },
            ". It treats preferences, spread among them, as requirements in most circumstances, and relaxes them one at a time only when they can’t be met. Its docs warn that a preferred spread can create more nodes than you expect, and that consolidation “may not disrupt nodes in order to avoid violating preferences, even if kube-scheduler can fit the host pods elsewhere.” On Karpenter, a soft spread rule can still keep a node. ",
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
          kind: "ul",
          items: [
            [
              "Make zone spread hard only where an uneven spread is worse than a Pending pod, as the EKS guide advises. Keep node-level spread on ",
              { code: "ScheduleAnyway" },
              ".",
            ],
            [
              "Leave room in every zone. A hard zone rule with ",
              { code: "maxSkew: 1" },
              " on an even spread sends each evicted pod back to its own zone, and ",
              { code: "maxSkew: 2" },
              " gives it a choice.",
            ],
            [
              "Add ",
              { code: "nodeTaintsPolicy: Honor" },
              " on Kubernetes 1.33 or later, so a draining node doesn’t hold the global minimum at 0.",
            ],
            [
              "Set ",
              { code: "minDomains" },
              " to your zone count only when running in fewer zones isn’t acceptable, and accept that a node per zone stays for that workload.",
            ],
            [
              "Match each ",
              { code: "labelSelector" },
              " to the pod template’s labels, and add ",
              { code: "pod-template-hash" },
              " to ",
              { code: "matchLabelKeys" },
              " for Deployments.",
            ],
            "Prefer a spread constraint to required anti-affinity whenever you run more replicas than domains.",
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
            " optimizes Kubernetes on AKS and EKS. It rebalances CPU and memory requests, and it drains spare nodes so your autoscaler can remove them. Spread rules sit inside that drain decision:",
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
              " It respects PodDisruptionBudgets and do-not-disrupt. In consolidation it also respects your autoscaler’s minimum pool size, every pool keeps at least one node, nodes are drained one at a time, and a drain that can’t finish in 10\u00a0minutes puts the node back into service.",
            ],
            [
              { b: "The warning." },
              " The Optimization constraints page lists workload setups that make optimization risky, topology spread among them, with the fix for each. It’s advisory only. The ",
              { code: 'coral.zoorik.com/ignore-optimization-constraints: "true"' },
              " annotation on a pod template hides a workload from that page only.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Where requests sit above real use, rebalancing them leaves more room on each node, and room in the right zone is what a hard spread rule needs before a node can go. A floor set by ",
            { code: "minDomains" },
            " or required anti-affinity comes from the rule itself, so it stays until you change the rule. The ",
            { a: "Coral FAQ", href: "/coral/faq#how-do-you-make-sure-node" },
            " and the guide’s ",
            { a: "consolidation", href: "/coral/guide#consolidation" },
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
      { label: "Kubernetes cost optimization with Coral", href: "/coral" },
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
      title: "How do you make sure node consolidation doesn’t cause scheduling failures later?",
      where: "Coral FAQ",
      href: "/coral/faq#how-do-you-make-sure-node",
    },
  ],
};
