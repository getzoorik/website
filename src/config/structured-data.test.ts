import { readFileSync } from "node:fs";

import { cleanup, render } from "@testing-library/react";
import type { Metadata } from "next";
import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";

import sitemap from "@/app/sitemap";
import { crunchbaseProfile, wikidataEntity } from "@/config/entity";
import { storeProfiles } from "@/config/marketplaces";
import { calendarUrl, contactEmail, learnPath, routes, site } from "@/config/site";
import { about, cin, registeredOffice } from "@/content/about";
import { amoebaPageContent } from "@/content/amoeba-page";
import { caseStudy } from "@/content/case-studies";
import { versusPages, versusRoute } from "@/content/learn-compare";
import { coralPageContent } from "@/content/coral-page";
import { authors } from "@/content/authors";
import { socialProfiles } from "@/content/footer";
import { glossaryPage, glossaryTerms, termName, termRoute } from "@/content/learn/glossary";
import { articleAuthor, articleCard, articleRoute, learnArticles } from "@/content/learn/published";
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
    const page = await import("@/app/cloud-cost-optimization-library/[slug]/page");
    const params = Promise.resolve({ slug });
    const [metadata, element] = await Promise.all([
      page.generateMetadata({ params }),
      page.default({ params }),
    ]);
    return { metadata, default: () => element };
  };
}

/** A Learn article is one dynamic route (`/learn/[slug]`) too: its module, resolved for one slug. */
function articleModule(slug: string): () => Promise<PageModule> {
  return async () => {
    const page = await import("@/app/learn/[slug]/page");
    const params = Promise.resolve({ slug });
    const [metadata, element] = await Promise.all([
      page.generateMetadata({ params }),
      page.default({ params }),
    ]);
    return { metadata, default: () => element };
  };
}

/** A glossary term is one dynamic route (`/learn/glossary/[slug]`) too: its module, resolved for one slug. */
function termModule(slug: string): () => Promise<PageModule> {
  return async () => {
    const page = await import("@/app/learn/glossary/[slug]/page");
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
  ...Object.fromEntries(
    learnArticles.map((article) => [articleRoute(article), articleModule(article.slug)]),
  ),
  "/learn/glossary": () => import("@/app/learn/glossary/page"),
  ...Object.fromEntries(glossaryTerms.map((term) => [termRoute(term), termModule(term.slug)])),
  "/value-lab": () => import("@/app/value-lab/page"),
  "/value-lab/coral-dev-cluster": () => import("@/app/value-lab/coral-dev-cluster/page"),
  "/value-lab/amoeba-lab-vms": () => import("@/app/value-lab/amoeba-lab-vms/page"),
  "/research-cloud-cost-optimization": () => import("@/app/research-cloud-cost-optimization/page"),
  "/about": () => import("@/app/about/page"),
  "/careers": () => import("@/app/careers/page"),
  "/events": () => import("@/app/events/page"),
  "/news": () => import("@/app/news/page"),
  "/brand-assets": () => import("@/app/brand-assets/page"),
  "/partners": () => import("@/app/partners/page"),
  "/referrals": () => import("@/app/referrals/page"),
  "/design-partners": () => import("@/app/design-partners/page"),
  "/cloud-cost-optimization-library": () => import("@/app/cloud-cost-optimization-library/page"),
  "/cloud-cost-optimization-library/coral-alternatives": () =>
    import("@/app/cloud-cost-optimization-library/coral-alternatives/page"),
  "/cloud-cost-optimization-library/amoeba-alternatives": () =>
    import("@/app/cloud-cost-optimization-library/amoeba-alternatives/page"),
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
  "/docs/coral-not-connecting-to-cluster": () =>
    import("@/app/docs/coral-not-connecting-to-cluster/page"),
  "/docs/coral-not-removing-nodes": () => import("@/app/docs/coral-not-removing-nodes/page"),
  "/docs/amoeba-not-showing-my-vm": () => import("@/app/docs/amoeba-not-showing-my-vm/page"),
  "/docs/amoeba-not-rightsizing-disks": () =>
    import("@/app/docs/amoeba-not-rightsizing-disks/page"),
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
      "Block storage cost optimization for VMs on Azure and AWS. Amoeba moves a VM’s data disks onto one btrfs pool sized to your data, with room to grow. Then it rightsizes that pool, one disk at a time.",
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

  it("links only the pages that exist about each product: Coral's two listings and its G2 page, Amoeba's two listings", () => {
    expect(coral.sameAs).toEqual([
      "https://aws.amazon.com/marketplace/pp/prodview-kx44lqme4vwys",
      "https://marketplace.microsoft.com/en-us/product/zoorik.coral",
      "https://www.g2.com/products/zoorik-coral/reviews",
    ]);
    expect(amoeba.sameAs).toEqual([
      "https://aws.amazon.com/marketplace/pp/prodview-u52eig5hqarzy",
      "https://marketplace.microsoft.com/en-us/product/zoorik.amoeba",
    ]);
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
    /* All six profiles, though the footer's row shows five, then Zoorik's page in each store, the
       Crunchbase profile and the Wikidata entry, then the PyPI user and the Terraform Registry
       namespace, then the profiles the footer's row does not show, then the directories. */
    expect(org.sameAs).toEqual([
      ...socialProfiles.map((link) => link.href),
      ...storeProfiles,
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
    expect(storeProfiles).toEqual([
      "https://aws.amazon.com/marketplace/seller-profile?id=seller-mtaavozrqchlk",
      "https://marketplace.microsoft.com/en-us/partners/04f64eb0-8878-4f14-9578-bc5d104737e7/overview",
    ]);
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
    /* The program /about lists under Programs, run by NVIDIA (its Wikidata entry). */
    expect(org.memberOf).toEqual([
      {
        "@type": "ProgramMembership",
        programName: "NVIDIA Inception Program",
        url: "https://www.nvidia.com/en-us/startups/",
        hostingOrganization: {
          "@type": "Organization",
          name: "NVIDIA",
          url: "https://www.nvidia.com/",
          sameAs: "https://www.wikidata.org/wiki/Q182477",
        },
      },
    ]);
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
    expect(listed).toHaveLength(41 + learnArticles.length + glossaryTerms.length);
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
    /* It renders every listed page, /events's 76 cards, /learn's hub and the glossary's 61 pages among them: past
       vitest's 5s once the suite runs in parallel. */
  }, 40_000);

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

  it("trails a guide or FAQ through Docs, an article through Learn, the study through Value Lab", () => {
    const names = (path: string) =>
      (ofType(graphOf(path), "BreadcrumbList")[0]!.itemListElement as readonly Node[]).map(
        (step) => step.name,
      );
    expect(names(routes.coralGuide)).toEqual(["Zoorik", "Docs", "Coral guide"]);
    expect(names(routes.amoebaFaq)).toEqual(["Zoorik", "Docs", "Amoeba FAQ"]);
    for (const article of learnArticles) {
      expect(names(articleRoute(article)), article.slug).toEqual(["Zoorik", "Learn", article.h1]);
    }
    /* The glossary's hub under Learn, and each term under the hub, by the name its trail over the h1 gives it. */
    expect(names(routes.learnGlossary)).toEqual(["Zoorik", "Learn", "Glossary"]);
    for (const term of glossaryTerms) {
      expect(names(termRoute(term)), term.slug).toEqual(["Zoorik", "Learn", "Glossary", term.h1]);
    }
    expect(names(routes.caseStudyCoralDevCluster)).toEqual([
      "Zoorik",
      "Value Lab",
      "How we reduced our own cluster’s machine bill by 58%",
    ]);
    expect(names(routes.caseStudyAmoebaLabVms)).toEqual([
      "Zoorik",
      "Value Lab",
      "How Amoeba rightsized our own lab VM’s btrfs pool by 25%",
    ]);
    /* The troubleshooting pages under Docs, each by its h1; the research papers under Zoorik alone. */
    expect(names(routes.docsCoralNotConnecting)).toEqual([
      "Zoorik",
      "Docs",
      "Coral is not connecting to my cluster: what to check",
    ]);
    expect(names(routes.docsCoralNotRemovingNodes)).toEqual([
      "Zoorik",
      "Docs",
      "Why Coral is not removing a node",
    ]);
    expect(names(routes.docsAmoebaNotShowingVm)).toEqual([
      "Zoorik",
      "Docs",
      "Amoeba is not showing my VM: what to check",
    ]);
    expect(names(routes.docsAmoebaNotRightsizing)).toEqual([
      "Zoorik",
      "Docs",
      "Why Amoeba has not rightsized my disks yet",
    ]);
    expect(names(routes.research)).toEqual(["Zoorik", "Cloud cost optimization research"]);
    expect(names(routes.privacy)).toEqual(["Zoorik", "Privacy"]);
    expect(names(routes.careers)).toEqual(["Zoorik", "Careers"]);
    expect(names(routes.events)).toEqual(["Zoorik", "Events"]);
    expect(names(routes.brandAssets)).toEqual(["Zoorik", "Brand assets"]);
    expect(names(routes.partners)).toEqual(["Zoorik", "Partners"]);
    expect(names(routes.referrals)).toEqual(["Zoorik", "Referrals"]);
    expect(names(routes.designPartners)).toEqual(["Zoorik", "Design partners"]);
    expect(names(routes.news)).toEqual(["Zoorik", "News"]);
    expect(names(routes.cloudCostTools)).toEqual(["Zoorik", "Cloud cost optimization tools"]);
    expect(names(routes.community)).toEqual(["Zoorik", "Community"]);
    expect(names(routes.marketplaces)).toEqual(["Zoorik", "Marketplaces"]);
    expect(names(routes.compareCoralAlternatives)).toEqual([
      "Zoorik",
      "Cloud cost optimization tools",
      "Coral alternatives: Kubernetes cost tools compared",
    ]);
  });

  it("types the hubs as collections and /about as the organisation's page", () => {
    for (const { path } of listed) {
      const kind = graphOf(path)[2]!["@type"];
      if (
        [
          "/docs",
          "/learn",
          "/learn/glossary",
          "/value-lab",
          "/events",
          "/news",
          "/cloud-cost-optimization-library",
          "/research-cloud-cost-optimization",
        ].includes(path)
      )
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
    for (const path of [routes.coral, routes.coralGuide, routes.coralFaq]) {
      expect(about(path), path).toEqual({ "@id": "https://zoorik.com/coral#software" });
    }
    for (const path of [
      routes.caseStudyCoralDevCluster,
      routes.docsInstallHelm,
      routes.docsCoralNotConnecting,
      routes.docsCoralNotRemovingNodes,
    ]) {
      expect(about(path), path).toEqual({ "@id": "https://zoorik.com/coral#software" });
    }
    for (const path of [
      routes.amoeba,
      routes.amoebaGuide,
      routes.amoebaFaq,
      routes.caseStudyAmoebaLabVms,
      routes.docsAmoebaNotShowingVm,
      routes.docsAmoebaNotRightsizing,
    ]) {
      expect(about(path), path).toEqual({ "@id": "https://zoorik.com/amoeba#software" });
    }
    /* An article points at the product it is about, and at none when it is about both. */
    for (const article of learnArticles) {
      expect(about(articleRoute(article)), article.slug).toEqual(
        article.product === "both"
          ? undefined
          : { "@id": `https://zoorik.com/${article.product}#software` },
      );
    }
    /* A glossary term too, by the product its page names. */
    for (const term of glossaryTerms) {
      expect(about(termRoute(term)), term.slug).toEqual(
        term.product === "both"
          ? undefined
          : { "@id": `https://zoorik.com/${term.product}#software` },
      );
    }
    for (const path of [
      "/",
      routes.assessment,
      routes.docs,
      routes.learn,
      routes.learnGlossary,
      routes.privacy,
      routes.docsContributing,
      routes.research,
    ]) {
      expect(about(path), path).toBeUndefined();
    }
  });

  it("makes the articles and the study TechArticles: their dates, their author, with their page's card", async () => {
    const articles = new Map<string, (typeof learnArticles)[number]>(
      learnArticles.map((article) => [articleRoute(article), article]),
    );
    const articlePaths = [
      ...articles.keys(),
      routes.caseStudyCoralDevCluster,
      routes.caseStudyAmoebaLabVms,
    ] as string[];
    for (const { path, url, lastModified } of listed) {
      const found = ofType(graphOf(path), "TechArticle");
      if (!articlePaths.includes(path)) {
        expect(found, path).toHaveLength(0);
        continue;
      }
      const [node] = found;
      const { metadata } = await pageModule(path);
      const card = (metadata?.openGraph?.images as readonly { url: string }[])[0]!;
      expect(node, path).toMatchObject({
        "@id": `${url}#article`,
        mainEntityOfPage: { "@id": `${url}#webpage` },
        dateModified: lastModified,
        publisher: orgRef,
        image: `https://zoorik.com${card.url}`,
      });
      expect(node!.about, path).toEqual(graphOf(path)[2]!.about);
      const article = articles.get(path);
      if (!article) continue;
      /* Published and updated as the article's file dates it; its card is the one its page shows. */
      expect(node, path).toMatchObject({
        headline: article.h1,
        datePublished: article.published,
        dateModified: article.updated,
        image: `https://zoorik.com${articleCard(article).url}`,
      });
      /* Zoorik, or the person it is published under: their LinkedIn profile where they have one, and Zoorik as
         their employer unless they are a guest. */
      const author = articleAuthor(article);
      expect(node!.author, path).toEqual(
        author
          ? {
              "@type": "Person",
              name: author.name,
              jobTitle: author.role,
              ...(author.linkedin ? { url: author.linkedin } : {}),
              ...(author.guest ? {} : { worksFor: orgRef }),
            }
          : orgRef,
      );
    }
    const [study] = ofType(graphOf(routes.caseStudyCoralDevCluster), "TechArticle");
    expect(study).toMatchObject({ datePublished: "2026-10-12", dateModified: "2026-10-12" });
    expect(caseStudy.band.date).toBe("12 October 2026");
    const [amoeba] = ofType(graphOf(routes.caseStudyAmoebaLabVms), "TechArticle");
    expect(amoeba).toMatchObject({
      headline: "How Amoeba rightsized our own lab VM’s btrfs pool by 25%",
      datePublished: "2026-10-19",
      dateModified: "2026-10-19",
      image: "https://zoorik.com/og/pages/value-lab-amoeba-lab-vms.png",
    });
    expect(orgRef).toEqual({ "@id": "https://zoorik.com/#organization" });
  });

  it("writes an article's author as a person: no employer for a guest, no address without a profile", async () => {
    const [base] = learnArticles;
    const guest = Object.entries(authors).find(([, author]) => author.guest && author.linkedin)!;
    const bare = Object.entries(authors).find(([, author]) => !author.linkedin)!;
    vi.resetModules();
    vi.doMock("@/content/learn/articles.generated", () => ({
      articleFiles: [guest, bare].map(([key]) => ({
        file: `by-${key}`,
        article: { ...base, slug: `by-${key}`, author: key },
      })),
    }));
    try {
      const { pageStructuredData: fresh } = await import("./structured-data");
      const authorOf = (key: string) =>
        ofType(fresh(learnPath(`by-${key}`))["@graph"] as readonly Node[], "TechArticle")[0]!
          .author;
      for (const [key, author] of [guest, bare]) {
        expect(authorOf(key), key).toEqual({
          "@type": "Person",
          name: author.name,
          jobTitle: author.role,
          ...(author.linkedin ? { url: author.linkedin } : {}),
          ...(author.guest ? {} : { worksFor: orgRef }),
        });
      }
      expect(authorOf(guest[0])).not.toHaveProperty("worksFor");
      expect(authorOf(bare[0])).not.toHaveProperty("url");
    } finally {
      vi.doUnmock("@/content/learn/articles.generated");
      vi.resetModules();
    }
  });

  it("makes each glossary term a DefinedTerm in the glossary's set, and the glossary's hub that set", () => {
    const hubUrl = "https://zoorik.com/learn/glossary";
    const set = {
      "@type": "DefinedTermSet",
      "@id": `${hubUrl}#terms`,
      name: "Cloud cost glossary",
      url: hubUrl,
    };
    expect(glossaryPage.hero.title).toBe(set.name);
    for (const term of glossaryTerms) {
      const url = `https://zoorik.com${termRoute(term)}`;
      const nodes = graphOf(termRoute(term));
      expect(ofType(nodes, "DefinedTermSet"), term.slug).toHaveLength(0);
      const [node, ...more] = ofType(nodes, "DefinedTerm");
      expect(more, term.slug).toHaveLength(0);
      expect(node, term.slug).toEqual({
        "@type": "DefinedTerm",
        "@id": `${url}#term`,
        name: termName(term),
        description: term.card,
        url,
        inDefinedTermSet: set,
        mainEntityOfPage: { "@id": `${url}#webpage` },
      });
      /* Its name is the term's words without the other names in brackets at its end ("Data transfer (egress) cost"
         keeps the bracket inside its name), and its description the definition's opening. */
      expect(node!.name, term.slug).not.toMatch(/\)\s*$/);
      expect(node!.description, term.slug).toMatch(/[.?!]$/);
    }
    const hub = graphOf(routes.learnGlossary);
    expect(hub.map((node) => node["@type"])).toEqual([
      "Organization",
      "WebSite",
      "CollectionPage",
      "BreadcrumbList",
      "DefinedTermSet",
    ]);
    expect(ofType(hub, "DefinedTermSet")[0]).toEqual({
      ...set,
      description: glossaryPage.meta.description,
      hasDefinedTerm: glossaryTerms.map((term) => ({
        "@type": "DefinedTerm",
        "@id": `https://zoorik.com${termRoute(term)}#term`,
        name: termName(term),
        url: `https://zoorik.com${termRoute(term)}`,
      })),
      mainEntityOfPage: { "@id": `${hubUrl}#webpage` },
    });
    /* No other page carries a term or a set. */
    for (const { path } of listed) {
      if (path === routes.learnGlossary || path.startsWith(`${routes.learnGlossary}/`)) continue;
      expect(ofType(graphOf(path), "DefinedTerm"), path).toHaveLength(0);
      expect(ofType(graphOf(path), "DefinedTermSet"), path).toHaveLength(0);
    }
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
