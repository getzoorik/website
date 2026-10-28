import { readFileSync } from "node:fs";

import { act, fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { routes } from "@/config/site";
import { pageStructuredData } from "@/config/structured-data";
import {
  eventTopics,
  events,
  eventsListUpdated,
  eventsPage,
  type EventEntry,
} from "@/content/events";

/* The nav and the footer read the pathname. */
vi.mock("next/navigation", () => ({ usePathname: () => "/events" }));

import EventsRoute, { metadata } from "@/app/events/page";

import { banner, cityTile, ended, nextUp, place, split, upcoming, when } from "./event-facts";
import { EventsList, FIRST_SHOWN } from "./events-list";
import { EventsPage } from "./events-page";
import { eventsStructuredData } from "./events-structured-data";

/**
 * `/events`: the metadata, the utility hero, the search and the filters, "Next up", the cards and their banners by
 * month, the first nine and "More events", and the page's rules: past events are not shown (left out at build and
 * hidden in the browser, everything that depends on the list following), tickets are a label and never a price,
 * and every link is the event's own page. Its sitemap entry is in `src/app/sitemap.test.ts`, its page graph in
 * `src/config/structured-data.test.ts`.
 */

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();

/** Noon on a day in the reader's own time zone. */
const at = (day: string) => {
  const [y, m, d] = day.split("-").map(Number) as [number, number, number];
  vi.setSystemTime(new Date(y, m - 1, d, 12));
};
afterEach(() => {
  vi.useRealTimers();
});

const page = (day = "2026-10-19") => {
  at(day);
  return render(<EventsRoute />).container;
};

/** The cards in view, by name. */
const shownNames = (root: ParentNode) =>
  [...root.querySelectorAll(".evc")]
    .filter((li) => !li.closest("[hidden]"))
    .map((li) => text(li.querySelector("h3")));
/** Every card in the page, in view or not, by name. */
const cardNames = (root: ParentNode) =>
  [...root.querySelectorAll(".evc")].map((li) => text(li.querySelector("h3")));
const headings = (root: ParentNode) =>
  [...root.querySelectorAll(".evc-sec")]
    .filter((s) => !s.hasAttribute("hidden"))
    .map((s) => text(s.querySelector("h2")));
const chip = (root: ParentNode, label: string) =>
  [...root.querySelectorAll<HTMLButtonElement>(".ev-chips button")].find((b) => text(b) === label)!;
const more = (root: ParentNode) => root.querySelector<HTMLElement>(".ev-morebtn")!;
const search = (root: ParentNode) => root.querySelector<HTMLInputElement>(".ev-search input")!;
const menus = (root: ParentNode) =>
  [...root.querySelectorAll<HTMLSelectElement>(".ev-sel select")] as [
    HTMLSelectElement,
    HTMLSelectElement,
  ];

/** The month headings of a list, in order, each once. */
const monthsOf = (list: readonly EventEntry[]) =>
  [...new Set(list.map((event) => when(event).group))].map((group) => {
    const [y, m] = group.split("-").map(Number) as [number, number];
    return `${eventsPage.dates.months[m - 1]} ${y}`;
  });

/**
 * What the page must show on a day: the events still to come, in order, of which the first nine are in view with
 * their months, led by the first dated one.
 */
function expected(day: string) {
  const list = upcoming(events, day);
  const first = list.slice(0, FIRST_SHOWN);
  return {
    list,
    all: list.map((event) => event.name),
    names: first.map((event) => event.name),
    months: monthsOf(first),
    lead: nextUp(list)!,
  };
}

describe("/events's metadata", () => {
  it("has the mock's title through the template, its description and its canonical", () => {
    expect(metadata.title).toBe("Events");
    expect(metadata.description).toBe(
      "Conferences and community days on Kubernetes, FinOps, cloud cost and block storage, with dates, places and a link to each event's own page.",
    );
    expect(metadata.alternates).toEqual({ canonical: "/events" });
    expect(metadata).not.toHaveProperty("robots");
    expect(metadata.openGraph).toMatchObject({
      url: "/events",
      title: "Events | Zoorik",
    });
  });
});

describe("/events", () => {
  it("opens on the utility hero and ends on where the dates come from, with no closing row", () => {
    const main = page().querySelector("main#main")!;
    const hero = main.querySelector(":scope > header.hero.doc-hero#top")!;
    expect(text(hero.querySelector("h1"))).toBe("Cloud cost, FinOps and Kubernetes events");
    expect(text(hero.querySelector(".doc-deck"))).toBe(
      `Conferences and community days worth the trip, with dates, places and each event’s own page. Updated ${eventsListUpdated}.`,
    );
    const wrap = main.querySelector(":scope > .sec.doc-body > .wrap")!;
    expect(wrap.firstElementChild).toHaveClass("ev-find");
    expect(wrap.firstElementChild!.nextElementSibling).toHaveClass("ev-filters");
    /* Last, the style that shows every event without scripting. */
    expect(wrap.lastElementChild!.tagName).toBe("NOSCRIPT");
    const source = wrap.lastElementChild!.previousElementSibling!;
    expect(source).toHaveClass("ev-src");
    expect(text(source)).toBe(
      "Dates and places come from each organizer’s own page. Check there before you book.",
    );
    expect(source.previousElementSibling).toHaveClass("ev-morebtn");
    expect(main.querySelector("#contact")).toBeNull();
    expect(main.lastElementChild).toHaveClass("doc-body");
  });

  it("draws the search box and the Year and Month menus as the mock does", () => {
    const root = page();
    const find = root.querySelector(".ev-find")!;
    const box = find.querySelector("label.ev-search")!;
    expect(box.querySelector(":scope > svg")).toHaveAttribute("aria-hidden", "true");
    expect(text(box.querySelector(".sr-only"))).toBe("Search events");
    expect(search(root)).toHaveAttribute("type", "search");
    expect(search(root)).toHaveAttribute("placeholder", "Search events, cities or organizers");
    expect(search(root).value).toBe("");
    const [year, month] = menus(root);
    expect(text(year.closest("label.ev-sel")!.querySelector(".sr-only"))).toBe("Year");
    expect([...year.options].map((o) => [o.value, o.text])).toEqual([
      ["", "Any year"],
      ...[...new Set(expected("2026-10-19").list.map((e) => e.startDate.slice(0, 4)))].map((y) => [
        y,
        y,
      ]),
    ]);
    expect(text(month.closest("label.ev-sel")!.querySelector(".sr-only"))).toBe("Month");
    expect([...month.options].map((o) => [o.value, o.text])).toEqual([
      ["", "Any month"],
      ...eventsPage.dates.months.map((name, i) => [String(i + 1), name]),
    ]);
    expect(year.value).toBe("");
    expect(month.value).toBe("");
  });

  it("draws the filters as the mock does: Topic and Where, All and Everywhere pressed, and the count", () => {
    const filters = page().querySelector(".ev-filters[role='group'][aria-label='Filter events']")!;
    const [topic, where] = filters.querySelectorAll(".ev-fg");
    expect(text(topic!.querySelector(".ev-fl#ev-t"))).toBe("Topic");
    expect(topic!.querySelector(".ev-chips")).toHaveAttribute("aria-labelledby", "ev-t");
    /* A group, so its name is announced (the mock's div has no role, so ARIA 1.2 exposes no name). */
    expect(topic!.querySelector(".ev-chips")).toHaveAttribute("role", "group");
    expect(
      [...topic!.querySelectorAll("button")].map((b) => [text(b), b.getAttribute("aria-pressed")]),
    ).toEqual([["All", "true"], ...eventTopics.map((t) => [t.label, "false"])]);
    expect(text(where!.querySelector(".ev-fl#ev-w"))).toBe("Where");
    expect(where!.querySelector(".ev-chips")).toHaveAttribute("aria-labelledby", "ev-w");
    expect(
      [...where!.querySelectorAll("button")].map((b) => [text(b), b.getAttribute("aria-pressed")]),
    ).toEqual([
      ["Everywhere", "true"],
      ["India", "false"],
      ["Online", "false"],
    ]);
    for (const button of filters.querySelectorAll("button"))
      expect(button).toHaveAttribute("type", "button");
    const count = filters.querySelector(".ev-count")!;
    expect(count).toHaveAttribute("aria-live", "polite");
    expect(text(count)).toBe(`${expected("2026-10-19").list.length} events`);
    expect(document.querySelector(".ev-empty")).toHaveAttribute("hidden");
  });

  it("leads with the next event whose days are known, then the first nine events still to come by month", () => {
    const root = page();
    const { lead, all, names, months } = expected("2026-10-19");
    const next = root.querySelector("section.ev-next[aria-labelledby='next-h']")!;
    expect(text(next.querySelector(".ev-next-in > .ev-eyebrow"))).toBe("Next up");
    expect(text(next.querySelector("h2#next-h"))).toBe(lead.name);
    expect(text(next.querySelector(".ev-next-when"))).toBe(`${when(lead).text} · ${place(lead)}`);
    expect(text(next.querySelector(".ev-next-d"))).toBe(split(lead.description)[0]);
    expect(next.querySelector("a.ev-out.ev-out-lg")).toHaveAttribute("href", lead.officialUrl);
    /* Its banner, beside the words, without a date tile. */
    expect(next.lastElementChild).toHaveClass("ev-next-ban");
    expect(next.querySelector(".ev-next-ban .ev-date")).toBeNull();

    expect(cardNames(root)).toEqual(all);
    expect(names).toHaveLength(FIRST_SHOWN);
    expect(shownNames(root)).toEqual(names);
    expect(headings(root)).toEqual(months);
    const sections = [...root.querySelectorAll("section.evc-sec")];
    sections.forEach((section, i) => {
      expect(section).toHaveAttribute("aria-labelledby", `m${i}`);
      expect(section.querySelector("h2")).toHaveAttribute("id", `m${i}`);
      expect(section.querySelector(":scope > ol.evc-grid")).not.toBeNull();
    });
  });

  it("draws a card as the mock does: the banner and its tile, the tag, the name, the place, a sentence, the Details, the link", () => {
    const root = page();
    const first = expected("2026-10-19").list[0]!;
    const card = root.querySelector("li.evc")!;
    expect(card.firstElementChild).toHaveClass("evc-ban");
    expect(card.querySelector(".evc-ban > .ev-date")).toHaveAttribute("aria-hidden", "true");
    expect(text(card.querySelector(".ev-date b"))).toBe(when(first).day);
    expect(text(card.querySelector(".ev-date span"))).toBe(when(first).month);
    const body = card.querySelector(":scope > .evc-b")!;
    expect([...body.children].map((child) => child.className || child.tagName)).toEqual([
      "ev-tag",
      "H3",
      "ev-meta",
      "ev-desc",
      "ev-more",
      "evc-foot",
    ]);
    expect(text(body.querySelector(".ev-tag"))).toBe(
      eventTopics.find((topic) => topic.id === first.topic)!.label,
    );
    expect(text(card.querySelector("h3"))).toBe(first.name);
    expect(card.querySelector(".ev-meta > svg.ev-pin")).toHaveAttribute("aria-hidden", "true");
    expect(text(card.querySelector(".ev-desc"))).toBe(split(first.description)[0]);
    const summary = card.querySelector("details.ev-more > summary")!;
    expect(text(summary)).toBe("Details");
    expect(summary.querySelector("svg.ev-chev")).toHaveAttribute("aria-hidden", "true");
    expect(card.querySelector("details.ev-more > dl.ev-dl > div > dt")).not.toBeNull();
    expect(card.querySelector(".evc-foot > a.ev-out")).toHaveAttribute("href", first.officialUrl);
  });

  it("opens an event's Details in place", () => {
    const details = page().querySelector<HTMLDetailsElement>("details.ev-more")!;
    expect(details.open).toBe(false);
    fireEvent.click(details.querySelector("summary")!);
    expect(details.open).toBe(true);
  });
});

describe("/events's tickets", () => {
  it("shows each event's label alone, and none where the list gives none", () => {
    const root = page();
    const { list } = expected("2026-10-19");
    const cards = [...root.querySelectorAll(".evc")];
    expect(cards).toHaveLength(list.length);
    cards.forEach((card, i) => {
      const row = [...card.querySelectorAll(".ev-dl > div")].find(
        (div) => text(div.querySelector("dt")) === "Tickets",
      );
      if (list[i]!.tickets)
        expect(text(row?.querySelector("dd") ?? null), list[i]!.name).toBe(list[i]!.tickets);
      else expect(row, list[i]!.name).toBeUndefined();
    });
    expect(list.some((event) => !event.tickets)).toBe(true);
  });

  it("prints no currency and no price anywhere on the page, its markup included", () => {
    const root = page();
    const all = root.textContent ?? "";
    expect(all).not.toMatch(/[$€£₹¥]/);
    expect(all).not.toMatch(/\b(USD|EUR|GBP|INR|JPY|CHF|SGD|AUD|CAD|BRL)\b/);
    /* Nor an amount in words: a figure before a currency's name. */
    expect(all).not.toMatch(/\d[\d,.]*\s*(dollars?|euros?|rupees?|pounds?)\b/i);
    expect(all).not.toMatch(/"offers"/);
  });
});

describe("/events's links", () => {
  it("go only to each event's own page, in a new tab, saying whose page it is", () => {
    const main = page().querySelector("main")!;
    const official = new Set(events.map((event) => event.officialUrl));
    const links = [...main.querySelectorAll("a[href]")];
    expect(links).toHaveLength(expected("2026-10-19").list.length + 1);
    for (const link of links) {
      expect(official.has(link.getAttribute("href")!), link.getAttribute("href")!).toBe(true);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      expect(link.querySelector("svg.ext")).toHaveAttribute("aria-hidden", "true");
    }
    const card = main.querySelector(".evc")!;
    expect(text(card.querySelector(".ev-out .sr-only"))).toBe(
      `for ${text(card.querySelector("h3"))} (opens in a new tab)`,
    );
  });
});

describe("/events's structured data", () => {
  it("is the page's own block, then its events' block", () => {
    const blocks = page().querySelectorAll('script[type="application/ld+json"]');
    expect(blocks).toHaveLength(2);
    expect(JSON.parse(blocks[0]!.textContent!)).toEqual(
      JSON.parse(JSON.stringify(pageStructuredData(routes.events))),
    );
    expect(JSON.parse(blocks[1]!.textContent!)).toEqual(
      JSON.parse(JSON.stringify(eventsStructuredData(upcoming(events, "2026-10-19")))),
    );
  });
});

describe("/events's filters", () => {
  it("narrow by topic and by place, hide empty months, count what is left and reset from the empty state", () => {
    const root = page();
    const { list } = expected("2026-10-19");
    const count = root.querySelector(".ev-count")!;

    fireEvent.click(chip(root, "FinOps"));
    const finops = list.filter((event) => event.topic === "finops");
    expect(shownNames(root)).toEqual(finops.map((event) => event.name));
    expect(text(count)).toBe(`${finops.length} events`);
    expect(chip(root, "FinOps")).toHaveAttribute("aria-pressed", "true");
    expect(chip(root, "All")).toHaveAttribute("aria-pressed", "false");
    expect(headings(root)).toHaveLength(new Set(finops.map((event) => when(event).group)).size);

    fireEvent.click(chip(root, "India"));
    const both = finops.filter((event) => event.country === "India");
    expect(shownNames(root)).toEqual(both.map((event) => event.name));
    expect(chip(root, "Everywhere")).toHaveAttribute("aria-pressed", "false");

    const online = list.filter((event) => event.format !== "in person");
    fireEvent.click(chip(root, "All"));
    fireEvent.click(chip(root, "Online"));
    expect(shownNames(root)).toEqual(online.map((event) => event.name));
    expect(text(count)).toBe(`${online.length} events`);

    /* "Next up" stands whatever the filters say. */
    expect(text(root.querySelector("#next-h"))).toBe(expected("2026-10-19").lead.name);
  });

  it("say 1 event for one, and with none the empty state, every month hidden, and the way back", () => {
    const sample = (over: Partial<EventEntry>): EventEntry => ({
      ...events.find((event) => event.startDate.length === 10)!,
      startDate: "2026-11-09",
      endDate: "",
      ...over,
    });
    const list = [
      sample({ name: "Bengaluru FinOps", topic: "finops", country: "India", format: "in person" }),
      sample({
        name: "Chicago storage",
        topic: "storage",
        country: "United States",
        format: "in person",
      }),
    ];
    at("2026-10-19");
    const root = render(<EventsList events={list} buildDay="2026-10-19" />).container;
    const count = root.querySelector(".ev-count")!;
    const empty = root.querySelector(".ev-empty")!;

    fireEvent.click(chip(root, "India"));
    expect(shownNames(root)).toEqual(["Bengaluru FinOps"]);
    expect(text(count)).toBe("1 event");

    fireEvent.click(chip(root, "Storage"));
    expect(shownNames(root)).toEqual([]);
    expect(headings(root)).toEqual([]);
    expect(text(count)).toBe("0 events");
    expect(empty).not.toHaveAttribute("hidden");
    expect(text(empty)).toBe("No events match. Show all events");

    fireEvent.click(empty.querySelector("button.ev-reset")!);
    expect(shownNames(root)).toEqual(["Bengaluru FinOps", "Chicago storage"]);
    expect(text(count)).toBe("2 events");
    expect(chip(root, "All")).toHaveAttribute("aria-pressed", "true");
    expect(chip(root, "Everywhere")).toHaveAttribute("aria-pressed", "true");
    expect(empty).toHaveAttribute("hidden");
  });

  it("works from the keyboard: Tab to a chip, then Enter or Space", async () => {
    vi.useRealTimers();
    const user = userEvent.setup();
    const root = render(
      <EventsList events={upcoming(events, "2026-10-19")} buildDay="2026-10-19" />,
    ).container;
    chip(root, "Kubernetes").focus();
    await user.keyboard("{Enter}");
    expect(chip(root, "Kubernetes")).toHaveAttribute("aria-pressed", "true");
    await user.tab();
    expect(document.activeElement).toBe(chip(root, "FinOps"));
    await user.keyboard(" ");
    expect(chip(root, "FinOps")).toHaveAttribute("aria-pressed", "true");
    expect(chip(root, "Kubernetes")).toHaveAttribute("aria-pressed", "false");
  });
});

describe("/events's past events", () => {
  /** The page as the reader must see it on `day`, whatever the build's day was. */
  function expectShownOn(root: HTMLElement, day: string) {
    const { all, names, months, lead, list } = expected(day);
    expect(cardNames(root)).toEqual(all);
    expect(shownNames(root)).toEqual(names);
    expect(headings(root)).toEqual(months);
    expect(text(root.querySelector("#next-h"))).toBe(lead.name);
    expect(text(root.querySelector(".ev-count"))).toBe(`${list.length} events`);
    for (const event of events.filter((e) => ended(e, day))) expect(all).not.toContain(event.name);
  }

  it("leaves out at build what had ended by the build's day, in the page and in its markup", () => {
    const root = page("2026-11-15");
    expectShownOn(root, "2026-11-15");
    expect(expected("2026-11-15").list.length).toBeLessThan(expected("2026-10-19").list.length);
    const markup = JSON.parse(
      root.querySelectorAll('script[type="application/ld+json"]')[1]!.textContent!,
    );
    const marked = (markup["@graph"] as { name: string }[]).map((node) => node.name);
    for (const event of events.filter((e) => ended(e, "2026-11-15")))
      expect(marked).not.toContain(event.name);
  });

  it("hides in the browser what has ended since the build, by the reader's own day, and recounts", () => {
    at("2026-11-15");
    const root = render(
      <EventsList events={upcoming(events, "2026-10-19")} buildDay="2026-10-19" />,
    ).container;
    expectShownOn(root, "2026-11-15");
    /* The filters count only what is still to come. */
    fireEvent.click(chip(root, "FinOps"));
    expect(text(root.querySelector(".ev-count"))).toBe(
      `${expected("2026-11-15").list.filter((event) => event.topic === "finops").length} events`,
    );
  });

  it("keeps a month-only event until its month is over", () => {
    const month = events.find((event: EventEntry) => event.startDate === "2026-11")!;
    expect(month).toBeDefined();
    at("2026-11-30");
    const { container: late, unmount } = render(
      <EventsList events={upcoming(events, "2026-10-19")} buildDay="2026-10-19" />,
    );
    expect(cardNames(late)).toContain(month.name);
    /* One list at a time: jsdom finds an id by the document's first, so two would hide the second's. */
    unmount();
    at("2026-12-01");
    const after = render(
      <EventsList events={upcoming(events, "2026-10-19")} buildDay="2026-10-19" />,
    ).container;
    expect(cardNames(after)).not.toContain(month.name);
    expectShownOn(after, "2026-12-01");
  });

  it("hydrates the build's HTML without an error, then follows the reader's day", async () => {
    const list = upcoming(events, "2026-10-19");
    at("2026-10-19");
    const host = document.createElement("div");
    host.innerHTML = renderToString(<EventsList events={list} buildDay="2026-10-19" />);
    document.body.append(host);
    expect(shownNames(host)).toEqual(expected("2026-10-19").names);

    at("2026-11-15");
    const failures: unknown[] = [];
    const error = vi.spyOn(console, "error").mockImplementation((...args) => failures.push(args));
    const root = await act(async () =>
      hydrateRoot(host, <EventsList events={list} buildDay="2026-10-19" />, {
        onRecoverableError: (e) => failures.push(e),
      }),
    );
    expect(failures).toEqual([]);
    expectShownOn(host, "2026-11-15");
    error.mockRestore();
    act(() => root.unmount());
    host.remove();
  });
});

describe("/events's first nine and More events", () => {
  it("shows the first nine, hides the rest and their months, and counts every event", () => {
    const root = page();
    const { list, names, months } = expected("2026-10-19");
    expect(list.length).toBeGreaterThan(FIRST_SHOWN);
    expect(shownNames(root)).toEqual(names);
    expect(headings(root)).toEqual(months);
    for (const card of [...root.querySelectorAll(".evc")].slice(FIRST_SHOWN))
      expect(card).toHaveAttribute("hidden");
    expect(text(root.querySelector(".ev-count"))).toBe(`${list.length} events`);
    expect(more(root)).not.toHaveAttribute("hidden");
    expect(more(root).querySelector("button")).toHaveAttribute("type", "button");
    expect(text(more(root))).toBe("More events");
  });

  it("shows every event on More events, and goes", () => {
    const root = page();
    const { list, all } = expected("2026-10-19");
    fireEvent.click(more(root).querySelector("button")!);
    expect(shownNames(root)).toEqual(all);
    expect(headings(root)).toEqual(monthsOf(list));
    expect(more(root)).toHaveAttribute("hidden");
    /* Once pressed it stays pressed: a filter set and cleared again leaves every event in view. */
    fireEvent.click(chip(root, "FinOps"));
    fireEvent.click(chip(root, "All"));
    expect(shownNames(root)).toEqual(all);
    expect(more(root)).toHaveAttribute("hidden");
  });

  it("goes while a filter is set, which reaches every event, and comes back with the first nine", () => {
    const root = page();
    const { list, names } = expected("2026-10-19");
    const kubernetes = list.filter((event) => event.topic === "kubernetes-cloud-native");
    expect(kubernetes.length).toBeGreaterThan(FIRST_SHOWN);
    fireEvent.click(chip(root, "Kubernetes"));
    expect(shownNames(root)).toEqual(kubernetes.map((event) => event.name));
    expect(more(root)).toHaveAttribute("hidden");
    fireEvent.click(chip(root, "All"));
    expect(shownNames(root)).toEqual(names);
    expect(more(root)).not.toHaveAttribute("hidden");
  });

  it("is not there when nine events or fewer are left", () => {
    at("2026-10-19");
    const list = upcoming(events, "2026-10-19").slice(0, FIRST_SHOWN);
    const root = render(<EventsList events={list} buildDay="2026-10-19" />).container;
    expect(shownNames(root)).toEqual(list.map((event) => event.name));
    expect(more(root)).toHaveAttribute("hidden");
  });
});

describe("/events's search and date menus", () => {
  it("search every event's name, city, country, organizer, topic and format, trimmed and in any case", () => {
    const root = page();
    const { list } = expected("2026-10-19");
    const kubecon = list.filter((event) => event.name.includes("KubeCon"));
    expect(kubecon.length).toBeGreaterThan(1);
    fireEvent.change(search(root), { target: { value: "  KUBECON " } });
    expect(shownNames(root)).toEqual(kubecon.map((event) => event.name));
    expect(text(root.querySelector(".ev-count"))).toBe(`${kubecon.length} events`);
    expect(more(root)).toHaveAttribute("hidden");

    const bengaluru = list.filter((event) => event.city === "Bengaluru");
    expect(bengaluru.length).toBeGreaterThan(0);
    fireEvent.change(search(root), { target: { value: "bengaluru" } });
    expect(shownNames(root)).toEqual(bengaluru.map((event) => event.name));

    const virtual = list.filter((event) => event.format === "virtual");
    fireEvent.change(search(root), { target: { value: "virtual" } });
    expect(shownNames(root)).toEqual(virtual.map((event) => event.name));

    fireEvent.change(search(root), { target: { value: "   " } });
    expect(shownNames(root)).toEqual(expected("2026-10-19").names);
    expect(more(root)).not.toHaveAttribute("hidden");
  });

  it("narrow by year and by month together, with the chips", () => {
    const root = page();
    const { list } = expected("2026-10-19");
    const [year, month] = menus(root);
    const in2027 = list.filter((event) => event.startDate.startsWith("2027"));
    fireEvent.change(year, { target: { value: "2027" } });
    expect(shownNames(root)).toEqual(in2027.map((event) => event.name));
    expect(more(root)).toHaveAttribute("hidden");

    const novembers = list.filter((event) => event.startDate.slice(5, 7) === "11");
    fireEvent.change(year, { target: { value: "" } });
    fireEvent.change(month, { target: { value: "11" } });
    expect(shownNames(root)).toEqual(novembers.map((event) => event.name));
    expect(new Set(novembers.map((event) => event.startDate.slice(0, 4))).size).toBe(2);

    fireEvent.change(year, { target: { value: "2026" } });
    fireEvent.click(chip(root, "Kubernetes"));
    const both = novembers.filter(
      (event) => event.startDate.startsWith("2026") && event.topic === "kubernetes-cloud-native",
    );
    expect(shownNames(root)).toEqual(both.map((event) => event.name));
    expect(text(root.querySelector(".ev-count"))).toBe(
      `${both.length} ${both.length === 1 ? "event" : "events"}`,
    );
  });

  it("clear with Show all events, the search and the menus with the chips", () => {
    const root = page();
    const [year, month] = menus(root);
    fireEvent.change(search(root), { target: { value: "kubecon" } });
    fireEvent.change(year, { target: { value: "2027" } });
    fireEvent.change(month, { target: { value: "1" } });
    fireEvent.click(chip(root, "Online"));
    const empty = root.querySelector(".ev-empty")!;
    expect(shownNames(root)).toEqual([]);
    expect(empty).not.toHaveAttribute("hidden");

    fireEvent.click(empty.querySelector("button.ev-reset")!);
    expect(search(root).value).toBe("");
    expect(year.value).toBe("");
    expect(month.value).toBe("");
    expect(chip(root, "All")).toHaveAttribute("aria-pressed", "true");
    expect(chip(root, "Everywhere")).toHaveAttribute("aria-pressed", "true");
    expect(shownNames(root)).toEqual(expected("2026-10-19").names);
    expect(more(root)).not.toHaveAttribute("hidden");
    expect(empty).toHaveAttribute("hidden");
  });
});

describe("/events's banners", () => {
  it("give each card the event's own picture, a logo on white, or its city over its country", () => {
    const root = page();
    const { list } = expected("2026-10-19");
    const cards = [...root.querySelectorAll(".evc")];
    const kinds = new Set<string>();
    cards.forEach((card, i) => {
      const event = list[i]!;
      const box = card.querySelector(":scope > .evc-ban")!;
      expect(box.querySelector(":scope > .ev-date"), event.name).not.toBeNull();
      const image = banner(event);
      if (image) {
        kinds.add(image.logo ? "logo" : "banner");
        expect(box.className, event.name).toBe(image.logo ? "evc-ban is-logo" : "evc-ban");
        const img = box.querySelector(":scope > img")!;
        expect(img, event.name).toHaveAttribute("src", image.src);
        expect(img).toHaveAttribute("alt", "");
        expect(img).toHaveAttribute("loading", "lazy");
        expect(img).toHaveAttribute("decoding", "async");
      } else {
        kinds.add("plain");
        expect(box.className, event.name).toBe("evc-ban is-plain");
        expect(box).toHaveAttribute("aria-hidden", "true");
        expect(box.querySelector("img")).toBeNull();
        expect(text(box.querySelector(".evb-c"))).toBe(cityTile(event).city);
        expect(text(box.querySelector(".evb-s"))).toBe(cityTile(event).country);
      }
    });
    expect(kinds).toEqual(new Set(["banner", "logo", "plain"]));
  });

  it("give Next up the same banner, without the date tile", () => {
    const root = page();
    const { lead } = expected("2026-10-19");
    const box = root.querySelector(".ev-next > .ev-next-ban")!;
    const image = banner(lead);
    if (image) expect(box.querySelector("img")).toHaveAttribute("src", image.src);
    else expect(text(box.querySelector(".evb-c"))).toBe(cityTile(lead).city);
  });

  it("are kept a month in the browser, by one Cache-Control rule", () => {
    const rules = readFileSync("public/_headers", "utf8")
      .split(/\n(?=\S)/)
      .filter((block) => !block.startsWith("#"))
      .map((block) => block.trim().split("\n"));
    const src = banner(expected("2026-10-19").lead)?.src ?? "/event-banners/example.webp";
    const matching = rules.filter(([pattern]) =>
      new RegExp(`^${pattern!.trim().replace(/[.]/g, "\\.").replace(/\*/g, ".*")}$`).test(src),
    );
    const cache = matching.flat().filter((line) => line.trim().startsWith("Cache-Control:"));
    expect(cache.map((line) => line.trim())).toEqual(["Cache-Control: public, max-age=2592000"]);
    /* No rule reaches the pages under /events. */
    expect(rules.some(([pattern]) => pattern!.trim().startsWith("/events"))).toBe(false);
  });
});

describe("/events without scripting", () => {
  it("shows every card and month, and takes away the search, the filters and More events", () => {
    const html = renderToString(
      <EventsPage events={upcoming(events, "2026-10-19")} buildDay="2026-10-19" />,
    );
    const style = /<noscript><style>([\s\S]*?)<\/style><\/noscript>/.exec(html)?.[1];
    expect(style).toBe(
      "@layer base{.evc-grid>.evc[hidden]{display:flex!important}.evc-sec[hidden]{display:block!important}}" +
        ".ev-find,.ev-filters,.ev-morebtn{display:none}",
    );
    /* The prerendered HTML holds every event, the hidden ones included. */
    for (const event of upcoming(events, "2026-10-19"))
      expect(html).toContain(event.officialUrl.replace(/&/g, "&amp;"));
  });
});
