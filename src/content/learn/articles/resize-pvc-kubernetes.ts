import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/resize-pvc-kubernetes/1";
import { figure as figure2 } from "@/features/learn/figures/resize-pvc-kubernetes/2";
import { figure as figure3 } from "@/features/learn/figures/resize-pvc-kubernetes/3";

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
  published: "2026-11-01",
  updated: "2026-11-01",
  author: "shashank",
  cover: "/learn-covers/zoorik-learn-resize-pvc-kubernetes-1200x630.webp",
  coverAlt: "Resize a PVC: you can grow it, but not shrink it",
  short: [
    "To resize a PVC (PersistentVolumeClaim) in Kubernetes, raise its storage request once its StorageClass sets ",
    { code: "allowVolumeExpansion: true" },
    " and its storage driver supports expansion. The disk and its filesystem grow, and the pod can keep running, but a PVC can’t shrink: a smaller claim means copying the data.",
  ],
  sections: [
    {
      id: "resize-pvc-kubernetes",
      title: "What you need to resize a PVC in Kubernetes",
      blocks: [
        {
          kind: "p",
          text: "Picture a database pod on Azure Kubernetes Service (AKS) whose 100Gi claim is nearly full. You raise its request to 200Gi, the disk behind it grows, and the pod can keep running.",
        },
        {
          kind: "p",
          text: "If the data later drops back, the claim and its disk stay at 200Gi. You keep paying for the larger disk.",
        },
        {
          kind: "p",
          text: "A PVC is a request for storage. The PersistentVolume (PV) bound to it is the storage that serves it, usually a cloud disk.",
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
              " Kubernetes accepts a larger size only for claims whose StorageClass sets ",
              { code: "allowVolumeExpansion" },
              " to true.",
            ],
            [
              { b: "The driver supports it." },
              " Kubernetes leaves expansion to each Container Storage Interface (CSI) driver. The Azure Disk driver on AKS and the Amazon Elastic Block Store (EBS) driver both support it.",
            ],
            [
              { b: "The filesystem can grow." },
              " If the volume holds a filesystem, it’s XFS, ext3 or ext4, the three Kubernetes can resize.",
            ],
          ],
        },
      ],
    },
    {
      id: "how-to-expand-a-pvc-in-kubernetes",
      title: "How to expand a PVC in Kubernetes",
      blocks: [
        { kind: "p", text: "Check the class, then patch the claim:" },
        {
          kind: "ol",
          items: [
            {
              text: [
                "Find the claim’s class in the STORAGECLASS column of ",
                { code: "kubectl get pvc" },
                ", then check the class’s YAML:",
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
              text: [
                "If ",
                { code: "allowVolumeExpansion: true" },
                " is missing, add it to the existing class:",
              ],
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
          text: "Kubernetes resizes the volume that already backs the claim. In the docs’ words, “a new PersistentVolume is never created to satisfy the claim.”",
        },
        {
          kind: "p",
          text: "The CSI driver expands the cloud disk, then the filesystem grows on the node. That second step happens when a pod starts with the claim, or while the pod runs if the filesystem can grow while mounted. A claim that no pod uses can’t finish expanding until a pod mounts it.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "callout",
          label: "Watch out",
          text: "Edit the claim, never the PV: the Kubernetes docs warn that a hand-edited PV capacity can stop the resize. The control plane then sees matching sizes and concludes the disk was already grown.",
        },
        {
          kind: "p",
          text: "If you ask for more than the storage system can supply, Kubernetes keeps retrying. On Kubernetes 1.32 or later, you can then retry with a smaller request than the one that failed.",
        },
        {
          kind: "p",
          text: [
            "The new request must still be higher than the claim’s ",
            { code: ".status.capacity" },
            ". This recovery is beta and on by default in 1.32, and stable since 1.34.",
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
            "On AKS, an expansion request goes to the Azure Disk CSI driver. Microsoft’s docs say the built-in ",
            { code: "managed-csi" },
            " class “already supports expansion.”",
          ],
        },
        { kind: "p", text: "Of the other built-in classes:" },
        {
          kind: "ul",
          items: [
            "The default class creates Standard SSD disks.",
            [{ code: "managed-csi-premium" }, " creates Premium SSD."],
            [
              { code: "managed-csi-premium-v2" },
              " provisions Premium SSD v2, on Kubernetes 1.35 or later.",
            ],
          ],
        },
        {
          kind: "p",
          text: "The limit to know is 4\u00a0TiB. A Standard HDD, Standard SSD or Premium SSD volume grows without downtime while the new size stays at 4\u00a0TiB or less.",
        },
        {
          kind: "p",
          text: "Growing one of those from 4\u00a0TiB or less to more than 4\u00a0TiB means unmounting the disk and detaching it from the node. So you scale the workload to zero replicas before you patch the claim.",
        },
        {
          kind: "p",
          text: [
            "Premium SSD v2 and Ultra Disk volumes don’t have that limit. The disk-level steps are in ",
            {
              a: "how to expand an Azure disk without downtime",
              href: "/learn/azure-disk-expand-without-downtime",
            },
            ".",
          ],
        },
        {
          kind: "h3",
          id: "how-azure-charges-for-the-new-size",
          title: "How Azure charges for the new size",
        },
        {
          kind: "p",
          text: [
            "The size you pick also sets what you pay, and not one GiB at a time. Azure charges for a managed disk on its provisioned size, rounded up to the nearest offered ",
            { a: "disk size", href: "/learn/glossary/azure-disk-sizes" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "Premium SSD v2 is charged per GiB, so it doesn’t round. ",
            { a: "Which disk each AKS class creates", href: "/learn/aks-storage-classes" },
            " covers each built-in class’s disk type and redundancy.",
          ],
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "The 200Gi patch above, on the default class, matches Microsoft’s own example. A 200\u00a0GiB Standard SSD maps to E15 and is charged as 256\u00a0GiB.",
        },
        {
          kind: "p",
          text: "Of the 256\u00a0GiB you pay for, 56\u00a0GiB (256 − 200) is space the claim can’t use. A 128\u00a0GiB claim sits exactly on E10. Growing it to 130\u00a0GiB moves it to E15: twice the capacity (256 ÷ 128) for 2\u00a0GiB more room.",
        },
        {
          kind: "p",
          text: [
            "So when you grow a Standard SSD or Premium SSD claim, ask for the full size of the tier you pay for. Here that’s 256\u00a0GiB. To price other sizes, use the ",
            { a: "Azure disk pricing calculator", href: "/ebs-and-azure-disk-pricing" },
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
          text: [
            "On Amazon Elastic Kubernetes Service (EKS) with the Amazon EBS CSI driver, a class like this one creates ",
            { a: "gp3", href: "/learn/glossary/ebs-gp3" },
            " volumes and allows expansion:",
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
            "Naming ",
            { code: "type" },
            " keeps the class readable, though the driver creates gp3 when none is given. Unless you set them, the filesystem is ext4 and a gp3\u00a0volume’s throughput is 125\u00a0MiB/s.",
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
            ", you can set ",
            { code: "allowAutoIOPSIncreaseOnModify" },
            " to ",
            { code: '"true"' },
            ". That lets the driver adjust IOPS as the volume grows, so the IOPS-per-GiB ratio holds.",
          ],
        },
        {
          kind: "p",
          text: [
            "You expand a claim of this class like any other. ",
            { a: "Growing an EBS volume in place", href: "/learn/increase-ebs-volume-size" },
            " covers what happens to the volume underneath. The case for gp3 over gp2 is in ",
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
            "You can’t resize a StatefulSet’s claims through its template: the API server treats ",
            { code: "volumeClaimTemplates" },
            " as immutable and rejects the edit. Each pod gets its own claim from that template.",
          ],
        },
        {
          kind: "p",
          text: [
            "The claim is named after the template, the StatefulSet and the pod’s ordinal, such as ",
            { code: "www-web-0" },
            " for pod ",
            { code: "web-0" },
            ". So grow the claims that exist, then recreate the StatefulSet object around its pods.",
          ],
        },
        { kind: "svg", figure: figure2 },
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
              ", so new replicas get claims at that size. The recreated StatefulSet adopts pods that are Running and Ready. A pod it relaunches mounts its original volume again, as the Kubernetes StatefulSet tutorial shows.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "When the claims show the new size, set each PV’s reclaim policy back to what it was. A dynamically provisioned PV inherits its class’s policy, which defaults to ",
            { code: "Delete" },
            ". A PV left on ",
            { code: "Retain" },
            " keeps its disk, and its cost, after the claim is gone.",
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
          text: "No. The Kubernetes docs say “Kubernetes does not support shrinking a PVC to less than its current size.”",
        },
        {
          kind: "p",
          text: "Microsoft’s AKS docs give the reason, “due to the risk of data loss,” and show this error for a smaller patch:",
        },
        {
          kind: "code",
          lang: "text",
          code: 'The persistentVolumeClaim "pvc-azuredisk" is invalid: spec.resources.requests.storage: Forbidden: field can not be less than previous value.',
        },
        { kind: "p", text: "So a claim sized for a peak keeps that size, and so does its cost." },
        { kind: "h3", id: "why-a-claim-cant-shrink", title: "Why a claim can’t shrink" },
        {
          kind: "p",
          text: "The disk underneath is a block device whose filesystem can keep data in any block, including the last ones.",
        },
        {
          kind: "p",
          text: "Removing the end of the device would remove part of that data. Only the operating system using the filesystem can move it first.",
        },
        {
          kind: "p",
          text: [
            "So grow a claim as its data accumulates, instead of allocating a large volume up front. The cloud disks underneath can’t shrink in place either: see ",
            { a: "Azure managed disks", href: "/learn/shrink-azure-managed-disk" },
            " and ",
            { a: "EBS volumes", href: "/learn/shrink-ebs-volume" },
            ".",
          ],
        },
        {
          kind: "h3",
          id: "how-to-move-the-data-to-a",
          title: "How to move the data to a smaller claim",
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
              ", with the patch in the StatefulSet section, so deleting the claim later keeps the disk.",
            ],
            [
              "Scale the workload to zero so nothing writes during the copy. A StatefulSet’s ",
              { code: "persistentVolumeClaimRetentionPolicy" },
              " may set ",
              { code: "whenScaled: Delete" },
              ". If it does, scaling down deletes the claims of the removed pods, so set it to ",
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
              ", the PV becomes Released and keeps the disk. Deleting the PV leaves the disk in place too. Delete the disk itself in Azure or AWS last, since its data goes with it. Until then it stays provisioned, and the cloud keeps charging for it.",
            ],
          ],
        },
        {
          kind: "h3",
          id: "keep-the-claim-name-in-a-statefulset",
          title: "Keep the claim name in a StatefulSet",
        },
        {
          kind: "p",
          text: "In a StatefulSet the claim’s name is fixed, so the new disk has to end up behind a claim with the old name. The Kubernetes docs give these steps for binding a recreated claim to an existing PV after a failed expansion.",
        },
        { kind: "p", text: "After the copy:" },
        {
          kind: "ol",
          items: [
            ["Delete the old claim, whose PV you set to ", { code: "Retain" }, "."],
            ["Set the new PV to ", { code: "Retain" }, ", then delete the temporary claim."],
            ["Clear that PV’s ", { code: "claimRef" }, "."],
            [
              "Create a claim under the original name, in the same class and at the new size, whose ",
              { code: "volumeName" },
              " is that PV.",
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
      title: "The same grow-only rule on VM data disks",
      blocks: [
        {
          kind: "p",
          text: "An Azure Disk or EBS claim sits on a cloud disk. Outside Kubernetes, the same grow-only rule applies to a virtual machine’s (VM’s) data disks.",
        },
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            ", Zoorik’s block storage optimization product, optimizes Azure managed disks and Amazon EBS volumes. It works on the data disks of Windows and Linux VMs, not on PVCs, and never touches the OS disk or root volume.",
          ],
        },
        {
          kind: "p",
          text: "Amoeba moves a VM’s data disks onto one btrfs pool sized to your data, with room to grow. It copies your data while your services run. Then it switches each mount to the pool, with a short restart of the services that use it.",
        },
        {
          kind: "p",
          text: "After that, it grows the pool before it fills, and sooner when data arrives fast. When your data goes down and stays down, it shrinks the pool one disk at a time. So you pay for close to what you use.",
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
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            ", Zoorik’s Kubernetes optimization product, rebalances CPU and memory requests and drains spare nodes on AKS and EKS. For the compute side of a cluster’s cost, see ",
            { a: "Kubernetes cost optimization", href: "/kubernetes-cost-optimization" },
            ".",
          ],
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
