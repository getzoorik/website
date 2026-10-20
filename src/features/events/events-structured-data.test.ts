import { describe, expect, it } from "vitest";

import { events, type EventEntry } from "@/content/events";

import { upcoming } from "./event-facts";
import { eventsStructuredData } from "./events-structured-data";

/**
 * /events's Event markup: one Event per event shown at build whose days are known, built from the list's fields
 * alone, with no offers and no price.
 */

type Node = Readonly<Record<string, unknown>>;
const graphOf = (list: readonly EventEntry[]) =>
  eventsStructuredData(list)["@graph"] as readonly Node[];

const base: EventEntry = {
  name: "Example 2026",
  organizer: "Example organizers",
  topic: "storage",
  startDate: "2026-11-16",
  endDate: "",
  dateStatus: "confirmed",
  city: "Chicago",
  country: "United States",
  venue: "City View Room",
  format: "in person",
  description: "A one-day community event.",
  whyItMatters: "",
  officialUrl: "https://example.org/days/",
  cfp: "",
  tickets: "Paid",
};

describe("the events' structured data", () => {
  it("marks up an event in person: its days, a Place with its address, its organizer, page and description", () => {
    const [node] = graphOf([base]);
    expect(node).toEqual({
      "@type": "Event",
      name: "Example 2026",
      startDate: "2026-11-16",
      endDate: "2026-11-16",
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Place",
        name: "City View Room",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Chicago",
          addressCountry: "United States",
        },
      },
      organizer: { "@type": "Organization", name: "Example organizers" },
      url: "https://example.org/days/",
      description: "A one-day community event.",
    });
  });

  it("puts an online event at its page and a hybrid one in both places", () => {
    const [online] = graphOf([{ ...base, format: "virtual", venue: "Online", country: "India" }]);
    expect(online).toMatchObject({
      eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
      location: { "@type": "VirtualLocation", url: "https://example.org/days/" },
    });
    const [hybrid] = graphOf([{ ...base, format: "hybrid", venue: "", endDate: "2026-11-17" }]);
    expect(hybrid).toMatchObject({
      endDate: "2026-11-17",
      eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
      location: [
        {
          "@type": "Place",
          address: { addressLocality: "Chicago", addressCountry: "United States" },
        },
        { "@type": "VirtualLocation", url: "https://example.org/days/" },
      ],
    });
    expect((hybrid!.location as Node[])[0]).not.toHaveProperty("name");
    /* A hybrid event with no place named yet is online only, in its markup. */
    const [unplaced] = graphOf([{ ...base, format: "hybrid", venue: "", city: "", country: "" }]);
    expect(unplaced!.location).toEqual({
      "@type": "VirtualLocation",
      url: "https://example.org/days/",
    });
  });

  it("leaves out a month-only event: a month is not a start date", () => {
    expect(graphOf([{ ...base, startDate: "2027-04", dateStatus: "announced month" }])).toEqual([]);
  });

  it("covers every event shown at build with its days known, in order, linking only to its page", () => {
    const shown = upcoming(events, "2026-10-19");
    const graph = graphOf(shown);
    const dated = shown.filter((event) => event.startDate.length === 10);
    expect(graph.map((node) => node.name)).toEqual(dated.map((event) => event.name));
    expect(graph.length).toBeLessThan(shown.length);
    for (const [i, node] of graph.entries()) {
      expect(node.url).toBe(dated[i]!.officialUrl);
      expect(node.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(node.endDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("carries no offer and no price", () => {
    const json = JSON.stringify(eventsStructuredData(upcoming(events, "2026-10-19")));
    expect(json).not.toMatch(/"offers"|"price|priceCurrency/);
    expect(json).not.toMatch(/[$€£₹¥]|\b(USD|EUR|GBP|INR|JPY|CHF|SGD|AUD|CAD)\b/);
  });
});
