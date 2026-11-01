import { existsSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { events, type EventEntry } from "@/content/events";

import { banner, slug, upcoming } from "./event-facts";
import { eventsStructuredData } from "./events-structured-data";

/**
 * /events's Event markup: one Event per event shown at build whose days are known, built from the list's fields
 * alone, with the banner its card shows as its image, and no offers and no price.
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

  it("gives an event the banner its card shows as its image, and none without one", () => {
    const pictured = events.find((event) => banner(event))!;
    const [node] = graphOf([{ ...pictured, startDate: "2026-11-16", endDate: "" }]);
    expect(node!.image).toEqual([`https://zoorik.com/event-banners/${slug(pictured)}.webp`]);
    expect(graphOf([base])[0]).not.toHaveProperty("image");
  });

  it("names the organizer's own site only where the list gives it", () => {
    const [node] = graphOf([{ ...base, organizerUrl: "https://example.org" }]);
    expect(node!.organizer).toEqual({
      "@type": "Organization",
      name: "Example organizers",
      url: "https://example.org",
    });
    expect(graphOf([base])[0]!.organizer).toEqual({
      "@type": "Organization",
      name: "Example organizers",
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
      const event = dated[i]!;
      expect(node.url).toBe(event.officialUrl);
      expect(node.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(node.endDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      /* Its image is its card's own banner, a file the site serves; an event with none has no image. */
      const picture = banner(event);
      if (picture) {
        expect(node.image, event.name).toEqual([`https://zoorik.com${picture.src}`]);
        expect(existsSync(`public${picture.src}`), event.name).toBe(true);
      } else {
        expect(node, event.name).not.toHaveProperty("image");
      }
    }
    expect(graph.filter((node) => node.image).length).toBeGreaterThan(0);
  });

  it("gives every event its organizer's own site, never a sign-in or event-detail page", () => {
    for (const event of events) {
      const site = new URL(event.organizerUrl!);
      expect(site.protocol, event.name).toBe("https:");
      expect(site.search + site.hash, event.name).toBe("");
      expect(site.pathname, event.name).not.toMatch(/login|sign-?in|register|events\/details/i);
    }
    const kcds = events.filter((event) =>
      event.organizerUrl!.startsWith("https://community2.cncf.io/"),
    );
    for (const event of kcds)
      expect(event.organizerUrl, event.name).toMatch(
        /^https:\/\/community2\.cncf\.io\/kcd-[a-z-]+\/$/,
      );
    for (const event of upcoming(events, "2026-10-19").filter(
      (event) => event.startDate.length === 10,
    ))
      expect(graphOf([event])[0]!.organizer, event.name).toHaveProperty("url", event.organizerUrl);
  });

  it("carries no offer and no price", () => {
    const json = JSON.stringify(eventsStructuredData(upcoming(events, "2026-10-19")));
    expect(json).not.toMatch(/"offers"|"price|priceCurrency/);
    expect(json).not.toMatch(/[$€£₹¥]|\b(USD|EUR|GBP|INR|JPY|CHF|SGD|AUD|CAD)\b/);
  });
});
