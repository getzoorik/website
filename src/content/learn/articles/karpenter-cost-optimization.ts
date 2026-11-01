import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/karpenter-cost-optimization/1";
import { figure as figure2 } from "@/features/learn/figures/karpenter-cost-optimization/2";

export const article: Article = {
  slug: "karpenter-cost-optimization",
  title: "Karpenter cost optimization: the request gap",
  meta: "Karpenter cost optimization starts with pod requests: how Karpenter picks and consolidates nodes, spot and other best practices, and finding the request gap.",
  h1: "Karpenter cost optimization: the requests it can’t fix",
  deck: "Karpenter buys machines for the requests you set. What it does well, the settings that matter, and the gap it leaves.",
  card: "What Karpenter does to reduce node cost, and why over-requested pods still buy machines they don’t use.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes autoscaling",
  published: "2026-11-01",
  updated: "2026-11-01",
  author: "adil",
  cover: "/learn-covers/zoorik-learn-karpenter-cost-optimization-1200x630.webp",
  coverAlt:
    "Karpenter cost optimization: requests as set stand tall, requests near use stand short, with the same use in both",
  short:
    "Karpenter cost optimization comes from two jobs: launching low-priced instance types that fit pending pods, and consolidating nodes into fewer or cheaper ones. Both jobs count pod requests, not use, so much of the remaining saving can sit in requests set above what pods use.",
  sections: [
    {
      id: "karpenter-cost-savings-come-from-two-jobs",
      title: "Karpenter cost savings come from two jobs, both sized by requests",
      blocks: [
        {
          kind: "p",
          text: "Picture a Deployment of 30\u00a0replicas, each requesting 1\u00a0CPU and 2\u00a0GiB of memory. Their containers peak at 0.25\u00a0CPU and 0.8\u00a0GiB.",
        },
        {
          kind: "p",
          text: [
            "Karpenter has to buy room for 30\u00a0CPU, plus ",
            { a: "DaemonSets", href: "/learn/glossary/daemonset" },
            " and node overhead. The pods use 7.5\u00a0CPU at their busiest. Both cost jobs take the 30\u00a0CPU as given.",
          ],
        },
        {
          kind: "h3",
          id: "launching-a-low-cost-type-that-fits",
          title: "Launching: a low-cost type that fits",
        },
        {
          kind: "p",
          text: "The first job is launching. Karpenter watches for pods that the Kubernetes scheduler (kube-scheduler) can’t place. It batches them and bin-packs them “based on CPU, memory, and GPUs required”.",
        },
        {
          kind: "p",
          text: "The packing counts node overhead and the DaemonSets that will run on the new node. Then Karpenter launches a low-cost instance type that fits.",
        },
        {
          kind: "callout",
          label: "For engineers",
          text: "Karpenter’s FAQ defines the most efficient fit as the smallest type that can hold the batch. That type goes to Amazon EC2 Fleet along with 59 larger types, 60 options in all.",
        },
        {
          kind: "p",
          text: "Fleet then applies the price-capacity-optimized allocation strategy, which for on-demand capacity works out the same as choosing the lowest price. For spot, Fleet weighs price against the chance of interruption, so you may not get the strictly cheapest spot type.",
        },
        {
          kind: "h3",
          id: "consolidation-delete-or-replace",
          title: "Consolidation: delete or replace",
        },
        {
          kind: "p",
          text: "Consolidation is the second job. Karpenter’s disruption docs describe two actions:",
        },
        {
          kind: "ul",
          items: [
            "Deletion removes a node when all its pods fit on free capacity elsewhere.",
            "Replacement applies when the pods fit on a mix of free capacity and one new, cheaper node.",
          ],
        },
        {
          kind: "p",
          text: [
            "A NodePool with no disruption settings defaults ",
            { code: "consolidationPolicy" },
            " to ",
            { code: "WhenEmptyOrUnderutilized" },
            " and ",
            { code: "consolidateAfter" },
            " to ",
            { code: "0s" },
            ". So underused nodes are candidates from the start.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Karpenter consolidation", href: "/learn/karpenter-consolidation" },
            " covers the policies, timers and budgets. This article follows the v1.15 docs, the latest on karpenter.sh in October 2026.",
          ],
        },
      ],
    },
    {
      id: "what-does-karpenter-cost-to-run",
      title: "What does Karpenter cost to run?",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Karpenter", href: "/learn/what-is-karpenter" },
            " is an open-source project, so the software has no licence fee. The Karpenter cost that matters is the EC2 instances it launches. Our ",
            { a: "EKS pricing calculator", href: "/eks-and-aks-pricing-calculator" },
            " prices a node pool’s instances at list price.",
          ],
        },
        { kind: "p", text: "Around the instances sit two small items:" },
        {
          kind: "ul",
          items: [
            "The controller, which the Helm chart installs as a Deployment. AWS advises running it on a small node group with at least one worker node, or on EKS Fargate. Never run it on a node that Karpenter manages.",
            [
              "An Amazon SQS queue, if you use spot. Interruption handling reads it, and you name it in the controller’s ",
              { code: "--interruption-queue" },
              " setting.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "A NodePool without ",
            { code: "spec.limits" },
            " keeps adding capacity as pods need it. Only your cloud provider’s quotas cap it. There is no cluster-wide limit, only one per NodePool.",
          ],
        },
        {
          kind: "p",
          text: "AWS recommends setting limits and creating alarms that warn you when your cost passes a threshold.",
        },
      ],
    },
    {
      id: "karpenter-cost-optimization",
      title: "Karpenter best practices for cost: the settings worth checking",
      blocks: [
        {
          kind: "p",
          text: "The cost advice in the EKS Best Practices Guide and Karpenter’s own docs comes down to a few choices. Each one helps Karpenter buy fewer or cheaper machines for the same requests.",
        },
        {
          kind: "h3",
          id: "let-karpenter-choose-from-many-instance-types",
          title: "Let Karpenter choose from many instance types",
        },
        {
          kind: "p",
          text: [
            "By default, Karpenter can use every instance type EC2 offers in your cluster’s region and Availability Zones. AWS advises against narrowing that list too far, especially with ",
            { a: "Spot Instances", href: "/learn/glossary/spot-instance" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "The more instance types Karpenter may use, the better EC2 can keep your spot instances running. To keep out machines you never want, exclude them with ",
            { code: "NotIn" },
            " on ",
            { code: "node.kubernetes.io/instance-type" },
            ". Don’t list only a few types you like.",
          ],
        },
        {
          kind: "h3",
          id: "allow-spot-for-pods-that-can-move",
          title: "Karpenter spot instances: allow spot for pods that can move",
        },
        {
          kind: "p",
          text: [
            "The ",
            { code: "karpenter.sh/capacity-type" },
            " requirement takes three values: ",
            { code: "reserved" },
            ", ",
            { code: "spot" },
            " and ",
            { code: "on-demand" },
            ". When a NodePool allows more than one, Karpenter tries them in that order.",
          ],
        },
        {
          kind: "p",
          text: [
            "It moves down the list whenever the type it wants has no capacity. Here ",
            { code: "reserved" },
            " means EC2 capacity reservations, not ",
            { a: "Reserved Instances", href: "/learn/glossary/reserved-instance" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "If you have bought ",
            { a: "Savings Plans", href: "/learn/glossary/savings-plan" },
            " or Reserved Instances, the scheduling docs suggest a separate NodePool for those instance types. Give it a higher ",
            { code: "weight" },
            " and ",
            { code: "limits" },
            " sized to the commitment, so Karpenter fills it first.",
          ],
        },
        {
          kind: "p",
          text: "With spot, turn on interruption handling. When a spot instance gets its 2-minute notice, Karpenter starts a new node so the pods can move before the instance is reclaimed.",
        },
        {
          kind: "p",
          text: "A general-purpose NodePool along these lines allows both capacity types. It uses the C, M and R instance types of generation 3 or later, which Karpenter’s FAQ recommends for most generic workloads.",
        },
        {
          kind: "p",
          text: [
            "The ",
            { code: "limits" },
            " block caps the pool. Consolidation considers a node once no pod has been added to it or removed from it for one minute:",
          ],
        },
        {
          kind: "code",
          lang: "yaml",
          code: 'apiVersion: karpenter.sh/v1\nkind: NodePool\nmetadata:\n  name: general\nspec:\n  template:\n    spec:\n      nodeClassRef:\n        group: karpenter.k8s.aws\n        kind: EC2NodeClass\n        name: default\n      requirements:\n        - key: karpenter.sh/capacity-type\n          operator: In\n          values: ["spot", "on-demand"]\n        - key: karpenter.k8s.aws/instance-category\n          operator: In\n          values: ["c", "m", "r"]\n        - key: karpenter.k8s.aws/instance-generation\n          operator: Gte\n          values: ["3"]\n  limits:\n    cpu: "1000"\n    memory: 1000Gi\n  disruption:\n    consolidationPolicy: WhenEmptyOrUnderutilized\n    consolidateAfter: 1m',
        },
      ],
    },
    {
      id: "karpenter-spot-to-spot-consolidation-a-feature",
      title: "Karpenter spot-to-spot consolidation: a feature gate and a 15-type floor",
      blocks: [
        {
          kind: "p",
          text: [
            "Out of the box, consolidation can delete spot nodes, but it won’t replace one with a cheaper spot node. That takes the ",
            { code: "SpotToSpotConsolidation" },
            " feature gate. It has been alpha since v0.34 and is still off by default in v1.15.",
          ],
        },
        {
          kind: "p",
          text: [
            "You turn it on in the Karpenter deployment, with the ",
            { code: "FEATURE_GATES" },
            " environment variable or the ",
            { code: "--feature-gates" },
            " argument. For example, pass ",
            { code: "--feature-gates SpotToSpotConsolidation=true" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "Even with the gate on, a one-for-one spot replacement needs at least 15 instance types priced below the current node in the launch. Replacing several spot nodes with one has no such floor.",
        },
        {
          kind: "p",
          text: "The floor exists because the cheapest spot type isn’t always the one launched, given its interruption risk. Consolidating again and again down to the cheapest type could land on one with very high rates of interruption. Karpenter’s docs call that a “race to the bottom”.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: "A spot NodePool narrowed to a handful of instance types can’t meet the floor for single-node swaps. That is another reason to keep the list wide.",
        },
      ],
    },
    {
      id: "pack-pods-the-way-karpenter-does",
      title: "Pack pods the way Karpenter does",
      blocks: [
        {
          kind: "p",
          text: [
            "Karpenter packs pods tightly in its simulation, but kube-scheduler places them. Its default ",
            { code: "LeastAllocated" },
            " scoring spreads pods across nodes.",
          ],
        },
        {
          kind: "p",
          text: [
            "Karpenter’s scheduling docs recommend the ",
            { code: "MostAllocated" },
            " strategy instead. The scheduler’s placement then matches Karpenter’s packing, and more nodes empty out for consolidation to remove. On EKS you set it through advanced control plane configuration, on Kubernetes 1.31 or later.",
          ],
        },
        {
          kind: "p",
          text: [
            "Tighter packing leaves less room for pods to burst above their requests. So a pod can be killed for running out of memory (an ",
            { a: "OOM kill", href: "/learn/oomkilled-exit-code-137" },
            ") or have its ",
            { a: "CPU throttled", href: "/learn/glossary/kubernetes-cpu-throttling" },
            " sooner.",
          ],
        },
        {
          kind: "p",
          text: [
            "More pods are also affected when one node fails. ",
            { a: "Kubernetes bin packing", href: "/learn/kubernetes-bin-packing" },
            " covers both strategies.",
          ],
        },
      ],
    },
    {
      id: "karpenter-buys-what-pods-request-not-what",
      title: "Karpenter buys what pods request, not what they use",
      blocks: [
        {
          kind: "p",
          text: [
            "Every setting above helps Karpenter buy the cheapest machine for a given set of ",
            { a: "requests", href: "/learn/glossary/kubernetes-resource-requests" },
            ". None of them changes the requests.",
          ],
        },
        {
          kind: "p",
          text: [
            "Karpenter’s docs say so directly: “Instance type selection math only uses ",
            { code: "requests" },
            "”.",
          ],
        },
        {
          kind: "p",
          text: "The kube-scheduler works the same way. Its documentation says the scheduler refuses to place a Pod on a node if the capacity check fails. That holds even when “actual memory or CPU resource usage on nodes is very low”.",
        },
        {
          kind: "p",
          text: "AWS names the consequence. Karpenter launches the best-fitting nodes “when its information about your workloads requirements is accurate.”",
        },
        {
          kind: "p",
          text: "DaemonSets multiply the effect. When Karpenter sizes a node, it adds the requests of every DaemonSet that will run there to the pending pods’ requests. So an oversized DaemonSet request is paid for on every node the DaemonSet runs on.",
        },
        {
          kind: "h3",
          id: "the-30-replicas-worked-through",
          title: "The 30\u00a0replicas, worked through",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "For CPU, the opening’s 30\u00a0replicas request 30 × 1 = 30\u00a0CPU and use 30 × 0.25 = 7.5\u00a0CPU at peak. So 30 − 7.5 = 22.5\u00a0CPU, three quarters of it, sits idle.",
        },
        {
          kind: "p",
          text: "For memory, they request 30 × 2 = 60\u00a0GiB and use 30 × 0.8 = 24\u00a0GiB. If the nodes are packed tightly by requests, consolidation finds nothing to remove.",
        },
        {
          kind: "p",
          text: "Now set the requests a little above the peak, say 0.3\u00a0CPU and 1\u00a0GiB. The same replicas then ask for 30 × 0.3 = 9\u00a0CPU and 30 × 1 = 30\u00a0GiB. That is 30 − 9 = 21\u00a0CPU and 60 − 30 = 30\u00a0GiB less.",
        },
        {
          kind: "p",
          text: [
            "The ",
            { a: "headroom", href: "/learn/glossary/kubernetes-headroom" },
            " over the peak is 9 − 7.5 = 1.5\u00a0CPU and 30 − 24 = 6\u00a0GiB. Karpenter’s next launches are sized for that. Nodes that the old requests held become candidates to delete or replace.",
          ],
        },
        { kind: "svg", figure: figure2 },
      ],
    },
    {
      id: "how-to-find-the-request-gap-on",
      title: "How to find the request gap on a Karpenter node",
      blocks: [
        { kind: "p", text: "Three commands show it." },
        { kind: "ol", items: ["List the nodes Karpenter launched for one NodePool."] },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl get nodes -l karpenter.sh/nodepool=<nodepool-name>",
        },
        {
          kind: "ol",
          start: 2,
          items: [
            [
              "Read what a node’s pods request. The ",
              { code: "Allocated resources" },
              " block of ",
              { code: "kubectl describe nodes" },
              " totals the CPU and memory requests and limits of the node’s pods. Each total comes with a percentage.",
            ],
          ],
        },
        { kind: "code", lang: "bash", code: "kubectl describe nodes <node-name>" },
        {
          kind: "ol",
          start: 3,
          items: [
            [
              "Read what the pods use, namespace by namespace. ",
              { code: "kubectl top" },
              " shows figures from the cluster’s metrics pipeline. A new pod’s figures can take a few minutes to appear.",
            ],
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl top pod --namespace=<namespace> --containers",
        },
        {
          kind: "p",
          text: "A node at 90% of its CPU requested, whose pods use a small share of that, is the gap Karpenter can’t see.",
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "Requests below real use let Karpenter put too many pods on one node. The EKS Best Practices Guide says scheduling and consolidation compare requests with allocatable capacity and ignore limits.",
        },
        {
          kind: "p",
          text: "So pods whose memory limit sits above their request can burst together and be OOM-killed. For memory and other non-CPU resources, AWS recommends setting requests equal to limits when you use consolidation. Aim for measured use plus headroom, not small requests everywhere.",
        },
        {
          kind: "p",
          text: [
            "Size from a window that includes your peaks. ",
            { code: "kubectl top" },
            " reports use only at the moment you run it.",
          ],
        },
        {
          kind: "p",
          text: "When a container uses more memory than its request and its node runs short of memory, its pod is likely to be evicted. A container that uses more than its memory limit may be terminated by the kernel in an OOM kill.",
        },
        {
          kind: "p",
          text: [
            { a: "Kubernetes pod right sizing", href: "/learn/kubernetes-pod-right-sizing" },
            " covers choosing requests from usage history, the headroom to leave and how to roll changes out. The ",
            { a: "Kubernetes cost optimization guide", href: "/kubernetes-cost-optimization" },
            " sets out the order: requests, then nodes.",
          ],
        },
      ],
    },
    {
      id: "where-coral-fits-with-karpenter",
      title: "Where Coral fits with Karpenter",
      blocks: [
        {
          kind: "p",
          text: [
            "Karpenter, and node auto provisioning on AKS, choose and remove machines from requests they don’t change. ",
            { a: "Coral", href: "/coral" },
            " optimizes Kubernetes on AKS and EKS, and it rebalances those requests to real use.",
          ],
        },
        {
          kind: "p",
          text: [
            "For a workload with a CPU-utilization ",
            { a: "Horizontal Pod Autoscaler", href: "/learn/glossary/horizontal-pod-autoscaler" },
            " (HPA), Coral picks the CPU request by replaying past load through that HPA’s own settings. Your manifests are never changed.",
          ],
        },
        {
          kind: "p",
          text: [
            "Pod sizing starts only when you switch on “Automatically optimize” for a policy or a workload. Running pods are resized in place on Kubernetes 1.33+ nodes, and on older nodes they restart one at a time within their ",
            { a: "PodDisruptionBudgets", href: "/learn/glossary/pod-disruption-budget" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "The same Karpenter can then run fewer or smaller nodes. A smaller request reduces your cloud cost once the freed capacity lets a node go.",
        },
        {
          kind: "p",
          text: [
            "Coral leaves the pools Karpenter consolidates to Karpenter, and never changes your Karpenter settings. A pod or node marked ",
            { code: 'karpenter.sh/do-not-disrupt: "true"' },
            " stays where it is.",
          ],
        },
        {
          kind: "p",
          text: "Where Karpenter runs, Coral can also rebalance chosen nodes onto cheaper machines. It creates its own fixed-size NodePools, your Karpenter launches the new machines, and the old nodes are drained and removed one by one.",
        },
        {
          kind: "p",
          text: "Coral prices every saving at your cloud’s published list price for the region, with spot nodes at the spot rate and a 730-hour month. Discounts, reservations and savings plans are left out.",
        },
        {
          kind: "p",
          text: [
            "If an EKS cluster has no autoscaler, connecting it to Coral sets up Karpenter, with your approval. ",
            { a: "Coral works with Karpenter", href: "/coral-works-with-karpenter" },
            " sets out who does what. The FAQ covers ",
            {
              a: "whether you need Coral with Karpenter",
              href: "/coral-faq#do-i-need-coral-with-karpenter",
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
      { label: "Kubernetes optimization with Coral", href: "/coral" },
      { label: "Estimate your saving", href: "/assessment?p=coral" },
    ],
  },
  sources: [
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
      title: "“NodePools”",
      url: "https://karpenter.sh/docs/concepts/nodepools/",
    },
    {
      publisher: "Karpenter",
      title: "“Settings”",
      url: "https://karpenter.sh/docs/reference/settings/",
    },
    {
      publisher: "Amazon EKS Best Practices Guide",
      title: "“Karpenter”",
      url: "https://docs.aws.amazon.com/eks/latest/best-practices/karpenter.html",
    },
    {
      publisher: "Amazon EKS User Guide",
      title: "“Advanced Kubernetes control plane configuration”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/control-plane-configuration.html",
    },
    {
      publisher: "Kubernetes",
      title: "“Resource Management for Pods and Containers”",
      url: "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/",
    },
  ],
  related: [
    {
      title: "What is Karpenter? How it picks and removes nodes",
      where: "Learn",
      href: "/learn/what-is-karpenter",
    },
    {
      title: "Karpenter consolidation: policies, budgets and limits",
      where: "Learn",
      href: "/learn/karpenter-consolidation",
    },
    {
      title: "Kubernetes pod right sizing: set requests from real use",
      where: "Learn",
      href: "/learn/kubernetes-pod-right-sizing",
    },
    {
      title: "Kubernetes bin packing: fewer nodes for the same pods",
      where: "Learn",
      href: "/learn/kubernetes-bin-packing",
    },
    {
      title: "How to choose EKS instance types",
      where: "Learn",
      href: "/learn/how-to-choose-eks-instance-types",
    },
  ],
};
