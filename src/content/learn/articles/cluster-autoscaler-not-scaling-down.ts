import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/cluster-autoscaler-not-scaling-down/1";
import { figure as figure2 } from "@/features/learn/figures/cluster-autoscaler-not-scaling-down/2";

export const article: Article = {
  slug: "cluster-autoscaler-not-scaling-down",
  title: "Cluster Autoscaler not scaling down on AKS and EKS",
  meta: "Cluster Autoscaler not scaling down on AKS or EKS? It counts requests, not use. What holds a node, from PDBs to timers, how to find it, and each fix.",
  h1: "Cluster Autoscaler not scaling down",
  deck: "Why an underused node stays on AKS or EKS, how to find the reason, and the fix for each.",
  card: "Why the Cluster Autoscaler keeps an underused node on AKS or EKS, and the fix for each reason.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes autoscaling",
  published: "2026-10-21",
  updated: "2026-11-03",
  author: "saurav",
  cover: "/learn-covers/zoorik-learn-cluster-autoscaler-not-scaling-down-1200x630.webp",
  coverAlt:
    "Cluster Autoscaler not scaling down: requests reach above the scale-down line while real use stays low, so the node stays",
  short: [
    "The Cluster Autoscaler counts requests, not use: a node whose CPU or memory requests reach the default 50% of allocatable stays even when idle. Below that line, one pod that can’t move still holds the node. Causes include a ",
    { a: "PodDisruptionBudget", href: "/learn/glossary/pod-disruption-budget" },
    " that allows no disruption, a kube-system pod without one, a pod with no controller and a pod marked safe-to-evict “false”. ",
    { a: "Node pool", href: "/learn/glossary/node-pool" },
    " minimums and 10-minute timers hold nodes too.",
  ],
  sections: [
    {
      id: "why-an-underused-node-still-isnt-removed",
      title: "Why underused nodes stay",
      blocks: [
        {
          kind: "p",
          text: [
            "Take a node with 4\u00a0CPU and 16\u00a0GiB allocatable, the part of its capacity it offers to pods (see ",
            { a: "allocatable vs capacity", href: "/learn/kubernetes-allocatable-vs-capacity" },
            "). Its pods request 2.2\u00a0CPU and 6\u00a0GiB but use only 0.3\u00a0CPU. The ",
            { a: "Cluster Autoscaler", href: "/learn/kubernetes-autoscaling" },
            " keeps it, and you pay for the whole node.",
          ],
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "CPU requests are 55% of allocatable (2.2 ÷ 4) and memory requests 37.5% (6 ÷ 16). The higher figure counts, and 55% is over the 50% line at 2\u00a0CPU (4 × 0.5). Requests must fall by more than 0.2\u00a0CPU to get under it, while 1.9\u00a0CPU of them goes unused (2.2 − 0.3).",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "h3",
          id: "how-cluster-autoscaler-scale-down-decides-a",
          title: "How scale-down decides",
        },
        {
          kind: "p",
          text: "Every 10\u00a0seconds, when no scale-up is needed, the autoscaler checks each node. A node is unneeded when all three hold:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Requests under half:" },
              " its pods’ CPU and memory requests each total less than 50% of allocatable. ",
              { a: "DaemonSet", href: "/learn/glossary/daemonset" },
              " and mirror pods (static pods run from a manifest) are included. That 50% is the ",
              {
                a: "scale-down utilization threshold",
                href: "/learn/glossary/kubernetes-cluster-utilization",
              },
              ", 0.5 by default.",
            ],
            [
              { b: "Pods can move:" },
              " every pod on it, apart from DaemonSet and mirror pods, can move to another node.",
            ],
            [
              { b: "No opt-out:" },
              " the node has no ",
              { code: 'cluster-autoscaler.kubernetes.io/scale-down-disabled: "true"' },
              " annotation.",
            ],
          ],
        },
        {
          kind: "p",
          text: "A node unneeded for 10\u00a0minutes is removed. The autoscaler taints it so no new pods land there, then evicts its pods through the eviction API, which honours PodDisruptionBudgets.",
        },
      ],
    },
    {
      id: "how-to-see-why-the-cluster-autoscaler",
      title: "Find the reason",
      blocks: [
        { kind: "svg", figure: figure2 },
        {
          kind: "ol",
          items: [
            "Check that the autoscaler is up. The last-update annotation on its status ConfigMap should be no more than 3\u00a0minutes old, and is usually 10\u00a0seconds old.",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl get configmap cluster-autoscaler-status -n kube-system -o yaml",
        },
        {
          kind: "ol",
          start: 2,
          items: ["List its warning events in every namespace."],
        },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl get events -A --field-selector source=cluster-autoscaler,type=Warning",
        },
        {
          kind: "ol",
          start: 3,
          items: [
            "Describe a node you expected to go. A ScaleDown event means removal has started, and ScaleDownFailed carries the error when it fails. A node it never tried to remove shows neither.",
          ],
        },
        { kind: "code", lang: "bash", code: "kubectl describe node <node-name>" },
        {
          kind: "ol",
          start: 4,
          items: [
            {
              text: "Read the autoscaler’s logs, which say why it considers a pod unremovable.",
              blocks: [
                {
                  kind: "ul",
                  items: [
                    [
                      { b: "On AKS:" },
                      " the autoscaler runs in the managed control plane. Create an Azure Monitor diagnostic setting with the ",
                      { code: "cluster-autoscaler" },
                      " log category. Then query ",
                      { code: 'AKSControlPlane | where Category == "cluster-autoscaler"' },
                      " in Log Analytics (",
                      { code: "AzureDiagnostics" },
                      " in Azure diagnostics mode). In the portal, the Node pools page has tiles for autoscale events and warnings.",
                    ],
                    [
                      { b: "On EKS:" },
                      " you run the autoscaler yourself. The project’s AWS example manifest installs it as the ",
                      { code: "cluster-autoscaler" },
                      " Deployment in kube-system with ",
                      { code: "--v=4" },
                      ", the log level the FAQ recommends for scaling decisions. Read it with ",
                      { code: "kubectl -n kube-system logs deployment/cluster-autoscaler" },
                      ".",
                    ],
                  ],
                },
              ],
            },
          ],
        },
        { kind: "p", text: "Then match what you find:" },
        {
          kind: "ul",
          items: [
            [
              { b: "A pod:" },
              " a log line saying a pod is unremovable, or a ScaleDownFailed eviction error. The next section has each case.",
            ],
            [
              { b: "An opt-out or minimum:" },
              " scale-down disabled, or the pool already at its minimum count.",
            ],
            [{ b: "Neither:" }, " a timer, or requests at 50% of allocatable or more."],
          ],
        },
      ],
    },
    {
      id: "six-kinds-of-pod-can-keep-their",
      title: "Pods that hold a node",
      blocks: [
        {
          kind: "h3",
          id: "a-poddisruptionbudget-that-allows-no-disruption",
          title: "A strict PodDisruptionBudget",
        },
        {
          kind: "p",
          text: [
            "A PodDisruptionBudget (PDB) limits how many of a workload’s pods voluntary evictions can take down at once. With ",
            { code: "maxUnavailable" },
            " at 0, or ",
            { code: "minAvailable" },
            " at 100% or the replica count, it allows zero voluntary evictions. A node running one of those pods can’t be drained.",
          ],
        },
        {
          kind: "p",
          text: [
            "A single-replica Deployment with ",
            { code: "minAvailable: 1" },
            " is one example. Before removing a node, the autoscaler checks that each PDB on it allows at least one eviction. Look for 0 under ALLOWED DISRUPTIONS:",
          ],
        },
        { kind: "code", lang: "bash", code: "kubectl get poddisruptionbudgets --all-namespaces" },
        {
          kind: "p",
          text: [
            "Fix: add replicas, or relax the budget so it allows one disruption. ",
            {
              a: "Pod disruption budget best practices",
              href: "/learn/pod-disruption-budget-best-practices",
            },
            " covers which field to use.",
          ],
        },
        { kind: "h3", id: "a-kube-system-pod-with-no-pdb", title: "kube-system pods with no PDB" },
        {
          kind: "p",
          text: [
            "A kube-system pod with no PDB holds its node while ",
            { code: "--skip-nodes-with-system-pods" },
            " is on, the default upstream and on AKS. DaemonSet and mirror pods are exempt.",
          ],
        },
        {
          kind: "p",
          text: [
            "Fix: add a PDB for each kube-system workload that can safely move. The FAQ says kube-dns can move when it runs at least 2 replicas. It advises leaving Metrics Server alone: a restart loses metrics for more than a minute, and the ",
            {
              a: "Horizontal Pod Autoscaler (HPA)",
              href: "/learn/glossary/horizontal-pod-autoscaler",
            },
            " relies on them.",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl create poddisruptionbudget <pdb-name> \\\n  --namespace=kube-system \\\n  --selector app=<app-name> \\\n  --max-unavailable 1",
        },
        {
          kind: "callout",
          label: "For engineers",
          text: [
            "From Cluster Autoscaler 1.33, a kube-system pod with no PDB stops holding its node once its age passes a timeout. The flag is ",
            { code: "--blocking-system-pod-distruption-timeout" },
            ", 1\u00a0hour by default and spelled as shown. AKS’s profile doesn’t list this timeout, and its docs still say nodes with kube-system pods are kept.",
          ],
        },
        { kind: "h3", id: "data-in-emptydir-or-hostpath", title: "Data in emptyDir or hostPath" },
        {
          kind: "p",
          text: [
            "Upstream, ",
            { code: "--skip-nodes-with-local-storage" },
            " defaults to true. Then a pod with a ",
            { code: "hostPath" },
            " volume, or an ",
            { code: "emptyDir" },
            " that doesn’t use ",
            { code: "medium: Memory" },
            ", holds its node. AKS’s default profile and the project’s AWS example manifest for EKS both set it to false, so local storage doesn’t hold nodes there. Check what yours runs with.",
          ],
        },
        {
          kind: "p",
          text: [
            "Fix: move data that must survive to a persistent volume, or list the pod’s local volumes in ",
            { code: "cluster-autoscaler.kubernetes.io/safe-to-evict-local-volumes" },
            ". The pod is released only when every local volume is listed, so name only volumes whose data the pod can lose.",
          ],
        },
        { kind: "h3", id: "a-pod-nothing-would-recreate", title: "Pods with no controller" },
        {
          kind: "p",
          text: "A pod created directly, not by a Deployment, ReplicaSet, Job or StatefulSet, isn’t evicted, because nothing would start it again.",
        },
        {
          kind: "p",
          text: [
            "Fix: run it under a controller, or annotate it ",
            { code: 'cluster-autoscaler.kubernetes.io/safe-to-evict: "true"' },
            " if losing it is acceptable.",
          ],
        },
        {
          kind: "h3",
          id: "a-pod-marked-safe-to-evict-false",
          title: "Pods marked safe-to-evict “false”",
        },
        {
          kind: "p",
          text: [
            "The Cluster Autoscaler never evicts a pod annotated ",
            { code: 'cluster-autoscaler.kubernetes.io/safe-to-evict: "false"' },
            ", so its node stays. AWS suggests the annotation for pods that are expensive to evict, such as test runners and machine learning tasks. Microsoft asks you to use it with caution.",
          ],
        },
        {
          kind: "p",
          text: [
            "Fix: remove the annotation from pods that can move. ",
            {
              a: "Safe-to-evict and do-not-disrupt",
              href: "/learn/safe-to-evict-do-not-disrupt",
            },
            " compares both markers.",
          ],
        },
        { kind: "h3", id: "no-other-node-the-pod-fits-on", title: "No room on other nodes" },
        {
          kind: "p",
          text: [
            "The autoscaler first simulates the scheduler. If no other node has room for a pod’s requests, a free ",
            { code: "hostPort" },
            " or the labels its node selector needs, the node stays.",
          ],
        },
        {
          kind: "p",
          text: [
            "Pods limited to one per node on a set of nodes, for example by ",
            { a: "anti-affinity", href: "/learn/pod-affinity-vs-node-affinity" },
            ", always hold their nodes. Every other node in the set is taken or empty, and the autoscaler prefers to remove the empty ones.",
          ],
        },
        {
          kind: "p",
          text: "Fix: relax the constraint. Requests sized to real use also free room on the other nodes.",
        },
      ],
    },
    {
      id: "node-pool-minimums-and-timers-can-still",
      title: "Minimums and timers",
      blocks: [
        { kind: "p", text: "A node with no blocking pod can still stay:" },
        {
          kind: "ul",
          items: [
            [{ b: "Minimum size:" }, " the node group is at its minimum."],
            [
              { b: "Unneeded time:" },
              " it became unneeded less than 10\u00a0minutes ago (",
              { code: "--scale-down-unneeded-time" },
              ").",
            ],
            [
              { b: "Recent scale-up:" },
              " a scale-up happened in the last 10\u00a0minutes (",
              { code: "--scale-down-delay-after-add" },
              ").",
            ],
            [
              { b: "Recent failure:" },
              " a scale-down failed in the last 3\u00a0minutes (",
              { code: "--scale-down-delay-after-failure" },
              "). A failed removal of this node adds 5\u00a0minutes before it’s tried again.",
            ],
            [
              { b: "Scale-down off:" },
              " ",
              { code: "--scale-down-enabled=false" },
              " is set on the autoscaler.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Upstream, the delay flags apply across all node groups by default (",
            { code: "--scale-down-delay-type-local" },
            " is false). A scale-up in one pool pauses scale-down in the others for 10\u00a0minutes.",
          ],
        },
        {
          kind: "h3",
          id: "aks-node-pool-not-scaling-down-the",
          title: "AKS: the autoscaler profile",
        },
        {
          kind: "p",
          text: "On AKS you don’t pass flags. Each node pool has its own minimum and maximum count. Everything else lives in the cluster autoscaler profile, which covers every autoscaled pool; you can’t set one per pool.",
        },
        {
          kind: "p",
          text: "Both commands change live behaviour. A smaller minimum lets the autoscaler remove nodes down to it. The profile change, with example values here, reaches all autoscaled pools at once.",
        },
        {
          kind: "code",
          lang: "bash",
          code: "az aks nodepool update \\\n  --resource-group <resource-group> \\\n  --cluster-name <cluster-name> \\\n  --name <node-pool> \\\n  --update-cluster-autoscaler \\\n  --min-count <new-min> \\\n  --max-count <current-max>\n\naz aks update \\\n  --resource-group <resource-group> \\\n  --name <cluster-name> \\\n  --cluster-autoscaler-profile \\\n    scale-down-unneeded-time=5m,scale-down-utilization-threshold=0.6",
        },
        {
          kind: "p",
          text: "For cost, Microsoft advises a shorter unneeded time and delay after add, and a higher threshold. It warns against aggressive scale-down in clusters that scale out and in at short intervals, because node provisioning can then take longer.",
        },
        {
          kind: "p",
          text: [
            "Setting ",
            { code: '--cluster-autoscaler-profile ""' },
            " restores the defaults. Don’t change an autoscaled pool’s node count by hand, and don’t turn on Virtual Machine Scale Set autoscaling beside the cluster autoscaler.",
          ],
        },
        {
          kind: "h3",
          id: "eks-nodes-not-scaling-down-flags-and",
          title: "EKS: flags and group sizes",
        },
        {
          kind: "p",
          text: [
            "On EKS the settings are arguments to the autoscaler’s Deployment, such as ",
            { code: "--scale-down-utilization-threshold=0.6" },
            " or ",
            { code: "--scale-down-unneeded-time=5m" },
            ". The autoscaler respects each Auto Scaling group’s minimum and maximum and only changes its desired size. A smaller minimum (",
            { code: "minSize" },
            " on a managed node group) lets it remove nodes down to the new figure:",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "aws eks update-nodegroup-config \\\n  --cluster-name <cluster-name> \\\n  --nodegroup-name <node-group> \\\n  --scaling-config minSize=<new-min>",
        },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            "Leave ",
            { code: "desiredSize" },
            " out of that command. AWS warns that changing it directly can make the Cluster Autoscaler suddenly scale up or down.",
          ],
        },
        {
          kind: "p",
          text: [
            "Unlike AKS, one EKS group can differ from the rest. Tags on its Auto Scaling group, such as ",
            {
              code: "k8s.io/cluster-autoscaler/node-template/autoscaling-options/scaledownutilizationthreshold",
            },
            " and ",
            { code: ".../scaledownunneededtime" },
            ", override the global flags.",
          ],
        },
        {
          kind: "p",
          text: [
            "The autoscaler’s IAM role needs ",
            { code: "autoscaling:SetDesiredCapacity" },
            " and ",
            { code: "autoscaling:TerminateInstanceInAutoScalingGroup" },
            " on the cluster’s groups. Without them, removal fails, and the error shows in a ScaleDownFailed event.",
          ],
        },
      ],
    },
    {
      id: "raising-the-threshold-helps-less-than-resizing",
      title: "Threshold vs requests",
      blocks: [
        {
          kind: "p",
          text: [
            "A higher threshold makes more nodes candidates, but each of their pods must still fit on the remaining nodes at its full request. ",
            { code: "--ignore-daemonsets-utilization" },
            ", also in the AKS profile, leaves DaemonSet pods out of the sum.",
          ],
        },
        {
          kind: "p",
          text: [
            "The fix that lasts is requests set from measured use. ",
            { a: "Kubernetes overprovisioning", href: "/learn/kubernetes-overprovisioning" },
            " explains how requests grow past use, and ",
            { a: "pod right sizing", href: "/learn/kubernetes-pod-right-sizing" },
            " shows how to measure it.",
          ],
        },
      ],
    },
    {
      id: "how-coral-helps-the-cluster-autoscaler-remove",
      title: "How Coral helps",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " rebalances CPU and memory requests to real use on AKS and EKS, without any downtime. Its node optimization, on from install, empties spare nodes for your Cluster Autoscaler to remove:",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Checks first." },
              " Before draining, Coral simulates the scheduler on the live cluster. Every pod must fit elsewhere with its affinity, taints, spread, ports and zones. Coral respects PDBs, do-not-disrupt and safe-to-evict “false”.",
            ],
            [
              { b: "One node at a time." },
              " Coral moves each pod by warm handover, by live migration where both nodes support it, or by eviction. If a drain can’t finish in time, the node goes back into service.",
            ],
            [
              { b: "Your autoscaler deletes." },
              " After “Wait before removing empty nodes”, Coral hands the empty node to your autoscaler, whose own timers decide when it goes.",
            ],
          ],
        },
        {
          kind: "p",
          text: "Coral never adds nodes for demand and never raises a pool’s minimum. By default it may reduce a minimum that alone keeps an emptied node, and disconnecting puts the old minimum back. With only the Cluster Autoscaler, Coral empties nodes but doesn’t change their size.",
        },
        {
          kind: "p",
          text: [
            "In Coral, Node list → “What’s holding them” names each ",
            { a: "held node", href: "/coral-guide#nodes-held" },
            " with its reason and fix. ",
            {
              a: "Coral works with the Cluster Autoscaler",
              href: "/coral-works-with-cluster-autoscaler",
            },
            " covers the setup.",
          ],
        },
        {
          kind: "p",
          text: [
            "On our own AKS development cluster, node optimization removed one 4-CPU worker. That was $147.46 a month of the $213.89 monthly saving in ",
            { a: "How we reduced AKS cluster costs by 58%", href: "/coral-value-lab" },
            ".",
          ],
        },
      ],
    },
  ],
  help: {
    product: "coral",
    text: "Coral rebalances CPU and memory requests on AKS and EKS, works with your HPA, and removes the nodes you don’t need, without any downtime. We estimate 40–50% off AKS and EKS cost, a range rather than a promise. The free assessment works out your own figure.",
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
      publisher: "Kubernetes autoscaler",
      title: "“Cluster Autoscaler on AWS”",
      url: "https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/cloudprovider/aws/README.md",
    },
    {
      publisher: "Kubernetes autoscaler",
      title: "“cluster-autoscaler-autodiscover.yaml” (AWS example manifest)",
      url: "https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/cloudprovider/aws/examples/cluster-autoscaler-autodiscover.yaml",
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
      title: "“Command-line flags (cluster-autoscaler-1.33.0)”",
      url: "https://github.com/kubernetes/autoscaler/blob/cluster-autoscaler-1.33.0/cluster-autoscaler/config/flags/flags.go",
    },
    {
      publisher: "Kubernetes autoscaler",
      title: "“Drainability rule for kube-system pods (cluster-autoscaler-1.33.0)”",
      url: "https://github.com/kubernetes/autoscaler/blob/cluster-autoscaler-1.33.0/cluster-autoscaler/simulator/drainability/rules/system/rule.go",
    },
  ],
  related: [
    {
      title: "Kubernetes autoscaling",
      where: "Learn",
      href: "/learn/kubernetes-autoscaling",
    },
    {
      title: "Karpenter vs Cluster Autoscaler",
      where: "Learn",
      href: "/learn/karpenter-vs-cluster-autoscaler",
    },
    {
      title: "Pod disruption budget best practices",
      where: "Learn",
      href: "/learn/pod-disruption-budget-best-practices",
    },
    {
      title: "Why Coral holds a node",
      where: "Coral product guide",
      href: "/coral-guide#nodes-held",
    },
    {
      title: "How does Coral work with Karpenter or the Cluster Autoscaler?",
      where: "Coral FAQ",
      href: "/coral-faq#how-does-coral-interact-with-cluster",
    },
  ],
  relatedTitle: "More on node scale-down",
};
