import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/what-is-karpenter/1";
import { figure as figure2 } from "@/features/learn/figures/what-is-karpenter/2";
import { figure as figure3 } from "@/features/learn/figures/what-is-karpenter/3";

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
  published: "2026-11-01",
  updated: "2026-11-01",
  author: "swati",
  cover: "/learn-covers/zoorik-learn-what-is-karpenter-1200x630.webp",
  coverAlt:
    "What is Karpenter? It launches a node for pending pods and removes the node once it is empty",
  short:
    "Karpenter is an open-source Kubernetes node autoscaler that launches nodes sized to pending pods and removes underused ones or replaces them with cheaper machines. On Amazon EKS you run it yourself, EKS Auto Mode builds on it, and on AKS it runs as node auto-provisioning (NAP).",
  sections: [
    {
      id: "what-is-karpenter",
      title: "What is Karpenter in Kubernetes, and what is it used for?",
      blocks: [
        {
          kind: "p",
          text: "Picture ten pods that each request 2\u00a0CPU. They’re pending, because no node in the cluster can fit them. Karpenter adds up their requests, 20\u00a0CPU in all, and allows for node overhead and DaemonSets.",
        },
        {
          kind: "p",
          text: "It then picks a machine type with room for all of it and launches a node. When the pods finish and leave the node empty, Karpenter deletes it.",
        },
        {
          kind: "p",
          text: "That’s the job of a node autoscaler: it changes how many machines a cluster runs. It adds a node when pods are waiting for room, and removes one the pods no longer need. Kubernetes SIG Autoscaling sponsors two of them: the Cluster Autoscaler and Karpenter.",
        },
        {
          kind: "p",
          text: "The Kubernetes docs draw the difference in a sentence each. Cluster Autoscaler, they say, “adds or removes Nodes to pre-configured Node groups”. So every machine type it can use has to be set up in advance.",
        },
        {
          kind: "p",
          text: [
            "Karpenter works with individual virtual machines and doesn’t rely on cloud resource groups. That lets it pick a different machine type for each node it launches. For how each one removes nodes, see ",
            {
              a: "Karpenter vs Cluster Autoscaler",
              href: "/learn/karpenter-vs-cluster-autoscaler",
            },
            ".",
          ],
        },
        { kind: "p", text: "Karpenter is used for three jobs:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Launching nodes" },
              " for pending pods, with a machine type picked to fit them.",
            ],
            [
              { b: "Consolidation," },
              " which deletes empty nodes and replaces underused ones with fewer or cheaper machines.",
            ],
            [
              { b: "Node lifecycle," },
              " which replaces nodes that reach a set age or no longer match their configuration. It also drains spot nodes before the cloud takes them back.",
            ],
          ],
        },
      ],
    },
    {
      id: "karpenter-sizes-a-new-node-from-the",
      title: "Karpenter sizes a new node from the pending pods’ requests",
      blocks: [
        {
          kind: "p",
          text: "The loop starts with pending pods that no node has room for. Karpenter batches those pods and bin-packs them by the CPU, memory and GPUs they request.",
        },
        {
          kind: "p",
          text: [
            "On top of those requests, it adds the node’s own overhead and the DaemonSets that will run on the new node. The ",
            { a: "EKS and AKS pricing calculator", href: "/eks-and-aks-pricing-calculator" },
            " shows how much of a node type your pods can use, and what it costs a month.",
          ],
        },
        {
          kind: "p",
          text: "Each new node must also fit the NodePool the pods match. A NodePool is the resource you write to tell Karpenter what it may launch. It can restrict capacity type, zones, instance types and architectures.",
        },
        {
          kind: "p",
          text: "Karpenter does all of this from requests alone. The Kubernetes docs say node autoscalers “don’t directly take into account the real resource usage of the Pods after they start running”. So the ten pods from the opening get room for 20\u00a0CPU, plus overhead, however little of it they use.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "callout",
          label: "For engineers",
          text: "On AWS, Karpenter finds the instance type that packs the batch most efficiently and adds 59 larger types. It passes all 60 to the Amazon EC2 Fleet API, which chooses with its price-capacity-optimized allocation strategy.",
        },
        {
          kind: "p",
          text: "For on-demand capacity, the Karpenter FAQ says Fleet effectively picks the lowest-priced type. For spot, Fleet weighs price against the chance of interruption, so the result may not be the strictly cheapest spot type.",
        },
      ],
    },
    {
      id: "a-karpenter-nodepool-limits-the-nodes-it",
      title: "A Karpenter NodePool limits the nodes it launches, and a node class sets them up",
      blocks: [
        {
          kind: "p",
          text: "The Karpenter docs say a NodePool “sets constraints on the nodes that can be created by Karpenter”. It also sets constraints on the pods that can run on those nodes.",
        },
        {
          kind: "p",
          text: [
            "Its requirements use well-known node labels, such as ",
            { code: "kubernetes.io/arch" },
            " (amd64 or arm64) and ",
            { code: "karpenter.sh/capacity-type" },
            " (spot, on-demand or reserved). When a NodePool allows more than one capacity type, Karpenter prefers reserved capacity, then spot, then on-demand.",
          ],
        },
        {
          kind: "p",
          text: "What you leave out matters as much as what you write. If a requirement isn’t set for a well-known label, Karpenter may choose any value the cloud offers.",
        },
        {
          kind: "p",
          text: [
            "So ",
            { code: "requirements: []" },
            " opens the pool to every instance type your provider supports.",
          ],
        },
        {
          kind: "p",
          text: [
            "When several NodePools match a pod, Karpenter uses the one with the highest ",
            { code: "weight" },
            ". The docs still recommend NodePools that don’t overlap.",
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "A NodePool with no limits has no cap of its own, only your cloud quotas. Leave its requirements open too, and pending pods can get any instance type your provider supports, as many as those quotas allow.",
        },
        {
          kind: "p",
          text: [
            "The ",
            { code: "spec.limits" },
            " field caps the total resources, such as CPU and memory, that the pool’s nodes can add up to. The example below sets 1,000\u00a0CPU and 1000Gi of memory.",
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
            " points to a node class, the cloud provider’s own resource for machine settings. That’s an EC2NodeClass on AWS and an AKSNodeClass on AKS. A NodePool says which machines are allowed, and its node class says how each one is set up.",
          ],
        },
      ],
    },
    {
      id: "karpenter-removes-nodes-whose-pods-fit-elsewhere",
      title: "Karpenter removes nodes whose pods fit elsewhere, and replaces old ones",
      blocks: [
        {
          kind: "p",
          text: "Karpenter’s word for removing nodes is disruption, and consolidation is the method that reduces cost.",
        },
        {
          kind: "h3",
          id: "consolidation-deletes-or-replaces-underused-nodes",
          title: "Consolidation deletes or replaces underused nodes",
        },
        {
          kind: "p",
          text: "Consolidation deletes empty nodes in parallel. It also tries to delete one node, or two or more at once, launching at most one replacement.",
        },
        {
          kind: "p",
          text: "A node can be deleted when all its pods fit in free capacity on other nodes. It can be replaced when they fit in that free capacity plus one cheaper node.",
        },
        { kind: "svg", figure: figure2 },
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
                " weighs the share of the NodePool’s cost an action saves against the share of its pod disruption it causes. It acts only when the saving is large enough.",
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
          text: "Consolidation reads the same numbers as provisioning. In the Kubernetes docs’ words, it “only considers Pod resource requests and not real resource usage when making decisions”.",
        },
        {
          kind: "p",
          text: [
            "A node full of pods that request far more than they use looks busy, so Karpenter keeps it. ",
            { a: "Karpenter consolidation", href: "/learn/karpenter-consolidation" },
            " covers the policies and budgets in depth.",
          ],
        },
        {
          kind: "h3",
          id: "expiration-interruption-and-drift-replace-nodes",
          title: "Expiration, interruption and drift replace nodes",
        },
        {
          kind: "p",
          text: "Karpenter also replaces nodes for age, interruptions and changed settings. Expiration and interruption are the automated forceful methods: they start draining a node as soon as their condition is met. Drift is graceful.",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Expiration" },
              " drains and removes a node once it’s older than the NodePool’s ",
              { code: "expireAfter" },
              ", which defaults to ",
              { code: "720h" },
              ", or 30\u00a0days. Set it to ",
              { code: "Never" },
              " if nodes shouldn’t age out.",
            ],
            [
              { b: "Interruption" },
              " handling drains a node ahead of events such as a spot interruption. On AWS, a spot interruption comes with a 2-minute notice. Interruption handling there needs an SQS queue and EventBridge rules that send it those events.",
            ],
            [
              { b: "Drift" },
              " replaces nodes that no longer match a changed NodePool or node class.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "To keep a pod where it is, add the ",
            { a: "do-not-disrupt annotation", href: "/learn/safe-to-evict-do-not-disrupt" },
            ", ",
            { code: 'karpenter.sh/do-not-disrupt: "true"' },
            ". Consolidation then leaves that pod’s node alone.",
          ],
        },
        {
          kind: "p",
          text: [
            "Drift does too, unless the node was created with a ",
            { code: "terminationGracePeriod" },
            " from its NodePool. Still, the annotation isn’t a hard guarantee. The docs say it “does not exclude nodes from the forceful disruption methods”, so those methods still apply.",
          ],
        },
      ],
    },
    {
      id: "who-runs-karpenter-on-eks-and-aks",
      title: "Who runs Karpenter on EKS and AKS: you, AWS or Microsoft",
      blocks: [
        {
          kind: "p",
          text: "Karpenter isn’t tied to one cloud. The Kubernetes project publishes it as a library that cloud providers build on to make their own node autoscaler.",
        },
        {
          kind: "p",
          text: "AWS was the first provider, and Azure has one too. In October 2026, the newest release line of the shared project is Karpenter 1.15.",
        },
        {
          kind: "h3",
          id: "what-is-karpenter-in-eks-and-aws",
          title: "What is Karpenter in EKS and AWS?",
        },
        {
          kind: "p",
          text: "On a standard Amazon EKS cluster, Karpenter is software you run. AWS describes it as “open-source software which AWS customers are responsible for installing, configuring, and managing in their Kubernetes clusters”.",
        },
        {
          kind: "p",
          text: "AWS gives technical support when you run it unmodified, at a compatible version, on EKS. But there’s no AWS Service Level Agreement for it.",
        },
        {
          kind: "p",
          text: "Karpenter publishes the Kubernetes versions each of its releases supports. AWS asks you to test when you upgrade either Karpenter or the cluster.",
        },
        {
          kind: "p",
          text: "EKS Auto Mode is the managed route. AWS says Auto Mode “builds upon Karpenter”, and AWS runs its scaling for you. It creates a node when a pod can’t fit, consolidates workloads and deletes nodes.",
        },
        {
          kind: "p",
          text: "Auto Mode ships default NodePools and NodeClasses that you shouldn’t edit, and you add your own beside them. By default it terminates nodes after 336\u00a0hours (14\u00a0days). No node lives more than 21\u00a0days, a limit you can make shorter.",
        },
        {
          kind: "h3",
          id: "karpenter-on-aks-node-auto-provisioning",
          title: "Karpenter on AKS: node auto-provisioning",
        },
        {
          kind: "p",
          text: "On AKS, Microsoft can run Karpenter for you. NAP deploys and manages it on your cluster, built on the open-source project and the AKS Karpenter provider.",
        },
        {
          kind: "p",
          text: "You write NodePool and AKSNodeClass resources, and NAP shows the nodes it launches as NodeClaims. NAP comes preconfigured on AKS Automatic clusters.",
        },
        {
          kind: "p",
          text: [
            "It doesn’t support Windows node pools or IPv6 clusters. To turn it on, see ",
            {
              a: "how to enable AKS node auto-provisioning",
              href: "/learn/aks-node-auto-provisioning",
            },
            ".",
          ],
        },
      ],
    },
    {
      id: "karpenter-never-changes-the-requests-it-sizes",
      title: "Karpenter never changes the requests it sizes nodes from",
      blocks: [
        {
          kind: "p",
          text: "Karpenter chooses and removes machines from the requests it’s given, and it never edits them. A container whose request is four times its real use gets four times the room. That holds on whatever machine type Karpenter picks.",
        },
        {
          kind: "p",
          text: [
            "Consolidation counts requests the same way, so it keeps that room too. Even a carefully tuned NodePool pays for every request that’s set too high, which is the limit of ",
            { a: "Karpenter cost optimization", href: "/learn/karpenter-cost-optimization" },
            ".",
          ],
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "Say the ten pods from the opening each use 0.5\u00a0CPU of their 2\u00a0CPU request. Karpenter provisions room for 10 × 2 = 20\u00a0CPU of requests, plus overhead.",
        },
        {
          kind: "p",
          text: "The pods use 10 × 0.5 = 5\u00a0CPU of it. That leaves 20 − 5 = 15\u00a0CPU reserved and idle, three-quarters of the requested CPU. That’s because each request is 2 ÷ 0.5 = 4 times its use.",
        },
        { kind: "svg", figure: figure3 },
        {
          kind: "p",
          text: [
            "Setting requests from measured use is a separate job, covered in ",
            { a: "Kubernetes pod right sizing", href: "/learn/kubernetes-pod-right-sizing" },
            ". The ",
            { a: "Kubernetes cost optimization guide", href: "/kubernetes-cost-optimization" },
            " puts the two jobs in order: requests first, then nodes. ",
            {
              a: "HPA vs VPA vs Cluster Autoscaler",
              href: "/learn/hpa-vs-vpa-vs-cluster-autoscaler",
            },
            " shows which tool owns which layer: pod count, pod size or node count.",
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
            " optimizes Kubernetes on AKS and EKS, and it works on the layer Karpenter leaves alone. It rebalances CPU and memory requests to what containers really use. So the same Karpenter NodePools can run fewer or smaller nodes.",
          ],
        },
        {
          kind: "p",
          text: [
            "Coral never adds nodes for demand, so scaling up stays Karpenter’s job. ",
            { a: "Coral works with Karpenter", href: "/coral-works-with-karpenter" },
            " sets out who does what, job by job.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Pools Karpenter already consolidates:" },
              " Coral’s consolidation ",
              { a: "leaves them to Karpenter", href: "/coral-faq#do-i-need-coral-with-karpenter" },
              ".",
            ],
            [
              { b: "Protected workloads:" },
              " Coral respects ",
              { code: "karpenter.sh/do-not-disrupt" },
              " on pods and nodes. A marked pod is never moved and its node stays, and a marked node is kept.",
            ],
            [
              { b: "Cheaper machines:" },
              " where Karpenter runs, Coral can also move work to smaller or cheaper machines. Its rebalancing creates fixed-size NodePools named zoorik-rb-…, and your Karpenter launches the new machines. The old nodes are then drained and removed one by one.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "If an EKS cluster has no node autoscaler yet, ",
            { a: "connecting it to Coral", href: "/coral-guide#what-connect-asks-to-change" },
            " can install Karpenter, with your approval. Connect lists every cloud change and asks once. Its ",
            { code: "--dry-run" },
            " prints every cloud command and every object it would install without changing anything.",
          ],
        },
        {
          kind: "p",
          text: "Check two things before you approve. On a cluster that uses only aws-auth, installing Karpenter switches authentication to API_AND_CONFIG_MAP, and that can’t be undone. On AKS the same step turns on NAP, which needs Azure CNI, not kubenet.",
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
      title: "How to choose EKS instance types",
      where: "Learn",
      href: "/learn/how-to-choose-eks-instance-types",
    },
  ],
};
