const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

/**
 * The ISO day ("2026-10-09") a page's printed date names: "Updated 9 October
 * 2026", "Effective 6 October 2026 · Version 1.0" or "12 October 2026".
 *
 * The page's own line is the one source, so the sitemap and the structured
 * data can never print a date the page does not. A line it cannot read, or a
 * day that does not exist, throws at build: never a guess, and never the
 * build's own date.
 */
export function isoDay(printed: string): string {
  const match = /\b(\d{1,2}) ([A-Z][a-z]+) (\d{4})\b/.exec(printed);
  const month = MONTHS.indexOf((match?.[2] ?? "") as (typeof MONTHS)[number]);
  if (!match || month < 0) throw new Error(`No day in "${printed}"`);

  const day = new Date(Date.UTC(Number(match[3]), month, Number(match[1])));
  if (day.getUTCDate() !== Number(match[1])) throw new Error(`No such day: "${printed}"`);
  return day.toISOString().slice(0, 10);
}

/** An ISO day's parts, or a throw for anything that is not a real day. */
function dayParts(iso: string): {
  readonly day: number;
  readonly month: number;
  readonly year: number;
} {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  const date = match ? new Date(`${iso}T00:00:00Z`) : null;
  if (!match || !date || Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== iso)
    throw new Error(`Not an ISO day: "${iso}"`);
  return { day: date.getUTCDate(), month: date.getUTCMonth(), year: date.getUTCFullYear() };
}

/** An ISO day as a page prints it in full: "2026-10-09" is "9 October 2026". */
export function printedDay(iso: string): string {
  const { day, month, year } = dayParts(iso);
  return `${day} ${MONTHS[month]} ${year}`;
}

/** An ISO day as a card prints it: "2026-10-09" is "9 Oct". */
export function shortDay(iso: string): string {
  const { day, month } = dayParts(iso);
  return `${day} ${MONTHS[month]!.slice(0, 3)}`;
}
