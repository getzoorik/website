import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/aks-cost-analysis/1";

export const article: Article = {
  slug: "aks-cost-analysis",
  title: "AKS cost analysis: what the add-on shows",
  meta: "AKS cost analysis splits a cluster’s bill by namespace. How to enable the add-on, what its idle and system charges mean, and the requests they can’t show.",
  h1: "AKS cost analysis: what the add-on shows and what it doesn’t",
  deck: "What the add-on needs, how to turn it on, how to read its charges, and the requests it doesn’t show.",
  card: "Enable the AKS cost analysis add-on, read its namespace and idle charges, and see what it leaves out.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes cost basics",
  published: "2026-11-02",
  updated: "2026-11-02",
  author: "anuragee",
  short: [
    "AKS cost analysis is an add-on that splits an Azure Kubernetes Service (AKS) cluster’s bill by namespace and by compute, network and storage asset, inside Microsoft Cost Management. Built on OpenCost, it needs the Standard or Premium tier and an Enterprise Agreement or Microsoft Customer Agreement, and you turn it on with ",
    { code: "az aks update --enable-cost-analysis" },
    ". From then on it reports where the money goes, but it changes no request and removes no node.",
  ],
  sections: [
    {
      id: "what-the-aks-cost-analysis-add-on",
      title: "What the AKS cost analysis add-on shows",
      blocks: [
        {
          kind: "p",
          text: "An AKS cluster runs on ordinary Azure resources: virtual machines, managed disks, load balancers and public IP addresses. Many applications share them, and one application can span several clusters, so the invoice alone can’t tell you which team’s work a node is paying for.",
        },
        {
          kind: "p",
          text: [
            "Azure Kubernetes Service cost analysis fills that gap. When you enable it, AKS deploys an agent, the ",
            { code: "cost-analysis-agent" },
            " pod in ",
            { code: "kube-system" },
            ", which collects usage data with OpenCost, an open-source Cloud Native Computing Foundation (CNCF) incubating project. Microsoft reconciles that usage with your Azure invoice data and fills three views in Cost Management, at the subscription scope:",
          ],
        },
        {
          kind: "ul",
          items: [
            "Kubernetes clusters: what each cluster in the subscription costs.",
            "Kubernetes namespaces: the cost of each namespace across the subscription’s clusters, with idle, system and service charges beside them.",
            "Kubernetes assets: each cluster’s assets under Compute, Networking and Storage, with the uptime SLA under Service.",
          ],
        },
        {
          kind: "p",
          text: "The views cover only the clusters that run the add-on, so with several clusters in one subscription, you enable it on each of them.",
        },
      ],
    },
    {
      id: "what-the-add-on-needs",
      title: "What the add-on needs",
      blocks: [
        {
          kind: "p",
          text: "Microsoft Learn lists these as prerequisites and limits, so check them before you run the command:",
        },
        {
          kind: "ul",
          items: [
            "The Standard or Premium tier. The Free tier, which Microsoft recommends for clusters with fewer than 10\u00a0nodes, isn’t supported. Standard and Premium include an uptime SLA, and that appears in the views as a service charge.",
            "An Enterprise Agreement or a Microsoft Customer Agreement. Microsoft says “other agreement types aren’t supported.”",
            "A managed identity on the cluster, and the Azure Disk Container Storage Interface (CSI) driver turned on.",
            ["Azure CLI 2.61.0 or later, which ", { code: "az --version" }, " checks."],
            "Access from the cluster to the Azure APIs, including Azure Resource Manager (ARM). Microsoft keeps the list of required domain names on its AKS outbound network page.",
            [
              "A region other than ",
              { code: "usnateast" },
              ", ",
              { code: "usnatwest" },
              ", ",
              { code: "usseceast" },
              " and ",
              { code: "ussecwest" },
              ", and no virtual nodes.",
            ],
            "To read the views, one of these roles on the subscription: Owner, Contributor, Reader, Cost Management Contributor or Cost Management Reader.",
          ],
        },
        {
          kind: "p",
          text: "Cluster size matters as well. The agent requests 500\u00a0MB of memory and is capped at 4\u00a0GB. Microsoft estimates the agent’s use at 200\u00a0MB plus 0.5\u00a0MB per container and says the 4\u00a0GB limit supports about 7,000 containers per cluster, figures it marks as subject to change. Past that, the agent can be OOMKilled, and because its memory limit can’t be raised, the fix Microsoft gives is to disable the add-on.",
        },
      ],
    },
    {
      id: "how-to-enable-aks-cost-analysis",
      title: "How to enable AKS cost analysis",
      blocks: [
        {
          kind: "p",
          text: "To enable cost analysis on a cluster that’s already on Standard or Premium, one update does it:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "az aks update --resource-group <resource-group> --name <cluster-name> --enable-cost-analysis",
        },
        {
          kind: "p",
          text: "A Free-tier cluster can move to Standard and take the add-on in the same update, which is one of the operations Microsoft lists for the flag. A new cluster gets it at creation:",
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
          text: [
            "Two side effects come with it. The add-on creates a managed identity named ",
            { code: "cost-analysis-identity" },
            ", with read access to the cluster’s node resource group, and assigns it to your node pools. Each node pool then carries a second identity, so a script on a node that signs in with a managed identity has to name the one it wants, for example ",
            { code: "az login --identity --resource-id <identity-id>" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "The second is a lock on the tier. While the add-on is on, the cluster can’t go back to the Free tier. Turn it off first:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "az aks update --resource-group <resource-group> --name <cluster-name> --disable-cost-analysis",
        },
        {
          kind: "p",
          text: "Then give it a day. Microsoft allows up to 24\u00a0hours for the first data, and cost and usage data is usually finalized within 8 to 24\u00a0hours.",
        },
      ],
    },
    {
      id: "how-to-read-aks-cost-analysis-per",
      title: "How to read AKS cost analysis per namespace",
      blocks: [
        {
          kind: "p",
          text: "In the Azure portal, open the subscription that hosts the cluster, then Cost Management → Cost analysis, and pick Kubernetes clusters from the View list. The ellipsis (…) on a cluster opens its namespaces and assets views. Every view shows actual cost by default. If you hold reservations or a savings plan, Customize → “Amortize reservation and savings plan purchases” switches the view to amortized cost.",
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
          text: "For AKS cost monitoring month on month, the namespaces view answers the allocation question well: which team’s namespace costs what, on clusters several teams share. For AKS cost management beyond that, such as how many nodes you could do without, you need the numbers behind each line.",
        },
      ],
    },
    {
      id: "what-the-add-on-doesnt-show",
      title: "What the add-on doesn’t show",
      blocks: [
        {
          kind: "p",
          text: "The add-on only reports. Requests stay as they are, no pod is resized and no node goes, and Microsoft describes its views only in cost, not in the requests and use behind each figure.",
        },
        {
          kind: "p",
          text: "Microsoft’s add-on pages don’t give the allocation formula either. They say the add-on is built on OpenCost for usage data collection and that the usage data is reconciled with your Azure invoice data. They define Idle charges as the cost of capacity “that isn’t used by any workloads,” but they don’t say whether a namespace is charged for what its pods request, for what they use, or for some mix of the two.",
        },
        {
          kind: "p",
          text: "So a namespace whose pods request 8\u00a0CPU and use 2 holds 6\u00a0CPU it never uses, and nothing in the views says which line pays for those 6: its own or Idle charges. Before you read a small Idle charge as well-used nodes, compare requests with use in the cluster.",
        },
        {
          kind: "p",
          text: "Requests also decide how many nodes run, because the Kubernetes scheduler keeps the sum of requests on each node within its capacity. The documentation says that even when real use is very low, the scheduler “still refuses to place a Pod on a node if the capacity check fails.” The Cluster Autoscaler removes a node only when its pods’ CPU requests and memory requests are both under 50% of what the node can allocate (the default threshold), and every pod on it, DaemonSet and mirror pods aside, can move to another node. Oversized requests keep nodes full on paper, and those nodes stay on the bill.",
        },
        { kind: "diagram", figure: figure1 },
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
            "Start with the namespaces that cost the most, and with any cluster whose Idle charges stay high for a week.",
            [
              "Compare what those pods request with what they use, with the two commands under this list. ",
              { code: "kubectl top pod" },
              " shows each container’s current CPU and memory use, and ",
              { code: "kubectl describe nodes" },
              " lists each pod’s requests and the node’s Allocated resources against its Allocatable.",
            ],
            [
              "Set requests from a week or more of use, never from one reading: a high percentile of CPU plus headroom, and the peak of memory plus headroom, because when a container uses more memory than it requests and its node runs short of memory, its Pod is likely to be evicted. How to choose them is covered in ",
              { a: "setting requests from real use", href: "/learn/kubernetes-pod-right-sizing" },
              ".",
            ],
            [
              "Check the nodes again. Once a node’s CPU and memory requests both drop under the autoscaler’s threshold and every pod on it can move, the Cluster Autoscaler can remove it. ",
              { a: "What keeps nodes running", href: "/learn/cluster-autoscaler-not-scaling-down" },
              " lists the pods and settings that hold a node.",
            ],
            "Read the views again a day later. System charges should fall with the node count, and so should the cluster’s Compute cost in the assets view.",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "# Use per container, then requests per node\nkubectl top pod --namespace=<namespace> --containers\nkubectl describe nodes <node-name>",
        },
        {
          kind: "p",
          text: [
            "To put a figure on the change before you make it, count the nodes your requests need and price the difference at list price, as the guide to ",
            { a: "estimating Kubernetes cost", href: "/learn/kubernetes-cost-estimation" },
            " shows.",
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
            " starts from the other end, on AKS and EKS: it shows what each cluster would cost on the capacity its workloads need, then rebalances the cluster toward it.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "The figures:" },
              " Overview shows each cluster’s running cost today, its cost at the optimum, and the difference as Recoverable, all monthly. The Node list adds every node’s monthly price, the capacity no pod has claimed, and the nodes Coral can’t empty, with the reason for each.",
            ],
            [
              { b: "The prices:" },
              " list price, refreshed nightly. Coral uses your cloud’s published price for the region, with spot nodes at the spot rate and a 730-hour month, and leaves out discounts, reservations and savings plans. Expect its figures to differ from the add-on’s, which are reconciled with your invoice.",
            ],
            [
              { b: "Requests:" },
              " Coral rebalances each container’s CPU and memory requests to what it really uses. On the balanced policy, CPU is the 80th percentile of the last 3\u00a0days plus 10%, and memory is the highest use in the last 8\u00a0days, plus the same 10%. Where a CPU-based HPA scales the workload, Coral picks the CPU request by replaying past load through that HPA’s own settings. Pod sizing starts when you switch on “Automatically optimize” for a policy or a workload.",
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
            "Eight days after we connected Coral to our own AKS development cluster, the cluster cost $154.76 a month instead of $368.65. ",
            {
              a: "How we reduced our own cluster’s machine bill by 58%",
              href: "/case-studies/coral-dev-cluster",
            },
            " walks through each step. To see your own figure first, the ",
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
      { label: "Kubernetes cost optimization with Coral", href: "/coral" },
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
