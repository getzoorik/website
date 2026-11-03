import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/keda-vs-hpa-vs-vpa/1";
import { figure as figure2 } from "@/features/learn/figures/keda-vs-hpa-vs-vpa/2";

export const article: Article = {
  slug: "keda-vs-hpa-vs-vpa",
  title: "KEDA vs HPA vs VPA",
  meta: "KEDA vs HPA vs VPA: how KEDA scales pods on events through an HPA, when the VPA can share a workload, and which autoscaler to run.",
  h1: "KEDA vs HPA vs VPA",
  deck: "Pick KEDA or the HPA per workload, never both, and let the VPA size only what they don’t scale on.",
  card: "How KEDA drives an HPA, where the VPA fits, and which pairs can share one workload.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes autoscaling",
  versus: ["KEDA · HPA", "VPA"],
  published: "2026-11-01",
  updated: "2026-11-03",
  author: "shreya",
  cover: "/learn-covers/zoorik-learn-keda-vs-hpa-vs-vpa-1200x630.webp",
  coverAlt:
    "KEDA vs HPA vs VPA: KEDA drives the HPA to add pods, while the VPA makes each pod bigger",
  short:
    "The Horizontal Pod Autoscaler (HPA) sets how many pods run, usually from CPU or memory. KEDA (Kubernetes Event-driven Autoscaling) sets that count from events, such as waiting jobs, and can scale to zero. It works through an HPA it creates, so it replaces a plain HPA rather than joining one. The Vertical Pod Autoscaler (VPA) sets each pod’s CPU and memory requests instead.",
  sections: [
    {
      id: "keda-vs-hpa-vs-vpa",
      title: "Key differences",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "KEDA", href: "/learn/what-is-keda" },
            " and the ",
            { a: "HPA", href: "/learn/glossary/horizontal-pod-autoscaler" },
            " decide how many pods run. The ",
            { a: "VPA", href: "/learn/glossary/vertical-pod-autoscaler" },
            " decides each pod’s ",
            { a: "request", href: "/learn/glossary/kubernetes-resource-requests" },
            ": the CPU and memory a container asks the scheduler to reserve.",
          ],
        },
        {
          kind: "p",
          text: [
            "None of the three adds or removes nodes. The Cluster Autoscaler, Karpenter and AKS node auto provisioning do that, as ",
            { a: "Kubernetes autoscaling", href: "/learn/kubernetes-autoscaling" },
            " explains.",
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
              "The pod count, through an HPA it creates",
              "The pod count",
              "Each container’s CPU and memory requests, and by default its limits in proportion",
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
              "Object you write",
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
          text: "All three meet at the request. The HPA reads CPU and memory as a percentage of each pod’s request. It takes no action on a metric whose request isn’t set.",
        },
        {
          kind: "p",
          text: "KEDA’s cpu and memory triggers work the same way: they read from Metrics Server, and the pods must set requests (or limits). Only the VPA changes the request, which is why some pairs clash.",
        },
      ],
    },
    {
      id: "keda-vs-hpa-keda-creates-an-hpa",
      title: "How KEDA uses the HPA",
      blocks: [
        {
          kind: "p",
          text: [
            "When you apply a ScaledObject, the KEDA operator creates an HPA for the target workload and manages it. It’s named ",
            { code: "keda-hpa-<scaledobject-name>" },
            " unless you set another name. The Amazon EKS user guide says not to create or edit it yourself.",
          ],
        },
        {
          kind: "h3",
          id: "two-tracks-zero-to-one-then-one",
          title: "Zero to one, one to N",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Zero to one: the KEDA operator." },
              " It checks each trigger every 30 seconds by default (",
              { code: "pollingInterval" },
              "). It starts the workload when a trigger turns active, and scales it back to zero 300 seconds after the last active trigger (",
              { code: "cooldownPeriod" },
              ").",
            ],
            [
              { b: "One to N: the HPA." },
              " It asks for the metric every 15 seconds by default, and KEDA’s metrics server answers from the event source.",
            ],
          ],
        },
        {
          kind: "p",
          text: "From one replica up, the HPA’s own formula sets the count, with KEDA or without it.",
        },
        {
          kind: "h3",
          id: "what-a-plain-hpa-needs-to-scale",
          title: "What a plain HPA needs",
        },
        {
          kind: "p",
          text: "A plain HPA reads CPU and memory from the resource metrics API. Metrics Server usually serves that API, and you install it separately.",
        },
        {
          kind: "p",
          text: "For queue depth or another outside signal, an HPA needs an adapter for the external metrics API. KEDA is that adapter, with built-in scalers for sources such as:",
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
        { kind: "h3", id: "scale-to-zero-on-a-plain-hpa", title: "Scale to zero without KEDA" },
        {
          kind: "p",
          text: [
            "Since Kubernetes 1.37, the ",
            { code: "HPAScaleToZero" },
            " feature gate is beta and on by default. An HPA with an object or external metric can then set ",
            { code: "minReplicas: 0" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "CPU and memory still can’t scale to zero, because they’re measured only on running pods. The external metric still needs an adapter, and a cluster can have only one external metrics server. Where KEDA runs, that server is KEDA.",
        },
      ],
    },
    {
      id: "keda-scaledobject-vs-hpa-one-owner-per",
      title: "ScaledObject vs HPA",
      blocks: [
        {
          kind: "p",
          text: "A ScaledObject holds what an HPA holds (the target, the bounds, the scaling behavior), plus the event source.",
        },
        {
          kind: "p",
          text: "Take an orders worker that pulls jobs from a queue. An HPA on CPU sees CPU, not the jobs waiting. This ScaledObject scales the worker on waiting jobs, read from Prometheus:",
        },
        {
          kind: "code",
          lang: "yaml",
          code: 'apiVersion: keda.sh/v1alpha1\nkind: ScaledObject\nmetadata:\n  name: orders-worker\nspec:\n  scaleTargetRef:\n    name: orders-worker          # a Deployment in the same namespace\n  minReplicaCount: 0             # the default: idle means zero pods\n  maxReplicaCount: 20\n  pollingInterval: 30            # the default, in seconds\n  cooldownPeriod: 300            # the default, in seconds\n  triggers:\n    - type: prometheus\n      metricType: AverageValue   # the threshold is per pod\n      metadata:\n        serverAddress: http://<prometheus-host>:9090\n        query: <a query that returns the number of waiting jobs>\n        threshold: "50"',
        },
        {
          kind: "p",
          text: "At 400 waiting jobs and 50 per pod, the HPA asks for 400 ÷ 50 = 8 pods, within the maximum of 20. When the queue has been empty for 300 seconds, KEDA scales the worker to zero.",
        },
        {
          kind: "p",
          text: [
            { b: "Give each workload one pod-count owner." },
            " Microsoft’s AKS docs recommend against a ScaledObject and an HPA on the same workload. KEDA runs an HPA underneath, so the two compete.",
          ],
        },
        {
          kind: "p",
          text: "To scale on CPU and a queue together, put both triggers in one ScaledObject. The HPA works out a replica count for each metric and uses the highest.",
        },
        {
          kind: "h3",
          id: "find-a-second-hpa-with-kubectl-get",
          title: "Find a second HPA",
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "If the HPA exists first, the ScaledObject fails to be created. If the ScaledObject exists first, a new HPA isn’t blocked.",
        },
        { kind: "code", lang: "bash", code: "kubectl get hpa -n <namespace>" },
        {
          kind: "p",
          text: [
            "KEDA’s HPA shows as ",
            { code: "keda-hpa-<scaledobject-name>" },
            ". A workload named in two rows has two owners. Delete your own HPA to leave KEDA in charge, or remove the ScaledObject to keep the plain HPA.",
          ],
        },
        {
          kind: "p",
          text: [
            "Where your HPA came first, hand it over to KEDA: annotate the ScaledObject with ",
            { code: 'scaledobject.keda.sh/transfer-hpa-ownership: "true"' },
            " and set ",
            { code: "spec.advanced.horizontalPodAutoscalerConfig.name" },
            " to that HPA’s name.",
          ],
        },
        { kind: "h3", id: "on-aks-the-keda-add-on", title: "KEDA on AKS" },
        {
          kind: "p",
          text: "AKS Automatic comes with KEDA preconfigured. On AKS Standard, turn on the managed KEDA add-on with the Azure CLI or an ARM template. The add-on has three limits:",
        },
        {
          kind: "ul",
          items: [
            "Your cluster’s Kubernetes version sets the KEDA version.",
            "You can’t change the CPU requests, limits or other Helm values of its operator or metrics server.",
            "KEDA must be the cluster’s only external metrics server, and a second KEDA installation isn’t supported.",
          ],
        },
        {
          kind: "h3",
          id: "on-eks-install-keda-with-helm",
          title: "KEDA on EKS",
        },
        { kind: "p", text: "The Amazon EKS user guide installs KEDA with Helm:" },
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
          kind: "p",
          text: "If the cluster lacks Metrics Server, install it too for CPU and memory scaling.",
        },
      ],
    },
    {
      id: "keda-vs-vpa-they-work-together-when",
      title: "KEDA and the VPA",
      blocks: [
        {
          kind: "p",
          text: "KEDA and the VPA can share one workload when they read different signals. The VPA has three parts:",
        },
        {
          kind: "ul",
          items: [
            "A recommender reads each container’s use and out-of-memory events, and stores a target with bounds.",
            "An updater brings running pods to that target.",
            "An admission webhook sizes new pods as they start.",
          ],
        },
        {
          kind: "p",
          text: "The VPA project says not to run the VPA and the HPA on the same resource metric, CPU or memory. It allows an HPA on custom or external metrics, or on a different resource.",
        },
        {
          kind: "p",
          text: "A ScaledObject is an HPA underneath, so the rule carries over to KEDA:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "An event trigger with a VPA on CPU and memory works." },
              " KEDA sets the count from the waiting work, and the VPA sets each pod’s size from its use.",
            ],
            [
              { b: "A cpu trigger and a VPA on CPU feed each other." },
              " Each new request changes the utilization the trigger reads.",
            ],
            [
              { b: "A cpu trigger with a VPA limited to memory works." },
              " Set it in the VPA’s resource policy with ",
              { code: 'controlledResources: ["memory"]' },
              ".",
            ],
          ],
        },
        {
          kind: "h3",
          id: "when-a-cpu-trigger-and-the-vpa",
          title: "The CPU feedback loop",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "Say 4 pods each use 600m of CPU against a 1 CPU request (1,000m). That’s right at a 60% target, and the workload uses 4 × 600m = 2,400m in all.",
        },
        {
          kind: "ol",
          items: [
            "The VPA sets the request to 750m. The same 600m now reads 600 ÷ 750 = 80%.",
            "The HPA asks for 4 × 80 ÷ 60 = 5.33 pods, rounded up to 6.",
            "Six pods share the same 2,400m at 400m each, and the VPA shrinks the request again.",
          ],
        },
        {
          kind: "p",
          text: "The work didn’t change, yet 4 pods became 6. The count followed the request.",
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
            "The mode, set in ",
            { code: "updateMode" },
            ", decides how far the VPA acts on its targets:",
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
              " never evicts. It’s alpha since VPA 1.7.0 and sits behind a feature gate.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            { code: "Auto" },
            " has been deprecated since VPA 1.4.0 and now acts as ",
            { code: "Recreate" },
            ". ",
            { a: "In-place pod resize", href: "/learn/in-place-pod-resize" },
            " explains the Kubernetes feature behind the in-place modes.",
          ],
        },
      ],
    },
    {
      id: "how-to-choose-between-keda-the-hpa",
      title: "Which to use",
      blocks: [
        { kind: "p", text: "Match each workload to its signal:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Load shows as CPU, and the service must always run." },
              " Use a plain HPA on CPU, once requests match real use. ",
              { a: "Kubernetes pod right sizing", href: "/learn/kubernetes-pod-right-sizing" },
              " shows how.",
            ],
            [
              { b: "Work waits in a queue or a stream." },
              " Use a KEDA ScaledObject on that source. It scales to zero by default, so set ",
              { code: "minReplicaCount: 1" },
              " if a cold start on the first event isn’t acceptable.",
            ],
            [
              { b: "Each event is a batch task." },
              " Use a KEDA ScaledJob, which runs the work as Kubernetes Jobs instead of a long-running Deployment.",
            ],
            [
              { b: "Requests sit far from use." },
              " Run the VPA in ",
              { code: "Off" },
              " mode and read its targets first. Then let it apply them only on resources no HPA or KEDA trigger scales on.",
            ],
            [
              { b: "Pods don’t fit, or nodes sit empty." },
              " None of the three helps. That’s the node autoscaler’s job, and ",
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
            "KEDA and the HPA take each pod’s request as given. ",
            { a: "Coral", href: "/coral" },
            " rebalances those requests to real use on AKS and EKS, then the nodes: the two steps of ",
            { a: "Kubernetes cost optimization", href: "/kubernetes-cost-optimization" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "On a workload KEDA scales, KEDA keeps the pod count. Coral never takes over or converts the HPA that KEDA creates. Its request sizing never changes that HPA’s minimum or maximum.",
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
          text: "A smaller request wins only if its saving beats the cost of unserved load and extra scaling. So in the feedback loop above, the request is sized with the HPA’s response in view, not from per-pod use alone. Event triggers and paused ScaledObjects aren’t replayed.",
        },
        {
          kind: "p",
          text: [
            "With automation on, Coral switches an active VPA to Off, and restores it when you switch automation off. The guide’s ",
            { a: "HPAs and VPAs", href: "/coral-guide#hpas-and-vpas" },
            " section lists what Coral does with each. ",
            { a: "Coral works with KEDA", href: "/coral-works-with-keda" },
            " shows how the work splits.",
          ],
        },
        {
          kind: "h3",
          id: "when-a-rebalance-moves-a-keda-scaled",
          title: "KEDA pods in a rebalance",
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
            "It evicts the old pod within its PodDisruptionBudget, then puts your minimum back.",
          ],
        },
        {
          kind: "p",
          text: "Other pods move by live migration where both nodes support it. The rest are evicted within their PodDisruptionBudgets.",
        },
      ],
    },
  ],
  help: {
    product: "coral",
    text: "Coral rebalances CPU and memory requests on AKS and EKS, works with KEDA and your HPA, and removes nodes you don’t need, without any downtime. We estimate it reduces AKS and EKS cost by 40–50%, a range rather than a promise. The free assessment works out your own figure.",
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
      title: "What is KEDA in Kubernetes?",
      where: "Learn",
      href: "/learn/what-is-keda",
    },
    {
      title: "KEDA vs Karpenter",
      where: "Learn",
      href: "/learn/keda-vs-karpenter",
    },
    {
      title: "HPA vs VPA in Kubernetes",
      where: "Learn",
      href: "/learn/vpa-vs-hpa",
    },
    {
      title: "Kubernetes autoscaling",
      where: "Learn",
      href: "/learn/kubernetes-autoscaling",
    },
  ],
};
