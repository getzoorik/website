import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/karpenter-cost-optimization/1";

export const article: Article = {
  slug: "karpenter-cost-optimization",
  title: "Karpenter cost optimization: the request gap",
  meta: "Karpenter cost optimization starts with pod requests: how Karpenter picks and consolidates nodes, the settings that matter, and how to find the request gap.",
  h1: "Karpenter cost optimization: the requests it can’t fix",
  deck: "Karpenter buys machines for the requests you set. What it does well, the settings that matter, and the gap it leaves.",
  card: "What Karpenter does to reduce node cost, and why over-requested pods still buy machines they don’t use.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes autoscaling",
  published: "2026-11-01",
  updated: "2026-11-01",
  author: "adil",
  short:
    "Karpenter cost optimization comes from two jobs Karpenter does well: it launches low-priced instance types that fit your pending pods, and it consolidates nodes by deleting them or replacing them with one that costs less. Both jobs count requests, not use. Karpenter’s scheduling docs say its instance type selection math “only uses requests”. A pod that requests 1\u00a0CPU and uses 0.25 still buys room for 1\u00a0CPU, so much of the remaining saving can sit in the requests.",
  sections: [
    {
      id: "where-karpenter-cost-savings-come-from",
      title: "Where Karpenter cost savings come from",
      blocks: [
        {
          kind: "p",
          text: "Karpenter watches for pods the Kubernetes scheduler (kube-scheduler) can’t place. It batches them and bin-packs them “based on CPU, memory, and GPUs required”, counting node overhead and the DaemonSets that will run on the new node. The most efficient fit, which Karpenter’s FAQ defines as the smallest type that can hold the batch, goes to Amazon EC2 Fleet along with 59 larger types, 60 options in all. Fleet then applies the price-capacity-optimized allocation strategy. For on-demand capacity that works out the same as choosing the lowest price. For spot, Fleet weighs price against the chance of interruption, so you may not get the strictly cheapest spot type.",
        },
        {
          kind: "p",
          text: [
            "Consolidation is the second source. Karpenter’s disruption docs describe two actions: deleting a node when all its pods fit on free capacity elsewhere, and replacing a node when they fit on a mix of free capacity and one new node that costs less. A NodePool with no disruption settings uses ",
            { code: "consolidationPolicy: WhenEmptyOrUnderutilized" },
            " and ",
            { code: "consolidateAfter: 0s" },
            ", so underused nodes are candidates from the start. ",
            { a: "Karpenter consolidation", href: "/learn/karpenter-consolidation" },
            " covers the policies, timers and budgets in detail.",
          ],
        },
        {
          kind: "p",
          text: "This article follows the v1.15 docs, the latest version on karpenter.sh in October 2026.",
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
            "Karpenter is an ",
            { a: "open-source project", href: "/learn/what-is-karpenter" },
            ", so the software itself has no licence fee, and the Karpenter cost that matters is the EC2 instances it launches. Around them sit a few small items. The Helm chart installs the controller as a Deployment, and AWS advises running it on a small node group with at least one worker node, or on EKS Fargate, and never on a node Karpenter manages. If you use spot, interruption handling reads an Amazon SQS queue that you name in the controller’s ",
            { code: "--interruption-queue" },
            " setting.",
          ],
        },
        {
          kind: "p",
          text: [
            "Karpenter will also keep adding capacity as pods need it. A NodePool with no ",
            { code: "spec.limits" },
            " has no ceiling except your cloud provider’s quotas, and there is no cluster-wide limit, only one per NodePool. AWS recommends setting limits and creating billing alarms.",
          ],
        },
      ],
    },
    {
      id: "karpenter-cost-optimization-settings-worth-checking",
      title: "Karpenter cost optimization settings worth checking",
      blocks: [
        {
          kind: "p",
          text: "The AWS Karpenter cost optimization advice in the EKS Best Practices Guide, with Karpenter’s own docs, comes down to a few choices. Each one helps Karpenter buy fewer or cheaper machines for the same requests.",
        },
        {
          kind: "h3",
          id: "let-karpenter-choose-from-many-instance-types",
          title: "Let Karpenter choose from many instance types",
        },
        {
          kind: "p",
          text: [
            "By default Karpenter can use every instance type EC2 offers in your cluster’s region and Availability Zones. AWS advises against constraining that list too tightly, especially with spot, because the more instance types Karpenter may use, the better EC2 can keep your spot instances running. To keep out machines you never want, exclude them with ",
            { code: "NotIn" },
            " on ",
            { code: "node.kubernetes.io/instance-type" },
            " rather than listing a few types you like.",
          ],
        },
        {
          kind: "h3",
          id: "allow-spot-for-pods-that-can-move",
          title: "Allow spot for pods that can move",
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
            ". When a NodePool allows more than one, Karpenter tries ",
            { code: "reserved" },
            " first, then ",
            { code: "spot" },
            ", then ",
            { code: "on-demand" },
            ", and moves down the list whenever the type it wants has no capacity. (",
            { code: "reserved" },
            " means EC2 capacity reservations, not Reserved Instances.) If you have bought Savings Plans or Reserved Instances, the scheduling docs suggest a separate NodePool for those instance types, with a higher ",
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
          text: "A general-purpose NodePool along these lines allows both capacity types on the C, M and R instance types of generation 3 or later, which Karpenter’s FAQ recommends for most generic workloads. It caps the pool, and consolidation considers a node once no pod has been added to it or removed from it for one minute:",
        },
        {
          kind: "code",
          lang: "yaml",
          code: 'apiVersion: karpenter.sh/v1\nkind: NodePool\nmetadata:\n  name: general\nspec:\n  template:\n    spec:\n      nodeClassRef:\n        group: karpenter.k8s.aws\n        kind: EC2NodeClass\n        name: default\n      requirements:\n        - key: karpenter.sh/capacity-type\n          operator: In\n          values: ["spot", "on-demand"]\n        - key: karpenter.k8s.aws/instance-category\n          operator: In\n          values: ["c", "m", "r"]\n        - key: karpenter.k8s.aws/instance-generation\n          operator: Gte\n          values: ["3"]\n  limits:\n    cpu: "1000"\n    memory: 1000Gi\n  disruption:\n    consolidationPolicy: WhenEmptyOrUnderutilized\n    consolidateAfter: 1m',
        },
        {
          kind: "h3",
          id: "karpenter-spot-to-spot-consolidation",
          title: "Karpenter spot-to-spot consolidation",
        },
        {
          kind: "p",
          text: [
            "Out of the box, consolidation can delete spot nodes, but it won’t replace one spot node with a cheaper spot node. That takes the ",
            { code: "SpotToSpotConsolidation" },
            " feature gate. It has been alpha since v0.34 and is still off by default in v1.15. You turn it on in the Karpenter deployment with the ",
            { code: "FEATURE_GATES" },
            " environment variable or the ",
            { code: "--feature-gates" },
            " argument, for example ",
            { code: "--feature-gates SpotToSpotConsolidation=true" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "Even with the gate on, a one-for-one spot replacement needs at least 15 instance types priced below the current node in the launch. The cheapest spot type isn’t always the one launched, because of its interruption risk, and consolidating again and again down to the cheapest type could land on one with very high rates of interruption. The docs call that a “race to the bottom”. Replacing several spot nodes with one has no such floor. A spot NodePool narrowed to a handful of instance types can’t meet the floor for single-node swaps, which is another reason to keep the list wide.",
        },
        {
          kind: "h3",
          id: "pack-pods-the-way-karpenter-does",
          title: "Pack pods the way Karpenter does",
        },
        {
          kind: "p",
          text: [
            "Karpenter packs pods tightly in its simulation, but the kube-scheduler places them, and its default ",
            { code: "LeastAllocated" },
            " scoring spreads pods across nodes. Karpenter’s scheduling docs recommend the ",
            { code: "MostAllocated" },
            " strategy instead, so the scheduler’s placement matches Karpenter’s packing and more nodes empty out, ready for consolidation to remove them. On EKS you set it through advanced control plane configuration, on Kubernetes 1.31 or later. The trade is real: tighter packing leaves less room for pods to burst above their requests, so a pod can be killed for running out of memory (an ",
            { a: "OOM kill", href: "/learn/oomkilled-exit-code-137" },
            ") or have its CPU throttled sooner, and more pods are affected when one node fails. ",
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
            "Every setting above helps Karpenter buy the cheapest machine for a given set of requests. None of them changes the requests. Karpenter’s docs are direct about it: “Instance type selection math only uses ",
            { code: "requests" },
            "”. The kube-scheduler works the same way. Its documentation says that even when “actual memory or CPU resource usage on nodes is very low, the scheduler still refuses to place a Pod on a node if the capacity check fails.” AWS puts the consequence plainly: Karpenter launches the best-fitting nodes “when its information about your workloads requirements is accurate.”",
          ],
        },
        {
          kind: "p",
          text: "Take a Deployment of 30\u00a0replicas, each requesting 1\u00a0CPU and 2\u00a0GiB, whose containers peak at 0.25\u00a0CPU and 0.8\u00a0GiB. Karpenter has to buy room for 30\u00a0CPU and 60\u00a0GiB, plus DaemonSets and node overhead, while the pods use 7.5\u00a0CPU and 24\u00a0GiB at their busiest. Three quarters of that CPU sits idle at peak, and if the nodes are packed tightly by requests, consolidation finds nothing to remove. Set the requests a little above the peak, say 0.3\u00a0CPU and 1\u00a0GiB, and the same 30\u00a0replicas ask for 9\u00a0CPU and 30\u00a0GiB. Karpenter’s next launches are sized for that, and the nodes the old requests held become candidates to delete or replace.",
        },
        { kind: "diagram", figure: figure1 },
        {
          kind: "p",
          text: "DaemonSets multiply the effect. When Karpenter sizes a node, it adds the requests of every DaemonSet that will run there to the pending pods’ requests, so an oversized DaemonSet request is paid for on every node the DaemonSet runs on.",
        },
        {
          kind: "p",
          text: "The gap runs the other way too. Requests below real use let Karpenter put too many pods on one node. According to the EKS Best Practices Guide, scheduling and consolidation compare requests with allocatable capacity and ignore limits, so pods whose memory limit sits above their request can burst together and be OOM-killed. For memory and other non-CPU resources, AWS recommends setting requests equal to limits when you use consolidation. Aim for measured use plus headroom, not small requests everywhere.",
        },
      ],
    },
    {
      id: "how-to-find-the-request-gap-on",
      title: "How to find the request gap on a Karpenter node",
      blocks: [
        {
          kind: "p",
          text: "Three commands show it: the nodes in one NodePool, what a node’s pods request, and what they use.",
        },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl get nodes -l karpenter.sh/nodepool=<nodepool-name>\nkubectl describe nodes <node-name>\nkubectl top pod --namespace=<namespace> --containers",
        },
        {
          kind: "p",
          text: [
            "In ",
            { code: "kubectl describe nodes" },
            ", the ",
            { code: "Allocated resources" },
            " block totals the CPU and memory requests and limits of the node’s pods, each with a percentage. ",
            { code: "kubectl top" },
            " shows figures from the cluster’s metrics pipeline, and a new pod’s figures can take a few minutes to appear. A node at 90% of its CPU requested, whose pods use a small share of that, is the gap Karpenter can’t see.",
          ],
        },
        {
          kind: "p",
          text: [
            { code: "kubectl top" },
            " shows use at the moment you run it. Size from a window that includes your peaks: when a container uses more memory than its request and its node runs short of memory, its pod is likely to be evicted, and a container that uses more than its memory limit may be terminated by the kernel in an OOM kill. ",
            { a: "Kubernetes pod right sizing", href: "/learn/kubernetes-pod-right-sizing" },
            " covers choosing requests from usage history, the headroom to leave and how to roll changes out.",
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
            "Karpenter and node auto-provisioning (NAP) on AKS choose and remove machines from pod requests, and they don’t change the requests. ",
            { a: "Coral", href: "/coral" },
            " rebalances the requests to real use. On the balanced policy, CPU is the 80th percentile (P80) of the last 3\u00a0days plus 10%, and memory is the highest use in the last 8\u00a0days, plus the same 10%. With a Horizontal Pod Autoscaler (HPA) that scales on CPU utilization, Coral picks the CPU request by replaying past load through that HPA’s own settings. Your manifests are never changed. Pod sizing starts only when you switch on “Automatically optimize” for a policy or a workload, and running pods are resized in place on Kubernetes 1.33+ nodes or restarted one at a time within their PodDisruptionBudgets.",
          ],
        },
        {
          kind: "p",
          text: [
            "The same Karpenter can then run fewer or smaller nodes. Pools that Karpenter consolidates are left to Karpenter, Coral never changes your Karpenter settings, and a pod or node marked ",
            { code: 'karpenter.sh/do-not-disrupt: "true"' },
            " stays where it is. With Karpenter in place, Coral can also rebalance chosen nodes onto cheaper machines: it creates its own fixed-size NodePools named zoorik-rb-…, your Karpenter launches the new machines, and the old nodes are drained and removed one by one.",
          ],
        },
        {
          kind: "p",
          text: [
            "Coral prices every saving at your cloud’s published list price for the region, with spot nodes at the spot rate and a 730-hour month. Discounts, reservations and savings plans are left out. A smaller request reaches your bill when the freed capacity lets a node go. If an EKS cluster has no autoscaler, connecting it to Coral sets up Karpenter, with your approval. The FAQ covers ",
            {
              a: "whether you need Coral with Karpenter",
              href: "/coral/faq#do-i-need-coral-with-karpenter",
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
      { label: "Kubernetes cost optimization with Coral", href: "/coral" },
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
      title: "How sizes are worked out",
      where: "Coral product guide",
      href: "/coral/guide#how-sizes-are-worked-out",
    },
    {
      title: "Do I need Coral with Karpenter or NAP?",
      where: "Coral FAQ",
      href: "/coral/faq#do-i-need-coral-with-karpenter",
    },
  ],
};
