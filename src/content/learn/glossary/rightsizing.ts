import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/rightsizing/1";

export const term: GlossaryTerm = {
  slug: "rightsizing",
  term: "Rightsizing (cloud)",
  title: "What is right sizing in the cloud?",
  meta: "Right sizing, or rightsizing, matches VMs, disks and databases to their use. How AWS and Azure find oversized VMs, and why you pay for a disk’s full size.",
  h1: "What is right sizing in the cloud?",
  card: "Right sizing, or rightsizing, means matching a cloud resource’s size to its measured use.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-25",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: "Right sizing, or rightsizing, means matching a cloud resource’s size to its measured use. You change the size, type or count of virtual machines (VMs), disks and databases, or shut down the idle ones.",
    },
  ],
  sections: [
    {
      id: "rightsizing-in-aws-and-azure",
      title: "Right sizing on AWS and Azure",
      blocks: [
        {
          kind: "ul",
          items: [
            [
              { b: "AWS" },
              ": the Well-Architected Framework says to right size instances whose peak CPU and memory stay under 40% for four weeks. AWS Compute Optimizer and AWS Trusted Advisor give rightsizing advice.",
            ],
            [
              { b: "Azure" },
              ": Azure Advisor suggests a cheaper VM size that fits the current load, from CPU, memory and outbound network use. It looks back 7 days by default, or up to 90.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Advisor’s savings figures use retail prices and leave out your reservations and ",
            { a: "savings plans", href: "/learn/glossary/savings-plan" },
            ", so they can be higher than you’ll see.",
          ],
        },
      ],
    },
    {
      id: "provisioned-vs-used-storage",
      title: "Right sizing storage",
      blocks: [
        {
          kind: "p",
          text: "Azure managed disks and Amazon EBS volumes are charged by provisioned size, not by the data on them.",
        },
        {
          kind: "p",
          text: "In Microsoft’s example, a 1 TiB Standard SSD holding 120 GiB is charged for all 1 TiB, at the E30 tier. Its snapshots are charged only for the 120 GiB used.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: [
            "Neither kind of disk can shrink. To right size one down, you copy its data to a smaller disk: see how to ",
            { a: "shrink an EBS volume", href: "/learn/shrink-ebs-volume" },
            " or ",
            { a: "an Azure managed disk", href: "/learn/shrink-azure-managed-disk" },
            ".",
          ],
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for cloud cost",
      blocks: [
        { kind: "p", text: "You pay for what you provision, busy or idle." },
        {
          kind: "ul",
          items: [
            [
              { a: "Amoeba", href: "/amoeba" },
              " moves a VM’s data disks onto one btrfs pool sized to your data, then rightsizes the pool autonomously. It works on Azure managed disks and Amazon EBS volumes, on Windows and Linux VMs.",
            ],
            [
              { a: "Coral", href: "/coral" },
              " rebalances CPU and memory requests on AKS and EKS to ",
              { a: "match real use", href: "/learn/kubernetes-pod-right-sizing" },
              ". The same pods fit on fewer nodes, and Coral removes the spare ones.",
            ],
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
  relatedTitle: "Related terms",
  next: {
    title: "Kubernetes requests vs limits",
    href: "/learn/kubernetes-pod-right-sizing",
  },
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
    {
      publisher: "AWS",
      title: "“Modify an Amazon EBS volume using Elastic Volumes operations”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-modify-volume.html",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Expand Virtual Hard Disks on a Linux VM”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/linux/expand-disks",
    },
  ],
};
