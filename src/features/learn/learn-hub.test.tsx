import { readFileSync } from "node:fs";

import { fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { comparePath, learnPath, routes } from "@/config/site";
import { pageCards } from "@/config/social";
import { caseStudiesHub } from "@/content/case-studies";
import { socialProfiles } from "@/content/footer";
import {
  learnComparisons,
  learnFilmLines,
  learnFirst,
  learnFixes,
  learnGuides,
  learnGuidesLast,
  learnMedium,
  learnMore,
  learnPage,
  learnPillars,
  learnStart,
  learnSubjects,
  type LearnCard,
} from "@/content/learn";
import type { Article } from "@/content/learn/article";
import {
  articleAuthor,
  articleRoute,
  findArticle,
  learnArticles,
  titleLink,
} from "@/content/learn/published";
import { alternativesPages } from "@/content/learn-compare";
import { marketGroups, shownGroups, versusFacts } from "@/content/learn-market";
import { newsPage, newsRadar } from "@/content/news";
import { productFilms } from "@/content/product-films";
import { isoDay, shortDay } from "@/lib/content-date";
import { learnToday } from "@/lib/learn-today";

/* The nav and the footer read the pathname. */
vi.mock("next/navigation", () => ({ usePathname: () => "/learn" }));

import LearnRoute, { metadata } from "@/app/learn/page";

import { CoverArt } from "./learn-cards";

/**
 * `/learn`: the metadata, the hero and its search, then Start here, Find the right fix, Compare, Guides, Watch and
 * read, More from Zoorik and the case study, and the page's rules: only published articles, each card read from the
 * Learn index and placed by the hub's rules, only the native tools' comparisons (the market's are under /compare), no
 * tool of the market named anywhere on the page, and search, chips and the fix picker that work in the page and store
 * nothing. Every card, title and count is worked out from the index, so a new article is checked with no change here.
 * Its sitemap entry is in `src/app/sitemap.test.ts`, its page graph in `src/config/structured-data.test.ts`.
 */

const text = (el: Element | null): string =>
  (el?.textContent ?? "").replace(/[\s\u00a0]+/g, " ").trim();

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

const page = () => render(<LearnRoute />).container;

/** Whether an element is in view: neither it nor anything around it is `hidden`. */
const shown = (el: Element) => !el.closest("[hidden]");
const cards = (root: ParentNode) =>
  [...root.querySelectorAll(".lv-card")]
    .filter(shown)
    .map((card) => text(card.querySelector(".lv-cb b")));
const sections = (root: ParentNode) =>
  [...root.querySelectorAll("main > section")].filter(shown).map((section) => section.id);
const fixTabs = (root: ParentNode) =>
  [...root.querySelectorAll<HTMLButtonElement>(".fx-q button")].filter(shown);
const chip = (root: ParentNode, label: string) =>
  [...root.querySelectorAll<HTMLButtonElement>(".lv-chips button")].find((b) => text(b) === label)!;
const search = (root: ParentNode) => root.querySelector<HTMLInputElement>("input[data-search]")!;

/** What a card prints: where it goes, its subject's tag, then the title, the line and its date. */
const card = (el: Element) => [
  el.getAttribute("href"),
  text(el.querySelector(".lv-tag")),
  text(el.querySelector(".lv-cb b")),
  text(el.querySelector(".lv-cb small")),
  text(el.querySelector(".lv-date")),
];

const tagOf = (article: Article) =>
  learnSubjects.find((subject) => subject.label === article.hub)!.label;

/** What an article's card should print, read from the article itself. */
const expected = (article: Article) => {
  const author = articleAuthor(article);
  return [
    articleRoute(article),
    tagOf(article),
    article.h1.replace(/\s+/g, " "),
    article.card.replace(/\s+/g, " "),
    `${shortDay(article.published)}${author ? ` · By ${author.name}` : ""}`,
  ];
};

const pillarSlugs = new Set(learnPillars.map((entry) => entry.pillar));

/** The hub's order: the first nine days' articles, then the rest, each A–Z by slug. */
const inHubOrder = (articles: readonly Article[]) => [
  ...articles.filter((article) => learnFirst.has(article.slug)),
  ...articles.filter((article) => !learnFirst.has(article.slug)),
];

/** Every card on the page, in its order: Start here, Compare, Guides. */
const allCards: readonly LearnCard[] = [...learnStart, ...learnComparisons, ...learnGuides];

/** A card's words for the search: its title, its line and its subject, in lower case. */
const findable = (entry: LearnCard) =>
  `${entry.title} ${entry.line} ${learnSubjects.find((s) => s.id === entry.subject)!.label}`.toLowerCase();

/** The sections a search or a subject leaves, in the page's order. */
const sectionsLeft = (matches: (entry: LearnCard) => boolean) => {
  const any = allCards.some(matches);
  return [
    ...(learnStart.some(matches) || !any ? ["start"] : []),
    "fix",
    ...(learnComparisons.some(matches) ? ["compare"] : []),
    ...(learnGuides.some(matches) ? ["guides"] : []),
    "watch",
    "more",
    "proof",
    "assess",
  ];
};

/**
 * The market's competitors, read from the market data as `market-names.test.ts` reads them: every tool but the
 * clouds' own and the open-source ones, by its name (before any bracket), both halves of a "<product> by <owner>"
 * name, and its owner; names of three letters or fewer are left out, as there.
 */
const NOT_COMPETITORS = new Set(["Open source", "Azure", "AWS"]);
const competitors = [
  ...new Set(
    marketGroups
      .filter((group) => group.id !== "native")
      .flatMap((group) => group.tools)
      .filter((tool) => !NOT_COMPETITORS.has(tool.subgroup))
      .flatMap((tool) => {
        const head = tool.name.split(" (")[0]!;
        const owner = tool.company
          .split(/ \(|;|,/)[0]!
          .replace(/ Inc\.?$/, "")
          .trim();
        return [head, ...head.split(" by "), owner].map((name) => name.trim());
      }),
  ),
].filter((name) => name.length > 3);
const literal = (name: string) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

describe("/learn's metadata", () => {
  it("titles and describes the hub as its mock does, with the /learn card", () => {
    /* "Zoorik Learn" as is: never followed by " · Zoorik". The h1 keeps "Learn cloud cost optimization". */
    expect(metadata.title).toEqual({ absolute: "Zoorik Learn: cloud cost optimization guides" });
    expect(metadata.description).toBe(
      "Guides and comparisons for Kubernetes, block storage and the whole cloud bill on Azure and AWS, from where the money goes to the right fix.",
    );
    expect(metadata.alternates).toEqual({ canonical: "/learn" });
    expect(metadata).not.toHaveProperty("robots");
    expect(metadata.openGraph).toMatchObject({
      url: "/learn",
      title: "Zoorik Learn: cloud cost optimization guides",
      images: [pageCards.learn],
    });
    /* The sitemap's date for the hub: a printed day, not ahead of today. */
    expect(isoDay(learnPage.updated) <= learnToday()).toBe(true);
  });
});

describe("/learn", () => {
  it("has one h1 and the search in the hero, with no deck between them, then the sections in the mock's order", () => {
    const root = page();
    expect(root.querySelectorAll("h1")).toHaveLength(1);
    expect(text(root.querySelector("header.hero h1"))).toBe(
      "Zoorik Learn: cloud cost optimization guides",
    );
    expect(root.querySelector("header.hero h1 [translate='no']")).toHaveTextContent("Zoorik");
    expect(root.querySelector("header.hero .doc-deck")).toBeNull();
    expect(root.querySelector("header.hero h1")!.nextElementSibling).toHaveClass("lv-search");
    expect(root.querySelector("header.hero .vp-kick")).toBeNull();
    const field = root.querySelector("header.hero .hero-in > label.lv-search")!;
    expect(text(field.querySelector(".sr-only"))).toBe("Search Learn");
    expect(search(root)).toHaveAttribute("type", "search");
    expect(search(root)).toHaveAttribute(
      "placeholder",
      "Search guides, comparisons, tools and news",
    );
    expect(root.querySelector("a.skip")).toHaveAttribute("href", "#main");

    const all = [...root.querySelectorAll("main > section")];
    expect(
      all.map((s) => [
        s.id,
        s.classList.contains("sec-band"),
        text(s.querySelector("h2")),
        text(s.querySelector(".lv-head > p")),
      ]),
    ).toEqual([
      ["start", false, "Start here", ""],
      [
        "fix",
        true,
        "Find the right fix",
        "Pick what is costing you. See what helps, the native tools, and where Zoorik fits.",
      ],
      ["compare", true, "Compare", "Native tools and approaches, side by side."],
      ["guides", false, "Guides and best practices", "Plain explainers, each with its sources."],
      ["watch", true, "Watch and read", "Two-minute films on YouTube, and longer reads on Medium."],
      ["more", false, "More from Zoorik", ""],
      ["proof", true, "On a real cluster", "What the practices add up to, measured."],
      ["assess", false, "Find your own number", ""],
    ]);
    expect(text(root.querySelector("#start .lv-subj p"))).toBe(
      "One guide per subject: where the money goes and what moves it most.",
    );
    for (const section of all.slice(0, -1)) {
      expect(section).toHaveAttribute("aria-labelledby", `${section.id}-h`);
      expect(section.querySelector("h2")).toHaveAttribute("id", `${section.id}-h`);
    }
    /* More from Zoorik's head is its h2 alone, as the mock draws it. */
    expect(root.querySelector("#more .lv-head")!.children).toHaveLength(1);
    /* The brand's name is kept out of translation where the mock marks it. */
    expect(text(root.querySelector("#fix .lv-head p [translate=no]"))).toBe("Zoorik");
    expect(text(root.querySelector("#more h2 [translate=no]"))).toBe("Zoorik");
    /* The sections the hub handed on: the market map, the news card, Community and events. */
    expect(root.querySelector("#market, #news, #community, .mk, .lv-news, .cm, .lv-h3")).toBeNull();
  });

  it("shows only published articles, each as its own page writes it", () => {
    const root = page();
    expect(root.querySelector(".is-soon, .lv-soon")).toBeNull();
    expect(root.querySelector("div.lv-card")).toBeNull();
    const published = new Set(learnArticles.map(articleRoute));
    const linked = [...root.querySelectorAll("a.lv-card")].map((a) => a.getAttribute("href")!);
    expect(new Set(linked)).toEqual(published);
    for (const a of root.querySelectorAll("a.lv-card")) {
      const article = learnArticles.find((x) => articleRoute(x) === a.getAttribute("href"))!;
      expect(card(a)).toEqual(expected(article));
    }
  });

  it("starts each subject on its pillar once published, and on its stand-in until then", () => {
    const root = page();
    const want = learnPillars.flatMap(({ pillar, until }) => {
      const article = findArticle(pillar) ?? findArticle(until);
      return article ? [expected(article)] : [];
    });
    expect([...root.querySelectorAll("#start a.lv-card")].map(card)).toEqual(want);
    /* No "Coming next" line under any card. */
    expect(root.querySelector(".lv-next")).toBeNull();
    /* A pillar is in Start here only. */
    for (const a of root.querySelectorAll("#compare a.lv-card, #guides a.lv-card")) {
      const slug = a.getAttribute("href")!.slice("/learn/".length);
      expect(pillarSlugs.has(slug), slug).toBe(false);
    }
  });

  it("lists the comparisons under Compare and every other article under Guides, the first nine days first", () => {
    const root = page();
    const listed = learnArticles.filter((article) => !pillarSlugs.has(article.slug));
    const comparisons = inHubOrder(listed.filter((article) => article.versus));
    const guides = inHubOrder(listed.filter((article) => !article.versus));
    const last = guides.filter((article) => article.slug === learnGuidesLast);
    /* Compare holds the native tools' comparisons only, in one grid, each with its two sides on its cover. */
    const compare = root.querySelectorAll("#compare .lv-grid3");
    expect(compare).toHaveLength(1);
    expect(
      [...compare[0]!.querySelectorAll("a.lv-card")].map((a) => [
        ...card(a),
        [...a.querySelectorAll(".lv-vs > b")].map(text),
      ]),
    ).toEqual(comparisons.map((article) => [...expected(article), [...article.versus!]]));
    expect([...root.querySelectorAll("#guides a.lv-card")].map(card)).toEqual(
      [...guides.filter((article) => article.slug !== learnGuidesLast), ...last].map(expected),
    );
    expect(root.querySelector("#guides .lv-vs")).toBeNull();
  });

  it("names no tool of the market, and links the comparisons only through Cloud cost optimization tools", () => {
    expect(competitors.length).toBeGreaterThan(40);
    /* The two the versus pages compare with are among them. */
    expect(competitors).toEqual(expect.arrayContaining(versusFacts.map((facts) => facts.name)));
    const root = page();
    const words = [
      root.ownerDocument.body.textContent ?? "",
      ...[...root.ownerDocument.body.querySelectorAll("*")].flatMap((el) =>
        [...el.attributes].map((attr) => attr.value),
      ),
    ].join("\n");
    expect(words).toContain("Kubernetes");
    expect(words).toContain(routes.cloudCostTools);
    const found = competitors.filter((name) =>
      new RegExp(`(?<![A-Za-z0-9])${literal(name)}(?![A-Za-z0-9])`).test(words),
    );
    expect(found).toEqual([]);
    /* Nor any page that names one: the versus and alternatives pages are linked from Cloud cost optimization tools
       only. */
    const hrefs = [...root.querySelectorAll("a")].map((a) => a.getAttribute("href") ?? "");
    expect(hrefs.filter((href) => href.startsWith(`${comparePath}/`))).toEqual([]);
    expect(hrefs.filter((href) => alternativesPages.some((entry) => entry.route === href))).toEqual(
      [],
    );
    /* The page links the tools once, from More from Zoorik (the footer's Resources links them too). */
    expect(
      [...root.querySelectorAll("main a")].filter(
        (a) => a.getAttribute("href") === routes.cloudCostTools,
      ),
    ).toEqual([root.querySelector(`#more a.lv-mc[href="${routes.cloudCostTools}"]`)]);
  });

  it("narrows the cards and their sections to the search, and says when nothing matches", async () => {
    const user = userEvent.setup();
    const root = page();
    expect(cards(root)).toHaveLength(allCards.length);
    expect(root.querySelector(".lv-empty")).toHaveAttribute("hidden");

    /* Watch and read, More from Zoorik and the case study hold nothing findable: the search never hides them. */
    for (const typed of ["Karpenter", "  DISK "]) {
      const query = typed.trim().toLowerCase();
      const matches = (entry: LearnCard) => findable(entry).includes(query);
      await user.clear(search(root));
      await user.type(search(root), typed);
      expect(cards(root), typed).toEqual(allCards.filter(matches).map((entry) => entry.title));
      expect(sections(root), typed).toEqual(sectionsLeft(matches));
    }

    /* Nothing matches: Start here stays, its cards hidden, with the line and its button. */
    await user.clear(search(root));
    await user.type(search(root), "zzz");
    expect(cards(root)).toEqual([]);
    expect(sections(root)).toEqual(["start", "fix", "watch", "more", "proof", "assess"]);
    const empty = root.querySelector(".lv-empty")!;
    expect(shown(empty)).toBe(true);
    expect(text(empty)).toBe("Nothing matches. Show everything");

    await user.click(empty.querySelector("button.lv-reset")!);
    expect(search(root).value).toBe("");
    expect(cards(root)).toHaveLength(allCards.length);
    expect(root.querySelector(".lv-empty")).toHaveAttribute("hidden");
    expect(sections(root)).toHaveLength(8);
  });

  it("filters the cards and Find the right fix by subject, one chip pressed at a time", async () => {
    const user = userEvent.setup();
    const root = page();
    const chips = [...root.querySelectorAll(".lv-chips button")];
    expect(root.querySelector(".lv-chips")).toHaveAttribute("aria-label", "Subject");
    expect(chips.map((b) => [text(b), b.getAttribute("aria-pressed")])).toEqual([
      ["All", "true"],
      ["Cloud cost", "false"],
      ["Kubernetes", "false"],
      ["Block storage", "false"],
    ]);

    await user.click(chip(root, "Block storage"));
    expect(chips.map((b) => b.getAttribute("aria-pressed"))).toEqual([
      "false",
      "false",
      "false",
      "true",
    ]);
    const storage = (entry: LearnCard) => entry.subject === "storage";
    expect(
      [...root.querySelectorAll(".lv-card")].filter(shown).map((a) => a.getAttribute("data-p")),
    ).toEqual(allCards.filter(storage).map(() => "storage"));
    /* A section with no storage card hides, and the rest stay. */
    expect(sections(root)).toEqual(sectionsLeft(storage));
    /* The open question was another subject's: the first storage question opens in its place. */
    expect(fixTabs(root).map((b) => [text(b), b.getAttribute("aria-selected")])).toEqual([
      ["Disks are bigger than their data", "true"],
    ]);
    expect(
      [...root.querySelectorAll(".fx-panel")].filter(shown).map((p) => text(p.querySelector("h3"))),
    ).toEqual(["Bring each disk back to the space its data needs."]);

    await user.click(chip(root, "All"));
    expect(cards(root)).toHaveLength(allCards.length);
    expect(fixTabs(root)).toHaveLength(6);
    expect(fixTabs(root)[3]).toHaveAttribute("aria-selected", "true");
  });

  it("opens one answer of Find the right fix at a time, by click and by the arrow keys", async () => {
    const user = userEvent.setup();
    const root = page();
    const list = root.querySelector(".fx-q")!;
    expect(list).toHaveAttribute("role", "tablist");
    expect(list).toHaveAttribute("aria-label", "What is costing you?");
    expect(text(list.querySelector(".fx-qh"))).toBe("What is costing you?");
    const tabs = fixTabs(root);
    expect(tabs.map(text)).toEqual(learnFixes.map((entry) => entry.question));
    const open = () => [...root.querySelectorAll(".fx-panel")].filter(shown).map((p) => p.id);
    expect(open()).toEqual(["fx-p0"]);

    await user.click(tabs[4]!);
    expect(open()).toEqual(["fx-p4"]);
    expect(tabs[4]).toHaveAttribute("aria-selected", "true");
    expect(tabs[0]).toHaveAttribute("aria-selected", "false");
    fireEvent.keyDown(tabs[4]!, { key: "ArrowDown" });
    expect(open()).toEqual(["fx-p5"]);
    expect(document.activeElement).toBe(tabs[5]);
    fireEvent.keyDown(tabs[5]!, { key: "ArrowRight" });
    expect(open()).toEqual(["fx-p0"]);
    fireEvent.keyDown(tabs[0]!, { key: "ArrowUp" });
    expect(open()).toEqual(["fx-p5"]);

    const panels = [...root.querySelectorAll(".fx-panel")];
    expect(
      panels.map((panel) => [
        [...panel.querySelectorAll(".fx-k")].map(text),
        text(panel.querySelector("h3")),
        [...panel.querySelectorAll(".fx-tools span")].map(text),
        text(panel.querySelector(".fx-z")),
        panel.querySelector("a.fx-read")?.getAttribute("href") ?? null,
        text(panel.querySelector(".fx-read")),
      ]),
    ).toEqual(
      learnFixes.map((entry) => [
        ["What helps", "The native tools", "Where Zoorik fits"],
        entry.helps,
        entry.tools,
        entry.fits,
        entry.read.href,
        `Read: ${entry.read.title}`,
      ]),
    );
    /* Each reads one article, named by its h1 once published and by its own words, unlinked, until then; or the
       assessment. */
    const reads = [
      ["kubernetes-bin-packing", "Kubernetes bin packing: fewer nodes for the same pods"],
      ["kubernetes-pod-right-sizing", "Kubernetes pod right sizing: set requests from real use"],
      ["keda-vs-hpa-vs-vpa", "KEDA vs HPA vs VPA: where event-driven scaling fits"],
      ["azure-disk-cost-optimization", "Azure disk cost optimization: stop paying for empty space"],
      null,
      [
        "poor-architecture-cloud-bill",
        "How Poor Infrastructure Architecture Quietly Increases Your Cloud Bill",
      ],
    ] as const;
    expect(learnFixes.map((entry) => entry.read)).toEqual(
      reads.map((read) => {
        if (!read) return { title: "The free assessment", href: routes.assessment };
        const link = titleLink({ text: read[1], href: learnPath(read[0]) });
        return { title: link.text, href: link.href };
      }),
    );
    for (const panel of panels) {
      if (!panel.querySelector("a.fx-read"))
        expect(panel.querySelector(".fx-read svg"), panel.id).toBeNull();
    }
    expect(learnFixes[1]!.fits).toBe(
      "Coral rebalances requests to what apps use, and raises them when an app needs more.",
    );
  });

  it("shows the two product films, each opening on YouTube in a new tab and saying so", () => {
    const root = page();
    const films = [...root.querySelectorAll("#watch .wr > a.wr-film")];
    expect(
      films.map((a) => [
        a.getAttribute("href"),
        a.getAttribute("target"),
        a.getAttribute("rel"),
        a.querySelector(".wr-th img")!.getAttribute("src"),
        text(a.querySelector(".wr-dur")),
        text(a.querySelector(".wr-k")),
        text(a.querySelector(".wr-t")),
        text(a.querySelector(".wr-l")),
        text(a.querySelector(".fx-read")),
        text(a.querySelector(":scope > .sr-only")),
      ]),
    ).toEqual(
      (["coral", "amoeba"] as const).map((product) => [
        productFilms[product].url,
        "_blank",
        "noopener noreferrer",
        productFilms[product].poster,
        productFilms[product].length,
        "YouTube",
        productFilms[product].title,
        learnFilmLines[product],
        "Watch on YouTube",
        "(opens in a new tab)",
      ]),
    );
    expect(films.map((a) => text(a.querySelector(".wr-t")))).toEqual([
      "See Coral at work",
      "See Amoeba at work",
    ]);
    expect(films.map((a) => text(a.querySelector(".wr-l")))).toEqual([
      "How Coral rebalances Kubernetes on AKS and EKS.",
      "How Amoeba rightsizes block storage on Azure and AWS.",
    ]);
    for (const a of films) {
      const img = a.querySelector("img")!;
      expect(img).toHaveAttribute("alt", "");
      expect(img).toHaveAttribute("loading", "lazy");
      expect([img.getAttribute("width"), img.getAttribute("height")]).toEqual(["1920", "1080"]);
      expect(a.querySelector(".wr-play")).toHaveAttribute("aria-hidden", "true");
      expect(a.querySelector(".fx-read svg")).toHaveAttribute("aria-hidden", "true");
      /* The product's name is kept out of translation, in the title and the line. */
      expect([...a.querySelectorAll("[translate=no]")]).toHaveLength(2);
    }
  });

  it("leaves out a film that is not on YouTube yet", async () => {
    vi.resetModules();
    vi.doMock("@/content/product-films", async (original) => {
      const actual = await original<typeof import("@/content/product-films")>();
      return {
        ...actual,
        productFilms: {
          ...actual.productFilms,
          amoeba: { ...actual.productFilms.amoeba, url: null },
        },
      };
    });
    try {
      const { WatchAndRead } = await import("./learn-watch");
      const root = render(<WatchAndRead />).container;
      expect([...root.querySelectorAll("a.wr-film")].map((a) => a.getAttribute("href"))).toEqual([
        productFilms.coral.url,
      ]);
      expect(root.querySelector(".wr-med")).not.toBeNull();
    } finally {
      vi.doUnmock("@/content/product-films");
      vi.resetModules();
    }
  });

  it("shows the live Medium post at its own address, then the follow links, each in a new tab", () => {
    const panel = page().querySelector("#watch .wr > .wr-med")!;
    expect(text(panel.querySelector(":scope > .wr-k"))).toBe("On Medium");
    const post = panel.querySelector("a.wr-post")!;
    /* The address Medium serves; the mock's is cut short after "-6686". */
    expect(post).toHaveAttribute(
      "href",
      "https://medium.com/zoorik/why-your-kubernetes-cluster-pays-for-capacity-it-doesnt-use-66863320dca3",
    );
    expect(post.getAttribute("href")).toBe(learnMedium.post.url);
    expect(post).toHaveAttribute("target", "_blank");
    expect(post).toHaveAttribute("rel", "noopener noreferrer");
    expect(
      [".wr-pd", ".wr-pt", ".wr-pl", ".wr-go", ":scope > .sr-only"].map((sel) =>
        text(post.querySelector(sel)),
      ),
    ).toEqual([
      "12 Oct 2026",
      "Why your Kubernetes cluster pays for capacity it doesn’t use",
      "Pods often reserve more CPU and memory than they use, and you pay for the nodes that hold them.",
      "Read on Medium",
      "(opens in a new tab)",
    ]);
    const profile = (platform: string) =>
      socialProfiles.find((entry) => entry.platform === platform)!.href;
    const follow = [...panel.querySelectorAll(".wr-sub > a")];
    expect(
      follow.map((a) => [
        a.getAttribute("href"),
        a.getAttribute("target"),
        text(a.firstChild as Element),
        text(a.querySelector(".sr-only")),
      ]),
    ).toEqual([
      [profile("medium"), "_blank", "Follow on Medium", "(opens in a new tab)"],
      [profile("youtube"), "_blank", "Subscribe on YouTube", "(opens in a new tab)"],
    ]);
    expect(follow.map((a) => a.getAttribute("href"))).toEqual([
      "https://medium.com/zoorik",
      "https://www.youtube.com/@getzoorik",
    ]);
  });

  it("links Zoorik News, the tools and the community, every figure read from where the site holds it", () => {
    const root = page();
    const links = [...root.querySelectorAll("#more .lv-more > a.lv-mc")];
    expect(
      links.map((a) => [
        a.getAttribute("href"),
        a.getAttribute("target"),
        text(a.querySelector(".lv-mt")),
        text(a.querySelector(".lv-ml")),
        text(a.querySelector(".lv-mx")),
        text(a.querySelector(".fx-read")),
      ]),
    ).toEqual(
      learnMore.map((entry) => [entry.href, null, entry.title, entry.line, entry.extra, "Open"]),
    );
    expect(learnMore.map((entry) => entry.href)).toEqual([
      routes.news,
      routes.cloudCostTools,
      routes.community,
    ]);
    /* Zoorik News: the page's name, and this week's first Radar headline, as the mock picks it. */
    expect(learnMore[0]!.title).toBe(newsPage.hero.title);
    expect(learnMore[0]!.extra).toBe(`This week: ${newsRadar.streams[0].items[0]!.title}`);
    /* The tools: that page's count of tiles, Coral and Amoeba among them, and its kinds, in its order. */
    const count = shownGroups.reduce(
      (sum, group) => sum + group.tools.length + (group.ours ? 1 : 0),
      0,
    );
    expect(count).toBe(26);
    expect(learnMore[1]!.line).toBe(
      `${count} tools by name in four groups: what each does, how it acts and where it runs.`,
    );
    expect(shownGroups.map((group) => group.label)).toEqual([
      "Kubernetes",
      "Block storage",
      "FinOps",
      "Cloud providers",
    ]);
    expect(learnMore[1]!.extra).toBe("Kubernetes · Block storage · FinOps · Cloud providers");
    expect(learnMore[2]).toMatchObject({
      title: "Community",
      line: "r/zoorik on Reddit, the events worth going to, and where to ask.",
      extra: "Join r/zoorik",
    });
    for (const a of links)
      expect(a.querySelector(".fx-read svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("links the case study, every figure read from the study", () => {
    const root = page();
    const study = caseStudiesHub.studies[0]!;
    expect(root.querySelector("main > section#proof")).toHaveClass("sec-band");
    const proof = root.querySelector("#proof a.lv-proof")!;
    expect(proof).toHaveAttribute("href", study.href);
    expect(text(proof.querySelector(".lv-pk"))).toBe("Value Lab · Coral on AKS");
    expect(text(proof.querySelector(".lv-pbig"))).toBe(study.figure);
    expect(text(proof.querySelector(".lv-pt b"))).toBe(study.title);
    expect(text(proof.querySelector(".lv-pt small"))).toBe(
      `${study.after.label} a month instead of ${study.before.label}, eight days after we connected Coral.`,
    );
    expect(text(proof.querySelector(".fx-read"))).toBe(caseStudiesHub.card.read);
  });

  it("stores nothing in the browser, whatever the reader does", async () => {
    const user = userEvent.setup();
    const calls: string[] = [];
    for (const method of ["getItem", "setItem", "removeItem", "clear", "key"] as const)
      vi.spyOn(Storage.prototype, method).mockImplementation((() => {
        calls.push(method);
        return null;
      }) as never);
    vi.spyOn(document, "cookie", "set").mockImplementation(() => calls.push("cookie"));
    const root = page();
    await user.type(search(root), "disk");
    await user.click(chip(root, "Kubernetes"));
    await user.click(fixTabs(root)[1]!);
    expect(calls).toEqual([]);
    /* Nor does the code of the hub and its island touch storage. */
    for (const file of [
      "learn-filters.tsx",
      "learn-hub.tsx",
      "learn-watch.tsx",
      "learn-more.tsx",
    ]) {
      expect(readFileSync(`src/features/learn/${file}`, "utf8")).not.toMatch(
        /localStorage|sessionStorage|indexedDB|document\.cookie/,
      );
    }
  });

  it("ends with the site's closing row, for both products", () => {
    const row = page().querySelector("#assess")!;
    expect(row.querySelector('a[href="/assessment"]')).not.toBeNull();
    expect(text(row)).toContain("Thirty minutes with the people who build Coral and Amoeba.");
  });
});

describe("a card's cover", () => {
  const draw = (subject: "cloud" | "k8s" | "storage", k: number) =>
    render(<CoverArt subject={subject} k={k} />).container;

  it("draws each subject's motif for the card's place, as the mock's sums do", () => {
    expect(draw("cloud", 0).querySelector("polyline")).toHaveAttribute(
      "points",
      "0,30 60,26 120,44 180,58 240,70",
    );
    expect(draw("cloud", 2).querySelector("polyline")).toHaveAttribute(
      "points",
      "0,32 60,26 120,44 180,64 240,70",
    );
    const machines = [...draw("k8s", 1).querySelectorAll(".lv-grid i")];
    expect(machines).toHaveLength(12);
    expect(machines.flatMap((i, n) => (i.classList.contains("on") ? [n] : []))).toEqual([3, 6, 10]);
    /* 0.24 − 0.08 is 0.15999…, so the third disk is 15% full, as the mock draws it. */
    expect(
      [...draw("storage", 2).querySelectorAll(".lv-disks i")].map(
        (i) => (i as HTMLElement).style.width,
      ),
    ).toEqual(["24%", "38%", "15%"]);
    expect(
      [...draw("storage", 3).querySelectorAll(".lv-disks i")].map(
        (i) => (i as HTMLElement).style.width,
      ),
    ).toEqual(["50%", "64%", "42%"]);
  });
});
