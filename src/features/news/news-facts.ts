import { newsPage, type RadarItem } from "@/content/news";

/**
 * What /news prints about a date, and which logo a Radar item's tile draws, as the mock picks them. Pure.
 */

/** "2026-10-17" → "17 October 2026": the latest announcement's day, and the Radar's week. */
export function newsDay(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number) as [number, number, number];
  return `${d} ${newsPage.months[m - 1]} ${y}`;
}

/** A tile's day: "2026-10-16" → "16 Oct". */
export function newsShortDay(iso: string): string {
  const [, m, d] = iso.split("-").map(Number) as [number, number, number];
  return `${d} ${newsPage.months[m - 1].slice(0, 3)}`;
}

/** The logos a Radar tile can draw: two files and the two cloud marks. */
export type RadarLogo = "karpenter" | "finops-foundation" | "aws" | "azure";

/** A Radar tile's icon: its source's logo where the site has one, else the first letter of the source's name. */
export type RadarMark = { readonly logo: RadarLogo } | { readonly monogram: string };

/* The words that name a cloud, checked in this order once no project matched. */
const CLOUDS: readonly (readonly [word: string, logo: "aws" | "azure"])[] = [
  ["aws", "aws"],
  ["amazon", "aws"],
  ["eks", "aws"],
  ["azure", "azure"],
  ["aks", "azure"],
];

/**
 * The logo for an item, read from its source's name and its address together, in lower case: Karpenter's first, then
 * the FinOps Foundation's (FOCUS is the Foundation's), then AWS's or Azure's; else a monogram, the source's first
 * letter with any "The " left out ("The New Stack" → "N").
 */
export function radarMark(item: Pick<RadarItem, "source" | "url">): RadarMark {
  const words = `${item.source} ${item.url}`.toLowerCase();
  if (words.includes("karpenter")) return { logo: "karpenter" };
  if (words.includes("finops") || words.includes("focus")) return { logo: "finops-foundation" };
  const cloud = CLOUDS.find(([word]) => words.includes(word));
  if (cloud) return { logo: cloud[1] };
  return { monogram: item.source.replace(/The /g, "").charAt(0) };
}
