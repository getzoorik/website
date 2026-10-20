import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

/* The nav and the footer read the pathname. */
vi.mock("next/navigation", () => ({ usePathname: () => "/docs" }));

import Contributing from "@/app/docs/contributing/page";
import InstallCoralWithHelm from "@/app/docs/install-coral-with-helm/page";
import InstallCoralWithTerraform from "@/app/docs/install-coral-with-terraform/page";

/**
 * The three guides under /docs: the article frame, the top line, the command
 * wells' prompt rule, the plain code blocks and the related links.
 */

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();
const sections = (root: HTMLElement) =>
  [...root.querySelectorAll("article.ar-frame > section.fq-sec > h2")].map((h2) => text(h2));

describe("the open-source guides", () => {
  it("Install Coral with Helm: its sections in order, the top line and the related links", () => {
    const root = render(<InstallCoralWithHelm />).container;
    expect(text(root.querySelector("h1"))).toBe("Install Coral with Helm");
    expect(text(root.querySelector(".doc-updated"))).toBe(
      "Updated 16 October 2026 · Published by Zoorik",
    );
    expect(sections(root)).toEqual([
      "Before you install",
      "Install",
      "Values",
      "Cloud identity",
      "With Argo CD or Flux",
      "Upgrade",
      "Uninstall",
    ]);
    expect(root.querySelectorAll("table.doc-tbl")).toHaveLength(3);
    expect(
      [...root.querySelectorAll(".nw-links a")].map((a) => [text(a), a.getAttribute("href")]),
    ).toEqual([
      ["Install Coral with Terraform + Helm", "/docs/install-coral-with-terraform"],
      ["Open source", "/open-source"],
    ]);
  });

  it("prompts a command only where it starts, keeps a continuation's indent, and copies the plain lines", () => {
    const root = render(<InstallCoralWithHelm />).container;
    const well = root.querySelector(".as-well.doc-well:not(.is-yaml)")!;
    const lines = well.querySelector("pre")!.textContent!.split("\n");
    expect(lines[0]).toBe("$ helm install coral-agent \\");
    expect(lines[1]).toBe("  oci://ghcr.io/getzoorik/charts/coral-agent \\");
    expect(well.querySelectorAll("pre i")).toHaveLength(1);
    expect(well.querySelector("button.as-copy")).toHaveAttribute("aria-label", "Copy the command");
  });

  it("draws values, YAML and HCL as plain blocks with no prompt and no copy", () => {
    const root = render(<InstallCoralWithTerraform />).container;
    const blocks = [...root.querySelectorAll(".as-well.is-yaml")];
    expect(blocks.length).toBeGreaterThan(0);
    for (const block of blocks) {
      expect(block.querySelector("pre i, button")).toBeNull();
    }
    expect(text(root.querySelector(".ar-short"))).toMatch(/^Each module creates the same identity/);
    expect(sections(root)).toEqual(["AKS", "EKS", "Machine deletion", "Your own node pool code"]);
  });

  it("Contributing: its sections, the numbered steps and the private report line", () => {
    const root = render(<Contributing />).container;
    expect(sections(root)).toEqual([
      "Pick an issue",
      "Run a repository locally",
      "Open a pull request",
      "Review",
      "Security and conduct",
    ]);
    expect(root.querySelectorAll("ol.doc-steps > li")).toHaveLength(4);
    expect(root.querySelector('a[href="mailto:founders@zoorik.com"]')).not.toBeNull();
  });
});
