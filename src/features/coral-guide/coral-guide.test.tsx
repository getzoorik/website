import { render, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { amoebaDocs } from "@/config/site";
import { coralGuideRowIds, coralGuideSectionIds } from "@/content/coral-guide";
import { documentFacts } from "@/features/documents/document-facts";

/* The nav and the footer read the pathname. */
const pathname = vi.hoisted(() => ({ current: "/coral/guide" }));
vi.mock("next/navigation", () => ({ usePathname: () => pathname.current }));

import CoralGuidePage from "@/app/coral/guide/page";

/**
 * `/coral/guide` (laid out like the FAQ): the page's own contract on top of
 * the documents kit, which
 * `documents.test.tsx` covers: the groups and their numbered rows, the ids a
 * link made before the rows still lands on, the hero, the Updated line and the
 * summary, the Related lines, the cross-references, the install's OS switch and
 * the other wells, the console table's subheads, and the words the site never
 * prints. Its metadata is in `src/app/metadata.test.ts`.
 */

beforeEach(() => {
  pathname.current = "/coral/guide";
  /* A Mac. jsdom's own agent reads "(darwin)", which the mock's rule takes for Windows. */
  vi.spyOn(navigator, "userAgent", "get").mockReturnValue(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
  );
  vi.spyOn(navigator, "platform", "get").mockReturnValue("MacIntel");
});

afterEach(() => {
  vi.restoreAllMocks();
});

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();

const page = () => render(<CoralGuidePage />).container;

/** The groups' ids: the section ids, written out here so the content file cannot redefine the contract. */
const GROUP_IDS = [
  "how-coral-works",
  "before-you-start",
  "connect-a-cluster",
  "what-gets-installed",
  "the-console",
  "workload-optimization",
  "node-optimization",
  "stay-in-control",
  "savings-and-figures",
  "security-and-data",
  "disconnect",
];

/**
 * Every row, by its group: [id, title]. A section's opening blocks are its
 * first row under a name of the mock's; every other row keeps the
 * subsection's id from before the rows.
 */
const ROWS: Record<string, readonly (readonly [string, string])[]> = {
  "how-coral-works": [
    ["how-coral-works-the-four-steps", "The four steps"],
    ["two-engines", "Two engines"],
  ],
  "before-you-start": [["before-you-start-what-you-need", "What you need"]],
  "connect-a-cluster": [
    ["connect-a-cluster-step-by-step", "Step by step"],
    ["what-connect-asks-to-change", "What connect asks to change in your cloud"],
  ],
  "what-gets-installed": [
    ["what-gets-installed-the-components", "The components"],
    ["updates", "Updates"],
  ],
  "the-console": [["the-console-the-pages", "The pages"]],
  "workload-optimization": [
    ["how-sizes-are-worked-out", "How sizes are worked out"],
    ["turn-it-on", "Turn it on"],
    ["built-in-policies", "Built-in policies"],
    ["custom-policies", "Custom policies"],
    ["how-a-workload-gets-its-policy", "How a workload gets its policy"],
    ["status-words", "Status words"],
    ["per-workload-settings", "Per-workload settings"],
    ["hpas-and-vpas", "HPAs and VPAs"],
  ],
  "node-optimization": [
    ["consolidation", "Consolidation"],
    ["the-evictor", "The Evictor"],
    ["how-pods-are-moved", "How pods are moved"],
    ["nodes-held", "Nodes held"],
    ["rebalancing", "Rebalancing"],
  ],
  "stay-in-control": [
    ["switches", "Switches"],
    ["labels-and-annotations", "Labels and annotations"],
    ["a-careful-start", "A careful start"],
  ],
  "savings-and-figures": [["savings-and-figures-the-figures", "The figures"]],
  "security-and-data": [
    ["what-leaves-your-cluster", "What leaves your cluster"],
    ["what-never-leaves", "What never leaves"],
    ["how-it-connects", "How it connects"],
    ["the-live-migration-daemon", "The live-migration daemon"],
    ["sign-in", "Sign-in"],
  ],
  disconnect: [
    ["disconnect-the-command", "The command"],
    ["what-stays", "What stays"],
  ],
};
const ROW_IDS = Object.values(ROWS).flatMap((rows) => rows.map(([id]) => id));

describe("/coral/guide groups and rows", () => {
  it("draws the 11 sections as groups, each labelled by its h2 and named in the phone's chips", () => {
    const container = page();
    const groups = [...container.querySelectorAll("article.gd-main > section.fq-sec")];
    expect(groups.map((group) => group.id)).toEqual(GROUP_IDS);
    for (const group of groups) {
      expect(group.querySelector(":scope > h2")).toHaveAttribute("id", `${group.id}-h`);
      expect(group).toHaveAttribute("aria-labelledby", `${group.id}-h`);
      /* Every section opens on its lede, over its rows. */
      expect(group.querySelector(":scope > .fq-sec-b > .gd-lede"), group.id).not.toBeNull();
    }
    const chips = within(container).getByRole("navigation", { name: "Sections" });
    expect([...chips.querySelectorAll("a")].map((a) => [a.getAttribute("href"), text(a)])).toEqual(
      groups.map((group) => [`#${group.id}`, text(group.querySelector("h2"))]),
    );
  });

  it("draws 32 numbered rows, closed, numbered on across the groups", () => {
    const container = page();
    for (const [group, rows] of Object.entries(ROWS)) {
      const found = [...container.querySelectorAll(`#${group} details.fq.gd-row`)];
      expect(
        found.map((row) => [row.id, text(row.querySelector(":scope > summary > h3"))]),
        group,
      ).toEqual(rows);
    }
    const rows = [...container.querySelectorAll("details.fq.gd-row")];
    expect(rows.map((row) => row.querySelector(".fq-n")!.textContent)).toEqual(
      rows.map((_, index) => String(index + 1).padStart(2, "0")),
    );
    expect(container.querySelectorAll("details[open]")).toHaveLength(0);
    for (const row of rows) {
      expect(row.querySelector(":scope > .fq-body")).toHaveClass("doc-prose");
    }
  });

  it("gives every id to exactly one element, and keeps the content's lists equal to the contract", () => {
    const container = page();
    for (const id of [...GROUP_IDS, ...ROW_IDS]) {
      expect(container.querySelectorAll(`[id="${id}"]`), id).toHaveLength(1);
    }
    expect([...coralGuideSectionIds]).toEqual(GROUP_IDS);
    expect([...coralGuideRowIds]).toEqual(ROW_IDS);
  });

  it("keeps the callout of “Connect a cluster” open over its rows", () => {
    const callouts = [...page().querySelectorAll(".fq-sec-b > aside.doc-call")];
    expect(
      callouts.map((aside) => [
        aside.closest("section")!.id,
        text(aside.querySelector(".doc-call-t")),
      ]),
    ).toEqual([["connect-a-cluster", "Review it first"]]);
    expect(callouts[0]!.nextElementSibling).toHaveClass("fq-list");
  });

  it("closes two groups on a Related line to Learn and the assessment", () => {
    const related = [...page().querySelectorAll(".fq-sec-b > p.doc-related")];
    expect(
      related.map((line) => [
        line.closest("section")!.id,
        text(line),
        [...line.querySelectorAll("a")].map((a) => a.getAttribute("href")),
      ]),
    ).toEqual([
      [
        "workload-optimization",
        "Related: VPA vs HPA: rebalance first, then scale out · Coral and the native Kubernetes autoscalers",
        ["/learn/vpa-vs-hpa", "/learn/coral-and-native-autoscalers"],
      ],
      ["savings-and-figures", "Related: Free AKS and EKS cost assessment", ["/assessment?p=coral"]],
    ]);
    for (const line of related) expect(line.previousElementSibling).toHaveClass("fq-list");
  });

  it("points every in-page link at an id that exists", () => {
    const container = page();
    const hashes = [...container.querySelectorAll('main a[href^="#"]')].map((a) =>
      a.getAttribute("href")!.slice(1),
    );
    for (const id of hashes) expect(container.querySelector(`[id="${id}"]`), id).not.toBeNull();
  });
});

describe("/coral/guide page", () => {
  it("has one h1, the switch and the deck, a skip link and a main", () => {
    const container = page();
    expect(container.querySelectorAll("h1")).toHaveLength(1);
    expect(text(container.querySelector("h1"))).toBe("Coral product guide");
    expect(container.querySelector("a.skip")).toHaveAttribute("href", "#main");
    expect(container.querySelector("main#main")).not.toBeNull();
    const links = within(
      within(container).getByRole("navigation", { name: "Choose a product" }),
    ).getAllByRole("link");
    expect(
      links.map((a) => [text(a), a.getAttribute("href"), a.getAttribute("aria-current")]),
    ).toEqual([
      ["Coral Kubernetes", "/coral/guide", "page"],
      /* Amoeba's item appears the day `amoebaDocs` publishes its guide. */
      ...(amoebaDocs ? [["Amoeba Block storage", "/amoeba/guide", null]] : []),
    ]);
    expect(text(container.querySelector(".doc-deck"))).toBe(
      "How to connect a cluster, what Coral changes, and how you stay in control.",
    );
    expect(
      container.querySelector(".doc-date, .doc-crumb, .doc-q, .doc-rail, .doc-toc"),
    ).toBeNull();
  });

  it("offers the guide's PDF in one download row, with the facts read from the file", () => {
    const facts = documentFacts("coral-guide");
    const rows = page().querySelectorAll(".doc-hero .dl a.dl-r");
    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveAttribute("href", "/docs/coral-product-guide.pdf");
    expect(rows[0]).toHaveAttribute("download");
    expect(rows[0]).toHaveAttribute(
      "aria-label",
      `Download the Coral product guide, ${facts.spoken}`,
    );
    expect(text(rows[0]!.querySelector(".dl-t"))).toBe("PDF");
    expect(rows[0]!.querySelector(".dl-f")!.textContent).toBe(facts.short);
  });

  it("opens the column on the Updated line and the summary: the product page first", () => {
    const container = page();
    const top = container.querySelector("article.gd-main > .fq-upd")!;
    expect(top).toBe(container.querySelector("article.gd-main")!.firstElementChild);
    expect(text(top.querySelector(".doc-updated"))).toBe("Updated 9 October 2026");
    const list = top.querySelector("dl.doc-sum")!;
    expect([...list.querySelectorAll("dt")].map(text)).toEqual([
      "Product page",
      "What Coral does",
      "What Coral never does",
      "You stay in control",
    ]);
    expect(list.querySelector("h2, h3")).toBeNull();
    expect(list.querySelector("dd a")).toHaveAttribute("href", "/coral");
    expect(text(list.querySelector("dd a"))).toBe("Kubernetes cost optimization on AKS and EKS");
    const last = [...list.querySelectorAll("dd")][3]!;
    expect([...last.querySelectorAll("p")].map(text)).toEqual([
      "Nothing is resized until you switch on “Automatically optimize”. Every engine has its own switch.",
      "Node optimization and the Evictor start at install. For a careful start, see “Stay in control”.",
    ]);
    expect(last.querySelector("a")).toHaveAttribute("href", "#stay-in-control");
  });

  it("reads cross-references as the section's name, never a section number", () => {
    const container = page();
    const column = container.querySelector("article.gd-main")!;
    expect(text(column)).not.toMatch(/section \d/i);
    const refs = [...column.querySelectorAll('a[href^="#"]')]
      .filter((a) => !a.closest(".fq-chips"))
      .map((a) => [text(a), a.getAttribute("href")]);
    expect(refs).toEqual([
      /* the summary's, then the first step's */
      ["“Stay in control”", "#stay-in-control"],
      ["“Stay in control”", "#stay-in-control"],
      ["Per-workload settings", "#per-workload-settings"],
      ["Per-workload settings", "#per-workload-settings"],
    ]);
  });

  it("installs under the OS switch, the one copyable well; connect, disconnect and the YAML have no button", () => {
    const container = page();
    const step = [
      ...container.querySelectorAll("#connect-a-cluster-step-by-step .doc-steps > li"),
    ][2]!;
    expect(text(step.querySelector(".doc-st"))).toBe("Install zoorikctl");
    const group = within(step as HTMLElement).getByRole("radiogroup", { name: "Operating system" });
    expect(within(group).getAllByRole("radio").map(text)).toEqual(["macOS", "Linux", "Windows"]);
    expect(step.querySelector(".os pre")!.textContent).toBe(
      "$ brew tap getzoorik/tap\n$ brew trust getzoorik/tap\n$ brew install zoorikctl",
    );
    const buttons = [...container.querySelectorAll(".doc-prose .as-copy")];
    expect(buttons.map((button) => button.getAttribute("aria-label"))).toEqual([
      "Copy the macOS command",
    ]);
    const bare = [...container.querySelectorAll(".doc-prose .as-well")].filter(
      (well) => !well.querySelector("button"),
    );
    expect(bare.map((well) => [well.className, well.querySelector("pre")!.textContent])).toEqual([
      [
        "as-well doc-well is-line",
        '$ zoorikctl cluster connect --connect-token="zoorik_v1_…" --api-region="us"',
      ],
      ["as-well doc-well is-yaml", expect.stringMatching(/^metadata:\n {2}annotations:\n/)],
      ["as-well doc-well is-line", "$ zoorikctl cluster disconnect --kube-context <name>"],
    ]);
    expect(text(container.querySelector(".doc-well-note"))).toBe(
      "Your own command, with its one-time token, comes from the console’s “Connect cluster” dialog.",
    );
  });

  it("breaks inline code where the mock does, and keeps flags and short names whole", () => {
    const container = page();
    const login = [...container.querySelectorAll(".doc-prose code")].find(
      (code) => code.textContent === "zoorik.com/login",
    )!;
    expect(login.innerHTML).toBe("zoorik.<wbr>com/<wbr>login");
    const grant = [...container.querySelectorAll(".doc-prose code")].find(
      (code) => code.textContent === "zoorikctl cluster grant-node-deletion",
    )!;
    expect([...grant.querySelectorAll(".nb")].map(text)).toEqual(["grant-node-deletion"]);
  });

  it("draws the console table's groups as h3 subheads over continuation tables", () => {
    const section = page().querySelector("#the-console-the-pages")!;
    const subheads = [...section.querySelectorAll("h3.doc-sub")];
    expect(subheads.map(text)).toEqual(["Workload optimization", "Node optimization", "Cluster"]);
    for (const subhead of subheads) {
      expect(subhead).not.toHaveAttribute("id");
      expect(subhead.nextElementSibling).toHaveClass("doc-tbl", "is-cont");
    }
  });

  it("labels every table cell with its column, for the stacked layout", () => {
    const container = page();
    expect(container.querySelectorAll(".doc-prose table.doc-tbl")).toHaveLength(15);
    for (const cell of container.querySelectorAll(".doc-prose td")) {
      expect(cell).toHaveAttribute("data-label");
      expect(cell).toHaveAttribute("role", "cell");
    }
  });

  it("closes with the assessment row for Coral", () => {
    const row = page().querySelector("#assess")!;
    expect(row.querySelector('a[href="/assessment?p=coral"]')).not.toBeNull();
    expect(row.previousElementSibling).toHaveClass("sec", "doc-body");
  });

  it("prints none of the words the site never prints, and no price", () => {
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
    const words = text(page());
    expect(words).not.toMatch(forbidden);
    expect(words).not.toMatch(/[$€£]\s?\d/);
  });
});
