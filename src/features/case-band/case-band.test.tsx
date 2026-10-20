import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { caseBand } from "@/content/case-band";
import { caseStudy } from "@/content/case-studies";

import { CaseBand } from "./case-band";

/**
 * The case study band on the home page: the mock's words and markup, every figure the
 * study's own, the button to the
 * study, the chart as one picture to a screen reader, and the two halves the motion pass
 * brings in. Its place after the why points is in `src/app/page.test.tsx`.
 */

const band = () => render(<CaseBand />).container.querySelector("section")!;
const text = (el: Element | null): string => (el?.textContent ?? "").replace(/\s+/g, " ").trim();

describe("the case study band", () => {
  it("is a section of its own, named by its heading", () => {
    const section = band();
    expect(section).toHaveAttribute("id", "case-study");
    expect(section).toHaveClass("mo-case");
    expect(section).toHaveAttribute("aria-labelledby", "mo-case-h");
    expect(section.querySelector(".wrap > .mo-case-in")).not.toBeNull();
  });

  it("opens on Coral's mark and the eyebrow, the name kept out of translation", () => {
    const eyebrow = band().querySelector(".mo-case-t p.mo-eyebrow")!;
    const [mark, words] = [...eyebrow.children];
    /* The site's product mark, not the mock's `<use>`: one drawing for Coral everywhere. */
    expect(mark!.tagName.toLowerCase()).toBe("svg");
    expect(mark).toHaveAttribute("aria-hidden", "true");
    expect(mark).toHaveAttribute("data-mark", "kubernetes");
    expect(words!.tagName).toBe("SPAN");
    expect(words!.textContent).toBe("Value Lab · Coral");
    expect(words!.querySelector("[translate='no']")).toHaveTextContent(/^Coral$/);
  });

  it("sets the study's own headline, its second half on a line of its own", () => {
    const h2 = band().querySelector("h2#mo-case-h")!;
    expect(h2.textContent).toBe("How we reduced our own cluster’s machine bill by 58%");
    expect(h2.querySelector("span")!.textContent).toBe(caseStudy.hero.titleGreen);
    expect(h2.firstChild!.textContent).toBe(caseStudy.hero.title);
    /* Set plain, as every heading on the page: no period. */
    expect(h2.textContent).not.toMatch(/\.$/);
  });

  it("says where and how long in one line, then sends the reader to the study", () => {
    const section = band();
    const line = section.querySelector("p.mo-case-l")!;
    expect(line.textContent).toBe(
      "On Zoorik’s own development cluster, eight days from connecting Coral to the result.",
    );
    expect([...line.querySelectorAll("[translate='no']")].map((el) => el.textContent)).toEqual([
      "Coral",
    ]);
    const links = [...section.querySelectorAll<HTMLAnchorElement>("a")];
    expect(links).toHaveLength(1);
    const [button] = links;
    expect(button).toHaveClass("btn", "btn-light");
    expect(button).toHaveAttribute("href", "/case-studies/coral-dev-cluster");
    expect(button!.getAttribute("href")).toBe(caseStudy.route);
    expect(text(button!)).toBe("Read the case study");
    /* Same tab: no new-tab hint, the plain arrow. */
    expect(button).not.toHaveAttribute("target");
    expect(button!.querySelector(".sr-only, .ext")).toBeNull();
    expect(button!.querySelector("svg path")).toHaveAttribute("d", "M5 12h14M13 5l7 7-7 7");
  });

  it("draws the study's cost chart as one picture, said in the mock's words", () => {
    const chart = band().querySelector("figure.mo-wf")!;
    expect(chart).toHaveAttribute("role", "img");
    expect(chart).toHaveAttribute(
      "aria-label",
      "What the cluster’s machines cost each month: $368.65 when Coral was connected on 4 Oct; minus $147.46 from node optimization on 6 Oct; minus $66.43 from rebalancing on 12 Oct; $154.76 today.",
    );
    /* Its caption and its bars are the picture: hidden, so the label is said once. */
    const caption = chart.querySelector("figcaption")!;
    expect(caption).toHaveAttribute("aria-hidden", "true");
    expect(caption.querySelector("span")!.textContent).toBe(caseStudy.result.costs.caption);
    expect(caption.querySelector("small")!.textContent).toBe("Azure list prices");
    expect(chart.querySelector(".mo-wf-p")).toHaveAttribute("aria-hidden", "true");
  });

  it("stands four bars on the connected bill's scale, each figure, name and date the study's", () => {
    const columns = [...band().querySelectorAll(".mo-wf-p > .mo-wf-c")];
    /* Read as numbers: the band prints two decimals ("60.00%"), and jsdom normalises them away. */
    const pct = (value: string) => Number.parseFloat(value);
    expect(
      columns.map((column) => {
        const bar = column.querySelector<HTMLElement>(".mo-wf-t > span.mo-b")!;
        return [
          bar.className,
          pct(bar.style.bottom),
          pct(bar.style.height),
          bar.querySelector("b")!.textContent,
          column.querySelector("p")!.firstChild!.textContent,
          column.querySelector("p small")!.textContent,
        ];
      }),
    ).toEqual([
      ["mo-b s", 0, 100, "$368.65", "Connected", "4 Oct"],
      ["mo-b d", 60, 40, "−$147.46", "Node optimization", "6 Oct"],
      ["mo-b d", 41.98, 18.02, "−$66.43", "Rebalancing", "12 Oct"],
      ["mo-b e", 0, 41.98, "$154.76", "Today", "12 Oct"],
    ]);
    /* The same steps the study draws, read from it rather than typed twice. */
    expect(caseBand.chart.steps).toBe(caseStudy.result.costs.steps);
    expect(caseBand.chart.top).toBe(caseStudy.result.costs.top);
  });

  it("brings its two halves in with the motion pass, the chart a step behind the words", () => {
    const section = band();
    const entering = [...section.querySelectorAll<HTMLElement>(".mo-r")];
    expect(entering.map((el) => el.className)).toEqual(["mo-case-t mo-r", "mo-wf mo-r"]);
    expect(entering[0]!.style.getPropertyValue("--d")).toBe("");
    expect(entering[1]!.style.getPropertyValue("--d")).toBe("120ms");
    /* The pass's one observer gives them `.is-in`; nothing here starts in its end state. */
    expect(section.querySelector(".is-in")).toBeNull();
  });
});
