import { ExternalArrow } from "@/components/primitives/external-arrow";
import { eventsPage, type EventEntry } from "@/content/events";
import { ChevronGlyph, PinGlyph } from "@/features/events/event-glyphs";
import {
  banner,
  cityTile,
  details,
  place,
  split,
  topicLabel,
  when,
} from "@/features/events/event-facts";
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
  /** The dark button on the "Next up" panel. */
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

/* The banner's box on a card and on "Next up", with a picture, with a logo and with the city instead. */
const boxes = {
  card: { picture: "evc-ban", logo: "evc-ban is-logo", plain: "evc-ban is-plain" },
  next: { picture: "ev-next-ban", logo: "ev-next-ban is-logo", plain: "ev-next-ban is-plain" },
} as const;

/**
 * The event's banner: its own picture (a banner filling the box, or a logo whole on white), or, with none, its city
 * over its country. The picture's `alt` is empty and the city's box is `aria-hidden`: the name and the place are
 * set in text below. `children` is the card's date tile, set over the top left.
 */
function Banner({
  event,
  box,
  children,
}: {
  readonly event: EventEntry;
  readonly box: keyof typeof boxes;
  readonly children?: React.ReactNode;
}): React.JSX.Element {
  const image = banner(event);
  if (image)
    return (
      <div className={image.logo ? boxes[box].logo : boxes[box].picture}>
        {/* eslint-disable-next-line @next/next/no-img-element -- the sheet owns this box (`.evc-ban img`), as the mock's. */}
        <img src={image.src} alt="" loading="lazy" decoding="async" />
        {children}
      </div>
    );
  const tile = cityTile(event);
  return (
    <div className={boxes[box].plain} aria-hidden="true">
      <span className="evb-c">{tile.city}</span>
      <span className="evb-s">{tile.country}</span>
      {children}
    </div>
  );
}

/**
 * A card: the banner with the date tile over it, then the topic's tag, the name, the place, the description's first
 * sentence, the Details (opened in place, a native disclosure) and the link. `hidden` while it is out of view.
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
      <Banner event={event} box="card">
        <div className="ev-date" aria-hidden="true">
          <b>{day}</b>
          <span>{month}</span>
        </div>
      </Banner>
      <div className="evc-b">
        <span className="ev-tag">{topicLabel(event)}</span>
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
      </div>
    </li>
  );
}

/** "Next up": the first event with its days known, its description's first sentence and its banner beside them. */
export function NextUp({ event }: { readonly event: EventEntry }): React.JSX.Element {
  return (
    <section className="ev-next" aria-labelledby="next-h">
      <div className="ev-next-in">
        <p className="ev-eyebrow">{next.eyebrow}</p>
        <h2 id="next-h">{event.name}</h2>
        <p className="ev-next-when">
          {when(event).text} · {place(event)}
        </p>
        <p className="ev-next-d">{split(event.description)[0]}</p>
        <EventLink event={event} large />
      </div>
      <Banner event={event} box="next" />
    </section>
  );
}
