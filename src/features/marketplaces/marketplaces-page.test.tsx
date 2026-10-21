import { readFileSync, statSync } from "node:fs";

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  crunchbaseProfile,
  f6sCompany,
  g2Coral,
  g2Seller,
  npmOrg,
  saasBrowserProfile,
  tracxnCompany,
  wellfoundCompany,
} from "@/config/entity";
import { marketplaces } from "@/config/marketplaces";
import { channels } from "@/config/open-source";
import { routes } from "@/config/site";
import { marketplacesLastUpdated, npmPackage } from "@/content/marketplaces";

/* The nav and the footer read the pathname. */
vi.mock("next/navigation", () => ({ usePathname: () => "/marketplaces" }));

import MarketplacesRoute, { metadata } from "@/app/marketplaces/page";

/**
 * `/marketplaces`, where to find Zoorik: the metadata, the hero, the pair on the band (every listing as a row, and the
 * private offer by a ready email), G2's two pages, the six registries and the company's profiles. Its sitemap entry is in `src/app/sitemap.test.ts`, its
 * page graph in `src/config/structured-data.test.ts`, and that it names no competitor in
 * `src/features/learn/market-names.test.ts`.
 */

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();
/** A link's words without the hidden new-tab hint. */
const words = (el: Element) => text(el).replace(" (opens in a new tab)", "");

const page = () => render(<MarketplacesRoute />).container;

/** An off-site link the site's way: a new tab, no opener, the hidden hint, and the arrow. */
function expectOffSite(link: Element, href: string) {
  expect(link).toHaveAttribute("href", href);
  expect(link).toHaveAttribute("target", "_blank");
  expect(link).toHaveAttribute("rel", "noopener noreferrer");
  expect(text(link.querySelector(".sr-only"))).toBe("(opens in a new tab)");
  expect(link.querySelector("svg.dt-go")).toHaveAttribute("aria-hidden", "true");
}

/** A platform's logo on its tile: the file, read as decoration (the tile's title names the place), 28px, small. */
function expectLogo(link: Element, src: string) {
  const img = link.querySelector("img.dt-ic.cp-ic.mp-logo")!;
  expect(img, src).toHaveAttribute("src", src);
  expect(img).toHaveAttribute("alt", "");
  expect(img).toHaveAttribute("width", "28");
  expect(img).toHaveAttribute("height", "28");
  expect(statSync(`public${src}`).size, src).toBeLessThan(8 * 1024);
}

describe("/marketplaces's metadata", () => {
  it("has the mock's title through the template, its description and its canonical", () => {
    expect(metadata.title).toBe("Where to find Zoorik: marketplaces, reviews and installs");
    expect(metadata.description).toBe(
      "Buy Coral and Amoeba on AWS or Microsoft Marketplace, read reviews on G2, and install from Homebrew, PyPI, npm and the Terraform Registry.",
    );
    expect(metadata.alternates).toEqual({ canonical: "/marketplaces" });
    expect(metadata).not.toHaveProperty("robots");
    expect(metadata.openGraph).toMatchObject({
      url: "/marketplaces",
      title: "Where to find Zoorik: marketplaces, reviews and installs · Zoorik",
    });
    expect(routes.marketplaces).toBe("/marketplaces");
    expect(marketplacesLastUpdated).toBe("21 October 2026");
  });
});

describe("/marketplaces", () => {
  it("names the page with its line, then the pair, Reviews, Install from and Find us on the web, and no closing row", () => {
    const root = page();
    expect(root.querySelectorAll("h1")).toHaveLength(1);
    expect(text(root.querySelector("header.hero.doc-hero h1"))).toBe("Where to find Zoorik");
    expect(text(root.querySelector("header.hero .doc-deck"))).toBe(
      "Buy Coral and Amoeba through your cloud’s marketplace, read and write reviews, install from the registries you already use, and find us across the web.",
    );
    expect(root.querySelector("header.hero .hero-cta")).toBeNull();
    expect(
      [...root.querySelectorAll("main > section")].map(
        (section) => section.id || section.className,
      ),
    ).toEqual(["sec sec-band cp-pair", "reviews", "install", "web"]);
    expect(root.querySelector("#assess")).toBeNull();
  });

  it("lists every listing as a row on the white card, Coral's in both stores then Amoeba's in both, with the store's mark", () => {
    const card = page().querySelector(".cp-pair .as-card")!;
    expect(text(card.querySelector("h2"))).toBe("Cloud marketplaces");
    expect(text(card.querySelector(":scope > p"))).toBe(
      "Buy through the account you already pay your cloud bill with.",
    );
    const rows = [...card.querySelectorAll(".mp-list > li > a.mp-l")];
    expect(
      rows.map((a) => [a.querySelector("svg.mp-m")!.getAttribute("data-mark"), words(a)]),
    ).toEqual([
      ["aws", "Coral on AWS Marketplace"],
      ["azure", "Coral on Microsoft Marketplace"],
      ["aws", "Amoeba on AWS Marketplace"],
      ["azure", "Amoeba on Microsoft Marketplace"],
    ]);
    const [aws, microsoft] = marketplaces;
    expectOffSite(rows[0]!, aws!.listings.coral);
    expectOffSite(rows[1]!, microsoft!.listings.coral);
    expectOffSite(rows[2]!, aws!.listings.amoeba!);
    expectOffSite(rows[3]!, microsoft!.listings.amoeba!);
    expect(rows[0]!.querySelector('b span[translate="no"]')).toHaveTextContent("Coral");
    expect(rows[2]!.querySelector('b span[translate="no"]')).toHaveTextContent("Amoeba");
  });

  it("offers a private offer on the navy card, by a ready email to the founders", () => {
    const card = page().querySelector(".cp-pair .as-cal")!;
    expect(text(card.querySelector("h2"))).toBe("Want to buy through your marketplace?");
    expect(text(card.querySelector(":scope > p"))).toBe(
      "We can set up a private offer on AWS or Microsoft Marketplace.",
    );
    const write = card.querySelector("a.cta-go")!;
    expect(write).toHaveAttribute("href", "mailto:founders@zoorik.com?subject=Marketplace");
    expect(words(write)).toBe("Write to us");
  });

  it("links G2's two pages, with no rating, and no tile for a review site that does not list Zoorik", () => {
    const root = page();
    const links = [...root.querySelectorAll("#reviews .dt-grid.mp-2 a.dt-a")];
    expect(
      links.map((a) => [text(a.querySelector(".dt-t")), text(a.querySelector(".dt-l"))]),
    ).toEqual([
      ["Reviews of Coral", "Read what teams say about Coral, or leave a review of your own."],
      ["Zoorik on G2", "Our seller page on G2."],
    ]);
    expectOffSite(links[0]!, g2Coral);
    expectOffSite(links[1]!, g2Seller);
    for (const a of links) expectLogo(a, "/marketplace-logos/g2.svg");
    expect(text(root.querySelector("main"))).not.toMatch(/Gartner|coming soon|★|\d(\.\d)? out of/i);
  });

  it("lists the six registries, each with its icon, read from the channels' config and the assessment's npm package", () => {
    const links = [...page().querySelectorAll("#install .dt-grid a.dt-a")];
    expect(
      links.map((a) => [text(a.querySelector(".dt-t")), text(a.querySelector(".dt-l"))]),
    ).toEqual([
      ["Homebrew", "zoorikctl for macOS and Linux"],
      ["Scoop", "zoorikctl for Windows"],
      ["PyPI", "The free assessment"],
      ["npm", "The free assessment, with npx"],
      ["Artifact Hub", "The Coral agent Helm chart"],
      ["Terraform Registry", "AKS and EKS modules"],
    ]);
    const hrefs = [
      channels.homebrew.href,
      channels.scoop.href,
      channels.pypi.href,
      npmPackage,
      channels["artifact-hub"].href,
      channels["terraform-registry"].href,
    ];
    links.forEach((a, i) => {
      expectOffSite(a, hrefs[i]!);
      expect(a.querySelector("svg.dt-ic.cp-ic"), hrefs[i]).toHaveAttribute("aria-hidden", "true");
    });
    /* npm's tile points at the package a reader installs, never at the org, which holds none. */
    expect(npmPackage).toBe("https://www.npmjs.com/package/zoorik");
    expect(links.some((a) => a.getAttribute("href") === npmOrg)).toBe(false);
  });

  it("lists the company's profiles across the web, read from the entity's config", () => {
    const links = [...page().querySelectorAll("#web .dt-grid a.dt-a")];
    expect(
      links.map((a) => [text(a.querySelector(".dt-t")), text(a.querySelector(".dt-l"))]),
    ).toEqual([
      ["Crunchbase", "Company profile"],
      ["Wellfound", "Company and roles"],
      ["Tracxn", "Company profile"],
      ["F6S", "Company profile"],
      ["SaaS Browser", "Product listing"],
      ["GitHub", "Code, charts and issues"],
    ]);
    const hrefs = [
      crunchbaseProfile,
      wellfoundCompany,
      tracxnCompany,
      f6sCompany,
      saasBrowserProfile,
      channels.github.href,
    ];
    links.forEach((a, i) => expectOffSite(a, hrefs[i]!));
    [
      "/marketplace-logos/crunchbase.svg",
      "/marketplace-logos/wellfound.svg",
      "/marketplace-logos/tracxn.png",
      "/marketplace-logos/f6s.png",
      "/marketplace-logos/saas-browser.png",
    ].forEach((logo, i) => expectLogo(links[i]!, logo));
    /* GitHub's is the footer's own mark, drawn in the page. */
    expect(links[5]!.querySelector("svg.dt-ic.cp-ic.mp-ink")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("opens every off-site link in a new tab, and no other", () => {
    const root = page();
    for (const a of root.querySelectorAll("main a")) {
      const href = a.getAttribute("href")!;
      if (/^https?:\/\//.test(href)) expect(a, href).toHaveAttribute("target", "_blank");
      else expect(a, href).not.toHaveAttribute("target");
    }
  });

  it("has no island of its own, and stores nothing in the browser", () => {
    const source = readFileSync("src/features/marketplaces/marketplaces-page.tsx", "utf8");
    expect(source).not.toMatch(/^"use client"/m);
    expect(source).not.toMatch(/localStorage|sessionStorage|indexedDB|document\.cookie/);
  });
});
