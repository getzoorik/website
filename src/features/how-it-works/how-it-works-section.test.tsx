import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { howItWorksSteps } from "@/content/how-it-works";
import type { ProductId } from "@/content/products";

import { StepCard } from "./how-it-works-section";

/**
 * The step cards, as each product's own page draws them.
 *
 * The marks are drawn to the figures beside them, so the failure worth guarding
 * is a card that looks right and draws the other product's proportions.
 */
function cards(product: ProductId): HTMLElement {
  return render(
    <div>
      {howItWorksSteps[product].map((step, index) => (
        <StepCard step={step} order={index} key={step.ordinal} />
      ))}
    </div>,
  ).container;
}

describe("StepCard", () => {
  it("draws Amoeba's marks to Amoeba's figures", () => {
    const amoeba = cards("amoeba");

    /* Four disks, not six nodes; and the split and the kept share of the bill
       are Amoeba's own, handed to the same rule and the same donut. */
    expect(amoeba.querySelectorAll(".hw-bank.b4 .hw-col")).toHaveLength(4);
    expect(amoeba.querySelector<HTMLElement>(".hw-bar")!.style.gridTemplateColumns).toBe(
      "48.83fr 10.16fr 41.02fr",
    );
    expect(amoeba.querySelector<HTMLElement>(".hw-donut")!.style.getPropertyValue("--keep")).toBe(
      "33.12%",
    );
  });

  it("draws Coral's marks to the sheet's proportions, with no values of its own", () => {
    const coral = cards("coral");

    expect(coral.querySelectorAll(".hw-bank")).toHaveLength(2);
    expect(coral.querySelector<HTMLElement>(".hw-bar")!.getAttribute("style")).toBeNull();
    expect(coral.querySelector<HTMLElement>(".hw-donut")!.getAttribute("style")).toBeNull();
  });
});
