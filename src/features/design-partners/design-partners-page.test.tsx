import { existsSync } from "node:fs";
import { join } from "node:path";

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { calendarUrl, contactEmail, routes } from "@/config/site";
import { assessmentProducts } from "@/content/assessment";
import { caseStudy } from "@/content/case-studies";
import { designPartnerPlaces } from "@/content/design-partners";
import { marketGroups } from "@/content/learn-market";

/* The nav and the footer read the pathname. */
vi.mock("next/navigation", () => ({ usePathname: () => "/design-partners" }));

import DesignPartnersRoute, { metadata } from "@/app/design-partners/page";

/**
 * `/design-partners`: the metadata, the hero with "Open now", the offer and its ten places, what a partner gets, the
 * four steps and their pictures, what we ask, who it is for, where the results will sit (the study's figures and the
 * example report, read from their sources), the close; and one offer and one term, with no other figure. The motion
 * is in `design-partners-motion.test.tsx`, the sitemap entry in `src/app/sitemap.test.ts`, the structured data in
 * `src/config/structured-data.test.ts`.
 */

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();
/* By class: jsdom resolves an id against the whole document, where an earlier render's comes first. */
const main = () => render(<DesignPartnersRoute />).container.querySelector("main.dp-main")!;
/** What a reader hears: the page's text without the motion's <noscript> styles and the drawings hidden from them. */
const words = (): string => {
  const copy = main().cloneNode(true) as Element;
  for (const hidden of copy.querySelectorAll('noscript, [aria-hidden="true"], .sr-only')) {
    hidden.remove();
  }
  return text(copy);
};
const mailto = `mailto:${contactEmail}?subject=Design%20partner%20program`;
/** What the study is, the first part of its own kicker. */
const studyLabel = caseStudy.hero.kicker.split(" · ")[0]!;
const [before, after] = caseStudy.result.costs.steps.filter((step) => step.kind !== "drop");

describe("/design-partners's metadata", () => {
  it("has the mock's title through the site's template, its description and its canonical", () => {
    expect(metadata.title).toBe("Design partner program");
    expect(metadata.description).toBe(
      `Join Zoorik's design partner program: the first ${designPartnerPlaces} partners run Coral and Amoeba free on their non-production infrastructure and shape what we build next.`,
    );
    expect(metadata.alternates).toEqual({ canonical: "/design-partners" });
    expect(metadata).not.toHaveProperty("robots");
  });
});

describe("/design-partners", () => {
  it("offers the first 10 partners a place, a figure written once in content", () => {
    expect(designPartnerPlaces).toBe(10);
  });

  it("opens on the utility hero: Open now, the h1, the line, a ready email and Book a call in a new tab", () => {
    const m = main();
    expect(m).toHaveAttribute("id", "main");
    expect(m).toHaveClass("pv-main", "dp-main");
    const hero = m.querySelector(":scope > header.hero.doc-hero")!;
    expect(hero).toHaveAttribute("id", "top");
    expect(hero.querySelector(".zk-art")).not.toBeNull();
    expect(text(hero.querySelector(".pg-soon"))).toBe(
      `Open now · the first ${designPartnerPlaces} partners`,
    );
    expect(text(hero.querySelector("h1"))).toBe("Design partner program");
    expect(text(hero.querySelector(".doc-deck"))).toBe(
      "Run Coral and Amoeba on your own clusters and disks before everyone else, shape what we build next, and work directly with the people who build them.",
    );
    expect(
      [...hero.querySelectorAll('.doc-deck [translate="no"]')].map((name) => name.textContent),
    ).toEqual(["Coral", "Amoeba"]);
    const [write, call] = hero.querySelectorAll<HTMLAnchorElement>(".hero-cta a");
    expect(write).toHaveClass("btn", "btn-light");
    expect(text(write!)).toBe("Apply to be a design partner");
    expect(write!.getAttribute("href")).toBe(mailto);
    expect(write).not.toHaveAttribute("target");
    expect(call).toHaveClass("btn", "btn-wire");
    expect(call!.getAttribute("href")).toBe(calendarUrl);
    expect(call).toHaveAttribute("target", "_blank");
    expect(call).toHaveAttribute("rel", "noopener noreferrer");
    expect(text(call!.querySelector(".sr-only"))).toBe("(opens in a new tab)");
    /* No arrow, as the mock draws it (the bar's Book a demo is the same). */
    expect(call!.querySelector("svg")).toBeNull();
  });

  it("lays out the mock's sections in its order, each at its address", () => {
    const sections = [...main().querySelectorAll(":scope > section")];
    expect(sections.map((s) => s.id)).toEqual(["offer", "get", "how", "ask", "who", "proof", ""]);
    expect(sections.map((s) => text(s.querySelector("h2")))).toEqual([
      "Free on your non-production infrastructure",
      "What you get",
      "How it works",
      "What we ask",
      "Who it is for",
      "Where your results will sit",
      `Want one of the first ${designPartnerPlaces} places?`,
    ]);
    expect(sections.map((s) => s.className)).toEqual([
      "sec pv-sec",
      "sec",
      "sec pv-sec",
      "sec sec-band",
      "sec",
      "sec sec-band",
      "sec",
    ]);
    for (const s of sections.slice(0, -1)) {
      expect(s).toHaveAttribute("aria-labelledby", `${s.id}-h`);
    }
    /* The mock ends on the close: no closing assessment row. */
    expect(main().querySelector("#contact")).toBeNull();
  });

  it("draws the offer: free on non-production, a diamond for each place, and production's one term", () => {
    const panel = main().querySelector("#offer .pv-panel.pv-anim.dp-offer")!;
    expect(text(panel.querySelector(".pv-eyebrow"))).toBe("The offer");
    const lede = panel.querySelector(".pv-phead p:not(.pv-eyebrow)")!;
    expect(text(lede)).toBe(
      `For the first ${designPartnerPlaces} design partners: Coral and Amoeba at no cost on development, test and staging clusters and disks.`,
    );
    expect([...lede.querySelectorAll('[translate="no"]')].map((n) => n.textContent)).toEqual([
      "Coral",
      "Amoeba",
    ]);

    const slots = panel.querySelector(".dp-slots")!;
    expect(slots).toHaveAttribute("aria-hidden", "true");
    const diamonds = [...slots.querySelectorAll<HTMLElement>(":scope > i")];
    expect(diamonds).toHaveLength(designPartnerPlaces);
    expect(diamonds.map((d) => text(d))).toEqual(
      Array.from({ length: designPartnerPlaces }, (_, k) => String(k + 1)),
    );
    expect(diamonds.map((d) => d.style.getPropertyValue("--i"))).toEqual(
      Array.from({ length: designPartnerPlaces }, (_, k) => String(k)),
    );

    const foot = panel.querySelector(".pv-ofoot")!;
    expect(text(foot.querySelector(":scope > span"))).toBe(
      "Production clusters and disks are on terms agreed with each partner.",
    );
    const apply = foot.querySelector<HTMLAnchorElement>(":scope > a")!;
    expect(text(apply)).toBe("Apply for a place");
    expect(apply.getAttribute("href")).toBe(mailto);
    expect(apply.querySelector("svg")).not.toBeNull();
  });

  it("names what a partner gets on four cards, each with its glyph", () => {
    const cards = [...main().querySelectorAll("#get .dp-get > article.dp-card")];
    expect(
      cards.map((card) => [text(card.querySelector("h3")), text(card.querySelector("p"))]),
    ).toEqual([
      [
        "Free on non-production",
        "Coral and Amoeba at no cost on your development, test and staging clusters and disks.",
      ],
      ["Early access", "New Coral and Amoeba features reach you before everyone else."],
      [
        "A direct line to the builders",
        "Work with the people who build Coral and Amoeba, not a ticket queue.",
      ],
      ["A say in what we build", "What you need shapes what we build next."],
    ]);
    for (const card of cards) {
      const glyph = card.firstElementChild!;
      expect(glyph.tagName.toLowerCase()).toBe("svg");
      expect(glyph).toHaveClass("dp-ic");
      expect(glyph).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("draws How it works as four steps on a line, each with its picture", () => {
    const panel = main().querySelector("#how .pv-panel.pv-anim")!;
    expect(text(panel.querySelector(".pv-eyebrow"))).toBe("The program");
    expect(text(panel.querySelector(".pv-phead p:not(.pv-eyebrow)"))).toBe(
      "Four steps, from your first email to your first results.",
    );
    const list = panel.querySelector("ol.pv-journey.dp-j4")!;
    /* The line is an item hidden from assistive tech, so the list reads as its four steps. */
    expect(list.firstElementChild).toHaveClass("pv-line");
    expect(list.firstElementChild).toHaveAttribute("aria-hidden", "true");
    const steps = [...list.querySelectorAll<HTMLElement>(":scope > li.pv-step")];
    expect(steps.map((step) => text(step.querySelector(".pv-n")))).toEqual(["1", "2", "3", "4"]);
    expect(steps.map((step) => step.style.getPropertyValue("--i"))).toEqual(["0", "1", "2", "3"]);
    expect(
      steps.map((step) => [text(step.querySelector("h3")), text(step.querySelector("p"))]),
    ).toEqual([
      ["Apply", "Tell us about your clusters and disks."],
      ["See your number", "The free assessment shows your estimated saving at list price."],
      [
        "Connect a non-production cluster",
        `zoorikctl, Helm or Terraform; free for the first ${designPartnerPlaces} partners.`,
      ],
      ["Review together", "We go through the results with you and plan what comes next."],
    ]);

    const mail = steps[0]!.querySelector(".pv-scene .pv-mail")!;
    expect(
      [...mail.querySelectorAll(".pv-mrow")].map((row) => [...row.children].map(text)),
    ).toEqual([
      ["To", contactEmail],
      ["Subject", "Design partner program"],
    ]);
    expect(
      [...mail.querySelectorAll<HTMLElement>(".pv-mbody i")].map((line) => line.style.width),
    ).toEqual(["90%", "72%", "50%"]);
    expect(text(mail.querySelector(".pv-send"))).toBe("Send");

    /* The assessment's own command, then the command that connects a cluster, each a terminal of one line. */
    const commands = steps.slice(1, 3).map((step) => {
      const lines = [...step.querySelectorAll(".pv-term pre .pv-ln")];
      expect(lines.map((line) => line.className)).toEqual(["pv-ln pv-cmd"]);
      expect(text(step.querySelector(".pv-bar span"))).toBe("Terminal");
      return text(lines[0]!);
    });
    expect(commands).toEqual([`$ ${assessmentProducts.coral.run}`, "$ zoorikctl connect"]);

    const review = steps[3]!.querySelector(".pv-scene .dp-rev")!;
    expect(review).toHaveAttribute("aria-hidden", "true");
    expect([...review.children].map((part) => part.className)).toEqual([
      "dp-b1",
      "dp-b2",
      "dp-tick",
    ]);
  });

  it("asks three things, each ticked", () => {
    const ask = main().querySelector("#ask .dp-ask")!;
    expect(text(ask.querySelector(".sec-head p"))).toBe("Three things, so we build what you need.");
    const items = [...ask.querySelectorAll("ul.bk-list.dp-list > li")];
    expect(items.map((item) => text(item))).toEqual([
      "Run Coral or Amoeba on a real non-production cluster or real disks.",
      "Join regular feedback calls with our team.",
      "If you agree, let us publish your results as a case study, named or anonymised.",
    ]);
    for (const item of items) expect(item.querySelector(":scope > .bk-ok > svg")).not.toBeNull();
  });

  it("names four teams it is for, each with its product's mark", () => {
    const who = main().querySelector("#who")!;
    expect(text(who.querySelector(".sec-head p"))).toBe(
      "Teams who pay for Kubernetes or block storage on Azure or AWS and want to shape the product.",
    );
    const teams = [...who.querySelectorAll(".pv-who.dp-who > .pv-wt")];
    expect(
      teams.map((team) => [text(team.querySelector("b")), text(team.querySelector("small"))]),
    ).toEqual([
      ["Platform teams on AKS", "Coral"],
      ["Platform teams on Amazon EKS", "Coral"],
      ["Teams whose Azure managed disks keep growing", "Amoeba"],
      ["Teams with large Amazon EBS volumes", "Amoeba"],
    ]);
    for (const team of teams) {
      expect(team.querySelector(":scope > svg.pv-wic")).not.toBeNull();
      expect(team.querySelector('small [translate="no"]')).not.toBeNull();
    }
  });

  it("shows the case study's own label and figures, and page one of the example report", () => {
    const proof = main().querySelector("#proof")!;
    expect(text(proof.querySelector(".sec-head p"))).toBe(
      "Our own cluster came first. Design partners’ results come next, named or anonymised.",
    );
    const study = proof.querySelector<HTMLAnchorElement>(".pv-proof a.pv-case")!;
    expect(study.getAttribute("href")).toBe(routes.caseStudyCoralDevCluster);
    /* The study's own label, read from its kicker, so it follows the study. */
    expect(text(study.querySelector(".pv-kick"))).toBe(`${studyLabel} · Coral on AKS`);
    expect(text(study.querySelector(".pv-big"))).toBe(caseStudy.band.stats[0].value);
    expect([...study.querySelectorAll(".pv-bars em")].map(text)).toEqual([
      before!.label,
      after!.label,
    ]);
    /* The second bar is today's bill on the connected bill's scale, as the mock draws it. */
    const bars = [...study.querySelectorAll<HTMLElement>(".pv-bars i")];
    expect(bars.map((bar) => parseFloat(bar.style.width))).toEqual([
      100,
      Number(((after!.amount / before!.amount) * 100).toFixed(1)),
    ]);
    expect(text(study.querySelector(".pv-cap"))).toBe(
      "Our own cluster’s machine bill a month, before and after",
    );
    expect(text(study.querySelector(".pv-go"))).toBe("Read the case study");

    const report = proof.querySelector<HTMLAnchorElement>(".pv-proof a.pv-report")!;
    expect(report.getAttribute("href")).toBe(routes.assessment);
    expect(text(report.querySelector(".pv-kick.dark"))).toBe(
      "The free assessment · example report",
    );
    const img = report.querySelector("img")!;
    expect(img).toHaveAttribute("alt", "Page one of the example Coral assessment report");
    expect(img).toHaveAttribute("loading", "lazy");
    expect(existsSync(join("public", img.getAttribute("src")!))).toBe(true);
    expect(text(report.querySelector(".pv-go"))).toBe("See the free assessment");
  });

  it("closes on a ready email to the founders", () => {
    const close = main().querySelector(".pv-close")!;
    const line = close.querySelector("p")!;
    expect(text(line)).toBe(
      "Apply by email or book a call with the people who build Coral and Amoeba.",
    );
    expect([...line.querySelectorAll('[translate="no"]')].map((n) => n.textContent)).toEqual([
      "Coral",
      "Amoeba",
    ]);
    const cta = close.querySelector<HTMLAnchorElement>("a.pv-cta")!;
    expect(text(cta)).toBe("Write to us");
    expect(cta.getAttribute("href")).toBe(mailto);
  });
});

describe("/design-partners states one offer and one term", () => {
  it("prints no figure but the places and the case study's own", () => {
    const figures = words().match(/[−-]?\$?\d[\d.,]*%?/g) ?? [];
    const places = String(designPartnerPlaces);
    /* The hero, the offer, step 3 and the close name the places; the rest is the study's. */
    expect(figures).toEqual([
      places,
      places,
      places,
      caseStudy.band.stats[0].value,
      before!.label,
      after!.label,
      places,
    ]);
  });

  it("names one term, production's, and no price, discount or length of term", () => {
    expect(words().match(/\bterms?\b/gi)).toEqual(["terms"]);
    expect(words()).toContain(
      "Production clusters and disks are on terms agreed with each partner.",
    );
    expect(words()).not.toMatch(
      /discount|commission|credit|trial|\bfees?\b|subscription|contract|guarantee|\bSLA\b|per month|per year|€|£|₹/i,
    );
  });

  it("says free only of non-production infrastructure, or of the free assessment", () => {
    const lines = [...main().querySelectorAll("h1, h2, h3, p, li, .pv-kick, .pv-go")];
    const free = lines
      .map(text)
      .filter((line) => /\bfree\b|no cost/i.test(line.replace(/free assessment/gi, "")));
    expect(free.length).toBeGreaterThan(0);
    for (const line of free) {
      expect(line).toMatch(
        new RegExp(
          `non-production|development, test and staging|the first ${designPartnerPlaces} partners`,
        ),
      );
    }
  });

  it("names no other company's product (only the comparison pages name them)", () => {
    const all = text(main());
    const names = marketGroups.flatMap((group) => group.tools.map((tool) => tool.name));
    expect(names.length).toBeGreaterThan(0);
    const named = names.filter((name) =>
      new RegExp(`(^|[^\\w])${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^\\w]|$)`).test(all),
    );
    expect(named).toEqual([]);
  });

  it("keeps to the house words", () => {
    expect(words()).not.toMatch(/\bcut\b|\blower\b|\bwaste/i);
  });
});
