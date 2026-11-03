import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/pod-disruption-budget-best-practices/1";
import { figure as figure2 } from "@/features/learn/figures/pod-disruption-budget-best-practices/2";

export const article: Article = {
  slug: "pod-disruption-budget-best-practices",
  title: "Pod disruption budget best practices",
  meta: "Pod disruption budget best practices: pick maxUnavailable or minAvailable, keep drains moving, and fix blocked AKS and EKS node upgrades.",
  h1: "Pod disruption budget best practices",
  deck: "Set each budget so it protects the app and still lets drains, upgrades and scale-down finish.",
  card: "Set each PDB so it protects the app without holding its node.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Node lifecycle and scheduling",
  published: "2026-11-01",
  updated: "2026-11-03",
  author: "sonia",
  cover: "/learn-covers/zoorik-learn-pod-disruption-budget-best-practices-1200x630.webp",
  coverAlt: "Pod disruption budgets: one replica may go while the rest stay available",
  short: [
    "Every PodDisruptionBudget (PDB) should allow at least one disruption at the replica count you run. For most workloads, set ",
    { code: "maxUnavailable" },
    " to 1. A PDB that allows none stalls drains, can fail AKS and EKS node upgrades, and keeps spare nodes running.",
  ],
  sections: [
    {
      id: "pod-disruption-budget-best-practices",
      title: "The checklist",
      blocks: [
        {
          kind: "h3",
          id: "allow-at-least-one-disruption-at-the",
          title: "Allow at least one disruption",
        },
        {
          kind: "p",
          text: [
            "A budget allows no disruption when ",
            { code: "maxUnavailable" },
            " is 0 or 0%, or when ",
            { code: "minAvailable" },
            " is 100% or equal to the replica count. Kubernetes calls that “requiring zero voluntary evictions”, and a drain of a node running those pods never completes.",
          ],
        },
        {
          kind: "p",
          text: [
            "Keep an integer ",
            { code: "minAvailable" },
            " below your smallest replica count. A percentage can still allow none, because Kubernetes rounds ",
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
            " of 90%, the docs’ example for a stateless frontend, on 9\u00a0replicas. 90% of 9 is 8.1, which rounds up to 9 pods that must stay healthy, so 9 − 9 leaves 0 allowed disruptions.",
          ],
        },
        {
          kind: "p",
          text: [
            "At 10\u00a0replicas, 90% is exactly 9 and leaves 1. A ",
            { code: "maxUnavailable" },
            " of 1 on the same 9\u00a0replicas needs 8 healthy and leaves 1.",
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "h3",
          id: "maxunavailable-vs-minavailable-pick-by-replica-count",
          title: "maxUnavailable or minAvailable",
        },
        {
          kind: "p",
          text: [
            "A PDB sets one of the two, never both, as a number or a percentage. ",
            { code: "maxUnavailable" },
            " is how many selected pods may be down. ",
            { code: "minAvailable" },
            " is how many must stay up.",
          ],
        },
        {
          kind: "p",
          text: [
            "Prefer ",
            { code: "maxUnavailable" },
            ". Kubernetes recommends it because it “automatically responds to changes in the number of replicas”, which suits anything a ",
            { a: "Horizontal Pod Autoscaler", href: "/learn/glossary/horizontal-pod-autoscaler" },
            " (HPA) scales. Its percentages round up too, so 30% of a single replica lets that pod go.",
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
              "0 below 10\u00a0replicas, then 10%, rounded down",
            ],
            [
              "Quorum app such as etcd, ZooKeeper or Consul, 5 members",
              [{ code: "maxUnavailable: 1" }, ", or ", { code: "minAvailable: 3" }],
              "1, or 2",
            ],
            ["Restartable Job", "No budget", "Not limited: the Job controller replaces the pod"],
            [
              "Bare pods, or an operator’s pods without a scale subresource",
              ["An integer ", { code: "minAvailable" }, " only"],
              "Healthy pods minus that integer",
            ],
          ],
        },
        {
          kind: "h3",
          id: "poddisruptionbudget-example-for-a-deployment",
          title: "Example for a Deployment",
        },
        { kind: "p", text: ["For a Deployment labelled ", { code: "app: <app>" }, ":"] },
        {
          kind: "code",
          lang: "yaml",
          code: "apiVersion: policy/v1\nkind: PodDisruptionBudget\nmetadata:\n  name: <app>-pdb\n  namespace: <namespace>\nspec:\n  maxUnavailable: 1\n  unhealthyPodEvictionPolicy: AlwaysAllow\n  selector:\n    matchLabels:\n      app: <app>",
        },
        {
          kind: "p",
          text: [
            "Spread the replicas too. Under this budget, ",
            { a: "a drain", href: "/learn/kubernetes-drain-node-without-downtime" },
            " of a node holding two of the pods evicts one. It waits until a replacement is Ready elsewhere before it evicts the other. Pod anti-affinity or ",
            { a: "topology spread constraints", href: "/learn/topology-spread-constraints" },
            " keep a Deployment’s pods on different nodes.",
          ],
        },
        {
          kind: "h3",
          id: "use-maxunavailable-0-only-as-a-deliberate",
          title: "maxUnavailable: 0 as a hold",
        },
        {
          kind: "p",
          text: [
            "A PDB with ",
            { code: "maxUnavailable" },
            " set to 0 blocks every voluntary eviction of its pods. Kubernetes gives it one use: a single-instance stateful app whose owner must be asked first. The owner deletes the PDB when ready for the downtime, then recreates it.",
          ],
        },
        {
          kind: "p",
          text: [
            "Without that agreement, it holds the node through drains, upgrades that honour budgets, and scale-down. A single replica that can take a short restart needs no budget. An app that can run two replicas on separate nodes is better served by a ",
            { code: "maxUnavailable" },
            " of 1.",
          ],
        },
        {
          kind: "h3",
          id: "give-kube-system-pods-that-can-move",
          title: "Budgets for kube-system pods",
        },
        {
          kind: "p",
          text: "A kube-system pod with no PDB, or too strict a PDB, keeps the Cluster Autoscaler from removing its node. The autoscaler’s FAQ gives the fix: a PDB for each kube-system workload that can safely run elsewhere.",
        },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl create poddisruptionbudget <pdb-name> --namespace=kube-system --selector app=<app-name> --max-unavailable 1",
        },
        {
          kind: "p",
          text: "Leave Metrics Server out unless you accept a gap. Restarting it loses metrics for more than a minute, and the HPA relies on them.",
        },
        {
          kind: "callout",
          label: "For engineers",
          text: [
            "DaemonSet and mirror pods don’t count here. The rule comes from ",
            { code: "--skip-nodes-with-system-pods" },
            ", true by default. After ",
            { code: "--blocking-system-pod-distruption-timeout" },
            " (spelled that way, 1\u00a0hour by default), the autoscaler can evict a kube-system pod with no PDB. A PDB that allows none still blocks it.",
          ],
        },
        { kind: "h3", id: "let-unhealthy-pods-be-evicted", title: "Let unhealthy pods be evicted" },
        {
          kind: "p",
          text: [
            "Under the default policy, ",
            { code: "IfHealthyBudget" },
            ", a running pod that isn’t Ready can be evicted only while the app isn’t already disrupted. Pods stuck in CrashLoopBackOff can then block a drain.",
          ],
        },
        {
          kind: "p",
          text: [
            "Set ",
            { code: "unhealthyPodEvictionPolicy" },
            " to ",
            { code: "AlwaysAllow" },
            " to let them go. It has been stable since Kubernetes 1.31, and the Kubernetes Disruptions page recommends it. The trade-off is that an unhealthy pod gets no more time to recover.",
          ],
        },
        {
          kind: "h3",
          id: "one-budget-per-workload-on-its-controllers",
          title: "One budget per workload",
        },
        {
          kind: "p",
          text: [
            "Copy the controller’s ",
            { code: ".spec.selector" },
            " into the PDB, and don’t let selectors overlap. The Eviction API refuses to evict any pod that more than one PDB selects. An empty selector, ",
            { code: "{}" },
            ", matches every pod in the namespace.",
          ],
        },
        {
          kind: "h3",
          id: "check-allowed-disruptions-before-you-drain",
          title: "Check before you drain",
        },
        {
          kind: "ol",
          items: [
            [
              { b: "List every budget." },
              " The ALLOWED DISRUPTIONS column shows how many evictions each one allows now:",
            ],
          ],
        },
        { kind: "code", lang: "bash", code: "kubectl get pdb --all-namespaces" },
        {
          kind: "ol",
          start: 2,
          items: [
            [
              { b: "Read any budget at 0 in full." },
              " A drain of any node running its pods will wait. The status fields ",
              { code: "currentHealthy" },
              ", ",
              { code: "desiredHealthy" },
              ", ",
              { code: "disruptionsAllowed" },
              " and ",
              { code: "expectedPods" },
              " show why. A 0 can also mean the selector matches no pods:",
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
      id: "a-budget-that-allows-no-disruption-keeps",
      title: "How a budget holds a node",
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
          text: "Voluntary means chosen by a person or a controller, such as a drain for an upgrade or a scale-down. A PDB can’t prevent involuntary ones, such as a hardware failure, but they still count against its budget.",
        },
        {
          kind: "p",
          text: [
            "A budget works through the Eviction API. A tool that respects PDBs asks to evict a pod, and the API server refuses while the eviction would break the budget. ",
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
          text: "The disruption controller counts the selected pods whose Ready condition is True, then takes away how many must stay healthy. So 3 healthy pods against 2 required leave 1. At 0, every eviction is refused.",
        },
        {
          kind: "p",
          text: [
            "That is where a budget meets cloud cost, because ",
            { a: "Kubernetes cost optimization", href: "/kubernetes-cost-optimization" },
            " relies on removing spare nodes. The Cluster Autoscaler ",
            { a: "removes a node", href: "/learn/cluster-autoscaler-not-scaling-down" },
            " only after checking that its pods’ PDBs allow at least one eviction. If an eviction still fails, it keeps the node.",
          ],
        },
        {
          kind: "callout",
          label: "Worked example",
          text: [
            "A Deployment’s PDB sets ",
            { code: "minAvailable" },
            " to 2, and its HPA has a ",
            { code: "minReplicas" },
            " of 2. By day the HPA adds pods, so a disruption is allowed. Overnight it sits at 2, the budget allows none, and neither pod’s node can be emptied. With a ",
            { code: "maxUnavailable" },
            " of 1 instead, one pod can move at any replica count.",
          ],
        },
      ],
    },
    {
      id: "pod-disruption-budgets-on-aks-a-blocked",
      title: "Budgets on AKS",
      blocks: [
        {
          kind: "p",
          text: "During an Azure Kubernetes Service (AKS) rolling upgrade, AKS adds surge capacity, cordons and drains a node, then reimages or replaces it. The Eviction API checks each PDB during the drain.",
        },
        {
          kind: "p",
          text: [
            "AKS waits on evictions for the node drain timeout, 30\u00a0minutes by default. If a budget still blocks, the upgrade fails with ",
            { code: "UpgradeFailed" },
            " and a message that the eviction “would violate the pod’s disruption budget”.",
          ],
        },
        {
          kind: "p",
          text: [
            "Microsoft’s advice is to “allow at least one disruption when the workload permits”. Its pre-upgrade checks look for misconfigured PDBs, such as ",
            { code: "maxUnavailable=0" },
            ". AKS Automatic builds those checks into its upgrades. On AKS Standard, they are part of your own workflow.",
          ],
        },
        { kind: "p", text: "On AKS Standard, Microsoft lists three ways past a blocked drain:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Cordon honours PDBs." },
              " With undrainable node behaviour ",
              { code: "Cordon" },
              ", a node that can’t drain is cordoned and labelled ",
              { code: "kubernetes.azure.com/upgrade-status=Quarantined" },
              ". Up to ",
              { code: "--max-blocked-nodes" },
              " such nodes are tolerated, and you fix them afterwards.",
            ],
            [
              { b: "Force upgrade bypasses PDBs." },
              " Microsoft warns that it “might cause service disruption by draining all pods simultaneously”. Fix the budget before you reach for ",
              { code: "--enable-force-upgrade" },
              ".",
            ],
            [
              { b: "Automatic PDB management adds replicas." },
              " This preview extension scales a Deployment up while its PDB blocks a drain, then back down. It can also create PDBs for Deployments that have none.",
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
          text: "From 1 June 2027, AKS also upgrades any cluster left on an unsupported Kubernetes version past its 60-day grace period. Such a platform-initiated upgrade “can override a Pod Disruption Budget that blocks a node drain”.",
        },
      ],
    },
    {
      id: "pod-disruption-budgets-on-eks-a-refused",
      title: "Budgets on EKS",
      blocks: [
        {
          kind: "p",
          text: "On Amazon Elastic Kubernetes Service (EKS), what a budget at 0 does depends on what is removing the node:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Managed node group update." },
              " If an old node’s pods haven’t left within 15\u00a0minutes, the update fails with ",
              { code: "PodEvictionFailure" },
              ". AWS lists an aggressive PDB, or several PDBs on one pod, among the causes. The force flag on the ",
              { code: "update-nodegroup-version" },
              " request deletes those pods instead, past their budgets.",
            ],
            [{ b: "Cluster Autoscaler." }, " It checks budgets first and keeps the node."],
            [
              { b: "Karpenter." },
              " It won’t consolidate the node, and reports an ",
              { code: "Unconsolidatable" },
              " event that names the budget, such as “pdb default/inflate-pdb prevents pod evictions”. ",
              { a: "Karpenter consolidation", href: "/learn/karpenter-consolidation" },
              " covers its other rules.",
            ],
            [
              { b: "EKS Auto Mode." },
              " An expiry or drift replacement waits for the budget only until the node’s grace period ends. Then the pods are deleted.",
            ],
          ],
        },
        {
          kind: "p",
          text: "On all four, the lasting fix is a budget that allows one eviction.",
        },
        {
          kind: "p",
          text: [
            "On Karpenter, a NodePool’s ",
            { code: "terminationGracePeriod" },
            " caps how long a budget can hold a node that is being removed. When it runs out, the remaining pods are forcibly deleted, blocking PDBs included. With it set, a node can also be replaced for drift while a budget blocks.",
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            "On ",
            { a: "EKS Auto Mode", href: "/learn/glossary/eks-auto-mode" },
            ", each NodeClaim gets a 24-hour grace period when its NodePool sets none. So a budget at 0 delays an expiry or drift replacement by up to about a day.",
          ],
        },
        {
          kind: "p",
          text: "By default, Auto Mode also terminates instances after 336\u00a0hours (14\u00a0days). It replaces nodes for drift roughly once a week, as new Auto Mode AMIs come out.",
        },
        { kind: "svg", figure: figure2 },
      ],
    },
    {
      id: "how-coral-works-within-your-pod-disruption",
      title: "Coral and your budgets",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " rebalances CPU and memory requests and removes the nodes you don’t need on AKS and EKS. Every eviction it makes stays within your PDBs.",
          ],
        },
        { kind: "h3", id: "resizing-pods-and-draining-nodes", title: "Resizing and moving pods" },
        {
          kind: "p",
          text: "Running pods are resized in place where the node allows it. Otherwise they are replaced one at a time, within your PDBs.",
        },
        { kind: "p", text: "To drain a node, Coral moves each pod the first way that works:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Warm handover." },
              " For a Deployment or an Argo Rollout that qualifies, Coral scales the owner up by one. Once the new pod is Ready on another node, Coral evicts the old one within its PDB.",
            ],
            [
              { b: "Live migration." },
              " Where both nodes support it, Coral checkpoints the pod and restores it on the other node.",
            ],
            [
              { b: "Eviction." },
              " Any other pod is evicted through the Eviction API, within its PDB.",
            ],
          ],
        },
        { kind: "h3", id: "rebalancing-within-your-budgets", title: "Removing nodes" },
        {
          kind: "p",
          text: [
            "Before a drain, Coral ",
            { a: "checks on the live cluster", href: "/coral-faq#how-do-you-make-sure-node" },
            " that every pod fits on another node. It respects PDBs and do-not-disrupt, and drains one node at a time. A node whose drain can’t finish goes back into service.",
          ],
        },
        {
          kind: "p",
          text: "A rebalance replaces the nodes you choose with cheaper machines that your Karpenter or AKS node auto provisioning launches. It never goes past a PDB. In a warm handover, the new copy must be Ready and serving, with no restarts, before the old pod goes.",
        },
        {
          kind: "p",
          text: "When a PDB says “not now”, Coral keeps the new copy and retries. A node that can’t be emptied in time is kept.",
        },
        { kind: "h3", id: "seeing-what-a-budget-holds", title: "Held nodes" },
        {
          kind: "p",
          text: [
            "A PDB at 0 keeps its pods’ node in place. Coral’s console names ",
            { a: "each held node and its fix", href: "/coral-guide#nodes-held" },
            ". Add replicas or relax the budget, or give a kube-system pod a budget that allows at least one disruption. The console also lists workload setups that make optimization risky, PDBs among them, with the fix for each.",
          ],
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
      title: "Cluster Autoscaler not scaling down",
      where: "Learn",
      href: "/learn/cluster-autoscaler-not-scaling-down",
    },
    {
      title: "kubectl drain without any downtime",
      where: "Learn",
      href: "/learn/kubernetes-drain-node-without-downtime",
    },
    {
      title: "Karpenter do-not-disrupt vs safe-to-evict",
      where: "Learn",
      href: "/learn/safe-to-evict-do-not-disrupt",
    },
    {
      title: "kubectl cordon vs drain",
      where: "Learn",
      href: "/learn/cordon-vs-drain",
    },
    {
      title: "Karpenter consolidation",
      where: "Learn",
      href: "/learn/karpenter-consolidation",
    },
  ],
  relatedTitle: "More on drains and scale-down",
};
