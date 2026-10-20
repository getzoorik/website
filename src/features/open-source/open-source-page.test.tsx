import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

/* The nav and the footer read the pathname. */
vi.mock("next/navigation", () => ({ usePathname: () => "/open-source" }));

import OpenSourceRoute from "@/app/open-source/page";

/**
 * `/open-source`: the trust line, the projects with their
 * licence and links, the contribute rows as links, and the foot that says what is not open.
 */

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();
const page = (): HTMLElement => render(<OpenSourceRoute />).container;

describe("/open-source", () => {
  it("opens on the h1 and the deck that names the open projects", () => {
    const root = page();
    expect(root.querySelectorAll("h1")).toHaveLength(1);
    expect(text(root.querySelector("h1"))).toBe("Open source");
    expect(text(root.querySelector(".doc-deck"))).toBe(
      "zoorikctl, the assessment and the Terraform modules are open source, so you can read exactly what they do in your cluster and cloud account.",
    );
    /* Never "the parts you run yourself": the Coral agent's source is private. */
    expect(text(root)).not.toMatch(/parts of Zoorik you run yourself/i);
  });

  it("puts Published on over the groups: six channels as buttons, then the trust sentence", () => {
    const top = page().querySelector(".op-pub")!;
    const strip = top.querySelector(":scope > div.mkt-btns.op-pb")!;
    expect(strip.firstElementChild).toHaveClass("mkt-on");
    expect(strip.firstElementChild).toHaveTextContent("Published on");
    const buttons = [...strip.querySelectorAll<HTMLAnchorElement>("a.mkt-b")];
    expect(buttons.map((a) => [text(a), a.getAttribute("href")])).toEqual([
      ["GitHub · Verified organization (opens in a new tab)", "https://github.com/getzoorik"],
      ["PyPI (opens in a new tab)", "https://pypi.org/user/zoorik/"],
      ["Homebrew (opens in a new tab)", "https://github.com/getzoorik/homebrew-tap"],
      ["Scoop (opens in a new tab)", "https://github.com/getzoorik/scoop-bucket"],
      [
        "Artifact Hub · Verified Publisher (opens in a new tab)",
        "https://artifacthub.io/packages/helm/zoorik/coral-agent",
      ],
      [
        "Terraform Registry (opens in a new tab)",
        "https://registry.terraform.io/namespaces/getzoorik",
      ],
    ]);
    for (const button of buttons) {
      expect(button).toHaveAttribute("target", "_blank");
      expect(button.querySelector("svg.mkt-mk.mkt-ln")).toHaveAttribute("aria-hidden", "true");
    }
    expect(buttons[0]!.querySelector(".mkt-q")).toHaveTextContent("· Verified organization");
    const trust = top.querySelector(":scope > p.op-trust")!;
    expect(text(trust)).toBe(
      "Our public GitHub repositories are open source under Apache-2.0. Every zoorikctl release since v0.3.0 is " +
        "signed with Sigstore (opens in a new tab), and each PyPI release carries a provenance attestation from its " +
        "GitHub release workflow.",
    );
    expect(trust.querySelector("a")).toHaveAttribute(
      "href",
      "https://github.com/getzoorik/zoorikctl#install",
    );
    expect(page().querySelector("svg.op-ok")).toBeNull();
  });

  it("lists the five projects 01–05 with their licence and links; the Helm chart has neither licence nor GitHub", () => {
    const rows = [...page().querySelectorAll("#projects .op-row")];
    expect(
      rows.map((row) => [
        row.querySelector(".fq-n")!.textContent,
        text(row.querySelector("h3")),
        text(row.querySelector(".op-lic")) || null,
        [...row.querySelectorAll(".op-meta a")].map((a) => [text(a), a.getAttribute("href")]),
      ]),
    ).toEqual([
      [
        "01",
        "zoorikctl",
        "Apache-2.0",
        [
          ["GitHub (opens in a new tab)", "https://github.com/getzoorik/zoorikctl"],
          ["Releases (opens in a new tab)", "https://github.com/getzoorik/zoorikctl/releases"],
          ["Homebrew (opens in a new tab)", "https://github.com/getzoorik/homebrew-tap"],
          ["Scoop (opens in a new tab)", "https://github.com/getzoorik/scoop-bucket"],
          ["Install", "/coral#install"],
        ],
      ],
      [
        "02",
        "kubernetes-scenarios",
        "Apache-2.0",
        [["GitHub (opens in a new tab)", "https://github.com/getzoorik/kubernetes-scenarios"]],
      ],
      [
        "03",
        "assessment",
        "Apache-2.0",
        [
          ["GitHub (opens in a new tab)", "https://github.com/getzoorik/assessment"],
          ["PyPI (opens in a new tab)", "https://pypi.org/project/zoorik/"],
          [
            "Good first issues (opens in a new tab)",
            "https://github.com/getzoorik/assessment/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22",
          ],
        ],
      ],
      [
        "04",
        "Terraform modules",
        "Apache-2.0",
        [
          [
            "AKS module on GitHub (opens in a new tab)",
            "https://github.com/getzoorik/terraform-azurerm-zoorik-coral",
          ],
          [
            "AKS module on the Terraform Registry (opens in a new tab)",
            "https://registry.terraform.io/modules/getzoorik/zoorik-coral/azurerm",
          ],
          [
            "EKS module on GitHub (opens in a new tab)",
            "https://github.com/getzoorik/terraform-aws-zoorik-coral",
          ],
          [
            "EKS module on the Terraform Registry (opens in a new tab)",
            "https://registry.terraform.io/modules/getzoorik/zoorik-coral/aws",
          ],
        ],
      ],
      [
        "05",
        "Helm chart",
        null,
        [
          [
            "Artifact Hub (opens in a new tab)",
            "https://artifacthub.io/packages/helm/zoorik/coral-agent",
          ],
        ],
      ],
    ]);
    /* Each module's name is shown once, muted and hidden from screen readers: each of its links says it. */
    expect(
      [...page().querySelectorAll("#projects .op-grp > .op-k")].map((k) => [
        k.textContent,
        k.getAttribute("aria-hidden"),
      ]),
    ).toEqual([
      ["AKS", "true"],
      ["EKS", "true"],
    ]);
    for (const link of page().querySelectorAll<HTMLAnchorElement>("#projects .op-meta a")) {
      if (link.getAttribute("href")!.startsWith("/")) {
        expect(link).not.toHaveAttribute("target");
        expect(link.querySelector("svg.op-go")).toHaveAttribute("aria-hidden", "true");
      } else {
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
      }
    }
  });

  it("makes each Contribute row one link, 06–10, the off-site ones in a new tab", () => {
    const rows = [...page().querySelectorAll("#contribute a.ln-row")];
    expect(
      rows.map((row) => [
        row.querySelector(".fq-n")!.textContent,
        text(row.querySelector("h3")),
        row.getAttribute("href"),
        row.getAttribute("target"),
      ]),
    ).toEqual([
      ["06", "How to contribute", "/docs/contributing", null],
      [
        "07",
        "Good first issues",
        "https://github.com/search?q=org%3Agetzoorik+label%3A%22good+first+issue%22+state%3Aopen&type=issues",
        "_blank",
      ],
      [
        "08",
        "Contributing guide",
        "https://github.com/getzoorik/.github/blob/main/CONTRIBUTING.md",
        "_blank",
      ],
      [
        "09",
        "Code of conduct",
        "https://github.com/getzoorik/.github/blob/main/CODE_OF_CONDUCT.md",
        "_blank",
      ],
      [
        "10",
        "Security policy",
        "https://github.com/getzoorik/.github/blob/main/SECURITY.md",
        "_blank",
      ],
    ]);
  });

  it("ends on what is not open, then the closing row", () => {
    const root = page();
    expect(text(root.querySelector(".op-not"))).toBe(
      "Coral’s agent and its optimization engine are not open source. The engine runs as our service.",
    );
    expect(root.querySelector("main #assess")).not.toBeNull();
  });

  it("draws no badge image and no counts", () => {
    const root = page();
    expect(
      root.querySelector('img[src*="shields.io"], img[src*="artifacthub.io/badge"]'),
    ).toBeNull();
    expect(text(root)).not.toMatch(/\bstars?\b|\bdownloads\b/i);
  });
});
