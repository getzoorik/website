import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/hpa-vs-vpa-vs-cluster-autoscaler/1";
import { figure as figure2 } from "@/features/learn/figures/hpa-vs-vpa-vs-cluster-autoscaler/2";

export const article: Article = {
  slug: "hpa-vs-vpa-vs-cluster-autoscaler",
  title: "HPA vs VPA vs Cluster Autoscaler, plus Karpenter",
  meta: "HPA vs VPA vs Cluster Autoscaler: one sets the pod count, one the pod size, one the node count. Where Karpenter and NAP fit, with their October 2026 status.",
  h1: "HPA vs VPA vs Cluster Autoscaler: what each one scales",
  deck: "Pod count, pod size or node count: what each autoscaler changes, where Karpenter and NAP fit, and how they combine.",
  card: "What the HPA, VPA and Cluster Autoscaler each change, where Karpenter and NAP fit, and how they combine.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes autoscaling",
  versus: ["HPA · VPA", "Cluster Autoscaler"],
  published: "2026-10-24",
  updated: "2026-10-24",
  author: "saurav",
  short:
    "HPA vs VPA vs Cluster Autoscaler comes down to what each one changes. The Horizontal Pod Autoscaler (HPA) sets how many pods run, and the Vertical Pod Autoscaler (VPA) sets how much CPU and memory each pod requests. Nodes are the Cluster Autoscaler’s job: it adds them for pods that can’t be scheduled, and removes underused ones whose pods fit elsewhere. Karpenter, and node auto-provisioning (NAP) on AKS, do that node job with machines chosen to fit the pods.",
  sections: [
    {
      id: "what-each-autoscaler-does",
      title: "HPA vs VPA vs Cluster Autoscaler compared",
      blocks: [
        {
          kind: "p",
          text: "Kubernetes autoscaling works on three layers, and each autoscaler owns one: two act on your workloads, and one on the machines under them.",
        },
        {
          kind: "table",
          columns: [
            { label: "", width: "14%" },
            { label: "HPA", width: "17%" },
            { label: "VPA", width: "22%" },
            { label: "Cluster Autoscaler", width: "24%" },
            { label: "Karpenter and NAP", width: "23%" },
          ],
          rows: [
            [
              "What it changes",
              "The number of pods",
              "Each container’s CPU and memory requests, and by default its limits in proportion",
              "The number of nodes in node groups you set up",
              "Nodes, and the machine type of each one",
            ],
            [
              "What it decides from",
              "A metric against a target. For CPU and memory, usage divided by request",
              "Usage history and out-of-memory events",
              "Pending pods to add nodes, and the requests on each node to remove them",
              "Pending pods’ requests and scheduling constraints",
            ],
            [
              "Comes with Kubernetes",
              "Yes, it’s a core API",
              "No, it’s an add-on you install",
              "No, it’s a standalone program",
              "No. NAP runs Karpenter for you on AKS, and on EKS you install it or use EKS Auto Mode",
            ],
            [
              "Gives capacity back",
              "Scales in to the minimum replica count",
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
          text: "All three layers read the same number: the request. A request is the CPU and memory a container asks the scheduler to reserve for it, and the scheduler places pods by requests, not by use. The HPA works out CPU and memory utilization as usage divided by the request. Node autoscalers count requests, not usage. The Kubernetes docs say consolidation “only considers Pod resource requests and not real resource usage”, and provisioning works the same way.",
        },
        {
          kind: "p",
          text: "So a pod that requests 2\u00a0CPU and uses 0.5\u00a0CPU holds 2\u00a0CPU of a node, whichever node autoscaler you run. The requests decide how many nodes any of them keeps.",
        },
        { kind: "diagram", figure: figure1 },
      ],
    },
    {
      id: "hpa-vs-vpa-pod-count-or-pod",
      title: "HPA vs VPA: pod count or pod size",
      blocks: [
        {
          kind: "p",
          text: [
            "The HPA is built into Kubernetes as an API resource and a controller in the control plane. Every 15\u00a0seconds by default, it compares a metric with your target and sets the replica count of a Deployment, StatefulSet or other scalable workload. Its core rule is ",
            { code: "desiredReplicas = ceil(currentReplicas × currentMetric ÷ targetMetric)" },
            ", so with a 60% CPU target, 3\u00a0pods at 120% become 6. For CPU and memory it reads the resource metrics API, which Metrics Server usually serves, and custom and external metrics work too. DaemonSets are out of its reach, since they can’t be scaled.",
          ],
        },
        {
          kind: "p",
          text: [
            "The VPA isn’t part of core Kubernetes. You install it, and it adds the ",
            { code: "VerticalPodAutoscaler" },
            " custom resource (",
            { code: "autoscaling.k8s.io/v1" },
            "). Its recommender works out target requests from usage history and out-of-memory events, its updater applies them to running pods, and its admission webhook writes them into new pods. By default it also scales each limit in proportion to its request. The update mode decides how far it goes:",
          ],
        },
        {
          kind: "ul",
          items: [
            [{ code: "Off" }, " only recommends."],
            [{ code: "Initial" }, " sets requests when a pod is created and never changes them."],
            [
              { code: "Recreate" },
              " evicts pods whose requests differ enough from the target, and they come back at the new size.",
            ],
            [
              { code: "InPlaceOrRecreate" },
              " resizes running pods ",
              { a: "in place", href: "/learn/in-place-pod-resize" },
              ", and evicts them only when that fails.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "A newer ",
            { code: "InPlace" },
            " mode, which never evicts, arrived as an alpha feature in VPA 1.7.0. It needs Kubernetes 1.33 or later and a feature gate in the VPA. The old ",
            { code: "Auto" },
            " mode is deprecated and now means ",
            { code: "Recreate" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "On the same metric, the two work against each other. The VPA’s own documentation says it shouldn’t be used with the HPA on the same resource metric, CPU or memory. You can pair them when the HPA scales on a custom or external metric, or when the VPA handles memory and the HPA handles CPU. ",
            { a: "VPA vs HPA", href: "/learn/vpa-vs-hpa" },
            " walks through why they feed each other on CPU, and event-driven scaling has its own page in ",
            { a: "KEDA vs HPA vs VPA", href: "/learn/keda-vs-hpa-vs-vpa" },
            ".",
          ],
        },
      ],
    },
    {
      id: "what-does-the-cluster-autoscaler-do",
      title: "What does the Cluster Autoscaler do?",
      blocks: [
        {
          kind: "p",
          text: "In Kubernetes, the Cluster Autoscaler is “a standalone program that adjusts the size of a Kubernetes cluster to meet the current needs”, in the words of its FAQ. SIG Autoscaling, the Kubernetes special interest group for autoscaling, sponsors two node autoscalers, and this is one of them (Karpenter is the other). Its unit is the node group: a set of identical machines you configure in advance, such as an Auto Scaling group on EKS or a node pool on AKS.",
        },
        {
          kind: "p",
          text: [
            "Scale-up starts when pods fail to schedule for lack of resources. Every 10\u00a0seconds (",
            { code: "--scan-interval" },
            ") it looks for unschedulable pods, works out which node group would fit them, and grows that group. It expects a new node to register within 15\u00a0minutes.",
          ],
        },
        { kind: "p", text: "Scale-down needs all three of these to hold:" },
        {
          kind: "ol",
          items: [
            [
              "The pods on the node request less than half of its ",
              { a: "allocatable", href: "/learn/kubernetes-allocatable-vs-capacity" },
              " CPU, and the same goes for memory. DaemonSet and mirror pods count by default, and that 0.5 is the default of ",
              { code: "--scale-down-utilization-threshold" },
              ".",
            ],
            "Every pod on the node, apart from DaemonSet and mirror pods, can be moved to another node.",
            [
              "The node doesn’t carry the ",
              { code: 'cluster-autoscaler.kubernetes.io/scale-down-disabled: "true"' },
              " annotation.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "A node that stays unneeded for 10\u00a0minutes (",
            { code: "--scale-down-unneeded-time" },
            ") is removed. By default, the Cluster Autoscaler removes non-empty nodes one at a time and empty ones in batches of up to 10.",
          ],
        },
        {
          kind: "p",
          text: [
            "Some pods keep a node running even when there’s room for them elsewhere: pods with ",
            {
              a: "a restrictive PodDisruptionBudget",
              href: "/learn/pod-disruption-budget-best-practices",
            },
            ", kube-system pods without one, pods that no controller manages, pods with local storage such as ",
            { code: "emptyDir" },
            " or ",
            { code: "hostPath" },
            ", and pods annotated ",
            { code: 'cluster-autoscaler.kubernetes.io/safe-to-evict: "false"' },
            ". ",
            {
              a: "Cluster Autoscaler not scaling down",
              href: "/learn/cluster-autoscaler-not-scaling-down",
            },
            " goes through each one and its fix.",
          ],
        },
        {
          kind: "p",
          text: "What it doesn’t do is choose machines. The node groups it can grow have to exist first, so a pod too big for every group stays pending.",
        },
      ],
    },
    {
      id: "where-karpenter-and-nap-fit",
      title: "Where Karpenter and NAP fit",
      blocks: [
        {
          kind: "p",
          text: [
            "Karpenter does the Cluster Autoscaler’s job without node groups. It auto-provisions: it reads the pending pods, chooses a node configuration that fits them within the NodePools you define, and launches individual machines. When nodes are no longer needed, it consolidates them, and it can replace a set of nodes with a different one. Its scope is wider too: it can replace nodes that reach a set lifetime. ",
            { a: "What is Karpenter?", href: "/learn/what-is-karpenter" },
            " covers how it picks machines, and ",
            {
              a: "Karpenter vs Cluster Autoscaler",
              href: "/learn/karpenter-vs-cluster-autoscaler",
            },
            " compares the two.",
          ],
        },
        {
          kind: "p",
          text: "HPA vs VPA vs Karpenter follows the same split as before: Karpenter takes the node layer and leaves the pod count and the requests alone.",
        },
        {
          kind: "p",
          text: "How you get Karpenter depends on the cloud. On AKS the managed route is NAP, which deploys, configures and manages Karpenter for you, built on the open-source Karpenter and AKS Karpenter provider projects. On EKS you can run Karpenter yourself or turn on EKS Auto Mode, which builds on it.",
        },
        { kind: "p", text: "Node autoscalers on AKS and EKS, as of October 2026:" },
        {
          kind: "table",
          columns: [
            { label: "Node autoscaler", width: "14%" },
            { label: "Where", width: "14%" },
            { label: "How it adds nodes", width: "30%" },
            { label: "Status, October 2026", width: "42%" },
          ],
          rows: [
            [
              "Cluster Autoscaler",
              "AKS, EKS and many other clouds",
              "Grows a node group you set up: a node pool on AKS, an Auto Scaling group on EKS",
              "Part of the Kubernetes project, sponsored by SIG Autoscaling",
            ],
            [
              "NAP",
              "AKS",
              "Karpenter, run by AKS, through NodePool and AKSNodeClass resources",
              "Generally available since July 2025. Preconfigured in AKS Automatic, turned on by you in AKS Standard. Microsoft’s NAP overview lists Windows node pools as not supported.",
            ],
            [
              "Karpenter",
              "EKS",
              "Launches individual EC2 instances chosen for the pending pods",
              "Open source. You install, configure and run it. AWS supports it when it runs unmodified at a compatible version, and there’s no AWS SLA for it.",
            ],
            [
              "EKS Auto Mode",
              "EKS",
              "Scaling built into EKS, based on Karpenter",
              "An EKS feature that builds on Karpenter. It adds nodes for pods that don’t fit, consolidates workloads and deletes nodes.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            { a: "AKS node auto provisioning (NAP)", href: "/learn/aks-node-auto-provisioning" },
            " has NAP’s requirements and how to turn it on.",
          ],
        },
      ],
    },
    {
      id: "how-they-work-together-in-a-surge",
      title: "How they work together in a surge",
      blocks: [
        {
          kind: "p",
          text: "Load rises and pod utilization climbs past the HPA’s target. The HPA adds pods straight away: there’s no stabilization window on the way up, and by default it can add 4\u00a0pods or double the count every 15\u00a0seconds, whichever is more. Pods that fit on no node go pending. The Cluster Autoscaler sees them within 10\u00a0seconds and grows a node group, or Karpenter launches a machine for them.",
        },
        {
          kind: "p",
          text: "So Cluster Autoscaler vs HPA isn’t a choice between the two. The Cluster Autoscaler FAQ describes this pairing: the HPA creates replicas, and when there isn’t room for them, the Cluster Autoscaler brings up nodes. Karpenter vs HPA works the same way, with Karpenter picking the machine.",
        },
        {
          kind: "p",
          text: "Load falls. The HPA waits out its 300-second scale-down stabilization window, then removes pods. Nodes empty out or drop below the 50% threshold, and after 10\u00a0minutes unneeded the Cluster Autoscaler removes them. Karpenter and NAP consolidate instead.",
        },
        { kind: "diagram", figure: figure2 },
        {
          kind: "p",
          text: "Underneath both loops sits the VPA, or whatever else sets your requests. If a pod’s requests are too low, the Kubernetes docs warn, a new node might not help it run, and if they’re too high, they might keep its node from being consolidated. For DaemonSet pods, the same docs advise against vertical autoscaling when a node autoscaler runs, because the autoscaler has to predict what those pods will look like on a new node.",
        },
        {
          kind: "p",
          text: "The order that works is requests first, then the HPA target, then the node autoscaler. With requests close to real use, a 60% target means 60% of what a pod needs, and the nodes the autoscaler keeps are nodes the pods use.",
        },
      ],
    },
    {
      id: "what-coral-does-with-each",
      title: "What Coral does with each",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " optimizes Kubernetes on AKS and EKS clusters running 1.30 or later. It works on the layer every node autoscaler counts: it rebalances each container’s CPU and memory requests to what it uses, and drains spare nodes one at a time so your node autoscaler can remove them. It never adds nodes for demand. Pod sizing starts when you switch on “Automatically optimize” for a policy or a workload. Node optimization is on from install.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "HPA:" },
              " the HPA keeps deciding how many pods run, and Coral decides how big each pod is. For a CPU-utilization HPA, Coral picks the CPU request by replaying past load through the HPA’s own settings, 3\u00a0days of it on the default policy. While the HPA is scaling and below its max, Coral holds back its own surge and CPU-pressure raises (memory raises after an OOM kill still apply) and pauses pod replacements until every pod is Ready.",
            ],
            [
              { b: "VPA:" },
              " Coral doesn’t run the VPA. With automation on, it switches an active VPA to Off, and restores it when you switch automation off or disconnect.",
            ],
            [
              { b: "KEDA:" },
              " for a ScaledObject with a ",
              { code: "cpu" },
              " trigger, the same replay uses the trigger’s target, the ScaledObject’s minimum and maximum replicas, and the scaling behavior of the HPA that KEDA created. Outside the warm handover in a rebalance, which raises the autoscaler’s minimum and then scales back, Coral never changes that HPA’s minimum or maximum, and never converts it.",
            ],
            [
              { b: "Cluster Autoscaler:" },
              " before draining, Coral simulates the scheduler on the live cluster, so every pod must fit elsewhere. An emptied node waits 5\u00a0minutes by default, then Coral hands it to the Cluster Autoscaler, whose own timers decide when it goes, within its minimums. With only the Cluster Autoscaler, Coral removes nodes but never changes their size.",
            ],
            [
              { b: "Karpenter and NAP:" },
              " pools that Karpenter or NAP already consolidates are left to them. With either in place, Coral can also rebalance work onto smaller or cheaper machines.",
            ],
            [
              { b: "No node autoscaler:" },
              " connect sets up NAP on AKS (it needs Azure CNI) or Karpenter on EKS, with your approval. Until one exists, nothing adds nodes.",
            ],
          ],
        },
        {
          kind: "p",
          text: "Coral keeps no idle spare nodes. The headroom sits inside each pod’s request, and sudden growth is your autoscaler’s job, as in the surge above. Running pods are resized in place on 1.33+ nodes where possible, and otherwise restart one at a time within their PodDisruptionBudgets. Coral doesn’t forecast: its longest look-back is 8\u00a0days, so for a known event you set minimums on critical workloads.",
        },
        {
          kind: "p",
          text: [
            "On our own AKS development cluster, Coral removed one of two 4-CPU workers, then rebalanced the remaining worker onto a cheaper machine of the same size. Eight days after we connected it, the cluster cost $154.76 a month instead of $368.65. The details are in ",
            {
              a: "How we reduced our own cluster’s machine bill by 58%",
              href: "/case-studies/coral-dev-cluster",
            },
            ", and ",
            { a: "Coral’s FAQ", href: "/coral/faq#how-does-coral-interact-with-cluster" },
            " answers how it works with each node autoscaler.",
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
      title: "VPA vs HPA: when to use which, and why to rebalance first",
      where: "Learn",
      href: "/learn/vpa-vs-hpa",
    },
    {
      title: "KEDA vs HPA vs VPA: where event-driven scaling fits",
      where: "Learn",
      href: "/learn/keda-vs-hpa-vs-vpa",
    },
    {
      title: "Karpenter vs Cluster Autoscaler: how each removes nodes",
      where: "Learn",
      href: "/learn/karpenter-vs-cluster-autoscaler",
    },
    {
      title: "AKS node auto provisioning (NAP): what it is, how to enable",
      where: "Learn",
      href: "/learn/aks-node-auto-provisioning",
    },
    {
      title: "Do I need Coral with Karpenter or NAP?",
      where: "Coral FAQ",
      href: "/coral/faq#do-i-need-coral-with-karpenter",
    },
  ],
};
