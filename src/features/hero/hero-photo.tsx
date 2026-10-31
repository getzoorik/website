"use client";

import { useState } from "react";

import { heroPhotoAlt } from "@/content/hero";

/**
 * The hero photograph — decorative, and it removes itself if it fails.
 *
 * Decorative to a screen reader (`aria-hidden`), but with alt text for search
 * engines (`heroPhotoAlt`), which count an empty alt as missing.
 *
 * ─── WHY THIS IS A CLIENT COMPONENT ────────────────────────────────────────
 * Only for `onError`. The mock's `onerror="this.remove()"` is a real design
 * decision rather than tidiness: the hero's scrims and its white type are
 * authored against `--ground`, so a broken frame must leave the ground alone
 * rather than sit in it as a placeholder box. That handler is DOM state, so it
 * is an island of its own and the rest of the hero stays on the server.
 *
 * ─── THE FILE ──────────────────────────────────────────────────────────────
 * A WebP its page imports (`hero-racks-graded.webp`), so its URL is a
 * content-hashed `/_next/static/media/…` file cached for a year; this
 * component takes only the strings. Graded from the source frame
 * `hero-racks.png`: the warm indicator lights are neutralised (old-brand
 * orange) and the blues nudged 9deg toward the accent's hue family.
 *
 * A plain <img>, not next/image: the page's own sheet owns the box outright,
 * and next/image would wrap it and impose its own positioning, which is the
 * one thing that must not be reinterpreted here.
 *
 * ─── TWO SURFACES NOW: /login AND THE PER-CLOUD HEROES ─────────────────────
 * The product heroes drew this frame until each took its film (`HeroFilm`, 23
 * Oct 2026). /login draws it as `img.photo`, with the frame's own 1200×1200 and
 * no fetch priority (`login.html`): there it sits beside the chooser, not above
 * the fold's headline. The four per-cloud pages (`CloudPage`, 31 Oct 2026),
 * which have no film, draw it as `img.hero-photo` in their hero, fetched first.
 */

export interface HeroPhotoProps {
  readonly src: string;
  /** The page's own class for the frame: `photo` on the /login panel, `hero-photo` in a per-cloud hero. */
  readonly className: string;
  /** Fetched ahead of the page's other images; off on /login, beside the chooser. */
  readonly priority?: boolean;
  readonly width?: number;
  readonly height?: number;
}

export function HeroPhoto({
  src,
  className,
  priority = true,
  width,
  height,
}: HeroPhotoProps): React.JSX.Element | null {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- see the note above: the page's sheet owns this box.
    <img
      className={className}
      src={src}
      alt={heroPhotoAlt}
      aria-hidden="true"
      width={width}
      height={height}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
      onError={() => setFailed(true)}
    />
  );
}
