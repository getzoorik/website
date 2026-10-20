import { ExternalArrow } from "@/components/primitives/external-arrow";
import { eventsPage, type EventEntry } from "@/content/events";
import { ChevronGlyph, PinGlyph } from "@/features/events/event-glyphs";
import { details, place, split, topicLabel, when } from "@/features/events/event-facts";
import { NEW_TAB_HINT, offSiteProps } from "@/lib/links";

/**
 * One event on /events: the card (the mock's `card()`), the "Next up" panel (`main()`'s `feat`) and the link both
 * end on (`out_link()`). Rendered inside the list's island (`EventsList`), which decides which events are shown.
 */

const { card: copy, next } = eventsPage;

/**
 * "Event page": the event's own page, and only that (`officialUrl`), in a new tab the site's way. A screen reader
 * hears whose page it is and that it opens a new tab.
 */
export function EventLink({
  event,
  large = false,
}: {
  readonly event: EventEntry;
  /** The light button on the navy "Next up" panel. */
  readonly large?: boolean;
}): React.JSX.Element {
  return (
    <a
      className={large ? "ev-out ev-out-lg" : "ev-out"}
      href={event.officialUrl}
      {...offSiteProps(event.officialUrl)}
    >
      {copy.link}
      <span className="sr-only">
        {copy.linkFor}
        {event.name}
        {NEW_TAB_HINT}
      </span>{" "}
      <ExternalArrow />
    </a>
  );
}

/**
 * A card: the date tile and the topic's tag, the name, the place, the description's first sentence, the Details
 * (opened in place, a native disclosure), then the link. `hidden` while the filters leave it out.
 */
export function EventCard({
  event,
  hidden,
}: {
  readonly event: EventEntry;
  readonly hidden: boolean;
}): React.JSX.Element {
  const { day, month } = when(event);
  return (
    <li className="evc" hidden={hidden}>
      <div className="evc-top">
        <div className="ev-date" aria-hidden="true">
          <b>{day}</b>
          <span>{month}</span>
        </div>
        <span className="ev-tag">{topicLabel(event)}</span>
      </div>
      <h3>{event.name}</h3>
      <p className="ev-meta">
        <PinGlyph />
        <span>{place(event)}</span>
      </p>
      <p className="ev-desc">{split(event.description)[0]}</p>
      <details className="ev-more">
        <summary>
          {copy.details} <ChevronGlyph />
        </summary>
        <dl className="ev-dl">
          {details(event).map((row) => (
            <div key={row.label}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
      </details>
      <div className="evc-foot">
        <EventLink event={event} />
      </div>
    </li>
  );
}

/** "Next up": the first event with its days known, on the navy panel, with its whole description. */
export function NextUp({ event }: { readonly event: EventEntry }): React.JSX.Element {
  return (
    <section className="ev-next" aria-labelledby="next-h">
      <div className="ev-next-in">
        <p className="ev-eyebrow">{next.eyebrow}</p>
        <h2 id="next-h">{event.name}</h2>
        <p className="ev-next-when">
          {when(event).text} · {place(event)}
        </p>
        <p className="ev-next-d">{event.description}</p>
        <EventLink event={event} large />
      </div>
    </section>
  );
}
