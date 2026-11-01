import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/aks-storage-classes/1";
import { figure as figure2 } from "@/features/learn/figures/aks-storage-classes/2";

export const article: Article = {
  slug: "aks-storage-classes",
  title: "AKS storage classes: which Azure disk each creates",
  meta: "AKS storage classes decide the Azure disk behind each PVC: its type, LRS or ZRS, and price. See what each Kubernetes storage class creates, and write your own.",
  h1: "AKS storage classes: which Azure disk each one creates",
  deck: "What managed-csi and the other built-in classes create in Azure, and how the class sets a volume’s price.",
  card: "What each built-in AKS storage class creates in Azure, what it costs, and how to write a ZRS or LRS class.",
  product: "both",
  hub: "Kubernetes",
  topic: "Kubernetes storage",
  published: "2026-11-01",
  updated: "2026-11-01",
  author: "adil",
  cover: "/learn-covers/zoorik-learn-aks-storage-classes-1200x630.webp",
  coverAlt:
    "AKS storage classes: a PVC names a StorageClass, which sets the price of the Azure disk",
  short: [
    "AKS storage classes pick the Azure storage behind each Persistent Volume Claim (PVC): its type and redundancy, which with the size largely set the price. The ",
    { code: "default" },
    " class creates a Standard SSD, ",
    { code: "managed-csi-premium" },
    " a Premium SSD, and ",
    { code: "managed-csi-premium-v2" },
    " (Kubernetes 1.35+) a Premium SSD v2.",
  ],
  sections: [
    {
      id: "aks-storage-classes",
      title: "What the built-in AKS storage classes create in Azure",
      blocks: [
        {
          kind: "p",
          text: [
            "Picture a Helm chart whose claim asks for ",
            { code: "200Gi" },
            " and names no storage class. That claim gets the cluster’s default class, which creates a Standard SSD. Azure charges for that disk as an E15, the 256\u00a0GiB tier, from the day it’s created.",
          ],
        },
        {
          kind: "p",
          text: "So the chart set only the size. Its class picked the disk type and redundancy. Azure’s size tier added 56\u00a0GiB (256 − 200) that the claim never asked for.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "h3",
          id: "what-a-kubernetes-storage-class-is",
          title: "What a Kubernetes storage class is",
        },
        {
          kind: "p",
          text: [
            "A storage class is a Kubernetes StorageClass object. It names a provisioner and the parameters it uses when a claim needs a new volume. For Azure disks the provisioner is the Azure Disk CSI driver, ",
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
          text: "Microsoft lists the classes AKS creates in clusters that use the CSI drivers:",
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
          kind: "h3",
          id: "the-aks-storage-class-default",
          title: "The default storage class in AKS",
        },
        {
          kind: "p",
          text: [
            "A PVC that leaves out ",
            { code: "storageClassName" },
            " gets the class named ",
            { code: "default" },
            ". ",
            { code: "kubectl get sc" },
            " lists it as ",
            { code: "default (default)" },
            ". It creates the same disk as ",
            { code: "managed-csi" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "A claim that sets ",
            { code: 'storageClassName: ""' },
            " is different. Kubernetes treats it as asking for no dynamic provisioning.",
          ],
        },
        { kind: "code", lang: "bash", code: "kubectl get sc" },
        {
          kind: "p",
          text: [
            "The two ",
            { code: "azureblob-*" },
            " classes come with the Azure Blob storage CSI driver. You turn it on with ",
            {
              code: "az aks update --name <cluster-name> --resource-group <resource-group> --enable-blob-driver",
            },
            ". A cluster without that driver may not list them.",
          ],
        },
        {
          kind: "h3",
          id: "reclaim-policy-binding-mode-and-expansion",
          title: "Reclaim policy, binding mode and expansion",
        },
        { kind: "p", text: "The built-in disk classes also set these fields:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Reclaim policy." },
              " ",
              { code: "Delete" },
              ", so the Azure disk goes when its persistent volume is deleted.",
            ],
            [
              { b: "Binding mode." },
              " ",
              { code: "WaitForFirstConsumer" },
              ", so no disk is created until a pod uses the claim. The disk is then made where that pod is scheduled.",
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
          text: "An Azure disk mounts as ReadWriteOnce, on one node at a time. Data that pods on several nodes must share belongs on an Azure Files class.",
        },
      ],
    },
    {
      id: "whether-a-class-creates-lrs-or-zrs",
      title: "Whether a class creates LRS or ZRS depends on the cluster",
      blocks: [
        {
          kind: "p",
          text: "An LRS disk, for locally redundant storage, keeps three copies in one datacenter. A ZRS disk, for zone-redundant storage, is copied synchronously across three availability zones and can recover from a zone failure.",
        },
        {
          kind: "p",
          text: [
            "From Kubernetes 1.29, ",
            { code: "managed-csi" },
            " and ",
            { code: "managed-csi-premium" },
            " create ZRS disks instead of LRS in a cluster deployed across availability zones. The ",
            { code: "managed-csi-premium-v2" },
            " class stays LRS, because Azure doesn’t support ZRS for Premium SSD v2.",
          ],
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: "Check your cluster’s classes with the commands below.",
        },
        {
          kind: "p",
          text: "Microsoft says ZRS “comes at a higher cost” than LRS, and ZRS writes have more latency. In return, the Azure Disk CSI driver can schedule a ZRS disk onto a node in any zone. An LRS disk must sit in the same zone as the node it attaches to, so its pod stays in that zone.",
        },
        {
          kind: "p",
          text: [
            { a: "Azure disk LRS vs ZRS", href: "/learn/azure-disk-lrs-vs-zrs" },
            " covers that trade in depth.",
          ],
        },
      ],
    },
    {
      id: "what-an-aks-persistent-volume-costs",
      title: "What an AKS persistent volume costs",
      blocks: [
        {
          kind: "p",
          text: [
            "A persistent volume (PV) on an Azure disk is charged as a ",
            { a: "managed disk", href: "/learn/glossary/azure-managed-disk" },
            ". You pay for the size you provision, not the data it holds.",
          ],
        },
        {
          kind: "p",
          text: [
            "For Premium SSD, Standard SSD and Standard HDD, Azure rounds that size up to the next ",
            { a: "size tier", href: "/learn/glossary/azure-disk-sizes" },
            ". You pay for the tier, so a ",
            { code: "10Gi" },
            " claim on ",
            { code: "managed-csi-premium" },
            " pays for a P3, the 16\u00a0GiB tier. The 200\u00a0GiB Standard SSD at the top of this page is Microsoft’s own example.",
          ],
        },
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
          text: "Premium SSD v2 has no size tiers. You pay for each GiB you provision, plus IOPS above 3,000 and throughput above 125\u00a0MB/s.",
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
          title: "One 600\u00a0GiB claim on two classes",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: [
            "A ",
            { code: "600Gi" },
            " claim on ",
            { code: "managed-csi-premium" },
            " lands in the P30 tier, so Azure charges for 1,024\u00a0GiB. That’s 1,024 − 600 = 424\u00a0GiB, or 424 ÷ 1,024 = 41%, that the claim never asked for.",
          ],
        },
        {
          kind: "p",
          text: [
            "On ",
            { code: "managed-csi-premium-v2" },
            " you pay for 600\u00a0GiB, plus any IOPS and throughput above the included 3,000 and 125\u00a0MB/s. The two types have different price lists, so compare them in ",
            { a: "Premium SSD v2 vs Premium SSD", href: "/learn/premium-ssd-v2-vs-premium-ssd" },
            " before you choose.",
          ],
        },
        {
          kind: "h3",
          id: "the-size-you-request-is-a-floor",
          title: "The size you request is a floor",
        },
        {
          kind: "p",
          text: "Once the disk exists, its size can only go up. Microsoft states that “reducing the size of a PVC isn’t supported due to the risk of data loss.” Kubernetes doesn’t support shrinking a claim either.",
        },
        {
          kind: "p",
          text: [
            "The size you request is the floor for the life of that volume. ",
            { a: "How to resize a PVC in Kubernetes", href: "/learn/resize-pvc-kubernetes" },
            " covers growing one.",
          ],
        },
        {
          kind: "p",
          text: "On AKS, a Standard SSD or Premium SSD volume grows without downtime. The exception is a resize from 4\u00a0TiB or less to more than 4\u00a0TiB, which needs the disk unmounted and detached first. Premium SSD v2\u00a0volumes don’t have that 4\u00a0TiB limit.",
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
      title: "AKS storage class parameters that change the cost",
      blocks: [
        {
          kind: "p",
          text: "The Azure Disk CSI driver applies a class’s parameters when it creates a disk. Microsoft notes that updating the storage class later “affects only newly provisioned volumes.” These AKS storage class parameters and fields move the price:",
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
              "Premium SSD v2 includes 3,000\u00a0IOPS and 125\u00a0MB/s, and more raises its price",
            ],
            [
              [{ code: "enableBursting" }],
              "On-demand bursting, for Premium SSD larger than 512\u00a0GiB. Off by default.",
              "An hourly fee while it’s on, plus charges for I/O above the disk’s provisioned target",
            ],
            [
              [{ code: "reclaimPolicy" }, " (a class field)"],
              [{ code: "Delete" }, " or ", { code: "Retain" }],
              [{ code: "Retain" }, " keeps the disk, and its charge, after the claim is gone"],
            ],
            [
              [{ code: "volumeBindingMode" }, " (a class field)"],
              [{ code: "WaitForFirstConsumer" }, " or ", { code: "Immediate" }],
              [{ code: "WaitForFirstConsumer" }, " creates no disk until a pod uses the claim"],
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "The built-in ",
            { code: "managed-csi-premium" },
            " leaves on-demand bursting off. Its disks of 512\u00a0GiB and smaller still get credit-based bursting, which carries no extra charge.",
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
          title: "Create your own Kubernetes storage class: ZRS or LRS",
        },
        {
          kind: "p",
          text: "Start from Microsoft’s own pattern to write an AKS ZRS storage class. The same pattern gives an LRS class for a zone-spread cluster where the less expensive disk fits better.",
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
              " for Premium SSD.",
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
            "To make a class you wrote a default, add the annotation ",
            { code: 'storageclass.kubernetes.io/is-default-class: "true"' },
            ".",
          ],
        },
        {
          kind: "p",
          text: "Kubernetes advises keeping a single default class. If several carry the annotation, a claim with no class gets the most recently created one.",
        },
      ],
    },
    {
      id: "how-to-see-the-class-and-disk",
      title: "How to see the class and disk behind each PVC",
      blocks: [
        {
          kind: "p",
          text: "To check the AKS PVC storage class of every claim, and the disk behind it:",
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
          text: "Disks also count against nodes. Depending on the VM size, the driver can have a per-node volume limit. Microsoft points to the size’s Max data disks figure for it, and gives 64\u00a0volumes for some 16-core sizes.",
        },
        {
          kind: "p",
          text: [
            { code: "kubectl get CSINode <node-name> -o yaml" },
            " shows a node’s limit. A cluster with many small claims on small VM sizes can run out of disk slots before it runs out of CPU or memory.",
          ],
        },
      ],
    },
    {
      id: "which-class-to-name-in-a-pvc",
      title: "Which StorageClass to name in a PVC",
      blocks: [
        {
          kind: "p",
          text: "Name a class in every claim, and in every chart’s values, so no default picks your disk type. Then pick it by what the data needs:",
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
              ", because an Azure disk mounts on one node.",
            ],
            [
              { b: "Dev, test and lightly used services." },
              " Use ",
              { code: "managed-csi" },
              ". Microsoft’s disk guide lists Standard SSD for web servers, lightly used enterprise applications, and development and test environments.",
            ],
            [
              { b: "Production data on Kubernetes 1.35 or later that doesn’t need ZRS." },
              " Try ",
              { code: "managed-csi-premium-v2" },
              " first, where your region and node pool zones support Premium SSD v2. Microsoft says it can provide the best price performance for most general purpose workloads. It has no size tier to round up to. It doesn’t support host caching, and it is LRS only, so each pod stays in its disk’s zone.",
            ],
            [
              {
                b: "Production data on older versions, where Premium SSD v2 isn’t offered, or that needs ZRS.",
              },
              " Use ",
              { code: "managed-csi-premium" },
              " (ZRS by the rule above) or a class of your own with ",
              { code: "Premium_ZRS" },
              ".",
            ],
            [
              { b: "Data your application already replicates across zones." },
              " Your own LRS class fits, accepting that each pod stays in its disk’s zone. Otherwise keep ZRS.",
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
          text: "Neither Zoorik product changes your storage classes, your PVCs or the Azure disks behind them.",
        },
        {
          kind: "h3",
          id: "how-coral-handles-pods-with-azure-disks",
          title: "How Coral handles pods with Azure disks",
        },
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " optimizes Kubernetes on AKS and EKS. It rebalances CPU and memory requests and drains spare nodes so your autoscaler can remove them. Its FAQ says it “changes only CPU and memory,” so each PVC keeps the class, size and disk type your claims and classes set.",
          ],
        },
        {
          kind: "p",
          text: "Azure disks still shape how Coral moves pods, because each one is ReadWriteOnce. The FAQ names “a ReadWriteOnce volume” as a case where Coral can’t safely resize a single-replica pod straight away. There, the new size “waits for the pod’s next natural restart.”",
        },
        {
          kind: "p",
          text: [
            "Each Azure disk mounts ReadWriteOnce, so when Coral drains a node, a single-replica pod that uses one is evicted within its ",
            { a: "PodDisruptionBudget", href: "/learn/glossary/pod-disruption-budget" },
            " and gets a short restart. To reduce what requests and nodes cost, see the ",
            { a: "Kubernetes cost optimization guide", href: "/kubernetes-cost-optimization" },
            ".",
          ],
        },
        { kind: "h3", id: "amoeba-works-on-vm-data-disks", title: "Amoeba works on VM data disks" },
        {
          kind: "p",
          text: [
            { a: "Amoeba", href: "/amoeba" },
            " optimizes block storage on Azure and AWS, for the data disks of running VMs. Those are Azure managed disks and Amazon EBS volumes, on Windows and Linux VMs.",
          ],
        },
        {
          kind: "p",
          text: "Amoeba moves a VM’s data disks onto one btrfs pool sized to your data, with room to grow. It grows the pool before it fills, and shrinks it one disk at a time when your data goes down and stays down. So you pay for close to what you use.",
        },
        {
          kind: "p",
          text: "On Azure the pool uses Premium SSD v2 where your VM’s region and zone offer it, and Premium SSD otherwise. Its disks are always locally redundant. Data that sat on ZRS disks therefore loses its zone redundancy, the same LRS trade described above.",
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
      title: "Azure disk LRS vs ZRS: what zone redundancy costs",
      where: "Learn",
      href: "/learn/azure-disk-lrs-vs-zrs",
    },
    {
      title: "Premium SSD vs Standard SSD on Azure: what you pay for",
      where: "Learn",
      href: "/learn/premium-ssd-vs-standard-ssd-azure",
    },
    {
      title: "How to resize a PVC in Kubernetes, and why it can’t shrink",
      where: "Learn",
      href: "/learn/resize-pvc-kubernetes",
    },
    {
      title: "How to find unattached disks in Azure and stop paying for them",
      where: "Learn",
      href: "/learn/find-unattached-disks-azure",
    },
    {
      title: "Premium SSD v2 vs Premium SSD: which one costs less?",
      where: "Learn",
      href: "/learn/premium-ssd-v2-vs-premium-ssd",
    },
  ],
};
