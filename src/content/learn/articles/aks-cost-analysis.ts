import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/aks-cost-analysis/1";
import { figure as figure2 } from "@/features/learn/figures/aks-cost-analysis/2";

export const article: Article = {
  slug: "aks-cost-analysis",
  title: "AKS cost analysis: what the add-on shows",
  meta: "AKS cost analysis splits a cluster’s cost by namespace and asset. How to enable the add-on, what its idle and system charges mean, and what it can’t show.",
  h1: "AKS cost analysis: what the add-on shows and what it doesn’t",
  deck: "What the add-on needs, how to turn it on, how to read its charges, and the requests it doesn’t show.",
  card: "Enable the AKS cost analysis add-on, read its namespace and idle charges, and see what it leaves out.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes cost basics",
  published: "2026-11-01",
  updated: "2026-11-01",
  author: "anuragee",
  cover: "/learn-covers/zoorik-learn-aks-cost-analysis-1200x630.webp",
  coverAlt:
    "AKS cost analysis: cost by namespace and Idle, with a namespace’s unused requests hidden in the totals",
  short:
    "AKS cost analysis is an add-on that shows an Azure Kubernetes Service (AKS) cluster’s cost by namespace and asset in Microsoft Cost Management. It needs the Standard or Premium tier and an Enterprise Agreement or Microsoft Customer Agreement, and it changes no request or node.",
  sections: [
    {
      id: "aks-cost-analysis",
      title: "The AKS cost analysis add-on splits cost by cluster, namespace and asset",
      blocks: [
        {
          kind: "p",
          text: "Picture one AKS cluster that three teams share, each in its own namespace. The invoice lists the Azure resources the cluster runs on: virtual machines, managed disks, load balancers and public IP addresses. Nothing on it says which team’s work a node is paying for.",
        },
        {
          kind: "p",
          text: "One team’s application may also span several clusters. Azure Kubernetes Service cost analysis fills that gap.",
        },
        {
          kind: "p",
          text: [
            "When you enable it, AKS deploys an agent: the ",
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
            [{ b: "Kubernetes clusters:" }, " what each cluster in the subscription costs."],
            [
              { b: "Kubernetes namespaces:" },
              " the cost of each namespace across the subscription’s clusters, with idle, system and service charges beside them. This is where each of the three teams finds its own figure.",
            ],
            [
              { b: "Kubernetes assets:" },
              " each cluster’s assets under Compute, Networking and Storage, with the uptime service level agreement (SLA) under Service.",
            ],
          ],
        },
        {
          kind: "p",
          text: "The views cover only the clusters that run the add-on. With several clusters in one subscription, you enable it on each of them.",
        },
        {
          kind: "p",
          text: "Data flows one way. Usage goes in and cost comes out, while requests stay as they are. No pod is resized and no node goes.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "what-the-add-on-needs-before-you",
      title: "What the add-on needs before you enable it",
      blocks: [
        {
          kind: "p",
          text: "Microsoft Learn lists these as prerequisites and limits, so check them before you run the command:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Tier:" },
              " Standard or Premium. The Free tier, which Microsoft recommends for clusters with fewer than 10\u00a0nodes, isn’t supported. Standard and Premium include an uptime SLA, and that appears in the views as a service charge.",
            ],
            [
              { b: "Agreement:" },
              " an Enterprise Agreement or a Microsoft Customer Agreement. Microsoft says “other agreement types aren’t supported.”",
            ],
            [
              { b: "Cluster settings:" },
              " a managed identity, and the Azure Disk Container Storage Interface (CSI) driver turned on.",
            ],
            [
              { b: "Azure CLI:" },
              " version 2.61.0 or later, which ",
              { code: "az --version" },
              " checks.",
            ],
            [
              { b: "Network:" },
              " access from the cluster to the Azure APIs, including Azure Resource Manager. The cluster must reach the domain names that Microsoft’s AKS outbound network page lists as required.",
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
              " one of these roles on the subscription: Owner, Contributor, Reader, Cost Management Contributor or Cost Management Reader.",
            ],
          ],
        },
        {
          kind: "p",
          text: "Cluster size matters as well. Microsoft says the agent’s 4\u00a0GB memory limit supports about 7,000 containers per cluster. It marks that figure as subject to change.",
        },
        {
          kind: "p",
          text: "Past that, the agent can be OOMKilled, which means stopped for going over its memory limit. The limit can’t be raised, so the fix Microsoft gives is to disable the add-on.",
        },
        {
          kind: "callout",
          label: "For engineers",
          text: "The agent requests 500\u00a0MB of memory, and Microsoft estimates its use at 200\u00a0MB plus 0.5\u00a0MB per container, also subject to change. That use reaches the request at 600 containers ((500 − 200) ÷ 0.5), and 3,700\u00a0MB at 7,000 (200 + 0.5 × 7,000), near the 4\u00a0GB limit.",
        },
      ],
    },
    {
      id: "how-to-enable-aks-cost-analysis",
      title: "How to enable AKS cost analysis",
      blocks: [
        {
          kind: "p",
          text: "On a cluster that’s already on Standard or Premium, one update turns the add-on on:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "az aks update --resource-group <resource-group> --name <cluster-name> --enable-cost-analysis",
        },
        {
          kind: "p",
          text: "A Free-tier cluster can move to Standard and take the add-on in the same update. Microsoft lists this among the operations for the flag. A new cluster gets the add-on at creation:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "# A Free-tier cluster: move to Standard and enable the add-on in one update\naz aks update --resource-group <resource-group> --name <cluster-name> --tier standard --enable-cost-analysis\n\n# A new cluster on the Standard tier\naz aks create --resource-group <resource-group> --name <cluster-name> --tier standard --enable-managed-identity --generate-ssh-keys --enable-cost-analysis",
        },
        { kind: "p", text: "If the update is refused, the error code names the missing piece:" },
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
              "None. Run the cluster in a supported region",
            ],
          ],
        },
        {
          kind: "p",
          text: "Once the update succeeds, give it a day. Microsoft allows up to 24\u00a0hours for the first data. Cost and usage data is usually finalized within 8 to 24\u00a0hours.",
        },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            "The add-on creates a second managed identity, ",
            { code: "cost-analysis-identity" },
            ", with read access to the cluster’s node resource group, and assigns it to your node pools. A script on a node that signs in with a managed identity must name the identity it wants, for example ",
            { code: "az login --identity --resource-id <identity-id>" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "The add-on also locks the tier. While it’s on, the cluster can’t go back to the Free tier, so turn the add-on off first:",
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
      title: "How to read AKS cost analysis per namespace",
      blocks: [
        {
          kind: "ol",
          items: [
            "In the Azure portal, open the subscription that hosts the cluster.",
            "Go to Cost Management → Cost analysis, and pick Kubernetes clusters from the View list.",
            "Open the ellipsis (…) on a cluster for its namespaces and assets views.",
          ],
        },
        {
          kind: "p",
          text: "Every view shows actual cost by default. If you hold reservations or a savings plan, Customize → “Amortize reservation and savings plan purchases” switches the view to amortized cost.",
        },
        {
          kind: "h3",
          id: "what-idle-system-service-and-unallocated-charges",
          title: "What idle, system, service and unallocated charges mean",
        },
        {
          kind: "p",
          text: "In the namespaces and assets views, the add-on can show four kinds of charge. Microsoft’s definitions are short, and each one points somewhere different:",
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
              "Capacity you pay for that no workload is charged for. It falls when nodes go.",
            ],
            [
              "System charges",
              "“The cost of capacity reserved by AKS on each node to run system processes required by the cluster, including the kubelet and container runtime.”",
              "A reservation paid on every node, so fewer nodes means less of it.",
            ],
            [
              "Service charges",
              "“The charges associated with the service, like Uptime SLA, Microsoft Defender for Containers, etc.”",
              "The tier and the services on the cluster, not its capacity.",
            ],
            [
              "Unallocated charges",
              "“The cost of resources that couldn’t be allocated to namespaces.”",
              "Cost the add-on can’t tie to any namespace.",
            ],
          ],
        },
        {
          kind: "p",
          text: "For AKS cost monitoring month on month, the namespaces view answers the allocation question well. It shows which team’s namespace costs what on a shared cluster.",
        },
        {
          kind: "p",
          text: "AKS cost management needs more than that. To see how many nodes you could do without, you need the numbers behind each line.",
        },
      ],
    },
    {
      id: "what-the-views-leave-out-the-requests",
      title: "What the views leave out: the requests behind each cost",
      blocks: [
        {
          kind: "p",
          text: "Microsoft describes its views only in cost, not in the requests and use behind each figure. Its add-on pages don’t give the allocation formula either.",
        },
        {
          kind: "p",
          text: "They say only that OpenCost collects the usage data and that Microsoft reconciles it with your invoice data. They define Idle charges as the cost of capacity “that isn’t used by any workloads.”",
        },
        { kind: "p", text: "They don’t say which of these a namespace is charged for:" },
        {
          kind: "ul",
          items: ["What its pods request.", "What its pods use.", "Some mix of the two."],
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "Take a namespace whose pods request 8\u00a0CPU and use 2. The scheduler counts all 8 against node capacity, so 6\u00a0CPU (8 − 2) is held and never used, 75% of the request (6 ÷ 8).",
        },
        {
          kind: "p",
          text: "The namespaces view gives that namespace one cost. Nothing in the views says which line pays for those 6\u00a0CPU: the namespace’s own, or Idle charges. So before you read a small Idle charge as well-used nodes, compare requests with use in the cluster.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "h3",
          id: "why-requests-not-use-set-the-node",
          title: "Why requests, not use, set the node count",
        },
        {
          kind: "p",
          text: "Requests also decide how many nodes run. The Kubernetes scheduler keeps the sum of requests on each node within its capacity.",
        },
        {
          kind: "p",
          text: "Even at very low real use, the scheduler “still refuses to place a Pod on a node if the capacity check fails,” the documentation says. So oversized requests keep nodes full on paper, and you keep paying for those nodes.",
        },
        {
          kind: "p",
          text: "Removal follows requests too. The Cluster Autoscaler removes a node only when its pods’ CPU and memory requests are both under 50% of what the node can allocate.",
        },
        {
          kind: "p",
          text: "That 50% is the default threshold. Every pod on the node must also be able to move to another node, DaemonSet and mirror pods aside.",
        },
      ],
    },
    {
      id: "how-to-turn-the-report-into-fewer",
      title: "How to turn the report into fewer nodes",
      blocks: [
        {
          kind: "p",
          text: "Use the namespaces view to decide where to look, then take the measurements from the cluster itself:",
        },
        {
          kind: "ol",
          items: [
            [
              { b: "Pick a starting point." },
              " Start with the namespaces that cost the most, and with any cluster whose Idle charges stay high for a week.",
            ],
            [
              { b: "Compare requests with use." },
              " Run ",
              { code: "kubectl top pod" },
              " for each container’s current CPU and memory use. Then ",
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
              " Never set them from one reading. Use a high percentile of CPU plus headroom, and the peak of memory plus headroom. Memory needs its peak. If a container goes over its memory request and its node runs short of memory, its Pod is likely to be evicted. ",
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
              " System charges should fall with the node count, and so should the cluster’s Compute cost in the assets view.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "To put a figure on the change first, count the nodes your requests need. Then price the difference at list price, as ",
            { a: "Kubernetes cost estimation", href: "/learn/kubernetes-cost-estimation" },
            " shows. The ",
            { a: "EKS and AKS pricing calculator", href: "/eks-and-aks-pricing-calculator" },
            " gives a node’s monthly cost at list price.",
          ],
        },
        {
          kind: "p",
          text: [
            "This order, requests first and nodes second, is the one the ",
            { a: "Kubernetes cost optimization guide", href: "/kubernetes-cost-optimization" },
            " follows.",
          ],
        },
      ],
    },
    {
      id: "how-coral-works-from-the-same-cluster",
      title: "How Coral works from the same cluster",
      blocks: [
        {
          kind: "p",
          text: [
            "AKS cost analysis tells you where the cost sits. ",
            { a: "Coral", href: "/coral" },
            " starts from the other end, on AKS and EKS. It shows what each cluster would cost on the capacity its workloads need, then rebalances the cluster toward it.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "The figures:" },
              " Coral shows each cluster’s monthly cost today and at the optimum, and lists the nodes it can’t empty, with the reason for each.",
            ],
            [
              { b: "The prices:" },
              " your cloud’s published list price for the region, with spot nodes at the spot rate and a 730-hour month. Discounts, reservations and savings plans are left out. So expect Coral’s figures to differ from the add-on’s, which are reconciled with your invoice. The ",
              { a: "Coral FAQ", href: "/coral-faq#how-is-the-saving-worked-out" },
              " shows how the saving is worked out.",
            ],
            [
              { b: "Requests:" },
              " Coral rebalances each container’s CPU and memory requests to what it really uses. Where a CPU-based HPA scales the workload, Coral picks the CPU request by replaying past load through that HPA’s own settings.",
            ],
            [
              { b: "Nodes:" },
              " node optimization is on from install. Coral drains spare nodes one at a time so your autoscaler can remove them.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Eight days after we connected Coral to our own AKS development cluster, the cluster’s machines cost $154.76 a month instead of $368.65. That is 58% less, and ",
            { a: "the Coral Value Lab study", href: "/coral-value-lab" },
            " walks through each step.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "AKS cost optimization", href: "/aks-cost-optimization" },
            " covers what Coral does on AKS and what connecting a cluster sets up. To see your own figure first, the ",
            { a: "free assessment", href: "/assessment?p=coral" },
            " takes one command and writes one PDF with your estimated saving at list price.",
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
      title: "Kubernetes cost estimation: count the nodes, then price them",
      where: "Learn",
      href: "/learn/kubernetes-cost-estimation",
    },
    {
      title: "Kubernetes overprovisioning: what it is and how to measure it",
      where: "Learn",
      href: "/learn/kubernetes-overprovisioning",
    },
    {
      title: "Cluster Autoscaler not scaling down: what keeps nodes running",
      where: "Learn",
      href: "/learn/cluster-autoscaler-not-scaling-down",
    },
    {
      title: "Kubernetes pod right sizing: set requests from real use",
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
