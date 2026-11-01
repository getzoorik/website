import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/kubernetes-cost-estimation/1";
import { figure as figure2 } from "@/features/learn/figures/kubernetes-cost-estimation/2";
import { figure as figure3 } from "@/features/learn/figures/kubernetes-cost-estimation/3";

export const article: Article = {
  slug: "kubernetes-cost-estimation",
  title: "Kubernetes cost estimation: what a cluster costs",
  meta: "Kubernetes cost estimation in six steps. Is Kubernetes free? Running it isn’t: Kubernetes pricing covers the nodes, plus the control plane, disks and network.",
  h1: "Kubernetes cost estimation: count the nodes, then price them",
  deck: "Why requests set the node count, how to price AKS and EKS, and what the free assessment reads.",
  card: "Count the nodes your requests need, price them at list, and see what the free assessment reads.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes cost basics",
  published: "2026-10-21",
  updated: "2026-11-01",
  author: "shubankar",
  cover: "/learn-covers/zoorik-learn-kubernetes-cost-estimation-1200x630.webp",
  coverAlt: "Kubernetes cost estimation: nodes times hourly price times 730 hours",
  short: [
    "Kubernetes cost estimation means pricing the machines a cluster needs, plus its control plane, disks and network. The arithmetic is short: nodes × each machine’s hourly list price × 730\u00a0hours a month. The node count is the hard part, because the scheduler fills nodes by the CPU and memory pods request, not by what they use. Estimate from measured use plus ",
    { a: "headroom", href: "/learn/glossary/kubernetes-headroom" },
    ", and the same sum shows how many nodes you could do without.",
  ],
  sections: [
    {
      id: "what-a-kubernetes-cluster-costs",
      title: "What a Kubernetes cluster costs",
      blocks: [
        {
          kind: "p",
          text: "Picture a node pool whose pods request 30\u00a0CPU in all, on 9\u00a0nodes that each have 3.5\u00a0CPU left for pods after their reservations and DaemonSets. You pay for all 9 machines for every hour they run, however little of that CPU the pods use. Nodes are the part of your cloud cost that moves with your workloads. Sized from measured use plus headroom, say to 11\u00a0CPU, those requests would fit on 4\u00a0nodes.",
        },
        { kind: "p", text: "A managed cluster’s cost has three parts:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Worker nodes." },
              " Virtual machines, charged like any other VM or EC2 instance for the time they run.",
            ],
            [
              { b: "The control plane." },
              " A fee per cluster, which depends on the ",
              { a: "tier or the version", href: "/learn/aks-vs-eks-cost" },
              ".",
            ],
            [
              { b: "The parts around them." },
              " Disks, load balancers and public IP addresses, which Microsoft lists for AKS beside its VMs, and network traffic.",
            ],
          ],
        },
      ],
    },
    {
      id: "kubernetes-cost-estimation-for-a-new-cluster",
      title: "Kubernetes cost estimation for a new cluster, in six steps",
      blocks: [
        {
          kind: "p",
          text: "Before a cluster exists, a Kubernetes cost calculator does the pricing, either the Azure pricing calculator or the AWS Pricing Calculator. Neither one knows your workloads, so the node count is yours to work out:",
        },
        {
          kind: "ol",
          items: [
            [
              { b: "Add up the requests." },
              " Multiply each workload’s CPU and memory requests by the replica count it runs most of the time, and add them up per ",
              { a: "node pool", href: "/learn/glossary/node-pool" },
              ".",
            ],
            [
              { b: "Pick a machine and use its allocatable, not its size." },
              " ",
              { a: "Allocatable", href: "/learn/kubernetes-allocatable-vs-capacity" },
              " is what’s left for pods after the node’s own reservations. In Microsoft’s example for AKS 1.29 and later, an 8\u00a0GB node that supports 30\u00a0pods reserves 0.65\u00a0GB for Kubernetes itself (kube-reserved) and 0.1\u00a0GB for the eviction threshold, which leaves 7.25\u00a0GB.",
            ],
            [
              {
                b: [
                  "Take off what your ",
                  { a: "DaemonSets", href: "/learn/glossary/daemonset" },
                  " request.",
                ],
              },
              " A DaemonSet puts a pod on every node it targets.",
            ],
            [
              { b: "Divide the requests by what’s left per node, and round up." },
              " Keep the larger of the CPU and memory counts, and check the node’s ",
              { a: "maximum pod count", href: "/learn/glossary/max-pods-per-node" },
              " too: a node can run out of pod slots before it runs out of CPU or memory.",
            ],
            [
              { b: "Leave slack." },
              " A pod can’t be split across two nodes, so a pool rarely ",
              { a: "packs to 100%", href: "/learn/kubernetes-bin-packing" },
              ". The free assessment plans for 85%.",
            ],
            [
              { b: "Price the nodes." },
              " Multiply them by the machine’s hourly price and 730\u00a0hours, then add the control plane and the parts around it.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Our ",
            { a: "EKS and AKS pricing calculator", href: "/eks-and-aks-pricing-calculator" },
            " prices a node pool at list price, and shows how much of each node your pods can use.",
          ],
        },
        { kind: "h3", id: "aks-cost-estimation", title: "AKS cost estimation" },
        {
          kind: "p",
          text: "Microsoft’s own Azure Kubernetes cost estimator is the Azure pricing calculator. It takes its per-unit prices from the Azure Retail Prices API, prices a VM for 730\u00a0hours a month unless you change it, and can show your negotiated prices once you log in.",
        },
        {
          kind: "p",
          text: "The Free tier has free cluster management and is recommended for clusters of fewer than 10\u00a0nodes. Standard and Premium carry a price of their own on the AKS pricing page and include an uptime service level agreement, which AKS cost analysis shows as a service charge.",
        },
        {
          kind: "p",
          text: "Two details change the node count. Every cluster needs a system node pool for system pods such as CoreDNS and metrics-server, and in production it needs at least two nodes (Microsoft recommends three), each with at least 4\u00a0vCPUs and 4\u00a0GB of memory. Reservations also grow with the machine, though more slowly: AKS reserves 140\u00a0millicores of CPU on a 4-core host (3.5%) and 260 on a 16-core host (1.6%).",
        },
        {
          kind: "p",
          text: [
            "To price the nodes at list price, use our ",
            { a: "AKS pricing calculator", href: "/eks-and-aks-pricing-calculator" },
            ".",
          ],
        },
        { kind: "h3", id: "eks-cost-estimation", title: "EKS cost estimation" },
        {
          kind: "p",
          text: "The Amazon EKS pricing page points to the AWS Pricing Calculator for the cluster and the rest of its architecture in one estimate. Amazon EKS charges $0.10 per cluster per hour, or $73 over a 730-hour month, while the cluster’s Kubernetes version is in standard support: the first 14\u00a0months after that version is released in Amazon EKS (same page, October 2026; prices change). Three lines are easy to leave out:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "The version fee." },
              " In the 12\u00a0months of extended support that follow, it’s $0.60 an hour, or $438 a month. A Provisioned Control Plane tier, if you choose one, adds its own hourly price on top.",
            ],
            [
              { b: [{ a: "EKS Auto Mode", href: "/learn/glossary/eks-auto-mode" }, "."] },
              " Its management fee varies with the instance type, comes on top of the EC2 price, and is charged per second with a one-minute minimum.",
            ],
            [
              { b: "Public IPv4 addresses and cross-zone traffic." },
              " Both are charged: each public IPv4 address, and traffic from nodes to the control plane across Availability Zones.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "To price the nodes at list price, use our ",
            { a: "EKS pricing calculator", href: "/eks-and-aks-pricing-calculator" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "To move a node group to a cheaper type, see ",
            {
              a: "how to change an EKS node group instance type",
              href: "/learn/change-eks-node-group-instance-type",
            },
            ".",
          ],
        },
      ],
    },
    {
      id: "why-a-running-cluster-needs-a-different",
      title: "Why a running cluster needs a different estimate",
      blocks: [
        {
          kind: "p",
          text: "Once a cluster runs, the invoice tells you what it costs, but the useful estimate is what it would cost on the nodes its workloads really need. Today’s requests decide how many nodes run, and measured use plus headroom decides how many they need. A node can be full by requests and close to idle: the Kubernetes documentation says the scheduler keeps the requests on each node within its capacity, and that even when real use on the node is very low, it “still refuses to place a Pod on a node if the capacity check fails.”",
        },
        { kind: "p", text: "Two commands show the gap:" },
        { kind: "code", lang: "bash", code: "kubectl describe node <node-name>\nkubectl top node" },
        {
          kind: "p",
          text: [
            "In the describe output, look for the node’s Allocatable figures and, under Allocated resources, the CPU and memory its pods request. ",
            { code: "kubectl top" },
            " shows recent use, but only where Metrics Server is installed and running. Say a node’s requests sit at 90% of its allocatable CPU and use at 25%. Then 75% of that CPU is paid for and used by no pod, and requests hold most of it, 65% (90 − 25), so the scheduler can’t place new pods there.",
          ],
        },
        { kind: "svg", figure: figure1 },
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
            { a: "Cost allocation", href: "/learn/glossary/kubernetes-cost-allocation" },
            " tools answer a different question. The ",
            { a: "AKS cost analysis add-on", href: "/learn/aks-cost-analysis" },
            ", built on OpenCost and available on the Standard and Premium tiers, maps cost to clusters and namespaces. Its idle charges are “the cost of available resource capacity that isn’t used by any workloads.” It doesn’t count the nodes you could do without.",
          ],
        },
        {
          kind: "p",
          text: [
            "Our library lists ",
            { a: "cloud cost management tools", href: "/cloud-cost-optimization-library" },
            " and what each one does.",
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
          text: "The saving estimate reruns the new-cluster count with measured use in place of today’s requests, then compares it with today’s nodes:",
        },
        {
          kind: "ol",
          items: [
            [
              { b: "Size each container from a week or more of use." },
              " Take a high percentile of CPU plus headroom, and the peak of memory plus headroom, because when a container goes over its memory request and its node runs short of memory, its pod is likely to be evicted. ",
              { a: "Right sizing pods", href: "/learn/kubernetes-pod-right-sizing" },
              " covers choosing the percentile and the headroom.",
            ],
            [
              { b: "Count the nodes each pool needs at those sizes." },
              " Use the same allocatable, DaemonSets, pod limit and slack as before, and stay between the pool’s autoscaler minimum and today’s count.",
            ],
            [
              { b: "Price the difference." },
              " Multiply (nodes today − nodes needed) by the machine’s hourly list price and 730. List prices leave out ",
              { a: "reservations", href: "/learn/glossary/reserved-instance" },
              ", ",
              { a: "savings plans", href: "/learn/glossary/savings-plan" },
              " and negotiated rates, so your saving in dollars can come in under the estimate.",
            ],
          ],
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "Take the opening pool: 30\u00a0CPU of requests on 9\u00a0nodes with 3.5\u00a0CPU each for pods, packed today to 95% (30 ÷ 31.5). Requests sized from measured use plus headroom come to 11\u00a0CPU. Packed to 85%, a node holds 3.5 × 0.85 = 2.975\u00a0CPU, so 11\u00a0CPU needs 11 ÷ 2.975 = 3.7\u00a0nodes, rounded up to 4. If memory and the pool’s autoscaler minimum allow 4\u00a0nodes too, 9 − 4 = 5\u00a0nodes can go: 5 × 730 = 3,650\u00a0node-hours a month, each priced at the machine’s hourly list price.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "callout",
          label: "Rule of thumb",
          text: "Price nodes, never requests: a smaller request saves nothing until a node goes.",
        },
      ],
    },
    {
      id: "what-the-free-assessment-reads-sends-and",
      title: "What the free assessment reads, sends and writes",
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
            ", and ",
            { code: "az" },
            " for AKS or ",
            { code: "aws" },
            " for EKS.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Reads." },
              " Nodes and pods with ",
              { code: "kubectl get" },
              ", plus ReplicaSets and Jobs to match each pod to its workload. With ",
              { code: "kubectl top" },
              ", it samples container use every 30\u00a0seconds for 3\u00a0minutes by default and keeps the peak, and it takes list prices from the Azure Retail Prices API and the AWS Price List.",
            ],
            [
              { b: "Doesn’t read." },
              " HorizontalPodAutoscalers (HPAs), PodDisruptionBudgets, PersistentVolumes or PersistentVolumeClaims, Secrets or ConfigMaps.",
            ],
            [
              { b: "Access." },
              " It uses the access your ",
              { code: "az" },
              " or ",
              { code: "aws" },
              " sign-in already has. Cluster credentials go into a temporary kubeconfig that’s deleted when the run ends, and your own kubeconfig is left as it is.",
            ],
            [
              { b: "Runs as a fallback." },
              " ",
              { code: "az aks command invoke" },
              ", only when kubectl can’t reach or sign in to an AKS cluster, such as a private cluster from outside its network. Azure then starts a short-lived pod in that cluster, unless you turn this off with ",
              { code: "--no-invoke" },
              ".",
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
              ", timestamped in UTC. In Cloud Shell it lands in your home folder, and elsewhere in the current folder. For a copy you can share, ",
              { code: "--anonymize" },
              " replaces namespace and workload names, and ",
              { code: "--anonymize-clusters" },
              " also replaces cluster names.",
            ],
          ],
        },
        { kind: "svg", figure: figure3 },
        {
          kind: "p",
          text: "The PDF gives three things: the estimated saving at list price, how many nodes each pool could do without and the recommended request sizes. Control-plane fees, storage, network, load balancers, Windows nodes and discounts are left out.",
        },
        {
          kind: "callout",
          label: "For engineers",
          text: "A recommended request is the peak sampled use plus headroom, and never above today’s request unless that request is zero. Nodes are counted for each pool against allocatable, less DaemonSet and static pods, for CPU, memory and pod slots. The count never drops below the pool’s autoscaler minimum or one node, and never rises above today’s count. Without Metrics Server there’s no usage reading, so requests stay as they are and only surplus nodes count.",
        },
        {
          kind: "p",
          text: [
            "Three minutes of samples can miss a daily or weekly peak, so treat the recommended requests, and the saving counted from them, as a first look. A cluster connected to ",
            { a: "Coral", href: "/coral" },
            " sizes from days of data instead.",
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
      title: "AKS vs EKS cost: what you pay for each cluster",
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
      href: "/coral-faq#how-is-the-saving-worked-out",
    },
    {
      title: "How we reduced AKS cluster costs by 58%",
      where: "Case study",
      href: "/coral-value-lab",
    },
  ],
};
