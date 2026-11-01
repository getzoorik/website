import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/pod-disruption-budget-best-practices/1";
import { figure as figure2 } from "@/features/learn/figures/pod-disruption-budget-best-practices/2";

export const article: Article = {
  slug: "pod-disruption-budget-best-practices",
  title: "Pod disruption budget best practices: AKS and EKS",
  meta: "Pod disruption budget best practices for AKS and EKS: choose maxUnavailable or minAvailable by replica count, so a drain, upgrade or scale-down can finish.",
  h1: "Pod disruption budget best practices for AKS and EKS",
  deck: "How to set a PDB that protects your app and still lets drains, upgrades and node scale-down finish.",
  card: "Pick maxUnavailable or minAvailable by replica count, so a PDB protects the app without holding its node.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Node lifecycle and scheduling",
  published: "2026-11-01",
  updated: "2026-11-01",
  author: "sonia",
  cover: "/learn-covers/zoorik-learn-pod-disruption-budget-best-practices-1200x630.webp",
  coverAlt: "Pod disruption budgets: one replica may go while the rest stay available",
  short: [
    "Pod disruption budget best practices start from one rule: every PodDisruptionBudget (PDB) should allow at least one disruption at the replica count you run. Set ",
    { code: "maxUnavailable" },
    " to 1 for most workloads, because a PDB that allows none stalls or fails drains, upgrades and scale-down on AKS and EKS.",
  ],
  sections: [
    {
      id: "a-budget-that-allows-no-disruption-keeps",
      title: "A budget that allows no disruption keeps its node running",
      blocks: [
        {
          kind: "p",
          text: [
            "Picture a Deployment whose PDB sets ",
            { code: "minAvailable" },
            " to 2 and whose ",
            { a: "Horizontal Pod Autoscaler", href: "/learn/glossary/horizontal-pod-autoscaler" },
            " (HPA) has a ",
            { code: "minReplicas" },
            " of 2.",
          ],
        },
        {
          kind: "p",
          text: "By day the HPA adds pods, so a disruption is allowed. Overnight it sits at its minimum, the budget allows none, and neither pod’s node can be emptied, however little the pods use.",
        },
        {
          kind: "p",
          text: [
            "That’s where a budget meets cloud cost, because ",
            { a: "Kubernetes cost optimization", href: "/kubernetes-cost-optimization" },
            " relies on removing spare nodes.",
          ],
        },
        {
          kind: "p",
          text: [
            "The Cluster Autoscaler ",
            { a: "removes a node", href: "/learn/cluster-autoscaler-not-scaling-down" },
            " only after checking that its pods’ PDBs allow at least one eviction. If an eviction still fails, it keeps the node. Karpenter won’t consolidate a node while any pod on it has a blocking PDB.",
          ],
        },
      ],
    },
    {
      id: "how-a-pdb-decides-which-evictions-go",
      title: "How a PDB decides which evictions go ahead",
      blocks: [
        {
          kind: "p",
          text: [
            "A ",
            { a: "PodDisruptionBudget", href: "/learn/glossary/pod-disruption-budget" },
            " limits how many pods of a replicated app voluntary disruptions can take down at once. It has been stable since Kubernetes 1.21, in the ",
            { code: "policy/v1" },
            " API.",
          ],
        },
        {
          kind: "p",
          text: "Voluntary means chosen by a person or a controller, such as a drain for an upgrade or a scale-down. A PDB can’t prevent involuntary ones, such as a hardware failure. Even so, they count against its budget.",
        },
        {
          kind: "p",
          text: [
            "The budget works through the Eviction API. A tool that respects PDBs asks to evict a pod, and the API server refuses while the eviction would break the budget. So ",
            { code: "kubectl drain" },
            " retries until the node is empty or its timeout runs out.",
          ],
        },
        {
          kind: "p",
          text: "Two things skip the check: deleting a pod directly, and a Deployment or StatefulSet rolling update. Pods a rollout takes down still count against the budget.",
        },
        {
          kind: "p",
          text: "The disruption controller works out allowed disruptions by counting the selected pods whose Ready condition is True. From that it takes away how many must stay healthy, so 3 healthy pods against 2 required leave 1.",
        },
        {
          kind: "p",
          text: "At 0, every eviction is refused. If the budget can never rise above 0, you “cannot successfully drain a Node running one of those Pods.”",
        },
      ],
    },
    {
      id: "pod-disruption-budget-best-practices",
      title: "Pod disruption budget best practices: the checklist",
      blocks: [
        {
          kind: "p",
          text: "These Kubernetes PDB best practices protect an app and let a drain finish.",
        },
        {
          kind: "h3",
          id: "allow-at-least-one-disruption-at-the",
          title: "Allow at least one disruption at the replica count you run",
        },
        {
          kind: "p",
          text: [
            "A budget allows nothing when ",
            { code: "maxUnavailable" },
            " is 0, or when ",
            { code: "minAvailable" },
            " is 100% or equal to the replica count. Kubernetes calls that “requiring zero voluntary evictions”. Keep an integer ",
            { code: "minAvailable" },
            " below your smallest replica count.",
          ],
        },
        {
          kind: "p",
          text: [
            "Besides the opening case, percentage rounding gets you there, because Kubernetes rounds ",
            { code: "minAvailable" },
            " up to a whole pod.",
          ],
        },
        {
          kind: "callout",
          label: "Worked example",
          text: [
            "Take a ",
            { code: "minAvailable" },
            " of 90%, the docs’ example for a stateless frontend, on 9\u00a0replicas. 90% of 9 is 8.1, which rounds up to 9\u00a0pods that must stay healthy, so 9 − 9 leaves 0 allowed disruptions.",
          ],
        },
        {
          kind: "p",
          text: [
            "At 10\u00a0replicas, 90% is exactly 9 and leaves 1. Under a ",
            { code: "maxUnavailable" },
            " of 1, the same 9\u00a0replicas need 9 − 1 = 8 healthy and leave 1.",
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "h3",
          id: "maxunavailable-vs-minavailable-pick-by-replica-count",
          title: "maxUnavailable vs minAvailable: pick by replica count",
        },
        {
          kind: "p",
          text: [
            "A PDB sets one of the two, never both, and each takes a number or a percentage. With ",
            { code: "maxUnavailable" },
            ", you set how many selected pods may be unavailable after an eviction. With ",
            { code: "minAvailable" },
            ", you set the minimum that stays available.",
          ],
        },
        {
          kind: "p",
          text: [
            "Kubernetes recommends ",
            { code: "maxUnavailable" },
            " because it “automatically responds to changes in the number of replicas”. That suits anything an HPA scales. Its percentages round up too, so 30% of a single replica lets that pod go.",
          ],
        },
        {
          kind: "table",
          columns: [
            { label: "Workload", width: "44%" },
            { label: "Budget", width: "23%" },
            { label: "Allowed disruptions", width: "33%" },
          ],
          rows: [
            [
              "Stateless, 2 or more replicas, with or without an HPA",
              [{ code: "maxUnavailable: 1" }],
              "1, at any replica count",
            ],
            [
              "Stateless frontend that must keep 90% serving",
              [{ code: 'minAvailable: "90%"' }],
              "0 below 10\u00a0replicas, then 10% of them, rounded down",
            ],
            [
              "Quorum app such as etcd, ZooKeeper or Consul, 5 members",
              [{ code: "maxUnavailable: 1" }, ", or ", { code: "minAvailable: 3" }],
              "1, or 2",
            ],
            [
              "Restartable Job",
              "No budget",
              "Not limited. The Job controller creates a replacement pod",
            ],
            [
              "Bare pods, or an operator’s pods with no scale subresource",
              ["An integer ", { code: "minAvailable" }, " only"],
              "Healthy pods minus that integer",
            ],
          ],
        },
        {
          kind: "p",
          text: "These numbers assume every selected pod is Ready. One that isn’t uses up an allowed disruption.",
        },
        {
          kind: "h3",
          id: "poddisruptionbudget-example-for-a-deployment",
          title: "PodDisruptionBudget example for a Deployment",
        },
        { kind: "p", text: ["A budget for a Deployment labelled ", { code: "app: <app>" }, ":"] },
        {
          kind: "code",
          lang: "yaml",
          code: "apiVersion: policy/v1\nkind: PodDisruptionBudget\nmetadata:\n  name: <app>-pdb\n  namespace: <namespace>\nspec:\n  maxUnavailable: 1\n  unhealthyPodEvictionPolicy: AlwaysAllow\n  selector:\n    matchLabels:\n      app: <app>",
        },
        {
          kind: "p",
          text: [
            "Spread the replicas. ",
            { a: "A drain", href: "/learn/kubernetes-drain-node-without-downtime" },
            " in the Kubernetes walkthrough evicts one of two pods on the same node. Then it is refused the second until a replacement is Ready elsewhere.",
          ],
        },
        {
          kind: "p",
          text: [
            "Pod anti-affinity or ",
            { a: "topology spread constraints", href: "/learn/topology-spread-constraints" },
            " keep a Deployment’s pods on different nodes.",
          ],
        },
        {
          kind: "h3",
          id: "use-maxunavailable-0-only-as-a-deliberate",
          title: "Use maxUnavailable: 0 only as a deliberate hold",
        },
        {
          kind: "p",
          text: [
            "A PDB with ",
            { code: "maxUnavailable" },
            " set to 0 blocks every voluntary eviction of the pods it selects. Kubernetes gives it one use, a single-instance stateful app whose owner wants to be asked first. The owner deletes the PDB when ready for the downtime, then recreates it.",
          ],
        },
        {
          kind: "p",
          text: [
            "Without that agreement, it pins the node against drains, budget-honouring upgrades and scale-down. A single replica that can take a short restart needs no budget. An app that can run two replicas on separate nodes is better served by a ",
            { code: "maxUnavailable" },
            " of 1.",
          ],
        },
        {
          kind: "h3",
          id: "give-kube-system-pods-that-can-move",
          title: "Give kube-system pods that can move a budget",
        },
        {
          kind: "p",
          text: "A kube-system pod with too strict a PDB keeps the Cluster Autoscaler from removing its node. So can one with no PDB. The autoscaler’s FAQ gives the fix, a PDB for each kube-system workload that can safely run elsewhere:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl create poddisruptionbudget <pdb-name> --namespace=kube-system --selector app=<app-name> --max-unavailable 1",
        },
        {
          kind: "p",
          text: "The FAQ adds one exception. Restarting Metrics Server loses metrics for more than a minute, and the HPA relies on them. Leave it alone unless you accept that gap.",
        },
        {
          kind: "callout",
          label: "For engineers",
          text: [
            "The autoscaler doesn’t count DaemonSet and mirror pods here, and the rule comes from ",
            { code: "--skip-nodes-with-system-pods" },
            ", true by default. After ",
            { code: "--blocking-system-pod-distruption-timeout" },
            " (spelled that way, 1\u00a0hour by default), it can evict a kube-system pod without a PDB, never one whose PDB is at 0.",
          ],
        },
        { kind: "h3", id: "let-unhealthy-pods-be-evicted", title: "Let unhealthy pods be evicted" },
        {
          kind: "p",
          text: [
            "Under the default policy, ",
            { code: "IfHealthyBudget" },
            ", a running pod that isn’t Ready can be evicted only while the app isn’t already disrupted. An app whose pods crash-loop can then block a drain.",
          ],
        },
        {
          kind: "p",
          text: [
            "Setting ",
            { code: "unhealthyPodEvictionPolicy" },
            " to ",
            { code: "AlwaysAllow" },
            " lets those pods go. It has been stable since Kubernetes 1.31, and the Kubernetes Disruptions page recommends it.",
          ],
        },
        {
          kind: "h3",
          id: "one-budget-per-workload-on-its-controllers",
          title: "One budget per workload, on its controller’s selector",
        },
        {
          kind: "p",
          text: [
            "Copy the controller’s ",
            { code: ".spec.selector" },
            " into the PDB, and keep selectors from overlapping. The Eviction API refuses to evict any pod that more than one PDB selects. An empty selector, ",
            { code: "{}" },
            ", matches every pod in the namespace.",
          ],
        },
        {
          kind: "h3",
          id: "check-allowed-disruptions-before-you-drain",
          title: "Check allowed disruptions before you drain",
        },
        {
          kind: "ol",
          items: [
            [
              { b: "List every budget." },
              " Kubernetes shows each one’s allowed disruptions in the ALLOWED DISRUPTIONS column:",
            ],
          ],
        },
        { kind: "code", lang: "bash", code: "kubectl get poddisruptionbudgets --all-namespaces" },
        {
          kind: "ol",
          start: 2,
          items: [
            [
              { b: "Read any budget at 0 in full." },
              " A 0 means a drain of any node running those pods will wait. As Microsoft puts it, “An ALLOWED DISRUPTIONS value of 0 can block an AKS node drain”. The status fields ",
              { code: "currentHealthy" },
              ", ",
              { code: "desiredHealthy" },
              ", ",
              { code: "disruptionsAllowed" },
              " and ",
              { code: "expectedPods" },
              " show why, and a 0 can also mean the selector matches no pods:",
            ],
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl get poddisruptionbudgets <pdb-name> --namespace <namespace> -o yaml",
        },
      ],
    },
    {
      id: "pod-disruption-budgets-on-aks-a-blocked",
      title: "Pod disruption budgets on AKS: a blocked drain fails the upgrade",
      blocks: [
        {
          kind: "p",
          text: "During an Azure Kubernetes Service (AKS) rolling upgrade, AKS adds surge capacity, cordons and drains a node, then reimages or replaces it. The Eviction API checks each PDB during the drain. Microsoft’s advice is to “allow at least one disruption when the workload permits so that cluster maintenance can proceed.”",
        },
        {
          kind: "p",
          text: [
            "Microsoft lists a check for misconfigured PDBs, such as ",
            { code: "maxUnavailable=0" },
            ", among its pre-upgrade validations. On AKS Standard, those checks are part of your own workflow.",
          ],
        },
        {
          kind: "p",
          text: [
            "The node drain timeout, 30\u00a0minutes by default, sets how long AKS waits on pod evictions. When a strict budget still blocks a drain, the upgrade fails with ",
            { code: "UpgradeFailed" },
            " and a message that the eviction “would violate the pod’s disruption budget”.",
          ],
        },
        { kind: "p", text: "For AKS Standard, Microsoft lists three ways forward:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Cordon keeps honouring PDBs." },
              " With undrainable node behaviour ",
              { code: "Cordon" },
              ", a node that can’t drain is cordoned and labelled ",
              { code: "kubernetes.azure.com/upgrade-status=Quarantined" },
              ". Up to ",
              { code: "--max-blocked-nodes" },
              " of them are tolerated, and you resolve them afterwards.",
            ],
            [
              { b: "Force upgrade bypasses PDBs." },
              " Microsoft warns that it “might cause service disruption by draining all pods simultaneously”. Fix the budget before you reach for its flag, ",
              { code: "--enable-force-upgrade" },
              ".",
            ],
            [
              { b: "Automatic PDB management adds replicas." },
              " This preview extension adds them during a drain when a PDB blocks eviction on a cordoned node. It can also create PDBs for Deployments without one.",
            ],
          ],
        },
        { kind: "p", text: "Cordon is set per node pool:" },
        {
          kind: "code",
          lang: "bash",
          code: "az aks nodepool update \\\n  --resource-group <resource-group> \\\n  --cluster-name <cluster-name> \\\n  --name <node-pool> \\\n  --undrainable-node-behavior Cordon \\\n  --max-blocked-nodes 2 \\\n  --drain-timeout 30",
        },
        {
          kind: "p",
          text: "From 1 June 2027, AKS also upgrades any cluster that stays on an unsupported Kubernetes version past its 60-day grace period. Microsoft says such a platform-initiated upgrade “can override a Pod Disruption Budget that blocks a node drain”.",
        },
      ],
    },
    {
      id: "pod-disruption-budgets-on-eks-a-refused",
      title: "Pod disruption budgets on EKS: a refused eviction ends four ways",
      blocks: [
        {
          kind: "p",
          text: "On Amazon Elastic Kubernetes Service (EKS), managed node groups, the Cluster Autoscaler, Karpenter and EKS Auto Mode each treat a refused eviction differently.",
        },
        {
          kind: "p",
          text: [
            "A managed node group update drains each old node. It fails with ",
            { code: "PodEvictionFailure" },
            " if the node’s pods haven’t left within 15\u00a0minutes. AWS lists an aggressive PDB, or several PDBs on one pod, among the causes.",
          ],
        },
        {
          kind: "p",
          text: [
            "Forcing the update, with the force flag on the ",
            { code: "update-nodegroup-version" },
            " request, deletes pods that won’t leave and bypasses their budgets. The lasting fix is a budget that allows one eviction.",
          ],
        },
        {
          kind: "p",
          text: [
            "When a PDB blocks consolidation, Karpenter reports an ",
            { code: "Unconsolidatable" },
            " event that names the budget, such as “pdb default/inflate-pdb prevents pod evictions”. ",
            { a: "Karpenter consolidation", href: "/learn/karpenter-consolidation" },
            " covers the rest of its rules.",
          ],
        },
        {
          kind: "p",
          text: [
            "A NodePool’s ",
            { code: "terminationGracePeriod" },
            " caps how long a budget can hold a node that Karpenter is removing. When it runs out, the remaining pods are forcibly deleted, blocking PDBs included. A node with one set can also be replaced for drift while a budget blocks.",
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            "On ",
            { a: "EKS Auto Mode", href: "/learn/glossary/eks-auto-mode" },
            ", a budget that allows no disruption delays an expiry or drift replacement by up to about a day. Then its pods are deleted, because Auto Mode sets 24\u00a0hours as the grace period on each NodeClaim whose NodePool sets none.",
          ],
        },
        {
          kind: "p",
          text: "By default, Auto Mode also terminates instances after 336\u00a0hours (14\u00a0days). It replaces nodes for drift roughly once a week, as new Auto Mode AMIs come out.",
        },
        {
          kind: "p",
          text: "So a budget at 0 fails an update, keeps a node or, on Auto Mode, is overridden.",
        },
        { kind: "svg", figure: figure2 },
      ],
    },
    {
      id: "how-coral-works-within-your-pod-disruption",
      title: "How Coral works within your pod disruption budgets",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " optimizes Kubernetes on AKS and EKS. When it resizes or moves a healthy pod, it stays within your budgets.",
          ],
        },
        {
          kind: "h3",
          id: "resizing-pods-and-draining-nodes",
          title: "Resizing pods and draining nodes",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Pods." },
              " Pods are resized in place where possible, or else replaced one at a time within your PDBs.",
            ],
            [
              { b: "Drains." },
              " Coral tries a warm handover first: for a Deployment or an Argo Rollout that qualifies, it scales the owner up by one. It waits until the new pod is Ready on another node, then evicts the old pod within its PDB. Other pods are evicted within their PDBs, and a single-replica app gets a short restart.",
            ],
            [
              { b: "Consolidation." },
              " Before draining, Coral ",
              { a: "simulates the scheduler", href: "/coral-faq#how-do-you-make-sure-node" },
              " on the live cluster. It respects PDBs and do-not-disrupt, and drains one node at a time. If a drain can’t finish, the node goes back into service.",
            ],
          ],
        },
        { kind: "h3", id: "seeing-what-a-budget-holds", title: "Seeing what a budget holds" },
        {
          kind: "ul",
          items: [
            [
              { b: "Held nodes." },
              " A PDB at 0 keeps its pods’ node in place. Coral’s console names ",
              { a: "each held node and its fix", href: "/coral-guide#nodes-held" },
              ". Add replicas or relax the budget, or give a kube-system pod a budget that allows at least one disruption.",
            ],
            [
              { b: "Risky setups." },
              " Coral lists workload setups that make optimization risky, PodDisruptionBudgets among them, with the fix for each.",
            ],
          ],
        },
        {
          kind: "h3",
          id: "rebalancing-within-your-budgets",
          title: "Rebalancing within your budgets",
        },
        {
          kind: "p",
          text: "A rebalance replaces the nodes you choose with cheaper machines that your Karpenter or AKS node auto-provisioning launches. It never goes past a PDB either.",
        },
        {
          kind: "p",
          text: "In a warm handover, the new copy must be Ready and serving, with no restarts, before the old pod goes. When a PDB says “not now”, Coral keeps that copy and retries. A node that can’t be emptied in time is kept.",
        },
        {
          kind: "p",
          text: [
            "On our own AKS development cluster, node optimization removed one 4-CPU worker in under 10\u00a0minutes, and single-copy apps restarted once. ",
            { a: "The case study", href: "/coral-value-lab" },
            " has the figures.",
          ],
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
      title: "“Specifying a Disruption Budget for your Application”",
      url: "https://kubernetes.io/docs/tasks/run-application/configure-pdb/",
    },
    {
      publisher: "Kubernetes",
      title: "“Disruptions”",
      url: "https://kubernetes.io/docs/concepts/workloads/pods/disruptions/",
    },
    {
      publisher: "Kubernetes autoscaler",
      title: "“Cluster Autoscaler FAQ”",
      url: "https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Best practices for basic scheduler features in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/operator-best-practices-scheduler",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Upgrade options and recommendations for Azure Kubernetes Service (AKS) clusters”",
      url: "https://learn.microsoft.com/en-us/azure/aks/upgrade-options",
    },
    {
      publisher: "Amazon EKS",
      title: "“Understand each phase of node updates”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/managed-node-update-behavior.html",
    },
    {
      publisher: "Amazon EKS",
      title: "“Create a Node Pool for EKS Auto Mode”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/create-node-pool.html",
    },
    {
      publisher: "Karpenter",
      title: "“Disruption”",
      url: "https://karpenter.sh/docs/concepts/disruption/",
    },
  ],
  related: [
    {
      title: "Cluster Autoscaler not scaling down: what keeps nodes running",
      where: "Learn",
      href: "/learn/cluster-autoscaler-not-scaling-down",
    },
    {
      title: "How to drain a Kubernetes node without downtime",
      where: "Learn",
      href: "/learn/kubernetes-drain-node-without-downtime",
    },
    {
      title: "The safe-to-evict and do-not-disrupt annotations explained",
      where: "Learn",
      href: "/learn/safe-to-evict-do-not-disrupt",
    },
    {
      title: "Cordon vs drain in Kubernetes: what each does to a node",
      where: "Learn",
      href: "/learn/cordon-vs-drain",
    },
    {
      title: "Karpenter consolidation: policies, budgets and limits",
      where: "Learn",
      href: "/learn/karpenter-consolidation",
    },
  ],
};
