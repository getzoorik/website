import { eventsListUpdated, eventsPage, type EventEntry } from "@/content/events";
import { DocumentPage } from "@/features/documents/document-page";
import { EventsList } from "@/features/events/events-list";

/**
 * `/events`: the utility hero,
 * then the search, the filters, "Next up" with its banner, the first nine events by month and "More events"
 * (`EventsList`, the page's island), then where the dates come from. No closing assessment row: the mock draws
 * none, so the page ends on its list and the footer.
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
          <EveryEventWithoutScripting />
        </div>
      </div>
    </DocumentPage>
  );
}

/**
 * ─── EVERY EVENT WITHOUT SCRIPTING ─────────────────────────────────────────
 * The prerendered list shows the first nine events and hides the rest until "More events", which is right while the
 * island runs and wrong when it never will. This style shows every card and month then, and takes away the search,
 * the filters and "More events", which need the script to work.
 *
 * Its two `display` rules sit in the `base` layer beside Tailwind's preflight, whose `[hidden]{display:none
 * !important}` they must beat: an important rule in a layer wins over every important rule outside one, so only a
 * more specific one in the same layer can.
 */
const EVERY_EVENT =
  "<style>@layer base{.evc-grid>.evc[hidden]{display:flex!important}.evc-sec[hidden]{display:block!important}}" +
  ".ev-find,.ev-filters,.ev-morebtn{display:none}</style>";

function EveryEventWithoutScripting(): React.JSX.Element {
  return <noscript dangerouslySetInnerHTML={{ __html: EVERY_EVENT }} />;
}
