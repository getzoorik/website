import { routes } from "@/config/site";
import type { ProductSectionContent } from "@/content/product-section";
import { workedExample } from "@/content/savings";

/**
 * Product 02 — the Amoeba section's words.
 *
 * The headline and the deck are claims: change them only with the claims the
 * site already makes about Amoeba.
 *
 * 🔴 THE FIGURES ARE A WORKED EXAMPLE, AND THE CAPTION SAYS SO. `/amoeba` prints
 * `caption` under its How it works cards, whose figures are the one-pager's:
 * "Example at Azure list price.", only what the figures are. The home page
 * shows Amoeba's film beside the copy (`home-films.ts`).
 */
export const elasticContent: ProductSectionContent = {
  product: "amoeba",
  /* The SEO heading pass (owner, 23 Oct 2026): the h2 names the category and links to /amoeba. */
  headline: "Block storage optimization",
  /* Why Amoeba matters, then what it does and its claim (2 Nov 2026: without any downtime, said plainly). The clouds
     and the OSs are the Runs on chips'. */
  body: "Cloud disks can grow but not shrink. Amoeba moves a VM’s data disks onto one pool, then rightsizes it without any downtime.",
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
  /* The category, then the product (2 Nov 2026), as Coral's and the Learn help boxes word it. */
  more: "Block storage optimization with Amoeba",
  caption: workedExample.amoeba,
};
