import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { marketplaces } from "@/config/marketplaces";
import { anchorAliases, calendarUrl, contactEmail } from "@/config/site";
import { homeStructuredData } from "@/config/structured-data";
import { byDesignCards } from "@/content/by-design";
import { homeFilms } from "@/content/home-films";

import HomePage from "./page";
import sitemap from "./sitemap";

/**
 * The home page as a whole: the things no single section can check about
 * itself, because they are promises one section makes about another.
 *
 * Every anchor here takes its href from a content module and every target its
 * id from a component. Nothing connects the two but a matching string, so a
 * renamed section, or a section removed with its nav entry left behind, renders
 * perfectly and goes nowhere.
 */
let page: HTMLElement;

/* Rendered afresh for each test: the shared setup unmounts after every one. jsdom
   implements no film playback, and the hero's film plays itself. */
beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
  vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});
  page = render(<HomePage />).container;
  return () => vi.restoreAllMocks();
});

const hrefs = (selector: string): string[] =>
  [...page.querySelectorAll<HTMLAnchorElement>(selector)].map((a) => a.getAttribute("href")!);

describe("the home page", () => {
  it("prints one canonical and one og:url, the home address with its slash, as the sitemap and JSON-LD do", () => {
    const canonical = document.querySelectorAll('link[rel="canonical"]');
    const ogUrl = document.querySelectorAll('meta[property="og:url"]');
    expect(canonical).toHaveLength(1);
    expect(ogUrl).toHaveLength(1);
    expect(canonical[0]?.getAttribute("href")).toBe("https://zoorik.com/");
    expect(ogUrl[0]?.getAttribute("content")).toBe("https://zoorik.com/");
    expect(sitemap()[0]?.url).toBe("https://zoorik.com/");
    expect(homeStructuredData["@graph"][1]).toMatchObject({ url: "https://zoorik.com/" });
  });

  it("runs in the mock's order", () => {
    const ids = [...page.querySelectorAll("header[id], section[id]")].map((el) => el.id);
    /* Coral first, as the whole site lists the two; How it works lives on each
       product's own page now, not here. */
    expect(ids).toEqual(["top", "coral", "amoeba", "why", "case-study", "offers", "assess"]);
    expect(page.querySelector("#how")).toBeNull();
  });

  it("links each product section's h2 to its page, its line keeping the product's name out of translation", () => {
    for (const [id, href, line, name] of [
      [
        "coral",
        "/coral",
        "Stop paying for idle Kubernetes capacity. Coral rebalances workloads and removes the nodes you don’t need. No code changes. Read our guide to Kubernetes cost optimization.",
        "Coral",
      ],
      [
        "amoeba",
        "/amoeba",
        "Stop paying for empty disk space. Amoeba rightsizes Azure managed disks and Amazon EBS on Windows and Linux VMs, autonomously, without any downtime after the one switch.",
        "Amoeba",
      ],
    ] as const) {
      const section = page.querySelector(`section#${id}`)!;
      expect(section.querySelector("h2.st-h > a"), id).toHaveAttribute("href", href);
      const body = section.querySelector(".st-body")!;
      expect(body.textContent, id).toBe(line);
      expect(body.querySelector('[translate="no"]'), id).toHaveTextContent(name);
    }
    /* Coral's line ends on the subject's guide, which owns the search "Kubernetes cost optimization" (owner, 1 Nov
       2026); Amoeba's has no link. */
    expect(
      [...page.querySelectorAll("section#coral .st-body a")].map((a) => [
        a.textContent,
        a.getAttribute("href"),
        a.getAttribute("class"),
      ]),
    ).toEqual([["Kubernetes cost optimization", "/kubernetes-cost-optimization", null]]);
    expect(page.querySelector("section#amoeba .st-body a")).toBeNull();
  });

  it("links each product's clouds to their pages, and leaves Windows and Linux plain", () => {
    for (const [id, links, plain] of [
      [
        "coral",
        [
          ["AKS", "/aks-cost-optimization"],
          ["EKS", "/eks-cost-optimization"],
        ],
        [],
      ],
      [
        "amoeba",
        [
          ["Azure", "/azure-managed-disk-cost-optimization"],
          ["AWS", "/ebs-cost-optimization"],
        ],
        ["Windows", "Linux"],
      ],
    ] as const) {
      const chips = page.querySelector(`section#${id} ul.chips-g`)!;
      expect(
        [...chips.querySelectorAll("li > a.chip")].map((a) => [
          a.textContent,
          a.getAttribute("href"),
        ]),
        id,
      ).toEqual(links);
      expect(
        [...chips.querySelectorAll(":scope > li.chip")].map((chip) => chip.textContent),
        id,
      ).toEqual(plain);
    }
  });

  it("reads as one outline: the h1, a heading per section, the cards under the band and the offers", () => {
    const headings = [...page.querySelectorAll("main h1, main h2, main h3")].map(
      (h) => `${h.tagName.toLowerCase()} ${h.textContent}`,
    );
    expect(headings).toEqual([
      "h1 Zoorik Reduce cloud cost, autonomously.",
      /* The SEO heading pass (23 Oct 2026): each product section's h2 is its category. */
      "h2 Kubernetes cost optimization",
      "h2 Block storage cost optimization",
      "h2 Autonomous cloud cost optimization, without the risk",
      "h3 Reduce cloud cost",
      "h3 Drains nodes safely, one at a time",
      "h3 Without any downtime or code changes",
      "h3 Full control and visibility",
      "h2 How we reduced our own AKS cluster’s machine cost by 58%",
      "h2 Cloud cost assessment",
      "h3 Free assessment",
      "h3 Coral",
      "h3 Amoeba",
      "h3 Coral and Amoeba together",
    ]);
    /* Only the h1 is a sentence with a period; every other heading is set
       plain, as the mock draws them. */
    for (const h of page.querySelectorAll("main h2, main h3")) {
      expect(h.textContent, h.textContent!).not.toMatch(/\.$/);
    }
  });

  it("has no pricing, no FAQ and no form", () => {
    /* All three were removed on purpose. Each could come back as a stray
       section left in the page's composition, looking finished. */
    expect(page.querySelector("#economics")).toBeNull();
    expect(page.querySelector("#faq")).toBeNull();
    expect(page.querySelector("form")).toBeNull();
    expect(page.querySelector("input")).toBeNull();
    /* In the page's own content: the header's FAQ menu and the footer's FAQ
       link lead to the FAQ page, which is not a section of this one. */
    /* The offers' tools row names the two calculators by the words they are searched by ("EKS and AKS pricing
       calculator"): links on to them, not a pricing section. */
    const main = page.querySelector("main")!.cloneNode(true) as HTMLElement;
    main.querySelector("#offers .btns")!.remove();
    expect(main.textContent).not.toMatch(/\bpricing\b|\bper month\b|FAQ/i);
  });

  it("lands every in-page anchor on something that is there", () => {
    const anchors = hrefs('a[href^="#"]').filter((href) => href !== "#");
    /* The skip link and both wordmarks. The bar and the footer lost their
       in-page "How it works" and "Contact". */
    expect(anchors).toEqual(["#main", "#top", "#top"]);

    for (const href of new Set(anchors)) {
      expect(page.querySelector(`[id="${href.slice(1)}"]`), `nothing is ${href}`).not.toBeNull();
    }
  });

  it("puts Contact on the dark card, inside the assessment row", () => {
    const contact = page.querySelector("#contact")!;
    expect(contact.closest("section")!.id).toBe("assess");
    expect(contact.className).toContain("as-cal");
  });

  it("keeps the two anchors from before the products were named", () => {
    for (const [old, now] of anchorAliases) {
      const marker = page.querySelector(`#${old}`);
      expect(marker, `#${old} is gone`).not.toBeNull();
      /* Directly above the section it stands for, so the browser's own
         fragment scroll lands there with scripting off. */
      expect(marker!.nextElementSibling?.id).toBe(now);
    }
  });

  it("opens every off-site link in a new tab, and nothing else", () => {
    const all = [...page.querySelectorAll<HTMLAnchorElement>("a[href]")];
    const offSite = all.filter((a) => /^https?:\/\//.test(a.getAttribute("href")!));
    expect(offSite.length).toBeGreaterThan(5);

    for (const a of offSite) {
      expect(a, a.getAttribute("href")!).toHaveAttribute("target", "_blank");
      expect(a, a.getAttribute("href")!).toHaveAttribute("rel", "noopener noreferrer");
    }
    /* An in-page anchor, a page of this site or a mailto flung into a new tab
       would be hostile; none of them leaves the reader's place. */
    for (const a of all.filter((a) => !offSite.includes(a))) {
      expect(a.hasAttribute("target"), a.getAttribute("href")!).toBe(false);
    }
  });

  it("sends every Book a demo to the calendar, and says it opens a new tab", () => {
    const calls = [...page.querySelectorAll<HTMLAnchorElement>("a")].filter((a) =>
      /^Book a demo/.test(a.textContent!.trim()),
    );
    /* The nav, the dark card and the footer. The hero's one button estimates
       the saving instead. */
    expect(calls).toHaveLength(3);
    for (const a of calls) {
      expect(a).toHaveAttribute("href", calendarUrl);
      expect(a.querySelector(".sr-only")?.textContent).toBe(" (opens in a new tab)");
    }
    /* One label per intent: the dark card's "Pick a time" is "Book a demo" now. */
    expect(page.textContent).not.toContain("Pick a time");
  });

  it("prints one address, and only that one", () => {
    const mailboxes = new Set(hrefs('a[href^="mailto:"]'));
    expect([...mailboxes]).toEqual([`mailto:${contactEmail}`]);
    expect(page.textContent).not.toMatch(/(hello|sales|security)@zoorik\.com/);
  });

  it("opens each product's button on that product's assessment", () => {
    expect(hrefs("#amoeba a.btn-ink")).toEqual(["/assessment?p=amoeba"]);
    expect(hrefs("#coral a.btn-ink")).toEqual(["/assessment?p=coral"]);
    expect(hrefs("#assess a.btn-ink")).toEqual(["/assessment"]);
  });

  it("says the hero's words, the h1 opening on the name", () => {
    /* The name on its own line above the tagline, the space after it the
       mock's, so the heading reads as text with the name as its first word.
       The tagline keeps its words, and the head keeps everything it says. */
    const h1 = page.querySelector(".hero h1")!;
    expect(h1.textContent).toBe("Zoorik Reduce cloud cost, autonomously.");
    const name = h1.firstElementChild!;
    expect(name).toHaveClass("hero-name");
    expect(name).toHaveAttribute("translate", "no");
    expect(name.textContent).toBe("Zoorik");
    expect(h1.querySelectorAll("*")).toHaveLength(1);
    const tagline = [...h1.childNodes]
      .filter((node) => node !== name)
      .map((node) => node.textContent)
      .join("");
    expect(tagline).toBe(" Reduce cloud cost, autonomously.");
    expect(page.querySelector(".hero .hero-sub")).toHaveTextContent(
      /^Software that optimizes Kubernetes and block storage on its own, while your systems keep serving\.$/,
    );
  });

  it("opens the hero on one button, Estimate your saving, to the plain assessment", () => {
    const buttons = [...page.querySelectorAll<HTMLAnchorElement>(".hero-cta a")];
    expect(buttons).toHaveLength(1);
    expect(buttons[0]).toHaveClass("btn", "btn-light");
    expect(buttons[0]).toHaveAttribute("href", "/assessment");
    expect(buttons[0]!.textContent!.trim()).toBe("Estimate your saving");
    /* It stays on the site: no new tab, no hint, the plain arrow. */
    expect(buttons[0]).not.toHaveAttribute("target");
    expect(buttons[0]!.querySelector(".sr-only, .ext")).toBeNull();
    expect(buttons[0]!.querySelector("svg path")).toHaveAttribute("d", "M5 12h14M13 5l7 7-7 7");
  });

  it("says Estimate your saving five times, every one of them to the assessment", () => {
    const calls = [...page.querySelectorAll<HTMLAnchorElement>("main a")].filter(
      (a) => a.textContent!.trim() === "Estimate your saving",
    );
    /* The hero, each product, the free assessment's card, the closing row. */
    expect(calls.map((a) => a.getAttribute("href"))).toEqual([
      "/assessment",
      "/assessment?p=coral",
      "/assessment?p=amoeba",
      "/assessment",
      "/assessment",
    ]);
  });

  it("follows each product's button with what its page is about, to the product's page", () => {
    for (const [id, label] of [
      ["amoeba", "Block storage cost optimization"],
      ["coral", "Kubernetes optimization with Coral"],
    ] as const) {
      const more = page.querySelectorAll<HTMLAnchorElement>(`#${id} .btns a.alink`);
      expect(more).toHaveLength(1);
      expect(more[0]).toHaveAttribute("href", `/${id}`);
      /* Its own words in place of "Learn more": Amoeba's the category alone (owner, 23 Oct 2026), the h2's own
         words; Coral's names the product (1 Nov 2026). */
      expect(more[0]!.textContent).toBe(label);
      if (id === "amoeba")
        expect(more[0]!.textContent).toBe(page.querySelector(`#${id} h2.st-h`)!.textContent);
      expect(more[0]!.querySelector(".sr-only")).toBeNull();
      /* After the button, in the same row, and ending on the same arrow. */
      expect(more[0]!.previousElementSibling?.className).toBe("btn-ink");
      expect(more[0]!.querySelector("svg path")).toHaveAttribute("d", "M5 12h14M13 5l7 7-7 7");
    }
  });

  it("closes on two cards that open on their headlines", () => {
    const row = page.querySelector("#assess")!;
    /* The small uppercase labels are gone; the headlines carry the cards. They are `div.as-h`, not h2, so the words
       that close every page stay out of its heading outline (1 Nov 2026). */
    expect(row.querySelector(".kicker, .cta-kick")).toBeNull();
    for (const card of [row.querySelector(".as-mini")!, row.querySelector(".as-cal")!]) {
      expect(card.firstElementChild!.tagName).toBe("DIV");
      expect(card.firstElementChild).toHaveClass("as-h");
    }
    expect(row.querySelector(".as-cal p")!.textContent).toBe(
      "Thirty minutes with the people who build Coral and Amoeba.",
    );
    /* Home reveals: both cards rise, the dark one a step after the white. */
    expect(row.querySelectorAll(".rise")).toHaveLength(2);
    expect(row.querySelector("[data-i]")).toBe(row.querySelector("#contact"));
  });

  it("ends the hero on the marketplace line, after the one button, and draws no product tiles", () => {
    const market = page.querySelector(".hero p.hx-mkt")!;
    expect(market.previousElementSibling).toHaveClass("hero-cta");
    expect(market.nextElementSibling).toBeNull();
    /* It names both products the stores list, each store a link to all of them there. */
    expect(market.textContent).toBe(
      "Coral and Amoeba are available in AWS Marketplace (opens in a new tab) and Microsoft Marketplace (opens in a new tab)",
    );
    expect(hrefs(".hero .hx-mkt a")).toEqual(marketplaces.map((m) => m.catalogue));
    /* The lockups left the hero (owner, 23 Oct 2026: five things only). */
    expect(page.querySelector(".hero-prods, .hp, .hero-mkt")).toBeNull();
  });

  it("names the two products exactly, wherever it names them", () => {
    /* Each block opens on its product's lockup: the mark and the name, kept
       out of translation as one line. */
    for (const [id, name] of [
      ["coral", "Coral"],
      ["amoeba", "Amoeba"],
    ] as const) {
      const lockup = page.querySelector(`#${id} p.lockup`)!;
      expect(lockup.textContent).toBe(name);
      expect(lockup).toHaveAttribute("translate", "no");
      expect(lockup.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("has no link that goes nowhere", () => {
    const dead = [...page.querySelectorAll("a")].filter((a) => a.getAttribute("href") === "#");
    expect(dead.map((a) => a.textContent)).toEqual([]);
  });

  it("carries exactly one JSON-LD block, escaped, that parses to the structured data", () => {
    const blocks = page.querySelectorAll('script[type="application/ld+json"]');
    expect(blocks).toHaveLength(1);
    const text = blocks[0].textContent ?? "";
    expect(text).not.toContain("<");
    expect(JSON.parse(text)).toEqual(homeStructuredData);
  });

  it("says where each product runs, as a labelled list", () => {
    const rows = [...page.querySelectorAll(".chips")].map((row) =>
      [...row.querySelectorAll(".chip")].map((chip) => chip.textContent),
    );
    expect(rows).toEqual([
      ["AKS", "EKS"],
      ["Azure", "AWS", "Windows", "Linux"],
    ]);
    for (const row of page.querySelectorAll(".chips")) {
      const label = row.querySelector(".chips-l")!;
      expect(label.textContent).toBe("Runs on");
      const list = row.querySelector("ul.chips-g")!;
      expect(list).toHaveAttribute("role", "list");
      expect(list).toHaveAttribute("aria-labelledby", label.id);
    }
    /* "Works with" is the product page's row now, not the home page's. */
    expect(page.querySelector("main")!.textContent).not.toContain("Works with");
  });

  it("shows each product's film, with the line that says its figures are examples", () => {
    /* The motion pass: home shows each product's 5-second Overview beside
       its copy. */
    const films = [...page.querySelectorAll<HTMLVideoElement>("main video.mo-vid")];
    expect(films.map((v) => [v.getAttribute("src"), v.getAttribute("poster")])).toEqual([
      [homeFilms.coral.src, homeFilms.coral.poster],
      [homeFilms.amoeba.src, homeFilms.amoeba.poster],
    ]);
    /* A film is a picture to a screen reader: its name says first that it is a
       preview with example figures, and says what plays. */
    for (const [video, id] of [
      [films[0]!, "coral"],
      [films[1]!, "amoeba"],
    ] as const) {
      expect(video.closest("section")!.id).toBe(id);
      expect(video).toHaveAttribute("aria-label", homeFilms[id].label);
      expect(video.getAttribute("aria-label")).toMatch(
        /^(Coral|Amoeba) product preview with example figures: /,
      );
      /* Started by script while in view, so it has to be silent and in the page. */
      expect(video.muted).toBe(true);
      expect(video).toHaveAttribute("playsinline");
      expect(video).toHaveAttribute("preload", "none");
      expect(video).not.toHaveAttribute("autoplay");
      expect(video).not.toHaveAttribute("controls");
    }
    expect([...page.querySelectorAll("main .mo-cap")].map((p) => p.textContent)).toEqual([
      "Coral product preview with example figures.",
      "Amoeba product preview with example figures.",
    ]);
    /* Mirrored: Coral's film after its copy, Amoeba's before it; each comes in
       once, 120ms after the copy beside it. */
    const columns = (id: string) =>
      [...page.querySelector(`#${id} .st-grid`)!.children].map((el) =>
        el.classList.contains("mo-film") ? "film" : el.className,
      );
    expect(columns("coral")).toEqual(["rise", "film"]);
    expect(columns("amoeba")).toEqual(["film", "rise"]);
    expect(page.querySelector("#coral .st-grid")).toHaveClass("mo-grid");
    expect(page.querySelector("#coral .st-grid")).not.toHaveClass("flip");
    expect(page.querySelector("#amoeba .st-grid")).toHaveClass("mo-grid", "flip");
    for (const film of page.querySelectorAll<HTMLElement>("main figure.mo-film")) {
      expect(film).toHaveClass("mo-r");
      expect(film.style.getPropertyValue("--d")).toBe("120ms");
      expect(film.firstElementChild).toHaveClass("mo-screen");
    }
  });

  it("says what we offer: the fine print under the title, the free assessment, then each range on one scale", () => {
    const offers = page.querySelector("section#offers")!;
    expect(offers).toHaveClass("sec", "ofx", "ofx-b");
    expect(offers).not.toHaveClass("sec-band");
    expect(offers).toHaveAttribute("aria-labelledby", "offers-h");
    /* The qualifier stands under the title, so no figure stands without it. */
    const side = offers.querySelector(".ofx-side")!;
    expect(side.querySelector("h2#offers-h")).toHaveTextContent("Cloud cost assessment");
    expect(side.querySelector(".ofx-note")).toHaveTextContent("Estimated ranges, not a promise.");
    expect(side.querySelector(".ofx-free .ofx-free-n")).toHaveTextContent("Free");
    /* Each row's name is an h3, as the free card's label is (the outline above). */
    const list = offers.querySelector("ul.ofx-rows")!;
    expect(list).toHaveAttribute("role", "list");
    const rows = [...list.children];
    expect(rows.map((li) => li.tagName)).toEqual(Array(3).fill("LI"));
    expect(
      rows.map((li) => [
        li.querySelector(".ofx-h")!.textContent,
        li.querySelector(".od")!.textContent,
        li.querySelector(".od")!.getAttribute("role"),
        li.querySelector(".od")!.getAttribute("aria-label"),
        li.querySelector(".ofx-cap > .sr-only")!.textContent,
      ]),
    ).toEqual([
      ["Coral", "40–50%", "img", "40 to 50 percent", "off AKS and EKS cost"],
      ["Amoeba", "50–60%", "img", "50 to 60 percent", "off block storage cost"],
      [
        "Coral and Amoeba together",
        "20–30%",
        "img",
        "20 to 30 percent",
        "off your overall cloud cost",
      ],
    ]);
    /* What each range is a share of, as tags; the caption above is their words for the ear. */
    expect(
      rows.map((li) => [...li.querySelectorAll(".ofx-cap .chip")].map((chip) => chip.textContent)),
    ).toEqual([["AKS", "EKS"], ["Managed Disks", "EBS"], ["Overall cloud cost"]]);
    /* No axis: the "Off the cost it optimizes" row and its ticks are gone. */
    expect(offers.querySelector(".ofx-axis, .ofx-ticks")).toBeNull();
    expect(offers.textContent).not.toMatch(/Off the cost it optimizes|100%/);
    /* The assessment's link, then the row of the free tools under it (owner, 1 Nov 2026); nothing else names a
       price. */
    expect(hrefs("#offers a")).toEqual([
      "/assessment",
      "/eks-and-aks-pricing-calculator",
      "/ebs-and-azure-disk-pricing",
      "/cloud-cost-optimization-library",
    ]);
    const priced = offers.cloneNode(true) as HTMLElement;
    priced.querySelector(".btns")!.remove();
    expect(priced.textContent).not.toMatch(/\$|per month|pricing/i);
    expect(
      [...rows[2]!.querySelectorAll(".ofx-h [translate='no']")].map((el) => el.textContent),
    ).toEqual(["Coral", "Amoeba"]);
  });

  it("closes the products on the By design band: four drawings, each captioned by its title", () => {
    const band = page.querySelector("section#why")!;
    /* The page's one band, on the flat second surface. */
    expect(band).toHaveClass("sec", "sec-band");
    expect(band.querySelector(".kicker, .sec-head p")).toBeNull();
    const cards = [...band.querySelectorAll("article.pl")];
    /* The sentences left the screen and name the drawings, word for word. */
    expect(cards.map((card) => card.querySelector("figure")!.getAttribute("aria-label"))).toEqual([
      "Pay for what your workloads use, not what was provisioned for the peak.",
      "Nodes drain one at a time. A disk leaves the pool only when it is empty.",
      "No code changes. Resizes happen while you keep serving.",
      "You decide what each product manages, and see every change it makes.",
    ]);
    for (const [index, card] of cards.entries()) {
      /* The drawing, then its title; no line under it. */
      expect([...card.children].map((el) => el.tagName.toLowerCase())).toEqual(["figure", "h3"]);
      expect(card.querySelector("h3")!.textContent).toBe(byDesignCards[index]!.title);
      expect(card.querySelector("figure")).toHaveAttribute("role", "img");
      expect(card.querySelector("figure > svg")).toHaveAttribute("aria-hidden", "true");
    }
    expect(band.querySelector("p")).toBeNull();
  });

  it("opens the hero on the Gargantua film, with no turning mark, and scopes its bone words to itself", () => {
    /* No turning mark on the home hero alone; every other hero keeps its
       mark. `hero-home` is the one hook the site system's bone rules hang
       on. */
    const hero = page.querySelector("header.hero#top")!;
    expect(hero).toHaveClass("hero", "hero-home");
    expect(hero.firstElementChild!.tagName).toBe("VIDEO");
    expect(hero.firstElementChild).toHaveClass("hero-film");
    expect(hero.firstElementChild).not.toHaveClass("hero-photo");
    expect(hero.firstElementChild!.getAttribute("poster")).toMatch(
      /^https:\/\/media\.zoorik\.com\/hero-films\/hero-gargantua-poster-\d+\.jpg$/,
    );
    expect(hero.querySelector("img")).toBeNull();
    expect(page.querySelectorAll(".zk-art, .zk-glow")).toHaveLength(0);
    expect(page.querySelectorAll(".hero-home")).toHaveLength(1);
  });

  it("makes no claim it cannot source in the hero", () => {
    /* "60% / 50% / 0s" stood here and counted up on load. None had a source. */
    expect(page.querySelector(".hero-stats")).toBeNull();
    expect(page.querySelector(".hero")!.textContent).not.toMatch(/\d+\s?%|\b0s\b/);
  });

  it("says nothing is read-only", () => {
    /* Coral changes pod requests and drains nodes; Amoeba resizes disks. The
       page used to promise the opposite in four places. */
    expect(page.textContent).not.toMatch(/read[- ]only|observe[- ]only|changes nothing/i);
  });
});

describe("the navigation", () => {
  /* The rendered bar and drawer, as a reader meets them: SiteNav's own tests
     cover the menus' behaviour and every page's current state. */
  const texts = (selector: string) =>
    [...page.querySelectorAll(selector)].map((el) => el.textContent!.trim());

  it("runs Coral, Amoeba, Assessment, the Docs menu, Login, then Book a demo", () => {
    /* Docs, the one menu, by its word. Product guide and FAQ left the bar (owner,
       23 Oct 2026: "Docs is the only menu"). */
    expect(texts(".nav-links > a, .nav-links > .nv-dd > .nv-lbl")).toEqual([
      "Coral",
      "Amoeba",
      "Assessment",
      "Docs",
      "Login",
      "Book a demo (opens in a new tab)",
    ]);
    /* Cloud economics, the FAQ section, How it works and Contact are gone from
       the bar, the drawer and the footer. */
    for (const href of hrefs(".nav a, footer a")) {
      expect(href).not.toMatch(/#(economics|faq|how|contact)$/);
    }
  });

  it("sends Assessment to its own page, never to anything under /assess/", () => {
    const entries = [...page.querySelectorAll<HTMLAnchorElement>(".nav a, footer a")].filter(
      (a) => a.textContent === "Assessment",
    );

    /* The bar's plain link, the drawer's and the footer's, each the page
       itself, which switches product on its own. */
    expect(entries.map((a) => a.getAttribute("href"))).toEqual([
      "/assessment",
      "/assessment",
      "/assessment",
    ]);
    /* 🔴 `/assess/<name>` IS REDIRECTED AT THE EDGE to a script in another
       repo. A page there can never be served, and the link would hand a reader
       a Python file. Every way in, the bar's and the drawer's links included,
       is the page itself, preset to a product or not. */
    for (const a of page.querySelectorAll<HTMLAnchorElement>(
      '.nav a[href^="/assess"], footer a[href^="/assess"]',
    )) {
      expect(a.getAttribute("href")).toMatch(/^\/assessment(\?p=(coral|amoeba))?$/);
    }
    expect(page.querySelectorAll('.nav a[href^="/assessment?p="]')).toHaveLength(0);
  });

  it("sends Coral and Amoeba to their own pages, from the bar, the drawer and the footer", () => {
    for (const scope of [".nav-links", ".nav-drop", "footer"]) {
      const links = [...page.querySelectorAll<HTMLAnchorElement>(`${scope} a`)];
      expect(links.find((a) => a.textContent === "Coral")?.getAttribute("href"), scope).toBe(
        "/coral",
      );
      expect(links.find((a) => a.textContent === "Amoeba")?.getAttribute("href"), scope).toBe(
        "/amoeba",
      );
    }
    /* At home nothing is current. */
    expect(page.querySelector('.nav [aria-current="page"], .nav .is-cur')).toBeNull();
    /* The hero holds no product links (its five things only); each section's
       h2 and its link go to the product's own page. */
    expect(hrefs(".hero a").filter((href) => href.startsWith("/"))).toEqual(["/assessment"]);
    expect(hrefs("main h2.st-h a")).toEqual(["/coral", "/amoeba"]);
  });

  it("names the bar as the main navigation", () => {
    expect(page.querySelector("nav.nav")).toHaveAttribute("aria-label", "Main");
  });

  it("draws the product marks beside the two product entries", () => {
    const bar = [...page.querySelectorAll(".nav-links > a.nav-prod")];
    expect(bar.map((a) => a.textContent)).toEqual(["Coral", "Amoeba"]);
    for (const a of bar) expect(a.querySelector("svg")).not.toBeNull();
    expect(page.querySelectorAll(".nav-drop a.nav-prod")).toHaveLength(2);
  });

  it("puts the skip link, the bar, the main content and the footer in that order", () => {
    const body = [...page.children].filter((el) => el.tagName !== "SCRIPT");
    expect(body.map((el) => `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ""}`)).toEqual([
      "a",
      "nav",
      "main#main",
      "footer",
    ]);
    expect(body[0]).toHaveClass("skip");
    expect(body[0]).toHaveAttribute("href", "#main");
    expect(body[2]).toHaveAttribute("tabindex", "-1");
    expect(body[2]!.firstElementChild).toHaveAttribute("id", "top");
  });
});

/**
 * The names the site may not print.
 *
 * The products and the company were renamed, and the old names are still in
 * decks, in commit history and in people's heads. This check is kept as a
 * test so the next edit cannot bring one back. Identifiers such as
 * `elastic-section` are not names and are allowed: the pattern does not match
 * them.
 */
describe("the old names", () => {
  /* Spelled in halves, so this file does not itself contain what it forbids
     and a grep over src/ stays clean. */
  const FORBIDDEN = new RegExp(
    [
      ["storage", "tax"],
      ["k8s", "tax"],
      ["elastic", "vol"],
      ["k8s", "pilot"],
      ["elastic", " engine"],
      ["k8s", " engine"],
      /* Microsoft's own service is "Azure Disk Storage", and a Learn article cites its pages by their titles. */
      ["(?<!Azure )disk", " storage"],
    ]
      .map(([head, tail]) => head + tail)
      .join("|"),
    "i",
  );

  function sources(dir: string): string[] {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) return sources(full);
      return /\.(ts|tsx|css|svg)$/.test(entry.name) ? [full] : [];
    });
  }

  it("appear nowhere in src/", () => {
    const files = sources("src");
    expect(files.length).toBeGreaterThan(60);

    const offenders = files.flatMap((file) =>
      readFileSync(file, "utf8")
        .split("\n")
        .flatMap((line, i) => (FORBIDDEN.test(line) ? [`${file}:${i + 1}  ${line.trim()}`] : [])),
    );
    expect(offenders).toEqual([]);
  });

  it("are not printed on the page either, and neither is the wrong verb", () => {
    expect(page.textContent).not.toMatch(FORBIDDEN);
    /* Amoeba rightsizes: one word, never hyphenated anywhere the page prints. */
    const printed = [...page.querySelectorAll("header, section, footer")]
      .map((el) => el.textContent)
      .join(" ");
    expect(printed).not.toMatch(/right-siz/i);
  });
});
