import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/eks-auto-mode/1";

export const term: GlossaryTerm = {
  slug: "eks-auto-mode",
  term: "EKS Auto Mode",
  title: "What is Amazon EKS Auto Mode?",
  meta: "EKS Auto Mode lets AWS run your EKS nodes for a fee on top of the EC2 price. What it manages, how it’s priced, and how it compares to managed node groups.",
  h1: "What is Amazon EKS Auto Mode?",
  card: "EKS Auto Mode is a mode of Amazon Elastic Kubernetes Service (EKS) in which AWS runs your worker nodes, not just the control plane.",
  group: "kubernetes",
  product: "coral",
  published: "2026-10-25",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: "EKS Auto Mode is a mode of Amazon Elastic Kubernetes Service (EKS) in which AWS runs your worker nodes, not just the control plane. AWS picks the EC2 instances, patches them and replaces each one within 21 days.",
    },
    {
      kind: "ul",
      items: [
        [
          "It adds nodes for pods that can’t be scheduled, using ",
          { a: "Karpenter", href: "/learn/what-is-karpenter" },
          ", and removes nodes it no longer needs.",
        ],
        "It consolidates pods onto fewer or cheaper nodes.",
        "It also runs load balancing, pod networking, cluster DNS and block storage.",
      ],
    },
  ],
  sections: [
    {
      id: "eks-auto-mode-vs-managed-node-groups",
      title: "Auto Mode vs managed node groups",
      blocks: [
        {
          kind: "ul",
          items: [
            [
              { b: "Managed node groups" },
              " have no extra charge. You choose the instance types and roll out patched node images yourself.",
            ],
            [{ b: "Auto Mode" }, " adds a fee for each instance, and AWS does that work."],
          ],
        },
        {
          kind: "p",
          text: [
            "Auto Mode pays off when its fee costs less than your team’s time on nodes. To switch a node group’s instances, see ",
            {
              a: "how to change an EKS node group instance type",
              href: "/learn/change-eks-node-group-instance-type",
            },
            ".",
          ],
        },
      ],
    },
    {
      id: "eks-auto-mode-pricing",
      title: "Pricing",
      blocks: [
        {
          kind: "p",
          text: "Auto Mode charges a management fee for each EC2 instance it launches, on top of the EC2 price.",
        },
        {
          kind: "ul",
          items: [
            "The fee depends on the instance type.",
            "It’s charged per second, with a one-minute minimum.",
            "Savings Plans, Reserved Instances and Spot reduce the EC2 price, not the fee.",
            "The built-in node pools use on-demand instances only. A custom NodePool can use Spot.",
          ],
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "a-node-auto-mode-wont-consolidate",
      title: "What blocks consolidation",
      blocks: [
        { kind: "p", text: "Auto Mode keeps a node, however idle, while either of these holds:" },
        {
          kind: "ul",
          items: [
            [
              "A pod on it has the annotation ",
              {
                a: { code: "karpenter.sh/do-not-disrupt" },
                href: "/learn/safe-to-evict-do-not-disrupt",
              },
              " set to true.",
            ],
            [
              "A ",
              { a: "pod disruption budget", href: "/learn/glossary/pod-disruption-budget" },
              " lets none of its pods be evicted, such as ",
              { code: "maxUnavailable: 0" },
              ".",
            ],
          ],
        },
        { kind: "p", text: "You keep paying for that node and its fee." },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for cloud cost",
      blocks: [
        {
          kind: "p",
          text: [
            "Auto Mode picks instance types to fit your pods’ ",
            { a: "requests", href: "/learn/glossary/kubernetes-resource-requests" },
            ", not their real use. Requests set above real use mean more or bigger nodes, each with its fee.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " rebalances CPU and memory requests on AKS and EKS to match real use, so the same pods fit on fewer nodes.",
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
  relatedTitle: "Related terms",
  next: {
    title: "What is Karpenter in Kubernetes?",
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
