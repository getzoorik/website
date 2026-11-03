import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/keda-vs-karpenter/1";
import { figure as figure2 } from "@/features/learn/figures/keda-vs-karpenter/2";

export const article: Article = {
  slug: "keda-vs-karpenter",
  title: "KEDA vs Karpenter: when to use each or both",
  meta: "KEDA vs Karpenter: KEDA sets how many pods run from events, and Karpenter adds and removes nodes to fit them. When to use each, and how to run both.",
  h1: "KEDA vs Karpenter",
  deck: "KEDA scales pods, Karpenter scales nodes, and neither sets the CPU and memory each pod requests.",
  card: "KEDA sets the pod count, Karpenter sets the nodes, and neither changes what each pod requests.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes autoscaling",
  versus: ["KEDA", "Karpenter"],
  published: "2026-10-24",
  updated: "2026-11-03",
  author: "aditya",
  cover: "/learn-covers/zoorik-learn-keda-vs-karpenter-1200x630.webp",
  coverAlt:
    "KEDA vs Karpenter: KEDA sets how many pods, Karpenter sets which nodes, and requests are changed by neither",
  short:
    "KEDA (Kubernetes Event-driven Autoscaling) sets how many pods run, from events such as a queue’s length, and can scale them to zero. Karpenter adds and removes nodes to fit those pods. Use KEDA when work waits for pods, and Karpenter when pods wait for nodes. Run both to take an idle workload, and its nodes, to zero.",
  sections: [
    {
      id: "when-to-use-keda-vs-karpenter",
      title: "When to use each",
      blocks: [
        {
          kind: "p",
          text: "Take a queue worker on EKS or AKS. Overnight its queue is empty, so KEDA has scaled it to zero and Karpenter has removed its node. When the morning backlog arrives, KEDA adds replicas. They fit on no node, so they wait as pending pods until Karpenter adds nodes.",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "KEDA alone" },
              " suits a workload that should follow events or idle at zero, on nodes with room to spare.",
            ],
            [
              { b: "Karpenter alone" },
              " suits pods whose count you or an HPA set, when they wait for nodes.",
            ],
            [{ b: "Both" }, " suit a workload that scales on events, with nodes that follow it."],
          ],
        },
        {
          kind: "p",
          text: [
            "Other node autoscalers can play Karpenter’s part: node auto provisioning (NAP) on AKS, ",
            { a: "EKS Auto Mode", href: "/learn/glossary/eks-auto-mode" },
            " or the Cluster Autoscaler.",
          ],
        },
        {
          kind: "p",
          text: "A third layer sits between pod count and node count: each pod’s CPU and memory request, what a container asks the scheduler to reserve. Neither tool sets it.",
        },
        {
          kind: "table",
          columns: [
            { label: "", width: "14%" },
            { label: "KEDA", width: "50%" },
            { label: "Karpenter", width: "36%" },
          ],
          rows: [
            [
              "What it changes",
              [
                "The replica count of a Deployment, StatefulSet or custom resource with a ",
                { code: "/scale" },
                " subresource, or how many Jobs run",
              ],
              "The nodes, and the instance type or VM size of each",
            ],
            [
              "What it reads",
              "Event sources, such as a Kafka topic or an Azure event hub, plus CPU or memory",
              "The requests, node selectors, affinities and tolerations of pods the scheduler can’t place",
            ],
            [
              "Objects you write",
              [{ code: "ScaledObject" }, ", or ", { code: "ScaledJob" }, " for Jobs"],
              [
                { code: "NodePool" },
                ", plus ",
                { code: "EC2NodeClass" },
                " on AWS or ",
                { code: "AKSNodeClass" },
                " on AKS",
              ],
            ],
            [
              "Scale to zero",
              "Yes, with at least one trigger other than CPU or memory",
              "Deletes empty nodes",
            ],
            [
              "Giving capacity back",
              [
                "Its ",
                { a: "HPA", href: "/learn/glossary/horizontal-pod-autoscaler" },
                " scales pods in. KEDA goes from 1 to 0 after ",
                { code: "cooldownPeriod" },
                " (300\u00a0seconds by default)",
              ],
              "Consolidation deletes or replaces nodes whose pods fit elsewhere",
            ],
            [
              "Cap",
              [{ code: "maxReplicaCount" }, ", 100 by default"],
              [{ code: "spec.limits" }, " on each NodePool"],
            ],
            [
              "Managed option",
              "The KEDA add-on on AKS, preconfigured on AKS Automatic",
              "NAP on AKS, and EKS Auto Mode on EKS",
            ],
            [
              "Changes pod requests",
              "No. A ScaledObject has no field for them",
              "No. It reads them to size nodes",
            ],
          ],
        },
        {
          kind: "p",
          text: "The defaults on this page are those of KEDA 2.21 and Karpenter 1.15.",
        },
      ],
    },
    {
      id: "what-are-keda-and-karpenter",
      title: "How each works",
      blocks: [
        {
          kind: "h3",
          id: "how-keda-scales-pods",
          title: "KEDA",
        },
        {
          kind: "p",
          text: [
            "You link a workload to its event source with a ScaledObject. KEDA then creates a Horizontal Pod Autoscaler (HPA) for it, named ",
            { code: "keda-hpa-<scaled-object-name>" },
            " by default. The HPA is the Kubernetes controller that sets a replica count from a metric.",
          ],
        },
        {
          kind: "p",
          text: [
            "To wake a workload from zero, KEDA checks each trigger every 30\u00a0seconds (",
            { code: "pollingInterval" },
            "). From 1\u00a0replica up, its HPA does the scaling. By default the workload runs between 0 and 100\u00a0replicas (",
            { code: "minReplicaCount" },
            " and ",
            { code: "maxReplicaCount" },
            ").",
          ],
        },
        {
          kind: "p",
          text: [
            { code: "cooldownPeriod" },
            " applies only on the way to zero. KEDA waits 300\u00a0seconds after the last trigger reported active, then scales the workload to 0.",
          ],
        },
        {
          kind: "p",
          text: [
            "Microsoft’s AKS docs advise against pointing your own HPA and a ScaledObject at the same workload, because the two compete. ",
            { a: "KEDA vs HPA", href: "/learn/keda-vs-hpa-vs-vpa" },
            " compares them.",
          ],
        },
        {
          kind: "callout",
          label: "For engineers",
          text: [
            "KEDA has two main parts. Its operator scales a workload between 0 and N replicas. Its metrics server exposes event data to the HPA as external metrics. Because of an upstream limit, KEDA must be the only external metrics adapter in the cluster. ",
            { a: "KEDA in Kubernetes", href: "/learn/what-is-keda" },
            " covers each part and the scalers.",
          ],
        },
        {
          kind: "h3",
          id: "how-karpenter-scales-nodes",
          title: "Karpenter",
        },
        {
          kind: "p",
          text: "Karpenter watches for pods the scheduler can’t place for lack of resources. It reads their scheduling requirements, launches nodes that meet them, and later removes nodes no longer needed. AWS’s EKS best practices guide says Karpenter “considers a pod’s requests to determine which type of instance it provisions.”",
        },
        {
          kind: "p",
          text: [
            "Without limits or instance-type constraints, Karpenter keeps adding capacity while pods need it. You set its bounds in a NodePool: instance types, zones, taints, labels and ",
            { code: "spec.limits" },
            ", the most CPU and memory the pool may launch. ",
            { a: "How Karpenter works", href: "/learn/what-is-karpenter" },
            " covers these objects.",
          ],
        },
        {
          kind: "p",
          text: "Karpenter gives capacity back by consolidating, under one of three policies:",
        },
        {
          kind: "ul",
          items: [
            [
              { code: "WhenEmptyOrUnderutilized" },
              ", the default, removes or replaces any node where that reduces cost.",
            ],
            [{ code: "Balanced" }, " skips actions where the disruption isn’t worth the saving."],
            [{ code: "WhenEmpty" }, " removes only empty nodes."],
          ],
        },
        {
          kind: "p",
          text: [
            "Karpenter deletes a node when its pods fit on free capacity elsewhere. It replaces a node when they fit there plus one cheaper node. ",
            { code: "consolidateAfter" },
            ", 0\u00a0seconds by default, is how long Karpenter waits for new pods to land on a node before it considers the node.",
          ],
        },
        {
          kind: "p",
          text: [
            "With no budgets set, a default budget of 10% of nodes caps how many of a NodePool’s nodes consolidation disrupts at once. Pods leave through the Eviction API, so ",
            { a: "PodDisruptionBudgets (PDBs)", href: "/learn/glossary/pod-disruption-budget" },
            " hold. A pod annotated ",
            { code: 'karpenter.sh/do-not-disrupt: "true"' },
            " keeps its node out of consolidation. ",
            { a: "Karpenter consolidation", href: "/learn/karpenter-consolidation" },
            " covers each setting.",
          ],
        },
        {
          kind: "p",
          text: [
            "On AKS, ",
            { a: "NAP", href: "/learn/aks-node-auto-provisioning" },
            " runs Karpenter for you, and AKS Automatic comes with both KEDA and NAP preconfigured. On EKS, you install Karpenter with Helm and manage it yourself, or use EKS Auto Mode, which builds on Karpenter.",
          ],
        },
      ],
    },
    {
      id: "keda-and-karpenter-together",
      title: "How they work together",
      blocks: [
        {
          kind: "p",
          text: "Nothing connects the two directly. They meet only through the pods KEDA adds and removes:",
        },
        {
          kind: "ol",
          items: [
            "Events arrive. KEDA raises the replica count, and new pods that fit nowhere wait Pending.",
            "Karpenter launches nodes that fit the pending pods’ requests.",
            "The backlog clears. KEDA’s HPA scales the pods in, and KEDA takes the workload to zero after its cooldown period.",
            "Karpenter consolidates nodes left empty, or whose pods now fit elsewhere.",
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            "Scaling to zero gives the first message a cold start. It waits for KEDA’s next check (up to 30\u00a0seconds), a new node and the pod’s start. If it can’t wait, set ",
            { code: "minReplicaCount" },
            " to 1. That keeps one replica, and the node under it, running all night.",
          ],
        },
      ],
    },
    {
      id: "pod-requests",
      title: "Requests size the nodes",
      blocks: [
        {
          kind: "p",
          text: "Both tools depend on each pod’s request. The Kubernetes docs say node autoscalers make sure new nodes “have enough resources to satisfy the requests”, but don’t take real usage into account. Consolidation, too, “only considers Pod resource requests and not real resource usage when making decisions.” KEDA’s replica count then multiplies each request.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "The queue worker requests 1\u00a0CPU and uses 0.25\u00a0CPU. At 40\u00a0replicas, Karpenter provisions nodes for 40 × 1 = 40\u00a0CPU of requests to run 40 × 0.25 = 10\u00a0CPU of work. The other 30\u00a0CPU, three-quarters of the reservation, sits idle. Yet a node packed with these pods looks full to the scheduler.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: "The Kubernetes docs warn that a request set too high “might incorrectly prevent consolidating its Node.” AWS asks for accurate requests on all workloads, and calls that “particularly important if using Karpenter’s consolidation feature.”",
        },
        { kind: "p", text: "What a smaller request does depends on the trigger:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Event trigger: more pods fit on each node." },
              " A trigger such as a message count targets a value (",
              { code: "AverageValue" },
              " or ",
              { code: "Value" },
              "), so the replica count follows the events.",
            ],
            [
              { b: "CPU or memory trigger on utilization: more replicas." },
              " Under ",
              { code: "metricType: Utilization" },
              ", the target is a percentage of the pods’ requests, so the same load reads as higher utilization. This scaler needs a request or a limit on the pods.",
            ],
          ],
        },
      ],
    },
    {
      id: "keda-and-karpenter-setup",
      title: "How to run both",
      blocks: [
        {
          kind: "ol",
          items: [
            [
              { b: "Set requests from measured use first." },
              " Karpenter sizes nodes from them, and a utilization trigger measures load against them. With such a trigger, change them in small steps and watch the replica count. ",
              { a: "Kubernetes pod right sizing", href: "/learn/kubernetes-pod-right-sizing" },
              " walks through the method.",
            ],
            [
              { b: "Set both caps." },
              " ",
              { code: "maxReplicaCount" },
              " bounds the pods KEDA asks for. A NodePool’s ",
              { code: "spec.limits" },
              " bounds what Karpenter launches for them.",
            ],
            [
              { b: "Give spiky workloads a consolidation wait." },
              " At 0\u00a0seconds, Karpenter can consolidate a node between two bursts that KEDA is about to fill again. The Karpenter docs say a longer ",
              { code: "consolidateAfter" },
              " gives churning workloads time to settle.",
            ],
            [
              { b: "Protect long jobs." },
              " A Job pod on a node that Karpenter consolidates is evicted mid-run. ",
              { a: "Annotate the Job’s pod template", href: "/learn/safe-to-evict-do-not-disrupt" },
              " with ",
              { code: 'karpenter.sh/do-not-disrupt: "true"' },
              ", or with a duration such as ",
              { code: '"30m"' },
              " to protect it for that long after it starts.",
            ],
          ],
        },
        {
          kind: "p",
          text: "With example values, the ScaledObject caps the worker at 40\u00a0replicas, at most 40 × 1 = 40\u00a0CPU of requests:",
        },
        { kind: "code", lang: "yaml", code: "spec:\n  minReplicaCount: 0\n  maxReplicaCount: 40" },
        {
          kind: "p",
          text: "The NodePool caps what Karpenter launches at 100\u00a0CPU, and sets a 5-minute consolidation wait:",
        },
        {
          kind: "code",
          lang: "yaml",
          code: "spec:\n  disruption:\n    consolidationPolicy: WhenEmptyOrUnderutilized\n    consolidateAfter: 5m\n  limits:\n    cpu: 100\n    memory: 400Gi",
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
            " is Kubernetes cost optimization for AKS and EKS, and it works on the third layer. It rebalances each container’s CPU and memory requests to real use, so the same Karpenter or NAP runs fewer or smaller nodes.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Requests." },
              " Each request is set from measured use, plus headroom. Pod sizing starts only when you switch on “Automatically optimize”. Running pods are resized in place on nodes at Kubernetes 1.33 or later, or else restarted one at a time within their PDBs.",
            ],
            [
              { b: "KEDA." },
              " For a ScaledObject with a ",
              { code: "cpu" },
              " trigger, Coral picks the CPU request by replaying past load. The replay uses the trigger’s target, the ScaledObject’s replica bounds and the scaling behavior of KEDA’s HPA. A smaller request wins only if its saving beats the cost of unserved load and extra scaling. Event triggers and paused ScaledObjects aren’t replayed.",
            ],
            [
              { b: "KEDA’s HPA." },
              " Coral never takes over or converts it, and creates an HPA only for a Deployment or Argo Rollout that has none. It changes the ScaledObject’s minimum only to move a pod in a rebalance. It raises the minimum so a new pod is Ready on another node before the old one is evicted, then puts it back.",
            ],
            [
              { b: "Karpenter and NAP." },
              " Coral never changes your existing Karpenter or NAP settings, and never adds nodes for demand. Pools they already consolidate are left to them. Coral also honors ",
              { code: "karpenter.sh/do-not-disrupt" },
              " on pods and nodes.",
            ],
            [
              { b: "Cheaper machines." },
              " With Karpenter or NAP in place, a rebalance can move work to smaller or cheaper machines. Coral creates fixed-size NodePools, and your Karpenter or NAP launches the machines.",
            ],
            [
              { b: "No node autoscaler." },
              " If the cluster has none, Coral sets up Karpenter on EKS, or NAP on AKS with Azure CNI (not kubenet), with your approval.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Coral works with KEDA", href: "/coral-works-with-keda" },
            " and ",
            { a: "Coral works with Karpenter", href: "/coral-works-with-karpenter" },
            " cover the setup.",
          ],
        },
        {
          kind: "p",
          text: [
            "On our own AKS development cluster, Coral removed a spare worker and swapped the remaining worker for a cheaper machine of the same size. The CPU the apps reserve went from 0.78 to 0.43\u00a0cores. Eight days after we connected Coral, ",
            { a: "the machine cost", href: "/coral-value-lab" },
            " was $154.76 a month instead of $368.65, 58% less.",
          ],
        },
      ],
    },
  ],
  help: {
    product: "coral",
    text: "Coral rebalances CPU and memory requests on AKS and EKS, works with KEDA and your HPA, and removes the nodes you don’t need, without any downtime. We estimate 40–50% off AKS and EKS cost. It is an estimated range, not a promise. The free assessment works out your own figure.",
    links: [
      { label: "Kubernetes optimization with Coral", href: "/coral" },
      { label: "Estimate your saving", href: "/assessment?p=coral" },
    ],
  },
  sources: [
    {
      publisher: "KEDA",
      title: "“ScaledObject specification”",
      url: "https://keda.sh/docs/2.21/reference/scaledobject-spec/",
    },
    { publisher: "KEDA", title: "“CPU”", url: "https://keda.sh/docs/2.21/scalers/cpu/" },
    {
      publisher: "Karpenter",
      title: "“Disruption”",
      url: "https://karpenter.sh/docs/concepts/disruption/",
    },
    {
      publisher: "Kubernetes",
      title: "“Node Autoscaling”",
      url: "https://kubernetes.io/docs/concepts/cluster-administration/node-autoscaling/",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Kubernetes Event-Driven Autoscaling (KEDA) in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/keda-about",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Overview of Node Auto-Provisioning (NAP) in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/node-auto-provisioning",
    },
    {
      publisher: "Amazon EKS Best Practices Guide",
      title: "“Karpenter”",
      url: "https://docs.aws.amazon.com/eks/latest/best-practices/karpenter.html",
    },
    {
      publisher: "Amazon EKS",
      title: "“Scale cluster compute with Karpenter and Cluster Autoscaler”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/autoscaling.html",
    },
  ],
  related: [
    {
      title: "KEDA vs HPA vs VPA",
      where: "Learn",
      href: "/learn/keda-vs-hpa-vs-vpa",
    },
    {
      title: "Karpenter consolidation",
      where: "Learn",
      href: "/learn/karpenter-consolidation",
    },
    {
      title: "Kubernetes requests vs limits",
      where: "Learn",
      href: "/learn/kubernetes-pod-right-sizing",
    },
    {
      title: "Do I need Coral with Karpenter or NAP?",
      where: "Coral FAQ",
      href: "/coral-faq#do-i-need-coral-with-karpenter",
    },
    {
      title: "HPAs and VPAs: what Coral does with each",
      where: "Coral product guide",
      href: "/coral-guide#hpas-and-vpas",
    },
  ],
};
