import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/aks-vs-eks-cost/1";

export const article: Article = {
  slug: "aks-vs-eks-cost",
  title: "AKS vs EKS cost: what each cluster bill is made of",
  meta: "AKS vs EKS cost, line by line: the AKS Free, Standard and Premium tiers, the EKS cluster fee and its $0.60 extended support rate, and the nodes on both.",
  h1: "AKS vs EKS cost: what each cluster bill is made of",
  deck: "The control plane fees differ by tier and by version. The worker nodes bill as ordinary VMs on both clouds.",
  card: "AKS tiers, the EKS cluster fee and extended support, and why the node bill works the same way on both clouds.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes cost basics",
  versus: ["AKS", "EKS"],
  published: "2026-11-03",
  updated: "2026-11-03",
  author: "anuragee",
  short:
    "AKS vs EKS cost differs mainly in the control plane fee. At October 2026 list prices, AKS charges nothing for the control plane on its Free tier and, in Central US, $73 a month per cluster on Standard and $438 on Premium. EKS charges each cluster $0.10 an hour while your Kubernetes version is in standard support, and $0.60 an hour once it’s in extended support. On both clouds the worker nodes bill as ordinary virtual machines.",
  sections: [
    {
      id: "what-an-aks-or-eks-cluster-bill",
      title: "What an AKS or EKS cluster bill is made of",
      blocks: [
        {
          kind: "p",
          text: "Azure Kubernetes Service (AKS) and Amazon Elastic Kubernetes Service (EKS) both bill a managed cluster in three parts. First comes a fee per cluster for the control plane, which runs the Kubernetes API server (the AKS Free tier charges none). Then come the worker nodes: virtual machines (VMs), billed like any other VM for as long as they run. Around them sit their disks, IP addresses and network traffic.",
        },
        {
          kind: "p",
          text: "The AWS pricing page names its side of that list: Amazon EC2 instances, Amazon Elastic Block Store (EBS) volumes, public IPv4 addresses, and any traffic from nodes to the control plane that crosses Availability Zones. On Azure, compute is billed by the type of VM AKS launches and how long it runs, and you pay as you go for the other resources the cluster consumes.",
        },
        {
          kind: "p",
          text: "The lines that differ between the clouds are the control plane fee and the optional fee for a mode where the cloud manages the nodes for you. The rest follows each cloud’s ordinary VM, storage and network price lists for your region.",
        },
      ],
    },
    {
      id: "aks-vs-eks-cost-line-by-line",
      title: "AKS vs EKS cost, line by line",
      blocks: [
        {
          kind: "p",
          text: "For an AKS vs EKS cost comparison, these are the rows where AKS vs EKS pricing differs, at list prices in October 2026. Prices change, so check both pricing pages before you decide.",
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
              "Billed at $0.60 an hour for up to 12\u00a0months, then AWS upgrades the control plane",
            ],
            [
              "Nodes managed by the cloud",
              "AKS Automatic: a hosted control plane fee plus a fee per vCPU, on top of the VMs",
              "EKS Auto Mode: a fee per instance, set by instance type, on top of the EC2 price",
            ],
            [
              "Worker nodes",
              "Azure VM list price for the size and region, pay-as-you-go",
              "EC2 list price for the type and region, billed per second for Linux (60-second minimum)",
            ],
          ],
        },
        {
          kind: "p",
          text: "Two rows carry most of the difference. AKS offers a free control plane and EKS doesn’t. EKS charges six times its standard rate for a version past standard support, and AKS charges more for an old version only when you opt in to Premium.",
        },
      ],
    },
    {
      id: "aks-pricing-tier-free-vs-standard-vs",
      title: "AKS pricing tier: Free vs Standard vs Premium",
      blocks: [
        {
          kind: "p",
          text: "The tier sets the control plane line of your AKS cluster cost and leaves the nodes alone: they’re the same VMs at the same prices on every tier.",
        },
        {
          kind: "p",
          text: "Microsoft recommends the Free tier for development, test and evaluation, and for clusters with fewer than 10\u00a0nodes. Cluster management is free. The tier supports up to 1,000\u00a0nodes but carries no financially backed uptime SLA.",
        },
        {
          kind: "p",
          text: "On the AKS pricing page for Central US, Standard is listed at $73 per cluster per month. That buys a financially backed uptime SLA for the Kubernetes API server, 99.95% with availability zones and 99.9% without, and room for up to 5,000\u00a0nodes. AKS Automatic clusters start on this tier.",
        },
        {
          kind: "p",
          text: "The Premium tier is Standard plus LTS, at $438 per cluster per month. AKS normally gives each Kubernetes version one year of community support, and LTS adds a second year. Premium and LTS are turned on and off together.",
        },
        {
          kind: "p",
          text: "AKS Automatic, which Microsoft recommends as the default for most production workloads, is priced on its own terms. In Central US the AKS pricing page lists $0.16 an hour per cluster for its hosted control plane ($116.80 over a 730-hour month), plus an hourly fee for each vCPU of the VMs it runs, $0.009644 per General Purpose vCPU.",
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
            " command, and works only while the cluster’s Kubernetes version is still in community support.",
          ],
        },
        {
          kind: "p",
          text: "The fee adds up when you run many clusters, because it’s charged per cluster and not per node. Twenty Standard-tier clusters cost $1,460 a month in control plane fees before a single node runs, and twenty EKS clusters in standard support cost the same.",
        },
      ],
    },
    {
      id: "eks-control-plane-cost-and-extended-support",
      title: "EKS control plane cost and extended support",
      blocks: [
        {
          kind: "p",
          text: "Every EKS cluster pays $0.10 per cluster per hour while its Kubernetes version is in standard support, so an EKS cluster cost starts at $73 a month before any node. Standard support lasts 14\u00a0months from the version’s release in Amazon EKS. Extended support follows for 12 more months at $0.60 per cluster per hour, the standard rate plus $0.50. The higher rate starts at the beginning of the day (UTC) that the version leaves standard support.",
        },
        {
          kind: "p",
          text: [
            "Extended support is the default. A cluster’s upgrade policy decides what happens at the end of standard support, and AWS sets it to ",
            { code: "EXTENDED" },
            " for new and existing clusters. A cluster that nobody upgrades moves to the $0.60 rate with no change on your side. In AWS’s own pricing example, a cluster created on a version’s release day and never upgraded pays an average of $0.33 an hour over 26\u00a0months.",
          ],
        },
        {
          kind: "p",
          text: "In October 2026, Kubernetes 1.31, 1.32 and 1.33 are in extended support on EKS, and 1.34 leaves standard support on 2 December 2026. Extended support for 1.31 ends on 26 November 2026. After that date AWS upgrades the control plane itself, at a time it doesn’t announce, and managed node groups and self-managed nodes stay on the old version until you update them.",
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
            " means no extended support fee, but AWS then upgrades the cluster automatically at the end of standard support, on its schedule rather than yours. Set the policy while the version is still in standard support. Once a cluster is in extended support, you can’t switch it back to ",
            { code: "STANDARD" },
            ", and the way back to $0.10 is to upgrade it to a version in standard support.",
          ],
        },
        {
          kind: "p",
          text: "One more control plane line is optional. EKS Provisioned Control Plane runs the control plane on a scaling tier you choose, from $1.65 per cluster per hour for XL, charged on top of the version support fee.",
        },
        {
          kind: "p",
          text: "AKS treats an old version the other way round. It never enrolls a cluster in LTS or changes its tier by itself, so an unsupported version doesn’t raise the fee. From 1 June 2027, AKS upgrades any cluster still on an unsupported version once its 60-day grace period ends, and that upgrade doesn’t follow your maintenance window. On EKS an old version raises the bill. On AKS, from June 2027, it hands the upgrade timing to Microsoft.",
        },
      ],
    },
    {
      id: "worker-nodes-bill-as-ordinary-vms-on",
      title: "Worker nodes bill as ordinary VMs on both clouds",
      blocks: [
        {
          kind: "p",
          text: "Outside Auto Mode, AWS bills EKS worker nodes through the services they use: the instances through Amazon EC2, their volumes through Amazon EBS, and their public IPv4 addresses as a line of their own. Azure charges AKS compute by the type and running time of the VMs AKS launches. So the node line of either bill is the cloud’s VM price list for your region, and machines of the same size can cost exactly the same.",
        },
        {
          kind: "p",
          text: "Take a general-purpose Linux node with 4\u00a0vCPUs and 16\u00a0GiB of memory. In October 2026, Standard_D4s_v5 in Azure’s East US region and m6i.xlarge in AWS’s US East (N. Virginia) region both list at $0.192 an hour for Linux (pay-as-you-go on Azure, On-Demand on AWS), or $140.16 over a 730-hour month. Other families, sizes and regions don’t always match, so compare the machines you’d actually run.",
        },
        {
          kind: "p",
          text: "Put ten of those nodes behind one control plane and the nodes come to $1,401.60 a month. A $73 control plane is about 5% of that cluster’s bill. The $438 rate, for AKS Premium or an EKS version in extended support, is about 24%.",
        },
        { kind: "diagram", figure: figure1 },
        {
          kind: "p",
          text: "List prices leave out discounts. The Azure pricing page shows that same D4s v5 in East US at about 31% less on a one-year savings plan and more than 50% less on three years, and AWS offers Savings Plans, Reserved Instances and Spot Instances for EC2. Both clouds bill these machines only while they run, so a node you remove stops adding to the bill once it’s gone.",
        },
        {
          kind: "p",
          text: [
            "The number of nodes depends mostly on your workloads, not on the cloud: on what your pods request, and on ",
            {
              a: "how well those requests fill the machines",
              href: "/learn/kubernetes-bin-packing",
            },
            " you chose. Once a cluster runs, the control plane fee is fixed per cluster, and the node count is the line you can move. ",
            { a: "Kubernetes cost estimation", href: "/learn/kubernetes-cost-estimation" },
            " shows how to count the nodes your workloads need and price them.",
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
            " optimizes Kubernetes on both clouds, for clusters on Kubernetes 1.30 or later. It prices every node at your cloud’s published list price for the region, with spot nodes at the spot rate and a 730-hour month. Discounts, reservations and savings plans are left out. An AKS cluster and an EKS cluster therefore show their running cost, and the share that’s recoverable, in the same terms.",
          ],
        },
        {
          kind: "p",
          text: "The saving sits in the node line. Coral rebalances each container’s CPU and memory requests to what it really uses, and a smaller request reaches your bill when the freed capacity lets a node go. Coral also empties spare nodes one at a time so your autoscaler can remove them. On AKS it works through a role that can read the cluster and delete its machines, and on EKS through an IAM role that can terminate instances in the cluster’s Auto Scaling groups.",
        },
        {
          kind: "p",
          text: [
            "On our own AKS development cluster, the machines cost $368.65 a month when Coral was connected and $154.76 eight days later, at Azure pay-as-you-go list prices over 730\u00a0hours. ",
            {
              a: "How we reduced our own cluster’s machine bill by 58%",
              href: "/case-studies/coral-dev-cluster",
            },
            " walks through each step. To see your own clusters in the same terms, ",
            { a: "the free assessment", href: "/assessment?p=coral" },
            " reads them and writes one PDF with your estimated saving at list price. It prices nodes only, so control plane fees, storage, network and discounts stay out of that figure.",
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
      title: "Kubernetes node size best practices: large or small nodes",
      where: "Learn",
      href: "/learn/kubernetes-node-size-best-practices",
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
