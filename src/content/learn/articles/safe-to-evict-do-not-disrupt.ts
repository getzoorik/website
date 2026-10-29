import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/safe-to-evict-do-not-disrupt/1";
import { figure as figure2 } from "@/features/learn/figures/safe-to-evict-do-not-disrupt/2";
import { figure as figure3 } from "@/features/learn/figures/safe-to-evict-do-not-disrupt/3";

export const article: Article = {
  slug: "safe-to-evict-do-not-disrupt",
  title: "Safe-to-evict and do-not-disrupt annotations",
  meta: "What safe-to-evict and karpenter.sh/do-not-disrupt do, which autoscaler reads each, where emptyDir and hostPath pods hold nodes, and when to drop a marker.",
  h1: "The safe-to-evict and do-not-disrupt annotations explained",
  deck: "One annotation on one pod can keep its whole node running, so it pays to know which autoscaler reads which.",
  card: "What safe-to-evict and do-not-disrupt do, which autoscaler reads each, and why a held node stays on your bill.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Node lifecycle and scheduling",
  published: "2026-10-25",
  updated: "2026-10-25",
  author: "sonia",
  cover: "/learn-covers/zoorik-learn-safe-to-evict-do-not-disrupt-1200x630.webp",
  short: [
    "The ",
    { code: "cluster-autoscaler.kubernetes.io/safe-to-evict" },
    " and ",
    { code: "karpenter.sh/do-not-disrupt" },
    " annotations tell a node autoscaler whether it may evict a pod, and so whether the pod’s node can be removed. Set the one your autoscaler reads. The Cluster Autoscaler reads safe-to-evict: ",
    { code: '"false"' },
    " holds the node, and ",
    { code: '"true"' },
    " releases pods it would otherwise keep, such as ones with emptyDir or hostPath data. Karpenter, AKS node auto-provisioning and EKS Auto Mode read do-not-disrupt, which keeps the node out of consolidation.",
  ],
  sections: [
    {
      id: "safe-to-evict-and-do-not-disrupt",
      title: "One annotation can keep a whole node running",
      blocks: [
        {
          kind: "p",
          text: [
            "Picture a node that runs a long batch job, with no checkpoints, beside a few web pods. Overnight all of them, the job included, would fit elsewhere. The Cluster Autoscaler could remove the node. But the batch pod carries ",
            { code: 'safe-to-evict: "false"' },
            ", so the node keeps running, and stays on your bill, while that pod is there. Without the annotation, the job could be evicted halfway and start over.",
          ],
        },
        {
          kind: "p",
          text: "That is the trade both annotations decide. To remove a node, an autoscaler evicts its pods, so it first checks whether each pod may move. Most of that check reads what you already have: PodDisruptionBudgets (PDBs), the pod’s controller and its scheduling rules. You write the two annotations, or markers, by hand for each workload.",
        },
      ],
    },
    {
      id: "which-autoscaler-reads-which",
      title: "Each autoscaler reads its own annotation",
      blocks: [
        {
          kind: "p",
          text: [
            "The Cluster Autoscaler’s FAQ documents safe-to-evict and never mentions Karpenter’s annotation, while Karpenter’s disruption docs never mention safe-to-evict, so don’t count on it there. On Azure Kubernetes Service (AKS), ",
            { a: "node auto-provisioning (NAP)", href: "/learn/aks-node-auto-provisioning" },
            " documents ",
            { code: "karpenter.sh/do-not-disrupt" },
            " too, and so does EKS Auto Mode on Amazon Elastic Kubernetes Service (EKS). ",
            {
              a: "How the native autoscalers fit together",
              href: "/learn/hpa-vs-vpa-vs-cluster-autoscaler",
            },
            " covers which one runs where.",
          ],
        },
        {
          kind: "p",
          text: "So set the annotation your autoscaler reads. If you’re moving from one autoscaler to the other, or different pools use different ones, set both in the pod template:",
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
              [{ code: '"false"' }, " holds the node, ", { code: '"true"' }, " releases the pod"],
              [
                { code: '"true"' },
                ", or a duration such as ",
                { code: '"30m"' },
                " (on a pod, Karpenter 1.12.0 and later)",
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
              "Expiration, interruption, manual node deletion and node auto repair still start (the drain waits for the pod)",
            ],
          ],
        },
      ],
    },
    {
      id: "cluster-autoscaler-safe-to-evict",
      title: "The Cluster Autoscaler reads safe-to-evict in both directions",
      blocks: [
        {
          kind: "p",
          text: [
            "The Cluster Autoscaler removes a node only when every pod that matters on it can move elsewhere, and its FAQ lists the pods that stop it from ",
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
            "From Cluster Autoscaler 1.33 the kube-system rule is softer. A kube-system pod with no PDB blocks scale-down only while the pod is younger than ",
            { code: "--blocking-system-pod-distruption-timeout" },
            " (the flag is spelled that way), 1\u00a0hour by default. Once it’s older, the autoscaler may evict it.",
          ],
        },
        {
          kind: "p",
          text: [
            "The Cluster Autoscaler safe-to-evict annotation changes the FAQ’s list in both directions. ",
            { code: '"false"' },
            " adds a pod to it. ",
            { code: '"true"' },
            ", supported from Cluster Autoscaler 1.0.3, takes three kinds of pod off it: kube-system pods, pods without a controller and pods with local storage.",
          ],
        },
        {
          kind: "p",
          text: [
            "Two checks still apply to a pod marked ",
            { code: '"true"' },
            ". It doesn’t override a PDB: the autoscaler removes pods through the eviction API, which respects PDBs, and a failed eviction keeps the node. It doesn’t help a pod that fits nowhere else either. Mark a pod without a controller ",
            { code: '"true"' },
            " only if you can lose it: nothing will start it again.",
          ],
        },
        { kind: "svg", figure: figure1 },
        { kind: "h3", id: "safe-to-evict-false", title: "When to set safe-to-evict “false”" },
        {
          kind: "p",
          text: [
            "Set it on a pod that would lose real work if it restarted, such as the batch job in the opening. Put it in the pod template, as above, so every pod the controller creates carries it: ",
            { code: "kubectl annotate" },
            " on a running pod marks that pod only, and its replacement comes up without it.",
          ],
        },
        {
          kind: "p",
          text: [
            "To keep a whole node, the Cluster Autoscaler reads a node marker instead, ",
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
          id: "safe-to-evict-local-volumes",
          title: "Safe to evict local volumes: emptyDir and hostPath",
        },
        {
          kind: "p",
          text: "Local storage is on the FAQ’s list because the data can’t follow the pod. When a pod is removed from its node, Kubernetes deletes its emptyDir data permanently. A hostPath volume is a directory on the node’s own filesystem, so a pod rescheduled to another node leaves it behind.",
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
            ". ConfigMaps, Secrets, projected volumes and memory-backed emptyDir volumes don’t count.",
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
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "The AKS cluster autoscaler profile sets the same option to ",
            { code: "false" },
            " by default, so on AKS local data alone doesn’t keep a node, and an evicted pod’s emptyDir data is deleted. If that data matters, mark the pod ",
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
            ", which lifts the local-storage rule only when all the pod’s local volumes are in the list.",
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
      id: "karpenter-do-not-disrupt",
      title:
        "Karpenter’s do-not-disrupt holds back consolidation, and drift unless a grace period is set",
      blocks: [
        {
          kind: "p",
          text: [
            "The Karpenter do-not-disrupt annotation keeps a pod’s node out of two of Karpenter’s graceful methods. ",
            { a: "Consolidation", href: "/learn/karpenter-consolidation" },
            " deletes a node whose pods fit elsewhere, or replaces it with a cheaper one. Drift replaces a node that no longer matches the spec set by its NodePool (the Karpenter resource that defines a group of nodes) or its node class.",
          ],
        },
        {
          kind: "p",
          text: [
            "Karpenter’s docs suggest treating the annotation as a blocking PDB for a single pod. Consolidation skips a node with an active do-not-disrupt pod. Drift skips it too, unless the node’s NodeClaim, the object Karpenter keeps for each node, sets ",
            { code: "terminationGracePeriod" },
            ". On a pod, the annotation takes two forms:",
          ],
        },
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
              ", a form added in Karpenter 1.12.0 (April 2026), protects it for that long after it starts running. An invalid duration voids the annotation, and Karpenter records an event on the pod.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "The NAP and EKS Auto Mode docs show only the ",
            { code: '"true"' },
            " form, so use that there unless they add the duration.",
          ],
        },
        {
          kind: "p",
          text: [
            "On a node, ",
            { code: 'karpenter.sh/do-not-disrupt: "true"' },
            " blocks voluntary disruption of that node. Node auto repair, an alpha feature that stays off until you enable its ",
            { code: "NodeRepair" },
            " feature gate, still overrides it. The NAP docs also put the annotation in a NodePool’s ",
            { code: "spec.template.metadata.annotations" },
            ", which marks every node the pool creates.",
          ],
        },
        {
          kind: "p",
          text: "Karpenter’s disruption docs give no rule for emptyDir or hostPath volumes. Their pod-level controls for blocking disruption are blocking PDBs and this annotation. So don’t count on local data to hold a node that Karpenter manages: mark the pod or move its data to a persistent volume.",
        },
        {
          kind: "h3",
          id: "expiry-interruption-and-deletion",
          title: "Expiry, interruption and deletion still go ahead",
        },
        {
          kind: "p",
          text: [
            "The annotation doesn’t exclude a node from Karpenter’s forceful methods: expiration (the node reaching its ",
            { code: "expireAfter" },
            " lifetime, 720\u00a0hours or 30\u00a0days by default), interruption (such as a Spot interruption warning), and manual deletion with ",
            { code: "kubectl delete node" },
            ". Node auto repair isn’t held back by it either.",
          ],
        },
        {
          kind: "p",
          text: [
            "Even then, the drain waits for the marked pod. Karpenter’s termination controller doesn’t evict it, so the node can’t finish terminating until the pod is gone, its duration ends, it reaches Succeeded or Failed, or the NodeClaim’s ",
            { code: "terminationGracePeriod" },
            " runs out. Interruption and node repair put an upper bound on that wait. Expiration and manual deletion don’t.",
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
            " is set by default. The docs warn that this drives up cluster cost. If you mark pods, set ",
            { code: "terminationGracePeriod" },
            " in the NodePool’s ",
            { code: "spec.template.spec" },
            " longer than your longest run: drift then no longer skips the node, and when it runs out, Karpenter deletes the marked pod anyway.",
          ],
        },
        { kind: "svg", figure: figure3 },
      ],
    },
    {
      id: "when-to-use-a-marker",
      title: "When a marker is worth the node it holds",
      blocks: [
        {
          kind: "p",
          text: "A marker holds a whole node for one pod. AWS’s EKS Auto Mode cost guide names the trade: the annotation “is an availability mechanism. It does not account for cost.” The node keeps its instance size whatever its load, and when marked pods sit on many nodes, consolidation across the cluster drops.",
        },
        { kind: "p", text: "Match the tool to what the pod needs:" },
        {
          kind: "ol",
          items: [
            [
              { b: "The pod has replicas and can restart one at a time." },
              " Use a PDB, not a marker: it limits how many pods go at once and still lets the node go. The settings are in ",
              { a: "PDB best practices", href: "/learn/pod-disruption-budget-best-practices" },
              ".",
            ],
            [
              { b: "The pod runs for a known stretch and would start over if stopped." },
              " On Karpenter 1.12.0 or later, use a duration. Elsewhere, add the marker for the run and remove it when the run ends, as the AWS guide suggests.",
            ],
            [
              { b: "The pod must not be interrupted while it runs." },
              " Use the annotation your autoscaler reads, or both, though a Karpenter grace period still ends the hold.",
            ],
            [
              { b: "The pod’s rebuildable scratch volume holds its node." },
              " List it in ",
              { code: "safe-to-evict-local-volumes" },
              ".",
            ],
            [
              { b: "The pod’s local data has to survive losing its node." },
              " Move it to a persistent volume. A marker only stops the autoscaler, and a node can still go through expiration, interruption or manual deletion.",
            ],
          ],
        },
        { kind: "h3", id: "find-and-remove-markers", title: "How to find and remove old markers" },
        { kind: "p", text: "Apart from a duration, a marker never expires." },
        {
          kind: "ol",
          items: [
            [
              { b: "List the pods and nodes that carry a marker." },
              " The first command catches every do-not-disrupt value on a pod, durations included, plus safe-to-evict ",
              { code: '"false"' },
              ", and the second lists the marked nodes:",
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
              { b: "Take each marker out of the template it came from," },
              " the pod template or a NodePool’s.",
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
      title: "Where Coral fits with safe-to-evict and do-not-disrupt",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " optimizes Kubernetes on AKS and EKS: it rebalances CPU and memory requests, and drains spare nodes one at a time so your autoscaler can remove them. Coral honours the markers and holds below.",
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
              " When Coral drains spare nodes, a pod with hostPath data holds its node unless it is marked safe to evict. An emptyDir volume holds no node, so if its data matters, mark the pod ",
              { code: 'karpenter.sh/do-not-disrupt: "true"' },
              ".",
            ],
            [
              { b: "Bare pods." },
              " A bare pod with no controller keeps its node, unless it is marked safe to evict.",
            ],
            [
              { b: "Coral’s own marker." },
              " ",
              { code: 'coral.zoorik.com/removal-disabled: "true"' },
              ", as a label or annotation on a node or pod, keeps it out of every Coral move.",
            ],
            [
              { b: "Nodes held." },
              " Node list → “What’s holding them” shows each held node with its reason and fix, so a marker that outlived its reason turns up as a node you can release.",
            ],
            [
              { b: "Short restarts." },
              " When Coral removes a node, a pod whose replacement can’t start first gets a short restart, and marking it do-not-disrupt prevents that, at the price of keeping its node. For databases, the ",
              { a: "Coral FAQ", href: "/coral/faq#how-are-databases-kafka-elasticsearch-redis" },
              " suggests the Read-only policy and do-not-disrupt for a careful start.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "On our own AKS development cluster, Coral removed a spare 4-CPU worker, taking the machine bill from $368.65 to $221.19 a month. Then it swapped the remaining worker for a cheaper machine of the same size. Each time, single-copy apps restarted once. Eight days after we connected Coral, ",
            { a: "the bill", href: "/coral-value-lab" },
            " was $154.76 a month, 58% less.",
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
