import { blueskyProfile, substackPublication } from "@/config/entity";
import { amoebaDocs, calendarUrl, contactEmail, routes, site } from "@/config/site";
import type { ProductId } from "@/content/products";

/**
 * Footer copy.
 *
 * Prose lives here; the markup that arranges it lives in
 * `src/features/footer/`. Every string below is the mock's, verbatim — the
 * brand line, the badge, the column headings, the link labels, the one address
 * and the copyright line. Rewording any of them changes a marketing claim.
 *
 * The types are declared here rather than in `src/types/` because nothing
 * outside the footer consumes them yet.
 */

export interface FooterLink {
  readonly label: string;
  readonly href: string;
  /** A product's name: kept out of a page translator's hands (`translate="no"`). */
  readonly product?: true;
  /** A label that opens on a product's name ("Coral guide"): that name alone is
   *  kept out of translation, inside the label's span. */
  readonly named?: ProductId;
}

export interface FooterColumn {
  /** A paragraph, not a heading (`p.foot-h`): the mocks draw the column
   *  titles as labels, so the page's outline is its own sections alone. */
  readonly heading: string;
  readonly links: readonly FooterLink[];
  /** Drawn under the list before it, in that list's column, rather than as a
   *  column of its own ("Works with", under Products). */
  readonly stacked?: true;
}

export type FooterSocialPlatform =
  "linkedin" | "youtube" | "x" | "reddit" | "medium" | "github" | "bluesky" | "substack";

export interface FooterSocialLink {
  readonly platform: FooterSocialPlatform;
  /**
   * The real profile, never a guessed one: linking a 404 or a squatted account
   * from a marketing footer is worse than having no social row at all.
   */
  readonly href: string;
  /** The link's accessible name — the glyph inside it is `aria-hidden`. */
  readonly label: string;
}

/**
 * The line under the wordmark: what Zoorik does, then one
 * sentence per product, Coral first, each opening on the product's name.
 *
 * Kept as name and remainder so the template can keep each name out of
 * translation (`translate="no"`) without a sentence having to be split by hand
 * at render time. `lead` follows the company's name.
 */
export const footerBrand: {
  readonly lead: string;
  readonly lines: readonly { readonly product: ProductId; readonly rest: string }[];
} = {
  lead: " reduces cloud cost.",
  lines: [
    { product: "coral", rest: " optimizes Kubernetes on AKS and EKS." },
    {
      product: "amoeba",
      rest: " optimizes block storage on Windows and Linux VMs, on Azure and AWS.",
    },
  ],
};

/**
 * The claim under the line.
 *
 * `common` is the footer's one badge, "Built for Azure and AWS" (one combined
 * tag), and the product heroes draw it too. What each product runs on is drawn
 * on its own page's hero (the mocks' hero badges); `/login` names no tags.
 */
export const builtFor = {
  common: { label: "Built for", platforms: "Azure and AWS" },
} as const satisfies {
  readonly common: { readonly label: string; readonly platforms: string };
};

/**
 * Every profile Zoorik has, in the structured data's order. The
 * organisation's `sameAs` lists all eight: the first six first, and Bluesky and
 * Substack in their own places further down, among the other profiles.
 */
export const socialProfiles: readonly FooterSocialLink[] = [
  {
    platform: "linkedin",
    href: "https://www.linkedin.com/company/zoorik",
    label: "Zoorik on LinkedIn",
  },
  {
    platform: "youtube",
    href: "https://www.youtube.com/@getzoorik",
    label: "Zoorik on YouTube",
  },
  {
    platform: "x",
    href: "https://x.com/getzoorik",
    label: "Zoorik on X",
  },
  {
    platform: "reddit",
    href: "https://www.reddit.com/r/zoorik",
    label: "Zoorik on Reddit",
  },
  {
    platform: "medium",
    href: "https://medium.com/zoorik",
    label: "Zoorik on Medium",
  },
  {
    platform: "github",
    href: "https://github.com/getzoorik",
    label: "Zoorik on GitHub",
  },
  { platform: "bluesky", href: blueskyProfile, label: "Zoorik on Bluesky" },
  { platform: "substack", href: substackPublication, label: "Zoorik on Substack" },
];

/**
 * The footer's social row, seven tiles: LinkedIn, X, Bluesky, Substack, Reddit,
 * Medium, GitHub (owner, 29 Oct 2026). The mock's row held Reddit and YouTube
 * back until they carry something; Reddit is in its place from the full list,
 * and YouTube still waits. Each tile opens a new tab and says so in its name.
 */
const ROW: readonly FooterSocialPlatform[] = [
  "linkedin",
  "x",
  "bluesky",
  "substack",
  "reddit",
  "medium",
  "github",
];

export const footerSocialLinks: readonly FooterSocialLink[] = ROW.map((platform) =>
  socialProfiles.find((profile) => profile.platform === platform)!,
);

/** The legal name and the city, muted, at the left end of the bar under the columns (owner, 23 Oct 2026); © and the
 *  wordmark sit at its right end. */
export const footerCompany = { rest: " Private Limited · Bangalore, India" } as const;

/** The lead-in to the two marketplace buttons under the badge. */
export const footerMarketplaces = "Available in";

/** The lead-in to the two registry buttons under the stores. */
export const footerInstall = "Install from";

/**
 * "Ask about Zoorik on" (owner, 23 Oct 2026): under Install from, one button per AI assistant. Each opens the assistant
 * with a question about the page the reader is on already typed in; the reader sends it. Links only: no script of
 * ours runs there and nothing is stored. Gemini is not here: it has no address that types a question in.
 */
export const footerAsk = { lead: "Ask about ", tail: " on" } as const;

export type AskAssistant = "chatgpt" | "claude" | "perplexity" | "grok";

export const askAssistants: readonly {
  readonly id: AskAssistant;
  readonly name: string;
  /** The address the question is appended to, URI-encoded. */
  readonly base: string;
}[] = [
  { id: "chatgpt", name: "ChatGPT", base: "https://chatgpt.com/?q=" },
  { id: "claude", name: "Claude", base: "https://claude.ai/new?q=" },
  { id: "perplexity", name: "Perplexity", base: "https://www.perplexity.ai/search?q=" },
  { id: "grok", name: "Grok", base: "https://grok.com/?q=" },
];

/** Home's question, and the one any page without a printed title asks. */
export const askHome =
  "What is Zoorik (zoorik.com), and how do its products Coral and Amoeba reduce Kubernetes and block storage cost on Azure and AWS?";

/**
 * The question a page asks (page-aware, the owner's pick): home and the two product pages by name; every other page by
 * its printed title and its address, so an assistant that reads the web reads that page.
 */
export function askQuestion(path: string, title: string | undefined): string {
  const url = `${site.url}${path}`;
  if (path === "/" || !title) return askHome;
  if (path === routes.coral)
    return `What is Coral by Zoorik (${url}), and how does it reduce Kubernetes cost on AKS and EKS?`;
  if (path === routes.amoeba)
    return `What is Amoeba by Zoorik (${url}), and how does it reduce block storage cost on Azure and AWS?`;
  const name = title.replace(/\s*\|\s*Zoorik$/, "").trim();
  return `Summarize "${name}" from Zoorik (${url}), and how Zoorik helps reduce cloud cost.`;
}

/**
 * 🔴 THREE KINDS OF HREF IN THESE COLUMNS, AND THE MARKUP TREATS THEM APART.
 * The products, Assessment, the documents, Login and Privacy are pages of this
 * site, in the same tab; "Book a demo" is the calendar, which is off-site and
 * so opens in a new tab, says so, and shows the arrow; and the one address is a
 * `mailto:`, which stays in the tab.
 *
 * The same on every page. Assessment is the plain `/assessment`, never with a
 * `?p=`. Three columns after the brand: Products, with Pricing; Resources, the
 * articles, the research papers, each product's case study, the hubs, the two
 * cost calculators and each product's guide, FAQ and troubleshooting; Company,
 * with the Trust center and Contact. Every page they lead to is at the
 * site's root, nothing nested (owner, 29 Oct 2026).
 *
 * Privacy and Terms are last in Company, in that order.
 *
 * Each product on each cloud after its product, and "Works with" under
 * Products, are drawn now, built or not (owner, 30 Oct 2026: "just put it
 * there"); `unbuiltPages` lists the ones that answer 404 until built.
 */
export const footerColumns: readonly FooterColumn[] = [
  {
    heading: "Products",
    links: [
      { label: "Coral", href: routes.coral, product: true },
      /* Each product on each cloud, after its product (owner, 30 Oct 2026). */
      { label: "Coral for AKS", href: routes.coralForAks, named: "coral" },
      { label: "Coral for EKS", href: routes.coralForEks, named: "coral" },
      { label: "Amoeba", href: routes.amoeba, product: true },
      { label: "Amoeba for Azure", href: routes.amoebaForAzure, named: "amoeba" },
      { label: "Amoeba for AWS", href: routes.amoebaForAws, named: "amoeba" },
      { label: "Assessment", href: routes.assessment },
      /* How each product is priced, after Assessment (owner, 30 Oct 2026). */
      { label: "Pricing", href: routes.pricing },
      /* Where to find Zoorik, after Pricing. */
      { label: "Marketplaces", href: routes.marketplaces },
    ],
  },
  /* What Coral works with, under Products in its column (owner, 30 Oct 2026). */
  {
    heading: "Works with",
    stacked: true,
    links: [
      { label: "Cluster Autoscaler", href: routes.coralWorksWithClusterAutoscaler },
      { label: "Karpenter", href: routes.coralWorksWithKarpenter },
      { label: "AKS node auto provisioning", href: routes.coralWorksWithNodeAutoProvisioning },
      { label: "KEDA", href: routes.coralWorksWithKeda },
      { label: "Helm", href: routes.coralWorksWithHelm },
      { label: "Terraform", href: routes.coralWorksWithTerraform },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Learn", href: routes.learn },
      /* The research papers, then each product's Value Lab study (owner, 29 Oct 2026). The studies' hub, /value-lab,
         has no line of its own: /learn's More from Zoorik and the sitemap lead to it. */
      { label: "Research papers", href: routes.research },
      { label: "Coral Value Lab", href: routes.caseStudyCoralDevCluster, named: "coral" },
      { label: "Amoeba Value Lab", href: routes.caseStudyAmoebaLabVms, named: "amoeba" },
      /* Events, after the case studies as the mock draws it. */
      { label: "Events", href: routes.events },
      /* Zoorik News, after Events. */
      { label: "News", href: routes.news },
      /* The tools that reduce the bill, with the comparison pages, then the community, after News. */
      { label: "Cloud cost optimization tools", href: routes.cloudCostTools },
      /* The two calculators, after the tools hub that groups them (owner, 30 Oct 2026). */
      { label: "Node cost calculator", href: routes.nodeCostCalculator },
      { label: "Disk cost calculator", href: routes.diskCostCalculator },
      { label: "Community", href: routes.community },
      { label: "Docs", href: routes.docs },
      /* What is open source and how to contribute, right after Docs. */
      { label: "Open source", href: routes.openSource },
      /* Each product's guide, FAQ and troubleshooting. */
      { label: "Coral guide", href: routes.coralGuide, named: "coral" },
      { label: "Coral FAQ", href: routes.coralFaq, named: "coral" },
      { label: "Coral troubleshooting", href: routes.coralTroubleshooting, named: "coral" },
      /* Held with the pages while `amoebaDocs` is off: nothing may lead to them. */
      ...(amoebaDocs
        ? ([
            { label: "Amoeba guide", href: routes.amoebaGuide, named: "amoeba" },
            { label: "Amoeba FAQ", href: routes.amoebaFaq, named: "amoeba" },
            {
              label: "Amoeba troubleshooting",
              href: routes.amoebaTroubleshooting,
              named: "amoeba",
            },
          ] as const)
        : []),
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: routes.about },
      /* Careers, after About. */
      { label: "Careers", href: routes.careers },
      /* The company pages, after Careers. */
      { label: "Brand assets", href: routes.brandAssets },
      { label: "Referrals", href: routes.referrals },
      { label: "Partners", href: routes.partners },
      { label: "Design partners", href: routes.designPartners },
      { label: "Security", href: routes.security },
      /* The Trust center after Security, and Contact after Book a demo (owner, 30 Oct 2026). */
      { label: "Trust center", href: routes.trust },
      { label: "Book a demo", href: calendarUrl },
      { label: "Contact", href: routes.contact },
      { label: contactEmail, href: `mailto:${contactEmail}` },
      { label: "Login", href: routes.login },
      { label: "Privacy", href: routes.privacy },
      { label: "Terms", href: routes.terms },
    ],
  },
];

/** The bar under the columns, right end: the copyright line, the wordmark after it. */
export const footerCopyright = "© 2026";
