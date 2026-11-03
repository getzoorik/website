import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/spot-instance/1";

export const term: GlossaryTerm = {
  slug: "spot-instance",
  term: "Spot instance (AWS Spot Instances, Azure Spot VMs)",
  title: "AWS spot instances and spot pricing",
  meta: "AWS spot instances run on spare EC2 capacity for less than on-demand, with a two-minute warning. How spot pricing works, and Azure spot VMs.",
  h1: "AWS spot instances and spot pricing",
  card: "A spot instance is a virtual machine (VM) that runs on a cloud’s spare capacity for less than the on-demand price.",
  group: "finops-pricing",
  product: "coral",
  published: "2026-10-25",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: [
        "A spot instance is a virtual machine (VM) that runs on a cloud’s spare capacity for less than the ",
        { a: "on-demand", href: "/learn/glossary/on-demand-instance" },
        " price. The cloud takes it back when it needs that capacity.",
      ],
    },
    {
      kind: "p",
      text: "On AWS, Amazon EC2 gives a spot instance a two-minute warning. On Azure, a spot VM gets up to 30 seconds’ warning, on a best-effort basis.",
    },
    { kind: "svg", figure: figure1 },
  ],
  sections: [
    {
      id: "spot-pricing",
      title: "Spot pricing",
      blocks: [
        {
          kind: "p",
          text: "On AWS, the spot price is a spot instance’s hourly price. EC2 sets one for each instance type in each Availability Zone, and adjusts it gradually with long-term supply and demand.",
        },
        {
          kind: "p",
          text: "AWS quotes savings of up to 90% against on-demand prices (November 2026). The EC2 console shows three months of spot price history.",
        },
        {
          kind: "p",
          text: [
            "Azure spot prices vary by region and VM size. You can set a max price, and Azure evicts the VM when the spot price goes above it. A max price of ",
            { code: "-1" },
            " means no eviction for price.",
          ],
        },
      ],
    },
    {
      id: "spot-instances-vs-on-demand",
      title: "Spot vs on-demand",
      blocks: [
        {
          kind: "table",
          columns: [
            { label: "On AWS", width: "22%" },
            { label: "Spot instance", width: "39%" },
            { label: "On-demand instance", width: "39%" },
          ],
          rows: [
            ["Hourly price", "Set by EC2, changes gradually", "Fixed"],
            [
              "Interruption",
              "EC2 can take it back, with two minutes’ notice",
              "You decide when it stops",
            ],
            [
              "No capacity",
              "The request waits until capacity is free",
              "The launch fails with an insufficient capacity error",
            ],
          ],
        },
        {
          kind: "p",
          text: "Spot suits work that can stop and restart, such as batch jobs, CI/CD, test environments and stateless web servers. AWS doesn’t recommend it for stateful or fault-intolerant work.",
        },
      ],
    },
    {
      id: "spot-on-aws",
      title: "Spot on AWS",
      blocks: [
        {
          kind: "h3",
          id: "interruption-notices-and-rebalance-recommendations",
          title: "Interruption notices",
        },
        {
          kind: "p",
          text: "An EC2 instance rebalance recommendation signals that a spot instance is at higher risk of interruption. It can come before the two-minute interruption notice, so you can act sooner.",
        },
        {
          kind: "p",
          text: "AWS suggests an Amazon EventBridge rule that catches both signals, then saves the work’s progress or shuts it down cleanly.",
        },
        {
          kind: "h3",
          id: "when-no-spot-capacity-is-available",
          title: "Getting spot capacity",
        },
        { kind: "p", text: "AWS’s best practices:" },
        {
          kind: "ul",
          items: [
            "Be flexible across at least 10 instance types for each workload.",
            "Use every Availability Zone.",
            ["Use the ", { code: "price-capacity-optimized" }, " allocation strategy."],
            "Check Spot placement scores, which point to the Regions or zones likelier to have capacity.",
          ],
        },
      ],
    },
    {
      id: "spot-pools-on-aks",
      title: "Azure spot instances",
      blocks: [
        {
          kind: "p",
          text: "Azure calls them Azure Spot Virtual Machines. They have no service level agreement (SLA).",
        },
        {
          kind: "ul",
          items: [
            "An evicted spot VM is deallocated by default, or deleted if you choose. A deallocated VM’s disks still cost you.",
            [
              "An AKS spot node pool is a ",
              { a: "node pool", href: "/learn/glossary/node-pool" },
              " of spot VMs. It can’t be the default pool, and its eviction policy defaults to Delete.",
            ],
            [
              "Its nodes carry the taint ",
              { code: "kubernetes.azure.com/scalesetpriority=spot:NoSchedule" },
              ", so only pods with a matching ",
              { a: "toleration", href: "/learn/kubernetes-taints-and-tolerations" },
              " run there.",
            ],
            "With the cluster autoscaler on, AKS adds nodes after an eviction if pods still need them.",
          ],
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Spot and cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            [
              "Spot reduces each node’s price. Requests that match real use reduce the number of nodes. See ",
              { a: "Kubernetes cost optimization", href: "/kubernetes-cost-optimization" },
              ".",
            ],
            "Spot gets no commitment discount. AWS Savings Plans don’t cover it, and Azure offers no reservations for spot VMs.",
            [
              "Mark a cluster as non-production and turn on its spot switch. ",
              { a: "Coral", href: "/coral" },
              " then plans spot nodes in pools that fall back to on-demand when spot runs out.",
            ],
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "On-demand instance",
      line: "The full price spot is measured against.",
      href: "/learn/glossary/on-demand-instance",
    },
    {
      title: "Node pool",
      line: "On AKS, spot or regular, fixed at creation.",
      href: "/learn/glossary/node-pool",
    },
    {
      title: "Reserved instance",
      line: "A discount for a usage commitment.",
      href: "/learn/glossary/reserved-instance",
    },
    {
      title: "Savings plan",
      line: "On AWS, it doesn’t cover spot.",
      href: "/learn/glossary/savings-plan",
    },
  ],
  relatedTitle: "Related terms",
  next: {
    title: "Kubernetes cost optimization",
    href: "/kubernetes-cost-optimization",
  },
  sources: [
    {
      publisher: "Amazon Web Services",
      title: "“Spot Instances”",
      url: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-instances.html",
      note: " (Amazon EC2 User Guide)",
    },
    {
      publisher: "Amazon Web Services",
      title: "“Best practices for Amazon EC2 Spot”",
      url: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-best-practices.html",
    },
    {
      publisher: "Microsoft Learn",
      title: "“About Azure Spot Virtual Machines”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/spot-vms",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Add an Azure Spot node pool to an Azure Kubernetes Service (AKS) cluster”",
      url: "https://learn.microsoft.com/en-us/azure/aks/spot-node-pool",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Understand Azure Reserved VM Instances discount”",
      url: "https://learn.microsoft.com/en-us/azure/cost-management-billing/manage/understand-vm-reservation-charges",
    },
  ],
};
