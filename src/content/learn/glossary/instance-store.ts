import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/instance-store/1";

export const term: GlossaryTerm = {
  slug: "instance-store",
  term: "Instance store (AWS EC2)",
  title: "What is AWS instance store?",
  meta: "AWS instance store is ephemeral EC2 instance storage on the host, at no extra charge. When its data is lost, and how instance store compares with EBS.",
  h1: "What is AWS instance store?",
  card: "Instance store is temporary block storage for an Amazon EC2 instance, on disks attached to its host computer.",
  group: "block-storage",
  product: "both",
  published: "2026-10-26",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: [
        "Instance store is temporary ",
        { a: "block storage", href: "/learn/glossary/block-storage" },
        " for an Amazon EC2 instance, on disks attached to its host computer. It costs nothing extra. Its data survives a reboot but not a stop, so it suits caches, buffers and scratch data.",
      ],
    },
    {
      kind: "p",
      text: [
        "Not every ",
        { a: "instance type", href: "/learn/glossary/aws-instance-families" },
        " has it. The number and size of its volumes depend on the instance type and size.",
      ],
    },
  ],
  sections: [
    {
      id: "when-instance-store-data-is-lost",
      title: "When data is lost",
      blocks: [
        {
          kind: "p",
          text: "An instance store volume lasts only as long as its instance. What happens to its data:",
        },
        {
          kind: "ul",
          items: [
            "Kept: a reboot, a restart from the operating system, or a power failure.",
            "Lost: a stop, hibernate or terminate, including a shutdown from the operating system. AWS erases every block.",
            "Lost: a change of instance type, an instance retirement or an automatic recovery.",
            "Lost on one disk: when that disk fails.",
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: "To keep the data, copy it first to an Amazon EBS volume, an Amazon S3 bucket or an Amazon EFS file system.",
        },
      ],
    },
    {
      id: "instance-store-vs-ebs",
      title: "Instance store vs EBS",
      blocks: [
        {
          kind: "p",
          text: [
            "An ",
            { a: "Amazon Elastic Block Store (EBS) volume", href: "/learn/glossary/ebs-volume" },
            " is the durable alternative.",
          ],
        },
        {
          kind: "table",
          columns: [
            { label: "", width: "26%" },
            { label: "Instance store", width: "37%" },
            { label: "EBS volume", width: "37%" },
          ],
          rows: [
            ["Lifetime", "The instance’s life only", "Independent of the instance"],
            [
              "Attach",
              "At launch only. It can’t move to another instance",
              "To an instance in the same Availability Zone",
            ],
            ["Charge", "In the instance’s price", "Per GB provisioned, each month"],
            ["Suits", "Caches, buffers and scratch data", "Data you keep, such as databases"],
          ],
        },
      ],
    },
    {
      id: "what-is-ephemeral-storage",
      title: "Ephemeral storage",
      blocks: [
        {
          kind: "p",
          text: "Ephemeral storage is temporary storage tied to one machine. Its data can be lost when the machine stops or fails. Each platform has its own:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "AWS:" },
              " instance store. Its volumes are named in order, from ",
              { code: "ephemeral0" },
              " up to ",
              { code: "ephemeral23" },
              ".",
            ],
            [
              { b: "Azure:" },
              " the ",
              { a: "temporary disk", href: "/learn/glossary/azure-temporary-disk" },
              " on most virtual machines. A restart keeps its data, but a stop, a redeploy or maintenance can lose it.",
            ],
            [
              { b: "Kubernetes:" },
              " a node’s ",
              { a: "local ephemeral storage", href: "/learn/kubernetes-ephemeral-storage" },
              ". It holds ",
              { code: "emptyDir" },
              " volumes, container images, logs and writable layers.",
            ],
          ],
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            "Scratch data on instance store adds no storage charge. On EBS, the same data is charged per GB provisioned each month until you release the volume.",
            "Data you must keep still needs paid storage, so instance store avoids a storage charge only for data you can lose.",
            [
              "Plan for the loss of instance store data before you ",
              {
                a: "change a node group’s instance type",
                href: "/learn/change-eks-node-group-instance-type",
              },
              ".",
            ],
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "EBS volume",
      line: "Storage that outlives its instance.",
      href: "/learn/glossary/ebs-volume",
    },
    {
      title: "Azure temporary disk",
      line: "Azure’s short-term VM storage.",
      href: "/learn/glossary/azure-temporary-disk",
    },
    {
      title: "Ephemeral OS disk",
      line: "A temporary Azure OS disk.",
      href: "/learn/glossary/ephemeral-os-disk",
    },
    {
      title: "Block storage",
      line: "What instance store and EBS both are.",
      href: "/learn/glossary/block-storage",
    },
  ],
  relatedTitle: "Related terms",
  next: {
    title: "How to change an EKS node group instance type",
    href: "/learn/change-eks-node-group-instance-type",
  },
  sources: [
    {
      publisher: "AWS",
      title: "“Instance store temporary block storage for EC2 instances”",
      url: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/InstanceStorage.html",
    },
    {
      publisher: "AWS",
      title: "“Data persistence for Amazon EC2 instance store volumes”",
      url: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-store-lifetime.html",
    },
    {
      publisher: "AWS",
      title: "“Amazon EBS volumes”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volumes.html",
    },
    { publisher: "AWS", title: "“Amazon EBS pricing”", url: "https://aws.amazon.com/ebs/pricing/" },
    {
      publisher: "Microsoft Learn",
      title: "“Overview of Azure Disk Storage”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/managed-disks-overview",
    },
    {
      publisher: "Kubernetes",
      title: "“Local ephemeral storage”",
      url: "https://kubernetes.io/docs/concepts/storage/ephemeral-storage/",
    },
  ],
};
