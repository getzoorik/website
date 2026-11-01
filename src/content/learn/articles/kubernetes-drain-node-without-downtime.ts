import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/kubernetes-drain-node-without-downtime/1";
import { figure as figure2 } from "@/features/learn/figures/kubernetes-drain-node-without-downtime/2";
import { figure as figure3 } from "@/features/learn/figures/kubernetes-drain-node-without-downtime/3";

export const article: Article = {
  slug: "kubernetes-drain-node-without-downtime",
  title: "How to drain a Kubernetes node without downtime",
  meta: "Drain a Kubernetes node without downtime: why kubectl drain restarts single-replica apps, the replicas and PDBs that avoid it, and the flags to use.",
  h1: "How to drain a Kubernetes node without downtime",
  deck: "Why a plain drain takes single-replica apps down, and the replicas, budgets and rolling restarts that keep them serving.",
  card: "The replicas, PDBs and kubectl drain flags that keep apps serving while a node drains on AKS or EKS.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Node lifecycle and scheduling",
  published: "2026-11-01",
  updated: "2026-11-01",
  author: "ajay",
  cover: "/learn-covers/zoorik-learn-kubernetes-drain-node-without-downtime-1200x630.webp",
  coverAlt:
    "Drain a node without downtime: a plain drain leaves downtime, a new pod first keeps two copies serving",
  short: [
    "To drain a Kubernetes node without downtime, each app needs a second Ready replica elsewhere, a ",
    { a: "PodDisruptionBudget (PDB)", href: "/learn/glossary/pod-disruption-budget" },
    " allowing one disruption, and spare node capacity. A plain ",
    { code: "kubectl drain" },
    " evicts a pod before its replacement starts, so a single-replica app is down until the new copy is Ready.",
  ],
  sections: [
    {
      id: "why-a-plain-drain-takes-a-single",
      title: "Why a plain drain takes a single-replica app down",
      blocks: [
        {
          kind: "p",
          text: "Picture patching a node that runs one of three web API replicas and the only copy of a cache. The other two API pods keep serving.",
        },
        {
          kind: "p",
          text: "The cache serves nothing from the moment its pod is evicted. It stays down until a replacement on another node has pulled its image, started and passed its readiness check.",
        },
        {
          kind: "p",
          text: [
            "We ",
            { a: "measured that gap", href: "/coral-value-lab" },
            " on our dev cluster during a Coral rebalance on 12 October. None of its single-copy apps qualified for the warm handover described below. Each was down for 5 to 82\u00a0seconds, and the 6 apps that run two copies were down for 0\u00a0seconds.",
          ],
        },
        { kind: "h3", id: "what-a-drain-does-to-each-pod", title: "What a drain does to each pod" },
        {
          kind: "p",
          text: [
            { code: "kubectl drain" },
            " marks the node unschedulable, as ",
            { code: "kubectl cordon" },
            " does (",
            { a: "how cordon and drain differ", href: "/learn/cordon-vs-drain" },
            "). It then evicts the node’s pods through the Eviction API. That API refuses any eviction that would break a pod’s PDB.",
          ],
        },
        {
          kind: "p",
          text: "An evicted pod is marked for deletion, and its endpoint stops receiving Service traffic. Its containers get SIGTERM and the pod’s grace period, 30\u00a0seconds by default. Then the kubelet kills any still running.",
        },
        { kind: "p", text: "Kubernetes never moves a pod to another node. It replaces the pod." },
        {
          kind: "p",
          text: "In the drain walkthrough on the Disruptions page, the Deployment creates the replacement only after it notices the old pod terminating. Closing that gap means starting the new copy first.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: [
            "Two kinds of pod wait longer. A StatefulSet’s replacement keeps the old pod’s name (",
            { code: "web-0" },
            " stays ",
            { code: "web-0" },
            "), so it can’t be created until the old pod has terminated completely.",
          ],
        },
        {
          kind: "p",
          text: "A ReadWriteOnce volume can be mounted read-write by a single node. A replacement on another node can’t share it with the old pod.",
        },
      ],
    },
    {
      id: "kubernetes-drain-node-without-downtime",
      title: "Five things each app needs to drain a Kubernetes node without downtime",
      blocks: [
        { kind: "p", text: "All five must hold:" },
        {
          kind: "ul",
          items: [
            [
              { b: "At least two replicas, on different nodes." },
              " Without a PDB, a drain evicts every replica that shares the node at once. Spread them with pod anti-affinity or ",
              { a: "topology spread constraints", href: "/learn/topology-spread-constraints" },
              ".",
            ],
            [
              { b: "A PDB that allows one disruption." },
              " With ",
              { code: "maxUnavailable: 1" },
              ", drain evicts one pod and is refused the next. It waits until the replacement counts as healthy, meaning its Ready condition is True. No budget protects a single replica. ",
              { code: "maxUnavailable: 1" },
              " lets its only pod go, and a budget of zero voluntary evictions means the drain never completes.",
            ],
            [
              { b: "A readiness probe that passes only when the app can serve." },
              " Ready is what the PDB and the Deployment wait for, so a pod that reports Ready early ends the overlap too soon.",
            ],
            [
              { b: "A clean shutdown." },
              " On SIGTERM, the app should finish in-flight requests and exit within ",
              { code: "terminationGracePeriodSeconds" },
              ". A ",
              { code: "preStop" },
              " hook runs before the signal if you need one.",
            ],
            [
              { b: "Room for the replacement." },
              " A new pod that fits on no node stays Pending, and the drain stalls on the next eviction. Add a node first, or let a managed upgrade’s surge node supply it.",
            ],
          ],
        },
        {
          kind: "p",
          text: ["The PDB for a three-replica Deployment labelled ", { code: "app: <app>" }, ":"],
        },
        {
          kind: "code",
          lang: "yaml",
          code: "apiVersion: policy/v1\nkind: PodDisruptionBudget\nmetadata:\n  name: <app>-pdb\nspec:\n  maxUnavailable: 1\n  selector:\n    matchLabels:\n      app: <app>\n  unhealthyPodEvictionPolicy: AlwaysAllow",
        },
        {
          kind: "p",
          text: [
            "The PDB docs recommend ",
            { code: "maxUnavailable" },
            " because it “automatically responds to changes in the number of replicas”.",
          ],
        },
        {
          kind: "p",
          text: [
            "The last line is explained under hung drains. ",
            {
              a: "Pod disruption budget best practices",
              href: "/learn/pod-disruption-budget-best-practices",
            },
            " covers choosing the numbers.",
          ],
        },
      ],
    },
    {
      id: "how-to-drain-a-node-in-kubernetes",
      title: "How to drain a node in Kubernetes, step by step",
      blocks: [
        {
          kind: "ol",
          items: [
            [
              { b: "See what runs on the node and what its budgets allow." },
              " An app with one replica will restart. A budget with 0 under ALLOWED DISRUPTIONS will block the drain.",
            ],
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl get pods --all-namespaces --field-selector spec.nodeName=<node-name> -o wide\nkubectl get poddisruptionbudgets --all-namespaces",
        },
        {
          kind: "ol",
          start: 2,
          items: [
            [
              { b: "Cordon the node." },
              " New pods stop landing on it: ",
              { code: "kubectl cordon <node-name>" },
              ".",
            ],
            [
              { b: "Move single-replica Deployments off it" },
              " with the rolling restart in the next section.",
            ],
            [
              { b: "Drain it." },
              " If every pod there has a controller, this evicts all but ",
              { a: "DaemonSet", href: "/learn/glossary/daemonset" },
              " and mirror pods. It also deletes the data in the evicted pods’ emptyDir volumes. Check first that none holds data you need.",
            ],
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl drain <node-name> --ignore-daemonsets --delete-emptydir-data --timeout=30m",
        },
        {
          kind: "ol",
          start: 5,
          items: [
            [
              { b: "Do the maintenance." },
              " If you keep the node, run ",
              { code: "kubectl uncordon <node-name>" },
              " to make it schedulable again.",
            ],
          ],
        },
        { kind: "h3", id: "the-kubectl-drain-flags", title: "The kubectl drain flags" },
        {
          kind: "p",
          text: [
            { code: "kubectl drain <node-name> --ignore-daemonsets --delete-emptydir-data" },
            " is the form most drains need. Drain won’t proceed without the first flag while a DaemonSet pod is on the node. It won’t proceed without the second while a pod uses emptyDir.",
          ],
        },
        { kind: "p", text: "The flags, from the kubectl reference for Kubernetes v1.37:" },
        {
          kind: "table",
          columns: [
            { label: "Flag", width: "17%" },
            { label: "What it does", width: "72%" },
            { label: "Default", width: "11%" },
          ],
          rows: [
            [
              [{ code: "--ignore-daemonsets" }],
              "Skips DaemonSet pods. Drain never deletes them: their controller ignores the unschedulable mark and would replace them on the same node.",
              "Off",
            ],
            [
              [{ code: "--delete-emptydir-data" }],
              "Evicts pods that use emptyDir. That local data is deleted.",
              "Off",
            ],
            [
              [{ code: "--timeout" }],
              "How long drain waits before giving up.",
              "Not set. Zero means no limit.",
            ],
            [
              [{ code: "--grace-period" }],
              "Seconds each pod gets to shut down.",
              "-1, the pod’s own setting",
            ],
            [
              [{ code: "--force" }],
              "Also deletes pods no controller manages, which otherwise stop the drain. Nothing recreates them.",
              "Off",
            ],
            [
              [{ code: "--disable-eviction" }],
              "Deletes pods instead of evicting them, which bypasses PDBs.",
              "Off",
            ],
          ],
        },
        {
          kind: "p",
          text: "Set a kubectl drain timeout whenever you script a drain. Drain retries refused evictions until every pod is gone or the timeout is reached. Without one, a blocked PDB holds the job open for good.",
        },
        {
          kind: "p",
          text: [
            "When drain gives up, the node stays cordoned. Uncordon it if you’re abandoning the work. ",
            { code: "--dry-run=client" },
            " previews a drain, printing what would be sent without sending it.",
          ],
        },
      ],
    },
    {
      id: "a-rolling-restart-moves-a-single-replica",
      title: "A rolling restart moves a single-replica Deployment first",
      blocks: [
        {
          kind: "p",
          text: "A rolling restart gives a single-replica Deployment the overlap a plain drain can’t. It starts the new pod first, on another node because yours is cordoned.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: [
            "For a Deployment with 1\u00a0replica, the rolling update default ",
            { code: "maxSurge" },
            " of 25% is 0.25 of a pod, which rounds up to 1. The default ",
            { code: "maxUnavailable" },
            ", also 25%, is 0.25, which rounds down to 0.",
          ],
        },
        {
          kind: "p",
          text: "So the restart can run 1 + 1 = 2\u00a0pods and must keep 1 − 0 = 1 available. The old pod stays until the new one is Ready.",
        },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl rollout restart deployment/<name> -n <namespace>\nkubectl rollout status deployment/<name> -n <namespace>",
        },
        {
          kind: "p",
          text: [
            "When ",
            { code: "rollout status" },
            " reports success, the Ready pod is on another node.",
          ],
        },
        { kind: "p", text: "Before you drain, sort the node’s apps:" },
        {
          kind: "ul",
          items: [
            "Drain an app with two or more replicas as it is, once it meets the five needs.",
            "Restart a single-replica Deployment with rolling updates first.",
            "Expect any other single-replica app to restart.",
          ],
        },
        {
          kind: "p",
          text: "A restart gives no overlap to a StatefulSet, a pod with a ReadWriteOnce volume or a Deployment with the Recreate strategy. Recreate kills all existing pods before it creates new ones. Those restart however you drain them, so move them in a quiet hour, or run a second replica where the app supports one.",
        },
        { kind: "svg", figure: figure2 },
      ],
    },
    {
      id: "when-a-drain-hangs-and-whether-to",
      title: "When a drain hangs, and whether to ignore the PDB",
      blocks: [
        {
          kind: "p",
          text: "A stuck drain is waiting on an eviction that keeps being refused. The usual causes:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "A PDB that allows zero voluntary evictions," },
              " such as ",
              { code: "maxUnavailable" },
              " of 0, or ",
              { code: "minAvailable" },
              " of 100% or of the replica count.",
            ],
            [
              { b: "Pods under a budget that aren’t Ready," },
              " such as a crash-looping app. Under the default ",
              { code: "IfHealthyBudget" },
              " policy, drain can evict them only while the app isn’t already disrupted. ",
              { code: "unhealthyPodEvictionPolicy: AlwaysAllow" },
              ", stable since Kubernetes 1.31, lets drain evict them, and the Disruptions page recommends it.",
            ],
            [{ b: "A replacement stuck Pending" }, " for lack of room."],
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            "No kubectl drain flag ignores a PDB and still evicts: ",
            { code: "--disable-eviction" },
            " deletes pods instead, which in the reference’s words “will bypass checking PodDisruptionBudgets”. It can take every replica on the node down at once, so use it only with the app owner’s agreement.",
          ],
        },
        {
          kind: "p",
          text: "Adding a replica so the budget allows one eviction is usually the better fix.",
        },
        {
          kind: "p",
          text: [
            "For a single-instance stateful app, the PDB docs suggest a ",
            { code: "maxUnavailable" },
            " of 0, with an agreement that the operator asks first. When ready for the downtime, the app owner deletes the PDB, then recreates it.",
          ],
        },
      ],
    },
    {
      id: "kubernetes-node-maintenance-on-aks-and-eks",
      title: "Kubernetes node maintenance on AKS and EKS waits on your PDBs",
      blocks: [
        {
          kind: "p",
          text: "Managed upgrades drain nodes for you, so the per-app rules above still decide whether an upgrade is quiet.",
        },
        {
          kind: "h3",
          id: "aks-rolling-node-pool-upgrades",
          title: "AKS rolling node pool upgrades",
        },
        {
          kind: "p",
          text: [
            "On Azure Kubernetes Service (AKS), a rolling ",
            { a: "node pool", href: "/learn/glossary/node-pool" },
            " upgrade adds a surge node first, one node by default. Microsoft recommends a surge of 33% for production pools. AKS then cordons and drains old nodes one at a time, or as many at once as there are surge nodes.",
          ],
        },
        {
          kind: "p",
          text: "Each node gets a drain timeout of 30\u00a0minutes by default, settable from 5\u00a0minutes to 24\u00a0hours. If it runs out with pods still running, the upgrade stops until a later PUT operation resumes it. A wait after each drain is settable too, up to 30\u00a0minutes and 0 by default.",
        },
        { kind: "p", text: "Set the timeout, in minutes, per node pool:" },
        {
          kind: "code",
          lang: "bash",
          code: "az aks nodepool update \\\n  --resource-group <resource-group> \\\n  --cluster-name <cluster-name> \\\n  --name <node-pool> \\\n  --drain-timeout 45",
        },
        {
          kind: "h3",
          id: "eks-managed-node-group-updates",
          title: "EKS managed node group updates",
        },
        {
          kind: "p",
          text: "On Amazon Elastic Kubernetes Service (EKS), a managed node group update with the default strategy creates new nodes first. Once a new node is Ready, it cordons an old node and drains it. EKS waits 60\u00a0seconds after evicting every pod before it terminates the node.",
        },
        {
          kind: "p",
          text: [
            "Pods that don’t leave within 15\u00a0minutes fail the update with a ",
            { code: "PodEvictionFailure" },
            " error, unless you set the force flag. That flag, on the ",
            { code: "update-nodegroup-version" },
            " request, deletes them.",
          ],
        },
        {
          kind: "p",
          text: [
            "AWS names an aggressive PDB, or several PDBs pointing at one pod, among the causes. So forcing deletes pods a budget was holding. That carries the same risk as ",
            { code: "--disable-eviction" },
            ".",
          ],
        },
        { kind: "svg", figure: figure3 },
      ],
    },
    {
      id: "how-coral-drains-nodes",
      title: "How Coral drains nodes",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " optimizes Kubernetes on AKS and EKS. One of its levers for ",
            { a: "Kubernetes cost optimization", href: "/kubernetes-cost-optimization" },
            " is draining spare nodes so your autoscaler can remove them. Its drains follow the rules above, plus a step for single-replica apps:",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Check first:" },
              " before a consolidation drain, the agent checks the live cluster. Every pod on the node must fit on another Ready node, with its affinity, taints, spread, ports and zones.",
            ],
            [
              { b: "One node at a time:" },
              " consolidation cordons and drains one node at a time. If a drain can’t finish in time, the node goes back into service.",
            ],
            [
              { b: "Warm handover:" },
              " for a Deployment or an Argo Rollout, even one that runs a single copy, Coral scales it up by one. It waits until the new pod is Ready on another node, evicts the old pod within its PDB, then scales back. A Ready copy keeps serving throughout. No process state moves, and open connections to the old pod end.",
            ],
            [
              { b: "Eviction within the PDB:" },
              " where warm handover isn’t used, Coral evicts the pod through the Eviction API, within its PDB.",
            ],
            [
              { b: "Held nodes:" },
              " a node stays when a pod on it can’t move safely. Examples are a PDB that allows no disruption, emptyDir or hostPath data, or a pod ",
              { a: "marked do-not-disrupt", href: "/learn/safe-to-evict-do-not-disrupt" },
              ". Node list → “What’s holding them” names ",
              { a: "each reason and its fix", href: "/coral-guide#nodes-held" },
              ".",
            ],
          ],
        },
        {
          kind: "h3",
          id: "when-a-single-copy-app-still-restarts",
          title: "When a single-copy app still restarts",
        },
        { kind: "p", text: "Warm handover isn’t used for these, among others:" },
        {
          kind: "ul",
          items: [
            "StatefulSets and Jobs",
            "the Recreate strategy",
            "ReadWriteOnce volumes and GPU pods",
            "a Deployment whose replica count Argo CD or Flux sets",
          ],
        },
        {
          kind: "p",
          text: "An HPA-scaled app gets a handover only in a rebalance, where Coral raises the autoscaler’s minimum instead. All of these fall back to eviction, so a single-copy app among them gets a short restart, as under a plain drain.",
        },
        {
          kind: "p",
          text: "That is why every single-copy app restarted on 12 October. Argo CD sets the replica count of some, and the rest are StatefulSets or use the Recreate strategy.",
        },
        {
          kind: "p",
          text: [
            "A bare pod with no controller keeps its node unless it is marked safe to evict. A pod annotated ",
            { code: 'karpenter.sh/do-not-disrupt: "true"' },
            " is never moved, and its node is kept.",
          ],
        },
        { kind: "h3", id: "upgrades-and-rebalances", title: "Upgrades and rebalances" },
        {
          kind: "p",
          text: "Coral skips cordoned, NotReady and deleting nodes, and never drains a node someone else cordoned. During an upgrade window, we recommend pausing node optimization and the Evictor, which moves pods off lightly used nodes.",
        },
        {
          kind: "p",
          text: "A rebalance replaces the nodes you choose with cheaper machines, and it never goes past a PDB. Each handover copy must stay Ready and serving, with no restarts, before the old one goes. A node that can’t be emptied in time is kept.",
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
      title: "“kubectl drain”",
      url: "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_drain/",
    },
    {
      publisher: "Kubernetes",
      title: "“Disruptions”",
      url: "https://kubernetes.io/docs/concepts/workloads/pods/disruptions/",
    },
    {
      publisher: "Kubernetes",
      title: "“Specifying a Disruption Budget for your Application”",
      url: "https://kubernetes.io/docs/tasks/run-application/configure-pdb/",
    },
    {
      publisher: "Kubernetes",
      title: "“Pod Lifecycle”",
      url: "https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/",
    },
    {
      publisher: "Kubernetes",
      title: "“Deployments”",
      url: "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/",
    },
    {
      publisher: "Kubernetes",
      title: "“Persistent Volumes”",
      url: "https://kubernetes.io/docs/concepts/storage/persistent-volumes/",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Configure rolling upgrades for Azure Kubernetes Service (AKS) node pools”",
      url: "https://learn.microsoft.com/en-us/azure/aks/upgrade-aks-node-pools-rolling",
    },
    {
      publisher: "AWS",
      title: "“Understand each phase of node updates”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/managed-node-update-behavior.html",
    },
  ],
  related: [
    {
      title: "Cordon vs drain in Kubernetes: what each does to a node",
      where: "Learn",
      href: "/learn/cordon-vs-drain",
    },
    {
      title: "Pod disruption budget best practices for AKS and EKS",
      where: "Learn",
      href: "/learn/pod-disruption-budget-best-practices",
    },
    {
      title: "The safe-to-evict and do-not-disrupt annotations explained",
      where: "Learn",
      href: "/learn/safe-to-evict-do-not-disrupt",
    },
    {
      title: "Cluster Autoscaler not scaling down: what keeps nodes running",
      where: "Learn",
      href: "/learn/cluster-autoscaler-not-scaling-down",
    },
  ],
};
