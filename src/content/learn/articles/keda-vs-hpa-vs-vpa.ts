import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/keda-vs-hpa-vs-vpa/1";
import { figure as figure2 } from "@/features/learn/figures/keda-vs-hpa-vs-vpa/2";

export const article: Article = {
  slug: "keda-vs-hpa-vs-vpa",
  title: "KEDA vs HPA: where event-driven scaling fits",
  meta: "KEDA vs HPA: KEDA scales pods on events through an HPA it creates, while the HPA scales on CPU. KEDA vs VPA: the VPA sizes requests. Which pairs work together.",
  h1: "KEDA vs HPA: where event-driven scaling fits",
  deck: "KEDA and the HPA set how many pods run, and the VPA sets how big each one is. How they overlap, and what to combine.",
  card: "How KEDA drives an HPA, where the VPA fits, and which pairs are safe to run on one workload.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes autoscaling",
  versus: ["KEDA · HPA", "VPA"],
  published: "2026-11-01",
  updated: "2026-11-01",
  author: "shreya",
  cover: "/learn-covers/zoorik-learn-keda-vs-hpa-vs-vpa-1200x630.webp",
  coverAlt: "KEDA vs HPA vs VPA: KEDA drives the HPA to add pods, while the VPA makes a pod bigger",
  short:
    "KEDA vs HPA vs VPA comes down to pod count against pod size: the Vertical Pod Autoscaler (VPA) alone sets each pod’s requests. The Horizontal Pod Autoscaler (HPA) sets the count, usually from CPU, and KEDA sets it from events through an HPA it creates, down to zero.",
  sections: [
    {
      id: "keda-vs-hpa-vs-vpa",
      title: "KEDA, the HPA and the VPA: two set the pod count, one sets the pod size",
      blocks: [
        {
          kind: "p",
          text: [
            "Picture an orders worker that takes jobs from a queue and scales with an ",
            { a: "HPA", href: "/learn/glossary/horizontal-pod-autoscaler" },
            " on CPU. Overnight nothing waits, yet the HPA keeps at least one pod running. In the morning 400 jobs pile up, and the HPA still sees only the CPU of the pods it already runs.",
          ],
        },
        {
          kind: "p",
          text: "KEDA (Kubernetes Event-driven Autoscaling) reads the number of waiting jobs instead, through a ScaledObject. Its HPA asks for 8\u00a0pods, one for every 50 jobs. Once nothing has waited for 300\u00a0seconds, KEDA takes the worker back to zero.",
        },
        {
          kind: "p",
          text: [
            "The ",
            { a: "VPA", href: "/learn/glossary/vertical-pod-autoscaler" },
            " sets a different number on the same worker: each pod’s ",
            { a: "request", href: "/learn/glossary/kubernetes-resource-requests" },
            ". That’s the CPU and memory a container asks the scheduler to reserve.",
          ],
        },
        {
          kind: "p",
          text: [
            "None of the three adds or removes nodes. The Cluster Autoscaler, Karpenter and AKS node auto provisioning (NAP) do that, and the guide to ",
            { a: "Kubernetes autoscaling", href: "/learn/hpa-vs-vpa-vs-cluster-autoscaler" },
            " compares them.",
          ],
        },
        {
          kind: "table",
          columns: [
            { label: "", width: "14%" },
            { label: "KEDA", width: "27%" },
            { label: "HPA", width: "33%" },
            { label: "VPA", width: "26%" },
          ],
          rows: [
            [
              "What it changes",
              "The number of pods, through an HPA it creates",
              "The number of pods",
              "Each container’s CPU and memory requests, and limits with them",
            ],
            [
              "What it reads",
              "Event sources through built-in scalers: queues, streams, Prometheus queries, cron schedules",
              "CPU or memory use as a percentage of the request, or custom and external metrics through an adapter",
              "Each container’s current and past use, and out-of-memory events",
            ],
            [
              "Scale to zero",
              "Yes, unless CPU and memory are its only triggers",
              "From Kubernetes 1.37 (beta, on by default), on object or external metrics only",
              "Doesn’t apply: it never changes the pod count",
            ],
            [
              "The object you write",
              [{ code: "ScaledObject" }, ", or ", { code: "ScaledJob" }, " for Jobs"],
              [{ code: "HorizontalPodAutoscaler" }, " (", { code: "autoscaling/v2" }, ")"],
              [{ code: "VerticalPodAutoscaler" }, " (", { code: "autoscaling.k8s.io/v1" }, ")"],
            ],
            [
              "How you get it",
              "Helm, or the managed add-on on AKS",
              "Built into Kubernetes",
              "An add-on from the Kubernetes autoscaler project",
            ],
            [
              "Don’t pair it with",
              "An HPA on the same workload",
              "A ScaledObject on the same workload, or a VPA on the same CPU or memory metric",
              "An HPA or KEDA trigger on the same CPU or memory metric",
            ],
          ],
        },
        {
          kind: "p",
          text: "All three meet at the request. The HPA measures CPU and memory utilization as a percentage of the request. With no request set, it takes no action on that metric.",
        },
        {
          kind: "p",
          text: "KEDA’s cpu and memory triggers work the same way. KEDA reads those metrics from the Kubernetes Metrics Server, and the pods must set requests (or limits) for them. Only the VPA moves the request, which is why the pairs further down matter.",
        },
      ],
    },
    {
      id: "keda-vs-hpa-keda-creates-an-hpa",
      title: "KEDA vs HPA: KEDA creates an HPA and feeds it events",
      blocks: [
        {
          kind: "p",
          text: [
            "When you apply a ScaledObject, the keda-operator creates an HPA for the target workload and manages it from then on. KEDA names it ",
            { code: "keda-hpa-<scaledobject-name>" },
            " unless you set another name. The Amazon EKS user guide says you don’t create or edit it yourself.",
          ],
        },
        {
          kind: "p",
          text: [
            "KEDA is a graduated Cloud Native Computing Foundation project, and 2.21 is its current release as of October 2026. ",
            { a: "What KEDA is and how it scales", href: "/learn/what-is-keda" },
            " covers its scalers and authentication.",
          ],
        },
        {
          kind: "h3",
          id: "two-tracks-zero-to-one-then-one",
          title: "Two tracks: zero to one, then one to N",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Between zero and one replica, the keda-operator acts alone." },
              " It checks each trigger every 30\u00a0seconds by default (",
              { code: "pollingInterval" },
              "). It wakes the workload when a trigger turns active, and returns it to zero 300\u00a0seconds after the last active trigger (",
              { code: "cooldownPeriod" },
              ").",
            ],
            [
              { b: "Between one and N replicas, the HPA decides." },
              " It asks for the metric every 15\u00a0seconds by default, and KEDA’s metrics API server answers from the event source.",
            ],
          ],
        },
        {
          kind: "p",
          text: "KEDA autoscaling vs HPA autoscaling differs in the inputs and the step from zero. From one replica up, the HPA’s formula sets the count either way.",
        },
        {
          kind: "h3",
          id: "what-a-plain-hpa-needs-to-scale",
          title: "What a plain HPA needs to scale on events",
        },
        {
          kind: "p",
          text: "A plain HPA reads CPU and memory from the resource metrics API. Metrics Server usually serves that API, and it’s an add-on you launch separately.",
        },
        {
          kind: "p",
          text: "For queue depth or any other outside signal, an HPA needs an adapter for the external metrics API. KEDA is that adapter. Its built-in scalers read sources such as:",
        },
        {
          kind: "ul",
          items: [
            "queues and streams in Apache Kafka, RabbitMQ, Amazon SQS and Azure Service Bus",
            "Prometheus queries",
            "cron schedules",
          ],
        },
        { kind: "svg", figure: figure1 },
        { kind: "h3", id: "scale-to-zero-on-a-plain-hpa", title: "Scale to zero on a plain HPA" },
        {
          kind: "p",
          text: [
            "In Kubernetes 1.37 the ",
            { code: "HPAScaleToZero" },
            " feature gate is beta and on by default. So an HPA on object or external metrics can set ",
            { code: "minReplicas: 0" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "CPU and memory still can’t reach zero, because they’re only measured on running pods. The external metric also still needs an adapter, and only one server can provide external metrics in a cluster. Where KEDA runs, KEDA is that server.",
        },
      ],
    },
    {
      id: "keda-scaledobject-vs-hpa-one-owner-per",
      title: "KEDA ScaledObject vs HPA: one owner per workload",
      blocks: [
        {
          kind: "p",
          text: "A ScaledObject holds what an HPA holds (the target, the bounds, the scaling behavior) plus the event source. Here is the opening’s orders worker, reading waiting jobs from Prometheus:",
        },
        {
          kind: "code",
          lang: "yaml",
          code: 'apiVersion: keda.sh/v1alpha1\nkind: ScaledObject\nmetadata:\n  name: orders-worker\nspec:\n  scaleTargetRef:\n    name: orders-worker          # a Deployment in the same namespace\n  minReplicaCount: 0             # the default: idle means zero pods\n  maxReplicaCount: 20\n  pollingInterval: 30            # the default, in seconds\n  cooldownPeriod: 300            # the default, in seconds\n  triggers:\n    - type: prometheus\n      metricType: AverageValue   # the threshold is per pod\n      metadata:\n        serverAddress: http://<prometheus-host>:9090\n        query: <a query that returns the number of waiting jobs>\n        threshold: "50"',
        },
        {
          kind: "p",
          text: "At 400 waiting jobs, the threshold of 50 per pod gives 400 ÷ 50 = 8\u00a0pods, within the maximum of 20.",
        },
        {
          kind: "p",
          text: "The rule that matters most is one pod-count owner per workload. Microsoft’s AKS documentation recommends against a ScaledObject and an HPA on the same workload. KEDA runs an HPA underneath, so the two compete.",
        },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            "If the HPA exists first, the ScaledObject fails to be created. If the ScaledObject exists first, a new HPA isn’t blocked, so check with ",
            { code: "kubectl get hpa" },
            " that each workload has exactly one.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "To hand your own HPA over to KEDA," },
              " annotate the ScaledObject with ",
              { code: 'scaledobject.keda.sh/transfer-hpa-ownership: "true"' },
              " and set ",
              { code: "spec.advanced.horizontalPodAutoscalerConfig.name" },
              " to that HPA’s name.",
            ],
            [
              { b: "To scale on CPU and a queue together," },
              " put both triggers in one ScaledObject. The HPA works out a replica count for each metric and uses the highest.",
            ],
            [
              { b: "A cpu or memory trigger needs requests on the pods." },
              " It can’t take a workload to zero by itself either, since no running pods means no CPU to measure.",
            ],
          ],
        },
        { kind: "h3", id: "on-aks-the-keda-add-on", title: "On AKS: the KEDA add-on" },
        {
          kind: "p",
          text: "On AKS Standard, KEDA is a managed add-on you turn on with the Azure CLI or an ARM template. AKS Automatic comes with KEDA preconfigured. The add-on has three limits:",
        },
        {
          kind: "ul",
          items: [
            "The cluster’s Kubernetes version decides which KEDA version you get.",
            "You can’t change the CPU requests, limits or other Helm values of its operator or metrics server.",
            "KEDA must be the only external metrics server in the cluster, and a second KEDA installation isn’t supported.",
          ],
        },
        { kind: "p", text: "So on AKS, KEDA vs HPA is a choice you make per workload:" },
        {
          kind: "ul",
          items: [
            "KEDA for workloads driven by Kafka topics or Event Hubs",
            "a plain HPA for CPU-bound services",
            "never both on one Deployment",
          ],
        },
        {
          kind: "h3",
          id: "on-eks-install-keda-with-helm",
          title: "On EKS: install KEDA with Helm",
        },
        { kind: "p", text: "The EKS user guide installs KEDA with Helm:" },
        { kind: "ol", items: ["Add the KEDA chart repository, then update your repositories:"] },
        {
          kind: "code",
          lang: "bash",
          code: "helm repo add kedacore https://kedacore.github.io/charts\nhelm repo update",
        },
        {
          kind: "ol",
          start: 2,
          items: [["Install KEDA into its own namespace, ", { code: "keda" }, ":"]],
        },
        {
          kind: "code",
          lang: "bash",
          code: "helm install keda kedacore/keda --namespace keda --create-namespace",
        },
        {
          kind: "ol",
          start: 3,
          items: [
            "Install Metrics Server too if the cluster lacks it, because KEDA’s cpu and memory triggers and the HPA’s CPU scaling read from it.",
          ],
        },
      ],
    },
    {
      id: "keda-vs-vpa-they-work-together-when",
      title: "KEDA vs VPA: they work together when they read different signals",
      blocks: [
        { kind: "p", text: "The VPA has three parts:" },
        {
          kind: "ul",
          items: [
            "Its recommender reads each container’s use and out-of-memory events, and stores a target recommendation with bounds around it.",
            "Its updater brings running pods to that target.",
            "Its admission webhook sizes new pods as they start.",
          ],
        },
        {
          kind: "p",
          text: "KEDA and the VPA can share one workload if they read different signals. The VPA project says not to use the VPA with the HPA on the same resource metric, CPU or memory.",
        },
        {
          kind: "p",
          text: "It allows an HPA on custom and external metrics, or on a separate resource metric. A ScaledObject is an HPA underneath, so the rule carries over to KEDA:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "An event trigger with a VPA on CPU and memory works." },
              " KEDA sets the count from the work waiting in a queue, a stream or a Prometheus query. The VPA sets each pod’s size from its use.",
            ],
            [
              { b: "A cpu trigger and a VPA on CPU feed each other." },
              " Each new request changes the utilization the trigger reads.",
            ],
            [
              { b: "A cpu trigger with a VPA limited to memory works." },
              " It’s the separate-metric case the VPA project allows, set in the VPA’s resource policy with ",
              { code: 'controlledResources: ["memory"]' },
              ".",
            ],
          ],
        },
        {
          kind: "h3",
          id: "when-a-cpu-trigger-and-the-vpa",
          title: "When a cpu trigger and the VPA feed each other",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "Say 4\u00a0pods each use 600m of CPU against a 1\u00a0CPU request (1,000m). That’s right at a 60% target, and the workload uses 4 × 600m = 2,400m in all.",
        },
        {
          kind: "ol",
          items: [
            "The VPA sets the request to 750m. The same 600m now reads 600 ÷ 750 = 80%.",
            "The HPA asks for 4 × 80 ÷ 60 = 5.33\u00a0pods, rounded up to 6.",
            "Six pods share the same 2,400m at 400m each, and the VPA shrinks the request again.",
          ],
        },
        {
          kind: "p",
          text: "Nothing about the work changed, yet 4\u00a0pods became 6. The count tracked the request.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: [
            { a: "HPA vs VPA", href: "/learn/vpa-vs-hpa" },
            " walks through the same loop with a plain HPA, and the order that avoids it.",
          ],
        },
        { kind: "h3", id: "vpa-update-modes", title: "VPA update modes" },
        {
          kind: "p",
          text: [
            "The VPA’s ",
            { code: "updateMode" },
            " field sets how far it acts on its targets:",
          ],
        },
        {
          kind: "ul",
          items: [
            [{ code: "Off" }, " only recommends."],
            [{ code: "Initial" }, " sizes pods only at creation."],
            [{ code: "Recreate" }, " evicts pods so they come back at the new size."],
            [
              { code: "InPlaceOrRecreate" },
              " resizes in place where it can, and evicts where it can’t.",
            ],
            [
              { code: "InPlace" },
              " never evicts, but it’s alpha since VPA 1.7.0 and sits behind a feature gate.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            { code: "Auto" },
            " has been deprecated since VPA 1.4.0. ",
            { a: "In-place pod resize", href: "/learn/in-place-pod-resize" },
            " explains the Kubernetes feature behind the in-place modes.",
          ],
        },
      ],
    },
    {
      id: "how-to-choose-between-keda-the-hpa",
      title: "How to choose between KEDA, the HPA and the VPA",
      blocks: [
        { kind: "p", text: "Match each workload to its signal:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Load shows up as CPU per pod, and the service must always run." },
              " Use a plain HPA on CPU, once the requests match real use. ",
              { a: "Kubernetes pod right sizing", href: "/learn/kubernetes-pod-right-sizing" },
              " shows how to get them there.",
            ],
            [
              { b: "Work waits in a queue or a stream." },
              " Use a KEDA ScaledObject on that source, with ",
              { code: "minReplicaCount: 0" },
              " if a cold start on the first event is acceptable.",
            ],
            [
              { b: "Each event is a batch task." },
              " Use a KEDA ScaledJob, which runs the work as Kubernetes Jobs instead of a long-running Deployment.",
            ],
            [
              { b: "Requests sit far from use." },
              " Run the VPA in ",
              { code: "Off" },
              " mode and read its targets first. Then let it apply them only on resources that no HPA or KEDA trigger scales on.",
            ],
            [
              { b: "Pods don’t fit, or nodes sit empty." },
              " None of the three helps. That’s the node autoscaler’s layer, and ",
              { a: "KEDA vs Karpenter", href: "/learn/keda-vs-karpenter" },
              " shows where the two meet.",
            ],
          ],
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
            "KEDA and the HPA take each pod’s request as given, and the VPA is the one tool here that moves it. ",
            { a: "Coral optimizes Kubernetes", href: "/coral" },
            " on AKS and EKS at that layer.",
          ],
        },
        {
          kind: "p",
          text: [
            "Coral rebalances each container’s CPU and memory requests to what it really uses. It also drains spare nodes one at a time, so your autoscaler can remove them. For the order of the two steps, see the ",
            { a: "Kubernetes cost optimization guide", href: "/kubernetes-cost-optimization" },
            ": requests first, then nodes.",
          ],
        },
        {
          kind: "p",
          text: "On a workload that KEDA scales, KEDA keeps the scaling. Coral never takes over or converts the HPA that KEDA created. Its request sizing never changes that HPA’s minimum or maximum.",
        },
        {
          kind: "p",
          text: "For a ScaledObject with a cpu trigger, Coral picks the CPU request by replaying past load through:",
        },
        {
          kind: "ul",
          items: [
            "the trigger’s utilization target",
            "the ScaledObject’s minimum and maximum replicas",
            "the scaling behavior of the HPA that KEDA created",
          ],
        },
        {
          kind: "p",
          text: "A smaller request wins only if its saving beats the cost of unserved load and extra scaling. So in the cpu-trigger loop above, the request is sized with the HPA’s response in view, not from per-pod use alone. Event triggers aren’t part of the replay.",
        },
        {
          kind: "h3",
          id: "when-a-rebalance-moves-a-keda-scaled",
          title: "When a rebalance moves a KEDA-scaled pod",
        },
        {
          kind: "p",
          text: "When a rebalance drains a node, a KEDA-scaled Deployment that qualifies for warm handover gets a new copy first:",
        },
        {
          kind: "ol",
          items: [
            "Coral raises the ScaledObject’s minimum, so KEDA’s HPA adds a copy.",
            "It waits until the new pod is Ready and serving on another node, with no restarts.",
            "It evicts the old pod within its PodDisruptionBudget, then scales back.",
          ],
        },
        {
          kind: "p",
          text: "Pods that don’t qualify are evicted within their PodDisruptionBudgets, so a single-replica app gets a short restart.",
        },
        {
          kind: "p",
          text: [
            "With automation on, Coral switches an active VPA to Off. It restores the VPA when you switch automation off. ",
            { a: "HPAs and VPAs", href: "/coral-guide#hpas-and-vpas" },
            " in the product guide lists what Coral does with each, and ",
            { a: "Coral works with KEDA", href: "/coral-works-with-keda" },
            " splits the work between the two.",
          ],
        },
      ],
    },
  ],
  help: {
    product: "coral",
    text: "Coral rebalances CPU and memory requests on AKS and EKS, works with your HPA, and drains spare nodes so your autoscaler can remove them. We estimate it takes 40–50% off AKS and EKS cost. It is an estimated range, not a promise. The free assessment works out your own figure.",
    links: [
      { label: "Kubernetes optimization with Coral", href: "/coral" },
      { label: "Estimate your saving", href: "/assessment?p=coral" },
    ],
  },
  sources: [
    {
      publisher: "KEDA",
      title: "“CPU”",
      url: "https://keda.sh/docs/2.21/scalers/cpu/",
      note: " scaler",
    },
    {
      publisher: "KEDA",
      title: "“Scaling Deployments, StatefulSets & Custom Resources”",
      url: "https://keda.sh/docs/2.21/concepts/scaling-deployments/",
    },
    {
      publisher: "KEDA",
      title: "“ScaledObject specification”",
      url: "https://keda.sh/docs/2.21/reference/scaledobject-spec/",
    },
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
      publisher: "Vertical Pod Autoscaler",
      title: "“Known limitations”",
      url: "https://github.com/kubernetes/autoscaler/blob/master/vertical-pod-autoscaler/docs/known-limitations.md",
    },
    {
      publisher: "Microsoft Learn",
      title:
        "“Simplified application autoscaling with Kubernetes Event-driven Autoscaling (KEDA) add-on in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/keda-about",
    },
    {
      publisher: "Amazon EKS",
      title: "“Autoscale AI inference with HPA and KEDA”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/ml-inference-autoscaling-hpa-keda.html",
    },
  ],
  related: [
    {
      title: "What is KEDA in Kubernetes? Event-driven scaling explained",
      where: "Learn",
      href: "/learn/what-is-keda",
    },
    {
      title: "KEDA vs Karpenter: pods, nodes and the requests in between",
      where: "Learn",
      href: "/learn/keda-vs-karpenter",
    },
    {
      title: "VPA vs HPA: when to use which",
      where: "Learn",
      href: "/learn/vpa-vs-hpa",
    },
    {
      title: "Kubernetes autoscaling: HPA and Cluster Autoscaler",
      where: "Learn",
      href: "/learn/hpa-vs-vpa-vs-cluster-autoscaler",
    },
  ],
};
