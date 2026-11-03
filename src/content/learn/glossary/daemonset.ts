import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/daemonset/1";

export const term: GlossaryTerm = {
  slug: "daemonset",
  term: "DaemonSet",
  title: "What is a Kubernetes DaemonSet?",
  meta: "A DaemonSet in Kubernetes runs one copy of a pod on each node it targets. An example, DaemonSet vs Deployment, and why its requests repeat on every node.",
  h1: "What is a Kubernetes DaemonSet?",
  card: "A DaemonSet in Kubernetes runs one copy of a pod on each node it targets.",
  group: "kubernetes",
  product: "coral",
  published: "2026-10-25",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: "A DaemonSet in Kubernetes runs one copy of a pod on each node it targets. A node that joins gets a copy, and a node that leaves has its copy removed.",
    },
    { kind: "svg", figure: figure1 },
    { kind: "p", text: "It suits node-level helpers, such as:" },
    {
      kind: "ul",
      items: ["cluster storage", "log collection", "node monitoring", "cluster networking"],
    },
  ],
  sections: [
    {
      id: "daemonset-node-selector-and-tolerations",
      title: "Which nodes get a copy",
      blocks: [
        { kind: "p", text: "Every node gets a copy, except:" },
        {
          kind: "ul",
          items: [
            "A node that doesn’t match the DaemonSet’s node selector or node affinity.",
            [
              "A node with a NoSchedule or NoExecute ",
              { a: "taint", href: "/learn/kubernetes-taints-and-tolerations" },
              " the pod doesn’t tolerate.",
            ],
          ],
        },
        {
          kind: "p",
          text: "The DaemonSet controller tolerates some built-in taints itself. So a cordoned node, or one under memory or disk pressure, still runs its copy.",
        },
      ],
    },
    {
      id: "a-kubernetes-daemonset-example",
      title: "DaemonSet example",
      blocks: [
        {
          kind: "p",
          text: "This DaemonSet, shortened from the Kubernetes docs, runs the fluentd-elasticsearch log collector. Each copy requests 100m of CPU (0.1 CPU) and 200Mi of memory (200 mebibytes).",
        },
        {
          kind: "code",
          lang: "yaml",
          code: "apiVersion: apps/v1\nkind: DaemonSet\nmetadata:\n  name: fluentd-elasticsearch\n  namespace: kube-system\nspec:\n  selector:\n    matchLabels:\n      name: fluentd-elasticsearch\n  template:\n    metadata:\n      labels:\n        name: fluentd-elasticsearch\n    spec:\n      containers:\n      - name: fluentd-elasticsearch\n        image: quay.io/fluentd_elasticsearch/fluentd:v5.0.1\n        resources:\n          limits:\n            memory: 200Mi\n          requests:\n            cpu: 100m\n            memory: 200Mi",
        },
      ],
    },
    {
      id: "daemonset-vs-deployment",
      title: "DaemonSet vs Deployment",
      blocks: [
        {
          kind: "ul",
          items: [
            [
              { b: "A Deployment" },
              " runs as many copies as you set, on whichever nodes have room. Use it for stateless apps you scale up and down.",
            ],
            [
              { b: "A DaemonSet" },
              " runs one copy on each node it targets. Use it for a node-level helper, such as a log collector or network plugin.",
            ],
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
          text: [
            "The scheduler counts each pod’s ",
            { a: "request", href: "/learn/glossary/kubernetes-resource-requests" },
            " against its node. So a DaemonSet’s requests take room on every node you pay for.",
          ],
        },
        {
          kind: "p",
          text: "Say the docs’ example runs on 10 nodes. Its copies request 1 CPU and 2,000Mi in all. On 6 nodes, that falls to 0.6 CPU and 1,200Mi.",
        },
        {
          kind: "p",
          text: [
            "By default, the Cluster Autoscaler counts DaemonSet requests when it checks whether a node is underused. See ",
            {
              a: "Cluster Autoscaler not scaling down",
              href: "/learn/cluster-autoscaler-not-scaling-down",
            },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " rebalances CPU and memory requests on AKS and EKS to match real use, so the same pods fit on fewer nodes. It removes the spare nodes and never moves DaemonSet pods.",
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Resource requests",
      line: "What each copy reserves.",
      href: "/learn/glossary/kubernetes-resource-requests",
    },
    {
      title: "Max pods per node",
      line: "Each copy takes one of the node’s pod slots.",
      href: "/learn/glossary/max-pods-per-node",
    },
    {
      title: "Node pool",
      line: "Its node selector can pick the pools.",
      href: "/learn/glossary/node-pool",
    },
  ],
  relatedTitle: "Related terms",
  next: {
    title: "Kubernetes node size best practices",
    href: "/learn/kubernetes-node-size-best-practices",
  },
  sources: [
    {
      publisher: "Kubernetes",
      title: "“DaemonSet”",
      url: "https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/",
    },
    {
      publisher: "Kubernetes",
      title: "“Resource Management for Pods and Containers”",
      url: "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/",
    },
    {
      publisher: "Kubernetes",
      title: "“Taints and Tolerations”",
      url: "https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/",
    },
    {
      publisher: "Kubernetes Autoscaler",
      title: "“Cluster Autoscaler FAQ”",
      url: "https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md",
    },
  ],
};
