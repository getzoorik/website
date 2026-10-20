import type { Article } from "@/content/learn/article";

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
  short:
    "How to reduce cloud costs on Azure and AWS is mostly a question of order. Tag every resource so you can see where the money goes. Then fix the architecture, remove what nothing uses, shrink Kubernetes requests so spare nodes can go, and bring disks back to the size of their data. Buy reservations or savings plans last, sized to the baseline that remains, because you pay for a commitment every hour, used or not.",
  sections: [
    {
      id: "how-to-reduce-cloud-costs-start-with",
      title: "How to reduce cloud costs: start with where the money goes",
      blocks: [
        {
          kind: "p",
          text: "The ways to reduce cloud costs all work on one of two numbers: how much you use (machines, requests, disk sizes) and the price of each unit (commitments, cheaper machine types). Using less comes first: a commitment keeps billing after the capacity it was bought for is gone.",
        },
        {
          kind: "p",
          text: "First, find out who owns each line of the bill. Cost analysis in Microsoft Cost Management and AWS Cost Explorer show your spend over time, and tags let you split it by team, application and environment. On Azure, four rules decide whether a tag shows up:",
        },
        {
          kind: "ul",
          items: [
            "Cost Management applies a tag only to usage while it’s on the resource, not before you add it or after you remove it.",
            "Tags on a resource group don’t reach the usage records of the resources in it unless you turn on tag inheritance.",
            "Some resource types don’t carry tags into usage data at all.",
            "Cost data arrives late: typically within 8 to 24\u00a0hours for Enterprise Agreement and Microsoft Customer Agreement subscriptions, and up to 72\u00a0hours for pay-as-you-go.",
          ],
        },
        {
          kind: "p",
          text: [
            "So tag first and analyze a few days later. A Kubernetes cluster appears on the bill as its machines, so splitting it by team needs a view from inside the cluster, which ",
            { a: "AKS cost analysis", href: "/learn/aks-cost-analysis" },
            " covers. ",
            { a: "Kubernetes cost estimation", href: "/learn/kubernetes-cost-estimation" },
            " works out how many machines the cluster needs.",
          ],
        },
        {
          kind: "p",
          text: "Managing cloud costs effectively also needs standing rules, or the bill drifts back. Cloud governance to reduce costs can be short: every resource carries the tags your reports group by, every subscription or account has a budget with an alert, and someone reads the biggest lines every month. On Azure you can set a budget the moment a subscription is created, and Azure Policy can enforce the tags.",
        },
      ],
    },
    {
      id: "fix-the-architecture-that-sets-the-bill",
      title: "Fix the architecture that sets the bill",
      blocks: [
        {
          kind: "p",
          text: "Architecture decides how much capacity each workload carries before any tuning starts. An app on its own VM is sized for its own peak, and a running VM bills for that peak around the clock. Ten apps on ten VMs carry ten peaks. On a shared pool such as a Kubernetes cluster, the same apps need room for their combined demand, which is smaller whenever their peaks don’t line up.",
        },
        {
          kind: "p",
          text: [
            {
              a: "How poor architecture increases your cloud bill",
              href: "/learn/poor-architecture-cloud-bill",
            },
            " walks through the decisions that cost most, including sizing for a theoretical peak instead of measured demand, running compatible workloads in isolation, adding hardware to hide slow code, and leaving development and test environments running all day.",
          ],
        },
        {
          kind: "p",
          text: "Architecture changes need a pilot, so start them early and run the quicker fixes below alongside.",
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
            "Start with VMs that look off but still bill. Azure bills a VM in the Stopped state, also called Stopped (allocated), for instance usage, and that’s where a shutdown from inside the guest OS leaves it. Only a deallocated VM, shown as Stopped (deallocated), has released the hardware and stopped that charge. In the Azure CLI, ",
            { code: "az vm stop" },
            " keeps the compute resources and ",
            { code: "az vm deallocate" },
            " releases them. A deallocated VM still pays for its disks and networking.",
          ],
        },
        {
          kind: "p",
          text: "Then look at schedules. A development VM needed 10\u00a0hours a day, Monday to Friday, is needed for 50 of the week’s 168\u00a0hours. Deallocated for the other 118, it carries no instance charge in them.",
        },
        {
          kind: "p",
          text: [
            "Then the leftovers: disks and snapshots from VMs that no longer exist. ",
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
          text: "A Kubernetes cluster bills for its nodes, and the number of nodes follows requests: the CPU and memory each container asks the cluster to set aside for it. The two node autoscalers SIG Autoscaling currently sponsors, the Cluster Autoscaler and Karpenter, add nodes until every pod’s requests fit. They also remove underused nodes. The Kubernetes documentation says this consolidation, like provisioning, considers only Pod requests and not real usage.",
        },
        {
          kind: "p",
          text: "So a request set for a worst case that never comes holds node capacity that nothing uses and no node autoscaler will give back. The same documentation says correct Pod requests matter as much to a cluster’s cost-effectiveness as node utilization does.",
        },
        { kind: "p", text: "The fix has two steps, in order:" },
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
            "The Horizontal Pod Autoscaler (HPA) changes how many pods run, while requests decide how big each one is. ",
            { a: "VPA vs HPA", href: "/learn/vpa-vs-hpa" },
            " covers how the two meet on CPU, and ",
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
          text: "Block storage bills for the space you provision. On Azure managed disks, a Standard SSD bills at the tier its size falls in, a Premium SSD at its performance tier (set by its size unless you pick a higher one), and a Premium SSD v2 per GiB. Azure snapshots bill for the data they hold. On EBS, you’re charged for a volume’s configuration, so a volume you enlarge bills at its new size from the moment the modification starts.",
        },
        {
          kind: "p",
          text: "The size only goes one way. Microsoft Learn says shrinking an existing managed disk “isn’t supported and might result in data loss.” EBS Elastic Volumes can increase a volume’s size, change its type or adjust its performance, but can’t decrease its size. Space bought for a migration or a one-off import stays on the bill after the data has gone.",
        },
        {
          kind: "p",
          text: [
            "Start by comparing used with provisioned space on every disk, ",
            { a: "on Azure VMs", href: "/learn/azure-vm-disk-usage" },
            " and ",
            { a: "on EBS", href: "/learn/check-ebs-volume-usage" },
            ". Then take the fixes that need no copy. On an instance that supports Elastic Volumes, a type change runs while the volume stays attached, which makes a ",
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
            " walk through it, and ",
            { a: "Azure disk cost optimization", href: "/learn/azure-disk-cost-optimization" },
            " covers the rest of the disk bill.",
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
          text: "Commitments reduce cloud computing costs through the price per hour. AWS Savings Plans trade a commitment to an amount of compute, measured per hour, over one or three years, for savings of up to 72% on compute. An Azure savings plan is a fixed hourly spend for one or three years: each hour, Azure applies it to eligible usage, bills anything beyond it at pay-as-you-go rates, and lets any commitment the hour didn’t use expire without rolling over. Azure savings plans can’t be canceled or refunded.",
        },
        {
          kind: "p",
          text: "So measure the steady usage left after the steps above, and commit to that floor.",
        },
        {
          kind: "p",
          text: "Then choose the kind. Azure reservations lock the discount to a specific resource, size and region, and give deeper discounts in return, so they suit stable, predictable usage. Savings plans apply across eligible services and regions, which fits a cluster whose autoscaler keeps changing the machine types. Azure’s savings plan for compute doesn’t cover storage. Azure Advisor recommends a savings plan commitment from your eligible on-demand usage, and AWS Cost Explorer shows a recommended Savings Plans commitment. Before you act on either, wait until your usage reflects your changes.",
        },
      ],
    },
    {
      id: "where-coral-and-amoeba-fit",
      title: "Where Coral and Amoeba fit",
      blocks: [
        {
          kind: "p",
          text: "Two of these steps never finish, because usage keeps moving: requests in a Kubernetes cluster, and disks under data that grows and shrinks.",
        },
        {
          kind: "p",
          text: [{ a: "Coral", href: "/coral" }, " optimizes Kubernetes on AKS and EKS:"],
        },
        {
          kind: "ul",
          items: [
            "It rebalances each container’s CPU and memory requests to what it uses, once you switch on “Automatically optimize” for a policy or a workload.",
            "From install, it drains spare nodes one at a time, on the node pools you choose, so your Cluster Autoscaler, Karpenter or AKS node auto-provisioning (NAP) can remove them. Scale-up stays with your autoscaler: Coral never adds nodes for demand. Pools that Karpenter or NAP already consolidate are left to them.",
            "Pods resize in place on nodes running Kubernetes 1.33 or later, or restart one at a time within their PodDisruptionBudgets. When Coral drains a node, an eligible Deployment or Argo Rollout gets a warm handover, even with one replica: a new copy is Ready on another node before the old pod goes. Other single-copy apps restart when they move.",
          ],
        },
        {
          kind: "p",
          text: [
            "On ",
            { a: "our own AKS development cluster", href: "/case-studies/coral-dev-cluster" },
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
            " optimizes block storage on Azure managed disks and Amazon EBS. It moves a VM’s data disks onto one pool sized to the data, holds it 80% to 90% full by default, and rightsizes it one disk at a time. On Linux, the systemd services that use the data mounts restart at the switch onto the pool, and every resize after it runs without unmounting. We estimate it takes 50–60% off block storage cost. It is an estimated range, not a promise. Amoeba is in early access, and ",
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
      title: "How Poor Infrastructure Architecture Quietly Increases Your Cloud Bill",
      where: "Learn",
      href: "/learn/poor-architecture-cloud-bill",
    },
    {
      title: "How we reduced our own cluster’s machine bill by 58%",
      where: "Case study",
      href: "/case-studies/coral-dev-cluster",
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
