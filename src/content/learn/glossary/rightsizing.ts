import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/rightsizing/1";

export const term: GlossaryTerm = {
  slug: "rightsizing",
  term: "Rightsizing (cloud)",
  title: "What is rightsizing in cloud?",
  meta: "Rightsizing in cloud matches VMs, disks and databases to what they need. See how AWS and Azure find oversized VMs, and why you pay for a disk’s full size.",
  h1: "What is rightsizing in cloud?",
  card: "Rightsizing in cloud cost optimization means matching a resource’s size to what it needs, based on measured use.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-25",
  updated: "2026-11-01",
  definition: [
    {
      kind: "p",
      text: "Rightsizing in cloud cost optimization means matching a resource’s size to what it needs, based on measured use. It applies to virtual machines (VMs), disks and databases. You change the size, type or count, or shut down idle ones.",
    },
  ],
  sections: [
    {
      id: "provisioned-vs-used-storage",
      title: "Right sizing cloud storage: provisioned vs used",
      blocks: [
        {
          kind: "p",
          text: "Right sizing cloud storage compares the size you provisioned with the data on it. Azure managed disks and Amazon EBS volumes are charged by provisioned size.",
        },
        { kind: "p", text: "Take Microsoft’s example:" },
        {
          kind: "ul",
          items: [
            "A 1\u00a0TiB Standard SSD holds 120\u00a0GiB. You pay for all 1\u00a0TiB (the E30 tier).",
            "Its snapshots are charged only for the 120\u00a0GiB used.",
          ],
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "rightsizing-in-aws-and-azure",
      title: "AWS rightsizing and Azure rightsizing",
      blocks: [
        {
          kind: "ul",
          items: [
            "In AWS, the Well-Architected Framework says to rightsize instances whose peak CPU and memory stay under 40% for four weeks.",
            "AWS Compute Optimizer and AWS Trusted Advisor give rightsizing advice.",
            "For rightsizing in Azure, Azure Advisor suggests a cheaper VM size that fits the current load. It reads CPU, memory and outbound network use over 7\u00a0days by default, or up to 90.",
          ],
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why rightsizing matters for your cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            "You pay for what you provision, busy or idle.",
            [
              { a: "Amoeba", href: "/amoeba" },
              " moves a VM’s data disks onto one pool sized to your data, then rightsizes it autonomously. It works on Azure managed disks and Amazon EBS volumes, on Windows and Linux VMs.",
            ],
            [
              { a: "Coral", href: "/coral" },
              " rebalances CPU and memory requests on AKS and EKS to ",
              { a: "match real use", href: "/learn/kubernetes-pod-right-sizing" },
              ". The same pods fit on fewer nodes, and Coral drains spare ones so your autoscaler can remove them.",
            ],
            ["The ", { a: "free assessment", href: "/assessment" }, " works out your own figure."],
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "FinOps",
      line: "The practice of managing cloud cost.",
      href: "/learn/glossary/finops",
    },
    {
      title: "Azure managed disk",
      line: "Azure’s block storage for VMs, charged by provisioned size.",
      href: "/learn/glossary/azure-managed-disk",
    },
    { title: "EBS volume", line: "AWS block storage for EC2.", href: "/learn/glossary/ebs-volume" },
    {
      title: "Resource requests",
      line: "The CPU and memory a container asks for.",
      href: "/learn/glossary/kubernetes-resource-requests",
    },
  ],
  next: { title: "Kubernetes pod right sizing", href: "/learn/kubernetes-pod-right-sizing" },
  sources: [
    {
      publisher: "AWS",
      title: "“COST06-BP03 Select resource type, size, and number automatically based on metrics”",
      url: "https://docs.aws.amazon.com/wellarchitected/latest/framework/cost_type_size_number_resources_metrics.html",
    },
    {
      publisher: "Microsoft Learn",
      title:
        "“Optimize virtual machine (VM) or virtual machine scale set (VMSS) spend by resizing or shutting down underutilized instances”",
      url: "https://learn.microsoft.com/en-us/azure/advisor/advisor-cost-recommendations",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Understand Azure Disk Storage billing”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-understand-billing",
    },
    { publisher: "AWS", title: "“Amazon EBS pricing”", url: "https://aws.amazon.com/ebs/pricing/" },
  ],
};
