import { readFileSync } from "node:fs";

import { render, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { calendarUrl, contactEmail } from "@/config/site";
import { privacySectionIds, privacySubsectionIds } from "@/content/privacy";

/* The nav and the footer read the pathname. */
const pathname = vi.hoisted(() => ({ current: "/privacy" }));
vi.mock("next/navigation", () => ({ usePathname: () => pathname.current }));

import PrivacyPage from "@/app/privacy/page";

/**
 * `/privacy`: the page's own contract on top of the documents kit, which
 * `documents.test.tsx` covers. The anchor ids other products link to, the
 * outline, the contents, the tables, which links leave the site, the Clarity
 * disclosure, no placeholder left in, every word against the policy itself, and
 * the sheet's rules the mock draws that Tailwind's reset would otherwise take
 * away. Its metadata is in `src/app/metadata.test.ts`, its sitemap entry in
 * `src/app/sitemap.test.ts`.
 */

beforeEach(() => {
  pathname.current = "/privacy";
});

afterEach(() => {
  vi.restoreAllMocks();
});

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();

/** The policy, a byte-for-byte copy of its source document: the page's one source of words. */
const POLICY = readFileSync("src/content/legal/privacy-policy.md", "utf8");

const page = () => render(<PrivacyPage />).container;
const main = () => page().querySelector("main")!;

/** The section anchors and the mock's subsection ids, written out here so the content file cannot redefine it. */
const H2_IDS = [
  "who-we-are",
  "scope",
  "roles",
  "what-we-collect",
  "not-collected",
  "cookies",
  "sharing",
  "storage-transfers",
  "retention",
  "security",
  "your-rights",
  "children",
  "changes",
  "language",
  "contact",
];
const H3_IDS = [
  "account",
  "cluster-data",
  "amoeba",
  "zoorikctl",
  "logs",
  "website",
  "email-calls-leads",
  "assessment",
  "rights-how",
  "rights-india",
  "rights-eu-uk",
  "rights-elsewhere",
  "rights-required",
  "rights-automated",
];

/** The section titles as the contents list them: the h2s without their numbers. */
const TITLES = [
  "Who we are",
  "What this policy covers",
  "Our two roles",
  "What we collect, and why",
  "What we do not collect",
  "Cookies and browser storage",
  "Who we share data with",
  "Where data is stored, and international transfers",
  "How long we keep data",
  "How we protect data",
  "Your rights",
  "Children",
  "Changes to this policy",
  "Language",
  "Contact us and grievance officer",
];

/** Where the policy's "section N" points, by its number. */
const BY_NUMBER: Record<string, string> = {
  ...Object.fromEntries(H2_IDS.map((id, index) => [String(index + 1), id])),
  "4.1": "account",
  "4.2": "cluster-data",
  "4.3": "amoeba",
  "4.4": "zoorikctl",
  "4.5": "logs",
  "4.6": "website",
  "4.7": "email-calls-leads",
  "4.8": "assessment",
  "11.1": "rights-how",
  "11.2": "rights-india",
  "11.3": "rights-eu-uk",
  "11.4": "rights-elsewhere",
  "11.5": "rights-required",
  "11.6": "rights-automated",
};

describe("/privacy anchors", () => {
  it("gives every section id to exactly one section, named by its h2", () => {
    const container = page();
    for (const id of H2_IDS) {
      const found = container.querySelectorAll(`[id="${id}"]`);
      expect(found, id).toHaveLength(1);
      const section = found[0]!;
      expect(section.tagName, id).toBe("SECTION");
      const heading = section.firstElementChild!;
      expect(heading.tagName, id).toBe("H2");
      /* The mock's `*-h` ids: the section is a named region. */
      expect(heading.id, id).toBe(`${id}-h`);
      expect(section, id).toHaveAttribute("aria-labelledby", `${id}-h`);
    }
  });

  it("gives every subsection id to exactly one h3", () => {
    const container = page();
    for (const id of H3_IDS) {
      const found = container.querySelectorAll(`[id="${id}"]`);
      expect(found, id).toHaveLength(1);
      expect(found[0]!.tagName, id).toBe("H3");
    }
    expect(container.querySelectorAll('[id="short-version"]')).toHaveLength(1);
  });

  it("keeps the content's id lists equal to the contract, in document order", () => {
    expect([...privacySectionIds]).toEqual(H2_IDS);
    expect([...privacySubsectionIds]).toEqual(H3_IDS);
    const container = page();
    expect([...container.querySelectorAll(".doc-prose > section")].map((s) => s.id)).toEqual(
      H2_IDS,
    );
    expect([...container.querySelectorAll(".doc-prose h3[id]")].map((h) => h.id)).toEqual(H3_IDS);
  });

  it("points every in-page link at an id that exists", () => {
    const container = page();
    const hashes = [...container.querySelectorAll('a[href^="#"]')].map((a) =>
      a.getAttribute("href")!.slice(1),
    );
    expect(hashes.length).toBeGreaterThan(30);
    for (const id of hashes) expect(container.querySelector(`[id="${id}"]`), id).not.toBeNull();
  });

  it("sends every cross-reference to the section its number names", () => {
    const refs = [...main().querySelectorAll('.doc-prose a[href^="#"]')].map((a) => [
      text(a),
      a.getAttribute("href"),
    ]);
    /* The mock's 30, plus "4.3", "4.4" and "4.7" in §4, less "section 7" of the Act;
       plus version 1.2's three (YouTube in §6 and in §7's table). */
    expect(refs).toHaveLength(35);
    for (const [label, href] of refs) {
      const number = /^(?:[Ss]ections? )?(\d+(?:\.\d)?)$/.exec(label!)?.[1];
      expect(number, label!).toBeDefined();
      expect(href, label!).toBe(`#${BY_NUMBER[number!]}`);
    }
  });

  it("leaves the DPDP Act's own section 7(a) unlinked", () => {
    const basis = main().querySelector("#what-we-collect > h2 + p")!;
    expect(text(basis)).toContain("(section 7(a) of the Act)");
    const links = [...basis.querySelectorAll("a")].map(text);
    expect(links).toEqual(["sections 4.1", "4.3", "4.4", "4.7", "section 11.3"]);
  });
});

describe("/privacy outline", () => {
  it("has one h1 and the hero's two lines, and no date in the hero", () => {
    const container = page();
    expect(container.querySelectorAll("h1")).toHaveLength(1);
    expect(text(container.querySelector("h1"))).toBe("Privacy policy");
    expect(text(container.querySelector(".doc-deck"))).toBe(
      "What we collect, why, and how you can see, correct or delete it.",
    );
    expect(container.querySelector(".doc-hero .doc-date, .doc-hero .doc-crumb, .dl")).toBeNull();
    expect(container.querySelector("a.skip")).toHaveAttribute("href", "#main");
  });

  it("draws the turning mark in its hero, once", () => {
    const hero = page().querySelector("header.doc-hero")!;
    expect(hero.firstElementChild).toHaveClass("zk-glow");
    expect(hero.children[1]).toHaveClass("zk-art");
    expect(hero.ownerDocument.querySelectorAll(".zk-art, .zk-glow")).toHaveLength(2);
  });

  it("opens the reading column with the date line, then the opening paragraph", () => {
    const column = main().querySelector(".doc-main")!;
    const lines = [...column.children].filter((el) => !el.matches("details"));
    expect(lines[0]).toHaveClass("pp-date");
    expect(text(lines[0]!)).toBe("Effective 19 October 2026 · Version 1.4");
    expect(text(lines[1]!)).toMatch(/^This policy explains what personal data Zoorik collects/);
    expect(lines[2]).toHaveAttribute("id", "short-version");
  });

  it("draws an h2 per section, numbered as the policy cross-refers, and nothing below h3", () => {
    const h2s = [...main().querySelectorAll("h2")].map(text);
    expect(h2s).toEqual(TITLES.map((title, index) => `${index + 1}. ${title}`));
    expect(main().querySelectorAll("h4, h5, h6")).toHaveLength(0);
  });

  it("draws 4.1 to 4.8 and 11.1 to 11.6 as h3s, in their sections", () => {
    const container = page();
    const numbers = (id: string) =>
      [...container.querySelectorAll(`#${id} h3`)].map((h) => text(h).split(" ")[0]);
    expect(numbers("what-we-collect")).toEqual([
      "4.1",
      "4.2",
      "4.3",
      "4.4",
      "4.5",
      "4.6",
      "4.7",
      "4.8",
    ]);
    expect(numbers("your-rights")).toEqual(["11.1", "11.2", "11.3", "11.4", "11.5", "11.6"]);
    expect(main().querySelectorAll("h3")).toHaveLength(14);
  });

  it("lists §1 to §15 in the rail and the collapsible, by title, without numbers", () => {
    const container = page();
    const navs = within(container).getAllByRole("navigation", { name: "On this page" });
    expect(navs).toHaveLength(2);
    for (const nav of navs) {
      /* The section list; the rail's "Back to top" follows it. */
      const links = [...nav.querySelectorAll("ol a")];
      expect(links.map((a) => a.getAttribute("href"))).toEqual(H2_IDS.map((id) => `#${id}`));
      expect(links.map(text)).toEqual(TITLES);
    }
  });

  it("puts the short version first, nine lines under a title that is not a heading", () => {
    const column = main();
    const box = column.querySelector(".pp-short")!;
    expect(text(box.querySelector(".pp-short-t"))).toBe("The short version");
    expect(box.querySelectorAll("h1, h2, h3, h4, h5, h6")).toHaveLength(0);
    expect(box.querySelectorAll(":scope > ul > li")).toHaveLength(9);
    expect(box.compareDocumentPosition(column.querySelector("#who-we-are")!)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    /* No band across the page: the summary is inside the column. */
    expect(column.querySelector(".doc-sum")).toBeNull();
  });

  it("ends on §15: no closing assessment row, and #contact is the policy's own", () => {
    const container = page();
    expect(container.querySelector("#assess")).toBeNull();
    const contact = container.querySelectorAll('[id="contact"]');
    expect(contact).toHaveLength(1);
    expect(text(contact[0]!.querySelector("h2"))).toBe("15. Contact us and grievance officer");
    const sections = [...container.querySelectorAll("main .doc-prose > section")];
    expect(sections.at(-1)).toBe(contact[0]);
  });
});

describe("/privacy tables and callouts", () => {
  it("draws the six tables with their roles and a label on every cell", () => {
    const tables = [...main().querySelectorAll("table.doc-tbl")];
    expect(
      tables.map((table) => [
        table.closest("section")!.id,
        [...table.querySelectorAll("th")].map(text),
      ]),
    ).toEqual([
      ["what-we-collect", ["What we keep", "Why", "Legal basis"]],
      ["what-we-collect", ["What", "When", "What it contains"]],
      ["cookies", ["Name", "Type", "What it does", "How long it lasts"]],
      ["cookies", ["Name", "Type", "What it does", "How long it lasts"]],
      ["cookies", ["Name", "Type", "What it does", "How long it lasts"]],
      ["sharing", ["Company", "What it does for us", "What it handles"]],
    ]);
    for (const table of tables) {
      expect(table).toHaveAttribute("role", "table");
      expect(within(table as HTMLElement).getAllByRole("rowgroup")).toHaveLength(2);
      for (const cell of table.querySelectorAll("td")) {
        expect(cell).toHaveAttribute("role", "cell");
        expect(cell).toHaveAttribute("data-label");
        /* One block beside the stacked label, whatever the cell holds. */
        expect(cell.children).toHaveLength(1);
      }
    }
  });

  it("names each table by the bold line above it, in §6", () => {
    const labels = [...main().querySelectorAll("#cookies .pp-k")];
    expect(labels.map(text)).toEqual([
      "On the Coral console",
      "On the Amoeba console",
      "On zoorik.com",
    ]);
    for (const label of labels) expect(label.nextElementSibling?.tagName).toBe("TABLE");
  });

  it("sets the cookie and storage names in code", () => {
    const names = [...main().querySelectorAll("#cookies td:first-child")].map((td) => [
      text(td),
      td.querySelector("code") !== null,
    ]);
    expect(names).toEqual(
      [
        "__Host-coral_session",
        "__Host-coral_oidc_txn",
        "zoorik-cluster",
        "zoorik-connect-os",
        "zk-el-view",
        "_cfPre_tabId",
        "__Host-amoeba_session",
        "zoorik:vm",
        "cf_clearance",
        "__cf_ob",
        "_cfPre_tabId",
      ].map((name) => [name, true]),
    );
  });

  it('draws the long cells as real lists, one clause per item, without the policy\'s "; "', () => {
    const listed = [...main().querySelectorAll("td ul")].map((ul) => [
      text(ul.closest("tr")!.querySelector("td")),
      ul.querySelectorAll("li").length,
    ]);
    expect(listed).toEqual([
      ["Registration", 4],
      ["Inventory", 6],
      ["Events", 4],
      ["Node actions", 4],
      ["Cloudflare", 4],
    ]);
    /* The mock's rule: split at the top-level "; " only, never
       inside brackets, and drop it; each clause keeps its lower-case start and
       its "and …". */
    const registration = [...main().querySelector("td ul")!.querySelectorAll("li")];
    expect(registration.map(text)).toEqual([
      "The agent's id and version",
      "the cluster's name and resource id (an AKS resource id, which includes your Azure subscription id, or an EKS ARN)",
      "the capabilities it detected",
      "and the cloud account from instance metadata (your Azure subscription id and resource group, or your AWS account id and region)",
    ]);
    for (const li of main().querySelectorAll("td li")) expect(text(li)).not.toMatch(/;$/);
  });

  it("draws two callouts in §4.3: the one sentence, and how to stop Amoeba", () => {
    const callouts = [...main().querySelectorAll("aside.doc-call")];
    expect(callouts.map((aside) => aside.className)).toEqual(["doc-call", "doc-call"]);
    expect(callouts.every((aside) => aside.closest("section")!.id === "what-we-collect")).toBe(
      true,
    );
    expect(callouts[0]!.querySelector(".doc-call-t")).toBeNull();
    expect(text(callouts[0]!)).toBe(
      "Once a snapshot is deleted, the data on that original disk cannot be recovered.",
    );
    expect(text(callouts[1]!.querySelector(".doc-call-t"))).toBe("Stopping Amoeba");
    expect(callouts[1]!.querySelector("code")).toHaveTextContent(
      "systemctl disable --now amoeba-agent",
    );
  });

  it("keeps every command-line flag whole, so a phone never splits one across two lines", () => {
    const flags = [...main().querySelectorAll("code .nb")].map(text);
    expect(flags).toEqual(["--now", "--anonymize", "--anonymize-clusters"]);
    for (const code of main().querySelectorAll("code")) {
      const outside = [...code.childNodes]
        .filter((node) => !(node instanceof Element && node.classList.contains("nb")))
        .map((node) => node.textContent)
        .join("");
      expect(outside).not.toMatch(/--/);
    }
  });
});

describe("/privacy links", () => {
  it("writes the address as a mailto in the same tab, and only the site's one address", () => {
    expect(main().querySelectorAll('.doc-main a[href^="mailto:"]')).toHaveLength(10);
    const mail = [...main().querySelectorAll('a[href^="mailto:"]')];
    for (const a of mail) {
      expect(a).toHaveAttribute("href", `mailto:${contactEmail}`);
      expect(text(a)).toBe(contactEmail);
      expect(a.hasAttribute("target")).toBe(false);
    }
  });

  it("opens the four off-site addresses in a new tab, and says so", () => {
    const away = [...main().querySelectorAll('a[href^="http"]')];
    expect(away.map((a) => a.getAttribute("href"))).toEqual([
      "https://privacy.microsoft.com/privacystatement",
      "https://optout.aboutads.info",
      "https://policies.google.com/privacy",
      "https://cal.com/zoorik/talk",
    ]);
    for (const a of away) {
      expect(a).toHaveAttribute("target", "_blank");
      expect(a).toHaveAttribute("rel", "noopener noreferrer");
      expect(a.querySelector(".sr-only")?.textContent).toBe(" (opens in a new tab)");
      /* The mock's arrow, after the address and ahead of the hint. */
      expect(a.querySelector("svg.ext")).toHaveAttribute("aria-hidden", "true");
      expect(a.querySelector("svg.ext")!.nextElementSibling).toHaveClass("sr-only");
    }
    /* The policy's booking page is the site's calendar: if one moves, the policy needs a new version. */
    expect(away[3]).toHaveAttribute("href", calendarUrl);
  });

  it("keeps the product names out of translation, everywhere but code", () => {
    const column = main().querySelector(".doc-main")!;
    const walker = document.createTreeWalker(column, NodeFilter.SHOW_TEXT);
    const loose: string[] = [];
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const parent = node.parentElement!;
      if (parent.closest('[translate="no"], code')) continue;
      if (/\b(Zoorik|Coral|Amoeba|zoorikctl)\b/.test(node.textContent!)) {
        loose.push(node.textContent!);
      }
    }
    expect(loose).toEqual([]);
    /* 13 above §1 and 163 in §1 to §15: the mock's 170, and version 1.2's six
       ("the Coral and Amoeba pages" in the short version, §6 and §11.5), and
       version 1.4's four in §4.8 (Coral and Amoeba, twice each). */
    expect(column.querySelectorAll('[translate="no"]')).toHaveLength(180);
  });
});

describe("/privacy content", () => {
  it("discloses YouTube's player on the two product pages, from version 1.2", () => {
    const container = page();
    const website = container.querySelector("#website")!.parentElement!;
    expect(text(website)).toContain(
      "zoorik.com/coral and zoorik.com/amoeba each show a 2-minute film in YouTube's player, in its privacy-enhanced mode (youtube-nocookie.com).",
    );
    expect(text(website)).toContain("No other page of zoorik.com loads anything from YouTube.");
    expect(container.querySelector('a[href="https://policies.google.com/privacy"]')).not.toBeNull();
    expect(text(container)).not.toContain(
      "which we only link to. It does not cover LinkedIn, YouTube",
    );
    expect(text(container)).toContain("It does not cover LinkedIn or X, which we only link to.");
  });

  it("discloses Microsoft Clarity where the policy does", () => {
    const container = page();
    const website = container.querySelector("#website")!.parentElement!;
    expect(text(website)).toContain(
      "Every page of zoorik.com, this one included, loads Microsoft Clarity once the page has finished loading.",
    );
    expect(
      container.querySelector('a[href="https://privacy.microsoft.com/privacystatement"]'),
    ).not.toBeNull();
    expect(text(container.querySelector(".pp-short"))).toContain(
      "and Microsoft Clarity records how visitors use its pages.",
    );
    const companies = [...container.querySelectorAll("#sharing td:first-child")].map(text);
    expect(companies).toContain("Microsoft (Clarity)");
    expect([...container.querySelectorAll("#retention .pp-k")].map(text)).toContain(
      "Set by Microsoft Clarity (zoorik.com)",
    );
    expect(text(container.querySelector("#rights-required")!.nextElementSibling)).toContain(
      "Cloudflare and Microsoft Clarity still receive what section 4.6 describes",
    );
  });

  it("names the grievance officer in §15", () => {
    const contact = text(page().querySelector("#contact"));
    expect(contact).toContain("Name and title: Sheldon, CXO");
    expect(contact).toContain("We acknowledge a grievance within 2 working days");
  });

  it("ships no placeholder: no [OWNER in the page, its content or the policy", () => {
    /* The draft carried [OWNER: …] placeholders, and none may reach the live
       page. */
    expect(page().innerHTML).not.toContain("[OWNER");
    expect(readFileSync("src/content/privacy.ts", "utf8")).not.toContain("[OWNER");
    expect(POLICY).not.toContain("[OWNER");
    expect(page().querySelector(".ph-chip")).toBeNull();
  });

  it("prints none of the words the site never prints", () => {
    /* Spelled in parts, so this file passes the repo-wide old-name scan. */
    const forbidden = new RegExp(
      [
        ["disk", " storage"],
        ["storage", "tax"],
        ["k8s", "pilot"],
        ["elastic", "vol"],
      ]
        .map((parts) => parts.join(""))
        .join("|"),
      "i",
    );
    expect(text(page())).not.toMatch(forbidden);
  });

  it("carries no script, form or embed of its own", () => {
    const column = main();
    expect(column.querySelectorAll("script, form, iframe, embed, object, video")).toHaveLength(0);
  });
});

/**
 * Split a table cell at its top-level "; " (never inside brackets), as the
 * mock's generator does.
 */
function clauses(cell: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let current = "";
  for (let i = 0; i < cell.length; i++) {
    const ch = cell[i]!;
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (depth === 0 && cell.startsWith("; ", i)) {
      out.push(current);
      current = "";
      i++;
      continue;
    }
    current += ch;
  }
  return [...out, current];
}

/**
 * The policy's words, in order, with its markdown taken away and the mock's four
 * rendering differences applied, and nothing else: the h1 gives way to the hero,
 * the date line reads "Effective … · Version …", the second callout's title drops
 * its period, and a cell of three or more clauses drops its "; ".
 */
function policyWords(markdown: string): string[] {
  const words: string[] = [];
  for (const raw of markdown.split("\n")) {
    let line = raw.trim();
    if (!line || line === "# Privacy Policy" || /^\|(\s*:?-+:?\s*\|)+$/.test(line)) continue;
    const date = /^\*\*Effective date:\*\* (.+) · \*\*Version:\*\* (.+)$/.exec(line);
    if (date) line = `Effective ${date[1]} · Version ${date[2]}`;
    if (line.startsWith("|")) {
      line = line
        .slice(1, -1)
        .split("|")
        .map((cell) => {
          const parts = clauses(cell.trim());
          return parts.length >= 3 ? parts.join(" ") : cell.trim();
        })
        .join(" ");
    }
    line = line
      .replace(/^#{2,3} /, "")
      .replace(/^- /, "")
      .replace(/^\*\*Stopping Amoeba\.\*\*/, "Stopping Amoeba")
      .replace(/\*\*/g, "")
      .replace(/`/g, "");
    words.push(...line.split(/\s+/));
  }
  return words;
}

/** The reading column's words, in order: every block apart, the folded contents and the screen-reader hints left out. */
function pageWords(column: Element): string[] {
  const copy = column.cloneNode(true) as Element;
  for (const el of copy.querySelectorAll("details.doc-toc, .sr-only")) el.remove();
  for (const el of copy.querySelectorAll("p, li, h2, h3, th, td, div, aside, ul, table, tr")) {
    el.append(" ");
  }
  return (copy.textContent ?? "").split(/\s+/).filter(Boolean);
}

describe("/privacy, word for word", () => {
  it("prints the policy and nothing else in its reading column", () => {
    /* 🔴 A word the policy does not have, or a word of it missing, fails here.
       Change the policy at its source first, copy it byte for byte to
       src/content/legal/, then bring src/content/privacy.ts level with it. */
    const column = main().querySelector(".doc-main")!;
    expect(pageWords(column)).toEqual(policyWords(POLICY));
  });

  it("reads its date line and version from the policy", () => {
    expect(POLICY).toMatch(
      /^# Privacy Policy\n\n\*\*Effective date:\*\* 19 October 2026 · \*\*Version:\*\* 1\.4\n/,
    );
    expect(text(main().querySelector(".pp-date"))).toBe("Effective 19 October 2026 · Version 1.4");
  });
});

describe("/privacy sheet", () => {
  const sheet = readFileSync("src/styles/privacy.css", "utf8");

  it("gives the short version's list its marker, indent and bottom margin back from the reset", () => {
    /* The mock's list keeps the browser's disc, 40px indent and 16px bottom
       margin, which Tailwind's preflight removes. */
    expect(sheet).toContain(".pp-short ul{margin:10px 0 16px;padding-left:40px;list-style:disc}");
  });

  it("keeps the mock's spacing above §1 and in a cell's list", () => {
    /* The box sits 8px above §1, and a cell's list keeps the prose list's 8px
       first-item margin. */
    expect(sheet).toMatch(/\.pp-short\{margin:28px 0 8px;/);
    expect(sheet).not.toMatch(/\.doc-tbl li\{/);
  });
});
