import type { Article } from "@/content/learn/article";

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
  published: "2026-11-17",
  updated: "2026-11-17",
  author: "sonia",
  short: [
    "Pod disruption budget best practices come down to one rule: every budget should allow at least one disruption at the replica count you really run. A PodDisruptionBudget (PDB) that allows none keeps its pods, and their node, in place. Drains, upgrades and node scale-down on AKS and EKS then stall or fail. Use ",
    { code: "maxUnavailable: 1" },
    " for most workloads, keep an integer ",
    { code: "minAvailable" },
    " below your smallest replica count, and give kube-system pods that can move a budget of their own.",
  ],
  sections: [
    {
      id: "what-a-pod-disruption-budget-limits-and",
      title: "What a pod disruption budget limits, and what it doesn’t",
      blocks: [
        {
          kind: "p",
          text: [
            "A PodDisruptionBudget limits how many pods of a replicated app voluntary disruptions can take down at once. It has been stable since Kubernetes 1.21, in the ",
            { code: "policy/v1" },
            " API. Voluntary means chosen by a person or a controller, such as draining a node for an upgrade or to scale the cluster down. A PDB can’t prevent involuntary ones, such as a hardware failure, though they count against its budget.",
          ],
        },
        {
          kind: "p",
          text: [
            "The budget works through the Eviction API. A tool that respects PDBs asks to evict a pod, and the API server refuses while the eviction would break the budget, so ",
            { code: "kubectl drain" },
            " retries until the node is empty or its timeout runs out. Deleting a pod directly skips the check, and so does a Deployment or StatefulSet rolling update, though pods a rollout takes down still count against the budget.",
          ],
        },
        {
          kind: "p",
          text: "One figure decides what happens next: allowed disruptions. The disruption controller counts the selected pods whose Ready condition is True and compares that with how many must stay healthy, so 3 healthy pods against 2 required leave 1. At 0, every eviction is refused. If the budget can never rise above 0, you “cannot successfully drain a Node running one of those Pods.”",
        },
        {
          kind: "p",
          text: [
            "That’s where a budget meets the bill. The Cluster Autoscaler ",
            { a: "removes a node", href: "/learn/cluster-autoscaler-not-scaling-down" },
            " only after checking that the PDBs of its pods allow at least one eviction, and it keeps the node if an eviction still fails. Karpenter won’t consolidate a node while any pod on it has a blocking PDB. One budget that allows no disruption keeps a whole node running, however little its pods use. ",
            { a: "How to reduce Kubernetes cost", href: "/learn/reduce-kubernetes-cost" },
            " shows where node removal fits.",
          ],
        },
      ],
    },
    {
      id: "pod-disruption-budget-best-practices-the-checklist",
      title: "Pod disruption budget best practices: the checklist",
      blocks: [
        {
          kind: "p",
          text: "These Kubernetes PDB best practices protect an app during a drain and still let the drain finish.",
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
            " is 100% or equal to the replica count. Kubernetes calls that “requiring zero voluntary evictions”.",
          ],
        },
        {
          kind: "p",
          text: [
            "One way to get there by accident is an integer ",
            { code: "minAvailable" },
            " beside a Horizontal Pod Autoscaler (HPA). With ",
            { code: "minAvailable: 2" },
            " and an HPA whose ",
            { code: "minReplicas" },
            " is 2, the budget allows a disruption while the HPA runs extra pods, and none whenever it sits at its minimum.",
          ],
        },
        {
          kind: "p",
          text: [
            "Another is percentage rounding. Kubernetes rounds ",
            { code: "minAvailable" },
            " up to a whole pod, so ",
            { code: 'minAvailable: "90%"' },
            ", the docs’ example for a stateless frontend, keeps all 9\u00a0pods of a 9-replica Deployment: 90% of 9 is 8.1, rounded up to 9. Below 10\u00a0replicas, that budget allows no disruption.",
          ],
        },
        {
          kind: "h3",
          id: "maxunavailable-vs-minavailable-pick-by-replica-count",
          title: "maxUnavailable vs minAvailable: pick by replica count",
        },
        {
          kind: "p",
          text: [
            "A PDB sets one of the two, never both. ",
            { code: "maxUnavailable" },
            " is how many selected pods may be unavailable after an eviction, ",
            { code: "minAvailable" },
            " the count that must stay available, and each takes a number or a percentage. Kubernetes recommends ",
            { code: "maxUnavailable" },
            " because it “automatically responds to changes in the number of replicas”, so it suits anything an HPA scales. Its percentages round up too: 30% of a single replica lets that pod go.",
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
          text: "The figures assume every selected pod is Ready. A pod that isn’t Ready uses up one of them.",
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
            "Spread the replicas, too. In the Kubernetes walkthrough, ",
            { a: "a drain", href: "/learn/kubernetes-drain-node-without-downtime" },
            " evicts one of two pods on the same node and is refused the second until a replacement is Ready elsewhere. Pod anti-affinity or ",
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
            { code: "maxUnavailable: 0" },
            " blocks every voluntary eviction of the pods it selects. Kubernetes gives it one use: a single-instance stateful app whose owner wants to be asked first, and who deletes the PDB when ready for the downtime, then recreates it. Without that agreement, it pins the node against drains, budget-honouring upgrades and scale-down. A single replica that can take a short restart needs no budget, and an app that can run two replicas on different nodes is better served by ",
            { code: "maxUnavailable: 1" },
            ".",
          ],
        },
        {
          kind: "h3",
          id: "give-kube-system-pods-that-can-move",
          title: "Give kube-system pods that can move a budget",
        },
        {
          kind: "p",
          text: [
            "A kube-system pod with too strict a PDB keeps the Cluster Autoscaler from removing its node, and so can one with no PDB. DaemonSet and mirror pods don’t count, and the behaviour comes from ",
            { code: "--skip-nodes-with-system-pods" },
            ", which is true by default. After ",
            { code: "--blocking-system-pod-distruption-timeout" },
            " (spelled that way, 1\u00a0hour by default), the autoscaler can evict one without a PDB, but a PDB that allows no disruption still holds the node. The autoscaler’s FAQ gives the fix, a PDB for each kube-system workload that can safely run elsewhere:",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl create poddisruptionbudget <pdb-name> --namespace=kube-system --selector app=<app-name> --max-unavailable 1",
        },
        {
          kind: "p",
          text: "Leave Metrics Server alone unless you accept a gap, the FAQ adds: restarting it loses metrics for more than a minute, and the HPA relies on them.",
        },
        { kind: "h3", id: "let-unhealthy-pods-be-evicted", title: "Let unhealthy pods be evicted" },
        {
          kind: "p",
          text: [
            "Under the default policy, ",
            { code: "IfHealthyBudget" },
            ", a running pod that isn’t Ready can be evicted only while the app isn’t already disrupted, so an app whose pods crash-loop can block a drain. Setting ",
            { code: "unhealthyPodEvictionPolicy: AlwaysAllow" },
            ", stable since Kubernetes 1.31 and recommended on the Kubernetes Disruptions page, lets those pods go.",
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
            " into the PDB and keep selectors from overlapping, because the Eviction API refuses to evict any pod that more than one PDB selects. Watch for an empty selector as well: ",
            { code: "{}" },
            " matches every pod in the namespace.",
          ],
        },
        {
          kind: "h3",
          id: "check-allowed-disruptions-before-you-drain",
          title: "Check allowed disruptions before you drain",
        },
        {
          kind: "p",
          text: "Kubernetes shows a PDB’s allowed disruptions in the ALLOWED DISRUPTIONS column, and the full status in its YAML:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl get poddisruptionbudgets --all-namespaces\nkubectl get poddisruptionbudgets <pdb-name> --namespace <namespace> -o yaml",
        },
        {
          kind: "p",
          text: [
            "A 0 means a drain of any node running those pods will wait, or as Microsoft puts it, “An ALLOWED DISRUPTIONS value of 0 can block an AKS node drain.” The status fields ",
            { code: "currentHealthy" },
            ", ",
            { code: "desiredHealthy" },
            ", ",
            { code: "disruptionsAllowed" },
            " and ",
            { code: "expectedPods" },
            " show why, and a 0 can also mean the selector matches no pods.",
          ],
        },
      ],
    },
    {
      id: "pod-disruption-budgets-on-aks",
      title: "Pod disruption budgets on AKS",
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
            ", among its pre-upgrade validations, which on AKS Standard are part of your own workflow. The node drain timeout, 30\u00a0minutes by default, sets how long AKS waits on pod evictions. When a strict budget still blocks a drain, the upgrade fails with ",
            { code: "UpgradeFailed" },
            " and a message that the eviction “would violate the pod’s disruption budget”. For AKS Standard, Microsoft lists three ways forward:",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              "Undrainable node behaviour ",
              { code: "Cordon" },
              " keeps honouring PDBs. A node that can’t drain is cordoned and labelled ",
              { code: "kubernetes.azure.com/upgrade-status=Quarantined" },
              ", and up to ",
              { code: "--max-blocked-nodes" },
              " of them are tolerated. You resolve them afterwards.",
            ],
            [
              "Force upgrade bypasses PDBs, and Microsoft warns that it “might cause service disruption by draining all pods simultaneously.” Fix the budget before you reach for its flag, ",
              { code: "--enable-force-upgrade" },
              ".",
            ],
            "Automatic PDB management, a preview extension, adds replicas during a drain when a PDB blocks eviction on a cordoned node, and can create PDBs for Deployments without one.",
          ],
        },
        { kind: "p", text: "The first option is set per node pool:" },
        {
          kind: "code",
          lang: "bash",
          code: "az aks nodepool update \\\n  --resource-group <resource-group> \\\n  --cluster-name <cluster-name> \\\n  --name <node-pool> \\\n  --undrainable-node-behavior Cordon \\\n  --max-blocked-nodes 2 \\\n  --drain-timeout 30",
        },
        {
          kind: "p",
          text: "From 1 June 2027, AKS also upgrades any cluster that stays on an unsupported Kubernetes version past its 60-day grace period, and Microsoft says such a platform-initiated upgrade “can override a Pod Disruption Budget that blocks a node drain”.",
        },
      ],
    },
    {
      id: "pod-disruption-budgets-on-eks",
      title: "Pod disruption budgets on EKS",
      blocks: [
        {
          kind: "p",
          text: "On Amazon Elastic Kubernetes Service (EKS), managed node groups, the Cluster Autoscaler, Karpenter and EKS Auto Mode each treat a refused eviction differently.",
        },
        {
          kind: "p",
          text: [
            "A managed node group update drains each old node and fails with ",
            { code: "PodEvictionFailure" },
            " if its pods haven’t left within 15\u00a0minutes. AWS lists an aggressive PDB, or several PDBs on one pod, among the causes. Forcing the update deletes pods that won’t leave, bypassing their budgets. The force flag goes on the ",
            { code: "update-nodegroup-version" },
            " request, and the lasting fix is a budget that allows one eviction.",
          ],
        },
        {
          kind: "p",
          text: [
            "The Cluster Autoscaler keeps a node whose PDBs allow no eviction, as described above. Karpenter skips a node with a blocking PDB for consolidation and reports an ",
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
            " caps how long a budget can hold a node that Karpenter is removing. When it runs out, the remaining pods are forcibly deleted, blocking PDBs included, and a node with one set can be replaced for drift even while a budget blocks. EKS Auto Mode sets 24\u00a0hours on each NodeClaim whose NodePool sets none. By default it also terminates instances after 336\u00a0hours and replaces nodes for drift roughly once a week, as new Auto Mode AMIs come out. So on Auto Mode, a budget that allows no disruption delays an expiry or drift replacement by up to about a day, and then its pods are deleted.",
          ],
        },
      ],
    },
    {
      id: "how-coral-works-with-your-pod-disruption",
      title: "How Coral works with your pod disruption budgets",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " optimizes Kubernetes on AKS and EKS. When it resizes or moves a healthy pod, it stays within your budgets:",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Pods." },
              " Pods are resized in place where possible, and otherwise replaced one at a time, within your PDBs.",
            ],
            [
              { b: "Drains." },
              " Coral tries a warm handover first. For a Deployment or an Argo Rollout that qualifies, it scales the owner up by one, waits until the new pod is Ready on another node, then evicts the old pod within its PDB. Other pods are evicted within their PDBs, and a single-replica app gets a short restart.",
            ],
            [
              { b: "Consolidation." },
              " Before draining, Coral simulates the scheduler on the live cluster. It respects PDBs and do-not-disrupt, and it drains one node at a time, putting a node back into service if its drain can’t finish in 10\u00a0minutes.",
            ],
            [
              { b: "The Evictor." },
              " It moves pods off lightly used nodes and never overrides a PodDisruptionBudget.",
            ],
            [
              { b: "Held nodes." },
              " A PDB that allows no disruption keeps its pods’ node in place. Node list → “What’s holding them” names each ",
              { a: "held node", href: "/coral/guide#nodes-held" },
              " and its fix: add replicas or relax the budget, or give a kube-system pod a budget that allows at least one disruption.",
            ],
            [
              { b: "Optimization constraints." },
              " This advisory page lists workload setups that make optimization risky, PodDisruptionBudgets among them, with the fix for each.",
            ],
          ],
        },
        {
          kind: "p",
          text: "A rebalance never goes past a PDB either. It replaces the nodes you choose with cheaper machines that your Karpenter or NAP launches. In a warm handover, the new copy must be Ready and serving for 5\u00a0minutes with no restarts before the old pod goes. When a PDB says “not now”, Coral keeps the new copy and retries, and a node that can’t be emptied within 45\u00a0minutes is kept.",
        },
        {
          kind: "p",
          text: [
            "On our own AKS development cluster, node optimization removed one 4-CPU worker in under 10\u00a0minutes, and single-copy apps restarted once. The figures are in ",
            {
              a: "How we reduced our own cluster’s machine bill by 58%",
              href: "/case-studies/coral-dev-cluster",
            },
            ".",
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
    { title: "Nodes held", where: "Coral product guide", href: "/coral/guide#nodes-held" },
    {
      title: "How do you make sure node consolidation doesn’t cause scheduling failures later?",
      where: "Coral FAQ",
      href: "/coral/faq#how-do-you-make-sure-node",
    },
  ],
};
