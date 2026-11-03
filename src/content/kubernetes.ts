import { routes } from "@/config/site";
import type { ProductSectionContent } from "@/content/product-section";
import { workedExample } from "@/content/savings";

/**
 * Product 01 — Coral.
 *
 * Every string the home section prints, in the words the mock prints them, and
 * the line `/coral` prints under its How it works cards (`caption`). The home
 * page shows Coral's film beside the copy (`home-films.ts`).
 */
export const kubernetesContent: ProductSectionContent = {
  product: "coral",
  /* The h2 names Coral's category and links to /coral, which owns the search "Kubernetes optimization"; the pillar
     owns "Kubernetes cost optimization" (owner, 2 Nov 2026). */
  headline: "Kubernetes optimization",
  /* What Coral does, why it matters and its claim, in one sentence. "No code changes" is the By design band's,
     for both products. */
  body: "Coral rebalances workloads and removes spare nodes to reduce your cloud cost, without any downtime.",
  /* The home page's link to the Kubernetes pillar, which owns the search "Kubernetes cost optimization". */
  guide: [
    "Read the ",
    { a: "Kubernetes cost optimization", href: routes.kubernetesCostOptimization },
    " guide.",
  ],
  runsOn: {
    label: "Runs on",
    platforms: ["aks", "eks"],
    links: { aks: routes.aksCostOptimization, eks: routes.eksCostOptimization },
  },
  cta: {
    href: `${routes.assessment}?p=coral`,
    label: "Estimate your saving",
  },
  /* Not the category: "Kubernetes cost optimization" is the pillar's search (D229), so the link to /coral names the
     product, as its title does (owner, 1 Nov 2026). */
  more: "Kubernetes optimization with Coral",
  /* Says whose example the How it works figures are: our own cluster, not a
     customer's. */
  caption: workedExample.coral,
};
