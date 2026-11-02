import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/kubelet/1";

export const term: GlossaryTerm = {
  slug: "kubelet",
  term: "kubelet",
  title: "What is the kubelet in Kubernetes?",
  meta: "The kubelet is the agent on every Kubernetes node. It starts and checks your pods, reserves node capacity, and evicts pods when memory or disk runs short.",
  h1: "What is the kubelet in Kubernetes?",
  card: "The kubelet is the primary node agent that runs on each Kubernetes node.",
  group: "kubernetes",
  product: "coral",
  published: "2026-11-02",
  updated: "2026-11-02",
  definition: [
    {
      kind: "p",
      text: "The kubelet is the primary node agent that runs on each Kubernetes node. It makes sure the containers in each pod spec, the YAML or JSON that describes a pod, are running and healthy.",
    },
    {
      kind: "p",
      text: "It takes pod specs mainly from the API server. It doesn’t manage containers that Kubernetes didn’t create.",
    },
    { kind: "svg", figure: figure1 },
  ],
  sections: [
    {
      id: "what-the-kubelet-does-on-each-node",
      title: "What the kubelet does on each node",
      blocks: [
        {
          kind: "ul",
          items: [
            "Registers its node with the API server. That’s the default, and the pattern most distributions use.",
            "Runs each container’s probes: startup, liveness and readiness. They decide when it has started, when to restart it and when it can take traffic.",
            [
              "Sends its node’s heartbeats: status updates, and a Lease in the ",
              { code: "kube-node-lease" },
              " namespace. If they stop, the control plane marks the node Unknown. By default, it starts evicting the node’s pods 5\u00a0minutes later.",
            ],
            [
              "Caps how many pods its node can run through its ",
              { a: "max pods", href: "/learn/glossary/max-pods-per-node" },
              " setting, which defaults to 110.",
            ],
            [
              "Serves the CPU and memory use of its node and its pods at ",
              { code: "/metrics/resource" },
              ". ",
              { a: "Metrics Server", href: "/learn/glossary/metrics-server" },
              " collects them from each kubelet.",
            ],
          ],
        },
      ],
    },
    {
      id: "how-the-kubelet-reserves-node-capacity",
      title: "How the kubelet reserves node capacity",
      blocks: [
        {
          kind: "p",
          text: "By default, pods can use a node’s whole capacity. The kubelet’s Node Allocatable feature reserves CPU, memory and ephemeral storage for system daemons. Kube-reserved covers the kubelet and the container runtime, and system-reserved covers OS daemons.",
        },
        {
          kind: "p",
          text: "Allocatable, what pods can use, is capacity minus those two reserves and, for memory and storage, the hard eviction threshold. The Kubernetes docs’ example node, with 16\u00a0CPUs and 32Gi of memory, leaves pods 14.5\u00a0CPUs and 28.5Gi.",
        },
        {
          kind: "p",
          text: [
            "AKS sets CPU and memory reserves on every node for you, so a node’s ",
            {
              a: "allocatable is less than its total",
              href: "/learn/kubernetes-allocatable-vs-capacity",
            },
            ".",
          ],
        },
      ],
    },
    {
      id: "how-the-kubelet-evicts-pods-under-node",
      title: "How the kubelet evicts pods under node pressure",
      blocks: [
        {
          kind: "p",
          text: [
            "The kubelet watches memory, disk space, filesystem inodes and process IDs on its node. When one crosses a threshold, it first frees node resources, such as unused container images. Then it evicts pods, ignoring ",
            { a: "PodDisruptionBudgets", href: "/learn/glossary/pod-disruption-budget" },
            " and, on a hard threshold, any grace period.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              "The default hard thresholds on Linux nodes are ",
              { code: "memory.available<100Mi" },
              ", ",
              { code: "nodefs.available<10%" },
              ", ",
              { code: "imagefs.available<15%" },
              ", ",
              { code: "nodefs.inodesFree<5%" },
              " and ",
              { code: "imagefs.inodesFree<5%" },
              ".",
            ],
            [
              {
                a: "BestEffort and Burstable pods",
                href: "/learn/glossary/kubernetes-qos-class",
              },
              " that use more than they request go first, by priority, then by how far over they are. Guaranteed pods, and Burstable pods under their requests, go last.",
            ],
          ],
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why the kubelet matters for your cloud cost",
      blocks: [
        {
          kind: "p",
          text: "The kubelet’s reserves come off every node you pay for. The scheduler fills only what’s left, by pod requests.",
        },
        {
          kind: "ul",
          items: [
            "A pod that uses more than it requests is first in line when the kubelet evicts. Requests far above use fill nodes on paper while their CPU and memory sit mostly idle.",
            [
              { a: "Coral", href: "/coral" },
              " rebalances CPU and memory requests on AKS and EKS to match real use, and drains spare nodes so your autoscaler can remove them.",
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
      title: "Metrics Server",
      line: "Collects each kubelet’s CPU and memory figures.",
      href: "/learn/glossary/metrics-server",
    },
    {
      title: "Max pods per node",
      line: "The kubelet’s cap on pods per node.",
      href: "/learn/glossary/max-pods-per-node",
    },
    {
      title: "Resource requests",
      line: "What the scheduler counts against allocatable.",
      href: "/learn/glossary/kubernetes-resource-requests",
    },
    {
      title: "QoS class",
      line: "A guide to which pods the kubelet evicts first.",
      href: "/learn/glossary/kubernetes-qos-class",
    },
  ],
  next: {
    title: "Kubernetes allocatable vs capacity: what pods can use",
    href: "/learn/kubernetes-allocatable-vs-capacity",
  },
  sources: [
    {
      publisher: "Kubernetes",
      title: "“kubelet”",
      url: "https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/",
    },
    {
      publisher: "Kubernetes",
      title: "“Nodes”",
      url: "https://kubernetes.io/docs/concepts/architecture/nodes/",
    },
    {
      publisher: "Kubernetes",
      title: "“Liveness, Readiness, and Startup Probes”",
      url: "https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/",
    },
    {
      publisher: "Kubernetes",
      title: "“Resource metrics pipeline”",
      url: "https://kubernetes.io/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/",
    },
    {
      publisher: "Kubernetes",
      title: "“Reserve Compute Resources for System Daemons”",
      url: "https://kubernetes.io/docs/tasks/administer-cluster/reserve-compute-resources/",
    },
    {
      publisher: "Kubernetes",
      title: "“Node-pressure Eviction”",
      url: "https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/",
    },
    {
      publisher: "Kubernetes",
      title: "“Resource Management for Pods and Containers”",
      url: "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Azure Kubernetes Service (AKS) Core Concepts”",
      url: "https://learn.microsoft.com/en-us/azure/aks/core-aks-concepts",
    },
  ],
};
