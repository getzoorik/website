import { render, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { amoebaDocs } from "@/config/site";
import { amoebaGuideRowIds, amoebaGuideSectionIds } from "@/content/amoeba-guide";

/* The nav and the footer read the pathname. */
const pathname = vi.hoisted(() => ({ current: "/amoeba/guide" }));
vi.mock("next/navigation", async (original) => ({
  ...(await original<typeof import("next/navigation")>()),
  usePathname: () => pathname.current,
}));

import AmoebaGuidePage, { metadata } from "@/app/amoeba/guide/page";
import { AmoebaGuide } from "@/features/amoeba-guide/amoeba-guide";

/**
 * `/amoeba/guide` (laid out like the FAQ, as the Coral guide is): the page's
 * own contract on top of the
 * documents kit, which `documents.test.tsx` covers: the groups and their
 * numbered rows, the ids a link made before the rows still lands on, the hero
 * with no download, the Updated line and the summary, the Related lines, the
 * 13 placeholders, the connect well, the role table's codes, and the words the
 * site never prints. It keeps the 48-hour soak and going back, as the approved
 * mock does.
 *
 * The page component is rendered, not the route: while `amoebaDocs` is off the
 * route answers 404, which the last block checks.
 */

beforeEach(() => {
  pathname.current = "/amoeba/guide";
});

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();

const page = () => render(<AmoebaGuide />).container;

/** The groups' ids, written out here so the content file cannot redefine the contract. */
const GROUP_IDS = [
  "how-amoeba-works",
  "before-you-start",
  "onboard-a-vm",
  "what-gets-installed",
  "the-console",
  "moving-a-vm-onto-its-pool",
  "expanding-and-shrinking",
  "stay-in-control",
  "savings-and-figures",
  "security-and-data",
  "remove-amoeba-from-a-vm",
];

/** Every row, by its group: a section's opening blocks are its first row, under the mock's name. */
const ROWS: Record<string, readonly string[]> = {
  "how-amoeba-works": ["how-amoeba-works-the-four-steps", "two-stages-on-every-vm"],
  "before-you-start": ["before-you-start-what-you-need"],
  "onboard-a-vm": [
    "onboard-a-vm-step-by-step",
    "which-vms-are-listed",
    "connection-states",
    "if-the-install-fails",
  ],
  "what-gets-installed": [
    "on-the-vm",
    "in-your-azure-subscription",
    "in-your-aws-account",
    "updates",
  ],
  "the-console": ["the-console-the-pages", "status-words"],
  "moving-a-vm-onto-its-pool": [
    "how-the-pool-is-sized",
    "the-phases",
    "at-the-switch",
    "the-soak-and-going-back",
    "if-the-move-pauses",
  ],
  "expanding-and-shrinking": [
    "when-amoeba-expands",
    "how-an-expand-runs",
    "when-amoeba-shrinks",
    "how-a-shrink-runs",
    "what-stops-a-shrink",
  ],
  "stay-in-control": ["settings", "shrinking-by-hand", "go-back-and-resume", "a-careful-start"],
  "savings-and-figures": ["savings-and-figures-the-figures"],
  "security-and-data": [
    "what-the-role-allows",
    "what-leaves-the-vm",
    "how-the-agent-connects",
    "encryption",
    "sign-in",
  ],
  "remove-amoeba-from-a-vm": ["going-back-during-the-soak", "what-amoeba-added"],
};
const ROW_IDS = Object.values(ROWS).flat();

/** Every "To come" on the page, by the row that holds it, in page order. */
const PLACEHOLDERS = [
  ["before-you-start-what-you-need", "the exact Azure roles needed to run the connect script"],
  ["before-you-start-what-you-need", "supported Linux distributions and versions"],
  ["before-you-start-what-you-need", "supported Windows versions and what Amoeba needs on them"],
  [
    "before-you-start-what-you-need",
    "hosts to allow: Zoorik, GitHub release downloads and the distribution’s package mirrors",
  ],
  ["before-you-start-what-you-need", "the Amoeba console address"],
  ["onboard-a-vm-step-by-step", "the Amoeba console address, and how you sign in"],
  ["onboard-a-vm-step-by-step", "the connect script, exactly as the console prints it"],
  ["which-vms-are-listed", "how Windows VMs appear in the onboarding list"],
  [
    "at-the-switch",
    "what happens to writes made on the pool if a late check fails after the services restarted",
  ],
  ["the-soak-and-going-back", "how to restore from a safety snapshot, and who does it"],
  ["when-amoeba-expands", "what you do if a paused pool fills"],
  ["how-an-expand-runs", "typical time from the trigger to the added capacity"],
  ["what-the-role-allows", "when Amoeba reapplies a VM"],
];

describe("/amoeba/guide groups and rows", () => {
  it("draws the 11 sections as groups, each labelled by its h2, with its lede over its rows", () => {
    const container = page();
    const groups = [...container.querySelectorAll("article.gd-main > section.fq-sec")];
    expect(groups.map((group) => group.id)).toEqual(GROUP_IDS);
    for (const group of groups) {
      expect(group.querySelector(":scope > h2")).toHaveAttribute("id", `${group.id}-h`);
      expect(group).toHaveAttribute("aria-labelledby", `${group.id}-h`);
      expect(group.querySelector(":scope > .fq-sec-b > .gd-lede"), group.id).not.toBeNull();
    }
    const chips = within(container).getByRole("navigation", { name: "Sections" });
    expect([...chips.querySelectorAll("a")].map((a) => a.getAttribute("href"))).toEqual(
      GROUP_IDS.map((id) => `#${id}`),
    );
  });

  it("draws 35 numbered rows, closed, numbered on across the groups", () => {
    const container = page();
    for (const [group, rows] of Object.entries(ROWS)) {
      expect(
        [...container.querySelectorAll(`#${group} details.fq.gd-row`)].map((row) => row.id),
        group,
      ).toEqual(rows);
    }
    const rows = [...container.querySelectorAll("details.fq.gd-row")];
    expect(rows.map((row) => row.querySelector(".fq-n")!.textContent)).toEqual(
      rows.map((_, index) => String(index + 1).padStart(2, "0")),
    );
    expect(container.querySelectorAll("details[open]")).toHaveLength(0);
    expect(
      [
        "how-amoeba-works-the-four-steps",
        "before-you-start-what-you-need",
        "onboard-a-vm-step-by-step",
        "the-console-the-pages",
        "savings-and-figures-the-figures",
      ].map((id) => text(container.querySelector(`#${id} > summary > h3`))),
    ).toEqual(["The four steps", "What you need", "Step by step", "The pages", "The figures"]);
  });

  it("gives every id to exactly one element, and keeps the content's lists equal to the contract", () => {
    const container = page();
    for (const id of [...GROUP_IDS, ...ROW_IDS]) {
      expect(container.querySelectorAll(`[id="${id}"]`), id).toHaveLength(1);
    }
    expect([...amoebaGuideSectionIds]).toEqual(GROUP_IDS);
    expect([...amoebaGuideRowIds]).toEqual(ROW_IDS);
  });

  it("keeps the 48-hour soak and going back, as the approved mock does", () => {
    const container = page();
    expect(text(container.querySelector("#the-soak-and-going-back > summary h3"))).toBe(
      "The soak, and going back",
    );
    expect(text(container.querySelector("#going-back-during-the-soak > summary h3"))).toBe(
      "Going back during the soak",
    );
    expect(text(container.querySelector("#remove-amoeba-from-a-vm .gd-lede"))).toContain(
      "or go back within the first 48 h",
    );
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
        "how-amoeba-works",
        "Related: Can you shrink an Azure managed disk?",
        ["/learn/shrink-azure-managed-disk"],
      ],
      [
        "savings-and-figures",
        "Related: Free block storage cost assessment",
        ["/assessment?p=amoeba"],
      ],
    ]);
  });

  it("draws the console table's group as an h3 subhead over a continuation table", () => {
    const subheads = [...page().querySelectorAll("#the-console-the-pages h3.doc-sub")];
    expect(subheads.map(text)).toEqual(["Virtual machine"]);
    expect(subheads[0]).not.toHaveAttribute("id");
    expect(subheads[0]!.nextElementSibling).toHaveClass("doc-tbl", "is-cont");
  });

  it("points every in-page link at an id that exists", () => {
    const container = page();
    const hashes = [...container.querySelectorAll('main a[href^="#"]')].map((a) =>
      a.getAttribute("href")!.slice(1),
    );
    for (const id of hashes) expect(container.querySelector(`[id="${id}"]`), id).not.toBeNull();
  });
});

describe("/amoeba/guide page", () => {
  it("has one h1 and the deck, and no download block: no Amoeba guide PDF exists", () => {
    const container = page();
    expect(container.querySelectorAll("h1")).toHaveLength(1);
    expect(text(container.querySelector("h1"))).toBe("Amoeba product guide");
    expect(container.querySelector("a.skip")).toHaveAttribute("href", "#main");
    expect(text(container.querySelector(".doc-deck"))).toBe(
      "How to onboard a VM, what Amoeba changes, and how you stay in control.",
    );
    expect(container.querySelector(".doc-hero .dl, .doc-hero-grid")).toBeNull();
    expect(container.querySelector('a[href$=".pdf"], a[download]')).toBeNull();
  });

  it("opens the column on the Updated line and the summary: the product page first", () => {
    const container = page();
    const top = container.querySelector("article.gd-main > .fq-upd")!;
    expect(text(top.querySelector(".doc-updated"))).toBe("Updated 9 October 2026");
    const list = top.querySelector("dl.doc-sum")!;
    expect([...list.querySelectorAll("dt")].map(text)).toEqual([
      "Product page",
      "What Amoeba does",
      "What Amoeba never does",
      "You stay in control",
    ]);
    expect(list.querySelector("dd a")).toHaveAttribute("href", "/amoeba");
    const last = [...list.querySelectorAll("dd")][3]!;
    expect([...last.querySelectorAll("p")].map(text)).toEqual([
      "You pick each VM. Per VM, you choose whether shrinks run on their own or wait for you, and the band the pool is held in.",
      "Onboarding starts the move, and services on the data mounts restart at the switch. See Moving a VM onto its pool.",
    ]);
    expect(last.querySelector("a")).toHaveAttribute("href", "#moving-a-vm-onto-its-pool");
  });

  it("links within the rows nowhere", () => {
    const container = page();
    expect(container.querySelectorAll(".fq-body a, .gd-lede a, .doc-call a")).toHaveLength(0);
    expect(text(container.querySelector("article.gd-main"))).not.toMatch(/section \d/i);
  });

  it("carries the 13 placeholders in page order, each its own “To come: ” kept out of snippets", () => {
    const container = page();
    const spans = [...container.querySelectorAll(".ph")];
    expect(
      spans.map((span) => [span.closest("details")!.id, text(span).replace(/^To come: /, "")]),
    ).toEqual(PLACEHOLDERS);
    for (const span of spans) {
      expect(span.tagName).toBe("SPAN");
      expect(span).toHaveAttribute("data-nosnippet");
      expect(span.firstElementChild).toHaveClass("ph-k");
      expect(span.firstElementChild!.textContent).toBe("To come: ");
    }
    expect(container.textContent).not.toMatch(/\[OWNER|\{\{PH/);
  });

  it("draws the connect step's well with its prompt and a placeholder: it wraps, with no copy button", () => {
    const container = page();
    const wells = [...container.querySelectorAll(".as-well")];
    expect(wells).toHaveLength(1);
    const well = wells[0]!;
    expect(well.className).toBe("as-well doc-well");
    expect(well.closest(".doc-steps > li")!.querySelector(".doc-st")!.textContent).toBe(
      "Connect Azure",
    );
    const pre = well.querySelector("pre")!;
    expect(pre.textContent).toBe("$ To come: the connect script, exactly as the console prints it");
    expect(pre.querySelector("i")).toHaveAttribute("aria-hidden", "true");
    expect(pre.querySelector("i + .ph")).not.toBeNull();
    expect(container.querySelector(".as-copy, .doc-well-note, .os")).toBeNull();
  });

  it("has two step lists of 4 and 6, three callouts and 15 tables, every cell labelled", () => {
    const container = page();
    expect(
      [...container.querySelectorAll("ol.doc-steps")].map((list) => list.children.length),
    ).toEqual([4, 6]);
    expect(
      [...container.querySelectorAll(".doc-call-t")].map((title) => [
        (title.closest("details") ?? title.closest("section"))!.id,
        text(title),
      ]),
    ).toEqual([
      ["onboard-a-vm", "Review it first"],
      ["what-the-role-allows", "Good to know"],
      ["remove-amoeba-from-a-vm", "Review it first"],
    ]);
    expect(container.querySelectorAll(".fq-body table.doc-tbl")).toHaveLength(15);
    expect(container.querySelectorAll(".fq-body table.is-cont")).toHaveLength(1);
    for (const cell of container.querySelectorAll(".fq-body td")) {
      expect(cell).toHaveAttribute("data-label");
      expect(cell).toHaveAttribute("role", "cell");
    }
    /* "A careful start" is a plain numbered list, not steps. */
    expect(container.querySelector("#a-careful-start ol:not(.doc-steps)")!.children).toHaveLength(
      5,
    );
  });

  it("sets the role's actions as code, broken after their dots and slashes, two to a cell where the mock has two", () => {
    const container = page();
    const codes = [...container.querySelectorAll("#what-the-role-allows code")];
    expect(codes).toHaveLength(10);
    expect(container.querySelectorAll(".fq-body code wbr")).toHaveLength(32);
    expect(codes[1]!.innerHTML).toBe("Microsoft.<wbr>Compute/<wbr>virtualMachines/<wbr>write");
    const paired = [...container.querySelectorAll("#what-the-role-allows td:first-child")].filter(
      (cell) => cell.querySelectorAll("code").length === 2,
    );
    expect(
      paired.map((cell) => cell.querySelector("div")!.innerHTML.replace(/<wbr>/g, "")),
    ).toEqual([
      "<code>Microsoft.Compute/disks/write</code><br><code>Microsoft.Compute/disks/delete</code>",
      "<code>Microsoft.Compute/snapshots/write</code><br><code>Microsoft.Compute/snapshots/delete</code>",
    ]);
    /* The one other code: stopping the agent, in the last group's lede. */
    expect(text(container.querySelector("#remove-amoeba-from-a-vm .gd-lede code"))).toBe(
      "systemctl disable --now amoeba-agent",
    );
  });

  it("names the agent and the Azure resources with a muted line under each", () => {
    const container = page();
    expect(
      [...container.querySelectorAll("#what-gets-installed td .sub")].map((sub) => [
        text(sub.parentElement!.firstChild as Element),
        text(sub),
      ]),
    ).toEqual([
      ["amoeba-agent", "systemd service amoeba-agent.service"],
      ["Pool disks", "zoorik-amoeba-pool-…"],
      ["Safety snapshots", "zoorik-amoeba-snap-…"],
    ]);
  });

  it("closes with the assessment row for Amoeba", () => {
    const row = page().querySelector("#assess")!;
    expect(row.querySelector('a[href="/assessment?p=amoeba"]')).not.toBeNull();
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
        ["right", "siz"],
        ["rebal", "anc"],
      ]
        .map((parts) => parts.join(""))
        .join("|"),
      "i",
    );
    const words = text(page().querySelector("main")!.querySelector("article")!);
    expect(words).not.toMatch(forbidden);
    expect(words).not.toMatch(/[—–]/);
    expect(words).not.toMatch(/[$€£]\s?\d/);
    expect(words).not.toMatch(/technical|More detail|In detail/i);
  });
});

describe("the [Coral | Amoeba] switch", () => {
  it("draws the header menu's rows: Coral alone while the Amoeba guide is held", () => {
    const links = within(
      within(page()).getByRole("navigation", { name: "Choose a product" }),
    ).getAllByRole("link");
    expect(
      links.map((a) => [text(a), a.getAttribute("href"), a.getAttribute("aria-current")]),
    ).toEqual(
      amoebaDocs
        ? [
            ["Coral Kubernetes", "/coral/guide", null],
            ["Amoeba Block storage", "/amoeba/guide", "page"],
          ]
        : [["Coral Kubernetes", "/coral/guide", null]],
    );
  });

  it("names Amoeba as the current page once the guide is published", async () => {
    /* The menus are worked out from the flag where it is declared, so the
       published menu is given here: the guide menu's two rows, as the mock
       draws them. */
    vi.resetModules();
    vi.doMock("@/config/site", async (original) => {
      const site = await original<typeof import("@/config/site")>();
      return {
        ...site,
        amoebaDocs: true,
        navMenus: site.navMenus.map((menu) =>
          menu.key === "guide"
            ? {
                ...menu,
                rows: [
                  ...menu.rows.filter((row) => row.product !== "amoeba"),
                  { product: "amoeba", href: site.routes.amoebaGuide, line: "" },
                ],
              }
            : menu,
        ),
      };
    });
    const { AmoebaGuide: Published } = await import("@/features/amoeba-guide/amoeba-guide");
    const container = render(<Published />).container;
    const links = [...container.querySelectorAll('nav[aria-labelledby="ax-pick"] a')];
    expect(
      links.map((a) => [text(a), a.getAttribute("href"), a.getAttribute("aria-current")]),
    ).toEqual([
      ["Coral Kubernetes", "/coral/guide", null],
      ["Amoeba Block storage", "/amoeba/guide", "page"],
    ]);
    vi.doUnmock("@/config/site");
  });
});

describe("the /amoeba/guide route", () => {
  it("titles, describes and canonicalises the page in the approved mock's words", () => {
    expect(metadata.title).toBe("Amoeba product guide: Azure managed disks and EBS");
    expect(metadata.description).toBe(
      "How to onboard a VM to Amoeba on Azure or AWS, how its data moves onto one pool, how the pool expands and shrinks online, and how you stay in control.",
    );
    expect(metadata.alternates).toEqual({ canonical: "/amoeba/guide" });
    expect(metadata).not.toHaveProperty("robots");
    const og = metadata.openGraph as Record<string, unknown>;
    expect(og.title).toBe("Amoeba product guide: Azure managed disks and EBS · Zoorik");
    expect(og.url).toBe("/amoeba/guide");
  });

  it.runIf(!amoebaDocs)("answers 404 while the Amoeba guide is held", () => {
    expect(() => AmoebaGuidePage()).toThrow(
      expect.objectContaining({ digest: "NEXT_HTTP_ERROR_FALLBACK;404" }),
    );
  });
});
