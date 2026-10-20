import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { caseStudiesHub, caseStudy, type CaseStudyCard } from "@/content/case-studies";
import { documents } from "@/content/documents";

/* The nav and the footer read the pathname. */
const pathname = vi.hoisted(() => ({ current: "/case-studies" }));
vi.mock("next/navigation", () => ({ usePathname: () => pathname.current }));

import CaseStudiesRoute, { metadata as hubMeta } from "@/app/case-studies/page";
import CaseStudyRoute, { metadata as studyMeta } from "@/app/case-studies/coral-dev-cluster/page";
import { CaseStudiesHub } from "@/features/case-studies/case-studies-hub";

/**
 * The case studies: the metadata, the hub's library (one card per study, the
 * product filter only once the studies cover two products), the study's hero
 * and download, the result band, the six numbered sections in /security's
 * frame, the drawings, the closing row for Coral, no placeholder, and their one
 * place on the site: the footer's Resources column, never the header. Their
 * sitemap entries are in `src/app/sitemap.test.ts`; the PDF's file and header
 * in `src/features/documents/document-facts.test.ts`.
 */

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();

const hub = () => {
  pathname.current = "/case-studies";
  return render(<CaseStudiesRoute />).container;
};
const study = () => {
  pathname.current = "/case-studies/coral-dev-cluster";
  return render(<CaseStudyRoute />).container;
};

const PDF = "/docs/coral-case-study-dev-cluster.pdf";
/** A download's name carries the file's facts, read from it at build: "PDF, 5 pages, 0.2 MB, A4". */
const SPOKEN = /^Download the case study, PDF, \d+ pages?, \d\.\d MB, A4$/;

describe("the case studies' metadata", () => {
  it("titles, describes and canonicalises the hub in the mock's words", () => {
    /* "Validation Labs by Zoorik" already names the company, so no " · Zoorik" after it. */
    expect(hubMeta.title).toEqual({ absolute: "Validation Labs by Zoorik" });
    expect(hubMeta.description).toBe("What Coral does on real clusters, with the figures.");
    expect(hubMeta.alternates).toEqual({ canonical: "/case-studies" });
    expect(hubMeta).not.toHaveProperty("robots");
    expect(hubMeta.openGraph).toMatchObject({
      url: "/case-studies",
      title: "Validation Labs by Zoorik",
    });
  });

  it("titles, describes and canonicalises the study in the mock's words", () => {
    expect(studyMeta.title).toBe(
      "Case study: how we reduced our own cluster’s machine bill by 58%",
    );
    expect(studyMeta.description).toBe(
      "Before we ask anyone to trust Coral with their cluster, we run it on ours. Eight days after we connected it, our AKS development cluster cost $154.76 a month instead of $368.65.",
    );
    expect(studyMeta.alternates).toEqual({ canonical: "/case-studies/coral-dev-cluster" });
    expect(studyMeta.openGraph).toMatchObject({
      url: "/case-studies/coral-dev-cluster",
      title: "Case study: how we reduced our own cluster’s machine bill by 58% · Zoorik",
    });
  });
});

describe("/case-studies", () => {
  /* A second product's study, for the tests only: the filter is drawn once the studies cover two products. */
  const amoebaStudy: CaseStudyCard = {
    product: "amoeba",
    href: "/case-studies/amoeba-test-study",
    kicker: "Amoeba · Azure · Test",
    title: "A test study",
    line: "A line for the test study.",
    tags: ["Test"],
    figure: "−1%",
    before: { value: 2, label: "$2.00" },
    after: { value: 1, label: "$1.00" },
    cap: "a test caption",
  };
  const both = () => {
    pathname.current = "/case-studies";
    return render(<CaseStudiesHub studies={[...caseStudiesHub.studies, amoebaStudy]} />).container;
  };
  const library = (container: HTMLElement) =>
    container.querySelector(
      "main > section.sec.cx-sec[aria-label='Validation Labs by Zoorik'] > .wrap",
    )!;

  it("opens on the utility hero", () => {
    const hero = hub().querySelector("main header.hero.doc-hero#top")!;
    expect(text(hero.querySelector("h1"))).toBe("Validation Labs by Zoorik");
    expect(hero.querySelector("h1 [translate='no']")).toHaveTextContent("Zoorik");
    expect(text(hero.querySelector(".doc-deck"))).toBe(
      "What Coral does on real clusters, with the figures. We start with our own.",
    );
  });

  it("draws one card per study in the list, then Your cluster next", () => {
    const grid = library(hub()).querySelector(":scope > .cx-grid")!;
    const cards = [...grid.querySelectorAll(":scope > article.cx-card")];
    expect(cards).toHaveLength(caseStudiesHub.studies.length);
    expect(caseStudiesHub.studies).toHaveLength(1);
    expect(cards[0]).toHaveAttribute("data-p", "coral");
    expect(cards[0]).not.toHaveAttribute("hidden");
    expect(grid.lastElementChild).toHaveClass("cx-next");
  });

  it("draws the Coral study's card with the study's own title and figures", () => {
    const card = hub().querySelector("article.cx-card")!;
    const cover = card.querySelector(":scope > a.cx-cover")!;
    expect(cover).toHaveAttribute("href", "/case-studies/coral-dev-cluster");
    /* The same link as the title: hidden from a screen reader and the keyboard, as the mock marks it. */
    expect(cover).toHaveAttribute("aria-hidden", "true");
    expect(cover).toHaveAttribute("tabindex", "-1");
    expect(text(cover.querySelector(".cx-big"))).toBe("−58%");
    expect(text(cover.querySelector(".cx-big"))).toBe(caseStudy.band.stats[0].value);
    const bars = [...cover.querySelectorAll(".cx-bars > span")];
    expect(bars.map((bar) => [bar.className, text(bar.querySelector("em"))])).toEqual([
      ["cx-b1", "$368.65"],
      ["cx-b2", "$154.76"],
    ]);
    /* The bill after on the bill before's scale, to a tenth as the mock prints it: 154.76 / 368.65 = 42.0%
       (the style reads it back without the trailing zero). */
    expect(bars.map((bar) => (bar.querySelector("i") as HTMLElement).style.width)).toEqual([
      "100%",
      "42%",
    ]);
    expect(text(cover.querySelector(".cx-cap"))).toBe("machine bill a month, before and after");

    const body = card.querySelector(":scope > .cx-cbody")!;
    const kicker = body.querySelector("p.cx-kick")!;
    expect(text(kicker)).toBe("Validation Lab · Coral on AKS · October 2026");
    /* The month is the study's own date's ("12 October 2026"), not typed again. */
    expect(text(kicker)).toMatch(new RegExp(` · ${caseStudy.band.date.replace(/^\d+ /, "")}$`));
    expect(kicker.querySelector("span[translate='no']")).toHaveTextContent("Coral");
    const title = body.querySelector("h3 > a")!;
    expect(title).toHaveAttribute("href", "/case-studies/coral-dev-cluster");
    expect(text(title)).toBe("How we reduced our own cluster’s machine bill by 58%");
    expect(text(title)).toBe(`${caseStudy.hero.title} ${caseStudy.hero.titleGreen}`);
    expect(text(body.querySelector("p.cx-line"))).toBe(
      "Our own development cluster: $154.76 a month instead of $368.65, eight days after we connected Coral.",
    );
    /* "eight days" in the line is the study's "8 days" from connecting Coral to the result. */
    expect(caseStudy.band.stats[3]).toMatchObject({ value: "8 days" });
    const chips = [...body.querySelectorAll(".cx-chips > span")].map(text);
    expect(chips).toEqual(["Workload optimization", "Node optimization", "Rebalancing"]);
    expect(chips).toEqual(caseStudy.connect.features.map((feature) => feature.title));
    const read = body.querySelector(".cx-cfoot > a.cx-read")!;
    expect(read).toHaveAttribute("href", "/case-studies/coral-dev-cluster");
    expect(text(read)).toBe("Read the case study");
    expect(read.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("offers the study's PDF from the site's one entry for it", () => {
    const pdf = hub().querySelector("article.cx-card .cx-cfoot > a.cx-pdf")!;
    expect(pdf).toHaveAttribute("href", PDF);
    expect(pdf).toHaveAttribute("href", documents["coral-case-study"].pdf);
    expect(pdf).toHaveAttribute("download");
    expect(pdf).not.toHaveAttribute("target");
    expect(pdf.getAttribute("aria-label")).toMatch(SPOKEN);
    expect(text(pdf)).toBe("PDF");
  });

  it("draws no product filter while the studies cover one product", () => {
    const container = hub();
    expect(container.querySelector(".cx-filter")).toBeNull();
    expect(library(container).querySelector("button, [role='group'], [aria-live]")).toBeNull();
  });

  it("draws the product filter once the studies cover two, with All pressed and the count of every card", () => {
    const filter = library(both()).querySelector(":scope > .cx-filter")!;
    expect(filter).toHaveAttribute("role", "group");
    expect(filter).toHaveAttribute("aria-label", "Filter case studies");
    const buttons = [...filter.querySelectorAll("button")];
    expect(buttons.map((b) => [text(b), b.getAttribute("type"), b.getAttribute("data-p")])).toEqual(
      [
        ["All", "button", ""],
        ["Coral", "button", "coral"],
        ["Amoeba", "button", "amoeba"],
      ],
    );
    expect(buttons.map((b) => b.getAttribute("aria-pressed"))).toEqual(["true", "false", "false"]);
    expect(buttons[1]!.querySelector("span[translate='no']")).toHaveTextContent("Coral");
    const count = filter.querySelector(":scope > .cx-count")!;
    expect(count).toHaveAttribute("aria-live", "polite");
    expect(text(count)).toBe("2 case studies");
  });

  it("filters the cards by product as the mock's script does, the live count following", () => {
    const container = both();
    const filter = container.querySelector(".cx-filter")!;
    const [all, coral, amoeba] = [...filter.querySelectorAll("button")];
    const count = () => text(filter.querySelector(".cx-count"));
    const pressed = () =>
      [...filter.querySelectorAll("button")].map((b) => b.getAttribute("aria-pressed"));
    const shown = () =>
      [...container.querySelectorAll("article.cx-card")]
        .filter((card) => !card.hasAttribute("hidden"))
        .map((card) => card.getAttribute("data-p"));

    expect(shown()).toEqual(["coral", "amoeba"]);
    fireEvent.click(amoeba!);
    expect(pressed()).toEqual(["false", "false", "true"]);
    expect(shown()).toEqual(["amoeba"]);
    expect(count()).toBe("1 case study");
    /* Your cluster next is never filtered. */
    expect(container.querySelector("a.cx-next")).not.toHaveAttribute("hidden");

    fireEvent.click(coral!);
    expect(pressed()).toEqual(["false", "true", "false"]);
    expect(shown()).toEqual(["coral"]);
    expect(count()).toBe("1 case study");

    fireEvent.click(all!);
    expect(pressed()).toEqual(["true", "false", "false"]);
    expect(shown()).toEqual(["coral", "amoeba"]);
    expect(count()).toBe("2 case studies");
  });

  it("closes the library on Your cluster next, the free assessment", () => {
    const next = hub().querySelector(".cx-grid > a.cx-next")!;
    expect(next).toHaveAttribute("href", "/assessment");
    expect(next.querySelector(".cx-plus")).toHaveAttribute("aria-hidden", "true");
    expect(text(next.querySelector("h3"))).toBe("Your cluster next");
    expect(text(next.querySelector("p"))).toBe(
      "Run the free assessment to see your own number: one command, one PDF with your estimated saving at list price.",
    );
    expect(text(next.querySelector(".cx-read"))).toBe("Run the free assessment");
  });

  it("says how the studies are written, three cards on the band", () => {
    const band = hub().querySelector("main > section.sec.sec-band#how-we-write-them")!;
    expect(band).toHaveAttribute("aria-labelledby", "how-we-write-them-h");
    expect(text(band.querySelector(".sec-head > h2#how-we-write-them-h"))).toBe(
      "How we write them",
    );
    expect(
      [...band.querySelectorAll(".cx-trust > div")].map((card) => [
        text(card.querySelector("h3")),
        text(card.querySelector("p")),
      ]),
    ).toEqual([
      [
        "On a real cluster",
        "Measured on a cluster that runs real work, from the day Coral was connected.",
      ],
      [
        "At list prices",
        "Every figure at the cloud’s pay-as-you-go list prices, 730 hours a month.",
      ],
      ["Nothing named", "No cluster, machine or app is named. Apps stay generic, as in the PDF."],
    ]);
  });

  it("ends on the closing row for Coral", () => {
    const container = hub();
    const row = container.querySelector("main > section#assess:last-child")!;
    expect(row.querySelector("a.btn-ink")).toHaveAttribute("href", "/assessment?p=coral");
    expect(text(row.querySelector("#contact p"))).toBe(
      "Thirty minutes with the people who build Coral.",
    );
    /* Nothing on the page rises into place, as the mock draws it. */
    expect(container.querySelector("main .rise, main .rv, main [data-i]")).toBeNull();
  });
});

describe("/case-studies/coral-dev-cluster", () => {
  it("opens on the PDF's kicker, headline and opening, with its download beside them", () => {
    const hero = study().querySelector("main > header.hero.doc-hero.cs-hero#top")!;
    expect(text(hero.querySelector(".cs-kick"))).toBe(
      "Validation Lab · Coral on Azure Kubernetes Service · October 2026",
    );
    const h1 = hero.querySelector("h1")!;
    expect(text(h1)).toBe("How we reduced our own cluster’s machine bill by 58%");
    expect(text(h1.querySelector(".cs-g"))).toBe("machine bill by 58%");
    expect(text(hero.querySelector(".doc-deck b"))).toBe("$154.76 a month instead of $368.65");
    const download = hero.querySelector(".doc-hero-grid > .dl > a.dl-r")!;
    expect(download).toHaveAttribute("href", PDF);
    expect(download).toHaveAttribute("download");
    expect(download.getAttribute("aria-label")).toMatch(SPOKEN);
    expect(text(download.querySelector(".dl-t"))).toBe("Download the PDF");
  });

  it("puts the result first: the date and publisher, the four figures in one line, what Coral is", () => {
    const band = study().querySelector("main > section.cs-band")!;
    expect(band).toHaveAttribute("aria-label", "The result");
    const byline = band.querySelector("p.doc-updated")!;
    expect(text(byline)).toBe("12 October 2026 · Published by Zoorik");
    expect(byline.querySelector("a")).toHaveAttribute("href", "/about");
    const stats = [...band.querySelectorAll(".cs-stats > p.cs-stat")];
    expect(
      stats.map((stat) => [
        text(stat.querySelector(".cs-v")),
        text(stat.querySelector(".cs-k")),
        stat.querySelector(".cs-v")!.classList.contains("is-good"),
      ]),
    ).toEqual([
      ["−58%", "machine bill", true],
      ["$213.89", "saved every month, about $2,567 a year", true],
      ["10 → 6", "CPU, on 2 machines instead of 3", false],
      ["8 days", "from connecting Coral to the result", false],
    ]);
    expect(text(band.querySelector(".doc-call p"))).toMatch(/^Coral is Zoorik’s Kubernetes cost/);
  });

  it("numbers the PDF's six sections, each name beside its text, with no On this page list", () => {
    const container = study();
    const ids = [
      "the-starting-point",
      "connecting-coral",
      "what-coral-did",
      "how-the-apps-came-through",
      "how-the-apps-stayed-safe",
      "the-result",
    ];
    const sections = [...container.querySelectorAll("article.ar-frame > section.fq-sec")];
    expect(sections.map((section) => section.id)).toEqual(ids);
    expect(
      sections.map((section) => [
        text(section.querySelector("h2 .cs-no")),
        text(section.querySelector("h2 > span:last-child")),
      ]),
    ).toEqual([
      ["1", "The starting point"],
      ["2", "Connecting Coral"],
      ["3", "What Coral did"],
      ["4", "How the apps came through"],
      ["5", "How the apps stayed safe"],
      ["6", "The result"],
    ]);
    for (const section of sections) {
      expect(section.querySelector("h2 .cs-no")).toHaveAttribute("aria-hidden", "true");
      expect(section.lastElementChild).toHaveClass("fq-sec-b", "doc-prose");
    }
    expect(
      [...container.querySelectorAll("nav.fq-chips a")].map((a) => a.getAttribute("href")),
    ).toEqual(ids.map((id) => `#${id}`));
    expect(container.querySelector(".doc-rail, .doc-toc")).toBeNull();
  });

  it("draws the machines as cards, their CPU as squares", () => {
    const start = study().querySelector("#the-starting-point")!;
    const cards = [...start.querySelectorAll(".cs-mrow > .cs-mc")];
    expect(cards.map((card) => card.className)).toEqual([
      "cs-mc is-keep",
      "cs-mc is-old",
      "cs-mc is-old",
    ]);
    expect(cards.map((card) => card.querySelectorAll(".cs-cores > i").length)).toEqual([2, 4, 4]);
    expect([...start.querySelectorAll(".cs-sum > *")].map(text)).toEqual([
      "On 4 October 2026, when Coral was connected",
      "3 machines · 10 CPU · $368.65 a month",
    ]);
  });

  it("tells what Coral did in three dated steps, each with what it saved", () => {
    const did = study().querySelector("#what-coral-did")!;
    expect([...did.querySelectorAll(".cs-chap > h3")].map((h3) => [h3.id, text(h3)])).toEqual([
      ["node-optimization", "Node optimization: a spare worker removed"],
      ["workload-optimization", "Workload optimization: apps sized to what they use"],
      ["rebalancing", "Rebalancing: one click, a cheaper machine"],
    ]);
    expect([...did.querySelectorAll(".cs-date")].map(text)).toEqual([
      "6 Oct",
      "from 8 Oct",
      "12 Oct",
    ]);
    expect([...did.querySelectorAll(".cs-pill")].map(text)).toEqual([
      "−$147.46 a month",
      "Less reserved, more room on every machine",
      "−$66.43 a month",
    ]);
    const reserve = did.querySelector(".cs-reserve")!;
    expect(reserve).toHaveAttribute("role", "img");
    expect(
      [...reserve.querySelectorAll<HTMLElement>(".cs-rr.is-now i b")].map((b) => b.style.width),
    ).toEqual(["55.1%", "84.4%"]);
  });

  it("charts how long each single-copy app was down, longest at 78%", () => {
    const bars = study().querySelector("#how-the-apps-came-through .cs-hb")!;
    expect(bars).toHaveAttribute("role", "img");
    expect(bars.getAttribute("aria-label")).toMatch(
      /^Seconds until back up, for each app that runs a single copy: Backend service A, 82 seconds; .*Certificate sync, 5 seconds\.$/,
    );
    const rows = [...bars.querySelectorAll<HTMLElement>(".cs-hr")];
    expect(rows).toHaveLength(11);
    expect(rows[0]!.querySelector<HTMLElement>("i")!.style.width).toBe("78%");
    expect(text(rows[0]!.querySelector("b"))).toBe("82 s");
  });

  it("opens The result on the cost steps, one scale, then the table and the share removed", () => {
    const result = study().querySelector("#the-result")!;
    const steps = result.querySelector(".cs-fig .cs-wf")!;
    expect(steps).toHaveAttribute("role", "img");
    const bars = [...steps.querySelectorAll<HTMLElement>(".cs-bar")];
    /* Read as numbers: the page prints two decimals ("60.00%"), and jsdom normalises them away. */
    const pct = (value: string) => Number.parseFloat(value);
    expect(
      bars.map((bar) => [bar.className, pct(bar.style.bottom), pct(bar.style.height), text(bar)]),
    ).toEqual([
      ["cs-bar is-start", 0, 100, "$368.65"],
      ["cs-bar is-drop", 60, 40, "−$147.46"],
      ["cs-bar is-drop", 41.98, 18.02, "−$66.43"],
      ["cs-bar is-end", 0, 41.98, "$154.76"],
    ]);
    const table = result.querySelector(".cs-two table.cs-tb")!;
    expect(
      [...table.querySelectorAll<HTMLTableRowElement>("tbody tr")].map((tr) =>
        [...tr.cells].map(text),
      ),
    ).toEqual([
      ["Machines", "3", "2", "1 fewer"],
      ["CPU", "10", "6", "4 fewer"],
      ["Per month", "$368.65", "$154.76", "$213.89 less"],
      ["Per year", "$4,423.80", "$1,857.12", "$2,566.68 less"],
    ]);
    const donut = result.querySelector("svg.cs-donut")!;
    expect(donut).toHaveAttribute("aria-label", "58% less");
    expect(donut.querySelectorAll("circle")[1]).toHaveAttribute(
      "stroke-dasharray",
      "204.15 351.86",
    );
  });

  it("ends the study on the PDF, the whole card one link, then the fine print and the closing row", () => {
    const container = study();
    const card = container.querySelector("#the-result a.cs-dl")!;
    expect(card).toHaveAttribute("href", PDF);
    expect(card).toHaveAttribute("download");
    expect(card.getAttribute("aria-label")).toMatch(SPOKEN);
    expect(text(card.querySelector(".cs-dl-t"))).toBe(
      "How we reduced our own cluster’s machine bill by 58%",
    );
    expect(text(card.querySelector(".cs-dl-f"))).toMatch(/^Case study · PDF · \d+ pages? · /);
    expect(documents["coral-case-study"].pdf).toBe(PDF);
    const foot = container.querySelector("article.ar-frame > .fq-upd.ar-foot:last-child")!;
    expect(text(foot)).toBe(
      "Zoorik’s own development cluster on Azure Kubernetes Service, 4 to 12 October 2026. Costs are Azure pay-as-you-go list prices for the cluster’s machines at 730 hours a month. App figures cover the cluster’s own apps. Results depend on each cluster’s apps and machines.",
    );
    const row = container.querySelector("section#assess")!;
    expect(row.querySelector("a.btn-ink")).toHaveAttribute("href", "/assessment?p=coral");
    expect(text(row.querySelector("#contact p"))).toBe(
      "Thirty minutes with the people who build Coral.",
    );
  });
});

describe("both pages", () => {
  it.each([
    ["the hub", hub],
    ["the study", study],
  ])(
    "%s ships no placeholder, and is reached from the footer's Resources column, never the header",
    (_, page) => {
      const container = page();
      expect(container.innerHTML).not.toMatch(/\[OWNER|ph-chip|To come/);
      const outside = [...container.querySelectorAll("a[href^='/case-studies']")].filter(
        (a) => !a.closest("main"),
      );
      expect(outside).toHaveLength(1);
      const link = outside[0]!;
      expect(link.closest("footer")).not.toBeNull();
      expect(link).toHaveAttribute("href", "/case-studies");
      expect(text(link)).toBe("Validation Labs by Zoorik");
      expect(text(link.previousElementSibling)).toBe("Zoorik Learn");
      expect(container.querySelector(".nav [aria-current], .nav .is-cur")).toBeNull();
    },
  );
});
