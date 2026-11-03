import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/what-is-karpenter/1";
import { figure as figure2 } from "@/features/learn/figures/what-is-karpenter/2";
import { figure as figure3 } from "@/features/learn/figures/what-is-karpenter/3";

export const article: Article = {
  slug: "what-is-karpenter",
  title: "What is Karpenter? The Kubernetes node autoscaler",
  meta: "Karpenter is an open-source Kubernetes node autoscaler. How it launches and removes nodes, what a NodePool controls, and how it runs on EKS and AKS.",
  h1: "What is Karpenter in Kubernetes?",
  deck: "Unlike the Cluster Autoscaler, it picks a machine type for each new node instead of growing preset node groups.",
  card: "How Karpenter launches and removes nodes, what a NodePool controls, and how it runs on EKS and AKS.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes autoscaling",
  published: "2026-11-01",
  updated: "2026-11-03",
  author: "swati",
  cover: "/learn-covers/zoorik-learn-what-is-karpenter-1200x630.webp",
  coverAlt: "Karpenter launches a node for pending pods and removes the node once it is empty",
  short:
    "Karpenter is an open-source Kubernetes node autoscaler. It launches nodes sized to the requests of pending pods, and removes empty or underused nodes or replaces them with cheaper ones. On Amazon EKS you install it yourself, or use EKS Auto Mode, which builds on it. On AKS, node auto provisioning (NAP) runs it for you.",
  sections: [
    {
      id: "what-is-karpenter",
      title: "What Karpenter does",
      blocks: [
        {
          kind: "p",
          text: "Say ten pending pods each request 2\u00a0CPU and fit on no node. Karpenter launches a node with room for all 20\u00a0CPU. When the pods finish and the node is empty, it deletes the node.",
        },
        {
          kind: "p",
          text: "Karpenter is one of two node autoscalers sponsored by Kubernetes SIG Autoscaling. The other, the Cluster Autoscaler, resizes node groups set up in advance. Karpenter launches individual virtual machines instead.",
        },
        { kind: "p", text: "It does three jobs:" },
        {
          kind: "ul",
          items: [
            [{ b: "Launching nodes" }, " for pods that no node has room for."],
            [
              { b: "Consolidation:" },
              " deleting empty and underused nodes, or replacing them with cheaper ones.",
            ],
            [
              { b: "Node lifecycle:" },
              " replacing old or changed nodes, and draining spot nodes before the cloud takes them back.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            {
              a: "Karpenter vs Cluster Autoscaler",
              href: "/learn/karpenter-vs-cluster-autoscaler",
            },
            " compares the two. ",
            { a: "Kubernetes autoscaling", href: "/learn/kubernetes-autoscaling" },
            " shows where node autoscalers sit beside the HPA and VPA.",
          ],
        },
      ],
    },
    {
      id: "karpenter-sizes-a-new-node-from-the",
      title: "How it launches nodes",
      blocks: [
        {
          kind: "p",
          text: "Karpenter acts on pods the scheduler can’t place. It sizes a new node from their resource requests alone. Then it adds the requests of the DaemonSets the node will run, and the node’s reserved resources.",
        },
        {
          kind: "p",
          text: [
            "The ",
            { a: "EKS and AKS pricing calculator", href: "/eks-and-aks-pricing-calculator" },
            " shows how much of a node type your pods can use, and what it costs a month.",
          ],
        },
        {
          kind: "p",
          text: "The node must also fit the NodePool the pods match. A NodePool tells Karpenter what it may launch: capacity types, zones, instance types and architectures.",
        },
        {
          kind: "p",
          text: "Real usage plays no part. In the Kubernetes docs’ words, node autoscalers “don’t directly take into account the real resource usage of the Pods after they start running”. The ten pods get room for 20\u00a0CPU however little they use.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "callout",
          label: "For engineers",
          text: "On AWS, Karpenter finds the instance type that packs the pods most efficiently, then adds 59 larger types. It passes all 60 to the Amazon EC2 Fleet API, which picks one with its price-capacity-optimized allocation strategy.",
        },
        {
          kind: "p",
          text: "For on-demand capacity, Fleet in effect picks the cheapest type. For spot, it also weighs the chance of interruption, so its pick may not be the cheapest spot type.",
        },
      ],
    },
    {
      id: "a-karpenter-nodepool-limits-the-nodes-it",
      title: "NodePools and node classes",
      blocks: [
        {
          kind: "p",
          text: [
            "The Karpenter docs say a NodePool “sets constraints on the nodes that can be created by Karpenter”, and on the pods they run. Its requirements use well-known labels, such as ",
            { code: "kubernetes.io/arch" },
            " and ",
            { code: "karpenter.sh/capacity-type" },
            ".",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Open labels." },
              " A well-known label with no requirement can take any value the cloud offers. ",
              { code: "requirements: []" },
              " allows every instance type your provider supports.",
            ],
            [
              { b: "Capacity types." },
              " Where a NodePool allows several, Karpenter prefers reserved capacity, then spot, then on-demand.",
            ],
            [
              { b: "Weight." },
              " When several NodePools match a pod, Karpenter uses the one with the highest ",
              { code: "weight" },
              ". The docs still recommend NodePools that don’t overlap.",
            ],
            [
              { b: "Limits." },
              " ",
              { code: "spec.limits" },
              " caps the total CPU and memory of the pool’s nodes. At the cap, the pool launches no more nodes until some are removed.",
            ],
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "With open requirements and no limits, a NodePool restricts neither the instance types it launches nor their total CPU and memory.",
        },
        {
          kind: "p",
          text: "This example allows on-demand amd64 nodes from the c, m and r instance categories. It caps the pool at 1,000\u00a0CPU and 1000Gi of memory, and expires nodes after 720\u00a0hours.",
        },
        {
          kind: "code",
          lang: "yaml",
          code: 'apiVersion: karpenter.sh/v1\nkind: NodePool\nmetadata:\n  name: default\nspec:\n  template:\n    spec:\n      requirements:\n        - key: kubernetes.io/arch\n          operator: In\n          values: ["amd64"]\n        - key: karpenter.sh/capacity-type\n          operator: In\n          values: ["on-demand"]\n        - key: karpenter.k8s.aws/instance-category\n          operator: In\n          values: ["c", "m", "r"]\n      nodeClassRef:\n        group: karpenter.k8s.aws\n        kind: EC2NodeClass\n        name: default\n      expireAfter: 720h\n  limits:\n    cpu: "1000"\n    memory: 1000Gi\n  disruption:\n    consolidationPolicy: WhenEmptyOrUnderutilized\n    consolidateAfter: 1m',
        },
        {
          kind: "h3",
          id: "karpenter-node-class-ec2nodeclass-on-aws-aksnodeclass",
          title: "EC2NodeClass and AKSNodeClass",
        },
        {
          kind: "p",
          text: [
            "The ",
            { code: "nodeClassRef" },
            " points to a node class: the cloud’s own settings for the machine. On AWS it is an EC2NodeClass, which sets the AMIs, subnets, security groups and node IAM role. On AKS it is an AKSNodeClass, which holds the VM settings.",
          ],
        },
      ],
    },
    {
      id: "karpenter-removes-nodes-whose-pods-fit-elsewhere",
      title: "How it removes nodes",
      blocks: [
        {
          kind: "p",
          text: "Karpenter calls removing nodes disruption. Consolidation is the method that reduces cost. Expiration, interruption and drift replace nodes for other reasons.",
        },
        {
          kind: "h3",
          id: "consolidation-deletes-or-replaces-underused-nodes",
          title: "Consolidation",
        },
        {
          kind: "p",
          text: "Consolidation deletes empty nodes in parallel. It also tries to delete one node, or several at once, launching at most one replacement.",
        },
        {
          kind: "p",
          text: "A node can be deleted when all its pods fit in free capacity on other nodes. It can be replaced when they fit in that free capacity plus one cheaper node.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: ["Three fields in the NodePool’s ", { code: "disruption" }, " block control it:"],
        },
        {
          kind: "table",
          columns: [
            { label: "Field", width: "24%" },
            { label: "What it sets", width: "52%" },
            { label: "Default", width: "24%" },
          ],
          rows: [
            [
              [{ code: "consolidationPolicy" }],
              [
                { code: "WhenEmpty" },
                " considers only empty nodes. ",
                { code: "WhenEmptyOrUnderutilized" },
                " also considers underused ones. ",
                { code: "Balanced" },
                " acts only when the cost an action saves outweighs the pod disruption it causes.",
              ],
              [{ code: "WhenEmptyOrUnderutilized" }],
            ],
            [
              [{ code: "consolidateAfter" }],
              [
                "How long Karpenter waits after a pod is added to or removed from a node before it may consolidate that node. ",
                { code: "Never" },
                " turns consolidation off.",
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
            "Consolidation counts requests too. The Kubernetes docs say it “only considers Pod resource requests and not real resource usage when making decisions”. A node of pods that request far more than they use looks busy, so it stays. ",
            { a: "Karpenter consolidation", href: "/learn/karpenter-consolidation" },
            " covers each policy and budget in depth.",
          ],
        },
        {
          kind: "h3",
          id: "expiration-interruption-and-drift-replace-nodes",
          title: "Expiration, interruption and drift",
        },
        {
          kind: "p",
          text: "Expiration and interruption are forceful: they start draining a node as soon as their condition is met. Drift is graceful, like consolidation, and budgets can pace it.",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Expiration" },
              " drains and removes a node older than the NodePool’s ",
              { code: "expireAfter" },
              ". The default is ",
              { code: "720h" },
              ", 30\u00a0days, and ",
              { code: "Never" },
              " turns it off.",
            ],
            [
              { b: "Interruption" },
              " drains a node ahead of events such as a spot interruption. On AWS, a spot interruption comes with a 2-minute notice, and handling it needs an SQS queue fed by EventBridge rules.",
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
            "On a pod, the ",
            { a: "do-not-disrupt annotation", href: "/learn/safe-to-evict-do-not-disrupt" },
            ", ",
            { code: 'karpenter.sh/do-not-disrupt: "true"' },
            ", keeps consolidation off its node. It blocks drift too, unless the node was created with a ",
            { code: "terminationGracePeriod" },
            " from its NodePool. It doesn’t stop expiration or interruption: the docs say it “does not exclude nodes from the forceful disruption methods”.",
          ],
        },
      ],
    },
    {
      id: "who-runs-karpenter-on-eks-and-aks",
      title: "Karpenter on EKS and AKS",
      blocks: [
        {
          kind: "p",
          text: "Karpenter isn’t tied to one cloud. The Kubernetes project publishes it as a library for cloud providers to build a node autoscaler on. AWS was the first, and Azure has one too.",
        },
        {
          kind: "h3",
          id: "what-is-karpenter-in-eks-and-aws",
          title: "Karpenter on AWS",
        },
        {
          kind: "p",
          text: "On a standard Amazon EKS cluster, Karpenter is software you run. AWS calls it “open-source software which AWS customers are responsible for installing, configuring, and managing in their Kubernetes clusters”.",
        },
        {
          kind: "p",
          text: "AWS gives technical support when Karpenter runs unmodified, at a compatible version, on EKS. No AWS Service Level Agreement covers it. Karpenter lists the Kubernetes versions each release supports, and AWS expects you to test each upgrade of Karpenter or the cluster.",
        },
        {
          kind: "p",
          text: [
            { a: "EKS Auto Mode", href: "/learn/glossary/eks-auto-mode" },
            " is the managed route. AWS says it “builds upon Karpenter”, and AWS runs its scaling, consolidation and node deletion for you.",
          ],
        },
        {
          kind: "p",
          text: "You shouldn’t edit Auto Mode’s default NodePools and NodeClasses, but you can add your own beside them. By default it replaces nodes after 336\u00a0hours (14\u00a0days), and no node lives past 21\u00a0days.",
        },
        {
          kind: "h3",
          id: "install-the-karpenter-helm-chart-on-eks",
          title: "Karpenter Helm chart",
        },
        {
          kind: "p",
          text: "On EKS you install Karpenter with its Helm chart. Before that, Karpenter’s Getting Started guide sets up AWS:",
        },
        {
          kind: "ol",
          items: [
            "Deploy a CloudFormation stack. It creates the node IAM role, the controller policies, and the SQS queue and EventBridge rules for interruptions.",
            "Create the cluster with eksctl, including the controller’s IAM role.",
          ],
        },
        { kind: "p", text: "Then install the chart:" },
        {
          kind: "code",
          lang: "bash",
          code: "helm upgrade --install karpenter oci://public.ecr.aws/karpenter/karpenter --version <version> \\\n  --namespace <namespace> --create-namespace \\\n  --set settings.clusterName=<cluster-name> \\\n  --set settings.interruptionQueue=<queue-name> \\\n  --set controller.resources.requests.cpu=1 \\\n  --set controller.resources.requests.memory=1Gi \\\n  --set controller.resources.limits.cpu=1 \\\n  --set controller.resources.limits.memory=1Gi \\\n  --wait",
        },
        {
          kind: "p",
          text: [
            "Pick a ",
            { code: "<version>" },
            " that supports your cluster’s Kubernetes version. In November 2026 the guide uses 1.15.1 and the ",
            { code: "kube-system" },
            " namespace. ",
            { code: "<queue-name>" },
            " is the SQS queue from the stack.",
          ],
        },
        {
          kind: "h3",
          id: "karpenter-on-aks-node-auto-provisioning",
          title: "Karpenter on AKS: NAP",
        },
        {
          kind: "p",
          text: "On AKS, node auto provisioning (NAP) deploys and manages Karpenter for you. It is built on the open-source project and the AKS Karpenter provider. NAP comes preconfigured on AKS Automatic clusters, and you turn it on for AKS Standard.",
        },
        {
          kind: "p",
          text: [
            "You write NodePool and AKSNodeClass resources, and NAP shows the nodes it launches as NodeClaims. It doesn’t support Windows node pools or IPv6 clusters. ",
            { a: "AKS node auto provisioning", href: "/learn/aks-node-auto-provisioning" },
            " covers how to enable it.",
          ],
        },
      ],
    },
    {
      id: "karpenter-never-changes-the-requests-it-sizes",
      title: "Oversized requests",
      blocks: [
        {
          kind: "p",
          text: "Karpenter sizes and removes nodes from the requests it’s given, and never changes them. A container that requests four times what it uses gets four times the room, on any machine type.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "Say the ten pods each use 0.5\u00a0CPU of their 2\u00a0CPU request. Karpenter provisions 10 × 2 = 20\u00a0CPU, plus overhead. The pods use 10 × 0.5 = 5\u00a0CPU, which leaves 20 − 5 = 15\u00a0CPU reserved and idle: three-quarters of the requests.",
        },
        { kind: "svg", figure: figure3 },
        {
          kind: "p",
          text: [
            "No NodePool setting closes that gap, which is the limit of ",
            { a: "Karpenter cost optimization", href: "/learn/karpenter-cost-optimization" },
            ". Setting requests from measured use is a separate job, covered in ",
            { a: "Kubernetes pod right sizing", href: "/learn/kubernetes-pod-right-sizing" },
            ". The ",
            { a: "Kubernetes cost optimization guide", href: "/kubernetes-cost-optimization" },
            " does requests first, then nodes.",
          ],
        },
      ],
    },
    {
      id: "how-coral-works-with-karpenter",
      title: "Coral and Karpenter",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " works at the layer Karpenter leaves alone. It rebalances CPU and memory requests to real use on AKS and EKS, so the same NodePools can run fewer or smaller nodes.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Scale-up." },
              " Coral never adds nodes for demand, so scaling up stays Karpenter’s job.",
            ],
            [
              { b: "Consolidation." },
              " Coral ",
              {
                a: "leaves the pools Karpenter consolidates",
                href: "/coral-faq#do-i-need-coral-with-karpenter",
              },
              " to Karpenter.",
            ],
            [
              { b: "Marked workloads." },
              " Coral respects ",
              { code: "karpenter.sh/do-not-disrupt" },
              " on pods and nodes. A marked pod is never moved and keeps its node, and a marked node is kept.",
            ],
            [
              { b: "Cheaper machines." },
              " Coral can move work to smaller or cheaper machines. It creates fixed-size NodePools, your Karpenter launches the new machines, and the old nodes are drained and removed one by one.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "On an EKS cluster with no node autoscaler, ",
            { a: "connecting Coral", href: "/coral-guide#what-connect-asks-to-change" },
            " can install Karpenter, with your approval. ",
            { a: "Coral works with Karpenter", href: "/coral-works-with-karpenter" },
            " sets out who does what.",
          ],
        },
      ],
    },
  ],
  help: {
    product: "coral",
    text: "Coral rebalances CPU and memory requests to real use on AKS and EKS, works with your HPA, and removes the nodes you don’t need. We estimate it reduces AKS and EKS cost by 40–50%. It is an estimated range, not a promise. The free assessment works out your own figure.",
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
      title: "“NodeClasses”",
      url: "https://karpenter.sh/docs/concepts/nodeclasses/",
    },
    {
      publisher: "Karpenter",
      title: "“Scheduling”",
      url: "https://karpenter.sh/docs/concepts/scheduling/",
    },
    {
      publisher: "Karpenter",
      title: "“Disruption”",
      url: "https://karpenter.sh/docs/concepts/disruption/",
    },
    { publisher: "Karpenter", title: "“FAQs”", url: "https://karpenter.sh/docs/faq/" },
    {
      publisher: "Karpenter",
      title: "“Getting Started with Karpenter”",
      url: "https://karpenter.sh/docs/getting-started/getting-started-with-karpenter/",
    },
    {
      publisher: "Karpenter",
      title: "“CloudFormation”",
      url: "https://karpenter.sh/docs/reference/cloudformation/",
    },
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
      title: "Karpenter consolidation",
      where: "Learn",
      href: "/learn/karpenter-consolidation",
    },
    {
      title: "Karpenter cost optimization",
      where: "Learn",
      href: "/learn/karpenter-cost-optimization",
    },
    {
      title: "Karpenter vs Cluster Autoscaler",
      where: "Learn",
      href: "/learn/karpenter-vs-cluster-autoscaler",
    },
    {
      title: "KEDA vs Karpenter",
      where: "Learn",
      href: "/learn/keda-vs-karpenter",
    },
    {
      title: "AKS node auto provisioning (NAP)",
      where: "Learn",
      href: "/learn/aks-node-auto-provisioning",
    },
  ],
  relatedTitle: "More on Karpenter",
};
