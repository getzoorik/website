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
  /* The SEO heading pass (owner, 23 Oct 2026): the h2 names the category and links to /coral; the line leads with
     the old headline. */
  headline: "Kubernetes cost optimization",
  body: "Stop paying for idle Kubernetes capacity. Coral rebalances workloads and removes the nodes you don’t need. No code changes.",
  runsOn: { label: "Runs on", platforms: ["aks", "eks"] },
  cta: {
    href: `${routes.assessment}?p=coral`,
    label: "Estimate your saving",
  },
  more: "Kubernetes cost optimization with Coral",
  /* Says whose example the How it works figures are: our own cluster, not a
     customer's. */
  caption: workedExample.coral,
};
