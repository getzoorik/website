import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MarketplaceButtons } from "./marketplace-buttons";

/**
 * The two stores as buttons: each its
 * mark, its name and the new-tab arrow, opening Coral's listing, the only one
 * live, since they name no product.
 */
describe("MarketplaceButtons", () => {
  const draw = (label?: string) =>
    render(<MarketplaceButtons className="foot-mb" idSuffix="t" label={label} />).container
      .firstElementChild!;

  it("draws one button per store, mark, name, hint and arrow, to Coral's listings", () => {
    const row = draw("Available in");
    expect(row).toHaveClass("mkt-btns", "foot-mb");
    expect(row.firstElementChild).toHaveClass("mkt-on");
    const buttons = [...row.querySelectorAll<HTMLAnchorElement>("a.mkt-b")];
    expect(buttons.map((a) => [a.textContent, a.getAttribute("href")])).toEqual([
      [
        "AWS Marketplace (opens in a new tab)",
        "https://aws.amazon.com/marketplace/pp/prodview-kx44lqme4vwys",
      ],
      [
        "Microsoft Marketplace (opens in a new tab)",
        "https://marketplace.microsoft.com/en-us/product/zoorik.coral",
      ],
    ]);
    for (const a of buttons) {
      expect(a).toHaveAttribute("target", "_blank");
      expect(a).toHaveAttribute("rel", "noopener noreferrer");
      /* The mock's order: the mark, the name, the hidden hint, then the arrow. */
      expect([...a.children].map((el) => el.getAttribute("class"))).toEqual([
        expect.stringContaining("mkt-mk"),
        null,
        "sr-only",
        "ext",
      ]);
    }
  });

  it("leaves the lead-in out where a heading says it", () => {
    expect(draw().querySelector(".mkt-on")).toBeNull();
  });

  it("keeps each copy's Azure gradient ids apart", () => {
    const ids = [...draw().querySelectorAll("[id]")].map((el) => el.id);
    expect(ids).toEqual(["azA-mkt-t", "azC-mkt-t"]);
  });
});
