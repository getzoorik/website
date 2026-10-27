import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { amoebaDocs, amoebaOnePager } from "@/config/site";
import { documents, docsHub, readMoreRows, type DocTileEntry } from "@/content/documents";
import { documentFacts } from "@/features/documents/document-facts";

/* The nav and the footer read the pathname. */
vi.mock("next/navigation", () => ({ usePathname: () => "/docs" }));

import DocsPage from "@/app/docs/page";
import { DocTile } from "@/features/documents/doc-tile";

/**
 * `/docs`, the Docs hub, and the doc tile it shares with the Read more row. The
 * facts are never pinned to a figure here: they are read from the files, as the
 * build reads them, and a rebuilt PDF changes them.
 */

afterEach(() => {
  vi.doUnmock("@/config/site");
  vi.resetModules();
});

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();

const page = () => render(<DocsPage />).container;

/** What a page prints beside a PDF: "11 pages · 0.3 MB", each figure bound to its unit. */
const SHORT = /^\d+\u00a0pages? · (\d\.\d\u00a0MB|\d+\u00a0KB)$/;

describe("/docs", () => {
  it("opens on the utility hero: the h1 Product docs and its deck, and nothing else", () => {
    const container = page();
    expect([...container.querySelectorAll("h1")].map(text)).toEqual(["Product docs"]);
    const hero = container.querySelector("main#main > header.hero.doc-hero#top")!;
    expect(text(hero.querySelector(".doc-deck"))).toBe("Read online or download as PDF.");
    /* No switch, no download block, no breadcrumb, no date line on the hub. */
    expect(hero.querySelector(".as-switch, .dl, .doc-crumb, .doc-date, .doc-q")).toBeNull();
    expect(container.querySelector('a.skip[href="#main"]')).not.toBeNull();
  });

  it("holds the groups in one section#docs, Coral first, one per product with a released document", () => {
    const groups = [...page().querySelectorAll("main > section.sec#docs > .wrap > section")];
    /* The products' groups, then Open source. */
    expect(groups.map((group) => group.id)).toEqual([
      ...docsHub.groups.map((g) => g.product),
      "open-source",
    ]);
    expect(groups[0]!.id).toBe("coral");
    for (const group of groups) {
      expect(group).toHaveClass("res-group");
      expect(group).toHaveAttribute("aria-labelledby", `${group.id}-h`);
    }
  });

  it("lists the open projects on the Open source group's first tile, every name kept out of translation", () => {
    const tile = page().querySelector("#open-source .dt")!;
    expect(text(tile.querySelector(".dt-l"))).toBe(
      "zoorikctl, kubernetes-scenarios, the assessment, the Terraform modules and the Helm chart",
    );
    expect([...tile.querySelectorAll('.dt-l [translate="no"]')].map((n) => n.textContent)).toEqual([
      "zoorikctl",
      "kubernetes-scenarios",
    ]);
  });

  it("ends the groups on one line to the articles, at /learn", () => {
    const docs = page().querySelector("main > section.sec#docs > .wrap")!;
    const more = docs.lastElementChild!;
    expect(more.tagName.toLowerCase()).toBe("p");
    expect(more).toHaveClass("res-more");
    const link = more.querySelector("a")!;
    expect(link).toHaveClass("alink");
    expect(link).toHaveAttribute("href", "/learn");
    expect(link).not.toHaveAttribute("target");
    expect(text(link)).toBe("Articles on Kubernetes and block storage cost");
    expect(link.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("heads each group with the mark, the name, its line and Product page, in that order", () => {
    const head = page().querySelector("#coral > .res-head")!;
    expect([...head.children].map((el) => el.tagName.toLowerCase())).toEqual([
      "svg",
      "h2",
      "p",
      "a",
    ]);
    expect(head.querySelector("svg")).toHaveClass("res-mk");
    expect(head.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    const h2 = head.querySelector("h2")!;
    expect(h2).toHaveAttribute("id", "coral-h");
    expect(h2).toHaveAttribute("translate", "no");
    expect(text(h2)).toBe("Coral");
    /* The cloud pair is tied with no-break spaces, as the mock writes it. */
    expect(head.querySelector("p")!.textContent).toBe(
      "Kubernetes cost optimization on AKS\u00a0and\u00a0EKS",
    );
    const link = head.querySelector("a")!;
    expect(link).toHaveClass("alink");
    expect(link).toHaveAttribute("href", "/coral");
    expect(text(link)).toBe("Product page");
    expect(link.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("lists Coral's documents in the mock's words: two pages, the one-pager's head, then the two install guides", () => {
    const tiles = [...page().querySelectorAll("#coral .dt-grid > article.dt")];
    expect(
      tiles.map((tile) => [
        text(tile.querySelector(".dt-t")),
        text(tile.querySelector(".dt-l")),
        tile.querySelector("a.dt-a")?.getAttribute("href") ?? null,
      ]),
    ).toEqual([
      ["Product guide", "Connect, what changes, staying in control", "/coral/guide"],
      ["FAQ", "Sizing, safety, HPA, nodes and autoscalers", "/coral/faq"],
      ["One-pager", "Cost, safety, visibility and an example", null],
      [
        "Install with Helm",
        "The coral-agent chart, for Helm, Argo CD or Flux",
        "/docs/install-coral-with-helm",
      ],
      [
        "Install with Terraform + Helm",
        "The cloud permissions as code, then the chart",
        "/docs/install-coral-with-terraform",
      ],
    ]);
    /* The install guides are pages with no PDF row. */
    expect(tiles[3]!.querySelector(".dt-pdf")).toBeNull();
    expect(tiles[4]!.querySelector(".dt-pdf")).toBeNull();
    /* A page ends on the forward arrow; the one-pager has no page, so no link and no end mark. */
    expect(tiles[0]!.querySelector("a.dt-a > svg.dt-go:not(.is-down)")).not.toBeNull();
    expect(tiles[2]!.querySelector(".dt-h")).not.toBeNull();
    expect(tiles[2]!.querySelector(".dt-h a, .dt-go")).toBeNull();
    for (const icon of page().querySelectorAll("#coral .dt-ic")) {
      expect(icon).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("downloads each PDF under its tile, with the short facts and the full facts in its name", () => {
    const rows = [...page().querySelectorAll("#coral .dt-pdf")];
    expect(rows).toHaveLength(3);
    const links = rows.map((row) => row.querySelectorAll("a"));
    expect(links.map((list) => list.length)).toEqual([1, 1, 1]);
    const ids = ["coral-guide", "coral-faq", "coral-one-pager"] as const;
    const names = ["the Coral product guide", "the Coral FAQ", "the Coral one-pager"];
    rows.forEach((row, i) => {
      const a = row.querySelector("a")!;
      const facts = documentFacts(ids[i]!);
      expect(a).toHaveAttribute("href", documents[ids[i]!].pdf);
      expect(a.getAttribute("href")).toMatch(/^\/docs\/[a-z-]+\.pdf$/);
      expect(a).toHaveAttribute("download");
      expect(a).not.toHaveAttribute("target");
      expect(a).toHaveAttribute("aria-label", `Download ${names[i]}, ${facts.spoken}`);
      expect(a.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
      expect(a.querySelector("small")!.textContent).toBe(facts.short);
      expect(a.querySelector("small")!.textContent).toMatch(SHORT);
    });
    expect(rows.map((row) => row.querySelector("a > span")!.textContent)).toEqual([
      "PDF",
      "FAQ PDF",
      "PDF",
    ]);
  });

  it.runIf(amoebaDocs && amoebaOnePager)(
    "downloads Amoeba's guide and one-pager under their tiles, and says PDF to come under its FAQ",
    () => {
      /* Amoeba's one-pager has no worked example, so its line is its own, not Coral's. */
      expect(
        [...page().querySelectorAll("#amoeba .dt-grid > article.dt")].map((tile) =>
          text(tile.querySelector(".dt-l")),
        ),
      ).toEqual([
        "Onboard, what changes, staying in control",
        "Safety, downtime, expanding, agent and costs",
        "Cost, safety, visibility and how it works",
      ]);
      const rows = [...page().querySelectorAll("#amoeba .dt-pdf")];
      expect(rows).toHaveLength(3);
      const downloads = [
        [rows[0]!, "amoeba-guide", "the Amoeba product guide", "PDF"],
        [rows[2]!, "amoeba-one-pager", "the Amoeba one-pager", "PDF"],
      ] as const;
      for (const [row, id, name, label] of downloads) {
        const a = row.querySelector("a")!;
        const facts = documentFacts(id);
        expect(a).toHaveAttribute("href", documents[id].pdf);
        expect(a).toHaveAttribute("download");
        expect(a).toHaveAttribute("aria-label", `Download ${name}, ${facts.spoken}`);
        expect(row.querySelector("a > span")!.textContent).toBe(label);
        expect(a.querySelector("small")!.textContent).toBe(facts.short);
        expect(a.querySelector("small")!.textContent).toMatch(SHORT);
      }
      expect(rows[0]!.querySelector("a")).toHaveAttribute("href", "/docs/amoeba-product-guide.pdf");
      expect(rows[1]!.querySelector("a")).toBeNull();
      expect(rows[1]!.querySelector("span.dt-none")).toHaveTextContent(/^PDF to come$/);
    },
  );

  it("says each download's facts the way the mock does: PDF, pages, size, paper", () => {
    for (const id of [
      "coral-guide",
      "coral-faq",
      "coral-one-pager",
      "amoeba-guide",
      "amoeba-one-pager",
    ] as const) {
      const { pages, paper, short, spoken } = documentFacts(id);
      expect(spoken).toBe(`PDF, ${short.replace(/\u00a0/g, " ").replace(" · ", ", ")}, ${paper}`);
      expect(short.startsWith(`${pages}\u00a0page`)).toBe(true);
      expect(paper).toBe("A4");
    }
  });

  it("carries no type chip, thumbnail, button or held document", () => {
    const container = page();
    expect(container.querySelector(".res-type, .res-card, .res-open, img")).toBeNull();
    const hrefs = [...container.querySelectorAll("a")].map((a) => a.getAttribute("href"));
    if (!amoebaDocs) {
      expect(hrefs).not.toContain("/amoeba/guide");
      expect(hrefs).not.toContain("/amoeba/faq");
    }
    if (!amoebaOnePager) expect(hrefs).not.toContain("/docs/amoeba-one-pager.pdf");
  });

  it("draws no Amoeba group while every Amoeba document is held, and nothing links to one", () => {
    const container = page();
    const held = !amoebaDocs && !amoebaOnePager;
    expect(container.querySelector("section#amoeba") === null).toBe(held);
    /* Every link into the hub, from the hub itself (the Docs menu and drawer
       are on this page), lands on a group that is here. */
    for (const a of container.querySelectorAll<HTMLAnchorElement>('a[href^="/docs#"]')) {
      const id = a.getAttribute("href")!.slice("/docs#".length);
      expect(container.querySelectorAll(`#${id}`), id).toHaveLength(1);
    }
  });

  it("closes on the closing row for both products, drawn still", () => {
    const container = page();
    expect(text(container.querySelector("#contact p"))).toBe(
      "Thirty minutes with the people who build Coral and Amoeba.",
    );
    expect(container.querySelector("#assess .btn-ink")).toHaveAttribute("href", "/assessment");
    expect(container.querySelectorAll("#assess .rise, #assess [data-i]")).toHaveLength(0);
  });

  it("marks Docs current, and is reached from the Docs menu, the drawer and the footer", () => {
    const container = page();
    const docs = [...container.querySelectorAll(".nv-dd")].find(
      (dd) => dd.querySelector(".nv-lbl, .nv-btn")!.textContent === "Docs",
    )!;
    /* Docs' word and its chevron: both carry the mark, and
       the word, a jump to this page's `#coral` group, is this page. */
    expect(docs.querySelector("a.nv-lbl")).toHaveClass("is-cur");
    expect(docs.querySelector("a.nv-lbl")).toHaveAttribute("href", "/docs#coral");
    expect(docs.querySelector("a.nv-lbl")).toHaveAttribute("aria-current", "page");
    expect(docs.querySelector("button.nv-btn")).toHaveClass("is-cur");
    const menu = [...docs.querySelectorAll(".nv-menu a")];
    /* The foot row to the hub, then the Learn row to the articles. */
    expect(menu.map((a) => a.getAttribute("href"))).toEqual(
      [
        "/docs#coral",
        amoebaDocs || amoebaOnePager ? "/docs#amoeba" : null,
        "/docs",
        "/learn",
        "/open-source",
      ].filter(Boolean),
    );
    expect(menu.at(-3)).toHaveAttribute("aria-current", "page");
    expect(menu.at(-2)).not.toHaveAttribute("aria-current");
    expect(menu.at(-1)).not.toHaveAttribute("aria-current");
    const group = [...container.querySelectorAll(".nd-grp")].find(
      (grp) => grp.querySelector(".nd-h")!.textContent === "Docs",
    )!;
    expect([...group.querySelectorAll("a")].map((a) => a.getAttribute("href"))).toEqual(
      menu.map((a) => a.getAttribute("href")),
    );
    /* The footer's Resources column, after Learn, Case studies, Events, News, Cloud cost optimization tools and Community. */
    const resources = [...container.querySelectorAll(".foot-col")][1]!;
    const docsLink = resources.querySelectorAll("a")[6]!;
    expect(docsLink).toHaveAttribute("href", "/docs");
    expect(docsLink).toHaveTextContent("Docs");
  });

  it("has one h1, then h2s only: the groups', the closing row's and the footer's", () => {
    const container = page();
    expect(container.querySelectorAll("h1")).toHaveLength(1);
    expect(container.querySelectorAll("main h3, main h4")).toHaveLength(0);
    expect([...container.querySelectorAll("#docs h2")].map(text)).toEqual([
      ...docsHub.groups.map((g) => (g.product === "coral" ? "Coral" : "Amoeba")),
      "Open source",
    ]);
  });

  it("prints no Resources label, no date line and no internal document", () => {
    /* The old product names are guarded for all of src/ by page.test.tsx. The
       footer's Resources column is the site's, not the hub's. */
    const container = page();
    expect(container.querySelector("main")!.innerHTML).not.toMatch(/Resources/);
    const html = container.innerHTML;
    expect(html).not.toMatch(/As released|In detail|More detail|Technical/);
    expect(html).not.toMatch(/fq-more|fq-detail/);
  });
});

describe("the doc tile", () => {
  const coral = docsHub.groups.find((g) => g.product === "coral")!;
  const [guide, , onePager] = coral.tiles as [DocTileEntry, DocTileEntry, DocTileEntry];

  it("says PDF to come under a page whose PDF does not exist yet", () => {
    const { container } = render(
      <DocTile
        entry={{
          title: "Product guide",
          line: "Onboard, what changes, staying in control",
          href: "/amoeba/guide",
          pdf: { label: "PDF" },
        }}
        withPdf
      />,
    );
    const row = container.querySelector(".dt-pdf")!;
    expect(row.querySelector("a")).toBeNull();
    expect(row.querySelector("span.dt-none")).toHaveTextContent(/^PDF to come$/);
  });

  it("in the Read more row: a page tile with no PDF row", () => {
    const { container } = render(<DocTile entry={guide} withPdf={false} />);
    expect(container.querySelector(".dt-pdf")).toBeNull();
    expect(container.querySelector("a.dt-a")).toHaveAttribute("href", "/coral/guide");
  });

  it("in the Read more row: the one-pager is a download whose line is its facts", () => {
    const { container } = render(<DocTile entry={onePager} withPdf={false} />);
    const facts = documentFacts("coral-one-pager");
    const a = container.querySelector("article.dt > a.dt-a")!;
    expect(a).toHaveAttribute("href", "/docs/coral-one-pager.pdf");
    expect(a).toHaveAttribute("download");
    expect(a).toHaveAttribute("aria-label", `Download the Coral one-pager, ${facts.spoken}`);
    expect(text(a.querySelector(".dt-t"))).toBe("One-pager");
    expect(a.querySelector(".dt-l")!.textContent).toBe(facts.short);
    expect(a.querySelector("svg.dt-go.is-down")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector(".dt-h, .dt-pdf")).toBeNull();
  });
});

describe("the Read more rows' content", () => {
  it("lists the hub's tiles for a product, with All docs to its group", () => {
    const row = readMoreRows.coral!;
    expect(row.title).toBe("Read more");
    expect(row.allDocs).toEqual({ label: "All docs", href: "/docs#coral" });
    expect(row.tiles.map((tile) => tile.title)).toEqual(["Product guide", "FAQ", "One-pager"]);
  });

  it("has no row for a product with nothing released", () => {
    expect(readMoreRows.amoeba === undefined).toBe(!amoebaDocs && !amoebaOnePager);
  });
});

describe("the hub under each hold of the Amoeba documents", () => {
  async function hubWith(flags: { amoebaDocs: boolean; amoebaOnePager: boolean }) {
    vi.resetModules();
    vi.doMock("@/config/site", async (original) => ({
      ...(await original<typeof import("@/config/site")>()),
      ...flags,
    }));
    return (await import("@/content/documents")).docsHub.groups;
  }

  const amoebaTiles = (groups: Awaited<ReturnType<typeof hubWith>>) =>
    groups
      .find((group) => group.product === "amoeba")
      ?.tiles.map((tile) => [tile.title, tile.href ?? null, tile.pdf?.document ?? null]);

  it("all three held: no Amoeba group", async () => {
    const groups = await hubWith({ amoebaDocs: false, amoebaOnePager: false });
    expect(groups.map((group) => group.product)).toEqual(["coral"]);
  });

  it("guide and FAQ released, one-pager held: their two tiles, the guide's PDF and none yet for the FAQ", async () => {
    const groups = await hubWith({ amoebaDocs: true, amoebaOnePager: false });
    expect(amoebaTiles(groups)).toEqual([
      ["Product guide", "/amoeba/guide", "amoeba-guide"],
      ["FAQ", "/amoeba/faq", null],
    ]);
  });

  it("one-pager released, guide and FAQ held: the one-pager tile alone", async () => {
    const groups = await hubWith({ amoebaDocs: false, amoebaOnePager: true });
    expect(amoebaTiles(groups)).toEqual([["One-pager", null, "amoeba-one-pager"]]);
  });

  it("nothing held: the mock's three tiles, after Coral's group", async () => {
    const groups = await hubWith({ amoebaDocs: true, amoebaOnePager: true });
    expect(groups.map((group) => group.product)).toEqual(["coral", "amoeba"]);
    expect(groups[1]!.line).toBe("Block storage cost optimization on Azure\u00a0and\u00a0AWS");
    expect(groups[1]!.pageLink).toEqual({ label: "Product page", href: "/amoeba" });
    expect(amoebaTiles(groups)).toEqual([
      ["Product guide", "/amoeba/guide", "amoeba-guide"],
      ["FAQ", "/amoeba/faq", null],
      ["One-pager", null, "amoeba-one-pager"],
    ]);
  });
});
