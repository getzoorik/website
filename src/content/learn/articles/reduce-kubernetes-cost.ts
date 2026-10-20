import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/reduce-kubernetes-cost/1";

export const article: Article = {
  slug: "reduce-kubernetes-cost",
  title: "How to reduce Kubernetes cost: requests, then nodes",
  meta: "How to reduce Kubernetes cost on AKS and EKS: rebalance requests to real use, then let the Cluster Autoscaler, Karpenter or NAP remove the nodes left spare.",
  h1: "How to reduce Kubernetes cost: rebalance requests, then remove spare nodes",
  deck: "Smaller requests free room on your nodes. The bill falls when a spare node goes. Both steps, in order.",
  card: "Rebalance requests to real use, then let spare nodes go: the order that reduces AKS and EKS cost.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes cost basics",
  published: "2026-10-30",
  updated: "2026-10-30",
  author: "swapnil",
  short:
    "To reduce Kubernetes cost, work in two steps, in this order. First, rebalance each container’s CPU and memory requests to what it really uses, because the scheduler and your node autoscaler count what pods request, not what they use. Then let the spare nodes go: the Cluster Autoscaler, Karpenter or AKS node auto-provisioning (NAP) removes a node once it is underused and its pods fit elsewhere. Smaller requests change nothing on the bill until a node is removed.",
  sections: [
    {
      id: "why-kubernetes-cost-follows-requests-not-use",
      title: "Why Kubernetes cost follows requests, not use",
      blocks: [
        {
          kind: "p",
          text: "On Azure Kubernetes Service (AKS) and Amazon Elastic Kubernetes Service (EKS) you pay for the virtual machines behind your nodes, and AWS’s EKS Best Practices Guide says EC2 instances are the bulk of the cost in most EKS clusters. So any plan for how to reduce Kubernetes costs comes down mostly to how many nodes you run.",
        },
        {
          kind: "p",
          text: "Requests decide that number. A request is the CPU and memory Kubernetes sets aside for a container on a node. The scheduler places a pod only where the requests already on a node, plus the new pod’s, fit within its capacity. It refuses even when the node is nearly idle.",
        },
        {
          kind: "p",
          text: [
            "Node autoscalers count the same way. The Cluster Autoscaler considers a node for removal only when its pods’ CPU requests and memory requests are both under 50% of the node’s allocatable, the CPU and memory it can give pods (the default ",
            { code: "--scale-down-utilization-threshold" },
            " of 0.5). A node whose pods request 70% of its CPU stays, even if they use 5% of it.",
          ],
        },
        {
          kind: "p",
          text: [
            "While requests are padded, every node looks busy and no autoscaler can remove one. Once requests match use, the same pods fit on fewer nodes. AWS’s guide puts Kubernetes cost reduction in that order too: size the workloads, reduce unused capacity, then choose capacity types such as Spot. ",
            { a: "Kubernetes overprovisioning", href: "/learn/kubernetes-overprovisioning" },
            " covers where padded requests come from and how to measure them.",
          ],
        },
        { kind: "diagram", figure: figure1 },
      ],
    },
    {
      id: "step-1-rebalance-requests-to-real-use",
      title: "Step 1: rebalance requests to real use",
      blocks: [
        {
          kind: "p",
          text: "Read what each container uses over days, not minutes, so the window holds the nightly batch, or over a week if load peaks weekly. Then size the two requests differently:",
        },
        {
          kind: "ul",
          items: [
            "CPU: a high percentile of that window plus headroom. A container may use more CPU than its request when the node has room, and at its CPU limit it is throttled rather than stopped.",
            "Memory: the peak plus headroom. A container that goes past its memory limit can be killed by the kernel under memory pressure.",
          ],
        },
        {
          kind: "p",
          text: "Leave limits alone until you know why they were set. Watch for containers with a limit and no request: unless an admission default applies, Kubernetes copies the limit into the request, so a ceiling becomes a reservation. Give sidecars their own requests too, as AWS’s guide advises.",
        },
        {
          kind: "p",
          text: [
            { code: "kubectl describe nodes" },
            " lists the requests of each pod on a node and, under “Allocated resources”, their totals:",
          ],
        },
        { kind: "code", lang: "bash", code: "kubectl describe nodes <node-name>" },
        {
          kind: "p",
          text: [
            "If a Horizontal Pod Autoscaler (HPA) scales the workload on CPU, change its requests with the HPA in mind. Microsoft’s AKS guidance says not to run the Vertical Pod Autoscaler and the HPA on the same CPU or memory metric, and the ",
            { a: "VPA and HPA comparison", href: "/learn/vpa-vs-hpa" },
            " shows how a smaller request changes what the HPA reads.",
          ],
        },
        {
          kind: "p",
          text: [
            "Applying a new size used to mean a new pod. ",
            { a: "In-place pod resize", href: "/learn/in-place-pod-resize" },
            ", stable since Kubernetes 1.35 and on by default as a beta from 1.33, changes a running container’s CPU and memory without recreating the pod. Where pods have to be recreated, roll the change out a few pods at a time, so enough replicas stay up while the new ones start.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Kubernetes pod right sizing", href: "/learn/kubernetes-pod-right-sizing" },
            " covers how to pick the numbers.",
          ],
        },
      ],
    },
    {
      id: "step-2-let-the-spare-nodes-go",
      title: "Step 2: let the spare nodes go",
      blocks: [
        {
          kind: "p",
          text: "Kubernetes node consolidation turns smaller requests into Kubernetes cost savings: pods move off an underused node, and the empty node is removed. AWS’s guide is plain about doing it by hand: “We recommend you do not try to optimize compute capacity manually.” Let your node autoscaler remove the nodes, and tune how it decides.",
        },
        { kind: "h3", id: "with-the-cluster-autoscaler", title: "With the Cluster Autoscaler" },
        {
          kind: "p",
          text: [
            "A node goes when its pods’ requests are under the utilization threshold, every pod on it can move to another node, and it has stayed that way for the unneeded time (",
            { code: "--scale-down-unneeded-time" },
            ", 10\u00a0minutes by default). The Cluster Autoscaler first checks that each pod’s PodDisruptionBudget (PDB) allows at least one replica to go, then evicts the pods through the Eviction API, and keeps the node if an eviction fails. Non-empty nodes go one at a time, and a node pool or Auto Scaling group never drops below its minimum count.",
          ],
        },
        {
          kind: "p",
          text: "On AKS these settings live in the cluster autoscaler profile, which applies to every node pool that uses the autoscaler. The 0.6 below is an example, not a recommendation:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "az aks update \\\n  --resource-group <resource-group> \\\n  --name <cluster-name> \\\n  --cluster-autoscaler-profile scale-down-utilization-threshold=0.6",
        },
        {
          kind: "p",
          text: "A higher threshold makes more nodes eligible for removal and runs the rest fuller, so test a new value before you rely on it, as AWS advises.",
        },
        { kind: "h3", id: "with-karpenter-or-nap", title: "With Karpenter or NAP" },
        {
          kind: "p",
          text: [
            "Karpenter consolidates by deleting a node whose pods fit in other nodes’ free capacity, or by replacing it with a single cheaper node that, with the free capacity elsewhere, holds all its pods. The NodePool’s ",
            { code: "disruption" },
            " block sets how far it goes, and NAP on AKS uses the same ",
            { code: "consolidationPolicy" },
            " field and budgets. Karpenter’s defaults, written out:",
          ],
        },
        {
          kind: "code",
          lang: "yaml",
          code: 'spec:\n  disruption:\n    consolidationPolicy: WhenEmptyOrUnderutilized\n    consolidateAfter: 0s\n    budgets:\n      - nodes: "10%"',
        },
        {
          kind: "p",
          text: [
            { code: "WhenEmpty" },
            " removes only nodes with no workload pods. ",
            { code: "consolidateAfter" },
            " is how long a node must go without a pod being added or removed before Karpenter considers it, and ",
            { code: "Never" },
            " turns consolidation off for the pool. The budget caps how many of the pool’s nodes are disrupted at once. Karpenter’s current docs (v1.15) also describe a ",
            { code: "Balanced" },
            " policy, which skips moves whose saving is small next to the disruption. ",
            { a: "Karpenter consolidation", href: "/learn/karpenter-consolidation" },
            " covers each setting.",
          ],
        },
        {
          kind: "p",
          text: [
            "Whichever autoscaler you run, a moved pod is evicted and started again elsewhere, so an app with a single replica is briefly down each time its pod moves. The mechanics are in ",
            {
              a: "how to drain a Kubernetes node without downtime",
              href: "/learn/kubernetes-drain-node-without-downtime",
            },
            " and ",
            { a: "what cordon and drain each do", href: "/learn/cordon-vs-drain" },
            ", and ",
            { a: "Kubernetes bin packing", href: "/learn/kubernetes-bin-packing" },
            " covers how the remaining nodes fill.",
          ],
        },
      ],
    },
    {
      id: "what-keeps-a-spare-node-running",
      title: "What keeps a spare node running",
      blocks: [
        {
          kind: "p",
          text: "When a node stays up with little on it, one of its pods usually can’t move. The Cluster Autoscaler FAQ lists the cases:",
        },
        {
          kind: "ul",
          items: [
            "A restrictive PDB, one that allows no pod to be evicted right now. Karpenter also leaves a node alone while a blocking PDB is on it.",
            "A kube-system pod with no PDB, unless it runs on every node by default as DaemonSet pods do.",
            "A bare pod, which no controller would recreate.",
            [
              "A pod that keeps data on the node itself, in a ",
              { code: "hostPath" },
              " or an ",
              { code: "emptyDir" },
              " that isn’t in memory. AKS’s default profile sets ",
              { code: "skip-nodes-with-local-storage" },
              " to false, so on AKS this one doesn’t hold a node for the cluster autoscaler.",
            ],
            [
              "A pod with nowhere else to go: no other node has room for its requests, a free ",
              { code: "hostPort" },
              " or the labels its node selector needs.",
            ],
            [
              "A pod annotated ",
              { code: 'cluster-autoscaler.kubernetes.io/safe-to-evict: "false"' },
              ", or, for Karpenter and NAP, ",
              { code: 'karpenter.sh/do-not-disrupt: "true"' },
              ".",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Give every PDB room for at least one disruption: for a Deployment of 6\u00a0pods that must keep 4 running, AWS’s example sets ",
            { code: "minAvailable" },
            " to 4. Add PDBs to kube-system pods that can safely run elsewhere, run bare pods under a Deployment, and move node-local data to a persistent volume. Keep the annotations for pods that really can’t move. ",
            {
              a: "Pod disruption budget best practices",
              href: "/learn/pod-disruption-budget-best-practices",
            },
            " and ",
            {
              a: "Cluster Autoscaler not scaling down",
              href: "/learn/cluster-autoscaler-not-scaling-down",
            },
            " go through each case.",
          ],
        },
      ],
    },
    {
      id: "other-ways-to-reduce-kubernetes-cost-after",
      title: "Other ways to reduce Kubernetes cost, after the two steps",
      blocks: [
        {
          kind: "p",
          text: "The four below pay off most on the nodes you keep. AWS’s guide suggests working out your cluster’s minimum and maximum capacity, covering the minimum with a Savings Plan, and running on Spot the capacity your availability doesn’t depend on. A commitment bought before you rebalance and consolidate would cover capacity you’re about to remove.",
        },
        {
          kind: "ul",
          items: [
            "Spot capacity. Azure Spot node pools run on spare capacity in a single fault domain with no service-level agreement, and Azure evicts the nodes when it needs that capacity back. EC2 Spot instances can be reclaimed with a 2-minute notice. Both suit interruptible work.",
            "Commitments. Azure Reservations and the Azure savings plan for compute run for one or three years. AWS Savings Plans do too.",
            "Schedules. AKS start/stop shuts down all system and user node pools of a cluster that doesn’t need to run all the time, and keeps the cluster’s state for when you start it again.",
            [
              "Visibility. Managing cloud costs with Kubernetes means tracing them to Kubernetes objects. On AKS, the ",
              { a: "cost analysis add-on", href: "/learn/aks-cost-analysis" },
              " breaks cluster cost down by Kubernetes constructs in Microsoft Cost Management. On EKS, tag your worker nodes so AWS Cost Explorer can show their billing.",
            ],
          ],
        },
      ],
    },
    {
      id: "how-coral-does-both-steps",
      title: "How Coral does both steps",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral optimizes Kubernetes", href: "/coral" },
            " on AKS and EKS clusters running Kubernetes 1.30 or later, taking the same two steps and leaving scale-up to your node autoscaler.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Requests." },
              " Coral rebalances each container’s CPU and memory requests to real use. On the balanced policy, the default for Deployments, DaemonSets and Argo Rollouts, the CPU request is the 80th percentile of the last 3\u00a0days plus 10%, and memory is the 8-day peak plus 10%. With a CPU-utilization HPA, Coral sizes CPU instead by replaying those 3\u00a0days of load through your HPA’s own settings. Nothing is resized until you switch on “Automatically optimize” for a policy or a workload. Coral sizes pods as they start, and your manifests stay as they are.",
            ],
            [
              { b: "Nodes." },
              " Node optimization is on from install. Coral checks that every pod on a node fits on another Ready node, then cordons and drains one node at a time. If a drain can’t finish in 10\u00a0minutes, the node goes back into service. After a 5-minute wait, which you can change, Coral hands the empty node to your autoscaler, whose own timers decide when it goes. In a fixed-size pool that nothing else manages, Coral deletes the machine. Pools that Karpenter or NAP already consolidates are left to them, and Coral never creates machines itself.",
            ],
            [
              { b: "Held nodes." },
              " Consolidation respects PDBs, any pod or node marked not to be disrupted, and your autoscaler’s minimum pool size. Node list → “What’s holding them” gives each held node’s reason and fix.",
            ],
            [
              { b: "Restarts." },
              " Running pods are resized in place on 1.33+ nodes, or restarted one at a time within their PDBs. When a node is removed, a pod whose replacement can’t start first gets a short restart. Mark it do-not-disrupt to prevent that.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "On our own AKS development cluster, node optimization removed one spare 4-CPU worker two days after we connected Coral, on its own and in under 10\u00a0minutes. We hadn’t yet switched sizing to automatic. The cluster’s machine bill went from $368.65 to $221.19 a month, and apps that run a single copy restarted once on another machine. That is Zoorik’s own AKS cluster, not a customer result, at Azure pay-as-you-go list prices for a 730-hour month. ",
            { a: "The case study", href: "/case-studies/coral-dev-cluster" },
            " has the full timeline.",
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
      title: "“Resource Management for Pods and Containers”",
      url: "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/",
    },
    {
      publisher: "Kubernetes",
      title: "“Feature Gates”",
      url: "https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/",
    },
    {
      publisher: "Kubernetes autoscaler",
      title: "“Cluster Autoscaler FAQ”",
      url: "https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md",
    },
    {
      publisher: "Karpenter",
      title: "“Disruption”",
      url: "https://karpenter.sh/docs/concepts/disruption/",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Use the cluster autoscaler in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/cluster-autoscaler",
    },
    {
      publisher: "Microsoft Learn",
      title:
        "“Configure disruption policies for node auto-provisioning (NAP) nodes in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/node-auto-provisioning-disruption",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Best practices for cost optimization in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/best-practices-cost",
    },
    {
      publisher: "AWS, Amazon EKS Best Practices Guide",
      title: "“Compute and Autoscaling”",
      url: "https://docs.aws.amazon.com/eks/latest/best-practices/cost-opt-compute.html",
    },
  ],
  related: [
    {
      title: "Kubernetes overprovisioning: what it is and how to measure it",
      where: "Learn",
      href: "/learn/kubernetes-overprovisioning",
    },
    {
      title: "Kubernetes pod right sizing: set requests from real use",
      where: "Learn",
      href: "/learn/kubernetes-pod-right-sizing",
    },
    {
      title: "Cluster Autoscaler not scaling down: what keeps nodes running",
      where: "Learn",
      href: "/learn/cluster-autoscaler-not-scaling-down",
    },
    {
      title:
        "If workload optimization reduces requests, how soon are nodes consolidated and removed?",
      where: "Coral FAQ",
      href: "/coral/faq#if-workload-optimization-reduces-requests-how",
    },
    {
      title: "How we reduced our own cluster’s machine bill by 58%",
      where: "Case study",
      href: "/case-studies/coral-dev-cluster",
    },
  ],
};
