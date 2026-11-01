import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { calendarUrl, contactEmail } from "@/config/site";
import { AssessSection, type AssessSectionProps } from "@/features/assess/assess-section";

/**
 * The closing row, as the mocks draw it: one component with three switches.
 * `product` names one product and opens its assessment; `talkOnly` keeps only
 * the dark card (/assessment); `reveal={false}` draws the cards still, as every
 * generated page does.
 */
const rowOf = (props: AssessSectionProps = {}) => render(<AssessSection {...props} />).container;

const text = (el: Element | null) => el?.textContent ?? "";

describe("the closing row's copy", () => {
  it("is the mocks' words, with no period on either label, and no heading", () => {
    const row = rowOf();
    expect(row.querySelector("h2")).toBeNull();
    expect([...row.querySelectorAll("div.as-h")].map(text)).toEqual([
      "Find your own number",
      "Talk to the builders",
    ]);
    expect(text(row.querySelector(".as-card p"))).toBe(
      "One line in your cloud console. One PDF report with your estimated saving at list price.",
    );
    expect(text(row.querySelector(".as-card .btn-ink")).trim()).toBe("Estimate your saving");
    expect(text(row.querySelector(".cta-fine"))).toBe(`Or write to ${contactEmail}`);
    expect(row.querySelector(".cta-fine a")).toHaveAttribute("href", `mailto:${contactEmail}`);
  });

  it("names Coral, then Amoeba, and opens the plain assessment where no product is set", () => {
    const row = rowOf();
    expect(row.querySelector(".as-card .btn-ink")).toHaveAttribute("href", "/assessment");
    expect(text(row.querySelector(".as-cal p"))).toBe(
      "Thirty minutes with the people who build Coral and Amoeba.",
    );
    const names = [...row.querySelectorAll('.as-cal p [translate="no"]')].map(text);
    expect(names).toEqual(["Coral", "Amoeba"]);
  });

  it.each([
    ["coral", "Coral"],
    ["amoeba", "Amoeba"],
  ] as const)("on a %s page opens that product's assessment and names only it", (id, name) => {
    const row = rowOf({ product: id });
    expect(row.querySelector(".as-card .btn-ink")).toHaveAttribute("href", `/assessment?p=${id}`);
    expect(text(row.querySelector(".as-cal p"))).toBe(
      `Thirty minutes with the people who build ${name}.`,
    );
    const names = [...row.querySelectorAll('.as-cal p [translate="no"]')].map(text);
    expect(names).toEqual([name]);
  });

  it("carries none of the retired row's words", () => {
    expect(text(rowOf())).not.toMatch(
      /Start the free assessment|Run one line|Bring your assessment file|Free assessment|Contact/,
    );
  });
});

describe("the closing row's two buttons", () => {
  it("sends Estimate your saving to the assessment in the same tab, on the → arrow at 2.2", () => {
    const go = rowOf().querySelector<HTMLAnchorElement>(".as-card a.btn-ink")!;
    expect(go).not.toHaveAttribute("target");
    expect(go.querySelector(".sr-only")).toBeNull();
    const arrow = go.querySelector("svg")!;
    expect(arrow).not.toHaveClass("ext");
    expect(arrow).toHaveAttribute("stroke-width", "2.2");
    expect(arrow).toHaveAttribute("aria-hidden", "true");
    expect(arrow.querySelector("path")).toHaveAttribute("d", "M5 12h14M13 5l7 7-7 7");
  });

  it("books a demo on the calendar in a new tab, says so, and ends on the external arrow", () => {
    const go = rowOf().querySelector<HTMLAnchorElement>(".as-cal a.cta-go")!;
    expect(go).toHaveAttribute("href", calendarUrl);
    expect(go).toHaveAttribute("target", "_blank");
    expect(go).toHaveAttribute("rel", "noopener noreferrer");
    expect(text(go)).toBe("Book a demo (opens in a new tab)");
    /* The mock's form: the label and its hint in one span, then the arrow. */
    expect([...go.children].map((child) => child.tagName.toLowerCase())).toEqual(["span", "svg"]);
    expect(text(go.firstElementChild)).toBe("Book a demo (opens in a new tab)");
    expect(go.querySelector(".sr-only")?.textContent).toBe(" (opens in a new tab)");
    const arrow = go.lastElementChild!;
    expect(arrow).toHaveClass("ext");
    expect(arrow).toHaveAttribute("stroke-width", "2.2");
    expect(arrow.querySelector("path")).toHaveAttribute("d", "M7 17 17 7M8 7h9v9");
  });
});

describe("the closing row's shape", () => {
  it("is section#assess, the white card then the dark card, and #contact is the dark card", () => {
    const row = rowOf();
    const section = row.querySelector("section")!;
    expect(section).toHaveAttribute("id", "assess");
    expect(section).toHaveClass("sec");
    const grid = section.querySelector(".as-grid")!;
    expect(grid.className).toBe("as-grid");
    expect([...grid.children].map((card) => card.classList[0])).toEqual(["as-card", "as-cal"]);
    expect(grid.children[0]).toHaveClass("as-mini");
    expect(row.querySelector("#contact")).toBe(grid.children[1]);
    /* Each card opens on its heading: no eyebrow label above it. */
    for (const card of grid.children) expect(card.firstElementChild!.tagName).toBe("H2");
  });

  /* One render per case: the cards share their ids from page to page, and a
     second render in the same test would put two `#contact` in the document. */
  it.each([{}, { product: "coral" }] as const)(
    "rises on home and the product pages (%o): .rise on both cards, the dark one at data-i 1",
    (props) => {
      const row = rowOf(props);
      expect(row.querySelectorAll(".rise")).toHaveLength(2);
      const staged = [...row.querySelectorAll("[data-i]")];
      expect(staged).toHaveLength(1);
      expect(staged[0]).toHaveAttribute("id", "contact");
      expect(staged[0]).toHaveAttribute("data-i", "1");
    },
  );

  it.each([
    { reveal: false },
    { product: "coral", reveal: false },
    { talkOnly: true, reveal: false },
  ] as const)("is drawn still on the generated pages (%o): no .rise and no data-i", (props) => {
    const row = rowOf(props);
    expect(row.querySelectorAll(".rise, [data-i]")).toHaveLength(0);
    const dark = row.querySelector(".as-cal")!;
    expect(dark.tagName).toBe("DIV");
    expect(dark.className).toBe("as-cal");
    expect(dark).toHaveAttribute("id", "contact");
    if (!("talkOnly" in props)) {
      expect(row.querySelector(".as-card")!.className).toBe("as-card as-mini");
    }
  });

  it("keeps only the dark card on /assessment, naming both products", () => {
    const row = rowOf({ talkOnly: true, reveal: false });
    const grid = row.querySelector(".as-grid")!;
    expect(grid.className).toBe("as-grid as-solo");
    expect(grid.children).toHaveLength(1);
    expect(grid.firstElementChild).toHaveAttribute("id", "contact");
    expect(row.querySelector(".as-card, .btn-ink")).toBeNull();
    expect(text(row.querySelector(".as-cal p"))).toBe(
      "Thirty minutes with the people who build Coral and Amoeba.",
    );
  });
});
