import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";

import { describe, expect, it, vi } from "vitest";

import { amoebaDocs, learnPath, routes, site } from "@/config/site";
import { homeLastUpdated } from "@/content/hero";
import { learnPage } from "@/content/learn";
import { learnArticles } from "@/content/learn/published";
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
  it("lists the home page, the product pages, the assessment, the documents, the install and contributing guides, open source, Learn and every article in its index, Learn's comparison pages, the case studies, /events, /about, /careers, /brand-assets, /referrals, /partners, /design-partners, the privacy policy, the terms and security, absolute, and nothing else", () => {
    expect(sitemap().map((entry) => entry.url)).toEqual([
      `${site.url}/`,
      `${site.url}/coral`,
      `${site.url}/amoeba`,
      `${site.url}/assessment`,
      `${site.url}/marketplaces`,
      `${site.url}/docs`,
      `${site.url}/coral/guide`,
      `${site.url}/coral/faq`,
      ...(amoebaDocs ? [`${site.url}/amoeba/guide`, `${site.url}/amoeba/faq`] : []),
      `${site.url}/docs/install-coral-with-helm`,
      `${site.url}/docs/install-coral-with-terraform`,
      `${site.url}/docs/contributing`,
      `${site.url}/open-source`,
      `${site.url}/learn`,
      /* Every article in the Learn index, A–Z by slug. */
      ...learnArticles.map((article) => `${site.url}${learnPath(article.slug)}`),
      `${site.url}/compare`,
      `${site.url}/compare/coral-alternatives`,
      `${site.url}/compare/amoeba-alternatives`,
      /* The live versus pages, read from their data: no test spells a competitor's name. */
      ...versusPages.map((page) => `${site.url}${versusRoute(page)}`),
      `${site.url}/value-lab`,
      `${site.url}/case-studies/coral-dev-cluster`,
      `${site.url}/events`,
      `${site.url}/news`,
      `${site.url}/community`,
      `${site.url}/about`,
      `${site.url}/careers`,
      `${site.url}/brand-assets`,
      `${site.url}/referrals`,
      `${site.url}/partners`,
      `${site.url}/design-partners`,
      `${site.url}/privacy`,
      `${site.url}/terms`,
      `${site.url}/security`,
    ]);
  });

  it("dates each page by the day it prints, and prints no frequency or priority", () => {
    const dates = Object.fromEntries(
      sitemap().map((entry) => [new URL(entry.url).pathname, entry.lastModified]),
    );
    const updated = "2026-10-09";
    expect(dates).toEqual({
      /* The page descriptions in the current product words. */
      "/": "2026-10-20",
      "/coral": "2026-10-17",
      "/amoeba": "2026-10-20",
      "/assessment": "2026-10-18",
      /* Where to find Zoorik: the day it was published. */
      "/marketplaces": "2026-10-20",
      /* The install guides' tiles and the Open source group. */
      "/docs": "2026-10-16",
      "/coral/guide": updated,
      "/coral/faq": updated,
      /* The Amoeba FAQ's assessment answer names the PDF report. */
      ...(amoebaDocs ? { "/amoeba/guide": updated, "/amoeba/faq": "2026-10-19" } : {}),
      /* The three guides print "Updated 16 October 2026"; /open-source gives its content file's date. */
      "/docs/install-coral-with-helm": "2026-10-16",
      "/docs/install-coral-with-terraform": "2026-10-16",
      "/docs/contributing": "2026-10-16",
      "/open-source": "2026-10-20",
      /* The hub: its own day or its newest article's, whichever is later. Each article: the day it last changed. */
      "/learn": learnArticles.reduce(
        (day, article) => (article.updated > day ? article.updated : day),
        isoDay(learnPage.updated),
      ),
      ...Object.fromEntries(
        learnArticles.map((article) => [learnPath(article.slug), article.updated]),
      ),
      /* The comparison pages: the day they were checked and published. */
      "/compare": "2026-10-19",
      "/compare/coral-alternatives": "2026-10-19",
      "/compare/amoeba-alternatives": "2026-10-19",
      ...Object.fromEntries(versusPages.map((page) => [versusRoute(page), "2026-10-19"])),
      "/value-lab": "2026-10-20",
      "/case-studies/coral-dev-cluster": "2026-10-12",
      "/events": "2026-10-19",
      /* Zoorik News: the week of its latest Radar. */
      "/news": "2026-10-19",
      /* Zoorik Community: the day it was published. */
      "/community": "2026-10-20",
      /* Milestones and Zoorik on the web. */
      "/about": "2026-10-20",
      /* The day its content last changed (the LinkedIn button), not the day it was published. */
      "/careers": "2026-10-19",
      /* The company pages: the day they were published. */
      "/brand-assets": "2026-10-19",
      "/referrals": "2026-10-19",
      "/partners": "2026-10-19",
      "/design-partners": "2026-10-19",
      "/privacy": "2026-10-19",
      "/terms": "2026-10-06",
      "/security": updated,
    });
    for (const entry of sitemap()) {
      expect(Object.keys(entry).filter((key) => key !== "lastModified")).toEqual(["url"]);
    }
  });

  it("dates the home page by its content file, homeLastUpdated, and by nothing else", () => {
    const home = sitemap().find((entry) => new URL(entry.url).pathname === "/")!;
    expect(home.lastModified).toBe(isoDay(homeLastUpdated));
    expect(homeLastUpdated).toBe("20 October 2026");
  });

  it("dates every page it lists, and none in the future", () => {
    /* The page's own printed date, or its content file's `lastUpdated`: a page
       without one is never told to recrawl. */
    const entries = sitemap();
    expect(entries).toHaveLength((amoebaDocs ? 34 : 32) + learnArticles.length);
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
    const held: string[] = amoebaDocs ? [] : [routes.amoebaGuide, routes.amoebaFaq];
    /* A dynamic route stands for the pages it prerenders: /compare/[slug] for the live versus pages, /learn/[slug]
       for every article in the Learn index. */
    const pages = (route: string) =>
      route === `${routes.compare}/[slug]`
        ? versusPages.map(versusRoute)
        : route === `${routes.learn}/[slug]`
          ? learnArticles.map((article) => learnPath(article.slug))
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
