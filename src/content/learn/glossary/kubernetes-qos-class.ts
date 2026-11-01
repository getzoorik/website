import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/kubernetes-qos-class/1";

export const term: GlossaryTerm = {
  slug: "kubernetes-qos-class",
  term: "Kubernetes QoS class (Guaranteed, Burstable, BestEffort)",
  title: "What is a QoS class in Kubernetes?",
  meta: "A Kubernetes QoS class marks each pod Guaranteed, Burstable or BestEffort. See how requests and limits set it, and why Guaranteed pods reserve their peak.",
  h1: "What is a QoS class in Kubernetes?",
  card: "A Kubernetes QoS class (quality of service class) is the category Kubernetes assigns to every pod.",
  group: "kubernetes",
  product: "coral",
  published: "2026-10-26",
  updated: "2026-11-01",
  definition: [
    {
      kind: "p",
      text: [
        "A Kubernetes QoS class (quality of service class) is the category Kubernetes assigns to every pod. It comes from the CPU and memory ",
        { a: "requests", href: "/learn/glossary/kubernetes-resource-requests" },
        " and ",
        { a: "limits", href: "/learn/glossary/kubernetes-resource-limits" },
        " of its containers. It predicts which pods are evicted first when a node runs short of memory.",
      ],
    },
  ],
  sections: [
    {
      id: "the-three-kubernetes-qos-classes",
      title: "The three Kubernetes QoS classes",
      blocks: [
        {
          kind: "ul",
          items: [
            "Guaranteed: every container’s CPU and memory limits equal its requests.",
            "Burstable: any other pod with a CPU or memory request or limit.",
            "BestEffort: no container sets any of these.",
          ],
        },
        {
          kind: "p",
          text: "Pod-level resources (beta since v1.34) follow the same rules. The class never changes, even with an in-place resize (stable since v1.35).",
        },
        { kind: "h3", id: "which-pods-are-evicted-first", title: "Which pods are evicted first" },
        {
          kind: "p",
          text: "BestEffort pods are usually evicted first, then Burstable, then Guaranteed. The kubelet starts with pods using more than their requests.",
        },
      ],
    },
    {
      id: "qos-burstable-vs-guaranteed",
      title: "QoS Burstable vs Guaranteed",
      blocks: [
        {
          kind: "p",
          text: "The docs’ Guaranteed pod sets 0.7\u00a0CPU and 200\u00a0MiB of memory as both request and limit. Their Burstable pod requests 100\u00a0MiB, with a 200\u00a0MiB limit.",
        },
        {
          kind: "p",
          text: "The first reserves all 200\u00a0MiB. The second reserves 100\u00a0MiB and may use up to 200\u00a0MiB if the node has room.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why the QoS class matters for your cloud cost",
      blocks: [
        {
          kind: "p",
          text: [
            "A pod’s requests ",
            { a: "reserve room on its node", href: "/learn/kubernetes-pod-right-sizing" },
            ", even when use is low.",
          ],
        },
        {
          kind: "ul",
          items: [
            "A Guaranteed container’s limit equals its request. So the request must cover its peak.",
            "Set only CPU and memory limits on every container, and Kubernetes copies them into the requests unless a default applies. The pod is then Guaranteed and reserves its full limits.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " refuses an in-place resize that would change a pod’s QoS class. Where its policy keeps Guaranteed QoS, it sets the limit equal to the request.",
          ],
        },
        {
          kind: "p",
          text: [
            "The ",
            { a: "free assessment", href: "/assessment?p=coral" },
            " works out your own figure.",
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
      title: "Burstable instance",
      line: "A VM type, not a pod class.",
      href: "/learn/glossary/burstable-instance",
    },
  ],
  next: { title: "Kubernetes pod right sizing", href: "/learn/kubernetes-pod-right-sizing" },
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
  ],
};
