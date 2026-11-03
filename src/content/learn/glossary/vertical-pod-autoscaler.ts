import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/vertical-pod-autoscaler/1";

export const term: GlossaryTerm = {
  slug: "vertical-pod-autoscaler",
  term: "Vertical Pod Autoscaler (VPA)",
  title: "What is VPA in Kubernetes?",
  meta: "VPA is the Kubernetes Vertical Pod Autoscaler: it sets pods’ CPU and memory requests from real use. Its parts, update modes, an example and cost impact.",
  h1: "What is VPA in Kubernetes?",
  card: "VPA in Kubernetes is the Vertical Pod Autoscaler, which sets pods’ CPU and memory requests to match real use.",
  group: "kubernetes",
  product: "coral",
  published: "2026-10-25",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: [
        "VPA in Kubernetes is the Vertical Pod Autoscaler, which sets pods’ CPU and memory ",
        { a: "requests", href: "/learn/glossary/kubernetes-resource-requests" },
        " to match real use. Unlike the ",
        { a: "Horizontal Pod Autoscaler (HPA)", href: "/learn/glossary/horizontal-pod-autoscaler" },
        ", it isn’t built into Kubernetes. You install it with a metrics source, such as ",
        { a: "Metrics Server", href: "/learn/glossary/metrics-server" },
        ", then turn it on for each workload with a ",
        { code: "VerticalPodAutoscaler" },
        " object.",
      ],
    },
  ],
  sections: [
    {
      id: "what-is-vertical-pod-autoscaler-used-for",
      title: "How it works",
      blocks: [
        { kind: "p", text: "VPA runs as three parts:" },
        {
          kind: "ul",
          items: [
            "Recommender: works out targets from current and past use.",
            "Updater: evicts or resizes pods whose requests are far off.",
            "Admission controller: sets the targets on new and recreated pods.",
          ],
        },
        {
          kind: "p",
          text: "On AKS, VPA is preconfigured in AKS Automatic and optional in AKS Standard. Microsoft doesn’t recommend using it with the HPA, which scales on the same CPU and memory use.",
        },
        { kind: "h3", id: "vpa-update-modes", title: "Update modes" },
        {
          kind: "ul",
          items: [
            "Off: recommends only.",
            "Initial: sets requests only when a pod is created.",
            "Recreate, the default: evicts pods whose requests are far off.",
            "InPlaceOrRecreate: resizes pods without a restart where it can, and evicts them where it can’t. On AKS, it needs 1.34 or later.",
            "InPlace: alpha. Resizes pods in place and never evicts them.",
            "Auto: deprecated, and now the same as Recreate.",
          ],
        },
      ],
    },
    {
      id: "a-kubernetes-vpa-example",
      title: "VPA example",
      blocks: [
        {
          kind: "p",
          text: "In the VPA quickstart, two hamster pods each request 100\u00a0millicores of CPU (100m) and try to use slightly above 500m.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: [
            "After about 5\u00a0minutes, they should get a higher CPU request. VPA updates the pods’ requests, not the Deployment’s template. ",
            { code: "kubectl describe vpa" },
            " shows its recommendation. The quickstart’s VPA object:",
          ],
        },
        {
          kind: "code",
          lang: "yaml",
          code: 'apiVersion: "autoscaling.k8s.io/v1"\nkind: VerticalPodAutoscaler\nmetadata:\n  name: hamster-vpa\nspec:\n  targetRef:\n    apiVersion: "apps/v1"\n    kind: Deployment\n    name: hamster\n  resourcePolicy:\n    containerPolicies:\n      - containerName: \'*\'\n        minAllowed:\n          cpu: 100m\n          memory: 50Mi\n        maxAllowed:\n          cpu: 1\n          memory: 500Mi\n        controlledResources: ["cpu", "memory"]',
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
            "Requests decide how many pods fit on a node, so how many nodes you pay for.",
            "Smaller requests reduce cost only once the same pods fit on fewer nodes.",
            "Bigger requests can need more nodes.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " rebalances CPU and memory requests on AKS and EKS to match real use, and removes the nodes you don’t need. It works with your HPA.",
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Resource requests",
      line: "What VPA sets.",
      href: "/learn/glossary/kubernetes-resource-requests",
    },
    {
      title: "Resource limits",
      line: "VPA scales them with the request by default.",
      href: "/learn/glossary/kubernetes-resource-limits",
    },
    {
      title: "Horizontal Pod Autoscaler",
      line: "Adds pods instead of resizing them.",
      href: "/learn/glossary/horizontal-pod-autoscaler",
    },
    {
      title: "Kubernetes cluster utilization",
      line: "Requested versus used.",
      href: "/learn/glossary/kubernetes-cluster-utilization",
    },
  ],
  relatedTitle: "Related terms",
  next: { title: "HPA vs VPA in Kubernetes", href: "/learn/vpa-vs-hpa" },
  sources: [
    {
      publisher: "Kubernetes",
      title: "“Vertical Pod Autoscaling”",
      url: "https://kubernetes.io/docs/concepts/workloads/autoscaling/vertical-pod-autoscale/",
    },
    {
      publisher: "Kubernetes",
      title: "“Resource Management for Pods and Containers”",
      url: "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Vertical Pod Autoscaling in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/vertical-pod-autoscaler",
    },
    {
      publisher: "Kubernetes autoscaler on GitHub",
      title: "“Vertical Pod Autoscaler quickstart”",
      url: "https://github.com/kubernetes/autoscaler/blob/master/vertical-pod-autoscaler/docs/quickstart.md",
    },
  ],
};
