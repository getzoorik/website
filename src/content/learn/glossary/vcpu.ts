import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/vcpu/1";

export const term: GlossaryTerm = {
  slug: "vcpu",
  term: "vCPU (virtual CPU)",
  title: "What is a vCPU? vCPU vs core in AWS and Azure",
  meta: "vCPU meaning: a virtual CPU is one thread of a physical core, or a whole core on some VMs. vCPU vs core on AWS EC2 and Azure, and CPU in Kubernetes.",
  h1: "What is a vCPU? vCPU vs core in AWS and Azure",
  card: "A vCPU, or virtual CPU, is a processor as a virtual machine (VM) sees it: one thread of a physical core, or a whole core.",
  group: "finops-pricing",
  product: "coral",
  published: "2026-11-02",
  updated: "2026-11-02",
  definition: [
    {
      kind: "p",
      text: "A vCPU, or virtual CPU, is a processor as a virtual machine (VM) sees it: one thread of a physical core, or a whole core.",
    },
  ],
  sections: [
    {
      id: "vcpu-vs-core",
      title: "vCPU vs core: threads and hyper-threading",
      blocks: [
        {
          kind: "p",
          text: "With simultaneous multithreading (SMT), also called hyper-threading, one CPU core runs more than one thread at once. Each thread is one vCPU.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: [
            "Some VMs give each vCPU a whole core, with one thread per core. ",
            { a: "AWS Graviton", href: "/learn/glossary/aws-graviton" },
            " and AMD-based M7a instances do this, and so do Azure’s Arm-based Dpsv5 VMs.",
          ],
        },
      ],
    },
    {
      id: "vcpus-on-aws-ec2-and-azure",
      title: "vCPUs on AWS EC2 and Azure",
      blocks: [
        {
          kind: "p",
          text: "On AWS, an m5.xlarge has 2 CPU cores with 2 threads each by default, so 4 vCPUs.",
        },
        {
          kind: "p",
          text: [
            "On Azure, a ",
            { a: "VM size name", href: "/learn/glossary/azure-vm-series" },
            " carries its vCPU count: Standard_D4s_v5 has 4. The Dsv5 series runs on hyper-threaded Intel Xeon processors, so each vCPU is a thread.",
          ],
        },
      ],
    },
    {
      id: "vcpu-vs-cpu-in-kubernetes",
      title: "vCPU vs CPU, and what 1\u00a0CPU means in Kubernetes",
      blocks: [
        {
          kind: "p",
          text: "The CPU is the physical processor in the server that hosts the VM. A VM’s vCPUs are a share of that CPU’s cores or threads.",
        },
        {
          kind: "p",
          text: [
            "In Kubernetes, 1\u00a0CPU is one physical core on a physical host, or one virtual core on a VM. So on ",
            { a: "AKS", href: "/learn/glossary/aks" },
            " and ",
            { a: "EKS", href: "/learn/glossary/eks" },
            " nodes, 1\u00a0CPU is 1\u00a0vCPU.",
          ],
        },
        {
          kind: "p",
          text: [
            "Pods can’t use all of a node’s vCPUs: system daemons use a share, so the node’s ",
            {
              a: "allocatable CPU is less than its capacity",
              href: "/learn/kubernetes-allocatable-vs-capacity",
            },
            ".",
          ],
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why vCPUs matter for your cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            "EC2 On-Demand pricing lists each instance type’s vCPUs and memory beside its hourly rate, so you can compare the price per vCPU. Prices change.",
            "Some fees count vCPUs. On EC2, Red Hat Enterprise Linux (RHEL) is priced per vCPU-hour. License-included Windows and SQL Server fees follow the vCPUs you configure.",
            "For software licensed per core, you can keep the memory and run fewer vCPUs. AWS CPU options and Azure constrained vCPU sizes, such as Standard_E32-16s_v5, do this at the same VM price.",
            [
              "The Kubernetes scheduler places pods by their ",
              { a: "CPU requests", href: "/learn/glossary/kubernetes-resource-requests" },
              ", not their use. Requests above real use hold vCPUs that sit idle, so the cluster needs more nodes.",
            ],
            [
              { a: "Coral", href: "/coral" },
              " rebalances CPU and memory requests on AKS and EKS to match real use, and drains spare nodes so your autoscaler can remove them.",
            ],
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "AWS Graviton",
      line: "On Graviton, each vCPU is a whole core.",
      href: "/learn/glossary/aws-graviton",
    },
    {
      title: "Azure VM series",
      line: "Its size names carry the vCPU count.",
      href: "/learn/glossary/azure-vm-series",
    },
    {
      title: "AWS instance families",
      line: "How much memory comes with each vCPU.",
      href: "/learn/glossary/aws-instance-families",
    },
    {
      title: "Resource requests",
      line: "How pods ask for CPU, in CPU units.",
      href: "/learn/glossary/kubernetes-resource-requests",
    },
  ],
  relatedTitle: "Terms related to vCPUs",
  next: {
    title: "Kubernetes allocatable vs capacity: what pods can use",
    href: "/learn/kubernetes-allocatable-vs-capacity",
  },
  sources: [
    {
      publisher: "AWS",
      title: "“CPU options for Amazon EC2 instances”",
      url: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-optimize-cpu.html",
    },
    {
      publisher: "AWS",
      title: "“Rules for specifying CPU options for an Amazon EC2 instance”",
      url: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-cpu-options-rules.html",
    },
    {
      publisher: "AWS",
      title: "“Specifications for Amazon EC2 general purpose instances”",
      url: "https://docs.aws.amazon.com/ec2/latest/instancetypes/gp.html",
    },
    {
      publisher: "AWS",
      title: "“Amazon EC2 On-Demand Pricing”",
      url: "https://aws.amazon.com/ec2/pricing/on-demand/",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Dsv5 size series”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/general-purpose/dsv5-series",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Dpsv5 size series”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/general-purpose/dpsv5-series",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Azure VM sizes naming conventions”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/vm-naming-conventions",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Constrained vCPU sizes”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/constrained-vcpu",
    },
    {
      publisher: "Kubernetes",
      title: "“Resource Management for Pods and Containers”",
      url: "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/",
    },
  ],
};
