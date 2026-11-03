import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/horizontal-pod-autoscaler/1";

export const term: GlossaryTerm = {
  slug: "horizontal-pod-autoscaler",
  term: "Horizontal Pod Autoscaler (HPA)",
  title: "What is HPA in Kubernetes?",
  meta: "The Kubernetes HPA (Horizontal Pod Autoscaler) adds or removes pods to match demand. How it decides, its defaults and how it shapes cloud cost.",
  h1: "What is HPA in Kubernetes?",
  card: "HPA in Kubernetes stands for Horizontal Pod Autoscaler.",
  group: "kubernetes",
  product: "coral",
  published: "2026-10-26",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: "HPA in Kubernetes stands for Horizontal Pod Autoscaler. It changes how many pods a workload, such as a Deployment or StatefulSet, runs to match demand.",
    },
    {
      kind: "p",
      text: [
        "Horizontal means more pods, not bigger ones. It can’t scale a DaemonSet. ",
        { a: "VPA vs HPA", href: "/learn/vpa-vs-hpa" },
        " compares it with vertical scaling.",
      ],
    },
  ],
  sections: [
    {
      id: "how-the-hpa-decides",
      title: "How it works",
      blocks: [
        {
          kind: "ul",
          items: [
            "Kubernetes runs horizontal pod autoscaling as a control loop, every 15\u00a0seconds by default.",
            [
              "For CPU and memory, it reads the metrics API, which ",
              { a: "Metrics Server", href: "/learn/glossary/metrics-server" },
              " usually serves.",
            ],
            [
              "A CPU target is a percentage of each pod’s CPU ",
              { a: "request", href: "/learn/glossary/kubernetes-resource-requests" },
              ". If any container has no CPU request, the HPA takes no action on CPU.",
            ],
            "It sets the replica count to the current count times the ratio of current use to the target, rounded up.",
          ],
        },
        {
          kind: "h3",
          id: "scaling-behavior-stabilizationwindowseconds",
          title: "Scaling behavior",
        },
        {
          kind: "ul",
          items: [
            "Scale-up has no stabilization window. Every 15\u00a0seconds, it can add 4\u00a0pods or double the count, whichever is more.",
            "Scale-down uses the highest count recommended in the last 300\u00a0seconds. So the HPA doesn’t remove pods only to recreate them moments later.",
          ],
        },
        {
          kind: "p",
          text: "The docs’ example shortens the scale-down window to 1\u00a0minute:",
        },
        {
          kind: "code",
          lang: "yaml",
          code: "behavior:\n  scaleDown:\n    stabilizationWindowSeconds: 60",
        },
        { kind: "h3", id: "hpa-on-eks-and-aks", title: "On EKS and AKS" },
        {
          kind: "p",
          text: "On EKS, the HPA is a standard Kubernetes API resource. It needs only a metrics source, such as Metrics Server.",
        },
        {
          kind: "p",
          text: "On AKS, Microsoft advises the HPA when a workload can run several identical replicas and its demand changes. When replicas outgrow your nodes, the Cluster Autoscaler or node autoprovisioning adds nodes. Microsoft also advises against running the HPA and the VPA on the same CPU or memory metric.",
        },
      ],
    },
    {
      id: "an-example-from-the-kubernetes-docs",
      title: "An HPA example",
      blocks: [
        {
          kind: "p",
          text: "In the Kubernetes walkthrough, each php-apache pod requests 200\u00a0millicores (200m) of CPU. The HPA targets 50% average CPU use, so it aims for 100m per pod.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: "At 200m average use, twice the target, the HPA would double the pods, up to its maximum of 10.",
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
      title: "Why it matters for cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            "At a 50% target, each pod requests twice the CPU it is meant to use.",
            [
              { a: "Node autoscalers", href: "/learn/kubernetes-autoscaling" },
              " add nodes to fit pods’ requests, not their real use.",
            ],
            "So when new replicas don’t fit, you pay for nodes sized to their requests.",
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
      title: "Metrics Server",
      line: "Serves the CPU and memory use the HPA reads.",
      href: "/learn/glossary/metrics-server",
    },
    {
      title: "Kubernetes headroom",
      line: "Spare room for new pods.",
      href: "/learn/glossary/kubernetes-headroom",
    },
  ],
  relatedTitle: "Related terms",
  next: { title: "HPA vs VPA in Kubernetes", href: "/learn/vpa-vs-hpa" },
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
