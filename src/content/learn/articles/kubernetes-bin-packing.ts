import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/kubernetes-bin-packing/1";

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
  published: "2026-11-05",
  updated: "2026-11-05",
  author: "rupesh",
  short:
    "Kubernetes bin packing means placing pods on as few nodes as their requests allow, so spare nodes go empty and can be removed. The default kube-scheduler spreads pods instead, because its NodeResourcesFit plugin scores nodes with LeastAllocated. Switch it to MostAllocated and it packs. Either way the scheduler counts requests, not use, and it never moves a pod that’s already running, so packing pays off only when requests match real use and something removes the nodes that empty.",
  sections: [
    {
      id: "what-is-bin-packing-in-kubernetes",
      title: "What is bin packing in Kubernetes",
      blocks: [
        {
          kind: "p",
          text: "Bin packing is the old problem of fitting items of different sizes into as few fixed-size bins as possible. In a cluster the bins are nodes and the items are pods, sized by their CPU and memory requests. Microsoft’s Azure Kubernetes Service (AKS) guide calls it raising pod density on nodes instead of spreading pods across a pool.",
        },
        {
          kind: "p",
          text: "The kube-scheduler decides once for each new pod, in two phases. Filtering removes every node that can’t take the pod: NodeResourcesFit checks that the node has room for everything the pod requests, and other plugins check taints, affinity, ports and volumes. Scoring then ranks the nodes left, and the pod goes to the one with the highest weighted sum of plugin scores. Kubernetes automated bin packing happens in that scoring phase, for every pod, without you naming a node.",
        },
        {
          kind: "p",
          text: [
            "Both phases read requests. Karpenter’s docs say it directly: “kube-scheduler scores nodes based on pod resource requests”. A node whose pods request 3.5 of its 4\u00a0CPU looks almost full whether they use 3.5\u00a0CPU or 0.2. No scoring strategy closes that gap between requests and use, which is ",
            { a: "Kubernetes overprovisioning", href: "/learn/kubernetes-overprovisioning" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "A pool rarely packs to 100% either. A pod can’t be split across nodes, so a node with 4\u00a0CPU for pods takes two pods that request 1.5\u00a0CPU each and strands the last 1\u00a0CPU, which no pod of that size can use. The filter checks every resource too, so a node with spare CPU and no spare memory is full for a pod that needs memory. How much of a node is left for pods at all is the subject of ",
            { a: "allocatable versus capacity", href: "/learn/kubernetes-allocatable-vs-capacity" },
            ".",
          ],
        },
      ],
    },
    {
      id: "how-the-kube-scheduler-scores-nodes-spread",
      title: "How the kube-scheduler scores nodes: spread or pack",
      blocks: [
        {
          kind: "p",
          text: [
            "There’s no separate Kubernetes bin packing scheduler to install, because packing is a scoring strategy of the default scheduler’s NodeResourcesFit plugin. You set it in the ",
            { code: "kubescheduler.config.k8s.io/v1" },
            " configuration, stable since Kubernetes 1.25, and the plugin offers three:",
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
            "Each strategy scores a weighted list of resources, ",
            { code: "cpu" },
            " and ",
            { code: "memory" },
            " at weight 1 by default, and the Kubernetes page on resource bin packing shows how to weight an extended resource, such as a GPU, above both. RequestedToCapacityRatio maps utilization to a score through a ",
            { code: "shape" },
            ": a curve from score 0 at 0% utilization up to score 10 at 100% packs, and the reverse spreads. Microsoft’s recommended production profile for AKS reaches the top score of 10 at 50%, holds it to 85%, then drops to 5 at 90% and 0 at 100%, so nodes fill without running to the edge.",
          ],
        },
        {
          kind: "p",
          text: [
            "The fit score is one of several. When a pod that belongs to a Service, ReplicaSet, StatefulSet or ReplicationController sets no ",
            { a: "spread constraints", href: "/learn/topology-spread-constraints" },
            " of its own, the scheduler applies built-in defaults: a ",
            { code: "maxSkew" },
            " of 3 across ",
            { code: "kubernetes.io/hostname" },
            " and 5 across ",
            { code: "topology.kubernetes.io/zone" },
            ", both ",
            { code: "ScheduleAnyway" },
            ". Those scores push replicas onto different nodes. Microsoft’s AKS bin-packing profiles disable PodTopologySpread because it “can override the weighted score from NodeResourcesFit if left enabled by default.” Disabled under ",
            { code: "multiPoint" },
            ", as in those profiles, the plugin is off at every stage, so pods using the profile also lose the spread rules they declare. To drop only the built-in defaults, set ",
            { code: "defaultConstraints: []" },
            " with ",
            { code: "defaultingType: List" },
            " on the plugin, as the Kubernetes docs show.",
          ],
        },
      ],
    },
    {
      id: "a-kubernetes-bin-packing-example",
      title: "A Kubernetes bin packing example",
      blocks: [
        {
          kind: "p",
          text: "Take three nodes with 4\u00a0CPU each for pods and six pods that arrive one at a time, each requesting 1\u00a0CPU, and count only CPU and the fit score.",
        },
        {
          kind: "p",
          text: "LeastAllocated sends each pod to the node with the least requested so far, so the pods land two per node. Every node is 50% requested, and none is empty.",
        },
        {
          kind: "p",
          text: "MostAllocated does the opposite. Four pods fill node-a, two go to node-b, and node-c stays empty for an autoscaler to remove.",
        },
        {
          kind: "p",
          text: "Now suppose each pod peaks at 250m, a quarter of a CPU, and its request is set to 300m to leave a little headroom. The six request 1.8\u00a0CPU in all, 45% of one node, and under MostAllocated they all land on node-a. The request change did more than the strategy change. Even spread two per node, each node would be 15% requested, low enough for the Cluster Autoscaler to remove two of the three, one at a time, if the pods can move.",
        },
        { kind: "diagram", figure: figure1 },
      ],
    },
    {
      id: "why-packing-at-placement-never-empties-a",
      title: "Why packing at placement never empties a node",
      blocks: [
        {
          kind: "p",
          text: "Changing the scoring strategy “affects only future scheduling”, the Karpenter docs note, and running pods are not moved. So a cluster drifts: as Deployments scale in and jobs finish, nodes are left part-full. MostAllocated steers the next pods to the fuller nodes, but a node that is 20% requested keeps its pods until something evicts them.",
        },
        {
          kind: "p",
          text: "That takes a separate component, and the common ones measure nodes by requests too:",
        },
        {
          kind: "ul",
          items: [
            [
              "The Cluster Autoscaler counts a node as unneeded when its pods request under 50% of its allocatable CPU and memory (the default ",
              { code: "--scale-down-utilization-threshold" },
              " of 0.5) and every pod can run elsewhere, and removes it after 10\u00a0minutes unneeded. It removes non-empty nodes one at a time. ",
              {
                a: "Why a node stays in service",
                href: "/learn/cluster-autoscaler-not-scaling-down",
              },
              " covers the usual blockers.",
            ],
            [
              "Karpenter simulates a tight bin packing of pending pods to choose which nodes to launch, and its instance type math “only uses requests”. The kube-scheduler then places the pods. When it spreads them, Karpenter’s nodes “can end up under-packed” and consolidation churns, which is why Karpenter recommends MostAllocated. See ",
              { a: "Karpenter consolidation", href: "/learn/karpenter-consolidation" },
              ".",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "So a node whose pods request 60% of its CPU and use 10% counts as 60% full to both. Requests that match real use come first, then packing, then removal. The ",
            { a: "descheduler guide", href: "/learn/kubernetes-descheduler" },
            " covers another way to move running pods.",
          ],
        },
      ],
    },
    {
      id: "what-tight-packing-costs-you",
      title: "What tight packing costs you",
      blocks: [
        {
          kind: "p",
          text: "Packing leaves less unrequested room on each node, and some workloads live in that room. A pod whose limits sit above its requests may be unable to burst into more memory, risking an out-of-memory (OOM) kill, or may be CPU-throttled sooner than under the default spread, Karpenter’s docs warn. More pods share each node too, so one node failing takes more of them down.",
        },
        {
          kind: "p",
          text: "Three habits help. Set requests from measured peaks, so packing by requests is close to packing by use. Give replicated workloads a PodDisruptionBudget and the spread rules they need, in a scheduler profile that keeps PodTopologySpread on. On AKS, where you can choose RequestedToCapacityRatio, use a curve that scores nearly full nodes down, as Microsoft’s does at 90%.",
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
            ". On a managed cluster the cloud provider runs the kube-scheduler for you, so each service exposes the setting its own way. Test it on a non-production cluster first.",
          ],
        },
        {
          kind: "h3",
          id: "eks-advanced-control-plane-configuration",
          title: "EKS: advanced control plane configuration",
        },
        {
          kind: "p",
          text: [
            "On clusters running Kubernetes 1.31 or later, Amazon Elastic Kubernetes Service (EKS) lets you set ",
            { code: "nodeResourcesFit.scoringStrategy" },
            " to LeastAllocated or MostAllocated, with resource weights from 1 to 100:",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: 'aws eks update-cluster-config \\\n  --name <cluster-name> \\\n  --kube-scheduler-config \'{"nodeResourcesFit":{"scoringStrategy":{"type":"MostAllocated"}}}\'\n\naws eks wait cluster-active --name <cluster-name>',
        },
        {
          kind: "p",
          text: "EKS applies it through a rolling update of the control plane that takes several minutes. It exposes no other scheduler parameter, so the spread defaults stay.",
        },
        { kind: "h3", id: "aks-scheduler-profiles", title: "AKS: scheduler profiles" },
        {
          kind: "p",
          text: [
            "On Kubernetes 1.33 or later, AKS takes scheduler profiles through a ",
            { code: "SchedulerConfiguration" },
            " resource named ",
            { code: "upstream" },
            ". In October 2026 Microsoft’s setup guide, “Configure scheduler profiles”, asks for Azure CLI 2.90.0 or later and no extension or feature flag. Its bin-packing guide still lists the preview prerequisites: Azure CLI 2.76.0 or later, the aks-preview extension 18.0.0b27 or later and the ",
            { code: "UserDefinedSchedulerConfigurationPreview" },
            " feature flag. Turn the feature on and check that its custom resource definition exists:",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "az aks update \\\n  --resource-group <resource-group> \\\n  --name <cluster-name> \\\n  --enable-upstream-kubescheduler-user-configuration\n\nkubectl get crd schedulerconfigurations.aks.azure.com",
        },
        {
          kind: "p",
          text: "Microsoft’s MostAllocated profile weights CPU eight times above memory and disables PodTopologySpread:",
        },
        {
          kind: "code",
          lang: "yaml",
          code: "apiVersion: aks.azure.com/v1alpha1\nkind: SchedulerConfiguration\nmetadata:\n  name: upstream\nspec:\n  rawConfig: |\n    apiVersion: kubescheduler.config.k8s.io/v1\n    kind: KubeSchedulerConfiguration\n    profiles:\n      - schedulerName: cpu-binpack-scheduler-mA\n        plugins:\n          multiPoint:\n            enabled:\n              - name: NodeResourcesFit\n            disabled:\n              - name: PodTopologySpread\n        pluginConfig:\n          - name: NodeResourcesFit\n            args:\n              apiVersion: kubescheduler.config.k8s.io/v1\n              kind: NodeResourcesFitArgs\n              scoringStrategy:\n                type: MostAllocated\n                resources:\n                  - name: cpu\n                    weight: 8\n                  - name: memory\n                    weight: 1",
        },
        {
          kind: "p",
          text: [
            "Apply it with ",
            { code: "kubectl apply -f" },
            ", then set ",
            { code: "spec.schedulerName: cpu-binpack-scheduler-mA" },
            " in the pod template of each workload that should use it. Pods without that field keep the default scheduler. AKS doesn’t support plugins that target its ",
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
            "A scoring strategy decides where new pods go. It doesn’t make requests match use, and it doesn’t empty the part-full nodes you already run. ",
            { a: "Coral optimizes Kubernetes", href: "/coral" },
            " on AKS and EKS clusters running Kubernetes 1.30 or later, and works on both halves.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Requests." },
              " Coral rebalances each container’s CPU and memory requests to what it uses. On the balanced policy, CPU follows the 80th percentile of the last 3\u00a0days and memory the 8-day peak, each plus 10%. Pod sizing starts when you switch on “Automatically optimize” for a policy or a workload.",
            ],
            [
              { b: "The Evictor." },
              " It moves pods off lightly used nodes and leaves each empty node to your autoscaler. It drains only in pools whose setting allows it, which is off by default, and it never overrides a PodDisruptionBudget.",
            ],
            [
              { b: "Node optimization." },
              " Coral works out from pod requests how many nodes each pool needs, and every pool keeps at least one node. Before each drain it simulates the scheduler on the live cluster, so every pod must fit elsewhere with its affinity, taints, spread, ports and zones. Nodes drain one at a time. A drain that can’t finish in 10\u00a0minutes puts the node back into service.",
            ],
            [
              { b: "Removal." },
              " After 5\u00a0minutes by default, Coral hands the empty node to your Cluster Autoscaler, AKS node auto-provisioning (NAP) or Karpenter, whose own timers decide when it goes. It deletes machines itself only in fixed-size pools that nothing else manages. Pools that Karpenter or NAP already consolidates are left to them.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "For pods of a Deployment or an Argo Rollout, Coral first tries a warm handover: it scales the owner up by one, waits until the new pod is Ready on another node, then evicts the old pod. No process state moves, and open connections to the old pod end. Where a handover doesn’t apply, as for a StatefulSet, the Recreate strategy, a ReadWriteOnce volume or, during consolidation, an app scaled by a Horizontal Pod Autoscaler, the pod is evicted within its PodDisruptionBudget and an app that runs a single copy restarts briefly. A pod annotated ",
            { code: 'karpenter.sh/do-not-disrupt: "true"' },
            " is never moved, and its node is kept. The guide’s section on ",
            { a: "consolidation", href: "/coral/guide#consolidation" },
            " lists the steps and the wait before removal.",
          ],
        },
        {
          kind: "p",
          text: [
            "On our own AKS development cluster, on 6 October 2026, Coral worked out that the apps would fit on fewer machines. It moved them and removed one of the two 4-CPU workers on its own in under 10\u00a0minutes, $147.46 a month less at Azure pay-as-you-go list prices. Apps that run a single copy restarted once on another machine. The full run is in ",
            {
              a: "How we reduced our own cluster’s machine bill by 58%",
              href: "/case-studies/coral-dev-cluster",
            },
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
      { label: "Kubernetes cost optimization with Coral", href: "/coral" },
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
      title: "How do you make sure node consolidation doesn’t cause scheduling failures later?",
      where: "Coral FAQ",
      href: "/coral/faq#how-do-you-make-sure-node",
    },
    {
      title: "How we reduced our own cluster’s machine bill by 58%",
      where: "Case study",
      href: "/case-studies/coral-dev-cluster",
    },
  ],
};
