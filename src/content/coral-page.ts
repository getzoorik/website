import { learnPath, routes } from "@/config/site";
import { assessContent, assessmentHref } from "@/content/assess";
import { howItWorksSteps } from "@/content/how-it-works";
import { kubernetesContent } from "@/content/kubernetes";
import { productFilms } from "@/content/product-films";
import type { ProductPageContent } from "@/content/product-page";

/**
 * `/coral`: every string the page prints, verbatim from the mock.
 *
 * The product tour adds each row's line, the "?" on What Coral does and the
 * film (`product-films.ts`).
 *
 * The Runs on chips and the line under the How it works cards are read from
 * `kubernetes.ts`, and the cards from `how-it-works.ts`, rather than copied: a
 * second copy would be a second claim free to drift. The savings figures on the
 * hero's right are the three ranges read from `savings.ts`; nothing here is a
 * new figure.
 *
 * Coral is "Kubernetes cost optimization" on AKS and EKS. It is never shown as
 * running on Windows or Linux.
 */
/**
 * The day /coral's content last changed (its title), for the sitemap's
 * `lastmod` only: the page does not print it. Whoever changes /coral's content
 * moves this to that day in the same PR; never the build's date.
 */
export const coralPageLastUpdated = "21 October 2026";

export const coralPageContent: ProductPageContent = {
  product: "coral",
  meta: {
    title: "Kubernetes cost optimization",
    description:
      "Coral rebalances AKS and EKS clusters to reduce your cloud bill, autonomously, without any downtime. Works with HPA, Karpenter, NAP and Cluster Autoscaler.",
    appDescription:
      "Kubernetes cost optimization on AKS and EKS. Coral sizes pod requests to real use and drains idle nodes one at a time.",
  },
  hero: {
    title: "Kubernetes cost optimization",
    supportedOn: { label: "Supported on", platforms: "AKS and EKS" },
    /* Exactly as the mock draws it: Karpenter and KEDA with their logos, NAP
       and the Cluster Autoscaler as names, with no mark and no empty slot. */
    compatibleWith: {
      label: "Compatible with your native",
      items: [
        { name: "Karpenter", logo: "karpenter" },
        { name: "NAP" },
        { name: "Cluster Autoscaler" },
        { name: "KEDA", logo: "keda" },
      ],
    },
    cta: { label: assessContent.assessment.cta.label, href: assessmentHref("coral") },
  },
  about: {
    title: "What is Coral?",
    paragraphs: [
      "Coral is a Kubernetes cost optimization platform for Azure Kubernetes Service (AKS) and Amazon Elastic Kubernetes Service (EKS). It continuously finds and removes the capacity your clusters don’t need, while your workloads keep serving. It sizes each container’s CPU and memory requests to what it really uses, and empties spare nodes one at a time so your autoscaler can remove them.",
      "Coral helps platform and engineering teams cut AKS and EKS cost with no application code changes. It monitors every workload and node, recommends right sizes and spare nodes with the saving, and applies them safely: pods resize in place or restart one at a time within their PodDisruptionBudgets, and nodes drain one at a time. Coral works alongside native Kubernetes autoscaling: the Horizontal Pod Autoscaler, KEDA, Karpenter, Node Auto Provisioning (NAP) and the Cluster Autoscaler.",
      "With Coral, you see where your Kubernetes spend goes, which capacity sits unused, and what each change saves at your cloud’s list price. Pod sizing starts when you switch on “Automatically optimize” for a policy or a workload. Node optimization is on from install, and you choose the node pools it works on.",
    ],
  },
  offerings: [
    {
      id: "monitoring",
      label: "Monitoring",
      icon: "monitor",
      line: "Cost tracked always, every action logged.",
    },
    {
      id: "recommendations",
      label: "Recommendations",
      icon: "reco",
      line: "Right sizes, spare nodes and the saving.",
    },
    {
      id: "workload-optimization",
      label: "Workload optimization",
      icon: "workload",
      line: "CPU and memory requests sized to real use.",
    },
    {
      id: "node-optimization",
      label: "Node optimization",
      icon: "node",
      line: "Spare nodes drained one at a time; never creates machines.",
    },
  ],
  what: {
    title: "What Coral does",
    heading: "What Coral does?",
    runsOn: kubernetesContent.runsOn,
  },
  film: productFilms.coral,
  how: {
    title: "How it works",
    steps: howItWorksSteps.coral,
    example: kubernetesContent.caption,
  },
  readMore: {
    title: "Read more",
    allDocs: { label: "All docs", href: `${routes.docs}#coral` },
    tiles: [
      {
        kind: "page",
        title: "Product guide",
        line: "Connect, what changes, staying in control",
        href: routes.coralGuide,
      },
      {
        kind: "page",
        title: "FAQ",
        line: "Sizing, safety, HPA, nodes and autoscalers",
        href: routes.coralFaq,
      },
      { kind: "download", title: "One-pager", document: "coral-one-pager" },
      /* Its /learn article. */
      {
        kind: "page",
        title: "HPA vs VPA vs Cluster Autoscaler",
        line: "What each one scales, plus Karpenter",
        href: learnPath("hpa-vs-vpa-vs-cluster-autoscaler"),
      },
    ],
  },
};
