import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/vpa-vs-hpa/1";
import { figure as figure2 } from "@/features/learn/figures/vpa-vs-hpa/2";

export const article: Article = {
  slug: "vpa-vs-hpa",
  title: "VPA vs HPA in Kubernetes: when to use which",
  meta: "VPA vs HPA: the VPA sets how much CPU and memory each pod requests, the HPA sets how many pods run. When to use each, why they clash, and what to do first.",
  h1: "VPA vs HPA: when to use which, and why to rebalance first",
  deck: "What each autoscaler changes, when to use which, why they clash on CPU, and the order that works.",
  card: "When to use the VPA or the HPA, why they clash on CPU, and why to rebalance requests first.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes autoscaling",
  versus: ["VPA", "HPA"],
  published: "2026-10-31",
  updated: "2026-10-31",
  author: "sonia",
  short:
    "The Vertical Pod Autoscaler (VPA) changes how much CPU and memory each pod requests, and the Horizontal Pod Autoscaler (HPA) changes how many pods run. VPA vs HPA is pod size against pod count. Use the HPA for load that rises and falls, and the VPA, or your own sizing, to keep requests near real use. Don’t run both on the same CPU or memory metric, because the HPA measures load against the request the VPA keeps moving.",
  sections: [
    {
      id: "when-to-use-vpa-vs-hpa",
      title: "When to use VPA vs HPA",
      blocks: [
        {
          kind: "p",
          text: "The question behind HPA vs VPA in Kubernetes is what should change when a workload gets busy: the number of pods, or the size of each one, while the node count follows from both. Add copies when more copies can share the load. When the load is steady and only the requests are wrong, fix the requests. Most production services need both jobs done, so VPA or HPA is rarely a choice of one, and the real decision is how to run both without two controllers reading the same signal.",
        },
        {
          kind: "ul",
          items: [
            "Use the HPA when load rises and falls and the workload can add replicas. For a CPU or memory utilization target, every container in the pod needs a request for that resource, or the HPA takes no action on that metric.",
            "Use the VPA when requests sit far from real use and more copies wouldn’t help, such as a steady internal service.",
            "Use both on different signals: a CPU-based HPA with a memory-only VPA, or an HPA on a custom metric such as requests per second with a VPA sizing CPU and memory.",
            "Keep DaemonSet pods out of the VPA where a node autoscaler runs, because Kubernetes warns it can make the autoscaler’s predictions of free capacity unreliable.",
          ],
        },
        {
          kind: "p",
          text: "Here is the difference between HPA and VPA, on the points you decide on.",
        },
        {
          kind: "table",
          columns: [
            { label: "Question", width: "14%" },
            { label: "VPA", width: "46%" },
            { label: "HPA", width: "40%" },
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
              "What it reads",
              "Current and past CPU and memory use, and out-of-memory events",
              "Usage as a share of the request, every 15\u00a0seconds, or custom and external metrics",
            ],
            [
              "How a change lands",
              "Evicts and recreates pods, or resizes them in place on Kubernetes 1.33 or later",
              "Adds or removes pods. Scale-down waits out a 300-second window by default",
            ],
            [
              "What it needs",
              "A metrics source such as Metrics Server",
              "A metrics source, and a request on every container for a CPU or memory utilization target",
            ],
            [
              "What it can’t do",
              "Add pods when one pod can’t serve the load, or remove nodes",
              "Change a pod’s size, or scale a DaemonSet",
            ],
            [
              "Fits best",
              "Requests far from real use",
              "Load that rises and falls across replicas",
            ],
          ],
        },
      ],
    },
    {
      id: "what-are-the-vpa-and-the-hpa",
      title: "What are the VPA and the HPA?",
      blocks: [
        { kind: "diagram", figure: figure1 },
        { kind: "h3", id: "what-is-the-vpa", title: "What is the VPA?" },
        {
          kind: "p",
          text: [
            "The VPA is an add-on from the Kubernetes autoscaler project that you install separately, since it isn’t part of the core Kubernetes API. You attach its ",
            { code: "VerticalPodAutoscaler" },
            " custom resource to a workload, such as a Deployment, and the VPA sets that workload’s CPU and memory requests to match the use it measures. By default it sets limits too, keeping the ratio of limit to request that the pod spec gave. A metrics source such as Metrics Server must be running.",
          ],
        },
        {
          kind: "p",
          text: [
            "On AKS it comes preconfigured in AKS Automatic, and you set it up yourself in AKS Standard. On EKS you deploy it from the autoscaler project’s repository with its ",
            { code: "vpa-up.sh" },
            " script, after installing Metrics Server.",
          ],
        },
        {
          kind: "p",
          text: "Three components do the work. Its recommender reads current and past use, including out-of-memory (OOM) events, and stores a target request in the VPA’s status. Pods whose requests are far from that target are evicted or resized by the updater, within their PodDisruptionBudgets. A mutating webhook, the admission controller, writes the target into new pods.",
        },
        {
          kind: "p",
          text: ["The ", { code: "updateMode" }, " field decides what happens to running pods:"],
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
            [{ code: "Initial" }, " sets requests when a pod is created, and never again."],
            [
              { code: "Recreate" },
              " evicts running pods whose requests differ significantly from the target, so they come back at the new size.",
            ],
            [
              { code: "InPlaceOrRecreate" },
              " applies an ",
              { a: "in-place pod resize", href: "/learn/in-place-pod-resize" },
              " to running pods and evicts only when it can’t. GA since VPA 1.6.0, it needs Kubernetes 1.33 or later, and Microsoft lists it for AKS 1.34 and later.",
            ],
            [
              { code: "InPlace" },
              " never evicts: when a resize can’t happen, it waits and retries, and it arrived as an alpha feature in VPA 1.7.0, behind the ",
              { code: "InPlace" },
              " feature gate.",
            ],
            [
              { code: "Auto" },
              " is deprecated and, for now, behaves exactly like ",
              { code: "Recreate" },
              ".",
            ],
          ],
        },
        {
          kind: "p",
          text: "Microsoft’s AKS documentation adds two limits worth knowing: the recommender keeps at most 8\u00a0days of history, and the VPA doesn’t support JVM-based workloads, because it has limited visibility into their real memory use.",
        },
        { kind: "h3", id: "what-is-the-hpa", title: "What is the HPA?" },
        {
          kind: "p",
          text: [
            "The HPA is built into Kubernetes, as the ",
            { code: "HorizontalPodAutoscaler" },
            " object in ",
            { code: "autoscaling/v2" },
            " and a control loop in the kube-controller-manager. Every 15\u00a0seconds by default, it reads a metric and changes the replica count of a Deployment, StatefulSet or other scalable workload to hold that metric at a target.",
          ],
        },
        {
          kind: "p",
          text: [
            "For a CPU or memory utilization target, the metric is usage as a percentage of the request, read through the resource metrics API (",
            { code: "metrics.k8s.io" },
            ") that Metrics Server usually serves. Its core rule is:",
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
          text: "With a 70% CPU target, 4\u00a0pods running at 140% of their request become 8. By default, the controller skips any change while the ratio of current to target stays within 0.1 of 1.0, and it scales down only after a 300-second stabilization window.",
        },
        {
          kind: "p",
          text: "Custom and external metrics, such as requests per second or queue length, work too. With a CPU or memory utilization target, the HPA takes each pod’s request as given and divides by it in every decision.",
        },
      ],
    },
    {
      id: "requests-decide-what-you-pay-for",
      title: "Requests decide what you pay for",
      blocks: [
        {
          kind: "p",
          text: "Pods are placed by their CPU and memory requests, not their use: the scheduler puts a pod on a node only if the requests already there, plus the new pod’s, fit the node’s capacity, and it refuses the node even when real use on it is very low.",
        },
        {
          kind: "p",
          text: [
            { a: "Node autoscalers", href: "/learn/hpa-vs-vpa-vs-cluster-autoscaler" },
            " such as the Cluster Autoscaler and Karpenter count the same way. Kubernetes’ node autoscaling documentation says they provision nodes to fit pod requests and consolidate on requests rather than real use, so a request set too high can stop a node from being consolidated. A request set “to be safe” at four times real use keeps nodes running that do almost nothing, and you pay for those nodes.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Limits", href: "/learn/kubernetes-pod-right-sizing" },
            " are a separate control: the kernel throttles a container at its CPU limit and may ",
            { a: "OOM-kill", href: "/learn/oomkilled-exit-code-137" },
            " one that goes past its memory limit.",
          ],
        },
      ],
    },
    {
      id: "why-they-clash-on-cpu",
      title: "Why they clash on CPU",
      blocks: [
        { kind: "diagram", figure: figure2 },
        {
          kind: "p",
          text: "Run both on the same metric and they feed each other. Say a pod uses 200m of a 500m CPU request, 40% utilization, and the VPA shrinks the request to 250m. The HPA reads the same load as 80%. Against a 70% target that’s a ratio of about 1.14, outside the default 0.1 tolerance, so it adds pods, each pod then uses less, and the VPA shrinks the request again. The replica count ends up following the last request change more than real load. An HPA on memory meets the same loop on memory.",
        },
        {
          kind: "p",
          text: "That’s why the VPA project says not to pair the VPA with an HPA on the same resource metric (CPU or memory). Microsoft’s AKS documentation doesn’t recommend that pair either. The VPA project does allow both when they read different signals, as in the first two patterns below. The third avoids the clash by keeping the VPA out of running pods:",
        },
        {
          kind: "ol",
          items: [
            [
              "Let the VPA size memory only, with ",
              { code: 'controlledResources: ["memory"]' },
              ", and let the HPA scale on CPU.",
            ],
            "Scale the HPA on a custom or external metric, such as requests per second or queue length, and let the VPA size CPU and memory.",
            [
              "Keep the VPA in ",
              { code: "Off" },
              " mode, read its targets, and set requests yourself when you deploy.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "For a Deployment named ",
            { code: "<app>" },
            " on Kubernetes 1.33 or later, the first pattern looks like this:",
          ],
        },
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
            ". In the first and third patterns the CPU request under the HPA is still yours to set, and every number the HPA computes rests on it.",
          ],
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
        {
          kind: "ol",
          items: [
            "Size requests to measured use: a high percentile of CPU over several days plus headroom, and the peak of memory. Leave limits alone until you know why they were set.",
            "Then set the HPA target. With honest requests, 70% utilization means 70% of what a pod really needs, and the HPA scales out when load really grows.",
            "Then let the node autoscaler remove what’s left. Smaller requests fit on fewer nodes, and the Cluster Autoscaler or Karpenter can remove the empty ones.",
          ],
        },
        {
          kind: "p",
          text: "Take care with step 1 on a workload that already has a CPU-based HPA. Halve its CPU request and the HPA reads the same load as twice the utilization, so it can double the pod count and hand the freed requests straight back as replicas. Change requests in small steps and watch the replica count, or replay recent load through the HPA’s target and replica limits before you pick a request.",
        },
        {
          kind: "p",
          text: "Where you pay for nodes, smaller requests don’t reduce the bill on their own: it goes down when a node is removed.",
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
            " optimizes Kubernetes on AKS and EKS. It does the VPA’s job without using the VPA, and it works with your HPA, so you don’t have to choose between them.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Rebalancing." },
              " Coral rebalances CPU and memory requests with its own recommender and webhook. On the default balanced policy, CPU is the 80th percentile of the last 3\u00a0days plus 10%, and memory is the highest use in the last 8\u00a0days plus 10%. Your manifests stay as they are: the webhook sizes pods as they start, and it fails open. Running pods are resized in place on 1.33+ nodes, or restarted one at a time within their PodDisruptionBudgets.",
            ],
            [
              { b: "Your VPAs." },
              " With automation on, Coral switches an active VPA to Off and restores it when you switch automation off or disconnect.",
            ],
            [
              { b: "HPA-aware sizing." },
              " The HPA decides how many pods run, and Coral decides how big each pod is. For a workload with a CPU-based HPA, Coral replays past load (3\u00a0days on the default policy) through that HPA’s own settings before it picks a request. A smaller request wins only if its saving beats the cost of unserved load and extra scaling. While the HPA is scaling and below its max, Coral holds back its own surge and CPU-pressure raises, and pauses pod replacements until every pod is Ready.",
            ],
            [
              { b: "HPAs it manages." },
              " With automation on and the Optimization type “Both”, Coral creates an HPA, with ",
              { code: "minReplicas" },
              " of 2 or more, for an ",
              { a: "eligible", href: "/coral/guide#hpas-and-vpas" },
              " Deployment or Argo Rollout that has none. On a hand-made HPA it takes over, it keeps your ",
              { code: "minReplicas" },
              " and only raises ",
              { code: "maxReplicas" },
              ". Workload optimization never changes HPAs that Helm, Argo CD, Flux, KEDA or kubectl apply manage.",
            ],
            [
              { b: "Nodes." },
              " Coral drains spare nodes one at a time so your Cluster Autoscaler, AKS node auto-provisioning or Karpenter can remove them. Node optimization is on from install, and you can limit it to chosen node pools.",
            ],
            [
              { b: "Opt-in." },
              " Pod sizing waits for you: Coral only recommends until “Automatically optimize” is on for a policy or a workload.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "On our own AKS development cluster, Coral removed a spare worker, rebalanced the requests of 14 apps and swapped the remaining worker for a cheaper machine of the same size. Eight days after we connected it, ",
            { a: "the machine bill", href: "/case-studies/coral-dev-cluster" },
            " was $154.76 a month instead of $368.65, 58% less.",
          ],
        },
      ],
    },
  ],
  help: {
    product: "coral",
    text: "Coral rebalances CPU and memory requests on AKS and EKS, works with your HPA, and drains spare nodes so your autoscaler can remove them. We estimate it takes 40–50% off AKS and EKS cost. It is an estimated range, not a promise. The free assessment works out your own figure.",
    links: [
      { label: "Kubernetes cost optimization with Coral", href: "/coral" },
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
      title: "HPA vs VPA vs Cluster Autoscaler: what each one scales",
      where: "Learn",
      href: "/learn/hpa-vs-vpa-vs-cluster-autoscaler",
    },
    {
      title: "KEDA vs HPA vs VPA: where event-driven scaling fits",
      where: "Learn",
      href: "/learn/keda-vs-hpa-vs-vpa",
    },
    { title: "Working with HPA", where: "Coral FAQ", href: "/coral/faq#working-with-hpa" },
    { title: "HPAs and VPAs", where: "Coral product guide", href: "/coral/guide#hpas-and-vpas" },
  ],
};
