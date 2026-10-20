import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { marketplaces } from "@/config/marketplaces";
import { agentChart, openSourceLinks } from "@/config/open-source";
import { contactEmail, routes } from "@/config/site";
import { assessmentProducts } from "@/content/assessment";
import { caseStudy } from "@/content/case-studies";
import { savingsFigures, savingsQualifier } from "@/content/savings";

/* The nav and the footer read the pathname. */
vi.mock("next/navigation", () => ({ usePathname: () => "/partners" }));

import PartnersRoute, { metadata } from "@/app/partners/page";

/**
 * `/partners`: the metadata, the hero with "Coming soon", the home page's three ranges on one scale (read from
 * `savings.ts`, never typed here), who it is for under its drawn covers, the kit that works today (its commands and
 * addresses read from their sources), the close; and no terms of any kind, since the program has none. The motion is in
 * `programs-motion.test.tsx`, the sitemap entry in `src/app/sitemap.test.ts`, the structured data in
 * `src/config/structured-data.test.ts`.
 */

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();
/* By class: jsdom resolves an id against the whole document, where an earlier render's comes first. */
const main = () => render(<PartnersRoute />).container.querySelector("main.pv-main")!;
/** What a reader sees: the page's text without the motion's <noscript> style. */
const words = (): string => {
  const copy = main().cloneNode(true) as Element;
  for (const hidden of copy.querySelectorAll("noscript")) hidden.remove();
  return text(copy);
};

describe("/partners's metadata", () => {
  it("has the mock's title through the site's template, its description and its canonical", () => {
    expect(metadata.title).toBe("Partner program (coming soon)");
    expect(metadata.description).toBe(
      "A partner program for consultancies, managed service providers and resellers who run Kubernetes and block storage on Azure and AWS. Coming soon.",
    );
    expect(metadata.alternates).toEqual({ canonical: "/partners" });
    expect(metadata).not.toHaveProperty("robots");
  });
});

describe("/partners", () => {
  it("opens on the utility hero: Coming soon, the h1, the line and two buttons", () => {
    const m = main();
    expect(m).toHaveAttribute("id", "main");
    const hero = m.querySelector(":scope > header.hero.doc-hero")!;
    expect(text(hero.querySelector(".pg-soon"))).toBe("Coming soon");
    expect(text(hero.querySelector("h1"))).toBe("Partner program");
    expect(text(hero.querySelector(".doc-deck"))).toBe(
      "For consultancies, managed service providers and resellers who run Kubernetes and block storage for their customers on Azure and AWS.",
    );
    const [write, more] = hero.querySelectorAll<HTMLAnchorElement>(".hero-cta a");
    expect(text(write!)).toBe("Talk to us about partnering");
    expect(write!.getAttribute("href")).toBe(`mailto:${contactEmail}?subject=Partner%20program`);
    expect(text(more!)).toBe("What you can use today");
    expect(more!.getAttribute("href")).toBe("#today");
  });

  it("lays out the mock's sections in its order, each at its address", () => {
    const m = main();
    const sections = [...m.querySelectorAll(":scope > section")];
    expect(sections.map((s) => s.id)).toEqual(["offer", "who", "today", ""]);
    expect(sections.map((s) => text(s.querySelector("h2")))).toEqual([
      "Reduce their cloud bill, autonomously, without any downtime",
      "Who it is for",
      "What you can use today",
      "Want to partner with us?",
    ]);
    expect(sections.map((s) => s.className)).toEqual(["sec pv-sec", "sec", "sec sec-band", "sec"]);
    expect(m.querySelector("#contact")).toBeNull();
  });

  it("draws the home page's three ranges on one 0 to 100% scale, each band at its range", () => {
    const panel = main().querySelector(".pv-panel.pv-anim.pv-offer")!;
    expect(text(panel.querySelector(".pv-eyebrow"))).toBe("What you bring to your customers");
    expect(text(panel.querySelector(".pv-phead p:not(.pv-eyebrow)"))).toBe(
      "Coral rebalances Kubernetes. Amoeba rightsizes block storage.",
    );
    expect([...panel.querySelectorAll(".pv-scale span")].map(text)).toEqual([
      "0%",
      "25%",
      "50%",
      "75%",
      "100%",
    ]);
    const rows = [...panel.querySelectorAll<HTMLElement>(".pv-rg")];
    expect(
      rows.map((row) => [
        text(row.querySelector(".pv-rl b")),
        text(row.querySelector(".pv-rl small")),
      ]),
    ).toEqual([
      ["Coral", "Kubernetes on AKS and EKS"],
      ["Amoeba", "Block storage: Azure managed disks and Amazon EBS"],
      ["Together", "The overall cloud bill"],
    ]);
    const figures = [savingsFigures.coral, savingsFigures.amoeba, savingsFigures.both];
    expect(rows.map((row) => text(row.querySelector(".pv-rv")))).toEqual(
      figures.map((f) => f.range),
    );
    expect(rows.map((row) => text(row.querySelector(".pv-rv")))).toEqual([
      "40–50%",
      "50–60%",
      "20–30%",
    ]);
    /* Each figure is said as it is meant, and its band runs between its two ends. */
    expect(rows.map((row) => row.querySelector(".pv-rv")!.getAttribute("aria-label"))).toEqual(
      figures.map((f) => f.spoken),
    );
    expect(
      rows.map((row) => ["--a", "--b", "--i"].map((name) => row.style.getPropertyValue(name))),
    ).toEqual([
      ["40", "50", "0"],
      ["50", "60", "1"],
      ["20", "30", "2"],
    ]);
    /* Together draws both products' marks. */
    expect(rows[2]!.querySelectorAll(".pv-both svg.pv-wic")).toHaveLength(2);

    const foot = panel.querySelector(".pv-ofoot")!;
    expect(text(foot.querySelector("span"))).toBe(savingsQualifier);
    const study = foot.querySelector("a")!;
    expect(text(study)).toBe(`${caseStudy.band.stats[0].value} on our own cluster`);
    expect(study.getAttribute("href")).toBe(routes.caseStudyCoralDevCluster);
  });

  it("names who it is for, each card under its drawn cover", () => {
    const cards = [...main().querySelectorAll(".pv-wgrid > article.pv-wcard")];
    expect(cards.map((card) => text(card.querySelector("h3")))).toEqual([
      "Consultancies and system integrators",
      "Managed service providers",
      "Resellers and marketplace partners",
    ]);
    const covers = cards.map((card) => card.querySelector(":scope > .pv-cv")!);
    expect(covers.map((cover) => cover.className)).toEqual([
      "pv-cv pv-cv-plan",
      "pv-cv pv-cv-fleet",
      "pv-cv pv-cv-mkt",
    ]);
    for (const cover of covers) expect(cover).toHaveAttribute("aria-hidden", "true");
    expect(covers[0]!.querySelectorAll("i")).toHaveLength(6);
    expect(covers[1]!.querySelectorAll("i")).toHaveLength(21);
    expect(covers[1]!.querySelectorAll("i.on")).toHaveLength(5);
    expect([...covers[2]!.querySelectorAll("span")].map(text)).toEqual(
      marketplaces.map((store) => store.name),
    );
    expect(text(cards[1]!.querySelector("p"))).toBe(
      "You run clusters and VMs for customers every day. Coral rebalances their Kubernetes and Amoeba rightsizes their block storage, autonomously, without any downtime.",
    );
  });

  it("lists today's kit, its commands and addresses read from their sources", () => {
    const kits = [...main().querySelectorAll(".pv-kits > article")];
    expect(kits.map((kit) => text(kit.querySelector("h3")))).toEqual([
      "The free assessment",
      "Helm chart",
      "Terraform modules",
      "The marketplaces",
    ]);
    expect(kits.map((kit) => kit.querySelector("a.pv-go")!.getAttribute("href"))).toEqual([
      routes.assessment,
      routes.docsInstallHelm,
      routes.docsInstallTerraform,
      routes.marketplaces,
    ]);
    expect(kits.map((kit) => text(kit.querySelector("a.pv-go")))).toEqual([
      "See the assessment",
      "Install with Helm",
      "Install with Terraform",
      "Where to find us",
    ]);
    const lines = (kit: Element) => [...kit.querySelectorAll(".pv-term pre .pv-ln")].map(text);
    expect(lines(kits[0]!)).toEqual([
      `$ ${assessmentProducts.coral.run}`,
      `$ ${assessmentProducts.amoeba.run}`,
    ]);
    expect(lines(kits[1]!)).toEqual(["$ helm install coral-agent \\", agentChart]);
    expect(lines(kits[2]!)).toEqual([
      'module "zoorik_coral" {',
      'source = "getzoorik/zoorik-coral/azurerm"',
      "}",
    ]);
    expect(openSourceLinks.terraformAks).toBe(
      "https://registry.terraform.io/modules/getzoorik/zoorik-coral/azurerm",
    );
    expect(text(kits[2]!.querySelector(".pv-bar span"))).toBe("main.tf");
    expect(kits[3]).toHaveClass("pv-kit", "pv-kit-mkt");
    expect([...kits[3]!.querySelectorAll(".pv-mkts span")].map(text)).toEqual(
      marketplaces.map((store) => store.name),
    );
  });

  it("gives each Azure mark its own gradients", () => {
    const ids = [...main().querySelectorAll("linearGradient")].map((gradient) => gradient.id);
    expect(ids.length).toBeGreaterThan(0);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("closes on a ready email to the founders", () => {
    const close = main().querySelector(".pv-close")!;
    expect(text(close.querySelector("p"))).toBe(
      "The terms will be on this page when the program opens.",
    );
    const cta = close.querySelector<HTMLAnchorElement>("a.pv-cta")!;
    expect(text(cta)).toBe("Write to us");
    expect(cta.getAttribute("href")).toBe(`mailto:${contactEmail}?subject=Partner%20program`);
  });
});

describe("/partners states no terms", () => {
  /* The program has no terms yet: no commission, margin, payout or figure of our own. */
  it("names no commission, margin, payout or reward", () => {
    expect(words()).not.toMatch(
      /commission|payout|pay out|\bmargin|revenue share|rev share|discount|\bbonus|reward|referral fee/i,
    );
  });

  it("prints no money or share but the ranges, their scale and the case study's", () => {
    const figures = words().match(/[−-]?\$?\d[\d.,–]*%?/g) ?? [];
    expect(figures).toEqual([
      "0%",
      "25%",
      "50%",
      "75%",
      "100%",
      "40–50%",
      "50–60%",
      "20–30%",
      "−58%",
    ]);
  });

  it("keeps to the house words", () => {
    expect(words()).not.toMatch(/\bcut\b|\blower\b|\bwaste/i);
  });
});
