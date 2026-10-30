import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/what-is-karpenter/1";

export const article: Article = {
  slug: "what-is-karpenter",
  title: "What is Karpenter? How it picks and removes nodes",
  meta: "What is Karpenter: an open-source Kubernetes node autoscaler. How NodePools shape the nodes it launches, how it removes them, and how it runs on EKS and AKS.",
  h1: "What is Karpenter? How it picks and removes nodes",
  deck: "It launches nodes for pending pods and removes the ones it no longer needs. NodePools, EKS, AKS and its limits.",
  card: "What Karpenter is, how a NodePool shapes the nodes it launches, and how it removes them on EKS and AKS.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes autoscaling",
  published: "2026-11-06",
  updated: "2026-11-06",
  author: "swati",
  short:
    "Karpenter is an open-source node autoscaler for Kubernetes. When pods can’t be scheduled, it reads their requests and constraints, chooses a machine type that fits them, and launches it. When a node is empty or underused, it deletes it or replaces it with a cheaper one. On Amazon EKS you install and run it yourself, EKS Auto Mode builds on it, and on AKS it runs as node auto-provisioning (NAP).",
  sections: [
    {
      id: "what-is-karpenter-in-kubernetes-and-what",
      title: "What is Karpenter in Kubernetes, and what is it used for?",
      blocks: [
        {
          kind: "p",
          text: "A node autoscaler changes how many machines a cluster runs: it adds a node when pods are waiting for room, and it removes a node the pods no longer need. Kubernetes SIG Autoscaling sponsors two of them, the Cluster Autoscaler and Karpenter.",
        },
        {
          kind: "p",
          text: [
            "The Kubernetes docs draw the difference in a sentence each. Cluster Autoscaler, in their words, “adds or removes Nodes to pre-configured Node groups”, so every machine type it can use has to be set up in advance. Karpenter works with individual virtual machines and doesn’t rely on cloud resource groups, so it can pick a different machine type for each node it launches. A ",
            { a: "full comparison of the two", href: "/learn/karpenter-vs-cluster-autoscaler" },
            " covers how each removes nodes.",
          ],
        },
        {
          kind: "p",
          text: "Karpenter isn’t tied to one cloud. The Kubernetes project publishes it as a library that cloud providers build on to make their own node autoscaler. AWS was the first provider, Azure has one too, and in October 2026 the newest release line of the shared project is Karpenter 1.15.",
        },
        { kind: "p", text: "In a Kubernetes cluster, Karpenter is used for three jobs:" },
        {
          kind: "ul",
          items: [
            "Launching nodes for pending pods, with a machine type picked to fit them.",
            "Consolidation: deleting empty nodes, and replacing underused ones with fewer or cheaper machines.",
            "Node lifecycle: replacing nodes that reach a set age or no longer match their configuration, and draining spot nodes before the cloud takes them back.",
          ],
        },
      ],
    },
    {
      id: "how-karpenter-picks-a-node-for-pending",
      title: "How Karpenter picks a node for pending pods",
      blocks: [
        {
          kind: "p",
          text: "The loop starts with pods that are pending because no node has room for them. Karpenter batches those pods and bin-packs them by the CPU, memory and GPUs they request, adding the node’s own overhead and the DaemonSets that will run on the new node. Each new node must also fit the NodePool the pods match, which can restrict zones, instance types, architectures and capacity type.",
        },
        {
          kind: "p",
          text: "On AWS, Karpenter then finds the instance type that packs the batch most efficiently, adds 59 larger types, and passes all 60 to the Amazon EC2 Fleet API. Fleet chooses with its price-capacity-optimized allocation strategy. For on-demand capacity, the Karpenter FAQ says that is effectively the lowest price. For spot, Fleet weighs price against the chance of interruption, so the result may not be the strictly cheapest spot type.",
        },
        {
          kind: "p",
          text: "Karpenter sizes that choice from requests alone. Node autoscalers, says the Kubernetes page on node autoscaling, “don’t directly take into account the real resource usage of the Pods after they start running.” Take ten pods that each request 2\u00a0CPU and use 0.5\u00a0CPU. Karpenter provisions room for 20\u00a0CPU, plus DaemonSet overhead, although the pods use 5.",
        },
        { kind: "diagram", figure: figure1 },
      ],
    },
    {
      id: "the-karpenter-nodepool-and-its-node-class",
      title: "The Karpenter NodePool and its node class",
      blocks: [
        {
          kind: "p",
          text: [
            "A NodePool is the resource you write to tell Karpenter what it may launch. The Karpenter docs say it “sets constraints on the nodes that can be created by Karpenter and the pods that can run on those nodes.” Its requirements use well-known node labels, such as ",
            { code: "kubernetes.io/arch" },
            " (amd64 or arm64) and ",
            { code: "karpenter.sh/capacity-type" },
            " (spot, on-demand or reserved). When a NodePool allows more than one capacity type, Karpenter prefers reserved capacity, then spot, then on-demand.",
          ],
        },
        {
          kind: "p",
          text: [
            "What you leave out matters as much as what you write. If a requirement isn’t set for a well-known label, Karpenter may choose any value the cloud offers, and ",
            { code: "requirements: []" },
            " opens the pool to every instance type your provider supports. ",
            { code: "spec.limits" },
            " caps the total resources, such as CPU and memory, that the pool’s nodes can add up to. A NodePool with no limits has no cap of its own, only your cloud quotas. When several NodePools match a pod, Karpenter uses the one with the highest ",
            { code: "weight" },
            ", though the docs recommend NodePools that don’t overlap.",
          ],
        },
        {
          kind: "code",
          lang: "yaml",
          code: 'apiVersion: karpenter.sh/v1\nkind: NodePool\nmetadata:\n  name: default\nspec:\n  template:\n    spec:\n      requirements:\n        - key: kubernetes.io/arch\n          operator: In\n          values: ["amd64"]\n        - key: karpenter.sh/capacity-type\n          operator: In\n          values: ["on-demand"]\n        - key: karpenter.k8s.aws/instance-category\n          operator: In\n          values: ["c", "m", "r"]\n      nodeClassRef:\n        group: karpenter.k8s.aws\n        kind: EC2NodeClass\n        name: default\n      expireAfter: 720h\n  limits:\n    cpu: "1000"\n    memory: 1000Gi\n  disruption:\n    consolidationPolicy: WhenEmptyOrUnderutilized\n    consolidateAfter: 1m',
        },
        {
          kind: "p",
          text: [
            "The ",
            { code: "nodeClassRef" },
            " points to a node class, which is the cloud provider’s own resource for machine settings. On AWS it’s an EC2NodeClass. On AKS it’s an AKSNodeClass. The NodePool says which machines are allowed, and the node class says how each one is set up.",
          ],
        },
      ],
    },
    {
      id: "how-karpenter-removes-nodes-it-no-longer",
      title: "How Karpenter removes nodes it no longer needs",
      blocks: [
        {
          kind: "p",
          text: "Karpenter’s word for removing nodes is disruption, and consolidation is the method that acts on cost. It deletes empty nodes in parallel. It also tries to delete one node, or two or more at once, launching at most one replacement. A node can be deleted when all its pods fit in free capacity on other nodes, and it can be replaced when they fit in that free capacity plus one cheaper node.",
        },
        {
          kind: "p",
          text: [
            "Three fields in the NodePool’s ",
            { code: "disruption" },
            " block decide how far it goes:",
          ],
        },
        {
          kind: "table",
          columns: [
            { label: "Field", width: "14%" },
            { label: "What it sets", width: "84%" },
            { label: "Default", width: "10%" },
          ],
          rows: [
            [
              [{ code: "consolidationPolicy" }],
              [
                { code: "WhenEmpty" },
                " considers only empty nodes, whose pods all have no disruption cost, such as DaemonSet pods. ",
                { code: "WhenEmptyOrUnderutilized" },
                " also considers underused nodes. ",
                { code: "Balanced" },
                " weighs the share of the NodePool’s cost an action saves against the share of its pod disruption it causes, and acts only when the saving is large enough.",
              ],
              [{ code: "WhenEmptyOrUnderutilized" }],
            ],
            [
              [{ code: "consolidateAfter" }],
              [
                "How long Karpenter waits after a pod is added to or removed from a node before that node becomes a candidate. ",
                { code: "Never" },
                " turns consolidation off for that NodePool.",
              ],
              [{ code: "0s" }],
            ],
            [
              [{ code: "budgets" }],
              "How many of the pool’s nodes may be disrupted at once. Percentages round up.",
              ["One budget of ", { code: "nodes: 10%" }],
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Consolidation reads the same numbers as provisioning. In the Kubernetes docs’ words, it “only considers Pod resource requests and not real resource usage when making decisions.” A node full of pods that request far more than they use looks busy, and Karpenter keeps it. ",
            { a: "Karpenter consolidation", href: "/learn/karpenter-consolidation" },
            " covers the policies and budgets in depth.",
          ],
        },
        {
          kind: "p",
          text: [
            "Expiration and interruption are the automated forceful methods, and they start draining a node as soon as their condition is met. Expiration drains and removes a node once it’s older than the NodePool’s ",
            { code: "expireAfter" },
            ", which defaults to ",
            { code: "720h" },
            ", or 30\u00a0days. Set it to ",
            { code: "Never" },
            " if nodes shouldn’t age out. Interruption handling drains a node ahead of events such as a spot interruption. On AWS, a spot interruption comes with a 2-minute notice, and interruption handling needs an SQS queue and EventBridge rules that send it those events. Drift is graceful. It replaces nodes that no longer match a changed NodePool or node class.",
          ],
        },
        {
          kind: "p",
          text: [
            "To keep a pod where it is, ",
            { a: "annotate it", href: "/learn/safe-to-evict-do-not-disrupt" },
            " with ",
            { code: 'karpenter.sh/do-not-disrupt: "true"' },
            ". Consolidation then leaves that pod’s node alone, and so does drift, unless the node was created with a ",
            { code: "terminationGracePeriod" },
            " from its NodePool. It isn’t a hard guarantee: the docs say the annotation “does not exclude nodes from the forceful disruption methods.”",
          ],
        },
      ],
    },
    {
      id: "karpenter-on-eks-and-nap-on-aks",
      title: "Karpenter on EKS, and NAP on AKS",
      blocks: [
        {
          kind: "h3",
          id: "what-is-karpenter-in-eks-and-aws",
          title: "What is Karpenter in EKS and AWS?",
        },
        {
          kind: "p",
          text: "On a standard Amazon EKS cluster, Karpenter is software you run. AWS describes it as “open-source software which AWS customers are responsible for installing, configuring, and managing in their Kubernetes clusters.” AWS gives technical support when you run it unmodified, at a compatible version, on EKS, but there’s no AWS Service Level Agreement for it. Karpenter publishes the Kubernetes versions each of its releases supports, and AWS asks you to test when you upgrade either Karpenter or the cluster.",
        },
        {
          kind: "p",
          text: "EKS Auto Mode is the managed route. AWS says Auto Mode “builds upon Karpenter”: it creates a node when a pod can’t fit, consolidates workloads and deletes nodes, and AWS runs that scaling for you. Auto Mode ships default NodePools and NodeClasses that you shouldn’t edit, and you add your own beside them. By default it terminates nodes after 336\u00a0hours (14\u00a0days), and no node lives more than 21\u00a0days, a limit you can make shorter.",
        },
        {
          kind: "h3",
          id: "karpenter-on-aks-node-auto-provisioning",
          title: "Karpenter on AKS: node auto-provisioning",
        },
        {
          kind: "p",
          text: [
            "On AKS, Microsoft can run Karpenter for you. Node auto-provisioning (NAP) deploys and manages Karpenter on your cluster, built on the open-source project and the AKS Karpenter provider. You write NodePool and AKSNodeClass resources, and NAP shows the nodes it launches as NodeClaims. NAP comes preconfigured on AKS Automatic clusters, and it doesn’t support Windows node pools or IPv6 clusters. ",
            { a: "How to enable NAP", href: "/learn/aks-node-auto-provisioning" },
            " has a page of its own.",
          ],
        },
      ],
    },
    {
      id: "what-karpenter-doesnt-change-the-requests",
      title: "What Karpenter doesn’t change: the requests",
      blocks: [
        {
          kind: "p",
          text: [
            "Karpenter chooses and removes machines from the requests it’s given, and it never edits them. A container whose request is four times its real use gets four times the room, on whatever machine type Karpenter picks. Consolidation counts requests the same way, so it keeps that room too, and even ",
            { a: "a carefully tuned NodePool", href: "/learn/karpenter-cost-optimization" },
            " pays for every request that’s set too high. Setting requests from measured use is a separate job, covered in ",
            { a: "Kubernetes pod right sizing", href: "/learn/kubernetes-pod-right-sizing" },
            ". The ",
            {
              a: "HPA vs VPA vs Cluster Autoscaler",
              href: "/learn/hpa-vs-vpa-vs-cluster-autoscaler",
            },
            " comparison shows which tool owns which layer: pod count, pod size or node count.",
          ],
        },
      ],
    },
    {
      id: "how-coral-works-with-karpenter",
      title: "How Coral works with Karpenter",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " optimizes Kubernetes on AKS and EKS, and it works on the layer Karpenter leaves alone. It rebalances CPU and memory requests to what containers really use, so the same Karpenter NodePools can run fewer or smaller nodes. Coral never adds nodes for demand, so scaling up stays Karpenter’s job.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Pools Karpenter already consolidates:" },
              " Coral’s consolidation leaves them to Karpenter.",
            ],
            [
              { b: "Protected workloads:" },
              " Coral respects ",
              { code: "karpenter.sh/do-not-disrupt" },
              " on pods and nodes, so a marked pod is never moved and its node stays, and a marked node is kept.",
            ],
            [
              { b: "Cheaper machines:" },
              " with Karpenter, Coral can also move work to smaller or cheaper machines. Its rebalancing creates fixed-size NodePools named zoorik-rb-…, your Karpenter launches the new machines, and the old nodes are drained and removed one by one.",
            ],
            [
              { b: "No node autoscaler yet:" },
              " if an EKS cluster has none, ",
              { a: "connecting it to Coral", href: "/coral/guide#what-connect-asks-to-change" },
              " can install Karpenter, with your approval. Connect lists every cloud change and asks once, and ",
              { code: "--dry-run" },
              " prints every cloud command and every object it would install without changing anything. On a cluster that uses only aws-auth, installing Karpenter switches authentication to API_AND_CONFIG_MAP, and that can’t be undone. On AKS the same step turns on NAP, which needs Azure CNI, not kubenet.",
            ],
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
      publisher: "Karpenter",
      title: "“NodePools”",
      url: "https://karpenter.sh/docs/concepts/nodepools/",
    },
    {
      publisher: "Karpenter",
      title: "“Disruption”",
      url: "https://karpenter.sh/docs/concepts/disruption/",
    },
    { publisher: "Karpenter", title: "“FAQs”", url: "https://karpenter.sh/docs/faq/" },
    {
      publisher: "Kubernetes",
      title: "“Node Autoscaling”",
      url: "https://kubernetes.io/docs/concepts/cluster-administration/node-autoscaling/",
    },
    {
      publisher: "AWS",
      title: "“Scale cluster compute with Karpenter and Cluster Autoscaler”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/autoscaling.html",
    },
    {
      publisher: "AWS",
      title: "“Automate cluster infrastructure with EKS Auto Mode”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/automode.html",
    },
    {
      publisher: "AWS",
      title: "“Create a Node Pool for EKS Auto Mode”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/create-node-pool.html",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Overview of Node Auto-Provisioning (NAP) in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/node-auto-provisioning",
    },
  ],
  related: [
    {
      title: "Karpenter consolidation: policies, budgets and limits",
      where: "Learn",
      href: "/learn/karpenter-consolidation",
    },
    {
      title: "Karpenter cost optimization: the requests it can’t fix",
      where: "Learn",
      href: "/learn/karpenter-cost-optimization",
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
