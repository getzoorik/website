import { learnPath, routes } from "@/config/site";
import type { Article } from "@/content/learn/article";

export const article: Article = {
  slug: "poor-architecture-cloud-bill",
  title: "How poor architecture increases your cloud bill",
  meta: "Cloud waste is often an architecture problem, not a billing problem: VMs vs containers, where poor design adds cost, and how one client cut compute 44%.",
  h1: "How Poor Infrastructure Architecture Quietly Increases Your Cloud Bill",
  deck: "Why cloud waste is often an architecture problem, not a billing problem.",
  card: "Why cloud waste is often an architecture problem, not a billing problem.",
  product: "coral",
  hub: "Cloud cost",
  topic: "Cloud cost",
  published: "2026-10-14",
  updated: "2026-10-14",
  author: "vineet",
  shareCard: {
    url: "/og/zoorik-learn-poor-architecture-cloud-bill-1200x630.png",
    alt: "Zoorik. How poor architecture increases your cloud bill.",
  },
  lead: [
    {
      kind: "p",
      text: "Cloud cost optimization is not just about choosing cheaper resources. It starts with making better architectural decisions.",
    },
    {
      kind: "p",
      text: "During a recent cloud cost optimization engagement, we came across an interesting infrastructure decision: instead of deploying containerized applications, the client was running workloads on virtual machines (VMs).",
    },
    {
      kind: "p",
      text: "At first glance, there was nothing obviously wrong with this setup. The applications were running, the infrastructure was available, and the workloads were being served.",
    },
    {
      kind: "p",
      text: "But when we looked at the architecture from a cost optimization perspective, an important question came up:",
    },
    {
      kind: "quote",
      text: "Are we paying for the computing power our applications actually need, or are we paying for the way we chose to architect them?",
    },
    { kind: "p", text: "That question is at the heart of cloud cost optimization." },
    {
      kind: "image",
      src: "/articles/vm-vs-kubernetes-cloud-cost-infographic.webp",
      srcset:
        "/articles/vm-vs-kubernetes-cloud-cost-infographic-700.webp 700w, /articles/vm-vs-kubernetes-cloud-cost-infographic.webp 1400w",
      alt: "Infographic comparing the VM approach, where each app runs on its own VM with fixed resources even when idle, with the Kubernetes approach, where containers share a compute pool, plus when to use each.",
      caption: "Dedicated VMs versus containers on a shared compute pool, and when each one fits.",
      width: 1400,
      height: 933,
    },
  ],
  sections: [
    {
      id: "the-hidden-cost-of-architectural-decisions",
      title: "The hidden cost of architectural decisions",
      blocks: [
        {
          kind: "p",
          text: "Cloud providers make it easy to provision infrastructure. You can spin up a VM in minutes, increase its CPU and memory, and deploy your application.",
        },
        {
          kind: "p",
          text: "The problem is that provisioning infrastructure is easy. Designing it efficiently is much harder.",
        },
        {
          kind: "p",
          text: "Consider a typical application deployed on virtual machines. You provision a VM with 8 vCPUs and 32 GB of RAM to handle peak traffic. However, during most of the day, the application uses only a fraction of those resources. You continue paying for the provisioned capacity even when the workload does not fully use it.",
        },
        {
          kind: "p",
          text: "Now imagine several applications, each running on its own VM with individually allocated resources and limited flexibility to scale.",
        },
        {
          kind: "p",
          text: "Over time, unused capacity accumulates. Development and testing environments remain running. Scaling becomes a manual exercise. Teams provision additional infrastructure to handle traffic spikes but rarely revisit their original allocations.",
        },
        {
          kind: "p",
          text: "Individually, these decisions might appear reasonable. Collectively, they can become a significant source of cloud waste.",
        },
        {
          kind: "p",
          text: "The issue is not necessarily the VM itself. It is the architecture and operating model surrounding it.",
        },
      ],
    },
    {
      id: "vms-versus-containers-understanding-the-architectural-trade-off",
      title: "VMs versus containers: understanding the architectural trade-off",
      blocks: [
        {
          kind: "p",
          text: "A VM runs its own operating system environment on virtualized infrastructure. A container packages an application and its dependencies while sharing the host operating system’s kernel. This difference creates opportunities for more efficient resource utilization.",
        },
        {
          kind: "p",
          text: "With a VM-centric architecture, teams often allocate resources to individual application environments. Depending on the design, that capacity may remain reserved even when the application is idle.",
        },
        {
          kind: "p",
          text: "With a containerized architecture, multiple application containers can run on a shared pool of compute resources. An orchestrator such as Kubernetes can schedule workloads according to their resource requests, constraints and availability requirements.",
        },
        {
          kind: "image",
          src: "/articles/dedicated-vms-vs-shared-pool.svg",
          alt: "Five apps, each on its own mostly idle VM, compared with the same five apps sharing one pool of capacity with headroom, so fewer machines are needed.",
          caption:
            "The same five apps on dedicated VMs, and on a shared pool sized for their combined demand. Illustration, not to scale.",
          width: 1400,
          height: 720,
        },
        { kind: "p", text: "This can enable:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Better resource utilization:" },
              " multiple workloads can share the underlying compute capacity.",
            ],
            [
              { b: "More flexible scaling:" },
              " applications can scale independently based on demand.",
            ],
            [
              { b: "Improved workload placement:" },
              " an orchestrator can schedule containers across available nodes.",
            ],
            [
              { b: "More consistent deployments:" },
              " standardized packaging simplifies application delivery across environments.",
            ],
            [
              { b: "Greater visibility:" },
              " resource requests, limits and workload metrics help teams identify overprovisioning.",
            ],
          ],
        },
        { kind: "p", text: "However, containers do not automatically reduce cloud costs." },
        {
          kind: "p",
          text: "A poorly configured Kubernetes cluster with oversized nodes, excessive replicas, unrealistic resource requests and idle environments can cost more than a well-designed VM-based architecture. The most common form of this waste is resource requests: pods reserving more CPU and memory than they ever use, so the cluster keeps buying nodes for capacity nobody consumes.",
        },
        {
          kind: "p",
          text: [
            "We see this in our own environment too. ",
            {
              a: "On our own Kubernetes development cluster",
              href: routes.caseStudyCoralDevCluster,
            },
            ", the applications were reserving almost twice the CPU they actually needed. Right-sizing their requests, removing an idle node and rebalancing onto a cheaper machine ",
            {
              a: "cut the cluster’s machine bill by 58% in eight days",
              href: routes.caseStudyCoralDevCluster,
            },
            ".",
          ],
        },
        {
          kind: "p",
          text: "The goal is not to replace every VM with a container. The goal is to select an architecture that matches the workload and uses provisioned resources efficiently.",
        },
      ],
    },
    {
      id: "where-poor-architecture-translates-into-higher-costs",
      title: "Where poor architecture translates into higher costs",
      blocks: [
        {
          kind: "h3",
          id: "overprovisioning-compute-and-storage",
          title: "1. Overprovisioning compute and storage",
        },
        {
          kind: "p",
          text: "When applications are sized for their theoretical peak requirements instead of measured demand, organizations often pay for capacity that remains unused.",
        },
        {
          kind: "p",
          text: "For example, an application might require substantial resources during a short processing window but consume very little for the rest of the day. A permanently oversized VM can be an inefficient solution for that workload. Depending on the application’s characteristics, alternatives could include smaller, right-sized VMs, scheduled scaling, containers or serverless compute.",
        },
        {
          kind: "p",
          text: [
            "The same pattern shows up in storage. Disks are often sized for the largest dataset a team expects, and ",
            {
              a: "Azure managed disks and AWS EBS volumes can grow but cannot be shrunk in place",
              href: learnPath("shrink-azure-managed-disk"),
            },
            ". Capacity bought for a one-time peak can stay on the bill for years.",
          ],
        },
        { kind: "p", text: "The right answer comes from workload analysis, not assumptions." },
        {
          kind: "h3",
          id: "running-workloads-in-isolation-when-they-could",
          title: "2. Running workloads in isolation when they could share capacity",
        },
        {
          kind: "p",
          text: "Deploying every application on a separate VM can make sense when isolation, security, licensing or operational requirements demand it.",
        },
        {
          kind: "p",
          text: "But when workloads are compatible and have complementary resource patterns, dedicated infrastructure may introduce unnecessary fragmentation. Containerization can allow multiple workloads to share a compute pool while retaining application-level separation.",
        },
        {
          kind: "p",
          text: "The potential savings come from reducing unused capacity and improving packing efficiency, not simply from using containers.",
        },
        {
          kind: "h3",
          id: "scaling-infrastructure-instead-of-optimizing-applications",
          title: "3. Scaling infrastructure instead of optimizing applications",
        },
        {
          kind: "p",
          text: "Sometimes the easiest response to performance issues is to increase CPU and memory.",
        },
        {
          kind: "p",
          text: "But what if the real problem is inefficient database queries, memory leaks, excessive logging, unnecessary background processing or poor caching?",
        },
        {
          kind: "p",
          text: "Adding infrastructure may temporarily improve performance, but it can also hide the underlying issue and increase recurring costs. An engineering-led cost review should examine application performance alongside infrastructure utilization.",
        },
        {
          kind: "h3",
          id: "ignoring-non-production-environments",
          title: "4. Ignoring non-production environments",
        },
        {
          kind: "p",
          text: "Development, QA, staging and temporary testing environments can quietly consume resources around the clock.",
        },
        {
          kind: "p",
          text: "If those environments do not need to run continuously, scheduled shutdowns, automated environment provisioning and cleanup policies can deliver savings without changing the production architecture. This is often one of the simplest opportunities to investigate before undertaking a major migration.",
        },
        {
          kind: "h3",
          id: "designing-for-peak-traffic-without-a-scaling",
          title: "5. Designing for peak traffic without a scaling strategy",
        },
        {
          kind: "p",
          text: "Production systems must handle traffic spikes, but keeping enough infrastructure running for the absolute peak at all times may be unnecessarily expensive.",
        },
        {
          kind: "p",
          text: "Depending on the workload, horizontal scaling, autoscaling, queue-based processing and asynchronous execution can help align capacity with actual demand. The architecture must still preserve availability, acceptable latency and resilience during scaling events.",
        },
        { kind: "p", text: "Cost optimization should never mean compromising reliability." },
      ],
    },
    {
      id: "how-we-approach-cloud-cost-optimization-as",
      title: "How we approach cloud cost optimization as engineers",
      blocks: [
        {
          kind: "p",
          text: "When investigating an infrastructure bill, the first step should not be to start changing VM sizes or migrating applications. It should be to understand the relationship between architecture, workload behavior and spending.",
        },
        { kind: "p", text: "Our engineering approach follows a few fundamental steps." },
        { kind: "h3", id: "establish-a-baseline", title: "1. Establish a baseline" },
        {
          kind: "p",
          text: "Review cloud expenditure, compute utilization, CPU and memory metrics, traffic patterns, storage, network charges and environment-level spending. Identify which workloads contribute most to the bill and when their resource consumption actually occurs.",
        },
        { kind: "h3", id: "understand-the-workload", title: "2. Understand the workload" },
        {
          kind: "p",
          text: "Determine whether the application is CPU-intensive, memory-intensive, traffic-driven, batch-oriented or continuously running. A stateless web service, a stateful database and a nightly batch-processing job should not automatically receive the same infrastructure design.",
        },
        {
          kind: "h3",
          id: "compare-realistic-architecture-options",
          title: "3. Compare realistic architecture options",
        },
        {
          kind: "p",
          text: "Evaluate whether the workload is best suited to VMs, containers, managed container platforms, serverless services or a hybrid approach. Include migration effort, platform operating costs, licensing, observability, networking, security and operational complexity in the comparison.",
        },
        { kind: "h3", id: "model-the-expected-savings", title: "4. Model the expected savings" },
        {
          kind: "p",
          text: "Estimate the difference between the existing setup and the proposed architecture. Account for actual resource demand, high availability, autoscaling headroom, idle capacity and any additional platform costs.",
        },
        {
          kind: "p",
          text: "Avoid comparing only the price of one VM with the price of a container. They are not equivalent units of infrastructure.",
        },
        {
          kind: "h3",
          id: "validate-through-measurement",
          title: "5. Validate through measurement",
        },
        {
          kind: "p",
          text: "Run a representative workload test or controlled pilot where possible. Compare cost per request, cost per transaction, resource utilization, latency, error rates and availability.",
        },
        {
          kind: "p",
          text: "A lower monthly bill is useful. A lower cost while maintaining the required service level is a much stronger result.",
        },
        {
          kind: "h3",
          id: "prevent-the-same-waste-from-returning",
          title: "6. Prevent the same waste from returning",
        },
        {
          kind: "p",
          text: "Introduce resource tagging, budgets, utilization alerts, right-sizing reviews, autoscaling policies and infrastructure standards. Cost optimization should become part of the engineering lifecycle rather than a one-time exercise.",
        },
      ],
    },
    {
      id: "what-we-found-in-that-engagement",
      title: "What we found in that engagement",
      blocks: [
        {
          kind: "p",
          text: "The client was running 12 applications on 18 VMs: six customer-facing services on two VMs each, four internal services on one VM each, and two databases. The services ran on 4 vCPU, 16 GB general-purpose machines and the databases on 8 vCPU, 32 GB ones. Over 30 days, their average CPU utilization was 11% and memory utilization 31%.",
        },
        {
          kind: "p",
          text: "We moved the 16 service VMs onto one managed Kubernetes cluster of four 8 vCPU, 32 GB nodes spread across availability zones, with each service sized from its measured usage and the customer-facing ones scaling out on demand. The two databases stayed on VMs, moving to memory-optimized 4 vCPU machines with the same 32 GB of RAM.",
        },
        {
          kind: "p",
          text: "The monthly compute bill, at on-demand prices, went from about $2,800 to about $1,560, a 44% reduction, while p95 latency, error rates and availability stayed within the client’s targets through a two-week side-by-side pilot.",
        },
        {
          kind: "note",
          text: "Figures are rounded, and some details are changed to keep the client anonymous.",
        },
      ],
    },
    {
      id: "the-bigger-lesson-cloud-waste-is-often",
      title: "The bigger lesson: cloud waste is often an architecture problem",
      blocks: [
        {
          kind: "p",
          text: "Cloud cost optimization is frequently treated as a finance exercise: review the bill, find expensive services, and negotiate or purchase discounts.",
        },
        {
          kind: "p",
          text: "Those activities can help, but they do not address every source of waste. Discounts can reduce the price of infrastructure. They cannot fix an application that has been overprovisioned for years. Monitoring can expose unused capacity. It cannot, by itself, redesign the system that created that capacity.",
        },
        {
          kind: "p",
          text: "The more sustainable approach is to bring engineering, architecture and FinOps together. Engineers understand how workloads behave. Architects determine how systems should be structured. FinOps helps connect technical decisions to business outcomes.",
        },
        {
          kind: "p",
          text: "When these perspectives work together, cloud cost optimization becomes an ongoing engineering discipline.",
        },
      ],
    },
    {
      id: "final-thoughts",
      title: "Final thoughts",
      blocks: [
        {
          kind: "p",
          text: "The lesson from our client engagement was not that VMs are bad or that containers are always better. It was that infrastructure decisions deserve to be challenged continuously.",
        },
        {
          kind: "p",
          text: "Why does this application need this much compute? Could workloads share resources safely? Does capacity need to run all day? Is the system scaling because demand has increased, or because the application itself is inefficient?",
        },
        {
          kind: "p",
          text: "These questions can reveal opportunities that are easy to miss when cloud cost optimization begins and ends with the billing dashboard.",
        },
        {
          kind: "p",
          text: "The most effective cloud cost optimization often starts before the next resource is provisioned, with a better architectural decision.",
        },
        {
          kind: "p",
          text: "What has your experience been? Have you seen cloud costs increase because of architectural decisions that initially seemed perfectly reasonable? We would love to hear your perspective.",
        },
        {
          kind: "note",
          text: [
            "Vineet is an infrastructure engineer at Zoorik and led the client engagement described here. Zoorik builds Kubernetes and block storage cost optimization for Azure and AWS. To see where your own cloud spend is going, try the free assessment at ",
            { a: "zoorik.com/assessment", href: routes.assessment },
            ".",
          ],
        },
      ],
    },
  ],
  related: [
    {
      title: "How we reduced our own cluster’s machine bill by 58%",
      where: "Case study",
      href: routes.caseStudyCoralDevCluster,
    },
    {
      title: "Can you shrink an Azure managed disk?",
      where: "Learn",
      href: learnPath("shrink-azure-managed-disk"),
    },
    {
      title: "VPA vs HPA: rebalance first, then scale out",
      where: "Learn",
      href: learnPath("vpa-vs-hpa"),
    },
  ],
};
