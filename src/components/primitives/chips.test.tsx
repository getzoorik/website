import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Chips } from "./chips";

/**
 * The chip row: the mock's classes on list markup, so it looks like the mock and
 * is heard as "Runs on, list, 4 items" rather than one run-together string.
 */
describe("Chips", () => {
  it("is a list labelled by its label, one item per chip", () => {
    const { container } = render(
      <Chips id="amoeba-runs" label="Runs on" items={["azure", "aws", "windows", "linux"]} />,
    );
    const row = container.querySelector("div.chips")!;
    const [label, list] = [...row.children];

    expect(label).toHaveClass("chips-l");
    expect(label).toHaveAttribute("id", "amoeba-runs");
    expect(label!.textContent).toBe("Runs on");
    expect(list!.tagName).toBe("UL");
    expect(list).toHaveClass("chips-g");
    /* Explicit: Safari drops a list's role once its markers are gone. */
    expect(list).toHaveAttribute("role", "list");
    expect(list).toHaveAttribute("aria-labelledby", "amoeba-runs");
    expect([...list!.children].map((li) => `${li.tagName} ${li.className}`)).toEqual([
      "LI chip",
      "LI chip",
      "LI chip",
      "LI chip",
    ]);
    expect([...list!.children].map((li) => li.textContent)).toEqual([
      "Azure",
      "AWS",
      "Windows",
      "Linux",
    ]);
  });

  it("draws each platform's mark, with the classes the site system sizes and inks", () => {
    const { container } = render(
      <Chips id="coral-runs" label="Runs on" items={["aks", "eks", "linux"]} />,
    );
    const marks = [...container.querySelectorAll(".chip > svg")];

    expect(marks).toHaveLength(3);
    for (const mark of marks) expect(mark).toHaveAttribute("aria-hidden", "true");
    /* AKS draws Azure, EKS the AWS smile (`.aws`, 22x12), Linux the penguin
       (`.tux`, in the text ink). */
    expect(marks[0]).toHaveAttribute("data-mark", "azure");
    expect(marks[1]).toHaveClass("aws");
    expect(marks[2]).toHaveClass("tux");
  });

  it("keeps every gradient id unique when two rows draw Azure on one page", () => {
    const { container } = render(
      <>
        <Chips id="coral-runs" label="Runs on" items={["aks"]} />
        <Chips id="amoeba-runs" label="Runs on" items={["azure"]} />
      </>,
    );
    const ids = [...container.querySelectorAll("[id]")].map((el) => el.id);

    expect(ids.length).toBeGreaterThan(2);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("sets a platform with an address as a link chip: the item holds the link, which keeps the chip's box", () => {
    const { container } = render(
      <Chips
        id="coral-runs"
        label="Runs on"
        items={[{ platform: "aks", href: "/aks-cost-optimization" }, "linux"]}
      />,
    );
    const [linked, plain] = [...container.querySelectorAll("ul.chips-g > li")];

    expect(linked).not.toHaveAttribute("class");
    const a = linked!.querySelector(":scope > a.chip")!;
    expect(a).toHaveAttribute("href", "/aks-cost-optimization");
    expect(a).not.toHaveAttribute("target");
    expect(a.textContent).toBe("AKS");
    expect(a.querySelector("svg")).toHaveAttribute("data-mark", "azure");
    expect(plain).toHaveClass("chip");
    expect(plain!.querySelector("a")).toBeNull();
  });

  it("sets a plain word as a chip with no mark", () => {
    const { container } = render(
      <Chips id="works" label="Compatible with your native" items={[{ text: "Karpenter" }]} />,
    );
    const chip = container.querySelector(".chip")!;

    expect(chip.textContent).toBe("Karpenter");
    expect(chip.querySelector("svg")).toBeNull();
  });
});
