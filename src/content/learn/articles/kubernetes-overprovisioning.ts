import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/kubernetes-overprovisioning/1";

export const article: Article = {
  slug: "kubernetes-overprovisioning",
  title: "Kubernetes overprovisioning: how to measure it",
  meta: "Kubernetes overprovisioning is requests set above real use. The scheduler and autoscalers count requests, so idle nodes stay. How to measure and reduce it.",
  h1: "Kubernetes overprovisioning: what it is and how to measure it",
  deck: "Pods that request more CPU and memory than they use keep nodes running. Why it happens, and how to reduce it.",
  card: "Requests set above real use keep nodes on your bill. How to measure the gap and reduce it safely.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes cost basics",
  published: "2026-11-01",
  updated: "2026-11-01",
  author: "swapnil",
  short:
    "Kubernetes overprovisioning means containers request more CPU and memory than they use. The scheduler places pods by their requests, and the Cluster Autoscaler and Karpenter size the cluster by the same requests, so you keep paying for nodes that hold capacity nobody uses. To reduce it, set requests from measured use over a week or more, then let your autoscaler remove the nodes that empty.",
  sections: [
    {
      id: "what-overprovisioning-means-in-kubernetes",
      title: "What overprovisioning means in Kubernetes",
      blocks: [
        {
          kind: "p",
          text: [
            "A container’s request is the CPU and memory Kubernetes sets aside for it on a node. CPU is counted in cores, so 1 is one physical or virtual core and 100m (100 millicpu) is a tenth of one. Memory is measured in bytes. A request is a floor, not a ceiling: a container can use more when the node has room, up to its limit, where CPU is throttled and memory use past the limit can end in an ",
            { a: "out-of-memory (OOM) kill", href: "/learn/oomkilled-exit-code-137" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "Kubernetes overprovisioning, which you’ll also see written as Kubernetes over provisioning, is the part of a request the container never uses. A container that requests 1\u00a0CPU and peaks at 150m holds 850m that no other pod can be scheduled into. Some gap is deliberate, because a busy hour needs room. It becomes overprovisioning when the gap is far bigger than any peak, repeated on every container, and nobody chose its size.",
        },
        {
          kind: "p",
          text: [
            "The Kubernetes documentation uses the same word for a different, deliberate practice. Its task page “Overprovision Node Capacity For A Cluster” runs placeholder pods with a negative priority to reserve spare capacity, and real pods preempt them when they need the room. That headroom is sized on purpose, in one place, and ",
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
      id: "why-requests-not-use-set-your-bill",
      title: "Why requests, not use, set your bill",
      blocks: [
        {
          kind: "p",
          text: [
            "The scheduler puts a pod on a node only if the requests already there, plus the new pod’s, fit in the node’s ",
            { a: "allocatable capacity", href: "/learn/kubernetes-allocatable-vs-capacity" },
            ": what’s left for pods after the system daemons take their share. Use doesn’t enter the check. Even when real CPU and memory use on a node is very low, the Kubernetes docs say, the scheduler “still refuses to place a Pod on a node if the capacity check fails.”",
          ],
        },
        {
          kind: "p",
          text: "Node autoscalers count the same way. The Cluster Autoscaler adds a node when a pod is unschedulable, for example because no node has room left for its requests. Karpenter picks an instance type large enough for the pending pods’ requests plus the requests of every DaemonSet that would run on the new node. Both buy capacity for requests that don’t fit, however idle the existing nodes are.",
        },
        {
          kind: "p",
          text: [
            "Removal follows requests too. The Cluster Autoscaler counts a node as unneeded only when its pods’ CPU requests and memory requests are both under 50% of its allocatable (the default ",
            { code: "--scale-down-utilization-threshold" },
            " of 0.5) and every pod on it can run somewhere else. It removes the node once it has stayed unneeded for more than 10\u00a0minutes (the default ",
            { code: "--scale-down-unneeded-time" },
            "). A node whose pods request 60% of its CPU stays, even if they use 5% of it.",
          ],
        },
        {
          kind: "p",
          text: "On AKS and EKS, each node in a node pool or node group is a virtual machine you pay for while it runs, busy or idle. So the requests decide how many machines you buy.",
        },
        {
          kind: "p",
          text: "Take a Deployment of 6\u00a0replicas, each requesting 1\u00a0CPU and using about 200m at its busiest. Its pods use 1.2\u00a0CPU, but the scheduler books 6. No other pod can be scheduled into the remaining 4.8, so once the rest of the cluster is booked, the next pod that needs room makes your autoscaler add a node.",
        },
        { kind: "diagram", figure: figure1 },
      ],
    },
    {
      id: "where-the-extra-requests-come-from",
      title: "Where the extra requests come from",
      blocks: [
        {
          kind: "p",
          text: "A request keeps its value until someone changes it, and that value often comes from one of these places:",
        },
        {
          kind: "ul",
          items: [
            [
              "A container sets a limit but no request. If nothing applies a default at admission, Kubernetes copies the limit and uses it as the request, so a ",
              { code: "cpu: 2" },
              " limit meant as a ceiling becomes a 2\u00a0CPU reservation.",
            ],
            "The namespace has a LimitRange with default requests. Its admission controller writes them into every container that sets none, so a default chosen for the largest service lands on the smallest one too.",
            "The request was sized for a peak. A request set for a startup burst, a nightly batch or a load test reserves that much for every other hour of the day.",
            "The request is multiplied. Every replica carries the full request, and a DaemonSet puts its pod on every node it targets, so a DaemonSet that requests 500m on 20\u00a0nodes books 10\u00a0CPU. The Cluster Autoscaler counts DaemonSet pods in a node’s utilization by default.",
          ],
        },
        {
          kind: "p",
          text: [
            "Sizing for the expected peak instead of measured demand raises VM bills as well, and ",
            {
              a: "how poor architecture increases your cloud bill",
              href: "/learn/poor-architecture-cloud-bill",
            },
            " covers that side.",
          ],
        },
      ],
    },
    {
      id: "how-to-measure-the-gap-in-your",
      title: "How to measure the gap in your cluster",
      blocks: [
        {
          kind: "p",
          text: [
            "Start with one node. ",
            { code: "kubectl describe nodes" },
            " lists the CPU and memory requests of every pod on the node and, under “Allocated resources”, the totals as a percentage.",
          ],
        },
        { kind: "code", lang: "bash", code: "kubectl describe nodes <node-name>" },
        {
          kind: "p",
          text: [
            "Then look at use. ",
            { code: "kubectl top" },
            " reads the Metrics API and shows what each container uses now:",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl top pod --containers --namespace <namespace>",
        },
        {
          kind: "p",
          text: "A snapshot is the weak part. A reading at 11:00 misses the nightly batch and the Monday peak, so a request that looks four times too big may be right for one hour a week.",
        },
        {
          kind: "p",
          text: [
            "For history, use Prometheus. kube-state-metrics exposes each container’s requests as ",
            { code: "kube_pod_container_resource_requests" },
            ", and the kubelet exposes CPU time as ",
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
          text: [
            "The ",
            { code: 'container!=""' },
            " filter keeps only per-container series. The kube-state-metrics docs now recommend the kube-scheduler’s ",
            { code: "kube_pod_resource_request" },
            " metric as more precise, because it also counts pod-level resources (beta since 1.34), so use it if your Prometheus scrapes the scheduler’s ",
            { code: "/metrics/resources" },
            " endpoint. A result of 0.2 means the namespace uses a fifth of the CPU it books. Graph it over at least a full week. For memory, compare the request with the highest working set in that window, not the average, because a container that goes past its memory limit can be killed rather than slowed.",
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
              "Set requests from measured use. CPU can follow a high percentile of the measured window plus headroom, since a container short of CPU is slowed, not killed. Memory should follow the peak plus headroom. ",
              { a: "Kubernetes pod right sizing", href: "/learn/kubernetes-pod-right-sizing" },
              " covers how to pick the numbers and how requests and limits differ. Leave limits alone until you know why they were set.",
            ],
            "Give every container that has only a limit a request of its own, and check each namespace’s LimitRange defaults against what its workloads use.",
            [
              "If an HPA scales the workload on CPU, change the request with the HPA in mind. ",
              { a: "VPA vs HPA", href: "/learn/vpa-vs-hpa" },
              " explains how the two interact and why requests come first.",
            ],
            [
              "Let the nodes go. A smaller request reduces nothing until a node empties and your autoscaler removes it. When a node stays, the Cluster Autoscaler’s usual blockers, at upstream defaults, are a restrictive PodDisruptionBudget, a kube-system pod without one that doesn’t run on every node by default, a pod with local storage, a pod with no controller behind it, a pod that fits on no other node, or a node group already at its minimum size. ",
              {
                a: "Cluster Autoscaler not scaling down",
                href: "/learn/cluster-autoscaler-not-scaling-down",
              },
              " walks through each.",
            ],
            "Keep headroom on purpose. If you need warm capacity for sudden growth, size it once with placeholder pods instead of padding every request.",
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
            " on AKS and EKS clusters running Kubernetes 1.30 or later. It does steps 1 and 4 for you: it rebalances each container’s CPU and memory requests to what it uses, and drains the nodes this frees so your autoscaler can remove them.",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Sizing." },
              " On the default balanced policy, the CPU request is the 80th percentile of the last 3\u00a0days plus 10%, and memory is the 8-day peak plus 10%. For a workload with a CPU-based HPA, Coral picks the CPU request instead by replaying past load through that HPA’s own settings. A first recommendation appears within the first hour. It is trusted after 24\u00a0hours of data.",
            ],
            [
              { b: "Opt-in." },
              " Nothing is resized until you switch on “Automatically optimize” for a policy or a workload. Your manifests and Git stay as they are, because a webhook sizes pods as they start. Running pods are resized in place where possible on nodes at Kubernetes 1.33 or later, and otherwise restarted one at a time within their PodDisruptionBudgets.",
            ],
            [
              { b: "Limits and OOM kills." },
              " On the built-in policies, Coral never reduces the CPU or memory limit of a regular pod. With automation on, each counted OOM kill raises that container’s memory request straight away by 20% of its base size, or 100\u00a0MiB if that is more, up to 2.5 times the base, and a memory limit, where there is one, rises with it.",
            ],
            [
              { b: "Spare nodes." },
              " Node optimization is on from install and uses pod requests to work out how many nodes each pool needs. It checks on the live cluster that every pod on a node fits on another Ready node, then cordons and drains one node at a time for your Cluster Autoscaler, NAP or Karpenter to remove. Pools that Karpenter or NAP already consolidates are left to them, and Coral never creates machines itself. When a node is removed, a pod whose replacement can’t start first gets a short restart.",
            ],
            [
              { b: "Headroom." },
              " Coral keeps no idle spare nodes, and the headroom sits inside each pod’s request. To keep warm spare capacity, run a low-priority placeholder deployment and put it on the Read-only policy so Coral doesn’t shrink it, as the FAQ answer on ",
              {
                a: "how much spare capacity is kept",
                href: "/coral/faq#how-much-spare-capacity-is-kept",
              },
              " explains.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "We ran Coral on our own AKS development cluster first, and on 6 October it removed a spare 4-CPU worker, $147.46 a month less. We switched workload optimization to automatic on 8 October. By 12 October Coral had rebalanced the requests of 14 apps. Most reserved more than they used, and one needed more memory, which Coral gave it. The CPU the apps reserve went from 0.78\u00a0cores to 0.43, which is 45% less, and memory went from 6.4\u00a0GiB to 5.4\u00a0GiB, 16% less. On 12 October, with one click, Coral swapped the remaining worker for a cheaper machine of the same size, $66.43 a month less. The machine bill went from $368.65 to $154.76 a month at Azure pay-as-you-go list prices, as ",
            { a: "the case study", href: "/case-studies/coral-dev-cluster" },
            " shows. All $213.89 of that monthly reduction came from one machine removed and one swapped for a cheaper one.",
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
      title: "How to reduce Kubernetes cost: rebalance requests, then remove spare nodes",
      where: "Learn",
      href: "/learn/reduce-kubernetes-cost",
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
      title: "How much spare capacity is kept for sudden workload growth?",
      where: "Coral FAQ",
      href: "/coral/faq#how-much-spare-capacity-is-kept",
    },
    {
      title: "How we reduced our own cluster’s machine bill by 58%",
      where: "Case study",
      href: "/case-studies/coral-dev-cluster",
    },
  ],
};
