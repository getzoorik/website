import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MarketplaceLine } from "./marketplace-line";

const CORAL_AWS = "https://aws.amazon.com/marketplace/pp/prodview-kx44lqme4vwys";
const CORAL_MICROSOFT = "https://marketplace.microsoft.com/en-us/product/zoorik.coral";

/** The line as a screen reader hears it, and each link's address. */
function line(element: React.JSX.Element) {
  const p = render(element).container.querySelector("p")!;
  const links = [...p.querySelectorAll("a")];
  return { p, links, hrefs: links.map((a) => a.getAttribute("href")) };
}

/**
 * The marketplace line: "Available in AWS Marketplace and
 * Microsoft Marketplace", the stores' names in full, each a link that leaves the
 * site and says so.
 */
describe("MarketplaceLine", () => {
  it("names both stores in full and links each to Coral's listing when it names no product", () => {
    const { p, links, hrefs } = line(<MarketplaceLine className="hero-mkt" />);
    expect(p).toHaveClass("hero-mkt");
    expect(p.textContent).toBe(
      "Available in AWS Marketplace (opens in a new tab) and Microsoft Marketplace (opens in a new tab)",
    );
    expect(hrefs).toEqual([CORAL_AWS, CORAL_MICROSOFT]);
    for (const a of links) {
      expect(a).toHaveAttribute("target", "_blank");
      expect(a).toHaveAttribute("rel", "noopener noreferrer");
      /* The mock's order: the name, the hidden hint, then the arrow. */
      expect(a.lastElementChild).toHaveClass("ext");
      expect(a.lastElementChild!.previousElementSibling).toHaveClass("sr-only");
    }
    expect(p.querySelector(".mkt-ic")).toBeNull();
  });

  it("draws the bag only where it is asked for, hidden from a screen reader", () => {
    const { p } = line(<MarketplaceLine className="hero-mkt" icon />);
    const bag = p.firstElementChild!;
    expect(bag).toHaveClass("mkt-ic");
    expect(bag).toHaveAttribute("aria-hidden", "true");
  });

  it("names Coral inside Coral's own links, the name kept out of translation", () => {
    const { links, hrefs } = line(<MarketplaceLine className="hero-mkt" product="coral" icon />);
    expect(hrefs).toEqual([CORAL_AWS, CORAL_MICROSOFT]);
    expect(links.map((a) => a.textContent)).toEqual([
      "Coral in AWS Marketplace (opens in a new tab)",
      "Coral in Microsoft Marketplace (opens in a new tab)",
    ]);
    for (const a of links) {
      expect(a.querySelector(".sr-only [translate='no']")?.textContent).toBe("Coral");
    }
  });

  it("names both products in its lead when asked, and opens Zoorik's products in each store", () => {
    /* The home hero: "Coral and Amoeba are available in …". */
    const { p, links, hrefs } = line(<MarketplaceLine className="hero-mkt" icon named />);
    expect(p.textContent).toBe(
      "Coral and Amoeba are available in AWS Marketplace (opens in a new tab) and Microsoft Marketplace (opens in a new tab)",
    );
    expect(
      [...p.querySelectorAll(":scope > span > [translate='no']")].map((name) => name.textContent),
    ).toEqual(["Coral", "Amoeba"]);
    expect(hrefs).toEqual([
      "https://aws.amazon.com/marketplace/seller-profile?id=seller-mtaavozrqchlk",
      "https://marketplace.microsoft.com/en-us/search/products?page=1&search=zoorik",
    ]);
    /* The lead names them, so the links do not say it again. */
    for (const a of links) expect(a.querySelector(".sr-only [translate='no']")).toBeNull();
  });

  it("opens Amoeba's own listings on Amoeba's hero, in both stores, and never Coral's", () => {
    /* No Coral fallback: Amoeba's line opens Amoeba's own listings. */
    const { p, links, hrefs } = line(
      <MarketplaceLine className="hero-mkt" product="amoeba" icon />,
    );
    expect(p.textContent).toBe(
      "Available in Amoeba in AWS Marketplace (opens in a new tab) and Amoeba in Microsoft Marketplace (opens in a new tab)",
    );
    expect(hrefs).toEqual([
      "https://aws.amazon.com/marketplace/pp/prodview-u52eig5hqarzy",
      "https://marketplace.microsoft.com/en-us/product/zoorik.amoeba",
    ]);
    expect(links[0]!.querySelector(".sr-only [translate='no']")).toHaveTextContent("Amoeba");
  });
});
