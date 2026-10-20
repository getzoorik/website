import { existsSync, readFileSync } from "node:fs";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { privacySectionIds } from "@/content/privacy";
import { termsCopy } from "@/content/terms";

import { inline, parseTerms, termsSectionIds } from "./parse-terms";
import { terms, TermsOfUse } from "./terms-of-use";

/**
 * /terms is the approved text, word for word, drawn on the legal shell. The
 * failures worth guarding are the quiet ones: a placeholder that ships, a
 * section that loses its anchor, a cross-reference that lands on the wrong
 * page, and words that drift from the approved file.
 */

const source = readFileSync("src/content/legal/terms-of-use.md", "utf8");
const page = (): HTMLElement => render(<TermsOfUse />).container;
const flat = (s: string) => s.replace(/\s+/g, " ").trim();

describe("the terms of use", () => {
  it("ships no [OWNER] placeholder, in the source or on the page", () => {
    expect(source).not.toContain("[OWNER");
    expect(page().textContent).not.toContain("[OWNER");
  });

  /* The source document sits beside this repo on one machine only; elsewhere
     (CI, a clone) there is nothing to compare with. */
  const docsCopy = "../docs/legal/terms-of-use.md";
  it.skipIf(!existsSync(docsCopy))("is the source document's text, byte for byte", () => {
    expect(source).toBe(readFileSync(docsCopy, "utf8"));
  });

  it("has one h1, then the date, the opening and the short version open over the rows", () => {
    const root = page();
    expect(root.querySelectorAll("h1")).toHaveLength(1);
    const top = root.querySelector("article.gd-main > .fq-upd.gd-top > .pp-prose")!;
    expect(top.querySelector(".pp-date")!.textContent).toBe(
      "Effective 6 October 2026 · Version 1.0",
    );
    expect(top.querySelector("#short-version > .pp-short-t")!.textContent).toBe(
      "The short version",
    );
    expect(top.querySelector("details")).toBeNull();
  });

  it("draws the twenty clauses as numbered rows in six groups, each row on its clause's id", () => {
    const root = page();
    const groups = [...root.querySelectorAll("article.gd-main > section.fq-sec")];
    expect(groups.map((g) => [g.id, g.querySelector(":scope > h2")!.textContent])).toEqual([
      ["terms-agreement", "The agreement"],
      ["terms-use", "Using our products"],
      ["terms-data", "Data and software"],
      ["terms-service", "Fees and service"],
      ["terms-liability", "Liability"],
      ["terms-general", "General"],
    ]);
    expect(groups.map((g) => g.querySelectorAll("details.gd-row").length)).toEqual([
      3, 3, 3, 3, 3, 5,
    ]);
    const rows = [...root.querySelectorAll("details.fq.gd-row")];
    expect(rows.map((row) => row.id)).toEqual([...termsSectionIds]);
    expect(rows.map((row) => row.querySelector("summary h3")!.textContent)).toEqual(
      terms.sections.map((s) => s.title),
    );
    /* The numeral is the clause's own number, which the terms cross-refer by. */
    expect(rows.map((row) => row.querySelector(".fq-n")!.textContent)).toEqual(
      terms.sections.map((s) => s.number.padStart(2, "0")),
    );
    for (const row of rows) {
      expect(row).not.toHaveAttribute("open");
      expect(row.querySelector(":scope > .fq-body")).toHaveClass("doc-prose");
    }
    /* The phone's chips name the six groups. */
    expect([...root.querySelectorAll("nav.fq-chips a")].map((a) => a.getAttribute("href"))).toEqual(
      groups.map((g) => `#${g.id}`),
    );
  });

  it("opens the row an address names, so every clause's old anchor still lands", () => {
    window.history.replaceState(null, "", "/terms#liability");
    const root = page();
    expect(root.querySelector<HTMLDetailsElement>("details#liability")!.open).toBe(true);
    expect(root.querySelectorAll("details[open]")).toHaveLength(1);
    window.history.replaceState(null, "", "/terms");
  });

  it("prints every word of the file, and nothing else", () => {
    const words = (s: string) =>
      flat(
        s
          .replace(/^# Terms of Use$/m, "")
          .replace(
            /\*\*Effective date:\*\* (.+) · \*\*Version:\*\* (.+)/,
            "Effective $1 · Version $2",
          )
          .replace(/^## (The short version)$/m, "$1")
          .replace(
            /\*\*Rebalancing and PodDisruptionBudgets\.\*\*/,
            "Rebalancing and PodDisruptionBudgets",
          )
          /* a clause's heading is its row's h3; its number is the row's numeral, hidden from the text */
          .replace(/^## \d+\. /gm, "")
          .replace(/\*\*|`/g, "")
          .replace(/^- /gm, ""),
      ).split(" ");
    /* Block by block, with a space between, as a reader meets them. */
    const column = page().querySelector(".doc-main")!;
    const shown = flat(
      [...column.querySelectorAll("p, li, h3")].map((el) => el.textContent).join(" "),
    ).split(" ");
    const expected = words(source);
    expect(shown).toEqual(expected);
  });

  it("links the Privacy Policy and its sections, and this page's own sections, and nothing else", () => {
    const root = page();
    for (const a of root.querySelectorAll<HTMLAnchorElement>(".doc-main a")) {
      const href = a.getAttribute("href")!;
      expect(href).toMatch(/^(#|\/privacy(#|$)|mailto:founders@zoorik\.com$)/);
      if (href.startsWith("#") && href !== "#top")
        expect(root.querySelector(href), href).not.toBeNull();
      if (href.startsWith("/privacy#"))
        expect(privacySectionIds as readonly string[]).toContain(href.slice(9));
      expect(a).not.toHaveAttribute("target");
    }
    const toPrivacy = [...root.querySelectorAll(".doc-main a[href^='/privacy']")];
    expect(toPrivacy).toHaveLength(10);
  });

  it("leaves a list of sections as text, and links 'section N' alone", () => {
    expect(inline("Sections 7, 8, 9, 12 to 16, 18 and 19 still apply")).toEqual([
      "Sections 7, 8, 9, 12 to 16, 18 and 19 still apply",
    ]);
    expect(inline("as section 9 of the Privacy Policy describes")).toEqual([
      "as ",
      { href: "/privacy#retention", text: "section 9 of the Privacy Policy" },
      " describes",
    ]);
    expect(inline("(section 1)")).toEqual(["(", { href: "#who-we-are", text: "section 1" }, ")"]);
  });

  it("refuses a file with a placeholder", () => {
    expect(() => parseTerms(source.replace("₹10,000", "[OWNER: amount in INR]"))).toThrow(
      /placeholder/,
    );
  });
  it("keeps the sitemap's copy of the date line equal to the document's", () => {
    expect(termsCopy.effective).toBe(terms.effective);
    expect(terms.effective).toBe("Effective 6 October 2026 · Version 1.0");
  });
});
