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
  headline: "Stop paying for empty disk space",
  body: "Removes the volumes you don’t use and adds them back when you need them.",
  runsOn: { label: "Runs on", platforms: ["azure", "aws", "windows", "linux"] },
  cta: {
    href: `${routes.assessment}?p=amoeba`,
    label: "Estimate your saving",
  },
  more: "Block storage cost optimization with Amoeba",
  caption: workedExample.amoeba,
};
