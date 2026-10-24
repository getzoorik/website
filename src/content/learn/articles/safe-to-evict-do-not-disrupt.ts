import type { Article } from "@/content/learn/article";

export const article: Article = {
  slug: "safe-to-evict-do-not-disrupt",
  title: "Safe-to-evict and do-not-disrupt annotations",
  meta: "What safe-to-evict and karpenter.sh/do-not-disrupt do, which autoscaler reads each, why emptyDir and hostPath pods hold nodes, and when to drop a marker.",
  h1: "The safe-to-evict and do-not-disrupt annotations explained",
  deck: "Two annotations decide whether an autoscaler may move a pod, and so whether its node can go.",
  card: "What safe-to-evict and do-not-disrupt do, which autoscaler reads each, and what a held node costs.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Node lifecycle and scheduling",
  published: "2026-10-29",
  updated: "2026-10-29",
  author: "sonia",
  short: [
    "The ",
    { code: "cluster-autoscaler.kubernetes.io/safe-to-evict" },
    " and ",
    { code: "karpenter.sh/do-not-disrupt" },
    " annotations tell a node autoscaler whether it may evict a pod, and so whether that pod’s node can be removed. The Cluster Autoscaler reads safe-to-evict: ",
    { code: '"false"' },
    " holds the node, and ",
    { code: '"true"' },
    " releases pods it would otherwise keep, such as ones with emptyDir or hostPath data. Karpenter, AKS node auto-provisioning and EKS Auto Mode read do-not-disrupt, which keeps the node out of consolidation.",
  ],
  sections: [
    {
      id: "what-the-two-annotations-decide",
      title: "What the two annotations decide",
      blocks: [
        {
          kind: "p",
          text: "To remove a node, an autoscaler first evicts the pods on it. So before it picks a node, it checks whether each pod may move. Most of that check reads things you already have: PodDisruptionBudgets (PDBs), the controller that owns the pod, its scheduling rules. The two annotations are the part you write by hand, one workload at a time.",
        },
        {
          kind: "p",
          text: [
            "Each one belongs to a single autoscaler. The Cluster Autoscaler’s FAQ documents the safe to evict annotation for Kubernetes pods and never mentions Karpenter’s. Karpenter’s disruption docs document ",
            { code: "do-not-disrupt" },
            " and say nothing about safe-to-evict. On Azure Kubernetes Service (AKS), ",
            { a: "node auto-provisioning (NAP)", href: "/learn/aks-node-auto-provisioning" },
            " documents ",
            { code: "karpenter.sh/do-not-disrupt" },
            " too, and so does EKS Auto Mode on Amazon Elastic Kubernetes Service (EKS).",
          ],
        },
        {
          kind: "p",
          text: [
            "So set the annotation your autoscaler reads. If you are moving from one autoscaler to the other, or different pools use different ones, set both. ",
            {
              a: "How the native autoscalers fit together",
              href: "/learn/hpa-vs-vpa-vs-cluster-autoscaler",
            },
            " covers which one runs where.",
          ],
        },
        {
          kind: "table",
          columns: [
            { label: "", width: "14%" },
            { label: [{ code: "safe-to-evict" }], width: "41%" },
            { label: [{ code: "do-not-disrupt" }], width: "45%" },
          ],
          rows: [
            [
              "Full key",
              [{ code: "cluster-autoscaler.kubernetes.io/safe-to-evict" }],
              [{ code: "karpenter.sh/do-not-disrupt" }],
            ],
            ["Read by", "Cluster Autoscaler", "Karpenter, NAP, EKS Auto Mode"],
            ["Set on", ["Pod (a node uses ", { code: "scale-down-disabled" }, ")"], "Pod or node"],
            [
              "Values",
              [{ code: '"false"' }, " holds the node, ", { code: '"true"' }, " releases the pod"],
              [
                { code: '"true"' },
                ", or a duration such as ",
                { code: '"30m"' },
                " (Karpenter 1.12.0 and later)",
              ],
            ],
            [
              "What it holds back",
              "Scale-down of the pod’s node",
              ["Consolidation, and drift unless ", { code: "terminationGracePeriod" }, " is set"],
            ],
            [
              "What it doesn’t change",
              "A PDB or a scheduling constraint still applies",
              "Expiration, interruption, manual node deletion, node auto repair",
            ],
          ],
        },
      ],
    },
    {
      id: "how-the-cluster-autoscaler-reads-safe-to",
      title: "How the Cluster Autoscaler reads safe-to-evict",
      blocks: [
        {
          kind: "p",
          text: [
            "The Cluster Autoscaler ",
            { a: "removes a node", href: "/learn/cluster-autoscaler-not-scaling-down" },
            " only when every pod that matters on it can move. Its FAQ lists the pods that stop it:",
          ],
        },
        {
          kind: "ul",
          items: [
            "pods with a restrictive PDB",
            "kube-system pods with no PDB, or too strict a one (DaemonSet and mirror pods aside)",
            "pods that no controller manages, such as a Deployment, ReplicaSet, Job or StatefulSet",
            "pods with local storage",
            "pods that fit on no other node, which it works out by simulating the scheduler",
            [
              "pods annotated ",
              { code: 'cluster-autoscaler.kubernetes.io/safe-to-evict: "false"' },
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "From Cluster Autoscaler 1.33 the kube-system rule is softer: a kube-system pod with no PDB blocks scale-down only while the pod is younger than ",
            { code: "--blocking-system-pod-distruption-timeout" },
            " (the flag is spelled that way), 1\u00a0hour by default. Once it’s older, the autoscaler may evict it.",
          ],
        },
        {
          kind: "p",
          text: [
            "The Cluster Autoscaler safe-to-evict annotation works in both directions. ",
            { code: '"false"' },
            " adds a pod to that list. ",
            { code: '"true"' },
            ", supported from Cluster Autoscaler 1.0.3, takes three kinds of pod off it: kube-system pods, pods without a controller and pods with local storage. It doesn’t override a PDB, because the autoscaler removes pods through the eviction API, which respects PDBs, and a failed eviction keeps the node. It doesn’t help a pod that fits nowhere else either. Mark a pod without a controller ",
            { code: '"true"' },
            " only if you can lose it, because nothing will start it again.",
          ],
        },
        {
          kind: "h3",
          id: "when-to-set-safe-to-evict-false",
          title: "When to set safe-to-evict “false”",
        },
        {
          kind: "p",
          text: "Set it on a pod that would lose real work if it restarted, such as a long batch job without checkpoints. Put it in the pod template, so every pod the controller creates carries it:",
        },
        {
          kind: "code",
          lang: "yaml",
          code: 'apiVersion: apps/v1\nkind: Deployment\nspec:\n  template:\n    metadata:\n      annotations:\n        cluster-autoscaler.kubernetes.io/safe-to-evict: "false"',
        },
        {
          kind: "p",
          text: [
            "An annotation added to a running pod with ",
            { code: "kubectl annotate" },
            " marks that pod only, and its replacement comes up without it.",
          ],
        },
        {
          kind: "p",
          text: [
            "To keep a whole node rather than one pod, the Cluster Autoscaler reads a node annotation instead, ",
            { code: 'cluster-autoscaler.kubernetes.io/scale-down-disabled: "true"' },
            ", available from version 1.0:",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl annotate node <node-name> cluster-autoscaler.kubernetes.io/scale-down-disabled=true",
        },
        {
          kind: "h3",
          id: "safe-to-evict-local-volumes-emptydir-and",
          title: "Safe to evict local volumes: emptyDir and hostPath",
        },
        {
          kind: "p",
          text: [
            "The FAQ’s examples of local storage are a ",
            { code: "hostPath" },
            " volume and an ",
            { code: "emptyDir" },
            " volume that doesn’t set ",
            { code: "medium: Memory" },
            ". ConfigMaps, Secrets, projected volumes and memory-backed emptyDir volumes don’t count. The reason is where the data lives. When a pod is removed from its node, Kubernetes deletes its emptyDir data permanently. A hostPath volume is a directory on the node’s own filesystem, so a pod rescheduled to another node doesn’t take it along.",
          ],
        },
        {
          kind: "p",
          text: [
            "Whether local storage holds a node depends on one flag, ",
            { code: "--skip-nodes-with-local-storage" },
            ". Upstream it defaults to ",
            { code: "true" },
            ", so a Cluster Autoscaler you install yourself, as on EKS, keeps any node running such a pod unless its arguments set the flag to ",
            { code: "false" },
            ". Check what your install passes. The AKS cluster autoscaler profile sets the same option to ",
            { code: "false" },
            " by default, so on AKS local data alone doesn’t keep a node, and an evicted pod’s emptyDir data is deleted. If that data matters, mark the pod ",
            { code: 'safe-to-evict: "false"' },
            " or move the data to a persistent volume.",
          ],
        },
        {
          kind: "p",
          text: [
            "When the local data is scratch space the pod can rebuild, you can release it without releasing anything else. List the volume names, comma-separated, in ",
            { code: "cluster-autoscaler.kubernetes.io/safe-to-evict-local-volumes" },
            ". This lifts the local-storage rule only when every one of the pod’s local volumes is in the list.",
          ],
        },
        {
          kind: "code",
          lang: "yaml",
          code: 'metadata:\n  annotations:\n    cluster-autoscaler.kubernetes.io/safe-to-evict-local-volumes: "scratch,cache"',
        },
        {
          kind: "p",
          text: [
            "That’s narrower than ",
            { code: '"true"' },
            ", which would also lift the kube-system and controller rules for the pod, and it names exactly the data you agree to lose.",
          ],
        },
      ],
    },
    {
      id: "how-karpenter-reads-do-not-disrupt",
      title: "How Karpenter reads do-not-disrupt",
      blocks: [
        {
          kind: "p",
          text: [
            "The Karpenter do-not-disrupt annotation keeps a pod’s node out of two of Karpenter’s graceful methods: consolidation, which deletes a node whose pods fit elsewhere or replaces it with a cheaper one, and drift, which replaces a node that no longer matches the spec set by its NodePool (the Karpenter resource that defines a group of nodes) or its node class. Karpenter’s docs suggest treating the annotation as a blocking PDB for a single pod. A node with an active do-not-disrupt pod is skipped by consolidation, and by drift too unless its NodeClaim (the object Karpenter keeps for each node) sets ",
            { code: "terminationGracePeriod" },
            ".",
          ],
        },
        { kind: "p", text: "On a pod, the annotation takes two forms:" },
        {
          kind: "ul",
          items: [
            [
              { code: 'karpenter.sh/do-not-disrupt: "true"' },
              " protects the pod for as long as it runs.",
            ],
            [
              "A Go duration such as ",
              { code: '"30m"' },
              " protects it for that long after it starts running. This form arrived in Karpenter 1.12.0 (April 2026). An invalid duration is ignored, and Karpenter records an event on the pod.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "The NAP and EKS Auto Mode pages show only the ",
            { code: '"true"' },
            " form, so use that there unless their docs add the duration.",
          ],
        },
        {
          kind: "p",
          text: [
            "The annotation doesn’t exclude a node from Karpenter’s forceful methods: expiration (the node reaching its ",
            { code: "expireAfter" },
            " lifetime, 720\u00a0hours by default), interruption (such as a Spot interruption warning) and manual deletion with ",
            { code: "kubectl delete node" },
            ". Node auto repair, an alpha feature that stays off until you enable its ",
            { code: "NodeRepair" },
            " feature gate, isn’t held back by it either.",
          ],
        },
        {
          kind: "p",
          text: [
            "Even then, the drain waits for the marked pod. Karpenter’s termination controller doesn’t evict it, so the node can’t finish terminating until that pod is gone or its duration runs out, the pod reaches Succeeded or Failed, or the NodeClaim’s ",
            { code: "terminationGracePeriod" },
            " runs out. Interruption and node repair put an upper bound on that wait. Expiration and manual deletion don’t. Because ",
            { code: "expireAfter" },
            " is set by default, a node with a marked pod and no ",
            { code: "terminationGracePeriod" },
            " can stay half-drained once it expires, and the docs warn that this drives up cluster cost. If you use the annotation, set ",
            { code: "terminationGracePeriod" },
            " too. ",
            { a: "Karpenter consolidation", href: "/learn/karpenter-consolidation" },
            " covers expiry and disruption budgets.",
          ],
        },
        {
          kind: "p",
          text: [
            "On a node, ",
            { code: 'karpenter.sh/do-not-disrupt: "true"' },
            " blocks voluntary disruption of that node, apart from node auto repair. The NAP docs also put it in a NodePool’s ",
            { code: "spec.template.metadata.annotations" },
            ", which marks every node the pool creates.",
          ],
        },
        {
          kind: "p",
          text: "Karpenter’s disruption docs give no rule for emptyDir or hostPath volumes. The pod-level controls they give for blocking disruption are blocking PDBs and this annotation, so don’t count on local data to hold a node that Karpenter manages; mark the pod or move its data to a persistent volume.",
        },
      ],
    },
    {
      id: "what-a-marker-costs-and-when-to",
      title: "What a marker costs, and when to use one",
      blocks: [
        {
          kind: "p",
          text: "A marker holds a whole node for the sake of one pod. AWS says it directly in its EKS Auto Mode cost guide: the annotation “is an availability mechanism. It does not account for cost.” The node keeps its instance size whatever its load, and when marked pods sit on many nodes, consolidation across the cluster drops.",
        },
        { kind: "p", text: "A short way to choose:" },
        {
          kind: "ol",
          items: [
            [
              "The pod has replicas and can restart one at a time. Use a PDB, not a marker: it limits how many pods go at once and still lets the node be removed. ",
              { a: "PDB best practices", href: "/learn/pod-disruption-budget-best-practices" },
              " has the settings.",
            ],
            "The pod runs for a known stretch and would start over if stopped. On Karpenter 1.12.0 or later, use a duration. Elsewhere, add the marker for the run and remove it when the run ends, as the AWS guide suggests.",
            [
              "The pod must not be interrupted while it runs. Use ",
              { code: 'do-not-disrupt: "true"' },
              ", ",
              { code: 'safe-to-evict: "false"' },
              ", or both if either autoscaler could see it.",
            ],
            [
              "The pod’s emptyDir is scratch it can rebuild. List it in ",
              { code: "safe-to-evict-local-volumes" },
              ".",
            ],
            "The pod’s local data has to survive. Move it to a persistent volume. A marker only stops the autoscaler, and a node can still go through expiration, interruption or manual deletion.",
          ],
        },
        {
          kind: "p",
          text: "A marker stays until someone removes it. These commands list the pods and nodes that carry one. The first catches every do-not-disrupt value on a pod, durations included:",
        },
        {
          kind: "code",
          lang: "bash",
          code: 'kubectl get pods -A -o json | jq -r \'.items[] | select(.metadata.annotations["karpenter.sh/do-not-disrupt"] != null or .metadata.annotations["cluster-autoscaler.kubernetes.io/safe-to-evict"] == "false") | .metadata.namespace + "/" + .metadata.name\'\n\nkubectl get nodes -o json | jq -r \'.items[] | select(.metadata.annotations["karpenter.sh/do-not-disrupt"] == "true" or .metadata.annotations["cluster-autoscaler.kubernetes.io/scale-down-disabled"] == "true") | .metadata.name\'',
        },
        {
          kind: "p",
          text: "Take a pod marker out of the pod template, where it came from. Removing a node marker lets the autoscaler drain and delete that node, so check what runs on it first:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl annotate node <node-name> karpenter.sh/do-not-disrupt-\nkubectl annotate node <node-name> cluster-autoscaler.kubernetes.io/scale-down-disabled-",
        },
      ],
    },
    {
      id: "how-coral-treats-safe-to-evict-and",
      title: "How Coral treats safe-to-evict and do-not-disrupt",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " rebalances CPU and memory requests on AKS and EKS and drains spare nodes one at a time so your autoscaler can remove them. It honours the markers you already use:",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              "A pod annotated ",
              { code: 'karpenter.sh/do-not-disrupt: "true"' },
              " or ",
              { code: 'cluster-autoscaler.kubernetes.io/safe-to-evict: "false"' },
              " is never moved, and its node is kept.",
            ],
            [{ code: 'karpenter.sh/do-not-disrupt: "true"' }, " on a node keeps that node."],
            "A pod with data on the node’s own disk (emptyDir or hostPath) holds its node. Moving the data to a persistent volume, or marking the pod safe to evict, releases it.",
            "A bare pod with no controller keeps its node, unless it is marked safe to evict.",
            [
              "Coral’s own ",
              { code: 'coral.zoorik.com/removal-disabled: "true"' },
              ", as a label or annotation on a node or pod, keeps it out of every Coral move.",
            ],
          ],
        },
        {
          kind: "p",
          text: "Held nodes are where a marker’s cost shows. Node list → “What’s holding them” shows each held node with its reason and its fix, so a marker that outlived its reason turns up as a node you can release.",
        },
        {
          kind: "p",
          text: [
            "The marker has a use with Coral too. When Coral removes a node, a pod whose replacement can’t start first gets a short restart, and marking that pod do-not-disrupt prevents it, at the price of keeping its node. For databases, the ",
            { a: "Coral FAQ", href: "/coral/faq#how-are-databases-kafka-elasticsearch-redis" },
            " suggests the Read-only policy and do-not-disrupt for a careful start.",
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
      publisher: "Kubernetes autoscaler",
      title: "“Cluster Autoscaler FAQ”",
      url: "https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md",
    },
    {
      publisher: "Karpenter",
      title: "“Disruption”",
      url: "https://karpenter.sh/docs/concepts/disruption/",
    },
    {
      publisher: "Karpenter",
      title: "“Release v1.12.0”",
      url: "https://github.com/kubernetes-sigs/karpenter/releases/tag/v1.12.0",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Use the Cluster Autoscaler in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/cluster-autoscaler",
    },
    {
      publisher: "Microsoft Learn",
      title:
        "“Configure disruption policies for node auto-provisioning (NAP) nodes in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/node-auto-provisioning-disruption",
    },
    {
      publisher: "AWS",
      title: "“Cost optimization in EKS Auto Mode”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/auto-cost-control.html",
    },
    {
      publisher: "Kubernetes autoscaler",
      title: "“System pod drainability rule, cluster-autoscaler-1.33.0”",
      url: "https://github.com/kubernetes/autoscaler/blob/cluster-autoscaler-1.33.0/cluster-autoscaler/simulator/drainability/rules/system/rule.go",
    },
    {
      publisher: "Kubernetes",
      title: "“Volumes”",
      url: "https://kubernetes.io/docs/concepts/storage/volumes/",
    },
  ],
  related: [
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
    { title: "Nodes held", where: "Coral product guide", href: "/coral/guide#nodes-held" },
  ],
};
