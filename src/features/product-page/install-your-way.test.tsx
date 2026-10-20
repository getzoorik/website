import { fireEvent, render, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { InstallYourWay } from "@/features/product-page/install-your-way";

/** /coral's "Install your way". */

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();

describe("Install your way", () => {
  it("draws three cards: zoorikctl recommended, Helm and Terraform, each with its links at the foot", () => {
    const { container } = render(<InstallYourWay />);
    const section = container.querySelector("section#install")!;
    expect(text(section.querySelector("h2"))).toBe("Install your way");
    expect(section.querySelector(".sec-hrow > a.alink")).toHaveAttribute("href", "/open-source");
    const cards = [...section.querySelectorAll(".iw-card")];
    expect(cards.map((card) => text(card.querySelector("h3")))).toEqual([
      "zoorikctl",
      "Helm",
      "Terraform",
    ]);
    expect(text(cards[0]!.querySelector(".iw-tag"))).toBe("Recommended");
    expect(
      cards.map((card) =>
        [...card.querySelectorAll(".iw-links a")].map((a) => a.getAttribute("href")),
      ),
    ).toEqual([
      [
        "https://github.com/getzoorik/zoorikctl",
        "https://github.com/getzoorik/zoorikctl/releases",
        "https://github.com/getzoorik/zoorikctl#install",
      ],
      ["https://artifacthub.io/packages/helm/zoorik/coral-agent", "/docs/install-coral-with-helm"],
      ["https://registry.terraform.io/namespaces/getzoorik", "/docs/install-coral-with-terraform"],
    ]);
    /* Terraform's well has no prompt and no copy; its comments are muted. */
    expect(cards[2]!.querySelector(".iw-copy")).toBeNull();
    expect([...cards[2]!.querySelectorAll("pre i")].map((i) => i.textContent)).toEqual([
      "# AKS",
      "# EKS",
    ]);
  });

  it("shows Helm's whole install line, five lines with one prompt, and says how to get a console account", async () => {
    const writeText = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    Object.defineProperty(window, "isSecureContext", { value: true, configurable: true });
    const { container } = render(<InstallYourWay />);
    const card = container.querySelectorAll(".iw-card")[1]!;
    const well = card.querySelector(".iw-well")!;
    expect(well).toHaveClass("is-hang");
    expect([...well.querySelectorAll("pre > .iw-ln")].map((line) => text(line))).toEqual([
      "$ helm install coral-agent \\",
      "oci://ghcr.io/getzoorik/charts/coral-agent \\",
      "--namespace default \\",
      "--set controlPlaneUrl=<control plane origin> \\",
      "--set connectToken.value=<connect token>",
    ]);
    expect(well.querySelectorAll("pre i")).toHaveLength(1);
    /* A hyphenated word never parts; a long line may break after a "/", an "=" or a ".". */
    expect([...well.querySelectorAll(".nb")].map((nb) => nb.textContent)).toEqual([
      "coral-agent",
      "coral-agent",
      "--namespace",
      "--set",
      "--set",
    ]);
    fireEvent.click(well.querySelector(".iw-copy")!);
    await vi.waitFor(() =>
      expect(writeText).toHaveBeenCalledWith(
        [
          "helm install coral-agent \\",
          "  oci://ghcr.io/getzoorik/charts/coral-agent \\",
          "  --namespace default \\",
          "  --set controlPlaneUrl=<control plane origin> \\",
          "  --set connectToken.value=<connect token>",
        ].join("\n"),
      ),
    );
    const note = card.querySelector(".iw-alt")!;
    expect(text(note)).toBe(
      "Coral is in early access — book a demo (opens in a new tab) for a console account.",
    );
    expect(note.querySelector('[translate="no"]')).toHaveTextContent("Coral");
    expect(note.querySelector("a")).toHaveAttribute("href", "https://cal.com/zoorik/talk");
    expect(note.querySelector("a")).toHaveAttribute("target", "_blank");
  });

  it("switches zoorikctl's command by system, with the arrow keys, Home and End", () => {
    const { container } = render(<InstallYourWay />);
    const card = container.querySelector(".iw-card")!;
    const group = within(card as HTMLElement).getByRole("radiogroup", { name: "Operating system" });
    const radios = within(group).getAllByRole("radio");
    fireEvent.keyDown(
      radios.find((r) => r.getAttribute("aria-checked") === "true")!,
      { key: "End" },
    );
    expect(text(card.querySelector("pre"))).toBe(
      "PS> scoop bucket add getzoorik https://github.com/getzoorik/scoop-bucket PS> scoop install zoorikctl",
    );
    expect(text(card.querySelector(".iw-alt"))).toBe(
      "Or: irm https://get.zoorik.com/windows.ps1 | iex",
    );
    fireEvent.keyDown(within(group).getByRole("radio", { name: "Windows" }), { key: "ArrowLeft" });
    expect(text(card.querySelector("pre"))).toBe("$ curl -fsSL https://get.zoorik.com/linux | sh");
    expect(card.querySelector(".iw-alt")).toBeNull();
    fireEvent.keyDown(within(group).getByRole("radio", { name: "Linux" }), { key: "Home" });
    expect(text(card.querySelector("pre"))).toBe(
      "$ brew tap getzoorik/tap $ brew trust getzoorik/tap $ brew install zoorikctl",
    );
    expect(card.querySelector(".iw-copy")).toHaveAttribute("aria-label", "Copy the macOS command");
  });
});
