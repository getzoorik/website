"use client";

import { useSyncExternalStore } from "react";

import { Arrow } from "@/components/primitives/arrow";
import type { EventEntry } from "@/content/events";
import { dayOf, ended, when } from "@/features/events/event-facts";

/**
 * /community's Events card (the mock's `cm-evs`): the next big events, each with its date tile, its name and its city,
 * then the link to /events.
 *
 * ─── PAST EVENTS ARE NOT SHOWN, AS ON /events ───────────────────────────────
 * The page is prerendered, so the server leaves out what had ended on the build's day, and the reader's browser then
 * drops what has ended since, by the reader's own today, with /events's own helpers (`EventsList`'s way). The first
 * render uses the build's day, so it matches the prerendered HTML. With nothing left, the card keeps its link.
 */

/* The reader's day changes only at midnight, and a page left open that long is not worth a timer. */
const noChange = () => () => {};
const readerDay = () => dayOf(new Date());

export function CommunityEvents({
  events,
  buildDay,
  count,
  all,
}: {
  /** The events the page follows still to come on the build's day, in order (more than `count`, so one can drop). */
  readonly events: readonly EventEntry[];
  /** The build's day ("2026-10-19"): the day the prerendered HTML was made on. */
  readonly buildDay: string;
  /** How many the card shows. */
  readonly count: number;
  /** The link to /events. */
  readonly all: { readonly label: string; readonly href: string };
}): React.JSX.Element {
  const today = useSyncExternalStore(noChange, readerDay, () => buildDay);
  const shown = (today > buildDay ? events.filter((event) => !ended(event, today)) : events).slice(
    0,
    count,
  );
  return (
    <div className="cm-evs">
      {shown.length ? (
        <ol>
          {shown.map((event) => {
            const { day, month } = when(event);
            return (
              <li key={event.name}>
                <span className="cm-date">
                  <b>{day}</b>
                  <span>{month}</span>
                </span>
                <span>
                  <b>{event.name}</b>
                  {/* The city and country alone, as the mock prints them (no "and online"). */}
                  <small>{[event.city, event.country].filter(Boolean).join(", ")}</small>
                </span>
              </li>
            );
          })}
        </ol>
      ) : null}
      <a className="cm-btn2 dark" href={all.href}>
        {all.label} <Arrow />
      </a>
    </div>
  );
}
