import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/karpenter-cost-optimization/1";
import { figure as figure2 } from "@/features/learn/figures/karpenter-cost-optimization/2";

export const article: Article = {
  slug: "karpenter-cost-optimization",
  title: "Karpenter cost optimization: the request gap",
  meta: "Karpenter cost optimization: the NodePool, spot and scheduler settings worth checking, and how to find pod requests set above real use.",
  h1: "Karpenter cost optimization",
  deck: "Settings that help Karpenter buy cheaper nodes, and the oversized requests it can’t fix.",
  card: "Settings that help Karpenter reduce node cost, and the oversized requests it can’t fix.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes autoscaling",
  published: "2026-11-01",
  updated: "2026-11-03",
  author: "adil",
  cover: "/learn-covers/zoorik-learn-karpenter-cost-optimization-1200x630.webp",
  coverAlt:
    "Karpenter cost optimization: requests as set stand tall, requests near use stand short, with the same use in both",
  short:
    "Karpenter reduces node cost in two ways. It launches a low-priced instance type that fits the pending pods, and consolidation deletes or replaces underused nodes. You help it by allowing many instance types and spot capacity, and by packing pods tightly. Neither job changes pod requests, so requests set above real use still buy capacity your pods don’t use.",
  sections: [
    {
      id: "karpenter-cost-savings-come-from-two-jobs",
      title: "How Karpenter reduces cost",
      blocks: [
        {
          kind: "h3",
          id: "launching-a-low-cost-type-that-fits",
          title: "Launching",
        },
        {
          kind: "p",
          text: "Karpenter watches for pods the Kubernetes scheduler (kube-scheduler) can’t place. It batches them and bin-packs them “based on CPU, memory, and GPUs required”.",
        },
        {
          kind: "p",
          text: [
            "The packing counts node overhead and the ",
            { a: "DaemonSets", href: "/learn/glossary/daemonset" },
            " that will run on the new node. The smallest instance type that holds the batch is the most efficient fit. Karpenter sends it to Amazon EC2 Fleet with 59 larger types, 60 options in all.",
          ],
        },
        {
          kind: "callout",
          label: "For engineers",
          text: "Fleet chooses with the price-capacity-optimized allocation strategy. For on-demand capacity, that works out the same as the lowest price. For spot, it weighs price against the chance of interruption, so you may not get the cheapest spot type.",
        },
        {
          kind: "h3",
          id: "consolidation-delete-or-replace",
          title: "Consolidation",
        },
        { kind: "p", text: "Consolidation takes one of two actions:" },
        {
          kind: "ul",
          items: [
            "Deletion removes a node when all its pods fit on free capacity elsewhere.",
            "Replacement applies when a node’s pods fit on a mix of free capacity and one new, cheaper node.",
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
            ", so underused nodes are candidates at once.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Karpenter consolidation", href: "/learn/karpenter-consolidation" },
            " covers policies, timers and budgets. This article follows the Karpenter v1.15 docs.",
          ],
        },
      ],
    },
    {
      id: "what-does-karpenter-cost-to-run",
      title: "What Karpenter costs",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Karpenter", href: "/learn/what-is-karpenter" },
            " is open source, so there is no licence fee. You pay for the EC2 instances it launches. The ",
            { a: "EKS pricing calculator", href: "/eks-and-aks-pricing-calculator" },
            " prices a node pool’s instances at list price.",
          ],
        },
        { kind: "p", text: "Two small items sit beside the instances:" },
        {
          kind: "ul",
          items: [
            "The controller. AWS advises running it on a small node group with at least one worker node, or on EKS Fargate. Never run it on a node Karpenter manages.",
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
            " keeps adding capacity as pods need it, up to your cloud provider’s quotas. Limits apply per NodePool. There is no cluster-wide limit. AWS recommends setting limits, plus billing alarms that warn you when spend passes a threshold.",
          ],
        },
      ],
    },
    {
      id: "karpenter-cost-optimization",
      title: "Cost settings to check",
      blocks: [
        {
          kind: "p",
          text: "Each setting below helps Karpenter buy fewer or cheaper machines for the same requests.",
        },
        {
          kind: "h3",
          id: "let-karpenter-choose-from-many-instance-types",
          title: "Allow many instance types",
        },
        {
          kind: "p",
          text: [
            "By default, Karpenter may use every instance type EC2 offers in your cluster’s Region and Availability Zones. AWS advises against narrowing that list too far, especially with ",
            { a: "Spot Instances", href: "/learn/glossary/spot-instance" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "The more types Karpenter may use, the better EC2 can keep your spot instances running. To keep out types you never want, exclude them with ",
            { code: "NotIn" },
            " on ",
            { code: "node.kubernetes.io/instance-type" },
            ", rather than listing a few you like.",
          ],
        },
        {
          kind: "h3",
          id: "allow-spot-for-pods-that-can-move",
          title: "Allow spot capacity",
        },
        {
          kind: "p",
          text: [
            "The ",
            { code: "karpenter.sh/capacity-type" },
            " requirement takes ",
            { code: "reserved" },
            ", ",
            { code: "spot" },
            " and ",
            { code: "on-demand" },
            ". When a NodePool allows more than one, Karpenter tries them in that order. It falls back to the next when one has no capacity. Here ",
            { code: "reserved" },
            " means EC2 capacity reservations, not ",
            { a: "Reserved Instances", href: "/learn/glossary/reserved-instance" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "Spot suits pods that can move. Turn on interruption handling. When a spot instance gets its 2-minute notice, Karpenter starts a new node so pods can move before the instance is reclaimed.",
        },
        {
          kind: "h3",
          id: "fill-commitments-first",
          title: "Fill commitments first",
        },
        {
          kind: "p",
          text: [
            "If you have bought ",
            { a: "Savings Plans", href: "/learn/glossary/savings-plan" },
            " or Reserved Instances, give those instance types their own NodePool. Karpenter’s scheduling docs suggest a higher ",
            { code: "weight" },
            " and ",
            { code: "limits" },
            " sized to the commitment, so Karpenter fills it first.",
          ],
        },
        {
          kind: "h3",
          id: "example-nodepool",
          title: "Example NodePool",
        },
        {
          kind: "p",
          text: "This general-purpose NodePool allows spot and on-demand C, M and R instance types of generation 3 or later. Karpenter’s FAQ recommends those for most generic workloads.",
        },
        {
          kind: "p",
          text: [
            "The ",
            { code: "limits" },
            " block caps the pool. With ",
            { code: "consolidateAfter: 1m" },
            ", a node becomes a candidate once no pod has been added or removed for one minute:",
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
      title: "Spot-to-spot consolidation",
      blocks: [
        {
          kind: "p",
          text: [
            "By default, consolidation can delete a spot node but won’t replace it with a cheaper spot node. That needs the ",
            { code: "SpotToSpotConsolidation" },
            " feature gate. It has been alpha since v0.34 and is still off by default in v1.15.",
          ],
        },
        {
          kind: "p",
          text: [
            "Turn it on in the Karpenter deployment, with the ",
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
          text: "Even with the gate on, replacing one spot node with one cheaper spot node needs at least 15 instance types priced below the current node. Replacing several spot nodes with one has no such floor.",
        },
        {
          kind: "p",
          text: "The floor exists because the cheapest spot type isn’t always launched, given its interruption risk. Without it, repeated swaps could end on types with very high interruption rates. Karpenter’s docs call that a “race to the bottom”.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: "A spot NodePool narrowed to a few instance types can’t meet the floor for one-for-one swaps. That is one more reason to keep the list wide.",
        },
      ],
    },
    {
      id: "pack-pods-the-way-karpenter-does",
      title: "Pack pods tightly",
      blocks: [
        {
          kind: "p",
          text: [
            "Karpenter simulates a tight bin-packing of pending pods, but kube-scheduler places them. The scheduler’s default ",
            { code: "LeastAllocated" },
            " scoring spreads pods across nodes.",
          ],
        },
        {
          kind: "p",
          text: [
            "Karpenter’s scheduling docs recommend the ",
            { code: "MostAllocated" },
            " strategy instead. Placement then matches Karpenter’s packing, and lightly used nodes get no new pods, so consolidation can remove them. On EKS, you set it through advanced control plane configuration, on Kubernetes 1.31 or later.",
          ],
        },
        {
          kind: "p",
          text: [
            "The trade-offs: more pods are affected when one node fails, and new pods can wait in Pending while capacity is added. ",
            { a: "Kubernetes bin packing", href: "/learn/kubernetes-bin-packing" },
            " compares both strategies.",
          ],
        },
      ],
    },
    {
      id: "karpenter-buys-what-pods-request-not-what",
      title: "The request gap",
      blocks: [
        {
          kind: "p",
          text: [
            "None of these settings changes pod ",
            { a: "requests", href: "/learn/glossary/kubernetes-resource-requests" },
            ". Karpenter’s docs say so: “Instance type selection math only uses ",
            { code: "requests" },
            "”.",
          ],
        },
        {
          kind: "p",
          text: "The kube-scheduler works the same way. It refuses a node where a pod’s requests don’t fit, even when “actual memory or CPU resource usage on nodes is very low”. So the EKS Best Practices Guide asks for accurate requests on every workload, especially when you use consolidation.",
        },
        {
          kind: "p",
          text: "DaemonSets multiply the gap. When Karpenter sizes a node, it adds the requests of every DaemonSet that will run there. An oversized DaemonSet request is paid for on every node it runs on.",
        },
        {
          kind: "h3",
          id: "the-30-replicas-worked-through",
          title: "Example: 30 replicas",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "A Deployment runs 30 replicas, each requesting 1 CPU and 2 GiB of memory. At peak, each uses 0.25 CPU and 0.8 GiB. Together they request 30 CPU but use 7.5 CPU, so 22.5 CPU, three quarters, sits idle.",
        },
        {
          kind: "p",
          text: "For memory, they request 60 GiB and use 24 GiB. Karpenter buys room for all of it, plus DaemonSets and node overhead. If the nodes are packed tightly by requests, consolidation finds nothing to remove.",
        },
        {
          kind: "p",
          text: "Now set the requests a little above the peak, say 0.3 CPU and 1 GiB. The replicas then request 9 CPU and 30 GiB: 21 CPU and 30 GiB less.",
        },
        {
          kind: "p",
          text: [
            "That leaves 1.5 CPU and 6 GiB of ",
            { a: "headroom", href: "/learn/glossary/kubernetes-headroom" },
            " over the peak. Karpenter sizes its next launches for the new requests. Nodes the old requests held become candidates to delete or replace.",
          ],
        },
        { kind: "svg", figure: figure2 },
      ],
    },
    {
      id: "how-to-find-the-request-gap-on",
      title: "Find the request gap",
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
              " block totals their CPU and memory requests and limits, each with its share of the node.",
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
              " reads the cluster’s metrics pipeline, so a new pod’s figures can take a few minutes to appear.",
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
          kind: "p",
          text: [
            { code: "kubectl top" },
            " shows use only at the moment you run it. Size from a window that includes your peaks.",
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            "Requests below real use let Karpenter put too many pods on one node. Scheduling and consolidation compare requests with allocatable capacity and ignore limits. So pods whose memory limit sits above their request can burst together and be ",
            { a: "OOM-killed", href: "/learn/oomkilled-exit-code-137" },
            ". A pod using more memory than it requests is also likely to be evicted when its node runs short.",
          ],
        },
        {
          kind: "p",
          text: "For memory and other non-CPU resources, AWS recommends setting requests equal to limits when you use consolidation. Aim for measured use plus headroom.",
        },
        {
          kind: "p",
          text: [
            { a: "Kubernetes pod right sizing", href: "/learn/kubernetes-pod-right-sizing" },
            " covers choosing requests from usage history and rolling changes out. The ",
            { a: "Kubernetes cost optimization guide", href: "/kubernetes-cost-optimization" },
            " sets the order: requests first, then nodes.",
          ],
        },
      ],
    },
    {
      id: "where-coral-fits-with-karpenter",
      title: "Where Coral fits",
      blocks: [
        {
          kind: "p",
          text: [
            "Karpenter, and node auto provisioning (NAP) on AKS, choose and remove machines from requests they don’t change. ",
            { a: "Coral", href: "/coral" },
            " rebalances those requests to real use on AKS and EKS, so the same autoscaler can run fewer or smaller nodes.",
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
            "Pod sizing starts only when you switch on “Automatically optimize” for a policy or a workload. Running pods are resized in place on Kubernetes 1.33+ nodes. On older nodes they restart one at a time, within their ",
            { a: "PodDisruptionBudgets", href: "/learn/glossary/pod-disruption-budget" },
            ". A smaller request reduces cost once the freed capacity lets a node go.",
          ],
        },
        {
          kind: "p",
          text: [
            "Coral never changes your Karpenter settings, and leaves the pools Karpenter consolidates to Karpenter. A pod or node marked ",
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
          text: [
            "On an EKS cluster with no autoscaler, connecting Coral sets up Karpenter, with your approval. ",
            { a: "Coral works with Karpenter", href: "/coral-works-with-karpenter" },
            " sets out who does what. The FAQ answers ",
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
    text: "Coral rebalances CPU and memory requests on AKS and EKS, works with your HPA, and removes the nodes you don’t need. We estimate it takes 40–50% off AKS and EKS cost. It is an estimated range, not a promise. The free assessment works out your own figure.",
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
    {
      publisher: "Kubernetes",
      title: "“kubectl top pod”",
      url: "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_top/kubectl_top_pod/",
    },
  ],
  related: [
    {
      title: "What is Karpenter in Kubernetes?",
      where: "Learn",
      href: "/learn/what-is-karpenter",
    },
    {
      title: "Karpenter consolidation",
      where: "Learn",
      href: "/learn/karpenter-consolidation",
    },
    {
      title: "Kubernetes requests vs limits",
      where: "Learn",
      href: "/learn/kubernetes-pod-right-sizing",
    },
    {
      title: "Kubernetes bin packing",
      where: "Learn",
      href: "/learn/kubernetes-bin-packing",
    },
    {
      title: "How to choose EKS instance types",
      where: "Learn",
      href: "/learn/how-to-choose-eks-instance-types",
    },
  ],
  relatedTitle: "More on Karpenter and requests",
};
