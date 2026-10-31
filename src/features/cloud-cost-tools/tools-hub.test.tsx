import { readFileSync } from "node:fs";

import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { comparePath, contactEmail, routes } from "@/config/site";
import { pageCards } from "@/config/social";
import { pageStructuredData } from "@/config/structured-data";
import {
  alternativesPages,
  cloudCostToolsLastUpdated,
  cloudCostToolsPage,
  versusPages,
  versusRoute,
} from "@/content/learn-compare";
import {
  marketActs,
  marketChecked,
  marketGroups,
  shownGroups,
  versusFacts,
} from "@/content/learn-market";
import { NoTool, ToolChips, ToolsFilter } from "@/features/cloud-cost-tools/tools-filter";
import { marketOurs, marketTool } from "@/features/learn/market-rows";

/* The nav and the footer read the pathname. */
vi.mock("next/navigation", () => ({ usePathname: () => "/cloud-cost-optimization-library" }));

import ToolsRoute, { metadata } from "@/app/cloud-cost-optimization-library/page";

/**
 * `/cloud-cost-optimization-library`, Cloud cost optimization tools: the metadata, the hero, the tools that reduce the
 * bill (the chips, each kind's tiles, Coral and Amoeba first in theirs, the note), Compare Coral and Amoeba (the live
 * versus pages and the alternatives pages) and the closing row; the chips as the mock's script behaves, everything
 * shown with scripting off, no logo of another company, nothing stored. Competitors' names are read from the market
 * data, never typed here. Its sitemap entry is in `src/app/sitemap.test.ts`, its page graph in
 * `src/config/structured-data.test.ts`, its old address's redirect in `src/config/hosts.test.ts`.
 */

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();

const page = () => render(<ToolsRoute />).container;

/** The tiles in view: neither a tile nor its group is `hidden`. */
const shown = (root: Element) =>
  [...root.querySelectorAll("#tools article.tl")].filter((tile) => !tile.closest("[hidden]"));

/** Each kind's tiles, as the page draws them: Coral or Amoeba first, then its tools in order. */
const expected = shownGroups.map((group) => ({
  ...group,
  tiles: [
    ...(group.ours ? [{ ours: marketOurs(group.ours.product), short: group.ours.short }] : []),
    ...group.tools.map((shownTool) => ({ tool: marketTool(shownTool.name), ...shownTool })),
  ],
}));

const tileCount = expected.reduce((sum, group) => sum + group.tiles.length, 0);

afterEach(() => {
  vi.restoreAllMocks();
});

describe("/cloud-cost-optimization-library's metadata", () => {
  it("is titled, described and canonicalised as its mock, with its own card", () => {
    expect(metadata.title).toBe("Cloud cost optimization tools");
    expect(metadata.description).toBe(
      "The tools that reduce the cloud bill on Azure and AWS: what each one does, how it works and which clouds it supports, checked on each company's own pages.",
    );
    expect(metadata.alternates).toEqual({ canonical: "/cloud-cost-optimization-library" });
    expect(metadata.openGraph).toMatchObject({
      url: "/cloud-cost-optimization-library",
      title: "Cloud cost optimization tools | Zoorik",
      images: [pageCards["/cloud-cost-optimization-library"]],
    });
    expect(routes.cloudCostTools).toBe("/cloud-cost-optimization-library");
    expect(cloudCostToolsLastUpdated).toBe("30 October 2026");
  });
});

describe("/cloud-cost-optimization-library", () => {
  it("opens on its name and its line, with no kicker", () => {
    const root = page();
    expect(root.querySelectorAll("h1")).toHaveLength(1);
    expect(root.querySelector("header.hero.doc-hero.lv-hero#top")).not.toBeNull();
    expect(text(root.querySelector("h1"))).toBe("Cloud cost optimization tools");
    expect(text(root.querySelector(".doc-deck"))).toBe(
      "The tools that reduce the cloud bill, how each one works and which clouds it supports.",
    );
    expect(root.querySelector(".vp-kick")).toBeNull();
    /* The mock has no search: the chips filter the tiles. */
    expect(root.querySelector("input")).toBeNull();
  });

  it("carries the page's structured data, then the sections in the mock's order and the closing row", () => {
    const root = page();
    const blocks = root.querySelectorAll('script[type="application/ld+json"]');
    expect(blocks).toHaveLength(1);
    expect(JSON.parse(blocks[0]!.textContent!)).toEqual(
      JSON.parse(JSON.stringify(pageStructuredData(routes.cloudCostTools))),
    );
    const sections = [...root.querySelectorAll("main > section")];
    expect(sections.map((s) => [s.id, s.className, text(s.querySelector("h2"))])).toEqual([
      ["tools", "sec lv-sec", "Tools that reduce cloud cost"],
      ["ours", "sec lv-sec sec-band", "Compare Coral and Amoeba"],
      ["calculators", "sec lv-sec", "Free calculators"],
      ["assess", "sec", "Find your own number"],
    ]);
    for (const id of ["tools", "ours", "calculators"]) {
      const section = root.querySelector(`#${id}`)!;
      expect(section).toHaveAttribute("aria-labelledby", `${id}-h`);
      expect(section.querySelector(".sec-hrow > h2")).toHaveAttribute("id", `${id}-h`);
      expect(section.querySelector(".sec-hrow p")).toBeNull();
    }
  });

  it("draws the kind and cloud chips, All and All clouds pressed", () => {
    const root = page();
    const groups = [...root.querySelectorAll("#tools .tl-wrap > .tl-f > .lv-chips")];
    expect(groups.map((g) => [g.getAttribute("role"), g.getAttribute("aria-label")])).toEqual([
      ["group", "Kind of tool"],
      ["group", "Cloud"],
    ]);
    const chips = (group: Element) =>
      [...group.querySelectorAll("button")].map((b) => [
        text(b),
        b.getAttribute("data-tk") ?? b.getAttribute("data-tc"),
        b.getAttribute("aria-pressed"),
        b.getAttribute("type"),
      ]);
    expect(chips(groups[0]!)).toEqual([
      ["All", "", "true", "button"],
      ["Kubernetes", "k8s", "false", "button"],
      ["Block storage", "storage", "false", "button"],
      ["FinOps", "finops", "false", "button"],
      ["Cloud providers", "cloud", "false", "button"],
    ]);
    expect(chips(groups[1]!)).toEqual([
      ["All clouds", "", "true", "button"],
      ["Azure", "azure", "false", "button"],
      ["AWS", "aws", "false", "button"],
    ]);
  });

  it("shows only tools that reduce the bill, by kind, each read from the market data", () => {
    const root = page();
    /* The four kinds, each from its market group, and the tools the mock shows: 26 tiles, Coral and Amoeba among
       them. */
    expect(shownGroups.map((g) => [g.kind, g.label, g.group, g.tools.length])).toEqual([
      ["k8s", "Kubernetes", "k8s", 9],
      ["storage", "Block storage", "storage", 4],
      ["finops", "FinOps", "finops", 6],
      ["cloud", "Cloud providers", "native", 5],
    ]);
    expect(tileCount).toBe(26);
    for (const group of shownGroups) {
      const from = marketGroups.find((g) => g.id === group.group)!;
      for (const tool of group.tools) expect(from.tools.map((t) => t.name)).toContain(tool.name);
    }
    const blocks = [...root.querySelectorAll("#tools .tl-wrap > .tl-g")];
    expect(
      blocks.map((b) => [b.getAttribute("data-k"), text(b.querySelector("h3.cm-sl"))]),
    ).toEqual(shownGroups.map((g) => [g.kind, g.label]));
    expect(root.querySelectorAll("#tools article.dt.tl")).toHaveLength(26);

    expected.forEach((group, g) => {
      const tiles = [...blocks[g]!.querySelectorAll(".dt-grid > article.dt.tl")];
      expect(tiles).toHaveLength(group.tiles.length);
      group.tiles.forEach((entry, i) => {
        const tile = tiles[i]!;
        const link = tile.querySelector("a.dt-a")!;
        const facts = "ours" in entry ? entry.ours! : entry.tool!;
        expect(tile).toHaveAttribute("data-k", group.kind);
        expect(tile).toHaveAttribute(
          "data-c",
          facts.clouds.map((cloud) => cloud.toLowerCase()).join(" "),
        );
        expect(text(tile.querySelector(".dt-l"))).toBe(entry.short);
        expect(tile.querySelector(".dt-l")).toHaveAttribute("title", facts.line);
        const acts = tile.querySelector(".tl-meta > .mk-acts")!;
        expect(text(acts)).toBe(marketActs[facts.acts].label);
        expect(acts).toHaveClass(
          {
            "changes infrastructure": "mk-auto",
            recommends: "mk-rec",
            reports: "mk-rep",
            mixed: "mk-mix",
          }[facts.acts],
        );
        /* The clouds: Azure, then AWS, each a named image; then Google Cloud in words where its pages name it. */
        const marks = [...tile.querySelectorAll(".tl-cl > svg")];
        expect(marks.map((m) => [m.getAttribute("role"), m.getAttribute("aria-label")])).toEqual(
          facts.clouds.map((cloud) => ["img", cloud]),
        );
        expect(marks.map((m) => m.getAttribute("class"))).toEqual(
          facts.clouds.map((cloud) => (cloud === "AWS" ? "aws" : null)),
        );
        expect(text(tile.querySelector(".tl-cl > small"))).toBe(
          "googleCloud" in entry && entry.googleCloud ? "+ Google Cloud" : "",
        );
        if ("ours" in entry) {
          /* Coral and Amoeba: first, with their marks, linking to their own pages. */
          expect(i).toBe(0);
          expect(text(tile.querySelector(".dt-t"))).toBe(entry.ours!.name);
          expect(tile.querySelector("svg.tl-ours")).toHaveAttribute("aria-hidden", "true");
          expect(tile.querySelector(".tl-mono")).toBeNull();
          expect(link).toHaveAttribute("href", entry.ours!.href);
          expect(link).not.toHaveAttribute("target");
          expect(link.querySelector(".sr-only")).toBeNull();
          expect(link.querySelector(".dt-go path")).toHaveAttribute("d", "M5 12h14M13 5l7 7-7 7");
        } else {
          /* Every other tool: its name without a long bracket, its initial in place of a logo, its own page in a
             new tab. */
          const name = text(tile.querySelector(".dt-t"));
          expect(entry.tool!.name.startsWith(name)).toBe(true);
          expect(name).toBe(
            entry.tool!.name.replace(/\s*\(([^)]*)\)$/, (whole, inside: string) =>
              inside.length <= 5 ? whole : "",
            ),
          );
          const mono = tile.querySelector(".tl-mono")!;
          expect(mono).toHaveAttribute("aria-hidden", "true");
          expect(text(mono)).toBe(name[0]);
          expect(tile.querySelector(".tl-ours")).toBeNull();
          expect(link).toHaveAttribute("href", entry.tool!.url);
          expect(link).toHaveAttribute("target", "_blank");
          expect(link).toHaveAttribute("rel", "noopener noreferrer");
          expect(text(link.querySelector(".sr-only"))).toBe("(opens in a new tab)");
          expect(link.querySelector(".dt-go path")).toHaveAttribute("d", "M7 17 17 7M8 7h9v9");
        }
      });
    });
    expect(
      expected.flatMap((group) => group.tiles.filter((entry) => "ours" in entry)),
    ).toHaveLength(2);
  });

  it("says Coral rebalances, never that it right-sizes, and Amoeba rightsizes", () => {
    const root = page();
    const [coral, amoeba] = [...root.querySelectorAll(".tl .tl-ours")].map((mark) =>
      mark.closest("a")!.querySelector(".dt-l")!,
    );
    for (const line of [text(coral!), coral!.getAttribute("title")!])
      expect(line).not.toMatch(/right-?siz/i);
    expect(text(coral!)).toMatch(/^Rebalances workloads/);
    expect(text(amoeba!)).toMatch(/^Rightsizes Azure managed disks and Amazon EBS/);
  });

  it("picks the tiles with the chips, as the mock's script, and hides a kind left with none", async () => {
    const user = userEvent.setup();
    const root = page();
    const kind = (k: string) => root.querySelector<HTMLButtonElement>(`[data-tk="${k}"]`)!;
    const cloud = (c: string) => root.querySelector<HTMLButtonElement>(`[data-tc="${c}"]`)!;
    const kinds = () =>
      [...root.querySelectorAll(".tl-g")]
        .filter((g) => !g.hasAttribute("hidden"))
        .map((g) => g.getAttribute("data-k"));
    expect(shown(root)).toHaveLength(26);

    await user.click(kind("storage"));
    expect(kinds()).toEqual(["storage"]);
    expect(shown(root)).toHaveLength(5);
    expect(kind("storage")).toHaveAttribute("aria-pressed", "true");
    expect(kind("")).toHaveAttribute("aria-pressed", "false");

    await user.click(cloud("azure"));
    expect(shown(root).map((t) => t.getAttribute("data-c"))).toEqual(
      expected[1]!.tiles
        .map((entry) => ("ours" in entry ? entry.ours! : entry.tool!).clouds)
        .filter((clouds) => clouds.includes("Azure"))
        .map((clouds) => clouds.map((c) => c.toLowerCase()).join(" ")),
    );
    expect(cloud("azure")).toHaveAttribute("aria-pressed", "true");

    await user.click(kind(""));
    const azure = expected.flatMap((group) =>
      group.tiles.filter((entry) =>
        ("ours" in entry ? entry.ours! : entry.tool!).clouds.includes("Azure"),
      ),
    );
    expect(shown(root)).toHaveLength(azure.length);
    expect(root.querySelector(".tl-none")).toHaveAttribute("hidden");

    await user.click(cloud(""));
    expect(shown(root)).toHaveLength(26);
    expect(kinds()).toEqual(["k8s", "storage", "finops", "cloud"]);
  });

  it("says when the chips leave no tile, and its button clears them", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ToolsFilter>
        <ToolChips
          kinds={{
            label: "Kind of tool",
            all: "All",
            each: [{ kind: "k8s", label: "Kubernetes" }],
          }}
          clouds={{ label: "Cloud", all: "All clouds", each: ["Azure", "AWS"] }}
        />
        <NoTool
          tiles={[{ kind: "k8s", clouds: ["AWS"] }]}
          line="No tool matches. "
          reset="Clear the filters"
        />
      </ToolsFilter>,
    );
    const none = container.querySelector(".tl-none")!;
    expect(none).toHaveAttribute("hidden");
    await user.click(container.querySelector<HTMLButtonElement>('[data-tc="azure"]')!);
    expect(none).not.toHaveAttribute("hidden");
    expect(text(none)).toBe("No tool matches. Clear the filters");
    await user.click(none.querySelector<HTMLButtonElement>("button.lv-reset")!);
    expect(none).toHaveAttribute("hidden");
    expect(container.querySelector('[data-tc=""]')).toHaveAttribute("aria-pressed", "true");
    expect(container.querySelector('[data-tk=""]')).toHaveAttribute("aria-pressed", "true");
  });

  it("draws every tile on the server, and the empty line hidden, so scripting off shows them all", () => {
    const html = renderToString(<ToolsRoute />);
    for (const group of expected)
      for (const entry of group.tiles)
        expect(html).toContain(`href="${"ours" in entry ? entry.ours!.href : entry.tool!.url}"`);
    expect(html).not.toMatch(/<article class="dt tl"[^>]*hidden/);
    expect(html).not.toMatch(/<div class="tl-g"[^>]*hidden/);
    expect(html).toMatch(
      /<p class="tl-none" hidden="">No tool matches\. <button type="button" class="lv-reset">Clear the filters<\/button><\/p>/,
    );
  });

  it("ends the tiles on the note: the checked day and the address", () => {
    const note = page().querySelector("#tools .tl-wrap > .mk-note")!;
    expect(text(note)).toBe(
      `Checked on each company’s own pages, ${marketChecked}. Names are their owners’ trademarks. Something changed? Write to ${contactEmail}.`,
    );
    expect(marketChecked).toBe("19 October 2026");
    expect(note.querySelector("a")).toHaveAttribute("href", `mailto:${contactEmail}`);
  });

  it("compares Coral and Amoeba in four tiles, two by two: the live versus pages, then the alternatives pages", () => {
    const root = page();
    const grid = root.querySelector("#ours .dt-grid")!;
    expect(grid).toHaveClass("dt-2x2", "tl-2x2");
    const tiles = [...grid.querySelectorAll(":scope > article.dt > a.dt-a")];
    expect(
      tiles.map((a) => [
        a.getAttribute("href"),
        text(a.querySelector(".dt-t")),
        text(a.querySelector(".dt-l")),
      ]),
    ).toEqual([
      ...versusPages.map((entry) => [versusRoute(entry), entry.meta.title, entry.line]),
      ...alternativesPages.map((entry) => [entry.route, entry.h1, entry.line]),
    ]);
    for (const tile of tiles) {
      expect(tile).not.toHaveAttribute("target");
      expect(tile.querySelector("svg.dt-ic")).toHaveAttribute("aria-hidden", "true");
    }
    /* Each versus tile names the tool it compares with. */
    versusPages.forEach((entry, i) =>
      expect(text(tiles[i]!.querySelector(".dt-t"))).toContain(
        versusFacts.find((facts) => facts.slug === entry.slug)!.name,
      ),
    );
  });

  it("links only the live versus pages under the tools hub, never a held one, and draws no logo", () => {
    const root = page();
    const hrefs = [...root.querySelectorAll("main a")].map((a) => a.getAttribute("href") ?? "");
    expect(hrefs.filter((href) => href.startsWith(`${comparePath}/`))).toEqual([
      ...versusPages.map(versusRoute),
      ...alternativesPages.map((entry) => entry.route),
    ]);
    expect(hrefs.some((href) => href.startsWith("/learn/compare"))).toBe(false);
    expect(root.querySelectorAll("main img")).toHaveLength(0);
  });

  it("stores nothing in the browser, whatever the reader does", async () => {
    const user = userEvent.setup();
    const calls: string[] = [];
    for (const method of ["getItem", "setItem", "removeItem", "clear", "key"] as const)
      vi.spyOn(Storage.prototype, method).mockImplementation((() => {
        calls.push(method);
        return null;
      }) as never);
    vi.spyOn(document, "cookie", "set").mockImplementation(() => calls.push("cookie"));
    const root = page();
    for (const chip of root.querySelectorAll<HTMLButtonElement>(".tl-f button"))
      await user.click(chip);
    expect(calls).toEqual([]);
    for (const file of [
      "src/features/cloud-cost-tools/tools-hub.tsx",
      "src/features/cloud-cost-tools/tools-filter.tsx",
    ]) {
      expect(readFileSync(file, "utf8")).not.toMatch(
        /localStorage|sessionStorage|indexedDB|document\.cookie/,
      );
    }
  });

  it("lists the two calculators under Free calculators, two by two, each one link at the site's root", () => {
    const grid = page().querySelector("#calculators .dt-grid")!;
    expect(grid).toHaveClass("dt-2x2", "tl-2x2");
    const tiles = [...grid.querySelectorAll(":scope > article.dt > a.dt-a")];
    expect(
      tiles.map((a) => [
        a.getAttribute("href"),
        text(a.querySelector(".dt-t")),
        text(a.querySelector(".dt-l")),
      ]),
    ).toEqual([
      [
        routes.eksAndAksPricingCalculator,
        "Kubernetes node cost calculator",
        "A node’s monthly list price on AKS or EKS, and how much of it your pods can use.",
      ],
      [
        routes.ebsAndAzureDiskPricing,
        "Disk cost calculator",
        "What an Azure managed disk or an EBS volume costs a month, and what its empty space costs.",
      ],
    ]);
    for (const tile of tiles) {
      expect(tile).not.toHaveAttribute("target");
      expect(tile.querySelector("svg.dt-ic")).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("ends with the site's closing row, for both products", () => {
    const row = page().querySelector("#assess")!;
    expect(row.querySelector('a[href="/assessment"]')).not.toBeNull();
    expect(text(row)).toContain("Thirty minutes with the people who build Coral and Amoeba.");
  });

  it("is the footer's Cloud cost optimization tools", () => {
    const link = page().querySelector(`footer a[href="${routes.cloudCostTools}"]`)!;
    expect(text(link)).toBe("Cloud cost optimization tools");
    expect(cloudCostToolsPage.hero.title).toBe("Cloud cost optimization tools");
  });
});
