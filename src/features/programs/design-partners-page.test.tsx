import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { calendarUrl, contactEmail } from "@/config/site";
import { designPartnerPlaces } from "@/content/design-partners";

/* The nav and the footer read the pathname. */
vi.mock("next/navigation", () => ({ usePathname: () => "/design-partners" }));

import DesignPartnersRoute, { metadata } from "@/app/design-partners/page";

/**
 * `/design-partners`: the metadata, the hero, the pair (the offer with its ten slots, and what we ask), What you get,
 * the four steps, Who it is for; and one offer and one term, with no other figure. The sitemap entry is in
 * `src/app/sitemap.test.ts`, the structured data in `src/config/structured-data.test.ts`.
 */

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();
const main = () => render(<DesignPartnersRoute />).container.querySelector("main")!;
/** What a reader hears: the page's text without the drawings hidden from them. */
const words = (): string => {
  const copy = main().cloneNode(true) as Element;
  for (const hidden of copy.querySelectorAll('[aria-hidden="true"], .sr-only')) hidden.remove();
  return text(copy);
};
const mailto = `mailto:${contactEmail}?subject=Design%20partner%20program`;
const tiles = (section: Element) =>
  [...section.querySelectorAll("article.dt")].map((tile) => [
    text(tile.querySelector(".dt-t")),
    text(tile.querySelector(".dt-l")),
  ]);

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

  it("opens on the utility hero: the h1 and one line, its product names kept from translation", () => {
    const hero = main().querySelector(":scope > header.hero.doc-hero")!;
    expect(hero).toHaveAttribute("id", "top");
    expect(hero.querySelector(".zk-art")).not.toBeNull();
    expect(text(hero.querySelector("h1"))).toBe("Design partner program");
    expect(text(hero.querySelector(".doc-deck"))).toBe(
      "Run Coral and Amoeba free on your non-production clusters and disks, and shape what we build next.",
    );
    expect(
      [...hero.querySelectorAll('.doc-deck [translate="no"]')].map((name) => text(name)),
    ).toEqual(["Coral", "Amoeba"]);
    expect(hero.querySelector(".hero-cta, .pg-soon")).toBeNull();
  });

  it("lays out the mock's sections in its order, each at its address", () => {
    const m = main();
    const sections = [...m.querySelectorAll(":scope > section")];
    expect(sections.map((s) => s.className)).toEqual([
      "sec sec-band cp-pair",
      "sec cp-sec",
      "sec cp-sec",
      "sec cp-sec",
    ]);
    expect(sections.slice(1).map((s) => s.id)).toEqual(["get", "how", "who"]);
    expect(sections.slice(1).map((s) => text(s.querySelector(".sec-hrow h2")))).toEqual([
      "What you get",
      "How it works",
      "Who it is for",
    ]);
    /* The mock ends on the last tiles: no closing assessment row. */
    expect(m.querySelector("#assess, #contact")).toBeNull();
  });

  it("puts the offer on the white card: the pill, a slot for each place, free on non-production, a ready email", () => {
    const card = main().querySelector(".cp-pair .as-grid > .as-card.as-mini.cp-w.rise")!;
    expect(text(card.querySelector(".cp-flag"))).toBe(
      `Open now · the first ${designPartnerPlaces}`,
    );
    const slots = card.querySelector(".cp-slots")!;
    expect(slots).toHaveAttribute("aria-hidden", "true");
    expect(slots.querySelectorAll(":scope > i")).toHaveLength(designPartnerPlaces);
    expect(text(card.querySelector("h2.as-h"))).toBe("Free on non-production");
    expect(text(card.querySelector("p"))).toBe(
      `For the first ${designPartnerPlaces} design partners, Coral and Amoeba cost nothing on development, test and staging clusters and disks. Production is on terms agreed with each partner.`,
    );
    const apply = card.querySelector<HTMLAnchorElement>("a.btn-ink")!;
    expect(text(apply)).toBe("Apply to be a design partner");
    expect(apply.getAttribute("href")).toBe(mailto);
    expect(apply).not.toHaveAttribute("target");
  });

  it("puts what we ask on the navy card: three things, ticked, and Book a call in a new tab", () => {
    const card = main().querySelector(".cp-pair .as-grid > .as-cal.cp-d.rise")!;
    expect(card).toHaveAttribute("data-i", "1");
    expect(card.querySelector("svg.cp-own")).toHaveAttribute("aria-hidden", "true");
    expect(text(card.querySelector("h2.as-h"))).toBe("What we ask");
    expect(text(card.querySelector(":scope > p"))).toBe("Three things, so we build what you need.");
    const items = [...card.querySelectorAll("ul.cp-ask > li")];
    expect(items.map(text)).toEqual([
      "Run Coral or Amoeba on a real non-production cluster or real disks.",
      "Join regular feedback calls with our team.",
      "If you agree, let us publish your results as a case study, named or anonymised.",
    ]);
    for (const item of items)
      expect(item.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    const call = card.querySelector<HTMLAnchorElement>("a.cta-go")!;
    expect(call.getAttribute("href")).toBe(calendarUrl);
    expect(call).toHaveAttribute("target", "_blank");
    expect(call).toHaveAttribute("rel", "noopener noreferrer");
    expect(text(call)).toBe("Book a call (opens in a new tab)");
    expect(call.querySelector("svg.ext")).not.toBeNull();
  });

  it("names what a partner gets on four tiles, words alone", () => {
    const get = main().querySelector("#get")!;
    expect(get.querySelector(".dt-grid")).toHaveClass("cp-4");
    expect(tiles(get)).toEqual([
      [
        "Free on non-production",
        "No cost on your development, test and staging clusters and disks.",
      ],
      ["Early access", "New Coral and Amoeba features reach you first."],
      ["A direct line to the builders", "Work with the people who build them, not a ticket queue."],
      ["A say in what we build", "What you need shapes what we build next."],
    ]);
    expect(get.querySelectorAll("a")).toHaveLength(0);
    expect(get.querySelectorAll("svg.dt-ic.cp-ic")).toHaveLength(4);
  });

  it("draws How it works as four numbered steps on one line", () => {
    const steps = [...main().querySelectorAll("#how ol.cp-steps > li")];
    expect(steps.map((step) => text(step.querySelector(".cp-sn")))).toEqual(["1", "2", "3", "4"]);
    for (const step of steps) {
      expect(step.querySelector(".cp-sn")).toHaveAttribute("aria-hidden", "true");
    }
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
  });

  it("names four teams it is for, each with its product's mark", () => {
    const who = main().querySelector("#who")!;
    expect(who.querySelector(".dt-grid")).toHaveClass("cp-4");
    expect(tiles(who)).toEqual([
      ["Platform teams on AKS", "Coral"],
      ["Platform teams on Amazon EKS", "Coral"],
      ["Teams whose Azure managed disks keep growing", "Amoeba"],
      ["Teams with large Amazon EBS volumes", "Amoeba"],
    ]);
    expect(
      [...who.querySelectorAll(".dt-ic")].map((mark) => mark.getAttribute("data-mark") ?? "amoeba"),
    ).toEqual(["kubernetes", "kubernetes", "amoeba", "amoeba"]);
  });
});

describe("/design-partners states one offer and one term", () => {
  it("prints no figure but the places", () => {
    const figures = words().match(/[−-]?\$?\d[\d.,]*%?/g) ?? [];
    const places = String(designPartnerPlaces);
    /* The pill, the offer's line and step 3 name the places. */
    expect(figures).toEqual([places, places, places]);
  });

  it("names one term, production's, and no price, discount or length of term", () => {
    expect(words().match(/\bterms?\b/gi)).toEqual(["terms"]);
    expect(words()).toContain("Production is on terms agreed with each partner.");
    expect(words()).not.toMatch(
      /discount|commission|credit|trial|\bfees?\b|subscription|contract|guarantee|\bSLA\b|per month|per year|€|£|₹/i,
    );
  });

  it("says free or no cost only of non-production, the first partners, or the free assessment", () => {
    const lines = [...main().querySelectorAll("h1, h2, h3, p, li, .dt-t, .dt-l")];
    const free = lines
      .map(text)
      .filter((line) =>
        /\bfree\b|no cost|cost nothing/i.test(line.replace(/free assessment/gi, "")),
      );
    expect(free.length).toBeGreaterThan(0);
    for (const line of free) {
      expect(line).toMatch(
        new RegExp(
          `non-production|development, test and staging|the first ${designPartnerPlaces} partners`,
        ),
      );
    }
  });

  it("keeps to the house words", () => {
    expect(words()).not.toMatch(/\bcut\b|\blower\b|\bwaste/i);
  });
});
