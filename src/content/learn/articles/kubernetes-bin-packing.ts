import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/kubernetes-bin-packing/1";
import { figure as figure2 } from "@/features/learn/figures/kubernetes-bin-packing/2";

export const article: Article = {
  slug: "kubernetes-bin-packing",
  title: "Kubernetes bin packing: same pods, fewer nodes",
  meta: "Kubernetes bin packing puts pods on as few nodes as fit. The scheduler scores by requests, not use: MostAllocated on AKS and EKS, and what empties the rest.",
  h1: "Kubernetes bin packing: fewer nodes for the same pods",
  deck: "The scheduler scores nodes by requests, spreads pods by default and never moves a running one. What changes that.",
  card: "How the scheduler scores nodes by requests, how to switch it to MostAllocated, and what empties the rest.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Node lifecycle and scheduling",
  published: "2026-11-01",
  updated: "2026-11-01",
  author: "rupesh",
  cover: "/learn-covers/zoorik-learn-kubernetes-bin-packing-1200x630.webp",
  coverAlt:
    "Kubernetes bin packing: spread pods hold every node, but packed pods leave a node empty that can be removed",
  short:
    "Kubernetes bin packing places pods on as few nodes as their requests allow, so spare nodes can be removed. The default kube-scheduler spreads pods and MostAllocated makes it pack, but either way it counts requests, not use, and never moves a running pod.",
  sections: [
    {
      id: "kubernetes-bin-packing",
      title: "A Kubernetes bin packing example: requests matter more than spread or pack",
      blocks: [
        {
          kind: "p",
          text: "Take three nodes with 4\u00a0CPU each for pods and six pods that arrive one at a time, each requesting 1\u00a0CPU. Count only CPU and the NodeResourcesFit score.",
        },
        {
          kind: "p",
          text: "The default, LeastAllocated, sends each pod to the node with the least requested so far, so the pods land two per node. Every node is 50% requested, and none is empty.",
        },
        {
          kind: "p",
          text: "MostAllocated does the opposite. Four pods fill node-a, two go to node-b, and node-c stays empty, so an autoscaler can remove it.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "Suppose each pod peaks at 250m, a quarter of a CPU, and requests 300m, 50m above its peak. The six request 6 × 300m = 1.8\u00a0CPU, 45% of one node (1.8 ÷ 4), and under MostAllocated they all land on node-a.",
        },
        {
          kind: "p",
          text: "Even when LeastAllocated spreads them, each node would be 15% requested (600m ÷ 4,000m). That is low enough for the Cluster Autoscaler to remove two of the three, one at a time, if the pods can move.",
        },
        { kind: "p", text: "The request change did more than the strategy change." },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "what-is-bin-packing-in-kubernetes-a",
      title: "What is bin packing in Kubernetes: a node score built on requests",
      blocks: [
        {
          kind: "p",
          text: [
            "Bin packing is the classic problem of fitting items of different sizes into as few fixed-size bins as possible. In a cluster the bins are nodes and the items are pods, sized by their CPU and memory ",
            { a: "requests", href: "/learn/glossary/kubernetes-resource-requests" },
            ". Microsoft’s Azure Kubernetes Service (AKS) guide calls it raising pod density on nodes instead of spreading pods across a pool.",
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
              " ranks the nodes left, and the pod goes to the one with the highest weighted sum of plugin scores. Kubernetes automated bin packing happens here, for every pod, without you naming a node.",
            ],
          ],
        },
        {
          kind: "p",
          text: "Both phases read requests. Karpenter’s docs say it directly: “kube-scheduler scores nodes based on pod resource requests”.",
        },
        {
          kind: "p",
          text: [
            "A node whose pods request 3.5 of its 4\u00a0CPU looks almost full whether they use 3.5\u00a0CPU or 0.2. No scoring strategy closes that gap between requests and use, which is ",
            { a: "Kubernetes overprovisioning", href: "/learn/kubernetes-overprovisioning" },
            ".",
          ],
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: "A pool rarely packs to 100% either, because a pod can’t be split across nodes. A node with 4\u00a0CPU for pods takes two pods that request 1.5\u00a0CPU each. That strands the last 1\u00a0CPU, which no pod of that size can use.",
        },
        {
          kind: "p",
          text: [
            "The filter checks every resource too. A node with spare CPU and no spare memory is full for a pod that needs memory. See ",
            { a: "allocatable versus capacity", href: "/learn/kubernetes-allocatable-vs-capacity" },
            " for how much of a node pods get.",
          ],
        },
      ],
    },
    {
      id: "spread-or-pack-is-a-scoring-strategy",
      title: "LeastAllocated vs MostAllocated: spread or pack on the default scheduler",
      blocks: [
        {
          kind: "p",
          text: [
            "There’s no separate Kubernetes bin packing scheduler to install. Packing is a scoring strategy of the default scheduler’s NodeResourcesFit plugin, set in the ",
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
            "RequestedToCapacityRatio maps utilization to a score through a ",
            { code: "shape" },
            ". A curve from score 0 at 0% utilization up to score 10 at 100% packs, and the reverse spreads.",
          ],
        },
        {
          kind: "p",
          text: "Microsoft’s recommended production profile for AKS uses a curve of its own. Its score reaches the top of 10 at 50% utilization and holds it to 85%. After that it drops to 5 at 90% and 0 at 100%, so nodes fill without running to the edge.",
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
        {
          kind: "p",
          text: [
            "The NodeResourcesFit score is one of several, and spread scores push replicas onto different nodes. When a pod sets no ",
            { a: "spread constraints", href: "/learn/topology-spread-constraints" },
            " of its own, the scheduler applies built-in defaults. Only pods of a Service, ReplicaSet, StatefulSet or ReplicationController get them.",
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
            "Pods that use such a profile also lose their declared spread rules, because PodTopologySpread disabled under ",
            { code: "multiPoint" },
            " is off at every stage.",
          ],
        },
        {
          kind: "p",
          text: [
            "To drop only the defaults, set ",
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
      title: "Why packing at placement never empties a node",
      blocks: [
        {
          kind: "p",
          text: "A node that is 20% requested keeps its pods until something evicts them. Changing the strategy “affects only future scheduling”, as the Karpenter docs note, and running pods are not moved.",
        },
        {
          kind: "p",
          text: "So a cluster drifts. As Deployments scale in and jobs finish, nodes are left part-full. MostAllocated only steers the next pods to the fuller ones.",
        },
        {
          kind: "p",
          text: "Emptying a node takes a separate component, and the common ones measure nodes by requests too:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "The Cluster Autoscaler" },
              " counts a node as unneeded when its pods request under 50% of its allocatable CPU and memory. That 50% is the default ",
              { code: "--scale-down-utilization-threshold" },
              " of 0.5. Every pod must also be able to run elsewhere. The autoscaler removes the node after 10\u00a0minutes unneeded, and removes non-empty nodes one at a time. ",
              {
                a: "Why a node stays in service",
                href: "/learn/cluster-autoscaler-not-scaling-down",
              },
              " covers the usual blockers.",
            ],
            [
              { b: "Karpenter" },
              " simulates a tight bin packing of pending pods to choose which nodes to launch, and its instance type math “only uses requests”. The scheduler then places the pods, and when it spreads them, Karpenter’s nodes “can end up under-packed”. ",
              { a: "Consolidation", href: "/learn/karpenter-consolidation" },
              " then churns, which is why Karpenter recommends MostAllocated.",
            ],
          ],
        },
        {
          kind: "p",
          text: "So a node whose pods request 60% of its CPU and use 10% counts as 60% full to both. That sets the order for bin packing: requests that match real use first, then packing, then removal.",
        },
        {
          kind: "p",
          text: [
            "The ",
            { a: "Kubernetes cost optimization guide", href: "/kubernetes-cost-optimization" },
            " takes a cluster through the same order: requests first, then nodes. The ",
            { a: "descheduler guide", href: "/learn/kubernetes-descheduler" },
            " covers another way to move running pods.",
          ],
        },
      ],
    },
    {
      id: "tight-packing-trades-burst-room-for-fewer",
      title: "Tight packing trades burst room for fewer nodes",
      blocks: [
        {
          kind: "p",
          text: "Packing leaves less unrequested room on each node, and some workloads live in that room. Take a pod whose limits sit above its requests. Karpenter’s docs warn it may be unable to burst into more memory, risking an out-of-memory (OOM) kill.",
        },
        {
          kind: "p",
          text: [
            "It may also be ",
            { a: "CPU-throttled", href: "/learn/glossary/kubernetes-cpu-throttling" },
            " sooner than under the default spread. More pods share each node too, so one node failing takes more of them down.",
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
      title: "How to turn on bin packing on AKS and EKS",
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
            " file and pass it with ",
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
          title: "EKS: advanced control plane configuration",
        },
        {
          kind: "p",
          text: [
            "On Kubernetes 1.31 or later, Amazon Elastic Kubernetes Service (EKS) lets you set ",
            { code: "nodeResourcesFit.scoringStrategy" },
            " to LeastAllocated or MostAllocated. Resource weights go from 1 to 100. EKS exposes no other scheduler parameter, so the spread defaults stay.",
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
          items: [
            "Wait for EKS’s rolling update of the control plane, which takes several minutes:",
          ],
        },
        { kind: "code", lang: "bash", code: "aws eks wait cluster-active --name <cluster-name>" },
        { kind: "h3", id: "aks-scheduler-profiles", title: "AKS: scheduler profiles" },
        {
          kind: "p",
          text: [
            "AKS clusters on Kubernetes 1.33 or later take scheduler profiles through a ",
            { code: "SchedulerConfiguration" },
            " resource named ",
            { code: "upstream" },
            ". In October 2026 Microsoft’s setup guide, “Configure scheduler profiles”, asks for Azure CLI 2.90.0 or later. It asks for no extension or feature flag.",
          ],
        },
        { kind: "p", text: "Microsoft’s bin-packing guide still lists the preview prerequisites:" },
        {
          kind: "ul",
          items: [
            "Azure CLI 2.76.0 or later",
            "aks-preview extension 18.0.0b27 or later",
            [{ code: "UserDefinedSchedulerConfigurationPreview" }, " feature flag"],
          ],
        },
        {
          kind: "ol",
          items: ["Turn the feature on and check that its custom resource definition exists:"],
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
      title: "How Coral helps empty spare nodes",
      blocks: [
        {
          kind: "p",
          text: [
            "A scoring strategy places new pods. It doesn’t make requests match use or empty the part-full nodes you already run. ",
            { a: "Coral optimizes Kubernetes", href: "/coral" },
            " on AKS and EKS clusters running Kubernetes 1.30 or later, and works on both halves.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Requests." },
              " Coral rebalances each container’s CPU and memory requests to what it uses, with headroom on top. Pod sizing starts when you switch on “Automatically optimize” for a policy or a workload.",
            ],
            [
              { b: "Spare nodes." },
              " Coral works out from pod requests how many nodes each pool needs, checks that every pod fits elsewhere, and drains one node at a time.",
            ],
            [
              { b: "Removal." },
              " Coral hands each emptied node to your Cluster Autoscaler, AKS node auto provisioning (NAP) or Karpenter, whose own timers decide when it goes. It deletes machines itself only in fixed-size pools that nothing else manages. Pools that Karpenter or NAP already consolidates are left to them.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Where it can", href: "/learn/kubernetes-drain-node-without-downtime" },
            ", Coral starts a new copy on another node before the old pod goes. Other pods move within their ",
            { a: "PodDisruptionBudgets", href: "/learn/glossary/pod-disruption-budget" },
            ", and a single-copy app among them restarts briefly. A pod annotated ",
            { code: 'karpenter.sh/do-not-disrupt: "true"' },
            " is never moved, and its node is kept.",
          ],
        },
        {
          kind: "p",
          text: [
            "The guide’s section on ",
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
          title: "What Coral did on our own cluster",
        },
        {
          kind: "p",
          text: "On our own AKS development cluster, on 6 October 2026, Coral worked out that the apps would fit on fewer machines. It moved them and removed one of the two 4-CPU workers on its own in under 10\u00a0minutes. That is $147.46 a month less at Azure pay-as-you-go list prices.",
        },
        {
          kind: "p",
          text: [
            "Apps that run a single copy restarted once on another machine. The full run is in ",
            { a: "the Coral Value Lab study", href: "/coral-value-lab" },
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
      title: "Kubernetes overprovisioning: what it is and how to measure it",
      where: "Learn",
      href: "/learn/kubernetes-overprovisioning",
    },
    {
      title: "Kubernetes descheduler: what it moves and when to use it",
      where: "Learn",
      href: "/learn/kubernetes-descheduler",
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
      title: "Topology spread constraints: maxSkew, zones and scale-down",
      where: "Learn",
      href: "/learn/topology-spread-constraints",
    },
  ],
};
