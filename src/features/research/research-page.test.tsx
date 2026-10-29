import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

/* The nav and the footer read the pathname. */
vi.mock("next/navigation", async (original) => ({
  ...(await original<typeof import("next/navigation")>()),
  usePathname: () => "/research-cloud-cost-optimization",
}));

import Research, { metadata } from "@/app/research-cloud-cost-optimization/page";
import { researchPage } from "@/content/research";

/**
 * `/research-cloud-cost-optimization`: the metadata and card, the hero, one group per subject as the Docs hub draws
 * one, each paper a Read more tile to the publisher's page in a new tab, then the note and the closing row.
 */

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();

describe("/research-cloud-cost-optimization", () => {
  it("is titled, described and canonicalised as its mock, with its own card", () => {
    expect(metadata.title).toBe("Cloud cost optimization research");
    expect(String(metadata.description).length).toBeLessThanOrEqual(160);
    expect(metadata.alternates).toEqual({ canonical: "/research-cloud-cost-optimization" });
    expect(metadata.openGraph).toMatchObject({
      url: "/research-cloud-cost-optimization",
      title: "Cloud cost optimization research | Zoorik",
      images: [
        {
          url: "/og/pages/research-cloud-cost-optimization.png",
          alt: "Zoorik. Cloud cost optimization research.",
        },
      ],
    });
  });

  it("opens on Learn's hero, then the five groups, each its name, its line and its papers two by two", () => {
    const root = render(<Research />).container;
    expect(root.querySelector("main > header.hero.doc-hero.lv-hero#top h1")).toHaveTextContent(
      "Cloud cost optimization research",
    );
    const papers = root.querySelector("main > section.sec#papers")!;
    expect(papers).toHaveAttribute("aria-label", "Research papers");
    const groups = [...papers.querySelectorAll(":scope > .wrap > section.res-group")];
    expect(groups.map((group) => [group.id, text(group.querySelector(".res-head h2"))])).toEqual([
      ["cluster-scheduling-bin-packing", "Cluster scheduling, bin packing and autoscaling"],
      ["resource-prediction-and-sizing", "Resource prediction and sizing"],
      ["cloud-pricing-spot-and", "Cloud pricing, spot and reserved capacity"],
      ["block-storage-file-systems", "Block storage, file systems and space allocation"],
      ["live-migration-of-vms", "Live migration of VMs and containers"],
    ]);
    for (const group of groups) {
      expect(group).toHaveAttribute("aria-labelledby", `${group.id}-h`);
      expect(group.querySelector(".dt-grid.dt-2x2")).not.toBeNull();
    }
    const tiles = [...papers.querySelectorAll("article.dt > a.dt-a")];
    expect(tiles).toHaveLength(researchPage.groups.flatMap((group) => group.papers).length);
    for (const tile of tiles) {
      expect(tile.getAttribute("href")).toMatch(/^https:\/\//);
      expect(tile).toHaveAttribute("target", "_blank");
      expect(tile).toHaveAttribute("rel", "noopener noreferrer");
      expect(tile.querySelectorAll(".dt-l")).toHaveLength(2);
      expect(tile.querySelector("svg.dt-go")).toHaveAttribute("aria-hidden", "true");
      expect(tile.querySelector(".sr-only")).toHaveTextContent("(opens in a new tab)");
    }
    expect(text(tiles[0]!.querySelector(".dt-t"))).toBe(
      "Large-scale cluster management at Google with Borg",
    );
    expect(text(tiles[0]!.querySelector(".dt-l"))).toBe(
      "Abhishek Verma et al. · ACM EuroSys, 2015",
    );
    expect(text(papers.querySelector(":scope > .wrap > p.cm-note"))).toBe(
      "Other researchers wrote every paper here. Each link goes to the publisher’s page. The short note under each paper is in our own words.",
    );
    const row = root.querySelector("main > section#assess")!;
    expect(row.querySelector("a.btn-ink")).toHaveAttribute("href", "/assessment");
    expect(text(row.querySelector("#contact p"))).toBe(
      "Thirty minutes with the people who build Coral and Amoeba.",
    );
  });

  it("keeps a figure with its unit, and curly apostrophes", () => {
    const notes = researchPage.groups.flatMap((group) => group.papers.map((paper) => paper.note));
    expect(notes.some((note) => note.includes("50 ms"))).toBe(true);
    expect(notes.join(" ")).not.toMatch(/'/);
  });
});
