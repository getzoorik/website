import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/kubernetes-ephemeral-storage/1";

export const article: Article = {
  slug: "kubernetes-ephemeral-storage",
  title: "Kubernetes ephemeral storage: limits and eviction",
  meta: "How Kubernetes ephemeral storage requests and limits work, and how to fix “The node was low on resource: ephemeral-storage” evictions on AKS and EKS.",
  h1: "Kubernetes ephemeral storage: requests, limits and eviction",
  deck: "Requests place pods, a limit caps each one, and a node low on disk evicts pods over their requests first.",
  card: "What counts as ephemeral storage, how requests and limits work, and how to fix ephemeral-storage evictions.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes storage",
  published: "2026-11-02",
  updated: "2026-11-02",
  author: "zoorik",
  cover: "/learn-covers/zoorik-learn-kubernetes-ephemeral-storage-1200x630.webp",
  coverAlt:
    "Kubernetes ephemeral storage: images, logs and emptyDir fill a disk; below 10% free the kubelet frees space, then evicts pods",
  sections: [
    {
      id: "what-counts-as-kubernetes-ephemeral-storage",
      title: "What counts as Kubernetes ephemeral storage",
      blocks: [
        {
          kind: "p",
          text: "Local ephemeral storage is the node’s own writable storage: its locally attached disks or, sometimes, RAM. “Ephemeral” means there’s no long-term promise that the data lasts. Pods use it for scratch space, caches and logs.",
        },
        { kind: "p", text: "The kubelet measures three things for each pod:" },
        {
          kind: "ul",
          items: [
            ["its ", { code: "emptyDir" }, " volumes, except memory-backed ones"],
            "its containers’ logs on the node",
            "its containers’ writable layers",
          ],
        },
        {
          kind: "p",
          text: [
            "A memory-backed (",
            { code: "tmpfs" },
            ") ",
            { code: "emptyDir" },
            " counts as memory instead. Files written there count against the ",
            { a: "memory limit", href: "/learn/glossary/kubernetes-resource-limits" },
            " of the container that wrote them.",
          ],
        },
        {
          kind: "p",
          text: [
            "In the simplest layout, all of it shares one filesystem. That’s typically the root filesystem, which holds ",
            { code: "/var/lib/kubelet" },
            " and ",
            { code: "/var/log" },
            ". A container runtime can keep images and writable layers on a second one.",
          ],
        },
        {
          kind: "callout",
          label: "For engineers",
          text: [
            "The eviction docs call these filesystems ",
            { code: "nodefs" },
            ", ",
            { code: "imagefs" },
            " and ",
            { code: "containerfs" },
            ". The names don’t always mean separate mounts. On a node with one filesystem, all three name the same one.",
          ],
        },
        {
          kind: "h3",
          id: "which-ephemeral-volume-types-count",
          title: "Which ephemeral volume types count",
        },
        {
          kind: "p",
          text: [
            "An ephemeral volume lives and dies with its pod. ",
            { code: "emptyDir" },
            ", ",
            { code: "configMap" },
            ", ",
            { code: "downwardAPI" },
            " and ",
            { code: "secret" },
            " volumes come from the node’s local ephemeral storage, and the kubelet manages them.",
          ],
        },
        {
          kind: "p",
          text: [
            { code: "emptyDir" },
            " data survives a container crash. It’s deleted for good when the pod leaves the node, for any reason.",
          ],
        },
        {
          kind: "p",
          text: "Container Storage Interface (CSI) ephemeral volumes and generic ephemeral volumes come from storage drivers instead. A pod’s storage limits don’t cover CSI ones. A generic one can have a fixed size, on local or network-attached storage.",
        },
      ],
    },
    {
      id: "setting-kubernetes-ephemeral-storage-limits-and-requests",
      title: "Setting Kubernetes ephemeral storage limits and requests",
      blocks: [
        {
          kind: "p",
          text: [
            "Each container can set ",
            { code: "resources.requests.ephemeral-storage" },
            " and ",
            { code: "resources.limits.ephemeral-storage" },
            ". Both are byte quantities, with suffixes such as ",
            { code: "Mi" },
            " and ",
            { code: "Gi" },
            ". Mind the case: ",
            { code: "400m" },
            " means 0.4\u00a0bytes, not ",
            { code: "400Mi" },
            ".",
          ],
        },
        { kind: "p", text: "Here is the Kubernetes docs’ example, trimmed to one container:" },
        {
          kind: "code",
          lang: "yaml",
          code: 'apiVersion: v1\nkind: Pod\nmetadata:\n  name: frontend\nspec:\n  containers:\n  - name: app\n    image: <image>\n    resources:\n      requests:\n        ephemeral-storage: "2Gi"\n      limits:\n        ephemeral-storage: "4Gi"\n    volumeMounts:\n    - name: ephemeral\n      mountPath: "/tmp"\n  volumes:\n    - name: ephemeral\n      emptyDir:\n        sizeLimit: 500Mi',
        },
        {
          kind: "p",
          text: "Requests decide placement. The scheduler places a pod only where the sum of requests fits the ephemeral storage the node can give pods. A container with no request and no limit adds nothing to that sum.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: [
            "What a node can give pods is its allocatable ephemeral storage. ",
            {
              a: "Kubernetes allocatable vs capacity",
              href: "/learn/kubernetes-allocatable-vs-capacity",
            },
            " shows how the reserves and the eviction threshold come off the disk before pods get any.",
          ],
        },
        {
          kind: "p",
          text: [
            "Limits drive eviction. If a container’s writable layer and logs pass its limit, the kubelet evicts the pod. It also evicts a pod whose total use, ",
            { code: "emptyDir" },
            " volumes included, passes the sum of its containers’ limits.",
          ],
        },
        {
          kind: "p",
          text: [
            "An ",
            { code: "emptyDir" },
            " ",
            { code: "sizeLimit" },
            " caps that one volume, and the kubelet evicts the pod when the volume passes it. The volume can run out of room before its limit when logs or image layers fill the disk first.",
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            "A ",
            { a: "ResourceQuota", href: "/learn/limitrange-vs-resourcequota" },
            " on ",
            { code: "ephemeral-storage" },
            " isn’t enforced for pods that set no ",
            { code: "ephemeral-storage" },
            " limit. And a kubelet that isn’t measuring local storage evicts no pod for passing its limit.",
          ],
        },
        {
          kind: "callout",
          label: "For engineers",
          text: [
            "In periodic scanning mode, a deleted file in an ",
            { code: "emptyDir" },
            " that’s still held open keeps using disk. The kubelet doesn’t count it. Filesystem project quotas do, but they’re beta since Kubernetes 1.31 and off by default.",
          ],
        },
      ],
    },
    {
      id: "the-node-was-low-on-resource-ephemeral",
      title: "The node was low on resource: ephemeral-storage",
      blocks: [
        {
          kind: "p",
          text: "This is a node-pressure eviction. The node’s disk crossed an eviction threshold, so the kubelet set a pod to Failed, with reason Evicted, to free space.",
        },
        {
          kind: "p",
          text: [
            "On Linux nodes, the kubelet’s default hard thresholds for disk are ",
            { code: "nodefs.available<10%" },
            ", ",
            { code: "imagefs.available<15%" },
            ", ",
            { code: "nodefs.inodesFree<5%" },
            " and ",
            { code: "imagefs.inodesFree<5%" },
            ". A node’s configuration can set others.",
          ],
        },
        {
          kind: "p",
          text: "The kubelet writes a message like this into the pod’s status, and records it as an Evicted event:",
        },
        {
          kind: "code",
          lang: "text",
          code: "The node was low on resource: ephemeral-storage. Threshold quantity: <quantity>, available: <available>. Container <name> was using <usage>, request is <request>, has larger consumption of ephemeral-storage.",
        },
        {
          kind: "p",
          text: [
            "The message names each container that used more than its request. Its usage is the writable layer plus logs, not ",
            { code: "emptyDir" },
            " volumes. A request of 0 means the container set none, so all it wrote counted as over.",
          ],
        },
        {
          kind: "p",
          text: "The kubelet tries to free space on the node first, and evicts pods only if that frees too little. The node also reports a DiskPressure condition, which the control plane maps to a taint.",
        },
        { kind: "p", text: "To see it on the node, describe it:" },
        { kind: "code", lang: "bash", code: "kubectl describe node <node-name>" },
        {
          kind: "p",
          text: "Under Conditions, DiskPressure turns True once a disk threshold is met. Under Events, look for an EvictionThresholdMet warning.",
        },
        {
          kind: "h3",
          id: "which-pods-the-kubelet-evicts-first",
          title: "Which pods the kubelet evicts first",
        },
        {
          kind: "p",
          text: "Pods using more disk than they requested go first, ranked by Priority, then by how far over they are. Pods within their requests go last, lowest Priority first.",
        },
        {
          kind: "p",
          text: [
            { a: "Quality of Service (QoS) class", href: "/learn/glossary/kubernetes-qos-class" },
            " doesn’t apply to ephemeral-storage requests. So a Guaranteed pod that set no ephemeral-storage request ranks with the pods over their requests.",
          ],
        },
        {
          kind: "p",
          text: "When images and writable layers share the node’s one disk, pods are ranked by everything they hold there: local volumes, logs and writable layers.",
        },
        {
          kind: "p",
          text: [
            "Node-pressure eviction ignores ",
            {
              a: "PodDisruptionBudgets (PDBs)",
              href: "/learn/pod-disruption-budget-best-practices",
            },
            ". Under a hard threshold, evicted pods get a grace period of 0\u00a0seconds, so the app has no time to stop cleanly.",
          ],
        },
        {
          kind: "h3",
          id: "when-a-pod-passes-its-own-limit",
          title: "When a pod passes its own limit",
        },
        {
          kind: "p",
          text: "These three messages mean the pod passed a limit of its own, not that the node ran low:",
        },
        {
          kind: "table",
          columns: [
            { label: "The pod’s message", width: "40%" },
            { label: "What passed its limit", width: "28%" },
            { label: "Fix", width: "32%" },
          ],
          rows: [
            [
              [{ code: 'Container <name> exceeded its local ephemeral storage limit "<limit>".' }],
              "One container’s writable layer and logs",
              "Raise that container’s limit, or move its large files to a volume",
            ],
            [
              [
                {
                  code: "Pod ephemeral local storage usage exceeds the total limit of containers <limit>.",
                },
              ],
              ["The whole pod, ", { code: "emptyDir" }, " volumes included"],
              "Find what grew, then raise the limits or have the app write less",
            ],
            [
              [{ code: 'Usage of EmptyDir volume "<volume>" exceeds the limit "<sizeLimit>".' }],
              ["One ", { code: "emptyDir" }, " volume"],
              [
                "Raise its ",
                { code: "sizeLimit" },
                ", or have the app delete files it no longer needs",
              ],
            ],
          ],
        },
      ],
    },
    {
      id: "how-to-fix-ephemeral-storage-evictions",
      title: "How to fix ephemeral-storage evictions",
      blocks: [
        {
          kind: "ol",
          items: [
            [
              { b: "Find the writer." },
              " The eviction message names the container and its log and writable-layer use. Then check the pod’s ",
              { code: "emptyDir" },
              " volumes, which that figure leaves out.",
            ],
            [
              { b: "Move large files off the writable layer." },
              " Put scratch data in an ",
              { code: "emptyDir" },
              " with a ",
              { code: "sizeLimit" },
              ", or in a generic ephemeral volume. Keep data you need in a PersistentVolume.",
            ],
            [
              { b: "Set requests near real use, and limits above the peak." },
              " The scheduler then counts each pod’s disk when it places it, and a limit stops one pod filling the node on its own.",
            ],
            [
              { b: "Give nodes more disk when pods really need it." },
              " Choose a larger OS disk or root volume, or use instance store where the node type has it.",
            ],
          ],
        },
      ],
    },
    {
      id: "ephemeral-storage-on-aks-and-eks-nodes",
      title: "Ephemeral storage on AKS and EKS nodes",
      blocks: [
        {
          kind: "p",
          text: "On Azure Kubernetes Service (AKS), ephemeral storage typically sits on the node’s OS disk, which holds its root filesystem. Unless you ask for a managed OS disk, AKS uses an ephemeral OS disk where the virtual machine (VM) size allows it. That disk is stored only on the host, just like a temporary disk.",
        },
        {
          kind: "p",
          text: "An ephemeral OS disk’s default size follows the VM size’s temporary storage, when that’s at least 128\u00a0GiB. A Standard_D8ds_v5, with 300\u00a0GiB of temporary storage, gets a 300\u00a0GiB OS disk by default. A managed OS disk’s default size follows the vCPU count: 128\u00a0GiB for 1 to 7\u00a0vCPUs.",
        },
        {
          kind: "p",
          text: "Either way, you can’t change the OS disk size after the node pool is created. Choose it when you add the pool.",
        },
        {
          kind: "p",
          text: [
            "On Amazon Elastic Kubernetes Service (EKS), nodes that ",
            { a: "Karpenter", href: "/learn/what-is-karpenter" },
            " launches with AL2023 get a 20\u00a0GiB gp3 ",
            { a: "EBS", href: "/learn/glossary/ebs-volume" },
            " root volume by default. Set ",
            { code: "blockDeviceMappings" },
            " in the EC2NodeClass for a larger one.",
          ],
        },
        {
          kind: "p",
          text: "Instance store volumes are temporary disks attached to the EC2 instance’s host. They come at no extra charge, as part of the instance’s cost.",
        },
        {
          kind: "p",
          text: [
            "Karpenter and Kubernetes ignore them by default. Set ",
            { code: "instanceStorePolicy: RAID0" },
            " in the EC2NodeClass, and the node’s allocatable ephemeral storage becomes their total size.",
          ],
        },
        {
          kind: "p",
          text: [
            "For instance store vs EBS, and when its data is lost, see ",
            { a: "what is instance store in AWS", href: "/learn/glossary/instance-store" },
            ". For the AKS side, see ",
            { a: "what is an ephemeral OS disk", href: "/learn/glossary/ephemeral-os-disk" },
            ".",
          ],
        },
      ],
    },
    {
      id: "ephemeral-storage-when-coral-drains-a-node",
      title: "Ephemeral storage when Coral drains a node",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " optimizes Kubernetes on AKS and EKS, and it drains spare nodes so your autoscaler can remove them. Where it can, it first starts a replacement pod on another node and waits until it’s Ready. Then it evicts the old pod within its PDB.",
          ],
        },
        {
          kind: "p",
          text: [
            "The old pod’s ",
            { code: "emptyDir" },
            " is deleted with it, and the new pod starts with an empty one.",
          ],
        },
        {
          kind: "p",
          text: [
            "Data on the node’s own disk through ",
            { code: "hostPath" },
            " isn’t counted as ephemeral storage, and Coral ",
            { a: "holds that node", href: "/coral-guide#nodes-held" },
            " instead. The fix is a persistent volume, or marking the pod ",
            { a: "safe to evict", href: "/learn/safe-to-evict-do-not-disrupt" },
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
      { label: "Kubernetes optimization with Coral", href: "/coral" },
      { label: "Estimate your saving", href: "/assessment?p=coral" },
    ],
  },
  sources: [
    {
      publisher: "Kubernetes",
      title: "“Local ephemeral storage”",
      url: "https://kubernetes.io/docs/concepts/storage/ephemeral-storage/",
    },
    {
      publisher: "Kubernetes",
      title: "“Node-pressure Eviction”",
      url: "https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/",
    },
    {
      publisher: "Kubernetes",
      title: "“Ephemeral Volumes”",
      url: "https://kubernetes.io/docs/concepts/storage/ephemeral-volumes/",
    },
    {
      publisher: "Kubernetes",
      title: "“Volumes”",
      url: "https://kubernetes.io/docs/concepts/storage/volumes/#emptydir",
      note: " (emptyDir)",
    },
    {
      publisher: "Kubernetes (GitHub)",
      title: "“kubelet eviction manager: helpers.go and eviction_manager.go”",
      url: "https://github.com/kubernetes/kubernetes/tree/master/pkg/kubelet/eviction",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Concepts - Storage in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/concepts-storage",
    },
    {
      publisher: "AWS",
      title: "“Instance store temporary block storage for EC2 instances”",
      url: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/InstanceStorage.html",
    },
    {
      publisher: "Karpenter",
      title: "“NodeClasses”",
      url: "https://karpenter.sh/docs/concepts/nodeclasses/",
    },
  ],
  related: [
    {
      title: "Kubernetes allocatable vs capacity: what pods can use",
      where: "Learn",
      href: "/learn/kubernetes-allocatable-vs-capacity",
    },
    {
      title: "AKS storage classes: which Azure disk each one creates",
      where: "Learn",
      href: "/learn/aks-storage-classes",
    },
    {
      title: "How to expand or resize a PVC in Kubernetes, and why it can’t shrink",
      where: "Learn",
      href: "/learn/resize-pvc-kubernetes",
    },
    {
      title: "Exit code 137 and OOMKilled: why Kubernetes kills a container",
      where: "Learn",
      href: "/learn/oomkilled-exit-code-137",
    },
  ],
};
