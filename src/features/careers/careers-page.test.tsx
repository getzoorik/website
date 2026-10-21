import { existsSync } from "node:fs";

import { fireEvent, render } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { contactEmail } from "@/config/site";
import { careers } from "@/content/careers";
import { socialProfiles } from "@/content/footer";

/* The nav and the footer read the pathname. */
vi.mock("next/navigation", () => ({ usePathname: () => "/careers" }));

import CareersRoute, { metadata } from "@/app/careers/page";

/**
 * `/careers`: the metadata, the hero and its six letters, the outline, its
 * addresses and its ledes, the two films, the values picker as WAI-ARIA tabs,
 * the six hiring steps, the close with no open roles, and the footer's Careers
 * link; and none of what was cut (the caps labels, each
 * behaviour's sentence, the values-interview card). Its sitemap entry is in
 * `src/app/sitemap.test.ts`, its structured data in
 * `src/config/structured-data.test.ts`.
 */

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();
const page = () => render(<CareersRoute />).container;

beforeAll(() => {
  /* jsdom draws nothing, so it has no scrollIntoView; the panels' buttons call it. */
  Element.prototype.scrollIntoView = vi.fn();
});

describe("/careers's metadata", () => {
  it("has its title through the template, the mock's description and its canonical", () => {
    expect(metadata.title).toBe("Careers");
    expect(metadata.description).toBe(
      "Work at Zoorik, remotely. What you will build, our six values, how we work and how we hire.",
    );
    expect(metadata.alternates).toEqual({ canonical: "/careers" });
    expect(metadata).not.toHaveProperty("robots");
    expect(metadata.openGraph).toMatchObject({
      url: "/careers",
      title: "Careers | Zoorik",
    });
  });
});

describe("/careers", () => {
  it("opens on the utility hero: the glow without the turning mark, the copy and the six letters", () => {
    const hero = page().querySelector("main > header.hero.doc-hero#top")!;
    expect(hero.querySelector(":scope > .zk-glow")).not.toBeNull();
    expect(hero.querySelector(".zk-art")).toBeNull();
    /* No caps label over the heading: the h1 opens the copy. */
    expect([...hero.querySelector(".cr-hcopy")!.children].map((el) => el.tagName)).toEqual([
      "H1",
      "P",
      "DIV",
    ]);
    const h1 = hero.querySelector("h1")!;
    expect(text(h1)).toBe("Work at Zoorik");
    expect(h1.querySelector('span[translate="no"]')).toHaveTextContent("Zoorik");
    expect(text(hero.querySelector(".doc-deck"))).toBe(
      "Help build Coral and Amoeba, the software that reduces cloud cost on Azure and AWS.",
    );
    const [introduce, values] = hero.querySelectorAll(".hero-cta > a");
    expect(introduce).toHaveClass("btn", "btn-light");
    expect(introduce).toHaveAttribute(
      "href",
      `mailto:${contactEmail}?subject=Introducing%20myself`,
    );
    expect(values).toHaveAttribute("href", "#values");
    expect(text(values!)).toBe("Our values");

    const letters = hero.querySelectorAll("nav.cr-hgrid[aria-label='Our six values'] > a.cr-ht");
    expect(
      [...letters].map((a) => [text(a.querySelector("b")), text(a.querySelector("small"))]),
    ).toEqual([
      ["C", "Collaboration"],
      ["R", "Results"],
      ["E", "Efficiency"],
      ["D", "Diversity"],
      ["I", "Iteration"],
      ["T", "Transparency"],
    ]);
    for (const letter of letters) {
      expect(letter).toHaveAttribute("href", "#values");
      expect(letter.querySelector("b")).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("reads in the mock's order, each section an address named by its heading, two on the band", () => {
    const main = page().querySelector("main")!;
    const sections = [...main.querySelectorAll(":scope > section")];
    expect(sections.map((section) => section.id)).toEqual([
      "build",
      "values",
      "how-we-work",
      "how-we-hire",
      "join",
    ]);
    for (const section of sections) {
      expect(section).toHaveAttribute("aria-labelledby", `${section.id}-h`);
      expect(section.querySelector(`h2#${section.id}-h`)).not.toBeNull();
    }
    expect(sections.map((section) => section.classList.contains("sec-band"))).toEqual([
      false,
      true,
      false,
      true,
      false,
    ]);
    expect([...main.querySelectorAll("h2")].map(text)).toEqual([
      "What you will build",
      "Our values",
      "How we work",
      "How we hire",
      "Want to build with us?",
    ]);
    /* One short lede, or none: Our values and How we work have the heading alone. */
    expect(
      sections.slice(0, 4).map((section) => text(section.querySelector(".sec-head > p"))),
    ).toEqual(["Two products that change live systems, safely.", "", "", "Six steps, all remote."]);
    for (const id of ["values", "how-we-work"]) {
      expect(main.querySelector(`#${id} .sec-head`)!.children).toHaveLength(1);
    }
    /* No assessment row: the mock ends on the close. */
    expect(main.querySelector("#assess, #contact")).toBeNull();
  });

  it("shows each product's film, muted and inline, its line, its stack and its page", () => {
    const products = [...page().querySelectorAll("#build .cr-prods > article.cr-prod")];
    expect(products).toHaveLength(2);
    const films = products.map((product) => product.querySelector("video")!);
    expect(films.map((film) => film.getAttribute("src"))).toEqual([
      "/motion/coral-overview-5s.mp4",
      "/motion/amoeba-overview-5s.mp4",
    ]);
    expect(films.map((film) => film.getAttribute("poster"))).toEqual([
      "/motion/coral-poster.jpg",
      "/motion/amoeba-poster.jpg",
    ]);
    for (const film of films) {
      expect(film.muted).toBe(true);
      expect(film).toHaveAttribute("playsinline");
      expect(film).toHaveAttribute("loop");
      expect(film).toHaveAttribute("preload", "none");
      expect(existsSync(`public${film.getAttribute("src")}`)).toBe(true);
      expect(existsSync(`public${film.getAttribute("poster")}`)).toBe(true);
    }
    expect(products.map((product) => text(product.querySelector("h3")))).toEqual([
      "Coral",
      "Amoeba",
    ]);
    expect(products.map((product) => text(product.querySelector(".cr-stack")))).toEqual([
      "KubernetesAKSEKSJavaGoPostgreSQL",
      "Linux VMsbtrfssystemdAzureAWSJava",
    ]);
    expect(
      products.map((product) => product.querySelector("a.alink")!.getAttribute("href")),
    ).toEqual(["/coral", "/amoeba"]);
    expect(text(products[0]!.querySelector("a.alink"))).toBe("See Coral");
  });

  it("draws the values as tabs: the first open, each panel with its meaning, behaviours and question", () => {
    const values = page().querySelector("#values")!;
    const tabs = [...values.querySelectorAll('[role="tablist"] > [role="tab"]')];
    expect(tabs.map(text)).toEqual([
      "CCollaboration",
      "RResults for customers",
      "EEfficiency",
      "DDiversity, inclusion and belonging",
      "IIteration",
      "TTransparency",
    ]);
    expect(tabs.map((tab) => tab.getAttribute("aria-selected"))).toEqual([
      "true",
      "false",
      "false",
      "false",
      "false",
      "false",
    ]);
    const panels = [...values.querySelectorAll('[role="tabpanel"]')];
    expect(panels.map((panel) => panel.hasAttribute("hidden"))).toEqual([
      false,
      true,
      true,
      true,
      true,
      true,
    ]);
    panels.forEach((panel, i) => {
      const value = careers.values.list[i]!;
      expect(panel).toHaveAttribute("id", `val-${value.id}`);
      expect(panel).toHaveAttribute("aria-labelledby", `tab-${value.id}`);
      expect(tabs[i]).toHaveAttribute("aria-controls", `val-${value.id}`);
      /* No "C · 1 of 6" over the name. */
      expect([...panel.querySelector(".cr-pl")!.children].map((el) => el.className)).toEqual([
        "",
        "cr-mean",
        "cr-q",
      ]);
      expect(text(panel.querySelector(".cr-pl > h3"))).toBe(value.name);
      expect(text(panel.querySelector(".cr-q > span"))).toBe("We ask");
      expect(text(panel.querySelector(".cr-q"))).toBe(`We ask“${value.question}”`);
      /* Each behaviour is its tick and its name, nothing more. */
      const behaviours = [...panel.querySelectorAll(".cr-live > li")];
      expect(behaviours.map((li) => text(li))).toEqual(value.behaviours);
      for (const li of behaviours) {
        expect([...li.children].map((el) => el.tagName)).toEqual(["SPAN", "H4"]);
        expect(li.firstElementChild).toHaveClass("cr-tick");
      }
    });
    expect(panels.map((panel) => text(panel.querySelector(".cr-mean")))).toEqual([
      "We get further together than alone.",
      "We reduce our customers’ cloud bills without breaking anything.",
      "We spend time and money on what matters, and we do it once.",
      "Good ideas come from everywhere.",
      "Small steps add up faster than big plans.",
      "We share by default. It builds trust.",
    ]);
    expect(text(panels[0]!.querySelector(".cr-live"))).toBe(
      "Be kindShare what you learnSay thanks, and say what forGive feedback earlyAssume positive intentNo egoFix the system, not the personInput is not consensus",
    );
    /* The last panel leads on to How we work. */
    expect(panels[5]!.querySelector(".cr-pnav a.cr-pb.is-next")).toHaveAttribute(
      "href",
      "#how-we-work",
    );
  });

  it("moves between values by click, by the arrow keys, Home and End, and by a panel's buttons", () => {
    const values = page().querySelector("#values")!;
    const tabs = () => [...values.querySelectorAll<HTMLElement>('[role="tab"]')];
    const open = () => tabs().findIndex((tab) => tab.getAttribute("aria-selected") === "true");
    const shown = () =>
      [...values.querySelectorAll('[role="tabpanel"]')].findIndex((p) => !p.hasAttribute("hidden"));

    fireEvent.click(tabs()[2]!);
    expect([open(), shown()]).toEqual([2, 2]);
    expect(tabs().map((tab) => tab.tabIndex)).toEqual([-1, -1, 0, -1, -1, -1]);

    fireEvent.keyDown(tabs()[2]!, { key: "ArrowRight" });
    expect([open(), shown()]).toEqual([3, 3]);
    expect(document.activeElement).toBe(tabs()[3]);
    fireEvent.keyDown(tabs()[3]!, { key: "End" });
    expect(open()).toBe(5);
    fireEvent.keyDown(tabs()[5]!, { key: "ArrowRight" });
    expect(open()).toBe(0);
    fireEvent.keyDown(tabs()[0]!, { key: "ArrowLeft" });
    expect(open()).toBe(5);
    fireEvent.keyDown(tabs()[5]!, { key: "Home" });
    expect(open()).toBe(0);

    const next = values.querySelector<HTMLElement>("#val-collaboration .cr-pb.is-next")!;
    expect(text(next)).toBe("Next: Results for customers");
    fireEvent.click(next);
    expect([open(), shown()]).toEqual([1, 1]);
    const back = values.querySelector<HTMLElement>(
      "#val-results .cr-pnav > button.cr-pb:not(.is-next)",
    )!;
    expect(text(back)).toBe("Collaboration");
    fireEvent.click(back);
    expect(open()).toBe(0);
    expect(values.querySelector("#val-collaboration")).toHaveClass("is-in");
  });

  it("opens a value from its letter in the hero", () => {
    const container = page();
    fireEvent.click(container.querySelector('.cr-ht[data-go="iteration"]')!);
    expect(container.querySelector("#tab-iteration")).toHaveAttribute("aria-selected", "true");
    expect(container.querySelector("#val-iteration")).not.toHaveAttribute("hidden");
  });

  it("says how we work in four habits, one line each, each with its picture", () => {
    const habits = [...page().querySelectorAll("#how-we-work .cr-work > article.cr-wk")];
    expect(
      habits.map((habit) => [text(habit.querySelector("h3")), text(habit.querySelector("p"))]),
    ).toEqual([
      ["Remote first", "Work from where you work best."],
      ["Written down", "Plans and decisions live in writing."],
      ["Asynchronous by default", "Most work needs no meeting."],
      ["Results, not hours", "What shipped, not when you were online."],
    ]);
    expect(habits.map((habit) => habit.querySelector("svg.cr-vis")!.classList[1])).toEqual([
      "v-team",
      "v-doc",
      "v-async",
      "v-res",
    ]);
    for (const habit of habits) {
      expect(habit.querySelector("svg.cr-vis")).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("lists the six hiring steps, one line each, the values interview marked, and no card under them", () => {
    const container = page();
    const hire = container.querySelector("#how-we-hire")!;
    const steps = [...hire.querySelectorAll("ol.cr-steps > li")];
    expect(
      steps.map((step) => [text(step.querySelector("h3")), text(step.querySelector("h3 + p"))]),
    ).toEqual([
      ["Apply", "Your CV and something you are proud of."],
      ["Intro call", "The role, and how we work."],
      ["Skills interview", "Real systems, or your own work."],
      ["Values interview", "One question per value."],
      ["Meet the founders", "Questions both ways."],
      ["Offer", "References, then the offer in writing."],
    ]);
    expect(steps.map((step) => text(step.querySelector(".cr-mode")))).toEqual([
      "In writing",
      "Video call",
      "Video call",
      "Video call",
      "Video call",
      "In writing",
    ]);
    expect(steps.map((step) => step.classList.contains("is-v"))).toEqual([
      false,
      false,
      false,
      true,
      false,
      false,
    ]);
    expect(steps.map((step) => text(step.querySelector(".cr-n")))).toEqual([
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
    ]);
    /* No values-interview card: the steps close the section. */
    expect(hire.querySelector(".wrap")!.lastElementChild).toBe(hire.querySelector("ol.cr-steps"));
    expect(container.querySelector("#values-interview")).toBeNull();
    expect(container.querySelector("main")!.textContent).not.toMatch(
      /Every candidate|What we look for|How we decide|How to prepare/,
    );
  });

  it("closes on no open roles, the teams we hire for, each a ready email", () => {
    const join = page().querySelector("#join .cr-join")!;
    /* No caps label over the heading. */
    expect(join.querySelector(".cr-jc")!.firstElementChild).toBe(join.querySelector("h2"));
    expect(text(join.querySelector(".cr-jc > p"))).toBe(
      "No open roles right now. Introduce yourself anyway.",
    );
    expect(join.querySelectorAll(".cr-jc > p")).toHaveLength(1);
    expect([...join.querySelectorAll(".cr-jg > p")].map(text)).toEqual(["Tech", "Non-tech"]);
    const teams = [...join.querySelectorAll(".cr-jg a")];
    expect(teams.map((a) => [text(a), a.getAttribute("href")])).toEqual(
      ["Backend", "Infra", "Frontend", "Design", "Sales", "Marketing"].map((role) => [
        role,
        `mailto:${contactEmail}?subject=Introducing%20myself%3A%20${role}`,
      ]),
    );
    expect(join.querySelector(".cr-jb a[href^='mailto:']:not(.btn)")).toHaveAttribute(
      "href",
      `mailto:${contactEmail}`,
    );
    expect(join.querySelector("svg.cr-jart")).toHaveAttribute("aria-hidden", "true");
  });

  it("follows us on LinkedIn between the ready email and the address, at the footer's own profile", () => {
    const row = page().querySelector("#join .cr-jb")!;
    expect([...row.children].map((child) => child.className || child.tagName)).toEqual([
      "btn btn-light",
      "btn btn-wire",
      "SPAN",
    ]);
    const follow = row.querySelector("a.btn-wire")!;
    const linkedin = socialProfiles.find((profile) => profile.platform === "linkedin")!.href;
    expect(follow).toHaveAttribute("href", linkedin);
    expect(follow).toHaveAttribute("target", "_blank");
    expect(follow).toHaveAttribute("rel", "noopener noreferrer");
    expect(follow.querySelector(".sr-only")).toHaveTextContent("(opens in a new tab)");
    /* The mock draws no arrow on it. */
    expect(follow.querySelector("svg")).toBeNull();
    expect(text(follow)).toBe("Follow us on LinkedIn (opens in a new tab)");
    expect(text(row.querySelector(":scope > span"))).toBe(`or write to ${contactEmail}`);
  });

  it("speaks of the products in the site's words: reduce, never cut or lower", () => {
    const main = page().querySelector("main")!;
    expect(text(main.querySelector(".doc-deck"))).toContain("the software that reduces cloud cost");
    /* The Efficiency question's "cut" is about the candidate's own work, as the mock asks it. */
    const efficiency = careers.values.list.find((value) => value.id === "efficiency")!.question;
    expect(efficiency).toMatch(/^Tell us about a time you cut something /);
    expect(main.textContent!.replace(efficiency, "")).not.toMatch(/\bcuts?\b|\blower\b|\bwaste/i);
  });

  it("posts no role and carries no equal-opportunity line", () => {
    const main = page().querySelector("main")!;
    expect(main.textContent).not.toMatch(/equal opportunity|apply now|salary/i);
    expect(main.innerHTML).not.toMatch(/JobPosting/);
  });

  it("prints none of the caps labels that were cut", () => {
    const main = page().querySelector("main")!;
    expect(main.querySelector(".cr-eye, .cr-k, .cr-vic, .cr-vb")).toBeNull();
    expect(main.textContent).not.toMatch(/Teams we hire for|In your values interview|· \d of 6/);
  });

  it("draws the page at rest when scripting is off", () => {
    const noscript = page().querySelector("main noscript")!;
    expect(noscript.innerHTML).toContain(".cr-main .rv{opacity:1;transform:none;transition:none}");
  });

  it("is linked from the footer's Company column, after About", () => {
    const company = [...page().querySelectorAll("footer .foot-col")].find(
      (column) => text(column.querySelector(".foot-h")) === "Company",
    )!;
    const links = [...company.querySelectorAll("a")].map((a) => [text(a), a.getAttribute("href")]);
    expect(links.slice(0, 2)).toEqual([
      ["About", "/about"],
      ["Careers", "/careers"],
    ]);
  });
});
