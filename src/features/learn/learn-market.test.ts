import { describe, expect, it } from "vitest";

import { alternativesPages, versusPages } from "@/content/learn-compare";
import {
  alternativesFacts,
  marketChecked,
  marketGroups,
  versusFacts,
} from "@/content/learn-market";

import { marketOurs, marketTool } from "./market-rows";

/**
 * The market data (`src/content/learn-market.ts`, checked 19 October 2026; the two versus pages of 1 Nov 2026 checked
 * that day), which Cloud cost optimization tools and the comparison pages under /compare print: only what the pages
 * print, every claim about another tool with a source, the live versus pages and no more, and no SOC 2 row.
 */

const URL_ONLY = /^https:\/\/[^\s;]+$/;

describe("the market data", () => {
  it("was checked on 19 October 2026", () => {
    expect(marketChecked).toBe("19 October 2026");
  });

  it("holds the four groups in the map's order, named as the mock names them, ours first in its own", () => {
    expect(marketGroups.map((group) => [group.id, group.label, group.tools.length])).toEqual([
      ["k8s", "Kubernetes optimization", 22],
      ["storage", "Block storage optimization", 12],
      ["finops", "FinOps platforms", 23],
      ["native", "Cloud providers’ own tools", 9],
    ]);
    expect(marketOurs("coral")).toMatchObject({ name: "Coral by Zoorik", href: "/coral" });
    expect(marketOurs("amoeba")).toMatchObject({ name: "Amoeba by Zoorik", href: "/amoeba" });
  });

  it("gives every tool its own page and the pages it was checked against, and prints no other cloud", () => {
    const tools = marketGroups.flatMap((group) => group.tools);
    expect(new Set(tools.map((tool) => tool.name)).size).toBe(tools.length);
    for (const tool of tools) {
      expect(tool.url, tool.name).toMatch(URL_ONLY);
      expect(tool.sources.length, tool.name).toBeGreaterThan(0);
      for (const source of tool.sources) expect(source, tool.name).toMatch(URL_ONLY);
      expect(
        tool.clouds.every((cloud) => cloud === "Azure" || cloud === "AWS"),
        tool.name,
      ).toBe(true);
    }
  });

  it("carries none of the check's working fields", () => {
    const keys = new Set(
      marketGroups.flatMap((group) => group.tools.flatMap((tool) => Object.keys(tool))),
    );
    expect([...keys].sort()).toEqual(
      ["acts", "clouds", "company", "line", "name", "sources", "subgroup", "url"].sort(),
    );
  });

  it("has rows for the live versus pages only, each claim about the other tool with its sources", () => {
    expect(versusFacts.map((facts) => facts.slug)).toEqual(versusPages.map((page) => page.slug));
    for (const facts of versusFacts) {
      marketTool(facts.tool);
      expect(
        facts.rows.some((row) => /soc ?2/i.test(row.label)),
        facts.slug,
      ).toBe(false);
      for (const row of facts.rows) {
        expect(row.ours.sources, row.label).toEqual([]);
        expect(row.theirs.sources.length, row.label).toBeGreaterThan(0);
        for (const source of row.theirs.sources) expect(source, row.label).toMatch(URL_ONLY);
      }
      expect(facts.pricing.sources.length, facts.slug).toBeGreaterThan(0);
      for (const source of facts.pricing.sources) expect(source).toMatch(URL_ONLY);
    }
  });

  it("lists, for each alternatives page, tools the market holds and four questions", () => {
    expect(alternativesFacts.map((facts) => facts.product)).toEqual(
      alternativesPages.map((page) => page.product),
    );
    for (const facts of alternativesFacts) {
      for (const name of facts.tools) marketTool(name);
      expect(new Set(facts.tools).size).toBe(facts.tools.length);
      expect(facts.questions).toHaveLength(4);
    }
  });

  it("says Coral rebalances, never that it right-sizes: that is Amoeba's verb", () => {
    expect(marketOurs("coral").line).not.toMatch(/right-?siz/i);
    expect(marketOurs("coral").line).toMatch(/^Rebalances workloads,/);
    expect(marketOurs("amoeba").line).toMatch(/^Rightsizes block storage/);
  });
});
