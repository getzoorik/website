import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/in-place-pod-resize/1";
import { figure as figure2 } from "@/features/learn/figures/in-place-pod-resize/2";
import { figure as figure3 } from "@/features/learn/figures/in-place-pod-resize/3";

export const article: Article = {
  slug: "in-place-pod-resize",
  title: "In-place pod resize on Kubernetes, AKS and EKS",
  meta: "In-place pod resize, also called in-place pod vertical scaling, changes a running pod’s CPU and memory without a restart. Versions, resizePolicy, AKS and EKS.",
  h1: "In-place pod resize: change CPU and memory without a restart",
  deck: "Stable since Kubernetes 1.35. How a resize works, when it still restarts a container, and what AKS and EKS need.",
  card: "Change a running pod’s CPU and memory without recreating it: versions, restart rules, limits, AKS and EKS.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes cost basics",
  published: "2026-11-01",
  updated: "2026-11-01",
  author: "aditya",
  cover: "/learn-covers/zoorik-learn-in-place-pod-resize-1200x630.webp",
  coverAlt: "In-place pod resize: CPU and memory change inside a running pod, with no restart",
  short: [
    "In-place pod resize changes a running container’s CPU and memory requests and limits without recreating its pod. From Kubernetes 1.33 it is on by default, from 1.35 it is stable, and each container’s ",
    { code: "resizePolicy" },
    " decides whether a resize restarts it.",
  ],
  sections: [
    {
      id: "in-place-pod-resize",
      title: "In-place pod resize changes a running pod instead of replacing it",
      blocks: [
        {
          kind: "p",
          text: "Picture a Burstable pod whose container requests 1\u00a0CPU, and you want that request at 300m. Before in-place resize, a container’s CPU and memory were fixed for the life of its pod.",
        },
        {
          kind: "p",
          text: "To change them, you edited the Pod template in its Deployment or StatefulSet. The controller then replaced each pod with one at the new size. That route still works on every version and can change any field.",
        },
        {
          kind: "p",
          text: "In-place pod resize, also called in-place pod vertical scaling, lets you patch the running pod instead. With the default resize policy, its container keeps running on the same node, now at 300m.",
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
            " becomes the size you want. Its ",
            { code: "status.containerStatuses[*].resources" },
            " reports the size the node has applied. When the two differ, the kubelet on that node tries to apply the new size and reports the result as a pod condition:",
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
              "The new size doesn’t fit right now but might later, for example once another pod leaves. The kubelet retries",
            ],
            [
              [{ code: "PodResizePending" }],
              [{ code: "Infeasible" }],
              "The new size is impossible on this node, for example a request larger than the node itself",
            ],
          ],
        },
        { kind: "svg", figure: figure1 },
        { kind: "p", text: "Deferred resizes are retried in a fixed order:" },
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
            "Kubernetes 1.37 adds an alpha gate that is off by default, ",
            { code: "InPlacePodVerticalScalingSchedulerPreemption" },
            ". With it, the scheduler can evict pods of lesser priority from the node to make room for a deferred resize. Without it, the resize waits on its node until room frees up there.",
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "A resize changes one Pod object, not the Deployment or StatefulSet that owns it. A pod the controller creates later, after a rollout, an eviction or a node drain, starts at its template’s old size.",
        },
        {
          kind: "p",
          text: "Changing the template doesn’t resize anything in place either. The controller replaces the pods, as before.",
        },
      ],
    },
    {
      id: "a-resize-frees-room-on-a-node",
      title: "A resize frees room on a node, but only an emptied node reduces cost",
      blocks: [
        {
          kind: "p",
          text: "For cost, the request is what matters. The scheduler places a pod on a node only while the requests there add up to less than the node’s capacity. That holds even when real use is far below the requests.",
        },
        {
          kind: "p",
          text: "A smaller request leaves room for more pods on the same node, but only once the kubelet has applied it. While a resize is pending or unfinished, the scheduler uses the largest of the container’s desired, allocated and actual requests.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "Take the pod above, patched from 1\u00a0CPU to 300m. Its actual request stays 1\u00a0CPU until the kubelet applies the change, so the scheduler counts 1\u00a0CPU.",
        },
        {
          kind: "p",
          text: "Once the status shows 300m, the scheduler counts 300m. That leaves 1\u00a0CPU − 300m = 700m of the node free for other pods.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: "A resize never moves a pod, so it can’t empty a node by itself. Cost is reduced only when pods move off a node and the node is removed.",
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
      title: "Which Kubernetes versions support in-place resize",
      blocks: [
        {
          kind: "p",
          text: [
            "The feature was alpha from Kubernetes 1.27, behind the ",
            { code: "InPlacePodVerticalScaling" },
            " feature gate. Kubernetes 1.33 in-place pod resizing was beta and on by default.",
          ],
        },
        {
          kind: "p",
          text: "Kubernetes 1.35 made it stable. From 1.35 the feature is always enabled, and the gate can’t disable it.",
        },
        { kind: "p", text: "Three versions decide whether a resize works:" },
        {
          kind: "ol",
          items: [
            [{ b: "The control plane," }, " at 1.33 or later."],
            [
              { b: "The node the pod runs on," },
              " because its kubelet does the work, and the docs require the feature on every node too.",
            ],
            [
              { b: "kubectl," },
              " at 1.32 or later, for the ",
              { code: "--subresource resize" },
              " flag. Older clients report an invalid subresource error.",
            ],
          ],
        },
      ],
    },
    {
      id: "how-to-resize-a-kubernetes-pod-without",
      title: "How to resize a Kubernetes pod without a restart",
      blocks: [
        {
          kind: "p",
          text: [
            "Each container’s ",
            { code: "resizePolicy" },
            " sets, per resource, whether a resize restarts that container or changes it while it keeps running:",
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
            " is the default: the kubelet applies the change to the running container. ",
            { code: "RestartContainer" },
            " applies it with a restart. A pod whose own ",
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
          text: "With the policy above, a CPU change applies in place and a memory change restarts the container. So does a change to both.",
        },
        {
          kind: "p",
          text: [
            "Java and Python services should set memory to ",
            { code: "RestartContainer" },
            ". The Kubernetes 1.35 announcement notes that neither runtime supports resizing memory without a restart.",
          ],
        },
        {
          kind: "callout",
          label: "For engineers",
          text: "Among the changes since 1.33, the 1.35 announcement lists a lifted restriction on decreasing memory limits. A decrease is now allowed without a restart.",
        },
        {
          kind: "p",
          text: [
            "With memory on ",
            { code: "NotRequired" },
            ", the kubelet tries to avoid an ",
            { a: "out-of-memory kill", href: "/learn/oomkilled-exit-code-137" },
            ". It applies the smaller limit only if the container’s memory use is below it at that moment.",
          ],
        },
        {
          kind: "p",
          text: "That check is “best-effort and not guaranteed,” in the announcement’s words. If use is above the new limit, the resize is skipped and stays in progress.",
        },
        { kind: "h3", id: "resize-a-pod-with-kubectl", title: "Resize a pod with kubectl" },
        {
          kind: "ol",
          items: [
            [
              { b: "Patch the pod’s resize subresource." },
              " ",
              { code: "kubectl edit pod <pod> --subresource resize" },
              " works too, and so does a server-side ",
              { code: "kubectl apply" },
              " with the same flag. A Guaranteed pod would have to change its limit in the same patch. The patch below sets one container’s CPU request to 300m on a Burstable pod:",
            ],
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: 'kubectl patch pod <pod> -n <namespace> --subresource resize --patch \\\n  \'{"spec":{"containers":[{"name":"<container>","resources":{"requests":{"cpu":"300m"}}}]}}\'',
        },
        { kind: "ol", start: 2, items: [[{ b: "Read the pod back:" }]] },
        { kind: "code", lang: "bash", code: "kubectl get pod <pod> -n <namespace> -o yaml" },
        {
          kind: "ol",
          start: 3,
          items: [
            [
              { b: "Check three fields." },
              " ",
              { code: "status.containerStatuses[].resources" },
              " shows the applied values. ",
              { code: "restartCount" },
              " shows whether the container restarted. A ",
              { code: "PodResizePending" },
              " or ",
              { code: "PodResizeInProgress" },
              " condition marks a resize that hasn’t finished, and its ",
              { code: "reason" },
              " and ",
              { code: "message" },
              " say why.",
            ],
            [
              { b: "Change memory one replica at a time" },
              " if memory is set to ",
              { code: "RestartContainer" },
              ". Each resize is a direct change to one pod, so patching every replica together restarts that container in every replica at once.",
            ],
          ],
        },
        {
          kind: "h3",
          id: "vpa-in-place-pod-resize-with-eviction",
          title: "VPA in-place pod resize, with eviction as the fallback",
        },
        {
          kind: "p",
          text: [
            "The Vertical Pod Autoscaler (VPA), a separate Kubernetes project, applies its recommendations through the same feature. Its ",
            { code: "InPlaceOrRecreate" },
            " update mode tries an in-place resize first. Eviction is the fallback, for example when the resize:",
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
            " has been generally available since VPA 1.6.0 and needs Kubernetes 1.33 or later. The ",
            { code: "InPlace" },
            " mode, alpha in VPA 1.7.0, never evicts. ",
            { code: "Auto" },
            " mode is deprecated and now behaves as ",
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
      title: "A resize changes only CPU and memory, within the pod’s QoS class",
      blocks: [
        { kind: "p", text: "As of Kubernetes 1.37, the documentation lists these limits:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Only CPU and memory" },
              " can be resized, apart from one alpha gate in Kubernetes 1.37, off by default. It lets ",
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
          text: "A Guaranteed pod with a 1\u00a0CPU request and a 1\u00a0CPU limit can move to 2\u00a0CPU only if both values move together.",
        },
        {
          kind: "p",
          text: [
            "When a resize is ",
            { code: "Infeasible" },
            ", the kubelet leaves the running size as it was. The docs’ fix is to patch the pod again with a size that fits.",
          ],
        },
        {
          kind: "p",
          text: "If the pod really needs the larger size, take the older route. Change the Pod template and let the controller replace the pod. The scheduler can then place it on a node with room.",
        },
      ],
    },
    {
      id: "in-place-pod-resize-on-aks-and",
      title: "In-place pod resize on AKS and EKS: check every node pool’s version",
      blocks: [
        {
          kind: "p",
          text: "In-place pod resize on Azure Kubernetes Service (AKS) depends on the versions Microsoft supports. On the AKS calendar, 1.33 reached end of life in July 2026. Version 1.34 reaches it in November 2026, and 1.37 reached general availability on AKS in October 2026.",
        },
        {
          kind: "p",
          text: "Outside long-term support, every AKS version still in its support window is therefore 1.34 or later. On AKS 1.35 and later the feature is always on.",
        },
        {
          kind: "p",
          text: "AKS lets the control plane run up to three minor versions ahead of node pools. Check each pool, not only the cluster. Below 1.33 the feature was alpha and off by default.",
        },
        {
          kind: "p",
          text: "In-place pod resize on Amazon Elastic Kubernetes Service (EKS) needs the same versions, on the control plane and on each node. As of October 2026, EKS standard support covers 1.34 to 1.37. Versions 1.31 to 1.33 are in extended support, which costs more per cluster hour.",
        },
        {
          kind: "p",
          text: "EKS says alpha features aren’t supported, so in-place resize isn’t supported on clusters at 1.31 or 1.32, where the feature was still alpha. Neither is the 1.37 preemption gate.",
        },
        { kind: "svg", figure: figure3 },
        {
          kind: "p",
          text: "Managed and self-managed node groups aren’t upgraded when their control plane is, so check the nodes after every control-plane upgrade. One command shows each node’s kubelet version and operating system on either cloud:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl get nodes -o custom-columns=NAME:.metadata.name,KUBELET:.status.nodeInfo.kubeletVersion,OS:.status.nodeInfo.operatingSystem",
        },
        {
          kind: "p",
          text: "In that output, a Linux node needs v1.33 or later, and pods on a Windows node can’t be resized in place.",
        },
      ],
    },
    {
      id: "how-coral-applies-a-new-size-to",
      title: "How Coral applies a new size to running pods",
      blocks: [
        {
          kind: "p",
          text: [
            "Coral is Zoorik’s ",
            { a: "Kubernetes optimization for AKS and EKS", href: "/coral" },
            ", for clusters at Kubernetes 1.30 or later. It rebalances each container’s CPU and memory requests from observed use. Where the node allows it, Coral applies each new size through in-place resize:",
          ],
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Running pods." },
              " On nodes at 1.33 or later, Coral resizes running pods in place. On older nodes it restarts pods one at a time to apply the new size, within their ",
              { a: "PodDisruptionBudgets", href: "/learn/pod-disruption-budget-best-practices" },
              ".",
            ],
            [
              { b: "New pods." },
              " Coral never changes your manifest. It sizes pods as they start, so a pod created from your unchanged template still starts at the new size.",
            ],
            [
              { b: "Single replicas." },
              " One replica is resized in place where it can be. Otherwise a new pod starts and becomes Ready before the old one goes. Where that isn’t safe, the new size waits for the pod’s next natural restart. The Recreate strategy and a ReadWriteOnce volume are two such cases.",
            ],
            [
              { b: "Your VPA." },
              " Coral switches an active VPA to Off while automation is on. It restores the VPA when you switch automation off.",
            ],
            [
              { b: "Your switch." },
              " Until you turn on “Automatically optimize” for a policy or a workload, Coral only recommends sizes and resizes nothing.",
            ],
          ],
        },
        {
          kind: "p",
          text: "Windows nodes are listed and costed, but Coral doesn’t rebalance their workloads.",
        },
        {
          kind: "p",
          text: "A smaller request reduces your cloud cost only when the freed capacity lets a node go. So Coral also drains spare nodes one at a time, for your autoscaler to remove.",
        },
        {
          kind: "p",
          text: [
            "On our own AKS development cluster, Coral rebalanced 14 apps by 12 October. The CPU they reserve went from 0.78 to 0.43\u00a0cores, and their memory from 6.4 to 5.4\u00a0GiB (",
            { a: "the Coral Value Lab study", href: "/coral-value-lab" },
            "). The ",
            { a: "Coral guide", href: "/coral-guide#how-sizes-are-worked-out" },
            " shows how each size is worked out.",
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
      title: "Kubernetes pod right sizing: set requests from real use",
      where: "Learn",
      href: "/learn/kubernetes-pod-right-sizing",
    },
    {
      title: "VPA vs HPA: when to use which",
      where: "Learn",
      href: "/learn/vpa-vs-hpa",
    },
    {
      title: "OOMKilled exit code 137: why Kubernetes kills a container",
      where: "Learn",
      href: "/learn/oomkilled-exit-code-137",
    },
    {
      title: "Kubernetes cost optimization: rebalance requests, then remove spare nodes",
      where: "Learn",
      href: "/kubernetes-cost-optimization",
    },
    {
      title:
        "Can optimization happen without downtime for applications that have only one replica?",
      where: "Coral FAQ",
      href: "/coral-faq#can-optimization-happen-without-downtime-for",
    },
  ],
};
