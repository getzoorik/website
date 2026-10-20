import { existsSync } from "node:fs";
import { join } from "node:path";

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { contactEmail, routes } from "@/config/site";
import { assessmentProducts } from "@/content/assessment";
import { caseStudy } from "@/content/case-studies";

/* The nav and the footer read the pathname. */
vi.mock("next/navigation", () => ({ usePathname: () => "/referrals" }));

import ReferralsRoute, { metadata } from "@/app/referrals/page";

/**
 * `/referrals`: the metadata, the hero with "Coming soon", the journey's three steps and their pictures, who to
 * introduce, what they will see (the study's figures and the example report, read from their sources), the close; and
 * no terms of any kind, since the program has none. The motion is in `programs-motion.test.tsx`, the sitemap entry in
 * `src/app/sitemap.test.ts`, the structured data in `src/config/structured-data.test.ts`.
 */

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();
const page = () => render(<ReferralsRoute />).container;
/* By class: jsdom resolves `#main` against the whole document, where an earlier render's <main> comes first. */
const main = () => page().querySelector("main.pv-main")!;
/** What a reader sees: the page's text without the motion's <noscript> style. */
const words = (): string => {
  const copy = main().cloneNode(true) as Element;
  for (const hidden of copy.querySelectorAll("noscript")) hidden.remove();
  return text(copy);
};

describe("/referrals's metadata", () => {
  it("has the mock's title through the site's template, its description and its canonical", () => {
    expect(metadata.title).toBe("Referral program (coming soon)");
    expect(metadata.description).toBe(
      "Introduce a team that runs Kubernetes or block storage on Azure or AWS to Zoorik. The referral program is coming soon.",
    );
    expect(metadata.alternates).toEqual({ canonical: "/referrals" });
    expect(metadata).not.toHaveProperty("robots");
  });
});

describe("/referrals", () => {
  it("opens on the utility hero: Coming soon, the h1, the line and two buttons", () => {
    const m = main();
    expect(m).toHaveAttribute("id", "main");
    const hero = m.querySelector(":scope > header.hero.doc-hero")!;
    expect(hero).toHaveAttribute("id", "top");
    expect(hero.querySelector(".zk-art")).not.toBeNull();
    expect(text(hero.querySelector(".pg-soon"))).toBe("Coming soon");
    expect(text(hero.querySelector("h1"))).toBe("Referral program");
    expect(text(hero.querySelector(".doc-deck"))).toBe(
      "Know a team that runs Kubernetes or block storage on Azure or AWS? Soon you’ll be able to introduce them to Zoorik and be rewarded when they become a customer.",
    );
    expect(hero.querySelector('.doc-deck [translate="no"]')).toHaveTextContent("Zoorik");
    const [write, more] = hero.querySelectorAll<HTMLAnchorElement>(".hero-cta a");
    expect(write).toHaveClass("btn", "btn-light");
    expect(write).toHaveTextContent("Tell me when it opens");
    expect(write!.getAttribute("href")).toBe(`mailto:${contactEmail}?subject=Referral%20program`);
    expect(more).toHaveClass("btn", "btn-wire");
    expect(more!.getAttribute("href")).toBe("#how");
  });

  it("lays out the mock's sections in its order, each at its address", () => {
    const m = main();
    const sections = [...m.querySelectorAll(":scope > section")];
    expect(sections.map((s) => s.id)).toEqual(["how", "who", "proof", ""]);
    expect(sections.map((s) => text(s.querySelector("h2")))).toEqual([
      "How it will work",
      "Who you could introduce",
      "What they’ll see",
      "Want to hear when it opens?",
    ]);
    expect(sections.map((s) => s.className)).toEqual(["sec pv-sec", "sec sec-band", "sec", "sec"]);
    /* The mock ends on the close: no closing assessment row. */
    expect(m.querySelector("#contact")).toBeNull();
  });

  it("draws How it will work as three steps on a line, each with its picture", () => {
    const panel = main().querySelector("#how .pv-panel.pv-anim")!;
    expect(text(panel.querySelector(".pv-eyebrow"))).toBe("The referral program");
    expect(text(panel.querySelector(".pv-phead p:not(.pv-eyebrow)"))).toBe(
      "Three steps. Nothing to sign up for yet.",
    );
    const list = panel.querySelector("ol.pv-journey")!;
    /* The line is an item hidden from assistive tech, so the list reads as its three steps. */
    expect(list.firstElementChild).toHaveClass("pv-line");
    expect(list.firstElementChild).toHaveAttribute("aria-hidden", "true");
    const steps = [...list.querySelectorAll(":scope > li.pv-step")];
    expect(steps.map((step) => text(step.querySelector(".pv-n")))).toEqual(["1", "2", "3"]);
    expect(steps.map((step) => (step as HTMLElement).style.getPropertyValue("--i"))).toEqual([
      "0",
      "1",
      "2",
    ]);
    expect(steps.map((step) => text(step.querySelector("h3")))).toEqual([
      "Introduce a team",
      "They see their number",
      "You’re rewarded",
    ]);

    const mail = steps[0]!.querySelector(".pv-scene .pv-mail")!;
    expect(
      [...mail.querySelectorAll(".pv-mrow")].map((row) => [...row.children].map(text)),
    ).toEqual([
      ["To", contactEmail],
      ["Subject", "Introduction: a team on AKS"],
    ]);
    expect(text(mail.querySelector(".pv-send"))).toBe("Send");

    /* The assessment's own command, and the report by the name /assessment gives it. */
    const lines = [...steps[1]!.querySelectorAll(".pv-term pre .pv-ln")];
    expect(lines.map(text)).toEqual([
      `$ ${assessmentProducts.coral.run}`,
      "Reading clusters…",
      `Writing ${assessmentProducts.coral.demo.file}`,
    ]);
    expect(lines.map((line) => line.className)).toEqual(["pv-ln pv-cmd", "pv-ln", "pv-ln"]);

    expect(text(steps[2]!.querySelector(".pv-tchip"))).toBe("Terms: on this page when it opens");
  });

  it("names six teams to introduce, each with its mark and its product", () => {
    const teams = [...main().querySelectorAll("#who .pv-who > .pv-wt")];
    expect(
      teams.map((team) => [text(team.querySelector("b")), text(team.querySelector("small"))]),
    ).toEqual([
      ["Platform teams on AKS", "Coral"],
      ["Platform teams on Amazon EKS", "Coral"],
      ["Teams whose Azure managed disks keep growing", "Amoeba"],
      ["Teams with large Amazon EBS volumes", "Amoeba"],
      ["FinOps practitioners", "Coral and Amoeba"],
      ["SRE and DevOps leads", "Coral and Amoeba"],
    ]);
    for (const team of teams) expect(team.querySelector(":scope > svg.pv-wic")).not.toBeNull();
  });

  it("shows the case study's own figures and page one of the example report", () => {
    const proof = main().querySelector("#proof .pv-proof")!;
    const study = proof.querySelector<HTMLAnchorElement>("a.pv-case")!;
    expect(study.getAttribute("href")).toBe(routes.caseStudyCoralDevCluster);
    /* The study's own label, read from its kicker, so it follows the study. */
    expect(text(study.querySelector(".pv-kick"))).toBe(
      `${caseStudy.hero.kicker.split(" · ")[0]} · Coral on AKS`,
    );
    expect(text(study.querySelector(".pv-big"))).toBe(caseStudy.band.stats[0].value);
    expect(text(study.querySelector(".pv-big"))).toBe("−58%");
    expect([...study.querySelectorAll(".pv-bars em")].map(text)).toEqual(["$368.65", "$154.76"]);
    /* The second bar is today's bill on the connected bill's scale, as the mock draws it. */
    const [before, after] = caseStudy.result.costs.steps.filter((step) => step.kind !== "drop");
    const bars = [...study.querySelectorAll<HTMLElement>(".pv-bars i")];
    expect(bars.map((bar) => parseFloat(bar.style.width))).toEqual([
      100,
      Number(((after!.amount / before!.amount) * 100).toFixed(1)),
    ]);
    expect(text(study.querySelector(".pv-go"))).toBe("Read the case study");

    const report = proof.querySelector<HTMLAnchorElement>("a.pv-report")!;
    expect(report.getAttribute("href")).toBe(routes.assessment);
    const img = report.querySelector("img")!;
    expect(img).toHaveAttribute("alt", "Page one of the example Coral assessment report");
    expect(img).toHaveAttribute("loading", "lazy");
    expect(existsSync(join("public", img.getAttribute("src")!))).toBe(true);
  });

  it("closes on a ready email to the founders", () => {
    const close = main().querySelector(".pv-close")!;
    expect(text(close.querySelector("p"))).toBe(
      "The terms will be on this page when the program opens.",
    );
    const cta = close.querySelector<HTMLAnchorElement>("a.pv-cta")!;
    expect(text(cta)).toBe("Write to us");
    expect(cta.getAttribute("href")).toBe(`mailto:${contactEmail}?subject=Referral%20program`);
  });
});

describe("/referrals states no terms", () => {
  /* The program has no terms yet: no reward amount, commission, payout or figure of our own. */
  it("names no reward, commission or payout, and no amount beside the reward", () => {
    expect(words()).not.toMatch(
      /commission|payout|pay out|bounty|per referral|referral fee|\bbonus|credit|discount/i,
    );
    /* The third step, its number aside: its picture's chip, its title and its line. */
    const reward = main().querySelectorAll("#how li.pv-step")[2]!;
    const said = [".pv-tchip", "h3", "p"].map((part) => text(reward.querySelector(part)));
    expect(said).toEqual([
      "Terms: on this page when it opens",
      "You’re rewarded",
      "When they become a customer, you are rewarded on the terms this page will set out.",
    ]);
    for (const line of said) expect(line).not.toMatch(/\d|\$|%|€|£|₹/);
  });

  it("prints no money or share but the case study's own", () => {
    const figures = words().match(/[−-]?\$?\d[\d.,]*%?/g) ?? [];
    /* Step numbers aside, every figure on the page is the study's. */
    expect(figures.filter((figure) => !/^[123]$/.test(figure))).toEqual([
      "−58%",
      "$368.65",
      "$154.76",
    ]);
  });

  it("keeps to the house words", () => {
    expect(words()).not.toMatch(/\bcut\b|\blower\b|\bwaste/i);
  });
});
