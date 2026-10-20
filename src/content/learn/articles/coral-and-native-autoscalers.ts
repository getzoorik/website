import { learnPath, routes } from "@/config/site";
import type { Article } from "@/content/learn/article";

export const article: Article = {
  slug: "coral-and-native-autoscalers",
  title: "Coral and the native Kubernetes autoscalers",
  meta: "What VPA, HPA, KEDA, Cluster Autoscaler, NAP and Karpenter each do on AKS and EKS, what Coral adds, and how they work together.",
  h1: "Coral and the native Kubernetes autoscalers",
  deck: "What VPA, HPA, KEDA, the Cluster Autoscaler, NAP and Karpenter each do, and what Coral adds.",
  card: "VPA, HPA, KEDA, Cluster Autoscaler, NAP and Karpenter, and what Coral adds.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes autoscaling",
  versus: ["Coral", "Native"],
  published: "2026-10-09",
  updated: "2026-10-09",
  author: "zoorik",
  breakCode: true,
  shareCard: {
    url: "/og/zoorik-learn-coral-and-native-autoscalers-1200x630.png",
    alt: "Zoorik. Coral and the native Kubernetes autoscalers.",
  },
  short:
    "Kubernetes’ own autoscalers each change one thing: the VPA sizes pods, the HPA and KEDA set the pod count, and the Cluster Autoscaler, NAP and Karpenter add and remove nodes. Coral doesn’t replace them. It sizes requests to real use, drains spare nodes for your node autoscaler to remove, and shows what each change saves at list price.",
  sections: [
    {
      id: "what-each-autoscaler-does",
      title: "What each autoscaler does",
      blocks: [
        {
          kind: "table",
          columns: [
            { label: "Autoscaler", width: "28%" },
            { label: "What it changes", width: "34%" },
            { label: "What it decides from", width: "38%" },
          ],
          rows: [
            [
              "Vertical Pod Autoscaler (VPA)",
              "Each pod’s CPU and memory requests",
              "Each container’s usage history",
            ],
            [
              "Horizontal Pod Autoscaler (HPA)",
              "The number of pods",
              "Usage divided by request, or custom and external metrics",
            ],
            [
              "KEDA",
              "The number of pods, down to zero",
              "Event sources such as queues, through an HPA it manages",
            ],
            [
              "Cluster Autoscaler",
              "The number of nodes in node groups of fixed machine types",
              "Pending pods, to add nodes; pod requests against node capacity, to remove them",
            ],
            [
              "Node Auto Provisioning (NAP), on AKS",
              "Nodes and their VM sizes",
              "Pending pods’ requests. It also consolidates nodes, and it is built on Karpenter.",
            ],
            [
              "Karpenter, on EKS",
              "Nodes and their instance types",
              "Pending pods’ requests. It also consolidates nodes.",
            ],
          ],
        },
        {
          kind: "p",
          text: "Every node autoscaler here counts requests, not use. A request set far above real use keeps a node alive.",
        },
      ],
    },
    {
      id: "what-coral-does-with-each",
      title: "What Coral does with each",
      blocks: [
        {
          kind: "table",
          columns: [
            { label: "Autoscaler", width: "24%" },
            { label: "With Coral", width: "76%" },
          ],
          rows: [
            [
              "VPA",
              "Coral does the VPA’s job with its own recommender and webhook, and doesn’t run the VPA. With automation on, it switches an active VPA to Off and restores it when you switch automation off or disconnect. It never fights a VPA.",
            ],
            [
              "HPA",
              "The HPA keeps deciding how many pods run, and Coral decides how big each pod is. For a CPU-based HPA, Coral replays 3\u00a0days of load through the HPA’s settings before it lowers a request. With automation on and the Optimization type “Both”, it creates HPAs for eligible Deployments and Argo Rollouts, and takes over hand-made ones that nothing else manages.",
            ],
            [
              "KEDA",
              "Workload optimization never creates, takes over or edits a KEDA-owned HPA or ScaledObject. KEDA keeps the scaling.",
            ],
            [
              "Cluster Autoscaler",
              "Coral drains spare nodes one at a time, and the Cluster Autoscaler removes them. With only the Cluster Autoscaler, Coral removes nodes but never changes their size.",
            ],
            [
              "NAP",
              "Coral sizes requests so NAP needs fewer or smaller VMs. With NAP, Coral can also move work to smaller or cheaper machines. Pools NAP already consolidates are left to it.",
            ],
            [
              "Karpenter",
              "Coral sizes requests so Karpenter needs fewer or smaller instances. With Karpenter, Coral can also move work to smaller or cheaper machines. Pools Karpenter already consolidates are left to it.",
            ],
            [
              "No autoscaler",
              "Connect sets up NAP on AKS (with Azure CNI) or Karpenter on EKS, with your approval. Until an autoscaler exists, nothing adds nodes.",
            ],
          ],
        },
      ],
    },
    {
      id: "what-coral-adds",
      title: "What Coral adds",
      blocks: [
        {
          kind: "ul",
          items: [
            "Requests sized from measured use, by policy or per workload, without editing manifests or Git.",
            "HPA-aware sizing: a smaller request wins only if its saving beats the cost of unserved load and extra scaling.",
            "Safe node draining: a scheduler check on the live cluster, one node at a time, within PodDisruptionBudgets.",
            "Fast raises after OOM kills, failing probes and CPU pressure.",
            "A cost view at list price: what each node and workload costs, what can be recovered, and a cluster score of 10 × optimal ÷ current cost.",
            "Nodes held, each with its reason and its fix.",
            [
              "It honours the markers you already use: ",
              { code: "karpenter.sh/do-not-disrupt" },
              " and ",
              { code: "cluster-autoscaler.kubernetes.io/safe-to-evict" },
              ".",
            ],
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
          text: "Load rises and the HPA adds pods. While the HPA is scaling up and below its max, Coral holds back its own surge and CPU-pressure raises, and pauses pod replacements until every pod is Ready; an OOM kill still raises memory at once. Pods that don’t fit stay pending, and your node autoscaler adds nodes. Karpenter and NAP can pick bigger machines. Coral keeps no idle spare nodes: the headroom sits inside each pod’s request. When load falls, the HPA removes pods, Coral drains the nodes that empty out, and your autoscaler removes them.",
        },
      ],
    },
    {
      id: "what-coral-doesnt-do",
      title: "What Coral doesn’t do",
      blocks: [
        {
          kind: "ul",
          items: [
            "Create machines for demand, or change your autoscaler’s settings.",
            "Edit your manifests, pod templates or Git sources.",
            "Forecast. Coral reacts to live usage, and its longest look-back is 8\u00a0days. For a known event, set minimums, or pause node optimization and the Evictor.",
            "Read latency or error rates. It reacts to OOM kills, failing probes and CPU pressure.",
            "Lower the CPU or memory limits of regular pods.",
          ],
        },
      ],
    },
  ],
  help: {
    product: "coral",
    text: "Coral sizes requests to real use on AKS and EKS, works with your HPA, and drains spare nodes for your autoscaler to remove. We estimate it takes 40–50% off AKS and EKS cost. It is an estimated range, not a promise. The free assessment works out your own figure.",
    links: [
      { label: "Kubernetes cost optimization with Coral", href: routes.coral },
      { label: "Estimate your saving", href: `${routes.assessment}?p=coral` },
    ],
  },
  /* The article names no titles for its sources, so each prints its address. */
  sources: [
    { url: "https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/" },
    { url: "https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler" },
    { url: "https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md" },
    { url: "https://keda.sh/docs/" },
    { url: "https://karpenter.sh/docs/" },
    { url: "https://learn.microsoft.com/en-us/azure/aks/node-auto-provisioning" },
  ],
  related: [
    {
      title: "VPA vs HPA: rebalance first, then scale out",
      where: "Learn",
      href: learnPath("vpa-vs-hpa"),
    },
    {
      title: "Nodes and spare capacity",
      where: "Coral FAQ",
      href: `${routes.coralFaq}#nodes-and-spare-capacity`,
    },
    {
      title: "Labels and annotations",
      where: "Coral product guide",
      href: `${routes.coralGuide}#labels-and-annotations`,
    },
  ],
};
