import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/max-pods-per-node/1";

export const term: GlossaryTerm = {
  slug: "max-pods-per-node",
  term: "Max pods per node",
  title: "Max pods per node in Kubernetes on EKS and AKS",
  meta: "Kubernetes max pods per node defaults to 110. See how many pods per node EKS allows from ENI limits, how to raise it on AKS, and what it costs you.",
  h1: "Max pods per node in Kubernetes on EKS and AKS",
  card: "Max pods per node is the most pods one Kubernetes node can run.",
  group: "kubernetes",
  product: "coral",
  published: "2026-10-25",
  updated: "2026-11-02",
  definition: [
    {
      kind: "p",
      text: "Max pods per node is the most pods one Kubernetes node can run. Kubernetes max pods per node defaults to 110, set by the kubelet (node agent).",
    },
  ],
  sections: [
    {
      id: "max-pods-per-node-on-eks-and",
      title: "Max pods per node on EKS and AKS",
      blocks: [
        { kind: "h3", id: "how-eks-works-out-max-pods", title: "How EKS works out max pods" },
        {
          kind: "ul",
          items: [
            "On EKS, most pods take an IP address from the node, so by default the cap is interfaces × (addresses per interface minus 1) + 2.",
            "Without a custom machine image, managed node groups cap it at 110 below 30 virtual CPUs and 250 above.",
          ],
        },
        {
          kind: "h3",
          id: "how-to-change-max-pods-per-node",
          title: "How to change max pods per node on AKS",
        },
        {
          kind: "ul",
          items: [
            "Each AKS node pool sets its own cap, up to 250. The default runs from 30 to 250, by network plugin.",
            [
              "On an existing cluster, add a node pool with the new ",
              { code: "--max-pods" },
              " value and move your pods to it. You pay for both pools until the old one goes.",
            ],
          ],
        },
      ],
    },
    {
      id: "a-full-node-on-eks",
      title: "A full node on EKS",
      blocks: [
        {
          kind: "p",
          text: "An m5.large has 8\u00a0GiB of memory and 3 network interfaces with 10 IPv4 addresses each. EKS allows 3 × 9 + 2 = 29\u00a0pods.",
        },
        {
          kind: "p",
          text: "Say each pod requests 100\u00a0MiB, as an illustration: about 2.8\u00a0GiB in all. Pod 30 needs another node, with most memory unclaimed.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why max pods per node matters for your cloud cost",
      blocks: [
        {
          kind: "p",
          text: "You pay for each node, however many pods it runs. When pod slots fill first, the CPU and memory you pay for sit unclaimed.",
        },
        {
          kind: "ul",
          items: [
            [
              "A higher cap, or a bigger EKS instance, allows denser ",
              { a: "bin packing", href: "/learn/kubernetes-bin-packing" },
              ".",
            ],
            [
              { a: "Coral", href: "/coral" },
              " rebalances CPU and memory requests on AKS and EKS to match real use, and removes the nodes you don’t need.",
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
    { title: "Node pool", line: "Where AKS sets it.", href: "/learn/glossary/node-pool" },
    {
      title: "DaemonSet",
      line: "Runs a copy of a pod on each targeted node, each copy taking a slot.",
      href: "/learn/glossary/daemonset",
    },
    {
      title: "Kubernetes resource requests",
      line: "How CPU and memory fill a node.",
      href: "/learn/glossary/kubernetes-resource-requests",
    },
    {
      title: "EKS Auto Mode",
      line: "Caps each node at 110\u00a0pods, or fewer when it has fewer IP addresses.",
      href: "/learn/glossary/eks-auto-mode",
    },
  ],
  relatedTitle: "Terms related to max pods per node",
  next: {
    title: "Kubernetes bin packing: fewer nodes for the same pods",
    href: "/learn/kubernetes-bin-packing",
  },
  sources: [
    {
      publisher: "Kubernetes",
      title: "“Kubelet Configuration (v1beta1)”",
      url: "https://kubernetes.io/docs/reference/config-api/kubelet-config.v1beta1/",
    },
    {
      publisher: "AWS",
      title: "“Choose an optimal Amazon EC2 node instance type”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/choosing-instance-type.html",
    },
    {
      publisher: "AWS",
      title: "“Specifications for Amazon EC2 general purpose instances”",
      url: "https://docs.aws.amazon.com/ec2/latest/instancetypes/gp.html",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Concepts - IP address planning in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/concepts-network-ip-address-planning",
    },
  ],
};
