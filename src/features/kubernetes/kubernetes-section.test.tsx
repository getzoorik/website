import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { homeFilms } from "@/content/home-films";
import { kubernetesContent } from "@/content/kubernetes";
import { KubernetesSection } from "@/features/kubernetes/kubernetes-section";

/**
 * The Coral section on the home page: the copy column and the product's film.
 */
describe("KubernetesSection", () => {
  test("keeps its old anchor landing on the section", () => {
    const { container } = render(<KubernetesSection />);
    const section = container.querySelector("section#coral");
    const alias = container.querySelector("#kubernetes");

    /* `#kubernetes` was the section's id before the product was named. The
       empty marker carries it now, directly above the section, so the browser's
       own fragment scroll still has something to land on. */
    expect(section).not.toBeNull();
    expect(alias).not.toBeNull();
    expect(alias!.nextElementSibling).toBe(section);
    expect(alias).toHaveAttribute("aria-hidden", "true");
    expect(alias!.textContent).toBe("");
  });

  test("sends the button to the assessment, opened on Coral", () => {
    const { container } = render(<KubernetesSection />);
    const button = container.querySelector("a.btn-ink")!;

    expect(button).toHaveAttribute("href", "/assessment?p=coral");
    /* One label, said once: no hover roll and no second, hidden label. */
    expect(button.textContent!.trim()).toBe(kubernetesContent.cta.label);
    expect(button.textContent!.trim()).toBe("Estimate your saving");
    expect(button.querySelector(".btn-sw, [aria-hidden='true']:not(svg)")).toBeNull();
  });

  test("draws the copy first and the film after it, in the film's wider grid", () => {
    const { container } = render(<KubernetesSection />);
    const grid = container.querySelector("#coral .st-grid")!;

    expect(grid).toHaveClass("mo-grid");
    expect(grid).not.toHaveClass("flip");
    expect([...grid.children].map((el) => el.className)).toEqual(["rise", "mo-film mo-r"]);
  });

  test("shows Coral's film in a framed screen, named for a screen reader, with its caption", () => {
    const { container } = render(<KubernetesSection />);
    const film = container.querySelector<HTMLElement>("figure.mo-film")!;
    const video = film.querySelector<HTMLVideoElement>(".mo-screen > video.mo-vid")!;

    /* It comes in once, 120ms after the copy, through the home page's one
       observer (`HomeMotion`), which finds it by `.mo-r`. */
    expect(film).toHaveClass("mo-r");
    expect(film.style.getPropertyValue("--d")).toBe("120ms");
    expect(video).toHaveAttribute("src", "/motion/coral-overview-5s.mp4");
    expect(video).toHaveAttribute("poster", "/motion/coral-poster.webp");
    expect(video).toHaveAttribute("aria-label", homeFilms.coral.label);
    expect(video.getAttribute("aria-label")).toMatch(
      /^Coral product preview with example figures: the Overview, /,
    );
    expect(film.querySelector("figcaption.mo-cap")!.textContent).toBe(
      "Coral product preview with example figures.",
    );
  });

  test("keeps the console's wording out of the copy", () => {
    const { container } = render(<KubernetesSection />);
    const copy = container.querySelector(".rise")!.textContent!;

    /* The copy column is the page's voice, and the page never says Coral
       "right-sizes": that is Amoeba's verb. */
    expect(copy).not.toMatch(/right-?siz/i);
    /* The h2 names the category and links to /coral; the line leads with what Coral stops (23 Oct 2026). */
    const h2 = container.querySelector("h2")!;
    expect(h2.textContent).toBe("Kubernetes cost optimization");
    expect(h2.querySelector("a")).toHaveAttribute("href", "/coral");
    const line = container.querySelector(".st-body")!;
    expect(line.textContent).toBe(
      "Stop paying for idle Kubernetes capacity. Coral rebalances workloads and removes the nodes you don’t need. No code changes. Read our guide to Kubernetes cost optimization.",
    );
    expect(line.querySelector('[translate="no"]')).toHaveTextContent("Coral");
    /* The guide's sentence links the subject's pillar, in the prose link's own style (no class). */
    const guide = line.querySelector("a")!;
    expect(guide.textContent).toBe("Kubernetes cost optimization");
    expect(guide).toHaveAttribute("href", "/kubernetes-cost-optimization");
    expect(guide).not.toHaveAttribute("class");
  });

  test("links AKS and EKS to their pages", () => {
    const { container } = render(<KubernetesSection />);
    expect(
      [...container.querySelectorAll("ul.chips-g > li > a.chip")].map((a) => [
        a.textContent,
        a.getAttribute("href"),
      ]),
    ).toEqual([
      ["AKS", "/aks-cost-optimization"],
      ["EKS", "/eks-cost-optimization"],
    ]);
  });
});
