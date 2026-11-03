import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/kubernetes-drain-node-without-downtime/1";
import { figure as figure2 } from "@/features/learn/figures/kubernetes-drain-node-without-downtime/2";
import { figure as figure3 } from "@/features/learn/figures/kubernetes-drain-node-without-downtime/3";

export const article: Article = {
  slug: "kubernetes-drain-node-without-downtime",
  title: "kubectl drain node without any downtime",
  meta: "How to run kubectl drain on a node without any downtime: replicas, PDBs, kubectl rollout restart for single-replica apps, and the flags to set.",
  h1: "kubectl drain without any downtime",
  deck: "Cordon the node, move single-replica Deployments with a rolling restart, then drain with a timeout.",
  card: "The replicas, PDBs and kubectl drain flags that keep apps serving while a node drains.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Node lifecycle and scheduling",
  published: "2026-11-01",
  updated: "2026-11-03",
  author: "ajay",
  cover: "/learn-covers/zoorik-learn-kubernetes-drain-node-without-downtime-1200x630.webp",
  coverAlt:
    "Drain a node without downtime: a plain drain leaves a gap, a new pod first keeps two copies serving",
  short: [
    "A plain ",
    { code: "kubectl drain" },
    " evicts each pod before its replacement starts, so an app with one replica is down until the new pod is Ready. To avoid that, each app needs a second Ready replica on another node, a ",
    { a: "PodDisruptionBudget (PDB)", href: "/learn/glossary/pod-disruption-budget" },
    " that allows one disruption, and room for the replacement.",
  ],
  sections: [
    {
      id: "why-a-plain-drain-takes-a-single",
      title: "Why a plain drain causes downtime",
      blocks: [
        {
          kind: "p",
          text: "An app with a Ready replica on another node keeps serving through a drain. An app with one replica serves nothing from eviction until its replacement has pulled its image, started and passed its readiness check.",
        },
        { kind: "h3", id: "what-a-drain-does-to-each-pod", title: "What drain does to a pod" },
        {
          kind: "p",
          text: [
            { code: "kubectl drain" },
            " marks the node unschedulable, as ",
            { code: "kubectl cordon" },
            " does (",
            { a: "how cordon and drain differ", href: "/learn/cordon-vs-drain" },
            "). It then evicts the node’s pods through the Eviction API, which refuses any eviction that would break a PDB.",
          ],
        },
        {
          kind: "p",
          text: "An evicted pod is marked for deletion, and Services stop sending it new traffic. Its containers then get SIGTERM and the pod’s grace period to shut down.",
        },
        {
          kind: "p",
          text: "Kubernetes never moves a pod to another node: it creates a replacement. In the drain example on the Disruptions page, the Deployment creates it only after it sees the old pod terminating. Starting the new pod first closes that gap.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: [
            "Two kinds of pod wait longer. A StatefulSet’s replacement keeps the old pod’s name (",
            { code: "web-0" },
            " stays ",
            { code: "web-0" },
            "), so it can’t be created until the old pod has fully terminated. A ReadWriteOnce volume mounts read-write on one node only, so a replacement elsewhere can’t share it with the old pod.",
          ],
        },
      ],
    },
    {
      id: "kubernetes-drain-node-without-downtime",
      title: "What each app needs",
      blocks: [
        { kind: "p", text: "All five must hold:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Two or more replicas, on different nodes." },
              " Without a PDB, a drain evicts every replica on the node at once. Spread them with pod anti-affinity or ",
              { a: "topology spread constraints", href: "/learn/topology-spread-constraints" },
              ".",
            ],
            [
              { b: "A PDB that allows one disruption." },
              " With ",
              { code: "maxUnavailable: 1" },
              ", drain evicts one of the app’s pods at a time. The next waits until the replacement is healthy, meaning Ready. No budget protects a single replica: ",
              { code: "maxUnavailable: 1" },
              " lets its only pod go, and a budget of zero evictions means the drain never completes.",
            ],
            [
              { b: "A readiness probe that passes only when the app can serve." },
              " The PDB and the Deployment wait for Ready, so a pod that reports Ready early ends the overlap too soon.",
            ],
            [
              { b: "A clean shutdown." },
              " On SIGTERM, the app finishes in-flight requests and exits within ",
              { code: "terminationGracePeriodSeconds" },
              ".",
            ],
            [
              { b: "Room for the replacement." },
              " A pod that fits on no node stays Pending, and the drain stalls. Add a node first, or let a managed upgrade’s surge node supply it.",
            ],
          ],
        },
        {
          kind: "p",
          text: ["A PDB for a three-replica Deployment labelled ", { code: "app: <app>" }, ":"],
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
            ", since it follows changes in the replica count. ",
            {
              a: "Pod disruption budget best practices",
              href: "/learn/pod-disruption-budget-best-practices",
            },
            " covers choosing the numbers.",
          ],
        },
        {
          kind: "h3",
          id: "termination-grace-period-seconds",
          title: "terminationGracePeriodSeconds",
        },
        {
          kind: "p",
          text: [
            { code: "terminationGracePeriodSeconds" },
            " is how long a pod gets to stop: 30 seconds by default. When it runs out, the kubelet kills any container still running.",
          ],
        },
        {
          kind: "p",
          text: [
            "Set it longer than the app’s slowest clean shutdown plus any ",
            { code: "preStop" },
            " time. Microsoft’s AKS upgrade guide asks for it on long-running pods too.",
          ],
        },
        { kind: "h3", id: "prestop-hook", title: "preStop hook" },
        {
          kind: "p",
          text: [
            "A ",
            { code: "preStop" },
            " hook runs before the container gets SIGTERM. Containers in one pod get SIGTERM at different times and in no set order. Where shutdown order matters, the Pod Lifecycle docs suggest a ",
            { code: "preStop" },
            " hook to synchronize them.",
          ],
        },
      ],
    },
    {
      id: "how-to-drain-a-node-in-kubernetes",
      title: "How to drain a node",
      blocks: [
        {
          kind: "ol",
          items: [
            [
              { b: "Check the node." },
              " List its pods and the PDBs. An app with one replica will restart. A PDB with 0 under ALLOWED DISRUPTIONS will block the drain.",
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
              { b: "Cordon it." },
              " New pods stop landing on it: ",
              { code: "kubectl cordon <node-name>" },
              ".",
            ],
            [
              { b: "Move single-replica Deployments" },
              " with the rolling restart in the next section.",
            ],
            [
              { b: "Drain it." },
              " If every pod has a controller, this evicts all but ",
              { a: "DaemonSet", href: "/learn/glossary/daemonset" },
              " and mirror pods. It also deletes the evicted pods’ emptyDir data, so check none holds data you need.",
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
              " To keep the node, make it schedulable again with ",
              { code: "kubectl uncordon <node-name>" },
              ".",
            ],
          ],
        },
        {
          kind: "h3",
          id: "the-kubectl-drain-flags",
          title: "kubectl drain flags",
        },
        {
          kind: "p",
          text: [
            "Most drains need ",
            { code: "--ignore-daemonsets" },
            " and ",
            { code: "--delete-emptydir-data" },
            ". Without them, drain won’t proceed while a DaemonSet pod, or a pod using emptyDir, is on the node.",
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
              "Skips DaemonSet pods. Drain never deletes them, since their controller ignores the unschedulable mark and would replace them on the same node.",
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
          text: [
            "Set ",
            { code: "--timeout" },
            " whenever you script a drain. Drain retries refused evictions until every pod is gone or the timeout passes, so without one a blocking PDB holds the job open for good.",
          ],
        },
        {
          kind: "p",
          text: [
            "When drain gives up, the node stays cordoned: uncordon it if you abandon the work. ",
            { code: "--dry-run=client" },
            " previews a drain without sending anything.",
          ],
        },
      ],
    },
    {
      id: "a-rolling-restart-moves-a-single-replica",
      title: "kubectl rollout restart",
      blocks: [
        {
          kind: "p",
          text: [
            { code: "kubectl rollout restart" },
            " replaces a Deployment’s pods by its update strategy, a rolling update by default. It also works on DaemonSets and StatefulSets. On a single-replica Deployment, it starts the new pod first, on another node because yours is cordoned.",
          ],
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
          text: "A restart gives no overlap to a StatefulSet, a pod with a ReadWriteOnce volume, or a Deployment with the Recreate strategy. Recreate stops all pods before it creates new ones. Move those in a quiet hour, or run a second replica where the app supports one.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "h3",
          id: "rolling-update-strategy",
          title: "maxSurge and maxUnavailable",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: [
            "For a Deployment with 1 replica, the rolling update default ",
            { code: "maxSurge" },
            " of 25% is 0.25 of a pod, which rounds up to 1. The default ",
            { code: "maxUnavailable" },
            ", also 25%, is 0.25, which rounds down to 0.",
          ],
        },
        {
          kind: "p",
          text: "So the restart can run 1 + 1 = 2 pods and must keep 1 − 0 = 1 available. The old pod stays until the new one is Ready.",
        },
      ],
    },
    {
      id: "when-a-drain-hangs-and-whether-to",
      title: "When kubectl drain is stuck",
      blocks: [
        {
          kind: "p",
          text: "A stuck drain is waiting on an eviction that keeps being refused. The usual causes:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "A PDB that allows zero evictions," },
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
            "No kubectl drain flag ignores a PDB and still evicts. ",
            { code: "--disable-eviction" },
            " deletes pods instead, which in the reference’s words “will bypass checking PodDisruptionBudgets”. It can take every replica on the node down at once, so use it only with the app owner’s agreement.",
          ],
        },
        {
          kind: "p",
          text: "Adding a replica, so the budget allows one eviction, is usually the better fix.",
        },
        {
          kind: "p",
          text: [
            "For a single-instance stateful app, the PDB docs suggest a ",
            { code: "maxUnavailable" },
            " of 0 and an agreement that the operator asks first. When ready for the downtime, the app owner deletes the PDB, then recreates it.",
          ],
        },
      ],
    },
    {
      id: "kubernetes-node-maintenance-on-aks-and-eks",
      title: "AKS and EKS node upgrades",
      blocks: [
        {
          kind: "p",
          text: "Managed upgrades drain nodes for you, so the needs above still decide whether an upgrade is quiet.",
        },
        {
          kind: "h3",
          id: "aks-rolling-node-pool-upgrades",
          title: "AKS node pool upgrades",
        },
        {
          kind: "p",
          text: [
            "A rolling AKS ",
            { a: "node pool", href: "/learn/glossary/node-pool" },
            " upgrade adds a surge node first, one by default. Microsoft recommends a surge of 33% for production pools. AKS then cordons and drains old nodes one at a time, or as many at once as there are surge nodes.",
          ],
        },
        {
          kind: "p",
          text: "Each node’s drain timeout is 30 minutes by default, settable from 5 minutes to 24 hours. If it runs out with pods still running, the upgrade stops until a later PUT operation resumes it. An optional wait after each drain runs from 0, the default, to 30 minutes.",
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
          text: "With the default strategy, an EKS managed node group update creates new nodes first. Once a new node is Ready, it cordons and drains an old one. It terminates the old node 60 seconds after evicting every pod.",
        },
        {
          kind: "p",
          text: [
            "Pods that don’t leave within 15 minutes fail the update with a ",
            { code: "PodEvictionFailure" },
            " error, unless you set the force flag on the ",
            { code: "update-nodegroup-version" },
            " request. AWS lists an aggressive PDB, or several PDBs on one pod, among the causes.",
          ],
        },
        {
          kind: "p",
          text: [
            "Forcing deletes the pods a budget was holding, with the same risk as ",
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
            " removes the nodes you don’t need on AKS and EKS, without any downtime, as part of ",
            { a: "Kubernetes cost optimization", href: "/kubernetes-cost-optimization" },
            ". Its drains follow the rules above:",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Check first:" },
              " before it removes a node you don’t need, Coral checks on the live cluster that every pod there fits on another Ready node.",
            ],
            [
              { b: "One node at a time:" },
              " Coral cordons and drains nodes in turn, never together. A node whose drain can’t finish in time goes back into service.",
            ],
            [
              { b: "Warm handover:" },
              " for a Deployment or an Argo Rollout, even with one replica, Coral starts a new pod on another node. Once it is Ready, Coral evicts the old pod within its PDB.",
            ],
            [
              { b: "Live migration:" },
              " where both nodes support it, Coral checkpoints a pod and restores it on the other node.",
            ],
            [
              { b: "Eviction:" },
              " otherwise, Coral evicts the pod through the Eviction API, within its PDB.",
            ],
            [
              { b: "Held nodes:" },
              " a node stays when a pod on it can’t move safely. Examples are a PDB that allows no disruption, hostPath data, a pod with no controller, or a pod ",
              { a: "marked do-not-disrupt", href: "/learn/safe-to-evict-do-not-disrupt" },
              ". Coral’s console names ",
              { a: "each reason and its fix", href: "/coral-guide#nodes-held" },
              ".",
            ],
          ],
        },
        { kind: "h3", id: "upgrades-and-rebalances", title: "Upgrades and rebalances" },
        {
          kind: "p",
          text: "Coral skips cordoned, NotReady and deleting nodes, and never drains a node someone else cordoned. During an upgrade window, we recommend pausing node optimization and the Evictor, which moves pods off lightly used nodes.",
        },
        {
          kind: "p",
          text: "A rebalance replaces the nodes you choose with cheaper machines, and it never goes past a PDB. Each new copy must stay Ready and serving before the old one goes. A node that can’t be emptied in time is kept.",
        },
      ],
    },
  ],
  help: {
    product: "coral",
    text: "Coral rebalances CPU and memory requests on AKS and EKS, works with your HPA, and removes the nodes you don’t need, without any downtime. We estimate it reduces AKS and EKS cost by 40–50%, a range rather than a promise. The free assessment works out your own figure.",
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
      title: "“kubectl rollout”",
      url: "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_rollout/",
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
      title: "kubectl cordon vs drain",
      where: "Learn",
      href: "/learn/cordon-vs-drain",
    },
    {
      title: "Pod disruption budget best practices",
      where: "Learn",
      href: "/learn/pod-disruption-budget-best-practices",
    },
    {
      title: "Karpenter do-not-disrupt vs safe-to-evict",
      where: "Learn",
      href: "/learn/safe-to-evict-do-not-disrupt",
    },
    {
      title: "Cluster Autoscaler not scaling down",
      where: "Learn",
      href: "/learn/cluster-autoscaler-not-scaling-down",
    },
  ],
  relatedTitle: "More on draining nodes",
};
