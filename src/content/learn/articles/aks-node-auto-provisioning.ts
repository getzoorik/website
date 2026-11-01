import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/aks-node-auto-provisioning/1";
import { figure as figure2 } from "@/features/learn/figures/aks-node-auto-provisioning/2";
import { figure as figure3 } from "@/features/learn/figures/aks-node-auto-provisioning/3";

export const article: Article = {
  slug: "aks-node-auto-provisioning",
  title: "Karpenter on Azure: AKS node auto provisioning",
  meta: "Karpenter on Azure is AKS node auto provisioning (NAP). Its October 2026 status, network needs, and how to enable or disable it with az or Terraform.",
  h1: "Karpenter on Azure: AKS node auto provisioning (NAP) and how to enable it",
  deck: "Karpenter on Azure, run by AKS for you: where it stands in October 2026, what it needs, and how to turn it on and off.",
  card: "What AKS node auto provisioning is, its October 2026 status, and how to enable or disable it.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes autoscaling",
  published: "2026-11-01",
  updated: "2026-11-01",
  author: "saurav",
  cover: "/learn-covers/zoorik-learn-aks-node-auto-provisioning-1200x630.webp",
  coverAlt: "AKS node auto provisioning: pending pods go to the VM size that fits",
  short: [
    "AKS node auto provisioning (NAP) is Microsoft’s managed Karpenter: it picks VM sizes for pods that can’t be scheduled, and consolidates empty or underused nodes. On AKS Standard, enable it with ",
    { code: "az aks update --node-provisioning-mode Auto" },
    " on a cluster using Azure CNI Overlay or Node Subnet, not kubenet.",
  ],
  sections: [
    {
      id: "aks-node-auto-provisioning",
      title: "AKS node auto provisioning is Karpenter that AKS runs for you",
      blocks: [
        {
          kind: "p",
          text: "Picture three pods on an AKS cluster with NAP on, each requesting 2\u00a0CPU. No node has room for them, so they stay pending. NAP reads their requests, 6\u00a0CPU in all.",
        },
        {
          kind: "p",
          text: "It “uses pending pod resource requirements to decide the optimal VM configuration,” within the rules of the NodePool those pods match. Then it launches the VM.",
        },
        {
          kind: "p",
          text: [
            "When nodes empty out or run underused, the NodePool’s consolidation policy decides whether NAP removes them. ",
            { a: "Karpenter consolidation", href: "/learn/karpenter-consolidation" },
            " covers those policies in depth.",
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "h3",
          id: "what-nap-runs-and-the-objects-it",
          title: "What NAP runs, and the objects it uses",
        },
        {
          kind: "p",
          text: "Microsoft’s overview says NAP “automatically deploys, configures, and manages Karpenter on your AKS clusters.”",
        },
        {
          kind: "p",
          text: [
            "It’s built on the ",
            { a: "open-source Karpenter project", href: "/learn/what-is-karpenter" },
            " and the AKS Karpenter provider. AKS runs it in the managed control plane, and Microsoft says it’s always on the latest Karpenter version. To read its logs, turn on AKS control plane logs.",
          ],
        },
        { kind: "p", text: "Three kinds of object do the work:" },
        {
          kind: "ul",
          items: [
            [
              { b: "NodePool" },
              " resources are yours to write. They say which VM sizes, capacity types and totals NAP may use.",
            ],
            [
              { b: "AKSNodeClass" },
              " resources, also yours, hold Azure settings such as the node image family and the subnet.",
            ],
            [
              { b: "NodeClaims" },
              " come from NAP, which writes one for each node it launches. ",
              { code: "kubectl get nodeclaims" },
              " lists them.",
            ],
          ],
        },
        {
          kind: "h3",
          id: "nap-sizes-nodes-from-requests-not-use",
          title: "NAP sizes nodes from requests, not use",
        },
        {
          kind: "p",
          text: [
            "NAP sizes new nodes from what pending pods request, not from what they use. Microsoft’s pre-migration checklist for NAP asks you to size workloads for consolidation. It also asks for proper ",
            { a: "requests", href: "/learn/glossary/kubernetes-resource-requests" },
            ", limits, replicas and PodDisruptionBudgets.",
          ],
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "Say the three pods each use 0.5\u00a0CPU. They request 3 × 2 = 6\u00a0CPU and use 3 × 0.5 = 1.5\u00a0CPU.",
        },
        {
          kind: "p",
          text: "NAP still looks for room for all 6. Once they run, 6 − 1.5 = 4.5\u00a0CPU of that room is reserved and idle. That’s 4.5 ÷ 6, or three-quarters of what they request.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: [
            "With NAP, requests decide which nodes you pay for, so ",
            { a: "Kubernetes cost optimization", href: "/kubernetes-cost-optimization" },
            " starts with requests. The ",
            { a: "EKS and AKS pricing calculator", href: "/eks-and-aks-pricing-calculator" },
            " shows what a VM size costs a month.",
          ],
        },
      ],
    },
    {
      id: "aks-nap-status-in-october-2026-generally",
      title: "AKS NAP status in October 2026: generally available, with limits",
      blocks: [
        {
          kind: "p",
          text: "Guides written before NAP became generally available in July 2025 can be out of date. This is where NAP stands on Microsoft’s own pages:",
        },
        {
          kind: "table",
          columns: [
            { label: "Question", width: "21%" },
            { label: "Answer, October 2026", width: "79%" },
          ],
          rows: [
            ["Status", "Generally available since July 2025"],
            ["AKS Automatic", "Preconfigured by default"],
            [
              "AKS Standard",
              ["Off until you set the node provisioning mode to ", { code: "Auto" }],
            ],
            ["Azure CLI", "2.76.0 or later"],
            [
              "Supported networking",
              "Azure CNI Overlay or Azure CNI Node Subnet. Microsoft recommends Overlay with the Azure CNI Powered by Cilium data plane",
            ],
            [
              "Not supported",
              "kubenet, Calico network policy, Azure CNI Pod Subnet with dynamic IP allocation",
            ],
            [
              "Other limits",
              "No Windows node pools, no IPv6 clusters, no service principals (use a managed identity), and you can’t stop a NAP cluster",
            ],
            ["Custom virtual network", "Needs a Standard Load Balancer"],
            [
              "Cluster autoscaler on the same cluster",
              [
                "Only with the ",
                { code: "AllowClusterAutoscalerAndNAP" },
                " feature flag, as a migration step",
              ],
            ],
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "One more limit is easy to miss. You can’t change the egress outbound type of a cluster created with NAP, so pick it at creation.",
        },
      ],
    },
    {
      id: "how-to-enable-nap-on-aks-depends",
      title: "How to enable NAP on AKS depends on where your cluster starts",
      blocks: [
        { kind: "p", text: "Check three things before you run anything:" },
        {
          kind: "ul",
          items: [
            ["the Azure CLI version, with ", { code: "az --version" }],
            "that the cluster uses a managed identity",
            "its network plugin",
          ],
        },
        { kind: "p", text: "The plugin and whatever scales your nodes today then set the path:" },
        {
          kind: "ul",
          items: [
            "A kubenet cluster needs a network move first.",
            "A cluster autoscaler hands over to NAP.",
            "A self-hosted Karpenter install makes way for it.",
          ],
        },
        { kind: "p", text: "Otherwise, enabling NAP takes one update." },
        { kind: "svg", figure: figure3 },
        { kind: "h3", id: "new-and-existing-clusters", title: "New and existing clusters" },
        {
          kind: "p",
          text: "For a new cluster, Microsoft’s example turns NAP on at creation, with the networking it recommends:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "az aks create \\\n  --name <cluster-name> \\\n  --resource-group <resource-group> \\\n  --node-provisioning-mode Auto \\\n  --network-plugin azure \\\n  --network-plugin-mode overlay \\\n  --network-dataplane cilium \\\n  --generate-ssh-keys",
        },
        {
          kind: "p",
          text: "For an existing cluster on a supported Azure CNI mode with no cluster autoscaler, it’s one update:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "az aks update \\\n  --name <cluster-name> \\\n  --resource-group <resource-group> \\\n  --node-provisioning-mode Auto",
        },
        {
          kind: "p",
          text: [
            "To confirm that NAP is active, Microsoft’s check is ",
            { code: "kubectl get crd | grep karpenter" },
            ". Once NAP is on, it lists the NodePool and AKSNodeClass CRDs. In an ARM template the same switch is ",
            { code: "properties.nodeProvisioningProfile.mode" },
            ", which defaults to ",
            { code: "Manual" },
            ".",
          ],
        },
        {
          kind: "h3",
          id: "clusters-on-kubenet",
          title: "Clusters on kubenet: NAP needs Azure CNI Overlay first",
        },
        {
          kind: "p",
          text: "NAP won’t run on kubenet, so the cluster has to move to Azure CNI Overlay first. Microsoft calls that move “a one-way, irreversible operation.” It needs:",
        },
        {
          kind: "ul",
          items: [
            "Kubernetes 1.27 or later",
            "no network policy enabled",
            "a user-assigned managed identity, so that AKS can detach kubenet’s route table",
          ],
        },
        {
          kind: "p",
          text: "The move reimages every node pool at the same time, so plan it like a node image upgrade. Then run:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "az aks update \\\n  --name <cluster-name> \\\n  --resource-group <resource-group> \\\n  --network-plugin azure \\\n  --network-plugin-mode overlay",
        },
        {
          kind: "p",
          text: [
            "If you also want the Cilium data plane, add it as a second update (",
            { code: "--network-dataplane cilium" },
            ") before you enable NAP. Microsoft notes that a cluster with NAP on can’t be updated to Cilium without turning NAP off first.",
          ],
        },
        {
          kind: "h3",
          id: "clusters-running-the-cluster-autoscaler",
          title: "Clusters running the cluster autoscaler: migrate to NAP",
        },
        { kind: "p", text: "Microsoft gives two paths. The simple one takes three steps:" },
        {
          kind: "ol",
          items: [
            "Switch the autoscaler off. Nodes aren’t removed when it goes off, so capacity holds while you switch.",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "az aks update \\\n  --resource-group <resource-group> \\\n  --name <cluster-name> \\\n  --disable-cluster-autoscaler",
        },
        {
          kind: "ol",
          start: 2,
          items: [
            ["Turn NAP on with the ", { code: "az aks update" }, " command above."],
            [
              "Keep the system pool, and empty your user node pools gradually, in waves. Scaling a pool to zero evicts its pods, and NAP launches nodes for the pods that move. Watch replica counts and ",
              { a: "PodDisruptionBudgets", href: "/learn/pod-disruption-budget-best-practices" },
              " as you go.",
            ],
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "az aks nodepool scale \\\n  --resource-group <resource-group> \\\n  --cluster-name <cluster-name> \\\n  --name <pool-name> \\\n  --node-count 0",
        },
        {
          kind: "p",
          text: [
            "The second path runs both side by side under the ",
            { code: "AllowClusterAutoscalerAndNAP" },
            " feature flag. Taints keep the two sets of nodes apart. Microsoft warns that both react to pending pods and “can lead to double provisioning of nodes,” so treat it only as a migration step.",
          ],
        },
        {
          kind: "p",
          text: [
            {
              a: "Karpenter vs Cluster Autoscaler",
              href: "/learn/karpenter-vs-cluster-autoscaler",
            },
            " explains how the two remove nodes differently.",
          ],
        },
        {
          kind: "h3",
          id: "clusters-running-self-hosted-karpenter",
          title: "Clusters running self-hosted Karpenter on AKS",
        },
        {
          kind: "p",
          text: "If you run Karpenter on AKS yourself, from the AKS provider’s Helm chart, Microsoft documents how to switch to NAP:",
        },
        {
          kind: "ol",
          items: [
            "Run the latest Karpenter first.",
            "Keep the Karpenter CRDs. Deleting them deletes the NodeClaims, which can disrupt workloads.",
            "Uninstall the chart.",
            [
              "Enable NAP with ",
              { code: "--node-provisioning-default-pools None" },
              ", so your existing NodePools stay in charge.",
            ],
          ],
        },
      ],
    },
    {
      id: "nap-nodepools-are-separate-from-aks-node",
      title: "NAP NodePools are separate from AKS node pools",
      blocks: [
        {
          kind: "p",
          text: [
            "On a NAP cluster, “",
            { a: "node pool", href: "/learn/glossary/node-pool" },
            "” means two things:",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "An AKS node pool" },
              " is a group of identical VMs that you manage through the AKS API and ",
              { code: "az aks nodepool" },
              " commands. Your system node pool belongs to this kind, and AKS still requires one for system components such as CoreDNS.",
            ],
            [
              { b: "A NAP NodePool" },
              " is a Karpenter custom resource you apply with kubectl. Microsoft is plain about which of the two NAP reads: it “doesn’t use Azure CLI commands to manage node behavior.”",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "With ",
            { code: "--node-provisioning-default-pools Auto" },
            ", the default, NAP creates two NodePools. The one named ",
            { code: "default" },
            ":",
          ],
        },
        {
          kind: "ul",
          items: [
            "allows on-demand Linux VMs on amd64 from the D family",
            "consolidates nodes that are empty or underused",
            "never expires them",
          ],
        },
        { kind: "p", text: "Microsoft documents it like this:" },
        {
          kind: "code",
          lang: "yaml",
          code: "apiVersion: karpenter.sh/v1\nkind: NodePool\nmetadata:\n  name: default\nspec:\n  disruption:\n    consolidationPolicy: WhenEmptyOrUnderutilized\n  template:\n    spec:\n      nodeClassRef:\n        group: karpenter.azure.com\n        kind: AKSNodeClass\n        name: default\n      expireAfter: Never\n      requirements:\n      - key: kubernetes.io/arch\n        operator: In\n        values:\n        - amd64\n      - key: kubernetes.io/os\n        operator: In\n        values:\n        - linux\n      - key: karpenter.sh/capacity-type\n        operator: In\n        values:\n        - on-demand\n      - key: karpenter.azure.com/sku-family\n        operator: In\n        values:\n        - D",
        },
        {
          kind: "p",
          text: [
            "The second, ",
            { code: "system-surge" },
            ", gives critical add-ons their own on-demand capacity on amd64\u00a0nodes. It’s for add-ons that tolerate the ",
            { code: "CriticalAddonsOnly=true:NoSchedule" },
            " taint.",
          ],
        },
        {
          kind: "p",
          text: [
            "With ",
            { code: "None" },
            ", NAP creates no NodePools, so you write your own: NAP needs at least one. Switching an existing cluster from ",
            { code: "Auto" },
            " to ",
            { code: "None" },
            " leaves the defaults in place until you delete them.",
          ],
        },
        { kind: "p", text: "A few rules shape your own NodePools:" },
        {
          kind: "ul",
          items: [
            [
              "Keep their requirements from overlapping. When more than one matches a pod, NAP uses the one with the highest ",
              { code: "weight" },
              ", from 1 to 100.",
            ],
            [
              { code: "spec.limits" },
              " caps the memory and CPU a NodePool can hold. Without limits, NAP schedules within your Azure quota.",
            ],
            [
              "If a NodePool allows both ",
              { a: "spot", href: "/learn/glossary/spot-instance" },
              " and on-demand, NAP prefers spot.",
            ],
            [
              "A NodePool with a ",
              { code: "replicas" },
              " field is a static pool. It keeps that many nodes whatever the demand, takes only a ",
              { code: "nodes" },
              " limit, and isn’t consolidated.",
            ],
            [
              "Selectors such as ",
              { code: "karpenter.azure.com/sku-family" },
              ", ",
              { code: "karpenter.azure.com/sku-name" },
              " and ",
              { code: "topology.kubernetes.io/zone" },
              " narrow the VM sizes and zones NAP may pick.",
            ],
          ],
        },
      ],
    },
    {
      id: "node-auto-provisioning-on-aks-with-terraform",
      title: "Node auto provisioning on AKS with Terraform is one cluster property",
      blocks: [
        {
          kind: "p",
          text: [
            "Microsoft’s Terraform reference for AKS covers the AzAPI provider. There, the cluster resource takes the same properties as an ARM template. On ",
            { code: "Microsoft.ContainerService/managedClusters" },
            ", NAP is the ",
            { code: "nodeProvisioningProfile" },
            " property.",
          ],
        },
        {
          kind: "p",
          text: [
            "Its ",
            { code: "mode" },
            " is ",
            { code: "Auto" },
            " or ",
            { code: "Manual" },
            ", and defaults to ",
            { code: "Manual" },
            ". Its ",
            { code: "defaultNodePools" },
            " is ",
            { code: "Auto" },
            " or ",
            { code: "None" },
            ", and defaults to ",
            { code: "Auto" },
            ". Pair it with Azure CNI in ",
            { code: "networkProfile" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "This example uses the API version from Microsoft’s ARM template for NAP:",
        },
        {
          kind: "code",
          lang: "hcl",
          code: 'resource "azapi_resource" "aks" {\n  type      = "Microsoft.ContainerService/managedClusters@2025-05-01"\n  name      = "<cluster-name>"\n  parent_id = "<resource-group-id>"\n  location  = "<region>"\n\n  identity {\n    type = "SystemAssigned"\n  }\n\n  body = {\n    properties = {\n      dnsPrefix = "<dns-prefix>"\n      agentPoolProfiles = [\n        {\n          name   = "system"\n          mode   = "System"\n          count  = 3\n          vmSize = "<vm-size>"\n        }\n      ]\n      networkProfile = {\n        networkPlugin     = "azure"\n        networkPluginMode = "overlay"\n        networkDataplane  = "cilium"\n      }\n      nodeProvisioningProfile = {\n        mode = "Auto"\n      }\n    }\n  }\n}',
        },
        {
          kind: "callout",
          label: "Rule of thumb",
          text: [
            "Change the network first, one move per apply, and set ",
            { code: 'mode = "Auto"' },
            " last.",
          ],
        },
        {
          kind: "p",
          text: "The moves to Azure CNI Overlay and to the Cilium data plane each reimage every node pool. AKS won’t take both in one operation, so read the plan before each apply. NAP goes last because a cluster with NAP on can’t move to Cilium.",
        },
        {
          kind: "p",
          text: "NodePools and AKSNodeClasses aren’t properties of that resource: they’re Kubernetes objects, applied to the cluster once it exists.",
        },
      ],
    },
    {
      id: "how-to-disable-node-auto-provisioning-on",
      title: "How to disable node auto provisioning on AKS: empty NAP’s nodes first",
      blocks: [
        {
          kind: "p",
          text: [
            "AKS lets you turn NAP off only when no NAP nodes are left and every NodePool has ",
            { code: "spec.limits.cpu" },
            " set to ",
            { code: "0" },
            ". Microsoft’s order:",
          ],
        },
        {
          kind: "ol",
          items: [
            [
              "Set ",
              { code: "spec.limits.cpu: 0" },
              " on every NodePool. NAP stops creating nodes, and running ones stay.",
            ],
            [
              "Add a taint with key ",
              { code: "karpenter.azure.com/disable" },
              " and effect ",
              { code: "NoSchedule" },
              " to every NodePool’s template. NAP starts moving pods to non-NAP nodes where they fit, within PodDisruptionBudgets and disruption limits.",
            ],
            "Scale up your fixed-size AKS node pools, or add new ones, so those pods have somewhere to go.",
            [
              "Run ",
              { code: "kubectl get nodes -l karpenter.sh/nodepool" },
              " until it returns no nodes. If some remain, the cluster likely lacks fixed-size capacity, so add more.",
            ],
            [
              "Switch the mode back: ",
              {
                code: "az aks update --name <cluster-name> --resource-group <resource-group> --node-provisioning-mode Manual",
              },
              ".",
            ],
          ],
        },
        {
          kind: "p",
          text: "Microsoft also documents a shorter route, and recommends against it. That route “might leave some pods pending and doesn’t honor Pod Disruption Budgets (PDBs).”",
        },
        {
          kind: "p",
          text: [
            "It skips steps 2 and 3 and deletes each NAP node with ",
            { code: "kubectl delete node" },
            ". If you take it anyway, check the label above first, so you delete only NAP nodes.",
          ],
        },
      ],
    },
    {
      id: "how-coral-works-with-nap",
      title: "How Coral works with NAP",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " optimizes Kubernetes on AKS and EKS clusters running 1.30 or later. NAP picks machines for the requests it’s given, but doesn’t change those requests.",
          ],
        },
        {
          kind: "p",
          text: "Coral rebalances each container’s CPU and memory requests to what it uses. With smaller requests, NAP can run fewer or smaller nodes. Coral never adds nodes for demand, so scale-up stays with NAP.",
        },
        {
          kind: "p",
          text: "On our own AKS development cluster, Coral removed one of two 4-CPU workers. It then rebalanced the remaining worker onto a cheaper machine of the same size. Eight days after we connected it, the cluster’s machines cost $154.76 a month instead of $368.65.",
        },
        {
          kind: "p",
          text: [
            { a: "How we reduced AKS cluster costs by 58%", href: "/coral-value-lab" },
            " has the details. For a side-by-side view, see ",
            {
              a: "what Coral and NAP each do",
              href: "/coral-works-with-aks-node-auto-provisioning",
            },
            ". For where NAP sits beside the HPA, the VPA and the Cluster Autoscaler, see ",
            {
              a: "Kubernetes autoscaling",
              href: "/learn/kubernetes-autoscaling",
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
      publisher: "Microsoft Learn",
      title: "“Overview of node auto-provisioning (NAP) in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/node-auto-provisioning",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Enable or disable node auto-provisioning (NAP) in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/use-node-auto-provisioning",
    },
    {
      publisher: "Microsoft Learn",
      title:
        "“Overview of networking configurations for node auto-provisioning (NAP) in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/node-auto-provisioning-networking",
    },
    {
      publisher: "Microsoft Learn",
      title:
        "“Configure node pools for node auto-provisioning (NAP) in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/node-auto-provisioning-node-pools",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Migrate from cluster autoscaler to node auto-provisioning”",
      url: "https://learn.microsoft.com/en-us/azure/aks/migrate-from-autoscaler-to-node-auto-provisioning",
    },
    {
      publisher: "Microsoft Learn",
      title:
        "“Update Azure CNI IP address management (IPAM) mode and data plane technology for AKS clusters”",
      url: "https://learn.microsoft.com/en-us/azure/aks/update-azure-cni",
    },
    {
      publisher: "Azure Updates",
      title: "“Generally Available: Node auto-provisioning support in AKS”",
      url: "https://azure.microsoft.com/en-us/updates?id=498247",
    },
    {
      publisher: "Microsoft Learn",
      title:
        "“Microsoft.ContainerService/managedClusters 2025-05-01 - Bicep, ARM template & Terraform AzAPI reference”",
      url: "https://learn.microsoft.com/en-us/azure/templates/microsoft.containerservice/2025-05-01/managedclusters?pivots=deployment-language-terraform",
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
      title: "Karpenter vs Cluster Autoscaler: how each removes nodes",
      where: "Learn",
      href: "/learn/karpenter-vs-cluster-autoscaler",
    },
    {
      title: "How to choose AKS VM sizes",
      where: "Learn",
      href: "/learn/how-to-choose-aks-node-sizes",
    },
    {
      title: "Kubernetes autoscaling: HPA and Cluster Autoscaler",
      where: "Learn",
      href: "/learn/kubernetes-autoscaling",
    },
  ],
};
