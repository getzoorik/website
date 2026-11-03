import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/statefulset-vs-deployment/1";

export const article: Article = {
  slug: "statefulset-vs-deployment",
  title: "StatefulSet vs Deployment in Kubernetes",
  meta: "StatefulSet vs Deployment compared: pod names, volumes and update order, where a ReplicaSet fits, disks on AKS and EKS, and how to choose.",
  h1: "StatefulSet vs Deployment",
  deck: "One question decides it: does each pod need its own name, its own volume or a fixed order?",
  card: "Pod names, volumes and update order side by side, where a ReplicaSet fits, and disks on AKS and EKS.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes storage",
  versus: ["StatefulSet", "Deployment"],
  published: "2026-11-02",
  updated: "2026-11-03",
  author: "zoorik",
  cover: "/learn-covers/zoorik-learn-statefulset-vs-deployment-1200x630.webp",
  coverAlt:
    "Deployment pods with hash suffixes beside StatefulSet pods web-0, web-1 and web-2, each with its own volume",
  short:
    "A Deployment runs interchangeable pods, usually for apps that keep no state. A StatefulSet gives each pod a stable name, its own volume and a fixed order to start, stop and update. Use a StatefulSet when pods need any of those, and a Deployment otherwise.",
  sections: [
    {
      id: "what-a-deployment-runs-interchangeable-pods-through",
      title: "Deployment: interchangeable pods",
      blocks: [
        {
          kind: "p",
          text: "A Deployment runs pods for an app that usually keeps no state. It creates a ReplicaSet, and the ReplicaSet creates the pods from one pod template.",
        },
        {
          kind: "p",
          text: [
            "Pod names carry the template’s hash and a suffix of their own, such as ",
            { code: "nginx-deployment-75675f5897-7ci7o" },
            " in the docs’ example. Any pod can stand in for another.",
          ],
        },
        {
          kind: "p",
          text: [
            "A rolling update, the default, scales a new ReplicaSet up as it scales the old one down. By default, ",
            { code: "maxUnavailable" },
            " lets at most 25% of the desired pods be unavailable, and ",
            { code: "maxSurge" },
            " allows 25% extra. The Recreate strategy kills every existing pod before it creates new ones.",
          ],
        },
      ],
    },
    {
      id: "what-a-statefulset-adds-stable-names-a",
      title: "StatefulSet: stable identity",
      blocks: [
        {
          kind: "p",
          text: "Kubernetes lists four guarantees a StatefulSet gives its pods:",
        },
        {
          kind: "ul",
          items: [
            "stable, unique network identifiers",
            "stable, persistent storage",
            "ordered, graceful deployment and scaling",
            "ordered, automated rolling updates",
          ],
        },
        {
          kind: "p",
          text: "Stable means it lasts across rescheduling: a pod keeps its identity whichever node it lands on.",
        },
        {
          kind: "p",
          text: [
            "Pods are named ",
            { code: "<statefulset name>-<ordinal>" },
            ". A StatefulSet called web with 3 replicas runs ",
            { code: "web-0" },
            ", ",
            { code: "web-1" },
            " and ",
            { code: "web-2" },
            ". A headless Service, which you create, gives each pod a DNS name such as ",
            { code: "web-0.nginx.default.svc.cluster.local" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "Its ",
            { code: "volumeClaimTemplates" },
            " give each pod its own ",
            { a: "PersistentVolumeClaim (PVC)", href: "/learn/kubernetes-persistent-volume" },
            ". A pod rescheduled onto another node mounts the volumes of the same claims again.",
          ],
        },
        {
          kind: "p",
          text: [
            "Pods start in order from ",
            { code: "web-0" },
            ", each once the one before it is Running and Ready. Scaling down runs in reverse, so ",
            { code: "web-2" },
            " goes first.",
          ],
        },
        {
          kind: "p",
          text: [
            "Rolling updates, the default, run from the highest ordinal down, one pod at a time. Each pod is deleted and recreated, and must be Running and Ready before the next one changes. A ",
            { code: "partition" },
            " stages an update: only pods at or above that ordinal change, for a canary or a phased rollout.",
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: [
            "Two fields relax the order. With ",
            { code: "podManagementPolicy: Parallel" },
            ", scaling starts or stops all pods at once. A ",
            { code: "maxUnavailable" },
            " above 1, beta since Kubernetes 1.37, lets an update replace up to that many pods at once.",
          ],
        },
      ],
    },
    {
      id: "how-to-choose-between-a-statefulset-and",
      title: "How to choose",
      blocks: [
        { kind: "p", text: "Side by side, with their defaults:" },
        {
          kind: "table",
          columns: [
            { label: "", width: "20%" },
            { label: "Deployment", width: "40%" },
            { label: "StatefulSet", width: "40%" },
          ],
          rows: [
            [
              "Pod names",
              "The template’s hash plus a suffix of their own",
              ["Its name plus an ordinal: ", { code: "web-0" }, ", ", { code: "web-1" }],
            ],
            [
              "Volumes",
              "None, or one claim that every replica shares",
              ["One claim per pod, from ", { code: "volumeClaimTemplates" }],
            ],
            [
              "Start and stop order",
              "No set order",
              "Start from 0 up, stop from the highest ordinal down",
            ],
            [
              "Updates",
              "Rolling update through a new ReplicaSet, 25% unavailable and 25% extra by default, or Recreate",
              "Rolling update, one pod at a time from the highest ordinal, or OnDelete",
            ],
            ["Headless Service", "Not needed", "Required, and you create it"],
          ],
        },
        { kind: "p", text: "Choose a StatefulSet when your pods need any of these:" },
        {
          kind: "ul",
          items: [
            "a stable network identity, such as a DNS name per pod",
            "a volume of their own that stays with them",
            "ordered start, stop, scaling and updates",
          ],
        },
        {
          kind: "p",
          text: "Otherwise, Kubernetes points to a workload with stateless replicas, such as a Deployment.",
        },
        {
          kind: "p",
          text: [
            "A Deployment can still mount a volume, but every replica mounts the same claim. A ",
            { code: "ReadWriteOnce" },
            " volume can be mounted read-write by one node only, so the replicas must all run on that node.",
          ],
        },
      ],
    },
    {
      id: "replicaset-vs-statefulset-you-rarely-create-a",
      title: "ReplicaSet vs StatefulSet",
      blocks: [
        {
          kind: "p",
          text: "A ReplicaSet keeps a set number of identical pods running. It doesn’t support rolling updates directly, so Kubernetes recommends a Deployment instead, unless you need custom update orchestration or no updates at all.",
        },
        {
          kind: "p",
          text: "Don’t manage a ReplicaSet that a Deployment owns. A StatefulSet uses no ReplicaSet: it manages its pods itself, and records each change to its pod template in a ControllerRevision, which rollbacks use.",
        },
      ],
    },
    {
      id: "what-a-statefulsets-volumes-mean-on-aks",
      title: "Volumes on AKS and EKS",
      blocks: [
        {
          kind: "p",
          text: "Deleting a StatefulSet, or scaling it down, doesn’t delete its volumes. Kubernetes keeps them for data safety. The claims and the disks behind them stay until you delete them.",
        },
        {
          kind: "p",
          text: [
            "The ",
            { code: "persistentVolumeClaimRetentionPolicy" },
            " field, stable since Kubernetes 1.32, changes that. Its ",
            { code: "whenDeleted" },
            " and ",
            { code: "whenScaled" },
            " policies each take ",
            { code: "Retain" },
            ", the default, or ",
            { code: "Delete" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "On ",
            { a: "Azure Kubernetes Service (AKS)", href: "/learn/glossary/aks" },
            ", Azure Disks are mounted ",
            { code: "ReadWriteOnce" },
            " and are available to one node only. For a volume that several nodes use at once, Microsoft points to Azure Files.",
          ],
        },
        {
          kind: "p",
          text: [
            { a: "Zone-redundant storage (ZRS)", href: "/learn/azure-disk-lrs-vs-zrs" },
            " disks, the ",
            { code: "Premium_ZRS" },
            " and ",
            { code: "StandardSSD_ZRS" },
            " types, don’t have to be in their node’s zone. Other Azure Disks do.",
          ],
        },
        {
          kind: "p",
          text: [
            "On ",
            { a: "Amazon Elastic Kubernetes Service (EKS)", href: "/learn/glossary/eks" },
            ", these volumes come from ",
            { a: "Amazon Elastic Block Store (EBS)", href: "/learn/glossary/ebs-volume" },
            ", through its Container Storage Interface (CSI) driver. An EBS volume and its instance must be in the same Availability Zone. EBS volumes can’t be mounted to Fargate pods.",
          ],
        },
        {
          kind: "p",
          text: "A pod that uses a PersistentVolume is scheduled only to nodes the volume’s node affinity allows. So a StatefulSet pod that moves needs a node in its disk’s zone, unless the disk is ZRS.",
        },
        {
          kind: "p",
          text: [
            "To grow a StatefulSet’s claims, see ",
            {
              a: "how to resize a PVC in a StatefulSet",
              href: "/learn/resize-pvc-kubernetes#how-to-resize-a-pvc-in-a",
            },
            ".",
          ],
        },
      ],
    },
    {
      id: "how-coral-rebalances-statefulsets-and-deployments-differently",
      title: "How Coral handles each",
      blocks: [
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " rebalances CPU and memory requests on AKS and EKS, under a policy. By default, StatefulSets get the ",
            { a: "Resiliency policy", href: "/coral-faq#what-does-each-coral-policy-do" },
            ", which sizes like Balanced and keeps Guaranteed pods Guaranteed. Your own Deployments get Balanced.",
          ],
        },
        {
          kind: "p",
          text: [
            "Running pods are resized in place where the node allows it, on Kubernetes 1.33 and later. Otherwise a Deployment’s pods are replaced one at a time, each after the last is Ready, within your ",
            { a: "PodDisruptionBudgets (PDBs)", href: "/learn/glossary/pod-disruption-budget" },
            ". A StatefulSet’s pods change one at a time too, highest ordinal first, and never with an extra pod.",
          ],
        },
        {
          kind: "p",
          text: "When Coral removes a node, an eligible Deployment pod gets a warm handover: a new copy turns Ready elsewhere before the old pod goes. A StatefulSet pod moves by live migration where both nodes support it, or else by eviction within its PDB.",
        },
        {
          kind: "p",
          text: [
            "Coral keeps nodes that hold local data or ",
            { a: "do-not-disrupt", href: "/learn/safe-to-evict-do-not-disrupt" },
            " pods. For a careful start, ",
            {
              a: "the Coral FAQ",
              href: "/coral-faq#how-are-databases-kafka-elasticsearch-redis",
            },
            " suggests putting databases on the Read-only policy and marking them do-not-disrupt.",
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
      title: "“StatefulSets”",
      url: "https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/",
    },
    {
      publisher: "Kubernetes",
      title: "“Deployments”",
      url: "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/",
    },
    {
      publisher: "Kubernetes",
      title: "“ReplicaSet”",
      url: "https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/",
    },
    {
      publisher: "Kubernetes",
      title: "“Persistent Volumes”",
      url: "https://kubernetes.io/docs/concepts/storage/persistent-volumes/",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Use Container Storage Interface (CSI) drivers on Azure Kubernetes Service (AKS)”",
      url: "https://learn.microsoft.com/en-us/azure/aks/csi-storage-drivers",
    },
    {
      publisher: "AWS",
      title: "“Use Kubernetes volume storage with Amazon EBS”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/ebs-csi.html",
    },
    {
      publisher: "AWS",
      title: "“Amazon EBS volumes”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volumes.html",
    },
  ],
  related: [
    {
      title: "Expand a PVC in Kubernetes",
      where: "Learn",
      href: "/learn/resize-pvc-kubernetes",
    },
    {
      title: "Kubernetes persistent volumes and PVCs",
      where: "Learn",
      href: "/learn/kubernetes-persistent-volume",
    },
    {
      title: "kubectl drain without any downtime",
      where: "Learn",
      href: "/learn/kubernetes-drain-node-without-downtime",
    },
    {
      title: "Pod disruption budget best practices",
      where: "Learn",
      href: "/learn/pod-disruption-budget-best-practices",
    },
  ],
};
