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
