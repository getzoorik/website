import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/config/site";
import { pageStructuredData } from "@/config/structured-data";
import { events, eventsPage } from "@/content/events";
import { documentMetadata } from "@/features/documents/document-page";
import { dayOf, upcoming } from "@/features/events/event-facts";
import { EventsPage } from "@/features/events/events-page";
import { eventsStructuredData } from "@/features/events/events-structured-data";

import "@/styles/events.css";

/**
 * `/events`: events on cloud cost, FinOps, Kubernetes, open source and block storage. Indexed, listed in the sitemap,
 * and prerendered at build like every page here; linked from the footer's Resources column, after Case studies.
 *
 * 🔴 THE BUILD'S DAY TRIMS THE LIST. Prerendering runs this once, at build: events that had ended by then are left
 * out of the page and its markup, and the reader's browser hides what has ended since (`EventsList`). Two blocks
 * of structured data: the page's own, then its events (`eventsStructuredData`).
 */
export const metadata: Metadata = documentMetadata(routes.events, eventsPage.meta);

export default function Events(): React.JSX.Element {
  const buildDay = dayOf(new Date());
  const listed = upcoming(events, buildDay);
  return (
    <>
      <JsonLd data={pageStructuredData(routes.events)} />
      <JsonLd data={eventsStructuredData(listed)} />
      <EventsPage events={listed} buildDay={buildDay} />
    </>
  );
}
