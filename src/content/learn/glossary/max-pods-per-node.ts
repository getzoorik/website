import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/max-pods-per-node/1";

export const term: GlossaryTerm = {
  slug: "max-pods-per-node",
  term: "Max pods per node",
  title: "Kubernetes max pods per node",
  meta: "Kubernetes allows 110 pods per node by default. How EKS and AKS set max pods, how to raise it, and why full pod slots leave paid capacity unused.",
  h1: "Kubernetes max pods per node",
  card: "Max pods per node is the most pods one Kubernetes node can run.",
  group: "kubernetes",
  product: "coral",
  published: "2026-10-25",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: "Max pods per node is the most pods one Kubernetes node can run. The kubelet, the agent on each node, enforces it, with a default of 110. EKS and AKS set their own values.",
    },
  ],
  sections: [
    {
      id: "how-eks-works-out-max-pods",
      title: "On EKS",
      blocks: [
        {
          kind: "p",
          text: "On EKS, most pods take an IP address from the node. So by default, max pods follows the instance type’s network interfaces and addresses:",
        },
        {
          kind: "ul",
          items: [
            "Max pods = interfaces × (IPv4 addresses per interface − 1) + 2.",
            "The + 2 is for the Amazon VPC CNI and kube-proxy, which don’t take a pod IP address.",
            "An m5.large has 3 interfaces with 10 addresses each, so it allows 3 × 9 + 2 = 29 pods.",
            "Managed node groups without a custom Amazon Machine Image (AMI) cap it at 110 below 30 virtual CPUs, and at 250 above.",
          ],
        },
        {
          kind: "p",
          text: "To set your own value on a managed node group, use a custom AMI in its launch template. Nitro instances can get far more IP addresses through IP prefixes, with Amazon VPC CNI 1.9.0 or later.",
        },
      ],
    },
    {
      id: "how-to-change-max-pods-per-node",
      title: "On AKS",
      blocks: [
        {
          kind: "p",
          text: "Each AKS node pool sets its own max pods, up to 250. The default depends on the network plugin:",
        },
        {
          kind: "ul",
          items: [
            "Azure CNI Overlay: 250.",
            "Azure CNI Pod Subnet and kubenet: 110.",
            "Azure CNI (legacy): 30.",
          ],
        },
        {
          kind: "p",
          text: [
            "Set it with ",
            { code: "--max-pods" },
            " when you create a cluster or add a node pool. To change it later, add a pool with the new value, move your pods to it and delete the old pool. You pay for both pools until then.",
          ],
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for cloud cost",
      blocks: [
        {
          kind: "p",
          text: "You pay for each node, however many pods it runs. If pod slots fill before CPU and memory do, the rest of the node sits unclaimed.",
        },
        {
          kind: "p",
          text: "Say each pod on an m5.large requests 100 MiB. Its 29 slots hold about 2.8 GiB of its 8 GiB of memory. Pod 30 needs another node.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "ul",
          items: [
            [
              "A higher cap, or a larger instance type with more addresses, allows denser ",
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
              " counts pod slots, as well as CPU and memory, when it estimates the nodes you need.",
            ],
          ],
        },
      ],
    },
  ],
  related: [
    { title: "Node pool", line: "Where AKS sets max pods.", href: "/learn/glossary/node-pool" },
    {
      title: "DaemonSet",
      line: "A pod copy on each node, each one taking a slot.",
      href: "/learn/glossary/daemonset",
    },
    {
      title: "Kubernetes resource requests",
      line: "How CPU and memory fill a node.",
      href: "/learn/glossary/kubernetes-resource-requests",
    },
    {
      title: "EKS Auto Mode",
      line: "Caps each node at 110 pods, or fewer when it has fewer IP addresses.",
      href: "/learn/glossary/eks-auto-mode",
    },
  ],
  relatedTitle: "Related terms",
  next: {
    title: "Kubernetes bin packing",
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
