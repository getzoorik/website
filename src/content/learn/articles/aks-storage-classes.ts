import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/aks-storage-classes/1";

export const article: Article = {
  slug: "aks-storage-classes",
  title: "AKS storage classes: which Azure disk each creates",
  meta: "AKS storage classes decide the Azure disk behind each PVC: its type, LRS or ZRS, and price. See what managed-csi and the others create, and write your own.",
  h1: "AKS storage classes: which Azure disk each one creates",
  deck: "What managed-csi and the other built-in classes create in Azure, and how the class sets a volume’s price.",
  card: "What each built-in AKS storage class creates in Azure and what it bills, plus how to write a ZRS or LRS class.",
  product: "both",
  hub: "Kubernetes",
  topic: "Kubernetes storage",
  published: "2026-11-10",
  updated: "2026-11-10",
  author: "adil",
  short: [
    "AKS storage classes tell a CSI driver what Azure storage to create when a Persistent Volume Claim (PVC) asks for a volume. For Azure disks, the class named ",
    { code: "default" },
    ", the same as ",
    { code: "managed-csi" },
    ", creates a Standard SSD. ",
    { code: "managed-csi-premium" },
    " creates a Premium SSD, and ",
    { code: "managed-csi-premium-v2" },
    " creates a Premium SSD v2 on Kubernetes 1.35 and later. A class’s ",
    { code: "skuName" },
    " sets the disk type and its redundancy (LRS or ZRS), which together with the size you request largely set the monthly price.",
  ],
  sections: [
    {
      id: "the-built-in-aks-storage-classes",
      title: "The built-in AKS storage classes",
      blocks: [
        {
          kind: "p",
          text: [
            "A storage class is a Kubernetes StorageClass object. It names a provisioner and the parameters that provisioner uses when a claim needs a new volume. AKS has used the Container Storage Interface (CSI) drivers by default since Kubernetes 1.21, and since 1.26 it no longer supports creating volumes with the old in-tree drivers. For Azure disks the provisioner is the Azure Disk CSI driver, ",
            { code: "disk.csi.azure.com" },
            ".",
          ],
        },
        {
          kind: "p",
          text: "AKS creates these classes in clusters that use the CSI drivers, and Microsoft describes each one this way:",
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
            " classes come with the Azure Blob storage CSI driver, which you turn on with ",
            {
              code: "az aks update --name <cluster-name> --resource-group <resource-group> --enable-blob-driver",
            },
            ", so a cluster without that driver may not list them.",
          ],
        },
        {
          kind: "p",
          text: [
            "The disk classes share their settings. Each has the reclaim policy ",
            { code: "Delete" },
            ", so the Azure disk goes when its persistent volume is deleted. Each binds with ",
            { code: "WaitForFirstConsumer" },
            ", which waits for a pod that uses the claim before it creates the disk, so the disk is made where that pod is scheduled. ",
            { code: "managed-csi" },
            " and ",
            { code: "managed-csi-premium" },
            " also allow expansion, so you grow a claim by editing its size. An Azure disk mounts as ReadWriteOnce, on one node at a time, which is why data that pods on several nodes must share belongs on an Azure Files class.",
          ],
        },
        {
          kind: "p",
          text: [
            "Redundancy depends on the cluster. A locally redundant storage (LRS) disk keeps three copies in one datacenter, while a zone-redundant storage (ZRS) disk is copied synchronously across three availability zones and can recover from a zone failure. From Kubernetes 1.29, in a cluster deployed across availability zones, ",
            { code: "managed-csi" },
            " and ",
            { code: "managed-csi-premium" },
            " create ZRS disks instead of LRS. ",
            { code: "managed-csi-premium-v2" },
            " stays LRS, because Azure doesn’t support ZRS for Premium SSD v2. Microsoft’s pages word the zone condition slightly differently, so read the class on your own cluster with the commands further down.",
          ],
        },
        {
          kind: "p",
          text: [
            "ZRS buys resilience at a price. Microsoft says ZRS “comes at a higher cost” than LRS, and ZRS writes have more latency. In return, the Azure Disk CSI driver can schedule a ZRS disk onto a node in any zone, while an LRS disk must sit in the same zone as the node it attaches to, so its pod stays in that zone. The ",
            { a: "LRS vs ZRS article", href: "/learn/azure-disk-lrs-vs-zrs" },
            " works through that trade in depth.",
          ],
        },
      ],
    },
    {
      id: "what-the-aks-storage-class-default-gives",
      title: "What the AKS storage class default gives a PVC",
      blocks: [
        {
          kind: "p",
          text: [
            "A PVC that leaves out ",
            { code: "storageClassName" },
            " gets the cluster’s default class. The AKS storage class default is the class named ",
            { code: "default" },
            ", which ",
            { code: "kubectl get sc" },
            " lists as ",
            { code: "default (default)" },
            ". Like ",
            { code: "managed-csi" },
            ", it gives the claim a Standard SSD, ZRS or LRS by the rule above, and a Helm chart that leaves ",
            { code: "storageClassName" },
            " out of its claim gets the same disk. A claim that sets ",
            { code: 'storageClassName: ""' },
            " is different: Kubernetes treats it as asking for no dynamic provisioning at all.",
          ],
        },
        { kind: "code", lang: "bash", code: "kubectl get sc" },
        {
          kind: "p",
          text: "Edits to the built-in classes don’t last. Microsoft’s docs say AKS “reconciles the default storage classes and will overwrite any changes you make to those storage classes.” To get a different disk, create your own class.",
        },
        {
          kind: "p",
          text: [
            "You can also mark a class you wrote as a default, with the annotation ",
            { code: 'storageclass.kubernetes.io/is-default-class: "true"' },
            ". When more than one class carries it, Kubernetes gives a claim with no class the most recently created default, and its docs advise keeping a single default. Naming the class in every PVC, and in every chart’s values, means neither rule picks your disk type for you.",
          ],
        },
      ],
    },
    {
      id: "aks-storage-class-parameters-that-change-the",
      title: "AKS storage class parameters that change the bill",
      blocks: [
        {
          kind: "p",
          text: "The Azure Disk CSI driver applies a class’s parameters when it creates a disk, and Microsoft notes that updating the storage class later “affects only newly provisioned volumes.” These AKS storage class parameters and fields move the price:",
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
              "Chooses the disk’s price list and billing model",
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
          kind: "p",
          text: [
            "To write an AKS ZRS storage class, or an LRS class for a zone-spread cluster where the less expensive disk is the better fit, start from Microsoft’s own pattern and change ",
            { code: "skuName" },
            ":",
          ],
        },
        {
          kind: "code",
          lang: "yaml",
          code: "apiVersion: storage.k8s.io/v1\nkind: StorageClass\nmetadata:\n  name: managed-csi-lrs\nprovisioner: disk.csi.azure.com\nparameters:\n  skuName: StandardSSD_LRS\nreclaimPolicy: Delete\nvolumeBindingMode: WaitForFirstConsumer\nallowVolumeExpansion: true",
        },
        {
          kind: "p",
          text: [
            "Set ",
            { code: "skuName" },
            " to ",
            { code: "StandardSSD_ZRS" },
            " or ",
            { code: "Premium_ZRS" },
            " for a ZRS class, or to ",
            { code: "Premium_LRS" },
            " for Premium SSD. Create it with ",
            { code: "kubectl apply -f <file>.yaml" },
            ", then put its name in the claim’s ",
            { code: "storageClassName" },
            ". Keep ",
            { code: "WaitForFirstConsumer" },
            " in any class you write. Left unset, Kubernetes binds with ",
            { code: "Immediate" },
            ", which creates the disk as soon as the claim exists, and for storage bound to a zone Kubernetes warns that this “may result in unschedulable Pods.”",
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
            "A persistent volume (PV) on an Azure disk is billed as a managed disk, on the size you provision rather than the data it holds, and for Premium SSD, Standard SSD and Standard HDD, Azure rounds that size up to the next size tier and bills the tier. Microsoft’s example: a 200\u00a0GiB Standard SSD bills as an E15, the 256\u00a0GiB tier. So a PVC that requests ",
            { code: "200Gi" },
            " from ",
            { code: "managed-csi" },
            " pays for 256\u00a0GiB from the day its disk is created, and a ",
            { code: "10Gi" },
            " claim on ",
            { code: "managed-csi-premium" },
            " pays for a P3, the 16\u00a0GiB tier.",
          ],
        },
        { kind: "diagram", figure: figure1 },
        {
          kind: "p",
          text: [
            "Standard SSD and Standard HDD also charge per transaction, up to an hourly cap. Premium SSD v2 has no size tiers: it bills each GiB you provision, plus IOPS above 3,000 and throughput above 125\u00a0MB/s. A 600\u00a0GiB claim is therefore billed as a 1,024\u00a0GiB P30 on ",
            { code: "managed-csi-premium" },
            ", and as 600\u00a0GiB on ",
            { code: "managed-csi-premium-v2" },
            ". The ",
            { a: "Premium SSD v2 vs Premium SSD", href: "/learn/premium-ssd-v2-vs-premium-ssd" },
            " article works through the prices, and the ",
            { a: "Standard SSD comparison", href: "/learn/premium-ssd-vs-standard-ssd-azure" },
            " covers the two tiered types.",
          ],
        },
        {
          kind: "p",
          text: [
            "Once the disk exists, its size can only go up. Microsoft states that “reducing the size of a PVC isn’t supported due to the risk of data loss,” and Kubernetes doesn’t support shrinking a claim either. The size you request is the floor for the life of that volume. ",
            { a: "Resize a PVC in Kubernetes", href: "/learn/resize-pvc-kubernetes" },
            " covers growing one. On AKS, a Standard SSD or Premium SSD volume grows without downtime, except a resize from 4\u00a0TiB or less to more than 4\u00a0TiB, which needs it unmounted and detached first. Premium SSD v2\u00a0volumes don’t have that 4\u00a0TiB limit.",
          ],
        },
        {
          kind: "p",
          text: [
            "The reclaim policy decides what happens after the claim. With ",
            { code: "Delete" },
            ", the disk goes with the PV. With ",
            { code: "Retain" },
            ", deleting the PVC leaves the PV in the Released state, and Kubernetes notes that the storage asset “still exists after the PV is deleted.” That disk keeps billing until someone deletes it, and ",
            { a: "finding unattached disks in Azure", href: "/learn/find-unattached-disks-azure" },
            " shows how to track such disks down. Volume snapshots add ",
            { a: "their own line", href: "/learn/azure-disk-snapshot-cost" },
            ": the driver takes incremental snapshots by default, and Azure bills a snapshot on the space used.",
          ],
        },
      ],
    },
    {
      id: "how-to-see-the-class-and-disk",
      title: "How to see the class and disk behind each PVC",
      blocks: [
        {
          kind: "p",
          text: "To check the AKS PVC storage class of every claim, and the disk each one created, start from the claims:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "kubectl get pvc --all-namespaces\nkubectl get storageclass <class-name> -o yaml\nkubectl get pv <pv-name> -o jsonpath='{.spec.csi.volumeHandle}'",
        },
        {
          kind: "p",
          text: [
            "The first command’s STORAGECLASS column names each claim’s class, CAPACITY gives its size, and VOLUME names the PV bound to it. A class’s YAML shows its provisioner and parameters, including ",
            { code: "skuName" },
            " where the class sets one. Each PV’s ",
            { code: "volumeHandle" },
            " is the Azure resource ID of the managed disk, in the form ",
            {
              code: "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Compute/disks/<disk-name>",
            },
            ", so you can open that disk in Azure and confirm its type, redundancy and size.",
          ],
        },
        {
          kind: "p",
          text: [
            "Disks also count against nodes. Depending on the VM size, the driver can have a per-node volume limit. Microsoft points to the size’s Max data disks figure for it, and gives 64\u00a0volumes for some 16-core sizes. ",
            { code: "kubectl get CSINode <node-name> -o yaml" },
            " shows a node’s limit. A cluster with many small claims on small VM sizes can run out of disk slots before it runs out of CPU or memory.",
          ],
        },
      ],
    },
    {
      id: "which-class-to-name-in-a-pvc",
      title: "Which class to name in a PVC",
      blocks: [
        { kind: "p", text: "Name a class in every claim, and pick it by what the data needs:" },
        {
          kind: "ul",
          items: [
            [
              "If pods on several nodes must read and write the same data, use ",
              { code: "azurefile-csi" },
              " or ",
              { code: "azurefile-csi-premium" },
              ", because an Azure disk mounts on one node.",
            ],
            [
              "For dev, test and lightly used services, use ",
              { code: "managed-csi" },
              ". Microsoft’s disk guide lists Standard SSD for web servers, lightly used enterprise applications, and development and test environments.",
            ],
            [
              "For production data on Kubernetes 1.35 or later that doesn’t need ZRS, try ",
              { code: "managed-csi-premium-v2" },
              " first, where your region and node pool zones support Premium SSD v2. Microsoft says it can provide the best price performance for most general purpose workloads, and it bills the GiB you request rather than the next tier. It doesn’t support host caching, and it is LRS only, so each pod stays in its disk’s zone.",
            ],
            [
              "For production data on older versions, where Premium SSD v2 isn’t offered, or where the data needs ZRS, use ",
              { code: "managed-csi-premium" },
              " (ZRS by the rule above) or a class of your own with ",
              { code: "Premium_ZRS" },
              ".",
            ],
            "If your application already replicates its data across zones, a class of your own on LRS fits, accepting that each pod stays in its disk’s zone. Otherwise keep ZRS.",
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
          text: [
            { a: "Coral", href: "/coral" },
            " optimizes Kubernetes on AKS and EKS. It rebalances CPU and memory requests and drains spare nodes so your autoscaler can remove them. Its FAQ says it “changes only CPU and memory,” so the class, size and disk type of each PVC stay as your claims and classes set them.",
          ],
        },
        {
          kind: "p",
          text: "Azure disks still shape how Coral moves pods, because each one is ReadWriteOnce. For single-replica apps, the FAQ says that where a change isn’t safe, “for example Recreate strategy or a ReadWriteOnce volume,” the new size “waits for the pod’s next natural restart.” When Coral drains a node, it first tries a warm handover for Deployment and Argo Rollout pods, starting a Ready copy on another node before the old pod goes, but not for a pod with a ReadWriteOnce volume. That pod is evicted within its PodDisruptionBudget instead, so a single-replica app gets a short restart. Before it drains, Coral simulates the scheduler to check that every pod fits elsewhere, with its zones.",
        },
        {
          kind: "p",
          text: [
            "Amoeba optimizes block storage on Azure and AWS, for the data disks of running VMs: Azure managed disks and Amazon EBS volumes on EC2 instances. Like Coral, it doesn’t act on PVCs or the Azure disks behind them. It moves a VM’s data disks onto one pool, sized from the highest use of the last 7\u00a0days so the pool sits inside its target band with room for the largest recent 15-minute rise and at least 10\u00a0GiB free. It then expands the pool as the data grows and shrinks it one disk at a time. On Azure the pool uses Premium SSD v2 where the region and zone offer it, and Premium SSD otherwise. Its disks are always locally redundant, so data that sat on ZRS disks loses its zone redundancy, the same LRS trade described above. The ",
            { a: "Amoeba page", href: "/amoeba" },
            " shows how a VM’s disks are moved and resized.",
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
