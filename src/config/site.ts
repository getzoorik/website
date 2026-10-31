import { products, type ProductId } from "@/content/products";

/**
 * Site-wide constants: the things that appear in more than one place, or that
 * an environment could reasonably need to override.
 *
 * Copy that belongs to ONE section does not live here — it lives in
 * `src/content/`, beside the section that renders it. This file is for identity
 * and navigation.
 */

/** What the home page is, as a search names it. */
const homePhrase = "Kubernetes and block storage cost optimization";

export const site = {
  name: "Zoorik",
  /** The company the structured data names, as the legal pages write it. */
  legalName: "Zoorik Private Limited",
  /** The canonical origin, no trailing slash. metadataBase, robots, the sitemap and JSON-LD all read it. It must equal `https://${CANONICAL_HOST}` in next.config.ts. */
  url: "https://zoorik.com",
  /** The home page's `<title>`; every other page goes through `titleTemplate`.
      The home page leads with the name; every other page leads with its own
      name and ends with the brand after a pipe: "About | Zoorik", "Kubernetes
      cost optimization | Zoorik". The home page's card title repeats it. */
  title: `Zoorik | ${homePhrase}`,
  titleTemplate: "%s | Zoorik",
  /** The home page's description, which its card and its structured data repeat.
      It opens with the name, for the same reason as the title. */
  homeDescription:
    "Zoorik reduces cloud cost, autonomously, without any downtime. Coral rebalances Kubernetes on AKS and EKS. Amoeba rightsizes Azure disks and Amazon EBS.",
  /** The layout's description, and the organisation's in the structured data.
      The home page has its own. */
  description:
    "Reduce cloud cost while your systems keep serving. Coral: Kubernetes cost optimization on AKS and EKS. Amoeba: block storage cost optimization on Azure and AWS.",
  /** Drives `<meta name="theme-color">`; the brand navy, matching the mock. */
  themeColor: "#070F52",
} as const;

/** A page's full title, as its `<title>`, its share card and its structured data print it: "<name> | Zoorik". */
export const pageTitle = (title: string): string => site.titleTemplate.replace("%s", title);

/**
 * Where each product's console lives.
 *
 * Only Coral has one today: its console signs in at `dev.zoorik.com/coral`.
 * Amoeba's console is not served yet, so its `/login` card is "coming" and has
 * no URL to configure; it gets an entry here, and a variable of its own, when it
 * goes live.
 *
 * 🔴 READ AT BUILD TIME, NOT AT RUNTIME. `NEXT_PUBLIC_*` is INLINED into the
 * bundle by the compiler, so this file cannot be re-pointed by setting a
 * variable on the running Worker — the value that ships is the one the build
 * saw. `.github/workflows/deploy.yml` sets it there, and resolves it to a
 * non-empty string so an unset repository variable cannot inline `""`.
 *
 * 🔴 AND IT IS PARSED, NOT TRUSTED. A malformed value would otherwise ship as a
 * dead Continue on the one page whose entire job is to be a working link.
 * Parsing turns a bad value into a red build instead of a broken page.
 */
const DEFAULT_CORAL_LOGIN_URL = "https://dev.zoorik.com/coral/login";

function consoleUrl(variable: string, value: string | undefined, fallback: string) {
  /* `??` would not catch it: an unset GitHub variable inlines as "", which is
     defined. */
  const raw = value?.trim() || fallback;
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error(`${variable} is not an absolute URL: ${JSON.stringify(raw)}`);
  }
  return { href: parsed.toString() } as const;
}

export const consoles = {
  coral: consoleUrl(
    "NEXT_PUBLIC_LOGIN_URL",
    process.env.NEXT_PUBLIC_LOGIN_URL,
    DEFAULT_CORAL_LOGIN_URL,
  ),
} as const;

/**
 * Every page of the site besides the home page, by name.
 *
 * Each address is written once, here: the header, the drawer, the footer, the
 * sitemap, the canonicals and the pages' own links all read it, so a page that
 * moves moves everywhere at once.
 */
/**
 * The home page's one address, with its trailing slash: the canonical, og:url, the sitemap
 * and the JSON-LD all print this string. Next's metadata always prints the root without the
 * slash, so the home page draws its canonical and og:url itself.
 */
export const homeUrl = `${site.url}/` as const;

export const routes = {
  /* One page per product, Coral first as everywhere on the site. Keyed by
     `ProductId`, which the structured data relies on. */
  coral: "/coral",
  amoeba: "/amoeba",
  /* 🔴 NEVER UNDER `/assess/`. Cloudflare redirects every `/assess/<name>` to
     `<name>.py` in the public assessment repo, which is how the one-line
     commands the page prints are served. A page there could never be reached. */
  assessment: "/assessment",
  /* The documents: the hub, then each product's guide and FAQ, each at the
     site's root, nothing nested (owner, 29 Oct 2026); their old addresses under
     each product redirect here. The Amoeba two are built but held while
     `amoebaDocs` is off. */
  docs: "/docs",
  coralGuide: "/coral-guide",
  coralFaq: "/coral-faq",
  amoebaGuide: "/amoeba-guide",
  amoebaFaq: "/amoeba-faq",
  login: "/login",
  /* The two legal pages. Deep-linked by section from the consoles, the
     Marketplace listing and replies to rights requests, and /terms cites
     /privacy by section, so their section ids are addresses too. */
  privacy: "/privacy",
  terms: "/terms",
  /* The company pages and Learn: about, security and the articles' hub. Each
     article lives under it at /learn/<slug> (`learnPath`), the two below aside. */
  about: "/about",
  /* Careers, linked from the footer's Company column. */
  careers: "/careers",
  security: "/security",
  learn: "/learn",
  /* Two Learn articles at the site's root, at the address of their search (D230, owner, 1 Nov 2026): the cloud cost
     pillar and the Kubernetes one. Each article's file names its own (`route`); these are the same two, for the pages
     that cannot read the Learn index. Their old /learn/<slug> addresses redirect here. */
  cloudCostOptimization: "/cloud-cost-optimization",
  kubernetesCostOptimization: "/kubernetes-cost-optimization",
  /* The cloud cost glossary, under Learn: one page per term at /learn/glossary/<slug> (`glossaryPath`). Linked from
     /learn's More from Zoorik and from every term's trail. */
  learnGlossary: "/learn/glossary",
  /* Cloud cost optimization tools: the tools that reduce the bill, then Coral and Amoeba compared. Its old address,
     /compare, redirects here. In the footer's Resources column, after News. */
  cloudCostTools: "/cloud-cost-optimization-library",
  /* The comparison pages, under Cloud cost optimization tools: each product's alternatives, and the versus pages
     (`comparePath`; their slugs are data, `versusPages` in @/content/learn-compare; one per product is kept live).
     Their old /compare and /learn addresses redirect. */
  compareCoralAlternatives: "/cloud-cost-optimization-library/coral-alternatives",
  compareAmoebaAlternatives: "/cloud-cost-optimization-library/amoeba-alternatives",
  /* Value Lab by Zoorik: the case studies' hub, with what the studies saved so far and the featured study. The old
     /case-studies address redirects here. Not in the footer, which links each study: /learn's More from Zoorik and the
     sitemap lead here. */
  valueLab: "/value-lab",
  /* Each study at the site's root, nothing nested (owner, 29 Oct 2026); the hub lists both, and the footer's
     Resources column links each, after Research papers. Their old addresses under /value-lab, and the Coral study's
     under /case-studies, redirect here. */
  caseStudyCoralDevCluster: "/coral-value-lab",
  /* Amoeba on our own Azure lab VMs: the second study, beside the first on the hub. */
  caseStudyAmoebaLabVms: "/amoeba-value-lab",
  /* Events: real conferences and community days, from the radar's checked list.
     In the footer's Resources column, after Amoeba Value Lab. */
  events: "/events",
  /* Zoorik News, at its own address rather than under /learn: our announcements, then Zoorik Radar, the week's
     changes. In the footer's Resources column, after Events. */
  news: "/news",
  /* Zoorik Community: r/zoorik, where Zoorik posts, the next events and the wider community. In the
     footer's Resources column, after EBS and Azure disk pricing. */
  community: "/community",
  /* Where to find Zoorik: the marketplaces, reviews, installs and profiles. In the footer's Products
     column, after Pricing. */
  marketplaces: "/marketplaces",
  /* Three company pages, in the footer's Company column after Careers: the brand kit, and the
     partner and referral programs, both "coming soon" with no terms. */
  brandAssets: "/brand-assets",
  partners: "/partners",
  referrals: "/referrals",
  /* The design partner program, open now; in the footer's Company column after Partners. */
  designPartners: "/design-partners",
  /* Open source and the install channels: what is open and how to contribute,
     and three guides under /docs. Linked from the Docs menu, the footer, the hub and /coral's Install your way. */
  openSource: "/open-source",
  docsInstallHelm: "/docs/install-coral-with-helm",
  docsInstallTerraform: "/docs/install-coral-with-terraform",
  docsContributing: "/docs/contributing",
  /* The two troubleshooting pages, one per product, at the site's root and in the guides' frame, each listed on the
     hub at the end of its product's group and in the footer's Resources column after its product's FAQ. The four
     pages they replace, under /docs, redirect to them. */
  coralTroubleshooting: "/coral-troubleshooting",
  amoebaTroubleshooting: "/amoeba-troubleshooting",
  /* Research papers on cloud cost optimization, by subject. At the site's root, in no menu; in the footer's Resources
     column after Learn. Its first address redirects here. */
  research: "/cloud-cost-optimization-research-papers",
  /* Five pages at the site's root (owner, 30 Oct 2026), in no menu; in the footer (owner, 30 Oct 2026): Pricing in
     Products after Assessment, the two calculators in Resources after Cloud cost optimization tools, the Trust center
     in Company after Security and Contact after Book a demo. The Trust center (Coral's security overview, the DPA and
     the sub-processors), also linked from /security's Report a security issue row; Contact and Pricing, which link
     each other; and the two calculators, also linked from Cloud cost optimization tools' Free calculators. */
  trust: "/trust",
  contact: "/contact",
  pricing: "/pricing",
  /* The two calculators at the address of their search (D230, owner, 1 Nov 2026); their 30 Oct addresses,
     /node-cost-calculator and /disk-cost-calculator, redirect here. */
  eksAndAksPricingCalculator: "/eks-and-aks-pricing-calculator",
  ebsAndAzureDiskPricing: "/ebs-and-azure-disk-pricing",
  /* Ten pages at the site's root (addresses: owner, 30 Oct 2026; built: owner, 31 Oct 2026), in no menu. Each product
     on each cloud, in the footer's Products column after its product; and what Coral works with, the footer's "Works
     with" list under Products, also linked from the Coral cloud pages' Works with tiles. The four per-cloud pages moved
     to the address of their search (D230, owner, 1 Nov 2026); their first addresses (/coral-for-aks, /coral-for-eks,
     /amoeba-for-azure, /amoeba-for-aws) redirect here. */
  aksCostOptimization: "/aks-cost-optimization",
  eksCostOptimization: "/eks-cost-optimization",
  azureManagedDiskCostOptimization: "/azure-managed-disk-cost-optimization",
  ebsCostOptimization: "/ebs-cost-optimization",
  coralWorksWithClusterAutoscaler: "/coral-works-with-cluster-autoscaler",
  coralWorksWithKarpenter: "/coral-works-with-karpenter",
  coralWorksWithNodeAutoProvisioning: "/coral-works-with-aks-node-auto-provisioning",
  coralWorksWithKeda: "/coral-works-with-keda",
  coralWorksWithHelm: "/coral-works-with-helm",
  coralWorksWithTerraform: "/coral-works-with-terraform",
} as const;

/** Where the comparison pages live: under Cloud cost optimization tools. /compare and its old pages redirect there. */
export const comparePath = "/cloud-cost-optimization-library";

/**
 * A Learn article's address under /learn, by its slug: every article's but the two at the site's root
 * (`rootArticlePaths`). An article's own address is `articleRoute`, from the Learn index
 * (`@/content/learn/published`), which this file never reads: the header and the hash rule below know an article by
 * its address alone.
 */
export const learnPath = (slug: string): `/learn/${string}` => `/learn/${slug}`;

/** The Learn articles served at the site's root rather than under /learn (D230): each names it as its `route`. */
export const rootArticlePaths: readonly string[] = [
  routes.cloudCostOptimization,
  routes.kubernetesCostOptimization,
];

/** Whether a pathname is a Learn article's: one segment under /learn, the glossary's hub aside, or one at the root. */
export const isLearnArticlePath = (pathname: string): boolean =>
  (/^\/learn\/[^/]+$/.test(pathname) && pathname !== routes.learnGlossary) ||
  rootArticlePaths.includes(pathname);

/** A glossary term's address, by its slug. The terms are listed by the glossary index (`@/content/learn/glossary`). */
export const glossaryPath = (slug: string): `/learn/glossary/${string}` =>
  `/learn/glossary/${slug}`;

/** Whether a pathname is a glossary term's: one segment under /learn/glossary. */
export const isGlossaryTermPath = (pathname: string): boolean =>
  /^\/learn\/glossary\/[^/]+$/.test(pathname);

/**
 * Whether the Amoeba guide and FAQ are published.
 *
 * ON: published, with their "To come" placeholders showing where a fact is
 * still owed. When this is false nothing on the site may lead to them, and
 * every surface that could reads this one value: their rows are left out of
 * the guide and FAQ rows (here), so the [Coral | Amoeba] switch on the Coral
 * guide and FAQ shows Coral alone (it draws those rows), the hub's Amoeba
 * group shows only what is released, and the two
 * routes answer 404 and stay out of the sitemap.
 * Publishing them is this one line.
 *
 * Typed `boolean` rather than inferred as `false`, so the code that reads it is
 * checked for both values.
 */
export const amoebaDocs: boolean = true;

/**
 * Whether the Amoeba one-pager is a public download.
 *
 * ON: released with the Amoeba guide and FAQ. When this is false the PDF
 * is not in `public/docs/`, and neither the hub nor the `/amoeba` Read more row
 * offers it. Publishing it is this line, the file copied to
 * `public/docs/amoeba-one-pager.pdf` and its canonical rule in
 * `public/_headers`; the documents' tests fail until all three are done.
 *
 * With this and `amoebaDocs` both off, Amoeba has nothing on the Docs hub, so
 * the hub draws no Amoeba group and the Docs menu and drawer lead to none.
 */
export const amoebaOnePager: boolean = true;

/**
 * Pages whose in-page links KEEP the hash: the guides, the FAQs and the two
 * legal pages, the mocks that carry `data-keep-hash`. On a long document a
 * reader shares a link to the section they are reading, so a click there writes
 * `#id` and a deep link is left in place. Everywhere else the address bar stays
 * clean (`InPageLinks`).
 *
 * /terms is built like /privacy and keeps its hash too, and /terms cites
 * /privacy by section the same way.
 */
export const hashKeepingRoutes: readonly string[] = [
  /* /about keeps its hash too, and so does every Learn article (`keepsHash`). */
  routes.about,
  /* /careers is built on /about's frame and carries `data-keep-hash` too. */
  routes.careers,
  /* The case studies keep their hash as the articles do; the hub, like /learn, does not. */
  routes.caseStudyCoralDevCluster,
  routes.caseStudyAmoebaLabVms,
  /* The three install and contributing guides and the two troubleshooting pages are built in the article frame and
     keep theirs too. */
  routes.docsInstallHelm,
  routes.docsInstallTerraform,
  routes.docsContributing,
  routes.coralTroubleshooting,
  routes.amoebaTroubleshooting,
  /* The six works-with pages are built in the article frame too, and their mocks carry `data-keep-hash`. */
  routes.coralWorksWithClusterAutoscaler,
  routes.coralWorksWithKarpenter,
  routes.coralWorksWithNodeAutoProvisioning,
  routes.coralWorksWithKeda,
  routes.coralWorksWithHelm,
  routes.coralWorksWithTerraform,
  routes.coralGuide,
  routes.coralFaq,
  routes.amoebaGuide,
  routes.amoebaFaq,
  routes.privacy,
  routes.terms,
  /* /security's mock carries `data-keep-hash`: a link names a row there too. */
  routes.security,
];

/** Whether a page keeps its hash: one of `hashKeepingRoutes`, or any Learn article or glossary term. */
export function keepsHash(pathname: string): boolean {
  return (
    hashKeepingRoutes.includes(pathname) ||
    isLearnArticlePath(pathname) ||
    isGlossaryTermPath(pathname)
  );
}

/** Where every "Book a demo" goes: the bar, the closing row, the footer and /login. */
export const calendarUrl = "https://cal.com/zoorik/talk";

/** The only address the site prints. The hello@, sales@ and security@ links are gone. */
export const contactEmail = "founders@zoorik.com";

/**
 * Section anchors from before the products were named, and the section each one
 * now lands on.
 *
 * Decks, bookmarks and old e-mails carry `zoorik.com/#elastic` and
 * `zoorik.com/#kubernetes`. Each still names an element — an empty one, just
 * above the section that replaced it, so the browser's own fragment scroll
 * works with scripting off. `InPageLinks` reads this map on top of that, so the
 * reader's focus lands on the real section rather than on a hidden marker. A
 * Map, not an object literal, so a hash such as `#constructor` cannot resolve to
 * something on the prototype.
 */
export const anchorAliases: ReadonlyMap<string, string> = new Map([
  ["elastic", "amoeba"],
  ["kubernetes", "coral"],
]);

/** The one call to action in the bar, kept apart from the links because it is
 *  a button rather than a nav item, and the one entry that leaves the site. */
export const primaryCta = { label: "Book a demo", href: calendarUrl } as const;

/* ═══════════════════════════════════════════════════════════════════════════
   THE HEADER

   The bar, left to right: Coral · Amoeba · Assessment · Docs ▾ · Login · Book
   a demo (owner, 23 Oct 2026: "Docs is the only menu"). Assessment is a plain
   link to the assessment, whose page has its own [Coral | Amoeba] switch.
   Docs is the one menu: a word and a chevron, the word a link to the hub's
   Coral group and the chevron opening the two product rows, a foot row to the
   whole hub, then the Learn and Open source rows. Product guide and FAQ left
   the header: the Docs menu leads to each product's guide and FAQ through the
   hub. The drawer (1000px and down) is the same list: the two product links,
   Assessment, the Docs group with its products as small chips ("All", "Zoorik
   Learn" and "Open source" after them), then Login. Book a demo stays in the
   bar.

   There is no "How it works" and no "Contact" any more, in the bar, the drawer
   or the footer.
   ═══════════════════════════════════════════════════════════════════════════ */

/** What a page can be in the header: one of the links, the Docs menu, or Login. */
export type NavCurrent = "coral" | "amoeba" | "assessment" | "docs" | "login";

/** The rows by kind, by the key their ids are made of (`nvm-docs`): Docs, the
 *  header's one menu, and the guide and FAQ rows the documents' switch reads. */
export type NavMenuKey = "guide" | "faq" | "docs";

export interface NavLink {
  readonly key: NavCurrent;
  readonly label: string;
  readonly href: string;
}

/** A product's own link: it carries the product's mark in front of its name. */
export interface NavProductLink extends NavLink {
  readonly product: ProductId;
}

export interface NavMenuRow {
  readonly product: ProductId;
  readonly href: string;
  /** The line under the product's name. Verbatim: a paraphrase is a different claim. */
  readonly line: string;
}

export interface NavMenu {
  readonly key: NavMenuKey;
  readonly label: string;
  /**
   * Whether the header draws it, as a menu. True for Docs alone: its word goes
   * to the first row, Coral's (`menuLabelHref`), and the chevron beside it
   * opens the menu. Absent for the guide and the FAQ, which are not in the
   * header; their rows feed the [Coral | Amoeba] switch on each guide and FAQ.
   */
  readonly dropdown?: boolean;
  readonly rows: readonly NavMenuRow[];
  /** A foot row to the whole of what the menu lists: "All docs" in the menu,
   *  "All" as a drawer chip. */
  readonly all?: { readonly label: string; readonly chip: string; readonly href: string };
  /** The Learn row, after the foot row under a hairline of its own: the book in
   *  the marks' slot, the name and one line. In the drawer, a chip of its name. */
  readonly learn?: { readonly label: string; readonly href: string; readonly line: string };
  /** The Open source row, right under Learn with no hairline of its own: the code brackets in the marks'
   *  slot, the name and one line. In the drawer, a chip after Learn. */
  readonly open?: { readonly label: string; readonly href: string; readonly line: string };
}

/** The two product links ahead of the menus, in the bar and at the top of the
 *  drawer. */
export const navLinks: readonly NavProductLink[] = [
  { key: "coral", label: "Coral", href: routes.coral, product: "coral" },
  { key: "amoeba", label: "Amoeba", href: routes.amoeba, product: "amoeba" },
];

/** The plain link after the product links, in the bar and the drawer: the
 *  assessment itself, with no product in its address. Its page opens on Coral
 *  and switches to Amoeba on its own (`productFromQuery` in `@/lib/product-choice`). */
export const navAssessment: NavLink = {
  key: "assessment",
  label: "Assessment",
  href: routes.assessment,
};

/** The link after the menu: last in the drawer, and in the bar down to 1001px. */
export const navLogin: NavLink = { key: "login", label: "Login", href: routes.login };

/* The Docs rows' line. The guide and FAQ rows carry each product's own line,
   the same two as the home hero's tiles and the Docs hub's groups, from
   `products.ts`. */
const DOCS_LINE = "Guide, FAQ and one-pager";

/* Coral first in every row set, as everywhere on the site: the menu's word
   lands on its first row (`menuLabelHref`). */
export const navMenus: readonly NavMenu[] = [
  {
    key: "guide",
    label: "Product guide",
    rows: [
      { product: "coral", href: routes.coralGuide, line: products.coral.descriptor },
      ...(amoebaDocs
        ? [
            {
              product: "amoeba",
              href: routes.amoebaGuide,
              line: products.amoeba.descriptor,
            } as const,
          ]
        : []),
    ],
  },
  {
    key: "faq",
    label: "FAQ",
    rows: [
      { product: "coral", href: routes.coralFaq, line: products.coral.descriptor },
      ...(amoebaDocs
        ? [{ product: "amoeba", href: routes.amoebaFaq, line: products.amoeba.descriptor } as const]
        : []),
    ],
  },
  {
    key: "docs",
    label: "Docs",
    dropdown: true,
    rows: [
      { product: "coral", href: `${routes.docs}#coral`, line: DOCS_LINE },
      /* The hub has an Amoeba group only while Amoeba has a document on it, and
         a row to `#amoeba` with no group there would land nowhere. With part of
         Amoeba's set released, "Guide, FAQ and one-pager" names a document that
         is not there: that line is still to be written. */
      ...(amoebaDocs || amoebaOnePager
        ? [{ product: "amoeba", href: `${routes.docs}#amoeba`, line: DOCS_LINE } as const]
        : []),
    ],
    all: { label: "All docs", chip: "All", href: routes.docs },
    learn: {
      label: "Zoorik Learn",
      href: routes.learn,
      line: "Articles on Kubernetes and block storage cost",
    },
    open: {
      label: "Open source",
      href: routes.openSource,
      line: "What you can read, run and contribute to",
    },
  },
];

/**
 * Where a page sits in the header: the link or menu it marks as current, and
 * the row inside that menu that is the page itself.
 */
export interface NavState {
  readonly current?: NavCurrent;
  /** The page's own row: a product row, the Learn row (`"learn"`), or the
   *  menu's foot row when `product` is absent. */
  readonly here?: { readonly menu: NavMenuKey; readonly product?: ProductId | "learn" | "open" };
}

/**
 * Every page's place in the header. Anything not listed — the home page,
 * /about, /security, /privacy, /terms — marks nothing. /assessment marks its
 * link, whichever product it is on: the link names none. The documents mark
 * Docs: the hub, the Learn hub and /open-source mark their own row in its menu
 * too; the guides and FAQs, the install guides and the Learn articles, which no
 * row of the menu is, mark Docs alone.
 *
 * A table keyed by pathname, not a lookup the component works out: the
 * pathname is known at build, so every page prerenders with its own state, and
 * a page added later is one row here. A Learn article needs no row: any
 * /learn/<slug>, and the two at the root (`rootArticlePaths`), mark Docs.
 */
const NAV_STATES: ReadonlyMap<string, NavState> = new Map<string, NavState>([
  [routes.coral, { current: "coral" }],
  [routes.amoeba, { current: "amoeba" }],
  [routes.assessment, { current: "assessment" }],
  /* Product guide and FAQ left the header: the Docs menu leads to them, through the hub. */
  [routes.coralGuide, { current: "docs" }],
  [routes.amoebaGuide, { current: "docs" }],
  [routes.coralFaq, { current: "docs" }],
  [routes.amoebaFaq, { current: "docs" }],
  [routes.docs, { current: "docs", here: { menu: "docs" } }],
  [routes.learn, { current: "docs", here: { menu: "docs", product: "learn" } }],
  /* The glossary's hub marks Docs alone, as an article does: the menu has no row of its own for it. */
  [routes.learnGlossary, { current: "docs" }],
  [routes.login, { current: "login" }],
  /* /open-source marks Docs and its own row in the menu; the three guides mark Docs only. */
  [routes.openSource, { current: "docs", here: { menu: "docs", product: "open" } }],
  [routes.docsInstallHelm, { current: "docs" }],
  [routes.docsInstallTerraform, { current: "docs" }],
  [routes.docsContributing, { current: "docs" }],
  /* The two troubleshooting pages mark Docs only, as the guides do. */
  [routes.coralTroubleshooting, { current: "docs" }],
  [routes.amoebaTroubleshooting, { current: "docs" }],
]);

/** A Learn article, wherever it lives, or a glossary term marks the Docs menu alone; /about marks nothing. */
const LEARN_ARTICLE_STATE: NavState = { current: "docs" };

/** A page's place in the header, from its pathname alone, so it is known when the page is prerendered. */
export function navState(pathname: string): NavState {
  /* `/coral/` and `/coral` are one page. */
  const path = pathname.replace(/(.)\/$/, "$1");
  return (
    NAV_STATES.get(path) ??
    (isLearnArticlePath(path) || isGlossaryTermPath(path) ? LEARN_ARTICLE_STATE : {})
  );
}

/**
 * Where the menu's word goes: Docs to `/docs#coral`, the hub's Coral group, on
 * every page of the site, Amoeba's own included; the menu lists Amoeba's.
 *
 * The word is the menu's first row, never a route of its own, so it can never
 * lead somewhere the menu does not: Coral is first in every row set and no
 * switch holds a Coral row back.
 */
export function menuLabelHref(menu: NavMenu): string {
  return menu.rows[0].href;
}
