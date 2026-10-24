import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/resize-pvc-kubernetes/1";

export const article: Article = {
  slug: "resize-pvc-kubernetes",
  title: "Resize a PVC in Kubernetes, and why it can’t shrink",
  meta: "Resize a PVC in Kubernetes by raising its storage request once the StorageClass sets allowVolumeExpansion. Steps for AKS, EKS gp3, StatefulSets and shrinking.",
  h1: "How to resize a PVC in Kubernetes, and why it can’t shrink",
  deck: "Raise the storage request and the disk grows. Steps for AKS, EKS and StatefulSets, and the route to a smaller claim.",
  card: "Grow a PVC on AKS and EKS, resize a StatefulSet’s claims, and what to do when a claim is too big.",
  product: "both",
  hub: "Kubernetes",
  topic: "Kubernetes storage",
  published: "2026-11-09",
  updated: "2026-11-09",
  author: "shashank",
  short: [
    "To resize a PVC (PersistentVolumeClaim) in Kubernetes, raise the claim’s storage request, ",
    { code: "spec.resources.requests.storage" },
    ". That works when the claim’s StorageClass sets ",
    { code: "allowVolumeExpansion: true" },
    " and its Container Storage Interface (CSI) driver supports expansion, as the Azure Disk and Amazon Elastic Block Store (EBS) drivers do. The disk grows, then the filesystem, and the pod can keep running. Kubernetes can’t shrink a PVC, so a claim sized too large keeps its size until you copy the data to a new one.",
  ],
  sections: [
    {
      id: "what-you-need-to-resize-a-pvc",
      title: "What you need to resize a PVC in Kubernetes",
      blocks: [
        {
          kind: "p",
          text: "A PVC is a request for storage, and the PersistentVolume (PV) bound to it is the storage that serves it, usually a cloud disk. Expanding a PVC has been stable since Kubernetes 1.24 and is on by default, but it needs three things to line up:",
        },
        {
          kind: "ul",
          items: [
            [
              "The claim’s StorageClass sets ",
              { code: "allowVolumeExpansion" },
              " to true. Kubernetes accepts a larger size only for claims of such a class.",
            ],
            "The CSI driver supports expansion. Kubernetes leaves this to each driver, and the Azure Disk driver on Azure Kubernetes Service (AKS) and the Amazon EBS driver both support it.",
            "If the volume holds a filesystem, it’s XFS, ext3 or ext4, the three Kubernetes can resize.",
          ],
        },
        {
          kind: "p",
          text: [
            "Check the class first. ",
            { code: "kubectl get pvc <pvc-name>" },
            " shows the claim’s class in its STORAGECLASS column, and the class’s YAML shows whether expansion is allowed:",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl get pvc <pvc-name>\nkubectl get storageclass <class-name> -o yaml",
        },
        {
          kind: "p",
          text: [
            "If ",
            { code: "allowVolumeExpansion: true" },
            " is missing, you can add it to the existing class.",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl patch storageclass <class-name> --type merge --patch '{\"allowVolumeExpansion\": true}'",
        },
      ],
    },
    {
      id: "how-to-expand-a-pvc-in-kubernetes",
      title: "How to expand a PVC in Kubernetes",
      blocks: [
        {
          kind: "p",
          text: "Edit the claim, never the PV, by patching its storage request to the new size:",
        },
        {
          kind: "code",
          lang: "bash",
          code: 'kubectl patch pvc <pvc-name> --type merge --patch \'{"spec": {"resources": {"requests": {"storage": "200Gi"}}}}\'',
        },
        {
          kind: "p",
          text: "Kubernetes then resizes the volume that already backs the claim, and the docs are explicit that “a new PersistentVolume is never created to satisfy the claim.” The CSI driver expands the cloud disk, then the filesystem grows on the node. That second step happens when a pod starts with the claim, or while the pod runs if the filesystem can grow while mounted. A claim that no pod uses can’t finish expanding until a pod mounts it.",
        },
        {
          kind: "p",
          text: [
            "Watch the CAPACITY column of ",
            { code: "kubectl get pvc <pvc-name>" },
            " until it shows the new size, and read the claim’s events with ",
            { code: "kubectl describe pvc <pvc-name>" },
            " if it doesn’t.",
          ],
        },
        { kind: "diagram", figure: figure1 },
        {
          kind: "p",
          text: [
            "Two cautions from the Kubernetes docs. Editing the PV’s capacity by hand can stop the resize from happening, because the control plane sees matching sizes and concludes the disk was already grown. And if you ask for more than the storage system can supply, Kubernetes keeps retrying. On Kubernetes 1.32 or later (beta and on by default, stable since 1.34), you can then retry with a smaller request than the one that failed, but it must still be higher than the claim’s ",
            { code: ".status.capacity" },
            ".",
          ],
        },
      ],
    },
    {
      id: "how-to-resize-a-pvc-on-aks",
      title: "How to resize a PVC on AKS",
      blocks: [
        {
          kind: "p",
          text: [
            "On AKS, an expansion request goes to the Azure Disk CSI driver, and Microsoft’s docs say the built-in ",
            { code: "managed-csi" },
            " class “already supports expansion.” Of the other built-in classes, the default class creates Standard SSD disks, ",
            { code: "managed-csi-premium" },
            " creates Premium SSD, and on Kubernetes 1.35 or later ",
            { code: "managed-csi-premium-v2" },
            " provisions Premium SSD v2.",
          ],
        },
        {
          kind: "p",
          text: [
            "The limit to know is 4\u00a0TiB. A Standard HDD, Standard SSD or Premium SSD volume grows without downtime while the new size stays at 4\u00a0TiB or less. Growing one of those from 4\u00a0TiB or less to more than 4\u00a0TiB means unmounting the disk and detaching it from the node, so you scale the workload to zero replicas before you patch the claim. Premium SSD v2 and Ultra Disk volumes don’t have that limit, and the disk-level steps are in ",
            {
              a: "how to expand an Azure disk without downtime",
              href: "/learn/azure-disk-expand-without-downtime",
            },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "The size you pick also sets the bill, and not one GiB at a time: Azure bills a managed disk on its provisioned size, rounded up to the nearest offered disk size. Microsoft’s own example is a 200\u00a0GiB Standard SSD, which maps to E15 and is billed as 256\u00a0GiB. So a 128\u00a0GiB claim on Standard SSD sits exactly on E10, and growing it to 130\u00a0GiB bills it as E15, at twice the capacity. When you grow a Standard SSD or Premium SSD claim, ask for the full size of the tier you’re paying for. Premium SSD v2 is billed per GiB, so it doesn’t round. Which built-in class gives you which disk type, and with what redundancy, is the subject of ",
            { a: "which disk each AKS class creates", href: "/learn/aks-storage-classes" },
            ".",
          ],
        },
      ],
    },
    {
      id: "a-gp3-storageclass-that-can-grow-on",
      title: "A gp3 StorageClass that can grow on EKS",
      blocks: [
        {
          kind: "p",
          text: "On Amazon Elastic Kubernetes Service (EKS) with the Amazon EBS CSI driver, a class like this one creates gp3\u00a0volumes and allows expansion:",
        },
        {
          kind: "code",
          lang: "yaml",
          code: "apiVersion: storage.k8s.io/v1\nkind: StorageClass\nmetadata:\n  name: gp3\nprovisioner: ebs.csi.aws.com\nparameters:\n  type: gp3\nvolumeBindingMode: WaitForFirstConsumer\nallowVolumeExpansion: true",
        },
        {
          kind: "p",
          text: [
            "Naming ",
            { code: "type" },
            " keeps the class readable, though the driver creates gp3 when none is given. With ",
            { code: "WaitForFirstConsumer" },
            ", the driver waits for a pod before it creates the volume, so the volume lands in the Availability Zone where that pod runs, and the driver’s docs recommend this mode for dynamic provisioning. Unless you set them, the filesystem is ext4 and a gp3\u00a0volume’s throughput is 125\u00a0MiB/s.",
          ],
        },
        {
          kind: "p",
          text: [
            "One parameter matters at resize time. If the class sets input/output operations per second (IOPS) with ",
            { code: "iopsPerGB" },
            ", adding ",
            { code: 'allowAutoIOPSIncreaseOnModify: "true"' },
            " lets the driver adjust IOPS as the volume grows, so the IOPS-per-GiB ratio holds. You expand a claim of this class the same way as any other. What happens to the volume underneath is in ",
            { a: "growing an EBS volume in place", href: "/learn/increase-ebs-volume-size" },
            ", and the case for gp3 over gp2 is in ",
            { a: "comparing gp2 and gp3", href: "/learn/gp2-vs-gp3" },
            ".",
          ],
        },
      ],
    },
    {
      id: "how-to-resize-a-pvc-in-a",
      title: "How to resize a PVC in a StatefulSet",
      blocks: [
        {
          kind: "p",
          text: [
            "Each pod in a StatefulSet gets its own claim from ",
            { code: "volumeClaimTemplates" },
            ", named after the template, the StatefulSet and the pod’s ordinal, such as ",
            { code: "www-web-0" },
            ". Editing the size in the template is rejected, because the API server treats ",
            { code: "volumeClaimTemplates" },
            " as immutable. So grow the claims that exist, then recreate the StatefulSet object around its pods.",
          ],
        },
        {
          kind: "ol",
          items: [
            {
              text: "Patch each claim to the new size, listing them by the StatefulSet’s pod label:",
              blocks: [
                {
                  kind: "code",
                  lang: "bash",
                  code: 'kubectl get pvc -l <pod-label>\nkubectl patch pvc <template>-<statefulset>-0 --type merge --patch \'{"spec": {"resources": {"requests": {"storage": "200Gi"}}}}\'',
                },
              ],
            },
            {
              text: "As insurance for the next step, set each claim’s PV to keep its disk if the claim is ever deleted:",
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
                "Delete the StatefulSet object without its pods. Without ",
                { code: "--cascade=orphan" },
                ", the delete removes the pods as well, so check the flag before you run it. With it, Kubernetes deletes only the StatefulSet and leaves its pods running.",
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
              ", so new replicas get claims at that size. The recreated StatefulSet adopts pods that are Running and Ready, and a pod it relaunches mounts its original volume again, as the Kubernetes StatefulSet tutorial shows.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "When the claims show the new size, set each PV’s reclaim policy back to what it was. A dynamically provisioned PV inherits its class’s policy, which defaults to ",
            { code: "Delete" },
            ", and a PV left on ",
            { code: "Retain" },
            " keeps its disk, and its bill, after the claim is gone.",
          ],
        },
      ],
    },
    {
      id: "can-you-shrink-a-pvc-in-kubernetes",
      title: "Can you shrink a PVC in Kubernetes?",
      blocks: [
        {
          kind: "p",
          text: "No. The Kubernetes docs say it plainly: “Kubernetes does not support shrinking a PVC to less than its current size.” Microsoft’s AKS docs give the reason, “due to the risk of data loss,” and show this error for a smaller patch:",
        },
        {
          kind: "code",
          lang: "text",
          code: 'The persistentVolumeClaim "pvc-azuredisk" is invalid: spec.resources.requests.storage: Forbidden: field can not be less than previous value.',
        },
        {
          kind: "p",
          text: "A disk is a block device, and its filesystem can keep data in any block, including the last ones. Removing the end of the device would remove part of that data, and only the operating system using the filesystem can move it first. So a claim sized for a peak keeps that size, and so does its bill. The habit that avoids this is to grow a claim as its data accumulates, instead of allocating a large volume up front.",
        },
        {
          kind: "p",
          text: "To get a smaller claim, copy the data to a new one. The data is unavailable from step 2 to step 5.",
        },
        {
          kind: "ol",
          items: [
            [
              "Set the old claim’s PV to ",
              { code: "Retain" },
              ", with the patch in the StatefulSet section, so deleting the claim later keeps the disk.",
            ],
            [
              "Scale the workload to zero so nothing writes during the copy. In a StatefulSet whose ",
              { code: "persistentVolumeClaimRetentionPolicy" },
              " sets ",
              { code: "whenScaled: Delete" },
              ", scaling down deletes the claims of the removed pods, so set it to ",
              { code: "Retain" },
              " before you scale.",
            ],
            "Create a claim in the same class, sized to the data plus the headroom you want.",
            [
              "Run a one-off pod that mounts both claims and copies the files across, with a tool that keeps ownership, permissions and links. The rsync flags for that are in ",
              { a: "how to shrink an EBS volume", href: "/learn/shrink-ebs-volume" },
              ". With ",
              { code: "WaitForFirstConsumer" },
              ", the new disk is created when this pod starts.",
            ],
            [
              "Point the workload’s ",
              { code: "claimName" },
              " at the new claim and scale it back up.",
            ],
            [
              "Delete the old claim once you trust the copy. Because its PV is set to ",
              { code: "Retain" },
              ", the PV becomes Released and keeps the disk, and deleting the PV leaves the disk in place too. Delete the disk itself in Azure or AWS last, since its data goes with it. Until then it stays provisioned, and the cloud keeps billing it.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "In a StatefulSet the claim’s name is fixed, so the new disk has to end up behind a claim with the old name. After the copy, delete the old claim, whose PV you set to ",
            { code: "Retain" },
            ". Then set the new PV to ",
            { code: "Retain" },
            ", delete the temporary claim, clear that PV’s ",
            { code: "claimRef" },
            ", and create a claim under the original name, in the same class and at the new size, whose ",
            { code: "volumeName" },
            " is that PV. Once it binds, restore that PV’s reclaim policy. These are the steps the Kubernetes docs give for binding a recreated claim to an existing PV after a failed expansion. Last, delete the StatefulSet with ",
            { code: "--cascade=orphan" },
            " and apply it again with the smaller template size and its usual replica count.",
          ],
        },
        {
          kind: "p",
          text: [
            "The same rule holds at the cloud level, covered for ",
            { a: "Azure managed disks", href: "/learn/shrink-azure-managed-disk" },
            " and for ",
            { a: "EBS volumes", href: "/learn/shrink-ebs-volume" },
            ".",
          ],
        },
      ],
    },
    {
      id: "the-same-grow-only-rule-on-vm",
      title: "The same grow-only rule on VM data disks",
      blocks: [
        {
          kind: "p",
          text: [
            "Under an Azure Disk or EBS claim sits a cloud disk, and outside Kubernetes the same grow-only rule applies to a virtual machine’s (VM’s) data disks. ",
            { a: "Amoeba", href: "/amoeba" },
            ", Zoorik’s block storage optimization product, optimizes Azure managed disks and Amazon EBS. It works on VM data disks, not on PVCs. It moves a VM’s data disks onto one btrfs pool, sized from the highest use of the last 7\u00a0days so the pool sits inside its target band (80% to 90% full by default) with room for the largest recent 15-minute rise and at least 10\u00a0GiB free. The pool starts with two or more disks, managed disks on Azure or gp3\u00a0volumes on AWS, and Amoeba grows or adds a disk as the data grows and removes disks one at a time as it shrinks. On Linux, the one switch onto the pool restarts the systemd services that hold the data mounts.",
          ],
        },
        {
          kind: "p",
          text: "Coral, Zoorik’s Kubernetes optimization product, rebalances CPU and memory requests and drains spare nodes on AKS and EKS.",
        },
      ],
    },
  ],
  help: {
    product: "amoeba",
    text: "Amoeba moves a VM’s data disks onto one pool sized to your data, then rightsizes it autonomously, without any downtime after the one switch, one disk at a time. We estimate it takes 50–60% off block storage cost. It is an estimated range, not a promise. The free assessment works out your own figure.",
    links: [
      { label: "Block storage cost optimization with Amoeba", href: "/amoeba" },
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
      title: "How to shrink an EBS volume when AWS only lets it grow",
      where: "Learn",
      href: "/learn/shrink-ebs-volume",
    },
    {
      title: "AKS storage classes: which Azure disk each one creates",
      where: "Learn",
      href: "/learn/aks-storage-classes",
    },
    {
      title: "How to expand an Azure disk without downtime",
      where: "Learn",
      href: "/learn/azure-disk-expand-without-downtime",
    },
    {
      title: "How to increase EBS volume size without downtime on Linux",
      where: "Learn",
      href: "/learn/increase-ebs-volume-size",
    },
  ],
};
