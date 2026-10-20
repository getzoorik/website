import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/kubernetes-drain-node-without-downtime/1";

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
  published: "2026-11-17",
  updated: "2026-11-17",
  author: "ajay",
  short: [
    "To drain a Kubernetes node without downtime, every app on it needs a second Ready replica on another node, a PodDisruptionBudget (PDB) that allows one disruption at a time, and room elsewhere for the replacement. A plain ",
    { code: "kubectl drain" },
    " evicts a pod first, and its controller starts the replacement afterwards. So a single-replica app is down until its new copy is Ready, and longer if it’s a StatefulSet or uses a ReadWriteOnce volume.",
  ],
  sections: [
    {
      id: "what-kubectl-drain-does-to-a-pod",
      title: "What kubectl drain does to a pod",
      blocks: [
        {
          kind: "p",
          text: [
            { code: "kubectl drain" },
            " marks the node unschedulable, as ",
            { code: "kubectl cordon" },
            " does (",
            { a: "how cordon and drain differ", href: "/learn/cordon-vs-drain" },
            "), then evicts its pods through the Eviction API, which refuses any eviction that would break a pod’s PDB. An evicted pod is marked for deletion, and its endpoint stops receiving Service traffic. Its containers get SIGTERM and the pod’s grace period, 30\u00a0seconds by default, before the kubelet kills them.",
          ],
        },
        {
          kind: "p",
          text: "Kubernetes never moves a pod to another node. It replaces the pod, and in the drain walkthrough on the Disruptions page, the Deployment creates the replacement only after it notices the old pod terminating. With three replicas, two keep serving meanwhile. With one, nothing serves from the moment the old pod leaves the endpoints until the new one has pulled its image, started and passed its readiness check.",
        },
        {
          kind: "p",
          text: [
            "Two kinds of pod wait longer. A StatefulSet’s replacement keeps the old pod’s name (",
            { code: "web-0" },
            " stays ",
            { code: "web-0" },
            "), so it can’t be created until the old pod has terminated completely. A ReadWriteOnce volume can be mounted read-write by a single node, so a replacement on another node can’t share it with the old pod.",
          ],
        },
        { kind: "diagram", figure: figure1 },
        {
          kind: "p",
          text: [
            "We measured that gap on our own dev cluster during a Coral rebalance on 12 October. None of its single-copy apps qualified for the warm handover described below, so each was down for 5 to 82\u00a0seconds. The 6 apps that run two copies were down for 0\u00a0seconds. ",
            { a: "The case study", href: "/case-studies/coral-dev-cluster" },
            " lists each app’s time.",
          ],
        },
      ],
    },
    {
      id: "what-each-app-needs-for-a-node",
      title: "What each app needs for a node drain without downtime",
      blocks: [
        { kind: "p", text: "An app stays up through a drain when all five of these hold:" },
        {
          kind: "ul",
          items: [
            [
              "At least two replicas, on different nodes. Without a PDB, a drain evicts every replica that shares the node at once. Spread them with ",
              { a: "topology spread constraints", href: "/learn/topology-spread-constraints" },
              " or pod anti-affinity.",
            ],
            [
              "A PDB that allows one disruption. With ",
              { code: "maxUnavailable: 1" },
              ", drain evicts one pod and is refused the next until the replacement counts as healthy, meaning its Ready condition is True. No budget protects a single replica: ",
              { code: "maxUnavailable: 1" },
              " lets its only pod go, and a budget of zero voluntary evictions means the drain never completes.",
            ],
            "A readiness probe that passes only when the app can serve. Ready is what the PDB and the Deployment wait for, so a pod that reports Ready early ends the overlap too soon.",
            [
              "A clean shutdown. On SIGTERM, the app should finish in-flight requests and exit within ",
              { code: "terminationGracePeriodSeconds" },
              ". A ",
              { code: "preStop" },
              " hook runs before the signal if you need one.",
            ],
            "Room for the replacement. A new pod that fits on no node stays Pending, and the drain blocks on the next eviction, which is where the Disruptions walkthrough ends. Add a node first, or let a managed upgrade’s surge node supply it.",
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
            { code: "maxUnavailable" },
            " follows the replica count as the app scales, which is why the Kubernetes docs recommend it over ",
            { code: "minAvailable" },
            ". The last line is explained under hung drains, and ",
            {
              a: "pod disruption budget best practices",
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
            "See what runs on the node and what its budgets allow. Apps with one replica, and budgets with 0 under ALLOWED DISRUPTIONS, will either restart or block the drain.",
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
              "Cordon the node so new pods stop landing on it: ",
              { code: "kubectl cordon <node-name>" },
              ".",
            ],
            "Move single-replica Deployments off it, as the next section shows.",
            "Drain it. If every pod there has a controller, this evicts all but DaemonSet and mirror pods, and deletes the data in their emptyDir volumes, so check first that no emptyDir there holds data you need.",
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
              "Do the maintenance. If the node stays in the cluster, run ",
              { code: "kubectl uncordon <node-name>" },
              " to make it schedulable again.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            { code: "kubectl drain <node-name> --ignore-daemonsets --delete-emptydir-data" },
            " is the form most drains need. Drain won’t proceed without the first flag while a DaemonSet pod is on the node, or without the second while a pod uses emptyDir. The flags, from the kubectl reference for Kubernetes v1.37:",
          ],
        },
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
          text: [
            "Set a kubectl drain timeout whenever you script a drain. Drain retries refused evictions until every pod is gone or the timeout is reached, so without a timeout a blocked PDB holds the job open for good. When drain gives up, the node stays cordoned, so uncordon it if you’re abandoning the work. To preview a drain, ",
            { code: "--dry-run=client" },
            " prints what would be sent without sending it.",
          ],
        },
      ],
    },
    {
      id: "moving-a-single-replica-deployment-before-the",
      title: "Moving a single-replica Deployment before the drain",
      blocks: [
        {
          kind: "p",
          text: [
            "A rolling restart gives a single-replica Deployment the overlap a plain drain can’t. With the rolling update defaults, ",
            { code: "maxSurge" },
            " and ",
            { code: "maxUnavailable" },
            " of 25%, a one-replica Deployment may add 1\u00a0pod and lose 0, since surge rounds up and unavailable rounds down. So it starts the new pod first, on another node because yours is cordoned, and removes the old one once the new one is Ready.",
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
            "Once ",
            { code: "rollout status" },
            " reports success, the app’s Ready pod is on another node. Three kinds of workload get no overlap from a restart:",
          ],
        },
        {
          kind: "ul",
          items: [
            "A Deployment with the Recreate strategy, which kills all existing pods before it creates new ones.",
            "A StatefulSet, whose replacement waits for the old pod to end.",
            "A pod with a ReadWriteOnce volume, which the new pod on another node can’t mount while the old pod holds it.",
          ],
        },
        {
          kind: "p",
          text: "These restart however you drain them, so let the drain move them in a quiet hour, or run a second replica where the app supports one.",
        },
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
              "A PDB that allows zero voluntary evictions: ",
              { code: "maxUnavailable" },
              " of 0, or ",
              { code: "minAvailable" },
              " of 100% or of the replica count.",
            ],
            [
              "Pods under a budget that aren’t Ready, such as a crash-looping app. Under the default ",
              { code: "IfHealthyBudget" },
              " policy, such pods can be evicted only while the app isn’t already disrupted. ",
              { code: "unhealthyPodEvictionPolicy: AlwaysAllow" },
              ", stable since Kubernetes 1.31, lets drain evict them, and the Disruptions page recommends it.",
            ],
            "A replacement stuck Pending for lack of room.",
          ],
        },
        {
          kind: "p",
          text: [
            "No kubectl drain flag ignores a PDB and still evicts. ",
            { code: "--disable-eviction" },
            " switches drain to plain deletes that, in the reference’s words, “will bypass checking PodDisruptionBudgets”. That can take every replica on the node down at once, so use it only with the app owner’s agreement. Adding a replica so the budget allows one eviction is usually the better fix. For a single-instance stateful app, the PDB docs suggest ",
            { code: "maxUnavailable: 0" },
            " and an agreement that the operator asks first, and the owner deletes the PDB when ready for the downtime, then recreates it.",
          ],
        },
      ],
    },
    {
      id: "kubernetes-node-maintenance-on-aks-and-eks",
      title: "Kubernetes node maintenance on AKS and EKS",
      blocks: [
        {
          kind: "p",
          text: "Managed upgrades drain your nodes for you and wait on your PDBs, so the per-app rules above still decide whether an upgrade is quiet.",
        },
        {
          kind: "p",
          text: "On Azure Kubernetes Service (AKS), a rolling node pool upgrade adds a surge node first. That’s one node by default, and Microsoft recommends 33% for production pools. AKS then cordons and drains old nodes one at a time, or as many at once as there are surge nodes. Each node gets a drain timeout of 30\u00a0minutes by default, settable from 5\u00a0minutes to 24\u00a0hours, and if it runs out with pods still running, the upgrade stops until a later PUT operation resumes it. A soak time of up to 30\u00a0minutes (0 by default) adds a wait after each drain. Set the timeout, in minutes, per node pool:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "az aks nodepool update \\\n  --resource-group <resource-group> \\\n  --cluster-name <cluster-name> \\\n  --name <node-pool> \\\n  --drain-timeout 45",
        },
        {
          kind: "p",
          text: [
            "On Amazon Elastic Kubernetes Service (EKS), a managed node group update with the default strategy creates new nodes first. It cordons an old node once a new one is Ready, then drains it. Pods that don’t leave within 15\u00a0minutes fail the update with a ",
            { code: "PodEvictionFailure" },
            " error, unless you set the force flag on the ",
            { code: "update-nodegroup-version" },
            " request to delete them. AWS names an aggressive PDB, or several PDBs pointing at one pod, among the causes, so forcing deletes pods a budget was holding, with the same risk as ",
            { code: "--disable-eviction" },
            ". EKS waits 60\u00a0seconds after evicting every pod before it terminates the node.",
          ],
        },
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
            " optimizes Kubernetes on AKS and EKS, and part of that is draining spare nodes so your autoscaler can remove them. The guide to ",
            { a: "reducing Kubernetes cost", href: "/learn/reduce-kubernetes-cost" },
            " covers the other levers. Coral’s drains follow the rules above, with a step of their own for single-replica apps:",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Check first:" },
              " before a consolidation drain, the agent checks on the live cluster that every pod on the node fits on another Ready node, with its affinity, taints, spread, ports and zones.",
            ],
            [
              { b: "One node at a time:" },
              " consolidation cordons and drains one node at a time. If a drain can’t finish in 10\u00a0minutes, the node goes back into service.",
            ],
            [
              { b: "Warm handover:" },
              " for a Deployment or an Argo Rollout, even one that runs a single copy, Coral scales it up by one, waits until the new pod is Ready on another node, evicts the old pod within its PDB, then scales back. A Ready copy keeps serving throughout. No process state moves, and open connections to the old pod end.",
            ],
            [
              { b: "Eviction within the PDB:" },
              " where warm handover isn’t used, Coral evicts the pod through the Eviction API, within its PDB.",
            ],
            [
              { b: "Held nodes:" },
              " a node stays when a pod on it can’t move safely, for example under a PDB that allows no disruption, with emptyDir or hostPath data, or ",
              { a: "marked do-not-disrupt", href: "/learn/safe-to-evict-do-not-disrupt" },
              ". Node list → “What’s holding them” names ",
              { a: "each reason and its fix", href: "/coral/guide#nodes-held" },
              ".",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Warm handover isn’t used for every workload. The exceptions include StatefulSets, Jobs, workloads with the Recreate strategy, pods with ReadWriteOnce volumes, GPU pods, and a Deployment whose replica count Argo CD or Flux sets. An HPA-scaled app gets one only in a rebalance, where Coral raises the autoscaler’s minimum instead. Those pods fall back to eviction, so a single-copy app among them gets a short restart, as under a plain drain. That is why every single-copy app restarted in our 12 October rebalance: Argo CD sets the replica count of some, and the rest are StatefulSets or use the Recreate strategy. A bare pod with no controller keeps its node unless it is marked safe to evict, and a pod annotated ",
            { code: 'karpenter.sh/do-not-disrupt: "true"' },
            " is never moved, and its node is kept.",
          ],
        },
        {
          kind: "p",
          text: "Coral skips cordoned, NotReady and deleting nodes, and never drains a node someone else cordoned. During an upgrade window, we recommend pausing node optimization and the Evictor, the part of Coral that moves pods off lightly used nodes. A rebalance, which replaces the nodes you choose with cheaper machines, never goes past a PDB. There, each handover copy must be Ready and serving for 5\u00a0minutes with no restarts before the old one goes, and a node that can’t be emptied within 45\u00a0minutes is kept.",
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
    { title: "Nodes held", where: "Coral product guide", href: "/coral/guide#nodes-held" },
  ],
};
