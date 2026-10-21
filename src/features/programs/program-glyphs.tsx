import type { JSX, ReactNode } from "react";

/**
 * The glyphs the three program pages (and /marketplaces) draw that no shared component draws with a class of their own: the tick of What
 * you get, the package, the envelope, and the arrow between How it will work's cards. Each is `aria-hidden` (a name
 * is always set in text beside it) and paints in `currentColor`; its size comes from the surface's rule (`.dt-ic`,
 * `.cp-own`, `.cp-ar svg`). The pages' other glyphs are the site's (`assessment-marks`,
 * `brand-assets-glyphs`, `document-glyphs`, `@/components/brand`, `Arrow`).
 */

interface GlyphProps {
  readonly className?: string;
}

/** A 24-unit line glyph at the given stroke. */
function Line({
  className,
  width,
  children,
}: GlyphProps & { readonly width: number; readonly children: ReactNode }): JSX.Element {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/** A tick: "Free on non-production". */
export const CheckGlyph = ({ className }: GlyphProps): JSX.Element => (
  <Line className={className} width={2.3}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Line>
);

/** A box, its lid's edges drawn: a package (the Helm chart, the marketplaces). */
export const PackageGlyph = ({ className }: GlyphProps): JSX.Element => (
  <Line className={className} width={1.7}>
    <path d="M12 3.2 4.2 7.1v9.8L12 20.8l7.8-3.9V7.1z" />
    <path d="M4.2 7.1 12 11l7.8-3.9M12 11v9.8" />
  </Line>
);

/** The arrow between two of How it will work's cards, at a lighter stroke than a link's. */
export const ChainArrow = (): JSX.Element => (
  <Line width={2}>
    <path d="M5 12h14M13 5l7 7-7 7" />
  </Line>
);

/** An envelope: a ready email. A 16-unit drawing. */
export function MailGlyph({ className }: GlyphProps): JSX.Element {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="3.5" width="12" height="9" rx="1.5" />
      <path d="m2.5 4.5 5.5 4 5.5-4" />
    </svg>
  );
}
