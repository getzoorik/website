import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/resize-pvc-kubernetes/1";
import { figure as figure2 } from "@/features/learn/figures/resize-pvc-kubernetes/2";
import { figure as figure3 } from "@/features/learn/figures/resize-pvc-kubernetes/3";

export const article: Article = {
  slug: "resize-pvc-kubernetes",
  title: "Expand a PVC in Kubernetes, and why it can’t shrink",
  meta: "To expand a PVC in Kubernetes, allow expansion in its StorageClass and raise its request. Steps for AKS, EKS and StatefulSets, and why it can’t shrink.",
  h1: "Expand a PVC in Kubernetes",
  deck: "Steps for AKS, EKS and StatefulSets, and what to do when a claim is too big.",
  card: "Grow a PVC on AKS and EKS, resize a StatefulSet’s claims, and move data to a smaller claim.",
  product: "both",
  hub: "Kubernetes",
  topic: "Kubernetes storage",
  published: "2026-11-01",
  updated: "2026-11-03",
  author: "shashank",
  cover: "/learn-covers/zoorik-learn-resize-pvc-kubernetes-1200x630.webp",
  coverAlt: "Resize a PVC: you can grow it, but not shrink it",
  short: [
    "To expand a PVC (PersistentVolumeClaim), raise its storage request. Its StorageClass must set ",
    { code: "allowVolumeExpansion: true" },
    ", and its storage driver must support expansion. The disk and its filesystem grow, and the pod can keep running. A PVC can’t shrink: a smaller claim means copying the data.",
  ],
  sections: [
    {
      id: "resize-pvc-kubernetes",
      title: "Requirements",
      blocks: [
        {
          kind: "p",
          text: [
            "A PVC is a request for storage. The ",
            { a: "PersistentVolume (PV)", href: "/learn/kubernetes-persistent-volume" },
            " bound to it is the storage itself, usually a cloud disk.",
          ],
        },
        {
          kind: "p",
          text: "Expanding a PVC has been stable since Kubernetes 1.24 and is on by default. It needs three things:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "The class allows it." },
              " Kubernetes accepts a larger size only when the claim’s StorageClass sets ",
              { code: "allowVolumeExpansion" },
              " to true.",
            ],
            [
              { b: "The driver supports it." },
              " Each Container Storage Interface (CSI) driver does its own expansion. The Azure Disk driver on Azure Kubernetes Service (AKS) and the Amazon Elastic Block Store (EBS) driver both support it.",
            ],
            [
              { b: "The filesystem can grow." },
              " If the volume holds a filesystem, it must be XFS, ext3 or ext4, the ones Kubernetes can resize.",
            ],
          ],
        },
      ],
    },
    {
      id: "how-to-expand-a-pvc-in-kubernetes",
      title: "Steps to expand a PVC",
      blocks: [
        {
          kind: "ol",
          items: [
            {
              text: [
                "Find the claim’s class in the STORAGECLASS column, then check the class for ",
                { code: "allowVolumeExpansion: true" },
                ":",
              ],
              blocks: [
                {
                  kind: "code",
                  lang: "bash",
                  code: "kubectl get pvc <pvc-name>\nkubectl get storageclass <class-name> -o yaml",
                },
              ],
            },
            {
              text: "If the field is missing, add it to the class:",
              blocks: [
                {
                  kind: "code",
                  lang: "bash",
                  code: "kubectl patch storageclass <class-name> --type merge --patch '{\"allowVolumeExpansion\": true}'",
                },
              ],
            },
            {
              text: "Patch the claim’s storage request to the new size:",
              blocks: [
                {
                  kind: "code",
                  lang: "bash",
                  code: 'kubectl patch pvc <pvc-name> --type merge --patch \'{"spec": {"resources": {"requests": {"storage": "200Gi"}}}}\'',
                },
              ],
            },
            [
              "Watch the CAPACITY column of ",
              { code: "kubectl get pvc <pvc-name>" },
              " until it shows the new size. If it doesn’t, read the claim’s events with ",
              { code: "kubectl describe pvc <pvc-name>" },
              ".",
            ],
          ],
        },
        {
          kind: "p",
          text: "Kubernetes resizes the volume that already backs the claim. It never creates a new PV.",
        },
        {
          kind: "p",
          text: "The CSI driver grows the cloud disk first. The filesystem then grows on the node: when a pod starts with the claim, or while it runs if the filesystem supports that. A claim no pod uses finishes expanding only once a pod mounts it.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "callout",
          label: "Watch out",
          text: "Edit the claim, never the PV. A hand-edited PV capacity can stop the resize: Kubernetes sees matching sizes and concludes the disk already grew.",
        },
        { kind: "h3", id: "when-expansion-fails", title: "When expansion fails" },
        {
          kind: "p",
          text: [
            "If you ask for more than the storage can supply, Kubernetes keeps retrying. You can then ask for a smaller size, as long as it stays above the claim’s ",
            { code: ".status.capacity" },
            ". This recovery is beta and on by default in Kubernetes 1.32, and stable since 1.34.",
          ],
        },
      ],
    },
    {
      id: "how-to-resize-a-pvc-on-aks",
      title: "Expand a PVC on AKS",
      blocks: [
        {
          kind: "p",
          text: [
            "On AKS, the Azure Disk CSI driver does the expansion. Microsoft’s docs say the built-in ",
            { code: "managed-csi" },
            " class “already supports expansion.” The built-in classes create these disks:",
          ],
        },
        {
          kind: "ul",
          items: [
            [{ code: "default" }, " and ", { code: "managed-csi" }, ": Standard SSD."],
            [{ code: "managed-csi-premium" }, ": Premium SSD."],
            [{ code: "managed-csi-premium-v2" }, ": Premium SSD v2, on Kubernetes 1.35 or later."],
          ],
        },
        {
          kind: "p",
          text: "The limit to know is 4 TiB. A Standard HDD, Standard SSD or Premium SSD volume grows without any downtime up to 4 TiB.",
        },
        {
          kind: "p",
          text: "Growing one beyond 4 TiB means unmounting the disk and detaching it from the node. So scale the workload to zero replicas before you patch the claim.",
        },
        {
          kind: "p",
          text: [
            "Premium SSD v2 and Ultra Disk volumes don’t have that limit. The disk-level steps are in how to ",
            {
              a: "expand an Azure disk without any downtime",
              href: "/learn/azure-disk-expand-without-downtime",
            },
            ".",
          ],
        },
        {
          kind: "h3",
          id: "how-azure-charges-for-the-new-size",
          title: "What the new size costs",
        },
        {
          kind: "p",
          text: [
            "Azure charges a managed disk for its provisioned size, rounded up to the nearest offered ",
            { a: "disk size", href: "/learn/glossary/azure-disk-sizes" },
            ". Premium SSD v2 and Ultra Disk are charged per GiB, so they don’t round.",
          ],
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "The 200Gi patch above, on the default class, matches Microsoft’s example. A 200 GiB Standard SSD maps to E15 and is charged as 256 GiB. The extra 56 GiB you pay for is space the claim can’t use.",
        },
        {
          kind: "p",
          text: "A small increase can move a disk up a whole tier. A 128 GiB claim sits exactly on E10. Growing it to 130 GiB moves it to E15: twice the capacity for 2 GiB more room.",
        },
        {
          kind: "p",
          text: [
            "So when you grow a Standard SSD or Premium SSD claim, ask for the full size of the tier you pay for. To price other sizes, use the ",
            { a: "Azure disk pricing calculator", href: "/ebs-and-azure-disk-pricing" },
            ". ",
            { a: "AKS storage classes", href: "/learn/aks-storage-classes" },
            " covers each class’s disk type and redundancy.",
          ],
        },
      ],
    },
    {
      id: "a-gp3-storageclass-that-can-grow-on",
      title: "Expand a PVC on EKS",
      blocks: [
        {
          kind: "p",
          text: [
            "On Amazon Elastic Kubernetes Service (EKS), the Amazon EBS CSI driver does the expansion. This class creates ",
            { a: "gp3", href: "/learn/glossary/ebs-gp3" },
            " volumes that can grow:",
          ],
        },
        {
          kind: "code",
          lang: "yaml",
          code: "apiVersion: storage.k8s.io/v1\nkind: StorageClass\nmetadata:\n  name: gp3\nprovisioner: ebs.csi.aws.com\nparameters:\n  type: gp3\nvolumeBindingMode: WaitForFirstConsumer\nallowVolumeExpansion: true",
        },
        {
          kind: "p",
          text: [
            "The driver creates gp3 when no ",
            { code: "type" },
            " is set, so naming it only keeps the class readable. Unless you set them, the filesystem is ext4 and throughput is 125 MiB/s.",
          ],
        },
        {
          kind: "p",
          text: [
            "With ",
            { code: "WaitForFirstConsumer" },
            ", the driver waits for a pod before it creates the volume, so the volume lands in that pod’s Availability Zone. The driver’s docs recommend this mode for dynamic provisioning.",
          ],
        },
        {
          kind: "p",
          text: [
            "If the class sets ",
            { a: "input/output operations per second (IOPS)", href: "/learn/glossary/iops" },
            " with ",
            { code: "iopsPerGB" },
            ", set ",
            { code: "allowAutoIOPSIncreaseOnModify" },
            " to ",
            { code: '"true"' },
            ". The driver then adjusts IOPS as the volume grows, so the IOPS-per-GiB ratio holds.",
          ],
        },
        {
          kind: "p",
          text: [
            "A claim of this class expands with the same patch. ",
            { a: "Growing an EBS volume in place", href: "/learn/increase-ebs-volume-size" },
            " covers what happens to the volume underneath. The case for gp3 over gp2 is in ",
            { a: "gp2 vs gp3", href: "/learn/gp2-vs-gp3" },
            ".",
          ],
        },
      ],
    },
    {
      id: "how-to-resize-a-pvc-in-a",
      title: "Resize a StatefulSet’s volumeClaimTemplates",
      blocks: [
        {
          kind: "p",
          text: [
            "You can’t resize a StatefulSet’s claims through its template. The API server treats ",
            { code: "volumeClaimTemplates" },
            " as immutable and rejects the edit.",
          ],
        },
        {
          kind: "p",
          text: [
            "Each pod gets its own claim from the template, named after the template, the StatefulSet and the pod’s ordinal: ",
            { code: "www-web-0" },
            " for pod ",
            { code: "web-0" },
            ". So grow the claims that exist, then recreate the StatefulSet around its pods.",
          ],
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "ol",
          items: [
            {
              text: "List the claims by the StatefulSet’s pod label, then patch each one to the new size:",
              blocks: [
                {
                  kind: "code",
                  lang: "bash",
                  code: 'kubectl get pvc -l <pod-label>\nkubectl patch pvc <template>-<statefulset>-0 --type merge --patch \'{"spec": {"resources": {"requests": {"storage": "200Gi"}}}}\'',
                },
              ],
            },
            {
              text: "In case a claim gets deleted, set each claim’s PV to keep its disk:",
              blocks: [
                {
                  kind: "code",
                  lang: "bash",
                  code: 'kubectl patch pv <pv-name> --type merge --patch \'{"spec": {"persistentVolumeReclaimPolicy": "Retain"}}\'',
                },
              ],
            },
            {
              text: [
                "Delete the StatefulSet but not its pods. ",
                { code: "--cascade=orphan" },
                " leaves the pods running. Without it, the pods are deleted too.",
              ],
              blocks: [
                {
                  kind: "code",
                  lang: "bash",
                  code: "kubectl delete statefulset <statefulset> --cascade=orphan",
                },
              ],
            },
            [
              "Apply the manifest again with the new size in ",
              { code: "volumeClaimTemplates" },
              ", so new replicas get claims at that size. The new StatefulSet adopts pods that are Running and Ready. A pod it relaunches mounts its original volume again.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "When the claims show the new size, set each PV’s reclaim policy back. A dynamically provisioned PV takes its class’s policy, ",
            { code: "Delete" },
            " by default. A PV left on ",
            { code: "Retain" },
            " keeps its disk, and its cost, after the claim is gone.",
          ],
        },
      ],
    },
    {
      id: "can-you-shrink-a-pvc-in-kubernetes",
      title: "Can a PVC shrink?",
      blocks: [
        {
          kind: "p",
          text: "No. The Kubernetes docs say “Kubernetes does not support shrinking a PVC to less than its current size.”",
        },
        {
          kind: "p",
          text: "Microsoft’s AKS docs give the reason, “the risk of data loss,” and show this error for a smaller patch:",
        },
        {
          kind: "code",
          lang: "text",
          code: 'The persistentVolumeClaim "pvc-azuredisk" is invalid: spec.resources.requests.storage: Forbidden: field can not be less than previous value.',
        },
        { kind: "h3", id: "why-a-claim-cant-shrink", title: "Why a claim can’t shrink" },
        {
          kind: "p",
          text: "A filesystem can keep data in any block of its disk, including the last ones. Removing the end of the disk would remove that data. Only the operating system using the filesystem can move it first.",
        },
        {
          kind: "p",
          text: [
            "So grow a claim as its data grows, rather than sizing it large up front. The cloud disks underneath can’t shrink in place either: see ",
            { a: "Azure managed disks", href: "/learn/shrink-azure-managed-disk" },
            " and ",
            { a: "EBS volumes", href: "/learn/shrink-ebs-volume" },
            ".",
          ],
        },
        {
          kind: "h3",
          id: "how-to-move-the-data-to-a",
          title: "Move to a smaller claim",
        },
        {
          kind: "p",
          text: "To get a smaller claim, copy the data to a new one. The data is unavailable from step 2 to step 5.",
        },
        { kind: "svg", figure: figure3 },
        {
          kind: "ol",
          items: [
            [
              "Set the old claim’s PV to ",
              { code: "Retain" },
              ", with the patch from the StatefulSet steps, so deleting the claim later keeps the disk.",
            ],
            [
              "Scale the workload to zero so nothing writes during the copy. If a StatefulSet’s ",
              { code: "persistentVolumeClaimRetentionPolicy" },
              " sets ",
              { code: "whenScaled: Delete" },
              ", scaling down deletes its claims, so set it to ",
              { code: "Retain" },
              " first.",
            ],
            "Create a claim in the same class, sized to the data plus the headroom you want.",
            [
              "Run a one-off pod that mounts both claims and copies the files, keeping ownership, permissions and links. ",
              { a: "How to shrink an EBS volume", href: "/learn/shrink-ebs-volume" },
              " gives the rsync flags. With ",
              { code: "WaitForFirstConsumer" },
              ", the new disk is created when this pod starts.",
            ],
            [
              "Point the workload’s ",
              { code: "claimName" },
              " at the new claim and scale it back up.",
            ],
            [
              "Delete the old claim once you trust the copy. Its PV, on ",
              { code: "Retain" },
              ", becomes Released and keeps the disk, and deleting the PV keeps it too. Delete the disk in Azure or AWS last, since its data goes with it.",
            ],
          ],
        },
        {
          kind: "h3",
          id: "keep-the-claim-name-in-a-statefulset",
          title: "Keep a StatefulSet’s claim name",
        },
        {
          kind: "p",
          text: "A StatefulSet’s claim names are fixed, so the new disk must end up behind a claim with the old name. These steps follow the Kubernetes docs’ recovery from a failed expansion. After the copy:",
        },
        {
          kind: "ol",
          items: [
            ["Delete the old claim, whose PV you set to ", { code: "Retain" }, "."],
            ["Set the new PV to ", { code: "Retain" }, ", then delete the temporary claim."],
            ["Clear that PV’s ", { code: "claimRef" }, "."],
            [
              "Create a claim under the original name, in the same class and at the new size, with ",
              { code: "volumeName" },
              " set to that PV.",
            ],
            "Once it binds, restore that PV’s reclaim policy.",
            [
              "Delete the StatefulSet with ",
              { code: "--cascade=orphan" },
              ", then apply it again with the smaller template size and its usual replica count.",
            ],
          ],
        },
      ],
    },
    {
      id: "the-same-grow-only-rule-on-vm",
      title: "Where Amoeba fits",
      blocks: [
        {
          kind: "p",
          text: [
            "Outside Kubernetes, a virtual machine’s (VM’s) data disks follow the same grow-only rule. ",
            { a: "Amoeba", href: "/amoeba" },
            ", Zoorik’s block storage optimization product, works on those: Azure managed disks and Amazon EBS volumes on Windows and Linux VMs. It doesn’t work on PVCs, and it never touches the OS disk or root volume.",
          ],
        },
        {
          kind: "p",
          text: "Amoeba moves a VM’s data disks onto one btrfs pool sized to your data, then rightsizes the pool without any downtime. It grows the pool before it fills, and sooner when data arrives fast.",
        },
        {
          kind: "p",
          text: "When your data goes down and stays down, it shrinks the pool one disk at a time. So you pay for close to what you use.",
        },
        {
          kind: "p",
          text: [
            {
              a: "Azure managed disk cost optimization",
              href: "/azure-managed-disk-cost-optimization",
            },
            " and ",
            { a: "EBS cost optimization", href: "/ebs-cost-optimization" },
            " cover Amoeba on each cloud.",
          ],
        },
      ],
    },
  ],
  help: {
    product: "amoeba",
    text: "Amoeba moves a VM’s data disks onto one pool sized to your data, then rightsizes it autonomously, without any downtime, one disk at a time. We estimate it takes 50–60% off block storage cost. It is an estimated range, not a promise. The free assessment works out your own figure.",
    links: [
      { label: "Block storage optimization with Amoeba", href: "/amoeba" },
      { label: "Estimate your saving", href: "/assessment?p=amoeba" },
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
      title: "“Feature Gates”",
      url: "https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/",
      note: " (RecoverVolumeExpansionFailure)",
    },
    {
      publisher: "Kubernetes",
      title: "“StatefulSet Basics”",
      url: "https://kubernetes.io/docs/tutorials/stateful-application/basic-stateful-set/",
    },
    {
      publisher: "Kubernetes",
      title: "“StatefulSets”",
      url: "https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/",
    },
    {
      publisher: "Kubernetes source",
      title: "“StatefulSet update validation (pkg/apis/apps/validation/validation.go)”",
      url: "https://github.com/kubernetes/kubernetes/blob/master/pkg/apis/apps/validation/validation.go",
    },
    {
      publisher: "Microsoft Learn",
      title:
        "“Create and manage persistent volumes with Azure Disks in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/create-volume-azure-disk",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Select a disk type for Azure IaaS VMs”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-types",
    },
    {
      publisher: "Amazon EBS CSI driver (Kubernetes SIGs)",
      title: "“Amazon Elastic Block Store (EBS) CSI driver”",
      url: "https://github.com/kubernetes-sigs/aws-ebs-csi-driver",
    },
    {
      publisher: "Amazon EBS CSI driver (Kubernetes SIGs)",
      title: "“CreateVolume (StorageClass) Parameters”",
      url: "https://github.com/kubernetes-sigs/aws-ebs-csi-driver/blob/master/docs/parameters.md",
    },
  ],
  related: [
    {
      title: "Can you shrink an Azure managed disk?",
      where: "Learn",
      href: "/learn/shrink-azure-managed-disk",
    },
    {
      title: "How to shrink an EBS volume",
      where: "Learn",
      href: "/learn/shrink-ebs-volume",
    },
    {
      title: "Kubernetes storage classes on AKS",
      where: "Learn",
      href: "/learn/aks-storage-classes",
    },
    {
      title: "Expand an Azure disk without downtime",
      where: "Learn",
      href: "/learn/azure-disk-expand-without-downtime",
    },
    {
      title: "Increase EBS volume size without downtime",
      where: "Learn",
      href: "/learn/increase-ebs-volume-size",
    },
  ],
  relatedTitle: "More on resizing storage",
};
