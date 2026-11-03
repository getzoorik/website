import { learnPath, routes } from "@/config/site";
import { assessContent, assessmentHref } from "@/content/assess";
import { howItWorksSteps } from "@/content/how-it-works";
import { kubernetesContent } from "@/content/kubernetes";
import { productFilms } from "@/content/product-films";
import type { ProductPageContent, ReadMoreTile } from "@/content/product-page";

/**
 * `/coral`: every string the page prints, in the mock's layout.
 *
 * The product tour adds each row's line and the film (`product-films.ts`).
 * What Coral does is a heading, so it has no "?" (owner, 1 Nov 2026).
 *
 * The Runs on chips and the line under the How it works cards are read from
 * `kubernetes.ts`, and the cards from `how-it-works.ts`, rather than copied: a
 * second copy would be a second claim free to drift. The hero's line is this
 * page's own: the H1 and one short line under it. Nothing here is a new figure.
 *
 * Coral's h1 is "Kubernetes optimization", and its `<title>` "Coral: Kubernetes optimization".
 * The lead links the guide at /kubernetes-cost-optimization. Coral is never shown as running on
 * Windows or Linux.
 */
/**
 * The day /coral's content last changed (the sheet pass), for the sitemap's
 * `lastmod` only: the page does not print it. Whoever changes /coral's content
 * moves this to that day in the same PR; never the build's date.
 */
export const coralPageLastUpdated = "3 November 2026";

/**
 * Read more's FAQ tile. The per-cloud pages (`/aks-cost-optimization`,
 * `/eks-cost-optimization`) draw the same one.
 */
export const coralFaqTile: ReadMoreTile = {
  kind: "page",
  title: "FAQ",
  line: "Sizing, safety, HPA, nodes and autoscalers",
  href: routes.coralFaq,
};

export const coralPageContent: ProductPageContent = {
  product: "coral",
  meta: {
    title: "Coral: Kubernetes optimization",
    description:
      "Coral rebalances pod requests and removes spare nodes on AKS and EKS to reduce Kubernetes cost, autonomously and without any downtime.",
    appDescription:
      "Kubernetes cost optimization for AKS and EKS. Coral rebalances pod requests to real use and removes the nodes you don’t need.",
  },
  hero: {
    title: "Kubernetes optimization",
    line: "Coral rebalances AKS and EKS workloads and nodes to reduce cost, autonomously and without any downtime.",
    cta: { label: assessContent.assessment.cta.label, href: assessmentHref("coral") },
  },
  about: {
    title: "What is Coral?",
    /* The links: the subject's guide, and the autoscalers Coral works with, each to its works-with page. */
    paragraphs: [
      [
        "Coral is a ",
        { a: "Kubernetes cost optimization", href: routes.kubernetesCostOptimization },
        " platform for Azure Kubernetes Service (AKS) and Amazon Elastic Kubernetes Service (EKS). It rebalances CPU and memory requests to real use and removes the nodes you don’t need, with no application code changes.",
      ],
      "For platform and engineering teams, Coral shows where your Kubernetes cost goes and what each change saves at your cloud’s list price.",
      "Workload optimization starts when you switch on “Automatically optimize” for a policy or a workload. Pods then resize in place, or are replaced one at a time within their PodDisruptionBudgets.",
      /* How a pod moves off a node, as the guide states it: a Ready copy first (warm handover), or live migration. */
      "Node optimization is on from install, for the node pools you choose. When Coral empties a node, a pod can get a Ready copy on another node first, or move there by container live migration.",
      [
        "Coral works alongside your autoscalers: the Horizontal Pod Autoscaler, ",
        { a: "KEDA", href: routes.coralWorksWithKeda },
        ", ",
        { a: "Karpenter", href: routes.coralWorksWithKarpenter },
        ", ",
        { a: "AKS node auto provisioning (NAP)", href: routes.coralWorksWithNodeAutoProvisioning },
        " and ",
        { a: "the Cluster Autoscaler", href: routes.coralWorksWithClusterAutoscaler },
        ".",
      ],
    ],
    more: "More about Coral",
  },
  offerings: [
    {
      /* The id stays, as it is an address. */
      id: "monitoring",
      label: "Cost monitoring",
      drawing: "cost",
      line: "Cost always tracked, every action logged.",
    },
    {
      id: "recommendations",
      label: "Recommendations",
      drawing: "requests",
      line: "New requests, spare nodes and the saving.",
    },
    {
      id: "workload-optimization",
      label: "Workload optimization",
      drawing: "fit",
      line: "CPU and memory requests set to real use.",
    },
    {
      id: "node-optimization",
      label: "Node optimization",
      drawing: "drain",
      line: "Spare nodes removed one at a time; Coral never creates machines.",
    },
  ],
  what: {
    heading: "What Coral does",
    runsOn: kubernetesContent.runsOn,
  },
  film: productFilms.coral,
  how: {
    title: "How it works",
    steps: howItWorksSteps.coral,
    example: kubernetesContent.caption,
  },
  readMore: {
    title: "Coral docs and guides",
    allDocs: { label: "All docs", href: `${routes.docs}#coral` },
    tiles: [
      {
        kind: "page",
        title: "Product guide",
        line: "Connect, what changes, staying in control",
        href: routes.coralGuide,
      },
      coralFaqTile,
      { kind: "download", title: "One-pager", document: "coral-one-pager" },
      /* Its /learn article. */
      {
        kind: "page",
        title: "Kubernetes autoscaling",
        line: "What each autoscaler scales, plus Karpenter",
        href: learnPath("kubernetes-autoscaling"),
      },
      /* Its two cloud pages (owner, 1 Nov 2026), each line what that page covers. */
      {
        kind: "page",
        title: "AKS cost optimization",
        line: "Node pools, NAP and the Cluster Autoscaler",
        href: routes.aksCostOptimization,
      },
      {
        kind: "page",
        title: "EKS cost optimization",
        line: "EC2 instances, Karpenter and the Cluster Autoscaler",
        href: routes.eksCostOptimization,
      },
    ],
  },
};
