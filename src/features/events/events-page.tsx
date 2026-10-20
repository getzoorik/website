import { eventsListUpdated, eventsPage, type EventEntry } from "@/content/events";
import { DocumentPage } from "@/features/documents/document-page";
import { EventsList } from "@/features/events/events-list";

/**
 * `/events`: the utility hero,
 * then the filters, "Next up" on the navy panel and a card per event by month (`EventsList`, the page's island),
 * then where the dates come from. No closing assessment row: the mock draws none, so the page ends on its list
 * and the footer.
 */
export function EventsPage({
  events,
  buildDay,
}: {
  /** The events still to come on the build's day, in order. */
  readonly events: readonly EventEntry[];
  readonly buildDay: string;
}): React.JSX.Element {
  return (
    <DocumentPage
      hero={{ title: eventsPage.hero.title, deck: eventsPage.hero.deck(eventsListUpdated) }}
      assessmentRow={false}
    >
      <div className="sec doc-body">
        <div className="wrap">
          <EventsList events={events} buildDay={buildDay} />
          <p className="ev-src">{eventsPage.source}</p>
        </div>
      </div>
    </DocumentPage>
  );
}
