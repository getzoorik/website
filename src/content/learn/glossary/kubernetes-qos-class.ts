import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/kubernetes-qos-class/1";

export const term: GlossaryTerm = {
  slug: "kubernetes-qos-class",
  term: "Kubernetes QoS class (Guaranteed, Burstable, BestEffort)",
  title: "What is a Kubernetes QoS class?",
  meta: "A Kubernetes QoS class marks each pod Guaranteed, Burstable or BestEffort. How requests and limits set it, what each reserves, and the eviction order.",
  h1: "What is a Kubernetes QoS class?",
  card: "A Kubernetes QoS (quality of service) class is the category Kubernetes puts each pod in: Guaranteed, Burstable or BestEffort.",
  group: "kubernetes",
  product: "coral",
  published: "2026-10-26",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: [
        "A Kubernetes QoS (quality of service) class is the category Kubernetes puts each pod in: Guaranteed, Burstable or BestEffort. It comes from the CPU and memory ",
        { a: "requests", href: "/learn/glossary/kubernetes-resource-requests" },
        " and ",
        { a: "limits", href: "/learn/glossary/kubernetes-resource-limits" },
        " of the pod’s containers. It helps predict which pods are evicted first when a node runs short of memory.",
      ],
    },
  ],
  sections: [
    {
      id: "the-three-kubernetes-qos-classes",
      title: "The three classes",
      blocks: [
        {
          kind: "ul",
          items: [
            [
              { b: "Guaranteed" },
              ": every container sets CPU and memory requests and limits, and each limit equals its request.",
            ],
            [
              { b: "Burstable" },
              ": the pod isn’t Guaranteed, but at least one container sets a CPU or memory request or limit.",
            ],
            [{ b: "BestEffort" }, ": no container sets a CPU or memory request or limit."],
          ],
        },
        {
          kind: "p",
          text: [
            "Pod-level resources (beta since v1.34) follow the same rules. The class is set when the pod is created and never changes. Kubernetes rejects an ",
            { a: "in-place resize", href: "/learn/in-place-pod-resize" },
            " (stable since v1.35) that would change it.",
          ],
        },
        { kind: "h3", id: "which-pods-are-evicted-first", title: "Eviction order" },
        {
          kind: "p",
          text: "Under memory pressure, BestEffort pods usually go first, then Burstable, then Guaranteed. The kubelet doesn’t read the class itself: it evicts pods using more than their requests first.",
        },
      ],
    },
    {
      id: "qos-burstable-vs-guaranteed",
      title: "Burstable vs Guaranteed",
      blocks: [
        {
          kind: "p",
          text: "The docs’ Guaranteed pod sets 0.7 CPU and 200 MiB of memory, each as both request and limit. Their Burstable pod requests 100 MiB of memory, with a 200 MiB limit.",
        },
        {
          kind: "p",
          text: "The node reserves all 200 MiB for the first. For the second it reserves 100 MiB, and the pod may use up to 200 MiB if the node has room.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for cloud cost",
      blocks: [
        { kind: "p", text: "A pod’s requests reserve room on its node, even when use is low." },
        {
          kind: "ul",
          items: [
            "A Guaranteed pod’s requests equal its limits, so they must cover its peak. The node reserves that peak all the time.",
            "Set only CPU and memory limits on every container, and Kubernetes copies them into the requests unless a namespace default applies. The pod becomes Guaranteed and reserves its full limits.",
            "A BestEffort pod reserves nothing, but it’s usually the first evicted.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " rebalances CPU and memory requests on AKS and EKS. It refuses an in-place resize that would change a pod’s QoS class. Where its policy keeps a pod Guaranteed, it sets the limit equal to the request.",
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Resource requests",
      line: "What the node reserves.",
      href: "/learn/glossary/kubernetes-resource-requests",
    },
    {
      title: "Resource limits",
      line: "The cap on use.",
      href: "/learn/glossary/kubernetes-resource-limits",
    },
    {
      title: "Kubelet",
      line: "The node agent that evicts pods.",
      href: "/learn/glossary/kubelet",
    },
    {
      title: "Burstable instance",
      line: "A VM type, not a pod class.",
      href: "/learn/glossary/burstable-instance",
    },
  ],
  relatedTitle: "Related terms",
  next: {
    title: "Kubernetes requests vs limits",
    href: "/learn/kubernetes-pod-right-sizing",
  },
  sources: [
    {
      publisher: "Kubernetes",
      title: "“Pod Quality of Service Classes”",
      url: "https://kubernetes.io/docs/concepts/workloads/pods/pod-qos/",
    },
    {
      publisher: "Kubernetes",
      title: "“Configure Quality of Service for Pods”",
      url: "https://kubernetes.io/docs/tasks/configure-pod-container/quality-service-pod/",
    },
    {
      publisher: "Kubernetes",
      title: "“Resource Management for Pods and Containers”",
      url: "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/",
    },
    {
      publisher: "Kubernetes",
      title: "“Node-pressure Eviction”",
      url: "https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/",
    },
    {
      publisher: "Kubernetes",
      title: "“Resize CPU and Memory Resources assigned to Containers”",
      url: "https://kubernetes.io/docs/tasks/configure-pod-container/resize-container-resources/",
    },
  ],
};
