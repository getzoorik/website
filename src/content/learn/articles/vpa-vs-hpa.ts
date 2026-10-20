import { learnPath, routes } from "@/config/site";
import type { Article } from "@/content/learn/article";

export const article: Article = {
  slug: "vpa-vs-hpa",
  title: "VPA vs HPA: rebalance first, then scale out",
  meta: "The VPA sets how much CPU and memory a pod requests; the HPA sets how many pods run. Why they clash on CPU, and why rebalancing comes first.",
  h1: "VPA vs HPA: rebalance first, then scale out",
  deck: "What each Kubernetes autoscaler changes, why they clash on CPU, and the order that works.",
  card: "What each autoscaler changes, why they clash on CPU, and the order that works.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes autoscaling",
  versus: ["VPA", "HPA"],
  published: "2026-10-09",
  updated: "2026-10-09",
  author: "zoorik",
  short:
    "The Vertical Pod Autoscaler (VPA) changes how much CPU and memory each pod requests. The Horizontal Pod Autoscaler (HPA) changes how many pods run. On the same CPU or memory metric they clash, because the HPA measures load against the request the VPA keeps moving. Size requests to real use first, then let the HPA scale out.",
  strip: [
    { icon: "pod-v", text: "VPA sizes each pod" },
    { icon: "pods", text: "HPA sets pod count" },
    { icon: "check", text: "Rebalance first, then scale" },
  ],
  sections: [
    {
      id: "what-are-the-vpa-and-the-hpa",
      title: "What are the VPA and the HPA?",
      blocks: [
        { kind: "figure", figure: "vpa-hpa-pair" },
        { kind: "h3", id: "what-is-the-vpa", title: "What is the VPA?" },
        {
          kind: "p",
          text: [
            "The Vertical Pod Autoscaler (VPA) is an open-source add-on from the Kubernetes autoscaler project. It sets the CPU and memory requests of a workload’s containers to match the use it measures, and keeps each container’s limit in the same ratio to its request. You attach it to a workload, such as a Deployment, with a ",
            { code: "VerticalPodAutoscaler" },
            " object.",
          ],
        },
        {
          kind: "p",
          text: "It isn’t part of core Kubernetes. On AKS it comes preconfigured in AKS Automatic, and you enable it yourself in AKS Standard. On EKS you deploy it from the autoscaler project, with Metrics Server installed.",
        },
        { kind: "p", text: "Three components do the work:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Recommender:" },
              " reads each container’s current and past use, and its out-of-memory kills, and works out a target request.",
            ],
            [
              { b: "Updater:" },
              " finds pods whose requests are out of date and evicts them, so their controller recreates them.",
            ],
            [
              { b: "Admission controller:" },
              " a webhook that writes the target requests into each pod as it is created.",
            ],
          ],
        },
        { kind: "p", text: "What happens to running pods depends on its update mode:" },
        {
          kind: "ul",
          items: [
            [{ b: "Off:" }, " it only recommends. You read the targets in the VPA object."],
            [
              { b: "Initial:" },
              " it sets requests when a pod is created, and never changes them later.",
            ],
            [
              { b: "Recreate:" },
              " it evicts pods whose requests differ enough from the target, and they come back at the new size, within their PodDisruptionBudget.",
            ],
            [
              { b: "InPlaceOrRecreate:" },
              " it changes requests without restarting the pod where the cluster supports in-place resize, and evicts the pod where it can’t. The older Auto mode now means Recreate.",
            ],
          ],
        },
        {
          kind: "p",
          text: "The VPA does one job well: it makes requests match use. It doesn’t add pods when load grows past what one pod can serve, and it doesn’t remove nodes.",
        },
        { kind: "h3", id: "what-is-the-hpa", title: "What is the HPA?" },
        {
          kind: "p",
          text: [
            "The Horizontal Pod Autoscaler (HPA) is built into Kubernetes. It is an API object, the ",
            { code: "HorizontalPodAutoscaler" },
            ", and a controller that runs in the cluster’s control plane. It scales a workload out and in: it changes the replica count of a Deployment, StatefulSet or other scalable workload to hold a metric at a target. It can’t scale a DaemonSet, which runs one pod on each node.",
          ],
        },
        {
          kind: "p",
          text: "Every 15\u00a0seconds by default, the controller reads the metric and works out how many pods the workload needs. For CPU and memory the metric is utilization: usage divided by the request, read through the Kubernetes resource metrics API, which Metrics Server usually serves. Its core rule is:",
        },
        {
          kind: "formula",
          code: "desiredReplicas = ceil(currentReplicas × currentMetric ÷ targetMetric)",
        },
        {
          kind: "p",
          text: "With a 70% CPU target, 4 pods running at 140% of their request become 8.",
        },
        { kind: "figure", figure: "hpa-example" },
        {
          kind: "p",
          text: "The HPA can also scale on custom and external metrics, such as requests per second or queue length. KEDA builds on it: a KEDA ScaledObject creates and drives an HPA from event sources, and can scale a workload to zero.",
        },
        {
          kind: "p",
          text: "The HPA does one job well: it matches the number of pods to load. It takes each pod’s request as given.",
        },
      ],
    },
    {
      id: "requests-decide-what-you-pay-for",
      title: "Requests decide what you pay for",
      blocks: [
        {
          kind: "p",
          text: "Every container can set a CPU and a memory request. The scheduler places pods by their requests, not by their use: a node is full when the requests on it add up to its allocatable capacity, even if the processes on it are idle. The Cluster Autoscaler, Node Auto Provisioning (NAP) and Karpenter count requests the same way when they decide how many nodes you need. A request set “to be safe” at four times real use keeps nodes running that do almost nothing, and you pay for those nodes.",
        },
        { kind: "figure", figure: "requests" },
        {
          kind: "p",
          text: "Limits are different. A memory limit is the point where the container is OOM-killed, and a CPU limit is where it is throttled.",
        },
      ],
    },
    {
      id: "why-they-clash-on-cpu",
      title: "Why they clash on CPU",
      blocks: [
        {
          kind: "p",
          text: "Run both on the same metric and they feed each other. Say a pod uses 200m of a 500m CPU request: 40% utilization. The VPA lowers the request to 250m. The HPA now reads the same load as 80% and, with a 70% target, adds pods. The new pods share the load, each pod uses less, and the VPA lowers the request again. The two controllers chase each other, and the replica count reflects the last request change more than real load.",
        },
        { kind: "figure", figure: "clash" },
        {
          kind: "p",
          text: "That’s why the VPA’s own documentation says not to use it with the HPA on the same resource metric, CPU or memory. The usual workarounds are to run the HPA on a custom or external metric while the VPA sizes CPU and memory, or to keep the VPA in Off mode and set requests from its targets by hand.",
        },
      ],
    },
    {
      id: "rebalance-first-then-scale-out",
      title: "Rebalance first, then scale out",
      blocks: [
        {
          kind: "p",
          text: "The HPA’s arithmetic is only as good as the request under it, so the order matters.",
        },
        { kind: "figure", figure: "order" },
        {
          kind: "steps",
          items: [
            [
              { b: "Size requests to measured use:" },
              " a high percentile of CPU over several days plus headroom, and the peak of memory. Leave limits alone until you know why they were set.",
            ],
            [
              { b: "Then set the HPA target." },
              " With honest requests, 70% utilization means 70% of what a pod really needs, and the HPA scales out when load really grows.",
            ],
            [
              { b: "Then let the node autoscaler remove what’s left." },
              " Smaller requests fit on fewer nodes, and the Cluster Autoscaler, NAP or Karpenter can remove the empty ones.",
            ],
          ],
        },
        {
          kind: "p",
          text: "Cutting requests saves nothing on its own. The bill falls when nodes go.",
        },
      ],
    },
    {
      id: "where-coral-fits",
      title: "Where Coral fits",
      blocks: [
        {
          kind: "p",
          text: "Coral does the VPA’s job and works with the HPA, so you don’t have to choose between them.",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Rebalancing." },
              " Coral sets requests with its own recommender and webhook. It doesn’t run the VPA. On the default balanced policy, the CPU request is the 80th percentile of the last 3\u00a0days plus 10%, and memory is the highest use in the last 8\u00a0days plus 10%. Your manifests and Git stay as they are: a webhook sizes pods as they start, and it fails open. With automation on, Coral switches an active VPA to Off and restores it when you switch automation off or disconnect.",
            ],
            [
              { b: "HPA-aware sizing." },
              " The HPA decides how many pods run, and Coral decides how big each pod is. For a workload with a CPU-based HPA, Coral replays the last 3\u00a0days of load through that HPA’s own settings before it picks a request. A smaller request wins only if its saving beats the cost of unserved load and extra scaling. While the HPA is scaling up and below its max, Coral holds back its surge and CPU-pressure raises, and pauses pod replacements until every pod is Ready. An OOM kill still raises memory at once.",
            ],
            [
              { b: "HPAs it manages." },
              " With automation on and the Optimization type “Both”, Coral creates an HPA, with ",
              { code: "minReplicas" },
              " of 2 or more, for an eligible Deployment or Argo Rollout that has none. Eligible means 24\u00a0hours of history, at least 100m CPU per pod and 2 or more ready replicas. It takes over hand-made HPAs that nothing else manages, keeps your ",
              { code: "minReplicas" },
              ", only raises ",
              { code: "maxReplicas" },
              ", and restores your values when it hands them back. Workload optimization never changes HPAs that Helm, Argo CD, Flux, KEDA or kubectl apply manage.",
            ],
            [
              { b: "Opt-in." },
              " Coral only recommends until “Automatically optimize” is on for a policy or a workload.",
            ],
          ],
        },
      ],
    },
  ],
  help: {
    product: "coral",
    text: "Coral rebalances CPU and memory requests on AKS and EKS, works with your HPA, and drains spare nodes so your autoscaler can remove them. We estimate it takes 40–50% off AKS and EKS cost. It is an estimated range, not a promise. The free assessment works out your own figure.",
    links: [
      { label: "Kubernetes cost optimization with Coral", href: routes.coral },
      { label: "Estimate your saving", href: `${routes.assessment}?p=coral` },
    ],
  },
  sources: [
    {
      publisher: "Kubernetes",
      title: "“Horizontal Pod Autoscaling”",
      url: "https://kubernetes.io/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/",
    },
    {
      publisher: "Vertical Pod Autoscaler",
      title: "known limitations",
      url: "https://github.com/kubernetes/autoscaler/blob/master/vertical-pod-autoscaler/docs/known-limitations.md",
    },
    {
      publisher: "Vertical Pod Autoscaler",
      title: "update modes",
      url: "https://github.com/kubernetes/autoscaler/blob/master/vertical-pod-autoscaler/docs/quickstart.md",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Vertical Pod Autoscaling in Azure Kubernetes Service”",
      url: "https://learn.microsoft.com/en-us/azure/aks/vertical-pod-autoscaler",
    },
    {
      publisher: "Amazon EKS",
      title: "“Adjust pod resources with Vertical Pod Autoscaler”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/vertical-pod-autoscaler.html",
    },
  ],
  related: [
    {
      title: "Coral and the native Kubernetes autoscalers",
      where: "Learn",
      href: learnPath("hpa-vs-vpa-vs-cluster-autoscaler"),
    },
    {
      title: "Working with HPA",
      where: "Coral FAQ",
      href: `${routes.coralFaq}#working-with-hpa`,
    },
    {
      title: "HPAs and VPAs",
      where: "Coral product guide",
      href: `${routes.coralGuide}#hpas-and-vpas`,
    },
  ],
};
