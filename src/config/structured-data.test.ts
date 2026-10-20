import { readFileSync } from "node:fs";

import { cleanup, render } from "@testing-library/react";
import type { Metadata } from "next";
import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";

import sitemap from "@/app/sitemap";
import { crunchbaseProfile, wikidataEntity } from "@/config/entity";
import { awsSellerProfile } from "@/config/marketplaces";
import { calendarUrl, contactEmail, routes, site } from "@/config/site";
import { about, cin, registeredOffice } from "@/content/about";
import { amoebaPageContent } from "@/content/amoeba-page";
import { caseStudy } from "@/content/case-studies";
import { versusPages, versusRoute } from "@/content/learn-compare";
import { coralPageContent } from "@/content/coral-page";
import { socialProfiles } from "@/content/footer";
import { articles } from "@/content/learn-articles";
import { products } from "@/content/products";

import {
  brandLogo,
  homeStructuredData,
  organization,
  pageStructuredData,
  productStructuredData,
} from "./structured-data";

const pathname = vi.hoisted(() => ({ current: "/" }));
vi.mock("next/navigation", async (original) => ({
  ...(await original<typeof import("next/navigation")>()),
  usePathname: () => pathname.current,
}));

type Node = Readonly<Record<string, unknown>>;

const graphOf = (path: string) => pageStructuredData(path)["@graph"] as readonly Node[];
const ofType = (graph: readonly Node[], type: string) =>
  graph.filter((node) => node["@type"] === type);

const graph = homeStructuredData["@graph"] as readonly Node[];
const [coral, amoeba] = ofType(graph, "SoftwareApplication");

/** The sitemap's pages: every indexed page, by path. */
const listed = sitemap().map((entry) => ({
  path: new URL(entry.url).pathname,
  url: entry.url,
  lastModified: entry.lastModified,
}));

interface PageModule {
  readonly metadata?: Metadata;
  readonly default: () => React.JSX.Element;
}

/**
 * A versus page is one dynamic route (`/compare/[slug]`, its slugs data): its module, resolved for one slug, so it
 * renders and titles itself as a static page's does.
 */
function versusModule(slug: string): () => Promise<PageModule> {
  return async () => {
    const page = await import("@/app/compare/[slug]/page");
    const params = Promise.resolve({ slug });
    const [metadata, element] = await Promise.all([
      page.generateMetadata({ params }),
      page.default({ params }),
    ]);
    return { metadata, default: () => element };
  };
}

/** Each indexed page's module, by path. */
const pageModules: Readonly<Record<string, () => Promise<PageModule>>> = {
  "/": () => import("@/app/page"),
  "/coral": () => import("@/app/coral/page"),
  "/amoeba": () => import("@/app/amoeba/page"),
  "/assessment": () => import("@/app/assessment/page"),
  "/docs": () => import("@/app/docs/page"),
  "/coral/guide": () => import("@/app/coral/guide/page"),
  "/coral/faq": () => import("@/app/coral/faq/page"),
  "/amoeba/guide": () => import("@/app/amoeba/guide/page"),
  "/amoeba/faq": () => import("@/app/amoeba/faq/page"),
  "/learn": () => import("@/app/learn/page"),
  "/learn/poor-architecture-cloud-bill": () =>
    import("@/app/learn/poor-architecture-cloud-bill/page"),
  "/learn/vpa-vs-hpa": () => import("@/app/learn/vpa-vs-hpa/page"),
  "/learn/coral-and-native-autoscalers": () =>
    import("@/app/learn/coral-and-native-autoscalers/page"),
  "/learn/shrink-azure-managed-disk": () => import("@/app/learn/shrink-azure-managed-disk/page"),
  "/case-studies": () => import("@/app/case-studies/page"),
  "/case-studies/coral-dev-cluster": () => import("@/app/case-studies/coral-dev-cluster/page"),
  "/about": () => import("@/app/about/page"),
  "/careers": () => import("@/app/careers/page"),
  "/events": () => import("@/app/events/page"),
  "/news": () => import("@/app/news/page"),
  "/brand-assets": () => import("@/app/brand-assets/page"),
  "/partners": () => import("@/app/partners/page"),
  "/referrals": () => import("@/app/referrals/page"),
  "/design-partners": () => import("@/app/design-partners/page"),
  "/compare": () => import("@/app/compare/page"),
  "/compare/coral-alternatives": () => import("@/app/compare/coral-alternatives/page"),
  "/compare/amoeba-alternatives": () => import("@/app/compare/amoeba-alternatives/page"),
  "/community": () => import("@/app/community/page"),
  "/marketplaces": () => import("@/app/marketplaces/page"),
  ...Object.fromEntries(versusPages.map((page) => [versusRoute(page), versusModule(page.slug)])),
  "/privacy": () => import("@/app/privacy/page"),
  "/terms": () => import("@/app/terms/page"),
  "/security": () => import("@/app/security/page"),
  "/open-source": () => import("@/app/open-source/page"),
  "/docs/install-coral-with-helm": () => import("@/app/docs/install-coral-with-helm/page"),
  "/docs/install-coral-with-terraform": () =>
    import("@/app/docs/install-coral-with-terraform/page"),
  "/docs/contributing": () => import("@/app/docs/contributing/page"),
};
const pageModule = (path: string): Promise<PageModule> => {
  const load = pageModules[path];
  if (!load) throw new Error(`no page module listed for ${path}`);
  return load();
};

/** The `<title>` a page prints: its own through the template, an absolute one as is, or the home page's. */
function printedTitle(metadata: Metadata | undefined): string {
  const title = metadata?.title;
  if (typeof title === "string") return site.titleTemplate.replace("%s", title);
  if (title && typeof title === "object" && "absolute" in title) return title.absolute;
  return site.title;
}

const orgRef = { "@id": "https://zoorik.com/#organization" };

describe("the home page's structured data", () => {
  it("is the organisation, the site, the page, then one app per product in the page's order", () => {
    expect(graph.map((node) => node["@type"])).toEqual([
      "Organization",
      "WebSite",
      "WebPage",
      "SoftwareApplication",
      "SoftwareApplication",
    ]);
  });

  it("describes each product as its page does", () => {
    expect(amoeba.name).toBe(products.amoeba.name);
    expect(amoeba.description).toBe(amoebaPageContent.meta.appDescription);
    /* What "What is Amoeba?" says. */
    expect(amoeba.description).toBe(
      "Block storage cost optimization for VMs on Azure and AWS. Amoeba moves a VM’s data disks onto one pool sized to the data plus 20%, then expands and shrinks that pool online, one disk at a time.",
    );
    const [whatIs] = amoebaPageContent.about.paragraphs;
    expect(whatIs).toContain("block storage cost optimization platform for VMs on Azure and AWS");
    expect(whatIs).toContain(String(amoeba.description).split(". ")[1]!.replace(/\.$/, ""));
    expect(amoeba.applicationSubCategory).toBe("Block storage cost optimization");
    expect(amoeba.featureList).toEqual([
      "Monitoring",
      "Savings insights",
      "Block storage optimization",
    ]);
    expect(amoeba.operatingSystem).toBe("Windows, Linux");
    expect(coral.name).toBe(products.coral.name);
    expect(coral.description).toBe(coralPageContent.meta.appDescription);
    expect(coral.description).toBe(
      "Kubernetes cost optimization on AKS and EKS. Coral sizes pod requests to real use and drains idle nodes one at a time.",
    );
    expect(coral.applicationSubCategory).toBe("Kubernetes cost optimization");
    expect(coral.featureList).toEqual([
      "Monitoring",
      "Recommendations",
      "Workload optimization",
      "Node optimization",
    ]);
    expect(coral).not.toHaveProperty("operatingSystem");
  });

  it("names each product with Zoorik's name, and points it at its guide", () => {
    expect(coral.alternateName).toBe("Zoorik Coral");
    expect(amoeba.alternateName).toBe("Zoorik Amoeba");
    expect(coral.softwareHelp).toMatchObject({ url: "https://zoorik.com/coral/guide" });
    expect(amoeba.softwareHelp).toMatchObject({ url: "https://zoorik.com/amoeba/guide" });
  });

  it("links only the pages that exist about each product: Coral's two listings and its G2 page, none for Amoeba yet", () => {
    expect(coral.sameAs).toEqual([
      "https://aws.amazon.com/marketplace/pp/prodview-kx44lqme4vwys",
      "https://marketplace.microsoft.com/en-us/product/zoorik.coral",
      "https://www.g2.com/products/zoorik-coral/reviews",
    ]);
    expect(amoeba).not.toHaveProperty("sameAs");
  });

  it("points each product at its own page, published by the organisation", () => {
    expect(amoeba.url).toBe("https://zoorik.com/amoeba");
    expect(amoeba["@id"]).toBe("https://zoorik.com/amoeba#software");
    expect(coral.url).toBe("https://zoorik.com/coral");
    expect(coral["@id"]).toBe("https://zoorik.com/coral#software");
    for (const app of [coral, amoeba]) expect(app.publisher).toEqual(orgRef);
  });

  it("names the real contact, profiles and logo, and no founder", () => {
    const org = graph[0];
    expect(org.legalName).toBe("Zoorik Private Limited");
    expect(org.knowsAbout).toEqual([
      "Cloud cost optimization",
      "Kubernetes cost optimization",
      "Block storage cost optimization",
    ]);
    expect(org.email).toBe(contactEmail);
    expect(org.contactPoint).toEqual({
      "@type": "ContactPoint",
      email: "founders@zoorik.com",
      url: calendarUrl,
    });
    expect(calendarUrl).toBe("https://cal.com/zoorik/talk");
    /* All six profiles, though the footer's row shows five, then the AWS seller page, the
       Crunchbase profile and the Wikidata entry, then the PyPI user and the Terraform Registry
       namespace, then the profiles the footer's row does not show, then the directories. */
    expect(org.sameAs).toEqual([
      ...socialProfiles.map((link) => link.href),
      awsSellerProfile,
      crunchbaseProfile,
      wikidataEntity,
      "https://pypi.org/user/zoorik/",
      "https://registry.terraform.io/namespaces/getzoorik",
      "https://bsky.app/profile/zoorik.com",
      "https://gitlab.com/zoorik",
      "https://zoorik.substack.com",
      "https://www.instagram.com/getzoorik/",
      "https://artifacthub.io/packages/search?org=zoorik",
      "https://www.npmjs.com/org/zoorik",
      "https://quay.io/organization/zoorik",
      "https://gravatar.com/getzoorik",
      "https://news.ycombinator.com/user?id=zoorik",
      "https://dev.to/zoorik",
      "https://mastodon.social/@zoorik",
      "https://wellfound.com/company/zoorik",
      "https://www.f6s.com/company/zoorik",
      "https://tracxn.com/d/companies/zoorik/__0-HfxD5kpG4SADDRpAEc8XzSUYQVK-7bAubR7EZJjts",
      "https://tracxn.com/d/legal-entities/india/zoorik-private-limited/__9ZpZy4SmPoVfqekVAwReCtuqusqZ9_HeIkXu1AWCU84",
      "https://www.g2.com/sellers/zoorik",
      "https://saasbrowser.com/en/saas/1707340/zoorik",
    ]);
    expect(awsSellerProfile).toBe(
      "https://aws.amazon.com/marketplace/seller-profile?id=seller-mtaavozrqchlk",
    );
    expect(crunchbaseProfile).toBe("https://www.crunchbase.com/organization/zoorik");
    expect(wikidataEntity).toBe("https://www.wikidata.org/wiki/Q141717592");
    expect(org.description).toBe(
      "Reduce cloud cost while your systems keep serving. Coral: Kubernetes cost optimization on AKS and EKS. Amoeba: block storage cost optimization on Azure and AWS.",
    );
    expect(org.logo).toEqual({
      "@type": "ImageObject",
      url: "https://zoorik.com/brand/zoorik-mark-navy-2048.png",
      width: 2048,
      height: 2048,
    });
    const png = readFileSync(`public${brandLogo.path}`);
    expect(png.readUInt32BE(16)).toBe(brandLogo.width);
    expect(png.readUInt32BE(20)).toBe(brandLogo.height);
    expect(org).not.toHaveProperty("founder");
    expect(org).not.toHaveProperty("foundingDate");
  });

  it("carries the registered office and the CIN /about prints, from the same constants", () => {
    const org = graph[0];
    expect(org.address).toEqual({
      "@type": "PostalAddress",
      streetAddress: registeredOffice.street,
      addressLocality: registeredOffice.locality,
      postalCode: registeredOffice.postalCode,
      addressRegion: registeredOffice.region,
      addressCountry: "IN",
    });
    expect(org.identifier).toEqual({ "@type": "PropertyValue", propertyID: "CIN", value: cin });

    const fact = (term: string) => about.company.facts.find((f) => f.term === term)?.value;
    expect(fact("CIN")).toBe(cin);
    expect(cin).toBe("U62011KA2026PTC228102");
    /* The page's line is unchanged, and is the address's parts. */
    expect(fact("Registered office")).toBe(
      "Vaishnavi Signature, No. 78/9, Outer Ring Road, Bellandur, Bangalore South, Bangalore 560103, Karnataka, India",
    );
    expect(fact("Registered office")).toBe(
      `${registeredOffice.street}, ${registeredOffice.locality} ${registeredOffice.postalCode}, ${registeredOffice.region}, ${registeredOffice.country.name}`,
    );
  });

  it("gives each product page the organisation, its page and that product's app", () => {
    for (const product of ["coral", "amoeba"] as const) {
      const data = productStructuredData(product)["@graph"] as readonly Node[];
      expect(data[0]).toBe(organization);
      expect(ofType(data, "SoftwareApplication")).toEqual([
        graph.find((node) => node.name === products[product].name),
      ]);
    }
  });
});

describe("every indexed page's structured data", () => {
  it("renders on every page in the sitemap as one block that parses to the page's graph", async () => {
    expect(listed).toHaveLength(38);
    for (const { path } of listed) {
      pathname.current = path;
      const { default: Page } = await pageModule(path);
      const { container } = render(createElement(Page));
      const blocks = container.querySelectorAll('script[type="application/ld+json"]');
      /* /events adds its events' own block after the page's (`eventsStructuredData`, @/features/events). */
      expect(blocks, path).toHaveLength(path === routes.events ? 2 : 1);
      const data = JSON.parse(blocks[0]!.textContent!);
      expect(data, path).toEqual(JSON.parse(JSON.stringify(pageStructuredData(path))));
      if (path === routes.events) {
        const events = JSON.parse(blocks[1]!.textContent!)["@graph"] as readonly Node[];
        expect(events.length, path).toBeGreaterThan(0);
        expect(
          events.every((node) => node["@type"] === "Event"),
          path,
        ).toBe(true);
      }
      /* An article's headline is the h1 its page prints. */
      const [article] = ofType(data["@graph"], "TechArticle");
      if (article) {
        const h1 = container.querySelector("h1")!.textContent!.replace(/\s+/g, " ").trim();
        expect(article.headline, path).toBe(h1);
      }
      cleanup();
    }
    /* It renders every listed page, /events's 76 cards and /learn's hub among them: past vitest's 5s once the suite runs in
       parallel. */
  }, 20_000);

  it("names each page by its printed title, description and address, and trails it from the home page", async () => {
    for (const { path, url } of listed) {
      const { metadata } = await pageModule(path);
      const nodes = graphOf(path);
      expect(
        nodes.slice(0, 2).map((node) => node["@type"]),
        path,
      ).toEqual(["Organization", "WebSite"]);
      const page = nodes[2]!;
      expect(page, path).toMatchObject({
        "@id": `${url}#webpage`,
        url,
        name: printedTitle(metadata),
        description: metadata?.description,
        isPartOf: { "@id": "https://zoorik.com/#website" },
      });

      const [trail, ...more] = ofType(nodes, "BreadcrumbList");
      expect(more, path).toHaveLength(0);
      if (path === "/") {
        expect(trail).toBeUndefined();
        continue;
      }
      expect(page.breadcrumb, path).toEqual({ "@id": trail!["@id"] });
      const steps = trail!.itemListElement as readonly Node[];
      expect(steps[0], path).toEqual({
        "@type": "ListItem",
        position: 1,
        name: "Zoorik",
        item: "https://zoorik.com/",
      });
      expect(steps.at(-1)!.item, path).toBe(url);
      expect(
        steps.map((step) => step.position),
        path,
      ).toEqual(steps.map((_, index) => index + 1));
    }
  });

  it("trails a guide or FAQ through Docs, an article through Learn, the study through Case studies", () => {
    const names = (path: string) =>
      (ofType(graphOf(path), "BreadcrumbList")[0]!.itemListElement as readonly Node[]).map(
        (step) => step.name,
      );
    expect(names(routes.coralGuide)).toEqual(["Zoorik", "Docs", "Coral guide"]);
    expect(names(routes.amoebaFaq)).toEqual(["Zoorik", "Docs", "Amoeba FAQ"]);
    expect(names(routes.learnShrinkAzureDisk)).toEqual([
      "Zoorik",
      "Learn",
      articles["shrink-azure-managed-disk"].hero.title,
    ]);
    expect(names(routes.caseStudyCoralDevCluster)).toEqual([
      "Zoorik",
      "Case studies",
      "How we reduced our own cluster’s machine bill by 58%",
    ]);
    expect(names(routes.privacy)).toEqual(["Zoorik", "Privacy"]);
    expect(names(routes.careers)).toEqual(["Zoorik", "Careers"]);
    expect(names(routes.events)).toEqual(["Zoorik", "Events"]);
    expect(names(routes.brandAssets)).toEqual(["Zoorik", "Brand assets"]);
    expect(names(routes.partners)).toEqual(["Zoorik", "Partners"]);
    expect(names(routes.referrals)).toEqual(["Zoorik", "Referrals"]);
    expect(names(routes.designPartners)).toEqual(["Zoorik", "Design partners"]);
    expect(names(routes.news)).toEqual(["Zoorik", "News"]);
    expect(names(routes.compare)).toEqual(["Zoorik", "Compare"]);
    expect(names(routes.community)).toEqual(["Zoorik", "Community"]);
    expect(names(routes.marketplaces)).toEqual(["Zoorik", "Marketplaces"]);
    expect(names(routes.compareCoralAlternatives)).toEqual([
      "Zoorik",
      "Compare",
      "Coral alternatives: Kubernetes cost tools compared",
    ]);
  });

  it("types the hubs as collections and /about as the organisation's page", () => {
    for (const { path } of listed) {
      const kind = graphOf(path)[2]!["@type"];
      if (["/docs", "/learn", "/case-studies", "/events", "/news", "/compare"].includes(path))
        expect(kind, path).toBe("CollectionPage");
      else if (path === "/about") expect(kind).toBe("AboutPage");
      else expect(kind, path).toBe("WebPage");
    }
    expect(graphOf(routes.about)[2]).toMatchObject({ about: orgRef, mainEntity: orgRef });
    /* /careers is a plain page about working at the organisation: no mainEntity, no JobPosting. */
    expect(graphOf(routes.careers)[2]).toMatchObject({ "@type": "WebPage", about: orgRef });
    expect(graphOf(routes.careers)[2]).not.toHaveProperty("mainEntity");
    expect(graphOf(routes.careers).map((node) => node["@type"])).not.toContain("JobPosting");
    /* The three company pages are about the organisation too. */
    for (const path of [
      routes.brandAssets,
      routes.partners,
      routes.referrals,
      routes.designPartners,
    ]) {
      expect(graphOf(path)[2], path).toMatchObject({ "@type": "WebPage", about: orgRef });
    }
  });

  it("points the product pages, guides, FAQs, articles and the study at their product", () => {
    const about = (path: string) => graphOf(path)[2]!.about;
    for (const path of [routes.coral, routes.coralGuide, routes.coralFaq, routes.learnVpaVsHpa]) {
      expect(about(path), path).toEqual({ "@id": "https://zoorik.com/coral#software" });
    }
    for (const path of [
      routes.learnCoralAutoscalers,
      routes.learnPoorArchitecture,
      routes.caseStudyCoralDevCluster,
    ]) {
      expect(about(path), path).toEqual({ "@id": "https://zoorik.com/coral#software" });
    }
    for (const path of [routes.amoeba, routes.amoebaGuide, routes.amoebaFaq]) {
      expect(about(path), path).toEqual({ "@id": "https://zoorik.com/amoeba#software" });
    }
    expect(about(routes.learnShrinkAzureDisk)).toEqual({
      "@id": "https://zoorik.com/amoeba#software",
    });
    for (const path of ["/", routes.assessment, routes.docs, routes.learn, routes.privacy]) {
      expect(about(path), path).toBeUndefined();
    }
  });

  it("makes the articles and the study TechArticles: their date, their author, with their page's card", async () => {
    const articlePaths = [
      routes.learnPoorArchitecture,
      routes.learnVpaVsHpa,
      routes.learnCoralAutoscalers,
      routes.learnShrinkAzureDisk,
      routes.caseStudyCoralDevCluster,
    ] as string[];
    for (const { path, url, lastModified } of listed) {
      const found = ofType(graphOf(path), "TechArticle");
      if (!articlePaths.includes(path)) {
        expect(found, path).toHaveLength(0);
        continue;
      }
      const [article] = found;
      const { metadata } = await pageModule(path);
      const card = (metadata?.openGraph?.images as readonly { url: string }[])[0]!;
      expect(article, path).toMatchObject({
        "@id": `${url}#article`,
        mainEntityOfPage: { "@id": `${url}#webpage` },
        datePublished: lastModified,
        dateModified: lastModified,
        /* Zoorik, but for the essay published under Vineet's name. */
        author:
          path === routes.learnPoorArchitecture
            ? {
                "@type": "Person",
                name: "Vineet",
                jobTitle: "Infrastructure engineer",
                url: "https://www.linkedin.com/in/yadavvineet/",
                worksFor: orgRef,
              }
            : orgRef,
        publisher: orgRef,
        about: graphOf(path)[2]!.about,
        image: `https://zoorik.com${card.url}`,
      });
    }
    const [study] = ofType(graphOf(routes.caseStudyCoralDevCluster), "TechArticle");
    expect(study).toMatchObject({ datePublished: "2026-10-12", dateModified: "2026-10-12" });
    expect(caseStudy.band.date).toBe("12 October 2026");
    /* Each article's own Updated day is both its published and its modified date: the only day it prints. */
    const [article] = ofType(graphOf(routes.learnVpaVsHpa), "TechArticle");
    expect(article).toMatchObject({ datePublished: "2026-10-09", dateModified: "2026-10-09" });
    const [essay] = ofType(graphOf(routes.learnPoorArchitecture), "TechArticle");
    expect(essay).toMatchObject({ datePublished: "2026-10-14", dateModified: "2026-10-14" });
    expect(orgRef).toEqual({ "@id": "https://zoorik.com/#organization" });
  });

  it("carries an app in full only on the home and product pages", () => {
    for (const { path } of listed) {
      const apps = ofType(graphOf(path), "SoftwareApplication").length;
      expect(apps, path).toBe(path === "/" ? 2 : path === "/coral" || path === "/amoeba" ? 1 : 0);
    }
  });

  it("claims no price, rating or review, and no FAQ, how-to or site search", () => {
    const json = JSON.stringify(listed.map(({ path }) => pageStructuredData(path)));
    for (const key of ["offers", "price", "aggregateRating", "review", "potentialAction"]) {
      expect(json).not.toContain(`"${key}"`);
    }
    for (const type of ["FAQPage", "HowTo", "SearchAction", "Offer", "Review", "AggregateRating"]) {
      expect(json).not.toContain(`"${type}"`);
    }
  });
});
