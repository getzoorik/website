import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/eks-auto-mode/1";

export const term: GlossaryTerm = {
  slug: "eks-auto-mode",
  term: "EKS Auto Mode",
  title: "What is EKS Auto Mode?",
  meta: "EKS Auto Mode lets AWS run your EKS nodes for a fee on top of the EC2 price. See what it manages, how it compares to managed node groups, and its pricing.",
  h1: "What is EKS Auto Mode?",
  card: "EKS Auto Mode is a mode of Amazon Elastic Kubernetes Service (EKS), where AWS runs your nodes, not just the control plane.",
  group: "kubernetes",
  product: "coral",
  published: "2026-10-25",
  updated: "2026-11-01",
  definition: [
    {
      kind: "p",
      text: "EKS Auto Mode is a mode of Amazon Elastic Kubernetes Service (EKS), where AWS runs your nodes, not just the control plane. It picks, patches and removes your EC2 instances, and replaces each within 21\u00a0days.",
    },
    {
      kind: "ul",
      items: [
        "It also manages load balancing and block storage.",
        [
          "It adds nodes for pods that can’t be scheduled, using ",
          { a: "Karpenter", href: "/learn/what-is-karpenter" },
          ".",
        ],
        "It consolidates, packing pods onto fewer nodes.",
      ],
    },
  ],
  sections: [
    {
      id: "a-node-auto-mode-wont-consolidate",
      title: "A node Auto Mode won’t consolidate",
      blocks: [
        {
          kind: "p",
          text: [
            "Say a pod has the annotation ",
            {
              a: { code: "karpenter.sh/do-not-disrupt" },
              href: "/learn/safe-to-evict-do-not-disrupt",
            },
            " set to true. Auto Mode won’t consolidate its node while that pod runs, so you keep paying for it, idle or not.",
          ],
        },
      ],
    },
    {
      id: "eks-auto-mode-vs-managed-node-groups",
      title: "EKS Auto Mode vs managed node groups",
      blocks: [
        {
          kind: "p",
          text: [
            "In a managed node group, EKS runs your EC2 instances at no extra charge. But you pick the instance types and roll out patched node images. To switch them later, see ",
            {
              a: "how to change an EKS node group instance type",
              href: "/learn/change-eks-node-group-instance-type",
            },
            ".",
          ],
        },
        {
          kind: "p",
          text: "Auto Mode does that work for a fee, so EKS Auto Mode is worth it when that work costs more.",
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for your cloud cost",
      blocks: [
        {
          kind: "h3",
          id: "eks-auto-mode-pricing",
          title: "EKS Auto Mode pricing: a fee on top of EC2",
        },
        {
          kind: "p",
          text: "EKS Auto Mode isn’t free. EKS Auto Mode pricing adds a fee per instance, on top of the EC2 price.",
        },
        {
          kind: "ul",
          items: [
            "The fee varies by instance type.",
            "A Savings Plan or spot price doesn’t change the fee.",
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: [
            "Auto Mode sizes nodes to your pods’ requests, so EKS Auto Mode cost follows your ",
            { a: "requests", href: "/learn/glossary/kubernetes-resource-requests" },
            ", not real use.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { a: "Coral", href: "/coral" },
              " rebalances CPU and memory requests on AKS and EKS to match real use, so the same pods fit on fewer nodes.",
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
      title: "Resource requests",
      line: "What Auto Mode sizes nodes to.",
      href: "/learn/glossary/kubernetes-resource-requests",
    },
    { title: "Node pool", line: "Covers managed node groups.", href: "/learn/glossary/node-pool" },
    {
      title: "Savings plan",
      line: "Reduces the EC2 price, not the fee.",
      href: "/learn/glossary/savings-plan",
    },
    {
      title: "On-demand instance",
      line: "The only kind built-in pools use.",
      href: "/learn/glossary/on-demand-instance",
    },
  ],
  next: {
    title: "What is Karpenter? How it picks and removes nodes",
    href: "/learn/what-is-karpenter",
  },
  sources: [
    {
      publisher: "AWS",
      title: "“Automate cluster infrastructure with EKS Auto Mode”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/automode.html",
    },
    {
      publisher: "AWS",
      title: "“Cost optimization in EKS Auto Mode”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/auto-cost-control.html",
    },
    {
      publisher: "AWS",
      title: "“Simplify node lifecycle with managed node groups”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/managed-node-groups.html",
    },
    { publisher: "AWS", title: "“Amazon EKS pricing”", url: "https://aws.amazon.com/eks/pricing/" },
  ],
};
