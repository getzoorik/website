import { readFileSync } from "node:fs";

import { render } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it } from "vitest";

import { BrandMark } from "@/components/brand/brand-mark";
import { AmoebaMark, CoralMark } from "@/components/brand/product-marks";
import { offersContent } from "@/content/offers";
import { routes } from "@/config/site";
import { savingsFigures, savingsQualifier, type SavingsKey } from "@/content/savings";
import { HomeMotion } from "@/features/home-motion/home-motion";

import { OffersSection } from "./offers-section";

/**
 * What we offer: the title, the qualifier and the free assessment as a flat
 * navy card on the left, the ranges on the right, a row for each on one line.
 */
let section: HTMLElement;
let rows: HTMLElement[];

beforeEach(() => {
  section = render(<OffersSection />).container.querySelector<HTMLElement>("section#offers")!;
  rows = [...section.querySelectorAll<HTMLElement>("ul.ofx-rows > li")];
});

const text = (el: Element | null) => el?.textContent ?? "";
const prop = (el: Element, name: string) => (el as HTMLElement).style.getPropertyValue(name);
const RANGES: readonly SavingsKey[] = ["coral", "amoeba", "both"];

describe("What we offer", () => {
  it("is the mock's section: its id, its classes, its heading, its two columns", () => {
    expect(section).toHaveClass("sec", "ofx", "ofx-b");
    expect(section).toHaveAttribute("aria-labelledby", "offers-h");
    const split = section.querySelector(".wrap > .ofx-split")!;
    expect([...split.children].map((el) => el.className)).toEqual([
      "ofx-side ofx-in mo-r",
      "ofx-scale",
    ]);
    expect(section.querySelector(".ofx-side > h2#offers-h")).toHaveTextContent(
      "Cloud cost assessment",
    );
    expect(section.querySelectorAll("h2")).toHaveLength(1);
  });

  it("prints the qualifier under the title, read from the savings content", () => {
    const side = section.querySelector(".ofx-side")!;
    expect([...side.children].map((el) => el.className)).toEqual(["", "ofx-note", "ofx-free"]);
    expect(text(side.querySelector(".ofx-note"))).toBe(savingsQualifier);
    expect(savingsQualifier).toBe("Estimated ranges, not a promise.");
  });

  it("sets the free assessment on the navy card, the moving Zoorik mark in its icon slot", () => {
    const free = section.querySelector(".ofx-side > .ofx-free")!;
    expect([...free.children].map((el) => el.className)).toEqual([
      "ofx-free-l",
      "ofx-free-n",
      "ofx-free-c",
      "btn btn-light ofx-free-go",
    ]);
    expect(text(free.querySelector(".ofx-free-l"))).toBe("Free assessment");
    const slot = free.querySelector(".ofx-free-l > .ofx-free-i")!;
    expect(slot).toHaveAttribute("aria-hidden", "true");
    /* Zoorik's own mark, with the rings the nav's sheet turns opposite ways. */
    expect(slot.innerHTML).toBe(renderToStaticMarkup(<BrandMark />));
    expect(slot.querySelector("svg.zl-mark > g.zl-t > g.zl-o + g.zl-i + circle")).not.toBeNull();
    expect(text(free.querySelector(".ofx-free-n"))).toBe("Free");
    expect(free.querySelector(".ofx-free-n")).not.toHaveAttribute("role");
    expect(text(free.querySelector(".ofx-free-c"))).toBe(
      "Your estimated saving at list price, from one line in your cloud console.",
    );
  });

  it("has one link, the card's, to the plain assessment", () => {
    const links = [...section.querySelectorAll("a")];
    expect(links).toHaveLength(1);
    const go = links[0]!;
    expect(go).toHaveClass("btn", "btn-light", "ofx-free-go");
    expect(go).toHaveAttribute("href", routes.assessment);
    expect(go).not.toHaveAttribute("target");
    expect(text(go).trim()).toBe("Estimate your saving");
    expect(go.querySelector("svg path")).toHaveAttribute("d", "M5 12h14M13 5l7 7-7 7");
  });

  it("draws no axis: the ranges' panel holds the rows alone (owner, 23 Oct 2026)", () => {
    const scale = section.querySelector(".ofx-scale")!;
    expect([...scale.children].map((el) => el.tagName)).toEqual(["UL"]);
    expect(section.querySelector(".ofx-axis, .ofx-ticks, .ofx-axis-l")).toBeNull();
    expect(section.textContent).not.toMatch(/Off the cost it optimizes|0%25%|100%/);
    expect(offersContent).not.toHaveProperty("axis");
  });

  it("names the free card and each row in an h3 under the section's one h2", () => {
    const headings = [...section.querySelectorAll("h2, h3")].map(
      (h) => `${h.tagName.toLowerCase()} ${h.className} ${text(h)}`,
    );
    expect(headings).toEqual([
      "h2  Cloud cost assessment",
      "h3 ofx-free-l Free assessment",
      "h3 ofx-h Coral",
      "h3 ofx-h Amoeba",
      "h3 ofx-h Coral and Amoeba together",
    ]);
  });

  it("lists a row for each range, staggered by its place on the list's one clock", () => {
    expect(section.querySelector("ul.ofx-rows")).toHaveAttribute("role", "list");
    /* HomeMotion times every row from the first one in (home-motion.tsx). */
    expect(section.querySelector("ul.ofx-rows")).toHaveAttribute("data-mo-clock", "");
    expect(section.querySelectorAll("[data-mo-clock]")).toHaveLength(1);
    expect(rows).toHaveLength(3);
    for (const row of rows) expect(row).toHaveClass("ofx-row", "ofx-in", "mo-r");
    expect(rows.map((row) => prop(row, "--i"))).toEqual(["0", "1", "2"]);
    expect(rows.map((row) => row.dataset.k)).toEqual(["coral", "amoeba", "both"]);
    expect(rows.map((row) => [...row.children].map((el) => el.className.split(" ")[0]))).toEqual(
      Array(3).fill(["ofx-rl", "ofx-track", "ofx-rn"]),
    );
  });

  it("marks and names each row, the products kept out of translation", () => {
    const coral = renderToStaticMarkup(<CoralMark />);
    const amoeba = renderToStaticMarkup(<AmoebaMark />);
    const marks = rows.map((row) => row.querySelector(".ofx-rl > .ofx-h > .ofx-m")!);
    expect(marks.map((mark) => mark.className)).toEqual(["ofx-m", "ofx-m", "ofx-m is-two"]);
    expect(marks.map((mark) => mark.innerHTML)).toEqual([coral, amoeba, coral + amoeba]);
    for (const svg of section.querySelectorAll(".ofx-m svg")) {
      expect(svg).toHaveAttribute("aria-hidden", "true");
    }
    const names = rows.map((row) => row.querySelector(".ofx-h > span:last-child")!);
    expect(names.map(text)).toEqual(["Coral", "Amoeba", "Coral and Amoeba together"]);
    expect(names.map((name) => [...name.querySelectorAll("[translate='no']")].map(text))).toEqual([
      ["Coral"],
      ["Amoeba"],
      ["Coral", "Amoeba"],
    ]);
  });

  it("reads every range, its spoken form and its caption from the savings content", () => {
    rows.forEach((row, index) => {
      const { range, spoken, caption } = savingsFigures[RANGES[index]!];
      expect(text(row.querySelector(".ofx-rl > .ofx-cap > .sr-only"))).toBe(caption);
      const figure = row.querySelector(".ofx-rn > .od")!;
      expect(figure).toHaveAttribute("role", "img");
      expect(figure).toHaveAttribute("aria-label", spoken);
      expect(text(figure)).toBe(range);
    });
    expect(rows.map((row) => text(row.querySelector(".od")))).toEqual([
      "40–50%",
      "50–60%",
      "20–30%",
    ]);
    expect(rows.map((row) => text(row.querySelector(".ofx-cap > .sr-only")))).toEqual([
      "off AKS and EKS cost",
      "off block storage cost",
      "off your overall cloud bill",
    ]);
  });

  it("shows what each range is a share of as tags, the caption kept for a screen reader", () => {
    for (const row of rows) {
      const cap = row.querySelector(".ofx-rl > p.ofx-cap.ofx-tags")!;
      /* The caption's words first, unseen; then the tags, unheard, as the product sections draw them. */
      expect([...cap.children].map((el) => el.className)).toEqual(["sr-only", "chips-g"]);
      expect(cap.querySelector(".chips-g")).toHaveAttribute("aria-hidden", "true");
    }
    const tags = rows.map((row) =>
      [...row.querySelectorAll(".chips-g > span.chip")].map((chip) => [
        chip.querySelector("svg")?.getAttribute("data-mark") ?? null,
        chip.querySelector("svg")?.getAttribute("class") ?? null,
        text(chip),
      ]),
    );
    /* The mark names the cloud and the word its service: Azure's mark unclassed, AWS's smile `.aws`. */
    expect(tags).toEqual([
      [
        ["azure", null, "AKS"],
        ["aws", "aws", "EKS"],
      ],
      [
        ["azure", null, "Managed Disks"],
        ["aws", "aws", "EBS"],
      ],
      [[null, null, "Overall cloud bill"]],
    ]);
    /* Each Azure mark names its own gradients, so the three never share one. */
    const gradients = [...section.querySelectorAll("linearGradient")].map((g) => g.id);
    expect(new Set(gradients).size).toBe(gradients.length);
  });

  it("rolls each figure on a strip the page's text never carries", () => {
    /* The strip is the sheet's generated content: the DOM holds each digit once, as printed. */
    expect(text(section.querySelector("ul.ofx-rows"))).not.toMatch(/\d{3}/);
    for (const row of rows) {
      const figure = row.querySelector(".od")!;
      expect(figure.querySelector(".od-r")).toHaveAttribute("aria-hidden", "true");
      expect(figure.querySelectorAll("i")).toHaveLength(0);
    }
    /* Each digit is its own window: --v its place on the strip's second pass, --k its place in the range. */
    const digits = (row: HTMLElement) =>
      [...row.querySelectorAll(".od-r > span")].map((el) =>
        el.className === "od-d"
          ? [text(el), prop(el, "--v"), prop(el, "--k")]
          : [el.className, text(el)],
      );
    expect(digits(rows[0]!)).toEqual([
      ["4", "14", "0"],
      ["0", "10", "1"],
      ["od-x", "–"],
      ["5", "15", "3"],
      ["0", "10", "4"],
      ["od-x", "%"],
    ]);
    expect(digits(rows[2]!).filter((digit) => digit.length === 3)).toEqual([
      ["2", "12", "0"],
      ["0", "10", "1"],
      ["3", "13", "3"],
      ["0", "10", "4"],
    ]);
  });

  it("draws each range on its band, hidden from assistive tech: soft up to it, firm across it", () => {
    const bands = rows.map((row) => {
      const track = row.querySelector(".ofx-track")!;
      expect(track).toHaveAttribute("aria-hidden", "true");
      const lo = track.querySelector("i.lo")!;
      const hi = track.querySelector("i.hi")!;
      return [prop(lo, "--a"), prop(hi, "--a"), prop(hi, "--b")];
    });
    expect(bands).toEqual([
      ["40", "40", "10"],
      ["50", "50", "10"],
      ["20", "20", "10"],
    ]);
  });

  it("is drawn flat and pointy: no glow on the card, blocks at 4px, bands at 1px, one line a row", () => {
    /* The rules alone: the sheet's notes name what went. */
    const sheet = readFileSync("src/styles/home-offers.css", "utf8").replace(
      /\/\*[\s\S]*?\*\//g,
      "",
    );
    expect(sheet).not.toMatch(/radial-gradient|\.ofx-free::before|\.ofx-axis|\.ofx-ticks/);
    expect(sheet).toContain("#offers .ofx-free,#offers .ofx-scale{border-radius:var(--r-card)}");
    expect(sheet).toContain("#offers .ofx-track{height:6px;border-radius:var(--r-hair)}");
    expect(sheet).toContain("#offers .ofx-track .hi{box-shadow:none}");
    expect(sheet).toContain(
      "#offers .ofx-rn .od{font-size:1.25rem;font-weight:500;letter-spacing:-.02em}",
    );
    /* Above 1100px the panel shares the card's grid row, so the two match top to top and foot to foot. */
    expect(sheet).toMatch(
      /@media\(min-width:1101px\)\{\n {2}#offers \.ofx-split\{grid-template-areas:"h \." "n \." "c t";/,
    );
  });

  it("names no price", () => {
    expect(section.textContent).not.toMatch(/\$|per month|pricing/i);
  });

  it("is brought in by the pass's one observer: the side and every row", () => {
    const { container } = render(
      <>
        <OffersSection />
        <HomeMotion />
      </>,
    );
    const entering = [...container.querySelectorAll("#offers .mo-r")];
    expect(entering).toHaveLength(4);
    for (const el of entering) expect(el).toHaveClass("ofx-in", "is-in");
  });
});
