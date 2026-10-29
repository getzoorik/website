import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/how-to-reduce-cloud-costs/1";
import { figure as figure2 } from "@/features/learn/figures/how-to-reduce-cloud-costs/2";
import { figure as figure3 } from "@/features/learn/figures/how-to-reduce-cloud-costs/3";

export const article: Article = {
  slug: "how-to-reduce-cloud-costs",
  title: "How to reduce cloud costs: what moves the bill",
  meta: "How to reduce cloud costs on Azure and AWS, in order: tag the spend, fix the architecture, remove idle resources, shrink requests and disks, then commit.",
  h1: "How to reduce cloud costs: the fixes that move the bill",
  deck: "Where the money goes, which fixes move it most, and the order to make them in, on Azure and AWS.",
  card: "The order that moves an Azure or AWS bill: tags, architecture, idle resources, Kubernetes, disks, commitments.",
  product: "both",
  hub: "Cloud cost",
  topic: "Cloud cost",
  published: "2026-10-21",
  updated: "2026-10-21",
  author: "udit",
  cover: "/learn-covers/zoorik-learn-how-to-reduce-cloud-costs-1200x630.webp",
  short:
    "Reduce cloud costs on Azure and AWS in this order. Tag every resource so you can see where the money goes. Then fix the architecture, remove what nothing uses, shrink Kubernetes requests so spare nodes can go, and bring disks back to the size of their data. Buy reservations or savings plans last, sized to the baseline that remains, because you pay for a commitment every hour, used or not.",
  sections: [
    {
      id: "how-to-reduce-cloud-costs-see-the",
      title: "How to reduce cloud costs: see the bill first, commit last",
      blocks: [
        {
          kind: "p",
          text: "Picture a team that buys a one-year Azure savings plan, a fixed hourly spend sized to this month’s compute, then deallocates its development VMs every night and lets two spare nodes go. The plan still bills in full every hour, though part of the usage it was sized for is gone, and whatever an hour doesn’t use expires.",
        },
        { kind: "p", text: "Take the ways to reduce cloud costs in order:" },
        {
          kind: "ol",
          items: [
            "See where the money goes.",
            "Fix the architecture.",
            "Remove what nothing uses.",
            "Reduce Kubernetes requests, then nodes.",
            "Bring disks back to the size of their data.",
            "Commit to the baseline that’s left.",
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: "First, find out who owns each line of the bill. Tags let Cost analysis in Microsoft Cost Management and AWS Cost Explorer split your spend by team, application and environment. On Azure, four rules decide whether and when a tag shows up:",
        },
        {
          kind: "ul",
          items: [
            "Cost Management applies a tag only to usage while it’s on the resource.",
            "A resource group’s tags reach its resources’ usage records only if you turn on tag inheritance.",
            "Some resource types don’t carry tags into usage data at all.",
            "Cost data arrives late: typically within 8 to 24\u00a0hours for Enterprise Agreement and Microsoft Customer Agreement subscriptions, and up to 72\u00a0hours for pay-as-you-go.",
          ],
        },
        {
          kind: "p",
          text: [
            "So tag first and analyze a few days later. A Kubernetes cluster appears on the bill as its machines, so splitting it by team needs a view from inside the cluster, which ",
            { a: "AKS cost analysis", href: "/learn/aks-cost-analysis" },
            " covers.",
          ],
        },
        {
          kind: "p",
          text: "Managing cloud costs effectively needs standing rules, or the bill drifts back. For cloud governance to reduce costs, start with three: every resource carries the tags your reports group by, every subscription or account has a budget with an alert, and someone reads the biggest lines every month. Let those lines pick the fix that moves your bill most: VM compute points to architecture and idle VMs, cluster node VMs to Kubernetes, and disks to block storage.",
        },
      ],
    },
    {
      id: "fix-the-architecture-that-sets-the-bill",
      title: "Fix the architecture that sets the bill",
      blocks: [
        {
          kind: "p",
          text: "An app on its own VM is sized for its own peak, and a running VM bills for that peak around the clock, so three apps on three VMs carry three peaks. A shared pool such as a Kubernetes cluster holds what its apps reserve. Once that follows each app’s demand, for example with the Horizontal Pod Autoscaler (HPA) adding and removing pods, the pool needs room only for the combined demand, which is smaller whenever the peaks don’t line up.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: [
            {
              a: "How poor architecture increases your cloud bill",
              href: "/learn/poor-architecture-cloud-bill",
            },
            " walks through the decisions that cost most, such as leaving development and test environments running all day. Architecture changes need a pilot, so start them early and run the quicker fixes below alongside.",
          ],
        },
      ],
    },
    {
      id: "remove-what-nothing-uses",
      title: "Remove what nothing uses",
      blocks: [
        {
          kind: "p",
          text: [
            "A VM that looks off can still bill. Azure bills a VM in the Stopped state, also called Stopped (allocated), for instance usage, and that’s where a shutdown from inside the guest OS leaves it. Only a deallocated VM, shown as Stopped (deallocated), has released the hardware and stopped that charge. In the Azure CLI, ",
            { code: "az vm stop" },
            " keeps the compute resources and ",
            { code: "az vm deallocate" },
            " releases them. A deallocated VM still pays for its disks and networking.",
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
            "Then the leftovers: disks and snapshots of deleted VMs. ",
            { a: "Finding unattached disks in Azure", href: "/learn/find-unattached-disks-azure" },
            " shows how to list the disks, and the snapshot guides for ",
            { a: "Azure", href: "/learn/azure-disk-snapshot-cost" },
            " and ",
            { a: "Amazon Elastic Block Store (EBS)", href: "/learn/ebs-snapshot-cost" },
            " explain what a snapshot bills for. Deleting a disk deletes its data, so confirm the owner from its tags before you remove it.",
          ],
        },
      ],
    },
    {
      id: "reduce-kubernetes-requests-then-nodes",
      title: "Reduce Kubernetes requests, then nodes",
      blocks: [
        {
          kind: "p",
          text: "In Kubernetes, a request is the CPU and memory a container asks the cluster to set aside for it. A request set for a worst case that never comes holds node capacity that nothing uses, and no node autoscaler will give it back.",
        },
        {
          kind: "p",
          text: "Node autoscalers such as the Cluster Autoscaler and Karpenter add nodes until every pod’s requests fit and remove underused nodes. The Kubernetes documentation says this removal (consolidation), like provisioning, considers only Pod requests and not real usage.",
        },
        { kind: "p", text: "The fix has two steps:" },
        {
          kind: "ol",
          items: [
            [
              "Bring each container’s requests close to what it uses, from its own usage history, with headroom for its peaks. ",
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
              " lists what holds a node in place and what releases it.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            { a: "VPA vs HPA", href: "/learn/vpa-vs-hpa" },
            " covers how requests and the HPA meet on CPU, and ",
            { a: "How to reduce Kubernetes cost", href: "/learn/reduce-kubernetes-cost" },
            " is the full walk-through for AKS and EKS.",
          ],
        },
      ],
    },
    {
      id: "bring-block-storage-back-to-the-size",
      title: "Bring block storage back to the size of its data",
      blocks: [
        {
          kind: "p",
          text: "Space bought for a migration or a one-off import stays on the bill after the data has gone. Block storage bills for the space you provision, and the size only goes one way. Microsoft Learn says shrinking an existing managed disk “isn’t supported and might result in data loss.” EBS Elastic Volumes can increase a volume’s size, change its type or adjust its performance, but can’t decrease its size.",
        },
        {
          kind: "callout",
          label: "For engineers",
          text: "On Azure managed disks, a Standard SSD bills at the tier its size falls in, a Premium SSD at its performance tier (set by its size unless you pick a higher one), and a Premium SSD v2 per GiB. On EBS, you’re charged for a volume’s configuration, so a volume you enlarge bills at its new size from the moment the modification starts.",
        },
        {
          kind: "p",
          text: [
            "Start by comparing used with provisioned space on every disk, ",
            { a: "on Azure VMs", href: "/learn/azure-vm-disk-usage" },
            " and ",
            { a: "on EBS", href: "/learn/check-ebs-volume-usage" },
            ". Some fixes need no copy. On an instance that supports Elastic Volumes, a type change runs while the volume stays attached, which makes a ",
            { a: "move from gp2 to gp3", href: "/learn/gp2-vs-gp3" },
            " a small job. On Azure, every Premium SSD v2 includes 3,000\u00a0IOPS and 125\u00a0MB/s at no charge, so ",
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
      title: "Commit to the baseline that’s left",
      blocks: [
        {
          kind: "p",
          text: "Reservations and savings plans reduce cloud computing costs through the price per hour, not the amount you use. Savings plans on both clouds run for one or three years. AWS Savings Plans trade a commitment to an amount of compute, measured per hour, for savings of up to 72% on compute. An Azure savings plan is a fixed hourly spend: each hour, Azure applies it to eligible usage, bills anything beyond it at pay-as-you-go rates, and lets the rest expire without rolling over. Azure savings plans can’t be canceled or refunded, and the one for compute doesn’t cover storage.",
        },
        {
          kind: "p",
          text: "So measure the steady usage the steps above leave, and commit to that floor. Azure Advisor recommends a savings plan commitment from your eligible on-demand usage, and AWS Cost Explorer shows a recommended Savings Plans commitment. Before you act on either, wait until the usage behind it comes from after your last fix.",
        },
        {
          kind: "callout",
          label: "Rule of thumb",
          text: "Choose an Azure reservation for stable, predictable usage: it locks the discount to a specific resource, size and region, and gives a deeper discount in return. Where an autoscaler keeps changing the machine types, pick an Azure savings plan for compute, which applies across eligible services and regions, or an AWS Compute Savings Plan, which applies regardless of instance family, size or Region.",
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
        {
          kind: "p",
          text: [{ a: "Coral", href: "/coral" }, " optimizes Kubernetes on AKS and EKS:"],
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
              " from install, it drains spare nodes one at a time, on the node pools you choose, so your Cluster Autoscaler, Karpenter or AKS node auto-provisioning (NAP) can remove them. Coral never adds nodes for demand. Pools that Karpenter or NAP already consolidate are left to them.",
            ],
            [
              { b: "Disruption:" },
              " pods resize in place on nodes running Kubernetes 1.33 or later, or restart one at a time within their PodDisruptionBudgets. When Coral drains a node, an eligible Deployment or Argo Rollout gets a warm handover, even with one replica: a new copy is Ready on another node before the old pod goes. Any other app with a single copy restarts when it moves.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "On ",
            { a: "our own AKS development cluster", href: "/coral-value-lab" },
            ", Coral removed a spare 4-CPU worker on its own, rebalanced the requests of 14 apps, and swapped the remaining worker for a cheaper machine of the same size. Eight days after we connected it, the cluster’s machines cost $154.76 a month instead of $368.65 at Azure list prices, 58% less. None of its single-copy apps qualified for a warm handover, so during the swap each restarted once and was back up within 5 to 82\u00a0seconds. Coral prices each saving at list price and ",
            {
              a: "leaves discounts, reservations and savings plans out",
              href: "/coral/faq#how-is-the-saving-worked-out",
            },
            ", so check its figures against your own rates before you size a commitment.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " optimizes block storage on Azure managed disks and Amazon EBS. It moves a Windows or Linux VM’s data disks onto one pool sized to the data, holds it 80% to 90% full by default, and rightsizes it one disk at a time. On Linux, the systemd services that use the data mounts restart at the switch onto the pool, and every resize after it runs without unmounting. We estimate it takes 50–60% off block storage cost. It is an estimated range, not a promise. Amoeba is in early access, and ",
            { a: "the free block storage assessment", href: "/assessment?p=amoeba" },
            " works out your own figure.",
          ],
        },
      ],
    },
    {
      id: "every-learn-article-by-subject",
      title: "Every Learn article, by subject",
      blocks: [
        {
          kind: "p",
          text: "Each step above has articles of its own. Here they all are, by subject.",
        },
        { kind: "every" },
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
      title: "“Understand Cost Management data”",
      url: "https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/understand-cost-mgt-data",
    },
    {
      publisher: "Microsoft Learn",
      title: "“States and billing status - Azure Virtual Machines”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/states-billing",
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
      title: "How Poor Infra Architecture Quietly Increases Your Cloud Bill",
      where: "Learn",
      href: "/learn/poor-architecture-cloud-bill",
    },
    {
      title: "How we reduced our own cluster’s machine bill by 58%",
      where: "Case study",
      href: "/coral-value-lab",
    },
    {
      title: "How to reduce Kubernetes cost: rebalance requests, then remove spare nodes",
      where: "Learn",
      href: "/learn/reduce-kubernetes-cost",
    },
    {
      title: "Can you shrink an Azure managed disk?",
      where: "Learn",
      href: "/learn/shrink-azure-managed-disk",
    },
    {
      title: "How is the saving worked out?",
      where: "Coral FAQ",
      href: "/coral/faq#how-is-the-saving-worked-out",
    },
  ],
};
