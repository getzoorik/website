"use client";

import { useState, useSyncExternalStore } from "react";

import { eventTopics, eventsPage, type EventEntry, type EventPlace } from "@/content/events";
import { EventCard, NextUp } from "@/features/events/event-card";
import { SearchGlyph } from "@/features/events/event-glyphs";
import {
  byMonth,
  dayOf,
  ended,
  nextUp,
  places,
  searchText,
  yearMonth,
  years,
} from "@/features/events/event-facts";

/**
 * /events's list (the mock's search, filters, "Next up", month groups and "More events", and its script): the
 * page's one island.
 *
 * ─── PAST EVENTS ARE NOT SHOWN ─────────────────────────────────────────────
 * The page is prerendered, so the server leaves out what had ended on the build's day (`buildDay`), and the
 * reader's browser then hides what has ended since, by the reader's own today. Everything that depends on the list
 * follows it: "Next up", the first nine, the month groups and their headings, the Year menu, the count and the
 * empty state. The first render uses the build's day, so it matches the prerendered HTML; the reader's day
 * replaces it straight after.
 *
 * ─── THE FIRST NINE, THEN MORE EVENTS ──────────────────────────────────────
 * As the mock's script: with no search or filter, the first nine events show and "More events" shows the rest; a
 * month with none of them in view is hidden with its heading. A search, a menu or a chip reaches every event, so
 * "More events" goes while one is set, and once pressed it stays pressed. A card left out is `hidden`, not removed,
 * so an open Details stays open. Without scripting the page's `<noscript>` style shows every card (`EventsPage`).
 *
 * ─── THE SEARCH AND THE FILTERS ────────────────────────────────────────────
 * The search box matches its trimmed, lower-case words anywhere in an event's name, city, country, organizer,
 * topic and format; Year and Month match the event's month group. One Topic and one Where at a time, each chip a
 * toggle button (`aria-pressed`), "All" and "Everywhere" pressed at first. The count says how many events match,
 * shown or not (`aria-live`), and with none, "Show all events" clears the search, the menus and both chip rows.
 * "Next up" follows none of them. Nothing is stored (the privacy policy: the site's code uses no browser storage).
 */

/** How many events show before "More events", while no search or filter is set. */
export const FIRST_SHOWN = 9;

/* The reader's day changes only at midnight, and a page left open that long is not worth a timer. */
const noChange = () => () => {};
const readerDay = () => dayOf(new Date());

export interface EventsListProps {
  /** The events still to come on the build's day, in the page's order (`upcoming()`). */
  readonly events: readonly EventEntry[];
  /** The build's day ("2026-10-19"): the day the prerendered HTML was made on. */
  readonly buildDay: string;
}

export function EventsList({ events, buildDay }: EventsListProps): React.JSX.Element {
  const today = useSyncExternalStore(noChange, readerDay, () => buildDay);
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [topic, setTopic] = useState("");
  const [where, setWhere] = useState<EventPlace | "">("");
  const [opened, setOpened] = useState(false);
  const { find, filters } = eventsPage;

  const shown = today > buildDay ? events.filter((event) => !ended(event, today)) : events;
  const words = query.trim().toLowerCase();
  const filtered = Boolean(words || year || month || topic || where);
  const matches = (event: EventEntry) =>
    (!topic || event.topic === topic) &&
    (!where || places(event).includes(where)) &&
    (!year || yearMonth(event).year === year) &&
    (!month || yearMonth(event).month === month) &&
    (!words || searchText(event).includes(words));

  /* The mock's count: every match counts, and with nothing set only the first nine of them show. */
  const inView = new Set<EventEntry>();
  let count = 0;
  for (const event of shown) {
    if (!matches(event)) continue;
    if (filtered || opened || count < FIRST_SHOWN) inView.add(event);
    count++;
  }
  const lead = nextUp(shown);

  const reset = () => {
    setQuery("");
    setYear("");
    setMonth("");
    setTopic("");
    setWhere("");
  };

  return (
    <>
      <div className="ev-find">
        <label className="ev-search">
          <SearchGlyph />
          <span className="sr-only">{find.search}</span>
          <input
            type="search"
            placeholder={find.placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label className="ev-sel">
          <span className="sr-only">{find.year}</span>
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="">{find.anyYear}</option>
            {years(shown).map((y) => (
              <option value={y} key={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
        <label className="ev-sel">
          <span className="sr-only">{find.month}</span>
          <select value={month} onChange={(e) => setMonth(e.target.value)}>
            <option value="">{find.anyMonth}</option>
            {eventsPage.dates.months.map((name, i) => (
              <option value={String(i + 1)} key={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="ev-filters" role="group" aria-label={filters.label}>
        <div className="ev-fg">
          <span className="ev-fl" id="ev-t">
            {filters.topic}
          </span>
          <div className="ev-chips" role="group" aria-labelledby="ev-t">
            <Chip label={filters.allTopics} pressed={!topic} onPress={() => setTopic("")} />
            {eventTopics.map((entry) => (
              <Chip
                label={entry.label}
                pressed={topic === entry.id}
                onPress={() => setTopic(entry.id)}
                key={entry.id}
              />
            ))}
          </div>
        </div>
        <div className="ev-fg">
          <span className="ev-fl" id="ev-w">
            {filters.where}
          </span>
          <div className="ev-chips" role="group" aria-labelledby="ev-w">
            <Chip label={filters.everywhere} pressed={!where} onPress={() => setWhere("")} />
            {filters.places.map((entry) => (
              <Chip
                label={entry.label}
                pressed={where === entry.id}
                onPress={() => setWhere(entry.id)}
                key={entry.id}
              />
            ))}
          </div>
        </div>
        <p className="ev-count" aria-live="polite">
          {filters.count(count)}
        </p>
      </div>
      <p className="ev-empty" hidden={count > 0}>
        {filters.empty}{" "}
        <button type="button" className="ev-reset" onClick={reset}>
          {filters.reset}
        </button>
      </p>
      {lead ? <NextUp event={lead} /> : null}
      {byMonth(shown).map((group, i) => (
        <section
          className="evc-sec"
          aria-labelledby={`m${i}`}
          hidden={!group.events.some((event) => inView.has(event))}
          key={group.group}
        >
          <h2 id={`m${i}`}>{group.title}</h2>
          <ol className="evc-grid">
            {group.events.map((event) => (
              <EventCard
                event={event}
                hidden={!inView.has(event)}
                key={`${event.startDate} ${event.name}`}
              />
            ))}
          </ol>
        </section>
      ))}
      <div className="ev-morebtn" hidden={filtered || opened || count <= FIRST_SHOWN}>
        <button type="button" onClick={() => setOpened(true)}>
          {eventsPage.more}
        </button>
      </div>
    </>
  );
}

/** A filter chip: a toggle button, pressed while its topic or place is the chosen one. */
function Chip({
  label,
  pressed,
  onPress,
}: {
  readonly label: string;
  readonly pressed: boolean;
  readonly onPress: () => void;
}): React.JSX.Element {
  return (
    <button type="button" aria-pressed={pressed} onClick={onPress}>
      {label}
    </button>
  );
}
