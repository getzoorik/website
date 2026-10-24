import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/kubernetes-descheduler/1";

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
  published: "2026-11-15",
  updated: "2026-11-15",
  author: "iqbal",
  short:
    "The Kubernetes descheduler is a SIG Scheduling project that evicts pods from nodes where they no longer belong, so the default scheduler can place their replacements better. It never schedules a pod or deletes a node. Most strategies target pods that break a placement rule, keep restarting or have failed. Two balance nodes by requests: LowNodeUtilization evicts pods from busy nodes so they land on lightly used ones, and HighNodeUtilization empties lightly used nodes for your autoscaler to remove.",
  sections: [
    {
      id: "what-the-kubernetes-descheduler-does",
      title: "What the Kubernetes descheduler does",
      blocks: [
        {
          kind: "p",
          text: [
            "Kubernetes picks a node for each new pod once. Amazon’s EKS documentation puts it plainly: “The Kubernetes scheduler never relocates a pod that is already running.” So placement drifts. A node gains a taint or loses a label, an ",
            { a: "affinity rule", href: "/learn/pod-affinity-vs-node-affinity" },
            " stops matching, the pods from a failed node pile onto the survivors, or new nodes join and sit empty.",
          ],
        },
        {
          kind: "p",
          text: [
            "When the descheduler finds pods like these, it evicts them. Choosing where they go next isn’t its job: the pod’s controller creates a replacement, and the default scheduler places it by the same rules it used the first time. Every eviction goes through the Eviction API, so a ",
            { a: "PodDisruptionBudget (PDB)", href: "/learn/pod-disruption-budget-best-practices" },
            " that allows no more disruptions keeps the pod where it is.",
          ],
        },
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
          text: [
            "Pods with a Persistent Volume Claim (PVC) are evicted unless you protect them. The descheduler runs as a Job, a CronJob or a Deployment in ",
            { code: "kube-system" },
            ", as a critical pod so it isn’t evicted itself. The project’s compatibility matrix pairs each release since v0.18 with one Kubernetes minor version (the current release, v0.37 of October 2026, with 1.37) and says a release is tested only against the three latest minor versions. The safe pick is the release whose minor version matches your cluster’s: v0.33 for Kubernetes 1.33.",
          ],
        },
      ],
    },
    {
      id: "the-strategies-and-lownodeutilization-vs-highnodeutilization",
      title: "The strategies, and LowNodeUtilization vs HighNodeUtilization",
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
        {
          kind: "p",
          text: [
            "Both utilization strategies measure a node by what its pods request, as a percentage of the node’s allocatable CPU, memory and pod capacity. Actual use doesn’t count by default, so ",
            { code: "kubectl top" },
            " can tell a different story. LowNodeUtilization can read real usage from Metrics Server or Prometheus instead. HighNodeUtilization can’t yet.",
          ],
        },
        { kind: "h3", id: "lownodeutilization", title: "LowNodeUtilization" },
        {
          kind: "p",
          text: [
            "Descheduler LowNodeUtilization takes two maps, ",
            { code: "thresholds" },
            " and ",
            { code: "targetThresholds" },
            ". A node under ",
            { code: "thresholds" },
            " for every resource is underutilized, and a node over ",
            { code: "targetThresholds" },
            " for any one resource is overutilized. The strategy evicts pods from the overutilized nodes, expecting their replacements to land on the underutilized ones, and it does nothing when either group is empty. When it reads usage from Prometheus, it evicts at most one pod from each overutilized node per cycle, unless ",
            { code: "evictionLimits.node" },
            " allows more.",
          ],
        },
        { kind: "h3", id: "highnodeutilization", title: "HighNodeUtilization" },
        {
          kind: "p",
          text: [
            "HighNodeUtilization takes only ",
            { code: "thresholds" },
            ". Pods are evicted from underutilized nodes so they’re recreated on busier ones, and the project describes the strategy as a way to trigger scale-down when you run node autoscaling. Its README says it must be paired with the scheduler’s ",
            { code: "MostAllocated" },
            " scoring strategy. Under the default, ",
            { code: "LeastAllocated" },
            ", the scheduler prefers less-allocated nodes, which can send the replacements straight back to the node that was just emptied.",
          ],
        },
        {
          kind: "p",
          text: [
            "So the two pull in opposite directions. LowNodeUtilization fills lightly used nodes, which keeps them in service. HighNodeUtilization empties them. The Helm chart’s default policy turns on LowNodeUtilization, with ",
            { code: "thresholds" },
            " of 20% and ",
            { code: "targetThresholds" },
            " of 50%, so if your goal is fewer nodes, change that before you install.",
          ],
        },
        { kind: "diagram", figure: figure1 },
      ],
    },
    {
      id: "how-a-kubernetes-descheduler-policy-is-built",
      title: "How a Kubernetes descheduler policy is built",
      blocks: [
        {
          kind: "p",
          text: [
            "Each policy is a ",
            { code: "DeschedulerPolicy" },
            " object, still at API version ",
            { code: "descheduler/v1alpha2" },
            ", passed to the binary with ",
            { code: "--policy-config-file" },
            ". Its top level holds limits that apply to every eviction: ",
            { code: "maxNoOfPodsToEvictPerNode" },
            ", ",
            { code: "maxNoOfPodsToEvictPerNamespace" },
            " and ",
            { code: "maxNoOfPodsToEvictTotal" },
            " (per cycle), all unlimited when unset. Below them sit one or more profiles. Each profile has a ",
            { code: "pluginConfig" },
            " list with each plugin’s arguments, and a ",
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
          text: [
            "The DefaultEvictor plugin filters pods for every strategy, and three of its arguments do most of the safety work. With ",
            { code: "nodeFit" },
            " on (it’s off by default), a pod is evicted only if another node could take it, judged by its node selector, its tolerations against the other nodes’ taints, its node affinity, its requests against free capacity, unschedulable nodes and pod anti-affinity. ",
            { code: "minReplicas" },
            " spares pods whose owner runs fewer replicas than its value. ",
            { code: "podProtections" },
            " switches built-in protections off under ",
            { code: "defaultDisabled" },
            " and adds others under ",
            { code: "extraEnabled" },
            ", such as ",
            { code: "PodsWithPVC" },
            " or ",
            { code: "PodsWithoutPDB" },
            ". ",
            { code: "podProtections" },
            " arrived in v0.34, and older releases such as v0.33 set the same protections with booleans like ",
            { code: "ignorePvcPods" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "From v0.34, a pod can ask to stay with the ",
            { code: "descheduler.alpha.kubernetes.io/prefer-no-eviction" },
            " annotation. Each strategy decides whether to respect it, and it binds for all of them only when DefaultEvictor sets ",
            { code: "noEvictionPolicy" },
            " to ",
            { code: "Mandatory" },
            ". At ",
            { code: "--v=4" },
            " or higher, the descheduler logs why each skipped pod wasn’t evictable.",
          ],
        },
      ],
    },
    {
      id: "install-the-descheduler-helm-chart",
      title: "Install the descheduler Helm chart",
      blocks: [
        {
          kind: "p",
          text: "The chart comes from the project itself, and its version tracks the descheduler’s. By default it runs a CronJob every 2\u00a0minutes, and its default profile enables seven strategies: RemoveDuplicates, RemovePodsViolatingTopologySpreadConstraint and LowNodeUtilization as balance plugins, and RemovePodsHavingTooManyRestarts (at 100 restarts), RemovePodsViolatingNodeTaints, RemovePodsViolatingNodeAffinity and RemovePodsViolatingInterPodAntiAffinity as deschedule plugins. It also changes two protections. Pods with a PVC are protected, and pods with local storage are not, so with the chart’s defaults a pod with an emptyDir or hostPath volume can be evicted.",
        },
        {
          kind: "h3",
          id: "a-kubernetes-descheduler-example-pack-nodes-for",
          title: "A Kubernetes descheduler example: pack nodes for scale-down",
        },
        {
          kind: "p",
          text: "This values file replaces the default profile with HighNodeUtilization alone, runs the descheduler as a Deployment every 5\u00a0minutes, and turns on dry-run mode, which previews the evictions without making them:",
        },
        {
          kind: "code",
          lang: "yaml",
          code: "# pack-values.yaml\nkind: Deployment\ndeschedulingInterval: 5m\ncmdOptions:\n  v: 3\n  dry-run: true\ndeschedulerPolicy:\n  profiles:\n    - name: pack\n      pluginConfig:\n        - name: DefaultEvictor\n          args:\n            nodeFit: true\n        - name: HighNodeUtilization\n          args:\n            thresholds:\n              cpu: 20\n              memory: 20\n      plugins:\n        balance:\n          enabled:\n            - HighNodeUtilization",
        },
        {
          kind: "p",
          text: "Pick the chart version whose minor matches your cluster, such as 0.33.0 for Kubernetes 1.33:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "helm repo add descheduler https://kubernetes-sigs.github.io/descheduler/\nhelm install descheduler descheduler/descheduler --namespace kube-system --version <chart-version> -f pack-values.yaml",
        },
        {
          kind: "p",
          text: [
            "Read the descheduler’s logs until the evictions it reports are the ones you expect. A real eviction restarts the pod elsewhere, so check that every app it would touch has a PDB and a second replica. Then set ",
            { code: "dry-run" },
            " to ",
            { code: "false" },
            " and run ",
            { code: "helm upgrade" },
            " to make those evictions real.",
          ],
        },
        {
          kind: "p",
          text: [
            "HighNodeUtilization also needs ",
            { code: "MostAllocated" },
            " scoring, and both clouds now let you set it:",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              "On EKS, advanced control plane configuration sets kube-scheduler’s ",
              { code: "nodeResourcesFit.scoringStrategy" },
              " to ",
              { code: "MostAllocated" },
              " on Kubernetes 1.31 or later.",
            ],
            [
              "On AKS, scheduler profiles on Kubernetes 1.33 or later set ",
              { code: "NodeResourcesFit" },
              " to ",
              { code: "MostAllocated" },
              " for pods that name the profile in ",
              { code: "schedulerName" },
              ", or for the whole cluster under ",
              { code: "default-scheduler" },
              ". You turn them on with ",
              { code: "--enable-upstream-kubescheduler-user-configuration" },
              ". In October 2026 Microsoft’s setup guide asks for Azure CLI 2.90.0 or later, with no extension or feature flag, but its bin-packing guide still lists the preview-era prerequisites: Azure CLI 2.76.0 or later, the aks-preview CLI extension version 18.0.0b27 or later, and the ",
              { code: "UserDefinedSchedulerConfigurationPreview" },
              " feature flag.",
            ],
          ],
        },
        {
          kind: "p",
          text: "Packing has a cost the EKS documentation spells out: when a densely packed node becomes unhealthy or its instance is retired, more pods are affected at once.",
        },
      ],
    },
    {
      id: "kubernetes-descheduler-alternatives-for-removing-nodes",
      title: "Kubernetes descheduler alternatives for removing nodes",
      blocks: [
        {
          kind: "p",
          text: "If the aim is a smaller bill, the eviction is the small part: a node costs money until something deletes it, and that’s your autoscaler’s job. Check what it already does before you add a second component that evicts pods on its own schedule.",
        },
        {
          kind: "ul",
          items: [
            "By default, the Cluster Autoscaler looks every 10\u00a0seconds for nodes whose summed CPU and memory requests are under 50% of allocatable and whose pods can all move. A node unneeded for 10\u00a0minutes is drained and removed, one non-empty node at a time.",
            [
              "Karpenter consolidation, with ",
              { code: "consolidationPolicy: WhenEmptyOrUnderutilized" },
              " (the default), removes or replaces any node it can to reduce cost, while ",
              { code: "WhenEmpty" },
              " removes only empty nodes. On AKS, ",
              { a: "node auto-provisioning (NAP)", href: "/learn/aks-node-auto-provisioning" },
              " is based on Karpenter.",
            ],
            [
              { code: "MostAllocated" },
              " scoring on its own packs new pods only. Running pods stay where they are until something evicts or restarts them.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "The descheduler earns its place where the autoscalers don’t look: a pod left on a node whose taints or labels changed, replicas bunched onto one node after an outage, a ",
            { a: "topology spread", href: "/learn/topology-spread-constraints" },
            " that drifted, or a pod restarting on a node that can’t attach its volume.",
          ],
        },
        {
          kind: "p",
          text: [
            "By default, the scheduler, the descheduler and the Cluster Autoscaler all judge a node by requests, not use. A node whose pods request 60% of its CPU but use 15% looks busy to all three, so none of them empties it. Requests that match real use come first and node removal second. That’s the order the guide to ",
            { a: "reducing Kubernetes cost", href: "/learn/reduce-kubernetes-cost" },
            " follows, and ",
            { a: "bin packing", href: "/learn/kubernetes-bin-packing" },
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
            " optimizes Kubernetes on AKS and EKS, and its Evictor does the node-emptying part of this job inside your cluster. Despite the name, it’s a part of Coral, not the descheduler’s DefaultEvictor plugin. The Evictor:",
          ],
        },
        {
          kind: "ul",
          items: [
            "moves pods off lightly used nodes and leaves each empty node to your autoscaler",
            "drains only in node pools whose setting allows it, which is off by default",
            "checks every 60\u00a0seconds by default",
            "never deletes a machine and never overrides a PDB",
            "has a “Dry run” that lists the nodes it would empty in the Event log, without moving any pod",
          ],
        },
        {
          kind: "p",
          text: "Node optimization handles the rest. Before it drains a node, Coral checks on the live cluster that every pod fits on another Ready node, with its affinity, taints, spread, ports and zones. It cordons and drains one node at a time. Where a Deployment or Argo Rollout qualifies, Coral first starts a replacement on another node and waits until it’s Ready before the old pod goes. Other pods are evicted within their PDB, so a single-replica app among them restarts briefly. After “Wait before removing empty nodes” (5\u00a0minutes by default), it hands the empty node to your autoscaler, and it deletes the machine itself only in fixed-size pools that nothing else manages. Pools that Karpenter or NAP already consolidate are left to them. Once you switch on “Automatically optimize”, Coral also rebalances CPU and memory requests to real use, so nodes stop looking fuller than they are.",
        },
        {
          kind: "p",
          text: [
            "On our own AKS development cluster, Coral moved the apps off one 4-CPU worker and removed it in under 10\u00a0minutes, which reduced the machine bill by $147.46 a month. Apps that ran a single copy restarted once on another machine. ",
            { a: "The case study", href: "/case-studies/coral-dev-cluster" },
            " has the full run.",
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
    { title: "Consolidation", where: "Coral product guide", href: "/coral/guide#consolidation" },
  ],
};
