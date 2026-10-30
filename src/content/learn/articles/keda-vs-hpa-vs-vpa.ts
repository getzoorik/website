import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/keda-vs-hpa-vs-vpa/1";

export const article: Article = {
  slug: "keda-vs-hpa-vs-vpa",
  title: "KEDA vs HPA vs VPA: where event-driven scaling fits",
  meta: "KEDA vs HPA vs VPA: KEDA scales pods on events through an HPA it creates, the HPA scales on CPU, and the VPA sizes requests. Which pairs work together.",
  h1: "KEDA vs HPA vs VPA: where event-driven scaling fits",
  deck: "KEDA and the HPA set how many pods run, and the VPA sets how big each one is. How they overlap, and what to combine.",
  card: "How KEDA drives an HPA, where the VPA fits, and which pairs are safe to run on one workload.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes autoscaling",
  versus: ["KEDA · HPA", "VPA"],
  published: "2026-11-12",
  updated: "2026-11-12",
  author: "shreya",
  short:
    "KEDA vs HPA vs VPA comes down to what each one changes. The Horizontal Pod Autoscaler (HPA) sets how many pods run, usually from CPU use measured against each pod’s request. KEDA (Kubernetes Event-driven Autoscaling) also sets the pod count, from events such as queue length, by creating and driving an HPA through a ScaledObject, and it can scale to zero. The Vertical Pod Autoscaler (VPA) sets how much CPU and memory each pod requests.",
  sections: [
    {
      id: "keda-vs-hpa-vs-vpa-what-each",
      title: "KEDA vs HPA vs VPA: what each one changes",
      blocks: [
        {
          kind: "p",
          text: [
            "Two of the three change how many pods run, and one changes how big each pod is. None of them adds or removes nodes. That’s the job of the Cluster Autoscaler, Karpenter and AKS node auto-provisioning (NAP), which ",
            {
              a: "HPA vs VPA vs Cluster Autoscaler",
              href: "/learn/hpa-vs-vpa-vs-cluster-autoscaler",
            },
            " compares.",
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
          text: "All three meet at the request: the CPU and memory a container asks the scheduler to reserve. The HPA measures CPU and memory utilization as a percentage of the request, and takes no action on a metric whose request isn’t set. KEDA’s cpu and memory triggers work the same way: KEDA reads the standard CPU and memory metrics from the Kubernetes Metrics Server, and the pods must set requests (or limits) for them. Only the VPA moves the request, which is why the pairs further down matter.",
        },
      ],
    },
    {
      id: "keda-vs-hpa-keda-drives-an-hpa",
      title: "KEDA vs HPA: KEDA drives an HPA",
      blocks: [
        {
          kind: "p",
          text: [
            "KEDA is a Cloud Native Computing Foundation (CNCF) graduated project, and 2.21 is its current release as of October 2026. It doesn’t replace the HPA. When you apply a ScaledObject, the keda-operator creates an HPA for the target workload, named ",
            { code: "keda-hpa-<scaledobject-name>" },
            " unless you set another name, and manages it from then on. The Amazon EKS user guide is explicit that you don’t create or edit that HPA yourself. For scalers and authentication, see ",
            { a: "what KEDA is and how it scales", href: "/learn/what-is-keda" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "Scaling then runs on two tracks. Between zero and one replica, the keda-operator acts alone: it checks each trigger every 30\u00a0seconds by default (",
            { code: "pollingInterval" },
            "), wakes the workload when a trigger turns active, and returns it to zero 300\u00a0seconds after the last active trigger (",
            { code: "cooldownPeriod" },
            "). Between one and N replicas, the HPA decides. It asks for the metric every 15\u00a0seconds by default, and KEDA’s metrics API server answers from the event source.",
          ],
        },
        { kind: "diagram", figure: figure1 },
        {
          kind: "p",
          text: "So KEDA autoscaling vs HPA autoscaling differs in the inputs. The math is shared: from one replica up, the replica count comes from the HPA’s formula either way. A plain HPA reads CPU and memory from the resource metrics API, usually served by Metrics Server, an add-on that has to be launched separately. For queue depth or any other outside signal, it needs an adapter for the external metrics API. KEDA is that adapter, with scalers for Apache Kafka, RabbitMQ, Amazon SQS, Azure Service Bus, Prometheus, cron schedules and more.",
        },
        {
          kind: "p",
          text: [
            "Kubernetes 1.37 closes part of the gap. Its ",
            { code: "HPAScaleToZero" },
            " feature gate is now beta and on by default, so an HPA on object or external metrics can set ",
            { code: "minReplicas: 0" },
            ". CPU and memory still can’t reach zero, because they’re only measured on running pods. The external metric also still needs an adapter, and only one server can provide external metrics in a cluster. Where KEDA runs, KEDA is that server.",
          ],
        },
      ],
    },
    {
      id: "keda-scaledobject-vs-hpa-one-owner-per",
      title: "KEDA ScaledObject vs HPA: one owner per workload",
      blocks: [
        {
          kind: "p",
          text: "A ScaledObject holds what an HPA holds (the target, the bounds, the scaling behavior) plus the event source. This one scales a worker Deployment on the number of waiting jobs, read from Prometheus:",
        },
        {
          kind: "code",
          lang: "yaml",
          code: 'apiVersion: keda.sh/v1alpha1\nkind: ScaledObject\nmetadata:\n  name: orders-worker\nspec:\n  scaleTargetRef:\n    name: orders-worker          # a Deployment in the same namespace\n  minReplicaCount: 0             # the default: idle means zero pods\n  maxReplicaCount: 20\n  pollingInterval: 30            # the default, in seconds\n  cooldownPeriod: 300            # the default, in seconds\n  triggers:\n    - type: prometheus\n      metricType: AverageValue   # the threshold is per pod\n      metadata:\n        serverAddress: http://<prometheus-host>:9090\n        query: <a query that returns the number of waiting jobs>\n        threshold: "50"',
        },
        {
          kind: "p",
          text: "With 400 jobs waiting, the HPA that KEDA creates asks for 8\u00a0pods (400 ÷ 50), up to the maximum of 20. Once nothing has waited for 300\u00a0seconds, KEDA takes the Deployment to zero.",
        },
        {
          kind: "p",
          text: [
            "The rule that matters most is one pod-count owner per workload. Microsoft’s AKS documentation recommends against a ScaledObject and an HPA on the same workload, because KEDA runs an HPA underneath and the two compete. The order you create them in decides whether the mistake is caught. If the HPA exists first, the ScaledObject fails to be created. If the ScaledObject exists first, a new HPA isn’t blocked, so check with ",
            { code: "kubectl get hpa" },
            " that each workload has exactly one.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              "To move a workload from its own HPA to KEDA, annotate the ScaledObject with ",
              { code: 'scaledobject.keda.sh/transfer-hpa-ownership: "true"' },
              " and set ",
              { code: "spec.advanced.horizontalPodAutoscalerConfig.name" },
              " to that HPA’s name.",
            ],
            "To scale on CPU and a queue together, put both triggers in one ScaledObject. The HPA works out a replica count for each metric and uses the highest.",
            "A cpu or memory trigger needs requests on the pods. It can’t take a workload to zero by itself either, since no running pods means no CPU to measure.",
          ],
        },
        { kind: "h3", id: "on-aks-the-keda-add-on", title: "On AKS: the KEDA add-on" },
        {
          kind: "p",
          text: "On AKS Standard, KEDA is a managed add-on you turn on with the Azure CLI or an ARM template, and AKS Automatic comes with KEDA preconfigured. The cluster’s Kubernetes version decides which KEDA version you get. You can’t change the CPU requests, limits or other Helm values of its operator or metrics server. KEDA must be the only external metrics server in the cluster, and a second KEDA installation isn’t supported.",
        },
        {
          kind: "p",
          text: "So on AKS, KEDA vs HPA is a choice you make per workload: KEDA for workloads driven by Kafka topics or Event Hubs, a plain HPA for CPU-bound services, and never both on one Deployment.",
        },
        {
          kind: "h3",
          id: "on-eks-install-keda-with-helm",
          title: "On EKS: install KEDA with Helm",
        },
        { kind: "p", text: "The EKS user guide installs KEDA with Helm, in its own namespace:" },
        {
          kind: "code",
          lang: "bash",
          code: "helm repo add kedacore https://kedacore.github.io/charts\nhelm repo update\nhelm install keda kedacore/keda --namespace keda --create-namespace",
        },
        {
          kind: "p",
          text: "Install Metrics Server too if the cluster lacks it, because KEDA’s cpu and memory triggers and the HPA’s CPU scaling read from it.",
        },
      ],
    },
    {
      id: "keda-vs-vpa-pod-count-and-pod",
      title: "KEDA vs VPA: pod count and pod size",
      blocks: [
        {
          kind: "p",
          text: "The VPA is an add-on from the Kubernetes autoscaler project. Its recommender reads each container’s use and out-of-memory events and stores a target recommendation with bounds around it. Its updater brings running pods to that target, and its admission webhook sizes new pods as they start.",
        },
        {
          kind: "p",
          text: [
            "The ",
            { code: "updateMode" },
            " field sets how far it goes. ",
            { code: "Off" },
            " only recommends, and ",
            { code: "Initial" },
            " sizes pods only at creation. ",
            { code: "Recreate" },
            " evicts pods so they come back at the new size, while ",
            { code: "InPlaceOrRecreate" },
            " resizes in place where it can and evicts where it can’t. ",
            { code: "InPlace" },
            ", alpha since VPA 1.7.0 and behind a feature gate, never evicts, and ",
            { code: "Auto" },
            " has been deprecated since VPA 1.4.0. The Kubernetes feature behind the in-place modes is explained in ",
            { a: "in-place pod resize", href: "/learn/in-place-pod-resize" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "KEDA and the VPA can run on one workload when they read different signals. The VPA project says not to use the VPA with the HPA on the same resource metric, CPU or memory. It allows an HPA on custom and external metrics, or on a separate resource metric. A ScaledObject is an HPA underneath, so the rule carries over to KEDA:",
        },
        {
          kind: "ul",
          items: [
            "A ScaledObject on a queue, a stream or a Prometheus query, with a VPA on CPU and memory, works, because KEDA sets the count from the work waiting and the VPA sets each pod’s size from its use.",
            "A ScaledObject with a cpu trigger and a VPA on CPU feed each other. Say 4\u00a0pods each use 600m of a 1\u00a0CPU request, right at a 60% target. The VPA sets the request to 750m, the same use now reads 80%, and the HPA asks for ceil(4 × 80 ÷ 60) = 6\u00a0pods. Six pods share the load at 400m each, the VPA shrinks the request again, and the pod count tracks the request rather than the load.",
            [
              "A cpu trigger with a VPA limited to memory, through ",
              { code: 'controlledResources: ["memory"]' },
              " in its resource policy, is the separate-metric case the VPA project allows.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "The same loop with a plain HPA, and the order that avoids it, is walked through in ",
            { a: "why to rebalance first", href: "/learn/vpa-vs-hpa" },
            ".",
          ],
        },
      ],
    },
    {
      id: "how-to-choose-between-keda-the-hpa",
      title: "How to choose between KEDA, the HPA and the VPA",
      blocks: [
        { kind: "p", text: "Match each workload to the signal that should drive it." },
        {
          kind: "ul",
          items: [
            [
              "If load shows up as CPU per pod and the service must always run, use a plain HPA on CPU, once the requests match real use. ",
              { a: "Pod right sizing", href: "/learn/kubernetes-pod-right-sizing" },
              " shows how to get them there.",
            ],
            [
              "If work waits in a queue or a stream, use a KEDA ScaledObject on that source, with ",
              { code: "minReplicaCount: 0" },
              " if a cold start on the first event is acceptable.",
            ],
            "If each event is a batch task, use a KEDA ScaledJob, which runs the work as Kubernetes Jobs instead of a long-running Deployment.",
            [
              "If requests sit far from use, run the VPA in ",
              { code: "Off" },
              " mode and read its targets first. Let it apply them only on resources that no HPA or KEDA trigger scales on.",
            ],
            [
              "If pods don’t fit or nodes sit empty, none of the three helps. That’s the node autoscaler’s layer, and ",
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
          text: "KEDA and the HPA take each pod’s request as given, and the VPA is the one tool here that moves it. Coral optimizes Kubernetes on AKS and EKS at that layer. It rebalances each container’s CPU and memory requests to what it really uses, and drains spare nodes one at a time so your autoscaler can remove them.",
        },
        {
          kind: "p",
          text: "On a workload that KEDA scales, KEDA keeps the scaling. Coral never takes over or converts the HPA that KEDA created, and its request sizing never changes that HPA’s minimum or maximum. For a ScaledObject with a cpu trigger, Coral picks the CPU request by replaying past load through the trigger’s utilization target, the ScaledObject’s minimum and maximum replicas, and the scaling behavior of the HPA that KEDA created. A smaller request wins only if its saving beats the cost of unserved load and extra scaling. That’s the cpu-trigger case from the VPA section, sized with the HPA’s response in the model rather than from per-pod use alone. Event triggers aren’t part of the replay.",
        },
        {
          kind: "p",
          text: "When a rebalance drains a node, a KEDA-scaled Deployment that qualifies for warm handover gets a new copy first. Coral raises the autoscaler’s minimum, waits until the new pod has been Ready and serving on another node for 5\u00a0minutes with no restarts, evicts the old pod within its PodDisruptionBudget, and then scales back. Pods that don’t qualify are evicted within their PodDisruptionBudgets, so a single-replica app gets a short restart.",
        },
        {
          kind: "p",
          text: [
            "Coral doesn’t run the VPA either: with automation on, it switches an active VPA to Off, and restores it when you switch automation off. ",
            { a: "HPAs and VPAs", href: "/coral/guide#hpas-and-vpas" },
            " in the product guide lists what it does with each, and the product page covers the rest of ",
            { a: "Kubernetes cost optimization with Coral", href: "/coral" },
            ".",
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
      title: "VPA vs HPA: when to use which, and why to rebalance first",
      where: "Learn",
      href: "/learn/vpa-vs-hpa",
    },
    {
      title: "HPA vs VPA vs Cluster Autoscaler: what each one scales",
      where: "Learn",
      href: "/learn/hpa-vs-vpa-vs-cluster-autoscaler",
    },
    { title: "HPAs and VPAs", where: "Coral product guide", href: "/coral/guide#hpas-and-vpas" },
  ],
};
