import { learnPath, routes } from "@/config/site";
import { assessContent, assessmentHref } from "@/content/assess";
import { howItWorksSteps } from "@/content/how-it-works";
import { kubernetesContent } from "@/content/kubernetes";
import { productFilms } from "@/content/product-films";
import type { ProductPageContent, ReadMoreTile } from "@/content/product-page";

/**
 * `/coral`: every string the page prints, verbatim from the mock.
 *
 * The product tour adds each row's line and the film (`product-films.ts`).
 * What Coral does is a heading, so it has no "?" (owner, 1 Nov 2026).
 *
 * The Runs on chips and the line under the How it works cards are read from
 * `kubernetes.ts`, and the cards from `how-it-works.ts`, rather than copied: a
 * second copy would be a second claim free to drift. The hero's line is this
 * page's own (owner, 2 Nov 2026: the H1 and one small line under it), in the
 * pinned Coral help box's words. Nothing here is a new figure.
 *
 * Coral's h1 is "Kubernetes optimization for AKS and EKS", and its `<title>`
 * "Coral: Kubernetes optimization for AKS and EKS" (owner, 1 Nov 2026, O1):
 * the search "Kubernetes cost optimization" belongs to
 * /kubernetes-cost-optimization (D229), so neither carries it. It is never shown as running on Windows
 * or Linux.
 */
/**
 * The day /coral's content last changed (the sheet pass), for the sitemap's
 * `lastmod` only: the page does not print it. Whoever changes /coral's content
 * moves this to that day in the same PR; never the build's date.
 */
export const coralPageLastUpdated = "2 November 2026";

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
    title: "Coral: Kubernetes optimization for AKS and EKS",
    description:
      "Kubernetes optimization platform for AKS and EKS. Coral is Kubernetes resource optimization software that rebalances requests and nodes to reduce cloud cost.",
    appDescription:
      "Kubernetes cost optimization on AKS and EKS. Coral sizes pod requests to real use and drains spare nodes one at a time.",
  },
  hero: {
    title: "Kubernetes optimization for AKS and EKS",
    line: "Coral rebalances workloads and drains spare nodes so your autoscaler can remove them.",
    cta: { label: assessContent.assessment.cta.label, href: assessmentHref("coral") },
  },
  about: {
    title: "What is Coral?",
    /* The links (owner, 1 Nov 2026): the subject's pillar, which owns the search "Kubernetes cost optimization"
       (D229), and the autoscalers Coral works with, each to its works-with page. */
    paragraphs: [
      [
        "Coral is a ",
        { a: "Kubernetes cost optimization", href: routes.kubernetesCostOptimization },
        " platform for Azure Kubernetes Service (AKS) and Amazon Elastic Kubernetes Service (EKS). It finds the CPU, memory and nodes your clusters pay for but don’t use.",
      ],
      "Coral helps platform and engineering teams reduce AKS and EKS cost with no application code changes. With Coral, you see where your Kubernetes cost goes, and what each change saves at your cloud’s list price.",
      "Pod sizing starts when you switch on “Automatically optimize” for a policy or a workload. Pods then resize in place or restart one at a time, within their PodDisruptionBudgets.",
      /* The warm handover as CORAL-CODE-FACTS.md states it, in the FAQ's words for the rest ("a short restart"). */
      "Node optimization is on from install, and you choose the node pools it works on. When Coral drains a node, a pod of a Deployment can get a Ready copy on another node first. A pod whose replacement can’t start first gets a short restart.",
      [
        "Coral works alongside native Kubernetes autoscaling: the Horizontal Pod Autoscaler, ",
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
      id: "monitoring",
      /* Named for the search "kubernetes cost monitoring" (owner, 2 Nov 2026); the id stays, as it is an address. */
      label: "Kubernetes cost monitoring",
      drawing: "cost",
      line: "Cost tracked always, every action logged.",
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
      line: "CPU and memory requests sized to real use.",
    },
    {
      id: "node-optimization",
      label: "Node optimization",
      drawing: "drain",
      line: "Spare nodes drained one at a time; Coral never creates machines.",
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
    title: "More on Coral: product guide, FAQ and Kubernetes guides",
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
