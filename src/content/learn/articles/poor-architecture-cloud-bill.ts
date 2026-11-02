import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/poor-architecture-cloud-bill/1";
import { figure as figure2 } from "@/features/learn/figures/poor-architecture-cloud-bill/2";

export const article: Article = {
  slug: "poor-architecture-cloud-bill",
  title: "How poor architecture increases your cloud costs",
  meta: "High cloud costs are often an architecture problem, not a pricing problem: VMs vs containers, where design adds cost, and how to size from measured use.",
  h1: "How poor architecture increases your cloud costs",
  deck: "High cloud cost often comes from how a system is built and sized, not from what each resource costs.",
  card: "Why high cloud costs are often an architecture problem, not a pricing problem.",
  product: "coral",
  hub: "Cloud cost",
  topic: "Cloud cost",
  published: "2026-10-14",
  updated: "2026-11-02",
  author: "vineet",
  cover: "/learn-covers/zoorik-learn-poor-architecture-cloud-bill-1200x630.webp",
  coverAlt:
    "Architecture and cloud cost: one VM per app, against a shared pool of nodes with headroom",
  short:
    "When every app runs on its own VM sized for its peak, you pay for capacity that sits idle most of the day. Sizing from measured use, sharing capacity and scaling with demand took one client’s monthly compute cost from about $2,800 to about $1,560.",
  sections: [
    {
      id: "the-hidden-cost-of-architectural-decisions",
      title: "The hidden cost of architectural decisions",
      blocks: [
        {
          kind: "p",
          text: "In one cloud cost engagement, a client ran every workload on its own virtual machine (VM) rather than in containers. Everything worked. The question was whether the client paid for the computing power its apps need, or for the way it had built them.",
        },
        {
          kind: "p",
          text: "Take one of those apps. Its VM has 4\u00a0vCPUs and 16\u00a0GB of RAM for peak traffic, but most of the day it uses a fraction of that. You pay for all of it, app after app.",
        },
        {
          kind: "p",
          text: "Over time, the unused capacity adds up. Development and test environments stay on, scaling stays manual, and capacity added for a traffic spike is never revisited. The cause is the architecture and how it’s run, not the VM itself.",
        },
      ],
    },
    {
      id: "vms-versus-containers-understanding-the-architectural-trade-off",
      title: "Container vs VM: the architectural trade-off",
      blocks: [
        {
          kind: "h3",
          id: "difference-between-a-vm-and-a-container",
          title: "The difference between a VM and a container",
        },
        {
          kind: "p",
          text: "A VM runs its own operating system on virtualized hardware. A container packages an application and its dependencies and shares the host’s kernel. That difference changes how capacity gets used.",
        },
        {
          kind: "p",
          text: "A VM-centric design usually gives each app a dedicated slice of capacity, reserved even while the app is idle. With containers, many apps share a pool of nodes. An orchestrator such as Kubernetes places each workload by its resource requests, constraints and availability needs, so spare room on one node can serve another.",
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "h3",
          id: "why-a-shared-pool-uses-capacity-better",
          title: "Why a shared pool of nodes uses capacity better",
        },
        {
          kind: "ul",
          items: [
            [
              { b: "Better use of capacity:" },
              " workloads share the same nodes, so one application’s quiet hours leave room for another’s busy ones.",
            ],
            [{ b: "Independent scaling:" }, " each application scales with its own demand."],
            [
              { b: "Placement:" },
              " the orchestrator finds a node with room for each container, so nobody places workloads on machines by hand.",
            ],
            [{ b: "Consistent deployments:" }, " one packaging format everywhere."],
            [
              { b: "Visibility:" },
              " requests, limits and workload metrics show, workload by workload, where capacity is overprovisioned.",
            ],
          ],
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "Containers don’t reduce cloud cost on their own. A cluster with oversized nodes, too many replicas, inflated requests and idle environments can cost more than well-designed VMs. Inflated requests are the most common: pods reserve more CPU and memory than they use, and the cluster keeps nodes for capacity nobody uses.",
        },
        {
          kind: "p",
          text: "The goal isn’t to replace every VM with a container, but to choose the architecture that fits the workload and uses what it provisions.",
        },
      ],
    },
    {
      id: "where-poor-architecture-translates-into-higher-costs",
      title: "Five places poor architecture adds cost",
      blocks: [
        {
          kind: "h3",
          id: "overprovisioning-compute-and-storage",
          title: "1. Overprovisioning compute and storage",
        },
        {
          kind: "p",
          text: "An app sized for a theoretical peak, not for measured demand, pays for capacity it doesn’t use. An app that is busy for a short window and quiet the rest of the day is a poor fit for a permanently large VM. Smaller VMs, scheduled scaling, containers or serverless compute may fit it better.",
        },
        {
          kind: "p",
          text: [
            "Storage follows the same pattern: disks are sized for the largest dataset a team expects. ",
            {
              a: "Azure managed disks and Amazon EBS volumes can grow but can’t shrink in place",
              href: "/learn/shrink-azure-managed-disk",
            },
            ". Capacity bought for a one-time peak can keep costing you for years.",
          ],
        },
        {
          kind: "h3",
          id: "running-workloads-in-isolation-when-they-could",
          title: "2. Running workloads in isolation when they could share capacity",
        },
        {
          kind: "p",
          text: "A separate VM per app makes sense when isolation, security, licensing or operations require it. For compatible workloads that peak at different times, though, dedicated machines split capacity into pieces too small to share.",
        },
        {
          kind: "p",
          text: "The saving comes from tighter packing, not from containers as such.",
        },
        {
          kind: "h3",
          id: "scaling-infrastructure-instead-of-optimizing-applications",
          title: "3. Scaling infrastructure instead of fixing the application",
        },
        {
          kind: "p",
          text: "Adding CPU and memory is the easy answer to a slow app. If the real cause is slow queries, a memory leak, heavy logging or poor caching, more capacity hides it and adds a recurring charge. Review the app’s performance alongside its infrastructure.",
        },
        {
          kind: "h3",
          id: "ignoring-non-production-environments",
          title: "4. Ignoring non-production environments",
        },
        {
          kind: "p",
          text: "Development, QA, staging and test environments can run around the clock when nobody needs them.",
        },
        {
          kind: "callout",
          label: "Rule of thumb",
          text: "Look at non-production before any migration. Scheduled shutdowns, environments created on demand and cleanup policies reduce cloud cost without touching the production architecture.",
        },
        {
          kind: "h3",
          id: "designing-for-peak-traffic-without-a-scaling",
          title: "5. Designing for peak traffic without a scaling strategy",
        },
        {
          kind: "p",
          text: "Production has to handle spikes, but keeping peak capacity running all day is expensive. Autoscaling, queue-based processing and asynchronous work can match capacity to demand, as long as availability, latency and resilience hold. Reducing cost should never mean reducing reliability.",
        },
      ],
    },
    {
      id: "how-we-approach-cloud-cost-optimization-as",
      title: "How we review an architecture for cost",
      blocks: [
        {
          kind: "p",
          text: "Don’t start by resizing VMs or migrating apps. Start by understanding how the architecture, the workloads’ behaviour and the cost relate.",
        },
        { kind: "h3", id: "establish-a-baseline", title: "1. Establish a baseline" },
        {
          kind: "p",
          text: "Review cost, CPU and memory use, traffic patterns, storage, network charges and cost per environment. Then find which workloads drive the cost, and when.",
        },
        { kind: "h3", id: "understand-the-workload", title: "2. Understand the workload" },
        {
          kind: "p",
          text: "Work out whether each workload is CPU-heavy, memory-heavy, driven by traffic, a batch job or always on. A stateless web service, a stateful database and a nightly batch job shouldn’t get the same design by default.",
        },
        {
          kind: "h3",
          id: "compare-realistic-architecture-options",
          title: "3. Compare realistic architecture options",
        },
        {
          kind: "p",
          text: "Weigh VMs, containers, managed container platforms, serverless services or a mix. Include migration effort, platform running costs, licensing, observability, networking, security and operational complexity.",
        },
        { kind: "h3", id: "model-the-expected-savings", title: "4. Model the expected savings" },
        {
          kind: "p",
          text: "Estimate the difference between the current setup and the proposal. Include real demand, high availability, autoscaling headroom, idle capacity and any extra platform costs. Don’t set one VM’s price against one container’s: they aren’t equivalent units.",
        },
        {
          kind: "h3",
          id: "validate-through-measurement",
          title: "5. Validate through measurement",
        },
        {
          kind: "p",
          text: [
            "Run a representative load test or a controlled pilot, and compare ",
            { a: "cost per request", href: "/learn/glossary/cloud-unit-economics" },
            " or per transaction, utilization, latency, error rates and availability. Paying less at the same service level is the result that counts.",
          ],
        },
        {
          kind: "h3",
          id: "6-prevent-the-same-costs-from-returning",
          title: "6. Prevent the same costs from returning",
        },
        {
          kind: "p",
          text: [
            "Add ",
            { a: "tagging", href: "/learn/glossary/cloud-tagging-strategy" },
            ", budgets, utilization alerts, regular sizing reviews, autoscaling policies and infrastructure standards. Then cost becomes part of the engineering lifecycle, not a one-time project.",
          ],
        },
      ],
    },
    {
      id: "what-we-found-in-that-engagement",
      title: "What we found in that engagement",
      blocks: [
        {
          kind: "p",
          text: "The client ran 12 apps on 18 VMs: six customer-facing services on two VMs each, four internal services on one VM each, and two databases. Every service VM was a 4\u00a0vCPU, 16\u00a0GB general-purpose machine, and each database VM had 8\u00a0vCPU and 32\u00a0GB. Over 30\u00a0days, average CPU utilization was 11% and memory utilization 31%.",
        },
        {
          kind: "p",
          text: "We moved the 16 service VMs onto one managed Kubernetes cluster: four nodes of 8\u00a0vCPU and 32\u00a0GB, spread across availability zones. Each service was sized from its measured use, and the customer-facing ones scale out on demand. The two databases stayed on VMs, now memory-optimized 4\u00a0vCPU machines with the same 32\u00a0GB.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "The 16 service VMs held 16 × 4 = 64\u00a0vCPU and 16 × 16 = 256\u00a0GB. The four nodes hold 4 × 8 = 32\u00a0vCPU and 4 × 32 = 128\u00a0GB, half of each. With the databases down from 16 to 8\u00a0vCPU and their 64\u00a0GB unchanged, 80\u00a0vCPU and 320\u00a0GB became 40\u00a0vCPU and 192\u00a0GB.",
        },
        {
          kind: "p",
          text: [
            "The monthly compute cost, at ",
            { a: "on-demand", href: "/learn/glossary/on-demand-instance" },
            " prices, went from about $2,800 to about $1,560: $1,240 a month less, a 44% reduction. Through a two-week side-by-side pilot, p95 latency, error rates and availability stayed within the client’s targets.",
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
      title: "Cloud cost is an engineering discipline",
      blocks: [
        {
          kind: "p",
          text: "Discounts reduce the price of capacity, and monitoring shows the unused part. Neither can fix an app that has been overprovisioned for years, or redesign the system that created it.",
        },
        {
          kind: "p",
          text: [
            "Engineers, architects and ",
            { a: "FinOps", href: "/learn/glossary/finops" },
            " can ask four questions of each workload:",
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
      title: "Where Coral fits once workloads share a cluster",
      blocks: [
        {
          kind: "p",
          text: [
            "In a shared cluster, the next cost is the one in the Watch out above: requests set far above use. ",
            { a: "Coral", href: "/coral" },
            " optimizes Kubernetes on AKS and EKS, and rebalances CPU and memory requests to measured use.",
          ],
        },
        {
          kind: "p",
          text: [
            "On our own AKS development cluster, Coral removed a spare worker and rebalanced the requests of 14 apps. It also swapped the remaining worker for a cheaper machine of the same size. Eight days after we connected it, ",
            { a: "the cluster’s machines cost", href: "/coral-value-lab" },
            " $154.76 a month instead of $368.65.",
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
      title: "How we reduced our own AKS cluster’s machine cost by 58%",
      where: "Coral Value Lab",
      href: "/coral-value-lab",
    },
    {
      title: "Cloud cost optimization: how to reduce cloud costs on Azure and AWS",
      where: "Learn",
      href: "/cloud-cost-optimization",
    },
    {
      title: "Can you shrink an Azure managed disk?",
      where: "Learn",
      href: "/learn/shrink-azure-managed-disk",
    },
    {
      title: "VPA vs HPA: when to use which",
      where: "Learn",
      href: "/learn/vpa-vs-hpa",
    },
  ],
};
