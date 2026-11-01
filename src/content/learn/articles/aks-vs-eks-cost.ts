import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/aks-vs-eks-cost/1";
import { figure as figure2 } from "@/features/learn/figures/aks-vs-eks-cost/2";

export const article: Article = {
  slug: "aks-vs-eks-cost",
  title: "AKS vs EKS cost: control plane fees and nodes",
  meta: "AKS vs EKS cost, line by line: the AKS Free, Standard and Premium tiers, the EKS cluster fee and its $0.60 extended support rate, and the nodes on both.",
  h1: "AKS vs EKS cost: what you pay for each cluster",
  deck: "The control plane fees differ by tier and by version. The worker nodes are charged as ordinary VMs on both clouds.",
  card: "AKS tiers, the EKS cluster fee and extended support, and why nodes are charged the same way on both clouds.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes cost basics",
  versus: ["AKS", "EKS"],
  published: "2026-11-01",
  updated: "2026-11-01",
  author: "anuragee",
  cover: "/learn-covers/zoorik-learn-aks-vs-eks-cost-1200x630.webp",
  coverAlt:
    "AKS vs EKS cost: the same nodes, and a control plane fee of none on AKS Free, small on Standard, large on Premium or extended",
  short:
    "AKS vs EKS cost differs mainly in the per-cluster control plane fee, since worker nodes are charged as ordinary virtual machines on both clouds. At October 2026 list prices, AKS charges $0, $73 or $438 a month by tier in Central US, and EKS $73 or $438 by version.",
  sections: [
    {
      id: "what-you-pay-for-an-aks-or",
      title: "What you pay for an AKS or EKS cluster",
      blocks: [
        {
          kind: "p",
          text: "Picture a cluster of ten general-purpose Linux nodes, each with 4\u00a0vCPUs and 16\u00a0GiB of memory. It runs on Azure Kubernetes Service (AKS) or Amazon Elastic Kubernetes Service (EKS).",
        },
        {
          kind: "p",
          text: "In October 2026, two machines of that size list at the same $0.192 an hour for Linux, one on each cloud:",
        },
        {
          kind: "ul",
          items: [
            "Standard_D4s_v5 in Azure’s East US region, at pay-as-you-go prices.",
            "m6i.xlarge in AWS’s US East (N. Virginia) region, at On-Demand prices.",
          ],
        },
        { kind: "p", text: "Each cloud charges for the cluster in three parts:" },
        {
          kind: "ul",
          items: [
            [
              { b: "The control plane." },
              " A fee per cluster for the control plane, which runs the Kubernetes API server. The AKS Free tier charges none.",
            ],
            [
              { b: "The worker nodes." },
              " Virtual machines (VMs), charged like any other VM for as long as they run.",
            ],
            [{ b: "What surrounds them." }, " The nodes’ disks, IP addresses and network traffic."],
          ],
        },
        {
          kind: "p",
          text: "Only two lines differ between the clouds: the control plane fee, and an optional fee when the cloud manages the nodes for you. The rest follows each cloud’s ordinary VM, storage and network price lists for your region.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "A month of 730\u00a0hours puts each node at $0.192 × 730 = $140.16, so the ten nodes come to $1,401.60 on either cloud. On the AKS Free tier, the control plane adds nothing.",
        },
        {
          kind: "p",
          text: "A $73 control plane, for AKS Standard or an EKS version in standard support, brings nodes and fee to $1,474.60. The fee is about 5% of that. At $438, for AKS Premium or an EKS version in extended support, they come to $1,839.60 and the fee is about 24%.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "aks-vs-eks-cost",
      title: "AKS vs EKS cost, line by line",
      blocks: [
        {
          kind: "p",
          text: "For an AKS vs EKS cost comparison, these are the rows where the two clouds differ, at list prices in October 2026. Prices change, so check both pricing pages for your region before you decide.",
        },
        {
          kind: "table",
          columns: [
            { label: "What you decide on", width: "14%" },
            { label: "AKS", width: "46%" },
            { label: "EKS", width: "40%" },
          ],
          rows: [
            [
              "Cheapest control plane",
              "Free tier: no fee and no financially backed service level agreement (SLA), recommended for fewer than 10\u00a0nodes",
              "$0.10 per cluster per hour, with no free option",
            ],
            [
              "Production control plane",
              "Standard tier: $73 per cluster per month, with a financially backed uptime SLA",
              "The same $0.10 per hour while the version is in standard support",
            ],
            [
              "Staying on an older Kubernetes version",
              "Premium tier with Long Term Support (LTS): $438 per cluster per month, opt-in",
              "Extended support: $0.60 per cluster per hour ($438 over 730\u00a0hours), on by default",
            ],
            [
              "A version nobody upgrades",
              "The tier and the fee don’t change. From June 2027, AKS upgrades the cluster after a 60-day grace period",
              "Charged $0.60 an hour for up to 12\u00a0months, then AWS upgrades the control plane",
            ],
            [
              "Nodes managed by the cloud",
              "AKS Automatic: a hosted control plane fee plus a fee per vCPU, on top of the VMs",
              "EKS Auto Mode: a fee per instance, set by instance type, on top of the EC2 price",
            ],
            [
              "Worker nodes",
              "Azure VM list price for the size and region, pay-as-you-go",
              "EC2 list price for the type and region, charged per second for Linux (60-second minimum)",
            ],
          ],
        },
        {
          kind: "p",
          text: "Two rows carry most of the difference. AKS offers a free control plane, and EKS doesn’t.",
        },
        {
          kind: "p",
          text: "EKS charges six times its standard rate for a version past standard support. AKS charges more for an old version only when you opt in to Premium.",
        },
      ],
    },
    {
      id: "aks-pricing-tier-free-vs-standard-vs",
      title: "AKS pricing tier: Free vs Standard vs Premium",
      blocks: [
        {
          kind: "p",
          text: "The tier sets the control plane line of your AKS cluster cost and leaves the nodes alone. They’re the same VMs at the same prices on every tier.",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Free." },
              " Microsoft recommends it for development, test and evaluation, and for clusters with fewer than 10\u00a0nodes. Cluster management is free. The tier supports up to 1,000\u00a0nodes but carries no financially backed uptime SLA.",
            ],
            [
              { b: "Standard." },
              " The AKS pricing page lists it at $73 per cluster per month in Central US. That buys a financially backed uptime SLA for the Kubernetes API server: 99.95% with availability zones and 99.9% without. It also gives room for up to 5,000\u00a0nodes, and AKS Automatic clusters start on this tier.",
            ],
            [
              { b: "Premium." },
              " Standard plus LTS, at $438 per cluster per month. AKS normally gives each Kubernetes version one year of community support, and LTS adds a second year. Premium and LTS are turned on and off together.",
            ],
          ],
        },
        {
          kind: "p",
          text: "AKS Automatic, which Microsoft recommends as the default for most production workloads, is priced on its own terms.",
        },
        {
          kind: "p",
          text: "In Central US, the AKS pricing page lists its hosted control plane at $0.16 an hour per cluster, $116.80 over a 730-hour month. On top comes an hourly fee for each vCPU of the VMs it runs, $0.009644 per General Purpose vCPU.",
        },
        {
          kind: "h3",
          id: "how-to-check-and-change-an-aks",
          title: "How to check and change an AKS tier",
        },
        { kind: "p", text: "To see a cluster’s tier, and to move a Free cluster to Standard:" },
        {
          kind: "code",
          lang: "bash",
          code: "az aks show --resource-group <resource-group> --name <cluster-name> --query sku\naz aks update --resource-group <resource-group> --name <cluster-name> --tier standard",
        },
        {
          kind: "p",
          text: [
            "Moving a cluster out of Premium also takes ",
            { code: "--k8s-support-plan KubernetesOfficial" },
            " on the same ",
            { code: "az aks update" },
            " command. That works only while the cluster’s Kubernetes version is still in community support.",
          ],
        },
      ],
    },
    {
      id: "eks-control-plane-cost-follows-the-kubernetes",
      title: "EKS extended support and control plane cost follow the Kubernetes version",
      blocks: [
        {
          kind: "p",
          text: "Every EKS cluster pays $0.10 per cluster per hour while its Kubernetes version is in standard support. So an EKS cluster cost starts at $73 a month before any node.",
        },
        {
          kind: "p",
          text: "Standard support lasts 14\u00a0months from the version’s release in Amazon EKS. Extended support follows for 12 more months at $0.60 per cluster per hour, the standard rate plus $0.50.",
        },
        {
          kind: "p",
          text: "The higher rate starts at the beginning of the day (UTC) that the version leaves standard support. A cluster’s upgrade policy decides what happens at the end of standard support.",
        },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            "Extended support is the default, and AWS sets the policy to ",
            { code: "EXTENDED" },
            " for new and existing clusters. A cluster that nobody upgrades moves to the $0.60 rate, $438 over 730\u00a0hours, with no change on your side.",
          ],
        },
        {
          kind: "p",
          text: "AWS’s pricing example takes a cluster created on a version’s release day and never upgraded. It pays an average of $0.33 an hour over 26\u00a0months: 14\u00a0months at $0.10 and 12 at $0.60.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: "EKS Provisioned Control Plane is optional. It runs the control plane on a scaling tier you choose, from $1.65 per cluster per hour for XL. That’s charged on top of the version support fee.",
        },
        {
          kind: "h3",
          id: "eks-supported-versions-which-are-in-extended",
          title: "EKS supported versions: which are in extended support in October 2026",
        },
        {
          kind: "p",
          text: "In October 2026, Kubernetes 1.31, 1.32 and 1.33 are in extended support on EKS, and 1.34 leaves standard support on 2 December 2026. Extended support for 1.31 ends on 26 November 2026.",
        },
        {
          kind: "p",
          text: "After that date AWS upgrades the control plane itself, at a time it doesn’t announce. Managed node groups and self-managed nodes stay on the old version until you update them.",
        },
        {
          kind: "h3",
          id: "how-to-check-a-clusters-upgrade-policy",
          title: "How to check a cluster’s upgrade policy",
        },
        { kind: "p", text: "To check a cluster’s policy:" },
        {
          kind: "code",
          lang: "bash",
          code: 'aws eks describe-cluster \\\n  --name <cluster-name> \\\n  --query "cluster.upgradePolicy.supportType"',
        },
        {
          kind: "p",
          text: [
            { code: "EXTENDED" },
            " means the cluster will enter extended support and pay its fee. ",
            { code: "STANDARD" },
            " means no extended support fee. But AWS then upgrades the cluster automatically at the end of standard support, on its schedule rather than yours.",
          ],
        },
        {
          kind: "p",
          text: [
            "Set the policy while the version is still in standard support. Once a cluster is in extended support, you can’t switch it back to ",
            { code: "STANDARD" },
            ". The way back to $0.10 is to upgrade it to a version in standard support.",
          ],
        },
        { kind: "h3", id: "how-aks-treats-an-old-version", title: "How AKS treats an old version" },
        {
          kind: "p",
          text: "AKS treats an old version the other way round. It never enrolls a cluster in LTS or changes its tier by itself, so an unsupported version doesn’t raise the fee.",
        },
        {
          kind: "p",
          text: "From 1 June 2027, AKS upgrades any cluster still on an unsupported version once its 60-day grace period ends. That upgrade doesn’t follow your maintenance window.",
        },
        {
          kind: "p",
          text: "So on EKS an old version raises your cost, while on AKS, from June 2027, it hands the upgrade timing to Microsoft.",
        },
      ],
    },
    {
      id: "worker-nodes-are-charged-as-ordinary-vms",
      title: "Worker nodes are charged as ordinary VMs on both clouds",
      blocks: [
        {
          kind: "p",
          text: [
            "Outside ",
            { a: "EKS Auto Mode", href: "/learn/glossary/eks-auto-mode" },
            ", AWS charges for EKS worker nodes through the services they use. The EKS pricing page lists these lines:",
          ],
        },
        {
          kind: "ul",
          items: [
            "The instances, through Amazon EC2.",
            "Their volumes, through Amazon Elastic Block Store (EBS).",
            "Their public IPv4 addresses, as a line of their own.",
            "Any traffic from nodes to the control plane that crosses Availability Zones.",
          ],
        },
        {
          kind: "p",
          text: "Azure charges for AKS compute by the type and running time of the VMs AKS launches. You pay as you go for the other resources the cluster consumes.",
        },
        {
          kind: "p",
          text: "So the node line on either cloud is that cloud’s VM price list for your region. Machines of the same size can cost exactly the same, as the two in the example above do.",
        },
        {
          kind: "p",
          text: [
            "List prices leave out discounts. On the Azure pricing page, the D4s v5 above costs about 31% less in East US on a one-year ",
            { a: "savings plan", href: "/learn/glossary/savings-plan" },
            ". On three years, it’s more than 50% less.",
          ],
        },
        {
          kind: "p",
          text: [
            "AWS offers Savings Plans, ",
            { a: "Reserved Instances", href: "/learn/glossary/reserved-instance" },
            " and ",
            { a: "Spot Instances", href: "/learn/glossary/spot-instance" },
            " for EC2. Both clouds charge for these machines only while they run. So a node you remove stops adding to your cost once it’s gone.",
          ],
        },
        {
          kind: "p",
          text: [
            "The number of nodes depends mostly on your workloads, not on the cloud. It depends on what your pods request, and on ",
            {
              a: "how well those requests fill the machines",
              href: "/learn/kubernetes-bin-packing",
            },
            " you chose.",
          ],
        },
        {
          kind: "p",
          text: [
            "Once a cluster runs, the control plane fee is fixed per cluster, and the node count is the line you can move. The ",
            { a: "Kubernetes cost optimization guide", href: "/kubernetes-cost-optimization" },
            " shows how to reduce it, requests first and nodes second.",
          ],
        },
      ],
    },
    {
      id: "how-to-compare-aks-and-eks-cost",
      title: "How to compare AKS and EKS cost for your clusters",
      blocks: [
        { kind: "p", text: "For your own clusters, work in this order:" },
        {
          kind: "ol",
          items: [
            [
              { b: "Count the clusters." },
              " The control plane fee is charged per cluster, not per node. Twenty Standard-tier AKS clusters cost $1,460 a month in fees before a single node runs. Twenty EKS clusters in standard support cost the same.",
            ],
            [
              { b: "Match each AKS cluster to a tier." },
              " Free suits development, test and clusters under 10\u00a0nodes. Standard adds the financially backed SLA. Premium buys LTS, a second year of support on one version.",
            ],
            [
              { b: "Plan each EKS cluster’s upgrades." },
              " Upgrade before the version leaves standard support to stay at $0.10 an hour. Otherwise, plan for $0.60 an hour, or $438 a month.",
            ],
            [
              { b: "Price the machines you’d run." },
              " Other families, sizes and regions don’t always match, so compare the exact machines. The ",
              { a: "EKS and AKS pricing calculator", href: "/eks-and-aks-pricing-calculator" },
              " prices a node pool at AWS and Azure list prices.",
            ],
            [
              { b: "Count the nodes." },
              " ",
              { a: "Kubernetes cost estimation", href: "/learn/kubernetes-cost-estimation" },
              " shows how to count the nodes your workloads need and price them.",
            ],
          ],
        },
      ],
    },
    {
      id: "how-coral-prices-a-cluster-on-aks",
      title: "How Coral prices a cluster on AKS and EKS",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " optimizes Kubernetes on both clouds, for clusters on Kubernetes 1.30 or later. It prices every node at your cloud’s published list price for the region, with spot nodes at the spot rate and a 730-hour month. Discounts, reservations and savings plans are left out.",
          ],
        },
        {
          kind: "p",
          text: [
            "So an AKS cluster and an EKS cluster show their running cost, and the share that’s recoverable, in the same terms. The ",
            { a: "Coral FAQ", href: "/coral-faq#how-is-the-saving-worked-out" },
            " shows how the saving is worked out.",
          ],
        },
        {
          kind: "p",
          text: "The saving sits in the node line. Coral rebalances each container’s CPU and memory requests to what it really uses. A smaller request reduces your cost only when the freed capacity lets a node go.",
        },
        {
          kind: "p",
          text: "Coral also empties spare nodes one at a time so your autoscaler can remove them.",
        },
        {
          kind: "p",
          text: [
            { a: "AKS cost optimization", href: "/aks-cost-optimization" },
            " and ",
            { a: "EKS cost optimization", href: "/eks-cost-optimization" },
            " cover what Coral does on each cloud.",
          ],
        },
        {
          kind: "p",
          text: [
            "On our own AKS development cluster, the machines cost $368.65 a month when Coral was connected, and $154.76 eight days later, 58% less. Both figures are at Azure pay-as-you-go list prices over 730\u00a0hours, and ",
            { a: "the case study", href: "/coral-value-lab" },
            " walks through each step.",
          ],
        },
        {
          kind: "p",
          text: [
            "To see your own clusters in the same terms, ",
            { a: "the free assessment", href: "/assessment?p=coral" },
            " writes one PDF with your estimated saving at list price. It prices nodes only, so control plane fees, storage, network and discounts stay out of that figure.",
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
    { publisher: "AWS", title: "“Amazon EKS pricing”", url: "https://aws.amazon.com/eks/pricing/" },
    {
      publisher: "AWS",
      title: "“Understand the Kubernetes version lifecycle on EKS”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/kubernetes-versions.html",
    },
    {
      publisher: "AWS",
      title: "“View current cluster upgrade policy”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/view-upgrade-policy.html",
    },
    {
      publisher: "AWS",
      title: "“Amazon EC2 On-Demand Pricing”",
      url: "https://aws.amazon.com/ec2/pricing/on-demand/",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Azure Kubernetes Service (AKS) Free, Standard, and Premium Pricing Tiers”",
      url: "https://learn.microsoft.com/en-us/azure/aks/free-standard-pricing-tiers",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Long-Term Support for Azure Kubernetes Service (AKS) Versions”",
      url: "https://learn.microsoft.com/en-us/azure/aks/long-term-support",
    },
    {
      publisher: "Microsoft Azure",
      title: "“Azure Kubernetes Service (AKS) pricing”",
      url: "https://azure.microsoft.com/en-us/pricing/details/kubernetes-service/",
    },
    {
      publisher: "Microsoft Azure",
      title: "“Linux Virtual Machines Pricing”",
      url: "https://azure.microsoft.com/en-us/pricing/details/virtual-machines/linux/",
    },
  ],
  related: [
    {
      title: "Kubernetes cost estimation: count the nodes, then price them",
      where: "Learn",
      href: "/learn/kubernetes-cost-estimation",
    },
    {
      title: "AKS cost analysis: what the add-on shows and what it doesn’t",
      where: "Learn",
      href: "/learn/aks-cost-analysis",
    },
    {
      title: "How to choose AKS node sizes",
      where: "Learn",
      href: "/learn/how-to-choose-aks-node-sizes",
    },
    {
      title: "How to choose EKS instance types",
      where: "Learn",
      href: "/learn/how-to-choose-eks-instance-types",
    },
    {
      title: "Kubernetes node size best practices: large or small nodes",
      where: "Learn",
      href: "/learn/kubernetes-node-size-best-practices",
    },
  ],
};
