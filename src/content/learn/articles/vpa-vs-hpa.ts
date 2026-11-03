import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/vpa-vs-hpa/1";
import { figure as figure2 } from "@/features/learn/figures/vpa-vs-hpa/2";

export const article: Article = {
  slug: "vpa-vs-hpa",
  title: "HPA vs VPA in Kubernetes: when to use which",
  meta: "HPA vs VPA in Kubernetes: the HPA sets how many pods run, the VPA sets each pod’s CPU and memory requests. When to use each, and how to run both.",
  h1: "HPA vs VPA in Kubernetes",
  deck: "The HPA changes how many pods run. The VPA changes how much CPU and memory each pod requests.",
  card: "Pod count against pod size: when to use each, why they clash, and how to run both.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes autoscaling",
  versus: ["VPA", "HPA"],
  published: "2026-10-22",
  updated: "2026-11-03",
  author: "sonia",
  cover: "/learn-covers/zoorik-learn-vpa-vs-hpa-1200x630.webp",
  coverAlt: "VPA vs HPA: the VPA sets pod size, the HPA sets pod count",
  short: [
    "Use the ",
    { a: "Horizontal Pod Autoscaler (HPA)", href: "/learn/glossary/horizontal-pod-autoscaler" },
    " when load rises and falls and more pods help. Use the ",
    { a: "Vertical Pod Autoscaler (VPA)", href: "/learn/glossary/vertical-pod-autoscaler" },
    " when each pod’s requests sit far from its real use. You can run both, but not on the same CPU or memory metric: the HPA reads load against the request the VPA keeps changing.",
  ],
  sections: [
    {
      id: "when-to-use-vpa-vs-hpa",
      title: "When to use each",
      blocks: [
        {
          kind: "p",
          text: "Take two Deployments. In the first, each pod uses 200m of the 500m of CPU it requests, all day. More pods would each reserve another 500m. This is the VPA’s job: it sets the request near real use, such as 250m.",
        },
        {
          kind: "p",
          text: "In the second, traffic pushes 4 pods to 140% of their CPU request against a 70% target. The requests are fine, but 4 pods are too few. This is the HPA’s job: it scales to 8.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "ul",
          items: [
            [
              { b: "Use the HPA when load rises and falls." },
              " The workload must be able to add replicas. For a CPU or memory utilization target, every container needs a request for that resource, or the HPA takes no action on that metric.",
            ],
            [
              { b: "Use the VPA when requests sit far from real use." },
              " It suits a steady service that more pods wouldn’t help.",
            ],
            [
              { b: "Use both on different signals." },
              " For example, a CPU-based HPA with a memory-only VPA.",
            ],
            [
              { b: "Keep the VPA off DaemonSet pods where a node autoscaler runs." },
              " Kubernetes warns it can make the autoscaler’s capacity predictions unreliable.",
            ],
          ],
        },
        {
          kind: "h3",
          id: "the-difference-between-hpa-and-vpa",
          title: "Key differences",
        },
        {
          kind: "table",
          columns: [
            { label: "Question", width: "14%" },
            { label: "VPA", width: "54%" },
            { label: "HPA", width: "32%" },
          ],
          rows: [
            [
              "What it changes",
              "Each container’s CPU and memory requests, and by default its limits in the same ratio",
              "The number of replicas",
            ],
            [
              "Part of Kubernetes",
              ["No. An add-on with its own custom resource, ", { code: "autoscaling.k8s.io/v1" }],
              ["Yes. Built into the core API, ", { code: "autoscaling/v2" }],
            ],
            [
              "On AKS and EKS",
              [
                "Preconfigured in AKS Automatic. In AKS Standard you set it up yourself. On EKS, install Metrics Server, then run the autoscaler project’s ",
                { code: "vpa-up.sh" },
                " script",
              ],
              "Built in",
            ],
            [
              "What it reads",
              "Current and past CPU and memory use, and out-of-memory events",
              "Usage as a share of the request, every 15 seconds, or custom and external metrics",
            ],
            [
              "How a change lands",
              "Evicts and recreates pods, or resizes them in place on Kubernetes 1.33 or later",
              "Adds or removes pods. Scale-down waits 300 seconds by default",
            ],
            [
              "What it needs",
              "A metrics source such as Metrics Server",
              "A metrics source, and a request on every container for a utilization target",
            ],
            ["What it can’t do", "Add pods, or remove nodes", "Resize a pod, or scale a DaemonSet"],
            ["Fits best", "Requests far from real use", "Load that rises and falls"],
          ],
        },
      ],
    },
    {
      id: "what-are-the-vpa-and-the-hpa",
      title: "How they work",
      blocks: [
        { kind: "h3", id: "what-is-the-vpa", title: "The VPA" },
        {
          kind: "p",
          text: [
            "The VPA is an add-on from the Kubernetes autoscaler project, not part of the core API. You point its ",
            { code: "VerticalPodAutoscaler" },
            " custom resource at a workload, such as a Deployment. It then sets that workload’s CPU and memory requests from measured use. By default it scales limits too, keeping the pod spec’s ratio of limit to request.",
          ],
        },
        { kind: "p", text: "Three components do the work:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Recommender." },
              " It reads current and past use, including out-of-memory (OOM) events, and stores a target request in the VPA’s status.",
            ],
            [
              { b: "Updater." },
              " It evicts or resizes running pods whose requests are far from that target, within their ",
              { a: "PodDisruptionBudgets", href: "/learn/glossary/pod-disruption-budget" },
              ".",
            ],
            [
              { b: "Admission controller." },
              " This mutating webhook writes the target into new pods.",
            ],
          ],
        },
        {
          kind: "p",
          text: "Microsoft’s AKS documentation adds two limits. The recommender keeps at most 8 days of history. JVM-based workloads aren’t supported, because the VPA has limited visibility into their real memory use.",
        },
        {
          kind: "p",
          text: [
            "The ",
            {
              a: "VPA update modes",
              href: "/learn/glossary/vertical-pod-autoscaler#vpa-update-modes",
            },
            ", set in the ",
            { code: "updateMode" },
            " field, decide what happens to running pods:",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { code: "Off" },
              " only recommends: you read the target with ",
              { code: "kubectl describe vpa/<name>" },
              " and apply it yourself.",
            ],
            [{ code: "Initial" }, " sets requests only when a pod is created."],
            [
              { code: "Recreate" },
              " evicts running pods whose requests differ significantly from the target, so they come back at the new size.",
            ],
            [
              { code: "Auto" },
              " is deprecated, and for now behaves exactly like ",
              { code: "Recreate" },
              ".",
            ],
            [
              { code: "InPlaceOrRecreate" },
              " applies an ",
              { a: "in-place pod resize", href: "/learn/in-place-pod-resize" },
              " to running pods, and evicts them only when it can’t.",
            ],
            [
              { code: "InPlace" },
              " never evicts: when a resize can’t happen, it waits and retries.",
            ],
          ],
        },
        {
          kind: "callout",
          label: "For engineers",
          text: [
            { code: "InPlaceOrRecreate" },
            " has been GA since VPA 1.6.0 and needs Kubernetes 1.33 or later. Microsoft lists it for AKS 1.34 and later. ",
            { code: "InPlace" },
            " is alpha in VPA 1.7.0, behind the ",
            { code: "InPlace" },
            " feature gate.",
          ],
        },
        { kind: "h3", id: "what-is-the-hpa", title: "The HPA" },
        {
          kind: "p",
          text: [
            "The HPA is built into Kubernetes: the ",
            { code: "HorizontalPodAutoscaler" },
            " object in ",
            { code: "autoscaling/v2" },
            ", run by a control loop in the kube-controller-manager. Every 15 seconds by default, it reads a metric. Then it changes the replica count of a Deployment, StatefulSet or other scalable workload to hold that metric at a target.",
          ],
        },
        {
          kind: "p",
          text: [
            "For a CPU or memory utilization target, the metric is usage as a percentage of the request. The HPA reads it from the resource metrics API, ",
            { code: "metrics.k8s.io" },
            ", which Metrics Server usually serves. Its core rule is:",
          ],
        },
        {
          kind: "p",
          text: [
            { code: "desiredReplicas = ceil(currentReplicas × currentMetric ÷ targetMetric)" },
          ],
        },
        {
          kind: "p",
          text: "For the second Deployment above, that’s ceil(4 × 140 ÷ 70) = 8 pods. By default, the HPA skips any change while the ratio of current to target stays within 0.1 of 1.0. It scales down only after a 300-second stabilization window.",
        },
        {
          kind: "p",
          text: "Custom and external metrics work too. On a CPU or memory utilization target, every decision divides by the pod’s request.",
        },
      ],
    },
    {
      id: "requests-decide-what-you-pay-for",
      title: "Requests decide node count",
      blocks: [
        {
          kind: "p",
          text: "The scheduler places pods by their CPU and memory requests, not their use. A pod fits a node only if its requests, plus those already there, fit the node’s capacity. So a request set “to be safe” at four times real use keeps you paying for nodes that do almost nothing.",
        },
        {
          kind: "p",
          text: [
            { a: "Node autoscalers", href: "/learn/kubernetes-autoscaling" },
            " such as the Cluster Autoscaler and Karpenter count the same way. They add nodes to fit requests and consolidate on requests, not real use. A request set too high can stop a node from being removed.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Limits", href: "/learn/kubernetes-pod-right-sizing" },
            " are a separate control: the kernel ",
            { a: "throttles", href: "/learn/glossary/kubernetes-cpu-throttling" },
            " a container at its CPU limit and may ",
            { a: "OOM-kill", href: "/learn/oomkilled-exit-code-137" },
            " one that goes past its memory limit.",
          ],
        },
      ],
    },
    {
      id: "why-they-clash-on-cpu",
      title: "HPA and VPA together",
      blocks: [
        {
          kind: "p",
          text: "The HPA and VPA work together only on different signals. On the same CPU or memory metric, they feed each other. Each request change from the VPA looks like a load change to the HPA, so the pod count follows the VPA, not real load.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "Give the first Deployment a CPU-based HPA too, with a 70% target and a minimum of 4 pods. Each pod uses 200m of its 500m request: 40% utilization, and 800m of load in all. The VPA shrinks the request to 250m, so the HPA reads the same 200m as 80%. The ratio, 80 ÷ 70, is about 1.14, outside the 0.1 tolerance. So the HPA asks for ceil(4 × 80 ÷ 70) = 5 pods. The same 800m over 5 pods is 160m each, and the VPA shrinks the request again. The load never changed, but the pod count went from 4 to 5.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: "The same loop happens on memory. The VPA project says not to pair the VPA with an HPA on the same resource metric, CPU or memory. Microsoft’s AKS documentation doesn’t recommend that pair either.",
        },
        { kind: "h3", id: "how-to-run-both", title: "How to run both" },
        {
          kind: "p",
          text: "The VPA project allows the first two patterns, which use different signals. The third keeps the VPA out of running pods:",
        },
        {
          kind: "ol",
          items: [
            [
              "Let the VPA size memory only, with ",
              { code: 'controlledResources: ["memory"]' },
              ", and let the HPA scale on CPU.",
            ],
            "Scale the HPA on a custom or external metric, such as requests per second or queue length, while the VPA sizes CPU and memory.",
            [
              "Keep the VPA in ",
              { code: "Off" },
              " mode, read its targets, and set requests yourself when you deploy.",
            ],
          ],
        },
        { kind: "p", text: "The first pattern, on Kubernetes 1.33 or later:" },
        {
          kind: "code",
          lang: "yaml",
          code: 'apiVersion: autoscaling.k8s.io/v1\nkind: VerticalPodAutoscaler\nmetadata:\n  name: <app>-vpa\nspec:\n  targetRef:\n    apiVersion: apps/v1\n    kind: Deployment\n    name: <app>\n  updatePolicy:\n    updateMode: "InPlaceOrRecreate"\n  resourcePolicy:\n    containerPolicies:\n    - containerName: "<container>"\n      controlledResources: ["memory"]\n---\napiVersion: autoscaling/v2\nkind: HorizontalPodAutoscaler\nmetadata:\n  name: <app>\nspec:\n  scaleTargetRef:\n    apiVersion: apps/v1\n    kind: Deployment\n    name: <app>\n  minReplicas: 2\n  maxReplicas: 10\n  metrics:\n  - type: Resource\n    resource:\n      name: cpu\n      target:\n        type: Utilization\n        averageUtilization: 70',
        },
        {
          kind: "p",
          text: [
            "On an older cluster or VPA release, use ",
            { code: "Recreate" },
            " in place of ",
            { code: "InPlaceOrRecreate" },
            ". In the first and third patterns, the CPU request under the HPA is still yours to set.",
          ],
        },
      ],
    },
    {
      id: "rebalance-first-then-scale-out",
      title: "Set requests first",
      blocks: [
        {
          kind: "p",
          text: "The HPA is only as accurate as the request it divides by, so work in this order:",
        },
        {
          kind: "ol",
          items: [
            [
              { b: "Size requests to measured use." },
              " Take a high percentile of CPU over several days plus ",
              { a: "headroom", href: "/learn/glossary/kubernetes-headroom" },
              ", and the peak of memory. Leave limits alone until you know why they were set.",
            ],
            [
              { b: "Then set the HPA target." },
              " With requests near real use, a 70% target means 70% of what a pod really needs.",
            ],
            [
              { b: "Then let the node autoscaler remove spare nodes." },
              " Smaller requests fit on fewer nodes, and the Cluster Autoscaler or Karpenter can remove the empty ones.",
            ],
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "If the workload already has a CPU-based HPA, halving its CPU request doubles the utilization the HPA reads for the same load. The HPA can then double the pod count and hand the freed capacity straight back as replicas. Change requests in small steps and watch the replica count. Or replay recent load through the HPA’s target and replica limits before you pick a request.",
        },
        {
          kind: "p",
          text: "Where you pay for nodes, smaller requests alone don’t reduce cost. Cost falls when a node is removed.",
        },
      ],
    },
    {
      id: "where-coral-fits",
      title: "Where Coral fits",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " is Kubernetes cost optimization for AKS and EKS. It does the VPA’s job without the VPA, and it works with your HPA.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Requests." },
              " Coral rebalances CPU and memory requests to real use, with its own recommender and webhook. Your manifests stay as they are, and new pods start at the new size. Running pods are resized in place on Kubernetes 1.33 or later, or else restarted one at a time within their PodDisruptionBudgets.",
            ],
            [
              { b: "Your VPAs." },
              " With automation on, Coral switches an active VPA to Off. It restores the VPA when you switch automation off or disconnect.",
            ],
            [
              { b: "Your HPA." },
              " The HPA decides how many pods run, and Coral decides how big each pod is. For a CPU-based HPA, Coral replays past load through that HPA’s own settings before it picks a request. A smaller request wins only if its saving beats the cost of unserved load and extra scaling. While the HPA is scaling and below its max, Coral holds back its CPU raises and pauses pod replacements until every pod is Ready.",
            ],
            [
              { b: "HPAs it manages." },
              " With automation on, Coral creates an HPA for an ",
              { a: "eligible", href: "/coral-guide#hpas-and-vpas" },
              " Deployment or Argo Rollout that has none, with ",
              { code: "minReplicas" },
              " of 2 or more. Every built-in policy except read-only does this. On an HPA nothing else manages, Coral can take over: it keeps your ",
              { code: "minReplicas" },
              " and only raises ",
              { code: "maxReplicas" },
              ". Workload optimization never changes HPAs from Helm, KEDA or kubectl apply, or HPAs whose bounds Argo CD or Flux own.",
            ],
            [
              { b: "Nodes." },
              " Coral drains and removes the nodes you don’t need, one at a time. Node optimization is on from install, and you can limit it to chosen node pools.",
            ],
            [
              { b: "Opt-in." },
              " Pod sizing waits for you: Coral only recommends until you switch on automation for a policy or a workload.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "On our own AKS development cluster, Coral removed a spare worker and rebalanced the requests of 14 apps. Then it swapped the remaining worker for a cheaper machine of the same size. Eight days after we connected it, ",
            { a: "the cluster’s machines cost", href: "/coral-value-lab" },
            " $154.76 a month instead of $368.65, 58% less.",
          ],
        },
      ],
    },
  ],
  help: {
    product: "coral",
    text: "Coral rebalances CPU and memory requests on AKS and EKS, works with your HPA, and removes the nodes you don’t need. We estimate 40–50% off AKS and EKS cost. It is an estimated range, not a promise. The free assessment works out your own figure.",
    links: [
      { label: "Kubernetes optimization with Coral", href: "/coral" },
      { label: "Estimate your saving", href: "/assessment?p=coral" },
    ],
  },
  sources: [
    {
      publisher: "Kubernetes",
      title: "“Horizontal Pod Autoscaling”",
      url: "https://kubernetes.io/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/",
    },
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
      publisher: "Kubernetes",
      title: "“Node Autoscaling”",
      url: "https://kubernetes.io/docs/concepts/cluster-administration/node-autoscaling/",
    },
    {
      title: "Kubernetes autoscaler project, Vertical Pod Autoscaler “Known limitations”",
      url: "https://github.com/kubernetes/autoscaler/blob/master/vertical-pod-autoscaler/docs/known-limitations.md",
    },
    {
      title: "Kubernetes autoscaler project, Vertical Pod Autoscaler “Features”",
      url: "https://github.com/kubernetes/autoscaler/blob/master/vertical-pod-autoscaler/docs/features.md",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Vertical Pod Autoscaling in Azure Kubernetes Service (AKS)”",
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
      title: "Kubernetes autoscaling",
      where: "Learn",
      href: "/learn/kubernetes-autoscaling",
    },
    {
      title: "KEDA vs HPA vs VPA",
      where: "Learn",
      href: "/learn/keda-vs-hpa-vs-vpa",
    },
    {
      title: "KEDA vs Karpenter",
      where: "Learn",
      href: "/learn/keda-vs-karpenter",
    },
    {
      title: "How Coral works with your HPA",
      where: "Coral FAQ",
      href: "/coral-faq#working-with-hpa",
    },
    {
      title: "How Coral handles HPAs and VPAs",
      where: "Coral product guide",
      href: "/coral-guide#hpas-and-vpas",
    },
  ],
};
