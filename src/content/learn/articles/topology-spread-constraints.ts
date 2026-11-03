import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/topology-spread-constraints/1";
import { figure as figure2 } from "@/features/learn/figures/topology-spread-constraints/2";
import { figure as figure3 } from "@/features/learn/figures/topology-spread-constraints/3";

export const article: Article = {
  slug: "topology-spread-constraints",
  title: "Kubernetes topologySpreadConstraints and maxSkew",
  meta: "How Kubernetes topologySpreadConstraints work: maxSkew, topologyKey and whenUnsatisfiable, a YAML example, and when a spread rule blocks scale-down.",
  h1: "Kubernetes topologySpreadConstraints",
  deck: "Evicted pods are scheduled again under the same spread rule, so the rule helps decide which nodes can go.",
  card: "How maxSkew and whenUnsatisfiable spread pods across zones and nodes, and when a spread rule keeps a node.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Node lifecycle and scheduling",
  published: "2026-11-01",
  updated: "2026-11-03",
  author: "harsh",
  cover: "/learn-covers/zoorik-learn-topology-spread-constraints-1200x630.webp",
  coverAlt:
    "Pods spread over zones A, B and C, and the next pod goes to zone C, which has the fewest",
  short: [
    { code: "topologySpreadConstraints" },
    " is a pod spec field that tells kube-scheduler how evenly to spread matching pods across zones, nodes or other domains. ",
    { code: "maxSkew" },
    " is the largest gap allowed between a domain’s pod count and the lowest count. If no node keeps the gap within it, ",
    { code: "DoNotSchedule" },
    " leaves the pod Pending and can block scale-down. ",
    { code: "ScheduleAnyway" },
    " places the pod and only prefers the better spread.",
  ],
  sections: [
    {
      id: "topology-spread-constraints",
      title: "How spread constraints work",
      blocks: [
        {
          kind: "p",
          text: [
            "The constraints live in the pod’s ",
            { code: "spec.topologySpreadConstraints" },
            ": for a Deployment, in its pod template. Each entry names a node label as its ",
            { code: "topologyKey" },
            ". Nodes with the same value of that label form one domain: each zone for ",
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
          id: "the-fields-and-a-deployment-that-uses",
          title: "Fields and example YAML",
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
          text: "Entries combine with a logical AND, so a node must satisfy every one. The Deployment below keeps the zone counts of its 6\u00a0replicas within 1 of each other as pods are placed. Its second entry prefers to spread them across nodes.",
        },
        {
          kind: "code",
          lang: "yaml",
          code: "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: web\nspec:\n  replicas: 6\n  selector:\n    matchLabels:\n      app: web\n  template:\n    metadata:\n      labels:\n        app: web\n    spec:\n      topologySpreadConstraints:\n      - maxSkew: 1\n        topologyKey: topology.kubernetes.io/zone\n        whenUnsatisfiable: DoNotSchedule\n        labelSelector:\n          matchLabels:\n            app: web\n        matchLabelKeys:\n        - pod-template-hash\n        nodeTaintsPolicy: Honor\n      - maxSkew: 1\n        topologyKey: kubernetes.io/hostname\n        whenUnsatisfiable: ScheduleAnyway\n        labelSelector:\n          matchLabels:\n            app: web\n      containers:\n      - name: web\n        image: <image>",
        },
        {
          kind: "p",
          text: "Both selectors match the pod’s own labels on purpose. A pod outside its own selector doesn’t count itself, and the docs warn that such “ghost pods” can pile up in one domain.",
        },
        {
          kind: "p",
          text: [
            "The Deployment controller adds ",
            { code: "pod-template-hash" },
            " per revision. With it in ",
            { code: "matchLabelKeys" },
            ", each revision spreads on its own during a rollout.",
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
            "Under ",
            { code: "DoNotSchedule" },
            ", the scheduler checks each candidate node. It adds the new pod to that node’s domain count, then subtracts the global minimum: the lowest count in any eligible domain. A node whose result is above ",
            { code: "maxSkew" },
            " is filtered out.",
          ],
        },
        {
          kind: "p",
          text: [
            "In the Kubernetes docs’ example, zone A holds 2 matching pods and zone B holds 1, with a ",
            { code: "maxSkew" },
            " of 1. The minimum is 1, in zone B. Zone A gives 2 (2 + 1 − 1), above the limit. Zone B gives 1 (1 + 1 − 1), so only zone B is allowed.",
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: [
            "If zone B has no room, the pod stays Pending, however much room zone A has. With a ",
            { code: "maxSkew" },
            " of 2, either zone works.",
          ],
        },
        {
          kind: "h3",
          id: "whenunsatisfiable-donotschedule-or-scheduleanyway",
          title: "DoNotSchedule vs ScheduleAnyway",
        },
        {
          kind: "p",
          text: [
            { code: "whenUnsatisfiable" },
            " sets what happens when no node fits. ",
            { code: "DoNotSchedule" },
            " is a hard rule: the pod stays Pending. Its FailedScheduling event gives the reason “node(s) didn’t match pod topology spread constraints”.",
          ],
        },
        {
          kind: "p",
          text: [
            { code: "ScheduleAnyway" },
            " is a preference. Kube-scheduler still places the pod, and gives priority to nodes that reduce the skew. The EKS best practices guide advises the hard setting only if it’s better for pods not to run than to break the spread.",
          ],
        },
      ],
    },
    {
      id: "pods-get-a-soft-spread-even-without",
      title: "Default constraints",
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
          title: "On AKS",
        },
        {
          kind: "p",
          text: [
            "AKS tightens the zone default. From Kubernetes 1.33, the AKS default scheduler uses maxSkew 1 for ",
            { code: "topology.kubernetes.io/zone" },
            ", still with ",
            { code: "ScheduleAnyway" },
            ". Set your own constraints in the pod spec where a workload needs more.",
          ],
        },
        {
          kind: "p",
          text: "A strict zone rule can leave pods Pending even after a scale-up. The Cluster Autoscaler “isn’t zone-aware”, Microsoft notes. In a pool that spans zones, Virtual Machine Scale Sets pick the new node’s zone.",
        },
        {
          kind: "p",
          text: [
            "So a scale-up can add a node in a zone that still breaks a ",
            { code: "DoNotSchedule" },
            " rule. Microsoft’s answer is one node pool per zone, with ",
            { code: "--balance-similar-node-groups" },
            " set to true. That flag balances the pools only at scale-up, the Cluster Autoscaler FAQ notes. Scale-down ignores their relative sizes.",
          ],
        },
      ],
    },
    {
      id: "topology-spread-constraints-vs-anti-affinity-spread",
      title: "Spread vs anti-affinity",
      blocks: [
        {
          kind: "p",
          text: "Pod anti-affinity also keeps replicas apart, but it only asks whether a domain already holds a matching pod. A required rule allows only one pod per topology domain, the Kubernetes docs note. A preferred rule can’t enforce it.",
        },
        {
          kind: "p",
          text: [
            "A spread constraint allows a bounded gap instead. A zone or node can hold several replicas, as long as none runs more than ",
            { code: "maxSkew" },
            " ahead of the lowest.",
          ],
        },
        {
          kind: "p",
          text: "The difference shows when nodes go. Take 3\u00a0replicas on a 3-node pool:",
        },
        {
          kind: "ul",
          items: [
            [
              "Required anti-affinity on ",
              { code: "kubernetes.io/hostname" },
              ": each replica needs a node to itself. The pool can’t go below 3\u00a0nodes, however little the replicas request.",
            ],
            [
              "A hostname spread (",
              { code: "maxSkew: 1" },
              ", ",
              { code: "DoNotSchedule" },
              ", ",
              { code: "nodeTaintsPolicy: Honor" },
              "): when node 3 is drained, its replica can join one of the other two. Counts of 2 and 1 are within the limit.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Without ",
            { code: "Honor" },
            ", the draining node still counts, with 0\u00a0pods, as the scale-down section explains. Both rules spread replicas when there’s room. Only the spread constraint lets this pool go from 3\u00a0nodes to 2.",
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
      title: "Spread and scale-down",
      blocks: [
        {
          kind: "p",
          text: "The Cluster Autoscaler simulates kube-scheduler. Its FAQ says that “if there’s no other node where a given pod can schedule, the pod’s node won’t be scaled down.”",
        },
        {
          kind: "p",
          text: [
            "Spread is part of that check. A ",
            { code: "DoNotSchedule" },
            " rule narrows where each evicted pod may go, and the node stays when that narrow set is full.",
          ],
        },
        {
          kind: "h3",
          id: "when-the-only-allowed-zone-is-full",
          title: "When the allowed zone is full",
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
            " of 1, every evicted pod must go back to its own zone. So draining a node needs spare room in that zone. A ",
            { code: "maxSkew" },
            " of 2 lets the other zones pass too, at the price of a less even spread.",
          ],
        },
        { kind: "h3", id: "taints-on-a-draining-node", title: "Taints on a draining node" },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            "Under the default ",
            { code: "nodeTaintsPolicy" },
            ", a hostname rule can leave an evicted pod Pending until its old node is deleted.",
          ],
        },
        {
          kind: "p",
          text: [
            "A node being drained carries a ",
            { a: "taint", href: "/learn/kubernetes-taints-and-tolerations" },
            ":",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { a: "Cordoning", href: "/learn/cordon-vs-drain" },
              " puts an unschedulable taint on the node.",
            ],
            "The Cluster Autoscaler taints the nodes it removes.",
            ["Karpenter adds ", { code: "karpenter.sh/disrupted:NoSchedule" }, "."],
          ],
        },
        {
          kind: "p",
          text: "The default ignores taints in the count. So the draining node stays in the skew with zero matching pods, and can pull the global minimum to 0. Kubernetes issue 106127 reports this during node upgrades.",
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
      title: "Spread with Karpenter",
      blocks: [
        {
          kind: "p",
          text: [
            "Karpenter reads spread constraints when it launches nodes. It supports three ",
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
          text: "NodePools don’t balance zones by themselves, so zone balance comes from zonal constraints on your pods. EKS Auto Mode and Karpenter both launch nodes in the right Availability Zones to meet them, the EKS guide says.",
        },
        {
          kind: "p",
          text: [
            "On AKS, ",
            { a: "node auto provisioning (NAP)", href: "/learn/aks-node-auto-provisioning" },
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
          text: "So a preferred spread can create more nodes than you expect, its docs note. They also say consolidation “may not disrupt nodes in order to avoid violating preferences, even if kube-scheduler can fit the host pods elsewhere.”",
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
      title: "Settings that let nodes go",
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
      title: "How Coral handles spread",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " optimizes Kubernetes on AKS and EKS. It rebalances CPU and memory requests, and it drains and removes the nodes you don’t need. Spread rules are part of each drain decision.",
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
              " Coral respects PodDisruptionBudgets and do-not-disrupt, and drains one node at a time. A drain that can’t finish in time puts the node back into service.",
            ],
            [
              { b: "The pool minimum." },
              " By default, Coral may reduce a pool’s minimum when that minimum alone keeps a node it has emptied. Disconnect puts the old minimum back. Every pool keeps at least one node.",
            ],
            [
              { b: "The warning." },
              " Coral flags workloads whose spread rules make optimization risky, with the fix for each. The warning is advisory only.",
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
    text: "Coral rebalances CPU and memory requests on AKS and EKS, works with your HPA, and removes the nodes you don’t need. We estimate 40–50% off AKS and EKS cost. It is an estimated range, not a promise. The free assessment works out your own figure.",
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
      title: "Kubernetes node affinity vs pod affinity",
      where: "Learn",
      href: "/learn/pod-affinity-vs-node-affinity",
    },
    {
      title: "Cluster Autoscaler not scaling down",
      where: "Learn",
      href: "/learn/cluster-autoscaler-not-scaling-down",
    },
    {
      title: "Karpenter consolidation",
      where: "Learn",
      href: "/learn/karpenter-consolidation",
    },
    {
      title: "Kubernetes bin packing",
      where: "Learn",
      href: "/learn/kubernetes-bin-packing",
    },
    {
      title: "Kubernetes descheduler",
      where: "Learn",
      href: "/learn/kubernetes-descheduler",
    },
  ],
  relatedTitle: "More on pod spread, placement and scale-down",
};
