import { readFileSync } from "node:fs";

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

/* The nav and the footer read the pathname. */
vi.mock("next/navigation", async (original) => ({
  ...(await original<typeof import("next/navigation")>()),
  usePathname: () => "/pricing",
}));

import Pricing, { metadata } from "@/app/pricing/page";
import { marketplaces } from "@/config/marketplaces";
import { pageStructuredData } from "@/config/structured-data";
import { pricingLine } from "@/content/pricing";

/**
 * `/pricing`: the owner's one line (D226) and no figure at all (D193), then the sections, the four listings, the pair,
 * the questions and the closing row.
 */

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();
const page = () => render(<Pricing />).container;

describe("/pricing", () => {
  it("is titled, described and canonicalised as its draft, with its own card", () => {
    expect(metadata.title).toBe("Pricing");
    expect(metadata.description).toBe(
      "Coral is priced per vCPU it manages, and Amoeba per GB it manages. See your saving with the free assessment, then buy on AWS or Microsoft Marketplace.",
    );
    expect(metadata.alternates).toEqual({ canonical: "/pricing" });
    expect(metadata.openGraph).toMatchObject({
      url: "/pricing",
      title: "Pricing | Zoorik",
      images: [{ url: "/og/pages/pricing.png" }],
    });
  });

  it("leads with the owner's line, word for word, then the assessment and Book a demo", () => {
    expect(pricingLine).toBe(
      "Coral is priced per vCPU it manages, and Amoeba per GB it manages. The free assessment shows your saving before you pay anything.",
    );
    const hero = page().querySelector("main > header.hero")!;
    expect(text(hero.querySelector("h1"))).toBe("Pricing");
    expect(text(hero.querySelector(".doc-deck"))).toBe(pricingLine);
    const buttons = [...hero.querySelectorAll(".hero-cta a.btn")];
    expect(buttons.map((a) => [text(a), a.getAttribute("href")])).toEqual([
      ["Estimate your saving", "/assessment"],
      ["Book a demo (opens in a new tab)", "https://cal.com/zoorik/talk"],
    ]);
  });

  it("prints no price, rate, currency or figure: its text holds no digit", () => {
    const main = page().querySelector("main")!;
    const all = text(main);
    expect(all).not.toMatch(/\d/);
    expect(all).not.toMatch(/[$€£₹]|\b(USD|EUR|INR)\b/);
    expect(all).not.toMatch(/'/);
    /* The closing row's meeting length is spelled out, and so are the safety snapshots' 7 days (1 Nov 2026). */
    expect(all).toContain("Thirty minutes with the people who build Coral and Amoeba.");
    expect(all).toContain("for the seven days they’re kept.");
    const json = JSON.stringify(pageStructuredData("/pricing"));
    for (const word of [
      "offers",
      "price",
      "Offer",
      "PriceSpecification",
      "AggregateOffer",
      "FAQPage",
    ]) {
      expect(json).not.toContain(`"${word}"`);
    }
  });

  it("draws the sections in the draft's order, the four listings by name and the questions closed", () => {
    const root = page();
    const ids = [...root.querySelectorAll("main > section, main > div.sec")].map(
      (s) => s.id || s.className,
    );
    expect(ids).toEqual([
      "assessment",
      "products",
      "buy",
      "sec sec-band cp-pair",
      "questions",
      "assess",
    ]);
    expect(
      [...root.querySelectorAll("#buy .mkt-b")].map((a) => [
        text(a.querySelector("span")),
        a.getAttribute("href"),
      ]),
    ).toEqual([
      ["Coral on AWS Marketplace", marketplaces[0]!.listings.coral],
      ["Coral on Microsoft Marketplace", marketplaces[1]!.listings.coral],
      ["Amoeba on AWS Marketplace", marketplaces[0]!.listings.amoeba],
      ["Amoeba on Microsoft Marketplace", marketplaces[1]!.listings.amoeba],
    ]);
    const rows = [...root.querySelectorAll("#questions details.fq")];
    expect(rows.map((row) => [row.id, text(row.querySelector("h3"))])).toEqual([
      ["where-can-i-buy-coral", "Where can I buy Coral?"],
      ["what-does-amoeba-cost", "What does Amoeba cost?"],
      ["how-do-i-get-amoeba", "How do I get Amoeba?"],
      ["how-do-i-see-what-i-could", "How do I see what I could save?"],
      ["do-i-pay-for-both-sets-of", "Do I pay for both sets of disks during an Amoeba move?"],
    ]);
    for (const row of rows) {
      expect(row).not.toHaveAttribute("open");
      expect(row.querySelector(".fq-n")).toBeNull();
    }
    /* In the page's own text: the footer links /contact on every page. */
    expect(root.querySelector('main a[href="/contact"]')).not.toBeNull();
  });

  it("starts the sheet's rules at the classes only /contact and /pricing draw, or at Follow us", () => {
    const css = readFileSync("src/styles/contact-pricing.css", "utf8").replace(
      /\/\*[\s\S]*?\*\//g,
      "",
    );
    const selectors: string[] = [];
    for (const chunk of css.split("}")) {
      if (!chunk.includes("{")) continue;
      const head = chunk.slice(0, chunk.lastIndexOf("{"));
      const prelude = head.slice(head.lastIndexOf("{") + 1).trim();
      if (prelude && !prelude.startsWith("@"))
        selectors.push(...prelude.split(",").map((s) => s.trim()));
    }
    expect(
      selectors.filter(
        (s) =>
          !/^(\.ct-|\.cp-w p\.ct-after|#buy \.cp-buyrow|\.cp-more|\.cp-d \.cta-fine|\.pr-|#follow |\.hero-cta:where\(\.pr-cta\))/.test(
            s,
          ),
      ),
    ).toEqual([]);
  });
});
