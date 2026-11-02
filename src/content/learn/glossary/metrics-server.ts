import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/metrics-server/1";

export const term: GlossaryTerm = {
  slug: "metrics-server",
  term: "Metrics Server (metrics-server)",
  title: "What is Metrics Server in Kubernetes?",
  meta: "Metrics Server feeds live CPU and memory use to the HPA, the VPA and kubectl top. Where it runs on AKS, and how to install the k8s metrics server on EKS.",
  h1: "What is Metrics Server in Kubernetes?",
  card: "Metrics Server (metrics-server) is a Kubernetes cluster add-on that collects CPU and memory use from the kubelet on each node.",
  group: "kubernetes",
  product: "coral",
  published: "2026-11-02",
  updated: "2026-11-02",
  definition: [
    {
      kind: "p",
      text: [
        "Metrics Server (metrics-server) is a Kubernetes cluster add-on that collects CPU and memory use from the kubelet on each node. It serves that data through the Kubernetes API as the Metrics API, ",
        { code: "metrics.k8s.io" },
        ".",
      ],
    },
    {
      kind: "p",
      text: [
        "The ",
        { a: "Horizontal Pod Autoscaler (HPA)", href: "/learn/glossary/horizontal-pod-autoscaler" },
        ", the ",
        { a: "Vertical Pod Autoscaler (VPA)", href: "/learn/glossary/vertical-pod-autoscaler" },
        " and ",
        { code: "kubectl top" },
        " read it. The Metrics API answers only once metrics-server, or another adapter that serves it, is deployed.",
      ],
    },
    { kind: "svg", figure: figure1 },
  ],
  sections: [
    {
      id: "how-metrics-server-works",
      title: "How Metrics Server works",
      blocks: [
        {
          kind: "ul",
          items: [
            [
              "It tracks nodes and pods through the Kubernetes API, and queries each node’s ",
              { a: "kubelet", href: "/learn/glossary/kubelet" },
              " over HTTP. From metrics-server v0.6.0 it reads ",
              { code: "/metrics/resource" },
              ", and older versions used ",
              { code: "/stats/summary" },
              ".",
            ],
            [
              "An APIService registers ",
              { code: "metrics.k8s.io" },
              " with the API server’s aggregation layer. So Kubernetes role-based access control (RBAC) decides who can read it.",
            ],
            "CPU is average core use over a time window. Memory is the working set in bytes, at the moment it was collected.",
          ],
        },
      ],
    },
    {
      id: "metrics-server-on-aks-and-eks",
      title: "Metrics Server on AKS and EKS",
      blocks: [
        {
          kind: "p",
          text: "Amazon EKS doesn’t deploy Metrics Server by default. AWS’s current route is the Metrics Server community add-on. In the AWS console, open your cluster, choose Add-ons, then Get More Add-ons, then Metrics Server.",
        },
        {
          kind: "p",
          text: "AWS still documents the manifest route: apply it, check the deployment, then read node use.",
        },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml\nkubectl get deployment metrics-server -n kube-system\nkubectl top nodes",
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "Your security groups and network access control lists (ACLs) must allow port 10250 between the metrics-server pods and all other nodes and pods. Fargate reserves 10250, so on Fargate the manifest needs another port. The EKS add-on already uses 10251.",
        },
        {
          kind: "p",
          text: [
            "If ",
            { code: "kubectl top" },
            " returns ",
            { code: "Error from server (Forbidden)" },
            ", your Kubernetes RBAC identity lacks permission to read cluster metrics.",
          ],
        },
      ],
    },
    {
      id: "what-metrics-server-isnt-for",
      title: "What Metrics Server isn’t for",
      blocks: [
        {
          kind: "p",
          text: "Metrics Server keeps a short-term, in-memory view. AWS says its metrics are meant for point-in-time analysis, not for history. They can’t be used as a monitoring solution, or for purposes other than autoscaling.",
        },
        {
          kind: "p",
          text: [
            "It serves only CPU and memory. To scale on other metrics, you need an adapter for the ",
            { code: "custom.metrics.k8s.io" },
            " or ",
            { code: "external.metrics.k8s.io" },
            " API.",
          ],
        },
        {
          kind: "p",
          text: "kube-state-metrics is a different add-on. It exposes the state of objects, such as status, labels and start times, for a tool such as Prometheus to scrape.",
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why Metrics Server matters for your cloud cost",
      blocks: [
        {
          kind: "p",
          text: "As load drops, the HPA reads this API and scales replicas back down. Its CPU target is a share of each pod’s CPU request. If any container has no CPU request, the HPA takes no action on CPU.",
        },
        {
          kind: "p",
          text: [
            "Compare ",
            { code: "kubectl top pods" },
            " with each pod’s ",
            { a: "requests", href: "/learn/glossary/kubernetes-resource-requests" },
            ". The gap is node capacity your requests hold but no pod uses, and you still pay for it.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { a: "Coral", href: "/coral" },
              " rebalances CPU and memory requests on AKS and EKS to match real use. It drains spare nodes so your autoscaler can remove them.",
            ],
            [
              "The ",
              { a: "free assessment", href: "/assessment?p=coral" },
              " works out your own figure. It samples use with ",
              { code: "kubectl top" },
              ". Without Metrics Server, requests stay as they are and only surplus nodes count.",
            ],
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "Horizontal Pod Autoscaler",
      line: "Reads this API to add or remove pods.",
      href: "/learn/glossary/horizontal-pod-autoscaler",
    },
    {
      title: "Vertical Pod Autoscaler",
      line: "Reads this API to set pod requests.",
      href: "/learn/glossary/vertical-pod-autoscaler",
    },
    {
      title: "Kubelet",
      line: "Serves the figures on each node.",
      href: "/learn/glossary/kubelet",
    },
    {
      title: "Resource requests",
      line: "What use is compared against.",
      href: "/learn/glossary/kubernetes-resource-requests",
    },
  ],
  next: {
    title: "Kubernetes pod right sizing: set requests from real use",
    href: "/learn/kubernetes-pod-right-sizing",
  },
  sources: [
    {
      publisher: "Kubernetes",
      title: "“Resource metrics pipeline”",
      url: "https://kubernetes.io/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/",
    },
    {
      publisher: "Kubernetes",
      title: "“Tools for Monitoring Resources”",
      url: "https://kubernetes.io/docs/tasks/debug/debug-cluster/resource-usage-monitoring/",
    },
    {
      publisher: "Kubernetes",
      title: "“Horizontal Pod Autoscaling”",
      url: "https://kubernetes.io/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/",
    },
    {
      publisher: "Kubernetes",
      title: "“Metrics for Kubernetes Object States”",
      url: "https://kubernetes.io/docs/concepts/cluster-administration/kube-state-metrics/",
    },
    {
      publisher: "Kubernetes",
      title: "“Resource Management for Pods and Containers”",
      url: "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/",
    },
    {
      publisher: "AWS",
      title: "“View resource usage with the Kubernetes Metrics Server”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/metrics-server.html",
    },
  ],
};
