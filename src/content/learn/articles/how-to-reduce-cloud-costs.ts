import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/how-to-reduce-cloud-costs/1";
import { figure as figure2 } from "@/features/learn/figures/how-to-reduce-cloud-costs/2";
import { figure as figure3 } from "@/features/learn/figures/how-to-reduce-cloud-costs/3";

export const article: Article = {
  slug: "how-to-reduce-cloud-costs",
  route: "/cloud-cost-optimization",
  title: "Cloud cost optimization: how to reduce cloud costs",
  meta: "Cloud cost optimization on Azure and AWS, in order: see the cost, fix the architecture, remove idle resources, reduce requests and disks, then commit.",
  h1: "Cloud cost optimization",
  deck: "How to reduce cloud costs on Azure and AWS, from tags to commitments.",
  card: "The order that reduces Azure and AWS cost: tags, architecture, idle resources, Kubernetes, disks, commitments.",
  product: "both",
  hub: "Cloud cost",
  topic: "Cloud cost",
  published: "2026-10-21",
  updated: "2026-11-03",
  author: "udit",
  cover: "/learn-covers/zoorik-learn-how-to-reduce-cloud-costs-1200x630.webp",
  coverAlt: "Reduce cloud costs in order: use less first, commit last",
  short: [
    "Cloud cost optimization is six fixes, made in order. See where the money goes, fix the architecture and remove idle resources. Then reduce Kubernetes requests and oversized disks. Buy ",
    { a: "reservations", href: "/learn/glossary/reserved-instance" },
    " or ",
    { a: "savings plans", href: "/learn/glossary/savings-plan" },
    " last, sized to what’s left.",
  ],
  sections: [
    {
      id: "what-is-cloud-cost-optimization",
      title: "What is cloud cost optimization?",
      blocks: [
        {
          kind: "p",
          text: "Cloud cost optimization means paying only for the cloud resources your work uses, at the best rate you can get, and keeping it that way. It is the cost side of cloud optimization.",
        },
        {
          kind: "p",
          text: "It matters because many cloud services charge for what you provision, used or not. A VM is charged while it’s allocated, even when stopped. A disk is charged for its full size, however little data it holds.",
        },
        {
          kind: "p",
          text: [
            { a: "Azure cost optimization", href: "/azure-cost-optimization" },
            " and ",
            { a: "AWS cost optimization", href: "/aws-cost-optimization" },
            " go through each cloud line by line.",
          ],
        },
      ],
    },
    {
      id: "cloud-cost-optimization-see-the-spend-first",
      title: "See where the money goes",
      blocks: [
        {
          kind: "h3",
          id: "see-where-the-money-goes",
          title: "Cloud costing with tags",
        },
        {
          kind: "p",
          text: [
            "Cloud costing starts with ownership: who owns each line in your cost reports. ",
            { a: "Tags", href: "/learn/glossary/cost-allocation-tags" },
            " let Microsoft Cost Management and AWS Cost Explorer split costs by team, application and environment. On Azure, four rules decide whether and when a tag shows up:",
          ],
        },
        {
          kind: "ul",
          items: [
            "A tag applies only to usage while it’s on the resource.",
            "A resource group’s tags reach its resources’ usage only if you turn on tag inheritance.",
            "Some resource types don’t carry tags into usage data at all.",
            "Cost data arrives late: usually within 8 to 24\u00a0hours for Enterprise Agreement and Microsoft Customer Agreement subscriptions, and up to 72\u00a0hours for pay-as-you-go.",
          ],
        },
        {
          kind: "p",
          text: [
            "So tag first and analyze a few days later. In cost reports, a Kubernetes cluster shows up only as its machines. To split it by team, you need a view from inside the cluster, such as ",
            { a: "AKS cost analysis", href: "/learn/aks-cost-analysis" },
            ".",
          ],
        },
        {
          kind: "h3",
          id: "cloud-cost-management-three-standing-rules",
          title: "Cloud cost management rules",
        },
        {
          kind: "p",
          text: [
            "Cloud cost management needs ",
            { a: "standing rules", href: "/learn/glossary/cloud-cost-governance" },
            ", or costs drift back up. Start with three:",
          ],
        },
        {
          kind: "ul",
          items: [
            "Every resource carries the tags your reports group by.",
            "Every subscription or account has a budget with an alert.",
            "Someone reads the biggest lines every month.",
          ],
        },
        {
          kind: "p",
          text: "To manage cloud costs, let the biggest lines pick the fix. VM compute points to architecture and idle VMs, cluster node VMs to Kubernetes, and disks to block storage.",
        },
      ],
    },
    {
      id: "fix-the-architecture-that-sets-your-cloud",
      title: "Fix the architecture",
      blocks: [
        {
          kind: "p",
          text: "An app on its own VM is sized for its own peak. A running VM is charged for that peak around the clock, so three apps on three VMs carry three peaks.",
        },
        {
          kind: "p",
          text: [
            "A shared pool, such as a Kubernetes cluster, holds what its apps reserve. Let that follow each app’s demand, for example with the ",
            {
              a: "Horizontal Pod Autoscaler (HPA)",
              href: "/learn/glossary/horizontal-pod-autoscaler",
            },
            " adding and removing pods. Then the pool needs room only for the combined peak, which is smaller whenever the peaks don’t line up.",
          ],
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: [
            "The ",
            {
              a: "container vs VM",
              href: "/learn/poor-architecture-cloud-bill",
            },
            " guide covers the decisions that cost most, such as development and test environments left running all day. Architecture changes need a pilot, so start them early and make the quicker fixes below in the meantime.",
          ],
        },
      ],
    },
    {
      id: "remove-what-nothing-uses",
      title: "Remove idle resources",
      blocks: [
        {
          kind: "p",
          text: "A VM that looks off can still be charged. Azure charges a VM in the Stopped state, also called Stopped (allocated), for instance usage. A shutdown from inside the guest OS leaves it there.",
        },
        {
          kind: "p",
          text: [
            "Only a deallocated VM, shown as Stopped (deallocated), stops that charge. In the Azure CLI, ",
            { code: "az vm stop" },
            " powers a VM off and keeps it allocated, and ",
            { code: "az vm deallocate" },
            " releases it. A deallocated VM still pays for its disks and networking.",
          ],
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "A development VM is needed 10\u00a0hours a day, Monday to Friday: 10 × 5 = 50 of the week’s 168\u00a0hours. Deallocated on a schedule for the other 118 (168 − 50), it carries no instance charge in about 70% of the week (118 ÷ 168). Shut down inside the guest OS instead, it pays for instance usage in all 168.",
        },
        { kind: "svg", figure: figure3 },
        {
          kind: "p",
          text: [
            "Then clear the leftovers: disks and snapshots of deleted VMs. ",
            { a: "Finding unattached disks in Azure", href: "/learn/find-unattached-disks-azure" },
            " shows how to list the disks. The snapshot guides for ",
            { a: "Azure", href: "/learn/azure-disk-snapshot-cost" },
            " and ",
            { a: "Amazon Elastic Block Store (EBS)", href: "/learn/ebs-snapshot-cost" },
            " explain what a snapshot is charged for.",
          ],
        },
        {
          kind: "p",
          text: "Deleting a disk deletes its data, so confirm the owner from its tags before you remove it.",
        },
      ],
    },
    {
      id: "reduce-kubernetes-requests-then-nodes",
      title: "Reduce Kubernetes requests, then nodes",
      blocks: [
        {
          kind: "p",
          text: "In Kubernetes, a request is the CPU and memory a container asks the cluster to set aside. Node autoscalers such as the Cluster Autoscaler and Karpenter add nodes until every pod’s requests fit.",
        },
        {
          kind: "p",
          text: "They remove nodes by requests too: the Kubernetes documentation says consolidation considers only Pod requests, not real usage. So a request padded for a worst case holds node capacity that no autoscaler gives back.",
        },
        { kind: "p", text: "Take two steps:" },
        {
          kind: "ol",
          items: [
            [
              "Bring each container’s requests close to what it uses, from its own usage history, with ",
              { a: "headroom", href: "/learn/glossary/kubernetes-headroom" },
              " for its peaks. ",
              { a: "Kubernetes pod right sizing", href: "/learn/kubernetes-pod-right-sizing" },
              " shows how, and ",
              { a: "Kubernetes overprovisioning", href: "/learn/kubernetes-overprovisioning" },
              " shows where the extra tends to sit.",
            ],
            [
              "Let the nodes go. Once smaller requests give a node’s pods room elsewhere, the autoscaler can drain the node and remove it. If a node stays, ",
              {
                a: "Cluster Autoscaler not scaling down",
                href: "/learn/cluster-autoscaler-not-scaling-down",
              },
              " lists what holds it and what frees it.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            { a: "VPA vs HPA", href: "/learn/vpa-vs-hpa" },
            " covers how requests and the HPA meet on CPU. ",
            {
              a: "Kubernetes cost optimization",
              href: "/kubernetes-cost-optimization",
            },
            " walks through both steps on AKS and EKS.",
          ],
        },
      ],
    },
    {
      id: "bring-block-storage-back-to-the-size",
      title: "Rightsize block storage",
      blocks: [
        {
          kind: "p",
          text: "Block storage is charged for the space you provision, not the data on it. Space bought for a migration or a one-off import is still charged after the data has gone.",
        },
        {
          kind: "p",
          text: "And the size only goes one way. Microsoft Learn says shrinking an existing managed disk “isn’t supported and might result in data loss.” EBS Elastic Volumes can increase a volume’s size, change its type or adjust its performance, but can’t decrease its size.",
        },
        {
          kind: "callout",
          label: "For engineers",
          text: [
            "Azure charges a Standard SSD at its size tier, a Premium SSD at its ",
            { a: "performance tier", href: "/learn/azure-disk-performance-tiers" },
            " and a Premium SSD v2 per GiB. On EBS, an enlarged volume is charged at its new size from the moment the modification starts.",
          ],
        },
        {
          kind: "p",
          text: [
            "Start by comparing used with provisioned space on every disk, ",
            { a: "on Azure VMs", href: "/learn/azure-vm-disk-usage" },
            " and ",
            { a: "on EBS", href: "/learn/check-ebs-volume-usage" },
            ". The ",
            { a: "EBS and Azure disk pricing", href: "/ebs-and-azure-disk-pricing" },
            " calculator prices one disk or volume.",
          ],
        },
        {
          kind: "p",
          text: [
            "Some fixes need no copy. On a supported instance, Elastic Volumes change a volume’s type while it stays attached, so a ",
            { a: "move from gp2 to gp3", href: "/learn/gp2-vs-gp3" },
            " is a small job. On Azure, every Premium SSD v2 includes 3,000\u00a0IOPS and 125\u00a0MB/s at no charge, so ",
            { a: "compare it with Premium SSD", href: "/learn/premium-ssd-v2-vs-premium-ssd" },
            " before you resize.",
          ],
        },
        {
          kind: "p",
          text: [
            "Making a disk smaller is the hard part. You copy the data to a new, smaller disk and switch the mount over, which stops the services that use it. ",
            {
              a: "Can you shrink an Azure managed disk?",
              href: "/learn/shrink-azure-managed-disk",
            },
            " and ",
            { a: "how to shrink an EBS volume", href: "/learn/shrink-ebs-volume" },
            " walk through it.",
          ],
        },
      ],
    },
    {
      id: "commit-to-the-baseline-thats-left",
      title: "Buy commitments last",
      blocks: [
        {
          kind: "p",
          text: "Reservations and savings plans reduce the price per hour, not the amount you use. Buy them last, sized to the steady usage the steps above leave.",
        },
        {
          kind: "p",
          text: "Picture a team that buys a one-year Azure savings plan sized to this month’s compute. Then it deallocates its development VMs every night and lets two spare nodes go. It still pays the full commitment every hour, though part of the usage it was sized for is gone.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: "An Azure savings plan is a fixed hourly commitment for one or three years. Each hour, Azure applies it to eligible usage and charges anything beyond it at pay-as-you-go rates. Any unused part expires without rolling over.",
        },
        {
          kind: "p",
          text: "Azure savings plans can’t be canceled or refunded, and the one for compute doesn’t cover storage. AWS Savings Plans also run for one or three years, and AWS puts their saving at up to 72% on compute.",
        },
        {
          kind: "p",
          text: "Azure Advisor recommends a savings plan commitment from your eligible on-demand usage, and AWS Cost Explorer recommends a Savings Plans commitment. Act on either only once the usage behind it comes from after your last fix.",
        },
        {
          kind: "callout",
          label: "Rule of thumb",
          text: "Choose an Azure reservation for stable, predictable usage. It locks the discount to a specific resource, size and region, and gives a deeper discount in return. Where an autoscaler keeps changing machine types, choose a savings plan. An Azure savings plan for compute applies across eligible services and regions. An AWS Compute Savings Plan applies regardless of instance family, size or Region.",
        },
      ],
    },
    {
      id: "where-coral-and-amoeba-fit",
      title: "Where Coral and Amoeba fit",
      blocks: [
        {
          kind: "p",
          text: "Two of these steps, requests and disks, never finish, because usage keeps moving.",
        },
        { kind: "h3", id: "coral-for-kubernetes", title: "Coral for Kubernetes" },
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " rebalances Kubernetes on AKS and EKS, without any downtime:",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Requests:" },
              " it rebalances each container’s CPU and memory requests to what it uses, once you switch on “Automatically optimize” for a policy or a workload.",
            ],
            [
              { b: "Nodes:" },
              " from install, it drains and removes the nodes you don’t need, one at a time, on the node pools you choose. Adding nodes for demand stays with your autoscaler.",
            ],
            [
              { b: "Moves:" },
              " pods resize in place on Kubernetes 1.33 or later, or are replaced one at a time within their PodDisruptionBudgets. When Coral drains a node, eligible Deployments and Argo Rollouts get a warm handover, even with one replica. A new copy is Ready on another node before the old pod goes. Other pods move by live migration where both nodes support it.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "On ",
            { a: "our own AKS development cluster", href: "/coral-value-lab" },
            ", Coral removed a spare 4-CPU node and rebalanced the requests of 14 apps. Then it swapped the last worker for a cheaper machine of the same size. Eight days after we connected it, the machines cost $154.76 a month instead of $368.65 at Azure list prices, 58% less.",
          ],
        },
        {
          kind: "p",
          text: [
            "Coral prices its cloud cost savings at list price and ",
            {
              a: "leaves discounts, reservations and savings plans out",
              href: "/coral-faq#how-is-the-saving-worked-out",
            },
            ". Check its figures against your own rates before you size a commitment.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "AKS cost optimization", href: "/aks-cost-optimization" },
            " and ",
            { a: "EKS cost optimization", href: "/eks-cost-optimization" },
            " show what Coral does on each cloud.",
          ],
        },
        { kind: "h3", id: "amoeba-for-block-storage", title: "Amoeba for block storage" },
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " rightsizes block storage on ",
            { a: "Azure managed disks", href: "/azure-managed-disk-cost-optimization" },
            " and ",
            { a: "Amazon EBS", href: "/ebs-cost-optimization" },
            ", for Windows and Linux VMs. It moves a VM’s data disks onto one btrfs pool sized to your data, with room to grow.",
          ],
        },
        {
          kind: "p",
          text: "Then it grows and shrinks the pool as your data changes, without any downtime, so you pay for close to what you use. Amoeba is in early access.",
        },
        {
          kind: "p",
          text: [
            "To compare Coral and Amoeba with other tools, see ",
            { a: "cloud cost optimization tools", href: "/cloud-cost-optimization-library" },
            ".",
          ],
        },
      ],
    },
  ],
  help: {
    text: "Coral rebalances Kubernetes on AKS and EKS, and Amoeba rightsizes block storage on Azure and AWS. We estimate 40–50% off AKS and EKS cost and 50–60% off block storage cost. They are estimated ranges, not a promise. The free assessment works out your own figure.",
    links: [
      { label: "Kubernetes optimization with Coral", href: "/coral" },
      { label: "Block storage optimization with Amoeba", href: "/amoeba" },
      { label: "Estimate your saving", href: "/assessment" },
    ],
  },
  sources: [
    {
      publisher: "Microsoft Learn",
      title: "“Understand Cost Management data”",
      url: "https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/understand-cost-mgt-data",
    },
    {
      publisher: "Microsoft Learn",
      title: "“States and billing status - Azure Virtual Machines”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/states-billing",
    },
    {
      publisher: "Microsoft Learn",
      title: "“az vm”",
      url: "https://learn.microsoft.com/en-us/cli/azure/vm",
    },
    {
      publisher: "Kubernetes",
      title: "“Node Autoscaling”",
      url: "https://kubernetes.io/docs/concepts/cluster-administration/node-autoscaling/",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Understand Azure Disk Storage billing”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-understand-billing",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Expand Virtual Hard Disks on a Linux VM”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/linux/expand-disks",
    },
    {
      publisher: "AWS",
      title: "“Modify an Amazon EBS volume using Elastic Volumes operations”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-modify-volume.html",
    },
    {
      publisher: "AWS",
      title: "“What are Savings Plans?”",
      url: "https://docs.aws.amazon.com/savingsplans/latest/userguide/what-is-savings-plans.html",
    },
    {
      publisher: "Microsoft Learn",
      title: "“What are savings plans?”",
      url: "https://learn.microsoft.com/en-us/azure/cost-management-billing/savings-plan/savings-plan-overview",
    },
  ],
  related: [
    {
      title: "Container vs VM: which costs less?",
      where: "Learn",
      href: "/learn/poor-architecture-cloud-bill",
    },
    {
      title: "How we reduced our own AKS cluster’s machine cost by 58%",
      where: "Coral Value Lab",
      href: "/coral-value-lab",
    },
    {
      title: "Kubernetes cost optimization",
      where: "Learn",
      href: "/kubernetes-cost-optimization",
    },
    {
      title: "Can you shrink an Azure managed disk?",
      where: "Learn",
      href: "/learn/shrink-azure-managed-disk",
    },
    {
      title: "How is the saving worked out?",
      where: "Coral FAQ",
      href: "/coral-faq#how-is-the-saving-worked-out",
    },
  ],
};
