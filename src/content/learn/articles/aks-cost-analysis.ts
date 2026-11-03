import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/aks-cost-analysis/1";
import { figure as figure2 } from "@/features/learn/figures/aks-cost-analysis/2";

export const article: Article = {
  slug: "aks-cost-analysis",
  title: "AKS cost analysis: how to enable and read it",
  meta: "AKS cost analysis shows an AKS cluster’s cost by namespace and asset. How to enable the add-on, read its idle and system charges, and what it leaves out.",
  h1: "AKS cost analysis",
  deck: "How to enable the add-on, read its charges, and find the requests its views don’t show.",
  card: "Enable the AKS cost analysis add-on, read its charges, and see what its views leave out.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes cost basics",
  published: "2026-11-01",
  updated: "2026-11-03",
  author: "anuragee",
  cover: "/learn-covers/zoorik-learn-aks-cost-analysis-1200x630.webp",
  coverAlt:
    "AKS cost analysis: cost by namespace and Idle, with a namespace’s unused requests hidden in the totals",
  short: [
    "AKS cost analysis is an Azure Kubernetes Service (AKS) add-on that shows a cluster’s cost by namespace and asset in Microsoft Cost Management. It needs the Standard or Premium tier and an Enterprise Agreement or Microsoft Customer Agreement. Turn it on with the ",
    { code: "--enable-cost-analysis" },
    " flag of ",
    { code: "az aks update" },
    ". It only reports: it changes no request and removes no node.",
  ],
  sections: [
    {
      id: "aks-cost-analysis",
      title: "What the add-on shows",
      blocks: [
        {
          kind: "p",
          text: "An AKS invoice lists the Azure resources a cluster runs on: virtual machines, managed disks, load balancers and public IP addresses. It doesn’t say which team’s namespace a node is paying for, or what one application costs across several clusters.",
        },
        {
          kind: "p",
          text: [
            "The add-on fills that gap. When you enable it, AKS runs the ",
            { code: "cost-analysis-agent" },
            " pod in ",
            { code: "kube-system" },
            ". It collects usage data with OpenCost, an open-source Cloud Native Computing Foundation incubating project.",
          ],
        },
        {
          kind: "p",
          text: "Microsoft reconciles that usage with your Azure invoice data and fills three views in Cost Management, at the subscription scope:",
        },
        {
          kind: "ul",
          items: [
            [{ b: "Kubernetes clusters:" }, " the cost of each cluster in the subscription."],
            [
              { b: "Kubernetes namespaces:" },
              " the cost of each namespace across those clusters, with idle, system and service charges. On a shared cluster, each team finds its own figure here.",
            ],
            [
              { b: "Kubernetes assets:" },
              " each cluster’s assets under Compute, Networking and Storage, with the uptime service level agreement (SLA) under Service.",
            ],
          ],
        },
        {
          kind: "p",
          text: "The views cover only the clusters that run the add-on, so enable it on each cluster in the subscription. Requests stay as they are: no pod is resized and no node is removed.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "what-the-add-on-needs-before-you",
      title: "Requirements and limits",
      blocks: [
        {
          kind: "ul",
          items: [
            [
              { b: "Tier:" },
              " Standard or Premium. The Free tier, which Microsoft recommends for clusters under 10 nodes, isn’t supported. The uptime SLA that Standard and Premium include shows in the views as a service charge.",
            ],
            [
              { b: "Agreement:" },
              " an Enterprise Agreement or a Microsoft Customer Agreement. Other agreement types aren’t supported.",
            ],
            [
              { b: "Cluster settings:" },
              " a managed identity, and the Azure Disk Container Storage Interface (CSI) driver turned on.",
            ],
            [
              { b: "Azure CLI:" },
              " version 2.61.0 or later. ",
              { code: "az --version" },
              " shows yours.",
            ],
            [
              { b: "Network:" },
              " access to the Azure APIs, including Azure Resource Manager, and to the domain names Microsoft’s AKS outbound rules list for the add-on.",
            ],
            [
              { b: "Region and nodes:" },
              " any region but ",
              { code: "usnateast" },
              ", ",
              { code: "usnatwest" },
              ", ",
              { code: "usseceast" },
              " and ",
              { code: "ussecwest" },
              ", and no virtual nodes.",
            ],
            [
              { b: "Access to the views:" },
              " Owner, Contributor, Reader, Cost Management Contributor or Cost Management Reader on the subscription.",
            ],
          ],
        },
        {
          kind: "p",
          text: "Cluster size has a limit too. The agent’s memory limit is 4 GB, which Microsoft says supports about 7,000 containers per cluster, subject to change.",
        },
        {
          kind: "p",
          text: "Past that, the agent can be OOMKilled: stopped for using more memory than its limit. The limit can’t be raised, so Microsoft’s fix is to disable the add-on.",
        },
        {
          kind: "callout",
          label: "For engineers",
          text: "The agent requests 500 MB of memory, so it stays Pending if no node has room for that. Microsoft estimates its use at 200 MB plus 0.5 MB per container, also subject to change. Its use passes the request at 600 containers ((500 − 200) ÷ 0.5) and reaches 3,700 MB at 7,000, near the 4 GB limit.",
        },
      ],
    },
    {
      id: "how-to-enable-aks-cost-analysis",
      title: "Enable the add-on",
      blocks: [
        {
          kind: "p",
          text: "On a cluster already on Standard or Premium, one update turns it on:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "az aks update --resource-group <resource-group> --name <cluster-name> --enable-cost-analysis",
        },
        {
          kind: "p",
          text: "A Free-tier cluster can move to Standard in the same update. A new cluster can get the add-on at creation:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "# A Free-tier cluster: move to Standard and enable the add-on in one update\naz aks update --resource-group <resource-group> --name <cluster-name> --tier standard --enable-cost-analysis\n\n# A new cluster on the Standard tier\naz aks create --resource-group <resource-group> --name <cluster-name> --tier standard --enable-managed-identity --generate-ssh-keys --enable-cost-analysis",
        },
        { kind: "p", text: "If the update fails, the error code names the missing piece:" },
        {
          kind: "table",
          columns: [
            { label: "Error code", width: "30%" },
            { label: "Cause", width: "26%" },
            { label: "Fix", width: "44%" },
          ],
          rows: [
            [
              [{ code: "InvalidManagedClusterSKUForFeature" }],
              "The cluster is on the Free tier",
              [
                "Add ",
                { code: "--tier standard" },
                ", or ",
                { code: "--tier premium" },
                " with ",
                { code: "--k8s-support-plan AKSLongTermSupport" },
              ],
            ],
            [
              [{ code: "InvalidDiskCSISettingForCostAnalysis" }],
              "The Azure Disk CSI driver is off",
              [{ code: "az aks update" }, " with ", { code: "--enable-disk-driver" }],
            ],
            [
              [{ code: "InvalidManagedIdentitySettingForCostAnalysis" }],
              "The cluster has no managed identity",
              [{ code: "az aks update" }, " with ", { code: "--enable-managed-identity" }],
            ],
            [
              [{ code: "CostAnalysisNotEnabledInRegion" }],
              "The region doesn’t offer the add-on",
              "Run the cluster in a supported region",
            ],
          ],
        },
        {
          kind: "p",
          text: "Allow up to 24 hours for the first data. Cost and usage data is usually finalized within 8 to 24 hours.",
        },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            "The add-on also creates a managed identity, ",
            { code: "cost-analysis-identity" },
            ", with read access to the node resource group, and assigns it to your node pools. A script on a node that signs in with a managed identity must then name the identity to use. For example: ",
            { code: "az login --identity --resource-id <identity-id>" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "While the add-on is on, the cluster can’t move to the Free tier. Turn it off first:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "az aks update --resource-group <resource-group> --name <cluster-name> --disable-cost-analysis",
        },
      ],
    },
    {
      id: "how-to-read-aks-cost-analysis-per",
      title: "Read the views",
      blocks: [
        {
          kind: "ol",
          items: [
            "In the Azure portal, open the subscription that hosts the cluster.",
            "Go to Cost Management → Cost analysis, and pick Kubernetes clusters from the View list.",
            "Select the ellipsis (…) on a cluster to open its namespaces and assets views.",
          ],
        },
        {
          kind: "p",
          text: "Every view shows actual cost by default. If you hold reservations or a savings plan, Customize → “Amortize reservation and savings plan purchases” shows amortized cost.",
        },
        {
          kind: "h3",
          id: "what-idle-system-service-and-unallocated-charges",
          title: "What the charges mean",
        },
        {
          kind: "p",
          text: "The namespaces and assets views can show four kinds of charge:",
        },
        {
          kind: "table",
          columns: [
            { label: "Charge", width: "14%" },
            { label: "Microsoft’s definition", width: "56%" },
            { label: "What it tells you", width: "30%" },
          ],
          rows: [
            [
              "Idle charges",
              "“The cost of available resource capacity that isn’t used by any workloads.”",
              "Capacity you pay for that no namespace is charged for. It falls as nodes go.",
            ],
            [
              "System charges",
              "“The cost of capacity reserved by AKS on each node to run system processes required by the cluster, including the kubelet and container runtime.”",
              "A reservation on every node, so fewer nodes means less of it.",
            ],
            [
              "Service charges",
              "“The charges associated with the service, like Uptime SLA, Microsoft Defender for Containers, etc.”",
              "The tier and the services on the cluster, not its capacity.",
            ],
            [
              "Unallocated charges",
              "“The cost of resources that couldn’t be allocated to namespaces.”",
              "Cost the add-on can’t tie to a namespace.",
            ],
          ],
        },
        {
          kind: "p",
          text: "Month on month, the namespaces view answers the allocation question: which team’s namespace costs what on a shared cluster. It doesn’t say how many nodes you could do without. For that, you need the requests behind each line.",
        },
      ],
    },
    {
      id: "what-the-views-leave-out-the-requests",
      title: "What the views leave out",
      blocks: [
        {
          kind: "p",
          text: "Microsoft’s pages describe the views only in cost, not in the requests and use behind each figure. They give no allocation formula, so you can’t tell whether a namespace is charged for what its pods request, what they use, or a mix.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "A namespace’s pods request 8 CPU and use 2. The scheduler counts all 8 against node capacity. So 6 CPU (8 − 2) is held and never used: 75% of the request (6 ÷ 8).",
        },
        {
          kind: "p",
          text: "The namespaces view gives that namespace one cost. No view says which line pays for those 6 CPU: the namespace’s own cost, or idle charges. So before you read a small idle charge as well-used nodes, compare requests with use in the cluster.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "h3",
          id: "why-requests-not-use-set-the-node",
          title: "Requests set the node count",
        },
        {
          kind: "p",
          text: "The Kubernetes scheduler keeps the sum of requests on each node below its capacity. Even when real use is very low, it “still refuses to place a Pod on a node if the capacity check fails.” So oversized requests keep nodes full on paper, and you keep paying for them.",
        },
        {
          kind: "p",
          text: "Removal follows requests too. By default, the Cluster Autoscaler removes a node only when its pods request under 50% of both its allocatable CPU and memory. Every pod on the node must also be able to move to another node, DaemonSet and mirror pods aside.",
        },
      ],
    },
    {
      id: "how-to-turn-the-report-into-fewer",
      title: "Reduce the node count",
      blocks: [
        {
          kind: "p",
          text: "Use the namespaces view to choose where to look, then take the measurements from the cluster:",
        },
        {
          kind: "ol",
          items: [
            [
              { b: "Pick a starting point." },
              " Start with the costliest namespaces, and with any cluster whose idle charges stay high for a week.",
            ],
            [
              { b: "Compare requests with use." },
              " ",
              { code: "kubectl top pod" },
              " shows each container’s current CPU and memory use. ",
              { code: "kubectl describe nodes" },
              " lists each pod’s requests, and the node’s Allocated resources against its Allocatable:",
            ],
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "# Use per container, then requests per node\nkubectl top pod --namespace=<namespace> --containers\nkubectl describe nodes <node-name>",
        },
        {
          kind: "ol",
          start: 3,
          items: [
            [
              { b: "Set requests from a week or more of use." },
              " Never from one reading. Use a high percentile of CPU plus headroom, and the memory peak plus headroom. If a container uses more than its memory request and its node runs short of memory, its Pod is likely to be evicted. ",
              { a: "Kubernetes pod right sizing", href: "/learn/kubernetes-pod-right-sizing" },
              " covers how to choose them.",
            ],
            [
              { b: "Check the nodes again." },
              " A node can go once its CPU and memory requests are both under the autoscaler’s threshold and every pod on it can move. ",
              {
                a: "Cluster Autoscaler not scaling down",
                href: "/learn/cluster-autoscaler-not-scaling-down",
              },
              " lists the pods and settings that hold a node.",
            ],
            [
              { b: "Read the views a day later." },
              " System charges should fall with the node count, and so should Compute in the assets view.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "To price the change first, count the nodes your requests need, then price the difference at list price, as ",
            { a: "Kubernetes cost estimation", href: "/learn/kubernetes-cost-estimation" },
            " shows. The ",
            { a: "EKS and AKS pricing calculator", href: "/eks-and-aks-pricing-calculator" },
            " gives a node’s monthly list price.",
          ],
        },
        {
          kind: "p",
          text: [
            "The ",
            { a: "Kubernetes cost optimization guide", href: "/kubernetes-cost-optimization" },
            " follows the same order: requests first, then nodes.",
          ],
        },
      ],
    },
    {
      id: "how-coral-works-from-the-same-cluster",
      title: "Where Coral fits",
      blocks: [
        {
          kind: "p",
          text: [
            "AKS cost analysis shows where the cost sits. ",
            { a: "Coral", href: "/coral" },
            " works from the other end, on AKS and EKS. It shows what each cluster would cost on the capacity its workloads need, then rebalances the cluster toward it.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Figures:" },
              " each cluster’s monthly cost today and at the optimum, and the nodes Coral can’t empty, with the reason for each.",
            ],
            [
              { b: "Prices:" },
              " your cloud’s list price for the region, with spot nodes at the spot rate and a 730-hour month. Discounts, reservations and savings plans are left out, so Coral’s figures differ from the add-on’s, which are reconciled with your invoice. The ",
              { a: "Coral FAQ", href: "/coral-faq#how-is-the-saving-worked-out" },
              " shows how the saving is worked out.",
            ],
            [
              { b: "Requests:" },
              " Coral rebalances each container’s CPU and memory requests to real use. Where a CPU-based HPA scales the workload, Coral picks the CPU request by replaying past load through that HPA’s own settings.",
            ],
            [
              { b: "Nodes:" },
              " node optimization is on from install. Coral drains and removes the nodes you don’t need, one at a time.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Eight days after we connected Coral to our own AKS development cluster, its machines cost $154.76 a month instead of $368.65, 58% less. ",
            { a: "The Coral Value Lab study", href: "/coral-value-lab" },
            " walks through each step.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "AKS cost optimization", href: "/aks-cost-optimization" },
            " covers what Coral does on AKS and what connecting a cluster sets up. The ",
            { a: "free assessment", href: "/assessment?p=coral" },
            " takes one command and writes one PDF with your estimated saving at list price.",
          ],
        },
      ],
    },
  ],
  help: {
    product: "coral",
    text: "Coral rebalances CPU and memory requests on AKS and EKS, works with your HPA, and removes the nodes you don’t need. We estimate it reduces AKS and EKS cost by 40–50%. It is an estimated range, not a promise. The free assessment works out your own figure.",
    links: [
      { label: "Kubernetes optimization with Coral", href: "/coral" },
      { label: "Estimate your saving", href: "/assessment?p=coral" },
    ],
  },
  sources: [
    {
      publisher: "Microsoft Learn",
      title: "“Azure Kubernetes Service (AKS) cost analysis”",
      url: "https://learn.microsoft.com/en-us/azure/aks/cost-analysis",
    },
    {
      publisher: "Microsoft Learn",
      title: "“View Kubernetes costs”",
      url: "https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/view-kubernetes-costs",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Troubleshoot Azure Kubernetes Service cost analysis add-on issues”",
      url: "https://learn.microsoft.com/en-us/troubleshoot/azure/azure-kubernetes/extensions/aks-cost-analysis-add-on-issues",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Azure Kubernetes Service (AKS) Free, Standard, and Premium Pricing Tiers”",
      url: "https://learn.microsoft.com/en-us/azure/aks/free-standard-pricing-tiers",
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
    {
      publisher: "Kubernetes autoscaler",
      title: "“Cluster Autoscaler FAQ”",
      url: "https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md",
    },
  ],
  related: [
    {
      title: "Kubernetes cost estimation",
      where: "Learn",
      href: "/learn/kubernetes-cost-estimation",
    },
    {
      title: "Kubernetes overprovisioning",
      where: "Learn",
      href: "/learn/kubernetes-overprovisioning",
    },
    {
      title: "Cluster Autoscaler not scaling down",
      where: "Learn",
      href: "/learn/cluster-autoscaler-not-scaling-down",
    },
    {
      title: "Kubernetes requests vs limits",
      where: "Learn",
      href: "/learn/kubernetes-pod-right-sizing",
    },
    {
      title: "How to choose AKS VM sizes",
      where: "Learn",
      href: "/learn/how-to-choose-aks-node-sizes",
    },
  ],
};
