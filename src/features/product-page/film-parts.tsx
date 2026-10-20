import type { JSX } from "react";

import type { ProductFilm } from "@/content/product-films";

/**
 * What the film band, its player and the hero's "Watch the 2-minute film" share:
 * the band's id, the film's minutes, a chapter's address and clock, YouTube's
 * player address, and the two glyphs. No directive: the server band and
 * the client player both use them.
 */

/** The band's id: the hero's second button is `#film`. */
export const FILM_ID = "film";

/** "2:05" → "2": the film's whole minutes, which name it ("the 2-minute film"). */
export function filmMinutes(film: ProductFilm): string {
  return film.length.slice(0, film.length.indexOf(":"));
}

/** The film at a second: YouTube's `t=<n>s`, after `&` when the
 *  address already has a query; the first chapter is the address itself. */
export function filmAt(url: string, seconds: number): string {
  if (seconds === 0) return url;
  return `${url}${url.includes("?") ? "&" : "?"}t=${seconds}s`;
}

/** 72 → "1:12", as a chapter prints its start. */
export function filmClock(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

/** The video's id from its YouTube address: `youtu.be/<id>` or `youtube.com/watch?v=<id>`. */
export function youtubeId(url: string): string {
  const address = new URL(url);
  const id =
    address.hostname === "youtu.be" ? address.pathname.slice(1) : address.searchParams.get("v");
  if (!id) throw new Error(`not a YouTube film address: ${url}`);
  return id;
}

/**
 * YouTube's player for the film, in its privacy-enhanced mode
 * (youtube-nocookie.com), playing at once from `start`: muted when the browser
 * would not yet let it play sound, with sound otherwise. Related films only
 * from the same channel. No YouTube captions (`cc_load_policy=0`): the films
 * carry their own on the picture. With the page's `origin`, the player takes
 * commands as messages (`enablejsapi`), which is how a muted film's sound is
 * turned on in place, and its captions kept off.
 */
export function youtubeEmbed(url: string, start: number, muted: boolean, origin?: string): string {
  const query = new URLSearchParams({
    autoplay: "1",
    playsinline: "1",
    rel: "0",
    cc_load_policy: "0",
  });
  if (muted) query.set("mute", "1");
  if (start > 0) query.set("start", String(start));
  if (origin) {
    query.set("enablejsapi", "1");
    query.set("origin", origin);
  }
  return `https://www.youtube-nocookie.com/embed/${youtubeId(url)}?${query}`;
}

/** The play glyph: the poster's play button and the hero's second button.
 *  Its ink is the surface's (`.pf-play svg`, `.hero-cta .pf-watch svg`). */
export function PlayGlyph(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5.6v12.8a1 1 0 0 0 1.52.85l10.3-6.4a1 1 0 0 0 0-1.7L9.52 4.75A1 1 0 0 0 8 5.6z" />
    </svg>
  );
}

/** A speaker with its sound waves: "Turn on sound", over a film that started muted. */
export function SoundGlyph(): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11 5 6 9H3v6h3l5 4V5z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
    </svg>
  );
}

/** The outward arrow, at its stroke of 2: the tag's arrow, not the site's `.ext`. */
export function OutGlyph(): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}
