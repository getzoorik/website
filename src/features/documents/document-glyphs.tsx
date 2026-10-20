import type { JSX } from "react";

/**
 * The documents section's glyphs, drawn as the mocks' symbols draw them (the
 * document, the download, the chevron, the forward arrow and Back to top's up
 * arrow; the callout has no glyph). Each is `aria-hidden`: a name is always set
 * in text beside it. Size and colour come from the surface's rule (`.dl-r svg`,
 * `.fq-chev`, `.dt-ic`, `.alink svg`).
 *
 * The copy and tick glyphs of the command wells are the assessment page's own
 * (`assessment-marks.tsx`), so the two wells cannot drift apart.
 */

export interface GlyphProps {
  readonly className?: string;
}

const line = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** A page with a folded corner: a document. */
export function DocGlyph({ className }: GlyphProps): JSX.Element {
  return (
    <svg className={className} viewBox="0 0 24 24" {...line} strokeWidth={1.6} aria-hidden="true">
      <path d="M6 2.8h8l4.2 4.2V20a1.2 1.2 0 0 1-1.2 1.2H6A1.2 1.2 0 0 1 4.8 20V4A1.2 1.2 0 0 1 6 2.8z" />
      <path d="M14 2.8V7h4.2" />
    </svg>
  );
}

/** An arrow into a tray: download. */
export function DownloadGlyph({ className }: GlyphProps): JSX.Element {
  return (
    <svg className={className} viewBox="0 0 24 24" {...line} strokeWidth={2} aria-hidden="true">
      <path d="M12 4v11M7 10.5l5 5 5-5M5 20h14" />
    </svg>
  );
}

/** The chevron of a fold, a question and the folded contents; it turns 180° when open. */
export function ChevronGlyph({ className }: GlyphProps): JSX.Element {
  return (
    <svg className={className} viewBox="0 0 24 24" {...line} strokeWidth={2} aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

/** The arrow a link ends on. The cards draw it at 2.5, the row's tiles at 2.2. */
export function ArrowGlyph({
  className,
  weight = 2.5,
}: GlyphProps & { readonly weight?: 2.2 | 2.5 }): JSX.Element {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      {...line}
      strokeWidth={weight}
      aria-hidden="true"
    >
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

/** A link's arrow out of the site, up and to the right: the tiles' sign for a page that opens in a new tab. */
export function ArrowOutGlyph({ className }: GlyphProps): JSX.Element {
  return (
    <svg className={className} viewBox="0 0 24 24" {...line} strokeWidth={2.2} aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

/** Back to top's arrow, at the mocks' stroke (2.2). */
export function UpGlyph({ className }: GlyphProps): JSX.Element {
  return (
    <svg className={className} viewBox="0 0 24 24" {...line} strokeWidth={2.2} aria-hidden="true">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}
