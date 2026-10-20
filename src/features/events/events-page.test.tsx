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

import { ended, nextUp, place, upcoming, when } from "./event-facts";
import { EventsList } from "./events-list";
import { eventsStructuredData } from "./events-structured-data";

/**
 * `/events`: the metadata, the utility hero, the filters, "Next up", the cards by month, and the page's rules:
 * past events are not shown (left out at build and hidden in
 * the browser, everything that depends on the list following), tickets are a label and never a price, and every
 * link is the event's own page. Its sitemap entry is in `src/app/sitemap.test.ts`, its page graph in
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

/** The cards the filters leave in view, by name. */
const shownNames = (root: ParentNode) =>
  [...root.querySelectorAll(".evc")]
    .filter((li) => !li.closest("[hidden]"))
    .map((li) => text(li.querySelector("h3")));
const headings = (root: ParentNode) =>
  [...root.querySelectorAll(".evc-sec")]
    .filter((s) => !s.hasAttribute("hidden"))
    .map((s) => text(s.querySelector("h2")));
const chip = (root: ParentNode, label: string) =>
  [...root.querySelectorAll<HTMLButtonElement>(".ev-chips button")].find((b) => text(b) === label)!;

/** What the page must show on a day: the events still to come, in order, by month, led by the first dated one. */
function expected(day: string) {
  const list = upcoming(events, day);
  const months = [...new Set(list.map((event) => when(event).group))].map((group) => {
    const [y, m] = group.split("-").map(Number) as [number, number];
    return `${eventsPage.dates.months[m - 1]} ${y}`;
  });
  return { list, names: list.map((event) => event.name), months, lead: nextUp(list)! };
}

describe("/events's metadata", () => {
  it("has the mock's title through the template, its description and its canonical", () => {
    expect(metadata.title).toBe("Cloud cost, FinOps and Kubernetes events");
    expect(metadata.description).toBe(
      "Conferences and community days on Kubernetes, FinOps, cloud cost and block storage, with dates, places and a link to each event's own page.",
    );
    expect(metadata.alternates).toEqual({ canonical: "/events" });
    expect(metadata).not.toHaveProperty("robots");
    expect(metadata.openGraph).toMatchObject({
      url: "/events",
      title: "Cloud cost, FinOps and Kubernetes events · Zoorik",
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
    expect(wrap.firstElementChild).toHaveClass("ev-filters");
    expect(text(wrap.lastElementChild)).toBe(
      "Dates and places come from each organizer’s own page. Check there before you book.",
    );
    expect(main.querySelector("#contact")).toBeNull();
    expect(main.lastElementChild).toHaveClass("doc-body");
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

  it("leads with the next event whose days are known, then every event still to come by month", () => {
    const root = page();
    const { lead, names, months } = expected("2026-10-19");
    const next = root.querySelector("section.ev-next[aria-labelledby='next-h']")!;
    expect(text(next.querySelector(".ev-eyebrow"))).toBe("Next up");
    expect(text(next.querySelector("h2#next-h"))).toBe(lead.name);
    expect(text(next.querySelector(".ev-next-when"))).toBe(`${when(lead).text} · ${place(lead)}`);
    expect(text(next.querySelector(".ev-next-d"))).toBe(lead.description);
    expect(next.querySelector("a.ev-out.ev-out-lg")).toHaveAttribute("href", lead.officialUrl);

    expect(shownNames(root)).toEqual(names);
    expect(headings(root)).toEqual(months);
    const sections = [...root.querySelectorAll("section.evc-sec")];
    sections.forEach((section, i) => {
      expect(section).toHaveAttribute("aria-labelledby", `m${i}`);
      expect(section.querySelector("h2")).toHaveAttribute("id", `m${i}`);
      expect(section.querySelector(":scope > ol.evc-grid")).not.toBeNull();
    });
  });

  it("draws a card as the mock does: the tile, the tag, the name, the place, a sentence, the Details, the link", () => {
    const root = page();
    const first = expected("2026-10-19").list[0]!;
    const card = root.querySelector("li.evc")!;
    expect(card.querySelector(".evc-top > .ev-date")).toHaveAttribute("aria-hidden", "true");
    expect(text(card.querySelector(".ev-date b"))).toBe(when(first).day);
    expect(text(card.querySelector(".ev-date span"))).toBe(when(first).month);
    expect(card.querySelector(".evc-top > .ev-tag")).not.toBeNull();
    expect(text(card.querySelector("h3"))).toBe(first.name);
    expect(card.querySelector(".ev-meta > svg.ev-pin")).toHaveAttribute("aria-hidden", "true");
    expect(first.description.startsWith(text(card.querySelector(".ev-desc")))).toBe(true);
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
    expect(text(empty)).toBe("No events match these filters. Show all events");

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
    const { names, months, lead, list } = expected(day);
    expect(shownNames(root)).toEqual(names);
    expect(headings(root)).toEqual(months);
    expect(text(root.querySelector("#next-h"))).toBe(lead.name);
    expect(text(root.querySelector(".ev-count"))).toBe(`${list.length} events`);
    for (const event of events.filter((e) => ended(e, day)))
      expect(names).not.toContain(event.name);
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
    expect(shownNames(late)).toContain(month.name);
    /* One list at a time: jsdom finds an id by the document's first, so two would hide the second's. */
    unmount();
    at("2026-12-01");
    const after = render(
      <EventsList events={upcoming(events, "2026-10-19")} buildDay="2026-10-19" />,
    ).container;
    expect(shownNames(after)).not.toContain(month.name);
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
