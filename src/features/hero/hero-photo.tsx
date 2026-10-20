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
 * A WebP the heroes import (`hero-image.ts`, with a 960 px copy for a 1x
 * screen), so each URL is a content-hashed `/_next/static/media/…` file cached
 * for a year; this component takes only the strings. Graded from the source
 * frame `hero-racks.png`: the warm indicator lights are neutralised (old-brand
 * orange) and the blues nudged 9deg toward the accent's hue family. It is
 * mirrored in CSS so the frame's empty right third falls under the headline.
 *
 * A plain <img>, not next/image: `.hero-photo` in the ported sheet owns the
 * box outright — `width:min(70%,1160px)`, a negative z-index and `scaleX(-1)`
 * — and next/image would wrap it and impose its own positioning, which is the
 * one thing that must not be reinterpreted here.
 *
 * ─── THE /login PANEL DRAWS THE SAME FRAME ─────────────────────────────────
 * As `img.photo`, with the frame's own 1200×1200 and no fetch priority
 * (`login.html`): there it sits beside the chooser, not above the fold's
 * headline. The heroes keep the defaults.
 */

export interface HeroPhotoProps {
  readonly src: string;
  /** The heroes' widths and the width the photo is drawn at; none on /login. */
  readonly srcSet?: string;
  readonly sizes?: string;
  /** `hero-photo` in a hero (the default), `photo` on the /login panel. */
  readonly className?: string;
  /** Fetched ahead of the page's other images: true in a hero, off on /login. */
  readonly priority?: boolean;
  readonly width?: number;
  readonly height?: number;
}

export function HeroPhoto({
  src,
  srcSet,
  sizes,
  className = "hero-photo",
  priority = true,
  width,
  height,
}: HeroPhotoProps): React.JSX.Element | null {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- see the note above: the ported sheet owns this box.
    <img
      className={className}
      src={src}
      srcSet={srcSet}
      sizes={sizes}
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
