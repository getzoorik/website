import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/vertical-pod-autoscaler/1";

export const term: GlossaryTerm = {
  slug: "vertical-pod-autoscaler",
  term: "Vertical Pod Autoscaler (VPA)",
  title: "What is Kubernetes VPA (Vertical Pod Autoscaler)?",
  meta: "The Vertical Pod Autoscaler (Kubernetes VPA) sets pod CPU and memory requests from real use. Its parts, update modes, an example and how requests set node cost.",
  h1: "What is Kubernetes VPA (Vertical Pod Autoscaler)?",
  card: "VPA in Kubernetes is the Vertical Pod Autoscaler, which sets the CPU and memory requests of a workload’s pods to match real use.",
  group: "kubernetes",
  product: "coral",
  published: "2026-10-25",
  updated: "2026-11-01",
  definition: [
    {
      kind: "p",
      text: [
        "VPA in Kubernetes is the Vertical Pod Autoscaler, which sets the CPU and memory ",
        { a: "requests", href: "/learn/glossary/kubernetes-resource-requests" },
        " of a workload’s pods to match real use. You install it separately, with a metrics source such as Metrics Server.",
      ],
    },
  ],
  sections: [
    {
      id: "what-is-vertical-pod-autoscaler-used-for",
      title: "What is Vertical Pod Autoscaler used for",
      blocks: [
        { kind: "p", text: "It sizes pods up or down from real use, with three parts:" },
        {
          kind: "ul",
          items: [
            "Recommender: works out a target from current and past use",
            "Updater: evicts or resizes pods that are far off",
            "Admission controller: sets the target on new pods",
          ],
        },
        { kind: "h3", id: "vpa-update-modes", title: "VPA update modes" },
        {
          kind: "ul",
          items: [
            "Off: recommend only",
            "Initial: set requests only at pod creation",
            "Recreate, the default: evict pods that are far off",
            "InPlaceOrRecreate: resize without a restart, or evict if that fails (AKS 1.34 or later)",
          ],
        },
        {
          kind: "p",
          text: [
            "The Vertical Pod Autoscaler on AKS is preconfigured in AKS Automatic and optional in AKS Standard. The AKS docs don’t recommend using it with the ",
            {
              a: "Horizontal Pod Autoscaler (HPA)",
              href: "/learn/glossary/horizontal-pod-autoscaler",
            },
            ", which scales on the same CPU and memory use.",
          ],
        },
      ],
    },
    {
      id: "a-kubernetes-vpa-example",
      title: "A Kubernetes VPA example",
      blocks: [
        {
          kind: "p",
          text: "In the VPA quickstart, two hamster pods each ask for 100\u00a0millicores of CPU (100m). They try to use slightly above 500m. After about 5\u00a0minutes, they should get a higher CPU request.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for your cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            "Requests set how many pods fit per node, so how many nodes you pay for.",
            "Smaller requests reduce the cost only once the same pods fit on fewer nodes.",
            "Bigger ones can need more nodes.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " rebalances CPU and memory requests on AKS and EKS to match real use. It drains spare nodes so your autoscaler can remove them, and works with your HPA.",
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
      line: "What VPA sets.",
      href: "/learn/glossary/kubernetes-resource-requests",
    },
    {
      title: "Resource limits",
      line: "VPA scales them with the request by default.",
      href: "/learn/glossary/kubernetes-resource-limits",
    },
    {
      title: "Kubernetes cluster utilization",
      line: "Requested versus used.",
      href: "/learn/glossary/kubernetes-cluster-utilization",
    },
  ],
  next: { title: "VPA vs HPA", href: "/learn/vpa-vs-hpa" },
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
