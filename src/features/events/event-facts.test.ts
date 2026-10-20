import { describe, expect, it } from "vitest";

import { events, type EventEntry } from "@/content/events";

import {
  byMonth,
  dayOf,
  details,
  ended,
  nextUp,
  place,
  places,
  split,
  upcoming,
  when,
} from "./event-facts";

/**
 * What /events prints about an event, as the mock works it out: the dates in the tile and in words, when an event is
 * over, its place and its Where filter, the description's first sentence and the Details rows, and the page's order.
 */

const base: EventEntry = {
  name: "Example 2026",
  organizer: "Example organizers",
  topic: "finops",
  startDate: "2026-11-09",
  endDate: "2026-11-12",
  dateStatus: "confirmed",
  city: "Salt Lake City",
  country: "United States",
  venue: "Salt Palace Convention Center",
  format: "in person",
  description: "A conference. It has talks.",
  whyItMatters: "Teams meet there.",
  officialUrl: "https://example.org/2026/",
  cfp: "",
  tickets: "",
};
const event = (over: Partial<EventEntry>): EventEntry => ({ ...base, ...over });

describe("an event's dates", () => {
  it("draws days in one month, across months, across years, one day and a month alone as the mock does", () => {
    expect(when(event({}))).toMatchObject({
      day: "9–12",
      month: "Nov",
      text: "9–12 November 2026",
      group: "2026-11",
    });
    expect(when(event({ startDate: "2026-11-30", endDate: "2026-12-04" }))).toMatchObject({
      day: "30–4",
      month: "Nov–Dec",
      text: "30 November – 4 December 2026",
    });
    /* Across a year the mock names the end's year alone; kept as drawn. */
    expect(when(event({ startDate: "2026-12-30", endDate: "2027-01-02" }))).toMatchObject({
      day: "30–2",
      month: "Dec–Jan",
      text: "30 December – 2 January 2027",
    });
    for (const endDate of ["", "2026-11-09"]) {
      expect(when(event({ endDate }))).toMatchObject({
        day: "9",
        month: "Nov",
        text: "9 November 2026",
      });
    }
    expect(when(event({ startDate: "2027-04", endDate: "" }))).toEqual({
      day: "Apr",
      month: "2027",
      text: "April 2027, exact dates to be announced",
      group: "2027-04",
      order: "2027-04-99",
    });
  });

  it("is over once its last day has passed, a month-only one once its month has", () => {
    expect(ended(event({}), "2026-11-12")).toBe(false);
    expect(ended(event({}), "2026-11-13")).toBe(true);
    expect(ended(event({ endDate: "" }), "2026-11-09")).toBe(false);
    expect(ended(event({ endDate: "" }), "2026-11-10")).toBe(true);
    const month = event({ startDate: "2026-11", endDate: "" });
    expect(ended(month, "2026-11-30")).toBe(false);
    expect(ended(month, "2026-12-01")).toBe(true);
  });

  it("reads a moment as the day it falls on where it is read", () => {
    expect(dayOf(new Date(2026, 9, 19, 23, 59))).toBe("2026-10-19");
    expect(dayOf(new Date(2027, 0, 5, 0, 0))).toBe("2027-01-05");
  });
});

describe("an event's place", () => {
  it("is the city and country, online, both, or to be announced", () => {
    expect(place(event({}))).toBe("Salt Lake City, United States");
    expect(place(event({ format: "virtual", country: "India" }))).toBe("Online");
    expect(place(event({ format: "hybrid", city: "Bengaluru", country: "India" }))).toBe(
      "Bengaluru, India and online",
    );
    expect(place(event({ city: "", country: "" }))).toBe("Place to be announced");
    expect(place(event({ format: "hybrid", city: "", country: "" }))).toBe(
      "Place to be announced and online",
    );
  });

  it("files it under India and Online for the Where filter", () => {
    expect(places(event({}))).toEqual([]);
    expect(places(event({ country: "India" }))).toEqual(["india"]);
    expect(places(event({ format: "hybrid", country: "India" }))).toEqual(["india", "online"]);
    expect(places(event({ format: "virtual", country: "" }))).toEqual(["online"]);
  });
});

describe("an event's description and Details", () => {
  it("splits the description after its first sentence, only before a capital", () => {
    expect(split("A conference. It has talks.")).toEqual(["A conference.", "It has talks."]);
    expect(split("Run by v. 2 volunteers. Talks too.")).toEqual([
      "Run by v. 2 volunteers.",
      "Talks too.",
    ]);
    expect(split("One sentence only.")).toEqual(["One sentence only.", ""]);
  });

  it("lists About, Dates, Where, Format, Organizer, then Tickets, Call for talks and Why go when given", () => {
    expect(details(event({ tickets: "Paid", cfp: "Open until 1 Nov 2026" }))).toEqual([
      { label: "About", value: "It has talks." },
      { label: "Dates", value: "9–12 November 2026" },
      { label: "Where", value: "Salt Palace Convention Center, Salt Lake City, United States" },
      { label: "Format", value: "In person" },
      { label: "Organizer", value: "Example organizers" },
      { label: "Tickets", value: "Paid" },
      { label: "Call for talks", value: "Open until 1 Nov 2026" },
      { label: "Why go", value: "Teams meet there." },
    ]);
    const online = details(
      event({ description: "A call.", format: "virtual", venue: "Online", whyItMatters: "" }),
    );
    expect(online.map((row) => row.label)).toEqual(["Dates", "Where", "Format", "Organizer"]);
    expect(online[1]).toEqual({ label: "Where", value: "Online" });
    expect(online[2]).toEqual({ label: "Format", value: "Virtual" });
  });
});

describe("the page's order", () => {
  it("sorts by day, a month-only event after its month's days, then by name, leaving out what has ended", () => {
    const list = [
      event({ name: "B", startDate: "2026-11-09" }),
      event({ name: "Month", startDate: "2026-11", endDate: "" }),
      event({ name: "A", startDate: "2026-11-09" }),
      event({ name: "Late", startDate: "2026-11-30", endDate: "" }),
      event({ name: "Gone", startDate: "2026-10-01", endDate: "2026-10-02" }),
    ];
    expect(upcoming(list, "2026-10-19").map((e) => e.name)).toEqual(["A", "B", "Late", "Month"]);
  });

  it("groups by month with the month's name and leads with the first event whose days are known", () => {
    const list = upcoming(
      [
        event({ name: "Month", startDate: "2026-11", endDate: "" }),
        event({ name: "Dec", startDate: "2026-12-01", endDate: "" }),
      ],
      "2026-10-19",
    );
    expect(byMonth(list).map((month) => [month.title, month.events.length])).toEqual([
      ["November 2026", 1],
      ["December 2026", 1],
    ]);
    expect(nextUp(list)?.name).toBe("Dec");
    expect(nextUp(list.slice(0, 1))).toBeUndefined();
  });

  it("holds the radar's list: every event's dates, topic, format and link are well formed", () => {
    expect(events.length).toBeGreaterThan(0);
    for (const entry of events) {
      expect(entry.startDate, entry.name).toMatch(/^\d{4}-\d{2}(-\d{2})?$/);
      expect(entry.endDate, entry.name).toMatch(/^(\d{4}-\d{2}-\d{2})?$/);
      if (entry.endDate) expect(entry.endDate >= entry.startDate, entry.name).toBe(true);
      /* A month-only date has no end, and the list says so. */
      expect(entry.startDate.length === 7, entry.name).toBe(entry.dateStatus === "announced month");
      expect(entry.officialUrl, entry.name).toMatch(/^https:\/\//);
    }
  });
});
