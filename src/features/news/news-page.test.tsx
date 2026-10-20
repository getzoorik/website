import { readdirSync, readFileSync } from "node:fs";

import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { substackPublication } from "@/config/entity";
import { routes } from "@/config/site";
import { socialProfiles } from "@/content/footer";
import { newsFromZoorik, newsLastUpdated, newsPage, newsRadar } from "@/content/news";

/* The nav and the footer read the pathname. */
vi.mock("next/navigation", () => ({ usePathname: () => "/news" }));

import NewsRoute, { metadata } from "@/app/news/page";

import { newsDay } from "./news-facts";

/**
 * `/news`, Zoorik News: the metadata, the hero, the latest announcement beside the newsletter, the rest of From
 * Zoorik, and Zoorik Radar with its stream chips, every item's tile, logo, day and source. Its sitemap entry is in
 * `src/app/sitemap.test.ts`, its page graph in `src/config/structured-data.test.ts`, and /learn's card in
 * `src/features/learn/learn-hub.test.tsx`.
 */

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();

const page = () => render(<NewsRoute />).container;

/** An off-site link the site's way: a new tab, no opener, and the hidden hint. */
function expectOffSite(link: Element, href: string) {
  expect(link).toHaveAttribute("href", href);
  expect(link).toHaveAttribute("target", "_blank");
  expect(link).toHaveAttribute("rel", "noopener noreferrer");
  expect(text(link.querySelector(".sr-only"))).toBe("(opens in a new tab)");
}

const profile = (platform: string) => socialProfiles.find((p) => p.platform === platform)!.href;

/** What a tile's icon is: an image's file, a mark's `data-mark`, the Zoorik mark, or a monogram's letter. */
function iconOf(tile: Element): string {
  const icon = tile.querySelector(".dt-ic")!;
  if (icon.tagName === "IMG") return `file ${icon.getAttribute("src")}`;
  if (icon.classList.contains("nw-mono")) return `monogram ${text(icon)}`;
  if (icon.getAttribute("data-mark")) return `mark ${icon.getAttribute("data-mark")}`;
  return icon.getAttribute("viewBox") === "0 0 512 512" ? "zoorik" : "unknown";
}

describe("/news's metadata", () => {
  it("titles the page as is, with no ' · Zoorik' after it, and describes and canonicalises it", () => {
    expect(metadata.title).toEqual({
      absolute: "Zoorik News: cloud cost, Kubernetes and FinOps updates",
    });
    expect(metadata.description).toBe(
      "What Zoorik ships, and Zoorik Radar: what changed this week in cloud cost, Kubernetes and FinOps, each item with its source.",
    );
    expect(metadata.alternates).toEqual({ canonical: "/news" });
    expect(metadata).not.toHaveProperty("robots");
    expect(metadata.openGraph).toMatchObject({
      url: "/news",
      title: "Zoorik News: cloud cost, Kubernetes and FinOps updates",
    });
    expect(routes.news).toBe("/news");
  });

  it("dates the content by the week of its Radar", () => {
    expect(newsLastUpdated).toBe(newsDay(newsRadar.week));
    expect(newsLastUpdated).toBe("19 October 2026");
  });
});

describe("/news", () => {
  it("names the page Zoorik News with its deck, then the latest, From Zoorik and Zoorik Radar", () => {
    const root = page();
    expect(root.querySelectorAll("h1")).toHaveLength(1);
    expect(text(root.querySelector("header.hero.doc-hero h1"))).toBe("Zoorik News");
    expect(root.querySelector("header.hero h1 [translate='no']")).toHaveTextContent("Zoorik");
    expect(text(root.querySelector("header.hero .doc-deck"))).toBe(
      "What we ship, and what changed this week in cloud cost, Kubernetes and FinOps.",
    );
    expect(root.querySelector("header.hero nav, header.hero a")).toBeNull();
    expect(root.querySelector("a.skip")).toHaveAttribute("href", "#main");
    expect(
      [...root.querySelectorAll("main > section")].map((s) => [
        s.id,
        s.className,
        s.getAttribute("aria-labelledby") ?? s.getAttribute("aria-label"),
      ]),
    ).toEqual([
      ["latest", "sec sec-band", "The latest from Zoorik, and the newsletter"],
      ["zoorik", "sec nw-sec", "zoorik-h"],
      ["radar", "sec nw-sec", "radar-h"],
    ]);
    expect(root.querySelector("#assess")).toBeNull();
  });

  it("draws the latest announcement on the white card, flagged Latest, with its button to its page here", () => {
    const [latest] = [...page().querySelectorAll("#latest .as-grid > div")];
    const item = newsFromZoorik[0]!;
    expect(latest).toHaveClass("as-card", "as-mini", "nw-fc", "rise");
    expect(text(latest!.querySelector(":scope > .nw-flag"))).toBe("Latest");
    const mark = latest!.querySelector(":scope > svg.nw-own.nw-own-l")!;
    expect(mark).toHaveAttribute("aria-hidden", "true");
    expect(mark).toHaveAttribute("viewBox", "0 0 512 512");
    const meta = latest!.querySelector("p.nw-meta")!;
    expect(text(meta)).toBe("17 October 2026 · Assessment");
    expect(meta.querySelector("time")).toHaveAttribute("datetime", item.date);
    expect(text(latest!.querySelector("h2.as-h"))).toBe(
      "Zoorik assessment 1.3: one free PDF report for Coral and Amoeba",
    );
    expect(text(latest!.querySelector("p:not(.nw-meta)"))).toBe(
      "One command, npx -y zoorik assess coral or amoeba, now writes a single PDF with your estimated saving at list price.",
    );
    const button = latest!.querySelector("a.btn-ink")!;
    expect(button).toHaveAttribute("href", routes.assessment);
    expect(button).not.toHaveAttribute("target");
    expect(text(button)).toBe("Run the free assessment");
    expect(button.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    /* The products' names are kept out of translation. */
    expect([...latest!.querySelectorAll("h2 [translate='no']")].map(text)).toEqual([
      "Zoorik",
      "Coral",
      "Amoeba",
    ]);
  });

  it("draws the newsletter on the dark card: Medium's mark, subscribe on Medium, or on Substack", () => {
    const newsletter = page().querySelectorAll("#latest .as-grid > div")[1]!;
    expect(newsletter).toHaveClass("as-cal", "rise");
    expect(newsletter).toHaveAttribute("data-i", "1");
    expect(newsletter.querySelector(":scope > svg.nw-own")).toHaveAttribute("data-mark", "medium");
    expect(text(newsletter.querySelector("h2.as-h"))).toBe("Get Zoorik News by email");
    expect(newsletter.querySelector("h2 [translate='no']")).toHaveTextContent("Zoorik");
    expect(text(newsletter.querySelector("p:not(.cta-fine)"))).toBe(
      "Our newsletter on Medium: what we ship, and each week’s Zoorik Radar, in your inbox.",
    );
    const subscribe = newsletter.querySelector("a.cta-go")!;
    expect(text(subscribe)).toBe("Subscribe on Medium (opens in a new tab)");
    expectOffSite(subscribe, profile("medium"));
    expect(subscribe.querySelector("svg.ext")).toHaveAttribute("aria-hidden", "true");
    const fine = newsletter.querySelector("p.cta-fine")!;
    expect(text(fine)).toBe("Or on Substack (opens in a new tab)");
    expectOffSite(fine.querySelector("a")!, substackPublication);
    /* Links only: no form, no embed, no third-party script. */
    expect(newsletter.closest("main")!.querySelector("form, input, iframe, script")).toBeNull();
  });

  it("lists the rest of From Zoorik as tiles, each with its mark, its day and its tag, to its page here", () => {
    const section = page().querySelector("#zoorik")!;
    expect(text(section.querySelector(".sec-hrow h2#zoorik-h"))).toBe("From Zoorik");
    const tiles = [...section.querySelectorAll(".dt-grid > article.dt.nw-t > a.dt-a")];
    expect(
      tiles.map((tile) => [
        tile.getAttribute("href"),
        iconOf(tile),
        text(tile.querySelector(".dt-t")),
        text(tile.querySelector(".dt-l")),
        text(tile.querySelector(".nw-m")),
        tile.querySelector(".nw-m time")!.getAttribute("datetime"),
      ]),
    ).toEqual([
      [
        routes.openSource,
        "mark kubernetes",
        "Install Coral with Helm or Terraform",
        "Coral’s agent now installs from a public Helm chart, and AKS and EKS modules are on the Terraform Registry, beside zoorikctl.",
        "16 Oct · Coral",
        "2026-10-16",
      ],
      [
        routes.caseStudyCoralDevCluster,
        "zoorik",
        "How we reduced our own cluster’s machine bill by 58%",
        "Eight days after we connected Coral to our own AKS development cluster, it cost $154.76 a month instead of $368.65.",
        "12 Oct · Value Lab",
        "2026-10-12",
      ],
    ]);
    for (const tile of tiles) {
      expect(tile).not.toHaveAttribute("target");
      expect(tile.querySelector(".sr-only")).toBeNull();
      expect(tile.querySelector("svg.dt-go")).toHaveAttribute("aria-hidden", "true");
    }
    /* Newest first, the latest on the band above. */
    const days = newsFromZoorik.map((item) => item.date);
    expect(days).toEqual([...days].sort().reverse());
  });

  it("heads Zoorik Radar with its week, then one chip per stream after All, All pressed", () => {
    const section = page().querySelector("#radar")!;
    expect(text(section.querySelector(".sec-hrow h2#radar-h"))).toBe("Zoorik Radar");
    expect(text(section.querySelector(".sec-hrow p"))).toBe("Week of 19 October 2026");
    const chips = section.querySelector(".nw-chips")!;
    expect(chips).toHaveAttribute("role", "group");
    expect(chips).toHaveAttribute("aria-label", "Stream");
    expect(
      [...chips.querySelectorAll("button")].map((b) => [
        b.getAttribute("type"),
        b.getAttribute("data-st"),
        b.getAttribute("aria-pressed"),
        text(b),
      ]),
    ).toEqual([
      ["button", "", "true", "All"],
      ["button", "cloud", "false", "Cloud"],
      ["button", "oss", "false", "Kubernetes and open source"],
      ["button", "finops", "false", "FinOps"],
    ]);
  });

  it("prints every stream's items as tiles that open their source in a new tab, each with its logo, day and source", () => {
    const root = page();
    const groups = [...root.querySelectorAll("#radar .nw-g")];
    expect(
      groups.map((g) => [g.getAttribute("data-st"), text(g.querySelector("h3.nw-sl"))]),
    ).toEqual([
      ["cloud", "Cloud"],
      ["oss", "Kubernetes and open source"],
      ["finops", "FinOps"],
    ]);
    for (const group of groups) expect(group).not.toHaveAttribute("hidden");
    const icons = groups.map((group) =>
      [...group.querySelectorAll(".dt-grid > article.dt.nw-t > a.dt-a")].map(iconOf),
    );
    expect(icons).toEqual([
      ["mark aws", "mark azure", "mark aws", "mark aws"],
      [
        "file /community-logos/karpenter.svg",
        "file /community-logos/karpenter.svg",
        "file /community-logos/karpenter.svg",
        "mark azure",
        "file /community-logos/karpenter.svg",
      ],
      [
        "file /community-logos/finops-foundation.svg",
        "monogram N",
        "file /community-logos/finops-foundation.svg",
        "file /community-logos/finops-foundation.svg",
        "file /community-logos/finops-foundation.svg",
      ],
    ]);
    groups.forEach((group, s) => {
      const stream = newsRadar.streams[s]!;
      const tiles = [...group.querySelectorAll(".dt-grid > article.dt.nw-t > a.dt-a")];
      expect(tiles).toHaveLength(stream.items.length);
      tiles.forEach((tile, i) => {
        const item = stream.items[i]!;
        expectOffSite(tile, item.url);
        expect(text(tile.querySelector(".dt-t"))).toBe(item.title);
        expect(tile.querySelector(".dt-l")).toBeNull();
        expect(tile.querySelector(".nw-m time")).toHaveAttribute("datetime", item.date);
        expect(tile.querySelector("svg.dt-go")).toHaveAttribute("aria-hidden", "true");
        const logo = tile.querySelector(".dt-ic")!;
        if (logo.tagName === "IMG") expect(logo).toHaveAttribute("alt", "");
        else expect(logo).toHaveAttribute("aria-hidden", "true");
      });
    });
    /* The Azure marks' gradients are named apart. */
    const gradients = [...root.querySelectorAll("#radar linearGradient")].map((g) => g.id);
    expect(new Set(gradients).size).toBe(gradients.length);
    /* Spot checks against the radar run's own data. */
    const first = groups[0]!.querySelector("a.dt-a")!;
    expect(text(first.querySelector(".nw-m"))).toBe("18 Oct · AWS: Amazon EKS pricing");
    expect(first).toHaveAttribute("href", "https://aws.amazon.com/eks/pricing/");
    const last = [...groups[2]!.querySelectorAll("a.dt-a")].at(-1)!;
    expect(text(last.querySelector(".dt-t"))).toBe(
      "FinOps Foundation: AI budgets miss idle infrastructure, storage and hidden tooling",
    );
    expect(text(last.querySelector(".nw-m"))).toBe("6 Oct · FinOps Foundation");
  });

  it("closes Zoorik Radar on what it reads and the window it covers", () => {
    expect(text(page().querySelector("#radar .wrap > p.nw-note"))).toBe(
      "Read every week from AWS, Azure, the Kubernetes projects and the FinOps Foundation, in our words, each linked to its source. 5 to 19 October 2026.",
    );
  });

  it("shows one stream when its chip is pressed, and every stream again on All", () => {
    const root = page();
    const chip = (st: string) => root.querySelector(`.nw-chips button[data-st='${st}']`)!;
    const shown = () =>
      [...root.querySelectorAll(".nw-g")]
        .filter((g) => !g.hasAttribute("hidden"))
        .map((g) => g.getAttribute("data-st"));
    const pressed = () =>
      [...root.querySelectorAll(".nw-chips button")]
        .filter((b) => b.getAttribute("aria-pressed") === "true")
        .map((b) => b.getAttribute("data-st"));

    fireEvent.click(chip("oss"));
    expect(shown()).toEqual(["oss"]);
    expect(pressed()).toEqual(["oss"]);
    fireEvent.click(chip("finops"));
    expect(shown()).toEqual(["finops"]);
    expect(pressed()).toEqual(["finops"]);
    fireEvent.click(chip(""));
    expect(shown()).toEqual(["cloud", "oss", "finops"]);
    expect(pressed()).toEqual([""]);
  });

  it("keeps every Radar stream newest first, each item linked to its source's own page", () => {
    for (const stream of newsRadar.streams) {
      const days = stream.items.map((item) => item.date);
      expect(days, stream.id).toEqual([...days].sort().reverse());
      for (const item of stream.items) expect(item.url).toMatch(/^https:\/\//);
    }
    expect(newsRadar.streams.flatMap((stream) => stream.items)).toHaveLength(14);
  });

  it("follows the site's words: reduce, never cut, lower or waste", () => {
    const words = text(page().querySelector("main"));
    expect(words).not.toMatch(/\b(cut|cuts|cutting|lower|lowers|waste|wasted)\b/i);
  });

  it("is drawn on the server but for the stream chips, and stores nothing in the browser", () => {
    const islands: string[] = [];
    for (const file of readdirSync("src/features/news").filter((f) => /\.tsx?$/.test(f))) {
      if (file.includes(".test.")) continue;
      const code = readFileSync(`src/features/news/${file}`, "utf8");
      if (/^["']use client["']/m.test(code)) islands.push(file);
      expect(code, file).not.toMatch(/localStorage|sessionStorage|indexedDB|document\.cookie/);
    }
    expect(islands).toEqual(["radar-streams.tsx"]);
    expect(newsPage.hero.title).toBe("Zoorik News");
  });
});
