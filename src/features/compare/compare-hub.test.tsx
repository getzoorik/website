import { readFileSync } from "node:fs";

import { fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { contactEmail, routes } from "@/config/site";
import { socialImage } from "@/config/social";
import { pageStructuredData } from "@/config/structured-data";
import { learnProductSubject, learnSubjects } from "@/content/learn";
import {
  alternativesPages,
  compareHubPage,
  versusPages,
  versusRoute,
} from "@/content/learn-compare";
import { marketChecked, marketGroups, versusFacts } from "@/content/learn-market";
import { products } from "@/content/products";

/* The nav and the footer read the pathname. */
vi.mock("next/navigation", () => ({ usePathname: () => "/compare" }));

import CompareRoute, { metadata } from "@/app/compare/page";

/**
 * `/compare`, the comparison hub: the metadata, the hero, Tools in
 * the market (four tabs, every tool from the market data, Coral and Amoeba first in their groups, the checked day),
 * then Compare Coral and Amoeba (the two live versus pages and the two alternatives pages), then the closing
 * row; no held versus page linked, no logo, nothing stored. Competitors' names are read from the market data, never
 * typed here. Its sitemap entry is in `src/app/sitemap.test.ts`, its page graph in
 * `src/config/structured-data.test.ts`.
 */

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();

/** Whether an element is in view: neither it nor anything around it is `hidden`. */
const shown = (el: Element): boolean => !el.closest("[hidden]");

const page = () => render(<CompareRoute />).container;

afterEach(() => {
  vi.restoreAllMocks();
});

describe("/compare", () => {
  it("is titled, described and canonicalised as its mock, with the site's default card", () => {
    expect(metadata.title).toBe(
      "Cloud cost optimization tools: Kubernetes, block storage and FinOps",
    );
    expect(metadata.description).toBe(
      "Every kind of tool that touches the cloud bill, by name: what each one does, how it acts and where it runs, checked on each company's own pages.",
    );
    expect(metadata.alternates).toEqual({ canonical: routes.compare });
    expect(metadata.openGraph).toMatchObject({
      url: routes.compare,
      title: `${compareHubPage.meta.title} · Zoorik`,
      images: [socialImage],
    });
  });

  it("draws the hero with the day the market was checked, and no kicker", () => {
    const root = page();
    expect(root.querySelectorAll("h1")).toHaveLength(1);
    expect(text(root.querySelector("h1"))).toBe("Cloud cost optimization tools");
    expect(text(root.querySelector(".doc-deck"))).toBe(
      "Every kind of tool that touches the cloud bill, by name: what each one does, whether it acts on its own, recommends or reports, and where it runs. Checked on each company’s own pages, 19 October 2026.",
    );
    expect(marketChecked).toBe("19 October 2026");
    expect(root.querySelector(".vp-kick")).toBeNull();
    expect(root.querySelector("header.hero.doc-hero.lv-hero#top")).not.toBeNull();
  });

  it("carries the page's structured data, then the sections in the mock's order and the closing row", () => {
    const root = page();
    const blocks = root.querySelectorAll('script[type="application/ld+json"]');
    expect(blocks).toHaveLength(1);
    expect(JSON.parse(blocks[0]!.textContent!)).toEqual(
      JSON.parse(JSON.stringify(pageStructuredData(routes.compare))),
    );
    const sections = [...root.querySelectorAll("main > section")];
    expect(sections.map((s) => [s.id, s.className, text(s.querySelector("h2"))])).toEqual([
      ["tools", "sec lv-sec", "Tools in the market"],
      ["ours", "sec lv-sec sec-band", "Compare Coral and Amoeba"],
      ["assess", "sec", "Find your own number"],
    ]);
    expect(text(root.querySelector("#tools .lv-head p"))).toBe(
      "Four groups. Coral and Amoeba are marked in theirs.",
    );
    expect(text(root.querySelector("#ours .lv-head p"))).toBe(
      "Side by side with a tool you may be considering, and every alternative in one list.",
    );
    expect(root.querySelector("#tools")).toHaveAttribute("aria-labelledby", "tools-h");
    expect(root.querySelector("#ours")).toHaveAttribute("aria-labelledby", "ours-h");
  });

  it("lists the market's tools in four tabs, Coral and Amoeba first in their groups, as the mock's tabs behave", async () => {
    const user = userEvent.setup();
    const root = page();
    const tabs = [...root.querySelectorAll<HTMLButtonElement>(".mk-tabs button")];
    expect(root.querySelector(".mk-tabs")).toHaveAttribute("aria-label", "Kinds of tool");
    expect(root.querySelector(".mk-tabs")).toHaveAttribute("role", "tablist");
    expect(tabs.map((b) => [text(b.querySelector("b")), text(b.querySelector("small"))])).toEqual(
      marketGroups.map((group) => [group.label, `${group.tools.length} tools`]),
    );
    /* The groups as the mock names them. */
    expect(marketGroups.map((group) => [group.id, group.label, group.tools.length])).toEqual([
      ["k8s", "Kubernetes optimization", 22],
      ["storage", "Block storage optimization", 12],
      ["finops", "FinOps platforms", 23],
      ["native", "Cloud providers’ own tools", 9],
    ]);
    const panels = [...root.querySelectorAll(".mk-panel")];
    const open = () => panels.filter(shown).map((p) => p.id);
    expect(open()).toEqual(["mk-p0"]);
    tabs.forEach((tab, i) => {
      expect(tab).toHaveAttribute("id", `mk-t${i}`);
      expect(tab).toHaveAttribute("aria-controls", `mk-p${i}`);
      expect(panels[i]).toHaveAttribute("aria-labelledby", `mk-t${i}`);
      expect(panels[i]).toHaveAttribute("role", "tabpanel");
    });

    marketGroups.forEach((group, i) => {
      const panel = panels[i]!;
      expect(text(panel.querySelector(".mk-lede"))).toBe(group.lede);
      expect([...panel.querySelectorAll(".mk-headrow span")].map(text)).toEqual([
        "Tool",
        "What it does",
        "How it acts",
        "Clouds",
      ]);
      expect(panel.querySelector(".mk-headrow")).toHaveAttribute("aria-hidden", "true");
      const ours = panel.querySelector(".mk-list > li.mk-ours");
      if (group.ours) {
        expect(panel.querySelector(".mk-list > li")).toBe(ours);
        expect(text(ours!.querySelector(".mk-l"))).toBe(group.ours.name);
        expect(ours!.querySelector(".mk-l")).toHaveAttribute("href", `/${group.ours.product}`);
        expect(ours!.querySelector(".mk-l")).not.toHaveAttribute("target");
        expect(text(ours!.querySelector(".mk-w"))).toBe(group.ours.line);
      } else expect(ours).toBeNull();
      const rows = [...panel.querySelectorAll(".mk-list > li.mk-row:not(.mk-ours)")];
      expect(rows.map((row) => text(row.querySelector(".mk-n small")))).toEqual(
        group.tools.map((tool) => tool.company),
      );
      for (const [j, row] of rows.entries()) {
        const tool = group.tools[j]!;
        const link = row.querySelector("a.mk-l")!;
        expect(text(link)).toBe(`${tool.name} (opens in a new tab)`);
        expect(link).toHaveAttribute("href", tool.url);
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
        expect(text(row.querySelector(".mk-w"))).toBe(tool.line);
        expect([...row.querySelectorAll(".mk-cl")].map(text)).toEqual(tool.clouds);
      }
      expect([...panel.querySelectorAll(".mk-sub")].map(text)).toEqual(
        group.tools.map((tool) => tool.subgroup).filter((sub, j, all) => sub !== all[j - 1]),
      );
    });
    expect(marketGroups.filter((g) => g.ours).map((g) => [g.id, g.ours!.product])).toEqual([
      ["k8s", "coral"],
      ["storage", "amoeba"],
    ]);

    /* Until a tab is picked every tab is in the tab order, as the mock's markup has no tabindex; from then on only
       the open one is (the mock's site-wide tabs script), so Tab leaves the tabs for the open panel. */
    const order = () => tabs.map((b) => b.getAttribute("tabindex"));
    expect(order()).toEqual([null, null, null, null]);
    await user.click(tabs[1]!);
    expect(open()).toEqual(["mk-p1"]);
    expect(tabs.map((b) => b.getAttribute("aria-selected"))).toEqual([
      "false",
      "true",
      "false",
      "false",
    ]);
    expect(order()).toEqual(["-1", "0", "-1", "-1"]);
    fireEvent.keyDown(tabs[1]!, { key: "ArrowRight" });
    expect(open()).toEqual(["mk-p2"]);
    expect(document.activeElement).toBe(tabs[2]);
    expect(order()).toEqual(["-1", "-1", "0", "-1"]);
    await user.tab();
    expect(document.activeElement).toBe(panels[2]!.querySelector("a.mk-l"));
    fireEvent.keyDown(tabs[2]!, { key: "ArrowLeft" });
    fireEvent.keyDown(tabs[1]!, { key: "ArrowLeft" });
    fireEvent.keyDown(tabs[0]!, { key: "ArrowLeft" });
    expect(open()).toEqual(["mk-p3"]);
    expect(document.activeElement).toBe(tabs[3]);
    fireEvent.keyDown(tabs[3]!, { key: "Home" });
    expect(open()).toEqual(["mk-p0"]);
    expect(document.activeElement).toBe(tabs[0]);
    expect(order()).toEqual(["0", "-1", "-1", "-1"]);
    fireEvent.keyDown(tabs[0]!, { key: "End" });
    expect(open()).toEqual(["mk-p3"]);
    expect(document.activeElement).toBe(tabs[3]);
    expect(order()).toEqual(["-1", "-1", "-1", "0"]);
    /* Any other key leaves the tabs as they are. */
    fireEvent.keyDown(tabs[3]!, { key: "ArrowDown" });
    expect(open()).toEqual(["mk-p3"]);
  });

  it("says Coral rebalances, never that it right-sizes, and Amoeba rightsizes", () => {
    const root = page();
    const [coral, amoeba] = [...root.querySelectorAll(".mk-ours .mk-w")].map(text);
    expect(coral).toMatch(/^Rebalances workloads,/);
    expect(coral).not.toMatch(/right-?siz/i);
    expect(amoeba).toMatch(/^Rightsizes block storage/);
  });

  it("ends the map on the note: where the facts come from, the checked day and the address", () => {
    const note = page().querySelector("#tools .mk-note")!;
    expect(text(note)).toBe(
      `Names, owners and descriptions come from each company’s own pages, checked ${marketChecked}. Names are their owners’ trademarks. Something changed? Write to ${contactEmail} and we will correct it.`,
    );
    expect(note.querySelector("a")).toHaveAttribute("href", `mailto:${contactEmail}`);
  });

  it("compares Coral and Amoeba in four cards: the live versus pages, then the alternatives pages", () => {
    const root = page();
    const cards = [...root.querySelectorAll("#ours .lv-grid3 > a.lv-card")];
    expect(root.querySelectorAll("#ours .lv-grid3 > *")).toHaveLength(4);
    expect(cards.map((a) => a.getAttribute("href"))).toEqual([
      ...versusPages.map(versusRoute),
      ...alternativesPages.map((entry) => entry.route),
    ]);
    const tag = (product: keyof typeof products) =>
      learnSubjects.find((s) => s.id === learnProductSubject[product])!.label;
    versusPages.forEach((entry, i) => {
      const card = cards[i]!;
      const name = versusFacts.find((facts) => facts.slug === entry.slug)!.name;
      const cover = card.querySelector(".lv-cover")!;
      expect(cover).toHaveClass("lv-vs", `lv-c-${learnProductSubject[entry.product]}`);
      expect([...cover.querySelectorAll("b")].map(text)).toEqual([
        products[entry.product].name,
        name,
      ]);
      expect(text(cover.querySelector("i"))).toBe("vs");
      expect(text(cover.querySelector(".lv-tag"))).toBe(tag(entry.product));
      expect(text(card.querySelector(".lv-cb b"))).toBe(entry.meta.title);
      expect(text(card.querySelector(".lv-cb small"))).toBe(entry.line);
      expect(text(card.querySelector(".lv-date"))).toBe("Checked 19 October 2026");
    });
    alternativesPages.forEach((entry, i) => {
      const card = cards[versusPages.length + i]!;
      const cover = card.querySelector(".lv-cover")!;
      expect(cover).not.toHaveClass("lv-vs");
      expect(cover.querySelector(".lv-art")).not.toBeNull();
      expect(text(cover.querySelector(".lv-tag"))).toBe(tag(entry.product));
      expect(text(card.querySelector(".lv-cb b"))).toBe(entry.meta.title);
      expect(text(card.querySelector(".lv-cb small"))).toBe(entry.line);
      expect(text(card.querySelector(".lv-date"))).toBe("Checked 19 October 2026");
    });
    /* The mock's motifs for the alternatives cards' places, 5 and 6: machines 2, 7 and 10 in use; disks 24%, 38%, 15%. */
    const coral = cards[versusPages.length]!;
    expect(
      [...coral.querySelectorAll(".lv-grid i")].flatMap((i, n) =>
        i.classList.contains("on") ? [n] : [],
      ),
    ).toEqual([2, 7, 10]);
    expect(
      [...cards[versusPages.length + 1]!.querySelectorAll(".lv-disks i")].map(
        (i) => (i as HTMLElement).style.width,
      ),
    ).toEqual(["24%", "38%", "15%"]);
  });

  it("links only the live versus pages under /compare, never a held one, and draws no logo", () => {
    const root = page();
    const hrefs = [...root.querySelectorAll("main a")].map((a) => a.getAttribute("href") ?? "");
    const live = new Set([
      ...versusPages.map(versusRoute),
      ...alternativesPages.map((entry) => entry.route),
    ]);
    expect(hrefs.filter((href) => href.startsWith(`${routes.compare}/`))).toEqual([...live]);
    expect(hrefs.some((href) => href.startsWith("/learn/compare"))).toBe(false);
    expect(root.querySelectorAll("main img")).toHaveLength(0);
  });

  it("renders every group's rows on the server, the first open, so scripting off still has them all", () => {
    const html = renderToString(<CompareRoute />);
    for (const group of marketGroups)
      for (const tool of group.tools) expect(html).toContain(`href="${tool.url}"`);
    expect(html.match(/class="mk-panel"[^>]*hidden=""/g)).toHaveLength(marketGroups.length - 1);
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
    for (const tab of root.querySelectorAll<HTMLButtonElement>(".mk-tabs button"))
      await user.click(tab);
    expect(calls).toEqual([]);
    for (const file of [
      "src/features/compare/compare-hub.tsx",
      "src/features/learn/market-tabs.tsx",
      "src/features/learn/market-rows.tsx",
    ]) {
      expect(readFileSync(file, "utf8")).not.toMatch(
        /localStorage|sessionStorage|indexedDB|document\.cookie/,
      );
    }
  });

  it("ends with the site's closing row, for both products", () => {
    const row = page().querySelector("#assess")!;
    expect(row.querySelector('a[href="/assessment"]')).not.toBeNull();
    expect(text(row)).toContain("Thirty minutes with the people who build Coral and Amoeba.");
  });
});
