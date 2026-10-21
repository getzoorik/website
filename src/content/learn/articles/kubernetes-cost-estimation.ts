import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/kubernetes-cost-estimation/1";

export const article: Article = {
  slug: "kubernetes-cost-estimation",
  title: "Kubernetes cost estimation for AKS and EKS",
  meta: "Kubernetes cost estimation, step by step: count the nodes your pod requests need on AKS or EKS, price them at list, and see what the free assessment reads.",
  h1: "Kubernetes cost estimation: count the nodes, then price them",
  deck: "Why requests set the node count, how to price AKS and EKS, and what the free assessment reads.",
  card: "Count the nodes your requests need, price them at list, and see what the free assessment reads.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes cost basics",
  published: "2026-10-23",
  updated: "2026-10-23",
  author: "shubankar",
  short:
    "Kubernetes cost estimation means pricing the machines a cluster needs, plus its control plane, disks and network. The arithmetic is short: nodes × each machine’s hourly list price × 730\u00a0hours a month. The node count is the hard part, because the scheduler fills nodes by the CPU and memory pods request, not by what they use. Estimate from measured use plus headroom, and the same sum shows how many nodes you could do without.",
  sections: [
    {
      id: "what-a-kubernetes-cluster-costs",
      title: "What a Kubernetes cluster costs",
      blocks: [
        {
          kind: "p",
          text: "A managed cluster’s bill has three parts. The worker nodes are virtual machines, billed like any other VM or EC2 instance for the time they run. The control plane is a fee per cluster. Around both sit the cluster’s disks, load balancers and public IP addresses, the Azure resources Microsoft lists for AKS beside its VMs. AWS adds a line that’s easy to miss: traffic from nodes to the EKS control plane across Availability Zones.",
        },
        {
          kind: "p",
          text: [
            "The control plane fee depends on the tier or the version. On AKS, the Free tier has free cluster management and is recommended for clusters of fewer than 10\u00a0nodes. Standard and Premium include an uptime service level agreement (SLA) and carry a price of their own on the AKS pricing page, and AKS cost analysis shows the uptime SLA as a service charge. Amazon EKS charges $0.10 per cluster per hour while the cluster’s Kubernetes version is in standard support, the first 14\u00a0months after that version is released in Amazon EKS, and $0.60 per cluster per hour during the 12\u00a0months of extended support that follow (Amazon EKS pricing page, October 2026; prices change). The ",
            { a: "comparison of AKS and EKS cost", href: "/learn/aks-vs-eks-cost" },
            " covers the tiers in full.",
          ],
        },
        {
          kind: "p",
          text: "The node line is the one that moves with your workloads, and the node count follows from how much CPU and memory the pods request.",
        },
      ],
    },
    {
      id: "kubernetes-cost-estimation-for-a-new-cluster",
      title: "Kubernetes cost estimation for a new cluster",
      blocks: [
        {
          kind: "p",
          text: "Before a cluster exists, a Kubernetes cost calculator does the pricing, either the Azure pricing calculator or the AWS Pricing Calculator. Neither one knows your workloads, so the node count is yours to work out in six steps:",
        },
        {
          kind: "ol",
          items: [
            "For each workload, multiply its CPU and memory requests by the replica count it runs most of the time, and add them up per node pool.",
            "Pick a machine type and use its allocatable, not its size. Allocatable is what’s left for pods after the node’s own reservations. In Microsoft’s example for AKS 1.29 and later, an 8\u00a0GB node that supports 30\u00a0pods reserves 650\u00a0MB for Kubernetes itself (kube-reserved) and 0.1\u00a0GB for the eviction threshold, which leaves 7.25\u00a0GB.",
            "Take off what your DaemonSets request, since a DaemonSet puts a pod on every node it targets.",
            "Divide the requests by what’s left per node and round up. Keep the larger of the CPU and memory counts, and check the node’s maximum pod count too: a node can run out of pod slots before it runs out of CPU or memory.",
            [
              "Leave slack. A pod can’t be split across two nodes, so a pool rarely packs to 100%. ",
              { a: "Bin packing", href: "/learn/kubernetes-bin-packing" },
              " explains why.",
            ],
            "Multiply the nodes by the machine’s hourly price and 730\u00a0hours, then add the control plane and the parts around it.",
          ],
        },
        {
          kind: "p",
          text: [
            {
              a: "How allocatable differs from capacity",
              href: "/learn/kubernetes-allocatable-vs-capacity",
            },
            " goes further into step 2.",
          ],
        },
        { kind: "h3", id: "aks-cost-estimation", title: "AKS cost estimation" },
        {
          kind: "p",
          text: "For an Azure Kubernetes cost estimator, Microsoft’s own tool is the Azure pricing calculator. It takes its per-unit prices from the Azure Retail Prices API, prices a VM for 730\u00a0hours a month unless you change it, and can show your negotiated prices once you log in.",
        },
        {
          kind: "p",
          text: "Two AKS details change the count. Every cluster needs a system node pool for system pods such as CoreDNS and metrics-server. In production that pool needs at least two nodes (Microsoft recommends three), each with at least 4\u00a0vCPUs and 4\u00a0GB of memory. Reservations also grow with the machine: AKS reserves 140\u00a0millicores of CPU on a 4-core host and 260 on a 16-core host.",
        },
        { kind: "h3", id: "eks-cost-estimation", title: "EKS cost estimation" },
        {
          kind: "p",
          text: "The Amazon EKS pricing page points to the AWS Pricing Calculator for the cluster and the rest of its architecture in one estimate. Three lines are easy to leave out. The cluster fee follows the Kubernetes version, so a cluster left on a version past standard support pays six times the standard-support fee, and a Provisioned Control Plane tier, if you choose one, adds its own hourly price on top. EKS Auto Mode adds a management fee that varies with the instance type, on top of the EC2 price, billed per second with a one-minute minimum. Public IPv4 addresses are billed too.",
        },
      ],
    },
    {
      id: "why-a-running-cluster-needs-a-different",
      title: "Why a running cluster needs a different estimate",
      blocks: [
        {
          kind: "p",
          text: "Once a cluster runs, the invoice tells you what it costs. What you want to know is what it would cost on the nodes its workloads really need, and requests decide that. The Kubernetes documentation says the scheduler keeps the requests on each node within its capacity, and that even when real use on the node is very low, it “still refuses to place a Pod on a node if the capacity check fails.” A node can be full by requests and close to idle.",
        },
        { kind: "p", text: "Two commands show the gap:" },
        { kind: "code", lang: "bash", code: "kubectl describe node <node-name>\nkubectl top node" },
        {
          kind: "p",
          text: [
            "Look for two things in the describe output: the node’s Allocatable figures and, under Allocated resources, the CPU and memory its pods request. ",
            { code: "kubectl top" },
            " shows recent use, and it works only where Metrics Server is installed and running in the cluster. Say requests sit at 90% of allocatable and use at 25%: most of that node is capacity you pay for and no pod uses.",
          ],
        },
        {
          kind: "p",
          text: [
            { code: "kubectl top" },
            " is a reading of the moment, though. An estimate you’ll act on needs at least a week of history from Prometheus or another metrics store, so that it sees your weekly peak.",
          ],
        },
        {
          kind: "p",
          text: [
            "Cost allocation tools answer a different question. The AKS cost analysis add-on, built on OpenCost and available on the Standard and Premium tiers, maps cost to clusters and namespaces. Its idle charges are “the cost of available resource capacity that isn’t used by any workloads.” It tells you who spent what and where capacity sat unused, but not how many nodes you could do without. ",
            { a: "What the cost analysis add-on shows", href: "/learn/aks-cost-analysis" },
            " has the details.",
          ],
        },
      ],
    },
    {
      id: "how-to-estimate-the-saving-from-smaller",
      title: "How to estimate the saving from smaller requests",
      blocks: [
        {
          kind: "p",
          text: "The saving estimate is the new-cluster sum run twice, once with today’s requests and once with measured use:",
        },
        {
          kind: "ol",
          items: [
            [
              "Size each container from a week or more of use: a high percentile of CPU plus headroom, and the peak of memory plus headroom, because when a container goes over its memory request and its node runs short of memory, its pod is likely to be evicted. ",
              { a: "Right sizing pods", href: "/learn/kubernetes-pod-right-sizing" },
              " covers how to choose.",
            ],
            "Count the nodes each pool needs at those sizes, with the same allocatable, DaemonSets, pod limit and slack as before, and never below the pool’s autoscaler minimum.",
            "Price the difference: (nodes today − nodes needed) × the machine’s hourly list price × 730.",
          ],
        },
        {
          kind: "p",
          text: "Say a pool’s pods request 30\u00a0CPU, and each node has 3.5\u00a0CPU left after its reservations and DaemonSets. The pool runs 9\u00a0nodes. Measured use plus headroom comes to 11\u00a0CPU, which fits on 4\u00a0nodes even when they’re packed only to 85%. If memory gives the same count or fewer, the estimate is 5\u00a0nodes × the hourly list price × 730\u00a0hours a month.",
        },
        { kind: "diagram", figure: figure1 },
        {
          kind: "p",
          text: "Two rules keep the estimate honest. A smaller request saves nothing until a node goes, so price nodes, never requests. And list prices leave out reservations, savings plans and negotiated rates, so your saving in dollars can come in under the estimate.",
        },
      ],
    },
    {
      id: "what-the-free-assessment-reads-and-writes",
      title: "What the free assessment reads and writes",
      blocks: [
        {
          kind: "p",
          text: [
            "Zoorik’s ",
            { a: "free assessment", href: "/assessment?p=coral" },
            " runs a version of this estimate against your own clusters and writes it into one PDF. Sign in with the ",
            { code: "az" },
            " or ",
            { code: "aws" },
            " CLI first (",
            { code: "az login" },
            " on Azure, for example), or run it in Azure Cloud Shell or AWS CloudShell:",
          ],
        },
        { kind: "code", lang: "bash", code: "npx -y zoorik assess coral" },
        {
          kind: "p",
          text: [
            "It prices AKS and EKS clusters. Any other cluster kubectl can reach is assessed but not priced. Outside a Cloud Shell it needs Python 3.8 or later and ",
            { code: "npx" },
            " to start it, plus ",
            { code: "kubectl" },
            ", and the ",
            { code: "az" },
            " or ",
            { code: "aws" },
            " CLI for AKS or EKS clusters.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Reads." },
              " With ",
              { code: "kubectl get" },
              ", nodes and pods, plus ReplicaSets and Jobs to match each pod to its workload. With ",
              { code: "kubectl top" },
              ", container use every 30\u00a0seconds for 3\u00a0minutes by default, keeping the peak. List prices come from the Azure Retail Prices API and the AWS Price List. It uses the access your ",
              { code: "az" },
              " or ",
              { code: "aws" },
              " sign-in already has, and doesn’t read HorizontalPodAutoscalers (HPAs), PodDisruptionBudgets, PersistentVolumes (PVs) or PersistentVolumeClaims (PVCs), Secrets or ConfigMaps. Cluster credentials go into a temporary kubeconfig that’s deleted when the run ends, and your own kubeconfig is left as it is.",
            ],
            [
              { b: "Runs, only when it must." },
              " ",
              { code: "az aks command invoke" },
              ", only when kubectl can’t reach or sign in to an AKS cluster, such as a private cluster from outside its network. Azure then starts a short-lived pod in that cluster. ",
              { code: "--no-invoke" },
              " turns this off.",
            ],
            [
              { b: "Sends." },
              " Nothing to Zoorik. Run through ",
              { code: "npx" },
              ", it also downloads the zoorik package from npm and PyPI.",
            ],
            [
              { b: "Writes." },
              " One PDF, ",
              { code: "zoorik-coral-assessment-YYYYMMDD-HHMM.pdf" },
              ", timestamped in UTC. In Cloud Shell it lands in your home folder, and elsewhere in the current folder. Add ",
              { code: "--anonymize" },
              " to replace namespace and workload names before you share it, and ",
              { code: "--anonymize-clusters" },
              " to replace cluster names too.",
            ],
          ],
        },
        {
          kind: "p",
          text: "The PDF gives the estimated saving at list price, how many nodes each pool could do without and the recommended request sizes. A pool that needs every node it has adds nothing to the saving.",
        },
        {
          kind: "p",
          text: "The method works like the sums above. A recommended request is the peak sampled use × 1.3, at least 10m of CPU and 32\u00a0MiB, and never above today’s request unless that request is zero. Nodes are counted for each pool and machine type, against the smallest allocatable among those nodes, less DaemonSet and static pods, for CPU, memory and pod slots, packed to 85%. The count never drops below the pool’s autoscaler minimum or 1\u00a0node, and never rises above today’s count. The saving is (nodes today − nodes needed) × hourly list price × 730. Control-plane fees, storage, network, load balancers, Windows nodes and discounts are left out. Without Metrics Server there’s no usage reading, so requests stay as they are and only surplus nodes count.",
        },
        {
          kind: "p",
          text: [
            "Three minutes of samples can miss a daily or weekly peak, so treat the recommended requests as a first look. A cluster connected to ",
            { a: "Coral", href: "/coral" },
            " sizes from days of data instead. On the balanced policy, the default for Deployments, DaemonSets and Argo Rollouts, CPU is the 80th percentile of the last 3\u00a0days plus 10%, and memory is the highest use in the last 8\u00a0days plus 10%.",
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
      title: "“kubectl top”",
      url: "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_top/",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Node resource reservations in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/node-resource-reservations",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Use System Node Pools in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/use-system-pools",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Azure Kubernetes Service (AKS) Free, Standard, and Premium Pricing Tiers”",
      url: "https://learn.microsoft.com/en-us/azure/aks/free-standard-pricing-tiers",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Azure Kubernetes Service (AKS) cost analysis”",
      url: "https://learn.microsoft.com/en-us/azure/aks/cost-analysis",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Estimate costs with the Azure pricing calculator”",
      url: "https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/pricing-calculator",
    },
    { publisher: "AWS", title: "“Amazon EKS pricing”", url: "https://aws.amazon.com/eks/pricing/" },
  ],
  related: [
    {
      title: "Kubernetes pod right sizing: set requests from real use",
      where: "Learn",
      href: "/learn/kubernetes-pod-right-sizing",
    },
    {
      title: "AKS vs EKS cost: what each cluster bill is made of",
      where: "Learn",
      href: "/learn/aks-vs-eks-cost",
    },
    {
      title: "Kubernetes allocatable vs capacity: what pods can use",
      where: "Learn",
      href: "/learn/kubernetes-allocatable-vs-capacity",
    },
    {
      title: "How is the saving worked out?",
      where: "Coral FAQ",
      href: "/coral/faq#how-is-the-saving-worked-out",
    },
    {
      title: "How we reduced our own cluster’s machine bill by 58%",
      where: "Case study",
      href: "/case-studies/coral-dev-cluster",
    },
  ],
};
