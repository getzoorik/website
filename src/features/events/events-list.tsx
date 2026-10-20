"use client";

import { useState, useSyncExternalStore } from "react";

import { eventTopics, eventsPage, type EventEntry, type EventPlace } from "@/content/events";
import { EventCard, NextUp } from "@/features/events/event-card";
import { byMonth, dayOf, ended, nextUp, places } from "@/features/events/event-facts";

/**
 * /events's list (the mock's filters, "Next up" and month groups, and its script): the page's one island.
 *
 * ─── PAST EVENTS ARE NOT SHOWN ─────────────────────────────────────────────
 * The page is prerendered, so the server leaves out what had ended on the build's day (`buildDay`), and the
 * reader's browser then hides what has ended since, by the reader's own today. Everything that depends on the list
 * follows it: "Next up", the month groups and their headings, the count and the empty state. The first render
 * uses the build's day, so it matches the prerendered HTML; the reader's day replaces it straight after.
 *
 * ─── THE FILTERS ───────────────────────────────────────────────────────────
 * As the mock's script: one Topic and one Where at a time, each chip a toggle button (`aria-pressed`), "All" and
 * "Everywhere" pressed at first. A card the filters leave out is `hidden`, not removed, so an open Details stays
 * open; a month with no card left is hidden with it. The count says how many are left (`aria-live`), and with
 * none, "Show all events" sets both filters back. "Next up" does not follow the filters. Nothing is stored (the
 * privacy policy: the site's code uses no browser storage).
 */

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
  const [topic, setTopic] = useState("");
  const [where, setWhere] = useState<EventPlace | "">("");
  const { filters } = eventsPage;

  const shown = today > buildDay ? events.filter((event) => !ended(event, today)) : events;
  const matches = (event: EventEntry) =>
    (!topic || event.topic === topic) && (!where || places(event).includes(where));
  const count = shown.filter(matches).length;
  const lead = nextUp(shown);

  return (
    <>
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
        <button
          type="button"
          className="ev-reset"
          onClick={() => {
            setTopic("");
            setWhere("");
          }}
        >
          {filters.reset}
        </button>
      </p>
      {lead ? <NextUp event={lead} /> : null}
      {byMonth(shown).map((month, i) => (
        <section
          className="evc-sec"
          aria-labelledby={`m${i}`}
          hidden={!month.events.some(matches)}
          key={month.group}
        >
          <h2 id={`m${i}`}>{month.title}</h2>
          <ol className="evc-grid">
            {month.events.map((event) => (
              <EventCard
                event={event}
                hidden={!matches(event)}
                key={`${event.startDate} ${event.name}`}
              />
            ))}
          </ol>
        </section>
      ))}
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
