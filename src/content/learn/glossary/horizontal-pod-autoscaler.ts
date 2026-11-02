import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/horizontal-pod-autoscaler/1";

export const term: GlossaryTerm = {
  slug: "horizontal-pod-autoscaler",
  term: "Horizontal Pod Autoscaler (HPA)",
  title: "Kubernetes HPA: the Horizontal Pod Autoscaler",
  meta: "What is HPA? The k8s HPA, or Horizontal Pod Autoscaler, adds or removes pods to match demand. See how its CPU target works and why it shapes node cost.",
  h1: "Kubernetes HPA: the Horizontal Pod Autoscaler",
  card: "HPA in Kubernetes stands for Horizontal Pod Autoscaler.",
  group: "kubernetes",
  product: "coral",
  published: "2026-10-26",
  updated: "2026-11-02",
  definition: [
    {
      kind: "p",
      text: "HPA in Kubernetes stands for Horizontal Pod Autoscaler. It changes the number of pods in a workload, such as a Deployment, to match demand, and can’t scale a DaemonSet.",
    },
    {
      kind: "p",
      text: [
        "Horizontal means more pods, not bigger ones. ",
        { a: "VPA vs HPA", href: "/learn/vpa-vs-hpa" },
        " compares it with vertical scaling, and ",
        { a: "Kubernetes autoscaling", href: "/learn/kubernetes-autoscaling" },
        " sets it beside the VPA and the Cluster Autoscaler.",
      ],
    },
  ],
  sections: [
    {
      id: "how-the-hpa-decides",
      title: "How horizontal pod autoscaling works",
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
          ],
        },
        {
          kind: "h3",
          id: "scaling-behavior-stabilizationwindowseconds",
          title: "Scaling behavior: stabilizationWindowSeconds",
        },
        {
          kind: "p",
          text: "To scale down, the HPA uses the highest replica count from its stabilization window, 300\u00a0seconds by default. So it won’t remove pods only to recreate them. By default, scale-up has no window.",
        },
        {
          kind: "p",
          text: "The docs’ example sets a 1-minute scale-down window in an HPA’s spec:",
        },
        {
          kind: "code",
          lang: "yaml",
          code: "behavior:\n  scaleDown:\n    stabilizationWindowSeconds: 60",
        },
        { kind: "h3", id: "hpa-on-eks-and-aks", title: "HPA on EKS and AKS" },
        {
          kind: "p",
          text: "The Horizontal Pod Autoscaler on EKS is built in. EKS lists Metrics Server as a prerequisite.",
        },
      ],
    },
    {
      id: "an-example-from-the-kubernetes-docs",
      title: "An HPA example from the Kubernetes docs",
      blocks: [
        {
          kind: "p",
          text: "In the HPA walkthrough, each php-apache pod requests 200\u00a0millicores (200m) of CPU. The HPA targets 50% average CPU utilization. So it aims for 100m of use per pod.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: "At 200m average use, twice the target, the HPA would double the pods.",
        },
        {
          kind: "code",
          lang: "yaml",
          code: "apiVersion: autoscaling/v2\nkind: HorizontalPodAutoscaler\nmetadata:\n  name: php-apache\nspec:\n  scaleTargetRef:\n    apiVersion: apps/v1\n    kind: Deployment\n    name: php-apache\n  minReplicas: 1\n  maxReplicas: 10\n  metrics:\n  - type: Resource\n    resource:\n      name: cpu\n      target:\n        type: Utilization\n        averageUtilization: 50",
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why the HPA matters for your cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            "At a 50% target, each pod’s request is twice its target use.",
            [
              { a: "Node autoscalers", href: "/learn/kubernetes-autoscaling" },
              " add nodes to fit pods’ requests, not their real use.",
            ],
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
  relatedTitle: "Terms related to the HPA",
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
    {
      publisher: "Microsoft Learn",
      title: "“AKS Scaling Overview”",
      url: "https://learn.microsoft.com/en-us/azure/aks/concepts-scale",
    },
  ],
};
