import { newsPage } from "@/content/news";

/**
 * What /news prints about a date, as the mock does. Pure.
 */

/** "2026-10-17" → "17 October 2026"; without its year (a Radar item), "17 October". */
export function newsDay(iso: string, year = true): string {
  const [y, m, d] = iso.split("-").map(Number) as [number, number, number];
  return `${d} ${newsPage.months[m - 1]}${year ? ` ${y}` : ""}`;
}
