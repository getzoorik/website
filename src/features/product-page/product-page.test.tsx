import { render } from "@testing-library/react";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { amoebaDocs, amoebaOnePager, calendarUrl, routes } from "@/config/site";
import { amoebaPageContent } from "@/content/amoeba-page";
import { coralPageContent } from "@/content/coral-page";
import { documents } from "@/content/documents";
import { elasticContent } from "@/content/elastic";
import { findArticle, learnSlugOf } from "@/content/learn/published";
import { socialProfiles } from "@/content/footer";
import { howItWorksSteps } from "@/content/how-it-works";
import { kubernetesContent } from "@/content/kubernetes";
import type { ArticleText } from "@/content/learn/article";
import type { ProductPageContent, ReadMoreTile } from "@/content/product-page";
import { productFilms, youtubeChannel } from "@/content/product-films";
import { documentFacts } from "@/features/documents/document-facts";

import { ProductPage } from "./product-page";
import { productPageStructuredData } from "./product-page-meta";

/**
 * The two product pages, `/coral` and `/amoeba`: one template, two contents.
 * What is checked here is what the design asks of the page as a whole, and
 * what no section can check about itself. The rows taking turns are
 * `offering-tour`'s.
 */
let pathname = "/";
vi.mock("next/navigation", () => ({ usePathname: () => pathname }));

/* jsdom implements no media playback: the hero's film would print "Not implemented" on every render. */
beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
  vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});
});

const pages: readonly [string, ProductPageContent][] = [
  ["/coral", coralPageContent],
  ["/amoeba", amoebaPageContent],
];

function renderPage(path: string, content: ProductPageContent): HTMLElement {
  pathname = path;
  return render(<ProductPage content={content} />).container;
}

/** The page once its film is on YouTube: the content with the film's URL set. */
const withFilm = (content: ProductPageContent, url: string | null): ProductPageContent => ({
  ...content,
  film: { ...content.film, url },
});

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/\s+/g, " ").trim();

/** A paragraph of What is it? as plain words: a link as its words. */
const plain = (run: ArticleText): string =>
  typeof run === "string"
    ? run
    : run
        .map((piece) => {
          if (typeof piece === "string") return piece;
          if ("b" in piece) return plain(piece.b);
          if ("code" in piece) return piece.code;
          return typeof piece.a === "string" ? piece.a : piece.a.code;
        })
        .join("");

/** A run's links, each its words and its address. */
const linksOf = (el: Element): string[][] =>
  [...el.querySelectorAll("a")].map((a) => [text(a), a.getAttribute("href") ?? ""]);

describe.each(pages)("the product page %s", (path, content) => {
  const product = content.product;
  const name = product === "amoeba" ? "Amoeba" : "Coral";

  it("runs in the mock's order, with How it works the one band", () => {
    const page = renderPage(path, content);
    const ids = [...page.querySelectorAll("main > header[id], main > section[id]")].map(
      (el) => el.id,
    );
    /* What it does sits beside What is it?, so it is no section of its own; the
       film band comes after them (below). Read more always has the product's
       /learn article, and its guide, FAQ and one-pager once they are published. */
    /* Coral's Install your way sits between How it works and Read more; Amoeba has none. */
    expect(ids).toEqual([
      "top",
      `about-${product}`,
      "film",
      "how",
      ...(product === "coral" ? ["install"] : []),
      `read-${product}`,
      "assess",
    ]);
    expect(page.querySelector("main > header")).toHaveClass("hero", "pp-hero", "pp-min");
    expect([...page.querySelectorAll("main .sec-band")].map((el) => el.id)).toEqual(["how"]);
    /* The mock's <main> has no class. */
    expect(page.querySelector("main")!.className).toBe("");
  });

  it("has one h1, the product's search term, and skips no heading level", () => {
    const page = renderPage(path, content);
    const h1s = page.querySelectorAll("h1");
    expect(h1s).toHaveLength(1);
    expect(h1s[0].textContent).toBe(
      product === "coral"
        ? "Kubernetes optimization for AKS and EKS"
        : "Block\u00a0storage cost optimization",
    );

    const levels = [...page.querySelectorAll("main h1, main h2, main h3, main h4")].map((h) =>
      Number(h.tagName[1]),
    );
    levels.reduce((previous, level) => {
      expect(level - previous, `h${previous} → h${level}`).toBeLessThanOrEqual(1);
      return level;
    });
    expect(page.querySelector("main h4")).toBeNull();
  });

  it("fills the hero with the data grid film, then only its five items", () => {
    const page = renderPage(path, content);
    const hero = page.querySelector("header.pp-hero")!;
    const [film, words] = [...hero.children];
    expect(hero.children).toHaveLength(2);
    /* The film lane's element: silent, looping, hidden from a screen reader and the tab order, on the poster
       for this screen (1080 here), from media.zoorik.com. Never the photo's class, whose mirror would flip it. */
    expect(film!.tagName).toBe("VIDEO");
    expect(film).toHaveClass("hero-film");
    expect(film).not.toHaveClass("hero-photo");
    expect(film).toHaveAttribute("aria-hidden", "true");
    expect(film).toHaveAttribute("tabindex", "-1");
    expect(film).toHaveAttribute(
      "poster",
      "https://media.zoorik.com/hero-films/hero-datagrid-poster-1080.jpg",
    );
    expect((film as HTMLVideoElement).muted).toBe(true);
    expect((film as HTMLVideoElement).loop).toBe(true);
    expect(words).toHaveClass("wrap", "hero-in");
    expect(
      [...words!.children].map((child) => `${child.tagName.toLowerCase()}.${child.className}`),
    ).toEqual(["p.pp-eye", "h1.", "p.hero-sub", "div.hero-cta", "p.hx-mkt"]);
    /* Gone (owner, 23 Oct 2026): the turning mark and its glow, the badges, the tags, the range card, the
       autoscalers' row. */
    expect(
      hero.querySelector(
        ".zk-art, .zk-glow, .hero-photo, .hero-badge, ul.offer, .pp-figs, .hero-logos, .pf-watch",
      ),
    ).toBeNull();
  });

  it("names the product small above the h1: its mark, then its name, out of translation", () => {
    const page = renderPage(path, content);
    const eye = page.querySelector(".pp-hero p.pp-eye")!;
    expect(eye).toHaveAttribute("translate", "no");
    expect(text(eye)).toBe(name);
    const mark = eye.firstElementChild!;
    expect(mark.tagName.toLowerCase()).toBe("svg");
    expect(mark).toHaveAttribute("aria-hidden", "true");
    expect(mark.nextElementSibling!.tagName).toBe("SPAN");
  });

  it("says the home page's own line for the product under the h1", () => {
    const page = renderPage(path, content);
    const line = page.querySelector(".pp-hero p.hero-sub")!;
    const home = product === "coral" ? kubernetesContent : elasticContent;
    expect(content.hero.line).toBe(home.body);
    expect(line.textContent).toBe(home.body);
    expect(line.querySelector('[translate="no"]')).toHaveTextContent(name);
  });

  it("has one hero button, Estimate your saving, same tab, to its own assessment", () => {
    const page = renderPage(path, content);
    const buttons = [...page.querySelectorAll(".pp-hero .hero-cta a")];
    expect(buttons).toHaveLength(1);
    expect(buttons[0]).toHaveClass("btn", "btn-light");
    expect(text(buttons[0])).toBe("Estimate your saving");
    expect(buttons[0]).toHaveAttribute("href", `/assessment?p=${product}`);
    expect(buttons[0]).not.toHaveAttribute("target");
    expect(buttons[0].querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("ends the hero on the stores that list it, each its cloud's mark and its own listing", () => {
    const page = renderPage(path, content);
    const line = page.querySelector(".pp-hero .hero-cta + p.hx-mkt")!;
    expect(text(line)).toBe(
      `${name} is available in AWS Marketplace (opens in a new tab) and Microsoft Marketplace (opens in a new tab)`,
    );
    expect(line.firstElementChild).toHaveAttribute("translate", "no");
    const links = [...line.querySelectorAll("a")];
    expect(links.map((a) => a.getAttribute("href"))).toEqual(
      product === "coral"
        ? [
            "https://aws.amazon.com/marketplace/pp/prodview-kx44lqme4vwys",
            "https://marketplace.microsoft.com/en-us/product/zoorik.coral",
          ]
        : [
            "https://aws.amazon.com/marketplace/pp/prodview-u52eig5hqarzy",
            "https://marketplace.microsoft.com/en-us/product/zoorik.amoeba",
          ],
    );
    for (const a of links) {
      expect(a).toHaveAttribute("target", "_blank");
      expect(a).toHaveAttribute("rel", "noopener noreferrer");
      /* The mark first, and no arrow after the name, as the mock draws the line. */
      expect(a.firstElementChild).toHaveAttribute("aria-hidden", "true");
      expect(a.querySelector(".ext")).toBeNull();
    }
    expect(links.map((a) => a.firstElementChild!.getAttribute("data-mark"))).toEqual([
      "aws",
      "azure",
    ]);
    expect(links[0]!.firstElementChild).toHaveClass("aws");
  });

  it("asks What is it?: the lead, then the rest folded under More about it, with What it does on its right", () => {
    const page = renderPage(path, content);
    const section = page.querySelector(`section#about-${product}`)!;
    expect(section).toHaveClass("sec");
    expect(section).toHaveAttribute("aria-labelledby", `about-${product}-h`);
    const grid = section.querySelector(":scope > .wrap.pp-def.pf-def")!;
    const [copy, does] = [...grid.children];
    expect(grid.children).toHaveLength(2);
    expect(copy).toHaveClass("pp-def-t", "rise");
    expect(copy).not.toHaveAttribute("data-i");
    expect(does).toHaveClass("pf-does", "rise");
    expect(does).toHaveAttribute("id", "what");
    expect(does).toHaveAttribute("data-i", "1");
    expect(text(copy!.querySelector(`h2#about-${product}-h`))).toBe(`What is ${name}?`);
    const prose = copy!.querySelector(".pp-prose")!;
    const [lead, more] = [...prose.children];
    expect(prose.children).toHaveLength(2);
    expect(lead!.tagName).toBe("P");
    expect(lead!.textContent).toBe(plain(content.about.paragraphs[0]));
    expect(lead!.textContent).toMatch(new RegExp(`^${name} is a `));
    /* The other two stay in the page, folded: closed, behind a quiet opener. */
    expect(more!.tagName).toBe("DETAILS");
    expect(more).toHaveClass("pp-more");
    expect(more).not.toHaveAttribute("open");
    const summary = more!.querySelector(":scope > summary")!;
    expect(text(summary)).toBe(`More about ${name}`);
    expect(summary.querySelector('[translate="no"]')).toHaveTextContent(name);
    expect([...more!.querySelectorAll(":scope > p")].map((p) => p.textContent)).toEqual(
      content.about.paragraphs.slice(1).map(plain),
    );
    /* Each link is set as the prose's links are: no class of its own, in place. */
    for (const a of prose.querySelectorAll("a")) {
      expect(a).not.toHaveAttribute("class");
      expect(a).not.toHaveAttribute("target");
    }
    expect(content.about.paragraphs).toHaveLength(3);
  });

  it("lists What it does as rows, each its drawing, its title and its line, and where it runs", () => {
    const page = renderPage(path, content);
    /* The heading, with no "?" (owner, 1 Nov 2026). */
    expect(text(page.querySelector("#what h2#what-h"))).toBe(`What ${name} does`);
    expect(page.querySelector("#what h2 [translate='no']")).toHaveTextContent(name);
    const list = page.querySelector("#what ul.flist")!;
    const rows = [...list.children];
    expect(rows.every((row) => row.tagName === "LI" && row.classList.contains("has-i"))).toBe(true);
    expect(rows.map((row) => [row.id, text(row.querySelector("h3"))])).toEqual(
      content.offerings.map((o) => [o.id, o.label]),
    );
    /* Each row's line under its title; no progress line (owner, 23 Oct 2026). */
    expect(
      rows.map((row) => text(row.querySelector(":scope > div > h3 + span.tour-line"))),
    ).toEqual(content.offerings.map((o) => o.line));
    expect(list.querySelector(".tour-prog")).toBeNull();
    expect(list.querySelector("p")).toBeNull();
    /* Each row's drawing in its 88×52 slot, hidden from a screen reader, and each its own. */
    const slots = rows.map((row) => row.firstElementChild!);
    for (const slot of slots) {
      expect(slot).toHaveClass("flist-i", "mv");
      expect(slot).toHaveAttribute("aria-hidden", "true");
      const svg = slot.querySelector(":scope > svg.mv-svg")!;
      expect(svg).toHaveAttribute("viewBox", "0 0 88 52");
      expect(svg).toHaveAttribute("focusable", "false");
    }
    expect(new Set(slots.map((slot) => slot.innerHTML)).size).toBe(rows.length);
    /* What each one plays: Coral's cost line, recommendation lines, fitted pod and leaving node; Amoeba's filling
       disks, saved tail and leaving disk. */
    const players = [".mv-line", ".mv-rec", ".mv-pod-o", ".mv-fill.f1", ".mv-save", ".mv-gone"];
    expect(
      slots.map((slot) => players.find((player) => slot.querySelector(player) !== null)),
    ).toEqual(
      product === "coral"
        ? [".mv-line", ".mv-rec", ".mv-pod-o", ".mv-gone"]
        : [".mv-fill.f1", ".mv-save", ".mv-gone"],
    );
    /* Runs on, under the rows, as on the home page's blocks. */
    const runs = list.nextElementSibling!;
    expect(runs).toHaveClass("chips");
    expect(text(runs.querySelector(".chips-l"))).toBe("Runs on");
    expect([...runs.querySelectorAll(".chip")].map((chip) => text(chip))).toEqual(
      product === "coral" ? ["AKS", "EKS"] : ["Azure", "AWS", "Windows", "Linux"],
    );
  });

  it("sends a plain list with scripting off: every row and its line, nothing selected", () => {
    pathname = path;
    const html = renderToStaticMarkup(<ProductPage content={content} />);
    const doc = document.createElement("div");
    doc.innerHTML = html;
    const list = doc.querySelector("#what ul.flist")!;
    expect(list).toHaveAttribute("role", "list");
    expect(list).not.toHaveAttribute("aria-orientation");
    expect(doc.querySelectorAll("[aria-selected], [role='tab'], [role='tablist']")).toHaveLength(0);
    expect([...list.querySelectorAll("li[tabindex]")]).toHaveLength(0);
    expect([...list.querySelectorAll(".tour-line")].map((line) => line.textContent)).toEqual(
      content.offerings.map((o) => o.line),
    );
  });

  it("shows this product's three How it works cards, one key row each, no lede", () => {
    const page = renderPage(path, content);
    expect(text(page.querySelector("#how .sec-head"))).toBe(
      product === "amoeba" ? "How Amoeba rightsizes disks" : "How it works",
    );
    expect(page.querySelector("#how .sec-head p")).toBeNull();
    const cards = [...page.querySelectorAll("#how .stepc")];
    expect(cards).toHaveLength(3);
    expect(cards.map((card) => text(card.querySelector("h3")))).toEqual(
      howItWorksSteps[product].map((step) => step.title),
    );
    for (const card of cards) {
      expect(card.querySelectorAll(".hw-leg-r")).toHaveLength(1);
      expect(text(card.querySelector("h3"))).not.toMatch(/\.$/);
    }
    /* Under the cards, the line that says what their figures are. */
    const example = page.querySelector("#how .wrap > p.how-ex")!;
    expect(example.previousElementSibling).toHaveClass("steps");
    expect(example.textContent).toBe(content.how.example);
  });

  it("names only this product in the closing row, which rises as home's does", () => {
    const page = renderPage(path, content);
    expect(text(page.querySelector("#contact p"))).toBe(
      `Thirty minutes with the people who build ${name}.`,
    );
    expect(page.querySelector("#assess .btn-ink")).toHaveAttribute(
      "href",
      `/assessment?p=${product}`,
    );
    const demo = page.querySelector<HTMLAnchorElement>("#assess .cta-go")!;
    expect(demo).toHaveAttribute("href", calendarUrl);
    expect(demo).toHaveAttribute("target", "_blank");
    expect(demo).toHaveAttribute("rel", "noopener noreferrer");
    expect(text(demo)).toBe("Book a demo (opens in a new tab)");
    expect(page.querySelectorAll("#assess .rise")).toHaveLength(2);
    expect(page.querySelector("#assess [data-i]")).toBe(page.querySelector("#contact"));
  });

  it("marks its own product in the bar, whose Assessment link is the plain page", () => {
    const page = renderPage(path, content);
    const current = [...page.querySelectorAll('nav a[aria-current="page"]')];
    expect(current.length).toBeGreaterThan(0);
    for (const a of current) expect(a).toHaveAttribute("href", path);
    /* The bar's link and the drawer's lead to the assessment itself, here too;
       the page switches to Amoeba on its own. */
    const links = [...page.querySelectorAll("nav a")].filter((a) => text(a) === "Assessment");
    expect(links.map((a) => a.getAttribute("href"))).toEqual(["/assessment", "/assessment"]);
    expect(page.querySelectorAll(`nav a[href^="/assessment?p="]`)).toHaveLength(0);
  });

  it("lands every in-page anchor on something that is there", () => {
    const page = renderPage(path, content);
    const anchors = [...page.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')]
      .map((a) => a.getAttribute("href")!)
      .filter((href) => href !== "#");
    for (const href of new Set(anchors)) {
      expect(page.querySelector(`[id="${href.slice(1)}"]`), `nothing is ${href}`).not.toBeNull();
    }
  });

  it("has no duplicate id, so the two Azure marks keep their own gradients", () => {
    const page = renderPage(path, content);
    const ids = [...page.querySelectorAll("[id]")].map((el) => el.id);
    expect(ids.filter((id, index) => ids.indexOf(id) !== index)).toEqual([]);
    for (const el of page.querySelectorAll('[fill^="url(#"]')) {
      const id = el.getAttribute("fill")!.slice(5, -1);
      expect(page.querySelectorAll(`[id="${id}"]`), id).toHaveLength(1);
    }
  });

  it("keeps the product's name out of translation wherever the copy prints it", () => {
    const page = renderPage(path, content);
    const main = page.querySelector("main")!;
    const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (!node.textContent!.includes(name)) continue;
      /* The step cards are a shared component; this checks the copy the
         template prints. */
      if (node.parentElement!.closest(".stepc")) continue;
      expect(node.parentElement!.closest('[translate="no"]'), node.textContent!).not.toBeNull();
    }
  });

  it("uses only the site's words: its own verb, reduce, and never the old names", () => {
    const page = renderPage(path, content);
    const main = page.querySelector("main")!.cloneNode(true) as HTMLElement;
    /* Coral rebalances, Amoeba rightsizes: the home page's line says so in the hero. */
    expect(text(main.querySelector(".hero-sub"))).toMatch(
      product === "coral" ? /rebalances/ : /rightsizes/,
    );
    /* "reduce", never "cut" or "lower", in what the page itself prints (the How it works cards are the shared
       step cards'). */
    const own = main.cloneNode(true) as HTMLElement;
    for (const card of own.querySelectorAll(".stepc")) card.remove();
    expect(own.textContent).not.toMatch(/\b(cut|cuts|lower|lowers)\b/i);
    /* Built from pieces, so this file does not trip a source scan. */
    const forbidden = new RegExp(
      [
        ["disk", " storage"],
        ["storage", "tax"],
        ["k8s", "pilot"],
        ["elastic", "vol"],
      ]
        .map(([head, tail]) => head + tail)
        .join("|"),
      "i",
    );
    expect(page.textContent).not.toMatch(forbidden);
    /* No em dash in the copy, except on the Helm card ("Coral is in early access — book a demo for a console
       account"). */
    for (const line of main.querySelectorAll("#install .iw-alt")) {
      if (line.textContent!.startsWith("Coral is in early access — ")) line.remove();
    }
    expect(main.textContent).not.toContain("—");
  });

  it("describes itself to search as the organisation, the page and its app, with no price or rating", () => {
    const data = productPageStructuredData(content);
    expect(data["@context"]).toBe("https://schema.org");
    const graph = data["@graph"] as readonly Record<string, unknown>[];
    expect(graph.map((node) => node["@type"])).toEqual([
      "Organization",
      "WebSite",
      "WebPage",
      "BreadcrumbList",
      "SoftwareApplication",
    ]);
    const app = graph[4];
    expect(graph[2]).toMatchObject({
      url: `https://zoorik.com${path}`,
      about: { "@id": app["@id"] },
    });
    expect(app).toMatchObject({
      "@type": "SoftwareApplication",
      name,
      description: content.meta.appDescription,
      url: `https://zoorik.com${path}`,
    });
    expect(JSON.stringify(data)).not.toMatch(/"(offers|price|aggregateRating|review)"/);
    const page = renderPage(path, content);
    const script = page.querySelector('script[type="application/ld+json"]')!;
    expect(JSON.parse(script.textContent!)).toEqual(data);
  });
});

/**
 * The film band and the hero's "Watch the 2-minute film": drawn only while the
 * film is on YouTube. The films are too large for the site to serve, so a page
 * whose film has no address draws neither, and nothing on it leads to a film
 * that is not there.
 */
describe.each(pages)("the film on %s", (path, content) => {
  const product = content.product;
  const name = product === "amoeba" ? "Amoeba" : "Coral";
  const film = productFilms[product];
  const url = "https://www.youtube.com/watch?v=abc123";

  it("is on YouTube, at its address, and the page draws its band", () => {
    expect(content.film).toBe(film);
    expect(film.url).toBe(
      product === "coral" ? "https://youtu.be/aHRnAWhbzlo" : "https://youtu.be/H221xeryon4",
    );
    const page = renderPage(path, content);
    expect(page.querySelector("section#film a.pf-film-p")).toHaveAttribute("href", film.url);
    /* The hero leads to it no more: the band is right below (owner, 23 Oct 2026). */
    expect(page.querySelector('.pp-hero a[href="#film"]')).toBeNull();
  });

  it("draws no band and no link to it while a film has no address", () => {
    const page = renderPage(path, withFilm(content, null));
    expect(page.querySelector("#film, .pf-film, .pf-watch")).toBeNull();
    expect(page.querySelector('a[href="#film"]')).toBeNull();
    expect(page.querySelector('main a[href*="youtube"], main a[href*="youtu.be"]')).toBeNull();
    expect(page.querySelector('img[src^="/films/"]')).toBeNull();
  });

  it("once it is, comes after What is it? and before How it works", () => {
    const page = renderPage(path, withFilm(content, url));
    const ids = [...page.querySelectorAll("main > header[id], main > section[id]")].map(
      (el) => el.id,
    );
    expect(ids.slice(0, 4)).toEqual(["top", `about-${product}`, "film", "how"]);
    const band = page.querySelector("section#film")!;
    expect(band).toHaveClass("pf-film");
    expect(band).not.toHaveClass("sec");
    expect(band).toHaveAttribute("aria-labelledby", "pf-film-h");
    expect(text(band.querySelector(":scope > .wrap > .pf-film-h > h2#pf-film-h"))).toBe(
      `See ${name} at work`,
    );
    expect(band.querySelector("h2 [translate='no']")).toHaveTextContent(name);
  });

  it("opens the film on YouTube from its poster, which carries no pill", () => {
    const page = renderPage(path, withFilm(content, url));
    const poster = page.querySelector<HTMLAnchorElement>("#film a.pf-film-p")!;
    expect(poster).toHaveAttribute("href", url);
    expect(poster).toHaveAttribute("target", "_blank");
    expect(poster).toHaveAttribute("rel", "noopener");
    expect(poster).toHaveAttribute(
      "aria-label",
      `Watch the 2-minute ${name} film on YouTube (opens in a new tab)`,
    );
    const img = poster.querySelector("img")!;
    expect(img).toHaveAttribute("src", `/films/${product}-film-thumbnail-white.jpg`);
    expect(img).toHaveAttribute("alt", "");
    expect(img).toHaveAttribute("width", "1920");
    expect(img).toHaveAttribute("height", "1080");
    expect(img).toHaveAttribute("loading", "lazy");
    expect(poster.querySelector(".pf-play")).toHaveAttribute("aria-hidden", "true");
    /* The length pill came off the film; its link is the line under it (below). */
    expect(poster.querySelector(".pf-film-tag")).toBeNull();
    expect([...poster.children].map((child) => child.tagName)).toEqual(["IMG", "SPAN"]);
  });

  it("lists the chapters, each opening the film at its second", () => {
    const page = renderPage(path, withFilm(content, url));
    const list = page.querySelector("#film ol.pf-ch")!;
    expect(list).toHaveAttribute("aria-label", "Chapters of the film");
    const links = [...list.querySelectorAll(":scope > li > a")];
    expect(links.map((a) => [text(a.querySelector("b")), a.lastChild!.textContent])).toEqual(
      product === "coral"
        ? [
            ["0:00", "Connect"],
            ["0:21", "Monitoring"],
            ["0:33", "Recommendations"],
            ["0:43", "Workload optimization"],
            ["0:54", "Node optimization"],
            ["1:12", "Live migration"],
            ["1:29", "Rebalancing"],
            ["1:49", "Results"],
          ]
        : [
            ["0:00", "Connect your cloud"],
            ["0:15", "Onboard VMs"],
            ["0:35", "Dashboard and disks"],
            ["0:50", "The pool"],
            ["1:18", "Autopilot"],
            ["1:38", "Operations and Impact"],
            ["1:52", "Settings"],
          ],
    );
    /* The first chapter is the film itself; the others add YouTube's start, after
       `&` here because the address already has a query. */
    expect(links.map((a) => a.getAttribute("href"))).toEqual(
      film.chapters.map(({ at }) => (at === 0 ? url : `${url}&t=${at}s`)),
    );
    for (const a of links) {
      expect(a).toHaveAttribute("target", "_blank");
      expect(a).toHaveAttribute("rel", "noopener");
    }
  });

  it("starts a chapter after ? when the film's address has no query", () => {
    const short = "https://youtu.be/abc123";
    const page = renderPage(path, withFilm(content, short));
    const hrefs = [...page.querySelectorAll("#film .pf-ch a")].map((a) => a.getAttribute("href"));
    expect(hrefs[0]).toBe(short);
    expect(hrefs[1]).toBe(`${short}?t=${film.chapters[1]!.at}s`);
  });

  it("ends on one quiet line: the film on YouTube at its length, then the channel the site already lists", () => {
    const page = renderPage(path, withFilm(content, url));
    const more = page.querySelector("#film p.pf-film-more")!;
    const length = product === "coral" ? "2:05" : "2:12";
    expect(film.length).toBe(length);
    expect(text(more)).toBe(
      `Watch the ${length} film on YouTube (opens in a new tab) · More films on our YouTube channel`,
    );
    const [watch, channel] = [...more.querySelectorAll("a")];
    expect(watch).toHaveClass("pf-yt");
    expect(watch).toHaveAttribute("href", url);
    expect(watch).toHaveAttribute("target", "_blank");
    expect(watch).toHaveAttribute("rel", "noopener");
    expect(watch!.querySelector(".sr-only")).toHaveTextContent("(opens in a new tab)");
    expect(channel).not.toHaveClass("pf-yt");
    expect(channel).toHaveAttribute("href", youtubeChannel);
    expect(channel).toHaveAttribute("target", "_blank");
    expect(youtubeChannel).toBe(
      socialProfiles.find((profile) => profile.platform === "youtube")!.href,
    );
  });

  it("keeps every anchor landing and every heading in order with the band drawn", () => {
    const page = renderPage(path, withFilm(content, url));
    for (const a of page.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')) {
      const id = a.getAttribute("href")!.slice(1);
      if (id) expect(page.querySelector(`[id="${id}"]`), `nothing is #${id}`).not.toBeNull();
    }
    const ids = [...page.querySelectorAll("[id]")].map((el) => el.id);
    expect(ids.filter((id, index) => ids.indexOf(id) !== index)).toEqual([]);
    const levels = [...page.querySelectorAll("main h1, main h2, main h3")].map((h) =>
      Number(h.tagName[1]),
    );
    levels.reduce((previous, level) => {
      expect(level - previous).toBeLessThanOrEqual(1);
      return level;
    });
  });

  it("has its poster in public/films, served for a month under one cache rule", () => {
    expect(existsSync(join(process.cwd(), "public", film.poster))).toBe(true);
    const headers = readFileSync(join(process.cwd(), "public", "_headers"), "utf8");
    const rules = headers
      .split(/\n(?=\S)/)
      .filter((block) => !block.startsWith("#"))
      .map((block) => block.trim().split("\n"));
    const matching = rules.filter(([pattern]) =>
      new RegExp(`^${pattern!.trim().replace(/[.]/g, "\\.").replace(/\*/g, ".*")}$`).test(
        film.poster,
      ),
    );
    const cache = matching.flat().filter((line) => line.trim().startsWith("Cache-Control:"));
    expect(cache.map((line) => line.trim())).toEqual(["Cache-Control: public, max-age=2592000"]);
  });
});

/** A product's Learn tile: the one before its two cloud pages, a page tile to a published article. */
const learnTile = (content: ProductPageContent) => {
  const tile = content.readMore.tiles.at(-3) as Extract<ReadMoreTile, { kind: "page" }>;
  expect(tile.kind).toBe("page");
  expect(findArticle(learnSlugOf(tile.href) ?? "")?.slug, tile.href).toBeDefined();
  return tile;
};

describe("the Coral page", () => {
  it("never shows Windows or Linux, and no longer draws the autoscalers' row", () => {
    const page = renderPage("/coral", coralPageContent);
    const main = page.querySelector("main")!;
    /* Coral claims no Windows or Linux platform. Install your way names zoorikctl's systems (macOS, Linux, Windows):
       the systems a CLI runs on, not where Coral runs, so its section is left out of this read. */
    const claims = main.cloneNode(true) as HTMLElement;
    claims.querySelector("#install")?.remove();
    expect(claims.textContent).not.toMatch(/Windows|Linux/);
    expect(claims.querySelector('[data-mark="windows"], [data-mark="linux"]')).toBeNull();
    expect(main.querySelector(".hero-logos, .vk-logos")).toBeNull();
  });

  it("links its category to the subject's guide, and each autoscaler to the page on working with it", () => {
    const page = renderPage("/coral", coralPageContent);
    const prose = page.querySelector("#about-coral .pp-prose")!;
    const [lead, more] = [...prose.children];
    expect(linksOf(lead!)).toEqual([
      ["Kubernetes cost optimization", routes.kubernetesCostOptimization],
    ]);
    expect(linksOf(more!)).toEqual([
      ["KEDA", routes.coralWorksWithKeda],
      ["Karpenter", routes.coralWorksWithKarpenter],
      ["AKS node auto provisioning (NAP)", routes.coralWorksWithNodeAutoProvisioning],
      ["the Cluster Autoscaler", routes.coralWorksWithClusterAutoscaler],
    ]);
    /* The site's verb, where the mock had "cut". */
    expect(text(more!)).toContain("reduce AKS and EKS cost");
  });

  it("ends on Read more: the guide, the FAQ, the one-pager, its article and its two clouds, two by two", () => {
    const page = renderPage("/coral", coralPageContent);
    const article = learnTile(coralPageContent);
    const section = page.querySelector("section#read-coral")!;
    expect(section).toHaveAttribute("aria-labelledby", "read-coral-h");
    expect(text(section.querySelector("h2#read-coral-h"))).toBe("Coral docs and guides");
    const all = section.querySelector(".sec-hrow a.alink")!;
    expect(text(all)).toBe("All docs");
    expect(all).toHaveAttribute("href", `${routes.docs}#coral`);
    /* Reference, not a reveal. */
    expect(section.querySelector(".rise")).toBeNull();

    expect(section.querySelector(".dt-grid")).toHaveClass("dt-2x2");
    const tiles = [...section.querySelectorAll(".dt-grid > article.dt > a.dt-a")];
    expect(tiles.map((tile) => tile.getAttribute("href"))).toEqual([
      routes.coralGuide,
      routes.coralFaq,
      documents["coral-one-pager"].pdf,
      article.href,
      routes.aksCostOptimization,
      routes.eksCostOptimization,
    ]);
    expect(tiles.map((tile) => text(tile.querySelector(".dt-t")))).toEqual([
      "Product guide",
      "FAQ",
      "One-pager",
      article.title,
      "AKS cost optimization",
      "EKS cost optimization",
    ]);
    /* A product's name in the article tile's title is kept out of translation. */
    expect(
      [...tiles[3]!.querySelectorAll(".dt-t [translate='no']")].map((name) => text(name)),
    ).toEqual(article.title.match(/\b(Coral|Amoeba)\b/g) ?? []);
    expect([0, 1, 3, 4, 5].map((i) => text(tiles[i]!.querySelector(".dt-l")))).toEqual([
      "Connect, what changes, staying in control",
      "Sizing, safety, HPA, nodes and autoscalers",
      article.line,
      "Node pools, NAP and the Cluster Autoscaler",
      "EC2 instances, Karpenter and the Cluster Autoscaler",
    ]);
    for (const tile of [tiles[0]!, tiles[1]!, tiles[3]!, tiles[4]!, tiles[5]!]) {
      expect(tile).not.toHaveAttribute("download");
      expect(tile.querySelector(".dt-go")).not.toHaveClass("is-down");
    }

    /* The download: its line and its name are the file's measured facts, with a
       no-break space inside each figure, never a typed size. */
    const facts = documentFacts("coral-one-pager");
    const kb = Math.round(facts.bytes / 1000);
    const pdf = tiles[2];
    expect(pdf).toHaveAttribute("download");
    expect(pdf).not.toHaveAttribute("target");
    expect(pdf.querySelector(".dt-l")!.textContent).toBe(`1 page · ${kb} KB`);
    expect(pdf).toHaveAttribute(
      "aria-label",
      `Download the Coral one-pager, PDF, 1 page, ${kb} KB, ${facts.paper}`,
    );
    expect(facts.paper).toBe("A4");
    expect(pdf.querySelector(".dt-go")).toHaveClass("is-down");
    for (const svg of section.querySelectorAll(".dt svg")) {
      expect(svg).toHaveAttribute("aria-hidden", "true");
    }
  });
});

describe("the Amoeba page", () => {
  it("runs on Windows and Linux, as its Runs on chips say", () => {
    const page = renderPage("/amoeba", amoebaPageContent);
    expect(page.querySelector("#what .chip svg.tux")).toHaveAttribute("data-mark", "linux");
    expect(page.querySelector(".pp-hero .hero-logos, .pp-hero .hero-chips")).toBeNull();
  });

  it("draws its marketplace line under the button: both stores, its own listings, never Coral's", () => {
    const page = renderPage("/amoeba", amoebaPageContent);
    const line = page.querySelector(".pp-hero .hero-cta + p.hx-mkt")!;
    expect(text(line)).toMatch(/^Amoeba is available in /);
    expect(
      [...page.querySelectorAll('main a[href*="marketplace"]')].map((a) => a.getAttribute("href")),
    ).toEqual([
      "https://aws.amazon.com/marketplace/pp/prodview-u52eig5hqarzy",
      "https://marketplace.microsoft.com/en-us/product/zoorik.amoeba",
    ]);
  });

  it.runIf(!amoebaDocs && !amoebaOnePager)(
    "adds no Read more row while its guide, FAQ and one-pager are held",
    () => {
      const page = renderPage("/amoeba", amoebaPageContent);
      expect(page.querySelector("#read-amoeba")).toBeNull();
      expect(page.querySelector(".dt")).toBeNull();
      /* Nothing the page itself prints leads to a held route, file or hub group. */
      const held = [routes.amoebaGuide, routes.amoebaFaq, `${routes.docs}#amoeba`];
      for (const a of page.querySelectorAll("main a[href]")) {
        const href = a.getAttribute("href")!;
        expect(held, href).not.toContain(href);
        expect(href).not.toMatch(/amoeba-one-pager/);
      }
    },
  );

  it.runIf(amoebaDocs)(
    "reads more in its guide and FAQ, and the one-pager, once they are published",
    () => {
      const page = renderPage("/amoeba", amoebaPageContent);
      const article = learnTile(amoebaPageContent);
      const section = page.querySelector("section#read-amoeba")!;
      expect(section.querySelector("a.alink")).toHaveAttribute("href", `${routes.docs}#amoeba`);
      expect(
        [...section.querySelectorAll("a.dt-a")].map((a) => [
          text(a.querySelector(".dt-t")),
          a.getAttribute("href"),
        ]),
      ).toEqual([
        ["Product guide", routes.amoebaGuide],
        ["FAQ", routes.amoebaFaq],
        ...(amoebaOnePager ? [["One-pager", "/docs/amoeba-one-pager.pdf"]] : []),
        [article.title, article.href],
        ["Azure managed disk cost optimization", routes.azureManagedDiskCostOptimization],
        ["EBS cost optimization", routes.ebsCostOptimization],
      ]);
      expect(
        [...section.querySelectorAll("a.dt-a")]
          .slice(-2)
          .map((a) => text(a.querySelector(".dt-l"))),
      ).toEqual([
        "Data disks on Windows and Linux VMs in Azure",
        "Data volumes on Windows and Linux EC2 instances",
      ]);
      expect(text(section.querySelector(`a[href="${article.href}"] .dt-l`))).toBe(article.line);
    },
  );

  it("links btrfs pool to the article on how one works", () => {
    const page = renderPage("/amoeba", amoebaPageContent);
    const [lead, more] = [...page.querySelector("#about-amoeba .pp-prose")!.children];
    expect(linksOf(lead!)).toEqual([["btrfs pool", "/learn/btrfs-multiple-disks"]]);
    expect(more!.querySelector("a")).toBeNull();
  });

  it("says only what the worked example is, under the cards", () => {
    const page = renderPage("/amoeba", amoebaPageContent);
    expect(page.querySelector("#how .how-ex")!.textContent).toBe("Example at Azure list price.");
  });

  it("notes the restart under its second step's title", () => {
    const page = renderPage("/amoeba", amoebaPageContent);
    const second = page.querySelectorAll("#how .stepc")[1]!;
    const top = second.querySelector(".step-top")!;
    expect(text(top.querySelector(":scope > div > h3"))).toBe("Move onto one pool");
    expect(text(top.querySelector(":scope > div > p.step-note"))).toBe(
      "Services restart at the switch",
    );
    expect(page.querySelectorAll("#how .step-note")).toHaveLength(1);
  });
});
