import { render, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { securityGroups } from "@/content/security";

/* The nav and the footer read the pathname. */
vi.mock("next/navigation", () => ({ usePathname: () => "/security" }));

import SecurityRoute from "@/app/security/page";

/**
 * `/security`: the summary open over the rows, the eleven sections as numbered
 * rows in three groups, the ids a link names, the tables, the callout and the
 * links out, and what the page never carries. Its metadata is in
 * `src/app/metadata.test.ts`.
 */

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();

const page = (): HTMLElement => render(<SecurityRoute />).container;

/* The contract, written out here so the content file cannot redefine it. */
const GROUPS = [
  ["sec-coral", "Coral", ["coral-in-your-cluster", "coral-permissions", "coral-data"]],
  [
    "sec-amoeba",
    "Amoeba",
    ["amoeba-on-your-vms", "amoeba-permissions", "amoeba-data", "what-amoeba-deletes"],
  ],
  ["sec-access", "Access and data", ["sign-in", "where-data-is-kept", "sub-processors", "report"]],
] as const;

describe("/security", () => {
  it("has one h1 and the deck, a skip link and a main, and no closing row", () => {
    const root = page();
    expect(root.querySelectorAll("h1")).toHaveLength(1);
    expect(text(root.querySelector("h1"))).toBe("Security and data handling");
    expect(text(root.querySelector(".doc-deck"))).toBe(
      "What each product may change, what it sends us, and where we keep it.",
    );
    expect(root.querySelector("a.skip")).toHaveAttribute("href", "#main");
    expect(root.querySelectorAll("main#main")).toHaveLength(1);
    expect(root.querySelector("#assess, .as-switch, .doc-hero .dl")).toBeNull();
  });

  it("keeps the Updated line and the summary open over the rows", () => {
    const root = page();
    const top = root.querySelector("article.gd-main > .fq-upd.gd-top > .pp-prose")!;
    /* 30 Oct 2026: the Trust center's link in Report a security issue moved the day. */
    expect(text(top.querySelector(".doc-updated"))).toBe("Updated 30 October 2026");
    const summary = top.querySelector("#summary")!;
    expect(text(summary.querySelector(".sc-sum-t"))).toBe("Summary");
    expect([...summary.querySelectorAll("dt")].map(text)).toEqual([
      "In your cloud",
      "Connections",
      "What never leaves",
      "Where data lives",
      "Sign-in",
      "Report an issue",
    ]);
    expect(summary.querySelector("dd a")).toHaveAttribute("href", "mailto:founders@zoorik.com");
    expect(top.querySelector("details, h2, h3")).toBeNull();
  });

  it("draws the eleven sections as numbered rows, closed, in three groups", () => {
    const root = page();
    const groups = [...root.querySelectorAll("article.gd-main > section.fq-sec")];
    expect(
      groups.map((group) => [
        group.id,
        text(group.querySelector(":scope > h2")),
        [...group.querySelectorAll("details.fq.gd-row")].map((row) => row.id),
      ]),
    ).toEqual(GROUPS.map(([id, name, rows]) => [id, name, [...rows]]));
    const rows = [...root.querySelectorAll("details.fq.gd-row")];
    expect(rows.map((row) => row.querySelector(".fq-n")!.textContent)).toEqual(
      rows.map((_, index) => String(index + 1).padStart(2, "0")),
    );
    expect(rows.map((row) => text(row.querySelector("summary h3")))).toEqual([
      "Coral in your cluster",
      "Coral permissions",
      "What leaves a Coral cluster",
      "Amoeba on your VMs",
      "Amoeba permissions",
      "What leaves a VM",
      "What Amoeba deletes",
      "Sign-in and access",
      "Where data is kept",
      "Sub-processors",
      "Report a security issue",
    ]);
    expect(root.querySelectorAll("details[open]")).toHaveLength(0);
    expect(securityGroups.map((group) => group.id)).toEqual(GROUPS.map(([id]) => id));
    const chips = within(root).getByRole("navigation", { name: "Sections" });
    expect([...chips.querySelectorAll("a")].map((a) => [a.getAttribute("href"), text(a)])).toEqual(
      GROUPS.map(([id, name]) => [`#${id}`, name]),
    );
  });

  it("opens the row an address names", () => {
    window.history.replaceState(null, "", "/security#report");
    const root = page();
    expect(root.querySelector<HTMLDetailsElement>("details#report")!.open).toBe(true);
    window.history.replaceState(null, "", "/security");
  });

  it("keeps the product names out of translation, in the rows' titles and their text", () => {
    const root = page();
    const title = root.querySelector("#coral-in-your-cluster summary h3")!;
    expect(title.innerHTML).toBe('<span translate="no">Coral</span> in your cluster');
    expect(root.querySelector('#coral-permissions .fq-body span[translate="no"]')).not.toBeNull();
  });

  it("draws its sub-headings as h4s, its four tables stacked with empty cells left empty, and one callout", () => {
    const root = page();
    expect([...root.querySelectorAll("#coral-permissions h4.doc-sub")].map((h) => text(h))).toEqual(
      ["In Kubernetes", "On AKS", "On EKS", "Connect"],
    );
    const tables = [...root.querySelectorAll(".fq-body table.doc-tbl.nw-tbl")];
    expect(tables.map((table) => table.closest("details")!.id)).toEqual([
      "coral-in-your-cluster",
      "amoeba-permissions",
      "amoeba-permissions",
      "sub-processors",
    ]);
    const empty = [...root.querySelectorAll("#coral-in-your-cluster td")].filter(
      (cell) => cell.childNodes.length === 0,
    );
    expect(empty.map((cell) => cell.getAttribute("data-label"))).toEqual(["Runs as", "Runs as"]);
    const callouts = [...root.querySelectorAll("aside.doc-call")];
    expect(callouts).toHaveLength(1);
    expect(callouts[0]).toHaveClass("pp-call");
    expect(text(callouts[0]!)).toBe(
      "Once a safety snapshot is deleted, the data on that original disk can’t be recovered.",
    );
  });

  it("links out to the guide, the legal pages and the Trust center, and nowhere else", () => {
    const links = [...page().querySelectorAll("article.gd-main a")].filter(
      (a) => !a.closest(".fq-chips"),
    );
    expect(links.map((a) => [text(a), a.getAttribute("href")])).toEqual([
      ["founders@zoorik.com", "mailto:founders@zoorik.com"],
      ["What connect asks to change", "/coral-guide#what-connect-asks-to-change"],
      ["Every retention period", "/privacy#retention"],
      ["privacy policy", "/privacy#sharing"],
      ["founders@zoorik.com", "mailto:founders@zoorik.com"],
      ["Privacy policy", "/privacy"],
      ["Terms of use", "/terms"],
      ["Trust center", "/trust"],
    ]);
    for (const a of links) expect(a).not.toHaveAttribute("target");
  });

  /* The old names are spelled in halves, as in `src/app/page.test.tsx`. */
  it("ships no placeholder, no old product name and no price", () => {
    const all = page().textContent ?? "";
    expect(all).not.toMatch(/\[OWNER|To come|\{\{PH/);
    const forbidden = new RegExp(
      [
        ["storage", "tax"],
        ["elastic", "vol"],
        ["k8s", "pilot"],
        ["disk", " storage"],
      ]
        .map(([head, tail]) => head + tail)
        .join("|"),
      "i",
    );
    expect(all).not.toMatch(forbidden);
    expect(all).not.toMatch(/[$€£₹]\s?\d|\b(USD|EUR|INR)\b/);
  });
});
