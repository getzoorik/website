import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/keda-vs-karpenter/1";
import { figure as figure2 } from "@/features/learn/figures/keda-vs-karpenter/2";

export const article: Article = {
  slug: "keda-vs-karpenter",
  title: "KEDA vs Karpenter: pods, nodes and pod requests",
  meta: "KEDA vs Karpenter: KEDA sets how many pods run from events, Karpenter picks the nodes from pod requests. When to use each, and the order to set them up.",
  h1: "KEDA vs Karpenter: pods, nodes and the requests in between",
  deck: "KEDA sets the pod count and Karpenter picks the nodes. When to use each, and the one number neither changes.",
  card: "KEDA sets how many pods run, Karpenter picks the nodes, and neither changes what each pod requests.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes autoscaling",
  versus: ["KEDA", "Karpenter"],
  published: "2026-10-24",
  updated: "2026-11-01",
  author: "aditya",
  cover: "/learn-covers/zoorik-learn-keda-vs-karpenter-1200x630.webp",
  coverAlt:
    "KEDA vs Karpenter: KEDA sets how many pods, Karpenter sets which nodes, and requests are changed by neither",
  short:
    "KEDA vs Karpenter is pod count against node count. KEDA (Kubernetes Event-driven Autoscaling) sets how many pods run from events, down to zero, and Karpenter adds and removes nodes to fit them. Use KEDA when work waits for pods, Karpenter when pods wait for nodes, and both for zero pods and zero nodes.",
  sections: [
    {
      id: "when-to-use-keda-vs-karpenter",
      title: "When to use KEDA vs Karpenter, and when to run both",
      blocks: [
        {
          kind: "p",
          text: "Picture a queue worker on EKS or AKS. Overnight its queue is empty, so KEDA has scaled the worker to zero and Karpenter has removed its node. When the morning backlog arrives, KEDA raises the replica count. The new pods don’t fit anywhere, so they wait as pending pods until Karpenter adds nodes for them.",
        },
        {
          kind: "p",
          text: "Neither tool changes the third layer, between pod count and node count: each pod’s CPU and memory request. A request is what a container asks the scheduler to reserve. If each worker requests 1\u00a0CPU and uses 0.25, Karpenter sizes the nodes for 1\u00a0CPU per pod, and three-quarters of that sits idle.",
        },
        { kind: "p", text: "Which you need depends on what waits:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Use KEDA when work waits for pods." },
              " It sets the pod count from the backlog, down to zero.",
            ],
            [
              { b: "Use a node autoscaler when pods wait for nodes." },
              " That can be Karpenter, NAP on AKS, ",
              { a: "EKS Auto Mode", href: "/learn/glossary/eks-auto-mode" },
              " or the Cluster Autoscaler.",
            ],
            [{ b: "Run both for zero pods and zero nodes overnight." }],
            [
              { b: "Rebalance requests when pods reserve more than they use." },
              " Neither tool does that for you.",
            ],
          ],
        },
        { kind: "p", text: "Here is Karpenter vs KEDA, point by point." },
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
                "The replica count of a Deployment, StatefulSet or any custom resource with a ",
                { code: "/scale" },
                " subresource, or how many Jobs run",
              ],
              "The nodes in the cluster, and the instance type or VM size of each",
            ],
            [
              "What it decides from",
              "Event sources, such as messages in a Kafka topic or events in an Azure event hub, and CPU or memory",
              "The resource requests, node selectors, affinities and tolerations of pods the scheduler can’t place",
            ],
            [
              "The objects you write",
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
              "Deletes nodes that are empty",
            ],
            [
              "How it gives capacity back",
              [
                "Its ",
                { a: "HPA", href: "/learn/glossary/horizontal-pod-autoscaler" },
                " scales pods in, and KEDA goes from 1 to 0 after ",
                { code: "cooldownPeriod" },
                " (300\u00a0seconds by default)",
              ],
              "Consolidation deletes or replaces nodes whose pods fit elsewhere",
            ],
            [
              "The cap you set",
              [{ code: "maxReplicaCount" }, ", 100 by default"],
              [{ code: "spec.limits" }, " on each NodePool"],
            ],
            [
              "Managed by the cloud",
              "The KEDA add-on on AKS, preconfigured on AKS Automatic",
              "Node auto-provisioning (NAP) on AKS, and EKS Auto Mode on EKS",
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
          text: "The versions here are KEDA 2.21 and Karpenter 1.15, the newest documented in October 2026. KEDA is a graduated Cloud Native Computing Foundation project, and Karpenter and the Cluster Autoscaler are the two node autoscalers that Kubernetes SIG Autoscaling sponsors.",
        },
      ],
    },
    {
      id: "what-are-keda-and-karpenter",
      title: "What are KEDA and Karpenter?",
      blocks: [
        {
          kind: "h3",
          id: "how-keda-scales-pods",
          title: "KEDA sets the pod count from events, through an HPA",
        },
        {
          kind: "p",
          text: [
            "You link a workload to its event source with a ScaledObject. KEDA then creates a Horizontal Pod Autoscaler (HPA), the Kubernetes controller that sets a workload’s replica count from a metric, and names it ",
            { code: "keda-hpa-<scaled-object-name>" },
            " by default.",
          ],
        },
        {
          kind: "p",
          text: [
            "Microsoft’s AKS docs advise against pointing your own HPA and a ScaledObject at the same workload: the two compete. ",
            { a: "KEDA vs HPA vs VPA", href: "/learn/keda-vs-hpa-vs-vpa" },
            " compares KEDA with the HPA on its own.",
          ],
        },
        {
          kind: "p",
          text: [
            "To wake a workload from zero, KEDA checks each trigger every 30\u00a0seconds (",
            { code: "pollingInterval" },
            "), and from 1\u00a0replica up, the HPA it created does the scaling. Unless you set them, the workload runs between 0 and 100\u00a0replicas (",
            { code: "minReplicaCount" },
            " and ",
            { code: "maxReplicaCount" },
            "). ",
            { code: "cooldownPeriod" },
            " applies only on the way to zero: KEDA waits 300\u00a0seconds after the last trigger reported active before scaling the workload back to 0.",
          ],
        },
        {
          kind: "callout",
          label: "For engineers",
          text: [
            "KEDA has two main parts. Its operator scales a workload in or out, from 0 to N replicas, and its metrics server exposes event data as external metrics for the HPA. Because of an upstream limit, KEDA must be the only external metrics adapter in the cluster. A ",
            { code: "cpu" },
            " trigger can take a workload to zero only when the ScaledObject also has a trigger that isn’t CPU or memory, and ",
            { code: "minReplicaCount" },
            " is 0. ",
            { a: "How KEDA works in Kubernetes", href: "/learn/what-is-keda" },
            " covers each part and the scalers.",
          ],
        },
        {
          kind: "h3",
          id: "how-karpenter-scales-nodes",
          title: "Karpenter sizes nodes from pod requests, then consolidates them",
        },
        {
          kind: "p",
          text: "Karpenter watches for pods the scheduler can’t place because of resource constraints. It reads their scheduling requirements, launches nodes that meet them, and later removes nodes that are no longer needed. AWS’s EKS best practices guide names the sizing input: Karpenter “considers a pod’s requests to determine which type of instance it provisions.”",
        },
        {
          kind: "p",
          text: [
            "Without limits or instance-type constraints, Karpenter keeps adding capacity as long as pods need it. You set its boundaries in a NodePool: the instance types and zones it may use, taints and labels, and ",
            { code: "spec.limits" },
            ", the most CPU and memory the pool may launch. ",
            { a: "How Karpenter works", href: "/learn/what-is-karpenter" },
            " covers these objects.",
          ],
        },
        {
          kind: "p",
          text: [
            "Karpenter gives capacity back by consolidating. Under the default policy, ",
            { code: "WhenEmptyOrUnderutilized" },
            ", it considers any node that can be removed or replaced to reduce cost. ",
            { code: "WhenEmpty" },
            " takes only empty nodes. ",
            { code: "Balanced" },
            " acts only where the saving outweighs the disruption to running pods.",
          ],
        },
        {
          kind: "p",
          text: [
            "Karpenter deletes a node when its pods fit on free capacity elsewhere, and replaces it when they fit there plus one cheaper node. ",
            { code: "consolidateAfter" },
            " is how long Karpenter waits after pods are added to or removed from a node before the node becomes a candidate. It’s 0\u00a0seconds by default.",
          ],
        },
        {
          kind: "p",
          text: [
            "Unless you set budgets, one default budget of 10% of nodes caps how many of a NodePool’s nodes consolidation can disrupt at once. Pods leave through the Eviction API, so ",
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
            "What differs between EKS and AKS is who runs Karpenter. On AKS, ",
            { a: "NAP", href: "/learn/aks-node-auto-provisioning" },
            " manages Karpenter for you, and AKS Automatic comes with both KEDA and NAP preconfigured. On EKS, you install self-managed Karpenter with Helm, and the EKS user guide makes configuring and managing it your job. EKS Auto Mode, which builds upon Karpenter, scales cluster compute for you.",
          ],
        },
      ],
    },
    {
      id: "keda-and-karpenter-together",
      title: "KEDA and Karpenter work together only through the pods",
      blocks: [
        {
          kind: "p",
          text: "Nothing connects the two directly: they meet through the pods KEDA adds and removes. When the backlog clears, KEDA’s HPA scales the pods in, and KEDA takes the workload to zero after its cooldown period. Karpenter then consolidates nodes left empty, or whose pods now fit elsewhere.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            "Scaling to zero gives the first message a cold start. In the opening’s case, it waits for KEDA’s next check (up to 30\u00a0seconds), a node to launch and the pod to start. If it can’t wait, set ",
            { code: "minReplicaCount" },
            " to 1. That keeps one replica, and the node under it, running all night.",
          ],
        },
      ],
    },
    {
      id: "pod-requests",
      title: "Pod requests size the nodes, and neither tool sets them",
      blocks: [
        {
          kind: "p",
          text: "Both tools depend on the request. The Kubernetes docs on node autoscaling say autoscalers make sure new nodes “have enough resources to satisfy the requests” but don’t take real usage into account. Consolidation, too, “only considers Pod resource requests and not real resource usage when making decisions.” The replica count KEDA chooses then multiplies each request.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "Run the opening’s queue worker, which requests 1\u00a0CPU and uses 0.25, at 40\u00a0replicas. Karpenter provisions nodes for 40 × 1 = 40\u00a0CPU of requests to run 40 × 0.25 = 10\u00a0CPU of work, so 40 − 10 = 30\u00a0CPU sits idle. That’s three-quarters of what those pods reserve, yet a node packed with them looks full to the scheduler.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: "The node autoscaling docs warn that a request set too high “might incorrectly prevent consolidating its Node.” The EKS best practices guide asks for accurate requests on all workloads, and calls that “particularly important if using Karpenter’s consolidation feature.”",
        },
        { kind: "p", text: "What a smaller request does depends on the trigger:" },
        {
          kind: "ul",
          items: [
            [
              { b: "With an event trigger, a smaller request fits more pods on each node." },
              " A trigger such as a message count takes a target value (",
              { code: "AverageValue" },
              " or ",
              { code: "Value" },
              "), so the replica count follows the events.",
            ],
            [
              {
                b: "With a CPU or memory trigger on utilization, a smaller request means more replicas.",
              },
              " Under ",
              { code: "metricType: Utilization" },
              ", the target is a percentage of the pods’ requests, so the same load reads as higher utilization. That scaler requires a request or a limit on the pods.",
            ],
          ],
        },
        {
          kind: "p",
          text: "The Kubernetes docs rank this layer with the other two: “Correctly setting the resource requests of your Pods is as important to the overall cost-effectiveness of a cluster as optimizing Node utilization.”",
        },
      ],
    },
    {
      id: "keda-and-karpenter-setup",
      title: "Rebalance requests first, then set the caps",
      blocks: [
        {
          kind: "p",
          text: "Karpenter sizes nodes from the request, and a CPU trigger on utilization measures load against it, so set it first.",
        },
        {
          kind: "ol",
          items: [
            [
              { b: "Rebalance requests to measured use." },
              " With that trigger, change them in small steps and watch the replica count. ",
              { a: "Kubernetes pod right sizing", href: "/learn/kubernetes-pod-right-sizing" },
              " walks through the method.",
            ],
            [
              { b: "Set both caps." },
              " ",
              { code: "maxReplicaCount" },
              " bounds the pods KEDA can ask for, and a NodePool’s ",
              { code: "spec.limits" },
              " bounds what Karpenter can launch for them.",
            ],
            [
              { b: "Give a spiky workload a non-zero consolidation wait." },
              " At 0\u00a0seconds, Karpenter can consolidate a node in the gap between two bursts that KEDA is about to fill again. The Karpenter docs say a longer ",
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
              " to protect it only for that long after it starts.",
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
          text: "And the NodePool caps what Karpenter launches at 100\u00a0CPU and sets when to consolidate:",
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
      title: "Where Coral fits with KEDA and Karpenter",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " optimizes Kubernetes on AKS and EKS by working on the third layer: it rebalances each container’s CPU and memory requests to real use, so the same Karpenter or NAP can run fewer or smaller nodes.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Rebalancing." },
              " On the balanced policy, the default, CPU comes from the 80th percentile of the last 3\u00a0days and memory from the highest use in the last 8\u00a0days, each plus 10%. Pod sizing starts only when you switch on “Automatically optimize”. Running pods are resized in place on 1.33+ nodes, or restarted one at a time within their PDBs.",
            ],
            [
              { b: "KEDA sizing." },
              " For a ScaledObject with a ",
              { code: "cpu" },
              " trigger, Coral picks the CPU request by replaying past load (3\u00a0days on the default policy) through the trigger’s utilization target, the ScaledObject’s minimum and maximum replicas, and the scaling behavior of KEDA’s HPA. A smaller request wins only if its saving beats the cost of unserved load and extra scaling. Event triggers such as a queue length aren’t replayed, nor is a paused ScaledObject.",
            ],
            [
              { b: "KEDA’s HPA." },
              " Coral never takes over or converts an HPA that KEDA manages, and creates an HPA only for a Deployment or Argo Rollout that has none. It changes the ScaledObject’s minimum or maximum only in a rebalance’s warm handover: to move a pod, Coral raises the minimum, so a new pod is Ready on another node before the old one is evicted, then scales back.",
            ],
            [
              { b: "Karpenter and NAP." },
              " Coral never changes your existing Karpenter or NAP settings and never adds nodes for demand. Pools where either one consolidates underused nodes are left to it. Coral also honours ",
              { code: "karpenter.sh/do-not-disrupt" },
              " on pods and nodes.",
            ],
            [
              { b: "Cheaper machines." },
              " With Karpenter or NAP in place, a rebalance can also move work to smaller or cheaper machines. It creates new fixed-size NodePools named ",
              { code: "zoorik-rb-…" },
              ", and your Karpenter or NAP launches the machines.",
            ],
            [
              { b: "No node autoscaler." },
              " Connecting the cluster to Coral sets up Karpenter on EKS, or NAP on AKS where the cluster uses Azure CNI (not kubenet), with your approval.",
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
    text: "Coral rebalances CPU and memory requests on AKS and EKS, works with your HPA, and drains spare nodes so your autoscaler can remove them. We estimate it takes 40–50% off AKS and EKS cost. It is an estimated range, not a promise. The free assessment works out your own figure.",
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
      title: "KEDA vs HPA vs VPA: where event-driven scaling fits",
      where: "Learn",
      href: "/learn/keda-vs-hpa-vs-vpa",
    },
    {
      title: "Karpenter consolidation: policies, budgets and limits",
      where: "Learn",
      href: "/learn/karpenter-consolidation",
    },
    {
      title: "Kubernetes pod right sizing: set requests from real use",
      where: "Learn",
      href: "/learn/kubernetes-pod-right-sizing",
    },
    {
      title: "Do I need Coral with Karpenter or NAP?",
      where: "Coral FAQ",
      href: "/coral-faq#do-i-need-coral-with-karpenter",
    },
    { title: "HPAs and VPAs", where: "Coral product guide", href: "/coral-guide#hpas-and-vpas" },
  ],
};
