import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/kubernetes-overprovisioning/1";
import { figure as figure2 } from "@/features/learn/figures/kubernetes-overprovisioning/2";

export const article: Article = {
  slug: "kubernetes-overprovisioning",
  title: "Find overprovisioned pods with kubectl top pod",
  meta: "Kubernetes overprovisioning is CPU and memory your pods request but never use. Measure it with kubectl top pod and Prometheus, then reduce it.",
  h1: "Kubernetes overprovisioning",
  deck: "Find what your pods request but never use, with kubectl top pod and Prometheus, then reduce it safely.",
  card: "Requests above real use keep extra nodes running. Measure the gap with kubectl top pod, then reduce it.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes cost basics",
  published: "2026-11-01",
  updated: "2026-11-03",
  author: "swapnil",
  cover: "/learn-covers/zoorik-learn-kubernetes-overprovisioning-1200x630.webp",
  coverAlt:
    "Kubernetes overprovisioning: requested sits far above used, and the gap is booked, never used",
  short: [
    "Kubernetes overprovisioning is CPU and memory that containers request but don’t use. Nodes are added and kept for requests, not use, so the gap costs you nodes. Compare requests from ",
    { code: "kubectl describe nodes" },
    " with use from ",
    { code: "kubectl top pod" },
    " and a week of Prometheus history. Then set requests from measured use and let your autoscaler remove the nodes that empty.",
  ],
  sections: [
    {
      id: "kubernetes-overprovisioning",
      title: "What overprovisioning is",
      blocks: [
        {
          kind: "p",
          text: [
            "A container’s ",
            { a: "request", href: "/learn/glossary/kubernetes-resource-requests" },
            " is the CPU and memory Kubernetes sets aside for it on a node. CPU is counted in cores: 1 is one physical or virtual core, and 100m (100 millicpu) is a tenth of one. Memory is counted in bytes.",
          ],
        },
        {
          kind: "p",
          text: [
            "A request is a floor, not a ceiling. A container can use more when the node has room, up to its limit. At the limit, CPU is throttled, and memory use past it can end in an ",
            { a: "out-of-memory (OOM) kill", href: "/learn/oomkilled-exit-code-137" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "Some gap between request and use is deliberate, because a busy hour needs room. It becomes overprovisioning when the gap is far bigger than any peak, repeated on every container, and nobody chose its size.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "A Deployment runs 6\u00a0replicas, each requesting 1\u00a0CPU and using about 200m at its busiest. The scheduler books 6 × 1\u00a0CPU = 6\u00a0CPU. The pods use 6 × 200m = 1.2\u00a0CPU.",
        },
        {
          kind: "p",
          text: "No other pod can be scheduled into the remaining 6 − 1.2 = 4.8\u00a0CPU, 80% of what the Deployment books. Once the rest of the cluster is booked, the next pod that needs room makes your autoscaler add a node.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "h3",
          id: "the-deliberate-kind-placeholder-pods",
          title: "Deliberate overprovisioning",
        },
        {
          kind: "p",
          text: "The Kubernetes docs also use the word for a deliberate practice. Their task page “Overprovision Node Capacity For A Cluster” runs placeholder pods with a negative priority to reserve spare capacity. Real pods preempt them when they need room.",
        },
        {
          kind: "p",
          text: [
            "That headroom is sized once, on purpose. ",
            {
              a: "Cluster Autoscaler overprovisioning",
              href: "/learn/cluster-autoscaler-overprovisioning",
            },
            " shows how to set it up.",
          ],
        },
      ],
    },
    {
      id: "why-requests-not-use-set-your-cloud",
      title: "Why requests set the cost",
      blocks: [
        {
          kind: "p",
          text: [
            "On AKS and EKS, each node is a virtual machine. You pay for it while it runs, busy or idle. The ",
            { a: "EKS and AKS pricing calculator", href: "/eks-and-aks-pricing-calculator" },
            " shows what a node pool costs a month at list price.",
          ],
        },
        { kind: "h3", id: "placing-a-pod", title: "Placing a pod" },
        {
          kind: "p",
          text: [
            "The scheduler places a pod only where its requests, added to the requests already there, fit in the node’s ",
            { a: "allocatable capacity", href: "/learn/kubernetes-allocatable-vs-capacity" },
            ". Allocatable is what’s left for pods after the system daemons take their share.",
          ],
        },
        {
          kind: "p",
          text: "Low real use doesn’t change that. In the Kubernetes docs’ words, the scheduler “still refuses to place a Pod on a node if the capacity check fails.”",
        },
        { kind: "h3", id: "adding-a-node", title: "Adding a node" },
        {
          kind: "p",
          text: "Node autoscalers add capacity for requests that don’t fit, however idle the existing nodes are. The Cluster Autoscaler adds a node when a pod is unschedulable, for example because no node has room for its requests.",
        },
        {
          kind: "p",
          text: [
            "Karpenter sizes the new node from the pending pods’ requests. It also adds the requests of every ",
            { a: "DaemonSet", href: "/learn/glossary/daemonset" },
            " that would run on that node.",
          ],
        },
        { kind: "h3", id: "removing-a-node", title: "Removing a node" },
        {
          kind: "p",
          text: [
            "Removal follows requests too. The Cluster Autoscaler counts a node as unneeded only when its pods’ CPU and memory requests are both under 50% of its allocatable. That 50% is the default of ",
            { code: "--scale-down-utilization-threshold" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "So a node whose pods request 60% of its CPU stays, even if they use 5%. Every pod on a node must also fit somewhere else. After 10\u00a0minutes as unneeded (the ",
            { code: "--scale-down-unneeded-time" },
            " default), the node is removed.",
          ],
        },
        { kind: "svg", figure: figure2 },
      ],
    },
    {
      id: "where-the-extra-requests-come-from",
      title: "Where extra requests come from",
      blocks: [
        {
          kind: "p",
          text: "A request keeps its value until someone changes it. Extra requests usually start in one of these places:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "A limit with no request." },
              " If nothing sets a default at admission, Kubernetes copies the limit into the request. A ",
              { code: "cpu: 2" },
              " limit meant as a ceiling becomes a 2\u00a0CPU reservation.",
            ],
            [
              { b: "A namespace default." },
              " A ",
              { a: "LimitRange", href: "/learn/limitrange-vs-resourcequota" },
              " writes its default requests into every container that sets none. A default chosen for the largest service lands on the smallest one too.",
            ],
            [
              { b: "A request sized for a peak." },
              " A request set for a startup burst, a nightly batch or a load test reserves that much every other hour of the day.",
            ],
            [
              { b: "A request multiplied." },
              " Every replica carries the full request, and a DaemonSet puts a pod on every node it targets. A DaemonSet that requests 500m on 20\u00a0nodes books 10\u00a0CPU. By default, the Cluster Autoscaler counts DaemonSet pods when it judges whether a node is needed.",
            ],
          ],
        },
      ],
    },
    {
      id: "how-to-measure-the-gap-in-your",
      title: "How to measure the gap",
      blocks: [
        {
          kind: "h3",
          id: "1-see-what-one-nodes-pods-request",
          title: "1. Requests: kubectl describe nodes",
        },
        {
          kind: "p",
          text: [
            { code: "kubectl describe nodes" },
            " lists the CPU and memory requests of every pod on a node. Under “Allocated resources”, it also shows the totals as a percentage.",
          ],
        },
        { kind: "code", lang: "bash", code: "kubectl describe nodes <node-name>" },
        {
          kind: "h3",
          id: "2-see-what-they-use-now",
          title: "2. Use now: kubectl top pod",
        },
        {
          kind: "p",
          text: [
            { code: "kubectl top" },
            " reads the Metrics API, so your cluster needs ",
            { a: "Metrics Server", href: "/learn/glossary/metrics-server" },
            " or another adapter that serves it. CPU is an average over a short window. Memory is the working set at the moment of the reading. A new pod can show no figures for its first few minutes.",
          ],
        },
        {
          kind: "p",
          text: "Start with the node from step 1, and compare its use with its CPU and memory requests:",
        },
        { kind: "code", lang: "bash", code: "kubectl top node <node-name>" },
        { kind: "p", text: "Then see what each pod and container uses:" },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl top pod --containers --namespace <namespace>\nkubectl top pod -A --sort-by=cpu\nwatch kubectl top pod --namespace <namespace>",
        },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            { code: "kubectl top" },
            " gives a snapshot. A reading at 11:00 misses the nightly batch and the Monday peak. So a request that looks four times too big may be right for one hour a week.",
          ],
        },
        {
          kind: "h3",
          id: "3-read-a-week-of-history-in",
          title: "3. A week of use: Prometheus",
        },
        {
          kind: "p",
          text: [
            "kube-state-metrics exposes each container’s requests as ",
            { code: "kube_pod_container_resource_requests" },
            ". The kubelet exposes CPU time as ",
            { code: "container_cpu_usage_seconds_total" },
            " and memory as ",
            { code: "container_memory_working_set_bytes" },
            ". This query gives the share of its requested CPU that each namespace uses:",
          ],
        },
        {
          kind: "code",
          lang: "",
          code: 'sum by (namespace) (rate(container_cpu_usage_seconds_total{container!=""}[5m]))\n/\nsum by (namespace) (kube_pod_container_resource_requests{resource="cpu"})',
        },
        {
          kind: "p",
          text: "A result of 0.2 means the namespace uses a fifth of the CPU it books, like the Deployment above at its busiest. Graph it over at least a full week.",
        },
        {
          kind: "p",
          text: "For memory, compare the request with the highest working set in that window, not the average. A container that goes past its memory limit can be killed, not just slowed.",
        },
        {
          kind: "callout",
          label: "For engineers",
          text: [
            "Filtering on ",
            { code: 'container!=""' },
            " keeps only per-container series. The kube-state-metrics docs recommend the kube-scheduler’s ",
            { code: "kube_pod_resource_request" },
            " metric, from its ",
            { code: "/metrics/resources" },
            " endpoint, as more precise.",
          ],
        },
      ],
    },
    {
      id: "how-to-reduce-kubernetes-overprovisioning-safely",
      title: "How to reduce overprovisioning",
      blocks: [
        { kind: "p", text: "Work one workload at a time, in this order:" },
        {
          kind: "ol",
          items: [
            [
              { b: "Set requests from measured use." },
              " CPU can follow a high percentile of the week plus ",
              { a: "headroom", href: "/learn/glossary/kubernetes-headroom" },
              ", since a container short of CPU is slowed, not killed. Memory should follow the peak plus headroom, and limits stay as they are until you know why they were set. ",
              { a: "Setting requests from real use", href: "/learn/kubernetes-pod-right-sizing" },
              " covers how to pick the numbers.",
            ],
            [
              { b: "Give every limit-only container its own request." },
              " Check each namespace’s LimitRange defaults against what its workloads use.",
            ],
            [
              { b: "Check for a Horizontal Pod Autoscaler (HPA)." },
              " If one scales the workload on CPU, change the request with it in mind. ",
              { a: "HPA vs VPA", href: "/learn/vpa-vs-hpa" },
              " explains how the two interact.",
            ],
            {
              text: [
                { b: "Let the nodes go." },
                " A smaller request reduces nothing until a node empties and your autoscaler removes it. ",
                {
                  a: "Cluster Autoscaler not scaling down",
                  href: "/learn/cluster-autoscaler-not-scaling-down",
                },
                " covers what keeps a node. At upstream defaults, the usual blockers are:",
              ],
              blocks: [
                {
                  kind: "ul",
                  items: [
                    "A restrictive PodDisruptionBudget.",
                    "A kube-system pod that has no PodDisruptionBudget and doesn’t run on every node by default.",
                    "A pod with local storage.",
                    "A pod with no controller behind it.",
                    [
                      "A pod annotated ",
                      { code: 'cluster-autoscaler.kubernetes.io/safe-to-evict: "false"' },
                      ".",
                    ],
                    "A pod that fits on no other node.",
                    "A node group already at its minimum size.",
                  ],
                },
              ],
            },
            [
              { b: "Keep headroom on purpose." },
              " If you need warm capacity for sudden growth, size it once with placeholder pods instead of padding every request.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Across a whole cluster, the ",
            { a: "Kubernetes cost optimization guide", href: "/kubernetes-cost-optimization" },
            " takes the same order: requests first, then nodes.",
          ],
        },
      ],
    },
    {
      id: "how-coral-rebalances-requests-to-real-use",
      title: "Where Coral fits",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " rebalances requests to real use and removes the nodes you don’t need, without any downtime. It works on AKS and EKS, at Kubernetes 1.30 or later.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Requests." },
              " Coral sets each request from the container’s measured use, plus headroom. For a workload with a CPU-based HPA, it picks the CPU request by replaying past load through that HPA’s own settings.",
            ],
            [
              { b: "Opt-in." },
              " Pod sizing waits until you turn on “Automatically optimize” for a policy or a workload. Pods are sized as they start, so your manifests and Git stay as they are.",
            ],
            [
              { b: "Running pods." },
              " They are resized in place on Kubernetes 1.33+ nodes. Otherwise they are replaced one at a time, within their PodDisruptionBudgets.",
            ],
            [
              { b: "Limits and OOM kills." },
              " On the built-in policies, Coral never reduces a regular pod’s CPU or memory limit. After an OOM kill, it raises that container’s memory straight away.",
            ],
            [
              { b: "Nodes." },
              " Node optimization is on from install. It works out from requests how many nodes each pool needs and drains spare nodes one at a time. Pools that Karpenter or AKS node auto provisioning (NAP) already consolidate are left to them.",
            ],
            [
              { b: "Headroom." },
              " Coral keeps no idle spare nodes: the headroom sits inside each pod’s request. For warm spare capacity, run a low-priority placeholder deployment on the Read-only policy, as the FAQ on ",
              {
                a: "how much spare capacity is kept",
                href: "/coral-faq#how-much-spare-capacity-is-kept",
              },
              " explains.",
            ],
          ],
        },
        {
          kind: "h3",
          id: "what-coral-did-on-our-own-cluster",
          title: "On our own cluster",
        },
        {
          kind: "p",
          text: "We ran Coral on our own AKS development cluster first. On 6 October 2026, it removed a spare 4-CPU worker: $147.46 a month less.",
        },
        {
          kind: "p",
          text: "We switched workload optimization to automatic on 8 October. By 12 October, Coral had rebalanced the requests of 14 apps. Most reserved more than they used, and one needed more memory, which Coral gave it.",
        },
        {
          kind: "p",
          text: "The CPU the apps reserve went from 0.78\u00a0cores to 0.43, 45% less. Their memory went from 6.4\u00a0GiB to 5.4\u00a0GiB, 16% less.",
        },
        {
          kind: "p",
          text: [
            "On 12 October, Coral swapped the remaining worker for a cheaper machine of the same size: $66.43 a month less. Machine cost went from $368.65 to $154.76 a month at Azure pay-as-you-go list prices, as ",
            { a: "the Coral Value Lab study", href: "/coral-value-lab" },
            " shows. The whole $213.89 a month came from those two machine changes.",
          ],
        },
      ],
    },
  ],
  help: {
    product: "coral",
    text: "Coral rebalances CPU and memory requests on AKS and EKS, works with your HPA, and removes the nodes you don’t need. We estimate it takes 40–50% off AKS and EKS cost. It is an estimated range, not a promise. The free assessment works out your own figure.",
    links: [
      { label: "Kubernetes optimization with Coral", href: "/coral" },
      { label: "Estimate your saving", href: "/assessment?p=coral" },
    ],
  },
  sources: [
    {
      publisher: "Kubernetes",
      title: "“Resource Management for Pods and Containers”",
      url: "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/",
    },
    {
      publisher: "Kubernetes",
      title: "“Overprovision Node Capacity For A Cluster”",
      url: "https://kubernetes.io/docs/tasks/administer-cluster/node-overprovisioning/",
    },
    {
      publisher: "Kubernetes",
      title: "“Limit Ranges”",
      url: "https://kubernetes.io/docs/concepts/policy/limit-range/",
    },
    {
      publisher: "Kubernetes Cluster Autoscaler",
      title: "“Frequently Asked Questions”",
      url: "https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md",
    },
    {
      publisher: "Karpenter",
      title: "“Scheduling”",
      url: "https://karpenter.sh/docs/concepts/scheduling/",
    },
    {
      publisher: "Kubernetes",
      title: "“Resource metrics pipeline”",
      url: "https://kubernetes.io/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/",
    },
    {
      publisher: "Kubernetes",
      title: "“kubectl top node”",
      url: "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_top/kubectl_top_node/",
    },
    {
      publisher: "Kubernetes",
      title: "“kubectl top pod”",
      url: "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_top/kubectl_top_pod/",
    },
    {
      publisher: "kube-state-metrics",
      title: "“Pod Metrics”",
      url: "https://github.com/kubernetes/kube-state-metrics/blob/main/docs/metrics/workload/pod-metrics.md",
    },
    {
      publisher: "Kubernetes",
      title: "“Kubernetes Metrics Reference”",
      url: "https://kubernetes.io/docs/reference/instrumentation/metrics/",
    },
  ],
  related: [
    {
      title: "Kubernetes cost optimization",
      where: "Learn",
      href: "/kubernetes-cost-optimization",
    },
    {
      title: "Kubernetes requests vs limits",
      where: "Learn",
      href: "/learn/kubernetes-pod-right-sizing",
    },
    {
      title: "Cluster Autoscaler overprovisioning",
      where: "Learn",
      href: "/learn/cluster-autoscaler-overprovisioning",
    },
    {
      title: "Cluster Autoscaler not scaling down",
      where: "Learn",
      href: "/learn/cluster-autoscaler-not-scaling-down",
    },
    {
      title: "HPA vs VPA in Kubernetes",
      where: "Learn",
      href: "/learn/vpa-vs-hpa",
    },
  ],
};
