import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/in-place-pod-resize/1";
import { figure as figure2 } from "@/features/learn/figures/in-place-pod-resize/2";
import { figure as figure3 } from "@/features/learn/figures/in-place-pod-resize/3";

export const article: Article = {
  slug: "in-place-pod-resize",
  title: "In-place pod resize (InPlacePodVerticalScaling)",
  meta: "In-place pod resize changes a running pod’s CPU and memory without recreating it. Versions, resizePolicy, kubectl steps, the VPA, AKS and EKS.",
  h1: "In-place pod resize in Kubernetes",
  deck: "Change a running pod’s CPU and memory without recreating it, on Kubernetes 1.33 and later.",
  card: "Change a running pod’s CPU and memory without recreating it, from Kubernetes 1.33.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes cost basics",
  published: "2026-11-01",
  updated: "2026-11-03",
  author: "aditya",
  cover: "/learn-covers/zoorik-learn-in-place-pod-resize-1200x630.webp",
  coverAlt: "CPU and memory change inside a running pod, with no restart",
  short: [
    "Patch the pod’s ",
    { code: "resize" },
    " subresource with new CPU or memory requests and limits. The kubelet applies them to the running container, on the same node. Each container’s ",
    { code: "resizePolicy" },
    " decides whether that restarts it. The feature is on by default from Kubernetes 1.33 and stable from 1.35.",
  ],
  sections: [
    {
      id: "in-place-pod-resize",
      title: "How it works",
      blocks: [
        {
          kind: "p",
          text: "Before in-place resize, a container’s CPU and memory were fixed for its pod’s life. You changed them in the Pod template of its Deployment or StatefulSet, and the controller replaced each pod. That still works on every version and can change any field.",
        },
        {
          kind: "p",
          text: "In-place pod resize, also called in-place pod vertical scaling, patches the running pod instead. Say a Burstable pod’s container requests 1\u00a0CPU and you want 300m. With the default resize policy, the container keeps running on the same node at 300m.",
        },
        {
          kind: "h3",
          id: "podresizepending-deferred-or-infeasible",
          title: "PodResizePending: Deferred or Infeasible",
        },
        {
          kind: "p",
          text: [
            "A container’s ",
            { code: "spec.containers[*].resources" },
            " is the size you want. Its ",
            { code: "status.containerStatuses[*].resources" },
            " is the size the node applied. When they differ, the kubelet tries the new size and reports a pod condition:",
          ],
        },
        {
          kind: "table",
          columns: [
            { label: "Condition", width: "16%" },
            { label: "Reason", width: "14%" },
            { label: "What it means", width: "70%" },
          ],
          rows: [
            [
              [{ code: "PodResizeInProgress" }],
              ["none, or ", { code: "Error" }],
              "The kubelet accepted and allocated the new size and is still applying it",
            ],
            [
              [{ code: "PodResizePending" }],
              [{ code: "Deferred" }],
              "The new size doesn’t fit now but might later, for example once another pod leaves. The kubelet retries",
            ],
            [
              [{ code: "PodResizePending" }],
              [{ code: "Infeasible" }],
              "The new size can never fit this node, for example a request larger than the node itself",
            ],
          ],
        },
        { kind: "svg", figure: figure1 },
        { kind: "p", text: "Deferred resizes are retried in this order:" },
        {
          kind: "ul",
          items: [
            "higher PriorityClass first",
            "then Guaranteed pods before Burstable ones",
            "then the longest wait",
          ],
        },
        {
          kind: "p",
          text: [
            "Kubernetes 1.37 adds ",
            { code: "InPlacePodVerticalScalingSchedulerPreemption" },
            ", an alpha gate that is off by default. With it, the scheduler can evict lower-priority pods to make room for a deferred resize. Without it, the resize waits.",
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "A resize changes one Pod, not its Deployment or StatefulSet. A pod created later, after a rollout, an eviction or a drain, starts at the template’s old size.",
        },
      ],
    },
    {
      id: "a-resize-frees-room-on-a-node",
      title: "What a resize saves",
      blocks: [
        {
          kind: "p",
          text: "For cost, the request matters. The scheduler places a pod only while the requests on a node add up to less than its capacity, however low real use is.",
        },
        {
          kind: "p",
          text: "A smaller request frees room only once the kubelet applies it. While a resize is pending or unfinished, the scheduler counts the largest of the container’s desired, allocated and actual requests.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "Take the pod above, patched from 1\u00a0CPU to 300m. The scheduler counts 1\u00a0CPU until the kubelet applies the change, then 300m. That leaves 700m of the node free for other pods.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: "A resize never moves a pod, so it can’t empty a node by itself. The freed room reduces cost only when a node can then be removed.",
        },
        {
          kind: "p",
          text: [
            "Choosing the new size means ",
            { a: "setting requests from real use", href: "/learn/kubernetes-pod-right-sizing" },
            ". The ",
            { a: "Kubernetes cost optimization guide", href: "/kubernetes-cost-optimization" },
            " takes both steps in order: requests first, then nodes.",
          ],
        },
      ],
    },
    {
      id: "which-kubernetes-versions-support-in-place-resize",
      title: "Supported versions",
      blocks: [
        {
          kind: "p",
          text: [
            "The feature was alpha from Kubernetes 1.27, behind the ",
            { code: "InPlacePodVerticalScaling" },
            " feature gate and off by default. It became beta and on by default in 1.33, then stable in 1.35, where the gate can’t turn it off.",
          ],
        },
        { kind: "p", text: "Three versions decide:" },
        {
          kind: "ol",
          items: [
            [{ b: "The control plane," }, " at 1.33 or later."],
            [{ b: "The node the pod runs on," }, " whose kubelet applies the change."],
            [
              { b: "kubectl," },
              " at 1.32 or later, for the ",
              { code: "--subresource resize" },
              " flag.",
            ],
          ],
        },
      ],
    },
    {
      id: "how-to-resize-a-kubernetes-pod-without",
      title: "How to resize a pod",
      blocks: [
        {
          kind: "p",
          text: [
            "Each container’s ",
            { code: "resizePolicy" },
            " sets, per resource, whether a resize restarts the container:",
          ],
        },
        {
          kind: "code",
          lang: "yaml",
          code: "resizePolicy:\n- resourceName: cpu\n  restartPolicy: NotRequired\n- resourceName: memory\n  restartPolicy: RestartContainer",
        },
        {
          kind: "p",
          text: [
            { code: "NotRequired" },
            ", the default, changes the running container. ",
            { code: "RestartContainer" },
            " applies the change with a restart. A pod whose ",
            { code: "restartPolicy" },
            " is ",
            { code: "Never" },
            " can use only ",
            { code: "NotRequired" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "In the example above, a CPU change applies in place. A memory change, or a change to both, restarts the container.",
        },
        {
          kind: "p",
          text: [
            "Set memory to ",
            { code: "RestartContainer" },
            " for Java and Python services. The 1.35 announcement says neither runtime can resize memory without a restart.",
          ],
        },
        {
          kind: "callout",
          label: "For engineers",
          text: [
            "From 1.35, with memory on ",
            { code: "NotRequired" },
            ", a smaller memory limit applies without a restart, but only while use is below it. The kubelet’s check, made to avoid an ",
            { a: "out-of-memory kill", href: "/learn/oomkilled-exit-code-137" },
            ", is “best-effort and not guaranteed,” in the announcement’s words. If use is above the new limit, the resize stays in progress.",
          ],
        },
        { kind: "h3", id: "resize-a-pod-with-kubectl", title: "With kubectl" },
        {
          kind: "ol",
          items: [
            {
              text: [
                { b: "Patch the pod’s resize subresource." },
                " ",
                { code: "kubectl edit" },
                " or a server-side ",
                { code: "kubectl apply" },
                " with ",
                { code: "--subresource resize" },
                " also works. This patch sets one container’s CPU request to 300m on a Burstable pod:",
              ],
              blocks: [
                {
                  kind: "code",
                  lang: "bash",
                  code: 'kubectl patch pod <pod> -n <namespace> --subresource resize --patch \\\n  \'{"spec":{"containers":[{"name":"<container>","resources":{"requests":{"cpu":"300m"}}}]}}\'',
                },
              ],
            },
            {
              text: [{ b: "Read the pod back." }],
              blocks: [
                {
                  kind: "code",
                  lang: "bash",
                  code: "kubectl get pod <pod> -n <namespace> -o yaml",
                },
              ],
            },
            [
              { b: "Check three fields." },
              " Read ",
              { code: "status.containerStatuses[].resources" },
              " for the applied values, ",
              { code: "restartCount" },
              " for a restart, and the ",
              { code: "reason" },
              " and ",
              { code: "message" },
              " of any ",
              { code: "PodResizePending" },
              " or ",
              { code: "PodResizeInProgress" },
              " condition.",
            ],
            [
              { b: "Change memory one replica at a time" },
              " if memory is set to ",
              { code: "RestartContainer" },
              ". Patching every replica together restarts that container in all of them at once.",
            ],
          ],
        },
        {
          kind: "h3",
          id: "vpa-in-place-pod-resize-with-eviction",
          title: "With the VPA",
        },
        {
          kind: "p",
          text: [
            "In the Vertical Pod Autoscaler (VPA), the ",
            { code: "InPlaceOrRecreate" },
            " update mode tries an in-place resize first. It falls back to eviction, for example when the resize:",
          ],
        },
        {
          kind: "ul",
          items: [
            "is infeasible",
            "is deferred for more than 5\u00a0minutes",
            "is still in progress after an hour",
            "would change the pod’s Quality of Service (QoS) class",
          ],
        },
        {
          kind: "p",
          text: [
            { code: "InPlaceOrRecreate" },
            " is generally available from VPA 1.6.0 and needs Kubernetes 1.33 or later. ",
            { code: "InPlace" },
            ", alpha in VPA 1.7.0, never evicts. ",
            { code: "Auto" },
            " is deprecated and behaves as ",
            { code: "Recreate" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "VPA vs HPA", href: "/learn/vpa-vs-hpa" },
            " covers how the VPA fits beside a Horizontal Pod Autoscaler (HPA).",
          ],
        },
      ],
    },
    {
      id: "a-resize-changes-only-cpu-and-memory",
      title: "Limitations",
      blocks: [
        { kind: "p", text: "As of Kubernetes 1.37, the documentation lists these:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Only CPU and memory" },
              " can be resized. One exception is an alpha gate in 1.37, off by default. It lets ",
              { code: "/resize" },
              " change the ",
              { code: "sizeLimit" },
              " of a memory-backed emptyDir volume on cgroup v2\u00a0nodes. Disk-backed emptyDir volumes and persistent volumes can’t be resized through ",
              { code: "/resize" },
              ".",
            ],
            [
              { b: "The QoS class" },
              " is fixed when the pod is created. A Guaranteed pod must keep requests equal to limits for both CPU and memory. A Burstable pod can’t make them equal for both. A BestEffort pod can’t gain requests or limits.",
            ],
            [{ b: "Requests and limits" }, " can’t be removed once set, only changed."],
            [
              { b: "Non-restartable init containers and ephemeral containers" },
              " can’t be resized. Sidecar containers can.",
            ],
            [{ b: "Windows pods" }, " don’t support in-place resize."],
            [
              { b: "Pods managed by the static CPU Manager or Memory Manager policy" },
              " can’t be resized in place.",
            ],
            [
              { b: "A pod that uses swap" },
              " can resize its memory request only if its memory policy is ",
              { code: "RestartContainer" },
              ".",
            ],
          ],
        },
        {
          kind: "p",
          text: "So a Guaranteed pod with a 1\u00a0CPU request and limit can move to 2\u00a0CPU only if both values move together.",
        },
        {
          kind: "p",
          text: [
            "When a resize is ",
            { code: "Infeasible" },
            ", the running size stays as it was. The docs’ fix is to patch the pod again with a size that fits.",
          ],
        },
        {
          kind: "p",
          text: "If the pod needs the larger size, change the Pod template and let the controller replace the pod. The scheduler can then place it on a node with room.",
        },
      ],
    },
    {
      id: "in-place-pod-resize-on-aks-and",
      title: "On AKS and EKS",
      blocks: [
        {
          kind: "p",
          text: "On the Azure Kubernetes Service (AKS) calendar, 1.33 reached end of life in July 2026, and 1.34 reaches it in November 2026. Version 1.37 became generally available in October 2026.",
        },
        {
          kind: "p",
          text: "Outside long-term support, every AKS version in its support window is 1.34 or later. From 1.35 the feature is always on.",
        },
        {
          kind: "p",
          text: "The AKS control plane can run up to three minor versions ahead of node pools, so check each pool. Below 1.33 the feature is alpha and off by default.",
        },
        {
          kind: "p",
          text: "On Amazon Elastic Kubernetes Service (EKS), as of October 2026, standard support covers 1.34 to 1.37. Versions 1.31 to 1.33 are in extended support, which costs more per cluster hour.",
        },
        {
          kind: "p",
          text: "EKS doesn’t support alpha features. So in-place resize isn’t supported at 1.31 or 1.32, and neither is the 1.37 preemption gate.",
        },
        { kind: "svg", figure: figure3 },
        {
          kind: "p",
          text: "Managed and self-managed node groups aren’t upgraded with the control plane, so check the nodes after every upgrade. This command shows each node’s kubelet version and operating system:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl get nodes -o custom-columns=NAME:.metadata.name,KUBELET:.status.nodeInfo.kubeletVersion,OS:.status.nodeInfo.operatingSystem",
        },
        {
          kind: "p",
          text: "A Linux node needs v1.33 or later. Pods on a Windows node can’t be resized in place.",
        },
      ],
    },
    {
      id: "how-coral-applies-a-new-size-to",
      title: "How Coral applies new sizes",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " rebalances each container’s CPU and memory requests from observed use, on AKS and EKS at Kubernetes 1.30 or later. It applies new sizes without any downtime, in place where the node allows:",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Running pods." },
              " Resized in place on nodes at 1.33 or later. On older nodes, restarted one at a time within their ",
              { a: "PodDisruptionBudgets", href: "/learn/pod-disruption-budget-best-practices" },
              ".",
            ],
            [
              { b: "New pods." },
              " Your manifest never changes. Coral sizes pods as they start, so a pod from your unchanged template still starts at the new size.",
            ],
            [
              { b: "Single replicas." },
              " Resized in place where possible. Otherwise a new pod is Ready before the old one goes. With the Recreate strategy or a ReadWriteOnce volume, the new size waits for the pod’s next restart.",
            ],
            [
              { b: "Your VPA." },
              " Switched to Off while automation is on, and restored when you switch automation off.",
            ],
            [
              { b: "Your switch." },
              " Until you turn on “Automatically optimize” for a policy or a workload, Coral only recommends sizes.",
            ],
          ],
        },
        {
          kind: "p",
          text: "Windows nodes are listed and costed, but Coral doesn’t rebalance their workloads. Coral also removes the nodes you don’t need, one at a time.",
        },
        {
          kind: "p",
          text: [
            "On ",
            { a: "our AKS development cluster", href: "/coral-value-lab" },
            ", Coral rebalanced 14 apps by 12 October. The CPU they reserve went from 0.78 to 0.43\u00a0cores, and memory from 6.4 to 5.4\u00a0GiB.",
          ],
        },
        {
          kind: "p",
          text: [
            "The ",
            { a: "Coral guide", href: "/coral-guide#how-sizes-are-worked-out" },
            " shows how each size is worked out.",
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
      title: "“Resize CPU and Memory Resources assigned to Containers”",
      url: "https://kubernetes.io/docs/tasks/configure-pod-container/resize-container-resources/",
    },
    {
      publisher: "Kubernetes Blog",
      title: "“Kubernetes 1.35: In-Place Pod Resize Graduates to Stable”",
      url: "https://kubernetes.io/blog/2025/12/19/kubernetes-v1-35-in-place-pod-resize-ga/",
    },
    {
      publisher: "Kubernetes",
      title: "“Feature Gates”",
      url: "https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/",
    },
    {
      publisher: "Kubernetes",
      title: "“Resource Management for Pods and Containers”",
      url: "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/",
    },
    {
      publisher: "Kubernetes API reference",
      title: "“Node”",
      url: "https://kubernetes.io/docs/reference/kubernetes-api/cluster-resources/node-v1/",
    },
    {
      publisher: "Kubernetes Autoscaler (GitHub)",
      title: "“Vertical Pod Autoscaler: features”",
      url: "https://github.com/kubernetes/autoscaler/blob/master/vertical-pod-autoscaler/docs/features.md",
    },
    {
      publisher: "Kubernetes Autoscaler (GitHub)",
      title: "“Vertical Pod Autoscaler: quick start”",
      url: "https://github.com/kubernetes/autoscaler/blob/master/vertical-pod-autoscaler/docs/quickstart.md",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Supported Kubernetes versions in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/supported-kubernetes-versions",
    },
    {
      publisher: "AWS",
      title: "“Understand the Kubernetes version lifecycle on EKS”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/kubernetes-versions.html",
    },
  ],
  related: [
    {
      title: "Kubernetes requests vs limits",
      where: "Learn",
      href: "/learn/kubernetes-pod-right-sizing",
    },
    {
      title: "HPA vs VPA in Kubernetes",
      where: "Learn",
      href: "/learn/vpa-vs-hpa",
    },
    {
      title: "Exit code 137 (OOMKilled) in Kubernetes",
      where: "Learn",
      href: "/learn/oomkilled-exit-code-137",
    },
    {
      title: "Kubernetes cost optimization",
      where: "Learn",
      href: "/kubernetes-cost-optimization",
    },
    {
      title: "Can single-replica apps be optimized without downtime?",
      where: "Coral FAQ",
      href: "/coral-faq#can-optimization-happen-without-downtime-for",
    },
  ],
  relatedTitle: "More on pod sizing",
};
