import { readFileSync } from "node:fs";

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

/* The nav and the footer read the pathname. */
vi.mock("next/navigation", async (original) => ({
  ...(await original<typeof import("next/navigation")>()),
  usePathname: () => "/trust",
}));

import Trust, { metadata } from "@/app/trust/page";
import { documents } from "@/content/documents";
import { trustPage, trustUpdated } from "@/content/trust";
import { documentFacts } from "@/features/documents/document-facts";

/**
 * `/trust`: the metadata and card, /privacy's frame with the security overview's parts in the rail, the DPA's
 * download, the sub-processors' table, the links and what the page must never print.
 */

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();
const page = () => render(<Trust />).container;

describe("/trust", () => {
  it("is titled, described and canonicalised as its draft, with its own card", () => {
    expect(metadata.title).toBe("Trust center");
    expect(metadata.description).toBe(
      "Coral's security overview, our data processing agreement and our sub-processors: what runs in your cluster, what leaves it, and how we protect it.",
    );
    expect(metadata.alternates).toEqual({ canonical: "/trust" });
    expect(metadata.openGraph).toMatchObject({
      url: "/trust",
      title: "Trust center | Zoorik",
      images: [{ url: "/og/pages/trust.png" }],
    });
  });

  it("draws /privacy's frame: the hero, the rail with the overview's six parts under it, the date, then four sections", () => {
    const root = page();
    expect(text(root.querySelector("main > header.hero.doc-hero#top h1"))).toBe("Trust center");
    const rail = root.querySelector("nav.doc-rail")!;
    const top = [...rail.querySelectorAll(":scope > ol > li > a.rl")].map((a) =>
      a.getAttribute("href"),
    );
    expect(top).toEqual(["#security-overview", "#dpa", "#sub-processors", "#more"]);
    const parts = [...rail.querySelectorAll("ol.rl-sub a.rl")].map((a) => [
      a.getAttribute("href"),
      text(a),
    ]);
    expect(parts).toEqual([
      ["#in-your-cluster", "What runs in your cluster"],
      ["#data", "What leaves your cluster, and what never does"],
      ["#access", "Access and permissions"],
      ["#sign-in", "Sign-in and data separation"],
      ["#storage", "Data storage and deletion"],
      ["#report", "Report a security issue"],
    ]);
    for (const [href] of parts) expect(root.querySelector(`h3${href}`), href!).not.toBeNull();
    expect(root.querySelectorAll("details.doc-toc ol.rl-sub a")).toHaveLength(6);
    const column = root.querySelector("article.doc-main")!;
    expect(text(column.querySelector(":scope > p.doc-updated"))).toBe("Updated 30 October 2026");
    expect(trustUpdated).toBe("Updated 30 October 2026");
    const sections = [...column.querySelectorAll(".pp-prose.tr-prose > section")];
    expect(
      sections.map((s) => [s.id, s.getAttribute("aria-labelledby"), text(s.querySelector("h2"))]),
    ).toEqual([
      ["security-overview", "security-overview-h", "Security overview"],
      ["dpa", "dpa-h", "Data processing agreement"],
      ["sub-processors", "sub-processors-h", "Sub-processors"],
      ["more", "more-h", "More"],
    ]);
    /* No closing row: the page ends on its last section, as the legal pages do. */
    expect(root.querySelector("#assess")).toBeNull();
  });

  it("offers the DPA v1.0 with its facts read from the file, and the security overview as this page alone", () => {
    const root = page();
    const link = root.querySelector("#dpa a[download]")!;
    const facts = documentFacts("coral-dpa");
    expect(link).toHaveAttribute("href", "/docs/coral-data-processing-agreement-v1.0.pdf");
    expect(link).toHaveAttribute(
      "aria-label",
      `Download the data processing agreement, version 1.0, ${facts.spoken}`,
    );
    expect(text(link)).toBe("Download the data processing agreement, version 1.0 (PDF)");
    expect(text(link.parentElement)).toBe(`${text(link)} · ${facts.short.replace(/ /g, " ")}`);
    expect(facts.pages).toBe(7);
    expect(documents["coral-dpa"].canonical).toBe("/trust");
    expect(root.querySelectorAll("a[download]")).toHaveLength(1);
  });

  it("lists the three sub-processors of DPA v1.0's Annex 3 in /privacy's table", () => {
    const table = page().querySelector("#sub-processors table.doc-tbl.pp-tbl")!;
    expect([...table.querySelectorAll("th")].map(text)).toEqual([
      "Sub-processor",
      "What it does for Zoorik",
      "Where",
      "Cluster data it handles",
    ]);
    expect([...table.querySelectorAll("tbody tr td:first-child")].map(text)).toEqual([
      "Microsoft Azure",
      "Cloudflare",
      "Google (Workspace)",
    ]);
    for (const cell of table.querySelectorAll("td")) expect(cell).toHaveAttribute("data-label");
  });

  it("links the pages it names, the address and the calendar, and nothing else off the site", () => {
    const links = [...page().querySelectorAll("main a[href]")].map((a) => a.getAttribute("href")!);
    expect([...new Set(links.filter((href) => !href.startsWith("#")))].sort()).toEqual(
      [
        "/.well-known/security.txt",
        "/docs/coral-data-processing-agreement-v1.0.pdf",
        "/docs/install-coral-with-helm",
        "/privacy",
        "/privacy#sharing",
        "/security",
        "/security#amoeba-on-your-vms",
        "/terms",
        "https://cal.com/zoorik/talk",
        "mailto:founders@zoorik.com",
      ].sort(),
    );
  });

  it("prints no price, no console address, no TLS version and nothing on our logs", () => {
    const all = text(page().querySelector("main"));
    expect(all).not.toMatch(/[$€£₹]\s?\d|\b(USD|EUR|INR)\b/);
    expect(all).not.toMatch(/dev\.zoorik\.com|zoorik-dev|TLS 1\.\d|log store|collected centrally/i);
    expect(all).not.toMatch(/'/);
    expect(JSON.stringify(trustPage)).not.toMatch(/grievance officer|Anthropic/i);
  });

  it("keeps its one rule on its own column, so /privacy's is left alone", () => {
    const css = readFileSync("src/styles/trust.css", "utf8")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .trim();
    expect(css).toBe(".tr-prose > p + section{margin-top:56px}");
  });
});
