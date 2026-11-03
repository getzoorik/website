import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/kubernetes-persistent-volume/1";
import { figure as figure2 } from "@/features/learn/figures/kubernetes-persistent-volume/2";

export const article: Article = {
  slug: "kubernetes-persistent-volume",
  title: "Kubernetes persistent volume and PVC explained",
  meta: "A Kubernetes persistent volume (PV) is storage that outlives any pod, and a PVC claims it. How binding, access modes and reclaim policies work, with YAML.",
  h1: "Kubernetes persistent volumes and PVCs",
  deck: "On AKS and EKS, a claim usually becomes an Azure disk or EBS volume, charged by its size.",
  card: "What a PV and a PVC are, how a claim binds to its disk, and how that disk is charged on AKS and EKS.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes storage",
  published: "2026-11-02",
  updated: "2026-11-03",
  author: "zoorik",
  cover: "/learn-covers/zoorik-learn-kubernetes-persistent-volume-1200x630.webp",
  coverAlt:
    "Kubernetes persistent volume: a pod mounts a PVC, the PVC binds to a PV, and the PV points to an Azure disk or an EBS volume",
  short:
    "A persistent volume (PV) is cluster storage whose life doesn’t depend on any pod. A PersistentVolumeClaim (PVC) asks for storage by size and access mode, and binds to one matching PV. Pods mount the claim, so the data stays when a pod is deleted or replaced.",
  sections: [
    {
      id: "why-pods-need-persistent-volumes",
      title: "Why pods need PVs",
      blocks: [
        {
          kind: "p",
          text: [
            "When a container crashes or stops, the files it created or changed are lost. After a crash, the ",
            { a: "kubelet", href: "/learn/glossary/kubelet" },
            " restarts it with a clean state.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Ephemeral volumes", href: "/learn/kubernetes-ephemeral-storage" },
            " live and die with one pod. Persistent volumes don’t: Kubernetes keeps them when the pod is gone.",
          ],
        },
        {
          kind: "p",
          text: "A PV is a resource of the cluster, just as a node is. It records the storage behind it, be that NFS, iSCSI or a cloud provider’s storage system.",
        },
      ],
    },
    {
      id: "what-a-kubernetes-pvc-is-and-how",
      title: "How a Kubernetes PVC binds",
      blocks: [
        {
          kind: "p",
          text: "A PVC is a user’s request for storage. A pod asks a node for CPU and memory, and a claim asks a PV for a size and access modes. It usually names a StorageClass, and it lives in the namespace of the pods that use it.",
        },
        {
          kind: "p",
          text: "A control loop in the control plane binds each new claim to a matching PV. The binding is one to one, and no other claim can use that PV. A claim gets at least the size it asked for, and the PV may be larger.",
        },
        {
          kind: "p",
          text: "A claim with no match stays unbound until one appears. A cluster with many 50 GiB PVs can’t bind a claim for 100 GiB until a 100 GiB PV is added.",
        },
        { kind: "p", text: "A PV is always in one of four phases:" },
        {
          kind: "ul",
          items: [
            [{ code: "Available" }, ": free, and not yet bound to a claim."],
            [{ code: "Bound" }, ": bound to a claim."],
            [
              { code: "Released" },
              ": the claim was deleted, but the cluster hasn’t reclaimed the storage yet.",
            ],
            [{ code: "Failed" }, ": its automatic reclamation failed."],
          ],
        },
        {
          kind: "p",
          text: [
            "Deleting a claim that a pod still uses doesn’t remove it at once. The claim shows ",
            { code: "Terminating" },
            ", with the ",
            { code: "kubernetes.io/pvc-protection" },
            " finalizer, until no pod uses it.",
          ],
        },
      ],
    },
    {
      id: "static-and-dynamic-provisioning",
      title: "Static and dynamic provisioning",
      blocks: [
        {
          kind: "p",
          text: "Statically, a cluster administrator creates PVs ahead of time, each one pointing at real storage. Dynamically, when no static PV matches a claim, the cluster can create one from the claim’s StorageClass.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: [
            "A claim that names no class gets the cluster’s default StorageClass: the one annotated ",
            { code: 'storageclass.kubernetes.io/is-default-class: "true"' },
            ". A claim with ",
            { code: 'storageClassName: ""' },
            " binds only to PVs without a class, and dynamic provisioning is off for it.",
          ],
        },
        {
          kind: "p",
          text: [
            "On AKS, the default class is named ",
            { code: "default" },
            ", and it’s the same as ",
            { code: "managed-csi" },
            ", one of the built-in ",
            { a: "AKS storage classes", href: "/learn/aks-storage-classes" },
            ". It creates a Standard SSD managed disk. From Kubernetes 1.29, on clusters across multiple availability zones, that disk is zone-redundant (ZRS) instead of locally redundant (LRS).",
          ],
        },
        {
          kind: "p",
          text: [
            "On EKS, the Amazon EBS CSI driver, ",
            { code: "ebs.csi.aws.com" },
            ", creates EBS volumes for persistent volumes. AWS recommends installing it as an EKS add-on. EKS Auto Mode needs no EBS CSI controller installed, but its storage classes must name its own provisioner, ",
            { code: "ebs.csi.eks.amazonaws.com" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "A class’s ",
            { code: "volumeBindingMode" },
            " sets when it makes the volume. ",
            { code: "Immediate" },
            ", the default, binds and provisions it as soon as the claim is created, without knowing where its pod will run. For storage some nodes can’t reach, such as a disk in one zone, that can leave the pod unschedulable.",
          ],
        },
        {
          kind: "p",
          text: [
            { code: "WaitForFirstConsumer" },
            " waits for a pod that uses the claim. The volume is then placed to suit the pod’s scheduling constraints, such as the zone it can run in.",
          ],
        },
      ],
    },
    {
      id: "access-modes",
      title: "Access modes",
      blocks: [
        {
          kind: "p",
          text: "A claim asks for one or more access modes, and Kubernetes matches it to a PV that offers them:",
        },
        {
          kind: "ul",
          items: [
            [
              { code: "ReadWriteOnce" },
              " (RWO): read-write by a single node. Several pods on that node can still use it.",
            ],
            [{ code: "ReadOnlyMany" }, " (ROX): read-only by many nodes."],
            [{ code: "ReadWriteMany" }, " (RWX): read-write by many nodes."],
            [
              { code: "ReadWriteOncePod" },
              " (RWOP): read-write by a single pod in the whole cluster. It works only with CSI volumes, and it’s stable since Kubernetes 1.29.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "A volume is mounted with only one access mode at a time, even if it supports several. An Azure disk is mounted as ",
            { code: "ReadWriteOnce" },
            ", so only one node can use it. For pods on several nodes at once, Microsoft points to Azure Files.",
          ],
        },
      ],
    },
    {
      id: "reclaim-policies",
      title: "Reclaim policies",
      blocks: [
        {
          kind: "p",
          text: "A PV’s reclaim policy decides what happens to it after its claim is deleted:",
        },
        {
          kind: "ul",
          items: [
            [
              { code: "Retain" },
              ": the PV stays, Released, with the old data on it. You delete the PV, then clean up or delete the cloud disk yourself.",
            ],
            [
              { code: "Delete" },
              ": removes both the PV and the storage behind it, such as the Azure disk or EBS volume.",
            ],
            [{ code: "Recycle" }, ": deprecated. The docs recommend dynamic provisioning instead."],
          ],
        },
        {
          kind: "p",
          text: [
            "A dynamically provisioned PV takes its class’s reclaim policy, which defaults to ",
            { code: "Delete" },
            ". AKS’s built-in disk classes delete the Azure disk when its PV is deleted.",
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            "With ",
            { code: "Retain" },
            ", the cloud disk outlives both the claim and the PV, and it’s charged until you delete it. On Azure, it shows up among your ",
            { a: "unattached disks", href: "/learn/find-unattached-disks-azure" },
            ".",
          ],
        },
      ],
    },
    {
      id: "a-kubernetes-persistent-volume-example",
      title: "PVC and pod example",
      blocks: [
        {
          kind: "p",
          text: [
            "The claim below asks for 10 GiB, read-write on one node, from AKS’s ",
            { code: "managed-csi" },
            " class. On EKS, name a StorageClass that uses the EBS CSI driver instead. The pod mounts the claim at ",
            { code: "/data" },
            ".",
          ],
        },
        {
          kind: "code",
          lang: "yaml",
          code: "apiVersion: v1\nkind: PersistentVolumeClaim\nmetadata:\n  name: data\nspec:\n  accessModes:\n    - ReadWriteOnce\n  storageClassName: managed-csi\n  resources:\n    requests:\n      storage: 10Gi",
        },
        {
          kind: "code",
          lang: "yaml",
          code: "apiVersion: v1\nkind: Pod\nmetadata:\n  name: web\nspec:\n  containers:\n    - name: web\n      image: nginx\n      volumeMounts:\n        - mountPath: /data\n          name: data\n  volumes:\n    - name: data\n      persistentVolumeClaim:\n        claimName: data",
        },
        {
          kind: "p",
          text: [
            { code: "kubectl describe pvc data" },
            " shows the claim’s status and, once it’s bound, the PV behind it. On a class with ",
            { code: "WaitForFirstConsumer" },
            ", the claim stays unbound until the pod is created.",
          ],
        },
        {
          kind: "p",
          text: [
            "Delete the pod and create it again, and the files in ",
            { code: "/data" },
            " are still there.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "A StatefulSet", href: "/learn/statefulset-vs-deployment" },
            " needs no hand-written claim. Each entry in its ",
            { code: "volumeClaimTemplates" },
            " gives every pod its own claim, and with it stable storage.",
          ],
        },
      ],
    },
    {
      id: "kubernetes-persistent-storage-on-aks-and-eks",
      title: "What a PV costs",
      blocks: [
        {
          kind: "p",
          text: "EBS charges for the GB you provision each month, until you release the storage. Azure prices a managed disk at the closest size tier that fits it, and charges the same however much of it is used.",
        },
        {
          kind: "p",
          text: "So a claim is charged by its size, not by its data. A 128 GiB claim holding 20 GiB is charged for all 128 GiB.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: [
            "You can ",
            { a: "resize a PVC", href: "/learn/resize-pvc-kubernetes" },
            " to a larger size when its class sets ",
            { code: "allowVolumeExpansion: true" },
            ". It can’t shrink, so space you size for later is charged now.",
          ],
        },
        {
          kind: "p",
          text: [
            "Deleting or scaling down a StatefulSet keeps its claims and their disks by default. Its ",
            { code: "persistentVolumeClaimRetentionPolicy" },
            ", stable since Kubernetes 1.32, can delete the claims instead.",
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
      title: "“Persistent Volumes”",
      url: "https://kubernetes.io/docs/concepts/storage/persistent-volumes/",
    },
    {
      publisher: "Kubernetes",
      title: "“Storage Classes”",
      url: "https://kubernetes.io/docs/concepts/storage/storage-classes/",
    },
    {
      publisher: "Kubernetes",
      title: "“Volumes”",
      url: "https://kubernetes.io/docs/concepts/storage/volumes/",
    },
    {
      publisher: "Kubernetes",
      title: "“StatefulSets”",
      url: "https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Concepts - Storage in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/concepts-storage",
    },
    {
      publisher: "AWS",
      title: "“Use Kubernetes volume storage with Amazon EBS”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/ebs-csi.html",
    },
    { publisher: "AWS", title: "“Amazon EBS pricing”", url: "https://aws.amazon.com/ebs/pricing/" },
    {
      publisher: "Microsoft Azure",
      title: "“Managed Disks pricing”",
      url: "https://azure.microsoft.com/en-us/pricing/details/managed-disks/",
    },
  ],
  related: [
    {
      title: "Kubernetes storage classes on AKS",
      where: "Learn",
      href: "/learn/aks-storage-classes",
    },
    {
      title: "Expand a PVC in Kubernetes",
      where: "Learn",
      href: "/learn/resize-pvc-kubernetes",
    },
    {
      title: "StatefulSet vs Deployment",
      where: "Learn",
      href: "/learn/statefulset-vs-deployment",
    },
    {
      title: "The node was low on resource: ephemeral-storage",
      where: "Learn",
      href: "/learn/kubernetes-ephemeral-storage",
    },
  ],
};
