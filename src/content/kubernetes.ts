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
  headline: "Stop paying for idle Kubernetes capacity",
  body: "Removes what you don’t use and keeps what you do. No code changes.",
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
