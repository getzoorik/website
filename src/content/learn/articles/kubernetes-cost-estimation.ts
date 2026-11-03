import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/kubernetes-cost-estimation/1";
import { figure as figure2 } from "@/features/learn/figures/kubernetes-cost-estimation/2";
import { figure as figure3 } from "@/features/learn/figures/kubernetes-cost-estimation/3";

export const article: Article = {
  slug: "kubernetes-cost-estimation",
  title: "Kubernetes cost estimation for AKS and EKS",
  meta: "How to estimate what a Kubernetes cluster costs on AKS or EKS: count the nodes your pod requests need, price them, then add the control plane and the rest.",
  h1: "Kubernetes cost estimation",
  deck: "How to price a new or running cluster on AKS or EKS, and the saving from smaller requests.",
  card: "Count the nodes your pod requests need, then price them, for a new or a running cluster.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes cost basics",
  published: "2026-10-21",
  updated: "2026-11-03",
  author: "shubankar",
  cover: "/learn-covers/zoorik-learn-kubernetes-cost-estimation-1200x630.webp",
  coverAlt: "Kubernetes cost estimation: nodes times hourly price times 730 hours",
  short: [
    "You pay for a Kubernetes cluster’s worker nodes, plus its control plane, disks, load balancers and network. The scheduler fills nodes by what pods request, not what they use, so requests set the node count. The sum is nodes × each machine’s hourly list price × 730\u00a0hours a month. Count the nodes from measured use plus ",
    { a: "headroom", href: "/learn/glossary/kubernetes-headroom" },
    ", and the same sum shows how many you could do without.",
  ],
  sections: [
    {
      id: "what-a-kubernetes-cluster-costs",
      title: "What a cluster costs",
      blocks: [
        { kind: "p", text: "A managed cluster has three costs:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Worker nodes." },
              " Virtual machines, charged like any VM or EC2 instance for every hour they run.",
            ],
            [
              { b: "The control plane." },
              " A fee per cluster, set by the ",
              { a: "tier or the version", href: "/learn/aks-vs-eks-cost" },
              ". It’s free on the AKS Free tier, and Amazon EKS charges every cluster by the hour.",
            ],
            [
              { b: "The rest." },
              " Disks, load balancers, public IP addresses and network traffic.",
            ],
          ],
        },
        {
          kind: "p",
          text: "Nodes are the cost your workloads drive. Say a pool’s pods request 30\u00a0CPU in all, on nodes with 3.5\u00a0CPU each for pods after reservations and DaemonSets. That takes 9\u00a0nodes, and you pay for all 9 every hour, however little CPU the pods use. Sized from measured use plus headroom, say to 11\u00a0CPU, the same pods fit on 4\u00a0nodes.",
        },
      ],
    },
    {
      id: "kubernetes-cost-estimation-for-a-new-cluster",
      title: "Estimate a new cluster",
      blocks: [
        {
          kind: "p",
          text: "Before a cluster exists, the Azure pricing calculator or the AWS Pricing Calculator prices it. Neither knows your workloads, so count the nodes first:",
        },
        {
          kind: "ol",
          items: [
            [
              { b: "Add up the requests." },
              " Take each workload’s CPU and memory requests times its usual replica count, per ",
              { a: "node pool", href: "/learn/glossary/node-pool" },
              ".",
            ],
            [
              { b: "Use allocatable, not machine size." },
              " ",
              { a: "Allocatable", href: "/learn/kubernetes-allocatable-vs-capacity" },
              " is what’s left for pods after the node’s reservations. In Microsoft’s example for AKS 1.29 and later, an 8\u00a0GB node that supports 30\u00a0pods reserves 0.65\u00a0GB (kube-reserved) and 0.1\u00a0GB (eviction threshold). That leaves 7.25\u00a0GB.",
            ],
            [
              {
                b: [
                  "Take off what your ",
                  { a: "DaemonSets", href: "/learn/glossary/daemonset" },
                  " request.",
                ],
              },
              " A DaemonSet runs a pod on every node it targets.",
            ],
            [
              { b: "Divide and round up." },
              " Divide the requests by what’s left per node, and keep the larger of the CPU and memory counts. Check the node’s ",
              { a: "maximum pod count", href: "/learn/glossary/max-pods-per-node" },
              " too: pod slots can run out first.",
            ],
            [
              { b: "Leave slack." },
              " A pod can’t be split across nodes, so a pool rarely ",
              { a: "packs to 100%", href: "/learn/kubernetes-bin-packing" },
              ". Plan for less, such as 85%.",
            ],
            [
              { b: "Price the nodes." },
              " Multiply them by the machine’s hourly price and 730\u00a0hours. Then add the control plane and the rest.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Our ",
            { a: "EKS and AKS pricing calculator", href: "/eks-and-aks-pricing-calculator" },
            " prices a node pool at list price and shows how much of each node your pods can use.",
          ],
        },
        { kind: "h3", id: "aks-cost-estimation", title: "On AKS" },
        {
          kind: "p",
          text: "The Azure pricing calculator takes its prices from the Azure Retail Prices API and prices a VM for 730\u00a0hours a month by default. Once you log in, it can show your negotiated prices.",
        },
        {
          kind: "p",
          text: "Microsoft recommends the Free tier for clusters of fewer than 10\u00a0nodes. Standard and Premium add their own price and an uptime SLA, which AKS cost analysis shows as a service charge.",
        },
        {
          kind: "p",
          text: "Every cluster also needs a system node pool for system pods such as CoreDNS and metrics-server. In production it needs at least two nodes (Microsoft recommends three), each with at least 4\u00a0vCPUs and 4\u00a0GB of memory.",
        },
        {
          kind: "p",
          text: "Reservations grow with the machine, but more slowly. AKS reserves 140\u00a0millicores of CPU on a 4-core host (3.5%) and 260 on a 16-core host (1.6%).",
        },
        { kind: "h3", id: "eks-cost-estimation", title: "On EKS" },
        {
          kind: "p",
          text: "The Amazon EKS pricing page points to the AWS Pricing Calculator for the cluster and the rest of its architecture. At AWS’s November 2026 prices, EKS charges $0.10 per cluster per hour, or $73 over a 730-hour month. That holds while the cluster’s Kubernetes version is in standard support: its first 14\u00a0months in Amazon EKS. Three more charges are easy to miss:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Higher control-plane fees." },
              " In the 12\u00a0months of extended support that follow, the fee is $0.60 an hour, or $438 a month. A Provisioned Control Plane tier, if you choose one, adds its own hourly price on top.",
            ],
            [
              { b: [{ a: "EKS Auto Mode", href: "/learn/glossary/eks-auto-mode" }, "."] },
              " A management fee on top of the EC2 price. It varies with the instance type and is charged per second, with a one-minute minimum.",
            ],
            [
              { b: "Public IPv4 and cross-zone traffic." },
              " Each public IPv4 address is charged, and so is traffic from nodes to the control plane across Availability Zones.",
            ],
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
      title: "Estimate a running cluster",
      blocks: [
        {
          kind: "p",
          text: "Once a cluster runs, the invoice gives its cost. The useful estimate is what it would cost on the nodes its workloads really need.",
        },
        {
          kind: "p",
          text: "A node can be full by requests and close to idle. The Kubernetes docs say the scheduler keeps each node’s requests within its capacity. Even when real use is very low, it “still refuses to place a Pod on a node if the capacity check fails.”",
        },
        { kind: "p", text: "Two commands show the gap:" },
        { kind: "code", lang: "bash", code: "kubectl describe node <node-name>\nkubectl top node" },
        {
          kind: "p",
          text: [
            "In the describe output, compare the node’s Allocatable figures with the CPU and memory its pods request, under Allocated resources. ",
            { code: "kubectl top" },
            " shows recent use, if Metrics Server is installed and running.",
          ],
        },
        {
          kind: "p",
          text: "Say a node’s requests are 90% of its allocatable CPU and its use is 25%. Then 75% of that CPU is paid for and unused. Requests hold 65% of it (90 − 25), so no new pod can have it.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: [
            { code: "kubectl top" },
            " is a reading of the moment. An estimate you’ll act on needs at least a week of history from Prometheus or another metrics store, so it sees your weekly peak.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Cost allocation", href: "/learn/glossary/kubernetes-cost-allocation" },
            " tools answer a different question. The ",
            { a: "AKS cost analysis add-on", href: "/learn/aks-cost-analysis" },
            ", built on OpenCost for Standard and Premium clusters, maps cost to clusters and namespaces. Its idle charges are “the cost of available resource capacity that isn’t used by any workloads.” It doesn’t count the nodes you could do without.",
          ],
        },
        {
          kind: "p",
          text: [
            "Our library lists other ",
            { a: "cloud cost management tools", href: "/cloud-cost-optimization-library" },
            " and what each one does.",
          ],
        },
      ],
    },
    {
      id: "how-to-estimate-the-saving-from-smaller",
      title: "Estimate the saving",
      blocks: [
        {
          kind: "p",
          text: "Rerun the node count with measured use in place of today’s requests, then compare it with today’s nodes:",
        },
        {
          kind: "ol",
          items: [
            [
              { b: "Size each container from a week or more of use." },
              " For CPU, take a high percentile plus headroom. For memory, take the peak plus headroom. A container over its memory request is likely to have its pod evicted when its node runs short of memory. ",
              { a: "Right sizing pods", href: "/learn/kubernetes-pod-right-sizing" },
              " covers the percentile and the headroom.",
            ],
            [
              { b: "Count the nodes each pool needs." },
              " Use the same allocatable, DaemonSets, pod limit and slack as before. Stay between the pool’s autoscaler minimum and today’s count.",
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
          text: "Take the pool above: 30\u00a0CPU of requests on 9\u00a0nodes with 3.5\u00a0CPU each for pods, packed to 95% (30 ÷ 31.5). Sized from measured use plus headroom, the requests come to 11\u00a0CPU. Packed to 85%, a node holds 3.5 × 0.85 = 2.975\u00a0CPU. So 11\u00a0CPU needs 11 ÷ 2.975 = 3.7\u00a0nodes, rounded up to 4. If memory and the autoscaler minimum allow 4\u00a0nodes too, 5\u00a0nodes can go. That’s 5 × 730 = 3,650\u00a0node-hours a month at the machine’s hourly list price.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "callout",
          label: "Rule of thumb",
          text: "Price nodes, not requests: a smaller request saves nothing until a node goes.",
        },
      ],
    },
    {
      id: "what-the-free-assessment-reads-sends-and",
      title: "The free assessment",
      blocks: [
        {
          kind: "p",
          text: [
            "Zoorik’s ",
            { a: "free assessment", href: "/assessment?p=coral" },
            " runs a version of this estimate on your own clusters and writes one PDF. Sign in with the ",
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
            "It prices AKS and EKS clusters. Any other cluster kubectl can reach is assessed but not priced. Outside a Cloud Shell it needs Python 3.8 or later, ",
            { code: "npx" },
            ", ",
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
              ", plus ReplicaSets and Jobs to match each pod to its workload. Container use with ",
              { code: "kubectl top" },
              ", for 3\u00a0minutes by default, keeping the peak. List prices from the Azure Retail Prices API and the AWS Price List.",
            ],
            [
              { b: "Doesn’t read." },
              " HorizontalPodAutoscalers (HPAs), PodDisruptionBudgets, PersistentVolumes or PersistentVolumeClaims, Secrets or ConfigMaps.",
            ],
            [
              { b: "Access." },
              " Only what your ",
              { code: "az" },
              " or ",
              { code: "aws" },
              " sign-in already has. Cluster credentials go into a temporary kubeconfig, deleted when the run ends. Your own kubeconfig is left as it is.",
            ],
            [
              { b: "Fallback." },
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
              ", it downloads the zoorik package from npm and PyPI.",
            ],
            [
              { b: "Writes." },
              " One PDF, ",
              { code: "zoorik-coral-assessment-YYYYMMDD-HHMM.pdf" },
              ", timestamped in UTC. It lands in your home folder in Cloud Shell, and in the current folder elsewhere. For a copy to share, ",
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
          text: "The PDF gives the estimated saving at list price, the nodes each pool could do without and the recommended request sizes. It leaves out control-plane fees, storage, network, load balancers, Windows nodes and discounts.",
        },
        {
          kind: "callout",
          label: "For engineers",
          text: "Per pool, it counts nodes against allocatable less DaemonSet and static pods, for CPU, memory and pod slots. The count stays between the autoscaler minimum, or one node, and today’s count. A recommended request is the peak sampled use plus headroom, never above today’s request unless that is zero. Without Metrics Server, requests stay as they are and only surplus nodes count.",
        },
        {
          kind: "p",
          text: [
            "Three minutes of samples can miss a daily or weekly peak, so treat the result as a first look. A cluster connected to ",
            { a: "Coral", href: "/coral" },
            " sizes from days of data.",
          ],
        },
      ],
    },
  ],
  help: {
    product: "coral",
    text: "Coral rebalances CPU and memory requests on AKS and EKS, works with your HPA, and removes the nodes you don’t need, without any downtime. We estimate it reduces AKS and EKS cost by 40–50%, a range rather than a promise. The free assessment works out your own figure.",
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
      publisher: "Kubernetes",
      title: "“DaemonSet”",
      url: "https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/",
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
      title: "Kubernetes requests vs limits",
      where: "Learn",
      href: "/learn/kubernetes-pod-right-sizing",
    },
    {
      title: "AKS vs EKS cost",
      where: "Learn",
      href: "/learn/aks-vs-eks-cost",
    },
    {
      title: "Kubernetes allocatable vs capacity",
      where: "Learn",
      href: "/learn/kubernetes-allocatable-vs-capacity",
    },
    {
      title: "How is the saving worked out?",
      where: "Coral FAQ",
      href: "/coral-faq#how-is-the-saving-worked-out",
    },
    {
      title: "How we reduced our own AKS cluster’s machine cost by 58%",
      where: "Coral Value Lab",
      href: "/coral-value-lab",
    },
  ],
  relatedTitle: "More on Kubernetes cost",
};
