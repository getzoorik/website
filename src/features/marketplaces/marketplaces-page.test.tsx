import { readFileSync } from "node:fs";

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
 * `/marketplaces`, where to find Zoorik: the metadata, the hero,
 * Coral's two store listings and the line for Amoeba, G2's links and Gartner Peer Insights coming soon with no link,
 * the six registries, the company's profiles and the close. Its sitemap entry is in `src/app/sitemap.test.ts`, its
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
  expect(link.querySelector("svg.ext")).toHaveAttribute("aria-hidden", "true");
}

describe("/marketplaces's metadata", () => {
  it("has the mock's title through the template, its description and its canonical", () => {
    expect(metadata.title).toBe("Where to find Zoorik: marketplaces, reviews and installs");
    expect(metadata.description).toBe(
      "Buy Coral on AWS or Microsoft Marketplace and Amoeba on Microsoft Marketplace, read reviews on G2, and install from Homebrew, PyPI, npm and the Terraform Registry.",
    );
    expect(metadata.alternates).toEqual({ canonical: "/marketplaces" });
    expect(metadata).not.toHaveProperty("robots");
    expect(metadata.openGraph).toMatchObject({
      url: "/marketplaces",
      title: "Where to find Zoorik: marketplaces, reviews and installs · Zoorik",
    });
    expect(routes.marketplaces).toBe("/marketplaces");
    expect(marketplacesLastUpdated).toBe("20 October 2026");
  });
});

describe("/marketplaces", () => {
  it("names the page, with its deck and two buttons down the page", () => {
    const root = page();
    expect(root.querySelectorAll("h1")).toHaveLength(1);
    expect(text(root.querySelector("header.hero.doc-hero h1"))).toBe("Where to find Zoorik");
    expect(text(root.querySelector("header.hero .doc-deck"))).toBe(
      "Buy Coral and Amoeba through your cloud’s marketplace, read and write reviews, install from the registries you already use, and find us across the web.",
    );
    /* No label over the h1: the page is live, not coming soon. */
    expect(root.querySelector("header.hero .pg-soon")).toBeNull();
    expect(
      [...root.querySelectorAll("header.hero .hero-cta a")].map((a) => [
        a.className,
        a.getAttribute("href"),
        text(a),
      ]),
    ).toEqual([
      ["btn btn-light", "#buy", "Cloud marketplaces"],
      ["btn btn-wire", "#reviews", "Reviews"],
    ]);
    expect(root.querySelector("main")).toHaveClass("pv-main", "mp-main");
  });

  it("has the stores, the reviews on the band, the registries, the profiles on the band, then the close", () => {
    const root = page();
    expect(
      [...root.querySelectorAll("main > section")].map((s) => [
        s.id,
        s.className,
        s.getAttribute("aria-labelledby"),
        text(s.querySelector(".sec-head h2, .pv-close h2")),
        text(s.querySelector(".sec-head p, .pv-close p")),
      ]),
    ).toEqual([
      [
        "buy",
        "sec pv-sec",
        "buy-h",
        "Cloud marketplaces",
        "Buy through the account you already pay your cloud bill with.",
      ],
      [
        "reviews",
        "sec sec-band",
        "reviews-h",
        "Reviews",
        "What teams say, on independent review sites.",
      ],
      [
        "install",
        "sec",
        "install-h",
        "Install from",
        "Every package comes from our own accounts on these registries.",
      ],
      ["web", "sec sec-band", "web-h", "Find us on the web", ""],
      [
        "",
        "sec",
        null,
        "Want to buy through your marketplace?",
        "We can set up a private offer on AWS or Microsoft Marketplace.",
      ],
    ]);
    /* No lede under Find us on the web, and no closing assessment row: the mock ends on the close. */
    expect(root.querySelector("#web .sec-head p")).toBeNull();
    expect(root.querySelector("#assess")).toBeNull();
    const cta = root.querySelector(".pv-close a.pv-cta")!;
    expect(cta).toHaveAttribute("href", "mailto:founders@zoorik.com?subject=Marketplace");
    expect(text(cta)).toBe("Write to us");
  });

  it("links each listing, Coral's in both stores then Amoeba's, read from the stores' config, with the store's mark", () => {
    const root = page();
    const stores = [...root.querySelectorAll("#buy .mp-buy > a.mp-store")];
    expect(
      stores.map((a) => [
        a.querySelector(".mp-logo svg")!.getAttribute("data-mark"),
        text(a.querySelector(".mp-k")),
        text(a.querySelector("b")),
        text(a.querySelector(":scope > span:not([class])")),
        text(a.querySelector(".mp-go")),
      ]),
    ).toEqual([
      [
        "aws",
        "AWS Marketplace",
        "Coral",
        "Kubernetes cost optimization for Amazon EKS, bought and billed through your AWS account.",
        "View the listing",
      ],
      [
        "azure",
        "Microsoft Marketplace",
        "Coral",
        "Kubernetes cost optimization for Azure Kubernetes Service, through your Microsoft account.",
        "View the listing",
      ],
      [
        "azure",
        "Microsoft Marketplace",
        "Amoeba",
        "Block storage cost optimization for Azure managed disks, through your Microsoft account.",
        "View the listing",
      ],
    ]);
    const [aws, microsoft] = marketplaces;
    expectOffSite(stores[0]!, aws!.listings.coral);
    expectOffSite(stores[1]!, microsoft!.listings.coral);
    expectOffSite(stores[2]!, microsoft!.listings.amoeba!);
    expect(stores[0]!.querySelector('b span[translate="no"]')).toHaveTextContent("Coral");
    expect(stores[2]!.querySelector('b span[translate="no"]')).toHaveTextContent("Amoeba");
  });

  it("says Amoeba is not on AWS Marketplace yet, with /amoeba and a ready email", () => {
    expect(marketplaces.map((store) => [store.id, store.listings.amoeba !== null])).toEqual([
      ["aws", false],
      ["microsoft", true],
    ]);
    const note = page().querySelector("#buy p.mp-note")!;
    expect(text(note)).toBe("Amoeba is not on AWS Marketplace yet. See Amoeba or write to us.");
    expect([...note.querySelectorAll("a")].map((a) => [a.getAttribute("href"), text(a)])).toEqual([
      ["/amoeba", "See Amoeba"],
      ["mailto:founders@zoorik.com?subject=Amoeba", "write to us"],
    ]);
  });

  it("links G2's two pages, and marks Gartner Peer Insights coming soon, with no link and no rating", () => {
    const root = page();
    const [g2, soon] = [...root.querySelectorAll("#reviews .mp-rev > article.mp-rc")];
    expect(text(g2!.querySelector(".mp-k"))).toBe("G2");
    expect(text(g2!.querySelector("h3"))).toBe("Reviews of Coral");
    expect(text(g2!.querySelector("p"))).toBe(
      "Read what teams say about Coral, or leave a review of your own.",
    );
    const links = [...g2!.querySelectorAll(".mp-acts > a.pv-go.dark")];
    expect(links.map(words)).toEqual(["Read reviews on G2", "Zoorik on G2"]);
    expectOffSite(links[0]!, g2Coral);
    expectOffSite(links[1]!, g2Seller);
    /* The seller link's words are one span, so the name kept from translation does not split them. */
    expect(
      links[1]!.querySelector(':scope > span:not(.sr-only) > span[translate="no"]'),
    ).toHaveTextContent("Zoorik");

    expect(soon).toHaveClass("mp-rc", "is-soon");
    expect(text(soon!.querySelector(".mp-k"))).toBe("Gartner Peer Insights");
    expect(text(soon!.querySelector("h3"))).toBe("Listing coming soon");
    expect(text(soon!.querySelector("p"))).toBe(
      "We are setting up Zoorik on Gartner Peer Insights, Gartner’s free platform for verified reviews of enterprise software.",
    );
    expect(text(soon!.querySelector(".mp-chip"))).toBe("Coming soon");
    expect(soon!.querySelector("a")).toBeNull();
    /* No rating, star or review count anywhere on the page. */
    expect(text(root.querySelector("main"))).not.toMatch(/★|\d(\.\d)? ?\/ ?5|\d+ reviews?\b/i);
  });

  it("lists the six registries, read from the channels' config and the assessment's npm package", () => {
    const links = [...page().querySelectorAll("#install .mp-grid > a.mp-i")];
    expect(links.map((a) => [text(a.querySelector("b")), text(a.querySelector("small"))])).toEqual([
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
    links.forEach((a, i) => expectOffSite(a, hrefs[i]!));
    /* npm's card points at the package a reader installs, never at the org, which holds none. */
    expect(npmPackage).toBe("https://www.npmjs.com/package/zoorik");
    expect(links.some((a) => a.getAttribute("href") === npmOrg)).toBe(false);
  });

  it("lists the company's profiles across the web, read from the entity's config", () => {
    const links = [...page().querySelectorAll("#web .mp-grid > a.mp-i")];
    expect(links.map((a) => [text(a.querySelector("b")), text(a.querySelector("small"))])).toEqual([
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
  });

  it("opens every off-site link in a new tab, and no other", () => {
    const root = page();
    for (const a of root.querySelectorAll("main a")) {
      const href = a.getAttribute("href")!;
      if (/^https?:\/\//.test(href)) expect(a, href).toHaveAttribute("target", "_blank");
      else expect(a, href).not.toHaveAttribute("target");
    }
  });

  it("has no island, and stores nothing in the browser", () => {
    const source = readFileSync("src/features/marketplaces/marketplaces-page.tsx", "utf8");
    expect(source).not.toMatch(/^"use client"/m);
    expect(source).not.toMatch(/localStorage|sessionStorage|indexedDB|document\.cookie/);
  });
});
