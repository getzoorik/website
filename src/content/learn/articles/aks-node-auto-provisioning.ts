import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/aks-node-auto-provisioning/1";

export const article: Article = {
  slug: "aks-node-auto-provisioning",
  title: "AKS node auto provisioning (NAP): how to enable it",
  meta: "AKS node auto provisioning (NAP) is managed Karpenter on AKS. Its October 2026 status, network needs, and how to enable or disable it with az or Terraform.",
  h1: "AKS node auto provisioning (NAP): what it is, how to enable",
  deck: "Managed Karpenter on AKS: where it stands in October 2026, what it needs, and how to turn it on and off.",
  card: "What AKS node auto provisioning is, its October 2026 status, and how to enable or disable it.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes autoscaling",
  published: "2026-11-13",
  updated: "2026-11-13",
  author: "saurav",
  short: [
    "AKS node auto provisioning (NAP) is Microsoft’s managed Karpenter for Azure Kubernetes Service. It reads the CPU and memory requests of pods that can’t be scheduled, picks VM sizes that fit them, and consolidates nodes that end up empty or underused. It has been generally available since July 2025. On AKS Standard you turn it on with ",
    { code: "az aks update --node-provisioning-mode Auto" },
    ", and the cluster must use Azure CNI Overlay or Node Subnet, not kubenet.",
  ],
  sections: [
    {
      id: "how-aks-node-auto-provisioning-uses-karpenter",
      title: "How AKS node auto provisioning uses Karpenter",
      blocks: [
        {
          kind: "p",
          text: [
            "Microsoft’s overview says NAP “automatically deploys, configures, and manages Karpenter on your AKS clusters.” It’s built on the ",
            { a: "open-source Karpenter project", href: "/learn/what-is-karpenter" },
            " and the AKS Karpenter provider. AKS runs it in the managed control plane, and you read its logs by turning on AKS control plane logs. Microsoft also says NAP is always on the latest Karpenter version.",
          ],
        },
        {
          kind: "p",
          text: [
            "Three kinds of object do the work. You write NodePool resources, which say which VM sizes, capacity types and totals NAP may use, and AKSNodeClass resources, which hold Azure settings such as the node image family and the subnet. NAP writes a NodeClaim for each node it launches, and ",
            { code: "kubectl get nodeclaims" },
            " lists them.",
          ],
        },
        {
          kind: "p",
          text: [
            "The loop starts with pods that are pending because no node has room. NAP “uses pending pod resource requirements to decide the optimal VM configuration,” within the rules of the NodePool those pods match, then launches the VM. When nodes empty out or run underused, the NodePool’s consolidation policy decides whether NAP removes them. ",
            { a: "Karpenter consolidation", href: "/learn/karpenter-consolidation" },
            " covers those policies in depth.",
          ],
        },
        { kind: "diagram", figure: figure1 },
        {
          kind: "p",
          text: "NAP sizes new nodes from what pending pods request, not from what they use. Three pods that each request 2\u00a0CPU and use 0.5 send NAP looking for room for 6\u00a0CPU, although they use 1.5. Microsoft’s pre-migration checklist for NAP asks for the same groundwork: size workloads for consolidation, and set proper requests, limits, replicas and PodDisruptionBudgets.",
        },
        {
          kind: "p",
          text: [
            "You can also run Karpenter on AKS yourself, from the AKS provider’s Helm chart. Microsoft documents the move from that self-hosted install to NAP: run the latest Karpenter first, keep the Karpenter CRDs (deleting them deletes the NodeClaims, which can disrupt workloads), uninstall the chart, then enable NAP with ",
            { code: "--node-provisioning-default-pools None" },
            " so your existing NodePools stay in charge.",
          ],
        },
      ],
    },
    {
      id: "aks-nap-status-in-october-2026",
      title: "AKS NAP status in October 2026",
      blocks: [
        {
          kind: "p",
          text: "Guides written before NAP became generally available in July 2025 can be out of date, so check their steps against the current docs. Here is where it stands on Microsoft’s own pages.",
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
          kind: "p",
          text: "One more limit is easy to miss: you can’t change the egress outbound type of a cluster after you create it with NAP, so pick it at creation.",
        },
      ],
    },
    {
      id: "how-to-enable-nap-on-aks",
      title: "How to enable NAP on AKS",
      blocks: [
        {
          kind: "p",
          text: [
            "Check three things before you run anything: the Azure CLI version (",
            { code: "az --version" },
            "), that the cluster uses a managed identity, and its network plugin. The last one decides most of the work.",
          ],
        },
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
          text: "For an existing cluster that already uses a supported Azure CNI mode and has no cluster autoscaler, it’s one update:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "az aks update \\\n  --name <cluster-name> \\\n  --resource-group <resource-group> \\\n  --node-provisioning-mode Auto",
        },
        {
          kind: "p",
          text: [
            "In an ARM template the same switch is ",
            { code: "properties.nodeProvisioningProfile.mode" },
            ", which defaults to ",
            { code: "Manual" },
            ". Once NAP is on, ",
            { code: "kubectl get crd | grep karpenter" },
            " lists the NodePool and AKSNodeClass CRDs, which is how Microsoft says to confirm that it’s active.",
          ],
        },
        { kind: "h3", id: "clusters-on-kubenet", title: "Clusters on kubenet" },
        {
          kind: "p",
          text: "NAP won’t run on kubenet, so the cluster has to move to Azure CNI Overlay first, and Microsoft calls that move “a one-way, irreversible operation.” It reimages every node pool at the same time. It also needs Kubernetes 1.27 or later, no network policy enabled, and a user-assigned managed identity, so that AKS can detach kubenet’s route table. Plan it like a node image upgrade, then run:",
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
          title: "Clusters running the cluster autoscaler",
        },
        {
          kind: "p",
          text: "Microsoft gives two paths. The simple one is to switch the autoscaler off, enable NAP, then empty your user node pools. Nodes aren’t removed when it goes off, so capacity holds while you switch:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "az aks update \\\n  --resource-group <resource-group> \\\n  --name <cluster-name> \\\n  --disable-cluster-autoscaler",
        },
        {
          kind: "p",
          text: [
            "Scaling a pool to zero evicts its pods. Scale user pools down gradually, in waves: ",
            {
              code: "az aks nodepool scale --resource-group <resource-group> --cluster-name <cluster-name> --name <pool-name> --node-count 0",
            },
            " empties a pool, and NAP launches nodes for the pods that move. Watch replicas and ",
            { a: "PodDisruptionBudgets", href: "/learn/pod-disruption-budget-best-practices" },
            " as you go, and keep the system pool. The second path runs both side by side under the ",
            { code: "AllowClusterAutoscalerAndNAP" },
            " feature flag, with taints keeping the two sets of nodes apart. Microsoft warns that both react to pending pods and “can lead to double provisioning of nodes,” so treat it as a migration step, not a permanent setup. ",
            {
              a: "Karpenter vs Cluster Autoscaler",
              href: "/learn/karpenter-vs-cluster-autoscaler",
            },
            " explains how the two remove nodes differently.",
          ],
        },
      ],
    },
    {
      id: "nap-nodepools-and-aks-node-pools",
      title: "NAP NodePools and AKS node pools",
      blocks: [
        {
          kind: "p",
          text: [
            "On a NAP cluster, “node pool” means two things. An AKS node pool is a group of identical VMs that you manage through the AKS API and ",
            { code: "az aks nodepool" },
            " commands. Your system node pool belongs to this kind, and AKS still requires one for system components such as CoreDNS. A NAP NodePool is a Karpenter custom resource you apply with kubectl, and Microsoft is plain about which one NAP reads: it “doesn’t use Azure CLI commands to manage node behavior.”",
          ],
        },
        {
          kind: "p",
          text: [
            "With ",
            { code: "--node-provisioning-default-pools Auto" },
            ", the default, NAP creates two NodePools. The one named ",
            { code: "default" },
            " allows on-demand Linux VMs on amd64 from the D family, consolidates nodes that are empty or underused, and never expires them. Microsoft documents it like this:",
          ],
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
            ", gives critical add-ons that tolerate the ",
            { code: "CriticalAddonsOnly=true:NoSchedule" },
            " taint their own on-demand capacity, on amd64\u00a0nodes. With ",
            { code: "None" },
            ", NAP creates no NodePools and you write your own, because NAP needs at least one, and switching an existing cluster from ",
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
              " caps the CPU and memory a NodePool can hold. Without limits, NAP schedules within your Azure quota.",
            ],
            "If a NodePool allows both spot and on-demand, NAP prefers spot.",
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
      title: "Node auto provisioning on AKS with Terraform",
      blocks: [
        {
          kind: "p",
          text: [
            "Microsoft’s Terraform reference for AKS covers the AzAPI provider, where the cluster resource takes the same properties as an ARM template. On ",
            { code: "Microsoft.ContainerService/managedClusters" },
            ", NAP is the ",
            { code: "nodeProvisioningProfile" },
            " property. Its ",
            { code: "mode" },
            " is ",
            { code: "Auto" },
            " or ",
            { code: "Manual" },
            " (default ",
            { code: "Manual" },
            "), and ",
            { code: "defaultNodePools" },
            " is ",
            { code: "Auto" },
            " or ",
            { code: "None" },
            " (default ",
            { code: "Auto" },
            "). Pair it with Azure CNI in ",
            { code: "networkProfile" },
            ". This example uses the API version from Microsoft’s ARM template for NAP:",
          ],
        },
        {
          kind: "code",
          lang: "hcl",
          code: 'resource "azapi_resource" "aks" {\n  type      = "Microsoft.ContainerService/managedClusters@2025-05-01"\n  name      = "<cluster-name>"\n  parent_id = "<resource-group-id>"\n  location  = "<region>"\n\n  identity {\n    type = "SystemAssigned"\n  }\n\n  body = {\n    properties = {\n      dnsPrefix = "<dns-prefix>"\n      agentPoolProfiles = [\n        {\n          name   = "system"\n          mode   = "System"\n          count  = 3\n          vmSize = "<vm-size>"\n        }\n      ]\n      networkProfile = {\n        networkPlugin     = "azure"\n        networkPluginMode = "overlay"\n        networkDataplane  = "cilium"\n      }\n      nodeProvisioningProfile = {\n        mode = "Auto"\n      }\n    }\n  }\n}',
        },
        {
          kind: "p",
          text: [
            "Read the plan before you apply a network change. The move to Azure CNI Overlay and the move to the Cilium data plane each reimage every node pool, and AKS won’t take both in one operation, so apply them separately. Make both before you set ",
            { code: 'mode = "Auto"' },
            ", because a cluster with NAP on can’t move to Cilium. NodePools and AKSNodeClasses aren’t properties of the cluster resource. They’re Kubernetes objects, applied to the cluster once it exists.",
          ],
        },
      ],
    },
    {
      id: "how-to-disable-node-auto-provisioning-on",
      title: "How to disable node auto provisioning on AKS",
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
          text: [
            "Microsoft also documents a shorter route that skips steps 2 and 3 and deletes each NAP node with ",
            { code: "kubectl delete node" },
            ", and recommends against it, because it “might leave some pods pending and doesn’t honor Pod Disruption Budgets (PDBs).” If you take it anyway, check the label above first so you delete only NAP nodes.",
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
            " optimizes Kubernetes on AKS and EKS clusters running 1.30 or later, and it works on the layer NAP leaves alone. NAP picks machines for the requests it’s given. Coral rebalances each container’s CPU and memory requests to what it uses, and drains spare nodes one at a time so your autoscaler can remove them. Scale-up stays with NAP: Coral never adds nodes for demand.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "No node autoscaler yet:" },
              " with your approval, ",
              {
                a: "connecting an AKS cluster that has none to Coral",
                href: "/coral/guide#what-connect-asks-to-change",
              },
              " turns on NAP and adds a node class named zoorik-base. Connect lists every cloud change and asks once, and ",
              { code: "--dry-run" },
              " prints them all without changing anything. NAP needs Azure CNI, so a kubenet cluster gets no autoscaler this way, and nothing adds nodes until one exists. Run ",
              { code: "zoorikctl cluster prepare" },
              " to set one up later, and if you disconnect, NAP stays.",
            ],
            [
              { b: "Pools NAP consolidates:" },
              " left to NAP. Coral deletes machines itself only in fixed-size pools that nothing else manages.",
            ],
            [
              { b: "Cheaper machines:" },
              " with NAP in place, Coral can rebalance work onto smaller or cheaper machines. It creates fixed-size NodePools named zoorik-rb-…, NAP launches the new machines, and the old nodes are drained and removed one by one. A rebalance never goes past a PodDisruptionBudget. Where Coral starts a new copy of a pod first, that copy must be Ready and serving for 5\u00a0minutes with no restarts before the old one goes. Other pods are evicted, so an app with a single copy gets a short restart. A node that can’t be emptied within 45\u00a0minutes is kept.",
            ],
            [
              { b: "Protected pods:" },
              " a pod annotated ",
              { code: 'karpenter.sh/do-not-disrupt: "true"' },
              " is never moved, and its node is kept.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "On our own AKS development cluster, Coral removed one of two 4-CPU workers, then rebalanced the remaining worker onto a cheaper machine of the same size. Eight days after we connected it, the cluster cost $154.76 a month instead of $368.65. The details are in ",
            {
              a: "How we reduced our own cluster’s machine bill by 58%",
              href: "/case-studies/coral-dev-cluster",
            },
            ". For where NAP sits beside the HPA, the VPA and the Cluster Autoscaler, see ",
            {
              a: "HPA vs VPA vs Cluster Autoscaler",
              href: "/learn/hpa-vs-vpa-vs-cluster-autoscaler",
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
      title: "HPA vs VPA vs Cluster Autoscaler: what each one scales",
      where: "Learn",
      href: "/learn/hpa-vs-vpa-vs-cluster-autoscaler",
    },
    {
      title: "What connect asks to change in your cloud",
      where: "Coral product guide",
      href: "/coral/guide#what-connect-asks-to-change",
    },
    {
      title: "Do I need Coral with Karpenter or NAP?",
      where: "Coral FAQ",
      href: "/coral/faq#do-i-need-coral-with-karpenter",
    },
  ],
};
