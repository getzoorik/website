import { eventTopics, eventsPage, type EventEntry, type EventPlace } from "@/content/events";

/**
 * What /events prints about an event, worked out from the list's fields as the mock does, so the page reads
 * exactly as the mock. Pure: the server's build and the reader's browser run the same code.
 *
 * Days are ISO strings ("2026-10-19"), compared as strings: a day sorts as its text does.
 */

const { months, short, monthOnly } = eventsPage.dates;
const { rows, place: placeCopy } = eventsPage;

/** A date's numbers: [year, month, day] for a day, [year, month] for a month-only date, [] for none. */
const parts = (iso: string): number[] => (iso ? iso.split("-").map(Number) : []);

/** The day a moment falls on where it is read: the reader's own today in a browser, the build's day on the server. */
export function dayOf(moment: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${moment.getFullYear()}-${pad(moment.getMonth() + 1)}-${pad(moment.getDate())}`;
}

/** An event's dates as the page draws them. */
export interface EventWhen {
  /** The tile's big line: "19–20", "9", or the month ("Apr") while only the month is known. */
  readonly day: string;
  /** The tile's small line: "Oct", "Nov–Dec", or the year while only the month is known. */
  readonly month: string;
  /** The dates in words: "19–20 October 2026", "April 2027, exact dates to be announced". */
  readonly text: string;
  /** The month group it sorts into: "2026-10". */
  readonly group: string;
  /** Its place in the date order: the start day, a month-only date after every day of its month. */
  readonly order: string;
}

export function when(event: EventEntry): EventWhen {
  const s = parts(event.startDate);
  const t = parts(event.endDate || event.startDate);
  const group = event.startDate.slice(0, 7);
  if (s.length === 3) {
    const [y, m, d] = s as [number, number, number];
    const [ty, tm, td] = t as [number, number, number];
    const full = t.length === 3;
    let day = `${d}`;
    let text = `${d} ${months[m - 1]} ${y}`;
    if (full && ty === y && tm === m && td !== d) {
      day = `${d}–${td}`;
      text = `${d}–${td} ${months[m - 1]} ${y}`;
    } else if (full && (ty !== y || tm !== m || td !== d)) {
      day = `${d}–${td}`;
      text = `${d} ${months[m - 1]} – ${td} ${months[tm - 1]} ${ty}`;
    }
    const month = full && tm !== m ? `${short[m - 1]}–${short[tm - 1]}` : short[m - 1]!;
    return { day, month, text, group, order: event.startDate };
  }
  const [y, m] = s as [number, number];
  return {
    day: short[m - 1]!,
    month: String(y),
    text: `${months[m - 1]} ${y}${monthOnly}`,
    group,
    order: `${group}-99`,
  };
}

/**
 * Whether an event is over on `today`: its last day (its start when it has no end) is before today. A month-only
 * date is over only once its whole month is: "2026-11" is not over on 30 November.
 */
export function ended(event: EventEntry, today: string): boolean {
  const last = event.endDate || event.startDate;
  return last.length === 7 ? last < today.slice(0, 7) : last < today;
}

/**
 * The events still to come on `today`, in the page's order: by date (a month-only one after the days of its
 * month), then by name, compared as the mock compares them (code unit by code unit, not by locale).
 */
export function upcoming(list: readonly EventEntry[], today: string): EventEntry[] {
  const compare = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);
  return list
    .filter((event) => !ended(event, today))
    .map((event) => ({ event, order: when(event).order }))
    .sort((a, b) => compare(a.order, b.order) || compare(a.event.name, b.event.name))
    .map(({ event }) => event);
}

/** Where the card's pin says it is: "Online", "Bengaluru, India", "Raleigh, United States and online". */
export function place(event: EventEntry): string {
  if (event.format === "virtual") return placeCopy.online;
  const named = [event.city, event.country].filter(Boolean).join(", ") || placeCopy.unknown;
  return named + (event.format === "hybrid" ? placeCopy.andOnline : "");
}

/** The Where filter's places it belongs to: in India, online (virtual or hybrid), both or neither. */
export function places(event: EventEntry): EventPlace[] {
  const found: EventPlace[] = [];
  if (event.country === "India") found.push("india");
  if (event.format === "virtual" || event.format === "hybrid") found.push("online");
  return found;
}

/** The topic's name, as its tag and its chip print it. */
export function topicLabel(event: EventEntry): string {
  return eventTopics.find((topic) => topic.id === event.topic)!.label;
}

/**
 * A description split after its first sentence: the card prints the first, the Details' About row the rest. A
 * sentence ends at ".", "!" or "?" followed by a space and a capital letter.
 */
export function split(description: string): readonly [string, string] {
  const match = /^([\s\S]+?[.!?])\s+(?=[A-Z])([\s\S]*)$/.exec(description);
  return match ? [match[1]!, match[2]!] : [description, ""];
}

/** One row of an event's Details: its label and its value. */
export interface EventRow {
  readonly label: string;
  readonly value: string;
}

/**
 * The Details rows: About (the description's rest, when it has one), Dates, Where (the venue first, unless the
 * event is online only), Format, Organizer, then Tickets (the label alone), Call for talks and Why go when the
 * list has them.
 */
export function details(event: EventEntry): EventRow[] {
  const rest = split(event.description)[1];
  const venue = event.venue && event.format !== "virtual" ? `${event.venue}, ` : "";
  const found: EventRow[] = [];
  if (rest) found.push({ label: rows.about, value: rest });
  found.push(
    { label: rows.dates, value: when(event).text },
    { label: rows.where, value: venue + place(event) },
    { label: rows.format, value: event.format.slice(0, 1).toUpperCase() + event.format.slice(1) },
    { label: rows.organizer, value: event.organizer },
  );
  if (event.tickets) found.push({ label: rows.tickets, value: event.tickets });
  if (event.cfp) found.push({ label: rows.cfp, value: event.cfp });
  if (event.whyItMatters) found.push({ label: rows.why, value: event.whyItMatters });
  return found;
}

/** A month group: its heading ("October 2026") and its events, in order. */
export interface EventMonth {
  readonly group: string;
  readonly title: string;
  readonly events: readonly EventEntry[];
}

/** The events by month, in order, each month once (the list is already in order). */
export function byMonth(list: readonly EventEntry[]): EventMonth[] {
  const out: { group: string; title: string; events: EventEntry[] }[] = [];
  for (const event of list) {
    const { group } = when(event);
    if (out.at(-1)?.group !== group) {
      const [y, m] = parts(group) as [number, number];
      out.push({ group, title: `${months[m - 1]} ${y}`, events: [] });
    }
    out.at(-1)!.events.push(event);
  }
  return out;
}

/** The first event in the list with its days known (a month-only one never leads), or none. */
export function nextUp(list: readonly EventEntry[]): EventEntry | undefined {
  return list.find((event) => event.startDate.length === 10);
}
