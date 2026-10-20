import { act, fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const pathname = vi.hoisted(() => ({ current: "/coral" }));
vi.mock("next/navigation", () => ({ usePathname: () => pathname.current }));

import { amoebaDocs, amoebaOnePager, learnPath, menuLabelHref, navMenus } from "@/config/site";
import { learnArticles } from "@/content/learn/published";

import { SiteNav } from "./site-nav";

/**
 * The header: what it draws, what each page marks as current, where each
 * menu's word leads, and every way its four menus and its drawer open and
 * close. Each of these works in a browser and none of them shows in a
 * screenshot, so a regression would look like working software until somebody
 * pressed Escape.
 */

const HOVER_QUERY = "(hover:hover) and (pointer:fine)";

/** A `matchMedia` whose answers and `change` listeners the test controls. */
function stubMatchMedia(matching: Set<string>) {
  const listeners = new Map<string, Set<(e: MediaQueryListEvent) => void>>();
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query: string) =>
      ({
        get matches() {
          return matching.has(query);
        },
        media: query,
        onchange: null,
        addEventListener: (_: string, fn: (e: MediaQueryListEvent) => void) => {
          if (!listeners.has(query)) listeners.set(query, new Set());
          listeners.get(query)!.add(fn);
        },
        removeEventListener: (_: string, fn: (e: MediaQueryListEvent) => void) => {
          listeners.get(query)?.delete(fn);
        },
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }) as unknown as MediaQueryList,
  );
  return (query: string, matches: boolean) => {
    for (const fn of listeners.get(query) ?? []) {
      fn({ matches, media: query } as MediaQueryListEvent);
    }
  };
}

let media: Set<string>;
let fireMedia: ReturnType<typeof stubMatchMedia>;
/* jsdom does not navigate; a followed link would only print that it cannot. */
const stayOnPage = (e: Event) => e.preventDefault();

beforeEach(() => {
  pathname.current = "/coral";
  media = new Set();
  fireMedia = stubMatchMedia(media);
  document.addEventListener("click", stayOnPage);
});

afterEach(() => {
  document.removeEventListener("click", stayOnPage);
  /* What /assessment's first-paint script and switch set (`first-paint.ts`). */
  document.documentElement.removeAttribute("data-ap");
  vi.useRealTimers();
  vi.restoreAllMocks();
});

const text = (el: Element | null) => (el?.textContent ?? "").replace(/\s+/g, " ").trim();

/** A menu's word: its link where the word is one (Assessment, FAQ, Docs), else its button. */
const labelOf = (dd: Element) => text(dd.querySelector(".nv-lbl, .nv-btn"));

function renderNav(path = "/coral") {
  pathname.current = path;
  const view = render(<SiteNav />);
  const dd = (label: string) =>
    [...view.container.querySelectorAll<HTMLElement>(".nv-dd")].find(
      (el) => labelOf(el) === label,
    )!;
  /** The menu's button: the chevron, where the word is a link. */
  const button = (label: string) => dd(label).querySelector<HTMLButtonElement>("button.nv-btn")!;
  const word = (label: string) => dd(label).querySelector<HTMLAnchorElement>("a.nv-lbl")!;
  const card = (label: string) => dd(label).querySelector<HTMLElement>(".nv-menu")!;
  return { ...view, dd, button, word, card };
}

describe("the bar", () => {
  it("runs Coral, Amoeba, the four menus, Login, Book a demo, then the toggle", () => {
    const { container } = renderNav("/");
    const items = [...container.querySelector(".nav-links")!.children].map((el) =>
      el.matches(".nv-dd") ? `${labelOf(el)} ▾` : text(el) || el.className,
    );
    expect(items).toEqual([
      "Coral",
      "Amoeba",
      "Assessment ▾",
      "Product guide ▾",
      "FAQ ▾",
      "Docs ▾",
      "Login",
      "Book a demo (opens in a new tab)",
      "nav-toggle",
    ]);
  });

  it("draws each product with its mark and keeps the names out of translation", () => {
    const { container } = renderNav("/");
    const products = [...container.querySelectorAll(".nav-links > a.nav-prod")];
    expect(products.map((a) => [a.textContent, a.getAttribute("translate")])).toEqual([
      ["Coral", "no"],
      ["Amoeba", "no"],
    ]);
    for (const a of products) expect(a.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("keeps Login in the bar as the link the CSS shows down to 1001px", () => {
    const login = renderNav("/").container.querySelector(".nav-links > a.nav-opt")!;
    expect(login).toHaveAttribute("href", "/login");
    expect(login).toHaveTextContent("Login");
  });

  it("sends Book a demo to the calendar in a new tab, said aloud and with no arrow", () => {
    const demo = renderNav("/").container.querySelector<HTMLAnchorElement>(".nav-links > a.btn")!;
    expect(demo).toHaveClass("btn-solid");
    expect(demo).toHaveAttribute("href", "https://cal.com/zoorik/talk");
    expect(demo).toHaveAttribute("target", "_blank");
    expect(demo).toHaveAttribute("rel", "noopener noreferrer");
    expect(demo.querySelector(".sr-only")).toHaveTextContent("(opens in a new tab)");
    expect(demo.querySelector("svg")).toBeNull();
  });

  it("names the wordmark for where it goes: the top at home, the home page elsewhere", () => {
    const home = renderNav("/").container.querySelector(".brand")!;
    expect(home).toHaveAttribute("href", "#top");
    expect(home).toHaveAttribute("aria-label", "Zoorik, back to top");
    const away = renderNav("/docs").container.querySelector(".brand")!;
    expect(away).toHaveAttribute("href", "/");
    expect(away).toHaveAttribute("aria-label", "Zoorik home");
  });

  it("renders every menu closed, each button controlling its own card", () => {
    const { container } = renderNav("/");
    const pairs = [...container.querySelectorAll(".nv-dd")].map((dd) => {
      const btn = dd.querySelector("button.nv-btn")!;
      const card = dd.querySelector<HTMLElement>(".nv-menu")!;
      expect(btn).toHaveAttribute("type", "button");
      expect(btn).toHaveAttribute("aria-expanded", "false");
      expect(btn.hasAttribute("aria-current")).toBe(false);
      expect(card.hidden).toBe(true);
      return [btn.getAttribute("aria-controls"), card.id];
    });
    expect(pairs).toEqual([
      ["nvm-assessment", "nvm-assessment"],
      ["nvm-guide", "nvm-guide"],
      ["nvm-faq", "nvm-faq"],
      ["nvm-docs", "nvm-docs"],
    ]);
    /* A disclosure, not an application menu. */
    expect(container.querySelector('[role="menu"], [role="menuitem"]')).toBeNull();
  });
});

/**
 * Assessment, FAQ and Docs: the word is a link to Coral's page of that kind,
 * the default, on every page, and the chevron after it opens the menu, whose
 * rows lead to each product's. Product guide stays one button.
 */
describe("the menus' words", () => {
  it("makes Assessment, FAQ and Docs a link and a chevron, and leaves Product guide one button", () => {
    const { container } = renderNav("/");
    const shapes = [...container.querySelectorAll(".nv-dd")].map((dd) => [
      labelOf(dd),
      [...dd.children].map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].join(".")}`),
    ]);
    expect(shapes).toEqual([
      ["Assessment", ["a.nv-lbl", "button.nv-btn.nv-tog", "div.nv-menu"]],
      ["Product guide", ["button.nv-btn", "div.nv-menu"]],
      ["FAQ", ["a.nv-lbl", "button.nv-btn.nv-tog", "div.nv-menu"]],
      ["Docs", ["a.nv-lbl", "button.nv-btn.nv-tog", "div.nv-menu"]],
    ]);
    for (const tog of container.querySelectorAll<HTMLButtonElement>(".nv-tog")) {
      const label = labelOf(tog.closest(".nv-dd")!);
      /* The chevron has no text of its own: its name says which menu it opens. */
      expect(tog).toHaveAccessibleName(`${label} menu`);
      expect(text(tog)).toBe("");
      expect(tog).toHaveAttribute("type", "button");
      expect(tog.querySelector("svg.nv-chev")).toHaveAttribute("aria-hidden", "true");
    }
    expect(container.querySelector(".nv-dd:not(.nv-split) a.nv-lbl")).toBeNull();
  });

  /* Amoeba's own pages included: the rule has no exception. */
  it.each([
    "/",
    "/coral",
    "/coral/guide",
    "/coral/faq",
    "/amoeba",
    "/amoeba/guide",
    "/amoeba/faq",
    "/assessment",
    "/docs",
    "/learn",
    /* An article, whichever the index lists first. */
    learnPath(learnArticles[0]!.slug),
    "/about",
    "/privacy",
  ])("on %s, lead to Coral's pages", (path) => {
    const { container } = renderNav(path);
    expect(
      [...container.querySelectorAll("a.nv-lbl")].map((a) => [text(a), a.getAttribute("href")]),
    ).toEqual([
      ["Assessment", "/assessment?p=coral"],
      ["FAQ", "/coral/faq"],
      ["Docs", "/docs#coral"],
    ]);
  });

  it("lead to each menu's first row, Coral's, which no switch holds back", () => {
    for (const menu of navMenus.filter((entry) => entry.labelLink)) {
      expect(menu.rows[0].product, menu.key).toBe("coral");
      expect(menuLabelHref(menu), menu.key).toBe(menu.rows[0].href);
    }
  });

  it("carry the menu's current mark on both halves, and aria-current only on this very page", () => {
    /* /learn is in Docs, but `/docs#coral` is another page. */
    const learn = renderNav("/learn");
    expect(learn.word("Docs")).toHaveClass("is-cur");
    expect(learn.button("Docs")).toHaveClass("is-cur");
    expect(learn.word("Docs")).not.toHaveAttribute("aria-current");
    learn.unmount();
    /* /docs is: the word is a jump to its own `#coral` group. */
    const docs = renderNav("/docs");
    expect(docs.word("Docs")).toHaveAttribute("aria-current", "page");
    expect(docs.button("Docs")).not.toHaveAttribute("aria-current");
    docs.unmount();
    /* On Amoeba's FAQ the word leads away, to Coral's. */
    const faq = renderNav("/amoeba/faq");
    expect(faq.word("FAQ")).toHaveAttribute("href", "/coral/faq");
    expect(faq.word("FAQ")).not.toHaveAttribute("aria-current");
  });

  it("follow on a click without opening their menu", async () => {
    const { word, button } = renderNav("/");
    await userEvent.click(word("FAQ"));
    expect(button("FAQ")).toHaveAttribute("aria-expanded", "false");
  });
});

describe("the menus' rows", () => {
  const rows = (card: HTMLElement) =>
    [...card.querySelectorAll<HTMLAnchorElement>("a.nv-item")].map((a) => [
      text(a.querySelector("b")),
      text(a.querySelector("small")),
      a.getAttribute("href"),
    ]);

  it("list the products with the site's exact lines; Docs adds All docs, then Zoorik Learn", () => {
    const { card } = renderNav("/");
    /* The assessment serves both products whatever the documents' switches say. */
    expect(rows(card("Assessment"))).toEqual([
      ["Coral", "Kubernetes cost optimization on AKS and EKS", "/assessment?p=coral"],
      ["Amoeba", "Block storage cost optimization on Azure and AWS", "/assessment?p=amoeba"],
    ]);
    /* Amoeba's rows appear the day `amoebaDocs` publishes its guide and FAQ.
       `text()` folds the lines' no-break spaces; the menu data pins them below. */
    const amoeba = (path: string) =>
      amoebaDocs ? [["Amoeba", "Block storage cost optimization on Azure and AWS", path]] : [];
    expect(rows(card("Product guide"))).toEqual([
      ["Coral", "Kubernetes cost optimization on AKS and EKS", "/coral/guide"],
      ...amoeba("/amoeba/guide"),
    ]);
    expect(rows(card("FAQ"))).toEqual([
      ["Coral", "Kubernetes cost optimization on AKS and EKS", "/coral/faq"],
      ...amoeba("/amoeba/faq"),
    ]);
    /* No Amoeba row while all of Amoeba's documents are held: the hub has no
       `#amoeba` group for it to land on. */
    expect(rows(card("Docs"))).toEqual([
      ["Coral", "Guide, FAQ and one-pager", "/docs#coral"],
      ...(amoebaDocs || amoebaOnePager
        ? [["Amoeba", "Guide, FAQ and one-pager", "/docs#amoeba"]]
        : []),
      ["All docs", "", "/docs"],
      ["Zoorik Learn", "Articles on Kubernetes and block storage cost", "/learn"],
      ["Open source", "What you can read, run and contribute to", "/open-source"],
    ]);
  });

  it("set the Learn row after All docs, under its own hairline, with the book in the marks' slot", () => {
    /* The Learn row, after All docs: a 20px accent book where the products
       draw their marks. */
    const { card } = renderNav("/");
    const docs = card("Docs");
    const learn = docs.querySelector<HTMLAnchorElement>("a.nv-item.nv-learn")!;
    /* Open source follows it, the last row, under no hairline of its own. */
    expect(learn.nextElementSibling).toBe(docs.lastElementChild);
    expect(learn.nextElementSibling).toHaveAttribute("href", "/open-source");
    expect(learn.previousElementSibling).toHaveClass("nv-foot");
    const book = learn.firstElementChild!;
    expect(book.tagName.toLowerCase()).toBe("svg");
    expect(book).toHaveClass("nv-mk", "nv-ic");
    expect(book).toHaveAttribute("aria-hidden", "true");
    expect(book).toHaveAttribute("stroke-width", "1.7");
    /* Only Docs has it. */
    expect(card("Product guide").querySelector(".nv-learn")).toBeNull();
    expect(card("FAQ").querySelector(".nv-learn")).toBeNull();
  });

  it.skipIf(amoebaDocs)(
    "leave Amoeba's guide and FAQ out of the menus and the drawer while they are held",
    () => {
      /* The held state: `amoebaDocs` is off. */
      const { container } = renderNav("/");
      const hrefs = [...container.querySelectorAll("a")].map((a) => a.getAttribute("href"));
      expect(hrefs).not.toContain("/amoeba/guide");
      expect(hrefs).not.toContain("/amoeba/faq");
      const groups = [...container.querySelectorAll(".nd-grp")].map((grp) => [
        text(grp.querySelector(".nd-h")),
        [...grp.querySelectorAll(".nd-row a")].map((a) => a.textContent),
      ]);
      expect(groups).toEqual([
        ["Assessment", ["Coral", "Amoeba"]],
        ["Product guide", ["Coral"]],
        ["FAQ", ["Coral"]],
        ["Docs", ["Coral", "All", "Zoorik Learn"]],
      ]);
    },
  );

  it("would lead to the hub's Amoeba group the day any Amoeba document is released", () => {
    /* The Docs menu's Amoeba row and drawer chip follow the hub: there is an
       `#amoeba` group to land on exactly when one of the two holds is lifted. */
    const docs = navMenus.find((menu) => menu.key === "docs")!;
    expect(docs.rows.map((row) => row.href)).toEqual(
      amoebaDocs || amoebaOnePager ? ["/docs#coral", "/docs#amoeba"] : ["/docs#coral"],
    );
  });

  it("would list Amoeba's guide and FAQ with Block storage's line the day they are released", () => {
    /* The rows the flag holds back are the config's, not the component's: one
       line turns them on, in the menus and the drawer at once. */
    const amoebaRows = navMenus
      .filter((menu) => menu.key === "guide" || menu.key === "faq")
      .flatMap((menu) => menu.rows.filter((row) => row.product === "amoeba"));
    expect(amoebaRows).toEqual(
      amoebaDocs
        ? [
            {
              product: "amoeba",
              href: "/amoeba/guide",
              line: "Block storage cost optimization on Azure\u00a0and\u00a0AWS",
            },
            {
              product: "amoeba",
              href: "/amoeba/faq",
              line: "Block storage cost optimization on Azure\u00a0and\u00a0AWS",
            },
          ]
        : [],
    );
  });

  it("draw a 20px-class mark per product row and an arrow on the foot row, all hidden", () => {
    const { card } = renderNav("/");
    const docs = card("Docs");
    /* One per product row, the Learn row's book and the Open source row's brackets. */
    expect(docs.querySelectorAll("svg.nv-mk")).toHaveLength(
      navMenus.find((menu) => menu.key === "docs")!.rows.length + 2,
    );
    expect(docs.querySelector("a.nv-foot svg.nv-go")).not.toBeNull();
    for (const svg of docs.querySelectorAll("svg")) {
      expect(svg).toHaveAttribute("aria-hidden", "true");
    }
    for (const name of docs.querySelectorAll("b > span")) {
      expect(name).toHaveAttribute("translate", "no");
    }
  });
});

/**
 * What each page marks as current: the bar link, the menu's `.is-cur`, the
 * row inside the menu and its drawer chip, the drawer row, and the menu word
 * that is this very page.
 */
describe("the current page", () => {
  function stateOf(path: string) {
    const { container } = renderNav(path);
    const one = (selector: string) => {
      const found = [...container.querySelectorAll(selector)];
      expect(found.length, `${path} ${selector}`).toBeLessThanOrEqual(1);
      return found[0];
    };
    const bar = one('.nav-links > a[aria-current="page"]');
    const button = one(".nv-btn.is-cur");
    const row = one('.nv-menu a[aria-current="page"]');
    const chip = one('.nd-row a[aria-current="page"]');
    const drawerRow = one('.nav-drop .wrap > a[aria-current="page"]');
    const word = one('a.nv-lbl[aria-current="page"]');
    /* A word and its chevron are one control: the mark is on both or neither. */
    for (const dd of container.querySelectorAll(".nv-split")) {
      expect(dd.querySelector(".nv-lbl")!.classList.contains("is-cur"), path).toBe(
        dd.querySelector(".nv-tog")!.classList.contains("is-cur"),
      );
    }
    const menuOf = (el: Element | undefined) => {
      if (!el) return "";
      const dd = el.closest(".nv-dd");
      return dd ? labelOf(dd) : text(el.closest(".nd-grp")!.querySelector(".nd-h"));
    };
    return [
      text(bar ?? null),
      menuOf(button),
      row ? `${menuOf(row)} › ${text(row.querySelector("b"))}` : "",
      chip ? `${menuOf(chip)} › ${text(chip)}` : "",
      text(drawerRow ?? null),
      text(word ?? null),
    ];
  }

  it.each([
    ["/", "", "", "", "", "", ""],
    ["/coral", "Coral", "", "", "", "Coral", ""],
    ["/amoeba", "Amoeba", "", "", "", "Amoeba", ""],
    /* As prerendered, before the page has read its product from the address:
       the menu is current, none of its rows, and not the word, which names one. */
    ["/assessment", "", "Assessment", "", "", "", ""],
    ["/coral/guide", "", "Product guide", "Product guide › Coral", "Product guide › Coral", "", ""],
    ["/coral/faq", "", "FAQ", "FAQ › Coral", "FAQ › Coral", "", "FAQ"],
    ["/docs", "", "Docs", "Docs › All docs", "Docs › All", "", "Docs"],
    /* The Learn hub marks Docs and its own row; every article marks Docs alone. */
    ["/learn", "", "Docs", "Docs › Zoorik Learn", "Docs › Zoorik Learn", "", ""],
    ...learnArticles.map((article): string[] => [
      learnPath(article.slug),
      "",
      "Docs",
      "",
      "",
      "",
      "",
    ]),
    ["/about", "", "", "", "", "", ""],
    ["/security", "", "", "", "", "", ""],
    ["/privacy", "", "", "", "", "", ""],
    ["/terms", "", "", "", "", "", ""],
    ["/docs/", "", "Docs", "Docs › All docs", "Docs › All", "", "Docs"],
  ])("on %s", (path, bar, button, row, chip, drawerRow, word) => {
    expect(stateOf(path)).toEqual([bar, button, row, chip, drawerRow, word]);
  });

  it.each([
    ["/amoeba/guide", "Product guide"],
    ["/amoeba/faq", "FAQ"],
  ])("on %s: its menu is current, and its own row once it is released", (path, menu) => {
    /* While `amoebaDocs` is off the page 404s and has no row to mark; its menu
       still reads right the day it is released. The word is Coral's page. */
    const own = amoebaDocs ? `${menu} › Amoeba` : "";
    expect(stateOf(path)).toEqual(["", menu, own, own, "", ""]);
  });

  it.each([
    ["coral", "Assessment › Coral", "Assessment"],
    ["amoeba", "Assessment › Amoeba", ""],
  ])(
    "on /assessment on %s: that product's row and chip, and the word only when it is this page",
    (product, own, word) => {
      /* Set by the page's first-paint script before the bar hydrates. */
      document.documentElement.setAttribute("data-ap", product);
      expect(stateOf("/assessment")).toEqual(["", "Assessment", own, own, "", word]);
    },
  );

  it("follows /assessment's switch to the other product", async () => {
    document.documentElement.setAttribute("data-ap", "coral");
    const { container } = renderNav("/assessment");
    const marked = () =>
      [...container.querySelectorAll('[aria-current="page"]')].map(
        (a) => `${a.className || "chip"} ${a.getAttribute("href")}`,
      );
    expect(marked()).toEqual([
      "nv-lbl is-cur /assessment?p=coral",
      "nv-item /assessment?p=coral",
      "chip /assessment?p=coral",
    ]);
    await act(async () => {
      document.documentElement.setAttribute("data-ap", "amoeba");
    });
    expect(marked()).toEqual(["nv-item /assessment?p=amoeba", "chip /assessment?p=amoeba"]);
  });

  it("marks no product on another page whatever the attribute says", () => {
    document.documentElement.setAttribute("data-ap", "amoeba");
    expect(stateOf("/coral")).toEqual(["Coral", "", "", "", "Coral", ""]);
  });

  it("never marks a menu button with aria-current: it is not a page", () => {
    for (const path of ["/assessment", "/coral/guide", "/coral/faq", "/docs"]) {
      const { container } = renderNav(path);
      expect(container.querySelector(".nv-btn[aria-current]"), path).toBeNull();
    }
  });
});

describe("a menu", () => {
  afterEach(() => {
    /* The own property a test set over the prototype's getter. */
    Reflect.deleteProperty(document.documentElement, "clientWidth");
  });

  it("opens and closes on a click, one at a time", async () => {
    const { button, card } = renderNav();

    await userEvent.click(button("Docs"));
    expect(button("Docs")).toHaveAttribute("aria-expanded", "true");
    expect(card("Docs").hidden).toBe(false);

    await userEvent.click(button("FAQ"));
    expect(button("FAQ")).toHaveAttribute("aria-expanded", "true");
    expect(button("Docs")).toHaveAttribute("aria-expanded", "false");
    expect(card("Docs").hidden).toBe(true);

    await userEvent.click(button("FAQ"));
    expect(button("FAQ")).toHaveAttribute("aria-expanded", "false");
    expect(card("FAQ").hidden).toBe(true);
  });

  it("opens on Enter without moving focus, and closes on Escape with focus back on its button", async () => {
    const { button, card } = renderNav();
    button("Product guide").focus();

    await userEvent.keyboard("{Enter}");
    expect(button("Product guide")).toHaveAttribute("aria-expanded", "true");
    expect(button("Product guide")).toHaveFocus();

    await userEvent.tab();
    expect(card("Product guide").querySelector("a")).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    expect(button("Product guide")).toHaveAttribute("aria-expanded", "false");
    expect(button("Product guide")).toHaveFocus();
  });

  it("puts its word, then its chevron, then its rows in the Tab order, and Escape back on the chevron", async () => {
    const { word, button, card } = renderNav("/");
    word("Assessment").focus();

    await userEvent.tab();
    expect(button("Assessment")).toHaveFocus();
    expect(button("Assessment")).toHaveAttribute("aria-expanded", "false");
    await userEvent.keyboard("{Enter}");
    expect(button("Assessment")).toHaveAttribute("aria-expanded", "true");
    expect(button("Assessment")).toHaveFocus();

    const rows = [...card("Assessment").querySelectorAll("a")];
    expect(rows.map((a) => a.getAttribute("href"))).toEqual([
      "/assessment?p=coral",
      "/assessment?p=amoeba",
    ]);
    await userEvent.tab();
    expect(rows[0]).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    expect(button("Assessment")).toHaveAttribute("aria-expanded", "false");
    expect(button("Assessment")).toHaveFocus();
  });

  it("passes from a closed menu's chevron to the next word, past its rows", async () => {
    const { word, button } = renderNav("/");
    word("FAQ").focus();
    await userEvent.tab();
    expect(button("FAQ")).toHaveFocus();
    await userEvent.tab();
    expect(word("Docs")).toHaveFocus();
  });

  it("stays open as Shift+Tab goes from its chevron back to its word", async () => {
    const { word, button } = renderNav();
    button("FAQ").focus();
    await userEvent.keyboard("{Enter}");
    await userEvent.tab({ shift: true });
    expect(word("FAQ")).toHaveFocus();
    expect(button("FAQ")).toHaveAttribute("aria-expanded", "true");
    /* Escape from the word hands focus to the chevron, the menu's button. */
    await userEvent.keyboard("{Escape}");
    expect(button("FAQ")).toHaveAttribute("aria-expanded", "false");
    expect(button("FAQ")).toHaveFocus();
  });

  it("closes when its word is followed", async () => {
    const { word, button, card } = renderNav("/docs");
    await userEvent.click(button("Docs"));
    expect(card("Docs").hidden).toBe(false);
    await userEvent.click(word("Docs"));
    expect(button("Docs")).toHaveAttribute("aria-expanded", "false");
    expect(card("Docs").hidden).toBe(true);
  });

  it("lets Tab walk its rows, and closes as focus moves past the last one", async () => {
    const { button, card, container } = renderNav();
    button("Docs").focus();
    await userEvent.keyboard("{Enter}");

    const rows = [...card("Docs").querySelectorAll("a")];
    for (const row of rows) {
      await userEvent.tab();
      expect(row).toHaveFocus();
    }
    await userEvent.tab();
    expect(button("Docs")).toHaveAttribute("aria-expanded", "false");
    expect(container.querySelector(".nav-links > a.nav-opt")).toHaveFocus();
  });

  it("stays open as Shift+Tab goes back from its first row to its button", async () => {
    const { button } = renderNav();
    button("Docs").focus();
    await userEvent.keyboard("{Enter}");
    await userEvent.tab();
    await userEvent.tab({ shift: true });
    expect(button("Docs")).toHaveFocus();
    expect(button("Docs")).toHaveAttribute("aria-expanded", "true");
  });

  it("does nothing with the arrow keys", async () => {
    const { button } = renderNav();
    button("Docs").focus();
    await userEvent.keyboard("{Enter}{ArrowDown}");
    expect(button("Docs")).toHaveFocus();
  });

  it("closes on a click outside it, and not on a click inside it", async () => {
    const { button, card } = renderNav();
    await userEvent.click(button("Docs"));

    await userEvent.click(card("Docs"));
    expect(button("Docs")).toHaveAttribute("aria-expanded", "true");

    await userEvent.click(document.body);
    expect(button("Docs")).toHaveAttribute("aria-expanded", "false");
  });

  it("closes when one of its rows is followed, the page's own row included", async () => {
    const { button, card } = renderNav("/coral/guide");
    await userEvent.click(button("Product guide"));
    const own = card("Product guide").querySelector<HTMLAnchorElement>('a[aria-current="page"]')!;
    expect(own).toHaveAttribute("href", "/coral/guide");

    await userEvent.click(own);
    expect(button("Product guide")).toHaveAttribute("aria-expanded", "false");
    expect(card("Product guide").hidden).toBe(true);
  });

  it("closes when the window is resized", async () => {
    const { button } = renderNav();
    await userEvent.click(button("FAQ"));
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });
    expect(button("FAQ")).toHaveAttribute("aria-expanded", "false");
  });

  it("is shifted left by its overflow when it would run past the right edge", async () => {
    const { button, card } = renderNav();
    Object.defineProperty(document.documentElement, "clientWidth", {
      configurable: true,
      value: 1001,
    });
    vi.spyOn(card("Docs"), "getBoundingClientRect").mockReturnValue({ right: 1000 } as DOMRect);

    await userEvent.click(button("Docs"));
    /* 1000 − (1001 − 16) = 15px over. */
    expect(card("Docs").style.marginLeft).toBe("-15px");
  });

  it("is left where it is when it fits", async () => {
    const { button, card } = renderNav();
    Object.defineProperty(document.documentElement, "clientWidth", {
      configurable: true,
      value: 1001,
    });
    card("Docs").style.marginLeft = "-40px";
    vi.spyOn(card("Docs"), "getBoundingClientRect").mockReturnValue({ right: 983 } as DOMRect);

    await userEvent.click(button("Docs"));
    expect(card("Docs").style.marginLeft).toBe("");
  });
});

describe("a menu under a mouse", () => {
  beforeEach(() => {
    media.add(HOVER_QUERY);
    vi.useFakeTimers();
  });

  it("opens on hover over its word, which stays a link", () => {
    const { dd, button, word } = renderNav();
    fireEvent.mouseEnter(dd("Assessment"));
    expect(button("Assessment")).toHaveAttribute("aria-expanded", "true");
    expect(word("Assessment")).toHaveAttribute("href", "/assessment?p=coral");
  });

  it("opens on hover and closes 180ms after the pointer leaves", () => {
    const { dd, button } = renderNav();
    fireEvent.mouseEnter(dd("FAQ"));
    expect(button("FAQ")).toHaveAttribute("aria-expanded", "true");

    fireEvent.mouseLeave(dd("FAQ"));
    act(() => vi.advanceTimersByTime(100));
    expect(button("FAQ")).toHaveAttribute("aria-expanded", "true");
    act(() => vi.advanceTimersByTime(150));
    expect(button("FAQ")).toHaveAttribute("aria-expanded", "false");
  });

  it("stays open when the pointer comes back in time", () => {
    const { dd, button } = renderNav();
    fireEvent.mouseEnter(dd("FAQ"));
    fireEvent.mouseLeave(dd("FAQ"));
    act(() => vi.advanceTimersByTime(100));
    fireEvent.mouseEnter(dd("FAQ"));
    act(() => vi.advanceTimersByTime(500));
    expect(button("FAQ")).toHaveAttribute("aria-expanded", "true");
  });

  it("keeps a hover-opened menu on a click that follows at once, and closes on a later one", () => {
    const { dd, button } = renderNav();
    fireEvent.mouseEnter(dd("Docs"));
    fireEvent.click(button("Docs"));
    expect(button("Docs")).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(button("Docs"));
    expect(button("Docs")).toHaveAttribute("aria-expanded", "false");

    fireEvent.mouseEnter(dd("FAQ"));
    act(() => vi.advanceTimersByTime(450));
    fireEvent.click(button("FAQ"));
    expect(button("FAQ")).toHaveAttribute("aria-expanded", "false");
  });

  it("gives each hover-open its own 400ms, so an earlier one cannot cut it short", () => {
    const { dd, button } = renderNav();
    fireEvent.mouseEnter(dd("Docs"));
    fireEvent.mouseLeave(dd("Docs"));
    act(() => vi.advanceTimersByTime(300));
    expect(button("Docs")).toHaveAttribute("aria-expanded", "false");

    /* Back in at 300ms; the first hover's window would have ended at 400. */
    fireEvent.mouseEnter(dd("Docs"));
    act(() => vi.advanceTimersByTime(150));
    fireEvent.click(button("Docs"));
    expect(button("Docs")).toHaveAttribute("aria-expanded", "true");
  });

  it("closes a hover-opened menu on Escape wherever focus is, and leaves focus there", () => {
    /* WCAG 1.4.13: content a hover shows can be put away without moving the
       pointer. The mock's script heard Escape only inside the menu. */
    const { dd, button, container } = renderNav();
    const login = container.querySelector<HTMLAnchorElement>(".nav-links > a.nav-opt")!;
    login.focus();
    fireEvent.mouseEnter(dd("Assessment"));
    expect(button("Assessment")).toHaveAttribute("aria-expanded", "true");
    fireEvent.keyDown(login, { key: "Escape" });
    expect(button("Assessment")).toHaveAttribute("aria-expanded", "false");
    expect(login).toHaveFocus();

    fireEvent.mouseEnter(dd("Docs"));
    fireEvent.keyDown(document.body, { key: "Escape" });
    expect(button("Docs")).toHaveAttribute("aria-expanded", "false");
  });

  it("leaves a hover-opened menu alone on any other key", () => {
    const { dd, button } = renderNav();
    fireEvent.mouseEnter(dd("FAQ"));
    fireEvent.keyDown(document.body, { key: "Tab" });
    expect(button("FAQ")).toHaveAttribute("aria-expanded", "true");
  });

  it("does not open on hover where the pointer cannot hover", () => {
    media.delete(HOVER_QUERY);
    const { dd, button } = renderNav();
    fireEvent.mouseEnter(dd("FAQ"));
    expect(button("FAQ")).toHaveAttribute("aria-expanded", "false");
  });
});

async function openDrawer(path = "/coral") {
  const view = renderNav(path);
  const toggle = view.getByRole("button", { name: "Open menu" });
  await userEvent.click(toggle);
  expect(toggle).toHaveAttribute("aria-expanded", "true");
  return { ...view, toggle, drawer: view.container.querySelector<HTMLElement>(".nav-drop")! };
}

describe("the drawer", () => {
  it("lists the two product links, one group per menu, then Login: seven in all", () => {
    const { container } = renderNav("/");
    const drawer = container.querySelector(".nav-drop > .wrap")!;
    const items = [...drawer.children].map((el) =>
      el.matches(".nd-grp")
        ? `${text(el.querySelector("p.nd-h"))}: ${[...el.querySelectorAll(".nd-row a")]
            .map((a) => a.textContent)
            .join(", ")}`
        : text(el),
    );
    expect(items).toEqual([
      "Coral",
      "Amoeba",
      /* A group like the menus'. */
      "Assessment: Coral, Amoeba",
      amoebaDocs ? "Product guide: Coral, Amoeba" : "Product guide: Coral",
      amoebaDocs ? "FAQ: Coral, Amoeba" : "FAQ: Coral",
      amoebaDocs || amoebaOnePager
        ? "Docs: Coral, Amoeba, All, Zoorik Learn, Open source"
        : "Docs: Coral, All, Zoorik Learn, Open source",
      "Login",
    ]);
    /* Group labels are labels, not headings. */
    expect(drawer.querySelector("h2, h3, h4")).toBeNull();
    /* A product chip keeps its name out of translation on the chip; "All" is a word, and "Zoorik Learn" keeps
       only its "Zoorik" out, in a span of its own. */
    for (const chip of drawer.querySelectorAll(".nd-row a")) {
      expect(chip.getAttribute("translate"), text(chip)).toBe(
        chip.querySelector("svg") ? "no" : null,
      );
    }
  });

  it("is controlled by the toggle, which says what pressing it will do", async () => {
    const { toggle, drawer } = await openDrawer();
    expect(toggle).toHaveAttribute("aria-controls", drawer.id);
    expect(toggle).toHaveAccessibleName("Close menu");
    expect(drawer).toHaveClass("open");
    /* Both icons are drawn; the CSS shows the X while it is open. */
    expect([...toggle.querySelectorAll("path")].map((p) => p.getAttribute("class"))).toEqual([
      "nt-open",
      "nt-close",
    ]);
  });

  it("closes on Escape and hands focus back to the toggle", async () => {
    const { toggle, drawer } = await openDrawer();
    drawer.querySelector("a")!.focus();

    await userEvent.keyboard("{Escape}");

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveAccessibleName("Open menu");
    expect(drawer).not.toHaveClass("open");
    expect(toggle).toHaveFocus();
  });

  it("closes when one of its links is followed, a chip included", async () => {
    const { toggle, drawer } = await openDrawer();
    await userEvent.click(drawer.querySelector(".nd-row a")!);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(drawer).not.toHaveClass("open");
  });

  it("closes on a tap outside the bar", async () => {
    const { toggle, drawer } = await openDrawer();

    await userEvent.click(document.body);

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(drawer).not.toHaveClass("open");
  });

  it("stays open on a tap inside the bar", async () => {
    const { toggle, container } = await openDrawer();

    await userEvent.click(container.querySelector(".nav-in")!);

    expect(toggle).toHaveAttribute("aria-expanded", "true");
  });

  it("closes when the bar widens past the breakpoint, where the CSS hides it", async () => {
    const { toggle, drawer } = await openDrawer();

    act(() => fireMedia("(min-width:1001px)", true));

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(drawer).not.toHaveClass("open");
  });
});

describe("focus under the fixed bar", () => {
  const keyboardFocus = (el: HTMLElement) => {
    const matches = el.matches.bind(el);
    vi.spyOn(el, "matches").mockImplementation((sel) => sel === ":focus-visible" || matches(sel));
  };

  it("scrolls a focused control out from under the bar by just enough", () => {
    const { container } = render(
      <>
        <SiteNav />
        <a href="/x">Below the fold</a>
      </>,
    );
    const bar = container.querySelector<HTMLElement>(".nav")!;
    const link = container.querySelector<HTMLAnchorElement>('a[href="/x"]')!;
    vi.spyOn(bar, "getBoundingClientRect").mockReturnValue({ bottom: 84 } as DOMRect);
    vi.spyOn(link, "getBoundingClientRect").mockReturnValue({ top: 40, bottom: 60 } as DOMRect);
    const scrollBy = vi.spyOn(window, "scrollBy").mockImplementation(() => {});
    /* jsdom never matches :focus-visible; a keyboard focus is what this guards. */
    keyboardFocus(link);

    link.focus();

    /* 40 - 84 - 16: clear of the bar with 16px of air. */
    expect(scrollBy).toHaveBeenCalledWith(0, -60);
  });

  it("leaves a control the bar does not cover where it is", () => {
    const { container } = render(
      <>
        <SiteNav />
        <a href="/x">In view</a>
      </>,
    );
    const bar = container.querySelector<HTMLElement>(".nav")!;
    const link = container.querySelector<HTMLAnchorElement>('a[href="/x"]')!;
    vi.spyOn(bar, "getBoundingClientRect").mockReturnValue({ bottom: 84 } as DOMRect);
    vi.spyOn(link, "getBoundingClientRect").mockReturnValue({ top: 300, bottom: 320 } as DOMRect);
    const scrollBy = vi.spyOn(window, "scrollBy").mockImplementation(() => {});
    keyboardFocus(link);

    link.focus();

    expect(scrollBy).not.toHaveBeenCalled();
  });
});
