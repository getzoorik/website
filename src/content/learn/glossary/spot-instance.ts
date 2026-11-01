import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/spot-instance/1";

export const term: GlossaryTerm = {
  slug: "spot-instance",
  term: "Spot instance (AWS Spot Instances, Azure Spot VMs)",
  title: "What are spot instances in AWS and Azure?",
  meta: "AWS spot instances and Azure spot VMs use spare capacity at a discount, and can be taken back. See the warning you get, when to use them, and AKS spot pools.",
  h1: "What are spot instances in AWS and Azure?",
  card: "A spot instance is a cloud virtual machine (VM) that runs on spare capacity, for less than the on-demand price.",
  group: "finops-pricing",
  product: "coral",
  published: "2026-10-25",
  updated: "2026-11-01",
  definition: [
    {
      kind: "p",
      text: [
        "A spot instance is a cloud virtual machine (VM) that runs on spare capacity, for less than the ",
        { a: "on-demand", href: "/learn/glossary/on-demand-instance" },
        " price. The cloud can evict it (take it back) when it needs that capacity. AWS warns you two minutes before, and Azure up to 30\u00a0seconds before, on a best-effort basis.",
      ],
    },
    { kind: "svg", figure: figure1 },
  ],
  sections: [
    {
      id: "spot-instances-vs-on-demand",
      title: "Spot instances vs on-demand",
      blocks: [
        {
          kind: "ul",
          items: [
            "On-demand runs until you stop it. Spot runs while spare capacity lasts.",
            "On AWS, spot prices shift slowly with supply and demand. The on-demand rate doesn’t.",
            "AWS says spot saves up to 90% off on-demand prices (October 2026). Prices change.",
            "Azure gives spot VMs no service level agreement (SLA).",
          ],
        },
      ],
    },
    {
      id: "spot-pools-on-aks",
      title: "Azure spot instances and AKS spot node pools",
      blocks: [
        {
          kind: "p",
          text: [
            "A spot instance in Azure is an Azure Spot VM. An AKS spot node pool is a ",
            { a: "node pool", href: "/learn/glossary/node-pool" },
            " made of them.",
          ],
        },
        {
          kind: "ul",
          items: [
            "It can’t be the default pool.",
            [
              "Its nodes carry the taint ",
              { code: "kubernetes.azure.com/scalesetpriority=spot:NoSchedule" },
              ", so only pods with a matching toleration run there.",
            ],
            "After an eviction, the Cluster Autoscaler adds nodes that pods need.",
          ],
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for your cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            "Spot reduces each node’s price. It suits work that can stop and restart, like batch jobs and test environments.",
            [
              "Requests that match real use mean fewer nodes. See ",
              { a: "Kubernetes cost optimization", href: "/kubernetes-cost-optimization" },
              ".",
            ],
            "An evicted Azure Spot VM’s disks still cost you under Deallocate, its default policy. AKS spot pools default to Delete.",
            [
              "Mark a cluster as non-production and turn on its spot switch. ",
              { a: "Coral", href: "/coral" },
              " can then plan spot nodes in pools that fall back to on-demand when spot runs out.",
            ],
            [
              "The ",
              { a: "free assessment", href: "/assessment?p=coral" },
              " works out your own figure.",
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
  next: {
    title: "Kubernetes cost optimization: requests, then nodes",
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
      title: "“Amazon EC2 Spot Instances”",
      url: "https://aws.amazon.com/ec2/spot/",
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
  ],
};
