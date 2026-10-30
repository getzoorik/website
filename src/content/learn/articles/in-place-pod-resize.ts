import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/in-place-pod-resize/1";

export const article: Article = {
  slug: "in-place-pod-resize",
  title: "In-place pod resize on Kubernetes, AKS and EKS",
  meta: "In-place pod resize changes a running container’s CPU and memory without recreating its pod. Versions, resizePolicy, limits and what AKS and EKS support.",
  h1: "In-place pod resize: change CPU and memory without a restart",
  deck: "Stable since Kubernetes 1.35. How a resize works, when it still restarts a container, and what AKS and EKS need.",
  card: "Change a running pod’s CPU and memory without recreating it: versions, restart rules, limits, AKS and EKS.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes cost basics",
  published: "2026-11-15",
  updated: "2026-11-15",
  author: "aditya",
  short: [
    "In-place pod resize changes the CPU and memory requests and limits of a running container without deleting and recreating its pod. It was beta and on by default from Kubernetes 1.33. It has been stable since 1.35, where it can’t be switched off. You ask for the new size through the pod’s ",
    { code: "resize" },
    " subresource, and each container’s ",
    { code: "resizePolicy" },
    " decides whether that change restarts the container.",
  ],
  sections: [
    {
      id: "how-in-place-pod-resize-works",
      title: "How in-place pod resize works",
      blocks: [
        {
          kind: "p",
          text: "A container’s CPU and memory used to be fixed for the life of its pod. To change them, you edited the Pod template in a Deployment or StatefulSet, and the controller replaced each pod with a new one at the new size. That route still works on every version and can change any field.",
        },
        {
          kind: "p",
          text: [
            "In-place pod resize, also called in-place pod vertical scaling, makes CPU and memory changeable on a pod that is already running. A container’s ",
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
        { kind: "diagram", figure: figure1 },
        {
          kind: "p",
          text: "While a resize is pending or unfinished, the scheduler counts the largest of the container’s desired, allocated and actual requests, so a smaller request frees room for other pods only once the kubelet has applied it.",
        },
        {
          kind: "p",
          text: "A resize changes one Pod object, not the Deployment or StatefulSet that owns it. The owner’s Pod template still holds the old values, and a pod the controller creates later, after a rollout, an eviction or a node drain, starts at the template’s size. Changing the template doesn’t resize anything in place either: the controller replaces the pods, as before.",
        },
        {
          kind: "p",
          text: [
            "For cost, the request is the number that matters. The scheduler places a pod on a node only while the requests there add up to less than the node’s capacity, even when real use is far below them. A smaller request leaves room for more pods on the same node. A resize never moves a pod, though, so it can’t empty a node by itself, and cost is reduced only when pods move off a node and the node is removed. Choosing the new size means ",
            { a: "setting requests from real use", href: "/learn/kubernetes-pod-right-sizing" },
            ".",
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
            " feature gate. Kubernetes 1.33 in-place pod resizing was beta and on by default, and 1.35 made it stable. From 1.35 the feature is always enabled, and the gate can’t disable it.",
          ],
        },
        {
          kind: "p",
          text: [
            "The rule for a smaller memory limit has changed too. Among the changes since 1.33, the 1.35 announcement lists lifting a restriction on decreasing memory limits, so a decrease is now allowed without a restart. With memory on the default ",
            { code: "NotRequired" },
            " policy, explained below, the kubelet tries to avoid an ",
            { a: "out-of-memory kill", href: "/learn/oomkilled-exit-code-137" },
            ": it applies the smaller limit only if the container’s memory use is below it at that moment. That check is “best-effort and not guaranteed,” in the words of the Kubernetes 1.35 announcement. If use is above the new limit, the resize is skipped and stays in progress. Deferred resizes are retried in a fixed order: higher PriorityClass first, then Guaranteed pods before Burstable ones, then the longest wait.",
          ],
        },
        { kind: "p", text: "Three versions decide whether a resize works:" },
        {
          kind: "ol",
          items: [
            "The control plane, at 1.33 or later.",
            "The node the pod runs on. The kubelet does the work, and the docs require the feature on every node too.",
            [
              "kubectl, at 1.32 or later, for the ",
              { code: "--subresource resize" },
              " flag. Older clients report an invalid subresource error.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Kubernetes 1.37 adds an alpha gate that is off by default, ",
            { code: "InPlacePodVerticalScalingSchedulerPreemption" },
            ". With it, the scheduler can evict pods of lesser priority from the node to make room for a deferred resize. Without it, a deferred resize waits on its node until room frees up there.",
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
            " applies it with a restart. With the policy above, a CPU change applies in place and a memory change restarts the container, as does a change to both. A pod whose own ",
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
          text: [
            "Java and Python services should set memory to ",
            { code: "RestartContainer" },
            ": the Kubernetes 1.35 announcement notes that neither runtime supports resizing memory without a restart.",
          ],
        },
        {
          kind: "p",
          text: [
            "To resize, patch the pod’s ",
            { code: "resize" },
            " subresource. This sets one container’s CPU request to 300m on a Burstable pod, and a Guaranteed pod would have to change its limit in the same patch:",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: 'kubectl patch pod <pod> -n <namespace> --subresource resize --patch \\\n  \'{"spec":{"containers":[{"name":"<container>","resources":{"requests":{"cpu":"300m"}}}]}}\'',
        },
        {
          kind: "p",
          text: [
            { code: "kubectl edit pod <pod> --subresource resize" },
            " works too, and so does a server-side ",
            { code: "kubectl apply" },
            " with the same flag. Then read the pod back:",
          ],
        },
        { kind: "code", lang: "bash", code: "kubectl get pod <pod> -n <namespace> -o yaml" },
        {
          kind: "p",
          text: [
            "Three fields tell you what happened. ",
            { code: "status.containerStatuses[].resources" },
            " shows the applied values, ",
            { code: "restartCount" },
            " shows whether the container restarted, and a ",
            { code: "PodResizePending" },
            " or ",
            { code: "PodResizeInProgress" },
            " condition marks a resize that hasn’t finished, with its ",
            { code: "reason" },
            " and ",
            { code: "message" },
            " saying why.",
          ],
        },
        {
          kind: "p",
          text: [
            "If memory is set to ",
            { code: "RestartContainer" },
            ", change memory one replica at a time. Each resize is a direct change to one pod, so patching every replica together restarts that container in every replica at once.",
          ],
        },
      ],
    },
    {
      id: "what-a-resize-cant-change",
      title: "What a resize can’t change",
      blocks: [
        { kind: "p", text: "As of Kubernetes 1.37, the documentation lists these limits:" },
        {
          kind: "ul",
          items: [
            [
              "Only CPU and memory can be resized. Kubernetes 1.37 adds an alpha gate, off by default, that lets ",
              { code: "/resize" },
              " change the ",
              { code: "sizeLimit" },
              " of a memory-backed emptyDir volume on cgroup v2\u00a0nodes. Disk-backed emptyDir volumes and persistent volumes can’t be resized through ",
              { code: "/resize" },
              ".",
            ],
            "The Quality of Service (QoS) class is fixed when the pod is created. A Guaranteed pod must keep requests equal to limits for both CPU and memory, a Burstable pod can’t make them equal for both, and a BestEffort pod can’t gain requests or limits.",
            "Requests and limits can’t be removed once set, only changed.",
            "Non-restartable init containers and ephemeral containers can’t be resized. Sidecar containers can.",
            "Windows pods don’t support in-place resize.",
            "Pods managed by the static CPU Manager or Memory Manager policy can’t be resized in place.",
            [
              "A pod that uses swap can resize its memory request only if its memory policy is ",
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
            "An ",
            { code: "Infeasible" },
            " resize is impossible on its node, for example a request for more than the node has. The kubelet leaves the running size as it was, and the docs’ fix is to patch the pod again with a size that fits. If the pod really needs the larger size, take the older route: change the Pod template and let the controller replace the pod, so the scheduler can place it on a node with room.",
          ],
        },
      ],
    },
    {
      id: "vpa-in-place-pod-resize",
      title: "VPA in-place pod resize",
      blocks: [
        {
          kind: "p",
          text: [
            "The Vertical Pod Autoscaler (VPA), a separate Kubernetes project, applies its recommendations through the same feature. Its ",
            { code: "InPlaceOrRecreate" },
            " update mode tries an in-place resize first and evicts the pod when that fails, for example when the resize is infeasible, deferred for more than 5\u00a0minutes or in progress for more than an hour, or when it would change the QoS class. The mode has been generally available since VPA 1.6.0 and needs Kubernetes 1.33 or later. The ",
            { code: "InPlace" },
            " mode, alpha in VPA 1.7.0, never evicts, and the deprecated ",
            { code: "Auto" },
            " mode now behaves as ",
            { code: "Recreate" },
            ". How the VPA fits beside a Horizontal Pod Autoscaler (HPA) is covered in ",
            { a: "the comparison of the VPA and the HPA", href: "/learn/vpa-vs-hpa" },
            ".",
          ],
        },
      ],
    },
    {
      id: "in-place-pod-resize-on-aks-and",
      title: "In-place pod resize on AKS and EKS",
      blocks: [
        {
          kind: "p",
          text: "AKS in-place pod resize depends on which versions Microsoft supports. On the Azure Kubernetes Service (AKS) calendar, 1.33 reached end of life in July 2026 and 1.34 reaches it in November 2026, while 1.37 reaches general availability on AKS in October 2026. Outside long-term support, every AKS version before its end-of-life date is therefore 1.34 or later. On AKS 1.35 and later the feature is always on. AKS lets the control plane run up to three minor versions ahead of node pools, so check each pool, not only the cluster: below 1.33 the feature was alpha and off by default.",
        },
        {
          kind: "p",
          text: "In-place pod resize on EKS needs the same versions, on the control plane and on each node. As of October 2026, Amazon Elastic Kubernetes Service (EKS) standard support covers 1.34 to 1.37, and 1.31 to 1.33 are in extended support, which costs more per cluster hour. EKS says alpha features aren’t supported, so in-place resize isn’t supported on clusters at 1.31 or 1.32, where the feature was still alpha, and neither is the 1.37 preemption gate. Managed and self-managed node groups aren’t upgraded when the control plane is, so check the nodes after every control-plane upgrade.",
        },
        {
          kind: "p",
          text: "One command shows each node’s kubelet version and operating system on either cloud:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl get nodes -o custom-columns=NAME:.metadata.name,KUBELET:.status.nodeInfo.kubeletVersion,OS:.status.nodeInfo.operatingSystem",
        },
        {
          kind: "p",
          text: "Linux nodes at v1.35 or later always support in-place resize, and on v1.33 and v1.34 it’s beta and on by default upstream. Pods on Windows nodes can’t be resized in place.",
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
            ", for clusters at Kubernetes 1.30 or later. It rebalances each container’s CPU and memory requests from observed use, and it applies a new size through in-place resize wherever the node allows it:",
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
              " Coral never changes your manifest. Its webhook sizes pods as they start, so a pod created from your unchanged template still starts at the new size.",
            ],
            [
              { b: "Single replicas." },
              " One replica is resized in place where it can be. Otherwise a new pod starts and becomes Ready before the old one goes, and where that isn’t safe, for example with the Recreate strategy or a ReadWriteOnce volume, the new size waits for the pod’s next natural restart.",
            ],
            [
              { b: "Your VPA." },
              " Coral switches an active VPA to Off while automation is on. It restores the VPA when you switch off.",
            ],
            [
              { b: "Your switch." },
              " Coral resizes nothing, and only recommends sizes, until you turn on “Automatically optimize” for a policy or a workload. Routine changes under 10% are skipped.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "Windows nodes are listed and costed, but Coral doesn’t rebalance their workloads. A smaller request reaches your bill when the freed capacity lets a node go, so Coral also drains spare nodes one at a time for your autoscaler to remove. On our own AKS development cluster, Coral rebalanced 14 apps by 12 October: the CPU they reserve went from 0.78 to 0.43\u00a0cores, and their memory from 6.4 to 5.4\u00a0GiB (",
            { a: "the case study", href: "/case-studies/coral-dev-cluster" },
            "). The ",
            { a: "Coral guide", href: "/coral/guide#how-sizes-are-worked-out" },
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
      { label: "Kubernetes cost optimization with Coral", href: "/coral" },
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
      title: "VPA vs HPA: when to use which, and why to rebalance first",
      where: "Learn",
      href: "/learn/vpa-vs-hpa",
    },
    {
      title: "OOMKilled exit code 137: why Kubernetes kills a container",
      where: "Learn",
      href: "/learn/oomkilled-exit-code-137",
    },
    {
      title: "How sizes are worked out",
      where: "Coral product guide",
      href: "/coral/guide#how-sizes-are-worked-out",
    },
    {
      title:
        "Can optimization happen without downtime for applications that have only one replica?",
      where: "Coral FAQ",
      href: "/coral/faq#can-optimization-happen-without-downtime-for",
    },
  ],
};
