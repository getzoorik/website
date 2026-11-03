import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/cluster-autoscaler-overprovisioning/1";
import { figure as figure2 } from "@/features/learn/figures/cluster-autoscaler-overprovisioning/2";
import { figure as figure3 } from "@/features/learn/figures/cluster-autoscaler-overprovisioning/3";

export const article: Article = {
  slug: "cluster-autoscaler-overprovisioning",
  title: "Cluster Autoscaler overprovisioning with pause pods",
  meta: "Cluster Autoscaler overprovisioning with placeholder (pause) pods: the -10 priority rule, a manifest, how to size headroom, and AKS and Karpenter notes.",
  h1: "Cluster Autoscaler overprovisioning",
  deck: "Keep spare node capacity warm with low-priority placeholder pods, so new pods start without waiting for a node.",
  card: "Keep warm node capacity with low-priority placeholder pods: the -10 rule, a manifest and how to size it.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes autoscaling",
  published: "2026-11-01",
  updated: "2026-11-03",
  author: "somay",
  cover: "/learn-covers/zoorik-learn-cluster-autoscaler-overprovisioning-1200x630.webp",
  coverAlt:
    "On a full node, a real pod takes a placeholder’s place, and the placeholder starts again on a new node",
  short:
    "Cluster Autoscaler overprovisioning keeps spare node capacity running with low-priority placeholder pods, also called pause pods. A real pod that fits nowhere preempts a placeholder and takes its room. The evicted placeholder’s replacement goes Pending, and the Cluster Autoscaler adds a node for it. Give placeholders a priority from -10 to -1: below -10, the autoscaler adds no node for them.",
  sections: [
    {
      id: "cluster-autoscaler-overprovisioning",
      title: "How it works",
      blocks: [
        {
          kind: "p",
          text: "The Cluster Autoscaler adds a node only once a pod can’t be scheduled. The Amazon Elastic Kubernetes Service (EKS) best practices guide says nodes “can take multiple minutes to become available”.",
        },
        {
          kind: "p",
          text: "Overprovisioning “trades cost for scheduling latency”, in the same guide’s words. You keep headroom: spare node capacity that is already running when a pod arrives.",
        },
        {
          kind: "p",
          text: "Placeholder pods hold the headroom. Each runs a minimal pause container, requests the CPU and memory you want kept free, and has a lower priority than every real workload.",
        },
        {
          kind: "ol",
          items: [
            "The placeholders run on your nodes and hold their requests.",
            "A real pod arrives and fits nowhere. The scheduler preempts (evicts) placeholders on one node, and the real pod takes their room.",
            "The Deployment replaces the evicted placeholders. The replacements go Pending, and the Cluster Autoscaler adds a node for them.",
            "The placeholders start on the new node, and the headroom is back.",
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "callout",
          label: "For engineers",
          text: "The new node is for the placeholders, not for the real pod in step 2. The Cluster Autoscaler FAQ says it adds no node for a pending pod that is waiting on a preemption.",
        },
        {
          kind: "p",
          text: [
            "This is headroom you reserve on purpose. Requests set far above what containers use are the other kind of overprovisioning, covered in ",
            { a: "Kubernetes requests vs usage", href: "/learn/kubernetes-overprovisioning" },
            ".",
          ],
        },
      ],
    },
    {
      id: "priority-10-is-the-lowest-the-cluster",
      title: "The -10 priority rule",
      blocks: [
        {
          kind: "h3",
          id: "kubernetes-pod-priority-and-preemption",
          title: "Pod priority and preemption",
        },
        {
          kind: "p",
          text: "A pod’s priority comes from a PriorityClass: a cluster-wide object (it has no namespace) that maps a name to an integer. A higher value means more important. The value can be any 32-bit integer up to 1 billion.",
        },
        {
          kind: "p",
          text: [
            "A pod names its class in ",
            { code: "priorityClassName" },
            ". A pod that names none gets priority 0, unless a PriorityClass is marked ",
            { code: "globalDefault" },
            ". Pod priority and preemption has been stable since Kubernetes 1.14.",
          ],
        },
        {
          kind: "p",
          text: "Preemption is what makes placeholders give way. When a pod can’t be scheduled, the scheduler evicts lower-priority pods from one node so the pod fits there. Workloads at the default of 0 can preempt any negative placeholder.",
        },
        {
          kind: "h3",
          id: "the-cluster-autoscaler-treats-pods-below-10",
          title: "Below -10 is expendable",
        },
        {
          kind: "p",
          text: "The Cluster Autoscaler treats pods below its cutoff, -10 by default, as expendable. They trigger no scale-up and don’t stop it removing the nodes they run on.",
        },
        {
          kind: "p",
          text: [
            "Its FAQ reserves -10 for overprovisioning pods, “the lowest priority that triggers scaling clusters”. It discourages changing ",
            { code: "--expendable-pods-priority-cutoff" },
            ". Microsoft states the same rule for Azure Kubernetes Service (AKS): nodes don’t scale up for pods with a PriorityClass value below -10.",
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "The sample on kubernetes.io’s “Overprovision Node Capacity For A Cluster” page gives its PriorityClass a value of -1000, below the cutoff. The Cluster Autoscaler adds no node for those placeholders, and can remove a node that runs only placeholders. With the Cluster Autoscaler, use -10.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: [
            "A pod whose PriorityClass sets ",
            { code: "preemptionPolicy: Never" },
            " can’t preempt. It waits until enough resources are free, usually on a new node, so the headroom doesn’t help it.",
          ],
        },
      ],
    },
    {
      id: "create-the-placeholder-deployment-in-its-own",
      title: "Create the placeholders",
      blocks: [
        {
          kind: "ol",
          items: [
            [
              "Create a namespace for the placeholders, outside kube-system. Pods in kube-system without a PodDisruptionBudget (PDB) are among ",
              {
                a: "the pods that can stop the Cluster Autoscaler removing a node",
                href: "/learn/cluster-autoscaler-not-scaling-down",
              },
              ".",
            ],
          ],
        },
        { kind: "code", lang: "bash", code: "kubectl create namespace headroom" },
        {
          kind: "ol",
          start: 2,
          items: [
            [
              "Save this as ",
              { code: "capacity-reservation.yaml" },
              ". It defines the PriorityClass and a placeholder Deployment with two replicas:",
            ],
          ],
        },
        {
          kind: "code",
          lang: "yaml",
          code: 'apiVersion: scheduling.k8s.io/v1\nkind: PriorityClass\nmetadata:\n  name: overprovisioning\nvalue: -10\nglobalDefault: false\ndescription: "Placeholder pods that hold spare capacity for real workloads."\n---\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: capacity-reservation\n  namespace: headroom\nspec:\n  replicas: 2\n  selector:\n    matchLabels:\n      app.kubernetes.io/name: capacity-placeholder\n  template:\n    metadata:\n      labels:\n        app.kubernetes.io/name: capacity-placeholder\n    spec:\n      priorityClassName: overprovisioning\n      terminationGracePeriodSeconds: 0\n      affinity:\n        podAntiAffinity:\n          preferredDuringSchedulingIgnoredDuringExecution:\n          - weight: 100\n            podAffinityTerm:\n              labelSelector:\n                matchLabels:\n                  app.kubernetes.io/name: capacity-placeholder\n              topologyKey: kubernetes.io/hostname\n      containers:\n      - name: pause\n        image: registry.k8s.io/pause:3.9\n        resources:\n          requests:\n            cpu: "1"\n            memory: "2Gi"',
        },
        {
          kind: "p",
          text: "The headroom is replicas times requests: 2 × (1\u00a0CPU, 2\u00a0GiB) makes 2\u00a0CPU and 4\u00a0GiB.",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "No grace period." },
              " ",
              { code: "terminationGracePeriodSeconds: 0" },
              " frees the room at once. A preempted pod gets its grace period before the real pod can use its room. The Kubernetes docs suggest zero or a small number for low-priority pods.",
            ],
            [
              { b: "A preferred spread." },
              " The anti-affinity spreads placeholders one per node where it can, with ",
              { code: "kubernetes.io/hostname" },
              " as the topology key. It’s a preference, so two placeholders can still share a node.",
            ],
            [
              { b: "No PDB, on purpose." },
              " Kubernetes honors PDBs during preemption only on a best-effort basis. If preemption would break a PDB on the lowest-priority pods, the scheduler may pick a node with higher-priority pods instead. Put budgets on the real workloads, as ",
              { a: "PDB best practices", href: "/learn/pod-disruption-budget-best-practices" },
              " explains for AKS and EKS.",
            ],
          ],
        },
        { kind: "ol", start: 3, items: ["Apply it and check that both replicas run:"] },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl apply -f capacity-reservation.yaml\nkubectl --namespace headroom get deployment capacity-reservation",
        },
        {
          kind: "ol",
          start: 4,
          items: [
            "Test the headroom. Scale a real Deployment past the free capacity, and watch a replacement placeholder go Pending. When the Cluster Autoscaler decides to add a node for it, it records a TriggeredScaleUp event on the pod:",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl --namespace headroom describe pods <placeholder-pod>",
        },
        {
          kind: "p",
          text: "If a replacement placeholder stays Pending with no such event, check two things. Its priority must be -10 or higher, and the node pool must be below its maximum size.",
        },
      ],
    },
    {
      id: "size-placeholders-for-your-largest-pod-and",
      title: "Size the headroom",
      blocks: [
        {
          kind: "p",
          text: [
            "Placeholders’ requests are capacity you pay for around the clock, so size them to the wait you need to avoid. The ",
            { a: "EKS and AKS pricing calculator", href: "/eks-and-aks-pricing-calculator" },
            " shows what a node costs a month at list price.",
          ],
        },
        {
          kind: "p",
          text: "Size each placeholder for the largest pod that must start at once. Preemption frees room on one node at a time, so a 2-CPU pod can’t use two 1-CPU placeholders on different nodes.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "On 4-CPU nodes, the manifest’s 2\u00a0CPU of headroom is about half a node (2 ÷ 4). To start 2-CPU pods without waiting, give each placeholder 2\u00a0CPU. The headroom then becomes 4\u00a0CPU (2 × 2), about a whole node.",
        },
        { kind: "svg", figure: figure3 },
        {
          kind: "p",
          text: "Size the total for what arrives while a node starts. In the EKS guide’s example, you need a new node every 30\u00a0seconds, and EC2 takes 30\u00a0seconds to provision one. One node of headroom then keeps a spare ready.",
        },
        {
          kind: "p",
          text: "To improve zonal scheduling, the guide suggests overprovisioning as many nodes as your Auto Scaling group has Availability Zones.",
        },
        {
          kind: "h3",
          id: "grow-headroom-with-the-cluster-proportional-autoscaler",
          title: "Proportional headroom",
        },
        {
          kind: "p",
          text: "A fixed replica count doesn’t grow with the cluster. The Cluster Autoscaler FAQ pairs placeholders with the cluster-proportional-autoscaler, which sets their replica count to hold a share of the cluster, such as 20%.",
        },
      ],
    },
    {
      id: "the-same-deployment-works-on-aks-and",
      title: "AKS and Karpenter",
      blocks: [
        {
          kind: "p",
          text: "On AKS, the Cluster Autoscaler works as described above. Node auto provisioning (NAP) is based on the open-source Karpenter project, so the Karpenter notes below apply to it too.",
        },
        {
          kind: "p",
          text: [
            { a: "Karpenter", href: "/learn/what-is-karpenter" },
            " launches nodes for pending pods, placeholders included, so the same Deployment works. Two things differ:",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Preferences act like requirements." },
              " Karpenter first treats preferred affinities as required, and relaxes them only when they can’t be met. With the anti-affinity above, 2\u00a0replicas keep at least 2\u00a0nodes. Drop it if you’d rather Karpenter pack the placeholders together.",
            ],
            [
              { b: "Consolidation counts placeholders as pods." },
              " ",
              { a: "Karpenter’s consolidation", href: "/learn/karpenter-consolidation" },
              " removes or replaces a node only if its pods fit elsewhere, and prefers nodes whose pods have lower priority. Preferred anti-affinity can also make consolidation less effective.",
            ],
          ],
        },
      ],
    },
    {
      id: "keep-warm-headroom-alongside-coral-with-the",
      title: "Where Coral fits",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            ", Zoorik’s Kubernetes cost optimization for AKS and EKS, keeps no idle spare nodes. It rebalances CPU and memory requests to measured use, so the headroom sits inside each pod’s request.",
          ],
        },
        {
          kind: "p",
          text: "Sudden growth stays your autoscaler’s job. A pending placeholder still gets its node from the Cluster Autoscaler, Karpenter or NAP.",
        },
        {
          kind: "h3",
          id: "put-the-placeholders-on-the-read-only",
          title: "Use the Read-only policy",
        },
        {
          kind: "p",
          text: [
            "Run the placeholder Deployment on Coral’s Read-only policy (",
            { code: "readonly" },
            "), as the Coral FAQ answer on ",
            {
              a: "how much spare capacity Coral keeps",
              href: "/coral-faq#how-much-spare-capacity-is-kept",
            },
            " advises. A pause container uses almost no CPU or memory, so a policy with automation on would shrink the requests that make up your headroom.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Read-only." },
              " It gives recommendations only and never changes a workload. It’s also the one ",
              { a: "built-in policy", href: "/coral-guide#built-in-policies" },
              " that doesn’t manage Horizontal Pod Autoscalers (HPAs), so Coral won’t create an HPA for the Deployment. Pick it on the workload’s page, or name it in the workload’s annotation, as ",
              { a: "the Coral guide", href: "/coral-guide#per-workload-settings" },
              " shows.",
            ],
            [
              { b: "Its own namespace." },
              " A kube-system pod with no PDB is one of the common reasons Coral ",
              { a: "won’t empty a node", href: "/coral-guide#nodes-held" },
              ". That’s one more reason to keep the placeholders out of kube-system.",
            ],
          ],
        },
      ],
    },
  ],
  help: {
    product: "coral",
    text: "Coral rebalances CPU and memory requests on AKS and EKS, works with your HPA, and removes the nodes you don’t need, without any downtime. We estimate 40–50% off AKS and EKS cost. It is an estimated range, not a promise. The free assessment works out your own figure.",
    links: [
      { label: "Kubernetes optimization with Coral", href: "/coral" },
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
      title: "Kubernetes overprovisioning",
      where: "Learn",
      href: "/learn/kubernetes-overprovisioning",
    },
    {
      title: "Karpenter vs Cluster Autoscaler",
      where: "Learn",
      href: "/learn/karpenter-vs-cluster-autoscaler",
    },
    {
      title: "AKS node auto provisioning (NAP)",
      where: "Learn",
      href: "/learn/aks-node-auto-provisioning",
    },
    {
      title: "Cluster Autoscaler not scaling down",
      where: "Learn",
      href: "/learn/cluster-autoscaler-not-scaling-down",
    },
    {
      title: "Karpenter consolidation",
      where: "Learn",
      href: "/learn/karpenter-consolidation",
    },
  ],
};
