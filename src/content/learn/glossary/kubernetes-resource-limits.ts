import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/kubernetes-resource-limits/1";

export const term: GlossaryTerm = {
  slug: "kubernetes-resource-limits",
  term: "Resource limits (pod limits)",
  title: "Kubernetes resource limits: CPU and memory",
  meta: "Kubernetes resource limits cap a container’s CPU and memory. See how a CPU limit in Kubernetes and a memory limit work, and when a limit sets your node cost.",
  h1: "Kubernetes resource limits: CPU and memory",
  card: "A resource limit in Kubernetes is the most CPU or memory a container may use.",
  group: "kubernetes",
  product: "coral",
  published: "2026-10-25",
  updated: "2026-11-01",
  definition: [
    {
      kind: "p",
      text: "A resource limit in Kubernetes is the most CPU or memory a container may use. A CPU limit in Kubernetes caps its CPU time, and a memory limit caps its memory.",
    },
  ],
  sections: [
    {
      id: "kubernetes-resource-limits-cpu-and-memory",
      title: "Kubernetes CPU limits and memory limits",
      blocks: [
        { kind: "p", text: "On Linux, the kernel enforces each one differently:" },
        {
          kind: "ul",
          items: [
            [
              "A container at its CPU limit is slowed, not killed. This is ",
              { a: "CPU throttling", href: "/learn/glossary/kubernetes-cpu-throttling" },
              ".",
            ],
            "Over its memory limit, a container may get an out of memory (OOM) kill.",
            "With no limit or default, a container can use any free CPU or memory on its node.",
            [
              "Set a limit with no ",
              { a: "request", href: "/learn/glossary/kubernetes-resource-requests" },
              ", and Kubernetes copies the limit into the request, unless a default request applies.",
            ],
          ],
        },
      ],
    },
    {
      id: "an-example-from-the-kubernetes-docs",
      title: "An example from the Kubernetes docs",
      blocks: [
        {
          kind: "p",
          text: "The docs’ frontend pod has two containers. Each requests 250m of CPU and 64\u00a0MiB of memory, with limits of 500m and 128\u00a0MiB. 250m means 250 millicpu, a quarter of one CPU.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for your cloud cost",
      blocks: [
        {
          kind: "p",
          text: "The scheduler places pods by their requests, not their limits. But when a limit becomes the request, tight limits can add nodes:",
        },
        {
          kind: "ul",
          items: [
            "A tight CPU limit throttles the app.",
            "A tight memory limit can lead to OOM kills.",
            "Raising the limit to fix this raises the request, so fewer pods fit per node.",
          ],
        },
        {
          kind: "p",
          text: [
            "Our guide to ",
            { a: "requests and limits", href: "/learn/kubernetes-pod-right-sizing" },
            " covers both.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " rebalances CPU and memory requests on AKS and EKS to match real use. On regular pods it never reduces a CPU or memory limit. If a raised memory request needs it, the limit rises to 1.5 times the request.",
          ],
        },
        {
          kind: "p",
          text: [
            "With requests that match use, the same pods fit on fewer nodes. The ",
            { a: "free assessment", href: "/assessment?p=coral" },
            " works out your own figure.",
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "CPU throttling",
      line: "What a tight CPU limit does.",
      href: "/learn/glossary/kubernetes-cpu-throttling",
    },
    {
      title: "Resource requests",
      line: "The scheduler’s input.",
      href: "/learn/glossary/kubernetes-resource-requests",
    },
    {
      title: "Cluster utilization",
      line: "How much node capacity your pods request or use.",
      href: "/learn/glossary/kubernetes-cluster-utilization",
    },
  ],
  next: { title: "Kubernetes pod right sizing", href: "/learn/kubernetes-pod-right-sizing" },
  sources: [
    {
      publisher: "Kubernetes",
      title: "“Resource Management for Pods and Containers”",
      url: "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/",
    },
    {
      publisher: "Kubernetes",
      title: "“Assign CPU Resources to Containers and Pods”",
      url: "https://kubernetes.io/docs/tasks/configure-pod-container/assign-cpu-resource/",
    },
  ],
};
