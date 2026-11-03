import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/aks-node-auto-provisioning/1";
import { figure as figure2 } from "@/features/learn/figures/aks-node-auto-provisioning/2";
import { figure as figure3 } from "@/features/learn/figures/aks-node-auto-provisioning/3";

export const article: Article = {
  slug: "aks-node-auto-provisioning",
  title: "AKS node auto provisioning (NAP): how to enable it",
  meta: "AKS node auto provisioning (NAP) is Karpenter, run by AKS. What it needs, and how to enable or disable it with the Azure CLI or Terraform.",
  h1: "AKS node auto provisioning (NAP)",
  deck: "Karpenter, run by AKS in its control plane on the latest version, with nothing to install.",
  card: "What AKS node auto provisioning is, what it needs, and how to enable or disable it.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes autoscaling",
  published: "2026-11-01",
  updated: "2026-11-03",
  author: "saurav",
  cover: "/learn-covers/zoorik-learn-aks-node-auto-provisioning-1200x630.webp",
  coverAlt: "AKS node auto provisioning: pending pods go to the VM size that fits them",
  short: [
    "NAP picks VM sizes for pods that can’t be scheduled, and consolidates empty or underused nodes. It has been generally available since July 2025. On AKS Standard, turn it on with ",
    { code: "az aks update --node-provisioning-mode Auto" },
    " on Azure CNI Overlay or Node Subnet. It doesn’t support kubenet.",
  ],
  sections: [
    {
      id: "aks-node-auto-provisioning",
      title: "How NAP works",
      blocks: [
        {
          kind: "p",
          text: "Say three pods on an AKS cluster each request 2\u00a0CPU, and no node has room, so they stay pending. NAP reads their requests, 6\u00a0CPU in all.",
        },
        {
          kind: "p",
          text: "It picks a VM size that fits them, within the rules of the NodePool they match, and launches it.",
        },
        {
          kind: "p",
          text: [
            "When a node empties or runs underused, the NodePool’s consolidation policy decides whether NAP removes it. ",
            { a: "Karpenter consolidation", href: "/learn/karpenter-consolidation" },
            " covers those policies.",
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "h3",
          id: "what-nap-runs-and-the-objects-it",
          title: "The objects NAP uses",
        },
        {
          kind: "p",
          text: [
            "NAP is built on the ",
            { a: "open-source Karpenter project", href: "/learn/what-is-karpenter" },
            " and the AKS Karpenter provider. To read its logs, turn on AKS control plane logs.",
          ],
        },
        { kind: "p", text: "Three kinds of object do the work:" },
        {
          kind: "ul",
          items: [
            [
              { b: "NodePools" },
              " are yours to write. They set the VM sizes, capacity types and totals NAP may use.",
            ],
            [
              { b: "AKSNodeClasses" },
              " are yours too. They hold Azure settings such as the node image family and the subnet.",
            ],
            [
              { b: "NodeClaims" },
              " are NAP’s: one for each node it launches. ",
              { code: "kubectl get nodeclaims" },
              " lists them.",
            ],
          ],
        },
        {
          kind: "h3",
          id: "nap-sizes-nodes-from-requests-not-use",
          title: "Sized from requests, not use",
        },
        {
          kind: "p",
          text: [
            "Microsoft’s pre-migration checklist for NAP asks you to size workloads for consolidation. That means proper ",
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
          text: "NAP still finds room for all 6. Once they run, 6 − 1.5 = 4.5\u00a0CPU of that room sits reserved and idle: three-quarters of what they request.",
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
      title: "Status and limits",
      blocks: [
        {
          kind: "p",
          text: "Guides from before July 2025 describe the preview and can be out of date.",
        },
        {
          kind: "table",
          columns: [
            { label: "Question", width: "21%" },
            { label: "Answer, November 2026", width: "79%" },
          ],
          rows: [
            ["Status", "Generally available since July 2025"],
            [
              "AKS Automatic",
              "Preconfigured. Microsoft’s recommended default for most production workloads",
            ],
            [
              "AKS Standard",
              ["Off until you set the node provisioning mode to ", { code: "Auto" }],
            ],
            ["Azure CLI", "2.76.0 or later"],
            [
              "Networking",
              "Azure CNI Overlay or Azure CNI Node Subnet. Microsoft recommends Overlay with the Azure CNI Powered by Cilium data plane",
            ],
            [
              "Not supported",
              "kubenet, Calico network policy, Azure CNI Pod Subnet with dynamic IP allocation",
            ],
            [
              "Other limits",
              "No Windows node pools, no IPv6 clusters (dual-stack is in preview), no service principals (use a managed identity), and you can’t stop a NAP cluster",
            ],
            ["Custom virtual network", "Needs a Standard Load Balancer"],
            [
              "With the Cluster Autoscaler",
              [
                "Only under the ",
                { code: "AllowClusterAutoscalerAndNAP" },
                " feature flag, as a migration step",
              ],
            ],
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "You can’t change a NAP cluster’s egress outbound type after you create it, so choose it at creation.",
        },
      ],
    },
    {
      id: "how-to-enable-nap-on-aks-depends",
      title: "Enable NAP",
      blocks: [
        { kind: "p", text: "Check three things first:" },
        {
          kind: "ul",
          items: [
            ["the Azure CLI version, with ", { code: "az --version" }],
            "that the cluster uses a managed identity",
            "its network plugin",
          ],
        },
        {
          kind: "p",
          text: "A kubenet cluster moves its network first. A cluster on the Cluster Autoscaler or self-hosted Karpenter hands over to NAP. A cluster on Azure CNI Overlay or Node Subnet, with no other node autoscaler, takes one update.",
        },
        { kind: "svg", figure: figure3 },
        { kind: "h3", id: "new-and-existing-clusters", title: "New and existing clusters" },
        {
          kind: "p",
          text: "For a new cluster, Microsoft’s example turns NAP on with the networking it recommends:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "az aks create \\\n  --name <cluster-name> \\\n  --resource-group <resource-group> \\\n  --node-provisioning-mode Auto \\\n  --network-plugin azure \\\n  --network-plugin-mode overlay \\\n  --network-dataplane cilium \\\n  --generate-ssh-keys",
        },
        {
          kind: "p",
          text: "For an existing cluster, it’s one update:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "az aks update \\\n  --name <cluster-name> \\\n  --resource-group <resource-group> \\\n  --node-provisioning-mode Auto",
        },
        {
          kind: "p",
          text: [
            "To check that NAP is on, run ",
            { code: "kubectl get crd | grep karpenter" },
            ". It lists the NodePool and AKSNodeClass CRDs.",
          ],
        },
        {
          kind: "h3",
          id: "clusters-on-kubenet",
          title: "From kubenet",
        },
        {
          kind: "p",
          text: "NAP doesn’t run on kubenet, so move the cluster to Azure CNI Overlay first. Microsoft calls that move “a one-way, irreversible operation.” It needs:",
        },
        {
          kind: "ul",
          items: [
            "Kubernetes 1.27 or later",
            "no network policy enabled",
            "a user-assigned managed identity, so AKS can detach kubenet’s route table",
          ],
        },
        {
          kind: "p",
          text: "The move reimages every node pool at once, so plan it like a node image upgrade:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "az aks update \\\n  --name <cluster-name> \\\n  --resource-group <resource-group> \\\n  --network-plugin azure \\\n  --network-plugin-mode overlay",
        },
        {
          kind: "p",
          text: [
            "For the Cilium data plane, run a second update (",
            { code: "--network-dataplane cilium" },
            ") before you enable NAP. A cluster with NAP on can’t move to Cilium until NAP is off.",
          ],
        },
        {
          kind: "h3",
          id: "clusters-running-the-cluster-autoscaler",
          title: "From the Cluster Autoscaler",
        },
        { kind: "p", text: "Microsoft gives two paths. The simpler one has three steps:" },
        {
          kind: "ol",
          items: ["Turn the autoscaler off. Its nodes stay, so capacity holds while you switch."],
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
              "Keep the system pool, and scale your user node pools to zero in waves. NAP launches nodes for the evicted pods. Watch replica counts and ",
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
            "The other path runs both side by side under the ",
            { code: "AllowClusterAutoscalerAndNAP" },
            " feature flag, with taints keeping their nodes apart. Microsoft warns that both react to pending pods and “can lead to double provisioning of nodes,” so use it only to migrate.",
          ],
        },
        {
          kind: "h3",
          id: "clusters-running-self-hosted-karpenter",
          title: "From self-hosted Karpenter",
        },
        {
          kind: "p",
          text: "If you installed Karpenter from the AKS provider’s Helm chart, Microsoft’s steps to switch to NAP are:",
        },
        {
          kind: "ol",
          items: [
            "Upgrade to the latest Karpenter.",
            "Remove Helm’s labels and annotations from the Karpenter CRDs, so the uninstall keeps them. Deleting the CRDs deletes the NodeClaims, which can disrupt workloads.",
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
      title: "NodePools vs AKS node pools",
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
              " is a group of identical VMs you manage with the AKS API and ",
              { code: "az aks nodepool" },
              ". AKS still needs one as the system pool, for components such as CoreDNS.",
            ],
            [
              { b: "A NAP NodePool" },
              " is a Karpenter resource you apply with kubectl. NAP takes its rules from these resources: in Microsoft’s words, it “doesn’t use Azure CLI commands to manage node behavior.”",
            ],
          ],
        },
        { kind: "h3", id: "default-nodepools", title: "Default NodePools" },
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
        {
          kind: "p",
          text: "Its core settings, with Karpenter’s default consolidation policy written out:",
        },
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
            ", gives critical add-ons on-demand Linux capacity on amd64. It serves pods that tolerate the ",
            { code: "CriticalAddonsOnly=true:NoSchedule" },
            " taint.",
          ],
        },
        {
          kind: "p",
          text: [
            "With ",
            { code: "None" },
            ", NAP creates no NodePools. Write your own, since NAP needs at least one.",
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            "Microsoft’s docs disagree on switching an existing cluster from ",
            { code: "Auto" },
            " to ",
            { code: "None" },
            ". The NodePool guide says the defaults stay until you delete them. The API reference says they’re deleted and their nodes drained. Either way, have room ready first for the pods on those nodes, critical add-ons included.",
          ],
        },
        { kind: "h3", id: "your-own-nodepools", title: "Your own NodePools" },
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
              " caps the total CPU and memory a NodePool can hold. Without limits, NAP stays within your Azure quota.",
            ],
            [
              "If a NodePool allows both ",
              { a: "spot", href: "/learn/glossary/spot-instance" },
              " and on-demand, NAP prefers spot.",
            ],
            [
              "A NodePool with a ",
              { code: "replicas" },
              " field is static. It keeps that many nodes whatever the demand, takes only a ",
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
      title: "NAP in Terraform",
      blocks: [
        {
          kind: "p",
          text: [
            "In an ARM template, and in Terraform through the AzAPI provider, NAP is one property of ",
            { code: "Microsoft.ContainerService/managedClusters" },
            ": ",
            { code: "nodeProvisioningProfile" },
            ".",
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
          text: "This example uses the API version of Microsoft’s ARM template for NAP:",
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
          text: "The moves to Azure CNI Overlay and to the Cilium data plane each reimage every node pool, and AKS won’t take both in one operation. Read the plan before each apply. NAP goes last because a cluster with NAP on can’t move to Cilium.",
        },
        {
          kind: "p",
          text: "NodePools and AKSNodeClasses aren’t properties of the cluster. Apply them as Kubernetes objects once it exists.",
        },
      ],
    },
    {
      id: "how-to-disable-node-auto-provisioning-on",
      title: "Disable NAP",
      blocks: [
        {
          kind: "p",
          text: [
            "AKS turns NAP off only when no NAP nodes are left and every NodePool has ",
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
              " to every NodePool’s template. NAP moves pods to non-NAP nodes where they fit, within PodDisruptionBudgets and disruption limits.",
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
          text: [
            "Microsoft also documents a shorter route: skip steps 2 and 3, and delete each NAP node with ",
            { code: "kubectl delete node" },
            ". It advises against it, since that “might leave some pods pending and doesn’t honor Pod Disruption Budgets (PDBs).”",
          ],
        },
        {
          kind: "p",
          text: [
            "If you take it anyway, delete only nodes with the ",
            { code: "karpenter.sh/nodepool" },
            " label.",
          ],
        },
      ],
    },
    {
      id: "how-coral-works-with-nap",
      title: "Where Coral fits",
      blocks: [
        {
          kind: "p",
          text: [
            "NAP picks machines for the requests it’s given, but doesn’t change them. ",
            { a: "Coral", href: "/coral" },
            " rebalances each container’s CPU and memory requests to what it uses, on AKS and EKS with Kubernetes 1.30 or later.",
          ],
        },
        {
          kind: "p",
          text: "With smaller requests, NAP can run fewer or smaller nodes. Coral never adds nodes for demand, so scale-up stays with NAP.",
        },
        {
          kind: "p",
          text: "On our own AKS development cluster, Coral removed one of two 4-CPU workers. It then rebalanced the other onto a cheaper machine of the same size.",
        },
        {
          kind: "p",
          text: "Eight days after we connected Coral, the cluster’s machines cost $154.76 a month instead of $368.65.",
        },
        {
          kind: "p",
          text: [
            { a: "The case study", href: "/coral-value-lab" },
            " has the details. ",
            {
              a: "Coral with NAP",
              href: "/coral-works-with-aks-node-auto-provisioning",
            },
            " sets out what each does.",
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
    {
      publisher: "Karpenter",
      title: "“Disruption”",
      url: "https://karpenter.sh/docs/concepts/disruption/",
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
      title: "Karpenter vs Cluster Autoscaler",
      where: "Learn",
      href: "/learn/karpenter-vs-cluster-autoscaler",
    },
    {
      title: "How to choose AKS VM sizes",
      where: "Learn",
      href: "/learn/how-to-choose-aks-node-sizes",
    },
    {
      title: "Kubernetes autoscaling",
      where: "Learn",
      href: "/learn/kubernetes-autoscaling",
    },
  ],
};
