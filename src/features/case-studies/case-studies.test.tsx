import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { caseStudiesHub, caseStudy } from "@/content/case-studies";
import { documents } from "@/content/documents";

/* The nav and the footer read the pathname. */
const pathname = vi.hoisted(() => ({ current: "/value-lab" }));
vi.mock("next/navigation", () => ({ usePathname: () => pathname.current }));

import ValueLabRoute, { metadata as hubMeta } from "@/app/value-lab/page";
import CaseStudyRoute, { metadata as studyMeta } from "@/app/case-studies/coral-dev-cluster/page";

/**
 * Value Lab and its case study: the metadata, the hub (what the studies saved
 * so far, the featured study beside "Want to be next?", the closing row), the
 * study's hero and download, the result band, the six numbered sections in
 * /security's frame, the drawings, the closing row for Coral, no placeholder,
 * and their one place on the site: the footer's Resources column, never the
 * header. Their
 * sitemap entries are in `src/app/sitemap.test.ts`; the PDF's file and header
 * in `src/features/documents/document-facts.test.ts`.
 */

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();

const hub = () => {
  pathname.current = "/value-lab";
  return render(<ValueLabRoute />).container;
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
    /* "Value Lab by Zoorik: …" already names the company, so no " · Zoorik" after it. */
    expect(hubMeta.title).toEqual({ absolute: "Value Lab by Zoorik: cloud cost case studies" });
    expect(hubMeta.description).toBe("What Coral does on real clusters, with the figures.");
    expect(hubMeta.alternates).toEqual({ canonical: "/value-lab" });
    expect(hubMeta).not.toHaveProperty("robots");
    expect(hubMeta.openGraph).toMatchObject({
      url: "/value-lab",
      title: "Value Lab by Zoorik: cloud cost case studies",
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
      images: [
        {
          url: "/og/zoorik-case-coral-dev-cluster-1200x630.png",
          width: 1200,
          height: 630,
          alt: "Value Lab by Zoorik: how we reduced our own cluster’s machine bill by 58%",
        },
      ],
    });
  });
});

describe("/value-lab", () => {
  it("opens on its name and line, and beside them what the studies saved so far", () => {
    /* Reduced motion: the figure shows at once, with no count from $0.00 (`saved-so-far.test.tsx` counts it). */
    const reduce = vi.spyOn(window, "matchMedia").mockImplementation(
      (query: string) =>
        ({
          matches: query.includes("reduce"),
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
        }) as unknown as MediaQueryList,
    );
    const hero = hub().querySelector("main > header.hero.doc-hero#top")!;
    reduce.mockRestore();
    const [words, total] = [...hero.querySelectorAll(".doc-hero-grid > *")];
    expect(text(words!.querySelector("h1"))).toBe("Value Lab by Zoorik");
    expect(words!.querySelector("h1 [translate='no']")).toHaveTextContent("Zoorik");
    expect(text(words!.querySelector(".doc-deck"))).toBe(
      "What Coral and Amoeba reduced on real cloud bills, every figure at list prices.",
    );
    expect(total).toHaveClass("dl", "vl-total");
    expect(total!.querySelector(".vl-tk .vl-sig")).toHaveAttribute("aria-hidden", "true");
    /* The label, then the date pushed to the right edge by its own margin, as the mock writes them. */
    expect(text(total!.querySelector(".vl-tk"))).toBe("Saved so farAs of 12 Oct 2026");
    expect(text(total!.querySelector(".vl-tk time"))).toBe("As of 12 Oct 2026");
    expect(total!.querySelector(".vl-tk time")).toHaveAttribute("datetime", "2026-10-12");
    expect(text(total!.querySelector(".vl-tn"))).toBe("$213.89 a month");
    expect(text(total!.querySelector(".vl-tl"))).toBe(
      "About $2,567 a year, across 1 case study, at list prices.",
    );
  });

  it("reads the total from the studies: each bill before less each bill after", () => {
    const [only] = caseStudiesHub.studies;
    expect(caseStudiesHub.studies).toHaveLength(1);
    expect(caseStudiesHub.total.amount).toBeCloseTo(only!.before.value - only!.after.value, 6);
    /* The study's own figure for it. */
    expect(caseStudy.band.stats[1].value).toBe("$213.89");
  });

  it("puts the featured study and Want to be next? side by side on the band, rising as they arrive", () => {
    const section = hub().querySelector("main > section#studies.sec.sec-band")!;
    expect(section).toHaveAttribute("aria-label", "Value Lab studies");
    const [featured, next] = [...section.querySelectorAll(".as-grid > div")];
    expect(featured).toHaveClass("as-card", "as-mini", "vl-fc", "rise");
    expect(next).toHaveClass("as-cal", "rise");
    expect(text(featured!.querySelector(".vl-flag"))).toBe("Featured");
    expect(featured!.querySelector("svg.vl-own")).toHaveAttribute("viewBox", "0 0 512 512");
    expect(featured!.querySelectorAll("svg.vl-own rect")).toHaveLength(15);
    expect(text(featured!.querySelector("h2.as-h"))).toBe("Our own AKS cluster");
    expect(text(featured!.querySelector("p"))).toBe(
      "We reduced its monthly machine bill by 58% with Coral.",
    );
    const bars = featured!.querySelector(".vl-bars")!;
    expect(bars).toHaveAttribute("aria-hidden", "true");
    expect(
      [...bars.querySelectorAll(".vl-col")].map((col) => [
        text(col.querySelector("b")),
        (col.querySelector("i") as HTMLElement).style.getPropertyValue("--h"),
        text(col.querySelector("small")),
      ]),
    ).toEqual([
      ["$368.65", "1", "Before"],
      ["$154.76", "0.420", "With Coral"],
    ]);
    expect(text(bars.querySelector(".vl-per"))).toBe("a month");
    const read = featured!.querySelector("a.btn-ink")!;
    expect(read).toHaveAttribute("href", "/case-studies/coral-dev-cluster");
    expect(text(read)).toBe("Read the case study");
    expect(text(next!.querySelector("h2.as-h"))).toBe("Want to be next?");
    expect(text(next!.querySelector("p"))).toBe(
      "Run the free assessment on your clusters or disks: one command, one PDF with your estimated saving at list price.",
    );
    const go = next!.querySelector("a.cta-go")!;
    expect(go).toHaveAttribute("href", "/assessment");
    expect(text(go)).toBe("Run the free assessment");
  });

  it("lists no client study until the first one exists, and ends on the closing row for Coral", () => {
    const container = hub();
    expect([...container.querySelectorAll("main > section")].map((s) => s.id)).toEqual([
      "studies",
      "assess",
    ]);
    const row = container.querySelector("main > section#assess:last-child")!;
    expect(row.querySelector("a.btn-ink")).toHaveAttribute("href", "/assessment?p=coral");
    expect(text(row.querySelector("#contact p"))).toBe(
      "Thirty minutes with the people who build Coral.",
    );
  });
});

describe("/case-studies/coral-dev-cluster", () => {
  it("opens on the PDF's kicker, headline and opening, with its download beside them", () => {
    const hero = study().querySelector("main > header.hero.doc-hero.cs-hero#top")!;
    expect(text(hero.querySelector(".cs-kick"))).toBe(
      "Value Lab · Coral on Azure Kubernetes Service · October 2026",
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
      const outside = [...container.querySelectorAll("a[href='/value-lab']")].filter(
        (a) => !a.closest("main"),
      );
      expect(outside).toHaveLength(1);
      const link = outside[0]!;
      expect(link.closest("footer")).not.toBeNull();
      expect(text(link)).toBe("Value Lab");
      expect(text(link.previousElementSibling)).toBe("Zoorik Learn");
      expect(container.querySelector(".nav [aria-current], .nav .is-cur")).toBeNull();
    },
  );
});
