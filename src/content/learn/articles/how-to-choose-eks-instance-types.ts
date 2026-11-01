import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/how-to-choose-eks-instance-types/1";
import { figure as figure2 } from "@/features/learn/figures/how-to-choose-eks-instance-types/2";

export const article: Article = {
  slug: "how-to-choose-eks-instance-types",
  title: "EKS instance types: how to choose family and size",
  meta: "EKS instance types, chosen in order: the family that fits your pods’ requests, then the processor, size and Spot or On-Demand, with October 2026 prices.",
  h1: "How to choose EKS instance types",
  deck: "Match the family to your pods’ requests first. Then pick the processor, the size and how you pay.",
  card: "Family, processor, size, then Spot or On-Demand: the order to choose EKS instance types, with real prices.",
  product: "coral",
  hub: "Kubernetes",
  topic: "Kubernetes cost basics",
  published: "2026-11-01",
  updated: "2026-11-01",
  author: "swapna",
  cover: "/learn-covers/zoorik-learn-how-to-choose-eks-instance-types-1200x630.webp",
  coverAlt:
    "Choose EKS instance types: too small can’t hold the pod requests, too large leaves room paid for, idle, the middle fits",
  short:
    "Choose EKS instance types in four steps: the family that fits your pods’ CPU-to-memory ratio, then the processor, the size, and On-Demand or Spot. The family matters most: in one example at October 2026 list prices, the wrong one made the same pool cost 77% more.",
  sections: [
    {
      id: "eks-instance-types",
      title: "EKS instance types are EC2 types, read from the name",
      blocks: [
        {
          kind: "p",
          text: "In an Amazon Elastic Kubernetes Service (EKS) cluster, node groups and Karpenter launch EC2 instances as nodes. So the AWS EKS instance types you can pick are EC2 instance types, from what AWS calls a wide selection. There’s no single best instance type for EKS, but there is an order to choose in.",
        },
        {
          kind: "p",
          text: "The name holds most of what you need. AWS’s naming rule reads a type such as m7i.2xlarge in four parts:",
        },
        {
          kind: "ul",
          items: [
            [
              { code: "m" },
              " is the series, general purpose. ",
              { code: "c" },
              " is compute optimized, ",
              { code: "r" },
              " is memory optimized and ",
              { code: "t" },
              " is burstable.",
            ],
            [{ code: "7" }, " is the generation."],
            [
              { code: "i" },
              " is an option, here an Intel processor. ",
              { code: "a" },
              " means AMD, and ",
              { code: "g" },
              " means AWS Graviton, which is Arm-based.",
            ],
            [
              { code: "2xlarge" },
              ", after the period, is the size. An m7i.2xlarge has 8 virtual CPUs (vCPUs) and 32\u00a0GiB of memory.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "The part before the period, m7i, is the ",
            { a: "instance family", href: "/learn/glossary/aws-instance-families" },
            ". Across its sizes, m7i keeps the same 4\u00a0GiB of memory per vCPU.",
          ],
        },
        { kind: "svg", figure: figure1 },
        { kind: "p", text: "Make the choices in this order, since each one narrows the next:" },
        {
          kind: "ol",
          items: [
            "The family, from your pods’ CPU-to-memory ratio.",
            "The processor, by price and by what your images run on.",
            "The size, so your pods fill each node.",
            "How you pay: On-Demand, Spot or a commitment.",
          ],
        },
        { kind: "h3", id: "eks-supported-instance-types", title: "EKS supported instance types" },
        {
          kind: "p",
          text: "EKS runs most EC2 types as nodes. Its Amazon Machine Images (AMIs) leave a few out:",
        },
        {
          kind: "ul",
          items: [
            "No EKS AMI supports the mac family.",
            "The Arm and non-accelerated AMIs don’t support the g3, g4, inf and p families.",
            "The accelerated AMIs don’t support the a, c, hpc, m and t families.",
            "On Arm, Amazon Linux 2023 needs Graviton2 or later, so A1 instances are out.",
          ],
        },
        {
          kind: "p",
          text: "AWS doesn’t offer every type in every Region. If you use security groups for Pods, only specific types are supported.",
        },
      ],
    },
    {
      id: "step-1-match-the-instance-family-to",
      title: "Step 1: match the instance family to your pods’ requests",
      blocks: [
        {
          kind: "p",
          text: [
            "The Kubernetes scheduler places pods by their ",
            { a: "requests", href: "/learn/glossary/kubernetes-resource-requests" },
            ", the CPU and memory each container asks for. So the best family is the one whose memory per vCPU is closest to your pods’.",
          ],
        },
        {
          kind: "p",
          text: "Add up a pool’s requests and divide memory by CPU. Then compare that ratio with the families. At the 2xlarge size, three seventh-generation Intel families each have 8\u00a0vCPUs:",
        },
        {
          kind: "ul",
          items: [
            "c7i.2xlarge, compute optimized: 16\u00a0GiB, or 2\u00a0GiB per vCPU.",
            "m7i.2xlarge, general purpose: 32\u00a0GiB, or 4\u00a0GiB per vCPU.",
            "r7i.2xlarge, memory optimized: 64\u00a0GiB, or 8\u00a0GiB per vCPU.",
          ],
        },
        {
          kind: "p",
          text: "A family that doesn’t match runs out of one resource first. The other sits idle on every node, and you still pay for it.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "Say a pool’s pods request 30\u00a0vCPU and 120\u00a0GiB in all, so 4\u00a0GiB per vCPU. Here’s what each family needs at the 2xlarge size:",
        },
        {
          kind: "table",
          columns: [
            { label: "Instance type", width: "17%" },
            { label: "Nodes needed", width: "14%" },
            { label: "What runs out first", width: "48%" },
            { label: "Price an hour", width: "14%" },
            { label: "Pool a month", width: "10%" },
          ],
          rows: [
            ["c7i.2xlarge", "8", "Memory: 120 ÷ 16\u00a0GiB = 7.5, so 8", "$0.357", "$2,084.88"],
            ["r7i.2xlarge", "4", "CPU: 30 ÷ 8\u00a0vCPUs = 3.75, so 4", "$0.5292", "$1,545.26"],
            [
              "m7i.2xlarge",
              "4",
              "Both fit: 32\u00a0vCPUs and 128\u00a0GiB",
              "$0.4032",
              "$1,177.34",
            ],
          ],
        },
        {
          kind: "p",
          text: "The prices are Linux On-Demand list prices in US East (N. Virginia), October 2026, over a 730-hour month. Prices change.",
        },
        {
          kind: "p",
          text: "The c7i pool costs 77% more than the m7i pool, and 34 of its 64\u00a0vCPUs are unrequested. The r7i pool costs 31% more, with 136 of its 256\u00a0GiB unrequested.",
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: [
            "These counts use each type’s full vCPUs and memory. Kubernetes keeps part of every node for itself, so check the counts against ",
            { a: "allocatable", href: "/learn/kubernetes-allocatable-vs-capacity" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "Leave the t series out of steady pools. AWS’s EKS guidance says to avoid ",
            { a: "burstable", href: "/learn/glossary/burstable-instance" },
            " CPUs where performance must stay consistent.",
          ],
        },
      ],
    },
    {
      id: "step-2-choose-intel-amd-or-graviton",
      title: "Step 2: choose Intel, AMD or Graviton",
      blocks: [
        {
          kind: "p",
          text: "Within a series and generation, the option letter names the processor. Prices differ by processor. At 8\u00a0vCPUs and 32\u00a0GiB, in the same Region and month:",
        },
        {
          kind: "ul",
          items: [
            "m7g.2xlarge, Graviton: $0.3264 an hour, 19% less than m7i.",
            "m7i.2xlarge, Intel: $0.4032 an hour.",
            "m7a.2xlarge, AMD: $0.46368 an hour, 15% more than m7i.",
          ],
        },
        {
          kind: "p",
          text: "On four m7g.2xlarge nodes, the example pool comes to $953.09 a month, against $1,177.34 on m7i. AWS’s EKS cost guide puts Graviton at up to 20% cheaper than x86.",
        },
        {
          kind: "p",
          text: [
            "Graviton is Arm-based, so every image on those nodes needs an arm64 build, ",
            { a: "DaemonSets", href: "/learn/glossary/daemonset" },
            " included. AWS also advises keeping each workload on one architecture, for consistent performance.",
          ],
        },
        {
          kind: "p",
          text: "A newer generation isn’t always cheaper per hour. In the same Region, m8i.2xlarge lists at $0.42336, 5% above m7i.2xlarge. So compare prices rather than assume.",
        },
      ],
    },
    {
      id: "step-3-pick-a-size-your-pods",
      title: "Step 3: pick a size your pods can fill",
      blocks: [
        {
          kind: "p",
          text: "In the m7i family, price follows size: an m7i.4xlarge lists at $0.8064, exactly twice the 2xlarge. So a larger m7i doesn’t cost less per vCPU, but it can spread each node’s overhead.",
        },
        {
          kind: "p",
          text: "Every node runs a copy of each DaemonSet and adds calls to the API server. AWS’s EKS guide says that in general, fewer, larger instances are better, especially with many DaemonSets.",
        },
        {
          kind: "p",
          text: "AWS’s EKS best practices point to sizes from 4xlarge to 12xlarge. At those sizes, DaemonSets and system reserves take a smaller share of each node. The range stops short of the very large sizes with non-uniform memory access (NUMA).",
        },
        {
          kind: "h3",
          id: "limits-that-come-with-large-nodes",
          title: "Limits that come with large nodes",
        },
        {
          kind: "p",
          text: "AWS also notes that large nodes may not fill as fully as small ones. Four limits decide how far up to go:",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Pod slots." },
              " On a managed node group without a custom AMI, EKS caps a node at 110\u00a0pods under 30\u00a0vCPUs, and 250 above. An m7i.4xlarge has 16\u00a0vCPUs, so it gets 110. Pods that request 100m (a tenth of a vCPU) each fill all 110 slots with 11 of its 16\u00a0vCPUs requested.",
            ],
            [
              { b: "Auto Mode." },
              " ",
              { a: "EKS Auto Mode", href: "/learn/glossary/eks-auto-mode" },
              " holds every node to 110\u00a0pods or fewer.",
            ],
            [
              { b: "Outages." },
              " In AWS’s example of a cluster of three very large instances, one outage could affect a third of the cluster.",
            ],
            [
              { b: "EBS volumes." },
              " Each instance type caps the Amazon Elastic Block Store (EBS) volumes it can attach. Pods with their own volumes can reach that cap first.",
            ],
          ],
        },
        {
          kind: "p",
          text: [
            "The ",
            { a: "max pods per node", href: "/learn/glossary/max-pods-per-node" },
            " entry covers how the cap is worked out.",
          ],
        },
        {
          kind: "p",
          text: "Split pools by churn, too. AWS points small batch pods that start and stop often to the 4xlarge family. For Kafka, a low-churn service that takes 8\u00a0vCPU, it points to the 12xlarge family.",
        },
        {
          kind: "p",
          text: [
            {
              a: "Kubernetes node size best practices",
              href: "/learn/kubernetes-node-size-best-practices",
            },
            " works through the sizing arithmetic for each pool. The ",
            { a: "EKS pricing calculator", href: "/eks-and-aks-pricing-calculator" },
            " shows a candidate type’s monthly list price, and how much of it your pods can use.",
          ],
        },
      ],
    },
    {
      id: "step-4-on-demand-spot-or-a",
      title: "Step 4: On-Demand, Spot or a commitment",
      blocks: [
        {
          kind: "p",
          text: "A managed node group runs only On-Demand or only Spot instances, and On-Demand is the default. To run both, you create two groups.",
        },
        {
          kind: "p",
          text: [
            { a: "Spot instances", href: "/learn/glossary/spot-instance" },
            " are spare EC2 capacity at steep discounts, which AWS’s EKS cost guide puts at up to 90%. EC2 can take one back with a two-minute notice. AWS recommends Spot for stateless, fault-tolerant work, such as batch jobs, queue processing and stateless APIs.",
          ],
        },
        {
          kind: "p",
          text: "Spot calls for more EKS node instance types, not fewer. A Spot group should list several types, so it can draw on more Spot capacity pools.",
        },
        {
          kind: "p",
          text: "With the Cluster Autoscaler, AWS recommends types with the same vCPUs and memory. For 4\u00a0vCPUs and 8\u00a0GiB, its list includes c5.xlarge, c5a.xlarge and c5d.xlarge.",
        },
        { kind: "p", text: "A commitment can tie you to step 1’s answer:" },
        {
          kind: "ul",
          items: [
            [
              { a: "Compute Savings Plans", href: "/learn/glossary/savings-plan" },
              " can reduce EC2 cost by up to 66%, with no commitment to a type, family or Region.",
            ],
            "EC2 Instance Savings Plans reach up to 72%, but for one family in one Region.",
            "Both commit you for 1 or 3 years.",
          ],
        },
        { kind: "p", text: "So settle the family before you buy an EC2 Instance Savings Plan." },
      ],
    },
    {
      id: "put-the-types-in-a-node-group",
      title: "Put the types in a node group or a Karpenter NodePool",
      blocks: [
        {
          kind: "h3",
          id: "a-managed-node-group-keeps-a-fixed",
          title: "A managed node group keeps a fixed list",
        },
        {
          kind: "p",
          text: "A managed node group launches from the list of types you give it. On-Demand groups try them in the order you list them.",
        },
        {
          kind: "p",
          text: "AWS says the Cluster Autoscaler needs similarly sized node groups. So give each size its own group, and give Graviton its own group too.",
        },
        {
          kind: "p",
          text: [
            "Changing a group’s types later usually means a new group and a drain. ",
            {
              a: "How to change an EKS node group instance type",
              href: "/learn/change-eks-node-group-instance-type",
            },
            " walks through it, with the Arm checks.",
          ],
        },
        { kind: "h3", id: "karpenter-picks-from-a-range", title: "Karpenter picks from a range" },
        {
          kind: "p",
          text: [
            { a: "Karpenter", href: "/learn/what-is-karpenter" },
            " has no fixed list. It picks a type at each launch, from the pending pods’ needs, availability and cost. So steps 1 to 3 become bounds, not a single pick.",
          ],
        },
        {
          kind: "p",
          text: "AWS warns against narrowing it to one type. A Region holds only so many instances of any one type. Outgrow them, and launches fail with an error that none are available.",
        },
        {
          kind: "p",
          text: "Karpenter’s docs say instance types should be a list, and suggest bounds like these for most workloads:",
        },
        {
          kind: "code",
          lang: "yaml",
          code: 'requirements:\n  - key: kubernetes.io/arch\n    operator: In\n    values: ["amd64"]\n  - key: karpenter.k8s.aws/instance-category\n    operator: In\n    values: ["c", "m", "r"]',
        },
        {
          kind: "p",
          text: "With c, m and r allowed, Karpenter can match the family to the pods it places. Add arm64 to the architectures once your images have arm64 builds, and Graviton joins the range.",
        },
      ],
    },
    {
      id: "how-coral-works-with-your-eks-instance",
      title: "How Coral works with your EKS instance types",
      blocks: [
        {
          kind: "p",
          text: "Every step above starts from your pods’ requests. AWS’s EKS cost guide says requests should match real use, because requests set too high leave capacity unused.",
        },
        {
          kind: "p",
          text: [
            { a: "Coral", href: "/coral" },
            " optimizes Kubernetes on AKS and EKS. It rebalances each container’s CPU and memory requests to what it really uses. That changes the ratio from step 1, so the family that fits can change too.",
          ],
        },
        { kind: "p", text: "What Coral then does with your nodes depends on your autoscaler:" },
        {
          kind: "ul",
          items: [
            [
              { b: "With Karpenter." },
              " A rebalance replaces the nodes you choose with cheaper machines that still fit the work. Your Karpenter launches them, and the old nodes are drained and removed one by one.",
            ],
            [
              { b: "With only the Cluster Autoscaler." },
              " Coral drains spare nodes for it to remove, but never changes their size. A new instance type is still a new node group.",
            ],
            [
              { b: "With no autoscaler." },
              " Connecting the cluster can set up Karpenter on EKS, with your approval.",
            ],
          ],
        },
        {
          kind: "p",
          text: "Coral never adds machines to a managed node group, and a rebalance never goes past a PodDisruptionBudget (PDB). When a node is emptied, a single-copy app that can’t get a new copy first gets a short restart.",
        },
        {
          kind: "p",
          text: [
            { a: "EKS cost optimization", href: "/eks-cost-optimization" },
            " covers what Coral does on EKS. The ",
            { a: "Kubernetes cost optimization guide", href: "/kubernetes-cost-optimization" },
            " puts requests and nodes in order.",
          ],
        },
      ],
    },
  ],
  help: {
    product: "coral",
    text: "Coral rebalances CPU and memory requests on AKS and EKS, works with your HPA, and drains spare nodes so your autoscaler can remove them. We estimate it takes 40–50% off AKS and EKS cost. It is an estimated range, not a promise. The free assessment works out your own figure.",
    links: [
      { label: "Kubernetes optimization with Coral", href: "/coral" },
      { label: "Estimate your saving", href: "/assessment?p=coral" },
    ],
  },
  sources: [
    {
      publisher: "AWS",
      title: "“Choose an optimal Amazon EC2 node instance type”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/choosing-instance-type.html",
    },
    {
      publisher: "AWS",
      title: "“Amazon EC2 instance type naming conventions”",
      url: "https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-type-names.html",
    },
    {
      publisher: "AWS",
      title: "“Amazon EC2 On-Demand Pricing”",
      url: "https://aws.amazon.com/ec2/pricing/on-demand/",
    },
    {
      publisher: "AWS",
      title: "“Compute and Autoscaling”",
      url: "https://docs.aws.amazon.com/eks/latest/best-practices/cost-opt-compute.html",
      note: " (Amazon EKS Best Practices Guide)",
    },
    {
      publisher: "AWS",
      title: "“Node and Workload Efficiency”",
      url: "https://docs.aws.amazon.com/eks/latest/best-practices/node_and_workload_efficiency.html",
      note: " (Amazon EKS Best Practices Guide)",
    },
    {
      publisher: "AWS",
      title: "“Kubernetes Data Plane”",
      url: "https://docs.aws.amazon.com/eks/latest/best-practices/scale-data-plane.html",
      note: " (Amazon EKS Best Practices Guide)",
    },
    {
      publisher: "AWS",
      title: "“Simplify node lifecycle with managed node groups”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/managed-node-groups.html",
    },
    {
      publisher: "Karpenter",
      title: "“NodePools”",
      url: "https://karpenter.sh/docs/concepts/nodepools/",
    },
  ],
  related: [
    {
      title: "Kubernetes node size best practices: large or small nodes",
      where: "Learn",
      href: "/learn/kubernetes-node-size-best-practices",
    },
    {
      title: "How to change an EKS node group instance type",
      where: "Learn",
      href: "/learn/change-eks-node-group-instance-type",
    },
    {
      title: "What is Karpenter? How it picks and removes nodes",
      where: "Learn",
      href: "/learn/what-is-karpenter",
    },
    {
      title: "Kubernetes allocatable vs capacity: what pods can use",
      where: "Learn",
      href: "/learn/kubernetes-allocatable-vs-capacity",
    },
    {
      title: "How to choose AKS node sizes",
      where: "Learn",
      href: "/learn/how-to-choose-aks-node-sizes",
    },
  ],
};
