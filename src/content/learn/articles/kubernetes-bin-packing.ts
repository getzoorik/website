import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/kubernetes-bin-packing/1";
import { figure as figure2 } from "@/features/learn/figures/kubernetes-bin-packing/2";

export const article: Article = {
  slug: "kubernetes-bin-packing",
  title: "Kubernetes bin packing with MostAllocated",
  meta: "Kubernetes bin packing puts pods on as few nodes as requests allow. How MostAllocated works, how to set it on AKS and EKS, and what empties spare nodes.",
  h1: "Kubernetes bin packing",
  deck: "How the scheduler packs pods, how to enable it on AKS and EKS, and what empties spare nodes.",
  card: "How the scheduler packs pods by requests, how to turn on MostAllocated, and what empties spare nodes.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Node lifecycle and scheduling",
  published: "2026-11-01",
  updated: "2026-11-03",
  author: "rupesh",
  cover: "/learn-covers/zoorik-learn-kubernetes-bin-packing-1200x630.webp",
  coverAlt:
    "Kubernetes bin packing: spread pods hold every node, while packed pods leave one node empty that can be removed",
  short:
    "Kubernetes bin packing places pods on as few nodes as their requests allow, so spare nodes can be removed. The kube-scheduler spreads pods by default. Its MostAllocated strategy packs them instead, but it counts requests, not use, and never moves a running pod.",
  sections: [
    {
      id: "kubernetes-bin-packing",
      title: "Spread vs pack: an example",
      blocks: [
        {
          kind: "p",
          text: "Take three nodes with 4 CPU each for pods, and six pods that arrive one at a time, each requesting 1 CPU.",
        },
        {
          kind: "p",
          text: "The default, LeastAllocated, sends each pod to the node with the least requested so far. The pods land two per node. Every node is 50% requested, and none is empty.",
        },
        {
          kind: "p",
          text: "MostAllocated does the opposite. Four pods fill node-a, two go to node-b, and node-c stays empty, so an autoscaler can remove it.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "Now set each request to 300m, just above a 250m peak. The six pods request 1.8 CPU in all, so MostAllocated puts them all on node-a. Even if LeastAllocated spreads them two per node, each node is only 15% requested. The Cluster Autoscaler can remove two nodes either way, if the pods can move.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "what-is-bin-packing-in-kubernetes-a",
      title: "How the scheduler scores nodes",
      blocks: [
        {
          kind: "p",
          text: [
            "Bin packing is the classic problem of fitting items of different sizes into as few fixed-size bins as possible. In a cluster, the bins are nodes and the items are pods, sized by their CPU and memory ",
            { a: "requests", href: "/learn/glossary/kubernetes-resource-requests" },
            ".",
          ],
        },
        { kind: "p", text: "The kube-scheduler places each new pod once, in two phases:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Filtering" },
              " removes every node that can’t take the pod. NodeResourcesFit checks that the node has room for everything the pod requests. Other plugins check taints, affinity, ports and volumes.",
            ],
            [
              { b: "Scoring" },
              " ranks the nodes left. The pod goes to the one with the highest weighted sum of plugin scores.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Both phases read requests, not use. A node whose pods request 3.5 of its 4 CPU looks almost full whether they use 3.5 CPU or 0.2. No scoring strategy closes that gap, which is ",
            { a: "Kubernetes overprovisioning", href: "/learn/kubernetes-overprovisioning" },
            ".",
          ],
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: "A pool rarely packs to 100% either, because a pod can’t be split across nodes. On a node with 4 CPU for pods, two pods that request 1.5 CPU each leave 1 CPU that a third such pod can’t use.",
        },
        {
          kind: "p",
          text: [
            "The filter checks every resource, so a node with spare CPU but no spare memory is full for a pod that needs memory. ",
            { a: "Allocatable versus capacity", href: "/learn/kubernetes-allocatable-vs-capacity" },
            " shows how much of a node pods get.",
          ],
        },
      ],
    },
    {
      id: "spread-or-pack-is-a-scoring-strategy",
      title: "LeastAllocated vs MostAllocated",
      blocks: [
        {
          kind: "p",
          text: [
            "There’s no separate bin packing scheduler to install. Packing is a scoring strategy of the default scheduler’s NodeResourcesFit plugin. You set it in the ",
            { code: "kubescheduler.config.k8s.io/v1" },
            " configuration, stable since Kubernetes 1.25. The plugin offers three:",
          ],
        },
        {
          kind: "table",
          columns: [
            { label: "Strategy", width: "15%" },
            { label: "Which node it favours", width: "41%" },
            { label: "Where you can set it", width: "44%" },
          ],
          rows: [
            [
              "LeastAllocated (the default)",
              "The one with the most CPU and memory not yet requested, so pods spread",
              "Every cluster runs it unless you change it",
            ],
            [
              "MostAllocated",
              "The one with the most already requested, so pods pack",
              "Self-managed clusters, AKS scheduler profiles, EKS control plane configuration",
            ],
            [
              "RequestedToCapacityRatio",
              "Whatever a curve you define gives for each utilization level",
              "Self-managed clusters and AKS scheduler profiles; EKS accepts only the other two",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "RequestedToCapacityRatio maps utilization to a score through a curve, its ",
            { code: "shape" },
            ". A curve rising from score 0 at 0% utilization to 10 at 100% packs, and the reverse spreads.",
          ],
        },
        {
          kind: "p",
          text: "Microsoft’s recommended production profile for AKS uses a curve of its own. It scores 10 from 50% to 85% utilization, then 5 at 90% and 0 at 100%, so nodes fill without running to the edge.",
        },
        {
          kind: "callout",
          label: "For engineers",
          text: [
            "Each strategy scores a weighted list of resources: ",
            { code: "cpu" },
            " and ",
            { code: "memory" },
            ", at weight 1 by default. The Kubernetes page on resource bin packing shows how to weight an extended resource, such as a GPU, above both.",
          ],
        },
        { kind: "h3", id: "spread-scores", title: "Spread scores" },
        {
          kind: "p",
          text: [
            "The NodeResourcesFit score is one of several, and spread scores push replicas onto different nodes. A pod of a Service, ReplicaSet, StatefulSet or ReplicationController that sets no ",
            { a: "spread constraints", href: "/learn/topology-spread-constraints" },
            " gets built-in defaults.",
          ],
        },
        {
          kind: "p",
          text: [
            "The defaults are a ",
            { code: "maxSkew" },
            " of 3 across ",
            { code: "kubernetes.io/hostname" },
            " and 5 across ",
            { code: "topology.kubernetes.io/zone" },
            ", both ",
            { code: "ScheduleAnyway" },
            ". Microsoft’s AKS bin-packing profiles disable PodTopologySpread because it “can override the weighted score from NodeResourcesFit if left enabled by default.”",
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            "Pods on such a profile also lose their own spread rules, because PodTopologySpread disabled under ",
            { code: "multiPoint" },
            " is off at every stage. To drop only the defaults, set ",
            { code: "defaultConstraints: []" },
            " with ",
            { code: "defaultingType: List" },
            " on the plugin, as the Kubernetes docs show.",
          ],
        },
      ],
    },
    {
      id: "why-packing-at-placement-never-empties-a",
      title: "What empties a node",
      blocks: [
        {
          kind: "p",
          text: "MostAllocated steers only new pods. A pod stays on its node until something evicts it, and changing the strategy “affects only future scheduling”, as the Karpenter docs note.",
        },
        {
          kind: "p",
          text: "So a cluster drifts. As Deployments scale in and Jobs finish, nodes are left part-full. Emptying them takes another component, and the common ones also measure nodes by requests:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "The Cluster Autoscaler" },
              " counts a node as unneeded when its pods request under 50% of its allocatable CPU and memory. That 50% is the default ",
              { code: "--scale-down-utilization-threshold" },
              " of 0.5. Every pod must also be able to run elsewhere. It removes non-empty nodes one at a time, each after 10 minutes unneeded. ",
              {
                a: "Why a node stays in service",
                href: "/learn/cluster-autoscaler-not-scaling-down",
              },
              " covers the usual blockers.",
            ],
            [
              { b: "Karpenter" },
              " simulates a tight bin packing of pending pods to choose which nodes to launch, and its instance type math “only uses requests”. When the scheduler then spreads the pods, Karpenter’s nodes “can end up under-packed”, and ",
              { a: "consolidation", href: "/learn/karpenter-consolidation" },
              " churns. That is why Karpenter recommends MostAllocated.",
            ],
          ],
        },
        {
          kind: "p",
          text: "A node whose pods request 60% of its CPU and use 10% counts as 60% full to both. That sets the order: requests that match real use first, then packing, then removal.",
        },
        {
          kind: "p",
          text: [
            "The ",
            { a: "Kubernetes cost optimization guide", href: "/kubernetes-cost-optimization" },
            " takes a cluster through that order. The ",
            { a: "descheduler guide", href: "/learn/kubernetes-descheduler" },
            " covers another way to move running pods.",
          ],
        },
      ],
    },
    {
      id: "tight-packing-trades-burst-room-for-fewer",
      title: "The cost of tight packing",
      blocks: [
        {
          kind: "p",
          text: [
            "Packing leaves less unrequested room on each node. Karpenter’s docs warn that a pod whose limits sit above its requests may be unable to burst into more memory, risking an ",
            { a: "out-of-memory (OOM) kill", href: "/learn/oomkilled-exit-code-137" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "It may also be ",
            { a: "CPU-throttled", href: "/learn/glossary/kubernetes-cpu-throttling" },
            " sooner than under the default spread. And with more pods on each node, one node failing takes more of them down.",
          ],
        },
        { kind: "p", text: "Three habits help:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Set requests from measured peaks," },
              " so packing by requests is close to packing by use.",
            ],
            [
              { b: "Give replicated workloads a PodDisruptionBudget" },
              " and the spread rules they need, in a scheduler profile that keeps PodTopologySpread on.",
            ],
            [
              { b: "On AKS, score nearly full nodes down" },
              " with a RequestedToCapacityRatio curve, as Microsoft’s does at 90%.",
            ],
          ],
        },
      ],
    },
    {
      id: "how-to-turn-on-bin-packing-on",
      title: "Turn on bin packing",
      blocks: [
        {
          kind: "p",
          text: [
            "On a self-managed cluster, set ",
            { code: "type: MostAllocated" },
            " under the NodeResourcesFit plugin’s ",
            { code: "scoringStrategy" },
            " in a ",
            { code: "KubeSchedulerConfiguration" },
            " file. Pass the file with ",
            { code: "kube-scheduler --config" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "On a managed cluster the provider runs the kube-scheduler, so each service exposes the setting its own way. Test it on a non-production cluster first.",
        },
        {
          kind: "h3",
          id: "eks-advanced-control-plane-configuration",
          title: "On EKS",
        },
        {
          kind: "p",
          text: [
            "On Kubernetes 1.31 or later, Amazon Elastic Kubernetes Service (EKS) lets you set ",
            { code: "nodeResourcesFit.scoringStrategy" },
            " to LeastAllocated or MostAllocated, through its advanced control plane configuration. Resource weights go from 1 to 100. EKS exposes no other scheduler setting, so the spread defaults stay.",
          ],
        },
        { kind: "ol", items: ["Set the strategy:"] },
        {
          kind: "code",
          lang: "bash",
          code: 'aws eks update-cluster-config \\\n  --name <cluster-name> \\\n  --kube-scheduler-config \'{"nodeResourcesFit":{"scoringStrategy":{"type":"MostAllocated"}}}\'',
        },
        {
          kind: "ol",
          start: 2,
          items: ["Wait for the rolling update of the control plane, which takes several minutes:"],
        },
        { kind: "code", lang: "bash", code: "aws eks wait cluster-active --name <cluster-name>" },
        { kind: "h3", id: "aks-scheduler-profiles", title: "On AKS" },
        {
          kind: "p",
          text: [
            "AKS clusters on Kubernetes 1.33 or later take scheduler profiles through a ",
            { code: "SchedulerConfiguration" },
            " resource named ",
            { code: "upstream" },
            ". Microsoft’s setup guide asks for Azure CLI 2.90.0 or later, with no extension or feature flag.",
          ],
        },
        {
          kind: "p",
          text: [
            "Its bin-packing guide still lists preview prerequisites: Azure CLI 2.76.0 or later, the aks-preview extension 18.0.0b27 or later and the ",
            { code: "UserDefinedSchedulerConfigurationPreview" },
            " feature flag.",
          ],
        },
        {
          kind: "ol",
          items: ["Turn the feature on, and check that its custom resource definition exists:"],
        },
        {
          kind: "code",
          lang: "bash",
          code: "az aks update \\\n  --resource-group <resource-group> \\\n  --name <cluster-name> \\\n  --enable-upstream-kubescheduler-user-configuration\n\nkubectl get crd schedulerconfigurations.aks.azure.com",
        },
        {
          kind: "ol",
          start: 2,
          items: [
            [
              "Apply a profile with ",
              { code: "kubectl apply -f" },
              ". Microsoft’s MostAllocated profile weights CPU eight times above memory and disables PodTopologySpread:",
            ],
          ],
        },
        {
          kind: "code",
          lang: "yaml",
          code: "apiVersion: aks.azure.com/v1alpha1\nkind: SchedulerConfiguration\nmetadata:\n  name: upstream\nspec:\n  rawConfig: |\n    apiVersion: kubescheduler.config.k8s.io/v1\n    kind: KubeSchedulerConfiguration\n    profiles:\n      - schedulerName: cpu-binpack-scheduler-mA\n        plugins:\n          multiPoint:\n            enabled:\n              - name: NodeResourcesFit\n            disabled:\n              - name: PodTopologySpread\n        pluginConfig:\n          - name: NodeResourcesFit\n            args:\n              apiVersion: kubescheduler.config.k8s.io/v1\n              kind: NodeResourcesFitArgs\n              scoringStrategy:\n                type: MostAllocated\n                resources:\n                  - name: cpu\n                    weight: 8\n                  - name: memory\n                    weight: 1",
        },
        {
          kind: "ol",
          start: 3,
          items: [
            [
              "Set ",
              { code: "spec.schedulerName: cpu-binpack-scheduler-mA" },
              " in the pod template of each workload that should use it. Pods without that field keep the default scheduler.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "AKS doesn’t support plugins that target its ",
            { code: "aks-system" },
            " scheduler, or a profile with that name.",
          ],
        },
      ],
    },
    {
      id: "how-coral-helps-empty-spare-nodes",
      title: "Where Coral fits",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " rebalances requests and nodes on AKS and EKS, on Kubernetes 1.30 or later, without any downtime. It works on the two things a scoring strategy leaves alone: requests and part-full nodes.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Requests." },
              " Coral rebalances each container’s CPU and memory requests to what it uses, with headroom on top. This starts when you switch on “Automatically optimize” for a policy or a workload.",
            ],
            [
              { b: "Spare nodes." },
              " Coral works out from pod requests how many nodes each pool needs. It checks that every pod fits elsewhere, then drains one node at a time.",
            ],
            [
              { b: "Removal." },
              " Coral hands each empty node to your Cluster Autoscaler, AKS node auto provisioning (NAP) or Karpenter, whose own timers decide when it goes. It deletes machines itself only in fixed-size pools that nothing else manages. Pools that Karpenter or NAP already consolidates are left to them.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Coral moves each pod by ",
            { a: "warm handover", href: "/learn/kubernetes-drain-node-without-downtime" },
            " or live migration where it can, and otherwise by eviction within its ",
            { a: "PodDisruptionBudget", href: "/learn/glossary/pod-disruption-budget" },
            ". A pod annotated ",
            { code: 'karpenter.sh/do-not-disrupt: "true"' },
            " is never moved, and its node is kept.",
          ],
        },
        {
          kind: "p",
          text: [
            "The Coral guide’s section on ",
            { a: "consolidation", href: "/coral-guide#consolidation" },
            " lists the steps and the wait before removal. The FAQ explains ",
            {
              a: "how consolidation avoids scheduling failures later",
              href: "/coral-faq#how-do-you-make-sure-node",
            },
            ".",
          ],
        },
        {
          kind: "h3",
          id: "what-coral-did-on-our-own-cluster",
          title: "On our own cluster",
        },
        {
          kind: "p",
          text: [
            "On our own AKS development cluster, on 6 October 2026, Coral worked out that the apps would fit on fewer machines. It moved them and removed one of the two 4-CPU workers on its own, in under 10 minutes. That is $147.46 a month less at Azure pay-as-you-go list prices. ",
            { a: "The Coral Value Lab study", href: "/coral-value-lab" },
            " has the full run.",
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
      title: "“Resource Bin Packing”",
      url: "https://kubernetes.io/docs/concepts/scheduling-eviction/resource-bin-packing/",
    },
    {
      publisher: "Kubernetes",
      title: "“Scheduler Configuration”",
      url: "https://kubernetes.io/docs/reference/scheduling/config/",
    },
    {
      publisher: "Kubernetes",
      title: "“Pod Topology Spread Constraints”",
      url: "https://kubernetes.io/docs/concepts/scheduling-eviction/topology-spread-constraints/",
    },
    {
      publisher: "Kubernetes Cluster Autoscaler",
      title: "“Frequently Asked Questions”",
      url: "https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md",
    },
    {
      publisher: "Karpenter",
      title: "“Scheduling”",
      url: "https://karpenter.sh/docs/concepts/scheduling/",
    },
    {
      publisher: "Amazon EKS User Guide",
      title: "“Configure advanced Kubernetes control plane parameters”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/control-plane-configuration-getting-started.html",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Configure scheduler profiles on Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/configure-aks-scheduler",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Bin Pack Nodes with scheduler profiles on Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/configure-node-binpack-scheduler",
    },
  ],
  related: [
    {
      title: "Kubernetes overprovisioning",
      where: "Learn",
      href: "/learn/kubernetes-overprovisioning",
    },
    {
      title: "Kubernetes descheduler",
      where: "Learn",
      href: "/learn/kubernetes-descheduler",
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
      title: "Kubernetes topologySpreadConstraints",
      where: "Learn",
      href: "/learn/topology-spread-constraints",
    },
  ],
};
