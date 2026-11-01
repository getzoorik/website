import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/hpa-vs-vpa-vs-cluster-autoscaler/1";
import { figure as figure2 } from "@/features/learn/figures/hpa-vs-vpa-vs-cluster-autoscaler/2";

export const article: Article = {
  slug: "hpa-vs-vpa-vs-cluster-autoscaler",
  title: "Kubernetes autoscaling: HPA and node autoscalers",
  meta: "Kubernetes autoscaling: the HPA sets pod count, the Cluster Autoscaler node count. HPA vs Cluster Autoscaler and Karpenter vs HPA in a surge.",
  h1: "Kubernetes autoscaling: HPA and Cluster Autoscaler",
  deck: "Pod count, pod size or node count: what each autoscaler changes, where Karpenter and NAP fit, and how they combine.",
  card: "What the HPA, VPA and Cluster Autoscaler each change, where Karpenter and NAP fit, and how they combine.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes autoscaling",
  versus: ["HPA · VPA", "Cluster Autoscaler"],
  published: "2026-10-22",
  updated: "2026-11-01",
  author: "saurav",
  cover: "/learn-covers/zoorik-learn-hpa-vs-vpa-vs-cluster-autoscaler-1200x630.webp",
  coverAlt:
    "HPA vs VPA vs Cluster Autoscaler: the HPA adds pods, the VPA makes a pod bigger, the Cluster Autoscaler adds a node",
  short: [
    "Kubernetes autoscaling works on three layers, and each autoscaler changes one: pod count, pod size or node count. The ",
    { a: "Horizontal Pod Autoscaler (HPA)", href: "/learn/glossary/horizontal-pod-autoscaler" },
    " sets how many pods run, the ",
    { a: "Vertical Pod Autoscaler (VPA)", href: "/learn/glossary/vertical-pod-autoscaler" },
    " what each requests, and the Cluster Autoscaler the nodes. Karpenter and AKS node auto provisioning (NAP) do the node job, with machines chosen to fit the pods.",
  ],
  sections: [
    {
      id: "what-each-autoscaler-does",
      title: "Karpenter vs HPA, VPA and Cluster Autoscaler: what each one changes",
      blocks: [
        {
          kind: "p",
          text: "Picture a 3-pod Deployment that an HPA keeps at a 60% CPU target. Traffic doubles. The HPA adds 3\u00a0pods, and if no node has room for their requests, they stay pending until the Cluster Autoscaler adds a node. A VPA beside it should set only memory requests, since the HPA scales on CPU.",
        },
        {
          kind: "p",
          text: "Autoscaling works on three layers: two on your workloads, and one on the machines under them.",
        },
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
              "Pod size: each container’s CPU and memory requests, and by default its limits in proportion",
              "Node count, within node groups you set up",
              "Node count, and each node’s machine type",
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
              "Yes, it’s a core API, with a controller in the control plane",
              "No, it’s an add-on you install",
              "No, it’s a standalone program",
              [
                "No. NAP runs Karpenter for you on AKS, and on EKS you install it or use ",
                { a: "EKS Auto Mode", href: "/learn/glossary/eks-auto-mode" },
              ],
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
          text: "The request links all three layers. It also decides how many nodes you pay for. A request is the CPU and memory a container asks the scheduler to reserve, and the scheduler places pods by requests, not by use. So a pod that requests 2\u00a0CPU and uses 0.5\u00a0CPU holds 2\u00a0CPU of a node, 1.5 of them unused, whichever node autoscaler you run.",
        },
        {
          kind: "p",
          text: "The HPA works out CPU and memory utilization as usage divided by the request. Node autoscalers count requests too: the Kubernetes docs say consolidation, like provisioning, “only considers Pod resource requests and not real resource usage”.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: [
            { a: "HPA vs VPA", href: "/learn/vpa-vs-hpa" },
            " walks through how the two work against each other on CPU, and ",
            { a: "KEDA vs HPA", href: "/learn/keda-vs-hpa-vs-vpa" },
            " covers event-driven scaling. ",
            { a: "KEDA vs Karpenter", href: "/learn/keda-vs-karpenter" },
            " shows how event-driven pod scaling meets node scaling.",
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
          text: "In Kubernetes, the Cluster Autoscaler is “a standalone program that adjusts the size of a Kubernetes cluster to meet the current needs”, in the words of its FAQ. Its unit is the node group, a set of identical machines you configure in advance.",
        },
        {
          kind: "p",
          text: "Scale-up starts when pods fail to schedule for lack of resources: every 10\u00a0seconds by default, the Cluster Autoscaler looks for them, works out which node group would fit them, and grows that group.",
        },
        { kind: "p", text: "Scale-down needs all three to hold:" },
        {
          kind: "ol",
          items: [
            [
              "By default, the pods on the node, DaemonSet and mirror pods included, request less than half of its ",
              { a: "allocatable", href: "/learn/kubernetes-allocatable-vs-capacity" },
              " CPU, and of its memory.",
            ],
            "Every pod on it, apart from DaemonSet and mirror pods, can be moved to another node.",
            [
              "The node doesn’t carry the ",
              { code: 'cluster-autoscaler.kubernetes.io/scale-down-disabled: "true"' },
              " annotation.",
            ],
          ],
        },
        {
          kind: "p",
          text: "A node that meets all three is unneeded, and after 10\u00a0minutes unneeded, the default, it’s removed. Some pods keep a node running even with room for them elsewhere:",
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
            "kube-system pods without one",
            "pods that no controller manages",
            [
              "pods with local storage, such as ",
              { code: "emptyDir" },
              " or ",
              { code: "hostPath" },
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
            " goes through each one and its fix.",
          ],
        },
        {
          kind: "callout",
          label: "For engineers",
          text: [
            "The Cluster Autoscaler expects a new node to register within 15\u00a0minutes, and by default removes non-empty nodes one at a time and empty ones in batches of up to 10. The flags are ",
            { code: "--scan-interval" },
            " (10 s), ",
            { code: "--scale-down-utilization-threshold" },
            " (0.5) and ",
            { code: "--scale-down-unneeded-time" },
            " (10 min).",
          ],
        },
      ],
    },
    {
      id: "karpenter-and-nap-add-nodes-and-pick",
      title: "Karpenter and NAP add nodes and pick the machine type",
      blocks: [
        {
          kind: "p",
          text: "The Cluster Autoscaler only picks among node groups that already exist, so a pod too big for every group stays pending.",
        },
        {
          kind: "p",
          text: [
            "Karpenter does the same job without node groups. It auto-provisions: it reads the pending pods, chooses a node configuration that fits them within the NodePools you define, and launches individual machines. It consolidates nodes that are no longer needed, can swap a set of nodes for a different one, and can replace nodes that reach a set lifetime. So in Karpenter vs HPA, Karpenter takes only the node layer. ",
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
            "On AKS the managed route to Karpenter is ",
            { a: "NAP", href: "/learn/aks-node-auto-provisioning" },
            ", which deploys, configures and manages it for you.",
          ],
        },
        {
          kind: "table",
          columns: [
            { label: "Node autoscaler", width: "14%" },
            { label: "Where", width: "14%" },
            { label: "How it adds nodes", width: "33%" },
            { label: "Status, October 2026", width: "39%" },
          ],
          rows: [
            [
              "Cluster Autoscaler",
              "AKS, EKS and many other clouds",
              "Grows a node group you set up: a node pool on AKS, an Auto Scaling group on EKS",
              "Part of the Kubernetes project. SIG Autoscaling, the Kubernetes special interest group for autoscaling, sponsors it and Karpenter",
            ],
            [
              "NAP",
              "AKS",
              "Karpenter, run by AKS, through NodePool and AKSNodeClass resources, built on the open-source Karpenter and AKS Karpenter provider projects",
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
      ],
    },
    {
      id: "how-they-work-together-in-a-surge",
      title: "How the HPA and the Cluster Autoscaler work together in a surge",
      blocks: [
        {
          kind: "p",
          text: "When load pushes pod utilization past the HPA’s target, the HPA adds pods straight away: there’s no stabilization window on the way up, and by default it can add 4\u00a0pods or double the count every 15\u00a0seconds, whichever is more. Pods that fit on no node go pending. The Cluster Autoscaler sees them within 10\u00a0seconds and grows a node group, or Karpenter launches a machine for them.",
        },
        {
          kind: "p",
          text: "The Cluster Autoscaler FAQ describes this pairing: the HPA creates replicas, and the Cluster Autoscaler brings up nodes when there isn’t room. So Cluster Autoscaler vs HPA isn’t an either-or, and neither is Karpenter vs HPA.",
        },
        {
          kind: "p",
          text: "When load falls, the HPA waits out its 300-second scale-down stabilization window. Then it removes pods. Nodes empty out or drop below the 50% threshold, and after 10\u00a0minutes unneeded the Cluster Autoscaler removes them. Karpenter and NAP consolidate instead.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "In the opening case, doubled traffic puts the 3\u00a0pods at 120% against the 60% target, so the HPA asks for ceil(3 × 120 ÷ 60) = 6. Its default limit allows the larger of 3 + 4 = 7 and 3 × 2 = 6, so all 6 come in one step. On the way down, the HPA’s 300-second (5-minute) window comes first, then a node left under 50% needs 10\u00a0minutes unneeded, so it goes 5 + 10 = 15\u00a0minutes after the load falls, at the earliest.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: "Underneath both loops sit the requests. If they’re too low, the Kubernetes docs warn, a new node might not help a pod run, and if too high, they might keep its node from being consolidated. For DaemonSet pods, the same docs advise against vertical autoscaling when a node autoscaler runs, because the autoscaler has to predict what those pods will look like on a new node.",
        },
        { kind: "p", text: "The order that works:" },
        {
          kind: "ol",
          items: [
            [
              { b: "Set requests near real use." },
              " In ",
              { code: "Off" },
              " mode the VPA only recommends, so you see its recommended requests without any pod changing. If an HPA scales on CPU, let the VPA set memory only.",
            ],
            [{ b: "Then set the HPA target." }, " A 60% target now means 60% of what a pod needs."],
            [
              { b: "Then pick the node autoscaler." },
              " Use the Cluster Autoscaler if your node groups already fit your pods, and use Karpenter, or NAP on AKS, when pods need machines no group has.",
            ],
          ],
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
              " the HPA keeps deciding how many pods run, and Coral how big each pod is. For a CPU-utilization HPA, Coral picks the CPU request by replaying past load through the HPA’s own settings.",
            ],
            [
              { b: "While the HPA is scaling:" },
              " if it’s below its max, Coral holds back the request raises it makes in a usage surge or under CPU pressure (memory raises after an OOM kill still apply) and pauses pod replacements until every pod is Ready.",
            ],
            [
              { b: "VPA:" },
              " Coral doesn’t run the VPA. With automation on, it switches an active VPA to Off, and restores it when you switch automation off or disconnect.",
            ],
            [
              { b: "KEDA:" },
              " for a ScaledObject with a ",
              { code: "cpu" },
              " trigger, the same replay uses the trigger’s target, the ScaledObject’s minimum and maximum replicas, and the scaling behavior of the HPA that KEDA created. Coral never converts that HPA into one it manages, and never changes its maximum. It raises the minimum only in a rebalance’s warm handover, so a new copy is Ready on another node before the old pod goes, then scales back.",
            ],
            [
              { b: "Cluster Autoscaler:" },
              " before draining, Coral simulates the scheduler on the live cluster, so every pod must fit elsewhere. After the delay in the “Wait before removing empty nodes” setting, Coral hands an emptied node to the Cluster Autoscaler, whose own timers decide when it goes, within its minimums. With only the Cluster Autoscaler, Coral removes nodes but never changes their size.",
            ],
            [
              { b: "Karpenter and NAP:" },
              " pools that Karpenter or NAP already consolidates are left to them, and with either in place, Coral can also rebalance work onto smaller or cheaper machines.",
            ],
            [
              { b: "No node autoscaler:" },
              " connect sets up NAP on AKS (it needs Azure CNI), or Karpenter on EKS, with your approval. Until one exists, nothing adds nodes.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Coral keeps no idle spare nodes. The headroom sits inside each pod’s request, and sudden growth is your autoscaler’s job. Running pods are ",
            { a: "resized in place", href: "/learn/in-place-pod-resize" },
            " on 1.33+ nodes where possible, and otherwise restart one at a time within their PodDisruptionBudgets. Coral doesn’t forecast, so for a known event you set minimums on critical workloads.",
          ],
        },
        {
          kind: "p",
          text: "On our own AKS development cluster, Coral removed one of two 4-CPU workers, then rebalanced the remaining worker onto a cheaper machine of the same size. Eight days after we connected it, the cluster’s machines cost $154.76 a month instead of $368.65.",
        },
        {
          kind: "p",
          text: [
            "The details are in ",
            { a: "How we reduced AKS cluster costs by 58%", href: "/coral-value-lab" },
            ", and ",
            { a: "Coral’s FAQ", href: "/coral-faq#how-does-coral-interact-with-cluster" },
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
      title: "VPA vs HPA: when to use which",
      where: "Learn",
      href: "/learn/vpa-vs-hpa",
    },
    {
      title: "KEDA vs HPA: where event-driven scaling fits",
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
      href: "/coral-faq#do-i-need-coral-with-karpenter",
    },
  ],
};
