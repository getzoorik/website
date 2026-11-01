import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/kubernetes-descheduler/1";
import { figure as figure2 } from "@/features/learn/figures/kubernetes-descheduler/2";
import { figure as figure3 } from "@/features/learn/figures/kubernetes-descheduler/3";

export const article: Article = {
  slug: "kubernetes-descheduler",
  title: "Kubernetes descheduler: what it moves and when",
  meta: "What the Kubernetes descheduler evicts, LowNodeUtilization vs HighNodeUtilization, a dry-run Helm example, and when your autoscaler already does the job.",
  h1: "Kubernetes descheduler: what it moves and when to use it",
  deck: "It evicts pods that no longer belong on their node. It never picks the next node, and it never removes one.",
  card: "What the descheduler evicts, LowNodeUtilization vs HighNodeUtilization, and a Helm example in dry-run mode.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Node lifecycle and scheduling",
  published: "2026-11-01",
  updated: "2026-11-01",
  author: "iqbal",
  cover: "/learn-covers/zoorik-learn-kubernetes-descheduler-1200x630.webp",
  coverAlt:
    "Kubernetes descheduler: it evicts a pod from a busy node to a light one by requests, and no node is deleted",
  short:
    "The Kubernetes descheduler evicts pods from nodes where they no longer belong, so the scheduler can place their replacements better. Most strategies target pods that break a placement rule, keep restarting or have failed, and the descheduler never schedules a pod or deletes a node.",
  sections: [
    {
      id: "kubernetes-descheduler",
      title: "The Kubernetes descheduler evicts pods so the scheduler can place them again",
      blocks: [
        {
          kind: "p",
          text: "Picture three identical nodes after one fails. Its pods restart on the other two, and its replacement joins almost empty. Requests on node-a, node-b and node-c sit at 70%, 45% and 10% of each node’s allocatable resources.",
        },
        {
          kind: "p",
          text: "Nothing moves them back. Kubernetes picks a node for each new pod once, and Amazon’s EKS documentation puts it plainly: “The Kubernetes scheduler never relocates a pod that is already running.”",
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
          text: "When the descheduler, a SIG Scheduling project, finds pods like these, it evicts them. Choosing where they go next isn’t its job. The pod’s controller creates a replacement, and the default scheduler places it by the same rules as the first time.",
        },
        {
          kind: "p",
          text: [
            "Every eviction goes through the Eviction API. So a ",
            { a: "PodDisruptionBudget", href: "/learn/pod-disruption-budget-best-practices" },
            ", or PDB, that allows no more disruptions keeps the pod where it is. Removing a node that ends up empty is your autoscaler’s job.",
          ],
        },
        { kind: "svg", figure: figure1 },
        { kind: "p", text: "Under the default settings, these pods are never evicted:" },
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
            "pods that no ReplicaSet, StatefulSet, Job or ReplicationController owns, because nothing would recreate them",
            "DaemonSet pods",
            "pods with local storage, which in the descheduler’s code means an emptyDir or hostPath volume",
          ],
        },
        {
          kind: "p",
          text: "Pods are evicted even if they use a Persistent Volume Claim (PVC), unless you protect them.",
        },
      ],
    },
    {
      id: "ten-strategies-and-only-two-of-them",
      title: "Descheduler strategies: only two of the ten look at how full a node is",
      blocks: [
        {
          kind: "p",
          text: "The descheduler calls its strategies plugins. Deschedule plugins judge pods one at a time. Balance plugins judge a group of pods against how it was meant to be spread.",
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
      title: "LowNodeUtilization spreads pods, and HighNodeUtilization packs them",
      blocks: [
        {
          kind: "p",
          text: "Both utilization strategies measure a node by what its pods request, as a percentage of the node’s allocatable CPU, memory and pod capacity.",
        },
        {
          kind: "p",
          text: [
            "Actual use doesn’t count by default, so ",
            { code: "kubectl top" },
            " can tell a different story. LowNodeUtilization can read real usage from Metrics Server or Prometheus instead. HighNodeUtilization can’t yet.",
          ],
        },
        {
          kind: "h3",
          id: "lownodeutilization-fills-lightly-used-nodes",
          title: "LowNodeUtilization fills lightly used nodes",
        },
        {
          kind: "p",
          text: [
            "Descheduler LowNodeUtilization takes two maps, ",
            { code: "thresholds" },
            " and ",
            { code: "targetThresholds" },
            ". A node under ",
            { code: "thresholds" },
            " for every resource is underutilized. A node over ",
            { code: "targetThresholds" },
            " for any one resource is overutilized.",
          ],
        },
        {
          kind: "p",
          text: "The strategy evicts pods from the overutilized nodes and expects their replacements to land on the underutilized ones. It does nothing when either group is empty.",
        },
        {
          kind: "p",
          text: [
            "When it reads usage from Prometheus, it evicts at most one pod from each overutilized node per cycle, unless ",
            { code: "evictionLimits.node" },
            " allows more.",
          ],
        },
        {
          kind: "h3",
          id: "highnodeutilization-empties-them",
          title: "HighNodeUtilization empties them",
        },
        {
          kind: "p",
          text: [
            "HighNodeUtilization takes only ",
            { code: "thresholds" },
            ". Pods on underutilized nodes are evicted so they’re recreated on busier ones. The project describes the strategy as a way to trigger scale-down when you run node autoscaling.",
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            "The project’s README says HighNodeUtilization must be paired with the scheduler’s ",
            { code: "MostAllocated" },
            " scoring strategy. Under the default, ",
            { code: "LeastAllocated" },
            ", the scheduler prefers less-allocated nodes, which can send the replacements straight back to the node that was just emptied.",
          ],
        },
        {
          kind: "h3",
          id: "the-same-three-nodes-under-each-strategy",
          title: "The same three nodes under each strategy",
        },
        {
          kind: "p",
          text: [
            "The Helm chart’s default policy turns on LowNodeUtilization, with ",
            { code: "thresholds" },
            " of 20% and ",
            { code: "targetThresholds" },
            " of 50%. If your goal is fewer nodes, change that before you install.",
          ],
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "Under the chart’s defaults, node-a’s 70% is over 50%, node-c’s 10% is under 20%, and node-b’s 45% is in neither group. LowNodeUtilization evicts from node-a and expects the replacements on node-c, which stays in service.",
        },
        {
          kind: "p",
          text: [
            "HighNodeUtilization at the 20% ",
            { code: "thresholds" },
            " in the example below evicts node-c’s pods instead. ",
            { code: "MostAllocated" },
            " then prefers the busier node-a, which has room (70% + 10% = 80%).",
          ],
        },
        {
          kind: "p",
          text: "Three nodes can become two. Removing node-c reduces the pool’s machine cost by a third.",
        },
        { kind: "svg", figure: figure2 },
      ],
    },
    {
      id: "how-a-kubernetes-descheduler-policy-decides-what",
      title: "How a Kubernetes descheduler policy decides what to evict",
      blocks: [
        {
          kind: "p",
          text: [
            "Each policy is a ",
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
          text: "Its top level holds limits that apply to every eviction, all unlimited when unset:",
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
            "Below them sit one or more profiles. Each has a ",
            { code: "pluginConfig" },
            " list of each plugin’s arguments and a ",
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
          text: "The DefaultEvictor plugin filters pods for every strategy, and three of its arguments do most of the safety work:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Node fit:" },
              " with ",
              { code: "nodeFit" },
              " on (it’s off by default), a pod is evicted only if another node could take it. That node must match the pod’s node selector and node affinity, and the pod must tolerate its taints. It also needs free capacity for the pod’s requests and can’t be unschedulable, and pod anti-affinity must allow the move.",
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
              ", new in v0.34, switches built-in protections off under ",
              { code: "defaultDisabled" },
              ". It adds others under ",
              { code: "extraEnabled" },
              ", such as ",
              { code: "PodsWithPVC" },
              " or ",
              { code: "PodsWithoutPDB" },
              ". Older releases such as v0.33 set the same protections with booleans like ",
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
            " annotation. Each strategy decides whether to respect it. It binds for all of them only when DefaultEvictor sets ",
            { code: "noEvictionPolicy" },
            " to ",
            { code: "Mandatory" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "At ",
            { code: "--v=4" },
            " or higher, the descheduler logs why each skipped pod wasn’t evictable.",
          ],
        },
      ],
    },
    {
      id: "install-the-descheduler-helm-chart-in-dry",
      title: "Install the descheduler Helm chart in dry-run mode first",
      blocks: [
        {
          kind: "p",
          text: [
            "The chart comes from the project itself, and its version tracks the descheduler’s. As a Job, a CronJob or a Deployment, the descheduler runs in ",
            { code: "kube-system" },
            " as a critical pod, so it isn’t evicted itself.",
          ],
        },
        {
          kind: "p",
          text: "By default the chart runs a CronJob every 2\u00a0minutes, with a profile that enables seven strategies:",
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
          text: "It also changes two protections. Pods with a PVC are protected, and pods with local storage are not. So with the chart’s defaults, a pod with an emptyDir or hostPath volume can be evicted.",
        },
        {
          kind: "h3",
          id: "a-kubernetes-descheduler-example-pack-nodes-for",
          title: "A Kubernetes descheduler example: pack nodes for scale-down",
        },
        {
          kind: "ol",
          items: [
            "Write a values file. It replaces the default profile with HighNodeUtilization alone and runs the descheduler as a Deployment every 5\u00a0minutes. It also turns on dry-run mode, which previews the evictions without making them:",
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
            "Install the chart version whose minor matches your cluster’s, such as 0.33.0 for Kubernetes 1.33. The project’s compatibility matrix pairs each release since v0.18 with one Kubernetes minor version: the current v0.37, of October 2026, with 1.37. It also says a release is tested only against the three latest minor versions.",
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
              " to make those evictions real.",
            ],
          ],
        },
        { kind: "p", text: ["Both clouds now let you set ", { code: "MostAllocated" }, ":"] },
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
              ". You turn them on with ",
              { code: "--enable-upstream-kubescheduler-user-configuration" },
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
          text: "Packing has a cost the EKS documentation spells out. When a densely packed node becomes unhealthy or its instance is retired, more pods are affected at once.",
        },
      ],
    },
    {
      id: "kubernetes-descheduler-alternatives-your-autoscaler-may-already",
      title: "Kubernetes descheduler alternatives: your autoscaler may already remove the node",
      blocks: [
        {
          kind: "p",
          text: "If the aim is to reduce cloud cost, the eviction is the small part. A node costs money until something deletes it, and that’s your autoscaler’s job. Check what it already does before you add a second component that evicts pods on its own schedule.",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Cluster Autoscaler:" },
              " by default, it checks every 10\u00a0seconds for nodes it could remove. A node qualifies when its summed CPU and memory requests are under 50% of allocatable and its pods can all move. A node unneeded for 10\u00a0minutes is drained and removed, one non-empty node at a time.",
            ],
            [
              { b: "Karpenter:" },
              " consolidation with ",
              { code: "consolidationPolicy: WhenEmptyOrUnderutilized" },
              ", the default, removes or replaces any node it can to reduce cost. ",
              { code: "WhenEmpty" },
              " removes only empty nodes. On AKS, ",
              { a: "node auto-provisioning (NAP)", href: "/learn/aks-node-auto-provisioning" },
              " is based on Karpenter.",
            ],
            [
              { b: "Scheduler scoring:" },
              " ",
              { code: "MostAllocated" },
              " alone packs new pods only. Running pods stay where they are until something evicts or restarts them.",
            ],
          ],
        },
        { kind: "p", text: "The descheduler earns its place where the autoscalers don’t look:" },
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
            "Requests that match real use come first and node removal second. That’s the order the ",
            { a: "Kubernetes cost optimization guide", href: "/kubernetes-cost-optimization" },
            " follows. ",
            { a: "Kubernetes bin packing", href: "/learn/kubernetes-bin-packing" },
            " explains why placement alone never empties a node, even with the scheduler set to pack.",
          ],
        },
      ],
    },
    {
      id: "how-coral-empties-lightly-used-nodes",
      title: "How Coral empties lightly used nodes",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " optimizes Kubernetes on AKS and EKS, and ",
            { a: "empties lightly used nodes", href: "/coral-guide#the-evictor" },
            " inside your cluster:",
          ],
        },
        {
          kind: "ul",
          items: [
            "it moves pods off lightly used nodes and leaves each empty node to your autoscaler",
            "it has a “Dry run” that lists the nodes it would empty in the Event log, without moving any pod",
          ],
        },
        { kind: "p", text: "The Coral guide lists its switches and their defaults." },
        {
          kind: "p",
          text: "Node optimization handles the rest. Before it drains a node, Coral checks on the live cluster that every pod fits on another Ready node. The check takes in affinity, taints, spread, ports and zones.",
        },
        {
          kind: "p",
          text: "Coral cordons and drains one node at a time. Where a Deployment or Argo Rollout qualifies, Coral first starts a replacement on another node. It waits until that copy is Ready before the old pod goes.",
        },
        {
          kind: "p",
          text: "Other pods are evicted within their PDB, so a single-replica app among them restarts briefly.",
        },
        {
          kind: "p",
          text: "Coral hands each empty node to your autoscaler, and removes the machine itself only in fixed-size pools that nothing else manages. It never overrides a PDB. Pools that Karpenter or NAP already consolidate are left to them.",
        },
        {
          kind: "p",
          text: "Once you switch on “Automatically optimize”, Coral also rebalances CPU and memory requests to real use. Nodes then stop looking fuller than they are.",
        },
        {
          kind: "p",
          text: "On our own AKS development cluster, Coral moved the apps off one 4-CPU worker and removed it in under 10\u00a0minutes. That reduced the cluster’s machine cost by $147.46 a month. Apps that ran a single copy restarted once on another machine.",
        },
        {
          kind: "p",
          text: [{ a: "The case study", href: "/coral-value-lab" }, " has the full run."],
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
      title: "Kubernetes bin packing: fewer nodes for the same pods",
      where: "Learn",
      href: "/learn/kubernetes-bin-packing",
    },
    {
      title: "Cluster Autoscaler not scaling down: what keeps nodes running",
      where: "Learn",
      href: "/learn/cluster-autoscaler-not-scaling-down",
    },
    {
      title: "Pod disruption budget best practices for AKS and EKS",
      where: "Learn",
      href: "/learn/pod-disruption-budget-best-practices",
    },
    {
      title: "Karpenter consolidation: policies, budgets and limits",
      where: "Learn",
      href: "/learn/karpenter-consolidation",
    },
  ],
};
