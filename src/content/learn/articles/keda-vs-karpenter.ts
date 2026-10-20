import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/keda-vs-karpenter/1";

export const article: Article = {
  slug: "keda-vs-karpenter",
  title: "KEDA vs Karpenter: pods, nodes and the requests",
  meta: "KEDA vs Karpenter: KEDA sets how many pods run from events, Karpenter picks the nodes from pod requests. How they work together, and what neither changes.",
  h1: "KEDA vs Karpenter: pods, nodes and the requests in between",
  deck: "KEDA sets the pod count and Karpenter picks the nodes. How they work together, and the one number neither changes.",
  card: "KEDA sets how many pods run, Karpenter picks the nodes, and neither changes what each pod requests.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes autoscaling",
  versus: ["KEDA", "Karpenter"],
  published: "2026-10-25",
  updated: "2026-10-25",
  author: "aditya",
  short:
    "KEDA vs Karpenter isn’t a choice between two tools for one job. KEDA (Kubernetes Event-driven Autoscaling) decides how many pods of a workload run, from event sources such as messages waiting in a queue, and can scale a workload to zero. Karpenter decides which nodes the cluster has: it launches machines that fit the requests of pods that can’t be scheduled, and removes nodes it no longer needs. The two work together, and neither changes what each pod requests.",
  sections: [
    {
      id: "keda-vs-karpenter-what-each-one-decides",
      title: "KEDA vs Karpenter: what each one decides",
      blocks: [
        {
          kind: "p",
          text: "Karpenter vs KEDA looks like a contest between two autoscalers, but they act on different objects. KEDA changes a replica count. Karpenter changes the set of machines. They meet at the pods KEDA adds: when those pods don’t fit on the nodes you have, they wait as pending pods, and Karpenter adds nodes for them.",
        },
        {
          kind: "table",
          columns: [
            { label: "", width: "14%" },
            { label: "KEDA", width: "47%" },
            { label: "Karpenter", width: "39%" },
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
              "Yes, when at least one trigger isn’t CPU or memory",
              "Deletes nodes that are empty",
            ],
            [
              "How it gives capacity back",
              [
                "Its HPA scales pods in, and KEDA goes from 1 to 0 after ",
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
          text: "The versions here are KEDA 2.21 and Karpenter 1.15, the newest in each project’s docs in October 2026. KEDA is a graduated project of the Cloud Native Computing Foundation (CNCF). Karpenter and the Cluster Autoscaler are the two node autoscalers that Kubernetes SIG Autoscaling sponsors.",
        },
      ],
    },
    {
      id: "how-keda-sets-the-pod-count",
      title: "How KEDA sets the pod count",
      blocks: [
        {
          kind: "p",
          text: [
            "KEDA has two main parts. The KEDA operator scales a workload in or out, from 0 to N replicas. KEDA’s metrics server exposes event data as external metrics for the Horizontal Pod Autoscaler (HPA), the Kubernetes controller that sets a workload’s replica count from a metric. Because of an upstream limit, KEDA must be the only external metrics adapter in the cluster. ",
            { a: "How KEDA works in Kubernetes", href: "/learn/what-is-keda" },
            " goes through each part and the scalers.",
          ],
        },
        {
          kind: "p",
          text: [
            "You link a workload to its event source with a ScaledObject. KEDA creates an HPA for it, named ",
            { code: "keda-hpa-<scaled-object-name>" },
            " by default, and checks each trigger every 30\u00a0seconds (",
            { code: "pollingInterval" },
            "). Unless you set them, the workload runs between 0 (",
            { code: "minReplicaCount" },
            ") and 100 (",
            { code: "maxReplicaCount" },
            ") replicas. ",
            { code: "cooldownPeriod" },
            " applies only on the way to zero: KEDA waits 300\u00a0seconds after the last trigger reported active before scaling the workload back to 0.",
          ],
        },
        {
          kind: "p",
          text: [
            "CPU and memory triggers can’t do that on their own. A ",
            { code: "cpu" },
            " trigger can take a workload to zero only when the ScaledObject also has a trigger that isn’t CPU or memory, and ",
            { code: "minReplicaCount" },
            " is 0.",
          ],
        },
        {
          kind: "p",
          text: [
            "So in KEDA vs Karpenter vs HPA, the HPA isn’t a third rival. It’s the part KEDA drives. Microsoft’s AKS docs advise against pointing your own HPA and a ScaledObject at the same workload, because KEDA uses an HPA in the background and the two compete. ",
            { a: "KEDA vs HPA vs VPA", href: "/learn/keda-vs-hpa-vs-vpa" },
            " compares KEDA with the HPA on its own.",
          ],
        },
      ],
    },
    {
      id: "how-karpenter-picks-and-removes-nodes",
      title: "How Karpenter picks and removes nodes",
      blocks: [
        {
          kind: "p",
          text: "Karpenter watches for pods the scheduler can’t place because of resource constraints. Karpenter reads their scheduling requirements, launches nodes that meet them, and later removes nodes that are no longer needed. AWS’s EKS best practices guide states the sizing input plainly: Karpenter “considers a pod’s requests to determine which type of instance it provisions.”",
        },
        {
          kind: "p",
          text: [
            "You set its boundaries in a NodePool: the instance types and zones it may use, taints and labels, and ",
            { code: "spec.limits" },
            ", the most CPU and memory the pool may launch. Without limits or instance-type constraints, Karpenter keeps adding capacity as long as pods need it. On EKS you install Karpenter with Helm and run it yourself, or use EKS Auto Mode, which builds on Karpenter. On AKS, ",
            { a: "NAP", href: "/learn/aks-node-auto-provisioning" },
            " deploys, configures and manages Karpenter for you, and you describe nodes with a NodePool and an AKSNodeClass. ",
            { a: "How Karpenter works", href: "/learn/what-is-karpenter" },
            " goes through these objects.",
          ],
        },
        {
          kind: "p",
          text: [
            "Giving capacity back is consolidation. The policy is ",
            { code: "WhenEmpty" },
            ", ",
            { code: "Balanced" },
            " or ",
            { code: "WhenEmptyOrUnderutilized" },
            ". With the default, ",
            { code: "WhenEmptyOrUnderutilized" },
            ", Karpenter considers any node that can be removed or replaced to reduce cost. It deletes a node when its pods fit on free capacity elsewhere, and replaces it when they fit there plus one cheaper node. ",
            { code: "consolidateAfter" },
            ", 0\u00a0seconds by default, is how long Karpenter waits for new work to land on a node before the node becomes a candidate, and the timer resets whenever pods are added or removed.",
          ],
        },
        {
          kind: "p",
          text: [
            "Unless you set budgets, one budget of 10% of nodes caps how many of a NodePool’s nodes consolidation can disrupt at the same time. Pods leave through the Eviction API, so PodDisruptionBudgets (PDBs) hold, and a pod annotated ",
            { code: 'karpenter.sh/do-not-disrupt: "true"' },
            " keeps its node out of consolidation. ",
            { a: "Karpenter consolidation", href: "/learn/karpenter-consolidation" },
            " covers each setting.",
          ],
        },
      ],
    },
    {
      id: "running-keda-and-karpenter-together",
      title: "Running KEDA and Karpenter together",
      blocks: [
        {
          kind: "p",
          text: "Nothing connects the two directly: they meet through pending pods. When a backlog builds, KEDA raises the replica count. The new pods that don’t fit stay pending, and Karpenter launches nodes sized to their requests. When the backlog clears, KEDA’s HPA scales the pods in, and KEDA takes the workload to zero after its cooldown. Nodes left empty, or whose pods now fit elsewhere, are consolidated.",
        },
        { kind: "diagram", figure: figure1 },
        {
          kind: "p",
          text: "On EKS, KEDA vs Karpenter comes down to the same split. What changes on AWS is who runs the node half: the EKS user guide makes installing, configuring and managing Karpenter your job, while EKS Auto Mode, which builds upon Karpenter, scales cluster compute for you. On AKS Automatic, both halves come preconfigured: KEDA, and NAP running Karpenter.",
        },
        { kind: "p", text: "Four settings decide how well the pair behaves:" },
        {
          kind: "ul",
          items: [
            [
              "Set both caps. ",
              { code: "maxReplicaCount" },
              " bounds the pods KEDA can ask for, and a NodePool’s ",
              { code: "spec.limits" },
              " bounds what Karpenter can launch for them.",
            ],
            [
              "Give a spiky workload a non-zero ",
              { code: "consolidateAfter" },
              ". The Karpenter docs say a longer value gives churning workloads time to settle. At 0\u00a0seconds, Karpenter can start consolidating a node in the gap between two bursts that KEDA is about to fill again.",
            ],
            [
              "Protect long jobs. A Job pod on a node that Karpenter consolidates is evicted mid-run. ",
              { a: "Annotate the Job’s pod template", href: "/learn/safe-to-evict-do-not-disrupt" },
              " with ",
              { code: 'karpenter.sh/do-not-disrupt: "true"' },
              ", or with a duration such as ",
              { code: '"30m"' },
              " to protect it only for that long after it starts.",
            ],
            "Plan for the cold start. Once KEDA has scaled a workload to zero and Karpenter has removed its node, the next event waits for a node to launch and the pod to start.",
          ],
        },
        {
          kind: "p",
          text: "The caps and the consolidation timer sit in two different objects. With example values, the ScaledObject bounds the pods:",
        },
        { kind: "code", lang: "yaml", code: "spec:\n  minReplicaCount: 0\n  maxReplicaCount: 40" },
        { kind: "p", text: "And the NodePool bounds the capacity and sets when to consolidate:" },
        {
          kind: "code",
          lang: "yaml",
          code: "spec:\n  disruption:\n    consolidationPolicy: WhenEmptyOrUnderutilized\n    consolidateAfter: 5m\n  limits:\n    cpu: 100\n    memory: 400Gi",
        },
      ],
    },
    {
      id: "the-requests-in-between",
      title: "The requests in between",
      blocks: [
        {
          kind: "p",
          text: "KEDA and Karpenter both act on a number neither of them sets: the CPU and memory request on each container. A request is what a container asks the scheduler to reserve for it. The Kubernetes docs on node autoscaling say autoscalers make sure new nodes “have enough resources to satisfy the requests” but don’t take real usage into account, and that consolidation “only considers Pod resource requests and not real resource usage when making decisions.”",
        },
        {
          kind: "p",
          text: "KEDA then multiplies each request by the replica count it chooses. Take an example worker that requests 1\u00a0CPU and uses 0.25: at 40\u00a0replicas, Karpenter provisions nodes for 40\u00a0CPU of requests to run 10\u00a0CPU of work. A node packed with those pods looks full to the scheduler while three-quarters of the CPU reserved on it sits idle, and the Kubernetes docs warn that a request set too high “might incorrectly prevent consolidating its Node.” The EKS best practices guide asks for accurate requests on all workloads, and calls that “particularly important if using Karpenter’s consolidation feature.”",
        },
        {
          kind: "p",
          text: [
            "Requests feed KEDA directly when a ScaledObject uses the ",
            { code: "cpu" },
            " or ",
            { code: "memory" },
            " scaler with ",
            { code: "metricType: Utilization" },
            ". The target is then a percentage of the pods’ requested CPU or memory, so a smaller request makes the same load read as higher utilization, and KEDA runs more replicas. The scaler requires a request or a limit on the pods. Event triggers such as message counts take a target value (",
            { code: "AverageValue" },
            " or ",
            { code: "Value" },
            ") rather than a percentage of requests, so there a smaller request lets more pods fit on each node while the replica count follows the events.",
          ],
        },
        {
          kind: "p",
          text: [
            "The Kubernetes docs rank this layer with the other two: “Correctly setting the resource requests of your Pods is as important to the overall cost-effectiveness of a cluster as optimizing Node utilization.” Setting requests from measured use, rather than from a guess made at launch, is the work neither KEDA nor Karpenter does. ",
            { a: "Setting requests from real use", href: "/learn/kubernetes-pod-right-sizing" },
            " walks through the method.",
          ],
        },
      ],
    },
    {
      id: "where-coral-fits-with-keda-and-karpenter",
      title: "Where Coral fits with KEDA and Karpenter",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral optimizes Kubernetes", href: "/coral" },
            " on AKS and EKS, and it works on that third layer. It rebalances each container’s CPU and memory requests to real use, so the same Karpenter or NAP can run fewer or smaller nodes. The other two layers stay with their owners:",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "KEDA:" },
              " Coral never takes over or converts an HPA that KEDA manages, and it creates an HPA only for a Deployment or Argo Rollout that has none. KEDA keeps the scaling. In a rebalance, to move a KEDA-scaled pod by warm handover, Coral raises the autoscaler’s minimum so a new pod is Ready on another node before the old one is evicted, then scales back.",
            ],
            [
              { b: "Karpenter and NAP:" },
              " Coral never changes your Karpenter or NAP settings and never adds nodes for demand. Pools that Karpenter or NAP already consolidates are left to them.",
            ],
            [
              { b: "Requests:" },
              " on the balanced policy, CPU comes from the 80th percentile of the last 3\u00a0days plus 10%, and memory from the highest use in the last 8\u00a0days plus 10%. Pod sizing starts only when you switch on “Automatically optimize”. Running pods are resized in place on 1.33+ nodes, or else restarted one at a time within their PDBs.",
            ],
            [
              { b: "Cheaper machines:" },
              " with Karpenter or NAP, Coral can also move work to smaller or cheaper machines. A rebalance creates fixed-size NodePools named ",
              { code: "zoorik-rb-…" },
              ", and your Karpenter or NAP launches the new machines.",
            ],
            [
              { b: "Markers:" },
              " Coral honours ",
              { code: "karpenter.sh/do-not-disrupt" },
              " on pods and nodes.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "For a ScaledObject with a ",
            { code: "cpu" },
            " trigger, Coral picks the CPU request by replaying past load (the last 3\u00a0days on the balanced policy) through the ScaledObject’s own settings: the trigger’s utilization target, its minimum and maximum replicas, and the scaling behaviour of the HPA that KEDA created. Event triggers such as a queue length aren’t part of the replay, a paused ScaledObject isn’t replayed, and Coral never changes the min or max of an HPA that KEDA owns. A smaller request wins only if its saving beats the cost of unserved load and extra scaling.",
          ],
        },
        {
          kind: "p",
          text: [
            "If a cluster has no node autoscaler, connecting it to Coral sets up Karpenter on EKS, or NAP on AKS where the cluster uses Azure CNI (not kubenet), with your approval. On our own AKS development cluster, the CPU the apps reserve went from 0.78 to 0.43\u00a0cores, and eight days after we connected Coral the cluster cost $154.76 a month instead of $368.65 (",
            {
              a: "How we reduced our own cluster’s machine bill by 58%",
              href: "/case-studies/coral-dev-cluster",
            },
            "). The short version of this page is the FAQ answer on ",
            {
              a: "whether you need Coral with Karpenter or NAP",
              href: "/coral/faq#do-i-need-coral-with-karpenter",
            },
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
      href: "/coral/faq#do-i-need-coral-with-karpenter",
    },
    { title: "HPAs and VPAs", where: "Coral product guide", href: "/coral/guide#hpas-and-vpas" },
  ],
};
