import { readdirSync, readFileSync } from "node:fs";

import { render } from "@testing-library/react";
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
 * `/news`, Zoorik News: the metadata, the hero and its links, From Zoorik,
 * Zoorik Radar's three streams with every item's date, summary and source, and the newsletter row. Its sitemap entry
 * is in `src/app/sitemap.test.ts`, its page graph in `src/config/structured-data.test.ts`, and /learn's card in
 * `src/features/learn/learn-hub.test.tsx`.
 */

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();

const page = () => render(<NewsRoute />).container;

/** An off-site link the site's way: a new tab, no opener, the hidden hint, and the arrow. */
function expectOffSite(link: Element, href: string) {
  expect(link).toHaveAttribute("href", href);
  expect(link).toHaveAttribute("target", "_blank");
  expect(link).toHaveAttribute("rel", "noopener noreferrer");
  expect(text(link.querySelector(".sr-only"))).toBe("(opens in a new tab)");
  expect(link.querySelector("svg.ext")).toHaveAttribute("aria-hidden", "true");
}

const profile = (platform: string) => socialProfiles.find((p) => p.platform === platform)!.href;

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
  it("names the page Zoorik News, with the deck and a link to each part", () => {
    const root = page();
    expect(root.querySelectorAll("h1")).toHaveLength(1);
    expect(text(root.querySelector("header.hero.doc-hero h1"))).toBe("Zoorik News");
    expect(text(root.querySelector("header.hero .doc-deck"))).toBe(
      "What we ship, and what changed this week in cloud cost, Kubernetes and FinOps.",
    );
    expect(root.querySelector("a.skip")).toHaveAttribute("href", "#main");
    const jump = root.querySelector("header.hero .hero-in > nav.nw-jump")!;
    expect(jump).toHaveAttribute("aria-label", "On this page");
    const links = [...jump.querySelectorAll("a")].map((a) => [a.getAttribute("href"), text(a)]);
    expect(links).toEqual([
      ["#zoorik", "From Zoorik"],
      ["#radar-cloud", "Cloud"],
      ["#radar-oss", "Kubernetes and open source"],
      ["#radar-finops", "FinOps"],
    ]);
    for (const [href] of links) expect(root.querySelector(href!)).not.toBeNull();
  });

  it("has From Zoorik, then Zoorik Radar on the band, then the newsletter, and no closing assessment row", () => {
    const root = page();
    expect(
      [...root.querySelectorAll("main > section")].map((s) => [
        s.id,
        s.className,
        s.getAttribute("aria-labelledby"),
      ]),
    ).toEqual([
      ["zoorik", "sec nw-sec", "zoorik-h"],
      ["radar", "sec sec-band nw-sec", "radar-h"],
      ["", "sec nw-sec", null],
    ]);
    expect(text(root.querySelector("#zoorik-h"))).toBe("From Zoorik");
    expect(text(root.querySelector("#zoorik .nw-h p"))).toBe("What we shipped, newest first.");
    expect(root.querySelector("#assess")).toBeNull();
  });

  it("shows our announcements, newest first on the navy panel, each linking to its page here", () => {
    const root = page();
    const cards = [...root.querySelectorAll("#zoorik article")];
    expect(cards.map((card) => card.className)).toEqual(["nz-feat", "nz-card", "nz-card"]);
    expect(root.querySelectorAll(".nz-side > article")).toHaveLength(2);
    expect(
      cards.map((card) => [
        text(card.querySelector(".nz-tag")),
        card.querySelector("time")!.getAttribute("datetime"),
        text(card.querySelector("time")),
        text(card.querySelector("h3")),
        text(card.querySelector(".nz-line")),
        card.querySelector("a")!.className,
        card.querySelector("a")!.getAttribute("href"),
        text(card.querySelector("a")),
      ]),
    ).toEqual([
      [
        "Assessment",
        "2026-10-17",
        "17 October 2026",
        "Zoorik assessment 1.3: one free PDF report for Coral and Amoeba",
        "One command, npx -y zoorik assess coral or amoeba, now writes a single PDF with your estimated saving at list price.",
        "nz-cta",
        routes.assessment,
        "Run the free assessment",
      ],
      [
        "Coral",
        "2026-10-16",
        "16 October 2026",
        "Install Coral with Helm or Terraform",
        "Coral’s agent now installs from a public Helm chart, and AKS and EKS modules are on the Terraform Registry, beside zoorikctl.",
        "nz-link",
        routes.openSource,
        "See the install options",
      ],
      [
        "Validation Lab",
        "2026-10-12",
        "12 October 2026",
        "How we reduced our own cluster’s machine bill by 58%",
        "Eight days after we connected Coral to our own AKS development cluster, it cost $154.76 a month instead of $368.65.",
        "nz-link",
        routes.caseStudyCoralDevCluster,
        "Read the case study",
      ],
    ]);
    for (const card of cards) {
      expect(card.querySelector("a")).not.toHaveAttribute("target");
      expect(card.querySelector("a svg")).toHaveAttribute("aria-hidden", "true");
    }
    /* Newest first. */
    const days = newsFromZoorik.map((item) => item.date);
    expect(days).toEqual([...days].sort().reverse());
    /* The products' names are kept out of translation. */
    expect([...cards[1]!.querySelectorAll("[translate=no]")].map(text)).toContain("Coral");
  });

  it("heads Zoorik Radar with its week, its title and the window it read", () => {
    const root = page();
    const head = root.querySelector("#radar > .wrap > .nr-head")!;
    expect(head.querySelector("svg.nr-art")).toHaveAttribute("aria-hidden", "true");
    expect(head.querySelector("svg.nr-art .nr-sweep")).not.toBeNull();
    expect(text(head.querySelector(".nr-eyebrow"))).toBe("Zoorik Radar · week of 19 October 2026");
    expect(head.querySelector("h2")).toHaveAttribute("id", "radar-h");
    expect(text(head.querySelector("h2"))).toBe(
      "What changed in cloud cost, Kubernetes and FinOps",
    );
    expect(text(head.querySelector("p:not(.nr-eyebrow)"))).toBe(
      "Read every week from AWS, Azure, the Kubernetes projects and the FinOps Foundation, and written in our words, each with its source. 5 to 19 October 2026.",
    );
  });

  it("prints the three streams in order, each item with its date, its summary and its source link", () => {
    const root = page();
    const columns = [...root.querySelectorAll("#radar .nr-cols > section.nr-col")];
    expect(
      columns.map((col) => [
        col.id,
        col.getAttribute("aria-labelledby"),
        text(col.querySelector("header h3")),
        text(col.querySelector("header p")),
        col.querySelectorAll("ol > li").length,
      ]),
    ).toEqual([
      [
        "radar-cloud",
        "radar-cloud-h",
        "Cloud",
        "AWS and Azure prices and features: AKS, EKS, Azure disks and Amazon EBS.",
        4,
      ],
      [
        "radar-oss",
        "radar-oss-h",
        "Kubernetes and open source",
        "Releases from Kubernetes, Karpenter, the autoscalers and the disk drivers.",
        5,
      ],
      [
        "radar-finops",
        "radar-finops-h",
        "FinOps",
        "The FinOps Foundation, the FOCUS billing format and how teams run cloud cost.",
        5,
      ],
    ]);

    columns.forEach((col, s) => {
      const stream = newsRadar.streams[s]!;
      const rows = [...col.querySelectorAll("ol > li")];
      expect(rows).toHaveLength(stream.items.length);
      rows.forEach((li, i) => {
        const item = stream.items[i]!;
        const time = li.querySelector(":scope > time")!;
        expect(time).toHaveAttribute("datetime", item.date);
        expect(text(time)).toBe(newsDay(item.date, false));
        const title = li.querySelector(":scope > a.nr-t")!;
        expect(text(title.firstChild as Element)).toBe(item.title);
        expectOffSite(title, item.url);
        expect(text(li.querySelector(":scope > p"))).toBe(item.summary);
        expect(text(li.querySelector(":scope > small"))).toBe(item.source);
      });
      /* Newest first. */
      const days = stream.items.map((item) => item.date);
      expect(days).toEqual([...days].sort().reverse());
    });

    /* Spot checks against the radar run's own data. */
    const first = root.querySelector("#radar-cloud li")!;
    expect(text(first.querySelector("time"))).toBe("18 October");
    expect(first.querySelector("a.nr-t")).toHaveAttribute(
      "href",
      "https://aws.amazon.com/eks/pricing/",
    );
    expect(text(first.querySelector("p"))).toBe(
      "A cluster costs $0.10 per hour in standard support and $0.60 per hour once its Kubernetes version moves to extended support, which AWS turns on by default.",
    );
    expect(text(first.querySelector("small"))).toBe("AWS: Amazon EKS pricing");
    const last = [...root.querySelectorAll("#radar-finops li")].at(-1)!;
    expect(text(last.querySelector("time"))).toBe("6 October");
    expect(text(last.querySelector("a.nr-t"))).toBe(
      "FinOps Foundation: AI budgets miss idle infrastructure, storage and hidden tooling (opens in a new tab)",
    );
    expect(text(last.querySelector("p"))).toBe(
      "The Foundation warns that AI budgets built on token prices miss much of the real spend. The missed items include supporting tools, idle and pre-production infrastructure, observability data growth and forced migrations.",
    );
  });

  it("keeps every summary to at most two sentences, as the mock cuts them", () => {
    for (const item of newsRadar.streams.flatMap((stream) => stream.items)) {
      const sentences = item.summary.split(/(?<=[.!?])\s+(?=[A-Z0-9$])/);
      expect(sentences.length, item.title).toBeLessThanOrEqual(2);
      expect(item.summary, item.title).toMatch(/[.!?]$/);
      expect(item.url).toMatch(/^https:\/\//);
    }
    expect(newsRadar.streams.flatMap((stream) => stream.items)).toHaveLength(14);
  });

  it("closes on the newsletter: subscribe on Medium or Substack, or follow us; links only, no form", () => {
    const root = page();
    const row = root.querySelector("main > section:last-of-type .nw-sub")!;
    expect(text(row.querySelector(".nw-subc .nr-eyebrow"))).toBe("Newsletter");
    expect(text(row.querySelector(".nw-subc h2"))).toBe("Get Zoorik News by email");
    expect(text(row.querySelector(".nw-subc > p:not(.nr-eyebrow)"))).toBe(
      "Subscribe to our Medium publication: what we ship, and each week’s Zoorik Radar, in your inbox.",
    );
    const [subscribe, alt] = [...row.querySelectorAll(".nw-subacts > a")];
    expect(subscribe).toHaveClass("nz-cta");
    expect(text(subscribe!.firstChild as Element)).toBe("Subscribe on Medium");
    expectOffSite(subscribe!, profile("medium"));
    expect(alt).toHaveClass("nw-alt");
    expect(text(alt!.firstChild as Element)).toBe("Or on Substack");
    expectOffSite(alt!, substackPublication);
    expect(text(row.querySelector(".nw-fl > p"))).toBe("Or follow us");
    const follow = [...row.querySelectorAll(".nw-fl > a")];
    expect(follow.map((a) => text(a.firstChild as Element))).toEqual(["LinkedIn", "X", "r/zoorik"]);
    follow.forEach((a, i) => expectOffSite(a, profile(["linkedin", "x", "reddit"][i]!)));
    expect(root.querySelector("main form, main input, main iframe, main script")).toBeNull();
  });

  it("follows the site's words: reduce, never cut, lower or waste", () => {
    const words = text(page().querySelector("main"));
    expect(words).not.toMatch(/\b(cut|cuts|cutting|lower|lowers|waste|wasted)\b/i);
  });

  it("is drawn on the server, with no island and no browser storage", () => {
    for (const file of readdirSync("src/features/news").filter((f) => /\.tsx?$/.test(f))) {
      const code = readFileSync(`src/features/news/${file}`, "utf8");
      if (file.includes(".test.")) continue;
      expect(code, file).not.toMatch(/^["']use client["']/m);
      expect(code, file).not.toMatch(/localStorage|sessionStorage|indexedDB|document\.cookie/);
    }
    expect(newsPage.hero.title).toBe("Zoorik News");
  });
});
