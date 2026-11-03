import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/aks-storage-classes/1";
import { figure as figure2 } from "@/features/learn/figures/aks-storage-classes/2";

export const article: Article = {
  slug: "aks-storage-classes",
  title: "Kubernetes storage classes on AKS: disk types and cost",
  meta: "Kubernetes storage classes on AKS: the Azure disk each built-in class creates, when it is LRS or ZRS, what it costs, and how to write your own.",
  h1: "Kubernetes storage classes on AKS",
  deck: "A PVC sets the size. Its storage class sets the Azure disk type, redundancy and price.",
  card: "What each built-in AKS storage class creates in Azure, what it costs, and how to write your own.",
  product: "both",
  hub: "Kubernetes",
  topic: "Kubernetes storage",
  published: "2026-11-01",
  updated: "2026-11-03",
  author: "adil",
  cover: "/learn-covers/zoorik-learn-aks-storage-classes-1200x630.webp",
  coverAlt:
    "AKS storage classes: a PVC names a StorageClass, which sets the price of the Azure disk",
  short: [
    "A storage class in Kubernetes tells the cluster what kind of volume to create when a PersistentVolumeClaim (PVC) needs one. On AKS, the ",
    { code: "default" },
    " class creates a Standard SSD, ",
    { code: "managed-csi-premium" },
    " a Premium SSD, and ",
    { code: "managed-csi-premium-v2" },
    " (Kubernetes 1.35+) a Premium SSD v2. You pay for the disk by the size you provision, not the data on it.",
  ],
  sections: [
    {
      id: "aks-storage-classes",
      title: "Built-in storage classes",
      blocks: [
        {
          kind: "p",
          text: [
            "Each class is a StorageClass object. It names a provisioner and the parameters it uses when a ",
            { a: "persistent volume claim", href: "/learn/kubernetes-persistent-volume" },
            " needs a new volume. On AKS, Azure disks come from the Azure Disk CSI driver, ",
            { code: "disk.csi.azure.com" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "AKS has used the Container Storage Interface (CSI) drivers by default since Kubernetes 1.21. Since 1.26, it no longer supports creating volumes with the old in-tree drivers.",
        },
        {
          kind: "p",
          text: "AKS creates these classes in clusters that use the CSI drivers:",
        },
        {
          kind: "table",
          columns: [
            { label: "Class", width: "21%" },
            { label: "What it creates in Azure", width: "36%" },
            { label: "Notes", width: "43%" },
          ],
          rows: [
            [
              [{ code: "default" }],
              "Standard SSD managed disk",
              ["The cluster’s default class, the same as ", { code: "managed-csi" }],
            ],
            [
              [{ code: "managed-csi" }],
              "Standard SSD managed disk",
              "LRS, or ZRS on Kubernetes 1.29+ in a zone-spread cluster",
            ],
            [
              [{ code: "managed-csi-premium" }],
              "Premium SSD managed disk",
              "LRS, or ZRS on Kubernetes 1.29+ in a zone-spread cluster",
            ],
            [
              [{ code: "managed-csi-premium-v2" }],
              "Premium SSD v2 managed disk",
              "LRS only, Kubernetes 1.35 and later",
            ],
            [
              [{ code: "azurefile-csi" }],
              "Azure file share on Standard storage",
              "Can be shared by pods on several nodes",
            ],
            [
              [{ code: "azurefile-csi-premium" }],
              "Azure file share on Premium storage",
              "Can be shared by pods on several nodes",
            ],
            [
              [{ code: "azureblob-nfs-premium" }],
              "Blob Storage container, mounted over NFS v3",
              "Premium storage",
            ],
            [
              [{ code: "azureblob-fuse-premium" }],
              "Blob Storage container, mounted with BlobFuse",
              "Premium storage",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "The two ",
            { code: "azureblob-*" },
            " classes need the Azure Blob storage CSI driver. Turn it on with ",
            {
              code: "az aks update --name <cluster-name> --resource-group <resource-group> --enable-blob-driver",
            },
            ".",
          ],
        },
        {
          kind: "h3",
          id: "the-aks-storage-class-default",
          title: "The default class",
        },
        {
          kind: "p",
          text: [
            "A PVC that leaves out ",
            { code: "storageClassName" },
            " gets the class named ",
            { code: "default" },
            ", which creates the same disk as ",
            { code: "managed-csi" },
            ". ",
            { code: "kubectl get sc" },
            " lists it as ",
            { code: "default (default)" },
            ".",
          ],
        },
        { kind: "code", lang: "bash", code: "kubectl get sc" },
        {
          kind: "p",
          text: [
            "Setting ",
            { code: 'storageClassName: ""' },
            " is different: it turns off dynamic provisioning for that claim.",
          ],
        },
        {
          kind: "h3",
          id: "reclaim-policy-binding-mode-and-expansion",
          title: "Reclaim, binding and expansion",
        },
        { kind: "p", text: "The built-in disk classes also set these fields:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Reclaim policy." },
              " ",
              { code: "Delete" },
              ": the Azure disk goes when its persistent volume is deleted.",
            ],
            [
              { b: "Binding mode." },
              " ",
              { code: "WaitForFirstConsumer" },
              ": no disk exists until a pod uses the claim. The disk is then made where that pod is scheduled.",
            ],
            [
              { b: "Expansion." },
              " On in ",
              { code: "managed-csi" },
              " and ",
              { code: "managed-csi-premium" },
              ", so you grow a claim by editing its size.",
            ],
          ],
        },
        {
          kind: "p",
          text: "An Azure disk mounts as ReadWriteOnce, on one node at a time. Data that pods on several nodes share belongs on an Azure Files class.",
        },
      ],
    },
    {
      id: "whether-a-class-creates-lrs-or-zrs",
      title: "LRS or ZRS",
      blocks: [
        {
          kind: "p",
          text: "LRS (locally redundant storage) keeps three copies of a disk in one datacenter. ZRS (zone-redundant storage) copies it synchronously across three availability zones, so it can recover from a zone failure.",
        },
        {
          kind: "p",
          text: [
            "From Kubernetes 1.29, ",
            { code: "managed-csi" },
            " and ",
            { code: "managed-csi-premium" },
            " create ZRS disks instead of LRS in a cluster spread across availability zones. ",
            { code: "managed-csi-premium-v2" },
            " stays LRS, because Premium SSD v2 has no ZRS.",
          ],
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: "Microsoft notes that ZRS “comes at a higher cost” than LRS, and its writes have more latency. In return, the Azure Disk CSI driver can schedule a ZRS disk onto a node in any zone. An LRS disk must sit in its node’s zone, so its pod stays in that zone.",
        },
        {
          kind: "p",
          text: [
            { a: "Azure disk LRS vs ZRS", href: "/learn/azure-disk-lrs-vs-zrs" },
            " compares the two in depth.",
          ],
        },
      ],
    },
    {
      id: "what-an-aks-persistent-volume-costs",
      title: "What a volume costs",
      blocks: [
        {
          kind: "p",
          text: [
            "A persistent volume on an Azure disk is charged as a ",
            { a: "managed disk", href: "/learn/glossary/azure-managed-disk" },
            ". You pay for the size you provision, not the data it holds.",
          ],
        },
        {
          kind: "p",
          text: [
            "For Premium SSD, Standard SSD and Standard HDD, Azure rounds that size up to the next ",
            { a: "size tier", href: "/learn/glossary/azure-disk-sizes" },
            " and charges for the tier.",
          ],
        },
        {
          kind: "p",
          text: [
            "Say a Helm chart’s claim asks for ",
            { code: "200Gi" },
            " and names no class. It gets the default class, a Standard SSD. Azure charges for it as an E15, the 256 GiB tier: 56 GiB the claim never asked for.",
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: [
            "Standard SSD and Standard HDD also charge per transaction, up to an hourly cap. ",
            { a: "Premium SSD vs Standard SSD", href: "/learn/premium-ssd-vs-standard-ssd-azure" },
            " compares the two tiered SSD types.",
          ],
        },
        {
          kind: "p",
          text: "Premium SSD v2 has no size tiers. You pay for each GiB you provision, plus IOPS above 3,000 and throughput above 125 MB/s.",
        },
        {
          kind: "p",
          text: [
            "The ",
            { a: "Azure disk pricing calculator", href: "/ebs-and-azure-disk-pricing" },
            " shows the tier a Premium SSD or Standard SSD size lands in, and its monthly price.",
          ],
        },
        {
          kind: "h3",
          id: "one-600-gib-claim-on-two-classes",
          title: "One 600 GiB claim, two classes",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: [
            "A ",
            { code: "600Gi" },
            " claim on ",
            { code: "managed-csi-premium" },
            " lands in the P30 tier, so Azure charges for 1,024 GiB. That’s 1,024 − 600 = 424 GiB, or 424 ÷ 1,024 = 41%, that the claim never asked for.",
          ],
        },
        {
          kind: "p",
          text: [
            "On ",
            { code: "managed-csi-premium-v2" },
            " you pay for 600 GiB, plus any IOPS and throughput above the included 3,000 and 125 MB/s. The two types have different price lists, so compare them in ",
            { a: "Premium SSD v2 vs Premium SSD", href: "/learn/premium-ssd-v2-vs-premium-ssd" },
            " before you choose.",
          ],
        },
        {
          kind: "h3",
          id: "the-size-you-request-is-a-floor",
          title: "Claims only grow",
        },
        {
          kind: "p",
          text: "Once the disk exists, its size can only go up. Microsoft states that “reducing the size of a PVC isn’t supported due to the risk of data loss.” Kubernetes doesn’t support shrinking a claim either.",
        },
        {
          kind: "p",
          text: "On AKS, a Standard HDD, Standard SSD or Premium SSD volume grows without downtime up to 4 TiB. Growing one beyond 4 TiB needs the disk unmounted and detached first. Premium SSD v2 and Ultra Disk volumes don’t have that limit.",
        },
        {
          kind: "p",
          text: [
            { a: "How to resize a PVC in Kubernetes", href: "/learn/resize-pvc-kubernetes" },
            " covers the steps.",
          ],
        },
        {
          kind: "h3",
          id: "disks-that-outlive-their-claim",
          title: "Disks that outlive their claim",
        },
        {
          kind: "p",
          text: [
            "The reclaim policy decides what happens after the claim. With ",
            { code: "Delete" },
            ", the disk goes with the PV. With ",
            { code: "Retain" },
            ", deleting the PVC leaves the PV in the Released state.",
          ],
        },
        {
          kind: "p",
          text: [
            "Kubernetes notes that the storage asset “still exists after the PV is deleted.” You keep paying for that disk until someone deletes it. ",
            { a: "Finding unattached disks in Azure", href: "/learn/find-unattached-disks-azure" },
            " shows how to find them.",
          ],
        },
        {
          kind: "p",
          text: [
            "Volume snapshots add ",
            { a: "their own cost", href: "/learn/azure-disk-snapshot-cost" },
            ". The driver takes incremental snapshots by default, and Azure charges for a snapshot by the space it uses.",
          ],
        },
      ],
    },
    {
      id: "aks-storage-class-parameters-that-change-the",
      title: "Parameters that change cost",
      blocks: [
        {
          kind: "p",
          text: "The Azure Disk CSI driver applies a class’s parameters when it creates a disk. Microsoft notes that updating the class later “affects only newly provisioned volumes.”",
        },
        {
          kind: "table",
          columns: [
            { label: "Setting", width: "16%" },
            { label: "What it sets", width: "44%" },
            { label: "Effect on cost", width: "40%" },
          ],
          rows: [
            [
              [{ code: "skuName" }],
              [
                "Disk type and redundancy: ",
                { code: "Standard_LRS" },
                " (Standard HDD), ",
                { code: "StandardSSD_LRS" },
                ", ",
                { code: "StandardSSD_ZRS" },
                ", ",
                { code: "Premium_LRS" },
                ", ",
                { code: "Premium_ZRS" },
                ", ",
                { code: "PremiumV2_LRS" },
                " or ",
                { code: "UltraSSD_LRS" },
                ". Default ",
                { code: "StandardSSD_LRS" },
                ".",
              ],
              "Chooses the disk’s price list and how it is charged",
            ],
            [
              [{ code: "DiskIOPSReadWrite" }, ", ", { code: "DiskMBpsReadWrite" }],
              "IOPS and throughput for Premium SSD v2 and Ultra Disk",
              "Premium SSD v2 includes 3,000 IOPS and 125 MB/s. More raises its price.",
            ],
            [
              [{ code: "enableBursting" }],
              "On-demand bursting, for Premium SSD larger than 512 GiB. Off by default.",
              "An hourly fee while it’s on, plus charges for I/O above the disk’s provisioned target",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "The built-in ",
            { code: "managed-csi-premium" },
            " leaves on-demand bursting off. Its disks of 512 GiB and smaller still get credit-based bursting, at no extra charge.",
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "AKS “reconciles the default storage classes and will overwrite any changes you make to those storage classes,” say Microsoft’s docs. To get a different disk, create your own class.",
        },
        {
          kind: "h3",
          id: "write-your-own-zrs-or-lrs-class",
          title: "Write your own class",
        },
        {
          kind: "p",
          text: [
            "Microsoft’s example class uses ",
            { code: "Premium_ZRS" },
            ". The same pattern gives the LRS class below, for a zone-spread cluster where the less expensive disk fits better.",
          ],
        },
        {
          kind: "code",
          lang: "yaml",
          code: "apiVersion: storage.k8s.io/v1\nkind: StorageClass\nmetadata:\n  name: managed-csi-lrs\nprovisioner: disk.csi.azure.com\nparameters:\n  skuName: StandardSSD_LRS\nreclaimPolicy: Delete\nvolumeBindingMode: WaitForFirstConsumer\nallowVolumeExpansion: true",
        },
        {
          kind: "ol",
          items: [
            [
              "Set ",
              { code: "skuName" },
              " to ",
              { code: "StandardSSD_ZRS" },
              " or ",
              { code: "Premium_ZRS" },
              " for a ZRS class, or to ",
              { code: "Premium_LRS" },
              " for Premium SSD. For Premium SSD v2, set ",
              { code: "PremiumV2_LRS" },
              " and add ",
              { code: "cachingMode: None" },
              ".",
            ],
            [
              "Keep ",
              { code: "WaitForFirstConsumer" },
              ". Left unset, Kubernetes binds with ",
              { code: "Immediate" },
              ", which creates the disk as soon as the claim exists. For storage bound to a zone, Kubernetes warns that this “may result in unschedulable Pods.”",
            ],
            ["Create the class with ", { code: "kubectl apply -f <file>.yaml" }, "."],
            ["Put its name in the claim’s ", { code: "storageClassName" }, "."],
          ],
        },
        {
          kind: "callout",
          label: "For engineers",
          text: [
            "To make a class you wrote the default, add the annotation ",
            { code: 'storageclass.kubernetes.io/is-default-class: "true"' },
            ". Kubernetes advises keeping a single default class. If several carry the annotation, a claim with no class gets the most recently created one.",
          ],
        },
      ],
    },
    {
      id: "how-to-see-the-class-and-disk",
      title: "Find a PVC’s class and disk",
      blocks: [
        {
          kind: "p",
          text: "To trace each claim to its class and its Azure disk:",
        },
        {
          kind: "ol",
          items: [
            [
              { b: "List the claims." },
              " The STORAGECLASS column names each claim’s class. CAPACITY gives its size, and VOLUME names the PV bound to it.",
            ],
          ],
        },
        { kind: "code", lang: "bash", code: "kubectl get pvc --all-namespaces" },
        {
          kind: "ol",
          start: 2,
          items: [
            [
              { b: "Read the class." },
              " Its YAML shows the provisioner and parameters, including ",
              { code: "skuName" },
              " where the class sets one.",
            ],
          ],
        },
        { kind: "code", lang: "bash", code: "kubectl get storageclass <class-name> -o yaml" },
        {
          kind: "ol",
          start: 3,
          items: [
            [
              { b: "Find the disk." },
              " A PV’s ",
              { code: "volumeHandle" },
              " is the Azure resource ID of its managed disk, in the form below. Open that disk in Azure to confirm its type, redundancy and size.",
            ],
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl get pv <pv-name> -o jsonpath='{.spec.csi.volumeHandle}'",
        },
        {
          kind: "code",
          lang: "text",
          code: "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Compute/disks/<disk-name>",
        },
        {
          kind: "p",
          text: "Disks also count against nodes. Depending on the VM size, the driver can have a per-node volume limit: the size’s Max data disks figure. Microsoft gives 64 volumes for some 16-core sizes.",
        },
        {
          kind: "p",
          text: [
            { code: "kubectl get CSINode <node-name> -o yaml" },
            " shows a node’s limit. Many small claims on small VM sizes can use up the disk slots before the CPU or memory.",
          ],
        },
      ],
    },
    {
      id: "which-class-to-name-in-a-pvc",
      title: "Which class to choose",
      blocks: [
        {
          kind: "p",
          text: "Name a class in every claim, and in every chart’s values, so no default picks your disk type. Then choose by what the data needs:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Shared by pods on several nodes." },
              " Use ",
              { code: "azurefile-csi" },
              " or ",
              { code: "azurefile-csi-premium" },
              ". An Azure disk mounts on one node.",
            ],
            [
              { b: "Dev, test and lightly used services." },
              " Use ",
              { code: "managed-csi" },
              ". Microsoft lists Standard SSD for web servers, lightly used enterprise applications, and development and test environments.",
            ],
            [
              { b: "Production data that doesn’t need ZRS." },
              " Try Premium SSD v2 first, where your region and node pool zones offer it. Use ",
              { code: "managed-csi-premium-v2" },
              " on Kubernetes 1.35 and later, or your own class with ",
              { code: "PremiumV2_LRS" },
              ". Microsoft says it can provide the best price performance for most general purpose workloads. It has no size tiers and no host caching. It is LRS only, so each pod stays in its disk’s zone.",
            ],
            [
              { b: "Production data that needs ZRS, or where Premium SSD v2 isn’t offered." },
              " Use ",
              { code: "managed-csi-premium" },
              " (ZRS on 1.29+ in a zone-spread cluster) or your own class with ",
              { code: "Premium_ZRS" },
              ".",
            ],
            [
              { b: "Data your application already replicates across zones." },
              " Your own LRS class fits, if each pod can stay in its disk’s zone. Otherwise keep ZRS.",
            ],
          ],
        },
      ],
    },
    {
      id: "where-coral-and-amoeba-fit",
      title: "Where Coral and Amoeba fit",
      blocks: [
        {
          kind: "p",
          text: "Neither product changes your storage classes.",
        },
        {
          kind: "h3",
          id: "how-coral-handles-pods-with-azure-disks",
          title: "Coral and Azure disks",
        },
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " rebalances CPU and memory requests on AKS and EKS, and removes the nodes you don’t need. It changes only CPU and memory, so each PVC keeps its class, size and disk.",
          ],
        },
        {
          kind: "p",
          text: "Azure disks still shape how Coral applies a new size. On Kubernetes 1.33 and later, it resizes a running pod in place. Where it can’t, a single-replica pod with an Azure disk gets its new size at its next restart.",
        },
        {
          kind: "p",
          text: [
            "When Coral removes a node, it can’t start a new copy of a pod with an Azure disk first. The pod moves by live migration where both nodes support it. Otherwise it is evicted within its ",
            { a: "PodDisruptionBudget", href: "/learn/glossary/pod-disruption-budget" },
            " and gets a short restart. For what requests and nodes cost, see ",
            { a: "Kubernetes cost optimization", href: "/kubernetes-cost-optimization" },
            ".",
          ],
        },
        { kind: "h3", id: "amoeba-works-on-vm-data-disks", title: "Amoeba and VM data disks" },
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " rightsizes block storage on Azure and AWS: the data disks of running Windows and Linux VMs. It moves a VM’s data disks onto one btrfs pool sized to your data.",
          ],
        },
        {
          kind: "p",
          text: "It grows the pool before it fills, and shrinks it one disk at a time when your data goes down and stays down.",
        },
        {
          kind: "p",
          text: "On Azure the pool uses Premium SSD v2 where your VM’s region and zone offer it, and Premium SSD otherwise. Its disks are always LRS, so data moved from ZRS disks loses zone redundancy.",
        },
      ],
    },
  ],
  sources: [
    {
      publisher: "Microsoft Learn",
      title: "“Concepts - Storage in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/concepts-storage",
    },
    {
      publisher: "Microsoft Learn",
      title:
        "“Create and Manage Persistent Volumes with Azure Disks in Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/create-volume-azure-disk",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Use Container Storage Interface (CSI) Drivers on Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/csi-storage-drivers",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Enable Premium SSD v2 support on Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/use-premium-v2-disks",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Select a disk type for Azure IaaS VMs - managed disks”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-types",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Redundancy options for Azure managed disks”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disks-redundancy",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Managed disk bursting”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/disk-bursting",
    },
    {
      publisher: "Kubernetes",
      title: "“Storage Classes”",
      url: "https://kubernetes.io/docs/concepts/storage/storage-classes/",
    },
    {
      publisher: "Kubernetes",
      title: "“Persistent Volumes”",
      url: "https://kubernetes.io/docs/concepts/storage/persistent-volumes/",
    },
  ],
  related: [
    {
      title: "Kubernetes persistent volumes and PVCs",
      where: "Learn",
      href: "/learn/kubernetes-persistent-volume",
    },
    {
      title: "Azure LRS vs ZRS for managed disks",
      where: "Learn",
      href: "/learn/azure-disk-lrs-vs-zrs",
    },
    {
      title: "Azure Premium SSD vs Standard SSD",
      where: "Learn",
      href: "/learn/premium-ssd-vs-standard-ssd-azure",
    },
    {
      title: "Premium SSD v2 vs Premium SSD",
      where: "Learn",
      href: "/learn/premium-ssd-v2-vs-premium-ssd",
    },
    {
      title: "Expand a PVC in Kubernetes",
      where: "Learn",
      href: "/learn/resize-pvc-kubernetes",
    },
  ],
  relatedTitle: "More on AKS storage",
};
