import type { JSX } from "react";

/**
 * The glyphs the assessment page draws, verbatim from the mock's sprite (`#i-tick`, `#i-copy`, `#i-mail`,
 * `#i-eye`, `#i-play`, `#i-send`, `#i-shield`, `#i-down`), and the mark on What
 * it does' card: GitHub's (Simple Icons, CC0). Each
 * paints in `currentColor` and is `aria-hidden`: every one sits beside a text
 * label, or inside a control that names itself. The documents' wells draw the same tick and copy glyphs.
 *
 * The product and cloud marks and the new-tab arrow are NOT here; other pages
 * draw them too, so they come from `@/components/brand` and
 * `@/components/primitives/external-arrow`.
 */

interface GlyphProps {
  readonly className?: string;
}

/** A done step, a chosen card, a copied command. */
export function TickGlyph({ className }: GlyphProps): JSX.Element {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m3.5 8.3 2.9 2.9 6.1-6.4" />
    </svg>
  );
}

export function CopyGlyph({ className }: GlyphProps): JSX.Element {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}

export function MailGlyph(): JSX.Element {
  return (
    <svg
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

/** A 24-unit line glyph from the sprite, at the sprite's 1.7 stroke. */
function Line({
  className,
  children,
}: GlyphProps & { readonly children: React.ReactNode }): JSX.Element {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const EyeGlyph = ({ className }: GlyphProps): JSX.Element => (
  <Line className={className}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
    <circle cx="12" cy="12" r="3" />
  </Line>
);

export const PlayGlyph = ({ className }: GlyphProps): JSX.Element => (
  <Line className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M10 8.8v6.4l5-3.2z" />
  </Line>
);

export const SendGlyph = ({ className }: GlyphProps): JSX.Element => (
  <Line className={className}>
    <path d="M21 3.5 10.5 14M21 3.5 14.5 21l-4-7-7-4z" />
  </Line>
);

export const ShieldGlyph = ({ className }: GlyphProps): JSX.Element => (
  <Line className={className}>
    <path d="M12 3.5 5 6.2v5.3c0 4.4 3 7.6 7 9 4-1.4 7-4.6 7-9V6.2z" />
    <path d="m9 12 2.2 2.2L15.5 10" />
  </Line>
);

/** The sprite's `#i-down`, at its own 2 stroke. */
export function DownGlyph({ className }: GlyphProps): JSX.Element {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 4v11M7 10.5l5 5 5-5M5 20h14" />
    </svg>
  );
}

/** GitHub's mark (Simple Icons, CC0), as the mock's card draws it. */
export function GitHubMark(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
      />
    </svg>
  );
}
