import type { JSX } from "react";

import type { FooterSocialPlatform } from "@/content/footer";

/**
 * The social glyphs, inline and verbatim from the mock: LinkedIn, YouTube, X,
 * Reddit, Medium and GitHub.
 *
 * The marks in the "Built for" badge are NOT here: Azure and AWS are drawn on
 * other surfaces too, so they live in `@/components/brand/cloud-marks` where
 * every surface reads one copy.
 *
 * Inline SVG rather than <img>, for the mock's two reasons: each glyph paints
 * in `currentColor`, so it follows the ink `.soc` gives its tile (muted, then
 * `--text` on hover), and none of them costs a request. Drawn in the page's own
 * ink rather than as brand-coloured logos: no platform's colour is a Zoorik
 * palette entry. Every one is `aria-hidden`; the link around it carries the
 * name.
 *
 * Keyed by platform, a Record rather than a switch, so a new
 * `FooterSocialPlatform` is a compile error here instead of a tile that
 * silently renders empty.
 */
const socialMarks: Record<FooterSocialPlatform, JSX.Element> = {
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1-.02 5.001A2.5 2.5 0 0 1 4.98 3.5zM3.06 9.75h3.84V21H3.06V9.75zm6.24 0h3.68v1.54h.05c.51-.94 1.77-1.93 3.64-1.93 3.89 0 4.61 2.5 4.61 5.74V21h-3.84v-5.13c0-1.22-.02-2.8-1.74-2.8-1.75 0-2.01 1.33-2.01 2.71V21H9.3V9.75z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.5 6.2a3 3 0 0 0-2.11-2.12C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.39.58A3 3 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 5.8 3 3 0 0 0 2.11 2.12C4.5 20.5 12 20.5 12 20.5s7.5 0 9.39-.58a3 3 0 0 0 2.11-2.12A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-5.8zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.53 3h2.94l-6.42 7.34L21.6 21h-5.9l-4.63-6.05L5.77 21H2.83l6.87-7.85L2.4 3h6.05l4.18 5.53L17.53 3zm-1.03 16.24h1.63L7.6 4.68H5.85l10.65 14.56z" />
    </svg>
  ),
  /* 🔴 THE EYES AND THE MOUTH ARE CUT OUT BY PAINT, NOT BY A HOLE. They are
     drawn over the head in `--surface`, the tile's own ground, through an
     inline style as the mock writes it: a `fill` attribute cannot take a
     custom property, so `fill="var(--surface)"` would paint them black. */
  reddit: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 8.4l1.2-4.8 4.4 1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="18.2" cy="4.8" r="1.7" fill="currentColor" />
      <circle cx="4.3" cy="11.6" r="2.2" fill="currentColor" />
      <circle cx="19.7" cy="11.6" r="2.2" fill="currentColor" />
      <ellipse cx="12" cy="14.6" rx="8.4" ry="6" fill="currentColor" />
      <circle cx="8.9" cy="13.6" r="1.3" style={{ fill: "var(--surface)" }} />
      <circle cx="15.1" cy="13.6" r="1.3" style={{ fill: "var(--surface)" }} />
      <path
        d="M8.8 16.9c1.9 1.3 4.5 1.3 6.4 0"
        fill="none"
        style={{ stroke: "var(--surface)" }}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  ),
  medium: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <ellipse cx="6.8" cy="12" rx="6.8" ry="6.9" />
      <ellipse cx="17.4" cy="12" rx="3.4" ry="6.5" />
      <ellipse cx="22.4" cy="12" rx="1.2" ry="5.8" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.08 0 4.41-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  ),
};

export function SocialMark({ platform }: { platform: FooterSocialPlatform }): JSX.Element {
  return socialMarks[platform];
}
