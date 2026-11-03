import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/aks-vs-eks-cost/1";
import { figure as figure2 } from "@/features/learn/figures/aks-vs-eks-cost/2";

export const article: Article = {
  slug: "aks-vs-eks-cost",
  title: "AKS vs EKS cost: control plane fees",
  meta: "AKS vs EKS cost at list prices: the AKS Free, Standard and Premium tiers, the EKS cluster fee and extended support, and how nodes are charged.",
  h1: "AKS vs EKS cost",
  deck: "Nodes are ordinary VMs on both clouds, so the gap is mostly the per-cluster control plane fee.",
  card: "AKS tiers, the EKS cluster fee and extended support, and why nodes are charged alike on both clouds.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes cost basics",
  versus: ["AKS", "EKS"],
  published: "2026-11-01",
  updated: "2026-11-03",
  author: "anuragee",
  cover: "/learn-covers/zoorik-learn-aks-vs-eks-cost-1200x630.webp",
  coverAlt:
    "AKS vs EKS: the same nodes, and a control plane fee of none on AKS Free, small on Standard, large on Premium or EKS extended",
  short:
    "At October 2026 list prices, an AKS control plane costs $0, $73 or $438 a month on the Free, Standard or Premium tier. EKS charges $73 a month per cluster in standard support and $438 in extended support, which is on by default.",
  sections: [
    {
      id: "what-you-pay-for-an-aks-or",
      title: "Three cost lines",
      blocks: [
        { kind: "p", text: "Each cloud charges for a cluster in three lines:" },
        {
          kind: "ul",
          items: [
            [
              { b: "The control plane." },
              " A fee per cluster for the part that runs the Kubernetes API server. The AKS Free tier charges none.",
            ],
            [
              { b: "The worker nodes." },
              " Virtual machines (VMs), charged like any other VM while they run.",
            ],
            [{ b: "What surrounds them." }, " The nodes’ disks, IP addresses and network traffic."],
          ],
        },
        {
          kind: "p",
          text: "Two charges differ between the clouds: the control plane fee, and an optional fee when the cloud manages the nodes for you.",
        },
        {
          kind: "p",
          text: "Take ten general-purpose Linux nodes, each with 4 vCPUs and 16 GiB of memory, on Azure Kubernetes Service (AKS) or Amazon Elastic Kubernetes Service (EKS). In October 2026, a machine of that size lists at $0.192 an hour on both clouds:",
        },
        {
          kind: "ul",
          items: [
            "Standard_D4s_v5 in Azure’s East US region, at pay-as-you-go prices.",
            "m6i.xlarge in AWS’s US East (N. Virginia) region, at On-Demand prices.",
          ],
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "A month of 730 hours puts each node at $0.192 × 730 = $140.16, so the ten nodes come to $1,401.60 on either cloud. A $73 control plane makes $1,474.60, so the fee is about 5% of the total. A $438 one makes $1,839.60, about 24%.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "aks-vs-eks-cost",
      title: "Side by side",
      blocks: [
        {
          kind: "p",
          text: "These are October 2026 list prices. Prices change, so check both pricing pages for your region.",
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
              "Free tier: no fee and no financially backed service level agreement (SLA), recommended for fewer than 10 nodes",
              "$0.10 per cluster per hour, with no free option",
            ],
            [
              "Production control plane",
              "Standard tier: $73 per cluster per month, with a financially backed uptime SLA",
              "The same $0.10 per hour while the version is in standard support",
            ],
            [
              "Staying on an older version",
              "Premium tier with Long Term Support (LTS): $438 per cluster per month, opt-in",
              "Extended support: $0.60 per cluster per hour ($438 over 730 hours), on by default",
            ],
            [
              "A version nobody upgrades",
              "The tier and fee don’t change. From June 2027, AKS upgrades the cluster after a 60-day grace period",
              "$0.60 an hour for up to 12 months, then AWS upgrades the control plane",
            ],
            [
              "Nodes managed by the cloud",
              "AKS Automatic: a hosted control plane fee plus a fee per vCPU, on top of the VMs",
              "EKS Auto Mode: a fee per instance, by instance type, on top of the EC2 price",
            ],
            [
              "Worker nodes",
              "Azure VM list price for the size and region, pay-as-you-go",
              "EC2 list price for the type and region, per second for Linux (60-second minimum)",
            ],
          ],
        },
        {
          kind: "p",
          text: "Two rows carry most of the difference. Only AKS has a free control plane. Past standard support, EKS charges six times its standard rate by default. AKS charges more for an old version only on opt-in Premium.",
        },
      ],
    },
    {
      id: "aks-pricing-tier-free-vs-standard-vs",
      title: "AKS pricing tiers",
      blocks: [
        {
          kind: "p",
          text: "The tier sets only the control plane fee. The nodes are the same VMs at the same prices on every tier.",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Free." },
              " Microsoft recommends it for development, test and evaluation, and for clusters under 10 nodes. It has no fee and no financially backed uptime SLA, and supports up to 1,000 nodes.",
            ],
            [
              { b: "Standard." },
              " $0.10 per cluster per hour, or $73 a month. It adds a financially backed uptime SLA for the Kubernetes API server: 99.95% with availability zones, 99.9% without. It supports up to 5,000 nodes, and AKS Automatic clusters start on it.",
            ],
            [
              { b: "Premium." },
              " Standard plus LTS, at $438 per cluster per month. AKS gives each Kubernetes version one year of community support, and LTS adds a second year. Premium and LTS are turned on and off together.",
            ],
          ],
        },
        {
          kind: "p",
          text: "AKS Automatic is priced on its own terms. In Central US, its hosted control plane lists at $0.16 per cluster per hour, $116.80 over 730 hours. Each General Purpose vCPU of the VMs it runs adds $0.009644 an hour.",
        },
        { kind: "h3", id: "how-aks-treats-an-old-version", title: "Old versions on AKS" },
        {
          kind: "p",
          text: "AKS never enrolls a cluster in LTS or changes its tier on its own, so an unsupported version doesn’t raise the fee.",
        },
        {
          kind: "p",
          text: "From 1 June 2027, AKS upgrades a cluster still on an unsupported version once its 60-day grace period ends. That upgrade doesn’t follow your maintenance window.",
        },
        {
          kind: "h3",
          id: "how-to-check-and-change-an-aks",
          title: "Check or change the tier",
        },
        { kind: "p", text: "See a cluster’s tier, then move a Free cluster to Standard:" },
        {
          kind: "code",
          lang: "bash",
          code: "az aks show --resource-group <resource-group> --name <cluster-name> --query sku\naz aks update --resource-group <resource-group> --name <cluster-name> --tier standard",
        },
        {
          kind: "p",
          text: [
            "To leave Premium, add ",
            { code: "--k8s-support-plan KubernetesOfficial" },
            " to the same ",
            { code: "az aks update" },
            " command. It works only while the cluster’s Kubernetes version is still in community support.",
          ],
        },
      ],
    },
    {
      id: "eks-control-plane-cost-follows-the-kubernetes",
      title: "EKS extended support",
      blocks: [
        {
          kind: "p",
          text: "Every EKS cluster pays $0.10 per hour while its Kubernetes version is in standard support. That is $73 a month before any node.",
        },
        {
          kind: "p",
          text: "Standard support lasts 14 months from the version’s release on EKS. Extended support follows for 12 months at $0.60 per cluster per hour, the standard rate plus $0.50. The higher rate starts at the beginning of the day (UTC) the version leaves standard support.",
        },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            "Extended support is the default: AWS sets the upgrade policy to ",
            { code: "EXTENDED" },
            " for new and existing clusters. A cluster nobody upgrades moves to $0.60 an hour, $438 a month, with no action on your side.",
          ],
        },
        {
          kind: "p",
          text: "AWS’s pricing example is a cluster created on a version’s release day and never upgraded. Over 26 months it pays an average of $0.33 an hour: 14 months at $0.10 and 12 at $0.60.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: "EKS Provisioned Control Plane is an optional scaling tier, from $1.65 per cluster per hour for XL. It’s charged on top of the version support fee.",
        },
        {
          kind: "h3",
          id: "eks-supported-versions-which-are-in-extended",
          title: "Versions in extended support",
        },
        {
          kind: "p",
          text: "In November 2026, Kubernetes 1.31, 1.32 and 1.33 are in extended support on EKS. Extended support for 1.31 ends on 26 November 2026, and 1.34 leaves standard support on 2 December 2026.",
        },
        {
          kind: "p",
          text: "When extended support ends, AWS upgrades the control plane itself, at a time it doesn’t announce. Managed node groups and self-managed nodes stay on the old version until you update them.",
        },
        {
          kind: "h3",
          id: "how-to-check-a-clusters-upgrade-policy",
          title: "Check the upgrade policy",
        },
        {
          kind: "code",
          lang: "bash",
          code: 'aws eks describe-cluster \\\n  --name <cluster-name> \\\n  --query "cluster.upgradePolicy.supportType"',
        },
        {
          kind: "p",
          text: [
            { code: "EXTENDED" },
            " means the cluster enters extended support and pays its fee. ",
            { code: "STANDARD" },
            " means no extended support fee, but AWS upgrades the cluster when standard support ends, on its schedule rather than yours.",
          ],
        },
        {
          kind: "p",
          text: [
            "Set the policy while the version is in standard support. A cluster in extended support can’t switch to ",
            { code: "STANDARD" },
            ". Only an upgrade to a version in standard support brings back $0.10 an hour.",
          ],
        },
      ],
    },
    {
      id: "worker-nodes-are-charged-as-ordinary-vms",
      title: "Worker nodes",
      blocks: [
        {
          kind: "p",
          text: [
            "Outside ",
            { a: "EKS Auto Mode", href: "/learn/glossary/eks-auto-mode" },
            ", AWS charges for EKS worker nodes through the services they use:",
          ],
        },
        {
          kind: "ul",
          items: [
            "The instances, through Amazon EC2.",
            "Their volumes, through Amazon Elastic Block Store (EBS).",
            "Their public IPv4 addresses.",
            "Node traffic to the control plane that crosses Availability Zones.",
          ],
        },
        {
          kind: "p",
          text: "Azure charges for AKS compute by the type and running time of the VMs AKS launches. You pay as you go for the other resources the cluster uses.",
        },
        {
          kind: "p",
          text: [
            "List prices leave out discounts. On Azure’s pricing page, a D4s v5 in East US costs about 31% less on a one-year ",
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
            " for EC2. On both clouds a machine is charged only while it runs, so a node you remove stops adding to your cost.",
          ],
        },
        {
          kind: "p",
          text: [
            "The node count follows what your pods request, and ",
            {
              a: "how well those requests fill the machines",
              href: "/learn/kubernetes-bin-packing",
            },
            " you chose. It’s the line you can move. The ",
            { a: "Kubernetes cost optimization guide", href: "/kubernetes-cost-optimization" },
            " shows how to reduce it, requests first and nodes second.",
          ],
        },
      ],
    },
    {
      id: "how-to-compare-aks-and-eks-cost",
      title: "Compare your clusters",
      blocks: [
        {
          kind: "ol",
          items: [
            [
              { b: "Count the clusters." },
              " The control plane fee is per cluster. Twenty Standard-tier AKS clusters, or twenty EKS clusters in standard support, cost $1,460 a month before any node runs.",
            ],
            [
              { b: "Match each AKS cluster to a tier." },
              " Free for development, test and under 10 nodes, Standard for the SLA, Premium for a second year of support.",
            ],
            [
              { b: "Plan each EKS cluster’s upgrades." },
              " Upgrade before standard support ends to stay at $0.10 an hour. Otherwise plan for $0.60 an hour, or $438 a month.",
            ],
            [
              { b: "Price the machines you’d run." },
              " Other families, sizes and regions don’t always match, so compare the exact machines. The ",
              { a: "EKS and AKS pricing calculator", href: "/eks-and-aks-pricing-calculator" },
              " prices a node pool at AWS and Azure list prices.",
            ],
            [
              { b: "Count the nodes your workloads need." },
              " ",
              { a: "Kubernetes cost estimation", href: "/learn/kubernetes-cost-estimation" },
              " shows how to count and price them.",
            ],
          ],
        },
      ],
    },
    {
      id: "how-coral-prices-a-cluster-on-aks",
      title: "How Coral prices a cluster",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " works on AKS and EKS clusters running Kubernetes 1.30 or later. It prices each node at your cloud’s list price for the region, spot nodes at the spot rate, over a 730-hour month. Discounts, reservations and savings plans are left out.",
          ],
        },
        {
          kind: "p",
          text: [
            "The saving is in the node line. Coral rebalances CPU and memory requests to real use and removes the nodes you don’t need, one at a time. A smaller request reduces your cost only when a node can go. ",
            { a: "AKS cost optimization", href: "/aks-cost-optimization" },
            " and ",
            { a: "EKS cost optimization", href: "/eks-cost-optimization" },
            " cover what Coral does on each cloud.",
          ],
        },
        {
          kind: "p",
          text: [
            "On our own AKS development cluster, the machines went from $368.65 to $154.76 a month in eight days, 58% less at Azure pay-as-you-go list prices. ",
            { a: "The Coral Value Lab study", href: "/coral-value-lab" },
            " has each step.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "The free assessment", href: "/assessment?p=coral" },
            " prices nodes only, so control plane fees, storage, network and discounts stay out of its figure.",
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
      title: "Kubernetes cost estimation",
      where: "Learn",
      href: "/learn/kubernetes-cost-estimation",
    },
    {
      title: "AKS cost analysis",
      where: "Learn",
      href: "/learn/aks-cost-analysis",
    },
    {
      title: "How to choose AKS VM sizes",
      where: "Learn",
      href: "/learn/how-to-choose-aks-node-sizes",
    },
    {
      title: "How to choose EKS instance types",
      where: "Learn",
      href: "/learn/how-to-choose-eks-instance-types",
    },
    {
      title: "Kubernetes node size best practices",
      where: "Learn",
      href: "/learn/kubernetes-node-size-best-practices",
    },
  ],
};
