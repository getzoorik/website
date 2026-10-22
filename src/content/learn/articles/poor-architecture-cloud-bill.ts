import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/poor-architecture-cloud-bill/1";
import { figure as figure2 } from "@/features/learn/figures/poor-architecture-cloud-bill/2";

export const article: Article = {
  slug: "poor-architecture-cloud-bill",
  title: "How poor architecture increases your cloud bill",
  meta: "A high cloud bill is often an architecture problem, not a billing problem: VMs vs containers, where design adds cost, and how one client reduced compute 44%.",
  h1: "How Poor Infra Architecture Quietly Increases Your Cloud Bill",
  deck: "Why a high cloud bill is often an architecture problem, not a billing problem.",
  card: "Why a high cloud bill is often an architecture problem, not a billing problem.",
  product: "coral",
  hub: "Cloud cost",
  topic: "Cloud cost",
  published: "2026-10-14",
  updated: "2026-10-22",
  author: "vineet",
  shareCard: {
    url: "/og/zoorik-learn-poor-architecture-cloud-bill-1200x630.png",
    alt: "Zoorik. How poor architecture increases your cloud bill.",
  },
  cover: "/learn-covers/zoorik-learn-poor-architecture-cloud-bill-1200x630.webp",
  short:
    "A high cloud bill often comes from how a system is built, not from what each resource costs. When every app runs on its own VM sized for its peak, you pay for capacity that sits idle most of the day. Measure real use first. Then let compatible workloads share capacity, scale with demand and switch off idle environments: in the engagement below, that took a client’s monthly compute bill from about $2,800 to about $1,560.",
  sections: [
    {
      id: "the-hidden-cost-of-architectural-decisions",
      title: "The hidden cost of architectural decisions",
      blocks: [
        {
          kind: "p",
          text: "During a recent cloud cost engagement, we found a client running every workload on a dedicated virtual machine (VM) rather than in containers. Nothing looked wrong: the applications ran, and the infrastructure was available. What we had to ask was whether the client was paying for the computing power its applications need, or for the way it had chosen to build them.",
        },
        {
          kind: "p",
          text: "Picture one of those applications. Its VM has 8\u00a0vCPUs and 32\u00a0GB of RAM to handle peak traffic, but for most of the day it uses a fraction of that, and you pay for the provisioned capacity all the same. Now repeat that for every application, each with its own allocation and little room to scale.",
        },
        {
          kind: "p",
          text: "Over time, the unused capacity adds up. Development and test environments stay on, scaling stays manual, and teams add capacity for a traffic spike but rarely revisit the original sizes. Each decision looks reasonable alone. Together they become a large share of the bill, and the cause is the architecture and how it is run, not the VM itself.",
        },
      ],
    },
    {
      id: "vms-versus-containers-understanding-the-architectural-trade-off",
      title: "VMs versus containers: the architectural trade-off",
      blocks: [
        {
          kind: "p",
          text: "A VM runs its own operating system on virtualized hardware. A container packages an application and its dependencies and shares the host’s kernel. That difference changes how capacity gets used.",
        },
        {
          kind: "p",
          text: "A VM-centric design usually gives each application a dedicated slice of capacity, which stays reserved while the application is idle. With containers, many applications share a pool of nodes. An orchestrator such as Kubernetes places each workload by its resource requests, constraints and availability needs, so the spare room on one node can serve another workload.",
        },
        { kind: "svg", figure: figure1 },
        { kind: "p", text: "That shared pool brings more than packing:" },
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
          text: "Containers don’t reduce the bill on their own. A Kubernetes cluster with oversized nodes, too many replicas, inflated requests and idle environments can cost more than a well-designed set of VMs. The most common case is requests. Pods reserve more CPU and memory than they use, and the cluster keeps paying for nodes that hold capacity nobody consumes.",
        },
        {
          kind: "p",
          text: "So the goal isn’t to replace every VM with a container, but to choose the architecture that fits the workload and uses what it provisions.",
        },
      ],
    },
    {
      id: "where-poor-architecture-translates-into-higher-costs",
      title: "Five places poor architecture adds cost",
      blocks: [
        {
          kind: "h3",
          id: "1-overprovisioning-compute-and-storage",
          title: "1. Overprovisioning compute and storage",
        },
        {
          kind: "p",
          text: "An application sized for a theoretical peak, not for measured demand, pays for capacity it doesn’t use. One that needs a lot during a short processing window and little the rest of the day is a poor fit for a permanently large VM. Depending on the workload, smaller VMs, scheduled scaling, containers or serverless compute may fit better.",
        },
        {
          kind: "p",
          text: [
            "Storage follows the same pattern. Disks are sized for the largest dataset a team expects, and ",
            {
              a: "Azure managed disks and Amazon EBS volumes can grow but can’t shrink in place",
              href: "/learn/shrink-azure-managed-disk",
            },
            ". Capacity bought for a one-time peak can stay on the bill for years.",
          ],
        },
        {
          kind: "h3",
          id: "2-running-workloads-in-isolation-when-they",
          title: "2. Running workloads in isolation when they could share capacity",
        },
        {
          kind: "p",
          text: "A separate VM per application makes sense when isolation, security, licensing or operations require it. When workloads are compatible and peak at different times, though, dedicated machines split capacity into pieces too small to share, and containers let those workloads share a pool while still keeping them apart at the application level. The saving comes from tighter packing, not from containers as such.",
        },
        {
          kind: "h3",
          id: "3-scaling-infrastructure-instead-of-fixing-the",
          title: "3. Scaling infrastructure instead of fixing the application",
        },
        {
          kind: "p",
          text: "Adding CPU and memory is the easy answer to a slow application. If the real cause is inefficient database queries, a memory leak, heavy logging, needless background work or poor caching, more capacity hides the problem and adds a recurring charge. Review application performance alongside infrastructure use.",
        },
        {
          kind: "h3",
          id: "4-ignoring-non-production-environments",
          title: "4. Ignoring non-production environments",
        },
        {
          kind: "p",
          text: "Development, QA, staging and temporary test environments can run around the clock when nobody needs them to.",
        },
        {
          kind: "callout",
          label: "Rule of thumb",
          text: "Look at non-production before any migration. Scheduled shutdowns, environments created on demand and cleanup policies reduce the bill without touching the production architecture.",
        },
        {
          kind: "h3",
          id: "5-designing-for-peak-traffic-without-a",
          title: "5. Designing for peak traffic without a scaling strategy",
        },
        {
          kind: "p",
          text: "Production has to handle spikes, but keeping enough capacity for the absolute peak running all the time is expensive. Horizontal scaling, autoscaling, queue-based processing and asynchronous work can match capacity to demand, as long as availability, latency and resilience hold while the system scales. Reducing cost should never mean reducing reliability.",
        },
      ],
    },
    {
      id: "how-we-approach-cloud-cost-optimization-as",
      title: "How we approach cloud cost optimization as engineers",
      blocks: [
        {
          kind: "p",
          text: "Don’t start by changing VM sizes or migrating applications: start by understanding how the architecture, the workloads’ behaviour and the spending relate. We follow six steps.",
        },
        { kind: "h3", id: "1-establish-a-baseline", title: "1. Establish a baseline" },
        {
          kind: "p",
          text: "Review spending, compute use, CPU and memory metrics, traffic patterns, storage, network charges and spending per environment, then find which workloads drive the bill and when their use actually happens.",
        },
        { kind: "h3", id: "2-understand-the-workload", title: "2. Understand the workload" },
        {
          kind: "p",
          text: "Is it CPU-heavy, memory-heavy, driven by traffic, a batch job or always on? A stateless web service, a stateful database and a nightly batch job shouldn’t get the same design by default.",
        },
        {
          kind: "h3",
          id: "3-compare-realistic-architecture-options",
          title: "3. Compare realistic architecture options",
        },
        {
          kind: "p",
          text: "Weigh VMs, containers, managed container platforms, serverless services or a mix. Include migration effort, platform running costs, licensing, observability, networking, security and operational complexity.",
        },
        { kind: "h3", id: "4-model-the-expected-savings", title: "4. Model the expected savings" },
        {
          kind: "p",
          text: "Estimate the difference between the current setup and the proposal, with real demand, high availability, autoscaling headroom, idle capacity and any extra platform costs. Don’t set one VM’s price against one container’s: they aren’t equivalent units.",
        },
        {
          kind: "h3",
          id: "5-validate-through-measurement",
          title: "5. Validate through measurement",
        },
        {
          kind: "p",
          text: "Run a representative load test or a controlled pilot, and compare cost per request or per transaction, utilization, latency, error rates and availability. A smaller bill at the same service level is the result that counts.",
        },
        {
          kind: "h3",
          id: "6-prevent-the-same-costs-from-returning",
          title: "6. Prevent the same costs from returning",
        },
        {
          kind: "p",
          text: "Add tagging, budgets, utilization alerts, regular sizing reviews, autoscaling policies and infrastructure standards, so that cost becomes part of the engineering lifecycle, not a one-time project.",
        },
      ],
    },
    {
      id: "what-we-found-in-that-engagement",
      title: "What we found in that engagement",
      blocks: [
        {
          kind: "p",
          text: "The client ran 12 applications on 18 VMs. That was six customer-facing services on two VMs each, four internal services on one VM each, and two databases. Every service VM was a 4\u00a0vCPU, 16\u00a0GB general-purpose machine, and each database had an 8\u00a0vCPU, 32\u00a0GB one. Over 30\u00a0days, average CPU utilization was 11% and memory utilization 31%.",
        },
        {
          kind: "p",
          text: "We moved the 16 service VMs onto one managed Kubernetes cluster of four nodes, each with 8\u00a0vCPU and 32\u00a0GB, spread across availability zones. Each service was sized from its measured use. The customer-facing ones scale out on demand. The two databases stayed on VMs and moved to memory-optimized 4\u00a0vCPU machines with the same 32\u00a0GB of RAM.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "Before the move, those 16 VMs held 16 × 4 = 64\u00a0vCPU and 16 × 16 = 256\u00a0GB, and the four nodes now hold 4 × 8 = 32\u00a0vCPU and 4 × 32 = 128\u00a0GB, half of each. Both databases went from 8 to 4\u00a0vCPU, so 2 × 8 = 16\u00a0vCPU became 2 × 4 = 8, with memory unchanged at 2 × 32 = 64\u00a0GB. Altogether, the client went from 80\u00a0vCPU and 320\u00a0GB to 40\u00a0vCPU and 192\u00a0GB.",
        },
        {
          kind: "p",
          text: "The monthly compute bill, at on-demand prices, went from about $2,800 to about $1,560: $1,240 a month less, a 44% reduction. Through a two-week side-by-side pilot, p95 latency, error rates and availability stayed within the client’s targets.",
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
          text: "Cloud cost optimization is often treated as a finance exercise: review the bill, find the expensive services, negotiate or buy discounts. Discounts reduce the price of capacity. They can’t fix an application that has been overprovisioned for years, and monitoring, which shows the unused capacity, can’t redesign the system that created it either.",
        },
        {
          kind: "p",
          text: "The lasting approach brings engineering, architecture and FinOps together. Engineers know how workloads behave, architects decide how systems are built, and FinOps connects those decisions to business outcomes.",
        },
        {
          kind: "p",
          text: "The lesson from this engagement wasn’t that VMs are bad or that containers always win, but that infrastructure decisions deserve to be challenged continuously. Why does this application need this much compute, and could workloads share capacity safely? Does it need to run all day? Is it scaling because demand grew, or because the application is inefficient? The most effective cost work often happens before the next resource is provisioned, with a better architectural decision.",
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
            { a: "Coral", href: "/coral" },
            " optimizes Kubernetes on AKS and EKS. Once workloads share a cluster, the next cost is the one in the Watch out above: requests set far above use. Coral rebalances CPU and memory requests to measured use, works with your HPA, and drains spare nodes so your Cluster Autoscaler, AKS node auto-provisioning or Karpenter can remove them.",
          ],
        },
        {
          kind: "p",
          text: [
            "On our own AKS development cluster, Coral removed a spare worker, rebalanced the requests of 14 apps and swapped the remaining worker for a cheaper machine of the same size. Eight days after we connected it, ",
            { a: "the machine bill", href: "/value-lab/coral-dev-cluster" },
            " was $154.76 a month instead of $368.65, 58% less.",
          ],
        },
      ],
    },
  ],
  help: {
    product: "coral",
    text: "Coral rebalances CPU and memory requests on AKS and EKS, works with your HPA, and drains spare nodes so your autoscaler can remove them. We estimate it takes 40–50% off AKS and EKS cost. It is an estimated range, not a promise. The free assessment works out your own figure.",
    links: [
      { label: "Kubernetes cost optimization with Coral", href: "/coral" },
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
      title: "How we reduced our own cluster’s machine bill by 58%",
      where: "Zoorik",
      href: "/value-lab/coral-dev-cluster",
    },
    {
      title: "How to reduce cloud costs: the fixes that move the bill",
      where: "Learn",
      href: "/learn/how-to-reduce-cloud-costs",
    },
    {
      title: "Can you shrink an Azure managed disk?",
      where: "Learn",
      href: "/learn/shrink-azure-managed-disk",
    },
    {
      title: "VPA vs HPA: when to use which, and why to rebalance first",
      where: "Learn",
      href: "/learn/vpa-vs-hpa",
    },
  ],
};
