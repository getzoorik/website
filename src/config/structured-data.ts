import {
  artifactHubOrg,
  blueskyProfile,
  crunchbaseProfile,
  devToOrg,
  f6sCompany,
  g2Coral,
  g2Seller,
  gitlabGroup,
  gravatarProfile,
  hackerNewsProfile,
  instagramProfile,
  mastodonProfile,
  npmOrg,
  quayOrg,
  saasBrowserProfile,
  substackPublication,
  tracxnCompany,
  tracxnLegalEntity,
  wellfoundCompany,
  wikidataEntity,
} from "@/config/entity";
import { openSourceLinks } from "@/config/open-source";
import { liveListings, storeProfiles } from "@/config/marketplaces";
import {
  amoebaDocs,
  calendarUrl,
  contactEmail,
  homeUrl,
  pageTitle,
  routes,
  site,
} from "@/config/site";
import { cardFor } from "@/config/social";
import { about, cin, registeredOffice } from "@/content/about";
import { amoebaFaqPage } from "@/content/amoeba-faq";
import { amoebaGuide } from "@/content/amoeba-guide";
import { amoebaPageContent } from "@/content/amoeba-page";
import { assessmentCopy } from "@/content/assessment";
import { brandAssetsPage } from "@/content/brand-assets";
import { careers } from "@/content/careers";
import { communityPage } from "@/content/community";
import { designPartnersPage } from "@/content/design-partners";
import { amoebaStudy, caseStudiesHub, caseStudy } from "@/content/case-studies";
import { coralFaqPage } from "@/content/coral-faq";
import { coralGuide } from "@/content/coral-guide";
import { coralPageContent } from "@/content/coral-page";
import { docsHub } from "@/content/documents";
import { elasticContent } from "@/content/elastic";
import { eventsPage } from "@/content/events";
import { newsPage } from "@/content/news";
import { footerColumns, socialProfiles, type FooterSocialPlatform } from "@/content/footer";
import { learnPage } from "@/content/learn";
import {
  alternativesPages,
  cloudCostToolsPage,
  versusPages,
  versusRoute,
} from "@/content/learn-compare";
import { marketplacesPage } from "@/content/marketplaces";
import { memberships } from "@/content/memberships";
import { openSourceGuides, openSourcePage, type OpenSourceGuide } from "@/content/open-source";
import { partnersPage } from "@/content/partners";
import type { Article } from "@/content/learn/article";
import { glossaryPage, glossaryTerms, termName, termRoute } from "@/content/learn/glossary";
import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { articleAuthor, articleCard, articleRoute, learnArticles } from "@/content/learn/published";
import { privacy } from "@/content/privacy";
import { referralsPage } from "@/content/referrals";
import { researchPage } from "@/content/research";
import type { ProductPageContent } from "@/content/product-page";
import { platformLabel, productOrder, products, type ProductId } from "@/content/products";
import { securityPage } from "@/content/security";
import { termsCopy } from "@/content/terms";
import { troubleshootingGuides } from "@/content/troubleshooting";
import { trustPage } from "@/content/trust";
import { isoDay } from "@/lib/content-date";

/**
 * The structured data search engines read: one JSON-LD graph per indexed page.
 * Every graph has the organisation, the site, the page itself and, below the
 * home page, its breadcrumb trail; the home and product pages add the apps, and
 * the articles and the study a TechArticle; a glossary term its DefinedTerm, and
 * the glossary's hub its DefinedTermSet.
 * Built only from constants the pages already print.
 *
 * 🔴 NO offers, price, aggregateRating OR review: pricing was removed on purpose
 * and there are no ratings, so the apps are not eligible for the software-app rich
 * result. That is expected; never add a made-up price to change it. No FAQPage,
 * HowTo or SearchAction either.
 *
 * Only the home and product pages carry an app in full. Elsewhere a page points
 * at its product by `@id` alone, so a test of that page finds no app it would
 * fault for having no price.
 */

const organizationId = `${site.url}/#organization`;
const websiteId = `${site.url}/#website`;

const ref = (id: string) => ({ "@id": id }) as const;

/** A path's address: the home page's with its slash (`homeUrl`), every other one as the sitemap prints it. */
const pageUrl = (path: string): string => (path === "/" ? homeUrl : `${site.url}${path}`);

const appId = (product: ProductId): string => `${pageUrl(routes[product])}#software`;

/**
 * The logo: the brand 2.0 mark, navy on transparent (the brand kit's
 * `zoorik-mark-navy-transparent@2x.png`), byte for byte. A new picture gets a new
 * file name, as the share cards do, so a cached copy of the old mark is never served as this one.
 */
export const brandLogo = {
  path: "/brand/zoorik-mark-navy-2048.png",
  width: 2048,
  height: 2048,
} as const;

/** The operating systems among a product's platforms; AKS and EKS are not ones. */
const amoebaOperatingSystems = elasticContent.runsOn.platforms
  .filter((platform) => platform === "windows" || platform === "linux")
  .map((platform) => platformLabel[platform])
  .join(", ");

const pageContent: Readonly<Record<ProductId, ProductPageContent>> = {
  coral: coralPageContent,
  amoeba: amoebaPageContent,
};

/** Each product's guide, the app's help; Amoeba's only while `amoebaDocs` publishes it. */
const guides: Readonly<Record<ProductId, string | null>> = {
  coral: routes.coralGuide,
  amoeba: amoebaDocs ? routes.amoebaGuide : null,
};

/** The footer's profiles `sameAs` lists in their own places further down, among the other profiles: each once. */
const LATER_PROFILES: readonly FooterSocialPlatform[] = ["bluesky", "substack"];

/**
 * Zoorik, with the facts /about prints (`about.ts`): the registered office, the
 * CIN, the address and the calendar to reach it by, and the logo. Its
 * description is the site's, and `sameAs` the footer's social profiles but
 * Bluesky and Substack (its row shows five of these six), the AWS Marketplace
 * seller page, the Crunchbase profile and the Wikidata entry (`entity.ts`),
 * which names zoorik.com as the official website, so a search engine can tell
 * this Zoorik from the others; then the two places Zoorik publishes under its
 * own name: the PyPI user that owns the `zoorik` package, and the Terraform
 * Registry namespace; then Bluesky (@zoorik.com), GitLab, Substack, Instagram,
 * Artifact Hub, npm, Quay and Gravatar, Bluesky and Substack keeping their
 * places here though the footer's profiles and its row hold them too
 * (`LATER_PROFILES`); then Hacker News,
 * dev.to, Mastodon and Wellfound; then the directories: F6S, Tracxn's company
 * and legal-entity pages, G2's seller page and SaaSBrowser. It is `memberOf`
 * each program /about lists under Programs (`memberships.ts`), as a
 * ProgramMembership with the program's page and the company that runs it.
 * No founder and no founding date: /about names neither.
 */
export const organization = {
  "@type": "Organization",
  "@id": organizationId,
  name: site.name,
  legalName: site.legalName,
  url: homeUrl,
  logo: {
    "@type": "ImageObject",
    url: `${site.url}${brandLogo.path}`,
    width: brandLogo.width,
    height: brandLogo.height,
  },
  email: contactEmail,
  description: site.description,
  address: {
    "@type": "PostalAddress",
    streetAddress: registeredOffice.street,
    addressLocality: registeredOffice.locality,
    postalCode: registeredOffice.postalCode,
    addressRegion: registeredOffice.region,
    addressCountry: registeredOffice.country.code,
  },
  identifier: { "@type": "PropertyValue", propertyID: "CIN", value: cin },
  contactPoint: { "@type": "ContactPoint", email: contactEmail, url: calendarUrl },
  knowsAbout: ["Cloud cost optimization", ...productOrder.map((id) => products[id].category)],
  sameAs: [
    ...socialProfiles
      .filter((link) => !LATER_PROFILES.includes(link.platform))
      .map((link) => link.href),
    ...storeProfiles,
    crunchbaseProfile,
    wikidataEntity,
    openSourceLinks.pypiUser,
    openSourceLinks.terraformRegistry,
    blueskyProfile,
    gitlabGroup,
    substackPublication,
    instagramProfile,
    artifactHubOrg,
    npmOrg,
    quayOrg,
    gravatarProfile,
    hackerNewsProfile,
    devToOrg,
    mastodonProfile,
    wellfoundCompany,
    f6sCompany,
    tracxnCompany,
    tracxnLegalEntity,
    g2Seller,
    saasBrowserProfile,
  ],
  memberOf: memberships.map((membership) => ({
    "@type": "ProgramMembership",
    programName: membership.name,
    url: membership.url,
    hostingOrganization: {
      "@type": "Organization",
      name: membership.host.name,
      url: membership.host.url,
      sameAs: membership.host.wikidata,
    },
  })),
} as const;

const website = {
  "@type": "WebSite",
  "@id": websiteId,
  name: site.name,
  url: homeUrl,
  publisher: ref(organizationId),
} as const;

/**
 * One product as an app: its page's app description, its offerings as the
 * feature list, its guide as its help, and `sameAs` only for the pages that
 * exist about it: its marketplace listings, then Coral's G2 page (Amoeba has
 * no G2 page yet).
 */
export function softwareApplication(product: ProductId) {
  const content = pageContent[product];
  const listings = [...liveListings(product), ...(product === "coral" ? [g2Coral] : [])];
  const guide = guides[product];
  return {
    "@type": "SoftwareApplication",
    "@id": appId(product),
    name: products[product].name,
    alternateName: `${site.name} ${products[product].name}`,
    url: pageUrl(routes[product]),
    description: content.meta.appDescription,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: products[product].category,
    ...(product === "amoeba" ? { operatingSystem: amoebaOperatingSystems } : {}),
    featureList: content.offerings.map((offering) => offering.label),
    ...(guide
      ? {
          softwareHelp: {
            "@type": "WebPage",
            "@id": `${pageUrl(guide)}#webpage`,
            url: pageUrl(guide),
          },
        }
      : {}),
    publisher: ref(organizationId),
    ...(listings.length > 0 ? { sameAs: listings } : {}),
  } as const;
}

/** A step of a breadcrumb trail. */
interface Crumb {
  readonly name: string;
  readonly path: string;
}

/** A page and its place in the site, from the same constants its metadata reads. */
interface PageEntry {
  readonly kind: "WebPage" | "CollectionPage" | "AboutPage";
  /** The page's `<title>`, as the page prints it. */
  readonly name: string;
  readonly description: string;
  /** The steps after the home page, this page last. The home page has none. */
  readonly trail: readonly Crumb[];
  /** What the page is about: its product, or the organisation (/about, /careers). */
  readonly about?: ProductId | "organization";
  /** The apps the page carries in full: the home page's both, a product page's own. */
  readonly apps?: readonly ProductId[];
  readonly article?: {
    readonly headline: string;
    /**
     * The person it is published under, where it is not Zoorik alone: their LinkedIn profile where they have one,
     * and Zoorik as their employer unless they are a guest.
     */
    readonly author?: {
      readonly name: string;
      readonly jobTitle: string;
      readonly url?: string;
      readonly worksForZoorik: boolean;
    };
    /** The day it was published, as an ISO day. */
    readonly published?: string;
    /** The day it last changed (a Learn article's `updated`), or the published one where that is all it has. */
    readonly modified: string;
    /** The page's share card. */
    readonly image: { readonly url: string };
  };
  /** A glossary term's page: the term, by its name, and its definition's first sentence. */
  readonly term?: { readonly name: string; readonly description: string };
  /** The glossary's hub: the set every term is in. */
  readonly termSet?: true;
}

/** A page's printed `<title>`: through the layout's template. */
const titled = pageTitle;

/** A step named as the footer names its page ("Docs", "Coral guide", "Privacy"). */
function step(path: string): Crumb {
  const link = footerColumns.flatMap((column) => column.links).find((l) => l.href === path);
  if (!link) throw new Error(`structured data: no footer link names ${path}`);
  return { name: link.label, path };
}

function productEntry(content: ProductPageContent): PageEntry {
  return {
    kind: "WebPage",
    name: titled(content.meta.title),
    description: content.meta.description,
    trail: [step(routes[content.product])],
    about: content.product,
    apps: [content.product],
  };
}

function documentEntry(
  path: string,
  meta: { readonly title: string; readonly description: string },
  trail: readonly Crumb[],
  extra: Pick<PageEntry, "about"> & { readonly kind?: PageEntry["kind"] } = {},
): PageEntry {
  return {
    kind: extra.kind ?? "WebPage",
    name: titled(meta.title),
    description: meta.description,
    trail: [...trail, step(path)],
    ...(extra.about ? { about: extra.about } : {}),
  };
}

/**
 * A guide in the docs frame, an install or contributing guide or a troubleshooting page: the Docs step, then the
 * guide by its h1; about its product (Coral, unless it names another), or about neither (`about: null`, Contributing).
 */
function osGuideEntry(
  guide: OpenSourceGuide,
  about: ProductId | null = guide.product ?? "coral",
): PageEntry {
  return {
    kind: "WebPage",
    name: titled(guide.meta.title),
    description: guide.meta.description,
    trail: [step(routes.docs), { name: guide.hero.title, path: guide.route }],
    ...(about ? { about } : {}),
  };
}

/**
 * A Learn article: its h1 as the headline, its published and updated days, the
 * product it is about (none for an article about both), the card its page
 * shows, and its author where it is published under a person.
 */
function articleEntry(article: Article): PageEntry {
  const author = articleAuthor(article);
  return {
    kind: "WebPage",
    name: titled(article.title),
    description: article.meta,
    trail: [step(routes.learn), { name: article.h1, path: articleRoute(article) }],
    ...(article.product === "both" ? {} : { about: article.product }),
    article: {
      headline: article.h1,
      published: article.published,
      modified: article.updated,
      image: articleCard(article),
      ...(author
        ? {
            author: {
              name: author.name,
              jobTitle: author.role,
              ...(author.linkedin ? { url: author.linkedin } : {}),
              worksForZoorik: !author.guest,
            },
          }
        : {}),
    },
  };
}

/** Value Lab's step in a study's trail: the hub, by its own name. The footer links each study, not the hub. */
const valueLabStep: Crumb = { name: caseStudiesHub.meta.title, path: routes.valueLab };

/** The glossary's step in a term's trail: the hub, by the name its terms' trail gives it. */
const glossaryStep: Crumb = { name: glossaryPage.crumb, path: routes.learnGlossary };

/**
 * A glossary term: Learn, the glossary, then the term by its h1; the product it names (none for a term about both);
 * and the term itself, by its name and its definition's first sentence.
 */
function termEntry(term: GlossaryTerm): PageEntry {
  return {
    kind: "WebPage",
    name: titled(term.title),
    description: term.meta,
    trail: [step(routes.learn), glossaryStep, { name: term.h1, path: termRoute(term) }],
    ...(term.product === "both" ? {} : { about: term.product }),
    term: { name: termName(term), description: term.card },
  };
}

/** The glossary's set: its address and its name, as each term's page points at it and the hub draws it whole. */
const termSetId = `${pageUrl(routes.learnGlossary)}#terms`;
const termSetRef = {
  "@type": "DefinedTermSet",
  "@id": termSetId,
  name: glossaryPage.hero.title,
  url: pageUrl(routes.learnGlossary),
} as const;

const studyHeadline = `${caseStudy.hero.title} ${caseStudy.hero.titleGreen}`;
const studyDate = isoDay(caseStudy.band.date);
const amoebaStudyHeadline = `${amoebaStudy.hero.title} ${amoebaStudy.hero.titleGreen}`;
const amoebaStudyDate = isoDay(amoebaStudy.band.date);

/** Every indexed page, by its route: the sitemap's list. */
const pages: Readonly<Record<string, PageEntry>> = {
  "/": {
    kind: "WebPage",
    name: site.title,
    description: site.homeDescription,
    trail: [],
    apps: productOrder,
  },
  [routes.coral]: productEntry(coralPageContent),
  [routes.amoeba]: productEntry(amoebaPageContent),
  [routes.assessment]: documentEntry(routes.assessment, assessmentCopy.meta, []),
  [routes.docs]: documentEntry(routes.docs, docsHub.meta, [], { kind: "CollectionPage" }),
  [routes.coralGuide]: documentEntry(routes.coralGuide, coralGuide.meta, [step(routes.docs)], {
    about: "coral",
  }),
  [routes.coralFaq]: documentEntry(routes.coralFaq, coralFaqPage.meta, [step(routes.docs)], {
    about: "coral",
  }),
  /* Held with the pages while `amoebaDocs` is off: the footer names them only then. */
  ...(amoebaDocs
    ? {
        [routes.amoebaGuide]: documentEntry(
          routes.amoebaGuide,
          amoebaGuide.meta,
          [step(routes.docs)],
          { about: "amoeba" },
        ),
        [routes.amoebaFaq]: documentEntry(
          routes.amoebaFaq,
          amoebaFaqPage.meta,
          [step(routes.docs)],
          { about: "amoeba" },
        ),
      }
    : {}),
  /* Zoorik Learn, the hub. */
  [routes.learn]: {
    kind: "CollectionPage",
    name: titled(learnPage.meta.title),
    description: learnPage.meta.description,
    trail: [step(routes.learn)],
  },
  /* Every published article, from the Learn index. */
  ...Object.fromEntries(
    learnArticles.map((article) => [articleRoute(article), articleEntry(article)]),
  ),
  /* The glossary's hub, under Learn, then every published term, from the glossary index. */
  [routes.learnGlossary]: {
    kind: "CollectionPage",
    name: titled(glossaryPage.meta.title),
    description: glossaryPage.meta.description,
    trail: [step(routes.learn), glossaryStep],
    termSet: true,
  },
  ...Object.fromEntries(glossaryTerms.map((term) => [termRoute(term), termEntry(term)])),
  /* Cloud cost optimization tools, then each comparison page under it by its title; about its product. */
  [routes.cloudCostTools]: {
    kind: "CollectionPage",
    name: titled(cloudCostToolsPage.meta.title),
    description: cloudCostToolsPage.meta.description,
    trail: [step(routes.cloudCostTools)],
  },
  ...Object.fromEntries(
    [
      ...alternativesPages.map((page) => ({ ...page, path: page.route })),
      ...versusPages.map((page) => ({ ...page, path: versusRoute(page) })),
    ].map((page) => [
      page.path,
      {
        kind: "WebPage",
        name: titled(page.meta.title),
        description: page.meta.description,
        trail: [
          step(routes.cloudCostTools),
          { name: "h1" in page ? page.h1 : page.meta.title, path: page.path },
        ],
        about: page.product,
      } satisfies PageEntry,
    ]),
  ),
  /* Open source and its guides. */
  [routes.openSource]: documentEntry(routes.openSource, openSourcePage.meta, []),
  [routes.docsInstallHelm]: osGuideEntry(openSourceGuides.helm),
  [routes.docsInstallTerraform]: osGuideEntry(openSourceGuides.terraform),
  [routes.docsContributing]: osGuideEntry(openSourceGuides.contributing, null),
  /* The two troubleshooting pages, each under Docs and about its product; Amoeba's held with its guide and FAQ. */
  [routes.coralTroubleshooting]: osGuideEntry(troubleshootingGuides.coral),
  ...(amoebaDocs
    ? { [routes.amoebaTroubleshooting]: osGuideEntry(troubleshootingGuides.amoeba) }
    : {}),
  /* The research papers: a page of the site's own, under Zoorik alone. */
  [routes.research]: {
    kind: "CollectionPage",
    name: titled(researchPage.meta.title),
    description: researchPage.meta.description,
    trail: [{ name: researchPage.hero.title, path: routes.research }],
  },
  /* Value Lab, the case studies' hub. */
  [routes.valueLab]: {
    kind: "CollectionPage",
    name: titled(caseStudiesHub.meta.title),
    description: caseStudiesHub.meta.description,
    trail: [valueLabStep],
  },
  /* The study prints one date, "12 October 2026 · Published by Zoorik": published, and not changed since. */
  [routes.caseStudyCoralDevCluster]: {
    kind: "WebPage",
    name: titled(caseStudy.meta.title),
    description: caseStudy.meta.description,
    trail: [valueLabStep, { name: studyHeadline, path: caseStudy.route }],
    about: "coral",
    article: {
      headline: studyHeadline,
      published: studyDate,
      modified: studyDate,
      image: cardFor(routes.caseStudyCoralDevCluster),
    },
  },
  /* The Amoeba study prints one date, "19 October 2026 · Published by Zoorik": published, and not changed since. */
  [routes.caseStudyAmoebaLabVms]: {
    kind: "WebPage",
    name: titled(amoebaStudy.meta.title),
    description: amoebaStudy.meta.description,
    trail: [valueLabStep, { name: amoebaStudyHeadline, path: amoebaStudy.route }],
    about: "amoeba",
    article: {
      headline: amoebaStudyHeadline,
      published: amoebaStudyDate,
      modified: amoebaStudyDate,
      image: cardFor(routes.caseStudyAmoebaLabVms),
    },
  },
  /* About, the organisation's own page. */
  [routes.about]: {
    kind: "AboutPage",
    name: titled(about.meta.title),
    description: about.meta.description,
    trail: [step(routes.about)],
    about: "organization",
  },
  /* A page about working at the organisation; no JobPosting, as it lists no open role. */
  [routes.careers]: {
    kind: "WebPage",
    name: titled(careers.meta.title),
    description: careers.meta.description,
    trail: [step(routes.careers)],
    about: "organization",
  },
  /* The events list; its events are the page's own Event markup (`@/features/events`). */
  [routes.events]: documentEntry(routes.events, eventsPage.meta, [], { kind: "CollectionPage" }),
  /* Zoorik Community. */
  [routes.community]: {
    kind: "WebPage",
    name: titled(communityPage.meta.title),
    description: communityPage.meta.description,
    trail: [step(routes.community)],
    about: "organization",
  },
  /* Where to find Zoorik. */
  [routes.marketplaces]: {
    kind: "WebPage",
    name: titled(marketplacesPage.meta.title),
    description: marketplacesPage.meta.description,
    trail: [step(routes.marketplaces)],
    about: "organization",
  },
  /* Zoorik News. */
  [routes.news]: {
    kind: "CollectionPage",
    name: titled(newsPage.meta.title),
    description: newsPage.meta.description,
    trail: [step(routes.news)],
    about: "organization",
  },
  /* The three company pages, each about the organisation. */
  [routes.brandAssets]: documentEntry(routes.brandAssets, brandAssetsPage.meta, [], {
    about: "organization",
  }),
  [routes.partners]: documentEntry(routes.partners, partnersPage.meta, [], {
    about: "organization",
  }),
  [routes.referrals]: documentEntry(routes.referrals, referralsPage.meta, [], {
    about: "organization",
  }),
  [routes.designPartners]: documentEntry(routes.designPartners, designPartnersPage.meta, [], {
    about: "organization",
  }),
  [routes.privacy]: documentEntry(routes.privacy, privacy.meta, []),
  [routes.terms]: documentEntry(routes.terms, termsCopy.meta, []),
  [routes.security]: documentEntry(routes.security, securityPage.meta, []),
  /* The Trust center, under Zoorik alone and about Coral, whose security overview, DPA and sub-processors it is. */
  [routes.trust]: {
    kind: "WebPage",
    name: titled(trustPage.meta.title),
    description: trustPage.meta.description,
    trail: [{ name: trustPage.hero.title, path: routes.trust }],
    about: "coral",
  },
};

/** Each indexed page's printed title, by path: what the footer's "Ask about Zoorik on" questions name a page by. */
export const pageTitles: Readonly<Record<string, string>> = Object.fromEntries(
  Object.entries(pages).map(([path, page]) => [path, page.name]),
);

/** One page's JSON-LD: the organisation, the site, the page, its trail, then its article, term or set, or apps. */
export function pageStructuredData(path: string) {
  const page = pages[path];
  if (!page) throw new Error(`structured data: no entry for ${path}`);
  const url = pageUrl(path);
  const pageId = `${url}#webpage`;
  const trailId = `${url}#breadcrumb`;
  const about =
    page.about === "organization"
      ? ref(organizationId)
      : page.about
        ? ref(appId(page.about))
        : undefined;
  return {
    "@context": "https://schema.org",
    "@graph": [
      organization,
      website,
      {
        "@type": page.kind,
        "@id": pageId,
        url,
        name: page.name,
        description: page.description,
        isPartOf: ref(websiteId),
        ...(page.trail.length > 0 ? { breadcrumb: ref(trailId) } : {}),
        ...(about ? { about } : {}),
        ...(page.kind === "AboutPage" ? { mainEntity: ref(organizationId) } : {}),
      },
      ...(page.trail.length > 0
        ? [
            {
              "@type": "BreadcrumbList",
              "@id": trailId,
              itemListElement: [{ name: site.name, path: "/" }, ...page.trail].map(
                (crumb, index) => ({
                  "@type": "ListItem",
                  position: index + 1,
                  name: crumb.name,
                  item: pageUrl(crumb.path),
                }),
              ),
            },
          ]
        : []),
      ...(page.article
        ? [
            {
              "@type": "TechArticle",
              "@id": `${url}#article`,
              headline: page.article.headline,
              mainEntityOfPage: ref(pageId),
              ...(page.article.published ? { datePublished: page.article.published } : {}),
              dateModified: page.article.modified,
              /* The person, where the article names one (working for Zoorik unless a guest); Zoorik otherwise. */
              author: page.article.author
                ? {
                    "@type": "Person",
                    name: page.article.author.name,
                    jobTitle: page.article.author.jobTitle,
                    ...(page.article.author.url ? { url: page.article.author.url } : {}),
                    ...(page.article.author.worksForZoorik
                      ? { worksFor: ref(organizationId) }
                      : {}),
                  }
                : ref(organizationId),
              publisher: ref(organizationId),
              ...(about ? { about } : {}),
              image: `${site.url}${page.article.image.url}`,
            },
          ]
        : []),
      /* A glossary term: its name and definition, in the glossary's set. */
      ...(page.term
        ? [
            {
              "@type": "DefinedTerm",
              "@id": `${url}#term`,
              name: page.term.name,
              description: page.term.description,
              url,
              inDefinedTermSet: termSetRef,
              mainEntityOfPage: ref(pageId),
            },
          ]
        : []),
      /* The glossary's hub: the set, and every published term in it by its name and address, so the set reads whole
         on its own page. */
      ...(page.termSet
        ? [
            {
              ...termSetRef,
              description: page.description,
              hasDefinedTerm: glossaryTerms.map((term) => ({
                "@type": "DefinedTerm",
                "@id": `${pageUrl(termRoute(term))}#term`,
                name: termName(term),
                url: pageUrl(termRoute(term)),
              })),
              mainEntityOfPage: ref(pageId),
            },
          ]
        : []),
      ...(page.apps ?? []).map(softwareApplication),
    ],
  } as const;
}

/** The home page's JSON-LD: the organisation, the site, the page, then the apps in the page's order. */
export const homeStructuredData = pageStructuredData("/");

/** A product page's JSON-LD: the organisation, the site, the page and its trail, then that product's app. */
export function productStructuredData(product: ProductId) {
  return pageStructuredData(routes[product]);
}
