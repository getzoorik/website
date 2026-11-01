import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { marketplaces } from "@/config/marketplaces";
import { contactEmail, routes } from "@/config/site";
import { caseStudy } from "@/content/case-studies";
import { savingsFigures } from "@/content/savings";

/* The nav and the footer read the pathname. */
vi.mock("next/navigation", () => ({ usePathname: () => "/partners" }));

import PartnersRoute, { metadata } from "@/app/partners/page";

/**
 * `/partners`: the metadata, the hero, the pair (what a partner brings, with the two products' ranges read from the
 * home page's, and a ready email), who it is for, what works today, where customers buy; and no terms of any kind,
 * since the program has none. The sitemap entry is in `src/app/sitemap.test.ts`, the structured data in
 * `src/config/structured-data.test.ts`.
 */

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();
const main = () => render(<PartnersRoute />).container.querySelector("main")!;
/** What a reader sees: the page's text without what is hidden from a screen reader or drawn only for one. */
const words = (): string => {
  const copy = main().cloneNode(true) as Element;
  for (const hidden of copy.querySelectorAll('[aria-hidden="true"], .sr-only')) hidden.remove();
  return text(copy);
};
const tiles = (section: Element) =>
  [...section.querySelectorAll("article.dt")].map((tile) => [
    text(tile.querySelector(".dt-t")),
    text(tile.querySelector(".dt-l")),
    tile.querySelector("a.dt-a")?.getAttribute("href") ?? null,
  ]);

describe("/partners's metadata", () => {
  it("has the mock's title through the site's template, its description and its canonical", () => {
    expect(metadata.title).toBe("Partner program");
    expect(metadata.description).toBe(
      "A partner program for consultancies, managed service providers and resellers who run Kubernetes and block storage on Azure and AWS. Coming soon.",
    );
    expect(metadata.alternates).toEqual({ canonical: "/partners" });
    expect(metadata).not.toHaveProperty("robots");
  });
});

describe("/partners", () => {
  it("opens on the utility hero: the h1 and one line", () => {
    const hero = main().querySelector(":scope > header.hero.doc-hero")!;
    expect(hero).toHaveAttribute("id", "top");
    expect(hero.querySelector(".zk-art")).not.toBeNull();
    expect(text(hero.querySelector("h1"))).toBe("Partner program");
    expect(text(hero.querySelector(".doc-deck"))).toBe(
      "For consultancies, managed service providers and resellers who run Kubernetes and block storage for their customers on Azure and AWS.",
    );
    expect(hero.querySelector(".hero-cta, .pg-soon")).toBeNull();
  });

  it("lays out the mock's sections in its order, each at its address", () => {
    const m = main();
    const sections = [...m.querySelectorAll(":scope > section")];
    expect(sections.map((s) => s.className)).toEqual([
      "sec sec-band cp-pair",
      "sec cp-sec",
      "sec cp-sec",
      "sec cp-sec cp-buy",
    ]);
    expect(sections.map((s) => s.id)).toEqual(["", "who", "today", ""]);
    expect(sections.slice(1).map((s) => text(s.querySelector("h2")))).toEqual([
      "Who it is for",
      "What you can use today",
      "Where your customers buy",
    ]);
    expect(sections[3]).toHaveAttribute("aria-labelledby", "buy-h");
    expect(sections[3]!.querySelector("h2")).toHaveAttribute("id", "buy-h");
    /* The mock ends on All marketplaces: no closing assessment row. */
    expect(m.querySelector("#assess, #contact")).toBeNull();
  });

  it("puts what a partner brings on the white card, each range read from the home page's", () => {
    const card = main().querySelector(".cp-pair .as-grid > .as-card.as-mini.cp-w.rise")!;
    expect(text(card.querySelector(".cp-flag"))).toBe("Coming soon");
    expect(card.querySelector("svg.cp-own.cp-own-l")).toHaveAttribute("aria-hidden", "true");
    expect(text(card.querySelector("h2.as-h"))).toBe("Reduce your customers’ cloud cost");
    expect(text(card.querySelector(":scope > p"))).toBe(
      "Coral rebalances Kubernetes and Amoeba rightsizes block storage, autonomously, without any downtime.",
    );
    const rows = [...card.querySelectorAll("ul.cp-rg > li")];
    expect(rows.map((row) => text(row.querySelector(":scope > span:not(.cp-track)")))).toEqual([
      "Coral · Kubernetes",
      "Amoeba · block storage",
    ]);
    const figures = rows.map((row) => row.querySelector("b")!);
    expect(figures.map(text)).toEqual([savingsFigures.coral.range, savingsFigures.amoeba.range]);
    expect(figures.map((figure) => figure.getAttribute("aria-label"))).toEqual([
      savingsFigures.coral.spoken,
      savingsFigures.amoeba.spoken,
    ]);
    /* Each band sits at its range on a 0 to 100% track: 40–50% starts at 40% and is 10% wide. */
    const bands = rows.map((row) => row.querySelector<HTMLElement>(".cp-track > i")!.style);
    expect(bands.map((band) => [band.left, band.width])).toEqual([
      ["40%", "10%"],
      ["50%", "10%"],
    ]);
    for (const row of rows) {
      expect(row.querySelector(".cp-track")).toHaveAttribute("aria-hidden", "true");
      expect(row.querySelector("svg.cp-rgi")).toHaveAttribute("aria-hidden", "true");
    }
    expect(text(card.querySelector("p.cp-fine"))).toBe("Estimated ranges, not a promise.");
    const go = card.querySelector<HTMLAnchorElement>("a.btn-ink")!;
    expect(text(go)).toBe("See our own result");
    expect(go.getAttribute("href")).toBe(caseStudy.route);
  });

  it("puts a ready email on the navy card", () => {
    const card = main().querySelector(".cp-pair .as-grid > .as-cal.cp-d.rise")!;
    expect(card).toHaveAttribute("data-i", "1");
    expect(text(card.querySelector("h2.as-h"))).toBe("Want to partner with us?");
    expect(text(card.querySelector("p"))).toBe(
      "The terms will be on this page when the program opens.",
    );
    const write = card.querySelector<HTMLAnchorElement>("a.cta-go")!;
    expect(text(write)).toBe("Write to us");
    expect(write.getAttribute("href")).toBe(`mailto:${contactEmail}?subject=Partner%20program`);
  });

  it("names who it is for on three tiles, words alone", () => {
    const who = main().querySelector("#who")!;
    expect(who.querySelector(".dt-grid")).toHaveClass("cp-3");
    expect(tiles(who)).toEqual([
      [
        "Consultancies and system integrators",
        "Bring Coral and Amoeba into the cloud platforms you design and run.",
        null,
      ],
      [
        "Managed service providers",
        "You run clusters and VMs for customers; Coral and Amoeba reduce their cloud cost.",
        null,
      ],
      [
        "Resellers and marketplace partners",
        "Zoorik is on AWS Marketplace and Microsoft Marketplace.",
        null,
      ],
    ]);
  });

  it("links what works today: the assessment, the Helm chart and the Terraform modules", () => {
    const today = main().querySelector("#today")!;
    expect(tiles(today)).toEqual([
      [
        "The free assessment",
        "Show a customer their estimated saving at list price, in one PDF.",
        routes.assessment,
      ],
      [
        "Helm chart",
        "Install Coral’s agent the way your team already ships.",
        routes.docsInstallHelm,
      ],
      [
        "Terraform modules",
        "AKS and EKS modules on the Terraform Registry.",
        routes.docsInstallTerraform,
      ],
    ]);
    expect(today.querySelectorAll("a .dt-go")).toHaveLength(3);
    expect(today.querySelectorAll("a[target]")).toHaveLength(0);
  });

  it("ends on where customers buy: Coral's listing in each store, then every marketplace", () => {
    const buy = main().querySelector(".cp-buy")!;
    expect(text(buy.querySelector(".cp-buyrow p"))).toBe(
      "Coral and Amoeba are on AWS Marketplace and Microsoft Marketplace, paid through the cloud account your customers already use.",
    );
    const stores = [...buy.querySelectorAll<HTMLAnchorElement>(".mkt-btns.cp-stores > a.mkt-b")];
    expect(stores.map((store) => [text(store), store.getAttribute("href")])).toEqual(
      marketplaces.map((store) => [`${store.name} (opens in a new tab)`, store.listings.coral]),
    );
    for (const store of stores) {
      expect(store).toHaveAttribute("target", "_blank");
      expect(store).toHaveAttribute("rel", "noopener noreferrer");
    }
    const all = buy.querySelector<HTMLAnchorElement>("a.alink.cp-all")!;
    expect(text(all)).toBe("All marketplaces");
    expect(all.getAttribute("href")).toBe(routes.marketplaces);
  });

  it("gives each Azure mark its own gradients", () => {
    const ids = [...main().querySelectorAll("linearGradient")].map((gradient) => gradient.id);
    expect(ids.length).toBeGreaterThan(0);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("/partners states no terms", () => {
  /* The program has no terms yet: no commission, margin, payout or figure of our own. */
  it("names no commission, margin, payout or reward", () => {
    expect(words()).not.toMatch(
      /commission|payout|pay out|\bmargin|revenue share|rev share|discount|\bbonus|reward|referral fee/i,
    );
  });

  it("prints no figure but the two ranges", () => {
    expect(words().match(/[−-]?\$?\d[\d.,–]*%?/g)).toEqual([
      savingsFigures.coral.range,
      savingsFigures.amoeba.range,
    ]);
  });

  it("keeps to the house words", () => {
    expect(words()).not.toMatch(/\bcut\b|\blower\b|\bwaste/i);
  });
});
