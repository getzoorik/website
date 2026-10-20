import { amoebaDocs, calendarUrl, contactEmail, routes } from "@/config/site";
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
}

export type FooterSocialPlatform = "linkedin" | "youtube" | "x" | "reddit" | "medium" | "github";

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
 * organisation's `sameAs` lists all six.
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
];

/**
 * The footer's social row: LinkedIn, X, Reddit, Medium, GitHub. The mock's row
 * holds Reddit and YouTube back until they carry something; Reddit is in its
 * place from the full list, and YouTube still waits. Each tile opens a new tab
 * and says so in its name.
 */
const ROW: readonly FooterSocialPlatform[] = ["linkedin", "x", "reddit", "medium", "github"];

export const footerSocialLinks: readonly FooterSocialLink[] = ROW.map((platform) =>
  socialProfiles.find((profile) => profile.platform === platform)!,
);

/** The line under the social row: the legal name and the city, muted (the
 *  bottom bar stays © and the wordmark). */
export const footerCompany = { rest: " Private Limited · Bangalore, India" } as const;

/** The lead-in to the two marketplace buttons under the badge. */
export const footerMarketplaces = "Available in";

/** The lead-in to the two registry buttons under the stores. */
export const footerInstall = "Install from";

/**
 * 🔴 THREE KINDS OF HREF IN THESE COLUMNS, AND THE MARKUP TREATS THEM APART.
 * The products, Assessment, the documents, Login and Privacy are pages of this
 * site, in the same tab; "Book a demo" is the calendar, which is off-site and
 * so opens in a new tab, says so, and shows the arrow; and the one address is a
 * `mailto:`, which stays in the tab.
 *
 * The same on every page. Assessment is the plain `/assessment`, never with a
 * `?p=`. Three columns after the brand: Products; Resources, the articles, the
 * case studies, the hub and each product's guide and FAQ; Company.
 *
 * Privacy and Terms are last in Company, in that order.
 */
export const footerColumns: readonly FooterColumn[] = [
  {
    heading: "Products",
    links: [
      { label: "Coral", href: routes.coral, product: true },
      { label: "Amoeba", href: routes.amoeba, product: true },
      { label: "Assessment", href: routes.assessment },
      /* Where to find Zoorik, after Assessment. */
      { label: "Marketplaces", href: routes.marketplaces },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Zoorik Learn", href: routes.learn },
      /* One line under Zoorik Learn: the case studies' hub, Value Lab, and its only place in the site's links. */
      { label: "Value Lab", href: routes.valueLab },
      /* Events, after the case studies as the mock draws it. */
      { label: "Events", href: routes.events },
      /* Zoorik News, after Events. */
      { label: "News", href: routes.news },
      /* The comparison pages and the community, after News. */
      { label: "Compare", href: routes.compare },
      { label: "Community", href: routes.community },
      { label: "Docs", href: routes.docs },
      /* What is open source and how to contribute, right after Docs. */
      { label: "Open source", href: routes.openSource },
      { label: "Coral guide", href: routes.coralGuide, named: "coral" },
      { label: "Coral FAQ", href: routes.coralFaq, named: "coral" },
      /* Held with the pages while `amoebaDocs` is off: nothing may lead to them. */
      ...(amoebaDocs
        ? ([
            { label: "Amoeba guide", href: routes.amoebaGuide, named: "amoeba" },
            { label: "Amoeba FAQ", href: routes.amoebaFaq, named: "amoeba" },
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
      { label: "Book a demo", href: calendarUrl },
      { label: contactEmail, href: `mailto:${contactEmail}` },
      { label: "Login", href: routes.login },
      { label: "Privacy", href: routes.privacy },
      { label: "Terms", href: routes.terms },
    ],
  },
];

/** The bar under the columns: the copyright line alone, the wordmark after it. */
export const footerCopyright = "© 2026";
