import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/kubernetes-autoscaling/1";
import { figure as figure2 } from "@/features/learn/figures/kubernetes-autoscaling/2";

export const article: Article = {
  slug: "kubernetes-autoscaling",
  title: "Kubernetes autoscaler: HPA, VPA, Cluster Autoscaler",
  meta: "What each Kubernetes autoscaler changes: the HPA pod count, the VPA pod size, the Cluster Autoscaler and Karpenter node count, and how they combine.",
  h1: "Kubernetes autoscaling",
  deck: "What each autoscaler changes, how they combine in a traffic surge, and where to start.",
  card: "What the HPA, VPA, Cluster Autoscaler and Karpenter each change, and how they work together.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes autoscaling",
  versus: ["HPA · VPA", "Cluster Autoscaler"],
  published: "2026-10-22",
  updated: "2026-11-03",
  author: "saurav",
  cover: "/learn-covers/zoorik-learn-kubernetes-autoscaling-1200x630.webp",
  coverAlt: "The HPA adds pods, the VPA makes a pod bigger, the Cluster Autoscaler adds a node",
  short: [
    "Kubernetes autoscaling works on three layers, each with its own autoscaler. The ",
    { a: "Horizontal Pod Autoscaler (HPA)", href: "/learn/glossary/horizontal-pod-autoscaler" },
    " changes pod count, the ",
    { a: "Vertical Pod Autoscaler (VPA)", href: "/learn/glossary/vertical-pod-autoscaler" },
    " pod size, and the Cluster Autoscaler node count. Karpenter, and node auto provisioning (NAP) on AKS, also change node count and pick machines to fit the pods. The HPA and every node autoscaler work from pod requests, so set requests near real use first.",
  ],
  sections: [
    {
      id: "what-each-autoscaler-does",
      title: "Kubernetes autoscaler types",
      blocks: [
        { kind: "p", text: "Each k8s autoscaler side by side:" },
        {
          kind: "table",
          columns: [
            { label: "", width: "14%" },
            { label: "HPA", width: "18%" },
            { label: "VPA", width: "22%" },
            { label: "Cluster Autoscaler", width: "22%" },
            { label: "Karpenter and NAP", width: "24%" },
          ],
          rows: [
            [
              "What it changes",
              "Pod count",
              "Pod size: CPU and memory requests, and by default limits in proportion",
              "Node count, within node groups you set up",
              "Node count, and each node’s machine type",
            ],
            [
              "What it decides from",
              "A metric against a target. For CPU and memory, usage divided by request",
              "Usage history and out-of-memory events",
              "Pending pods to add nodes, and each node’s requests to remove it",
              "Pending pods’ requests and scheduling constraints",
            ],
            [
              "Comes with Kubernetes",
              "Yes, a core API run by the control plane",
              "No, an add-on you install",
              "No, a standalone program",
              [
                "No. NAP runs Karpenter for you on AKS. On EKS you install it or use ",
                { a: "EKS Auto Mode", href: "/learn/glossary/eks-auto-mode" },
              ],
            ],
            [
              "Gives capacity back",
              "Removes pods, down to its minimum",
              "Makes requests smaller",
              "Removes a node that stays unneeded for 10\u00a0minutes",
              "Consolidates: removes underused nodes, or replaces them with a different set",
            ],
            [
              "What it can’t do",
              "Scale a DaemonSet",
              "Share CPU or memory with an HPA on the same metric",
              "Pick a machine type outside its node groups",
              "Change the requests it’s given",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "A ",
            { a: "request", href: "/learn/glossary/kubernetes-resource-requests" },
            " is the CPU and memory a container asks the scheduler to reserve. The scheduler places pods by requests, not by use. So a pod that requests 2\u00a0CPU and uses 0.5\u00a0CPU holds 2\u00a0CPU of a node, 1.5 of them unused.",
          ],
        },
        {
          kind: "p",
          text: "The HPA works out CPU and memory utilization as usage divided by request. Node autoscalers count requests too. The Kubernetes docs say consolidation, like provisioning, “only considers Pod resource requests and not real resource usage”.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: [
            { a: "HPA vs VPA", href: "/learn/vpa-vs-hpa" },
            " covers the CPU clash between those two. ",
            { a: "KEDA vs HPA vs VPA", href: "/learn/keda-vs-hpa-vs-vpa" },
            " covers event-driven scaling, and ",
            { a: "KEDA vs Karpenter", href: "/learn/keda-vs-karpenter" },
            " how it meets node scaling.",
          ],
        },
      ],
    },
    {
      id: "what-does-the-cluster-autoscaler-do",
      title: "How the Cluster Autoscaler works",
      blocks: [
        {
          kind: "p",
          text: "The Cluster Autoscaler is “a standalone program that adjusts the size of a Kubernetes cluster to meet the current needs”, in its FAQ’s words. It grows and shrinks node groups: sets of identical machines you set up in advance.",
        },
        {
          kind: "p",
          text: "Scale-up starts when pods can’t be scheduled for lack of resources. Every 10\u00a0seconds by default, the Cluster Autoscaler looks for them, picks a node group that fits them and grows it.",
        },
        { kind: "p", text: "Scale-down needs all three:" },
        {
          kind: "ol",
          items: [
            [
              "By default, the node’s pods, DaemonSet and mirror pods included, request less than half of its ",
              { a: "allocatable", href: "/learn/kubernetes-allocatable-vs-capacity" },
              " CPU and less than half of its memory.",
            ],
            "Every pod on it, apart from DaemonSet and mirror pods, can move to another node.",
            [
              "The node doesn’t carry the ",
              { code: 'cluster-autoscaler.kubernetes.io/scale-down-disabled: "true"' },
              " annotation.",
            ],
          ],
        },
        {
          kind: "p",
          text: "A node that stays unneeded for 10\u00a0minutes, the default, is removed. These pods keep a node even when they’d fit elsewhere:",
        },
        {
          kind: "ul",
          items: [
            [
              "pods with ",
              {
                a: "a restrictive PodDisruptionBudget",
                href: "/learn/pod-disruption-budget-best-practices",
              },
            ],
            "kube-system pods with no PodDisruptionBudget",
            "pods that no controller manages",
            [
              "pods with local storage, such as ",
              { code: "hostPath" },
              " or an ",
              { code: "emptyDir" },
              " on disk",
            ],
            [
              "pods annotated ",
              {
                a: { code: 'cluster-autoscaler.kubernetes.io/safe-to-evict: "false"' },
                href: "/learn/safe-to-evict-do-not-disrupt",
              },
            ],
          ],
        },
        {
          kind: "p",
          text: [
            {
              a: "Cluster Autoscaler not scaling down",
              href: "/learn/cluster-autoscaler-not-scaling-down",
            },
            " covers each one and its fix.",
          ],
        },
        {
          kind: "callout",
          label: "For engineers",
          text: [
            "The defaults: ",
            { code: "--scan-interval" },
            " 10\u00a0s, ",
            { code: "--scale-down-utilization-threshold" },
            " 0.5, ",
            { code: "--scale-down-unneeded-time" },
            " 10\u00a0min, and ",
            { code: "--max-node-provision-time" },
            " 15\u00a0min for a new node to register. Non-empty nodes go one at a time, and empty ones up to 10 at once.",
          ],
        },
        {
          kind: "h3",
          id: "cluster-autoscaler-expanders-which-node-group-grows",
          title: "Cluster Autoscaler expanders",
        },
        {
          kind: "p",
          text: [
            "When more than one node group could fit the pending pods, the expander picks the one that grows. You set it with the ",
            { code: "--expander" },
            " flag. The expanders include:",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { code: "least-waste" },
              ", the default: the group left with the least idle CPU after scale-up",
            ],
            [{ code: "least-nodes" }, ", the group that uses the fewest nodes after scale-up"],
            [{ code: "most-pods" }, ", the group that could schedule the most pods"],
            [{ code: "priority" }, ", the group with the highest priority you assign"],
            [{ code: "random" }, ", for when no node group needs to scale differently"],
          ],
        },
      ],
    },
    {
      id: "karpenter-and-nap-add-nodes-and-pick",
      title: "Karpenter and NAP",
      blocks: [
        {
          kind: "p",
          text: "The Cluster Autoscaler grows only node groups that already exist. A pod too big for every group stays pending.",
        },
        {
          kind: "p",
          text: "Karpenter needs no node groups. It reads the pending pods and launches machines that fit them, within the NodePools you define. It also consolidates underused nodes and replaces nodes that reach a set lifetime.",
        },
        {
          kind: "p",
          text: [
            "Karpenter works only on nodes, so it runs beside the HPA, not instead of it. ",
            { a: "What is Karpenter?", href: "/learn/what-is-karpenter" },
            " and ",
            {
              a: "Karpenter vs Cluster Autoscaler",
              href: "/learn/karpenter-vs-cluster-autoscaler",
            },
            " go deeper.",
          ],
        },
        {
          kind: "p",
          text: [
            "On AKS the managed route is ",
            { a: "NAP", href: "/learn/aks-node-auto-provisioning" },
            ": AKS deploys, configures and manages Karpenter for you.",
          ],
        },
        {
          kind: "table",
          columns: [
            { label: "Node autoscaler", width: "14%" },
            { label: "Where", width: "14%" },
            { label: "How it adds nodes", width: "33%" },
            { label: "Status, November 2026", width: "39%" },
          ],
          rows: [
            [
              "Cluster Autoscaler",
              "AKS, EKS and many other clouds",
              "Grows a node group you set up: a node pool on AKS, an Auto Scaling group on EKS",
              "Part of the Kubernetes project. SIG Autoscaling sponsors it and Karpenter.",
            ],
            [
              "NAP",
              "AKS",
              "Karpenter, run by AKS, through NodePool and AKSNodeClass resources",
              "Generally available since July 2025. Preconfigured in AKS Automatic, and turned on by you in AKS Standard. Windows node pools aren’t supported.",
            ],
            [
              "Karpenter",
              "EKS",
              "Launches individual EC2 instances chosen for the pending pods",
              "Open source. You install, configure and run it. AWS supports it when it runs unmodified at a compatible version, with no AWS SLA.",
            ],
            [
              "EKS Auto Mode",
              "EKS",
              "Built into EKS: creates a node when a pod can’t fit",
              "An EKS feature that builds on Karpenter. It also consolidates workloads and deletes nodes.",
            ],
          ],
        },
      ],
    },
    {
      id: "how-they-work-together-in-a-surge",
      title: "HPA and Cluster Autoscaler together",
      blocks: [
        {
          kind: "p",
          text: "Take a 3-pod Deployment with an HPA at a 60% CPU target, and the Cluster Autoscaler as the node autoscaler. When load rises past the target, the HPA adds pods at once. Scale-up has no stabilization window, and by default the HPA can add 4\u00a0pods or double the count every 15\u00a0seconds, whichever is more.",
        },
        {
          kind: "p",
          text: "Pods that fit on no node stay pending. The Cluster Autoscaler sees them within 10\u00a0seconds and grows a node group. Karpenter would launch a machine for them instead. The Cluster Autoscaler FAQ describes the pairing: the HPA creates replicas, and the Cluster Autoscaler adds nodes when there’s no room.",
        },
        {
          kind: "p",
          text: "When load falls, the HPA waits out its 300-second scale-down stabilization window, then removes pods. After 10\u00a0minutes unneeded, the Cluster Autoscaler removes nodes left under the 50% threshold. Karpenter and NAP consolidate instead.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "Doubled traffic puts the 3\u00a0pods at 120% CPU utilization, against the 60% target. So the HPA asks for ceil(3 × 120 ÷ 60) = 6. Its default limit allows the larger of 3 + 4 and 3 × 2, so all 6 come at once. When load falls, the 5-minute window plus 10\u00a0minutes unneeded means the node goes 15\u00a0minutes later, at the earliest.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: "Requests sit under both loops. If they’re too low, the Kubernetes docs warn, a new node might not help a pod run. If they’re too high, they might keep its node from being consolidated.",
        },
        {
          kind: "p",
          text: "The same docs advise against vertical autoscaling for DaemonSet pods when a node autoscaler runs. The node autoscaler has to predict what those pods will look like on a new node.",
        },
        { kind: "h3", id: "setup-order", title: "Setup order" },
        {
          kind: "ol",
          items: [
            [
              { b: "Set requests near real use." },
              " In ",
              { code: "Off" },
              " mode the VPA only shows its recommendations and changes no pod. Beside an HPA that scales on CPU, let the VPA set memory only.",
            ],
            [{ b: "Then set the HPA target." }, " A 60% target now means 60% of what a pod needs."],
            [
              { b: "Then pick the node autoscaler." },
              " Use the Cluster Autoscaler if your node groups already fit your pods. Use Karpenter, or NAP on AKS, when pods need machines no group has.",
            ],
          ],
        },
      ],
    },
    {
      id: "what-coral-does-with-each",
      title: "Where Coral fits",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " rebalances each container’s CPU and memory requests to real use, and removes the nodes you don’t need, one at a time. It runs on AKS and EKS clusters on Kubernetes 1.30 or later.",
          ],
        },
        {
          kind: "p",
          text: "Node optimization is on from install. Pod sizing starts when you switch on “Automatically optimize” for a policy or a workload.",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "HPA:" },
              " the HPA keeps the pod count, and Coral the pod size. For a CPU-based HPA, Coral picks the CPU request by replaying past load through the HPA’s own settings.",
            ],
            [
              { b: "While the HPA is scaling:" },
              " below its max, Coral holds back its own CPU raises. It also waits for every pod to be Ready before it replaces any. Memory raises after an OOM kill still apply.",
            ],
            [
              { b: "VPA:" },
              " Coral doesn’t run the VPA. With automation on, it switches an active VPA to ",
              { code: "Off" },
              ", and restores it when you switch automation off or disconnect.",
            ],
            [
              { b: "KEDA:" },
              " for a ScaledObject with a ",
              { code: "cpu" },
              " trigger, the replay uses the trigger’s target, the replica bounds and the scaling behavior of KEDA’s HPA. Coral never takes over that HPA or changes its maximum. It raises the ScaledObject’s minimum only for a warm handover in a rebalance, then scales back.",
            ],
            [
              { b: "Cluster Autoscaler:" },
              " before draining, Coral simulates the scheduler on the live cluster, so every pod must fit elsewhere. The Cluster Autoscaler then removes the empty node on its own timers. With only the Cluster Autoscaler, Coral removes nodes but never changes their size.",
            ],
            [
              { b: "Karpenter and NAP:" },
              " pools they already consolidate are left to them. With either in place, Coral can also rebalance work onto smaller or cheaper machines.",
            ],
            [
              { b: "No node autoscaler:" },
              " connect sets up NAP on AKS, which needs Azure CNI, or Karpenter on EKS, with your approval. Until one exists, nothing adds nodes.",
            ],
          ],
        },
        {
          kind: "p",
          text: "Coral never adds nodes for demand and keeps no idle spare nodes. The headroom sits inside each pod’s request, and sudden growth is your autoscaler’s job.",
        },
        {
          kind: "p",
          text: [
            "Running pods are ",
            { a: "resized in place", href: "/learn/in-place-pod-resize" },
            " on 1.33+ nodes where possible. Otherwise they restart one at a time, within their PodDisruptionBudgets. Coral doesn’t forecast, so set minimums on critical workloads before a known event.",
          ],
        },
        {
          kind: "p",
          text: "On our own AKS development cluster, Coral removed one of two 4-CPU workers, then rebalanced the other onto a cheaper machine of the same size. Eight days in, the cluster’s machines cost $154.76 a month instead of $368.65.",
        },
        {
          kind: "p",
          text: [
            "The ",
            { a: "case study", href: "/coral-value-lab" },
            " has the details, and ",
            { a: "Coral’s FAQ", href: "/coral-faq#how-does-coral-interact-with-cluster" },
            " covers each node autoscaler.",
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
      publisher: "Kubernetes",
      title: "“Horizontal Pod Autoscaling”",
      url: "https://kubernetes.io/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/",
    },
    {
      publisher: "Kubernetes",
      title: "“Vertical Pod Autoscaling”",
      url: "https://kubernetes.io/docs/concepts/workloads/autoscaling/vertical-pod-autoscale/",
    },
    {
      publisher: "Vertical Pod Autoscaler",
      title: "“Known limitations”",
      url: "https://github.com/kubernetes/autoscaler/blob/master/vertical-pod-autoscaler/docs/known-limitations.md",
    },
    {
      publisher: "Kubernetes",
      title: "“Node Autoscaling”",
      url: "https://kubernetes.io/docs/concepts/cluster-administration/node-autoscaling/",
    },
    {
      publisher: "Kubernetes autoscaler",
      title: "“Cluster Autoscaler FAQ”",
      url: "https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Overview of node auto-provisioning (NAP) in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/node-auto-provisioning",
    },
    {
      publisher: "Azure Updates",
      title: "“Generally Available: Node auto-provisioning support in AKS”",
      url: "https://azure.microsoft.com/en-us/updates?id=498247",
    },
    {
      publisher: "Amazon EKS",
      title: "“Scale cluster compute with Karpenter and Cluster Autoscaler”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/autoscaling.html",
    },
  ],
  related: [
    {
      title: "HPA vs VPA in Kubernetes",
      where: "Learn",
      href: "/learn/vpa-vs-hpa",
    },
    {
      title: "KEDA vs HPA vs VPA",
      where: "Learn",
      href: "/learn/keda-vs-hpa-vs-vpa",
    },
    {
      title: "Karpenter vs Cluster Autoscaler",
      where: "Learn",
      href: "/learn/karpenter-vs-cluster-autoscaler",
    },
    {
      title: "AKS node auto provisioning (NAP)",
      where: "Learn",
      href: "/learn/aks-node-auto-provisioning",
    },
    {
      title: "Do I need Coral with Karpenter or NAP?",
      where: "Coral FAQ",
      href: "/coral-faq#do-i-need-coral-with-karpenter",
    },
  ],
  relatedTitle: "More on pod and node autoscalers",
};
