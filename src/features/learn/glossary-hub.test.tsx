import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { isLearnArticlePath, keepsHash, navState, routes } from "@/config/site";
import { pageCards } from "@/config/social";
import {
  glossaryHubGroups,
  glossaryPage,
  glossaryTerms,
  termName,
  termRoute,
} from "@/content/learn/glossary";
import { glossaryGroups } from "@/content/learn/glossary-term";
import { isoDay } from "@/lib/content-date";
import { learnToday } from "@/lib/learn-today";

/* The nav and the footer read the pathname. */
vi.mock("next/navigation", () => ({ usePathname: () => "/learn/glossary" }));

import GlossaryRoute, { metadata } from "@/app/learn/glossary/page";

/**
 * `/learn/glossary`, the glossary's hub, in the Learn hub's own parts: the metadata and its card, the hero with its link
 * back to /learn, the three groups in the glossary's order, each term a tile with its h1 over its definition's first
 * sentence, A–Z by the term's name, and the closing row for both products. Every tile and count is read from the
 * glossary index. Its link from /learn is in `learn-hub.test.tsx`; its sitemap entry and structured data are in
 * `src/app/sitemap.test.ts` and `src/config/structured-data.test.ts`.
 */

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();

/** Words as `text` reads them: a no-break space reads as a space. */
const words = (value: string): string => value.replace(/[\s ]+/g, " ").trim();

const page = () => render(<GlossaryRoute />).container;

describe("/learn/glossary's metadata", () => {
  it("titles it Glossary through the template, describes and canonicalises it, with its own card", () => {
    expect(metadata.title).toBe("Glossary");
    expect(metadata.description).toBe(glossaryPage.meta.description);
    expect(metadata.description!.length).toBeGreaterThanOrEqual(140);
    expect(metadata.description!.length).toBeLessThanOrEqual(158);
    expect(metadata.alternates).toEqual({ canonical: "/learn/glossary" });
    expect(metadata).not.toHaveProperty("robots");
    expect(metadata.openGraph).toMatchObject({
      url: "/learn/glossary",
      title: "Glossary | Zoorik",
      images: [pageCards["/learn/glossary"]],
    });
    expect(pageCards["/learn/glossary"]!.url).toBe("/og/pages/glossary.png");
    /* The sitemap's date for the hub: a printed day, not ahead of today. */
    expect(isoDay(glossaryPage.updated) <= learnToday()).toBe(true);
  });
});

describe("/learn/glossary", () => {
  it("has one h1 under its link back to /learn, then its line", () => {
    const root = page();
    expect([...root.querySelectorAll("h1")].map(text)).toEqual(["Cloud cost glossary"]);
    const hero = root.querySelector("header.hero.doc-hero.lv-hero#top")!;
    const kicker = hero.querySelector("p.vp-kick")!;
    expect(kicker.nextElementSibling!.tagName).toBe("H1");
    expect([...kicker.querySelectorAll("a")].map((a) => [text(a), a.getAttribute("href")])).toEqual(
      [["Learn", "/learn"]],
    );
    /* `gl-kl` names no rule but keeps the link out of the site's plain-link rules (white, underlined): it rests at the
       kicker's colour. */
    expect(kicker.querySelector("a")).toHaveAttribute("class", "gl-kl");
    expect(text(hero.querySelector(".doc-deck"))).toBe(glossaryPage.hero.deck);
  });

  it("files the terms under Kubernetes, Block storage, and FinOps and pricing, each with its count", () => {
    const root = page();
    const sections = [...root.querySelectorAll("main > section.sec.lr-sec")];
    expect(sections.map((section) => section.id)).toEqual([
      "kubernetes",
      "block-storage",
      "finops-pricing",
    ]);
    expect(glossaryGroups.map((group) => group.title)).toEqual([
      "Kubernetes",
      "Block storage",
      "FinOps and pricing",
    ]);
    sections.forEach((section, index) => {
      const group = glossaryHubGroups[index]!;
      expect(section).toHaveAttribute("aria-labelledby", `${group.id}-h`);
      expect(text(section.querySelector(`.sec-hrow h2#${group.id}-h`))).toBe(group.title);
      expect(text(section.querySelector(".sec-hrow p"))).toBe(`${group.terms.length} terms`);
    });
  });

  it("draws each term once as a tile, its h1 over its definition's first sentence, A–Z by its name", () => {
    const root = page();
    const drawn = glossaryHubGroups.map((group) =>
      [...root.querySelectorAll(`section#${group.id} .dt-grid > article.dt > a.dt-a`)].map((a) => [
        a.getAttribute("href"),
        text(a.querySelector(".dt-t")),
        text(a.querySelector(".dt-l")),
      ]),
    );
    expect(drawn).toEqual(
      glossaryHubGroups.map((group) =>
        group.terms.map((term) => [termRoute(term), words(term.h1), words(term.card)]),
      ),
    );
    for (const group of glossaryHubGroups) {
      const names = group.terms.map(termName);
      expect(names).toEqual(
        [...names].sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" })),
      );
    }
    expect(
      drawn
        .flat()
        .map(([href]) => href)
        .sort(),
    ).toEqual(glossaryTerms.map(termRoute).sort());
  });

  it("ends on the closing row for both products", () => {
    const row = page().querySelector("section#assess")!;
    expect(row.querySelector("a.btn-ink")).toHaveAttribute("href", "/assessment");
  });

  it("marks Docs in the header, as Learn's pages do; a term keeps its hash, and the hub is no article", () => {
    const term = termRoute(glossaryTerms[0]!);
    expect(navState(routes.learnGlossary)).toEqual({ current: "docs" });
    expect(navState(term)).toEqual({ current: "docs" });
    expect(isLearnArticlePath(routes.learnGlossary)).toBe(false);
    expect(keepsHash(term)).toBe(true);
    expect(keepsHash(routes.learnGlossary)).toBe(false);
  });
});
