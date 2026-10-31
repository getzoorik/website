import { site } from "@/config/site";
import type { EventEntry } from "@/content/events";

import { banner } from "./event-facts";

/**
 * /events's Event markup: one JSON-LD block, beside the page's own (`pageStructuredData`), with an Event per event
 * the page shows at build whose days are known.
 *
 * A month-only event ("April 2027, exact dates to be announced") is left out: an Event's `startDate` is a day,
 * and naming one the organizer has not would invent it.
 *
 * Built only from the list's own fields: the name, the days, how to attend (from its format), where (the venue,
 * city and country; the event's page for an online one; both for a hybrid one), the organizer (with its own site
 * where the list gives one, `organizerUrl`), the event's page and its description; and the event's own picture, the
 * banner its card shows (`banner`), where it has one. An event with no banner has no image, never a stand-in.
 * 🔴 NO offers OR price: the page shows tickets as a label only, and so does its markup.
 */

const schema = "https://schema.org/";

const attendance = {
  "in person": `${schema}OfflineEventAttendanceMode`,
  virtual: `${schema}OnlineEventAttendanceMode`,
  hybrid: `${schema}MixedEventAttendanceMode`,
} as const satisfies Record<EventEntry["format"], string>;

/** Where it happens: a Place with what the list knows of it, its page as a VirtualLocation, or both. */
function location(
  event: EventEntry,
): Record<string, unknown> | Record<string, unknown>[] | undefined {
  const online = { "@type": "VirtualLocation", url: event.officialUrl };
  if (event.format === "virtual") return online;

  const address = {
    ...(event.city ? { addressLocality: event.city } : {}),
    ...(event.country ? { addressCountry: event.country } : {}),
  };
  const known = event.venue || Object.keys(address).length > 0;
  const place = known
    ? {
        "@type": "Place",
        ...(event.venue ? { name: event.venue } : {}),
        ...(Object.keys(address).length > 0
          ? { address: { "@type": "PostalAddress", ...address } }
          : {}),
      }
    : undefined;

  if (event.format === "hybrid") return place ? [place, online] : online;
  return place;
}

function eventNode(event: EventEntry): Record<string, unknown> {
  const where = location(event);
  const picture = banner(event);
  return {
    "@type": "Event",
    name: event.name,
    startDate: event.startDate,
    endDate: event.endDate || event.startDate,
    eventStatus: `${schema}EventScheduled`,
    eventAttendanceMode: attendance[event.format],
    ...(where ? { location: where } : {}),
    ...(picture ? { image: [`${site.url}${picture.src}`] } : {}),
    organizer: {
      "@type": "Organization",
      name: event.organizer,
      ...(event.organizerUrl ? { url: event.organizerUrl } : {}),
    },
    url: event.officialUrl,
    description: event.description,
  };
}

/** The block: the events with their days known, in the page's order. */
export function eventsStructuredData(events: readonly EventEntry[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": events.filter((event) => event.startDate.length === 10).map(eventNode),
  };
}
