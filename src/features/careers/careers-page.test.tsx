import { existsSync } from "node:fs";

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { contactEmail } from "@/config/site";
import { careers } from "@/content/careers";
import { socialProfiles } from "@/content/footer";

/* The nav and the footer read the pathname. */
vi.mock("next/navigation", () => ({ usePathname: () => "/careers" }));

import CareersRoute, { metadata } from "@/app/careers/page";

/**
 * `/careers`'s frame: the metadata, the quiet navy hero and its rings, What you
 * will build, the order of the sections and their bands, the navy close, the
 * site's words, and none of the old layer. Our values, How we work and How we
 * hire are tested beside their components; the island's motion in
 * `careers-motion.test.tsx`. Its sitemap entry is in `src/app/sitemap.test.ts`,
 * its structured data in `src/config/structured-data.test.ts`.
 */

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();
/** What a screen reader hears: the words, without what is hidden from it. */
const heard = (el: Element): string => {
  const copy = el.cloneNode(true) as Element;
  for (const hidden of copy.querySelectorAll('[aria-hidden="true"]')) hidden.remove();
  return text(copy);
};
const page = () => render(<CareersRoute />).container;
const linkedIn = socialProfiles.find((profile) => profile.platform === "linkedin")!.href;

/**
 * "Follow us on" and LinkedIn's lockup in place of the word (owner, 25 Oct 2026: "it will be like Linked {logo}"):
 * "Linked", then the blue "in" box drawn with the footer's own "in", both hidden from the ear, which hears
 * "LinkedIn", then the new-tab hint.
 */
function expectLockup(link: Element, container: Element): void {
  expect(link.firstChild?.nodeType).toBe(Node.TEXT_NODE);
  expect(link.firstChild?.textContent).toBe("Follow us on ");
  expect([...link.children].map((el) => el.getAttribute("class"))).toEqual([
    "cq-lockup",
    "sr-only",
    "sr-only",
  ]);
  const lockup = link.querySelector(":scope > .cq-lockup")!;
  expect(lockup).toHaveAttribute("aria-hidden", "true");
  expect(text(lockup.querySelector(":scope > .cq-lkw"))).toBe("Linked");
  const box = lockup.querySelector(":scope > svg.cq-li")!;
  expect(box).toHaveAttribute("viewBox", "0 0 24 24");
  expect(box.querySelector(":scope > rect")).toHaveAttribute("fill", "#0A66C2");
  const inMark = box.querySelector(":scope > path")!;
  expect(inMark).toHaveAttribute("fill", "#FFFFFF");
  expect(inMark).toHaveAttribute("transform", "translate(3.3 3.2) scale(.73)");
  const footerIn = container.querySelector(`footer a[href="${linkedIn}"] svg path`)!;
  expect(inMark.getAttribute("d")).toBe(footerIn.getAttribute("d"));
  expect([...link.querySelectorAll(":scope > .sr-only")].map(text)).toEqual([
    "LinkedIn",
    "(opens in a new tab)",
  ]);
  expect(heard(link)).toBe("Follow us on LinkedIn (opens in a new tab)");
}

describe("/careers's metadata", () => {
  it("has its title through the template, its description and its canonical", () => {
    expect(metadata.title).toBe("Careers");
    expect(metadata.description).toBe(
      "Work at Zoorik, remotely. What you will build, our six values, how we work and how we hire.",
    );
    expect(metadata.alternates).toEqual({ canonical: "/careers" });
    expect(metadata).not.toHaveProperty("robots");
    expect(metadata.openGraph).toMatchObject({ url: "/careers", title: "Careers | Zoorik" });
  });
});

describe("/careers's hero", () => {
  it("is a quiet band: Careers, the heading, the line, one button and the quiet line", () => {
    const hero = page().querySelector("main > header.hero.cq-hero#top")!;
    /* No glow and no turning mark: the rings are its figure. */
    expect(hero.querySelector(".zk-glow, .zk-art")).toBeNull();
    expect(
      [...hero.querySelector(".cq-hin > .cq-hcopy")!.children].map(
        (el) => `${el.tagName} ${el.className}`,
      ),
    ).toEqual(["P cq-eye", "H1 ", "P hero-sub", "DIV hero-cta", "P cq-quiet"]);
    expect(text(hero.querySelector(".cq-eye"))).toBe("Careers");
    const h1 = hero.querySelector("h1")!;
    expect(text(h1)).toBe("Work at Zoorik");
    expect(h1.querySelector('span[translate="no"]')).toHaveTextContent("Zoorik");
    const deck = hero.querySelector(".hero-sub")!;
    expect(text(deck)).toBe(
      "Help build Coral and Amoeba, the software that reduces cloud cost on Azure and AWS.",
    );
    expect([...deck.querySelectorAll('[translate="no"]')].map(text)).toEqual(["Coral", "Amoeba"]);

    const buttons = hero.querySelectorAll(".hero-cta > a");
    expect(buttons).toHaveLength(1);
    expect(buttons[0]).toHaveClass("btn", "btn-light");
    expect(buttons[0]).toHaveAttribute(
      "href",
      `mailto:${contactEmail}?subject=Introducing%20myself`,
    );
    expect(text(buttons[0]!)).toBe("Introduce yourself");
    expect(buttons[0]!.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("says there are no open roles, and follows us on LinkedIn's lockup in a new tab", () => {
    const container = page();
    const quiet = container.querySelector(".cq-hero .cq-quiet")!;
    expect(heard(quiet)).toBe(
      "No open roles right now. Follow us on LinkedIn (opens in a new tab)",
    );
    const follow = quiet.querySelector("a")!;
    expect(follow).toHaveAttribute("href", linkedIn);
    expect(follow).toHaveAttribute("target", "_blank");
    expect(follow).toHaveAttribute("rel", "noopener noreferrer");
    expectLockup(follow, container);
    /* A plain link in the line, as the mock draws it: no class, no arrow; the only drawing is LinkedIn's "in". */
    expect(follow).not.toHaveAttribute("class");
    expect(follow.querySelectorAll("svg")).toHaveLength(1);
  });

  it("draws the Zoorik mark with sixteen tools turning round it on three rings, one image for the ear", () => {
    const orbit = page().querySelector(".cq-hin > .cq-orbit")!;
    expect(orbit).toHaveAttribute("role", "img");
    expect(orbit).toHaveAttribute(
      "aria-label",
      "The Zoorik mark, with the tools we build with turning round it: Kubernetes, Azure, AWS, Linux, Go, Python, TypeScript, PostgreSQL, Docker, React, Next.js, Helm, Terraform, Argo CD, GitHub, Cloudflare.",
    );
    /* The outer ring first, then the middle, then the inner, then the mark, as the mock stacks them. */
    expect([...orbit.children].map((el) => el.className)).toEqual([
      "cq-ring cq-r3",
      "cq-ring cq-r2",
      "cq-ring cq-r1",
      "cq-core",
    ]);
    const ring = (cls: string) =>
      [...orbit.querySelectorAll(`.${cls} > .cq-o`)].map((tile) => [
        tile.getAttribute("title"),
        parseFloat((tile as HTMLElement).style.getPropertyValue("--a")).toFixed(3),
      ]);
    /* Where it runs; what it is written in and on; how it is built, shipped and served. */
    expect(ring("cq-r3")).toEqual([
      ["React", "8.000"],
      ["Next.js", "59.429"],
      ["Helm", "110.857"],
      ["Terraform", "162.286"],
      ["Argo CD", "213.714"],
      ["GitHub", "265.143"],
      ["Cloudflare", "316.571"],
    ]);
    expect(ring("cq-r2")).toEqual([
      ["Go", "20.000"],
      ["Python", "92.000"],
      ["TypeScript", "164.000"],
      ["PostgreSQL", "236.000"],
      ["Docker", "308.000"],
    ]);
    expect(ring("cq-r1")).toEqual([
      ["Kubernetes", "45.000"],
      ["Azure", "135.000"],
      ["AWS", "225.000"],
      ["Linux", "315.000"],
    ]);
    for (const tile of orbit.querySelectorAll<HTMLElement>(".cq-o"))
      expect(tile.style.getPropertyValue("--a")).toMatch(/deg$/);
    /* Each tile holds its tool's own mark, hidden from the ear. */
    const marks = [...orbit.querySelectorAll(".cq-o > .cq-ol > svg")];
    expect(marks).toHaveLength(16);
    expect(marks.map((svg) => svg.getAttribute("data-mark") ?? svg.getAttribute("class"))).toEqual([
      "react",
      "nextjs",
      "cq-helm",
      "cq-tf",
      "argocd",
      "github",
      "cloudflare",
      "go",
      "python",
      "typescript",
      "postgresql",
      "docker",
      "kubernetes",
      "azure",
      "aws",
      "linux",
    ]);
    for (const svg of marks) expect(svg).toHaveAttribute("aria-hidden", "true");
    /* Simple Icons' marks, each in its project's own colour, as the mock paints them. */
    const fill = (mark: string) =>
      orbit.querySelector(`svg[data-mark="${mark}"] > path`)!.getAttribute("fill");
    expect(
      ["python", "typescript", "react", "nextjs", "docker", "argocd", "cloudflare"].map(fill),
    ).toEqual(["#3776AB", "#3178C6", "#149ECA", "#000000", "#2496ED", "#EF7B4D", "#F38020"]);
  });

  it("keeps the mark still in the middle: the brand kit's fifteen squares and its core, on the 512 canvas", () => {
    const mark = page().querySelector(".cq-orbit > .cq-core > svg")!;
    expect(mark).toHaveAttribute("viewBox", "0 0 512 512");
    expect(mark).toHaveAttribute("aria-hidden", "true");
    expect(mark.querySelectorAll(":scope > rect")).toHaveLength(15);
    expect(mark.querySelector(":scope > circle")).toHaveAttribute("r", "104");
    /* Not `BrandMark`, whose rings turn. */
    expect(mark.querySelector(".zl-o, .zl-i")).toBeNull();
  });

  it("gives every gradient on the page its own id (the Azure mark is drawn three times)", () => {
    const container = page();
    const ids = [...container.querySelectorAll("[id]")].map((el) => el.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(container.querySelectorAll("main svg[data-mark='azure']")).toHaveLength(3);
  });
});

describe("/careers's sections", () => {
  it("reads in the mock's order, each section an address named by its heading, two on the flat band", () => {
    const main = page().querySelector("main#main")!;
    expect(main.firstElementChild).toBe(main.querySelector("header.cq-hero"));
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
    expect(sections.map((section) => section.matches(".sec-band.cq-band"))).toEqual([
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
    /* No assessment row: the mock ends on the close. */
    expect(main.querySelector("#assess, #contact")).toBeNull();
  });

  it("shows What you will build with its lede, and each product's film, label, title, stack and page", () => {
    const build = page().querySelector("section#build")!;
    expect(text(build.querySelector(".sec-head > p"))).toBe(
      "Two products that change live systems, safely.",
    );
    const products = [...build.querySelectorAll(".cq-prods > article.cq-prod")];
    expect(products).toHaveLength(2);
    /* No card: the film, then the words, straight on the page. */
    for (const product of products) {
      expect([...product.children].map((el) => `${el.tagName} ${el.className}`)).toEqual([
        "DIV cq-vid",
        "P cq-plabel",
        "H3 ",
        "UL cq-stack",
        "A alink",
      ]);
    }

    const films = products.map((product) =>
      product.querySelector<HTMLVideoElement>(".cq-vid > video")!,
    );
    expect(films.map((film) => film.getAttribute("src"))).toEqual([
      "/motion/coral-overview-5s.mp4",
      "/motion/amoeba-overview-5s.mp4",
    ]);
    expect(films.map((film) => film.getAttribute("aria-label"))).toEqual([
      "Coral’s Overview with example figures",
      "Amoeba’s Overview with example figures",
    ]);
    for (const film of films) {
      expect(film.muted).toBe(true);
      expect(film).toHaveAttribute("playsinline");
      expect(film).toHaveAttribute("loop");
      expect(film).toHaveAttribute("preload", "none");
      expect(existsSync(`public${film.getAttribute("src")}`)).toBe(true);
      expect(existsSync(`public${film.getAttribute("poster")}`)).toBe(true);
    }

    /* The quiet label: the product's mark, then its name, out of a translator's hands. */
    const labels = products.map((product) => product.querySelector(".cq-plabel")!);
    expect(labels.map(text)).toEqual(["Coral", "Amoeba"]);
    for (const label of labels) {
      expect(label.querySelector(":scope > svg")).toHaveAttribute("aria-hidden", "true");
      expect(label.querySelector('span > span[translate="no"]')).not.toBeNull();
    }
    expect(labels[0]!.querySelector("svg")).toHaveAttribute("data-mark", "kubernetes");
    /* The home page's titles. */
    expect(products.map((product) => text(product.querySelector("h3")))).toEqual([
      "Kubernetes cost optimization",
      "Block storage cost optimization",
    ]);

    const see = products.map((product) => product.querySelector("a.alink")!);
    expect(see.map((a) => [text(a), a.getAttribute("href")])).toEqual([
      ["See Coral", "/coral"],
      ["See Amoeba", "/amoeba"],
    ]);
    for (const a of see) expect(a.querySelector('[translate="no"] + svg')).not.toBeNull();
  });

  it("lists each stack as marks with names; Java, btrfs and systemd as their names alone", () => {
    const stacks = [...page().querySelectorAll("#build ul.cq-stack")];
    for (const stack of stacks)
      expect(stack).toHaveAttribute("aria-label", "What it is built with");
    const items = stacks.map((stack) =>
      [...stack.querySelectorAll(":scope > li")].map((li) => [
        text(li),
        li.querySelector(":scope > svg")?.getAttribute("data-mark") ?? null,
      ]),
    );
    expect(items).toEqual([
      [
        ["Kubernetes", "kubernetes"],
        ["AKS", "azure"],
        ["EKS", "aws"],
        ["Java", null],
        ["Go", "go"],
        ["PostgreSQL", "postgresql"],
      ],
      [
        ["Linux VMs", "linux"],
        ["btrfs", null],
        ["systemd", null],
        ["Azure", "azure"],
        ["AWS", "aws"],
        ["Java", null],
      ],
    ]);
  });

  it("closes on a flat navy card: no open roles, two buttons, the address and the teams, each a ready email", () => {
    const container = page();
    const join = container.querySelector("section#join.sec.cq-join-s .cq-join")!;
    /* No art: the only thing drawn in the card is LinkedIn's "in". */
    expect([...join.querySelectorAll("svg")].map((svg) => svg.getAttribute("class"))).toEqual([
      "cq-li",
    ]);
    const copy = join.querySelector(".cq-jc")!;
    expect([...copy.children].map((el) => `${el.tagName} ${el.className}`)).toEqual([
      "H2 ",
      "P ",
      "DIV cq-jb",
      "P cq-mail",
    ]);
    expect(text(copy.querySelector(":scope > p"))).toBe(
      "No open roles right now. Introduce yourself anyway.",
    );

    const [introduce, follow] = [...copy.querySelectorAll(".cq-jb > a")];
    expect(introduce).toHaveClass("btn", "btn-light");
    expect(introduce).toHaveAttribute(
      "href",
      `mailto:${contactEmail}?subject=Introducing%20myself`,
    );
    expect(text(introduce!)).toBe("Introduce yourself");
    expect(follow).toHaveClass("btn", "btn-wire");
    expect(follow).toHaveAttribute("href", linkedIn);
    expect(follow).toHaveAttribute("target", "_blank");
    expect(follow).toHaveAttribute("rel", "noopener noreferrer");
    expectLockup(follow!, container);

    const mail = copy.querySelector(".cq-mail")!;
    expect(text(mail)).toBe(`Or write to ${contactEmail}`);
    expect(mail.querySelector("a")).toHaveAttribute("href", `mailto:${contactEmail}`);

    expect([...join.querySelectorAll(".cq-jt > .cq-jg > p")].map(text)).toEqual([
      "Tech",
      "Non-tech",
    ]);
    expect(
      [...join.querySelectorAll(".cq-jg a")].map((a) => [text(a), a.getAttribute("href")]),
    ).toEqual(
      ["Backend", "Infra", "Frontend", "Design", "Sales", "Marketing"].map((role) => [
        role,
        `mailto:${contactEmail}?subject=Introducing%20myself%3A%20${role}`,
      ]),
    );
  });
});

describe("/careers's words", () => {
  it("speaks of the products in the site's words: reduce, never cut or lower", () => {
    const main = page().querySelector("main")!;
    expect(main.textContent).toContain("We reduce our customers’ cloud bills");
    expect(main.textContent).not.toMatch(/\bcuts?\b|\blower\b|\bwaste/i);
  });

  it("asks no question under a value and puts no line under a hiring step (owner, 25 Oct 2026)", () => {
    const main = page().querySelector("main")!;
    expect(main.textContent).not.toMatch(/We ask|Tell us about|One question per value/);
    expect(careers.values).not.toHaveProperty("questionLabel");
    for (const value of careers.values.list) expect(value).not.toHaveProperty("question");
    for (const step of careers.hire.steps) expect(step).not.toHaveProperty("body");
  });

  it("posts no role, names no Operations team and no GitLab, and carries no equal-opportunity line", () => {
    const main = page().querySelector("main")!;
    expect(main.textContent).toContain("No open roles right now.");
    expect(main.textContent).not.toMatch(/equal opportunity|apply now|salary|Operations|GitLab/i);
    expect(main.innerHTML).not.toMatch(/JobPosting/);
  });

  it("keeps none of the old layer: no `cr-` class, no letters, no glow", () => {
    const main = page().querySelector("main")!;
    const classes = [...main.querySelectorAll("[class]")].flatMap((el) =>
      String(el.getAttribute("class")).split(/\s+/),
    );
    expect(classes.filter((name) => name.startsWith("cr-"))).toEqual([]);
    expect(main.querySelector(".doc-hero, .doc-deck, .zk-glow, .rv")).toBeNull();
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
