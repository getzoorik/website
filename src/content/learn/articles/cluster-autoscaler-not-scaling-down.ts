import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/cluster-autoscaler-not-scaling-down/1";

export const article: Article = {
  slug: "cluster-autoscaler-not-scaling-down",
  title: "Cluster Autoscaler not scaling down on AKS and EKS",
  meta: "Cluster Autoscaler not scaling down on AKS or EKS: the pods, PDBs, node pool minimums and timers that keep nodes running, and the fix for each one.",
  h1: "Cluster Autoscaler not scaling down: what keeps nodes running",
  deck: "The pods, budgets, minimums and timers that hold nodes on AKS and EKS, how to find which one, and the fix.",
  card: "Why the Cluster Autoscaler keeps a node on AKS or EKS, how to find the reason, and the fix for each one.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes autoscaling",
  published: "2026-10-24",
  updated: "2026-10-24",
  author: "saurav",
  short:
    "When the Cluster Autoscaler is not scaling down, each node it keeps misses one of its conditions. A node’s CPU and memory requests (not real use) must each stay under 50% of its allocatable, and every pod on it must be able to move. A PodDisruptionBudget that allows no disruption, a kube-system pod without one, a pod no controller manages, or a pod marked safe-to-evict “false” can hold its node. So can node pool minimums and the 10-minute timers.",
  sections: [
    {
      id: "how-the-cluster-autoscaler-decides-a-node",
      title: "How the Cluster Autoscaler decides a node can go",
      blocks: [
        {
          kind: "p",
          text: [
            "The ",
            { a: "Cluster Autoscaler", href: "/learn/hpa-vs-vpa-vs-cluster-autoscaler" },
            " adds nodes for pods that can’t be scheduled and removes nodes it calls unneeded. Every 10\u00a0seconds, when no scale-up is needed, it checks each node against three conditions in its FAQ, all of which must hold:",
          ],
        },
        {
          kind: "ul",
          items: [
            "Its pods’ CPU requests and memory requests each add up to less than 50% of the node’s allocatable, DaemonSet and mirror pods included. That 50% is the cluster autoscaler scale down utilization threshold, 0.5 by default.",
            "Every pod on it, apart from DaemonSet and mirror pods, can move to another node.",
            [
              "No ",
              { code: 'cluster-autoscaler.kubernetes.io/scale-down-disabled: "true"' },
              " annotation sits on it.",
            ],
          ],
        },
        {
          kind: "p",
          text: "A node that stays unneeded for 10\u00a0minutes is removed. To empty it, the autoscaler taints the node so no new pods land there and evicts its pods through the eviction API, which honours PodDisruptionBudgets. Non-empty nodes go one at a time, empty ones in batches of up to 10.",
        },
        {
          kind: "p",
          text: [
            "Allocatable is the CPU and memory a node offers to pods, as distinct from its full capacity (",
            { a: "allocatable vs capacity", href: "/learn/kubernetes-allocatable-vs-capacity" },
            " has the detail). The threshold compares requests with allocatable and never looks at use.",
          ],
        },
        {
          kind: "p",
          text: "Take a node with 4\u00a0CPU and 16\u00a0GiB allocatable whose pods request 2.2\u00a0CPU and 6\u00a0GiB: CPU sits at 55%, memory at 37.5%, and the higher figure decides, so the node isn’t a candidate, even if those pods use 0.3\u00a0CPU between them.",
        },
        { kind: "diagram", figure: figure1 },
      ],
    },
    {
      id: "how-to-see-why-the-cluster-autoscaler",
      title: "How to see why the Cluster Autoscaler is not scaling down",
      blocks: [
        {
          kind: "p",
          text: "Start with the autoscaler’s own record. It publishes a status ConfigMap in kube-system whose last-update annotation, the FAQ says, should be no more than 3\u00a0minutes old and is usually 10\u00a0seconds old. If it’s older, check that the autoscaler is up. Events add the detail: ScaleDown on a node it starts to remove, and ScaleDownFailed, with the error message, when the removal fails.",
        },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl get configmap cluster-autoscaler-status -n kube-system -o yaml\nkubectl get events -A --field-selector source=cluster-autoscaler,type=Warning\nkubectl describe node <node-name>",
        },
        {
          kind: "p",
          text: [
            "On Azure Kubernetes Service (AKS) the autoscaler runs in the managed control plane. You read its logs through Azure Monitor. Create a diagnostic setting with the ",
            { code: "cluster-autoscaler" },
            " log category, then query ",
            { code: 'AKSControlPlane | where Category == "cluster-autoscaler"' },
            " in Log Analytics (or ",
            { code: "AzureDiagnostics" },
            " in place of ",
            { code: "AKSControlPlane" },
            " if the setting uses Azure diagnostics mode). The cluster’s Node pools page in the Azure portal also has tiles for autoscale events and warnings.",
          ],
        },
        {
          kind: "p",
          text: [
            "On Amazon Elastic Kubernetes Service (EKS) you run the autoscaler yourself. The project’s AWS example manifest installs it as the ",
            { code: "cluster-autoscaler" },
            " Deployment in kube-system with ",
            { code: "--v=4" },
            ", the level the FAQ recommends for detail on scaling decisions, so ",
            { code: "kubectl -n kube-system logs deployment/cluster-autoscaler" },
            " shows its reasoning. Its version must match your cluster’s, the EKS best practices guide adds, because cross-version use isn’t tested or supported.",
          ],
        },
      ],
    },
    {
      id: "pods-that-keep-a-node-from-scaling",
      title: "Pods that keep a node from scaling down",
      blocks: [
        {
          kind: "p",
          text: "Each of these FAQ reasons holds a node even when other nodes have room for its pods.",
        },
        {
          kind: "h3",
          id: "a-poddisruptionbudget-that-allows-no-disruption",
          title: "A PodDisruptionBudget that allows no disruption",
        },
        {
          kind: "p",
          text: [
            "A PodDisruptionBudget (PDB), stable since Kubernetes 1.21 in the ",
            { code: "policy/v1" },
            " API, limits how many of a workload’s pods voluntary evictions can take down at once. If you set ",
            { code: "maxUnavailable" },
            " to 0, or ",
            { code: "minAvailable" },
            " to 100% or the replica count, Kubernetes says you are “requiring zero voluntary evictions”, and a node running one of those pods can’t be drained. A single-replica Deployment with ",
            { code: "minAvailable: 1" },
            " is one example. Before it removes a node, the Cluster Autoscaler checks that each PDB there allows at least one eviction. If an eviction still fails, the node is kept.",
          ],
        },
        { kind: "code", lang: "bash", code: "kubectl get poddisruptionbudgets --all-namespaces" },
        {
          kind: "p",
          text: [
            "Look for 0 under ALLOWED DISRUPTIONS. Fix: add replicas, or relax the budget so it allows one disruption. ",
            {
              a: "Pod disruption budget best practices",
              href: "/learn/pod-disruption-budget-best-practices",
            },
            " covers which field to use.",
          ],
        },
        { kind: "h3", id: "a-kube-system-pod-with-no-pdb", title: "A kube-system pod with no PDB" },
        {
          kind: "p",
          text: [
            "With ",
            { code: "--skip-nodes-with-system-pods" },
            " on (the default upstream and on AKS), a node running a kube-system pod that has no PDB, or one that’s too strict, isn’t removed. DaemonSet and mirror pods are exempt. The FAQ’s own examples are kube-dns and Metrics Server, and it gives the fix as a PDB for each kube-system workload that can safely move:",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl create poddisruptionbudget <pdb-name> --namespace=kube-system --selector app=<app-name> --max-unavailable 1",
        },
        {
          kind: "p",
          text: [
            "It also warns that restarting Metrics Server loses metrics for more than a minute, and the Horizontal Pod Autoscaler (HPA) relies on them, so add a PDB there only if you accept that. From Cluster Autoscaler 1.33 the rule is softer: a kube-system pod with no PDB stops holding its node once it’s older than ",
            { code: "--blocking-system-pod-distruption-timeout" },
            " (1\u00a0hour by default, spelled as shown). AKS’s profile doesn’t list that timeout, and its docs still describe nodes with kube-system pods as kept.",
          ],
        },
        { kind: "h3", id: "data-in-emptydir-or-hostpath", title: "Data in emptyDir or hostPath" },
        {
          kind: "p",
          text: [
            "The FAQ counts a ",
            { code: "hostPath" },
            " volume, and an ",
            { code: "emptyDir" },
            " that doesn’t use ",
            { code: "medium: Memory" },
            ", as local storage. Upstream, ",
            { code: "--skip-nodes-with-local-storage" },
            " defaults to true, so those pods hold their node. AKS’s profile defaults it to false, and the project’s AWS example manifest for EKS passes ",
            { code: "--skip-nodes-with-local-storage=false" },
            ", so check what your autoscaler really runs with.",
          ],
        },
        {
          kind: "p",
          text: [
            "Fix: move data that must survive to a persistent volume, or list the pod’s local volumes in ",
            { code: "cluster-autoscaler.kubernetes.io/safe-to-evict-local-volumes" },
            ". The pod is released only when every local volume is listed. Name only volumes whose contents the pod can lose.",
          ],
        },
        { kind: "h3", id: "a-pod-nothing-would-recreate", title: "A pod nothing would recreate" },
        {
          kind: "p",
          text: [
            "A pod created directly, rather than by a Deployment, ReplicaSet, Job or StatefulSet, isn’t evicted, because nothing would start it again. Fix: run it under a controller, or annotate it ",
            { code: 'cluster-autoscaler.kubernetes.io/safe-to-evict: "true"' },
            " if losing it is acceptable.",
          ],
        },
        {
          kind: "h3",
          id: "a-pod-marked-safe-to-evict-false",
          title: "A pod marked safe-to-evict “false”",
        },
        {
          kind: "p",
          text: [
            "A pod annotated ",
            { code: 'cluster-autoscaler.kubernetes.io/safe-to-evict: "false"' },
            " is never evicted by the Cluster Autoscaler, so its node stays. AWS’s EKS guide suggests it for pods that are expensive to evict, such as test runners and machine learning tasks, and Microsoft asks you to use it with caution. Fix: take the annotation off pods that can move. Both markers get their own page: ",
            {
              a: "the safe-to-evict and do-not-disrupt annotations",
              href: "/learn/safe-to-evict-do-not-disrupt",
            },
            ".",
          ],
        },
        { kind: "h3", id: "no-other-node-the-pod-fits-on", title: "No other node the pod fits on" },
        {
          kind: "p",
          text: [
            "The autoscaler simulates the scheduler before it removes anything. If no other node has room for a pod’s requests, a free ",
            { code: "hostPort" },
            ", or the labels its node selector needs, the node stays. ",
            { a: "Anti-affinity", href: "/learn/pod-affinity-vs-node-affinity" },
            " that allows one pod per node on a set of nodes holds every node running one of them. Fix: relax the constraint. Sizing requests to real use also frees room on the other nodes.",
          ],
        },
      ],
    },
    {
      id: "node-pool-limits-and-timers-that-pause",
      title: "Node pool limits and timers that pause scale-down",
      blocks: [
        {
          kind: "p",
          text: "A node can pass every pod check and still stay. The FAQ’s other reasons:",
        },
        {
          kind: "ul",
          items: [
            "The node group is already at its minimum size.",
            "Someone set the scale-down-disabled annotation on the node.",
            [
              "It became unneeded less than 10\u00a0minutes ago (the cluster autoscaler scale down unneeded time, ",
              { code: "--scale-down-unneeded-time" },
              "), or a scale-up happened in the last 10\u00a0minutes (",
              { code: "--scale-down-delay-after-add" },
              ").",
            ],
            [
              "A scale-down failed less than 3\u00a0minutes ago (",
              { code: "--scale-down-delay-after-failure" },
              "), or removing this node failed, which adds 5\u00a0minutes before it’s tried again.",
            ],
            [{ code: "--scale-down-enabled=false" }, " is set on the autoscaler."],
          ],
        },
        {
          kind: "p",
          text: [
            "In the open-source autoscaler the delay flags apply across all node groups by default (",
            { code: "--scale-down-delay-type-local" },
            " is false), so a scale-up in one pool pauses scale-down in the others for 10\u00a0minutes. Microsoft’s AKS overview makes the same point: scaling in one node pool can affect the others.",
          ],
        },
        {
          kind: "h3",
          id: "aks-node-pool-not-scaling-down-the",
          title: "AKS node pool not scaling down: the cluster autoscaler profile",
        },
        {
          kind: "p",
          text: "On AKS you don’t pass flags. Each node pool has its own minimum and maximum count, and everything else lives in the AKS cluster autoscaler profile, which applies to every autoscaled node pool: Microsoft says you can’t set one per pool. Both commands below change live behaviour. A smaller minimum lets the autoscaler remove nodes down to it, and a profile change reaches every autoscaled pool at once.",
        },
        {
          kind: "code",
          lang: "bash",
          code: "az aks nodepool update \\\n  --resource-group <resource-group> \\\n  --cluster-name <cluster-name> \\\n  --name <node-pool> \\\n  --update-cluster-autoscaler \\\n  --min-count 1 \\\n  --max-count 5\n\naz aks update \\\n  --resource-group <resource-group> \\\n  --name <cluster-name> \\\n  --cluster-autoscaler-profile scale-down-unneeded-time=5m,scale-down-utilization-threshold=0.6",
        },
        {
          kind: "p",
          text: [
            "To tune AKS cluster autoscaler scale down for cost, Microsoft suggests a shorter unneeded time and delay after add and a higher threshold. It also warns against aggressive scale-down in clusters that scale out and in within short intervals, because node provisioning can then take longer. ",
            { code: '--cluster-autoscaler-profile ""' },
            " puts the defaults back. Don’t change an autoscaled pool’s node count by hand, and don’t turn on Virtual Machine Scale Set autoscaling beside the cluster autoscaler.",
          ],
        },
        {
          kind: "h3",
          id: "eks-nodes-not-scaling-down-flags-and",
          title: "EKS nodes not scaling down: flags and group sizes",
        },
        {
          kind: "p",
          text: [
            "On EKS the settings are arguments to the autoscaler’s Deployment, such as ",
            { code: "--scale-down-utilization-threshold=0.6" },
            " or ",
            { code: "--scale-down-unneeded-time=5m" },
            ", so you change them there. The autoscaler respects each Auto Scaling group’s minimum and maximum and only changes its desired size. For a managed node group, it won’t go below ",
            { code: "minSize" },
            ", so a smaller minimum lets it remove nodes down to the new figure:",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "aws eks update-nodegroup-config \\\n  --cluster-name <cluster-name> \\\n  --nodegroup-name <node-group> \\\n  --scaling-config minSize=1",
        },
        {
          kind: "p",
          text: [
            "Leave ",
            { code: "desiredSize" },
            " out. AWS warns that changing it directly can make the Cluster Autoscaler suddenly scale up or down. Unlike AKS, one group on EKS can differ from the rest: keys on an Auto Scaling group such as ",
            {
              code: "k8s.io/cluster-autoscaler/node-template/autoscaling-options/scaledownutilizationthreshold",
            },
            " and ",
            { code: ".../scaledownunneededtime" },
            " override the global flags for it. The autoscaler’s Identity and Access Management (IAM) role needs ",
            { code: "autoscaling:SetDesiredCapacity" },
            " and ",
            { code: "autoscaling:TerminateInstanceInAutoScalingGroup" },
            " on the cluster’s groups, so read the error in any ScaleDownFailed event.",
          ],
        },
      ],
    },
    {
      id: "when-requests-keep-every-node-above-the",
      title: "When requests keep every node above the threshold",
      blocks: [
        {
          kind: "p",
          text: "Sometimes nothing blocks a node at all. It just never drops below 50%, because its requests sit far above use. A pod that requests 1\u00a0CPU and uses 200m holds a full CPU of the node’s allocatable, for the scheduler and for the autoscaler.",
        },
        {
          kind: "p",
          text: [
            "Raising the threshold makes more nodes candidates, but each of their pods still has to fit on the remaining nodes at its full request. DaemonSet requests count toward the sum by default, and ",
            { code: "--ignore-daemonsets-utilization" },
            " (also in the AKS profile) leaves them out. The fix that lasts is requests set from measured use. ",
            { a: "Kubernetes overprovisioning", href: "/learn/kubernetes-overprovisioning" },
            " explains how the gap builds up, and ",
            { a: "pod right sizing", href: "/learn/kubernetes-pod-right-sizing" },
            " shows how to measure it.",
          ],
        },
      ],
    },
    {
      id: "how-coral-helps-the-cluster-autoscaler-remove",
      title: "How Coral helps the Cluster Autoscaler remove nodes",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " optimizes Kubernetes on AKS and EKS, and it works on both sides of this checklist. It rebalances CPU and memory requests to real use. Its node optimization, on from install, then empties spare nodes for your Cluster Autoscaler to remove:",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Checks first." },
              " Before draining, Coral simulates the scheduler on the live cluster, and every pod must fit elsewhere with its affinity, taints, spread, ports and zones. Coral also respects PDBs, do-not-disrupt and your autoscaler’s minimum pool size.",
            ],
            [
              { b: "One by one." },
              " Coral cordons and drains one node at a time. If a drain can’t finish in 10\u00a0minutes, the node goes back into service.",
            ],
            [
              { b: "Your autoscaler deletes." },
              " After “Wait before removing empty nodes” (5\u00a0minutes by default), Coral hands the empty node to your autoscaler, whose own timers decide when it goes. Coral never adds nodes for demand.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "In Coral, Node list → “What’s holding them” names each ",
            { a: "held node", href: "/coral/guide#nodes-held" },
            " with its reason and fix. When a node is removed, a pod whose replacement can’t start first gets a short restart. With only the Cluster Autoscaler, Coral empties nodes but doesn’t move workloads to smaller machines.",
          ],
        },
        {
          kind: "p",
          text: [
            "On our own AKS development cluster, node optimization removed one 4-CPU worker: $147.46 a month of the $213.89 monthly saving in ",
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
      publisher: "Kubernetes autoscaler",
      title: "“Cluster Autoscaler FAQ”",
      url: "https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md",
    },
    {
      publisher: "Kubernetes autoscaler",
      title: "“Cluster Autoscaler on AWS”",
      url: "https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/cloudprovider/aws/README.md",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Use the Cluster Autoscaler in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/cluster-autoscaler",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Cluster autoscaling in Azure Kubernetes Service (AKS) overview”",
      url: "https://learn.microsoft.com/en-us/azure/aks/cluster-autoscaler-overview",
    },
    {
      publisher: "Amazon EKS Best Practices Guide",
      title: "“Cluster Autoscaler”",
      url: "https://docs.aws.amazon.com/eks/latest/best-practices/cas.html",
    },
    {
      publisher: "AWS CLI Command Reference",
      title: "“update-nodegroup-config”",
      url: "https://docs.aws.amazon.com/cli/latest/reference/eks/update-nodegroup-config.html",
    },
    {
      publisher: "Kubernetes",
      title: "“Specifying a Disruption Budget for your Application”",
      url: "https://kubernetes.io/docs/tasks/run-application/configure-pdb/",
    },
    {
      publisher: "Kubernetes autoscaler",
      title: "“Drainability rule for kube-system pods (cluster-autoscaler-1.33.0)”",
      url: "https://github.com/kubernetes/autoscaler/blob/cluster-autoscaler-1.33.0/cluster-autoscaler/simulator/drainability/rules/system/rule.go",
    },
  ],
  related: [
    {
      title: "HPA vs VPA vs Cluster Autoscaler: what each one scales",
      where: "Learn",
      href: "/learn/hpa-vs-vpa-vs-cluster-autoscaler",
    },
    {
      title: "Karpenter vs Cluster Autoscaler: how each removes nodes",
      where: "Learn",
      href: "/learn/karpenter-vs-cluster-autoscaler",
    },
    {
      title: "Pod disruption budget best practices for AKS and EKS",
      where: "Learn",
      href: "/learn/pod-disruption-budget-best-practices",
    },
    { title: "Nodes held", where: "Coral product guide", href: "/coral/guide#nodes-held" },
    {
      title: "How does Coral interact with Cluster Autoscaler or Karpenter decisions?",
      where: "Coral FAQ",
      href: "/coral/faq#how-does-coral-interact-with-cluster",
    },
  ],
};
