import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/kubernetes-overprovisioning/1";
import { figure as figure2 } from "@/features/learn/figures/kubernetes-overprovisioning/2";

export const article: Article = {
  slug: "kubernetes-overprovisioning",
  title: "Kubernetes requests vs usage: measure the gap",
  meta: "Kubernetes requests vs usage: the gap is Kubernetes overprovisioning, and idle nodes stay. Measure it with kubectl top pod and Prometheus, then reduce it.",
  h1: "Kubernetes requests vs usage: how to measure the gap",
  deck: "Pods that request more CPU and memory than they use keep nodes running. Why it happens, and how to reduce it.",
  card: "Requests set above real use keep nodes running at your cost. How to measure the gap and reduce it safely.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes cost basics",
  published: "2026-11-01",
  updated: "2026-11-01",
  author: "swapnil",
  cover: "/learn-covers/zoorik-learn-kubernetes-overprovisioning-1200x630.webp",
  coverAlt:
    "Kubernetes overprovisioning: requested sits far above used, and the gap is booked, never used",
  short:
    "Kubernetes overprovisioning means containers request more CPU and memory than they use, and node autoscalers keep nodes running for those requests. To reduce it, set requests from a week or more of measured use, then let your autoscaler remove the nodes that empty.",
  sections: [
    {
      id: "kubernetes-overprovisioning",
      title: "Kubernetes overprovisioning is requested capacity your containers never use",
      blocks: [
        {
          kind: "p",
          text: "Picture a Deployment of 6\u00a0replicas, each requesting 1\u00a0CPU and using about 200m, a fifth of that, at its busiest. You pay for all 6\u00a0CPU of node capacity.",
        },
        {
          kind: "p",
          text: [
            "A container’s ",
            { a: "request", href: "/learn/glossary/kubernetes-resource-requests" },
            " is the CPU and memory Kubernetes sets aside for it on a node. CPU is counted in cores, so 1 is one physical or virtual core and 100m (100 millicpu) is a tenth of one. Memory is measured in bytes.",
          ],
        },
        {
          kind: "p",
          text: [
            "A request is a floor, not a ceiling. A container can use more when the node has room, up to its limit. At the limit, CPU is throttled, and memory use past the limit can end in an ",
            { a: "out-of-memory (OOM) kill", href: "/learn/oomkilled-exit-code-137" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "Kubernetes overprovisioning, which you’ll also see written as Kubernetes over provisioning, is the part of a request the container never uses. Some gap is deliberate, because a busy hour needs room. It becomes overprovisioning when the gap is far bigger than any peak, repeated on every container, and nobody chose its size.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "For the Deployment above, the scheduler books 6 × 1\u00a0CPU = 6\u00a0CPU. At their busiest, its pods use 6 × 200m = 1.2\u00a0CPU.",
        },
        {
          kind: "p",
          text: "No other pod can be scheduled into the remaining 6 − 1.2 = 4.8\u00a0CPU, 80% of what the Deployment books. Once the rest of the cluster is booked, the next pod that needs room makes your autoscaler add a node.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "h3",
          id: "the-deliberate-kind-placeholder-pods",
          title: "The deliberate kind: placeholder pods",
        },
        {
          kind: "p",
          text: "The Kubernetes documentation uses the same word for a different, deliberate practice. Its task page “Overprovision Node Capacity For A Cluster” runs placeholder pods with a negative priority to reserve spare capacity. Real pods preempt them when they need room.",
        },
        {
          kind: "p",
          text: [
            "That headroom is sized on purpose, in one place, and ",
            {
              a: "Cluster Autoscaler overprovisioning with placeholder pods",
              href: "/learn/cluster-autoscaler-overprovisioning",
            },
            " covers it. This page is about the accidental kind, spread across every container’s requests.",
          ],
        },
      ],
    },
    {
      id: "why-requests-not-use-set-your-cloud",
      title: "Why requests, not use, set your cloud cost",
      blocks: [
        {
          kind: "p",
          text: [
            "On AKS and EKS, each node in a node pool or node group is a virtual machine. You pay for it while it runs, busy or idle. The ",
            { a: "EKS and AKS pricing calculator", href: "/eks-and-aks-pricing-calculator" },
            " shows what a node pool costs a month at list price.",
          ],
        },
        {
          kind: "p",
          text: "Requests decide how many nodes you buy, at three points: placing a pod, adding a node and removing one.",
        },
        { kind: "h3", id: "placing-a-pod", title: "Placing a pod" },
        {
          kind: "p",
          text: [
            "The scheduler puts a pod on a node only if the pod fits in the node’s ",
            { a: "allocatable capacity", href: "/learn/kubernetes-allocatable-vs-capacity" },
            ". That check adds the new pod’s requests to the requests already there. Allocatable is what’s left for pods after the system daemons take their share.",
          ],
        },
        {
          kind: "p",
          text: "Low real use on the node doesn’t change that. In the Kubernetes docs’ words, the scheduler “still refuses to place a Pod on a node if the capacity check fails.”",
        },
        { kind: "h3", id: "adding-a-node", title: "Adding a node" },
        {
          kind: "p",
          text: "Node autoscalers buy capacity for requests that don’t fit, however idle the existing nodes are. The Cluster Autoscaler adds a node when a pod is unschedulable, for example because no node has room for its requests.",
        },
        {
          kind: "p",
          text: [
            "Karpenter picks an instance type large enough for the pending pods’ requests. It also counts the requests of every ",
            { a: "DaemonSet", href: "/learn/glossary/daemonset" },
            " that would run on the new node.",
          ],
        },
        { kind: "h3", id: "removing-a-node", title: "Removing a node" },
        {
          kind: "p",
          text: "Removal follows requests too. A node whose pods request 60% of its CPU stays, even if they use 5% of it.",
        },
        {
          kind: "p",
          text: [
            "The Cluster Autoscaler checks requests, not use. A node is unneeded only when its pods’ CPU and memory requests are both under 50% of its allocatable (the default ",
            { code: "--scale-down-utilization-threshold" },
            " of 0.5). Every pod on it must also be able to run somewhere else.",
          ],
        },
        {
          kind: "p",
          text: [
            "Once a node has stayed unneeded for more than 10\u00a0minutes (the ",
            { code: "--scale-down-unneeded-time" },
            " default), the autoscaler removes it.",
          ],
        },
        { kind: "svg", figure: figure2 },
      ],
    },
    {
      id: "where-the-extra-requests-come-from",
      title: "Where the extra requests come from",
      blocks: [
        {
          kind: "p",
          text: "A request keeps its value until someone changes it. Extra requests often start in one of these places:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "A container sets a limit but no request." },
              " If nothing applies a default at admission, Kubernetes copies the limit and uses it as the request. A ",
              { code: "cpu: 2" },
              " limit meant as a ceiling then becomes a 2\u00a0CPU reservation.",
            ],
            [
              { b: "The namespace has a LimitRange with default requests." },
              " Its admission controller writes them into every container that sets none. A default chosen for the largest service lands on the smallest one too.",
            ],
            [
              { b: "The request was sized for a peak." },
              " A request set for a startup burst, a nightly batch or a load test reserves that much for every other hour of the day.",
            ],
            [
              { b: "The request is multiplied." },
              " Every replica carries the full request, and a DaemonSet puts its pod on every node it targets. A DaemonSet that requests 500m on 20\u00a0nodes books 10\u00a0CPU. The Cluster Autoscaler counts DaemonSet pods in a node’s utilization by default.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "VMs sized for the expected peak instead of measured demand cost more the same way, as ",
            {
              a: "how poor architecture increases your cloud cost",
              href: "/learn/poor-architecture-cloud-bill",
            },
            " shows.",
          ],
        },
      ],
    },
    {
      id: "how-to-measure-the-gap-in-your",
      title: "How to measure the gap in your cluster",
      blocks: [
        {
          kind: "h3",
          id: "1-see-what-one-nodes-pods-request",
          title: "1. See what one node’s pods request",
        },
        {
          kind: "p",
          text: [
            { code: "kubectl describe nodes" },
            " lists the CPU and memory requests of every pod on the node. Under “Allocated resources”, it also shows the totals as a percentage.",
          ],
        },
        { kind: "code", lang: "bash", code: "kubectl describe nodes <node-name>" },
        {
          kind: "h3",
          id: "2-see-what-they-use-now",
          title: "2. See what they use now with kubectl top pod",
        },
        {
          kind: "p",
          text: [
            { code: "kubectl top" },
            " reads the Metrics API and shows what each container uses:",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl top pod --containers --namespace <namespace>",
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
          title: "3. Read a week of history in Prometheus",
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
          text: "A result of 0.2 means the namespace uses a fifth of the CPU it books, like the Worked example’s Deployment at its busiest. Graph it over at least a full week.",
        },
        {
          kind: "p",
          text: "For memory, compare the request with the highest working set in that window, not the average. Memory needs the peak because a container that goes past its memory limit can be killed rather than slowed.",
        },
        {
          kind: "callout",
          label: "For engineers",
          text: [
            "Filtering on ",
            { code: 'container!=""' },
            " keeps only per-container series. The kube-state-metrics docs now recommend the kube-scheduler’s ",
            { code: "kube_pod_resource_request" },
            " metric as more precise.",
          ],
        },
        {
          kind: "p",
          text: [
            "That metric also counts pod-level resources (beta since 1.34). Use it if your Prometheus scrapes the scheduler’s ",
            { code: "/metrics/resources" },
            " endpoint.",
          ],
        },
      ],
    },
    {
      id: "how-to-reduce-kubernetes-overprovisioning-safely",
      title: "How to reduce Kubernetes overprovisioning safely",
      blocks: [
        { kind: "p", text: "Work in this order, one workload at a time:" },
        {
          kind: "ol",
          items: [
            [
              { b: "Set requests from measured use." },
              " CPU can follow a high percentile of the measured window plus ",
              { a: "headroom", href: "/learn/glossary/kubernetes-headroom" },
              ", since a container short of CPU is slowed, not killed. Memory should follow the peak plus headroom. ",
              { a: "Kubernetes pod right sizing", href: "/learn/kubernetes-pod-right-sizing" },
              " covers how to pick the numbers and how requests and limits differ. Leave limits alone until you know why they were set.",
            ],
            [
              { b: "Give every container that has only a limit a request of its own." },
              " Check each namespace’s LimitRange defaults against what its workloads use.",
            ],
            [
              { b: "Check for a Horizontal Pod Autoscaler (HPA)." },
              " If one scales the workload on CPU, change the request with it in mind. ",
              { a: "VPA vs HPA", href: "/learn/vpa-vs-hpa" },
              " explains how the two autoscalers interact and why requests come first.",
            ],
            {
              text: [
                { b: "Let the nodes go." },
                " A smaller request reduces nothing until a node empties and your autoscaler removes it. ",
                {
                  a: "Cluster Autoscaler not scaling down",
                  href: "/learn/cluster-autoscaler-not-scaling-down",
                },
                " walks through what keeps a node. At upstream defaults, the usual blockers are:",
              ],
              blocks: [
                {
                  kind: "ul",
                  items: [
                    "A restrictive PodDisruptionBudget.",
                    "A kube-system pod that has no PodDisruptionBudget and doesn’t run on every node by default.",
                    "A pod with local storage.",
                    "A pod with no controller behind it.",
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
      title: "How Coral rebalances requests to real use",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral optimizes Kubernetes", href: "/coral" },
            " on AKS and EKS clusters running Kubernetes 1.30 or later, and does steps 1 and 4 for you. It rebalances each container’s CPU and memory requests to what it uses. Then it drains the nodes this frees so your autoscaler can remove them.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Sizing." },
              " Coral sets each request from the container’s measured use, plus headroom. For a workload with a CPU-based HPA, Coral instead picks its CPU request by replaying past load through that HPA’s own settings.",
            ],
            [
              { b: "Opt-in." },
              " Nothing is resized until you switch on “Automatically optimize” for a policy or a workload. Coral sizes pods as they start, so your manifests and Git stay as they are. Where possible, running pods are resized in place on nodes at Kubernetes 1.33 or later. Otherwise Coral restarts them one at a time within their PodDisruptionBudgets.",
            ],
            [
              { b: "Limits and OOM kills." },
              " On the built-in policies, Coral never reduces the CPU or memory limit of a regular pod. With automation on, an OOM kill raises that container’s memory request straight away, up to a cap. A memory limit, where there is one, rises with it.",
            ],
            [
              { b: "Spare nodes." },
              " Node optimization is on from install and uses pod requests to work out how many nodes each pool needs. It checks on the live cluster that every pod on a node fits on another Ready node. It then cordons and drains one node at a time for your Cluster Autoscaler, Karpenter or AKS node auto provisioning (NAP) to remove.",
            ],
            [
              { b: "What it leaves alone." },
              " Pools that Karpenter or NAP already consolidates are left to them, and Coral never creates machines itself. When a node is removed, a pod whose replacement can’t start first gets a short restart.",
            ],
            [
              { b: "Headroom." },
              " Coral keeps no idle spare nodes, and the headroom sits inside each pod’s request. To keep warm spare capacity, run a low-priority placeholder deployment. Put it on the Read-only policy so Coral doesn’t shrink it, as the FAQ answer on ",
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
          title: "What Coral did on our own cluster",
        },
        {
          kind: "p",
          text: "We ran Coral on our own AKS development cluster first. On 6 October it removed a spare 4-CPU worker, $147.46 a month less.",
        },
        {
          kind: "p",
          text: "We switched workload optimization to automatic on 8 October. By 12 October, Coral had rebalanced the requests of 14 apps. Most reserved more than they used, and one needed more memory, which Coral gave it.",
        },
        {
          kind: "p",
          text: "The CPU the apps reserve went from 0.78\u00a0cores to 0.43, which is 45% less. Memory went from 6.4\u00a0GiB to 5.4\u00a0GiB, 16% less.",
        },
        {
          kind: "p",
          text: "On 12 October, with one click, Coral swapped the remaining worker for a cheaper machine of the same size, $66.43 a month less. The monthly machine cost went from $368.65 to $154.76 at Azure pay-as-you-go list prices.",
        },
        {
          kind: "p",
          text: [
            "All $213.89 of that monthly reduction came from one machine removed and one swapped for a cheaper one, as ",
            { a: "the Coral Value Lab study", href: "/coral-value-lab" },
            " shows.",
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
      title: "Kubernetes cost optimization: rebalance requests, then remove spare nodes",
      where: "Learn",
      href: "/kubernetes-cost-optimization",
    },
    {
      title: "Kubernetes pod right sizing: set requests from real use",
      where: "Learn",
      href: "/learn/kubernetes-pod-right-sizing",
    },
    {
      title: "Cluster Autoscaler overprovisioning with placeholder pods",
      where: "Learn",
      href: "/learn/cluster-autoscaler-overprovisioning",
    },
    {
      title: "Cluster Autoscaler not scaling down: what keeps nodes running",
      where: "Learn",
      href: "/learn/cluster-autoscaler-not-scaling-down",
    },
    {
      title: "VPA vs HPA: when to use which",
      where: "Learn",
      href: "/learn/vpa-vs-hpa",
    },
  ],
};
