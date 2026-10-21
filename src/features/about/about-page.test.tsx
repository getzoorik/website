import { render, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  crunchbaseProfile,
  f6sCompany,
  g2Coral,
  tracxnCompany,
  wellfoundCompany,
  wikidataEntity,
} from "@/config/entity";
import { marketplaces } from "@/config/marketplaces";
import { calendarUrl, contactEmail, routes } from "@/config/site";
import { about, aboutLastUpdated } from "@/content/about";
import { caseStudy } from "@/content/case-studies";
import { newsFromZoorik } from "@/content/news";

/* The nav and the footer read the pathname. */
vi.mock("next/navigation", () => ({ usePathname: () => "/about" }));

import AboutRoute, { metadata } from "@/app/about/page";

/**
 * `/about`: the outline and its addresses, the product
 * tiles, the four cards, the company's facts, the milestones and the figures
 * they read from the case study, the stores, the social row and the profiles,
 * which links leave the site, the site's own wording where the mock went back
 * to retired words, and no founders and no placeholder. Its sitemap entry is in
 * `src/app/sitemap.test.ts`.
 */

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();
const page = () => render(<AboutRoute />).container;
const main = () => page().querySelector("main")!;

describe("/about's metadata", () => {
  it("has an absolute title, the mock's description and its canonical", () => {
    expect(metadata.title).toEqual({ absolute: "About Zoorik | Who builds Coral and Amoeba" });
    expect(metadata.description).toBe(
      "Zoorik Private Limited builds Coral, Kubernetes cost optimization on AKS and EKS, and Amoeba, block storage cost optimization on Azure and AWS.",
    );
    expect(metadata.alternates).toEqual({ canonical: "/about" });
    expect(metadata).not.toHaveProperty("robots");
    expect(metadata.openGraph).toMatchObject({
      url: "/about",
      title: "About Zoorik | Who builds Coral and Amoeba",
    });
  });
});

describe("/about", () => {
  it("opens on the utility hero, the company's name kept out of translation", () => {
    const hero = main().querySelector("header.hero.doc-hero#top")!;
    const h1 = hero.querySelector("h1")!;
    expect(text(h1)).toBe("About Zoorik");
    expect(h1.querySelector('span[translate="no"]')).toHaveTextContent("Zoorik");
    expect(text(hero.querySelector(".doc-deck"))).toBe(
      "We build Coral and Amoeba to reduce your cloud bill, autonomously, without any downtime.",
    );
    expect(hero.querySelectorAll('.doc-deck span[translate="no"]')).toHaveLength(2);
  });

  it("reads in the mock's order, each section an address named by its heading", () => {
    const sections = [...main().querySelectorAll(":scope > section")];
    expect(sections.map((section) => section.id)).toEqual([
      "what-we-build",
      "how-we-build",
      "company",
      "milestones",
      "find-us",
      "assess",
    ]);
    for (const section of sections.slice(0, 5)) {
      expect(section).toHaveAttribute("aria-labelledby", `${section.id}-h`);
      expect(section.querySelector(`.sec-head > h2#${section.id}-h`)).not.toBeNull();
    }
    expect(sections.map((section) => section.classList.contains("sec-band"))).toEqual([
      false,
      true,
      false,
      true,
      false,
      false,
    ]);
    expect([...main().querySelectorAll("h2, h3")].map(text)).toEqual([
      "What we build",
      "How we build",
      "No code changes",
      "You stay in control",
      "Figures you can check",
      "Outbound only",
      "Company",
      "Milestones",
      "Zoorik Private Limited is founded",
      "Value Lab: −58% on our own cluster",
      "Coral installs with Helm and Terraform",
      "Free assessment 1.3",
      "Find us",
      "Available on",
      "Follow us",
      "Published on",
      "Zoorik on the web",
      "Find your own number",
      "Talk to the builders",
    ]);
  });

  it("names no founder and ships no placeholder", () => {
    const html = main().innerHTML;
    expect(html).not.toMatch(/\[OWNER|ph-chip|To come/);
    expect(main().textContent).not.toMatch(/\b(Founder|CEO|CTO|co-founder)\b/i);
  });

  it("draws one tile per product, Coral first, to its page", () => {
    const what = main().querySelector("#what-we-build")!;
    expect(text(what.querySelector(".sec-head p"))).toBe(
      "Zoorik reduces cloud cost, autonomously. Coral is Kubernetes cost optimization on AKS and EKS. Amoeba is block storage cost optimization on Azure and AWS.",
    );
    const tiles = [...what.querySelectorAll(".dt-grid.ab-prods > article.dt > a.dt-a")];
    expect(tiles.map((tile) => tile.getAttribute("href"))).toEqual(["/coral", "/amoeba"]);
    expect(tiles.map((tile) => text(tile.querySelector(".dt-t")))).toEqual(["Coral", "Amoeba"]);
    expect(tiles.map((tile) => text(tile.querySelector(".dt-l")))).toEqual([
      "Kubernetes cost optimization on AKS and EKS",
      "Block storage cost optimization on Azure and AWS",
    ]);
    for (const tile of tiles) {
      expect(tile.querySelector('.dt-t > span[translate="no"]')).not.toBeNull();
      expect(tile.querySelector("svg.dt-ic")).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("says how we build on the home page's four cards, a tick on each", () => {
    const cards = [...main().querySelectorAll("#how-we-build .pls.ab-how > article.pl")];
    expect(cards).toHaveLength(4);
    for (const card of cards) {
      expect(card.firstElementChild).toHaveClass("ab-tick");
      expect(card.firstElementChild).toHaveAttribute("aria-hidden", "true");
    }
    expect(text(cards[2]!.querySelector("p"))).toBe(
      "Coral and Amoeba show where each figure comes from. One they can’t know shows a dash and the reason.",
    );
  });

  it("lists the company's facts in reading order, the address across two columns", () => {
    const facts = [...main().querySelectorAll("#company dl.ab-facts > div.ab-f")];
    expect(facts.map((fact) => text(fact.querySelector("dt")))).toEqual([
      "Legal name",
      "Incorporated",
      "CIN",
      "Hosting",
      "Registered office",
      "Email",
      "Book a demo",
    ]);
    expect(facts.map((fact) => fact.classList.contains("is-wide"))).toEqual([
      false,
      false,
      false,
      false,
      true,
      false,
      false,
    ]);
    expect(text(facts[2]!.querySelector("dd"))).toBe("U62011KA2026PTC228102");
    const mail = facts[5]!.querySelector("a")!;
    expect(mail).toHaveAttribute("href", `mailto:${contactEmail}`);
    expect(mail).not.toHaveAttribute("target");
    const demo = facts[6]!.querySelector("a")!;
    expect(demo).toHaveAttribute("href", calendarUrl);
    expect(demo).toHaveAttribute("target", "_blank");
    expect(demo).toHaveAttribute("rel", "noopener noreferrer");
    expect(demo.textContent).toBe("cal.com/zoorik/talk (opens in a new tab)");
    expect(demo.querySelector("svg.ext")).not.toBeNull();
  });

  it("lists four milestones on a line, each dated, the case study's read from the study", () => {
    const items = [...main().querySelectorAll("#milestones ol.ab-ms > li")];
    expect(
      items.map((item) => [
        item.querySelector(":scope > time")!.getAttribute("datetime"),
        text(item.querySelector(":scope > time")),
        text(item.querySelector(":scope > div > h3")),
        text(item.querySelector(":scope > div > p")),
      ]),
    ).toEqual([
      [
        "2026",
        "2026",
        "Zoorik Private Limited is founded",
        "Incorporated in Bangalore to build Coral and Amoeba.",
      ],
      [
        "2026-10-12",
        "12 Oct 2026",
        "Value Lab: −58% on our own cluster",
        "Coral reduced our own AKS development cluster’s machine bill from $368.65 to $154.76 a month in eight days. Read the case study.",
      ],
      [
        "2026-10-16",
        "16 Oct 2026",
        "Coral installs with Helm and Terraform",
        "A public Helm chart, and AKS and EKS modules on the Terraform Registry, beside zoorikctl. See open source.",
      ],
      [
        "2026-10-17",
        "17 Oct 2026",
        "Free assessment 1.3",
        "One command on PyPI and npm writes one PDF report for Coral and Amoeba. Run it.",
      ],
    ]);
    expect(
      items.map((item) => {
        const link = item.querySelector("p > a");
        return link && [text(link), link.getAttribute("href"), link.getAttribute("target")];
      }),
    ).toEqual([
      null,
      ["Read the case study", routes.caseStudyCoralDevCluster, null],
      ["See open source", routes.openSource, null],
      ["Run it", routes.assessment, null],
    ]);
    /* The names stay out of translation, in the titles and the lines alike. */
    expect(items[0]!.querySelector('h3 > span[translate="no"]')).toHaveTextContent("Zoorik");
    expect(
      [...items[2]!.querySelectorAll('span[translate="no"]')].map((span) => span.textContent),
    ).toEqual(["Coral", "zoorikctl"]);
  });

  it("reads the case study's milestone from the study itself, never typed twice", () => {
    const [, study] = about.milestones.items;
    expect(study!.date.text).toBe(caseStudy.band.date.replace("October", "Oct"));
    expect(study!.title).toBe(
      `${caseStudy.hero.kicker.split(" · ")[0]}: ${caseStudy.band.stats[0].value} on our own cluster`,
    );
    const steps = caseStudy.result.costs.steps;
    expect(study!.line).toContain(
      `from ${steps[0]!.label} to ${steps[steps.length - 1]!.label} a month`,
    );
    /* "eight days" is the study's "8 days" in words: a change to the study fails here first. */
    expect(caseStudy.band.stats[3].value).toBe("8 days");
    expect(study!.link?.href).toBe(caseStudy.route);
  });

  it("reads the installs and assessment milestones from their announcements on /news, never typed twice", () => {
    const [, , installs, assessment] = about.milestones.items;
    const announced = (href: string) => newsFromZoorik.find((item) => item.href === href)!;
    expect(installs!.date.iso).toBe(announced(routes.openSource).date);
    expect(assessment!.date.iso).toBe(announced(routes.assessment).date);
    /* "Free assessment 1.3": the version is the announcement's, "Zoorik assessment 1.3: …". */
    expect(announced(routes.assessment).title).toContain(
      `${assessment!.title.replace("Free ", "")}: `,
    );
  });

  it("keeps the site's wording where the mock went back to retired words", () => {
    const words = main().textContent!;
    expect(words).not.toMatch(/\bcut\b|keep serving|continuously|\blower\b|\bwaste/i);
    expect(words).toContain("autonomously, without any downtime");
    expect(text(main().querySelector(".doc-deck"))).toBe(about.hero.deck);
    expect(about.what.lede).toMatch(/^Zoorik reduces cloud cost, autonomously\. /);
  });

  it("moves its sitemap date to the day its title took the pipe", () => {
    expect(aboutLastUpdated).toBe("21 October 2026");
  });

  it("puts the two stores as buttons under Available on, naming no product", () => {
    const stores = main().querySelector("#find-us .ab-find > .pl:first-child")!;
    const buttons = [...stores.querySelectorAll(".mkt-btns.ab-mb > a.mkt-b")];
    expect(buttons.map((button) => button.getAttribute("href"))).toEqual(
      marketplaces.map((marketplace) => marketplace.profile),
    );
    expect(buttons.map((button) => text(button))).toEqual([
      "AWS Marketplace (opens in a new tab)",
      "Microsoft Marketplace (opens in a new tab)",
    ]);
    for (const button of buttons) {
      expect(button).toHaveAttribute("target", "_blank");
      expect(button.querySelector("svg.mkt-mk")).toHaveAttribute("aria-hidden", "true");
    }
    expect(stores.textContent).not.toMatch(/Coral|Amoeba/);
  });

  it("follows us on five profiles, each a new tab named aloud, then Learn and Medium", () => {
    const follow = main().querySelector("#find-us .ab-find > .pl:nth-child(2)")!;
    const tiles = within(follow as HTMLElement)
      .getAllByRole("link")
      .filter((link) => link.classList.contains("soc"));
    expect(tiles.map((tile) => tile.getAttribute("aria-label"))).toEqual([
      "Zoorik on LinkedIn (opens in a new tab)",
      "Zoorik on X (opens in a new tab)",
      "Zoorik on Reddit (opens in a new tab)",
      "Zoorik on Medium (opens in a new tab)",
      "Zoorik on GitHub (opens in a new tab)",
    ]);
    const note = follow.querySelector(":scope > p")!;
    expect(text(note)).toBe(
      "New articles go out on Learn and our Medium publication (opens in a new tab).",
    );
    const [learn, medium] = [...note.querySelectorAll("a")];
    expect(learn).toHaveAttribute("href", "/learn");
    expect(learn).not.toHaveAttribute("target");
    expect(medium).toHaveAttribute("href", "https://medium.com/zoorik");
    expect(medium).toHaveAttribute("target", "_blank");
  });

  it("puts Published on across the width: the footer's five channels, then GitHub", () => {
    const published = main().querySelector("#find-us .ab-find > .pl.ab-pub:not(.ab-web)")!;
    expect(text(published.querySelector("h3"))).toBe("Published on");
    const buttons = [...published.querySelectorAll<HTMLAnchorElement>(".mkt-btns.ab-pb > a.mkt-b")];
    expect(buttons.map((button) => [text(button), button.getAttribute("href")])).toEqual([
      ["Homebrew (opens in a new tab)", "https://github.com/getzoorik/homebrew-tap"],
      ["Scoop (opens in a new tab)", "https://github.com/getzoorik/scoop-bucket"],
      ["PyPI (opens in a new tab)", "https://pypi.org/project/zoorik/"],
      [
        "Artifact Hub (opens in a new tab)",
        "https://artifacthub.io/packages/helm/zoorik/coral-agent",
      ],
      [
        "Terraform Registry (opens in a new tab)",
        "https://registry.terraform.io/namespaces/getzoorik",
      ],
      ["GitHub (opens in a new tab)", "https://github.com/getzoorik"],
    ]);
    for (const button of buttons) {
      expect(button).toHaveAttribute("target", "_blank");
      expect(button.querySelector("svg.mkt-mk.mkt-ln")).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("ends Find us with Zoorik on the web across the width: six profiles from entity.ts, then /marketplaces", () => {
    const cards = [...main().querySelectorAll("#find-us .ab-find > .pl")];
    expect(cards.map((card) => card.className)).toEqual([
      "pl",
      "pl",
      "pl ab-pub",
      "pl ab-pub ab-web",
    ]);
    const web = cards[3]!;
    expect(text(web.querySelector("h3"))).toBe("Zoorik on the web");
    expect(web.querySelector('h3 > span[translate="no"]')).toHaveTextContent("Zoorik");
    const links = [...web.querySelectorAll(".ab-wl > a.ab-wb")];
    expect(
      links.map((link) => [
        text(link.querySelector("b")),
        text(link.querySelector("small")),
        link.getAttribute("href"),
      ]),
    ).toEqual([
      ["Crunchbase", "Company profile", crunchbaseProfile],
      ["Wellfound", "Company and roles", wellfoundCompany],
      ["Tracxn", "Company profile", tracxnCompany],
      ["G2", "Reviews of Coral", g2Coral],
      ["F6S", "Company profile", f6sCompany],
      ["Wikidata", "Q141717592", wikidataEntity],
    ]);
    for (const link of links) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      expect(link.lastElementChild).toHaveClass("sr-only");
      expect(link.lastElementChild).toHaveTextContent("(opens in a new tab)");
      /* The mock draws the cards with no arrow. */
      expect(link.querySelector("svg")).toBeNull();
    }
    const all = web.querySelector(":scope > p.ab-all > a")!;
    expect(text(all)).toBe("Every marketplace, review site and registry");
    expect(all).toHaveAttribute("href", routes.marketplaces);
    expect(all).not.toHaveAttribute("target");
  });

  it("closes on the closing row for both products", () => {
    const row = main().querySelector("section#assess")!;
    expect(row.querySelector("a.btn-ink")).toHaveAttribute("href", "/assessment");
    expect(text(row.querySelector("#contact p"))).toBe(
      "Thirty minutes with the people who build Coral and Amoeba.",
    );
  });
});
