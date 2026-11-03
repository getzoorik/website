import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/safe-to-evict-do-not-disrupt/1";
import { figure as figure2 } from "@/features/learn/figures/safe-to-evict-do-not-disrupt/2";
import { figure as figure3 } from "@/features/learn/figures/safe-to-evict-do-not-disrupt/3";

export const article: Article = {
  slug: "safe-to-evict-do-not-disrupt",
  title: "Karpenter do-not-disrupt vs safe-to-evict",
  meta: "What the safe-to-evict and do-not-disrupt annotations do, which node autoscaler reads each, and when a marked pod is worth the node it holds.",
  h1: "Karpenter do-not-disrupt vs safe-to-evict",
  deck: "Both keep a pod, and its node, in place. Each autoscaler reads its own.",
  card: "What safe-to-evict and do-not-disrupt do, which autoscaler reads each, and what a held node costs.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Node lifecycle and scheduling",
  published: "2026-10-25",
  updated: "2026-11-03",
  author: "sonia",
  cover: "/learn-covers/zoorik-learn-safe-to-evict-do-not-disrupt-1200x630.webp",
  coverAlt:
    "safe-to-evict and do-not-disrupt: an annotation stops the pod’s eviction, so the node stays",
  short: [
    "Both annotations tell a node autoscaler whether it may evict a pod, and so remove its node. The Cluster Autoscaler reads ",
    { code: "cluster-autoscaler.kubernetes.io/safe-to-evict" },
    ": ",
    { code: '"false"' },
    " keeps the node, and ",
    { code: '"true"' },
    " releases pods it would otherwise keep, such as pods with local storage. Karpenter, AKS node auto provisioning and ",
    { a: "EKS Auto Mode", href: "/learn/glossary/eks-auto-mode" },
    " read ",
    { code: "karpenter.sh/do-not-disrupt" },
    ", which keeps the node out of consolidation. Neither side documents the other’s annotation.",
  ],
  sections: [
    {
      id: "safe-to-evict-and-do-not-disrupt",
      title: "What the annotations do",
      blocks: [
        {
          kind: "p",
          text: [
            "To remove a node, an autoscaler evicts its pods, so it first checks whether each pod may move. Most of that check reads what you already have: ",
            { a: "PodDisruptionBudgets (PDBs)", href: "/learn/glossary/pod-disruption-budget" },
            ", the pod’s controller and its scheduling rules. The two annotations, or markers, are the part you set by hand.",
          ],
        },
        {
          kind: "p",
          text: "Take a node that runs a long batch job with no checkpoints. Overnight, the job and the node’s other pods would all fit elsewhere, so the Cluster Autoscaler could remove the node.",
        },
        {
          kind: "p",
          text: [
            "If the batch pod carries ",
            { code: 'safe-to-evict: "false"' },
            ", the node keeps running, and you pay for it, while the pod is there. Without the marker, the job can be evicted halfway and start over. That is the trade both annotations decide.",
          ],
        },
      ],
    },
    {
      id: "which-autoscaler-reads-which",
      title: "Which autoscaler reads which",
      blocks: [
        {
          kind: "p",
          text: [
            "The Cluster Autoscaler’s FAQ documents safe-to-evict and never mentions Karpenter’s annotation. Karpenter’s disruption docs never mention safe-to-evict, so don’t count on it there. On Azure Kubernetes Service (AKS), ",
            { a: "node auto provisioning (NAP)", href: "/learn/aks-node-auto-provisioning" },
            " documents ",
            { code: "karpenter.sh/do-not-disrupt" },
            ", and so does EKS Auto Mode on Amazon Elastic Kubernetes Service (EKS).",
          ],
        },
        {
          kind: "p",
          text: [
            "Set the annotation your autoscaler reads. ",
            { a: "Kubernetes autoscaling", href: "/learn/kubernetes-autoscaling" },
            " shows which one runs where. If you’re moving between them, or pools use different ones, set both in the pod template:",
          ],
        },
        {
          kind: "code",
          lang: "yaml",
          code: 'apiVersion: batch/v1\nkind: Job\nspec:\n  template:\n    metadata:\n      annotations:\n        # read by the Cluster Autoscaler\n        cluster-autoscaler.kubernetes.io/safe-to-evict: "false"\n        # read by Karpenter, NAP and EKS Auto Mode\n        karpenter.sh/do-not-disrupt: "true"',
        },
        {
          kind: "table",
          columns: [
            { label: "", width: "14%" },
            { label: [{ code: "safe-to-evict" }], width: "37%" },
            { label: [{ code: "do-not-disrupt" }], width: "49%" },
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
              [{ code: '"false"' }, " keeps the node, ", { code: '"true"' }, " releases the pod"],
              [
                { code: '"true"' },
                ", or a duration such as ",
                { code: '"30m"' },
                " (on a pod, Karpenter 1.12.0 and later)",
              ],
            ],
            [
              "Holds back",
              "Scale-down of the pod’s node",
              ["Consolidation, and drift unless ", { code: "terminationGracePeriod" }, " is set"],
            ],
            [
              "Doesn’t override",
              "A PDB, or a pod that fits on no other node",
              "Expiration, interruption, manual deletion and node auto repair (the drain still waits for the pod)",
            ],
          ],
        },
      ],
    },
    {
      id: "cluster-autoscaler-safe-to-evict",
      title: "Cluster Autoscaler: safe-to-evict",
      blocks: [
        {
          kind: "p",
          text: [
            "The Cluster Autoscaler removes a node only when its pods can move elsewhere. Its FAQ lists the pods that stop it ",
            { a: "scaling a node down", href: "/learn/cluster-autoscaler-not-scaling-down" },
            ":",
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
          kind: "callout",
          label: "For engineers",
          text: [
            "From Cluster Autoscaler 1.33, a kube-system pod with no PDB blocks scale-down only while it’s younger than ",
            { code: "--blocking-system-pod-distruption-timeout" },
            ". The flag is spelled that way, and defaults to 1 hour. After that, the autoscaler may evict the pod.",
          ],
        },
        {
          kind: "p",
          text: [
            "The annotation changes that list both ways. ",
            { code: '"false"' },
            " adds a pod to it. ",
            { code: '"true"' },
            ", from Cluster Autoscaler 1.0.3, takes off three kinds of pod: kube-system pods, pods without a controller and pods with local storage.",
          ],
        },
        {
          kind: "p",
          text: [
            "Two checks still apply to a pod marked ",
            { code: '"true"' },
            ". A PDB still holds: the autoscaler evicts through the eviction API, which respects PDBs, and a failed eviction keeps the node. A pod that fits on no other node still holds it too.",
          ],
        },
        {
          kind: "p",
          text: [
            "Mark a pod without a controller ",
            { code: '"true"' },
            " only if you can lose it: nothing will start it again.",
          ],
        },
        { kind: "svg", figure: figure1 },
        { kind: "h3", id: "safe-to-evict-false", title: "When to set “false”" },
        {
          kind: "p",
          text: [
            "Set it on a pod that would lose real work if it restarted, such as the batch job above. Put it in the pod template, so every pod the controller creates carries it. ",
            { code: "kubectl annotate" },
            " on a running pod marks that pod only, and its replacement comes up without it.",
          ],
        },
        {
          kind: "p",
          text: "To keep a whole node, the Cluster Autoscaler reads a node marker instead, from version 1.0:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl annotate node <node-name> cluster-autoscaler.kubernetes.io/scale-down-disabled=true",
        },
        {
          kind: "h3",
          id: "safe-to-evict-local-volumes",
          title: "Local volumes: emptyDir and hostPath",
        },
        {
          kind: "p",
          text: "Local storage is on the list because its data can’t follow the pod. When a pod is removed from its node, Kubernetes deletes its emptyDir data permanently. A hostPath volume is a directory on the node itself, so a pod moved to another node leaves it behind.",
        },
        {
          kind: "p",
          text: [
            "The FAQ counts a ",
            { code: "hostPath" },
            " volume, and an ",
            { code: "emptyDir" },
            " volume without ",
            { code: "medium: Memory" },
            ", as local storage. ConfigMaps, Secrets, projected volumes and memory-backed emptyDir volumes don’t count.",
          ],
        },
        {
          kind: "p",
          text: [
            "One flag decides whether local storage holds a node: ",
            { code: "--skip-nodes-with-local-storage" },
            ". Upstream it defaults to ",
            { code: "true" },
            ". So a Cluster Autoscaler you install yourself, as on EKS, keeps any node running such a pod, unless you set the flag to ",
            { code: "false" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "The AKS cluster autoscaler profile sets it to ",
            { code: "false" },
            " by default. On AKS, local data alone doesn’t keep a node, and an evicted pod’s emptyDir data is deleted. If that data matters, mark the pod ",
            { code: 'safe-to-evict: "false"' },
            " or move the data to a persistent volume.",
          ],
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: [
            "For scratch data the pod can rebuild, list the volume names, comma-separated, in ",
            { code: "cluster-autoscaler.kubernetes.io/safe-to-evict-local-volumes" },
            ". It lifts the local-storage rule only when every local volume of the pod is listed.",
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
            ": the kube-system and controller rules still apply, and it names exactly the data you agree to lose.",
          ],
        },
      ],
    },
    {
      id: "karpenter-do-not-disrupt",
      title: "Karpenter: do-not-disrupt",
      blocks: [
        {
          kind: "p",
          text: [
            "Karpenter’s docs suggest treating ",
            { code: "karpenter.sh/do-not-disrupt" },
            " as a blocking PDB for one pod. It keeps the pod’s node out of two graceful methods:",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { a: "Consolidation", href: "/learn/karpenter-consolidation" },
              " deletes a node whose pods fit elsewhere, or replaces it with a cheaper one. It skips a node with a marked pod.",
            ],
            [
              "Drift replaces a node that no longer matches its ",
              { a: "NodePool", href: "/learn/glossary/node-pool" },
              " (the Karpenter resource that defines a group of nodes) or node class. It skips a node with a marked pod, unless the node’s NodeClaim, Karpenter’s object for each node, sets ",
              { code: "terminationGracePeriod" },
              ".",
            ],
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
              " protects it for that long after it starts running. This form came in Karpenter 1.12.0. An invalid duration voids the annotation, and Karpenter records an event on the pod.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "The NAP and EKS Auto Mode docs show only the ",
            { code: '"true"' },
            " form, so use that there.",
          ],
        },
        {
          kind: "p",
          text: [
            "On a node, ",
            { code: 'karpenter.sh/do-not-disrupt: "true"' },
            " blocks voluntary disruption of that node. The NAP docs also put it in a NodePool’s ",
            { code: "spec.template.metadata.annotations" },
            ", which marks every node the pool creates. Node auto repair, an alpha feature behind the ",
            { code: "NodeRepair" },
            " feature gate, still overrides it.",
          ],
        },
        {
          kind: "p",
          text: "Karpenter’s disruption docs give no rule for emptyDir or hostPath volumes. So don’t count on local data to hold a node that Karpenter manages: mark the pod, or move its data to a persistent volume.",
        },
        {
          kind: "h3",
          id: "expiry-interruption-and-deletion",
          title: "What it doesn’t stop",
        },
        { kind: "p", text: "The annotation doesn’t stop Karpenter’s forceful methods:" },
        {
          kind: "ul",
          items: [
            [
              "Expiration: the node reaches its ",
              { code: "expireAfter" },
              " lifetime, 720 hours (30 days) by default.",
            ],
            [
              "Interruption, such as a ",
              { a: "Spot", href: "/learn/glossary/spot-instance" },
              " interruption warning.",
            ],
            ["Manual deletion with ", { code: "kubectl delete node" }, "."],
            "Node auto repair.",
          ],
        },
        {
          kind: "p",
          text: [
            "Even then, the drain waits for the marked pod: Karpenter doesn’t evict it. The node can’t finish terminating until the pod is gone, its duration ends, it reaches Succeeded or Failed, or the NodeClaim’s ",
            { code: "terminationGracePeriod" },
            " runs out. Interruption and node repair cap that wait. Expiration and manual deletion don’t.",
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            "A node with a marked pod and no ",
            { code: "terminationGracePeriod" },
            " can stay half-drained once it expires, and ",
            { code: "expireAfter" },
            " is set by default. Karpenter’s docs warn that this drives up cluster cost. If you mark pods, set ",
            { code: "terminationGracePeriod" },
            " in the NodePool’s ",
            { code: "spec.template.spec" },
            ", longer than your longest run. Drift then no longer skips the node, and when the period runs out, Karpenter deletes the marked pod.",
          ],
        },
        { kind: "svg", figure: figure3 },
      ],
    },
    {
      id: "when-to-use-a-marker",
      title: "When a marker is worth it",
      blocks: [
        {
          kind: "p",
          text: "A marker holds a whole node for one pod. AWS’s EKS Auto Mode cost guide puts it plainly: the annotation “is an availability mechanism. It does not account for cost.” The node keeps its size whatever its load. When marked pods sit on many nodes, consolidation across the cluster drops.",
        },
        { kind: "p", text: "Match the tool to what the pod needs:" },
        {
          kind: "ol",
          items: [
            [
              { b: "The pod has replicas and can restart one at a time." },
              " Use a PDB, not a marker: it limits how many pods go at once and still lets the node go. ",
              { a: "PDB best practices", href: "/learn/pod-disruption-budget-best-practices" },
              " has the settings.",
            ],
            [
              { b: "The pod runs for a known stretch and would start over if stopped." },
              " On Karpenter 1.12.0 or later, use a duration. Elsewhere, add the marker for the run and remove it after, as the AWS guide suggests.",
            ],
            [
              { b: "The pod must not be interrupted while it runs." },
              " Use the annotation your autoscaler reads, or both. A Karpenter grace period still ends the hold.",
            ],
            [
              { b: "A rebuildable scratch volume holds the node." },
              " List it in ",
              { code: "safe-to-evict-local-volumes" },
              ".",
            ],
            [
              { b: "Local data must survive losing the node." },
              " Move it to a persistent volume. A marker stops only the autoscaler, and expiration, interruption or manual deletion can still take the node.",
            ],
          ],
        },
        { kind: "h3", id: "find-and-remove-markers", title: "Find and remove old markers" },
        { kind: "p", text: "Apart from a duration, a marker never expires." },
        {
          kind: "ol",
          items: [
            [
              { b: "List the pods and nodes that carry a marker." },
              " The first command finds every do-not-disrupt value on a pod, durations included, and safe-to-evict ",
              { code: '"false"' },
              ". The second lists the marked nodes:",
            ],
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: 'kubectl get pods -A -o json | jq -r \'.items[] | select(.metadata.annotations["karpenter.sh/do-not-disrupt"] != null or .metadata.annotations["cluster-autoscaler.kubernetes.io/safe-to-evict"] == "false") | .metadata.namespace + "/" + .metadata.name\'\n\nkubectl get nodes -o json | jq -r \'.items[] | select(.metadata.annotations["karpenter.sh/do-not-disrupt"] == "true" or .metadata.annotations["cluster-autoscaler.kubernetes.io/scale-down-disabled"] == "true") | .metadata.name\'',
        },
        {
          kind: "ol",
          start: 2,
          items: [
            [
              { b: "Take each marker out of the template it came from:" },
              " the pod template or the NodePool’s.",
            ],
            [{ b: "Check what runs on the node" }, " first:"],
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl get pods -A --field-selector spec.nodeName=<node-name>",
        },
        {
          kind: "ol",
          start: 4,
          items: [
            [
              { b: "Remove the node marker," },
              " which lets the autoscaler drain and delete the node:",
            ],
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl annotate node <node-name> karpenter.sh/do-not-disrupt-\nkubectl annotate node <node-name> cluster-autoscaler.kubernetes.io/scale-down-disabled-",
        },
      ],
    },
    {
      id: "where-coral-fits",
      title: "Where Coral fits",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " rebalances CPU and memory requests on AKS and EKS, and removes the nodes you don’t need. It honours the markers and holds below.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Markers." },
              " A pod annotated ",
              { code: 'karpenter.sh/do-not-disrupt: "true"' },
              " or ",
              { code: 'cluster-autoscaler.kubernetes.io/safe-to-evict: "false"' },
              " is never moved, and its node is kept. ",
              { code: 'karpenter.sh/do-not-disrupt: "true"' },
              " on a node keeps that node.",
            ],
            [
              { b: "Local data." },
              " A pod with hostPath data holds its node, unless it’s marked safe to evict.",
            ],
            [
              { b: "Bare pods." },
              " A pod with no controller holds its node, unless it’s marked safe to evict.",
            ],
            [
              { b: "Coral’s own marker." },
              " ",
              { code: 'coral.zoorik.com/removal-disabled: "true"' },
              ", as a label or annotation on a node or pod, keeps it out of every Coral move.",
            ],
            [
              { b: "Held nodes." },
              " Coral shows each held node with its reason and fix, so a marker that outlived its reason turns up as a node you can release.",
            ],
            [
              { b: "Live migration." },
              " When Coral removes a node, a pod whose replacement can’t start first moves by live migration where both nodes support it. Otherwise it’s evicted and gets a short restart. Marking it do-not-disrupt keeps it, and its node, in place. For databases, the ",
              { a: "Coral FAQ", href: "/coral-faq#how-are-databases-kafka-elasticsearch-redis" },
              " suggests the Read-only policy and do-not-disrupt for a careful start.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Coral works with Karpenter", href: "/coral-works-with-karpenter" },
            " covers running the two together.",
          ],
        },
        {
          kind: "p",
          text: [
            "On our AKS development cluster, Coral removed a spare 4-CPU worker, then swapped the other worker for a cheaper machine of the same size. Single-copy apps restarted once at each move. The two moves reduced ",
            { a: "the cluster’s machine cost", href: "/coral-value-lab" },
            " from $368.65 to $154.76 a month.",
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
      title: "How to change an EKS node group instance type",
      where: "Learn",
      href: "/learn/change-eks-node-group-instance-type",
    },
    {
      title: "Why Coral holds a node, and each fix",
      where: "Coral product guide",
      href: "/coral-guide#nodes-held",
    },
  ],
};
