import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/kubelet/1";

export const term: GlossaryTerm = {
  slug: "kubelet",
  term: "kubelet",
  title: "What is the kubelet?",
  meta: "The kubelet is the agent on every Kubernetes node. It runs your pods, checks their health, holds back system capacity and evicts pods under pressure.",
  h1: "What is the kubelet?",
  card: "The kubelet is the agent that runs on every Kubernetes node.",
  group: "kubernetes",
  product: "coral",
  published: "2026-11-02",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: "The kubelet is the agent that runs on every Kubernetes node. It reads each pod’s spec, mostly from the API server, and keeps the containers it describes running and healthy.",
    },
    { kind: "svg", figure: figure1 },
  ],
  sections: [
    {
      id: "what-the-kubelet-does-on-each-node",
      title: "What the kubelet does",
      blocks: [
        {
          kind: "ul",
          items: [
            "Registers its node with the API server, by default.",
            "Runs each container’s probes: startup (has it started?), liveness (should it restart?) and readiness (can it take traffic?).",
            [
              "Sends heartbeats: node status updates and a Lease in the ",
              { code: "kube-node-lease" },
              " namespace. If they stop, the node is marked Unknown, and by default its pods are evicted 5 minutes later.",
            ],
            [
              "Limits its node to 110 pods by default, through its ",
              { a: "max pods", href: "/learn/glossary/max-pods-per-node" },
              " setting.",
            ],
            [
              "Serves its node’s and pods’ CPU and memory use at ",
              { code: "/metrics/resource" },
              ", which ",
              { a: "Metrics Server", href: "/learn/glossary/metrics-server" },
              " collects.",
            ],
            "Doesn’t manage containers that Kubernetes didn’t create.",
          ],
        },
      ],
    },
    {
      id: "how-the-kubelet-reserves-node-capacity",
      title: "Reserved capacity",
      blocks: [
        {
          kind: "p",
          text: "By default, pods can use all of a node’s capacity. The kubelet’s Node Allocatable feature holds some back:",
        },
        {
          kind: "ul",
          items: [
            "Kube-reserved, for Kubernetes daemons such as the kubelet and the container runtime.",
            "System-reserved, for OS daemons such as sshd.",
            "The hard eviction threshold, for memory and ephemeral storage.",
          ],
        },
        {
          kind: "p",
          text: "Allocatable, what pods can use, is capacity minus those three. In the Kubernetes docs’ example, a node with 16 CPUs and 32Gi of memory leaves pods 14.5 CPUs and 28.5Gi.",
        },
        {
          kind: "p",
          text: [
            "AKS sets CPU and memory reserves on every node, so a node’s ",
            {
              a: "allocatable is less than its capacity",
              href: "/learn/kubernetes-allocatable-vs-capacity",
            },
            ".",
          ],
        },
      ],
    },
    {
      id: "how-the-kubelet-evicts-pods-under-node",
      title: "Node-pressure eviction",
      blocks: [
        {
          kind: "p",
          text: "The kubelet watches memory, disk space, inodes and process IDs on its node. When one crosses a threshold, it first frees what it can, such as dead containers and unused images. Then it evicts pods.",
        },
        {
          kind: "p",
          text: [
            "The default hard thresholds on Linux are ",
            { code: "memory.available<100Mi" },
            ", ",
            { code: "nodefs.available<10%" },
            ", ",
            { code: "imagefs.available<15%" },
            ", ",
            { code: "nodefs.inodesFree<5%" },
            " and ",
            { code: "imagefs.inodesFree<5%" },
            ". On a hard threshold, the kubelet stops the pod at once.",
          ],
        },
        {
          kind: "p",
          text: [
            "Eviction ignores ",
            { a: "PodDisruptionBudgets", href: "/learn/glossary/pod-disruption-budget" },
            " and the pod’s own grace period. Pods go in this order:",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { a: "BestEffort and Burstable pods", href: "/learn/glossary/kubernetes-qos-class" },
              " using more than they request go first, by priority, then by how far over they are.",
            ],
            "Guaranteed pods, and Burstable pods using less than they request, go last, by priority.",
          ],
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for cost",
      blocks: [
        {
          kind: "p",
          text: "The kubelet’s reserves come off every node you pay for. The scheduler places pods into what’s left by their requests, not their real use.",
        },
        {
          kind: "ul",
          items: [
            "Requests far above real use fill nodes on paper while their CPU and memory sit idle. You pay for more nodes than the pods need.",
            "Requests below real use put pods first in line when the kubelet evicts.",
            [
              { a: "Coral", href: "/coral" },
              " rebalances CPU and memory requests on AKS and EKS to match real use, and removes the nodes you don’t need.",
            ],
            [
              "The ",
              { a: "free assessment", href: "/assessment?p=coral" },
              " estimates what your clusters could save.",
            ],
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Metrics Server",
      line: "Collects each kubelet’s CPU and memory use.",
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
      line: "A rough guide to eviction order.",
      href: "/learn/glossary/kubernetes-qos-class",
    },
  ],
  relatedTitle: "Related terms",
  next: {
    title: "Kubernetes allocatable vs capacity",
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
      url: "https://kubernetes.io/docs/concepts/workloads/pods/probes/",
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
