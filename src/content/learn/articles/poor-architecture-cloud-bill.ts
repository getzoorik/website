import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/poor-architecture-cloud-bill/1";
import { figure as figure2 } from "@/features/learn/figures/poor-architecture-cloud-bill/2";

export const article: Article = {
  slug: "poor-architecture-cloud-bill",
  title: "Container vs VM: which costs less?",
  meta: "Container vs VM: how each uses CPU and memory, when a VM fits better, and how one client reduced compute cost by 44%.",
  h1: "Container vs VM: which costs less?",
  deck: "How they differ, why shared nodes need fewer machines, and where architecture adds cost.",
  card: "How VMs and containers use capacity, and when sharing nodes reduces cost.",
  product: "coral",
  hub: "Cloud cost",
  topic: "Cloud cost",
  published: "2026-10-14",
  updated: "2026-11-03",
  author: "vineet",
  cover: "/learn-covers/zoorik-learn-poor-architecture-cloud-bill-1200x630.webp",
  coverAlt:
    "Architecture and cloud cost: one VM per app, against a shared pool of nodes with headroom",
  short:
    "Neither, on its own. A VM reserves a fixed amount of CPU and memory, busy or idle. Containers cost less when many apps share the same nodes, so one app’s spare room serves another. In one engagement, sharing nodes and sizing from measured use took monthly compute cost from about $2,800 to about $1,560.",
  sections: [
    {
      id: "vms-versus-containers-understanding-the-architectural-trade-off",
      title: "How VMs and containers differ",
      blocks: [
        {
          kind: "p",
          text: "The main difference between a VM and a container is the kernel. A virtual machine (VM) runs a full operating system, kernel included, on virtualized hardware. A container packages an app and its dependencies, and shares the host’s kernel.",
        },
        {
          kind: "table",
          columns: [
            { label: "Feature", width: "22%" },
            { label: "VM", width: "39%" },
            { label: "Container", width: "39%" },
          ],
          rows: [
            ["Isolation", "Strong: its own kernel", "Lighter: containers share the host’s kernel"],
            ["Resources", "A fixed amount, reserved for the VM", "Requested from a shared node"],
            [
              "Overhead",
              "More CPU, memory and storage for the operating system",
              "Less: no kernel of its own",
            ],
            ["Operating system", "Almost any", "One that runs on the host’s kernel"],
          ],
        },
        {
          kind: "p",
          text: "In the cloud, containers often run on VMs. So the cost question is one VM per app, or many apps sharing a pool of VMs as Kubernetes nodes.",
        },
        {
          kind: "h3",
          id: "running-workloads-in-isolation-when-they-could",
          title: "When to use each",
        },
        {
          kind: "p",
          text: "Use a VM when isolation, security or licensing requires one, or for a legacy app tied to its operating system. Use containers for microservices and apps with light resource needs.",
        },
      ],
    },
    {
      id: "the-hidden-cost-of-architectural-decisions",
      title: "Why one VM per app costs more",
      blocks: [
        {
          kind: "p",
          text: "Each VM is sized for its app’s peak. Take one with 4 vCPUs and 16 GB of RAM. Most of the day its app uses a fraction of that, but you pay for all of it, app after app.",
        },
        {
          kind: "p",
          text: "On shared nodes, Kubernetes places each pod by its resource requests, so one app’s quiet hours leave room for another’s busy ones. The saving comes from this tighter packing, not from containers as such.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "h3",
          id: "why-a-shared-pool-uses-capacity-better",
          title: "What a shared pool adds",
        },
        {
          kind: "ul",
          items: [
            [{ b: "Independent scaling:" }, " each app scales with its own demand."],
            [
              { b: "Automatic placement:" },
              " the scheduler finds a node with room for each pod, so nobody places apps by hand.",
            ],
            [
              { b: "Visibility:" },
              " requests and usage show, workload by workload, where capacity is overprovisioned.",
            ],
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: [
            "Containers don’t reduce cost on their own. Oversized nodes, extra replicas, idle environments and ",
            { a: "inflated requests", href: "/learn/kubernetes-overprovisioning" },
            " can make a cluster cost more than well-sized VMs. The scheduler and node autoscaling count what pods request, not what they use.",
          ],
        },
      ],
    },
    {
      id: "where-poor-architecture-translates-into-higher-costs",
      title: "Where architecture adds cost",
      blocks: [
        {
          kind: "h3",
          id: "overprovisioning-compute-and-storage",
          title: "Sized for peak, all day",
        },
        {
          kind: "p",
          text: "An app sized for a theoretical peak, not measured demand, pays for capacity it doesn’t use. Autoscaling, scheduled scaling, queues and asynchronous work can match capacity to demand, as long as latency and availability hold.",
        },
        {
          kind: "p",
          text: [
            "Storage follows the same pattern. ",
            {
              a: "Azure managed disks and Amazon EBS volumes grow but can’t shrink in place",
              href: "/learn/shrink-azure-managed-disk",
            },
            ". A disk sized for a one-time peak keeps costing after the peak.",
          ],
        },
        {
          kind: "h3",
          id: "scaling-infrastructure-instead-of-optimizing-applications",
          title: "Scaling instead of fixing",
        },
        {
          kind: "p",
          text: "More CPU and memory is the easy answer to a slow app. If the cause is slow queries, a memory leak, heavy logging or poor caching, more capacity hides it and adds a recurring charge. Review the app’s performance with its infrastructure.",
        },
        {
          kind: "h3",
          id: "ignoring-non-production-environments",
          title: "Idle non-production",
        },
        {
          kind: "p",
          text: "Development, QA, staging and test environments can run around the clock when nobody uses them.",
        },
        {
          kind: "callout",
          label: "Rule of thumb",
          text: "Check non-production before any migration. Scheduled shutdowns, environments created on demand and cleanup policies reduce cost without touching production.",
        },
      ],
    },
    {
      id: "how-we-approach-cloud-cost-optimization-as",
      title: "How to review an architecture",
      blocks: [
        {
          kind: "ol",
          items: [
            [
              { b: "Baseline." },
              " Record cost, CPU and memory use, traffic, storage and network per environment. Find which workloads drive the cost, and when.",
            ],
            [
              { b: "Workload type." },
              " Note whether each one is CPU-heavy, memory-heavy, traffic-driven, a batch job or always on. A web service, a database and a nightly job shouldn’t share one design by default.",
            ],
            [
              { b: "Options." },
              " Weigh VMs, containers, managed container platforms, serverless or a mix. Count migration effort, platform costs, licensing, networking, security and operations.",
            ],
            [
              { b: "Savings model." },
              " Compare current and proposed cost with real demand, high availability and autoscaling headroom. Don’t set one VM’s price against one container’s: they aren’t equal units.",
            ],
            [
              { b: "Pilot." },
              " Run a load test or a controlled pilot. Compare ",
              { a: "cost per request", href: "/learn/glossary/cloud-unit-economics" },
              ", latency, error rates and availability. Paying less at the same service level is what counts.",
            ],
            [
              { b: "Guardrails." },
              " ",
              { a: "Tagging", href: "/learn/glossary/cloud-tagging-strategy" },
              ", budgets, utilization alerts and regular sizing reviews keep the cost from coming back.",
            ],
          ],
        },
      ],
    },
    {
      id: "what-we-found-in-that-engagement",
      title: "From 16 VMs to 4 nodes",
      blocks: [
        {
          kind: "p",
          text: "A client ran 12 apps on 18 VMs: six customer-facing services on two VMs each, four internal services on one VM each, and two databases. Each service VM was a general-purpose machine with 4 vCPU and 16 GB, and each database VM had 8 vCPU and 32 GB. Over 30 days, average CPU use was 11% and memory use 31%.",
        },
        {
          kind: "p",
          text: "We moved the 16 service VMs onto one managed Kubernetes cluster: four nodes of 8 vCPU and 32 GB, across availability zones. Each service was sized from its measured use, and the customer-facing ones scale out on demand. The databases stayed on VMs, now memory-optimized machines with 4 vCPU and the same 32 GB.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "The 16 service VMs held 16 × 4 = 64 vCPU and 16 × 16 = 256 GB. The four nodes hold 4 × 8 = 32 vCPU and 4 × 32 = 128 GB, half of each. With the databases down from 16 to 8 vCPU and their 64 GB unchanged, 80 vCPU and 320 GB became 40 vCPU and 192 GB.",
        },
        {
          kind: "p",
          text: [
            "Monthly compute cost at ",
            { a: "on-demand", href: "/learn/glossary/on-demand-instance" },
            " prices went from about $2,800 to about $1,560: $1,240 a month less, a 44% reduction. In a two-week side-by-side pilot, p95 latency, error rates and availability stayed within the client’s targets.",
          ],
        },
        { kind: "svg", figure: figure2 },
        {
          kind: "p",
          text: "Figures are rounded, and some details are changed to keep the client anonymous.",
        },
      ],
    },
    {
      id: "the-bigger-lesson-cloud-waste-is-often",
      title: "Four questions per workload",
      blocks: [
        {
          kind: "p",
          text: [
            "Discounts reduce the price of capacity, and monitoring shows what goes unused. Neither fixes an app overprovisioned for years. Engineering and ",
            { a: "FinOps", href: "/learn/glossary/finops" },
            " teams can ask of each workload:",
          ],
        },
        {
          kind: "ul",
          items: [
            "Does it need this much compute?",
            "Could it share capacity safely with other workloads?",
            "Does it need to run all day?",
            "Is it scaling because demand grew, or because the app is inefficient?",
          ],
        },
      ],
    },
    {
      id: "where-coral-fits",
      title: "Where Coral fits",
      blocks: [
        {
          kind: "p",
          text: [
            "Once workloads share a cluster, the next cost is requests set far above use. ",
            { a: "Coral", href: "/coral" },
            " rebalances CPU and memory requests to measured use on AKS and EKS, and removes the nodes you don’t need, without any downtime.",
          ],
        },
        {
          kind: "p",
          text: [
            "On our own AKS development cluster, Coral removed a spare worker and rebalanced the requests of 14 apps. It also swapped the last worker for a cheaper machine of the same size. Eight days after we connected it, ",
            { a: "the cluster’s machines cost", href: "/coral-value-lab" },
            " $154.76 a month instead of $368.65.",
          ],
        },
      ],
    },
  ],
  help: {
    product: "coral",
    text: "Coral rebalances CPU and memory requests on AKS and EKS, works with your HPA, and removes the nodes you don’t need, without any downtime. We estimate it reduces AKS and EKS cost by 40–50%, a range rather than a promise. The free assessment works out your own figure.",
    links: [
      { label: "Kubernetes optimization with Coral", href: "/coral" },
      { label: "Estimate your saving", href: "/assessment?p=coral" },
    ],
  },
  sources: [
    {
      publisher: "Kubernetes",
      title: "“Overview”",
      url: "https://kubernetes.io/docs/concepts/overview/",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Containers vs. virtual machines”",
      url: "https://learn.microsoft.com/en-us/virtualization/windowscontainers/about/containers-vs-vm",
    },
    {
      publisher: "AWS",
      title: "“What’s the Difference Between Docker and a VM?”",
      url: "https://aws.amazon.com/compare/the-difference-between-docker-vm/",
    },
    {
      publisher: "Kubernetes",
      title: "“Resource Management for Pods and Containers”",
      url: "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/",
    },
    {
      publisher: "Kubernetes",
      title: "“Node Autoscaling”",
      url: "https://kubernetes.io/docs/concepts/cluster-administration/node-autoscaling/",
    },
    {
      publisher: "Kubernetes",
      title: "“Horizontal Pod Autoscaling”",
      url: "https://kubernetes.io/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Expand virtual hard disks on a Linux VM”",
      url: "https://learn.microsoft.com/en-us/azure/virtual-machines/linux/expand-disks",
    },
    {
      publisher: "AWS",
      title: "“Modify an Amazon EBS volume using Elastic Volumes operations”",
      url: "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-modify-volume.html",
    },
  ],
  related: [
    {
      title: "What is Kubernetes?",
      where: "Learn",
      href: "/learn/kubernetes-explained-simply",
    },
    {
      title: "How we reduced our own AKS cluster’s machine cost by 58%",
      where: "Coral Value Lab",
      href: "/coral-value-lab",
    },
    {
      title: "Cloud cost optimization",
      where: "Learn",
      href: "/cloud-cost-optimization",
    },
    {
      title: "Can you shrink an Azure managed disk?",
      where: "Learn",
      href: "/learn/shrink-azure-managed-disk",
    },
  ],
  relatedTitle: "More on architecture and cloud cost",
};
