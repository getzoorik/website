import { readFileSync } from "node:fs";

import { fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { routes } from "@/config/site";
import { pageCards } from "@/config/social";
import { caseStudiesHub } from "@/content/case-studies";
import { socialProfiles } from "@/content/footer";
import {
  learnComingNext,
  learnFilmLines,
  learnFixes,
  learnMarketGroupNames,
  learnMedium,
  learnMore,
  learnPage,
  learnStart,
} from "@/content/learn";
import { articleOrder, articles } from "@/content/learn-articles";
import { alternativesPages } from "@/content/learn-compare";
import { marketGroups, versusFacts } from "@/content/learn-market";
import { newsPage, newsRadar } from "@/content/news";
import { productFilms } from "@/content/product-films";

/* The nav and the footer read the pathname. */
vi.mock("next/navigation", () => ({ usePathname: () => "/learn" }));

import LearnRoute, { metadata } from "@/app/learn/page";

import { CoverArt } from "./learn-cards";

/**
 * `/learn`: the metadata, the hero and its search, then Start here, Find the right fix, Compare, Guides, Watch and
 * read, More from Zoorik and the case study, and the page's rules: only published articles, only the native tools'
 * comparisons (the market's are /compare's), no tool of the market named anywhere on the page, the Coming next flag,
 * and search, chips and the fix picker that work in the page and store nothing. Its sitemap entry is in
 * `src/app/sitemap.test.ts`, its page graph in `src/config/structured-data.test.ts`.
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

/** A card's foot: its date, or Start here's "Coming next" (its label, then the planned guide). */
const foot = (el: Element) => {
  const next = el.querySelector(".lv-next");
  if (!next) return text(el.querySelector(".lv-date"));
  return [text(next.querySelector("i")), text(next.lastChild as Element)].join(": ");
};

/** What a card prints: where it goes, its subject's tag, then the title, the line and its foot. */
const card = (el: Element) => [
  el.getAttribute("href"),
  text(el.querySelector(".lv-tag")),
  text(el.querySelector(".lv-cb b")),
  text(el.querySelector(".lv-cb small")),
  foot(el),
];

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
    /* The sitemap's date for the hub. */
    expect(learnPage.updated).toBe("Updated 19 October 2026");
  });
});

describe("/learn", () => {
  it("has one h1, the deck and the search in the hero, then the sections in the mock's order", () => {
    const root = page();
    expect(root.querySelectorAll("h1")).toHaveLength(1);
    expect(text(root.querySelector("header.hero h1"))).toBe("Learn cloud cost optimization");
    expect(text(root.querySelector(".doc-deck"))).toBe(
      "Guides, comparisons and what changed this week, for Kubernetes, block storage and the whole cloud bill on Azure and AWS.",
    );
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
    const published = new Set(articleOrder.map((id) => articles[id].route));
    const linked = [...root.querySelectorAll("a.lv-card")].map((a) => a.getAttribute("href")!);
    expect(new Set(linked)).toEqual(published);
    for (const a of root.querySelectorAll("a.lv-card")) {
      const article = articleOrder
        .map((id) => articles[id])
        .find((x) => x.route === a.getAttribute("href"))!;
      expect(text(a.querySelector(".lv-cb b"))).toBe(article.hero.title);
    }

    expect([...root.querySelectorAll("#start a.lv-card")].map(card)).toEqual([
      [
        routes.learnPoorArchitecture,
        "Cloud cost",
        "How Poor Infrastructure Architecture Quietly Increases Your Cloud Bill",
        articles["poor-architecture-cloud-bill"].card,
        "Coming next: How to reduce cloud costs in 2026 · soon",
      ],
      [
        routes.learnCoralAutoscalers,
        "Kubernetes",
        "Coral and the native Kubernetes autoscalers",
        articles["coral-and-native-autoscalers"].card,
        "Coming next: How to reduce Kubernetes cost: rebalance requests, then remove spare nodes · 8 Dec",
      ],
      [
        routes.learnShrinkAzureDisk,
        "Block storage",
        "Can you shrink an Azure managed disk?",
        "Not in place. The manual copy route, and how Amoeba rightsizes a pool autonomously, without any downtime.",
        "Coming next: Azure disk cost optimization: stop paying for empty disk space · 3 Nov",
      ],
    ]);
    expect([...root.querySelectorAll("#guides a.lv-card")].map(card)).toEqual([
      [
        routes.learnPoorArchitecture,
        "Cloud cost",
        "How Poor Infrastructure Architecture Quietly Increases Your Cloud Bill",
        articles["poor-architecture-cloud-bill"].card,
        "14 Oct · By Vineet",
      ],
      [
        routes.learnShrinkAzureDisk,
        "Block storage",
        "Can you shrink an Azure managed disk?",
        "Not in place. The manual copy route, and how Amoeba rightsizes a pool autonomously, without any downtime.",
        "9 Oct",
      ],
    ]);
    /* Compare holds the native tools' comparisons only, in one grid. */
    const compare = root.querySelectorAll("#compare .lv-grid3");
    expect(compare).toHaveLength(1);
    expect(
      [...compare[0]!.querySelectorAll("a.lv-card")].map((a) => [
        a.getAttribute("href"),
        text(a.querySelector(".lv-tag")),
        [...a.querySelectorAll(".lv-vs > b")].map(text),
        text(a.querySelector(".lv-cb b")),
        text(a.querySelector(".lv-date")),
      ]),
    ).toEqual([
      [
        routes.learnVpaVsHpa,
        "Kubernetes",
        ["VPA", "HPA"],
        "VPA vs HPA: rebalance first, then scale out",
        "9 Oct",
      ],
      [
        routes.learnCoralAutoscalers,
        "Kubernetes",
        ["Coral", "Native"],
        "Coral and the native Kubernetes autoscalers",
        "9 Oct",
      ],
    ]);
  });

  it("names no tool of the market, and links the comparisons only through /compare", () => {
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
    expect(words).toContain(routes.compare);
    const found = competitors.filter((name) =>
      new RegExp(`(?<![A-Za-z0-9])${literal(name)}(?![A-Za-z0-9])`).test(words),
    );
    expect(found).toEqual([]);
    /* Nor any page that names one: the versus and alternatives pages are linked from /compare only. */
    const hrefs = [...root.querySelectorAll("a")].map((a) => a.getAttribute("href") ?? "");
    expect(hrefs.filter((href) => href.startsWith(`${routes.compare}/`))).toEqual([]);
    expect(hrefs.filter((href) => alternativesPages.some((entry) => entry.route === href))).toEqual(
      [],
    );
    /* The page links /compare once, from More from Zoorik (the footer's Resources links it too). */
    expect(
      [...root.querySelectorAll("main a")].filter((a) => a.getAttribute("href") === routes.compare),
    ).toEqual([root.querySelector(`#more a.lv-mc[href="${routes.compare}"]`)]);
  });

  it("draws Start here's Coming next while the flag is on", () => {
    expect(learnComingNext).toBe(true);
    const root = page();
    const next = [...root.querySelectorAll("#start .lv-next")];
    expect(next).toHaveLength(3);
    expect(next.map((el) => text(el.querySelector("i")))).toEqual([
      "Coming next",
      "Coming next",
      "Coming next",
    ]);
    expect(next.map((el) => text(el.lastChild as Element))).toEqual(
      learnStart.map((entry) => `${entry.next.title} · ${entry.next.when}`),
    );
    expect(root.querySelector("#start .lv-date")).toBeNull();
  });

  it("leaves Start here's cards on their dates when the flag is off", async () => {
    vi.resetModules();
    vi.doMock("@/content/learn", async (original) => ({
      ...(await original<typeof import("@/content/learn")>()),
      learnComingNext: false,
    }));
    try {
      const { LearnHub: Hub } = await import("./learn-hub");
      const root = render(<Hub />).container;
      expect(root.querySelector(".lv-next")).toBeNull();
      expect([...root.querySelectorAll("#start .lv-date")].map(text)).toEqual([
        "14 Oct · By Vineet",
        "9 Oct",
        "9 Oct",
      ]);
    } finally {
      vi.doUnmock("@/content/learn");
      vi.resetModules();
    }
  });

  it("narrows the cards and their sections to the search, and says when nothing matches", async () => {
    const user = userEvent.setup();
    const root = page();
    expect(cards(root)).toHaveLength(7);
    expect(root.querySelector(".lv-empty")).toHaveAttribute("hidden");

    await user.type(search(root), "Karpenter");
    expect(cards(root)).toEqual([
      "Coral and the native Kubernetes autoscalers",
      "Coral and the native Kubernetes autoscalers",
    ]);
    /* Watch and read, More from Zoorik and the case study hold nothing findable: the search never hides them. */
    expect(sections(root)).toEqual(["start", "fix", "compare", "watch", "more", "proof", "assess"]);

    await user.clear(search(root));
    await user.type(search(root), "  DISK ");
    expect(cards(root)).toEqual([
      "Can you shrink an Azure managed disk?",
      "Can you shrink an Azure managed disk?",
    ]);
    expect(sections(root)).toEqual(["start", "fix", "guides", "watch", "more", "proof", "assess"]);

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
    expect(cards(root)).toHaveLength(7);
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
    expect(
      [...root.querySelectorAll(".lv-card")].filter(shown).map((a) => a.getAttribute("data-p")),
    ).toEqual(["storage", "storage"]);
    /* Compare's comparisons are all Kubernetes: the section hides, and the rest stay. */
    expect(sections(root)).toEqual(["start", "fix", "guides", "watch", "more", "proof", "assess"]);
    /* The open question was another subject's: the first storage question opens in its place. */
    expect(fixTabs(root).map((b) => [text(b), b.getAttribute("aria-selected")])).toEqual([
      ["Disks are bigger than their data", "true"],
    ]);
    expect(
      [...root.querySelectorAll(".fx-panel")].filter(shown).map((p) => text(p.querySelector("h3"))),
    ).toEqual(["Bring each disk back to the space its data needs."]);

    await user.click(chip(root, "All"));
    expect(cards(root)).toHaveLength(7);
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
        panel.querySelector("a.fx-read")!.getAttribute("href"),
        text(panel.querySelector("a.fx-read")),
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
    expect(learnFixes.map((entry) => entry.read.href)).toEqual([
      routes.learnCoralAutoscalers,
      routes.learnVpaVsHpa,
      routes.learnCoralAutoscalers,
      routes.learnShrinkAzureDisk,
      routes.assessment,
      routes.learnPoorArchitecture,
    ]);
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
      routes.compare,
      routes.community,
    ]);
    /* Zoorik News: the page's name, and this week's first Radar headline, as the mock picks it. */
    expect(learnMore[0]!.title).toBe(newsPage.hero.title);
    expect(learnMore[0]!.extra).toBe(`This week: ${newsRadar.streams[0].items[0]!.title}`);
    /* The tools: the map's count and its groups, in its order, each by its short name. */
    const count = marketGroups.reduce((sum, group) => sum + group.tools.length, 0);
    expect(learnMore[1]!.line).toBe(
      `${count} tools by name in four groups: what each does, how it acts and where it runs.`,
    );
    expect(marketGroups.map((group) => learnMarketGroupNames[group.id])).toEqual([
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
    expect(text(proof.querySelector(".lv-pk"))).toBe("Validation Lab · Coral on AKS");
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
