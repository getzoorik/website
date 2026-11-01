import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/cluster-autoscaler-overprovisioning/1";
import { figure as figure2 } from "@/features/learn/figures/cluster-autoscaler-overprovisioning/2";
import { figure as figure3 } from "@/features/learn/figures/cluster-autoscaler-overprovisioning/3";

export const article: Article = {
  slug: "cluster-autoscaler-overprovisioning",
  title: "Cluster Autoscaler overprovisioning with pause pods",
  meta: "Cluster Autoscaler overprovisioning keeps node capacity warm with placeholder pods. The PriorityClass to set, a manifest, sizing and Karpenter notes.",
  h1: "Cluster Autoscaler overprovisioning with placeholder pods",
  deck: "Placeholder pods hold spare node capacity that real pods preempt. The priority, manifest and sizing that make it work.",
  card: "Keep warm node capacity with low-priority placeholder pods: the -10 rule, a manifest and how to size it.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes autoscaling",
  published: "2026-11-01",
  updated: "2026-11-01",
  author: "somay",
  cover: "/learn-covers/zoorik-learn-cluster-autoscaler-overprovisioning-1200x630.webp",
  coverAlt:
    "Cluster Autoscaler overprovisioning: a real pod takes a placeholder’s place, and the placeholder goes to a new node",
  short:
    "Cluster Autoscaler overprovisioning keeps spare node capacity warm with placeholder pods, also called pause pods: a pending real pod preempts one instead of waiting for a node. Give them a priority from -10 to -1, because the Cluster Autoscaler adds nodes for their Pending replacements only at -10 or above.",
  sections: [
    {
      id: "cluster-autoscaler-overprovisioning",
      title: "Cluster Autoscaler overprovisioning starts your pod now and adds the node after",
      blocks: [
        {
          kind: "p",
          text: [
            "This page is about headroom you reserve on purpose. Requests set far above what containers use are the other kind, covered in ",
            { a: "Kubernetes requests vs usage", href: "/learn/kubernetes-overprovisioning" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "Picture a node pool where every node is full. A Deployment scales out by one replica that requests 1\u00a0CPU, and the new pod waits Pending.",
        },
        {
          kind: "p",
          text: "The Cluster Autoscaler adds a node only when a pod can’t be scheduled for lack of resources, and a new node isn’t instant. The Amazon Elastic Kubernetes Service (EKS) best practices guide says nodes “can take multiple minutes to become available”. That can make pod scheduling latency an order of magnitude longer.",
        },
        {
          kind: "p",
          text: "Overprovisioning, in the same guide’s words, “trades cost for scheduling latency”. You keep headroom, spare node capacity that is already running, so the new pod doesn’t wait for a machine.",
        },
        {
          kind: "p",
          text: "Placeholder pods hold it. Each one runs a minimal pause container and requests the CPU and memory you want to keep free. Its priority sits below every real workload’s.",
        },
        { kind: "p", text: "From there, the cycle runs by itself:" },
        {
          kind: "ol",
          items: [
            "The placeholders run on your nodes and hold their requests.",
            "A real pod arrives and fits nowhere. The scheduler preempts (evicts) placeholders on one node, and the real pod takes their space.",
            "The Deployment replaces the evicted placeholders. The replacements fit nowhere, so they stay Pending, and the Cluster Autoscaler adds a node for them.",
            "The placeholders start on the new node, and the headroom is back.",
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "callout",
          label: "For engineers",
          text: "The node the Cluster Autoscaler adds is for the placeholders, not for the real pod in step 2. Its FAQ says it adds no node for a pending pod that waits for a pod with a smaller priority value to be preempted.",
        },
      ],
    },
    {
      id: "priority-10-is-the-lowest-the-cluster",
      title: "Priority -10 is the lowest the Cluster Autoscaler still adds nodes for",
      blocks: [
        {
          kind: "h3",
          id: "kubernetes-pod-priority-and-preemption",
          title: "Kubernetes PriorityClass: pod priority and preemption",
        },
        {
          kind: "p",
          text: "Each pod’s priority comes from a PriorityClass: a cluster-wide object (it has no namespace) that maps a name to an integer. A higher value means more important. A class can take any 32-bit integer up to 1 billion.",
        },
        {
          kind: "p",
          text: [
            "A pod names its class in ",
            { code: "priorityClassName" },
            ", and pods that name none get priority 0, unless a PriorityClass is marked ",
            { code: "globalDefault" },
            ". Pod priority and preemption has been stable since Kubernetes 1.14.",
          ],
        },
        {
          kind: "p",
          text: "Preemption is what makes the placeholders give way. When a pod can’t be scheduled, the scheduler finds a node where evicting pods with less priority would let it fit, and evicts them. Workloads without a class keep the default of 0, so any of them can preempt a negative placeholder.",
        },
        {
          kind: "h3",
          id: "the-cluster-autoscaler-treats-pods-below-10",
          title: "The Cluster Autoscaler treats pods below -10 as expendable",
        },
        {
          kind: "p",
          text: "The Cluster Autoscaler adds a rule of its own. Pods with a priority below its cutoff, -10 by default, are expendable to it. They don’t trigger scale-ups, and they don’t stop it removing the nodes they run on.",
        },
        {
          kind: "p",
          text: [
            "Its FAQ reserves -10 for overprovisioning pods as “the lowest priority that triggers scaling clusters”. It also discourages changing the cutoff with the ",
            { code: "--expendable-pods-priority-cutoff" },
            " flag.",
          ],
        },
        {
          kind: "p",
          text: "Microsoft’s documentation states the same rule for Azure Kubernetes Service (AKS). Nodes don’t scale up for pods with a PriorityClass value below -10.",
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "The sample on kubernetes.io’s “Overprovision Node Capacity For A Cluster” page gives its PriorityClass a value of -1000, below the cutoff. Under the Cluster Autoscaler, nothing adds a node for those placeholders.",
        },
        {
          kind: "p",
          text: "They hold only space that is already free, and after a preemption the headroom returns only if other pods free the space. The autoscaler can also remove a node that runs only placeholders. With the Cluster Autoscaler, set the value to -10.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: [
            "A pod whose PriorityClass sets ",
            { code: "preemptionPolicy: Never" },
            " can’t preempt anything. It waits in the queue until enough resources are free, usually on a new node, so the headroom doesn’t help it.",
          ],
        },
      ],
    },
    {
      id: "create-the-placeholder-deployment-in-its-own",
      title: "Create the placeholder Deployment in its own namespace",
      blocks: [
        {
          kind: "ol",
          items: [
            [
              "Create a namespace for the placeholders, outside kube-system. The Cluster Autoscaler FAQ lists ",
              {
                a: "the pods that can stop it removing a node",
                href: "/learn/cluster-autoscaler-not-scaling-down",
              },
              ". Among them are kube-system pods that have no PodDisruptionBudget (PDB) and don’t run on the node by default.",
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
              ", which defines the PriorityClass and a Kubernetes placeholder pod Deployment with two replicas:",
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
          text: "The headroom is replicas times requests: here 2 × (1\u00a0CPU, 2\u00a0GiB), so 2\u00a0CPU and 4\u00a0GiB. The other fields each do one job:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "No grace period." },
              " ",
              { code: "terminationGracePeriodSeconds: 0" },
              " frees the space without a wait. A preempted pod gets its graceful termination period before the real pod can use its room. The Kubernetes docs suggest zero or a small number for low-priority pods.",
            ],
            [
              { b: "A preferred spread." },
              " The anti-affinity spreads the placeholders one per node where it can, with ",
              { code: "kubernetes.io/hostname" },
              " as the topology key. It’s a preference, so the scheduler can still put two placeholders on one node.",
            ],
            [
              { b: "No PDB, on purpose." },
              " Kubernetes honors PDBs during preemption on a best-effort basis. If preemption would break a PDB on the lowest-priority pods, the scheduler may pick a node with higher-priority pods instead. Budgets belong on the real workloads, which ",
              { a: "PDB best practices", href: "/learn/pod-disruption-budget-best-practices" },
              " covers for AKS and EKS.",
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
            "Test the headroom. Scale a real Deployment past the free capacity and watch a replacement placeholder go Pending. When the Cluster Autoscaler decides to add a node for it, it records a TriggeredScaleUp event on the pod:",
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
      title: "Size placeholders for your largest pod and how long a node takes to start",
      blocks: [
        {
          kind: "p",
          text: [
            "The placeholders’ requests are capacity you pay for around the clock, the same as the pods they make room for. So size the headroom to the wait you need to avoid. The ",
            { a: "EKS and AKS pricing calculator", href: "/eks-and-aks-pricing-calculator" },
            " shows what a node costs a month at list price.",
          ],
        },
        {
          kind: "p",
          text: "Size each placeholder for the largest pod you want to start without waiting. Preemption works one node at a time, so a pod that requests 2\u00a0CPU can’t use two 1-CPU placeholders on two different nodes.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "On 4-CPU nodes, the manifest’s 2\u00a0CPU of headroom is about half a node (2 ÷ 4). Spread one per node, each placeholder holds 1\u00a0CPU and 2\u00a0GiB.",
        },
        {
          kind: "p",
          text: "A new pod that requests up to that fits in one placeholder’s room, but a 2-CPU pod can’t use the two together. To start 2-CPU pods without waiting, give each placeholder 2\u00a0CPU. The headroom then becomes 4\u00a0CPU (2 × 2), about a whole node.",
        },
        { kind: "svg", figure: figure3 },
        {
          kind: "p",
          text: "Size the total for what arrives while one node is starting. The EKS guide compares how often you need a new node with how long one takes to arrive. If you need one every 30\u00a0seconds and EC2 takes 30\u00a0seconds to provision it, one node of headroom keeps a spare ready.",
        },
        {
          kind: "p",
          text: "To improve zonal scheduling, the guide suggests overprovisioning as many nodes as your Auto Scaling group has Availability Zones. Then the scheduler can choose the best zone.",
        },
        {
          kind: "h3",
          id: "grow-headroom-with-the-cluster-proportional-autoscaler",
          title: "Grow headroom with the cluster-proportional-autoscaler",
        },
        {
          kind: "p",
          text: "A fixed replica count doesn’t grow with the cluster. The Cluster Autoscaler FAQ pairs the placeholders with the cluster-proportional-autoscaler, for headroom set as a share of the cluster, such as 20%. That autoscaler raises the replica count as the cluster grows and reduces it when the cluster gets smaller.",
        },
      ],
    },
    {
      id: "the-same-deployment-works-on-aks-and",
      title: "The same Deployment works on AKS and with Karpenter",
      blocks: [
        {
          kind: "p",
          text: "AKS overprovisioning with the Cluster Autoscaler works as described above. Node auto provisioning (NAP) on AKS is different, and the Karpenter notes below apply to it too. Microsoft says NAP is based on the open-source Karpenter project and provisions nodes in response to pending pod pressure.",
        },
        {
          kind: "p",
          text: [
            "Karpenter overprovisioning uses the same Deployment. ",
            { a: "Karpenter", href: "/learn/what-is-karpenter" },
            " launches nodes for pending pods, a pending placeholder included, by simulating how they would pack onto new machines. Two things behave differently:",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Preferences act like requirements." },
              " Karpenter starts by treating preferred affinities as required, and relaxes them one at a time only when they can’t be met. As the kubernetes.io page warns, the replica count then also sets a minimum node count. With the anti-affinity above, 2\u00a0replicas keep at least 2\u00a0nodes, so drop it if you’d rather Karpenter pack the placeholders together.",
            ],
            [
              { b: "Consolidation counts placeholders as pods." },
              " ",
              { a: "Karpenter’s consolidation", href: "/learn/karpenter-consolidation" },
              " deletes a node only if all of its pods can run on free capacity elsewhere. It replaces one only if they fit on other nodes plus one cheaper machine. When several nodes qualify, it prefers nodes whose pods have less priority. Preferred anti-affinity can also make consolidation less effective. Karpenter may keep a node to honor a preference, even when the scheduler could fit the pods elsewhere.",
            ],
          ],
        },
      ],
    },
    {
      id: "keep-warm-headroom-alongside-coral-with-the",
      title: "Keep warm headroom alongside Coral with the Read-only policy",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            ", Zoorik’s Kubernetes optimization for AKS and EKS, keeps no idle spare nodes. It rebalances each container’s CPU and memory requests to measured use. The headroom sits inside each pod’s request.",
          ],
        },
        {
          kind: "p",
          text: "Sudden growth is handled by your autoscaler adding nodes. So a pending placeholder still gets its node from the Cluster Autoscaler, Karpenter or NAP.",
        },
        {
          kind: "h3",
          id: "put-the-placeholders-on-the-read-only",
          title: "Put the placeholders on the Read-only policy",
        },
        {
          kind: "p",
          text: [
            "To keep warm node capacity as well, run the placeholder Deployment on Coral’s Read-only policy (",
            { code: "readonly" },
            "). The FAQ answer on ",
            {
              a: "how much spare capacity is kept",
              href: "/coral-faq#how-much-spare-capacity-is-kept",
            },
            " advises this.",
          ],
        },
        {
          kind: "p",
          text: "A pause container uses almost no CPU or memory. So a policy with automation on would shrink the very requests that make up your headroom.",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "The Read-only policy." },
              " It gives recommendations only and never changes a workload. It’s also the one ",
              { a: "built-in policy", href: "/coral-guide#built-in-policies" },
              " that doesn’t manage Horizontal Pod Autoscalers (HPAs), so Coral won’t create an HPA for the Deployment. Pick it on the workload’s page, or name it in the workload’s annotation, as ",
              { a: "the Coral guide", href: "/coral-guide#per-workload-settings" },
              " shows.",
            ],
            [
              { b: "The namespace." },
              " A kube-system pod with no PDB is one of the common reasons Coral ",
              { a: "won’t empty a node", href: "/coral-guide#nodes-held" },
              ". That’s one more reason to give the placeholders a namespace of their own.",
            ],
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
      title: "Cluster Autoscaler not scaling down: what keeps nodes running",
      where: "Learn",
      href: "/learn/cluster-autoscaler-not-scaling-down",
    },
    {
      title: "Karpenter consolidation: policies, budgets and limits",
      where: "Learn",
      href: "/learn/karpenter-consolidation",
    },
  ],
};
