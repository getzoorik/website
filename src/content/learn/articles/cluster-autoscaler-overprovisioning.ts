import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/cluster-autoscaler-overprovisioning/1";

export const article: Article = {
  slug: "cluster-autoscaler-overprovisioning",
  title: "Cluster Autoscaler overprovisioning with pause pods",
  meta: "Cluster Autoscaler overprovisioning keeps node capacity warm with low-priority placeholder pods. The priority to set, a manifest, sizing and Karpenter notes.",
  h1: "Cluster Autoscaler overprovisioning with placeholder pods",
  deck: "Placeholder pods hold spare node capacity that real pods preempt. The priority, manifest and sizing that make it work.",
  card: "Keep warm node capacity with low-priority placeholder pods: the -10 rule, a manifest and how to size it.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes autoscaling",
  published: "2026-11-14",
  updated: "2026-11-14",
  author: "somay",
  short:
    "Cluster Autoscaler overprovisioning keeps spare node capacity warm with placeholder pods: a Deployment of pause containers with a negative priority. When a real pod can’t fit, the scheduler evicts a placeholder and the real pod starts in its space without waiting for a node. The placeholder’s replacement goes Pending, and the Cluster Autoscaler adds a node for it. Give the placeholders a priority from -10 to -1, because the Cluster Autoscaler adds no nodes for pods below -10.",
  sections: [
    {
      id: "how-cluster-autoscaler-overprovisioning-works",
      title: "How Cluster Autoscaler overprovisioning works",
      blocks: [
        {
          kind: "p",
          text: [
            "This page is about headroom you reserve on purpose. Requests set far above what containers use are the other kind, covered in ",
            { a: "Kubernetes overprovisioning", href: "/learn/kubernetes-overprovisioning" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "The Cluster Autoscaler adds a node only when a pod can’t be scheduled for lack of resources, and a new node isn’t instant. The Amazon Elastic Kubernetes Service (EKS) best practices guide says nodes “can take multiple minutes to become available”, which can make pod scheduling latency an order of magnitude longer. Overprovisioning, in the same guide’s words, “trades cost for scheduling latency”. You keep headroom, spare node capacity that is already running, so a new pod doesn’t wait for a machine.",
        },
        {
          kind: "p",
          text: "Placeholder pods hold that capacity. Each one runs a minimal pause container, requests the CPU and memory you want to keep free, and has a priority below every real workload. From there the cycle runs by itself:",
        },
        {
          kind: "ol",
          items: [
            "The placeholders run on your nodes and hold their requests.",
            "A real pod arrives and fits nowhere. The scheduler preempts (evicts) placeholders on one node, and the real pod takes their space.",
            "The Deployment replaces the evicted placeholders. The replacements fit nowhere, so they stay Pending, and the Cluster Autoscaler adds a node for them.",
            "The placeholders start on the new node, and the headroom is back.",
          ],
        },
        { kind: "diagram", figure: figure1 },
        {
          kind: "p",
          text: "The real pod in step 2 doesn’t trigger a scale-up itself. According to the Cluster Autoscaler FAQ, it doesn’t scale up for a pending pod that is already waiting for a pod with a smaller priority value to be preempted, so the node it adds is for the placeholders.",
        },
      ],
    },
    {
      id: "choose-a-pod-priority-the-autoscaler-still",
      title: "Choose a pod priority the autoscaler still acts on",
      blocks: [
        {
          kind: "p",
          text: [
            "Kubernetes pod priority comes from a PriorityClass: a cluster-wide object (it has no namespace) that maps a name to an integer. A higher value means more important, and a class can take any 32-bit integer up to 1 billion. A pod names its class in ",
            { code: "priorityClassName" },
            ". Pods that name none get priority 0, unless a PriorityClass is marked ",
            { code: "globalDefault" },
            ". The feature behind all this, pod priority and preemption, has been stable since Kubernetes 1.14.",
          ],
        },
        {
          kind: "p",
          text: "Preemption is what makes the placeholders give way. When a pod can’t be scheduled, the scheduler looks for a node where evicting pods with a priority below its own would let it fit, and evicts them. Workloads without a class keep the default of 0, above any negative placeholder, so any of them can preempt one.",
        },
        {
          kind: "p",
          text: [
            "The Cluster Autoscaler adds a rule of its own. Pods with a priority below its cutoff, -10 by default, are expendable to it: they don’t trigger scale-ups, and they don’t stop it removing the nodes they run on. Its FAQ reserves -10 for overprovisioning pods as “the lowest priority that triggers scaling clusters”. The ",
            { code: "--expendable-pods-priority-cutoff" },
            " flag changes the cutoff, and the FAQ discourages using it. For Azure Kubernetes Service (AKS), Microsoft’s documentation states the same rule: nodes don’t scale up for pods with a PriorityClass value below -10.",
          ],
        },
        {
          kind: "p",
          text: "Check this if you start from the sample on kubernetes.io’s “Overprovision Node Capacity For A Cluster” page, whose PriorityClass uses -1000. Under the Cluster Autoscaler, nothing adds a node for those placeholders, so they can hold only space that is already free. After a preemption, the headroom comes back only if other pods free the space. The autoscaler can also remove a node that runs only placeholders, because expendable pods don’t prevent scale-down. With the Cluster Autoscaler, set the value to -10.",
        },
        {
          kind: "p",
          text: [
            "One more case to know: a pod whose PriorityClass sets ",
            { code: "preemptionPolicy: Never" },
            " can’t preempt anything. It waits in the queue until enough resources are free, usually on a new node, so the headroom doesn’t help it.",
          ],
        },
      ],
    },
    {
      id: "create-the-placeholder-deployment",
      title: "Create the placeholder Deployment",
      blocks: [
        {
          kind: "p",
          text: [
            "Give the placeholders a namespace of their own, and keep them out of kube-system. The Cluster Autoscaler FAQ lists kube-system pods that have no PodDisruptionBudget (PDB) and don’t run on the node by default among the pods that can stop it removing a node. The guide to ",
            {
              a: "nodes the autoscaler won’t remove",
              href: "/learn/cluster-autoscaler-not-scaling-down",
            },
            " covers that rule and the others like it.",
          ],
        },
        { kind: "code", lang: "bash", code: "kubectl create namespace headroom" },
        {
          kind: "p",
          text: [
            "Save this as ",
            { code: "capacity-reservation.yaml" },
            ", which defines the PriorityClass and a Kubernetes placeholder pod Deployment with two replicas:",
          ],
        },
        {
          kind: "code",
          lang: "yaml",
          code: 'apiVersion: scheduling.k8s.io/v1\nkind: PriorityClass\nmetadata:\n  name: overprovisioning\nvalue: -10\nglobalDefault: false\ndescription: "Placeholder pods that hold spare capacity for real workloads."\n---\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: capacity-reservation\n  namespace: headroom\nspec:\n  replicas: 2\n  selector:\n    matchLabels:\n      app.kubernetes.io/name: capacity-placeholder\n  template:\n    metadata:\n      labels:\n        app.kubernetes.io/name: capacity-placeholder\n    spec:\n      priorityClassName: overprovisioning\n      terminationGracePeriodSeconds: 0\n      affinity:\n        podAntiAffinity:\n          preferredDuringSchedulingIgnoredDuringExecution:\n          - weight: 100\n            podAffinityTerm:\n              labelSelector:\n                matchLabels:\n                  app.kubernetes.io/name: capacity-placeholder\n              topologyKey: kubernetes.io/hostname\n      containers:\n      - name: pause\n        image: registry.k8s.io/pause:3.9\n        resources:\n          requests:\n            cpu: "1"\n            memory: "2Gi"',
        },
        {
          kind: "p",
          text: "The headroom is replicas times requests: here 2 × (1\u00a0CPU, 2\u00a0GiB), so 2\u00a0CPU and 4\u00a0GiB. The other fields each do one job:",
        },
        {
          kind: "ul",
          items: [
            [
              { code: "terminationGracePeriodSeconds: 0" },
              " frees the space without a wait. A preempted pod gets its graceful termination period before the real pod can use its room, and the Kubernetes docs suggest zero or a small number for low-priority pods.",
            ],
            [
              "The preferred anti-affinity spreads the placeholders one per node where it can, with ",
              { code: "kubernetes.io/hostname" },
              " as the topology key. It’s a preference, so the scheduler can still put two placeholders on one node.",
            ],
            [
              "There is no PDB, on purpose. Kubernetes honors PDBs during preemption on a best-effort basis, and when the lowest-priority pods have a PDB that preemption would break, the scheduler may pick a node with higher-priority pods instead. Budgets belong on the real workloads, which ",
              { a: "PDB best practices", href: "/learn/pod-disruption-budget-best-practices" },
              " covers for AKS and EKS.",
            ],
          ],
        },
        { kind: "p", text: "Apply it and check that both replicas run:" },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl apply -f capacity-reservation.yaml\nkubectl --namespace headroom get deployment capacity-reservation",
        },
        {
          kind: "p",
          text: [
            "To test the headroom, scale a real Deployment past the free capacity and watch a replacement placeholder go Pending. When the Cluster Autoscaler decides to add a node for it, it records a TriggeredScaleUp event on the pod, which you can read with ",
            { code: "kubectl --namespace headroom describe pods <placeholder-pod>" },
            ". If a replacement placeholder stays Pending with no such event, check that its priority is -10 or higher and that the node pool isn’t already at its maximum size.",
          ],
        },
      ],
    },
    {
      id: "how-much-headroom-to-keep",
      title: "How much headroom to keep",
      blocks: [
        {
          kind: "p",
          text: "Size each placeholder for the largest pod you want to start without waiting. Preemption works one node at a time: the scheduler considers a node only if evicting the pods on it with less priority than the pending pod would let that pod fit there. A pod that requests 2\u00a0CPU can’t use two 1-CPU placeholders on two different nodes.",
        },
        {
          kind: "p",
          text: "Size the total for what arrives while one node is starting. The EKS guide compares how often you need a new node with how long one takes to arrive: if you need one every 30\u00a0seconds and EC2 takes 30\u00a0seconds to provision it, one node of headroom keeps a spare ready. To improve zonal scheduling, it suggests overprovisioning as many nodes as your Auto Scaling group has Availability Zones, so the scheduler can choose the best zone.",
        },
        {
          kind: "p",
          text: "The placeholders’ requests are capacity you pay for around the clock, the same as the pods they make room for. Two 1-CPU placeholders on 4-CPU nodes keep about half a node idle all the time, so size the headroom to the wait you need to avoid.",
        },
        {
          kind: "p",
          text: "A fixed replica count doesn’t grow with the cluster. The Cluster Autoscaler FAQ pairs the placeholders with the cluster-proportional-autoscaler, which raises the replica count as the cluster grows and reduces it when the cluster gets smaller, for headroom set as a share of the cluster, such as 20%.",
        },
      ],
    },
    {
      id: "overprovisioning-with-karpenter-and-on-aks",
      title: "Overprovisioning with Karpenter and on AKS",
      blocks: [
        {
          kind: "p",
          text: "AKS overprovisioning with the Cluster Autoscaler works as described above, and the -10 rule is in Microsoft’s own AKS guidance. Node auto-provisioning (NAP) on AKS is different: Microsoft says it is based on the open-source Karpenter project and provisions nodes in response to pending pod pressure. The Karpenter notes below apply to it too.",
        },
        {
          kind: "p",
          text: [
            "Karpenter overprovisioning uses the same Deployment, because ",
            { a: "Karpenter", href: "/learn/what-is-karpenter" },
            " launches nodes for pending pods by simulating how they would pack onto new machines, and a pending placeholder is one of them. Two things behave differently:",
          ],
        },
        {
          kind: "ul",
          items: [
            "Preferences act like requirements. Karpenter starts by treating preferred affinities as required, and relaxes them one at a time only when they can’t be met. As the kubernetes.io page warns, the replica count then also sets a minimum node count. With the anti-affinity above, 2\u00a0replicas keep at least 2\u00a0nodes, so drop it if you’d rather Karpenter pack the placeholders together.",
            [
              "Consolidation counts placeholders as pods. ",
              { a: "Karpenter’s consolidation", href: "/learn/karpenter-consolidation" },
              " deletes a node only if all of its pods can run on free capacity elsewhere, and replaces one only if they fit on other nodes plus one cheaper machine. When several nodes qualify, it prefers nodes whose pods have less priority. Preferred anti-affinity can also make consolidation less effective, because Karpenter may keep a node to honor a preference even when the scheduler could fit the pods elsewhere.",
            ],
          ],
        },
      ],
    },
    {
      id: "warm-headroom-alongside-coral",
      title: "Warm headroom alongside Coral",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            ", Zoorik’s Kubernetes optimization for AKS and EKS, keeps no idle spare nodes. It rebalances each container’s CPU and memory requests to measured use, and the headroom sits inside each pod’s request: on the balanced policy, CPU gets the 80th percentile of 3\u00a0days plus 10%, and memory the 8-day peak plus 10%. Sudden growth is your autoscaler’s job. Coral never adds nodes for demand, so a pending placeholder still gets its node from the Cluster Autoscaler, Karpenter or NAP.",
          ],
        },
        {
          kind: "p",
          text: [
            "To keep warm node capacity as well, run the placeholder Deployment and put it on Coral’s Read-only policy (",
            { code: "readonly" },
            "), as the FAQ answer on ",
            {
              a: "how much spare capacity is kept",
              href: "/coral/faq#how-much-spare-capacity-is-kept",
            },
            " advises. A pause container uses almost no CPU or memory, so a policy with automation on would shrink the very requests that make up your headroom.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "The Read-only policy." },
              " It gives recommendations only and never changes a workload. It’s also the one ",
              { a: "built-in policy", href: "/coral/guide#built-in-policies" },
              " that doesn’t manage Horizontal Pod Autoscalers (HPAs), so Coral won’t create an HPA for the Deployment. Pick it on the workload’s page, or name it in the workload’s annotation, shown below.",
            ],
            [
              { b: "The ignore label." },
              " ",
              { code: 'coral.zoorik.com/ignore: "true"' },
              " on the namespace, workload or pod template also stops Coral changing the placeholders’ sizes or HPAs.",
            ],
            [
              { b: "Node moves." },
              " These work by node pool, not by namespace, and the ignore label doesn’t stop them. Before consolidation moves anything, Coral checks on the live cluster that every pod on the node fits on another Ready node.",
            ],
            [
              { b: "The namespace." },
              " A kube-system pod with no PDB is one of the common reasons Coral ",
              { a: "won’t empty a node", href: "/coral/guide#nodes-held" },
              ", one more reason to give the placeholders a namespace of their own.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "To set the policy from the manifest, add Coral’s ",
            { a: "per-workload annotation", href: "/coral/guide#per-workload-settings" },
            " to the Deployment’s metadata. A workload with this annotation is managed from its manifest, so its console controls are locked.",
          ],
        },
        {
          kind: "code",
          lang: "yaml",
          code: "metadata:\n  name: capacity-reservation\n  namespace: headroom\n  annotations:\n    coral.zoorik.com/configuration: |\n      scalingPolicyName: readonly",
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
      title: "“Overprovision Node Capacity For A Cluster”",
      url: "https://kubernetes.io/docs/tasks/administer-cluster/node-overprovisioning/",
    },
    {
      publisher: "Kubernetes",
      title: "“Pod Priority and Preemption”",
      url: "https://kubernetes.io/docs/concepts/scheduling-eviction/pod-priority-preemption/",
    },
    {
      publisher: "Kubernetes autoscaler",
      title: "“Cluster Autoscaler FAQ”",
      url: "https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Cluster autoscaling in Azure Kubernetes Service (AKS) overview”",
      url: "https://learn.microsoft.com/en-us/azure/aks/cluster-autoscaler-overview",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Overview of Node Auto-Provisioning (NAP) in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/node-auto-provisioning",
    },
    {
      publisher: "Amazon EKS Best Practices Guide",
      title: "“Cluster Autoscaler”",
      url: "https://docs.aws.amazon.com/eks/latest/best-practices/cas.html",
    },
    {
      publisher: "Karpenter",
      title: "“Scheduling”",
      url: "https://karpenter.sh/docs/concepts/scheduling/",
    },
    {
      publisher: "Karpenter",
      title: "“Disruption”",
      url: "https://karpenter.sh/docs/concepts/disruption/",
    },
  ],
  related: [
    {
      title: "Kubernetes overprovisioning: what it is and how to measure it",
      where: "Learn",
      href: "/learn/kubernetes-overprovisioning",
    },
    {
      title: "Karpenter vs Cluster Autoscaler: how each removes nodes",
      where: "Learn",
      href: "/learn/karpenter-vs-cluster-autoscaler",
    },
    {
      title: "AKS node auto provisioning (NAP): what it is, how to enable",
      where: "Learn",
      href: "/learn/aks-node-auto-provisioning",
    },
    {
      title: "How much spare capacity is kept for sudden workload growth?",
      where: "Coral FAQ",
      href: "/coral/faq#how-much-spare-capacity-is-kept",
    },
    {
      title: "Built-in policies",
      where: "Coral product guide",
      href: "/coral/guide#built-in-policies",
    },
  ],
};
