import { render, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { amoebaDocs } from "@/config/site";
import { amoebaGuide, amoebaGuideRowIds, amoebaGuideSectionIds } from "@/content/amoeba-guide";
import { learnSlugOf, titleLink } from "@/content/learn/published";
import { documentFacts } from "@/features/documents/document-facts";

/* The nav and the footer read the pathname. */
const pathname = vi.hoisted(() => ({ current: "/amoeba-guide" }));
vi.mock("next/navigation", async (original) => ({
  ...(await original<typeof import("next/navigation")>()),
  usePathname: () => pathname.current,
}));

import AmoebaGuidePage, { metadata } from "@/app/amoeba-guide/page";
import { AmoebaGuide } from "@/features/amoeba-guide/amoeba-guide";

/**
 * `/amoeba-guide` (laid out like the FAQ, as the Coral guide is): the page's
 * own contract on top of the
 * documents kit, which `documents.test.tsx` covers: the groups and their
 * numbered rows, the ids a link made before the rows still lands on, the hero
 * and its PDF, the Updated line and the summary, the Related lines, that no
 * placeholder and no command well is left (1 Nov 2026), the role table's
 * codes, and the words the site never prints. It describes Amoeba at product level (owner, 27 Oct 2026):
 * the move only goes forward, with no soak, no going back and no band.
 *
 * The page component is rendered, not the route: while `amoebaDocs` is off the
 * route answers 404, which the last block checks.
 */

beforeEach(() => {
  pathname.current = "/amoeba-guide";
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

describe("/amoeba-guide groups and rows", () => {
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

  it("keeps the old rows' ids, and says a move only goes forward: no soak, no going back, no band", () => {
    const container = page();
    expect(text(container.querySelector("#the-soak-and-going-back > summary h3"))).toBe(
      "After the switch",
    );
    expect(text(container.querySelector("#going-back-during-the-soak > summary h3"))).toBe(
      "The source disks",
    );
    expect(text(container.querySelector("#go-back-and-resume > summary h3"))).toBe("Resume");
    expect(text(container.querySelector("#remove-amoeba-from-a-vm .gd-lede"))).toContain(
      "A move only goes forward",
    );
    const words = text(container.querySelector("article.gd-main"));
    expect(words).not.toMatch(/\bsoak|\bgo back|\bgoing back|\bband\b|\bonline\b|\bbill/i);
  });

  it("stays at product level: no day counts, session timings, quiet hour or internal command names", () => {
    const words = text(page().querySelector("article.gd-main"));
    /* The one day count is the safety snapshots' 7 days, which /security and the terms print (1 Nov 2026). */
    expect(words.replace(/\b7 days\b/g, "")).not.toMatch(
      /\b\d+ days\b|\bminutes\b|\b12 hours\b|quietest|device remove|governance/i,
    );
    expect(words).toContain("The kernel must be recent and support btrfs");
    expect(words).toContain("The VM’s kernel is too old, or doesn’t support btrfs.");
  });

  it("says at the switch what a process outside a service does, in a bullet of its own", () => {
    const items = [...page().querySelectorAll("#at-the-switch li")].map(text);
    expect(items).toHaveLength(4);
    expect(items[2]).toBe(
      "If any step fails, the agent tries to put the original mounts back and start the services again. The source disks are never written during the switch. Amoeba then tries the switch again, so your services can restart more than once.",
    );
    expect(items[3]).toBe(
      "A process that holds a data mount open outside a systemd service can’t be stopped cleanly, so the switch can’t finish.",
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
    ).toEqual(
      amoebaGuide.sections.flatMap((section) => {
        if (!section.related) return [];
        /* A Learn article is named by its h1, and stands as plain words until it is published. */
        const links = section.related.map(titleLink);
        return [
          [
            section.id,
            `Related: ${links.map((link) => link.text).join(" · ")}`,
            links.flatMap((link) => (link.href ? [link.href] : [])),
          ],
        ];
      }),
    );
    expect(related.map((line) => line.closest("section")!.id)).toEqual([
      "how-amoeba-works",
      "savings-and-figures",
    ]);
    expect(text(related[1]!)).toBe("Related: Free block storage cost assessment");
    /* How Amoeba works closes on a Learn article. */
    const learn = amoebaGuide.sections.find((section) => section.id === "how-amoeba-works")!;
    expect(learn.related!.every((link) => learnSlugOf(link.href) !== null)).toBe(true);
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

describe("/amoeba-guide page", () => {
  it("has one h1 and the deck", () => {
    const container = page();
    expect(container.querySelectorAll("h1")).toHaveLength(1);
    expect(text(container.querySelector("h1"))).toBe("Amoeba product guide");
    expect(container.querySelector("a.skip")).toHaveAttribute("href", "#main");
    expect(text(container.querySelector(".doc-deck"))).toBe(
      "How to onboard a VM, what Amoeba changes, and how you stay in control.",
    );
  });

  it("offers the guide's PDF in one download row, with the facts read from the file", () => {
    const container = page();
    const facts = documentFacts("amoeba-guide");
    const rows = container.querySelectorAll(".doc-hero-grid > .dl > a.dl-r");
    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveAttribute("href", "/docs/amoeba-product-guide.pdf");
    expect(rows[0]).toHaveAttribute("download");
    expect(rows[0]).toHaveAttribute(
      "aria-label",
      `Download the Amoeba product guide, ${facts.spoken}`,
    );
    expect(text(rows[0]!.querySelector(".dl-t"))).toBe("PDF");
    expect(rows[0]!.querySelector(".dl-f")!.textContent).toBe(facts.short);
    /* The guide's own PDF is the page's only download. */
    expect(
      [...container.querySelectorAll('main a[href$=".pdf"], main a[download]')].map((a) =>
        a.getAttribute("href"),
      ),
    ).toEqual(["/docs/amoeba-product-guide.pdf"]);
  });

  it("opens the column on the Updated line and the summary: the product page first", () => {
    const container = page();
    const top = container.querySelector("article.gd-main > .fq-upd")!;
    expect(text(top.querySelector(".doc-updated"))).toBe("Updated 1 November 2026");
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
      "You pick each VM. Per VM, you choose whether shrinks run on their own or wait for you.",
      "Onboarding starts the move, and services on the data mounts restart at the switch. See Moving a VM onto its pool.",
    ]);
    expect(last.querySelector("a")).toHaveAttribute("href", "#moving-a-vm-onto-its-pool");
  });

  it("links within the rows nowhere", () => {
    const container = page();
    expect(container.querySelectorAll(".fq-body a, .gd-lede a, .doc-call a")).toHaveLength(0);
    expect(text(container.querySelector("article.gd-main"))).not.toMatch(/section \d/i);
  });

  it("prints no placeholder and no command well: the twelve “To come” lines went on 1 Nov 2026", () => {
    const container = page();
    expect(container.querySelectorAll(".ph")).toHaveLength(0);
    expect(container.querySelectorAll(".as-well")).toHaveLength(0);
    expect(container.textContent).not.toMatch(/To come|\[OWNER|\{\{PH/);
  });

  it("has two step lists of 4 and 5, three callouts and 15 tables, every cell labelled", () => {
    const container = page();
    expect(
      [...container.querySelectorAll("ol.doc-steps")].map((list) => list.children.length),
    ).toEqual([4, 5]);
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
  it("draws the guide rows from navMenus: Coral alone while the Amoeba guide is held", () => {
    const links = within(
      within(page()).getByRole("navigation", { name: "Choose a product" }),
    ).getAllByRole("link");
    expect(
      links.map((a) => [text(a), a.getAttribute("href"), a.getAttribute("aria-current")]),
    ).toEqual(
      amoebaDocs
        ? [
            ["Coral Kubernetes", "/coral-guide", null],
            ["Amoeba Block storage", "/amoeba-guide", "page"],
          ]
        : [["Coral Kubernetes", "/coral-guide", null]],
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
      ["Coral Kubernetes", "/coral-guide", null],
      ["Amoeba Block storage", "/amoeba-guide", "page"],
    ]);
    vi.doUnmock("@/config/site");
  });
});

describe("the /amoeba-guide route", () => {
  it("titles, describes and canonicalises the page", () => {
    expect(metadata.title).toBe("Amoeba product guide");
    expect(metadata.description).toBe(
      "Amoeba product guide: onboard a VM on Azure or AWS, see how its data moves onto one btrfs pool, how that pool grows and shrinks, and how you stay in control.",
    );
    expect(metadata.alternates).toEqual({ canonical: "/amoeba-guide" });
    expect(metadata).not.toHaveProperty("robots");
    const og = metadata.openGraph as Record<string, unknown>;
    expect(og.title).toBe("Amoeba product guide | Zoorik");
    expect(og.url).toBe("/amoeba-guide");
  });

  it.runIf(!amoebaDocs)("answers 404 while the Amoeba guide is held", () => {
    expect(() => AmoebaGuidePage()).toThrow(
      expect.objectContaining({ digest: "NEXT_HTTP_ERROR_FALLBACK;404" }),
    );
  });
});
