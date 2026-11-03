import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/kubernetes-descheduler/1";
import { figure as figure2 } from "@/features/learn/figures/kubernetes-descheduler/2";
import { figure as figure3 } from "@/features/learn/figures/kubernetes-descheduler/3";

export const article: Article = {
  slug: "kubernetes-descheduler",
  title: "Kubernetes descheduler: strategies and Helm setup",
  meta: "The Kubernetes descheduler evicts pods so the scheduler can place them again. Its strategies, a dry-run Helm example, and when your autoscaler is enough.",
  h1: "Kubernetes descheduler",
  deck: "Its ten strategies, a dry-run Helm setup, and when your autoscaler already does the job.",
  card: "What the descheduler evicts, its ten strategies, and a Helm setup in dry-run mode.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Node lifecycle and scheduling",
  published: "2026-11-01",
  updated: "2026-11-03",
  author: "iqbal",
  cover: "/learn-covers/zoorik-learn-kubernetes-descheduler-1200x630.webp",
  coverAlt:
    "Kubernetes descheduler: it evicts a pod from a busy node toward a light one by requests, and no node is deleted",
  short:
    "The Kubernetes descheduler evicts running pods that no longer belong where they are, so the default scheduler can place their replacements again. Most of its ten strategies target pods that break a placement rule, keep restarting or have failed. Two others act on how full each node is. It never schedules a pod or deletes a node.",
  sections: [
    {
      id: "kubernetes-descheduler",
      title: "How it works",
      blocks: [
        {
          kind: "p",
          text: "The scheduler places a pod once. Amazon’s EKS documentation says it plainly: “The Kubernetes scheduler never relocates a pod that is already running.”",
        },
        {
          kind: "p",
          text: "Say one of three identical nodes fails. Its pods restart on the other two, and its replacement joins almost empty. Requests on node-a, node-b and node-c now sit at 70%, 45% and 10% of allocatable.",
        },
        { kind: "p", text: "Placement drifts in quieter ways too:" },
        {
          kind: "ul",
          items: [
            "a node gains a taint",
            "a node loses a label",
            [
              "an ",
              { a: "affinity rule", href: "/learn/pod-affinity-vs-node-affinity" },
              " stops matching",
            ],
          ],
        },
        {
          kind: "p",
          text: "The descheduler finds pods like these and evicts them. It doesn’t choose where they go. The pod’s controller creates a replacement, and the default scheduler places it by the usual rules.",
        },
        {
          kind: "p",
          text: [
            "Every eviction goes through the Eviction API. So a ",
            { a: "PodDisruptionBudget", href: "/learn/pod-disruption-budget-best-practices" },
            " (PDB) that allows no more disruptions keeps the pod in place.",
          ],
        },
        { kind: "svg", figure: figure1 },
        { kind: "p", text: "By default, the descheduler never evicts:" },
        {
          kind: "ul",
          items: [
            [
              "pods with the ",
              { code: "system-cluster-critical" },
              " or ",
              { code: "system-node-critical" },
              " priority class",
            ],
            "pods that no ReplicaSet, StatefulSet, Job or ReplicationController owns, since nothing would recreate them",
            "DaemonSet pods",
            "pods with local storage, which the descheduler’s code defines as an emptyDir or hostPath volume",
          ],
        },
        {
          kind: "p",
          text: "Pods with a PersistentVolumeClaim (PVC) are evicted unless you protect them.",
        },
      ],
    },
    {
      id: "ten-strategies-and-only-two-of-them",
      title: "Descheduler strategies",
      blocks: [
        {
          kind: "p",
          text: "The descheduler calls its strategies plugins. Deschedule plugins judge pods one at a time. Balance plugins judge a group of pods against how it was meant to be spread. Only two of the ten look at how full a node is.",
        },
        {
          kind: "table",
          columns: [
            { label: "Strategy", width: "30%" },
            { label: "Kind", width: "14%" },
            { label: "What it evicts", width: "56%" },
          ],
          rows: [
            [
              "RemoveDuplicates",
              "Balance",
              "Extra pods of one ReplicaSet, StatefulSet or Job on the same node",
            ],
            [
              "LowNodeUtilization",
              "Balance",
              "Pods on busy nodes, so they land on lightly used ones",
            ],
            [
              "HighNodeUtilization",
              "Balance",
              "Pods on lightly used nodes, so they pack onto fewer",
            ],
            [
              "RemovePodsViolatingTopologySpreadConstraint",
              "Balance",
              ["The fewest pods needed to bring each constraint back within ", { code: "maxSkew" }],
            ],
            [
              "RemovePodsViolatingInterPodAntiAffinity",
              "Deschedule",
              "Pods that break an anti-affinity rule",
            ],
            [
              "RemovePodsViolatingNodeAffinity",
              "Deschedule",
              "Pods whose node no longer matches their node affinity",
            ],
            [
              "RemovePodsViolatingNodeTaints",
              "Deschedule",
              "Pods that no longer tolerate their node’s NoSchedule taints",
            ],
            ["RemovePodsHavingTooManyRestarts", "Deschedule", "Pods that reach a restart count"],
            ["PodLifeTime", "Deschedule", "Pods matched by age, state, condition or exit code"],
            ["RemoveFailedPods", "Deschedule", "Pods in the Failed phase"],
          ],
        },
      ],
    },
    {
      id: "lownodeutilization-spreads-pods-and-highnodeutilization-packs-them",
      title: "LowNodeUtilization vs HighNodeUtilization",
      blocks: [
        {
          kind: "p",
          text: "Both measure a node by what its pods request, as a share of the node’s allocatable CPU, memory and pod capacity.",
        },
        {
          kind: "p",
          text: "Actual use doesn’t count by default. LowNodeUtilization can read real usage from Metrics Server or Prometheus instead. HighNodeUtilization can’t yet.",
        },
        {
          kind: "h3",
          id: "lownodeutilization-fills-lightly-used-nodes",
          title: "LowNodeUtilization spreads pods",
        },
        {
          kind: "p",
          text: [
            "It takes two maps, ",
            { code: "thresholds" },
            " and ",
            { code: "targetThresholds" },
            ". A node under ",
            { code: "thresholds" },
            " for every resource is underutilized. A node over ",
            { code: "targetThresholds" },
            " for any resource is overutilized. The strategy evicts pods from overutilized nodes toward underutilized ones, and does nothing when either group is empty.",
          ],
        },
        {
          kind: "p",
          text: [
            "With Prometheus as its source, it evicts at most one pod per overutilized node each cycle, unless ",
            { code: "evictionLimits.node" },
            " allows more.",
          ],
        },
        {
          kind: "h3",
          id: "highnodeutilization-empties-them",
          title: "HighNodeUtilization packs pods",
        },
        {
          kind: "p",
          text: [
            "It takes only ",
            { code: "thresholds" },
            ". It evicts pods from underutilized nodes so they’re recreated on busier ones. The project describes it as a way to trigger scale-down when you run node autoscaling.",
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            "The project’s README says HighNodeUtilization must be used with the scheduler’s ",
            { code: "MostAllocated" },
            " scoring strategy. Under the default, ",
            { code: "LeastAllocated" },
            ", the replacements can go straight back to the node just emptied.",
          ],
        },
        {
          kind: "h3",
          id: "the-same-three-nodes-under-each-strategy",
          title: "The three-node example",
        },
        {
          kind: "p",
          text: [
            "The Helm chart’s default policy turns on LowNodeUtilization, with ",
            { code: "thresholds" },
            " of 20% and ",
            { code: "targetThresholds" },
            " of 50%. If you want fewer nodes, change that before you install.",
          ],
        },
        {
          kind: "callout",
          label: "Worked example",
          text: [
            "Under the chart’s defaults, node-a’s 70% is over 50% and node-c’s 10% is under 20%. So LowNodeUtilization evicts from node-a toward node-c. HighNodeUtilization at 20% evicts node-c’s pods instead, and ",
            { code: "MostAllocated" },
            " sends them to node-a (70% + 10% = 80%). Once your autoscaler removes the empty node-c, three nodes become two, reducing the pool’s machine cost by a third.",
          ],
        },
        { kind: "svg", figure: figure2 },
      ],
    },
    {
      id: "how-a-kubernetes-descheduler-policy-decides-what",
      title: "The descheduler policy",
      blocks: [
        {
          kind: "p",
          text: [
            "A policy is a ",
            { code: "DeschedulerPolicy" },
            " object, still at API version ",
            { code: "descheduler/v1alpha2" },
            ". You pass it to the binary with ",
            { code: "--policy-config-file" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "Its top level sets limits for every eviction, all unlimited when unset:",
        },
        {
          kind: "ul",
          items: [
            [{ code: "maxNoOfPodsToEvictPerNode" }],
            [{ code: "maxNoOfPodsToEvictPerNamespace" }],
            [{ code: "maxNoOfPodsToEvictTotal" }, " (per cycle)"],
          ],
        },
        {
          kind: "p",
          text: [
            "Under them sit one or more profiles. Each has a ",
            { code: "pluginConfig" },
            " list of plugin arguments and a ",
            { code: "plugins" },
            " block that enables strategies under ",
            { code: "deschedule" },
            " or ",
            { code: "balance" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "The DefaultEvictor plugin filters pods for every strategy. Three of its arguments do most of the safety work:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Node fit:" },
              " with ",
              { code: "nodeFit" },
              " on (it’s off by default), a pod is evicted only if another node could take it. That node must match the pod’s node selector and node affinity, and the pod must tolerate its taints. It also needs room for the pod’s requests and can’t be unschedulable. Pod anti-affinity must allow the move too.",
            ],
            [
              { b: "Few replicas:" },
              " ",
              { code: "minReplicas" },
              " spares pods whose owner runs fewer replicas than its value.",
            ],
            [
              { b: "Protections:" },
              " ",
              { code: "podProtections" },
              ", new in v0.34, turns built-in protections off under ",
              { code: "defaultDisabled" },
              " and adds others under ",
              { code: "extraEnabled" },
              ", such as ",
              { code: "PodsWithPVC" },
              " or ",
              { code: "PodsWithoutPDB" },
              ". Older releases such as v0.33 use booleans like ",
              { code: "ignorePvcPods" },
              ".",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "From v0.34, a pod can ask to stay with the ",
            { code: "descheduler.alpha.kubernetes.io/prefer-no-eviction" },
            " annotation. Each strategy decides whether to respect it, unless DefaultEvictor sets ",
            { code: "noEvictionPolicy" },
            " to ",
            { code: "Mandatory" },
            ". Then no strategy evicts the pod. At ",
            { code: "--v=4" },
            " or higher, the descheduler logs why each skipped pod wasn’t evictable.",
          ],
        },
      ],
    },
    {
      id: "install-the-descheduler-helm-chart-in-dry",
      title: "Install with Helm",
      blocks: [
        {
          kind: "p",
          text: [
            "The chart comes from the project, and its version tracks the descheduler’s. It runs the descheduler as a CronJob or a Deployment, as a critical pod in ",
            { code: "kube-system" },
            ", so it isn’t evicted itself.",
          ],
        },
        {
          kind: "p",
          text: "By default the chart runs a CronJob every 2 minutes, with a profile that enables seven strategies:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Balance:" },
              " RemoveDuplicates, RemovePodsViolatingTopologySpreadConstraint and LowNodeUtilization.",
            ],
            [
              { b: "Deschedule:" },
              " RemovePodsHavingTooManyRestarts (at 100 restarts), RemovePodsViolatingNodeTaints, RemovePodsViolatingNodeAffinity and RemovePodsViolatingInterPodAntiAffinity.",
            ],
          ],
        },
        {
          kind: "p",
          text: "The chart also changes two protections. Pods with a PVC are protected, and pods with local storage are not, so a pod with an emptyDir or hostPath volume can be evicted.",
        },
        {
          kind: "h3",
          id: "a-kubernetes-descheduler-example-pack-nodes-for",
          title: "Pack nodes for scale-down",
        },
        {
          kind: "ol",
          items: [
            "Write a values file. It replaces the default profile with HighNodeUtilization alone and runs the descheduler as a Deployment every 5 minutes. It also turns on dry-run mode, which previews the evictions without making them:",
          ],
        },
        {
          kind: "code",
          lang: "yaml",
          code: "# pack-values.yaml\nkind: Deployment\ndeschedulingInterval: 5m\ncmdOptions:\n  v: 3\n  dry-run: true\ndeschedulerPolicy:\n  profiles:\n    - name: pack\n      pluginConfig:\n        - name: DefaultEvictor\n          args:\n            nodeFit: true\n        - name: HighNodeUtilization\n          args:\n            thresholds:\n              cpu: 20\n              memory: 20\n      plugins:\n        balance:\n          enabled:\n            - HighNodeUtilization",
        },
        {
          kind: "ol",
          start: 2,
          items: [
            "Install the chart version whose minor matches your cluster’s, such as 0.33.0 for Kubernetes 1.33. Since v0.18, each release pairs with one Kubernetes minor version, up to v0.37 with 1.37. Each release is tested only against its own minor and the two before it.",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "helm repo add descheduler https://kubernetes-sigs.github.io/descheduler/\nhelm install descheduler descheduler/descheduler --namespace kube-system --version <chart-version> -f pack-values.yaml",
        },
        {
          kind: "ol",
          start: 3,
          items: [
            "Read the descheduler’s logs until the evictions it reports are the ones you expect.",
            ["Set ", { code: "MostAllocated" }, " scoring, as below."],
            "Check that every app it would touch has a PDB and a second replica. A real eviction restarts the pod elsewhere.",
            [
              "Set ",
              { code: "dry-run" },
              " to ",
              { code: "false" },
              " and run ",
              { code: "helm upgrade" },
              " to make the evictions real.",
            ],
          ],
        },
        { kind: "p", text: ["Both clouds let you set ", { code: "MostAllocated" }, ":"] },
        {
          kind: "ul",
          items: [
            [
              { b: "EKS:" },
              " advanced control plane configuration sets kube-scheduler’s ",
              { code: "nodeResourcesFit.scoringStrategy" },
              " to ",
              { code: "MostAllocated" },
              " on Kubernetes 1.31 or later.",
            ],
            [
              { b: "AKS:" },
              " scheduler profiles on Kubernetes 1.33 or later set ",
              { code: "NodeResourcesFit" },
              " to ",
              { code: "MostAllocated" },
              ". A profile applies to pods that name it in ",
              { code: "schedulerName" },
              ", or to the whole cluster under ",
              { code: "default-scheduler" },
              ".",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Kubernetes bin packing", href: "/learn/kubernetes-bin-packing" },
            " has the setup steps for AKS and EKS.",
          ],
        },
        {
          kind: "p",
          text: "Packing has a cost. The EKS documentation notes that more pods are affected at once when a densely packed node becomes unhealthy or its instance is retired.",
        },
      ],
    },
    {
      id: "kubernetes-descheduler-alternatives-your-autoscaler-may-already",
      title: "When to use it",
      blocks: [
        {
          kind: "p",
          text: "A node costs money until something deletes it, and that’s your autoscaler’s job. Check what it already does before you add a second component that evicts pods on its own schedule.",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Cluster Autoscaler:" },
              " every 10 seconds by default, it looks for nodes to remove. A node qualifies when its CPU and memory requests are each under 50% of allocatable and all its pods can move. A node unneeded for 10 minutes is drained and removed, one non-empty node at a time.",
            ],
            [
              { b: "Karpenter:" },
              " consolidation with ",
              { code: "consolidationPolicy: WhenEmptyOrUnderutilized" },
              ", the default, removes or replaces any node it can to reduce cost. ",
              { code: "WhenEmpty" },
              " removes only empty nodes. On AKS, ",
              { a: "node auto provisioning (NAP)", href: "/learn/aks-node-auto-provisioning" },
              " is based on Karpenter.",
            ],
            [
              { b: "Scheduler scoring:" },
              " ",
              { code: "MostAllocated" },
              " packs new pods only. Running pods stay where they are until something evicts or restarts them.",
            ],
          ],
        },
        { kind: "p", text: "The descheduler earns its place where autoscalers don’t look:" },
        {
          kind: "ul",
          items: [
            "a pod left on a node whose taints or labels changed",
            "replicas bunched onto one node after an outage",
            [
              "a ",
              { a: "topology spread", href: "/learn/topology-spread-constraints" },
              " that drifted",
            ],
            "a pod restarting on a node that can’t attach its volume",
          ],
        },
        {
          kind: "p",
          text: "By default, the scheduler, the descheduler and the Cluster Autoscaler all judge a node by requests, not use. A node whose pods request 60% of its CPU but use 15% looks busy to all three, so none of them empties it.",
        },
        { kind: "svg", figure: figure3 },
        {
          kind: "p",
          text: [
            "So set requests to real use first, then remove nodes. The ",
            { a: "Kubernetes cost optimization guide", href: "/kubernetes-cost-optimization" },
            " follows that order.",
          ],
        },
      ],
    },
    {
      id: "how-coral-empties-lightly-used-nodes",
      title: "How Coral empties nodes",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " moves pods off lightly used nodes on AKS and EKS, without any downtime. In “Dry run”, it lists the nodes it would empty in the Event log and moves no pod.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Checks first." },
              " Before it drains a node, Coral checks on the live cluster that every pod fits on another Ready node. The check covers affinity, taints, spread, ports and zones.",
            ],
            [
              { b: "One node at a time." },
              " A warm handover comes first: a replacement starts on another node and is Ready before the old pod goes. Otherwise Coral uses live migration where both nodes support it, or eviction within the pod’s PDB.",
            ],
            [
              { b: "Your autoscaler deletes." },
              " Coral hands each empty node to your autoscaler, and deletes a machine itself only in fixed-size pools that nothing else manages. Pools that Karpenter or NAP already consolidate are left to them.",
            ],
          ],
        },
        {
          kind: "p",
          text: "With “Automatically optimize” on, Coral also rebalances CPU and memory requests to real use, so nodes stop looking fuller than they are.",
        },
        {
          kind: "p",
          text: [
            { a: "The Coral guide", href: "/coral-guide#the-evictor" },
            " lists its switches and their defaults.",
          ],
        },
        {
          kind: "p",
          text: [
            "On our own AKS development cluster, Coral moved the apps off one 4-CPU worker and removed it in under 10 minutes. That reduced the cluster’s machine cost by $147.46 a month. ",
            { a: "The Coral Value Lab study", href: "/coral-value-lab" },
            " has the full run.",
          ],
        },
      ],
    },
  ],
  help: {
    product: "coral",
    text: "Coral rebalances CPU and memory requests on AKS and EKS, works with your HPA, and removes the nodes you don’t need, without any downtime. We estimate 40–50% off AKS and EKS cost, a range rather than a promise. The free assessment works out your own figure.",
    links: [
      { label: "Kubernetes optimization with Coral", href: "/coral" },
      { label: "Estimate your saving", href: "/assessment?p=coral" },
    ],
  },
  sources: [
    {
      publisher: "Kubernetes SIGs",
      title: "“Descheduler for Kubernetes”",
      url: "https://github.com/kubernetes-sigs/descheduler/tree/release-1.37",
      note: " (README and source code, release-1.37, with release-1.33 and the v0.34.0 release notes for what changed in v0.34)",
    },
    {
      publisher: "Kubernetes SIGs",
      title: "“Descheduler for Kubernetes”",
      url: "https://github.com/kubernetes-sigs/descheduler/tree/release-1.37/charts/descheduler",
      note: " Helm chart (README and values.yaml, release-1.37)",
    },
    {
      publisher: "AWS",
      title: "“Advanced Kubernetes control plane configuration”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/control-plane-configuration.html",
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
    {
      publisher: "Kubernetes Autoscaler",
      title: "“Cluster Autoscaler FAQ”",
      url: "https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md",
    },
    {
      publisher: "Karpenter",
      title: "“Disruption”",
      url: "https://karpenter.sh/docs/concepts/disruption/",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Overview of node auto-provisioning (NAP) in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/node-auto-provisioning",
    },
  ],
  related: [
    {
      title: "Kubernetes bin packing",
      where: "Learn",
      href: "/learn/kubernetes-bin-packing",
    },
    {
      title: "Cluster Autoscaler not scaling down",
      where: "Learn",
      href: "/learn/cluster-autoscaler-not-scaling-down",
    },
    {
      title: "Pod disruption budget best practices",
      where: "Learn",
      href: "/learn/pod-disruption-budget-best-practices",
    },
    {
      title: "Karpenter consolidation",
      where: "Learn",
      href: "/learn/karpenter-consolidation",
    },
  ],
  relatedTitle: "More on packing and emptying nodes",
};
