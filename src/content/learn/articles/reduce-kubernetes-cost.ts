import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/reduce-kubernetes-cost/1";
import { figure as figure2 } from "@/features/learn/figures/reduce-kubernetes-cost/2";

export const article: Article = {
  slug: "reduce-kubernetes-cost",
  route: "/kubernetes-cost-optimization",
  title: "Kubernetes cost optimization: requests, then nodes",
  meta: "Kubernetes cost optimization on AKS and EKS in two steps: rebalance requests to real use, then let your autoscaler remove the spare nodes.",
  h1: "Kubernetes cost optimization",
  deck: "Smaller requests free room on your nodes, but only a node that goes reduces your cloud cost.",
  card: "Rebalance requests to real use, then let spare nodes go: the order that reduces AKS and EKS cost.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes cost basics",
  published: "2026-10-21",
  updated: "2026-11-03",
  author: "swapnil",
  cover: "/learn-covers/zoorik-learn-reduce-kubernetes-cost-1200x630.webp",
  coverAlt:
    "Reduce Kubernetes cost: rebalance requests, and the cluster has one node fewer to pay for",
  short:
    "Kubernetes cost optimization takes two steps. First, rebalance each container’s CPU and memory requests to what it uses, because node autoscalers count requests, not use. Then let the Cluster Autoscaler, Karpenter or AKS node auto provisioning (NAP) remove the spare nodes.",
  sections: [
    {
      id: "you-pay-for-nodes-and-requests-decide",
      title: "Requests set the node count",
      blocks: [
        {
          kind: "p",
          text: "On Azure Kubernetes Service (AKS) and Amazon Elastic Kubernetes Service (EKS), you pay for the virtual machines behind your nodes. AWS’s EKS Best Practices Guide says EC2 instances are the bulk of the cost in most EKS clusters. So most Kubernetes cost savings come from running fewer nodes.",
        },
        {
          kind: "p",
          text: "Requests decide how many nodes you need. A request is what Kubernetes sets aside for a container, and a node’s allocatable is what it can give pods. The scheduler places a pod only where its requests fit in the allocatable not yet requested, however idle the node is.",
        },
        {
          kind: "p",
          text: "Node autoscalers count the same way. By default, the Cluster Autoscaler considers removing a node only when its pods’ CPU requests and memory requests are both under 50% of its allocatable.",
        },
        {
          kind: "p",
          text: "Picture three nodes, each with 4\u00a0CPU allocatable. The pods on each node request 3\u00a0CPU and use 1, and memory follows the same pattern. Each node is 75% requested, so no autoscaler removes any of them. You pay for three nodes while your pods use 3 of 12\u00a0CPU.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "Rebalance each node’s requests to 1.5\u00a0CPU, still above the 1\u00a0CPU the pods use, and memory by the same share. Every node drops to 37.5% (1.5 ÷ 4), under the 50% line. Node 3’s pods move to nodes 1 and 2, and node 3 is removed. Nodes 1 and 2 then each carry 2.25\u00a0CPU of requests (4.5 ÷ 2, or 56%) and 1.5\u00a0CPU of use. At 56% both are above the line again, and 4.5\u00a0CPU wouldn’t fit on one node anyway, so the autoscaler stops at two.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: [
            "AWS’s guide ranks the work the same way: size the workloads, reduce unused capacity, then choose capacity types such as ",
            { a: "Spot", href: "/learn/glossary/spot-instance" },
            ". ",
            { a: "Kubernetes overprovisioning", href: "/learn/kubernetes-overprovisioning" },
            " explains where padded requests come from and how to measure them.",
          ],
        },
        {
          kind: "p",
          text: [
            "The ",
            { a: "EKS and AKS pricing calculator", href: "/eks-and-aks-pricing-calculator" },
            " gives one node’s monthly list price, and ",
            { a: "Kubernetes cost estimation", href: "/learn/kubernetes-cost-estimation" },
            " works out what a whole cluster costs.",
          ],
        },
      ],
    },
    {
      id: "step-1-rebalance-requests-to-real-use",
      title: "Step 1: rebalance requests",
      blocks: [
        {
          kind: "p",
          text: [
            "First, see what each node has reserved: ",
            { code: "kubectl describe nodes <node-name>" },
            " lists each pod’s requests and, under “Allocated resources”, their totals. Then, for each workload, in order:",
          ],
        },
        {
          kind: "ol",
          items: [
            [
              { b: "Read each container’s use over days." },
              " Use a metrics store that keeps history, such as Prometheus. Pick a window that holds the nightly batch, or a week if load peaks weekly.",
            ],
            [
              { b: "Check for an HPA before you size CPU." },
              " If a Horizontal Pod Autoscaler (HPA) scales the workload on CPU, a smaller request changes what the HPA reads, as the ",
              { a: "VPA and HPA comparison", href: "/learn/vpa-vs-hpa" },
              " shows. Microsoft’s AKS guidance says not to run the Vertical Pod Autoscaler (VPA) and the HPA on the same CPU or memory metric.",
            ],
            {
              text: [
                { b: "Size CPU and memory differently, and give each sidecar its own requests." },
              ],
              blocks: [
                {
                  kind: "ul",
                  items: [
                    [
                      { b: "CPU:" },
                      " a high percentile of that window plus headroom. A container may use more CPU than its request when the node has room, and at its CPU limit it is ",
                      { a: "throttled", href: "/learn/glossary/kubernetes-cpu-throttling" },
                      ", not stopped.",
                    ],
                    [
                      { b: "Memory:" },
                      " the peak plus headroom. A container that goes past its memory limit can be killed by the kernel’s out-of-memory (OOM) killer under memory pressure.",
                    ],
                  ],
                },
              ],
            },
            [
              { b: "Leave limits alone until you know why they were set." },
              " Watch for containers with a limit and no request. Unless an admission default applies, Kubernetes copies the limit into the request, so a ceiling becomes a reservation.",
            ],
            [
              { b: "Apply the new sizes." },
              " ",
              { a: "In-place pod resize", href: "/learn/in-place-pod-resize" },
              ", on by default from Kubernetes 1.33 and stable since 1.35, changes a running container’s CPU and memory without recreating the pod. Where pods must be recreated, roll the change out a few at a time so enough replicas stay up.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Kubernetes pod right sizing", href: "/learn/kubernetes-pod-right-sizing" },
            " shows how to pick the numbers.",
          ],
        },
      ],
    },
    {
      id: "step-2-let-your-autoscaler-remove-the",
      title: "Step 2: remove spare nodes",
      blocks: [
        {
          kind: "p",
          text: [
            "Node consolidation is where smaller requests become savings: pods move off an underused node, and the empty node is removed. AWS’s guide advises against doing it by hand: “We recommend you do not try to optimize compute capacity manually.” Let your node autoscaler do it, and tune how it decides. ",
            { a: "Kubernetes bin packing", href: "/learn/kubernetes-bin-packing" },
            " shows how the remaining nodes fill.",
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            "The Cluster Autoscaler and Karpenter move a pod by evicting it, and its controller starts a new one elsewhere. An app with a single replica is briefly down each time its pod moves. See ",
            {
              a: "how to drain a Kubernetes node without downtime",
              href: "/learn/kubernetes-drain-node-without-downtime",
            },
            " and ",
            { a: "what cordon and drain each do", href: "/learn/cordon-vs-drain" },
            ".",
          ],
        },
        { kind: "h3", id: "with-the-cluster-autoscaler", title: "Cluster Autoscaler" },
        {
          kind: "p",
          text: "The Cluster Autoscaler removes a node only when four main checks pass at once:",
        },
        {
          kind: "ul",
          items: [
            [
              "Its pods’ requests are under the utilization threshold (",
              { code: "--scale-down-utilization-threshold" },
              ", 0.5 by default).",
            ],
            "Every pod on it can move to another node.",
            [
              "It has stayed that way for the unneeded time (",
              { code: "--scale-down-unneeded-time" },
              ", 10\u00a0minutes by default).",
            ],
            [
              "Its ",
              { a: "node pool", href: "/learn/glossary/node-pool" },
              " or Auto Scaling group is above its minimum count.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "It then checks that each pod’s ",
            { a: "PodDisruptionBudget (PDB)", href: "/learn/glossary/pod-disruption-budget" },
            " allows at least one replica to go, and evicts the pods through the Eviction API. If an eviction fails, the node stays. Non-empty nodes go one at a time.",
          ],
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: "On AKS these settings live in the cluster autoscaler profile, which applies to every node pool that uses the autoscaler. The 0.6 below is only an example:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "az aks update \\\n  --resource-group <resource-group> \\\n  --name <cluster-name> \\\n  --cluster-autoscaler-profile scale-down-utilization-threshold=0.6",
        },
        {
          kind: "p",
          text: "A higher threshold makes more nodes eligible for removal and runs the rest fuller, so test a new value first.",
        },
        { kind: "h3", id: "with-karpenter-or-nap", title: "Karpenter and NAP" },
        {
          kind: "p",
          text: [
            "By default, Karpenter consolidates both empty and underused nodes, with no waiting period. It disrupts at most 10% of a pool’s nodes at once, rounded up to whole nodes. A NodePool’s ",
            { code: "disruption" },
            " block sets how far it goes, and NAP on AKS uses the same ",
            { code: "consolidationPolicy" },
            " field and budgets. The defaults, written out:",
          ],
        },
        {
          kind: "code",
          lang: "yaml",
          code: 'spec:\n  disruption:\n    consolidationPolicy: WhenEmptyOrUnderutilized\n    consolidateAfter: 0s\n    budgets:\n      - nodes: "10%"',
        },
        {
          kind: "callout",
          label: "For engineers",
          text: [
            "Karpenter consolidates in two ways. It deletes a node whose pods fit in other nodes’ free capacity. Or it replaces the node with one cheaper node, when that node plus the free capacity elsewhere holds all its pods. ",
            { code: "WhenEmpty" },
            " removes only nodes with no workload pods. ",
            { code: "consolidateAfter" },
            " is how long a node must go without a pod being added or removed before Karpenter considers it. ",
            { code: "Never" },
            " turns consolidation off for the pool. Karpenter’s current docs (v1.15) also describe a ",
            { code: "Balanced" },
            " policy, which skips moves whose saving is small next to the disruption. ",
            { a: "Karpenter consolidation", href: "/learn/karpenter-consolidation" },
            " covers each setting.",
          ],
        },
      ],
    },
    {
      id: "what-keeps-a-spare-node-running",
      title: "What blocks node removal",
      blocks: [
        {
          kind: "p",
          text: "When a node stays up with little on it, one of its pods usually can’t move. These cases come from the Cluster Autoscaler FAQ, with Karpenter and AKS where they differ:",
        },
        {
          kind: "table",
          columns: [
            { label: "What holds the node", width: "62%" },
            { label: "What frees it", width: "38%" },
          ],
          rows: [
            [
              "A PDB that allows no pod to be evicted right now. Karpenter also leaves a node alone while such a PDB is on it.",
              [
                "Give every PDB room for at least one disruption. For a Deployment of 6\u00a0pods that must keep 4 running, AWS’s example sets ",
                { code: "minAvailable" },
                " to 4.",
              ],
            ],
            [
              "A kube-system pod with no PDB, unless it runs on every node by default, as DaemonSet pods do.",
              "Add PDBs to kube-system pods that can safely run elsewhere.",
            ],
            ["A bare pod, which no controller would recreate.", "Run it under a Deployment."],
            [
              [
                "A pod that keeps data on the node itself, in a ",
                { code: "hostPath" },
                " or an ",
                { code: "emptyDir" },
                " that isn’t in memory. On AKS this doesn’t hold the node for the cluster autoscaler: its default profile sets ",
                { code: "skip-nodes-with-local-storage" },
                " to false.",
              ],
              "Move node-local data to a persistent volume.",
            ],
            [
              [
                "A pod with nowhere else to go: no other node has room for its requests, a free ",
                { code: "hostPort" },
                " or the labels its node selector needs.",
              ],
              "Make room with step 1’s smaller requests, or make the port or labels available on another node.",
            ],
            [
              [
                "A pod annotated ",
                { code: 'cluster-autoscaler.kubernetes.io/safe-to-evict: "false"' },
                ", or, for Karpenter and NAP, ",
                { code: 'karpenter.sh/do-not-disrupt: "true"' },
                ".",
              ],
              [
                "Remove ",
                { a: "the annotation", href: "/learn/safe-to-evict-do-not-disrupt" },
                " unless the pod really can’t move.",
              ],
            ],
          ],
        },
        {
          kind: "p",
          text: [
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
      title: "Other ways to reduce cost",
      blocks: [
        {
          kind: "p",
          text: [
            "Buy commitments last: one bought before you rebalance and consolidate covers capacity you’re about to remove. AWS suggests working out your cluster’s minimum and maximum capacity. Cover the minimum with a ",
            { a: "Savings Plan", href: "/learn/glossary/savings-plan" },
            ", and run on Spot the capacity your availability doesn’t depend on. These pay off most on the nodes you keep:",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Spot capacity:" },
              " Azure Spot node pools run on spare capacity in a single fault domain, with no service-level agreement. Azure evicts the nodes when it needs that capacity back. EC2 Spot instances can be reclaimed with a 2-minute notice. Both suit interruptible work.",
            ],
            [
              { b: "Commitments:" },
              " Azure Reservations, the Azure savings plan for compute and AWS Savings Plans all run for one or three years.",
            ],
            [
              { b: "Schedules:" },
              " AKS start/stop shuts down all system and user node pools of a cluster that doesn’t need to run all the time. Its state is kept for when you start it again.",
            ],
            [
              { b: "Visibility:" },
              " on AKS, the ",
              { a: "cost analysis add-on", href: "/learn/aks-cost-analysis" },
              " breaks cluster cost down by Kubernetes constructs in Microsoft Cost Management. On EKS, tag your worker nodes so AWS Cost Explorer can show what they cost.",
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
            { a: "Coral", href: "/coral" },
            " takes the same two steps on AKS and EKS clusters running Kubernetes 1.30 or later, without any downtime. ",
            { a: "AKS cost optimization", href: "/aks-cost-optimization" },
            " and ",
            { a: "EKS cost optimization", href: "/eks-cost-optimization" },
            " show what Coral does on each cloud.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Requests." },
              " Coral rebalances each container’s CPU and memory requests to real use, from its own usage history. With a CPU-utilization HPA, it sizes CPU by replaying past load through your HPA’s own settings. Nothing is resized until you switch on “Automatically optimize” for a policy or a workload. Coral sizes pods as they start, so your manifests stay as they are.",
            ],
            [
              { b: "Nodes." },
              " Node optimization is on from install, on the node pools you choose. Coral checks that every pod on a node fits on another Ready node, then drains one node at a time. If a drain can’t finish, the node goes back into service.",
            ],
            [
              { b: "Machines." },
              " Coral hands each empty node to your autoscaler to remove, or deletes the machine in a fixed-size pool that nothing else manages. Pools that Karpenter or NAP already consolidate are left to them, and Coral never creates machines itself.",
            ],
            [
              { b: "Moves." },
              " Running pods resize in place on Kubernetes 1.33 or later, or are replaced one at a time within their PDBs. When Coral drains a node, eligible Deployments and Argo Rollouts get a warm handover, even with one replica. A new copy is Ready on another node before the old pod goes. Other pods move by live migration where both nodes support it.",
            ],
            [
              { b: "Held nodes." },
              " Coral respects PDBs and any pod or node marked not to be disrupted. Where a pool’s minimum alone keeps an emptied node, Coral may reduce that minimum, and disconnect puts it back. Node list → “What’s holding them” gives each held node’s reason and fix.",
            ],
          ],
        },
        {
          kind: "p",
          text: "On our own AKS development cluster, the apps already fit on fewer machines. On 6 October, once we let Coral remove machines, node optimization removed one spare 4-CPU node on its own.",
        },
        {
          kind: "p",
          text: "The machine cost went from $368.65 to $221.19 a month, at Azure pay-as-you-go list prices for a 730-hour month. That is Zoorik’s own cluster, not a customer result.",
        },
        {
          kind: "p",
          text: [
            { a: "The Coral Value Lab study", href: "/coral-value-lab" },
            " has the full timeline. Its 58% also counts a swap to a cheaper worker on 12 October.",
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
      title: "Kubernetes overprovisioning",
      where: "Learn",
      href: "/learn/kubernetes-overprovisioning",
    },
    {
      title: "Kubernetes requests vs limits",
      where: "Learn",
      href: "/learn/kubernetes-pod-right-sizing",
    },
    {
      title: "Cluster Autoscaler not scaling down",
      where: "Learn",
      href: "/learn/cluster-autoscaler-not-scaling-down",
    },
    {
      title: "How soon are spare nodes removed?",
      where: "Coral FAQ",
      href: "/coral-faq#if-workload-optimization-reduces-requests-how",
    },
    {
      title: "How we reduced our own AKS cluster’s machine cost by 58%",
      where: "Coral Value Lab",
      href: "/coral-value-lab",
    },
  ],
  relatedTitle: "More on requests and node removal",
};
