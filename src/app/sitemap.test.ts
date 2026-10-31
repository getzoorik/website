import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";

import { describe, expect, it, vi } from "vitest";

import { amoebaDocs, comparePath, glossaryPath, learnPath, routes, site } from "@/config/site";
import { homeLastUpdated } from "@/content/hero";
import { learnPage } from "@/content/learn";
import { glossaryPage, glossaryTerms } from "@/content/learn/glossary";
import { articleRoute, learnArticles } from "@/content/learn/published";
import { versusPages, versusRoute } from "@/content/learn-compare";
import { isoDay } from "@/lib/content-date";
import { learnToday } from "@/lib/learn-today";

import sitemap from "./sitemap";

/** Every page.tsx under src/app, as its route (a dynamic one with its bracketed segment, as its folder names it). */
function pageRoutes(dir = "src/app", base = ""): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return pageRoutes(path, `${base}/${name}`);
    return name === "page.tsx" ? [base === "" ? "/" : base] : [];
  });
}

/** Every source module a file loads, following its "@/…" and "./…" imports. */
function importGraph(file: string, seen = new Set<string>()): Set<string> {
  if (seen.has(file)) return seen;
  seen.add(file);
  for (const [, spec] of readFileSync(file, "utf8").matchAll(/^import [^;]*? from "([^"]+)";/gm)) {
    const base = spec!.startsWith("@/")
      ? join("src", spec!.slice(2))
      : spec!.startsWith(".")
        ? join(dirname(file), spec!)
        : null;
    const found = base && [".ts", ".tsx"].map((ext) => base + ext).find(existsSync);
    if (found) importGraph(found, seen);
  }
  return seen;
}

describe("sitemap.xml", () => {
  it("lists the home page, the product pages, each product on each cloud, the six works-with pages, the assessment, the documents, the install and contributing guides, the troubleshooting pages, open source, Learn and every article in its index, the glossary and every term in its index, Cloud cost optimization tools with the comparison pages and the two calculators, Value Lab and the two case studies, the research papers, /events, /pricing, /contact, /about, /careers, /brand-assets, /referrals, /partners, /design-partners, the privacy policy, the terms, security and the Trust center, absolute, and nothing else", () => {
    expect(sitemap().map((entry) => entry.url)).toEqual([
      `${site.url}/`,
      `${site.url}/coral`,
      `${site.url}/amoeba`,
      /* Each product on each cloud, in the footer's order, then the six pages on what Coral works with. */
      `${site.url}/aks-cost-optimization`,
      `${site.url}/eks-cost-optimization`,
      `${site.url}/azure-managed-disk-cost-optimization`,
      `${site.url}/ebs-cost-optimization`,
      `${site.url}/coral-works-with-cluster-autoscaler`,
      `${site.url}/coral-works-with-karpenter`,
      `${site.url}/coral-works-with-aks-node-auto-provisioning`,
      `${site.url}/coral-works-with-keda`,
      `${site.url}/coral-works-with-helm`,
      `${site.url}/coral-works-with-terraform`,
      `${site.url}/assessment`,
      `${site.url}/marketplaces`,
      `${site.url}/docs`,
      `${site.url}/coral-guide`,
      `${site.url}/coral-faq`,
      ...(amoebaDocs ? [`${site.url}/amoeba-guide`, `${site.url}/amoeba-faq`] : []),
      `${site.url}/docs/install-coral-with-helm`,
      `${site.url}/docs/install-coral-with-terraform`,
      `${site.url}/docs/contributing`,
      `${site.url}/coral-troubleshooting`,
      /* Amoeba's is held with its guide and FAQ. */
      ...(amoebaDocs ? [`${site.url}/amoeba-troubleshooting`] : []),
      `${site.url}/open-source`,
      `${site.url}/learn`,
      /* Every article in the Learn index, A–Z by slug, each at its own address: the two pillars at the root. */
      ...learnArticles.map((article) => `${site.url}${articleRoute(article)}`),
      `${site.url}/learn/glossary`,
      /* Every term in the glossary index, A–Z by slug. */
      ...glossaryTerms.map((term) => `${site.url}${glossaryPath(term.slug)}`),
      `${site.url}/cloud-cost-optimization-library`,
      `${site.url}/cloud-cost-optimization-library/coral-alternatives`,
      `${site.url}/cloud-cost-optimization-library/amoeba-alternatives`,
      /* The live versus pages, read from their data: no test spells a competitor's name. */
      ...versusPages.map((page) => `${site.url}${versusRoute(page)}`),
      /* The two calculators, at the root, linked from Cloud cost optimization tools. */
      `${site.url}/eks-and-aks-pricing-calculator`,
      `${site.url}/ebs-and-azure-disk-pricing`,
      `${site.url}/value-lab`,
      `${site.url}/coral-value-lab`,
      `${site.url}/amoeba-value-lab`,
      `${site.url}/cloud-cost-optimization-research-papers`,
      `${site.url}/events`,
      `${site.url}/news`,
      `${site.url}/community`,
      `${site.url}/pricing`,
      `${site.url}/contact`,
      `${site.url}/about`,
      `${site.url}/careers`,
      `${site.url}/brand-assets`,
      `${site.url}/referrals`,
      `${site.url}/partners`,
      `${site.url}/design-partners`,
      `${site.url}/privacy`,
      `${site.url}/terms`,
      `${site.url}/security`,
      `${site.url}/trust`,
    ]);
  });

  it("dates each page by the day it prints, and prints no frequency or priority", () => {
    const dates = Object.fromEntries(
      sitemap().map((entry) => [new URL(entry.url).pathname, entry.lastModified]),
    );
    expect(dates).toEqual({
      /* A page that prints no day: the day its content last changed (the company sentence and the titles,
         1 Nov 2026). */
      "/": "2026-11-01",
      "/coral": "2026-11-01",
      "/amoeba": "2026-11-01",
      /* The ten pages of 31 Oct 2026 print no day: the day their content was written. */
      "/aks-cost-optimization": "2026-10-31",
      "/eks-cost-optimization": "2026-10-31",
      "/azure-managed-disk-cost-optimization": "2026-10-31",
      "/ebs-cost-optimization": "2026-10-31",
      "/coral-works-with-cluster-autoscaler": "2026-10-31",
      "/coral-works-with-karpenter": "2026-10-31",
      "/coral-works-with-aks-node-auto-provisioning": "2026-10-31",
      "/coral-works-with-keda": "2026-10-31",
      "/coral-works-with-helm": "2026-10-31",
      "/coral-works-with-terraform": "2026-10-31",
      "/assessment": "2026-11-01",
      "/marketplaces": "2026-10-21",
      /* The guide PDF's new page count (30 Oct 2026). */
      "/docs": "2026-10-30",
      /* The Custom policies steps of 30 Oct 2026. */
      "/coral-guide": "2026-10-30",
      /* The four questions of 25 Oct 2026. */
      "/coral-faq": "2026-10-25",
      /* The Amoeba guide and FAQ, rewritten at product level on 27 Oct 2026. */
      ...(amoebaDocs ? { "/amoeba-guide": "2026-10-27", "/amoeba-faq": "2026-10-27" } : {}),
      /* The three guides print "Updated 16 October 2026"; /open-source gives its content file's date. */
      "/docs/install-coral-with-helm": "2026-10-16",
      "/docs/install-coral-with-terraform": "2026-10-16",
      "/docs/contributing": "2026-10-16",
      /* The two troubleshooting pages print "Updated 29 October 2026". */
      "/coral-troubleshooting": "2026-10-29",
      ...(amoebaDocs ? { "/amoeba-troubleshooting": "2026-10-29" } : {}),
      "/open-source": "2026-10-21",
      /* The hub: its own day or its newest article's, whichever is later. Each article: the day it last changed. */
      "/learn": learnArticles.reduce(
        (day, article) => (article.updated > day ? article.updated : day),
        isoDay(learnPage.updated),
      ),
      ...Object.fromEntries(
        learnArticles.map((article) => [articleRoute(article), article.updated]),
      ),
      /* The glossary's hub: its own day or its newest term's, whichever is later. Each term: the day it last
         changed. */
      "/learn/glossary": glossaryTerms.reduce(
        (day, term) => (term.updated > day ? term.updated : day),
        isoDay(glossaryPage.updated),
      ),
      ...Object.fromEntries(glossaryTerms.map((term) => [glossaryPath(term.slug), term.updated])),
      /* Cloud cost optimization tools: the day its content last changed (its Free calculators, 30 Oct 2026). */
      "/cloud-cost-optimization-library": "2026-10-30",
      /* The comparison pages: the day the versus pages were checked and published, and the day the
         alternatives pages were retitled (1 Nov 2026). */
      "/cloud-cost-optimization-library/coral-alternatives": "2026-11-01",
      "/cloud-cost-optimization-library/amoeba-alternatives": "2026-11-01",
      ...Object.fromEntries(versusPages.map((page) => [versusRoute(page), "2026-10-19"])),
      /* The two calculators: the day their prices were read, which they print. */
      "/eks-and-aks-pricing-calculator": "2026-10-30",
      "/ebs-and-azure-disk-pricing": "2026-10-30",
      /* Value Lab: the Amoeba study's card beside the Coral one (29 Oct 2026). Each study: the day it prints. */
      "/value-lab": "2026-10-29",
      "/coral-value-lab": "2026-10-12",
      "/amoeba-value-lab": "2026-10-19",
      /* The research papers print no day: the day their content last changed. */
      "/cloud-cost-optimization-research-papers": "2026-11-01",
      "/events": "2026-11-01",
      /* Zoorik News: the week of its latest Radar. */
      "/news": "2026-10-19",
      "/community": "2026-10-21",
      /* /pricing and /contact print no day: the day their content last changed. */
      "/pricing": "2026-10-30",
      "/contact": "2026-10-30",
      "/about": "2026-10-29",
      "/careers": "2026-10-25",
      "/brand-assets": "2026-10-21",
      "/referrals": "2026-10-21",
      "/partners": "2026-10-21",
      "/design-partners": "2026-10-21",
      "/privacy": "2026-10-19",
      "/terms": "2026-10-06",
      /* /security prints "Updated 30 October 2026": the Trust center's link in Report a security issue. */
      "/security": "2026-10-30",
      /* The Trust center prints "Updated 30 October 2026". */
      "/trust": "2026-10-30",
    });
    for (const entry of sitemap()) {
      expect(Object.keys(entry).filter((key) => key !== "lastModified")).toEqual(["url"]);
    }
  });

  it("dates the home page by its content file, homeLastUpdated, and by nothing else", () => {
    const home = sitemap().find((entry) => new URL(entry.url).pathname === "/")!;
    expect(home.lastModified).toBe(isoDay(homeLastUpdated));
    expect(homeLastUpdated).toBe("1 November 2026");
  });

  it("dates every page it lists, and none in the future", () => {
    /* The page's own printed date, or its content file's `lastUpdated`: a page
       without one is never told to recrawl. */
    const entries = sitemap();
    expect(entries).toHaveLength(
      (amoebaDocs ? 54 : 51) + learnArticles.length + glossaryTerms.length,
    );
    /* Today is `LEARN_TODAY` when set (articles dated ahead, checked as of the day they go live), else the latest
       calendar day anywhere on Earth (UTC+14), so a date set to today in any time zone is not "the future". */
    const latestToday = learnToday();
    for (const entry of entries) {
      expect(entry.lastModified, entry.url).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(String(entry.lastModified) <= latestToday, entry.url).toBe(true);
    }
  });

  it("never dates a page by the build: the same dates on any day, none of them that day", () => {
    const at = (day: string) => {
      vi.useFakeTimers({ now: new Date(`${day}T09:30:00Z`) });
      try {
        return sitemap();
      } finally {
        vi.useRealTimers();
      }
    };
    const one = at("2031-03-04");
    expect(at("2029-11-20")).toEqual(one);
    for (const entry of one) expect(entry.lastModified, entry.url).not.toBe("2031-03-04");
    expect(readFileSync("src/app/sitemap.ts", "utf8")).not.toMatch(/new Date|Date\.now/);
  });

  it("covers every page that is not noindex, and none that is held", () => {
    const listed = sitemap().map((entry) => new URL(entry.url).pathname);
    /* A held page answers 404 (`amoebaDocs`). */
    const held: string[] = amoebaDocs
      ? []
      : [routes.amoebaGuide, routes.amoebaFaq, routes.amoebaTroubleshooting];
    /* A dynamic route stands for the pages it prerenders: /cloud-cost-optimization-library/[slug] for the live versus pages, /learn/[slug]
       for every article in the Learn index but the two at the root (pages of their own), /learn/glossary/[slug] for
       every term in the glossary index. */
    const pages = (route: string) =>
      route === `${comparePath}/[slug]`
        ? versusPages.map(versusRoute)
        : route === `${routes.learn}/[slug]`
          ? learnArticles
              .filter((article) => article.route === undefined)
              .map((article) => learnPath(article.slug))
          : route === `${routes.learnGlossary}/[slug]`
            ? glossaryTerms.map((term) => glossaryPath(term.slug))
            : [route];
    for (const folder of pageRoutes()) {
      const source = readFileSync(`src/app${folder === "/" ? "" : folder}/page.tsx`, "utf8");
      const noindex = /robots:\s*\{\s*index:\s*false/.test(source);
      for (const route of pages(folder)) {
        if (held.includes(route)) expect(listed, route).not.toContain(route);
        else expect(listed.includes(route) || noindex, route).toBe(true);
      }
    }
  });

  it("lists no held page", () => {
    const listed = sitemap().map((entry) => new URL(entry.url).pathname);
    expect(listed.includes(routes.amoebaFaq)).toBe(amoebaDocs);
  });

  it("reads no file when it runs: the Worker answers /sitemap.xml itself, and has no files", () => {
    const graph = importGraph("src/app/sitemap.ts");
    expect(graph.size).toBeGreaterThan(5);
    for (const file of graph) {
      expect(readFileSync(file, "utf8"), file).not.toMatch(/node:fs|readFileSync/);
    }
  });

  it("uses the canonical host next.config redirects to", () => {
    const config = readFileSync("next.config.ts", "utf8");
    const host = /const CANONICAL_HOST = "([^"]+)"/.exec(config)?.[1];
    expect(site.url).toBe(`https://${host}`);
  });
});
