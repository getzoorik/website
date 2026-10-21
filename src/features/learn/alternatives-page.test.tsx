import { render } from "@testing-library/react";
import type { Metadata } from "next";
import { describe, expect, it, vi } from "vitest";

import { routes } from "@/config/site";
import { socialImage } from "@/config/social";
import { pageStructuredData } from "@/config/structured-data";
import {
  alternativesPages,
  versusPages,
  versusRoute,
  type AlternativesPage,
} from "@/content/learn-compare";
import { alternativesFacts, marketActs, marketGroups, versusFacts } from "@/content/learn-market";
import { products } from "@/content/products";

/* The nav and the footer read the pathname. */
const pathname = vi.hoisted(() => ({
  current: "/cloud-cost-optimization-tools/coral-alternatives",
}));
vi.mock("next/navigation", async (original) => ({
  ...(await original<typeof import("next/navigation")>()),
  usePathname: () => pathname.current,
}));

import * as coralRoute from "@/app/cloud-cost-optimization-tools/coral-alternatives/page";
import * as amoebaRoute from "@/app/cloud-cost-optimization-tools/amoeba-alternatives/page";

import { marketTool } from "./market-rows";

/**
 * The two alternatives pages, under /compare: the hero with the checked day, four questions, then the options, our
 * product first, every tool from the market data in the page's order, linked to its own page, and the one live versus
 * page per product linked from its tool. Names are read from the data, never typed here.
 */

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();

const modules: Readonly<
  Record<string, { readonly metadata: Metadata; readonly default: () => React.JSX.Element }>
> = {
  [routes.compareCoralAlternatives]: coralRoute,
  [routes.compareAmoebaAlternatives]: amoebaRoute,
};

describe("the alternatives pages", () => {
  it("are one per product, Coral first", () => {
    expect(alternativesPages.map((entry) => [entry.route, entry.product])).toEqual([
      ["/cloud-cost-optimization-tools/coral-alternatives", "coral"],
      ["/cloud-cost-optimization-tools/amoeba-alternatives", "amoeba"],
    ]);
    expect(alternativesFacts.map((facts) => facts.product)).toEqual(["coral", "amoeba"]);
  });
});

describe.each(alternativesPages.map((entry) => [entry.route, entry] as const))(
  "%s",
  (route, entry: AlternativesPage) => {
    const routeModule = modules[route]!;
    const facts = alternativesFacts.find((f) => f.product === entry.product)!;
    const ours = products[entry.product].name;
    const page = (): HTMLElement => {
      pathname.current = route;
      return render(<routeModule.default />).container;
    };

    it("is titled, described and canonicalised as its mock, with the site's default card", () => {
      expect(routeModule.metadata.title).toBe(entry.meta.title);
      expect(routeModule.metadata.description).toBe(entry.meta.description);
      expect(routeModule.metadata.alternates).toEqual({ canonical: route });
      expect(routeModule.metadata.openGraph).toMatchObject({
        url: route,
        title: `Zoorik | ${entry.meta.title}`,
        images: [socialImage],
      });
    });

    it("draws the hero, the structured data, then the two sections and the closing row", () => {
      const root = page();
      expect(text(root.querySelector(".vp-kick"))).toBe("Alternatives · checked 19 October 2026");
      expect(text(root.querySelector("h1"))).toBe(entry.h1);
      expect(text(root.querySelector(".doc-deck"))).toBe(entry.meta.description);
      const blocks = root.querySelectorAll('script[type="application/ld+json"]');
      expect(blocks).toHaveLength(1);
      expect(JSON.parse(blocks[0]!.textContent!)).toEqual(
        JSON.parse(JSON.stringify(pageStructuredData(route))),
      );
      expect([...root.querySelectorAll("main > section")].map((s) => s.id)).toEqual([
        "choose",
        "options",
        "assess",
      ]);
    });

    it("asks the four questions, numbered", () => {
      const root = page();
      const cards = [...root.querySelectorAll(".ap-q > article")];
      expect(facts.questions).toHaveLength(4);
      expect(
        cards.map((card) => [
          text(card.querySelector(".ap-n")),
          text(card.querySelector("h3")),
          text(card.querySelector("p")),
        ]),
      ).toEqual(facts.questions.map((q, i) => [String(i + 1), q.q, q.a]));
    });

    it("lists our product first, then every tool in the page's order, each from the market data", () => {
      const root = page();
      const rows = [...root.querySelectorAll(".mk-list > li.mk-row")];
      expect(rows).toHaveLength(facts.tools.length + 1);
      const [mine, ...theirs] = rows;
      const group = marketGroups.find((g) => g.ours?.product === entry.product)!;
      expect(mine).toHaveClass("mk-ours");
      expect(mine!.querySelector("a.mk-l")).toHaveAttribute("href", `/${entry.product}`);
      expect(mine!.querySelector("a.mk-l")).not.toHaveAttribute("target");
      expect(text(mine!.querySelector("a.mk-l"))).toBe(group.ours!.name);
      expect(text(mine!.querySelector(".mk-w"))).toBe(group.ours!.line);
      theirs.forEach((row, index) => {
        const tool = marketTool(facts.tools[index]!);
        const link = row.querySelector("a.mk-l")!;
        expect(text(link)).toBe(`${tool.name} (opens in a new tab)`);
        expect(link).toHaveAttribute("href", tool.url);
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
        expect(text(row.querySelector(".mk-n small"))).toBe(tool.company);
        expect(text(row.querySelector(".mk-w"))).toBe(tool.line);
        expect(text(row.querySelector(".mk-acts"))).toBe(marketActs[tool.acts].label);
        expect(row.querySelector(".mk-acts")).toHaveClass(`mk-${marketActs[tool.acts].key}`);
        expect([...row.querySelectorAll(".mk-cl")].map(text)).toEqual(tool.clouds);
      });
      expect(root.querySelectorAll("main img")).toHaveLength(0);
    });

    it("links a tool to its versus page only where that page is live", () => {
      const root = page();
      const live = versusPages.filter((v) => v.product === entry.product);
      const links = [...root.querySelectorAll("a.ap-vs")];
      expect(links.map((a) => a.getAttribute("href"))).toEqual(live.map(versusRoute));
      for (const [index, a] of links.entries()) {
        expect(text(a)).toBe(`Compare with ${ours}`);
        const compared = versusFacts.find((f) => f.slug === live[index]!.slug)!.tool;
        expect(text(a.closest("li")!.querySelector("a.mk-l"))).toBe(
          `${compared} (opens in a new tab)`,
        );
      }
    });

    it("ends the list on the note: where the facts come from, the checked day and the address", () => {
      const root = page();
      const note = root.querySelector(".mk-note")!;
      expect(text(note)).toBe(
        "Names, owners and descriptions come from each company’s own pages, checked 19 October 2026. Names are their owners’ trademarks. Something changed? Write to founders@zoorik.com.",
      );
      expect(note.querySelector("a")).toHaveAttribute("href", "mailto:founders@zoorik.com");
    });
  },
);
