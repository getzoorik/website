import { routes } from "@/config/site";
import type { ProductSectionContent } from "@/content/product-section";
import { workedExample } from "@/content/savings";

/**
 * Product 02 — the Amoeba section's words.
 *
 * Copied from the design source verbatim. The headline and the deck are
 * marketing claims, and a paraphrase is a different claim.
 *
 * 🔴 THE FIGURES ARE A WORKED EXAMPLE, AND THE CAPTION SAYS SO. `/amoeba` prints
 * `caption` under its How it works cards, whose figures are the one-pager's:
 * "Example at Azure list price.", only what the figures are. The home page
 * shows Amoeba's film beside the copy (`home-films.ts`).
 */
export const elasticContent: ProductSectionContent = {
  product: "amoeba",
  /* The SEO heading pass (owner, 23 Oct 2026): the h2 names the category and links to /amoeba. */
  headline: "Block storage cost optimization",
  /* "After the one switch" (owner, 1 Nov 2026): the services restart once, at the switch onto the pool, as the How it works card says. */
  body: "Stop paying for empty disk space. Amoeba rightsizes Azure managed disks and Amazon EBS on Windows and Linux VMs, autonomously, without any downtime after the one switch.",
  /* Azure and AWS link to their cloud pages on the home page; Windows and Linux stay plain (owner, 1 Nov 2026). */
  runsOn: {
    label: "Runs on",
    platforms: ["azure", "aws", "windows", "linux"],
    links: { azure: routes.azureManagedDiskCostOptimization, aws: routes.ebsCostOptimization },
  },
  cta: {
    href: `${routes.assessment}?p=amoeba`,
    label: "Estimate your saving",
  },
  /* The category alone (owner, 23 Oct 2026), as Coral's. */
  more: "Block storage cost optimization",
  caption: workedExample.amoeba,
};
