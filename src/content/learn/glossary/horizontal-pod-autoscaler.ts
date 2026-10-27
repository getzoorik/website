import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/horizontal-pod-autoscaler/1";

export const term: GlossaryTerm = {
  slug: "horizontal-pod-autoscaler",
  term: "Horizontal Pod Autoscaler (HPA)",
  title: "What is HPA (Horizontal Pod Autoscaler)?",
  meta: "HPA in Kubernetes adds or removes pods to match demand. See how its CPU target is a share of each pod’s request, and why that request shapes your node cost.",
  h1: "What is HPA (Horizontal Pod Autoscaler)?",
  card: "HPA in Kubernetes stands for Horizontal Pod Autoscaler.",
  group: "kubernetes",
  product: "coral",
  published: "2026-10-26",
  updated: "2026-10-26",
  definition: [
    {
      kind: "p",
      text: "HPA in Kubernetes stands for Horizontal Pod Autoscaler. It changes the number of pods in a workload, such as a Deployment, to match demand. It can’t scale a DaemonSet.",
    },
    {
      kind: "p",
      text: [
        "Horizontal means more pods, not bigger ones. ",
        { a: "VPA vs HPA", href: "/learn/vpa-vs-hpa" },
        " compares it with vertical scaling.",
      ],
    },
  ],
  sections: [
    {
      id: "how-the-hpa-decides",
      title: "How the HPA decides",
      blocks: [
        {
          kind: "ul",
          items: [
            "It needs a metrics source, such as Metrics Server.",
            "It checks its metrics every 15\u00a0seconds by default.",
            [
              "A CPU utilization target is a percentage of each pod’s CPU ",
              { a: "request", href: "/learn/glossary/kubernetes-resource-requests" },
              ". If any container has no CPU request, the HPA takes no action on CPU.",
            ],
            "By default, it adds up to 4\u00a0pods or doubles the count per 15\u00a0seconds, whichever is more.",
            "To scale down, it uses the highest count from the last 5\u00a0minutes.",
          ],
        },
        {
          kind: "p",
          text: "The Horizontal Pod Autoscaler on EKS is built in, so there’s nothing to install. EKS lists Metrics Server as a prerequisite.",
        },
      ],
    },
    {
      id: "an-example-from-the-kubernetes-docs",
      title: "An example from the Kubernetes docs",
      blocks: [
        {
          kind: "p",
          text: "In the HPA walkthrough, each php-apache pod requests 200\u00a0millicores (200m) of CPU. The HPA targets 50% average CPU utilization. So it aims for 100m of use per pod.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: "If average use reached 200m, twice the target, the HPA would double the pods.",
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for your cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            "At a 50% target, each pod’s request is twice its target use.",
            "Node autoscalers add nodes to fit pods’ requests, not their real use.",
            "When new replicas don’t fit, you pay for nodes sized to those requests.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " works with your HPA. For a CPU-utilization HPA, it picks the CPU request by replaying past load through that HPA’s own settings.",
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
      line: "The base of the CPU target.",
      href: "/learn/glossary/kubernetes-resource-requests",
    },
    {
      title: "Vertical Pod Autoscaler",
      line: "Sizes pods instead of adding them.",
      href: "/learn/glossary/vertical-pod-autoscaler",
    },
    {
      title: "Kubernetes headroom",
      line: "Spare room for new pods.",
      href: "/learn/glossary/kubernetes-headroom",
    },
  ],
  next: { title: "VPA vs HPA", href: "/learn/vpa-vs-hpa" },
  sources: [
    {
      publisher: "Kubernetes",
      title: "“Horizontal Pod Autoscaling”",
      url: "https://kubernetes.io/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/",
    },
    {
      publisher: "Kubernetes",
      title: "“HorizontalPodAutoscaler Walkthrough”",
      url: "https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/",
    },
    {
      publisher: "Kubernetes",
      title: "“Node Autoscaling”",
      url: "https://kubernetes.io/docs/concepts/cluster-administration/node-autoscaling/",
    },
    {
      publisher: "Amazon EKS",
      title: "“Scale pod deployments with Horizontal Pod Autoscaler”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/horizontal-pod-autoscaler.html",
    },
  ],
};
